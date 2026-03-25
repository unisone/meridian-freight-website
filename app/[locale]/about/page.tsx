import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight, Clock, Globe, Shield, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { COMPANY, CONTACT, SITE, STATS, WAREHOUSE_MAIN, WAREHOUSE_PARTNERS } from "@/lib/constants";
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
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    keywords: [
      "machinery export company",
      "equipment logistics USA Canada",
      "warehouse storage services",
      "about meridian freight",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/about`,
      languages: {
        en: `${SITE.url}/about`,
        es: `${SITE.url}/es/about`,
        ru: `${SITE.url}/ru/about`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("aboutTitle")} | ${SITE.name}`,
      description: t("aboutDescription"),
      url: `${SITE.url}${localePath}/about`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("aboutTitle") }],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const tc = await getTranslations("Common");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    inLanguage: locale,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: SITE.url,
    logo: `${SITE.url}/logos/MF Logos White/meridianFreight-logo-w-500.png`,
    description: COMPANY.description,
    foundingDate: `${COMPANY.foundedYear}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.state,
      postalCode: CONTACT.address.zip,
      addressCountry: CONTACT.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneRaw,
      contactType: "customer service",
      availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
    },
  };

  const differentiators = [
    {
      icon: Shield,
      title: t("diff1Title"),
      description: t("diff1Description"),
    },
    {
      icon: Globe,
      title: t("diff2Title"),
      description: t("diff2Description"),
    },
    {
      icon: Clock,
      title: t("diff3Title"),
      description: t("diff3Description", { years: STATS.yearsExperience }),
    },
  ];

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("heading", { company: COMPANY.name })}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {t("intro1", { year: COMPANY.foundedYear, count: STATS.projectsCompleted })}
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {t("intro2")}
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("whyChooseUs")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {differentiators.map((d, idx) => (
              <StaggerItem key={d.title} index={idx}><Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                </CardContent>
              </Card></StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse locations */}
      <ScrollReveal>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("whereWeOperate")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("operateDescription")}
          </p>

          {/* Main facility */}
          <div className="mt-8 rounded-xl bg-primary/5 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {WAREHOUSE_MAIN.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {WAREHOUSE_MAIN.description}
                </div>
              </div>
            </div>
          </div>

          {/* Partner locations */}
          <p className="mt-6 text-sm font-medium text-slate-500 uppercase tracking-wider">
            {t("partnerFacilities")}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WAREHOUSE_PARTNERS.map((loc) => (
              <div
                key={loc.state}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{loc.name}</div>
                  <div className="text-sm text-muted-foreground">{loc.state}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal variant="fade">
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("ctaHeading")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t("ctaDescription")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={tc("chatOnWhatsApp")} />} size="lg" className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                {tc("chatOnWhatsApp")}
            </Button>
            <Button render={<Link href="/contact" />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-border text-foreground font-semibold">
                {tc("contactUs")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      </ScrollReveal>
    </div>
    </>
  );
}
