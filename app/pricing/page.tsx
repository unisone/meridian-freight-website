import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PricingTable } from "@/components/pricing-table";

export const metadata: Metadata = {
  title: "Pricing — Equipment Packing & Shipping Rates",
  description:
    "Reference pricing for machinery packing, container loading, and international shipping. 40+ equipment types with transparent pricing.",
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Pricing" }]} />
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Equipment Pricing
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Transparent reference pricing for our machinery export services.
              Prices are subject to change — contact us for a current quote.
            </p>
          </div>

          {/* Calculator CTA */}
          <div className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center sm:p-8">
            <Calculator className="mx-auto h-8 w-8 text-blue-600" />
            <h2 className="mt-3 text-xl font-bold text-gray-900">
              Want an instant estimate?
            </h2>
            <p className="mt-2 text-gray-600">
              Use our freight calculator to get an estimated cost for your equipment and destination.
            </p>
            <Link href="/pricing/calculator" className="mt-4 inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
                Open Freight Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <PricingTable />
        </div>
      </section>
    </div>
  );
}
