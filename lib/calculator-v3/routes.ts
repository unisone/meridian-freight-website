import {
  routeOptionSchema,
  type NormalizedPort,
  type QuarantinedRate,
  type RouteCatalog,
  type RouteOption,
  type RoutePreference,
} from "@/lib/calculator-v3/contracts";
import {
  FORTYHC_ORIGIN_PORT,
  getFlatrackNcbUsd,
} from "@/lib/freight-policy";
import { resolveRouteTransitFallback } from "@/lib/calculator-v3/route-transit-fallbacks";
import type { ContainerType, OceanFreightRate } from "@/lib/types/calculator";

const CARRIER_PREFERENCE = ["HAPAG", "Maersk", "CMA"];

export const NORMALIZED_PORTS: Record<string, NormalizedPort> = {
  chicago: { key: "chicago", label: "Chicago, IL", lat: 41.8781, lon: -87.6298 },
  houston: { key: "houston", label: "Houston, TX", lat: 29.7604, lon: -95.3698 },
  savannah: { key: "savannah", label: "Savannah, GA", lat: 32.0809, lon: -81.0912 },
  baltimore: { key: "baltimore", label: "Baltimore, MD", lat: 39.2904, lon: -76.6122 },
  charleston: { key: "charleston", label: "Charleston, SC", lat: 32.7765, lon: -79.9311 },
  jacksonville: { key: "jacksonville", label: "Jacksonville, FL", lat: 30.3322, lon: -81.6557 },
  norfolk: { key: "norfolk", label: "Norfolk, VA", lat: 36.8508, lon: -76.2859 },
  tacoma: { key: "tacoma", label: "Tacoma, WA", lat: 47.2529, lon: -122.4443 },
};

const DESTINATION_PORT_LABELS: Record<string, string> = {
  asuncion: "Asuncion",
  arica: "Arica",
  barranquilla: "Barranquilla",
  buenos_aires: "Buenos Aires",
  callao: "Callao",
  cartagena: "Cartagena",
  guayaquil: "Guayaquil",
  iquique: "Iquique",
  manzanillo: "Manzanillo",
  montevideo: "Montevideo",
  puerto_cortes: "Puerto Cortes",
  san_antonio: "San Antonio",
  santa_cruz: "Santa Cruz",
  santo_domingo: "Santo Domingo",
  valparaiso: "Valparaiso",
  zarate: "Zarate",
};

function normalizeToken(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return normalizeToken(value).replace(/\s+/g, "_");
}

function carrierRank(carrier: string): number {
  const idx = CARRIER_PREFERENCE.findIndex((candidate) =>
    carrier.toUpperCase().includes(candidate.toUpperCase()),
  );
  return idx === -1 ? CARRIER_PREFERENCE.length : idx;
}

export function normalizeOriginPort(value: string): NormalizedPort | null {
  const normalized = normalizeToken(value);
  if (!normalized) return null;
  if (normalized === "chicago" || normalized === "chicago il") {
    return NORMALIZED_PORTS.chicago;
  }
  if (normalized === "houston" || normalized === "houston tx") {
    return NORMALIZED_PORTS.houston;
  }
  if (normalized === "savannah" || normalized === "savannah ga") {
    return NORMALIZED_PORTS.savannah;
  }
  if (normalized === "baltimore" || normalized === "baltimore md") {
    return NORMALIZED_PORTS.baltimore;
  }
  if (normalized === "charleston" || normalized === "charleston sc") {
    return NORMALIZED_PORTS.charleston;
  }
  if (
    normalized === "jacksonville" ||
    normalized === "jacksonville fl" ||
    normalized === "jacksonvile"
  ) {
    return NORMALIZED_PORTS.jacksonville;
  }
  if (normalized === "norfolk" || normalized === "norfolk va") {
    return NORMALIZED_PORTS.norfolk;
  }
  if (normalized === "tacoma" || normalized === "tacoma wa") {
    return NORMALIZED_PORTS.tacoma;
  }
  return null;
}

function hasImpossibleOriginPort(value: string): boolean {
  const normalized = normalizeToken(value);
  if (normalized === "savannah tx") return true;
  if (normalized === "houston ga") return true;
  if (normalized === "baltimore tx") return true;
  if (normalized === "charleston tx") return true;
  return false;
}

export function normalizeDestinationPort(value: string): { key: string; label: string } | null {
  const normalized = normalizeToken(value);
  if (!normalized) return null;
  if (normalized.includes("buenos")) return { key: "buenos_aires", label: "Buenos Aires" };
  if (normalized.includes("zarate")) return { key: "zarate", label: "Zarate" };
  if (normalized.includes("asuncion")) return { key: "asuncion", label: "Asuncion" };
  if (normalized.includes("arica")) return { key: "arica", label: "Arica" };
  if (normalized.includes("iquique")) return { key: "iquique", label: "Iquique" };
  if (normalized.includes("san antonio")) return { key: "san_antonio", label: "San Antonio" };
  if (normalized.includes("valparaiso")) return { key: "valparaiso", label: "Valparaiso" };
  if (normalized.includes("callao")) return { key: "callao", label: "Callao" };
  if (normalized.includes("santa cruz")) return { key: "santa_cruz", label: "Santa Cruz" };
  if (normalized.includes("montevideo")) return { key: "montevideo", label: "Montevideo" };
  if (normalized.includes("cartagena")) return { key: "cartagena", label: "Cartagena" };
  if (normalized.includes("barranquilla")) return { key: "barranquilla", label: "Barranquilla" };
  if (normalized.includes("guayaquil")) return { key: "guayaquil", label: "Guayaquil" };
  if (normalized.includes("manzanillo")) return { key: "manzanillo", label: "Manzanillo" };
  if (normalized.includes("cortes")) return { key: "puerto_cortes", label: "Puerto Cortes" };
  if (normalized.includes("santo domingo")) return { key: "santo_domingo", label: "Santo Domingo" };

  const key = slugify(value);
  if (!key) return null;
  return {
    key,
    label: DESTINATION_PORT_LABELS[key] ?? value.trim(),
  };
}

function parseTransitDays(value: string | null): {
  transitMinDays: number | null;
  transitMaxDays: number | null;
} {
  if (!value) return { transitMinDays: null, transitMaxDays: null };
  const matches = value.match(/\d+/g)?.map((part) => Number.parseInt(part, 10)) ?? [];
  const valid = matches.filter((n) => Number.isFinite(n) && n > 0);
  if (valid.length === 0) return { transitMinDays: null, transitMaxDays: null };
  if (valid.length === 1) return { transitMinDays: valid[0], transitMaxDays: valid[0] };
  return {
    transitMinDays: Math.min(valid[0], valid[1]),
    transitMaxDays: Math.max(valid[0], valid[1]),
  };
}

function routeIdFor(rate: OceanFreightRate, origin: NormalizedPort, destinationKey: string): string {
  return [
    "v3",
    rate.container_type,
    rate.destination_country?.toUpperCase() ?? "XX",
    origin.key,
    destinationKey,
    slugify(rate.carrier),
    rate.id,
  ].join(":");
}

function dedupeKeyFor(route: RouteOption): string {
  return [
    route.containerType,
    route.destinationCountry,
    route.origin.key,
    route.destination.key,
    slugify(route.carrier),
  ].join("|");
}

function isPreferredDuplicate(candidate: RouteOption, current: RouteOption): boolean {
  const candidateCost = getRouteServiceCostUsd(candidate);
  const currentCost = getRouteServiceCostUsd(current);
  if (candidateCost !== currentCost) return candidateCost < currentCost;

  const candidateTransit = candidate.transitMinDays ?? Number.POSITIVE_INFINITY;
  const currentTransit = current.transitMinDays ?? Number.POSITIVE_INFINITY;
  if (candidateTransit !== currentTransit) return candidateTransit < currentTransit;

  return candidate.id.localeCompare(current.id) < 0;
}

function quarantine(rate: OceanFreightRate, reason: QuarantinedRate["reason"]): QuarantinedRate {
  return {
    sourceRateId: rate.id,
    reason,
    raw: {
      container_type: rate.container_type,
      origin_port: rate.origin_port,
      destination_port: rate.destination_port,
      destination_country: rate.destination_country,
      carrier: rate.carrier,
    },
  };
}

export function buildRouteCatalog(oceanRates: OceanFreightRate[]): RouteCatalog {
  const routes: RouteOption[] = [];
  const quarantined: QuarantinedRate[] = [];

  for (const rate of oceanRates) {
    if (rate.container_type !== "fortyhc" && rate.container_type !== "flatrack") {
      quarantined.push(quarantine(rate, "invalid_container"));
      continue;
    }

    const destinationCountry = rate.destination_country?.toUpperCase();
    if (!destinationCountry || destinationCountry.length !== 2) {
      quarantined.push(quarantine(rate, "missing_country"));
      continue;
    }

    if (hasImpossibleOriginPort(rate.origin_port)) {
      quarantined.push(quarantine(rate, "impossible_origin"));
      continue;
    }

    const origin = normalizeOriginPort(rate.origin_port);
    if (!origin) {
      quarantined.push(quarantine(rate, "unknown_origin"));
      continue;
    }

    const destination = normalizeDestinationPort(rate.destination_port);
    if (!destination) {
      quarantined.push(quarantine(rate, "unknown_destination"));
      continue;
    }

    if (rate.container_type === "fortyhc" && origin.label !== FORTYHC_ORIGIN_PORT) {
      quarantined.push(quarantine(rate, "unsupported_direct_40hc"));
      continue;
    }

    const hasRequiredCost =
      rate.container_type === "fortyhc"
        ? rate.ocean_rate != null && rate.drayage != null
        : rate.ocean_rate != null && rate.packing_drayage != null;

    if (!hasRequiredCost) {
      quarantined.push(quarantine(rate, "missing_cost"));
      continue;
    }

    const rawTransitTimeDays = rate.transit_time_days?.trim() || null;
    const transitFallback =
      rawTransitTimeDays === null
        ? resolveRouteTransitFallback({
            containerType: rate.container_type,
            destinationCountry,
            originKey: origin.key,
            destinationKey: destination.key,
            carrier: rate.carrier,
          })
        : null;
    const transitTimeDays = rawTransitTimeDays ?? transitFallback?.transitTimeDays ?? null;
    const transit = parseTransitDays(transitTimeDays);
    if (!transitTimeDays || transit.transitMinDays == null || transit.transitMaxDays == null) {
      quarantined.push(quarantine(rate, "missing_transit"));
      continue;
    }

    routes.push(
      routeOptionSchema.parse({
        id: routeIdFor(rate, origin, destination.key),
        sourceRateId: rate.id,
        containerType: rate.container_type,
        origin,
        destination,
        destinationCountry,
        carrier: rate.carrier.trim() || "Carrier TBD",
        oceanRateUsd: rate.ocean_rate ?? 0,
        drayageUsd: rate.drayage ?? 0,
        packingDrayageUsd: rate.packing_drayage ?? 0,
        transitTimeDays,
        ...transit,
      }),
    );
  }

  const deduped = new Map<string, RouteOption>();
  for (const route of routes) {
    const key = dedupeKeyFor(route);
    const current = deduped.get(key);
    if (!current || isPreferredDuplicate(route, current)) {
      deduped.set(key, route);
    }
  }

  const catalogRoutes = Array.from(deduped.values()).sort(compareRoutes("cheapest"));
  return { routes: catalogRoutes, quarantined };
}

export function getRouteServiceCostUsd(route: RouteOption): number {
  if (route.containerType === "fortyhc") {
    return route.oceanRateUsd + route.drayageUsd;
  }
  return (
    route.oceanRateUsd +
    route.packingDrayageUsd +
    getFlatrackNcbUsd({
      originPort: route.origin.label,
      destinationCountry: route.destinationCountry,
    })
  );
}

export function compareRoutes(
  preference: RoutePreference,
): (a: RouteOption, b: RouteOption) => number {
  return (a, b) => {
    if (preference === "fastest") {
      const aTransit = a.transitMinDays ?? Number.POSITIVE_INFINITY;
      const bTransit = b.transitMinDays ?? Number.POSITIVE_INFINITY;
      if (aTransit !== bTransit) return aTransit - bTransit;
    }

    const costA = getRouteServiceCostUsd(a);
    const costB = getRouteServiceCostUsd(b);
    if (costA !== costB) return costA - costB;

    const carrierDelta = carrierRank(a.carrier) - carrierRank(b.carrier);
    if (carrierDelta !== 0) return carrierDelta;

    return a.id.localeCompare(b.id);
  };
}

export function getEligibleRoutes(input: {
  routes: RouteOption[];
  containerType: ContainerType;
  destinationCountry: string;
  destinationPortKey?: string | null;
}): RouteOption[] {
  const destinationCountry = input.destinationCountry.toUpperCase();
  return input.routes.filter(
    (route) =>
      route.containerType === input.containerType &&
      route.destinationCountry === destinationCountry &&
      (!input.destinationPortKey || route.destination.key === input.destinationPortKey),
  );
}

export function selectRoute(input: {
  routes: RouteOption[];
  containerType: ContainerType;
  destinationCountry: string;
  destinationPortKey?: string | null;
  routeId?: string | null;
  preference: RoutePreference;
}): RouteOption | null {
  const eligible = getEligibleRoutes(input);
  if (eligible.length === 0) return null;

  if (input.routeId) {
    const exact = eligible.find((route) => route.id === input.routeId);
    if (exact) return exact;
  }

  return [...eligible].sort(compareRoutes(input.preference))[0] ?? null;
}

export function buildDestinationPortsByCountry(routes: RouteOption[]): Record<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const route of routes) {
    const ports = map.get(route.destinationCountry) ?? new Set<string>();
    ports.add(route.destination.key);
    map.set(route.destinationCountry, ports);
  }

  return Object.fromEntries(
    [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, ports]) => [country, [...ports].sort()]),
  );
}
