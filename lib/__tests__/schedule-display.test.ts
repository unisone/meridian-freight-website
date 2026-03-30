import { describe, it, expect } from "vitest";
import type { SharedContainer, ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import {
  deriveScheduleStatus,
  computeTransitProgress,
  computeScheduleStats,
  computeTabCounts,
  deriveCountryList,
  classifyContainers,
  shortDate,
} from "@/lib/schedule-display";

// ─── Test Helpers ────────────────────────────────────────────────────────────

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
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

// ─── deriveScheduleStatus ────────────────────────────────────────────────────

describe("deriveScheduleStatus", () => {
  it("returns 'scheduled' for available container departing > 7 days", () => {
    const c = makeContainer({ status: "available", departure_date: daysFromNow(14) });
    expect(deriveScheduleStatus(c)).toBe("scheduled");
  });

  it("returns 'departing-soon' for available container departing ≤ 7 days", () => {
    const c = makeContainer({ status: "available", departure_date: daysFromNow(3) });
    expect(deriveScheduleStatus(c)).toBe("departing-soon");
  });

  it("returns 'departing-soon' for available container departing today", () => {
    const c = makeContainer({ status: "available", departure_date: daysFromNow(0) });
    expect(deriveScheduleStatus(c)).toBe("departing-soon");
  });

  it("returns 'fully-booked' for full container with future departure", () => {
    const c = makeContainer({ status: "full", departure_date: daysFromNow(10) });
    expect(deriveScheduleStatus(c)).toBe("fully-booked");
  });

  it("returns 'in-transit' for departed container with future ETA", () => {
    const c = makeContainer({
      status: "departed",
      departure_date: daysFromNow(-10),
      eta_date: daysFromNow(25),
    });
    expect(deriveScheduleStatus(c)).toBe("in-transit");
  });

  it("returns 'in-transit' for departed container with null ETA", () => {
    const c = makeContainer({
      status: "departed",
      departure_date: daysFromNow(-10),
      eta_date: null,
    });
    expect(deriveScheduleStatus(c)).toBe("in-transit");
  });

  it("returns 'arrived' for departed container with past ETA", () => {
    const c = makeContainer({
      status: "departed",
      departure_date: daysFromNow(-40),
      eta_date: daysFromNow(-5),
    });
    expect(deriveScheduleStatus(c)).toBe("arrived");
  });

  it("returns 'arrived' for departed container with today as ETA", () => {
    const c = makeContainer({
      status: "departed",
      departure_date: daysFromNow(-30),
      eta_date: daysFromNow(0),
    });
    expect(deriveScheduleStatus(c)).toBe("arrived");
  });
});

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
});
