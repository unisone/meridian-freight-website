import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  MessageCircle,
  PackageCheck,
  Route,
  Scale,
  ShieldCheck,
  Ship,
  Tractor,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DarkCta } from "@/components/dark-cta";
import { PageHero } from "@/components/page-hero";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { TrustBar } from "@/components/trust-bar";
import type { LatamMarketPageContent } from "@/content/latam-market-pages";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";

interface LatamMarketPageProps {
  content: LatamMarketPageContent;
}

function SectionIntro({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {intro}
      </p>
    </div>
  );
}

function HeroVisual({ content }: LatamMarketPageProps) {
  return (
    <div className="w-full max-w-xl lg:w-[460px]">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl">
        <div className="relative aspect-[4/3]">
          <Image
            src={content.hero.image.src}
            alt={content.hero.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 460px"
            priority
            quality={75}
          />
        </div>
        <div className="border-t border-white/10 bg-slate-950/80 px-5 py-4">
          <p className="text-sm leading-relaxed text-sky-100">
            {content.hero.image.caption}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            {content.labels.meridianHandles}
          </p>
          <ul className="mt-3 space-y-2">
            {content.hero.scopeIncluded.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-sky-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            {content.labels.localSideConfirms}
          </p>
          <ul className="mt-3 space-y-2">
            {content.hero.scopeExcluded.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-sky-100">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LinkGrid({
  items,
  location,
  openResourceLabel,
}: {
  items: LatamMarketPageContent["resourceLinks"];
  location: string;
  openResourceLabel: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <TrackedCtaLink
          key={item.href}
          href={item.href}
          location={location}
          text={item.label}
          className="group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="flex items-start justify-between gap-4">
            <span>
              <span className="block font-semibold text-foreground">
                {item.label}
              </span>
              {item.description && (
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-4 inline-flex text-sm font-semibold text-primary">
            {openResourceLabel}
          </span>
        </TrackedCtaLink>
      ))}
    </div>
  );
}

export function LatamMarketPage({ content }: LatamMarketPageProps) {
  const pageUrl = `${SITE.url}${content.path}`;
  const whatsappHref = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
    content.hero.whatsappMessage,
  )}`;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: content.locale,
    name: content.seo.title,
    description: content.seo.description,
    url: pageUrl,
    datePublished: content.schema.datePublished,
    dateModified: content.schema.dateModified,
    image: `${SITE.url}${content.hero.image.src}`,
    about: content.schema.mentions,
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    inLanguage: content.locale,
    name: content.schema.serviceType,
    serviceType: content.schema.serviceType,
    description: content.seo.description,
    url: pageUrl,
    image: `${SITE.url}${content.hero.image.src}`,
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      telephone: CONTACT.phone,
    },
    areaServed: {
      "@type": "Country",
      name: content.schema.areaServed,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: pageUrl,
      servicePhone: CONTACT.phone,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: content.locale,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        variant="dark"
        locale="es"
        currentPath={`/destinations/${content.slug}`}
        breadcrumbs={[
          { label: content.labels.breadcrumbsDestinations, href: "/destinations" },
          { label: content.country },
        ]}
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={
          <div>
            <p>{content.hero.description}</p>
            <ul className="mt-5 grid gap-3">
              {content.hero.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-base leading-relaxed text-sky-100">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-sky-200">
              {content.hero.scopeFootnote}
            </p>
          </div>
        }
        icon={Ship}
        rightContent={<HeroVisual content={content} />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            render={
              <TrackedContactLink
                href={whatsappHref}
                type="whatsapp"
                location={content.tracking.heroWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={content.hero.primaryCtaLabel}
              />
            }
            size="lg"
            className="h-12 rounded-xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {content.hero.primaryCtaLabel}
          </Button>
          <Button
            render={
              <TrackedCtaLink
                href="/pricing/calculator"
                location={content.tracking.heroCalculator}
                text={content.hero.secondaryCtaLabel}
              />
            }
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white bg-transparent px-6 font-semibold text-white hover:bg-white hover:text-foreground"
          >
            {content.hero.secondaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </PageHero>

      <TrustBar />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow={content.route.eyebrow}
            title={content.route.title}
            intro={content.route.intro}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border bg-muted/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Route className="h-6 w-6" />
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {content.route.note}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.route.steps.map((step, index) => (
                <Card key={step.title} className="h-full border-0 shadow-sm">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-4">
                      {content.labels.stepLabel} {index + 1}
                    </Badge>
                    <h3 className="text-lg font-bold leading-snug text-foreground">
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
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow={content.compliance.eyebrow}
            title={content.compliance.title}
            intro={content.compliance.intro}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <ClipboardCheck className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {content.labels.complianceSection}
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.compliance.required.map((item) => (
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
                <Scale className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {content.labels.localSideConfirms}
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.compliance.brokerConfirmed.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {content.labels.scopeCaption}
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.compliance.avoid.map((item) => (
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

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow={content.equipmentFocus.eyebrow}
            title={content.equipmentFocus.title}
            intro={content.equipmentFocus.intro}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.equipmentFocus.items.map((item, index) => (
              <Card key={item.title} className="group h-full border-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Tractor className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="mb-4 w-fit">
                    {content.labels.blockLabel} {index + 1}
                  </Badge>
                  <h3 className="text-lg font-bold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.reason}
                  </p>
                  <TrackedCtaLink
                    href={item.href}
                    location={content.tracking.equipmentLink}
                    text={item.linkLabel}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    {item.linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </TrackedCtaLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionIntro
              eyebrow={content.sendUsThis.eyebrow}
              title={content.sendUsThis.title}
              intro={content.sendUsThis.intro}
            />
            <ul className="mt-8 space-y-3">
              {content.sendUsThis.items.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionIntro
              eyebrow={content.processSteps.eyebrow}
              title={content.processSteps.title}
              intro={content.processSteps.intro}
            />
            <div className="mt-8 space-y-4">
              {content.processSteps.steps.map((step, index) => (
                <div key={step.title} className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow={content.credibility.eyebrow}
            title={content.credibility.title}
            intro={content.credibility.intro}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              {content.credibility.pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-xl border bg-white p-5 shadow-sm">
                  <PackageCheck className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-bold text-foreground">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-bold text-foreground">{content.credibility.noteTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {content.credibility.note}
                </p>
              </div>
            </div>
            <div>
              <LinkGrid
                items={content.resourceLinks}
                location={content.tracking.resourceLink}
                openResourceLabel={content.labels.openResource}
              />
              <div className="mt-8 rounded-2xl border bg-muted/60 p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {content.labels.sourceLinks}
                </p>
                <div className="mt-5 grid gap-3">
                  {content.officialSources.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span>
                          <span className="block text-sm font-semibold text-foreground">
                            {source.label}
                          </span>
                          {source.description && (
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                              {source.description}
                            </span>
                          )}
                        </span>
                        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow={content.faq.eyebrow}
            title={content.faq.title}
            intro={content.faq.intro}
          />
          <div className="mt-10 max-w-4xl">
            <Accordion className="space-y-3">
              {content.faq.entries.map((entry, index) => (
                <AccordionItem
                  key={entry.question}
                  value={`latam-faq-${index}`}
                  className="rounded-xl border-0 bg-white px-6 shadow-sm"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:text-primary">
                    {entry.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground">
                    {entry.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <DarkCta
        heading={content.cta.heading}
        description={content.cta.description}
      >
        <Button
          render={
            <TrackedContactLink
              href={whatsappHref}
              type="whatsapp"
              location={content.tracking.finalWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel={content.cta.whatsappLabel}
            />
          }
          size="lg"
          className="h-12 rounded-xl bg-white px-6 font-semibold text-foreground hover:bg-muted"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {content.cta.whatsappLabel}
        </Button>
        <Button
          render={
            <TrackedCtaLink
              href="/pricing/calculator"
              location={content.tracking.finalCalculator}
              text={content.cta.calculatorLabel}
            />
          }
          size="lg"
          variant="outline"
          className="h-12 rounded-xl border-2 border-white bg-transparent px-6 font-semibold text-white hover:bg-white hover:text-foreground"
        >
          {content.cta.calculatorLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DarkCta>
    </>
  );
}
