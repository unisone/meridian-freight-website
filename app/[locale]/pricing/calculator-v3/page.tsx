import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CalculatorV3Wizard } from "@/components/freight-calculator-v3/calculator-v3-wizard";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/constants";
import { getOgLocale } from "@/lib/i18n-utils";

const PAGE_COPY = {
  en: {
    title: "Freight Calculator V3 Preview",
    description:
      "Preview machinery export freight by equipment, shipping mode, route, transit time, compliance services, and separate indicative import-cost estimates.",
    eyebrow: "Noindex preview",
    heading: "Freight Calculator V3",
    accent: "route-aware preview",
    body:
      "Select equipment, shipping mode, destination port, and route preference to preview freight separately from public-data import-cost estimates.",
    breadcrumb: "Calculator V3",
  },
  es: {
    title: "Vista previa Calculadora de Flete V3",
    description:
      "Vista previa de flete por equipo, modo de envio, ruta, transito, servicios de cumplimiento y costos indicativos de importacion separados.",
    eyebrow: "Vista noindex",
    heading: "Calculadora de Flete V3",
    accent: "vista por ruta",
    body:
      "Seleccione equipo, modo de envio, puerto destino y preferencia de ruta para separar flete de estimaciones publicas de importacion.",
    breadcrumb: "Calculadora V3",
  },
  ru: {
    title: "Предпросмотр калькулятора фрахта V3",
    description:
      "Предпросмотр фрахта по технике, способу отправки, маршруту, транзиту, требованиям и отдельной импортной оценке.",
    eyebrow: "Noindex предпросмотр",
    heading: "Калькулятор фрахта V3",
    accent: "маршрутный расчет",
    body:
      "Выберите технику, способ отправки, порт назначения и приоритет маршрута, чтобы отделить фрахт от публичной импортной оценки.",
    breadcrumb: "Калькулятор V3",
  },
} as const;

function normalizeLocale(locale: string): keyof typeof PAGE_COPY {
  return locale === "es" || locale === "ru" ? locale : "en";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const copy = PAGE_COPY[normalizedLocale];
  const localePath = normalizedLocale === "en" ? "" : `/${normalizedLocale}`;

  return {
    title: copy.title,
    description: copy.description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    alternates: {
      canonical: `${SITE.url}${localePath}/pricing/calculator-v3`,
      languages: {
        en: `${SITE.url}/pricing/calculator-v3`,
        es: `${SITE.url}/es/pricing/calculator-v3`,
        ru: `${SITE.url}/ru/pricing/calculator-v3`,
      },
    },
    openGraph: {
      locale: getOgLocale(normalizedLocale),
      title: `${copy.title} | ${SITE.name}`,
      description: copy.description,
      url: `${SITE.url}${localePath}/pricing/calculator-v3`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: copy.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.title} | ${SITE.name}`,
      description: copy.description,
      images: [SITE.ogImage],
    },
  };
}

export default async function CalculatorV3Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const copy = PAGE_COPY[normalizedLocale];
  setRequestLocale(normalizedLocale);

  return (
    <>
      <PageHero
        variant="gradient"
        breadcrumbs={[
          { label: "Pricing", href: "/pricing" },
          { label: copy.breadcrumb },
        ]}
        eyebrow={copy.eyebrow}
        heading={
          <>
            {copy.heading}{" "}
            <span className="text-primary">{copy.accent}</span>
          </>
        }
        description={copy.body}
      />

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CalculatorV3Wizard locale={normalizedLocale} surface="preview" />
        </div>
      </section>
    </>
  );
}
