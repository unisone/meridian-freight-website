import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { DarkCta } from "@/components/dark-cta";
import { Button } from "@/components/ui/button";
import { getAllEquipmentTypes } from "@/content/equipment";
import { SITE } from "@/lib/constants";
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
    title: t("equipmentTitle"),
    description: t("equipmentDescription"),
    keywords: [
      "machinery export equipment types",
      "ship combines tractors excavators",
      "heavy equipment shipping USA",
      "farm equipment export",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/equipment`,
      languages: {
        en: `${SITE.url}/equipment`,
        es: `${SITE.url}/es/equipment`,
        ru: `${SITE.url}/ru/equipment`,
      },
    },
    openGraph: {
      locale: getOgLocale(locale),
      title: `${t("equipmentTitle")} | ${SITE.name}`,
      description: t("equipmentDescription"),
      url: `${SITE.url}${localePath}/equipment`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t("equipmentTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("equipmentTitle")} | ${SITE.name}`,
      description: t("equipmentDescription"),
      images: [SITE.ogImage],
    },
  };
}

export default async function EquipmentIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("EquipmentPage");
  const equipmentTypes = getAllEquipmentTypes(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: locale,
    name: t("breadcrumb"),
    numberOfItems: equipmentTypes.length,
    itemListElement: equipmentTypes.map((e, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: e.title,
      url: `${SITE.url}/equipment/${e.slug}`,
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
        locale={locale}
        currentPath="/equipment"
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
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {equipmentTypes.map((eq, idx) => (
                <StaggerItem key={eq.slug} index={idx}>
                  <Link href={`/equipment/${eq.slug}`} className="group">
                    <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Truck className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground leading-snug">
                          {eq.pluralName}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {eq.heroDescription}
                        </p>
                        {eq.typicalPriceRange && (
                          <p className="mt-3 text-xs font-medium text-primary">
                            {t("from")} {eq.typicalPriceRange}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {eq.brands.slice(0, 3).map((b) => (
                            <Badge key={b} variant="secondary" className="text-[10px] px-2 py-0.5">
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>

        <ScrollReveal variant="fade">
          <DarkCta
            heading={t("ctaHeading")}
            description={t("ctaDescription")}
          >
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg"
            >
              {t("ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DarkCta>
        </ScrollReveal>
      </div>
    </>
  );
}
