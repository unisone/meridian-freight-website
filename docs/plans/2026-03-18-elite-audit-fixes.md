# Elite Audit Fixes — PRD & Implementation Spec

**Date:** 2026-03-18
**Status:** APPROVED — Implementing (testimonials removed per owner decision)
**Branch:** TBD (create after approval)
**Source:** 5 parallel audits (UI/UX, SEO, Copy/Conversion, Code Quality, Visual Verification)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Audit Scores](#2-audit-scores)
3. [Phase 1: Critical Fixes](#3-phase-1-critical-fixes)
4. [Phase 2: Major Fixes](#4-phase-2-major-fixes)
5. [Phase 3: Minor Polish](#5-phase-3-minor-polish)
6. [Out of Scope](#6-out-of-scope)
7. [Files Changed Summary](#7-files-changed-summary)
8. [Acceptance Criteria](#8-acceptance-criteria)

---

## 1. Executive Summary

Five parallel specialized audits (UI/UX design, SEO technical, copywriting/conversion, code quality, visual browser verification) reviewed every file and page. The site is in **strong shape** — SEO scores 8.9/10, copy scores B+, zero console errors, all structured data validates. But the audits found **5 critical, 11 major, and 12 minor issues** that should be addressed.

### Already Fixed (during audit)
- Double period in footer copyright ("Inc..") → fixed
- About page "over 10 years" → updated to "over 13 years"

### Key Themes
1. **Color consistency** — 4 active components still use `gray-*` instead of `slate-*`, WhatsApp widget uses `green-500` not `emerald-600`
2. **Accessibility** — Nested interactive elements (`<a>` wrapping `<Button>`), missing ARIA attributes
3. **Security** — Meta CAPI token in URL query param, no rate limiting on contact form
4. **Testimonial alignment** — Parts business testimonials on a machinery export site creates cognitive dissonance
5. **Terminology** — 4+ terms used for the same concept ("end-to-end", "full-service", "complete", "one company")

---

## 2. Audit Scores

| Discipline | Score | Key Strength | Key Weakness |
|-----------|-------|--------------|--------------|
| SEO Technical | 8.9/10 | All structured data validates, complete sitemap | Homepage title 3 chars over |
| Copywriting | B+ (80/100) | Hero USP is excellent | Testimonials misaligned |
| UI/UX Design | B- (~75/100) | Clean layout, good component structure | Color inconsistencies, button sizing |
| Code Quality | B+ | Correct server/client boundaries, good TypeScript | Security: CAPI token exposure |
| Visual | Pass (all pages) | Zero console errors, all pages load | Double period (fixed), years inconsistency (fixed) |

---

## 3. Phase 1: Critical Fixes

### C1. Security: Meta CAPI Access Token in URL

**File:** `lib/meta-capi.ts:63`
**Severity:** CRITICAL (security vulnerability)
**Source:** Code Quality audit

**Current:**
```typescript
`https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`
```

**Fix:** Move token to Authorization header:
```typescript
await fetch(
  `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ data: [event] }),
  }
);
```

**Why:** Token in URL appears in server logs, proxy logs, and error messages. Meta's own docs recommend the Authorization header approach.

---

### C2. Design: `gray-*` → `slate-*` in Active Components

**Severity:** CRITICAL (brand inconsistency on live pages)
**Source:** UI/UX audit

**Active components using `gray-*` (visible on site):**

| Component | File | Instance Count | Used On Page |
|-----------|------|---------------|--------------|
| Calculator Wizard | `components/freight-calculator/calculator-wizard.tsx` | ~25 instances | `/pricing/calculator` |
| Pricing Table | `components/pricing-table.tsx` | ~12 instances | `/pricing` |
| Cookie Consent | `components/cookie-consent.tsx` | 2 instances | All pages |
| WhatsApp Widget | `components/whatsapp-widget.tsx` | 2 instances | All pages |

**Fix:** Global find-and-replace within each file:
- `gray-50` → `slate-50`
- `gray-100` → `slate-100`
- `gray-200` → `slate-200`
- `gray-400` → `slate-400`
- `gray-500` → `slate-500`
- `gray-600` → `slate-600`
- `gray-700` → `slate-700`
- `gray-900` → `slate-900`

**Note:** Do NOT touch orphaned components (`projects-gallery.tsx`, `project-carousel.tsx`, `trust-signals.tsx`, `stats-bar.tsx`) — they are not used.

---

### C3. Design: WhatsApp Widget `green-500` → `emerald-600`

**Severity:** CRITICAL (brand inconsistency — visible on every page)
**Source:** UI/UX audit

**Files:**
- `components/whatsapp-widget.tsx` — `bg-green-500`, `hover:bg-green-600` → `bg-emerald-600`, `hover:bg-emerald-700`
- `components/mobile-bottom-bar.tsx` — `text-green-600`, `hover:bg-green-50` → `text-emerald-600`, `hover:bg-emerald-50`

---

### C4. SEO: Homepage Title Length

**File:** `app/page.tsx:19`
**Severity:** CRITICAL (truncated in Google SERPs)
**Source:** SEO audit

**Current (63 chars after template):** `"Machinery Export & Logistics — Packing, Shipping, Documentation | Meridian Export"`

**Fix:** Shorten title:
```
"Machinery Export & Logistics — Packing & Shipping"
```
This renders as `"Machinery Export & Logistics — Packing & Shipping | Meridian Export"` = 56 chars.

---

### C5. Copy: Testimonials Cognitive Dissonance

**Severity:** CRITICAL (trust issue)
**Source:** Copy/Conversion audit

**Problem:** Featured testimonials talk about "filters", "fuel injectors", "gasket sets" (parts business). The site is about exporting combines, excavators, and tractors (machinery logistics). Visitors see project photos of massive equipment then read testimonials about small parts — creates confusion.

**Options (need owner decision):**
- **Option A:** Rewrite testimonial intros to emphasize the shipping/export aspect rather than the part itself — e.g., "Ordered parts for our combine operation. Everything arrived well-packed in a single shipment to Colombia."
- **Option B:** Keep as-is but add a context line: "From parts to full machines — hear from our clients worldwide"
- **Option C:** Collect new machinery-specific testimonials (longer timeline)

**Recommendation:** Option A — subtle rewording to de-emphasize "filters and hydraulic parts" and emphasize "shipped to Colombia, well-packed." The testimonials are real and approved; the framing just needs adjustment.

---

## 4. Phase 2: Major Fixes

### M1. Accessibility: Nested Interactive Elements

**Severity:** MAJOR (HTML spec violation, screen reader confusion)
**Source:** UI/UX audit
**Count:** ~15 instances across all pages

**Pattern:** `<Link href="..."><Button>text</Button></Link>` or `<a href="..."><Button>text</Button></a>`

**Fix:** Use `asChild` prop on the shadcn/ui Button to render the button as the link element:
```tsx
// Before (invalid HTML — button inside anchor):
<Link href="/contact">
  <Button size="lg">Get Quote</Button>
</Link>

// After (valid — button renders AS anchor):
<Button size="lg" asChild>
  <Link href="/contact">Get Quote</Link>
</Button>
```

**Files affected:** `hero.tsx`, `app/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/projects/page.tsx`, `app/pricing/page.tsx`, `app/about/page.tsx`, `app/faq/page.tsx`

For `<a>` tags (WhatsApp links), same pattern:
```tsx
<Button size="lg" asChild>
  <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
    WhatsApp Us
  </a>
</Button>
```

---

### M2. Security: Contact Form Rate Limiting

**Severity:** MAJOR (spam/abuse vector)
**Source:** Code Quality audit
**File:** `app/actions/contact.ts`

**Problem:** The Server Action has a honeypot but no rate limiting. Bots that bypass the honeypot can spam Resend (emails), Supabase, and Slack indefinitely.

**Options:**
- **Option A (Quick):** Add a simple in-memory rate limiter using a Map with IP → timestamp tracking. Limits: 5 submissions per IP per hour.
- **Option B (Production):** Add `@upstash/ratelimit` with Redis for distributed rate limiting across serverless functions.
- **Option C (Platform):** Use Vercel Firewall WAF rate limiting rules (no code changes).

**Recommendation:** Option C for now (Vercel Firewall), with Option A as a code-level fallback. The site is on Vercel — platform-level rate limiting is the most robust approach.

**Also apply to:** `app/actions/calculator.ts` (same exposure).

---

### M3. Code: Calculator Supabase Error Handling

**Severity:** MAJOR (silent failures make debugging impossible)
**Source:** Code Quality audit
**File:** `app/actions/calculator.ts:24-36`

**Fix:** Add `resp.ok` check matching the pattern in `contact.ts`:
```typescript
if (!resp.ok) {
  console.error("Calculator lead insert failed:", resp.status, await resp.text());
}
```

---

### M4. Design: Button Sizing Standardization

**Severity:** MAJOR (visual inconsistency)
**Source:** UI/UX audit

**Current state:** Buttons use 4+ different height overrides: `h-12`, `h-13`, `py-5`, default.

**Fix:** Standardize on 2 patterns:
- **Hero CTA:** `h-13 px-7 text-base rounded-lg` (largest, most prominent)
- **Section CTA:** `h-12 px-8 rounded-xl` (all dark-background CTAs, footer, service pages)
- **Inline CTA:** Default `size="default"` with `rounded-lg` (mid-page, services grid)

Remove all `py-5` overrides (calculator wizard buttons) — use `h-12` instead.

---

### M5. Mobile: Trust Bar Grid

**Severity:** MAJOR (overflow on small screens)
**Source:** UI/UX audit
**File:** `components/trust-bar.tsx:17`

**Current:** `grid-cols-3 lg:grid-cols-6`
**Fix:** `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`

On 320px screens, 3 columns with labels like "500+ Equipment Exports" overflow. 2 columns on the smallest screens gives more breathing room.

---

### M6. Copy: Terminology Standardization

**Severity:** MAJOR (dilutes messaging)
**Source:** Copy/Conversion audit

**Decision:** Standardize on **"end-to-end"** as the primary USP term.

| Current Term | Where Used | Replace With |
|-------------|-----------|-------------|
| "full-service" | Project descriptions (×3) | "end-to-end" |
| "complete" | Project descriptions (×3), services | Keep where natural ("complete documentation") |
| "one company" | Hero subtitle, About page | Keep (complementary, not competing) |
| "end-to-end" | Project descriptions (×2) | Primary — keep |

**Rule:** "End-to-end" is the USP descriptor. "One company" is the supporting proof. Don't mix in "full-service" or "complete export" as synonyms.

---

### M7. A11y: Calculator Progress Bar ARIA

**Severity:** MAJOR (accessibility)
**Source:** UI/UX audit
**File:** `calculator-wizard.tsx:76-91`

**Fix:** Add ARIA attributes:
```tsx
<div className="flex border-b border-slate-100" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4} aria-label={`Step ${step} of 4`}>
```

---

### M8. A11y: Missing aria-labels on External Links

**Severity:** MAJOR
**Source:** UI/UX audit
**Files:** `hero.tsx`, `app/page.tsx`, `video-section.tsx`

**Fix:** Add `aria-label` to all WhatsApp and YouTube external links:
```tsx
<a href={CONTACT.whatsappUrl} aria-label="Get a quote on WhatsApp" ...>
```

---

## 5. Phase 3: Minor Polish

### P1. SEO: Privacy/Terms Keywords
Add `keywords` to `app/privacy/page.tsx` and `app/terms/page.tsx` metadata.

### P2. Design: Button Border Radius
Standardize all buttons to `rounded-xl` (matches majority pattern).

### P3. Design: Native Select → shadcn Select
Replace raw `<select>` in `contact-form.tsx` with shadcn `Select` component.

### P4. A11y: Star Rating Screen Reader Text
Add `aria-label="5 out of 5 stars"` to star rating containers in `testimonials.tsx`.

### P5. A11y: Header Dropdown Keyboard
Add `onKeyDown` handler for Escape key to close services dropdown in `header.tsx`.

### P6. Perf: Hero Image `sizes`
Add `sizes="(max-width: 1024px) 100vw, 50vw"` to hero image.

### P7. Copy: Trust Bar YouTube Metric
Replace "6,400+ YouTube Subscribers" with "Worldwide Shipping" (already done) — verify it's not showing elsewhere.

### P8. Cleanup: Orphaned Components
Delete 3 unused components: `project-carousel.tsx`, `stats-bar.tsx`, `trust-signals.tsx`. These are never imported by any page.

### P9. Cleanup: Unused shadcn/ui Components
Remove 7 unused UI primitives: `alert-dialog`, `dialog`, `dropdown-menu`, `navigation-menu`, `scroll-area`, `skeleton`, `tabs`.

### P10. Code: Breadcrumb Key
Change `key={i}` to `key={item.label}` in `breadcrumbs.tsx:50`.

### P11. SEO: Homepage FAQPage Schema
Consider adding FAQPage schema to homepage FAQ section (currently only on `/faq` page).

### P12. Copy: Section Heading Consistency
Standardize eyebrow text size to `text-sm font-semibold` across all sections.

---

## 6. Out of Scope

| Item | Reason |
|------|--------|
| Orphaned components color fixes | Components not used — delete them instead (P8) |
| Blog/content hub | Separate initiative |
| Video testimonials | Requires client coordination |
| Maersk/Hapag-Lloyd logo section | Need permission to use their logos |
| Certification badges | Need to verify actual certifications |
| A/B testing CTA hierarchy | Post-launch optimization |
| Homepage section reorder | Significant UX change — needs separate spec |

---

## 7. Files Changed Summary

### Phase 1: Critical (5-6 files)
| File | Change |
|------|--------|
| `lib/meta-capi.ts` | Move access token to Authorization header |
| `components/freight-calculator/calculator-wizard.tsx` | `gray-*` → `slate-*` (~25 replacements) |
| `components/pricing-table.tsx` | `gray-*` → `slate-*` (~12 replacements) |
| `components/cookie-consent.tsx` | `gray-*` → `slate-*` (2 replacements) |
| `components/whatsapp-widget.tsx` | `gray-*` → `slate-*` + `green-500` → `emerald-600` |
| `components/mobile-bottom-bar.tsx` | `green-600` → `emerald-600` |
| `app/page.tsx` | Shorten homepage title |
| `content/testimonials.ts` | Reword testimonials (pending C5 decision) |

### Phase 2: Major (10-15 files)
| File | Change |
|------|--------|
| ~8 page files | Fix `<Link>` wrapping `<Button>` → use `asChild` |
| `components/hero.tsx` | Fix button pattern + add aria-label |
| `app/actions/calculator.ts` | Add `resp.ok` check |
| `components/trust-bar.tsx` | Grid `grid-cols-2 sm:grid-cols-3` |
| `content/projects.ts` | "full-service" → "end-to-end" |
| `calculator-wizard.tsx` | ARIA on progress bar, `py-5` → `h-12` |
| `components/video-section.tsx` | Add aria-labels |

### Phase 3: Minor (8-12 files)
Various small fixes as listed above.

---

## 8. Acceptance Criteria

### Phase 1 Complete When:
- [ ] `grep -r "access_token=" lib/` returns 0 matches
- [ ] `grep -r "gray-" components/freight-calculator/ components/pricing-table.tsx components/cookie-consent.tsx components/whatsapp-widget.tsx` returns 0 matches
- [ ] `grep -r "green-500\|green-600" components/` returns 0 matches
- [ ] Homepage title renders under 60 chars (verify in browser `document.title`)
- [ ] Testimonials don't mention "filters", "fuel injectors", or "gasket sets" (or are contextualized)
- [ ] `npm run build` — 22/22 pages, 0 errors

### Phase 2 Complete When:
- [ ] `grep -rn "<Link.*><Button\|<a.*><Button" app/ components/` returns 0 matches
- [ ] Calculator progress bar has `role="progressbar"` and `aria-valuenow`
- [ ] All external WhatsApp/YouTube links have `aria-label`
- [ ] All buttons use either `h-13` (hero) or `h-12` (section) — no `py-5`
- [ ] Trust bar shows 2 columns on 320px viewport
- [ ] `grep "full-service" content/projects.ts` returns 0 matches
- [ ] `npm run lint` — 0 errors

### Phase 3 Complete When:
- [ ] Privacy/Terms pages have keywords in metadata
- [ ] Orphaned components deleted (3 files)
- [ ] Unused shadcn/ui primitives deleted (7 files)
- [ ] Hero image has `sizes` attribute
- [ ] Star ratings have `aria-label`
- [ ] `npm run build` — 22/22 pages, 0 errors
