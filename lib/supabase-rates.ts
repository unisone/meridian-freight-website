/**
 * Server-side Supabase queries for freight rate tables.
 * Uses the same REST API pattern as lead inserts in app/actions/contact.ts.
 */

import { mapLandedCostProfileRowV3 } from "@/lib/calculator-v3/import-cost";
import type { LandedCostProfileRuntime } from "@/lib/calculator-v3/contracts";
import type { EquipmentPackingRate, OceanFreightRate } from "@/lib/types/calculator";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

function buildHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function fetchEquipmentRates(): Promise<EquipmentPackingRate[] | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const params = new URLSearchParams({
      select: "id,equipment_category,equipment_type,display_name_en,models,delivery_per_mile,packing_cost,packing_unit,wash_usda_cost,container_type",
      order: "equipment_category,display_name_en",
    });

    const resp = await fetch(`${config.url}/rest/v1/equipment_packing_rates?${params}`, {
      headers: buildHeaders(config.key),
    });

    if (!resp.ok) {
      console.error("Failed to fetch equipment rates:", resp.status, await resp.text());
      return null;
    }

    return await resp.json() as EquipmentPackingRate[];
  } catch (e) {
    console.error("Equipment rates fetch error:", e);
    return null;
  }
}

export async function fetchOceanRates(): Promise<OceanFreightRate[] | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const params = new URLSearchParams({
      select: "id,container_type,origin_port,destination_port,destination_country,carrier,ocean_rate,drayage,packing_drayage,transit_time_days",
      order: "destination_country,carrier",
    });

    const resp = await fetch(`${config.url}/rest/v1/ocean_freight_rates?${params}`, {
      headers: buildHeaders(config.key),
    });

    if (!resp.ok) {
      console.error("Failed to fetch ocean rates:", resp.status, await resp.text());
      return null;
    }

    return await resp.json() as OceanFreightRate[];
  } catch (e) {
    console.error("Ocean rates fetch error:", e);
    return null;
  }
}

export async function fetchLandedCostProfilesV3(): Promise<LandedCostProfileRuntime[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  try {
    const today = new Date().toISOString().slice(0, 10);
    const params = new URLSearchParams({
      select:
        "id,country_code,country_name,landed_equipment_class,shipping_mode,profile_name,source_label,source_kind,currency,schema_version,rules_hash,assumptions_json,rules_json",
      is_active: "eq.true",
      effective_from: `lte.${today}`,
      or: `(effective_until.is.null,effective_until.gte.${today})`,
      order: "country_code,landed_equipment_class,effective_from.desc",
    });

    const resp = await fetch(`${config.url}/rest/v1/landed_cost_profiles?${params}`, {
      headers: buildHeaders(config.key),
    });

    if (!resp.ok) {
      console.error("Failed to fetch landed cost profiles:", resp.status, await resp.text());
      return [];
    }

    const rows = (await resp.json()) as unknown[];
    return rows.flatMap((row) => {
      const parsed = mapLandedCostProfileRowV3(row as Parameters<typeof mapLandedCostProfileRowV3>[0]);
      return parsed ? [parsed] : [];
    });
  } catch (e) {
    console.error("Landed cost profiles fetch error:", e);
    return [];
  }
}
