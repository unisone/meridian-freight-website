/**
 * OpenGraph locale mapping and i18n utilities.
 */

export const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  es: "es_419",
  ru: "ru_RU",
};

export function getOgLocale(locale: string): string {
  return OG_LOCALES[locale] ?? "en_US";
}

export function getLocalePathPrefix(locale: string): string {
  return locale === "en" ? "" : `/${locale}`;
}

export function localizePath(locale: string, path: string): string {
  if (!path || path === "/") {
    return getLocalePathPrefix(locale) || "/";
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getLocalePathPrefix(locale)}${normalizedPath}`;
}

/**
 * Locale tags used for number formatting via Intl.NumberFormat.
 * Verified with Node v22.22 (ICU enabled):
 *   (1000).toLocaleString("es")    → "1000"   ← NO separator
 *   (1000).toLocaleString("es-AR") → "1.000"  ← Argentine
 *   (1000).toLocaleString("es-419")→ "1,000"  ← LatAm generic
 *   (1000).toLocaleString("ru-RU") → "1 000"  ← NBSP
 * Meridian's Spanish-language leads are predominantly Argentine;
 * "es-AR" is the correct tag for this audience.
 */
const NUMBER_LOCALES: Record<string, string> = {
  en: "en-US",
  es: "es-AR",
  ru: "ru-RU",
};

export function formatCount(n: number, locale: string): string {
  const tag = NUMBER_LOCALES[locale] ?? "en-US";
  return n.toLocaleString(tag);
}
