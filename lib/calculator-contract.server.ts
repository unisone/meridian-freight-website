import { createHash } from 'crypto';

import { CALCULATOR_CONTRACT_VERSION } from '@/lib/calculator-contract';
import type {
  EquipmentPackingRate,
  OceanFreightRate,
} from '@/lib/types/calculator';

export function buildRateBookSignature(params: {
  equipmentRates: EquipmentPackingRate[];
  oceanRates: OceanFreightRate[];
}): string {
  const payload = {
    contractVersion: CALCULATOR_CONTRACT_VERSION,
    equipmentRates: [...params.equipmentRates]
      .map((equipment) => ({
        id: equipment.id,
        equipment_type: equipment.equipment_type,
        display_name_en: equipment.display_name_en,
        packing_cost: equipment.packing_cost,
        packing_unit: equipment.packing_unit,
        container_type: equipment.container_type,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    oceanRates: [...params.oceanRates]
      .map((rate) => ({
        id: rate.id,
        container_type: rate.container_type,
        origin_port: rate.origin_port,
        destination_port: rate.destination_port,
        destination_country: rate.destination_country,
        carrier: rate.carrier,
        ocean_rate: rate.ocean_rate,
        drayage: rate.drayage,
        packing_drayage: rate.packing_drayage,
        transit_time_days: rate.transit_time_days,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  };

  return createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
    .slice(0, 16);
}
