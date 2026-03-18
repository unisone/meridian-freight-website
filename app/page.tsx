import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { ServicesGrid } from "@/components/services-grid";
import { ProcessSteps } from "@/components/process-steps";
import { ProjectGrid } from "@/components/project-grid";
import { VideoSection } from "@/components/video-section";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      <ScrollReveal>
        <ServicesGrid />
      </ScrollReveal>

      <ScrollReveal>
        <ProcessSteps />
      </ScrollReveal>

      <ScrollReveal>
        <ProjectGrid limit={6} />
      </ScrollReveal>

      <ScrollReveal>
        <VideoSection />
      </ScrollReveal>

      {/* Contact section */}
      <ScrollReveal>
        <section id="contact" className="py-16 md:py-28 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:mb-16">
              <p className="text-xs font-medium uppercase tracking-wider text-sky-500 sm:text-sm">
                Get In Touch
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Contact Us
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600 lg:text-lg">
                Ready to ship your equipment? Get a free quote or ask us
                anything about our services.
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">
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
