import { Search, FileText, Ship } from "lucide-react";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";

const steps = [
  {
    number: 1,
    title: "Browse Available Containers",
    description:
      "See our outbound containers with real-time availability — destination, departure date, and free space in CBM.",
    icon: Search,
  },
  {
    number: 2,
    title: "Request Space",
    description:
      "Found a container heading your way? Submit a quick request with your cargo details. No commitment — just an inquiry.",
    icon: FileText,
  },
  {
    number: 3,
    title: "We Handle the Rest",
    description:
      "Our team sends you a quote within 24 hours. Once confirmed, we coordinate pickup, packing, loading, and shipping.",
    icon: Ship,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Three Simple Steps
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Book space in our shared containers and ship your cargo without paying for a full container.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <StaggerItem key={step.number} index={i}>
              <div className="relative text-center p-6">
                {/* Step number circle */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>

                {/* Step number badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {step.number}
                </div>

                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
}
