import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { pageMetadata } from "@/lib/metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";

export const metadata = pageMetadata({
  title: "Contact Us — Free Machinery Export Quote in 24 Hours",
  description: "Get a free machinery export quote — we respond within 24 hours. Reach us via WhatsApp, phone, or email. 500+ equipment exports from USA & Canada.",
  path: "/contact",
  keywords: [
    "contact machinery export company",
    "get freight quote",
    "free equipment shipping quote",
    "machinery logistics contact USA",
    "WhatsApp machinery export quote",
  ],
});

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: CONTACT.phoneRaw,
        contactType: "customer service",
        availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
      },
    },
  };

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />
      </div>

      <section className="bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>
          </ScrollReveal>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                {t("requestYourQuote")}
              </h2>
              <ContactForm />
            </div>
            <ContactInfo />
          </div>
        </div>
      </section>
    </div>
  );
}
