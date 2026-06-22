import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Ship,
  ShieldCheck,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DarkCta } from "@/components/dark-cta";
import { JsonLdScript } from "@/components/json-ld-script";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { PaidSearchWhatsAppButton } from "@/components/destinations/paid-search-whatsapp-button";
import { TrustBar } from "@/components/trust-bar";
import { PaidSearchQuoteForm } from "@/components/destinations/paid-search-quote-form";
import type { LatamPaidSearchDestination } from "@/content/latam-paid-search-destinations";
import { COMPANY, CONTACT, SITE, STATS } from "@/lib/constants";
import { formatCount } from "@/lib/i18n-utils";
import { encodeJsonLd } from "@/lib/json-ld";

interface LatamPaidSearchPageProps {
  record: LatamPaidSearchDestination;
}

function SectionIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {intro ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}

function ScopeCards({ record }: LatamPaidSearchPageProps) {
  return (
    <div className="w-full max-w-xl lg:w-[440px]">
      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Meridian coordina</p>
        <ul className="mt-3 space-y-2">
          {record.scopeIncluded.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-sky-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Su despachante confirma en destino</p>
        <ul className="mt-3 space-y-2">
          {record.scopeExcluded.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-sky-100">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LatamPaidSearchPage({ record }: LatamPaidSearchPageProps) {
  const pageUrl = `${SITE.url}${record.seo.canonicalPath}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    inLanguage: record.locale,
    name: record.jsonLd.serviceName,
    serviceType: record.jsonLd.serviceType,
    description: record.seo.description,
    url: pageUrl,
    provider: { "@type": "Organization", name: COMPANY.name, url: SITE.url, telephone: CONTACT.phone },
    areaServed: { "@type": "Country", name: record.jsonLd.areaServedCountryName },
    availableLanguage: { "@type": "Language", name: "Spanish", alternateName: record.locale },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: record.locale,
    mainEntity: record.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };

  return (
    <>
      <JsonLdScript encodedJson={encodeJsonLd(serviceJsonLd)} />
      <JsonLdScript encodedJson={encodeJsonLd(faqJsonLd)} />

      <PageHero
        variant="dark"
        locale="es"
        currentPath={`/destinations/${record.country.slug}/${record.segment.slug}`}
        breadcrumbs={[
          { label: "Destinos", href: "/destinations" },
          { label: record.country.name, href: `/destinations/${record.country.slug}` },
          { label: record.breadcrumbLabel },
        ]}
        eyebrow={record.eyebrow}
        heading={record.h1}
        description={
          <div>
            <p>{record.heroBody}</p>
            <ul className="mt-5 grid gap-3">
              {record.heroBullets.map((b) => (
                <li key={b} className="flex gap-3 text-base leading-relaxed text-sky-100">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-sky-200">{record.compliance.localResponsibility}</p>
          </div>
        }
        icon={Ship}
        rightContent={<ScopeCards record={record} />}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            render={<a href="#cotizar" />}
            size="lg"
            className="h-12 rounded-xl bg-white px-6 font-semibold text-foreground hover:bg-muted"
          >
            Solicitar cotización
          </Button>
          <PaidSearchWhatsAppButton
            routeKey={record.routeKey}
            prefillTemplate={record.cta.whatsappPrefill}
            location={record.tracking.heroWhatsapp}
            label={record.cta.whatsappLabel}
            className="h-12 rounded-xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
          />
          <Button
            render={
              <TrackedCtaLink
                href="/pricing/calculator"
                location={record.tracking.heroCalculator}
                text={record.cta.calculatorLabel}
              />
            }
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white bg-transparent px-6 font-semibold text-white hover:bg-white hover:text-foreground"
          >
            {record.cta.calculatorLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </PageHero>

      <TrustBar />

      {/* Process */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Proceso" title={record.process.heading} intro={record.process.intro} />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {record.process.steps.map((step, i) => (
              <div key={step.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-700 font-mono text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope included / excluded */}
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Alcance" title="Qué incluye y qué no la cotización" intro="Separamos el tramo internacional que controlamos de los costos y trámites locales que confirma su despachante." />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <ClipboardCheck className="h-8 w-8 text-emerald-600" />
                <h3 className="mt-4 text-lg font-bold text-foreground">Meridian coordina</h3>
                <ul className="mt-4 space-y-3">
                  {record.scopeIncluded.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
                <h3 className="mt-4 text-lg font-bold text-foreground">Su despachante confirma en destino</h3>
                <ul className="mt-4 space-y-3">
                  {record.scopeExcluded.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote readiness + form */}
      <section id="cotizar" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Cotización" title={record.quoteReadiness.heading} intro={record.quoteReadiness.intro} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <ul className="grid gap-3">
                {record.quoteReadiness.fields.map((f) => (
                  <li key={f} className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-foreground">Solicitar cotización</h3>
              <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
                Comparta el equipo y el destino; le devolvemos por escrito el alcance del tramo internacional.
              </p>
              <PaidSearchQuoteForm routeKey={record.routeKey} caveat={record.compliance.localResponsibility} />
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Cumplimiento local" title={record.compliance.heading} />
          <div className="mt-8 max-w-3xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{record.compliance.body}</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Meridian ha coordinado más de{" "}
            <span className="font-mono font-bold tabular-nums text-foreground">
              {formatCount(STATS.projectsCompleted, "es")}
            </span>{" "}
            exportaciones a más de{" "}
            <span className="font-mono font-bold tabular-nums text-foreground">40</span> países.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Preguntas frecuentes" title="Preguntas frecuentes" intro="Lo que más nos consultan los compradores antes de embarcar." />
          <ScrollReveal className="mt-10 max-w-4xl">
            <Accordion className="space-y-3">
              {record.faq.map((entry, i) => (
                <AccordionItem key={entry.question} value={`ps-faq-${i}`} className="rounded-xl border-0 bg-white px-6 shadow-sm">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:text-sky-700">
                    {entry.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground">{entry.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* Official sources */}
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Fuentes oficiales" title="Fuentes oficiales para validar su operación" intro="Los requisitos pueden cambiar y dependen de la clasificación, condición y uso del equipo. Confirme su caso con su importador o despachante antes de comprar o embarcar." />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {record.officialSources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${source.label} (fuente oficial, abre en una pestaña nueva)`}
                className="group rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{source.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{source.description}</span>
                  </span>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-sky-700" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Related resources */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Recursos relacionados" title="Siga explorando" />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {record.internalLinks.map((link) => (
              <TrackedCtaLink
                key={link.href}
                href={link.href}
                location={`${record.country.slug}_${record.segment.key}_related`}
                text={link.label}
                className="group flex items-center justify-between gap-4 rounded-xl bg-muted p-4 text-sm font-semibold text-foreground shadow-sm transition hover:shadow-md"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-sky-700 transition group-hover:translate-x-0.5" />
              </TrackedCtaLink>
            ))}
          </div>
        </div>
      </section>

      <DarkCta heading={record.cta.heading} description={record.cta.description}>
        <PaidSearchWhatsAppButton
          routeKey={record.routeKey}
          prefillTemplate={record.cta.whatsappPrefill}
          location={record.tracking.finalWhatsapp}
          label={record.cta.whatsappLabel}
          className="h-12 rounded-xl bg-white px-6 font-semibold text-foreground hover:bg-muted"
        />
        <Button
          render={
            <TrackedCtaLink
              href="/pricing/calculator"
              location={record.tracking.finalCalculator}
              text={record.cta.calculatorLabel}
            />
          }
          size="lg"
          variant="outline"
          className="h-12 rounded-xl border-2 border-white bg-transparent px-6 font-semibold text-white hover:bg-white hover:text-foreground"
        >
          {record.cta.calculatorLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DarkCta>
    </>
  );
}
