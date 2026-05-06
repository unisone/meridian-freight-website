---
phase: 260505-pal
plan: 01
subsystem: latam-destinations
tags: [tracking, seo, hreflang, analytics, content]
dependencies:
  requires: []
  provides: [latam-tracking-split, latam-hreflang]
  affects: [content/latam-market-pages.ts, components/destinations/latam-market-page.tsx, "app/[locale]/destinations/[slug]/page.tsx"]
tech-stack:
  added: []
  patterns: [tracking-event-naming, hreflang-alternates]
key-files:
  modified:
    - content/latam-market-pages.ts
    - components/destinations/latam-market-page.tsx
    - "app/[locale]/destinations/[slug]/page.tsx"
decisions:
  - "equipmentLink + resourceLink names describe click surface, not page location — avoids the misleading projectLibrary name"
  - "hreflang rendered as hrefLang (camelCase) in Next.js App Router HTML — correct browser behavior, plan grep pattern was case-sensitive against RSC output"
metrics:
  duration: ~20min
  completed: 2026-05-05T22:20:20Z
  tasks: 3/3
  files: 3
---

# Phase 260505-pal Plan 01: Tracking Event Renames + Hreflang Alternates Summary

**One-liner:** Split `projectLibrary` into `equipmentLink`/`resourceLink`, removed dead mid-CTA tracking keys, and added `en`+`x-default` hreflang to all three LatAm Spanish hubs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Split tracking keys + remove dead config | f62c5dc | content/latam-market-pages.ts |
| 2 | Wire renderer to new tracking keys | f622ece | components/destinations/latam-market-page.tsx |
| 3 | Add en + x-default hreflang alternates | 0d89037 | app/[locale]/destinations/[slug]/page.tsx |

## Changes Made

### Task 1 — content/latam-market-pages.ts

**Type contract updated (lines 115-123):**
- Removed: `midWhatsapp: string`, `midCalculator: string`, `projectLibrary: string`
- Added: `equipmentLink: string`, `resourceLink: string`

**Three country entries updated:**
- paraguay: `equipmentLink: "paraguay_equipment_link"`, `resourceLink: "paraguay_resource_link"`
- uruguay: `equipmentLink: "uruguay_equipment_link"`, `resourceLink: "uruguay_resource_link"`
- bolivia: `equipmentLink: "bolivia_equipment_link"`, `resourceLink: "bolivia_resource_link"`

### Task 2 — components/destinations/latam-market-page.tsx

Exactly two line changes:
- Line 423: `location={content.tracking.projectLibrary}` → `location={content.tracking.equipmentLink}` (equipmentFocus card map inside `items.map()`)
- Line 509: `location={content.tracking.projectLibrary}` → `location={content.tracking.resourceLink}` (LinkGrid in credibility section)

### Task 3 — app/[locale]/destinations/[slug]/page.tsx

Extended `alternates.languages` in the LatAm metadata branch (line 113-116):
```typescript
languages: {
  es: canonical,
  en: `${SITE.url}/destinations/${slug}`,
  "x-default": `${SITE.url}/destinations/${slug}`,
},
```

## Verification Results

### Gates

| Check | Result |
|-------|--------|
| `npm run lint` | PASS (exit 0) |
| `npm test` | PASS (16 files / 144 tests) |
| `npm run build` | PASS (no TS errors, all static pages generated) |

### Rendered HTML Per Hub

| Slug | eq | rl | mw | mc | pl | en | xd | hero_wa | hero_calc | final_wa | final_calc |
|------|----|----|----|----|----|----|-----|---------|-----------|----------|------------|
| paraguay | 4 | 4 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| uruguay | 4 | 4 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| bolivia | 4 | 4 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 |

All three hubs: PASS.

**Legend:** eq=equipment_link count, rl=resource_link count, mw=mid_whatsapp (dead key), mc=mid_calculator (dead key), pl=project_library (dead key), en=hreflang en count, xd=hreflang x-default count

## Deviations from Plan

### Note: hreflang case

The plan's rendered-HTML verification command grepped for lowercase `hreflang="en"` and `hreflang="x-default"`. Next.js App Router renders these as `hrefLang="en"` (camelCase) in the static HTML file. The RSC payload (`.rsc`) contains the correct lowercase form. Verified via Python with case-insensitive matching — all three tags are present and correct. The plan's verification grep would have required `-i` flag or `hrefLang` to match. This is a plan grep error, not a code issue.

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes.

## Self-Check: PASSED

- content/latam-market-pages.ts — modified (verified)
- components/destinations/latam-market-page.tsx — modified (verified)
- app/[locale]/destinations/[slug]/page.tsx — modified (verified)
- Commits: f62c5dc, f622ece, 0d89037 — all present in git log
