import type {
  BookabilityReason,
  BookabilityStatus,
  ContainerWithPendingCount,
  PublicScheduleContainer,
  RouteQuality,
  ScheduleLifecycleState,
  SharedContainer,
} from "@/lib/types/shared-shipping";
import { extractCountryCode, isUSLocation } from "@/lib/shared-shipping-route";

export const SCHEDULE_TIME_ZONE = "America/Chicago";

export type BookingRejectionCode =
  | "CONTAINER_FULL"
  | "CONTAINER_DEPARTED"
  | "CONTAINER_UNAVAILABLE"
  | "CONTAINER_MISMATCH";

export interface BookingDecision {
  ok: boolean;
  shippingState: ScheduleLifecycleState;
  bookabilityStatus: BookabilityStatus;
  bookabilityReason: BookabilityReason;
  rejectionCode: BookingRejectionCode | null;
}

export interface RouteNormalizationResult {
  originDisplay: string;
  destinationDisplay: string;
  countryCode: string | null;
  countryDisplay: string | null;
  isDestinationPending: boolean;
  routeQuality: RouteQuality;
  routeFallbackReason: string | null;
}

const MULTI_PICKUP_LABEL = "Multiple US pickup locations";
const PENDING_DESTINATION_LABEL = "Destination pending";
const PICKUP_LOCATION_LABEL = "US pickup location";

const DESTINATION_PLACEHOLDERS = new Set(["", "TBD", "---"]);

const TEXT_CORRECTIONS: Array<[RegExp, string]> = [
  [/\bmilfrod\b/gi, "Milford"],
  [/\balmata\b/gi, "Almaty"],
  [/\bkyrgystan\b/gi, "Kyrgyzstan"],
  [/\bnovoross\b/gi, "Novorossiysk"],
];

const DISPLAY_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

function normalizeSpacing(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}

function applyTextCorrections(input: string): string {
  let next = input;
  for (const [pattern, replacement] of TEXT_CORRECTIONS) {
    next = next.replace(pattern, replacement);
  }
  return next;
}

function titleCaseWord(word: string): string {
  if (!word) return word;
  if (/^[A-Z0-9]{2,5}$/.test(word)) return word.toUpperCase();
  if (/^\d+$/.test(word)) return word;
  if (word.includes("'")) {
    return word
      .split("'")
      .map((part) => titleCaseWord(part))
      .join("'");
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function normalizeLocationCase(input: string): string {
  return input
    .split(/(\s+|,|-)/)
    .map((part) => {
      if (!part || /^[\s,-]+$/.test(part)) return part;
      return titleCaseWord(part);
    })
    .join("");
}

function cleanPublicText(input: string): string {
  const stripped = input
    .replace(/^(?:rolled\s+)?(?:customs?\s+hold\s+)?/i, "")
    .trim();

  return normalizeLocationCase(applyTextCorrections(normalizeSpacing(stripped)));
}

function countUsLocations(input: string): number {
  const matches = input.match(/\b[A-Za-z.'-]+(?:\s+[A-Za-z.'-]+)*,\s*[A-Z]{2}\b/g);
  return matches?.length ?? 0;
}

function hasTooManyLocationFragments(input: string): boolean {
  return countUsLocations(input) > 1 || input.split(",").length > 3;
}

function getCountryInfo(code: string | null, destination: string): {
  countryCode: string | null;
  countryDisplay: string | null;
} {
  const countryCode = code?.toUpperCase() ?? extractCountryCode(destination);
  if (!countryCode) {
    return {
      countryCode: null,
      countryDisplay: null,
    };
  }

  return {
    countryCode,
    countryDisplay: DISPLAY_NAMES.of(countryCode) ?? countryCode,
  };
}

function normalizeOriginDisplay(origin: string): {
  originDisplay: string;
  routeQuality: RouteQuality;
  routeFallbackReason: string | null;
} {
  const cleaned = cleanPublicText(origin);
  if (!cleaned) {
    return {
      originDisplay: PICKUP_LOCATION_LABEL,
      routeQuality: "fallback",
      routeFallbackReason: "missing_origin",
    };
  }

  if (hasTooManyLocationFragments(cleaned)) {
    return {
      originDisplay: MULTI_PICKUP_LABEL,
      routeQuality: "fallback",
      routeFallbackReason: "multiple_origins",
    };
  }

  return {
    originDisplay: cleaned,
    routeQuality: "clean",
    routeFallbackReason: null,
  };
}

function normalizeDestinationDisplay(
  destination: string,
  destinationCountry: string | null,
): {
  destinationDisplay: string;
  countryCode: string | null;
  countryDisplay: string | null;
  isDestinationPending: boolean;
  routeQuality: RouteQuality;
  routeFallbackReason: string | null;
} {
  const raw = normalizeSpacing(destination);
  const { countryCode, countryDisplay } = getCountryInfo(destinationCountry, raw);

  if (DESTINATION_PLACEHOLDERS.has(raw.toUpperCase())) {
    return {
      destinationDisplay: PENDING_DESTINATION_LABEL,
      countryCode,
      countryDisplay,
      isDestinationPending: true,
      routeQuality: "pending",
      routeFallbackReason: null,
    };
  }

  if (isUSLocation(raw) && !destinationCountry) {
    return {
      destinationDisplay: PENDING_DESTINATION_LABEL,
      countryCode,
      countryDisplay,
      isDestinationPending: true,
      routeQuality: "pending",
      routeFallbackReason: null,
    };
  }

  const cleaned = cleanPublicText(raw);
  if (!cleaned) {
    return {
      destinationDisplay: PENDING_DESTINATION_LABEL,
      countryCode,
      countryDisplay,
      isDestinationPending: true,
      routeQuality: "pending",
      routeFallbackReason: null,
    };
  }

  if (hasTooManyLocationFragments(cleaned)) {
    return {
      destinationDisplay: countryDisplay ?? PENDING_DESTINATION_LABEL,
      countryCode,
      countryDisplay,
      isDestinationPending: !countryDisplay,
      routeQuality: "fallback",
      routeFallbackReason: "invalid_destination",
    };
  }

  if (countryDisplay) {
    if (cleaned.toLowerCase() === countryDisplay.toLowerCase()) {
      return {
        destinationDisplay: countryDisplay,
        countryCode,
        countryDisplay,
        isDestinationPending: false,
        routeQuality: "clean",
        routeFallbackReason: null,
      };
    }

    const includesCountry = cleaned.toLowerCase().includes(countryDisplay.toLowerCase());
    return {
      destinationDisplay: includesCountry ? cleaned : `${cleaned}, ${countryDisplay}`,
      countryCode,
      countryDisplay,
      isDestinationPending: false,
      routeQuality: "clean",
      routeFallbackReason: null,
    };
  }

  return {
    destinationDisplay: cleaned,
    countryCode,
    countryDisplay,
    isDestinationPending: false,
    routeQuality: "clean",
    routeFallbackReason: null,
  };
}

export function parseLocalDate(iso: string): Date {
  const parts = iso.split("-");
  if (parts.length !== 3) return new Date(iso);
  return new Date(+parts[0], +parts[1] - 1, +parts[2]);
}

export function todayDateStringInTimeZone(timeZone: string = SCHEDULE_TIME_ZONE): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().split("T")[0];
  }

  return `${year}-${month}-${day}`;
}

export function getScheduleLifecycleState(
  container: SharedContainer,
  today: string = todayDateStringInTimeZone(),
): ScheduleLifecycleState {
  const hasDeparted = container.status === "departed" || container.departure_date < today;
  if (!hasDeparted) return "upcoming";
  if (container.eta_date && container.eta_date <= today) return "delivered";
  return "in-transit";
}

export function getBookabilityState(
  container: SharedContainer,
  today: string = todayDateStringInTimeZone(),
): {
  shippingState: ScheduleLifecycleState;
  bookabilityStatus: BookabilityStatus;
  bookabilityReason: BookabilityReason;
} {
  const shippingState = getScheduleLifecycleState(container, today);
  if (shippingState !== "upcoming") {
    return {
      shippingState,
      bookabilityStatus: "non-bookable",
      bookabilityReason: "departed",
    };
  }

  if (container.status === "cancelled") {
    return {
      shippingState,
      bookabilityStatus: "non-bookable",
      bookabilityReason: "cancelled",
    };
  }

  if (container.status === "unlisted") {
    return {
      shippingState,
      bookabilityStatus: "non-bookable",
      bookabilityReason: "unlisted",
    };
  }

  if (container.status !== "available") {
    return {
      shippingState,
      bookabilityStatus: "non-bookable",
      bookabilityReason: "full",
    };
  }

  if ((container.available_cbm ?? 0) <= 0) {
    return {
      shippingState,
      bookabilityStatus: "non-bookable",
      bookabilityReason: "no_capacity",
    };
  }

  return {
    shippingState,
    bookabilityStatus: "bookable",
    bookabilityReason: "available",
  };
}

export function getBookingDecision(
  container: SharedContainer | null,
  expectedProjectNumber?: string,
  today: string = todayDateStringInTimeZone(),
): BookingDecision {
  if (!container) {
    return {
      ok: false,
      shippingState: "upcoming",
      bookabilityStatus: "non-bookable",
      bookabilityReason: "unknown",
      rejectionCode: "CONTAINER_UNAVAILABLE",
    };
  }

  if (expectedProjectNumber && container.project_number !== expectedProjectNumber) {
    return {
      ok: false,
      shippingState: getScheduleLifecycleState(container, today),
      bookabilityStatus: "non-bookable",
      bookabilityReason: "unknown",
      rejectionCode: "CONTAINER_MISMATCH",
    };
  }

  const bookability = getBookabilityState(container, today);
  if (bookability.bookabilityStatus === "bookable") {
    return {
      ok: true,
      rejectionCode: null,
      ...bookability,
    };
  }

  if (bookability.bookabilityReason === "departed") {
    return {
      ok: false,
      rejectionCode: "CONTAINER_DEPARTED",
      ...bookability,
    };
  }

  if (bookability.bookabilityReason === "full" || bookability.bookabilityReason === "no_capacity") {
    return {
      ok: false,
      rejectionCode: "CONTAINER_FULL",
      ...bookability,
    };
  }

  return {
    ok: false,
    rejectionCode: "CONTAINER_UNAVAILABLE",
    ...bookability,
  };
}

export function normalizeScheduleRoute(container: SharedContainer): RouteNormalizationResult {
  const origin = normalizeOriginDisplay(container.origin);
  const destination = normalizeDestinationDisplay(
    container.destination,
    container.destination_country,
  );

  const routeQuality: RouteQuality =
    origin.routeQuality === "fallback" || destination.routeQuality === "fallback"
      ? "fallback"
      : origin.routeQuality === "pending" || destination.routeQuality === "pending"
        ? "pending"
        : "clean";

  return {
    originDisplay: origin.originDisplay,
    destinationDisplay: destination.destinationDisplay,
    countryCode: destination.countryCode,
    countryDisplay: destination.countryDisplay,
    isDestinationPending: destination.isDestinationPending,
    routeQuality,
    routeFallbackReason: origin.routeFallbackReason ?? destination.routeFallbackReason,
  };
}

export function toPublicScheduleContainer(
  container: ContainerWithPendingCount,
  today: string = todayDateStringInTimeZone(),
): PublicScheduleContainer {
  const bookability = getBookabilityState(container, today);
  const { countryCode, ...route } = normalizeScheduleRoute(container);

  return {
    id: container.id,
    project_number: container.project_number,
    destination_country: countryCode ?? container.destination_country,
    departure_date: container.departure_date,
    eta_date: container.eta_date,
    container_type: container.container_type,
    total_capacity_cbm: container.total_capacity_cbm,
    available_cbm: container.available_cbm,
    pending_count: container.pending_count,
    ...bookability,
    ...route,
  };
}
