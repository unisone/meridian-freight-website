# Argentina Page — Phase 1 Remediation Implementation Plan

**Date:** 2026-04-21
**Status:** Draft v3 — Implementation-ready — Awaits spec approval
**Author:** AI-drafted (Claude Code), Codex-SOP normalized per `AGENTS.md:439-519`
**Spec:** [`docs/specs/2026-04-21-argentina-page-audit-remediation-spec.md`](../specs/2026-04-21-argentina-page-audit-remediation-spec.md) (v3)

## Revision history

- **v1 (superseded):** 6 PRs across 3 phases. Too broad.
- **v2 (superseded):** 2 PRs. Branch conventions right; missing `npm run type-check`, author tag wrong, `R-3`/`R-4` unverified.
- **v3 (this):** 2 PRs still, but PR 2 expands to cover the Breadcrumbs locale-aware change and the `formatCount` helper. QA adds `npm run type-check` per `package.json:9`. Author/SOP normalized to `AGENTS.md`.

---

## 1. Summary

| PR | Scope | Files | Est. |
|---|---|---|---|
| **PR 1 — Content truth** (R-1, R-2, R-5, R-6) | MALVINA/SIM language, slop removal, misaligned keyword, SENASA/AFIDI sharpening | `content/argentina-market.ts` only | 0.5 day |
| **PR 2 — Schema + locale correctness** (R-3, R-4) | Add `formatCount` helper; make `<Breadcrumbs>` locale-aware (prop-plumbing); delete page-level breadcrumb JSON-LD; set `inLanguage: "es-AR"`; use helper in TrustBar + page stat | `lib/i18n-utils.ts`, `components/breadcrumbs.tsx`, `components/page-hero.tsx`, `app/[locale]/destinations/argentina/page.tsx`, `components/trust-bar.tsx`, plus caller audit for any other `<Breadcrumbs>` or `<PageHero>` consumer | 1 day |

Total: ~1.5 engineering days. No new env vars, no migrations, no dependencies.

PRs merge sequentially (PR 2 after PR 1), with production verification between.

---

## 2. PR 1 — Content truth

**Branch:** `feat/argentina-content-truth`
**Base:** `main`
**Sources:** Spec §R-1, §R-2, §R-5, §R-6.

### 2a. Files touched

`content/argentina-market.ts` (only).

### 2b. Change list

| Edit | File:line | Operation | Verified |
|---|---|---|---|
| R-5: Remove misaligned keyword | `content/argentina-market.ts:112` | Delete line | Spec V-table; `grep -n "precio final maquinaria"` returns 1 hit today |
| R-1 bullet: MALVINA/SIM | `content/argentina-market.ts:154-158` (`marketChange.changed` array) | Insert new element at index 1 | Spec V10 + line read |
| R-6 bullet 1: AFIDI/SIGPV-IMPO | `content/argentina-market.ts:161` | Replace string | Spec V9 + line read |
| R-6 bullet 2: SENASA inspection | `content/argentina-market.ts:162` | Replace string | Spec V9 + line read |
| R-2: slop #1 | `content/argentina-market.ts:290` (`credibility.intro`) | Replace string | Line read |
| R-2: slop #2 | `content/argentina-market.ts:310` (`credibility.note`) | Replace string | Line read |
| R-1 FAQ: MALVINA Q/A | `content/argentina-market.ts:357-362` → insert before | Insert new FAQ entry at index 6 | Line read (last FAQ entry) |
| R-2: slop #3 | `content/argentina-market.ts:388` (proofLinks `/projects` description) | Replace string | Line read |

All exact replacement text blocks are quoted verbatim in the spec §R-1 through §R-6. The implementer copies them directly; no wordsmithing during execution.

### 2c. Non-changes

- Meta title, meta description, canonical, OG config: untouched.
- Hero, scope card, equipment cards, process steps, proof links (except R-2 #3), CTA copy, all FAQ answers other than the new one: untouched.
- No component/styling/schema changes in this PR.

### 2d. Commit

```
feat(argentina): MALVINA/SIM + SENASA sharpening, remove slop

- Add MALVINA Declaración Jurada clarification to
  marketChange.changed (new bullet index 1) + dedicated FAQ
  entry "¿Meridian gestiona la Declaración Jurada en MALVINA?".
- Sharpen AFIDI/SENASA language in marketChange.unchanged to
  match argentina.gob.ar wording verbatim (SIGPV-IMPO,
  revisión documental e inspección física, equipos limpios,
  tratamientos fitosanitarios).
- Remove three editorial/internal leaks from customer copy
  (credibility intro, credibility note, proofLinks projects).
- Drop the "precio final maquinaria en argentina desde usa"
  keyword — page refuses to answer; FAQ handling unchanged.

Sources: Decreto 273/2025 Article 5; SENASA used-machinery
control page on argentina.gob.ar.

Spec: docs/specs/2026-04-21-argentina-page-audit-remediation-spec.md
```

### 2e. Pre-merge verification (per AGENTS.md SOP)

**Local:**
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes (**added in v3 — verified `package.json:9`**)
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] Grep acceptance: slop phrases gone — `grep -nE "prueba artificial|inflar prueba|curar de forma explícita|narrativa Argentina" content/argentina-market.ts` → 0
- [ ] Grep acceptance: MALVINA present ≥ 3 times — `grep -nE "MALVINA|Malvina" content/argentina-market.ts` → ≥ 3
- [ ] Grep acceptance: SENASA sharpening — `grep -nE "SIGPV-IMPO|revisión documental|libres de suelo" content/argentina-market.ts` → ≥ 3
- [ ] Grep acceptance: keyword gone — `grep -n "precio final maquinaria en argentina desde usa" content/argentina-market.ts` → 0

**Preview (per AGENTS.md:459-465 Phase 2):**
- [ ] `git push origin feat/argentina-content-truth` + wait ~60s
- [ ] `vercel ls | grep argentina-content-truth` → preview URL
- [ ] Navigate preview URL in browser; check console for errors
- [ ] Screenshot the "Marco regulatorio" card — confirm new MALVINA bullet and sharpened SENASA bullets render
- [ ] Click the MALVINA FAQ entry — confirm accordion expands with new answer
- [ ] View-source the preview — confirm FAQPage JSON-LD includes the new Q/A

**Present (Phase 3):**
- [ ] `gh pr create --base main --fill`
- [ ] Present: preview URL + screenshots + verification checklist + copy diff
- [ ] Founder sign-off on copy

**Ship (Phase 4):**
- [ ] `gh pr merge --squash --delete-branch`
- [ ] Wait ~60s, navigate `https://meridianexport.com/es/destinations/argentina`
- [ ] Confirm MALVINA + sharpened SENASA visible in prod
- [ ] Report "Shipped to production. Verified at <URL>."

### 2f. Rollback

`git revert <sha>` + push. Pure content change; no data, state, schema, or config to unwind.

---

## 3. PR 2 — Schema + locale correctness

**Branch:** `feat/argentina-schema-locale`
**Base:** `main` (after PR 1 merges and is verified)
**Sources:** Spec §R-3, §R-4.

### 3a. Files touched

| File | Change type |
|---|---|
| `lib/i18n-utils.ts` | Add `formatCount` helper + `NUMBER_LOCALES` map |
| `components/breadcrumbs.tsx` | Accept `locale` + `currentPath` props; prefix JSON-LD URLs; always emit terminal URL |
| `components/page-hero.tsx` | Add `locale` + `currentPath` props; pass through to `<Breadcrumbs>` |
| `app/[locale]/destinations/argentina/page.tsx` | Delete `breadcrumbJsonLd` const + its `<script>`; set `inLanguage: "es-AR"`; use `formatCount`; pass `locale` + `currentPath` to PageHero |
| `components/trust-bar.tsx` | Add `locale` prop (via `useLocale()`); use `formatCount` |
| **All other callers of `<PageHero breadcrumbs=...>`** | Thread `locale` + `currentPath` from params |

### 3b. Caller audit — MANDATORY before editing

Before touching `page-hero.tsx` or `breadcrumbs.tsx`:

```bash
# Find every consumer of PageHero that passes breadcrumbs (required prop)
grep -rn "<PageHero" app/ components/ --include="*.tsx"

# Find every consumer of Breadcrumbs directly (if any)
grep -rn "<Breadcrumbs" app/ components/ --include="*.tsx"
```

Record the list in the PR description. Every caller gets the new `locale` + `currentPath` props. `npm run type-check` catches any caller that misses the change.

### 3c. Implementation details

**Step 1 — Add helper (`lib/i18n-utils.ts`):**

Insert after the existing `OG_LOCALES` block:

```ts
/**
 * Locale tags used for number formatting via Intl.NumberFormat.
 * Verified with Node v22.22 (ICU enabled):
 *   (1000).toLocaleString("es")    → "1000"   ← NO separator
 *   (1000).toLocaleString("es-AR") → "1.000"  ← Argentine
 *   (1000).toLocaleString("es-419")→ "1,000"  ← LatAm generic
 * Meridian's Spanish-language leads are predominantly Argentine;
 * "es-AR" is the correct tag for this audience.
 */
const NUMBER_LOCALES: Record<string, string> = {
  en: "en-US",
  es: "es-AR",
  ru: "ru-RU",
};

export function formatCount(n: number, locale: string): string {
  const tag = NUMBER_LOCALES[locale] ?? "en-US";
  return n.toLocaleString(tag);
}
```

**Step 2 — Update `components/breadcrumbs.tsx`:**

```ts
// Before (components/breadcrumbs.tsx:11-13):
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// After:
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;
  currentPath: string;  // path without locale prefix, e.g. "/destinations/argentina"
}
```

And rework the `jsonLd` construction:

```ts
const localePrefix = locale === "en" ? "" : `/${locale}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: t("home"),
      item: `${SITE.url}${localePrefix}`,
    },
    ...items.map((item, i) => {
      const isLast = i === items.length - 1;
      const href = item.href ?? (isLast ? currentPath : undefined);
      return {
        "@type": "ListItem" as const,
        position: i + 2,
        name: item.label,
        ...(href ? { item: `${SITE.url}${localePrefix}${href}` } : {}),
      };
    }),
  ],
};
```

**Step 3 — Update `components/page-hero.tsx`:**

Add two optional-but-recommended props, then forward to `<Breadcrumbs>`:

```ts
interface PageHeroProps {
  // ... existing props
  locale: string;
  currentPath: string;
}

// In JSX:
<Breadcrumbs items={breadcrumbs} locale={locale} currentPath={currentPath} />
```

Because every page already has `locale` from the `[locale]` segment and either computes or knows its current path, threading is mechanical.

**Step 4 — Update Argentina page (`app/[locale]/destinations/argentina/page.tsx`):**

- Delete `breadcrumbJsonLd` const → remove lines **113-136** (const literal closes on line 136, verified).
- Delete its `<script>` block → remove lines **158-161**.
- Change `inLanguage: "es"` → `"es-AR"` at line 96 (WebPage) and line 141 (FAQPage).
- Replace `STATS.projectsCompleted.toLocaleString("en-US")` at line 562 with `formatCount(STATS.projectsCompleted, "es")`.
- Pass `locale="es"` and `currentPath="/destinations/argentina"` (or the already-available `ARGENTINA_PATH`) to `<PageHero>`.

**Step 5 — Update `components/trust-bar.tsx`:**

- Import: `import { useLocale } from "next-intl";` and `import { formatCount } from "@/lib/i18n-utils";`
- Inside `TrustBar`: `const locale = useLocale();`
- Pass `locale` down to `StatItem`.
- Replace line 32: `{count.toLocaleString("en-US")}{item.suffix}` → `{formatCount(count, locale)}{item.suffix}`.

**Step 6 — Propagate props across all other `<PageHero>` callers identified in 3b.**

This is mechanical: add `locale={locale}` and `currentPath={...}` to each call site. `npm run type-check` catches any that are missed.

### 3d. Commit

```
fix(i18n): locale-aware BreadcrumbList + formatCount helper

- Add formatCount(n, locale) helper in lib/i18n-utils.ts with
  Argentine-Spanish mapping (es → es-AR) because
  toLocaleString("es") returns "1000" without a separator (verified
  with Node v22.22 + ICU).
- Make <Breadcrumbs> locale-aware: accept locale + currentPath
  props, prefix SITE.url with /${locale} (non-"en"), and always
  emit a terminal item URL.
- Thread locale + currentPath through <PageHero>.
- Remove duplicate BreadcrumbList JSON-LD from the Argentina page
  (component now emits correct URLs).
- inLanguage: "es" → "es-AR" on WebPage and FAQPage JSON-LD on
  the Argentina page.
- Use formatCount in TrustBar and the Argentina credibility stat
  card.
- Touch every <PageHero> caller to pass the new props (type-check
  enforces).

Verified: Rich Results Test (1 BreadcrumbList on preview), visual
"1.000+" on /es pages, "1,000+" on /en pages.

Spec: docs/specs/2026-04-21-argentina-page-audit-remediation-spec.md
```

### 3e. Pre-merge verification

**Local:**
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes — this enforces that every `<PageHero>` / `<Breadcrumbs>` caller received the new required props
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] Grep: `grep -n "BreadcrumbList" app/\[locale\]/destinations/argentina/page.tsx` → 0 hits
- [ ] Grep: `grep -n "breadcrumbJsonLd" app/\[locale\]/destinations/argentina/page.tsx` → 0 hits
- [ ] Grep: `grep -n 'inLanguage: "es"' app/\[locale\]/destinations/argentina/page.tsx` → 0 hits (both should now be `"es-AR"`)
- [ ] Grep: `grep -rn 'toLocaleString."en-US"' components/ app/` — inspect remaining usages; should not appear in TrustBar or Argentina stat card; other usages may be intentional

**Preview:**
- [ ] Navigate preview URL → check console for errors
- [ ] Scroll to TrustBar → confirm `1.000+` (dot separator) on `/es/destinations/argentina`
- [ ] Scroll to credibility block → confirm `1.000+` in the stat card
- [ ] Navigate `/about` (English) → confirm `1,000+` (comma) — NO regression
- [ ] Navigate `/ru/about` if it exists → confirm `1 000+` (NBSP) — NO regression
- [ ] View source of `/es/destinations/argentina` preview → confirm exactly ONE `"@type":"BreadcrumbList"` JSON-LD block
- [ ] View source → confirm BreadcrumbList `item` URLs all start with `https://meridianexport.com/es/`
- [ ] View source → confirm the terminal (Argentina) item has an `item` URL, not just a name
- [ ] View source → confirm `inLanguage:"es-AR"` on both WebPage and FAQPage JSON-LD
- [ ] Google Rich Results Test (https://search.google.com/test/rich-results) on preview URL → 1 BreadcrumbList detected, 0 errors
- [ ] Spot-check at least one OTHER page that uses `<PageHero>` (e.g. `/about`, `/equipment/combines`) → breadcrumbs render with locale-correct URLs

**Present:**
- [ ] Preview URL + before/after screenshots of BreadcrumbList JSON-LD + TrustBar visual
- [ ] Rich Results Test screenshot
- [ ] Founder sign-off

**Ship:**
- [ ] `gh pr merge --squash --delete-branch`
- [ ] Wait ~60s; verify production URL; confirm "1.000+" in prod TrustBar and single BreadcrumbList

### 3f. Rollback

`git revert <sha>`. TrustBar/Breadcrumbs changes are backwards-compatible at the JSX-output level (breadcrumb still renders; numbers still format). Reverting removes the locale-awareness without breaking any page.

---

## 4. Sequencing

Per AGENTS.md:439-519 (Codex SOP):

```
PR 1 develop → lint + type-check + test + build → commit
PR 1 push → wait 60s → preview URL → browser verify
PR 1 PR open → present to founder → founder signs off
PR 1 merge --squash → wait 60s → prod verify

[Gate: PR 1 must be in prod and verified before starting PR 2 —
       PR 2's correctness depends on knowing PR 1's copy is live,
       and also avoids merge conflicts in argentina-market.ts]

PR 2 develop → caller audit grep → implement → lint + type-check + test + build → commit
PR 2 push → preview → Rich Results Test → browser verify
PR 2 PR open → present with preview + screenshots → founder signs off
PR 2 merge --squash → prod verify (view source, Rich Results Test)
```

PRs do NOT ship in parallel because PR 2 edits files that PR 1 does not, but merge order matters to keep the feature flag of "correct Spanish copy ships first, structural fixes follow" rather than inverting.

---

## 5. QA Matrix

| Gate | PR 1 | PR 2 | Source |
|---|---|---|---|
| `npm run lint` | ✓ | ✓ | `package.json:10` |
| `npm run type-check` | ✓ | ✓ | `package.json:9` (added in v3) |
| `npm run build` | ✓ | ✓ | `package.json:7` |
| `npm test` | ✓ | ✓ | `package.json:11` |
| Preview URL 200 OK | ✓ | ✓ | AGENTS.md Phase 2 |
| No console errors on preview | ✓ | ✓ | AGENTS.md Phase 2 |
| Grep acceptance checks | ✓ | ✓ | Per PR |
| Rich Results Test — 1 BreadcrumbList, 0 errors | — | ✓ | Google Rich Results Test |
| View source: `inLanguage:"es-AR"` | — | ✓ | Browser view-source |
| Visual: `1.000+` on Spanish pages | — | ✓ | Manual preview |
| Visual: `1,000+` on English pages (no regression) | — | ✓ | Manual preview |
| Spot-check other `<PageHero>` callers | — | ✓ | Browser navigation to 2-3 pages |
| Founder copy sign-off | ✓ | — | PR review |
| Production verify | ✓ | ✓ | AGENTS.md Phase 4 |

---

## 6. Post-deploy monitoring

Scoped and time-bounded (not speculative):

**48 hours:**
- Sentry: no new client-side errors originating on `/es/destinations/argentina`, `/about`, or any page touched by PR 2.
- Vercel Runtime Logs: no new error classes.

**14 days:**
- Search Console URL Inspection on `/es/destinations/argentina` → both JSON-LD types (WebPage + FAQPage + BreadcrumbList via component) detected cleanly.
- Search Console: no impression drop on queries currently ranking (baseline the week before deploy).

No new dashboards. No new CRO experiments. No A/B tests.

---

## 7. Out of scope

Every item in §1 "Out of scope" of the v3 spec stays out of this plan. No silent scope creep on this branch. Each deferred item remains a candidate for its own narrower spec.

---

## 8. Acceptance (full Phase 1 remediation)

- [ ] PR 1 merged to `main`, production verified for MALVINA + SENASA sharpening + slop removed + keyword dropped.
- [ ] PR 2 merged to `main`, production verified for single BreadcrumbList (locale-correct URLs) + `es-AR` inLanguage + `1.000+` rendering on Spanish pages + no regression on English/Russian.
- [ ] `npm run type-check` passes on `main` after both merges.
- [ ] Sentry shows no new error classes for 48h post-deploy.
- [ ] Search Console URL Inspection clean after index refresh (~7-14 days).
- [ ] Spec + plan pair archived in `docs/` with status `Completed`.
