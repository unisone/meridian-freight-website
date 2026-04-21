# Playbook: 100% RU/KZ Localization + On-Page SEO for a Market-Specific Page

Companion to [seo-commercial-page-definition-of-done.md](./seo-commercial-page-definition-of-done.md). Where the DoD says *what* must be true at ship, this playbook says *how* to get there for a Russian- or Kazakh-facing buyer page — the replicable workflow that produced `/ru/destinations/kazakhstan` in PR #102.

Use this playbook when adding or upgrading any page aimed at Russian-speaking buyers in Kazakhstan, Russia, Uzbekistan, Kyrgyzstan, Belarus, or the broader CIS — and adapt the language-specific sections when doing the same work for Spanish Argentina or Arabic Gulf audiences.

## When to use this playbook

- Building a new market-specific hub inside a dynamic locale route (`app/[locale]/.../[slug]/page.tsx`) where one locale gets a custom component and others stay on the generic template.
- Upgrading an existing localized page from "translation shipped" to "natively written + SEO-tuned for the target search market."
- Auditing a localized page that feels *off* to a native reader (the "something's wrong with the Russian" feedback).

## Operating principle

Localization is not translation. A page written in English and converted phrase-by-phrase into Russian will fail every native reader's sniff test within two paragraphs. The bar is **written-in-Russian**, meaning inverted word order, idiomatic B2B construction, industry-native terminology, and Russian typography — not "Russian-colored English."

SEO for a market-specific page is not "keywords in the meta tag." The bar is **the full set of on-page signals search engines and LLMs use to classify the page** — page-level hreflang, canonical, four relevant JSON-LD schemas, enrichment with geo and brand mentions, a WhatsApp `potentialAction`, and a 20+ term keyword set that actually matches how the target buyer searches.

## Workflow

### Phase 1 — Map the surface area

Before proposing any change, produce a complete inventory. This is the step the Explore agent handles well; delegate it when the scope is uncertain.

**What to map:**

1. **Rendering chain.** Which file renders the page for `(locale, slug)` = target? Is there a custom component branched off a dynamic route, or is it the generic template? For the current PR's example: `app/[locale]/destinations/[slug]/page.tsx` branches on `locale === "ru" && slug === "kazakhstan"` into `components/destinations/kazakhstan-market-page.tsx`.
2. **Content module.** Is there a typed module (`content/<market>.ts`)? If yes, what does its interface cover? If no, note the gap.
3. **Shared components that render on this page.** `PageHero`, `TrustBar`, `FaqAccordion`, `DarkCta`, `TrackedContactLink`, `TrackedCtaLink`, `Header`, `Footer`, mobile bar, cookie consent. For each, verify it pulls from `messages/<locale>.json` (not hardcoded).
4. **Hardcoded string inventory.** `grep` for Cyrillic (or Spanish, or Arabic) literals inside the custom component file. Every hit is a candidate for extraction.
5. **SEO surface.** What emits from: `generateMetadata`, the layout's JSON-LD, `app/sitemap.ts`, `public/llms.txt`, `lib/metadata.ts`, `app/robots.ts`, Yandex/Bing/Google verification tags, hreflang.
6. **Existing utilities.** `lib/i18n-utils.ts` for BCP-47 tags and OG locales, `lib/constants.ts` for brand constants, `lib/schedule-display.ts` for status classification, the local `withAlternates` helper in sitemap. Reuse, don't duplicate.

**Deliverable:** a structured map with file paths and line numbers, ready for planning.

### Phase 2 — Diagnose the copy

Run linguistic forensics against the current content. The markers of non-native writing cluster into four categories:

1. **Lexical calques** (word-for-word from English):
   - `работа на полную ставку` ← "a full-time job" (native: `отдельная профессия` or `занимает всё время`).
   - `не видите страну` ← "don't see your country" (native: `не нашли вашу страну в списке`).
   - `ваша@почта.com` ← "your@email.com" (native: `name@example.com` or `адрес@example.com`).
   - `опубликованные работы` ← "published projects" (native: `кейсы` or `завершённые проекты`).
   - `центр помощи` ← "help center" (native: `справочный центр` or just `помощь`).
   - `реальные X, реальные Y, реальные Z` ← "real X, real Y, real Z" triple (native: rewrite entirely — the triple-adjective pattern rings hollow in RU).

2. **Terminology inconsistency across pages** — the strongest single marker of non-single-voice authorship. Look for:
   - `оценка` vs `расценка` vs `котировка` vs `расчёт` for "quote"
   - `ФИО` vs `Полное имя` vs `Имя` for name fields
   - `страхование` vs `страховка` for insurance
   - `без скрытых платежей` vs `без скрытых комиссий`
   - `отправка` vs `отгрузка` vs `отправление`
   - `техника` vs `оборудование` vs `сельхозтехника`
   - `Эл. почта` vs `Электронная почта` vs `Email` vs `Почта`

   Pick one per concept, enforce site-wide. This alone lifts quality substantially.

3. **Register drift** — the same file flipping between corporate-legalese, marketing-breezy, and translator-bureaucratic. Native copy holds one register.

4. **Typography slop** — lazy `е` where `ё` belongs, Latin quotes where `«…»` belongs, hyphen where em-dash belongs, absent NBSP in numbers. Individually small, collectively the difference between "competent translation" and "written by a native."

**Deliverable:** a diagnosis document with file paths and concrete before/after examples. This is also where you decide the voice target — B2B deловой разговорный for freight; imperial formal for legal/regulatory; friendly-direct for consumer.

### Phase 3 — Plan before editing

A plan mode plan is cheap. Skipping it on a content-heavy rewrite produces thrash.

Include:

- **Files to modify** (keep the set tight — ideally 3).
- **New typed fields** you'll add to the content interface, with names and semantics.
- **Polish list** — every edit with explicit before/after.
- **Typography rules** you'll apply.
- **SEO additions** (schemas, keywords, hreflang).
- **Non-goals** — the other issues you noticed but are deliberately not tackling here.
- **Verification checklist** with concrete commands and expected outcomes.

The plan doubles as the PR description and the squash-merge commit body.

### Phase 4 — Execute: extraction → polish → typography → SEO

Do these four sub-passes in order because each unlocks the next.

#### 4a. Extract every hardcoded string to the typed content module

Pattern:

```typescript
// Before: content/<market>.ts has interface + data
interface MarketPageContent {
  hero: HeroContent;
  faq: { title: string; entries: FaqEntry[] };
  // ...
}

// After: extend with sub-objects that cover every currently-hardcoded string
interface MarketPageContent {
  hero: HeroContent;
  breadcrumbs: { parent: string; current: string };           // NEW
  laneBoardLabels: { badge: string; status: {...}; ...};      // NEW
  midCta: { heading: string; description: string };           // NEW
  proofSection: { eyebrow: string; title: string; intro: string; linkLabel: string };  // NEW
  faq: { title: string; sectionEyebrow: string; entries: FaqEntry[] };   // extended
  // ...
}
```

Then in the JSX, replace every literal with `content.*.*` reference. Helpers (`formatDate`, `getStatusLabel`) that close over literals: refactor to accept the labels as arguments.

**Why this order is load-bearing:** the TypeScript interface becomes the audit surface. If you miss a hardcode, `npm run type-check` won't catch it, but any attempt to edit the missed string means editing JSX — which stands out in review as "why is there a literal here?" Making extraction the *first* pass means the polish pass can target a single file (the content module) with confidence that every user-visible string lives there.

#### 4b. Native-voice polish

In the content module, apply the concrete edits from your diagnosis. Rules of thumb that repeatedly produce native-quality RU B2B freight copy:

- **Numbers beat adjectives.** `Более 1 000 отправок с 2013 года` beats `Много реальных отгрузок`.
- **Verbs over nominalizations.** `Забираем технику у продавца` beats `Организация забора техники у продавца`.
- **Short imperatives in CTAs.** `Пришлите ссылку — посчитаем` beats `Получить бесплатную оценку`.
- **Concrete, not generic.** `Комбайн John Deere S670 в контейнер 40HC` beats `Экспорт сельхозтехники`.
- **No triple-adjective marketing.** Trust comes from specifics.
- **Honest hedges.** `Обычно`, `чаще`, `в зависимости от маршрута`. Native B2B RU is comfortable with calibrated language; unhedged guarantees read as sales fluff.
- **Industry-correct terms.** `Коносамент`, `ТН ВЭД`, `ИНКОТЕРМС`, `декларант`, `таможенный представитель`, `флэтрек` (or keep Latin `flat rack`), `40HC`.
- **Russian first-person plural.** Say `Мы` for the company subject; not `команда Meridian Freight`.

#### 4c. Typography pass

Global ё-strict audit:

```bash
# Find all e that should be ё in the RU content
grep -nE 'расчет|еще|счет|колеса|решета|импортера|передаем|нем|идет|все ' content/<market>.ts
```

Replace where etymologically correct. Leave `е` where it actually belongs (plural `все`, words where ё is historically `е`).

Russian dashes: em-dash `—` (not `-`) in enumerations and appositions; cuddle to content with NBSP in formal settings (cuddled `—` reads as Soviet-academic, which may or may not fit your register — choose once).

Russian quotes: `«…»` for quoted labels; `"..."` (Latin) for code or brand names that appear in Latin anyway.

#### 4d. SEO hardening

In priority order:

1. **Hreflang parity.** If your custom branch of `generateMetadata` is missing `alternates.languages`, that's the first fix. Emit `en`, `es`, `ru` (whatever your locales are), plus `x-default`. Mirror the shape of the generic branch exactly.

2. **Required schema set.** For a market-specific commercial page:
   - `WebPage` (enriched — see below)
   - `FAQPage` (if FAQ renders)
   - `BreadcrumbList` (3 items: locale root → section → current)
   - `Service` (with `serviceType`, `areaServed.Country.identifier=<ISO>`, `availableLanguage`, `provider`, `offers.priceCurrency`)

3. **WebPage enrichment.** Add:
   - `datePublished`, `dateModified` (static dates are fine initially; can switch to `process.env.VERCEL_GIT_COMMIT_DATE` later).
   - `mentions[]` with `Place` entries for every target market city and `Organization` entries for equipment brands the page covers.
   - `potentialAction` → `ContactAction` with `target: whatsappHref`.
   - `inLanguage: "<BCP-47>"`.

4. **Keywords expansion.** Aim for 20-25 terms covering: head term, brand queries (`доставка John Deere в Казахстан`), region queries (every major city in the target country), container/equipment long-tails (`40HC контейнер в Казахстан`, `flat rack Казахстан`). Yandex still weighs `keywords` meta mildly; Google ignores it but LLM indexers sometimes consume it.

5. **`robots: { index: true, follow: true }`** explicit on commercial landing pages.

### Phase 5 — Verify

Four layers of verification, each required:

1. **Local technical gates:** `npm run lint`, `npm run type-check`, `npm test`, `npm run build` — all green.

2. **Prerendered HTML audit.** For a Next.js SSG page, `.next/server/app/<locale>/<route>.html` *is* the artifact production will serve. Grep it for:
   - Every new native-copy phrase (expect 2× counts due to HTML body + RSC payload).
   - Every old/deprecated phrase (expect 0 counts).
   - `hrefLang=` (React-style attribute; note the camelCase vs HTML's lowercase — grep both).
   - `"@type":"WebPage"`, `"@type":"BreadcrumbList"`, `"@type":"Service"`, etc.
   - `og:locale`, `yandex-verification`, canonical.

3. **EN/ES regression grep.** Same HTML-level comparison against the non-target locale variants to confirm byte-identical output where expected.

4. **Production visual QA.** Per CLAUDE.md SOP, browser-automation pass on the live production URL: layout integrity, mobile viewport, CTA clickability, WhatsApp prefill text.

### Phase 6 — Ship

Standard CLAUDE.md workflow: feature branch → commit with detailed message → push → Vercel preview → vercel curl verification → PR → CI green → `gh pr merge --squash --delete-branch` → production deploy → public verification.

On merge, submit the updated URL to Yandex Webmaster, Google Search Console, and IndexNow (if configured via `INDEXNOW_KEY`) for priority reindex. LLMs tend to re-crawl markedly faster than search engines for URLs in `llms.txt`, so ensure the page is listed there.

---

## Appendix A — Common RU calques and their fixes

| English pattern | Literal RU calque (wrong) | Native RU (right) |
|---|---|---|
| "a full-time job" | работа на полную ставку | отдельная профессия / требует всего времени |
| "Don't see your country?" | Не видите свою страну? | Не нашли вашу страну в списке? |
| "Published projects" | опубликованные работы | кейсы / завершённые проекты |
| "Help center" | Центр помощи | Справочный центр / Помощь |
| "your@email.com" | ваша@почта.com | name@example.com / адрес@example.com |
| "Full name *" | Полное имя * | ФИО * / Имя и фамилия * |
| "Real X, real Y, real Z" triple | Реальные X, реальные Y, реальные Z | rewrite without the triple |
| "One company, one invoice" | Одна компания, один счёт | Один подрядчик на весь экспорт |
| "Based on industry rates" | На основе промышленных тарифов | По рыночным тарифам |
| "Optimized route rate" | Оптимизированная ставка маршрута | Лучшая ставка по маршруту |
| "Licensed and insured" | Лицензирован и застрахован (fragment) | Лицензированная и застрахованная компания |
| "Near-perfect clearance" | Почти безупречное оформление | Проходим таможню с первого раза в 99% случаев (or similar concrete claim) |
| "Based on your findings…" (internal voice) | На основе ваших результатов | Rewrite in speaker voice |

## Appendix B — Industry glossary (RU B2B freight)

- **Расчёт** — quote / estimate (prefer as default noun for quote).
- **Коммерческое предложение (КП)** — commercial proposal (for formal settings).
- **Коносамент** — bill of lading (B/L).
- **Инвойс** — commercial invoice.
- **Упаковочный лист** — packing list.
- **Сертификат происхождения** — certificate of origin.
- **ТН ВЭД** — tariff classification code (Russian/CIS customs).
- **ИНКОТЕРМС** (masculine, uninflected as proper noun; use `по ИНКОТЕРМС 2020` or specific `EXW`, `FOB`, `CIF`, etc.).
- **Декларант** — customs declarant.
- **Таможенный представитель** — customs broker (CIS/KZ canonical term).
- **Флэтрек** (or `flat rack` in Latin — industry-acceptable either way).
- **40HC** — preferred; `40-футовый High Cube` acceptable; `Контейнер 40' High Cube` with Latin letters is borderline.
- **Сельхозтехника** — agricultural machinery (umbrella).
- **Спецтехника** — heavy equipment / industrial machinery.
- **Уборочная** (colloquial) / **уборочная кампания** (formal) — harvest season.
- **Жатка** — header.
- **Draper-платформа** — draper header (industry code-mix is standard).
- **Шнек** — auger (on a combine).
- **Навесное** — attachment / implement.

## Appendix C — Quick-reference checklist

Ready to ship when every box is checked:

- [ ] Every user-visible RU string lives in the typed content module (zero JSX literals).
- [ ] Native-voice polish applied to every calque and ambiguous term identified in diagnosis.
- [ ] ё-strict typography across the content module.
- [ ] Terminology consistent with other RU pages on the same site.
- [ ] `generateMetadata` emits `alternates.languages` for en/es/ru + `x-default` + `robots: { index: true, follow: true }`.
- [ ] Four JSON-LD schemas on the page: WebPage (enriched), FAQPage, BreadcrumbList, Service.
- [ ] WebPage schema has `mentions[]` for all target cities + brands, plus `datePublished`, `dateModified`, `potentialAction`.
- [ ] Keywords expanded to 20+ native RU terms including region + brand queries.
- [ ] Yandex verification inherited (or added) on the page.
- [ ] `npm run lint`, `type-check`, `test`, `build` all green locally.
- [ ] CI on the PR green.
- [ ] Prerendered HTML (`.next/server/app/ru/...`) validated via grep for all new copy and all SEO signals.
- [ ] EN and ES Kazakhstan (or equivalent non-target locale) variants byte-identical in their rendered HTML.
- [ ] After merge: production URL returns HTTP 200 with the same signals the preprendered HTML showed.
- [ ] URL submitted to Yandex Webmaster + Google Search Console + IndexNow (if configured).

---

*This playbook was distilled from the audit and ship of `/ru/destinations/kazakhstan` (PR #102, squash commit `e65a42a`). When subsequent market-specific pages are added, update the appendices with any new calques surfaced and extend the glossary as industry terms evolve.*
