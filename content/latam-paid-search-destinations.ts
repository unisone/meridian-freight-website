/**
 * LATAM paid-search destination routes (Gate B).
 *
 * 10 immutable records driving /es/destinations/{country}/{segment} pages, the
 * landing destinations for the 10 paused Gate A Google Ads campaigns.
 *
 * Spec: docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md
 *
 * Customer-facing copy is sourced from content/latam-paid-search-copy.ts
 * (verified per-country Spanish; pending client native review before go-live).
 * Official-source URLs are the verified real ones (see spec §7). Compliance
 * caveats keep Meridian's role freight-only and defer admissibility to the
 * destination despachante.
 */

import { PAID_SEARCH_COPY } from "@/content/latam-paid-search-copy";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const PAID_SEARCH_COUNTRIES = [
  "argentina",
  "bolivia",
  "paraguay",
  "chile",
  "uruguay",
] as const;
export type PaidSearchCountrySlug = (typeof PAID_SEARCH_COUNTRIES)[number];

export const PAID_SEARCH_SEGMENTS = [
  "importacion-maquinaria-usa",
  "flete-cosechadoras-usa",
  "flete-equipo-pesado-usa",
] as const;
export type PaidSearchSegmentSlug = (typeof PAID_SEARCH_SEGMENTS)[number];

export type PaidSearchCountryCode = "AR" | "BO" | "PY" | "CL" | "UY";
export type PaidSearchSegmentKey =
  | "machinery_import"
  | "combine_shipping"
  | "heavy_equipment_shipping";
export type PaidSearchRequestType =
  | "import_coordination_quote"
  | "combine_freight_quote"
  | "heavy_equipment_freight_quote";
/** Website-emitted default; final qualified value is downstream (spec §4, §15). */
export type PaidSearchCargoClass = "general_machinery" | "combine" | "heavy_oog";
export type PaidSearchRouteKey = `${PaidSearchCountrySlug}/${PaidSearchSegmentSlug}`;

// ─── Content shape ──────────────────────────────────────────────────────────

export interface PaidSearchOfficialSource {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly description: string;
}
export interface PaidSearchFaqItem {
  readonly question: string;
  readonly answer: string;
}
export interface PaidSearchStep {
  readonly title: string;
  readonly body: string;
}

export interface LatamPaidSearchDestination {
  readonly routeKey: PaidSearchRouteKey;
  readonly locale: "es";
  readonly country: {
    readonly code: PaidSearchCountryCode;
    readonly slug: PaidSearchCountrySlug;
    readonly name: string;
    readonly hubPath: `/es/destinations/${PaidSearchCountrySlug}`;
  };
  readonly segment: {
    readonly slug: PaidSearchSegmentSlug;
    readonly key: PaidSearchSegmentKey;
    readonly publicName: string;
    readonly cargoClass: PaidSearchCargoClass;
    readonly requestType: PaidSearchRequestType;
  };
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonicalPath: `/es/destinations/${string}`;
  };
  readonly breadcrumbLabel: string;
  readonly eyebrow: string;
  readonly h1: string;
  readonly heroBody: string;
  readonly heroBullets: readonly string[];
  /** First-viewport scope split (spec §6.2) */
  readonly scopeIncluded: readonly string[];
  readonly scopeExcluded: readonly string[];
  readonly process: {
    readonly heading: string;
    readonly intro: string;
    readonly steps: readonly PaidSearchStep[];
  };
  readonly quoteReadiness: {
    readonly heading: string;
    readonly intro: string;
    readonly fields: readonly string[];
  };
  readonly compliance: {
    readonly heading: string;
    readonly body: string;
    /** Always rendered adjacent to the CTA (spec §15). */
    readonly localResponsibility: string;
  };
  readonly faq: readonly PaidSearchFaqItem[];
  readonly officialSources: readonly PaidSearchOfficialSource[];
  readonly jsonLd: {
    readonly serviceName: string;
    readonly serviceType: string;
    readonly areaServedCountryName: string;
  };
  readonly cta: {
    readonly heading: string;
    readonly description: string;
    readonly whatsappLabel: string;
    readonly calculatorLabel: string;
    /** {{whatsapp_ref}} is interpolated at click time (P3). */
    readonly whatsappPrefill: string;
  };
  /** Slug-prefixed snake_case tracking location ids (spec §7 convention). */
  readonly tracking: {
    readonly heroWhatsapp: string;
    readonly heroCalculator: string;
    readonly finalWhatsapp: string;
    readonly finalCalculator: string;
  };
  readonly internalLinks: readonly { readonly label: string; readonly href: string }[];
}

// ─── Per-country / per-segment metadata ─────────────────────────────────────

const COUNTRY_META: Record<
  PaidSearchCountrySlug,
  { code: PaidSearchCountryCode; name: string }
> = {
  argentina: { code: "AR", name: "Argentina" },
  bolivia: { code: "BO", name: "Bolivia" },
  paraguay: { code: "PY", name: "Paraguay" },
  chile: { code: "CL", name: "Chile" },
  uruguay: { code: "UY", name: "Uruguay" },
};

const SEGMENT_META: Record<
  PaidSearchSegmentSlug,
  {
    key: PaidSearchSegmentKey;
    cargoClass: PaidSearchCargoClass;
    requestType: PaidSearchRequestType;
    publicName: string;
    equipmentEs: string;
  }
> = {
  "importacion-maquinaria-usa": {
    key: "machinery_import",
    cargoClass: "general_machinery",
    requestType: "import_coordination_quote",
    publicName: "Importación de maquinaria",
    equipmentEs: "maquinaria usada",
  },
  "flete-cosechadoras-usa": {
    key: "combine_shipping",
    cargoClass: "combine",
    requestType: "combine_freight_quote",
    publicName: "Flete de cosechadoras",
    equipmentEs: "cosechadoras",
  },
  "flete-equipo-pesado-usa": {
    key: "heavy_equipment_shipping",
    cargoClass: "heavy_oog",
    requestType: "heavy_equipment_freight_quote",
    publicName: "Flete de equipo pesado",
    equipmentEs: "equipo pesado",
  },
};

/** Verified official sources per country (spec §7; URLs confirmed 2026-06-22). */
const OFFICIAL_SOURCES: Record<PaidSearchCountrySlug, readonly PaidSearchOfficialSource[]> = {
  argentina: [
    { id: "AR-01", label: "Decreto 273/2025", url: "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto", description: "Régimen de importación de bienes usados (reemplaza el CIBU por declaración jurada en el SIM)." },
    { id: "AR-02", label: "SENASA — AFIDI", url: "https://www.argentina.gob.ar/servicio/gestionar-la-autorizacion-fitosanitaria-de-importacion-afidi-y-la-evaluacion-de", description: "Autorización Fitosanitaria de Importación para maquinaria agrícola usada." },
    { id: "AR-03", label: "SENASA — control de maquinaria usada", url: "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de", description: "Revisión documental e inspección física: equipos limpios, libres de suelo y restos vegetales." },
  ],
  bolivia: [
    { id: "BO-01", label: "Aduana Nacional de Bolivia", url: "https://www.aduana.gob.bo/", description: "Autoridad aduanera; registro de importadores y declaración de importación." },
    { id: "BO-02", label: "SENASAG — Cuarentena Vegetal", url: "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal", description: "Inspección o autorización fitosanitaria según producto, origen y condición del equipo." },
  ],
  paraguay: [
    { id: "PY-01", label: "Ley 7565/2025", url: "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados", description: "Medidas fitosanitarias y de mitigación de riesgo para maquinaria agrícola usada." },
    { id: "PY-02", label: "DNIT", url: "https://www.dnit.gov.py/", description: "Autoridad aduanera y tributaria." },
    { id: "PY-03", label: "SENAVE", url: "https://www.senave.gov.py/", description: "Autoridad fitosanitaria." },
    { id: "PY-04", label: "MIC", url: "https://www.mic.gov.py/", description: "Registro de importadores y licencia previa." },
  ],
  chile: [
    { id: "CL-01", label: "SAG — Resolución 3.103/2016", url: "https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725", description: "Maquinaria usada debe llegar limpia, libre de suelo, restos vegetales y plagas reglamentadas; inspección al ingreso." },
    { id: "CL-02", label: "Aduanas de Chile — normas generales", url: "https://www.aduana.cl/capitulo-1-normas-generales/aduana/2007-02-15/151856.html", description: "Definiciones aduaneras (importación, despacho, despachador de aduana)." },
    { id: "CL-03", label: "Puerto San Antonio", url: "https://www.puertosanantonio.com/operacion-portuaria", description: "Contexto de operación portuaria (San Antonio o Valparaíso, según naviera y carga)." },
  ],
  uruguay: [
    { id: "UY-01", label: "DGSA — Resolución 98/016", url: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais", description: "Requisitos fitosanitarios: limpieza de origen, tratamiento/certificación e inspección." },
    { id: "UY-02", label: "Aduanas — Tasa Global Arancelaria", url: "https://www.aduanas.gub.uy/innovaportal/v/7032/3/innova.front/tasa-global-arancelaria-tga.html", description: "Referencia general de la TGA (la tasa del 2% corresponde a bienes de capital BK/BIT según Decreto 426/011)." },
  ],
};

/** The 10 curated valid pairs (NOT the full 5x2 product). */
const VALID_PAIRS: readonly (readonly [PaidSearchCountrySlug, PaidSearchSegmentSlug])[] = [
  ["argentina", "importacion-maquinaria-usa"],
  ["argentina", "flete-cosechadoras-usa"],
  ["bolivia", "importacion-maquinaria-usa"],
  ["bolivia", "flete-equipo-pesado-usa"],
  ["paraguay", "importacion-maquinaria-usa"],
  ["paraguay", "flete-cosechadoras-usa"],
  ["chile", "importacion-maquinaria-usa"],
  ["chile", "flete-equipo-pesado-usa"],
  ["uruguay", "importacion-maquinaria-usa"],
  ["uruguay", "flete-cosechadoras-usa"],
];

// ─── Record factory (verified P2 Spanish copy from content/latam-paid-search-copy) ──

function buildDestination(
  countrySlug: PaidSearchCountrySlug,
  segmentSlug: PaidSearchSegmentSlug,
): LatamPaidSearchDestination {
  const c = COUNTRY_META[countrySlug];
  const s = SEGMENT_META[segmentSlug];
  const path = `/es/destinations/${countrySlug}/${segmentSlug}` as const;
  const trackingPrefix = `${countrySlug}_${s.key}`;
  const copy = PAID_SEARCH_COPY[`${countrySlug}/${segmentSlug}`];
  if (!copy) {
    throw new Error(`Missing paid-search copy for ${countrySlug}/${segmentSlug}`);
  }

  return {
    routeKey: `${countrySlug}/${segmentSlug}`,
    locale: "es",
    country: { code: c.code, slug: countrySlug, name: c.name, hubPath: `/es/destinations/${countrySlug}` },
    segment: { slug: segmentSlug, key: s.key, publicName: s.publicName, cargoClass: s.cargoClass, requestType: s.requestType },
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
      heading: "Cómo coordinamos la operación",
      intro: copy.processIntro,
      steps: copy.processSteps,
    },
    quoteReadiness: {
      heading: "Datos para preparar una cotización útil",
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
      serviceName: `Coordinación de ${s.publicName.toLowerCase()} desde EE. UU. a ${c.name}`,
      serviceType: "Freight forwarding and export coordination for used machinery",
      areaServedCountryName: c.name,
    },
    cta: {
      heading: copy.ctaHeading,
      description: copy.ctaDescription,
      whatsappLabel: "Cotizar por WhatsApp",
      calculatorLabel: "Calcular flete estimado",
      whatsappPrefill: copy.whatsappPrefill,
    },
    tracking: {
      heroWhatsapp: `${trackingPrefix}_hero_whatsapp`,
      heroCalculator: `${trackingPrefix}_hero_calculator`,
      finalWhatsapp: `${trackingPrefix}_final_whatsapp`,
      finalCalculator: `${trackingPrefix}_final_calculator`,
    },
    internalLinks: [
      { label: `${c.name}: guía de importación`, href: `/es/destinations/${countrySlug}` },
      { label: "Compra asistida de equipo", href: "/services/equipment-sales" },
      { label: "Calculadora de flete", href: "/pricing/calculator" },
    ],
  };
}

export const LATAM_PAID_SEARCH_DESTINATIONS: readonly LatamPaidSearchDestination[] =
  VALID_PAIRS.map(([country, segment]) => buildDestination(country, segment));
