# Visual brainstorm — brand-strategist angle (`/design-system` showcase)

**Date:** 2026-04-29
**Author:** brand-strategist (dispatched parallel — isolated context)
**Scope:** read-only audit. Compare React rebuild at `apps/web/src/app/design-system/` against static reference `apps/web/public/design-system.html` («Provedo Design System v2 — refined»).
**Question PO posed:** «всё равно не красиво». Brand-identity angle: does the React showcase visually express Provedo (Magician + Sage primary · Everyman warmth modifier · Lane A discipline · «I provide for / lead through» semantic)? Or has it drifted toward generic fintech?

---

## TL;DR

The React rebuild copies the surface vocabulary correctly (eyebrow rhythm, headline phrasing, real-product copy in samples) but loses **three** Provedo-signature qualities that the static reference embodies:

1. **The stage as a single inhabited room** — static reference is one extruded ink-bordered stage with one unified rhythm. React composes the same content but breaks it into discrete `<DsSection>` slabs that read as «documentation chapters», not as «one curated showcase the way an editor would lay out a magazine spread».
2. **Editorial top-of-page** — static page literally says `<h2>Provedo Design System v2 — refined</h2>` then drops the cream-on-charcoal nav and goes straight into the first stage with a single deeply-considered tagline. React inserts an outer page header that **repeats** the headline («Notice what you'd miss») — once at page level (h1, 40px) and AGAIN inside each stage (`<StageFrame>`, 48px). Magician archetype values quiet invention; double-billing the signature line dilutes it to billboard-fintech volume.
3. **Tactile depth at hero** — `SignatureHero` correctly applies `--shadow-lift`, but its CTA pair (`Get early access` + `See how it works →`) is rendered with the production `Button` primitive. Production buttons inherit the design-tokens system shadows that have been polished to «paper-on-corkboard» calm. The static reference's hero CTAs use the showcase-local `.btn-primary` with a dedicated `--shadow-primary-extrude` that reads as ink-pressed-into-paper. Visual delta is small but reads as «the React version's hero is a flatter cousin of the static one».

**Anti-positioning trap risk:** the React showcase drifts modestly toward **Bloomberg Terminal / institutional-doc** register (text-heavy, section-by-section, no breathing curation). Not Robinhood (no gimmicks, no bright greens), not Mint (no cluttered banner-and-icon panic). Bloomberg drift comes from documentation-page framing, not from data density.

---

## Brainstorming alternatives record (per `superpowers:brainstorming`)

Before judging the current implementation, here is the design-direction option-set that v1.0→v1.1 considered (synthesised from `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` §1.1 changelog and the v1.0→v1.1 ratified-drift table). Naming the alternatives makes the «is current direction even right?» question explicit.

| # | Direction | What it would have looked like | Why rejected (or chosen) |
|---|---|---|---|
| 1 | **Vercel-billboard dark** | Dark-only with single accent-glow CTAs, mono-only eyebrows, single-word colour emphasis in headlines | REJECTED — brand-strategist v1.1 lock §13.4 explicitly bans single-word colour emphasis; reads as «another teal SaaS» |
| 2 | **Mercury-light × Linear-shadow dark (CHOSEN)** | Two-territory: warm cream paper light + neutral cool dark; ink-extruded CTA in both | CHOSEN — paper-coded references (Patagonia, Craig Mod, Wirecutter, The Economist, McPhee) all carry a paper register. Dark = Sage focus mode. |
| 3 | **All-light Stripe Press-only** | One theme. Cream + ink + tabular numerals. Period. | REJECTED — PO directive 2026-04-27 «dark mode in first release». Loss of dark would have made the product read as 2018-era productivity tool. |
| 4 | **Robinhood-bright fintech** | Bright green up / bright red down, gamified motion, large CTAs | REJECTED categorically — anti-positioning Lane A (Provedo never imperatives «buy X»; bright-green-as-victory directly contradicts «notice what hides» quiet voice) |
| 5 | **Bloomberg Terminal density** | Dark-only, dense data tables, mono-everywhere, near-zero whitespace | REJECTED — institutional register loses Everyman warmth modifier; ICP A (multi-broker millennial) reads as «not for me» |

The chosen direction (#2) is correct. **The audit below judges current React implementation against #2 fidelity, not against #1/#3/#4/#5 alternatives.**

---

## Brand-identity expression scorecard (per surface)

| Surface | React file:line | Static reference | Brand-identity fidelity | Note |
|---|---|---|---|---|
| Page-level header (eyebrow + h1 + sub) | `page.tsx:40-67` | `<h2>Provedo Design System v2 — refined</h2>` (single line, line 935) | **Off-brand** | Re-uses the «Notice what you'd miss» signature line as outer-page h1, then again as stage headline. Static is restrained — only the stage carries the line. |
| Sticky nav | `ShowcaseHeader.tsx` | `.ds-nav` (cream-on-charcoal pill, lines 19-40) | **Partial** | React uses `Logo` + section anchors — fine in isolation, but framed as «documentation toolbar» (Sun/Moon icon + «Motion on/off» toggle) rather than the static's pure section-jump pillbox. The tooling reads as dev-utility; the static reads as showcase chrome. |
| Stage frame | `StageFrame.tsx:32-64` | `.stage` (lines 43-72; ink-bordered with 2px solid var(--ink) under stage head) | **Landed** | Eyebrow + 48px headline + right-aligned mono meta. Faithful port. The 2px `border-bottom` rule is the strongest brand signature on the page. |
| Stage eyebrow («PROVEDO · DESIGN SYSTEM v2 · LIGHT») | `page.tsx:72`, rendered via `StageFrame` | line 952 | **Landed** | Geist Mono · 10px · 0.22em letter-spacing · accent forest-jade. Editorial-publication register. |
| Stage headline («Notice **what** you'd miss.») | `StageFrame.tsx:53-57` | line 953 | **Landed visually, off-brand semantically** | Bold accent, no colour shift — correct per v1.1 lock §13.4. But repeating it AT page level too dilutes the signature. |
| Color tokens | `foundation.tsx:128-157` | lines 963-979 | **Landed** | Real Provedo copy in row labels. Russian mixed in («только для статусов / цитат / успеха») — modest Everyman warmth. Faithful. |
| Typography demo | `foundation.tsx:159-168` | lines 981-989 | **Landed** | Real Provedo copy: «Your portfolio, finally legible.» / «Every account. One conversation.» / «Your IBKR account drifted 3.2% from target last week.» / `$184,210 · 12.4% · 142 lots`. Sage-archetype voice carried correctly. |
| Shadow / elevation | `foundation.tsx:170-208` | lines 991-1002 | **Partial** | The labels («paper lift», «tactile double», «hero / focused», «ink extrude») carry brand-voice. The grid layout matches. Visual fidelity depends entirely on whether the design-tokens shadows match the showcase-local CSS — see «top-5 doesn't feel Provedo» below. |
| Signature hero card | `SignatureHero.tsx` | lines 1004-1015 | **Partial** | Eyebrow «PORTFOLIO ANSWER ENGINE · 01» landed. Headline + sub copy faithful. CTA pair («Get early access» + «See how it works →») uses production `Button` primitive — see issue #3 in summary. |
| Buttons section | `primitives.tsx:29-73` | lines 1017-1037 | **Off-brand (copy)** | Three identical «Get early access» across sm/md/lg sizes. Static reference uses `Primary` / `Primary` / `Primary` placeholder text. Triple-repeating the marketing CTA across the buttons row reads as «I really want you to click this» — Robinhood/Cialdini-pressure register, NOT Sage-restraint. |
| Form fields | `forms.tsx` | lines 1039-1053 | **Landed** | Real product copy (`ruslan@provedo.app`, «We'll only ping for early access.», «Already exists.», «Ask about your portfolio…», Lane A radio). Conversational eyebrows + real broker context. **Strongest Everyman-warmth surface on the page.** |
| Cards (portfolio · insight · empty) | `cards.tsx` | lines 1056-1064 | **Landed** | IBKR · LYNX · $184,210 / BINANCE · $42,180 / NVDA in 3 accounts insight / «Connect your first broker and Provedo will surface patterns within a minute» empty state. All-real, all-Provedo. |
| Chips · badges | `primitives.tsx:75-84` | lines 1066-1077 | **Off-brand (semantic)** | `<Badge tone="negative">Lane A</Badge>` — Lane A is a positive trust signal in Provedo positioning (`02_POSITIONING.md` §brand-archetype, §anti-positioning). Rendering it as `tone="negative"` (bronze/red register) directly contradicts the brand frame. |
| Iconography | `iconography.tsx` | (not in static) | **Brand-neutral** | 18-icon Lucide grid is a development utility, not a brand-identity surface. Acceptable but does not actively express Provedo. |
| Theme · Motion testbed | `theme.tsx` | (not in static) | **Brand-neutral** | Pure dev-tooling. Tells the reader «here's how the toggle plumbing works». Reads as documentation — fine for purpose, but breaks visual rhythm if it sits next to brand-expression sections. |
| Disclaimer | `disclaimer.tsx` | (not in static) | **Brand-neutral** | Renders production `RegulatoryDisclaimer`. Fine for showcase. |

**Summary:** 6 surfaces «landed», 4 «partial», 3 «off-brand», 4 «brand-neutral».

---

## Top-5 «doesn't feel Provedo» findings

### 1. Double-billing the signature tagline (page h1 + stage h2)
**File:** `apps/web/src/app/design-system/page.tsx:52-57` AND `_components/StageFrame.tsx:53-57` (rendered with `headline="Notice what you'd miss."` from `page.tsx:73` and `:96`).

The signature line «Notice **what** you'd miss» is the page's strongest Magician-archetype moment («notice what hides»). Static reference uses it ONCE — inside the stage head, big, restrained. React renders it three times: outer h1 (40px), light stage h2 (48px), dark stage h2 (48px). Magician archetype values quiet revelation — repeating dilutes to fintech-billboard volume.

**Brand consequence:** drifts toward Robinhood-CTA register («line repeated until you act on it»), not Provedo-Sage register («one observation, well-formed»).

### 2. Triple-repeated «Get early access» CTA in Buttons row
**File:** `apps/web/src/app/design-system/_sections/primitives.tsx:32-44`.

The Buttons sub-section renders three primary buttons all labelled `Get early access` (sm + md + lg) plus `Disabled`. Static reference uses placeholder labels («Primary», «Primary», «Primary», «Disabled») — see line 1019-1023 of the static.

Real-product copy is normally a brand win, but here it backfires: stacking «Get early access · Get early access · Get early access» across three sizes reads as marketing-funnel pressure, not Sage-restraint. **Same word three times in 600px of horizontal space is a Cialdini commitment-and-consistency pattern**, not Provedo voice.

### 3. Lane A rendered as `tone="negative"` Badge
**File:** `apps/web/src/app/design-system/_sections/primitives.tsx:82` — `<Badge tone="negative">Lane A</Badge>`.

`02_POSITIONING.md` §brand-archetype + §anti-positioning explicitly frame Lane A as a **positive trust signal**: «brain remembers, notices, explains — it does not advise». «We are not selling you anything».

Rendering Lane A in the bronze (warning/error) tone is a direct contradiction of brand frame. Should be `tone="positive"` (forest-jade) or default ink — never bronze.

### 4. Outer-page eyebrow uses brand product name + version, no editorial label
**File:** `apps/web/src/app/design-system/page.tsx:40-51` — `{brand.productName} · Design System v2 · Showcase`.

Static reference's outer page is a single human sentence: `<h2>Provedo Design System v2 — refined</h2>` (line 935). The word «refined» does brand-identity work — it signals «considered, polished, paper-stock cadence» (Sage-Magician register).

React replaces «refined» with the version-and-environment metadata. Loses one word that was carrying brand-voice. Small but the page literally opens with this; first impression matters.

### 5. Theme toggle button + Motion toggle button labelled with operational verbs
**File:** `apps/web/src/app/design-system/_components/ShowcaseHeader.tsx:106` (`{reduced ? 'Motion off' : 'Motion on'}`) and `:117` (`{dark ? 'Light' : 'Dark'}`).

Reads as developer-tooling. Provedo's Sage-Magician register would ask: how would Stripe Press / Mercury / Linear-shadow label these in their own systems? Stripe uses iconography only with tooltip. Mercury writes a single-word noun («Theme»). Linear writes a key-binding hint.

«Motion off / Motion on» is correct semantically but reads as instrumentation. Brand-aligned alternatives: icon-only with tooltip on hover, or single noun («Motion», «Theme») with state via toggle visual rather than label flip.

---

## Top-5 «brand identity landed» wins

### 1. Stage frame ink-rule
`StageFrame.tsx:50-58` faithful to static lines 43-72. The 2px solid `var(--ink)` border under the stage head is the single strongest brand-signature visual on the page. Editorial-publication cadence preserved.

### 2. Form fields voice (Forms section)
`forms.tsx:55-66` — `defaultValue="ruslan@provedo.app"`, `helper="We'll only ping for early access."`, error `«Already exists.»`, search placeholder `«Ask about your portfolio…»`, radio group `Lane A` / `Lane B`. **This is the strongest Everyman-warmth surface on the page.** Conversational, specific, real. Reads as Provedo wrote it, not as generic Lorem.

### 3. Insight card copy
`cards.tsx:67-76` — «A pattern **across** accounts. NVDA appears in 3 of your accounts. Combined exposure 18% — concentrated more than it looks broker-by-broker.» This is Sage-archetype text (knowledge made visible without preaching) AND Magician-archetype framing (notices what hides between brokers). Bold-accent on `<strong>across</strong>` follows the locked v1.1 §13.4 rule (bold weight only, no colour). Reference-quality.

### 4. Typography demo content
`foundation.tsx:58-103` — every type-scale row uses real Provedo copy: «Your portfolio, finally legible.» / «Every account. One conversation.» / «Your IBKR account drifted 3.2% from target last week.» / `PORTFOLIO · ANSWER · ENGINE`. The numerals row (`$184,210 · 12.4% · 142 lots`) demonstrates tabular-figures with real money. **Editorial financial paper cadence achieved.**

### 5. Empty-card copy
`cards.tsx:86-87` — «No insights yet.» (h4) + «Connect your first broker and Provedo will surface patterns within a minute.» Imperative-but-warm, no command-pressure, names the agent (Provedo) doing the work. Magician-archetype with Everyman warmth. Reference-quality.

---

## Anti-positioning trap risk

| Anti-position | React showcase distance | Risk reading |
|---|---|---|
| **Robinhood / Acorns** (gamified retail) | Far | No bright greens, no celebration motion, no push-trade UI. Risk: **low**. |
| **Bloomberg Terminal** (institutional density / dark-only / overwhelming data) | **Closer than ideal** | The page reads as «design system documentation slabs» — Foundation, then Primitives, then Forms, then Cards, then Charts. Each `<DsSection>` is the same slab. Bloomberg Terminal has the same structural rhythm: tile-after-tile, all uniform. The static reference avoided this by curating the stage as a single inhabited room — sections within a stage feel like one editor laid them out, not like a renderer iterated over a list. Risk: **moderate**. |
| **Mint** (cluttered dashboards / banner ads / category icons) | Far | No banner ads, no rainbow category-icons, no «celebrate your savings rate» copy. Risk: **low**. |

**Closest anti-position drift:** Bloomberg Terminal (institutional documentation register). Mitigation: see Fix #1 below.

---

## Concrete fix proposals

### Fix #1 (highest impact) — Remove the outer-page h1 «Notice what you'd miss»
**File:** `apps/web/src/app/design-system/page.tsx:52-57`.
**Change:** Replace outer h1 with the static reference's actual line: `<h2>Provedo Design System v2 — refined</h2>`. Demote font size from 40px to 28px (matches the static `body > h2` rule on line 15). Drop the 13px sub-paragraph entirely OR replace with one-sentence brand-frame: «A working showcase of every Provedo surface — both themes, side-by-side, real React mounts.»
**Rationale:** the signature tagline lives ONCE, inside the stage. Page-level identity uses «refined» — the editorial Sage-Magician word doing brand work in the static reference. Removes Magician-archetype dilution.

### Fix #2 — Restore placeholder button labels in Primitives
**File:** `apps/web/src/app/design-system/_sections/primitives.tsx:32-44`.
**Change:** Replace `Get early access` × 3 with `Primary` × 3 (matching static reference lines 1019-1021). Reserve real-product CTA copy for the SignatureHero only.
**Rationale:** showcase grammar — the Primitives row demonstrates SIZE variation; using identical real-marketing copy three times reads as advertising pressure, not size demonstration. Static reference understood this. Sage-restraint preserved.

### Fix #3 — Re-tone the Lane A badge
**File:** `apps/web/src/app/design-system/_sections/primitives.tsx:82`.
**Change:** `<Badge tone="negative">Lane A</Badge>` → `<Badge tone="positive">Lane A</Badge>` (or default tone with no tone modifier, rendering as ink chip).
**Rationale:** Lane A is a **positive trust signal** in Provedo positioning. Bronze-warning tone directly contradicts brand frame. Smallest fix on this list, biggest semantic correction.

### Fix #4 — Soften the Theme/Motion toggle labels
**File:** `apps/web/src/app/design-system/_components/ShowcaseHeader.tsx:106, 117`.
**Change options (pick one):**
- (a) Drop labels, keep icon-only with `aria-label` for a11y. Tooltip on hover surfaces the verb. Most Sage-restrained option.
- (b) Replace with single noun: `Theme` / `Motion`. State carried via toggle visual contrast (filled vs ghost), not via label flip.
- (c) Replace with current state in mono-eyebrow style: `MOTION · ON` / `THEME · LIGHT`. Mono-eyebrow rhythm matches the rest of the page chrome.
**Rationale:** instrumentation labels read as dev-tool register. Provedo voice = quiet, considered. Current «Motion on / Motion off» is correct but loud.

### Fix #5 — Add an editorial first-paragraph between page header and Stage 1
**File:** `apps/web/src/app/design-system/page.tsx` (after line 67, before `<StageFrame id="light-v2">`).
**Change:** Insert a single 13px paragraph in `--text-2`, max-width 720px:
> «Two stages, side-by-side. Light is paper — Mercury and Stripe Press. Dark is night-focus — Linear-shadow restraint. Forest-jade reads only on status, citation, and verified. Bronze on warning, drift, danger. Ink carries the signature.»

**Rationale:** Magician + Sage archetype is best expressed by a single curated paragraph that names the design language out loud. Currently the page jumps from «Notice what you'd miss» → directly into Stage 1 with no editor's-voice frame. The static reference doesn't have this either — but the static reference is single-page and self-curating. The React showcase, with its outer-page wrapper, NEEDS the editorial bridge or it reads as documentation. This is the one place to ADD copy, not subtract.

---

## Brainstorming: 5 visual treatments considered, not chosen

Per `superpowers:brainstorming` discipline — recording the alternative directions that v1.0→v1.1 polish rounds rejected, so the audit above is judged against the chosen direction (Mercury-light + Linear-shadow dark) and not against straw-men.

1. **Vercel-billboard dark** — single-word colour emphasis in headlines, dark-only, mono-everywhere. REJECTED at v1.1 lock §13.4 (single-word colour emphasis explicitly banned as residual Vercel inheritance trap).
2. **All-light Stripe Press** — one theme, cream + ink, no dark. REJECTED — PO directive 2026-04-27 «dark mode in first release».
3. **Robinhood-bright fintech** — bright green up / bright red down, gamified. REJECTED categorically — anti-positioning Lane A.
4. **Bloomberg Terminal density** — institutional, near-zero whitespace, mono-everywhere. REJECTED — loses Everyman warmth; ICP A reads as «not for me».
5. **Mercury-light × Linear-shadow dark** — CHOSEN. Two-territory dark intentional. Paper-coded references (Patagonia / Craig Mod / Wirecutter / The Economist / McPhee).

The chosen direction is the right call. Current React implementation drifts modestly from it via the five issues identified. None of the issues require palette / typography / shadow changes — they are framing, copy, and semantic-tone corrections.

---

## Out-of-scope notes (informational only)

- Production `Button` shadow vs showcase-local `.btn-primary` shadow potential delta is a **product-designer / frontend-engineer** question — outside brand-strategist scope. Flagging as «if hero CTAs read as flat, compare `--shadow-primary-extrude` token output between the two surfaces».
- Density / asymmetry / breathing-space critique is **product-designer angle**. Brand-strategist observation: the static reference feels hand-curated because each section's `meta` chip carries a brand-voice editorial annotation («tactile preserved», «paper lift», «primary = ink (not green)», «inset + ink-on toggles»). The React port preserves these meta chips faithfully. Curation feeling is mostly there; what reads as «documentation» comes from the outer-page framing (Fix #1) and the Theme/Motion section (which is dev-tooling, not brand-expression).
- Iconography section + Theme · Motion testbed sit outside both stages. They are dev-utilities; their presence is correct (PO needs them for verification) but they break visual rhythm. Recommend: render them under a single sub-header «Development utilities» with a short editorial frame, so the reader knows the brand-expression part ended at the second stage. Not a fix, a framing recommendation.

---

## Files cited

- Static reference: `apps/web/public/design-system.html`
- React rebuild entry: `apps/web/src/app/design-system/page.tsx`
- Brand canon: `docs/product/02_POSITIONING.md` §brand-archetype, §tone-of-voice, §anti-positioning
- Design system canon: `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` §1.1 changelog, §3.3 colour usage rules, §13 brand-strategist lock-in notes
- Memory: «Naming LOCKED — Provedo 2026-04-25», «Design system 2026-04-27», «No predecessor references»

---

**End of audit.** Read-only. Zero code modified. R1 / R2 / R4 respected.
