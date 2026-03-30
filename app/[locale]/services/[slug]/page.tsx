import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
import { PageHero } from "@/components/page-hero";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { getServiceBySlug, getRelatedServices, getAllServices } from "@/content/services";
import { FaqAccordion } from "@/components/faq-accordion";
import { DarkCta } from "@/components/dark-cta";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { setRequestLocale, getTranslations } from "next-intl/server";

const iconMap: Record<string, typeof Package> = {
  Package,
  Truck,
  Wheat,
  Search,
  FileText,
  Warehouse,
};

export function generateStaticParams() {
  return getAllServices('en').map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug, locale);
  if (!service) return {};
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    alternates: {
      canonical: `${SITE.url}${localePath}/services/${slug}`,
      languages: {
        en: `${SITE.url}/services/${slug}`,
        es: `${SITE.url}/es/services/${slug}`,
        ru: `${SITE.url}/ru/services/${slug}`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${service.title} | ${SITE.name}`,
      description: service.description,
      url: `${SITE.url}${localePath}/services/${slug}`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ${SITE.name}`,
      description: service.description,
      images: [SITE.ogImage],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const ts = await getTranslations("ServiceDetailPage");
  const service = getServiceBySlug(slug, locale);
  if (!service) notFound();

  const related = getRelatedServices(slug, locale);
  const Icon = iconMap[service.icon] ?? Package;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    inLanguage: locale,
    name: service.title,
    description: service.longDescription,
    url: `${SITE.url}${locale === "en" ? "" : `/${locale}`}/services/${slug}`,
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
            inLanguage: locale,
            mainEntity: service.faqs.map((e) => ({
              "@type": "Question",
              name: e.question,
              acceptedAnswer: { "@type": "Answer", text: e.answer },
            })),
          })}}
        />
      )}

      <PageHero
        variant="dark"
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.shortTitle },
        ]}
        eyebrow={ts("eyebrow")}
        heading={service.title}
        description={service.description}
        icon={Icon}
      >
        <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
            {ts("getAQuote")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </PageHero>

      <div>
        {/* What We Do */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {ts("howWeHandle")}
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
                {ts("equipmentWeHandle")}
              </h2>
              <p className="mt-2 text-muted-foreground">{ts("equipmentWeHandleDescription")}</p>
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
                {ts("addTheseServices")}
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
          <DarkCta
            heading={ts("needServices", { service: service.shortTitle })}
            description={ts.rich("ctaDescription", {
              calculatorLink: (chunks) => (
                <Link href="/pricing/calculator" className="underline hover:text-white transition-colors">{chunks}</Link>
              ),
            })}
          >
            <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
              {ts("getAQuote")}
            </Button>
            <Button render={<a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi! I'm interested in your ${service.shortTitle} services.`)}`} target="_blank" rel="noopener noreferrer" aria-label={ts("chatOnWhatsApp")} />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
              {ts("chatOnWhatsApp")}
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
