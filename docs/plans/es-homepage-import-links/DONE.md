# DONE — `/es` homepage "Importación por país" links block (A2 W1a / §3a items 1–5)

**Goal:** Inject contextual, crawlable in-body links from the **indexed** `/es` homepage down to the 5 orphaned country "money" pages, so Google crawls them (the #1 indexation lever in the SEO audit). Source spec: `mf-claude-ads/campaigns/seo-organic/A2-internal-link-architecture.md` §3a.

**Scope (this PR):** the `/es` homepage block only. Blog→money in-body links (§3b) and the Brazil-post related block (§3a #6) are a separate follow-up (they live in `content/import-guide-enhancements.ts`).

## Acceptance checklist (each verified by a fresh agent against the running build / rendered HTML)

1. **Block renders on the `/es` homepage** — a new "Importación por país" section appears in the page body (inside `<main>`, not nav/footer). *Verify: render `/es` (built output or live) and find the section heading.*
2. **5 money-page links present, correct hrefs** — links to `/es/destinations/{paraguay,argentina,uruguay,bolivia,chile}/importacion-maquinaria-usa`. *Verify: 5 `<a href>` in SSR HTML matching exactly those paths.*
3. **Crawlable SSR `<a href>`** — links are real anchors in server-rendered HTML (no JS-only/onClick nav). *Verify: `curl`/built HTML shows `<a href="/es/destinations/...">` without executing JS.*
4. **Varied ES anchor text per A2 §3a** (not 5 identical anchors) — e.g. "importar maquinaria agrícola a Paraguay", "importar maquinaria usada a Argentina", "importar maquinaria agrícola a Uruguay", "importación de maquinaria pesada a Bolivia", "importar maquinaria agrícola a Chile". *Verify: anchor texts match and differ.*
5. **ES-only** — the block does NOT render on the EN (`/`) or RU (`/ru`) homepage (money pages are ES-only; guardrail §5.5 = same-language links only). *Verify: `/` and `/ru` HTML contain none of the 5 money-page links from this block.*
6. **In-body / contextual, not a nav or footer boilerplate block** — placed within a homepage content section with surrounding context, `dofollow`. *Verify: the section is in page body, links are not `nofollow`.*
7. **No regressions** — `npm run lint` clean (0/0) and `npm run build` succeeds (type-check passes). *Verify: run both.*

## Decisions made (reversible)
- Render the block only for `locale === "es"` (EN/RU have no money pages; cross-language body links are barred by the spec).
- Use next-intl `Link` (renders crawlable `<a>`, locale-aware) rather than a raw `<a>`.
- Anchor copy taken verbatim from A2 §3a ES column.
