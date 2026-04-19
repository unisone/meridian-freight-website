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
