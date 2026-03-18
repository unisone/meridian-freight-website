"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/tracking";

/**
 * Captures UTM params and click IDs (gclid/fbclid) from URL to sessionStorage
 * on page load. Mounted once in root layout.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
