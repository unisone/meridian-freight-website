# Inline quote form on LATAM destination country pages

**Date:** 2026-06-24
**Status:** Implemented
**Author:** Claude (operator-delegated decision; strategic frame set by Alex Zaytsev)

## Problem

Site lead capture is a deliberate, WhatsApp-first funnel: an inline quote form appears
on high-intent/conversion-critical pages (homepage, `/contact`, `/equipment/*`, and the
paid-search ad landing pages `/destinations/<country>/<segment>`), while informational
pages use WhatsApp + a "Contact" link. That is intentional — **not** a bug.

The one genuine gap: the **plain destination country pages** (`/destinations/<country>`,
rendered by `LatamMarketPage`) target high-intent **organic** queries ("ship machinery to
Paraguay") for the 6 priority LATAM markets, yet offer only WhatsApp / contact-link CTAs —
a worse conversion path than their *paid* twins, which already have a full form. Organic
visitors not ready to open WhatsApp can leak.

## Decision

Add the **existing standard `ContactForm`** as a **secondary** "Solicite su cotización a
{country}" section on the LATAM country pages, **keeping WhatsApp the primary CTA**
(unchanged in the hero and the final `DarkCta`).

Scope: the 6 LATAM country pages via `LatamMarketPage` (Paraguay, Brazil, Chile, Bolivia,
Uruguay, Argentina). Kazakhstan (`KazakhstanMarketPage`) and the paid-search landing
variants are untouched.

### Approaches considered

- **A — Reuse the standard `ContactForm` (chosen).** Smallest change, consistent UX,
  reuses the verified `submitContactForm` pipeline (Supabase `leads` + owner email +
  visitor auto-reply + Slack + Meta CAPI), already localized.
- **B — Adapt the richer paid-search form.** Rejected: more friction, Spanish-only, and it
  writes `source="paid_search"` → would misattribute organic leads as paid.
- **C — New lightweight mini-form.** Rejected: a third form variant to build and maintain.

## Architecture notes (from adversarial review of the real code)

- `LatamMarketPage` is a **Server Component**, **Spanish-only** (route guard `locale === "es"`);
  its copy comes from the `latamMarketPages` content array, **not** next-intl.
- Embedding the `"use client"` `ContactForm` as an island is safe (plain serializable props).
- `ContactForm` labels already come from next-intl (`ContactForm` namespace, full en/es/ru
  parity) — **no new message keys needed**.
- The section heading copy is universal (only the country name varies) and the page is
  Spanish-only, so the copy is composed **inline** in the component using `content.country`
  — avoids a required-field cascade across `sharedLabels` + the per-country inline `labels`
  objects, and avoids duplicating identical copy across 6 country objects.

## Implementation

Single file: `components/destinations/latam-market-page.tsx`
1. `import { ContactForm } from "@/components/contact-form";`
2. A module-level `QUOTE_SECTION` constant (Spanish eyebrow/title-prefix/intro).
3. A new `<section>` inserted **between the FAQ section and the final `DarkCta`**:
   - plain background (preserves the alternating `bg-muted` rhythm: muted FAQ → plain form → dark CTA),
   - `SectionIntro` (`<h2>`) titled `Solicite su cotización a {content.country}`,
   - `ContactForm` in a `border bg-muted/50` card (matching the file's existing card style),
   - placed *after* the WhatsApp-heavy content so it does not sit head-to-head with the hero CTA.

No change to JSON-LD (the existing WhatsApp `ContactAction` stays the primary `potentialAction`).

## Attribution

`ContactForm` sets `source_page = window.location.href` → stored as `corporate: <url>`, so
the **country is recoverable from the URL** and GA4 `generate_lead` fires with the page path.
No `gclid` for organic (expected). Per-country *structured* reporting would require an
optional `ContactForm` prop — deliberately **out of scope** (URL-level attribution suffices
for this gap-fill).

## Verification

- `npm run type-check` (tsc --noEmit) ✓
- `npx eslint` (changed file) ✓
- `npx vitest run` — 27 files / 219 tests ✓ (incl. spanish-copy + i18n parity)
- Local dev render check (Playwright): heading interpolates per country, form renders in
  Spanish with honeypot, correct placement (FAQ → form → DarkCta), WhatsApp CTAs preserved.
- Post-deploy: live render check on `meridianexport.com/es/destinations/<country>` + one real
  `[TEST]` submission confirmed in Supabase `leads` (source_page = destination URL), then deleted.

## Out of scope (deliberate)

Services pages, `/pricing`, a structured per-country lead field, the WhatsApp-first primacy,
and the separate E2E-tests-write-to-prod-`leads` hygiene issue (flagged separately).
