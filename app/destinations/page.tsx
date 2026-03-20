import Link from "next/link";
import { ArrowRight, MapPin, Clock, Anchor, MessageCircle, Ship, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { DestinationsGlobe } from "@/components/destinations-globe";
import { destinations } from "@/content/destinations";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Shipping Destinations — Worldwide Machinery Export",
  description:
    "We ship heavy machinery from the USA and Canada to any port worldwide — 40+ countries across Latin America, Middle East, Africa, Eastern Europe, and Central Asia.",
  path: "/destinations",
  keywords: [
    "machinery shipping destinations",
    "international equipment export routes",
    "heavy equipment shipping worldwide",
    "machinery export countries",
    "ocean freight destinations",
    "ship equipment overseas",
    "worldwide machinery shipping",
  ],
});

/**
 * Additional countries served beyond the 8 featured destination pages.
 * Derived from the 60+ ports in our freight calculator database.
 */
const ADDITIONAL_REGIONS = [
  {
    region: "Latin America & Caribbean",
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
    region: "Africa",
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
    region: "Europe & Central Asia",
    countries: ["Russia", "Ukraine", "Georgia", "Bulgaria"],
  },
  {
    region: "Asia & Oceania",
    countries: ["Australia", "South Korea", "China", "Hong Kong"],
  },
];

export default function DestinationsPage() {
  // Group destinations by region — same pattern as original page
  const regions = Array.from(new Set(destinations.map((d) => d.region)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
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

      <div className="pt-20">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Destinations" }]} />
        </div>

        {/* ─── Hero with Globe ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left — Text */}
              <div className="text-white">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-[1.1]">
                  We Ship to Any Port Worldwide
                </h1>
                <p className="mt-5 max-w-lg text-lg text-sky-300 leading-relaxed">
                  {COMPANY.name} exports machinery from the USA and Canada to
                  40+ countries across six continents. If it has a seaport, we
                  can get your equipment there.
                </p>

                {/* Stats row */}
                <div className="mt-8 flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="font-mono text-2xl font-bold tabular-nums text-white">500+</span>
                    <p className="mt-0.5 text-slate-400">Exports Completed</p>
                  </div>
                  <div>
                    <span className="font-mono text-2xl font-bold tabular-nums text-white">40+</span>
                    <p className="mt-0.5 text-slate-400">Countries Served</p>
                  </div>
                  <div>
                    <span className="font-mono text-2xl font-bold tabular-nums text-white">6</span>
                    <p className="mt-0.5 text-slate-400">Continents Reached</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    render={<Link href="/contact" />}
                    size="lg"
                    className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
                  >
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    render={
                      <a
                        href={CONTACT.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                      />
                    }
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-2 border-white/30 text-white bg-transparent hover:bg-white/10 font-semibold"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>

              {/* Right — Globe (desktop only) */}
              <div className="hidden lg:block">
                <DestinationsGlobe />
              </div>

              {/* Mobile: visual stats grid instead of heavy WebGL globe */}
              <div className="grid grid-cols-3 gap-3 lg:hidden">
                {[
                  { icon: Globe, label: "Any Port\nWorldwide", accent: "text-sky-400 bg-sky-500/15" },
                  { icon: Ship, label: "Weekly\nSailings", accent: "text-teal-400 bg-teal-500/15" },
                  { icon: MapPin, label: "40+ Countries\nServed", accent: "text-emerald-400 bg-emerald-500/15" },
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
            </div>
          </div>
        </section>

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
                                {dest.transitDays} days transit
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Ship className="h-3.5 w-3.5 text-primary" />
                                {dest.carriers.slice(0, 2).join(", ")}
                              </p>
                            </div>
                            <p className="mt-3 text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
                              View route details <ArrowRight className="h-3.5 w-3.5" />
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
                More Countries We Serve
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                The routes above have dedicated guides, but we regularly ship to
                every country listed below — and anywhere else with a seaport.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {ADDITIONAL_REGIONS.map((region) => (
                <div key={region.region}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {region.region}
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
              Don&apos;t see your country? We still ship there.{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Tell us where your equipment needs to go
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────────────────────── */}
        <ScrollReveal variant="fade">
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to Ship Your Equipment?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sky-300">
                Tell us the equipment type, location, and destination. You get
                a detailed, itemized quote within 24 hours — any country, any port.
              </p>
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  render={<Link href="/contact" />}
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
                >
                  Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  render={<Link href="/pricing/calculator" />}
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
                >
                  Try Freight Calculator
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
