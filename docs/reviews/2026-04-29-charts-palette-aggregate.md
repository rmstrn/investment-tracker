# Charts palette — multi-specialist brainstorm aggregate

**Date:** 2026-04-29
**Process:** CONSTRAINTS.md Rule 3 — real parallel multi-agent dispatch (3 specialists, isolated contexts, brainstorming + research stack)
**Synthesised by:** right-hand
**PO trigger:** «думаем и хорошо» (PO greenlit the brainstorm)

---

## PO question (verbatim)

> «почему мы не можем взять один цвет и его оттенки, от насыщенного к менее, где это применимо. в противном случае подумать над палитрой».

PO leans toward **monochromatic ramp** by default but is open to a full palette redesign. Specifically dissatisfied with current DonutChart's per-slice unrelated colors — feels unmotivated.

---

## Specialists dispatched (parallel, isolated)

| Specialist | Lens | Skill stack |
|---|---|---|
| product-designer | data-viz palette as part of design-system | brainstorming + deep-research + exa-search + documentation-lookup + design-system + refactoring-ui + ux-heuristics + frontend-design + accessibility |
| brand-strategist | palette as brand identity (calm-analytical caretaker, not casino-trading) | brainstorming + deep-research + exa-search + market-research + brand-voice + obviously-awesome + storybrand-messaging |
| finance-advisor | finance data-viz conventions (gain/loss semantic, ordinal vs categorical) | brainstorming + deep-research + exa-search + market-research + documentation-lookup + financial-analyst + saas-metrics-coach + business-investment-advisor |

---

## Per-specialist scorecard

### product-designer
- **Verdict on options:** A SUPPORT (compositional charts) · B REJECT · C SUPPORT · D REJECT · added **E** (mono-ramp-as-default + named-hue family override) SUPPORT.
- **Recommendation:** **C + E hybrid**. Donut/treemap/single-series area → forest-jade monochromatic ramp (7 L-steps OKLCH, ΔL ≥ 0.07 deuteranopia-safe). Diverging charts → jade↔bronze with neutral grey midpoint. Categorical ≤3 → locked jade/bronze/ink trio.
- **Concrete proposal:** OKLCH jade ramp, hex provided for both light and dark themes, per-chart-kind mapping for all 11 kinds.
- **Cap on cardinality:** mono ramp at 6 slices + Other (one tighter than current 7).

### finance-advisor
- **Verdict on options:** A WARN (only ordinal/sequential — fails for unordered categorical) · B REJECT · C SUPPORT (strongest) · D REJECT.
- **Recommendation:** **C (Hybrid)**. 3 axes (direction × magnitude/order × cardinality) — no single mode serves all. Hybrid: brand-aligned semantic (jade=positive, bronze=negative — already Provedo-locked) for sign-bearing; monochromatic jade ramp for ordinal/sequential (allocation-by-weight, treemap weight, heatmap); categorical 7-hue series palette (CHARTS_SPEC §2.2) for unordered ≤7 categories.
- **Critical call:** **REPLACE green/red P&L with jade/bronze, redundantly encoded.** Industry-standard green/red worst pair for deuteranopia (~6% of males). Bloomberg uses blue/orange.
- **Per-chart mapping:** Donut **categorical** (max 7); monochromatic only when explicitly magnitude-ordinal.

### brand-strategist
- **Verdict on options:** A WARN (technically wrong for unordered nominal data; burns forest-jade 13-surface cap §13.2) · B REJECT · C SUPPORT · D REJECT · added **E (editorial museum-palette)** SUPPORT.
- **Recommendation:** **C with E embedded as the categorical layer.** Default chart hue = **ink/cream tonal ramp**, NOT forest-jade. Forest-jade and bronze stay reserved for their semantic roles. When true categorical encoding is required (≥4 unordered asset classes), draw from a desaturated «museum-vitrine» extension family (deep slate, paper-stone, fog-blue, dusty plum, muted ochre — ≥40% chroma reduction).
- **Critical caveat:** mono jade ramp would breach Provedo §13.2 «13-surface cap» — chart series alone could exceed budget; «accent everywhere = accent nowhere».
- **Sources cited:** Morningstar Design System (the wealth-data canon — uses multi-hue categorical for asset class), Atlassian + ColorArchive + CleanChart (sequential palette on nominal data «throws information away»), Wealthfront (3-color tight core, charts kept tonal), Bazley/Cronqvist/Mormann SSRN (red suppresses risk-taking 15-30%), Datawrapper/Lisa Charlotte Muth (gray as most important data-viz color).

---

## Agreement / disagreement matrix

| Decision point | product-designer | finance-advisor | brand-strategist | Consensus |
|---|---|---|---|---|
| Hybrid is the answer (C) | SUPPORT | SUPPORT | SUPPORT | **YES (3/3)** |
| Reject 3-color (B) | REJECT | REJECT | REJECT | **YES (3/3)** |
| Reject full reset (D) | REJECT | REJECT | REJECT | **YES (3/3)** |
| Replace green/red P&L with jade/bronze | (implicit support) | EXPLICIT SUPPORT | EXPLICIT SUPPORT | **YES (3/3)** |
| Default chart hue = forest-jade ramp | YES | (sometimes — when ordinal) | **NO — ink/cream** | **DISAGREEMENT** |
| Mono ramp for Donut allocation | YES (always) | (only if magnitude-ordinal) | **NO — burns 13-cap** | **DISAGREEMENT** |
| Categorical mode for unordered data (asset class, sector) | locked trio (jade/bronze/ink) | 7-hue palette CHARTS_SPEC §2.2 | **NEW museum-palette extension (slate/ochre/plum/fog-blue/paper-stone)** | **DISAGREEMENT** |
| Forest-jade «13-surface cap» (§13.2) is binding constraint | not flagged | not flagged | **flagged as critical** | **DISAGREEMENT** (only brand-strategist surfaced) |

### The substantive split

**product-designer says:** ramp the forest-jade. It's brand-aligned, OKLCH-correct, deuteranopia-safe. Donut becomes a monochromatic jade gradient sorted descending by value. Beautiful.

**brand-strategist says:** stop. Forest-jade is brand floor with §13.2 «13-surface cap» — using it as a chart ramp blows the budget on charts alone. Accent everywhere = accent nowhere. Industry canon (Morningstar, Atlassian, ColorArchive) treats unordered categorical (asset class) as **categorical** — sequential on nominal data implies false ranking. Default chart hue should be **ink/cream tonal** (Bloomberg, FT, Datawrapper editorial register); jade stays reserved.

**finance-advisor sits closer to brand-strategist:** «mono ramp WARN — only ordinal/sequential». For unordered categorical (asset class, broker, sector), **categorical** mode wins. Donut palette mode depends on whether the data is ordinal-by-magnitude OR unordered.

So the real tension is on **the donut and on whether forest-jade ramp is a permitted move**. 2 of 3 specialists say no to the forest-jade ramp. 1 of 3 (brand-strategist) is the only one who flagged the §13.2 cap as a binding rule.

---

## Risks each surfaced (deduplicated)

1. **Brand-cap breach (§13.2).** Forest-jade ramp through chart series violates the 13-surface cap. Brand-strategist only.
2. **Sterile/clinical-cold drift.** Pure mono-ink charts can read as "hospital chart" without rescue (editorial typography + tactile depth + rare semantic accent). Brand-strategist.
3. **Lane-A action-cue risk.** Saturated jade-positive may read as «buy signal» in retail UI. Finance-advisor.
4. **Color-blind risk on diverging palettes** (jade↔bronze on small tiles loses hue under deuteranopia at low saturations). Finance-advisor.
5. **Ordinal-meaning misread on donut categorical.** Users may infer ordinal ranking from arbitrary slice colors → require legend sorted by magnitude. Finance-advisor.
6. **Showcase regression.** DonutChart in `/design-system#charts` currently renders v1.1 §4.4 mixed-hue order. Any change re-opens visual diff PR; chart-tests checkpoint β.1.4 (commit 109e4de) needs snapshot refresh. Product-designer.
7. **AI-agent prompt churn.** Backend must learn that `donut.color` per-slice override is rare; default ramp/categorical is the answer. Without prompt update, agent keeps shipping mixed palettes. Product-designer.
8. **Cap-7 distinguishability.** Mono ramp at 7 slices loses last-step hue distinguishability; cap at 6 + Other. Product-designer.
9. **Casino-trading register leak** if saturated semantic green/red replaces jade/bronze. Brand-strategist.
10. **Industry-canon mismatch.** Morningstar (wealth-data canon) uses multi-hue categorical for asset class; pure mono ramp puts Provedo against canon. Brand-strategist.

---

## One weighted recommendation (right-hand synthesis)

**ADOPT Option C (Hybrid) with brand-strategist's «museum-palette» extension as the categorical layer, NOT forest-jade ramp as default chart hue.**

### Rationale

The PO's intuition — «monochromatic ramp where applicable, otherwise reconsider» — was **correct in spirit**: the ad-hoc multi-hue donut should go. But the 2-of-3 specialist consensus (brand-strategist + finance-advisor) is that **the right replacement is not «ramp the forest-jade»**, because:

1. **§13.2 brand-cap.** Forest-jade is brand floor with a hard 13-surface cap. Charts alone could exceed it. Brand-strategist's flag is binding — overrides product-designer's optimism.
2. **Data-viz canon.** Sequential palette on **unordered** nominal data (asset class, sector, broker) implies false ranking. Industry canon (Morningstar = wealth-data benchmark, Atlassian, ColorArchive) treats this as a categorical encoding, not sequential. Finance-advisor agrees.
3. **Editorial register.** Bloomberg, FT, Datawrapper, Wealthfront — the «calm-analytical caretaker» reference set — lead with **ink/cream/grey tonal** charts and use color rarely. Reserving jade for its semantic role (verified / accent / gain) is what makes it earn attention.

### Per-chart-kind palette mode (synthesised across all 3 specialists)

| # | Chart | Default mode | Color family | Rationale |
|---|---|---|---|---|
| 1 | Line | Single series → ink accent; multi-series ≤4 → museum-categorical | ink → museum-palette (slate/ochre/fog-blue/plum) | Tonal default; categorical only when truly multi-series |
| 2 | Area | Cumulative P&L sign-bearing | semantic jade above 0 / bronze below 0 | Already locked |
| 3 | Bar (drift) | Diverging | jade ↔ neutral grey ↔ bronze | Sign-bearing |
| 4 | **Donut** | **Categorical** for unordered (asset class, broker); **ink tonal ramp** for ordinal-by-magnitude | museum-palette OR ink ramp | Type-of-data → type-of-palette match |
| 5 | Sparkline | Brand accent (single hue) | ink default; jade/bronze tint at endpoint when sign-bearing | Single trend |
| 6 | Calendar | Status-categorical | per CHARTS_SPEC §2.6 | Non-semantic |
| 7 | Treemap | Hybrid (size = weight; color = diverging change %) | ink-tone for size; jade↔bronze diverging for delta | Two-channel encoding |
| 8 | Stacked bar | Categorical ≤7 | museum-palette + locked semantic when sign | Multi-series |
| 9 | Scatter | Categorical | museum-palette ≤3 groups | Group membership |
| 10 | Waterfall | Diverging semantic | jade=add, bronze=subtract, ink=start/end totals | Sign-bearing |
| 11 | Candlestick | Semantic binary | jade up / bronze down | Already locked |

### Concrete next steps (subject to PO decision)

1. **Lock the synthesis above** as the chart palette direction.
2. **Define the museum-palette family** (≥40% chroma reduction vs reference) — exact OKLCH/hex values to be drafted by product-designer in a follow-up dispatch (small, ≤ 1 hour). Goal: 5 hues that share luma + saturation profile with forest-jade/bronze, brand-aligned but distinct.
3. **Update CHARTS_SPEC.md §2.2** with the new palette mode taxonomy + per-chart-kind mapping.
4. **Update DonutChart** to consume categorical museum-palette by default; expose `palette: 'categorical' | 'sequential' | 'monochromatic'` prop for explicit override (e.g. caller knows the data is ordinal-by-magnitude).
5. **Update AI-agent prompt** so chart-emission defaults match the new palette taxonomy (eliminates ad-hoc per-slice colors).
6. **Refresh chart-tests checkpoint β.1.4 baselines** (commit 109e4de). Showcase visual regression update.

### Open question for PO

The synthesis disagrees with product-designer's «forest-jade ramp» direction on substantive grounds (§13.2 cap + data-viz canon). PO may want to:
- **(a)** accept the synthesis (museum-palette categorical + ink tonal default, jade reserved for semantic);
- **(b)** override toward forest-jade ramp (product-designer view) — would require lifting §13.2 cap or scoping it to non-chart surfaces;
- **(c)** punt the donut decision to a follow-up product-designer dispatch with the museum-palette hex definition first, then re-evaluate.

---

## PO decisions needed

1. **Lock direction:** synthesis as above (a), or forest-jade ramp (b), or follow-up dispatch first (c)?
2. **§13.2 brand-cap interpretation** — is it binding for chart series, or scoped to non-chart surfaces?
3. **Museum-palette draft** — greenlight a small product-designer dispatch (≤ 1 hour, ≤ 40 LOC + spec edit) to generate concrete hex/OKLCH values for the 5-hue museum extension family?

---

**End of aggregate.** Per-specialist raw transcripts retained at:
- product-designer: `aacb6895a15089dab.output`
- finance-advisor: `a89eeaa0efc35bc8c.output`
- brand-strategist: `a22565736aef05f71.output`
