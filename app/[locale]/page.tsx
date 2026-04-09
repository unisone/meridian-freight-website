import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle, BarChart3 } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { PartnersStrip } from "@/components/partners-strip";
import { ServicesGrid } from "@/components/services-grid";
import { ProcessSteps } from "@/components/process-steps";
import { ProjectGrid } from "@/components/project-grid";
import { VideoSection } from "@/components/video-section";
import { FaqAccordion } from "@/components/faq-accordion";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { ScrollReveal } from "@/components/scroll-reveal";
import { DarkCta } from "@/components/dark-cta";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";
import { getHomepageFaq } from "@/content/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    keywords: [
      "machinery export USA",
      "container packing services",
      "equipment shipping USA Canada",
      "agricultural equipment export",
      "heavy machinery dismantling",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}`,
      languages: {
        en: SITE.url,
        es: `${SITE.url}/es`,
        ru: `${SITE.url}/ru`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("homeTitle")} | ${SITE.name}`,
      description: t("homeDescription"),
      url: `${SITE.url}${localePath}`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: COMPANY.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("homeTitle")} | ${SITE.name}`,
      description: t("homeDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const tc = await getTranslations("Common");

  const homepageFaq = getHomepageFaq(locale);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: homepageFaq.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    inLanguage: locale,
    name: "Meridian Freight — Machinery Dismantling, Packing & Container Loading",
    description:
      "Watch our team dismantle, pack, and load heavy equipment into shipping containers at our Iowa facility. Full-service machinery export from USA & Canada.",
    thumbnailUrl: "https://img.youtube.com/vi/SrjUBSD2_5Q/maxresdefault.jpg",
    uploadDate: "2024-01-15",
    contentUrl: "https://www.youtube.com/watch?v=SrjUBSD2_5Q",
    embedUrl: "https://www.youtube-nocookie.com/embed/SrjUBSD2_5Q",
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logos/MF Logos White/meridianFreight-logo-mobile-w-150.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <Hero />
      <TrustBar />
      <PartnersStrip />

      {/* ServicesGrid handles its own stagger internally */}
      <ServicesGrid />

      {/* ProcessSteps handles its own scroll-linked animation internally */}
      <ProcessSteps />

      {/* Mid-page CTA */}
      <ScrollReveal variant="fade">
        <div className="py-8 text-center">
          <p className="text-lg font-medium text-foreground">{t("readyToShip")}</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={tc("chatOnWhatsApp")} />}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {tc("chatOnWhatsApp")}
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground rounded-lg"
              render={<Link href="/contact" />}
            >
              {tc("contactUs")}
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* ProjectGrid handles its own stagger internally */}
      <ProjectGrid limit={6} />

      {/* Calculator CTA */}
      <ScrollReveal variant="scale">
        <DarkCta
          heading={t("calcHeading")}
          description={t("calcDescription")}
          icon={<BarChart3 className="mx-auto h-8 w-8 text-sky-400" />}
        >
          <Button
            size="lg"
            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
            render={<Link href="/pricing/calculator" />}
          >
            {t("openCalculator")}
            <ArrowRight className="ml-2 h-4 w-4 animate-nudge-right" />
          </Button>
        </DarkCta>
      </ScrollReveal>

      <ScrollReveal>
        <VideoSection />
      </ScrollReveal>

      <ScrollReveal>
        <FaqAccordion entries={homepageFaq} showViewAll />
      </ScrollReveal>

      {/* Contact section */}
      <ScrollReveal>
        <section id="contact" className="py-16 md:py-28 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 sm:mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {t("contactEyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
                {t("contactHeading")}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                {t("contactDescription")}
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
                <h3 className="mb-6 text-2xl font-bold text-foreground">
                  {t("requestYourQuote")}
                </h3>
                <ContactForm />
              </div>
              <ContactInfo />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
