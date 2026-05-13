import { describe, expect, it } from "vitest";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { argentinaMarketPage } from "@/content/argentina-market";
import { blogPostsEs } from "@/content/blog-es";
import { blogPostsRu } from "@/content/blog-ru";
import { getLatamMarketPage } from "@/content/latam-market-pages";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import ruMessages from "@/messages/ru.json";

const PARAGUAY_IMPORT_SLUG = "import-farm-machinery-united-states-paraguay";

const LATAM_IMPORT_GUIDES = [
  {
    country: "argentina",
    slug: "import-farm-machinery-united-states-argentina",
    spanishTitle:
      "Cómo importar maquinaria agrícola de Estados Unidos a Argentina",
    destinationLink: "/es/destinations/argentina",
    marketLinkType: "argentinaProofLinks",
    requiredSpanishPhrases: [
      "despachante argentino",
      "AFIDI",
      "Sistema Informático Malvina",
      "antes de comprar",
      "Meridian coordina",
    ],
    requiredSources: [
      "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791",
      "https://www.argentina.gob.ar/servicio/gestionar-la-autorizacion-fitosanitaria-de-importacion-afidi-y-la-evaluacion-de",
      "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de",
    ],
  },
  {
    country: "uruguay",
    slug: "import-farm-machinery-united-states-uruguay",
    spanishTitle:
      "Cómo importar maquinaria agrícola de Estados Unidos a Uruguay",
    destinationLink: "/es/destinations/uruguay",
    marketLinkType: "latamResourceLinks",
    requiredSpanishPhrases: [
      "Montevideo",
      "DGSA",
      "Resolución 98/016",
      "despachante uruguayo",
      "antes de comprar",
      "Meridian coordina",
    ],
    requiredSources: [
      "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais",
      "https://www.trade.gov/country-commercial-guides/uruguay-agricultural-equipment",
    ],
  },
  {
    country: "bolivia",
    slug: "import-farm-machinery-united-states-bolivia",
    spanishTitle:
      "Cómo importar maquinaria agrícola de Estados Unidos a Bolivia",
    destinationLink: "/es/destinations/bolivia",
    marketLinkType: "latamResourceLinks",
    requiredSpanishPhrases: [
      "Arica",
      "Santa Cruz",
      "ASPB",
      "SENASAG",
      "broker o importador",
      "antes de comprar",
      "Meridian coordina",
    ],
    requiredSources: [
      "https://www.trade.gov/country-commercial-guides/bolivia-agricultural-sectors",
      "https://www.aspb.gob.bo/arica-chile/",
      "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal",
      "https://www.bcn.cl/leychile/navegar?idNorma=1006532",
    ],
  },
  {
    country: "chile",
    slug: "import-farm-machinery-united-states-chile",
    spanishTitle:
      "Cómo importar maquinaria agrícola de Estados Unidos a Chile",
    destinationLink: "/es/destinations/chile",
    marketLinkType: "latamResourceLinks",
    requiredSpanishPhrases: [
      "San Antonio",
      "Valparaíso",
      "SAG",
      "Resolución 3.103/2016",
      "despachador de aduanas",
      "antes de comprar",
      "Meridian coordina",
    ],
    requiredSources: [
      "https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725",
      "https://www.sag.cl/content/establece-requisitos-fitosanitarios-para-la-importacion-admision-temporal-y-transito-de-maquinaria-usada-que-indica-y-deroga-resolucion-ndeg-2979-de-2001",
      "https://www.trade.gov/country-commercial-guides/chile-agricultural-equipment",
    ],
  },
] as const;

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
    for (const localePost of [
      post,
      blogPostsEs[0]!,
      blogPostsRu[0]!,
    ]) {
      expect(`${localePost.metaTitle} | Meridian Export`.length).toBeLessThanOrEqual(
        60,
      );
    }
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

  it("keeps shared blog sidebar route-check copy country-neutral", () => {
    expect(enMessages.BlogPostPage.supportCardDescription).toContain(
      "intended final destination",
    );
    expect(enMessages.BlogPostPage.supportCardDescription).not.toContain(
      "Paraguay",
    );

    expect(esMessages.BlogPostPage.supportCardDescription).toContain(
      "destino final previsto",
    );
    expect(esMessages.BlogPostPage.supportCardDescription).not.toContain(
      "Paraguay",
    );

    expect(ruMessages.BlogPostPage.supportCardDescription).toContain(
      "предполагаемый конечный пункт",
    );
    expect(ruMessages.BlogPostPage.supportCardDescription).not.toContain(
      "Парагва",
    );
  });

  it("publishes the Spanish-first LATAM import guide cluster with locale parity", () => {
    for (const guide of LATAM_IMPORT_GUIDES) {
      const englishPost = getBlogPostBySlug(guide.slug, "en");
      const spanishPost = getBlogPostBySlug(guide.slug, "es");
      const russianPost = getBlogPostBySlug(guide.slug, "ru");

      expect(englishPost).toBeDefined();
      expect(spanishPost).toBeDefined();
      expect(russianPost).toBeDefined();
      if (!englishPost || !spanishPost || !russianPost) {
        throw new Error(`${guide.slug} is missing from at least one locale`);
      }

      expect(blogPosts.map((post) => post.slug)).toContain(guide.slug);
      expect(blogPostsEs.map((post) => post.slug)).toContain(guide.slug);
      expect(blogPostsRu.map((post) => post.slug)).toContain(guide.slug);
      expect(spanishPost.title).toBe(guide.spanishTitle);
      expect(spanishPost.category).toBe("Destinos");
      expect(spanishPost.content.toLowerCase()).toContain("usted");
      expect(spanishPost.content).toContain(guide.destinationLink);
      expect(spanishPost.content).toContain("/services/agricultural");
      expect(spanishPost.content).toContain("/services/equipment-sales");
      expect(spanishPost.content).toContain("/pricing/calculator");

      for (const localePost of [englishPost, spanishPost, russianPost]) {
        expect(`${localePost.metaTitle} | Meridian Export`.length).toBeLessThanOrEqual(
          60,
        );
        expect(localePost.metaDescription.length).toBeGreaterThanOrEqual(120);
        expect(localePost.metaDescription.length).toBeLessThanOrEqual(160);
        expect(localePost.publishedAt).toBe("2026-05-13");
      }
    }
  });

  it("sources each LATAM import guide's material market, route, and compliance claims", () => {
    for (const guide of LATAM_IMPORT_GUIDES) {
      const post = getBlogPostBySlug(guide.slug, "es");
      expect(post).toBeDefined();
      if (!post) throw new Error(`${guide.slug} is missing`);

      for (const sourceUrl of guide.requiredSources) {
        expect(post.content).toContain(sourceUrl);
      }

      for (const phrase of guide.requiredSpanishPhrases) {
        expect(post.content).toContain(phrase);
      }
    }
  });

  it("keeps the LATAM cluster scoped to export logistics without unsupported promises", () => {
    const bannedPublicCopy = [
      "best price",
      "guaranteed",
      "garantizado",
      "overpay dealers",
      "MANU",
      "prueba artificial",
      "inflar prueba",
      "prompt",
      "keyword cluster",
      "SEO rationale",
      "buyer anxiety",
      "costo final nacionalizado incluido",
    ];

    for (const guide of LATAM_IMPORT_GUIDES) {
      const post = getBlogPostBySlug(guide.slug, "es");
      expect(post).toBeDefined();
      if (!post) throw new Error(`${guide.slug} is missing`);

      expect(post.content).toContain("no reemplaza");
      expect(post.content).toContain("tramo de exportación");
      expect(post.content).toContain("tramo local");
      expect(post.content).toContain("antes de comprar");

      for (const banned of bannedPublicCopy) {
        expect(post.content).not.toContain(banned);
      }
    }
  });

  it("links the country market pages back into the matching import guide cluster", () => {
    const argentinaLinks = argentinaMarketPage.proofLinks.map((item) => item.href);
    expect(argentinaLinks).toContain(
      "/blog/import-farm-machinery-united-states-argentina",
    );

    for (const guide of LATAM_IMPORT_GUIDES.filter(
      (item) => item.marketLinkType === "latamResourceLinks",
    )) {
      const page = getLatamMarketPage(guide.country);
      expect(page).toBeDefined();
      if (!page) throw new Error(`${guide.country} LATAM page is missing`);

      expect(page.resourceLinks.map((item) => item.href)).toContain(
        `/blog/${guide.slug}`,
      );
    }
  });
});
