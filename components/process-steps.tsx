import { MessageSquare, Truck, Package, Globe } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Consultation",
    description: "Tell us about your equipment and destination. We provide a detailed quote within 24 hours.",
    icon: MessageSquare,
  },
  {
    number: 2,
    title: "Equipment Pickup",
    description: "We collect from anywhere in USA & Canada with our specialized transport fleet.",
    icon: Truck,
  },
  {
    number: 3,
    title: "Packing & Loading",
    description: "Expert dismantling, documentation, and secure container packing at our facilities.",
    icon: Package,
  },
  {
    number: 4,
    title: "Global Shipping",
    description: "Door-to-port delivery worldwide with full tracking and export documentation.",
    icon: Globe,
  },
];

export function ProcessSteps() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-500">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Simple 4-Step Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            From your first call to delivery at the destination port — we handle everything.
          </p>
        </div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-sky-200 lg:block" />

          <div className="grid gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative flex lg:flex-col lg:items-center lg:text-center">
                {/* Mobile: vertical line between steps */}
                {step.number < 4 && (
                  <div className="absolute left-6 top-16 h-full w-0.5 bg-sky-200 lg:hidden" />
                )}

                {/* Number circle */}
                <div className="relative z-10 mr-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-lg lg:mr-0 lg:mb-6">
                  {step.number}
                </div>

                {/* Content */}
                <div className="pb-8 lg:pb-0">
                  <div className="mb-2 flex items-center gap-2 lg:justify-center">
                    <step.icon className="h-5 w-5 text-sky-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 lg:mx-auto lg:max-w-[220px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
