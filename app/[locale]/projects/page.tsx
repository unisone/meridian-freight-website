import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectGrid } from "@/components/project-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllProjects } from "@/content/projects";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT, SITE } from "@/lib/constants";
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
      title: `${t("projectsTitle")} | ${SITE.name}`,
      description: t("projectsDescription"),
      url: `${SITE.url}${localePath}/projects`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("projectsTitle") }],
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
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">{t("heading")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("description")}</p>
        </div>
        <ProjectGrid />

        {/* CTA */}
        <ScrollReveal variant="fade">
        <section className="mt-16 rounded-2xl bg-slate-900 py-12 sm:py-16 mb-16">
          <div className="mx-auto max-w-3xl px-4 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("ctaHeading")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              {t("ctaDescription")}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>
    </>
  );
}
