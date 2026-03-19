import Link from "next/link";
import { ArrowRight, MessageCircle, BarChart3 } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { ServicesGrid } from "@/components/services-grid";
import { ProcessSteps } from "@/components/process-steps";
import { ProjectGrid } from "@/components/project-grid";
import { VideoSection } from "@/components/video-section";
import { FaqAccordion } from "@/components/faq-accordion";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT } from "@/lib/constants";
import { homepageFaq } from "@/content/faq";

export const metadata = pageMetadata({
  title: "Machinery Export & Logistics — Packing & Shipping",
  description:
    "Full-service machinery export from USA & Canada — pickup, dismantling, packing, documentation & worldwide shipping. 500+ exports. Free quote in 24 hrs.",
  path: "/",
  keywords: [
    "machinery export USA",
    "container packing services",
    "equipment shipping USA Canada",
    "agricultural equipment export",
    "heavy machinery dismantling",
    "40ft container loading",
    "export documentation services",
    "ship machinery overseas",
    "farm equipment shipping worldwide",
    "machinery logistics company",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      {/* ServicesGrid handles its own stagger internally */}
      <ServicesGrid />

      {/* ProcessSteps handles its own scroll-linked animation internally */}
      <ProcessSteps />

      {/* Mid-page CTA */}
      <ScrollReveal variant="fade">
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Ready to ship your equipment overseas?</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" />}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground rounded-lg"
              render={<Link href="/contact" />}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* ProjectGrid handles its own stagger internally */}
      <ProjectGrid limit={6} />

      {/* Calculator CTA */}
      <ScrollReveal variant="scale">
        <section className="bg-slate-900 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-sky-400" />
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Estimate Your Freight Cost in 60 Seconds
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Select your equipment and destination — get an instant cost
              estimate.
            </p>
            <Button
              size="lg"
              className="mt-6 h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
              render={<Link href="/pricing/calculator" />}
            >
              Open Calculator
              <ArrowRight className="ml-2 h-4 w-4 animate-nudge-right" />
            </Button>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <VideoSection />
      </ScrollReveal>

      <ScrollReveal>
        <FaqAccordion entries={homepageFaq} showViewAll />
      </ScrollReveal>

      {/* Contact section */}
      <ScrollReveal>
        <section id="contact" className="py-16 md:py-28 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 sm:mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Get In Touch
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
                Contact Us
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                Ready to ship your equipment? Get a free, itemized quote or
                ask us anything — we respond within 24 hours.
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
                <h3 className="mb-6 text-2xl font-bold text-foreground">
                  Send us a Message
                </h3>
                <ContactForm />
              </div>
              <ContactInfo />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
