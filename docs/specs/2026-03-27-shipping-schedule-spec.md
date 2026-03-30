# Shipping Schedule Page — Implementation Spec

**Date:** 2026-03-27
**Status:** Draft — Pending CEO approval
**Author:** Claude Code (design research + Alex brainstorm)
**Depends On:** Shared Shipping Portal (built, `/shared-shipping`)

---

## 1. Product Vision

**What:** A public-facing schedule page at `/schedule` showing ALL container shipments — upcoming departures, in-transit, and recently arrived — in a clean, scannable "departure board" layout.

**Why:** Three business goals:

1. **Trust accelerator** — When a farmer in Kazakhstan sees 15+ containers moving to their region with specific dates and carriers, Meridian transforms from "some website" to "a real, active operation." It's the freight equivalent of showing a restaurant's busy kitchen.
2. **Lead capture** — Every upcoming container with available space has a "Book Space →" CTA linking to `/shared-shipping`. Schedule viewers convert to booking requests.
3. **SEO value** — "shipping schedule USA to [country]" is an uncontested keyword cluster. Dynamic content updated daily via ISR ranks well.

**Model:** Read-only public view. No auth, no tracking portals, no customer login. Marketing page that happens to show live data.

**Analogy:** Airport departure board meets Vercel's deployment dashboard — status dots, clean rows, grouped by state, filterable.

---

## 2. Design Principles (From Research)

Research across Maersk, Hapag-Lloyd, Flexport, Freightos, Vercel, and 30+ Dribbble/Behance references yielded these principles:

| # | Principle | Source | Application |
|---|-----------|--------|-------------|
| 1 | **Get to the data fast** | Flexport found users skip dashboards for the shipment list | Minimal hero, stats inline, schedule list dominates the page |
| 2 | **2-second row parsing** | Airport departure boards | Route + date + status per row — nothing else at first glance |
| 3 | **Shape + color + text** | Carbon Design System, WCAG | Status indicators use dot + color + label (never color alone) |
| 4 | **Organize by status, not date** | Logistics UX consensus | Tabs: Upcoming → In Transit → Delivered |
| 5 | **Cards on mobile, rows on desktop** | NN/Group mobile tables research | Responsive transform, not hidden columns |
| 6 | **No maps, no Gantt charts** | Flexport UX research | Maps are skipped; farmers on rural internet don't need them |
| 7 | **Show volume = show trust** | Social proof psychology | Stats bar: containers/month, countries served, in-transit count |

---

## 3. Information Architecture

### Route

```
/[locale]/schedule    ← New top-level page
```

Added to NAV_ITEMS between "Shared Shipping" and "FAQ".

### Page Structure

```
Header (existing)
├── PageHero (variant="gradient", minimal)
│   └── "Shipping Schedule" + subtitle + 3 stat counters inline
│
├── Filter Bar (sticky on scroll)
│   ├── Status Tabs: All | Upcoming | In Transit | Delivered
│   └── Destination Dropdown (country filter)
│
├── Schedule List (grouped by time proximity)
│   ├── Group: "Departing This Week" — amber left-border accent
│   ├── Group: "Departing This Month" — blue left-border accent
│   ├── Group: "Later" — no accent
│   ├── Group: "In Transit" — indigo left-border, progress animation
│   └── Group: "Recently Arrived" — green left-border, check icon
│
├── CTA Banner
│   └── "Need space on an upcoming container?" → /shared-shipping
│
└── Footer (existing)
```

### Cross-Links

| From | To | Link Text |
|------|----|-----------|
| `/shared-shipping` hero area | `/schedule` | "View full shipping schedule →" |
| `/schedule` CTA banner | `/shared-shipping` | "Book space on an upcoming container →" |
| `/schedule` row CTA button | `/shared-shipping` | "Book Space →" |
| `/destinations/[slug]` | `/schedule?country=XX` | "See upcoming shipments →" |

---

## 4. Schedule Status Model

Derived from existing DB fields — **no migration required**.

The `shared_containers` table already has: `status` (available/full/departed/unlisted/cancelled), `departure_date`, `eta_date`.

### Status Derivation

```typescript
type ScheduleStatus =
  | "departing-soon"   // DB: available + departure_date ≤ today + 7 days
  | "scheduled"        // DB: available + departure_date > today + 7 days
  | "fully-booked"     // DB: full + departure_date > today
  | "in-transit"       // DB: departed + (eta_date > today OR eta_date is null)
  | "arrived";         // DB: departed + eta_date ≤ today

// Display configuration per status
const SCHEDULE_STATUS_CONFIG: Record<ScheduleStatus, {
  label: string;       // i18n key
  dotColor: string;    // Tailwind class
  bgColor: string;     // Group header accent
  icon: LucideIcon;    // Shape alongside color
}> = {
  "departing-soon": {
    label: "status.departingSoon",
    dotColor: "bg-amber-500",
    bgColor: "border-l-amber-500",
    icon: Clock,
  },
  "scheduled": {
    label: "status.scheduled",
    dotColor: "bg-blue-500",
    bgColor: "border-l-blue-500",
    icon: Calendar,
  },
  "fully-booked": {
    label: "status.fullyBooked",
    dotColor: "bg-zinc-400",
    bgColor: "border-l-zinc-400",
    icon: Ban,
  },
  "in-transit": {
    label: "status.inTransit",
    dotColor: "bg-indigo-500",
    bgColor: "border-l-indigo-500",
    icon: Ship,
  },
  "arrived": {
    label: "status.arrived",
    dotColor: "bg-emerald-500",
    bgColor: "border-l-emerald-500",
    icon: CheckCircle2,
  },
};
```

### Transit Progress Computation

For "in-transit" containers, show journey progress:

```typescript
interface TransitProgress {
  transitDay: number;     // e.g., 18
  transitTotal: number;   // e.g., 35
  progressPercent: number; // e.g., 51
}

function computeTransitProgress(
  departureDate: string,
  etaDate: string | null
): TransitProgress | null {
  if (!etaDate) return null;

  const dep = new Date(departureDate);
  const eta = new Date(etaDate);
  const now = new Date();

  if (isNaN(dep.getTime()) || isNaN(eta.getTime())) return null;

  const totalMs = eta.getTime() - dep.getTime();
  const elapsedMs = now.getTime() - dep.getTime();

  if (totalMs <= 0) return null;

  const transitTotal = Math.round(totalMs / (1000 * 60 * 60 * 24));
  const transitDay = Math.max(1, Math.min(transitTotal, Math.round(elapsedMs / (1000 * 60 * 60 * 24))));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));

  return { transitDay, transitTotal, progressPercent };
}
```

---

## 5. Data Architecture

### New Supabase Query

Add to `lib/supabase-containers.ts`:

```typescript
/**
 * Fetch ALL containers for the schedule page.
 * Includes available, full, and departed (last 60 days).
 * Excludes unlisted and cancelled.
 */
export async function fetchScheduleContainers(): Promise<SharedContainer[] | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const cutoff = sixtyDaysAgo.toISOString().split("T")[0];

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
      next: { revalidate: 0 }, // ISR handles caching at page level
    },
  );

  if (!resp.ok) {
    log({ level: "error", msg: "Failed to fetch schedule containers", route: "supabase-containers", status: resp.status });
    return null;
  }

  return (await resp.json()) as SharedContainer[];
}
```

### Stats Computation (Server-Side)

```typescript
interface ScheduleStats {
  containersThisMonth: number;
  countriesServed: number;
  inTransitNow: number;
}

function computeScheduleStats(containers: SharedContainer[]): ScheduleStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const today = now.toISOString().split("T")[0];

  return {
    containersThisMonth: containers.filter(c =>
      c.departure_date >= monthStart
    ).length,

    countriesServed: new Set(
      containers
        .map(c => c.destination_country)
        .filter(Boolean)
    ).size,

    inTransitNow: containers.filter(c =>
      c.status === "departed" &&
      (c.eta_date === null || c.eta_date > today)
    ).length,
  };
}
```

### Grouping Logic

```typescript
type ScheduleGroup =
  | "departing-this-week"
  | "departing-this-month"
  | "departing-later"
  | "in-transit"
  | "arrived";

function groupContainers(
  containers: SharedContainer[],
  filterTab: "all" | "upcoming" | "in-transit" | "delivered",
  filterCountry: string | null,
): Map<ScheduleGroup, SharedContainer[]> {
  const today = new Date();
  const weekOut = new Date(today); weekOut.setDate(weekOut.getDate() + 7);
  const monthOut = new Date(today); monthOut.setDate(monthOut.getDate() + 30);

  const todayStr = today.toISOString().split("T")[0];
  const weekStr = weekOut.toISOString().split("T")[0];
  const monthStr = monthOut.toISOString().split("T")[0];

  let filtered = containers;

  // Country filter
  if (filterCountry) {
    filtered = filtered.filter(c => c.destination_country === filterCountry);
  }

  // Tab filter
  if (filterTab === "upcoming") {
    filtered = filtered.filter(c => c.status === "available" || (c.status === "full" && c.departure_date > todayStr));
  } else if (filterTab === "in-transit") {
    filtered = filtered.filter(c => c.status === "departed" && (c.eta_date === null || c.eta_date > todayStr));
  } else if (filterTab === "delivered") {
    filtered = filtered.filter(c => c.status === "departed" && c.eta_date !== null && c.eta_date <= todayStr);
  }

  // Group
  const groups = new Map<ScheduleGroup, SharedContainer[]>();

  for (const c of filtered) {
    let group: ScheduleGroup;

    if (c.status === "departed") {
      if (c.eta_date && c.eta_date <= todayStr) {
        group = "arrived";
      } else {
        group = "in-transit";
      }
    } else if (c.departure_date <= weekStr) {
      group = "departing-this-week";
    } else if (c.departure_date <= monthStr) {
      group = "departing-this-month";
    } else {
      group = "departing-later";
    }

    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(c);
  }

  return groups;
}
```

---

## 6. UI Components

### 6.1 Schedule Row (Desktop)

The primary building block. Horizontal card that's scannable in 2 seconds.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ● In Transit                                                    40HC        │
│                                                                             │
│ 🇰🇿  Chicago, IL → Almaty, Kazakhstan                                      │
│                                                                             │
│ ┌──────────┐                                              ┌──────────┐     │
│ │  Apr 12  │  ════════════🚢══════════════════════════     │  May 17  │     │
│ │ Departed │              Day 18 of 35                     │   ETA    │     │
│ └──────────┘                                              └──────────┘     │
│                                                                             │
│ MF-2026-047  ·  HAPAG-Lloyd  ·  23 CBM available         [ Book Space → ] │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Layout breakdown:**

```
Row (border-l-4 colored by status)
├── Top Line
│   ├── Status Dot + Label (left)
│   └── Container Type Badge (right)
│
├── Route Line
│   └── Flag + "Origin → Destination" (truncated on overflow)
│
├── Date + Progress Line
│   ├── Departure Date Pill (left)
│   ├── Transit Progress Bar (center, flex-1)
│   │   └── For in-transit: animated ship icon at progressPercent%
│   │   └── For upcoming: static dashed line
│   │   └── For arrived: solid green line with check
│   └── ETA Date Pill (right)
│
└── Meta Line
    ├── Project # · Carrier · Available CBM (left)
    └── CTA Button (right, only for available status)
```

### 6.2 Schedule Row (Mobile < 640px)

Each row becomes a compact card:

```
┌──────────────────────────────┐
│ ● In Transit           40HC  │
│                              │
│ 🇰🇿 → Almaty, Kazakhstan    │
│                              │
│ Apr 12  ───🚢───  May 17    │
│       Day 18 of 35          │
│                              │
│ HAPAG-Lloyd · 23 CBM avail  │
│        [ Book Space → ]     │
└──────────────────────────────┘
```

- Origin hidden on mobile (always a US port — less critical)
- Date line compressed to single row
- Full-width card, no side padding waste

### 6.3 Transit Progress Bar

The signature visual element for in-transit containers.

```typescript
// components/schedule/transit-progress.tsx

interface TransitProgressProps {
  status: ScheduleStatus;
  departureDate: string;
  etaDate: string | null;
}
```

**Visual states:**

| Status | Progress Bar Appearance |
|--------|----------------------|
| `scheduled` | Gray dashed line, no indicator |
| `departing-soon` | Amber dashed line, pulse animation on left dot |
| `fully-booked` | Gray dashed line, no indicator |
| `in-transit` | Indigo solid fill up to progress%, ship icon (🚢) at progress point, animated subtle pulse |
| `arrived` | Full green line, check icon at right end |

Implementation uses a simple `div` with `width: ${progressPercent}%` — reuses the existing pattern from the container-card.tsx progress bar. Ship emoji positioned with `left: ${progressPercent}%` and `transform: translateX(-50%)`.

**Animation:** CSS `@keyframes` for the ship icon — subtle 2px vertical bob on a 3s loop. Only on `in-transit` status. Respects `prefers-reduced-motion`.

```css
@keyframes ship-bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-2px); }
}
```

### 6.4 Stats Bar

Three counters in the hero area, using `font-mono` for numbers (existing Geist Mono pattern).

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│        12          │  │         8          │  │         3          │
│   Containers       │  │     Countries      │  │    In Transit      │
│   This Month       │  │      Served        │  │    Right Now       │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

Server Component — computed from the full dataset before hydration. No client-side counters or animations needed (static numbers that update on ISR revalidation).

### 6.5 Filter Bar

Sticky bar that stays visible while scrolling.

```
┌──────────────────────────────────────────────────────────────────────┐
│ [ All (24) | Upcoming (8) | In Transit (5) | Delivered (11) ]       │
│                                          [ 🌍 All Countries  ▾ ]   │
└──────────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Status tabs:** `Tabs` / `TabsList` / `TabsTrigger` from shadcn/ui. Each tab shows count. Active tab has `bg-primary text-primary-foreground` pill.
- **Country dropdown:** `Select` / `SelectTrigger` / `SelectContent` from shadcn/ui. Populated from unique `destination_country` values. Shows flag + country name.
- **Sticky behavior:** `sticky top-[64px] z-30 bg-background/95 backdrop-blur-sm border-b` (64px = header height). `supports-[backdrop-filter]:bg-background/80`.
- **URL state:** Filter state synced to URL search params (`?tab=in-transit&country=KZ`) via `useSearchParams()` + `router.replace()`. Enables deep-linking and sharing.

### 6.6 Group Header

Separates schedule rows by time group.

```
──── Departing This Week ─────────────────────────────────────
```

Simple `<h3>` with a horizontal rule pattern. Left-aligned text, muted foreground, small caps tracking. Uses `border-l-4` colored by group:

| Group | Border Color | Icon |
|-------|-------------|------|
| Departing This Week | `border-l-amber-500` | `Clock` |
| Departing This Month | `border-l-blue-500` | `Calendar` |
| Later | `border-l-muted` | `CalendarDays` |
| In Transit | `border-l-indigo-500` | `Ship` |
| Recently Arrived | `border-l-emerald-500` | `CheckCircle2` |

### 6.7 Empty States

Reuse the existing `EmptyState` component pattern with new variants:

| Variant | When | Message |
|---------|------|---------|
| `no-data` | Supabase returned null | "Schedule unavailable. Contact us for shipping info." |
| `no-filter-results` | Tab+country filter has 0 matches | "No containers to {country} in this category." |
| `no-upcoming` | No upcoming containers | "New shipments are added regularly. Check back soon." |

---

## 7. File Structure

```
app/[locale]/schedule/page.tsx                ← Server Component (SSG/ISR 900s)

components/schedule/
├── schedule-list.tsx                         ← Client: tabs + filter + grouped rows
├── schedule-row.tsx                          ← Client: individual container row/card
├── schedule-stats.tsx                        ← Server: 3 stat counters
├── schedule-filter-bar.tsx                   ← Client: sticky tabs + country dropdown
├── transit-progress.tsx                      ← Client: animated journey progress bar
└── schedule-empty-state.tsx                  ← Client: empty/no-results states

lib/schedule-display.ts                       ← Pure functions: deriveScheduleStatus(),
                                                computeTransitProgress(),
                                                computeScheduleStats(),
                                                groupContainers()

lib/supabase-containers.ts                    ← Add fetchScheduleContainers()
                                                (extend existing file)

lib/tracking.ts                               ← Add trackScheduleEvent()
                                                (extend existing file)

messages/{en,es,ru}.json                      ← Add "SchedulePage" + "ScheduleList"
                                                namespaces

lib/constants.ts                              ← Add Schedule to NAV_ITEMS
app/sitemap.ts                                ← Add /schedule entry
```

### New shadcn/ui Components Needed

```bash
npx shadcn@latest add tabs select
```

- `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` — for status filter tabs
- `Select` / `SelectTrigger` / `SelectContent` / `SelectItem` — for country dropdown

All other components already installed: `Card`, `Badge`, `Button`, `Alert`, `Separator`.

### No New npm Packages

Everything needed is already in the project: `next-intl`, `lucide-react`, `motion`, `@vercel/analytics`.

---

## 8. Page Implementation

### 8.1 Server Component (`app/[locale]/schedule/page.tsx`)

```typescript
// ISR: 15 minutes (matches cron sync cycle)
export const revalidate = 900;

export default async function SchedulePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [containers, lastSyncTime, t] = await Promise.all([
    fetchScheduleContainers(),     // NEW query — all statuses
    getLastSyncTime(),             // REUSE from shared-shipping
    getTranslations({ locale, namespace: "SchedulePage" }),
  ]);

  const stats = containers ? computeScheduleStats(containers) : null;

  // JSON-LD: TransportAction schema
  const jsonLd = { /* ... */ };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="gradient"
        breadcrumbs={[{ label: t("breadcrumb") }]}
        eyebrow={t("eyebrow")}
        heading={<>{t.rich("heading", {
          accent: (chunks) => <span className="text-primary">{chunks}</span>,
        })}</>}
        description={t("description")}
      >
        {/* Stats inline in hero */}
        {stats && <ScheduleStats stats={stats} />}
      </PageHero>

      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {containers && containers.length > 0 ? (
            <ScheduleList
              containers={containers}
              lastSyncTime={lastSyncTime}
            />
          ) : (
            <ScheduleEmptyState variant="no-data" />
          )}
        </div>
      </section>

      {/* CTA: Book Space */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* ... "Need space? Book through shared shipping" CTA ... */}
        </div>
      </section>
    </>
  );
}
```

### 8.2 Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("scheduleTitle"),
    description: t("scheduleDescription"),
    keywords: [
      "shipping schedule",
      "container departure schedule",
      "freight schedule USA",
      "machinery shipping dates",
      "container tracking",
      "ocean freight schedule",
    ],
    alternates: {
      canonical: `${SITE.url}${localePath}/schedule`,
      languages: { en: ..., es: ..., ru: ... },
    },
    openGraph: { /* standard pattern */ },
  };
}
```

---

## 9. Schedule List Component (Client)

The main client component managing filter state and rendering.

```typescript
// components/schedule/schedule-list.tsx
"use client";

interface ScheduleListProps {
  containers: SharedContainer[];
  lastSyncTime: string | null;
}

export function ScheduleList({ containers, lastSyncTime }: ScheduleListProps) {
  // URL-synced filter state
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = (searchParams.get("tab") ?? "all") as FilterTab;
  const activeCountry = searchParams.get("country");

  // Derive tab counts (computed once, memoized)
  const tabCounts = useMemo(() => computeTabCounts(containers), [containers]);

  // Derive unique countries for dropdown
  const countries = useMemo(() =>
    deriveCountryList(containers), [containers]);

  // Group containers by time/status
  const groups = useMemo(() =>
    groupContainers(containers, activeTab, activeCountry),
    [containers, activeTab, activeCountry]);

  // URL state updaters
  function setTab(tab: FilterTab) {
    const params = new URLSearchParams(searchParams);
    if (tab === "all") params.delete("tab"); else params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setCountry(country: string | null) {
    const params = new URLSearchParams(searchParams);
    if (!country) params.delete("country"); else params.set("country", country);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-4">
      <StaleDataBanner lastSyncTime={lastSyncTime} hasContainers={containers.length > 0} />

      <ScheduleFilterBar
        activeTab={activeTab}
        onTabChange={setTab}
        tabCounts={tabCounts}
        activeCountry={activeCountry}
        onCountryChange={setCountry}
        countries={countries}
      />

      {/* Grouped schedule rows */}
      {groups.size === 0 ? (
        <ScheduleEmptyState variant="no-filter-results" filterCountry={activeCountry} />
      ) : (
        Array.from(groups.entries()).map(([group, items]) => (
          <section key={group}>
            <GroupHeader group={group} count={items.length} />
            <div className="space-y-3 mt-3">
              {items.map((container, i) => (
                <ScheduleRow key={container.id} container={container} index={i} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
```

---

## 10. Schedule Row Component

```typescript
// components/schedule/schedule-row.tsx
"use client";

interface ScheduleRowProps {
  container: SharedContainer;
  index: number;
}

export function ScheduleRow({ container, index }: ScheduleRowProps) {
  const t = useTranslations("ScheduleList");
  const status = deriveScheduleStatus(container);
  const config = SCHEDULE_STATUS_CONFIG[status];
  const transit = computeTransitProgress(container.departure_date, container.eta_date);
  const transitDayCount = transitDays(container.departure_date, container.eta_date);
  const flag = countryFlag(container.destination_country);
  const hasAvailableSpace = container.status === "available" && (container.available_cbm ?? 0) > 0;

  return (
    <StaggerItem index={index}>
      <Card className={cn(
        "border-l-4 transition-all duration-200 hover:shadow-sm",
        config.bgColor,
      )}>
        <CardContent className="p-4 sm:p-5">
          {/* ─── Top line: Status + Container type ─── */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={cn("inline-block h-2 w-2 rounded-full", config.dotColor)} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t(config.label)}
              </span>
            </div>
            <Badge variant="secondary" className="text-[11px]">
              {container.container_type}
            </Badge>
          </div>

          {/* ─── Route ─── */}
          <p className="mt-2 text-sm font-semibold leading-snug">
            <span className="mr-1.5" aria-hidden="true">{flag}</span>
            <span className="hidden sm:inline">{container.origin}
              <span className="mx-1.5 text-muted-foreground">→</span>
            </span>
            <span className="sm:hidden">→ </span>
            {container.destination}
          </p>

          {/* ─── Date + Progress ─── */}
          <div className="mt-3 flex items-center gap-3">
            <DatePill date={container.departure_date} label={t("departed")} />
            <TransitProgress
              status={status}
              departureDate={container.departure_date}
              etaDate={container.eta_date}
            />
            <DatePill
              date={container.eta_date}
              label={t("eta")}
              fallback="TBD"
            />
          </div>

          {/* Transit day counter (in-transit only) */}
          {transit && status === "in-transit" && (
            <p className="mt-1 text-center text-[11px] text-muted-foreground">
              {t("dayOfTransit", { day: transit.transitDay, total: transit.transitTotal })}
            </p>
          )}

          {/* ─── Meta + CTA ─── */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{container.project_number}</span>
              {transitDayCount !== null && (
                <span>~{transitDayCount} {t("days")}</span>
              )}
              {hasAvailableSpace && (
                <span className="font-medium text-foreground">
                  {container.available_cbm} CBM {t("available")}
                </span>
              )}
            </div>

            {hasAvailableSpace && (
              <Button size="sm" variant="outline" asChild>
                <a href={`/shared-shipping?country=${container.destination_country}`}>
                  {t("bookSpace")}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  );
}

function DatePill({
  date,
  label,
  fallback = "—",
}: {
  date: string | null;
  label: string;
  fallback?: string;
}) {
  const formatted = date ? formatShortDate(date) : fallback;
  return (
    <div className="shrink-0 rounded-md bg-muted/60 px-2.5 py-1.5 text-center min-w-[60px]">
      <p className="text-xs font-semibold leading-tight">{formatted}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
```

---

## 11. Transit Progress Component

```typescript
// components/schedule/transit-progress.tsx
"use client";

interface TransitProgressProps {
  status: ScheduleStatus;
  departureDate: string;
  etaDate: string | null;
}

export function TransitProgress({ status, departureDate, etaDate }: TransitProgressProps) {
  const progress = computeTransitProgress(departureDate, etaDate);

  // Base: flex-1 horizontal bar
  return (
    <div className="flex flex-1 items-center relative h-4" aria-hidden="true">
      {/* Track */}
      <div className={cn(
        "absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full",
        status === "arrived" ? "bg-emerald-300" :
        status === "in-transit" ? "bg-indigo-200" :
        "bg-border",
        (status === "scheduled" || status === "departing-soon" || status === "fully-booked") && "border-t border-dashed border-border bg-transparent",
      )} />

      {/* Fill (in-transit and arrived) */}
      {(status === "in-transit" || status === "arrived") && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 left-0 h-0.5 rounded-full transition-all duration-700",
            status === "arrived" ? "bg-emerald-500" : "bg-indigo-500",
          )}
          style={{ width: status === "arrived" ? "100%" : `${progress?.progressPercent ?? 50}%` }}
        />
      )}

      {/* Ship indicator (in-transit only) */}
      {status === "in-transit" && progress && (
        <span
          className="absolute top-1/2 text-xs animate-ship-bob"
          style={{ left: `${progress.progressPercent}%`, transform: "translate(-50%, -50%)" }}
        >
          🚢
        </span>
      )}

      {/* Check indicator (arrived) */}
      {status === "arrived" && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </span>
      )}

      {/* Pulse dot (departing-soon) */}
      {status === "departing-soon" && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </div>
  );
}
```

Add to `app/globals.css`:

```css
@keyframes ship-bob {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-2px); }
}

.animate-ship-bob {
  animation: ship-bob 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-ship-bob {
    animation: none;
  }
}
```

---

## 12. Analytics

### Custom Events

| Event | Trigger | GA4 | Vercel Analytics |
|-------|---------|-----|-----------------|
| `schedule_view` | Page load | ✅ | ✅ |
| `schedule_filter` | Tab or country change | ✅ | — |
| `schedule_book_click` | "Book Space" button click | ✅ | ✅ |

### Tracking Function

Add to `lib/tracking.ts`:

```typescript
/** Track shipping schedule events (GA4 + Vercel Analytics). */
export function trackScheduleEvent(
  action: "view" | "filter" | "book_click",
  params: Record<string, string> = {},
): void {
  switch (action) {
    case "view":
      trackGA4Event("schedule_view", params);
      vercelTrack("schedule_view", params);
      break;
    case "filter":
      trackGA4Event("schedule_filter", params);
      break;
    case "book_click":
      trackGA4Event("schedule_book_click", params);
      vercelTrack("schedule_book_click", params);
      break;
  }
}
```

---

## 13. SEO

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Shipping Schedule",
  "provider": {
    "@type": "Organization",
    "name": "Meridian Freight Inc.",
    "url": "https://meridianexport.com"
  },
  "description": "Live shipping schedule showing container departures, in-transit shipments, and arrivals from USA to 27+ countries.",
  "serviceType": "Ocean Freight Shipping",
  "areaServed": ["KZ", "BR", "UY", "AR", ...]
}
```

### Sitemap Entry

```typescript
{
  url: `${SITE.url}/schedule`,
  lastModified: now,
  changeFrequency: "daily",
  priority: 0.8,
  alternates: withAlternates("/schedule"),
}
```

---

## 14. i18n Namespaces

### SchedulePage (Server)

```json
{
  "SchedulePage": {
    "breadcrumb": "Shipping Schedule",
    "eyebrow": "Live Container Schedule",
    "heading": "Track Our <accent>Shipping Schedule</accent>",
    "description": "See every container departure, transit, and arrival. Updated every 15 minutes from our operations team.",
    "ctaHeading": "Need Space on an Upcoming Container?",
    "ctaDescription": "Browse available space and submit a booking request. We'll send a quote within 24 hours.",
    "ctaBookSpace": "Book Shared Container Space",
    "ctaOrContact": "or contact us at {email}"
  }
}
```

### ScheduleList (Client)

```json
{
  "ScheduleList": {
    "tabAll": "All",
    "tabUpcoming": "Upcoming",
    "tabInTransit": "In Transit",
    "tabDelivered": "Delivered",
    "allCountries": "All Countries",
    "groupDepartingThisWeek": "Departing This Week",
    "groupDepartingThisMonth": "Departing This Month",
    "groupLater": "Later Departures",
    "groupInTransit": "In Transit",
    "groupArrived": "Recently Arrived",
    "status.departingSoon": "Departing Soon",
    "status.scheduled": "Scheduled",
    "status.fullyBooked": "Fully Booked",
    "status.inTransit": "In Transit",
    "status.arrived": "Arrived",
    "departed": "Departed",
    "eta": "ETA",
    "days": "days",
    "available": "available",
    "bookSpace": "Book Space",
    "dayOfTransit": "Day {day} of {total}",
    "noResults": "No containers match your filters.",
    "clearFilters": "Clear filters",
    "statsContainers": "Containers This Month",
    "statsCountries": "Countries Served",
    "statsInTransit": "In Transit Now"
  }
}
```

Same structure replicated in `es.json` and `ru.json`.

---

## 15. Integration Touchpoints

### Existing Files to Modify

| File | Change | Risk |
|------|--------|------|
| `lib/constants.ts` | Add `{ label: "Schedule", href: "/schedule" }` to NAV_ITEMS after "Shared Shipping" | Low — additive |
| `app/sitemap.ts` | Add schedule entry to `staticPages` array | Low — additive |
| `lib/supabase-containers.ts` | Add `fetchScheduleContainers()` function | Low — new function, no changes to existing |
| `lib/tracking.ts` | Add `trackScheduleEvent()` function | Low — new function, no changes to existing |
| `app/globals.css` | Add `@keyframes ship-bob` animation | Low — additive CSS |
| `messages/{en,es,ru}.json` | Add `SchedulePage`, `ScheduleList`, `Metadata.scheduleTitle/Description` namespaces | Low — additive |
| `lib/container-display.ts` | NONE — schedule display logic goes in new `lib/schedule-display.ts` | Zero risk |
| `app/[locale]/shared-shipping/page.tsx` | Add cross-link to `/schedule` in hero or below wizard | Low |

### Existing Components Reused

| Component | From | How |
|-----------|------|-----|
| `PageHero` | `components/page-hero.tsx` | `variant="gradient"` with stats as `children` |
| `StaleDataBanner` | `components/shared-shipping/stale-data-banner.tsx` | Same props, same sync data |
| `StaggerItem` | `components/scroll-reveal.tsx` | Staggered fade-in for schedule rows |
| `ScrollReveal` | `components/scroll-reveal.tsx` | CTA section animation |
| `Card`, `CardContent` | `components/ui/card.tsx` | Schedule row cards |
| `Badge` | `components/ui/badge.tsx` | Container type, status |
| `Button` | `components/ui/button.tsx` | "Book Space" CTA |
| `countryFlag()` | `lib/container-display.ts` | Flag emoji from ISO code |
| `transitDays()` | `lib/container-display.ts` | Transit day count |
| `getLastSyncTime()` | `lib/supabase-containers.ts` | For StaleDataBanner |

### Cron Job — NO Changes

The existing cron at `/api/cron/sync-containers` already syncs ALL containers and calls `revalidatePath("/shared-shipping")`. We add `revalidatePath("/schedule")` to the same cron handler (single line addition).

---

## 16. Implementation Phases

### Phase 1: Foundation (1 task)

1. **Types + display logic** — Create `lib/schedule-display.ts` with `ScheduleStatus`, `deriveScheduleStatus()`, `computeTransitProgress()`, `computeScheduleStats()`, `groupContainers()`, `computeTabCounts()`, `deriveCountryList()`. Add `fetchScheduleContainers()` to `lib/supabase-containers.ts`.

### Phase 2: UI Components (3 tasks)

2. **Install shadcn/ui tabs + select** — `npx shadcn@latest add tabs select`
3. **Schedule row + transit progress** — `components/schedule/schedule-row.tsx`, `components/schedule/transit-progress.tsx`, `components/schedule/schedule-stats.tsx`, `components/schedule/schedule-empty-state.tsx`. CSS animation in `globals.css`.
4. **Schedule list + filter bar** — `components/schedule/schedule-list.tsx`, `components/schedule/schedule-filter-bar.tsx`. URL-synced state with `useSearchParams`.

### Phase 3: Page + Integration (3 tasks)

5. **Page + metadata + JSON-LD** — `app/[locale]/schedule/page.tsx` with ISR, SEO, and hero.
6. **i18n** — Add all new namespaces to `messages/{en,es,ru}.json`.
7. **Integration touchpoints** — NAV_ITEMS, sitemap, cron revalidation, tracking, cross-links.

### Phase 4: Polish (1 task)

8. **Test + verify** — `npm run build` clean, `npm run lint` clean, responsive check, a11y review.

**Estimated total: 8 tasks, ~600-800 lines of new code.**

---

## 17. What We're NOT Building (v1 Scope)

| Feature | Why Deferred |
|---------|-------------|
| Map visualization | Research shows users skip maps; rural users have slow internet |
| Vessel names | Farmers care about dates, not vessel names |
| Real-time tracking | No GPS data available; ISR + cron is sufficient |
| Login / customer portal | This is a marketing page |
| Gantt chart / timeline view | Overkill for public page — consider for v2 |
| Auto-refresh / WebSocket | ISR revalidation every 15 min is sufficient |
| Search by project number | Project numbers are internal — customers won't know them |
| Carrier logos | Would need image assets; text name is sufficient |
| Email alerts for new routes | v2 feature (needs auth) |

---

## 18. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page views / month | 200+ within 30 days | GA4 `schedule_view` |
| Click-through to /shared-shipping | 15%+ of schedule viewers | GA4 `schedule_book_click` / `schedule_view` |
| SEO ranking | Top 20 for "shipping schedule USA to [country]" | Google Search Console |
| Bounce rate | < 60% | GA4 |
| Time on page | > 45s | GA4 |
