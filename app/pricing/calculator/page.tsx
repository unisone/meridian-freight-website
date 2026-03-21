import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorWizard } from "@/components/freight-calculator/calculator-wizard";
import { pageMetadata } from "@/lib/metadata";
import { COMPANY, SITE } from "@/lib/constants";

export const metadata = pageMetadata({
  title: "Freight Cost Calculator — Instant Estimate",
  description: "Free freight calculator — instant estimate for machinery export. Select equipment, ZIP code & destination. Packing + shipping costs in 60 seconds.",
  path: "/pricing/calculator",
  keywords: ["freight cost calculator heavy equipment", "machinery shipping cost estimator", "container loading cost calculator", "equipment export shipping rates"],
});

export default function CalculatorPage() {
  const calculatorJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Freight Cost Calculator",
    description: "Free online calculator for estimating machinery export costs including inland freight, packing, and ocean shipping.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Pricing", href: "/pricing" },
            { label: "Freight Calculator" },
          ]}
        />
      </div>

      {/* Hero band — matches pricing page pattern */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Freight Cost Calculator
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get an instant estimate for your machinery export. Select your
            equipment and destination — we&apos;ll calculate packing and shipping costs.
          </p>
        </div>
      </div>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CalculatorWizard />
        </div>
      </section>
    </div>
  );
}
