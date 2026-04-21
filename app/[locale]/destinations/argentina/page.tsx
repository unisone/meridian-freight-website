import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Globe2,
  MessageCircle,
  PackageSearch,
  Scale,
  Search,
  Ship,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { TrustBar } from "@/components/trust-bar";
import { FaqAccordion } from "@/components/faq-accordion";
import { DarkCta } from "@/components/dark-cta";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { argentinaMarketPage } from "@/content/argentina-market";
import { COMPANY, CONTACT, SITE, STATS } from "@/lib/constants";
import { formatCount, getOgLocale } from "@/lib/i18n-utils";
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

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "es-AR",
    name: content.seo.title,
    description: content.seo.description,
    url: `${SITE.url}${ARGENTINA_PATH}`,
    image: `${SITE.url}${SITE.ogImage}`,
    about: [
      "Importación de maquinaria agrícola usada desde Estados Unidos a Argentina",
      "Compra asistida y logística puerta a puerto",
      "AFIDI, SENASA y costos locales del importador argentino",
    ],
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-AR",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        variant="dark"
        locale="es"
        currentPath="/destinations/argentina"
        breadcrumbs={[
          { label: "Destinos", href: "/destinations" },
          { label: "Argentina" },
        ]}
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.description}
        rightContent={
          <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {content.hero.scopeCaption}
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-200">
                  {content.hero.scopeIncludedLabel}
                </p>
                <ul className="mt-3 space-y-2">
                  {content.hero.scopeIncluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-white"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <p className="text-sm font-semibold text-amber-100">
                  {content.hero.scopeExcludedLabel}
                </p>
                <ul className="mt-3 space-y-2">
                  {content.hero.scopeExcluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-relaxed text-white"
                    >
                      <Scale className="mt-0.5 h-4 w-4 flex-none text-amber-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-sky-100">
              {content.hero.scopeFootnote}
            </p>
          </div>
        }
      >
        <ul className="space-y-2.5 text-sm text-sky-200">
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
        <section className="bg-[linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_100%)] py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
            <Card className="overflow-hidden border-slate-900 bg-slate-950 text-white shadow-xl">
              <CardContent className="p-6">
                <Badge className="border border-white/15 bg-white/10 text-white hover:bg-white/10">
                  Marco regulatorio
                </Badge>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                  {content.marketChange.dateLabel}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  {content.marketChange.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-sky-100">
                  {content.marketChange.intro}
                </p>
              </CardContent>
            </Card>

            <div className="rounded-[28px] border bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                    {content.marketChange.changedLabel}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {content.marketChange.changed.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                    {content.marketChange.unchangedLabel}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {content.marketChange.unchanged.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <FileText className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
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

            <div className="mt-10 overflow-hidden rounded-[28px] border bg-white shadow-sm">
              <div className="grid lg:grid-cols-2">
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                    {content.includedVsExcluded.includedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.includedVsExcluded.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t bg-rose-50/60 p-6 sm:border-t-0 sm:border-l sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-rose-600">
                    {content.includedVsExcluded.excludedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.includedVsExcluded.excluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <Scale className="mt-0.5 h-4 w-4 flex-none text-rose-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm leading-relaxed text-amber-950">
                {content.includedVsExcluded.note}
              </p>
            </div>

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
                Selección de equipo
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
                <Card
                  key={item.title}
                  className="h-full overflow-hidden border-border/70 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <PackageSearch className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Bloque {idx + 1}
                        </p>
                        <h3 className="text-xl font-bold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
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
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-16 md:py-20">
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

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {content.processSteps.steps.map((step) => (
                <Card key={step.step} className="h-full border-border/70 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary">
                        {step.step}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Credibilidad operativa
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.credibility.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.credibility.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-5">
                {content.credibility.pillars.map((item, idx) => (
                  <Card key={item.title} className="border-border/70">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {idx === 0 ? (
                          <Search className="h-5 w-5" />
                        ) : idx === 1 ? (
                          <ClipboardList className="h-5 w-5" />
                        ) : (
                          <Globe2 className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-5">
                <Card className="overflow-hidden border-slate-900 bg-slate-950 text-white shadow-xl">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                      {content.credibility.noteTitle}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-mono text-3xl font-bold">
                          {formatCount(STATS.projectsCompleted, "es")}+
                        </p>
                        <p className="mt-1 text-xs text-sky-100">
                          exportaciones ejecutadas
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-3xl font-bold">
                          {STATS.yearsExperience}+
                        </p>
                        <p className="mt-1 text-xs text-sky-100">
                          años en operación
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-sky-100">
                      {content.credibility.note}
                    </p>
                    <TrackedCtaLink
                      href={content.credibility.projectGalleryHref}
                      location="argentina_project_library"
                      text={content.credibility.projectGalleryLabel}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <Ship className="h-4 w-4" />
                      {content.credibility.projectGalleryLabel}
                    </TrackedCtaLink>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="mt-1 h-5 w-5 flex-none text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {content.credibility.projectGalleryLabel}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {content.credibility.projectGalleryDescription}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {content.proofLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border bg-muted/40 p-5 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <p className="text-base font-bold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Abrir recurso
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
