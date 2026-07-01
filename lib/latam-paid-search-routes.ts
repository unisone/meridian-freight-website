/**
 * Server-side route registry for the LATAM paid-search destination pages.
 *
 * This Map is the SOLE source of truth for country/segment/landing_route/
 * request_type/cargo_class (spec §4, §15 trust boundary). The lead Server
 * Action (P3) must rederive these from the routeKey here and NEVER trust
 * client-sent values, so `?country=CL` cannot poison an Argentina lead.
 */

import {
  LATAM_PAID_SEARCH_DESTINATIONS,
  type LatamPaidSearchDestination,
  type PaidSearchCountrySlug,
  type PaidSearchDestination,
  type PaidSearchRouteKey,
  type PaidSearchSegmentSlug,
} from "@/content/latam-paid-search-destinations";
import { AFRICA_PAID_SEARCH_DESTINATIONS } from "@/content/africa-paid-search-destinations";

const EXPECTED_ROUTE_COUNT = 14;
const ARGENTINA_SLUG: PaidSearchCountrySlug = "argentina";

const destinationByRouteKey: ReadonlyMap<PaidSearchRouteKey, LatamPaidSearchDestination> =
  new Map(LATAM_PAID_SEARCH_DESTINATIONS.map((record) => [record.routeKey, record]));

/**
 * One locale-parametric lookup Map spanning BOTH registries (es LATAM + en
 * Africa), keyed by the globally-unique routeKey. Country slugs never collide
 * across locales, so a routeKey resolves to exactly one record. The resolver
 * below still matches `record.locale === locale` so an es routeKey can never
 * cross-resolve as en (trust-boundary safety). The registries themselves stay
 * SEPARATE, each asserting its own count invariant.
 */
const allDestinationByRouteKey: ReadonlyMap<string, PaidSearchDestination> = new Map(
  [...LATAM_PAID_SEARCH_DESTINATIONS, ...AFRICA_PAID_SEARCH_DESTINATIONS].map((record) => [
    record.routeKey,
    record,
  ]),
);

/**
 * Fail fast at module load if the registry drifts from its invariants.
 * Exported so a unit test can assert it does not throw.
 */
export function assertRouteRegistry(): void {
  if (LATAM_PAID_SEARCH_DESTINATIONS.length !== EXPECTED_ROUTE_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_ROUTE_COUNT} paid-search routes; received ${LATAM_PAID_SEARCH_DESTINATIONS.length}`,
    );
  }
  if (destinationByRouteKey.size !== LATAM_PAID_SEARCH_DESTINATIONS.length) {
    throw new Error("Duplicate paid-search routeKey detected");
  }
  const canonicalPaths = new Set<string>();
  for (const record of LATAM_PAID_SEARCH_DESTINATIONS) {
    const expectedPath = `/es/destinations/${record.country.slug}/${record.segment.slug}`;
    if (record.seo.canonicalPath !== expectedPath) {
      throw new Error(`Canonical path mismatch for ${record.routeKey}`);
    }
    if (canonicalPaths.has(record.seo.canonicalPath)) {
      throw new Error(`Duplicate canonical path for ${record.routeKey}`);
    }
    canonicalPaths.add(record.seo.canonicalPath);
  }
}

assertRouteRegistry();

/**
 * Resolve a record for a valid locale/country/segment combo, else null.
 *
 * Locale-parametric: `es` resolves LATAM routes, `en` resolves Africa routes.
 * After the routeKey lookup we assert `record.locale === locale`, so an es
 * routeKey requested with `en` (or vice versa) returns null — a routeKey can
 * never cross-resolve across locales (trust boundary).
 */
export function getPaidSearchDestination(
  locale: string,
  country: string,
  segment: string,
): PaidSearchDestination | null {
  if (locale !== "es" && locale !== "en") return null;
  const record = allDestinationByRouteKey.get(`${country}/${segment}`);
  if (!record || record.locale !== locale) return null;
  return record;
}

/**
 * Resolve a record by its routeKey alone, deriving the locale from the record
 * itself. This is the SERVER-SIDE locale derivation the lead / whatsapp-ref
 * actions use: the client sends only a routeKey (never a locale), the server
 * re-derives the full record (and its authoritative `record.locale`) from the
 * registry, and reads es→LATAM / en→Africa off `record.locale`. Returns null
 * for any unknown routeKey.
 */
export function resolvePaidSearchRoute(routeKey: string): PaidSearchDestination | null {
  return allDestinationByRouteKey.get(routeKey) ?? null;
}

/**
 * Static params for the dynamic `[slug]/[segment]` route — the TWELVE
 * non-Argentina combos. Argentina is served by its own static-parent branch
 * (`argentina/[segment]`), so it is excluded here.
 */
export function getPaidSearchStaticParams(): {
  slug: PaidSearchCountrySlug;
  segment: PaidSearchSegmentSlug;
}[] {
  return LATAM_PAID_SEARCH_DESTINATIONS.filter(
    (record) => record.country.slug !== ARGENTINA_SLUG,
  ).map((record) => ({ slug: record.country.slug, segment: record.segment.slug }));
}

/** Static params for the Argentina `argentina/[segment]` branch — the TWO AR combos. */
export function getArgentinaPaidSearchStaticParams(): { segment: PaidSearchSegmentSlug }[] {
  return LATAM_PAID_SEARCH_DESTINATIONS.filter(
    (record) => record.country.slug === ARGENTINA_SLUG,
  ).map((record) => ({ segment: record.segment.slug }));
}
