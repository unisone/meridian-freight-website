import { Package, MapPin, Ship, Send } from "lucide-react";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";

const steps = [
  {
    number: 1,
    title: "Describe Your Cargo",
    description:
      "Select your cargo type and tell us what you're shipping — machinery, parts, vehicles, or other goods.",
    icon: Package,
  },
  {
    number: 2,
    title: "Pick a Destination",
    description:
      "Choose the country you're shipping to. We'll show you containers heading that way with available space.",
    icon: MapPin,
  },
  {
    number: 3,
    title: "Select a Container",
    description:
      "Browse matching containers with real-time availability — departure date, free space in CBM, and port details.",
    icon: Ship,
  },
  {
    number: 4,
    title: "Submit Your Request",
    description:
      "Add your contact details and any notes. Our team reviews your request and sends a quote within 24 hours.",
    icon: Send,
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
              Four Simple Steps
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Book space in our shared containers and ship your cargo without paying for a full container.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
