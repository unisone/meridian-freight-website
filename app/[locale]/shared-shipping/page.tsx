import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ShippingWizard } from "@/components/shared-shipping/shipping-wizard";
import { EmptyState } from "@/components/shared-shipping/empty-state";
import { fetchAvailableContainers, getLastSyncTime } from "@/lib/supabase-containers";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import {
  sharedShippingFaqEn,
  sharedShippingFaqEs,
  sharedShippingFaqRu,
} from "@/content/shared-shipping-faq";

export const revalidate = 900; // 15 min ISR (cron also triggers on-demand revalidation)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePath = locale === "en" ? "" : `/${locale}`;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("sharedShippingTitle");
  const description = t("sharedShippingDescription");

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
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [SITE.ogImage],
    },
  };
}

export default async function SharedShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [containers, lastSyncTime, t] = await Promise.all([
    fetchAvailableContainers(),
    getLastSyncTime(),
    getTranslations({ locale, namespace: "SharedShippingPage" }),
  ]);

  // Locale-aware FAQ selection
  const faqEntries =
    locale === "es"
      ? sharedShippingFaqEs
      : locale === "ru"
        ? sharedShippingFaqRu
        : sharedShippingFaqEn;

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

  // FAQ JSON-LD (locale-aware)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqEntries.map((faq) => ({
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

      <PageHero
        variant="gradient"
        breadcrumbs={[{ label: t("breadcrumb") }]}
        eyebrow={t("eyebrow")}
        heading={<>{t.rich("heading", {
          accent: (chunks) => <span className="text-primary">{chunks}</span>,
        })}</>}
        description={t("description")}
        authority={t("authority")}
      />

      {/* Booking Wizard — the centerpiece */}
      <section className="pt-6 pb-16 md:pt-8 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {containers && containers.length > 0 ? (
            <ShippingWizard
              containers={containers}
              lastSyncTime={lastSyncTime}
            />
          ) : (
            <EmptyState variant="no-data" />
          )}
        </div>
      </section>

      {/* FAQ — inline accordion at consistent max-w-7xl */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("faqHeading")}
            </h2>
          </ScrollReveal>
          <Accordion className="mt-6 space-y-3">
            {faqEntries.map((faq, idx) => (
              <AccordionItem
                key={`faq-${idx}`}
                value={`faq-${idx}`}
                className="rounded-xl border-0 bg-white px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("ctaHeading")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {t("ctaDescription")}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {t("ctaWhatsApp")}
              </a>
              <a
                href={CONTACT.emailHref}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("ctaOrEmail", { email: CONTACT.email })}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
