import Link from "next/link";
import { MapPin, ArrowRight, Clock, Globe, Shield, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal, StaggerItem } from "@/components/scroll-reveal";
import { COMPANY, CONTACT, STATS, WAREHOUSE_MAIN, WAREHOUSE_PARTNERS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Us — Our Story & Locations",
  description: `Meridian Freight — ${STATS.projectsCompleted}+ equipment exports since ${COMPANY.foundedYear}. Iowa HQ with 6 partner warehouses across USA & Canada. Get a free quote today.`,
  path: "/about",
  keywords: [
    "machinery export company",
    "equipment logistics USA Canada",
    "warehouse storage services",
    "about meridian freight",
  ],
});

const differentiators = [
  {
    icon: Shield,
    title: "One Company, Complete Service",
    description: "Most exporters only handle one part of the chain. We manage the entire process — from equipment pickup at the seller to container loading at port. One point of contact, no handoff risks.",
  },
  {
    icon: Globe,
    title: "Ship Anywhere With a Port",
    description: "We coordinate with established ocean carriers like Maersk and Hapag-Lloyd, plus air freight options. Wherever there's a port or airport, we can deliver.",
  },
  {
    icon: Clock,
    title: "Equipment Specialists",
    description: `${STATS.yearsExperience}+ years handling John Deere combines, Case IH headers, Kinze planters, and CAT machinery. We know the disassembly specs so your equipment reassembles correctly.`,
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            About {COMPANY.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            With over {STATS.yearsExperience} years of experience and {STATS.projectsCompleted}+ completed shipments,{" "}
            {COMPANY.name} is a full-service machinery export company
            headquartered in Iowa. We specialize in the complete logistics
            chain — from equipment pickup and professional dismantling to
            secure container packing and worldwide shipping.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Our experienced technicians understand the unique requirements of
            heavy machinery. Whether it&apos;s a John Deere combine heading to
            Brazil or a CAT excavator bound for the Middle East, we ensure
            every piece arrives safely and on time.
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Why Choose Us
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {differentiators.map((d, idx) => (
              <StaggerItem key={d.title} index={idx}><Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                </CardContent>
              </Card></StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse locations */}
      <ScrollReveal>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Our Locations
          </h2>
          <p className="mt-3 text-muted-foreground">
            Headquartered in Iowa with a partner warehouse network across the
            US and Canada for efficient equipment handling.
          </p>

          {/* Main facility */}
          <div className="mt-8 rounded-xl bg-primary/5 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {WAREHOUSE_MAIN.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {WAREHOUSE_MAIN.description}
                </div>
              </div>
            </div>
          </div>

          {/* Partner locations */}
          <p className="mt-6 text-sm font-medium text-slate-500 uppercase tracking-wider">
            Partner Facilities
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WAREHOUSE_PARTNERS.map((loc) => (
              <div
                key={loc.state}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{loc.name}</div>
                  <div className="text-sm text-muted-foreground">{loc.state}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal variant="fade">
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Let&apos;s Ship Your Equipment
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us what you need shipped and where — we&apos;ll send a detailed quote within 24 hours.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp for a free quote" />} size="lg" className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
            </Button>
            <Button render={<Link href="/contact" />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-border text-foreground font-semibold">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}
