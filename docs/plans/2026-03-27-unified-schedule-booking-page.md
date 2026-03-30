# Unified Schedule + Booking Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge `/shared-shipping` (booking wizard) and `/schedule` (tracking) into a single page at `/schedule` with inline booking on available container rows.

**Architecture:** The schedule page becomes the single entry point for both browsing and booking. Available containers render with an expanded card that includes a capacity bar and an expandable inline booking form (replaces the 4-step wizard). Non-bookable containers (departed, full) render as info-only rows. `/shared-shipping` becomes a permanent redirect. One nav item ("Shipping Schedule") replaces two.

**Tech Stack:** Next.js 16 App Router, React 19, shadcn/ui (Collapsible, Card, Badge, Input, Label, Textarea, Button, Separator), next-intl, Zod, Supabase REST API, Resend, Vercel Analytics.

---

## Context: What Exists Today

| Page | Components | Data Source | Purpose |
|------|-----------|-------------|---------|
| `/shared-shipping` | ShippingWizard (1,123 lines), StaleDataBanner, EmptyState | `fetchAvailableContainers()` — status=available/full + pending counts | 4-step booking wizard |
| `/schedule` | ScheduleList, ScheduleRow, ScheduleFilterBar, ScheduleStats, TransitProgress, ScheduleEmptyState | `fetchScheduleContainers()` — status=available/full/departed, last 60 days | Read-only tracking |

**Key problem:** Two pages for one user intent ("When is the next container to my country, and can I get space?"). "Book Space" on schedule links to `/shared-shipping` with no context — user must re-select everything.

---

## Target Architecture

**Single page:** `/schedule` ("Shipping Schedule")

### Page Layout (top → bottom)

```
┌─────────────────────────────────────┐
│ PageHero + ScheduleStats            │  ← Existing hero + 4 stats (add "bookable" count)
│   "N containers with available space"│
├─────────────────────────────────────┤
│ StaleDataBanner                     │  ← Existing (shared component)
├─────────────────────────────────────┤
│ ScheduleFilterBar (sticky)          │  ← Existing tabs + country filter
│   All | Upcoming★ | In Transit | ✓  │     ★ badge shows bookable count
├─────────────────────────────────────┤
│ Container List (grouped)            │
│                                     │
│ ── Departing This Week ──           │
│ [BookableRow] NRD69 → Ukraine       │  ← Expanded: capacity bar + "Book Space" button
│ [BookableRow] D013 → Kazakhstan     │
│                                     │
│ ── Departing This Month ──          │
│ [BookableRow] NRD70 → Ukraine       │
│ [ScheduleRow] NRD66 → TBD (full)   │  ← Info only, no booking
│                                     │
│ ── In Transit ──                    │
│ [ScheduleRow] D005 → TBD           │  ← Transit progress bar
│ [ScheduleRow] D007 → TBD           │
│                                     │
│ ── Recently Arrived ──              │
│ [ScheduleRow] D002 → Klaipeda      │  ← Checkmark, delivered
│                                     │
├─────────────────────────────────────┤
│ FAQ Accordion                       │  ← Moved from shared-shipping
├─────────────────────────────────────┤
│ CTA Section                         │  ← "Need space? WhatsApp us"
└─────────────────────────────────────┘
```

### BookableRow Expanded (when user clicks "Book Space")

```
┌─────────────────────────────────────────────┐
│ NRD69  Albion, IA → Ukraine   Apr 1  40HC   │  ← Route + dates (same as ScheduleRow)
│ ████████████░░░░░░  11.4 CBM available (15%)│  ← Capacity bar
│ ● 2 other requests pending                  │  ← Demand indicator
│                                             │
│ [▼ Book Space]  ← Click expands:           │
│ ┌─────────────────────────────────────────┐ │
│ │ What are you shipping?                  │ │
│ │ [Headers] [Tractor] [Combine] [Parts]…  │ │  ← Horizontal chip toggles
│ │                                         │ │
│ │ Details (optional)                      │ │
│ │ [________________________________]      │ │
│ │                                         │ │
│ │ Your info                               │ │
│ │ Name*    [________________]             │ │
│ │ Email*   [________________]             │ │
│ │ Phone*   [________________]             │ │
│ │                                         │ │
│ │ [🔒 Submit Request →]                   │ │
│ │ By submitting, you agree to our Terms…  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Data Layer Changes

### New function: `fetchScheduleContainersWithBookingData()`

Replaces both `fetchAvailableContainers()` and `fetchScheduleContainers()` for the unified page. Returns `ContainerWithPendingCount[]` — all schedule containers with pending booking counts merged in.

```typescript
// In lib/supabase-containers.ts
export async function fetchScheduleContainersWithBookingData(): Promise<ContainerWithPendingCount[] | null> {
  // 1. Fetch all containers (available + full + departed) from last 60 days
  // 2. For containers with status=available, fetch pending request counts
  // 3. Merge and return
}
```

The existing `fetchAvailableContainers()` and `fetchScheduleContainers()` remain for backward compat but the page uses only the new function.

---

## i18n Changes

### New namespace: `ScheduleBooking` (inline booking form strings)

Extracted from `ShippingWizard` — only the booking-relevant keys:

```json
{
  "ScheduleBooking": {
    "bookSpace": "Book Space",
    "collapse": "Cancel",
    "whatAreYouShipping": "What are you shipping?",
    "cargoTypes": { "header": "Headers", "tractor": "Tractor", ... },
    "addDetails": "Add details — model, quantity, size (optional)",
    "placeholderDetails": "e.g. John Deere 635FD, 35ft, 2 units...",
    "yourInfo": "Your info",
    "fullName": "Full Name",
    "email": "Email",
    "phoneWhatsApp": "Phone / WhatsApp",
    "placeholderName": "John Smith",
    "placeholderEmail": "john@company.com",
    "placeholderPhone": "+1 (555) 000-0000",
    "submitting": "Submitting...",
    "submitRequest": "Submit Request",
    "termsAgreement": "By submitting, you agree to our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>.",
    "errorDefault": "Something went wrong. Please try again or contact us via WhatsApp.",
    "requestSubmitted": "Request Submitted",
    "successMessage": "We received your request for container <bold>{projectNum}</bold> to <bold>{destName}</bold>.",
    "successFollowUp": "Our team will contact you within 24 hours with a quote.",
    "chatOnWhatsApp": "Chat on WhatsApp",
    "submitAnother": "Book another container",
    "cargoFits": "Your cargo (~{cbm} CBM) should fit",
    "cargoMayNotFit": "Your cargo (~{cbm} CBM) may not fit — we'll verify",
    "pendingRequests": "{count, plural, one {# other request pending} other {# other requests pending}}",
    "cbmAvailable": "{cbm} CBM available ({percent}% free)",
    "combineWarning": "Combines typically require a full container. Consider our <calcLink>freight calculator</calcLink> for a full-container quote."
  }
}
```

Also add to `SchedulePage`:
```json
{
  "statsBookable": "Available Space",
  "faqHeading": "Questions Every Buyer Asks"
}
```

---

## Tasks

### Task 1: Create `fetchScheduleContainersWithBookingData()` data function

**Files:**
- Modify: `lib/supabase-containers.ts`
- Test: `lib/__tests__/sync-containers.test.ts` (add integration-style test)

**Step 1: Add the new function to supabase-containers.ts**

```typescript
/**
 * Fetch ALL schedule containers with booking data merged in.
 * Used by the unified /schedule page (replaces separate fetch functions).
 * Returns containers from last 60 days with pending request counts.
 */
export async function fetchScheduleContainersWithBookingData(): Promise<ContainerWithPendingCount[] | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const cutoff = sixtyDaysAgo.toISOString().split("T")[0];

  try {
    // Fetch all containers (available + full + departed) from last 60 days
    const params = new URLSearchParams({
      select: "*",
      status: "in.(available,full,departed)",
      departure_date: `gte.${cutoff}`,
      order: "departure_date.asc",
    });

    const resp = await fetch(
      `${config.url}/rest/v1/shared_containers?${params}`,
      {
        headers: buildHeaders(config.key),
        next: { revalidate: 0 },
      },
    );

    if (!resp.ok) {
      log({
        level: "error",
        msg: "Failed to fetch schedule containers with booking data",
        route: "supabase-containers",
        status: resp.status,
        body: await resp.text(),
      });
      return null;
    }

    const containers = (await resp.json()) as SharedContainer[];

    // Fetch pending request counts for available containers
    const availableIds = containers
      .filter((c) => c.status === "available" && (c.available_cbm ?? 0) > 0)
      .map((c) => c.id);

    const countMap = new Map<string, number>();

    if (availableIds.length > 0) {
      const countParams = new URLSearchParams({
        select: "container_id",
        container_id: `in.(${availableIds.join(",")})`,
        status: "in.(new,contacted,quoted)",
      });

      const countResp = await fetch(
        `${config.url}/rest/v1/space_booking_requests?${countParams}`,
        { headers: buildHeaders(config.key) },
      );

      if (countResp.ok) {
        const requests = (await countResp.json()) as Array<{ container_id: string }>;
        for (const r of requests) {
          countMap.set(r.container_id, (countMap.get(r.container_id) ?? 0) + 1);
        }
      }
    }

    return containers.map((c) => ({
      ...c,
      pending_count: countMap.get(c.id) ?? 0,
    }));
  } catch (e) {
    log({
      level: "error",
      msg: "fetchScheduleContainersWithBookingData error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}
```

**Step 2: Verify build passes**

Run: `npm run build 2>&1 | grep -E "error|Error|✓ Compiled"`
Expected: `✓ Compiled successfully`

**Step 3: Commit**

```bash
git add lib/supabase-containers.ts
git commit -m "feat(data): add fetchScheduleContainersWithBookingData for unified page"
```

---

### Task 2: Add `ScheduleBooking` i18n keys to all 3 locales

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/ru.json`

**Step 1: Add `ScheduleBooking` namespace to en.json**

Insert before `"EquipmentDetailPage"` section. Keys are extracted from `ShippingWizard` namespace — only the booking-form-relevant subset.

**Step 2: Add Spanish translations to es.json**

Same structure, translated to Spanish.

**Step 3: Add Russian translations to ru.json**

Same structure, translated to Russian (with proper `few` plural forms).

**Step 4: Add `statsBookable` and `faqHeading` to `SchedulePage` in all 3 locales**

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

```bash
git add messages/
git commit -m "feat(i18n): add ScheduleBooking namespace for inline booking form"
```

---

### Task 3: Create `ScheduleBookingForm` component (inline booking)

**Files:**
- Create: `components/schedule/schedule-booking-form.tsx`

This is the collapsible inline form that appears when "Book Space" is clicked on a bookable container row. Extracted from ShippingWizard Step 1 (cargo selector) + Step 4 (contact form), without Steps 2-3 (destination/container selection — already handled by the row).

**Key props:**
```typescript
interface ScheduleBookingFormProps {
  container: ContainerWithPendingCount;
  onSuccess?: () => void;
  onCancel?: () => void;
}
```

**Component structure:**
```
ScheduleBookingForm
├── Cargo type chips (horizontal toggle bar, not grid)
│   └── CARGO_TYPES array (same 11 types from wizard)
├── Combine warning (conditional)
├── Details textarea (optional)
├── Separator
├── Contact fields (name, email, phone)
├── Honeypot (hidden)
├── Error display
├── Submit button
├── Terms text
└── Success card (replaces form on success)
```

**Key behaviors (same as wizard Step 4):**
- Calls `submitBookingRequest(payload, locale)` server action
- Tracks: GA4 `generate_lead`, Vercel Analytics, Meta Pixel, booking funnel events
- Honeypot anti-spam
- Auto-captures UTM params from URL
- Success state shows confirmation + "Book another" + WhatsApp link
- Cargo description built from selected type labels + optional details

**Differences from wizard:**
- No wizard steps / progress bar
- No destination selection (comes from container row)
- No container selection (comes from container row)
- Cargo chips are horizontal scrollable row, not 2-col grid
- Form is compact (fits inside a card expansion)
- `onCancel` callback to collapse the form
- `onSuccess` callback to update parent state (e.g., increment pending count)

**Step 1: Create the component file**

Write the full `ScheduleBookingForm` component (~300 lines). Use `useTranslations("ScheduleBooking")`. Port the submit logic and tracking from `shipping-wizard.tsx` lines 324-414.

**Step 2: Verify build passes**

**Step 3: Commit**

```bash
git add components/schedule/schedule-booking-form.tsx
git commit -m "feat(schedule): create ScheduleBookingForm inline component"
```

---

### Task 4: Create `ScheduleBookableRow` component

**Files:**
- Create: `components/schedule/schedule-bookable-row.tsx`

This replaces `ScheduleRow` for containers with `status === "available" && available_cbm > 0`. It renders the standard schedule row content PLUS:
- Capacity bar (fill percentage + available CBM)
- Cargo fit indicator (if user selected cargo types)
- Pending demand indicator
- Collapsible booking form

**Key props:**
```typescript
interface ScheduleBookableRowProps {
  container: ContainerWithPendingCount;
  index: number;
}
```

**Component structure:**
```
ScheduleBookableRow
├── Card (primary border-left accent)
│   ├── Top row: status badge + container type + "Book Space" toggle
│   ├── Route: origin → destination with flag
│   ├── Dates: departure + ETA + transit days
│   ├── TransitProgress bar (if applicable)
│   ├── Capacity section:
│   │   ├── Fill bar (same as wizard Step 3 container cards)
│   │   ├── "{cbm} CBM available ({percent}% free)"
│   │   └── Pending requests indicator
│   └── Collapsible (shadcn/ui):
│       └── ScheduleBookingForm
```

**Key behaviors:**
- Uses `Collapsible` from `@/components/ui/collapsible` (Radix)
- "Book Space" button toggles the collapsible open/closed
- When form submits successfully, show success inline and optionally increment `pending_count` in local state
- Scroll into view when expanded
- Track `trackScheduleEvent("book_click", ...)` on expand

**Step 1: Install collapsible if not present**

Run: `npx shadcn@latest add collapsible` (if `components/ui/collapsible.tsx` doesn't exist)

**Step 2: Create the component file**

Write the full `ScheduleBookableRow` (~250 lines). Reuse `TransitProgress`, `DatePill` from existing schedule components. Port capacity bar logic from `shipping-wizard.tsx` lines 746-801.

**Step 3: Verify build passes**

**Step 4: Commit**

```bash
git add components/schedule/schedule-bookable-row.tsx components/ui/collapsible.tsx
git commit -m "feat(schedule): create ScheduleBookableRow with inline booking"
```

---

### Task 5: Update `ScheduleList` to use bookable rows

**Files:**
- Modify: `components/schedule/schedule-list.tsx`

**Changes:**
1. Import `ScheduleBookableRow`
2. In the container rendering loop, conditionally render:
   - `ScheduleBookableRow` when `container.status === "available" && (container.available_cbm ?? 0) > 0`
   - `ScheduleRow` for all other containers
3. Accept `ContainerWithPendingCount[]` instead of `SharedContainer[]` as props
4. Add bookable count to the "Upcoming" tab badge

**Step 1: Update the component**

Modify the rendering logic in the grouped container list. Change the props type.

**Step 2: Verify build passes**

**Step 3: Commit**

```bash
git add components/schedule/schedule-list.tsx
git commit -m "feat(schedule): render BookableRow for available containers"
```

---

### Task 6: Update `schedule/page.tsx` to use unified data + FAQ

**Files:**
- Modify: `app/[locale]/schedule/page.tsx`

**Changes:**
1. Replace `fetchScheduleContainers()` with `fetchScheduleContainersWithBookingData()`
2. Add FAQ section (moved from shared-shipping page): locale-aware FAQ accordion
3. Import and render `sharedShippingFaqEn/Es/Ru` from `content/shared-shipping-faq.ts`
4. Add `faqHeading` translation key usage
5. Update `ScheduleStats` to include a 4th stat: "Available Space" (count of bookable containers)
6. Update JSON-LD to merge both schemas (Service + FAQPage)
7. Merge keywords from both pages' metadata
8. Update the CTA section: replace `/shared-shipping` link with WhatsApp + email (no more cross-link needed)
9. Pass `ContainerWithPendingCount[]` to `ScheduleList`

**Step 1: Update the page server component**

**Step 2: Update `ScheduleStats` to accept a 4th stat**

**Step 3: Verify page renders correctly**

Run: `npm run dev` → visit `http://localhost:3000/schedule`

**Step 4: Commit**

```bash
git add app/[locale]/schedule/page.tsx components/schedule/schedule-stats.tsx
git commit -m "feat(schedule): unified page with FAQ, booking data, and 4th stat"
```

---

### Task 7: Redirect `/shared-shipping` → `/schedule`

**Files:**
- Modify: `app/[locale]/shared-shipping/page.tsx` → replace with redirect
- Modify: `lib/constants.ts` → update NAV_ITEMS
- Modify: `app/sitemap.ts` → remove `/shared-shipping`, update `/schedule` priority

**Step 1: Replace shared-shipping page with permanent redirect**

```typescript
// app/[locale]/shared-shipping/page.tsx
import { permanentRedirect } from "next/navigation";

export default async function SharedShippingRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;
  permanentRedirect(`${prefix}/schedule`);
}
```

**Step 2: Update NAV_ITEMS in constants.ts**

Remove "Shared Shipping" entry. Rename "Schedule" to "Shipping Schedule":
```typescript
{ label: "Shipping Schedule", href: "/schedule" },
```

Update the `Header.nav` i18n key to include "Shipping Schedule" in all 3 locales.

**Step 3: Update sitemap.ts**

Remove `/shared-shipping` entry. Update `/schedule` priority to 0.9 (was 0.8). Add shared-shipping keywords to schedule metadata.

**Step 4: Verify redirects work**

Run: `npm run dev` → visit `http://localhost:3000/shared-shipping` → should 308 to `/schedule`

**Step 5: Commit**

```bash
git add app/[locale]/shared-shipping/page.tsx lib/constants.ts app/sitemap.ts messages/
git commit -m "feat(routing): redirect /shared-shipping → /schedule, merge nav items"
```

---

### Task 8: Clean up dead code

**Files:**
- Delete: `components/shared-shipping/shipping-wizard.tsx` (1,123 lines — replaced by inline booking)
- Delete: `components/shared-shipping/container-card.tsx` (if exists, unused)
- Delete: `components/shared-shipping/container-grid.tsx` (dead code from old design)
- Delete: `components/shared-shipping/booking-request-dialog.tsx` (dead code from old design)
- Delete: `components/shared-shipping/destination-filter.tsx` (if unused)
- Delete: `components/shared-shipping/container-card-skeleton.tsx` (if unused)
- Keep: `components/shared-shipping/stale-data-banner.tsx` (used by schedule)
- Keep: `components/shared-shipping/empty-state.tsx` (evaluate if still needed)
- Remove unused i18n keys from `ShippingWizard` and `SharedShippingPage` namespaces (keep `ScheduleBooking`)

**Step 1: Delete unused component files**

**Step 2: Remove unused i18n keys**

Remove `ShippingWizard` namespace from all 3 locale files.
Remove `SharedShippingPage` namespace from all 3 locale files.
Keep `ScheduleBooking` (new), `SchedulePage`, `ScheduleList`, `StaleDataBanner`, `EmptyState`.

**Step 3: Verify build passes with no dead imports**

Run: `npm run build`

**Step 4: Run all tests**

Run: `npm test`

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dead shared-shipping components and unused i18n keys"
```

---

### Task 9: Full E2E verification

**Files:** None (testing only)

**Step 1: Run unit tests**

Run: `npm test`
Expected: All pass

**Step 2: Run production build**

Run: `npm run build`
Expected: Clean compile, all pages generate

**Step 3: Test schedule page renders with real data**

Start dev server, trigger sync, verify:
- All containers appear in grouped list
- Available containers show capacity bar + "Book Space" button
- Departed containers show transit progress
- Filters work (tabs + country dropdown)
- Stats show correct numbers including bookable count

**Step 4: Test inline booking form**

Click "Book Space" on an available container:
- Form expands inline (collapsible animation)
- Cargo chips render as horizontal row
- Fill in test data → submit
- Verify Supabase insert
- Verify success card shows inline
- Verify "Cancel" collapses form

**Step 5: Test i18n**

Visit `/es/schedule` and `/ru/schedule`:
- All labels translated
- Booking form labels translated
- FAQ section translated

**Step 6: Test redirect**

Visit `/shared-shipping` → should 308 to `/schedule`
Visit `/es/shared-shipping` → should redirect to `/es/schedule`

**Step 7: Test mobile**

Resize to 375px width:
- Filter tabs scroll horizontally
- Bookable row and form stack vertically
- Cargo chips scroll horizontally
- Touch targets ≥ 44px

**Step 8: Final commit**

```bash
git add -A
git commit -m "test: verify unified schedule+booking page E2E"
```

---

## Migration Checklist

- [ ] Task 1: Data function
- [ ] Task 2: i18n keys (3 locales)
- [ ] Task 3: ScheduleBookingForm component
- [ ] Task 4: ScheduleBookableRow component
- [ ] Task 5: ScheduleList updated
- [ ] Task 6: Schedule page unified
- [ ] Task 7: Redirect + nav cleanup
- [ ] Task 8: Dead code removal
- [ ] Task 9: E2E verification

## Risk Mitigation

- **SEO:** 308 redirect from `/shared-shipping` preserves link equity. Keywords merged into `/schedule` metadata.
- **Analytics:** All tracking events (GA4, Pixel, CAPI, Vercel) fire from `ScheduleBookingForm` — same event names, same parameters. No analytics gap.
- **Existing bookmarks:** Redirect handles users who bookmarked `/shared-shipping`.
- **Rollback:** If issues arise, revert the redirect and both pages work independently again. The data layer and server action are unchanged.
