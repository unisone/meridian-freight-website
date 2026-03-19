import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectGrid } from "@/components/project-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { projects } from "@/content/projects";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Projects — Completed Machinery Export Projects",
  description: "Browse our portfolio of completed machinery export projects. From John Deere combines to CAT excavators — see real projects with real results.",
  path: "/projects",
  keywords: [
    "machinery export projects",
    "equipment shipping portfolio",
    "container packing examples",
    "heavy machinery export cases",
  ],
});

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Meridian Freight Export Projects",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      description: p.description,
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
          <Breadcrumbs items={[{ label: "Projects" }]} />
        </div>
        <ProjectGrid />

        {/* CTA */}
        <ScrollReveal variant="fade">
        <section className="mt-16 rounded-2xl bg-slate-900 py-12 sm:py-16 mb-16">
          <div className="mx-auto max-w-3xl px-4 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to Ship Your Equipment?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Get a free quote for your machinery export project.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                  render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp for a free quote" />}
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Us
              </Button>
              <Button
                  render={<Link href="/contact" />}
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-foreground font-semibold"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>
    </>
  );
}
