import { describe, it, expect } from "vitest";
import {
  calculateFreightV2,
  adjustForUnit,
  haversineMiles,
  zipToCoords,
  estimateRoadMiles,
  findBestOceanRate,
  DELIVERY_PER_MILE,
  DRAYAGE_CHICAGO,
  FLATRACK_PORTS,
} from "@/lib/freight-engine-v2";
import type {
  EquipmentPackingRate,
  OceanFreightRate,
} from "@/lib/types/calculator";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockCombine: EquipmentPackingRate = {
  id: "1",
  equipment_category: "combine",
  equipment_type: "combine_small",
  display_name_en: "Combine - Small Series",
  models: "S660, S670",
  delivery_per_mile: 10,
  packing_cost: 8250,
  packing_unit: "flat",
  wash_usda_cost: 900,
  container_type: "flatrack",
};

const mockCornHeader: EquipmentPackingRate = {
  id: "2",
  equipment_category: "header",
  equipment_type: "header_corn",
  display_name_en: "Corn Header",
  models: "Various",
  delivery_per_mile: 2.5,
  packing_cost: 140,
  packing_unit: "per_row",
  wash_usda_cost: 40,
  container_type: "fortyhc",
};

const mockFlexHeader: EquipmentPackingRate = {
  id: "3",
  equipment_category: "header",
  equipment_type: "header_flex_rigid_30",
  display_name_en: "Flex Header up to 30'",
  models: "925, 930",
  delivery_per_mile: 2.5,
  packing_cost: 75,
  packing_unit: "per_foot",
  wash_usda_cost: 20,
  container_type: "fortyhc",
};

const mockTractor: EquipmentPackingRate = {
  id: "4",
  equipment_category: "tractor",
  equipment_type: "tractor_4wd",
  display_name_en: "Tractor 4WD",
  models: "8R Series",
  delivery_per_mile: 6.5,
  packing_cost: 5400,
  packing_unit: "flat",
  wash_usda_cost: 700,
  container_type: "fortyhc",
};

const mockOceanRates: OceanFreightRate[] = [
  // 40HC routes from Chicago
  {
    id: "o1", container_type: "fortyhc", origin_port: "Chicago, IL",
    destination_port: "Montevideo", destination_country: "UY",
    carrier: "HAPAG", ocean_rate: 2800, drayage: 650,
    packing_drayage: null, transit_time_days: "35-40",
  },
  {
    id: "o2", container_type: "fortyhc", origin_port: "Chicago, IL",
    destination_port: "Montevideo", destination_country: "UY",
    carrier: "Maersk", ocean_rate: 2900, drayage: 700,
    packing_drayage: null, transit_time_days: "38-42",
  },
  {
    id: "o3", container_type: "fortyhc", origin_port: "Chicago, IL",
    destination_port: "Cartagena", destination_country: "CO",
    carrier: "HAPAG", ocean_rate: 2100, drayage: 2200,
    packing_drayage: null, transit_time_days: "25-30",
  },
  // Flatrack routes from multiple ports
  {
    id: "o4", container_type: "flatrack", origin_port: "Houston, TX",
    destination_port: "Montevideo", destination_country: "UY",
    carrier: "MSC", ocean_rate: 4500, drayage: null,
    packing_drayage: 800, transit_time_days: "30-35",
  },
  {
    id: "o5", container_type: "flatrack", origin_port: "Savannah, GA",
    destination_port: "Montevideo", destination_country: "UY",
    carrier: "HAPAG", ocean_rate: 5200, drayage: null,
    packing_drayage: 900, transit_time_days: "28-33",
  },
  {
    id: "o6", container_type: "flatrack", origin_port: "Houston, TX",
    destination_port: "Cartagena", destination_country: "CO",
    carrier: "HAPAG", ocean_rate: 4985, drayage: null,
    packing_drayage: 4000, transit_time_days: "15-20",
  },
];

// ---------------------------------------------------------------------------
// adjustForUnit
// ---------------------------------------------------------------------------

describe("adjustForUnit", () => {
  it("returns base cost for flat unit", () => {
    expect(adjustForUnit(8250, "flat", null)).toBe(8250);
    expect(adjustForUnit(8250, "flat", 5)).toBe(8250);
  });

  it("multiplies by size for per_row", () => {
    expect(adjustForUnit(140, "per_row", 8)).toBe(1120);
  });

  it("multiplies by size for per_foot", () => {
    expect(adjustForUnit(75, "per_foot", 30)).toBe(2250);
  });

  it("multiplies by size for per_shank", () => {
    expect(adjustForUnit(315, "per_shank", 5)).toBe(1575);
  });

  it("multiplies by size for per_bottom", () => {
    expect(adjustForUnit(150, "per_bottom", 4)).toBe(600);
  });

  it("returns base cost when size is null", () => {
    expect(adjustForUnit(140, "per_row", null)).toBe(140);
  });

  it("returns base cost when size is 0", () => {
    expect(adjustForUnit(140, "per_row", 0)).toBe(140);
  });
});

// ---------------------------------------------------------------------------
// Haversine & ZIP functions
// ---------------------------------------------------------------------------

describe("haversineMiles", () => {
  it("returns 0 for identical points", () => {
    expect(haversineMiles(42.0, -93.0, 42.0, -93.0)).toBe(0);
  });

  it("returns reasonable distance for Albion,IA → Chicago", () => {
    const d = haversineMiles(42.1172, -92.9835, 41.8781, -87.6298);
    // Straight-line ~280 miles
    expect(d).toBeGreaterThan(250);
    expect(d).toBeLessThan(320);
  });
});

describe("zipToCoords", () => {
  it("returns Iowa coords for ZIP 50005 (Albion)", () => {
    const coords = zipToCoords("50005");
    expect(coords).not.toBeNull();
    expect(coords![0]).toBeCloseTo(41.59, 1); // lat
    expect(coords![1]).toBeCloseTo(-93.62, 1); // lon
  });

  it("returns Houston coords for ZIP 77001", () => {
    const coords = zipToCoords("77001");
    expect(coords).not.toBeNull();
    expect(coords![0]).toBeCloseTo(29.76, 1);
  });

  it("falls back to region for unknown 3-digit prefix", () => {
    const coords = zipToCoords("99999"); // West Coast region
    expect(coords).not.toBeNull();
    expect(coords![0]).toBeCloseTo(37.77, 1); // San Francisco
  });

  it("returns null for empty string", () => {
    expect(zipToCoords("")).toBeNull();
    expect(zipToCoords(null)).toBeNull();
  });
});

describe("estimateRoadMiles", () => {
  it("returns short distance for Albion ZIP to Albion coords", () => {
    const miles = estimateRoadMiles("50005", 42.1172, -92.9835);
    // ZIP 500 coords ≈ [41.59, -93.62], Albion ≈ [42.12, -92.98]
    // Haversine ~45mi × 1.3 ≈ 58mi
    expect(miles).toBeGreaterThan(30);
    expect(miles).toBeLessThan(100);
  });

  it("returns 0 for empty ZIP", () => {
    expect(estimateRoadMiles("", 42.0, -93.0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// findBestOceanRate
// ---------------------------------------------------------------------------

describe("findBestOceanRate", () => {
  it("prefers HAPAG over Maersk for same destination", () => {
    const best = findBestOceanRate(mockOceanRates, "fortyhc", "UY");
    expect(best).not.toBeNull();
    expect(best!.carrier).toBe("HAPAG");
    expect(best!.ocean_rate).toBe(2800);
  });

  it("returns null for unknown destination", () => {
    expect(findBestOceanRate(mockOceanRates, "fortyhc", "XX")).toBeNull();
  });

  it("finds flatrack rates", () => {
    const best = findBestOceanRate(mockOceanRates, "flatrack", "UY");
    expect(best).not.toBeNull();
    // HAPAG from Savannah should be preferred over MSC from Houston
    expect(best!.carrier).toBe("HAPAG");
  });
});

// ---------------------------------------------------------------------------
// calculateFreightV2 — 40HC
// ---------------------------------------------------------------------------

describe("calculateFreightV2 — 40HC", () => {
  it("calculates fixed-price tractor to Uruguay with ZIP", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "50005", // Albion area
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est!.containerType).toBe("fortyhc");
    expect(est!.packingAndLoading).toBe(5400);
    expect(est!.oceanFreight).toBe(2800 + 650); // HAPAG rate + drayage
    expect(est!.carrier).toBe("HAPAG");
    expect(est!.originPort).toBe("Chicago, IL");
    expect(est!.usInlandTransport).toBeGreaterThan(DRAYAGE_CHICAGO); // distance + drayage
    expect(est!.totalExcludesInland).toBe(false);
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + est!.packingAndLoading + est!.oceanFreight
    );
  });

  it("calculates variable-price corn header (8 rows) to Colombia", () => {
    const est = calculateFreightV2({
      equipment: mockCornHeader,
      equipmentSize: 8,
      destinationCountry: "CO",
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(140 * 8); // $1,120
    expect(est!.packingBreakdown).toContain("$140/row");
    expect(est!.packingBreakdown).toContain("8 rows");
    expect(est!.packingBreakdown).toContain("$1,120");
    expect(est!.usInlandTransport).toBe(DRAYAGE_CHICAGO); // no ZIP = Chicago drayage only
    expect(est!.oceanFreight).toBe(2100 + 2200); // HAPAG CO rate + drayage
  });

  it("calculates flex header (30 feet) to Uruguay", () => {
    const est = calculateFreightV2({
      equipment: mockFlexHeader,
      equipmentSize: 30,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(75 * 30); // $2,250
    expect(est!.packingBreakdown).toContain("$75/foot");
    expect(est!.packingBreakdown).toContain("30 feet");
  });

  it("uses Chicago drayage when no ZIP provided", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est!.usInlandTransport).toBe(DRAYAGE_CHICAGO);
  });

  it("returns null for unknown destination", () => {
    expect(calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "XX",
      zipCode: null,
      oceanRates: mockOceanRates,
    })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// calculateFreightV2 — Flatrack
// ---------------------------------------------------------------------------

describe("calculateFreightV2 — Flatrack", () => {
  it("calculates combine to Uruguay without ZIP", () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est!.containerType).toBe("flatrack");
    expect(est!.packingAndLoading).toBe(8250);
    expect(est!.usInlandTransport).toBeNull();
    expect(est!.totalExcludesInland).toBe(true);
    // Ocean = best flatrack rate for UY (HAPAG preferred)
    expect(est!.oceanFreight).toBe(5200 + 900); // HAPAG Savannah rate
  });

  it("picks cheapest port with ZIP for flatrack", () => {
    // ZIP 77001 = Houston area → Houston port should be cheapest
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "77001",
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est!.containerType).toBe("flatrack");
    expect(est!.usInlandTransport).not.toBeNull();
    expect(est!.totalExcludesInland).toBe(false);
    // Houston is closest to ZIP 77001 → minimal local transport
    expect(est!.distanceMiles).toBeLessThan(50);
  });

  it("returns null for flatrack with no matching country rates", () => {
    expect(calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "XX",
      zipCode: null,
      oceanRates: mockOceanRates,
    })).toBeNull();
  });
});
