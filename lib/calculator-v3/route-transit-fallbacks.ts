import type { ContainerType } from "@/lib/types/calculator";

export const ROUTE_TRANSIT_FALLBACK_VERSION = "route-transit-fallbacks-2026-04-20";

interface RouteTransitFallback {
  containerType: ContainerType;
  destinationCountry: string;
  originKey: string;
  destinationKey: string;
  carrier?: string;
  transitTimeDays: string;
  evidence: string;
}

const ROUTE_TRANSIT_FALLBACKS: RouteTransitFallback[] = [
  {
    containerType: "flatrack",
    destinationCountry: "AR",
    originKey: "houston",
    destinationKey: "buenos_aires",
    carrier: "HAPAG",
    transitTimeDays: "28-35",
    evidence:
      "mf-chatbot-ui lib/proposal/countries/ar.ts AR_ROUTES, CEO flatrack sheet 2026-04",
  },
  {
    containerType: "fortyhc",
    destinationCountry: "AR",
    originKey: "chicago",
    destinationKey: "buenos_aires",
    carrier: "HAPAG",
    transitTimeDays: "25-32",
    evidence:
      "mf-chatbot-ui tests/integration/mark-pipeline/freight-pipeline-qa.test.ts HC40_CHICAGO_AR",
  },
  {
    containerType: "fortyhc",
    destinationCountry: "UY",
    originKey: "chicago",
    destinationKey: "montevideo",
    carrier: "HAPAG",
    transitTimeDays: "35-40",
    evidence:
      "mf-chatbot-ui tests/unit/meridian-tools/estimate-equipment-freight.test.ts SAMPLE_OCEAN_RATE_40HC_HAPAG",
  },
  {
    containerType: "fortyhc",
    destinationCountry: "PY",
    originKey: "chicago",
    destinationKey: "asuncion",
    carrier: "HAPAG",
    transitTimeDays: "32-38",
    evidence:
      "meridian-freight-website lib/__tests__/freight-engine-v3.test.ts py-chicago-40hc fixture",
  },
  {
    containerType: "fortyhc",
    destinationCountry: "CL",
    originKey: "chicago",
    destinationKey: "san_antonio",
    carrier: "HAPAG",
    transitTimeDays: "30-45",
    evidence:
      "mf-chatbot-ui 20260310150000_add_valparaiso_chile_ocean_rates.sql, San Antonio baseline lane",
  },
];

function normalizeCarrier(value: string): string {
  return value.trim().toUpperCase();
}

export function resolveRouteTransitFallback(input: {
  containerType: ContainerType;
  destinationCountry: string;
  originKey: string;
  destinationKey: string;
  carrier: string;
}): RouteTransitFallback | null {
  const country = input.destinationCountry.toUpperCase();
  const carrier = normalizeCarrier(input.carrier);

  return (
    ROUTE_TRANSIT_FALLBACKS.find((fallback) => {
      if (fallback.containerType !== input.containerType) return false;
      if (fallback.destinationCountry !== country) return false;
      if (fallback.originKey !== input.originKey) return false;
      if (fallback.destinationKey !== input.destinationKey) return false;
      if (!fallback.carrier) return true;
      return normalizeCarrier(fallback.carrier) === carrier;
    }) ?? null
  );
}
