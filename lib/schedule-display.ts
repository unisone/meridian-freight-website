/**
 * Pure display logic for the /schedule page.
 * All functions are pure — no I/O, no side effects.
 */

import type { SharedContainer, ContainerWithPendingCount } from "@/lib/types/shared-shipping";

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

  const dep = new Date(departureDate);
  const eta = new Date(etaDate);
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
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const todayStr = now.toISOString().split("T")[0];

  return {
    containersThisMonth: containers.filter(
      (c) => c.departure_date >= monthStart,
    ).length,

    countriesServed: new Set(
      containers.map((c) => c.destination_country).filter(Boolean),
    ).size,

    inTransitNow: containers.filter(
      (c) =>
        c.status === "departed" &&
        (c.eta_date === null || c.eta_date > todayStr),
    ).length,

    bookableContainers: containers.filter(
      (c) => c.status === "available" && (c.available_cbm ?? 0) > 0,
    ).length,
  };
}

// ─── Filtering & Grouping ────────────────────────────────────────────────────

export type FilterTab = "all" | "upcoming" | "in-transit" | "delivered";


/** Count containers per filter tab. */
export function computeTabCounts(
  containers: SharedContainer[],
): Record<FilterTab, number> {
  const todayStr = new Date().toISOString().split("T")[0];

  let upcoming = 0;
  let inTransit = 0;
  let delivered = 0;

  for (const c of containers) {
    if (c.status === "departed") {
      if (c.eta_date && c.eta_date <= todayStr) {
        delivered++;
      } else {
        inTransit++;
      }
    } else {
      // available or full with future departure
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
  const dep = new Date(departureDate);
  dep.setHours(0, 0, 0, 0);

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

/** Format ISO date to short display format (e.g., "Mar 29"). */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

/** Classify containers into display buckets and sort each group. */
export function classifyContainers(containers: ContainerWithPendingCount[]): ClassifiedContainers {
  const today = new Date().toISOString().split("T")[0];
  const bookable: ContainerWithPendingCount[] = [];
  const nonBookableUpcoming: SharedContainer[] = [];
  const inTransit: SharedContainer[] = [];
  const delivered: SharedContainer[] = [];

  for (const c of containers) {
    if (c.status === "departed") {
      if (c.eta_date && c.eta_date <= today) {
        delivered.push(c);
      } else {
        inTransit.push(c);
      }
    } else if (c.status === "available" && (c.available_cbm ?? 0) > 0) {
      bookable.push(c);
    } else {
      // full or available with 0 cbm — upcoming but not bookable
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
