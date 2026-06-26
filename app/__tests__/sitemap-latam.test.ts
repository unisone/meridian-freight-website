import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { latamMarketPages } from "@/content/latam-market-pages";
import { SITE } from "@/lib/constants";

describe("LATAM market sitemap entries", () => {
  it("indexes Spanish buyer hubs without marking them as generic translations", () => {
    const entries = sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

    for (const page of latamMarketPages) {
      // The Spanish buyer hub stands alone — es-only, self-referential
      // x-default, and crucially NOT cross-linked to the generic page.
      const spanishEntry = byUrl.get(`${SITE.url}${page.path}`);
      expect(spanishEntry).toBeDefined();
      expect(spanishEntry?.alternates?.languages).toEqual({
        es: `${SITE.url}${page.path}`,
        "x-default": `${SITE.url}${page.path}`,
      });

      // The generic logistics page is en+ru only (es belongs to the distinct
      // hub above) with an en x-default.
      const genericCluster = {
        en: `${SITE.url}/destinations/${page.slug}`,
        ru: `${SITE.url}/ru/destinations/${page.slug}`,
        "x-default": `${SITE.url}/destinations/${page.slug}`,
      };
      const genericEntry = byUrl.get(`${SITE.url}/destinations/${page.slug}`);
      expect(genericEntry).toBeDefined();
      expect(genericEntry?.alternates?.languages).toEqual(genericCluster);

      // The RU sibling must now be its own <loc>, sharing the identical
      // reciprocal cluster as the generic EN entry.
      const ruEntry = byUrl.get(`${SITE.url}/ru/destinations/${page.slug}`);
      expect(ruEntry).toBeDefined();
      expect(ruEntry?.alternates?.languages).toEqual(genericCluster);
    }
  });
});
