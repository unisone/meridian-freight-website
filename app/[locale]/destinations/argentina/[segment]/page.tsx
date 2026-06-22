import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LatamPaidSearchPage } from "@/components/destinations/latam-paid-search-page";
import {
  getArgentinaPaidSearchStaticParams,
  getPaidSearchDestination,
} from "@/lib/latam-paid-search-routes";
import { SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

// Argentina is a STATIC folder, so its paid-search children live here rather
// than under the dynamic [slug]/[segment] route (which the static folder shadows).
interface PageProps {
  params: Promise<{ locale: string; segment: string }>;
}

// Only the 2 Argentina combos are valid → any other segment is a true 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getArgentinaPaidSearchStaticParams().map((p) => ({ locale: "es", ...p }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, segment } = await params;
  const record = getPaidSearchDestination(locale, "argentina", segment);
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
  const { locale, segment } = await params;
  // es-only: mirror the existing argentina/page.tsx redirect guard.
  if (locale !== "es") permanentRedirect(`/es/destinations/argentina/${segment}`);
  setRequestLocale(locale);
  const record = getPaidSearchDestination("es", "argentina", segment);
  if (!record) notFound();
  return <LatamPaidSearchPage record={record} />;
}
