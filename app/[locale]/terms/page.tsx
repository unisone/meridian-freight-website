import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
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
      locale: getOgLocale(locale),
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
  const t = await getTranslations({ locale, namespace: "TermsPage" });

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
      </div>

      <article className="py-16 md:py-20">
        <div className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1>{t("heading")}</h1>
          <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>

          <h2>{t("section1Title")}</h2>
          <p>
            {t("section1Description", { company: COMPANY.name })}
          </p>

          <h2>{t("section2Title")}</h2>
          <p>
            {t("section2Description")}
          </p>

          <h2>{t("section3Title")}</h2>
          <p>
            {t("section3Description")}
          </p>

          <h2>{t("section4Title")}</h2>
          <p>
            {t("section4Description")}
          </p>

          <h2>{t("section5Title")}</h2>
          <p>
            {t("section5Description")}
          </p>

          <h2>{t("section6Title")}</h2>
          <p>
            {t("section6Description")}
          </p>

          <h2>{t("section7Title")}</h2>
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
