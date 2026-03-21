/**
 * Client-side tracking helpers.
 * Captures UTM params and click IDs (gclid/fbclid) to a 30-day first-party cookie
 * (with sessionStorage fallback).
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const CLICK_IDS = ["gclid", "fbclid", "msclkid"] as const;
const STORAGE_KEY = "mf_attribution";
const COOKIE_MAX_AGE = 2592000; // 30 days in seconds

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

// ─── Cookie helpers ─────────────────────────────────────────────────────────

function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Attribution capture ────────────────────────────────────────────────────

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
    const json = JSON.stringify(data);
    setCookie(STORAGE_KEY, json, COOKIE_MAX_AGE);
    sessionStorage.setItem(STORAGE_KEY, json); // backward compat
  }
}

/** Get stored attribution data (cookie first, sessionStorage fallback). */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const cookieVal = getCookie(STORAGE_KEY);
    if (cookieVal) return JSON.parse(cookieVal);
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

// ─── High-level tracking helpers ────────────────────────────────────────────

/** Track a contact link click (WhatsApp / phone / email) with GA4 + Pixel. */
export function trackContactClick(
  type: "whatsapp" | "phone" | "email",
  location: string,
): void {
  const eventId = generateEventId();
  trackGA4Event(`contact_${type}`, {
    event_category: "contact",
    cta_location: location,
  });
  trackPixelEvent("Contact", { content_name: `${location}_${type}` }, eventId);
}

/** Track a CTA button click. */
export function trackCtaClick(
  location: string,
  text: string,
  destination: string,
): void {
  trackGA4Event("cta_click", {
    event_category: "engagement",
    cta_location: location,
    cta_text: text,
    cta_destination: destination,
  });
}

/** Track a calculator funnel step. */
export function trackCalcFunnel(
  step: "start" | "step" | "complete",
  params: Record<string, string>,
): void {
  trackGA4Event(`calculator_${step}`, params);
}

/** Get the GA4 client_id for offline conversion matching. */
export function getGA4ClientId(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(null); return; }
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (!w.gtag) { resolve(null); return; }
    try {
      w.gtag("get", "client_id", (id: unknown) => resolve(typeof id === "string" ? id : null));
      // Timeout fallback — gtag may never call back if not initialized
      setTimeout(() => resolve(null), 2000);
    } catch {
      resolve(null);
    }
  });
}
