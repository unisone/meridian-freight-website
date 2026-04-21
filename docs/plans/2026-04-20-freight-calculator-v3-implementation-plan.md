# Freight Calculator V3 Implementation Plan

Date: 2026-04-20
Branch: `codex/freight-calculator-v3-core`
Design: `docs/plans/2026-04-20-freight-calculator-v3-core-design.md`
Status: Implemented, merged, and production default
Production spec: `docs/specs/2026-04-21-freight-calculator-v3-production-spec.md`

## Execution Strategy

Use one dedicated implementation worktree for the V3 core rebuild. The work is contract-heavy and the phases depend on shared types, server actions, and tests, so splitting by phase into multiple worktrees would create avoidable merge friction.

Implementation outcome:

- `/pricing/calculator` now uses V3 and is the indexed production default.
- `/pricing/calculator-v2` keeps V2 available as a noindex rollback route.
- `/pricing/calculator-v3` remains a noindex V3 preview/debug route.

## Phase 1: Contracts

- Replace compliance `includedInFreight` semantics with a separate compliance-prep estimate.
- Add explicit import-cost status: `complete`, `partial`, `unsupported`.
- Ensure `FreightEstimateV3.freightTotal` is freight-only.
- Keep derived `freightPlusComplianceTotal` separate for customer budget display.
- Remove hardcoded tariff profile contracts that imply unsupported countries have numeric customs estimates.

## Phase 2: Rate Catalog

- Build route catalog from Supabase rows.
- Quarantine dirty rows before aliasing.
- Quarantine missing country, missing cost, non-Chicago 40HC, unknown origin, unknown destination, impossible origin, and unsupported container rows.
- Expose sanitized routes to the UI; never render raw dirty DB ports.

## Phase 3: Freight Engine

- Flatrack: inland to selected U.S. port plus opaque `Sea Freight & Loading`.
- 40HC: inland to Iowa yard plus packing/loading plus Chicago-routed ocean freight.
- No compliance, import tax, VAT, broker fee, or destination-local charge may enter `freightTotal`.
- Preserve partial quote behavior when pickup ZIP is missing.

## Phase 4: Compliance Prep

- Argentina, Chile, Uruguay, and Paraguay: show required compliance-prep category.
- Bolivia: show broker-confirmed/unknown, with no default numeric amount.
- Public UI shows dollar amounts only if public-safe. Otherwise show `quote-confirmed`.
- Internal amounts can be preserved in server payloads where sourced, but must not be shown publicly without approval.

## Phase 5: Import / Landed Cost

- Adapt the `mf-chatbot-ui` landed-cost profile pattern.
- Load active Supabase `landed_cost_profiles` when available.
- Return `unsupported` when no active profile exists.
- Return `partial` when a profile exists but equipment value or freight inputs are missing.
- Initial numeric support should only appear where a vetted active profile exists.

## Phase 6: Server Actions And UI

- `getCalculatorDataV3()` returns sanitized routes, policies, and supported profile metadata.
- `submitCalculatorV3()` refetches live rates, rebuilds catalog, recalculates server-side, and rejects tampered route/mode selections.
- Owner email, Slack, lead insert, analytics payloads include route ID, compliance status, import-cost status, warnings, policy version, and rate-book signature.
- Preview UI displays freight, compliance prep, and import-cost sections separately.

## Required Gates

- `npm run type-check`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run audit:calculator-v3`
- Browser QA on `/pricing/calculator` desktop and mobile
- Browser QA on localized calculator routes before any public calculator release

## Ship Criteria

- Core tests prove compliance never mutates freight.
- Dirty route rows are quarantined.
- Unsupported import-cost profiles show no numeric customs estimate.
- V3 is verified visually and interactively on the production route.
- The V2 calculator remains available as `/pricing/calculator-v2`.
- Default route metadata is indexable and canonical.
- Rollback plan is documented before release.
