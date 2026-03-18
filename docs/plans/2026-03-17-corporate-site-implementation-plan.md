# Meridian Export Corporate Site — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild meridianexport.com as a Next.js 16 corporate site with full tracking, lead pipeline, and freight calculator.

**Architecture:** Next.js 16 App Router with SSG for all pages. Server Actions for form handling. Content in typed TypeScript files (no CMS). shadcn/ui components with Geist fonts and Tailwind v4. Same Supabase/Resend/Slack integrations as the LP.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui (new-york/radix), Geist, motion, Lucide, Resend, Supabase REST, Slack Bot API, Zod, GA4, Meta Pixel/CAPI, Google Ads

**Design Spec:** `docs/plans/2026-03-17-corporate-site-rebuild-design.md`

**Repo:** `meridian-freight-website` (same repo, `next-rebuild` branch)

---

## Phase 1: Foundation (Tasks 1-4)

### Task 1: Create Branch & Wipe CRA

**Files:**
- Delete: `src/`, `build/`, `postcss.config.js`, `tailwind.config.js` (old ones)
- Keep: `.vercel/`, `.git/`, `images/`, `logos/`, `public/images/`, `public/logos/`, `docs/`, `.env.local`

**Step 1: Create the rebuild branch**

```bash
cd /Users/zaytsev/Projects/meridian-freight-website
git checkout -b next-rebuild
```

**Step 2: Remove CRA files (keep assets and config)**

```bash
rm -rf src/ build/ node_modules/ package-lock.json
rm -f postcss.config.js tailwind.config.js
rm -f public/index.html public/manifest.json public/browserconfig.xml public/robots.txt
# Keep: public/images/, public/logos/, public/favicon.png, public/sitemap.xml (will replace)
# Keep: .vercel/, .env.local, .gitignore, docs/
# Keep: images/ and logos/ at root (will migrate to public/)
```

**Step 3: Migrate root-level image assets into public/**

```bash
# Root images/ and logos/ duplicate public/ — consolidate into public/
cp -r images/* public/images/ 2>/dev/null || true
cp -r logos/* public/logos/ 2>/dev/null || true
rm -rf images/ logos/
```

**Step 4: Commit the wipe**

```bash
git add -A
git commit -m "chore: wipe CRA code, preserve assets for Next.js rebuild"
```

---

### Task 2: Initialize Next.js 16 Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Initialize Next.js 16**

```bash
cd /Users/zaytsev/Projects/meridian-freight-website
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --turbopack --yes
```

This creates the base Next.js 16 project with Tailwind v4, TypeScript, ESLint, App Router, Turbopack.

**Step 2: Verify it runs**

```bash
npm run dev
# Visit http://localhost:3000 — should see Next.js default page
```

**Step 3: Commit the scaffold**

```bash
git add -A
git commit -m "feat: initialize Next.js 16 with Tailwind v4 and Turbopack"
```

---

### Task 3: Configure shadcn/ui + Geist Fonts

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/` directory
- Modify: `app/layout.tsx` (fonts), `app/globals.css` (theme)

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d --base radix
```

**Step 2: Fix Geist font after shadcn init**

shadcn/ui may break the Geist font declarations. In `app/globals.css`, inside `@theme inline`, ensure the font variables use literal names (not circular `var(--font-sans)`):

```css
@theme inline {
  --font-sans: "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, monospace;
  /* ... rest of shadcn theme vars ... */
}
```

In `app/layout.tsx`, move font classNames to `<html>`:

```tsx
<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
  <body className="bg-background text-foreground antialiased">
```

**Step 3: Install baseline shadcn components**

```bash
npx shadcn@latest add button card input label textarea select badge separator skeleton table tabs accordion dialog alert-dialog sheet dropdown-menu navigation-menu tooltip scroll-area
```

**Step 4: Install additional dependencies**

```bash
npm install motion lucide-react zod resend @vercel/analytics @vercel/speed-insights
```

**Step 5: Verify build**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure shadcn/ui, Geist fonts, install core deps"
```

---

### Task 4: Create Core Lib Files

**Files:**
- Create: `lib/constants.ts`, `lib/schemas.ts`, `.env.example`, `CLAUDE.md`

**Step 1: Create constants (single source of truth for all contact info)**

Create `lib/constants.ts` with ALL phone numbers, emails, URLs, social links. Every component must import from here — never hardcode contact info.

Key values:
- Phone: `+1 (641) 516-1616`
- WhatsApp URL: `https://wa.me/16415161616`
- Email display: `info@meridianexport.com`
- Address: `2107 148th, Albion, IA, USA`
- Social links: Facebook, Instagram, YouTube (from design spec Section 3)

**Step 2: Create Zod schemas**

Create `lib/schemas.ts` with the contact form schema and calculator email schema.

**Step 3: Create .env.example**

List all required env vars (from design spec Section 10) with comments. No actual values.

**Step 4: Create CLAUDE.md**

Project instructions for the new Next.js site. Include: commands (`npm run dev`, `npm run build`, `npm run lint`), architecture overview, route structure, key directories, env vars, path aliases.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add constants, schemas, env template, CLAUDE.md"
```

---

## Phase 2: Layout & Navigation (Tasks 5-7)

### Task 5: Root Layout + Metadata

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/loading.tsx`

Build the root layout with:
- Geist Sans + Geist Mono via `next/font/local` (or `geist` package)
- Default metadata (title template, description, OpenGraph, Twitter Card)
- `<html lang="en">` with font variables
- JSON-LD for `Organization` + `WebSite` schema
- `@vercel/analytics` + `@vercel/speed-insights`
- `TooltipProvider` wrapper

Also create: robots.ts, sitemap.ts (with all 16 pages), not-found.tsx, error.tsx, global-error.tsx, loading.tsx.

**Commit:** `feat: root layout with metadata, SEO files, error boundaries`

---

### Task 6: Header Component

**Files:**
- Create: `components/header.tsx`

Build the site header with:
- Logo (from `public/logos/`)
- Desktop nav: Home, About, Services (dropdown with 6 items), Projects, Pricing, Contact
- "Get Quote" CTA button
- Mobile hamburger → Sheet (shadcn) with full nav
- Utility bar (top): "Available 24/7" + phone + email
- Scroll behavior: glass effect on scroll, hide on scroll down, show on scroll up
- All links use `next/link`
- All contact info imported from `lib/constants.ts`

**Commit:** `feat: header with navigation, mobile menu, utility bar`

---

### Task 7: Footer Component

**Files:**
- Create: `components/footer.tsx`

Build 4-column footer:
1. Company info + logo + description + contact details + social icons
2. Quick Links (Home, About, Services, Projects, Pricing)
3. Services (6 service links)
4. Legal (Privacy, Terms) + copyright

All contact info from `lib/constants.ts`. Social icons with proper aria-labels.

**Commit:** `feat: footer with 4-column layout and social links`

---

## Phase 3: Homepage Sections (Tasks 8-15)

### Task 8: Hero Section

**Files:**
- Create: `components/hero.tsx`
- Modify: `app/page.tsx`

Full-width hero with:
- Background image (`public/images/logistics1.jpg`) via `next/image` with `priority` prop (LCP optimization)
- Dark gradient overlay
- Trust badge: "Trusted Worldwide"
- H1: "Professional Machinery Export & Logistics"
- Subtitle
- Two CTAs: "Get a Quote" (solid, links to /contact) + "Our Services" (outline, links to /services)
- Scroll indicator

**Commit:** `feat: hero section with optimized background image`

---

### Task 9: Stats Bar

**Files:**
- Create: `components/stats-bar.tsx`

Blue background section with 4 stats:
- 500+ Projects Completed
- 10+ Years Experience
- 99% Client Satisfaction
- 100+ Staff Members

Use `Geist Mono` for numbers. Add count-up animation with `motion` (animate from 0 to target on scroll into view using IntersectionObserver).

**Commit:** `feat: stats bar with count-up animation`

---

### Task 10: Services Grid

**Files:**
- Create: `components/services-grid.tsx`, `content/services.ts`

Create typed service data in `content/services.ts`:
- 6 services with: slug, title, description, icon (Lucide name), keywords
- Each service has `relatedServices` for internal linking

Services grid component: 3-column grid of cards, each with icon, title, description, "Learn More" link to `/services/[slug]`.

**Commit:** `feat: services grid with typed content data`

---

### Task 11: Process Steps

**Files:**
- Create: `components/process-steps.tsx`

4-step visual flow:
1. Consultation — "Tell us about your equipment and destination"
2. Equipment Pickup — "We collect from anywhere in USA & Canada"
3. Packing & Loading — "Expert dismantling and secure container packing"
4. Global Shipping — "Door-to-port delivery worldwide"

Numbered steps with icons, connecting lines between them. Responsive: horizontal on desktop, vertical on mobile.

**Commit:** `feat: process steps section`

---

### Task 12: Projects Carousel

**Files:**
- Create: `components/project-carousel.tsx`, `components/project-card.tsx`, `content/projects.ts`

Migrate the 7 project entries from the CRA `Projects.js` into typed `content/projects.ts`. Each project: title, description, image path, equipment type, destination, container type, weight, transit time.

Carousel with `motion` for slide transitions. Desktop: side-by-side image + content. Mobile: stacked. Auto-play (5s) with manual controls. All images via `next/image`.

**Commit:** `feat: projects carousel with typed data`

---

### Task 13: Video Section

**Files:**
- Create: `components/video-section.tsx`

YouTube lite-embed pattern (NOT raw iframe):
- Show thumbnail + play button initially
- On click: load the actual iframe
- Video ID: `SrjUBSD2_5Q`
- Privacy-enhanced: `youtube-nocookie.com`
- "Watch More Videos" link to YouTube channel

**Commit:** `feat: video section with lite-youtube embed`

---

### Task 14: Trust Signals + FAQ (Homepage)

**Files:**
- Create: `components/trust-signals.tsx`, `components/faq-accordion.tsx`, `content/faq.ts`

Trust signals section (replaces testimonials):
- "Trusted by companies in 30+ countries"
- Grid of: Countries served, Equipment types, Warehouse locations, Years in business

FAQ accordion (homepage shows top 5-6 questions):
- Migrate 4 existing FAQs from CRA `FAQ.js`
- Add 2-3 more common questions
- Use shadcn `Accordion` component
- "View all FAQs" link to `/faq`

**Commit:** `feat: trust signals and FAQ accordion sections`

---

### Task 15: Contact Section + WhatsApp Widget + Mobile Bar

**Files:**
- Create: `components/contact-form.tsx`, `components/contact-info.tsx`, `components/whatsapp-widget.tsx`, `components/mobile-bottom-bar.tsx`, `components/cookie-consent.tsx`

Contact section: split layout (form left, info right).
- Form fields: Name*, Email*, Company, Phone, Equipment Type dropdown, Message*, honeypot
- Client component with loading/success/error states
- Calls Server Action (built in Phase 5)

WhatsApp widget: floating button (bottom-right), opens chat popup with "Contact Us" CTA. Phone from `lib/constants.ts`.

Mobile bottom bar: sticky bar with 3 buttons (WhatsApp, Call, Get Quote). Only visible on mobile.

Cookie consent banner: localStorage-based consent (`cookie-consent` key). Required for Meta Pixel to load.

**Commit:** `feat: contact section, WhatsApp widget, mobile bar, cookie consent`

---

## Phase 4: Content Pages (Tasks 16-22)

### Task 16: Services Overview Page

**Files:**
- Create: `app/services/page.tsx`

Server Component. Renders full services grid + hero. Metadata with title/description. Breadcrumbs.

**Commit:** `feat: services overview page`

---

### Task 17: Individual Service Pages (SSG)

**Files:**
- Create: `app/services/[slug]/page.tsx`
- Create: `components/breadcrumbs.tsx`

Dynamic route with `generateStaticParams()` for all 6 slugs. Each page:
- Service-specific hero (H1, description)
- "What We Do" detailed section
- Equipment types handled
- Related project photos (filtered from projects data)
- Cross-links to 2-3 related services
- CTA linking to /contact
- Breadcrumbs: Home > Services > [Service Name]
- Unique metadata per page (title, description, JSON-LD `Service` schema)

**Commit:** `feat: individual service pages with SSG and breadcrumbs`

---

### Task 18: Projects Page

**Files:**
- Create: `app/projects/page.tsx`

Grid layout (not carousel) of all projects. Filterable by equipment category. Each card: image, title, equipment type, destination. Click → shadcn `Dialog` or `Sheet` with full details. Metadata + JSON-LD `ItemList`.

**Commit:** `feat: projects gallery page with filters`

---

### Task 19: Pricing Page

**Files:**
- Create: `app/pricing/page.tsx`, `components/pricing-table.tsx`, `content/pricing.ts`

Migrate all pricing data from CRA `PricingTable.js` into typed `content/pricing.ts`:
- 64 equipment types with delivery/containerized prices
- 5 miscellaneous items
- 21 delivery routes with Line's/SOC prices

Server-rendered pricing table with shadcn `Table`. Client-side search + filter (category, delivery rate). Mobile accordion. CTA banner linking to `/pricing/calculator`.

**Commit:** `feat: pricing page with searchable tables`

---

### Task 20: About Page

**Files:**
- Create: `app/about/page.tsx`

Content sections:
- Company story (adapt from CRA About.js text)
- Key differentiators (24/7, global network, expertise)
- Warehouse locations (CA, GA, IL, ND, TX, AB Canada)
- Stats reinforcement
- CTA

**Commit:** `feat: about page`

---

### Task 21: FAQ Page

**Files:**
- Create: `app/faq/page.tsx`

Full FAQ page with all questions (expand to 15-20). Categorized sections. JSON-LD `FAQPage` schema for Google rich results. Each answer links to relevant service pages.

**Commit:** `feat: FAQ page with structured data`

---

### Task 22: Contact, Privacy, Terms Pages

**Files:**
- Create: `app/contact/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`

Contact page: full-page version of contact section + Google Maps embed + all contact cards.

Privacy/Terms: migrate from LP if similar, or create standard pages.

**Commit:** `feat: contact, privacy, terms pages`

---

## Phase 5: Lead Pipeline (Tasks 23-25)

### Task 23: Contact Form Server Action

**Files:**
- Create: `app/actions/contact.ts`, `lib/slack.ts`

Server Action pipeline (same pattern as LP):
1. Validate with Zod (from `lib/schemas.ts`)
2. Honeypot check
3. Supabase INSERT to `leads` table with `source: 'corporate'`
4. Resend email to `alex.z@meridianexport.com` (from `contact@meridianexport.com`)
5. Resend auto-reply to visitor
6. Slack notify `#meridian-email-intake`

Use existing `.env.local` values (RESEND_API_KEY, SUPABASE_URL, etc.).

**Step: Test the form end-to-end**

Submit a test form → verify Supabase row, email received, Slack notification.

**Commit:** `feat: contact form server action with full lead pipeline`

---

### Task 24: WhatsApp Attribution

**Files:**
- Create: `lib/wa-attribution.ts`, `app/api/track/wa-click/route.ts`

Port the WA ref code system from the LP:
- Generate `MF-XXXX` ref codes
- Store in `wa_attribution` Supabase table
- API route for tracking clicks
- Append ref code to WhatsApp message URL

**Commit:** `feat: WhatsApp attribution with ref codes`

---

### Task 25: Wire Contact Form to UI

**Files:**
- Modify: `components/contact-form.tsx`

Connect the contact form client component to the Server Action. Handle: loading state, success message, error display. Fire GA4 `generate_lead` event on success.

**Commit:** `feat: wire contact form to server action with tracking`

---

## Phase 6: Freight Calculator (Tasks 26-29)

### Task 26: Freight Engine

**Files:**
- Create: `lib/freight-engine.ts`

Pure TypeScript calculation logic:
- Input: equipment type (from pricing data) + origin + destination
- Output: packing cost, shipping cost estimate, total, container percentage
- Uses data from `content/pricing.ts` (no external DB calls in Phase 1)
- Types: `FreightEstimate`, `EquipmentSelection`, `RouteSelection`

**Commit:** `feat: freight calculation engine`

---

### Task 27: Calculator Wizard UI

**Files:**
- Create: `components/freight-calculator/calculator-wizard.tsx`, `components/freight-calculator/equipment-selector.tsx`, `components/freight-calculator/route-selector.tsx`, `components/freight-calculator/email-gate.tsx`, `components/freight-calculator/estimate-results.tsx`

Multi-step wizard:
- Step 1: Equipment category dropdown → specific type → auto-fills weight + container %
- Step 2: Origin region → Destination (from delivery routes data)
- Step 3: Email (required) + Name + Company → "Calculate" button
- Step 4: Results card with packing cost + shipping + total + "Get Detailed Quote" CTA

shadcn components: `Select`, `Input`, `Button`, `Card`, `Badge`.

**Commit:** `feat: freight calculator multi-step wizard UI`

---

### Task 28: Calculator Server Action

**Files:**
- Create: `app/actions/calculator.ts`

Server Action for email gate:
1. Validate email with Zod
2. Run freight-engine calculation
3. Supabase INSERT → leads table with `source: 'calculator'`, equipment, route, weight
4. Resend notification ("New calculator lead: [equipment] to [destination]")
5. Meta CAPI `Lead` event
6. Return estimate data

**Commit:** `feat: calculator server action with lead capture`

---

### Task 29: Calculator Page

**Files:**
- Create: `app/pricing/calculator/page.tsx`

SSG page shell with client-side wizard. Metadata targeting "freight cost calculator" keywords. Link from pricing page CTA. Breadcrumbs: Home > Pricing > Freight Calculator.

**Commit:** `feat: freight calculator page`

---

## Phase 7: Tracking & Analytics (Tasks 30-33)

### Task 30: GA4 + Google Ads

**Files:**
- Create: `components/google-analytics.tsx`
- Modify: `app/layout.tsx`

GA4 via `gtag.js` (Script component). Custom events: `generate_lead`, `contact_whatsapp`, `contact_phone`. Google Ads conversion tracking with Enhanced Conversions.

**Commit:** `feat: GA4 and Google Ads conversion tracking`

---

### Task 31: Meta Pixel + CAPI

**Files:**
- Create: `components/meta-pixel.tsx`, `lib/meta-capi.ts`, `lib/tracking.ts`

Consent-gated Meta Pixel (port from LP's pattern). Server-side CAPI for Lead + Contact events. Event deduplication via `event_id`. UTM + click ID (fbclid/gclid) capture to sessionStorage.

**Commit:** `feat: Meta Pixel, CAPI, UTM tracking`

---

### Task 32: Wire Tracking to All CTAs

**Files:**
- Modify: `components/whatsapp-widget.tsx`, `components/mobile-bottom-bar.tsx`, `components/contact-form.tsx`, `components/freight-calculator/estimate-results.tsx`

Ensure every CTA fires appropriate tracking events:
- WhatsApp clicks → GA4 `contact_whatsapp` + Meta `Contact` + CAPI
- Phone clicks → GA4 `contact_phone`
- Form submit → GA4 `generate_lead` + Meta `Lead` + CAPI
- Calculator submit → GA4 `generate_lead` (with `lead_source: 'freight_calculator'`)

**Commit:** `feat: wire tracking events to all CTAs`

---

### Task 33: Security Headers

**Files:**
- Modify: `next.config.mjs`

Add `headers()` config: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security.

**Commit:** `feat: add security headers`

---

## Phase 8: Polish & Animation (Tasks 34-36)

### Task 34: Scroll Animations

**Files:**
- Create: `components/scroll-reveal.tsx`, `hooks/use-scroll-reveal.ts`

IntersectionObserver-based scroll reveal wrapper using `motion`. Fade-up on enter with stagger for card grids (50ms between items). Apply to: services grid, stats, process steps, projects, FAQ.

**Commit:** `feat: scroll reveal animations`

---

### Task 35: Responsive Audit + Mobile Polish

Audit all pages at 375px, 640px, 768px, 1024px, 1280px. Fix any layout issues. Verify:
- Mobile bottom bar appears only on mobile
- WhatsApp widget doesn't overlap bottom bar
- All tables scroll horizontally on mobile
- Touch targets ≥ 44px
- No horizontal overflow

**Commit:** `fix: responsive audit fixes`

---

### Task 36: Performance Audit

Run Lighthouse on all key pages. Target: 90+ all categories. Fix:
- Hero image priority loading
- Lazy load below-fold images
- Dynamic import for pricing table (large component)
- Dynamic import for calculator wizard
- Verify < 150KB first load JS

**Commit:** `perf: lighthouse optimizations`

---

## Phase 9: Deploy (Tasks 37-38)

### Task 37: Pre-Deploy Verification

**Checklist:**
- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run lint` passes
- [ ] All 16 pages render correctly
- [ ] Contact form submits → Supabase + Resend + Slack
- [ ] Calculator email gate → lead capture works
- [ ] WhatsApp attribution generates ref codes
- [ ] Meta Pixel loads after cookie consent
- [ ] GA4 fires custom events
- [ ] Sitemap.xml lists all pages
- [ ] robots.txt is correct
- [ ] OG images render in social share preview
- [ ] Mobile bottom bar works
- [ ] All phone/email/WA links use constants (no hardcoded 786 number)

**Commit:** `chore: pre-deploy verification complete`

---

### Task 38: Merge & Deploy

**Step 1: Push the branch**

```bash
git push origin next-rebuild
```

**Step 2: Create PR (optional review)**

```bash
gh pr create --title "feat: Next.js 16 corporate site rebuild" --body "Full rebuild of meridianexport.com — see docs/plans/ for spec"
```

**Step 3: Merge to main**

```bash
git checkout main
git merge next-rebuild
git push origin main
```

Vercel auto-deploys to `meridianexport.com`. Verify the live site.

**Step 4: Post-deploy verification**

- Visit `meridianexport.com` — confirm Next.js site loads
- Submit test form → verify pipeline
- Check Vercel dashboard for any function errors
- Run Lighthouse on production URL

**Commit:** final merge, no additional commit needed

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1. Foundation | 1-4 | Branch, wipe CRA, init Next.js + shadcn, core libs |
| 2. Layout | 5-7 | Root layout, header, footer |
| 3. Homepage | 8-15 | All 8 homepage sections + widgets |
| 4. Content Pages | 16-22 | Services (7), projects, pricing, about, FAQ, contact, legal |
| 5. Lead Pipeline | 23-25 | Server actions, WA attribution, form wiring |
| 6. Calculator | 26-29 | Engine, wizard UI, server action, page |
| 7. Tracking | 30-33 | GA4, Meta, UTM, security headers |
| 8. Polish | 34-36 | Animations, responsive audit, performance |
| 9. Deploy | 37-38 | Verification, merge, launch |

**Total: 38 tasks across 9 phases**

**Critical path:** Phases 1-3 must be sequential. Phases 4-7 can partially parallelize (content pages are independent of tracking). Phase 8-9 are final.

**Estimated effort:** The foundation + layout + homepage (Phases 1-3) are the heaviest lift (~60% of work). After that, content pages are repetitive, and tracking/calculator build on established patterns.
