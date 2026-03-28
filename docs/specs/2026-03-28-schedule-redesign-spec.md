# Schedule Page Complete Redesign — Design Spec

**Date:** 2026-03-28
**Branch:** `schedule-redesign`
**Status:** Draft — awaiting approval

---

## Problem

The /schedule page has the right data and flows but looks like a spreadsheet with CSS. It doesn't match the premium, professional feel of the rest of the site. Every container is treated as a data row — bookable containers should be treated as **products to be sold**, and shipped containers as **proof of competence**.

## Audience

| Persona | Goal | What they scan first |
|---------|------|---------------------|
| Farmer in Kazakhstan | "Is there space to my country?" | Country flag + destination |
| Equipment dealer in Brazil | "When does the next container leave?" | Departure date/countdown |
| Meridian ops sharing a link | "Pick a container and book" | Bookable cards + Book CTA |
| Returning customer | "Where is my shipment?" | In-transit section + progress |

## Design Principles

1. **Destination is the hero** — the country flag and destination name are the largest, most prominent element
2. **Urgency drives action** — countdowns ("Leaves in 2 days"), fill percentages, demand signals
3. **Three-act structure** — Available → In Transit → Delivered (not accordion groups)
4. **Match the site** — use existing tokens, card patterns, animation timing from the design system
5. **Farmers, not designers** — clear, functional, no-fluff. Every element earns its pixels.

---

## Page Structure

```
┌─────────────────────────────────────────────────┐
│ PageHero (gradient variant — keep as-is)        │
│ Stats: Containers | Countries | In Transit | Available │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Sticky Filter Bar                               │
│ [All 26] [Upcoming 14] [In Transit 6] [Delivered 6]  [🌍 All Countries ▼] │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SECTION 1: AVAILABLE SPACE                      │
│ Eyebrow: "Available Space" · primary accent     │
│                                                 │
│ ┌─ Bookable Card ──────────────────────────┐    │
│ │ 🇰🇿  KOKSHETAU, KAZAKHSTAN    [Book →]  │    │
│ │ from Albion, IA · 40HC · D013            │    │
│ │                                          │    │
│ │ ┌──────────────────────────────────────┐  │    │
│ │ │ 📅 Mar 29        ─────→  📍 May 13  │  │    │
│ │ │ Leaves in 2 days    ~36 day transit  │  │    │
│ │ └──────────────────────────────────────┘  │    │
│ │                                          │    │
│ │ ████████████████████░░░  85% · 11.4 CBM  │    │
│ │ 3 others looking                         │    │
│ └──────────────────────────────────────────┘    │
│                                                 │
│ Non-bookable rows (full/no-space):              │
│ ● 🇬🇪 Savannah → Poti, Georgia  40HC  Mar 26   │
│ ● 🇬🇪 Albion → Poti, Georgia    40HC  Mar 26   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SECTION 2: ON THE WATER                         │
│ Eyebrow: "Currently Shipping" · indigo accent   │
│                                                 │
│ ┌─ Transit Card ───────────────────────────┐    │
│ │ 🇫🇷 Albion, IA → France                 │    │
│ │ F001 · 40HC                              │    │
│ │                                          │    │
│ │ ○━━━━━━━━━━🚢━━━━━━━━━━━━━━━○           │    │
│ │ Mar 15          Day 12/25     Apr 9      │    │
│ └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SECTION 3: DELIVERED                            │
│ Eyebrow: "Recently Delivered" · emerald accent  │
│ Collapsed by default, expandable                │
│                                                 │
│ ✅ Poti, Georgia · D003 · Feb 28 → Mar 30      │
│ ✅ Almaty, KZ · D010 · Feb 15 → Mar 25         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CTA Section                                     │
│ "Need a Dedicated Container?"                   │
│ [Chat on WhatsApp]  or email                    │
└─────────────────────────────────────────────────┘
```

---

## Component Specs

### 1. Bookable Card (`schedule-bookable-card.tsx`)

**Layout:** Single card, full-width. Three rows of content.

**Row 1 — Route Hero:**
- Left: Country flag (text-2xl) + Destination (text-lg font-bold) + origin line below (text-sm muted)
- Right: `Book Space →` button (primary, sm)

**Row 2 — Route Timeline:**
- Visual inline timeline: departure dot → dashed line → arrival dot
- Below departure: date + countdown badge (amber if ≤3 days)
- Below arrival: ETA date + transit days
- Background: `bg-muted/30 rounded-lg px-4 py-3`

**Row 3 — Capacity + Demand:**
- Progress bar: h-2, rounded-full, primary color (amber if ≥80%)
- Right of bar: "11.4 CBM left · 85% booked" in font-mono
- Demand badge: "3 others looking" (if pending_count > 0)

**Card Styling:**
- `ring-1 ring-foreground/10 rounded-xl`
- Hover: `hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30` (300ms)
- Active/expanded: `ring-2 ring-primary/30 shadow-lg`
- Scroll entrance: slide-up + fade, staggered 80ms

**Booking Form Expand:**
- CollapsibleContent with Separator
- Background: `bg-muted/20`
- Smooth height animation

### 2. Transit Card (`schedule-transit-card.tsx`) — NEW

**Layout:** Card with inline progress visualization.

**Row 1 — Route:**
- Flag + "Origin → Destination" (or "Destination pending" italic)
- Project number + container type (font-mono, muted)

**Row 2 — Progress Visualization:**
- Full-width visual: departure circle → progress line → ship emoji at % → arrival circle
- Line: `bg-indigo-200` (track), `bg-indigo-500` (fill)
- Ship: positioned at `progressPercent%` with subtle bob animation
- Below: "Mar 15" (left) · "Day 12 of 25" (center, indigo) · "Apr 9" (right)

**Card Styling:**
- `ring-1 ring-foreground/10 rounded-lg`
- Subtle left border: `border-l-3 border-indigo-400`
- No hover lift (these aren't actionable)

### 3. Delivered Row (`schedule-delivered-row.tsx`) — NEW

**Layout:** Compact single line.

- ✅ checkmark (emerald) + flag + destination + project# + dates
- Muted styling: `text-muted-foreground`
- No hover effects
- Inside a bordered container with rounded corners

### 4. Section Headers

**Pattern:** Follow existing site eyebrow → heading pattern.

```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <p className="text-sm font-semibold uppercase tracking-wider text-{accent}">
      {eyebrow}
    </p>
    <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
      {heading}
    </h2>
  </div>
  <span className="text-2xl font-bold font-mono tabular-nums text-muted-foreground">
    {count}
  </span>
</div>
```

**Section accents:**
- Available: `text-primary` (sky-500)
- In Transit: `text-indigo-500`
- Delivered: `text-emerald-500`

### 5. Schedule List (orchestrator)

**Structure:**
- Not accordion groups — three distinct `<section>` elements
- Each section has its own eyebrow, heading, count
- Available section: sub-grouped by time (this week / this month / later) with subtle dividers, not separate accordions
- In Transit: flat list of transit cards
- Delivered: collapsed by default, expand button

**Time sub-groups within Available:**
- Thin divider line with label: "This Week · 3 containers" — not a collapsible, just a visual separator
- `border-t border-border/50` with `text-xs uppercase text-muted-foreground` label

---

## Animations & Interactions

| Element | Trigger | Animation | Timing |
|---------|---------|-----------|--------|
| Bookable cards | Scroll into view | slide-up + fade | 500ms decelerate, 80ms stagger |
| Transit cards | Scroll into view | slide-up + fade | 500ms decelerate, 60ms stagger |
| Capacity bar fill | Card enters viewport | Width 0 → fill% | 800ms ease-out |
| Transit progress fill | Card enters viewport | Width 0 → progress% | 1000ms ease-out |
| Ship emoji position | Card enters viewport | Left 0 → position% | 1200ms ease-out |
| Bookable card hover | Mouse enter | lift -2px + shadow-lg | 300ms |
| Book Space button hover | Mouse enter | arrow nudge-right 4px | 200ms |
| Booking form expand | Click "Book Space" | Height 0 → auto + fade | 250ms easeInOut |
| Delivered expand | Click "Show delivered" | Height 0 → auto + fade | 250ms easeInOut |
| Filter tab switch | Click tab | Content crossfade | 200ms |

---

## Mobile Considerations

- Bookable cards: stack vertically, full-width CTA button
- Route timeline: simplify to single line (no visual dots/line on mobile)
- Transit progress: show text-only on mobile ("Day 12/25 · 48%"), visual bar on sm+
- Filter bar: horizontal scroll on tabs, country dropdown below
- Delivered rows: same compact layout, works at any width

---

## Files to Create/Modify

| Action | File | Description |
|--------|------|-------------|
| Rewrite | `components/schedule/schedule-list.tsx` | Three-section layout, no accordions |
| Rewrite | `components/schedule/schedule-bookable-row.tsx` | → rename to `schedule-bookable-card.tsx` |
| Create | `components/schedule/schedule-transit-card.tsx` | New transit visualization card |
| Create | `components/schedule/schedule-delivered-row.tsx` | New compact delivered row |
| Create | `components/schedule/schedule-section-header.tsx` | Reusable section header |
| Keep | `components/schedule/schedule-filter-bar.tsx` | Minor polish only |
| Keep | `components/schedule/schedule-booking-form.tsx` | No changes |
| Keep | `components/schedule/schedule-stats.tsx` | No changes |
| Keep | `components/schedule/schedule-empty-state.tsx` | No changes |
| Delete | `components/schedule/schedule-row.tsx` | Replaced by transit-card + delivered-row |
| Delete | `components/schedule/transit-progress.tsx` | Merged into transit-card |
| Keep | `lib/schedule-display.ts` | Already has needed helpers |

---

## What Stays The Same

- All data fetching (supabase-containers.ts)
- Booking form (schedule-booking-form.tsx)
- Booking server action (app/actions/booking.ts)
- Cron sync pipeline
- Tracking events (GA4, Vercel, Meta)
- Filter logic (tabs, country)
- Page metadata, JSON-LD, SEO
- PageHero component
