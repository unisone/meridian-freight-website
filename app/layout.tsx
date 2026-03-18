import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MetaPixel } from "@/components/meta-pixel";
import { COMPANY, CONTACT, SITE, SOCIAL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${COMPANY.tagline} | ${SITE.name}`,
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
  openGraph: {
    type: "website",
    locale: "en_US",
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
    "@type": "Organization",
    name: COMPANY.name,
    url: SITE.url,
    logo: `${SITE.url}/logos/MF Logos White/meridianFreight-logo-w-500.png`,
    description: COMPANY.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.state,
      addressCountry: CONTACT.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneRaw,
      contactType: "customer service",
      availableLanguage: ["English", "Russian", "Spanish"],
    },
    sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.youtube],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="bg-background text-foreground antialiased">
        <TooltipProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppWidget />
          <MobileBottomBar />
          <CookieConsent />
        </TooltipProvider>
        <GoogleAnalytics />
        <MetaPixel />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
