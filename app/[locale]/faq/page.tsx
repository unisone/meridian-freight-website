import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { FaqAccordion } from "@/components/faq-accordion";
import { getAllFaqEntries } from "@/content/faq";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { DarkCta } from "@/components/dark-cta";
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
    title: t("faqTitle"),
    description: t("faqDescription"),
    keywords: [
      "machinery export FAQ",
      "equipment shipping questions",
      "container packing guide",
      "export documentation help",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/faq`,
      languages: {
        en: `${SITE.url}/faq`,
        es: `${SITE.url}/es/faq`,
        ru: `${SITE.url}/ru/faq`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("faqTitle")} | ${SITE.name}`,
      description: t("faqDescription"),
      url: `${SITE.url}${localePath}/faq`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("faqTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("faqTitle")} | ${SITE.name}`,
      description: t("faqDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FaqPage");
  const tc = await getTranslations("Common");

  const faqEntries = getAllFaqEntries(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqEntries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
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
          <>{t.rich("heading", {
            accent: (chunks) => <span className="text-primary">{chunks}</span>,
          })}</>
        }
        description={t("description")}
      />
      <div>
        <FaqAccordion entries={faqEntries} />

        {/* CTA */}
        <ScrollReveal variant="fade">
          <DarkCta heading={t("stillHaveQuestions")} description={t("stillHaveQuestionsDescription")}>
            <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
              <Mail className="mr-2 h-4 w-4" /> {tc("contactUs")}
            </Button>
            <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={tc("chatOnWhatsApp")} />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
              <Phone className="mr-2 h-4 w-4" /> {tc("chatOnWhatsApp")}
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
