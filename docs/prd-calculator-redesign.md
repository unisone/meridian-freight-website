# PRD: Freight Calculator Page Redesign

**Status:** Historical draft - superseded by `docs/specs/2026-04-21-freight-calculator-v3-production-spec.md`
**Author:** Claude Code
**Date:** 2026-03-18
**Branch:** TBD (will create `feat/calculator-redesign` after approval)

---

> Current production direction: preserve the existing production calculator UI structure and run V3 as the default `/pricing/calculator` implementation. This March redesign PRD is retained for historical context only and is not the active calculator spec.

## 1. Overview

Redesign the `/pricing/calculator` page from a single-column, step-by-step wizard into a modern **two-column configurator** layout with a **sticky live estimate sidebar**, inspired by the provided mockup. The goal is a premium, tool-like UX that improves engagement and lead conversion.

### Goals
- Increase perceived professionalism (first-impression "this is a real tool, not a form")
- Reduce form abandonment via live price feedback and visible progress
- Maintain 100% of existing lead capture + analytics functionality
- Improve mobile experience with a sticky estimate bar

### Non-Goals
- Changing the freight calculation engine (`lib/freight-engine-v2.ts`) — remains untouched
- Changing the server action submission flow (`app/actions/calculator.ts`) — remains untouched
- Adding a map visualization (Phase 2 item)
- Changing the data model or Supabase schema

---

## 2. Current State vs. Target State

| Aspect | Current | Target |
|--------|---------|--------|
| Page layout | Single Card, `max-w-2xl` centered | **Two-column** (form left + estimate right), `max-w-6xl` |
| Step visibility | One step at a time (hidden wizard) | **All sections visible** on a scrollable page |
| Progress bar | Filled color segments, no labels | **Labeled progress bar** with step numbers |
| Category selection | Text pill buttons | **Icon cards** with equipment category icons |
| Estimate visibility | Only after step 4 submission | **Live sidebar** updating on every input change |
| Email capture | Dedicated step 3 (full-page gate) | **Inline capture** triggered by CTA click |
| Mobile layout | Same single-column card | **Stacked** with sticky bottom estimate bar |
| Page header | Simple centered `h1` + subtitle | **Styled header** with badge/subtitle accent |
| Visual density | Tight, functional | **Spacious**, premium, section-numbered |

---

## 3. Layout Architecture

### Desktop (lg+): Two-Column

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Header                                                     │
│  Subtitle accent: "FREIGHT ESTIMATION TOOL"                      │
│  H1: "Freight Calculator"                                        │
│  Badge: "Industrial-Grade Precision Estimator"                   │
├─────────────────────────────────────────────────────────────────┤
│  Progress Bar: [1: TYPE ━━━━ 2: SPECS ━━━━ 3: ROUTE ━━━━ 4: REVIEW] │
├───────────────────────────────────┬─────────────────────────────┤
│                                   │                             │
│  FORM COLUMN (flex-[3])           │  SIDEBAR (flex-[2])         │
│                                   │  ┌───────────────────────┐  │
│  ┌─ Section 01 ─────────────────┐ │  │  ESTIMATED FREIGHT    │  │
│  │  Select Equipment Category   │ │  │  Based on rates       │  │
│  │  [Icon][Icon][Icon][Icon]    │ │  │                       │  │
│  │  ...more categories          │ │  │  $X,XXX.00            │  │
│  │                              │ │  │  OPTIMIZED ROUTE RATE │  │
│  │  Equipment Type list         │ │  │                       │  │
│  └──────────────────────────────┘ │  │  Transit    18-22 d   │  │
│                                   │  │  Container  40' HC    │  │
│  ┌─ Section 02 ─────────────────┐ │  │  Carrier    HAPAG     │  │
│  │  Equipment Specs             │ │  │                       │  │
│  │  Size input (if needed)      │ │  │  [Book This Freight →]│  │
│  │  Packing cost preview card   │ │  │  [Refine Parameters]  │  │
│  └──────────────────────────────┘ │  └───────────────────────┘  │
│                                   │                             │
│  ┌─ Section 03 ─────────────────┐ │  ┌───────────────────────┐  │
│  │  Shipping Route              │ │  │  ROUTE DETAILS        │  │
│  │  Country dropdown            │ │  │  "Your equipment      │  │
│  │  ZIP code input              │ │  │   ships from Chicago  │  │
│  │  Route preview text          │ │  │   via HAPAG to..."    │  │
│  └──────────────────────────────┘ │  │                       │  │
│                                   │  │  Line-item breakdown   │  │
│                                   │  │  (after email submit)  │  │
│                                   │  └───────────────────────┘  │
├───────────────────────────────────┴─────────────────────────────┤
│  Disclaimer + Notes                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile (<lg): Stacked + Sticky Bottom Bar

On screens below `lg` (1024px):
- Form sections stack vertically (full-width)
- The estimate sidebar becomes a **sticky bottom bar** (~64px) showing:
  - Current estimate total (e.g., "Est. $4,820")
  - A "View Details" / "Book This Freight" button
  - Tapping expands the full estimate card as a **bottom sheet** (using Sheet component)

---

## 4. Component Architecture

### New/Modified Files

```
app/pricing/calculator/page.tsx              ← MODIFY (new layout, header)
components/freight-calculator/
├── calculator-wizard.tsx                    ← REWRITE (two-column configurator)
├── calculator-sections.tsx                  ← NEW (form sections: equipment, specs, route)
├── calculator-estimate-sidebar.tsx          ← NEW (sticky sidebar + estimate card)
├── calculator-estimate-mobile.tsx           ← NEW (sticky bottom bar + sheet)
├── calculator-email-gate.tsx                ← NEW (inline email capture form)
├── calculator-progress-bar.tsx              ← NEW (labeled step progress)
├── calculator-category-card.tsx             ← NEW (icon card for category selection)
└── calculator-results-breakdown.tsx         ← NEW (line-item results, extracted from wizard)
```

### Component Tree

```
<CalculatorPage>                         (Server Component — page.tsx)
  <PageHeader />                          (subtitle, h1, badge)
  <CalculatorWizard>                      (Client Component — root state manager)
    <CalculatorProgressBar />              (labeled 4-step bar)
    <div className="flex gap-8">
      <div className="flex-[3]">           (form column)
        <EquipmentSection />               (01: category cards + equipment list)
        <SpecsSection />                   (02: size input + packing preview)
        <RouteSection />                   (03: country + ZIP + route preview)
      </div>
      <div className="flex-[2] sticky">    (estimate column, desktop only)
        <EstimateSidebar />                (dark card + CTA)
      </div>
    </div>
    <EstimateMobileBar />                 (sticky bottom, mobile only)
    <EmailGateDialog />                   (triggered by CTA click)
  </CalculatorWizard>
```

### State Management

All state stays in `<CalculatorWizard>` (same as today). The sub-components receive props:

```typescript
// Shared types for section props
interface SectionProps {
  data: CalculatorData;
  // Section-specific state + handlers passed as props
}

// Estimate sidebar props
interface EstimateSidebarProps {
  preview: FreightEstimateV2 | null;
  result: CalculatorResult | null;  // null until email submitted
  selectedEquipment: EquipmentPackingRate | null;
  destinationCountry: string;
  isComplete: boolean;              // all 3 sections filled
  onBookClick: () => void;          // opens email gate
}
```

---

## 5. Section Details

### 5.1 Page Header

```
[FREIGHT ESTIMATION TOOL]                 ← text-xs uppercase tracking-widest text-primary
Freight Calculator                         ← text-3xl sm:text-4xl md:text-5xl font-bold
  ◉ Industrial-Grade Precision Estimator  ← badge with checkmark icon, right-aligned
```

- Replaces current centered text
- Left-aligned header with right-aligned badge (like mockup)
- Subtle border-bottom below header area

### 5.2 Progress Bar

Horizontal bar divided into 4 labeled segments:

```
STEP 1: TYPE  ━━━━━━  STEP 2: SPECS  ━━━━━━  STEP 3: ROUTE  ━━━━━━  STEP 4: REVIEW
[■■■■■■■■■■■■■■■■■■■] [░░░░░░░░░░░░░░░░░░░] [░░░░░░░░░░░░░░░░░░░] [░░░░░░░░░░░░░░░░░░░]
```

- **Completion-based**, not click-navigable (steps fill as user completes sections)
- Step 1 fills when equipment is selected
- Step 2 fills when specs are complete (size entered if needed)
- Step 3 fills when country is selected
- Step 4 fills when email is submitted and results are returned
- Colors: `bg-primary` for filled, `bg-muted` for unfilled
- Labels: `text-xs font-medium uppercase tracking-wider`

### 5.3 Section 01: Select Equipment

**Category Selection — Icon Cards**

Display categories as a scrollable grid of icon cards (4 per row on desktop, 2 on mobile):

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│   🔧    │ │   🚜    │ │   📦    │ │   🏗️    │
│Combines │ │Tractors │ │Planters │ │Construct│
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

- Each card: `w-24 h-20` with Lucide icon + label
- Selected state: `border-primary bg-primary/5` with ring
- Unselected: `border-border hover:border-primary/50`
- Since we have 18 categories, display top 8 as cards, the rest in a "More categories" expandable section or horizontal scroll

**Category icon mapping** (Lucide icons):
| Category | Icon |
|----------|------|
| combine | `Wheat` |
| tractor | `Tractor` |
| header | `Rows3` |
| sprayer | `Droplets` |
| planter | `Sprout` |
| seeder | `Leaf` |
| tillage | `Mountain` |
| baler | `Package` |
| construction | `HardHat` |
| excavator | `Shovel` |
| wheel_loader | `Truck` |
| skid_steer | `Forklift` |
| dozer | `Layers` |
| forestry | `TreePine` |
| backhoe | `Construction` |
| skidder | `TreeDeciduous` |
| feller_buncher | `Axe` |
| forwarder | `Container` |
| misc | `MoreHorizontal` |

**Equipment Type List**

After selecting a category, equipment types appear below as a `ScrollArea` (max-h-64):

- Each item is a clickable row with display name + model subtext
- Selected: `bg-primary text-primary-foreground` rounded
- Badge showing container type (40'HC or Flat Rack) on each item

### 5.4 Section 02: Equipment Specs

Only visible when equipment is selected (`selectedEquipment !== null`).

**If `packing_unit === "flat"`:** Show packing cost preview card only (no size input needed).

**If variable pricing (`per_row`, `per_foot`, etc.):** Show labeled input field + packing cost calculation.

Layout:
```
02  Equipment Specs

    NUMBER OF ROWS                    ← uppercase label
    ┌──────────┐
    │ 12       │                      ← Input, max-w-32
    └──────────┘

    ┌─ Packing & Loading ──────────────────────┐
    │  $1,800                                   │
    │  $150/row × 12 rows                       │
    │  Container: 40' High Cube  [badge]        │
    └───────────────────────────────────────────┘
```

- Packing preview card: `bg-muted rounded-xl p-4`
- Cost in `font-mono text-xl font-bold text-primary`

### 5.5 Section 03: Shipping Route

```
03  Shipping Route

    DESTINATION COUNTRY *                PICKUP ZIP CODE
    ┌──────────────────── ▾┐            ┌──────────┐
    │ Select a country...  │            │ e.g. 50005│
    └──────────────────────┘            └──────────┘
    Enter ZIP to include US inland transport in your estimate.

    ┌─ Route Preview ──────────────────────────────────┐
    │  ZIP 50005 → Albion, IA → Chicago, IL → Uruguay  │
    └──────────────────────────────────────────────────┘
```

- Two-column layout for country + ZIP (side by side on desktop, stacked on mobile)
- Country uses shadcn `Select` component (not native `<select>`)
- Route preview card appears when country is selected

### 5.6 Estimate Sidebar (Desktop)

**Dark-themed sticky card** positioned in the right column:

```css
/* Positioning */
position: sticky;
top: 6rem;  /* below header */
```

**Card design:**
- Background: `bg-slate-900` (dark card, like mockup)
- Top section: "ESTIMATED FREIGHT" label in `text-xs uppercase tracking-widest text-primary`
- Price: `font-mono text-4xl font-bold text-white` (e.g., "$4,820.00")
- Below price: "OPTIMIZED ROUTE RATE" in `text-xs text-primary uppercase`
- Detail rows (muted text, right-aligned values):
  - Transit Time: `18 - 22 Days`
  - Container: `40' High Cube`
  - Carrier: `HAPAG`
  - Loading Type: `Container`
- Primary CTA: `bg-primary hover:bg-primary/90 text-primary-foreground w-full py-5 rounded-xl font-semibold`
  - Text: "Book This Freight →" (triggers email gate)
  - Disabled until all 3 sections are complete
- Secondary CTA: `variant="outline" w-full` with white text/border
  - Text: "Refine Quote Parameters"
  - Scrolls back to section 01

**States:**
1. **Empty** (no equipment selected): Shows placeholder — "Select equipment and destination to see your estimate" with dashed border
2. **Partial** (equipment but no destination): Shows packing cost only, rest as "—"
3. **Complete** (all inputs filled): Full estimate with all detail rows
4. **Submitted** (after email gate): Shows detailed line-item breakdown (inland + packing + ocean) replacing the summary view

### 5.7 Estimate Mobile Bar (<lg)

A fixed bottom bar visible only on mobile when estimate is available:

```
┌───────────────────────────────────────────────┐
│  Est. $4,820    │  [Book This Freight →]       │
└───────────────────────────────────────────────┘
```

- `fixed bottom-0 left-0 right-0` with `bg-slate-900 text-white`
- Height: `h-16` with horizontal padding
- Price on left, CTA button on right
- Tapping the price area opens a `Sheet` (bottom slide-up) with the full estimate card

### 5.8 Email Gate

**Trigger:** User clicks "Book This Freight" CTA.

**Implementation:** Inline expansion below the CTA (not a separate wizard step or modal). The estimate card expands to reveal the email form:

```
┌─ ESTIMATED FREIGHT ──────────────────────────┐
│  $4,820.00                                    │
│  ... detail rows ...                          │
│                                               │
│  ┌─ Get Your Detailed Estimate ────────────┐  │
│  │                                          │  │
│  │  EMAIL *                                 │  │
│  │  ┌──────────────────────────────────┐    │  │
│  │  │ your@email.com                   │    │  │
│  │  └──────────────────────────────────┘    │  │
│  │                                          │  │
│  │  NAME              COMPANY               │  │
│  │  ┌────────────┐   ┌────────────┐         │  │
│  │  │ Optional   │   │ Optional   │         │  │
│  │  └────────────┘   └────────────┘         │  │
│  │                                          │  │
│  │  [Calculate & Send Estimate →]           │  │
│  │                                          │  │
│  │  🔒 We'll email you a detailed breakdown │  │
│  └──────────────────────────────────────────┘  │
│                                               │
│  (honeypot field hidden as before)            │
└───────────────────────────────────────────────┘
```

On mobile, this opens as a Sheet (bottom slide-up) instead of inline expansion.

**After submission:** The estimate card transitions to show:
- Success checkmark
- Full line-item breakdown (inland, packing, ocean, total)
- "Get Detailed Quote" → links to `/contact`
- "WhatsApp Us" → links to WhatsApp
- "Calculate Another" → resets all

### 5.9 Post-Submission Results View (Step 4: REVIEW)

After successful email submission, the entire page shifts to a results view:

- Progress bar fills step 4
- Left column: Summary of selections (equipment, route, specs) — read-only review
- Right column (sidebar): Detailed line-item breakdown card

```
┌─ YOUR FREIGHT ESTIMATE ──────────────────────┐
│  ✓ Estimate sent to your@email.com           │
│                                               │
│  US Inland Transport           $2,850         │
│    (438 mi × $6.50/mi + $1,800 drayage)      │
│                                               │
│  Packing & Loading             $1,800         │
│    ($150/row × 12 rows)                       │
│                                               │
│  Ocean Freight                 $3,200         │
│    HAPAG • Chicago → Montevideo • 22 days     │
│                                               │
│  ─────────────────────────────────────────    │
│  ESTIMATED TOTAL              $7,850          │
│                                               │
│  [40' HC] [HAPAG] [Excl. duties/taxes]        │
│                                               │
│  [Get Detailed Quote →]                       │
│  [WhatsApp Us]                                │
│  [Calculate Another]                          │
└───────────────────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `<sm` (640px) | Single column, 2 category cards per row, sheet for estimate |
| `sm-lg` (640-1024px) | Single column, 3-4 category cards, sheet for estimate |
| `lg+` (1024px+) | Two-column (3:2 ratio), sticky sidebar |
| `xl+` (1280px+) | Same two-column, more spacious padding |

---

## 7. Component Styling Tokens

All components use the existing design system from `globals.css`:

| Element | Token |
|---------|-------|
| Section numbers | `bg-primary text-primary-foreground` (teal circle) |
| Section headings | `text-lg font-bold text-foreground` |
| Category cards border | `border-border` → `border-primary` on select |
| Estimate card bg | `bg-slate-900` (hardcoded dark — this is a design accent, not dark mode) |
| Estimate card text | `text-white`, `text-slate-400` for muted |
| Estimate price | `font-mono text-4xl font-bold text-white` |
| Primary CTA | `bg-primary text-primary-foreground` (our teal/sky) |
| Packing preview | `bg-muted rounded-xl` |
| Route preview | `bg-muted rounded-xl` |
| Progress bar filled | `bg-primary` |
| Progress bar empty | `bg-muted` |

---

## 8. Data Flow (Unchanged)

```
mount → getCalculatorData() → {equipment[], oceanRates[], categories[], countries[]}
                                    ↓
user selects equipment + country → calculateFreightV2() → preview (client-side)
                                    ↓
user clicks CTA → email gate → submitCalculator() → server-side recalc + lead capture
                                    ↓
                              result with detailed estimate
```

No changes to:
- `app/actions/calculator.ts` (server action)
- `app/actions/calculator-data.ts` (data fetching)
- `lib/freight-engine-v2.ts` (calculation engine)
- `lib/types/calculator.ts` (type definitions)
- `lib/schemas.ts` (Zod validation)
- Analytics tracking (GA4, Meta Pixel)
- Honeypot spam prevention

---

## 9. Accessibility

- All interactive elements keyboard-navigable
- Category cards: `role="radiogroup"` with `role="radio"` children
- Equipment list: `role="listbox"` with `role="option"` items
- Progress bar: `role="progressbar"` with `aria-valuenow`
- Estimate card: `aria-live="polite"` to announce price changes
- Email form: proper `<label>` associations, `aria-required`
- Mobile sheet: focus trap, `Escape` to dismiss
- Color contrast: all text on dark card meets WCAG AA (white on slate-900)

---

## 10. Migration Strategy

### What Gets Deleted
- The current wizard's step-toggling UI logic (steps 1-4 as hidden/shown divs)
- The inline step 3 email form
- The inline step 4 results display

### What Gets Extracted & Reused
- All state management logic (useState hooks, useEffect for data + preview)
- `handleCalculate()` submission function (unchanged)
- `resetAll()` function (unchanged)
- Loading state and error state UI (minor restyling)
- All imports and type usage

### New Components to Create
1. `calculator-progress-bar.tsx` — Progress indicator
2. `calculator-sections.tsx` — Three form sections (01, 02, 03)
3. `calculator-category-card.tsx` — Icon card component
4. `calculator-estimate-sidebar.tsx` — Desktop sticky sidebar
5. `calculator-estimate-mobile.tsx` — Mobile sticky bar + sheet
6. `calculator-email-gate.tsx` — Inline email capture
7. `calculator-results-breakdown.tsx` — Line-item results display

### shadcn/ui Components Needed
Already installed: `Card`, `Button`, `Input`, `Label`, `Badge`, `Tooltip`, `ScrollArea`, `Select`, `Sheet`, `Separator`, `Skeleton`

All required components are already in the project.

---

## 11. Out of Scope (Phase 2)

- **Route map visualization** — SVG world map with animated route line
- **Industry Insights quote** — Static testimonial card below estimate
- **Animated transitions** — Motion/Framer-motion entrance animations for sections
- **Skeleton loading** — Shimmer placeholders while data loads
- **Save & resume** — LocalStorage persistence of form state
- **A/B testing** — Split test old vs. new calculator

---

## 12. Open Questions

1. **Category card layout:** With 18 categories, should we show all as cards (scrollable grid) or top 8 + "More" expansion? → **Recommendation: Show all in a scrollable flex-wrap grid, 4 per row desktop, 2 mobile. With 18 items that's 4-5 rows which is reasonable.**

2. **Email gate placement:** Inline expansion in sidebar vs. Sheet/Dialog? → **Recommendation: Inline expansion on desktop (more fluid), Sheet on mobile (better UX for small screens).**

3. **"Refine Quote Parameters" button:** What should it do? → **Recommendation: Smooth-scroll to Section 01 (top of form). Simple and useful.**

4. **Section numbers visibility:** Should section 02 (Specs) always be visible or only after equipment is selected? → **Recommendation: Always visible but disabled/grayed out with "Select equipment first" placeholder when no equipment is selected. This lets users see the full form scope upfront.**

---

## Approval Checklist

- [ ] Layout approach (two-column configurator) approved
- [ ] Email gate approach (inline CTA, not separate step) approved
- [ ] Mobile approach (sticky bottom bar + sheet) approved
- [ ] Component file structure approved
- [ ] Open questions resolved
- [ ] Ready to create branch and implement
