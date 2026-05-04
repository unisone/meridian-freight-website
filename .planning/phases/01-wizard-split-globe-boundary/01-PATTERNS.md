# Phase 1: Wizard Split + Globe Boundary — Pattern Map

**Mapped:** 2026-05-04
**Files analyzed:** 7 new/modified files
**Analogs found:** 7 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `components/freight-calculator-v3/wizard/step-equipment.tsx` | component | request-response | `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 963–1017 | exact (same file, extracted section) |
| `components/freight-calculator-v3/wizard/step-route.tsx` | component | request-response | `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 1019–1411 | exact (same file, extracted section) |
| `components/freight-calculator-v3/wizard/step-contact.tsx` | component | request-response | `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 1478–1540 + `components/schedule/schedule-booking-form.tsx` | exact + role-match |
| `components/freight-calculator-v3/wizard/step-result.tsx` | component | request-response | `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 1505–1950 (CalculatorV3EstimateCard) | exact (same file, extracted function) |
| `components/freight-calculator-v3/wizard/state.ts` | utility | transform | `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 491–535 (useState block) | role-match (no existing reducer analog) |
| `components/freight-calculator-v3/wizard/types.ts` | utility | transform | `lib/calculator-v3/contracts.ts` + `lib/types/calculator.ts` | role-match |
| `components/freight-calculator-v3/route-globe-v3.tsx` | component | event-driven | `components/freight-calculator/route-globe.tsx` | exact |
| `components/freight-calculator-v3/calculator-v3-wizard.tsx` (modified, ≤500 lines) | component | request-response | `components/freight-calculator/calculator-progress-bar.tsx` (orchestrator pattern) | role-match |

---

## Pattern Assignments

### `components/freight-calculator-v3/wizard/step-equipment.tsx` (component, request-response)

**Analog:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 963–1017

**Imports pattern** (lines 1–71 of the wizard):
```typescript
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/components/freight-calculator/category-icons";
import { getLocalizedText } from "@/lib/calculator-v3/policy";
import type {
  CalculatorLocale,
  EquipmentQuoteProfile,
} from "@/lib/calculator-v3/contracts";
```

**Core pattern — equipment grid** (lines 972–1016):
```typescript
// Named export, PascalCase matching filename
export function StepEquipment({ profiles, profileId, onSelect, locale }: StepEquipmentProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = !showAll && profiles.length > 8 ? profiles.slice(0, 8) : profiles;

  return (
    <section>
      <SectionHeader num={1} title={t.selectEquipmentCategory} />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((candidate) => {
          const Icon = CATEGORY_ICONS[candidate.equipmentCategory] ?? Package;
          const isSelected = profileId === candidate.id;
          return (
            <button
              key={candidate.id}
              type="button"
              onClick={() => onSelect(candidate)}
              className={`group flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center transition-colors ... ${
                isSelected ? "border-primary bg-primary/5 ..." : "border-border bg-card ..."
              }`}
              aria-pressed={isSelected}
            >
              <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium leading-tight">{getLocalizedText(candidate.label, lang)}</span>
            </button>
          );
        })}
      </div>
      {profiles.length > 8 && !showAll && (
        <button type="button" onClick={() => setShowAll(true)} className="mt-2 flex items-center gap-1 ... text-primary hover:underline">
          {t.showAllCategories} <ChevronDown className="h-3 w-3" />
        </button>
      )}
    </section>
  );
}
```

**Props typing convention:** All step components receive props via a typed interface defined at the top of the file. Callbacks are `on<Action>` functions passed down from orchestrator. No internal context — props-only.

**"use client" placement:** Top of file, before all imports (line 1 of every client component — see `calculator-v3-wizard.tsx:1`, `schedule-booking-form.tsx:1`).

---

### `components/freight-calculator-v3/wizard/step-route.tsx` (component, request-response)

**Analog:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 1019–1411

**Imports pattern** — includes RouteGlobe:
```typescript
"use client";

import { useMemo } from "react";
import { DollarSign, Clock3, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RouteGlobe } from "@/components/freight-calculator/route-globe";
// (or @/components/freight-calculator-v3/route-globe-v3 after split)
import type {
  CalculatorLocale,
  EquipmentQuoteMode,
  RouteOption,
  RoutePreference,
} from "@/lib/calculator-v3/contracts";
```

**Globe lazy-boundary decision:** The `RouteGlobe` is already lazy via `next/dynamic({ ssr: false })` *inside* `route-globe.tsx`. The phase goal is to move the boundary *up* to where `RouteGlobe` is imported so the entire globe subtree is SSR-excluded at the import site. Pattern to copy is wrapping the import in the parent rather than inside the component:

```typescript
// In step-route.tsx (or the orchestrator):
import dynamic from "next/dynamic";

const RouteGlobeV3 = dynamic(
  () => import("@/components/freight-calculator-v3/route-globe-v3").then((m) => ({ default: m.RouteGlobeV3 })),
  { ssr: false }
);
```

**Core pattern — section with progressive disclosure** (lines 1019–1025):
```typescript
<section
  aria-disabled={!profile || undefined}
  className={`transition-[opacity,transform] duration-300 ${
    !profile
      ? "pointer-events-none translate-y-2 opacity-40"
      : "translate-y-0 opacity-100"
  }`}
>
```

**Route card selection pattern** (lines 1326–1371):
```typescript
<button
  key={route.id}
  type="button"
  onClick={() => onSelectRoute(route)}
  className={`rounded-xl border-2 px-3 py-3 text-left transition-colors ... ${
    active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border ..."
  }`}
>
  {/* route.origin.label → route.destination.label, route.carrier badge */}
</button>
```

---

### `components/freight-calculator-v3/wizard/step-contact.tsx` (component, request-response)

**Analogs:**
1. `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 1478–1540 (`CalculatorV3EstimateCardProps` interface + form fields)
2. `components/schedule/schedule-booking-form.tsx` lines 1–80 (form field structure, Zod-backed, `onSubmit` pattern)

**Imports pattern** (`schedule-booking-form.tsx:1–52`):
```typescript
"use client";

import { useState, useRef } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT } from "@/lib/constants";
import {
  trackGA4Event,
  trackPixelEvent,
  generateEventId,
} from "@/lib/tracking";
```

**Props interface style** (from `calculator-v3-wizard.tsx:1478–1503`):
```typescript
interface StepContactProps {
  locale: CalculatorLocale;
  preview: FreightEstimateV3 | null;
  isComplete: boolean;     // step3Done — controls form availability
  email: string;
  onEmailChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  // ... phone, company, preferredContact, website (honeypot)
  isSubmitting: boolean;
  error: string;
  onSubmit: () => void;
}
```

**Honeypot field pattern** — include hidden `website` field, omit from visible UI:
```typescript
{/* Honeypot — bots fill this, humans don't */}
<input
  type="text"
  name="website"
  value={website}
  onChange={(e) => onWebsiteChange(e.target.value)}
  className="hidden"
  tabIndex={-1}
  aria-hidden="true"
/>
```

---

### `components/freight-calculator-v3/wizard/step-result.tsx` (component, request-response)

**Analog:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 1505–1950 (`CalculatorV3EstimateCard` function and its sub-components)

**Core result card pattern** (lines 1560–1626):
```typescript
// Dark card with white text — consistent pattern for estimate display
<div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
  {hasResult && (
    <div className="mb-4 flex items-center gap-2">
      <CheckCircle className="h-5 w-5 text-emerald-500" />
      <span className="text-sm font-medium text-emerald-500">
        {t.estimateSentTo.replace("{email}", email)}
      </span>
    </div>
  )}
  {/* Freight total display, line items, contact links */}
</div>
```

**Sub-component pattern** — private helper components defined at bottom of same file, not exported:
```typescript
// From wizard lines 1996–2030
function DetailRow({ label, value, highlight, mono }: { ... }) { ... }
function SectionHeader({ num, title }: { ... }) { ... }
```
These will move to `step-result.tsx` (private) or a shared `wizard/ui.tsx` if reused across steps.

**Post-result CTA pattern** (links use `CONTACT` constants — lines ~1850+):
```typescript
<a
  href={CONTACT.whatsappUrl}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => trackContactClick("whatsapp", "calculator_v3_result")}
>
```

---

### `components/freight-calculator-v3/wizard/state.ts` (utility, transform)

**Analog:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` lines 491–535 (the flat `useState` block)

No existing `useReducer` or Context pattern exists in the codebase — the project uses local `useState` per island (confirmed by `ARCHITECTURE.md`: "No global client store. Local useState/useReducer per island"). The planner should implement this as a **typed state object + `useState`** (or `useReducer` if the planner prefers), not a Context Provider.

**Existing state shape to extract** (lines 494–521):
```typescript
// All wizard state lives in the orchestrator — extract to a shared type:
type WizardState = {
  profileId: string;
  modeId: ShippingMode;        // "whole" | "container"
  quantity: number;
  destinationCountry: string;
  destinationPortKey: string | null;
  routePreference: RoutePreference;  // "cheapest" | "fastest"
  routeId: string | null;
  zipCode: string;
  equipmentValueUsd: number | null;
  rateBookSignature: string;
  // Contact fields (for step-contact):
  email: string;
  name: string;
  company: string;
  phone: string;
  preferredContact: "email" | "whatsapp";
  website: string;             // honeypot
  // UI state:
  isSubmitting: boolean;
  error: string;
  showAllProfiles: boolean;
  mobileSheetOpen: boolean;
};
```

**No barrel exports:** Do not create an `index.ts` in `wizard/`. Import each file directly (confirmed by CONVENTIONS.md: "No barrel index.ts files").

**File naming:** `state.ts` (not `state.tsx` — no JSX), kebab-case filename, camelCase exports.

---

### `components/freight-calculator-v3/wizard/types.ts` (utility, transform)

**Analogs:**
1. `lib/types/calculator.ts` — interface style for Supabase row types and calculator I/O
2. `lib/calculator-v3/contracts.ts` — Zod-schema-derived types with `z.infer`

**Type export style** (`lib/types/calculator.ts:1–7`):
```typescript
// Named exports only. No default export.
export type ContainerType = "fortyhc" | "flatrack";

export interface EquipmentPackingRate { ... }
```

**Zod-derived types** (`lib/calculator-v3/contracts.ts:11–12`):
```typescript
export const localeCodeSchema = z.enum(["en", "es", "ru"]);
export type CalculatorLocale = z.infer<typeof localeCodeSchema>;
```

**Step prop interfaces belong here** — each step component's `Props` interface exported from `types.ts` and imported by the step file. Example:
```typescript
// wizard/types.ts
import type { EquipmentQuoteProfile, CalculatorLocale } from "@/lib/calculator-v3/contracts";

export interface StepEquipmentProps {
  profiles: EquipmentQuoteProfile[];
  profileId: string;
  onSelect: (profile: EquipmentQuoteProfile) => void;
  locale: CalculatorLocale;
  showAllProfiles: boolean;
  onShowAll: () => void;
}
```

**No JSX in types.ts.** Pure type declarations only.

---

### `components/freight-calculator-v3/route-globe-v3.tsx` (component, event-driven)

**Analog:** `components/freight-calculator/route-globe.tsx` (exact copy target — same `react-globe.gl` wrapper pattern)

**`next/dynamic` + `ssr: false` pattern** (`route-globe.tsx:4–7`):
```typescript
"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { resolveCoordinates, PORT_COORDINATES } from "@/components/freight-calculator/port-coordinates";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });
```

**Why a v3-specific file may be needed:** `route-globe.tsx` imports `port-coordinates` from `components/freight-calculator/` (the v2 folder). If v3 needs different port coordinate resolution or the lazy boundary should be at the `step-route.tsx` import site (so Next can tree-shake it per route), extracting a thin `route-globe-v3.tsx` wrapper that wraps `RouteGlobe` with a `next/dynamic` boundary at the *component level* (not just the `GlobeGL` inside) is the right move:

```typescript
// components/freight-calculator-v3/route-globe-v3.tsx
"use client";

// Re-export: the GlobeGL is already ssr:false inside route-globe.tsx.
// If the goal is to lift the boundary to exclude ALL globe code from the
// SSR pass, wrap the whole module here:
import dynamic from "next/dynamic";

export const RouteGlobeV3 = dynamic(
  () =>
    import("@/components/freight-calculator/route-globe").then((m) => ({
      default: m.RouteGlobe,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="relative overflow-hidden rounded-xl bg-black h-64 animate-pulse" />
    ),
  }
);
```

**Props shape:** same as `RouteGlobeProps` in `route-globe.tsx:10–16`:
```typescript
interface RouteGlobeProps {
  originPort: string | null;
  destinationPort: string | null;
  destinationCountry: string | null;
  containerType?: "fortyhc" | "flatrack" | null;
  className?: string;
}
```

---

### `components/freight-calculator-v3/calculator-v3-wizard.tsx` (modified orchestrator, ≤500 lines)

**Analog:** `components/freight-calculator/calculator-progress-bar.tsx` (thin, stateless coordinator pattern — accepts props, renders sub-components)

**After refactor, orchestrator owns:**
1. Data fetch via `getCalculatorDataV3()` (lines 523–535 pattern)
2. All `useState` / `useRef` vars (or a `useReducer` wrapping `WizardState`)
3. Event handler functions: `selectProfile`, `selectMode`, `selectRoute`, `handleSubmit`, `resetAll`
4. `useMemo` derived values: `profile`, `mode`, `enabledMode`, `eligibleCountries`, `routeOptions`, `selectedRoute`, `preview`, `completedSteps`
5. Layout: `<CalculatorProgressBar>` + `<div className="flex flex-col gap-8 lg:flex-row">` + step renders + mobile sheet

**What moves OUT:** All JSX for equipment grid (→ `StepEquipment`), route section (→ `StepRoute`), estimate card form (→ `StepContact` + `StepResult`), and private sub-components `DetailRow` / `SectionHeader`.

**Import pattern after split** (lines 1–71 condensed):
```typescript
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorProgressBar } from "@/components/freight-calculator/calculator-progress-bar";
import { StepEquipment } from "@/components/freight-calculator-v3/wizard/step-equipment";
import { StepRoute } from "@/components/freight-calculator-v3/wizard/step-route";
import { StepContact } from "@/components/freight-calculator-v3/wizard/step-contact";
import { StepResult } from "@/components/freight-calculator-v3/wizard/step-result";
import { getCalculatorDataV3 } from "@/app/actions/calculator-v3-data";
import { submitCalculatorV3 } from "@/app/actions/calculator-v3";
import { calculateFreightV3, compareRoutesForFreightV3 } from "@/lib/calculator-v3/engine";
import { CONTACT } from "@/lib/constants";
import type { CalculatorDataV3 } from "@/lib/calculator-v3/contracts";
```

---

## Shared Patterns

### `"use client"` directive placement
**Source:** Every client component in the codebase (`calculator-v3-wizard.tsx:1`, `schedule-booking-form.tsx:1`, `route-globe.tsx:1`)
**Apply to:** All new files in `wizard/` that render JSX or use hooks
**Rule:** `"use client"` is line 1, before any imports. Files with no JSX (`state.ts`, `types.ts`) do NOT get `"use client"`.

### Named exports (no default)
**Source:** `CONVENTIONS.md` + `components/freight-calculator/calculator-progress-bar.tsx:12`
```typescript
export function CalculatorProgressBar(...) { ... }
```
**Apply to:** All step components (`StepEquipment`, `StepRoute`, `StepContact`, `StepResult`), `RouteGlobeV3`, state/types exports.
**Exception:** `route-globe-v3.tsx` uses `export const RouteGlobeV3 = dynamic(...)` — still a named export.

### Section header sub-component
**Source:** `components/freight-calculator-v3/calculator-v3-wizard.tsx:2021–2030`
```typescript
function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {String(num).padStart(2, "0")}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}
```
**Apply to:** Move into a shared file (e.g., `wizard/ui.tsx`) or duplicate per-step file. Either approach is valid — codebase has no barrel files, so a `ui.tsx` helper is preferred over duplication.

### Progressive-disclosure opacity pattern
**Source:** `calculator-v3-wizard.tsx:1019–1025`
```typescript
<section
  aria-disabled={!enabled || undefined}
  className={`transition-[opacity,transform] duration-300 ${
    !enabled ? "pointer-events-none translate-y-2 opacity-40" : "translate-y-0 opacity-100"
  }`}
>
```
**Apply to:** `StepRoute` (disabled when `!step1Done`), `StepContact`/`StepResult` area (disabled when `!step3Done`).

### Contact info — always from constants
**Source:** `lib/constants.ts` (`CONTACT.whatsappUrl`, `CONTACT.phone`, `CONTACT.emailHref`)
**Apply to:** Any CTA in `step-result.tsx` or `step-contact.tsx` that links to phone/WhatsApp/email. Never hardcode.

### Tracking — funnel events on state transitions
**Source:** `calculator-v3-wizard.tsx:700–741` (`trackCalcFunnel`, `trackGA4Event`, `vercelTrack`)
**Apply to:** Keep tracking calls in the orchestrator's handler functions (`selectProfile`, `selectMode`, `selectRoute`, `handleSubmit`). Step components receive `on*` callbacks and do not call tracking directly.

### `import type` for type-only imports
**Source:** `calculator-v3-wizard.tsx:59–70`
```typescript
import type {
  CalculatorDataV3,
  CalculatorLocale,
  EquipmentQuoteMode,
  ...
} from "@/lib/calculator-v3/contracts";
```
**Apply to:** All step component props files — use `import type` for all types from `contracts.ts`, `types.ts`.

### Section banner comments for long files
**Source:** `route-globe.tsx:8–9`, `schedule-booking-form.tsx:53`
```typescript
// ─── Types ────────────────────────────────────────────────────────────────────
// ─── Constants ────────────────────────────────────────────────────────────────
// ─── Component ────────────────────────────────────────────────────────────────
```
**Apply to:** `route-globe-v3.tsx` and the slimmed orchestrator to maintain the existing sectioning style.

---

## No Analog Found

No files in this phase lack analogs. All patterns have strong source references in the codebase.

---

## Metadata

**Analog search scope:** `components/freight-calculator-v3/`, `components/freight-calculator/`, `components/schedule/`, `components/destinations/`, `lib/types/`, `lib/calculator-v3/`
**Files scanned:** 14
**Pattern extraction date:** 2026-05-04
