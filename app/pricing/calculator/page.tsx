import { Ship } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorWizard } from "@/components/freight-calculator/calculator-wizard";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Freight Cost Calculator — Instant Estimate",
  description: "Get an instant freight cost estimate for your heavy equipment. Select your machinery type and destination for packing and shipping costs.",
  path: "/pricing/calculator",
  keywords: ["freight cost calculator heavy equipment", "machinery shipping cost estimator", "container loading cost calculator", "equipment export shipping rates"],
});

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

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Freight Estimation Tool
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Freight Calculator
              </h1>
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                <Ship className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Industrial-Grade Precision Estimator
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-muted-foreground">
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
