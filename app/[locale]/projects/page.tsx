import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { MessageCircle, ArrowRight } from "lucide-react";
import { DarkCta } from "@/components/dark-cta";
import { Button } from "@/components/ui/button";
import { ProjectGrid } from "@/components/project-grid";
import { PageHero } from "@/components/page-hero";
import { getAllProjects } from "@/content/projects";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT, SITE } from "@/lib/constants";
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
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    keywords: [
      "machinery export projects",
      "equipment shipping portfolio",
      "container packing examples",
      "heavy machinery export case studies",
      "John Deere combine export",
      "Case IH equipment shipping",
      "flat rack machinery shipping",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/projects`,
      languages: {
        en: `${SITE.url}/projects`,
        es: `${SITE.url}/es/projects`,
        ru: `${SITE.url}/ru/projects`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("projectsTitle")} | ${SITE.name}`,
      description: t("projectsDescription"),
      url: `${SITE.url}${localePath}/projects`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("projectsTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("projectsTitle")} | ${SITE.name}`,
      description: t("projectsDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });

  const projects = getAllProjects(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: locale,
    name: "Meridian Freight Export Projects",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      description: p.description,
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
        <ProjectGrid hideHeader />

        {/* CTA */}
        <ScrollReveal variant="fade">
          <DarkCta variant="card" className="mt-16 mb-16" heading={t("ctaHeading")} description={t("ctaDescription")}>
            <Button
              render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={t("ctaWhatsAppAriaLabel")} />}
              size="lg"
              className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t("ctaWhatsApp")}
            </Button>
            <Button
              render={<Link href="/contact" />}
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
            >
              {t("ctaContact")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
