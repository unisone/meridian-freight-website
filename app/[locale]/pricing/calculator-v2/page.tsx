import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ArgentinaGuideCallout } from "@/components/argentina-guide-callout";
import { CalculatorWizard } from "@/components/freight-calculator/calculator-wizard";
import { COMPANY, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: `V2 Rollback - ${t("calculatorTitle")}`,
    description: t("calculatorDescription"),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    keywords: [
      "freight cost calculator heavy equipment",
      "machinery shipping cost estimator",
      "container loading cost calculator",
      "equipment export shipping rates",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/pricing/calculator-v2`,
      languages: {
        en: `${SITE.url}/pricing/calculator-v2`,
        es: `${SITE.url}/es/pricing/calculator-v2`,
        ru: `${SITE.url}/ru/pricing/calculator-v2`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `V2 Rollback - ${t("calculatorTitle")} | ${SITE.name}`,
      description: t("calculatorDescription"),
      url: `${SITE.url}${localePath}/pricing/calculator-v2`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("calculatorTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `V2 Rollback - ${t("calculatorTitle")} | ${SITE.name}`,
      description: t("calculatorDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const calculatorJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    inLanguage: locale,
    name: "Freight Cost Calculator",
    description: "Free online calculator for estimating machinery export costs including inland freight, packing, and ocean shipping.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  const t = await getTranslations("CalculatorPage");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
      />
      <PageHero
        variant="gradient"
        breadcrumbs={[
          { label: t("breadcrumbPricing"), href: "/pricing" },
          { label: t("breadcrumbCalculator") },
        ]}
        eyebrow={t("eyebrow")}
        heading={
          <>{t.rich("heading", {
            accent: (chunks) => <span className="text-primary">{chunks}</span>,
          })}</>
        }
        description={t("description")}
      />

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ArgentinaGuideCallout
            locale={locale}
            className="mb-8"
            title="Compradores de Argentina: usen la calculadora como apoyo, no como costo final"
            description="La calculadora ayuda a estimar el tramo logístico que Meridian controla. Para una compra seria hacia Argentina, compleméntela con nuestra guia sobre alcance puerta a puerto, AFIDI/SENASA y costos que quedan del lado local."
          />
          <CalculatorWizard />
        </div>
      </section>
    </>
  );
}
