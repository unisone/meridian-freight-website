import { describe, expect, it } from "vitest";

import {
  getBookabilityState,
  getBookingDecision,
  normalizeScheduleRoute,
  toPublicScheduleContainer,
} from "@/lib/schedule-contract";
import type { ContainerWithPendingCount, SharedContainer } from "@/lib/types/shared-shipping";

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
    id: "fd04c519-3ed0-470f-a3f0-c9ca40d3d6b6",
    project_number: "MF-2026-001",
    origin: "Albion, IA",
    destination: "Almaty, Kazakhstan",
    destination_country: "KZ",
    departure_date: localDatePlusDays(10),
    eta_date: localDatePlusDays(40),
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
    ...makeSharedContainer(overrides),
    pending_count: overrides.pending_count ?? 0,
    ...overrides,
  };
}

describe("normalizeScheduleRoute", () => {
  it("cleans known misspellings and country inference", () => {
    const result = normalizeScheduleRoute(
      makeSharedContainer({
        origin: "Milfrod, IL",
        destination: "Almata, Kyrgystan",
        destination_country: null,
      }),
    );

    expect(result.originDisplay).toBe("Milford, IL");
    expect(result.destinationDisplay).toBe("Almaty, Kyrgyzstan");
    expect(result.countryCode).toBe("KG");
    expect(result.countryDisplay).toBe("Kyrgyzstan");
    expect(result.routeQuality).toBe("clean");
  });

  it("falls back when multiple US pickup locations leak into origin", () => {
    const result = normalizeScheduleRoute(
      makeSharedContainer({
        origin: "Savannah, GA Paris, MO Clutier, IA",
      }),
    );

    expect(result.originDisplay).toBe("Multiple US pickup locations");
    expect(result.routeQuality).toBe("fallback");
    expect(result.routeFallbackReason).toBe("multiple_origins");
  });

  it("treats TBD and US-port false destinations as pending", () => {
    expect(
      normalizeScheduleRoute(
        makeSharedContainer({
          destination: "TBD",
          destination_country: null,
        }),
      ),
    ).toMatchObject({
      destinationDisplay: "Destination pending",
      isDestinationPending: true,
      routeQuality: "pending",
    });

    expect(
      normalizeScheduleRoute(
        makeSharedContainer({
          destination: "Savannah, GA",
          destination_country: null,
        }),
      ),
    ).toMatchObject({
      destinationDisplay: "Destination pending",
      isDestinationPending: true,
      routeQuality: "pending",
    });
  });
});

describe("getBookabilityState", () => {
  it("marks future available containers with positive CBM as bookable", () => {
    expect(getBookabilityState(makeSharedContainer()).bookabilityStatus).toBe("bookable");
  });

  it("marks zero or null capacity as non-bookable", () => {
    expect(
      getBookabilityState(makeSharedContainer({ available_cbm: 0 })).bookabilityReason,
    ).toBe("no_capacity");
    expect(
      getBookabilityState(makeSharedContainer({ available_cbm: null })).bookabilityReason,
    ).toBe("no_capacity");
  });

  it("marks past departures as departed even if status is still available", () => {
    expect(
      getBookabilityState(
        makeSharedContainer({
          departure_date: localDatePlusDays(-1),
          eta_date: localDatePlusDays(20),
          status: "available",
        }),
      ),
    ).toMatchObject({
      shippingState: "in-transit",
      bookabilityStatus: "non-bookable",
      bookabilityReason: "departed",
    });
  });

  it("distinguishes cancelled and unlisted containers", () => {
    expect(
      getBookabilityState(makeSharedContainer({ status: "cancelled" })).bookabilityReason,
    ).toBe("cancelled");
    expect(
      getBookabilityState(makeSharedContainer({ status: "unlisted" })).bookabilityReason,
    ).toBe("unlisted");
  });
});

describe("getBookingDecision", () => {
  it("accepts matching bookable containers", () => {
    expect(getBookingDecision(makeSharedContainer(), "MF-2026-001")).toEqual({
      ok: true,
      shippingState: "upcoming",
      bookabilityStatus: "bookable",
      bookabilityReason: "available",
      rejectionCode: null,
    });
  });

  it("returns explicit rejection codes", () => {
    expect(getBookingDecision(null, "MF-2026-001").rejectionCode).toBe("CONTAINER_UNAVAILABLE");
    expect(
      getBookingDecision(makeSharedContainer(), "MF-2026-XYZ").rejectionCode,
    ).toBe("CONTAINER_MISMATCH");
    expect(
      getBookingDecision(
        makeSharedContainer({
          departure_date: localDatePlusDays(-1),
          eta_date: localDatePlusDays(20),
          status: "departed",
        }),
        "MF-2026-001",
      ).rejectionCode,
    ).toBe("CONTAINER_DEPARTED");
    expect(
      getBookingDecision(
        makeSharedContainer({ status: "full", available_cbm: 0 }),
        "MF-2026-001",
      ).rejectionCode,
    ).toBe("CONTAINER_FULL");
  });
});

describe("toPublicScheduleContainer", () => {
  it("hydrates a container with public route and bookability fields", () => {
    const publicContainer = toPublicScheduleContainer(
      makeContainerWithPending({
        origin: "ROLLED customs hold Albion,IA",
        destination: "Almata, Kazakhstan",
        destination_country: null,
      }),
      localDatePlusDays(0),
    );

    expect(publicContainer.originDisplay).toBe("Albion, IA");
    expect(publicContainer.destinationDisplay).toBe("Almaty, Kazakhstan");
    expect(publicContainer.destination_country).toBe("KZ");
    expect(publicContainer.countryDisplay).toBe("Kazakhstan");
    expect(publicContainer.bookabilityStatus).toBe("bookable");
  });
});
