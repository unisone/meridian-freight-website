"use client";

import dynamic from "next/dynamic";

/**
 * Defer the VideoSection bundle (YouTube embed) off the homepage's initial load.
 * It's below the fold, so its JS shouldn't compete with the hero LCP. A
 * reserved-height placeholder prevents layout shift while it hydrates.
 */
const VideoSection = dynamic(
  () => import("@/components/video-section").then((m) => m.VideoSection),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[480px] w-full animate-pulse rounded-2xl bg-muted/30" aria-hidden />
    ),
  },
);

export function VideoSectionLazy() {
  return <VideoSection />;
}
