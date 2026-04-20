export const STANDARD_INLAND_DELIVERY_RATE = 7;
export const FORTYHC_PACKING_ORIGIN = "Albion, IA";
export const FORTYHC_ORIGIN_PORT = "Chicago, IL";

export const FLATRACK_INTERNAL_BUNDLE_USD = 2000;
export const FLATRACK_INSURANCE_RATE = 0.003;
export const FLATRACK_INSURANCE_MIN_USD = 150;

export const FLATRACK_NCB_BY_POL: Readonly<Record<string, number>> = {
  "Houston, TX": 550,
  "Savannah, GA": 100,
  "Baltimore, MD": 550,
  "Charleston, SC": 550,
};

const FLATRACK_COUNTRIES_WITH_NEGOTIATED_ROUTE_BUNDLE = new Set(["KZ"]);

export type FreightContainerType = "flatrack" | "fortyhc";

export function getFlatrackNcbUsd(input: {
  originPort: string;
  destinationCountry?: string | null;
}): number {
  const country = input.destinationCountry?.toUpperCase() ?? "";
  if (FLATRACK_COUNTRIES_WITH_NEGOTIATED_ROUTE_BUNDLE.has(country)) {
    return 0;
  }
  return FLATRACK_NCB_BY_POL[input.originPort] ?? 0;
}

export function getFlatrackFreightInsuranceUsd(input: {
  destinationCountry?: string | null;
  equipmentValueUsd: number | null;
  quantity?: number;
}): number {
  const country = input.destinationCountry?.toUpperCase() ?? "";
  const quantity = input.quantity ?? 1;
  if (FLATRACK_COUNTRIES_WITH_NEGOTIATED_ROUTE_BUNDLE.has(country)) {
    return 0;
  }
  if (input.equipmentValueUsd == null || input.equipmentValueUsd <= 0) {
    return FLATRACK_INSURANCE_MIN_USD * quantity;
  }
  return Math.max(
    FLATRACK_INSURANCE_MIN_USD * quantity,
    input.equipmentValueUsd * FLATRACK_INSURANCE_RATE,
  );
}

type QuoteContainerResolutionSource =
  | "protected_policy"
  | "database"
  | "default_policy"
  | "fallback";

export interface QuoteContainerResolution {
  containerType: FreightContainerType;
  source: QuoteContainerResolutionSource;
}

const VALID_CONTAINER_TYPES = new Set<FreightContainerType>(["flatrack", "fortyhc"]);

const PROTECTED_CONTAINER_TYPE_BY_EQUIPMENT_TYPE: Readonly<
  Record<string, FreightContainerType>
> = {
  combine: "flatrack",
  combine_small: "flatrack",
  combine_large: "flatrack",
  sprayer_selfpropelled: "flatrack",
  tractor_2wd: "fortyhc",
  tractor_4wd: "fortyhc",
  tractor_track: "fortyhc",
  sprayer_pull: "fortyhc",
  header_flex_rigid: "fortyhc",
  header_draper: "fortyhc",
  header_corn: "fortyhc",
  header_shelbourne: "fortyhc",
  header_honeybee: "fortyhc",
  header_lexion: "fortyhc",
  header_flex_rigid_30: "fortyhc",
  header_flex_rigid_over30: "fortyhc",
  header_draper_30: "fortyhc",
  header_draper_over30: "fortyhc",
  tillage_cultivator: "fortyhc",
  tillage_disk: "fortyhc",
  tillage_ripper: "fortyhc",
  tillage_excelerator: "fortyhc",
  tillage_plow: "fortyhc",
  tillage_rotary_hoe: "fortyhc",
  tillage_spike_harrow: "fortyhc",
  tillage_field_cultivator: "fortyhc",
  tillage_row_crop_cultivator: "fortyhc",
  backhoe: "flatrack",
  excavator: "flatrack",
  wheel_loader: "flatrack",
  skid_steer: "fortyhc",
  mini_excavator: "fortyhc",
  dozer: "flatrack",
  skidder: "flatrack",
  feller_buncher: "flatrack",
  forwarder: "flatrack",
} as const;

const DEFAULT_CONTAINER_TYPE_BY_EQUIPMENT_TYPE: Readonly<
  Record<string, FreightContainerType>
> = {
  ...PROTECTED_CONTAINER_TYPE_BY_EQUIPMENT_TYPE,
  planter: "fortyhc",
  seeder: "fortyhc",
  baler: "fortyhc",
  other: "flatrack",
} as const;

function normalizeKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

export function normalizeFreightContainerType(
  value: string | null | undefined,
): FreightContainerType | null {
  const normalized = normalizeKey(value);
  if (!normalized) return null;
  return VALID_CONTAINER_TYPES.has(normalized as FreightContainerType)
    ? (normalized as FreightContainerType)
    : null;
}

export function resolveQuoteContainerType(input: {
  equipmentType: string | null | undefined;
  dbContainerType: string | null | undefined;
}): QuoteContainerResolution {
  const normalizedEquipmentType = normalizeKey(input.equipmentType);
  const protectedContainerType = normalizedEquipmentType
    ? (PROTECTED_CONTAINER_TYPE_BY_EQUIPMENT_TYPE[normalizedEquipmentType] ?? null)
    : null;
  if (protectedContainerType) {
    return { containerType: protectedContainerType, source: "protected_policy" };
  }

  const dbContainerType = normalizeFreightContainerType(input.dbContainerType);
  if (dbContainerType) {
    return { containerType: dbContainerType, source: "database" };
  }

  const defaultContainerType = normalizedEquipmentType
    ? (DEFAULT_CONTAINER_TYPE_BY_EQUIPMENT_TYPE[normalizedEquipmentType] ?? null)
    : null;
  if (defaultContainerType) {
    return { containerType: defaultContainerType, source: "default_policy" };
  }

  return { containerType: "flatrack", source: "fallback" };
}

export function getFlatrackInsuranceUsd(
  equipmentValueUsd: number | null | undefined = null,
): number {
  if (
    equipmentValueUsd == null ||
    !Number.isFinite(equipmentValueUsd) ||
    equipmentValueUsd <= 0
  ) {
    return FLATRACK_INSURANCE_MIN_USD;
  }

  return Math.round(
    Math.max(FLATRACK_INSURANCE_MIN_USD, equipmentValueUsd * FLATRACK_INSURANCE_RATE) * 100,
  ) / 100;
}
