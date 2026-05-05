import { describe, expect, it } from "vitest";
import { latamMarketPages } from "@/content/latam-market-pages";
import { buildLatamMarketMetadata } from "@/lib/latam-market-metadata";
import { SITE } from "@/lib/constants";

describe("LATAM destination metadata", () => {
  it("keeps Spanish buyer hub alternates aligned with sitemap intent", async () => {
    for (const page of latamMarketPages) {
      const metadata = buildLatamMarketMetadata(page);

      expect(metadata.alternates?.canonical).toBe(`${SITE.url}${page.path}`);
      expect(metadata.alternates?.languages).toEqual({
        es: `${SITE.url}${page.path}`,
      });
    }
  });

  it("emits absolute social image URLs for Spanish buyer hubs", async () => {
    for (const page of latamMarketPages) {
      const metadata = buildLatamMarketMetadata(page);
      const expectedImage = `${SITE.url}${page.hero.image.src}`;
      const openGraphImages = metadata.openGraph?.images as Array<{ url: string }>;
      const twitterImages = metadata.twitter?.images as string[];

      expect(openGraphImages[0]?.url).toBe(expectedImage);
      expect(twitterImages).toEqual([expectedImage]);
    }
  });
});
