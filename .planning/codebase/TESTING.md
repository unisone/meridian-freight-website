# Testing Patterns

**Analysis Date:** 2026-05-04

## Test Framework

**Runner:**
- Vitest 4.1.4 (devDependency in `package.json`)
- Config: `vitest.config.ts`

**Assertion library:**
- Vitest built-in `expect` (Jest-compatible API). `globals: true` is set, so `describe`, `it`, `expect`, `vi` are available without import — but tests **always import them explicitly** for clarity.

**Environment:**
- `environment: "node"` — all current tests are pure-Node (no DOM).
- No JSDOM / no Testing Library / no `@testing-library/react` / no MSW installed.

**Path alias:**
- `resolve: { alias: { "@": path.resolve(__dirname, ".") } }` — mirrors `tsconfig.json` so `@/lib/...` works inside tests.

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { globals: true, environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

## Run Commands

From `package.json`:

```bash
npm test            # vitest run        — single CI-style pass
npm run test:watch  # vitest            — watch mode for development
npm run lint        # eslint
npm run type-check  # tsc --noEmit      — type safety check (separate from tests)
npm run build       # next build
```

**No coverage script defined.** No `--coverage` configured. No `@vitest/coverage-v8` or `@vitest/coverage-istanbul` installed.

## Test File Organization

**Location:** Co-located in `__tests__/` directories next to the source under test.

```
lib/__tests__/
├── calculator-contract.test.ts
├── calculator-v3-import-cost.test.ts
├── calculator-v3-lead-metadata.test.ts
├── calculator-v3-route-health.test.ts
├── freight-engine-v2.test.ts          (~432 lines)
├── freight-engine-v3.test.ts          (~809 lines)
├── freight-engine.test.ts             (deprecated v1 engine)
├── i18n-utils.test.ts
├── schedule-contract.test.ts
├── schedule-display.test.ts
└── sync-containers.test.ts

app/actions/__tests__/
├── booking.test.ts
├── calculator.test.ts
└── contact.test.ts
```

**Naming convention:** `<source-name>.test.ts` (mirror filename, `.test.ts` suffix). No `.spec.ts` files in repo.

**No component tests, no E2E tests, no integration tests against a live DB.** All tests are unit/contract tests against pure functions and server-action orchestration logic with mocked side effects.

## Test File Inventory

| File | Lines | Coverage |
|------|-------|----------|
| `lib/__tests__/freight-engine-v3.test.ts` | 809 | V3 engine: routing, port selection, landed-cost profiles, policy assertions |
| `lib/__tests__/sync-containers.test.ts` | 478 | Google Sheets → Supabase sync logic |
| `lib/__tests__/freight-engine-v2.test.ts` | 432 | V2 engine: haversine, ZIP coords, packing units, ocean rate selection |
| `lib/__tests__/schedule-display.test.ts` | 281 | Schedule UI display logic |
| `app/actions/__tests__/calculator.test.ts` | 280 | V2 calculator server action with full mock pipeline |
| `lib/__tests__/schedule-contract.test.ts` | 239 | Public schedule DTO normalization, bookability rules |
| `app/actions/__tests__/booking.test.ts` | 227 | Shared shipping booking server action |
| `lib/__tests__/calculator-v3-route-health.test.ts` | 224 | V3 route health checks |
| `lib/__tests__/calculator-v3-lead-metadata.test.ts` | 160 | V3 lead metadata builder |
| `lib/__tests__/calculator-contract.test.ts` | 135 | Shared calculator contract (rate book signature, country availability) |
| `lib/__tests__/freight-engine.test.ts` | 127 | Legacy V1 engine (kept for static `/pricing` table) |
| `lib/__tests__/calculator-v3-import-cost.test.ts` | 126 | V3 landed-cost / customs / VAT calc |
| `app/actions/__tests__/contact.test.ts` | 102 | Contact form server action with mocked Resend / Supabase / Slack / CAPI |
| `lib/__tests__/i18n-utils.test.ts` | 24 | Locale helper utilities |

**Total: 14 files, ~3,644 lines** of test code.

## Test Structure

**Standard layout:**
```typescript
import { describe, expect, it } from "vitest";

import { calculateFreightV2, haversineMiles, zipToCoords } from "@/lib/freight-engine-v2";
import type { EquipmentPackingRate, OceanFreightRate } from "@/lib/types/calculator";

const mockCombine: EquipmentPackingRate = { id: "1", equipment_category: "combine", ... };
const mockOceanRates: OceanFreightRate[] = [ { id: "o1", ... }, ... ];

describe("calculateFreightV2 — 40HC routing", () => {
  it("uses Chicago origin and adds drayage to ocean rate", () => {
    const result = calculateFreightV2({...});
    expect(result.usInlandTransport).toBeGreaterThan(0);
    expect(result.oceanFreight).toBe(2800 + 650);
  });
});
```

**Conventions:**
- Explicit imports of `describe`, `expect`, `it`, `vi`, `beforeEach` — never rely on globals despite `globals: true`.
- Test fixtures defined as module-level `const` with explicit type annotation (`EquipmentPackingRate`, `OceanFreightRate`, `LandedCostProfileRuntime`).
- Helper factories like `makeSharedContainer()`, `makeContainerWithPending()` for variant fixtures (`schedule-contract.test.ts`).
- `describe` blocks group by behavior or function under test.
- Date-sensitive tests use a fixed `FIXED_TODAY = "2026-04-18"` constant + `localDatePlusDays()` helper rather than `new Date()` — see `schedule-contract.test.ts`.

## Mocking

**Framework:** Vitest's built-in `vi.mock()` + `vi.hoisted()` + `vi.fn()`.

**`vi.hoisted()` pattern** is the established convention for server-action tests — declares mocks before `vi.mock()` calls so they're available at module-load time:

```typescript
// app/actions/__tests__/contact.test.ts
const mocks = vi.hoisted(() => ({
  after: vi.fn(async (cb: () => Promise<void>) => { await cb(); }),
  resendSend: vi.fn(),
  track: vi.fn(),
  notifySlack: vi.fn(),
  sendCAPIEvent: vi.fn(),
  log: vi.fn(),
  timerError: vi.fn(),
  timerDone: vi.fn(),
}));

vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return { emails: { send: mocks.resendSend } };
  }),
}));
vi.mock("@vercel/analytics/server", () => ({ track: mocks.track }));
vi.mock("@/lib/slack", () => ({ notifySlack: mocks.notifySlack }));
vi.mock("@/lib/meta-capi", () => ({ sendCAPIEvent: mocks.sendCAPIEvent }));
vi.mock("@/lib/logger", () => ({
  startTimer: () => ({ error: mocks.timerError, done: mocks.timerDone }),
  log: mocks.log,
}));

// Import system-under-test AFTER all mocks are wired up
import { submitContactForm } from "@/app/actions/contact";
```

**`after()` mock unwraps async callbacks** so that background-pipeline assertions (auto-reply, Slack, CAPI) can be verified synchronously in the test:
```typescript
after: vi.fn(async (callback: () => Promise<void>) => { await callback(); })
```

**`beforeEach`:** Always call `vi.clearAllMocks()` and reset env vars + default mock resolutions:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  mocks.resendSend.mockResolvedValue({ error: null });
  mocks.track.mockResolvedValue(undefined);
  mocks.notifySlack.mockResolvedValue(undefined);
  mocks.sendCAPIEvent.mockResolvedValue(undefined);
});
```

**What gets mocked:**
- `next/server` (`after`) — to inline background pipeline
- `resend` — `Resend.emails.send`
- `@vercel/analytics/server` (`track`)
- `@/lib/slack` (`notifySlack`)
- `@/lib/meta-capi` (`sendCAPIEvent`)
- `@/lib/logger` (`startTimer`, `log`) — so log calls don't pollute test output
- `@/lib/supabase-rates` (`fetchEquipmentRates`, `fetchOceanRates`) — calculator action tests inject rate fixtures

**What is NOT mocked:**
- Pure calculation engines (`lib/freight-engine-v2.ts`, `lib/calculator-v3/engine.ts`) — tested directly with fixture inputs
- Zod schemas — tested directly to verify validation behavior
- Schedule contract / display / sync utilities — pure functions exercised end-to-end with fixtures

**Assertions on mocks:**
```typescript
expect(mocks.resendSend).toHaveBeenCalledTimes(2);
expect(mocks.resendSend).toHaveBeenNthCalledWith(1, expect.objectContaining({
  to: "alex.r@meridianexport.com",
  cc: ["alex.z@meridianexport.com"],
  replyTo: "jane@example.com",
}));
```

## Fixtures and Factories

**Inline `const` fixtures** at module top — most tests use this. Heavy typing pulled from `lib/types/calculator.ts`, `lib/types/shared-shipping.ts`.

**Factory helpers** for variant-heavy schedule fixtures:
```typescript
function makeSharedContainer(overrides: Partial<SharedContainer> = {}): SharedContainer {
  return {
    id: "fd04c519-3ed0-470f-a3f0-c9ca40d3d6b6",
    project_number: "MF-2026-001",
    origin: "Albion, IA",
    // ...defaults
    ...overrides,
  };
}
```

**Hand-calculated expected values** for formula tests (per `CLAUDE.md`: "69 tests including formula verification with hand-calculated values"). Tests assert exact dollar amounts to lock in the freight contract.

**No `__fixtures__/` directories** — all test data is inline.

## Test Areas Covered

**Well covered:**
- Freight calculation engines (V2 + V3) — formula correctness, port selection, carrier preference, ZIP → coords, haversine, packing units, container-type policy override
- Server actions — contact form, calculator V2, booking — full pipeline including Resend, Supabase skip-when-unconfigured, Slack, CAPI, Vercel Analytics
- Schedule contract — public DTO sanitization (per commit `07b0c9e fix(schedule): stop raw payload leaks`), bookability rules, route normalization, timezone-stable date logic (per commit `7f93b3c test(schedule): stabilize timezone coverage`)
- Sync logic — Google Sheets → Supabase container sync (478 lines)
- Lead metadata builder — V3 calculator (`calculator-v3-lead-metadata.test.ts`)
- Route health — V3 calculator (`calculator-v3-route-health.test.ts`)
- Landed-cost / import-cost calculation — V3 (`calculator-v3-import-cost.test.ts`)
- Calculator contract — rate book signature, country availability (`calculator-contract.test.ts`)
- i18n utilities

**Coverage gaps (no tests present):**
- React components — zero component-level tests; no Testing Library, no JSDOM environment
- Page-level rendering — no smoke tests for pages beyond the production smoke-test workflow
- API routes — `app/api/track/`, `app/api/indexnow-verify/route.ts` have no unit tests
- Hooks — `hooks/use-count-up.ts` and `hooks/use-scroll-direction.ts` are untested
- Tracking helpers — `lib/tracking.ts`, `lib/wa-attribution.ts`, `lib/meta-capi.ts` (the `sendCAPIEvent` itself) — only verified via mocks in action tests
- Logger — `lib/logger.ts` has no direct tests
- Email body builders — `lib/emails/booking-confirmation.ts` has no tests (asserted via Resend mock argument shape only)
- Supabase queries — `lib/supabase-rates.ts`, `lib/supabase-containers.ts` (network layer is mocked everywhere)
- V3 calculator UI flows — `components/freight-calculator-v3/calculator-v3-wizard.tsx`
- Calculator V3 server action — no `app/actions/__tests__/calculator-v3.test.ts` despite V3 being recent and production-bound
- Visual regression / accessibility / Lighthouse-style assertions — handled at CI level only (Lighthouse workflow)
- E2E — no Playwright / Cypress installed (note: `.playwright-mcp/` directory at root is from MCP screenshot tooling, not E2E tests)

## CI Pipeline

**Workflow:** `.github/workflows/ci.yml`

```yaml
on:
  pull_request: { branches: [main] }
  push:        { branches: [main] }

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with: { node-version: "22", cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run build      # NEXT_TELEMETRY_DISABLED=1; analytics env vars intentionally absent
      - run: npm test
      - run: # Build summary printed to GitHub Actions job summary (bundle size, JS chunks, page count)
```

**Order:** Lint → Build → Test (test runs even if build/lint passes — order is sequential). Concurrency group cancels superseded runs.

**Other workflows:**
- `.github/workflows/lighthouse.yml` — Performance audit on PRs after Vercel preview deploys
- `.github/workflows/smoke-test.yml` — Production smoke test (90s wait for deploy, then `curl` checks of critical pages on `meridianexport.com`)
- `.github/workflows/auto-merge-dependabot.yml` — Dependabot auto-merge after CI green
- `.github/workflows/cleanup-branches.yml` — Branch hygiene

**Branch protection:** `main` requires PRs + status checks. No direct pushes, no force pushes.

## Test-Writing Guidance for New Code

**For pure functions in `lib/` and `lib/calculator-v3/`:**
- Add a `<name>.test.ts` to the matching `__tests__/` folder
- Define typed fixtures inline at top
- Group `describe` blocks by behavior; one `it` per assertion scenario
- For freight/contract changes, add hand-calculated dollar assertions

**For new server actions in `app/actions/`:**
- Mirror `app/actions/__tests__/contact.test.ts` and `app/actions/__tests__/calculator.test.ts`
- Use `vi.hoisted()` for the mocks bag
- Mock `next/server` `after` to unwrap callbacks synchronously
- Mock `resend`, `@vercel/analytics/server`, `@/lib/slack`, `@/lib/meta-capi`, `@/lib/logger`, `@/lib/supabase-rates`
- Reset env vars and re-set default mock resolutions in `beforeEach`
- Import the system-under-test AFTER `vi.mock(...)` calls
- Assert: success path, missing env var (graceful skip), Resend failure (must surface error), honeypot path

**For new schedule / contract logic:**
- Use fixed-date helpers (`FIXED_TODAY`, `localDatePlusDays`) instead of `new Date()`
- Use factory functions when many fixture variants are needed
- Cover route normalization edge cases (empty strings, casing, country inference)

**Time and date stability:**
- Never call `new Date()` in tests without freezing — use a fixed string constant and helper math
- This was specifically fixed by `7f93b3c test(schedule): stabilize timezone coverage`

**When to skip testing (current code):**
- Pure-presentation client components (no business logic) — no infrastructure exists yet
- Visual layout — handled by manual preview verification per `CLAUDE.md` SOP

## Recommended Future Improvements

These are not blockers but would close meaningful gaps:

1. **Add `app/actions/__tests__/calculator-v3.test.ts`** — V3 is now the production candidate but the action lacks the same mock-pipeline coverage as V2.
2. **Component tests for forms** — `contact-form.tsx`, `calculator-wizard.tsx`, `schedule-booking-form.tsx`. Would require adding `@testing-library/react` + `jsdom` + a second Vitest project (or `environment: "jsdom"` test directives).
3. **Coverage reporting** — `npm test -- --coverage` with `@vitest/coverage-v8` to surface gaps automatically.
4. **API route tests** — `app/api/track/route.ts`, `app/api/indexnow-verify/route.ts`.
5. **Direct tests for `lib/tracking.ts`** — currently only verified indirectly through mocks.
6. **E2E smoke tests on Vercel preview** — Playwright run that hits `/`, `/pricing/calculator`, `/contact` and asserts no console errors. Currently this is manual per `CLAUDE.md` Phase 2 SOP.

---

*Testing analysis: 2026-05-04*
