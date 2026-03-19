import Link from "next/link";
import { Calculator, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PricingTable } from "@/components/pricing-table";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT, COMPANY, SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Pricing — Equipment Packing & Shipping Rates",
  description: "Transparent machinery export pricing — 60+ equipment types, 20+ shipping routes. Itemized quotes with no hidden fees. Try our instant freight calculator.",
  path: "/pricing",
  keywords: [
    "equipment packing costs",
    "machinery shipping rates",
    "container loading pricing",
    "freight cost estimate",
    "how much to ship machinery overseas",
    "equipment export pricing no hidden fees",
    "machinery packing cost per unit",
  ],
});

export default function PricingPage() {
  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    offerCount: 40,
    lowPrice: "1500",
    highPrice: "12000",
    description:
      "Reference pricing for machinery packing, container loading, and international shipping services.",
    seller: {
      "@type": "Organization",
      name: COMPANY.name,
      url: SITE.url,
    },
  };

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Pricing" }]} />
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              What It Costs — No Hidden Fees
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Reference rates for 60+ equipment types and 20+ shipping routes.
              Every quote includes detailed line items — no hidden fees.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70">
              Rates updated quarterly. Last reviewed: Q1 2026.
            </p>
          </div>

          {/* Calculator CTA */}
          <ScrollReveal variant="fade">
          <div className="mb-12 rounded-xl bg-primary/5 p-6 text-center shadow-sm sm:p-8">
            <Calculator className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-xl font-bold text-foreground">
              Want an instant estimate?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Use our freight calculator to get an estimated cost for your equipment and destination.
            </p>
            <Button render={<Link href="/pricing/calculator" />} className="mt-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
                Open Freight Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          </ScrollReveal>

          <PricingTable />

          {/* Bottom CTA */}
          <ScrollReveal variant="fade">
          <section className="mt-16 rounded-2xl bg-slate-900 py-12 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 text-center text-white">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Need an Exact Number?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-300">
                The rates above are reference estimates. Tell us your equipment
                and destination — we&apos;ll send a precise, itemized quote within 24 hours.
              </p>
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                    render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp for a pricing quote" />}
                    size="lg"
                    className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                </Button>
                <Button
                    render={<Link href="/contact" />}
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
