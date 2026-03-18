import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

/**
 * Build page-specific metadata with proper OG tags and canonical URL.
 * Use this in every page's `metadata` export to ensure consistent SEO.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${opts.title} | ${SITE.name}`,
      description: opts.description,
      url,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: opts.title }],
    },
  };
}
