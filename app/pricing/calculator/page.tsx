import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorWizard } from "@/components/freight-calculator/calculator-wizard";

export const metadata: Metadata = {
  title: "Freight Cost Calculator — Instant Estimate",
  description:
    "Get an instant freight cost estimate for your heavy equipment. Select your machinery type and destination for packing and shipping costs.",
  keywords: [
    "freight cost calculator heavy equipment",
    "machinery shipping cost estimator",
    "container loading cost calculator",
    "equipment export shipping rates",
  ],
};

export default function CalculatorPage() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Pricing", href: "/pricing" },
            { label: "Freight Calculator" },
          ]}
        />
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Freight Cost Calculator
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Get an instant estimate for your machinery export. Select your
              equipment and destination — we&apos;ll calculate packing and shipping costs.
            </p>
          </div>

          <CalculatorWizard />
        </div>
      </section>
    </div>
  );
}
