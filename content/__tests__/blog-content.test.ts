import { describe, expect, it } from "vitest";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { argentinaMarketPage } from "@/content/argentina-market";
import { blogPostsEs } from "@/content/blog-es";
import { blogPostsRu } from "@/content/blog-ru";
import {
  LATAM_IMPORT_GUIDE_SLUGS,
  buildWhatsappUrl,
  getImportGuideEnhancement,
  importGuideEnhancementsEn,
  importGuideEnhancementsEs,
  isLatamImportGuideSlug,
} from "@/content/import-guide-enhancements";
import { getLatamMarketPage } from "@/content/latam-market-pages";
import { services } from "@/content/services";
import { getBlogLocalePolicy } from "@/lib/blog-locale-policy";
import { localizeHref, renderMarkdown } from "@/lib/markdown";
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

describe("LATAM import-guide enhancements", () => {
  const ALL_LATAM_SLUGS = [
    "import-farm-machinery-united-states-paraguay",
    ...LATAM_IMPORT_GUIDES.map((g) => g.slug),
  ];

  it("covers every LATAM import-guide slug in both indexable locales", () => {
    for (const slug of ALL_LATAM_SLUGS) {
      expect(isLatamImportGuideSlug(slug)).toBe(true);
      expect(LATAM_IMPORT_GUIDE_SLUGS).toContain(slug);
      const es = getImportGuideEnhancement(slug, "es");
      const en = getImportGuideEnhancement(slug, "en");
      expect(es).toBeDefined();
      expect(en).toBeDefined();
    }
  });

  it("does not expose enhancement data for non-LATAM slugs", () => {
    expect(isLatamImportGuideSlug("complete-guide-shipping-farm-equipment-usa")).toBe(false);
    expect(
      getImportGuideEnhancement("complete-guide-shipping-farm-equipment-usa", "es"),
    ).toBeUndefined();
  });

  it("requires every enhancement to carry the structured modules the template renders", () => {
    for (const slug of ALL_LATAM_SLUGS) {
      for (const dict of [importGuideEnhancementsEs, importGuideEnhancementsEn]) {
        const enhancement = dict[slug as keyof typeof dict];
        expect(enhancement).toBeDefined();
        expect(enhancement.scopeIntro.length).toBeGreaterThan(80);
        expect(enhancement.quickAnswer.steps.length).toBeGreaterThanOrEqual(4);
        expect(enhancement.quickAnswer.steps.length).toBeLessThanOrEqual(6);
        expect(enhancement.scopeSplit.rows.length).toBeGreaterThanOrEqual(4);
        expect(enhancement.scopeSplit.rows.some((row) => row.confirmedBy === "broker")).toBe(true);
        expect(enhancement.scopeSplit.rows.some((row) => row.confirmedBy === "meridian")).toBe(true);
        expect(enhancement.routeTable.rows.length).toBeGreaterThanOrEqual(2);
        expect(enhancement.buyerPacket.items.length).toBeGreaterThanOrEqual(4);
        expect(enhancement.cta.primaryLabel.length).toBeGreaterThan(10);
        expect(enhancement.cta.whatsappMessage).toMatch(/link/i);
      }
    }
  });

  it("produces a country-specific Spanish CTA per spec section 4.4", () => {
    const expected: Record<string, string> = {
      "import-farm-machinery-united-states-paraguay": "Revisar Ley 7565 y ruta antes de comprar",
      "import-farm-machinery-united-states-argentina": "Revisar AFIDI, SENASA y ruta antes de comprar",
      "import-farm-machinery-united-states-uruguay": "Revisar DGSA, Montevideo y documentos",
      "import-farm-machinery-united-states-bolivia": "Revisar ruta vía puerto chileno",
      "import-farm-machinery-united-states-chile": "Revisar SAG y condición de la máquina",
    };
    for (const [slug, label] of Object.entries(expected)) {
      const enhancement = getImportGuideEnhancement(slug, "es");
      expect(enhancement?.cta.primaryLabel).toBe(label);
      expect(enhancement?.cta.heading).toBe(label);
    }
  });

  it("renders a tracked WhatsApp prefill URL with the country-specific message", () => {
    for (const slug of ALL_LATAM_SLUGS) {
      const enhancement = getImportGuideEnhancement(slug, "es")!;
      const url = buildWhatsappUrl(enhancement.cta.whatsappMessage);
      expect(url).toMatch(/^https:\/\/wa\.me\/16415161616\?text=/);
      const decoded = decodeURIComponent(url.split("?text=")[1] ?? "");
      expect(decoded).toContain("Link del anuncio");
    }
  });

  it("renames the source block to the operational workflow heading", () => {
    for (const slug of ALL_LATAM_SLUGS) {
      const esPost = getBlogPostBySlug(slug, "es");
      const enPost = getBlogPostBySlug(slug, "en");
      expect(esPost?.content).toContain("Fuentes oficiales para revisar con su despachante");
      expect(enPost?.content).toContain("Official sources to review with your broker");
    }
  });

  it("opens each LATAM guide with the spec-required pre-purchase paragraph", () => {
    const required: Record<string, { es: string[]; en: string[] }> = {
      "import-farm-machinery-united-states-argentina": {
        es: ["no empiece por el precio del flete", "Meridian coordina el tramo de exportación"],
        en: ["do not start with the freight price", "Meridian coordinates the U.S./Canada export scope"],
      },
      "import-farm-machinery-united-states-uruguay": {
        es: ["una cotización a Montevideo no equivale a nacionalización", "Meridian coordina el tramo de exportación"],
        en: ["Montevideo freight quote is not nationalization", "Meridian coordinates the U.S./Canada export scope"],
      },
      "import-farm-machinery-united-states-bolivia": {
        es: ["el riesgo principal no es solo el flete marítimo", "Meridian coordina el tramo de exportación"],
        en: ["the main risk is not just ocean freight", "Meridian coordinates the U.S./Canada export scope"],
      },
      "import-farm-machinery-united-states-chile": {
        es: ["maquinaria usada no entra solo porque el flete sea posible", "Meridian coordina el tramo de exportación"],
        en: ["used machinery does not enter just because the freight works", "Meridian coordinates the U.S./Canada export scope"],
      },
    };
    for (const [slug, { es, en }] of Object.entries(required)) {
      const esPost = getBlogPostBySlug(slug, "es")!;
      const enPost = getBlogPostBySlug(slug, "en")!;
      for (const phrase of es) expect(esPost.content).toContain(phrase);
      for (const phrase of en) expect(enPost.content).toContain(phrase);
    }
  });
});

describe("blog locale indexability policy", () => {
  it("keeps LATAM import guides indexable in es and en, noindex in ru, x-default es", () => {
    for (const slug of LATAM_IMPORT_GUIDE_SLUGS) {
      const policy = getBlogLocalePolicy(slug);
      expect(policy.indexableLocales).toEqual(["es", "en"]);
      expect(policy.indexableLocales).not.toContain("ru");
      expect(policy.alternateLocales).toEqual(["es", "en"]);
      expect(policy.xDefaultLocale).toBe("es");
    }
  });

  it("falls back to the default tri-locale policy for non-LATAM blog posts", () => {
    const defaultPolicy = getBlogLocalePolicy("complete-guide-shipping-farm-equipment-usa");
    expect(defaultPolicy.indexableLocales).toEqual(["en", "es", "ru"]);
    expect(defaultPolicy.xDefaultLocale).toBe("en");
  });
});

describe("locale-aware markdown renderer", () => {
  it("prefixes internal absolute links with the current non-English locale", () => {
    const html = renderMarkdown(
      "See the [Paraguay buyer hub](/es/destinations/paraguay), the [agricultural service](/services/agricultural), the [calculator](/pricing/calculator), and the [Argentina destination page](/destinations/argentina).",
      "es",
    );
    expect(html).toContain('href="/es/destinations/paraguay"');
    expect(html).toContain('href="/es/services/agricultural"');
    expect(html).toContain('href="/es/pricing/calculator"');
    expect(html).toContain('href="/es/destinations/argentina"');
  });

  it("leaves English links untouched on the default locale", () => {
    const html = renderMarkdown("[services](/services/agricultural)", "en");
    expect(html).toContain('href="/services/agricultural"');
  });

  it("preserves external source URLs and adds noopener noreferrer for external links", () => {
    const html = renderMarkdown(
      "[DGSA](https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016)",
      "es",
    );
    expect(html).toContain(
      'href="https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016"',
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("does not double-prefix when the link already includes a locale segment", () => {
    expect(localizeHref("/es/destinations/paraguay", "es")).toBe("/es/destinations/paraguay");
    expect(localizeHref("/ru/destinations/kazakhstan", "ru")).toBe("/ru/destinations/kazakhstan");
  });

  it("rejects unsafe href schemes during inline link processing", () => {
    const html = renderMarkdown("[click](javascript:alert(1))", "es");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("click");
  });
});

describe("documentation service scope language", () => {
  it("does not claim Meridian replaces the destination broker in the EN longDescription", () => {
    const docService = services.en.find((s) => s.slug === "documentation");
    expect(docService).toBeDefined();
    expect(docService!.longDescription).toMatch(/U\.S\.\/Canada export-side/);
    expect(docService!.longDescription).toMatch(/buyer's licensed broker or importer/);
  });

  it("does not claim Meridian replaces the despachante in the ES longDescription", () => {
    const docService = services.es.find((s) => s.slug === "documentation");
    expect(docService).toBeDefined();
    expect(docService!.longDescription).toMatch(/EE\.UU\.\/Canadá/);
    expect(docService!.longDescription).toMatch(/despachante o importador licenciado/);
  });
});
