import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle,
  Ship,
  Clock,
  Anchor,
  Box,
  FileText,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { getDestinationBySlug, getAllDestinations } from "@/content/destinations";
import { getAllEquipmentTypes } from "@/content/equipment";
import { FaqAccordion } from "@/components/faq-accordion";
import { DarkCta } from "@/components/dark-cta";
import { KazakhstanMarketPage } from "@/components/destinations/kazakhstan-market-page";
import { KAZAKHSTAN_PATH, kazakhstanMarketPage } from "@/content/kazakhstan-market";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";
import { getOgLocale, toBCP47 } from "@/lib/i18n-utils";
import { fetchScheduleContainersWithBookingData } from "@/lib/supabase-containers";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const revalidate = 900; // Keep the Kazakhstan lane board aligned with the public schedule.

function getEquipmentSlug(name: string, locale: string): string | null {
  const types = getAllEquipmentTypes(locale);
  const match = types.find(
    (e) => e.pluralName.toLowerCase() === name.toLowerCase()
  );
  return match ? match.slug : null;
}

export function generateStaticParams() {
  return getAllDestinations('en').map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale === "ru" && slug === "kazakhstan") {
    return {
      title: kazakhstanMarketPage.seo.title,
      description: kazakhstanMarketPage.seo.description,
      keywords: kazakhstanMarketPage.seo.keywords,
      alternates: {
        canonical: `${SITE.url}${KAZAKHSTAN_PATH}`,
        languages: {
          en: `${SITE.url}/destinations/kazakhstan`,
          es: `${SITE.url}/es/destinations/kazakhstan`,
          ru: `${SITE.url}${KAZAKHSTAN_PATH}`,
        },
      },
      openGraph: {
        locale: getOgLocale(locale),
        title: `${kazakhstanMarketPage.seo.title} | ${SITE.name}`,
        description: kazakhstanMarketPage.seo.description,
        url: `${SITE.url}${KAZAKHSTAN_PATH}`,
        images: [
          {
            url: SITE.ogImage,
            width: 1200,
            height: 630,
            alt: kazakhstanMarketPage.seo.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${kazakhstanMarketPage.seo.title} | ${SITE.name}`,
        description: kazakhstanMarketPage.seo.description,
        images: [SITE.ogImage],
      },
    };
  }

  const dest = getDestinationBySlug(slug, locale);
  if (!dest) return {};
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: dest.metaTitle,
    description: dest.metaDescription,
    keywords: dest.keywords,
    alternates: {
      canonical: `${SITE.url}${localePath}/destinations/${slug}`,
      languages: {
        en: `${SITE.url}/destinations/${slug}`,
        es: `${SITE.url}/es/destinations/${slug}`,
        ru: `${SITE.url}/ru/destinations/${slug}`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${dest.metaTitle} | ${SITE.name}`,
      description: dest.metaDescription,
      url: `${SITE.url}${localePath}/destinations/${slug}`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: dest.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dest.metaTitle} | ${SITE.name}`,
      description: dest.metaDescription,
      images: [SITE.ogImage],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (locale === "ru" && slug === "kazakhstan") {
    const containers = await fetchScheduleContainersWithBookingData();
    return <KazakhstanMarketPage containers={containers} />;
  }

  const td = await getTranslations("DestinationDetailPage");
  const dest = getDestinationBySlug(slug, locale);
  if (!dest) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    inLanguage: toBCP47(locale),
    name: `Machinery Shipping to ${dest.country}`,
    description: dest.heroDescription,
    image: `${SITE.url}${SITE.ogImage}`,
    availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
    priceRange: "Contact for quote",
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
    areaServed: {
      "@type": "Country",
      name: dest.country,
    },
    url: `${SITE.url}/destinations/${slug}`,
  };

  const routeDetails = [
    { icon: Clock, label: td("transitTime"), value: td("days", { count: dest.transitDays }) },
    { icon: Anchor, label: td("destinationPort"), value: dest.port },
    { icon: Ship, label: td("carriers"), value: dest.carriers.join(", ") },
    { icon: Box, label: td("containerOptions"), value: dest.containerOptions.join(", ") },
  ];

  const processSteps = [
    {
      step: "1",
      title: td("step1Title"),
      description: td("step1Description"),
    },
    {
      step: "2",
      title: td("step2Title"),
      description: td("step2Description"),
    },
    {
      step: "3",
      title: td("step3Title"),
      description: td("step3DescriptionTemplate", { port: dest.port }),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {dest.faqs && dest.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: toBCP47(locale),
            mainEntity: dest.faqs.map((e) => ({
              "@type": "Question",
              name: e.question,
              acceptedAnswer: { "@type": "Answer", text: e.answer },
            })),
          })}}
        />
      )}

      <PageHero
        variant="dark"
        locale={locale}
        currentPath={`/destinations/${slug}`}
        breadcrumbs={[
          { label: "Destinations", href: "/destinations" },
          { label: dest.country },
        ]}
        eyebrow={td("eyebrow")}
        heading={td("heroHeading", { country: dest.country })}
        description={dest.heroDescription}
        icon={Ship}
      >
        <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
          {td("getAQuote")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </PageHero>

      <div>
        {/* Route Details */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {td("routeDetails")}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {routeDetails.map((detail, idx) => {
                const DetailIcon = detail.icon;
                return (
                  <StaggerItem key={detail.label} index={idx}>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <DetailIcon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="mt-1 text-base font-bold text-foreground leading-snug">
                          {detail.value}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </div>
          </div>
        </section>

        {/* Equipment We Ship */}
        {dest.commonEquipment.length > 0 && (
          <section className="bg-muted py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {td("equipmentWeShipTo", { country: dest.country })}
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {dest.commonEquipment.map((type, idx) => {
                  const eqSlug = getEquipmentSlug(type, locale);
                  const badge = (
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {type}
                    </Badge>
                  );
                  return (
                    <StaggerItem key={type} index={idx} variant="fade" className="inline-block">
                      {eqSlug ? (
                        <Link href={`/equipment/${eqSlug}`} className="transition-opacity hover:opacity-80">
                          {badge}
                        </Link>
                      ) : badge}
                    </StaggerItem>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* What You Need to Know */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {td("whatYouNeedToKnow")}
              </h2>
            </div>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {dest.shippingNotes}
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {td("howItWorks")}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {processSteps.map((step, idx) => (
                <StaggerItem key={step.step} index={idx}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-bold text-foreground leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {dest.faqs && dest.faqs.length > 0 && (
          <FaqAccordion entries={dest.faqs} />
        )}

        {/* CTA */}
        <ScrollReveal variant="fade">
          <DarkCta
            heading={td("readyToShipTo", { country: dest.country })}
            description={td.rich("ctaDescription", {
              calculatorLink: (chunks) => (
                <Link href="/pricing/calculator" className="underline hover:text-white transition-colors">
                  {chunks}
                </Link>
              ),
            })}
          >
            <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
              {td("getAQuote")}
            </Button>
            <Button render={<a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi! I'm interested in shipping machinery to ${dest.country}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={td("chatOnWhatsApp")} />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
              <Phone className="mr-2 h-4 w-4" /> {td("chatOnWhatsApp")}
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
