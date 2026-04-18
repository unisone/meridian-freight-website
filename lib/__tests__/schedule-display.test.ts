import { describe, it, expect } from "vitest";
import type { SharedContainer, ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import {
  computeTransitProgress,
  computeScheduleStats,
  computeTabCounts,
  deriveCountryList,
  classifyContainers,
  shortDate,
  computeCapacityFill,
  computeDepartureCountdown,
  cleanOriginText,
  formatDestination,
} from "@/lib/schedule-display";

// ─── Test Helpers ────────────────────────────────────────────────────────────

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/** Produce a local-date YYYY-MM-DD string N days from today.
 *  Since computeDepartureCountdown now uses parseLocalDate (not new Date()),
 *  no timezone compensation is needed — the date string is parsed as local time. */
function localDatePlusDays(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function makeContainer(overrides: Partial<SharedContainer> = {}): SharedContainer {
  return {
    id: "test-id",
    project_number: "MF-2026-001",
    origin: "Chicago, IL",
    destination: "Almaty, Kazakhstan",
    destination_country: "KZ",
    departure_date: daysFromNow(14),
    eta_date: daysFromNow(49),
    container_type: "40HC",
    total_capacity_cbm: 76,
    available_cbm: 30,
    status: "available",
    notes: null,
    source: "google_sheets",
    sheet_row_number: 1,
    raw_space_value: "30",
    container_count: 1,
    synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

function makeContainerWithPending(
  overrides: Partial<ContainerWithPendingCount> = {},
): ContainerWithPendingCount {
  return {
    ...makeContainer(overrides),
    pending_count: 0,
    ...overrides,
  };
}

// ─── computeTransitProgress ──────────────────────────────────────────────────

describe("computeTransitProgress", () => {
  it("returns null for null ETA", () => {
    expect(computeTransitProgress(daysFromNow(-5), null)).toBeNull();
  });

  it("returns null for invalid dates", () => {
    expect(computeTransitProgress("invalid", "2026-05-01")).toBeNull();
  });

  it("returns progress for mid-transit container", () => {
    const dep = daysFromNow(-10);
    const eta = daysFromNow(25);
    const result = computeTransitProgress(dep, eta);
    expect(result).not.toBeNull();
    expect(result!.transitDay).toBeGreaterThanOrEqual(9);
    expect(result!.transitDay).toBeLessThanOrEqual(11);
    expect(result!.transitTotal).toBe(35);
    expect(result!.progressPercent).toBeGreaterThan(20);
    expect(result!.progressPercent).toBeLessThan(40);
  });

  it("clamps progress to 0-100%", () => {
    // Just departed (day 0)
    const dep = daysFromNow(0);
    const eta = daysFromNow(30);
    const result = computeTransitProgress(dep, eta);
    expect(result).not.toBeNull();
    expect(result!.progressPercent).toBeGreaterThanOrEqual(0);
    expect(result!.progressPercent).toBeLessThanOrEqual(100);
  });

  it("returns 100% for arrived container", () => {
    const dep = daysFromNow(-40);
    const eta = daysFromNow(-5);
    const result = computeTransitProgress(dep, eta);
    expect(result).not.toBeNull();
    expect(result!.progressPercent).toBe(100);
  });

  it("returns null when departure equals ETA", () => {
    const date = daysFromNow(-5);
    expect(computeTransitProgress(date, date)).toBeNull();
  });
});

// ─── computeScheduleStats ────────────────────────────────────────────────────

describe("computeScheduleStats", () => {
  it("computes correct stats", () => {
    const containers = [
      makeContainer({ departure_date: daysFromNow(5), destination_country: "KZ" }),
      makeContainer({ departure_date: daysFromNow(3), destination_country: "BR" }),
      makeContainer({
        status: "departed",
        departure_date: daysFromNow(-10),
        eta_date: daysFromNow(20),
        destination_country: "KZ",
      }),
      makeContainer({
        status: "departed",
        departure_date: daysFromNow(-40),
        eta_date: daysFromNow(-5),
        destination_country: "UY",
      }),
    ];

    const stats = computeScheduleStats(containers);
    expect(stats.countriesServed).toBe(3); // KZ, BR, UY
    expect(stats.inTransitNow).toBe(1); // only the one with future ETA
    expect(stats.bookableContainers).toBe(2); // 2 available containers with cbm > 0
  });

  it("handles empty array", () => {
    const stats = computeScheduleStats([]);
    expect(stats.containersThisMonth).toBe(0);
    expect(stats.countriesServed).toBe(0);
    expect(stats.inTransitNow).toBe(0);
  });
});

// ─── computeTabCounts ────────────────────────────────────────────────────────

describe("computeTabCounts", () => {
  it("counts correctly across tabs", () => {
    const containers = [
      makeContainer({ status: "available" }),
      makeContainer({ status: "full" }),
      makeContainer({
        status: "departed",
        departure_date: daysFromNow(-10),
        eta_date: daysFromNow(20),
      }),
      makeContainer({
        status: "departed",
        departure_date: daysFromNow(-40),
        eta_date: daysFromNow(-5),
      }),
    ];

    const counts = computeTabCounts(containers);
    expect(counts.all).toBe(4);
    expect(counts.upcoming).toBe(2); // available + full
    expect(counts["in-transit"]).toBe(1);
    expect(counts.delivered).toBe(1);
  });
});

// ─── deriveCountryList ───────────────────────────────────────────────────────

describe("deriveCountryList", () => {
  it("extracts unique countries sorted alphabetically", () => {
    const containers = [
      makeContainer({ destination: "Almaty, Kazakhstan", destination_country: "KZ" }),
      makeContainer({ destination: "São Paulo, Brazil", destination_country: "BR" }),
      makeContainer({ destination: "Astana, Kazakhstan", destination_country: "KZ" }),
    ];

    const countries = deriveCountryList(containers);
    expect(countries).toHaveLength(2);
    expect(countries[0]).toEqual({ code: "BR", name: "Brazil" });
    expect(countries[1]).toEqual({ code: "KZ", name: "Kazakhstan" });
  });

  it("handles containers without destination_country", () => {
    const containers = [
      makeContainer({ destination_country: null }),
      makeContainer({ destination_country: "KZ", destination: "Almaty, Kazakhstan" }),
    ];

    const countries = deriveCountryList(containers);
    expect(countries).toHaveLength(1);
    expect(countries[0].code).toBe("KZ");
  });
});

// ─── shortDate ──────────────────────────────────────────────────────────────

describe("shortDate", () => {
  it("formats a valid ISO date to 'Mon DD' format", () => {
    const result = shortDate("2026-06-15");
    // Should produce "Jun 14" or "Jun 15" depending on timezone — verify format
    expect(result).toMatch(/^[A-Z][a-z]{2}\s+\d{1,2}$/);
  });

  it("returns — for invalid date", () => {
    expect(shortDate("invalid")).toBe("—");
  });

  it("returns — for empty string", () => {
    expect(shortDate("")).toBe("—");
  });
});

// ─── classifyContainers ─────────────────────────────────────────────────────

describe("classifyContainers", () => {
  it("routes available+cbm>0 to bookable", () => {
    const c = [makeContainerWithPending({ status: "available", available_cbm: 30 })];
    const result = classifyContainers(c);
    expect(result.bookable).toHaveLength(1);
    expect(result.nonBookableUpcoming).toHaveLength(0);
  });

  it("routes available+cbm=0 to nonBookableUpcoming", () => {
    const c = [makeContainerWithPending({ status: "available", available_cbm: 0 })];
    const result = classifyContainers(c);
    expect(result.bookable).toHaveLength(0);
    expect(result.nonBookableUpcoming).toHaveLength(1);
  });

  it("routes full to nonBookableUpcoming", () => {
    const c = [makeContainerWithPending({ status: "full" })];
    const result = classifyContainers(c);
    expect(result.nonBookableUpcoming).toHaveLength(1);
  });

  it("routes departed+futureETA to inTransit", () => {
    const c = [makeContainerWithPending({
      status: "departed",
      departure_date: daysFromNow(-10),
      eta_date: daysFromNow(20),
    })];
    const result = classifyContainers(c);
    expect(result.inTransit).toHaveLength(1);
  });

  it("routes departed+nullETA to inTransit", () => {
    const c = [makeContainerWithPending({
      status: "departed",
      departure_date: daysFromNow(-10),
      eta_date: null,
    })];
    const result = classifyContainers(c);
    expect(result.inTransit).toHaveLength(1);
  });

  it("routes departed+pastETA to delivered", () => {
    const c = [makeContainerWithPending({
      status: "departed",
      departure_date: daysFromNow(-40),
      eta_date: daysFromNow(-5),
    })];
    const result = classifyContainers(c);
    expect(result.delivered).toHaveLength(1);
  });

  it("sorts bookable by departure ASC (soonest first)", () => {
    const c = [
      makeContainerWithPending({ id: "late", departure_date: daysFromNow(20) }),
      makeContainerWithPending({ id: "soon", departure_date: daysFromNow(5) }),
      makeContainerWithPending({ id: "soonest", departure_date: daysFromNow(2) }),
    ];
    const result = classifyContainers(c);
    expect(result.bookable[0].id).toBe("soonest");
    expect(result.bookable[1].id).toBe("soon");
    expect(result.bookable[2].id).toBe("late");
  });

  it("sorts inTransit by departure DESC (most recent first)", () => {
    const c = [
      makeContainerWithPending({ id: "old", status: "departed", departure_date: daysFromNow(-30), eta_date: daysFromNow(5) }),
      makeContainerWithPending({ id: "recent", status: "departed", departure_date: daysFromNow(-5), eta_date: daysFromNow(30) }),
    ];
    const result = classifyContainers(c);
    expect(result.inTransit[0].id).toBe("recent");
    expect(result.inTransit[1].id).toBe("old");
  });

  it("sorts delivered by ETA DESC (most recent arrival first)", () => {
    const c = [
      makeContainerWithPending({ id: "old-arrival", status: "departed", departure_date: daysFromNow(-50), eta_date: daysFromNow(-20) }),
      makeContainerWithPending({ id: "recent-arrival", status: "departed", departure_date: daysFromNow(-40), eta_date: daysFromNow(-3) }),
    ];
    const result = classifyContainers(c);
    expect(result.delivered[0].id).toBe("recent-arrival");
    expect(result.delivered[1].id).toBe("old-arrival");
  });

  it("routes available+cbm>0 with PAST departure to inTransit (not bookable)", () => {
    const c = [makeContainerWithPending({
      status: "available",
      available_cbm: 30,
      departure_date: daysFromNow(-3),
      eta_date: daysFromNow(25),
    })];
    const result = classifyContainers(c);
    expect(result.bookable).toHaveLength(0);
    expect(result.inTransit).toHaveLength(1);
  });

  it("routes full container with PAST departure to inTransit (not upcoming)", () => {
    const c = [makeContainerWithPending({
      status: "full",
      departure_date: daysFromNow(-2),
      eta_date: daysFromNow(30),
    })];
    const result = classifyContainers(c);
    expect(result.nonBookableUpcoming).toHaveLength(0);
    expect(result.inTransit).toHaveLength(1);
  });

  it("allows booking for available container departing TODAY", () => {
    const c = [makeContainerWithPending({
      status: "available",
      available_cbm: 30,
      departure_date: daysFromNow(0),
    })];
    const result = classifyContainers(c);
    expect(result.bookable).toHaveLength(1);
  });

  it("routes available_cbm=null to nonBookableUpcoming", () => {
    const c = [makeContainerWithPending({ status: "available", available_cbm: null })];
    const result = classifyContainers(c);
    expect(result.bookable).toHaveLength(0);
    expect(result.nonBookableUpcoming).toHaveLength(1);
  });

  it("routes departed with eta_date=today to delivered (boundary)", () => {
    const c = [makeContainerWithPending({
      status: "departed",
      departure_date: daysFromNow(-30),
      eta_date: daysFromNow(0),
    })];
    const result = classifyContainers(c);
    expect(result.delivered).toHaveLength(1);
    expect(result.inTransit).toHaveLength(0);
  });

  it("returns all-empty arrays for empty input", () => {
    const result = classifyContainers([]);
    expect(result.bookable).toHaveLength(0);
    expect(result.nonBookableUpcoming).toHaveLength(0);
    expect(result.inTransit).toHaveLength(0);
    expect(result.delivered).toHaveLength(0);
  });

  it("distributes mixed statuses correctly", () => {
    const c = [
      makeContainerWithPending({ id: "a", status: "available", available_cbm: 20 }),
      makeContainerWithPending({ id: "b", status: "full" }),
      makeContainerWithPending({ id: "c", status: "departed", departure_date: daysFromNow(-10), eta_date: daysFromNow(20) }),
      makeContainerWithPending({ id: "d", status: "departed", departure_date: daysFromNow(-40), eta_date: daysFromNow(-5) }),
      makeContainerWithPending({ id: "e", status: "available", available_cbm: 0 }),
    ];
    const result = classifyContainers(c);
    expect(result.bookable.map((x) => x.id)).toEqual(["a"]);
    expect(result.nonBookableUpcoming.map((x) => x.id)).toContain("b");
    expect(result.nonBookableUpcoming.map((x) => x.id)).toContain("e");
    expect(result.inTransit.map((x) => x.id)).toEqual(["c"]);
    expect(result.delivered.map((x) => x.id)).toEqual(["d"]);
  });
});

// ─── computeCapacityFill ────────────────────────────────────────────────────

describe("computeCapacityFill", () => {
  it("returns 0% fill when container is empty (available = total)", () => {
    const { fillPercent } = computeCapacityFill(76, 76);
    expect(fillPercent).toBe(0);
  });

  it("returns 100% fill when available = 0", () => {
    const { fillPercent } = computeCapacityFill(0, 76);
    expect(fillPercent).toBe(100);
  });

  it("computes correct percentage for partial fill", () => {
    const { fillPercent } = computeCapacityFill(19, 76);
    expect(fillPercent).toBe(75);
  });

  it("clamps to 0-100 range", () => {
    const over = computeCapacityFill(-10, 76);
    expect(over.fillPercent).toBeLessThanOrEqual(100);
    const under = computeCapacityFill(200, 76);
    expect(under.fillPercent).toBeGreaterThanOrEqual(0);
  });

  it("uses default 76 CBM when totalCapacity is 0", () => {
    const { fillPercent } = computeCapacityFill(0, 0);
    expect(fillPercent).toBe(100);
  });

  it("produces label with percentage only", () => {
    const { label } = computeCapacityFill(38, 76);
    expect(label).toBe("50%");
  });

  it("handles null availableCbm (treat as 0)", () => {
    const { fillPercent } = computeCapacityFill(null, 76);
    expect(fillPercent).toBe(100);
  });
});

// ─── computeDepartureCountdown ──────────────────────────────────────────────

describe("computeDepartureCountdown", () => {
  it("returns 'past' urgency for dates before today", () => {
    const result = computeDepartureCountdown(localDatePlusDays(-5));
    expect(result.urgency).toBe("past");
    expect(result.daysUntil).toBeLessThan(0);
  });

  it("returns 'today' urgency for today's date", () => {
    const result = computeDepartureCountdown(localDatePlusDays(0));
    expect(result.urgency).toBe("today");
    expect(result.daysUntil).toBe(0);
  });

  it("returns 'urgent' for 1-3 days out", () => {
    expect(computeDepartureCountdown(localDatePlusDays(1)).urgency).toBe("urgent");
    expect(computeDepartureCountdown(localDatePlusDays(2)).urgency).toBe("urgent");
    expect(computeDepartureCountdown(localDatePlusDays(3)).urgency).toBe("urgent");
  });

  it("returns 'soon' for 4-7 days out", () => {
    expect(computeDepartureCountdown(localDatePlusDays(4)).urgency).toBe("soon");
    expect(computeDepartureCountdown(localDatePlusDays(7)).urgency).toBe("soon");
  });

  it("returns 'normal' for 8+ days out", () => {
    expect(computeDepartureCountdown(localDatePlusDays(8)).urgency).toBe("normal");
    expect(computeDepartureCountdown(localDatePlusDays(30)).urgency).toBe("normal");
  });

  it("daysUntil is correct positive integer", () => {
    const result = computeDepartureCountdown(localDatePlusDays(10));
    expect(result.daysUntil).toBe(10);
  });
});

// ─── cleanOriginText ────────────────────────────────────────────────────────

describe("cleanOriginText", () => {
  it("strips ROLLED prefix", () => {
    expect(cleanOriginText("ROLLED Albion, IA")).toBe("Albion, IA");
  });

  it("strips 'customs hold' prefix", () => {
    expect(cleanOriginText("customs hold Albion, IA")).toBe("Albion, IA");
  });

  it("handles combined prefixes", () => {
    expect(cleanOriginText("ROLLED customs hold Albion, IA")).toBe("Albion, IA");
  });

  it("normalizes missing space after comma", () => {
    expect(cleanOriginText("Albion,IA")).toBe("Albion, IA");
  });

  it("returns original if cleaning produces empty string", () => {
    expect(cleanOriginText("ROLLED")).toBe("ROLLED");
  });

  it("passes through normal text unchanged", () => {
    expect(cleanOriginText("Chicago, IL")).toBe("Chicago, IL");
  });
});

// ─── formatDestination ──────────────────────────────────────────────────────

describe("formatDestination", () => {
  it("returns text and isPending=false for normal destination", () => {
    const result = formatDestination("Almaty, Kazakhstan");
    expect(result.text).toBe("Almaty, Kazakhstan");
    expect(result.isPending).toBe(false);
  });

  it("returns pending for TBD", () => {
    const result = formatDestination("TBD");
    expect(result.text).toBe("Destination pending");
    expect(result.isPending).toBe(true);
  });

  it("returns pending for ---", () => {
    const result = formatDestination("---");
    expect(result.isPending).toBe(true);
  });

  it("returns pending for empty string", () => {
    const result = formatDestination("");
    expect(result.isPending).toBe(true);
  });
});
