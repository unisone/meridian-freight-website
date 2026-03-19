import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { destinations, getDestinationBySlug } from "@/content/destinations";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return {};

  return {
    title: dest.metaTitle,
    description: dest.metaDescription,
    keywords: dest.keywords,
    alternates: { canonical: `${SITE.url}/destinations/${slug}` },
    openGraph: {
      title: `${dest.metaTitle} | ${SITE.name}`,
      description: dest.metaDescription,
      url: `${SITE.url}/destinations/${slug}`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: dest.metaTitle }],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
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
    { icon: Clock, label: "Transit Time", value: `${dest.transitDays} days` },
    { icon: Anchor, label: "Destination Port", value: dest.port },
    { icon: Ship, label: "Carriers", value: dest.carriers.join(", ") },
    { icon: Box, label: "Container Options", value: dest.containerOptions.join(", ") },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Get a Quote",
      description: "Send us your equipment details and destination. You receive a line-by-line quote within 24 hours.",
    },
    {
      step: "2",
      title: "We Pack & Load",
      description: "Our team dismantles, labels, and packs your machinery into secure containers at our facility.",
    },
    {
      step: "3",
      title: "Ship & Track",
      description: `Your shipment sails to ${dest.port} with full documentation. You get tracking updates until delivery.`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-20">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Destinations", href: "/destinations" },
              { label: dest.country },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Ship className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ship Machinery to {dest.country}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
              {dest.heroDescription}
            </p>
            <Button render={<Link href="/contact" />} size="lg" className="mt-8 h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
              Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Route Details */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Route Details
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
                Equipment We Ship to {dest.country}
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {dest.commonEquipment.map((type, idx) => (
                  <StaggerItem key={type} index={idx} variant="fade" className="inline-block">
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {type}
                    </Badge>
                  </StaggerItem>
                ))}
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
                What You Need to Know
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
              How It Works
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

        {/* CTA */}
        <ScrollReveal variant="fade">
          <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to Ship to {dest.country}?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sky-300">
                Get a free quote within 24 hours, or{" "}
                <Link href="/pricing/calculator" className="underline hover:text-white transition-colors">
                  try our instant calculator
                </Link>{" "}
                for a cost estimate right now.
              </p>
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
                  Get a Quote
                </Button>
                <Button render={<a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi! I'm interested in shipping machinery to ${dest.country}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Chat on WhatsApp about shipping to ${dest.country}`} />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
                  <Phone className="mr-2 h-4 w-4" /> Chat on WhatsApp
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
