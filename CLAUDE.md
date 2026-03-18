# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for **Meridian Freight Inc.** — a machinery export and logistics company. Live at [meridianexport.com](https://meridianexport.com). This is a **Create React App** project (not Next.js), deployed on Vercel.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build → build/
npm test           # Jest + React Testing Library (interactive watch mode)
npm test -- --watchAll=false   # Single test run (CI-friendly)
npm test -- --testPathPattern="Contact"  # Run a single test file
```

No linter CLI is configured separately — ESLint runs through `react-scripts` during build.

## Architecture

### Build System
- **Create React App** (`react-scripts 5.0.1`) — no eject, no custom webpack config
- **Tailwind CSS 3** via PostCSS (see `tailwind.config.js`, `postcss.config.js`)
- **No TypeScript** in frontend (all `.js`); the Vercel serverless function is TypeScript (`.ts`)

### Frontend Stack
- **React 18** with hooks (no class components)
- **React Router v6** (`BrowserRouter`) — configured in `src/App.js`
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vercel Analytics** + **Speed Insights** — initialized in `App.js`

### Routing
Currently a single-page site: only `/` is wired in the router (→ `HomePage`). Two standalone page components exist but are **not routed**: `FAQPage.js`, `ProjectsPage.js`.

`HomePage` composes all sections in order: Hero → Stats → About → Services → Projects → PricingTable → VideoSection → FAQ → Contact → WhatsAppWidget.

Navigation is anchor-based (`#services-mf`, `#about-mf`, `#projects`, `#pricing`, `#contact`) with smooth scroll.

### Serverless API
`api/contact.ts` — Vercel Serverless Function (TypeScript, `@vercel/node`). Handles contact form submissions with a 4-step pipeline:
1. Store lead in **Supabase** (best-effort)
2. Send notification email to owner via **Resend** (must succeed)
3. Auto-reply to visitor via **Resend** (best-effort)
4. Notify **Slack** channel (best-effort)

Includes honeypot spam protection and HTML escaping.

### Environment Variables

Required in `.env.local` (never committed):
| Variable | Service | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email sending | Yes |
| `SUPABASE_URL` | Lead storage | No (graceful skip) |
| `SUPABASE_SERVICE_ROLE_KEY` | Lead storage | No (graceful skip) |
| `SLACK_BOT_TOKEN` | Slack notifications | No (graceful skip) |
| `SLACK_CHANNEL_ID` | Slack notifications | No (graceful skip) |

### Styling Conventions

**Tailwind custom tokens** defined in `tailwind.config.js`:
- Colors: `primary-*` (sky blue), `secondary-*` (slate), `accent-*` (yellow)
- Font: Inter (loaded via Google Fonts in `public/index.html`)
- Custom animations: `fade-in`, `slide-up`, `slide-down`

**Reusable component classes** in `src/index.css`:
- `.btn-primary`, `.btn-secondary` — button styles
- `.section-padding` — consistent vertical spacing (`py-16 md:py-24`)
- `.container-custom` — max-width container with responsive padding
- `.gradient-bg`, `.text-gradient` — brand gradient
- `.text-shadow-*` — text shadow utilities for navbar over hero images

### Key Patterns
- Scroll-aware navbar: hides on scroll-down, shows on scroll-up, adapts text color when over light/dark sections
- Section IDs use `-mf` suffix to avoid conflicts (`about-mf`, `services-mf`)
- WhatsApp is a primary contact channel (floating widget + CTA links)
- Contact form captures UTM parameters for marketing attribution

## Deployment

Deployed to Vercel (project: `meridian-freight-export`). Pushes to main trigger auto-deploy. Dependabot PRs auto-merge via `.github/workflows/auto-merge-dependabot.yml`.
