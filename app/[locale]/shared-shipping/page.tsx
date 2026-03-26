import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContainerGrid } from "@/components/shared-shipping/container-grid";
import { HowItWorks } from "@/components/shared-shipping/how-it-works";
import { EmptyState } from "@/components/shared-shipping/empty-state";
import { fetchAvailableContainers, getLastSyncTime } from "@/lib/supabase-containers";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { Ship, DollarSign, Clock, ShieldCheck } from "lucide-react";
import { sharedShippingFaqEn } from "@/content/shared-shipping-faq";

export const revalidate = 900; // 15 min ISR (cron also triggers on-demand revalidation)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePath = locale === "en" ? "" : `/${locale}`;

  const title = "Shared Container Shipping — Book Space, Ship for Less";
  const description =
    "Book available space in our outbound shipping containers. Ship your cargo without paying for a full container. View real-time availability and request space online.";

  return {
    title,
    description,
    keywords: [
      "shared container shipping",
      "LCL shipping",
      "book container space",
      "less than container load",
      "partial container shipping",
      "shared shipping USA",
      "freight consolidation",
      "container space booking",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/shared-shipping`,
      languages: {
        en: `${SITE.url}/shared-shipping`,
        es: `${SITE.url}/es/shared-shipping`,
        ru: `${SITE.url}/ru/shared-shipping`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${title} | ${SITE.name}`,
      description,
      url: `${SITE.url}${localePath}/shared-shipping`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: title }],
    },
  };
}

const valueProps = [
  {
    icon: DollarSign,
    title: "Save Up to 70%",
    description: "Pay only for the space you use instead of a full container",
  },
  {
    icon: Clock,
    title: "No Waiting",
    description: "Join containers that are already scheduled to depart",
  },
  {
    icon: Ship,
    title: "Same Quality Service",
    description: "Professional packing, loading, and door-to-port delivery",
  },
  {
    icon: ShieldCheck,
    title: "Fully Insured",
    description: "Your cargo is protected throughout the entire journey",
  },
];

export default async function SharedShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [containers, lastSyncTime] = await Promise.all([
    fetchAvailableContainers(),
    getLastSyncTime(),
  ]);

  // JSON-LD Service schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Shared Container Shipping",
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      telephone: CONTACT.phoneRaw,
    },
    description:
      "Book available space in outbound shipping containers. Ship machinery, parts, and cargo without paying for a full container.",
    serviceType: "Freight Consolidation",
    areaServed: containers
      ? [...new Set(containers.map((c) => c.destination_country).filter(Boolean))]
      : [],
  };

  // FAQ JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sharedShippingFaqEn.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Shared Container Shipping
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Share a Container,{" "}
                <span className="text-primary">Ship for Less</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Don&apos;t need a full container? Book available space in our scheduled
                shipments and save up to 70% on shipping costs. Browse real-time
                availability below.
              </p>
            </div>
          </ScrollReveal>

          {/* Value props */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            {valueProps.map((prop, i) => (
              <ScrollReveal key={prop.title} delay={i * 0.08}>
                <div className="text-center p-3">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <prop.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold">{prop.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {prop.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Container Grid or Empty State */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {containers && containers.length > 0 ? (
            <ContainerGrid
              containers={containers}
              lastSyncTime={lastSyncTime}
            />
          ) : (
            <EmptyState variant="no-data" />
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-6">
            {sharedShippingFaqEn.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border-b border-border pb-5">
                  <h3 className="text-base font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Don&apos;t See Your Destination?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We ship to 27+ countries and add new routes regularly. Contact us to
              discuss your shipping needs.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                WhatsApp Us
              </a>
              <a
                href={CONTACT.phoneHref}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                or call {CONTACT.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
