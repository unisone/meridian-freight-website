import { describe, expect, it } from "vitest";

import {
  classifyContainers,
  computeCapacityFill,
  computeDepartureCountdown,
  computeScheduleStats,
  computeTabCounts,
  computeTransitProgress,
  deriveCountryList,
  filterContainers,
  shortDate,
} from "@/lib/schedule-display";
import { toPublicScheduleContainer } from "@/lib/schedule-contract";
import type { PublicScheduleContainer, SharedContainer } from "@/lib/types/shared-shipping";

function localDatePlusDays(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function makeSharedContainer(overrides: Partial<SharedContainer> = {}): SharedContainer {
  return {
    id: "0f67ce74-b9ea-42a2-978b-b0cd6afeb7ab",
    project_number: "MF-2026-001",
    origin: "Chicago, IL",
    destination: "Almaty, Kazakhstan",
    destination_country: "KZ",
    departure_date: localDatePlusDays(14),
    eta_date: localDatePlusDays(49),
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

function makePublicContainer(
  overrides: Partial<SharedContainer & { pending_count: number }> = {},
  today: string = localDatePlusDays(0),
): PublicScheduleContainer {
  return toPublicScheduleContainer(
    {
      ...makeSharedContainer(overrides),
      pending_count: overrides.pending_count ?? 0,
    },
    today,
  );
}

describe("computeTransitProgress", () => {
  it("returns null for null ETA", () => {
    expect(computeTransitProgress(localDatePlusDays(-5), null)).toBeNull();
  });

  it("returns progress for mid-transit container", () => {
    const result = computeTransitProgress(localDatePlusDays(-10), localDatePlusDays(25));
    expect(result).not.toBeNull();
    expect(result?.transitTotal).toBe(35);
    expect(result?.transitDay).toBeGreaterThanOrEqual(9);
    expect(result?.transitDay).toBeLessThanOrEqual(11);
    expect(result?.progressPercent).toBeGreaterThan(20);
    expect(result?.progressPercent).toBeLessThan(40);
  });

  it("returns 100% for arrived container", () => {
    const result = computeTransitProgress(localDatePlusDays(-40), localDatePlusDays(-5));
    expect(result?.progressPercent).toBe(100);
  });
});

describe("computeScheduleStats", () => {
  it("computes countries, transit, and bookable counts from the public contract", () => {
    const today = localDatePlusDays(0);
    const containers = [
      makePublicContainer({ destination: "Almaty, Kazakhstan", destination_country: null }, today),
      makePublicContainer({ destination: "Santos, Brazil", destination_country: "BR" }, today),
      makePublicContainer(
        {
          destination: "Montevideo, Uruguay",
          destination_country: "UY",
          departure_date: localDatePlusDays(-10),
          eta_date: localDatePlusDays(20),
          status: "departed",
        },
        today,
      ),
      makePublicContainer(
        {
          departure_date: localDatePlusDays(-40),
          eta_date: localDatePlusDays(-5),
          status: "departed",
        },
        today,
      ),
    ];

    const stats = computeScheduleStats(containers);
    expect(stats.countriesServed).toBe(3);
    expect(stats.inTransitNow).toBe(1);
    expect(stats.bookableContainers).toBe(2);
  });

  it("handles empty arrays", () => {
    expect(computeScheduleStats([])).toEqual({
      containersThisMonth: 0,
      countriesServed: 0,
      inTransitNow: 0,
      bookableContainers: 0,
    });
  });
});

describe("computeTabCounts", () => {
  it("counts tabs using shipping state instead of raw status", () => {
    const today = localDatePlusDays(0);
    const counts = computeTabCounts([
      makePublicContainer({ status: "available" }, today),
      makePublicContainer({ status: "full" }, today),
      makePublicContainer(
        {
          status: "departed",
          departure_date: localDatePlusDays(-10),
          eta_date: localDatePlusDays(20),
        },
        today,
      ),
      makePublicContainer(
        {
          status: "departed",
          departure_date: localDatePlusDays(-40),
          eta_date: localDatePlusDays(-5),
        },
        today,
      ),
    ]);

    expect(counts).toEqual({
      all: 4,
      upcoming: 2,
      "in-transit": 1,
      delivered: 1,
    });
  });
});

describe("deriveCountryList", () => {
  it("uses normalized country codes and display names", () => {
    const today = localDatePlusDays(0);
    const countries = deriveCountryList([
      makePublicContainer({ destination: "Astana, Kazakhstan", destination_country: null }, today),
      makePublicContainer({ destination: "Santos, Brazil", destination_country: "BR" }, today),
      makePublicContainer({ destination: "Almaty, Kazakhstan", destination_country: "KZ" }, today),
    ]);

    expect(countries).toEqual([
      { code: "BR", name: "Brazil" },
      { code: "KZ", name: "Kazakhstan" },
    ]);
  });
});

describe("classifyContainers", () => {
  it("routes bookable, non-bookable, transit, and delivered containers correctly", () => {
    const today = localDatePlusDays(0);
    const result = classifyContainers([
      makePublicContainer({ id: "bookable", available_cbm: 20 }, today),
      makePublicContainer({ id: "full", status: "full", available_cbm: 0 }, today),
      makePublicContainer(
        {
          id: "transit",
          status: "departed",
          departure_date: localDatePlusDays(-12),
          eta_date: localDatePlusDays(18),
        },
        today,
      ),
      makePublicContainer(
        {
          id: "delivered",
          status: "departed",
          departure_date: localDatePlusDays(-40),
          eta_date: localDatePlusDays(-4),
        },
        today,
      ),
    ]);

    expect(result.bookable.map((container) => container.id)).toEqual(["bookable"]);
    expect(result.nonBookableUpcoming.map((container) => container.id)).toEqual(["full"]);
    expect(result.inTransit.map((container) => container.id)).toEqual(["transit"]);
    expect(result.delivered.map((container) => container.id)).toEqual(["delivered"]);
  });

  it("keeps same-day departures in the bookable bucket", () => {
    const today = localDatePlusDays(0);
    const result = classifyContainers([
      makePublicContainer(
        {
          id: "today",
          departure_date: today,
          available_cbm: 12,
          status: "available",
        },
        today,
      ),
    ]);

    expect(result.bookable.map((container) => container.id)).toEqual(["today"]);
  });
});

describe("filterContainers", () => {
  it("filters by country and tab using the normalized contract", () => {
    const today = localDatePlusDays(0);
    const containers = [
      makePublicContainer({ id: "kz-upcoming", destination_country: "KZ" }, today),
      makePublicContainer(
        {
          id: "kz-transit",
          destination_country: "KZ",
          departure_date: localDatePlusDays(-10),
          eta_date: localDatePlusDays(15),
          status: "departed",
        },
        today,
      ),
      makePublicContainer({ id: "br-upcoming", destination_country: "BR" }, today),
    ];

    expect(filterContainers(containers, "all", "KZ").map((container) => container.id)).toEqual([
      "kz-upcoming",
      "kz-transit",
    ]);
    expect(
      filterContainers(containers, "in-transit", "KZ").map((container) => container.id),
    ).toEqual(["kz-transit"]);
    expect(
      filterContainers(containers, "upcoming", "BR").map((container) => container.id),
    ).toEqual(["br-upcoming"]);
  });
});

describe("display helpers", () => {
  it("formats valid dates", () => {
    expect(shortDate("2026-06-15")).toMatch(/^\S+\s+\d{1,2}$/);
  });

  it("returns em dash for invalid dates", () => {
    expect(shortDate("invalid")).toBe("—");
  });

  it("computes capacity fill", () => {
    expect(computeCapacityFill(19, 76)).toEqual({
      fillPercent: 75,
      label: "75%",
    });
  });

  it("computes departure urgency", () => {
    expect(computeDepartureCountdown(localDatePlusDays(-2)).urgency).toBe("past");
    expect(computeDepartureCountdown(localDatePlusDays(0)).urgency).toBe("today");
    expect(computeDepartureCountdown(localDatePlusDays(2)).urgency).toBe("urgent");
    expect(computeDepartureCountdown(localDatePlusDays(5)).urgency).toBe("soon");
    expect(computeDepartureCountdown(localDatePlusDays(10)).urgency).toBe("normal");
  });
});
