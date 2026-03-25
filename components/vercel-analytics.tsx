"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Vercel Analytics wrapper with locale path normalization.
 * Strips /es/ and /ru/ prefixes so all locales aggregate under the same page.
 */
export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        const url = new URL(event.url);
        url.pathname = url.pathname.replace(/^\/(es|ru)(\/|$)/, "/");
        return { ...event, url: url.toString() };
      }}
    />
  );
}
