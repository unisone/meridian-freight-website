import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { ServicesGrid } from "@/components/services-grid";
import { ProcessSteps } from "@/components/process-steps";
import { ProjectCarousel } from "@/components/project-carousel";
import { VideoSection } from "@/components/video-section";
import { TrustSignals } from "@/components/trust-signals";
import { FaqAccordion } from "@/components/faq-accordion";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { homepageFaq } from "@/content/faq";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <ProcessSteps />
      <ProjectCarousel />

      {/* Calculator CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <Calculator className="mx-auto h-10 w-10 mb-4 opacity-80" />
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Estimate Your Freight Cost in 60 Seconds
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100 text-lg">
            Select your equipment and destination — get an instant cost estimate.
          </p>
          <Link href="/pricing/calculator" className="mt-6 inline-block">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-semibold rounded-xl bg-white text-blue-700 hover:bg-gray-100 shadow-lg transition-all hover:scale-105"
            >
              Open Calculator
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <VideoSection />
      <TrustSignals />
      <FaqAccordion entries={homepageFaq} showViewAll />

      {/* Contact section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Get In Touch
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Contact Us
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Ready to ship your equipment? Get a free quote or ask us anything about our services.
            </p>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Send us a Message
              </h3>
              <ContactForm />
            </div>
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
