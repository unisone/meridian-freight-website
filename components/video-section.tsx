"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, MessageCircle } from "lucide-react";
import { SOCIAL, CONTACT } from "@/lib/constants";
import { trackGA4Event, trackContactClick } from "@/lib/tracking";
import { useTranslations } from "next-intl";

const VIDEO_ID = "SrjUBSD2_5Q";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = useTranslations("VideoSection");

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            {t("heading")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {/* Video embed */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-xl">
          <div className="relative aspect-video bg-slate-900">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                title={t("videoTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                onClick={() => {
                  setIsPlaying(true);
                  trackGA4Event("video_play", { video_title: "Meridian Freight Operations" });
                }}
                className="group absolute inset-0 flex items-center justify-center"
                aria-label={t("playVideo")}
              >
                {/* Thumbnail */}
                <Image
                  src={THUMBNAIL}
                  alt={t("thumbnailAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                  quality={80}
                />
                <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />

                {/* Play button */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl transition-[background-color,transform] group-hover:scale-110 group-hover:bg-primary/90">
                  <span className="absolute inset-0 rounded-full bg-primary/70 animate-pulse-ring pointer-events-none" />
                  <span className="absolute inset-0 rounded-full bg-primary/70 animate-pulse-ring-outer pointer-events-none" />
                  <Play className="h-8 w-8 text-white ml-1" aria-hidden="true" />
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
            onClick={() => trackContactClick("whatsapp", "video_section")}
            className="group inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
            {t("getAQuote")}
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 link-underline"
          >
            {t("watchMoreYouTube")}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
