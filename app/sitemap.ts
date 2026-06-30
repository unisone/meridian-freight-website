import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAllServices } from "@/content/services";
import { getAllEquipmentTypes } from "@/content/equipment";
import { getAllDestinations } from "@/content/destinations";
import { LATAM_PAID_SEARCH_DESTINATIONS } from "@/content/latam-paid-search-destinations";
import { getAllBlogPosts } from "@/content/blog";
import {
  isLatamMarketSlug,
  latamMarketPages,
  getLatamMarketPage,
} from "@/content/latam-market-pages";
import { getBlogLocalePolicy } from "@/lib/blog-locale-policy";

type Locale = "en" | "es" | "ru";

/** locale URL prefix under `localePrefix: "as-needed"` (default `en` is unprefixed). */
const PREFIX: Record<Locale, string> = { en: "", es: "/es", ru: "/ru" };

/** Pages whose content models carry no date field exist in all three locales. */
const TRILOCALE: Locale[] = ["en", "es", "ru"];

/**
 * Hand-maintained content date for pages whose content models carry no real
 * date field (static pages, services, equipment, generic destinations, the
 * Argentina hub). Replaces build-time `new Date()` so `lastmod` no longer
 * churns on every deploy — Google distrusts a `lastmod` that changes with no
 * content change. Bump this when that content materially changes.
 */
const STATIC_CONTENT_LASTMOD = new Date("2026-06-25");

/** Absolute URL for a locale + locale-neutral path (`""` = home). */
const abs = (locale: Locale, path: string) => `${SITE.url}${PREFIX[locale]}${path}`;

/**
 * Emit one reciprocal `<loc>` entry per locale for a single logical page.
 *
 * `path` is ALWAYS locale-neutral (no `/es` or `/ru` prefix; `""` for home).
 * Every emitted entry shares ONE `languages` cluster — the full set of emitted
 * locales plus `x-default` — which guarantees hreflang reciprocity (each URL in
 * a language group lists the whole group, including itself, per Google's
 * sitemap-hreflang contract).
 *
 * `locales` must list only the locales that return 200 directly AND are
 * index-eligible for this page (so we never advertise a redirecting, 404, or
 * robots-noindex variant).
 */
function localeGroup(opts: {
  path: string;
  locales: Locale[];
  xDefault: Locale;
  lastModified: Date;
}): MetadataRoute.Sitemap {
  const { path, locales, xDefault, lastModified } = opts;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((locale) => [locale, abs(locale, path)]),
  );
  languages["x-default"] = abs(xDefault, path);
  return locales.map((locale) => ({
    url: abs(locale, path),
    lastModified,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages (same content translated across all three locales) ──────────
  const staticPaths = [
    "", // home
    "/about",
    "/services",
    "/equipment",
    "/projects",
    "/destinations",
    "/pricing",
    "/pricing/calculator",
    "/schedule",
    "/faq",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
  ];
  const staticPages: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    localeGroup({ path, locales: TRILOCALE, xDefault: "en", lastModified: STATIC_CONTENT_LASTMOD }),
  );

  // Argentina is a Spanish-only buyer hub (EN/RU 308 → ES); no EN/RU loc exists.
  const argentinaHub: MetadataRoute.Sitemap = localeGroup({
    path: "/destinations/argentina",
    locales: ["es"],
    xDefault: "es",
    lastModified: STATIC_CONTENT_LASTMOD,
  });

  // ── Services / equipment (same content translated) ───────────────────────────
  const servicePages: MetadataRoute.Sitemap = getAllServices("en").flatMap((s) =>
    localeGroup({
      path: `/services/${s.slug}`,
      locales: TRILOCALE,
      xDefault: "en",
      lastModified: STATIC_CONTENT_LASTMOD,
    }),
  );

  const equipmentPages: MetadataRoute.Sitemap = getAllEquipmentTypes("en").flatMap((e) =>
    localeGroup({
      path: `/equipment/${e.slug}`,
      locales: TRILOCALE,
      xDefault: "en",
      lastModified: STATIC_CONTENT_LASTMOD,
    }),
  );

  // ── Generic destination fact-sheets ─────────────────────────────────────────
  // LATAM market slugs deliberately OMIT `es`: for those, `/es/destinations/{slug}`
  // is a DISTINCT Spanish buyer hub (the latamMarketSitemapPages entry below), not
  // a translation of this generic logistics page — so the two must NOT cross-link.
  const destinationPages: MetadataRoute.Sitemap = getAllDestinations("en").flatMap((d) =>
    localeGroup({
      path: `/destinations/${d.slug}`,
      locales: isLatamMarketSlug(d.slug) ? ["en", "ru"] : TRILOCALE,
      xDefault: "en",
      lastModified: STATIC_CONTENT_LASTMOD,
    }),
  );

  // ── Spanish buyer hubs (distinct ES-only pages, real content dates) ──────────
  // Derive the path from `slug`, NOT `page.path` (already `/es`-prefixed → would
  // double-prefix to `/es/es/...`).
  const latamMarketSitemapPages: MetadataRoute.Sitemap = latamMarketPages.flatMap((page) =>
    localeGroup({
      path: `/destinations/${page.slug}`,
      locales: ["es"],
      xDefault: "es",
      lastModified: new Date(page.schema.dateModified),
    }),
  );

  // ── es-only paid-search destination LPs (canonical, indexable) ───────────────
  // `canonicalPath` is already `/es`-prefixed → strip it to the locale-neutral
  // path. Borrow the parent market hub's real date when the country is a market
  // slug (bolivia/paraguay/chile/uruguay); Argentina has none → static date.
  const paidSearchSitemapPages: MetadataRoute.Sitemap = LATAM_PAID_SEARCH_DESTINATIONS.flatMap(
    (d) => {
      const path = d.seo.canonicalPath.replace(/^\/es/, "");
      const marketPage = isLatamMarketSlug(d.country.slug)
        ? getLatamMarketPage(d.country.slug)
        : undefined;
      const lastModified = marketPage
        ? new Date(marketPage.schema.dateModified)
        : STATIC_CONTENT_LASTMOD;
      return localeGroup({ path, locales: ["es"], xDefault: "es", lastModified });
    },
  );

  // ── Blog posts (per-post indexability policy) ────────────────────────────────
  // `indexableLocales` excludes the robots-noindex RU LATAM import-guides, so we
  // never sitemap a noindex page. `xDefault` comes from the post's policy.
  // Union of all per-locale post lists, deduped by slug, so es-only / ru-only posts
  // are not silently excluded. Before this, blog URLs were sourced from the EN list
  // only, which dropped the ES-only import pillar `importar-maquinaria-agricola-usa`
  // (no EN counterpart) from the sitemap entirely — a root cause of it being "unknown
  // to Google". Per-post `indexableLocales` policy still decides which locale URLs emit.
  const allBlogPosts = [
    ...getAllBlogPosts("en"),
    ...getAllBlogPosts("es"),
    ...getAllBlogPosts("ru"),
  ];
  const seenBlogSlugs = new Set<string>();
  const blogPages: MetadataRoute.Sitemap = allBlogPosts.flatMap((p) => {
    if (seenBlogSlugs.has(p.slug)) return [];
    seenBlogSlugs.add(p.slug);
    const policy = getBlogLocalePolicy(p.slug);
    return localeGroup({
      path: `/blog/${p.slug}`,
      locales: policy.indexableLocales as Locale[],
      xDefault: policy.xDefaultLocale,
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
    });
  });

  return [
    ...staticPages,
    ...argentinaHub,
    ...servicePages,
    ...equipmentPages,
    ...destinationPages,
    ...latamMarketSitemapPages,
    ...paidSearchSitemapPages,
    ...blogPages,
  ];
}
