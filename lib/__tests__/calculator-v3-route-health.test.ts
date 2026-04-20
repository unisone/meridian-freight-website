import { describe, expect, it } from "vitest";

import { buildRouteCatalog } from "@/lib/calculator-v3/routes";
import { buildRouteHealthReport } from "@/lib/calculator-v3/route-health";
import type { OceanFreightRate } from "@/lib/types/calculator";

const oceanRates: OceanFreightRate[] = [
  {
    id: "ar-chicago-hapag",
    container_type: "fortyhc",
    origin_port: "Chicago, IL",
    destination_port: "Buenos Aires",
    destination_country: "AR",
    carrier: "HAPAG",
    ocean_rate: 2000,
    drayage: 1000,
    packing_drayage: null,
    transit_time_days: "25-32",
  },
  {
    id: "ar-houston-flatrack",
    container_type: "flatrack",
    origin_port: "Houston, TX",
    destination_port: "Buenos Aires",
    destination_country: "AR",
    carrier: "Maersk",
    ocean_rate: 3500,
    drayage: null,
    packing_drayage: 4000,
    transit_time_days: "28-35",
  },
  {
    id: "uy-chicago-maersk",
    container_type: "fortyhc",
    origin_port: "Chicago, IL",
    destination_port: "Montevideo",
    destination_country: "UY",
    carrier: "Maersk",
    ocean_rate: 2400,
    drayage: 900,
    packing_drayage: null,
    transit_time_days: "35-40",
  },
  {
    id: "ae-chicago-missing-transit",
    container_type: "fortyhc",
    origin_port: "Chicago, IL",
    destination_port: "Jebel Ali",
    destination_country: "AE",
    carrier: "HAPAG",
    ocean_rate: 4200,
    drayage: 800,
    packing_drayage: null,
    transit_time_days: null,
  },
  {
    id: "ar-savannah-typo",
    container_type: "flatrack",
    origin_port: "Savannah, TX",
    destination_port: "Buenos Aires",
    destination_country: "AR",
    carrier: "HAPAG",
    ocean_rate: 3100,
    drayage: null,
    packing_drayage: 4000,
    transit_time_days: "30-36",
  },
  {
    id: "na-unknown-origin",
    container_type: "fortyhc",
    origin_port: "Houston, TXX",
    destination_port: "Buenos Aires",
    destination_country: "NA",
    carrier: "HAPAG",
    ocean_rate: 2100,
    drayage: 1200,
    packing_drayage: null,
    transit_time_days: "22-28",
  },
  {
    id: "tz-missing-cost",
    container_type: "flatrack",
    origin_port: "Houston, TX",
    destination_port: "Buenos Aires",
    destination_country: "TZ",
    carrier: "CMA",
    ocean_rate: 3900,
    drayage: null,
    packing_drayage: null,
    transit_time_days: "40-45",
  },
];

describe("calculator V3 route health", () => {
  it("summarizes route coverage, transit coverage, quarantines, and unsupported countries", () => {
    const catalog = buildRouteCatalog(oceanRates);
    const report = buildRouteHealthReport(catalog);

    expect(report.routeHealthVersion).toBe("calculator-v3-route-health-2026-04-20");
    expect(report.summary).toEqual({
      routeCount: 3,
      quarantinedCount: 4,
      countryCount: 5,
      publicProfileCount: 8,
      publicModeCount: 10,
    });

    expect(report.routeCountsByCountry).toEqual([
      {
        country: "AR",
        routeCount: 2,
        fortyhcRouteCount: 1,
        flatrackRouteCount: 1,
        transitKnownCount: 2,
        transitMissingCount: 0,
        transitCoveragePercent: 100,
      },
      {
        country: "UY",
        routeCount: 1,
        fortyhcRouteCount: 1,
        flatrackRouteCount: 0,
        transitKnownCount: 1,
        transitMissingCount: 0,
        transitCoveragePercent: 100,
      },
    ]);

    expect(report.routeCountsByCountryAndContainer).toEqual([
      {
        country: "AR",
        containerType: "fortyhc",
        routeCount: 1,
        transitKnownCount: 1,
        transitMissingCount: 0,
        transitCoveragePercent: 100,
      },
      {
        country: "AR",
        containerType: "flatrack",
        routeCount: 1,
        transitKnownCount: 1,
        transitMissingCount: 0,
        transitCoveragePercent: 100,
      },
      {
        country: "UY",
        containerType: "fortyhc",
        routeCount: 1,
        transitKnownCount: 1,
        transitMissingCount: 0,
        transitCoveragePercent: 100,
      },
    ]);

    expect(report.transitCoverage.overall).toEqual({
      routeCount: 3,
      transitKnownCount: 3,
      transitMissingCount: 0,
      transitCoveragePercent: 100,
    });

    expect(report.missingTransitRows).toEqual([]);

    expect(report.quarantineCountsByReason).toEqual([
      { reason: "missing_cost", count: 1 },
      { reason: "missing_transit", count: 1 },
      { reason: "unknown_origin", count: 1 },
      { reason: "impossible_origin", count: 1 },
    ]);

    expect(report.countriesWithoutEligibleAutomaticRoute).toEqual([]);

    expect(report.dirtyQuarantinedRawPortStrings).toEqual([
      {
        field: "origin_port",
        value: "Houston, TXX",
        count: 1,
        reasons: [{ reason: "unknown_origin", count: 1 }],
        sourceRateIds: ["na-unknown-origin"],
      },
      {
        field: "origin_port",
        value: "Savannah, TX",
        count: 1,
        reasons: [{ reason: "impossible_origin", count: 1 }],
        sourceRateIds: ["ar-savannah-typo"],
      },
    ]);

    expect(report.warnings).toEqual([
      "1 rate row(s) have no approved transit time and are excluded from customer automatic quotes.",
      "4 row(s) were quarantined across 4 reason bucket(s).",
      "2 dirty raw port string(s) were quarantined for review.",
    ]);

    expect(report.criticalIssues).toEqual([]);
  });

  it("keeps a route-only lane clean when transit is present and no rows are quarantined", () => {
    const catalog = buildRouteCatalog([
      {
        id: "uy-chicago-only",
        container_type: "fortyhc",
        origin_port: "Chicago, IL",
        destination_port: "Montevideo",
        destination_country: "UY",
        carrier: "HAPAG",
        ocean_rate: 2800,
        drayage: 650,
        packing_drayage: null,
        transit_time_days: "35-40",
      },
    ]);

    const report = buildRouteHealthReport(catalog);

    expect(report.summary.routeCount).toBe(1);
    expect(report.missingTransitRows).toEqual([]);
    expect(report.quarantineCountsByReason).toEqual([]);
    expect(report.countriesWithoutEligibleAutomaticRoute).toEqual([]);
    expect(report.criticalIssues).toEqual([]);
  });
});
