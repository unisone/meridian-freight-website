import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin, Container, Clock, Weight } from "lucide-react";
import { StaggerItem } from "@/components/scroll-reveal";
import { getAllProjects } from "@/content/projects";
import { useTranslations, useLocale } from "next-intl";

interface ProjectGridProps {
  limit?: number;
  /** Hide the section header (eyebrow + h2 + description). Use on dedicated /projects page where the page-level H1 already provides context. */
  hideHeader?: boolean;
}

export function ProjectGrid({ limit, hideHeader }: ProjectGridProps) {
  const locale = useLocale();
  const projects = getAllProjects(locale);
  const displayProjects = limit ? projects.slice(0, limit) : projects;
  const t = useTranslations("ProjectGrid");

  return (
    <section className={hideHeader ? "bg-white py-8 sm:py-10" : "bg-white py-16 sm:py-20 lg:py-28"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — hidden on dedicated /projects page */}
        {!hideHeader && (
          <div className="mb-12 sm:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
              {t("heading")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {t("description")}
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project, idx) => (
            <StaggerItem key={project.id} index={idx} variant="fade">
              <article
                className="group flex h-full flex-col overflow-hidden rounded-xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.containerType} to ${project.destination}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={80}
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-muted -mx-5 px-5 py-3 rounded-b-xl">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="font-mono">{project.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Container className="h-3.5 w-3.5" />
                      <span className="font-mono">{project.containerType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-mono">{project.transitTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Weight className="h-3.5 w-3.5" />
                      <span className="font-mono">{project.weight}</span>
                    </div>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </div>

        {/* View all link */}
        {limit && projects.length > limit && (
          <div className="mt-10 text-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors link-underline"
            >
              {t("viewAllProjects")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
