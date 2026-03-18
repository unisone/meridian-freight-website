"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Package, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { projects, projectCategories } from "@/content/projects";

export function ProjectsGallery() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Our Projects
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Browse our portfolio of completed machinery export projects worldwide.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <Badge className="absolute left-3 top-3 bg-blue-600 text-white">
                  {project.category}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 line-clamp-2">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-600" />
                    {project.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3 text-blue-600" />
                    {project.containerType}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-600" />
                    {project.transitTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-blue-600 font-semibold text-[10px]">kg</span>
                    {project.weight}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
