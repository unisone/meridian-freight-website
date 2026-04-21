import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Container,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
  PackageCheck,
  Scale,
  Ship,
  Tractor,
  Wheat,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { TrustBar } from "@/components/trust-bar";
import { FaqAccordion } from "@/components/faq-accordion";
import { DarkCta } from "@/components/dark-cta";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { KAZAKHSTAN_PATH, kazakhstanMarketPage } from "@/content/kazakhstan-market";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { classifyContainers } from "@/lib/schedule-display";
import type { PublicScheduleContainer } from "@/lib/types/shared-shipping";

interface KazakhstanMarketPageProps {
  containers: PublicScheduleContainer[] | null;
}

interface KazakhstanScheduleSummary {
  rows: PublicScheduleContainer[];
  bookable: PublicScheduleContainer[];
  inTransit: PublicScheduleContainer[];
  openCapacityCbm: number;
  featuredRows: PublicScheduleContainer[];
}

type LaneBoardStatusLabels = typeof kazakhstanMarketPage.laneBoardLabels.status;

const ruDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

const ruNumberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

function formatDate(date: string | null, placeholder: string): string {
  if (!date) return placeholder;
  const [year, month, day] = date.split("-").map(Number);
  return ruDateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

function formatCbm(value: number): string {
  return ruNumberFormatter.format(value);
}

function getScheduleSummary(
  containers: PublicScheduleContainer[] | null,
): KazakhstanScheduleSummary {
  const rows = containers?.filter((container) => container.destination_country === "KZ") ?? [];
  const classified = classifyContainers(rows);
  const featuredRows = [
    ...classified.bookable,
    ...classified.nonBookableUpcoming,
    ...classified.inTransit,
  ].slice(0, 5);

  return {
    rows,
    bookable: classified.bookable,
    inTransit: classified.inTransit,
    openCapacityCbm: classified.bookable.reduce(
      (total, container) => total + (container.available_cbm ?? 0),
      0,
    ),
    featuredRows,
  };
}

function getStatusLabel(
  container: PublicScheduleContainer,
  labels: LaneBoardStatusLabels,
): string {
  if (container.bookabilityStatus === "bookable") return labels.bookable;
  if (container.shippingState === "in-transit") return labels.inTransit;
  if (container.shippingState === "delivered") return labels.delivered;
  return labels.booked;
}

function getStatusClass(container: PublicScheduleContainer): string {
  if (container.bookabilityStatus === "bookable") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  if (container.shippingState === "in-transit") {
    return "border-sky-300 bg-sky-50 text-sky-700";
  }
  if (container.shippingState === "delivered") {
    return "border-zinc-300 bg-zinc-50 text-zinc-700";
  }
  return "border-amber-300 bg-amber-50 text-amber-700";
}

function ScheduleLaneBoard({
  summary,
  compact = false,
}: {
  summary: KazakhstanScheduleSummary;
  compact?: boolean;
}) {
  const content = kazakhstanMarketPage;
  const { laneBoardLabels } = content;
  const rows = compact ? summary.featuredRows.slice(0, 3) : summary.featuredRows;

  return (
    <div className="rounded-[28px] border border-white/15 bg-white/8 p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            {content.hero.laneBoardTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-sky-100">
            {content.hero.laneBoardSubtitle}
          </p>
        </div>
        <Badge className="border border-white/15 bg-white/10 text-white hover:bg-white/10">
          {laneBoardLabels.badge}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="font-mono text-2xl font-bold text-white">
            {summary.rows.length}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-sky-100">
            {content.schedule.metricRowsLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="font-mono text-2xl font-bold text-white">
            {formatCbm(summary.openCapacityCbm)}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-sky-100">
            {content.schedule.metricOpenSpaceLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="font-mono text-2xl font-bold text-white">
            {summary.inTransit.length}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-sky-100">
            {content.schedule.metricInTransitLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {rows.length > 0 ? (
          rows.map((container) => (
            <div
              key={container.id}
              className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm font-semibold text-white">
                  {container.project_number}
                </p>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusClass(container)}`}
                >
                  {getStatusLabel(container, laneBoardLabels.status)}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-xs leading-relaxed text-sky-100">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-sky-300" />
                  {container.originDisplay} → {container.destinationDisplay}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-sky-300" />
                  {formatDate(container.departure_date, laneBoardLabels.datePlaceholder)} / ETA {formatDate(container.eta_date, laneBoardLabels.datePlaceholder)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Container className="h-3.5 w-3.5 text-sky-300" />
                  {container.container_type}
                  {container.available_cbm && container.available_cbm > 0
                    ? ` · ${formatCbm(container.available_cbm)} ${content.schedule.openSpaceSuffix}`
                    : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-relaxed text-sky-100">
            {content.hero.laneBoardEmpty}
          </p>
        )}
      </div>
    </div>
  );
}

export function KazakhstanMarketPage({ containers }: KazakhstanMarketPageProps) {
  const content = kazakhstanMarketPage;
  const summary = getScheduleSummary(containers);
  const whatsappHref = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(
    content.hero.whatsappMessage,
  )}`;
  const pageUrl = `${SITE.url}${KAZAKHSTAN_PATH}`;
  const pagePublishedDate = "2026-04-21";
  const pageModifiedDate = "2026-04-21";

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "ru-RU",
    name: content.seo.title,
    description: content.seo.description,
    url: pageUrl,
    datePublished: pagePublishedDate,
    dateModified: pageModifiedDate,
    image: `${SITE.url}${SITE.ogImage}`,
    about: [
      "Доставка сельхозтехники из США в Казахстан",
      "Комбайны, тракторы, жатки и запчасти для покупателей в Казахстане",
      "Экспортная логистика от продавца в США до маршрута в Казахстан",
    ],
    mentions: [
      { "@type": "Place", name: "Астана" },
      { "@type": "Place", name: "Алматы" },
      { "@type": "Place", name: "Костанай" },
      { "@type": "Place", name: "Акмолинская область" },
      { "@type": "Place", name: "Кокшетау" },
      { "@type": "Place", name: "Павлодар" },
      { "@type": "Place", name: "Шымкент" },
      { "@type": "Organization", name: "John Deere" },
      { "@type": "Organization", name: "Case IH" },
      { "@type": "Organization", name: "Claas" },
      { "@type": "Organization", name: "MacDon" },
    ],
    potentialAction: {
      "@type": "ContactAction",
      target: whatsappHref,
      name: "Связаться в WhatsApp",
    },
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      telephone: CONTACT.phoneRaw,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ru-RU",
    mainEntity: content.faq.entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: `${SITE.url}/ru`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumbs.destinations,
        item: `${SITE.url}/ru/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.breadcrumbs.kazakhstan,
        item: pageUrl,
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Международная доставка сельхозтехники",
    name: content.seo.title,
    description: content.seo.description,
    url: pageUrl,
    inLanguage: "ru-RU",
    availableLanguage: ["ru", "en"],
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      telephone: CONTACT.phoneRaw,
    },
    areaServed: {
      "@type": "Country",
      name: "Казахстан",
      identifier: "KZ",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <PageHero
        variant="dark"
        locale="ru"
        currentPath="/destinations/kazakhstan"
        breadcrumbs={[
          { label: content.breadcrumbs.destinations, href: "/destinations" },
          { label: content.breadcrumbs.kazakhstan },
        ]}
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.description}
        rightContent={<ScheduleLaneBoard summary={summary} compact />}
      >
        <ul className="space-y-2.5 text-sm text-sky-200">
          {content.hero.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-sky-300" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <TrackedContactLink
            href={whatsappHref}
            type="whatsapp"
            location="kazakhstan_hero_whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {content.hero.primaryCtaLabel}
          </TrackedContactLink>
          <TrackedCtaLink
            href="/schedule?country=KZ"
            location="kazakhstan_hero_schedule"
            text={content.hero.scheduleCtaLabel}
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            {content.hero.scheduleCtaLabel}
          </TrackedCtaLink>
          <TrackedCtaLink
            href="/pricing/calculator"
            location="kazakhstan_hero_calculator"
            text={content.hero.calculatorCtaLabel}
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            {content.hero.calculatorCtaLabel}
          </TrackedCtaLink>
        </div>
      </PageHero>

      <TrustBar />

      <div>
        <section className="bg-[linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_100%)] py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {content.marketContext.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.marketContext.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.marketContext.intro}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {content.marketContext.sourceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              {content.marketContext.cards.map((card, idx) => {
                const Icon = idx === 0 ? Wheat : idx === 1 ? MapPin : Tractor;
                return (
                  <Card key={card.title} className="border-border/70 bg-white">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {content.scope.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.scope.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.scope.intro}
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border bg-white shadow-sm">
              <div className="grid lg:grid-cols-2">
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                    {content.scope.includedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.scope.included.map((item) => (
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

                <div className="border-t bg-amber-50/70 p-6 sm:border-t-0 sm:border-l sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                    {content.scope.excludedLabel}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {content.scope.excluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <Scale className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm leading-relaxed text-amber-950">
                {content.scope.note}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {content.equipmentFocus.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.equipmentFocus.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.equipmentFocus.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {content.equipmentFocus.items.map((item, idx) => {
                const Icon = idx === 0 ? Wheat : idx === 1 ? Tractor : idx === 2 ? Container : PackageCheck;
                return (
                  <Card
                    key={item.title}
                    className="h-full overflow-hidden border-border/70 bg-white transition-shadow hover:shadow-lg"
                  >
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {content.equipmentFocus.cardLabelPrefix} {idx + 1}
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
                        {item.fit}
                      </p>
                      <TrackedCtaLink
                        href={item.href}
                        location={`kazakhstan_equipment_${idx + 1}`}
                        text={item.linkLabel}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {item.linkLabel}
                        <ArrowRight className="h-4 w-4" />
                      </TrackedCtaLink>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
                {content.schedule.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {content.schedule.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-sky-100">
                {content.schedule.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <TrackedCtaLink
                  href="/schedule?country=KZ"
                  location="kazakhstan_schedule_link"
                  text={content.schedule.scheduleLinkLabel}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <Ship className="mr-2 h-4 w-4" />
                  {content.schedule.scheduleLinkLabel}
                </TrackedCtaLink>
                <TrackedContactLink
                  href={whatsappHref}
                  type="whatsapp"
                  location="kazakhstan_schedule_whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {content.schedule.whatsappLabel}
                </TrackedContactLink>
              </div>
            </div>

            <ScheduleLaneBoard summary={summary} />
          </div>
        </section>

        <section className="bg-stone-50 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {content.process.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.process.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.process.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {content.process.steps.map((step) => (
                <Card key={step.step} className="h-full border-border/70 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-bold text-primary">
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

            <DarkCta
              variant="card"
              className="mt-10"
              heading={content.midCta.heading}
              description={content.midCta.description}
              icon={
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
              }
            >
              <TrackedContactLink
                href={whatsappHref}
                type="whatsapp"
                location="kazakhstan_mid_whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {content.hero.primaryCtaLabel}
              </TrackedContactLink>
            </DarkCta>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {content.proofSection.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {content.proofSection.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {content.proofSection.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {content.proofLinks.map((item) => (
                <TrackedCtaLink
                  key={item.href}
                  href={item.href}
                  location="kazakhstan_proof_link"
                  text={item.label}
                  className="group rounded-2xl border bg-muted/40 p-5 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <p className="text-base font-bold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {content.proofSection.openLinkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </TrackedCtaLink>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {content.faq.sectionEyebrow}
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
            location="kazakhstan_final_whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {content.cta.whatsappLabel}
          </TrackedContactLink>
          <TrackedCtaLink
            href="/pricing/calculator"
            location="kazakhstan_final_calculator"
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
