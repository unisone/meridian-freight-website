"use client";

import { useEffect } from "react";
import {
  initScrollDepthTracking,
  initEngagementTimeTracking,
  initRageClickDetection,
  initOutboundLinkTracking,
} from "@/lib/tracking";

/**
 * Initializes passive engagement trackers on the client:
 * - Scroll depth milestones (25/50/75/100%)
 * - Page engagement time (fires on unload if >= 5s)
 * - Rage click detection (3+ clicks in 1s within 50px)
 * - Outbound link click tracking
 *
 * All trackers are lightweight, use passive listeners,
 * and clean up on unmount via useEffect return.
 */
export function EngagementTracking() {
  useEffect(() => {
    const cleanups = [
      initScrollDepthTracking(),
      initEngagementTimeTracking(),
      initRageClickDetection(),
      initOutboundLinkTracking(),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
