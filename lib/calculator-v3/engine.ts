import {
  CALCULATOR_V3_CONTRACT_VERSION,
  type CalculateFreightV3Params,
  type CompliancePrepEstimateV3,
  type EquipmentQuoteMode,
  type EquipmentQuoteProfile,
  type FreightEstimateV3,
  type FreightLineItemV3,
  type LocalizedText,
  type RouteOption,
  type RoutePreference,
} from "@/lib/calculator-v3/contracts";
import { calculateImportCostEstimateV3 } from "@/lib/calculator-v3/import-cost";
import {
  CALCULATOR_V3_POLICY_VERSION,
  EQUIPMENT_QUOTE_PROFILES,
  getCompliancePolicy,
  getEquipmentProfile,
} from "@/lib/calculator-v3/policy";
import { compareRoutes, getRouteServiceCostUsd, selectRoute } from "@/lib/calculator-v3/routes";
import { estimateRoadMiles, formatDollar } from "@/lib/freight-engine-v2";
import {
  FLATRACK_INTERNAL_BUNDLE_USD,
  STANDARD_INLAND_DELIVERY_RATE,
  getFlatrackFreightInsuranceUsd,
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

export function getV3RouteFreightSortCost(input: {
  route: RouteOption;
  mode: EquipmentQuoteMode;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
}): number {
  const { pricedContainerCount } = getPricedContainerCount(input.mode, input.quantity);
  const inland = calculateInlandUsd({
    containerType: input.mode.containerType,
    route: input.route,
    zipCode: input.zipCode,
    quantity: input.quantity,
  });
  const oceanFreight = calculateOceanUsd({
    route: input.route,
    containerType: input.mode.containerType,
    pricedContainerCount,
    equipmentValueUsd: input.equipmentValueUsd,
    quantity: input.quantity,
  });
  return (inland.amountUsd ?? 0) + oceanFreight;
}

export function compareRoutesForFreightV3(input: {
  mode: EquipmentQuoteMode;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
  preference: RoutePreference;
}): (left: RouteOption, right: RouteOption) => number {
  return (left, right) => {
    if (input.preference === "fastest") {
      const leftTransit = left.transitMinDays ?? Number.POSITIVE_INFINITY;
      const rightTransit = right.transitMinDays ?? Number.POSITIVE_INFINITY;
      if (leftTransit !== rightTransit) return leftTransit - rightTransit;
    }

    const leftCost = getV3RouteFreightSortCost({
      route: left,
      mode: input.mode,
      quantity: input.quantity,
      equipmentValueUsd: input.equipmentValueUsd,
      zipCode: input.zipCode,
    });
    const rightCost = getV3RouteFreightSortCost({
      route: right,
      mode: input.mode,
      quantity: input.quantity,
      equipmentValueUsd: input.equipmentValueUsd,
      zipCode: input.zipCode,
    });
    if (leftCost !== rightCost) return leftCost - rightCost;

    return compareRoutes("cheapest")(left, right);
  };
}

function selectRouteForEstimate(input: {
  routes: RouteOption[];
  mode: EquipmentQuoteMode;
  destinationCountry: string;
  destinationPortKey: string | null;
  routeId: string | null;
  routePreference: RoutePreference;
  quantity: number;
  equipmentValueUsd: number | null;
  zipCode: string | null;
}): RouteOption | null {
  if (input.routeId) {
    return selectRoute({
      routes: input.routes,
      containerType: input.mode.containerType,
      destinationCountry: input.destinationCountry,
      destinationPortKey: input.destinationPortKey,
      routeId: input.routeId,
      preference: input.routePreference,
    });
  }

  const eligibleRoutes = input.routes.filter(
    (route) =>
      route.containerType === input.mode.containerType &&
      route.destinationCountry === input.destinationCountry &&
      (!input.destinationPortKey || route.destination.key === input.destinationPortKey),
  );
  if (eligibleRoutes.length === 0) return null;

  const sortableRoutes =
    input.routePreference === "fastest"
      ? eligibleRoutes.filter((route) => route.transitMinDays !== null)
      : eligibleRoutes;

  const routePool = sortableRoutes.length > 0 ? sortableRoutes : eligibleRoutes;
  return [...routePool].sort(
    compareRoutesForFreightV3({
      mode: input.mode,
      quantity: input.quantity,
      equipmentValueUsd: input.equipmentValueUsd,
      zipCode: input.zipCode,
      preference: sortableRoutes.length > 0 ? input.routePreference : "cheapest",
    }),
  )[0] ?? null;
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
        getFlatrackFreightInsuranceUsd({
          destinationCountry: input.route.destinationCountry,
          equipmentValueUsd: input.equipmentValueUsd,
          quantity: input.quantity,
        }),
    );
  }
  return roundUsd(baseServiceCost * input.pricedContainerCount);
}

function calculateCompliance(input: {
  country: string;
  quantity: number;
}): CompliancePrepEstimateV3 {
  const policy = getCompliancePolicy(input.country);
  if (!policy) {
    return {
      status: "unknown",
      amountUsd: null,
      amountStatus: "quote_confirmed",
      lines: [],
      sourceLabel: null,
      sourceUrl: null,
      note: note(
        "Compliance prep requirements are not available for this country in the automatic calculator.",
        "Los requisitos de preparacion de cumplimiento no estan disponibles para este pais en la calculadora automatica.",
        "Требования к подготовке соответствия для этой страны недоступны в автоматическом калькуляторе.",
      ),
    };
  }

  let pricedAmountUsd = 0;
  let hasPricedLines = false;
  let amountStatus: CompliancePrepEstimateV3["amountStatus"] = "not_applicable";
  const statusRank = {
    required: 5,
    recommended: 4,
    case_by_case: 3,
    broker_confirm: 2,
    unknown: 1,
  } as const;
  let status: CompliancePrepEstimateV3["status"] = "unknown";

  for (const policyLine of policy.lines) {
    if (statusRank[policyLine.status] > statusRank[status]) {
      status = policyLine.status;
    }
    if (policyLine.amountStatus === "quote_confirmed") {
      amountStatus = "quote_confirmed";
    }
    if (
      policyLine.amountStatus === "priced" &&
      policyLine.publicAmount &&
      policyLine.amountUsd != null
    ) {
      hasPricedLines = true;
      amountStatus = "priced";
      pricedAmountUsd += policyLine.amountUsd * input.quantity;
    }
  }

  const lines = policy.lines.map((policyLine) => {
    const amountUsd =
      policyLine.amountStatus === "priced" &&
      policyLine.publicAmount &&
      policyLine.amountUsd != null
        ? policyLine.amountUsd * input.quantity
        : null;

    return {
      id: policyLine.id,
      serviceType: policyLine.serviceType,
      label: policyLine.label,
      amountUsd,
      amountStatus: policyLine.amountStatus,
      status: policyLine.status,
      note: policyLine.note,
      includedInFreight: false as const,
    };
  });

  if (policy.lines.length === 0) {
    amountStatus = "not_applicable";
  }

  return {
    status,
    amountUsd: hasPricedLines ? roundUsd(pricedAmountUsd) : null,
    amountStatus,
    lines,
    sourceLabel: policy.sourceLabel,
    sourceUrl: policy.sourceUrl,
    note: policy.summary,
  };
}

function formatTransitTime(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (!/\d/.test(trimmed) || /\bday(s)?\b/i.test(trimmed)) return trimmed;
  return `${trimmed} days`;
}

function oceanFreightNote(route: RouteOption): string {
  const routeLabel = `${route.origin.label} to ${route.destination.label}`;
  const transitTime = route.transitTimeDays?.trim();
  if (!transitTime) {
    return `${routeLabel}. Transit time not published; confirm carrier schedule.`;
  }
  return `${routeLabel}. Estimated route transit: ${formatTransitTime(transitTime)}.`;
}

function buildLineItems(input: {
  usInlandTransport: number | null;
  packingAndLoading: number;
  oceanFreight: number;
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
      note: oceanFreightNote(input.route),
      includedInTotal: true,
    },
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

  const route = selectRouteForEstimate({
    routes: params.routes,
    mode,
    destinationCountry: params.destinationCountry,
    destinationPortKey: params.destinationPortKey,
    routeId: params.routeId,
    routePreference: params.routePreference,
    quantity,
    equipmentValueUsd: params.equipmentValueUsd,
    zipCode: params.zipCode,
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
    quantity,
  });

  const freightTotal = roundUsd(
    (inland.amountUsd ?? 0) + packingAndLoading + oceanFreight,
  );
  const freightPlusComplianceTotal =
    compliance.amountUsd == null ? null : freightTotal + compliance.amountUsd;

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
            dedicatedOceanFreight,
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

  const importCost = calculateImportCostEstimateV3({
    profiles: params.importCostProfiles ?? [],
    equipmentProfile: profile,
    shippingMode: mode.containerType,
    countryCode: params.destinationCountry,
    equipmentValueUsd: params.equipmentValueUsd,
    freightBreakdown: {
      localTransportUsd: inland.amountUsd,
      packingAndLoadingUsd: packingAndLoading,
      oceanFreightUsd: oceanFreight,
    },
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
      totalExcludesInland: inland.excludesInland,
      route,
      containerType: mode.containerType,
    }),
    usInlandTransport: inland.amountUsd,
    packingAndLoading,
    oceanFreight,
    compliancePrep: compliance,
    complianceServices: compliance.amountUsd ?? 0,
    freightTotal,
    freightPlusComplianceTotal,
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
