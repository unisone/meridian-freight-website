import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// ── Build-time env var safety check ──────────────────────────────────────────
// Catches newline-contaminated values BEFORE they break inline <Script> tags.
// Root cause: `echo 'val' | vercel env add` embeds a trailing \n.
const INLINE_SCRIPT_VARS = [
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "NEXT_PUBLIC_GOOGLE_ADS_ID",
] as const;

for (const name of INLINE_SCRIPT_VARS) {
  const val = process.env[name];
  if (val && val !== val.trim()) {
    throw new Error(
      `\n\n  ENV VAR ERROR: ${name} contains whitespace/newline characters.\n` +
      `  Value: ${JSON.stringify(val)}\n` +
      `  Fix: vercel env rm ${name} production && printf '${val.trim()}' | vercel env add ${name} production\n\n`
    );
  }
}

const isDevelopment = process.env.NODE_ENV === "development";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  "https://www.googletagmanager.com",
  "https://connect.facebook.net",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
  "https://www.google.com",
  "https://pagead2.googlesyndication.com",
  "https://va.vercel-scripts.com",
  "https://vercel.live",
].join(" ");
const connectSrc = [
  "'self'",
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://region1.google-analytics.com",
  "https://www.googletagmanager.com",
  "https://*.sentry.io",
  "https://graph.facebook.com",
  "https://*.supabase.co",
  "https://cdn.jsdelivr.net",
  "https://googleads.g.doubleclick.net",
  "https://www.googleadservices.com",
  "https://www.google.com",
  "https://google.com",
  "https://pagead2.googlesyndication.com",
  "https://va.vercel-scripts.com",
  "https://vitals.vercel-insights.com",
  "https://vitals.vercel-analytics.com",
  "https://vercel.live",
].join(" ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://img.youtube.com https://www.google-analytics.com https://www.facebook.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://google.com https://pagead2.googlesyndication.com https://vercel.live",
      `connect-src ${connectSrc}`,
      "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://td.doubleclick.net https://www.google.com https://maps.google.com https://vercel.live",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // IndexNow key verification file: /{key}.txt → API route
        source: "/:key.txt",
        destination: "/api/indexnow-verify?key=:key",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // Sentry source map upload (requires SENTRY_AUTH_TOKEN in CI/build env)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload wider set of source maps for better stack traces
  widenClientFileUpload: true,

  // Disable Sentry telemetry
  telemetry: false,
});
