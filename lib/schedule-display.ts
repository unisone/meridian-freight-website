/**
 * Pure display logic for the /schedule page.
 * All functions are pure — no I/O, no side effects.
 */

import { parseLocalDate } from "@/lib/schedule-contract";
import type { PublicScheduleContainer } from "@/lib/types/shared-shipping";

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
export function computeScheduleStats(containers: PublicScheduleContainer[]): ScheduleStats {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  return {
    containersThisMonth: containers.filter(
      (c) => c.departure_date >= monthStart,
    ).length,

    countriesServed: new Set(
      containers.map((c) => c.destination_country ?? c.countryDisplay).filter(Boolean),
    ).size,

    inTransitNow: containers.filter((c) => c.shippingState === "in-transit").length,

    bookableContainers: containers.filter((c) => c.bookabilityStatus === "bookable").length,
  };
}

// ─── Filtering & Grouping ────────────────────────────────────────────────────

export type FilterTab = "all" | "upcoming" | "in-transit" | "delivered";


/** Count containers per filter tab. */
export function computeTabCounts(
  containers: PublicScheduleContainer[],
): Record<FilterTab, number> {
  let upcoming = 0;
  let inTransit = 0;
  let delivered = 0;

  for (const c of containers) {
    if (c.shippingState === "upcoming") {
      upcoming++;
    } else if (c.shippingState === "in-transit") {
      inTransit++;
    } else {
      delivered++;
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
  containers: PublicScheduleContainer[],
): Array<{ code: string; name: string }> {
  const countryMap = new Map<string, string>();

  for (const c of containers) {
    if (c.destination_country && c.countryDisplay && !countryMap.has(c.destination_country)) {
      countryMap.set(c.destination_country, c.countryDisplay);
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
  bookable: PublicScheduleContainer[];
  nonBookableUpcoming: PublicScheduleContainer[];
  inTransit: PublicScheduleContainer[];
  delivered: PublicScheduleContainer[];
}

/** Classify containers into display buckets and sort each group.
 *  The server-owned public contract already resolves shippingState and
 *  bookability, so the client never has to reinterpret raw DB fields. */
export function classifyContainers(containers: PublicScheduleContainer[]): ClassifiedContainers {
  const bookable: PublicScheduleContainer[] = [];
  const nonBookableUpcoming: PublicScheduleContainer[] = [];
  const inTransit: PublicScheduleContainer[] = [];
  const delivered: PublicScheduleContainer[] = [];

  for (const c of containers) {
    if (c.shippingState === "in-transit") {
      inTransit.push(c);
    } else if (c.shippingState === "delivered") {
      delivered.push(c);
    } else if (c.bookabilityStatus === "bookable") {
      bookable.push(c);
    } else {
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

// ─── Filter Containers ─────────────────────────────────────────────────────

/** Filter containers by tab and country. Departure date takes precedence over
 *  DB status since the cron only runs every 15 min. */
export function filterContainers(
  containers: PublicScheduleContainer[],
  tab: FilterTab,
  country: string | null,
): PublicScheduleContainer[] {
  let filtered = containers;

  if (country) {
    filtered = filtered.filter((c) => c.destination_country === country);
  }

  if (tab === "upcoming") {
    filtered = filtered.filter((c) => c.shippingState === "upcoming");
  } else if (tab === "in-transit") {
    filtered = filtered.filter((c) => c.shippingState === "in-transit");
  } else if (tab === "delivered") {
    filtered = filtered.filter((c) => c.shippingState === "delivered");
  }

  return filtered;
}
