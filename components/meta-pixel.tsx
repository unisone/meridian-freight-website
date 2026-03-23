"use client";

import { useEffect } from "react";
import Script from "next/script";
import { TRACKING } from "@/lib/constants";

/**
 * Meta Pixel with Consent Mode (mirrors GA4 Consent Mode v2 pattern).
 *
 * ALWAYS loads the pixel — but defaults to `fbq('consent', 'revoke')` so Meta
 * operates in Limited Data Use mode (no cookies, no personal data stored).
 * When the user accepts cookies, upgrades to `fbq('consent', 'grant')` for
 * full tracking including remarketing audiences.
 *
 * This ensures Meta receives PageView signals even before consent, preventing
 * the "$811 spent with ZERO landing page views" failure mode where the pixel
 * never loaded at all.
 */
export function MetaPixel() {
  const pixelId = TRACKING.metaPixelId;

  useEffect(() => {
    // If user already accepted cookies, grant consent immediately
    if (localStorage.getItem("cookie-consent") === "accepted") {
      grantPixelConsent();
    }

    // Listen for future consent acceptance
    function onConsent() {
      grantPixelConsent();
    }
    window.addEventListener("cookie-consent-accepted", onConsent);
    return () => window.removeEventListener("cookie-consent-accepted", onConsent);
  }, []);

  if (!pixelId) return null;

  return (
    <>
      {/* Load pixel with consent revoked by default (cookieless mode) */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', 'revoke');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}

/** Upgrade Meta Pixel to full consent (called when user accepts cookies). */
function grantPixelConsent() {
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  w.fbq?.("consent", "grant");
}
