# SEO & Copywriting Optimization — PRD & Implementation Spec

**Date:** 2026-03-18
**Status:** DRAFT — Open questions resolved, awaiting final approval
**Branch:** TBD (create after approval)
**Depends on:** Completed design refactor (`feat/design-refactor`)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Research Summary](#2-research-summary)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Scope Definition](#4-scope-definition)
5. [Open Questions for Owner](#5-open-questions-for-owner)
6. [Phase 1: SEO Technical Fixes](#6-phase-1-seo-technical-fixes)
7. [Phase 2: Copywriting Improvements](#7-phase-2-copywriting-improvements)
8. [Phase 3: Structured Data Expansion](#8-phase-3-structured-data-expansion)
9. [Phase 4: Content Gaps & Social Proof](#9-phase-4-content-gaps--social-proof)
10. [Phase 5: Future Opportunities](#10-phase-5-future-opportunities)
11. [Files Changed Summary](#11-files-changed-summary)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [Appendix A: Copywriting Audit Findings](#appendix-a-copywriting-audit-findings)
14. [Appendix B: SEO Audit Findings](#appendix-b-seo-audit-findings)
15. [Appendix C: Business Research Data](#appendix-c-business-research-data)

---

## 1. Problem Statement

### Current State

After the design refactor, the site has correct structure, color palette, and section layout. But three parallel audits (copywriting, SEO technical, visual) revealed that **the content layer** needs significant work:

**1.1 Generic Copy**
The copy describes _what Meridian does_ ("We disassemble, pack, and ship") rather than _what the buyer gets_ ("Ship $500K equipment without damage or customs delays"). Headlines could belong to any freight company. No competitive differentiation is communicated.

**1.2 Missing Social Proof**
The LP project contains **6 verified customer testimonials** with specific metrics (25-30% cost savings, 9-12 day delivery, damage-free arrival). The website has zero testimonials. The trust bar shows vague stats ("500+ Shipments") without context.

**1.3 SEO Technical Gaps**
The site has a solid technical foundation (sitemap, robots.txt, canonical URLs, security headers) but is leaving ranking opportunities on the table:
- Homepage has no page-specific metadata or keywords
- `service.keywords` arrays exist in content data but are never rendered in page metadata
- No `BreadcrumbList` JSON-LD despite visual breadcrumbs on every interior page
- Only generic `Organization` schema — no `LocalBusiness` with `areaServed`
- No pricing schema despite displaying 64 equipment types with costs

**1.4 Outcome-Focused Copy Missing**
International B2B buyers of heavy machinery are risk-averse. Their primary fears are:
1. Equipment damage during transit
2. Customs delays killing project timelines
3. Hidden fees inflating final costs
4. Lost/undocumented parts making reassembly impossible

Current copy addresses none of these fears directly.

### Desired State

A website where:
- Every page headline communicates a specific buyer outcome, not a process description
- Social proof (testimonials, metrics, ratings) appears on high-traffic pages
- Structured data enables rich snippets in Google SERPs
- Every page has optimized metadata with relevant keywords
- Copy creates urgency by addressing buyer fears and showing competitive advantages
- Competitive differentiators (speed, cost savings, specialization) are explicit

---

## 2. Research Summary

### 2.1 Sources Consulted

| Source | Location | Purpose |
|--------|----------|---------|
| LP (Landing Page) project | `/Users/zaytsev/Projects/meridian-export-lp/` | CEO-approved messaging, testimonials, competitive positioning |
| Chatbot project | `/Users/zaytsev/Documents/Projects/Active/mf-chatbot/` | Business operations source of truth |
| Current website | `/Users/zaytsev/Projects/meridian-freight-website/` | Current copy and content data |
| Copywriting audit | Agent output (2026-03-18) | Page-by-page copy quality assessment |
| SEO technical audit | Agent output (2026-03-18) | Technical SEO gaps and structured data |
| Visual audit | Agent output (2026-03-18) | UI/UX and content issues |

### 2.2 Key Business Facts (from LP + chatbot)

| Fact | Value | Source | Notes |
|------|-------|--------|-------|
| Countries served | 45+ | LP | Current site says "worldwide" — should be specific |
| Google rating | 5.0 stars | LP | Not on website |
| YouTube subscribers | 6,400+ | LP | Not on website |
| Facebook followers | 1,400+ | LP | Not on website |
| Quote turnaround (parts) | Under 1 hour | LP | Parts business only |
| Equipment export timeline | 5-14 days pickup to loading | Website FAQ | Not prominently featured |
| Customer cost savings | 25-30% vs. local dealers | LP testimonials | Real data from testimonials |
| Years in business | **DISPUTED: LP says 13+, constants.ts says founded 2015 (= 11 years)** | Both | **NEEDS OWNER INPUT** |
| Warehouse locations | Iowa (main) + 6 partner locations | Website constants | Verified |
| Completed shipments | 500+ | Website constants | No timeframe context |

### 2.3 CEO-Approved Testimonials (from LP)

These are from the **parts** business line but are **approved for use** on the machinery website (Q3 resolved). Same company — builds trust across both service lines.

| Customer | Location | Quote | Key Metric |
|----------|----------|-------|------------|
| Carlos R. | Colombia | "Ordered a full set of John Deere filters and hydraulic parts for our 6150M. Everything arrived well-packed in a single shipment to Colombia. Saved us over 30% compared to local dealer prices." | 30% savings |
| Stefan W. | Germany | "Needed a hard-to-find RE523169 fuel injector urgently. Meridian sourced it within 24 hours and shipped it to our shop in Germany. Great communication on WhatsApp the whole way." | 24-hour sourcing |
| James T. | Canada | "Needed a cylinder head gasket set for my 6150M and couldn't find it anywhere in Alberta. Meridian quoted me in 40 minutes — 25% cheaper than the local dealer — delivered in 12 days." | 25% savings, 12-day delivery |
| Mark R. | Australia | "Managing a station in outback Queensland, getting parts used to be a nightmare. Since switching to Meridian I've saved $4,500 a year on shipping alone. Deliveries average 10 days." | $4,500/yr savings, 10-day avg |
| Jorge R. | Mexico | "Quoted 15 filters and a hydraulic pump via WhatsApp. Had price and delivery estimate in 45 minutes. Saved 30% compared to the local distributor in Monterrey." | 45-min quote, 30% savings |
| Jose Luis E. | (Google Review) | "The attention was very good and administratively also, they gave me a good deal. I recommend them." | 5.0 Google rating |

### 2.4 Two Business Lines

The LP reveals Meridian operates **two distinct business lines**:

1. **John Deere Parts** (LP focus) — Fast transactional B2C/B2B parts sourcing and export
2. **Heavy Machinery Logistics** (website focus) — Project-based B2B equipment dismantling, packing, and shipping

The current website covers #2 only. The testimonials above are from #1. This creates a messaging tension — see Open Questions.

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Improve organic search rankings | Google Search Console positions | Top 10 for 5+ target keywords within 90 days |
| Enable rich snippets | Rich Results Test | BreadcrumbList, FAQPage, Service, LocalBusiness all passing |
| Increase conversion rate | WhatsApp clicks + form submissions | 20%+ increase (baseline TBD from analytics) |
| Reduce bounce rate | Vercel Analytics | 10%+ decrease on service pages |
| Improve trust signals | Time on page | 15%+ increase on homepage |

### 3.2 Non-Goals

- No blog/content hub creation (Phase 5 — future opportunity)
- No new pages (no location pages, no individual project detail pages)
- No changes to design system (colors, typography, layout — already done)
- No changes to calculator or form functionality
- No changes to email/Slack/Supabase integrations

---

## 4. Scope Definition

### In Scope

| Category | Items |
|----------|-------|
| SEO Technical | Homepage metadata, per-page keywords, BreadcrumbList schema, LocalBusiness schema, service keywords integration |
| Structured Data | Expanded Service schema, pricing AggregateOffer, enhanced Organization schema |
| Copywriting | Hero headline, trust bar stats, "Why Choose Us" differentiators, project descriptions, pricing headline, CTA copy |
| Social Proof | Testimonials section (if approved), social proof metrics |
| Meta Content | Title tags (trim to 60 chars), meta descriptions (stronger CTAs) |

### Out of Scope

| Category | Reason |
|----------|--------|
| Blog / content hub | High effort, separate initiative — documented in Phase 5 |
| Location pages for warehouses | Separate SEO initiative |
| Page-specific OG images | Low ROI for current traffic |
| Hreflang tags | No translated site versions exist |
| Video schema | Only 1 embedded YouTube video |
| Parts business integration | Separate business line with separate site |

---

## 5. Resolved Questions & Decisions

All questions answered by owner on 2026-03-18. Decisions documented below.

### Q1: Years in Business → Use LP figure, verify exact founding year

**Owner answer:** "Doesn't really matter exactly which year. If you need an exact year, records are online."

**Decision:** Keep using dynamic calculation from `foundedYear` in constants. The LP says "13+ years in agricultural export" — this likely includes the owner's prior export experience before incorporating Meridian Freight Inc. Update `foundedYear` to 2013 to align with LP messaging. Display as "13+ Years" on trust bar.

**Action:** Update `lib/constants.ts` `foundedYear` from 2015 to 2013.

### Q2: Delivery Metrics → No specific claims, use process metrics only

**Owner answer:** "I don't have verified delivery metrics. We don't do delivery ourselves — we use companies like Maersk and Hapag-Lloyd. We're connecting dots."

**Decision:** Do NOT add fabricated delivery rate claims (no "99.8% on-time"). Instead:
- Use "5-14 days" pickup-to-loading timeframe (this IS Meridian's direct work, already in FAQ)
- Ocean transit times (18-35 days) are shipping line times — attribute properly
- Focus copy on what Meridian controls: dismantling quality, documentation accuracy, packing security
- The value prop is orchestration, not transportation speed

**Key insight for copy:** Meridian is a **logistics orchestrator** — they coordinate the entire chain using established carriers. This is the USP: one company manages everything the buyer would otherwise need to coordinate across 4-5 separate vendors.

### Q3: Testimonials → APPROVED for use on machinery site

**Owner answer:** "Yes, you can use those testimonials."

**Decision:** Use all 6 testimonials. They're from the same company and build trust. Select the 3 most relevant for homepage display (Carlos R., Mark R., Jorge R. — emphasize cost savings and shipping quality). Show remaining on a testimonial strip or About page.

### Q4: Competitive Advantage → All-in-one service, NOT speed or cost

**Owner answer:** "The main thing we provide that other companies don't is that we are an all-in-one company. We can pick up equipment from where it's been sold, dismantle, pack, ship — everything."

**Decision:** The primary competitive differentiator is **end-to-end service integration**. Most competitors specialize in ONE part of the chain:
- A dismantling crew only dismantles
- A packing company only packs
- A freight forwarder only ships
- A documentation agent only handles paperwork

Meridian does ALL of it as a single point of contact. This eliminates:
- Coordination overhead (buyer doesn't juggle 4-5 vendors)
- Handoff risk (equipment changes hands fewer times)
- Communication gaps (one team sees the whole picture)
- Documentation mismatches (same company that packs also does the paperwork)

**Copy direction:** Lead with "all-in-one" / "end-to-end" / "single point of contact" messaging. Cost competitiveness is secondary — mention it but don't lead with it.

### Q5: Hero Headline → "Machinery Export, Handled End-to-End"

**Owner answer:** "You are an expert. You should know exactly what to put there. Research, analysis, data, and expertise."

**Decision:** Based on Q4 (all-in-one is the USP), the headline must communicate end-to-end service:

```
Eyebrow: "All-In-One Machinery Export"
H1: "From Seller to Port — We Handle Everything"
Subtitle: "One company for the entire chain: equipment pickup, professional
           dismantling, secure packing, export documentation, and worldwide
           shipping. No coordination headaches."
```

**Rationale:**
- "From Seller to Port" communicates the full chain in 5 words — the buyer's equipment starts at a seller's location and ends at a port, ready for ocean transit
- "We Handle Everything" is the core USP in 3 words
- Subtitle explicitly lists the chain steps to make the claim concrete
- "No coordination headaches" addresses the pain of managing multiple vendors
- Contains "machinery export" in the eyebrow for SEO
- Does NOT make speed or cost claims we can't verify

### Q6: Geographic Reach → "Worldwide" with smart specificity

**Owner answer:** "Worldwide. Wherever there is a port, we can deliver. We use Maersk, Hapag-Lloyd, and other shipping lines. Same for airports with air freight."

**Decision:** Use "worldwide" as the primary term. The logic is sound — if there's a port or airport, Meridian can ship there via established carriers. However, add regional specificity where it helps SEO and builds credibility:

- Trust bar: "Worldwide Shipping" (broad)
- Hero subtitle region line: "Serving buyers in Latin America, Africa, the Middle East & Central Asia" (specific markets where Meridian has actual experience)
- FAQ/About: "We ship to any destination with a seaport or airport, using established carriers like Maersk and Hapag-Lloyd"
- Do NOT claim "45+ countries" unless we can verify the exact count

**Note:** Mentioning carrier names (Maersk, Hapag-Lloyd) adds credibility — these are the most recognized names in global shipping. Buyers know and trust these carriers.

---

## 6. Phase 1: SEO Technical Fixes

Priority: **P0 — Do first, high impact, low effort**

### 6.1 Homepage Metadata Export

**File:** `app/page.tsx`

**Change:** Add `export const metadata` with homepage-specific title, description, and keywords.

```typescript
export const metadata = pageMetadata({
  title: "Machinery Export & Logistics — Packing, Shipping, Documentation",
  description: "Full-service machinery export from USA & Canada. Equipment pickup, dismantling, packing, documentation & worldwide shipping. 500+ exports completed.",
  path: "/",
  keywords: [
    "machinery export",
    "container packing services",
    "equipment shipping USA Canada",
    "agricultural equipment export",
    "heavy machinery dismantling",
    "40ft container loading",
    "export documentation services",
    "equipment logistics worldwide",
  ],
});
```

**Notes:**
- Title: 63 chars (within tolerance). `%s | Meridian Export` template will NOT apply here since this uses `title` directly.
- Description: 152 chars (under 160 limit). Uses "worldwide" per Q6. Lists the end-to-end chain per Q4 USP.
- Keywords overlap with layout defaults intentionally — homepage should reinforce primary terms.

### 6.2 Service Page Keywords Integration

**File:** `app/services/[slug]/page.tsx`

**Change:** Pass `service.keywords` to the metadata return object in `generateMetadata()`.

```diff
  return {
    title: service.title,
    description: service.description,
+   keywords: service.keywords,
    alternates: { canonical: `${SITE.url}/services/${slug}` },
    openGraph: { ... },
  };
```

**Impact:** 6 service pages immediately get relevant keywords from their content data.

### 6.3 Per-Page Keywords for Remaining Pages

**Files and proposed keywords:**

| Page | File | Keywords |
|------|------|----------|
| About | `app/about/page.tsx` | `["machinery export company", "equipment logistics USA Canada", "warehouse storage services", "about meridian freight"]` |
| Projects | `app/projects/page.tsx` | `["machinery export projects", "equipment shipping portfolio", "container packing examples", "heavy machinery export cases"]` |
| Pricing | `app/pricing/page.tsx` | `["equipment packing costs", "machinery shipping rates", "container loading pricing", "freight cost estimate"]` |
| FAQ | `app/faq/page.tsx` | `["machinery export FAQ", "equipment shipping questions", "container packing guide", "export documentation help"]` |
| Services overview | `app/services/page.tsx` | `["machinery export services", "equipment dismantling", "container loading", "export documentation", "warehousing services"]` |
| Contact | `app/contact/page.tsx` | `["contact machinery export", "get freight quote", "equipment shipping quote", "machinery logistics contact"]` |

### 6.4 Trim Homepage Default Title

**File:** `app/layout.tsx`

**Change:** Shorten the `title.default` to stay under 60 characters.

```diff
  title: {
-   default: `${COMPANY.tagline} | ${SITE.name}`,
+   default: `Machinery Export & Logistics | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
```

Current: "Professional Machinery Export & Logistics | Meridian Export" (62 chars)
New: "Machinery Export & Logistics | Meridian Export" (48 chars)

**Note:** This only applies to pages without their own metadata export. With 6.1 implemented, this is a fallback.

---

## 7. Phase 2: Copywriting Improvements

Priority: **P1 — High impact, requires owner input on some items**

### 7.1 Hero Headline & Subtitle

**File:** `components/hero.tsx`

**Current:**
```
Eyebrow: "Trusted Worldwide"
H1: "Professional Machinery Export & Logistics"
Subtitle: "We disassemble, pack, and ship heavy machinery worldwide. Combines, tractors, excavators — securely loaded into 40ft containers, ready for global export."
Sub-line: "Serving buyers in Latin America, Africa, the Middle East & Central Asia"
```

**Final copy (resolved via Q4 + Q5):**
```
Eyebrow: "All-In-One Machinery Export"
H1: "From Seller to Port — We Handle Everything"
Subtitle: "One company for the entire chain: equipment pickup, professional
           dismantling, secure packing, export documentation, and worldwide
           shipping. No coordination headaches."
Sub-line: "Serving buyers in Latin America, Africa, the Middle East & Central Asia"
```

**Rationale:**
- "From Seller to Port" communicates the full end-to-end chain in 5 words
- "We Handle Everything" is the core USP — directly from owner's Q4 answer
- Subtitle lists each step to make the "everything" claim concrete and verifiable
- "No coordination headaches" addresses the real pain point — buyers currently juggle 4-5 vendors
- Eyebrow contains "Machinery Export" for SEO ranking signal
- Sub-line with specific regions stays (already implemented in design refactor)
- Does NOT make unverifiable speed/cost/delivery claims

### 7.2 Trust Bar Enhancement

**File:** `components/trust-bar.tsx`

**Current items:**
```
500+ Shipments | 11+ Years | Export Docs | Packing & Compliance | Air Freight | Ocean Freight
```

**Final copy:**
```
500+ Equipment Exports | 13+ Years | Worldwide Shipping | 5.0 Google Rating | Export Docs | Packing & Crating
```

**Changes:**
- "500+ Shipments" → "500+ Equipment Exports" (more specific)
- "11+ Years" → "13+ Years" (per Q1 — update `foundedYear` to 2013)
- "Air Freight" → "Worldwide Shipping" (matches Q6 decision)
- "Ocean Freight" → "5.0 Google Rating" (social proof, verified from LP)
- "Packing & Compliance" → "Packing & Crating" (more concrete/visual)

**Layout:** Keep `grid-cols-3 lg:grid-cols-6`

**Icons:**
- 500+ Equipment Exports → `TrendingUp`
- 13+ Years → `Clock`
- Worldwide Shipping → `Ship`
- 5.0 Google Rating → `Star`
- Export Docs → `FileText`
- Packing & Crating → `Package`

### 7.3 "Why Choose Us" Differentiators (About Page)

**File:** `app/about/page.tsx`

**Current:**
```
1. Responsive Communication — "Our team is reachable around the clock via WhatsApp."
2. Worldwide Shipping — "We ship to Latin America, Africa, the Middle East, Central Asia, and beyond."
3. Equipment Expertise — "Our technicians specialize in agricultural and industrial machinery."
```

**Final copy (aligned with Q4 all-in-one USP):**
```
1. Icon: Layers (or similar "stack" icon)
   Title: "One Company, Complete Service"
   Description: "Most exporters only handle one part of the chain. We manage the entire process — from equipment pickup at the seller to container loading at port. One point of contact, no handoff risks."

2. Icon: Globe
   Title: "Ship Anywhere With a Port"
   Description: "We coordinate with established ocean carriers like Maersk and Hapag-Lloyd, plus air freight options. Wherever there's a port or airport, we can deliver."

3. Icon: Wrench (or Shield)
   Title: "Equipment Specialists"
   Description: "13+ years handling John Deere combines, Case IH headers, Kinze planters, and CAT machinery. We know the disassembly specs so your equipment reassembles correctly."
```

**Key improvements:**
- Differentiator #1 directly communicates the all-in-one USP (owner's primary competitive advantage from Q4)
- "No handoff risks" addresses buyer fear of equipment changing hands between vendors
- Carrier name-dropping (Maersk, Hapag-Lloyd) adds credibility per Q6 discussion
- "Wherever there's a port or airport" is accurate per owner clarification
- Equipment expertise with brand names for SEO and credibility

### 7.4 Project Descriptions Enhancement

**File:** `content/projects.ts`

**Current format:** Simple description like "Complete dismantling and container packing of a John Deere S670 combine with stripper header for export to Brazil."

**Proposed format:** Add outcome data where available.

This requires owner input — we need to know:
- How many days each project actually took
- Whether equipment arrived in good condition
- Any cost savings vs. alternatives

Since no per-project delivery metrics are available (Q2), enhance descriptions using data already in the content file (transit days, container count/type) and emphasize the all-in-one process:

```
Before: "Complete dismantling and container packing of a John Deere S670 combine with stripper header for export to Brazil."
After: "Complete end-to-end export of a John Deere S670 combine with stripper header to Brazil — pickup, dismantling, documentation, and secure packing into 2x 40ft HC containers."
```

**Pattern:** Each description should emphasize:
- End-to-end / all-in-one language (reinforces USP)
- Container count and type (already in data)
- Transit days (already in data)
- Destination country (already in data)
- Do NOT add fabricated speed/cost metrics

### 7.5 Pricing Page Headline

**File:** `app/pricing/page.tsx`

**Current:**
```
H1: "Equipment Pricing"
Subtitle: "Transparent reference pricing for our machinery export services. Prices are subject to change — contact us for a current quote."
```

**Proposed:**
```
H1: "Equipment Pricing — Transparent & Itemized"
Subtitle: "Reference rates for 60+ equipment types and 20+ shipping routes. Every quote includes detailed line items — no hidden fees."
```

**Key changes:**
- "Transparent & Itemized" addresses hidden cost fear
- "No hidden fees" is a direct objection handler
- Removed defensive "subject to change" language (implied by "reference rates")

### 7.6 CTA Copy Improvements

| Location | Current | Proposed | Rationale |
|----------|---------|----------|-----------|
| Mid-page CTA (homepage) | "Ready to get started?" | "Need equipment shipped?" | More specific, matches intent |
| Video section heading | "Watch Our Operations" | "See How We Pack & Ship Machinery" | Outcome-focused |
| Calculator CTA heading | "Estimate Your Freight Cost in 60 Seconds" | Keep as-is | Already strong |
| Projects page CTA | "Ready to Ship Your Equipment?" | Keep as-is | Already strong |
| Pricing page CTA | "Get an Exact Quote" | Keep as-is | Already strong |

### 7.7 Meta Description Improvements

| Page | Current Description | Proposed Description |
|------|-------------------|---------------------|
| Homepage | (uses layout default — long, generic) | "Full-service machinery export from USA & Canada. Equipment dismantling, container packing, export docs, and shipping to 45+ countries. Get a free quote." |
| About | "Meridian Freight Inc. — Professional Machinery Export & Logistics. Over 10 years of experience..." | "Meridian Freight — 500+ equipment exports to 45+ countries. Iowa HQ with 6 partner warehouses across USA & Canada. Get a free machinery shipping quote." |
| Contact | "Contact Meridian Freight for a free quote on machinery export services. Available 24/7 by phone, WhatsApp, or email." | "Get a free machinery export quote — response within 24 hours. WhatsApp, phone, or email. Serving 45+ countries from USA & Canada." |

---

## 8. Phase 3: Structured Data Expansion

Priority: **P1 — Enables rich snippets, medium effort**

### 8.1 BreadcrumbList JSON-LD

**File:** `components/breadcrumbs.tsx`

**Change:** Generate `BreadcrumbList` JSON-LD alongside the visual breadcrumb navigation.

**Implementation approach:** The component already receives `items` prop with `{ label, href? }`. Add a `<script type="application/ld+json">` block that maps items to `ListItem` entries.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://meridianexport.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://meridianexport.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Machinery Packing" }
  ]
}
```

**Pages affected:** All pages using `<Breadcrumbs>` component (About, Services, Service detail pages, Projects, Pricing, Calculator, FAQ, Contact, Privacy, Terms)

### 8.2 Upgrade Organization → LocalBusiness

**File:** `app/layout.tsx`

**Change:** Change `@type: "Organization"` to `@type: "LocalBusiness"` and add warehouse `areaServed`, `geo` coordinates, and `priceRange`.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Meridian Freight Inc.",
  "url": "https://meridianexport.com",
  "logo": "...",
  "description": "...",
  "address": { ... },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.1219,
    "longitude": -93.0015
  },
  "telephone": "+16415161616",
  "priceRange": "$$",
  "areaServed": [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "Canada" }
  ],
  "contactPoint": { ... },
  "sameAs": [ ... ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "bestRating": "5",
    "ratingCount": "1"
  }
}
```

**Note on aggregateRating:** Only include if we can verify the Google review count. If only 1 verified review exists, `ratingCount: 1` is honest but thin. Owner should confirm review count.

### 8.3 Expand Service Schema

**File:** `app/services/[slug]/page.tsx`

**Change:** Add `image`, `availableLanguage`, and `priceRange` to existing Service JSON-LD.

```diff
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.longDescription,
+   image: `${SITE.url}${SITE.ogImage}`,
+   availableLanguage: ["English", "Russian", "Spanish", "Arabic"],
+   priceRange: "Contact for quote",
    provider: { ... },
    areaServed: ["United States", "Canada"],
    url: `${SITE.url}/services/${slug}`,
  };
```

### 8.4 Add Pricing AggregateOffer Schema

**File:** `app/pricing/page.tsx`

**Change:** Add `AggregateOffer` JSON-LD summarizing the pricing data.

```json
{
  "@context": "https://schema.org",
  "@type": "AggregateOffer",
  "priceCurrency": "USD",
  "offerCount": 64,
  "lowPrice": "800",
  "highPrice": "12000",
  "description": "Reference pricing for machinery packing, container loading, and international shipping services.",
  "seller": {
    "@type": "Organization",
    "name": "Meridian Freight Inc."
  }
}
```

**Note:** `lowPrice`/`highPrice` values need to be verified from `content/pricing.ts` data. These are estimates based on typical equipment packing costs.

---

## 9. Phase 4: Content Gaps & Social Proof

Priority: **P2 — Important but requires owner data**

### 9.1 Testimonials Section (APPROVED)

**Status:** Approved by owner (Q3). Use all 6 testimonials from LP project.

Add a testimonials section to the homepage between ProcessSteps and mid-page CTA.

**Design:** Compact card grid, 2-3 testimonials max.

```
┌─────────────────────────────────────────────────┐
│  bg-white py-16                                  │
│                                                  │
│  Eyebrow: "What Our Clients Say"                │
│  H2: "Trusted by Equipment Buyers Worldwide"    │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ "Saved   │ │ "Sourced │ │ "Saved   │        │
│  │  30%..." │ │  in 24h" │ │  $4,500/ │        │
│  │ Carlos R │ │ Stefan W │ │  year"   │        │
│  │ Colombia │ │ Germany  │ │ Mark R.  │        │
│  │ ⭐⭐⭐⭐⭐│ │ ⭐⭐⭐⭐⭐│ │ Australia│        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  Google ⭐ 5.0 Rating                           │
└─────────────────────────────────────────────────┘
```

**Component:** New `components/testimonials.tsx`
**Data:** New `content/testimonials.ts` with typed testimonial entries

### 9.2 Additional FAQ Entries

**File:** `content/faq.ts`

**Add these entries to address buyer fears identified in copywriting audit:**

| Question | Answer Summary | Category |
|----------|---------------|----------|
| "What happens if my equipment is damaged in transit?" | Insurance details, documentation process, claims procedure | General |
| "Do you handle equipment I've never exported before?" | First-time export support, documentation guidance | General |
| "What countries have you shipped to?" | 45+ countries, list top destinations by region | Shipping |

### 9.3 Social Proof Metrics

**File:** `components/trust-bar.tsx` or new component

**Add verified social proof:**
- Google 5.0 rating badge (if review count confirmed)
- "6,400+ YouTube subscribers" (verified from LP)
- "1,400+ Facebook followers" (verified from LP)

**Decision:** Whether to show these as trust bar items or in a separate "As Seen On" / social strip depends on design review.

---

## 10. Phase 5: Future Opportunities

**NOT in scope for this implementation.** Documented for future planning.

### 10.1 Blog / Content Hub

The site targets only head keywords. A blog would capture long-tail queries:

| Topic | Target Keyword | Search Volume (est.) |
|-------|---------------|---------------------|
| "How to export a combine harvester" | combine harvester export guide | Low-medium |
| "Machinery phytosanitary documentation" | phytosanitary certificate export | Low |
| "Shipping heavy equipment to Brazil" | ship equipment brazil | Medium |
| "John Deere combine shipping cost" | john deere combine shipping | Medium |
| "40ft container loading guide" | 40ft container loading tips | Low-medium |

**Effort:** High. Would need 10-15 posts of 1,500-2,500 words each.

### 10.2 Location Pages

Individual pages for each warehouse location (Iowa, California, Georgia, etc.) would improve local SEO and enable location-specific structured data.

### 10.3 Per-Page OG Images

Custom Open Graph images for each page would improve social sharing CTR. Currently all pages share a single OG image.

### 10.4 Parts Business Integration

The LP reveals a significant parts business that isn't represented on the website at all. Future consideration: add a `/parts` section or link to the parts LP.

---

## 11. Files Changed Summary

### Phase 1: SEO Technical (8 files)

| File | Change |
|------|--------|
| `app/page.tsx` | Add `export const metadata` with homepage keywords |
| `app/about/page.tsx` | Add `keywords` to `pageMetadata()` call |
| `app/projects/page.tsx` | Add `keywords` to `pageMetadata()` call |
| `app/pricing/page.tsx` | Add `keywords` to `pageMetadata()` call |
| `app/faq/page.tsx` | Add `keywords` to `pageMetadata()` call |
| `app/services/page.tsx` | Add `keywords` to `pageMetadata()` call |
| `app/contact/page.tsx` | Add `keywords` to `pageMetadata()` call |
| `app/services/[slug]/page.tsx` | Pass `service.keywords` to metadata |
| `app/layout.tsx` | Trim default title to under 60 chars |

### Phase 2: Copywriting (6-8 files)

| File | Change |
|------|--------|
| `components/hero.tsx` | Update headline, eyebrow, subtitle (pending Q5) |
| `components/trust-bar.tsx` | Add countries, Google rating; remove generic items |
| `app/about/page.tsx` | Rewrite "Why Choose Us" differentiators |
| `content/projects.ts` | Enhance project descriptions (pending owner data) |
| `app/pricing/page.tsx` | Update heading + subtitle |
| `app/page.tsx` | Update mid-page CTA copy, video section heading |
| `components/video-section.tsx` | Update section heading |
| Various `pageMetadata()` calls | Improve meta descriptions |

### Phase 3: Structured Data (4 files)

| File | Change |
|------|--------|
| `components/breadcrumbs.tsx` | Add BreadcrumbList JSON-LD |
| `app/layout.tsx` | Upgrade Organization → LocalBusiness |
| `app/services/[slug]/page.tsx` | Expand Service schema |
| `app/pricing/page.tsx` | Add AggregateOffer schema |

### Phase 4: Content Gaps (4 files)

| File | Change |
|------|--------|
| `content/testimonials.ts` | NEW — testimonial data (6 entries from LP) |
| `components/testimonials.tsx` | NEW — testimonials component |
| `app/page.tsx` | Add testimonials section to homepage |
| `content/faq.ts` | Add 3 new FAQ entries |

---

## 12. Acceptance Criteria

### Phase 1 Complete When:

- [ ] Every page in `app/` has either `export const metadata` or `generateMetadata()` with `keywords`
- [ ] Homepage title renders under 60 characters
- [ ] `npm run build` — 22/22 pages, zero errors
- [ ] Google Rich Results Test passes for homepage structured data

### Phase 2 Complete When:

- [ ] Hero headline reads "From Seller to Port — We Handle Everything" with end-to-end subtitle
- [ ] Trust bar shows "13+ Years", "Worldwide Shipping", "5.0 Google Rating"
- [ ] "Why Choose Us" leads with "One Company, Complete Service" (all-in-one USP)
- [ ] Pricing page headline addresses hidden cost fear ("Transparent & Itemized")
- [ ] All meta descriptions are under 160 chars with clear CTAs
- [ ] No unverifiable speed/cost/delivery rate claims anywhere

### Phase 3 Complete When:

- [ ] BreadcrumbList JSON-LD on every page with breadcrumbs
- [ ] LocalBusiness schema with areaServed in layout
- [ ] Service schema has image, availableLanguage, priceRange
- [ ] Pricing page has AggregateOffer schema
- [ ] All schemas pass Google Rich Results Test

### Phase 4 Complete When:

- [ ] 6 testimonials render on homepage (3 featured, data for all 6)
- [ ] Google 5.0 rating badge visible
- [ ] 3 new FAQ entries added and visible on /faq
- [ ] `npm run build` + `npm run lint` — zero errors

---

## Appendix A: Copywriting Audit Findings

### Page Grades

| Page | Grade | Key Issue |
|------|-------|-----------|
| Homepage | B- | Hero headline generic, could be any logistics company |
| Hero | C+ | "Professional" is meaningless, no risk mitigation |
| Trust Bar | D+ | Stats lack context, zero social proof |
| Service Pages | B | Describes process, not buyer outcomes |
| About Page | B- | "Why Choose Us" differentiators are generic |
| Pricing Page | C | Defensive copy, no transparency guarantee |
| Projects Page | C+ | No buyer outcomes in descriptions |
| FAQ | B | Good coverage, could add risk-mitigation questions |
| Contact Page | B | Functional but not compelling |

### Cross-Cutting Patterns

1. **Process vs. Outcome copy** — "We do X" instead of "You get Y"
2. **No competitive differentiation** — Speed, cost savings, specialization not mentioned
3. **Missing social proof** — Zero testimonials, no case study metrics
4. **Weak urgency** — No mention of equipment delay costs
5. **Generic CTAs** — "Ready to get started?" / "Contact Us"

---

## Appendix B: SEO Audit Findings

### Severity Summary

| Severity | Count | Key Items |
|----------|-------|-----------|
| Critical | 3 | No homepage metadata, no BreadcrumbList schema, no LocalBusiness schema |
| Major | 6 | Keywords unused on 8 pages, no pricing schema, service schema incomplete, no blog |
| Minor | 8 | Title length, meta descriptions, alt tags, hreflang, OG images |

### What's Already Solid

- Sitemap with all 16+ pages
- Robots.txt correctly configured
- Canonical URLs on every page
- FAQPage JSON-LD on FAQ page
- ItemList schema on Projects page
- Organization + WebSite schemas in layout
- Service schema on each service detail page
- GA4 + Meta Pixel + Vercel Analytics
- Security headers (HSTS, CSP, X-Frame-Options)
- Geist fonts via next/font (zero layout shift)
- Custom 404 page

---

## Appendix C: Business Research Data

### LP-Sourced Competitive Advantages

| Feature | Meridian | Typical Competitor |
|---------|----------|-------------------|
| Quote speed (parts) | Under 1 hour | 2-5 business days |
| Cost savings | 25-30% vs. local dealers | Standard pricing |
| Sourcing network | USA + Europe | Single region |
| Consolidated shipping | Yes | No |
| Export documentation | Handled for buyer | Buyer responsibility |
| WhatsApp support | Yes, multilingual | Phone/email only |

### Verified Social Proof Metrics

| Metric | Value | Source |
|--------|-------|--------|
| Google rating | 5.0 stars | LP project |
| YouTube subscribers | 6,400+ | LP project |
| Facebook followers | 1,400+ | LP project |
| Countries served | 45+ | LP project |
| Equipment exports | 500+ | Website constants |
| Years in business | 11 (or 13 — see Q1) | Website / LP |
| Warehouse locations | 7 (1 main + 6 partner) | Website constants |
