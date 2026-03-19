import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Container, Clock, Weight } from "lucide-react";
import { StaggerItem } from "@/components/scroll-reveal";
import { projects } from "@/content/projects";

interface ProjectGridProps {
  limit?: number;
}

export function ProjectGrid({ limit }: ProjectGridProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-500 sm:text-sm">
            Our Work
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Recent Projects
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-600 lg:text-lg">
            Real projects, real results. See how we handle machinery export from
            start to finish.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project, idx) => (
            <StaggerItem key={project.id} index={idx} variant="fade">
              <article
                className="group overflow-hidden rounded-xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 -mx-5 px-5 py-3 rounded-b-xl">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{project.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Container className="h-3.5 w-3.5" />
                      <span>{project.containerType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{project.transitTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Weight className="h-3.5 w-3.5" />
                      <span>{project.weight}</span>
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
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600 transition-colors link-underline"
            >
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
