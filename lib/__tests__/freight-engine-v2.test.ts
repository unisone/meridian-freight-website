import { describe, it, expect } from "vitest";
import {
  calculateFreightV2,
  adjustForUnit,
  haversineMiles,
  zipToCoords,
  estimateRoadMiles,
  findBestOceanRate,
  DRAYAGE_CHICAGO,
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

  it("sorts flatrack by ocean_rate + packing_drayage, not drayage", () => {
    // Two same-carrier rates where packing_drayage differs significantly
    const rates: OceanFreightRate[] = [
      {
        id: "t1", container_type: "flatrack", origin_port: "Houston, TX",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "HAPAG", ocean_rate: 3000, drayage: null,
        packing_drayage: 5000, transit_time_days: "30",
      },
      {
        id: "t2", container_type: "flatrack", origin_port: "Houston, TX",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "HAPAG", ocean_rate: 4000, drayage: null,
        packing_drayage: 500, transit_time_days: "30",
      },
    ];
    const best = findBestOceanRate(rates, "flatrack", "UY");
    expect(best).not.toBeNull();
    // t2 total = 4000+500 = 4500 < t1 total = 3000+5000 = 8000
    expect(best!.id).toBe("t2");
  });

  it("uses drayage (not packing_drayage) for 40HC sort", () => {
    const rates: OceanFreightRate[] = [
      {
        id: "h1", container_type: "fortyhc", origin_port: "Chicago, IL",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "HAPAG", ocean_rate: 2000, drayage: 3000,
        packing_drayage: 100, transit_time_days: "30",
      },
      {
        id: "h2", container_type: "fortyhc", origin_port: "Chicago, IL",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "HAPAG", ocean_rate: 3500, drayage: 200,
        packing_drayage: 9000, transit_time_days: "30",
      },
    ];
    const best = findBestOceanRate(rates, "fortyhc", "UY");
    expect(best).not.toBeNull();
    // h2 total = 3500+200 = 3700 < h1 total = 2000+3000 = 5000
    expect(best!.id).toBe("h2");
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
    // Flatrack: packing is INCLUDED in packing_drayage, not charged separately
    expect(est!.packingAndLoading).toBe(0);
    expect(est!.usInlandTransport).toBeNull();
    expect(est!.totalExcludesInland).toBe(true);
    // Ocean = best flatrack rate for UY (HAPAG preferred): ocean_rate + packing_drayage
    expect(est!.oceanFreight).toBe(5200 + 900); // HAPAG Savannah rate
    // Total = only ocean (no inland, no separate packing)
    expect(est!.estimatedTotal).toBe(5200 + 900);
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

  it("prefers carrier rank as tiebreaker when flatrack port totals are equal", () => {
    // Two rates from the same port with identical total cost but different carriers
    const tiedRates: OceanFreightRate[] = [
      {
        id: "tie1", container_type: "flatrack", origin_port: "Houston, TX",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "MSC", ocean_rate: 4000, drayage: null,
        packing_drayage: 1000, transit_time_days: "30",
      },
      {
        id: "tie2", container_type: "flatrack", origin_port: "Houston, TX",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "HAPAG", ocean_rate: 4000, drayage: null,
        packing_drayage: 1000, transit_time_days: "28",
      },
    ];
    // ZIP 77001 = Houston area → both rates go to same port with same cost
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "77001",
      oceanRates: tiedRates,
    });

    expect(est).not.toBeNull();
    // HAPAG (rank 0) should win over MSC (rank 3) as tiebreaker
    expect(est!.carrier).toBe("HAPAG");
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

// ---------------------------------------------------------------------------
// Formula Verification — hand-calculated dollar amounts
// ---------------------------------------------------------------------------

describe("Formula verification — 40HC exact calculations", () => {
  // 40HC formula per CLAUDE.md:
  //   Inland = (ZIP → Albion, IA × delivery_per_mile) + $1,800 Chicago drayage
  //   Packing = packing_cost × size (for variable) or packing_cost (for flat)
  //   Ocean = ocean_rate + drayage (HAPAG preferred)
  //   Total = Inland + Packing + Ocean

  it("total = inland + packing + ocean identity (tractor, UY, with ZIP)", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "50005",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    // Verify the identity: total must equal sum of components
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + est!.packingAndLoading + est!.oceanFreight
    );
  });

  it("total = inland + packing + ocean identity (corn header, CO, no ZIP)", () => {
    const est = calculateFreightV2({
      equipment: mockCornHeader,
      equipmentSize: 12,
      destinationCountry: "CO",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + est!.packingAndLoading + est!.oceanFreight
    );
  });

  it("packing: flat unit ignores size and uses base cost", () => {
    const est = calculateFreightV2({
      equipment: mockTractor, // flat, packing_cost = 5400
      equipmentSize: 99, // should be ignored for flat
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(5400); // not 5400 * 99
    expect(est!.packingBreakdown).toBeNull(); // no breakdown for flat
  });

  it("packing: per_row multiplies correctly", () => {
    const est = calculateFreightV2({
      equipment: mockCornHeader, // per_row, packing_cost = 140
      equipmentSize: 12,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(140 * 12); // $1,680
    expect(est!.packingBreakdown).toBe("$140/row × 12 rows = $1,680");
  });

  it("packing: per_foot multiplies correctly", () => {
    const est = calculateFreightV2({
      equipment: mockFlexHeader, // per_foot, packing_cost = 75
      equipmentSize: 25,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(75 * 25); // $1,875
    expect(est!.packingBreakdown).toBe("$75/foot × 25 feet = $1,875");
  });

  it("packing: null size falls back to base cost for variable unit", () => {
    const est = calculateFreightV2({
      equipment: mockCornHeader, // per_row, packing_cost = 140
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(140); // base cost, not multiplied
    expect(est!.packingBreakdown).toBeNull(); // no breakdown when no size
  });

  it("ocean: picks HAPAG over Maersk for UY (carrier preference)", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.carrier).toBe("HAPAG");
    expect(est!.oceanFreight).toBe(2800 + 650); // ocean_rate + drayage = $3,450
    expect(est!.originPort).toBe("Chicago, IL");
    expect(est!.destinationPort).toBe("Montevideo");
    expect(est!.transitTimeDays).toBe("35-40");
  });

  it("inland: no ZIP = Chicago drayage only ($1,800)", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.usInlandTransport).toBe(1800);
    expect(est!.distanceMiles).toBeNull();
    expect(est!.totalExcludesInland).toBe(false); // drayage still included
    expect(est!.notes).toContain("Inland transport includes Chicago drayage only. Enter ZIP for full estimate.");
  });

  it("inland: with ZIP = (miles × per_mile) + $1,800 drayage", () => {
    // ZIP 60401 (Illinois) → Albion, IA
    // ZIP prefix 604 = [40.70, -89.65]
    // Albion = [42.1172, -92.9835]
    // Haversine ~187mi × 1.3 = ~243 road miles
    // Inland = 243 × $6.50/mi + $1,800 = ~$3,380
    const est = calculateFreightV2({
      equipment: mockTractor, // delivery_per_mile = 6.5
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "60401",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.distanceMiles).not.toBeNull();
    expect(est!.distanceMiles!).toBeGreaterThan(200);
    expect(est!.distanceMiles!).toBeLessThan(300);
    // Verify formula: usInlandTransport = round(miles * per_mile + 1800)
    const expectedInland = Math.round(est!.distanceMiles! * 6.5 + 1800);
    expect(est!.usInlandTransport).toBe(expectedInland);
    // Verify total
    expect(est!.estimatedTotal).toBe(expectedInland + 5400 + 3450);
  });

  it("full hand-calculated: corn header 8 rows → Colombia, no ZIP", () => {
    // Equipment: mockCornHeader = per_row, packing_cost=140, delivery_per_mile=2.5
    // Packing = 140 * 8 = $1,120
    // Ocean = HAPAG CO rate: ocean_rate=2100 + drayage=2200 = $4,300
    // Inland = no ZIP → Chicago drayage = $1,800
    // Total = 1800 + 1120 + 4300 = $7,220
    const est = calculateFreightV2({
      equipment: mockCornHeader,
      equipmentSize: 8,
      destinationCountry: "CO",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(1120);
    expect(est!.oceanFreight).toBe(4300);
    expect(est!.usInlandTransport).toBe(1800);
    expect(est!.estimatedTotal).toBe(7220);
  });
});

describe("Formula verification — Flatrack exact calculations", () => {
  // Flatrack formula per CLAUDE.md:
  //   Inland = ZIP → nearest US port × delivery_per_mile
  //   Packing = $0 (included in packing_drayage)
  //   Ocean = ocean_rate + packing_drayage
  //   Total = Inland + 0 + Ocean

  it("total = inland + ocean identity (combine, UY, with ZIP)", () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "77001",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(0); // always 0 for flatrack
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + 0 + est!.oceanFreight
    );
  });

  it("packing is always 0 regardless of equipment.packing_cost", () => {
    // mockCombine has packing_cost = 8250, but flatrack ignores it
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(0);
    expect(est!.packingBreakdown).toBeNull();
  });

  it("no ZIP: total = ocean only, totalExcludesInland = true", () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.usInlandTransport).toBeNull();
    expect(est!.totalExcludesInland).toBe(true);
    expect(est!.notes).toContain("Enter US ZIP code for inland transport estimate.");
    // Ocean = HAPAG Savannah: 5200 + 900 = $6,100
    expect(est!.oceanFreight).toBe(6100);
    expect(est!.estimatedTotal).toBe(6100);
  });

  it("with ZIP near Houston: picks Houston port, minimal inland", () => {
    // ZIP 77001 = Houston area, [29.76, -95.37]
    // Houston port = [29.7604, -95.3698] → ~0 miles haversine × 1.3 → ~0 road miles
    // MSC Houston rate: ocean=4500 + packing_drayage=800 = $5,300
    // HAPAG Savannah: ocean=5200 + packing_drayage=900 = $6,100, BUT also ~800mi to Savannah
    //   Local cost to Savannah ≈ 800 * 10 = $8,000, total ≈ $14,100
    // Houston wins: total ≈ 0 + 5300 = ~$5,300
    const est = calculateFreightV2({
      equipment: mockCombine, // delivery_per_mile = 10
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "77001",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.originPort).toBe("Houston, TX");
    expect(est!.carrier).toBe("MSC");
    expect(est!.oceanFreight).toBe(4500 + 800); // $5,300
    expect(est!.distanceMiles!).toBeLessThan(10); // very close
    // Total = tiny inland + $5,300
    expect(est!.estimatedTotal).toBeLessThan(5400);
    expect(est!.estimatedTotal).toBeGreaterThanOrEqual(5300);
    expect(est!.totalExcludesInland).toBe(false);
  });

  it("with ZIP in Iowa: evaluates all 4 ports, picks cheapest total", () => {
    // ZIP 50005 = Albion, IA area [41.59, -93.62]
    // Distances to ports:
    //   Houston [29.76, -95.37]: ~830mi straight × 1.3 ≈ 1079mi → 1079*10 = $10,790
    //   Savannah [32.08, -81.09]: ~830mi × 1.3 ≈ 1079mi → $10,790
    //   Baltimore [39.29, -76.61]: ~800mi × 1.3 ≈ 1040mi → $10,400
    //   Charleston [32.78, -79.93]: ~870mi × 1.3 ≈ 1131mi → $11,310
    // Houston MSC: inland $10,790 + ocean $5,300 = ~$16,090
    // Savannah HAPAG: inland ~$10,790 + ocean $6,100 = ~$16,890
    // Should pick Houston (cheaper total)
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "50005",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.originPort).toBe("Houston, TX");
    expect(est!.oceanFreight).toBe(5300);
    expect(est!.usInlandTransport).not.toBeNull();
    // Total identity
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + 0 + est!.oceanFreight
    );
  });

  it("flatrack with ZIP: Colombia rate has correct ocean formula", () => {
    // Only one CO flatrack rate: Houston HAPAG, ocean=4985, packing_drayage=4000
    // ZIP 77001 = Houston area → ~0mi inland
    // Ocean = 4985 + 4000 = $8,985
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "CO",
      zipCode: "77001",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.oceanFreight).toBe(4985 + 4000); // $8,985
    expect(est!.carrier).toBe("HAPAG");
    expect(est!.originPort).toBe("Houston, TX");
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + 0 + est!.oceanFreight
    );
  });
});

describe("Formula verification — edge cases", () => {
  it("returns null when no ocean rates exist at all", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: [],
    });
    expect(est).toBeNull();
  });

  it("returns null when ocean rates exist but not for this destination", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "JP", // no JP rates in mock data
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).toBeNull();
  });

  it("handles zero packing_cost gracefully for 40HC", () => {
    const zeroPacking: EquipmentPackingRate = {
      ...mockTractor,
      packing_cost: 0,
    };
    const est = calculateFreightV2({
      equipment: zeroPacking,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(0);
    expect(est!.estimatedTotal).toBe(1800 + 0 + 3450); // $5,250
  });

  it("handles zero delivery_per_mile (free pickup)", () => {
    const freeDelivery: EquipmentPackingRate = {
      ...mockTractor,
      delivery_per_mile: 0,
    };
    const est = calculateFreightV2({
      equipment: freeDelivery,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "50005",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    // Inland = 0 * miles + $1,800 = $1,800
    expect(est!.usInlandTransport).toBe(1800);
  });

  it("destination country matching is case-insensitive", () => {
    const est1 = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "uy",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    const est2 = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est1).not.toBeNull();
    expect(est2).not.toBeNull();
    expect(est1!.estimatedTotal).toBe(est2!.estimatedTotal);
  });

  it("equipmentSize = 1 produces same as base cost for variable unit", () => {
    const est = calculateFreightV2({
      equipment: mockCornHeader, // per_row, packing_cost = 140
      equipmentSize: 1,
      destinationCountry: "UY",
      zipCode: null,
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.packingAndLoading).toBe(140); // 140 × 1
  });

  it("flatrack general fallback path when no port-specific rates match ZIP", () => {
    // Create rates that don't match any FLATRACK_PORTS by origin_port
    const nonPortRates: OceanFreightRate[] = [
      {
        id: "np1", container_type: "flatrack", origin_port: "Miami, FL",
        destination_port: "Montevideo", destination_country: "UY",
        carrier: "HAPAG", ocean_rate: 6000, drayage: null,
        packing_drayage: 1500, transit_time_days: "25",
      },
    ];
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "33101", // Miami ZIP
      oceanRates: nonPortRates,
    });
    expect(est).not.toBeNull();
    // Should use the general fallback (findBestOceanRate)
    expect(est!.carrier).toBe("HAPAG");
    expect(est!.oceanFreight).toBe(6000 + 1500); // $7,500
    // Still has inland since ZIP was provided
    expect(est!.totalExcludesInland).toBe(false);
    // Total identity holds
    expect(est!.estimatedTotal).toBe(
      est!.usInlandTransport! + 0 + est!.oceanFreight
    );
  });

  it("all output fields are populated for a complete 40HC estimate", () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "50005",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    // Every field must have a meaningful value
    expect(est!.containerType).toBe("fortyhc");
    expect(est!.equipmentDisplayName).toBe("Tractor 4WD");
    expect(typeof est!.usInlandTransport).toBe("number");
    expect(typeof est!.packingAndLoading).toBe("number");
    expect(typeof est!.oceanFreight).toBe("number");
    expect(typeof est!.estimatedTotal).toBe("number");
    expect(est!.carrier.length).toBeGreaterThan(0);
    expect(est!.originPort.length).toBeGreaterThan(0);
    expect(est!.destinationPort.length).toBeGreaterThan(0);
    expect(est!.destinationCountry).toBe("UY");
    expect(est!.deliveryRatePerMile).toBe(6.5);
    expect(est!.distanceMiles).not.toBeNull();
    expect(est!.totalExcludesInland).toBe(false);
    // No NaN anywhere
    expect(Number.isNaN(est!.usInlandTransport)).toBe(false);
    expect(Number.isNaN(est!.packingAndLoading)).toBe(false);
    expect(Number.isNaN(est!.oceanFreight)).toBe(false);
    expect(Number.isNaN(est!.estimatedTotal)).toBe(false);
  });

  it("all output fields are populated for a complete flatrack estimate with ZIP", () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: "UY",
      zipCode: "77001",
      oceanRates: mockOceanRates,
    });
    expect(est).not.toBeNull();
    expect(est!.containerType).toBe("flatrack");
    expect(est!.equipmentDisplayName).toBe("Combine - Small Series");
    expect(typeof est!.usInlandTransport).toBe("number");
    expect(est!.packingAndLoading).toBe(0);
    expect(typeof est!.oceanFreight).toBe("number");
    expect(typeof est!.estimatedTotal).toBe("number");
    expect(est!.carrier.length).toBeGreaterThan(0);
    expect(est!.originPort.length).toBeGreaterThan(0);
    expect(est!.destinationPort.length).toBeGreaterThan(0);
    expect(est!.totalExcludesInland).toBe(false);
    // No NaN
    expect(Number.isNaN(est!.usInlandTransport)).toBe(false);
    expect(Number.isNaN(est!.oceanFreight)).toBe(false);
    expect(Number.isNaN(est!.estimatedTotal)).toBe(false);
  });
});
