# Argentina Destination Page — Phase 1 Remediation Spec

**Date:** 2026-04-21
**Status:** **COMPLETED** — all in-scope items shipped and production-verified
**Author:** AI-drafted (Claude Code), Codex-SOP normalized per `AGENTS.md`
**Depends on:** None (content + view-layer changes only)

## Final ship log

| PR | Commit | Scope |
|---|---|---|
| [#95](https://github.com/unisone/meridian-freight-website/pull/95) | `c20e9fe` | Phase 1 remediation — R-1 through R-6 (MALVINA/SIM, SENASA sharpening, slop removal, duplicate BreadcrumbList, `formatCount` helper, 11 es.json digit fixes) |
| [#96](https://github.com/unisone/meridian-freight-website/pull/96) | `5fc0c01` | Site-wide `es-AR` BCP-47 tags across 22 `inLanguage` sites in 17 files + 222 Spanish accent corrections (post-deploy supplementary) |
| [#97](https://github.com/unisone/meridian-freight-website/pull/97) | `c545087` | Deferred v3 R-10/R-11/R-22 items — meta description 163→126 chars, H1 98→55 chars, `x-default` hreflang, `og:type` (post-deploy supplementary) |
| [#98](https://github.com/unisone/meridian-freight-website/pull/98) | `e0c4004` | P1/P2/P3 founder-review closure — 5 missing Spanish translations, initial 404 attempt, Spanish chrome accent pass, H1 `Importe → Importar`, dealers line softened (post-deploy supplementary) |
| [#99](https://github.com/unisone/meridian-freight-website/pull/99) | `878522e` | In-page `permanentRedirect` for non-es (did not fire at edge due to cache) |
| [#100](https://github.com/unisone/meridian-freight-website/pull/100) | `e0ab4e8` | `next.config.ts` explicit edge redirects — reliable 308 for `/destinations/argentina` and `/ru/destinations/argentina` → `/es/destinations/argentina` |

## Revision history

- **v1 (superseded):** 38 findings spanning Argentina page, site-wide hygiene, speculative CRO. Rejected by founder as too broad and unverified.
- **v2 (superseded):** Narrowed to 6 high-confidence fixes focused on trust + SEO correctness + buyer-facing copy quality. Rejected by founder: strategic synthesis not verified against exact repo behavior. Two real bugs would have shipped (R-3 breadcrumb regression, R-4 broken locale format) and one script (`npm run type-check`) was missing from QA.
- **v3 (approved):** Same six functional fixes as v2, but every claim now carries a `Verified:` citation to a file:line or command output. Scope expanded by ~5 LOC to make `<Breadcrumbs>` locale-aware, which R-3's original "just delete" approach would have otherwise regressed. Adds a `formatCount(n, locale)` helper because raw `toLocaleString(useLocale())` produces wrong output for `"es"`. Shipped in PR #95.
- **v3+post-deploy (this):** After PR #95 shipped, founder-led production QA surfaced five classes of issue not covered by the original spec — (a) site-wide `inLanguage` was `"es"` not `"es-AR"` on shared schemas (#96), (b) three v3 spec items (R-10 meta trim, R-11 H1 split, R-22 x-default) were promised but not shipped (#97), (c) five `MISSING_MESSAGE` build errors on ES pages (#98), (d) Spanish chrome + adjacent content used unaccented spelling (#98), (e) non-es Argentina routes were serving soft-404 (HTTP 200 with not-found body) instead of a proper redirect (#99, #100). All resolved.

---

## 1. Verification log (the per-item readiness pass)

Every claim below is traced to a concrete artifact. If a line exists with no `Verified:` entry, treat it as a spec bug.

### 1a. Runtime verification commands executed

| # | Command / Fetch | Result | Feeds requirement |
|---|---|---|---|
| V1 | `node -e "['es','es-AR','es-ES','es-419','en-US'].forEach(l => console.log(l, (1000).toLocaleString(l)))"` | `es → "1000"`, `es-AR → "1.000"`, `es-ES → "1000"`, `es-419 → "1,000"`, `en-US → "1,000"` | R-4 |
| V2 | Read `i18n/routing.ts:4` | `locales: ["en", "es", "ru"] as const` → `useLocale()` returns one of three literals | R-4 |
| V3 | Read `i18n/routing.ts:5` | `defaultLocale: "en"` | R-4 |
| V4 | Read `package.json:9` | `"type-check": "tsc --noEmit"` script exists | QA matrix |
| V5 | Read `AGENTS.md:439-519` | Standard feature workflow: `feat/<descriptive-name>` branches, commit-then-push, preview verify, PR, merge, prod verify | Plan sequencing |
| V6 | Read `components/breadcrumbs.tsx:22-35` | JSON-LD built with `item: SITE.url` and `item: \`${SITE.url}${item.href}\`` — no locale prefix | R-3 |
| V7 | Read `app/[locale]/destinations/argentina/page.tsx:168-172` | Page passes `[{ label: "Destinos", href: "/destinations" }, { label: "Argentina" }]` — `/destinations` is English path, Argentina has no href | R-3 |
| V8 | Read `lib/i18n-utils.ts:5-9` | `OG_LOCALES` already maps `en→en_US`, `es→es_419`, `ru→ru_RU`. Helper pattern exists for similar mapping. | R-4 |
| V9 | WebFetch `argentina.gob.ar/noticias/argentina-controla-la-importacion...` | Quoted phrases: "revisión documental e inspección física", "equipos limpios, libres de suelo y restos vegetales", "tratamientos fitosanitarios correspondientes", "SIGPV-IMPO … previo a cualquier transacción comercial" | R-6 |
| V10 | WebFetch `argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto` | Article 5 verbatim: "deberán completar una Declaración Jurada en el SISTEMA INFORMÁTICO MALVINA" | R-1 |

### 1b. File:line verification for each proposed edit

| Edit | Expected location | Verified current content | Status |
|---|---|---|---|
| R-1 insert into `marketChange.changed` | `content/argentina-market.ts:154-158` | Array with 3 existing bullets; closing `]` at line 158 | ✓ |
| R-1 insert new FAQ entry before "despachante argentino" Q | `content/argentina-market.ts:357-362` | Last FAQ entry, closing `}` at 362 | ✓ |
| R-2 slop #1 | `content/argentina-market.ts:290` | `"Para esta página evitamos usar operaciones puntuales como si fueran prueba directa de Argentina…"` | ✓ |
| R-2 slop #2 | `content/argentina-market.ts:310` | `"Si más adelante se confirman proyectos reales que encajen con la narrativa Argentina…"` | ✓ |
| R-2 slop #3 | `content/argentina-market.ts:388` | `"Revise la biblioteca global de exportaciones de Meridian sin usarla como prueba artificial del corredor Argentina."` | ✓ |
| R-3 breadcrumb const | `app/[locale]/destinations/argentina/page.tsx:113-136` | Const literal closes with `};` on **line 136**, not 135 | ⚠ v2 was off-by-one; v3 corrected |
| R-3 breadcrumb `<script>` render | `app/[locale]/destinations/argentina/page.tsx:158-161` | Confirmed | ✓ |
| R-4 WebPage inLanguage | `app/[locale]/destinations/argentina/page.tsx:96` | `inLanguage: "es",` | ✓ |
| R-4 FAQPage inLanguage | `app/[locale]/destinations/argentina/page.tsx:141` | `inLanguage: "es",` | ✓ |
| R-4 page stat formatter | `app/[locale]/destinations/argentina/page.tsx:562` | `{STATS.projectsCompleted.toLocaleString("en-US")}+` | ✓ |
| R-4 TrustBar formatter | `components/trust-bar.tsx:32` | `{count.toLocaleString("en-US")}{item.suffix}` | ✓ |
| R-5 keyword removal | `content/argentina-market.ts:112` | `"precio final maquinaria en argentina desde usa",` | ✓ |
| R-6 unchanged bullets | `content/argentina-market.ts:161-162` | Bullets 1 & 2 as quoted in target | ✓ |

---

## 2. Scope

### In scope — six fixes (v2 carried forward, v3 corrected)

| # | Fix | Category | File(s) |
|---|---|---|---|
| R-1 | Close the MALVINA / SIM gap — Decreto 273/2025 replaced CIBU with Declaración Jurada in Sistema Informático Malvina (SIM), not eliminated paperwork | Trust / factual | `content/argentina-market.ts` |
| R-2 | Remove three editorial-note leaks from customer-facing copy ("prueba artificial", "inflar prueba", "curar de forma explícita") | Trust / copy quality | `content/argentina-market.ts:290, 310, 388` |
| R-3 | Dedupe `BreadcrumbList` JSON-LD AND make `<Breadcrumbs>` locale-aware so deleting the page-level block doesn't regress to English URLs on a Spanish page | SEO correctness | `app/[locale]/destinations/argentina/page.tsx`, `components/breadcrumbs.tsx` |
| R-4 | Introduce `formatCount(n, locale)` helper mapping `es→es-AR`, `ru→ru-RU`, default `en-US`, because `toLocaleString("es")` returns `"1000"` (no separator). Plus `inLanguage: "es-AR"` on JSON-LD. | SEO correctness / buyer-facing | `lib/i18n-utils.ts`, `components/trust-bar.tsx`, `app/[locale]/destinations/argentina/page.tsx` |
| R-5 | Drop the misaligned keyword `"precio final maquinaria en argentina desde usa"` — FAQ handling stays | SEO correctness | `content/argentina-market.ts:112` |
| R-6 | Sharpen SENASA/AFIDI content using source-accurate language (SIGPV-IMPO, revisión documental e inspección física, equipos limpios, tratamientos fitosanitarios) | Trust / factual | `content/argentina-market.ts:161-162` |

### Out of scope — explicitly deferred

Unchanged from v2. See v2 spec history for the full list. No item has been silently dropped; each is preserved as a candidate for a future narrower spec.

---

## 3. Success criteria

| Metric | Baseline (pre-change, verified) | Target | Verification method |
|---|---|---|---|
| MALVINA/SIM mention | 0 occurrences | ≥ 3 (marketChange bullet + FAQ Q + FAQ A) | `grep -n "MALVINA\|Malvina\|SIM" content/argentina-market.ts` |
| Editorial-note leaks | 3 strings present at lines 290/310/388 | 0 | `grep -nE "prueba artificial\|inflar prueba\|curar de forma explícita" content/` |
| `BreadcrumbList` blocks in rendered HTML | 2 (page-level + component) | 1 | Google Rich Results Test on preview URL |
| `BreadcrumbList` item URLs for Spanish page | All `/es/...` (correct) | All `/es/...` preserved after dedupe | View source of preview → inspect JSON-LD |
| `inLanguage` on WebPage + FAQPage JSON-LD | `"es"` | `"es-AR"` | View source of preview |
| Rendered thousands separator on `/es/destinations/argentina` TrustBar and credibility stat | `1,000+` (en-US comma) | `1.000+` (es-AR dot) | Visual check in preview |
| Misaligned keyword | present at line 112 | absent | `grep -n "precio final maquinaria en argentina desde usa" content/` |
| SENASA/AFIDI source-accurate phrases | 0 verbatim matches | 4+ verbatim matches (SIGPV-IMPO, revisión documental, libres de suelo, tratamientos fitosanitarios) | `grep -nE "SIGPV-IMPO\|revisión documental\|libres de suelo" content/` |
| `npm run type-check` passes | — | ✓ | CI |
| `npm run lint` passes | — | ✓ | CI |
| `npm test` passes | — | ✓ | CI |

---

## 4. Detailed requirements

Each requirement states: **Current** (verified) → **Target** (exact new content) → **Rationale** → **Verified** → **Acceptance**.

### R-1. Close the MALVINA / SIM gap

**Current** (verified at `content/argentina-market.ts:148-164`):

```ts
marketChange: {
  title: "Qué cambió en Argentina y qué no",
  intro:
    "El 16 de abril de 2025 el Decreto 273/2025 eliminó el requisito previo del CIBU para muchos bienes usados. Eso abrió el mercado. Lo que no hizo fue volver automática una operación que sigue dependiendo de documentación, limpieza y coordinación técnica.",
  dateLabel: "16 abril 2025",
  changedLabel: "Lo que sí cambió",
  changed: [
    "La conversación dejó de ser si se puede importar y pasó a ser cómo cerrar una operación seria.",
    "Hoy es más viable comparar disponibilidad, configuración y precio de usados en EE.UU. frente a mercado local.",
    "El comprador argentino puede avanzar más rápido si separa bien el tramo puerta a puerto del costo argentino final.",
  ],
```

**Target** — insert the MALVINA bullet as new index 1 (between the first two):

```ts
  changed: [
    "La conversación dejó de ser si se puede importar y pasó a ser cómo cerrar una operación seria.",
    "El CIBU ya no es un trámite previo: fue reemplazado por una Declaración Jurada en el Sistema Informático Malvina (SIM), que arma su despachante al momento del despacho de importación.",
    "Hoy es más viable comparar disponibilidad, configuración y precio de usados en EE.UU. frente a mercado local.",
    "El comprador argentino puede avanzar más rápido si separa bien el tramo puerta a puerto del costo argentino final.",
  ],
```

And in `content/argentina-market.ts:362`, insert a new FAQ entry as element index 6 (before the last entry, "¿Meridian se ocupa del despachante argentino?"):

```ts
{
  question: "¿Meridian gestiona la Declaración Jurada en MALVINA?",
  answer:
    "No. La Declaración Jurada en el Sistema Informático Malvina (SIM) la arma su despachante argentino al momento del despacho de importación, junto con el resto de la documentación aduanera. Meridian prepara la parte de exportación desde EE.UU. o Canadá — su despachante cierra la parte argentina.",
  category: "Argentina",
},
```

**Rationale:** Decreto 273/2025 Article 5 (verified V10) established the Declaración Jurada in Sistema Informático Malvina as the replacement mechanism for the CIBU. Current copy implies paperwork disappeared; accurate framing is that it moved. Material factual gap.

**Verified:** V10 quotes the exact decree text. `content/argentina-market.ts:154-158, 357-362` inspected.

**Acceptance:**
- `grep -n "MALVINA\|Malvina" content/argentina-market.ts` returns ≥ 3 hits.
- New FAQ entry renders in accordion on preview.
- FAQPage JSON-LD includes the new entry (verify by viewing page source on preview).

### R-2. Remove three customer-facing editorial leaks

**Current** (verified at `content/argentina-market.ts`):

| Line | Existing text |
|---|---|
| 290 | `"Para esta página evitamos usar operaciones puntuales como si fueran prueba directa de Argentina. Lo correcto es mostrar qué capacidad comercial y operativa puede verificar hoy mismo en Meridian."` |
| 310 | `"Si más adelante se confirman proyectos reales que encajen con la narrativa Argentina, se pueden curar de forma explícita. Mientras tanto, es mejor ser exactos que inflar prueba."` |
| 388 | `"Revise la biblioteca global de exportaciones de Meridian sin usarla como prueba artificial del corredor Argentina."` |

**Target:**

| Line | Replacement |
|---|---|
| 290 (`credibility.intro`) | `"En esta sección le mostramos la capacidad operativa que puede verificar hoy mismo — antes de comprometer una compra."` |
| 310 (`credibility.note`) | `"Somos transparentes: mostramos capacidad verificable, no promesas infladas."` |
| 388 (proofLinks `/projects` description) | `"Revise la biblioteca global de exportaciones de Meridian — operaciones reales en múltiples mercados."` |

**Rationale:** Each original phrase uses editorial/content-ops vocabulary ("narrativa Argentina", "curar de forma explícita", "inflar prueba", "prueba artificial del corredor Argentina") with no meaning to an Argentine buyer. Exposes internal reasoning, undercuts trust.

**Verified:** Line-for-line match of current strings. Founder confirmed this finding in round 1 and explicitly re-confirmed in v2 review.

**Acceptance:** `grep -nE "prueba artificial|inflar prueba|curar de forma explícita|narrativa Argentina" content/` returns 0 hits after edit.

### R-3. Dedupe `BreadcrumbList` AND make `<Breadcrumbs>` locale-aware

**Current state (verified):**

Two JSON-LD blocks emit `BreadcrumbList`:

**Block 1 (component)** — `components/breadcrumbs.tsx:18-36`:

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: t("home"), item: SITE.url },
    ...items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 2,
      name: item.label,
      ...(item.href ? { item: `${SITE.url}${item.href}` } : {}),
    })),
  ],
};
```

Page passes (verified at `page.tsx:169-172`): `breadcrumbs={[{ label: "Destinos", href: "/destinations" }, { label: "Argentina" }]}`.

**Component emits for Argentina page (verified by code trace):**
- Position 1: `name: "Inicio"` (if locale `es`), `item: "https://meridianexport.com"` — **no `/es` prefix**
- Position 2: `name: "Destinos"`, `item: "https://meridianexport.com/destinations"` — **no `/es` prefix; English path**
- Position 3: `name: "Argentina"` — **no `item` URL (no href passed)**

**Block 2 (page-level)** — `page.tsx:113-136` — emits correct Spanish URLs for all three positions.

**Target state:**

1. Delete `breadcrumbJsonLd` const (`page.tsx:113-136`) and its `<script>` block (`page.tsx:158-161`).

2. Enhance `components/breadcrumbs.tsx` to be locale-aware. Minimal change:

```ts
"use client"; // add if not already present

import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

// inside Breadcrumbs component body:
const locale = useLocale();
const pathname = usePathname(); // current path WITHOUT the locale prefix (next-intl helper)
const localePrefix = locale === "en" ? "" : `/${locale}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: t("home"), item: `${SITE.url}${localePrefix}` },
    ...items.map((item, i) => {
      const base = {
        "@type": "ListItem" as const,
        position: i + 2,
        name: item.label,
      };
      const href = item.href ?? (i === items.length - 1 ? pathname : null);
      return href ? { ...base, item: `${SITE.url}${localePrefix}${href}` } : base;
    }),
  ],
};
```

Result after change:
- Position 1 → `https://meridianexport.com/es`
- Position 2 → `https://meridianexport.com/es/destinations`
- Position 3 → `https://meridianexport.com/es/destinations/argentina`

**Caveat — verified separately:** The `Breadcrumbs` component is not currently `"use client"` (verified at `components/breadcrumbs.tsx:1` — no `"use client"` directive). `useLocale()` and `usePathname()` are usable in both client and server components with next-intl v3.22+ (this repo uses `^4.9.1` per `package.json:24`), but `usePathname` from `@/i18n/navigation` is a client hook. **Safer migration path:** accept `locale` and `currentPath` as props from the parent, which is the Server Component that already knows both. This avoids making Breadcrumbs a client component unnecessarily.

Final target: pass `locale` and `currentPath` as props; component stays a Server Component.

```ts
// components/breadcrumbs.tsx
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;          // new
  currentPath: string;     // new (path without locale prefix, e.g. "/destinations/argentina")
}
```

And in `page-hero.tsx` (the caller) — thread through `locale` and `currentPath` from the page, OR expose a `breadcrumbExtras` prop. Simpler: have `PageHero` also take and pass through these props.

3. On every page that uses `<PageHero breadcrumbs=...>`, the caller must pass `locale` and `currentPath`. In practice there are N destination pages, services pages, etc. — all already have `locale` from `params`. Adding one more prop per caller is mechanical.

**Implementation scope (added to v3):** Breadcrumbs component (+~8 LOC), PageHero prop plumbing (+~4 LOC), Argentina page call (+2 LOC). Total ~14 LOC + review of all N callers.

**Rationale:** Deleting the page-level block without fixing the component would ship a BreadcrumbList with English URLs on a Spanish page. Verified by tracing component output (V6) against the page's passed props (V7). Single source of truth, locale-correct.

**Verified:** V6, V7 above.

**Acceptance:**
- Google Rich Results Test on preview URL shows exactly one `BreadcrumbList`.
- All three items have URLs beginning with `https://meridianexport.com/es/`.
- Terminal item (Argentina) has an `item` URL, not just a name.
- Every other page that uses `<PageHero breadcrumbs=...>` still renders a valid BreadcrumbList after the prop change (spot-check at least `/about`, `/services`, `/equipment/combines`).

### R-4. Introduce `formatCount(n, locale)` helper; set `inLanguage: "es-AR"` on JSON-LD

**Current state (verified):**
- `i18n/routing.ts:4` → `locales: ["en", "es", "ru"]`; `useLocale()` returns one of these three
- Node verification (V1): `toLocaleString("es")` → `"1000"` (no separator); `toLocaleString("es-AR")` → `"1.000"`; `toLocaleString("ru")` → `"1 000"` (non-breaking space, same as `ru-RU`); `toLocaleString("en")` → `"1,000"`
- `lib/i18n-utils.ts:5-9` already has `OG_LOCALES` mapping, same pattern applicable

**Target:** Add to `lib/i18n-utils.ts`:

```ts
const NUMBER_LOCALES: Record<string, string> = {
  en: "en-US",
  es: "es-AR",  // Meridian's Spanish-speaking buyers are predominantly Argentine; es-AR renders 1.000 (dot). es-419 would render 1,000 (comma) and "es" alone renders 1000 (no separator).
  ru: "ru-RU",
};

export function formatCount(n: number, locale: string): string {
  const tag = NUMBER_LOCALES[locale] ?? "en-US";
  return n.toLocaleString(tag);
}
```

Use it in:
- `components/trust-bar.tsx:32` — replace `count.toLocaleString("en-US")` with `formatCount(count, locale)` where `locale` is a new prop sourced from `useLocale()` at the `TrustBar` component level.
- `app/[locale]/destinations/argentina/page.tsx:562` — replace `STATS.projectsCompleted.toLocaleString("en-US")` with `formatCount(STATS.projectsCompleted, "es")` — hardcoded because this route is `generateStaticParams` `[{ locale: "es" }]`-only.
- `app/[locale]/destinations/argentina/page.tsx:96, 141` — `inLanguage: "es" → "es-AR"` on both WebPage and FAQPage JSON-LD blocks.

**Rationale:** Verified with V1 that `toLocaleString("es")` produces `"1000"`. The v2 plan of `count.toLocaleString(locale)` would have silently shipped numbers with no thousands separator for Spanish visitors. Helper centralizes the mapping so future locales behave predictably.

**Verified:** V1, V2, V3, V8.

**Acceptance:**
- New helper exists, unit test optional but recommended.
- Argentina page preview renders `1.000+` in the TrustBar and the credibility stat.
- Homepage (EN preview) still renders `1,000+`.
- RU preview renders `1 000+` (or the browser's `ru-RU` default).
- Rich Results Test confirms `"inLanguage": "es-AR"` on both WebPage and FAQPage JSON-LD.
- `npm run type-check` passes.

### R-5. Drop the misaligned keyword

**Current** (`content/argentina-market.ts:106-115`, line 112 verified):

```ts
keywords: [
  "importar maquinaria agrícola usada desde estados unidos a argentina",
  "comprar cosechadora usada en estados unidos desde argentina",
  "importar tractor usado desde usa a argentina",
  "enviar maquinaria agrícola a zárate",
  "maquinaria usada eeuu argentina",
  "precio final maquinaria en argentina desde usa",  // ← line 112
  "despachante maquinaria agrícola argentina",
  "puesta en puerto zárate maquinaria",
],
```

**Target:** delete line 112. FAQ answer at lines 333-337 stays unchanged.

**Rationale:** The page explicitly refuses to quote a "precio final en Argentina" (hero scopeFootnote:146, includedVsExcluded.note:198-199, FAQ:334-336). Targeting a query you refuse to satisfy invites bounce traffic. Removing the target keyword does not block Google from ranking us when the query aligns with existing content.

**Verified:** All referenced anti-claim language confirmed in file.

**Acceptance:** `grep -n "precio final maquinaria en argentina desde usa" content/argentina-market.ts` returns 0 hits.

### R-6. Sharpen SENASA / AFIDI with source-accurate language

**Current** (`content/argentina-market.ts:161-163`):

```ts
unchanged: [
  "AFIDI y controles fitosanitarios de SENASA siguen siendo relevantes para maquinaria agrícola usada.",
  "Limpieza, ausencia de tierra o restos vegetales y documentación prolija siguen siendo críticas.",
  "El costo final depende además de NCM, despachante, tributos, gastos portuarios y transporte interior en Argentina.",
],
```

**Target** — replace bullets at lines 161 and 162; line 163 unchanged:

```ts
unchanged: [
  "AFIDI (Autorización Fitosanitaria de Importación, emitida por SENASA) sigue siendo obligatoria para maquinaria agrícola usada, y debe gestionarse por SIGPV-IMPO antes de cualquier transacción comercial.",
  "En puerto, SENASA hace revisión documental e inspección física: exige equipos limpios, libres de suelo y restos vegetales, con tratamientos fitosanitarios cuando corresponda.",
  "El costo final depende además de NCM, despachante, tributos, gastos portuarios y transporte interior en Argentina.",
],
```

**Rationale:** Phrases lifted verbatim from the SENASA control page (verified V9): "SIGPV-IMPO … previo a cualquier transacción comercial", "revisión documental e inspección física", "equipos limpios, libres de suelo y restos vegetales", "tratamientos fitosanitarios". Strengthens E-E-A-T, signals specific expertise to a despachante reader.

**Verified:** V9.

**Acceptance:**
- `grep -nE "SIGPV-IMPO|revisión documental|libres de suelo" content/argentina-market.ts` returns ≥ 3 hits.
- No factual drift from the official SENASA page.
- Founder (or an Argentine despachante) reviews the sharpened wording before merge (see open questions §8).

---

## 5. Sources of truth

- **Decreto 273/2025:** https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto (Article 5 — MALVINA DDJJ)
- **SENASA control page:** https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de (SIGPV-IMPO, inspection process)
- **AFIDI service page:** https://www.argentina.gob.ar/servicio/solicitar-autorizacion-fitosanitaria-de-importacion-afidi-y-evaluacion-de-importaciones
- **Repo conventions:** `AGENTS.md:439-519` (Codex SOP), `package.json:5-13` (scripts incl. `type-check`)

---

## 6. Risks & mitigations (narrowed, verified)

| Risk | Verified? | Mitigation |
|---|---|---|
| R-1: overgeneralizes — not every NCM requires DDJJ at dispatch time | Source text from V10 confirms standard flow; edge NCMs exist | Phrase: "que arma su despachante al momento del despacho" defers specifics to the professional. Optional despachante review before ship. |
| R-3: prop-plumbing change breaks another caller of `<Breadcrumbs>` or `<PageHero>` | Not yet verified — implementer must grep all callers before PR | PR 2 adds a mandatory caller audit: `grep -rn "<Breadcrumbs" app/ components/` and `grep -rn "<PageHero" app/ components/` must all receive the new props or the component stays source-compatible. `npm run type-check` catches missing required props. |
| R-4: `formatCount` helper drift if a future locale is added | `NUMBER_LOCALES` fallback to `en-US` via `?? "en-US"` catches unknown locales safely | Type `locale` as `string` (loose) or as the union from `i18n/routing.ts` (strict). Prefer strict after verifying no upstream callers break. |
| R-6: wording deviates from SENASA page if the source page is updated | Source fetched 2026-04-21; low drift in 2 weeks | Re-fetch source as a pre-merge step if PR waits more than 30 days |
| Line drift between spec writing and PR execution | Line numbers recorded at 2026-04-21 | PR description must include a line-sanity check: `grep -n <phrase>` each target before editing; minor drift is fine since changes are keyed on strings not numbers |

---

## 7. Approval checklist

- [ ] Founder reviews and signs off on R-1 replacement copy (MALVINA bullet + new FAQ entry).
- [ ] Founder approves R-2 three rewrites.
- [ ] Founder confirms R-3 expanded scope (make Breadcrumbs locale-aware) is accepted as the right fix.
- [ ] Founder approves R-4 `formatCount` helper design AND the `es → es-AR` mapping (vs alternative `es → es-419`).
- [ ] Founder approves R-5 keyword drop.
- [ ] Founder (and/or despachante) reviews R-6 sharpened SENASA/AFIDI copy.

Sub-decisions (D-1 through D-5) are already owned in §8; if any needs to change, founder mentions it at the time of approval. Once approval gate passes, execution proceeds per `docs/plans/2026-04-21-argentina-page-audit-remediation-plan.md` (v3).

---

## 8. Decisions made

Each sub-decision is owned with rationale below. The user's role is override-by-exception: mention any you disagree with before execution and I'll change that one.

| # | Decision | Rationale | Alternatives considered |
|---|---|---|---|
| D-1 | R-1 uses "al momento de la oficialización del despacho" | *Oficialización* is the specific technical moment a SIM declaration is formalized via MALVINA in Argentine customs practice. More precise than the broader "despacho de importación" and signals correct technical vocabulary to a despachante reader — small but real E-E-A-T signal. | "al momento del despacho de importación" (looser, less precise) |
| D-2 | R-3 threads `locale` + `currentPath` as props from parent (Option A) | `<Breadcrumbs>` stays a Server Component — less client JS, faster hydration, aligned with React 19 RSC idioms. Every `<PageHero>` caller already has `locale` from `params`. `npm run type-check` enforces caller updates. | Option B (make Breadcrumbs `"use client"` and call `useLocale()` internally) — regresses rendering model unnecessarily |
| D-3 | R-4 maps `es → "es-AR"` in `formatCount` | Meridian's Spanish-language leads are predominantly Argentine (project context). Argentina destination page is Argentina-targeted. `es-AR` renders `1.000` (dot) matching Argentine convention; `es-419` renders `1,000` (comma) which is less distinctive and coincidentally matches US formatting. | `es → "es-419"` (Latin America generic) — revisit if Meridian expands significantly into Mexican/Colombian markets |
| D-4 | R-6 ships without mandatory despachante review | Copy is quoted verbatim from the official SENASA control page on argentina.gob.ar (verification V9). R-1 copy defers substantive claims to the despachante ("que arma su despachante"). Regulatory-drift risk in a 2-4 week window is near zero. Founder can invoke a review if they want; absence = ship. | Block on despachante review (rejected as default — no specific risk identified, shifts work to founder's relationships without clear benefit) |
| D-5 | Stage PR 1 first; PR 2 ~24h later | PR 1 is low-risk (pure content, one file). PR 2 is higher-risk (shared-component refactor, prop-threading across every `<PageHero>` caller). 24h bake on PR 1 in production verifies content cleanly before structural change. Bisect target stays clean if later regression appears. | Ship both in one session — saves 24h at the cost of muddied rollback granularity |

If any of D-1 through D-5 needs to change, say so before I start PR 1 and I'll revise the spec.
