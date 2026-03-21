# GA4 PRO Elite Dashboard — Spec & Implementation Plan

**Project:** Meridian Freight Inc. (meridianexport.com)
**Business model:** B2B lead generation — machinery export & logistics
**Primary conversions:** Contact form, freight calculator (email-gated), WhatsApp clicks, phone calls
**Ad platforms:** Google Ads, Meta Ads (both already integrated)
**Date:** 2026-03-21

---

## Current State (Codebase Audit)

### What's Already Implemented ✅

| Feature | Implementation | Files |
|---------|---------------|-------|
| GA4 + Consent Mode v2 | Default-deny, upgrades on cookie accept | `components/google-analytics.tsx` |
| Meta Pixel (consent-gated) | Only loads after cookie acceptance | `components/meta-pixel.tsx` |
| Meta CAPI (server-side) | SHA-256 hashed email/phone, event dedup | `lib/meta-capi.ts` |
| Google Ads tag | Optional, loads via same gtag.js | `components/google-analytics.tsx` |
| UTM + click ID capture | gclid, fbclid, msclkid + 5 UTM params | `lib/tracking.ts`, `components/attribution-capture.tsx` |
| WhatsApp attribution | MF-XXXX ref codes, Supabase storage | `lib/wa-attribution.ts`, `app/api/track/wa-click/` |
| Vercel Analytics + SpeedInsights | Auto page views + Core Web Vitals | `app/layout.tsx` |
| Cookie consent banner | Accept/Decline, localStorage-based | `components/cookie-consent.tsx` |
| Honeypot spam prevention | Silent success for bots | Contact form + calculator |

### GA4 Events Currently Tracked

| Event | Trigger | Location | Parameters |
|-------|---------|----------|------------|
| `generate_lead` | Contact form submit | `contact-form.tsx` | `event_category: "contact"` |
| `generate_lead` | Calculator submit | `calculator-wizard.tsx` | `event_category: "calculator"` |
| `contact_whatsapp` | WhatsApp widget click | `whatsapp-widget.tsx` | `ref_code: "MF-XXXX"` |
| `contact_whatsapp` | Mobile bar WA click | `mobile-bottom-bar.tsx` | `source: "mobile_bar"` |
| `contact_phone` | Phone click (mobile bar only) | `mobile-bottom-bar.tsx` | `source: "mobile_bar"` |

### Meta Pixel Events

| Event | Trigger | Consent Required |
|-------|---------|-----------------|
| `PageView` | Auto on script init | Yes |
| `Lead` | Contact/Calculator success | Yes |
| `Contact` | WhatsApp clicks | Yes |

### Meta CAPI Events (Server-side, No Consent Needed)

| Event | Trigger | Data Sent |
|-------|---------|-----------|
| `Lead` | Contact form success | Hashed email + phone, `lead_source: "corporate_contact_form"` |
| `Lead` | Calculator success | Hashed email, equipment_type, destination_country, container_type |

---

## Gap Analysis: Current → PRO Elite

### Critical Gaps (Phase 1)

| Gap | Current | Required | Impact |
|-----|---------|----------|--------|
| Phone click tracking incomplete | Only mobile-bottom-bar | Track ALL `tel:` links site-wide | Missing ~60% of phone conversions |
| Email click tracking missing | Not tracked | Track all `mailto:` clicks as `contact_email` | Invisible conversion channel |
| Calculator funnel events missing | Only final `generate_lead` | `calculator_start`, `calculator_step`, `calculator_complete` | Can't diagnose calculator drop-off |
| WhatsApp only tracked from 2 places | Widget + mobile bar | Track from ALL ~15 WA link locations | Underreporting WA engagement by ~70% |
| No CTA click tracking | Not tracked | Track all "Get a Quote" / "Contact" buttons with location | Can't optimize CTA placement |
| UTM uses sessionStorage | Lost on tab close | Switch to first-party cookie (30-day) | Breaks multi-session B2B attribution |
| No content_group parameter | Not sent | Send content group on every page_view | Can't segment by page category |
| No conversion values | Events have no $ value | Pass `value` + `currency` on `generate_lead` | Google Ads can't optimize for value |

### Important Gaps (Phase 2)

| Gap | Required Action |
|-----|----------------|
| Custom dimensions not registered | Register 10 event-scoped + 3 user-scoped dims in GA4 Admin |
| Audiences not created | Build 11 remarketing audiences in GA4 |
| No GA4 → Google Ads conversion import | Link GA4, import key events as Ads conversions |
| No Looker Studio dashboard | Build 6-page executive dashboard |
| No client_id storage | Store GA4 client_id in Supabase leads for Measurement Protocol |
| No offline conversion pipeline | Measurement Protocol for qualify_lead, close_convert_lead |

### Nice-to-Have (Phase 3)

| Gap | Action |
|-----|--------|
| No Google Search Console linking | Link GSC for organic keyword data in GA4 |
| No BigQuery export | Enable for advanced cohort analysis |
| No Enhanced Conversions | Send hashed email on Google Ads conversion |
| No server-side GTM | Better ad-blocker resilience |

---

## 1. GA4 Property Configuration

### 1.1 Property Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| Industry category | Business & Industrial Markets | Enables industry benchmarks |
| Reporting time zone | US Central (America/Chicago) | Matches Iowa HQ |
| Currency | USD | All pricing in USD |
| Data retention | 14 months | Maximum for standard; critical for B2B long sales cycles |
| Google Signals | Enable | Cross-device tracking for mobile-research → desktop-convert |

### 1.2 Enhanced Measurement

| Feature | Setting | Reason |
|---------|---------|--------|
| Page views | ON | Core metric |
| Scrolls | ON | 90% depth — useful for long-scroll homepage |
| Outbound clicks | ON | Tracks wa.me links automatically |
| Site search | OFF | No search on site |
| Video engagement | ON | YouTube embed on homepage |
| File downloads | ON | Future-proofing for spec sheets |
| Form interactions | ON | Tracks form_start / form_submit automatically |

### 1.3 Cross-Domain Tracking

Add `chat.meridianexport.com` if cross-linking exists to the chatbot app.

### 1.4 Google Ads Linking

- Link GA4 → Google Ads in Admin > Product Links
- Enable "Personalized Advertising" for audience sharing
- Enable auto-tagging in Google Ads (already captured via gclid)
- Import GA4 key events as Google Ads conversions

---

## 2. Event Taxonomy

### 2.1 Key Events (Mark as Conversions)

| Event Name | Trigger | Parameters | Estimated Value |
|-----------|---------|------------|-----------------|
| `generate_lead` | Contact form submit | `value: 500, currency: "USD", lead_source: "contact_form"` | $500 |
| `generate_lead` | Calculator submit | `value: 300, currency: "USD", lead_source: "freight_calculator"` | $300 |
| `contact_whatsapp` | Any WhatsApp link click | `cta_location, ref_code` | $100 |
| `contact_phone` | Any tel: link click | `cta_location` | $200 |
| `contact_email` | Any mailto: link click | `cta_location` | $50 |

### 2.2 Micro-Conversion Events (Track, Don't Mark as Conversion)

| Event Name | Trigger | Parameters | Implement In |
|-----------|---------|------------|-------------|
| `calculator_start` | User selects first equipment | `equipment_type, container_type` | `calculator-wizard.tsx` |
| `calculator_step` | User advances wizard step | `step_number, step_name` | `calculator-wizard.tsx` |
| `calculator_complete` | User reaches email gate | `equipment_type, country, container_type` | `calculator-wizard.tsx` |
| `cta_click` | Any CTA button click | `cta_location, cta_text, cta_destination` | All CTA components |
| `faq_expand` | FAQ accordion item opened | `faq_question` | `faq-accordion.tsx` |
| `video_play` | Homepage video play | `video_title` | `video-section.tsx` |
| `service_page_view` | Service detail page view | `service_slug` | `services/[slug]/page.tsx` |
| `equipment_page_view` | Equipment page view | `equipment_type` | `equipment/[slug]/page.tsx` |
| `destination_page_view` | Destination page view | `destination_country` | `destinations/[slug]/page.tsx` |

### 2.3 Future Events (CRM Integration — Measurement Protocol)

| Event | When | Source |
|-------|------|--------|
| `qualify_lead` | Sales qualifies lead | Supabase → Measurement Protocol |
| `disqualify_lead` | Lead disqualified | Supabase → Measurement Protocol |
| `close_convert_lead` | Deal won | Supabase → Measurement Protocol |
| `close_unconvert_lead` | Deal lost | Supabase → Measurement Protocol |

---

## 3. Custom Dimensions & Metrics

### 3.1 Event-Scoped Custom Dimensions (Register in GA4 Admin)

| Dimension Name | Event Parameter | Purpose |
|---------------|----------------|---------|
| Lead Source | `lead_source` | "contact_form" vs "freight_calculator" vs "whatsapp" |
| Equipment Type | `equipment_type` | What equipment the lead wants to ship |
| Container Type | `container_type` | "fortyhc" or "flatrack" |
| Destination Country | `destination_country` | Target shipping destination |
| CTA Location | `cta_location` | hero / header / footer / mobile_bar / etc. |
| Service Slug | `service_slug` | Which service page drove interaction |
| WhatsApp Ref Code | `ref_code` | MF-XXXX code for WA attribution |
| Calculator Step | `step_name` | Which wizard step user is on |
| Form Type | `form_type` | "contact" or "calculator" |
| Content Group | `content_group` | Page category (see section 4) |

### 3.2 User-Scoped Custom Dimensions

| Dimension | User Property | Purpose |
|-----------|--------------|---------|
| First Lead Source | `first_lead_source` | How user first converted |
| Has Submitted Lead | `has_submitted_lead` | Boolean for audience building |
| Country of Interest | `country_of_interest` | Last country selected in calculator |

### 3.3 Custom Metrics

| Metric | Event Parameter | Unit | Purpose |
|--------|----------------|------|---------|
| Estimated Quote Value | `quote_value` | Currency (USD) | Calculator estimate total |

---

## 4. Content Grouping

| Content Group | URL Pattern | Pages |
|--------------|-------------|-------|
| Homepage | `/` (exact) | Homepage long-scroll |
| Services | `/services`, `/services/*` | Overview + 6 service pages |
| Equipment | `/equipment/*` | Equipment type pages |
| Destinations | `/destinations`, `/destinations/*` | Overview + country pages |
| Pricing | `/pricing` | Static pricing table |
| Calculator | `/pricing/calculator` | Freight calculator (lead magnet) |
| Projects | `/projects` | Portfolio gallery |
| About | `/about` | Company story |
| Contact | `/contact` | Contact form |
| FAQ | `/faq` | FAQ page |
| Blog | `/blog`, `/blog/*` | Blog posts |
| Legal | `/privacy`, `/terms` | Privacy + Terms |

---

## 5. Audiences (Remarketing & Analysis)

Build in GA4 Admin > Audiences and share to Google Ads:

| Audience | Definition | Duration | Use Case |
|----------|-----------|----------|----------|
| All Leads | `generate_lead` fired | 180 days | Exclude from prospecting (don't re-acquire) |
| Calculator Users (No Submit) | Visited `/pricing/calculator` BUT NO `generate_lead` | 90 days | Retarget: "Complete your quote" |
| High-Intent Visitors | 3+ pages AND viewed pricing/calculator | 60 days | Retarget as warm prospects |
| WhatsApp Engagers | `contact_whatsapp` fired | 90 days | Cross-sell / upsell retargeting |
| Pricing Page Visitors | Viewed `/pricing` or `/pricing/calculator` | 90 days | Bottom-funnel retargeting |
| Contact Page Abandoners | Visited `/contact` BUT NO `generate_lead` | 30 days | "Still have questions?" retargeting |
| Equipment Researchers | Viewed 2+ `/equipment/*` pages | 60 days | Equipment-specific ads |
| Destination Researchers | Viewed `/destinations/*` | 90 days | Destination-specific messaging |
| Service Page Browsers | Viewed 2+ `/services/*` pages | 60 days | Service-specific ads |
| Returning Visitors (No Lead) | Session count >= 2, NO `generate_lead` | 90 days | Warm audience, conversion push |
| Blog Readers | Viewed 2+ `/blog/*` pages | 60 days | Content-engaged, nurture |

---

## 6. Attribution Model

### Recommended: Data-Driven Attribution (DDA)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Reporting model | Data-driven | ML-based, evaluates all touchpoints |
| Acquisition lookback | 90 days | Matches B2B machinery buying cycle (30-180 days) |
| All other lookback | 90 days | Same |

**Why NOT last-click:** Typical Meridian buyer journey:
1. Google Ads click (awareness) → 2. Organic search return (research) → 3. Direct visit to pricing (consideration) → 4. WhatsApp click from calculator (conversion)

Last-click credits only step 4. DDA distributes credit across all touchpoints.

### Attribution Gaps & Mitigations

| Gap | Mitigation |
|-----|-----------|
| GCLID expires after 90 days | Import offline conversions within 90 days |
| Cross-device journeys | Google Signals enabled |
| WhatsApp conversations off-site | MF-XXXX ref codes (already implemented) |
| Offline deal closure | Measurement Protocol: `close_convert_lead` with deal value |

---

## 7. UTM Strategy

### 7.1 Naming Convention (always lowercase)

| Parameter | Convention | Examples |
|-----------|-----------|----------|
| `utm_source` | Platform name | `google`, `meta`, `linkedin`, `email`, `whatsapp` |
| `utm_medium` | Channel type | `cpc`, `cpm`, `social`, `email`, `referral` |
| `utm_campaign` | `{region}_{product}_{objective}_{yearQquarter}` | `us_combines_lead_gen_2026q1` |
| `utm_term` | Keyword/targeting | `used+combine+harvester+export` |
| `utm_content` | Ad variant/CTA | `headline_v2`, `cta_whatsapp`, `video_ad` |

### 7.2 Example URLs

**Google Ads Search:**
```
meridianexport.com/pricing/calculator?utm_source=google&utm_medium=cpc&utm_campaign=us_combines_lead_gen_2026q1&utm_term=combine+harvester+export
```

**Meta Ads Retargeting:**
```
meridianexport.com/services/ocean-freight?utm_source=meta&utm_medium=cpm&utm_campaign=us_farm_equipment_retargeting_2026q1&utm_content=carousel_equipment
```

**WhatsApp Broadcast:**
```
meridianexport.com/pricing?utm_source=whatsapp&utm_medium=social&utm_campaign=wa_broadcast_spring_2026
```

### 7.3 UTM Storage Fix

**Current:** `sessionStorage` (lost on tab close — breaks multi-session B2B attribution)
**Required:** First-party cookie with 30-day expiry, falling back to sessionStorage

---

## 8. Looker Studio Dashboard (6 Pages)

### Page 1: Executive Summary
- KPI scorecards: Total Leads (MTD/QTD/YTD), Lead Conversion Rate, CPL, WhatsApp Clicks
- Lead trend line (daily/weekly toggle)
- Leads by source (pie chart)
- Leads by destination country (bar chart)
- Top 5 landing pages by lead generation

### Page 2: Traffic & Engagement
- Sessions by source/medium (table with sparklines)
- New vs returning visitors
- Engagement rate by channel
- Avg engagement time by content group
- Scroll depth distribution (homepage)

### Page 3: Lead Pipeline
- Funnel: Visitor → Engaged → Calculator Start → Email Gate → Lead
- Calculator completion rate
- Contact form completion rate
- WhatsApp click rate by page
- Lead source attribution (DDA)

### Page 4: Campaign Performance
- Google Ads: impressions, clicks, CTR, CPC, leads, CPL
- Meta Ads: reach, clicks, leads, CPL
- Campaign comparison (bar chart)
- UTM campaign breakdown (all channels)

### Page 5: Content & SEO
- Organic traffic trend
- Top organic landing pages
- Organic leads by landing page
- Blog post performance
- Equipment page popularity ranking
- Service page engagement metrics

### Page 6: Geographic Insights
- Leads by user country (map)
- Leads by destination country (from calculator)
- Top shipping corridors (origin → destination)
- Sessions by country

---

## 9. Google Ads Conversion Setup

| Conversion Action | Source | Counting | Value | Window |
|------------------|--------|----------|-------|--------|
| Contact Form Lead | GA4 `generate_lead` (form) | One per click | $500 | 90 days |
| Calculator Lead | GA4 `generate_lead` (calculator) | One per click | $300 | 90 days |
| WhatsApp Click | GA4 `contact_whatsapp` | One per click | $100 | 90 days |
| Phone Call Click | GA4 `contact_phone` | One per click | $200 | 90 days |
| Offline Conversion | Offline import API | One per click | Actual deal value | 90 days |

### Bid Strategies

| Campaign Type | Bid Strategy |
|--------------|-------------|
| Search (brand) | Maximize conversions |
| Search (non-brand) | Target CPA or Maximize conversion value |
| Performance Max | Maximize conversion value |
| Display (retargeting) | Target CPA |

---

## 10. KPIs Framework

### Primary KPIs (Report Weekly)

| KPI | Formula | Target |
|-----|---------|--------|
| Total Leads | Count of `generate_lead` | Track trend |
| Cost Per Lead | Ad spend / Total Leads | < $150 |
| Lead Conversion Rate | Leads / Sessions | > 2% |
| Calculator Completion Rate | Calculator leads / Calculator starts | > 25% |
| WhatsApp Click Rate | WA clicks / Sessions | Track trend |
| Engagement Rate | Engaged sessions / Sessions | > 50% |

### Secondary KPIs (Report Monthly)

| KPI | Formula | Target |
|-----|---------|--------|
| CAC | Total marketing spend / Customers | Track |
| Lead-to-Customer Rate | Customers / Leads | Track (needs CRM) |
| Avg Quote Value | Avg `quote_value` from calculator | Track |
| Organic Traffic Share | Organic sessions / Total | Growing trend |
| Pages per Session | Avg page views / Session | > 2.5 |

---

## 11. Implementation Plan

### Phase 1: Foundation (Week 1–2) — CODE CHANGES

1. Add `contact_phone` tracking to ALL tel: links (header, footer, contact-info, contact page)
2. Add `contact_email` tracking to ALL mailto: links
3. Add calculator funnel events: `calculator_start`, `calculator_step`, `calculator_complete`
4. Track WhatsApp clicks from ALL ~15 locations (not just widget + mobile bar)
5. Add `cta_click` tracking to all CTA buttons with `cta_location` param
6. Add `content_group` parameter to page views
7. Add `video_play` event to video section
8. Add `faq_expand` event to FAQ accordion
9. Switch UTM storage from sessionStorage → first-party cookie (30-day)
10. Add `value` + `currency` params to `generate_lead` events
11. Store GA4 `client_id` in Supabase leads table

### Phase 2: GA4 Admin (Week 3–4) — MANUAL IN GA4 UI

1. Register all 10 event-scoped custom dimensions
2. Register 3 user-scoped custom dimensions
3. Register 1 custom metric (quote_value)
4. Mark 5 events as Key Events (conversions)
5. Create 11 remarketing audiences
6. Link GA4 → Google Ads → import key events
7. Set conversion values in Google Ads
8. Set attribution model to Data-Driven, 90-day lookback
9. Enable Google Signals
10. Set data retention to 14 months

### Phase 3: Dashboards (Week 5–6) — LOOKER STUDIO

1. Build 6-page Looker Studio dashboard
2. Connect GA4 as data source
3. Connect Google Ads as data source
4. Set up automated email delivery (weekly to stakeholders)
5. Link Google Search Console to GA4

### Phase 4: Advanced (Ongoing)

1. Build offline conversion pipeline (Supabase → Measurement Protocol)
2. Enable BigQuery export for advanced analysis
3. Implement Enhanced Conversions for Google Ads
4. Weekly KPI review cadence
5. Quarterly attribution model review

---

## 12. Files to Modify (Phase 1 Code Changes)

| File | Changes |
|------|---------|
| `lib/tracking.ts` | Add `trackCtaClick()`, `trackPhoneClick()`, `trackEmailClick()` helpers; switch UTM to cookie storage; add `getGA4ClientId()` |
| `components/google-analytics.tsx` | Add content_group config parameter |
| `components/freight-calculator/calculator-wizard.tsx` | Add `calculator_start`, `calculator_step`, `calculator_complete` events |
| `components/contact-form.tsx` | Add `value: 500, currency: "USD"` to generate_lead |
| `components/header.tsx` | Add phone + WA click tracking |
| `components/footer.tsx` | Add phone + email + WA click tracking |
| `components/contact-info.tsx` | Add phone + email + WA click tracking |
| `components/hero.tsx` | Add WA CTA click tracking |
| `components/video-section.tsx` | Add `video_play` + WA click tracking |
| `components/faq-accordion.tsx` | Add `faq_expand` event |
| `components/mobile-bottom-bar.tsx` | Add `cta_location` param to existing events |
| `components/whatsapp-widget.tsx` | Add `cta_location: "widget"` param |
| `app/actions/contact.ts` | Store `client_id` in Supabase |
| `app/actions/calculator.ts` | Store `client_id` in Supabase, add quote_value |
| Dynamic pages (`services/[slug]`, `equipment/[slug]`, `destinations/[slug]`) | Add page-type-specific view events |
