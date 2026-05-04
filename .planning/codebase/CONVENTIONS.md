# Coding Conventions

**Analysis Date:** 2026-05-04

## Project Guidance Files

**Authoritative agent-facing docs (read first):**
- `CLAUDE.md` — Claude Code SOP, full architecture, freight contract formulas, env var matrix, deployment workflow
- `AGENTS.md` — Codex-equivalent guidance (mostly mirrors `CLAUDE.md` with v2 calculator details)

These files set the ground rules. They explicitly describe:
- Path alias `@/*` → project root
- Single source of truth for contact info: `lib/constants.ts` (NEVER hardcode phone/email/URLs)
- Lead pipeline ordering and `after()` background processing
- Freight calculator invariants (`estimatedTotal = usInlandTransport + packingAndLoading + oceanFreight`)
- Light theme only (no dark mode)
- Standard 4-phase dev flow (DEVELOP → STAGE → PRESENT → SHIP) with required preview verification

## TypeScript

**Strict mode:** Enabled in `tsconfig.json` (`"strict": true`).

**Other compiler options:**
- `target: ES2017`, `module: esnext`, `moduleResolution: bundler`
- `jsx: "react-jsx"` (no React import needed for JSX)
- `isolatedModules: true`, `esModuleInterop: true`, `resolveJsonModule: true`
- `paths: { "@/*": ["./*"] }` — single root alias
- `noEmit: true` (Next.js handles emit)
- `incremental: true` with `tsconfig.tsbuildinfo`

**Type-check command:** `npm run type-check` → `tsc --noEmit`.

**Type style:**
- Interfaces for object shapes (`SharedContainer`, `SyncLogEntry`)
- `type` for unions and aliases (`type ContainerStatus = "available" | "full"`)
- `type X = z.infer<typeof xSchema>` exported alongside Zod schemas (`lib/schemas.ts`)
- `as const` on lookup objects/arrays where literal types matter (`lib/constants.ts`)
- `readonly` on shared array constants (`readonly string[]`)

**Avoid `any`:** Codebase uses `unknown` and discriminated unions. `Record<string, unknown>` for opaque payloads (e.g., Supabase insert).

## ESLint

**Config:** `eslint.config.mjs` — flat config (ESLint 9).

```javascript
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", ".vercel/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

**Run command:** `npm run lint` → `eslint`. CI fails the build on lint errors.

**No Prettier config detected.** Formatting follows ESLint + editor defaults (2-space indent, double quotes in TSX, single or double in TS — both observed).

## Naming Patterns

**Files:** kebab-case for everything in `app/`, `components/`, `lib/`, `hooks/`.
- `components/contact-form.tsx`
- `components/freight-calculator/calculator-wizard.tsx`
- `lib/freight-engine-v2.ts`
- `lib/calculator-v3/landed-cost-profiles.ts`
- `hooks/use-count-up.ts`, `hooks/use-scroll-direction.ts`
- Test files: `lib/__tests__/<name>.test.ts` (mirror filename, `.test.ts` suffix)

**React components:** PascalCase exported names match the file's purpose (file in kebab-case, export in PascalCase).
- `components/contact-form.tsx` exports `ContactForm`
- `components/header.tsx` exports `Header`
- `components/freight-calculator/calculator-wizard.tsx` exports `CalculatorWizard`

**Hooks:** `use*` prefix, camelCase (`useCountUp`, `useScrollDirection`).

**Functions:** camelCase (`calculateFreightV2`, `submitContactForm`, `escapeHtml`, `notifySlack`).

**Constants:** SCREAMING_SNAKE_CASE for module-level config (`CONTACT`, `COMPANY`, `NAV_ITEMS`, `STANDARD_INLAND_DELIVERY_RATE`, `ROAD_FACTOR`, `ALBION_IA`, `FORTYHC_ORIGIN_PORT`, `FLATRACK_PORTS`, `CARRIER_PREFERENCE`, `CATEGORY_LABELS`).

**Types/Interfaces:** PascalCase. Schemas use `<Name>Schema` + `<Name>Data` pair:
```typescript
export const contactFormSchema = z.object({...});
export type ContactFormData = z.infer<typeof contactFormSchema>;
```

**CVA variants:** `<component>Variants` (`buttonVariants`).

## Exports

**Named exports preferred** in `components/`, `lib/`, `hooks/`.
- `export function Header() {}` not `export default`
- shadcn primitives: `export { Button, buttonVariants }`

**Default exports** are reserved for Next.js conventions (page.tsx, layout.tsx, error.tsx, not-found.tsx, robots.ts, sitemap.ts, route.ts).

## Imports

**Order observed (loosely enforced):**
1. External packages (`react`, `next/*`, `lucide-react`, `motion/react`, `zod`, `resend`, `@vercel/analytics`)
2. Internal `@/components/*`
3. Internal `@/lib/*`
4. Internal `@/hooks/*`, `@/i18n/*`
5. `type` imports (often grouped at end with `import type {...}`)

**Type-only imports:** Use `import type { X } from "..."` (`import type { ContactFormData } from "@/lib/schemas"`).

**Path alias:** Always `@/...` (resolves to project root). Never relative `../../`.

## RSC / Client Boundaries

**Default = Server Component.** Only mark `"use client"` when needed.

**`"use client"` placement:** Top of file, before any imports.

**Client components observed (need browser APIs / hooks / interactivity):**
- All form components: `contact-form.tsx`, `calculator-wizard.tsx`, `calculator-v3-wizard.tsx`, `schedule-booking-form.tsx`
- Header/nav with state: `header.tsx`, `mobile-bottom-bar.tsx`, `language-switcher.tsx`
- Animation/scroll: `motion-provider.tsx`, `scroll-progress.tsx`, `scroll-reveal.tsx`, `hero.tsx`
- Tracking shells: `google-analytics.tsx`, `meta-pixel.tsx`, `vercel-analytics.tsx`, `engagement-tracking.tsx`, `cookie-consent.tsx`, `attribution-capture.tsx`
- Tracked link wrappers: `tracked-contact-link.tsx`, `tracked-cta-link.tsx`
- Error boundaries: `app/global-error.tsx`, `app/[locale]/error.tsx`, `app/[locale]/global-error.tsx`, `app/[locale]/not-found.tsx`
- Hooks (always client): `hooks/use-count-up.ts`, `hooks/use-scroll-direction.ts`

**Pattern:** When a Server Component needs a tracked link, render `TrackedContactLink` / `TrackedCtaLink` instead of inlining `onClick`. See `components/tracked-contact-link.tsx`.

**`"use server"` placement:** Top of file in `app/actions/*.ts`. All server actions live here:
- `app/actions/contact.ts`
- `app/actions/calculator.ts` + `app/actions/calculator-data.ts`
- `app/actions/calculator-v3.ts` + `app/actions/calculator-v3-data.ts`
- `app/actions/booking.ts`

## Server Action Pattern

Established pipeline (see `app/actions/contact.ts`, `app/actions/calculator.ts`):

1. Zod validate payload (`schemas.parse(...)`)
2. Honeypot check (`website` field — if filled, return success silently)
3. Best-effort Supabase INSERT to `leads` table
4. **Required:** Resend email to owner (`alex.r@meridianexport.com`, cc `alex.z@meridianexport.com`)
5. **Return success/error to client** before background work
6. `after(async () => { ... })` block runs auto-reply, Slack notify, Meta CAPI, Vercel Analytics in parallel
7. Wrap timing in `startTimer(route)` from `lib/logger.ts` — call `timer.done()` or `timer.error()`
8. Always log via structured `log({ level, msg, route, ... })` — never raw `console.log` in server actions

**Email HTML escaping:** Server actions define a local `escapeHtml()` helper before composing email bodies. Never interpolate raw user input into HTML.

## Forms & Validation

**No `react-hook-form`.** Forms use native `<form onSubmit>` + `FormData` + manual state.

**Validation:** Zod schemas in `lib/schemas.ts`. Schemas defined here:
- `contactFormSchema` / `ContactFormData`
- `calculatorEmailSchema` / `CalculatorEmailData` (legacy)
- `calculatorV2Schema` / `CalculatorV2Data` (with `superRefine` for flatrack `equipmentValueUsd` requirement)
- `calculatorV3Schema` / `CalculatorV3Data` (with `superRefine` for WhatsApp phone requirement)
- `bookingRequestSchema` / `BookingRequestData`

**Honeypot:** Every public-facing schema includes `website: z.string().max(500).optional().default("")`. Bots fill it; real users don't.

**UTM capture:** Every form schema includes `source_page`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` fields. Captured client-side from `window.location.search` and stored in 30-day first-party cookie `mf_attribution` (`lib/wa-attribution.ts`, `lib/tracking.ts`).

**Error display:** Forms set local `error` state and render inline. Server returns `{ success: true, ...data }` or `{ success: false, error: string }`.

**Submit pattern (client side):**
```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsSubmitting(true);
  if (formData.get("website")) { /* honeypot — silently succeed */ }
  const result = await submitContactForm(payload);
  if (result.success) {
    trackGA4Event("generate_lead", { ... });
    trackPixelEvent("Lead", { ... }, result.eventId); // dedup with CAPI
    vercelTrack("generate_lead", { source: "contact_form", value: 500 });
  }
}
```

## Styling (Tailwind 4 + shadcn/ui)

**Tailwind 4** with `@tailwindcss/postcss`. Design tokens in `app/globals.css` `:root` block using `oklch()`.

**No dark mode.** Light theme only. Do not add `dark:` variants.

**`cn()` helper:** All conditional/merged classes go through `cn()` from `lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```
`twMerge` resolves Tailwind class conflicts; `clsx` handles conditionals.

**CVA for variants:** Component variants defined with `class-variance-authority` and exposed as `<component>Variants` for composition. Pattern from `components/ui/button.tsx`:
```typescript
const buttonVariants = cva("base classes...", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" },
});
function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
```

**shadcn/ui primitives** — `components/ui/*.tsx`. Config: `components.json` (`style: "base-nova"`, baseColor `neutral`, RSC enabled, lucide icon library, alias `@/components/ui`). Built on `@base-ui/react` (not Radix UI directly, despite older docs mentioning Radix).

**Class ordering in JSX:** Logical groups (layout → spacing → typography → colors → state → responsive). No `prettier-plugin-tailwindcss` enforced; ordering is conventional, not automated.

**Design tokens:** `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`, `bg-destructive`. Brand color: Sky-500 (`#0EA5E9`).

**Fonts:** Geist Sans (body, headings) + Geist Mono (stats/pricing numbers) loaded via `next/font/google` in `app/layout.tsx`.

**Data attributes for slots:** `data-slot="button"`, `data-slot="input"` — used for child-targeting selectors and `in-data-[slot=button-group]:...` Tailwind variants.

## Comments

**Module section banners** in long files:
```typescript
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
```

**Single-line comments** for behavior/intent: `// Honeypot — bots fill hidden fields, humans don't`.

**JSDoc** is used sparingly, mostly on exported hooks/utilities:
```typescript
/** Animates a number from 0 to `end` using requestAnimationFrame. */
export function useCountUp({...}: UseCountUpOptions): number { ... }
```

**No mandatory JSDoc for every export.** Comments document _why_ (business rule, gotcha) rather than _what_.

## Logging

**Structured JSON logging** — `lib/logger.ts`. Use in all server actions and server-side code.

```typescript
import { startTimer, log } from "@/lib/logger";
const timer = startTimer("action:contact-form");
try {
  // ...
  timer.done({ leadId });
} catch (err) {
  timer.error(err);
}

log({ level: "error", msg: "supabase_insert_failed", route: "action:contact-form", status: resp.status, body: text });
```

**No `console.log`** in production paths. Errors flow through Sentry (`@sentry/nextjs` + `instrumentation.ts` + `instrumentation-client.ts`).

## Function Design

**Size:** Server actions are long (200-400 lines) by design — one orchestrator per action. Pure functions in `lib/calculator-v3/`, `lib/freight-engine-v2.ts` are smaller and tightly scoped.

**Parameters:** Object destructuring for ≥3 params (`useCountUp({ end, duration, enabled })`). Positional for 1-2.

**Return values:**
- Server actions return `{ success: true, ...data } | { success: false, error: string }` (discriminated union)
- Calculator engines return typed result objects (`FreightEstimateV2`, `FreightEstimateV3`)

## Module Design

**No barrel `index.ts` files** in `lib/` or `components/`. Imports go directly to source file.

**Subdirectories** group related code:
- `lib/calculator-v3/` — V3 engine, contracts, policy, routes
- `lib/types/` — shared type definitions (`calculator.ts`, `shared-shipping.ts`)
- `lib/emails/` — email body builders
- `components/freight-calculator/` — V2 wizard pieces
- `components/freight-calculator-v3/` — V3 wizard
- `components/schedule/` — shared shipping schedule UI
- `components/destinations/` — destination market pages
- `components/ui/` — shadcn primitives only

## Internationalization

**`next-intl` v4.** Locale routing in `i18n/` directory.

**Use:** `import { useTranslations } from "next-intl"` in client components, `import { Link } from "@/i18n/navigation"` for locale-aware links.

**Three locales:** English (default), Spanish (Argentina-targeted, `/es/`), Russian (KZ buyer hub, `/ru/`).

**BCP-47 tags:** `es-AR` for Argentina pages (per commit `5fc0c01 fix(i18n): site-wide es-AR BCP-47 tags`).

## Commit Conventions

**Conventional Commits enforced** by team practice (no commitlint config detected, but consistent log).

Format: `<type>(<scope>): <description>`

**Types observed:** `feat`, `fix`, `docs`, `chore(deps)`, `refactor`, `test`, `style`, `perf`.

**Common scopes:** `calc`, `calculator`, `contact`, `schedule`, `i18n`, `argentina`, `kz`, `csp`, `partners`, `process`, `deps`, `deps-dev`.

**Recent examples:**
- `feat(kz): add buyer hub (#102)`
- `fix(argentina): hard redirect non-es routes to /es (HTTP 308, not soft-404) (#99)`
- `fix(i18n): site-wide es-AR BCP-47 tags + Spanish accent normalization (#96)`
- `chore(deps)(deps): bump the minor-and-patch group with 7 updates (#85)`
- `test(schedule): stabilize timezone coverage`

**PR-driven workflow:** Squash-merge with `(#NN)` suffix appended. Direct pushes to `main` blocked by branch protection. Dependabot auto-merges via `.github/workflows/auto-merge-dependabot.yml`.

## Single Source of Truth Rules

| Concern | File | Rule |
|---------|------|------|
| Phone / email / WhatsApp / address / social | `lib/constants.ts` (`CONTACT`, `COMPANY`, `SOCIAL`) | Always import; NEVER hardcode |
| Tracking IDs (GA4, Meta, Google Ads) | `lib/constants.ts` (`TRACKING`) | Read via constants, not env at component level |
| Form validation | `lib/schemas.ts` | One Zod schema per form, exported with `<Name>Data` type |
| Freight formulas (40HC) | `lib/freight-engine-v2.ts` | Authoritative; `lib/freight-engine.ts` is deprecated |
| Freight formulas (V3 / landed cost) | `lib/calculator-v3/engine.ts` + `policy.ts` | V3 production candidate |
| Container-type routing override | `lib/freight-policy.ts` | `resolveQuoteContainerType()` overrides raw DB rows |
| Contact info display | Components import `CONTACT` and pass to UI | Never duplicate in component code |

## Anti-Patterns to Avoid

- Hardcoding phone numbers / emails — old CRA site had `+1-786-397-3888`; correct is `+1 (641) 516-1616` (in `CONTACT.phone`)
- Trusting client-side calculator estimates server-side — server re-fetches rates and re-calculates (`app/actions/calculator.ts`)
- Surfacing flatrack `packing_cost` as a customer-visible line — flatrack packing is `$0` and bundled into "Sea Freight & Loading"
- Reading raw DB `container_type` without going through `resolveQuoteContainerType()` — protected equipment types must override stale rows
- Adding `dark:` Tailwind variants — site is light-only by design
- `console.log` in server actions — use `lib/logger.ts`
- Loading Meta Pixel only after consent — must always load with `fbq('consent', 'revoke')` default; previous gating cost $811 in wasted ads

---

*Convention analysis: 2026-05-04*
