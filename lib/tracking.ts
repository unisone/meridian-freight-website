/**
 * Client-side tracking helpers.
 * Captures UTM params and click IDs (gclid/fbclid) to sessionStorage.
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const CLICK_IDS = ["gclid", "fbclid", "msclkid"] as const;
const STORAGE_KEY = "mf_attribution";

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  landing_page?: string;
}

/** Capture UTM params and click IDs from URL on page load. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const existing = getAttribution();

  const data: Attribution = { ...existing };
  let hasNew = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      data[key] = val;
      hasNew = true;
    }
  }

  for (const key of CLICK_IDS) {
    const val = params.get(key);
    if (val) {
      data[key] = val;
      hasNew = true;
    }
  }

  if (hasNew) {
    data.landing_page = window.location.href;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

/** Get stored attribution data. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Generate a unique event ID for deduplication between Pixel and CAPI. */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Fire a GA4 custom event. */
export function trackGA4Event(
  eventName: string,
  params?: Record<string, string | number>
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", eventName, params);
}

/** Fire a Meta Pixel event (client-side). */
export function trackPixelEvent(
  eventName: string,
  params?: Record<string, string | number>,
  eventId?: string
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (eventId) {
    w.fbq?.("track", eventName, params, { eventID: eventId });
  } else {
    w.fbq?.("track", eventName, params);
  }
}
