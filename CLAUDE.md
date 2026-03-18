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
- **Supabase** (REST API) for lead storage
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
- `content/pricing.ts` — 64 equipment types + 21 shipping routes
- `content/faq.ts` — categorized FAQ entries

### Environment Variables

See `.env.example` for the full list. Required in `.env.local`:
| Variable | Service | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email sending | Yes |
| `SUPABASE_URL` | Lead storage | No (graceful skip) |
| `SUPABASE_SERVICE_ROLE_KEY` | Lead storage | No (graceful skip) |
| `SLACK_BOT_TOKEN` | Slack notifications | No (graceful skip) |
| `SLACK_FORM_INTAKE_CHANNEL_ID` | Slack notifications | No (graceful skip) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | No |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel | No |
| `META_ACCESS_TOKEN` | Meta CAPI (server) | No |

## Deployment

Deployed to Vercel (project: `meridian-freight-export`). Pushes to main trigger auto-deploy. Dependabot PRs auto-merge via `.github/workflows/auto-merge-dependabot.yml`.
