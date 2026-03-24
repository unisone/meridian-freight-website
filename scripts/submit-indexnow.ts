/**
 * Submit all site URLs to IndexNow for instant Bing/Yandex indexing.
 *
 * Usage:
 *   INDEXNOW_KEY=xxx npx tsx scripts/submit-indexnow.ts
 */

import { services } from "../content/services";
import { equipmentTypes } from "../content/equipment";
import { destinations } from "../content/destinations";

const SITE_URL = "https://meridianexport.com";
const SITE_DOMAIN = "meridianexport.com";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

if (!INDEXNOW_KEY) {
  console.error("Error: INDEXNOW_KEY environment variable is required.");
  console.error("Usage: INDEXNOW_KEY=xxx npx tsx scripts/submit-indexnow.ts");
  process.exit(1);
}

// Build URL list — mirrors app/sitemap.ts, all 3 locales
const LOCALES = ["", "/es", "/ru"]; // "" = English (no prefix)

const staticPaths = [
  "",
  "/about",
  "/services",
  "/projects",
  "/destinations",
  "/pricing",
  "/pricing/calculator",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

const dynamicPaths = [
  ...(services.en ?? []).map((s) => `/services/${s.slug}`),
  ...(equipmentTypes.en ?? []).map((e) => `/equipment/${e.slug}`),
  ...(destinations.en ?? []).map((d) => `/destinations/${d.slug}`),
];

const allPaths = [...staticPaths, ...dynamicPaths];

const urls: string[] = LOCALES.flatMap((locale) =>
  allPaths.map((path) => `${SITE_URL}${locale}${path}`)
);

async function submit() {
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  console.log();

  const payload = {
    host: SITE_DOMAIN,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  console.log(`Response status: ${response.status} ${response.statusText}`);

  if (response.ok || response.status === 202) {
    console.log(`Successfully submitted ${urls.length} URLs.`);
    console.log();
    console.log("URLs submitted:");
    for (const url of urls) {
      console.log(`  ${url}`);
    }
    process.exit(0);
  } else {
    const text = await response.text().catch(() => "(no body)");
    console.error(`IndexNow API error: ${text}`);
    process.exit(1);
  }
}

submit();
