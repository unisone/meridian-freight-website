# Phase 2: Wizard orchestrator slim-down — Context

**Gathered:** 2026-05-04
**Status:** Ready for planning
**Mode:** Auto-generated — all architectural decisions inherited from Phase 1's research bundle

<domain>
## Phase Boundary

Extract Section 1/2/3 JSX from `components/freight-calculator-v3/calculator-v3-wizard.tsx` into per-step component modules under `components/freight-calculator-v3/wizard/`, extract the estimate-card UI into `wizard/estimate-card.tsx`, and migrate the orchestrator from 18 individual `useState` calls to the `wizardReducer` already tested in Phase 1. Bring the orchestrator file below 500 lines (currently 1,621 lines after Phase 1's COPY extraction).

This is a pure refactor — no behavioral change, no UX change, no analytics-event reordering, no styling change. The wizardReducer + WizardState contract + step prop interfaces (StepEquipmentProps, StepSpecsProps, StepRouteProps, EstimateCardProps) are already on disk in `components/freight-calculator-v3/wizard/{state.ts,types.ts}` and tested via `wizard/__tests__/state.test.ts`.

</domain>

<decisions>
## Implementation Decisions (LOCKED — inherited from Phase 1 research)

The Phase 1 GSD pipeline (researcher → mapper → planner → checker → revision) produced a comprehensive plan covering Tasks 5-8 in `.planning/phases/01-wizard-split-globe-boundary/01-01-PLAN.md`. Those tasks ARE Phase 2's scope. Every architectural call is already settled:

### State strategy: `useReducer` + props (no Context)
- **Decision:** Replace 18 `useState` calls in the orchestrator with a single `useReducer(wizardReducer, initialWizardState)` call from `components/freight-calculator-v3/wizard/state.ts`.
- **Rationale:** Independently confirmed by both `gsd-phase-researcher` and `gsd-pattern-mapper` — flat `useState` is the project-wide pattern; Context would introduce a new pattern. The `selectProfile()` handler cascade-resets 6 fields atomically, which is naturally a reducer action.
- **Locked in:** `components/freight-calculator-v3/wizard/state.ts:25–165` (already merged in PR #108).

### Step boundaries (LINE-PRECISE per RESEARCH.md, validated post-COPY-extraction)

After Phase 1's COPY extraction shifted line numbers, the section boundaries in the current orchestrator are:
- **Section 1 (lines 560–608)** → `wizard/step-equipment.tsx` using `StepEquipmentProps`
- **Section 2 (lines 610–746)** → `wizard/step-specs.tsx` using `StepSpecsProps`
- **Section 3 (lines 748–1002)** → `wizard/step-route.tsx` using `StepRouteProps` (imports `RouteGlobeV3` from `../route-globe-v3`)
- **Estimate-card UI (lines 1003–~1620)** → `wizard/estimate-card.tsx` using `EstimateCardProps`

The orchestrator retains: state declarations (line 1–~140 in current file before `useReducer` migration), `useEffect`s, derived `useMemo`s, event handlers, refs (`submittingRef`, `customsTrackedRef`), and the top-level JSX skeleton that composes the step components.

### Globe import constraint
- The wizard already imports `RouteGlobeV3 as RouteGlobe` from `./route-globe-v3` (Phase 1, REQ-02). `step-route.tsx` MUST import the same way (NEVER directly from `@/components/freight-calculator/route-globe`) — the lazy boundary lifted in Phase 1 must be preserved.

### Tracking guard (HIGHEST RISK — locked)
- **Decision:** All `trackCalcFunnel`, `trackContactClick`, `trackGA4Event`, `trackPixelEvent`, `trackGoogleAdsConversion`, `vercelTrack` calls MUST stay in orchestrator event handlers. They MUST NEVER move into the reducer body. Reducer is pure.
- **Rationale:** Top risk per `01-RESEARCH.md` Pitfall 1. Analytics out-of-order = silent attribution corruption.

### `submittingRef` and `customsTrackedRef` preservation
- Both refs stay at orchestrator level. They guard against double-submission and per-route customs tracking respectively. `useReducer` migration must not touch refs.

### Naming deviation (already documented)
- `wizard/estimate-card.tsx` is one file (not `step-contact.tsx` + `step-result.tsx` per PATTERNS.md). Justification in `01-01-PLAN.md` `<deviation_notes>`.

### Out of scope for this phase (locked)
- No RTL/jsdom — Phase 3 (REQ-03)
- No server-action edits
- No `lib/calculator-v3/` changes
- No UX or styling changes
- No new dependencies

</decisions>

<code_context>
## Existing Code Insights

The Phase 1 GSD pipeline already produced a comprehensive code map. Phase 2 inherits all of it:

- **Research:** `.planning/phases/01-wizard-split-globe-boundary/01-RESEARCH.md` (710 lines) — strategy, line-precise split, risk register, validation architecture
- **Patterns:** `.planning/phases/01-wizard-split-globe-boundary/01-PATTERNS.md` (499 lines) — 7/7 file analogs found, conventions to inherit
- **Plan (Tasks 5-8):** `.planning/phases/01-wizard-split-globe-boundary/01-01-PLAN.md` (833 lines) — Task 5 (step-equipment), Task 6 (step-specs), Task 7 (step-route), Task 8a (estimate-card extract), Task 8b (useReducer migration)
- **Validation:** `.planning/phases/01-wizard-split-globe-boundary/01-VALIDATION.md` — pass/fail decision tree

Phase 1's research applies verbatim to Phase 2 — same files, same constraints, same risks. The plan is the spec.

</code_context>

<specifics>
## Specific Ideas

The Phase 2 plan (which the planner agent will produce) should be a focused subset of the original 10-task plan from Phase 1:

1. **Task 5: extract step-equipment.tsx** (lines 560–608 of orchestrator) — `StepEquipmentProps` from `wizard/types.ts`
2. **Task 6: extract step-specs.tsx** (lines 610–746) — `StepSpecsProps`
3. **Task 7: extract step-route.tsx** (lines 748–1002) — `StepRouteProps`, imports `RouteGlobeV3`
4. **Task 8a: extract estimate-card.tsx** (lines 1003–~1620) — `EstimateCardProps`. Pure JSX motion; useState preserved. Verify orchestrator+estimate-card still compiles before 8b.
5. **Task 8b: useReducer migration** — replace 18 `useState` with `useReducer(wizardReducer)`. Wire all handlers to dispatch. AUDIT tracking-call locations. Slim orchestrator below 500 lines.
6. **Task 9: full validation chain** — type-check + lint + test + build + bundle gate (already passing from Phase 1, verify still passes)
7. **Task 10: browser-verify funnel** — local `npm start`, complete equipment → country → ZIP → email → estimate funnel, screenshot.

Each task = one atomic commit per CLAUDE.md SOP.

</specifics>

<deferred>
## Deferred Ideas

None — Phase 2's scope is fully locked from Phase 1's pipeline. No speculative work.

Future possibilities not in this phase:
- Step-level Context if prop counts become painful (~20 props in step-route) — defer to v1.2
- Splitting estimate-card into step-contact + step-result if it exceeds 500 lines during execution — handled by Task 8a's escape hatch
- Adding component-level tests after the modular structure exists — that's Phase 3 (REQ-03)

</deferred>
