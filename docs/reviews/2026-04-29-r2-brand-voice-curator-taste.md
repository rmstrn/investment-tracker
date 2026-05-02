# R2 review — brand-voice-curator · taste-fit audit of `/design-system`

**Date:** 2026-04-29
**Author:** brand-voice-curator (R2 dispatch — read-only, isolated context)
**Branch:** `chore/plugin-architecture-2026-04-29` @ `afef2bf`
**Question PO posed:** «устал повторять, мало изменилось». R2 angle: does the React showcase match the brands PO actually loves visually, or have we drifted toward generic «design-system documentation» aesthetic?

---

## Executive note (corpus state)

`docs/product/BRAND_VOICE/` does **not exist**. The taste-reference corpus has never been seeded — the named «open question from Round 5» (which 2-3 brands does PO love by sound/look) was answered organically across the design-direction reviews of 2026-04-27 instead of in a curated artefact. The signals below are **reverse-engineered** from `02_POSITIONING.md`, the `2026-04-27-tactile-shift-*` triad, `2026-04-27-design-direction-depressed-ui.md`, `2026-04-27-design-system-final-*` set, and `2026-04-29-visual-brainstorm-brand-strategist.md`.

**Threshold check (per brand-voice-curator role spec):** target ≥ 10 positive + 5 negative = 15 total. Current reverse-engineered corpus is **8 positive + 6 negative = 14 total**. Just below threshold but high-density per signal — every brand has been named multiple times across multiple reviews with stated reasons.

---

## Section 1 — Taste-signal inventory (PO-loved brands per archive)

These are the brands that recur as **positive references** across the locked positioning + voice docs and the 2026-04-27 design-direction reviews. Each has a stated reason from a primary doc.

### Positive anchors (8 brands)

| # | Brand | Industry | Why PO/voice doc loves it | First named in |
|---|---|---|---|---|
| 1 | **Patagonia (product pages)** | Outdoor retail | «Paper-tag aesthetic, declarative type, flat product photography on white, the typography does the work» | tactile-shift-content-lead L28 |
| 2 | **Craig Mod / Ridgeline** | Newsletter / essay | «Long-form prose, flat black-on-cream, paper-mail metaphor, printed-page warmth, no UI texture» | tactile-shift-content-lead L29; tactile-shift-brand-strategist L26 |
| 3 | **Wirecutter** | Editorial reviews | «Utilitarian-warm review register, flat content blocks, hierarchy of headline → kicker → body» | tactile-shift-content-lead L30 |
| 4 | **The Economist (leaders)** | Financial-editorial print | «Print column rhythm, flat type on flat paper, takes itself seriously without being cold» | tactile-shift-brand-strategist L26; content-lead L31 |
| 5 | **John McPhee** | Long-form journalism | «Hardcover book interior, observation register, black ink on white page» | content-lead L32; positioning §tone-of-voice |
| 6 | **Mercury (2024)** | Banking | «Editorial-flat with one accent, modern utility, restrained craft, single soft shadow on cards» | tactile-shift-brand-strategist L39; depressed-ui L14 |
| 7 | **Stripe Press / Stripe Dashboard** | Editorial / SaaS | «Editorial typography, single soft shadow on functional cards, depth at instrument moments only» | tactile-shift-brand-strategist L36, L56; depressed-ui L14 |
| 8 | **Granola** | Productivity SaaS | «Cards + soft shadows + warmth + tactility, but no double-shadows, no plastic vocabulary, paper-and-ink editorial» | tactile-shift-brand-strategist L48 |

**Tertiary positive signals (named once, lower confidence):** Linear (early years 2020-22 — moderate depth + composed engineer-voice), Notion / Obsidian (intonation, NOT visual — explicitly «not Notion: too playful» on visual), Anthropic (restrained palette), Things 3 (closest reference for tactility-PO-is-reaching-for, restrained depth).

### Negative anchors (6 brands)

| # | Brand | Industry | What PO/voice doc rejects | First named in |
|---|---|---|---|---|
| 1 | **Robinhood** | Retail brokerage | «Heavy double-shadow chiclets, gamified celebration, casual money toy, low-trust for portfolio-scale work» | tactile-shift-brand-strategist L42 |
| 2 | **Cash App** | Payments | «Cash-App-style raised tile, plastic component vocabulary, gradient buttons, celebration motion» | tactile-shift-brand-strategist L42 |
| 3 | **Acorns / Daffy** | Micro-investing | «Skeumorphic acorn-jar, mascot-tactile, my-first-investing-app vibe, approachable but unserious» | tactile-shift-brand-strategist L42; positioning §anti |
| 4 | **Bloomberg Terminal** | Institutional finance | «Dense data, mono-everywhere, near-zero whitespace, institutional register, ICP A reads as not-for-me» | visual-brainstorm-brand-strategist L34, L126 |
| 5 | **Headspace / Duolingo (encouraging-voice fintech)** | Wellness / EdTech | «You're doing great! Almost there! Wellness-app-for-money, candy voice, soft 3D + encouraging copy» | tactile-shift-content-lead L32, L78 |
| 6 | **Mint (cluttered dashboards)** | PFM | «Banner ads, rainbow category-icons, celebrate-your-savings-rate copy» | visual-brainstorm-brand-strategist L127 |

**Pattern across positives:** every single one is **paper-coded**. Either literal paper (Patagonia tag, McPhee book, Economist column, Craig Mod newsletter, Wirecutter review) or **paper-as-metaphor** (Mercury cards = single sheet, Stripe Press = book imprint, Granola = paper-and-ink editorial).

**Pattern across negatives:** every single one is **plastic-coded** (Robinhood / Cash App / Acorns chiclets), **institutional-coded** (Bloomberg density), or **wellness-coded** (Headspace soft-3D + encouraging copy). Three opposite anti-territories — but all share «not paper».

---

## Section 2 — Per-signal current showcase score

Audit of `apps/web/src/app/design-system/page.tsx` + `_sections/*` against each anchor. Pass / partial / fail.

### Positive-anchor matching

| # | Anchor | Showcase expression | Score | Note |
|---|---|---|---|---|
| 1 | Patagonia (declarative type, flat) | StageFrame headline + Foundation type rows use real-product copy («Your portfolio, finally legible.»). 48px Geist semibold, no italics, no celebration. | **PASS** | Strongest single match. |
| 2 | Craig Mod (paper-mail / flat black-on-cream) | Light stage uses cream paper + ink. Forms section copy («We'll only ping for early access.») reads as Craig-Mod-warm-restrained. | **PASS** | Insight card («A pattern across accounts. NVDA…») is reference-quality Mod-cadence. |
| 3 | Wirecutter (utilitarian-warm review register) | Cards section shows portfolio · insight · empty in the same hierarchy a Wirecutter review uses (eyebrow → head → body → meta). | **PASS** | Cards.tsx is the page's strongest editorial-review surface. |
| 4 | The Economist (print column rhythm) | Two-stage stacked layout reads as page-after-page in a printed magazine. The 2px ink-rule under each stage head is the strongest single brand signature on the page — it IS an Economist column-rule transposed to UI. | **PASS** | StageFrame is the load-bearing brand element here. |
| 5 | McPhee (observation register, ink on page) | The signature line «Notice what you'd miss.» IS a McPhee-register sentence. The verb «notice» is the load-bearing observation verb across the voice doc. | **PARTIAL** | Sentence is right; **rendering it three times** (page h1 + light stage h2 + dark stage h2 — see brand-strategist Fix #1) breaks the McPhee-restraint pattern. McPhee says one thing once; we say it thrice. |
| 6 | Mercury (single soft shadow, restrained craft) | Foundation shadow grid declares «paper lift / tactile double / hero-focused / ink extrude». Production `Button` consumes design-tokens shadows. | **PARTIAL** | The vocabulary is there. The execution depends on whether `packages/ui/Button` actually consumes `--shadow-primary-extrude` — per product-designer brainstorm Fix D, this is the single biggest unverified visual contract on the page. If Button doesn't consume the token, the «Mercury restrained craft» reading collapses. |
| 7 | Stripe Press / Stripe Dashboard (depth at instrument moments only) | SignatureHero gets `--shadow-lift`. Other sections stay flat-card. | **PARTIAL** | Architecturally correct. **But:** SignatureHero CTAs use production `Button` (not showcase-local `.btn-primary`) — so the «ink-pressed-into-paper» Stripe-Press tactile moment is rendered with a less extruded shadow than the static reference. The instrument moment is muffled. |
| 8 | Granola (paper-and-ink editorial cards, no plastic) | Insight card + Empty card chrome = paper card with single soft shadow. No plastic chiclet vocabulary anywhere. | **PASS** | Closest brand-cousin match — the React showcase IS Granola-shaped. |

**Positive-anchor pass rate: 5 PASS / 3 PARTIAL / 0 FAIL = 5/8 fully expressed, 3/8 partially expressed.**

### Negative-anchor anti-matching (we want zero proximity)

| # | Anti-anchor | Showcase risk | Score |
|---|---|---|---|
| 1 | Robinhood (gamified retail) | No bright greens, no celebration motion, no push-trade UI. | **CLEAR** |
| 2 | Cash App (plastic chiclets) | No double-shadow, no gradient buttons. | **CLEAR** |
| 3 | Acorns / Daffy (skeumorphic) | No mascot, no acorn-jar. | **CLEAR** |
| 4 | Bloomberg Terminal (institutional density) | **Closer than ideal** — page reads as «design-system documentation slabs» (Foundation → Primitives → Forms → Cards → Charts), uniform tile-after-tile rhythm. | **DRIFT** |
| 5 | Headspace / Duolingo (encouraging-voice + soft 3D) | No celebration copy, no «you're doing great». But the triple-«Get early access» CTA stack in Primitives (per brand-strategist Fix #2) is a Cialdini-pressure pattern that drifts toward the wrong register. | **PARTIAL DRIFT** |
| 6 | Mint (cluttered dashboards) | No banner ads, no rainbow category icons. | **CLEAR** |

**Negative-anchor avoidance: 4 CLEAR / 2 DRIFT.** The two drifts are both **documentation-register** drifts (Bloomberg) or **marketing-pressure** drifts (Headspace-via-CTA-repetition). No drift toward plastic-fintech or skeumorphic territories — those are firmly avoided.

---

## Section 3 — Missing-signal analysis

What's in the brand DNA per the archive that is **NOT visible** on the showcase today?

### Missing element #1 (highest impact) — **The single curated editor's voice paragraph**

Every paper-coded reference (Patagonia, Mod, Wirecutter, Economist, McPhee) opens with **a curator/editor's voice naming the page's intention** before the page becomes a catalogue. The static design-system.html does this implicitly via its «refined» eyebrow + minimal frame. The React showcase **jumps directly from page-level eyebrow → into the first stage** with no editorial bridge.

Concrete missing artefact: a single 13px paragraph between the page header (line 67 of `page.tsx`) and Stage 1 (line 69) that names the design language out loud in McPhee-cadence.

This is **the same fix the brand-strategist proposed independently as Fix #5** — convergent finding from two different angles. Highest confidence: this is the missing thing.

Suggested copy (draft, not final):
> Two stages, side by side. Light is paper — Mercury and Stripe Press. Dark is night-focus — Linear-shadow restraint. Forest-jade reads only on status, citation, and verified. Bronze on warning, drift, danger. Ink carries the signature.

That paragraph is what makes the page feel like an editor laid it out, not like a renderer iterated over a list. It is the single missing Granola/Mod/Mercury signature.

### Missing element #2 (medium impact) — **The «paper-physical» moment**

Every positive anchor has a **single moment of physical-paper texture** — not as ambient surface treatment, but as one detail: Patagonia's tag-fold, Mod's printed-page deckle, Mercury's card-shadow, Granola's pen-mark. The Provedo design system has a **«pen-mark» drift indicator** spec'd in the design system v1.1 doc (referenced in tactile-shift-brand-strategist L75 as already-existing) — but the showcase doesn't render it as a visible moment. The drift indicator is mentioned in copy («drifted 3.2% from target») but not depicted as a visual texture.

This is the «paper-physical» moment that turns the page from «design system catalogue» into «inhabited brand world». Without it, every positive anchor's signature texture is missing.

### Missing element #3 (low impact) — **Section-level eyebrow editorial annotation**

The static reference's `meta` chips on each section carry brand-voice editorial annotations («tactile preserved», «paper lift», «primary = ink (not green)», «inset + ink-on toggles»). The React port preserves these mostly — but they're rendered in the same mono register everywhere, which loses the «editor wrote these annotations by hand» feeling. Each annotation could carry a tighter, McPhee-register one-liner.

This is convergent with brand-strategist's note about «curation feeling is mostly there».

---

## Section 4 — Top-3 taste-fit recommendations

Ranked by **impact on PO's «mало изменилось» complaint**.

### Recommendation #1 — Add the editor's-voice paragraph (highest impact)

**Action:** Insert one 13px McPhee-register paragraph between page header and Stage 1 in `page.tsx`. Convergent with brand-strategist Fix #5.

**Why it changes PO's read:** the page currently opens like documentation. Adding one editor's voice line shifts the read from «catalogue» to «curated showcase». This is the single largest delta in the «paper-coded» direction without changing any tokens or components.

**Copy proposal:** see above (Missing element #1).

### Recommendation #2 — Verify the production `Button` consumes `--shadow-primary-extrude`

**Action:** Audit `packages/ui/src/Button/Button.tsx` (per product-designer brainstorm Fix D). If the primary variant doesn't render with `--shadow-primary-extrude` + radius 14px + transform on hover/press, the entire «Mercury / Stripe Press tactile-at-instrument-only» language is invisible — and the SignatureHero's instrument moment muffles into «flatter cousin of the static reference».

**Why it matches taste:** Stripe Press / Mercury / Granola all have **one tactile moment per page** (the primary CTA). If our one moment is muffled, we lose the brand-cousin match completely. This is the load-bearing single component for the «paper-coded but tactile at instrument» taste signal.

### Recommendation #3 — Restore placeholder labels in Primitives row

**Action:** Replace `Get early access` × 3 with `Primary` / `Primary` / `Primary` (per brand-strategist Fix #2).

**Why it matches taste:** every paper-coded anchor (Mod, Wirecutter, Economist, Patagonia) **never repeats the same marketing line three times**. Repetition is the Robinhood / Cialdini pressure register that the voice doc explicitly excludes. Smallest change, biggest semantic delta in the «not Headspace, not Robinhood» direction.

---

## Section 5 — Brainstorming alternatives record (per `superpowers:brainstorming`)

Five alternative directions PO could take with the showcase voice today, judged for taste-fit:

1. **Add MORE real-product copy everywhere** — replace remaining placeholder labels with marketing CTAs across all primitive rows. **REJECTED** — convergent with brand-strategist analysis: real-product copy backfires when used as filler. Three «Get early access» across 600px = pressure register, NOT Sage-restraint. PO's taste anchors all reject pressure.

2. **Adopt a fully editorial frame (full Wirecutter-format)** — wrap each section in a printed-magazine column with deck/kicker/body and serif body type. **REJECTED** — Provedo locked Geist (sans-serif geometric). The «editorial» reading must come from rhythm and restraint, not from font-family. Going serif breaks the locked design system.

3. **Add a single editor's-voice paragraph after the page header (CHOSEN)** — 13px, McPhee-register, names the design language out loud. Reads as «one editor laid this out». Convergent with brand-strategist Fix #5. Smallest change with largest taste-fit delta.

4. **Restore static-HTML placeholder labels (CHOSEN)** — Primary × 3 for size demonstration. Convergent with brand-strategist Fix #2. Removes Cialdini-pressure drift.

5. **Re-tone the Lane A badge** — Lane A is a positive trust signal in positioning; rendering as `tone="negative"` is a direct semantic contradiction. **NOT chosen as a taste-fit recommendation** because it's a semantic correction, not a taste-anchor mismatch — but PO should know it's there. Convergent with brand-strategist Fix #3.

The chosen alternatives (#3 + #4) plus the Button-extrude verification (Recommendation #2) are the smallest combined change set with the largest «feels more like the brands PO actually loves» delta. None requires palette / typography / shadow token changes.

---

## Section 6 — Outstanding for brand-voice-curator role

This audit reverse-engineered the corpus from secondary docs. To meet the role's primary mandate:

- Seed `docs/product/BRAND_VOICE/REFERENCES_LIVING.md` with the 8 positive + 6 negative anchors above as the formal corpus.
- Seed `docs/product/BRAND_VOICE/VOICE_PROFILE.md` with the derived patterns (paper-coded baseline · single tactile moment per surface · McPhee-cadence verbs · no Cialdini repetition · forest-jade only on status/citation/verified · bronze only on warning/drift/danger).
- Ask Navigator to surface to PO: «do these 14 anchors match your actual taste, or is something missing/wrong?» — the corpus has never been validated by PO directly. Per role threshold (10+ / 5+), we need PO to confirm or add 2 more positives to reach 10+5.

Marked here for next session — out of scope for this audit deliverable.

---

## Files cited

- `docs/product/02_POSITIONING.md`
- `docs/reviews/2026-04-27-tactile-shift-brand-strategist.md`
- `docs/reviews/2026-04-27-tactile-shift-content-lead.md`
- `docs/reviews/2026-04-27-design-direction-depressed-ui.md`
- `docs/reviews/2026-04-29-visual-brainstorm-brand-strategist.md`
- `docs/reviews/2026-04-29-visual-brainstorm-product-designer.md`
- `apps/web/src/app/design-system/page.tsx`
- `apps/web/src/app/design-system/_components/SignatureHero.tsx`
- `apps/web/public/design-system.html`

---

**End of audit.** Read-only. Zero code modified. R1 / R2 / R4 respected (no predecessor naming used).
