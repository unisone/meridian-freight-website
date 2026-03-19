import Link from "next/link";
import { ArrowRight, MapPin, Clock, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { destinations } from "@/content/destinations";
import { SITE, COMPANY } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Shipping Destinations — Worldwide Machinery Export",
  description:
    "We ship heavy machinery from the USA and Canada to 30+ countries — Latin America, Middle East, Eastern Europe, Central Asia. See routes, ports, and transit times.",
  path: "/destinations",
  keywords: [
    "machinery shipping destinations",
    "international equipment export routes",
    "heavy equipment shipping worldwide",
    "machinery export countries",
    "ocean freight destinations",
    "ship equipment overseas",
  ],
});

export default function DestinationsPage() {
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

  // Group destinations by region for display
  const regions = Array.from(new Set(destinations.map((d) => d.region)));

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

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Where We Ship
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
              {COMPANY.name} exports machinery from the USA and Canada to 30+ countries
              across Latin America, the Middle East, Eastern Europe, and Central Asia.
              Every shipment includes professional packing, documentation, and door-to-port
              logistics.
            </p>
          </div>
        </section>

        {/* Destination Cards by Region */}
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

        {/* CTA */}
        <ScrollReveal variant="fade">
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Don&apos;t See Your Destination?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sky-300">
                We ship to 30+ countries worldwide. Tell us where your equipment needs
                to go and we will put together a complete quote within 24 hours.
              </p>
              <Button render={<Link href="/contact" />} size="lg" className="mt-6 h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
