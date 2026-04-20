import type { SVGProps } from "react";

type SocialIconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14.5 8.25V6.7c0-.75.5-.92.85-.92h2.15V2.1L14.54 2C11.26 2 10.5 4.47 10.5 6.05v2.2H8v3.9h2.5V22h4v-9.85h2.7l.35-3.9h-3.05Z" />
    </svg>
  );
}

export function InstagramIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21.58 7.19a2.6 2.6 0 0 0-1.83-1.84C18.13 4.92 12 4.92 12 4.92s-6.13 0-7.75.43a2.6 2.6 0 0 0-1.83 1.84A27 27 0 0 0 2 12a27 27 0 0 0 .42 4.81 2.6 2.6 0 0 0 1.83 1.84c1.62.43 7.75.43 7.75.43s6.13 0 7.75-.43a2.6 2.6 0 0 0 1.83-1.84A27 27 0 0 0 22 12a27 27 0 0 0-.42-4.81ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />
    </svg>
  );
}
