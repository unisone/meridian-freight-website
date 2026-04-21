import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle,
  Package,
  Wrench,
  Container,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Weight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { TrustBar } from "@/components/trust-bar";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import {
  ArgentinaCombineDecisionBlock,
  ArgentinaCombineHeroBridge,
} from "@/components/argentina-combine-paid-landing";
import { getEquipmentBySlug, getAllEquipmentTypes } from "@/content/equipment";
import { getServiceBySlug } from "@/content/services";
import { getAllDestinations } from "@/content/destinations";
import { getProjectsByEquipmentSlug } from "@/content/projects";
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
  const localePath = locale === "en" ? "" : `/${locale}`;
  const isArgentinaCombinePage = locale === "es" && slug === "combines";
  const homeLabel =
    locale === "es" ? "Inicio" : locale === "ru" ? "Главная" : "Home";
  const homeUrl = localePath ? `${SITE.url}${localePath}` : SITE.url;

  const relatedServices = equipment.relatedServiceSlugs
    .map((s) => getServiceBySlug(s, locale))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const relatedDestinations = getAllDestinations(locale).filter((d) =>
    d.commonEquipment.includes(equipment.pluralName)
  );

  const equipmentProjects = getProjectsByEquipmentSlug(slug, locale, 6);

  const whatsappMessage = isArgentinaCombinePage
    ? "Hola, quiero cotizar una cosechadora usada desde EE.UU. para Argentina."
    : `Hi! I'm interested in shipping a ${equipment.singularName.toLowerCase()}.`;
  const whatsappHref = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    inLanguage: locale,
    name: equipment.title,
    description: equipment.metaDescription,
    image: `${SITE.url}${SITE.ogImage}`,
    url: `${SITE.url}${localePath}/equipment/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: homeLabel,
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: te("equipmentIndex"),
          item: `${SITE.url}${localePath}/equipment`,
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

      {/* 1. Hero — trust eyebrow, pricing, 3 CTAs */}
      <PageHero
        variant="dark"
        locale={locale}
        currentPath={`/equipment/${slug}`}
        breadcrumbs={[
          { label: te("equipmentIndex"), href: "/equipment" },
          { label: equipment.pluralName },
        ]}
        eyebrow={te("trustEyebrow")}
        heading={equipment.title}
        description={equipment.heroDescription}
      >
        {isArgentinaCombinePage && <ArgentinaCombineHeroBridge />}
        {equipment.typicalPriceRange && (
          <p className="text-sm font-medium text-sky-300">
            {te("pricingFrom", { range: equipment.typicalPriceRange })}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            render={<a href="#quote-form" />}
            size="lg"
            className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
          >
            {te("getAQuote")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <TrackedContactLink
            href={whatsappHref}
            type="whatsapp"
            location={
              isArgentinaCombinePage
                ? "combines_hero_argentina_whatsapp"
                : "equipment_hero"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-colors"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {te("chatOnWhatsApp")}
          </TrackedContactLink>
          {/* Hidden on mobile to keep Quote + WhatsApp above the fold on 375×667. */}
          {/* Phone is still reachable from the inline ContactInfo block, the bottom CTA, and the header. */}
          <TrackedContactLink
            href={CONTACT.phoneHref}
            type="phone"
            location="equipment_hero"
            className="hidden sm:inline-flex items-center justify-center h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold transition-colors"
          >
            <Phone className="mr-2 h-4 w-4" />
            {te("callUs")}
          </TrackedContactLink>
        </div>
        {!isArgentinaCombinePage && (
          <p className="mt-4 max-w-2xl text-xs font-medium text-sky-300/90 leading-relaxed">
            {te("heroReassurance")}
          </p>
        )}
        {equipment.sourcingNote && equipment.sourcingLinkLabel && (() => {
          const [before, after] = equipment.sourcingNote.split("{link}");
          return (
            <p className="mt-5 max-w-2xl text-sm text-sky-200/90 leading-relaxed">
              {before}
              <Link
                href="/services/equipment-sales"
                className="font-medium text-white underline underline-offset-4 decoration-sky-400 hover:decoration-white transition-colors"
              >
                {equipment.sourcingLinkLabel}
              </Link>
              {after}
            </p>
          );
        })()}
      </PageHero>

      {/* 2. Trust bar — animated stats */}
      <TrustBar />

      <div>
        {isArgentinaCombinePage && (
          <ArgentinaCombineDecisionBlock whatsappHref={whatsappHref} />
        )}

        {/* 3. Project gallery — social proof through real photos */}
        {equipmentProjects.length > 0 && (
          <ScrollReveal>
            <section className="py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {te("recentExports", { equipment: equipment.pluralName })}
                </h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  {te("recentExportsDescription")}
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {equipmentProjects.map((project, idx) => (
                    <StaggerItem key={project.id} index={idx} variant="fade">
                      <article className="group flex h-full flex-col overflow-hidden rounded-xl border-0 bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:shadow-lg hover:-translate-y-0.5">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={project.image}
                            alt={`${project.title} — ${project.containerType} to ${project.destination}`}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={80}
                          />
                          <span className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {project.category}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="text-lg font-bold text-foreground leading-snug">
                            {project.title}
                          </h3>
                          <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-2 bg-muted -mx-5 px-5 py-3 rounded-b-xl">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="font-mono">{project.destination}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Container className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="font-mono">{project.containerType}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="font-mono">{project.transitTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Weight className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="font-mono">{project.weight}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </StaggerItem>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors link-underline"
                  >
                    {te("viewAllProjects")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 4. Brands We Handle */}
        <section className="bg-muted py-16 md:py-20">
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

        {/* 5. Common Models */}
        <section className="py-16 md:py-20">
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

        {/* 6. Inline contact form */}
        <ScrollReveal>
          <section id="quote-form" className="bg-muted py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 sm:mb-16">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {te("formEyebrow")}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight">
                  {te("formHeading", { equipment: equipment.singularName })}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                  {te("formDescription")}
                </p>
              </div>
              <div className="grid gap-12 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">
                    {te("requestYourQuote")}
                  </h3>
                  <ContactForm />
                </div>
                <ContactInfo />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 7. How We Pack */}
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

        {/* 8. Container Options */}
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

        {/* 9. Related Services */}
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

        {/* 10. Where We Ship */}
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

        {/* 11. FAQ */}
        {equipment.faqs && equipment.faqs.length > 0 && (
          <FaqAccordion entries={equipment.faqs} />
        )}

        {/* 12. Bottom CTA — same 3 contact methods as hero */}
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
              render={<a href="#quote-form" />}
              size="lg"
              className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
            >
              {te("getAQuote")}
            </Button>
            <TrackedContactLink
              href={whatsappHref}
              type="whatsapp"
              location={
                isArgentinaCombinePage
                  ? "combines_cta_argentina_whatsapp"
                  : "equipment_cta"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-colors"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {te("chatOnWhatsApp")}
            </TrackedContactLink>
            <TrackedContactLink
              href={CONTACT.phoneHref}
              type="phone"
              location="equipment_cta"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold transition-colors"
            >
              <Phone className="mr-2 h-4 w-4" />
              {te("callUs")}
            </TrackedContactLink>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
