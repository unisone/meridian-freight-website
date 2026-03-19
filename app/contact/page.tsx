import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact Us — Get a Free Quote",
  description: "Get a free machinery export quote — we respond within 24 hours. Reach us via WhatsApp, phone, or email. 500+ equipment exports from USA & Canada.",
  path: "/contact",
  keywords: [
    "contact machinery export company",
    "get freight quote",
    "free equipment shipping quote",
    "machinery logistics contact USA",
    "WhatsApp machinery export quote",
  ],
});

export default function ContactPage() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Contact" }]} />
      </div>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Get Your Quote in 24 Hours
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Tell us the equipment, where it is, and where it&apos;s going.
              We send back every line item — inland freight, packing, ocean
              shipping — so you know exactly what you&apos;re paying for.
            </p>
          </div>
          </ScrollReveal>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Send us a Message
              </h2>
              <ContactForm />
            </div>
            <ContactInfo />
          </div>
        </div>
      </section>
    </div>
  );
}
