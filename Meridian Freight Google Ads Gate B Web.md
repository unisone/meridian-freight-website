# Meridian Freight Google Ads Gate B Website Implementation Spec

**Version:** 1.0
**Prepared:** 2026-06-22
**Repository:** `/Users/zaytsev/Documents/Projects/Active/meridian-freight-website`
**Production domain:** `https://meridianexport.com`
**Implementation mode:** isolated branch and preview only
**Google Ads account:** `378-300-2123`
**Google Ads tag:** `AW-17952470509`
**Live-spend authority:** `$0/day`
**Gate B activation:** not approved

---

## 1. Executive Build Summary

Build ten Spanish paid-search destination routes as one data-driven page system inside the existing Meridian website.

The implementation must:

1. Reuse the current Meridian navigation, footer, typography, spacing, buttons, trust components, forms, imagery conventions, analytics foundation, and responsive layout.
2. Add one dynamic route:

   ```text
   app/[locale]/destinations/[country]/[segment]/page.tsx
   ```
3. Store all country-, segment-, SEO-, CTA-, compliance-, and copy-specific content in:

   ```text
   content/latam-paid-search-destinations.ts
   ```
4. Render all ten records through one shared page component:

   ```text
   components/destinations/latam-paid-search-page.tsx
   ```
5. Extend the existing attribution implementation to preserve Google click IDs and required UTM fields through both form and WhatsApp paths.
6. Generate an opaque `whatsapp_ref` so raw click IDs are not exposed in the visible WhatsApp message.
7. Keep local import clearance, duties, taxes, national permits, destination-port charges, and destination-country inland delivery outside Meridian’s default advertised scope unless a written quote explicitly includes them.
8. Position Meridian as the U.S.-side freight, export, preparation, and coordination operator—not as the equipment seller, customs authority, or guarantor of admissibility.
9. Implement route-specific regulatory caveats based on current official government sources.
10. Complete branch, preview, message-match, attribution, form, router, CRM-contract, and synthetic QQO tests.
11. Stop before production deployment, Google Ads changes, conversion uploads, router mutation, or customer messaging.

Gate A’s documented structure already maps ten paused campaigns to these ten destination routes. The workbook identifies route construction, attribution persistence, and the `MERIDIAN_QQO` dry run as the remaining website-side Gate B work. 

### Required routes

```text
/es/destinations/argentina/importacion-maquinaria-usa
/es/destinations/argentina/flete-cosechadoras-usa
/es/destinations/bolivia/importacion-maquinaria-usa
/es/destinations/bolivia/flete-equipo-pesado-usa
/es/destinations/paraguay/importacion-maquinaria-usa
/es/destinations/paraguay/flete-cosechadoras-usa
/es/destinations/chile/importacion-maquinaria-usa
/es/destinations/chile/flete-equipo-pesado-usa
/es/destinations/uruguay/importacion-maquinaria-usa
/es/destinations/uruguay/flete-cosechadoras-usa
```

---

## 2. Source Hierarchy and Scope Boundaries

### 2.1 Source hierarchy

Use sources in this order:

| Priority | Source                                                  | Controls                                                                                                 |
| -------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1        | Canonical Google Ads Ops Workbook                       | Route mapping, campaign intent, attribution contract, launch boundaries                                  |
| 2        | `Conversion Measurement Contract` workbook tab          | Cross-channel fields, router expectations, CRM handoff                                                   |
| 3        | Local website repository                                | Existing components, forms, design tokens, analytics implementation, API conventions                     |
| 4        | Current production website                              | Visual consistency, existing claims, credentials and destination-hub context                             |
| 5        | Official country government/customs/agriculture sources | Regulatory caveats and source links                                                                      |
| 6        | Secondary logistics sources                             | Operational context only where no official source exists; none is required for the core legal copy below |

The workbook remains the operating tracker and must not be replaced by another spreadsheet. Its current campaign matrix treats the new final URLs as provisional pending route QA. 

The current site already uses a unified main-site presentation for freight services, process explanations, proof, destination content, and contact CTAs. These pages must extend that system rather than create a disconnected paid-traffic microsite. ([meridianexport.com][1])

### 2.2 Repository preflight

Before writing code, Codex must inspect the local repository and bind this specification to existing components:

```bash
cd /Users/zaytsev/Documents/Projects/Active/meridian-freight-website

git status --short
git branch --show-current
git log -1 --oneline

find app components content lib -maxdepth 4 -type f | sort

rg -n \
  "Header|Footer|Breadcrumb|WhatsApp|FAQ|Trust|ContactForm|QuoteForm|JsonLd|tracking|gclid|utm_" \
  app components content lib
```

Create a new isolated branch using the repository’s existing naming convention. Do not work directly on the default or production branch.

### 2.3 In scope

* Ten routes and their metadata.
* One reusable page renderer.
* One validated route-record collection.
* Country- and segment-specific Spanish copy.
* Official source links.
* Existing design-system integration.
* Attribution capture and persistence.
* WhatsApp-ref generation and prefill construction.
* Form hidden-field and server-payload extension.
* Preview/test CRM adapter or existing safe dry-run path.
* Synthetic QQO evaluator testing.
* Route, metadata, accessibility, render, AdsBot, tracking, claim and message-match QA.
* Workbook evidence update after implementation.

### 2.4 Out of scope

* Google Ads campaign activation.
* Budget or bid changes.
* Editing current Google Ads campaigns, keywords, negatives or RSAs.
* Creating or changing conversion actions.
* Google Ads conversion uploads.
* Production site deployment.
* Meta campaign activation.
* WABA, phone-number, router or webhook mutation.
* Production CRM mutation.
* Sending WhatsApp messages to real customers.
* Promising customs clearance, admissibility, duties, taxes, delivery dates or landed cost.
* Creating equipment inventory, product checkout, equipment pricing or seller-like pages.

### 2.5 Commercial scope rule

Public copy must maintain this division:

**Meridian may quote:**

* Seller coordination.
* Optional sourcing assistance under a separately defined scope.
* U.S. or Canadian inland pickup.
* Measurements and transport planning.
* Disassembly, packing and export preparation when required.
* Container, flat-rack, RoRo or project-cargo coordination.
* Export documents.
* Ocean or other international freight included in the written quote.
* Cargo insurance when separately offered and accepted.

**The destination-country importer and local professionals control:**

* Import eligibility.
* Customs classification.
* Import permits and registrations.
* Phytosanitary or biosecurity authorizations.
* Duties, taxes and government fees.
* Customs brokerage.
* Terminal storage and destination charges.
* Local road permits and inland delivery unless Meridian explicitly quotes them.
* Final release by customs, agriculture or port authorities.

---

## 3. Route Architecture and File Map

### 3.1 Required route system

```text
app/
└── [locale]/
    └── destinations/
        ├── [country]/
        │   ├── page.tsx                  # existing country hub
        │   └── [segment]/
        │       └── page.tsx              # new shared paid-search route
        └── page.tsx                      # existing destinations index
```

Do not replace existing country hubs. The new pages are focused service-intent children of those hubs.

### 3.2 Required file map

```text
content/
└── latam-paid-search-destinations.ts
    # All ten immutable route records and shared content references.

lib/
├── latam-paid-search-routes.ts
│   # Route lookup, validation, static params, metadata helpers.
├── tracking.ts
│   # Extend existing attribution implementation; do not create a competing tracker.
└── lead-attribution.ts
    # Typed payload, normalization, validation, lead/ref construction.

components/
└── destinations/
    ├── latam-paid-search-page.tsx
    │   # One shared page renderer.
    ├── paid-search-hero.tsx
    ├── paid-search-process.tsx
    ├── paid-search-scope.tsx
    ├── paid-search-quote-readiness.tsx
    ├── paid-search-compliance.tsx
    ├── paid-search-source-links.tsx
    └── paid-search-quote-form.tsx
        # Create only when no suitable existing component can be extended.

app/
└── [locale]/
    └── destinations/
        └── [country]/
            └── [segment]/
                └── page.tsx

app/api/
├── attribution/
│   └── whatsapp-ref/
│       └── route.ts
│       # Add only if no existing equivalent endpoint exists.
└── leads/
    └── route.ts
    # Extend existing endpoint rather than duplicating when present.

tests or repository-native test location/
├── latam-paid-search-destinations.test.ts
├── latam-paid-search-routes.test.ts
├── paid-search-attribution.test.ts
├── paid-search-page.test.tsx
└── latam-paid-search-destinations.e2e.ts
```

### 3.3 Component reuse rule

Before adding any component, Codex must determine whether the repository already has an equivalent:

| Needed behavior    | Preferred implementation                                |
| ------------------ | ------------------------------------------------------- |
| Header/footer      | Existing site-wide components                           |
| Breadcrumbs        | Existing breadcrumb component                           |
| Buttons            | Existing primary/secondary button components            |
| WhatsApp CTA       | Existing WhatsApp component extended with typed payload |
| Trust proof        | Existing credential/proof component                     |
| FAQ                | Existing accordion/FAQ component                        |
| Quote/contact form | Existing form and API route extended                    |
| JSON-LD            | Existing schema helper                                  |
| Analytics          | Existing tracking helper extended                       |
| Source links       | Existing card/list styling where possible               |

Do not introduce a second button system, second form system, second analytics layer or second page layout.

### 3.4 Render sequence

```text
Dynamic route params
→ validate locale/country/segment
→ resolve immutable route record
→ generate canonical metadata
→ render shared page component
→ hydrate attribution client
→ derive CTA/form route context
→ create WhatsApp ref on interaction
→ submit form or open WhatsApp
→ test router/CRM adapter
```

### 3.5 Static generation

All ten valid routes should be statically generated.

Invalid combinations must return `notFound()`:

```text
/es/destinations/argentina/flete-equipo-pesado-usa
/es/destinations/chile/flete-cosechadoras-usa
/en/destinations/argentina/importacion-maquinaria-usa
```

Do not generate every country × segment combination.

---

## 4. TypeScript Data Model

### 4.1 Core model

```ts
// content/latam-paid-search-destinations.ts

export const PAID_SEARCH_COUNTRIES = [
  "argentina",
  "bolivia",
  "paraguay",
  "chile",
  "uruguay",
] as const;

export const PAID_SEARCH_SEGMENTS = [
  "importacion-maquinaria-usa",
  "flete-cosechadoras-usa",
  "flete-equipo-pesado-usa",
] as const;

export type PaidSearchCountrySlug =
  (typeof PAID_SEARCH_COUNTRIES)[number];

export type PaidSearchSegmentSlug =
  (typeof PAID_SEARCH_SEGMENTS)[number];

export type PaidSearchCountryCode =
  | "AR"
  | "BO"
  | "PY"
  | "CL"
  | "UY";

export type PaidSearchSegmentKey =
  | "machinery_import"
  | "combine_shipping"
  | "heavy_equipment_shipping";

export type PaidSearchRequestType =
  | "import_coordination_quote"
  | "combine_freight_quote"
  | "heavy_equipment_freight_quote";

export type PaidSearchRouteKey =
  `${PaidSearchCountrySlug}/${PaidSearchSegmentSlug}`;

export type SourceAuthorityType =
  | "customs"
  | "agriculture"
  | "port"
  | "government"
  | "official_law"
  | "meridian_internal";

export interface OfficialSource {
  readonly id: string;
  readonly authority: string;
  readonly title: string;
  readonly url: string;
  readonly authorityType: SourceAuthorityType;
  readonly checkedAt: string; // ISO date
  readonly publicLinkLabel: string;
  readonly implementationNote: string;
}

export interface CopyBullet {
  readonly title: string;
  readonly body?: string;
}

export interface ProcessStep {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface ScopeBlock {
  readonly heading: string;
  readonly intro?: string;
  readonly included: readonly string[];
  readonly excluded: readonly string[];
}

export interface QuoteField {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly helpText?: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface SeoCopy {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: `/${string}`;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly imageRef?: string;
}

export interface CtaCopy {
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly secondaryTargetId: string;
  readonly whatsappPrefillTemplate: string;
}

export interface ComplianceCopy {
  readonly heading: string;
  readonly body: string;
  readonly sourceIds: readonly string[];
  readonly localResponsibility: string;
}

export interface TrustCopy {
  readonly heading: string;
  readonly body: string;
  readonly proofSetId: "freight-credentials-v1";
  readonly routeSpecificProofRequirement?: string;
}

export interface GoogleAdsMessageMatch {
  readonly campaignName: string;
  readonly campaignIntent: string;
  readonly adGroupIntentKeys: readonly string[];
  readonly keywordCluster: readonly string[];
  readonly supportedRsaClaims: readonly string[];
  readonly prohibitedRsaClaims: readonly string[];
  readonly firstViewportRequirements: readonly string[];
}

export interface TrackingDefaults {
  readonly sourcePlatform: "google_ads";
  readonly sourceAccountId: "3783002123";
  readonly googleAdsTag: "AW-17952470509";
  readonly country: PaidSearchCountryCode;
  readonly segment: PaidSearchSegmentKey;
  readonly landingRoute: `/${string}`;
  readonly requestType: PaidSearchRequestType;
  readonly routerTagDefault: "#FRT_ES";
}

export interface JsonLdCopy {
  readonly serviceName: string;
  readonly serviceType: string;
  readonly areaServedCountryCode: PaidSearchCountryCode;
  readonly areaServedCountryName: string;
}

export interface LatamPaidSearchDestination {
  readonly routeKey: PaidSearchRouteKey;
  readonly locale: "es";

  readonly country: {
    readonly code: PaidSearchCountryCode;
    readonly slug: PaidSearchCountrySlug;
    readonly name: string;
    readonly countryHubPath: `/es/destinations/${PaidSearchCountrySlug}`;
    readonly tone: "argentina_voseo" | "neutral_professional";
  };

  readonly segment: {
    readonly slug: PaidSearchSegmentSlug;
    readonly key: PaidSearchSegmentKey;
    readonly publicName: string;
  };

  readonly seo: SeoCopy;

  readonly breadcrumbLabel: string;
  readonly eyebrow: string;
  readonly h1: string;
  readonly heroBody: string;
  readonly heroBullets: readonly CopyBullet[];
  readonly cta: CtaCopy;

  readonly process: {
    readonly heading: string;
    readonly intro: string;
    readonly steps: readonly ProcessStep[];
  };

  readonly scope: ScopeBlock;

  readonly quoteReadiness: {
    readonly heading: string;
    readonly intro: string;
    readonly fields: readonly QuoteField[];
  };

  readonly compliance: ComplianceCopy;
  readonly trust: TrustCopy;
  readonly faq: readonly FaqItem[];
  readonly jsonLd: JsonLdCopy;

  readonly googleAds: GoogleAdsMessageMatch;
  readonly tracking: TrackingDefaults;
  readonly sourceIds: readonly string[];
  readonly internalLinks: readonly {
    readonly label: string;
    readonly href: `/${string}`;
  }[];
}
```

### 4.2 Attribution model

```ts
// lib/lead-attribution.ts

export const PAID_ATTRIBUTION_QUERY_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_matchtype",
  "utm_network",
  "utm_device",
] as const;

export type PaidAttributionQueryKey =
  (typeof PAID_ATTRIBUTION_QUERY_KEYS)[number];

export interface PaidAttributionTouch {
  readonly capturedAt: string;
  readonly landingUrl: string;
  readonly referrer?: string;

  readonly gclid?: string;
  readonly gbraid?: string;
  readonly wbraid?: string;
  readonly fbclid?: string;

  readonly utm_source?: string;
  readonly utm_medium?: string;
  readonly utm_campaign?: string;
  readonly utm_term?: string;
  readonly utm_content?: string;
  readonly utm_matchtype?: string;
  readonly utm_network?: string;
  readonly utm_device?: string;
}

export interface PaidRouteContext {
  readonly country: PaidSearchCountryCode;
  readonly segment: PaidSearchSegmentKey;
  readonly landing_route: string;
  readonly request_type: PaidSearchRequestType;
  readonly router_tag: string;
}

export interface PaidAttributionState {
  readonly version: 1;
  readonly attributionId: string;
  readonly firstTouch: PaidAttributionTouch;
  readonly latestTouch: PaidAttributionTouch;
  readonly routeContext: PaidRouteContext;
}

export interface WhatsAppReferenceResponse {
  readonly lead_id: string;
  readonly whatsapp_ref: string;
  readonly expires_at: string;
}

export interface PaidSearchLeadPayload
  extends PaidRouteContext {
  readonly schema_version: "paid-search-lead-v1";

  readonly lead_id: string;
  readonly idempotency_key: string;
  readonly attribution_id: string;
  readonly whatsapp_ref?: string;

  readonly source_platform: "google_ads";
  readonly source_account_id: "3783002123";
  readonly google_ads_tag: "AW-17952470509";

  readonly first_touch: PaidAttributionTouch;
  readonly latest_touch: PaidAttributionTouch;

  readonly equipment_type: string;
  readonly make_model: string;
  readonly year?: string;
  readonly listing_url?: string;
  readonly origin_location: string;
  readonly destination_location: string;
  readonly dimensions?: string;
  readonly weight?: string;
  readonly attachments?: string;
  readonly purchase_status: string;
  readonly requested_timing?: string;
  readonly buyer_role?: string;

  readonly contact_name: string;
  readonly contact_phone?: string;
  readonly contact_email?: string;
  readonly preferred_contact_method: "whatsapp" | "email" | "phone";

  readonly consent_version: string;
  readonly submitted_at: string;
}
```

### 4.3 Route registry and invariants

```ts
// lib/latam-paid-search-routes.ts

import {
  LATAM_PAID_SEARCH_DESTINATIONS,
  type LatamPaidSearchDestination,
  type PaidSearchCountrySlug,
  type PaidSearchRouteKey,
  type PaidSearchSegmentSlug,
} from "@/content/latam-paid-search-destinations";

const EXPECTED_ROUTE_COUNT = 10;

const destinationByRouteKey = new Map<
  PaidSearchRouteKey,
  LatamPaidSearchDestination
>(
  LATAM_PAID_SEARCH_DESTINATIONS.map((record) => [
    record.routeKey,
    record,
  ]),
);

function assertRouteRegistry(): void {
  if (
    LATAM_PAID_SEARCH_DESTINATIONS.length !==
    EXPECTED_ROUTE_COUNT
  ) {
    throw new Error(
      `Expected ${EXPECTED_ROUTE_COUNT} paid-search routes; received ${LATAM_PAID_SEARCH_DESTINATIONS.length}`,
    );
  }

  if (
    destinationByRouteKey.size !==
    LATAM_PAID_SEARCH_DESTINATIONS.length
  ) {
    throw new Error("Duplicate paid-search routeKey detected");
  }

  for (const record of LATAM_PAID_SEARCH_DESTINATIONS) {
    const expectedPath =
      `/es/destinations/${record.country.slug}/${record.segment.slug}`;

    if (record.seo.canonicalPath !== expectedPath) {
      throw new Error(
        `Canonical path mismatch for ${record.routeKey}`,
      );
    }

    if (record.tracking.landingRoute !== expectedPath) {
      throw new Error(
        `Tracking route mismatch for ${record.routeKey}`,
      );
    }

    if (record.country.code !== record.tracking.country) {
      throw new Error(
        `Country tracking mismatch for ${record.routeKey}`,
      );
    }

    if (record.segment.key !== record.tracking.segment) {
      throw new Error(
        `Segment tracking mismatch for ${record.routeKey}`,
      );
    }
  }
}

assertRouteRegistry();

export function getPaidSearchDestination(
  locale: string,
  country: string,
  segment: string,
): LatamPaidSearchDestination | null {
  if (locale !== "es") return null;

  const key =
    `${country}/${segment}` as PaidSearchRouteKey;

  return destinationByRouteKey.get(key) ?? null;
}

export function getPaidSearchStaticParams(): readonly {
  locale: "es";
  country: PaidSearchCountrySlug;
  segment: PaidSearchSegmentSlug;
}[] {
  return LATAM_PAID_SEARCH_DESTINATIONS.map((record) => ({
    locale: "es",
    country: record.country.slug,
    segment: record.segment.slug,
  }));
}
```

### 4.4 Dynamic route skeleton

```tsx
// app/[locale]/destinations/[country]/[segment]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LatamPaidSearchPage } from "@/components/destinations/latam-paid-search-page";
import {
  getPaidSearchDestination,
  getPaidSearchStaticParams,
} from "@/lib/latam-paid-search-routes";

interface PageProps {
  params: Promise<{
    locale: string;
    country: string;
    segment: string;
  }>;
}

export function generateStaticParams() {
  return getPaidSearchStaticParams();
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { locale, country, segment } = await props.params;

  const record = getPaidSearchDestination(
    locale,
    country,
    segment,
  );

  if (!record) return {};

  const canonical = `https://meridianexport.com${record.seo.canonicalPath}`;

  return {
    title: record.seo.title,
    description: record.seo.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "es",
      url: canonical,
      title: record.seo.ogTitle ?? record.seo.title,
      description:
        record.seo.ogDescription ??
        record.seo.description,
      images: record.seo.imageRef
        ? [{ url: record.seo.imageRef }]
        : undefined,
    },
  };
}

export default async function Page(props: PageProps) {
  const { locale, country, segment } = await props.params;

  const record = getPaidSearchDestination(
    locale,
    country,
    segment,
  );

  if (!record) notFound();

  return <LatamPaidSearchPage record={record} />;
}
```

### 4.5 Data-file export rule

```ts
export const LATAM_PAID_SEARCH_DESTINATIONS = [
  // Exactly the ten records defined in Section 7.
] as const satisfies readonly LatamPaidSearchDestination[];
```

Do not fetch this copy from a CMS during Gate B. Keep the launch candidate deterministic and version-controlled.

---

## 5. Country Research Evidence Table

**Research check date:** 2026-06-22

| Country   | Current official evidence                                                                                                                                                                                                                                                                                                                                                                                    | Safe website conclusion                                                                                                                                                                                                                                                       | Copy restriction                                                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Argentina | [Decreto 273/2025](https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto); [AFIDI service](https://www.argentina.gob.ar/servicio/gestionar-la-autorizacion-fitosanitaria-de-importacion-afidi-y-la-evaluacion-de); [SENASA used-machinery control](https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de) | The 2025 decree simplified the used-goods regime by removing CIBU as the prior mechanism, but classification-specific safety, sanitary and environmental controls remain. Used agricultural machinery can require AFIDI and SENASA inspection. ([Argentina][2])               | Do not say “importación libre,” “sin requisitos,” “aduana incluida,” or that every used machine is admissible.                                  |
| Bolivia   | [Aduana Nacional](https://www.aduana.gob.bo/); [SENASAG Cuarentena Vegetal](https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal); [SENASAG](https://www.senasag.gob.bo/)                                                                                                                                                                       | The importer and local customs professional must handle current Aduana/OCE requirements. SENASAG authorization or inspection may apply based on the equipment, agricultural use and contamination risk. ([Aduana Bolivia][3])                                                 | Do not hardcode an expired tax incentive, universal age limit, guaranteed transit port, free storage period or fixed inland route.              |
| Paraguay  | [Ley 7565/2025—BACN](https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados); [DNIT](https://www.dnit.gov.py/web/portal-institucional/); [SENAVE](https://www.senave.gov.py/); [MIC](https://www.mic.gov.py/)                   | Used agricultural machinery eligibility must be validated before purchase against the current law and the active MIC, SENAVE and DNIT process. DNIT provides customs services, while SENAVE controls relevant phytosanitary requirements. ([dnit.gov.py][4])                  | Do not promise that a machine is admissible based only on age, seller description or model. Do not hardcode a port or river route as universal. |
| Chile     | [SAG Resolución 3103/2016](https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725); [Aduanas de Chile—Normas generales](https://www.aduana.cl/capitulo-1-normas-generales/aduana/2007-02-15/151856.html); [Puerto San Antonio—Operación portuaria](https://www.puertosanantonio.com/operacion-portuaria); [SAG](https://www.sag.gob.cl/)                                                   | Used agricultural, forestry and earth-moving machinery must arrive clean and free of soil, plant residue and regulated pests. SAG may inspect at entry, and noncompliance can generate corrective, rejection or re-export costs for the importer. ([normativa.sag.gob.cl][5]) | Do not say “SAG approved” before inspection, guarantee entry, or treat San Antonio as the mandatory port for every shipment.                    |
| Uruguay   | [DGSA Resolución 98/016](https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais); [Aduanas—TGA](https://www.aduanas.gub.uy/innovaportal/v/7032/3/innova.front/tasa-global-arancelaria-tga.html); [DGSA](https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/dgsa)                                  | Used agricultural, forestry and gardening machinery must meet origin-cleaning, treatment/certification and inspection requirements. Customs classification and tax treatment remain machine-specific. ([Gubuy][6])                                                            | Do not publish a universal tariff rate, final landed cost, guaranteed DGSA acceptance or guaranteed Montevideo routing.                         |

### 5.1 Source-record constants

```ts
export const LATAM_PAID_SEARCH_SOURCES = {
  "AR-01": {
    authority: "República Argentina",
    title: "Decreto 273/2025",
    url: "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto",
  },
  "AR-02": {
    authority: "SENASA",
    title: "Autorización Fitosanitaria de Importación — AFIDI",
    url: "https://www.argentina.gob.ar/servicio/gestionar-la-autorizacion-fitosanitaria-de-importacion-afidi-y-la-evaluacion-de",
  },
  "AR-03": {
    authority: "SENASA",
    title: "Control de importación de maquinaria agrícola usada",
    url: "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de",
  },
  "BO-01": {
    authority: "Aduana Nacional de Bolivia",
    title: "Portal institucional",
    url: "https://www.aduana.gob.bo/",
  },
  "BO-02": {
    authority: "SENASAG",
    title: "Área de Cuarentena Vegetal",
    url: "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal",
  },
  "PY-01": {
    authority: "Biblioteca y Archivo Central del Congreso Nacional",
    title: "Ley 7565/2025",
    url: "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados",
  },
  "PY-02": {
    authority: "DNIT",
    title: "Portal institucional",
    url: "https://www.dnit.gov.py/web/portal-institucional/",
  },
  "PY-03": {
    authority: "SENAVE",
    title: "Portal institucional",
    url: "https://www.senave.gov.py/",
  },
  "PY-04": {
    authority: "MIC",
    title: "Portal institucional",
    url: "https://www.mic.gov.py/",
  },
  "CL-01": {
    authority: "SAG",
    title: "Resolución 3103/2016",
    url: "https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725",
  },
  "CL-02": {
    authority: "Aduanas de Chile",
    title: "Normas generales",
    url: "https://www.aduana.cl/capitulo-1-normas-generales/aduana/2007-02-15/151856.html",
  },
  "CL-03": {
    authority: "Puerto San Antonio",
    title: "Operación portuaria",
    url: "https://www.puertosanantonio.com/operacion-portuaria",
  },
  "UY-01": {
    authority: "DGSA",
    title: "Resolución 98/016",
    url: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais",
  },
  "UY-02": {
    authority: "Dirección Nacional de Aduanas",
    title: "Tasa Global Arancelaria",
    url: "https://www.aduanas.gub.uy/innovaportal/v/7032/3/innova.front/tasa-global-arancelaria-tga.html",
  },
} as const;
```

---

## 6. Shared Page Structure

### 6.1 Section order

Every route must render the same structural sequence:

1. Global header.
2. Breadcrumbs.
3. Hero and first-screen scope qualification.
4. Compact trust strip.
5. “Cómo coordinamos esta operación.”
6. Included/excluded scope.
7. Quote-readiness fields.
8. Country-specific compliance/local-responsibility section.
9. Relevant project/proof section.
10. FAQs.
11. Final conversion block.
12. Official sources.
13. Global footer.

### 6.2 First viewport requirements

The first viewport must communicate:

* Equipment/segment.
* Origin: United States.
* Destination country.
* Meridian’s U.S.-side logistics role.
* Primary CTA.
* One sentence separating destination-country customs responsibility.

Do not hide the scope boundary below the fold.

### 6.3 Hero pattern

```text
Eyebrow:
Flete e importación desde EE. UU. · [Country]

H1:
Route-specific title

Body:
Two to three sentences, 55–90 words.

Bullets:
Four concise operational benefits.

Primary CTA:
WhatsApp or quote action.

Secondary CTA:
Anchor to quote-readiness section.
```

### 6.4 Shared trust block

**H2**

```text
Capacidad operativa verificable desde EE. UU.
```

**Body**

```text
Meridian Freight coordina retiro, preparación, embalaje, documentación de exportación y transporte internacional desde Estados Unidos. Cada operación se define por escrito antes de reservar: equipo, ruta, modalidad de carga, alcance incluido y responsabilidades en destino.
```

**Proof set**

Render through the current site’s authoritative trust component rather than duplicating literals in ten records:

```text
FMC #024914NF
IATA/CNS 01108380000
Operación desde 2013
Más de 1.000 exportaciones/proyectos documentados
Experiencia en más de 40 países
Galería o casos reales
```

These credentials and operating-history claims already appear in Meridian’s current site presentation. Codex must retain the existing evidence-backed source rather than creating new numerical claims. ([meridianexport.com][1])

### 6.5 Trust guardrails

* Do not render stars, customer counts or testimonials without current source records.
* Do not use `AggregateRating`.
* Do not imply a government endorsement.
* Do not call Meridian an authorized John Deere, Case IH, Caterpillar or other OEM dealer.
* Do not use a manufacturer logo without the existing site’s documented rights.
* Show route-specific project photos only when metadata confirms the cargo and service represented.
* Use descriptive alt text, not keyword stuffing.

### 6.6 Image strategy

| Segment          | Preferred existing asset                                                |
| ---------------- | ----------------------------------------------------------------------- |
| Machinery import | General agricultural/heavy machinery pickup, yard or loading operation  |
| Combine shipping | Combine dismantling, header preparation, container or flat-rack loading |
| Heavy equipment  | Excavator, loader, dozer or project-cargo loading                       |

Do not generate new photorealistic project evidence. Use existing Meridian-owned project photography or approved licensed images.

### 6.7 Internal links

Each route should link to:

* Parent country hub.
* Relevant service page.
* Relevant equipment/category page when accurate.
* Contact/quote flow.
* One related paid-search route in the same country.

Example:

```text
Argentina machinery import
→ Argentina country hub
→ Combine shipping route
→ Machinery shipping/service page
→ Contact
```

### 6.8 JSON-LD

Render:

1. `BreadcrumbList`
2. `Service`
3. `FAQPage`

Do not render:

* `Product`
* `Offer` with a price
* `Review`
* `AggregateRating`

`Service.provider` should reference the site’s existing canonical organization node:

```json
{
  "@id": "https://meridianexport.com/#organization"
}
```

### 6.9 Official-source section

Public heading:

```text
Fuentes oficiales para validar su operación
```

Public note:

```text
Los requisitos pueden cambiar y dependen de la clasificación, condición y uso del equipo. Consulte estas fuentes y confirme su caso con su importador o despachante antes de comprar o embarcar.
```

Only display the source links assigned to the route record.

---

## 7. Full Copy Package for All 10 Routes

### Shared implementation conventions

* `{{whatsapp_ref}}` is inserted programmatically.
* Do not expose `gclid`, `gbraid`, `wbraid`, `fbclid` or UTMs in visible WhatsApp text.
* The production WhatsApp number comes from the existing site configuration.
* `#FRT_ES` is read from the approved runtime routing contract; the literal shown below is the current default.
* Replace bracketed customer fields with form-like prompts or leave them as readable placeholders in the WhatsApp draft.
* The shared trust proof block from Section 6 is appended to every route.

---

### 7.1 Argentina — Importación de maquinaria

**URL**

```text
/es/destinations/argentina/importacion-maquinaria-usa
```

**SEO title**

```text
Importar maquinaria de EE. UU. a Argentina | Meridian
```

**Meta description**

```text
Coordiná retiro, preparación, embalaje y flete de maquinaria usada desde EE. UU. a Argentina, con alcance separado de aduana y costos locales.
```

**Eyebrow**

```text
Maquinaria desde EE. UU. · Argentina
```

**H1**

```text
Importá maquinaria usada de EE. UU. a Argentina con un alcance claro
```

**Hero body**

```text
¿Ya encontraste una máquina o todavía estás comparando opciones? Meridian coordina la operación en EE. UU.: contacto con el vendedor, retiro, medición, desmontaje o embalaje cuando corresponda, documentación de exportación y flete hasta el puerto argentino acordado. La nacionalización, AFIDI/SENASA, tributos y entrega interior se validan por separado con tu despachante.
```

**Hero bullets**

* Coordinación con el vendedor o compra asistida bajo un alcance separado.
* Retiro, medición, preparación y carga en origen.
* Contenedor, flat rack, RoRo o carga de proyecto según el equipo.
* Cotización internacional separada de los costos argentinos.

**Primary CTA**

```text
Cotizar mi máquina
```

**Secondary CTA**

```text
Ver los datos necesarios
```

**WhatsApp prefill**

```text
#FRT_ES Hola, estoy evaluando importar maquinaria usada desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad/provincia]. Link: [URL]. Necesito cotizar coordinación en origen, preparación y flete. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Cómo coordinamos la operación
```

**Intro**

```text
La ruta se define a partir del equipo real, no de una tarifa genérica. Primero se confirma la información técnica y el alcance; después se reserva.
```

**Steps**

1. **Compartí la máquina**
   Enviá el anuncio, marca, modelo, año, ubicación, vendedor, estado de compra y destino previsto.

2. **Definimos medidas, preparación y modalidad**
   Revisamos dimensiones, peso, accesorios, capacidad de carga y si requiere desmontaje, contenedor, flat rack, RoRo o carga de proyecto.

3. **Coordinamos el tramo de origen**
   Organizamos retiro, ingreso a patio o instalación, preparación, embalaje, carga y documentación de exportación conforme al alcance cotizado.

4. **Entregamos el expediente para destino**
   Compartimos los documentos del tramo internacional para que tu importador y despachante gestionen AFIDI/SENASA, aduana, tributos, terminal y entrega interior.

#### Scope included/excluded

**H2**

```text
Qué puede incluir la cotización
```

**Included**

* Coordinación con el vendedor.
* Compra asistida cuando exista un acuerdo específico.
* Retiro dentro de EE. UU. o Canadá.
* Medición y planificación de carga.
* Desmontaje, embalaje y preparación cuando sean necesarios.
* Transporte al puerto o terminal de salida.
* Documentación de exportación.
* Flete internacional incluido en la propuesta escrita.
* Seguro cuando se cotice y acepte por separado.

**Excluded unless explicitly quoted**

* Venta o garantía del equipo.
* Determinación definitiva de admisibilidad en Argentina.
* AFIDI, actuaciones de SENASA y registros del importador.
* Despacho aduanero argentino.
* Aranceles, IVA, tasas y otros tributos.
* Gastos de terminal, almacenaje o demoras en destino.
* Transporte interior argentino.
* Garantía de fecha de liberación o costo final puesto en destino.

#### Quote-readiness section

**H2**

```text
Datos para preparar una cotización útil
```

**Intro**

```text
Con estos datos podemos definir el tramo internacional sin inventar medidas, ruta ni formato de carga.
```

**Fields**

* Link del equipo o factura proforma.
* Marca, modelo y año.
* Número de serie, si está disponible.
* Ubicación exacta en EE. UU. o Canadá.
* Estado de compra: evaluando, reservado o comprado.
* Dimensiones y peso disponibles.
* Accesorios o implementos incluidos.
* Fotos de los cuatro lados y puntos de carga.
* Ciudad/provincia de destino.
* Puerto sugerido por tu despachante, si ya existe.
* Fecha estimada de compra o disponibilidad.
* Datos del despachante/importador local, si ya fue designado.

#### Compliance/local responsibility caveat

**H2**

```text
Validación argentina antes de comprar o embarcar
```

**Body**

```text
El régimen argentino de bienes usados fue simplificado en 2025, pero eso no elimina los controles que correspondan por clasificación, seguridad, sanidad o ambiente. La maquinaria agrícola usada puede requerir AFIDI y control de SENASA. Tu importador y despachante deben confirmar NCM, elegibilidad, AFIDI, tributos, puerto y costos locales antes de cerrar la compra o autorizar el embarque.
```

**Local-responsibility line**

```text
Meridian coordina el tramo contratado desde origen; la admisibilidad y nacionalización argentina permanecen bajo responsabilidad del importador y sus profesionales locales.
```

Internal sources: `AR-01`, `AR-02`, `AR-03`. ([Argentina][2])

#### Trust/proof section

**H2**

```text
Experiencia para coordinar equipos, no para ocultar el alcance
```

**Body**

```text
Nuestro trabajo se documenta por operación: qué equipo se retira, cómo se prepara, qué modalidad se reserva, qué documentos se generan y dónde termina la responsabilidad contratada.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿Meridian vende la maquinaria?**

```text
No. Meridian es el operador de logística y exportación. Podemos coordinar con tu vendedor o brindar asistencia de búsqueda/compra bajo un alcance separado, pero el equipo y su condición deben documentarse con el vendedor e inspección que corresponda.
```

**2. ¿Pueden darme el costo final nacionalizado?**

```text
Cotizamos el alcance internacional que controlamos. Tu despachante debe calcular aranceles, IVA, tasas, AFIDI/SENASA, terminal y entrega interior según la clasificación y situación real del equipo.
```

**3. ¿Toda maquinaria usada necesita AFIDI?**

```text
No debe asumirse una respuesta universal. La necesidad depende del tipo y clasificación del equipo. La maquinaria agrícola usada puede estar sujeta a AFIDI y control de SENASA; confirmalo antes de comprar.
```

**4. ¿A qué puerto argentino se envía?**

```text
El puerto se define según la naviera, la modalidad de carga, las dimensiones, el itinerario disponible y el plan de tu despachante. La página no promete un puerto único.
```

**JSON-LD**

```text
Service name: Coordinación para importar maquinaria usada desde EE. UU. a Argentina
Service type: Freight forwarding and export coordination for used machinery
Area served: Argentina (AR)
```

**Internal ad-message-match note**

```text
Must satisfy searches around importar maquinaria usada, importar maquinaria agrícola desde EE. UU., traer maquinaria desde USA and freight/import coordination. First viewport must include “EE. UU.”, “Argentina”, “maquinaria usada”, operational scope and local-customs separation. Do not use “precio final,” “aduana incluida,” “importación libre” or “proveedor directo.”
```

---

### 7.2 Argentina — Flete de cosechadoras

**URL**

```text
/es/destinations/argentina/flete-cosechadoras-usa
```

**SEO title**

```text
Flete de cosechadoras de EE. UU. a Argentina | Meridian
```

**Meta description**

```text
Cotizá retiro, desmontaje, embalaje y flete marítimo de cosechadoras usadas desde EE. UU. a Argentina, con alcance técnico por equipo.
```

**Eyebrow**

```text
Cosechadoras desde EE. UU. · Argentina
```

**H1**

```text
Flete de cosechadoras desde EE. UU. a Argentina
```

**Hero body**

```text
Una cosechadora se cotiza por máquina, cabezal, neumáticos, dimensiones, peso y forma de carga; no por una tarifa genérica. Meridian coordina retiro, desmontaje y preparación en origen, documentación de exportación y flete hasta el puerto argentino acordado. AFIDI/SENASA, aduana, tributos y entrega interior quedan con tu importador y despachante.
```

**Hero bullets**

* Cosechadora, cabezal y accesorios cotizados como un conjunto técnico.
* Plan de desmontaje y carga según modelo y configuración.
* Contenedor, flat rack, RoRo o carga de proyecto según viabilidad.
* Fotos, medidas y alcance documentados antes de reservar.

**Primary CTA**

```text
Cotizar mi cosechadora
```

**Secondary CTA**

```text
Ver medidas y preparación
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar el flete de una cosechadora desde EE. UU. a Argentina. Marca/modelo/año: [datos]. Cabezal: [tipo/ancho]. Ubicación: [ciudad/estado]. Destino: [ciudad/provincia]. Link: [URL]. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
De la ubicación del equipo al puerto argentino acordado
```

**Intro**

```text
La preparación se diseña alrededor de la cosechadora y de cada implemento incluido.
```

**Steps**

1. **Ficha de la cosechadora y del cabezal**
   Reunimos modelo, año, serie, horas, ancho de cabezal, neumáticos, accesorios, fotos, ubicación y estado de compra.

2. **Plan de desmontaje y modalidad de carga**
   Definimos qué componentes deben separarse y qué modalidad resulta técnicamente viable.

3. **Retiro, preparación y exportación**
   Coordinamos transporte de origen, patio, desmontaje, protección, carga y documentos de exportación según propuesta.

4. **Flete y expediente de destino**
   Gestionamos la reserva internacional y entregamos la documentación para el proceso argentino administrado por el importador.

#### Scope included/excluded

**Included**

* Retiro de la cosechadora.
* Coordinación del cabezal y accesorios declarados.
* Medición y planificación.
* Desmontaje y preparación cotizados.
* Transporte de origen y terminal.
* Exportación y flete marítimo especificado.
* Evidencia fotográfica del proceso cuando forme parte del servicio.

**Excluded unless explicitly quoted**

* Compra, garantía mecánica o representación del vendedor.
* Reparaciones.
* AFIDI, SENASA o despacho argentino.
* Tributos, terminal y almacenaje.
* Grúa, permiso vial o transporte interior en Argentina.
* Garantía de tránsito, fecha de liberación o costo puesto en campo.

#### Quote-readiness section

**Fields**

* Marca, modelo, año y número de serie.
* Horas de motor/separador si están disponibles.
* Link o factura.
* Ubicación de la máquina.
* Modelo, tipo y ancho del cabezal.
* Carro de cabezal, si existe.
* Medidas y peso publicados.
* Configuración de neumáticos u orugas.
* Fotos de descarga, sinfín, cabina, ruedas/orugas y cabezal.
* Estado de arranque y movilidad para carga.
* Destino argentino y plazo estimado.

#### Compliance/local responsibility caveat

```text
La maquinaria agrícola usada puede requerir AFIDI, limpieza verificable e inspección de SENASA. El importador argentino debe validar la clasificación, elegibilidad, documentación sanitaria, tributos y procedimiento de ingreso antes del embarque. La preparación física en origen no equivale a aprobación de ingreso.
```

Internal sources: `AR-01`, `AR-02`, `AR-03`. ([Argentina][2])

#### Trust/proof section

**Heading**

```text
Preparación documentada para una carga fuera de medida
```

**Body**

```text
La cotización identifica máquina, cabezal, componentes separados, modalidad de carga y punto final del servicio. No mezclamos costos argentinos no confirmados con el flete que sí podemos controlar.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿El cabezal está incluido automáticamente?**

```text
No. Debe declararse con tipo, modelo, ancho, ubicación y carro si corresponde. Se cotiza como parte del conjunto técnico.
```

**2. ¿Siempre se usa contenedor?**

```text
No. La modalidad depende de medidas, peso, desmontaje viable, puertos, naviera y disponibilidad. Puede requerir contenedor, flat rack, RoRo o carga de proyecto.
```

**3. ¿Meridian hace el desarme?**

```text
Podemos coordinar desmontaje y preparación en origen cuando se incluyen expresamente en la propuesta. El alcance debe indicar qué componentes se retiran y cómo se protegen.
```

**4. ¿La cotización incluye aduana argentina?**

```text
No por defecto. AFIDI/SENASA, despacho, tributos, terminal y transporte interior deben ser gestionados y confirmados localmente.
```

**JSON-LD**

```text
Service name: Flete internacional de cosechadoras desde EE. UU. a Argentina
Service type: Combine harvester dismantling, export preparation and international freight
Area served: Argentina (AR)
```

**Internal ad-message-match note**

```text
Match “flete cosechadora USA Argentina,” “importar cosechadora usada” and related combine-shipping intent. The page must lead with the equipment-specific freight solution, not general machinery sourcing.
```

---

### 7.3 Bolivia — Importación de maquinaria

**URL**

```text
/es/destinations/bolivia/importacion-maquinaria-usa
```

**SEO title**

```text
Importar maquinaria de EE. UU. a Bolivia | Meridian
```

**Meta description**

```text
Coordinación en EE. UU., preparación y flete hasta un puerto de tránsito confirmado para maquinaria destinada a Bolivia. Aduana y tramo local por separado.
```

**Eyebrow**

```text
Maquinaria desde EE. UU. · Bolivia
```

**H1**

```text
Importe maquinaria usada de EE. UU. a Bolivia con una ruta definida
```

**Hero body**

```text
Meridian coordina al vendedor, el retiro, la medición, la preparación de exportación y el flete hasta el puerto de tránsito confirmado para la operación. El importador y su despachante en Bolivia deben validar Aduana, registro aplicable, SENASAG cuando corresponda, tributos, tránsito y transporte interior antes de autorizar la compra o el embarque.
```

**Hero bullets**

* Coordinación de origen desde la ubicación real del equipo.
* Modalidad de carga definida por medidas y peso.
* Puerto de tránsito elegido según naviera, disponibilidad y destino final.
* Tramo internacional y costos bolivianos separados.

**Primary CTA**

```text
Cotizar mi maquinaria
```

**Secondary CTA**

```text
Ver ruta y datos técnicos
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar maquinaria usada desde EE. UU. a Bolivia. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino final: [ciudad/departamento]. Link: [URL]. Necesito cotizar origen, preparación y flete hasta puerto de tránsito. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Una operación coordinada por tramos
```

**Steps**

1. **Equipo y condición de compra**
   Comparta anuncio, vendedor, marca, modelo, año, ubicación, dimensiones, peso y estado de compra.

2. **Puerto de tránsito y formato de carga**
   Evaluamos el itinerario disponible, la modalidad técnica y el punto donde termina el alcance internacional.

3. **Ejecución en EE. UU.**
   Coordinamos retiro, preparación, carga y exportación según la propuesta aprobada.

4. **Tránsito e ingreso a Bolivia**
   El importador y sus operadores locales administran tránsito aduanero, nacionalización y entrega interior, salvo que exista una cotización adicional por esos servicios.

#### Scope included/excluded

**Included**

* Coordinación con el vendedor.
* Retiro y transporte de origen.
* Medición y planificación.
* Preparación, desmontaje o embalaje cotizados.
* Exportación desde EE. UU.
* Flete al puerto de tránsito especificado.
* Documentación del tramo contratado.

**Excluded unless explicitly quoted**

* Confirmación legal de admisibilidad en Bolivia.
* Registro del importador u OCE.
* PFI, permisos o inspecciones de SENASAG.
* Despacho, tributos y tasas bolivianas.
* Tránsito aduanero y garantías locales.
* Transporte desde el puerto hasta Bolivia.
* Permisos viales, descarga o entrega final.
* Fechas o almacenaje gratuitos garantizados.

#### Quote-readiness section

**Fields**

* Link, factura o datos del vendedor.
* Marca, modelo, año y serie.
* Dimensiones y peso.
* Implementos incluidos.
* Ubicación de origen.
* Condición de carga.
* Ciudad/departamento de destino.
* Puerto de tránsito sugerido por el operador local, si existe.
* Datos del despachante/importador.
* Fecha estimada de disponibilidad.

#### Compliance/local responsibility caveat

```text
Los requisitos bolivianos dependen de la clasificación, uso, condición y documentación del equipo. El importador y su despachante deben confirmar el registro aplicable ante Aduana Nacional y determinar si corresponde una autorización o inspección de SENASAG. La página no aplica beneficios fiscales históricos ni presume un puerto de tránsito obligatorio.
```

Internal sources: `BO-01`, `BO-02`. ([Aduana Bolivia][3])

#### Trust/proof section

**Heading**

```text
El puerto de tránsito no sustituye un plan completo
```

**Body**

```text
La propuesta debe indicar dónde recoge Meridian, cómo se prepara el equipo, qué puerto de tránsito se utiliza, dónde termina el flete contratado y quién controla el ingreso y la entrega en Bolivia.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿El envío siempre pasa por Arica?**

```text
No. Arica puede ser una opción, pero el puerto debe confirmarse según naviera, equipo, disponibilidad, operador local y destino final. No se hardcodea una ruta universal.
```

**2. ¿El flete incluye el transporte hasta mi ciudad en Bolivia?**

```text
Solo cuando aparece expresamente en la propuesta. El alcance base llega al puerto de tránsito acordado; el tramo terrestre y aduanero se cotizan por separado.
```

**3. ¿Meridian tramita SENASAG?**

```text
El importador boliviano debe confirmar si el equipo requiere autorización o control de SENASAG. Meridian puede proporcionar la información y documentación del equipo necesarias para esa coordinación.
```

**4. ¿Pueden garantizar impuestos o una exención?**

```text
No. La clasificación, valor, régimen vigente y tributos deben ser calculados por el importador y sus profesionales locales.
```

**JSON-LD**

```text
Service name: Coordinación para importar maquinaria usada desde EE. UU. a Bolivia
Service type: U.S. export preparation and freight to a confirmed transit port
Area served: Bolivia (BO)
```

**Internal ad-message-match note**

```text
Match machinery-import intent without implying that Meridian performs Bolivian customs or includes overland delivery. “Hasta puerto de tránsito confirmado” must appear in the first viewport.
```

---

### 7.4 Bolivia — Flete de equipo pesado

**URL**

```text
/es/destinations/bolivia/flete-equipo-pesado-usa
```

**SEO title**

```text
Flete de equipo pesado de EE. UU. a Bolivia | Meridian
```

**Meta description**

```text
Cotice retiro, medición, preparación y flete de excavadoras, cargadores y maquinaria pesada desde EE. UU. a Bolivia vía puerto de tránsito.
```

**Eyebrow**

```text
Equipo pesado desde EE. UU. · Bolivia
```

**H1**

```text
Flete de equipo pesado desde EE. UU. a Bolivia
```

**Hero body**

```text
Excavadoras, cargadores, bulldozers y otros equipos pesados requieren medidas, peso operativo, implementos y condición de carga antes de elegir la modalidad. Meridian coordina el tramo de origen y el flete hasta el puerto de tránsito confirmado. El despacho, permisos, tránsito y transporte interior en Bolivia permanecen bajo el operador local salvo cotización expresa.
```

**Hero bullets**

* Evaluación por peso, dimensiones y accesorios.
* Retiro especializado y preparación en origen.
* Flat rack, RoRo, breakbulk o proyecto según viabilidad.
* Puerto de tránsito y tramo boliviano documentados por separado.

**Primary CTA**

```text
Cotizar mi equipo pesado
```

**Secondary CTA**

```text
Ver datos técnicos
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar equipo pesado desde EE. UU. a Bolivia. Tipo/marca/modelo: [datos]. Peso operativo: [peso]. Dimensiones: [datos]. Ubicación: [ciudad/estado]. Destino final: [ciudad/departamento]. Link: [URL]. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Plan técnico antes de reservar
```

**Steps**

1. **Ficha técnica y condición de carga**
   Recibimos peso, dimensiones, implementos, ubicación y si el equipo funciona y se desplaza por sus propios medios.

2. **Ingeniería logística**
   Evaluamos desmontaje, izaje, transporte de origen y modalidad marítima.

3. **Preparación y exportación**
   Coordinamos retiro, terminal, protección, carga y documentos del tramo de EE. UU.

4. **Puerto de tránsito y operador boliviano**
   Entregamos el expediente para que el importador gestione tránsito, nacionalización, permisos viales y entrega.

#### Scope included/excluded

**Included**

* Coordinación del transportista de origen.
* Revisión de dimensiones y peso.
* Desmontaje de implementos cuando se cotice.
* Preparación y protección.
* Transporte a puerto.
* Exportación y flete internacional especificado.

**Excluded unless explicitly quoted**

* Inspección mecánica o garantía.
* Aduana y tributos bolivianos.
* Garantía de tránsito.
* Transporte terrestre desde el puerto de tránsito.
* Permisos de sobredimensión y escoltas locales.
* Descarga, montaje y puesta en servicio.
* Limpieza o certificación regulatoria no incluida en la propuesta.

#### Quote-readiness section

**Fields**

* Tipo de equipo.
* Marca, modelo, año y serie.
* Peso operativo.
* Dimensiones de transporte.
* Implementos y cucharones.
* Tipo de rodaje.
* Estado de funcionamiento.
* Punto de carga.
* Fotos laterales, frontales, traseras y de implementos.
* Destino final y acceso al sitio.
* Fecha de disponibilidad.

#### Compliance/local responsibility caveat

```text
Aduana Nacional, el despachante y los operadores bolivianos deben confirmar clasificación, valor, tránsito, permisos y transporte interior. Los equipos con tierra, residuos vegetales o uso agrícola pueden requerir validaciones adicionales de SENASAG. La preparación en origen no constituye aprobación de ingreso.
```

Internal sources: `BO-01`, `BO-02`. ([Aduana Bolivia][3])

#### Trust/proof section

**Heading**

```text
Equipo pesado cotizado como proyecto, no como paquetería
```

**Body**

```text
El alcance identifica medidas, peso, modalidad, retiro, terminal y punto final del servicio. Las variables locales se mantienen separadas hasta que un operador boliviano las confirme.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿Qué equipos pueden cotizar?**

```text
Excavadoras, cargadores, bulldozers, motoniveladoras, manipuladores, compactadores y otros equipos, sujetos a dimensiones, peso, condición y disponibilidad de ruta.
```

**2. ¿El equipo debe funcionar?**

```text
No necesariamente, pero la condición cambia el plan de carga, izaje, transporte y costo. Debe informarse antes de cotizar.
```

**3. ¿Incluye permisos terrestres en Bolivia?**

```text
No por defecto. Permisos, escoltas, restricciones viales y entrega interior deben ser confirmados y cotizados localmente.
```

**4. ¿Existe una tarifa por tonelada?**

```text
No para una cotización ejecutable. La modalidad depende de dimensiones, peso, implementos, origen, puerto, naviera y condición de carga.
```

**JSON-LD**

```text
Service name: Flete internacional de equipo pesado desde EE. UU. a Bolivia
Service type: Heavy equipment export and international project freight
Area served: Bolivia (BO)
```

**Internal ad-message-match note**

```text
Match “flete equipo pesado USA Bolivia,” excavator/loader shipping and heavy-machinery transport. Page must not drift into agricultural-machine buying language.
```

---

### 7.5 Paraguay — Importación de maquinaria

**URL**

```text
/es/destinations/paraguay/importacion-maquinaria-usa
```

**SEO title**

```text
Importar maquinaria de EE. UU. a Paraguay | Meridian
```

**Meta description**

```text
Coordinación de compra, retiro, preparación y flete de maquinaria usada desde EE. UU. a Paraguay, con elegibilidad local validada antes del embarque.
```

**Eyebrow**

```text
Maquinaria desde EE. UU. · Paraguay
```

**H1**

```text
Importe maquinaria usada de EE. UU. a Paraguay con elegibilidad validada
```

**Hero body**

```text
Antes de cerrar la compra, su importador y despachante deben confirmar que el equipo cumple el régimen paraguayo vigente. Con esa validación, Meridian coordina al vendedor, el retiro, la preparación de exportación y el flete hasta el puerto o terminal acordado para continuar el tramo hacia Paraguay.
```

**Hero bullets**

* Validación local antes de comprometer la compra.
* Ficha técnica útil para MIC, SENAVE y despachante.
* Retiro, preparación y exportación desde EE. UU.
* Ruta fluvial, marítima o terrestre definida por la operación real.

**Primary CTA**

```text
Cotizar mi maquinaria
```

**Secondary CTA**

```text
Ver validaciones previas
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar maquinaria usada desde EE. UU. a Paraguay. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad/departamento]. Link: [URL]. Mi importador confirmará elegibilidad, MIC, SENAVE y DNIT. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Primero elegibilidad; después logística
```

**Steps**

1. **Ficha para validación local**
   Comparta año, serie, categoría, condición, vendedor, fotos y documento comercial.

2. **Confirmación por el importador**
   Su despachante valida la normativa vigente, registros, licencias, requisitos fitosanitarios y tratamiento aduanero.

3. **Ejecución de origen**
   Una vez liberada la compra para avanzar, Meridian coordina retiro, preparación, carga y exportación.

4. **Ruta acordada hacia Paraguay**
   El flete termina en el punto expresamente indicado; el operador local gestiona transbordo, aduana y entrega interior.

#### Scope included/excluded

**Included**

* Coordinación con vendedor.
* Asistencia de compra bajo alcance separado.
* Retiro y transporte en EE. UU.
* Medición y preparación.
* Desmontaje y embalaje cotizados.
* Documentación de exportación.
* Flete hasta el punto contractual.

**Excluded unless explicitly quoted**

* Dictamen legal de elegibilidad.
* Registro/licencia ante MIC.
* AFIDI, inspección o medidas SENAVE.
* DNIT y despacho aduanero.
* Tributos y tasas.
* Tránsito, transbordo, almacenaje y entrega interior.
* Garantía de liberación o fecha.
* Garantía de condición del equipo.

#### Quote-readiness section

**Fields**

* Marca, modelo, año y serie.
* Tipo de maquinaria y uso previsto.
* Link o factura.
* Ubicación y vendedor.
* Dimensiones, peso e implementos.
* Fotografías del equipo y zonas con posible tierra/residuos.
* Estado de compra.
* Destino paraguayo.
* Datos del importador/despachante.
* Confirmación local de elegibilidad cuando ya exista.

#### Compliance/local responsibility caveat

```text
Paraguay mantiene un régimen específico para la introducción de maquinaria, equipos e implementos agrícolas usados. La elegibilidad, antigüedad, registros, licencias y medidas fitosanitarias deben validarse contra la Ley 7565/2025 y el proceso vigente de MIC, SENAVE y DNIT antes de comprar o embarcar. Meridian no sustituye esa validación local.
```

Internal sources: `PY-01`, `PY-02`, `PY-03`, `PY-04`. ([dnit.gov.py][4])

#### Trust/proof section

**Heading**

```text
Una cotización que empieza con la pregunta correcta
```

**Body**

```text
No avanzamos como si toda máquina usada pudiera ingresar. La ficha técnica se prepara para que el importador confirme primero la elegibilidad y luego se ejecute la logística.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿Puedo importar maquinaria de cualquier año?**

```text
No debe asumirse. Su importador y despachante deben validar el año, categoría y elegibilidad bajo la normativa vigente antes de comprometer la compra.
```

**2. ¿Meridian obtiene la licencia paraguaya?**

```text
El registro, licencia y despacho corresponden al importador y sus profesionales en Paraguay. Meridian aporta la documentación y datos del equipo del tramo contratado.
```

**3. ¿Por qué no muestran un puerto único?**

```text
La ruta depende de naviera, terminal, transbordo, dimensiones, operador fluvial o terrestre y destino final. El punto contractual se define en la propuesta.
```

**4. ¿La limpieza está incluida?**

```text
Solo cuando se inspecciona el equipo y se incorpora expresamente al alcance. La evidencia y tratamiento exigidos deben ser confirmados por SENAVE y el importador.
```

**JSON-LD**

```text
Service name: Coordinación para importar maquinaria usada desde EE. UU. a Paraguay
Service type: Used machinery export preparation and freight coordination
Area served: Paraguay (PY)
```

**Internal ad-message-match note**

```text
Match machinery-import demand while adding a pre-purchase eligibility gate. This page must not reuse any “importación asegurada” or universal-age claim.
```

---

### 7.6 Paraguay — Flete de cosechadoras

**URL**

```text
/es/destinations/paraguay/flete-cosechadoras-usa
```

**SEO title**

```text
Flete de cosechadoras de EE. UU. a Paraguay | Meridian
```

**Meta description**

```text
Retiro, preparación y flete de cosechadoras usadas desde EE. UU. a Paraguay, sujeto a elegibilidad local, medidas y requisitos fitosanitarios.
```

**Eyebrow**

```text
Cosechadoras desde EE. UU. · Paraguay
```

**H1**

```text
Flete de cosechadoras desde EE. UU. a Paraguay
```

**Hero body**

```text
La cosechadora, el cabezal, el año, la limpieza, las dimensiones y la ruta deben revisarse antes de reservar. Meridian coordina retiro, desmontaje, preparación, exportación y flete hasta el punto acordado. El importador paraguayo valida elegibilidad, MIC, SENAVE, DNIT y entrega interior.
```

**Hero bullets**

* Cosechadora y cabezal documentados por separado.
* Revisión de año, serie, medidas y condición antes de compra.
* Desmontaje y modalidad de carga definidos por equipo.
* Alcance internacional separado del proceso paraguayo.

**Primary CTA**

```text
Cotizar mi cosechadora
```

**Secondary CTA**

```text
Ver ficha necesaria
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar una cosechadora desde EE. UU. a Paraguay. Marca/modelo/año: [datos]. Cabezal: [tipo/ancho]. Ubicación: [ciudad/estado]. Destino: [ciudad/departamento]. Link: [URL]. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Cosechadora, cabezal, elegibilidad y ruta
```

**Steps**

1. **Documentación técnica**
   Modelo, año, serie, horas, cabezal, carro, neumáticos/orugas, fotos y vendedor.

2. **Validación paraguaya**
   El importador confirma elegibilidad y requisitos antes de autorizar la compra.

3. **Preparación de origen**
   Meridian coordina retiro, desmontaje, limpieza contratada, protección y exportación.

4. **Flete y continuidad local**
   El servicio internacional termina en el punto escrito; el importador gestiona SENAVE, DNIT y entrega.

#### Scope included/excluded

**Included**

* Retiro de cosechadora y componentes declarados.
* Medición y plan de carga.
* Desmontaje y preparación incluidos en propuesta.
* Terminal y documentación de exportación.
* Flete internacional definido.

**Excluded unless explicitly quoted**

* Confirmación de elegibilidad o antigüedad.
* Garantía mecánica.
* MIC, SENAVE y DNIT.
* Tributos y tasas.
* Destino-terminal, transbordos y entrega interior.
* Limpieza correctiva en destino.
* Costos por rechazo o demora.

#### Quote-readiness section

**Fields**

* Marca/modelo/año/serie.
* Horas.
* Modelo y ancho del cabezal.
* Carro de cabezal.
* Dimensiones y peso.
* Neumáticos/orugas.
* Fotos de residuos, plataforma, sinfín y zonas inferiores.
* Estado operativo.
* Link y ubicación.
* Destino e importador local.

#### Compliance/local responsibility caveat

```text
La condición de maquinaria agrícola usada está sujeta al régimen vigente de Paraguay. El importador debe validar la elegibilidad del año y equipo, y coordinar licencias, medidas fitosanitarias, inspección y aduana con MIC, SENAVE y DNIT. Ninguna preparación en EE. UU. constituye autorización paraguaya.
```

Internal sources: `PY-01`, `PY-02`, `PY-03`, `PY-04`. ([dnit.gov.py][4])

#### Trust/proof section

**Heading**

```text
Desmontaje y flete definidos sobre la máquina real
```

**Body**

```text
La propuesta identifica la cosechadora, el cabezal, la modalidad y el punto de entrega. La elegibilidad local permanece como una condición previa, no como una promesa publicitaria.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿Cotizan sin el año o número de serie?**

```text
Podemos orientar la recopilación de datos, pero no emitir una propuesta ejecutable ni avanzar sin la información que permita validar elegibilidad y logística.
```

**2. ¿El cabezal puede viajar con la cosechadora?**

```text
Depende de medidas, configuración, modalidad y disponibilidad. Debe incluirse desde el inicio para diseñar la carga completa.
```

**3. ¿Quién confirma SENAVE?**

```text
El importador y su profesional local. Meridian aporta datos, fotos y documentos del equipo dentro del alcance contratado.
```

**4. ¿El precio incluye entrega en el establecimiento?**

```text
Solo cuando la propuesta lo indica expresamente. La tarifa base no debe mezclar el flete internacional con tránsito, aduana y entrega interior no confirmados.
```

**JSON-LD**

```text
Service name: Flete internacional de cosechadoras desde EE. UU. a Paraguay
Service type: Combine harvester preparation and international freight
Area served: Paraguay (PY)
```

**Internal ad-message-match note**

```text
Page must satisfy combine-specific search intent and immediately show that year/elegibility is a gate. Avoid turning it into a generic machinery-import page.
```

---

### 7.7 Chile — Importación de maquinaria

**URL**

```text
/es/destinations/chile/importacion-maquinaria-usa
```

**SEO title**

```text
Importar maquinaria de EE. UU. a Chile | Meridian
```

**Meta description**

```text
Retiro, limpieza coordinada, preparación y flete de maquinaria usada desde EE. UU. a Chile con requisitos SAG considerados desde el origen.
```

**Eyebrow**

```text
Maquinaria desde EE. UU. · Chile
```

**H1**

```text
Importe maquinaria usada de EE. UU. a Chile preparada para control SAG
```

**Hero body**

```text
En Chile, la limpieza de maquinaria usada debe planificarse antes del embarque. Meridian coordina al vendedor, retiro, inspección visual, limpieza o preparación incluida, documentación de exportación y flete al puerto chileno confirmado. El importador y su agente de aduanas gestionan SAG, nacionalización, tributos, terminal y entrega interior.
```

**Hero bullets**

* Plan de limpieza y preparación desde el origen.
* Fotos y datos del equipo antes de reservar.
* Modalidad de carga según dimensiones, peso y puerto.
* Aduana, SAG y costos chilenos separados.

**Primary CTA**

```text
Cotizar mi maquinaria
```

**Secondary CTA**

```text
Ver requisitos de preparación
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar maquinaria usada desde EE. UU. a Chile. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad/región]. Link: [URL]. Necesito revisar preparación y limpieza para control SAG. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Preparación de origen con el control SAG en mente
```

**Steps**

1. **Ficha, fotos y uso del equipo**
   Recibimos tipo, modelo, año, serie, ubicación, uso, residuos visibles y condición de carga.

2. **Plan de limpieza y transporte**
   Definimos acceso a zonas críticas, desmontaje necesario, método de limpieza y modalidad de exportación.

3. **Ejecución documentada**
   Coordinamos retiro, limpieza/preparación cotizada, carga y documentación de salida.

4. **Ingreso bajo control chileno**
   El importador y su agente gestionan inspección SAG, Aduanas, terminal y transporte interior.

#### Scope included/excluded

**Included**

* Coordinación del vendedor.
* Retiro y traslado de origen.
* Revisión visual y plan de preparación.
* Limpieza cuando figure expresamente en propuesta.
* Desmontaje, embalaje y carga cotizados.
* Exportación y flete a puerto chileno confirmado.

**Excluded unless explicitly quoted**

* Certificación de aprobación SAG.
* Inspección en Chile.
* Aduana y tributos.
* Limpieza correctiva o tratamiento en destino.
* Demoras, reexportación o rechazo.
* Terminal y entrega interior.
* Garantía de admisibilidad.

#### Quote-readiness section

**Fields**

* Tipo, marca, modelo, año y serie.
* Uso agrícola, forestal, construcción u otro.
* Link y vendedor.
* Ubicación.
* Dimensiones y peso.
* Fotos del tren de rodaje, ruedas, bajos, compartimientos y accesorios.
* Evidencia de tierra o residuos.
* Estado operativo.
* Destino en Chile.
* Agente de aduanas, si está designado.

#### Compliance/local responsibility caveat

```text
La Resolución SAG 3103/2016 exige que la maquinaria usada comprendida llegue limpia y libre de suelo, restos vegetales y plagas reguladas. SAG puede inspeccionarla al ingreso, y los costos de medidas correctivas, rechazo o reexportación corresponden al importador. El agente local debe confirmar además la clasificación y el proceso aduanero.
```

Internal sources: `CL-01`, `CL-02`, `CL-03`. ([normativa.sag.gob.cl][5])

#### Trust/proof section

**Heading**

```text
La limpieza no se deja para después de la reserva
```

**Body**

```text
La preparación se incorpora al plan técnico y a la propuesta. Meridian documenta lo que se realizó en origen, mientras la autoridad chilena conserva la decisión de inspección y aceptación.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿La máquina debe estar limpia antes de salir de EE. UU.?**

```text
Sí, la planificación debe realizarse en origen. SAG exige ausencia de suelo, residuos vegetales y plagas en la maquinaria comprendida por la norma.
```

**2. ¿Meridian garantiza la aprobación SAG?**

```text
No. Podemos coordinar preparación y evidencia en origen, pero la inspección y decisión de ingreso corresponden a SAG.
```

**3. ¿El envío siempre llega a San Antonio?**

```text
No. San Antonio puede ser una opción, pero el puerto se confirma según naviera, modalidad, dimensiones, terminal y destino interior.
```

**4. ¿Incluye agente de aduanas en Chile?**

```text
No por defecto. El importador designa su agente y confirma Aduanas, SAG, tributos, terminal y entrega local.
```

**JSON-LD**

```text
Service name: Coordinación para importar maquinaria usada desde EE. UU. a Chile
Service type: Used machinery cleaning coordination, export preparation and freight
Area served: Chile (CL)
```

**Internal ad-message-match note**

```text
Support machinery-import intent with a differentiated Chile promise: planning for SAG cleanliness requirements from origin. Do not claim “SAG certified” or guaranteed entry.
```

---

### 7.8 Chile — Flete de equipo pesado

**URL**

```text
/es/destinations/chile/flete-equipo-pesado-usa
```

**SEO title**

```text
Flete de equipo pesado de EE. UU. a Chile | Meridian
```

**Meta description**

```text
Cotice retiro, limpieza, preparación y flete de excavadoras, cargadores y equipo pesado usado desde EE. UU. a Chile.
```

**Eyebrow**

```text
Equipo pesado desde EE. UU. · Chile
```

**H1**

```text
Flete de equipo pesado desde EE. UU. a Chile
```

**Hero body**

```text
La maquinaria de movimiento de tierra combina dos exigencias: ingeniería de transporte y limpieza para control de ingreso. Meridian coordina medidas, peso, retiro, preparación y flete desde EE. UU. al puerto chileno confirmado. SAG, Aduanas, terminal, permisos viales y entrega interior quedan con los operadores locales.
```

**Hero bullets**

* Excavadoras, cargadores, bulldozers y maquinaria de proyecto.
* Revisión de tren de rodaje, implementos, peso y dimensiones.
* Limpieza y desmontaje definidos antes de reservar.
* Flat rack, RoRo, breakbulk o proyecto según viabilidad.

**Primary CTA**

```text
Cotizar mi equipo pesado
```

**Secondary CTA**

```text
Ver ficha técnica y limpieza
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar equipo pesado desde EE. UU. a Chile. Tipo/marca/modelo: [datos]. Peso/dimensiones: [datos]. Ubicación: [ciudad/estado]. Destino: [ciudad/región]. Link: [URL]. Necesito revisar carga y limpieza para SAG. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Ingeniería de transporte y limpieza en un mismo plan
```

**Steps**

1. **Equipo, implementos y condición**
   Reunimos peso, dimensiones, accesorios, rodaje, estado de funcionamiento, origen y fotos.

2. **Modalidad y acceso a zonas críticas**
   Evaluamos desmontaje, izaje, flat rack/RoRo/proyecto y limpieza de bajos, orugas, cucharones y compartimientos.

3. **Retiro, preparación y exportación**
   Coordinamos las tareas aprobadas y registramos el alcance ejecutado.

4. **Inspección y entrega en Chile**
   El importador gestiona SAG, Aduanas, terminal, permisos viales y transporte interior.

#### Scope included/excluded

**Included**

* Transporte especializado de origen.
* Medición y planificación.
* Limpieza contratada.
* Desmontaje de implementos cotizado.
* Protección, carga y exportación.
* Flete internacional escrito.

**Excluded unless explicitly quoted**

* Garantía mecánica.
* Aprobación SAG.
* Agente de aduanas.
* Tributos y terminal.
* Limpieza correctiva en Chile.
* Permisos, escoltas, descarga y transporte interior.
* Costos de rechazo o reexportación.

#### Quote-readiness section

**Fields**

* Tipo, marca, modelo, año y serie.
* Peso operativo.
* Dimensiones con y sin implementos.
* Cucharones, martillos, hojas u otros accesorios.
* Tipo y estado del rodaje.
* Fotos de bajos y zonas con tierra.
* Estado operativo.
* Ubicación y acceso para retiro.
* Destino chileno.
* Fecha de disponibilidad.

#### Compliance/local responsibility caveat

```text
La normativa SAG incluye maquinaria usada agrícola, forestal y de movimiento de tierra dentro de los equipos que deben llegar limpios y libres de suelo y residuos. La preparación debe documentarse, pero la inspección y aceptación final corresponden a SAG. Aduanas, terminal y permisos de transporte son responsabilidades locales.
```

Internal sources: `CL-01`, `CL-02`, `CL-03`. ([normativa.sag.gob.cl][5])

#### Trust/proof section

**Heading**

```text
Proyecto técnico con evidencia, no una promesa de ingreso
```

**Body**

```text
La propuesta identifica cómo se retira, limpia, desmonta y carga el equipo. La autoridad chilena conserva el control de inspección y el importador conserva las responsabilidades locales.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿La resolución SAG aplica a excavadoras y cargadores?**

```text
La norma incluye maquinaria usada de movimiento de tierra dentro de su alcance. El importador debe confirmar el caso específico con su agente y SAG.
```

**2. ¿Pueden limpiar el tren de rodaje?**

```text
Podemos coordinar una limpieza incluida en la propuesta, sujeto a ubicación, acceso, condición y método requerido. Debe definirse antes del retiro.
```

**3. ¿Qué modalidad es mejor?**

```text
Se determina por dimensiones, peso, desmontaje, condición, puerto, itinerario y disponibilidad. No existe una modalidad universal.
```

**4. ¿El costo incluye transporte desde el puerto chileno?**

```text
Solo cuando se cotiza expresamente. Aduana, terminal, permisos viales y entrega interior no forman parte del alcance base.
```

**JSON-LD**

```text
Service name: Flete internacional de equipo pesado desde EE. UU. a Chile
Service type: Heavy equipment preparation, cleaning coordination and project freight
Area served: Chile (CL)
```

**Internal ad-message-match note**

```text
Match heavy-equipment freight and excavation/construction machinery. The page must include SAG-cleanliness relevance without turning the hero into a legal article.
```

---

### 7.9 Uruguay — Importación de maquinaria

**URL**

```text
/es/destinations/uruguay/importacion-maquinaria-usa
```

**SEO title**

```text
Importar maquinaria de EE. UU. a Uruguay | Meridian
```

**Meta description**

```text
Retiro, limpieza coordinada, preparación y flete de maquinaria usada desde EE. UU. a Uruguay con requisitos DGSA considerados desde origen.
```

**Eyebrow**

```text
Maquinaria desde EE. UU. · Uruguay
```

**H1**

```text
Importe maquinaria usada de EE. UU. a Uruguay con preparación para DGSA
```

**Hero body**

```text
La maquinaria agrícola, forestal o de jardinería usada puede requerir limpieza, tratamiento, certificado fitosanitario e inspección al ingreso. Meridian coordina al vendedor, retiro, preparación contratada, documentación de exportación y flete al puerto o terminal uruguaya confirmada. El importador y su despachante gestionan DGSA, Aduanas, tributos y entrega interior.
```

**Hero bullets**

* Preparación de origen vinculada al requisito DGSA.
* Equipo, residuos, implementos y acceso revisados antes de reservar.
* Modalidad de carga definida por dimensiones y peso.
* Flete internacional separado de nacionalización y costos locales.

**Primary CTA**

```text
Cotizar mi maquinaria
```

**Secondary CTA**

```text
Ver preparación y documentos
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar maquinaria usada desde EE. UU. a Uruguay. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad/departamento]. Link: [URL]. Necesito revisar limpieza, preparación y documentación para DGSA. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Preparación, certificado y flete coordinados desde origen
```

**Steps**

1. **Ficha y revisión visual**
   Comparta tipo de máquina, uso, fotos, residuos visibles, implementos, ubicación y vendedor.

2. **Plan de limpieza y documentación**
   El importador confirma el requisito DGSA; Meridian diseña las tareas de origen incluidas en la propuesta.

3. **Retiro, preparación y carga**
   Coordinamos limpieza/tratamiento contratado, transporte, embalaje y exportación.

4. **Ingreso e inspección en Uruguay**
   El importador y su despachante gestionan DGSA, Aduanas, terminal y entrega.

#### Scope included/excluded

**Included**

* Coordinación con vendedor.
* Retiro y transporte de origen.
* Plan de preparación.
* Limpieza/tratamiento cuando se cotice.
* Desmontaje, protección y carga.
* Documentación de exportación.
* Flete internacional escrito.

**Excluded unless explicitly quoted**

* Emisión o aprobación garantizada de certificado fitosanitario.
* Decisión de DGSA.
* Despacho de Aduanas.
* Aranceles, IVA, tasas y terminal.
* Limpieza correctiva, rechazo o reexportación.
* Entrega interior.
* Costo final nacionalizado.

#### Quote-readiness section

**Fields**

* Tipo, marca, modelo, año y serie.
* Uso agrícola, forestal o jardinería.
* Link/factura.
* Origen.
* Dimensiones/peso.
* Implementos.
* Fotos de bajos, ruedas/orugas y compartimientos.
* Estado de limpieza.
* Destino uruguayo.
* Despachante/importador designado.
* Fecha de disponibilidad.

#### Compliance/local responsibility caveat

```text
La Resolución DGSA 98/016 establece requisitos para maquinaria usada agrícola, forestal y de jardinería, incluyendo limpieza, ausencia de suelo y restos vegetales, tratamiento/certificación de origen e inspección. La clasificación aduanera, tributos y procedimiento final deben confirmarse con el importador y su despachante.
```

Internal sources: `UY-01`, `UY-02`. ([Gubuy][6])

#### Trust/proof section

**Heading**

```text
Preparación definida antes de que el equipo llegue al puerto
```

**Body**

```text
La propuesta separa la tarea física realizada en origen de la certificación, inspección y nacionalización controladas en Uruguay.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿Se necesita certificado fitosanitario?**

```text
La maquinaria comprendida por la resolución puede requerir certificado y declaración adicional. El importador debe confirmar el formato y procedimiento aplicable con DGSA.
```

**2. ¿Meridian garantiza la aprobación de DGSA?**

```text
No. Podemos coordinar preparación y documentación de origen, pero DGSA conserva la decisión de inspección y aceptación.
```

**3. ¿Siempre se envía a Montevideo?**

```text
Montevideo puede ser el punto operativo, pero el puerto o terminal se confirma según naviera, modalidad y plan local. No se promete una ruta universal.
```

**4. ¿Pueden calcular los impuestos finales?**

```text
No como cifra universal. La clasificación, valor, origen, régimen y costos locales deben ser calculados por el despachante uruguayo.
```

**JSON-LD**

```text
Service name: Coordinación para importar maquinaria usada desde EE. UU. a Uruguay
Service type: Used machinery preparation, export documentation and international freight
Area served: Uruguay (UY)
```

**Internal ad-message-match note**

```text
Match machinery-import demand and differentiate through DGSA-oriented origin preparation. Do not publish tax percentages or guaranteed certification.
```

---

### 7.10 Uruguay — Flete de cosechadoras

**URL**

```text
/es/destinations/uruguay/flete-cosechadoras-usa
```

**SEO title**

```text
Flete de cosechadoras de EE. UU. a Uruguay | Meridian
```

**Meta description**

```text
Retiro, limpieza, desmontaje y flete de cosechadoras usadas desde EE. UU. a Uruguay con preparación de origen para requisitos DGSA.
```

**Eyebrow**

```text
Cosechadoras desde EE. UU. · Uruguay
```

**H1**

```text
Flete de cosechadoras desde EE. UU. a Uruguay
```

**Hero body**

```text
Una cosechadora exige controlar dos planes antes del embarque: desmontaje/carga y limpieza para ingreso. Meridian coordina la máquina, el cabezal, la preparación contratada, exportación y flete al puerto o terminal uruguaya confirmada. DGSA, Aduanas, tributos y entrega interior permanecen con el importador y su despachante.
```

**Hero bullets**

* Máquina, cabezal, carro e implementos declarados desde el inicio.
* Limpieza de bajos, sinfines, plataformas y zonas con residuos.
* Desmontaje y modalidad de carga por modelo real.
* Documentación de origen separada del proceso uruguayo.

**Primary CTA**

```text
Cotizar mi cosechadora
```

**Secondary CTA**

```text
Ver ficha y preparación
```

**WhatsApp prefill**

```text
#FRT_ES Hola, quiero cotizar una cosechadora desde EE. UU. a Uruguay. Marca/modelo/año: [datos]. Cabezal: [tipo/ancho]. Ubicación: [ciudad/estado]. Destino: [ciudad/departamento]. Link: [URL]. Necesito cotizar desmontaje, limpieza y flete. Ref: {{whatsapp_ref}}
```

#### Route/process section

**H2**

```text
Cosechadora y cabezal preparados como una sola operación
```

**Steps**

1. **Ficha completa**
   Modelo, año, serie, horas, cabezal, carro, neumáticos/orugas, fotos, ubicación y estado operativo.

2. **Plan de desmontaje y limpieza**
   Identificamos componentes, puntos con residuos, acceso para limpieza y modalidad de carga.

3. **Ejecución en origen**
   Coordinamos retiro, tareas contratadas, protección, carga y documentos.

4. **Inspección y nacionalización**
   El importador gestiona DGSA, Aduanas, terminal y entrega en Uruguay.

#### Scope included/excluded

**Included**

* Retiro de máquina, cabezal y accesorios declarados.
* Medición.
* Desmontaje incluido en propuesta.
* Limpieza/tratamiento cotizados.
* Protección y carga.
* Exportación y flete internacional.

**Excluded unless explicitly quoted**

* Garantía mecánica o de condición.
* Certificado/aprobación garantizados.
* DGSA y Aduanas.
* Tributos y terminal.
* Limpieza correctiva en destino.
* Reexportación o rechazo.
* Transporte interior y montaje.

#### Quote-readiness section

**Fields**

* Marca/modelo/año/serie.
* Horas.
* Tipo/ancho del cabezal.
* Carro y accesorios.
* Medidas/peso.
* Neumáticos/orugas.
* Fotos de plataforma, sinfín, bajos, ruedas y compartimientos.
* Estado operativo.
* Link y ubicación.
* Destino/despachante en Uruguay.

#### Compliance/local responsibility caveat

```text
Las cosechadoras usadas pueden quedar comprendidas por los requisitos DGSA de limpieza, tratamiento/certificación e inspección. La ausencia visible de residuos no garantiza aceptación; el importador debe confirmar el procedimiento y documentación antes de autorizar el embarque.
```

Internal sources: `UY-01`, `UY-02`. ([Gubuy][6])

#### Trust/proof section

**Heading**

```text
Desmontaje, limpieza y flete dentro de un alcance escrito
```

**Body**

```text
La propuesta identifica cada componente, tarea y punto de entrega. La inspección DGSA y la nacionalización permanecen fuera de cualquier promesa comercial.
```

Use proof set: `freight-credentials-v1`.

#### FAQs

**1. ¿La limpieza de la cosechadora está incluida?**

```text
Solo cuando figura expresamente en la propuesta. Primero deben revisarse fotos, acceso, residuos y alcance de tratamiento requerido.
```

**2. ¿El cabezal requiere una cotización separada?**

```text
Debe documentarse por separado, aunque forme parte de la misma operación. Su ancho, carro y modalidad afectan el plan completo.
```

**3. ¿Pueden emitir el certificado fitosanitario?**

```text
Meridian puede coordinar proveedores y documentación de origen cuando forme parte del alcance. El importador debe confirmar el requisito y formato aceptable con DGSA.
```

**4. ¿El flete incluye entrega en el campo?**

```text
No por defecto. Aduana, terminal, permisos, entrega interior y montaje se incluyen únicamente mediante una propuesta específica.
```

**JSON-LD**

```text
Service name: Flete internacional de cosechadoras desde EE. UU. a Uruguay
Service type: Combine harvester dismantling, cleaning coordination and international freight
Area served: Uruguay (UY)
```

**Internal ad-message-match note**

```text
Match combine-specific freight intent. First viewport must mention both loading preparation and DGSA-related cleaning without promising certification or acceptance.
```

---

## 8. Google Ads Message-Match Matrix

Website code should store semantic intent keys, not depend on mutable Google Ads IDs or names. QA must import the current workbook’s exact campaign/ad-group mapping and confirm every mapped object lands on the expected route.

| Route        | Campaign intent                        | Ad-group intent                                | Keyword cluster                                                                   | RSA claim supported                                               | Page section satisfying claim          | Required adjustment                                        |
| ------------ | -------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| AR machinery | Machinery import from USA to Argentina | Import coordination; optional sourcing support | importar maquinaria usada; importar maquinaria agrícola; maquinaria desde EE. UU. | Importá maquinaria desde EE. UU.; coordinación completa en origen | Hero; process; included scope          | Clarify that local customs and AFIDI/SENASA are separate   |
| AR combines  | Combine shipping from USA              | Combine freight and preparation                | flete cosechadora USA; importar cosechadora usada                                 | Flete de cosechadoras; desmontaje y embalaje                      | Hero; technical process; quote fields  | Do not use “precio final Argentina” or guaranteed port     |
| BO machinery | Machinery import from USA to Bolivia   | Machinery export and transit-port coordination | importar maquinaria Bolivia; maquinaria usada USA                                 | Retiro, preparación y flete                                       | Hero; route-by-stages section          | State “hasta puerto de tránsito confirmado”                |
| BO heavy     | Heavy-equipment shipping from USA      | Excavator/loader/heavy equipment               | flete equipo pesado; enviar excavadora; maquinaria pesada USA                     | Equipo pesado desde EE. UU.; project freight                      | Hero; engineering process              | Keep agricultural sourcing language out of first viewport  |
| PY machinery | Machinery import from USA to Paraguay  | Eligibility-first machinery coordination       | importar maquinaria Paraguay; maquinaria agrícola usada                           | Coordinación de compra y envío                                    | Hero; eligibility gate; process        | Never imply universal admissibility or age eligibility     |
| PY combines  | Combine shipping from USA              | Combine eligibility and freight                | flete cosechadora Paraguay; importar cosechadora                                  | Cosechadora preparada y enviada                                   | Hero; technical record; compliance     | Require year/serial/elegibility before operational promise |
| CL machinery | Machinery import from USA to Chile     | Machinery preparation for Chile                | importar maquinaria Chile; maquinaria usada USA                                   | Preparación desde origen; envío a Chile                           | Hero; SAG preparation section          | Do not use “SAG approved”                                  |
| CL heavy     | Heavy-equipment shipping from USA      | Earth-moving machinery/project cargo           | flete equipo pesado Chile; excavadora USA                                         | Heavy-equipment freight; cleaning coordination                    | Hero; engineering and cleaning process | First viewport must include local SAG/Aduanas separation   |
| UY machinery | Machinery import from USA to Uruguay   | Machinery preparation and DGSA handoff         | importar maquinaria Uruguay; maquinaria usada USA                                 | Preparación y exportación                                         | Hero; DGSA section; scope              | Do not publish universal taxes or certification guarantee  |
| UY combines  | Combine shipping from USA              | Combine dismantling, cleaning and freight      | flete cosechadora Uruguay; cosechadora USA                                        | Desmontaje, limpieza y flete                                      | Hero; process; quote fields            | Do not imply visible cleanliness equals DGSA acceptance    |

### 8.1 RSA claim allowlist

These claim families are supported when the route copy and actual service scope agree:

```text
Flete desde EE. UU.
Coordinación de retiro
Preparación para exportación
Desmontaje cuando sea necesario y esté cotizado
Embalaje y carga
Documentación de exportación
Cotización por WhatsApp
Asistencia de sourcing bajo alcance separado
Experiencia en maquinaria y carga de proyecto
```

### 8.2 RSA/page claim denylist

```text
Proveedor directo de maquinaria
Dealer autorizado
Aduana incluida
Impuestos incluidos
Precio final garantizado
Importación garantizada
Aprobado por SENASA/SAG/SENAVE/SENASAG/DGSA
Entrega garantizada en X días
Respuesta garantizada en una hora
La opción más económica
Más barato que el concesionario
Cualquier maquinaria puede ingresar
Seguro incluido para toda operación
Puerta a puerta unless explicitly and operationally true
```

### 8.3 Automated message-match output

Generate:

```text
reports/gate-b-website/<RUN_ID>/rsa-to-page-message-match.csv
```

Fields:

```text
campaign_id
campaign_name
ad_group_id
ad_group_name
ad_id
rsa_text
claim_category
expected_route
page_section_id
page_copy_excerpt
match_status
mismatch_severity
required_adjustment
evidence_id
```

A route cannot pass preview QA while an active launch-candidate RSA claim is contradicted or unsupported by its page.

---

## 9. Tracking and CTA Payload Spec

### 9.1 Required attribution fields

Capture from the landing URL:

```text
gclid
gbraid
wbraid
fbclid
utm_source
utm_medium
utm_campaign
utm_term
utm_content
utm_matchtype
utm_network
utm_device
```

Derive from the validated route record, not from untrusted query parameters:

```text
country
segment
landing_route
request_type
router_tag
```

Generate server-side:

```text
attribution_id
lead_id
whatsapp_ref
idempotency_key
captured_at
```

### 9.2 Source precedence

```text
Route record
  controls country, segment, landing_route and request_type.

Approved runtime configuration
  controls router_tag and WhatsApp phone-number reference.

Landing query
  supplies click IDs and UTMs only.

Server
  supplies lead_id, attribution_id, whatsapp_ref and timestamps.
```

Never allow:

```text
?country=CL
```

to change an Argentina page’s CRM country.

### 9.3 Capture behavior

On page load:

1. Parse only allowlisted query parameters.
2. Trim control characters and null bytes.
3. Apply field-length limits.
4. Ignore unknown parameters.
5. Create or update the latest-touch record.
6. Preserve an existing first-touch record.
7. Do not overwrite a paid first touch with a later direct visit.
8. Attach the current route context.
9. Emit one diagnostic landing-view event.

Recommended limits:

| Field          |          Maximum |
| -------------- | ---------------: |
| Click IDs      |   256 characters |
| UTM fields     |   512 characters |
| Landing URL    | 2,048 characters |
| Referrer       | 2,048 characters |
| Router tag     |    32 characters |
| `whatsapp_ref` |    32 characters |

Reject or truncate safely; never reflect unescaped values into HTML or WhatsApp text.

### 9.4 Persistence

Use the repository’s existing consent and privacy behavior. Extend it rather than creating a second policy.

Required storage behavior:

| Layer                    | Purpose                               | Content                               | Lifetime                                        |
| ------------------------ | ------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| In-memory/current URL    | Immediate render and CTA construction | Current touch                         | Current page                                    |
| `sessionStorage`         | Navigation within current visit       | First/latest touch plus route context | Browser session                                 |
| `localStorage`           | Client recovery between visits        | First/latest touch with `expiresAt`   | 90 days, self-purging                           |
| First-party cookie       | Server correlation                    | Opaque `attribution_id` only          | 90 days, `Secure`, `SameSite=Lax`, `Path=/`     |
| Server attribution store | WhatsApp/CRM correlation              | Full typed attribution payload        | Retention governed by existing privacy contract |

Do not place raw click IDs or the complete payload in a readable cookie.

When consent policy blocks persistent storage:

* Retain current-page attribution in memory.
* Apply the existing consent system’s approved session behavior.
* Do not invent a consent exemption.
* Production readiness fails if required attribution cannot survive the approved flow.

### 9.5 First-touch/latest-touch logic

```ts
function mergePaidAttribution(
  existing: PaidAttributionState | null,
  incoming: PaidAttributionTouch,
  routeContext: PaidRouteContext,
): PaidAttributionState {
  const hasPaidSignal = Boolean(
    incoming.gclid ||
      incoming.gbraid ||
      incoming.wbraid ||
      incoming.fbclid ||
      incoming.utm_source,
  );

  if (!existing) {
    return createNewState(incoming, routeContext);
  }

  return {
    ...existing,
    latestTouch: hasPaidSignal
      ? incoming
      : existing.latestTouch,
    routeContext,
  };
}
```

### 9.6 WhatsApp reference endpoint

Preferred flow:

```text
CTA click
→ POST /api/attribution/whatsapp-ref
→ validate route and payload
→ generate server-side lead_id
→ persist attribution
→ return opaque whatsapp_ref
→ construct WhatsApp URL
→ open WhatsApp
```

Request:

```json
{
  "routeKey": "argentina/importacion-maquinaria-usa",
  "attributionId": "attr_...",
  "firstTouch": {},
  "latestTouch": {}
}
```

Response:

```json
{
  "lead_id": "019...",
  "whatsapp_ref": "MF-A7K29XQ4",
  "expires_at": "2026-09-20T18:00:00Z"
}
```

The `whatsapp_ref` must:

* Be opaque.
* Be URL-safe.
* Resolve to one attribution record.
* Not encode raw click IDs visibly.
* Be unique per lead session.
* Be reusable across repeated CTA clicks for the same session/route.
* Be invalid outside the defined retention window.

### 9.7 WhatsApp URL rule

```ts
const text = interpolatePrefill(record.cta.whatsappPrefillTemplate, {
  whatsapp_ref: reference.whatsapp_ref,
});

const whatsappUrl =
  `https://wa.me/${configuredPhoneDigits}` +
  `?text=${encodeURIComponent(text)}`;
```

The visible message must contain:

```text
#FRT_ES
route-specific customer intent
equipment placeholders
destination
whatsapp_ref
```

It must not contain:

```text
gclid
gbraid
wbraid
fbclid
raw UTM string
internal CRM IDs other than the safe reference
```

### 9.8 Router-tag recommendation

Use:

```text
#FRT_ES
```

as the data-model default because it is the existing freight-route contract.

Implementation rules:

* Read the effective tag from server/runtime configuration.
* Compare it with the workbook’s Cross-Channel Routing Contract.
* Do not introduce a replacement tag from this website task.
* Do not change router behavior.
* Fail preview integration QA when the configured tag does not resolve to exactly one approved freight domain/queue.
* Record any mismatch instead of silently changing page data.

Suggested configuration:

```text
FREIGHT_ROUTER_TAG=#FRT_ES
WHATSAPP_PHONE_NUMBER=<existing secured configuration>
ROUTER_TEST_MODE=true
```

The production phone number must not be duplicated in route records.

### 9.9 Form payload

Visible fields:

```text
contact_name
contact_phone or contact_email
preferred_contact_method
equipment_type
make_model
year
listing_url
origin_location
destination_location
dimensions
weight
attachments
purchase_status
requested_timing
buyer_role
message
consent
```

Hidden/server-derived fields:

```text
lead_id
idempotency_key
attribution_id
whatsapp_ref if already created

source_platform
source_account_id
google_ads_tag

gclid
gbraid
wbraid
fbclid

utm_source
utm_medium
utm_campaign
utm_term
utm_content
utm_matchtype
utm_network
utm_device

country
segment
landing_route
request_type
router_tag

first_touch_at
latest_touch_at
submitted_at
schema_version
```

The server must rederive:

```text
country
segment
landing_route
request_type
```

from the route key before accepting the payload.

### 9.10 CRM/test handoff

Required field contract:

```text
lead_id
opportunity_id
conversation_id
attribution_id
whatsapp_ref
idempotency_key

source_platform
source_account_id
campaign_name
country
segment
request_type
landing_route

all click IDs and UTMs

equipment details
origin
destination
purchase status
contact details
consent version

router_tag
routed_domain
router_version

created_at
first_seen_at
last_seen_at
accepted_qqo_at
```

### 9.11 Dedupe recommendation

Primary identity:

```text
lead_id
```

Primary CRM idempotency key:

```text
idempotency_key = lead_id
```

WhatsApp correlation:

```text
whatsapp_ref → lead_id → attribution record
```

Secondary duplicate-review fingerprint:

```text
SHA-256(
  normalized_contact +
  "|" +
  normalized_listing_url_or_make_model +
  "|" +
  country +
  "|" +
  seven_day_bucket
)
```

Secondary matching should flag a possible duplicate for review. It must not automatically merge unrelated customers.

### 9.12 Diagnostic versus future-primary conversions

Diagnostic events for branch/preview:

```text
paid_search_landing_view
paid_search_primary_cta_click
paid_search_secondary_cta_click
paid_search_whatsapp_ref_created
paid_search_whatsapp_open
paid_search_form_start
paid_search_form_submit
router_test_handoff_accepted
crm_test_record_accepted
crm_test_record_rejected
qqo_dry_run_accepted
qqo_dry_run_rejected
```

Future business event:

```text
MERIDIAN_QQO
```

Rules:

* Raw page views, CTA clicks, WhatsApp opens and form submits are diagnostic.
* They must not be represented as qualified opportunities.
* A QQO requires the approved qualification contract.
* The dry run may exercise the evaluator and produce a test result.
* **No event is uploaded to Google Ads during branch or preview testing.**
* Do not create or alter a Google Ads conversion action.

### 9.13 Failure behavior

| Failure                        | User behavior                                              | QA result                 |
| ------------------------------ | ---------------------------------------------------------- | ------------------------- |
| Attribution parsing fails      | Page remains usable; diagnostic error recorded             | Hold preview readiness    |
| WhatsApp-ref endpoint fails    | Show form fallback and retry; do not claim tracked handoff | Hold preview readiness    |
| Router test cannot resolve tag | Do not mutate router                                       | Hold production readiness |
| CRM test adapter unavailable   | Persist test fixture locally only                          | Hold production readiness |
| Google Ads tag absent          | Record mismatch; do not add conversion action              | Hold production readiness |
| Consent system conflict        | Preserve user choice; do not bypass                        | Hold production readiness |

---

## 10. Test and QA Plan

Use the repository’s existing package manager and scripts from `package.json`. Do not assume `npm`, `pnpm` or `yarn` before inspection.

### 10.1 Required test matrix

| Test ID    | Type                | Acceptance criteria                                 |
| ---------- | ------------------- | --------------------------------------------------- |
| ROUTE-001  | Data invariant      | Exactly 10 route records                            |
| ROUTE-002  | Data invariant      | All route keys unique                               |
| ROUTE-003  | Data invariant      | All canonical paths unique                          |
| ROUTE-004  | Static params       | Exactly the 10 approved combinations generated      |
| ROUTE-005  | Invalid route       | Unapproved country/segment combination returns 404  |
| ROUTE-006  | Locale              | Non-Spanish route is not generated                  |
| META-001   | Metadata            | Unique title and description for all 10             |
| META-002   | Canonical           | Canonical equals production-domain + route path     |
| META-003   | Schema              | Valid Service, BreadcrumbList and FAQPage           |
| META-004   | Schema              | No Product, Offer, Review or AggregateRating        |
| RENDER-001 | Build               | Strict TypeScript passes                            |
| RENDER-002 | Render              | All 10 pages render without runtime errors          |
| RENDER-003 | HTTP                | Preview responses return 200                        |
| RENDER-004 | Redirect            | No unexpected redirect or legacy-domain hop         |
| RENDER-005 | JS                  | No console errors or hydration mismatch             |
| MOBILE-001 | Layout              | No horizontal overflow at 320 px                    |
| MOBILE-002 | CTA                 | Primary CTA visible and usable without overlap      |
| MOBILE-003 | Form                | All inputs labeled, usable and keyboard accessible  |
| A11Y-001   | Headings            | One H1 and logical hierarchy                        |
| A11Y-002   | Focus               | Visible keyboard focus                              |
| A11Y-003   | Contrast            | Existing design-system standards pass               |
| ADSBOT-001 | Crawl               | AdsBot-Google receives full content and 200         |
| ADSBOT-002 | Robots              | Route not blocked in production robots rules        |
| ADSBOT-003 | Cloaking            | Same material content for normal user and AdsBot    |
| ADSBOT-004 | Access              | No login, forced location or interstitial required  |
| ATTR-001   | Capture             | Every required click/UTM field captured             |
| ATTR-002   | Sanitization        | Unknown/control-character payload rejected          |
| ATTR-003   | First touch         | First paid touch preserved                          |
| ATTR-004   | Latest touch        | Later paid touch updates latest only                |
| ATTR-005   | Direct visit        | Direct visit does not erase paid attribution        |
| ATTR-006   | Route context       | Country/segment cannot be overridden by query       |
| ATTR-007   | Persistence         | Attribution survives internal navigation and reload |
| ATTR-008   | Expiry              | Local record self-purges after configured TTL       |
| WA-001     | Ref                 | Opaque `whatsapp_ref` created server-side           |
| WA-002     | Prefill             | Correct route-specific Spanish message generated    |
| WA-003     | Privacy             | No raw click ID appears in visible message          |
| WA-004     | Router              | `#FRT_ES` resolves to expected test route           |
| WA-005     | Encoding            | Accents, `#`, spaces and URL encoded correctly      |
| FORM-001   | Required fields     | Required visible fields validated                   |
| FORM-002   | Hidden fields       | Complete attribution payload reaches server         |
| FORM-003   | Trust boundary      | Server rederives route fields                       |
| FORM-004   | Idempotency         | Duplicate submit returns same lead result           |
| CRM-001    | Test handoff        | One test opportunity accepted                       |
| CRM-002    | Duplicate           | Duplicate lead does not create second opportunity   |
| CRM-003    | Missing route       | Rejected with typed reason                          |
| CRM-004    | Missing attribution | Accepted/rejected according to explicit contract    |
| QQO-001    | Qualified           | Valid synthetic record accepted once                |
| QQO-002    | Duplicate           | Duplicate QQO rejected                              |
| QQO-003    | Unqualified         | Missing qualification criteria rejected             |
| QQO-004    | Upload              | No Google Ads upload call exists or executes        |
| CLAIM-001  | Copy audit          | No denylisted claim in rendered page                |
| CLAIM-002  | Scope               | Local responsibility appears in first viewport      |
| CLAIM-003  | Sources             | Correct official links shown per country            |
| MATCH-001  | RSA mapping         | Every launch-candidate RSA mapped to page section   |
| MATCH-002  | Contradiction       | Zero material RSA/page contradiction                |
| MATCH-003  | Segment             | No combine/heavy/machinery route intent drift       |

### 10.2 Route-matrix test

```ts
expect(routeRecords).toHaveLength(10);

expect(
  new Set(routeRecords.map((r) => r.seo.canonicalPath)).size,
).toBe(10);

expect(routeRecords.map((r) => r.seo.canonicalPath)).toEqual(
  expect.arrayContaining(EXPECTED_CANONICAL_PATHS),
);
```

### 10.3 Metadata tests

For each route:

* Title contains segment or relevant equipment.
* Title contains destination country.
* Description mentions origin and operational scope.
* Canonical path is exact.
* No meta description claims local customs inclusion.
* No duplicate title or description.
* Open Graph URL equals canonical.
* JSON-LD URL equals canonical.

### 10.4 HTTP/render smoke

Preview runner must request:

```text
all 10 canonical routes
all 5 parent hubs
3 invalid combinations
sitemap
robots.txt
```

Record:

```text
URL
status
redirect chain
canonical
title
H1
robots meta
content length
CTA presence
console errors
```

### 10.5 Mobile QA

Test at:

```text
320 × 568
375 × 812
390 × 844
430 × 932
```

Verify:

* Hero copy is readable.
* Primary CTA is not hidden behind a sticky UI element.
* WhatsApp and form CTAs are distinguishable.
* Scope cards do not overflow.
* FAQ controls have adequate touch targets.
* Long Spanish words and URLs wrap.
* No layout shift when analytics or reference calls complete.

### 10.6 AdsBot-Google QA

Use a read-only request with AdsBot user agent against preview or an equivalent accessible environment:

```bash
curl -I \
  -A "AdsBot-Google (+http://www.google.com/adsbot.html)" \
  "https://<preview-host>/es/destinations/argentina/importacion-maquinaria-usa"
```

Acceptance:

* 200 response.
* No authentication challenge.
* No geographic block.
* No empty client-only shell.
* No material copy difference.
* Canonical points to production route, not preview domain.
* Production robots configuration will allow crawling.

### 10.7 Attribution persistence scenarios

Test:

1. `gclid` entry.
2. `gbraid` entry.
3. `wbraid` entry.
4. `fbclid` entry.
5. UTMs only.
6. Mixed click IDs.
7. No parameters.
8. New paid touch after first paid touch.
9. Direct return.
10. Navigation to parent hub and back.
11. Form submit.
12. WhatsApp ref generation.
13. Storage expiry.
14. Consent denied.
15. Malformed overlength input.

### 10.8 WhatsApp tests

Assert:

```text
message begins with configured router tag
message matches route language and segment
reference appears exactly once
click IDs do not appear
UTMs do not appear
bracket placeholders remain legible
line length remains acceptable
URL encodes Unicode correctly
```

No production message should be sent.

### 10.9 CRM contract dry run

Use synthetic values only:

```json
{
  "contact_name": "Prueba Gate B",
  "contact_email": "gate-b-test@example.invalid",
  "equipment_type": "combine",
  "make_model": "TEST MODEL",
  "origin_location": "Test City, IA",
  "destination_location": "Rosario, Argentina",
  "purchase_status": "evaluating",
  "source_platform": "google_ads",
  "source_account_id": "3783002123",
  "gclid": "TEST_GCLID_NOT_FOR_UPLOAD"
}
```

The adapter must visibly mark:

```text
environment = test
do_not_contact = true
do_not_upload = true
```

### 10.10 QQO dry-run cases

#### Accepted synthetic case

Contains:

* Contactable buyer.
* Identified country.
* Identified equipment.
* Origin or listing URL.
* Requested service.
* Purchase/timing signal.
* No duplicate idempotency key.

#### Rejected cases

* Missing equipment.
* Missing destination.
* Spam or unrelated request.
* Duplicate `lead_id`.
* Duplicate `whatsapp_ref`.
* Customer-support message rather than quote request.
* Existing proposal follow-up falsely treated as a new acquisition opportunity.
* Test record without explicit test flag.

### 10.11 Unsupported-claim audit

Search rendered output and source data:

```bash
rg -ni \
  "garantiz|más barato|más económico|precio final|aduana incluida|impuestos incluidos|proveedor directo|dealer autorizado|aprobado por|sin requisitos|importación libre|puerta a puerta|en [0-9]+ días|respuesta en [0-9]+ hora" \
  content components app
```

Every result must be:

* Removed.
* Qualified.
* Or explicitly documented as acceptable with evidence.

### 10.12 Final QA artifacts

```text
route-matrix.json
route-smoke.csv
metadata-audit.csv
mobile-qa.md
adsbot-qa.md
attribution-tests.json
whatsapp-payload-tests.json
form-payload-tests.json
crm-contract-dry-run.json
qqo-dry-run.json
unsupported-claim-audit.csv
rsa-to-page-message-match.csv
preview-readiness-report.md
```

---

## 11. Gate B Readiness Checklist

### 11.1 Website branch readiness

* [ ] Isolated branch created.
* [ ] Existing design components identified and reused.
* [ ] One data-driven route system implemented.
* [ ] Exactly ten route records.
* [ ] Strict TypeScript passes.
* [ ] Lint passes.
* [ ] Unit tests pass.
* [ ] Production branch untouched.
* [ ] No advertising or external-system mutation.
* [ ] No new unsupported dependency.
* [ ] Copy matches this specification.
* [ ] Official source records included.
* [ ] No prohibited claims.

### 11.2 Preview readiness

* [ ] All ten routes return 200 in preview.
* [ ] Invalid combinations return 404.
* [ ] Titles, descriptions, canonicals and schemas pass.
* [ ] Responsive QA passes.
* [ ] Accessibility QA passes.
* [ ] AdsBot test passes.
* [ ] Required click IDs and UTMs persist.
* [ ] Route fields cannot be query-overridden.
* [ ] WhatsApp refs are generated.
* [ ] No raw click IDs appear in WhatsApp.
* [ ] Form payload reaches the test adapter.
* [ ] Router-tag test resolves correctly.
* [ ] CRM test handoff passes.
* [ ] QQO acceptance/rejection dry run passes.
* [ ] No Google conversion upload occurs.
* [ ] RSA-to-page message-match report has no material contradiction.
* [ ] Preview is not promoted to production.

### 11.3 Production deployment readiness

This spec does not approve production deployment.

Before a separate deployment approval:

* [ ] Preview explicitly reviewed.
* [ ] Current branch diff approved.
* [ ] Rollback commit identified.
* [ ] Production environment variables verified.
* [ ] Production WhatsApp number verified.
* [ ] Approved router tag/domain/version verified.
* [ ] Persistent attribution store approved.
* [ ] CRM production adapter approved.
* [ ] Consent/privacy implementation approved.
* [ ] Final production source links checked.
* [ ] Existing global analytics confirmed.
* [ ] No duplicate Google tag installed.
* [ ] Sitemap inclusion approved.
* [ ] Production smoke-test owner named.
* [ ] Rollback owner named.
* [ ] Production deployment approval recorded.

### 11.4 Google Ads activation readiness

Production site deployment still does not approve Google Ads activation.

Before activation:

* [ ] Ten production routes return 200.
* [ ] Final URLs match the exact campaign-route matrix.
* [ ] No redirect to legacy or generic pages.
* [ ] Tracking persistence passes production smoke tests.
* [ ] WhatsApp/form → router → CRM works in the approved environment.
* [ ] Route-specific QQO dry run has passed.
* [ ] Campaigns remain paused until explicit activation.
* [ ] Search-only settings verified.
* [ ] Search Partners off.
* [ ] Display off.
* [ ] AI Max off.
* [ ] Exact-match structure verified.
* [ ] Presence-only location options verified.
* [ ] Spanish targeting verified.
* [ ] Negative-keyword collision audit passes.
* [ ] RSA policy and claim audit passes.
* [ ] Effective campaign conversion-goal inheritance documented.
* [ ] Budget by campaign approved.
* [ ] Total experiment cap approved.
* [ ] Monitoring owner approved.
* [ ] Sales-response owner and SLA approved.
* [ ] Kill conditions approved.
* [ ] Rollback authority approved.
* [ ] Written Gate B activation approval recorded.

---

## 12. No-Guesswork Build Table

### Common attribution set

`ALL_ATTR` means:

```text
gclid
gbraid
wbraid
fbclid
utm_source
utm_medium
utm_campaign
utm_term
utm_content
utm_matchtype
utm_network
utm_device
country
segment
landing_route
request_type
whatsapp_ref
router_tag
```

| Country   | Segment          | URL                                                     | Campaign                                                                 | Ad-group intent                             | Keyword cluster                                        | H1                                                                       | CTA parameters                                                                                 | Router tag                   | Tracking   | Main compliance caveat                                               | QA acceptance                                                                      |
| --------- | ---------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------- | ---------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Argentina | Machinery import | `/es/destinations/argentina/importacion-maquinaria-usa` | `Search \| AR \| Machinery Import from USA \| Gate A \| 2026-07`         | Machinery import; optional sourcing support | importar maquinaria usada; maquinaria agrícola EE. UU. | Importá maquinaria usada de EE. UU. a Argentina con un alcance claro     | `country=AR`, `segment=machinery_import`, `request_type=import_coordination_quote`             | Configured default `#FRT_ES` | `ALL_ATTR` | AFIDI/SENASA and local customs remain with importer                  | 200; exact canonical; AR voseo; no local-cost promise; attribution and WA ref pass |
| Argentina | Combine shipping | `/es/destinations/argentina/flete-cosechadoras-usa`     | `Search \| AR \| Combine Shipping from USA \| Gate A \| 2026-07`         | Combine freight and preparation             | flete cosechadora USA; importar cosechadora            | Flete de cosechadoras desde EE. UU. a Argentina                          | `country=AR`, `segment=combine_shipping`, `request_type=combine_freight_quote`                 | Configured default `#FRT_ES` | `ALL_ATTR` | Cosechadora/cabezal plus AFIDI/SENASA must be documented             | 200; technical fields present; no generic rate claim; message-match passes         |
| Bolivia   | Machinery import | `/es/destinations/bolivia/importacion-maquinaria-usa`   | `Search \| BO \| Machinery Import from USA \| Gate A \| 2026-07`         | Machinery export to transit port            | importar maquinaria Bolivia; maquinaria usada USA      | Importe maquinaria usada de EE. UU. a Bolivia con una ruta definida      | `country=BO`, `segment=machinery_import`, `request_type=import_coordination_quote`             | Configured default `#FRT_ES` | `ALL_ATTR` | Aduana/SENASAG and inland transit are locally validated              | 200; transit-port wording in hero; no Arica guarantee; payload passes              |
| Bolivia   | Heavy equipment  | `/es/destinations/bolivia/flete-equipo-pesado-usa`      | `Search \| BO \| Heavy Equipment Shipping from USA \| Gate A \| 2026-07` | Heavy-equipment project freight             | flete equipo pesado; excavadora USA                    | Flete de equipo pesado desde EE. UU. a Bolivia                           | `country=BO`, `segment=heavy_equipment_shipping`, `request_type=heavy_equipment_freight_quote` | Configured default `#FRT_ES` | `ALL_ATTR` | Local customs, road permits and inland transport excluded by default | 200; weight/dimensions required; no agricultural-intent drift                      |
| Paraguay  | Machinery import | `/es/destinations/paraguay/importacion-maquinaria-usa`  | `Search \| PY \| Machinery Import from USA \| Gate A \| 2026-07`         | Eligibility-first import coordination       | importar maquinaria Paraguay; maquinaria usada         | Importe maquinaria usada de EE. UU. a Paraguay con elegibilidad validada | `country=PY`, `segment=machinery_import`, `request_type=import_coordination_quote`             | Configured default `#FRT_ES` | `ALL_ATTR` | Law 7565/MIC/SENAVE/DNIT validation precedes purchase                | 200; eligibility gate visible; no universal-age/admissibility claim                |
| Paraguay  | Combine shipping | `/es/destinations/paraguay/flete-cosechadoras-usa`      | `Search \| PY \| Combine Shipping from USA \| Gate A \| 2026-07`         | Combine eligibility and freight             | flete cosechadora Paraguay; cosechadora usada USA      | Flete de cosechadoras desde EE. UU. a Paraguay                           | `country=PY`, `segment=combine_shipping`, `request_type=combine_freight_quote`                 | Configured default `#FRT_ES` | `ALL_ATTR` | Year/equipment eligibility and SENAVE process are locally confirmed  | 200; year/serial/head required; no guaranteed entry                                |
| Chile     | Machinery import | `/es/destinations/chile/importacion-maquinaria-usa`     | `Search \| CL \| Machinery Import from USA \| Gate A \| 2026-07`         | Machinery prepared for Chile                | importar maquinaria Chile; maquinaria usada USA        | Importe maquinaria usada de EE. UU. a Chile preparada para control SAG   | `country=CL`, `segment=machinery_import`, `request_type=import_coordination_quote`             | Configured default `#FRT_ES` | `ALL_ATTR` | SAG cleanliness and inspection remain authority-controlled           | 200; SAG preparation visible; no “SAG approved” claim                              |
| Chile     | Heavy equipment  | `/es/destinations/chile/flete-equipo-pesado-usa`        | `Search \| CL \| Heavy Equipment Shipping from USA \| Gate A \| 2026-07` | Earth-moving/project cargo                  | flete equipo pesado Chile; excavadora USA              | Flete de equipo pesado desde EE. UU. a Chile                             | `country=CL`, `segment=heavy_equipment_shipping`, `request_type=heavy_equipment_freight_quote` | Configured default `#FRT_ES` | `ALL_ATTR` | SAG can apply to earth-moving machinery; local permits excluded      | 200; cleaning/engineering both present; heavy-intent match passes                  |
| Uruguay   | Machinery import | `/es/destinations/uruguay/importacion-maquinaria-usa`   | `Search \| UY \| Machinery Import from USA \| Gate A \| 2026-07`         | Machinery preparation and DGSA handoff      | importar maquinaria Uruguay; maquinaria usada USA      | Importe maquinaria usada de EE. UU. a Uruguay con preparación para DGSA  | `country=UY`, `segment=machinery_import`, `request_type=import_coordination_quote`             | Configured default `#FRT_ES` | `ALL_ATTR` | DGSA cleaning/certificate/inspection and customs remain local        | 200; source links present; no fixed tax or certification guarantee                 |
| Uruguay   | Combine shipping | `/es/destinations/uruguay/flete-cosechadoras-usa`       | `Search \| UY \| Combine Shipping from USA \| Gate A \| 2026-07`         | Combine dismantling, cleaning and freight   | flete cosechadora Uruguay; cosechadora USA             | Flete de cosechadoras desde EE. UU. a Uruguay                            | `country=UY`, `segment=combine_shipping`, `request_type=combine_freight_quote`                 | Configured default `#FRT_ES` | `ALL_ATTR` | DGSA requirements apply independently of visual cleaning             | 200; machine/head fields; DGSA caveat; no raw IDs in WA                            |

### Required Codex terminal state

After implementing and testing this package, Codex must stop with:

```text
WEBSITE_BRANCH_READY_FOR_PREVIEW_REVIEW
```

or:

```text
WEBSITE_BUILD_HOLD_WITH_DISCREPANCIES
```

Neither output authorizes production deployment or Google Ads activation.

[1]: https://meridianexport.com/ "https://meridianexport.com/"
[2]: https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto"
[3]: https://www.aduana.gob.bo/ "https://www.aduana.gob.bo/"
[4]: https://www.dnit.gov.py/ "https://www.dnit.gov.py/"
[5]: https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725 "https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725"
[6]: https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais"
