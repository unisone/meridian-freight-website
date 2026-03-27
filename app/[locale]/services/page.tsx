import type { Metadata } from "next";
import { ServicesGrid } from "@/components/services-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProcessSteps } from "@/components/process-steps";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DarkCta } from "@/components/dark-cta";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllServices } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("servicesTitle"),
    description: t("servicesDescription"),
    keywords: [
      "machinery export services USA",
      "equipment dismantling for shipping",
      "container loading services",
      "export documentation compliance",
      "equipment warehousing USA Canada",
      "door to port machinery shipping",
      "heavy equipment packing company",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/services`,
      languages: {
        en: `${SITE.url}/services`,
        es: `${SITE.url}/es/services`,
        ru: `${SITE.url}/ru/services`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("servicesTitle")} | ${SITE.name}`,
      description: t("servicesDescription"),
      url: `${SITE.url}${localePath}/services`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("servicesTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("servicesTitle")} | ${SITE.name}`,
      description: t("servicesDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const services = getAllServices(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: locale,
    name: t("heading"),
    description: t("description"),
    numberOfItems: services.length,
    itemListElement: services.map((s, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: s.title,
      url: `${SITE.url}/services/${s.slug}`,
    })),
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">{t("heading")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("description")}</p>
      </div>
      <ServicesGrid />
      <ProcessSteps />

      {/* CTA */}
      <ScrollReveal variant="fade">
        <DarkCta heading={t("ctaHeading")} description={t("ctaDescription")}>
          <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
            {t("ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DarkCta>
      </ScrollReveal>
    </div>
    </>
  );
}
