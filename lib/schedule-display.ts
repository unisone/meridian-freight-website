/**
 * Pure display logic for the /schedule page.
 * All functions are pure — no I/O, no side effects.
 * Derives schedule-specific status from existing SharedContainer fields.
 */

import type { SharedContainer } from "@/lib/types/shared-shipping";

// ─── Schedule Status ─────────────────────────────────────────────────────────

export type ScheduleStatus =
  | "departing-soon"
  | "scheduled"
  | "fully-booked"
  | "in-transit"
  | "arrived";

export interface ScheduleStatusConfig {
  label: string;
  dotColor: string;
  borderColor: string;
}

/** Display config per status — labels are i18n keys resolved in components. */
export const SCHEDULE_STATUS_CONFIG: Record<ScheduleStatus, ScheduleStatusConfig> = {
  "departing-soon": {
    label: "status.departingSoon",
    dotColor: "bg-amber-500",
    borderColor: "border-l-amber-500",
  },
  scheduled: {
    label: "status.scheduled",
    dotColor: "bg-blue-500",
    borderColor: "border-l-blue-500",
  },
  "fully-booked": {
    label: "status.fullyBooked",
    dotColor: "bg-zinc-400",
    borderColor: "border-l-zinc-400",
  },
  "in-transit": {
    label: "status.inTransit",
    dotColor: "bg-indigo-500",
    borderColor: "border-l-indigo-500",
  },
  arrived: {
    label: "status.arrived",
    dotColor: "bg-emerald-500",
    borderColor: "border-l-emerald-500",
  },
};

/**
 * Derive a schedule display status from a SharedContainer's DB fields.
 * No migration needed — purely computed at render time.
 */
export function deriveScheduleStatus(container: SharedContainer): ScheduleStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const weekOut = new Date(today);
  weekOut.setDate(weekOut.getDate() + 7);
  const weekStr = weekOut.toISOString().split("T")[0];

  if (container.status === "departed") {
    if (container.eta_date && container.eta_date <= todayStr) {
      return "arrived";
    }
    return "in-transit";
  }

  if (container.status === "full") {
    return "fully-booked";
  }

  // status === "available"
  if (container.departure_date <= weekStr) {
    return "departing-soon";
  }

  return "scheduled";
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
  };
}

// ─── Filtering & Grouping ────────────────────────────────────────────────────

export type FilterTab = "all" | "upcoming" | "in-transit" | "delivered";

export type ScheduleGroup =
  | "departing-this-week"
  | "departing-this-month"
  | "departing-later"
  | "in-transit"
  | "arrived";

export interface GroupConfig {
  label: string;
  borderColor: string;
}

export const GROUP_CONFIG: Record<ScheduleGroup, GroupConfig> = {
  "departing-this-week": {
    label: "group.departingThisWeek",
    borderColor: "border-l-amber-500",
  },
  "departing-this-month": {
    label: "group.departingThisMonth",
    borderColor: "border-l-blue-500",
  },
  "departing-later": {
    label: "group.later",
    borderColor: "border-l-muted",
  },
  "in-transit": {
    label: "group.inTransit",
    borderColor: "border-l-indigo-500",
  },
  arrived: {
    label: "group.arrived",
    borderColor: "border-l-emerald-500",
  },
};

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

/**
 * Group containers by time/status, filtered by tab and country.
 * Returns groups in display order.
 */
export function groupContainers(
  containers: SharedContainer[],
  filterTab: FilterTab,
  filterCountry: string | null,
): Map<ScheduleGroup, SharedContainer[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const weekOut = new Date(today);
  weekOut.setDate(weekOut.getDate() + 7);
  const weekStr = weekOut.toISOString().split("T")[0];

  const monthOut = new Date(today);
  monthOut.setDate(monthOut.getDate() + 30);
  const monthStr = monthOut.toISOString().split("T")[0];

  let filtered = containers;

  // Country filter
  if (filterCountry) {
    filtered = filtered.filter((c) => c.destination_country === filterCountry);
  }

  // Tab filter
  if (filterTab === "upcoming") {
    filtered = filtered.filter(
      (c) =>
        c.status === "available" ||
        (c.status === "full" && c.departure_date > todayStr),
    );
  } else if (filterTab === "in-transit") {
    filtered = filtered.filter(
      (c) =>
        c.status === "departed" &&
        (c.eta_date === null || c.eta_date > todayStr),
    );
  } else if (filterTab === "delivered") {
    filtered = filtered.filter(
      (c) =>
        c.status === "departed" &&
        c.eta_date !== null &&
        c.eta_date <= todayStr,
    );
  }

  // Group
  const groups = new Map<ScheduleGroup, SharedContainer[]>();

  // Maintain display order
  const groupOrder: ScheduleGroup[] = [
    "departing-this-week",
    "departing-this-month",
    "departing-later",
    "in-transit",
    "arrived",
  ];

  for (const c of filtered) {
    let group: ScheduleGroup;

    if (c.status === "departed") {
      if (c.eta_date && c.eta_date <= todayStr) {
        group = "arrived";
      } else {
        group = "in-transit";
      }
    } else if (c.departure_date <= weekStr) {
      group = "departing-this-week";
    } else if (c.departure_date <= monthStr) {
      group = "departing-this-month";
    } else {
      group = "departing-later";
    }

    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(c);
  }

  // Sort arrived group by ETA descending (most recent first)
  const arrived = groups.get("arrived");
  if (arrived) {
    arrived.sort((a, b) => (b.eta_date ?? "").localeCompare(a.eta_date ?? ""));
  }

  // Return in display order
  const ordered = new Map<ScheduleGroup, SharedContainer[]>();
  for (const key of groupOrder) {
    if (groups.has(key)) {
      ordered.set(key, groups.get(key)!);
    }
  }

  return ordered;
}
