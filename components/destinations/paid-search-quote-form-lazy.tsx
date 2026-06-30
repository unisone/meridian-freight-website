"use client";

import dynamic from "next/dynamic";

/**
 * Defer the PaidSearchQuoteForm bundle (the 13-field quote form + its
 * @vercel/analytics, lead-attribution and tracking imports) off the destination
 * page's initial load. The form sits well below the fold and is interaction-only,
 * so it doesn't need to be in the first-load JS or the SSR HTML — deferring it
 * shrinks first-load JS and main-thread hydration work, the named mobile
 * LCP/TBT contributors on this paid-search template. A reserved-height
 * placeholder prevents layout shift while it loads. Mirrors the homepage
 * ContactFormLazy pattern (#170).
 */
const PaidSearchQuoteForm = dynamic(
  () =>
    import("@/components/destinations/paid-search-quote-form").then(
      (m) => m.PaidSearchQuoteForm,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[1120px] w-full animate-pulse rounded-xl bg-muted/30 sm:min-h-[720px]"
        aria-hidden
      />
    ),
  },
);

interface PaidSearchQuoteFormLazyProps {
  routeKey: string;
  caveat: string;
}

export function PaidSearchQuoteFormLazy({ routeKey, caveat }: PaidSearchQuoteFormLazyProps) {
  return <PaidSearchQuoteForm routeKey={routeKey} caveat={caveat} />;
}
