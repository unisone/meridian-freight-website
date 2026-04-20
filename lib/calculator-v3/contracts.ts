import { z } from "zod";
import type {
  ContainerType,
  EquipmentPackingRate,
  OceanFreightRate,
} from "@/lib/types/calculator";

export const CALCULATOR_V3_CONTRACT_VERSION = "calculator-v3.0.0";

export const localeCodeSchema = z.enum(["en", "es", "ru"]);
export type CalculatorLocale = z.infer<typeof localeCodeSchema>;

export const localizedTextSchema = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
  ru: z.string().min(1),
});
export type LocalizedText = z.infer<typeof localizedTextSchema>;

export const shippingModeSchema = z.enum(["whole", "container"]);
export type ShippingMode = z.infer<typeof shippingModeSchema>;

export const routePreferenceSchema = z.enum(["cheapest", "fastest"]);
export type RoutePreference = z.infer<typeof routePreferenceSchema>;

export const confidenceSchema = z.enum(["high", "medium", "low"]);
export type EstimateConfidence = z.infer<typeof confidenceSchema>;

export const equipmentQuoteModeSchema = z.object({
  id: shippingModeSchema,
  containerType: z.enum(["fortyhc", "flatrack"]),
  enabled: z.boolean(),
  label: localizedTextSchema,
  shortLabel: localizedTextSchema,
  description: localizedTextSchema,
  disabledReason: localizedTextSchema.optional(),
  minimumContainers: z.number().positive().optional(),
  capacityUnitsPerContainer: z.number().positive().optional(),
  fractionalContainerPricing: z.boolean().default(false),
  packingOverrideUsd: z.number().nonnegative().optional(),
  requiresEquipmentValue: z.boolean().default(false),
});
export type EquipmentQuoteMode = z.infer<typeof equipmentQuoteModeSchema>;

export const equipmentQuoteProfileSchema = z.object({
  id: z.string().min(1),
  publicCategory: z.string().min(1),
  equipmentCategory: z.string().min(1),
  sourceEquipmentTypes: z.array(z.string().min(1)).min(1),
  sortOrder: z.number().int().nonnegative(),
  label: localizedTextSchema,
  pluralLabel: localizedTextSchema,
  description: localizedTextSchema,
  image: z.string().min(1),
  quantityLabel: localizedTextSchema,
  quantityHelp: localizedTextSchema,
  defaultQuantity: z.number().int().positive(),
  maxQuantity: z.number().int().positive(),
  hsCode: z.string().regex(/^\d{6}$/),
  modes: z.array(equipmentQuoteModeSchema).min(1),
  notes: z.array(localizedTextSchema).default([]),
});
export type EquipmentQuoteProfile = z.infer<typeof equipmentQuoteProfileSchema>;

export const complianceLineItemSchema = z.object({
  id: z.enum(["wash", "fumigation", "inspection_note"]),
  label: localizedTextSchema,
  amountUsd: z.number().nonnegative().nullable(),
  includedInFreight: z.boolean(),
  note: localizedTextSchema,
});
export type ComplianceLineItem = z.infer<typeof complianceLineItemSchema>;

export const compliancePolicySchema = z.object({
  country: z.string().length(2),
  version: z.string().min(1),
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url(),
  effectiveDate: z.string().min(1),
  summary: localizedTextSchema,
  lines: z.array(complianceLineItemSchema),
});
export type CompliancePolicy = z.infer<typeof compliancePolicySchema>;

export const importCostProfileSchema = z.object({
  country: z.string().length(2),
  equipmentProfileId: z.string().min(1),
  hsCode: z.string().regex(/^\d{6}$/),
  dutyRatePct: z.number().min(0).max(1),
  taxRatePct: z.number().min(0).max(1).default(0),
  confidence: confidenceSchema,
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url(),
  retrievedAt: z.string().min(1),
  sourceVersion: z.string().min(1),
  note: localizedTextSchema,
});
export type ImportCostProfile = z.infer<typeof importCostProfileSchema>;

export const portSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  lat: z.number(),
  lon: z.number(),
});
export type NormalizedPort = z.infer<typeof portSchema>;

export const routeOptionSchema = z.object({
  id: z.string().min(1),
  sourceRateId: z.string().min(1),
  containerType: z.enum(["fortyhc", "flatrack"]),
  origin: portSchema,
  destination: z.object({
    key: z.string().min(1),
    label: z.string().min(1),
  }),
  destinationCountry: z.string().length(2),
  carrier: z.string().min(1),
  oceanRateUsd: z.number().nonnegative(),
  drayageUsd: z.number().nonnegative(),
  packingDrayageUsd: z.number().nonnegative(),
  transitTimeDays: z.string().nullable(),
  transitMinDays: z.number().int().positive().nullable(),
  transitMaxDays: z.number().int().positive().nullable(),
});
export type RouteOption = z.infer<typeof routeOptionSchema>;

export interface QuarantinedRate {
  sourceRateId: string;
  reason:
    | "missing_country"
    | "missing_cost"
    | "unknown_origin"
    | "unknown_destination"
    | "unsupported_direct_40hc"
    | "invalid_container";
  raw: Pick<
    OceanFreightRate,
    | "container_type"
    | "origin_port"
    | "destination_port"
    | "destination_country"
    | "carrier"
  >;
}

export interface RouteCatalog {
  routes: RouteOption[];
  quarantined: QuarantinedRate[];
}

export interface CalculatorDataV3 {
  equipment: EquipmentPackingRate[];
  oceanRates: OceanFreightRate[];
  profiles: EquipmentQuoteProfile[];
  routes: RouteOption[];
  quarantinedRateCount: number;
  countries: string[];
  destinationPortsByCountry: Record<string, string[]>;
  contractVersion: string;
  policyVersion: string;
  rateBookSignature: string;
}

export interface CalculateFreightV3Params {
  equipmentRates: EquipmentPackingRate[];
  oceanRates: OceanFreightRate[];
  equipmentProfileId: string;
  modeId: ShippingMode;
  quantity: number;
  equipmentValueUsd: number | null;
  destinationCountry: string;
  destinationPortKey: string | null;
  routeId: string | null;
  routePreference: RoutePreference;
  zipCode: string | null;
}

export interface FreightLineItemV3 {
  id:
    | "us_inland"
    | "packing_loading"
    | "ocean_freight"
    | "wash"
    | "fumigation";
  label: string;
  amountUsd: number | null;
  note: string | null;
  includedInTotal: boolean;
}

export interface ImportCostEstimateV3 {
  available: boolean;
  amountUsd: number | null;
  dutyUsd: number | null;
  taxUsd: number | null;
  hsCode: string | null;
  dutyRatePct: number | null;
  taxRatePct: number | null;
  confidence: EstimateConfidence | null;
  sourceLabel: string | null;
  sourceUrl: string | null;
  retrievedAt: string | null;
  sourceVersion: string | null;
  note: LocalizedText | null;
}

export interface FreightEstimateV3 {
  version: typeof CALCULATOR_V3_CONTRACT_VERSION;
  equipmentProfileId: string;
  equipmentDisplayName: LocalizedText;
  quantity: number;
  mode: EquipmentQuoteMode;
  containerType: ContainerType;
  pricedContainerCount: number;
  dedicatedContainerCount: number;
  routePreference: RoutePreference;
  route: RouteOption;
  lineItems: FreightLineItemV3[];
  usInlandTransport: number | null;
  packingAndLoading: number;
  oceanFreight: number;
  complianceServices: number;
  freightTotal: number;
  dedicatedContainerFreightTotal: number | null;
  totalExcludesInland: boolean;
  distanceMiles: number | null;
  deliveryRatePerMile: number;
  compliancePolicy: CompliancePolicy | null;
  importCost: ImportCostEstimateV3;
  notes: LocalizedText[];
  warnings: LocalizedText[];
}
