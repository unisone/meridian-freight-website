import { describe, expect, it } from "vitest";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { blogPostsEs } from "@/content/blog-es";
import { blogPostsRu } from "@/content/blog-ru";

const PARAGUAY_IMPORT_SLUG = "import-farm-machinery-united-states-paraguay";

describe("blog content", () => {
  it("publishes the Paraguay import guide in every supported blog locale", () => {
    expect(blogPosts[0]?.slug).toBe(PARAGUAY_IMPORT_SLUG);
    expect(blogPostsEs[0]?.slug).toBe(PARAGUAY_IMPORT_SLUG);
    expect(blogPostsRu[0]?.slug).toBe(PARAGUAY_IMPORT_SLUG);

    expect(getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "en")).toBeDefined();
    expect(getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "es")).toBeDefined();
    expect(getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "ru")).toBeDefined();
  });

  it("keeps the Paraguay import guide aligned with SEO and buyer-intent requirements", () => {
    const post = getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "en");
    expect(post).toBeDefined();
    if (!post) throw new Error("Paraguay import guide is missing");

    expect(post.title).toBe(
      "How to Import Farm Machinery from the United States to Paraguay",
    );
    expect(post.metaDescription.length).toBeGreaterThanOrEqual(120);
    expect(post.metaDescription.length).toBeLessThanOrEqual(160);
    expect(post.keywords).toContain("how to import farm machinery from USA to Paraguay");
    expect(post.keywords).toContain("import used agricultural machinery Paraguay");
    expect(post.keywords).toContain("Ley 7565 machinery Paraguay");
  });

  it("sources material Paraguay route and compliance claims", () => {
    const post = getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "en");
    expect(post).toBeDefined();
    if (!post) throw new Error("Paraguay import guide is missing");

    const requiredSourceUrls = [
      "https://www.trade.gov/country-commercial-guides/paraguay-agricultural-sectors",
      "https://www.trade.gov/country-commercial-guides/paraguay-paraguay-parana-waterway-system",
      "https://www.trade.gov/country-commercial-guides/paraguay-customs-regulations",
      "https://www.trade.gov/country-commercial-guides/paraguay-import-requirements-documentation",
      "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados",
      "https://www.abc.com.py/negocios/abc-campo/2026/01/24/importacion-de-maquinarias-usadas-en-alza/",
    ];

    for (const url of requiredSourceUrls) {
      expect(post.content).toContain(url);
    }
  });

  it("keeps route options useful without turning internal rates into public promises", () => {
    const post = getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "en");
    expect(post).toBeDefined();
    if (!post) throw new Error("Paraguay import guide is missing");

    expect(post.content).toContain("Asunción or Villeta");
    expect(post.content).toContain("Paranagua, Brazil");
    expect(post.content).toContain("Montevideo");
    expect(post.content).toContain("five-year age limit");
    expect(post.content).toContain("must be confirmed separately");
    expect(post.content).toContain("not the same as a delivered-to-farm Paraguay quote");

    expect(post.content).not.toContain("MANU");
    expect(post.content).not.toContain("$10,000");
    expect(post.content).not.toContain("guaranteed");
    expect(post.content).not.toContain("best price");
  });

  it("keeps the guide connected to relevant internal buyer paths", () => {
    const post = getBlogPostBySlug(PARAGUAY_IMPORT_SLUG, "en");
    expect(post).toBeDefined();
    if (!post) throw new Error("Paraguay import guide is missing");

    const requiredInternalLinks = [
      "/es/destinations/paraguay",
      "/services/agricultural",
      "/services/equipment-sales",
      "/pricing/calculator",
    ];

    for (const href of requiredInternalLinks) {
      expect(post.content).toContain(href);
    }
  });
});
