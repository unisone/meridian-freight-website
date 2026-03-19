import Link from "next/link";
import {
  Package,
  Truck,
  Wheat,
  Search,
  FileText,
  Warehouse,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerItem } from "@/components/scroll-reveal";
import { services } from "@/content/services";

const iconMap: Record<string, typeof Package> = {
  Package,
  Truck,
  Wheat,
  Search,
  FileText,
  Warehouse,
};

export function ServicesGrid() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — editorial left-aligned */}
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-500">
            What We Do
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Our Services
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            End-to-end machinery export solutions — from equipment pickup and
            dismantling to container packing and global shipping.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon] ?? Package;
            return (
              <StaggerItem key={service.slug} index={idx}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group active:scale-[0.99]"
                >
                  <Card className="h-full border-0 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                    <CardContent className="p-6 sm:p-8">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-500 transition-all duration-300 group-hover:bg-sky-200 group-hover:text-sky-600 group-hover:scale-110 group-hover:shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {service.shortTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {service.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-500 transition-colors group-hover:text-sky-600 link-underline">
                        Learn More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
