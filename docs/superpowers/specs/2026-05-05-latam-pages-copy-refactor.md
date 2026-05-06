# LATAM Buyer Hub Copy Refactor — Paraguay, Uruguay, Bolivia

**Date:** 2026-05-05
**Branch:** `codex/latam-country-pages` (existing worktree)
**Status:** Draft — pending user approval
**Files:** `content/latam-market-pages.ts`, `content/__tests__/latam-market-pages.test.ts` (the renderer is unchanged)

## Why

`content/latam-market-pages.ts` shipped on `codex/latam-country-pages` (commit 62a1416) reads as machine-translated AI output:

- 122 instances of unaccented Spanish across 1,146 lines (e.g., `"ano"` for `año` ≈ "anus" vs "year"; `"agricola"`, `"exportacion"`, `"informacion"`).
- Hedge-soup voice — "puede ser…", "puede tener sentido…", "depende de…" — without the concrete dates, decree numbers, or transit ranges that build trust.
- Headlines that are SEO queries with no value-prop tail.
- Compliance copy that reads like a legal-memo outline instead of buying advice.
- English words (`handoff`, `dealer`, `row-crop`, `ZIP`) leaking into Spanish copy — already banned by the test file at `content/__tests__/latam-market-pages.test.ts:96-99`.
- CTAs that promise calculator quotes for corridors the calculator can't currently price reliably (especially Bolivia).

Meanwhile, **the same Codex session also produced a 1,018-line research brief** at `~/Downloads/LATAM Expansion Strategy Report.docx`. That brief is solid — primary-source citations to .gov.py / .gub.uy / .gob.bo, ANAPO / USDA FAS data, transit ranges per leg. Codex *should have* used the brief as input to content drafting; instead it generated diluted slop that ignored its own research. This refactor restores the connection.

The Argentina hub at `content/argentina-market.ts` is the editorial benchmark — already shipped, audited (`docs/specs/2026-04-21-argentina-page-audit-remediation-spec.md`), and ranking. PY/UY/BO must read as its siblings.

**Verified:** The slop file lives at `content/latam-market-pages.ts:1-1146`. The renderer at `app/[locale]/destinations/[slug]/page.tsx:103-105,181-183` branches on `isLatamMarketSlug(slug) && locale === "es"` and renders `<LatamMarketPage>` — no renderer changes needed for this refactor.

## Verification pass results (post-self-review)

This section captures the second-pass verification I ran after the role-by-role critique caught 6 potential issues. Each row: concern raised → verification → outcome.

| # | Concern | Verification | Status |
|---|---|---|---|
| V-1 | Renderer outputs wrong `inLanguage` for PY/UY/BO (defaulting to `es-AR` via `toBCP47`) | Read `components/destinations/latam-market-page.tsx:161,179,205` — three JSON-LD blocks all use `inLanguage: content.locale`. Content file sets `locale: "es-PY"`/`"es-UY"`/`"es-BO"` on lines 157, 485, 812. The non-LatAm `[slug]/page.tsx` branch at line 193,248 calls `toBCP47(locale)` but never fires for LatAm slugs. | ✅ Correct — no fix needed |
| V-2 | WhatsApp URL doesn't URL-encode accented prefilled message | Read `latam-market-page.tsx:154-156` — uses `encodeURIComponent(content.hero.whatsappMessage)`. UTF-8 accents will encode correctly. | ✅ Correct — no fix needed |
| V-3 | Equipment slug links 404 (`/equipment/combines`, `/tractors`, `/planters`, `/sprayers`) | `grep -nE "slug:.*['\"](combines\|tractors\|planters\|sprayers)" content/equipment.ts` returns matches at lines 28, 69, 150, 190 (and again at 353+ for translation rows). All four exist. | ✅ Correct — no fix needed |
| V-4 | OG images Codex chose don't exist on disk | `test -f public/images/{project-jd-9650sts-transport,project-jd-s670-port,project-jd-sprayer-port-crane}.jpg` — all three exist. | ✅ Correct — no fix needed |
| V-5 | Sitemap entries missing or with wrong priorities | `git diff main..HEAD -- app/sitemap.ts` shows Codex added a `latamMarketSitemapPages` array (priority 0.85, weekly changeFreq, `es`-only alternates) AND adjusted the generic `/destinations/[slug]` entries to skip the `es` alternate when the slug is a LatAm slug (avoiding duplicate-language-target conflicts). Sitemap is structurally sound. | ✅ Correct — no fix needed |
| V-6 | BO calculator CTA points at "broken data" → buyer disappointment | Read `lib/calculator-v3/policy.ts:509-537`. BO has a deliberate `broker_confirm` policy — version `bo-policy-2026-04`, effectiveDate `2026-04-20`, single line `bo-broker-confirmation` saying *"Cleaning, treatment, or phytosanitary documentation may be required; confirm before booking."* This is not broken data — it is intentional policy. UY (lines 423-465) and PY (lines 466-507) follow the same pattern: `quote_confirmed` / `broker_confirm` status on all compliance lines. **The calculator does not auto-price compliance for any of these three countries by design.** | ✅ Correct — original D-6 stands; refine copy framing |
| V-7 | Baseline tests are red and my refactor will be blamed | `npm test` on the worktree returned `16 test files, 144 tests passed (0 failed), 2.05s`. Clean baseline. | ✅ Clean baseline |
| V-8 | hreflang `en` and `x-default` missing on the new pages — Google can't link Spanish hub to English destination page | `grep -nE "alternates" app/\[locale\]/destinations/\[slug\]/page.tsx` shows the LatAm metadata branch at line 111-114 sets `alternates.canonical` and `alternates.languages.es` only — no `en`, no `x-default`. **This is a real gap**, but it's an SEO improvement, not a copy issue. | ⚠️ Tracked as follow-up (out of this spec's scope) |
| V-9 | Number formatting — Argentina uses `formatCount(STATS.projectsCompleted, "es")` to render `1.000` via `es-AR` mapping | Read `lib/i18n-utils.ts:42-55` — `BCP47_LOCALES` maps `es → es-AR` and `formatCount` calls `toLocaleString(toBCP47(locale))`. The LatAm renderer **does not** use `formatCount`; the credibility `note` field is a hardcoded prose string. **Decision:** hardcode the Spanish-formatted `1.000` directly in the rewritten `note` string (e.g., *"más de 1.000 exportaciones"*). No renderer change. | ✅ Decision made — encoded in §D-7 below |

**Net result of verification pass:** 6 of 9 concerns were false alarms (renderer was correct), 2 informed concrete decisions (V-6 BO calculator framing, V-9 thousands-separator format), 1 surfaced a real gap that's out of scope (V-8 hreflang en/x-default).

## Constraints

These are non-negotiable. They come from existing tests, prior audit lessons, and user feedback memories.

### Already enforced by `content/__tests__/latam-market-pages.test.ts`

| Constraint | Source |
|---|---|
| Banned: `trusted by`, `best price`, `cheapest`, `guaranteed`, `sin complicaciones`, `fácil`, `proof`, `fake`, `placeholder`, `TBD` | Lines 56-71 |
| Banned: `la pagina`, `esta pagina`, `desde una pagina web`, `no presentamos`, `no afirma`, `no necesitamos`, `sin inventar`, `historial no probado`, `prueba interna`, `prueba especifica`, `evidencia publicada`, `no debe leerse`, `sobria`, `cuidadosa`, `sobrepromesas` | Lines 80-95 |
| Banned (English-in-Spanish): `\bhandoff\b`, `row-crop`, `\bdealer\b`, `\bZIP\b` | Lines 96-99 |
| Required: `Ley 7565/2025` in PY page | Line 47 |
| Required: `DGSA` and `Resolucion 98/016` in UY page | Lines 50-51 |
| Required: `broker/importador` and `confirmar` in BO page; banned `tope universal de 10 años` and `limite universal de 10 años` (overstatements) | Lines 53-56 |
| Structural: ≥3 official sources, ≥5 FAQ entries, exactly 4 equipment focus items, ≥6 sendUsThis items, ≥4 route steps per country | Lines 35-40 |

**Decision:** The `Resolucion 98/016` test assertion at line 51 currently locks the unaccented form. **The test must be updated to assert `Resolución 98/016`** (with accent) to allow proper Spanish. This is a one-line test change documented in §Test changes below.

### From audit + memory + user feedback

- **No editorial-note leaks.** Argentina audit R-2 removed copy like "prueba artificial" and "inflar prueba" from `content/argentina-market.ts`. Customer-facing copy must not describe its own framing strategy.
- **No fabricated case studies.** Memory confirms Meridian has not delivered a Bolivia shipment yet, has UY shipments (Davyt S680), and has PY price-list artifacts + ads but no confirmed first delivered shipment. The trust-signal copy must position Meridian as **operationally ready** for the corridor, not as a high-volume incumbent. Use the global `1,000+ exports` stat that lives in `lib/constants.ts STATS.projectsCompleted` rather than corridor-specific volume.
- **Formal `usted` register, not voseo.** Argentina hub uses formal usted/imperativos despite Argentina's vernacular voseo (`content/argentina-market.ts` shows `envíe`, `revise`, `consulte`, `coordine`). Match that for PY/UY/BO. Voseo would be regionally accurate for UY but inconsistent across the four hubs. **Decision: formal usted everywhere.**
- **Calculator CTA framing.** The freight calculator supports UY/PY/BO country codes (`lib/types/calculator.ts:127,135,136`) but Bolivia has known data gaps. Frame the calculator as a **door-to-port reference**, not a final landed-cost quote. Same wording Argentina uses: *"Calcular flete estimado"*, with the page text reinforcing that the in-country side is separate.

## Decisions made

Each entry: decision, rationale, alternatives considered. User overrides any item by responding.

### D-1. File structure: keep one `latam-market-pages.ts`
Three pages share a type, an array, and helper exports. Splitting into three files would duplicate the type and the helpers without benefit. The Argentina hub (one file, one country) is a different decision because Argentina shipped first and there was nothing to share with. *Alternative considered: split per country file like Codex's strategy report recommends. Rejected — premature.*

### D-2. Type structure: keep `LatamMarketPageContent` separate from `ArgentinaMarketPageContent`
Type unification is a follow-up. This refactor is bounded to copy. *Alternative: collapse into `CountryMarketPageContent`. Rejected — out of scope; would touch Argentina renderer + tests.*

### D-3. Renderer: no changes
`components/destinations/latam-market-page.tsx` (614 lines) is a clean string renderer. Every text knob already exists in the content type. *Alternative: restructure to match Argentina's renderer. Rejected — not needed for copy fix.*

### D-4. Voice & register
- **All three pages: formal `usted` + imperativo.** Match `content/argentina-market.ts`.
- **Tone:** confident, source-cited, scope-disciplined. Avoids "puede ser", "depende de", "puede tener sentido". When something genuinely depends on the buyer's broker, say so once and concretely — not as a hedge tic.
- **Sentence length:** target 18-25 words average. Codex's 50+ word comma-spliced sentences must be broken up.
- **No exclamations, no rhetorical hype, no "world's leading" phrasing.**

### D-5. Per-country equipment 4th card
Per strategy report §7.2 + §8.2:
- **Paraguay:** Drapers + paquetes completos de cosechadora (matches Mennonite/cooperative buyer pattern). Link `/services/equipment-sales`.
- **Uruguay:** Sembradoras de precisión y equipos de pulverización (Codex already had sprayers as 4th — keep). Link `/equipment/sprayers`.
- **Bolivia:** Cosechadoras de caña y pulverizadores de alta despeje (Santa Cruz crop mix). Link `/equipment/sprayers` (no sugarcane category page — fall back to sprayers + mention sugar in summary).

### D-6. Calculator CTA: keep on all three, frame consistently (revised post-V-6)
- Keep `secondaryCtaLabel: "Calcular flete estimado"` on all three pages.
- Final CTA `calculatorLabel`: *"Ver calculadora"* (PY), *"Calcular flete"* (UY), *"Calcular flete"* (BO) — match Argentina's compact phrasing.
- Page body explains the calculator as a **door-to-port planning reference**, not a final landed cost. The compliance line items for all three countries are deliberately `quote_confirmed` / `broker_confirm` per `lib/calculator-v3/policy.ts:423-537` — the calculator does not auto-price phytosanitary cleaning/treatment for any of these three countries by design. Copy should match this posture: route + ocean freight estimable; in-country compliance and tax confirmed by despachante/broker.
- **Reversal of my earlier post-review impulse:** I briefly considered routing BO's secondary CTA to WhatsApp instead of the calculator. Verification (V-6) showed BO has an intentional policy entry, not a data gap. Sending users to WhatsApp would *under*-deliver — the calculator's port-to-port number is still useful for them. Keep the CTA, frame the compliance posture honestly.

### D-7. Trust-signal volume claim — Spanish-formatted thousands separator
Use the **global** stat hardcoded as *"más de 1.000 exportaciones a más de 40 países"* (Spanish thousands separator = period, not comma). Source: `lib/constants.ts STATS.projectsCompleted` and `messages/en.json DestinationsPage.heroDescription`.
- **Hardcode** the formatted string in the `credibility.note` field. *Rationale:* the LatAm renderer does not use `formatCount`/`toLocaleString` (verified V-9), and the locale-aware helpers in `lib/i18n-utils.ts:42-55` map all `es` to `es-AR` regardless of country. Hardcoding `1.000` keeps the renderer untouched and the format consistent across PY/UY/BO.
- **Do not** claim corridor-specific volume for any of the three countries. Memory confirms no delivered BO shipment yet, PY has price-list artifacts but no confirmed delivery, UY has confirmed delivery but stating a count would be guesswork. Argentina audit R-2 lesson applies: don't cherry-pick country-attributed volume.

### D-8. WhatsApp prefilled message — accented Spanish, country-tagged
Mirror Argentina's pattern (`Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a [País] y necesito una cotización orientativa.`) Strategy report §8.3.5 proposes a `COUNTRY_WHATSAPP_MESSAGES` constant in `lib/constants.ts`; **for this refactor, leave the strings inline** in `latam-market-pages.ts` to bound scope. The constants extraction is a small follow-up.

### D-9. Tracking event names
Keep Codex's existing `paraguay_*`, `uruguay_*`, `bolivia_*` event keys. They match Argentina's `argentina_*` pattern.

### D-10. Source links per country
Replace Codex's 3-source `officialSources` arrays with 4-5 per country, drawn from the strategy report appendix. **Verified URLs to use** (each will be re-checked for HTTP 200 during execution; if any 404, drop it without replacement rather than ship a dead link):

**Paraguay** (5):
- `https://www.dnit.gov.py/` — Customs/tax authority (Ley 7143/2023 successor to ANA)
- `https://www.senave.gov.py/` — Phytosanitary authority
- `https://baselegal.com.py/docs/82309f6e-438f-11eb-94a2-525400c761ca` — Ley 2018/02 free import of used machinery
- `https://www.bacn.gov.py/leyes-paraguayas/12918/...` — Ley 7565/2025 phytosanitary measures (already in Codex content)
- `https://www.trade.gov/country-commercial-guides/paraguay-paraguay-parana-waterway-system` — Hidrovía context (already in Codex content)

**Uruguay** (5):
- `https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-...` — Resolución 98/016 DGSA (already in Codex content)
- `https://www.aduanas.gub.uy/innovaportal/v/7032/3/innova.front/tasa-global-arancelaria-tga.html` — TGA reference
- `https://www.aduanas.gub.uy/innovaportal/v/8915/3/innova.front/decreto-n%C2%B0-426_011.html` — Decreto 426/011
- `https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/dgsa` — DGSA institutional
- `https://www.trade.gov/country-commercial-guides/uruguay-agricultural-equipment` — Market context (already in Codex content)

**Bolivia** (5):
- `https://www.aduana.gob.bo/` — Aduana Nacional
- `https://www.senasag.gob.bo/` — SENASAG (already in Codex content)
- `https://www.lexivox.org/norms/BO-DS-N4579.html` — Decreto 4579/2021 (IVA exemption ag machinery)
- `https://www.vuce.gob.bo/es/SENASAG_importacion_fitozanitario_requisitos` — VUCE single-window
- `https://www.trade.gov/country-commercial-guides/bolivia-agricultural-sectors` — Market context (already in Codex content)

### D-11. Test updates
Documented in §Test changes below. Two changes only: accent the `Resolución 98/016` assertion, and add positive assertions for accented Spanish and the new `año`/`exportación`/`agrícola` correctness.

### D-12. Shared `localSideConfirms` label, country-context in body copy
Codex's content uses a single `sharedLabels` object across the three pages with `localSideConfirms: "Confirma en destino"`. Argentina's hub uses country-specific phrasing (*"Argentina queda aparte"*) — but Argentina has its own per-country renderer. Mirroring that here would require a renderer change (out of scope per D-3) or a per-country labels object (small type change, also out of scope per D-2).

**Decision:** keep the shared `labels` object, but rewrite the shared label to a confident generic that works for all three: `"Su despachante confirma en destino"`. Country specificity then comes from the **content of each `compliance.brokerConfirmed` list** (PY: SENAVE+DNIT; UY: DGSA+ADAU; BO: SENASAG+Aduana+Padrón) which is already country-keyed in the type. *Rationale:* this gets ~90% of the country differentiation Argentina has, with zero renderer or type changes. *Alternative:* per-country labels object — rejected as out-of-scope refactor.

### D-13. Visual overflow check
Spanish words like `Documentación de exportación + reserva marítima` and `Coordinación de embarque internacional` are longer than their English equivalents and may overflow the hero scope card or the credibility-pillar card titles. **Decision:** include a mobile-width visual check (375px viewport) and a tablet check (768px) in the post-push verification step. If wrap is broken, shorten the offending string in the same commit rather than touching CSS — copy revision is the cheapest fix and stays within scope.

### D-14. Rollback path
If the new copy ships and a regulatory fact turns out wrong, the rollback is `git revert <merge-commit-sha>` of the squash-merge PR. The pages will fall back to Codex's slop copy on the next deploy (~60s). For surgical edits to a single regulatory claim, the next-deploy turnaround on a one-line content change is also ~60s — preferred over a full revert. *Rationale:* `content/latam-market-pages.ts` is a pure data file; small targeted edits are low-risk.

## Locked facts (must appear verbatim or paraphrased without softening)

The strategy report is the source for everything in this section. Anything I cannot verify against `.gov.[country]` or USDA primary sources during execution gets dropped, not paraphrased into vagueness.

### Paraguay

**Regulatory anchor — `Ley 2018/02`** (free import of used vehicles, ag machinery, construction machinery, since 2002). Codex's content uses `Ley 7565/2025` as the headline anchor — **this is wrong as a positioning anchor.** Ley 7565/2025 is a phytosanitary risk-mitigation law signed 2025; the import-permission anchor is Ley 2018/02. The hub must lead with Ley 2018/02 ("Paraguay still permits import of used ag machinery") and treat Ley 7565/2025 as the phytosanitary-discipline rule that frames how the unit must arrive. The required-string test at line 47 (`Ley 7565/2025`) stays satisfied because Ley 7565/2025 still gets named in the compliance section.

**Pending legislation:** A Senate proposal (in commission as of May 2025, not yet enacted) would impose a 5-year age cap on used ag machinery. The hub flags this as a regulatory-direction risk worth knowing about, **not as a current rule**. Use the phrase "actualmente bajo análisis en comisión del Senado, sin sanción a mayo de 2026."

**Routing (transit ranges, locked):**
- US East Coast → Buenos Aires: 23-32 days
- Houston → Buenos Aires: 28-35 days
- Buenos Aires transbordo: 3-7 days
- Hidrovía Buenos Aires → Asunción / Villeta: 10-15 days, +5-10 días en temporada seca (sep-dic)
- Total door-to-port típico: 36-54 days
- Container terminal: Puerto Villeta (operado por PTP Group), Asunción Port secundario

**Demand signal numbers usable on page:**
- Soja 2025/26: 10.9 MMT (USDA FAS GAIN PA2025-0001) — fourth global exporter
- ~3.6M ha de soja sembrada (USDA IPAD)
- 0% domestic ag machinery production — 100% imported

**Regulatory bodies, correctly accented:**
- DNIT — Dirección Nacional de Ingresos Tributarios
- SENAVE — Servicio Nacional de Calidad y Sanidad Vegetal y de Semillas
- MIC — Ministerio de Industria y Comercio

### Uruguay

**Regulatory anchor — `Resolución 98/016` (DGSA)** — phytosanitary cleaning standard for used ag machinery. Cleaning required (interior + exterior); non-compliance triggers re-export within 30 days. **Lock this 30-day re-export consequence in the compliance section** — it's a concrete buying decision driver.

**Tariff structure:**
- TGA 2% on capital goods (BK) per Decreto 426/011
- Mercosur preferential treatment does NOT apply to US-origin (UY pays standard CET on US imports)
- IVA 22% standard; reduced 10% / exemption for agricultural production goods (despachante confirms per NCM)

**Routing (transit ranges, locked):**
- US East Coast → Montevideo: 14-18 days
- Houston → Montevideo: 20-25 days
- Port Everglades → Montevideo: 18-35 days
- US West Coast → Montevideo: 45-60 days (avoid when East Coast available)
- Total door-to-port típico: 24-35 days
- Carrier service: weekly to bi-weekly (Maersk, Hapag-Lloyd, CMA CGM, MSC, ZIM)

**Market positioning numbers (all from USDA FAS / El Observador):**
- US is #2 ag equipment supplier, 18.4% share in 2024
- US share trend: -17.3% in 2023, +10.4% recovery in 2024
- 2024/25: 2.49M ha total field crops (+10% YoY), soybean yields 40% above historical average
- Brazil leads at 43.3% share — this is the comparison the buyer is making

**Regulatory bodies, correctly accented:**
- DNA — Dirección Nacional de Aduanas
- DGSA — Dirección General de Servicios Agrícolas (under MGAP)
- MGAP — Ministerio de Ganadería, Agricultura y Pesca
- ADAU — Asociación de Despachantes de Aduana del Uruguay

### Bolivia

**Regulatory anchor — 10-year capital goods age cap.** This is the firmest constraint on the page. The strategy report calls it a "selection discipline" — frame as *"trabajamos solo con unidades menores a 10 años de antigüedad — la mayoría del equipo usado de calidad cae bien dentro de este margen."* This converts a regulatory limit into a sourcing-discipline trust point.

**IVA exemption:**
- Ley 1391/2021 — IVA exemption on agricultural machinery imports
- Ley 1613/2025 art. 8 — IVA exemption on capital goods (NANDINA Cap. 84, 85, 87)
- Decreto Supremo 4579 (2021) — implementing instrument
- **The page must direct the buyer to confirm specific NCM/NANDINA classification with their broker/importador** — Meridian does not give tax advice.

**Transit treaty:**
- Tratado de 1904 Bolivia-Chile: free transit through Arica, Iquique, Antofagasta
- 365 días de almacenaje libre para carga de importación, 60 días para exportación
- ASPB (Administradora de Servicios Portuarios Bolivia) is Bolivia's customs agent at Arica

**Routing (transit ranges, locked):**
- US East Coast → Arica: 22-28 days
- US West Coast (LA / Long Beach / Oakland) → Arica or Antofagasta: 12-16 days
- Houston → Arica: 25-30 days
- Arica customs + ASPB handoff: 3-5 days
- Arica → Santa Cruz overland (~1,650 km vía Tambo Quemado-Patacamaya-Cochabamba-Santa Cruz): 3-7 days
- Total door-to-Santa Cruz típico (East Coast): 30-40 days
- Total door-to-Santa Cruz típico (West Coast): 20-30 days

**Demand signal numbers usable on page:**
- ANAPO: 1.3M ha de soja sembrada en verano 2025/26
- Producción 2025/26: 2.6 MMT (revisada a la baja desde 3 MMT por inundaciones)
- ~$1B USD invertidos en cadena productiva en Santa Cruz
- 0% domestic ag machinery production

**Regulatory bodies, correctly accented:**
- AN — Aduana Nacional de Bolivia
- SENASAG — Servicio Nacional de Sanidad Agropecuaria e Inocuidad Alimentaria
- IBNORCA — Instituto Boliviano de Normalización y Calidad
- VUCE — Ventanilla Única de Comercio Exterior

## Per-section editorial direction

Headings and intros below are **direction**, not finished copy — the executor (next turn) writes against this brief. Every line of finished copy must satisfy: accented Spanish, formal usted, concrete claims, no banned patterns, no English words.

### Hero — all three countries
- **Eyebrow:** `Guía para compradores [paraguayos / uruguayos / bolivianos]`
- **H1:** Keep Codex's H1 pattern (`Importar maquinaria agrícola usada de EE.UU. a [País]`) but **add accents**.
- **Description (rewrite):** 2-3 sentences. Sentence 1 = Meridian's scope statement (sourcing → pickup → desmontaje → embalaje → docs → ocean to destination port). Sentence 2 = country-specific friction acknowledged in one line (PY: Hidrovía multimodal; UY: limpieza fitosanitaria estricta; BO: cap de 10 años + tránsito Arica). Sentence 3 = scope-clarity promise (the in-country side is left clear from the start).
- **Highlights (3 bullets):** rewrite to be country-specific. PY: cooperative + Mennonite buyer audience, Hidrovía coordination, draper packages. UY: Brasil-comparable buyer mode, DGSA cleaning standard, US is #2 supplier. BO: 10-year cap as filter, ASPB transit demystified, Santa Cruz-led demand.
- **CTAs:** primary `"Cotizar por WhatsApp"` (matches Argentina), secondary `"Calcular flete estimado"`. Drop Codex's `"Revisar mi maquina para Paraguay"` style — it's passive.
- **WhatsApp prefilled message:** `Hola. Estoy evaluando importar maquinaria agrícola usada desde EE.UU. a [País] y necesito una cotización orientativa.` Accented, country-specific, mirrors Argentina exactly.
- **Scope card:**
  - `meridianHandles` (3 items): compra asistida + coordinación con vendedor; retiro, desmontaje, embalaje; documentación de exportación + reserva marítima.
  - `localSideConfirms` (3 items): country-specific. PY: SENAVE + DNIT + tributos/tasas/flete interior. UY: DGSA + ADAU despachante + tributos. BO: SENASAG + Aduana + Padrón de Importadores + tributos/IVA.
- **Footnote:** match Argentina's pattern — *"Eso evita comparar una cotización puerta a puerto con un 'precio final en [país]' armado sobre supuestos distintos."*

### Section 2: Market & regulatory context (was Codex's `route` + `compliance` — restructured)

Codex split this into two sections (route + compliance) where Argentina has it as one. **Decision:** keep Codex's two-section split since the type already supports it, but rewrite each so they're not redundant.

#### `route` section
- **PY:** Title — `Paraguay es multimodal: la operación no termina en el puerto oceánico`. Steps go origin US → Buenos Aires → transbordo → Hidrovía → Asunción/Villeta. **Add transit-day numbers** in each step description. Add the Sep-Dec drought caveat in the closing note, not buried.
- **UY:** Title — `Uruguay tiene acceso oceánico directo: el control está en la preparación`. Steps go condition review → US prep → Montevideo direct call → handoff to despachante. **Add transit-day numbers.**
- **BO:** Title — `Bolivia es destino sin litoral: planee puerto de tránsito y destino interior`. Steps go origin US → ocean to Arica → ASPB transit → overland to Santa Cruz. **Add transit-day numbers + the 1904 treaty mention** in step 3.

#### `compliance` section
- **PY:** Title — `Ley 2018/02 lo permite, Ley 7565/2025 establece cómo`. Required column: limpieza interior y exterior, certificado fitosanitario USDA APHIS, ISPM-15 wood packaging, datos completos de la unidad. brokerConfirmed: registro de importador, licencia previa cuando aplique, DNIT, SENAVE, tributos, despacho local. avoid: comprar sin revisar antigüedad, asumir flete = costo final, mover equipo con tierra/restos.
- **UY:** Title — `DGSA Resolución 98/016 exige limpieza, certificado e inspección`. Lock the **30-day re-export consequence** explicitly. Required column: limpieza interna+externa antes de retirar, certificado fitosanitario USDA APHIS con declaración adicional, ISPM-15. brokerConfirmed: NCM/clasificación BK, TGA 2%, IVA, ADAU despachante, retiro del puerto. avoid: comprar por precio sin limpieza/documentación, asumir Mercosur preferential se aplica a EE.UU., publicar arancel sin validar NCM.
- **BO:** Title — `Cap de 10 años, IVA exonerada por Ley 1613/2025, fitosanitario por SENASAG`. Required column: edad menor a 10 años, registro en Padrón de Importadores, permiso fitosanitario SENASAG (ARP), origen-país certificado USDA APHIS. brokerConfirmed: clasificación NANDINA, aplicabilidad de IVA exenta, transit Arica via ASPB, despacho final en Bolivia. avoid: convertir condición de exención en regla universal, asumir IVA exenta sin confirmación 2026, comprar unidad sin revisar Padrón/destino interior.

### Section 3: Equipment focus (4 cards each)

Replace Codex's vague "antes de comprar conviene revisar X, Y, Z" template. Each card needs a **country-specific reason** why this category makes sense for US sourcing in this country.

- **Common 3 cards (all countries):** Cosechadoras, tractores de alta potencia (200-400 hp), pulverizadoras autopropulsadas. Each with a country-tuned 1-sentence rationale (PY: cooperativas + paquetes draper; UY: configuración no disponible en Brasil/Argentina; BO: filtrar por edad <10 años + soporte de repuestos).
- **4th card (country-specific, per D-5):**
  - PY: `Drapers y paquetes completos de cosechadora` → `/services/equipment-sales`
  - UY: `Sembradoras de precisión y equipos de pulverización` → `/equipment/sprayers`
  - BO: `Cosechadoras de caña y pulverizadoras de alta despeje` → `/equipment/sprayers`

### Section 4: `sendUsThis` — what to send by WhatsApp

Codex's lists are interchangeable across countries. Differentiate:

- **PY (7 items):** link de subasta o concesionario; marca/modelo/año/horas; ubicación en EE.UU. o Canadá con código postal; fotos de limpieza, tren de rodaje, plataforma; destino en Paraguay (Asunción, Villeta, Itapúa); nombre del importador o despachante si está definido; fecha objetivo de embarque y si incluye cabezales.
- **UY (7 items):** link de la unidad; marca/modelo/año/horas y número de serie si está disponible; fotos de limpieza interior, ruedas/orugas, plataforma; ubicación de retiro en EE.UU. o Canadá; destino previsto Montevideo o interior; despachante asignado o nombre del importador; campaña agrícola objetivo.
- **BO (7 items):** link de subasta o vendedor; marca/modelo/año (preferentemente menor a 10 años) y horas; ubicación de retiro; destino en Bolivia (Santa Cruz, Cochabamba, La Paz); broker/importador registrado en Padrón si está confirmado; si se requiere apoyo en tramo Arica → Santa Cruz; fotos y dimensiones para chequeo de tránsito.

**English-word replacements** to apply throughout:
| English (banned) | Spanish replacement |
|---|---|
| `ZIP` | `código postal` |
| `dealer` | `concesionario` |
| `handoff` | `entrega`, `traspaso`, or `coordinación con [actor]` |
| `row-crop` | `cultivos extensivos` or `agricultura extensiva` |

### Section 5: `processSteps` (4 steps)

Keep Codex's 4-step structure; rewrite each step's title and description in confident voice with country-specific concrete actions.

### Section 6: `credibility` pillars (3 cards)

Codex's existing pillar concepts are okay; rewrite for confidence and specificity.
- Pillar 1 (operational): single-vendor end-to-end coordination — pull from `messages/en.json AboutPage.diff1` ("One Invoice, Zero Coordination" → Spanish equivalent already in `messages/es.json`).
- Pillar 2 (regulatory): country-specific compliance literacy — name the bodies/laws by their accented full names.
- Pillar 3 (commercial): scope cotizado — the door-to-port quote separates from the in-country cost stack.
- **Note (`note` field):** Use the global `1,000+ exportaciones a más de 40 países` framing. **Do not** claim corridor-specific volume for any of the three.

### Section 7: FAQ — 5+ entries per country, country-specific

Replace Codex's interchangeable FAQ entries. Per the strategy report §8.2 Section 8 plus Argentina's existing FAQ patterns:

**PY FAQ (5 entries minimum, target 7):**
1. *¿Puedo importar a Paraguay una cosechadora usada de más de 10 años?* (answer: today yes under Ley 2018/02; the pending Senate proposal would change this; broker confirmation per unit)
2. *¿Cómo funciona el tránsito por la Hidrovía Paraná-Paraguay?* (Buenos Aires transbordo + Hidrovía barge to Asunción/Villeta; sep-dic drought adds 5-10 days)
3. *¿Qué cubre Meridian y qué queda para mi despachante en Paraguay?* (canonical scope split)
4. *¿Cuánto demora el envío total puerta a puerto?* (36-54 days típico; rango with caveats)
5. *¿Conviene comprar en EE.UU. frente a Brasil o Argentina?* (configuración + horas + documentación, not headline price)
6. (optional) *¿Qué pasa si la unidad llega con tierra o restos vegetales?*
7. (optional) *¿Pueden cotizar hasta Asunción o Villeta?*

**UY FAQ (5 entries minimum, target 6):**
1. *¿Qué exige DGSA Resolución 98/016 para maquinaria agrícola usada?* (limpieza interna+externa, certificado fitosanitario, inspección al ingreso)
2. *¿Qué pasa si DGSA encuentra suelo o restos vegetales?* (re-exportación dentro de 30 días si hay incumplimiento)
3. *¿Conviene importar de EE.UU. en lugar de Brasil?* (US #2 supplier 18.4%, +10.4% YoY 2024; configuración disponible en EE.UU. cuando Brasil no la tiene)
4. *¿Cuánto demora el envío puerta a Montevideo?* (14-25 days típico from US East Coast / Houston)
5. *¿Cuánto paga maquinaria agrícola usada de EE.UU.?* (TGA 2% capital goods + IVA per NCM, despachante confirma)
6. (optional) *¿Meridian se encarga del certificado fitosanitario?*

**BO FAQ (5 entries minimum, target 7):**
1. *¿Por qué solo trabajan con maquinaria menor a 10 años?* (cap de bienes de capital; convierte regla en disciplina de selección)
2. *¿Cómo funciona el tránsito por Arica bajo el Tratado de 1904?* (Arica/Iquique/Antofagasta como puerto, 365 días almacenaje libre, ASPB como agente bolivia, overland to Santa Cruz ~1,650 km)
3. *¿La Ley 1613/2025 me exonera de IVA al importar?* (sí para bienes de capital NANDINA Cap. 84/85/87, broker confirma para la unidad concreta)
4. *¿Qué exige SENASAG para maquinaria usada?* (Permiso fitosanitario via VUCE, ARP por producto, certificado USDA APHIS de origen)
5. *¿Cuánto demora un envío hasta Santa Cruz?* (30-40 days East Coast routing, 20-30 days West Coast)
6. (optional) *¿Pueden cotizar hasta Santa Cruz?* (calculator gives door-to-port reference; Santa Cruz overland leg confirma con broker boliviano)
7. (optional) *¿Qué equipos conviene buscar en EE.UU. desde Bolivia?*

### Section 8: Final CTA

Match Argentina's tighter pattern. Headings:
- PY: `¿Tiene una máquina vista en EE.UU. para Paraguay?`
- UY: `¿Tiene una máquina vista en EE.UU. para Uruguay?`
- BO: `¿Tiene una máquina vista en EE.UU. para Bolivia?`

Description: 1 sentence, action-oriented, mentions WhatsApp triage outcome (not "we will quote", but "we will tell you what we can cover and what your broker confirms").

### Section 9: SEO — title, description, keywords

Already mostly correct in Codex's output, just needs accents and one tightening pass:
- Each `seo.title` ≤ 60 chars (verified — Argentina audit R-10/R-11)
- Each `seo.description` 120-160 chars (verified — Argentina audit R-11)
- Keywords: keep Codex's 6-7 per country, **add accents**.

### Section 10: Schema/JSON-LD strings

The `schema.serviceType` and `schema.mentions` fields end up in published JSON-LD. **Apply accents** here too:
- `serviceType`: `Exportación de maquinaria agrícola usada de EE.UU. a [País]`
- `mentions`: country list with proper accents (`Asunción`, `Itapúa`, `Alto Paraná`, `Resolución 98/016`, etc.)
- `inLanguage` (if surfaced via the renderer): use country-specific BCP-47 tag (`es-PY`, `es-UY`, `es-BO`) per Argentina audit R-4.

## Glossary — accent enforcement

These are the unaccented terms Codex used. **Every instance must be corrected.** Counts are from grep of the current `latam-market-pages.ts`:

| Wrong | Right |
|---|---|
| `ano` (122 instances combined with others) | `año` |
| `agricola` | `agrícola` |
| `exportacion` | `exportación` |
| `importacion` | `importación` |
| `coordinacion` | `coordinación` |
| `documentacion` | `documentación` |
| `preparacion` | `preparación` |
| `ubicacion` | `ubicación` |
| `informacion` | `información` |
| `seleccion` | `selección` |
| `cumplimiento` | `cumplimiento` (already correct, kept for grep) |
| `Asuncion` | `Asunción` |
| `Itapua` | `Itapúa` |
| `Alto Parana` | `Alto Paraná` |
| `Hidrovia` | `Hidrovía` |
| `Hidrovía Paraná-Paraguay` (full name) | (verbatim) |
| `Resolucion` | `Resolución` |
| `Cuarentena` | `Cuarentena` (already correct) |
| `tributos` | `tributos` (already correct) |
| `Tratado` | `Tratado` (already correct) |
| `Cap.` (chapter) | `Cap.` (already correct) |
| `revision` | `revisión` |
| `inspeccion` | `inspección` |
| `evaluacion` | `evaluación` |
| `tramo maritimo` | `tramo marítimo` |
| `clasificacion` | `clasificación` |
| `transito` | `tránsito` |
| `region` | `región` |
| `categoria` | `categoría` |
| `dimension` / `dimensiones` | `dimensión` / `dimensiones` |
| `maquina` | `máquina` |
| `numero` | `número` |
| `proximo` | `próximo` |
| `dia(s)` | `día(s)` |
| `pais` | `país` |
| `tecnologia` | `tecnología` |
| `economico` | `económico` |
| `tributario` | `tributario` (already correct) |
| `oceanico` | `oceánico` |
| `multimodal` | (already correct) |
| `dificil` | `difícil` |
| `via` (prep) | `vía` |
| `historico` | `histórico` |

## Test changes (`content/__tests__/latam-market-pages.test.ts`)

Two changes only.

### Change 1: accent the `Resolución 98/016` assertion

```diff
- expect(uruguay).toContain("Resolucion 98/016");
+ expect(uruguay).toContain("Resolución 98/016");
```

(Line 51.) Rationale: the unaccented form was an artifact of Codex's broken Spanish output. Locking unaccented strings in tests would lock in the slop.

### Change 2: positive accent assertions (one per country)

Add a new `it()` block that asserts the page text **contains** common accented words. This is the test-side enforcement of the accent rule — without it, a future regression could re-introduce unaccented Spanish without breaking any existing assertion.

```ts
it("uses accented Spanish throughout", () => {
  for (const page of latamMarketPages) {
    const text = flattenText(page);
    // Must contain at least these accented forms
    expect(text).toMatch(/agrícola/);
    expect(text).toMatch(/exportación/);
    // Must NOT contain the unaccented year word (ano = "anus")
    expect(text).not.toMatch(/\bano\b/);
    // Must NOT contain the unaccented forms of common terms
    expect(text).not.toMatch(/\bagricola\b/);
    expect(text).not.toMatch(/\bexportacion\b/);
    expect(text).not.toMatch(/\bcoordinacion\b/);
    expect(text).not.toMatch(/\bdocumentacion\b/);
    expect(text).not.toMatch(/\bAsuncion\b/);
    expect(text).not.toMatch(/\bResolucion\b/);
    expect(text).not.toMatch(/\bHidrovia\b/);
  }
});
```

No other test changes. The banned-pattern guard at lines 56-99 (including the new English-word bans) stays as-is — the rewritten copy will satisfy them by construction.

## Verification plan

Following `feedback_implementation_readiness.md`: i18n / SEO / schema.org claims must hit real runtime, not type-checking alone.

### Pre-merge (after copy refactor commit, before pushing)

1. `npm run lint` — must pass.
2. `npm test` — must pass (including the two test changes above).
3. `npm run build` — must pass; spot-check that the three pages compile.

### Post-push (Vercel preview)

4. Get preview URL.
5. Open `/es/destinations/paraguay`, `/es/destinations/uruguay`, `/es/destinations/bolivia` in browser. Visual scan: heading reads correctly, no `?` placeholder accents, scope card legible, FAQ accordion expands.
6. View page source on each: confirm `<title>`, `<meta name="description">`, `<link rel="canonical">`, JSON-LD `serviceType` all carry accented Spanish.
7. Click WhatsApp CTA → confirm `wa.me` URL contains the accented `agrícola` and country word in the prefilled message.
8. Click `Calcular flete estimado` → confirm calculator opens with the correct destination preselected (or, if not preselected, that the calculator country list includes UY/PY/BO).
9. Validate one URL from each `officialSources` array — confirm HTTP 200. (If any 404, drop without replacement, commit a follow-up.)

### Spot checks during execution (per `feedback_implementation_readiness.md` "fresh per-item verification")

- **Re-grep** for unaccented terms in the final file before committing: `grep -nE "\b(ano|agricola|exportacion|...)" content/latam-market-pages.ts` must return zero matches.
- **Re-grep** for English banned words: `grep -nE "(handoff|row-crop|\bdealer\b|\bZIP\b)" content/latam-market-pages.ts` must return zero matches.
- **Re-read** each `whatsappMessage`: must have accents and country-specific noun (Paraguay/Uruguay/Bolivia spelled correctly).

## Genuinely-unknown items (small list)

Per `feedback_decision_ownership.md`: I don't punt sub-decisions back. These are the only items I genuinely cannot answer:

1. **Bolivia operational status.** Memory shows BO has Supabase rate gaps (6/14 flatrack files missing customs columns) and SENASAG profile not confirmed for used machinery. Has Meridian completed any Bolivia delivery yet, or is the BO hub launching pre-first-delivery? **Default I'm taking:** treat BO as operationally-prepared (ads running, rate work in progress) but not shipment-proven, and write the trust pillars accordingly. **Override if you've shipped to BO and want me to say so.**

2. **Paraguay 5-year cap status as of May 2026.** Strategy report says it was in Senate commission as of May 2025 and not enacted as of May 2026 — but this is from Codex's research, not my own. **Default I'm taking:** quote the strategy report's status verbatim ("actualmente bajo análisis en comisión del Senado, sin sanción a mayo de 2026") and cite the Senate URL from the appendix as the primary source. The page can be updated in 5 minutes if the cap passes — I'll add a comment in the code marking the place to revise. **Override if you have updated information from your contacts.**

3. **Uruguay specific shipment proof.** Memory mentions a confirmed UY shipment (Davyt S680). **Default I'm taking:** do NOT name-drop a specific customer in copy (memory R-2 lesson — no fabricated/cherry-picked attribution). The `1,000+ exportaciones` global stat carries the credibility. **Override if you want a UY-specific named-customer line and have permission.**

These three items take the user 30 seconds total to answer via response. I will not block on them — defaults above are conservative and shippable.

## Estimate

- Spec writing: this document. Done.
- Copy refactor (content + tests): ~90 minutes of focused work.
- Lint + test + build + preview verification: ~20 minutes.
- Total from approval to PR: ~2 hours.

## Out of scope (for this spec)

- Type unification (`LatamMarketPageContent` → `CountryMarketPageContent`) — follow-up trigger: when a section structure needs to change consistently across all 4 LATAM pages (AR + PY + UY + BO), unify the type.
- WhatsApp prefill constants extraction to `lib/constants.ts`
- Per-country dedicated landing pages (`/es/landings/cosechadoras-paraguay`, etc.)
- Cross-promo callouts on `/services/*` and `/equipment/*` pages
- Blog supporting articles
- Calculator route data improvements for Bolivia
- Argentina hub edits
- **Hreflang `en` and `x-default` alternates on the new Spanish hubs** (V-8 finding). Currently the LatAm metadata sets only `alternates.canonical` and `alternates.languages.es`. Adding `en → /destinations/[country]` and `x-default → /destinations/[country]` would let Google connect the Spanish hub to the existing English destination page. Out of scope because it's an SEO improvement, not a copy issue. Track as follow-up in `app/[locale]/destinations/[slug]/page.tsx:111-114`.

These all live in the strategy report's "Phase 2" / "Cross-Cutting Assets" sections, or are improvements adjacent to but not blocking the copy refactor.

## Fact-verification status (per `feedback_implementation_readiness.md`)

Every load-bearing factual claim in the spec gets one of three statuses. **Anything still `TRUSTED` after spec approval gets re-verified during execution before the string is written into the content file.**

| Fact | Status | Source | Re-verify during exec? |
|---|---|---|---|
| `inLanguage: es-PY/es-UY/es-BO` will render correctly in JSON-LD | ✅ VERIFIED | `components/destinations/latam-market-page.tsx:161,179,205` + `content/latam-market-pages.ts:157,485,812` | No |
| WhatsApp prefilled message URL-encoded correctly with accents | ✅ VERIFIED | `components/destinations/latam-market-page.tsx:154-156` | No |
| Equipment slugs `/equipment/{combines,tractors,planters,sprayers}` exist | ✅ VERIFIED | `content/equipment.ts:28,69,150,190` | No |
| OG image files exist on disk | ✅ VERIFIED | `test -f public/images/{...}.jpg` returned all OK | No |
| Sitemap entries for `/es/destinations/{paraguay,uruguay,bolivia}` | ✅ VERIFIED | `app/sitemap.ts:83-95` (Codex's diff) | No |
| Calculator policy entries exist for PY/UY/BO with `broker_confirm` posture | ✅ VERIFIED | `lib/calculator-v3/policy.ts:423-537` | No |
| Baseline `npm test` passes (16 files, 144 tests) | ✅ VERIFIED | `npm test` run, 2.05s, 0 failures | No |
| Codex's strategy report (`~/Downloads/LATAM Expansion Strategy Report.docx`) is the user's authorized brief | ✅ VERIFIED | User confirmed in conversation | No |
| Argentina hub uses formal `usted` register (no voseo) | ✅ VERIFIED | `grep` against `content/argentina-market.ts` returned `envíe`, `revise`, `consulte`, `coordine` | No |
| Test file at `content/__tests__/latam-market-pages.test.ts` bans English words `handoff`, `row-crop`, `dealer`, `ZIP` | ✅ VERIFIED | Lines 96-99 per system reminder confirming the user's recent edit | No |
| Paraguay: Ley 2018/02 is the operative free-import statute | ⚠️ TRUSTED (strategy report §3.2) | `https://baselegal.com.py/docs/82309f6e-438f-11eb-94a2-525400c761ca` | Yes — open URL, confirm law text references used machinery |
| Paraguay: 5-year age cap is "in Senate commission, not enacted" as of May 2026 | ⚠️ TRUSTED (strategy report §3.2) | `https://www.senado.gov.py/index.php/noticias/...2025-05-06...` | Yes — open URL, confirm status hasn't progressed |
| Paraguay: Hidrovía transit Buenos Aires → Asunción/Villeta = 10-15 days, +5-10 in Sep-Dec drought | ⚠️ TRUSTED (strategy report §3.3) | trade.gov country commercial guide + multi-source | Yes — confirm the seasonal-drought caveat is current |
| Uruguay: Resolución 98/016 30-day re-export consequence for non-compliant cleaning | ⚠️ TRUSTED (strategy report §4.2) | `https://www.gub.uy/...resolucion-n-98016-dgsa-...` | Yes — open URL, confirm 30-day window in source text |
| Uruguay: TGA 2% per Decreto 426/011 on BK capital goods | ⚠️ TRUSTED (strategy report §4.2) | `https://www.aduanas.gub.uy/...decreto-n%C2%B0-426_011.html` | Yes |
| Uruguay: US is #2 ag equipment supplier at 18.4% in 2024, +10.4% YoY | ⚠️ TRUSTED (strategy report §4.4) | USDA FAS / trade.gov Uruguay Agricultural Equipment | Yes — figures sometimes shift in revisions |
| Bolivia: 10-year cap on used capital goods (firm constraint) | ⚠️ TRUSTED (strategy report §5.2) | Aduana Nacional resolutions | Yes — confirm cap is still 10 years (not revised in 2026) |
| Bolivia: Ley 1391/2021 + Ley 1613/2025 art. 8 IVA exemption on Cap. 84/85/87 | ⚠️ TRUSTED (strategy report §5.2) | lexivox + Decreto Supremo 4579 | Yes |
| Bolivia: 1904 Treaty grants 365-day free storage at Arica for import cargo | ⚠️ TRUSTED (strategy report §5.2) | LogCluster Arica capacity assessment | Yes |
| Bolivia: Arica → Santa Cruz overland ~1,650 km via Tambo Quemado-Patacamaya-Cochabamba | ⚠️ TRUSTED (strategy report §5.3) | Multi-source | Yes |
| Bolivia: ANAPO 2025/26 verano = 2.6 MMT (revised from 3 MMT due to flooding) | ⚠️ TRUSTED (strategy report §5.4) | `https://anapobolivia.org/...soya-de-verano-2025-2026...` | Yes |
| Paraguay 2025/26 soybean = 10.9 MMT, #4 global exporter | ⚠️ TRUSTED (strategy report §3.4) | USDA FAS GAIN PA2025-0001 | Yes |

**Re-verify protocol during execution:** for each TRUSTED row I plan to surface in copy, open the cited URL and confirm the claim before writing the Spanish string. If the URL 404s or the source contradicts the report, drop the claim from the page rather than ship a fabricated detail. Argentina audit lesson R-2.

## Sign-off

**As the spec author (me, in three roles):**
- 🧑‍💼 Founder hat — reasonable scope, doesn't ask for unilateral business calls. **Sign off.**
- 🎯 Product hat — calculator CTA decision corrected (V-6); analytics tracking via existing `[country]_*` event names mirrors Argentina. A/B testing of section weighting is correctly deferred to post-launch metrics phase. **Sign off.**
- 🔬 Researcher hat — every TRUSTED fact has a primary source URL and an explicit re-verify-during-exec protocol. **Sign off, with the re-verify discipline tied to execution.**
- 💻 Developer hat — renderer i18n verified correct (V-1), WhatsApp encoding verified correct (V-2), equipment slugs and OG images verified to exist (V-3, V-4), sitemap structure verified (V-5), baseline tests pass (V-7). Two test changes (one delta, one new `it()` block) are surgical. **Sign off.**
- 🎨 Designer hat — D-13 adds a mobile + tablet visual check; copy-shortening is the cheap fix path if anything overflows. **Sign off.**
- 🧪 QA hat — verification plan covers lint, test, build, preview, JSON-LD validity, accent re-grep, English-word re-grep, WhatsApp URL accent encoding. **Sign off.**
- 🏛 Architect hat — type unification deferred with explicit follow-up trigger; rollback path documented (D-14); hreflang gap tracked as follow-up; no new tech debt introduced. **Sign off.**

**Spec author sign-off: ✅ APPROVED for execution by the spec author.**

This sign-off does not bypass the user's gatekeeper role. The user is the final authority. Proceeding to `npm` lint/test/build + push only after the user signs off.

The 3 genuinely-unknown items (BO shipment status, PY 5-year cap May 2026 status, naming a UY customer) remain. Defaults documented above are conservative; user override is welcome but not required.
