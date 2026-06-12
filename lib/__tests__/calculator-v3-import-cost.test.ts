import { describe, expect, it } from "vitest";

import { calculateImportCostEstimateV3 } from "@/lib/calculator-v3/import-cost";
import { STATIC_LANDED_COST_PROFILES } from "@/lib/calculator-v3/landed-cost-profiles";
import { EQUIPMENT_QUOTE_PROFILES } from "@/lib/calculator-v3/policy";
import type {
  EquipmentQuoteProfile,
  LandedCostProfileRuntime,
} from "@/lib/calculator-v3/contracts";

function getCombineEquipmentProfile(): EquipmentQuoteProfile {
  const profile = EQUIPMENT_QUOTE_PROFILES.find((entry) => entry.id === "combines");
  if (!profile) {
    throw new Error("Expected combines profile to exist");
  }
  return profile;
}

function getKzCombineProfile(): LandedCostProfileRuntime {
  const profile = STATIC_LANDED_COST_PROFILES.find(
    (entry) => entry.countryCode === "KZ" && entry.landedEquipmentClass === "combine",
  );
  if (!profile) {
    throw new Error("Expected Kazakhstan combine profile to exist");
  }
  return profile;
}

const argentinaMarineInsuranceProfile: LandedCostProfileRuntime = {
  id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  countryCode: "AR",
  countryName: "Argentina",
  landedEquipmentClass: "combine",
  shippingMode: "flatrack",
  profileName: "Argentina combine flatrack marine insurance test",
  sourceLabel: "C&C Customs Brokers",
  sourceKind: "broker_budget",
  sourceReference: "C&C Customs Brokers 2026-04-23",
  retrievedAt: "2026-04-23",
  reviewedAt: "2026-04-23",
  reviewedBy: "Meridian operations",
  owner: "Meridian operations",
  confidence: "medium",
  active: true,
  currency: "USD",
  schemaVersion: 1,
  rulesHash: "ar-combine-flatrack-marine-insurance-test",
  assumptions: {
    approximateOnly: true,
    manualOverridesAllowed: false,
    roundingMode: "nearest_dollar",
    disclaimer:
      "Approximate estimate normalized from the approved Argentina customs budget.",
    disclaimerKey: "landed.disclaimer.argentina_test",
    notes: [],
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
      code: "ocean_freight",
      labelKey: "landed.input.ocean",
      label: "Ocean freight",
      kind: "input",
      group: "origin_logistics",
      paymentBucket: "meridian_invoice",
      inputKey: "ocean_freight",
      recoverable: false,
      customerVisible: true,
      sortOrder: 20,
    },
    {
      code: "marine_insurance",
      labelKey: "landed.item.marine_insurance",
      label: "Marine insurance",
      kind: "input",
      group: "origin_logistics",
      paymentBucket: "meridian_invoice",
      inputKey: "marine_insurance",
      recoverable: false,
      customerVisible: true,
      sortOrder: 30,
    },
    {
      code: "ar_import_duty",
      labelKey: "landed.ar.duty",
      label: "Argentina import duty estimate",
      kind: "charge",
      group: "import_taxes",
      paymentBucket: "destination_import",
      calcMode: "percent",
      base: "cif_subtotal",
      value: 0.28,
      recoverable: false,
      customerVisible: true,
      sortOrder: 40,
    },
  ],
};

describe("calculateImportCostEstimateV3", () => {
  const equipmentProfile = getCombineEquipmentProfile();
  const freightBreakdown = {
    localTransportUsd: 1200,
    packingAndLoadingUsd: 0,
    oceanFreightUsd: 27085,
  };

  it("returns a complete public estimate when source metadata is explicit", () => {
    const estimate = calculateImportCostEstimateV3({
      profiles: STATIC_LANDED_COST_PROFILES,
      equipmentProfile,
      shippingMode: "flatrack",
      countryCode: "KZ",
      equipmentValueUsd: 78500,
      freightBreakdown,
    });

    expect(estimate.status).toBe("complete");
    expect(estimate.available).toBe(true);
    expect(estimate.amountUsd).toBeGreaterThan(0);
    expect(estimate.sourceUrl).toBeNull();
    expect(estimate.sourceReference).toBe(
      "Meridian KZ price-list / Zhanna broker guidance 2026-04-20",
    );
    expect(estimate.retrievedAt).toBe("2026-04-20");
    expect(estimate.reviewedBy).toBe("Meridian operations");
    expect(estimate.active).toBe(true);
    expect(estimate.confidence).toBe("medium");
  });

  it("returns unsupported when metadata is missing a review date", () => {
    const profile = getKzCombineProfile();
    const missingMetadataProfile: LandedCostProfileRuntime = {
      ...profile,
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      sourceLabel: "Meridian KZ price-list / Zhanna broker guidance",
      rulesHash: "kz-combine-flatrack-v1",
      sourceUrl: null,
      sourceReference: null,
      retrievedAt: null,
      reviewedAt: null,
      reviewedBy: null,
      owner: null,
      confidence: null,
      active: true,
    };

    const estimate = calculateImportCostEstimateV3({
      profiles: [missingMetadataProfile],
      equipmentProfile,
      shippingMode: "flatrack",
      countryCode: "KZ",
      equipmentValueUsd: 78500,
      freightBreakdown,
    });

    expect(estimate.status).toBe("unsupported");
    expect(estimate.available).toBe(false);
    expect(estimate.amountUsd).toBeNull();
    expect(estimate.sourceUrl).toBeNull();
    expect(estimate.sourceReference).toBe("Meridian KZ price-list / Zhanna broker guidance");
    expect(estimate.retrievedAt).toBeNull();
  });

  it("returns unsupported when no profile is available", () => {
    const estimate = calculateImportCostEstimateV3({
      profiles: [],
      equipmentProfile,
      shippingMode: "flatrack",
      countryCode: "KZ",
      equipmentValueUsd: 78500,
      freightBreakdown,
    });

    expect(estimate.status).toBe("unsupported");
    expect(estimate.available).toBe(false);
    expect(estimate.amountUsd).toBeNull();
    expect(estimate.sourceUrl).toBeNull();
    expect(estimate.retrievedAt).toBeNull();
  });

  it("returns partial when the equipment value is missing", () => {
    const estimate = calculateImportCostEstimateV3({
      profiles: STATIC_LANDED_COST_PROFILES,
      equipmentProfile,
      shippingMode: "flatrack",
      countryCode: "KZ",
      equipmentValueUsd: null,
      freightBreakdown,
    });

    expect(estimate.status).toBe("partial");
    expect(estimate.available).toBe(false);
    expect(estimate.amountUsd).toBeNull();
    expect(estimate.missingInputs).toContain("equipment_value");
  });

  it("derives marine insurance from equipment value for broker profiles", () => {
    const estimate = calculateImportCostEstimateV3({
      profiles: [argentinaMarineInsuranceProfile],
      equipmentProfile,
      shippingMode: "flatrack",
      countryCode: "AR",
      equipmentValueUsd: 120000,
      freightBreakdown: {
        localTransportUsd: 0,
        packingAndLoadingUsd: 0,
        oceanFreightUsd: 4985,
      },
    });

    expect(estimate.status).toBe("complete");
    expect(estimate.available).toBe(true);
    expect(
      estimate.lineItems.find((item) => item.code === "marine_insurance")?.amountUsd,
    ).toBe(360);
    expect(estimate.amountUsd).toBe(35097);
    expect(estimate.grossCashRequiredUsd).toBe(160442);
    expect(estimate.netAfterRecoverableUsd).toBe(160442);
  });
});
