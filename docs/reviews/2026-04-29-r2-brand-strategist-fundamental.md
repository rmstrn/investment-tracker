# Round-2 Fundamental Review — brand-strategist angle

**Date:** 2026-04-29
**Author:** brand-strategist (Round-2 dispatch — fundamental angle)
**Trigger:** PO «устал повторять, очень мало изменилось». Round-1 surface fixes (commits d8d7c62 loud-quiet rebalance, 407b064 donut centerLabel, neumorphism polish, 8 per-chart) shipped. PO says the brand-identity needle didn't move.
**Question:** is the whole brand expression failing, and why? Not «change CTA copy» — «is Provedo viscerally recognisable in the showcase as Provedo and nothing else?»

---

## TL;DR (for Right-Hand)

**Round-1 was symptom-treatment.** I flagged 5 surface findings (triple-tagline, 3× CTA, Lane A bronze, eyebrow word loss, motion-toggle verbs) and they all got fixed. PO sees «very little changed» because the brand-identity needle doesn't move at the surface — it moves at the **frame**.

The showcase still reads as «documentation chapters indexed by category» (Foundation → Primitives → Forms → Cards → Charts). That structural rhythm is the brand failure. Magician + Sage archetype demands **one inhabited room with one editorial story** — like a Patagonia field guide, a McPhee New Yorker piece, a Stripe Press chapter opener. Each of those references reveals the world through one specific scene, not through a category catalog.

**Iteration trap:** we were sanding the corners of the wrong shape. PO's frustration is structural, not cosmetic.

**ONE visual signature recommendation:** the **Hero Ledger** — a single full-bleed editorial composition at the top of the showcase that IS Provedo: cream-paper card, 56-72px Geist headline, mono date-line, a real numeric ledger row (`$184,210 · IBKR · LYNX · +$4,420 week · NVDA flagged`), a single jade citation glyph next to one number, and a one-sentence Sage-voice annotation underneath in 13px text-2. No CTA. No nav-anchor. Just the moment. Everything else in the showcase becomes the supporting catalog.

**Anti-positioning current trap:** still **Bloomberg Terminal** — but now it's structural (documentation register), not surface (CTA pressure). Round 1 reduced surface Bloomberg-ness; Round 2 must address structural Bloomberg-ness.

---

## Brainstorming — 5 fundamental brand directions × alternatives

### Direction 1 — Is Magician + Sage + Everyman archetype actually visible anywhere?

**Diagnosis:** archetype lives in `02_POSITIONING.md` as words. In the showcase it lives in **two surfaces** (insight card «pattern across accounts», forms section voice). Everywhere else the archetype is **absent or contradicted**.

What does Magician archetype VISUAL DESIGN look like in finance? Not «sparkle effects». It's the **moment of revelation** — Sherlock Holmes pointing at the thing on the table, McPhee describing the trout in the riffle, Patagonia showing the patched jacket. In data UI: Bloomberg's red blink (wrong archetype but right mechanic — eye drawn). Notion's one-line answer that dissolves the question. Linear's «issue closed in 0ms» moment.

| # | Alternative | What it would look like | Verdict |
|---|---|---|---|
| 1a | **Annotation reveal** — pencil-mark style annotation appears next to a numeric (e.g. `$184,210` with a Sage-voice marginalia «↳ NVDA shows up in 3 of these accounts») | Magician archetype landed visually; Sage voice in margin | **STRONG — recommend as core mechanic** |
| 1b | **Crossing-out reveal** — the showcase displays a wrong number, then quietly strikes through and shows the corrected one (memory-archetype: «I corrected what you would have missed») | Too clever — reads as gimmick; risks looking like a cheap dataviz toy | Reject |
| 1c | **Citation-glyph as primary signature** — every numeric gets a Lucide-sparkle citation mark (forest-jade, 12px, click reveals source) — ubiquitous, brand-owning | Magician («I show my work») + Sage («I cite») + Everyman (clickable, accessible) all in one signature | **STRONG — recommend as supporting motif to 1a** |
| 1d | **Slow-fade insight** — insight card content fades in over 400ms with a single-line eyebrow «Provedo noticed» | Easy fix; reads as «late-loaded content», not «revelation» | Reject |
| 1e | **Status quo (current)** — bold-weight accent words (no colour). Brand-strategist v1.1 lock §13.4 ban on colour emphasis | Defensive (avoids billboard-trap) but doesn't ACTIVELY express the archetype | Insufficient — what we have today |

**Pick:** **1a + 1c combined.** Annotation reveal as the dominant visual signature, citation glyph as the ubiquitous supporting motif. Both express «Notice what you'd miss» and «Provedo cites» without any single-word colour emphasis.

### Direction 2 — Is Provedo differentiated from Wealthfront / Morningstar / Bloomberg / Robinhood?

**Diagnosis:** Provedo is **distant** from Robinhood (no gimmicks) and **distant** from Wealthfront (no robo-pastel). Provedo is **dangerously close** to Bloomberg-documentation register and **modestly close** to Morningstar-as-encyclopedia register. The «cream-paper + ink» lift puts us in nominally distinct territory, but the layout rhythm (section after section after section, all uniform) is structurally identical to Morningstar's research-page rhythm.

| # | Alternative | What it would look like | Verdict |
|---|---|---|---|
| 2a | **Editorial spread (Patagonia / Craig Mod / NYT Magazine)** — full-bleed hero, hand-curated 2–3 narrative beats per page, asymmetric layout | Strongest brand differentiation; matches v1.1 reference shorthand «Mercury × Stripe Press × Linear-shadow» | **STRONG — recommend** |
| 2b | **Single-screen poster (Apple keynote)** — every showcase section is a full viewport with one idea | Loud; risks Vercel-billboard territory; v1.1 §13.4 anti-pattern flagged | Reject |
| 2c | **Bento composition (Linear / Vercel-but-restrained)** — irregular grid, varied tile sizes, density gradient | Modern but reads «another SaaS landing»; cream-paper saves it but only just | Defer — could work for landing page later, NOT for showcase |
| 2d | **Field guide (Patagonia, Bloomberg Businessweek long-form)** — chapter-style with editorial pull-quotes | Closest to Sage-Magician core | **STRONG — recommend as showcase structure** |
| 2e | **Status quo (catalog)** — Foundation → Primitives → Forms → Cards → Charts | Documentation register; structurally Bloomberg-Terminal-adjacent | What we have — REJECT for showcase identity |

**Pick:** **2a + 2d (editorial spread + field-guide chaptering)** — Hero Ledger up top (editorial spread), then 2 chapters with editorial transitions instead of 5 categorical sections.

### Direction 3 — Is «cream-paper + ink + jade + terra» the right canvas?

**Diagnosis:** the palette is locked at v1.1 (PO sign-off after 17+-surface fatigue measurement on teal-CTA). It is the right canvas. **The palette is not the brand failure.** Re-opening it would burn 2 weeks of work and add zero brand-identity gain. PO directive 2026-04-27 «dark mode in first release» also locks two-territory split. **Hold the palette. Move the layer above it.**

| # | Alternative | What it would shift | Verdict |
|---|---|---|---|
| 3a | **Hold v1.1 palette as-is** | Zero shift; correct call | **CHOSEN — no change** |
| 3b | Re-open palette, push toward Stripe Press serifed serif body | Would force Geist re-decision (already locked v1.1 drift #1+#2); reopens ~2 weeks of work | Reject — wrong layer |
| 3c | Add a third accent for «Provedo signature» (e.g. ink-tinted cream highlight) | Risks bronze + jade + new = three accents = visual noise | Reject |
| 3d | Push palette darker (closer to Linear-default) on dark stage | Would lose the «cream-paper light, neutral cool dark» two-territory composition | Reject |
| 3e | Lighten cream bg further to read more «museum» | Would re-open Round-6 luma fix (already deepened 5 luma units to fix 1.17:1 → 3:1 card-bg delta) | Reject |

**Pick:** **3a — hold v1.1 palette.** The brand-identity needle doesn't move from palette work.

### Direction 4 — What ONE visual signature would PO viscerally recognise as «THIS is Provedo»?

**This is the central question.** Static reference's signature is the «Notice what you'd miss» tagline + the 2px ink-rule under stage heads + the cream-paper. None of those alone is enough — the static is recognisable only because all three compose into one moment.

The React showcase has all three but **diluted across 5+ sections**. There's no single «THIS is Provedo» moment to anchor recognition. PO's eye has nothing to land on.

| # | Alternative — what one moment | Magician test | Sage test | Everyman test | Verdict |
|---|---|---|---|---|---|
| 4a | **Hero Ledger** — full-bleed cream card, 56-72px Geist headline, real numeric row (`$184,210 IBKR · LYNX +$4,420 week`), one citation glyph next to one number, one Sage-voice annotation in margin, no CTA | YES — the annotation is the «I noticed what you'd miss» moment | YES — citation + Sage marginalia | YES — real money, real broker name, no jargon | **STRONG — recommend** |
| 4b | **Concentration reveal** — donut chart with one segment subtly enlarged, paired with «18% across 3 accounts» Sage callout | YES — visual «here's the thing hiding» | YES — donut as Sage instrument | Partial — donut requires explanation | Strong but already partially implemented; not unique enough |
| 4c | **Insight card stacked carousel** — 3 insight cards in editorial composition (vs 1 today), Magician headline pattern «A pattern across X / A drift in Y / A signal from Z» | YES — repetition forms a brand pattern | YES — Sage observations | YES — clear structure | Strong but volume-y; risks billboard register |
| 4d | **Numeric typography signature** — every numeric in the entire showcase rendered with the Provedo «numerals» pattern (Geist tabular nums, `tnum 1`, citation glyph, em-dash separators `$184,210 · 12.4% · 142 lots`) consistently | YES — every number is a Sage-cited fact | YES — Sage-rigour | Partial — requires consistent application | Strong supporting motif; doesn't anchor on its own |
| 4e | **Marginalia layout** — every section has a left-margin column of mono editorial annotations explaining the design decision in Provedo voice (like a Tufte sidenote) | YES — makes Sage commentary visible | YES — explicit | Partial — meta-y for non-designers | Reject for product-facing screens; potentially great for showcase only |
| 4f | **Status quo (signature line repeated, bold accent word)** | Insufficient — Round-1 already showed PO this isn't enough | Sufficient | Sufficient | What we have — INSUFFICIENT |

**Pick: 4a Hero Ledger** is the answer. It demonstrates archetype + voice + numeric typography + citation in one composition. Implement once at the top of the showcase; everything else becomes supporting catalog.

### Direction 5 — Are we expressing «Lane A» (anti-advice) DISTINCTIVELY?

**Diagnosis:** Lane A appears in the showcase as (a) a footer disclaimer (locked) and (b) a Lane A radio button (now toned positive after Round 1). That's it. **Lane A is positioned in `02_POSITIONING.md` as a positive trust signal — «we are not selling you anything» — but the showcase doesn't visually encode the anti-advice stance.** It's words, not visual grammar.

What would visual anti-advice look like? Anti-patterns of fintech competitors:

| # | Visible anti-pattern | What competitors do | What Provedo could do |
|---|---|---|---|
| 5a | **No «Buy» button language anywhere** | Robinhood: prominent green «Buy» CTAs | Provedo: every CTA verb is observe / explain / surface — never act |
| 5b | **No green-up / red-down semantic colour** | Bloomberg, Robinhood, Yahoo Finance | Provedo: forest-jade for VERIFIED / CITED / SUCCESS only — NEVER for `+` deltas. Bronze for DRIFT / WARNING — NEVER for `-` deltas. Use ink + sign + iconography for gain/loss. **THIS IS LOCKED IN PALETTE BUT NOT VISIBLY ENFORCED IN SHOWCASE.** |
| 5c | **Candlestick prominence** | Every fintech tracker | Provedo: line + area + sparkline only. Candlestick is a trader's instrument; Provedo is a memory tool. |
| 5d | **No «recommend» or «suggest» verbs** | PortfolioPilot, Origin, Mezzi | Provedo: reads / observes / notices / surfaces / explains. Locked at TD-099 verb list. |
| 5e | **No score / rating / ranking** | Morningstar, Simply Wall St | Provedo: never `★★★★☆ Buy rating`. Display facts; the user decides. |
| 5f | **Citation glyph next to every numeric** | None do this | Provedo signature opportunity — every fact has a source. Lane A made visible. |

**Pick:** **5b + 5f are the highest-leverage anti-advice visual moves.** 5b means auditing the showcase for any green-up/red-down accidents (memory says portfolio gain is locked to forest-jade in §10.2 — verify it's not in showcase). 5f promotes the citation glyph from «sometimes used» to «every numeric in the showcase has one», which IS the anti-advice signature: «here's the data, here's where it came from, you decide».

---

## Anti-positioning current trap (refresh from Round 1)

| Anti-position | Round 1 distance | Round 2 distance | Trend |
|---|---|---|---|
| Robinhood | Far | Far | Held |
| Mint | Far | Far | Held |
| **Bloomberg Terminal** | **Moderate-close (surface CTA-pressure + section-after-section)** | **Moderate-close (structural — section catalog rhythm)** | **Round 1 fixed surface; structural drift remains** |
| **Morningstar (research encyclopedia)** | Not flagged in Round 1 | **Moderate** | **NEW concern — sectional documentation register puts us adjacent to research-page Morningstar** |
| Wealthfront / Personal Capital (robo-pastel) | Far | Far | Held |
| Yieldstreet (alternative-asset density) | Far | Far | Held |
| Carta (institutional dashboard sterility) | Moderate | Moderate | Unchanged — we share «restrained corporate» aesthetic |

**Closest current trap: Bloomberg Terminal — STRUCTURAL.** The five `<DsSection>` slabs (Foundation → Primitives → Forms → Cards → Charts) are a documentation-engineer's mental model of a design system. Bloomberg's terminal has the same rhythm: panel-after-panel, all uniform, density-by-numbers. Provedo's Magician + Sage archetype must break this. **A field-guide / editorial-magazine / Stripe-Press chapter structure is what the showcase needs.**

**Secondary concern: Morningstar drift.** The cream-paper + research-style typography puts us visually adjacent to Morningstar's stock-research pages. The cure is the same as Bloomberg cure: editorial composition, not categorical catalog.

---

## STEPPS audit (`marketing-cro:contagious` — Berger)

If a designer showed this showcase to a peer at 2026-04-29 — would they remember it? What would they remember?

| STEPPS criterion | Pass / Fail | Evidence | What would shift it |
|---|---|---|---|
| **Social currency** — does sharing this make the sharer look good? | **FAIL** | A designer sharing this with a peer says «it's a clean fintech design system». Generic. They get no status from sharing. | Hero Ledger as one specific recognisable composition would give the sharer a hook («look at this Provedo Hero Ledger pattern») |
| **Triggers** — what in everyday life makes you remember Provedo? | **FAIL** | Nothing in the showcase ties to a daily memory cue. «Notice what you'd miss» is a phrase, not a trigger. | The annotation-reveal mechanic + citation glyph become triggers — every time you see a number cited in someone else's product, you remember Provedo did it first |
| **Emotion** — does it produce high-arousal feeling? | **FAIL (intentional?)** | Provedo voice is calm, Sage. High-arousal isn't the goal. But ZERO emotion is also a fail — there should be quiet awe at the «pattern revealed» moment. Currently absent. | Hero Ledger's annotation reveal — the moment of «oh, of course, NVDA in 3 accounts» — is the quiet-awe beat |
| **Public** — is the brand visible when someone else uses Provedo? | **PARTIAL** | Real-product copy in forms / cards is recognisable. The cream-paper + 2px ink-rule is recognisable. | Hero Ledger composition + citation glyph become Provedo's visible-in-screenshots signature |
| **Practical value** — does the showcase teach the viewer something useful? | **PASS** | Real Provedo copy throughout, real broker names, real numerics. A designer learns «this is how a Lane A finance product writes». | Hold |
| **Stories** — does it embed the brand in a narrative? | **FAIL** | Five categorical sections don't form a story. «The user opens Provedo on Monday morning and sees X» — that story is not told. | Field-guide / editorial structure with a single narrative arc through the showcase |

**STEPPS scorecard: 1 PASS, 1 PARTIAL, 4 FAIL.** A designer will not remember this showcase 48 hours later. **That is the brand-identity needle that didn't move in Round 1.**

---

## Top-3 FUNDAMENTAL brand-identity changes

### Change #1 — Replace the section-catalog with a field-guide structure (HIGHEST IMPACT)

**Current:** five `<DsSection>` slabs per stage, each titled categorically (Foundation, Primitives, Forms, Cards, Charts). Rhythm: documentation index.

**Change:** restructure each stage into 2 chapters with editorial chapter-titles in Provedo voice:

- **Chapter 1: «What you'd notice first»** (renamed from Foundation + Signature Hero)
  - Replaces the Foundation section's color/type/shadow grids with an embedded Hero Ledger (see Change #2) that demonstrates color, type, shadow, and ink-CTA simultaneously through real product scene rather than through sterile token grids.
  - Token grids remain but DEMOTED to a collapsible «Token reference» appendix at the end of the chapter, not the page-opener.

- **Chapter 2: «What it does on real holdings»** (renamed from Primitives + Forms + Cards + Charts)
  - One narrative composition showing: a search bar query → a chart answer → an insight card with citation → a primitive button trail. ONE scene, not four sections.
  - Charts integrated as part of the answer flow, not as a chart catalog.

This is the **structural Bloomberg-Terminal cure**. PO's «very little changed» signal goes here.

**Risk:** product-designer may push back — categorical organisation is documentation-engineer-canonical. Counter-argument: the showcase IS the brand artefact PO is judging, not the dev reference. Keep the dev reference as a separate doc if needed.

### Change #2 — Build the Hero Ledger as the single visual signature

**Current:** SignatureHero card has eyebrow + 40px tagline + sub + 2 CTAs. Same pattern any landing page uses. Forgettable.

**Change:** redesign SignatureHero into the Provedo Hero Ledger composition:

```
[full-bleed cream card · 18px radius · shadow-lift]

PROVEDO · 2026 W17 · MONDAY MORNING                              [eyebrow mono 10px text-2]

A pattern  across  your accounts.                                [56-72px Geist semibold,
                                                                   bold weight on "across"]

$184,210                                                          [56px Geist tabular tnum]
IBKR · LYNX  +$4,420 week  · 12 positions   ✦                     [13px text-2 + jade citation]
                                                                       └────── source: SnapTrade · 2 min ago

Provedo noticed: NVDA appears in 3 of these accounts. Combined exposure 18% — concentrated more than it looks broker-by-broker.   [13px Sage marginalia]

                                                  [ See the pattern → ]   [no primary CTA pressure]
```

Key elements:
- **One real numeric** (the $184,210) as primary type-anchor, with tabular numerals
- **One citation glyph** next to that number (forest-jade, click reveals source)
- **One Sage-voice annotation** in margin/below explaining what was noticed
- **No primary CTA** — only a subtle ghost link («See the pattern →»)
- **No tagline-as-tagline** — the headline IS the observation, not a marketing line

This is the visual moment a peer designer would screenshot and share. STEPPS Social Currency + Triggers + Public all activate here.

**Risk:** «no primary CTA» fights conventional landing-page wisdom. Counter-argument: the showcase is for designers / PO judgment, not conversion. Production landing CAN have a CTA later; the showcase signature should not.

### Change #3 — Promote the citation glyph to ubiquitous brand signature (Lane A made visible)

**Current:** citation glyph (Lucide-sparkle / asterisk-mark) appears nowhere in the showcase. It's specced in PROVEDO_DESIGN_SYSTEM_v1.md §3.1 as «citation» but no visible surface uses it.

**Change:** every numeric in the showcase gets a citation glyph (forest-jade, 12px, click reveals SnapTrade / Plaid / source). This is:

- **The single most distinctive Provedo move** — no fintech competitor cites every numeric. Bloomberg cites tickers; Morningstar cites methodologies; Robinhood cites nothing. Provedo cites every fact.
- **Lane A made visible** — «we cite, we don't recommend» is the anti-advice stance rendered as visual grammar, not just footer disclaimer.
- **Magician + Sage archetype unified** — «I show what you'd miss, and I show you where it came from». Both archetypes in one motif.

Implementation cost: one `<Citation>` primitive in `packages/ui` + apply to ~20 numerics in showcase. Low effort, highest brand-identity yield.

**Risk:** visual density. Mitigation: glyph is 12px forest-jade, hover-only tooltip. At rest it reads as a quiet punctuation mark.

---

## Iteration trap diagnosis — why didn't Round 1 move the needle?

Round 1 fixed five surface findings:
1. Triple-tagline → single
2. 3× «Get early access» → varied
3. Lane A bronze → positive
4. «Refined» word restored → editorial frame returned
5. Motion toggle verb → softened

Each fix was correct. **None addressed the structural frame.** PO's eye was reading the showcase as «documentation index slabbed by category», and that frame wasn't touched. Sanding the corners while the shape stays catalog-shape produces «very little changed» — because the visual identity is set by the silhouette, not the corner-radius.

**The trap:** brand-strategist Round 1 was operating in surface mode (find specific bad copy / mistoned badge / dilution). Round 2 must operate in frame mode (the showcase IS the brand artefact; its STRUCTURE is the brand identity, not its decorations).

**Translation for Right-Hand:** the next dispatch is not «find more bad copy». It's «restructure the showcase into a 2-chapter editorial composition with a Hero Ledger as the opener». That's a product-designer + frontend-engineer dispatch, scoped from this brand-strategist Round-2 spec, not another brand-strategist surface audit.

---

## What I would recommend Right-Hand dispatch next

**Scope:** Hero Ledger composition spec + 2-chapter restructure spec.
**Owner:** product-designer (lead) with brand-strategist co-review on voice/citation glyph.
**Target:** one editorial composition replaces SignatureHero; sections collapse to 2 chapters with editorial transitions; citation glyph applied to ~20 numerics.
**Out of scope:** palette work (locked v1.1), typography work (locked v1.1), token additions (use existing).

**Expected PO read:** «THIS feels like Provedo».

---

## Appendix — files cited

- `apps/web/src/app/design-system/page.tsx` — current 5-section structure
- `apps/web/src/app/design-system/_components/SignatureHero.tsx` — current hero (replace with Hero Ledger)
- `apps/web/src/app/design-system/_sections/{foundation,primitives,forms,cards,charts}.tsx` — current 5 categorical sections (collapse to 2 chapters)
- `docs/product/02_POSITIONING.md` — archetype + Lane A + tone
- `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` — palette / type / citation glyph spec
- `docs/reviews/2026-04-29-visual-brainstorm-brand-strategist.md` — Round 1 surface findings (now diagnosed as insufficient)
- `docs/reviews/2026-04-29-visual-brainstorm-aggregate.md` — Round 1 aggregate synthesis

R1 / R2 / R4 / no-velocity respected. Read-only audit, zero code modified.
