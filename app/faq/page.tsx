import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqEntries } from "@/content/faq";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "FAQ — Frequently Asked Questions",
  description: "Answers to common machinery export questions — shipping timelines, container sizes, pricing, customs documentation, insurance & payment options. Ask us anything.",
  path: "/faq",
  keywords: [
    "machinery export FAQ",
    "equipment shipping questions",
    "container packing guide",
    "export documentation help",
  ],
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "FAQ" }]} />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Everything you need to know about exporting machinery from the USA and Canada — timelines, pricing, documentation, and more.</p>
        </div>
        <FaqAccordion entries={faqEntries} />

        {/* CTA */}
        <ScrollReveal variant="fade">
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Still Have Questions?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sky-300 text-lg">
              Send us your equipment details and destination — we&apos;ll answer everything and send a quote within 24 hours.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button render={<Link href="/contact" />} size="lg" className="h-12 px-8 rounded-xl bg-white text-foreground hover:bg-muted font-semibold shadow-lg">
                  <Mail className="mr-2 h-4 w-4" /> Contact Us
              </Button>
              <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp with our team" />} size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold">
                  <Phone className="mr-2 h-4 w-4" /> Chat on WhatsApp
              </Button>
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>
    </>
  );
}
