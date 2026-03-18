import { Globe, Cog, MapPin, Calendar } from "lucide-react";
import { STATS, WAREHOUSE_LOCATIONS } from "@/lib/constants";

const signals = [
  {
    icon: Globe,
    value: "30+",
    label: "Countries Served",
    description: "Delivering to ports worldwide",
  },
  {
    icon: Cog,
    value: "50+",
    label: "Equipment Types",
    description: "From combines to excavators",
  },
  {
    icon: MapPin,
    value: String(WAREHOUSE_LOCATIONS.length),
    label: "Warehouse Locations",
    description: "Across USA & Canada",
  },
  {
    icon: Calendar,
    value: `${STATS.yearsExperience}+`,
    label: "Years in Operation",
    description: "Trusted since 2015",
  },
];

export function TrustSignals() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Trusted by Companies Worldwide
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <signal.icon className="h-6 w-6" />
              </div>
              <div className="font-mono text-3xl font-bold text-gray-900">
                {signal.value}
              </div>
              <div className="mt-1 font-semibold text-gray-900">{signal.label}</div>
              <p className="mt-1 text-sm text-gray-500">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
