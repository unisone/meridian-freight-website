import type { Metadata } from "next";
import { ProjectsGallery } from "@/components/projects-gallery";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects — Completed Machinery Export Projects",
  description:
    "Browse our portfolio of completed machinery export projects. From John Deere combines to CAT excavators — see real projects with real results.",
};

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
        <ProjectsGallery />
      </div>
    </>
  );
}
