import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle,
  Package,
  Wrench,
  Container,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { getEquipmentBySlug, getAllEquipmentTypes } from "@/content/equipment";
import { getServiceBySlug } from "@/content/services";
import { getAllDestinations } from "@/content/destinations";
import { FaqAccordion } from "@/components/faq-accordion";
import { DarkCta } from "@/components/dark-cta";
import { SITE, COMPANY, CONTACT } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { setRequestLocale, getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return getAllEquipmentTypes('en').map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const equipment = getEquipmentBySlug(slug, locale);
  if (!equipment) return {};
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: equipment.metaTitle,
    description: equipment.metaDescription,
    keywords: equipment.keywords,
    alternates: {
      canonical: `${SITE.url}${localePath}/equipment/${slug}`,
      languages: {
        en: `${SITE.url}/equipment/${slug}`,
        es: `${SITE.url}/es/equipment/${slug}`,
        ru: `${SITE.url}/ru/equipment/${slug}`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: equipment.metaTitle,
      description: equipment.metaDescription,
      url: `${SITE.url}${localePath}/equipment/${slug}`,
      images: [
        { url: SITE.ogImage, width: 1200, height: 630, alt: equipment.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: equipment.metaTitle,
      description: equipment.metaDescription,
      images: [SITE.ogImage],
    },
  };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const te = await getTranslations("EquipmentDetailPage");
  const equipment = getEquipmentBySlug(slug, locale);
  if (!equipment) notFound();

  const relatedServices = equipment.relatedServiceSlugs
    .map((s) => getServiceBySlug(s, locale))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const relatedDestinations = getAllDestinations(locale).filter((d) =>
    d.commonEquipment.includes(equipment.pluralName)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    inLanguage: locale,
    name: equipment.title,
    description: equipment.metaDescription,
    image: `${SITE.url}${SITE.ogImage}`,
    url: `${SITE.url}/equipment/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Equipment",
          item: `${SITE.url}/equipment`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: equipment.pluralName,
        },
      ],
    },
    mainEntity: {
      "@type": "Product",
      name: `${equipment.singularName} Export & Shipping Service`,
      description: equipment.heroDescription,
      brand: equipment.brands.map((b) => ({
        "@type": "Brand",
        name: b,
      })),
      provider: {
        "@type": "Organization",
        name: COMPANY.name,
        url: SITE.url,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {equipment.faqs && equipment.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: locale,
            mainEntity: equipment.faqs.map((e) => ({
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
          { label: "Equipment", href: "/equipment" },
          { label: equipment.pluralName },
        ]}
        heading={equipment.title}
        description={equipment.heroDescription}
      >
        <Button
          render={<Link href="/contact" />}
          size="lg"
          className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
        >
          {te("getAQuote")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </PageHero>

      <div>
        {/* Brands We Handle */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {te("brandsWeHandle")}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {te("brandsDescription", { equipment: equipment.pluralName.toLowerCase() })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {equipment.brands.map((brand, idx) => (
                <StaggerItem key={brand} index={idx} variant="fade" className="inline-block">
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    {brand}
                  </Badge>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        {/* Common Models */}
        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {te("commonModels")}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {te("commonModelsDescription")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {equipment.commonModels.map((model, idx) => (
                <StaggerItem key={model} index={idx} variant="fade">
                  <Card className="h-full">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Truck className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">{model}</span>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        {/* How We Pack */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {te("howWePack", { equipment: equipment.pluralName })}
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {equipment.packingNotes}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Container Options */}
        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Container className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {te("containerOptions")}
                </h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  {te("containerOptionsDescription", { equipment: equipment.singularName.toLowerCase() })}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {equipment.containerTypes.map((ct, idx) => (
                <StaggerItem key={ct} index={idx} variant="fade" className="inline-block">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    <Package className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    {ct}
                  </Badge>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {te("relatedServices")}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((rs, idx) => (
                  <StaggerItem key={rs.slug} index={idx}>
                    <Link href={`/services/${rs.slug}`} className="group">
                      <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-foreground leading-snug">
                            {rs.shortTitle}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {rs.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Where We Ship */}
        {relatedDestinations.length > 0 && (
          <section className="bg-muted py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {te("whereWeShip", { equipment: equipment.pluralName })}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedDestinations.map((dest, idx) => (
                  <StaggerItem key={dest.slug} index={idx}>
                    <Link href={`/destinations/${dest.slug}`} className="group">
                      <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-foreground leading-snug">
                            {dest.country}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {dest.port} &middot; {te("transitDays", { days: dest.transitDays })}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {equipment.faqs && equipment.faqs.length > 0 && (
          <FaqAccordion entries={equipment.faqs} />
        )}

        {/* CTA */}
        <ScrollReveal variant="fade">
          <DarkCta
            heading={te("readyToShip", { equipment: equipment.singularName })}
            description={te.rich("ctaDescription", {
              calculatorLink: (chunks) => (
                <Link
                  href="/pricing/calculator"
                  className="underline hover:text-white transition-colors"
                >
                  {chunks}
                </Link>
              ),
            })}
          >
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
            >
              {te("getAQuote")}
            </Button>
            <Button
              render={
                <a
                  href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi! I'm interested in shipping a ${equipment.singularName.toLowerCase()}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={te("chatOnWhatsApp")}
                />
              }
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
            >
              {te("chatOnWhatsApp")}
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
