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
5. Resend auto-reply to visitor (best-effort)
6. Slack notification (best-effort)
7. Meta CAPI Lead event (best-effort)

### Freight Calculator V2 (Supabase-powered)
The calculator at `/pricing/calculator` uses real freight rates from the shared Supabase database (same as `mf-chatbot-ui`). Key files:
- `lib/freight-engine-v2.ts` — Multi-component calculation engine
- `lib/supabase-rates.ts` — Server-side queries for `equipment_packing_rates` and `ocean_freight_rates` tables
- `app/actions/calculator-data.ts` — Server Action fetches rates on wizard mount
- `app/actions/calculator.ts` — Server Action re-calculates server-side, sends emails/Slack
- `lib/types/calculator.ts` — Types, display labels, country name mappings
- `components/freight-calculator/calculator-wizard.tsx` — 4-step wizard UI

**Calculation formulas (must match chatbot):**
- **40HC Container:** Total = US Inland + Packing & Loading + Ocean Freight
  - Inland = (ZIP → Albion, IA × $6.50/mi) + $1,800 Chicago drayage
  - Packing = `equipment.packing_cost × size` (per_row/per_foot/per_shank/per_bottom)
  - Ocean = `ocean_rate + drayage` (cheapest carrier: HAPAG > Maersk > CMA)
- **Flatrack:** Total = US Inland + Sea Freight & Loading
  - Inland = ZIP → nearest of 4 US ports × $6.50/mi
  - Sea Freight = `ocean_rate + packing_drayage` (packing INCLUDED — no separate charge)
  - NO separate `equipment.packing_cost` for flatrack — `packing_drayage` covers port-side packing

**Graceful degradation:** If `SUPABASE_URL` not configured, shows "Calculator unavailable" with contact CTAs. The `/pricing` static table (from `content/pricing.ts`) is unaffected.

**Old engine (`lib/freight-engine.ts`) is deprecated** — kept only for the static pricing table page and its tests.

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
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel | No |
| `META_ACCESS_TOKEN` | Meta CAPI (server) | No |

## Deployment

Deployed to Vercel (project: `meridian-freight-export`). Pushes to main trigger auto-deploy. Dependabot PRs auto-merge via `.github/workflows/auto-merge-dependabot.yml`.
