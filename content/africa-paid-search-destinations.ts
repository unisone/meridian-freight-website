/**
 * Africa Wave-1 paid-search destination routes (English).
 *
 * Ghana vertical slice: 2 immutable records driving the locale-neutral
 * `/destinations/ghana/{segment}` pages — the landing destinations for the
 * Ghana Gate-A Google Ads campaigns. Kenya + Tanzania are added here later
 * (the array's own count invariant grows with them; the LATAM `es` array and
 * its EXPECTED_ROUTE_COUNT are untouched).
 *
 * URLs are locale-neutral (defaultLocale "en" + localePrefix "as-needed"), so
 * canonical paths are `/destinations/{country}/{segment}` with NO `/en` prefix —
 * the exact form used as the live Google Ads final URLs.
 *
 * Copy is verified-first-draft English (content/africa-paid-search-copy.ts),
 * pending operator review before go-live. Facts are grounded ONLY in the
 * approved Ghana positioning; no African deal history is ever cited and no
 * trademark names appear in visible copy.
 */

import { AFRICA_PAID_SEARCH_COPY } from "@/content/africa-paid-search-copy";
import type { PaidSearchDestination, PaidSearchStep } from "@/content/latam-paid-search-destinations";

// Re-export shared helper types so downstream tests/imports have one source.
export type { PaidSearchDestination, PaidSearchStep };

// ─── Enums ──────────────────────────────────────────────────────────────────

export const AFRICA_PAID_SEARCH_COUNTRIES = ["ghana"] as const;
export type AfricaPaidSearchCountrySlug = (typeof AFRICA_PAID_SEARCH_COUNTRIES)[number];

export const AFRICA_PAID_SEARCH_SEGMENTS = [
  "farm-tractors-usa",
  "heavy-equipment-usa",
] as const;
export type AfricaPaidSearchSegmentSlug = (typeof AFRICA_PAID_SEARCH_SEGMENTS)[number];

export type AfricaPaidSearchCountryCode = "GH";
export type AfricaPaidSearchSegmentKey = "farm_tractor_import" | "heavy_equipment_import";
export type AfricaPaidSearchRequestType =
  | "farm_tractor_import_quote"
  | "heavy_equipment_import_quote";
/** Website-emitted default cargo class; final qualified value is downstream. */
export type AfricaPaidSearchCargoClass = "farm_tractor" | "heavy_oog";
export type AfricaPaidSearchRouteKey =
  `${AfricaPaidSearchCountrySlug}/${AfricaPaidSearchSegmentSlug}`;

// ─── Per-country / per-segment metadata ─────────────────────────────────────

const COUNTRY_META: Record<
  AfricaPaidSearchCountrySlug,
  { code: AfricaPaidSearchCountryCode; name: string }
> = {
  ghana: { code: "GH", name: "Ghana" },
};

const SEGMENT_META: Record<
  AfricaPaidSearchSegmentSlug,
  {
    key: AfricaPaidSearchSegmentKey;
    cargoClass: AfricaPaidSearchCargoClass;
    requestType: AfricaPaidSearchRequestType;
    publicName: string;
  }
> = {
  "farm-tractors-usa": {
    key: "farm_tractor_import",
    cargoClass: "farm_tractor",
    requestType: "farm_tractor_import_quote",
    publicName: "Farm tractor import",
  },
  "heavy-equipment-usa": {
    key: "heavy_equipment_import",
    cargoClass: "heavy_oog",
    requestType: "heavy_equipment_import_quote",
    publicName: "Heavy equipment import",
  },
};

/**
 * Verified official sources per country. Ghana: Ghana Revenue Authority (GRA)
 * for the duty line + entry, and Ghana Standards Authority (GSA) import
 * inspection for used-machinery conformity. URLs are the named authorities' own.
 */
const OFFICIAL_SOURCES: Record<
  AfricaPaidSearchCountrySlug,
  readonly PaidSearchDestination["officialSources"][number][]
> = {
  ghana: [
    {
      id: "GH-01",
      label: "Ghana Revenue Authority (GRA) — Customs",
      url: "https://gra.gov.gh/customs/",
      description:
        "Ghana's customs and tax authority: import entry, tariff/duty classification, VAT, NHIL and GETFund levies. Your licensed broker confirms the exact duty line for your machine here.",
    },
    {
      id: "GH-02",
      label: "Ghana Standards Authority (GSA) — Import Inspection",
      url: "https://gsa.gov.gh/import-inspection/",
      description:
        "GSA import inspection: conformity assessment for high-risk imported goods, including used machinery, brought into Ghana. Importers register with the GSA and provide a certificate of conformance against the applicable Ghana Standard.",
    },
  ],
};

/** The curated valid pairs for the Ghana slice (both segments). */
const VALID_PAIRS: readonly (readonly [
  AfricaPaidSearchCountrySlug,
  AfricaPaidSearchSegmentSlug,
])[] = [
  ["ghana", "farm-tractors-usa"],
  ["ghana", "heavy-equipment-usa"],
];

// ─── Record factory (verified English copy from africa-paid-search-copy) ──────

function buildDestination(
  countrySlug: AfricaPaidSearchCountrySlug,
  segmentSlug: AfricaPaidSearchSegmentSlug,
): PaidSearchDestination {
  const c = COUNTRY_META[countrySlug];
  const s = SEGMENT_META[segmentSlug];
  // Locale-neutral canonical path (no /en prefix) — the live Google Ads final URL.
  const path = `/destinations/${countrySlug}/${segmentSlug}` as const;
  const trackingPrefix = `${countrySlug}_${s.key}`;
  const copy = AFRICA_PAID_SEARCH_COPY[`${countrySlug}/${segmentSlug}`];
  if (!copy) {
    throw new Error(`Missing Africa paid-search copy for ${countrySlug}/${segmentSlug}`);
  }

  return {
    routeKey: `${countrySlug}/${segmentSlug}`,
    locale: "en",
    country: {
      code: c.code,
      slug: countrySlug,
      name: c.name,
      // Locale-neutral hub (the generic English /destinations/{country} fact-sheet).
      hubPath: `/destinations/${countrySlug}`,
    },
    segment: {
      slug: segmentSlug,
      key: s.key,
      publicName: s.publicName,
      cargoClass: s.cargoClass,
      requestType: s.requestType,
    },
    seo: {
      title: copy.seoTitle,
      description: copy.seoDescription,
      canonicalPath: path,
    },
    breadcrumbLabel: s.publicName,
    eyebrow: copy.eyebrow,
    h1: copy.h1,
    heroBody: copy.heroBody,
    heroBullets: copy.heroBullets,
    scopeIncluded: copy.scopeIncluded,
    scopeExcluded: copy.scopeExcluded,
    process: {
      heading: "How we handle the shipment",
      intro: copy.processIntro,
      steps: copy.processSteps,
    },
    quoteReadiness: {
      heading: "What we need to prepare a useful quote",
      intro: copy.quoteIntro,
      fields: copy.quoteFields,
    },
    compliance: {
      heading: copy.complianceHeading,
      body: copy.complianceBody,
      localResponsibility: copy.localResponsibility,
    },
    faq: copy.faq,
    officialSources: OFFICIAL_SOURCES[countrySlug],
    jsonLd: {
      serviceName: `Importing ${s.publicName.toLowerCase()} from the USA to ${c.name}`,
      serviceType: "Freight forwarding and import coordination for used machinery",
      areaServedCountryName: c.name,
    },
    cta: {
      heading: copy.ctaHeading,
      description: copy.ctaDescription,
      whatsappLabel: "Quote on WhatsApp",
      calculatorLabel: "Estimate freight cost",
      whatsappPrefill: copy.whatsappPrefill,
    },
    tracking: {
      heroWhatsapp: `${trackingPrefix}_hero_whatsapp`,
      heroCalculator: `${trackingPrefix}_hero_calculator`,
      finalWhatsapp: `${trackingPrefix}_final_whatsapp`,
      finalCalculator: `${trackingPrefix}_final_calculator`,
    },
    internalLinks: [
      // Locale-neutral hrefs (English is served unprefixed under as-needed).
      { label: `${c.name}: shipping guide`, href: `/destinations/${countrySlug}` },
      { label: "Assisted equipment sourcing", href: "/services/equipment-sales" },
      { label: "Freight calculator", href: "/pricing/calculator" },
    ],
  };
}

export const AFRICA_PAID_SEARCH_DESTINATIONS: readonly PaidSearchDestination[] =
  VALID_PAIRS.map(([country, segment]) => buildDestination(country, segment));
