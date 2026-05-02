/**
 * Client-side tracking helpers.
 * Captures UTM params and click IDs (gclid/fbclid) to a 30-day first-party cookie
 * (with sessionStorage fallback).
 *
 * Fires events to both GA4 (via gtag) and Vercel Analytics (via track()).
 */

import { track as vercelTrack } from "@vercel/analytics";
import { TRACKING } from "@/lib/constants";

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
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax;Secure`;
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

/**
 * Enhanced user data for Google Ads Enhanced Conversions.
 * Values must be pre-hashed with SHA-256 (use hashUserDataForGoogleAds).
 */
export interface EnhancedUserData {
  sha256_email_address?: string;
  sha256_phone_number?: string;
}

/**
 * Fire a Google Ads conversion event with a specific conversion label.
 *
 * When `userData` is provided, sets Enhanced Conversions user data via
 * gtag("set", "user_data", ...) before firing the conversion event.
 * This improves conversion match rate by 10-15% for offline-to-online
 * attribution. See: https://support.google.com/google-ads/answer/13262500
 */
export function trackGoogleAdsConversion(
  sendTo: string,
  value?: number,
  currency: string = "USD",
  userData?: EnhancedUserData,
): void {
  if (typeof window === "undefined" || !sendTo) return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };

  // Set Enhanced Conversions user data before the conversion event.
  // gtag("set", "user_data", ...) persists for the page session and is
  // picked up by subsequent conversion events automatically.
  if (userData && (userData.sha256_email_address || userData.sha256_phone_number)) {
    w.gtag?.("set", "user_data", {
      sha256_email_address: userData.sha256_email_address,
      sha256_phone_number: userData.sha256_phone_number,
    });
  }

  w.gtag?.("event", "conversion", {
    send_to: sendTo,
    value,
    currency,
  });
}

// ─── High-level tracking helpers ────────────────────────────────────────────

/** Get current locale from URL path. */
function getLocaleFromPath(): string {
  if (typeof window === "undefined") return "en";
  const match = window.location.pathname.match(/^\/(es|ru)(\/|$)/);
  return match ? match[1] : "en";
}

/** Track a contact link click (WhatsApp / phone / email) with GA4 + Pixel + Google Ads + Vercel Analytics. */
export function trackContactClick(
  type: "whatsapp" | "phone" | "email",
  location: string,
): void {
  const eventId = generateEventId();
  trackGA4Event(`contact_${type}`, {
    event_category: "contact",
    cta_location: location,
    locale: getLocaleFromPath(),
  });
  trackPixelEvent("Contact", { content_name: `${location}_${type}` }, eventId);
  if (type === "whatsapp") {
    trackGoogleAdsConversion(TRACKING.gadsWhatsAppLabel, 100);
  }
  vercelTrack("contact_click", { type, location });
}

/** Track a non-contact CTA click with GA4 + Vercel Analytics. */
export function trackCtaClick(
  location: string,
  text: string,
  destination: string,
): void {
  trackGA4Event("cta_click", {
    event_category: "cta",
    cta_location: location,
    cta_text: text,
    destination,
    locale: getLocaleFromPath(),
  });
  vercelTrack("cta_click", { location, text, destination });
}

/** Track a calculator funnel step with GA4 + Vercel Analytics. */
export function trackCalcFunnel(
  step: "start" | "step" | "complete",
  params: Record<string, string>,
): void {
  trackGA4Event(`calculator_${step}`, params);
  vercelTrack(`calculator_${step}`, params);
}

/** Track shared-shipping booking funnel events (GA4 + Vercel Analytics). */
export function trackBookingFunnel(
  step: "view" | "filter" | "request_start" | "request_submit",
  params: Record<string, string>,
): void {
  if (step === "view") {
    trackGA4Event("container_view", params);
    vercelTrack("container_view", params);
  } else if (step === "filter") {
    trackGA4Event("container_filter", params);
  } else if (step === "request_start") {
    trackGA4Event("booking_request_start", params);
    vercelTrack("booking_request_start", params);
  } else if (step === "request_submit") {
    // NOTE: generate_lead is fired separately in the booking form handler with the
    // canonical $300 lead value. This fires a distinct event to avoid double-counting.
    trackGA4Event("booking_request_submit", params);
    vercelTrack("booking_request_submit", params);
  }
}

/** Track shipping schedule events (GA4 + Vercel Analytics). */
export function trackScheduleEvent(
  action: "view" | "filter" | "book_click",
  params: Record<string, string> = {},
): void {
  if (action === "view") {
    trackGA4Event("schedule_view", params);
    vercelTrack("schedule_view", params);
  } else if (action === "filter") {
    trackGA4Event("schedule_filter", params);
  } else if (action === "book_click") {
    trackGA4Event("schedule_book_click", params);
    vercelTrack("schedule_book_click", params);
  }
}

// ─── Enterprise analytics: engagement & UX tracking ────────────────────────

/** Track scroll depth at 25/50/75/100% milestones (fires once per milestone per page). */
export function initScrollDepthTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  const fired = new Set<number>();

  const handler = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const depth = Math.round((window.scrollY / scrollHeight) * 100);
    for (const milestone of [25, 50, 75, 100]) {
      if (depth >= milestone && !fired.has(milestone)) {
        fired.add(milestone);
        trackGA4Event("scroll_depth", {
          percent: milestone,
          page: window.location.pathname,
        });
      }
    }
  };

  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}

/** Track page engagement time on beforeunload (fires for sessions >= 5s). */
export function initEngagementTimeTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  const startTime = Date.now();

  const handler = () => {
    const seconds = Math.round((Date.now() - startTime) / 1000);
    if (seconds >= 5) {
      trackGA4Event("engagement_time", {
        time_seconds: seconds,
        page: window.location.pathname,
      });
    }
  };

  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}

/** Detect rage clicks (3+ clicks within 1 second on the same area). */
export function initRageClickDetection(): () => void {
  if (typeof window === "undefined") return () => {};
  const clicks: { time: number; x: number; y: number }[] = [];

  const handler = (e: MouseEvent) => {
    const now = Date.now();
    clicks.push({ time: now, x: e.clientX, y: e.clientY });

    // Keep only clicks within last 1 second
    while (clicks.length > 0 && now - clicks[0].time > 1000) clicks.shift();

    // Check if 3+ clicks are within 50px radius
    if (clicks.length >= 3) {
      const last = clicks[clicks.length - 1];
      const nearby = clicks.filter(
        (c) => Math.abs(c.x - last.x) < 50 && Math.abs(c.y - last.y) < 50
      );
      if (nearby.length >= 3) {
        const target = e.target as HTMLElement;
        trackGA4Event("rage_click", {
          element: target.tagName.toLowerCase(),
          class: (target.className || "").toString().slice(0, 100),
          page: window.location.pathname,
        });
        clicks.length = 0; // Reset to avoid spamming
      }
    }
  };

  document.addEventListener("click", handler, true);
  return () => document.removeEventListener("click", handler, true);
}

/** Track outbound link clicks (links leaving meridianexport.com). */
export function initOutboundLinkTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: MouseEvent) => {
    const link = (e.target as HTMLElement)?.closest("a") as HTMLAnchorElement | null;
    if (!link?.href) return;
    try {
      const url = new URL(link.href);
      if (url.hostname && url.hostname !== window.location.hostname) {
        trackGA4Event("outbound_click", {
          url: link.href.slice(0, 500),
          text: (link.textContent || "").trim().slice(0, 100),
          page: window.location.pathname,
        });
      }
    } catch {
      // Invalid URL — ignore
    }
  };

  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}

/** Track 404 page views with referrer context. */
export function trackNotFound(): void {
  trackGA4Event("not_found", {
    requested_path: typeof window !== "undefined" ? window.location.pathname : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
  });
  vercelTrack("not_found", {
    path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/** Track form abandonment — call when user starts filling a form. Returns cleanup function. */
export function initFormAbandonmentTracking(
  formName: string,
  getCurrentStep?: () => number,
): () => void {
  if (typeof window === "undefined") return () => {};
  let isDirty = false;
  let isSubmitted = false;

  const markDirty = () => { isDirty = true; };

  const markSubmitted = () => { isSubmitted = true; };

  const handler = () => {
    if (isDirty && !isSubmitted) {
      trackGA4Event("form_abandonment", {
        form_name: formName,
        step: getCurrentStep?.()?.toString() ?? "unknown",
        page: window.location.pathname,
      });
    }
  };

  window.addEventListener("beforeunload", handler);

  return Object.assign(
    () => window.removeEventListener("beforeunload", handler),
    { markDirty, markSubmitted }
  );
}
