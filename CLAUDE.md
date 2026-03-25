# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Corporate marketing website for **Meridian Freight Inc.** — a machinery export and logistics company. Live at [meridianexport.com](https://meridianexport.com). Deployed on Vercel.

## Commands

```bash
npm run dev        # Dev server at http://localhost:3000 (Turbopack)
npm run build      # Production build (Next.js static + serverless)
npm run start      # Serve production build locally
npm run lint       # ESLint
npm test           # Vitest unit tests (freight engine)
npm run test:watch # Vitest watch mode
```

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript strict)
- **Tailwind CSS 4** with oklch colors via `@theme inline` in `globals.css`
- **shadcn/ui** (new-york style, Radix primitives) — components in `components/ui/`
- **Geist Sans + Geist Mono** via `next/font/google`
- **motion** (formerly framer-motion) for scroll animations
- **Lucide React** for icons
- **Zod** for form validation
- **Resend** for transactional email
- **Supabase** (REST API) for lead storage + freight rate tables
- **Vitest** for unit testing
- **Slack Bot API** for notifications
- **Sentry** (`@sentry/nextjs`) for error tracking + performance monitoring
- **Structured logging** (`lib/logger.ts`) for JSON-formatted server-side logs

## Architecture

### Routing (16 pages, all SSG)
```
/                          Homepage (long-scroll with all sections)
/services                  Services overview
/services/[slug]           6 individual service pages (generateStaticParams)
/projects                  Project portfolio gallery
/pricing                   Equipment pricing tables
/pricing/calculator        Freight cost calculator (email-gated lead magnet)
/about                     Company story
/faq                       FAQ with JSON-LD FAQPage schema
/contact                   Contact form + info
/privacy                   Privacy policy
/terms                     Terms of service
```

### Key Directories
```
app/                       Next.js App Router pages and layouts
app/actions/               Server Actions (contact form, calculator)
app/api/track/             API routes (WhatsApp click tracking)
components/                Shared components (header, footer, sections)
components/ui/             shadcn/ui primitives
components/freight-calculator/  Multi-step calculator wizard
content/                   Typed content data (services, projects, pricing, FAQ)
lib/                       Utilities, schemas, constants, tracking
hooks/                     Custom React hooks
public/images/             Project photos
public/logos/              Company logos
```

### Path Aliases
- `@/*` maps to project root (e.g., `@/components/ui/button`, `@/lib/utils`)

### Contact Info — Single Source of Truth
All phone numbers, emails, WhatsApp URLs, and social links are in `lib/constants.ts`. Components MUST import from there — never hardcode contact info. The old CRA site hardcoded a different phone number (+1-786-397-3888); the correct number is +1 (641) 516-1616.

### Lead Pipeline (Server Actions)
Contact form and calculator both use Server Actions (not API routes):
1. Validate with Zod (`lib/schemas.ts`)
2. Honeypot check
3. Supabase INSERT → `leads` table (best-effort)
4. Resend email to owner (must succeed)
5. **Return response to user** — steps below run in `after()` (background)
6. Resend auto-reply to visitor (best-effort, background)
7. Slack notification (best-effort, background)
8. Meta CAPI Lead event (best-effort, background)
9. Vercel Analytics server-side `track()` (best-effort, background)

**Background processing:** Steps 6-9 use Next.js `after()` from `next/server` to run after the response is sent. This saves ~700-1300ms of perceived latency. The `after()` callback has the same timeout as the function itself.

### Freight Calculator V2 (Supabase-powered)
The calculator at `/pricing/calculator` uses real freight rates from the shared Supabase database (same as `mf-chatbot-ui`). Key files:
- `lib/freight-engine-v2.ts` — Multi-component calculation engine (authoritative formulas)
- `lib/supabase-rates.ts` — Server-side queries for `equipment_packing_rates` and `ocean_freight_rates` tables
- `app/actions/calculator-data.ts` — Server Action fetches rates on wizard mount
- `app/actions/calculator.ts` — Server Action re-calculates server-side, sends emails/Slack
- `lib/types/calculator.ts` — Types, display labels, country name mappings
- `lib/__tests__/freight-engine-v2.test.ts` — 69 tests including formula verification with hand-calculated values
- `components/freight-calculator/calculator-wizard.tsx` — Multi-step wizard UI
- `components/freight-calculator/calculator-estimate-card.tsx` — Live estimate sidebar/card

#### Calculation Formulas (Definitive — verified by 69 tests)

**INVARIANT: `estimatedTotal = usInlandTransport + packingAndLoading + oceanFreight` (always)**

**40HC Container** — equipment packed at Albion, IA, shipped via Chicago rail to ocean:
```
Total = US Inland Transport + Packing & Loading + Ocean Freight

Inland (with ZIP):
  roadMiles = haversine(ZIP coords → Albion, IA) × 1.3 road factor
  usInlandTransport = round(roadMiles × equipment.delivery_per_mile) + $1,800 Chicago drayage

Inland (no ZIP):
  usInlandTransport = $1,800  (Chicago drayage only)

Packing:
  If packing_unit = "flat":     packingAndLoading = equipment.packing_cost
  If packing_unit = "per_row":  packingAndLoading = equipment.packing_cost × equipmentSize
  If packing_unit = "per_foot": packingAndLoading = equipment.packing_cost × equipmentSize
  (same for per_shank, per_bottom)
  If equipmentSize is null/0:   packingAndLoading = equipment.packing_cost (base only)

Ocean:
  oceanFreight = bestRate.ocean_rate + bestRate.drayage
  Rate selection: filter by origin_port containing "Chicago" + container_type="fortyhc" + destination_country
    → non-Chicago 40HC rates are excluded (they exist in DB but are not used)
    → sort by carrier preference (HAPAG > Maersk > CMA > others)
    → tiebreaker: cheapest (ocean_rate + drayage)
  originPort is always "Chicago, IL"
```

**Flatrack** — equipment shipped directly to nearest US port, packed at port:
```
Total = US Inland Transport + $0 Packing + Sea Freight & Loading

Inland (with ZIP — port optimization):
  For each of 4 ports (Houston, Savannah, Baltimore, Charleston):
    roadMiles = haversine(ZIP coords → port) × 1.3 road factor
    localCost = roadMiles × equipment.delivery_per_mile
    seaCost = rate.ocean_rate + rate.packing_drayage
    total = localCost + seaCost
  Pick cheapest total; carrier preference breaks ties

Inland (no ZIP):
  usInlandTransport = null (excluded from total)
  totalExcludesInland = true

Packing:
  packingAndLoading = 0  (ALWAYS — packing is bundled into packing_drayage)
  equipment.packing_cost is IGNORED for flatrack — do NOT display it

Ocean (Sea Freight & Loading):
  oceanFreight = bestRate.ocean_rate + bestRate.packing_drayage
  Rate selection (no ZIP / fallback): filter by container_type="flatrack" + destination_country
    → sort by carrier preference (HAPAG > Maersk > CMA > others)
    → tiebreaker: cheapest (ocean_rate + packing_drayage)  ← NOT drayage
```

#### Key Constants
| Constant | Value | Used For |
|----------|-------|----------|
| `DRAYAGE_CHICAGO` | $1,800 | Added to 40HC inland for Chicago rail drayage |
| `ROAD_FACTOR` | 1.3 | Haversine → estimated road miles multiplier |
| `ALBION_IA` | 42.1172, -92.9835 | Packing facility coordinates |
| `CARRIER_PREFERENCE` | HAPAG, Maersk, CMA | Sort order (index 0 = most preferred) |
| `FLATRACK_PORTS` | Houston, Savannah, Baltimore, Charleston | Ports evaluated for flatrack routing |

#### Key DB Fields
| Table | Field | Type | Notes |
|-------|-------|------|-------|
| `equipment_packing_rates` | `delivery_per_mile` | number | Per-equipment rate (varies: 2.5–10.0) |
| `equipment_packing_rates` | `packing_cost` | number | Base packing cost (ignored for flatrack) |
| `equipment_packing_rates` | `packing_unit` | enum | flat, per_row, per_foot, per_shank, per_bottom |
| `equipment_packing_rates` | `container_type` | enum | "fortyhc" or "flatrack" |
| `ocean_freight_rates` | `ocean_rate` | number | Base ocean shipping cost |
| `ocean_freight_rates` | `drayage` | number\|null | Port drayage for 40HC (null for flatrack) |
| `ocean_freight_rates` | `packing_drayage` | number\|null | Port packing+drayage for flatrack (null for 40HC) |

#### UI Display Rules
- **40HC**: Show "Packing & Loading" line + "Ocean Freight" label
- **Flatrack**: Hide "Packing & Loading" line (it's $0), show "Sea Freight & Loading" label
- **Flatrack Section 02**: Show "Packing & loading included in sea freight" info message, NOT the packing cost number
- **40HC Section 02 tooltip**: "...at our Albion, IA facility"
- **No ZIP (flatrack)**: Show "Enter US ZIP code for inland transport estimate" note, `totalExcludesInland = true`
- **No ZIP (40HC)**: Show Chicago drayage only ($1,800), note: "Enter ZIP for full estimate"

#### Data Pipeline
```
1. Mount → getCalculatorData() → fetches equipment_packing_rates + ocean_freight_rates from Supabase
2. User selects equipment + size + country + ZIP → calculateFreightV2() runs CLIENT-SIDE (preview)
3. User submits email → submitCalculator() SERVER ACTION:
   a. Zod validation (calculatorV2Schema)
   b. Honeypot check
   c. Re-fetch rates from Supabase (fresh)
   d. Re-calculate server-side (integrity check — client estimate is NOT trusted)
   e. Supabase INSERT → leads table
   f. Resend email to owner (MUST succeed)
   g. Resend auto-reply to visitor (best-effort)
   h. Slack notification (best-effort)
   i. Meta CAPI Lead event (best-effort)
4. Server returns estimate → UI shows detailed line-item breakdown
```

**Graceful degradation:** If `SUPABASE_URL` not configured, shows "Calculator unavailable" with contact CTAs. The `/pricing` static table (from `content/pricing.ts`) is unaffected.

**Old engine (`lib/freight-engine.ts`) is deprecated** — kept only for the static pricing table page and its tests.

#### DB Data Maintenance
**Source of truth for flatrack rates:** PDF rate sheet "Mark Instructions - Shipping" (provides bundled "Sea Freight and loading" totals per route). In the DB, this is split into `ocean_rate` + `packing_drayage`.

**Port-standard packing_drayage (flatrack only):**
| US Port | packing_drayage | Notes |
|---------|----------------|-------|
| Houston, TX | $4,000 | Most common port |
| Savannah, GA | $4,000 | East Coast |
| Baltimore, MD | $5,295 | East Coast, higher due to handling |
| Charleston, SC | $4,000 | East Coast |
| Norfolk, VA | $5,295 | Same class as Baltimore |
| Tacoma, WA | $4,000 | West Coast |

**Non-Chicago 40HC rows (8 rows):** The DB contains 8 `fortyhc` rows from non-Chicago ports (Baltimore, Houston, Savannah, Tacoma) with null `drayage`. The engine filters these out — 40HC always routes through Chicago. These rows exist for potential future "direct-port" option but are NOT used by the current calculator.

**Data completeness (as of 2026-03-20):**
- `ocean_freight_rates`: 142 rows (102 flatrack + 40 40HC), 27 destination countries
- All flatrack rows have: ocean_rate, packing_drayage, transit_time_days, carrier — zero nulls
- All 40HC Chicago rows (32) have: ocean_rate, drayage, transit_time_days — zero nulls
- `equipment_packing_rates`: 35 rows, zero nulls in any calculation field

**When updating rates:** Ensure `packing_drayage` (flatrack) or `drayage` (40HC) is populated — null values produce $0 in the formula, underquoting the customer. Always add `transit_time_days` for new routes.

#### Relationship to Chatbot KZ Calculator
The website V2 engine was ported from `mf-chatbot-ui/lib/kz-calculator/calculate-freight.ts`. The chatbot KZ calculator is a **turnkey delivered-price tool** (US door → KZ city doorstep) while the website calculator covers **US door → ocean destination** only.

**Shared infrastructure (must stay identical):**
- Haversine function (`R = 3959`, same formula)
- ZIP prefix → coordinate tables (35 three-digit + 10 one-digit region entries)
- Road factor: `1.3` (haversine → estimated road miles)
- Albion, IA coordinates: `42.1172, -92.9835`
- Flatrack ports: Houston, Savannah, Baltimore, Charleston (same coordinates)
- Chicago drayage: `$1,800`

**Intentional divergences:**
| Component | Website V2 | Chatbot KZ | Reason |
|-----------|-----------|------------|--------|
| Delivery rate | Per-equipment from DB (`2.5–10.0`) | Flat `$6.50/mi` all equipment | Website has richer Supabase data |
| Ocean rates | Dynamic from `ocean_freight_rates` table | Hardcoded `$12K`/`$18K` for KZ only | Chatbot is KZ-specific; website serves all destinations |
| Packing (40HC) | `packing_cost × size` from DB | Hardcoded `$3,500` | Same reason — dynamic vs fixed |
| Packing (flatrack) | `$0` (bundled into `packing_drayage`) | `$2,500` as separate line | Different categorization, same net cost |
| Carrier selection | HAPAG > Maersk > CMA preference sort | N/A (hardcoded rates) | Website has per-carrier rates |
| KZ customs/inland | Not included | Duty + VAT + broker + Aktau→city delivery | Website scope ends at ocean |
| Currency | USD only | USD + KZT (475 rate) | Chatbot serves KZ buyers directly |

**Chatbot source:** `~/Documents/Projects/Active/mf-chatbot/lib/kz-calculator/calculate-freight.ts`
**Chatbot spec:** `~/Documents/Projects/Active/mf-chatbot/docs/specs/2026-03-17-kz-freight-calculator-v3-spec.md`

### Styling
- **No dark mode** — corporate marketing site, light theme only
- **Design tokens** in `app/globals.css` `:root` block (oklch)
- **shadcn/ui** components use `bg-background`, `text-foreground`, etc.
- Primary brand color: Blue-600 (#2563EB)
- Font: Geist Sans (headings bold, body regular), Geist Mono (stats/pricing numbers)

### Content Data Pattern
Content lives in typed TypeScript files in `content/`:
- `content/services.ts` — 6 services with slugs, descriptions, icons, keywords
- `content/projects.ts` — project case studies with images
- `content/pricing.ts` — Static pricing for `/pricing` table page (deprecated for calculator; DO NOT use for calculations)
- `content/faq.ts` — categorized FAQ entries

### SEO

**Score: 10/10** — fully optimized as of 2026-03-21.

Key features:
- **Sitemap** (`app/sitemap.ts`) — all 40+ pages with priorities + change frequencies
- **Robots.txt** (`app/robots.ts`) — allows all, references sitemap
- **JSON-LD schemas** — LocalBusiness, WebSite, FAQPage, Article, ContactPage, WebApplication, AggregateOffer, VideoObject, BreadcrumbList
- **Open Graph** — 1200x630 static image (`public/og.jpg`), per-page OG title/description
- **Canonical URLs** — absolute URLs on all pages via `pageMetadata()` helper (`lib/metadata.ts`)
- **Meta descriptions** — all pages in 120-160 char range (verified)
- **Security headers** — HSTS, X-Frame-Options, Referrer-Policy, etc. in `next.config.ts`
- **IndexNow** — key verification route (`app/api/indexnow-verify/route.ts`) + rewrite in `next.config.ts` + bulk submit script (`scripts/submit-indexnow.ts`). Requires `INDEXNOW_KEY` env var.
- **Search Console** — Google (`public/google06d7c7c3dca85c23.html`) + Bing (`public/ff99b5ecadb7c3f6bb03c81244f831f3.txt`) verification files
- **llms.txt** — `public/llms.txt` for model training opt-out

### Analytics & Tracking (GA4 + Meta Pixel + CAPI + Vercel Analytics + Sentry)

Full spec: `docs/GA4-DASHBOARD-SPEC.md` | Elite analytics spec: `docs/specs/2026-03-25-vercel-analytics-elite-spec.md`

Two separate GA4 properties under the same Google Analytics account (`Meridian Freight Inc`):

| Property | Stream | Domain | Measurement ID |
|----------|--------|--------|---------------|
| Meridian Export Main Site | Meridian Export Main Site | `meridianexport.com` | `G-W661JN5ED4` |
| Meridian Export LP | Meridian LP | `lp.meridianexport.com` | `G-26XR0YQLK5` |

#### Consent Architecture
Both GA4 and Meta Pixel use consent mode — scripts ALWAYS load, with region-aware defaults:

- **GA4** (`components/google-analytics.tsx`): Consent Mode v2 with region-aware defaults — `analytics_storage` defaults to `granted` globally (tracks all non-EU visitors), overridden to `denied` for 31 EEA/UK/CH countries (GDPR). `ad_storage` defaults to `denied` everywhere until cookie acceptance. Google auto-detects visitor region via the `region` parameter. Upgrades all consent to `granted` on accept
- **Meta Pixel** (`components/meta-pixel.tsx`): `fbq('consent', 'revoke')` by default, upgrades to `fbq('consent', 'grant')` on accept
- **Meta CAPI** (`lib/meta-capi.ts`): Server-side, no consent needed — fires on form/calculator submission
- Cookie consent stored in `localStorage['cookie-consent']` as `"accepted"` or `"declined"`

**IMPORTANT**: The Meta Pixel MUST always load (not be consent-gated). A previous implementation that only loaded the pixel after consent caused $811 in wasted ad spend with zero PageView tracking. The current `fbq('consent', 'revoke')` pattern is the correct approach — it mirrors GA4's Consent Mode.

#### Content Grouping
Set in `gtag('config', ...)` call in `google-analytics.tsx`:
Homepage, Services, Equipment, Destinations, Calculator, Pricing, Projects, About, Contact, FAQ, Blog, Legal

#### Tracking Helpers (`lib/tracking.ts`)
| Function | Purpose |
|----------|---------|
| `trackGA4Event(name, params)` | Fire GA4 custom event |
| `trackPixelEvent(name, params, eventId)` | Fire Meta Pixel event with dedup ID |
| `trackContactClick(type, location)` | Track WhatsApp/phone/email click (GA4 + Pixel + Vercel Analytics) |
| `trackCtaClick(location, text, destination)` | Track CTA button click (GA4 + Vercel Analytics) |
| `trackCalcFunnel(step, params)` | Track calculator funnel step (GA4 + Vercel Analytics) |
| `getGA4ClientId()` | Get GA4 client_id for offline conversion matching |
| `captureAttribution()` | Capture UTM params + click IDs from URL |
| `getAttribution()` | Read stored attribution (cookie → sessionStorage fallback) |
| `generateEventId()` | Unique ID for Pixel/CAPI deduplication |

**UTM storage**: 30-day first-party cookie (`mf_attribution`), with sessionStorage fallback for backward compat.

#### Custom GA4 Events

**Key Events (Conversions):**
| Event | Components | Trigger | Value |
|-------|-----------|---------|-------|
| `generate_lead` | `contact-form.tsx` | Contact form submit | $500 |
| `generate_lead` | `calculator-wizard.tsx` | Calculator email submit | $300 |
| `contact_whatsapp` | All 15 WA link locations | WhatsApp link click | — |
| `contact_phone` | Header, footer, mobile bar, etc. | Phone link click | — |
| `contact_email` | Footer, contact-info, etc. | Email link click | — |

**Micro-Conversion Events:**
| Event | Component | Trigger |
|-------|-----------|---------|
| `calculator_start` | `calculator-wizard.tsx` | Equipment selected |
| `calculator_step` | `calculator-wizard.tsx` | Wizard step advance |
| `calculator_complete` | `calculator-wizard.tsx` | Destination selected (ready for email gate) |
| `video_play` | `video-section.tsx` | Homepage video play button click |
| `faq_expand` | `faq-accordion.tsx` | FAQ accordion item opened |
| `cta_click` | Various | CTA button click (with location param) |

**Meta Pixel Events:**
| Event | Trigger | Consent Required |
|-------|---------|-----------------|
| `PageView` | Every page load | No (fires in revoked mode) |
| `Lead` | Contact/Calculator submit | No (dedup with CAPI) |
| `Contact` | WhatsApp/phone/email clicks | No (fires in revoked mode) |

**Meta CAPI Events (Server-side):**
| Event | Trigger | Data Sent |
|-------|---------|-----------|
| `Lead` | Contact form submit | Hashed email + phone, `lead_source: "corporate_contact_form"` |
| `Lead` | Calculator submit | Hashed email, equipment_type, destination_country, container_type |

#### Vercel Analytics Custom Events
`components/vercel-analytics.tsx` wraps `<Analytics>` from `@vercel/analytics/next` with `beforeSend` locale normalization (strips `/es/` and `/ru/` prefixes so all locales aggregate under the same page).

**Client-side events** (via `track()` from `@vercel/analytics`):
| Event | Component | Trigger |
|-------|-----------|---------|
| `generate_lead` | `contact-form.tsx`, `calculator-wizard.tsx` | Form/calculator submit |
| `contact_click` | via `trackContactClick()` | WhatsApp/phone/email click |
| `cta_click` | via `trackCtaClick()` | CTA button click |
| `calculator_start/step/complete` | via `trackCalcFunnel()` | Calculator funnel steps |

**Server-side events** (via `track()` from `@vercel/analytics/server`):
| Event | Action | Trigger |
|-------|--------|---------|
| `lead_submitted` | `contact.ts` | Contact form submit (in `after()` block) |
| `lead_submitted` | `calculator.ts` | Calculator submit (in `after()` block) |

Only revenue-driving events are mirrored to Vercel Analytics. Micro-events (`video_play`, `faq_expand`) stay in GA4 only.

#### Structured Logging (`lib/logger.ts`)
Server actions use structured JSON logging for Vercel Runtime Logs:
- `startTimer(route)` → returns `{ done(), error() }` with automatic duration measurement
- `log({ level, msg, route, ... })` → outputs `JSON.stringify()` for filtering by level/route/duration
- All server action errors include route, step, and duration in structured format

#### Sentry Error Tracking
- `instrumentation-client.ts` — Client-side init (replays on error, 10% trace sampling)
- `instrumentation.ts` — Server-side init (imports `sentry.server.config.ts` / `sentry.edge.config.ts`)
- `app/global-error.tsx` — Root error boundary with `Sentry.captureException`
- `app/[locale]/error.tsx` — Locale error boundary with `Sentry.captureException`
- `next.config.ts` — Wrapped with `withSentryConfig` for source map upload
- Sentry is dormant if `NEXT_PUBLIC_SENTRY_DSN` is not set

#### TrackedContactLink Component
`components/tracked-contact-link.tsx` — "use client" wrapper for `<a>` tags in Server Components (footer, contact-info, hero). Renders an anchor with `onClick` tracking via `trackContactClick()`. Use this when adding tracked links in Server Components where direct `onClick` handlers aren't available.

**Enhanced Measurement** (enabled in GA4 stream): page views, scrolls, outbound clicks, video engagement, file downloads, form interactions

### Environment Variables

See `.env.example` for the full list. Required in `.env.local`:
| Variable | Service | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email sending | Yes |
| `SUPABASE_URL` | Lead storage + freight rate tables | No (graceful skip; calculator shows "unavailable") |
| `SUPABASE_SERVICE_ROLE_KEY` | Lead storage + freight rate tables | No (graceful skip; calculator shows "unavailable") |
| `SLACK_BOT_TOKEN` | Slack notifications | No (graceful skip) |
| `SLACK_FORM_INTAKE_CHANNEL_ID` | Slack notifications | No (graceful skip) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | No |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (client-side) | No |
| `META_PIXEL_ID` | Meta CAPI (server-side pixel ID) | No |
| `META_ACCESS_TOKEN` | Meta CAPI (server-side auth) | No |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads tag | No |
| `INDEXNOW_KEY` | IndexNow key for Bing/Yandex | No |
| `INDEXNOW_SECRET` | IndexNow API auth secret | No |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console | No |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster | No |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking (client + server) | No (Sentry dormant if unset) |
| `SENTRY_ORG` | Sentry source map upload | No (build-time only) |
| `SENTRY_PROJECT` | Sentry source map upload | No (build-time only) |
| `SENTRY_AUTH_TOKEN` | Sentry source map upload | No (build-time only) |

**IMPORTANT when adding env vars via CLI**: Use `printf 'value' | vercel env add NAME environment` — NOT `echo`. The `echo` command appends a newline (`\n`) that gets embedded in the value and breaks inline JavaScript template literals.

## Deployment

Deployed to Vercel (project: `meridian-freight-export`). Pushes to main trigger auto-deploy. Dependabot PRs auto-merge via `.github/workflows/auto-merge-dependabot.yml`.
