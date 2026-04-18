import { describe, expect, it } from 'vitest';

import {
  adjustForUnit,
  calculateFreightV2,
  estimateRoadMiles,
  findBestOceanRate,
  haversineMiles,
  zipToCoords,
} from '@/lib/freight-engine-v2';
import {
  FLATRACK_INSURANCE_MIN_USD,
  FLATRACK_INTERNAL_BUNDLE_USD,
  FLATRACK_NCB_BY_POL,
  FORTYHC_ORIGIN_PORT,
  STANDARD_INLAND_DELIVERY_RATE,
  resolveQuoteContainerType,
} from '@/lib/freight-policy';
import type { EquipmentPackingRate, OceanFreightRate } from '@/lib/types/calculator';

const mockCombine: EquipmentPackingRate = {
  id: '1',
  equipment_category: 'combine',
  equipment_type: 'combine_small',
  display_name_en: 'Combine - Small Series',
  models: 'S660, S670',
  delivery_per_mile: 10,
  packing_cost: 8250,
  packing_unit: 'flat',
  wash_usda_cost: 900,
  container_type: 'fortyhc',
};

const mockCornHeader: EquipmentPackingRate = {
  id: '2',
  equipment_category: 'header',
  equipment_type: 'header_corn',
  display_name_en: 'Corn Header',
  models: 'Various',
  delivery_per_mile: 2.5,
  packing_cost: 140,
  packing_unit: 'per_row',
  wash_usda_cost: 40,
  container_type: 'flatrack',
};

const mockTractor: EquipmentPackingRate = {
  id: '3',
  equipment_category: 'tractor',
  equipment_type: 'tractor_4wd',
  display_name_en: 'Tractor 4WD',
  models: '8R Series',
  delivery_per_mile: 6.5,
  packing_cost: 5400,
  packing_unit: 'flat',
  wash_usda_cost: 700,
  container_type: 'fortyhc',
};

const mockOceanRates: OceanFreightRate[] = [
  {
    id: 'o1',
    container_type: 'fortyhc',
    origin_port: 'Chicago, IL',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'HAPAG',
    ocean_rate: 2800,
    drayage: 650,
    packing_drayage: null,
    transit_time_days: '35-40',
  },
  {
    id: 'o2',
    container_type: 'fortyhc',
    origin_port: 'Chicago, IL',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'Maersk',
    ocean_rate: 2900,
    drayage: 700,
    packing_drayage: null,
    transit_time_days: '38-42',
  },
  {
    id: 'o3',
    container_type: 'fortyhc',
    origin_port: 'Chicago, IL',
    destination_port: 'Cartagena',
    destination_country: 'CO',
    carrier: 'HAPAG',
    ocean_rate: 2100,
    drayage: 2200,
    packing_drayage: null,
    transit_time_days: '25-30',
  },
  {
    id: 'o4',
    container_type: 'flatrack',
    origin_port: 'Houston, TX',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'MSC',
    ocean_rate: 4500,
    drayage: null,
    packing_drayage: 800,
    transit_time_days: '30-35',
  },
  {
    id: 'o5',
    container_type: 'flatrack',
    origin_port: 'Savannah, GA',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'HAPAG',
    ocean_rate: 5200,
    drayage: null,
    packing_drayage: 900,
    transit_time_days: '28-33',
  },
  {
    id: 'o6',
    container_type: 'flatrack',
    origin_port: 'Baltimore, MD',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'CMA',
    ocean_rate: 4300,
    drayage: null,
    packing_drayage: 1500,
    transit_time_days: '30-36',
  },
  {
    id: 'o7',
    container_type: 'flatrack',
    origin_port: 'Houston, TX',
    destination_port: 'Cartagena',
    destination_country: 'CO',
    carrier: 'HAPAG',
    ocean_rate: 4985,
    drayage: null,
    packing_drayage: 4000,
    transit_time_days: '15-20',
  },
];

describe('resolveQuoteContainerType', () => {
  it('forces protected combines into flatrack', () => {
    expect(
      resolveQuoteContainerType({
        equipmentType: 'combine_small',
        dbContainerType: 'fortyhc',
      }),
    ).toEqual({
      containerType: 'flatrack',
      source: 'protected_policy',
    });
  });

  it('forces protected headers into fortyhc', () => {
    expect(
      resolveQuoteContainerType({
        equipmentType: 'header_corn',
        dbContainerType: 'flatrack',
      }),
    ).toEqual({
      containerType: 'fortyhc',
      source: 'protected_policy',
    });
  });
});

describe('adjustForUnit', () => {
  it('returns the base cost for flat units', () => {
    expect(adjustForUnit(8250, 'flat', null)).toBe(8250);
    expect(adjustForUnit(8250, 'flat', 99)).toBe(8250);
  });

  it('multiplies row and foot pricing by size', () => {
    expect(adjustForUnit(140, 'per_row', 8)).toBe(1120);
    expect(adjustForUnit(75, 'per_foot', 30)).toBe(2250);
  });
});

describe('distance helpers', () => {
  it('returns zero for identical coordinates', () => {
    expect(haversineMiles(42, -93, 42, -93)).toBe(0);
  });

  it('maps known ZIPs and falls back for unknown regions', () => {
    expect(zipToCoords('50005')).toEqual([41.59, -93.62]);
    expect(zipToCoords('99999')).toEqual([37.77, -122.42]);
    expect(zipToCoords('')).toBeNull();
  });

  it('applies the 1.3 road factor when estimating miles', () => {
    const miles = estimateRoadMiles('50005', 42.1172, -92.9835);
    expect(miles).toBeGreaterThan(30);
    expect(miles).toBeLessThan(100);
  });
});

describe('findBestOceanRate', () => {
  it('keeps the preferred fortyhc Chicago carrier for the destination', () => {
    const best = findBestOceanRate(mockOceanRates, 'fortyhc', 'UY');
    expect(best?.id).toBe('o1');
  });

  it('chooses the cheapest rate before carrier preference when totals differ', () => {
    const rates: OceanFreightRate[] = [
      {
        id: 'cheap',
        container_type: 'fortyhc',
        origin_port: 'Chicago, IL',
        destination_port: 'Montevideo',
        destination_country: 'UY',
        carrier: 'MSC',
        ocean_rate: 2000,
        drayage: 500,
        packing_drayage: null,
        transit_time_days: '40',
      },
      {
        id: 'preferred',
        container_type: 'fortyhc',
        origin_port: 'Chicago, IL',
        destination_port: 'Montevideo',
        destination_country: 'UY',
        carrier: 'HAPAG',
        ocean_rate: 2600,
        drayage: 700,
        packing_drayage: null,
        transit_time_days: '35',
      },
    ];

    const best = findBestOceanRate(rates, 'fortyhc', 'UY');
    expect(best?.id).toBe('cheap');
  });

  it('compares flatrack rows using the full sea bundle inputs', () => {
    const rates: OceanFreightRate[] = [
      {
        id: 'f1',
        container_type: 'flatrack',
        origin_port: 'Houston, TX',
        destination_port: 'Montevideo',
        destination_country: 'UY',
        carrier: 'HAPAG',
        ocean_rate: 4000,
        drayage: null,
        packing_drayage: 1500,
        transit_time_days: '30',
      },
      {
        id: 'f2',
        container_type: 'flatrack',
        origin_port: 'Savannah, GA',
        destination_port: 'Montevideo',
        destination_country: 'UY',
        carrier: 'HAPAG',
        ocean_rate: 4300,
        drayage: null,
        packing_drayage: 500,
        transit_time_days: '29',
      },
    ];

    const best = findBestOceanRate(rates, 'flatrack', 'UY');
    const bundleF1 =
      4000 +
      1500 +
      FLATRACK_NCB_BY_POL['Houston, TX'] +
      FLATRACK_INTERNAL_BUNDLE_USD +
      FLATRACK_INSURANCE_MIN_USD;
    const bundleF2 =
      4300 +
      500 +
      FLATRACK_NCB_BY_POL['Savannah, GA'] +
      FLATRACK_INTERNAL_BUNDLE_USD +
      FLATRACK_INSURANCE_MIN_USD;

    expect(bundleF2).toBeLessThan(bundleF1);
    expect(best?.id).toBe('f2');
  });
});

describe('calculateFreightV2 — 40HC', () => {
  it('uses the canonical $7/mile inland rule with ZIP input', () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: 'UY',
      zipCode: '50005',
      oceanRates: mockOceanRates,
    });

    const inlandMiles = estimateRoadMiles('50005', 42.1172, -92.9835);
    const inlandCost = inlandMiles * STANDARD_INLAND_DELIVERY_RATE;

    expect(est).not.toBeNull();
    expect(est?.containerType).toBe('fortyhc');
    expect(est?.originPort).toBe(FORTYHC_ORIGIN_PORT);
    expect(est?.packingAndLoading).toBe(5400);
    expect(est?.oceanFreight).toBe(3450);
    expect(est?.usInlandTransport).toBe(inlandCost);
    expect(est?.deliveryRatePerMile).toBe(STANDARD_INLAND_DELIVERY_RATE);
    expect(est?.estimatedTotal).toBe(inlandCost + 5400 + 3450);
  });

  it('excludes inland instead of injecting legacy Chicago drayage when ZIP is missing', () => {
    const est = calculateFreightV2({
      equipment: mockTractor,
      equipmentSize: null,
      destinationCountry: 'UY',
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est?.usInlandTransport).toBeNull();
    expect(est?.totalExcludesInland).toBe(true);
    expect(est?.notes).toContain('Enter ZIP for inland transport estimate.');
    expect(est?.estimatedTotal).toBe(5400 + 3450);
  });

  it('keeps the 40HC packing line and breakdown for size-based equipment', () => {
    const est = calculateFreightV2({
      equipment: mockCornHeader,
      equipmentSize: 8,
      destinationCountry: 'CO',
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    expect(est).not.toBeNull();
    expect(est?.containerType).toBe('fortyhc');
    expect(est?.packingAndLoading).toBe(1120);
    expect(est?.packingBreakdown).toBe('$140/row × 8 rows = $1,120');
    expect(est?.oceanFreight).toBe(4300);
  });
});

describe('calculateFreightV2 — flatrack', () => {
  it('routes protected combine rows to flatrack even if the DB value is stale', () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: 'UY',
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    const expectedSeaBundle =
      4500 +
      800 +
      FLATRACK_NCB_BY_POL['Houston, TX'] +
      FLATRACK_INTERNAL_BUNDLE_USD +
      FLATRACK_INSURANCE_MIN_USD;

    expect(est).not.toBeNull();
    expect(est?.containerType).toBe('flatrack');
    expect(est?.packingAndLoading).toBe(0);
    expect(est?.usInlandTransport).toBeNull();
    expect(est?.originPort).toBe('Houston, TX');
    expect(est?.carrier).toBe('MSC');
    expect(est?.oceanFreight).toBe(expectedSeaBundle);
    expect(est?.estimatedTotal).toBe(expectedSeaBundle);
  });

  it('keeps packing hidden and adds inland only when ZIP is provided', () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      destinationCountry: 'UY',
      zipCode: '77001',
      oceanRates: mockOceanRates,
    });

    const expectedSeaBundle =
      4500 +
      800 +
      FLATRACK_NCB_BY_POL['Houston, TX'] +
      FLATRACK_INTERNAL_BUNDLE_USD +
      FLATRACK_INSURANCE_MIN_USD;

    expect(est).not.toBeNull();
    expect(est?.containerType).toBe('flatrack');
    expect(est?.distanceMiles).toBeLessThan(5);
    expect(est?.usInlandTransport).toBe(0);
    expect(est?.totalExcludesInland).toBe(false);
    expect(est?.oceanFreight).toBe(expectedSeaBundle);
    expect(est?.estimatedTotal).toBe(expectedSeaBundle);
  });

  it('uses declared equipment value to calculate bundled flatrack insurance', () => {
    const est = calculateFreightV2({
      equipment: mockCombine,
      equipmentSize: null,
      equipmentValueUsd: 100000,
      destinationCountry: 'UY',
      zipCode: null,
      oceanRates: mockOceanRates,
    });

    const expectedSeaBundle =
      4500 +
      800 +
      FLATRACK_NCB_BY_POL['Houston, TX'] +
      FLATRACK_INTERNAL_BUNDLE_USD +
      300;

    expect(est).not.toBeNull();
    expect(est?.containerType).toBe('flatrack');
    expect(est?.oceanFreight).toBe(expectedSeaBundle);
    expect(est?.estimatedTotal).toBe(expectedSeaBundle);
  });
});

describe('calculateFreightV2 — edge handling', () => {
  it('returns null when no rate exists for the destination', () => {
    expect(
      calculateFreightV2({
        equipment: mockTractor,
        equipmentSize: null,
        destinationCountry: 'XX',
        zipCode: '50005',
        oceanRates: mockOceanRates,
      }),
    ).toBeNull();
  });
});
