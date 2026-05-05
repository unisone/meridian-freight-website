import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { latamMarketPages } from "@/content/latam-market-pages";
import { SITE } from "@/lib/constants";

describe("LATAM market sitemap entries", () => {
  it("indexes Spanish buyer hubs without marking them as generic translations", () => {
    const entries = sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

    for (const page of latamMarketPages) {
      const spanishEntry = byUrl.get(`${SITE.url}${page.path}`);
      expect(spanishEntry).toBeDefined();
      expect(spanishEntry?.priority).toBe(0.85);
      expect(spanishEntry?.alternates?.languages).toEqual({
        es: `${SITE.url}${page.path}`,
      });

      const genericEntry = byUrl.get(`${SITE.url}/destinations/${page.slug}`);
      expect(genericEntry).toBeDefined();
      expect(genericEntry?.alternates?.languages).toEqual({
        en: `${SITE.url}/destinations/${page.slug}`,
        ru: `${SITE.url}/ru/destinations/${page.slug}`,
      });
    }
  });
});
