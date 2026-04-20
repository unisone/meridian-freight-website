import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { calculateFreightV3, assertCalculatorV3Policy } from "@/lib/calculator-v3/engine";
import { EQUIPMENT_QUOTE_PROFILES } from "@/lib/calculator-v3/policy";
import { buildRouteCatalog, selectRoute } from "@/lib/calculator-v3/routes";
import type { EquipmentPackingRate, OceanFreightRate } from "@/lib/types/calculator";

const combineRate: EquipmentPackingRate = {
  id: "eq-combine",
  equipment_category: "combine",
  equipment_type: "combine_small",
  display_name_en: "Combine (small)",
  models: "S660, S670",
  delivery_per_mile: 10,
  packing_cost: 0,
  packing_unit: "flat",
  wash_usda_cost: 2300,
  container_type: "flatrack",
};

const headerRate: EquipmentPackingRate = {
  id: "eq-header",
  equipment_category: "header",
  equipment_type: "header_flex_rigid",
  display_name_en: "Flex / rigid header",
  models: "HydraFlex",
  delivery_per_mile: 6,
  packing_cost: 140,
  packing_unit: "flat",
  wash_usda_cost: 40,
  container_type: "fortyhc",
};

const tractorRate: EquipmentPackingRate = {
  id: "eq-tractor",
  equipment_category: "tractor",
  equipment_type: "tractor_4wd",
  display_name_en: "4WD Tractor",
  models: "8R",
  delivery_per_mile: 6.5,
  packing_cost: 5400,
  packing_unit: "flat",
  wash_usda_cost: 700,
  container_type: "fortyhc",
};

const planterRate: EquipmentPackingRate = {
  id: "eq-planter",
  equipment_category: "planter",
  equipment_type: "planter",
  display_name_en: "Planter",
  models: "1775NT",
  delivery_per_mile: 6,
  packing_cost: 3200,
  packing_unit: "flat",
  wash_usda_cost: 500,
  container_type: "fortyhc",
};

const equipmentRates = [combineRate, headerRate, tractorRate, planterRate];

const oceanRates: OceanFreightRate[] = [
  {
    id: "uy-chicago-hapag",
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
  {
    id: "uy-chicago-fast",
    container_type: "fortyhc",
    origin_port: "Chicago, IL",
    destination_port: "Montevideo",
    destination_country: "UY",
    carrier: "Maersk",
    ocean_rate: 3600,
    drayage: 700,
    packing_drayage: null,
    transit_time_days: "22-25",
  },
  {
    id: "ar-houston-fr",
    container_type: "flatrack",
    origin_port: "Houston,TX",
    destination_port: "BUENOS AIRES",
    destination_country: "AR",
    carrier: "MSC",
    ocean_rate: 6000,
    drayage: null,
    packing_drayage: 4000,
    transit_time_days: "30-36",
  },
  {
    id: "ar-savannah-typo",
    container_type: "flatrack",
    origin_port: "Savannah, TX",
    destination_port: "Zarate",
    destination_country: "AR",
    carrier: "HAPAG",
    ocean_rate: 6800,
    drayage: null,
    packing_drayage: 4000,
    transit_time_days: "28-34",
  },
  {
    id: "py-houston-fr",
    container_type: "flatrack",
    origin_port: "Houston, TX",
    destination_port: "Asuncion",
    destination_country: "PY",
    carrier: "HAPAG",
    ocean_rate: 7000,
    drayage: null,
    packing_drayage: 4000,
    transit_time_days: "34-40",
  },
  {
    id: "py-chicago-40hc",
    container_type: "fortyhc",
    origin_port: "Chicago, IL",
    destination_port: "Asuncion",
    destination_country: "PY",
    carrier: "HAPAG",
    ocean_rate: 3100,
    drayage: 900,
    packing_drayage: null,
    transit_time_days: "32-38",
  },
  {
    id: "dirty-direct-40hc",
    container_type: "fortyhc",
    origin_port: "Houston, TX",
    destination_port: "Montevideo",
    destination_country: "UY",
    carrier: "MSC",
    ocean_rate: 100,
    drayage: 100,
    packing_drayage: null,
    transit_time_days: "12",
  },
];

describe("calculator V3 policy contracts", () => {
  it("validates policy and image references", () => {
    assertCalculatorV3Policy();
    for (const profile of EQUIPMENT_QUOTE_PROFILES) {
      expect(profile.label.en).toBeTruthy();
      expect(profile.label.es).toBeTruthy();
      expect(profile.label.ru).toBeTruthy();
      expect(
        existsSync(path.join(process.cwd(), "public", profile.image.replace(/^\//, ""))),
      ).toBe(true);
    }
  });
});

describe("calculator V3 route catalog", () => {
  it("normalizes raw route rows and quarantines unsupported direct 40HC rows", () => {
    const catalog = buildRouteCatalog(oceanRates);
    expect(catalog.routes.some((route) => route.origin.label === "Savannah, GA")).toBe(true);
    expect(
      catalog.routes.some((route) => route.origin.label.includes("Savannah, TX")),
    ).toBe(false);
    expect(catalog.quarantined).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceRateId: "dirty-direct-40hc",
          reason: "unsupported_direct_40hc",
        }),
      ]),
    );
  });

  it("selects fastest route only from routes with transit times", () => {
    const catalog = buildRouteCatalog(oceanRates);
    const route = selectRoute({
      routes: catalog.routes,
      containerType: "fortyhc",
      destinationCountry: "UY",
      preference: "fastest",
    });
    expect(route?.id).toContain("uy-chicago-fast");
  });
});

describe("calculateFreightV3", () => {
  it("prices a containerized combine as two 40HC containers with UY wash separate from import cost", () => {
    const estimate = calculateFreightV3({
      equipmentRates,
      oceanRates,
      equipmentProfileId: "combines",
      modeId: "container",
      quantity: 1,
      equipmentValueUsd: 100000,
      destinationCountry: "UY",
      destinationPortKey: "montevideo",
      routeId: null,
      routePreference: "cheapest",
      zipCode: null,
    });

    expect(estimate).not.toBeNull();
    expect(estimate?.containerType).toBe("fortyhc");
    expect(estimate?.pricedContainerCount).toBe(2);
    expect(estimate?.oceanFreight).toBe(6900);
    expect(estimate?.packingAndLoading).toBe(8250);
    expect(estimate?.complianceServices).toBe(2300);
    expect(estimate?.freightTotal).toBe(17450);
    expect(estimate?.importCost.available).toBe(true);
    expect(estimate?.importCost.amountUsd).not.toBe(estimate?.freightTotal);
    expect(estimate?.notes.map((entry) => entry.en).join(" ")).toContain(
      "two 40HC containers",
    );
  });

  it("prices one header as a quarter shared 40HC and shows dedicated comparison", () => {
    const estimate = calculateFreightV3({
      equipmentRates,
      oceanRates,
      equipmentProfileId: "headers",
      modeId: "container",
      quantity: 1,
      equipmentValueUsd: 15000,
      destinationCountry: "UY",
      destinationPortKey: "montevideo",
      routeId: null,
      routePreference: "cheapest",
      zipCode: null,
    });

    expect(estimate).not.toBeNull();
    expect(estimate?.pricedContainerCount).toBe(0.25);
    expect(estimate?.dedicatedContainerCount).toBe(1);
    expect(estimate?.oceanFreight).toBe(863);
    expect(estimate?.dedicatedContainerFreightTotal).toBeGreaterThan(
      estimate?.freightTotal ?? 0,
    );
  });

  it("falls back to cheapest with a warning when fastest route has no transit data", () => {
    const ratesWithoutTransit = oceanRates.map((rate) =>
      rate.destination_country === "UY"
        ? { ...rate, transit_time_days: null }
        : rate,
    );

    const estimate = calculateFreightV3({
      equipmentRates,
      oceanRates: ratesWithoutTransit,
      equipmentProfileId: "headers",
      modeId: "container",
      quantity: 4,
      equipmentValueUsd: 15000,
      destinationCountry: "UY",
      destinationPortKey: "montevideo",
      routeId: null,
      routePreference: "fastest",
      zipCode: null,
    });

    expect(estimate).not.toBeNull();
    expect(estimate?.route.sourceRateId).toBe("uy-chicago-hapag");
    expect(estimate?.pricedContainerCount).toBe(1);
    expect(estimate?.warnings.map((entry) => entry.en).join(" ")).toContain(
      "no published transit time",
    );
  });

  it("includes Argentina wash and fumigation service allowances in freight total", () => {
    const estimate = calculateFreightV3({
      equipmentRates,
      oceanRates,
      equipmentProfileId: "combines",
      modeId: "whole",
      quantity: 1,
      equipmentValueUsd: 120000,
      destinationCountry: "AR",
      destinationPortKey: "buenos_aires",
      routeId: null,
      routePreference: "cheapest",
      zipCode: null,
    });

    expect(estimate).not.toBeNull();
    expect(estimate?.containerType).toBe("flatrack");
    expect(estimate?.complianceServices).toBe(2950);
    expect(estimate?.lineItems.map((line) => line.id)).toEqual(
      expect.arrayContaining(["wash", "fumigation"]),
    );
    expect(estimate?.importCost.available).toBe(true);
  });

  it("does not add Paraguay wash or treatment charges and hides missing tariff profiles", () => {
    const estimate = calculateFreightV3({
      equipmentRates,
      oceanRates,
      equipmentProfileId: "planting-seeding",
      modeId: "container",
      quantity: 1,
      equipmentValueUsd: 45000,
      destinationCountry: "PY",
      destinationPortKey: "asuncion",
      routeId: null,
      routePreference: "cheapest",
      zipCode: null,
    });

    expect(estimate).not.toBeNull();
    expect(estimate?.complianceServices).toBe(0);
    expect(estimate?.lineItems.map((line) => line.id)).not.toContain("wash");
    expect(estimate?.importCost.available).toBe(false);
    expect(estimate?.freightTotal).toBeGreaterThan(0);
  });
});
