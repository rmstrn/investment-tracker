# Visual Quality Brainstorm — Aggregate Synthesis 2026-04-29

**3 voices in parallel:** product-designer / brand-strategist / a11y-architect.
**Trigger:** PO compared `/design-system` (rebuilt) vs `/design-system.html` (static reference) — «всё равно не красиво, графики отвратительны».
**Aggregator:** Right-Hand.

## Convergent diagnosis

The showcase has TWO orthogonal visual problems that compound each other:

1. **«Слишком громко где надо whisper»** (brand-strategist) — tagline + CTAs + Lane A miscoloration scream where Magician archetype expects quiet revelation.
2. **«Слишком туманно где надо readable»** (a11y-architect) — `--text-3` sub-AA contrast (3.82:1) makes eyebrows / labels / chart axes / swatch hex all foggy.

Result: showcase shouts brand pressure AND mumbles supporting chrome simultaneously. Static reference has SAME a11y failures (faithful port — not a regression of React) but doesn't shout-CTA.

ui-ux-pro-max corroboration: Provedo style profile = **E-Ink/Paper** archetype (NOT Financial Dashboard). Direction is right; **gap is execution fidelity**, not strategy.

Anti-positioning trap closest: **Bloomberg Terminal** (institutional documentation register). Drift from `<DsSection>` slabs reading as «documentation chapters».

## Per-voice top findings

### product-designer
- **Donut centerLabel never renders** (charts.tsx:98) — `$226K / PORTFOLIO` lockup absent. Single biggest «wow» loss.
- **Plumbing gap** — `showcase.css` authors `.chart-note` / `.chart-lane-a` / dotted-top legend; React chart components don't consume.
- **ChartCard chrome divergence** — title 15px vs static 18px, eyebrow letter-spacing 0.18em vs 0.22em.
- **Donut `paddingAngle=2` + Cell `stroke=2` double** — segments look gappy / «broken pie», not clean paper-cut sectors.
- **Line/Area stroke 1.75 vs static 2** — charts read thinner and less anchored.
- **Single-series legend hidden** behind `length > 1` gate — line/area charts unanchored.
- **Button primary missing `--shadow-primary-extrude`** — brand «extruded ink» invisible across every CTA.

### brand-strategist
- **Tagline triple-billed** — «Notice what you'd miss» 3× (page h1 + light stage + dark stage). Static uses ONCE. Magician = quiet revelation.
- **3× identical «Get early access»** in button-size demo — Cialdini commitment-pressure not Sage-restraint.
- **Lane A as `tone="negative"` (bronze warning)** — DIRECT CONTRADICTION of positioning (Lane A is POSITIVE trust signal).
- Anti-positioning closest: Bloomberg Terminal.
- Wins: form fields voice / insight card «pattern across accounts» copy / stage-frame 2px ink-rule.

### a11y-architect
- **Light `--text-3` 3.82:1 sub-AA** (`#6E6E6E` on `#E8E0D0`) — every eyebrow / meta / swatch hex foggy. SINGLE LARGEST «не красиво» driver. Bump to `#5A5A5A` (4.97:1 AA) fixes ~60% perceived foggy.
- **Dark accent eyebrow 3.87:1 sub-AA** (`#4A8775` on `#26262E`) — brand signature (mono uppercase jade eyebrows) breaks WCAG on dark stage cards.
- **Outer H1 40px smaller than nested stage H2 48px** — hierarchy inversion: «which is the title?».
- **Multi-series LineChart color-only differentiation** — no dash-array / no marker-shape — color-blind users can't distinguish series.
- Static reference itself fails same criteria. React faithful — fixing tokens improves BOTH surfaces.

## Synthesised fix list (5 tiers, prioritised)

### Tier 0 — token-level, single change, broadest impact

- [ ] **Bump `--text-3` light** from `#6E6E6E` to `#5A5A5A` (4.97:1 AA pass).
  - File: `packages/design-tokens/tokens/primitives/color.json` + `tokens/semantic/light.json`
  - Run `pnpm --filter @investment-tracker/design-tokens build`
  - Lifts ALL eyebrows / meta / labels / swatch hex / chart axis ticks at once

- [ ] **Bump `--accent` dark** from `#4A8775` to a higher-contrast jade variant on `#26262E` (target 4.5:1).
  - File: `packages/design-tokens/tokens/semantic/dark.json` (or palette primitives)
  - Re-verify forest-jade as semantic positive after bump
  - Affects all dark-mode eyebrows + accent words

### Tier 1 — loud-quiet rebalancing (brand)

- [ ] **Drop outer page H1 «Notice what you'd miss»** — rename to neutral «Provedo Design System v2 — refined» (28px, matching static).
  - File: `apps/web/src/app/design-system/page.tsx:52-57`
- [ ] **Tagline ONCE inside light stage**; dark stage gets a parallel quiet headline («Quiet pages, sharper signals» or similar) NOT another «Notice what you'd miss».
  - File: `apps/web/src/app/design-system/_components/StageFrame.tsx` or section heads
- [ ] **Replace 3× «Get early access»** in button-size demo with varied/neutral labels.
  - File: `apps/web/src/app/design-system/_sections/primitives.tsx:32-44`
- [ ] **Lane A radio: drop `tone="negative"`**, use default (Lane A is positive trust signal per `02_POSITIONING.md`).
  - File: `apps/web/src/app/design-system/_sections/primitives.tsx:82` (or wherever Lane A radio renders)

### Tier 2 — chart visual polish («графики отвратительны»)

- [ ] **DonutChart: pass `centerLabel` prop** with `$226K / PORTFOLIO` mono lockup at the donut's centre (the iconic Provedo donut moment).
  - File: `apps/web/src/app/design-system/_sections/charts.tsx:98` (consumer) + `packages/ui/src/charts/DonutChart.tsx` (ensure `centerLabel` prop wired)
- [ ] **DonutChart: drop `paddingAngle={2}`** (segments separated by 2px Cell stroke alone — clean paper-cut, not gappy «broken pie»).
  - File: `packages/ui/src/charts/DonutChart.tsx:151`
- [ ] **Line/Area: bump stroke `1.75` → `2`** (matches static).
  - File: `packages/ui/src/charts/_shared/buildChartTheme.ts:80`
- [ ] **Drop single-series legend `length > 1` gate** — show legend even on solo series (anchors the chart, matches static).
  - Files: `packages/ui/src/charts/LineChart.tsx:151`, `AreaChart.tsx:115`
- [ ] **ChartCard chrome upgrade** — title 15px → 18px, eyebrow letter-spacing 0.18em → 0.22em (more editorial).
  - File: `packages/ui/src/charts/_shared/ChartCard.tsx`

### Tier 3 — interaction + state polish

- [ ] **Button.tsx primary**: apply `--shadow-primary-extrude` + 14px radius + press transform.
  - File: `packages/ui/src/primitives/Button.tsx`
  - Note: this is technically Phase β.1 scope — but the showcase IS the visual artefact PO is judging, so can't defer.
- [ ] **Wire showcase.css `.chart-note` / `.chart-lane-a` / dotted-top legend** to React chart components.
  - Files: `apps/web/src/app/design-system/_styles/showcase.css` (already authored) + chart consumers in `_sections/charts.tsx`
- [ ] **Multi-series LineChart**: add stroke-dasharray OR marker-shape variation per series for color-blind safety.
  - File: `packages/ui/src/charts/LineChart.tsx`
- [ ] **Active-dot focus ring** on LineChart focused index (chart-container ring is visible but cursor-equivalent isn't).
  - File: `packages/ui/src/charts/LineChart.tsx`

### Tier 4 — out-of-scope flags (file as TDs)

- DsSection «documentation chapter» feel — bigger restructure: collapse multiple consecutive `<DsSection>` slabs into one curated narrative flow per stage. Defer to a dedicated narrative-layout slice if PO wants to push beyond reference fidelity.
- 22×22 control touch-targets — static itself violates WCAG 2.5.5 (24×24 AA). Fixing this in React diverges from static parity. PO call.

## Dispatch recommendation

Single FE dispatch covering Tier 0 + Tier 1 + Tier 2 + Tier 3 = ~14 fixes. Time budget: target <60 min wall-clock with phase-checkpoint commits per tier.

Tier 4 → file as TDs (TD-110 / TD-111).

After dispatch lands → restart dev → PO compares `/design-system` vs `/design-system.html`. Expectation: visual gap closes from «отдалённо похож» to «полностью matches with interactive bonus».

## Output report files (for FE dispatch reference)

- `docs/reviews/2026-04-29-visual-brainstorm-product-designer.md` (full per-section table + per-chart deep audit)
- `docs/reviews/2026-04-29-visual-brainstorm-brand-strategist.md` (brand-identity scorecard + anti-positioning check)
- `docs/reviews/2026-04-29-visual-brainstorm-a11y-architect.md` (9-criteria scorecard + token-level fixes)
- This synthesis: `docs/reviews/2026-04-29-visual-brainstorm-aggregate.md`
