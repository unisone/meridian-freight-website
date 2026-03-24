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
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    keywords: ["privacy policy", "data protection", "privacy notice"],
    alternates: {
      canonical: `${SITE.url}${localePath}/privacy`,
      languages: {
        en: `${SITE.url}/privacy`,
        es: `${SITE.url}/es/privacy`,
        ru: `${SITE.url}/ru/privacy`,
      },
    },
    openGraph: {
      title: `${t("privacyTitle")} | ${SITE.name}`,
      description: t("privacyDescription"),
      url: `${SITE.url}${localePath}/privacy`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("privacyTitle") }],
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
      </div>

      <article className="py-16 md:py-20">
        <div className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1>{t("heading")}</h1>
          <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>

          <h2>{t("infoWeCollect")}</h2>
          <p>
            {t("infoWeCollectDescription")}
          </p>
          <ul>
            <li>{t("infoItem1")}</li>
            <li>{t("infoItem2")}</li>
            <li>{t("infoItem3")}</li>
            <li>{t("infoItem4")}</li>
          </ul>

          <h2>{t("howWeUse")}</h2>
          <ul>
            <li>{t("useItem1")}</li>
            <li>{t("useItem2")}</li>
            <li>{t("useItem3")}</li>
            <li>{t("useItem4")}</li>
          </ul>

          <h2>{t("thirdPartyServices")}</h2>
          <p>{t("thirdPartyDescription")}</p>
          <ul>
            <li><strong>Google Analytics 4</strong> — {t("thirdPartyGA4")}</li>
            <li><strong>Meta Pixel</strong> — {t("thirdPartyMeta")}</li>
            <li><strong>Vercel Analytics</strong> — {t("thirdPartyVercel")}</li>
            <li><strong>Supabase</strong> — {t("thirdPartySupabase")}</li>
            <li><strong>Resend</strong> — {t("thirdPartyResend")}</li>
          </ul>

          <h2>{t("dataRetention")}</h2>
          <p>
            {t("dataRetentionDescription")}
          </p>

          <h2>{t("yourRights")}</h2>
          <p>
            {t("yourRightsDescription")}{" "}
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>.
          </p>

          <h2>{t("contact")}</h2>
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
