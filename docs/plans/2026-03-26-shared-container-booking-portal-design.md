# Shared Container Booking Portal — Design Document

**Date:** 2026-03-26
**Status:** Approved
**Author:** Claude Code (brainstorming session with Alex)

---

## 1. Product Vision

**What:** A public page on meridianexport.com (`/shared-shipping`) where customers browse available container space on Meridian's outbound shipments and submit booking requests.

**Why:** Monetize unused container capacity. Convert manual "we have space, know anyone?" calls into a self-service discovery tool that generates qualified leads 24/7. Previously done manually for specific countries — now digitized.

**Model:** "Browse & Request" — customers see what's available, submit a request form, team reviews and quotes manually. No instant booking, no payments, no holds.

**Analogy:** Airline seat map for container CBM. Customers see what's available, request a spot, team handles allocation.

**Name:** "Shared Shipping"

---

## 2. Research & Competitive Landscape

### Industry Context

- LCL (Less than Container Load) and SCL (Shared Container Load) are established freight services
- 74% of mid-market firms transitioned to smaller, more frequent shipments (2025 Logistics Performance Index)
- CBM (cubic meters) is the universal unit for container space

### Competitors / Inspiration

| Platform | Model | Key Feature |
|----------|-------|-------------|
| ShipTogether | "Uber Pool" pools | CBM utilization, fill rate, price/CBM |
| Silq SCL | Max 2-3 shippers/container | Guaranteed matching, FCL-level speed |
| IVSS Container Share | Deposit → match → confirm | Quote-first flow |
| UPakWeShip | Self-pack shared containers | Simple quote→pay→ship |
| Freightos | Full digital marketplace | Instant pricing, comparison |

### Meridian's Unique Advantage

Unlike platforms that match strangers, Meridian already **owns** the containers with known available space. No two-sided marketplace cold-start problem. The data exists (Google Sheets), the ops workflow exists — this feature digitizes discovery.

---

## 3. Information Architecture

### Route

```
/[locale]/shared-shipping   ← New top-level page in main navigation
```

Added to NAV_ITEMS between "Pricing" and "FAQ" (or after "Services").

### Page Structure

```
Header (existing)
├── Hero Section — headline, subtitle, value props
├── Filter Bar — destination filter, sort, "last updated" timestamp
├── Container Grid — responsive card grid (3 col desktop, 1 col mobile)
│   └── ContainerCard × N
├── How It Works — 3-step process (Browse → Request → Ship)
├── FAQ — common questions about shared shipping
├── CTA Section — "Don't see your destination? Contact us"
└── Footer (existing)
```

---

## 4. UI/UX Design

### Container Card

Each card displays:
- **Country flag + route**: "Chicago, IL → Almaty, Kazakhstan"
- **Container type**: 40HC, Flatrack, etc.
- **Dates**: Departure date, ETA, transit time
- **Space**: Progress bar (% booked) + CBM available
- **Demand indicator**: Pending request count or "Popular" badge
- **CTA**: "Request Space →" button

### Card States

| State | Condition | Visual Treatment |
|-------|-----------|-----------------|
| Available | < 50% booked | Blue progress bar, standard card |
| Filling Up | 50-80% booked | Blue progress bar, pending count if any |
| Limited | ≥ 80% booked | Amber progress bar, "Limited Space" badge |
| Popular | 3+ pending requests | "🔥 Popular" badge (overlays fill state) |
| Departing Soon | < 3 days to departure | "Departing Soon" red badge |
| Full | 0 CBM / 100% booked | Gray progress bar, opacity-75, CTA → "Contact Us" |
| Departed | Past departure date | Hidden from default view |

### Progress Bar Colors

```
< 80% booked:  bg-primary (Blue-600)
≥ 80% booked:  bg-amber-500
100% booked:   bg-muted (zinc)
```

### Responsive Behavior

- **Mobile (< 640px)**: Single column, full-width cards, Sheet (bottom drawer) for form
- **Tablet (640-1024px)**: 2-column grid, Dialog for form
- **Desktop (> 1024px)**: 3-column grid (auto-fit, minmax(340px, 1fr)), Dialog for form

### Animations

Using existing motion tokens (DURATION, EASE, STAGGER from lib/motion.ts):
- Card entrance: staggered fade-in (opacity + y:20→0, STAGGER.grid delay)
- Card hover: scale 1.02 (desktop only)
- Progress bar fill: animated width on mount (DURATION.slow)
- Filter change: AnimatePresence with layoutId for smooth card re-ordering

### Empty States

- **No containers**: Illustration + "No containers available right now" + phone/WhatsApp contact
- **No filter results**: "No containers heading to [X]. Clear filters or contact us"
- **Loading**: 3 skeleton cards (Skeleton component)

### Stale Data Banner

- Fresh (< 30 min): No indicator
- Aging (30 min – 2 hrs): Subtle "Updated X minutes ago" text
- Stale (2 – 24 hrs): Yellow alert banner
- Critical (> 24 hrs): Red banner with phone number fallback

---

## 5. Booking Request Form

### Layout

- Desktop: shadcn Dialog
- Mobile: shadcn Sheet (bottom drawer)

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text input | Yes | max 200 chars |
| Email | email input | Yes | |
| Phone / WhatsApp | text input | Yes | max 50 chars |
| What are you shipping? | textarea | Yes | min 5, max 2000 chars |
| (container ref) | hidden | Auto | Project number auto-attached |
| (honeypot) | hidden | — | "website" field, anti-spam |
| (UTM params) | hidden | Auto | Captured from URL |

### Validation Schema

```typescript
const bookingRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(50),
  cargoDescription: z.string().min(5).max(2000),
  containerId: z.string().uuid(),
  projectNumber: z.string().min(1),
  website: z.string().optional(),        // honeypot
  sourcePage: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});
```

### Server Action Pipeline

```
submitBookingRequest(formData)
├── ① Zod validation
├── ② Honeypot check (silent discard if filled)
├── ③ Container status re-check (race condition guard)
│     If status ≠ 'available' → error: "container no longer available"
├── ④ Dedup check (same email + container within 5 min)
│     If duplicate → return existing confirmation (idempotent)
├── ⑤ Supabase INSERT → space_booking_requests
├── ⑥ Resend email → team (MUST succeed)
│     Includes: customer info, container details, pending request count
├── ⑦ RETURN success to customer
└── ⑧ after() background tasks:
      ├── Resend auto-reply → customer
      ├── Slack notification
      ├── Meta CAPI Lead event
      ├── Vercel Analytics track("booking_request")
      └── GA4 generate_lead (value: $200)
```

### Post-Submit UX

Success screen shows:
- Confirmation message with container reference
- "What happens next" 3-step timeline
- WhatsApp contact for questions
- "Browse More Containers" link

---

## 6. Data Architecture

### New Supabase Tables

#### shared_containers

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| project_number | TEXT UNIQUE | From Google Sheet column G |
| origin | TEXT NOT NULL | Column E |
| destination | TEXT NOT NULL | Column S |
| destination_country | TEXT | ISO 2-letter, parsed from destination |
| departure_date | DATE NOT NULL | Column I |
| eta_date | DATE | Column L |
| container_type | TEXT | Default '40HC' |
| total_capacity_cbm | NUMERIC | Default 76 (40HC standard) |
| available_cbm | NUMERIC | Column Y (parsed) |
| status | TEXT | 'available' / 'full' / 'departed' / 'unlisted' / 'cancelled' |
| notes | TEXT | Optional |
| source | TEXT | 'google_sheets' (future: 'portal') |
| sheet_row_number | INTEGER | For debugging |
| raw_space_value | TEXT | Original sheet value before parsing |
| synced_at | TIMESTAMPTZ | Last sync timestamp |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Indexes:
- `UNIQUE(project_number)`
- `(status, departure_date) WHERE status = 'available'`
- `(destination_country)`

#### space_booking_requests

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| container_id | UUID → shared_containers | FK |
| project_number | TEXT NOT NULL | Denormalized for convenience |
| name | TEXT NOT NULL | |
| email | TEXT NOT NULL | |
| phone | TEXT | |
| cargo_description | TEXT NOT NULL | |
| status | TEXT | 'new' / 'contacted' / 'quoted' / 'booked' / 'cancelled' |
| source_page | TEXT | |
| utm_source/medium/campaign | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Indexes:
- `UNIQUE(email, container_id, created_at::date)` — dedup within same day

#### sync_log

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| source | TEXT | 'google_sheets' |
| status | TEXT | 'success' / 'partial' / 'failed' |
| rows_fetched | INTEGER | |
| rows_upserted | INTEGER | |
| rows_skipped | INTEGER | |
| rows_errored | INTEGER | |
| error_details | JSONB | Array of {row, field, raw, error} |
| duration_ms | INTEGER | |
| started_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |

### Computed Fields (Application Layer)

Fill percentage, demand level, and card state are computed at render time:

```
fillPercent = round((1 - available_cbm / total_capacity_cbm) * 100)
isDepartingSoon = departure_date - today <= 3 days
isLimited = fillPercent >= 80
isFull = available_cbm = 0 OR status = 'full'
demandLevel = pending_count == 0 → null, <= 2 → 'pending', > 2 → 'popular'
```

---

## 7. Google Sheets → Supabase Sync Pipeline

### Architecture

```
Google Sheets (ops team) → Vercel Cron (every 15 min) → Supabase
                                                              ↓
                                                     Website (ISR, revalidated on sync)
```

### Authentication

- Google Cloud Service Account (read-only access)
- Sheet shared with service account email
- No OAuth, no token refresh — permanent credentials
- **Direct REST API with fetch** (not googleapis npm package — lighter)

### Cron Configuration

```jsonc
// vercel.json
{
  "crons": [{ "path": "/api/cron/sync-containers", "schedule": "*/15 * * * *" }]
}
```

### Column Detection

Columns found by header name (not position), supporting Russian + English:

```
"Номер проекта" / "Project #"     → project_number
"откуда грузится" / "Origin"       → origin
"куда идет" / "Destination"        → destination
"дата выхода" / "Departure"        → departure_date
"ETA"                               → eta_date
"Space available" / "Свободно"     → space_available
```

If required columns are missing → ABORT sync, log error.

### Date Parsing Chain

1. ISO format: "2026-04-15"
2. Google Sheets serial number (> 40000)
3. DD.MM.YYYY: "15.04.2026"
4. MM/DD/YYYY: "04/15/2026"
5. If all fail → skip row, log warning

### Space Available Parsing

1. Extract first number via regex: `/[\d]+\.?\d*/`
2. If "%" → compute CBM from total_capacity
3. If no number → set available_cbm = NULL, store raw value, hide from portal

### Sync Algorithm

```
① AUTH: Service Account JWT → Google Sheets REST API v4
② FETCH: Get all values from specified tab
③ DETECT COLUMNS: Scan header row for known column names
④ PARSE ROWS: Multi-format parsing with skip/error tracking
⑤ SAFETY GATE: Abort if 0 parsed rows or > 80% error rate
⑥ UPSERT: Batch to shared_containers ON CONFLICT (project_number)
⑦ HANDLE STALE: Rows in DB but not in sheet → 'unlisted' or 'departed'
⑧ AUTO-EXPIRE: Past departure → 'departed', 0 CBM → 'full'
⑨ REVALIDATE: Call revalidatePath('/shared-shipping') for instant page update
⑩ LOG: Insert to sync_log with metrics
⑪ ALERT: Slack notification if sync failed or high error rate
```

### Safety Mechanisms

| Threat | Protection |
|--------|-----------|
| Sheet temporarily empty | Anti-wipe: abort if 0 parsed rows |
| Google API outage | Cached data in Supabase + stale banner |
| Columns moved/inserted | Header-based detection |
| Merged cells | Null-safe parsers, row skipped |
| Multiple date formats | 4-format parse chain |
| Unparsable space value | NULL CBM, hidden from portal |
| Duplicate project numbers | Upsert (last wins) |
| Empty trailing rows | Skip all-empty rows |

### Future: Portal Direct-Write

When chat.meridianexport.com replaces Google Sheets:
- Writes directly to `shared_containers` with `source = 'portal'`
- Disable the cron job
- Zero changes to customer-facing website

---

## 8. Race Conditions & Double-Booking

### Key Design Decision

Pending requests do NOT reserve space. Multiple customers can request the same container. Team manages allocation manually. This avoids phantom holds.

### Protections by Layer

**Client:**
- Button disable on submit (anti-double-click)
- "Request" language, not "Book" (expectation management)
- "Last updated" timestamp
- Optimistic re-fetch when form opens

**Server (Server Action):**
- Re-check container status before processing
- Dedup: same email + container within 5 minutes → return existing
- Pending request count included in team notification

**Database:**
- Unique constraint: (email, container_id, date) prevents same-day duplicates
- Status enum enforced via CHECK constraint
- Soft deletes only

**Notification:**
- Every team notification includes pending request count
- "Remember to update availability in Google Sheets" reminder
- Auto-notify pending requesters if container departs

---

## 9. Analytics & SEO

### Custom Events

| Event | Trigger | GA4 | Pixel | CAPI | Vercel |
|-------|---------|-----|-------|------|--------|
| container_view | Page load | ✅ | — | — | ✅ |
| container_filter | Filter change | ✅ | — | — | — |
| booking_request_start | Form open | ✅ | — | — | ✅ |
| generate_lead | Form submit | ✅ $200 | ✅ Lead | ✅ Lead | ✅ |

### SEO

- JSON-LD: Service schema with area served from DB
- Meta description: ~150 chars, keyword-optimized
- OG image: reuse existing /og.jpg (or create dedicated)
- Sitemap: priority 0.9, changeFrequency 'daily'
- Canonical URL via existing pageMetadata() helper

### i18n

All text via next-intl. New namespace: `SharedShipping.*`
Three locales: en, es, ru.

---

## 10. File Structure

```
app/[locale]/shared-shipping/page.tsx       ← Main page (Server Component)
app/actions/booking.ts                      ← Server Action
app/api/cron/sync-containers/route.ts       ← Cron endpoint

components/shared-shipping/
├── container-grid.tsx                      ← Filterable card grid (client)
├── container-card.tsx                      ← Individual card (client)
├── container-card-skeleton.tsx             ← Loading skeleton
├── booking-request-dialog.tsx              ← Modal/sheet form (client)
├── destination-filter.tsx                  ← Filter dropdown (client)
├── stale-data-banner.tsx                   ← Freshness warning (client)
├── empty-state.tsx                         ← No containers (server)
└── how-it-works.tsx                        ← 3-step process (server)

lib/google-sheets.ts                        ← Google Sheets REST API client
lib/sync-containers.ts                      ← Sync pipeline logic
lib/types/shared-shipping.ts                ← Types
lib/schemas.ts                              ← (extend with bookingRequestSchema)

content/shared-shipping-faq.ts              ← FAQ entries
```

### New shadcn/ui Components Needed

- `Progress` — for fill percentage bars
- (All others already installed)

### New npm Packages

- None (using direct REST API for Google Sheets, no googleapis)

---

## 11. Environment Variables (New)

| Variable | Purpose | Required |
|----------|---------|----------|
| GOOGLE_SERVICE_ACCOUNT_EMAIL | Sheets API auth | Yes |
| GOOGLE_PRIVATE_KEY | Sheets API auth | Yes |
| GOOGLE_SPREADSHEET_ID | Which spreadsheet to read | Yes |
| GOOGLE_SHEET_TAB_NAME | Which tab (default: first) | No |

Added via: `printf 'value' | vercel env add NAME production preview development`

---

## 12. MVP Scope vs. v2

### MVP (This Build)

- Container grid page with filters and sort
- Card states (available → limited → full → departed)
- Booking request form (Dialog/Sheet)
- Google Sheets → Supabase sync (cron, 15 min)
- On-demand ISR revalidation post-sync
- Team notifications (email + Slack)
- All 25 edge case protections
- Analytics (GA4 + Pixel + CAPI + Vercel)
- i18n (en/es/ru)
- SEO (JSON-LD, OG, sitemap)

### Deferred to v2

- Timeline/Gantt view toggle
- Route interest / waitlist email capture for full containers
- Customer request status lookup page
- Webhook integration with chat.meridianexport.com
- Email notifications for new matching routes
- Customer accounts with booking history
- Online deposit payment (Stripe)
- CBM calculator tool
- "Match me" — customer posts cargo, system finds containers
