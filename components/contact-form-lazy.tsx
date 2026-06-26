"use client";

import dynamic from "next/dynamic";

/**
 * Defer the ContactForm bundle (react-hook-form + zod + the field UI) off the
 * homepage's initial load. The form sits below the fold and is interaction-only,
 * so it doesn't need to be in the first-load JS or the SSR HTML — deferring it
 * shrinks the homepage's initial bundle (a top contributor to the mobile LCP /
 * TTI on the live ad landing page). A reserved-height placeholder prevents CLS.
 */
const ContactForm = dynamic(
  () => import("@/components/contact-form").then((m) => m.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[640px] w-full animate-pulse rounded-2xl bg-muted/30" aria-hidden />
    ),
  },
);

export function ContactFormLazy() {
  return <ContactForm />;
}
