import type {
  CalculatorLocale,
  FreightEstimateV3,
  RoutePreference,
} from "@/lib/calculator-v3/contracts";

export const CALCULATOR_V3_LEAD_METADATA_VERSION =
  "calculator-v3-lead-metadata-2026-04-20";

export interface BuildCalculatorV3LeadMetadataInput {
  estimate: FreightEstimateV3;
  rateBookSignature: string;
  policyVersion: string;
  sourcePage: string;
  locale: CalculatorLocale;
  preferredContact: "email" | "whatsapp";
  routePreference: RoutePreference;
  zipCode: string;
  equipmentValueUsd: number | null;
  phoneProvided: boolean;
}

export function buildCalculatorV3LeadMetadata({
  estimate,
  rateBookSignature,
  policyVersion,
  sourcePage,
  locale,
  preferredContact,
  routePreference,
  zipCode,
  equipmentValueUsd,
  phoneProvided,
}: BuildCalculatorV3LeadMetadataInput) {
  return {
    metadataVersion: CALCULATOR_V3_LEAD_METADATA_VERSION,
    contractVersion: estimate.version,
    policyVersion,
    rateBookSignature,
    sourcePage,
    locale,
    preferredContact,
    phoneProvided,
    input: {
      equipmentProfileId: estimate.equipmentProfileId,
      modeId: estimate.mode.id,
      quantity: estimate.quantity,
      equipmentValueUsd,
      destinationCountry: estimate.route.destinationCountry,
      destinationPortKey: estimate.route.destination.key,
      routeId: estimate.route.id,
      routePreference,
      zipCodeProvided: zipCode.trim().length > 0,
    },
    equipment: {
      profileId: estimate.equipmentProfileId,
      displayName: estimate.equipmentDisplayName,
      modeId: estimate.mode.id,
      modeLabel: estimate.mode.label,
      containerType: estimate.containerType,
      quantity: estimate.quantity,
      pricedContainerCount: estimate.pricedContainerCount,
      dedicatedContainerCount: estimate.dedicatedContainerCount,
    },
    route: {
      id: estimate.route.id,
      sourceRateId: estimate.route.sourceRateId,
      originPort: estimate.route.origin.label,
      destinationPort: estimate.route.destination.label,
      destinationCountry: estimate.route.destinationCountry,
      carrier: estimate.route.carrier,
      containerType: estimate.route.containerType,
      transitTimeDays: estimate.route.transitTimeDays,
      transitMinDays: estimate.route.transitMinDays,
      transitMaxDays: estimate.route.transitMaxDays,
    },
    totals: {
      freightTotal: estimate.freightTotal,
      freightPlusComplianceTotal: estimate.freightPlusComplianceTotal,
      totalExcludesInland: estimate.totalExcludesInland,
      dedicatedContainerFreightTotal: estimate.dedicatedContainerFreightTotal,
      usInlandTransport: estimate.usInlandTransport,
      packingAndLoading: estimate.packingAndLoading,
      oceanFreight: estimate.oceanFreight,
      complianceServices: estimate.complianceServices,
    },
    lineItems: estimate.lineItems.map((line) => ({
      id: line.id,
      label: line.label,
      amountUsd: line.amountUsd,
      includedInTotal: line.includedInTotal,
      note: line.note,
    })),
    compliancePrep: {
      status: estimate.compliancePrep.status,
      amountUsd: estimate.compliancePrep.amountUsd,
      amountStatus: estimate.compliancePrep.amountStatus,
      sourceLabel: estimate.compliancePrep.sourceLabel,
      sourceUrl: estimate.compliancePrep.sourceUrl,
      note: estimate.compliancePrep.note,
      lines: estimate.compliancePrep.lines.map((line) => ({
        id: line.id,
        serviceType: line.serviceType,
        label: line.label,
        amountUsd: line.amountUsd,
        amountStatus: line.amountStatus,
        status: line.status,
        includedInFreight: line.includedInFreight,
      })),
    },
    importCost: {
      status: estimate.importCost.status,
      available: estimate.importCost.available,
      amountUsd: estimate.importCost.amountUsd,
      grossCashRequiredUsd: estimate.importCost.grossCashRequiredUsd,
      netAfterRecoverableUsd: estimate.importCost.netAfterRecoverableUsd,
      recoverableCreditsUsd: estimate.importCost.recoverableCreditsUsd,
      hsCode: estimate.importCost.hsCode,
      confidence: estimate.importCost.confidence,
      sourceLabel: estimate.importCost.sourceLabel,
      sourceUrl: estimate.importCost.sourceUrl,
      sourceReference: estimate.importCost.sourceReference,
      retrievedAt: estimate.importCost.retrievedAt,
      reviewedBy: estimate.importCost.reviewedBy,
      sourceVersion: estimate.importCost.sourceVersion,
      profileName: estimate.importCost.profileName,
      missingInputs: estimate.importCost.missingInputs,
      lineItemCount: estimate.importCost.lineItems.length,
    },
    warnings: estimate.warnings,
    notes: estimate.notes,
  };
}

export type CalculatorV3LeadMetadata = ReturnType<
  typeof buildCalculatorV3LeadMetadata
>;
