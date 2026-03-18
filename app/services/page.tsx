import { ServicesGrid } from "@/components/services-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProcessSteps } from "@/components/process-steps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Services — Machinery Export & Logistics",
  description: "Complete machinery export services: dismantling, container packing, shipping, documentation, storage, and equipment procurement across USA & Canada.",
  path: "/services",
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
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sky-300">
            Contact us for a free quote on your machinery export project.
          </p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-semibold shadow-lg">
              Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
