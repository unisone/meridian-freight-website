import { EQUIPMENT_QUOTE_PROFILES } from "@/lib/calculator-v3/policy";
import type {
  EquipmentQuoteProfile,
  QuarantinedRate,
  RouteCatalog,
  RouteOption,
} from "@/lib/calculator-v3/contracts";
import type { ContainerType } from "@/lib/types/calculator";

export const CALCULATOR_V3_ROUTE_HEALTH_VERSION = "calculator-v3-route-health-2026-04-20";

const QUARANTINE_REASON_ORDER: QuarantinedRate["reason"][] = [
  "missing_country",
  "missing_cost",
  "unknown_origin",
  "unknown_destination",
  "impossible_origin",
  "unsupported_direct_40hc",
  "invalid_container",
];

const CONTAINER_TYPE_ORDER: Record<ContainerType, number> = {
  fortyhc: 0,
  flatrack: 1,
};

type PortStringReason = "unknown_origin" | "unknown_destination" | "impossible_origin";

export interface RouteHealthCountrySummary {
  country: string;
  routeCount: number;
  fortyhcRouteCount: number;
  flatrackRouteCount: number;
  transitKnownCount: number;
  transitMissingCount: number;
  transitCoveragePercent: number;
}

export interface RouteHealthCountryContainerSummary {
  country: string;
  containerType: ContainerType;
  routeCount: number;
  transitKnownCount: number;
  transitMissingCount: number;
  transitCoveragePercent: number;
}

export interface RouteHealthMissingTransitRow {
  sourceRateId: string;
  country: string;
  containerType: ContainerType;
  originPort: string;
  destinationPort: string;
  carrier: string;
}

export interface RouteHealthQuarantineReasonSummary {
  reason: QuarantinedRate["reason"];
  count: number;
}

export interface RouteHealthDirtyPortStringSummary {
  field: "origin_port" | "destination_port";
  value: string;
  count: number;
  reasons: RouteHealthQuarantineReasonSummary[];
  sourceRateIds: string[];
}

export interface RouteHealthUnsupportedCountry {
  country: string;
  eligibleRouteCount: number;
}

export interface RouteHealthReport {
  routeHealthVersion: string;
  summary: {
    routeCount: number;
    quarantinedCount: number;
    countryCount: number;
    publicProfileCount: number;
    publicModeCount: number;
  };
  routeCountsByCountry: RouteHealthCountrySummary[];
  routeCountsByCountryAndContainer: RouteHealthCountryContainerSummary[];
  transitCoverage: {
    overall: {
      routeCount: number;
      transitKnownCount: number;
      transitMissingCount: number;
      transitCoveragePercent: number;
    };
    byCountry: RouteHealthCountrySummary[];
    byCountryAndContainer: RouteHealthCountryContainerSummary[];
  };
  missingTransitRows: RouteHealthMissingTransitRow[];
  quarantineCountsByReason: RouteHealthQuarantineReasonSummary[];
  countriesWithoutEligibleAutomaticRoute: RouteHealthUnsupportedCountry[];
  dirtyQuarantinedRawPortStrings: RouteHealthDirtyPortStringSummary[];
  warnings: string[];
  criticalIssues: string[];
}

interface CountryAggregate {
  country: string;
  routeCount: number;
  fortyhcRouteCount: number;
  flatrackRouteCount: number;
  transitKnownCount: number;
  transitMissingCount: number;
  transitCoveragePercent: number;
}

interface CountryContainerAggregate {
  country: string;
  containerType: ContainerType;
  routeCount: number;
  transitKnownCount: number;
  transitMissingCount: number;
  transitCoveragePercent: number;
}

interface DirtyPortAggregate {
  field: "origin_port" | "destination_port";
  value: string;
  count: number;
  reasonCounts: Map<QuarantinedRate["reason"], number>;
  sourceRateIds: Set<string>;
}

function roundCoveragePercent(routeCount: number, transitKnownCount: number): number {
  if (routeCount === 0) return 0;
  return Math.round((transitKnownCount / routeCount) * 1000) / 10;
}

function compareCountries(left: string, right: string): number {
  return left.localeCompare(right);
}

function compareCountryContainerSummaries(
  left: RouteHealthCountryContainerSummary,
  right: RouteHealthCountryContainerSummary,
): number {
  const countryDelta = compareCountries(left.country, right.country);
  if (countryDelta !== 0) return countryDelta;
  return CONTAINER_TYPE_ORDER[left.containerType] - CONTAINER_TYPE_ORDER[right.containerType];
}

function compareQuarantineReasons(
  left: RouteHealthQuarantineReasonSummary,
  right: RouteHealthQuarantineReasonSummary,
): number {
  return QUARANTINE_REASON_ORDER.indexOf(left.reason) - QUARANTINE_REASON_ORDER.indexOf(right.reason);
}

function getPortStringField(
  reason: QuarantinedRate["reason"],
): "origin_port" | "destination_port" | null {
  if (reason === "unknown_destination") return "destination_port";
  if (reason === "unknown_origin" || reason === "impossible_origin") return "origin_port";
  return null;
}

function isPortStringReason(
  reason: QuarantinedRate["reason"],
): reason is PortStringReason {
  return (
    reason === "unknown_origin" ||
    reason === "unknown_destination" ||
    reason === "impossible_origin"
  );
}

function collectEnabledModes(
  equipmentProfiles: EquipmentQuoteProfile[],
): Array<{ profileId: string; modeId: string; containerType: ContainerType }> {
  const modes: Array<{ profileId: string; modeId: string; containerType: ContainerType }> = [];
  for (const profile of equipmentProfiles) {
    for (const mode of profile.modes) {
      if (!mode.enabled) continue;
      modes.push({
        profileId: profile.id,
        modeId: mode.id,
        containerType: mode.containerType,
      });
    }
  }
  return modes;
}

function buildCountryAggregates(routes: RouteOption[]): {
  countrySummaries: RouteHealthCountrySummary[];
  countryContainerSummaries: RouteHealthCountryContainerSummary[];
} {
  const countryMap = new Map<string, CountryAggregate>();
  const countryContainerMap = new Map<string, CountryContainerAggregate>();

  for (const route of routes) {
    const country = route.destinationCountry;
    const countryEntry =
      countryMap.get(country) ??
      ({
        country,
        routeCount: 0,
        fortyhcRouteCount: 0,
        flatrackRouteCount: 0,
        transitKnownCount: 0,
        transitMissingCount: 0,
        transitCoveragePercent: 0,
      } satisfies CountryAggregate);

    countryEntry.routeCount += 1;
    if (route.containerType === "fortyhc") {
      countryEntry.fortyhcRouteCount += 1;
    } else {
      countryEntry.flatrackRouteCount += 1;
    }
    if (route.transitTimeDays == null) {
      countryEntry.transitMissingCount += 1;
    } else {
      countryEntry.transitKnownCount += 1;
    }
    countryMap.set(country, countryEntry);

    const containerKey = `${country}|${route.containerType}`;
    const containerEntry =
      countryContainerMap.get(containerKey) ??
      ({
        country,
        containerType: route.containerType,
        routeCount: 0,
        transitKnownCount: 0,
        transitMissingCount: 0,
        transitCoveragePercent: 0,
      } satisfies CountryContainerAggregate);

    containerEntry.routeCount += 1;
    if (route.transitTimeDays == null) {
      containerEntry.transitMissingCount += 1;
    } else {
      containerEntry.transitKnownCount += 1;
    }
    countryContainerMap.set(containerKey, containerEntry);
  }

  const countrySummaries = Array.from(countryMap.values())
    .map((entry) => ({
      country: entry.country,
      routeCount: entry.routeCount,
      fortyhcRouteCount: entry.fortyhcRouteCount,
      flatrackRouteCount: entry.flatrackRouteCount,
      transitKnownCount: entry.transitKnownCount,
      transitMissingCount: entry.transitMissingCount,
      transitCoveragePercent: roundCoveragePercent(entry.routeCount, entry.transitKnownCount),
    }))
    .sort((left, right) => compareCountries(left.country, right.country));

  const countryContainerSummaries = Array.from(countryContainerMap.values())
    .map((entry) => ({
      country: entry.country,
      containerType: entry.containerType,
      routeCount: entry.routeCount,
      transitKnownCount: entry.transitKnownCount,
      transitMissingCount: entry.transitMissingCount,
      transitCoveragePercent: roundCoveragePercent(entry.routeCount, entry.transitKnownCount),
    }))
    .sort(compareCountryContainerSummaries);

  return { countrySummaries, countryContainerSummaries };
}

function buildMissingTransitRows(routes: RouteOption[]): RouteHealthMissingTransitRow[] {
  return routes
    .filter((route) => route.transitTimeDays == null)
    .map((route) => ({
      sourceRateId: route.sourceRateId,
      country: route.destinationCountry,
      containerType: route.containerType,
      originPort: route.origin.label,
      destinationPort: route.destination.label,
      carrier: route.carrier,
    }))
    .sort((left, right) => {
      const countryDelta = compareCountries(left.country, right.country);
      if (countryDelta !== 0) return countryDelta;
      const containerDelta =
        CONTAINER_TYPE_ORDER[left.containerType] - CONTAINER_TYPE_ORDER[right.containerType];
      if (containerDelta !== 0) return containerDelta;
      const carrierDelta = left.carrier.localeCompare(right.carrier);
      if (carrierDelta !== 0) return carrierDelta;
      return left.sourceRateId.localeCompare(right.sourceRateId);
    });
}

function buildQuarantineReasonCounts(
  quarantined: QuarantinedRate[],
): RouteHealthQuarantineReasonSummary[] {
  const counts = new Map<QuarantinedRate["reason"], number>();
  for (const entry of quarantined) {
    counts.set(entry.reason, (counts.get(entry.reason) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort(compareQuarantineReasons);
}

function buildDirtyPortSummaries(
  quarantined: QuarantinedRate[],
): RouteHealthDirtyPortStringSummary[] {
  const aggregates = new Map<string, DirtyPortAggregate>();

  for (const entry of quarantined) {
    if (!isPortStringReason(entry.reason)) continue;

    const field = getPortStringField(entry.reason);
    if (!field) continue;
    const rawValue = field === "origin_port" ? entry.raw.origin_port : entry.raw.destination_port;
    const value = rawValue?.trim() ?? "";
    if (!value) continue;

    const key = `${field}|${value}`;
    const aggregate =
      aggregates.get(key) ??
      ({
        field,
        value,
        count: 0,
        reasonCounts: new Map<QuarantinedRate["reason"], number>(),
        sourceRateIds: new Set<string>(),
      } satisfies DirtyPortAggregate);

    aggregate.count += 1;
    aggregate.reasonCounts.set(entry.reason, (aggregate.reasonCounts.get(entry.reason) ?? 0) + 1);
    aggregate.sourceRateIds.add(entry.sourceRateId);
    aggregates.set(key, aggregate);
  }

  return Array.from(aggregates.values())
    .map((entry) => ({
      field: entry.field,
      value: entry.value,
      count: entry.count,
      reasons: Array.from(entry.reasonCounts.entries())
        .map(([reason, count]) => ({ reason, count }))
        .sort(compareQuarantineReasons),
      sourceRateIds: Array.from(entry.sourceRateIds).sort(),
    }))
    .sort((left, right) => {
      if (left.field !== right.field) {
        return left.field.localeCompare(right.field);
      }
      return left.value.localeCompare(right.value);
    });
}

function buildCountryEligibility(
  routes: RouteOption[],
  quarantined: QuarantinedRate[],
  equipmentProfiles: EquipmentQuoteProfile[],
): RouteHealthUnsupportedCountry[] {
  const enabledModes = collectEnabledModes(equipmentProfiles);
  const eligibleContainerTypes = new Set<ContainerType>(
    enabledModes.map((mode) => mode.containerType),
  );

  const countries = new Set<string>();
  for (const route of routes) {
    countries.add(route.destinationCountry);
  }
  for (const entry of quarantined) {
    const country = entry.raw.destination_country?.trim().toUpperCase() ?? "";
    if (country.length === 2) {
      countries.add(country);
    }
  }

  return Array.from(countries)
    .filter((country) => {
      return !routes.some(
        (route) =>
          route.destinationCountry === country &&
          eligibleContainerTypes.has(route.containerType),
      );
    })
    .map((country) => ({
      country,
      eligibleRouteCount: routes.filter(
        (route) =>
          route.destinationCountry === country && eligibleContainerTypes.has(route.containerType),
      ).length,
    }))
    .sort((left, right) => compareCountries(left.country, right.country));
}

export function buildRouteHealthReport(
  catalog: RouteCatalog,
  equipmentProfiles: EquipmentQuoteProfile[] = EQUIPMENT_QUOTE_PROFILES,
): RouteHealthReport {
  const { countrySummaries, countryContainerSummaries } = buildCountryAggregates(catalog.routes);
  const missingTransitRows = buildMissingTransitRows(catalog.routes);
  const quarantineCountsByReason = buildQuarantineReasonCounts(catalog.quarantined);
  const dirtyQuarantinedRawPortStrings = buildDirtyPortSummaries(catalog.quarantined);
  const countriesWithoutEligibleAutomaticRoute = buildCountryEligibility(
    catalog.routes,
    catalog.quarantined,
    equipmentProfiles,
  );
  const enabledModes = collectEnabledModes(equipmentProfiles);

  const warnings: string[] = [];
  if (missingTransitRows.length > 0) {
    warnings.push(
      `${missingTransitRows.length} route(s) still lack transit data and must be confirmed from the rate table or an approved fallback.`,
    );
  }
  if (quarantineCountsByReason.length > 0) {
    warnings.push(
      `${catalog.quarantined.length} row(s) were quarantined across ${quarantineCountsByReason.length} reason bucket(s).`,
    );
  }
  if (dirtyQuarantinedRawPortStrings.length > 0) {
    warnings.push(
      `${dirtyQuarantinedRawPortStrings.length} dirty raw port string(s) were quarantined for review.`,
    );
  }

  const criticalIssues: string[] = [];
  if (catalog.routes.length === 0) {
    criticalIssues.push(
      "No normalized routes were built from the supplied ocean rate rows.",
    );
  }
  for (const entry of countriesWithoutEligibleAutomaticRoute) {
    criticalIssues.push(
      `No eligible automatic route for ${entry.country} across ${enabledModes.length} public mode(s).`,
    );
  }

  return {
    routeHealthVersion: CALCULATOR_V3_ROUTE_HEALTH_VERSION,
    summary: {
      routeCount: catalog.routes.length,
      quarantinedCount: catalog.quarantined.length,
      countryCount: new Set([
        ...catalog.routes.map((route) => route.destinationCountry),
        ...catalog.quarantined
          .map((entry) => entry.raw.destination_country?.trim().toUpperCase() ?? "")
          .filter((country) => country.length === 2),
      ]).size,
      publicProfileCount: equipmentProfiles.length,
      publicModeCount: enabledModes.length,
    },
    routeCountsByCountry: countrySummaries,
    routeCountsByCountryAndContainer: countryContainerSummaries,
    transitCoverage: {
      overall: {
        routeCount: catalog.routes.length,
        transitKnownCount: catalog.routes.filter((route) => route.transitTimeDays != null).length,
        transitMissingCount: catalog.routes.filter((route) => route.transitTimeDays == null).length,
        transitCoveragePercent: roundCoveragePercent(
          catalog.routes.length,
          catalog.routes.filter((route) => route.transitTimeDays != null).length,
        ),
      },
      byCountry: countrySummaries,
      byCountryAndContainer: countryContainerSummaries,
    },
    missingTransitRows,
    quarantineCountsByReason,
    countriesWithoutEligibleAutomaticRoute,
    dirtyQuarantinedRawPortStrings,
    warnings,
    criticalIssues,
  };
}
