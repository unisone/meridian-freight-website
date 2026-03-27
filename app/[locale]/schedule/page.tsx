import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScheduleList } from "@/components/schedule/schedule-list";
import { ScheduleStats } from "@/components/schedule/schedule-stats";
import { ScheduleEmptyState } from "@/components/schedule/schedule-empty-state";
import { fetchScheduleContainers, getLastSyncTime } from "@/lib/supabase-containers";
import { computeScheduleStats } from "@/lib/schedule-display";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

export const revalidate = 900; // 15 min ISR (cron also triggers on-demand revalidation)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localePath = locale === "en" ? "" : `/${locale}`;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("scheduleTitle");
  const description = t("scheduleDescription");

  return {
    title,
    description,
    keywords: [
      "shipping schedule",
      "container departure schedule",
      "freight schedule USA",
      "machinery shipping dates",
      "container tracking",
      "ocean freight schedule",
      "container arrivals",
      "shipping timeline",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/schedule`,
      languages: {
        en: `${SITE.url}/schedule`,
        es: `${SITE.url}/es/schedule`,
        ru: `${SITE.url}/ru/schedule`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${title} | ${SITE.name}`,
      description,
      url: `${SITE.url}${localePath}/schedule`,
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

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [containers, lastSyncTime, t] = await Promise.all([
    fetchScheduleContainers(),
    getLastSyncTime(),
    getTranslations({ locale, namespace: "SchedulePage" }),
  ]);

  const stats = containers ? computeScheduleStats(containers) : null;

  // JSON-LD Service schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Shipping Schedule",
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      telephone: CONTACT.phoneRaw,
    },
    description:
      "Live shipping schedule showing container departures, in-transit shipments, and arrivals from the USA to 27+ countries.",
    serviceType: "Ocean Freight Schedule",
    areaServed: containers
      ? [...new Set(containers.map((c) => c.destination_country).filter(Boolean))]
      : [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        variant="gradient"
        breadcrumbs={[{ label: t("breadcrumb") }]}
        eyebrow={t("eyebrow")}
        heading={
          <>
            {t.rich("heading", {
              accent: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
            })}
          </>
        }
        description={t("description")}
      >
        {stats && <ScheduleStats stats={stats} />}
      </PageHero>

      {/* Schedule List */}
      <section className="pt-2 pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {containers && containers.length > 0 ? (
            <ScheduleList
              containers={containers}
              lastSyncTime={lastSyncTime}
            />
          ) : (
            <ScheduleEmptyState variant="no-data" />
          )}
        </div>
      </section>

      {/* CTA: Book Space */}
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
                href="/shared-shipping"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {t("ctaBookSpace")}
              </a>
              <a
                href={CONTACT.emailHref}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("ctaOrContact", { email: CONTACT.email })}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
