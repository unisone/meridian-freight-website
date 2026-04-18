"use client";

import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { trackCtaClick } from "@/lib/tracking";

interface TrackedCtaLinkProps
  extends Omit<ComponentProps<typeof Link>, "href" | "children"> {
  href: string;
  location: string;
  text: string;
  children: ReactNode;
}

/**
 * Localized internal link that tracks CTA clicks in GA4 + Vercel Analytics.
 * Use this when a Server Component needs tracked navigation into another page.
 */
export function TrackedCtaLink({
  href,
  location,
  text,
  children,
  ...props
}: TrackedCtaLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => trackCtaClick(location, text, href)}
      {...props}
    >
      {children}
    </Link>
  );
}
