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
 * BCP-47 locale tags used both for Intl.NumberFormat number formatting
 * and for schema.org JSON-LD `inLanguage` properties / HTML `lang` attrs.
 *
 * Verified with Node v22.22 (ICU enabled):
 *   (1000).toLocaleString("es")    → "1000"   ← NO separator (wrong)
 *   (1000).toLocaleString("es-AR") → "1.000"  ← Argentine (target)
 *   (1000).toLocaleString("es-419")→ "1,000"  ← LatAm generic
 *   (1000).toLocaleString("ru-RU") → "1 000"  ← NBSP
 *
 * Meridian's Spanish-language leads are predominantly Argentine, so we
 * map `es → es-AR` everywhere we surface locale context to users or to
 * search engines. Using the same canonical BCP-47 table across number
 * formatting (formatCount) and JSON-LD inLanguage keeps the regional
 * signal consistent.
 */
const BCP47_LOCALES: Record<string, string> = {
  en: "en-US",
  es: "es-AR",
  ru: "ru-RU",
};

export function toBCP47(locale: string): string {
  return BCP47_LOCALES[locale] ?? "en-US";
}

export function formatCount(n: number, locale: string): string {
  return n.toLocaleString(toBCP47(locale));
}
