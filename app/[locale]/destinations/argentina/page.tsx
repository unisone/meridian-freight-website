import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
  PackageSearch,
  Ship,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { TrustBar } from "@/components/trust-bar";
import { FaqAccordion } from "@/components/faq-accordion";
import { DarkCta } from "@/components/dark-cta";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { argentinaMarketPage } from "@/content/argentina-market";
import { getAllProjects } from "@/content/projects";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { setRequestLocale } from "next-intl/server";

const ARGENTINA_PATH = "/es/destinations/argentina";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "es") notFound();

  return {
    title: argentinaMarketPage.seo.title,
    description: argentinaMarketPage.seo.description,
    keywords: argentinaMarketPage.seo.keywords,
    alternates: {
      canonical: `${SITE.url}${ARGENTINA_PATH}`,
      languages: {
        es: `${SITE.url}${ARGENTINA_PATH}`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${argentinaMarketPage.seo.title} | ${SITE.name}`,
      description: argentinaMarketPage.seo.description,
      url: `${SITE.url}${ARGENTINA_PATH}`,
      images: [
        {
          url: SITE.ogImage,
          width: 1200,
          height: 630,
          alt: argentinaMarketPage.seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${argentinaMarketPage.seo.title} | ${SITE.name}`,
      description: argentinaMarketPage.seo.description,
      images: [SITE.ogImage],
    },
  };
}

export default async function ArgentinaBuyerHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();

  setRequestLocale(locale);

  const content = argentinaMarketPage;
  const whatsappHref = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
    content.hero.whatsappMessage,
  )}`;
  const proofProjects = getAllProjects(locale)
    .filter((project) =>
      content.latamProof.destinationMatches.some((match) =>
        project.destination.includes(match),
      ),
    )
    .slice(0, 3);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "es",
    name: content.seo.title,
    description: content.seo.description,
    url: `${SITE.url}${ARGENTINA_PATH}`,
    image: `${SITE.url}${SITE.ogImage}`,
    about: [
      "Importacion de maquinaria agricola usada desde Estados Unidos a Argentina",
      "Compra asistida y logistica puerta a puerto",
      "AFIDI, SENASA y costos locales del importador argentino",
    ],
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${SITE.url}/es`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinos",
        item: `${SITE.url}/es/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Argentina",
        item: `${SITE.url}${ARGENTINA_PATH}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: content.faq.entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        variant="dark"
        breadcrumbs={[
          { label: "Destinos", href: "/destinations" },
          { label: "Argentina" },
        ]}
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.description}
        rightContent={
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
              Preguntas que esta guia resuelve
            </p>
            <div className="mt-4 space-y-3">
              {content.hero.buyerQuestions.map((question) => (
                <div
                  key={question}
                  className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm font-medium text-white"
                >
                  {question}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-sky-200">
              Un solo socio desde el vendedor hasta el puerto. El tramo argentino
              queda separado y claro desde el inicio.
            </p>
          </div>
        }
      >
        <ul className="space-y-2 text-sm text-sky-200">
          {content.hero.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-sky-300" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <TrackedContactLink
            href={whatsappHref}
            type="whatsapp"
            location="argentina_hero_whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {content.hero.primaryCtaLabel}
          </TrackedContactLink>
          <TrackedCtaLink
            href="/pricing/calculator"
            location="argentina_hero_calculator"
            text={content.hero.secondaryCtaLabel}
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            {content.hero.secondaryCtaLabel}
          </TrackedCtaLink>
        </div>
      </PageHero>

      <TrustBar />

      <div>
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Marco regulatorio
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.marketChange.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.marketChange.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="border-emerald-200 bg-emerald-50/70">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                    {content.marketChange.changedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.marketChange.changed.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/80">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                    {content.marketChange.unchangedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.marketChange.unchanged.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {content.marketChange.officialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  {link.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Alcance comercial
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.includedVsExcluded.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.includedVsExcluded.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="h-full">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                    {content.includedVsExcluded.includedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.includedVsExcluded.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-rose-600">
                    {content.includedVsExcluded.excludedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.includedVsExcluded.excluded.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-rose-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="mt-6 max-w-4xl text-sm leading-relaxed text-muted-foreground">
              {content.includedVsExcluded.note}
            </p>

            <DarkCta
              variant="card"
              className="mt-10"
              heading={content.includedVsExcluded.midCtaHeading}
              description={content.includedVsExcluded.midCtaDescription}
            >
              <TrackedContactLink
                href={whatsappHref}
                type="whatsapp"
                location="argentina_mid_whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {content.includedVsExcluded.midCtaWhatsAppLabel}
              </TrackedContactLink>
              <TrackedCtaLink
                href="/pricing/calculator"
                location="argentina_mid_calculator"
                text={content.includedVsExcluded.midCtaCalculatorLabel}
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white px-8 font-semibold text-white transition-colors hover:bg-white hover:text-foreground"
              >
                {content.includedVsExcluded.midCtaCalculatorLabel}
              </TrackedCtaLink>
            </DarkCta>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Seleccion de equipo
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.equipmentFocus.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.equipmentFocus.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {content.equipmentFocus.items.map((item, idx) => (
                <StaggerItem key={item.title} index={idx} variant="fade">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <PackageSearch className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-foreground">
                        {item.reason}
                      </p>
                      <Link
                        href={item.href}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {item.linkLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Flujo de compra
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.processSteps.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.processSteps.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {content.processSteps.steps.map((step, idx) => (
                <StaggerItem key={step.step} index={idx}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary">
                        {step.step}
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Credibilidad operativa
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {content.latamProof.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {content.latamProof.intro}
                </p>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {proofProjects.map((project, idx) => (
                  <StaggerItem key={project.id} index={idx} variant="fade">
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <Badge className="w-fit bg-sky-100 text-sky-800 hover:bg-sky-100">
                          {content.latamProof.badgeLabel}
                        </Badge>
                        <h3 className="mt-4 text-xl font-bold text-foreground">
                          {project.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3 text-sm text-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary" />
                            {project.destination}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Ship className="h-4 w-4 text-primary" />
                            {project.containerType}
                          </span>
                        </div>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {content.proofLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border bg-muted/40 p-5 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <p className="text-base font-bold text-foreground">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Abrir
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Objeciones frecuentes
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.faq.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.faq.intro}
              </p>
            </div>
          </div>
          <FaqAccordion entries={content.faq.entries} />
        </section>

        <DarkCta
          heading={content.cta.heading}
          description={content.cta.description}
        >
          <TrackedContactLink
            href={whatsappHref}
            type="whatsapp"
            location="argentina_final_whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {content.cta.whatsappLabel}
          </TrackedContactLink>
          <TrackedCtaLink
            href="/pricing/calculator"
            location="argentina_final_calculator"
            text={content.cta.calculatorLabel}
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white px-8 font-semibold text-white transition-colors hover:bg-white hover:text-foreground"
          >
            {content.cta.calculatorLabel}
          </TrackedCtaLink>
        </DarkCta>
      </div>
    </>
  );
}
