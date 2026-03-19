import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  Wheat,
  Search,
  FileText,
  Warehouse,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { services, getServiceBySlug, getRelatedServices } from "@/content/services";
import { FaqAccordion } from "@/components/faq-accordion";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";

const iconMap: Record<string, typeof Package> = {
  Package,
  Truck,
  Wheat,
  Search,
  FileText,
  Warehouse,
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    alternates: { canonical: `${SITE.url}/services/${slug}` },
    openGraph: {
      title: `${service.title} | ${SITE.name}`,
      description: service.description,
      url: `${SITE.url}/services/${slug}`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: service.title }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(slug);
  const Icon = iconMap[service.icon] ?? Package;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.longDescription,
    image: `${SITE.url}${SITE.ogImage}`,
    availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
    priceRange: "Contact for quote",
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
    ],
    url: `${SITE.url}/services/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {service.faqs && service.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((e) => ({
              "@type": "Question",
              name: e.question,
              acceptedAnswer: { "@type": "Answer", text: e.answer },
            })),
          })}}
        />
      )}

      <div className="pt-20">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: service.shortTitle },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
              {service.description}
            </p>
            <Button render={<Link href="/contact" />} size="lg" className="mt-8 h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              What We Do
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {service.longDescription}
            </p>
          </div>
        </section>

        {/* Equipment Types */}
        {service.equipmentTypes.length > 0 && (
          <section className="bg-muted py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Equipment We Handle
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {service.equipmentTypes.map((type, idx) => (
                  <StaggerItem key={type} index={idx} variant="fade" className="inline-block"><Badge
                    key={type}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    {type}
                  </Badge></StaggerItem>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Services */}
        {related.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Related Services
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rs, idx) => {
                  const RsIcon = iconMap[rs.icon] ?? Package;
                  return (
                    <StaggerItem key={rs.slug} index={idx}><Link href={`/services/${rs.slug}`} className="group">
                      <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <RsIcon className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground leading-snug">{rs.shortTitle}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {rs.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link></StaggerItem>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {service.faqs && service.faqs.length > 0 && (
          <FaqAccordion entries={service.faqs} />
        )}

        {/* CTA */}
        <ScrollReveal variant="fade">
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Need {service.shortTitle} Services?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sky-300">
              Get a free quote within 24 hours, or{" "}
              <Link href="/pricing/calculator" className="underline hover:text-white transition-colors">try our instant calculator</Link>{" "}
              for a cost estimate right now.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
                  Get a Quote
              </Button>
              <Button render={<a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi! I'm interested in your ${service.shortTitle} services.`)}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp about our services" />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
                  Chat on WhatsApp
              </Button>
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>
    </>
  );
}
