/**
 * Blog locale indexability policy.
 *
 * For the LATAM import-guide cluster (Paraguay, Argentina, Uruguay, Bolivia,
 * Chile), Spanish is the primary audience and English is kept as a secondary
 * indexable locale for cross-linking from the global site. Russian copy is
 * generated for site parity but not indexable for these guides, because
 * Meridian does not currently have a Russian-speaking LATAM buyer flow.
 *
 * The import-authority pillar pages have separate ES and EN slugs (Spanish-
 * first for the ES version, English slug for the EN counterpart). Each is
 * registered here with a single-locale policy to avoid generating hreflang
 * alternates that point to non-existent cross-locale pages.
 *
 * All other blog posts retain the default tri-locale indexable policy with
 * English as the x-default.
 */
import { isLatamImportGuideSlug } from "@/content/import-guide-enhancements";

export type BlogLocale = "en" | "es" | "ru";

export interface BlogLocalePolicy {
  indexableLocales: readonly BlogLocale[];
  alternateLocales: readonly BlogLocale[];
  xDefaultLocale: BlogLocale;
}

const LATAM_IMPORT_GUIDE_POLICY: BlogLocalePolicy = {
  indexableLocales: ["es", "en"],
  alternateLocales: ["es", "en"],
  xDefaultLocale: "es",
};

const DEFAULT_BLOG_POLICY: BlogLocalePolicy = {
  indexableLocales: ["en", "es", "ru"],
  alternateLocales: ["en", "es", "ru"],
  xDefaultLocale: "en",
};

/**
 * Import-authority pillar pages. Each slug is a standalone locale version
 * (ES slug ≠ EN slug), so alternateLocales is limited to the slug's own
 * locale — no cross-locale hreflang is emitted for non-existent counterparts.
 */
const IMPORT_PILLAR_POLICIES: Record<string, BlogLocalePolicy> = {
  // Spanish-primary generic hub: /es/blog/importar-maquinaria-agricola-usa
  "importar-maquinaria-agricola-usa": {
    indexableLocales: ["es"],
    alternateLocales: ["es"],
    xDefaultLocale: "es",
  },
  // English counterpart hub: /blog/import-farm-machinery-from-usa
  "import-farm-machinery-from-usa": {
    indexableLocales: ["en"],
    alternateLocales: ["en"],
    xDefaultLocale: "en",
  },
};

/**
 * Africa Wave-1 blog guides. These support the English-only Africa destination
 * pages (Kenya/Ghana) and have no ES or RU counterparts — the copy lives only in
 * `content/blog.ts`, not `blog-es.ts`/`blog-ru.ts`. Each is a standalone `en`
 * group (self-referential x-default) so the sitemap and hreflang never advertise
 * a non-existent `/es` or `/ru` variant that would 404.
 */
const AFRICA_WAVE1_GUIDE_SLUGS = new Set<string>([
  "shipping-heavy-equipment-usa-to-kenya",
  "import-used-tractors-usa-to-ghana",
  "kebs-pvoc-used-machinery-origin-inspection",
]);

const AFRICA_WAVE1_GUIDE_POLICY: BlogLocalePolicy = {
  indexableLocales: ["en"],
  alternateLocales: ["en"],
  xDefaultLocale: "en",
};

export function getBlogLocalePolicy(slug: string): BlogLocalePolicy {
  if (isLatamImportGuideSlug(slug)) {
    return LATAM_IMPORT_GUIDE_POLICY;
  }
  if (Object.prototype.hasOwnProperty.call(IMPORT_PILLAR_POLICIES, slug)) {
    return IMPORT_PILLAR_POLICIES[slug];
  }
  if (AFRICA_WAVE1_GUIDE_SLUGS.has(slug)) {
    return AFRICA_WAVE1_GUIDE_POLICY;
  }
  return DEFAULT_BLOG_POLICY;
}

export function isBlogLocaleIndexable(slug: string, locale: string): boolean {
  return getBlogLocalePolicy(slug).indexableLocales.includes(locale as BlogLocale);
}
