import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqAccordion } from "@/components/faq-accordion";
import { getAllFaqEntries } from "@/content/faq";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT, SITE } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
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
      title: `${t("faqTitle")} | ${SITE.name}`,
      description: t("faqDescription"),
      url: `${SITE.url}${localePath}/faq`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("faqTitle") }],
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
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">{t("heading")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("description")}</p>
        </div>
        <FaqAccordion entries={faqEntries} />

        {/* CTA */}
        <ScrollReveal variant="fade">
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("stillHaveQuestions")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sky-300 text-lg">
              {t("stillHaveQuestionsDescription")}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
                  <Mail className="mr-2 h-4 w-4" /> {tc("contactUs")}
              </Button>
              <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={tc("chatOnWhatsApp")} />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
                  <Phone className="mr-2 h-4 w-4" /> {tc("chatOnWhatsApp")}
              </Button>
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>
    </>
  );
}
