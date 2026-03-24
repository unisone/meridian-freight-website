import type { Metadata } from "next";
import { ServicesGrid } from "@/components/services-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProcessSteps } from "@/components/process-steps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SITE } from "@/lib/constants";
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
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  return (
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
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("ctaHeading")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sky-300">
            {t("ctaDescription")}
          </p>
          <Button render={<Link href="/contact" />} size="lg" className="mt-6 h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
              {t("ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}
