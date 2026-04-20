"use server";

import {
  CALCULATOR_V3_CONTRACT_VERSION,
  type CalculatorDataV3,
} from "@/lib/calculator-v3/contracts";
import {
  CALCULATOR_V3_POLICY_VERSION,
  EQUIPMENT_QUOTE_PROFILES,
} from "@/lib/calculator-v3/policy";
import { findEquipmentForProfile } from "@/lib/calculator-v3/engine";
import {
  buildDestinationPortsByCountry,
  buildRouteCatalog,
} from "@/lib/calculator-v3/routes";
import { mergeLandedCostProfiles } from "@/lib/calculator-v3/landed-cost-profiles";
import { buildRateBookSignature } from "@/lib/calculator-contract.server";
import {
  fetchEquipmentRates,
  fetchLandedCostProfilesV3,
  fetchOceanRates,
} from "@/lib/supabase-rates";

/**
 * Server Action: fetches and normalizes the V3 calculator data contract.
 * V3 deliberately keeps raw Supabase rates off the UI surface by exposing a
 * curated route catalog and vetted landed-cost profiles for client previews.
 */
export async function getCalculatorDataV3(): Promise<CalculatorDataV3 | null> {
  const [equipment, oceanRates, importCostProfiles] = await Promise.all([
    fetchEquipmentRates(),
    fetchOceanRates(),
    fetchLandedCostProfilesV3(),
  ]);

  if (!equipment || !oceanRates) return null;

  if (equipment.length < 5 || oceanRates.length < 3) {
    console.error("Insufficient V3 rate data:", {
      equipment: equipment.length,
      oceanRates: oceanRates.length,
    });
    return null;
  }

  const catalog = buildRouteCatalog(oceanRates);
  const profiles = EQUIPMENT_QUOTE_PROFILES.filter((profile) =>
    Boolean(findEquipmentForProfile(profile, equipment)),
  ).sort((a, b) => a.sortOrder - b.sortOrder);
  const countries = [...new Set(catalog.routes.map((route) => route.destinationCountry))].sort();

  return {
    equipment,
    profiles,
    routes: catalog.routes,
    importCostProfiles: mergeLandedCostProfiles(importCostProfiles),
    quarantinedRateCount: catalog.quarantined.length,
    countries,
    destinationPortsByCountry: buildDestinationPortsByCountry(catalog.routes),
    contractVersion: CALCULATOR_V3_CONTRACT_VERSION,
    policyVersion: CALCULATOR_V3_POLICY_VERSION,
    rateBookSignature: buildRateBookSignature({
      equipmentRates: equipment,
      oceanRates,
    }),
  } satisfies CalculatorDataV3;
}
