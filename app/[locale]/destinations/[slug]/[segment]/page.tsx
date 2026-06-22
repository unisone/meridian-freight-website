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
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: getOgLocale("es"),
      url: canonical,
      title: record.seo.title,
      description: record.seo.description,
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
