/**
 * Blog locale indexability policy.
 *
 * For the LATAM import-guide cluster (Paraguay, Argentina, Uruguay, Bolivia,
 * Chile), Spanish is the primary audience and English is kept as a secondary
 * indexable locale for cross-linking from the global site. Russian copy is
 * generated for site parity but not indexable for these guides, because
 * Meridian does not currently have a Russian-speaking LATAM buyer flow.
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

export function getBlogLocalePolicy(slug: string): BlogLocalePolicy {
  if (isLatamImportGuideSlug(slug)) {
    return LATAM_IMPORT_GUIDE_POLICY;
  }
  return DEFAULT_BLOG_POLICY;
}

export function isBlogLocaleIndexable(slug: string, locale: string): boolean {
  return getBlogLocalePolicy(slug).indexableLocales.includes(locale as BlogLocale);
}
