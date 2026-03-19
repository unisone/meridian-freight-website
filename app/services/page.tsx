import { ServicesGrid } from "@/components/services-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProcessSteps } from "@/components/process-steps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Services — Machinery Export & Logistics",
  description: "Machinery export services: professional dismantling, container packing, global shipping, documentation & warehousing. One company, door to port. Free quotes.",
  path: "/services",
  keywords: [
    "machinery export services USA",
    "equipment dismantling for shipping",
    "container loading services",
    "export documentation compliance",
    "equipment warehousing USA Canada",
    "door to port machinery shipping",
    "heavy equipment packing company",
  ],
});

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Services" }]} />
      </div>
      <ServicesGrid />
      <ProcessSteps />

      {/* CTA */}
      <ScrollReveal variant="fade">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to Ship Your Machinery?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sky-300">
            Get a free, itemized quote for your machinery export — we respond within 24 hours.
          </p>
          <Button render={<Link href="/contact" />} size="lg" className="mt-6 h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
              Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}
