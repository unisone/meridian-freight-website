import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
    keywords: ["terms of service", "terms and conditions", "service agreement"],
    alternates: {
      canonical: `${SITE.url}${localePath}/terms`,
      languages: {
        en: `${SITE.url}/terms`,
        es: `${SITE.url}/es/terms`,
        ru: `${SITE.url}/ru/terms`,
      },
    },
    openGraph: {
      title: `${t("termsTitle")} | ${SITE.name}`,
      description: t("termsDescription"),
      url: `${SITE.url}${localePath}/terms`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("termsTitle") }],
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Terms of Service" }]} />
      </div>

      <article className="py-16 md:py-20">
        <div className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1>Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: March 2026</p>

          <h2>1. Services</h2>
          <p>
            {COMPANY.name} provides machinery dismantling, container packing,
            storage, export documentation, and shipping coordination services.
            All services are subject to individual project agreements and quotes.
          </p>

          <h2>2. Quotes and Pricing</h2>
          <p>
            All quotes are estimates and may be subject to change based on
            actual equipment condition, accessibility, and market conditions.
            Final pricing is confirmed in writing before work begins. Prices
            displayed on the website are for reference and may not reflect
            current rates.
          </p>

          <h2>3. Payment Terms</h2>
          <p>
            Payment terms are established in individual project agreements.
            Standard terms require a deposit before work begins with the
            balance due upon completion.
          </p>

          <h2>4. Liability</h2>
          <p>
            While we take every precaution to protect your equipment, our
            liability is limited to the coverage provided by our insurance
            policies. We carry comprehensive coverage for equipment in our
            care, custody, and control.
          </p>

          <h2>5. Cancellation</h2>
          <p>
            Projects may be cancelled with written notice. Cancellation fees
            may apply if work has already commenced. Deposits for completed
            work are non-refundable.
          </p>

          <h2>6. Website Use</h2>
          <p>
            The freight calculator and pricing information on this website are
            provided for estimation purposes only and do not constitute a
            binding offer. Actual costs may vary.
          </p>

          <h2>7. Contact</h2>
          <p>
            {COMPANY.name}<br />
            {CONTACT.address.full}<br />
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          </p>
        </div>
      </article>
    </div>
  );
}
