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

export const compliancePrepStatusSchema = z.enum([
  "required",
  "recommended",
  "case_by_case",
  "broker_confirm",
  "unknown",
]);
export type CompliancePrepStatus = z.infer<typeof compliancePrepStatusSchema>;

export const complianceAmountStatusSchema = z.enum([
  "priced",
  "quote_confirmed",
  "not_applicable",
]);
export type ComplianceAmountStatus = z.infer<typeof complianceAmountStatusSchema>;

export const complianceServiceTypeSchema = z.enum([
  "wash",
  "cleaning",
  "fumigation",
  "treatment",
  "inspection",
  "certificate",
  "note",
]);
export type ComplianceServiceType = z.infer<typeof complianceServiceTypeSchema>;

export const importCostStatusSchema = z.enum(["complete", "partial", "unsupported"]);
export type ImportCostStatus = z.infer<typeof importCostStatusSchema>;

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

export const compliancePolicyLineSchema = z.object({
  id: z.string().min(1),
  serviceType: complianceServiceTypeSchema,
  label: localizedTextSchema,
  amountUsd: z.number().nonnegative().nullable(),
  amountStatus: complianceAmountStatusSchema,
  status: compliancePrepStatusSchema,
  note: localizedTextSchema,
  publicAmount: z.boolean().default(false),
});
export type CompliancePolicyLine = z.infer<typeof compliancePolicyLineSchema>;

export const compliancePolicySchema = z.object({
  country: z.string().length(2),
  version: z.string().min(1),
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url(),
  effectiveDate: z.string().min(1),
  summary: localizedTextSchema,
  lines: z.array(compliancePolicyLineSchema),
});
export type CompliancePolicy = z.infer<typeof compliancePolicySchema>;

export const landedEquipmentClassSchema = z.enum([
  "header",
  "combine",
  "tractor",
  "sprayer",
  "planter",
  "seeder",
  "tillage",
  "misc",
]);
export type LandedEquipmentClass = z.infer<typeof landedEquipmentClassSchema>;

export const landedShippingModeSchema = z.enum(["flatrack", "fortyhc", "roro"]);
export type LandedShippingMode = z.infer<typeof landedShippingModeSchema>;

export const landedCostInputKeySchema = z.enum([
  "equipment_value",
  "local_transport",
  "packing_and_loading",
  "ocean_freight",
]);
export type LandedCostInputKey = z.infer<typeof landedCostInputKeySchema>;

export const landedCostRuleKindSchema = z.enum([
  "input",
  "charge",
  "subtotal",
  "credit",
  "note",
]);
export type LandedCostRuleKind = z.infer<typeof landedCostRuleKindSchema>;

export const landedCostPaymentBucketSchema = z.enum([
  "dealer_payment",
  "meridian_invoice",
  "destination_import",
  "recoverable_credit",
]);
export type LandedCostPaymentBucket = z.infer<typeof landedCostPaymentBucketSchema>;

export const landedCostCalcModeSchema = z.enum(["fixed_usd", "percent"]);
export type LandedCostCalcMode = z.infer<typeof landedCostCalcModeSchema>;

export const landedCostBaseSchema = z.enum([
  "equipment_value",
  "origin_freight_subtotal",
  "cif_subtotal",
  "cif_plus_prior_rule",
  "group_total",
  "prior_rule",
]);
export type LandedCostBase = z.infer<typeof landedCostBaseSchema>;

export const landedCostRuleSchema = z
  .object({
    code: z.string().trim().min(1).max(120),
    labelKey: z.string().trim().min(1).max(200),
    label: z.string().trim().min(1).max(200),
    kind: landedCostRuleKindSchema,
    group: z.string().trim().min(1).max(120).nullable().optional(),
    paymentBucket: landedCostPaymentBucketSchema,
    calcMode: landedCostCalcModeSchema.optional(),
    base: landedCostBaseSchema.optional(),
    baseRef: z.string().trim().min(1).max(120).nullable().optional(),
    inputKey: landedCostInputKeySchema.optional(),
    value: z.number().nonnegative().optional(),
    minimumUsd: z.number().nonnegative().optional(),
    recoverable: z.boolean().default(false),
    customerVisible: z.boolean().default(true),
    sortOrder: z.number().int().nonnegative(),
    note: z.string().trim().min(1).max(500).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.kind === "input") {
      if (!value.inputKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inputKey"],
          message: "input rules require inputKey",
        });
      }
      return;
    }

    if (value.kind === "charge" || value.kind === "credit") {
      if (!value.calcMode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["calcMode"],
          message: "charge and credit rules require calcMode",
        });
      }
      if (!value.base) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["base"],
          message: "charge and credit rules require base",
        });
      }
      if (value.value == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["value"],
          message: "charge and credit rules require value",
        });
      }
      if (
        (value.base === "group_total" ||
          value.base === "prior_rule" ||
          value.base === "cif_plus_prior_rule") &&
        !value.baseRef
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["baseRef"],
          message: "group_total, prior_rule, and cif_plus_prior_rule bases require baseRef",
        });
      }
    }
  });
export type LandedCostRule = z.infer<typeof landedCostRuleSchema>;

export const landedCostAssumptionsSchema = z.object({
  approximateOnly: z.boolean().default(true),
  manualOverridesAllowed: z.boolean().default(false),
  roundingMode: z.enum(["none", "nearest_cent", "nearest_dollar"]).default("nearest_cent"),
  disclaimer: z.string().trim().min(1).max(1000),
  disclaimerKey: z.string().trim().min(1).max(200).default("landed.disclaimer.generic"),
  notes: z.array(z.string().trim().min(1).max(300)).default([]),
});
export type LandedCostAssumptions = z.infer<typeof landedCostAssumptionsSchema>;

export const landedCostProfileRuntimeSchema = z.object({
  id: z.string().uuid(),
  countryCode: z.string().trim().min(2).max(3).transform((value) => value.toUpperCase()),
  countryName: z.string().trim().min(1).max(120),
  landedEquipmentClass: landedEquipmentClassSchema,
  shippingMode: landedShippingModeSchema.nullable(),
  profileName: z.string().trim().min(1).max(200),
  sourceLabel: z.string().trim().min(1).max(200),
  sourceKind: z.string().trim().min(1).max(80),
  sourceUrl: z.string().trim().url().max(500).nullable().optional(),
  sourceReference: z.string().trim().min(1).max(500).nullable().optional(),
  retrievedAt: z.string().trim().min(1).max(40).nullable().optional(),
  reviewedAt: z.string().trim().min(1).max(40).nullable().optional(),
  reviewedBy: z.string().trim().min(1).max(120).nullable().optional(),
  owner: z.string().trim().min(1).max(120).nullable().optional(),
  confidence: confidenceSchema.nullable().optional(),
  active: z.boolean().optional(),
  currency: z.literal("USD"),
  schemaVersion: z.number().int().positive(),
  rulesHash: z.string().trim().min(1).max(200),
  assumptions: landedCostAssumptionsSchema,
  rules: z.array(landedCostRuleSchema).min(1),
});
export type LandedCostProfileRuntime = z.infer<typeof landedCostProfileRuntimeSchema>;

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
    | "missing_transit"
    | "unknown_origin"
    | "unknown_destination"
    | "impossible_origin"
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
  profiles: EquipmentQuoteProfile[];
  routes: RouteOption[];
  importCostProfiles: LandedCostProfileRuntime[];
  quarantinedRateCount: number;
  countries: string[];
  destinationPortsByCountry: Record<string, string[]>;
  contractVersion: string;
  policyVersion: string;
  rateBookSignature: string;
}

export interface CalculateFreightV3Params {
  equipmentRates: EquipmentPackingRate[];
  routes: RouteOption[];
  importCostProfiles?: LandedCostProfileRuntime[];
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
  id: "us_inland" | "packing_loading" | "ocean_freight";
  label: string;
  amountUsd: number | null;
  note: string | null;
  includedInTotal: boolean;
}

export interface CompliancePrepLineItemV3 {
  id: string;
  serviceType: ComplianceServiceType;
  label: LocalizedText;
  amountUsd: number | null;
  amountStatus: ComplianceAmountStatus;
  status: CompliancePrepStatus;
  note: LocalizedText;
  includedInFreight: false;
}

export interface CompliancePrepEstimateV3 {
  status: CompliancePrepStatus;
  amountUsd: number | null;
  amountStatus: ComplianceAmountStatus;
  lines: CompliancePrepLineItemV3[];
  sourceLabel: string | null;
  sourceUrl: string | null;
  note: LocalizedText | null;
}

export interface ImportCostLineItemV3 {
  code: string;
  label: string;
  group: string | null;
  paymentBucket: LandedCostPaymentBucket;
  amountUsd: number;
  recoverable: boolean;
  customerVisible: boolean;
  note: string | null;
}

export interface ImportCostEstimateV3 {
  status: ImportCostStatus;
  available: boolean;
  amountUsd: number | null;
  grossCashRequiredUsd: number | null;
  netAfterRecoverableUsd: number | null;
  recoverableCreditsUsd: number | null;
  dutyUsd: number | null;
  taxUsd: number | null;
  hsCode: string | null;
  dutyRatePct: number | null;
  taxRatePct: number | null;
  confidence: EstimateConfidence | null;
  sourceLabel: string | null;
  sourceUrl: string | null;
  sourceReference: string | null;
  retrievedAt: string | null;
  reviewedBy: string | null;
  active: boolean | null;
  sourceVersion: string | null;
  profileName: string | null;
  missingInputs: string[];
  lineItems: ImportCostLineItemV3[];
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
  compliancePrep: CompliancePrepEstimateV3;
  complianceServices: number;
  freightTotal: number;
  freightPlusComplianceTotal: number | null;
  dedicatedContainerFreightTotal: number | null;
  totalExcludesInland: boolean;
  distanceMiles: number | null;
  deliveryRatePerMile: number;
  compliancePolicy: CompliancePolicy | null;
  importCost: ImportCostEstimateV3;
  notes: LocalizedText[];
  warnings: LocalizedText[];
}
