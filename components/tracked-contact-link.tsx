"use client";

import { trackContactClick } from "@/lib/tracking";

interface TrackedContactLinkProps {
  href: string;
  type: "whatsapp" | "phone" | "email";
  location: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

/**
 * Drop-in <a> replacement that fires GA4 + Pixel contact tracking on click.
 * Use in Server Components where direct onClick handlers aren't available.
 */
export function TrackedContactLink({
  href,
  type,
  location,
  children,
  className,
  target,
  rel,
  ariaLabel,
}: TrackedContactLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={() => trackContactClick(type, location)}
    >
      {children}
    </a>
  );
}
