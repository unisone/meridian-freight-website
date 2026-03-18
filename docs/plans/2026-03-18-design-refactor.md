# Website Design Refactor — PRD & Implementation Spec

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the entire meridianexport.com design from "electric blue template" aesthetic to a professional, industry-aligned "deep navy + teal" design system that matches the simplicity and authenticity of lp.meridianexport.com while scaling to a full multi-page corporate site.

**Architecture:** Incremental refactor of existing Next.js 16 App Router site. No structural rewrites — we change the design system (colors, typography, spacing), rebuild 4 key components (header, hero, project display, trust section), simplify the homepage from 11 sections to 7, and propagate changes across all 11 pages.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui (new-york), motion/react, Geist Sans + Mono, Lucide React

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Design Research Summary](#2-design-research-summary)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Scope Definition](#4-scope-definition)
5. [Design System Specification](#5-design-system-specification)
6. [Component Inventory](#6-component-inventory)
7. [Page-by-Page Specifications](#7-page-by-page-specifications)
8. [Responsive Specifications](#8-responsive-specifications)
9. [Animation Specifications](#9-animation-specifications)
10. [Accessibility Requirements](#10-accessibility-requirements)
11. [Performance Budget](#11-performance-budget)
12. [Implementation Plan (Phased)](#12-implementation-plan-phased)
13. [Migration & Rollback Strategy](#13-migration--rollback-strategy)
14. [Appendix: Research Evidence](#14-appendix-research-evidence)

---

## 1. Problem Statement

### Current State

The meridianexport.com design suffers from three core issues:

**1.1 Template Aesthetic**
The full-bleed hero with centered text over a dark image overlay, bold blue gradient stats bar, and animated counters is a pattern used by thousands of WordPress themes. It signals "we bought a template" rather than "we are an established export company with 13+ years of experience." B2B buyers in the machinery/freight space evaluate credibility in under 5 seconds — the current design triggers the wrong response.

**1.2 Color Overload**
Electric blue `#2563EB` (Tailwind `blue-600`) is applied everywhere: header utility bar, stats bar, process circles, CTA buttons, card hover states, gradient backgrounds, link text, and icons. There is no visual rest — every section screams for attention equally, which means nothing stands out. The blue also reads as "tech startup" rather than "logistics/freight company."

**1.3 Information Density**
The homepage contains 11 distinct sections (Hero → Stats → Services → Process → Projects → Calculator CTA → Video → Trust Signals → FAQ → Contact form → Footer). This creates scroll fatigue before the visitor reaches a conversion point. The LP achieves the same goal with fewer, more focused sections.

### Desired State

A design that:
- Feels like Maersk, Flexport, or DSV — professional freight companies, not a SaaS startup
- Uses the LP's clean simplicity as a foundation but scales to multi-page depth
- Prioritizes WhatsApp and direct contact as primary conversion paths
- Shows real photography of actual operations (already available in `/public/images/`)
- Reduces homepage cognitive load from 11 sections to 7

---

## 2. Design Research Summary

### 2.1 Competitor Analysis (Freight/Logistics Industry)

| Company | Primary Color | Hero Pattern | Nav Pattern | Key Trust Signal |
|---------|--------------|-------------|-------------|-----------------|
| Maersk | Deep Navy #002664 | Image + CTA overlay | Mega-menu, single tier | Client logos, shipment volume |
| DSV | Navy #083A74 + soft blue | Tabbed interface hero | Mega-menu with industry segments | Industry-specific solutions |
| C.H. Robinson | Navy → Cyan gradient | Split (text + image) | Sticky single tier | "75K Customers, 37M Shipments" |
| Flexport | Navy #0A2540 + green | Product dashboard screenshot | Minimal, sticky | Real-time tracking demo |

**Industry consensus:** Deep navy (`#002664` to `#0f172a`) as primary, bright cyan/teal as accent, white-first backgrounds, generous whitespace, real photography over stock.

### 2.2 LP Site (lp.meridianexport.com) — CEO-Approved Direction

**What the CEO likes (confirmed):**
- Clean white backgrounds with subtle gray section alternation
- Split hero layout (text left, real product photo right)
- Single-tier navigation, no utility bar
- Real product photography, not stock
- Simple process steps (4-across, centered)
- WhatsApp-first CTA strategy
- 3-column project grid (not carousel)

**What needs to evolve for the main site:**
- The dark green accent (#1a4731) is too John Deere-specific — needs to become brand-neutral
- Static feel — needs subtle scroll-reveal animations
- Single-page architecture needs to scale to 11 pages
- Missing: service detail pages, pricing tables, calculator, about page depth

### 2.3 B2B Industrial Design Trends 2024-2026

1. **Functional heroes** — immediate access to primary actions, not inspirational imagery
2. **Video-first storytelling** — autoplaying operational footage in heroes
3. **Self-service tools** — calculators, configurators, instant quoting
4. **Client portals** — website as gateway to operational dashboard
5. **Mobile parity** — identical experience across devices
6. **Sustainability messaging** — eco-friendly practices featured
7. **AI chatbots** — replacing static FAQ sections

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| # | Goal | Measurable By |
|---|------|--------------|
| G1 | Professional brand perception aligned with freight industry | Qualitative: CEO approval, visitor feedback |
| G2 | Improved conversion rate (quote requests) | GA4: form_submit + whatsapp_click events |
| G3 | Reduced bounce rate on homepage | GA4: bounce rate < 45% (current baseline TBD) |
| G4 | Faster time-to-first-conversion | GA4: avg time to first CTA click |
| G5 | Mobile experience parity | Lighthouse mobile score >= 90 |

### 3.2 Non-Goals

- Dark mode support (corporate marketing site, light only)
- Complete information architecture restructure (keep existing 11 pages)
- Content rewrite (keep existing copy, only adjust headings where design requires)
- New pages or features (no new routes)
- Backend/API changes (Server Actions, Supabase, Resend unchanged)

### 3.3 Success Criteria

The refactor is complete when:
1. All 11 pages render with the new design system
2. `npm run build` passes with zero errors
3. `npm run lint` passes with zero errors
4. Lighthouse performance score >= 90 (desktop), >= 85 (mobile)
5. All existing functionality preserved (forms, calculator, tracking, analytics)
6. CEO visual approval on staging/preview deployment

---

## 4. Scope Definition

### 4.1 In Scope

| Category | Items |
|----------|-------|
| **Design tokens** | Color palette, border radius, spacing scale in `app/globals.css` |
| **Layout** | Header, footer, page shell in `app/layout.tsx` |
| **Homepage** | Section reduction (11 → 7), component rebuilds |
| **Components (rebuild)** | `header.tsx`, `hero.tsx`, `stats-bar.tsx` → merged into trust bar, `project-carousel.tsx` → grid |
| **Components (restyle)** | `services-grid.tsx`, `process-steps.tsx`, `footer.tsx`, `contact-form.tsx`, `contact-info.tsx`, `video-section.tsx`, `faq-accordion.tsx`, `mobile-bottom-bar.tsx`, `whatsapp-widget.tsx` |
| **Inner pages** | Services (overview + 6 slugs), projects, pricing, calculator, about, FAQ, contact, privacy, terms |
| **Animations** | Reduce intensity, keep scroll-reveal, remove counter animations |

### 4.2 Out of Scope

| Category | Reason |
|----------|--------|
| Content data files (`content/*.ts`) | Copy stays the same, only consumed differently |
| Server Actions (`app/actions/`) | No backend changes |
| API routes (`app/api/`) | No backend changes |
| Utility libraries (`lib/`) | No logic changes |
| Schema/validation (`lib/schemas.ts`) | No form changes |
| Constants (`lib/constants.ts`) | Contact info unchanged |
| shadcn/ui primitives (`components/ui/`) | Only `globals.css` token changes propagate; no component source edits |
| Analytics/tracking components | GA4, Meta Pixel, Attribution, Vercel Analytics unchanged |
| Cookie consent | Functionality unchanged (may restyle minimally) |
| Freight calculator wizard | Complex multi-step form — restyle only if tokens propagate naturally |
| SEO metadata | All `generateMetadata()` calls unchanged |
| JSON-LD structured data | Schema markup unchanged |

### 4.3 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Color token change breaks shadcn/ui components | Medium | High | Test all 19 UI primitives after token swap |
| Removing sections loses SEO juice | Low | Medium | Keep all content — just reorganize, don't delete |
| CEO dislikes navy palette | Low | High | Create color comparison mockup before full implementation |
| Animation reduction makes site feel "dead" | Medium | Low | Keep scroll-reveal, only remove counters |
| Mobile bottom bar conflicts with new header | Medium | Medium | Test mobile nav + bottom bar interaction early |

---

## 5. Design System Specification

### 5.1 Color Palette

#### Primary Palette — "Deep Navy + Teal"

| Token | Role | oklch Value | Hex Equivalent | Tailwind Approx |
|-------|------|------------|----------------|-----------------|
| `--navy-950` | Darkest (footer, header bg) | `oklch(0.15 0.03 260)` | #0c1425 | `slate-950` |
| `--navy-900` | Primary dark | `oklch(0.20 0.04 260)` | #0f1d32 | `slate-900` |
| `--navy-800` | Secondary dark | `oklch(0.27 0.05 255)` | #1e3048 | ~`slate-800` |
| `--navy-700` | Dark accent | `oklch(0.35 0.06 250)` | #2d4560 | ~`slate-700` |
| `--teal-500` | Primary accent (CTAs, links) | `oklch(0.72 0.15 195)` | #0ea5e9 | `sky-500` |
| `--teal-600` | Accent hover | `oklch(0.65 0.16 200)` | #0284c7 | `sky-600` |
| `--teal-400` | Accent light | `oklch(0.80 0.13 195)` | #38bdf8 | `sky-400` |
| `--emerald-600` | WhatsApp CTAs | `oklch(0.60 0.17 160)` | #059669 | `emerald-600` |
| `--emerald-700` | WhatsApp hover | `oklch(0.53 0.15 160)` | #047857 | `emerald-700` |

#### Neutral Palette

| Token | Role | oklch Value | Hex | Tailwind |
|-------|------|------------|-----|----------|
| `white` | Page background | `oklch(1 0 0)` | #ffffff | `white` |
| `--surface` | Section alternate bg | `oklch(0.98 0.002 250)` | #f8fafc | `slate-50` |
| `--text-primary` | Headings, body | `oklch(0.15 0.03 260)` | #0f172a | `slate-900` |
| `--text-secondary` | Descriptions | `oklch(0.55 0.015 260)` | #475569 | `slate-600` |
| `--text-muted` | Labels, meta | `oklch(0.64 0.01 260)` | #64748b | `slate-500` |
| `--border` | Card borders, dividers | `oklch(0.92 0.004 260)` | #e2e8f0 | `slate-200` |

#### Semantic Tokens (globals.css `:root` mapping)

```css
:root {
  --background: oklch(1 0 0);                    /* white */
  --foreground: oklch(0.15 0.03 260);            /* navy-950 → slate-900 */
  --primary: oklch(0.72 0.15 195);               /* teal-500 → sky-500 */
  --primary-foreground: oklch(1 0 0);            /* white */
  --secondary: oklch(0.98 0.002 250);            /* surface → slate-50 */
  --secondary-foreground: oklch(0.15 0.03 260);  /* navy-950 */
  --muted: oklch(0.96 0.003 250);                /* light gray */
  --muted-foreground: oklch(0.55 0.015 260);     /* text-secondary */
  --accent: oklch(0.98 0.002 250);               /* surface */
  --accent-foreground: oklch(0.15 0.03 260);     /* navy-950 */
  --destructive: oklch(0.577 0.245 27.325);      /* red — unchanged */
  --border: oklch(0.92 0.004 260);               /* slate-200 */
  --input: oklch(0.92 0.004 260);                /* slate-200 */
  --ring: oklch(0.72 0.15 195);                  /* teal-500 — focus rings match accent */
  --card: oklch(1 0 0);                          /* white */
  --card-foreground: oklch(0.15 0.03 260);       /* navy-950 */
  --radius: 0.625rem;                            /* unchanged */
}
```

### 5.2 Typography Scale

**Fonts:** No change — Geist Sans + Geist Mono via `next/font/google`

| Role | Font | Weight | Size (mobile → desktop) | Line Height | Tracking | Example |
|------|------|--------|------------------------|-------------|----------|---------|
| **Page title (H1)** | Geist Sans | 700 | `text-3xl` → `text-5xl` → `text-6xl` | `leading-tight` (1.25) | `tracking-tight` (-0.025em) | "Professional Machinery Export & Logistics" |
| **Section heading (H2)** | Geist Sans | 700 | `text-2xl` → `text-3xl` → `text-4xl` | `leading-tight` | `tracking-tight` | "Our Services" |
| **Card heading (H3)** | Geist Sans | 600 | `text-lg` → `text-xl` | `leading-snug` (1.375) | normal | "Machinery Packing" |
| **Section label** | Geist Sans | 500 | `text-xs` → `text-sm` | normal | `tracking-wider` (0.05em) + `uppercase` | "WHAT WE DO" |
| **Body** | Geist Sans | 400 | `text-base` → `text-lg` | `leading-relaxed` (1.625) | normal | Descriptions, paragraphs |
| **Small/meta** | Geist Sans | 400 | `text-sm` | `leading-normal` (1.5) | normal | Card descriptions, metadata |
| **Stats/data** | Geist Mono | 600 | `text-2xl` → `text-4xl` | `leading-none` (1.0) | `tracking-tight` | "500+", "$12,500" |
| **Code/technical** | Geist Mono | 400 | `text-sm` | `leading-normal` | normal | Part numbers, dimensions |

**Key change from current:** Reduce max heading size from `text-7xl` to `text-6xl`. Current H1 is too large on desktop, creates visual imbalance.

### 5.3 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| Section padding (vertical) | `py-16 sm:py-20 lg:py-28` | More generous than current `py-12 lg:py-24` |
| Section padding (horizontal) | `px-4 sm:px-6 lg:px-8` | Unchanged |
| Container max-width | `max-w-7xl mx-auto` | Unchanged (1280px) |
| Card gap | `gap-6 lg:gap-8` | Slightly increased from current `gap-6` |
| Section heading → content gap | `mb-12 sm:mb-16` | Unchanged |
| Stack spacing (within sections) | `space-y-4` to `space-y-6` | Context-dependent |

### 5.4 Border Radius

No change to the radius scale. Keep `--radius: 0.625rem` and all computed variants.

### 5.5 Shadow System

| Level | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards at rest |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards on hover |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Hero image, featured content |
| `shadow-none` | none | Flat sections, trust bar |

---

## 6. Component Inventory

### 6.1 Components to REBUILD (new design, same functionality)

| Component | File | Lines | Change Summary |
|-----------|------|-------|---------------|
| **Header** | `components/header.tsx` | 300 | Remove utility bar. Single-tier sticky nav. Navy background on scroll. Simplified mobile sheet. |
| **Hero** | `components/hero.tsx` | 73 | Split layout (text left + image right). White background. No dark overlay. WhatsApp-first CTA. |
| **ProjectGrid** | NEW `components/project-grid.tsx` | ~90 | 3-column grid replacing `project-carousel.tsx`. Country flags. No carousel logic. |
| **TrustBar** | NEW `components/trust-bar.tsx` | ~50 | Horizontal icon strip (Export Docs, Packing, Air Freight, Ocean Freight). Replaces both `stats-bar.tsx` and `trust-signals.tsx`. |

### 6.2 Components to RESTYLE (keep structure, change classes)

| Component | File | Lines | Change Summary |
|-----------|------|-------|---------------|
| **ServicesGrid** | `components/services-grid.tsx` | 75 | Change `text-blue-600` → `text-teal-500`. Card hover border `border-sky-200`. Icon bg `bg-sky-50`. |
| **ProcessSteps** | `components/process-steps.tsx` | 84 | Step circles: `bg-navy-900` → `bg-slate-900`. Connector line: `bg-sky-200`. Icons: `text-sky-500`. |
| **Footer** | `components/footer.tsx` | 198 | Background: `bg-gray-900` → `bg-slate-950`. Social hover colors: `hover:bg-sky-500`. Link hover: `hover:text-sky-400`. |
| **ContactForm** | `components/contact-form.tsx` | 181 | Submit button: `bg-blue-600` → `bg-sky-500 hover:bg-sky-600`. Focus rings: update to teal. |
| **ContactInfo** | `components/contact-info.tsx` | 97 | Icon backgrounds: `bg-blue-50` → `bg-sky-50`. Icon color: `text-blue-600` → `text-sky-500`. |
| **VideoSection** | `components/video-section.tsx` | 80 | Play button: `bg-blue-600` → `bg-sky-500`. Section label: `text-blue-600` → `text-sky-500`. |
| **FaqAccordion** | `components/faq-accordion.tsx` | 62 | Trigger hover: `text-blue-600` → `text-sky-500`. "View All" link: same swap. |
| **MobileBottomBar** | `components/mobile-bottom-bar.tsx` | 50 | Background: navy. CTA button: teal. Phone button: emerald/green (WhatsApp). |
| **WhatsAppWidget** | `components/whatsapp-widget.tsx` | 97 | Keep green. No change needed (already emerald/green). |
| **ScrollReveal** | `components/scroll-reveal.tsx` | 64 | Reduce offset from 30px → 15px. Keep functionality. |
| **Breadcrumbs** | `components/breadcrumbs.tsx` | ~40 | Link color: `text-blue-600` → `text-sky-500`. |

### 6.3 Components to REMOVE from homepage

| Component | File | Why |
|-----------|------|-----|
| **StatsBar** | `components/stats-bar.tsx` | Replaced by TrustBar. Animated counters are gimmicky. File stays (used elsewhere?), just removed from homepage. |
| **TrustSignals** | `components/trust-signals.tsx` | Merged into TrustBar. Redundant with StatsBar. |
| Calculator CTA (inline) | In `app/page.tsx` lines 36-57 | Move calculator link to nav/pricing page. Standalone blue bar is too heavy. |
| FAQ preview (inline) | In `app/page.tsx` line 68 | Move FAQ to dedicated page only. Homepage doesn't need preview. |

### 6.4 Components UNCHANGED

| Component | File | Reason |
|-----------|------|--------|
| All `components/ui/*.tsx` (19 files) | shadcn/ui primitives | Token changes in `globals.css` propagate automatically via CSS variables |
| `components/cookie-consent.tsx` | Overlay component | Minimal visual footprint, functional |
| `components/google-analytics.tsx` | Script injection | No UI |
| `components/meta-pixel.tsx` | Script injection | No UI |
| `components/attribution-capture.tsx` | UTM tracking | No UI |
| `components/pricing-table.tsx` | Data table | Token propagation handles styling |
| `components/freight-calculator/*.tsx` | Complex wizard | Token propagation handles styling; test manually |
| `components/projects-gallery.tsx` | Projects page gallery | Token propagation + minor class swaps |

---

## 7. Page-by-Page Specifications

### 7.1 Homepage (`app/page.tsx`) — MAJOR CHANGE

**Current:** 11 sections, 100 lines
**Proposed:** 7 sections, ~80 lines

```
CURRENT ORDER                    →  NEW ORDER
─────────────────────────────    ─────────────────────────
1. Hero (full-bleed overlay)     →  1. Hero (split layout, white bg)
2. StatsBar (blue gradient)      →  2. TrustBar (icon strip, gray bg)
3. ServicesGrid (gray bg)        →  3. ServicesGrid (restyled)
4. ProcessSteps                  →  4. ProcessSteps (restyled)
5. ProjectCarousel               →  5. ProjectGrid (3-col, replaces carousel)
6. Calculator CTA (blue bar)     →  6. VideoSection + CTA (combined)
7. VideoSection                  →  7. Contact section (form + info)
8. TrustSignals
9. FaqAccordion
10. Contact section
11. (Footer via layout)
```

**Sections removed from homepage:**
- StatsBar → replaced by TrustBar
- TrustSignals → merged into TrustBar
- Calculator CTA → calculator linked from Pricing nav item and hero secondary CTA
- FaqAccordion → stays on `/faq` page only

**New homepage JSX structure:**

```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ScrollReveal><ServicesGrid /></ScrollReveal>
      <ScrollReveal><ProcessSteps /></ScrollReveal>
      <ScrollReveal><ProjectGrid /></ScrollReveal>
      <ScrollReveal><VideoSection showCta /></ScrollReveal>
      <ScrollReveal>
        {/* Contact section — same structure, restyled */}
        <section id="contact" className="py-16 md:py-28 bg-slate-50">
          ...
        </section>
      </ScrollReveal>
    </>
  );
}
```

### 7.2 Hero Component Specification

**Layout:** 2-column grid on desktop, stacked on mobile

```
┌─────────────────────────────────────────────────────────┐
│  NAV BAR (sticky, single tier)                          │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│  [Section label]         │                              │
│                          │     ┌────────────────────┐   │
│  Professional Machinery  │     │                    │   │
│  Export & Logistics      │     │   REAL MACHINERY   │   │
│                          │     │   PHOTO            │   │
│  We disassemble, pack,   │     │   (rounded-2xl)    │   │
│  and ship heavy...       │     │                    │   │
│                          │     └────────────────────┘   │
│  [Get Quote WhatsApp]    │                              │
│  [Our Services]          │                              │
│                          │                              │
├──────────────────────────┴──────────────────────────────┤
│  TRUST BAR: 📄 Export Docs │ 📦 Packing │ ✈️ Air │ 🚢 Ocean │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `bg-white` (no overlay, no gradient, no background image)
- Padding: `py-16 sm:py-20 lg:py-28`
- Grid: `grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`
- Left column: text content, left-aligned
- Right column: `next/image` with `rounded-2xl shadow-lg`, real photo from `/public/images/`
- Section label: `text-xs sm:text-sm font-medium uppercase tracking-wider text-sky-500`
- H1: `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900`
- Description: `text-lg text-slate-600 leading-relaxed max-w-xl`
- Primary CTA: WhatsApp green button `bg-emerald-600 hover:bg-emerald-700 text-white` with WhatsApp icon
- Secondary CTA: `bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50`
- Image: Aspect ratio natural, `object-cover`, `priority` loading
- **Mobile:** Stack vertically, image below text, `rounded-xl`
- **No scroll indicator chevron** (remove the bounce animation)

### 7.3 Header Component Specification

**Current:** 300 lines, 2-tier (utility bar + nav bar), complex scroll behavior
**Proposed:** ~180 lines, single-tier, simplified scroll

**Desktop:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]     Home  About  Services▾  Projects  Pricing  Contact   [Get Quote →]  │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Position: `fixed top-0 w-full z-50`
- **Top of page:** `bg-transparent` (no background, content shows through)
- **Scrolled (>50px):** `bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50`
- **No hide-on-scroll behavior** — nav always visible (simpler, better for conversion)
- Height: `h-16 lg:h-18`
- Logo: White version at top (transparent bg), dark version on scroll. `h-10 lg:h-12`
- Nav links: `text-sm font-medium`
  - At top: `text-white/90 hover:text-white`
  - On scroll: `text-slate-600 hover:text-slate-900`
- Services dropdown: Simple dropdown (not mega-menu), lists 6 services
- CTA button: `bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold`
- **No utility bar** — remove the blue gradient strip with email/phone

**Mobile:**
- Hamburger icon (top-right)
- Sheet component (right side, `w-80`)
- WhatsApp CTA card at bottom of sheet
- Same color transitions on scroll

### 7.4 TrustBar Component Specification (NEW)

**Replaces:** `StatsBar` + `TrustSignals` (both removed from homepage)

```
┌─────────────────────────────────────────────────────────┐
│  📄 Export Documentation  │  📦 Packing & Compliance  │  ✈️ Air Freight  │  🚢 Ocean Freight  │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `bg-slate-50 border-y border-slate-200`
- Padding: `py-6`
- Grid: `grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8`
- Each item: `flex items-center gap-3`
  - Icon: `h-5 w-5 text-sky-500` (Lucide: FileText, Package, Plane, Ship)
  - Text: `text-sm font-medium text-slate-700`
- **No numbers, no counters, no animations** — just clean icons + labels
- Purpose: Instantly communicate core capabilities without vanity metrics

### 7.5 ProjectGrid Component Specification (NEW)

**Replaces:** `ProjectCarousel` (removed)

**Layout:** 3-column grid, all projects visible

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   [Image]    │  │   [Image]    │  │   [Image]    │
│  ──────────  │  │  ──────────  │  │  ──────────  │
│  Title       │  │  Title       │  │  Title       │
│  Description │  │  Description │  │  Description │
│  🇧🇷 Brazil  │  │  🇰🇷 S.Korea │  │  🇰🇿 Kazakh  │
└──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   ...        │  │   ...        │  │   ...        │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Specifications:**
- Section bg: `bg-white`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Card: `rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow`
- Image: `aspect-[4/3] object-cover` via `next/image`
- Content padding: `p-5`
- Title: `text-lg font-semibold text-slate-900`
- Description: `text-sm text-slate-600 mt-1 line-clamp-2`
- Separator: `border-t border-slate-100 mt-3 pt-3`
- Country: `text-sm text-slate-500` with flag emoji (from content data)
- Data source: `content/projects.ts` (unchanged)
- Show: First 6 projects on homepage, all on `/projects` page
- Bottom link: `"View all projects →"` linking to `/projects`

### 7.6 Footer Component Specification

**Current:** `bg-gray-900`, 4-column, 198 lines
**Proposed:** `bg-slate-950`, 3-column, simplified

```
┌─────────────────────────────────────────────────────────┐
│                       bg-slate-950                       │
│                                                         │
│  [Logo]                Quick Links        Contact        │
│  Description           Home               +1 (641)...   │
│  [FB] [IG] [YT]       About              info@...       │
│                        Services           2107 148th...  │
│                        Projects                         │
│                        Pricing            [Get Quote →]  │
│                        Contact                          │
│                        FAQ                              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  © 2026 Meridian Freight Inc.     Privacy │ Terms       │
└─────────────────────────────────────────────────────────┘
```

**Key changes:**
- Background: `bg-gray-900` → `bg-slate-950`
- Remove the 4th column (Legal + CTA) — merge into other columns
- Social hover: `hover:bg-blue-600` → `hover:bg-sky-500` (Facebook), keep pink for IG, keep red for YT
- Link text: `text-gray-300 hover:text-white` → `text-slate-400 hover:text-sky-400`
- CTA button in footer: `bg-sky-500 hover:bg-sky-600`

### 7.7 Service Pages (`app/services/page.tsx`, `app/services/[slug]/page.tsx`)

**Change scope:** Restyle only — swap color classes

| Element | Current | New |
|---------|---------|-----|
| Page hero gradient | `from-blue-700 to-blue-600` | `from-slate-900 to-slate-800` |
| Hero text accent | `text-blue-100` | `text-sky-300` |
| Section labels | `text-blue-600` | `text-sky-500` |
| CTA buttons | `bg-blue-600` | `bg-sky-500 hover:bg-sky-600` |
| Icon colors | `text-blue-600` | `text-sky-500` |
| Card hover borders | `border-blue-200` | `border-sky-200` |
| Breadcrumb links | `text-blue-600` | `text-sky-500` |

### 7.8 Other Pages (Pricing, About, Projects, FAQ, Contact, Privacy, Terms)

Same pattern as service pages — find-and-replace color classes:

```
blue-50   → sky-50
blue-100  → sky-100
blue-200  → sky-200
blue-500  → sky-500
blue-600  → sky-500 (primary accent)
blue-700  → sky-600 (hover state) or slate-800 (dark sections)
blue-800  → slate-800
blue-900  → slate-900
```

**Exceptions:**
- WhatsApp buttons stay `emerald-600` (green)
- Destructive/error states stay `red-*` (unchanged)
- `from-blue-700 to-blue-600` gradients → `from-slate-900 to-slate-800` (dark sections) or remove gradient entirely

---

## 8. Responsive Specifications

### 8.1 Breakpoints (unchanged)

| Name | Width | Usage |
|------|-------|-------|
| Default | 0px+ | Mobile-first base |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Large desktops |

### 8.2 Key Responsive Behaviors

**Header:**
- Mobile (`< lg`): Hamburger menu → Sheet overlay
- Desktop (`>= lg`): Horizontal nav with dropdown

**Hero:**
- Mobile: Single column, image below text, `rounded-xl`
- Desktop: 2-column grid, image right, `rounded-2xl`

**Services Grid:**
- Mobile: 1 column
- `sm`: 2 columns
- `lg`: 3 columns

**Project Grid:**
- Mobile: 1 column
- `sm`: 2 columns
- `lg`: 3 columns

**Trust Bar:**
- Mobile: 2x2 grid
- `lg`: 4 columns inline

**Contact Section:**
- Mobile: Stacked (form on top, info below)
- `lg`: 2-column grid

**Mobile Bottom Bar:**
- Visible only `< lg`
- Fixed bottom, `bg-slate-900` with teal CTA button
- Main content needs `pb-16 lg:pb-0` (unchanged)

---

## 9. Animation Specifications

### 9.1 Scroll Reveal (KEEP, reduce intensity)

**File:** `components/scroll-reveal.tsx`

| Property | Current | New |
|----------|---------|-----|
| Offset distance | 30px | 15px |
| Duration | 0.5s | 0.4s |
| Easing | `easeOut` | `easeOut` (unchanged) |
| Trigger margin | -50px | -50px (unchanged) |
| Once-only | Yes | Yes (unchanged) |

### 9.2 Hover Effects (KEEP)

| Element | Effect | Change |
|---------|--------|--------|
| Service cards | `hover:-translate-y-1 hover:shadow-md` | Unchanged |
| Buttons | `hover:scale-105` → reduce to `hover:scale-[1.02]` | Subtler scale |
| Social icons | `hover:scale-110` | Unchanged |
| Links | `hover:text-sky-500` | Color swap only |

### 9.3 Animations to REMOVE

| Animation | Component | Reason |
|-----------|-----------|--------|
| `useCountUp` counter | `stats-bar.tsx` | Component removed from homepage |
| `animate-bounce` chevron | `hero.tsx` | Scroll indicator removed |
| Carousel auto-play | `project-carousel.tsx` | Component replaced by grid |

### 9.4 Transitions

All interactive elements should have:
```
transition-colors duration-200     /* color changes */
transition-shadow duration-200     /* shadow changes */
transition-transform duration-200  /* scale/translate */
transition-all duration-300        /* complex state changes (header scroll) */
```

---

## 10. Accessibility Requirements

### 10.1 Color Contrast (WCAG 2.1 AA)

| Combination | Ratio Required | Our Values | Status |
|-------------|---------------|------------|--------|
| `slate-900` on `white` | 4.5:1 | ~15.4:1 | PASS |
| `slate-600` on `white` | 4.5:1 | ~5.7:1 | PASS |
| `slate-500` on `white` | 4.5:1 | ~4.6:1 | PASS (borderline) |
| `sky-500` on `white` | 4.5:1 | ~3.2:1 | FAIL — use only for large text or non-text |
| `white` on `sky-500` | 4.5:1 | ~3.2:1 | FAIL — use `sky-600` (#0284c7) for white text on teal |
| `white` on `slate-900` | 4.5:1 | ~15.4:1 | PASS |
| `sky-400` on `slate-950` | 4.5:1 | ~7.1:1 | PASS |

**Action items:**
- Use `sky-600` (not `sky-500`) when placing white text on teal background (buttons)
- Use `sky-500` only for icons, decorative elements, and large text (>=18px bold)
- For small text links, `sky-600` is accessible on white
- Test with axe DevTools after implementation

### 10.2 Focus Management

- Focus ring: `outline-2 outline-offset-2 outline-sky-500` (update from gray ring)
- Tab order: logical document flow
- Skip-to-content link: keep if present, add if missing
- ARIA labels: maintain all existing carousel ARIA (even though carousel removed, grid doesn't need them)

### 10.3 Semantic HTML

- Heading hierarchy: H1 → H2 → H3 (verify after section removal)
- Landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- Form labels: all inputs must have associated `<label>` (already implemented)

---

## 11. Performance Budget

### 11.1 Lighthouse Targets

| Metric | Target (Desktop) | Target (Mobile) |
|--------|-----------------|-----------------|
| Performance | >= 90 | >= 85 |
| Accessibility | >= 95 | >= 95 |
| Best Practices | >= 95 | >= 95 |
| SEO | >= 95 | >= 95 |
| LCP | < 2.5s | < 3.0s |
| FID / INP | < 100ms | < 200ms |
| CLS | < 0.1 | < 0.1 |

### 11.2 Bundle Impact

| Change | Impact |
|--------|--------|
| Remove `useCountUp` hook | -~1KB |
| Remove carousel auto-play logic | -~2KB |
| Add `project-grid.tsx` (~90 lines) | +~1.5KB |
| Add `trust-bar.tsx` (~50 lines) | +~0.8KB |
| Remove `stats-bar.tsx` from homepage | -~2KB (tree-shaken if not used elsewhere) |
| **Net change** | ~-2.7KB (improvement) |

### 11.3 Image Optimization

- All images via `next/image` with `sizes` prop (unchanged)
- Hero image: `priority` loading (unchanged)
- Project grid images: lazy loading with `loading="lazy"` (default)
- Format: WebP/AVIF auto-negotiation via Vercel Image Optimization (unchanged)

---

## 12. Implementation Plan (Phased)

### Phase 1: Design Tokens & Foundation (Branch: `feat/design-refactor`)

**Estimated scope:** `globals.css` + verify propagation

#### Task 1.1: Create feature branch

**Step 1:** Create branch
```bash
git checkout -b feat/design-refactor
```

**Step 2:** Commit empty to mark start
```bash
git commit --allow-empty -m "chore: start design refactor"
```

#### Task 1.2: Update color tokens in globals.css

**Files:**
- Modify: `app/globals.css:50-83` (`:root` block)

**Step 1:** Replace the `:root` CSS custom properties with the new navy/teal palette

Replace these token values in `:root`:
```css
/* OLD */
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);

/* NEW */
--primary: oklch(0.72 0.15 195);               /* teal/sky-500 */
--primary-foreground: oklch(1 0 0);             /* white */
```

Full `:root` replacement (see Section 5.1 for all values).

**Step 2:** Update `--ring` to match new accent
```css
--ring: oklch(0.72 0.15 195);  /* teal — matches primary */
```

**Step 3:** Run build to verify token propagation
```bash
npm run build
```
Expected: Build succeeds, no errors.

**Step 4:** Run dev server and visually verify shadcn/ui components render with new colors
```bash
npm run dev
```
Check: buttons, inputs, cards, accordion, select, dialog all pick up new token colors.

**Step 5:** Commit
```bash
git add app/globals.css
git commit -m "feat(design): update color tokens to navy/teal palette"
```

#### Task 1.3: Update focus ring color in globals.css

**Files:**
- Modify: `app/globals.css:121` (base layer)

**Step 1:** The `outline-ring/50` utility already uses `--ring`. Since we changed `--ring` to teal in Task 1.2, focus rings will automatically update. Verify by tabbing through a form in dev server.

**Step 2:** Commit (if any manual changes needed)
```bash
git add app/globals.css
git commit -m "feat(design): verify focus ring uses teal accent"
```

---

### Phase 2: Header Rebuild

#### Task 2.1: Rebuild header component

**Files:**
- Modify: `components/header.tsx` (300 lines → ~180 lines)

**Step 1:** Remove the utility bar (the blue gradient strip with Available 24/7, email, phone)

**Step 2:** Simplify to single-tier nav:
- Logo (left)
- Nav links (center): Home, About, Services (dropdown), Projects, Pricing, Contact
- CTA button (right): "Get Quote" with `bg-sky-500`

**Step 3:** Simplify scroll behavior:
- Remove hide-on-scroll (`-translate-y-full` logic)
- Keep: transparent at top → white/95 backdrop-blur on scroll
- Scroll threshold: 50px (reduce from current 100px)

**Step 4:** Update mobile Sheet:
- Remove green contact cards from mobile menu
- Add WhatsApp CTA button at bottom of sheet
- Background: `bg-white`

**Step 5:** Run dev server, test:
- Desktop: nav renders, dropdown works, scroll transition works
- Mobile: hamburger opens sheet, links navigate, CTA works

**Step 6:** Commit
```bash
git add components/header.tsx
git commit -m "feat(header): rebuild as single-tier nav with teal accent"
```

#### Task 2.2: Update layout.tsx for header changes

**Files:**
- Modify: `app/layout.tsx`

**Step 1:** If header height changed, update `<main>` padding-top to account for new fixed header height.

**Step 2:** Commit
```bash
git add app/layout.tsx
git commit -m "feat(layout): adjust main padding for new header height"
```

---

### Phase 3: Hero Rebuild

#### Task 3.1: Rebuild hero as split layout

**Files:**
- Modify: `components/hero.tsx` (73 lines → ~80 lines)

**Step 1:** Replace full-bleed background image with 2-column grid layout:
- Left: text content (label, H1, description, CTAs)
- Right: `next/image` with real machinery photo, `rounded-2xl shadow-lg`

**Step 2:** Update CTAs:
- Primary: "Get a Quote on WhatsApp" → `bg-emerald-600 hover:bg-emerald-700` with MessageCircle icon
- Secondary: "Our Services" → `border border-slate-300 text-slate-700 hover:bg-slate-50`

**Step 3:** Remove scroll indicator (animated bounce chevron at bottom)

**Step 4:** Update background: `bg-white` (no gradient, no overlay, no background image)

**Step 5:** Test responsive:
- Mobile: single column, image below text
- Desktop: 2-column grid

**Step 6:** Commit
```bash
git add components/hero.tsx
git commit -m "feat(hero): rebuild as split layout with WhatsApp-first CTA"
```

---

### Phase 4: New Components (TrustBar + ProjectGrid)

#### Task 4.1: Create TrustBar component

**Files:**
- Create: `components/trust-bar.tsx`

**Step 1:** Create component with 4 icon + label items:
- FileText → "Export Documentation"
- Package → "Packing & Compliance"
- Plane → "Air Freight (7-14 Days)"
- Ship → "Ocean Freight (Container Loads)"

**Step 2:** Style: `bg-slate-50 border-y border-slate-200 py-6`

**Step 3:** Grid: `grid grid-cols-2 lg:grid-cols-4 gap-4`

**Step 4:** Commit
```bash
git add components/trust-bar.tsx
git commit -m "feat(trust-bar): create capability strip component"
```

#### Task 4.2: Create ProjectGrid component

**Files:**
- Create: `components/project-grid.tsx`

**Step 1:** Import projects from `content/projects.ts`

**Step 2:** Render 3-column grid with cards (image, title, description, country flag)

**Step 3:** Accept `limit` prop (default 6 for homepage, undefined for all on `/projects`)

**Step 4:** Add "View all projects →" link at bottom when limit is set

**Step 5:** Test with dev server

**Step 6:** Commit
```bash
git add components/project-grid.tsx
git commit -m "feat(project-grid): create 3-column grid replacing carousel"
```

---

### Phase 5: Homepage Assembly

#### Task 5.1: Restructure homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1:** Update imports — add TrustBar, ProjectGrid; remove StatsBar, ProjectCarousel, TrustSignals, FaqAccordion

**Step 2:** Rearrange sections to new 7-section order:
1. Hero
2. TrustBar
3. ServicesGrid (in ScrollReveal)
4. ProcessSteps (in ScrollReveal)
5. ProjectGrid (in ScrollReveal)
6. VideoSection (in ScrollReveal)
7. Contact section (in ScrollReveal)

**Step 3:** Remove Calculator CTA inline section (lines 36-57)

**Step 4:** Remove FaqAccordion from homepage

**Step 5:** Run build, verify no errors
```bash
npm run build
```

**Step 6:** Commit
```bash
git add app/page.tsx
git commit -m "feat(homepage): restructure to 7 sections with new components"
```

---

### Phase 6: Component Restyling (Color Swaps)

#### Task 6.1: Restyle ServicesGrid

**Files:**
- Modify: `components/services-grid.tsx`

**Step 1:** Find-and-replace color classes:
- `text-blue-600` → `text-sky-500`
- `bg-blue-50` → `bg-sky-50`
- `bg-blue-600` → `bg-sky-500`
- `border-blue-200` → `border-sky-200`
- `group-hover:bg-blue-600` → `group-hover:bg-sky-500`

**Step 2:** Commit
```bash
git add components/services-grid.tsx
git commit -m "feat(services-grid): apply navy/teal color scheme"
```

#### Task 6.2: Restyle ProcessSteps

**Files:**
- Modify: `components/process-steps.tsx`

**Step 1:** Step circles: `bg-blue-600` → `bg-slate-900`
**Step 2:** Connector line: `bg-blue-200` → `bg-sky-200`
**Step 3:** Icons: `text-blue-600` → `text-sky-500`
**Step 4:** Commit
```bash
git add components/process-steps.tsx
git commit -m "feat(process-steps): apply navy/teal color scheme"
```

#### Task 6.3: Restyle Footer

**Files:**
- Modify: `components/footer.tsx`

**Step 1:** Background: `bg-gray-900` → `bg-slate-950`
**Step 2:** Text colors: `text-gray-300` → `text-slate-400`, `text-gray-500` → `text-slate-500`
**Step 3:** Link hover: `hover:text-white` → `hover:text-sky-400`
**Step 4:** Social hover: `hover:bg-blue-600` → `hover:bg-sky-500`
**Step 5:** Separator: `bg-gray-800` → `bg-slate-800`
**Step 6:** Commit
```bash
git add components/footer.tsx
git commit -m "feat(footer): apply slate-950 background with teal accents"
```

#### Task 6.4: Restyle remaining components

**Files (batch):**
- `components/contact-form.tsx`
- `components/contact-info.tsx`
- `components/video-section.tsx`
- `components/faq-accordion.tsx`
- `components/mobile-bottom-bar.tsx`
- `components/breadcrumbs.tsx`
- `components/scroll-reveal.tsx` (reduce offset 30→15)

**Step 1:** Apply color swaps per Section 6.2 table

**Step 2:** In `scroll-reveal.tsx`, change initial offset from 30 to 15:
```tsx
// Change: y: direction === 'up' ? 30 : -30
// To:     y: direction === 'up' ? 15 : -15
```

**Step 3:** Commit
```bash
git add components/contact-form.tsx components/contact-info.tsx components/video-section.tsx components/faq-accordion.tsx components/mobile-bottom-bar.tsx components/breadcrumbs.tsx components/scroll-reveal.tsx
git commit -m "feat(components): apply navy/teal scheme to remaining components"
```

---

### Phase 7: Inner Page Restyling

#### Task 7.1: Restyle service pages

**Files:**
- Modify: `app/services/page.tsx`
- Modify: `app/services/[slug]/page.tsx`

**Step 1:** Hero gradient: `from-blue-700 to-blue-600` → `from-slate-900 to-slate-800`
**Step 2:** All `text-blue-*` → `text-sky-*`
**Step 3:** All `bg-blue-*` → `bg-sky-*` or `bg-slate-*` as appropriate
**Step 4:** Commit
```bash
git add app/services/
git commit -m "feat(services): apply navy/teal scheme to service pages"
```

#### Task 7.2: Restyle remaining pages

**Files (batch):**
- `app/about/page.tsx`
- `app/projects/page.tsx`
- `app/pricing/page.tsx`
- `app/pricing/calculator/page.tsx`
- `app/contact/page.tsx`
- `app/faq/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`

**Step 1:** Apply same color swap pattern across all pages
**Step 2:** On projects page, replace `ProjectCarousel` import with `ProjectGrid` (no limit prop = show all)
**Step 3:** Verify pricing table and calculator render correctly with new token colors
**Step 4:** Commit
```bash
git add app/about/ app/projects/ app/pricing/ app/contact/ app/faq/ app/privacy/ app/terms/
git commit -m "feat(pages): apply navy/teal scheme to all inner pages"
```

---

### Phase 8: Verification & Polish

#### Task 8.1: Full build + lint verification

**Step 1:**
```bash
npm run build
```
Expected: Build succeeds, zero errors, zero warnings.

**Step 2:**
```bash
npm run lint
```
Expected: Zero errors.

**Step 3:** Commit any lint fixes
```bash
git add -A
git commit -m "fix: resolve lint issues from design refactor"
```

#### Task 8.2: Visual QA — every page

**Step 1:** Start dev server
```bash
npm run dev
```

**Step 2:** Manually visit every route and verify:

| Page | URL | Check |
|------|-----|-------|
| Homepage | `/` | 7 sections render, no blue-600 visible, hero split layout works |
| Services overview | `/services` | Hero gradient is slate-900, cards use sky-500 |
| Service: Machinery Packing | `/services/machinery-packing` | Detail page renders, breadcrumbs correct |
| Service: Container Loading | `/services/container-loading` | Same |
| Service: Agricultural | `/services/agricultural` | Same |
| Service: Equipment Sales | `/services/equipment-sales` | Same |
| Service: Documentation | `/services/documentation` | Same |
| Service: Warehousing | `/services/warehousing` | Same |
| Projects | `/projects` | ProjectGrid shows all projects, no carousel |
| Pricing | `/pricing` | Tables render, no blue-600 |
| Calculator | `/pricing/calculator` | Multi-step wizard works, buttons correct color |
| About | `/about` | Content renders, colors correct |
| FAQ | `/faq` | Accordion works, colors correct |
| Contact | `/contact` | Form submits, contact info renders |
| Privacy | `/privacy` | Static content renders |
| Terms | `/terms` | Static content renders |

**Step 3:** Test mobile responsive:
- Resize to 375px width
- Verify header hamburger menu works
- Verify mobile bottom bar renders
- Verify hero stacks correctly
- Verify project grid goes to 1 column
- Verify contact form is usable

**Step 4:** Test form submission:
- Submit contact form with test data
- Verify form validation works (Zod)
- Verify success/error states display correctly

#### Task 8.3: Lighthouse audit

**Step 1:** Run Lighthouse on production build
```bash
npm run build && npm run start
```

**Step 2:** Open Chrome DevTools → Lighthouse → Run audit on:
- Homepage
- Services page
- Contact page

**Step 3:** Verify scores meet targets from Section 11.1

**Step 4:** Fix any flagged issues

#### Task 8.4: Accessibility check

**Step 1:** Install axe DevTools Chrome extension (if not installed)

**Step 2:** Run axe on homepage, services page, contact page

**Step 3:** Fix any critical or serious issues (especially contrast ratios)

**Step 4:** Commit fixes
```bash
git add -A
git commit -m "fix(a11y): resolve accessibility issues from design refactor"
```

#### Task 8.5: Final commit & PR

**Step 1:** Push branch
```bash
git push -u origin feat/design-refactor
```

**Step 2:** Create PR with description referencing this spec

**Step 3:** Deploy preview URL for CEO review

---

## 13. Migration & Rollback Strategy

### 13.1 Branch Strategy

All work on `feat/design-refactor` branch. Main branch untouched until PR approved.

### 13.2 Rollback Plan

If design is rejected after merge:
```bash
git revert <merge-commit-hash>
git push
```

Vercel auto-deploys from main, so revert immediately restores previous design.

### 13.3 Gradual Rollout (Optional)

If CEO wants to A/B test old vs. new:
- Use Vercel Preview URL for new design review
- Only merge to main after explicit approval
- No feature flags needed — this is a wholesale visual change

### 13.4 File Preservation

No files are deleted. Components replaced on homepage (`StatsBar`, `ProjectCarousel`, `TrustSignals`) stay in the codebase — they're just no longer imported by `app/page.tsx`. This allows easy rollback by re-importing them.

---

## 14. Appendix: Research Evidence

### 14.1 Screenshots Captured

| File | Description |
|------|-------------|
| `current-site-hero.png` | Main site hero — full-bleed dark overlay |
| `main-site-stats-services.png` | Blue stats bar + service cards |
| `main-site-services-process.png` | Service cards bottom + process steps |
| `main-site-projects.png` | Project carousel + calculator CTA |
| `lp-site-hero.png` | LP hero — clean split layout |
| `lp-site-categories.png` | LP process steps |
| `lp-site-video-map.png` | LP video + trust bar + map |
| `lp-site-projects.png` | LP project grid |
| `lp-site-cards-faq.png` | LP project cards + FAQ start |
| `lp-site-footer.png` | LP contact section + footer |

### 14.2 Industry Research Sources

- Maersk (maersk.com) — Navy + cyan, mega-menu, client logos
- DSV (dsv.com) — Navy + soft blue, tabbed hero
- C.H. Robinson (chrobinson.com) — Navy gradient, split hero, quantified metrics
- Flexport (flexport.com) — Navy + green, product-focused hero
- 25+ industry design analysis articles (see research agent output)

### 14.3 Current Codebase Metrics

| Metric | Value |
|--------|-------|
| Total pages | 11 (including 6 dynamic service slugs) |
| Major components | 15 files, 1,648 total lines |
| shadcn/ui primitives | 19 components |
| Homepage sections (current) | 11 |
| Homepage sections (proposed) | 7 |
| Color instances to change | ~150 class references across all files |

---

*Document created: 2026-03-18*
*Author: Claude Code (design research + codebase analysis)*
*Status: READY FOR REVIEW*
