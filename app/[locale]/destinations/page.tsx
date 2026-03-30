import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin, Clock, Anchor, MessageCircle, Ship, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { DestinationsGlobe } from "@/components/destinations-globe";
import { DarkCta } from "@/components/dark-cta";
import { getAllDestinations } from "@/content/destinations";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";
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
    title: t("destinationsTitle"),
    description: t("destinationsDescription"),
    keywords: [
      "machinery shipping destinations",
      "international equipment export routes",
      "heavy equipment shipping worldwide",
      "machinery export countries",
      "ocean freight destinations",
      "ship equipment overseas",
      "worldwide machinery shipping",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/destinations`,
      languages: {
        en: `${SITE.url}/destinations`,
        es: `${SITE.url}/es/destinations`,
        ru: `${SITE.url}/ru/destinations`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("destinationsTitle")} | ${SITE.name}`,
      description: t("destinationsDescription"),
      url: `${SITE.url}${localePath}/destinations`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("destinationsTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("destinationsTitle")} | ${SITE.name}`,
      description: t("destinationsDescription"),
      images: [SITE.ogImage],
    },
  };
}

/**
 * Additional countries served beyond the 8 featured destination pages.
 * Derived from the 60+ ports in our freight calculator database.
 * Region keys map to translation keys in DestinationsPage namespace.
 */
const ADDITIONAL_REGIONS = [
  {
    regionKey: "regionLatinAmerica" as const,
    countries: [
      "Argentina",
      "Chile",
      "Peru",
      "Ecuador",
      "Uruguay",
      "Paraguay",
      "Bolivia",
      "Panama",
      "Costa Rica",
      "Guatemala",
      "Honduras",
      "El Salvador",
      "Nicaragua",
      "Dominican Republic",
      "Haiti",
      "Cuba",
      "Jamaica",
      "Trinidad & Tobago",
      "Bahamas",
      "Barbados",
      "Venezuela",
      "Guyana",
      "Suriname",
      "Belize",
      "Puerto Rico",
    ],
  },
  {
    regionKey: "regionAfrica" as const,
    countries: [
      "South Africa",
      "Kenya",
      "Tanzania",
      "Ghana",
      "Nigeria",
      "Senegal",
      "Egypt",
      "Algeria",
      "Morocco",
      "Tunisia",
      "Angola",
      "Mozambique",
      "Cameroon",
      "Ivory Coast",
      "Namibia",
      "Djibouti",
      "Madagascar",
      "Congo (DRC)",
      "Sudan",
      "Libya",
      "Mauritius",
    ],
  },
  {
    regionKey: "regionEuropeCentralAsia" as const,
    countries: ["Russia", "Ukraine", "Georgia", "Bulgaria"],
  },
  {
    regionKey: "regionAsiaOceania" as const,
    countries: ["Australia", "South Korea", "China", "Hong Kong"],
  },
];

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("DestinationsPage");
  const destinations = getAllDestinations(locale);
  // Group destinations by region — same pattern as original page
  const regions = Array.from(new Set(destinations.map((d) => d.region)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: locale,
    name: "Machinery Shipping Destinations",
    description:
      "Countries and ports served by Meridian Freight for machinery export from the USA and Canada.",
    numberOfItems: destinations.length,
    itemListElement: destinations.map((d, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `Ship Machinery to ${d.country}`,
      url: `${SITE.url}/destinations/${d.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        variant="dark"
        breadcrumbs={[{ label: t("breadcrumb") }]}
        eyebrow={t("eyebrow")}
        heading={t("heroHeading")}
        description={t("heroDescription", { company: COMPANY.name })}
        rightContent={
          <>
            {/* Right — Globe (desktop only) */}
            <div className="hidden lg:block">
              <DestinationsGlobe />
            </div>

            {/* Mobile: visual stats grid instead of heavy WebGL globe */}
            <div className="grid grid-cols-3 gap-3 lg:hidden">
              {[
                { icon: Globe, label: t("mobileAnyPort"), accent: "text-sky-400 bg-sky-500/15" },
                { icon: Ship, label: t("mobileWeeklySailings"), accent: "text-teal-400 bg-teal-500/15" },
                { icon: MapPin, label: t("mobileCountriesServed"), accent: "text-emerald-400 bg-emerald-500/15" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 text-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.accent}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-300 whitespace-pre-line leading-tight">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </>
        }
      >
        {/* Stats row */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="font-mono text-2xl font-bold tabular-nums text-white">1,000+</span>
            <p className="mt-0.5 text-slate-400">{t("exportsCompleted")}</p>
          </div>
          <div>
            <span className="font-mono text-2xl font-bold tabular-nums text-white">40+</span>
            <p className="mt-0.5 text-slate-400">{t("countriesServed")}</p>
          </div>
          <div>
            <span className="font-mono text-2xl font-bold tabular-nums text-white">6</span>
            <p className="mt-0.5 text-slate-400">{t("continentsReached")}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            render={<Link href="/contact" />}
            size="lg"
            className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
          >
            {t("getAQuote")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            render={
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("chatOnWhatsAppAriaLabel")}
              />
            }
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-xl border-2 border-white/30 text-white bg-transparent hover:bg-white/10 font-semibold"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("chatOnWhatsApp")}
          </Button>
        </div>
      </PageHero>

      <div>
        {/* ─── Destination Cards by Region (matches original site pattern) ── */}
        {regions.map((region) => {
          const regionDests = destinations.filter((d) => d.region === region);
          return (
            <section key={region} className="py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {region}
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {regionDests.map((dest, idx) => (
                    <StaggerItem key={dest.slug} index={idx}>
                      <Link href={`/destinations/${dest.slug}`} className="group">
                        <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground leading-snug">
                              {dest.country}
                            </h3>
                            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                              <p className="flex items-center gap-1.5">
                                <Anchor className="h-3.5 w-3.5 text-primary" />
                                {dest.port}
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                {t("daysTransit", { days: dest.transitDays })}
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Ship className="h-3.5 w-3.5 text-primary" />
                                {dest.carriers.slice(0, 2).join(", ")}
                              </p>
                            </div>
                            <p className="mt-3 text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
                              {t("viewRouteDetails")} <ArrowRight className="h-3.5 w-3.5" />
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* ─── We Ship Worldwide ───────────────────────────────────────── */}
        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {t("moreCountriesHeading")}
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {t("moreCountriesDescription")}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {ADDITIONAL_REGIONS.map((region) => (
                <div key={region.regionKey}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {t(region.regionKey)}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {region.countries.map((country) => (
                      <Badge
                        key={country}
                        variant="secondary"
                        className="text-xs font-normal px-2.5 py-1"
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-muted-foreground">
              {t("dontSeeCountry")}{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                {t("tellUsDestination")}
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────────────────────── */}
        <ScrollReveal variant="fade">
          <DarkCta heading={t("ctaHeading")} description={t("ctaDescription")}>
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
            >
              {t("getAQuote")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/pricing/calculator" />}
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
            >
              {t("tryFreightCalculator")}
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
