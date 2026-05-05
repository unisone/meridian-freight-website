---
phase: 2
phase_name: "Wizard orchestrator slim-down"
plan: "02-01"
subsystem: freight-calculator
tags: [refactor, wizard, useReducer, REQ-01]
requires:
  - .planning/phases/01-wizard-split-globe-boundary/01-01-SUMMARY.md
  - components/freight-calculator-v3/wizard/state.ts
  - components/freight-calculator-v3/wizard/types.ts
  - components/freight-calculator-v3/wizard/copy.ts
  - components/freight-calculator-v3/route-globe-v3.tsx
provides:
  - components/freight-calculator-v3/wizard/step-equipment.tsx
  - components/freight-calculator-v3/wizard/step-specs.tsx
  - components/freight-calculator-v3/wizard/step-route.tsx
  - components/freight-calculator-v3/wizard/estimate-card.tsx
  - components/freight-calculator-v3/wizard/estimate-card-helpers.tsx
  - components/freight-calculator-v3/wizard/wizard-shell.tsx
affects:
  - components/freight-calculator-v3/calculator-v3-wizard.tsx
tech_stack:
  added: []
  patterns:
    - "useReducer(wizardReducer, initialWizardState) at orchestrator"
    - "Per-step JSX modules consuming Step{Equipment,Specs,Route}Props"
    - "Sanctioned helper-split escape hatch (estimate-card-helpers.tsx) when source block exceeds 500 lines"
key_files:
  created:
    - components/freight-calculator-v3/wizard/step-equipment.tsx
    - components/freight-calculator-v3/wizard/step-specs.tsx
    - components/freight-calculator-v3/wizard/step-route.tsx
    - components/freight-calculator-v3/wizard/estimate-card.tsx
    - components/freight-calculator-v3/wizard/estimate-card-helpers.tsx
    - components/freight-calculator-v3/wizard/wizard-shell.tsx
    - .planning/phases/02-wizard-orchestrator-slim-down/baseline.txt
    - .planning/phases/02-wizard-orchestrator-slim-down/postrefactor.txt
  modified:
    - components/freight-calculator-v3/calculator-v3-wizard.tsx
decisions:
  - "useReducer + props (no Context) — flat-state pattern matches the project convention"
  - "estimate-card-helpers.tsx split when verbatim source block exceeded 500 lines"
  - "Loading skeleton + error fallback + mobile sheet extracted to wizard-shell.tsx (3 named exports)"
  - "selectDestinationCountry promoted to a named orchestrator handler so trackCalcFunnel('step') and trackCalcFunnel('complete') stay in handler scope (not in step-route.tsx)"
  - "submittingRef and customsTrackedRef preserved as useRef instances; NOT folded into reducer state"
  - "Tracking call ordering preserved bit-for-bit: dispatch → side effects (matches pre-refactor setState → side-effect ordering)"
metrics:
  duration_minutes: 30
  completed_date: 2026-05-05
  pr: 110
  pr_merged_commit: e0a379f314cfb65e9c7a41775fb80a76c76d2173
---

# Phase 2 Plan 02-01: Wizard Orchestrator Slim-Down Summary

**One-liner:** Cut `calculator-v3-wizard.tsx` from 1,621 lines to 497 lines by extracting four step JSX modules (equipment / specs / route / estimate-card) plus a wizard shell and migrating the 18 useState calls to the existing `wizardReducer` — pure refactor, zero behavioral change, REQ-02 globe boundary preserved.

## Outcome

| Metric | Baseline | Post-refactor |
|---|---:|---:|
| `calculator-v3-wizard.tsx` | 1,621 lines | **497 lines** (target ≤500) |
| `wizard/estimate-card.tsx` | n/a | 487 lines |
| `wizard/step-route.tsx` | n/a | 293 lines |
| `wizard/step-specs.tsx` | n/a | 176 lines |
| `wizard/wizard-shell.tsx` | n/a | 168 lines |
| `wizard/step-equipment.tsx` | n/a | 82 lines |
| `wizard/estimate-card-helpers.tsx` | n/a | 70 lines |
| `route-globe-v3.tsx` | 36 lines | 36 lines (untouched) |
| Vitest test count | 117 passing | **117 passing** |
| react-globe.gl in initial calculator chunks | 0 | **0** (Phase 1 boundary preserved) |
| Globe library chunk | `06_sk3k-6k40a.js` (~1.5MB) | `06_sk3k-6k40a.js` (~1.5MB, lazy-loaded) |

All wizard/* files ≤500 lines. Orchestrator ≤500 lines. Phase verification gates 1-7 all pass; gate 8 (functional parity) verified at HTTP level (200 OK across all locales + legacy redirects, SSR skeleton renders, no globe in initial HTML).

## Atomic Commits

| Task | Commit | Description |
|---|---|---|
| 1 | `971e227` | `chore(02-01): capture Phase 2 pre-flight baseline` |
| 2 | `fc170e9` | `refactor(02-01): extract Section 1 to wizard/step-equipment.tsx` |
| 3 | `077a33c` | `refactor(02-01): extract Section 2 to wizard/step-specs.tsx` |
| 4 | `485c3af` | `refactor(02-01): extract Section 3 to wizard/step-route.tsx` |
| 5a | `e194893` | `refactor(02-01): extract estimate-card to wizard/estimate-card.tsx` |
| 5b | `92fddce` | `refactor(02-01): migrate orchestrator useState to useReducer` |
| 6 | `2413492` | `chore(02-01): record post-refactor validation snapshot` |

Squash-merged as `e0a379f` on `main` via PR #110 (2026-05-05 00:22 UTC).

## Behavior Parity Audit (Pitfalls 1 + 2 — highest-risk audit per `01-RESEARCH.md`)

- ✅ `state.ts` import audit: zero tracking imports (`grep -E "trackCalcFunnel|trackContact|trackGA4|trackPixel|trackGoogleAds|vercelTrack" wizard/state.ts` → empty)
- ✅ `submittingRef.current` checked at top of `handleSubmit` (line 278) before any `dispatch`
- ✅ `customsTrackedRef = useRef(new Set<string>())` preserved as ref (line 47)
- ✅ `trackCalcFunnel("start", ...)` fires from `selectProfile` AFTER `dispatch({ type: "SELECT_PROFILE", ... })`
- ✅ `trackGA4Event("calculator_mode_selected", ...)` + `vercelTrack("calculator_mode_selected", ...)` fire from `selectMode` AFTER `dispatch({ type: "SELECT_MODE", ... })`
- ✅ `trackGA4Event("calculator_route_selected", ...)` + `vercelTrack("calculator_route_selected", ...)` fire from `selectRoute` AFTER `dispatch({ type: "SELECT_ROUTE", ... })`
- ✅ `trackCalcFunnel("step", ...)` + `trackCalcFunnel("complete", ...)` fire from new orchestrator-level `selectDestinationCountry` handler AFTER `dispatch({ type: "SET_DESTINATION_COUNTRY", ... })`
- ✅ `generate_lead`, `calculator_lead_submitted`, `trackGoogleAdsConversion`, `vercelTrack`, and `trackPixelEvent("Lead", ..., res.eventId)` fire from `handleSubmit` AFTER `dispatch({ type: "SUBMIT_SUCCESS", ... })`
- ✅ Phase 1's `state.test.ts` (5 reducer cascade tests) still passes — covers SELECT_PROFILE / SELECT_MODE / RESET_ALL / RESET_ESTIMATE / SUBMIT_SUCCESS

## Production Verification (post-merge)

```
HTTP 200 https://meridianexport.com/pricing/calculator
HTTP 200 https://meridianexport.com/es/pricing/calculator
HTTP 200 https://meridianexport.com/ru/pricing/calculator
HTTP 308 → /pricing/calculator   https://meridianexport.com/pricing/calculator-v2
HTTP 308 → /pricing/calculator   https://meridianexport.com/pricing/calculator-v3
```

- Title: `Freight Cost Calculator — Instant Estimate | Meridian Export`
- Initial HTML: 4 skeleton progress bars rendered (WizardLoadingSkeleton from `wizard-shell.tsx`)
- Initial HTML: 0 `react-globe` references, 0 `globeImageUrl` references — Phase 1 boundary preserved in production
- Production deploy via squash-merge `e0a379f`

## Deviations from Plan

### `[Rule 3 — Auto-fixed blocking issue]` Orchestrator stayed above 500 after Tasks 5a + 5b

- **Found during:** Task 5b verify
- **Issue:** After replacing the 18 useState calls with `useReducer`, the orchestrator was still 578 lines (later 527, then 502 after micro-compressions). The plan's "last-resort escape" called for extracting remaining presentational helpers into the existing `wizard/` subtree.
- **Fix:** Created `components/freight-calculator-v3/wizard/wizard-shell.tsx` (168 lines) hosting `WizardLoadingSkeleton`, `WizardUnavailableCard`, and `WizardMobileSheet` (the bottom-fixed sheet on mobile). All three are pure presentational components — no state, only props. Plus minor compressions: collapsed 24-line `useState` destructuring to 5 lines, collapsed two-statement early-returns to one-line returns.
- **Files modified:** `wizard/wizard-shell.tsx` (new), `calculator-v3-wizard.tsx` (replaces inline JSX with three new components)
- **Commit:** Folded into `92fddce` (Task 5b atomic commit)

### `[Rule 2 — Auto-added critical functionality]` `selectDestinationCountry` orchestrator handler

- **Found during:** Task 4 (extracting Section 3)
- **Issue:** The pre-refactor orchestrator had `trackCalcFunnel("step", ...)` and `trackCalcFunnel("complete", ...)` inlined in the country `<select>` `onChange` handler. Moving the JSX to `step-route.tsx` would put those tracking calls inside a step component (Pitfall 1 violation per `01-RESEARCH.md`).
- **Fix:** Promoted the country-change logic to a named orchestrator handler `selectDestinationCountry(country)` that dispatches `SET_DESTINATION_COUNTRY` then fires the two tracking calls. `StepRoute` only receives `onSetDestinationCountry={selectDestinationCountry}`.
- **Files modified:** `calculator-v3-wizard.tsx` (added handler), `wizard/step-route.tsx` (calls `props.onSetDestinationCountry(event.target.value)` only)
- **Commit:** `485c3af` (Task 4 atomic commit)

### Estimate-card 500-line escape hatch

- The plan's `<deviation_notes>` block sanctioned splitting presentational helpers into `wizard/estimate-card-helpers.tsx` if the verbatim block exceeded 500 lines. Used as written: extracted `DetailRow` + `ImportCostNote` (both pure presentational, no JSX-tied state) into `estimate-card-helpers.tsx`. `estimate-card.tsx` landed at 487, helpers at 70 — both ≤500.

## Out of Scope (deferred)

- RTL / jsdom / `@testing-library/react` (REQ-03 / Phase 3)
- Server-action edits (`app/actions/calculator-v3.ts` and friends untouched)
- `lib/calculator-v3/` engine changes
- UX / styling / analytics-event reordering
- New dependencies — `package.json` and lockfile untouched

## Self-Check

### Files Created (verified to exist)
- ✅ `components/freight-calculator-v3/wizard/step-equipment.tsx` (82 lines)
- ✅ `components/freight-calculator-v3/wizard/step-specs.tsx` (176 lines)
- ✅ `components/freight-calculator-v3/wizard/step-route.tsx` (293 lines)
- ✅ `components/freight-calculator-v3/wizard/estimate-card.tsx` (487 lines)
- ✅ `components/freight-calculator-v3/wizard/estimate-card-helpers.tsx` (70 lines)
- ✅ `components/freight-calculator-v3/wizard/wizard-shell.tsx` (168 lines)
- ✅ `.planning/phases/02-wizard-orchestrator-slim-down/baseline.txt`
- ✅ `.planning/phases/02-wizard-orchestrator-slim-down/postrefactor.txt`

### Commits Verified
- ✅ `971e227` (Task 1 baseline)
- ✅ `fc170e9` (Task 2 step-equipment)
- ✅ `077a33c` (Task 3 step-specs)
- ✅ `485c3af` (Task 4 step-route)
- ✅ `e194893` (Task 5a estimate-card)
- ✅ `92fddce` (Task 5b useReducer + wizard-shell)
- ✅ `2413492` (Task 6 postrefactor.txt)
- ✅ Squash-merge `e0a379f` on `main` (PR #110)

## Self-Check: PASSED
