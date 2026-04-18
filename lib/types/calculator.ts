/**
 * Types for the V2 freight calculator.
 * Field names mirror Supabase tables: equipment_packing_rates, ocean_freight_rates.
 */

export type ContainerType = "fortyhc" | "flatrack";
export type PackingUnit = "flat" | "per_row" | "per_foot" | "per_shank" | "per_bottom";

// ---------------------------------------------------------------------------
// Supabase row types (subset of columns the calculator needs)
// ---------------------------------------------------------------------------

export interface EquipmentPackingRate {
  id: string;
  equipment_category: string;
  equipment_type: string;
  display_name_en: string;
  models: string | null;
  delivery_per_mile: number;
  packing_cost: number;
  packing_unit: PackingUnit;
  wash_usda_cost: number;
  container_type: ContainerType;
}

export interface OceanFreightRate {
  id: string;
  container_type: ContainerType;
  origin_port: string;
  destination_port: string;
  destination_country: string | null;
  carrier: string;
  ocean_rate: number;
  drayage: number | null;
  packing_drayage: number | null;
  transit_time_days: string | null;
}

// ---------------------------------------------------------------------------
// Data returned by getCalculatorData() Server Action
// ---------------------------------------------------------------------------

export interface CalculatorData {
  equipment: EquipmentPackingRate[];
  oceanRates: OceanFreightRate[];
  categories: string[];
  countries: string[];
  countryAvailability: {
    fortyhc: string[];
    flatrack: string[];
  };
  contractVersion: string;
  rateBookSignature: string;
}

// ---------------------------------------------------------------------------
// Calculation input/output
// ---------------------------------------------------------------------------

export interface CalculateFreightParams {
  equipment: EquipmentPackingRate;
  equipmentSize: number | null;
  equipmentValueUsd?: number | null;
  destinationCountry: string;
  zipCode: string | null;
  oceanRates: OceanFreightRate[];
}

export interface FreightEstimateV2 {
  containerType: ContainerType;
  equipmentDisplayName: string;
  // Line items
  usInlandTransport: number | null;
  packingAndLoading: number;
  packingBreakdown: string | null;
  oceanFreight: number;
  // Metadata
  carrier: string;
  transitTimeDays: string | null;
  originPort: string;
  destinationPort: string;
  destinationCountry: string;
  // Totals
  estimatedTotal: number;
  totalExcludesInland: boolean;
  // Distance info
  distanceMiles: number | null;
  deliveryRatePerMile: number;
  notes: string[];
}

// ---------------------------------------------------------------------------
// Display mappings
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<string, string> = {
  header: "Headers & Platforms",
  combine: "Combines",
  tractor: "Tractors",
  sprayer: "Sprayers",
  planter: "Planters",
  seeder: "Seeders",
  tillage: "Tillage Equipment",
  baler: "Balers",
  misc: "Miscellaneous",
  construction: "Construction Equipment",
  forestry: "Forestry Equipment",
  backhoe: "Backhoes",
  excavator: "Excavators",
  wheel_loader: "Wheel Loaders",
  skid_steer: "Skid Steers",
  dozer: "Dozers",
  skidder: "Skidders",
  feller_buncher: "Feller Bunchers",
  forwarder: "Forwarders",
};

export const UNIT_LABELS: Record<PackingUnit, string | null> = {
  flat: null,
  per_row: "rows",
  per_foot: "feet",
  per_shank: "shanks",
  per_bottom: "bottoms",
};

export const COUNTRY_NAMES: Record<string, string> = {
  UY: "Uruguay",
  AR: "Argentina",
  BR: "Brazil",
  CO: "Colombia",
  CL: "Chile",
  PE: "Peru",
  EC: "Ecuador",
  MX: "Mexico",
  BO: "Bolivia",
  PY: "Paraguay",
  PA: "Panama",
  CR: "Costa Rica",
  GT: "Guatemala",
  HN: "Honduras",
  SV: "El Salvador",
  DO: "Dominican Republic",
  VE: "Venezuela",
  TT: "Trinidad & Tobago",
  JM: "Jamaica",
  PR: "Puerto Rico",
  BS: "Bahamas",
  HT: "Haiti",
  ZA: "South Africa",
  KE: "Kenya",
  TZ: "Tanzania",
  GH: "Ghana",
  NG: "Nigeria",
  SN: "Senegal",
  KZ: "Kazakhstan",
  GE: "Georgia",
  TR: "Turkey",
  RO: "Romania",
  BG: "Bulgaria",
  KR: "South Korea",
  CN: "China",
  HK: "Hong Kong",
  RU: "Russia",
  AE: "United Arab Emirates",
  AU: "Australia",
  DZ: "Algeria",
  EG: "Egypt",
  NA: "Namibia",
};
