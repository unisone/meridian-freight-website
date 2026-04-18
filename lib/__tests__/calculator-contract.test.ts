import { describe, expect, it } from 'vitest';

import {
  buildCountryAvailability,
  CALCULATOR_CONTRACT_VERSION,
  getSupportedCountriesForContainer,
  isSupportedCountryForContainer,
} from '@/lib/calculator-contract';
import { buildRateBookSignature } from '@/lib/calculator-contract.server';
import type {
  EquipmentPackingRate,
  OceanFreightRate,
} from '@/lib/types/calculator';

const equipmentRates: EquipmentPackingRate[] = [
  {
    id: 'eq-1',
    equipment_category: 'combine',
    equipment_type: 'combine_small',
    display_name_en: 'Combine - Small Series',
    models: 'S660, S670',
    delivery_per_mile: 10,
    packing_cost: 8250,
    packing_unit: 'flat',
    wash_usda_cost: 900,
    container_type: 'fortyhc',
  },
  {
    id: 'eq-2',
    equipment_category: 'tractor',
    equipment_type: 'tractor_4wd',
    display_name_en: 'Tractor 4WD',
    models: '8R Series',
    delivery_per_mile: 6.5,
    packing_cost: 5400,
    packing_unit: 'flat',
    wash_usda_cost: 700,
    container_type: 'fortyhc',
  },
];

const oceanRates: OceanFreightRate[] = [
  {
    id: 'fr-uy',
    container_type: 'flatrack',
    origin_port: 'Houston, TX',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'HAPAG',
    ocean_rate: 4500,
    drayage: null,
    packing_drayage: 800,
    transit_time_days: '30-35',
  },
  {
    id: 'fr-ar',
    container_type: 'flatrack',
    origin_port: 'Baltimore, MD',
    destination_port: 'Buenos Aires',
    destination_country: 'AR',
    carrier: 'MSC',
    ocean_rate: 4800,
    drayage: null,
    packing_drayage: 1400,
    transit_time_days: '28-32',
  },
  {
    id: 'hc-uy',
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
];

describe('calculator contract helpers', () => {
  it('partitions supported destination countries by container type', () => {
    const availability = buildCountryAvailability(oceanRates);

    expect(availability).toEqual({
      fortyhc: ['UY'],
      flatrack: ['AR', 'UY'],
    });
    expect(getSupportedCountriesForContainer(availability, 'flatrack')).toEqual([
      'AR',
      'UY',
    ]);
    expect(isSupportedCountryForContainer(availability, 'flatrack', 'UY')).toBe(
      true,
    );
    expect(isSupportedCountryForContainer(availability, 'fortyhc', 'AR')).toBe(
      false,
    );
  });

  it('changes the ratebook signature when relevant contract inputs change', () => {
    const baseSignature = buildRateBookSignature({
      equipmentRates,
      oceanRates,
    });
    const changedSignature = buildRateBookSignature({
      equipmentRates,
      oceanRates: oceanRates.map((rate) =>
        rate.id === 'hc-uy' ? { ...rate, ocean_rate: rate.ocean_rate + 100 } : rate,
      ),
    });

    expect(CALCULATOR_CONTRACT_VERSION).toBe('2026-04-18');
    expect(baseSignature).toHaveLength(16);
    expect(changedSignature).toHaveLength(16);
    expect(changedSignature).not.toBe(baseSignature);
  });

  it('ignores legacy fields that no longer affect customer-facing estimates', () => {
    const baseSignature = buildRateBookSignature({
      equipmentRates,
      oceanRates,
    });
    const legacyOnlyChangeSignature = buildRateBookSignature({
      equipmentRates: equipmentRates.map((equipment) =>
        equipment.id === 'eq-1'
          ? { ...equipment, delivery_per_mile: equipment.delivery_per_mile + 3 }
          : equipment,
      ),
      oceanRates,
    });

    expect(legacyOnlyChangeSignature).toBe(baseSignature);
  });
});
