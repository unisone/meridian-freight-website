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
