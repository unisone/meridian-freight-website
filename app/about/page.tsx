import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Clock, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StatsBar } from "@/components/stats-bar";
import { COMPANY, WAREHOUSE_LOCATIONS, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us — Our Story & Locations",
  description: `${COMPANY.name} — ${COMPANY.tagline}. Over 10 years of experience in machinery export logistics with warehouses across USA & Canada.`,
};

const differentiators = [
  {
    icon: Clock,
    title: "Available 24/7",
    description: "Our team is always reachable. Machinery logistics doesn't wait for business hours.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "We ship to 30+ countries with established relationships at major ports worldwide.",
  },
  {
    icon: Shield,
    title: "Equipment Expertise",
    description: "Our technicians specialize in agricultural and industrial machinery — we know every make and model.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "About" }]} />
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            About {COMPANY.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
            Founded in 2015, {COMPANY.name} has grown from a small operation in
            Iowa to a full-service machinery export company with warehouse
            facilities across the United States and Canada. We specialize in the
            complete logistics chain — from equipment pickup and professional
            dismantling to secure container packing and worldwide shipping.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Our team of experienced technicians understands the unique
            requirements of heavy machinery. Whether it&apos;s a John Deere combine
            heading to Brazil or a CAT excavator bound for the Middle East, we
            ensure every piece arrives safely and on time.
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Why Choose Us
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {differentiators.map((d) => (
              <Card key={d.title}>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <d.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{d.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse locations */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Our Locations
          </h2>
          <p className="mt-3 text-gray-600">
            Strategically located warehouses for efficient equipment handling.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WAREHOUSE_LOCATIONS.map((loc) => (
              <div
                key={loc.state}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{loc.name}</div>
                  <div className="text-sm text-gray-500">{loc.state}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBar />

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Ready to Work With Us?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Get a free quote for your machinery export project. We respond within 24 hours.
          </p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
