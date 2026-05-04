# Phase 1: Wizard Split + Globe Boundary — Research

**Researched:** 2026-05-04
**Domain:** React 19 client component refactor / Next.js 16 dynamic import boundaries / Vitest component testing
**Confidence:** HIGH (all findings verified directly from source code + official library behavior)

---

## Summary

The v3 calculator wizard (`components/freight-calculator-v3/calculator-v3-wizard.tsx`, 2,030 lines) is a
single monolithic `"use client"` component. It owns all state, all derived state, all JSX for three
sequential sections (equipment category, equipment specs, shipping route), plus the estimate card
sub-component, the mobile Sheet wrapper, and a collection of helper functions and a 400-line
three-locale COPY dictionary.

The globe boundary is confirmed broken for the v3 wizard. The wizard does a **static named import** of
`RouteGlobe` from `@/components/freight-calculator/route-globe`. Inside `route-globe.tsx`, `react-globe.gl`
is wrapped with `dynamic(() => import("react-globe.gl"), { ssr: false })`. However, because the wizard
imports `route-globe.tsx` statically, Next.js includes `route-globe.tsx` in the wizard's client chunk at
build time. The `GlobeGL = dynamic(...)` call inside `route-globe.tsx` creates a *runtime* lazy split, but
this does NOT remove Three.js from the initial wizard bundle — it only defers the `<GlobeGL>` React
render. The route-globe module itself (including Three.js) still lands in the initial chunk when the wizard
chunk is parsed. The correct fix is to create a dynamic import at the wizard boundary, not inside the leaf.

State management is flat `useState` across ~18 state variables in the orchestrator. This is compatible with
a `useReducer` lift, but the more natural split for this codebase is **useReducer at orchestrator level +
per-step components receive typed slice props + dispatch callbacks** — matching the existing pattern of
prop-drilled callbacks seen in `CalculatorV3EstimateCard`.

**Primary recommendation:** Use `useReducer` at orchestrator level. Split into five files:
`wizard-step-equipment.tsx`, `wizard-step-specs.tsx`, `wizard-step-route.tsx`, `wizard-estimate-card.tsx`,
and a shared `wizard-types.ts`. Move the COPY dict and standalone helpers to `wizard-copy.ts`. Fix the
globe boundary by replacing the static `RouteGlobe` import in the wizard with a `next/dynamic` call at the
route-section level.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-01 | Split `calculator-v3-wizard.tsx` (2,030 lines) into per-step modules with shared state. Each step lives in its own file ≤500 lines. Orchestrator ≤500 lines. | State shape mapped; split boundaries defined below; useReducer pattern recommended |
| REQ-02 | Lift `RouteGlobe` to `next/dynamic({ssr:false})` from the v3 wizard so three.js never enters the main client bundle by default | Boundary break confirmed via static import at line 36; fix pattern defined below |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Wizard state (all 18 useState) | Browser / Client orchestrator | — | All state is interactive form state; no server component can own it |
| Derived state (profile, mode, routeOptions, preview) | Browser / Client orchestrator | — | Computed from interactive state; must co-locate with useState |
| Step rendering (equipment, specs, route) | Browser / Client step components | — | Each step is a pure render of a state slice; push rendering down, keep state up |
| Estimate card + email gate | Browser / Client sub-component | — | Already isolated as CalculatorV3EstimateCard; formalize the boundary |
| Globe rendering (Three.js, react-globe.gl) | Browser / Client lazy chunk | — | Deferred to post-hydration via next/dynamic at wizard level |
| Rate fetch (getCalculatorDataV3) | API / Backend (Server Action) | — | Already a server action; no change |
| Submit (submitCalculatorV3) | API / Backend (Server Action) | — | Already a server action; no change |

---

## Standard Stack

### Core (no new dependencies needed for REQ-01)
| Library | Version (verified) | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| React | 19.2.5 [VERIFIED: package.json] | useReducer, useState, useMemo, useCallback | Already in project |
| Next.js | 16.2.4 [VERIFIED: package.json] | `next/dynamic` for lazy component loading | Already in project |
| TypeScript | ^6 [VERIFIED: package.json] | Strict typing for shared state contract | Already in project |

### Testing (new dependencies for validation architecture)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | ^16.x [ASSUMED] | Component render + interaction tests | REQ-03 (Phase 2) — NOT needed for REQ-01/02 |
| jsdom | ^26.x [ASSUMED] | DOM simulation for RTL | REQ-03 (Phase 2) — NOT needed for REQ-01/02 |
| happy-dom | ^16.x [ASSUMED] | Faster alternative to jsdom for Vitest | REQ-03 (Phase 2) alternative |

**Note:** @testing-library/react is NOT installed [VERIFIED: package.json grep]. REQ-01 and REQ-02 are
pure refactors with no new test infrastructure required. The existing `npm test` suite (14 files, node
environment) will continue to pass without RTL. RTL is a Phase 2 concern (REQ-03).

### No new runtime dependencies required
The globe fix uses `next/dynamic` (already available via the `next` package). No new npm installs needed
for REQ-01 or REQ-02.

---

## Architecture Patterns

### System Architecture Diagram

```
User Browser (first paint)
        │
        ▼ loads /pricing/calculator
┌─────────────────────────────────────────────────────────────────┐
│  Initial JS bundle: CalculatorV3Wizard orchestrator chunk        │
│  ├── wizard-copy.ts (COPY dict, i18n helpers)                   │
│  ├── wizard-types.ts (WizardState, WizardAction, prop types)    │
│  ├── wizard-reducer.ts (useReducer logic)                       │
│  ├── wizard-step-equipment.tsx (Section 1 JSX only)             │
│  ├── wizard-step-specs.tsx (Section 2 JSX only)                 │
│  ├── wizard-step-route.tsx (Section 3 JSX, no globe import)     │
│  └── wizard-estimate-card.tsx (estimate card + email gate)      │
└──────────────────────┬──────────────────────────────────────────┘
                       │  user reaches step 3 → country selected
                       ▼ next/dynamic triggers lazy load
┌──────────────────────────────────────────────────────────────────┐
│  Lazy chunk (loaded on demand):                                   │
│  DynamicRouteGlobe → route-globe.tsx → react-globe.gl           │
│  (Three.js, ~600KB gzip) — NOT in initial bundle                 │
└──────────────────────────────────────────────────────────────────┘
                       │  user submits email
                       ▼ server action call
┌──────────────────────────────────────────────────────────────────┐
│  app/actions/calculator-v3.ts (Server Action)                    │
│  ├── Zod validation → honeypot check                            │
│  ├── Supabase rate re-fetch → re-calculate server-side           │
│  └── Resend + Slack + Meta CAPI + Vercel Analytics               │
└──────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
components/freight-calculator-v3/
├── calculator-v3-wizard.tsx      # Orchestrator: useReducer, derived state, layout (~300 lines)
├── wizard/
│   ├── wizard-types.ts           # WizardState, WizardAction, all step prop interfaces
│   ├── wizard-copy.ts            # COPY dict (EN/ES/RU), missingInputLabels, helper fns
│   ├── wizard-reducer.ts         # wizardReducer function, initialWizardState
│   ├── wizard-step-equipment.tsx # Section 1: category grid + showAllProfiles
│   ├── wizard-step-specs.tsx     # Section 2: mode picker, quantity, equipmentValue
│   ├── wizard-step-route.tsx     # Section 3: country, ZIP, routePreference, port tabs, route cards, globe
│   └── wizard-estimate-card.tsx  # Estimate panel + email gate + result state (was CalculatorV3EstimateCard)
```

**No barrel `index.ts`** — per CONVENTIONS.md, imports go directly to source file.

### Pattern 1: useReducer at orchestrator + typed slice props

**What:** All 18 `useState` variables collapse into a single `WizardState`. Dispatch is passed as
prop or callback to step components.

**When to use:** When state items are tightly coupled (selecting a new profile resets 6 other fields
in `selectProfile()`). useReducer makes these cascade resets explicit and testable.

**Concrete state shape:**

```typescript
// wizard/wizard-types.ts
// [VERIFIED: derived from calculator-v3-wizard.tsx lines 494-521]

export interface WizardState {
  // data layer
  data: CalculatorDataV3 | null;
  loading: boolean;
  dataError: boolean;
  rateBookSignature: string;
  // equipment step
  profileId: string;
  modeId: ShippingMode;
  quantity: number;
  equipmentValueUsd: number | null;
  showAllProfiles: boolean;
  // route step
  destinationCountry: string;
  destinationPortKey: string | null;
  routePreference: RoutePreference;
  routeId: string | null;
  zipCode: string;
  // contact/email-gate
  email: string;
  name: string;
  company: string;
  phone: string;
  preferredContact: "email" | "whatsapp";
  website: string; // honeypot
  // submission
  isSubmitting: boolean;
  error: string;
  result: CalculatorV3Result | null;
  mobileSheetOpen: boolean;
}

export type WizardAction =
  | { type: "DATA_LOADED"; payload: CalculatorDataV3 }
  | { type: "DATA_ERROR" }
  | { type: "SELECT_PROFILE"; profileId: string; modeId: ShippingMode; quantity: number }
  | { type: "SELECT_MODE"; modeId: ShippingMode }
  | { type: "SET_QUANTITY"; quantity: number }
  | { type: "SET_EQUIPMENT_VALUE"; value: number | null }
  | { type: "SET_DESTINATION_COUNTRY"; country: string }
  | { type: "SET_DESTINATION_PORT"; portKey: string | null }
  | { type: "SET_ROUTE_PREFERENCE"; preference: RoutePreference }
  | { type: "SELECT_ROUTE"; routeId: string }
  | { type: "SET_ZIP"; zip: string }
  | { type: "SET_EMAIL"; email: string }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_COMPANY"; company: string }
  | { type: "SET_PHONE"; phone: string }
  | { type: "SET_PREFERRED_CONTACT"; contact: "email" | "whatsapp" }
  | { type: "SET_WEBSITE"; website: string } // honeypot
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; result: CalculatorV3Result; currentRateBookSignature?: string }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "RESET_ESTIMATE" }
  | { type: "RESET_ALL" }
  | { type: "TOGGLE_MOBILE_SHEET"; open: boolean }
  | { type: "SHOW_ALL_PROFILES" };
```

**Why not Context?** The codebase has no established Context pattern for UI state. Prop-drilling is
the current convention (`CalculatorV3EstimateCardProps` at line 1478 shows 18 explicit props).
Context would be a new pattern addition, not a refactor. useReducer + explicit props is lower risk
for a pure-refactor phase.

**Why not per-step local state?** `selectProfile()` (lines 690-705) resets 6 fields that span step
boundaries. Per-step local state would require complex callback chains to achieve the same cascade.

### Pattern 2: next/dynamic globe boundary at wizard level

**What:** Replace the static `RouteGlobe` import in the wizard's route section with a
`next/dynamic` wrapper scoped to the wizard directory.

**The problem (verified):**
```typescript
// CURRENT: calculator-v3-wizard.tsx line 36
// [VERIFIED: grep output confirms static import]
import { RouteGlobe } from "@/components/freight-calculator/route-globe";
// ↑ This pulls route-globe.tsx into the wizard chunk at build time.
// The dynamic() inside route-globe.tsx still splits react-globe.gl at runtime,
// but route-globe.tsx itself (and its module-scope code) is in the initial bundle.
// More critically: Next.js module graph analysis sees route-globe.tsx as a static
// dependency and may include react-globe.gl in the wizard chunk depending on
// how the bundler resolves the dynamic() inside a statically-imported module.
```

**The fix:**
```typescript
// wizard/wizard-step-route.tsx
// [CITED: nextjs.org/docs/app/building-your-application/optimizing/lazy-loading]
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicRouteGlobe = dynamic(
  () => import("@/components/freight-calculator/route-globe").then((m) => ({ default: m.RouteGlobe })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 rounded-xl" />,
  }
);

// Usage inside the route section JSX — identical props, no behavioral change:
<DynamicRouteGlobe
  originPort={...}
  destinationPort={...}
  destinationCountry={...}
  containerType={...}
/>
```

**Why `.then(m => ({ default: m.RouteGlobe }))`?** `RouteGlobe` is a named export (not default).
`next/dynamic` expects a module with a `default` export, so the `.then()` re-wraps the named
export. This is the standard pattern for named exports with `next/dynamic`.
[CITED: nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#importing-named-exports]

**Boundary guarantee:** With this pattern, Next.js's bundler sees `route-globe.tsx` (and therefore
`react-globe.gl` + Three.js) as a dynamic import boundary. The module is excluded from the initial
wizard chunk and loaded only when `DynamicRouteGlobe` is first rendered.

**Note:** `route-globe.tsx` internally also calls `dynamic(() => import("react-globe.gl"), { ssr: false })`.
With the outer dynamic boundary in place, this inner dynamic becomes redundant (the whole module is
lazy). It is safe to leave it in place — it causes no harm and avoids touching `route-globe.tsx`
itself (which is also used by the v2 wizard and destinations globe).

### Pattern 3: Concrete split boundaries (with line numbers)

The wizard file has these logical regions:

| Region | Lines | Target file | Est. lines after split |
|--------|-------|-------------|------------------------|
| COPY dict + i18n helpers (`COPY`, locale helpers, label functions) | 74–490 | `wizard/wizard-copy.ts` | ~420 |
| Orchestrator state + derived state + handlers + layout JSX | 491–1476 | `calculator-v3-wizard.tsx` | ~400 |
| Section 1 JSX: equipment category grid | 969–1017 | `wizard/wizard-step-equipment.tsx` | ~80 |
| Section 2 JSX: mode picker, quantity, value input | 1018–1155 | `wizard/wizard-step-specs.tsx` | ~140 |
| Section 3 JSX: country, ZIP, routePreference, port tabs, route cards, globe, preview summary | 1156–1413 | `wizard/wizard-step-route.tsx` | ~260 |
| EstimateCard sub-component (existing `CalculatorV3EstimateCard` + `CalculatorV3EstimateCardProps`) | 1478–1960 | `wizard/wizard-estimate-card.tsx` | ~490 |
| Small helper components (`ImportCostNote`, `DetailRow`, `SectionHeader`) | 1961–2030 | `wizard/wizard-estimate-card.tsx` (collocated) or `wizard-copy.ts` | ~70 |
| WizardState interface + WizardAction union + step prop types | new | `wizard/wizard-types.ts` | ~80 |
| wizardReducer function | new | `wizard/wizard-reducer.ts` | ~80 |

**Step 1 JSX (equipment category grid):** Lines 969–1017. Props needed:
`visibleProfiles`, `profileId`, `showAllProfiles`, `profileCount`, `onSelectProfile`, `onShowAll`, `lang`, `t`.

**Step 2 JSX (specs):** Lines 1019–1155. Props needed:
`profile`, `modeId`, `quantity`, `equipmentValueUsd`, `enabledMode`, `lang`, `t`,
`onSelectMode`, `onSetQuantity`, `onSetEquipmentValue`, `onResetEstimate`.

**Step 3 JSX (route + globe):** Lines 1157–1413. Props needed:
`data`, `profile`, `enabledMode`, `eligibleCountries`, `activeDestinationCountry`, `zipCode`,
`routePreference`, `showPortTabs`, `destinationPortKeys`, `selectedDestinationPortKey`,
`routesForCountry`, `routeOptions`, `selectedRoute`, `preview`, `step2Done`, `lang`, `t`,
`onSetDestinationCountry`, `onSetDestinationPortKey`, `onSetRoutePreference`, `onSelectRoute`,
`onSetZip`, `onResetEstimate`.

**Orchestrator after split:** Owns `useReducer`, all `useMemo` derived state, `handleSubmit`,
`selectProfile`, `selectMode`, `selectRoute`, `resetAll`, `resetEstimateState`, loading/error guards,
mobile Sheet shell, and composes the three step components + estimate card.

### Anti-Patterns to Avoid

- **Do not create barrel index.ts** in `wizard/`: CONVENTIONS.md prohibits barrel files. Direct imports only.
- **Do not split `COPY` into per-step files**: All three locales and all steps share keys across sections (e.g., `t.disclaimer` is rendered in the orchestrator, `t.equipmentSpecs` in step 2). Keep the full COPY dict in one file.
- **Do not use React Context for this refactor**: No Context pattern exists in the codebase. Adding one is a new pattern, not a refactor. Stick with props + dispatch callbacks.
- **Do not move state into step components**: Steps are presentational — they render a slice of state and emit events. State and derived state live in the orchestrator only.
- **Do not touch route-globe.tsx**: It is also used by the v2 wizard and destinations-globe.tsx. Only add the wrapper in wizard-step-route.tsx.
- **Do not default-export step components**: CONVENTIONS.md requires named exports for components in `components/`. Default exports are reserved for Next.js page/layout files.
- **Do not use `any` for refs**: CONVENTIONS.md and global TypeScript rules prohibit `any`. The `globeRef` in `route-globe.tsx` is an existing `any` (tracked as tech debt in CONCERNS.md) — do not introduce new ones.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Globe SSR exclusion | Custom script-load or manual chunk splitting | `next/dynamic({ ssr: false })` at wizard boundary | Next.js's bundler honors dynamic() as a chunk boundary; manual approaches break tree shaking |
| State cascade on profile selection | Per-step reset callbacks | `useReducer` with `SELECT_PROFILE` action that resets all downstream fields | Reducer makes cascades explicit and testable without prop drilling |
| Component tests for browser code | Manual DOM setup | `@testing-library/react` + jsdom (Phase 2) | No current RTL infra — this is a Phase 2 concern (REQ-03), not this phase |

---

## Common Pitfalls

### Pitfall 1: Breaking analytics event ordering during state extraction

**What goes wrong:** `selectProfile()` (line 690) fires `trackCalcFunnel("start", ...)` after setting
state. If the tracking call is moved into the reducer or forgotten during extraction, the analytics
funnel breaks silently.

**Why it happens:** Analytics calls are side-effects co-located with state mutations in event handlers.
When migrating to `useReducer`, it's easy to put the tracking inside the reducer (forbidden — reducers
must be pure) or to move it to a `useEffect` that misses the trigger condition.

**How to avoid:** Keep tracking calls in event handler functions (`selectProfile`, `selectMode`,
`selectRoute`) in the orchestrator, fired *after* dispatching the action. Never put `trackGA4Event` or
`vercelTrack` inside the reducer body.

**Warning signs:** `trackCalcFunnel("start", ...)` fires zero times in GA4 after refactor.

---

### Pitfall 2: Stale `submittingRef` after extraction

**What goes wrong:** `submittingRef` (line 520) is a `useRef` used to prevent double-submission.
`handleSubmit` checks `submittingRef.current` as a guard (line 744). If this ref is not kept in the
orchestrator (alongside `handleSubmit`), it can lose its referential identity.

**Why it happens:** `useRef` values don't serialize into `useReducer` state (they're mutable, not
declarative state). A common mistake is to move the submission guard into the reducer via a boolean
state field, which has a stale-closure problem inside the `async handleSubmit` function.

**How to avoid:** Keep `submittingRef` as a `useRef` in the orchestrator alongside `handleSubmit`.
Add a `isSubmitting` boolean to `WizardState` (dispatched via `SUBMIT_START`/`SUBMIT_END`) for UI
display, but keep the actual double-submission guard as the ref.

**Warning signs:** Double-submission is possible during loading state; or `handleSubmit` never
returns because the ref is always `true`.

---

### Pitfall 3: Globe dynamic import with named export

**What goes wrong:** `next/dynamic` expects a default export. `RouteGlobe` is a named export.
Using `dynamic(() => import("@/components/freight-calculator/route-globe"))` directly will render
nothing (no error, just invisible) because `default` is `undefined`.

**Why it happens:** Standard docs example assumes default export. Named export case requires `.then()`.

**How to avoid:** Use the `.then(m => ({ default: m.RouteGlobe }))` pattern (shown in Pattern 2
above). Verify with `next build` that the `react-globe.gl` chunk no longer appears in the initial
page bundle for `/pricing/calculator`.

**Warning signs:** Globe renders fine in dev (Turbopack bypasses the boundary) but missing in
production build; or build output shows `react-globe.gl` in the main calculator chunk.

---

### Pitfall 4: Type errors from prop explosion in step components

**What goes wrong:** Step 3 (route section) needs ~20 props. TypeScript will flag any mismatch
between the orchestrator's `satisfies StepRouteProps` and the component's destructuring.

**Why it happens:** The orchestrator passes all derived values that steps need. During extraction,
it's easy to miss a derived value (e.g., `routesForCountry`, which is `useMemo` inside the
orchestrator and not in `WizardState` directly).

**How to avoid:** Define each step's prop interface in `wizard-types.ts` first, before writing the
component body. Let TypeScript errors drive completeness rather than discovering them at runtime.

**Warning signs:** `Property X does not exist on type StepRouteProps` errors from tsc.

---

### Pitfall 5: Vitest failing on JSX imports from the split modules

**What goes wrong:** Current tests run in `environment: "node"`. After the split, if any existing
test accidentally imports a `.tsx` file that includes JSX, Vitest will throw a parse error because
the node environment has no DOM.

**Why it happens:** REQ-01 moves COPY, types, and reducer logic into `wizard/`. If any existing test
for `lib/calculator-v3/` indirectly imports from the wizard directory (unlikely but possible through
re-exports), it would fail.

**How to avoid:** Keep `wizard-types.ts` importing only from `@/lib/calculator-v3/contracts` and
`@/lib/types/calculator` — never from React or shadcn. Keep the reducer in `wizard-reducer.ts` as a
pure function that does not import React. This allows `wizard-reducer.ts` to be tested in the node
environment if needed.

**Warning signs:** `SyntaxError: Unexpected token '<'` in Vitest output after the refactor.

---

## Code Examples

### Concrete reducer excerpt (cascade reset pattern)

```typescript
// wizard/wizard-reducer.ts
// Pattern derived from selectProfile() lines 690-705 and resetAll() lines 840-860
// [VERIFIED: calculator-v3-wizard.tsx]

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SELECT_PROFILE":
      return {
        ...state,
        profileId: action.profileId,
        modeId: action.modeId,
        quantity: action.quantity,
        equipmentValueUsd: null,
        destinationCountry: "",
        destinationPortKey: null,
        routeId: null,
        zipCode: "",
        result: null,
        error: "",
      };
    case "SELECT_MODE":
      return {
        ...state,
        modeId: action.modeId,
        equipmentValueUsd: null,
        destinationCountry: "",
        destinationPortKey: null,
        routeId: null,
        result: null,
        error: "",
      };
    case "RESET_ESTIMATE":
      return { ...state, result: null, error: "" };
    case "RESET_ALL":
      return initialWizardState;
    // ... other cases
  }
}
```

### DynamicRouteGlobe pattern (named export wrapping)

```typescript
// wizard/wizard-step-route.tsx (excerpt)
// [CITED: nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#importing-named-exports]
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicRouteGlobe = dynamic(
  () =>
    import("@/components/freight-calculator/route-globe").then((m) => ({
      default: m.RouteGlobe,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full rounded-xl" />,
  }
);
```

### Orchestrator structure after split (skeleton)

```typescript
// calculator-v3-wizard.tsx (after split, ~300 lines)
"use client";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { wizardReducer, initialWizardState } from "./wizard/wizard-reducer";
import { WizardStepEquipment } from "./wizard/wizard-step-equipment";
import { WizardStepSpecs } from "./wizard/wizard-step-specs";
import { WizardStepRoute } from "./wizard/wizard-step-route";
import { WizardEstimateCard } from "./wizard/wizard-estimate-card";
// ...

export function CalculatorV3Wizard({ locale }: { locale: string }) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const submittingRef = useRef(false);
  // ... all useMemo derived state here ...
  // ... handleSubmit here (keeps submittingRef + analytics) ...
  // ... selectProfile/selectMode/selectRoute here (dispatches + tracks) ...
  return (
    // layout shell + step components
  );
}
```

---

## Bundle Size Verification

The cheapest approach to verify Three.js is excluded from the initial bundle:

```bash
# Step 1: Production build
npm run build

# Step 2: Inspect the static/chunks directory for the calculator page bundle
ls -la .next/static/chunks/ | grep -i "page\|calculator"

# Step 3: Search for react-globe.gl in the initial calculator chunk
# The calculator page chunk will have a name matching the route
grep -l "react-globe\|three\|Three" .next/static/chunks/*.js | head -5

# Step 4: Verify the globe is in a separate lazy chunk
# Expected: react-globe.gl appears ONLY in a non-initial chunk file
# (a chunk not referenced in the initial page HTML)
```

**Alternative (zero config):** After `next build`, check `.next/build-manifest.json` for the
`/pricing/calculator` key. The listed JS files are the initial bundle. Search those specific files
for `react-globe` — it should be absent. The dynamic chunk will appear under a separate hash.

**No `@next/bundle-analyzer` install required.** The manual chunk inspection above is sufficient
for a single verification step. [ASSUMED — bundle-analyzer not currently in package.json]

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | `vitest.config.ts` (environment: "node", no jsdom) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-01 | All existing tests still pass after split | regression | `npm test` | ✅ existing suite |
| REQ-01 | Type-check passes with new types | type | `npm run type-check` | ✅ tsc |
| REQ-01 | Lint passes (no new any, no barrel imports) | lint | `npm run lint` | ✅ eslint |
| REQ-01 | Build succeeds with new file structure | build | `npm run build` | ✅ next build |
| REQ-02 | react-globe.gl absent from initial calculator chunk | bundle | manual `.next/` inspection | ❌ manual step |
| REQ-02 | Globe renders correctly after dynamic load | smoke | manual browser check | ❌ manual step |

**Key insight:** REQ-01 and REQ-02 are pure refactors. The existing 14-file Vitest suite (all in
`lib/` and `app/actions/`) does not touch any component JSX and will continue to pass unchanged.
The "test" for correctness is:
1. `npm run type-check` — enforces the new type boundaries
2. `npm run lint` — catches any new `any` or forbidden patterns
3. `npm run build` — Next.js build verifies all imports resolve
4. Manual end-to-end browser check — wizard still submits correctly

### Sampling Rate

- **Per task commit:** `npm run type-check && npm run lint`
- **Per wave merge:** `npm test && npm run build`
- **Phase gate:** `npm run build` + manual browser smoke test of calculator funnel

### Wave 0 Gaps

No new test infrastructure needed for REQ-01/02. The existing test suite is the regression gate.
The component-level tests (RTL + jsdom) are a Phase 2 concern (REQ-03).

*(No Wave 0 test file gaps for this phase.)*

---

## Testing Implications

**No `@testing-library/react` or jsdom is installed.** [VERIFIED: package.json]

The existing Vitest setup (`environment: "node"`) cannot render React components. After the split:

- The **wizard reducer** (`wizard-reducer.ts`) is a pure function — it CAN be unit-tested in the
  node environment without RTL. This is a good candidate for a test file if the team wants coverage.
- The **step components** (`.tsx` files) cannot be tested without jsdom + RTL. This is out of scope
  for Phase 1 (REQ-01/02). Phase 2 (REQ-03) must add RTL infrastructure.
- The **COPY dict and helpers** (`wizard-copy.ts`) are pure functions — testable in node environment.

**Import target for future Phase 2 tests:** Once RTL is added, tests should import from the
individual step files, not from the orchestrator. Example:
```typescript
import { WizardStepEquipment } from "@/components/freight-calculator-v3/wizard/wizard-step-equipment";
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/dynamic` must wrap default export | Named exports wrapped with `.then(m => ({ default: m.X }))` | Next.js 13+ | RouteGlobe is a named export — requires the `.then()` pattern |
| `middleware.ts` for next-intl | `proxy.ts` | Next.js 16 | Already documented in CLAUDE.md; no impact on this phase |
| `"use client"` in leaf components | `"use client"` at the highest necessary boundary | React 19 RSC model | Orchestrator stays `"use client"`; step files inherit it (no need to repeat the directive in child components of a client parent) |

**Deprecated / outdated:**
- Putting `dynamic()` inside a statically-imported child component to achieve bundle splitting: This
  does NOT reliably create a build-time chunk boundary in Next.js 16. The dynamic import must be at
  the consuming module level to guarantee chunk exclusion from the parent's bundle.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Importing `route-globe.tsx` statically causes Three.js to be included in the initial wizard bundle (not just deferred at runtime) | Globe boundary analysis | LOW risk — even if Three.js is runtime-deferred by the inner dynamic(), fixing the outer boundary is still the correct architectural pattern and reduces bundle parse time |
| A2 | `@next/bundle-analyzer` is not installed (not in package.json) | Bundle verification | LOW — if it is installed, it provides a better UI for verification but the manual approach still works |
| A3 | `@testing-library/react` and jsdom are not needed for Phase 1 | Testing implications | NONE — confirmed NOT installed; RTL is definitively a Phase 2 concern |

---

## Open Questions

1. **Step 3 prop count (~20 props) — is this acceptable?**
   - What we know: Step 3 (route section) is the most complex and requires the most derived state.
   - What's unclear: Whether the team wants to accept 20 props or introduce a step-specific context.
   - Recommendation: Accept the prop explosion for Phase 1 (pure refactor); address with step-level
     context in a future cleanup if it becomes a pain point.

2. **Should `wizard-reducer.ts` be unit tested in this phase?**
   - What we know: The reducer is a pure function that CAN be tested in the node environment.
   - What's unclear: Whether the team wants to expand test coverage in Phase 1 or defer to Phase 2.
   - Recommendation: Add `wizard-reducer.test.ts` as part of Wave 0 if the planner agrees — it's
     low effort (no jsdom), high value (cascade reset bugs are the top risk), and doesn't require
     any new dependencies.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 1 is a pure code refactor. No external services, CLIs, databases, or
runtimes beyond the project's existing Node.js + npm stack are required. All required tools
(`node`, `npm`, `tsc`, `eslint`, `next`) are already verified in the project.

---

## Security Domain

`security_enforcement` is not explicitly set to `false` in config.json. Reviewing ASVS applicability
for this phase:

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Phase is a pure UI refactor; no auth changes |
| V3 Session Management | No | No session state changes |
| V4 Access Control | No | No new endpoints or server actions |
| V5 Input Validation | No | No new inputs; existing Zod schemas unchanged |
| V6 Cryptography | No | No crypto changes |

**Security impact: NONE.** REQ-01 and REQ-02 are structural refactors of an existing client
component. No server actions, no validation logic, no API endpoints, and no data flows change.
The honeypot field (`website`), Zod schema, and server action pipeline are untouched.

---

## Sources

### Primary (HIGH confidence — verified directly from codebase)
- `components/freight-calculator-v3/calculator-v3-wizard.tsx` — full read, all structural decisions verified against actual line numbers
- `components/freight-calculator/route-globe.tsx` — confirmed `dynamic(() => import("react-globe.gl"), { ssr: false })` at line 7; named export `RouteGlobe` confirmed
- `package.json` — confirmed versions: Next.js 16.2.4, React 19.2.5, Vitest 4.1.4, motion ^12.38.0, react-globe.gl ^2.37.1; confirmed absence of @testing-library/react, jsdom
- `vitest.config.ts` — confirmed `environment: "node"`, no jsdom
- `.planning/codebase/CONVENTIONS.md` — named exports, no barrel files, prop-drill pattern, `@/` alias
- `.planning/codebase/TESTING.md` — 14 existing test files, node environment only
- `.planning/codebase/CONCERNS.md` — globe boundary concern, wizard size concern, type debt

### Secondary (MEDIUM confidence — official documentation)
- [CITED: nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#importing-named-exports] — named export wrapping pattern for `next/dynamic`

### Tertiary (LOW confidence)
- None in this research.

---

## Metadata

**Confidence breakdown:**
- Wizard split strategy: HIGH — read entire wizard file, mapped all state variables and event handlers
- Globe boundary: HIGH — confirmed static import at line 36; confirmed dynamic import inside route-globe.tsx at line 7; Next.js bundler behavior for this pattern is well-established
- Testing implications: HIGH — package.json confirms no RTL/jsdom; vitest.config.ts confirms node env
- Risks + mitigations: HIGH — derived from reading actual code paths (analytics tracking, submittingRef usage)

**Research date:** 2026-05-04
**Valid until:** 2026-06-04 (stable stack; no fast-moving deps in this phase)
