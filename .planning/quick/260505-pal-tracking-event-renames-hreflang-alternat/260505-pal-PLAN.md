---
phase: 260505-pal
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - content/latam-market-pages.ts
  - components/destinations/latam-market-page.tsx
  - app/[locale]/destinations/[slug]/page.tsx
autonomous: true
requirements:
  - P1-1
  - P1-2
  - P1-4

must_haves:
  truths:
    - "Equipment-card link clicks (4 per LatAm hub) fire a tracking event distinct from resource-grid clicks (4 per LatAm hub)."
    - "No tracking config keys exist for non-rendered mid-page CTAs in any LatAm hub."
    - "Each rendered LatAm Spanish hub head emits hreflang alternates for es, en, and x-default."
    - "Existing LatAm content tests still pass without modification."
  artifacts:
    - path: "content/latam-market-pages.ts"
      provides: "Updated tracking type + paraguay/uruguay/bolivia entries with split equipmentLink + resourceLink keys; midWhatsapp/midCalculator/projectLibrary removed."
      contains: "equipmentLink"
    - path: "components/destinations/latam-market-page.tsx"
      provides: "Renderer wires equipmentFocus card map to content.tracking.equipmentLink and LinkGrid invocation in credibility section to content.tracking.resourceLink."
    - path: "app/[locale]/destinations/[slug]/page.tsx"
      provides: "LatAm metadata branch sets alternates.languages.es, .en, and ['x-default'] to absolute URLs."
  key_links:
    - from: "components/destinations/latam-market-page.tsx (equipmentFocus card map @~line 421-425)"
      to: "content.tracking.equipmentLink"
      via: "TrackedCtaLink location prop"
      pattern: "location=\\{content\\.tracking\\.equipmentLink\\}"
    - from: "components/destinations/latam-market-page.tsx (LinkGrid in credibility @~line 507-510)"
      to: "content.tracking.resourceLink"
      via: "LinkGrid location prop"
      pattern: "location=\\{content\\.tracking\\.resourceLink\\}"
    - from: "app/[locale]/destinations/[slug]/page.tsx (latamMarketPage branch in generateMetadata)"
      to: "alternates.languages"
      via: "Metadata return"
      pattern: "languages: \\{[\\s\\S]*?\"x-default\""
---

<objective>
Three P1 fixes from the Paraguay QA audit, scoped narrowly so they land in the same PR before UY/BO copy rewrites:

1. Split the over-shared `projectLibrary` tracking key into `equipmentLink` (equipmentFocus card map) and `resourceLink` (credibility-section LinkGrid). Apply to all three LatAm hubs (paraguay/uruguay/bolivia).
2. Remove dead `midWhatsapp` and `midCalculator` tracking keys — the LatAm renderer has no mid-page CTA section, so these never fire. Delete from type and all three entries. (No mid-page section is added — out of scope.)
3. Add `en` and `x-default` hreflang alternates to the LatAm metadata branch so the Spanish hubs cross-link to the existing English destination pages.

No copy changes. No new sections. No new translations. Pure config + renderer wiring + metadata fields.

Purpose: Analytics can distinguish equipment-link clicks from resource-grid clicks; dead config no longer pollutes the type contract; Google can reconcile the Spanish LatAm hubs with their English counterparts.

Output: Updated content type + three country entries, two renderer wiring changes, expanded `alternates.languages` block in `[slug]/page.tsx`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md

<interfaces>
<!-- Key types and current structure. Executor uses these directly — no codebase exploration needed. -->

Current `tracking` type (content/latam-market-pages.ts:115-123):
```typescript
tracking: {
  heroWhatsapp: string;
  heroCalculator: string;
  midWhatsapp: string;        // REMOVE — never referenced in renderer
  midCalculator: string;      // REMOVE — never referenced in renderer
  finalWhatsapp: string;
  finalCalculator: string;
  projectLibrary: string;     // RENAME/SPLIT — used at two semantically different sites
};
```

Target `tracking` type:
```typescript
tracking: {
  heroWhatsapp: string;
  heroCalculator: string;
  finalWhatsapp: string;
  finalCalculator: string;
  equipmentLink: string;      // equipmentFocus card map
  resourceLink: string;       // LinkGrid in credibility section
};
```

Per-country event-name convention (mirrors existing `<country>_<location>` pattern):

| Country  | equipmentLink              | resourceLink              |
|----------|----------------------------|---------------------------|
| paraguay | `paraguay_equipment_link`  | `paraguay_resource_link`  |
| uruguay  | `uruguay_equipment_link`   | `uruguay_resource_link`   |
| bolivia  | `bolivia_equipment_link`   | `bolivia_resource_link`   |

Renderer wiring (components/destinations/latam-market-page.tsx):
- equipmentFocus card map at line ~423: `location={content.tracking.projectLibrary}` → `location={content.tracking.equipmentLink}`
- LinkGrid invocation in credibility section at line ~509: `location={content.tracking.projectLibrary}` → `location={content.tracking.resourceLink}`

Hreflang reference (app/[locale]/destinations/[slug]/page.tsx:103-139):
```typescript
const latamMarketPage = getLatamMarketPage(slug);
if (locale === "es" && latamMarketPage) {
  const canonical = `${SITE.url}${latamMarketPage.path}`;
  return {
    // ...
    alternates: {
      canonical,
      languages: {
        es: canonical,
        // MISSING: en + x-default
      },
    },
    // ...
  };
}
```

The English destination page (`getDestinationBySlug(slug, 'en')`) already exists for paraguay/uruguay/bolivia (verified via content/destinations.ts:358/378/418). The English [slug]/page.tsx flow does NOT need changes — `getGenericDestinationLanguageAlternates` at line 46 already correctly omits `es` for LatAm slugs (line 52-54), so no double-claim conflict.

Target hreflang block:
```typescript
alternates: {
  canonical,
  languages: {
    es: canonical,
    en: `${SITE.url}/destinations/${slug}`,
    "x-default": `${SITE.url}/destinations/${slug}`,
  },
},
```

Preserved test contract (content/__tests__/latam-market-pages.test.ts):
- The tests do not reference `tracking.*` directly — they use `flattenText()` over the entire page object, which concatenates all string values.
- Removing `paraguay_mid_whatsapp` etc. is safe — banned-pattern list does not include those tokens.
- Renaming `paraguay_project_library` → `paraguay_equipment_link` + `paraguay_resource_link` is safe — banned-pattern list does not match either.
- The internal-pattern `\bdealer\b` test (line 98) does not match these tokens.

Verification expectations (per <verification_constraints>):
- `.next/server/app/es/destinations/paraguay.html` after `npm run build`:
  - ≥4 occurrences of `paraguay_equipment_link` (one per equipmentFocus card)
  - ≥4 occurrences of `paraguay_resource_link` (one per LinkGrid item — note: paraguay has 4 resourceLinks)
  - 0 occurrences of `paraguay_mid_whatsapp`
  - 0 occurrences of `paraguay_mid_calculator`
  - 0 occurrences of `paraguay_project_library`
  - `<link rel="alternate" hreflang="en" href="https://meridianexport.com/destinations/paraguay"` in head
  - `<link rel="alternate" hreflang="x-default" href="https://meridianexport.com/destinations/paraguay"` in head
- Same shape for uruguay.html and bolivia.html with their respective slugs.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Split tracking keys + remove dead config in content data</name>
  <files>content/latam-market-pages.ts</files>
  <action>
Edit `content/latam-market-pages.ts`:

1. Update the `tracking` field type at lines 115-123. Final shape:
```typescript
tracking: {
  heroWhatsapp: string;
  heroCalculator: string;
  finalWhatsapp: string;
  finalCalculator: string;
  equipmentLink: string;
  resourceLink: string;
};
```
Remove `midWhatsapp`, `midCalculator`, `projectLibrary`. Add `equipmentLink`, `resourceLink`.

2. Update the `tracking` block in the paraguay entry (lines ~489-497):
```typescript
tracking: {
  heroWhatsapp: "paraguay_hero_whatsapp",
  heroCalculator: "paraguay_hero_calculator",
  finalWhatsapp: "paraguay_final_whatsapp",
  finalCalculator: "paraguay_final_calculator",
  equipmentLink: "paraguay_equipment_link",
  resourceLink: "paraguay_resource_link",
},
```

3. Update the `tracking` block in the uruguay entry (lines ~826-834) — same shape, `uruguay_*` prefix.

4. Update the `tracking` block in the bolivia entry (lines ~1153-1161) — same shape, `bolivia_*` prefix.

Do not touch any other field. Do not change copy, FAQ entries, or schema dates. Hero/final WhatsApp + calculator keys stay exactly as they are.

Why these names: `equipmentLink` and `resourceLink` describe what the user clicked (which content surface), not where it lives. The previous `projectLibrary` name implied the click was about projects — misleading because half the events fire on equipment-category cards.
  </action>
  <verify>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -v 'node_modules' | grep -E 'error' || echo "tsc OK"</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && grep -c 'midWhatsapp\|midCalculator\|projectLibrary' content/latam-market-pages.ts | grep -q '^0$' && echo "dead keys removed" || (echo "FAIL — dead keys still present"; exit 1)</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && grep -c '_equipment_link\|_resource_link' content/latam-market-pages.ts | awk '$1 == 6 { print "6 new event names present"; exit 0 } { print "FAIL — expected 6, got " $1; exit 1 }'</automated>
  </verify>
  <done>
- Type has `equipmentLink` + `resourceLink`, no `midWhatsapp`/`midCalculator`/`projectLibrary`.
- Three entries (paraguay/uruguay/bolivia) each have the 6-key tracking block.
- Six new event-name strings exist in file (3 countries × 2 keys).
- TypeScript still compiles (renderer will fail compile until Task 2 lands — that's expected; final tsc check happens in Task 3).
  </done>
</task>

<task type="auto">
  <name>Task 2: Wire renderer to new tracking keys</name>
  <files>components/destinations/latam-market-page.tsx</files>
  <action>
Edit `components/destinations/latam-market-page.tsx` — exactly two line replacements, no other changes.

1. equipmentFocus card map (line ~423, inside the `content.equipmentFocus.items.map(...)` block, on the `<TrackedCtaLink>` for the per-card link):
   - Find: `location={content.tracking.projectLibrary}`
   - Replace with: `location={content.tracking.equipmentLink}`

2. LinkGrid invocation in credibility section (line ~509, inside the credibility section, on the `<LinkGrid>` component):
   - Find: `location={content.tracking.projectLibrary}`
   - Replace with: `location={content.tracking.resourceLink}`

Do not modify the LinkGrid signature, `TrackedCtaLink`, or any other section. Do not touch hero/final CTA tracking — those use `heroWhatsapp`, `heroCalculator`, `finalWhatsapp`, `finalCalculator` which are unchanged.
  </action>
  <verify>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && grep -c 'content\.tracking\.projectLibrary' components/destinations/latam-market-page.tsx | grep -q '^0$' && echo "old key removed" || (echo "FAIL — projectLibrary still wired"; exit 1)</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && grep -c 'content\.tracking\.equipmentLink' components/destinations/latam-market-page.tsx | grep -q '^1$' && echo "equipmentLink wired once" || (echo "FAIL — expected 1 equipmentLink wire"; exit 1)</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && grep -c 'content\.tracking\.resourceLink' components/destinations/latam-market-page.tsx | grep -q '^1$' && echo "resourceLink wired once" || (echo "FAIL — expected 1 resourceLink wire"; exit 1)</automated>
  </verify>
  <done>
- Renderer references `content.tracking.equipmentLink` exactly once (equipmentFocus card map).
- Renderer references `content.tracking.resourceLink` exactly once (LinkGrid in credibility section).
- Renderer no longer references `content.tracking.projectLibrary`.
  </done>
</task>

<task type="auto">
  <name>Task 3: Add en + x-default hreflang to LatAm metadata branch + verify build</name>
  <files>app/[locale]/destinations/[slug]/page.tsx</files>
  <action>
Edit `app/[locale]/destinations/[slug]/page.tsx` — extend the `alternates.languages` block in the LatAm branch of `generateMetadata` (lines ~111-116).

Find:
```typescript
    alternates: {
      canonical,
      languages: {
        es: canonical,
      },
    },
```

Replace with:
```typescript
    alternates: {
      canonical,
      languages: {
        es: canonical,
        en: `${SITE.url}/destinations/${slug}`,
        "x-default": `${SITE.url}/destinations/${slug}`,
      },
    },
```

Do not touch the Kazakhstan branch above (lines 65-101) — it already has its own correct languages map. Do not touch the generic destination branch below (lines 141+) — it uses `getGenericDestinationLanguageAlternates(slug)` which is already correct (omits `es` for LatAm slugs at line 52-54).

Why no English-side change: When the user hits `/destinations/paraguay` (English), the generic helper at line 46-57 already returns `{ en, ru }` without `es` for LatAm slugs. That correctly avoids two pages claiming `es`, while still letting Google bridge between `/destinations/paraguay` and `/es/destinations/paraguay` via this LatAm-side `en` alternate.

After editing, run the full verification chain (lint, build, test, rendered HTML check).
  </action>
  <verify>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && npm run lint 2>&1 | tail -20</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && npm test 2>&1 | tail -15</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && npm run build 2>&1 | tail -15</automated>
    <automated>cd /Users/zaytsev/.config/superpowers/worktrees/meridian-freight-website/latam-country-pages && for slug in paraguay uruguay bolivia; do html=".next/server/app/es/destinations/${slug}.html"; [ -f "$html" ] || { echo "FAIL — $html missing"; exit 1; }; eq=$(grep -o "${slug}_equipment_link" "$html" | wc -l | tr -d ' '); rl=$(grep -o "${slug}_resource_link" "$html" | wc -l | tr -d ' '); mw=$(grep -c "${slug}_mid_whatsapp" "$html"); mc=$(grep -c "${slug}_mid_calculator" "$html"); pl=$(grep -c "${slug}_project_library" "$html"); en=$(grep -c "hreflang=\"en\".*destinations/${slug}" "$html"); xd=$(grep -c "hreflang=\"x-default\".*destinations/${slug}" "$html"); echo "$slug: eq=$eq rl=$rl mw=$mw mc=$mc pl=$pl en=$en xd=$xd"; [ "$eq" -ge 4 ] && [ "$rl" -ge 4 ] && [ "$mw" -eq 0 ] && [ "$mc" -eq 0 ] && [ "$pl" -eq 0 ] && [ "$en" -ge 1 ] && [ "$xd" -ge 1 ] || { echo "FAIL on $slug"; exit 1; }; done; echo "ALL THREE HUBS PASS"</automated>
  </verify>
  <done>
- `npm run lint` exits 0.
- `npm test` reports 16 files / 144 tests passing (no regression — baseline preserved).
- `npm run build` succeeds with no TypeScript errors.
- For each of paraguay/uruguay/bolivia, the rendered HTML at `.next/server/app/es/destinations/<slug>.html` contains:
  - `<slug>_equipment_link` ≥ 4 times
  - `<slug>_resource_link` ≥ 4 times
  - `<slug>_mid_whatsapp` 0 times
  - `<slug>_mid_calculator` 0 times
  - `<slug>_project_library` 0 times
  - `<link rel="alternate" hreflang="en" href=".../destinations/<slug>"` ≥ 1
  - `<link rel="alternate" hreflang="x-default" href=".../destinations/<slug>"` ≥ 1
  </done>
</task>

</tasks>

<verification>
Final phase checks (Task 3 verify block runs all three):

1. `npm run lint` — exit 0.
2. `npm test` — 16/16 files, 144/144 tests pass; no test file modifications.
3. `npm run build` — succeeds, generates static HTML for all three LatAm hubs.
4. Rendered HTML inspection for paraguay, uruguay, bolivia:
   - 4+ occurrences each of `<slug>_equipment_link` and `<slug>_resource_link`.
   - 0 occurrences of `<slug>_mid_whatsapp`, `<slug>_mid_calculator`, `<slug>_project_library`.
   - hreflang `en` and `x-default` `<link>` tags present in `<head>`, pointing at the absolute English destination URL.
5. Spot-check that hero/final tracking events still render unchanged (`<slug>_hero_whatsapp`, `<slug>_hero_calculator`, `<slug>_final_whatsapp`, `<slug>_final_calculator` each ≥ 1 occurrence).
</verification>

<success_criteria>
- Three P1 fixes land in a single, atomic commit set on the existing `codex/latam-country-pages` branch.
- No copy changes, no new sections, no new translations.
- Type contract for `LatamMarketPageContent.tracking` no longer carries dead keys.
- Analytics can distinguish equipment-card clicks from resource-grid clicks per country.
- Google sees a complete bidirectional hreflang relationship between each LatAm Spanish hub and its existing English destination page.
- Existing test file `content/__tests__/latam-market-pages.test.ts` passes unchanged (16 files / 144 tests).
- Build is green; the PR can move forward to UY/BO copy rewrites with a clean baseline.
</success_criteria>

<output>
After completion, create `.planning/quick/260505-pal-tracking-event-renames-hreflang-alternat/260505-pal-01-SUMMARY.md` with: files modified, exact lines changed, rendered-HTML verification numbers per slug, and any deviation from the plan. Suggested commit shape (single commit OK since all three fixes are tightly coupled):

```
fix(latam): split tracking events, drop dead config, add hreflang alternates

- Split `tracking.projectLibrary` into `equipmentLink` (equipmentFocus card map) and `resourceLink` (credibility LinkGrid). Adds `<country>_equipment_link` + `<country>_resource_link` for paraguay/uruguay/bolivia.
- Remove dead `tracking.midWhatsapp` and `tracking.midCalculator` keys (no consumer in latam renderer).
- Add `en` + `x-default` to `alternates.languages` in LatAm metadata branch so the Spanish hubs cross-link to the existing English destination pages.

P1-1, P1-2, P1-4 from the Paraguay QA audit. No copy changes.
```
</output>
