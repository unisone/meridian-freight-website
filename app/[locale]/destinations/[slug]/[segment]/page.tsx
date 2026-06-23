import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LatamPaidSearchPage } from "@/components/destinations/latam-paid-search-page";
import {
  getPaidSearchDestination,
  getPaidSearchStaticParams,
} from "@/lib/latam-paid-search-routes";
import { SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string; segment: string }>;
}

// Only the curated combos are valid → any other param is a true 404 (not soft-200).
export const dynamicParams = false;

// es-only; the static argentina/ folder serves AR via its own branch.
export function generateStaticParams() {
  return getPaidSearchStaticParams().map((p) => ({ locale: "es", ...p }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, segment } = await params;
  const record = getPaidSearchDestination(locale, slug, segment);
  if (!record) return {};
  const canonical = `${SITE.url}${record.seo.canonicalPath}`;
  return {
    title: record.seo.title,
    description: record.seo.description,
    alternates: { canonical, languages: { es: canonical, "x-default": canonical } },
    openGraph: {
      type: "website",
      locale: getOgLocale("es"),
      url: canonical,
      title: record.seo.title,
      description: record.seo.description,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: record.seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: record.seo.title,
      description: record.seo.description,
      images: [SITE.ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug, segment } = await params;
  setRequestLocale(locale);
  const record = getPaidSearchDestination(locale, slug, segment);
  if (!record) notFound();
  return <LatamPaidSearchPage record={record} />;
}
