"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { TRACKING } from "@/lib/constants";

/**
 * Consent-gated Meta Pixel. Only loads after cookie consent is accepted.
 */
export function MetaPixel() {
  const [hasConsent, setHasConsent] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("cookie-consent") === "accepted"
  );
  const pixelId = TRACKING.metaPixelId;

  useEffect(() => {
    function onConsent() {
      setHasConsent(true);
    }
    window.addEventListener("cookie-consent-accepted", onConsent);
    return () => window.removeEventListener("cookie-consent-accepted", onConsent);
  }, []);

  if (!hasConsent || !pixelId) return null;

  return (
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
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
