import {
  landedCostAssumptionsSchema,
  landedCostProfileRuntimeSchema,
  type EquipmentQuoteProfile,
  type ImportCostEstimateV3,
  type ImportCostLineItemV3,
  type LandedCostPaymentBucket,
  type LandedCostProfileRuntime,
  type LandedCostRule,
  type LandedEquipmentClass,
  type LandedShippingMode,
} from "@/lib/calculator-v3/contracts";

interface LandedCostProfileRowV3 {
  id: string;
  country_code: string;
  country_name: string;
  landed_equipment_class: string;
  shipping_mode: string | null;
  profile_name: string;
  source_label: string;
  source_kind: string;
  currency: string;
  schema_version: number;
  rules_hash: string;
  assumptions_json: unknown;
  rules_json: unknown;
}

interface LandedCostInputV3 {
  countryCode: string;
  landedEquipmentClass: LandedEquipmentClass;
  shippingMode: LandedShippingMode;
  equipmentValueUsd: number | null;
  freightBreakdown: {
    localTransportUsd: number | null;
    packingAndLoadingUsd: number;
    oceanFreightUsd: number;
  };
}

type RoundingMode = LandedCostProfileRuntime["assumptions"]["roundingMode"];

const unsupportedNote = {
  en: "No source-backed import-cost profile is available for this selection. Broker confirmation is required.",
  es: "No hay perfil de costos de importacion con fuente para esta seleccion. Se requiere confirmacion del broker.",
  ru: "Для этого выбора нет импортного профиля с подтвержденным источником. Требуется подтверждение брокера.",
};

const partialNote = {
  en: "A source-backed import-cost profile exists, but required inputs are missing.",
  es: "Existe un perfil de costos de importacion con fuente, pero faltan datos requeridos.",
  ru: "Профиль импортных расходов с подтвержденным источником есть, но не хватает обязательных данных.",
};

const CUSTOMER_INPUT_KEYS = new Set([
  "equipment_value",
  "local_transport",
  "packing_and_loading",
  "ocean_freight",
]);

export function mapLandedCostProfileRowV3(
  row: LandedCostProfileRowV3,
): LandedCostProfileRuntime {
  return landedCostProfileRuntimeSchema.parse({
    id: row.id,
    countryCode: row.country_code,
    countryName: row.country_name,
    landedEquipmentClass: row.landed_equipment_class,
    shippingMode: row.shipping_mode,
    profileName: row.profile_name,
    sourceLabel: row.source_label,
    sourceKind: row.source_kind,
    currency: row.currency,
    schemaVersion: row.schema_version,
    rulesHash: row.rules_hash,
    assumptions: landedCostAssumptionsSchema.parse(row.assumptions_json ?? {}),
    rules: row.rules_json,
  });
}

export function mapProfileToLandedEquipmentClass(
  profile: EquipmentQuoteProfile,
): LandedEquipmentClass {
  if (profile.equipmentCategory === "combine") return "combine";
  if (profile.equipmentCategory === "tractor") return "tractor";
  if (profile.equipmentCategory === "sprayer") return "sprayer";
  if (profile.equipmentCategory === "header") return "header";
  if (profile.equipmentCategory === "planter") return "planter";
  if (profile.equipmentCategory === "seeder") return "seeder";
  if (profile.equipmentCategory === "tillage") return "tillage";
  return "misc";
}

function roundCurrency(value: number, mode: RoundingMode): number {
  if (mode === "none") return value;
  if (mode === "nearest_dollar") return Math.round(value);
  return Math.round(value * 100) / 100;
}

function getInputAmount(
  input: LandedCostInputV3,
  key: LandedCostRule["inputKey"],
): number | null {
  switch (key) {
    case "equipment_value":
      return input.equipmentValueUsd;
    case "local_transport":
      return input.freightBreakdown.localTransportUsd;
    case "packing_and_loading":
      return input.freightBreakdown.packingAndLoadingUsd;
    case "ocean_freight":
      return input.freightBreakdown.oceanFreightUsd;
    default:
      return null;
  }
}

function sumByGroup(lineItems: ImportCostLineItemV3[], group: string): number {
  return lineItems
    .filter((item) => item.group === group)
    .reduce((sum, item) => sum + item.amountUsd, 0);
}

function resolveBaseAmount(
  input: LandedCostInputV3,
  lineItems: ImportCostLineItemV3[],
  rule: LandedCostRule,
): number | null {
  switch (rule.base) {
    case "equipment_value":
      return input.equipmentValueUsd;
    case "origin_freight_subtotal":
      return sumByGroup(lineItems, "origin_logistics");
    case "cif_subtotal":
      return input.equipmentValueUsd == null
        ? null
        : input.equipmentValueUsd + sumByGroup(lineItems, "origin_logistics");
    case "group_total":
      return rule.baseRef ? sumByGroup(lineItems, rule.baseRef) : null;
    case "prior_rule":
      return rule.baseRef
        ? lineItems.find((item) => item.code === rule.baseRef)?.amountUsd ?? null
        : null;
    default:
      return null;
  }
}

function buildLineItem(
  profile: LandedCostProfileRuntime,
  rule: LandedCostRule,
  amountUsd: number,
): ImportCostLineItemV3 {
  return {
    code: rule.code,
    label: rule.label,
    group: rule.group ?? null,
    paymentBucket: rule.paymentBucket,
    amountUsd: roundCurrency(amountUsd, profile.assumptions.roundingMode),
    recoverable: rule.recoverable,
    customerVisible: rule.customerVisible,
    note: rule.note ?? null,
  };
}

function emptyImportCostEstimate(input: {
  status: "partial" | "unsupported";
  note: ImportCostEstimateV3["note"];
  profile?: LandedCostProfileRuntime | null;
  missingInputs?: string[];
}): ImportCostEstimateV3 {
  return {
    status: input.status,
    available: false,
    amountUsd: null,
    grossCashRequiredUsd: null,
    netAfterRecoverableUsd: null,
    recoverableCreditsUsd: null,
    dutyUsd: null,
    taxUsd: null,
    hsCode: null,
    dutyRatePct: null,
    taxRatePct: null,
    confidence: null,
    sourceLabel: input.profile?.sourceLabel ?? null,
    sourceUrl: null,
    retrievedAt: null,
    sourceVersion: input.profile?.rulesHash ?? null,
    profileName: input.profile?.profileName ?? null,
    missingInputs: input.missingInputs ?? [],
    lineItems: [],
    note: input.note,
  };
}

function selectProfile(input: {
  profiles: LandedCostProfileRuntime[];
  countryCode: string;
  landedEquipmentClass: LandedEquipmentClass;
  shippingMode: LandedShippingMode;
}): LandedCostProfileRuntime | null {
  const countryCode = input.countryCode.toUpperCase();
  const exact = input.profiles.find(
    (profile) =>
      profile.countryCode === countryCode &&
      profile.landedEquipmentClass === input.landedEquipmentClass &&
      profile.shippingMode === input.shippingMode,
  );
  if (exact) return exact;

  return (
    input.profiles.find(
      (profile) =>
        profile.countryCode === countryCode &&
        profile.landedEquipmentClass === input.landedEquipmentClass &&
        profile.shippingMode === null,
    ) ?? null
  );
}

export function calculateImportCostEstimateV3(input: {
  profiles: LandedCostProfileRuntime[];
  equipmentProfile: EquipmentQuoteProfile;
  shippingMode: LandedShippingMode;
  countryCode: string;
  equipmentValueUsd: number | null;
  freightBreakdown: LandedCostInputV3["freightBreakdown"];
}): ImportCostEstimateV3 {
  const landedEquipmentClass = mapProfileToLandedEquipmentClass(input.equipmentProfile);
  const profile = selectProfile({
    profiles: input.profiles,
    countryCode: input.countryCode,
    landedEquipmentClass,
    shippingMode: input.shippingMode,
  });

  if (!profile) {
    return emptyImportCostEstimate({
      status: "unsupported",
      note: unsupportedNote,
    });
  }

  const missingInputs = new Set<string>();
  const lineItems: ImportCostLineItemV3[] = [];
  const rules = [...profile.rules].sort((left, right) => left.sortOrder - right.sortOrder);
  const landedInput: LandedCostInputV3 = {
    countryCode: input.countryCode.toUpperCase(),
    landedEquipmentClass,
    shippingMode: input.shippingMode,
    equipmentValueUsd: input.equipmentValueUsd,
    freightBreakdown: input.freightBreakdown,
  };

  for (const rule of rules) {
    if (rule.kind === "input") {
      const amount = getInputAmount(landedInput, rule.inputKey);
      if (amount == null) {
        if (rule.inputKey) missingInputs.add(rule.inputKey);
        continue;
      }
      lineItems.push(buildLineItem(profile, rule, amount));
      continue;
    }

    if (rule.kind !== "charge" && rule.kind !== "credit") continue;

    const baseAmount = resolveBaseAmount(landedInput, lineItems, rule);
    if (baseAmount == null) {
      if (rule.base === "equipment_value" || rule.base === "cif_subtotal") {
        missingInputs.add("equipment_value");
      }
      if (rule.base === "prior_rule" && rule.baseRef) {
        missingInputs.add(rule.baseRef);
      }
      continue;
    }

    const amount =
      rule.calcMode === "fixed_usd"
        ? rule.value ?? 0
        : baseAmount * (rule.value ?? 0);
    lineItems.push(buildLineItem(profile, rule, amount));
  }

  if (missingInputs.size > 0) {
    const publicMissingInputs = Array.from(missingInputs).filter((key) =>
      CUSTOMER_INPUT_KEYS.has(key),
    );
    return emptyImportCostEstimate({
      status: "partial",
      note: partialNote,
      profile,
      missingInputs: publicMissingInputs.length > 0 ? publicMissingInputs : ["broker_confirmation"],
    });
  }

  const sumByBucket = (bucket: LandedCostPaymentBucket) =>
    lineItems
      .filter((item) => item.paymentBucket === bucket)
      .reduce((sum, item) => sum + item.amountUsd, 0);

  const dealerPaymentUsd = sumByBucket("dealer_payment");
  const meridianInvoiceUsd = sumByBucket("meridian_invoice");
  const destinationImportUsd = sumByBucket("destination_import");
  const recoverableCreditsUsd = sumByBucket("recoverable_credit");
  const grossCashRequiredUsd = roundCurrency(
    dealerPaymentUsd + meridianInvoiceUsd + destinationImportUsd + recoverableCreditsUsd,
    profile.assumptions.roundingMode,
  );
  const netAfterRecoverableUsd = roundCurrency(
    grossCashRequiredUsd - recoverableCreditsUsd,
    profile.assumptions.roundingMode,
  );
  const amountUsd = roundCurrency(
    destinationImportUsd + recoverableCreditsUsd,
    profile.assumptions.roundingMode,
  );

  return {
    status: "complete",
    available: true,
    amountUsd,
    grossCashRequiredUsd,
    netAfterRecoverableUsd,
    recoverableCreditsUsd: roundCurrency(
      recoverableCreditsUsd,
      profile.assumptions.roundingMode,
    ),
    dutyUsd: null,
    taxUsd: null,
    hsCode: input.equipmentProfile.hsCode,
    dutyRatePct: null,
    taxRatePct: null,
    confidence: "medium",
    sourceLabel: profile.sourceLabel,
    sourceUrl: null,
    retrievedAt: null,
    sourceVersion: profile.rulesHash,
    profileName: profile.profileName,
    missingInputs: [],
    lineItems,
    note: {
      en: profile.assumptions.disclaimer,
      es: profile.assumptions.disclaimer,
      ru: profile.assumptions.disclaimer,
    },
  };
}
