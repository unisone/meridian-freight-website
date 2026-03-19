"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, MessageCircle } from "lucide-react";
import { SOCIAL, CONTACT } from "@/lib/constants";

const VIDEO_ID = "SrjUBSD2_5Q";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            See Us In Action
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            See How We Pack &amp; Ship Machinery
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            See how we handle heavy machinery dismantling, packing, and container loading.
          </p>
        </div>

        {/* Video embed */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-xl">
          <div className="relative aspect-video bg-slate-900">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                title="Meridian Freight operations video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="group absolute inset-0 flex items-center justify-center"
                aria-label="Play operations video"
              >
                {/* Thumbnail */}
                <Image
                  src={THUMBNAIL}
                  alt="Video thumbnail — Meridian Freight machinery loading operations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
                <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />

                {/* Play button */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl transition-all group-hover:scale-110 group-hover:bg-primary/90">
                  <span className="absolute inset-0 rounded-full bg-primary/70 animate-pulse-ring pointer-events-none" />
                  <span className="absolute inset-0 rounded-full bg-primary/70 animate-pulse-ring-outer pointer-events-none" />
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Get a Quote
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 link-underline"
          >
            Watch More Videos on YouTube
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
