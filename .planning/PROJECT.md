# Meridian Freight Marketing Website

## Vision

Corporate marketing site for **Meridian Freight Inc.** — a machinery export and logistics company. Live at [meridianexport.com](https://meridianexport.com). Deployed on Vercel. The site's job is to convert international buyers (esp. agricultural machinery dealers in Argentina, Russia, Kazakhstan, Spanish-speaking LATAM) into qualified leads via instant freight estimates, contact forms, and WhatsApp.

## Status (2026-05-04)

**Brownfield, in active production.** Site is mature: i18n (en/es/ru, KZ in flight), shadcn/Tailwind 4 design system, Next.js 16 App Router, Supabase-backed freight calculator, full lead pipeline (Resend + Slack + Meta CAPI + GA4 + Vercel Analytics). Codebase map produced via `/gsd-map-codebase` lives at `.planning/codebase/`.

## What's True About This Project (Read These for Context)

- `.planning/codebase/STACK.md` — full dependency inventory
- `.planning/codebase/INTEGRATIONS.md` — Sentry, Vercel, Supabase, Resend, Slack, Meta CAPI, IndexNow
- `.planning/codebase/ARCHITECTURE.md` — RSC + client islands, server actions, freight engine architecture
- `.planning/codebase/STRUCTURE.md` — directory layout
- `.planning/codebase/CONVENTIONS.md` — coding standards, RSC/client boundaries, Tailwind/shadcn patterns
- `.planning/codebase/TESTING.md` — Vitest setup, coverage gaps
- `.planning/codebase/CONCERNS.md` — 24 prioritized debt items (2 high / 10 med / 12 low)
- `CLAUDE.md` — detailed engineering rules, calculator formulas, GA4/Meta CAPI/Sentry setup, deployment SOP
- `AGENTS.md` — agent-facing handoff guide

## Active Milestone

**v1.1 — Calculator wizard hardening + security audit** (this milestone)

Builds on v1.0 cleanup PR (#107: codebase map + v1/v2 calculator decommission + PII guard). v1.1 focuses on the medium-tier debt the codebase map surfaced now that the v1/v2 noise is gone.

## Past Milestones

- **v1.0 (cleanup)** — codebase map, v1+v2 calculator deletion, PII guard, output/ gitignore. Shipped via PR #107.
- **Earlier work** (pre-GSD): KZ buyer hub localization (PR #102), Argentina spec finalization (PR #101), v3 calculator launch, full SEO buildout (10/10 score per `SEO-REPORT-2026-03-19.md`).

## Out of Scope (For Now)

- Full visual redesign (the design system is established and working)
- New service lines beyond machinery export, JD parts export, air freight (these are the three business lines per Meridian Freight notes — only #1 has site coverage today)
- Backend platform changes (Supabase + Resend + Vercel stack is settled)

## Decision Log

- **Canonical calculator URL = `/pricing/calculator`** (v1.0 PR #107). v2/v3-named legacy URLs 308-redirected.
- **`commit_docs: true`** — `.planning/` ships in repo, plans + research travel with the code.
- **Branching strategy = none** — direct branches off main via PR. Per CLAUDE.md SOP.
- **Model profile = balanced** — Opus for planning, Sonnet for execution. Inherits global default.
