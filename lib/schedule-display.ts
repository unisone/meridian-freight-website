/**
 * Pure display logic for the /schedule page.
 * All functions are pure — no I/O, no side effects.
 */

import type { SharedContainer, ContainerWithPendingCount } from "@/lib/types/shared-shipping";

// ─── Date Utility ───────────────────────────────────────────────────────────

/** Get today's date as YYYY-MM-DD in local time.
 *  Uses local time (not UTC) because departure_date values in the DB represent
 *  the departure date at the US port — comparison should match the user's
 *  expectation of "today." Using toISOString().split("T")[0] would give UTC,
 *  which is already the next day at 7 PM+ US Eastern. */
export function todayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Parse a YYYY-MM-DD date string as LOCAL midnight (not UTC).
 *  CRITICAL: new Date("2026-03-30") creates UTC midnight, which in US timezones
 *  becomes March 29 — causing off-by-one in date display and countdown logic.
 *  This function parses the components directly to create a local-time Date. */
export function parseLocalDate(iso: string): Date {
  const parts = iso.split("-");
  if (parts.length !== 3) return new Date(iso); // fallback for non-ISO
  return new Date(+parts[0], +parts[1] - 1, +parts[2]);
}

// ─── Transit Progress ────────────────────────────────────────────────────────

export interface TransitProgress {
  transitDay: number;
  transitTotal: number;
  progressPercent: number;
}

/**
 * Compute journey progress for in-transit containers.
 * Returns null if ETA is missing or dates are invalid.
 */
export function computeTransitProgress(
  departureDate: string,
  etaDate: string | null,
): TransitProgress | null {
  if (!etaDate) return null;

  const dep = parseLocalDate(departureDate);
  const eta = parseLocalDate(etaDate);
  const now = new Date();

  if (isNaN(dep.getTime()) || isNaN(eta.getTime())) return null;

  const totalMs = eta.getTime() - dep.getTime();
  if (totalMs <= 0) return null;

  const elapsedMs = now.getTime() - dep.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;

  const transitTotal = Math.round(totalMs / msPerDay);
  const transitDay = Math.max(1, Math.min(transitTotal, Math.round(elapsedMs / msPerDay)));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));

  return { transitDay, transitTotal, progressPercent };
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface ScheduleStats {
  containersThisMonth: number;
  countriesServed: number;
  inTransitNow: number;
  bookableContainers: number;
}

/** Compute aggregate stats from the full container list. */
export function computeScheduleStats(containers: SharedContainer[]): ScheduleStats {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const todayStr = todayDateString();

  return {
    containersThisMonth: containers.filter(
      (c) => c.departure_date >= monthStart,
    ).length,

    countriesServed: new Set(
      containers.map((c) => c.destination_country).filter(Boolean),
    ).size,

    inTransitNow: containers.filter((c) => {
      const hasDeparted = c.status === "departed" || c.departure_date < todayStr;
      return hasDeparted && (c.eta_date === null || c.eta_date > todayStr);
    }).length,

    bookableContainers: containers.filter((c) => {
      const hasDeparted = c.status === "departed" || c.departure_date < todayStr;
      return !hasDeparted && c.status === "available" && (c.available_cbm ?? 0) > 0;
    }).length,
  };
}

// ─── Filtering & Grouping ────────────────────────────────────────────────────

export type FilterTab = "all" | "upcoming" | "in-transit" | "delivered";


/** Count containers per filter tab. */
export function computeTabCounts(
  containers: SharedContainer[],
): Record<FilterTab, number> {
  const todayStr = todayDateString();

  let upcoming = 0;
  let inTransit = 0;
  let delivered = 0;

  for (const c of containers) {
    const hasDeparted = c.status === "departed" || c.departure_date < todayStr;

    if (hasDeparted) {
      if (c.eta_date && c.eta_date <= todayStr) {
        delivered++;
      } else {
        inTransit++;
      }
    } else {
      upcoming++;
    }
  }

  return {
    all: containers.length,
    upcoming,
    "in-transit": inTransit,
    delivered,
  };
}

/** Extract unique countries from container list, sorted alphabetically. */
export function deriveCountryList(
  containers: SharedContainer[],
): Array<{ code: string; name: string }> {
  const countryMap = new Map<string, string>();

  for (const c of containers) {
    if (c.destination_country && !countryMap.has(c.destination_country)) {
      // Extract country name from destination (e.g., "Almaty, Kazakhstan" → "Kazakhstan")
      const parts = c.destination.split(",").map((s) => s.trim());
      const countryName =
        parts.length > 1 ? parts[parts.length - 1] : c.destination;
      countryMap.set(c.destination_country, countryName);
    }
  }

  return Array.from(countryMap.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}


// ─── Display Helpers ────────────────────────────────────────────────────────

export type CountdownUrgency = "past" | "today" | "urgent" | "soon" | "normal";

export interface DepartureCountdown {
  daysUntil: number;
  urgency: CountdownUrgency;
}

/** Compute days until departure and urgency level. */
export function computeDepartureCountdown(departureDate: string): DepartureCountdown {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dep = parseLocalDate(departureDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = Math.ceil((dep.getTime() - today.getTime()) / msPerDay);

  let urgency: CountdownUrgency;
  if (daysUntil < 0) urgency = "past";
  else if (daysUntil === 0) urgency = "today";
  else if (daysUntil <= 3) urgency = "urgent";
  else if (daysUntil <= 7) urgency = "soon";
  else urgency = "normal";

  return { daysUntil, urgency };
}

/** Strip operational notes from origin text and normalize formatting. */
export function cleanOriginText(origin: string): string {
  // Strip common operational prefixes
  let cleaned = origin
    .replace(/^(?:ROLLED\s+)?(?:customs?\s+hold\s+)?/i, "")
    .trim();

  // Normalize "Albion,IA" → "Albion, IA" (add space after comma if missing)
  cleaned = cleaned.replace(/,([^\s])/g, ", $1");

  return cleaned || origin;
}

/** Format destination for display — handle missing destinations gracefully. */
export function formatDestination(destination: string): {
  text: string;
  isPending: boolean;
} {
  if (!destination || destination === "TBD" || destination === "---") {
    return { text: "Destination pending", isPending: true };
  }
  return { text: destination, isPending: false };
}

/** Format ISO date to short display format (e.g., "Mar 30" / "30 мар."). */
export function shortDate(iso: string, locale: string = "en-US"): string {
  const d = parseLocalDate(iso);
  if (isNaN(d.getTime())) return "—";
  const localeMap: Record<string, string> = { en: "en-US", es: "es", ru: "ru" };
  return d.toLocaleDateString(localeMap[locale] ?? locale, { month: "short", day: "numeric" });
}

/** Compute capacity fill percentage. */
export function computeCapacityFill(
  availableCbm: number | null,
  totalCapacity: number,
): { fillPercent: number; label: string } {
  const available = availableCbm ?? 0;
  const total = totalCapacity > 0 ? totalCapacity : 76;
  const fillPercent = Math.min(100, Math.max(0, Math.round((1 - available / total) * 100)));
  return { fillPercent, label: `${fillPercent}%` };
}

// ─── Container Classification ───────────────────────────────────────────────

export interface ClassifiedContainers {
  bookable: ContainerWithPendingCount[];
  nonBookableUpcoming: SharedContainer[];
  inTransit: SharedContainer[];
  delivered: SharedContainer[];
}

/** Classify containers into display buckets and sort each group.
 *  IMPORTANT: departure_date takes precedence over DB status. Between cron runs
 *  (15-min gap), a container can have status=available but departure_date in the past.
 *  We classify by date first to avoid showing departed containers as bookable. */
export function classifyContainers(containers: ContainerWithPendingCount[]): ClassifiedContainers {
  const today = todayDateString();
  const bookable: ContainerWithPendingCount[] = [];
  const nonBookableUpcoming: SharedContainer[] = [];
  const inTransit: SharedContainer[] = [];
  const delivered: SharedContainer[] = [];

  for (const c of containers) {
    // 1. Check if container has effectively departed (date-based, not status-based)
    const hasDeparted = c.status === "departed" || c.departure_date < today;

    if (hasDeparted) {
      if (c.eta_date && c.eta_date <= today) {
        delivered.push(c);
      } else {
        inTransit.push(c);
      }
    } else if (c.status === "available" && (c.available_cbm ?? 0) > 0) {
      // Future departure + available space = bookable
      bookable.push(c);
    } else {
      // Future departure but full or no space
      nonBookableUpcoming.push(c);
    }
  }

  // Sort bookable by departure ASC (soonest first)
  bookable.sort((a, b) => a.departure_date.localeCompare(b.departure_date));
  nonBookableUpcoming.sort((a, b) => a.departure_date.localeCompare(b.departure_date));
  // Transit: most recently departed first
  inTransit.sort((a, b) => b.departure_date.localeCompare(a.departure_date));
  // Delivered: most recently arrived first
  delivered.sort((a, b) =>
    (b.eta_date ?? b.departure_date).localeCompare(a.eta_date ?? a.departure_date),
  );

  return { bookable, nonBookableUpcoming, inTransit, delivered };
}
