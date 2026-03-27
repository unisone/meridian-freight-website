import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    keywords: [
      "contact machinery export company",
      "get freight quote",
      "free equipment shipping quote",
      "machinery logistics contact USA",
      "WhatsApp machinery export quote",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/contact`,
      languages: {
        en: `${SITE.url}/contact`,
        es: `${SITE.url}/es/contact`,
        ru: `${SITE.url}/ru/contact`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("contactTitle")} | ${SITE.name}`,
      description: t("contactDescription"),
      url: `${SITE.url}${localePath}/contact`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("contactTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("contactTitle")} | ${SITE.name}`,
      description: t("contactDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: CONTACT.phoneRaw,
        contactType: "customer service",
        availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <PageHero
        breadcrumbs={[{ label: t("breadcrumb") }]}
        heading={t("heading")}
        description={t("description")}
      />

      <section className="bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                {t("requestYourQuote")}
              </h2>
              <ContactForm />
            </div>
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
