import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "ru"] as const,
  defaultLocale: "en",
  localePrefix: "as-needed",
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
