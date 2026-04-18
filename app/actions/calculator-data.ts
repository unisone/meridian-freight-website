"use server";

import {
  buildCountryAvailability,
  CALCULATOR_CONTRACT_VERSION,
} from "@/lib/calculator-contract";
import { buildRateBookSignature } from "@/lib/calculator-contract.server";
import { fetchEquipmentRates, fetchOceanRates } from "@/lib/supabase-rates";
import type { CalculatorData } from "@/lib/types/calculator";

/**
 * Server Action: fetch equipment + ocean rate data for the calculator wizard.
 * Called once on wizard mount. Returns null if Supabase is not configured or data is insufficient.
 */
export async function getCalculatorData(): Promise<CalculatorData | null> {
  const [equipment, oceanRates] = await Promise.all([
    fetchEquipmentRates(),
    fetchOceanRates(),
  ]);

  if (!equipment || !oceanRates) return null;

  // Sanity check: ensure we have meaningful data
  if (equipment.length < 5 || oceanRates.length < 3) {
    console.error("Insufficient rate data:", { equipment: equipment.length, oceanRates: oceanRates.length });
    return null;
  }

  const categories = [...new Set(equipment.map((e) => e.equipment_category))].sort();
  const countryAvailability = buildCountryAvailability(oceanRates);
  const countries = [
    ...new Set([
      ...countryAvailability.fortyhc,
      ...countryAvailability.flatrack,
    ]),
  ].sort();

  return {
    equipment,
    oceanRates,
    categories,
    countries,
    countryAvailability,
    contractVersion: CALCULATOR_CONTRACT_VERSION,
    rateBookSignature: buildRateBookSignature({
      equipmentRates: equipment,
      oceanRates,
    }),
  } satisfies CalculatorData;
}
