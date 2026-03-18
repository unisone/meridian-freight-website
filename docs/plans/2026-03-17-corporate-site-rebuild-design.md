# Meridian Export — Corporate Site Rebuild Design Spec

**Date:** 2026-03-17
**Status:** Draft v2 — review findings incorporated, freight calculator added
**Domain:** meridianexport.com
**Vercel Project:** unisone-projects/meridian-freight-export

---

## 1. Strategic Context

### What exists today
- **CRA SPA** (Create React App, React 18, plain JS) — a single-page site with 13 components
- Zero server rendering = zero SEO
- No TypeScript, no tracking (GA4/Pixel/CAPI), outdated deps (framer-motion v7)
- Last meaningful commit: Feb 11, 2026
- Separate project from the LP at `lp.meridianexport.com`

### Why rebuild now
1. **SEO is table stakes** — a client-rendered SPA is invisible to Google. Every competitor with a server-rendered site outranks us.
2. **CRA is dead** — no maintainer, no security patches, no Turbopack, no streaming.
3. **Full-service positioning** — the LP focuses narrowly on JD parts for LATAM. The corporate site must present the complete logistics offering: packing, shipping, storage, procurement, documentation.
4. **Tracking parity** — the LP has full GA4 + Meta Pixel + CAPI + Google Ads tracking. The main site has none.

### Relationship to LP (Phase strategy)
| Phase | Scope | Timeline |
|-------|-------|----------|
| **Phase 1 (this spec)** | Rebuild `meridianexport.com` as a standalone Next.js 16 app | Now |
| **Phase 2 (future)** | Migrate LP campaign pages into the corporate site under `/parts/[locale]` | After current ad campaigns stabilize |

The LP (`lp.meridianexport.com`) continues running untouched. No ad URLs change. No campaigns disrupted.

---

## 2. Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | Next.js | 16 | App Router, React 19, SSR/SSG, Turbopack, proxy.ts |
| Language | TypeScript | strict | Type safety, IDE support, catch errors at build time |
| Styling | Tailwind CSS | 4 | Latest, shadcn/ui native, oklch colors |
| Components | shadcn/ui | latest (new-york style) | Radix primitives, accessible, fully customizable source |
| Typography | Geist Sans + Geist Mono | latest | Vercel default, professional, optimized via next/font |
| Animations | motion | latest | Scroll animations, micro-interactions (rebranded from framer-motion) |
| Icons | Lucide React | latest | Consistent with LP, tree-shakeable |
| Email | Resend | latest | Already verified on meridianexport.com |
| Database | Supabase | REST API | Lead storage (same instance as LP) |
| Notifications | Slack Bot API | - | #meridian-email-intake channel |
| Validation | Zod | latest | Form validation, server action input validation |
| Analytics | GA4 + Meta Pixel + CAPI + Google Ads | - | Full tracking parity with LP |

### What we're NOT using
- No AI SDK (not an AI product)
- No dark mode (corporate marketing site, light theme)
- No CMS (content changes infrequently, hardcoded is fine)
- No i18n on the corporate site (English only — localized pages are the LP's job)
- No Auth (public marketing site)

---

## 3. Contact Information (Canonical)

| Field | Value | Notes |
|-------|-------|-------|
| Phone | +1 (641) 516-1616 | Primary business line |
| Email (display) | info@meridianexport.com | Shown on website |
| Email (Resend from) | contact@meridianexport.com | Already verified sender |
| Email (notifications to) | alex.z@meridianexport.com | Lead notifications |
| WhatsApp | +1 (641) 516-1616 | Same as phone |
| Address | 2107 148th, Albion, IA, USA | Physical location |
| Facebook | facebook.com/meridianfreight | Existing page |
| Instagram | instagram.com/meridian_logistics_usa | Existing account |
| YouTube | youtube.com/@merifreight_eng | Existing channel |

---

## 4. Information Architecture

### Site Map

```
meridianexport.com/
├── / .......................... Homepage (full-service hero + all sections)
├── /services .................. Services overview
│   ├── /machinery-packing ..... Machinery dismantling & container packing
│   ├── /container-loading ..... Container loading & export shipping
│   ├── /equipment-sales ....... Equipment sales & procurement
│   ├── /agricultural .......... Agricultural equipment specialization
│   ├── /documentation ......... Export documentation & compliance
│   └── /warehousing ........... Equipment storage & warehousing
├── /projects .................. Project portfolio gallery
├── /pricing ................... Equipment pricing tables
│   └── /calculator ............ Freight cost calculator (email-gated) ★ HERO FEATURE
├── /about ..................... Company story, team, locations
├── /faq ....................... Frequently asked questions
├── /contact ................... Contact form + info
├── /privacy ................... Privacy policy
└── /terms ..................... Terms of service
```

### Key architectural decision: Multi-page vs Single-page

**We're going multi-page with individual service routes.** This is critical for SEO — each service page targets specific keywords ("machinery container loading services", "agricultural equipment export", etc.) that a single-page SPA can never rank for. The homepage still has a services overview section that links to individual pages.

### URL design for SEO
- `/services/machinery-packing` (not `/services/1` or `/services?id=packing`)
- Static generation via `generateStaticParams()` — zero server cost, instant loads
- Each page gets unique `<title>`, `<meta description>`, and JSON-LD structured data

---

## 5. Page Designs

### 5.1 Homepage (`/`)

The homepage is a conversion-optimized long-scroll page with distinct sections:

**Section order:**

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Header** | Logo, nav (Home, Services dropdown, Projects, Pricing, About, Contact), "Get Quote" CTA |
| 2 | **Hero** | Full-width bg image (logistics1.jpg), H1: "Professional Machinery Export & Logistics", subtitle, dual CTAs (Get Quote / Our Services) |
| 3 | **Stats Bar** | 4 key metrics: Years in Business, Countries Served, Containers Loaded, Equipment Types |
| 4 | **Services Overview** | 6 service cards with icons, descriptions, "Learn More" links to individual pages |
| 5 | **Process** | 4-step visual flow: Consultation → Equipment Pickup → Packing & Loading → Global Shipping |
| 6 | **Projects** | Carousel of 7 real project case studies with photos (existing images) |
| 7 | **Calculator CTA** | "Estimate Your Freight Cost in 60 Seconds" banner → /pricing/calculator |
| 8 | **Video** | YouTube lite-embed of operations footage (click-to-load, not raw iframe) |
| 9 | **Trust Signals** | Countries served map, warehouse locations, equipment types handled, years in operation |
| 10 | **FAQ** | Top 5-6 questions (collapsible accordion) |
| 11 | **Contact** | Split layout: Form (left) + Contact info (right) |
| 12 | **Footer** | 4-column: Company info + Quick Links + Services + Legal |
| 13 | **WhatsApp Widget** | Floating button (bottom-right) |
| 14 | **Mobile Bottom Bar** | Sticky CTA bar on mobile (WhatsApp + Call + Quote) |

**Hero design direction:**
- Full-width hero image with dark overlay (similar to current, but refined)
- Gradient overlay: `bg-gradient-to-r from-black/70 to-black/40`
- Badge: "Trusted Worldwide" or similar trust signal
- H1 max-w-4xl, Geist Sans bold
- Two CTAs: primary solid (Get Quote), secondary outline (Our Services)
- Subtle scroll indicator at bottom

### 5.2 Individual Service Pages (`/services/[slug]`)

Each service page follows a consistent template:

1. **Hero** — Service-specific H1, description, bg image, CTA
2. **What We Do** — Detailed description of the service
3. **Process** — Step-by-step flow specific to this service
4. **Equipment Types** — List of equipment we handle for this service
5. **Gallery** — 3-4 photos from real projects
6. **CTA** — "Get a Quote for [Service]" form or link to /contact

Content for each service page comes from the existing Services component data, expanded with SEO-friendly copy.

### 5.3 Projects Page (`/projects`)

- Grid layout (not carousel) — better for browsing
- Filterable by category (Harvesting, Tillage, Construction, etc.)
- Each project card: image, title, equipment type, destination, container type
- Click to expand: full details modal or sheet
- Uses existing 7 project entries + expand as more are available

### 5.4 Pricing Page (`/pricing`)

Migrate the existing PricingTable component with improvements:
- Server-rendered (SEO for "machinery packing prices")
- Three sections: Equipment Pricing, Miscellaneous, Container Delivery Rates
- Searchable + filterable (same as current but with shadcn Table + Input + Select)
- Mobile-responsive accordion (same pattern, better components)
- "Prices updated upon request" disclaimer
- CTA: "Get a Custom Quote"

### 5.5 Freight Calculator (`/pricing/calculator`) — HERO FEATURE

**The killer differentiator.** An interactive, email-gated freight cost estimator that turns pricing curiosity into qualified leads. No competitor in this space has a public calculator.

#### User Flow

```
Step 1: Select Equipment          Step 2: Select Route           Step 3: Email Gate           Step 4: Results
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ Category: [Combines] │    │ From: [Albion, IA]  │    │ Email: [required]   │    │ ✅ Your Estimate    │
│ Type: [S670 Combine] │ →  │ To: [Busan, Korea]  │ →  │ Name: [optional]    │ →  │                     │
│ Weight: ~15,000 kg   │    │                     │    │ Company: [optional] │    │ Packing: $8,250     │
│ Container: 130%      │    │                     │    │ [Get Estimate →]    │    │ Container: $5,925   │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘    │ Total: ~$14,175     │
                                                                                  │                     │
                                                                                  │ [Get Detailed Quote]│
                                                                                  │ [Download PDF]      │
                                                                                  └─────────────────────┘
```

#### Data Sources

The calculator combines two existing data sets — NO new data collection needed:

| Data | Source | Format |
|------|--------|--------|
| Equipment packing costs | `content/pricing.ts` (migrated from CRA PricingTable) | Equipment type → containerized price + container % |
| Container shipping rates | `content/pricing.ts` (migrated from CRA delivery rates) | Route → Line's container / SOC container price |
| Air freight rates (future) | Chatbot Supabase `freight_rates` table | Origin airport → Destination airport → rate/kg brackets |

**Phase 1**: Use the 64 equipment types + 21 shipping routes already hardcoded in the CRA PricingTable. This is the same data shown on `/pricing`, just presented interactively.

**Phase 2 (future)**: Connect to the chatbot's `freight_rates` Supabase table for live air freight calculation with airline-specific brackets, AWB fees, fuel surcharges. The chatbot already has `calculateFreight()` — we'd expose a public read-only API.

#### Architecture

```
components/
├── freight-calculator/
│   ├── calculator-wizard.tsx       # Multi-step form (client component)
│   ├── equipment-selector.tsx      # Step 1: equipment category + type
│   ├── route-selector.tsx          # Step 2: origin + destination
│   ├── email-gate.tsx              # Step 3: email capture
│   ├── estimate-results.tsx        # Step 4: results display
│   └── estimate-pdf.tsx            # PDF generation (optional)
content/
├── pricing.ts                      # Equipment + route data (typed)
app/
├── pricing/
│   ├── calculator/
│   │   └── page.tsx                # Calculator page (SSG shell + client wizard)
│   └── page.tsx                    # Pricing tables page
app/actions/
├── calculator.ts                   # Server Action: validate email → save lead → return estimate
```

#### Email Gate Strategy

The calculator shows equipment and route selection freely (Steps 1-2). The estimate result (Step 4) is gated behind email capture (Step 3). This is the lead generation mechanism.

**On email submission (Server Action):**
1. Validate email with Zod
2. Supabase INSERT → `leads` table with `source: 'calculator'`, equipment type, route, weight
3. Resend notification to `alex.z@meridianexport.com` ("New calculator lead: [equipment] to [destination]")
4. Meta CAPI `Lead` event (with equipment/route as custom data)
5. GA4 `generate_lead` event with `lead_source: 'freight_calculator'`
6. Return the estimate data to display

**Result screen includes:**
- Packing cost estimate (from pricing data)
- Shipping cost estimate (from route data)
- Total range (low–high since container % varies)
- "Get a Detailed Quote" CTA → pre-fills contact form with equipment + route
- "Talk to us on WhatsApp" CTA → pre-filled message with estimate reference

#### SEO Value

The calculator page targets high-intent keywords:
- "freight cost calculator heavy equipment"
- "machinery shipping cost estimator"
- "container loading cost calculator"
- "equipment export shipping rates"

These are keywords with strong commercial intent that the pricing table alone can't rank for (tables aren't interactive, calculators are).

#### Why This Is Elite

1. **Lead magnet** — every calculation captures a qualified email (they know what equipment, where it's going)
2. **Self-service** — reduces "how much does it cost?" support queries
3. **Data quality** — leads from the calculator include equipment type + destination = highly qualified
4. **SEO** — interactive tools earn more links and engagement than static pages
5. **Differentiation** — no competitor has this
6. **Conversion path** — Calculator → Detailed Quote → WhatsApp conversation → Deal

### 5.6 Contact Page (`/contact`)

- Full-page contact experience (not just the homepage section)
- Form: Name, Email, Company, Phone, Equipment Type (dropdown), Message, Honeypot
- Map embed (Google Maps — Albion, IA location)
- Contact cards: Phone, Email, WhatsApp, Address
- Business hours: "Available 24/7"
- Social media links

### 5.6 About Page (`/about`)

- Company story and mission
- Key differentiators (24/7 availability, global network, equipment expertise)
- Locations map (warehouse locations across USA & Canada)
- Team section (if applicable)
- Stats section (reinforcement of homepage stats)

### 5.7 FAQ Page (`/faq`)

- Comprehensive FAQ (expand from current 6 to 15-20 questions)
- Categorized: General, Pricing, Shipping, Documentation, Equipment
- Schema.org FAQPage structured data (rich results in Google)
- Each answer can include links to relevant service pages

---

## 6. Design System

### Color Palette

```
Primary:     Blue-600 (#2563EB) — CTAs, links, active states
Primary-dark: Blue-700 (#1D4ED8) — Hover states
Accent:      Amber/Yellow — Trust badges, highlights (sparingly)
Background:  White (#FFFFFF) — Main content
Surface:     Gray-50 (#F9FAFB) — Alternating sections
Text:        Gray-900 (#111827) — Headings
Text-muted:  Gray-600 (#4B5563) — Body copy
Border:      Gray-200 (#E5E7EB) — Card borders, dividers
Hero overlay: Black/60-70% — Over hero images
```

### Typography (via next/font — zero layout shift)

```
Headings:    Geist Sans, Bold (700), tracking-tight
Body:        Geist Sans, Regular (400), leading-relaxed
Mono:        Geist Mono — pricing numbers, stats, technical data
```

### Component Library (shadcn/ui baseline)

Install on init:
```
button card input label textarea select badge separator skeleton
table tabs accordion dialog alert-dialog sheet dropdown-menu
navigation-menu tooltip scroll-area
```

### Animation System (Motion)

- **Scroll reveal**: fade-up on section enter (IntersectionObserver)
- **Staggered cards**: 50ms stagger on service/project grids
- **Hero**: subtle parallax on background image
- **Stats**: count-up animation on numbers
- **Page transitions**: none (SSG pages, no client-side routing needed)
- **Carousel**: smooth slide transitions on projects

### Responsive Strategy

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<640px) | Single column, stacked sections, mobile bottom bar, hamburger nav |
| Tablet (640-1024px) | 2-column grids, collapsible nav |
| Desktop (1024px+) | Full layout, horizontal nav, side-by-side contact |

---

## 7. Lead Pipeline

Same proven architecture as the LP, in a single Server Action:

```
Form Submit → Server Action (app/actions/contact.ts)
  ├── 1. Validate (Zod schema)
  ├── 2. Honeypot check (reject if 'website' field filled)
  ├── 3. Supabase INSERT (leads table — best-effort)
  ├── 4. Resend email to alex.z@meridianexport.com (must succeed)
  ├── 5. Resend auto-reply to visitor (best-effort)
  └── 6. Slack notify #meridian-email-intake (best-effort)
```

### Form fields
```typescript
{
  name: string;          // required
  email: string;         // required, validated
  company?: string;      // optional
  phone?: string;        // optional
  equipmentType?: string; // optional dropdown (Combine, Tractor, Planter, etc.)
  message: string;       // required
  website: string;       // honeypot (hidden)
  // Auto-captured:
  source_page: string;   // window.location.href
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}
```

### Supabase table
Use the same Supabase instance as the LP. Either share the `leads` table (add a `source` column to distinguish) or create a `corporate_leads` table. Recommendation: share the table with a `source: 'corporate' | 'lp'` discriminator.

---

## 8. Tracking & Analytics

### GA4 (same property as LP)
- Custom events: `generate_lead` (form submit), `contact_whatsapp` (WA click), `contact_phone` (phone click)
- Page views: automatic
- Enhanced measurement: scrolls, outbound clicks, file downloads

### Meta Pixel (same pixel ID: 3521194048053891)
- `PageView`: every page
- `Lead`: form submit (deduped with event_id)
- `Contact`: WhatsApp click (deduped with event_id)
- Consent-gated (same pattern as LP's `components/meta-pixel.tsx`)

### Meta CAPI (server-side)
- `Lead` event on form submit (from Server Action)
- `Contact` event on WhatsApp click (via API route)
- Deduplication via `event_id` (shared with browser pixel)

### Google Ads
- Conversion tracking for form submit + WhatsApp click
- Enhanced Conversions (hashed email/phone from form)

### UTM Capture
- Same `lib/tracking.ts` pattern as LP
- Store in sessionStorage on page load
- Pass through with form submission

---

## 9. SEO Strategy

### Per-page optimization
Every page gets:
- Unique `<title>` (50-60 chars)
- Unique `<meta description>` (150-160 chars)
- `<meta robots>` (index, follow)
- Canonical URL
- OpenGraph + Twitter Card meta

### Structured Data (JSON-LD)
| Page | Schema Type |
|------|-------------|
| Homepage | `Organization` + `LocalBusiness` + `WebSite` |
| Service pages | `Service` + `BreadcrumbList` |
| Projects | `ItemList` of projects |
| FAQ | `FAQPage` (rich results) |
| Pricing | `OfferCatalog` |
| Contact | `LocalBusiness` with `ContactPoint` |

### Technical SEO
- `sitemap.xml` — auto-generated via Next.js `app/sitemap.ts`
- `robots.txt` — via `app/robots.ts`
- `<link rel="canonical">` — on every page
- Image optimization — all images via `next/image` (WebP, lazy loading, responsive)
- Core Web Vitals — target all green (LCP <2.5s, FID <100ms, CLS <0.1)

### Content keywords (target per service page)
| Page | Primary keyword |
|------|----------------|
| /services/machinery-packing | machinery container packing services |
| /services/container-loading | heavy equipment container loading |
| /services/equipment-sales | used farm equipment for export |
| /services/agricultural | agricultural equipment export services |
| /services/documentation | export documentation services USA |
| /services/warehousing | equipment storage warehousing USA |

---

## 10. Environment Variables

```env
# Email (Resend)
RESEND_API_KEY=                          # Same key as LP
NOTIFICATION_EMAIL=alex.z@meridianexport.com
FROM_EMAIL="Meridian Freight <contact@meridianexport.com>"

# Database (Supabase)
SUPABASE_URL=                            # Same instance as LP
SUPABASE_SERVICE_ROLE_KEY=               # Service role (not anon)

# Notifications (Slack)
SLACK_BOT_TOKEN=                         # Same bot as LP
SLACK_FORM_INTAKE_CHANNEL_ID=            # #meridian-email-intake

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=           # GA4 property
NEXT_PUBLIC_META_PIXEL_ID=3521194048053891
META_ACCESS_TOKEN=                       # CAPI token
META_PIXEL_ID=3521194048053891

# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ID=              # AW-XXXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL_LEAD=       # Conversion label for leads
GOOGLE_ADS_CONVERSION_LABEL_CONTACT=    # Conversion label for contacts
```

---

## 11. File Structure

```
meridian-freight-website/          # Reuse existing repo, wipe CRA code
├── app/
│   ├── layout.tsx                 # Root layout (Geist fonts, meta, analytics, TooltipProvider)
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Tailwind v4 @theme inline + CSS variables
│   ├── sitemap.ts                 # Auto-generated sitemap
│   ├── robots.ts                  # Robots.txt
│   ├── not-found.tsx              # Custom 404
│   ├── error.tsx                  # Error boundary (all routes)
│   ├── global-error.tsx           # Root error boundary (catches layout errors)
│   ├── loading.tsx                # Route loading state (skeleton)
│   ├── actions/
│   │   ├── contact.ts             # Server Action: lead pipeline
│   │   └── calculator.ts          # Server Action: email gate → estimate → lead capture
│   ├── api/
│   │   └── track/
│   │       └── wa-click/route.ts  # WhatsApp click tracking (CAPI)
│   ├── services/
│   │   ├── page.tsx               # Services overview
│   │   └── [slug]/
│   │       └── page.tsx           # Individual service (SSG)
│   ├── projects/
│   │   └── page.tsx               # Project portfolio
│   ├── pricing/
│   │   ├── page.tsx               # Pricing tables
│   │   └── calculator/
│   │       └── page.tsx           # ★ Freight calculator (SSG shell + client wizard)
│   ├── about/
│   │   └── page.tsx               # About page
│   ├── faq/
│   │   └── page.tsx               # FAQ page
│   ├── contact/
│   │   └── page.tsx               # Contact page
│   ├── privacy/
│   │   └── page.tsx               # Privacy policy
│   └── terms/
│       └── page.tsx               # Terms of service
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── header.tsx                 # Site header + nav (shadcn NavigationMenu)
│   ├── footer.tsx                 # Site footer (4-column)
│   ├── breadcrumbs.tsx            # Breadcrumb navigation (SEO + UX)
│   ├── hero.tsx                   # Hero section (reusable for homepage + services)
│   ├── stats-bar.tsx              # Statistics bar with count-up
│   ├── services-grid.tsx          # Services card grid
│   ├── process-steps.tsx          # How-we-work flow (new content)
│   ├── project-carousel.tsx       # Projects carousel
│   ├── project-card.tsx           # Individual project card
│   ├── pricing-table.tsx          # Equipment pricing table
│   ├── faq-accordion.tsx          # FAQ with shadcn Accordion
│   ├── contact-form.tsx           # Contact form (client component)
│   ├── contact-info.tsx           # Contact details sidebar
│   ├── trust-signals.tsx          # Trust signals (replaces vaporware testimonials)
│   ├── video-section.tsx          # YouTube lite-embed (click-to-load)
│   ├── whatsapp-widget.tsx        # Floating WhatsApp button + tracking
│   ├── mobile-bottom-bar.tsx      # Sticky mobile CTA bar
│   ├── cookie-consent.tsx         # Cookie consent banner (gates Meta Pixel)
│   ├── meta-pixel.tsx             # Consent-gated Meta Pixel
│   ├── scroll-reveal.tsx          # Scroll animation wrapper (motion)
│   └── freight-calculator/        # ★ Calculator feature
│       ├── calculator-wizard.tsx   # Multi-step form orchestrator
│       ├── equipment-selector.tsx  # Step 1: category + type selection
│       ├── route-selector.tsx      # Step 2: origin + destination
│       ├── email-gate.tsx          # Step 3: email capture
│       └── estimate-results.tsx    # Step 4: results + CTAs
├── content/
│   ├── services.ts                # All service data (typed, with cross-links)
│   ├── projects.ts                # All project data (typed, linked to services)
│   ├── pricing.ts                 # Equipment pricing + shipping routes (typed)
│   └── faq.ts                     # FAQ entries (typed, with service links)
├── lib/
│   ├── utils.ts                   # cn() utility
│   ├── constants.ts               # Contact info, URLs, social links (SINGLE SOURCE OF TRUTH for phone/email)
│   ├── tracking.ts                # GA4 + Pixel + UTM + click IDs (gclid/fbclid)
│   ├── meta-capi.ts               # Server-side Meta CAPI
│   ├── wa-attribution.ts          # WhatsApp ref code generation + Supabase insert
│   ├── slack.ts                   # Slack Bot API helper
│   ├── schemas.ts                 # Zod schemas (contact form, calculator, etc.)
│   └── freight-engine.ts          # Freight calculation logic (equipment + route → estimate)
├── hooks/
│   ├── use-scroll-reveal.ts       # IntersectionObserver for animations
│   └── use-mobile.ts              # Mobile detection
├── public/
│   ├── images/                    # Migrate existing project photos
│   ├── logos/                     # Migrate existing logos
│   ├── og.jpg                     # Default OpenGraph image
│   └── favicon.png                # Favicon
├── next.config.mjs                # Includes security headers + redirects
├── tailwind.config.ts             # Tailwind v4 config
├── tsconfig.json
├── package.json
├── .env.local                     # Local env (gitignored)
├── .env.example                   # Env template
├── components.json                # shadcn/ui config (new-york, radix base)
└── CLAUDE.md                      # Project instructions
```

---

## 12. Content Migration Map

| Current (CRA) | New (Next.js) | Notes |
|----------------|--------------|-------|
| Hero.js | components/hero.tsx | Rebuild with next/image, Geist, better animations |
| Stats.js | components/stats-bar.tsx | Add count-up animation |
| About.js | app/about/page.tsx | Expand into full page |
| Services.js | content/services.ts + multiple pages | Split into 6 individual pages |
| Projects.js | content/projects.ts + app/projects/page.tsx | Grid view + detail modals |
| PricingTable.js | content/pricing.ts + app/pricing/page.tsx | Same data, shadcn Table |
| VideoSection.js | components/video-section.tsx | YouTube lite embed for performance |
| FAQ.js | content/faq.ts + app/faq/page.tsx | Expand to 15-20 questions |
| Contact.js | components/contact-form.tsx + app/contact/page.tsx | Server Action, Zod, tracking |
| WhatsAppWidget.js | components/whatsapp-widget.tsx | Add tracking, CAPI |
| Navbar.js | components/header.tsx | Simplified, services dropdown, shadcn NavigationMenu |
| Footer.js | components/footer.tsx | 4-column layout |
| api/contact.ts | app/actions/contact.ts | Server Action (not API route) |

### Asset migration
- All 11 images from `public/images/` → keep as-is, optimize with next/image
- Logo files from `logos/MF Logos White/` → keep
- Create new OG image for social sharing

---

## 13. Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 2.5s | SSG, next/image, preload hero image |
| FID/INP | < 100ms | Minimal client JS, lazy load non-critical |
| CLS | < 0.1 | next/image dimensions, font preload via next/font |
| TTI | < 3s | Static pages, code splitting |
| Bundle size | < 150KB first load JS | Tree shaking, dynamic imports for pricing table |
| Lighthouse | 90+ all categories | SSR, semantic HTML, proper ARIA |

---

## 14. Redirects

Preserve any existing indexed URLs from the CRA site:

```javascript
// next.config.mjs redirects
// The CRA site is an SPA with hash routes (#services-mf, #about-mf, etc.)
// These don't need redirects since they're client-side anchors.
// But if there were any server-side routes, add them here.
```

---

## 15. Deployment

- **Same Vercel project**: `unisone-projects/meridian-freight-export`
- **Domain**: `meridianexport.com` (already configured)
- **Branch**: Create a `next-rebuild` branch, merge to `main` when ready
- **Framework**: Next.js (auto-detected by Vercel)
- **Build command**: `next build`
- **Output**: Static + Serverless (Server Actions need serverless)

---

## 16. Out of Scope (Phase 2+)

- LP campaign page migration to `/parts/[locale]`
- Equipment catalog / inventory system
- Customer portal / order tracking
- Blog / content marketing
- Multi-language corporate site
- A/B testing
- CRM integration (beyond Supabase lead storage)

---

## Appendix A: Design Review Findings (2026-03-17)

### Critical — Must Resolve Before Implementation

| # | Issue | Impact | Resolution |
|---|-------|--------|------------|
| C1 | **Missing cookie consent banner** — spec says "consent-gated Pixel" but no consent UI component exists. Without it, Meta Pixel never loads. | All Meta tracking broken | Add `components/cookie-consent.tsx` to file structure. Port LP's localStorage-based consent pattern (`CONSENT_KEY = "cookie-consent"`). |
| C2 | **Stats need Alex verification** — current CRA claims "100+ Staff Members" and "99% Satisfaction Rate." If unverifiable, this damages credibility. | Trust/legal risk | **DECISION NEEDED**: Alex to confirm or revise all 4 stat numbers before implementation. |
| C3 | **Pricing page is competitive intelligence** — 64 equipment types with exact dollar amounts + 21 shipping routes. LP does NOT expose pricing. | Competitor advantage | **DECISION NEEDED**: A) Keep public, B) Gate behind "Get Quote" form, C) Remove from corporate site. |
| C4 | **Package name: `motion` not `framer-motion`** — the library rebranded. `framer-motion` is legacy. | Install failure or wrong version | Update tech stack: install `motion` (latest). |
| C5 | **Tailwind v3 + shadcn/ui v4 conflict** — shadcn CLI v4 generates Tailwind v4 syntax (`@theme inline`, oklch). Running with Tailwind 3 requires workarounds. | Build errors, manual fixups | **DECISION NEEDED**: Use Tailwind 4 (cleaner, shadcn-native) or Tailwind 3 (LP compat). Recommend Tailwind 4 — Phase 2 merge can handle the diff. |
| C6 | **Missing error boundary files** — no `error.tsx`, `global-error.tsx`, or `loading.tsx` in file structure. | Ugly error/loading states in production | Add to file structure: `app/error.tsx`, `app/global-error.tsx`, `app/loading.tsx`. |
| C7 | **WhatsApp number mismatch risk** — CRA hardcodes `+17863973888` in 6 components. New site uses `+16415161616`. Any copy-paste carries wrong number. | Leads lost to wrong phone | All WhatsApp URLs must come from `lib/constants.ts` (single source of truth). Never hardcode phone numbers in components. |

### Important — Should Resolve

| # | Issue | Resolution |
|---|-------|------------|
| I1 | **No WhatsApp attribution** — LP has ref code system for WA conversion tracking. Corporate site spec omits it. | Add `lib/wa-attribution.ts`. Describe WA ref flow in lead pipeline section. |
| I2 | **Video embed performance** — raw YouTube iframe = ~800KB. Spec contradicts itself ("lite embed" vs "YouTube embed"). | Use `@lite-youtube/react` or click-to-load pattern. Spec should be explicit. |
| I3 | **Testimonials undefined** — Section 9 has no source content. CRA site has zero testimonials. | Replace with "Trust Signals" section: countries served, equipment types handled, warehouse locations map. Concrete data > missing quotes. |
| I4 | **No internal linking strategy** — service pages don't cross-link. Critical for SEO juice flow. | Each service page links to 2-3 related services. Projects link to their service. FAQ answers link to services. |
| I5 | **Process section needs copywriting** — new content that doesn't exist in CRA. | Flag in migration map as "new content — needs writing." Define 4 steps with icons and descriptions in `content/services.ts`. |
| I6 | **Hero image LCP** — spec mentions "preload" but doesn't specify technique. | Use `priority` prop on `next/image` + `fetchPriority="high"`. Add `<link rel="preconnect">` in layout.tsx for image optimization domain. |
| I7 | **Missing breadcrumbs UI** — structured data exists but no visible breadcrumb component. | Add `components/breadcrumbs.tsx`. Standard for B2B sites, helps both UX and SEO. |
| I8 | **GA4 cross-domain tracking** — shared property between meridianexport.com and lp.meridianexport.com without cross-domain config = duplicate user counting. | Configure cross-domain tracking in GA4 admin: Admin → Data Streams → Configure tag settings → Configure your domains. |
| I9 | **Missing security headers** — no CSP, HSTS, X-Frame-Options in spec. | Add `headers()` config in `next.config.mjs` for standard security headers. |

### Revised File Structure (incorporating fixes)

Added files marked with `← NEW`:

```
app/
├── error.tsx                      ← NEW: Error boundary
├── global-error.tsx               ← NEW: Root error boundary
├── loading.tsx                    ← NEW: Route loading state
├── ...
components/
├── cookie-consent.tsx             ← NEW: Cookie consent banner
├── breadcrumbs.tsx                ← NEW: Breadcrumb navigation
├── ...
lib/
├── wa-attribution.ts              ← NEW: WhatsApp ref code generation
├── ...
```

### Revised Tech Stack (incorporating fixes)

| Change | From | To |
|--------|------|----|
| Animations | framer-motion v12+ | `motion` (latest) |
| Tailwind | v3 (pending decision) | v4 recommended (shadcn-native) |

### Resolved Decisions (from Alex, 2026-03-17)

| Item | Decision | Impact |
|------|----------|--------|
| Stats numbers | **Confirmed accurate**, possibly understated | Use as-is, can increase later |
| Pricing visibility | **Public + go further** — add interactive freight calculator | Major feature addition (Section 5.5) |
| Tailwind version | **Tailwind 4** — all latest/greatest | Updated in tech stack |
| Testimonials | Replaced with **Trust Signals** section (concrete data) | No content dependency |

### Content Still Needed During Implementation

| Item | What's needed | Urgency |
|------|--------------|---------|
| FAQ expansion | Review current 4 FAQs, suggest 10-16 more | During implementation |
| About page content | Company story, warehouse locations list, team info | During implementation |
| Process steps | 4-step workflow descriptions + icons | During implementation (new content) |
| Calculator copy | Headlines, CTAs, email gate messaging | During implementation |
