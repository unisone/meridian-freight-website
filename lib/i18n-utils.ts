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
