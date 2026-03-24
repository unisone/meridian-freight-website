"use client";

import { useEffect } from "react";
import Script from "next/script";
import { TRACKING } from "@/lib/constants";

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * How it works:
 * 1. gtag.js always loads (needed to manage consent state)
 * 2. Default consent is "denied" — GA fires cookieless pings only (GDPR-safe)
 * 3. When user accepts cookies, consent updates to "granted" — full tracking enabled
 * 4. If user declines, GA continues with anonymized behavioral modeling only
 */
export function GoogleAnalytics() {
  const gaId = TRACKING.gaId;
  const adsId = TRACKING.googleAdsId;

  useEffect(() => {
    // If user already accepted cookies before this component mounted,
    // update consent state immediately
    if (localStorage.getItem("cookie-consent") === "accepted") {
      grantConsent();
    }

    // Listen for future consent acceptance
    function onConsent() {
      grantConsent();
    }
    window.addEventListener("cookie-consent-accepted", onConsent);
    return () => window.removeEventListener("cookie-consent-accepted", onConsent);
  }, []);

  if (!gaId) return null;

  return (
    <>
      {/* Consent Mode v2 defaults — MUST run before gtag config */}
      <Script id="gtag-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>

      {/* Load gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Initialize GA4 + optional Google Ads + content grouping */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          if (!window.gtag) { function gtag(){dataLayer.push(arguments);} window.gtag = gtag; }
          gtag('js', new Date());
          var rawPath = window.location.pathname;
          var locale = 'en';
          var p = rawPath;
          if (rawPath.indexOf('/es') === 0 && (rawPath.length === 3 || rawPath.charAt(3) === '/')) {
            locale = 'es'; p = rawPath.substring(3) || '/';
          } else if (rawPath.indexOf('/ru') === 0 && (rawPath.length === 3 || rawPath.charAt(3) === '/')) {
            locale = 'ru'; p = rawPath.substring(3) || '/';
          }
          var cg = (function(p) {
            if (p === '/') return 'Homepage';
            if (p.startsWith('/services')) return 'Services';
            if (p.startsWith('/equipment')) return 'Equipment';
            if (p.startsWith('/destinations')) return 'Destinations';
            if (p === '/pricing/calculator') return 'Calculator';
            if (p.startsWith('/pricing')) return 'Pricing';
            if (p.startsWith('/projects')) return 'Projects';
            if (p === '/about') return 'About';
            if (p === '/contact') return 'Contact';
            if (p === '/faq') return 'FAQ';
            if (p.startsWith('/blog')) return 'Blog';
            if (p === '/privacy' || p === '/terms') return 'Legal';
            return 'Other';
          })(p);
          gtag('config', '${gaId}', { content_group: cg, locale: locale });
          ${adsId ? `gtag('config', '${adsId}');` : ""}
        `}
      </Script>
    </>
  );
}

/** Update consent state to granted (called when user accepts cookies). */
function grantConsent() {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
}
