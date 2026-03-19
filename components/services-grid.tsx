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
    <section className="py-16 md:py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — editorial left-aligned */}
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            What We Do
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            Everything Between Seller and Port
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Each service below is something you&apos;d otherwise coordinate
            separately. We bundle them into one project with one invoice.
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
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary/80 group-hover:scale-110 group-hover:shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground leading-snug">
                        {service.shortTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80 link-underline">
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
