import {
  landedCostProfileRuntimeSchema,
  type LandedCostProfileRuntime,
} from "@/lib/calculator-v3/contracts";

type KzHeavyClass = "combine" | "tractor" | "sprayer";

const KZ_PROFILE_IDS: Record<KzHeavyClass, string> = {
  combine: "22222222-2222-4222-8222-222222222222",
  tractor: "33333333-3333-4333-8333-333333333333",
  sprayer: "44444444-4444-4444-8444-444444444444",
};

const KZ_DUTY_RATE_BY_CLASS: Record<KzHeavyClass, number> = {
  combine: 0.05,
  tractor: 0.1,
  sprayer: 0.05,
};

const KZ_MISC_RATE_HEAVY_EQUIPMENT = 0.04;
const KZ_VAT_RATE = 0.16;
const KZ_INSURANCE_RATE = 0.004;
const KZ_INSURANCE_MIN_USD = 40;

function kzHeavyEquipmentProfile(
  equipmentClass: KzHeavyClass,
): LandedCostProfileRuntime {
  const dutyRate = KZ_DUTY_RATE_BY_CLASS[equipmentClass];
  return landedCostProfileRuntimeSchema.parse({
    id: KZ_PROFILE_IDS[equipmentClass],
    countryCode: "KZ",
    countryName: "Kazakhstan",
    landedEquipmentClass: equipmentClass,
    shippingMode: "flatrack",
    profileName: `Kazakhstan ${equipmentClass} flatrack landed-cost reference`,
    sourceLabel: "Meridian KZ price-list / Zhanna broker guidance 2026-04-20",
    sourceKind: "internal_broker_reference",
    currency: "USD",
    schemaVersion: 1,
    rulesHash: `kz-${equipmentClass}-flatrack-2026-04-20-v1`,
    assumptions: {
      approximateOnly: true,
      manualOverridesAllowed: false,
      roundingMode: "nearest_dollar",
      disclaimer:
        "Indicative Kazakhstan landed-cost reference. Duty, VAT, insurance, and other local charges must be confirmed with the importer and KZ broker before shipment.",
      disclaimerKey: "landed.kz.heavy_equipment",
      notes: [
        "Insurance is estimated at 0.4% of equipment value plus freight, minimum $40.",
        "Misc/local charges use 4% of CIF for heavy equipment per 2026-04-20 broker guidance.",
        "KZ agricultural producers may be able to recover VAT; this calculator still shows VAT in gross cash required.",
      ],
    },
    rules: [
      {
        code: "equipment_value",
        labelKey: "landed.input.equipment",
        label: "Equipment value",
        kind: "input",
        group: "equipment",
        paymentBucket: "dealer_payment",
        inputKey: "equipment_value",
        recoverable: false,
        customerVisible: true,
        sortOrder: 10,
      },
      {
        code: "local_transport",
        labelKey: "landed.input.local_transport",
        label: "US inland transport",
        kind: "input",
        group: "origin_logistics",
        paymentBucket: "meridian_invoice",
        inputKey: "local_transport",
        recoverable: false,
        customerVisible: true,
        sortOrder: 20,
      },
      {
        code: "ocean_freight",
        labelKey: "landed.input.ocean",
        label: "Sea freight and loading",
        kind: "input",
        group: "origin_logistics",
        paymentBucket: "meridian_invoice",
        inputKey: "ocean_freight",
        recoverable: false,
        customerVisible: true,
        sortOrder: 30,
      },
      {
        code: "kz_insurance",
        labelKey: "landed.kz.insurance",
        label: "Insurance",
        kind: "charge",
        group: "origin_logistics",
        paymentBucket: "destination_import",
        calcMode: "percent",
        base: "cif_subtotal",
        value: KZ_INSURANCE_RATE,
        minimumUsd: KZ_INSURANCE_MIN_USD,
        recoverable: false,
        customerVisible: true,
        sortOrder: 40,
        note: "0.4% of equipment value plus freight, minimum $40.",
      },
      {
        code: "kz_duty",
        labelKey: "landed.kz.duty",
        label: `Import duty ${Math.round(dutyRate * 100)}%`,
        kind: "charge",
        group: "import_taxes",
        paymentBucket: "destination_import",
        calcMode: "percent",
        base: "cif_subtotal",
        value: dutyRate,
        recoverable: false,
        customerVisible: true,
        sortOrder: 50,
      },
      {
        code: "kz_vat",
        labelKey: "landed.kz.vat",
        label: "VAT 16%",
        kind: "charge",
        group: "import_taxes",
        paymentBucket: "destination_import",
        calcMode: "percent",
        base: "cif_plus_prior_rule",
        baseRef: "kz_duty",
        value: KZ_VAT_RATE,
        recoverable: false,
        customerVisible: true,
        sortOrder: 60,
        note: "KZ agricultural producers may be able to recover VAT after import.",
      },
      {
        code: "kz_misc",
        labelKey: "landed.kz.misc",
        label: "Misc / broker / certification 4%",
        kind: "charge",
        group: "import_taxes",
        paymentBucket: "destination_import",
        calcMode: "percent",
        base: "cif_subtotal",
        value: KZ_MISC_RATE_HEAVY_EQUIPMENT,
        recoverable: false,
        customerVisible: true,
        sortOrder: 70,
      },
    ],
  });
}

export const STATIC_LANDED_COST_PROFILES: LandedCostProfileRuntime[] = [
  kzHeavyEquipmentProfile("combine"),
  kzHeavyEquipmentProfile("tractor"),
  kzHeavyEquipmentProfile("sprayer"),
];

function profileKey(profile: LandedCostProfileRuntime): string {
  return [
    profile.countryCode,
    profile.landedEquipmentClass,
    profile.shippingMode ?? "any",
  ].join("|");
}

export function mergeLandedCostProfiles(
  databaseProfiles: LandedCostProfileRuntime[],
): LandedCostProfileRuntime[] {
  const merged = new Map<string, LandedCostProfileRuntime>();
  for (const profile of STATIC_LANDED_COST_PROFILES) {
    merged.set(profileKey(profile), profile);
  }
  for (const profile of databaseProfiles) {
    merged.set(profileKey(profile), profile);
  }
  return [...merged.values()].sort((left, right) =>
    profileKey(left).localeCompare(profileKey(right)),
  );
}
