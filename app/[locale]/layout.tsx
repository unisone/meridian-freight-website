import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollProgress } from "@/components/scroll-progress";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MetaPixel } from "@/components/meta-pixel";
import { AttributionCapture } from "@/components/attribution-capture";
import { COMPANY, CONTACT, SITE, SOCIAL } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `Machinery Export & Logistics | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: COMPANY.description,
  keywords: [
    "machinery packing",
    "container loading",
    "equipment dismantling",
    "heavy machinery export",
    "agricultural equipment export",
    "40ft container packing",
    "machinery shipping",
    "equipment logistics USA Canada",
  ],
  authors: [{ name: COMPANY.name }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE.url,
    languages: {
      en: SITE.url,
      es: `${SITE.url}/es`,
      ru: `${SITE.url}/ru`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: "6a04fca73120c14d",
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${COMPANY.tagline} | ${SITE.name}`,
    description: COMPANY.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: COMPANY.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.tagline} | ${SITE.name}`,
    description: COMPANY.description,
    images: [SITE.ogImage],
  },
};

// JSON-LD structured data for Organization + WebSite
function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    url: SITE.url,
    logo: `${SITE.url}/logos/MF Logos White/meridianFreight-logo-w-500.png`,
    description: COMPANY.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.state,
      postalCode: CONTACT.address.zip,
      addressCountry: CONTACT.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.1219,
      longitude: -93.0015,
    },
    telephone: CONTACT.phoneRaw,
    foundingDate: `${COMPANY.foundedYear}`,
    priceRange: "$$",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneRaw,
      contactType: "customer service",
      availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
    },
    sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: COMPANY.description,
    publisher: { "@type": "Organization", name: COMPANY.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <TooltipProvider>
            <ScrollProgress />
            <Header />
            <main className="pb-16 lg:pb-0">{children}</main>
            <Footer />
            <WhatsAppWidget />
            <MobileBottomBar />
            <CookieConsent />
          </TooltipProvider>
          <AttributionCapture />
          <GoogleAnalytics />
          <MetaPixel />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
