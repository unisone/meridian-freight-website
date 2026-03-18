"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Package, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/content/projects";

export function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % projects.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + projects.length) % projects.length);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const project = projects[current];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Our Work
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Recent Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Real projects, real results. See how we handle machinery export from start to finish.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white shadow-lg"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <Badge className="absolute left-4 top-4 bg-blue-600 text-white">
                {project.category}
              </Badge>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {project.destination}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4 text-blue-600" />
                  {project.containerType}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {project.transitTime}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-mono text-blue-600 font-semibold">kg</span>
                  {project.weight}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 lg:bottom-auto lg:right-4 lg:top-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <span className="font-mono text-sm font-medium text-gray-600 bg-white/90 px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
              {current + 1}/{projects.length}
            </span>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
