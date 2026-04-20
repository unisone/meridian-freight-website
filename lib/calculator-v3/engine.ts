import {
  CALCULATOR_V3_CONTRACT_VERSION,
  type CalculateFreightV3Params,
  type EquipmentQuoteMode,
  type EquipmentQuoteProfile,
  type FreightEstimateV3,
  type FreightLineItemV3,
  type ImportCostEstimateV3,
  type LocalizedText,
  type RouteOption,
} from "@/lib/calculator-v3/contracts";
import {
  CALCULATOR_V3_POLICY_VERSION,
  EQUIPMENT_QUOTE_PROFILES,
  getCompliancePolicy,
  getEquipmentProfile,
  getImportCostProfile,
} from "@/lib/calculator-v3/policy";
import {
  buildRouteCatalog,
  getRouteServiceCostUsd,
  selectRoute,
} from "@/lib/calculator-v3/routes";
import { estimateRoadMiles, formatDollar } from "@/lib/freight-engine-v2";
import {
  FLATRACK_INSURANCE_MIN_USD,
  FLATRACK_INTERNAL_BUNDLE_USD,
  FLATRACK_INSURANCE_RATE,
  STANDARD_INLAND_DELIVERY_RATE,
} from "@/lib/freight-policy";
import type { ContainerType, EquipmentPackingRate } from "@/lib/types/calculator";

const ALBION_IA = { lat: 42.1172, lon: -92.9835 };

const note = (en: string, es: string, ru: string): LocalizedText => ({ en, es, ru });

function roundUsd(value: number): number {
  return Math.round(value);
}

export function getV3EquipmentProfiles(): EquipmentQuoteProfile[] {
  return [...EQUIPMENT_QUOTE_PROFILES].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getV3Mode(
  profile: EquipmentQuoteProfile,
  modeId: string,
): EquipmentQuoteMode | null {
  return profile.modes.find((mode) => mode.id === modeId) ?? null;
}

export function findEquipmentForProfile(
  profile: EquipmentQuoteProfile,
  equipmentRates: EquipmentPackingRate[],
): EquipmentPackingRate | null {
  const exact = profile.sourceEquipmentTypes
    .map((type) => equipmentRates.find((equipment) => equipment.equipment_type === type))
    .find((equipment): equipment is EquipmentPackingRate => Boolean(equipment));
  if (exact) return exact;

  return (
    equipmentRates.find(
      (equipment) => equipment.equipment_category === profile.equipmentCategory,
    ) ?? null
  );
}

function getPricedContainerCount(mode: EquipmentQuoteMode, quantity: number): {
  pricedContainerCount: number;
  dedicatedContainerCount: number;
} {
  if (mode.minimumContainers) {
    const containerCount = mode.minimumContainers * quantity;
    return {
      pricedContainerCount: containerCount,
      dedicatedContainerCount: containerCount,
    };
  }

  if (mode.capacityUnitsPerContainer) {
    const fractionalCount = quantity / mode.capacityUnitsPerContainer;
    return {
      pricedContainerCount: mode.fractionalContainerPricing
        ? fractionalCount
        : Math.ceil(fractionalCount),
      dedicatedContainerCount: Math.ceil(fractionalCount),
    };
  }

  return {
    pricedContainerCount: quantity,
    dedicatedContainerCount: quantity,
  };
}

function calculatePackingUsd(input: {
  equipment: EquipmentPackingRate;
  mode: EquipmentQuoteMode;
  quantity: number;
  containerType: ContainerType;
}): number {
  if (input.containerType === "flatrack") return 0;
  if (input.mode.packingOverrideUsd != null) {
    return input.mode.packingOverrideUsd * input.quantity;
  }
  return input.equipment.packing_cost * input.quantity;
}

function calculateInlandUsd(input: {
  containerType: ContainerType;
  route: RouteOption;
  zipCode: string | null;
  quantity: number;
}): { amountUsd: number | null; distanceMiles: number | null; excludesInland: boolean } {
  if (!input.zipCode) {
    return { amountUsd: null, distanceMiles: null, excludesInland: true };
  }

  const destination =
    input.containerType === "fortyhc"
      ? ALBION_IA
      : { lat: input.route.origin.lat, lon: input.route.origin.lon };
  const distanceMiles = estimateRoadMiles(input.zipCode, destination.lat, destination.lon);
  return {
    amountUsd: roundUsd(distanceMiles * STANDARD_INLAND_DELIVERY_RATE * input.quantity),
    distanceMiles,
    excludesInland: false,
  };
}

function getFlatrackInsuranceUsd(
  equipmentValueUsd: number | null,
  quantity: number,
): number {
  if (equipmentValueUsd == null || equipmentValueUsd <= 0) {
    return FLATRACK_INSURANCE_MIN_USD * quantity;
  }
  return Math.max(
    FLATRACK_INSURANCE_MIN_USD * quantity,
    equipmentValueUsd * FLATRACK_INSURANCE_RATE,
  );
}

function calculateOceanUsd(input: {
  route: RouteOption;
  containerType: ContainerType;
  pricedContainerCount: number;
  equipmentValueUsd: number | null;
  quantity: number;
}): number {
  const baseServiceCost = getRouteServiceCostUsd(input.route);
  if (input.containerType === "flatrack") {
    return roundUsd(
      baseServiceCost * input.pricedContainerCount +
        FLATRACK_INTERNAL_BUNDLE_USD * input.quantity +
        getFlatrackInsuranceUsd(input.equipmentValueUsd, input.quantity),
    );
  }
  return roundUsd(baseServiceCost * input.pricedContainerCount);
}

function calculateCompliance(input: {
  country: string;
  equipment: EquipmentPackingRate;
  quantity: number;
}): {
  amountUsd: number;
  lines: FreightLineItemV3[];
} {
  const policy = getCompliancePolicy(input.country);
  if (!policy) return { amountUsd: 0, lines: [] };

  let amountUsd = 0;
  const lines: FreightLineItemV3[] = [];

  for (const policyLine of policy.lines) {
    const amount =
      policyLine.id === "wash"
        ? input.equipment.wash_usda_cost * input.quantity
        : policyLine.amountUsd == null
          ? null
          : policyLine.amountUsd * input.quantity;

    if (amount != null && policyLine.includedInFreight) {
      amountUsd += amount;
    }

    if (policyLine.id === "inspection_note") continue;

    lines.push({
      id: policyLine.id,
      label: policyLine.label.en,
      amountUsd: amount,
      note: policyLine.note.en,
      includedInTotal: policyLine.includedInFreight && amount != null,
    });
  }

  return { amountUsd: roundUsd(amountUsd), lines };
}

function unavailableImportCost(reason: LocalizedText | null = null): ImportCostEstimateV3 {
  return {
    available: false,
    amountUsd: null,
    dutyUsd: null,
    taxUsd: null,
    hsCode: null,
    dutyRatePct: null,
    taxRatePct: null,
    confidence: null,
    sourceLabel: null,
    sourceUrl: null,
    retrievedAt: null,
    sourceVersion: null,
    note: reason,
  };
}

function calculateImportCost(input: {
  equipmentProfileId: string;
  country: string;
  equipmentValueUsd: number | null;
  freightTotal: number;
}): ImportCostEstimateV3 {
  if (input.equipmentValueUsd == null || input.equipmentValueUsd <= 0) {
    return unavailableImportCost(
      note(
        "Enter equipment value to show an indicative customs estimate.",
        "Ingrese el valor del equipo para ver una estimacion aduanera indicativa.",
        "Укажите стоимость техники, чтобы показать ориентировочную таможенную оценку.",
      ),
    );
  }

  const profile = getImportCostProfile(input.country, input.equipmentProfileId);
  if (!profile || profile.confidence === "low") {
    return unavailableImportCost(
      note(
        "No source-backed import-cost profile is available for this selection.",
        "No hay perfil de costos de importacion con fuente para esta seleccion.",
        "Для этого выбора нет импортного профиля с подтвержденным источником.",
      ),
    );
  }

  const customsBase = input.equipmentValueUsd + input.freightTotal;
  const dutyUsd = roundUsd(customsBase * profile.dutyRatePct);
  const taxUsd = roundUsd((customsBase + dutyUsd) * profile.taxRatePct);

  return {
    available: true,
    amountUsd: dutyUsd + taxUsd,
    dutyUsd,
    taxUsd,
    hsCode: profile.hsCode,
    dutyRatePct: profile.dutyRatePct,
    taxRatePct: profile.taxRatePct,
    confidence: profile.confidence,
    sourceLabel: profile.sourceLabel,
    sourceUrl: profile.sourceUrl,
    retrievedAt: profile.retrievedAt,
    sourceVersion: profile.sourceVersion,
    note: profile.note,
  };
}

function buildLineItems(input: {
  usInlandTransport: number | null;
  packingAndLoading: number;
  oceanFreight: number;
  complianceLines: FreightLineItemV3[];
  totalExcludesInland: boolean;
  route: RouteOption;
  containerType: ContainerType;
}): FreightLineItemV3[] {
  const freightLabel =
    input.containerType === "flatrack" ? "Sea freight and loading" : "Ocean freight";
  return [
    {
      id: "us_inland",
      label: "U.S. inland transport",
      amountUsd: input.usInlandTransport,
      note: input.totalExcludesInland ? "Enter ZIP for inland estimate." : null,
      includedInTotal: input.usInlandTransport !== null,
    },
    {
      id: "packing_loading",
      label: "Packing and loading",
      amountUsd: input.packingAndLoading,
      note:
        input.containerType === "flatrack"
          ? "Port loading is bundled into sea freight."
          : "Packed at Meridian's Albion, IA facility.",
      includedInTotal: input.packingAndLoading > 0,
    },
    {
      id: "ocean_freight",
      label: `${freightLabel} (${input.route.carrier})`,
      amountUsd: input.oceanFreight,
      note: `${input.route.origin.label} to ${input.route.destination.label}`,
      includedInTotal: true,
    },
    ...input.complianceLines,
  ];
}

function addModeNotes(input: {
  profile: EquipmentQuoteProfile;
  mode: EquipmentQuoteMode;
  quantity: number;
  pricedContainerCount: number;
  dedicatedContainerCount: number;
  route: RouteOption;
  routePreference: string;
  totalExcludesInland: boolean;
}): { notes: LocalizedText[]; warnings: LocalizedText[] } {
  const notes = [...input.profile.notes];
  const warnings: LocalizedText[] = [];

  if (input.profile.id === "combines" && input.mode.id === "container") {
    notes.push(
      note(
        "Containerized combine quote uses two 40HC containers per machine; the unused part of the second container can carry compatible extra cargo.",
        "La cosechadora en contenedor usa dos 40HC por maquina; el espacio libre del segundo contenedor puede llevar carga compatible.",
        "Контейнерный расчет комбайна использует два 40HC на машину; свободное место второго контейнера можно использовать под совместимый груз.",
      ),
    );
  }

  if (input.profile.id === "headers" && input.mode.capacityUnitsPerContainer) {
    notes.push(
      note(
        `Shared-container pricing assumes ${input.mode.capacityUnitsPerContainer} compatible headers per 40HC. For ${input.quantity} unit(s), the calculator prices ${input.pricedContainerCount.toFixed(2)} container(s) and also shows a dedicated-container comparison.`,
        `El precio compartido asume ${input.mode.capacityUnitsPerContainer} cabezales compatibles por 40HC. Para ${input.quantity} unidad(es), se cotiza ${input.pricedContainerCount.toFixed(2)} contenedor(es) y se muestra una comparacion dedicada.`,
        `Расчет доли предполагает ${input.mode.capacityUnitsPerContainer} совместимые жатки на 40HC. Для ${input.quantity} ед. считается ${input.pricedContainerCount.toFixed(2)} контейнера и показано сравнение с отдельным контейнером.`,
      ),
    );
  }

  if (input.routePreference === "fastest" && input.route.transitMinDays === null) {
    warnings.push(
      note(
        "Fastest route requested, but this route has no published transit time; showing the best available priced route.",
        "Se pidio la ruta mas rapida, pero esta ruta no tiene tiempo publicado; se muestra la mejor ruta disponible por precio.",
        "Запрошен самый быстрый маршрут, но для него нет опубликованного транзита; показан лучший доступный маршрут по цене.",
      ),
    );
  }

  if (input.totalExcludesInland) {
    warnings.push(
      note(
        "U.S. ZIP is missing, so inland transport is excluded from the freight total.",
        "Falta ZIP de EE.UU.; transporte interno no esta incluido en el total de flete.",
        "Не указан ZIP США, поэтому внутренний транспорт по США не включен в сумму фрахта.",
      ),
    );
  }

  return { notes, warnings };
}

export function calculateFreightV3(params: CalculateFreightV3Params): FreightEstimateV3 | null {
  const profile = getEquipmentProfile(params.equipmentProfileId);
  if (!profile) return null;

  const mode = getV3Mode(profile, params.modeId);
  if (!mode || !mode.enabled) return null;

  const equipment = findEquipmentForProfile(profile, params.equipmentRates);
  if (!equipment) return null;

  const quantity = Math.max(1, Math.min(profile.maxQuantity, Math.floor(params.quantity)));
  const { pricedContainerCount, dedicatedContainerCount } = getPricedContainerCount(
    mode,
    quantity,
  );

  const catalog = buildRouteCatalog(params.oceanRates);
  const route = selectRoute({
    routes: catalog.routes,
    containerType: mode.containerType,
    destinationCountry: params.destinationCountry,
    destinationPortKey: params.destinationPortKey,
    routeId: params.routeId,
    preference: params.routePreference,
  });
  if (!route) return null;

  const inland = calculateInlandUsd({
    containerType: mode.containerType,
    route,
    zipCode: params.zipCode,
    quantity,
  });
  const packingAndLoading = roundUsd(
    calculatePackingUsd({
      equipment,
      mode,
      quantity,
      containerType: mode.containerType,
    }),
  );
  const oceanFreight = calculateOceanUsd({
    route,
    containerType: mode.containerType,
    pricedContainerCount,
    equipmentValueUsd: params.equipmentValueUsd,
    quantity,
  });
  const compliance = calculateCompliance({
    country: params.destinationCountry,
    equipment,
    quantity,
  });

  const freightTotal = roundUsd(
    (inland.amountUsd ?? 0) + packingAndLoading + oceanFreight + compliance.amountUsd,
  );

  const dedicatedOceanFreight =
    dedicatedContainerCount !== pricedContainerCount
      ? calculateOceanUsd({
          route,
          containerType: mode.containerType,
          pricedContainerCount: dedicatedContainerCount,
          equipmentValueUsd: params.equipmentValueUsd,
          quantity,
        })
      : null;
  const dedicatedContainerFreightTotal =
    dedicatedOceanFreight == null
      ? null
      : roundUsd(
          (inland.amountUsd ?? 0) +
            packingAndLoading +
            dedicatedOceanFreight +
            compliance.amountUsd,
        );

  const { notes, warnings } = addModeNotes({
    profile,
    mode,
    quantity,
    pricedContainerCount,
    dedicatedContainerCount,
    route,
    routePreference: params.routePreference,
    totalExcludesInland: inland.excludesInland,
  });

  const compliancePolicy = getCompliancePolicy(params.destinationCountry);
  if (compliancePolicy) {
    notes.push(compliancePolicy.summary);
  }

  const importCost = calculateImportCost({
    equipmentProfileId: profile.id,
    country: params.destinationCountry,
    equipmentValueUsd: params.equipmentValueUsd,
    freightTotal,
  });

  if (importCost.available && importCost.amountUsd != null) {
    notes.push(
      note(
        `Indicative import-cost estimate is separate from freight: ${formatDollar(importCost.amountUsd)}.`,
        `La estimacion indicativa de importacion es separada del flete: ${formatDollar(importCost.amountUsd)}.`,
        `Ориентировочная импортная оценка отдельно от фрахта: ${formatDollar(importCost.amountUsd)}.`,
      ),
    );
  }

  return {
    version: CALCULATOR_V3_CONTRACT_VERSION,
    equipmentProfileId: profile.id,
    equipmentDisplayName: profile.label,
    quantity,
    mode,
    containerType: mode.containerType,
    pricedContainerCount,
    dedicatedContainerCount,
    routePreference: params.routePreference,
    route,
    lineItems: buildLineItems({
      usInlandTransport: inland.amountUsd,
      packingAndLoading,
      oceanFreight,
      complianceLines: compliance.lines,
      totalExcludesInland: inland.excludesInland,
      route,
      containerType: mode.containerType,
    }),
    usInlandTransport: inland.amountUsd,
    packingAndLoading,
    oceanFreight,
    complianceServices: compliance.amountUsd,
    freightTotal,
    dedicatedContainerFreightTotal,
    totalExcludesInland: inland.excludesInland,
    distanceMiles: inland.distanceMiles,
    deliveryRatePerMile: STANDARD_INLAND_DELIVERY_RATE,
    compliancePolicy,
    importCost,
    notes,
    warnings,
  };
}

export function assertCalculatorV3Policy(): void {
  for (const profile of EQUIPMENT_QUOTE_PROFILES) {
    if (profile.modes.length === 0) {
      throw new Error(`V3 profile ${profile.id} has no shipping modes`);
    }
  }
  if (!CALCULATOR_V3_POLICY_VERSION) {
    throw new Error("Missing V3 policy version");
  }
}
