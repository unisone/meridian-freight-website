import { describe, expect, it } from "vitest";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { blogPostsEs } from "@/content/blog-es";
import { blogPostsRu } from "@/content/blog-ru";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import ruMessages from "@/messages/ru.json";

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
    expect(post.content).toContain("Paranaguá, Brazil");
    expect(post.content).toContain("Montevideo");
    expect(post.content).toContain("five-year age limit");
    expect(post.content).toContain("before you buy");
    expect(post.content).toContain("pre-purchase");
    expect(post.content).toContain("local leg is confirmed separately");
    expect(post.content).toContain("not the same as delivery to a farm in Paraguay");
    expect(post.content).toContain("Meridian handles");
    expect(post.content).toContain("Your Paraguay importer, customs broker, or local team handles");

    expect(post.content).not.toContain("MANU");
    expect(post.content).not.toContain("$10,000");
    expect(post.content).not.toContain("guaranteed");
    expect(post.content).not.toContain("best price");
    expect(post.content).not.toContain("overpay dealers");
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

  it("keeps the Paraguay blog page optimized for skimming and pre-purchase screening", () => {
    expect(enMessages.BlogPostPage.quickAnswerHeading).toContain("before you buy");
    expect(enMessages.BlogPostPage.routeComparisonHeading).toContain("Route");
    expect(enMessages.BlogPostPage.screeningCtaButton).toContain("before buying");

    expect(esMessages.BlogPostPage.quickAnswerHeading).toContain("antes de comprar");
    expect(esMessages.BlogPostPage.routeParanaguaBuyerConfirms).toContain("despachante");
    expect(esMessages.BlogPostPage.screeningCtaButton).toContain("Revisar");

    expect(ruMessages.BlogPostPage.quickAnswerHeading).toContain("до покупки");
    expect(ruMessages.BlogPostPage.routeComparisonHeading).toContain("маршрут");
    expect(ruMessages.BlogPostPage.screeningCtaButton).toContain("покупки");
  });
});
