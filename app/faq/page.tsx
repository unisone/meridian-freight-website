import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqEntries } from "@/content/faq";
import { SITE, CONTACT } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Find answers to common questions about machinery export, container packing, shipping costs, documentation, and more.",
};

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
        </div>
        <FaqAccordion entries={faqEntries} />

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-12 sm:py-16 rounded-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Still Have Questions?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100 text-lg">
              Our team is ready to help with any specific questions about your project.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-blue-700 hover:bg-gray-100 font-semibold shadow-lg">
                  <Mail className="mr-2 h-4 w-4" /> Contact Us
                </Button>
              </Link>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-700 font-semibold">
                  <Phone className="mr-2 h-4 w-4" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
