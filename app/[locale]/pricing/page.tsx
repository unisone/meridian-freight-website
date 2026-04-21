import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Calculator, ArrowRight, MessageCircle } from "lucide-react";
import { DarkCta } from "@/components/dark-cta";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { PricingTable } from "@/components/pricing-table";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT, COMPANY, SITE } from "@/lib/constants";
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
    title: t("pricingTitle"),
    description: t("pricingDescription"),
    keywords: [
      "equipment packing costs",
      "machinery shipping rates",
      "container loading pricing",
      "freight cost estimate",
      "how much to ship machinery overseas",
      "equipment export pricing no hidden fees",
      "machinery packing cost per unit",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/pricing`,
      languages: {
        en: `${SITE.url}/pricing`,
        es: `${SITE.url}/es/pricing`,
        ru: `${SITE.url}/ru/pricing`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("pricingTitle")} | ${SITE.name}`,
      description: t("pricingDescription"),
      url: `${SITE.url}${localePath}/pricing`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("pricingTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("pricingTitle")} | ${SITE.name}`,
      description: t("pricingDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("PricingPage");

  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    inLanguage: locale,
    priceCurrency: "USD",
    offerCount: 40,
    lowPrice: "1500",
    highPrice: "12000",
    description:
      "Reference pricing for machinery packing, container loading, and international shipping services.",
    seller: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PageHero
        variant="gradient"
        locale={locale}
        currentPath="/pricing"
        breadcrumbs={[{ label: t("breadcrumb") }]}
        eyebrow={t("eyebrow")}
        heading={
          <>{t.rich("heading", {
            accent: (chunks) => <span className="text-primary">{chunks}</span>,
          })}</>
        }
        description={t("description")}
      >
        <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkWarehouse")}</li>
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkCustoms")}</li>
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkPacking")}</li>
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkInland")}</li>
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkOcean")}</li>
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkAir")}</li>
          <li className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> {t("checkDrayage")}</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground/70">
          {t("ratesUpdated")}
        </p>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Calculator CTA */}
          <ScrollReveal variant="fade">
          <div className="mb-12 rounded-xl bg-primary/5 p-6 text-center shadow-sm sm:p-8">
            <Calculator className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-xl font-bold text-foreground">
              {t("calcHeading")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("calcDescription")}
            </p>
            <Button render={<Link href="/pricing/calculator" />} className="mt-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
                {t("openFreightCalculator")}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          </ScrollReveal>

          <PricingTable />

          {/* Bottom CTA */}
          <ScrollReveal variant="fade">
            <DarkCta variant="card" className="mt-16" heading={t("ctaHeading")} description={t("ctaDescription")}>
              <Button
                render={<a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent("Hi! I was looking at your freight pricing. I'd like to get a quote.")}`} target="_blank" rel="noopener noreferrer" aria-label={t("chatOnWhatsAppAriaLabel")} />}
                size="lg"
                className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t("chatOnWhatsApp")}
              </Button>
              <Button
                render={<Link href="/contact" />}
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
              >
                {t("contactUs")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DarkCta>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
