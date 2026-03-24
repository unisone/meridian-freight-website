# Meridian Freight Website — Design Report

**Document:** Website Design Principles, Logic & Strategy
**Prepared for:** Alexey Zaytsev, CEO
**Site:** [meridianexport.com](https://meridianexport.com)
**Date:** 2026-03-23
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Context](#2-strategic-context)
3. [Brand Identity](#3-brand-identity)
4. [Design Principles](#4-design-principles)
5. [Information Architecture](#5-information-architecture)
6. [Visual Design System](#6-visual-design-system)
7. [Typography](#7-typography)
8. [Color System](#8-color-system)
9. [Motion & Animation](#9-motion--animation)
10. [Component Architecture](#10-component-architecture)
11. [Content Strategy](#11-content-strategy)
12. [SEO Strategy](#12-seo-strategy)
13. [Conversion & Lead Generation](#13-conversion--lead-generation)
14. [Analytics & Tracking](#14-analytics--tracking)
15. [Technical Architecture](#15-technical-architecture)
16. [Performance Strategy](#16-performance-strategy)
17. [Accessibility](#17-accessibility)
18. [Mobile Strategy](#18-mobile-strategy)

---

## 1. Executive Summary

The Meridian Freight website is a production-grade, conversion-optimized corporate marketing platform for a machinery export and logistics company operating out of Albion, Iowa. It was rebuilt from scratch in March 2026, replacing an aging Create React App (CRA) single-page application with a modern Next.js 16 multi-page architecture.

**Key design goals achieved:**

| Goal | Outcome |
|------|---------|
| SEO visibility | From zero (SPA, invisible to Google) to **10/10 SEO score** |
| Lead generation | Email-gated freight calculator as **hero feature** — no competitor has this |
| Brand credibility | Real operational photography, verified statistics, outcome-focused copy |
| Performance | Static site generation (SSG) — sub-second loads, all green Core Web Vitals |
| Analytics | Full GA4 + Meta Pixel + CAPI + Google Ads tracking with consent mode |
| Mobile experience | Dedicated mobile bottom bar, responsive layouts, touch-optimized CTAs |

**The site serves a single business purpose:** turn website visitors into qualified leads through two primary conversion paths — the contact form and the freight calculator — supported by WhatsApp as the preferred communication channel for international buyers.

---

## 2. Strategic Context

### 2.1 Why the Rebuild

The previous CRA site had four fatal problems:

1. **Zero SEO** — Client-rendered SPAs are invisible to Google. Every competitor with server-rendered pages outranked Meridian.
2. **Dead framework** — CRA has no maintainer, no security patches, no modern tooling.
3. **No tracking** — The old site had zero analytics (no GA4, no Meta Pixel, no conversion tracking). $800+ in ad spend was wasted because the LP's pixel couldn't fire on the main domain.
4. **Narrow positioning** — The LP focused on JD parts for LATAM. The corporate site needed to present the full logistics offering.

### 2.2 Business Positioning

Meridian Freight is positioned as **the full-service machinery export specialist** — not just a shipping company, not just a packing company, but the single partner that handles the entire chain:

```
Equipment Pickup → Dismantling → Packing → Documentation → Shipping → Delivery
```

This "single partner" positioning is reflected in every design decision: the 6-service grid on the homepage, the 4-step process visualization, and the freight calculator that covers the complete cost chain.

### 2.3 Target Audience

| Buyer Persona | Behavior | Design Impact |
|---------------|----------|---------------|
| International farm/construction companies | Price-conscious, need transparent costs | Public pricing table + interactive calculator |
| Equipment dealers & resellers | Compare multiple logistics providers | Service detail pages with SEO-optimized keywords |
| First-time exporters | Anxious about customs, damage, hidden fees | FAQ page, process steps, trust signals |
| Returning customers | Know the process, want quick contact | Persistent WhatsApp widget, phone in header |

### 2.4 Competitive Differentiation

The freight calculator (`/pricing/calculator`) is the **strategic differentiator**. No competitor in the heavy machinery export space offers a public, interactive cost estimator. This creates:

1. **Lead magnet** — Every calculation captures a qualified email with equipment type + destination
2. **Self-service** — Reduces "how much does it cost?" support queries
3. **Data quality** — Calculator leads are the most qualified (they know exactly what they want to ship)
4. **SEO advantage** — Interactive tools earn more engagement and links than static pages
5. **Conversion path** — Calculator → Detailed Quote → WhatsApp → Deal

---

## 3. Brand Identity

### 3.1 Brand Attributes

| Attribute | Expression |
|-----------|------------|
| **Professional** | Clean layouts, Geist Sans typography, consistent spacing, no decorative clutter |
| **Trustworthy** | Verified statistics (500+ exports, 13 years), real photography, transparent pricing |
| **Capable** | 6 distinct services, 27+ destination countries, multi-carrier partnerships |
| **Accessible** | WhatsApp as primary channel (international buyers prefer it), multilingual support (EN/RU/ES/AR) |
| **Efficient** | Process steps showing clear workflow, calculator delivering instant estimates |

### 3.2 Brand Voice

The copy follows an **outcome-focused** approach rather than process description:

| Instead of | We say |
|-----------|--------|
| "We disassemble, pack, and ship" | "Ship $500K equipment without damage or customs delays" |
| "Professional services" | "500+ exports completed. Zero equipment damage claims." |
| "Contact us for pricing" | "Calculate your export cost in 60 seconds" |

### 3.3 Visual Identity

- **Logo:** Meridian Freight wordmark with globe element (white on dark backgrounds, dark on light)
- **Primary brand color:** Sky-500 (#0EA5E9) — the "horizon blue" representing global ocean shipping
- **Photography:** Real operational photos (flat racks at ports, crane lifts, container loading) — never stock photos
- **Icons:** Lucide React — consistent line-weight icon system throughout

### 3.4 Contact Information Governance

All contact information lives in a single source of truth file (`lib/constants.ts`). Components **must** import from there — never hardcode phone numbers, emails, or URLs. This was a critical lesson: the old CRA site hardcoded a different phone number (+1-786-397-3888) in 6 components; the correct number is +1 (641) 516-1616.

```
COMPANY    → name, legalName, tagline, description, foundedYear
CONTACT    → phone, email, whatsappUrl, address, hours
SOCIAL     → facebook, instagram, youtube
SITE       → url, domain, ogImage
STATS      → projectsCompleted (500), yearsExperience (auto-calculated)
WAREHOUSES → Iowa HQ + 6 partner locations (CA, GA, IL, ND, TX, AB)
NAV_ITEMS  → 8 main items + 6 service sub-items
```

---

## 4. Design Principles

### 4.1 Core Principles

The design system is called **"Meridian Horizon"** — subtitled **"Depth Without Lines."** Five principles guide every design decision:

#### 1. Substance Over Style
> A B2B buyer spending $50K+ on equipment shipping doesn't need entertainment — they need confidence. Every element must earn its screen space by communicating value, building trust, or enabling action.

**In practice:** No decorative particles, no floating backgrounds, no typewriter effects. The anti-slop list (documented in the micro-interactions spec) explicitly bans 10 common AI-generated visual gimmicks.

#### 2. Weight and Precision
> Meridian moves heavy machinery across oceans. Animations should feel weighted — elements settle like a container on a dock, not bounce like a UI toy.

**In practice:** All motion uses `ease-decelerate` (arriving/settling), never spring physics. Slide distances are modest (20px), durations are calibrated (500ms entrance, 150ms hover).

#### 3. Progressive Disclosure
> Don't overwhelm. Reveal information as the user scrolls, clicks, or advances through the calculator wizard.

**In practice:** Homepage uses scroll-triggered reveals. FAQ uses accordion expansion. Calculator uses multi-step wizard. Contact info is split across header (phone), footer (full details), and dedicated contact page (map + form).

#### 4. Single Path to Action
> Every page should have one clear next step. Dual CTAs are acceptable (primary + secondary), but the primary action should be visually dominant.

**In practice:** Primary buttons are solid blue (#0EA5E9). Secondary buttons are outlined. WhatsApp buttons are emerald green (#059669) — a separate visual track for the "talk to a human" escape hatch.

#### 5. Mobile-First, Not Mobile-Only
> 60%+ of traffic is mobile (international buyers using WhatsApp links from ads). But desktop visitors (dealers, procurement teams) need full data tables and multi-step forms.

**In practice:** Mobile gets a sticky bottom bar with 3 instant actions (WhatsApp/Phone/Quote). Desktop gets full navigation, side-by-side layouts, and the complete pricing table.

### 4.2 What We Do NOT Do

Explicitly banned patterns (from the Micro-Interactions Spec):

- Floating particles or abstract geometric shapes
- Gradient border glow animations
- Typewriter text effects
- Blob/morph backgrounds
- Infinite marquee scrollers
- Cursor trail effects
- Parallax on every section
- 3D card tilts on hover
- Bouncy spring physics
- Glassmorphism/frosted cards on content areas

---

## 5. Information Architecture

### 5.1 Site Map

```
meridianexport.com/
│
├── /                           Homepage (long-scroll conversion page)
│
├── /services                   Services overview grid
│   ├── /machinery-packing      Dismantling & container packing
│   ├── /container-loading      Loading & export shipping
│   ├── /agricultural           Agricultural equipment specialization
│   ├── /equipment-sales        Sourcing & procurement
│   ├── /documentation          Export documentation & compliance
│   └── /warehousing            Storage & warehousing
│
├── /projects                   Portfolio gallery (8+ case studies)
│
├── /destinations               Destination country pages (27+ countries)
│   └── /[slug]                 Individual country detail
│
├── /equipment                  Equipment type pages (60+ types)
│   └── /[slug]                 Individual equipment detail
│
├── /pricing                    Static pricing table (60+ equipment types)
│   └── /calculator             Freight cost calculator (email-gated lead magnet)
│
├── /blog                       Industry articles
│   └── /[slug]                 Individual blog post
│
├── /about                      Company story, warehouses, differentiators
├── /faq                        20 categorized questions (JSON-LD FAQPage)
├── /contact                    Contact form + info cards
├── /privacy                    Privacy policy
└── /terms                      Terms of service
```

### 5.2 Why Multi-Page (Not SPA)

The decision to use individual routes for each service was critical for SEO. Each service page targets specific long-tail keywords:

| Page | Target Keyword |
|------|---------------|
| `/services/machinery-packing` | "machinery container packing services" |
| `/services/container-loading` | "heavy equipment container loading" |
| `/services/agricultural` | "agricultural equipment export services" |
| `/services/equipment-sales` | "used farm equipment for export" |
| `/services/documentation` | "export documentation services USA" |
| `/services/warehousing` | "equipment storage warehousing USA" |

A single-page SPA can never rank for these individual queries. The multi-page architecture also enables unique `<title>`, `<meta description>`, and JSON-LD structured data per page.

### 5.3 Navigation Architecture

**Desktop:** Horizontal nav with Services dropdown (6 sub-items) + "Get a Quote" CTA button
**Mobile:** Hamburger → Sheet drawer with all nav items

**Navigation items:**
Home → About → Services (dropdown) → Projects → Destinations → Pricing → FAQ → Blog → Contact

### 5.4 Cross-Linking Strategy

Internal linking is designed for SEO juice flow:
- Each service page links to 2-3 related services via `relatedSlugs`
- Service pages include service-specific FAQ entries
- Projects link to their associated service type
- Homepage sections link to their dedicated pages
- FAQ answers link to relevant service pages
- Equipment and destination pages cross-reference each other

---

## 6. Visual Design System

### 6.1 Layout Grid

| Token | Value | Usage |
|-------|-------|-------|
| Max content width | `max-w-7xl` (80rem / 1280px) | All page content |
| Section padding (vertical) | `py-16 md:py-24` (64px → 96px) | Between major sections |
| Container padding (horizontal) | `px-4 sm:px-6 lg:px-8` | Standard content padding |
| Card padding | `p-6 sm:p-8` | Card internal spacing |
| Grid gap | `gap-6` | Consistent across all grids |

### 6.2 Grid Patterns

| Pattern | Breakpoints | Used For |
|---------|------------|----------|
| Single column | `grid-cols-1` (mobile) | All sections on mobile |
| Two column | `sm:grid-cols-2` | Contact (form + info), about page cards |
| Three column | `lg:grid-cols-3` | Services grid, project grid, equipment badges |
| Sidebar layout | `lg:grid-cols-[1fr_400px]` | Calculator (wizard + estimate card) |

### 6.3 Elevation & Depth

The "Depth Without Lines" philosophy means cards and sections create hierarchy through **subtle surface changes** rather than heavy borders:

| Level | Treatment | Usage |
|-------|-----------|-------|
| L0 (base) | `bg-background` (white) | Page background |
| L1 (surface) | `bg-muted` (slate-50) | Alternating sections |
| L2 (card) | `bg-card` + `ghost-border` (1px @ 15% opacity) | Content cards |
| L3 (elevated) | `shadow-lg` + hover lift | Interactive cards on hover |
| L4 (overlay) | `bg-black/15 backdrop-blur-xl` | Modals, drawers |

**Ghost borders:** A custom utility class (`ghost-border`) renders a 1px outline at 15% opacity — visible enough to define boundaries, invisible enough to avoid visual noise.

**Glass utilities:** Three levels for translucent surfaces:
- `.glass` — `bg-white/70 backdrop-blur-xl` (light glass)
- `.glass-heavy` — `bg-white/80 backdrop-blur-xl` (header, popover)
- `.glass-overlay` — `bg-black/15 backdrop-blur-xl` (dark overlay)

### 6.4 Corner Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.625rem` (10px) | Base radius |
| `--radius-sm` | 6px | Small badges, tags |
| `--radius-md` | 8px | Inputs, small buttons |
| `--radius-lg` | 10px | Cards, modals |
| `--radius-xl` | 14px | Large cards, hero CTAs |

### 6.5 Button Hierarchy

| Type | Style | Usage |
|------|-------|-------|
| **Primary** | Solid sky-500, white text, `h-12 px-8`, shadow | Main CTA ("Get a Quote") |
| **Secondary / Outline** | Border only, no fill, `h-10 px-5` | Alternative actions ("Our Services") |
| **WhatsApp** | Solid emerald-600, white text, WhatsApp icon | "Chat on WhatsApp" — separate visual track |
| **Ghost** | No border, no fill, hover: subtle bg | Navigation links, minor actions |
| **Destructive** | Red variant | Not used (no destructive actions on marketing site) |

### 6.6 Dark Sections

Certain sections use a dark gradient background to create visual rhythm and emphasis:
- **Calculator CTA** on homepage — `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- **Bottom CTAs** on interior pages — same dark treatment
- **Trust bar** — white text on dark, creating contrast against the hero

Text in dark sections uses `text-white` for headings, `text-sky-300`/`text-sky-400` for accent text, and `text-slate-300` for body copy.

---

## 7. Typography

### 7.1 Font Stack

| Font | Variable | Usage |
|------|----------|-------|
| **Geist Sans** | `--font-geist-sans` | All UI text — headings, body, navigation, buttons |
| **Geist Mono** | `--font-geist-mono` | Statistics, pricing numbers, technical data, code |

Both fonts are loaded via `next/font/google` — zero layout shift, self-hosted, optimized for performance.

### 7.2 Type Scale

| Element | Mobile | Desktop | Weight | Tracking |
|---------|--------|---------|--------|----------|
| H1 (page hero) | `text-4xl` (36px) | `text-5xl`/`text-6xl` (48-60px) | Bold (700) | `tracking-tight` |
| H2 (section) | `text-3xl` (30px) | `text-4xl`/`text-5xl` (36-48px) | Bold (700) | `tracking-tight` |
| H3 (card title) | `text-lg` (18px) | `text-xl` (20px) | Semibold (600) | Normal |
| Body (primary) | `text-base` (16px) | `text-lg` (18px) | Regular (400) | Normal |
| Body (secondary) | `text-sm` (14px) | `text-base` (16px) | Regular (400) | Normal |
| Caption / meta | `text-xs` (12px) | `text-sm` (14px) | Medium (500) | `tracking-wide` |
| Stat number | `text-4xl` (36px) | `text-5xl` (48px) | Bold (700), `font-mono` | `tracking-tight` |

### 7.3 Line Height

- Headings: `leading-tight` (1.25) — compact, impactful
- Body copy: `leading-relaxed` (1.625) — readable prose
- UI elements: `leading-normal` (1.5) — buttons, labels

### 7.4 Typography Rules

1. **Geist Mono for numbers:** All statistics, pricing figures, ZIP codes, transit times, and weights use `font-mono` to ensure tabular alignment and visual distinction from prose.
2. **No all-caps headings:** Headings use standard capitalization. All-caps is reserved for tiny eyebrow labels above section headings (e.g., "OUR SERVICES").
3. **Max readable width:** Prose blocks constrained to `max-w-2xl` or `max-w-3xl` for comfortable reading length.

---

## 8. Color System

### 8.1 Design System Name: "Meridian Horizon"

The palette uses **oklch color space** (perceptually uniform) defined as CSS custom properties in `globals.css`:

### 8.2 Core Palette

| Role | Color | oklch Value | Hex Reference | Usage |
|------|-------|-------------|---------------|-------|
| **Primary** | Sky-500 | `oklch(0.685 0.169 222.7)` | #0EA5E9 | Brand identity, CTAs, links, focus rings |
| **Secondary (Action)** | Emerald-500 | `oklch(0.696 0.17 162.48)` | #10B981 | WhatsApp buttons, success states |
| **Tertiary (Depth)** | Slate-800 | `oklch(0.208 0.042 265.755)` | #1E293B | Dark sections, text anchor, navy depth |
| **Surface** | Slate-50 | `oklch(0.984 0.003 247.858)` | #F8FAFC | Alternating section backgrounds |
| **Background** | White | `oklch(1 0 0)` | #FFFFFF | Main page background |

### 8.3 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--foreground` | Slate-800 | Primary text color |
| `--muted-foreground` | Slate-500 | Secondary/descriptive text |
| `--border` | Slate-200 | Card borders, dividers |
| `--ring` | Sky-500 | Focus ring (matches primary) |
| `--destructive` | Red | Error states (form validation) |

### 8.4 Chart Colors (Data Visualization)

```
chart-1: Sky-500     (primary blue)
chart-2: Emerald-500 (action green)
chart-3: Deep Sky    (darker blue)
chart-4: Navy        (deep blue)
chart-5: Slate-800   (anchor navy)
```

### 8.5 Color Usage Rules

1. **No dark mode.** This is a corporate marketing site — light theme only. The `.dark` block in `globals.css` exists for shadcn/ui compatibility but is never activated.
2. **Primary color for action.** Sky-500 is reserved for interactive elements: buttons, links, active states, focus rings. Never used as a background fill for large areas.
3. **Emerald is WhatsApp only.** The emerald-600 (#059669) channel is exclusively for WhatsApp CTAs. This creates a distinct visual association — "green button = talk to a human."
4. **Dark sections use slate-900/800/950.** Dark gradient sections create visual rhythm. Text in dark sections: `text-white` (headings), `text-sky-300` (accents), `text-slate-300` (body).
5. **Hover states darken, never lighten.** `hover:bg-primary/90` for buttons, `hover:text-sky-700` for links.

---

## 9. Motion & Animation

### 9.1 Motion Philosophy

The motion system reflects the business: **weighted, directional, precise, purposeful, restrained.**

- **Weighted** — Elements feel like they have mass. Ease-out with deceleration, like a container settling on a dock.
- **Directional** — Motion implies movement along routes: left→right for progress, bottom→up for arrival.
- **Precise** — Clean, mechanical timing. No wobble, no overshoot. Like a calibrated crane.
- **Purposeful** — Every animation communicates state: arrival, change, relationship, or feedback.
- **Restrained** — If you notice the animation, it's too much. B2B buyers want confidence, not entertainment.

### 9.2 Motion Tokens

All animations share these constants (defined in `lib/motion.ts` for JS, `globals.css` for CSS):

| Token | Value | Usage |
|-------|-------|-------|
| `instant` | 75ms | Button press, toggle |
| `fast` | 150ms | Hover states, focus rings |
| `normal` | 300ms | Card transitions, dropdowns |
| `entrance` | 500ms | Scroll reveals, section entrance |
| `slow` | 800ms | Counter animations, timeline draws |

**Easing curves:**

| Curve | Bezier | Usage |
|-------|--------|-------|
| `decelerate` | `(0.0, 0.0, 0.15, 1.0)` | Entering elements (arriving, settling) |
| `accelerate` | `(0.4, 0.0, 1.0, 1.0)` | Exiting elements (departing) |
| `default` | `(0.25, 0.1, 0.25, 1.0)` | General purpose |
| `emphasis` | `(0.16, 1.0, 0.3, 1.0)` | Attention-drawing |
| `interactive` | `(0.25, 1.0, 0.5, 1.0)` | User-initiated actions |

**Stagger delays:**

| Context | Delay per item |
|---------|---------------|
| Grid items | 60ms |
| List items | 40ms |
| Sections | 120ms |

### 9.3 Animation Inventory

| Animation | Where | Trigger | Details |
|-----------|-------|---------|---------|
| **Scroll reveal (slide-up)** | All major sections | Viewport entry (once) | `y: 20 → 0`, 500ms, decelerate ease |
| **Scroll reveal (fade)** | Images, videos | Viewport entry | Opacity only, 500ms |
| **Scroll reveal (scale)** | Accent sections | Viewport entry | `scale: 0.97 → 1`, 500ms |
| **Stagger grid** | Services, projects | Parent in view | 60ms delay per child |
| **Hero cascade** | Homepage hero | Page load | 0s, 0.15s, 0.3s, 0.5s, 0.6s delays |
| **CountUp** | Trust bar stats | In view | Numbers count from 0 to final value |
| **Process line** | Process steps (desktop) | Scroll-linked | Horizontal line draws as user scrolls |
| **Button press** | All buttons | Active state | `scale(0.98)` + shadow reduction, 75ms |
| **Button hover** | All buttons | Hover | `translateY(-1px)` + shadow-md, 150ms |
| **Link underline** | Text links | Hover | Underline slides in from left, 300ms |
| **Card lift** | Service/project cards | Hover | `-translate-y-1` + `shadow-lg`, 150ms |
| **Dropdown** | Nav services menu | Click/hover | `scaleY(0.97 → 1)`, 300ms |
| **Sheet slide** | Mobile nav | Toggle | Slide from right, 300ms |
| **Pulsing rings** | Video play button | Continuous | 2 concentric rings pulsing outward, 3s cycle |
| **Shadow breathe** | WhatsApp widget | Continuous | Subtle shadow pulse, 5s cycle |
| **Nudge right** | Arrow icons on CTAs | Continuous | 4px horizontal nudge, 3s cycle |
| **Shake** | Form error | Validation fail | 3px horizontal shake, 300ms |
| **Draw checkmark** | Form success | Submit success | SVG path draw, animated stroke-dashoffset |

### 9.4 Accessibility: Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

JS-side: the `ScrollReveal` component checks `useInView` with `once: true` and uses instant opacity transitions when reduced motion is active.

---

## 10. Component Architecture

### 10.1 Component Hierarchy

```
Root Layout (layout.tsx)
├── ScrollProgress              Thin progress bar at top of page
├── Header                      Fixed sticky nav (desktop dropdown + mobile Sheet)
├── [Page Content]              Route-specific content
├── Footer                      6-column responsive grid
├── WhatsAppWidget              Floating emerald button → expandable chat popup
├── MobileBottomBar             Mobile-only sticky 3-button bar (WhatsApp/Phone/Quote)
├── CookieConsent               Consent banner (localStorage-backed)
├── AttributionCapture          UTM/click ID capture (runs once)
├── GoogleAnalytics             GA4 + Consent Mode v2
├── MetaPixel                   Meta Pixel + consent revoke/grant
├── Vercel Analytics            Automatic page views
└── Vercel SpeedInsights        Core Web Vitals
```

### 10.2 Component Inventory (23 Custom Components)

#### Layout & Navigation (4)
| Component | Type | Purpose |
|-----------|------|---------|
| `header.tsx` | Client | Fixed sticky nav, desktop dropdown, mobile Sheet, WhatsApp CTA |
| `footer.tsx` | Server | 6-column grid: services, company, resources, legal, contact, social |
| `mobile-bottom-bar.tsx` | Client | Sticky 3-button bar; hides on scroll down, shows on scroll up |
| `breadcrumbs.tsx` | Server | Semantic breadcrumb navigation with JSON-LD |

#### Hero & Trust (2)
| Component | Type | Purpose |
|-----------|------|---------|
| `hero.tsx` | Server | Full-width hero with staggered cascade animation, 2 CTA buttons |
| `trust-bar.tsx` | Client | 6 statistics with CountUp animation (intersection observer) |

#### Content Sections (6)
| Component | Type | Purpose |
|-----------|------|---------|
| `services-grid.tsx` | Server | 3-column grid of 6 services with StaggerItem hover lift |
| `process-steps.tsx` | Client | 4-step timeline (vertical mobile, horizontal desktop with scroll-linked line) |
| `project-grid.tsx` | Server | 3-column project portfolio with image + 4 metadata tags |
| `pricing-table.tsx` | Client | Searchable/filterable equipment pricing table |
| `video-section.tsx` | Client | YouTube lite-embed (lazy-loaded on play), custom pulsing play button |
| `faq-accordion.tsx` | Client | Expandable FAQ with GA4 tracking on each expansion |

#### Forms & Interaction (3)
| Component | Type | Purpose |
|-----------|------|---------|
| `contact-form.tsx` | Client | 6-field form + honeypot, Zod validation, success animation |
| `contact-info.tsx` | Server | 4 contact cards (WhatsApp/Email/Address/Hours) + social icons |
| `freight-calculator/` | Client | Multi-step wizard: equipment → size → container → ZIP → country → email gate |

#### Animation & Utility (4)
| Component | Type | Purpose |
|-----------|------|---------|
| `scroll-reveal.tsx` | Client | ScrollReveal wrapper (5 variants) + StaggerItem for grids |
| `scroll-progress.tsx` | Client | Optional scroll progress indicator |
| `tracked-contact-link.tsx` | Client | `<a>` wrapper for Server Components; fires GA4 + Pixel on click |
| `attribution-capture.tsx` | Client | UTM/click ID capture on mount |

#### Analytics & Consent (4)
| Component | Type | Purpose |
|-----------|------|---------|
| `google-analytics.tsx` | Client | GA4 gtag init + Consent Mode v2 |
| `meta-pixel.tsx` | Client | Meta Pixel init + consent revoke/grant |
| `cookie-consent.tsx` | Client | Banner + localStorage toggle |
| `whatsapp-widget.tsx` | Client | Floating button → expandable popup with session ref code |

### 10.3 shadcn/ui Components (19 Installed)

```
accordion    alert-dialog   badge         button       card
dialog       dropdown-menu  input         label        navigation-menu
scroll-area  select         separator     sheet        skeleton
table        tabs           textarea      tooltip
```

All live in `components/ui/` as source code (not black-box packages). Styled with Radix primitives + Tailwind, using the `base-nova` variant with `neutral` base color.

### 10.4 Server vs Client Component Strategy

**Default: Server Components.** Only add `'use client'` when the component needs:
- Event handlers (onClick, onSubmit, onChange)
- Browser APIs (IntersectionObserver, localStorage)
- React hooks (useState, useEffect, useInView)
- Animation libraries (motion/react)

**Client boundary pushed as low as possible.** For example, `footer.tsx` is a Server Component but uses `TrackedContactLink` (a thin client wrapper) just for the click tracking on contact links.

---

## 11. Content Strategy

### 11.1 Content Data Architecture

All content lives in typed TypeScript files in the `/content/` directory — not a CMS, not a database, not markdown files. This was a deliberate choice: content changes infrequently (equipment types, routes, FAQs are stable for months), and TypeScript provides compile-time safety.

| File | Records | Exports | Purpose |
|------|---------|---------|---------|
| `services.ts` | 6 | `ServicePage[]`, helpers | Service detail pages with cross-links |
| `projects.ts` | 8+ | `Project[]` | Portfolio case studies with images |
| `pricing.ts` | 40+ | `EquipmentPricing[]`, `deliveryRates[]` | Static pricing reference table |
| `faq.ts` | 20 | `FaqEntry[]`, `homepageFaq` | Categorized FAQ (General, Shipping, Documentation, Pricing) |
| `equipment.ts` | 60+ | `EquipmentType[]` | Equipment type detail pages |
| `destinations.ts` | 27+ | `Destination[]` | Country detail pages |
| `blog.ts` | Multiple | `BlogPost[]` | Blog articles |

### 11.2 Content Type Schemas

Each content type is fully typed with interfaces that enforce required fields:

```typescript
// Service pages include cross-linking and SEO data
interface ServicePage {
  slug: string;           // URL-safe identifier
  title: string;          // Full page title
  shortTitle: string;     // Grid card display name
  description: string;    // Brief (1-2 sentences)
  longDescription: string;// Full service explanation
  icon: string;           // Lucide icon name
  keywords: string[];     // SEO keywords for metadata
  equipmentTypes: string[];// Equipment this service handles
  relatedSlugs: string[]; // Cross-links to related services
  faqs?: FaqEntry[];      // Service-specific FAQ entries
}
```

### 11.3 Copy Principles

Based on the SEO & Copywriting audit (2026-03-18):

1. **Outcome over process** — Headlines communicate what the buyer gets, not what Meridian does
2. **Specific over generic** — "500+ exports to 27 countries" beats "trusted worldwide"
3. **Fear-addressing** — B2B buyers fear equipment damage, customs delays, hidden fees, and lost parts. Copy addresses these directly.
4. **Social proof** — Verified metrics from operations (not fabricated testimonials)
5. **CTA clarity** — Every page ends with a clear next step

### 11.4 Image Strategy

Based on the Image Strategy spec (2026-03-18):

- **Hero:** Real operational photo (JD W260 on Hapag-Lloyd flat rack) — never stock
- **Projects:** Actual equipment photos from Meridian's operations showing carrier branding (Hapag-Lloyd, Maersk, COSCO)
- **Optimization:** All images via `next/image` (WebP conversion, lazy loading, responsive srcset)
- **Hero priority:** `priority` prop + `fetchPriority="high"` for LCP optimization

---

## 12. SEO Strategy

### 12.1 SEO Score: 10/10

The site achieves comprehensive SEO coverage across all dimensions:

### 12.2 Technical SEO

| Feature | Implementation |
|---------|---------------|
| **Sitemap** | Auto-generated via `app/sitemap.ts` — 40+ pages with priorities + change frequencies |
| **Robots.txt** | `app/robots.ts` — allows all, references sitemap |
| **Canonical URLs** | Absolute URLs on all pages via `pageMetadata()` helper |
| **Meta descriptions** | All pages, 120-160 character range |
| **Security headers** | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **IndexNow** | Key verification + bulk submit script for Bing/Yandex instant indexing |
| **Search Console** | Google + Bing verification files |
| **llms.txt** | Model training opt-out |
| **Static generation** | All pages SSG via `generateStaticParams()` — fastest possible TTFB |

### 12.3 Structured Data (JSON-LD)

| Schema Type | Pages | Rich Result |
|-------------|-------|-------------|
| `LocalBusiness` | Homepage (layout) | Business panel in Google |
| `WebSite` | Homepage (layout) | Sitelinks search box |
| `FAQPage` | Homepage, FAQ, service pages | FAQ rich snippets |
| `Service` | Service detail pages | Service markup |
| `Article` | Blog posts | Article rich snippets |
| `ContactPage` | Contact page | Contact information |
| `WebApplication` | Calculator page | App markup |
| `AggregateOffer` | Pricing page | Price range display |
| `VideoObject` | Homepage (video section) | Video rich snippet |
| `BreadcrumbList` | All interior pages | Breadcrumb trail in SERP |
| `ItemList` | Projects page | List markup |

### 12.4 On-Page SEO

Every page receives via `pageMetadata()` helper:
- Unique `<title>` (template: `%s | Meridian Export`)
- Unique `<meta description>` (120-160 characters)
- Keywords array (from service/equipment/destination data)
- Canonical URL (absolute)
- OpenGraph tags (title, description, 1200x630 image)
- Twitter Card tags (summary_large_image)

### 12.5 Content Grouping (GA4)

Pages are assigned to content groups for analytics:
```
Homepage, Services, Equipment, Destinations, Calculator,
Pricing, Projects, About, Contact, FAQ, Blog, Legal
```

---

## 13. Conversion & Lead Generation

### 13.1 Two Primary Conversion Paths

```
Path 1: Contact Form                    Path 2: Freight Calculator
┌─────────────────────┐                ┌──────────────────────────┐
│ Any page → Contact  │                │ Pricing → Calculator     │
│ Form submission     │                │ Multi-step wizard        │
│ → Qualified lead    │                │ → Email gate             │
│ (name, email,       │                │ → Qualified lead         │
│  equipment, message)│                │ (email, equipment,       │
│                     │                │  destination, container) │
│ Value: $500 (GA4)   │                │ Value: $300 (GA4)        │
└─────────────────────┘                └──────────────────────────┘
```

### 13.2 Secondary Conversion: WhatsApp

WhatsApp is the **preferred channel for international buyers** (especially LATAM, Middle East, Central Asia). The site provides 15+ WhatsApp touchpoints:

| Location | Format |
|----------|--------|
| Floating widget (all pages) | Expandable popup with pre-filled message + session ref code |
| Mobile bottom bar | Instant tap-to-chat button |
| Header CTA | Desktop nav button |
| Hero section | Primary/secondary CTA |
| Service page CTAs | Bottom-of-page CTA |
| Calculator results | "Discuss this estimate on WhatsApp" |
| Contact info cards | Contact page |

Each WhatsApp click generates a unique ref code (MF-XXXXX) tracked via `lib/wa-attribution.ts` for conversion attribution.

### 13.3 Lead Pipeline (Server Actions)

Both the contact form and calculator use the same server-side pipeline:

```
1. Client-side Zod validation
2. Submit → Server Action
3. Server-side Zod re-validation
4. Honeypot check (silent success for bots — no error message)
5. Supabase INSERT → leads table (best-effort)
6. Resend email to owner (alex.z@meridianexport.com) — MUST succeed
7. Resend auto-reply to visitor (best-effort)
8. Slack notification → #meridian-email-intake (best-effort)
9. Meta CAPI Lead event with hashed PII (best-effort)
10. Return success + eventId → client fires GA4 + Pixel dedup event
```

### 13.4 Calculator as Lead Magnet

The freight calculator is architecturally the most sophisticated feature:

**Data sources:** Live rates from Supabase (`equipment_packing_rates` + `ocean_freight_rates` tables)

**Calculation engine:** `lib/freight-engine-v2.ts` — 69 unit tests with hand-verified formulas

**Two container types with different routing logic:**
- **40HC** — Equipment routed through Albion, IA → Chicago rail → ocean
- **Flatrack** — Equipment shipped directly to nearest US port (optimized across 4 ports)

**Email gate strategy:** Equipment selection and route visualization are free (Steps 1-5). The detailed cost breakdown is gated behind email capture (Step 6). This ensures the email lead includes complete context (equipment type, size, container, destination).

**Integrity:** Client-side preview is for UX only. On email submission, the server action re-fetches rates from Supabase and re-calculates independently — the client estimate is never trusted.

---

## 14. Analytics & Tracking

### 14.1 Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Client-side web analytics | GA4 (G-W661JN5ED4) | Page views, events, conversions |
| Client-side ad tracking | Meta Pixel | PageView, Lead, Contact events |
| Server-side ad tracking | Meta CAPI | Server-side Lead event (deduped with Pixel) |
| Ad conversion | Google Ads tag | Conversion tracking for leads |
| Platform analytics | Vercel Analytics | Automatic page views |
| Performance | Vercel Speed Insights | Core Web Vitals |

### 14.2 Consent Architecture

Both GA4 and Meta Pixel implement consent mode — scripts **always load**, but default to restricted/cookieless mode:

| Tool | Default State | On Consent Accept | On Consent Decline |
|------|-------------|-------------------|-------------------|
| GA4 | `analytics_storage: denied` (cookieless) | `analytics_storage: granted` | Stays denied |
| Meta Pixel | `fbq('consent', 'revoke')` | `fbq('consent', 'grant')` | Stays revoked |
| Meta CAPI | Always fires (server-side) | No change | No change |

**Critical rule:** The Meta Pixel must **always** load (not be consent-gated at the script level). A previous implementation that only loaded the pixel after consent caused **$811 in wasted ad spend** with zero PageView tracking. The `fbq('consent', 'revoke')` pattern is the correct approach.

Consent stored in `localStorage['cookie-consent']` as `"accepted"` or `"declined"`.

### 14.3 Key Events (Conversions)

| Event | Value | Trigger | Components |
|-------|-------|---------|------------|
| `generate_lead` | $500 | Contact form submit | `contact-form.tsx` |
| `generate_lead` | $300 | Calculator email submit | `calculator-wizard.tsx` |
| `contact_whatsapp` | — | WhatsApp link click | 15+ locations |
| `contact_phone` | — | Phone link click | Header, footer, mobile bar |
| `contact_email` | — | Email link click | Footer, contact info |

### 14.4 Micro-Conversion Events

| Event | Component | Trigger |
|-------|-----------|---------|
| `calculator_start` | Calculator wizard | Equipment selected |
| `calculator_step` | Calculator wizard | Step advance |
| `calculator_complete` | Calculator wizard | Ready for email gate |
| `video_play` | Video section | Play button click |
| `faq_expand` | FAQ accordion | Item opened |
| `cta_click` | Various | CTA button click (with location param) |

### 14.5 UTM Attribution

- **Storage:** 30-day first-party cookie (`mf_attribution`)
- **Fallback:** sessionStorage for backward compatibility
- **Captured:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `msclkid`
- **Sent with:** Every form/calculator submission as metadata

---

## 15. Technical Architecture

### 15.1 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16 (App Router, React 19) |
| Language | TypeScript | 5 (strict mode) |
| Styling | Tailwind CSS | 4 (oklch, `@theme inline`) |
| Components | shadcn/ui | base-nova style, 19 components |
| Animation | motion (formerly framer-motion) | 12.38 |
| Validation | Zod | 4.3 |
| Email | Resend | 6.9 |
| Database | Supabase | REST API (shared with chatbot) |
| Icons | Lucide React | 0.577 |
| Testing | Vitest | 4.1 (69 freight engine tests) |

### 15.2 Rendering Strategy

**All pages are statically generated (SSG)** via `generateStaticParams()`. There are zero server-rendered-on-request pages. Server Actions (contact form, calculator) are serverless functions.

This means:
- Sub-second TTFB worldwide (served from CDN edge)
- Zero server cost for page views
- Build-time validation of all routes

### 15.3 Server Actions vs API Routes

The site uses **Server Actions** for all data mutations (contact form, calculator submission). API routes are only used for:
- WhatsApp click tracking (`/api/track/wa-click`)
- IndexNow verification (`/api/indexnow-verify`)

### 15.4 Environment Variables

| Variable | Service | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email sending | Yes |
| `SUPABASE_URL` | Lead storage + freight rates | No (graceful fallback) |
| `SUPABASE_SERVICE_ROLE_KEY` | Database auth | No |
| `SLACK_BOT_TOKEN` | Slack notifications | No |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | No |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel | No |
| `META_PIXEL_ID` + `META_ACCESS_TOKEN` | Meta CAPI | No |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads | No |
| `INDEXNOW_KEY` + `INDEXNOW_SECRET` | IndexNow | No |

**Graceful degradation:** If Supabase is not configured, the calculator shows "Calculator Unavailable" with contact CTAs. The static pricing table is unaffected.

### 15.5 Deployment

- **Platform:** Vercel (project: `meridian-freight-export`)
- **Domain:** meridianexport.com
- **Auto-deploy:** Push to `main` → automatic production deployment
- **Dependabot:** Auto-merge enabled via GitHub Actions
- **Security headers:** HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy configured in `next.config.ts`

---

## 16. Performance Strategy

### 16.1 Performance Targets

| Metric | Target | Technique |
|--------|--------|-----------|
| LCP | < 2.5s | SSG, `priority` on hero image, `next/image` optimization |
| INP | < 100ms | Minimal client JS, lazy load non-critical components |
| CLS | < 0.1 | `next/image` dimensions, `next/font` (zero layout shift) |
| TTI | < 3s | Static pages, code splitting |
| First Load JS | < 150KB | Tree shaking, dynamic imports |
| Lighthouse | 90+ all categories | Semantic HTML, ARIA, performance optimization |

### 16.2 Key Optimizations

| Optimization | Implementation |
|-------------|---------------|
| Static generation | All pages SSG — served from CDN edge |
| Image optimization | `next/image` with WebP, lazy loading, responsive `sizes` |
| Font optimization | `next/font/google` (Geist) — self-hosted, zero CLS |
| Video lazy-load | YouTube iframe only loads on play button click (not on page load) |
| Code splitting | `'use client'` boundary pushed as low as possible |
| Bundle size | Tree-shaking via Turbopack, no unused shadcn components imported |
| CSS performance | Tailwind v4 with JIT — only used classes in output |
| Animation performance | GPU-accelerated transforms only (translate, scale, opacity) |

---

## 17. Accessibility

### 17.1 Standards

The site targets **WCAG 2.1 AA** compliance:

| Area | Implementation |
|------|---------------|
| **Semantic HTML** | `<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>` landmarks |
| **ARIA labels** | All icon-only buttons, interactive elements, and navigation items labeled |
| **Focus management** | shadcn/ui Radix primitives provide built-in focus rings and keyboard navigation |
| **Keyboard navigation** | Full keyboard support for nav, accordion, forms, modals (Escape to close) |
| **Color contrast** | Slate-800 on white (text) meets 4.5:1 minimum ratio |
| **Form labels** | Explicit `<Label htmlFor>` on all form inputs |
| **Reduced motion** | Global `prefers-reduced-motion` override disables all animations |
| **Skip links** | Header includes keyboard-accessible skip navigation |
| **Image alt text** | All `next/image` components include descriptive `alt` attributes |

---

## 18. Mobile Strategy

### 18.1 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| **Mobile** | < 640px | Single column, stacked sections, hamburger nav, mobile bottom bar |
| **Tablet** | 640-1023px | 2-column grids, collapsible nav |
| **Desktop** | 1024px+ | Full 3-column grids, horizontal nav, side-by-side layouts |

### 18.2 Mobile-Specific Components

| Component | Behavior |
|-----------|----------|
| **Mobile Bottom Bar** | Sticky 3-button bar (WhatsApp / Phone / Get Quote). Hides on scroll down, shows on scroll up. Hidden on `lg:` and above. |
| **Header (mobile)** | Hamburger → Sheet drawer sliding from right with all nav items |
| **WhatsApp Widget** | Same on all sizes but positioned above mobile bottom bar |
| **Footer** | Stacks from 6 columns to single column on mobile |

### 18.3 Touch Optimizations

- All tap targets minimum 44x44px (Apple HIG compliance)
- WhatsApp/Phone buttons are `h-12 px-8` (48px height)
- Bottom bar buttons span full width in 3-column grid
- Form inputs are `h-10` minimum with generous touch padding

---

## Appendix A: File Structure

```
meridian-freight-website/
├── app/
│   ├── layout.tsx                  Root layout
│   ├── page.tsx                    Homepage (10 sections)
│   ├── globals.css                 Design tokens + animations
│   ├── sitemap.ts                  Auto-generated sitemap
│   ├── robots.ts                   robots.txt
│   ├── actions/                    Server Actions
│   ├── api/                        API routes (tracking)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── pricing/page.tsx
│   ├── pricing/calculator/page.tsx
│   ├── projects/page.tsx
│   ├── services/[slug]/page.tsx
│   ├── equipment/[slug]/page.tsx
│   ├── destinations/[slug]/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── ui/                         19 shadcn/ui primitives
│   ├── header.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── trust-bar.tsx
│   ├── services-grid.tsx
│   ├── process-steps.tsx
│   ├── project-grid.tsx
│   ├── video-section.tsx
│   ├── faq-accordion.tsx
│   ├── contact-form.tsx
│   ├── contact-info.tsx
│   ├── scroll-reveal.tsx
│   ├── pricing-table.tsx
│   ├── freight-calculator/         Multi-step calculator wizard
│   ├── whatsapp-widget.tsx
│   ├── mobile-bottom-bar.tsx
│   ├── cookie-consent.tsx
│   ├── google-analytics.tsx
│   ├── meta-pixel.tsx
│   └── tracked-contact-link.tsx
├── content/
│   ├── services.ts                 6 service detail pages
│   ├── projects.ts                 Portfolio case studies
│   ├── pricing.ts                  Static pricing reference
│   ├── faq.ts                      20 FAQ entries
│   ├── equipment.ts                60+ equipment types
│   ├── destinations.ts             27+ countries
│   └── blog.ts                     Blog articles
├── lib/
│   ├── constants.ts                Single source of truth (contact, company, URLs)
│   ├── motion.ts                   Animation tokens
│   ├── tracking.ts                 GA4/Pixel/attribution helpers
│   ├── metadata.ts                 pageMetadata() helper
│   ├── schemas.ts                  Zod validation schemas
│   ├── freight-engine-v2.ts        Calculator formulas (69 tests)
│   ├── supabase-rates.ts           Rate fetching
│   ├── meta-capi.ts                Server-side Meta events
│   └── slack.ts                    Slack notifications
├── docs/
│   ├── WEBSITE-DESIGN-REPORT.md    ← This document
│   ├── GA4-DASHBOARD-SPEC.md       Analytics framework
│   ├── MICRO-INTERACTIONS-SPEC.md  Animation guidelines
│   └── plans/                      Design specs and PRDs
└── public/
    ├── og.jpg                      Open Graph image (1200x630)
    ├── images/                     Project photos
    └── logos/                      Company logos
```

## Appendix B: Design Decision Log

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| Framework | Next.js 16 | CRA, Gatsby, Astro | App Router, SSG, Server Actions, Turbopack, Vercel-native |
| Styling | Tailwind CSS 4 | CSS Modules, Styled Components | shadcn-native, oklch colors, JIT compilation |
| Components | shadcn/ui | Material UI, Chakra UI, custom | Source code ownership, Radix accessibility, customizable |
| Animation | motion | CSS-only, GSAP | React-native integration, `useInView`, stagger support |
| Font | Geist | Inter, DM Sans | Vercel default, professional, `next/font` optimized |
| Dark mode | Disabled | Enabled | Corporate marketing site — light theme only |
| CMS | None (TypeScript files) | Sanity, Contentful | Content changes infrequently, compile-time safety |
| Auth | None | Clerk, Auth0 | Public marketing site — no user accounts |
| i18n | English only | Multi-language | Corporate site is English; localized pages are the LP's job |
| Database | Supabase (shared with chatbot) | Separate instance | Same rates, same leads table, unified data |
| Email | Resend | SendGrid, SES | Already verified on meridianexport.com domain |
| Pricing | Public + calculator | Gated behind form | Transparency builds trust; calculator captures qualified leads |
| Contact channel | WhatsApp primary | Email only | International buyers (LATAM, Central Asia, Middle East) prefer WhatsApp |

---

*End of document.*
