import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CalculatorV3Wizard } from "@/components/freight-calculator-v3/calculator-v3-wizard";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

function normalizeLocale(locale: string): "en" | "es" | "ru" {
  return locale === "es" || locale === "ru" ? locale : "en";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({
    locale: normalizedLocale,
    namespace: "Metadata",
  });
  const localePath = normalizedLocale === "en" ? "" : `/${normalizedLocale}`;

  return {
    title: t("calculatorTitle"),
    description: t("calculatorDescription"),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    alternates: {
      canonical: `${SITE.url}${localePath}/pricing/calculator-v3`,
      languages: {
        en: `${SITE.url}/pricing/calculator-v3`,
        es: `${SITE.url}/es/pricing/calculator-v3`,
        ru: `${SITE.url}/ru/pricing/calculator-v3`,
      },
    },
    openGraph: {
      locale: getOgLocale(normalizedLocale),
      title: `${t("calculatorTitle")} | ${SITE.name}`,
      description: t("calculatorDescription"),
      url: `${SITE.url}${localePath}/pricing/calculator-v3`,
      images: [
        {
          url: SITE.ogImage,
          width: 1200,
          height: 630,
          alt: t("calculatorTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("calculatorTitle")} | ${SITE.name}`,
      description: t("calculatorDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function CalculatorV3Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  setRequestLocale(normalizedLocale);
  const t = await getTranslations({
    locale: normalizedLocale,
    namespace: "CalculatorPage",
  });

  return (
    <>
      <PageHero
        variant="gradient"
        locale={normalizedLocale}
        currentPath="/pricing/calculator-v3"
        breadcrumbs={[
          { label: t("breadcrumbPricing"), href: "/pricing" },
          { label: t("breadcrumbCalculator") },
        ]}
        eyebrow={t("eyebrow")}
        heading={
          <>
            {t.rich("heading", {
              accent: (chunks) => <span className="text-primary">{chunks}</span>,
            })}
          </>
        }
        description={t("description")}
      />

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CalculatorV3Wizard locale={normalizedLocale} />
        </div>
      </section>
    </>
  );
}
