import type { Metadata } from "next";
import type { LatamMarketPageContent } from "@/content/latam-market-pages";
import { SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

export function buildLatamMarketMetadata(page: LatamMarketPageContent): Metadata {
  const canonical = `${SITE.url}${page.path}`;
  const heroImageUrl = `${SITE.url}${page.hero.image.src}`;

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: {
      canonical,
      languages: {
        es: canonical,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      locale: getOgLocale("es"),
      title: `${page.seo.title} | ${SITE.name}`,
      description: page.seo.description,
      url: canonical,
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 900,
          alt: page.hero.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.seo.title} | ${SITE.name}`,
      description: page.seo.description,
      images: [heroImageUrl],
    },
  };
}
