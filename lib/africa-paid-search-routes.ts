/**
 * Server-side route registry helpers for the Africa (English) paid-search LPs.
 *
 * This mirrors `lib/latam-paid-search-routes.ts` but keeps a SEPARATE per-locale
 * count invariant: the Africa array asserts its OWN N (Ghana slice N=2; grows to
 * 6 when Kenya + Tanzania are added). The LATAM `es` array and its
 * EXPECTED_ROUTE_COUNT=14 are untouched — that assertion gates every live LATAM
 * page and must not move.
 *
 * The lookup / trust-boundary resolver itself is shared and lives in
 * `lib/latam-paid-search-routes.ts` (one locale-parametric resolver, not a
 * duplicate); this file only owns the Africa invariant + static params.
 */

import {
  AFRICA_PAID_SEARCH_DESTINATIONS,
  type AfricaPaidSearchCountrySlug,
  type AfricaPaidSearchSegmentSlug,
} from "@/content/africa-paid-search-destinations";

/** Ghana vertical slice = 2 routes; bump to 6 when KE/TZ join the array. */
const EXPECTED_AFRICA_ROUTE_COUNT = 2;

const africaByRouteKey = new Map(
  AFRICA_PAID_SEARCH_DESTINATIONS.map((record) => [record.routeKey, record]),
);

/**
 * Fail fast at module load if the Africa registry drifts from its invariants.
 * Exported so a unit test can assert it does not throw. Runs on import — every
 * Africa paid-search page / sitemap import triggers it.
 */
export function assertAfricaRouteRegistry(): void {
  if (AFRICA_PAID_SEARCH_DESTINATIONS.length !== EXPECTED_AFRICA_ROUTE_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_AFRICA_ROUTE_COUNT} Africa paid-search routes; received ${AFRICA_PAID_SEARCH_DESTINATIONS.length}`,
    );
  }
  if (africaByRouteKey.size !== AFRICA_PAID_SEARCH_DESTINATIONS.length) {
    throw new Error("Duplicate Africa paid-search routeKey detected");
  }
  const canonicalPaths = new Set<string>();
  for (const record of AFRICA_PAID_SEARCH_DESTINATIONS) {
    if (record.locale !== "en") {
      throw new Error(`Africa route ${record.routeKey} must be locale "en"`);
    }
    const expectedPath = `/destinations/${record.country.slug}/${record.segment.slug}`;
    if (record.seo.canonicalPath !== expectedPath) {
      throw new Error(`Canonical path mismatch for ${record.routeKey}`);
    }
    if (canonicalPaths.has(record.seo.canonicalPath)) {
      throw new Error(`Duplicate canonical path for ${record.routeKey}`);
    }
    canonicalPaths.add(record.seo.canonicalPath);
  }
}

assertAfricaRouteRegistry();

/**
 * Static params for the dynamic `[slug]/[segment]` route — every Africa combo,
 * locale `en` (served unprefixed under `localePrefix: "as-needed"`).
 */
export function getAfricaPaidSearchStaticParams(): {
  slug: AfricaPaidSearchCountrySlug;
  segment: AfricaPaidSearchSegmentSlug;
}[] {
  return AFRICA_PAID_SEARCH_DESTINATIONS.map((record) => ({
    slug: record.country.slug as AfricaPaidSearchCountrySlug,
    segment: record.segment.slug as AfricaPaidSearchSegmentSlug,
  }));
}
