# SEO / Commercial Page Definition of Done

Use this process for any destination, equipment, service, paid/organic landing, blog, or market-specific page that can affect buyer trust, SEO, or lead generation.

The goal is not more paperwork. The goal is to prevent public pages from shipping with unsupported claims, weak search intent alignment, broken structured data, poor localization, or unverified conversion paths.

## When This Applies

This gate is mandatory when the work includes any of the following:

- Country, market, route, or regulatory claims.
- Pricing, savings, landed-cost, freight, tariff, customs, or availability claims.
- Shipment history, project proof, customer proof, credentials, team capability, or operational scope claims.
- Public contact details, inboxes, forms, WhatsApp, calculator, or lead-routing behavior.
- SEO pages intended to capture paid or organic demand.

## Required Workflow

1. Inventory current state before proposing changes.
   - Identify existing routes, templates, content data, metadata, schema, sitemap behavior, internal links, CTAs, tracking, forms, calculators, and related live pages.
   - If the page depends on production behavior, verify production or a preview instead of relying on code only.

2. Build a claim truth table.
   - Track every material claim: claim, source, repo location, evidence status, and decision.
   - Use primary sources for regulatory/legal claims.
   - Use first-party proof for shipment/project/customer claims.
   - Do not publish fabricated shipment proof, invented case studies, unverified operational history, or assumed mailbox/contact behavior.
   - If a claim is useful but unproven, rewrite it as a scoped capability or remove it.

3. Confirm SEO intent and page strategy.
   - Define the primary keyword theme, secondary themes, target buyer, buyer stage, and conversion path.
   - Do not target a keyword if the page refuses to satisfy the search intent.
   - Make scope clear: what Meridian handles, what it does not handle, and where a local partner or buyer responsibility begins.

4. QA public copy as rendered buyer-facing copy.
   - Read the rendered page in context, not only the content object.
   - Remove internal/editorial language, placeholder phrasing, inflated claims, and "AI slop" wording.
   - Search for terms that should almost never appear in public copy unless intentionally buyer-facing: `TODO`, `placeholder`, `fake`, `fabricated`, `proof`, `curate`, `narrative`, `slop`, `TBD`, `inflar`, `artificial`.
   - For Spanish Argentina pages, use professional Spanish with Argentina-relevant terms where appropriate, such as `puesta en puerto`, `despachante`, `cosechadora`, `plataforma draper`, and `aduana`. Avoid heavy slang and avoid voseo unless the brand deliberately chooses it.

5. Validate structured data and metadata.
   - Confirm canonical URL, robots behavior, Open Graph, Twitter metadata, `inLanguage`, locale alternates, and sitemap inclusion.
   - Confirm JSON-LD is unique, non-conflicting, and uses correct absolute localized URLs.
   - FAQ schema must match rendered FAQ content.
   - Breadcrumb schema must match visible breadcrumb links and localized route behavior.

6. Validate localization and formatting.
   - Use region-appropriate locale formatting when the audience is country-specific.
   - For Argentina Spanish, prefer `es-AR` formatting for buyer-facing numbers and dates unless there is a stronger reason not to.
   - For Russian Kazakhstan/Central Asia pages, write Russian source copy instead of translating English section-by-section. Use formal `вы`, direct B2B logistics language, and buyer terms such as `сельхозтехника`, `забор у продавца`, `разборка под контейнер`, `упаковка`, `загрузка`, `таможенный представитель`, `декларант`, `код ТН ВЭД`, `свободное место`, `40HC`, `flat rack`, and `доставка по Казахстану`.
   - For Russian Kazakhstan/Central Asia pages, avoid internal or machine-translated phrases such as `операционная активность`, `зона Meridian`, `маршрутный пакет`, `финальная экономика`, `открытый объем`, `актуальный срез`, `путь до маршрута`, public-facing `KZ`, and English logistics terms like `pickup` unless the term is intentionally buyer-facing.
   - Check that non-supported locales 404 or redirect intentionally and do not emit broken alternates.

7. Validate design and UX.
   - Preserve the current design system unless a new design direction is explicitly approved.
   - Review desktop and mobile.
   - Check contrast, dark-section readability, CTA hierarchy, spacing, and section rhythm.
   - Avoid extra sticky CTA layers, gimmick motion, and one-off component systems unless required.

8. Validate measurement and conversion paths.
   - Confirm every primary CTA works.
   - Confirm WhatsApp, phone, email, calculator, and form links use the correct tracking helper or server action.
   - Use page-specific tracking locations for high-value CTA placements.
   - Verify public contact details against the operational system of record, not just constants in code.

9. Validate internal linking and crawl paths.
   - Add internal links from relevant equipment, destination, calculator, service, and index surfaces.
   - Confirm links resolve for the intended locale.
   - Confirm the page is not orphaned if it is intended to rank.

10. Run technical gates.
    - `npm run type-check`
    - `npm run lint`
    - `npm run build`
    - `npm test` when logic, calculator, schema utilities, tracking utilities, or shared components changed.

11. Verify preview and production when shipping.
    - Preview: page loads, changed routes render, console has no material errors, CTAs work, and visual QA passes on desktop and mobile.
    - Production: after merge/deploy, verify the live route and clearly distinguish implemented, pushed, deployed, and live-verified states.
    - For schema-heavy pages, inspect rendered HTML or use a structured-data validator before claiming schema is correct.

12. Document deferred work.
    - List what is intentionally out of scope, why it is safe to defer, and what data should trigger phase 2.
    - Do not silently drop known risks from the plan.

## Spec Readiness Requirements

A spec for this class of work is not implementation-ready unless it includes:

- Current-state inventory with file paths and route behavior.
- Target buyer, SEO intent, primary keyword theme, and conversion path.
- Source table for regulatory, pricing, proof, contact, and operational claims.
- Exact copy rules, prohibited claims, and required terminology.
- Metadata, structured-data, locale, sitemap, and internal-link requirements.
- CTA and measurement requirements.
- Design-system constraints and mobile/desktop acceptance criteria.
- QA plan covering copy, truth/legal, technical, schema, localization, visual, tracking, preview, and production.
- Explicit non-goals and deferred work.

## Fail Conditions

Do not ship if any of these are true:

- Public copy includes unsupported shipment history, customer proof, project proof, or regulatory certainty.
- A public contact route or mailbox is advertised without operational verification.
- JSON-LD is duplicated, conflicts with visible content, or uses wrong localized URLs.
- The page contains internal editorial language or placeholder copy.
- The page targets buyer intent but the CTA path is broken or untracked.
- Required technical gates were skipped or failed.
- Known legal/truth risks are left unresolved without being removed from copy.
