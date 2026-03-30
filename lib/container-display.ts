import type {
  ContainerDisplayState,
  ContainerWithPendingCount,
} from "@/lib/types/shared-shipping";

const DEFAULT_TOTAL_CAPACITY_CBM = 76;

/**
 * Computes the display state for a container card.
 * Pure function — no I/O, no side effects.
 */
export function computeDisplayState(
  container: ContainerWithPendingCount
): ContainerDisplayState {
  const totalCapacity =
    container.total_capacity_cbm > 0
      ? container.total_capacity_cbm
      : DEFAULT_TOTAL_CAPACITY_CBM;

  const availableCbm = container.available_cbm ?? 0;

  const isFull =
    availableCbm === 0 || container.status === "full";

  const rawFillPercent =
    Math.round((1 - availableCbm / totalCapacity) * 100);
  const fillPercent = Math.min(100, Math.max(0, rawFillPercent));

  const fillColor: ContainerDisplayState["fillColor"] = isFull
    ? "zinc"
    : fillPercent >= 80
    ? "amber"
    : "blue";

  const isLimited = fillPercent >= 80 && !isFull;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departure = new Date(container.departure_date);
  departure.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = departure.getTime() - today.getTime();
  const daysUntilDeparture = Math.ceil(diffMs / msPerDay);

  const isDepartingSoon = daysUntilDeparture <= 3 && daysUntilDeparture >= 0;

  const pendingCount = container.pending_count;
  const demandLevel: ContainerDisplayState["demandLevel"] =
    pendingCount === 0
      ? null
      : pendingCount <= 2
      ? "pending"
      : "popular";

  return {
    fillPercent,
    fillColor,
    isDepartingSoon,
    isLimited,
    isFull,
    demandLevel,
    pendingCount,
    daysUntilDeparture,
  };
}

/**
 * Converts an ISO 3166-1 alpha-2 country code to a flag emoji.
 * Returns "🌍" for null or invalid input.
 */
export function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "🌍";

  const upper = code.toUpperCase();
  // Validate that both characters are ASCII letters A–Z
  if (!/^[A-Z]{2}$/.test(upper)) return "🌍";

  const REGIONAL_INDICATOR_BASE = 0x1f1e6 - 65; // 'A'.charCodeAt(0) === 65
  const firstChar = String.fromCodePoint(
    REGIONAL_INDICATOR_BASE + upper.charCodeAt(0)
  );
  const secondChar = String.fromCodePoint(
    REGIONAL_INDICATOR_BASE + upper.charCodeAt(1)
  );

  return firstChar + secondChar;
}

/**
 * Computes the number of transit days between departure and ETA dates.
 * Returns null if eta_date is absent or either date is invalid.
 */
export function transitDays(
  departureDate: string,
  etaDate: string | null
): number | null {
  if (!etaDate) return null;

  const departure = new Date(departureDate);
  const eta = new Date(etaDate);

  if (isNaN(departure.getTime()) || isNaN(eta.getTime())) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = eta.getTime() - departure.getTime();

  return Math.round(diffMs / msPerDay);
}
