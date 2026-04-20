import { describe, expect, it } from "vitest";

import {
  buildCalculatorV3LeadMetadata,
  CALCULATOR_V3_LEAD_METADATA_VERSION,
} from "@/lib/calculator-v3/lead-metadata";
import {
  CALCULATOR_V3_CONTRACT_VERSION,
  type FreightEstimateV3,
} from "@/lib/calculator-v3/contracts";

const localized = {
  en: "Combines",
  es: "Cosechadoras",
  ru: "Комбайны",
};

const estimate = {
  version: CALCULATOR_V3_CONTRACT_VERSION,
  equipmentProfileId: "combines",
  equipmentDisplayName: localized,
  quantity: 1,
  mode: {
    id: "whole",
    containerType: "flatrack",
    enabled: true,
    label: {
      en: "Whole unit",
      es: "Unidad completa",
      ru: "Целиком",
    },
    shortLabel: {
      en: "Whole",
      es: "Completa",
      ru: "Целиком",
    },
    description: {
      en: "Ships as a whole unit.",
      es: "Se envia como unidad completa.",
      ru: "Отправляется целиком.",
    },
    fractionalContainerPricing: false,
    requiresEquipmentValue: true,
  },
  containerType: "flatrack",
  pricedContainerCount: 1,
  dedicatedContainerCount: 1,
  routePreference: "cheapest",
  route: {
    id: "flatrack:houston_tx:buenos_aires:ar:hapag",
    sourceRateId: "ar-houston-fr",
    containerType: "flatrack",
    origin: {
      key: "houston_tx",
      label: "Houston, TX",
      lat: 29.7604,
      lon: -95.3698,
    },
    destination: {
      key: "buenos_aires",
      label: "Buenos Aires",
    },
    destinationCountry: "AR",
    carrier: "HAPAG",
    oceanRateUsd: 8900,
    drayageUsd: 0,
    packingDrayageUsd: 4000,
    transitTimeDays: "28-35",
    transitMinDays: 28,
    transitMaxDays: 35,
  },
  lineItems: [
    {
      id: "ocean_freight",
      label: "Sea freight and loading",
      amountUsd: 12900,
      includedInTotal: true,
      note: "Houston, TX to Buenos Aires. Ocean transit: 28-35 days.",
    },
  ],
  usInlandTransport: 0,
  packingAndLoading: 0,
  oceanFreight: 12900,
  compliancePrep: {
    status: "required",
    amountUsd: null,
    amountStatus: "quote_confirmed",
    lines: [],
    sourceLabel: "Argentina SENASA AFIDI requirements",
    sourceUrl: "https://www.argentina.gob.ar/",
    note: null,
  },
  complianceServices: 0,
  freightTotal: 12900,
  freightPlusComplianceTotal: null,
  dedicatedContainerFreightTotal: null,
  totalExcludesInland: false,
  distanceMiles: 0,
  deliveryRatePerMile: 10,
  compliancePolicy: null,
  importCost: {
    status: "complete",
    available: true,
    amountUsd: 88380.5,
    grossCashRequiredUsd: 221290.5,
    netAfterRecoverableUsd: 175912.1,
    recoverableCreditsUsd: 45378.4,
    dutyUsd: null,
    taxUsd: null,
    hsCode: "843351",
    dutyRatePct: null,
    taxRatePct: null,
    confidence: "medium",
    sourceLabel: "Approved Argentina customs budget",
    sourceUrl: null,
    sourceReference: "Approved Argentina customs budget",
    retrievedAt: "2026-04-16",
    reviewedBy: "Meridian operations",
    active: true,
    sourceVersion: "sha256:argentina-combine-flatrack-v1-2026-04-16",
    profileName: "Argentina combine flatrack v1",
    missingInputs: [],
    lineItems: [],
    note: null,
  },
  notes: [],
  warnings: [],
} satisfies FreightEstimateV3;

describe("buildCalculatorV3LeadMetadata", () => {
  it("captures structured quote context without duplicating PII", () => {
    const metadata = buildCalculatorV3LeadMetadata({
      estimate,
      rateBookSignature: "rates:abc123",
      policyVersion: "calculator-v3-policy-2026-04-20",
      sourcePage: "corporate: /pricing/calculator",
      locale: "en",
      preferredContact: "whatsapp",
      routePreference: "cheapest",
      zipCode: "77001",
      equipmentValueUsd: 120000,
      phoneProvided: true,
    });

    expect(metadata.metadataVersion).toBe(CALCULATOR_V3_LEAD_METADATA_VERSION);
    expect(metadata.route).toMatchObject({
      id: "flatrack:houston_tx:buenos_aires:ar:hapag",
      transitTimeDays: "28-35",
      destinationPort: "Buenos Aires",
    });
    expect(metadata.importCost).toMatchObject({
      status: "complete",
      amountUsd: 88380.5,
      sourceReference: "Approved Argentina customs budget",
      retrievedAt: "2026-04-16",
    });
    expect(metadata.input.zipCodeProvided).toBe(true);
    expect(JSON.stringify(metadata)).not.toContain("buyer@example.com");
  });
});
