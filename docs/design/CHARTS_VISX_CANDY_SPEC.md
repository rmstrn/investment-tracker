# CHARTS_VISX_CANDY_SPEC

> Chart-by-chart visual language for the visx + candy migration (Direction D).
> Authored 2026-05-01 by product-designer. Supersedes `CHARTS_SPEC.md`,
> `CHART_PALETTE_v2_draft.md`, `DONUT_GRADIENT_v2_draft.md`,
> `DONUT_ANATOMY_v2_draft.md`.
>
> Locale: EN-only US+EU. Data formatters live in `_shared/formatters.ts`.

This document specs the per-chart visual treatment for the eleven chart kinds
in the Provedo product. Implementation references: `DonutVisx.tsx`,
`BarVisx.tsx`. Both establish the candy-chart register that the remaining
nine charts extend.

---

## 0. Common patterns

The candy chart register shares one visual grammar across all kinds. Cite this
section from individual chart sections rather than restating it.

**Hard ink-shadow drop.** Every visible mark — slice, bar, line, dot, tile,
calendar pill — paints twice: a shadow path at `translate(2,2..4)` filled
with `var(--text-on-candy)` at 0.85 alpha, then the coloured mark on top.
This is not `filter: drop-shadow()` — it must be a hard, single-layer,
paper-press ink shadow. Soft Material elevation is forbidden in this register.

**Hover lift.** On pointer-enter, the mark group translates `(-2px, -2px)`
with `transition: transform 220ms var(--motion-easing-spring-soft)`. The
shadow stays anchored, producing the «card-pressed → card-released» feel.
Hover never changes hue.

**Hero numerals.** Big numbers use Bagel Fat One (`--font-family-display`)
at `clamp(28px, 4vw, 44px)`, weight 400, line-height 1, `letter-spacing
-0.01em`, `font-variant-numeric: tabular-nums`. Reserved for the *one*
focal numeral per chart (donut center, waterfall total, sparkline final
delta).

**Axis & labels.** Manrope (`--font-family-body`) at 10px, weight 500,
`letter-spacing 0.08em`, `text-transform: uppercase`, `tabular-nums`,
ink-on-candy at 0.7 alpha. Axis tick gridlines are 1px ink at 0.08 alpha,
no dash.

**Tooltip.** Cream-on-ink reversed: `bg: var(--bg-cream)`, 1.5px ink border,
`border-radius: 8px`, `padding: 6px 10px`, `box-shadow: 5px 5px 0 0
var(--text-on-candy)` (the signature hard offset stack). Mono-uppercase
eyebrow line + Manrope 12px/600 value line.

**Entrance.** 720ms (`--motion-duration-deliberate`), per-mark stagger
60–80ms, eased spring-soft (cubic-bezier 0.34, 1.56, 0.64, 1). Marks rise
from the baseline (bars), sweep clockwise (donut/pie), draw left-to-right
(line/area/sparkline), wash-fill bottom-up (treemap), or pop in (calendar
cells).

**Reduced motion.** `prefers-reduced-motion: reduce` kills entrance, hover
lift, and tooltip slide. Marks paint full immediately.

**ChartFrame wrapper.** All charts wrap in `<ChartFrame>` providing
`role="img"`, `aria-label`, focus ring (`CHART_FOCUS_RING_CLASS`), and a
visually-hidden `<ChartDataTable>` shadow with `aria-describedby` linkage.

---

## TIER 1 — Must-ship MVP

### 1. Line — Portfolio value over time

**Visual signature.** A single 2.5px ink-coloured stroke with the hard ink
shadow offset `(2, 3)` running underneath — the line literally throws a
shadow on the chart floor. Round caps + joins make the path feel hand-drawn.

**Hero element.** A single Bagel Fat One numeral above the chart showing
the *latest value* and a candy-pink or signal-orange delta chip beside it
(`+12.4%` style). The endpoint dot of the line is a 6px ink-bordered cream
disk that visually anchors the hero numeral to the chart.

**Motion.** Stroke draws left-to-right via `stroke-dasharray` animation
over 720ms (`--motion-duration-deliberate`), then the endpoint dot pops
in with spring-soft 220ms scale 0→1. Hover lifts the dot only — not the
whole line — and reveals the cream-on-ink tooltip at that x-position.

**Color usage.** Stroke = `var(--text-on-candy)` ink-deep when neutral.
Stroke flips to `var(--cta-fill)` signal-orange when YTD delta is positive,
`var(--accent-deep)` deep terracotta when negative. No green/red duality —
the candy register stays warm. Endpoint dot fill = `var(--bg-cream)`.

**Empty / loading / error.** Empty: chunky Bagel `—` placeholder centered
on the chart floor with cream eyebrow «Connect a broker to begin». Loading:
ghost ink line at 0.15 alpha shimmers L→R every 1400ms. Error: ink dashed
line + cream-on-ink tooltip-shaped «Couldn't load» badge centered.

**A11y.** `role="img"` with `aria-label="Portfolio value, last N days,
latest $X, change Y%"`. Keyboard: dot focusable per data point via arrow
keys. Reduced motion: stroke paints full immediately, no shimmer.

**Edge cases.** ≥365 points: thin x-axis labels to month-only (Jan / Feb…);
no dot until hover. Massive single-day spike: clamp y-domain to 99th
percentile + 5% headroom; render outlier as a candy-pink chip pinned at
the spike with the actual value spelled out.

---

### 2. Area — Cumulative P&L

**Visual signature.** Same ink stroke as Line, but with a flat
solid-color fill underneath (no gradient — gradients are too soft for the
candy register). The fill uses signal-orange at 0.85 alpha when cumulative
P&L is positive, candy-pink at 0.85 when negative. The fill *also* has a
hard ink-shadow drop along its lower edge — a 2px ink band hugs the
zero-line.

**Hero element.** A Bagel Fat One total in the top-left corner (e.g.
`+$18.4K`), with a Manrope mono eyebrow «YTD CUMULATIVE» above it. The
hero color matches the area fill (orange for positive, pink for negative).

**Motion.** Area fill wash-fills bottom-up via clip-path animation over
720ms; the stroke draws on top in the same frame; hero numeral counts up
with `tabular-nums` from 0→total in the same window.

**Color usage.** Positive: `var(--cta-fill)` orange fill, ink stroke,
ink-deep shadow. Negative: `var(--candy-pink)` pink fill, ink stroke. The
zero baseline is the embossed-groove pattern from `BarVisx` (1px ink at
0.45 alpha + 1px card-highlight 1px below).

**Empty / loading / error.** Empty: cream chart floor + Bagel `$0` hero +
hint «No realised gains yet». Loading: signal-orange skeleton wash with
ink stroke at 0.15 alpha. Error: ink dashed wave + retry-button-styled
chip centered.

**A11y.** `role="img"`, label includes total + sign. Color is *not* the
only signal — the sign is also in the hero numeral text and the eyebrow
suffix. Tooltip on hover gives exact daily cumulative value.

**Edge cases.** Crossover (positive→negative→positive): split the area
into segments at each y=0 crossing, paint each segment its sign color.
Trailing flat zeros: clip the area to the last non-zero point + 1 day so
empty future doesn't visually drag the chart down.

---

### 3. Bar — Drift (top positions vs rebalance band)

**Visual signature.** Top-only 8px corner radius (chunky candy), hard
`(2, 4)` ink shadow drop. Two ink dashed guide lines mark `±2pp` rebalance
band. Bars *inside* the band get neutral ink-on-candy at 0.55 alpha — they
visually retreat. Bars *outside* the band get full signal-orange treatment
— they punch forward. Already shipped in `BarVisx`.

**Hero element.** The single most-drifted bar is the star — its colour is
deepest (`var(--accent-deep)`) and a Bagel chunky `+4.2pp` value label
sits above it. Other out-of-band bars stay regular candy-orange without
labels.

**Motion.** Bars rise from the zero baseline with spring-soft easing
(720ms, 60ms stagger). Hero bar entrance overshoots slightly more (the
spring-soft cubic-bezier already gives this).

**Color usage.** In-band: `var(--text-on-candy)` ink at 0.55. Out-of-band
positive: `var(--cta-fill)` signal-orange. Out-of-band negative:
`var(--accent-deep)` deep terracotta. Band guides: signal-orange at 0.4
alpha, dashed `3 4`.

**Empty / loading / error.** Empty: cream bg with single chunky Bagel `0`
and «All positions in band — no drift». Loading: 6 grey bars shimmering.
Error: «Couldn't compute drift» chip.

**A11y.** Label per bar: `«AAPL, +1.2 percentage points, in band»`. Keyboard
focus walks bars. Color-only-conveyance check: the in-band/out-of-band
distinction is *also* encoded in alpha (0.55 vs 1.0) and value-label
presence — passes WCAG.

**Edge cases.** ≥12 positions: keep top-6 by absolute drift, append a
`+N more` tile. Scale clamp: y-domain capped at ±15pp to prevent a single
huge outlier from flattening everything else; that outlier renders with a
Bagel «↑» glyph above the clamped bar top.

---

### 4. Bar — Monthly P&L (sign-coloured)

**Visual signature.** Same chunky top-radius bars and hard ink shadow as
Drift, but bars straddle the zero line: positive months grow up in
signal-orange, negative months grow down in deep-terracotta with their
top corners (which are now at the bottom) rounded. Already covered in
`BarVisx` with `flipForNegative=true`.

**Hero element.** A Bagel chunky cumulative total in the top-left corner
(`+$X.XK YTD`), and the *current month* bar wears a candy-pink ink-bordered
ring around it to call out «you are here».

**Motion.** Bars rise/drop from the embossed zero line, spring-soft, 60ms
stagger. The current-month ring fades in last (160ms after the last bar
lands).

**Color usage.** Positive bars: `var(--cta-fill)` signal-orange. Negative
bars: `var(--accent-deep)` deep terracotta. Current-month ring:
`var(--candy-pink)` 1.5px outline + 2px ink shadow.

**Empty / loading / error.** Empty: ink dashed zero line + Bagel `—` chunky
+ hint «No realised P&L this year». Loading: skeleton bars alternating up
+ down. Error: standard chip.

**A11y.** Per-bar label: `«March 2026, plus $X»` / `«minus $X»`. Sign is
*always* in the spoken label, not just colour. Keyboard navigation ascends
chronologically.

**Edge cases.** A single dominating month: y-domain set to
`[1.15 × min, 1.15 × max]` so a +$50K month doesn't leave the −$200 month
invisible — every bar gets ≥6px height. Months with zero activity render
as a 2px ink dash on the zero line, not as a missing slot.

---

### 5. Donut — Allocation by sector

**Visual signature.** Already shipped in `DonutVisx`. Five chunky slices
with 8px corner radius, 0.012rad pad-angle, hard `(2,2)` ink shadow per
slice, hover lifts slices `(-2,-2)` while shadow stays anchored.

**Hero element.** The Bagel Fat One total `$226K` in the donut hole, with
a Manrope mono uppercase eyebrow `PORTFOLIO` underneath. The headline
parses the first whitespace-token of `centerLabel` so a payload of
`«$226K total»` becomes hero `«$226K»` + body «total» discarded.

**Motion.** Sweep clockwise, 720ms, 80ms stagger (already implemented).
Hover: slice lifts, legend swatch gets a 1.5px ink outline at offset 2 —
the lockup answers the hover symmetrically.

**Color usage.** `--chart-categorical-1..5` (locked palette, do not
redesign). The five candy-categorical hues are pre-tested for ink-shadow
contrast and side-by-side legibility.

**Empty / loading / error.** Empty: a single pale ink ring at 0.15 alpha +
chunky Bagel `0%` + hint «Connect a broker to see allocation». Loading: 5
ghost slices shimmering clockwise. Error: ring with cream-on-ink chip in
center.

**A11y.** `role="img"` + describedby `<ChartDataTable>` shadow. Each slice
has `data-segment-key` so keyboard users can reach segments via Tab + arrow
in a future iteration. Legend swatch uses ink-shadow box, not just colour
fill — color-blind users still get a shape signal.

**Edge cases.** >5 sectors: collapse tail to a single «Other» slice that
inherits `--chart-categorical-5` at 0.6 alpha and a hatched ink overlay.
≤2 sectors: switch to a half-donut (180° sweep) so the chart doesn't read
as «mostly one slice» — handled by `payload.layout.style: 'half'`.

---

### 6. Sparkline — Inline trend cells

**Visual signature.** Same ink-stroke + hard-shadow line as the big Line
chart, but stripped to essentials: no axes, no gridlines, no tooltip on
hover. Endpoint dot is the *only* annotation. The whole sparkline lives
inside a 64px-tall cream cell with 6px corner radius.

**Hero element.** The endpoint delta chip on the right side of the cell:
candy-pink for negative, signal-orange for positive, ink-on-cream pill
shape, Bagel-numeral-styled `+1.4%` text. The sparkline itself is supporting
cast for that one chip.

**Motion.** Stroke draws L→R (480ms — faster than the big charts because
sparklines appear in lists where slow entrance churns). Endpoint dot pops
160ms later. Reduced motion: paint full.

**Color usage.** Stroke: ink-deep when delta is small (|Δ|<1%), candy
sign-color when significant. Chip background: cream. Chip text: ink-deep.
No mid-stroke colour change — full line stays one hue.

**Empty / loading / error.** Empty: a single ink dot in cell center +
Bagel `—`. Loading: the cell fills with 0.15-alpha ink shimmer L→R over
1200ms loop. Error: cell shows ink dashed `?` glyph; *no* error text —
sparklines are too small for prose.

**A11y.** Sparklines render as `<span role="img" aria-label="Trend up
1.4%, last 30 days">`. They never carry the only copy of the data — the
adjacent table cell or card always has the explicit number. Keyboard
focus: sparklines are not focusable; they're decorative supplements.

**Edge cases.** ≤3 data points: don't render — fall back to the chip
alone. Flat line (all values equal): render as a single horizontal ink
stroke + endpoint dot, chip reads `±0.0%`. Spikes: clamp y-domain to 1.5×
median range to prevent a single outlier from making the line look like
a noisy floor + one tower.

---

### 7. Calendar — Dividend month-view

**Visual signature.** A 7×5 grid of cream square cells with 2px ink
shadow per filled cell. Cells with dividend events display a chunky Bagel
amount inside (`$42`) plus a 6px broker-coloured chip pinned to the corner.
Empty cells stay flat cream — no shadow — so filled cells visually pop.

**Hero element.** The chunky Bagel total at the top of the calendar
(`$X received this month`) plus a candy-pink corner chip showing the next
upcoming payment date. The current day cell wears a 1.5px candy-pink
ink-bordered ring (matches the «you are here» pattern from the Monthly
P&L bar).

**Motion.** Cells pop in row-by-row (280ms each row, 40ms stagger)
with spring-soft scale 0.85→1. Today's ring pulses once at 1.4× alpha
on first render then settles. Hover lifts the cell `(-2,-2)` revealing
the tooltip with broker name + amount.

**Color usage.** Cell bg: cream. Filled-cell ink shadow: ink-deep at 0.85.
Broker chips: pull from `--chart-categorical-1..5` so the same broker gets
the same hue everywhere across the product. Today ring: `var(--candy-pink)`.
Past dividend: full alpha. Scheduled (future): cream cell + dashed ink
border, no shadow.

**Empty / loading / error.** Empty (no events this month): grid of all
cream cells + chunky `0` hero + hint «No dividends scheduled». Loading:
all cells shimmer in a wave L→R, T→B. Error: ink dashed grid placeholder
+ retry chip.

**A11y.** Cells render as `<button>` with full label (`«April 14, AAPL,
$42 received from Schwab»`). Keyboard nav: arrow keys move day-by-day,
Tab moves week-by-week. Today cell has `aria-current="date"`. Color is
not the only signal — past vs scheduled is also dashed-vs-solid border.

**Edge cases.** Months starting mid-week: leading cells render flat and
inert (no border, no shadow), labelled by aria-hidden. >3 events on one
day: cell shows `$X +N` chunky label and the tooltip enumerates all N.
Currency mix: each event chip carries a 2-letter currency suffix (`USD`,
`EUR`) in mono-uppercase under the amount.

---

### 8. Treemap — Concentration

**Visual signature.** Tile sizes proportional to weight; tile *colour*
indicates today's % change (signal-orange = up, deep-terracotta = down,
ink-on-cream neutral = flat). Each tile has a 2px ink hard shadow on its
bottom + right edge, creating an *isometric* tile-stack feel — the
chart looks like a pile of paper-pressed tiles, not a flat heatmap.

**Hero element.** The largest tile carries a Bagel Fat One ticker symbol
(`AAPL`) + Manrope mono-uppercase weight (`12.4%`) underneath, both
ink-on-color. Smaller tiles get progressively shorter labels: ticker only,
then ticker abbreviation, then nothing (tooltip-only).

**Motion.** Tiles wash-fill bottom-up in size order: largest first, smallest
last. 720ms total, 40ms per-tile stagger. Hover lifts the tile `(-2,-2)`
with shadow staying anchored — same as donut slices.

**Color usage.** Up >1%: `var(--cta-fill)` signal-orange. Down >1%:
`var(--accent-deep)` deep terracotta. |Δ|≤1%: `var(--bg-cream)` cream
with ink at 0.55 — flat days visually retreat. Tile *border*: 1px ink at
0.85 alpha — tiles have hard edges, not anti-aliased fades.

**Empty / loading / error.** Empty: single chunky `0` cream tile + hint.
Loading: 12 ghost tiles shimmer in cascade. Error: ink dashed grid + chip.

**A11y.** `role="img"` with summary label («Concentration treemap, top
position AAPL 12.4%, biggest mover NVDA up 4.1%»). Each tile is a button
with full ticker + weight + Δ in its label. Keyboard: tiles focusable in
size-descending order. Color-blind: the Δ% is *also* in the tile's
ink-on-color label, not just hue.

**Edge cases.** ≥30 holdings: collapse tail (<1% weight each) into a
single «Other» tile in the bottom-right with hatched ink overlay. One
position dominating (>50% weight): render that tile spanning the full
width with a candy-pink concentration warning chip pinned in its top-right
corner.

---

## TIER 2 — Next-wave

### 9. Stacked Bar — Broker contribution over months

**Visual signature.** Each month-bar is a stack of broker-colored
sub-segments. Top segment carries the chunky 8px corner radius;
intermediate segments are flat-flat (no radius). The hard ink-shadow drop
runs once per *whole bar*, not per segment — so the stack reads as a
single object with internal striping, not as a tower of independent tiles.
A 1px ink hairline separates segments inside the bar.

**Hero element.** The total for the latest month sits above its bar in
Bagel Fat One. Per-broker totals across all months render as a horizontal
legend chip-row beneath the chart, sorted by contribution descending —
the highest-contribution broker chip is twice the size of the others.

**Motion.** Whole stack rises from baseline (720ms spring-soft); inside
the stack, segments wash-fill bottom-up sequentially (60ms each) so you
visually parse «broker A contributed first, then B layered on top». Hover
lifts the entire stack and dims non-hovered brokers in the legend to 0.4
alpha.

**Color usage.** `--chart-categorical-1..5` per broker (consistent broker
↔ colour assignment via `payload.brokerColorMap`). Hairlines: ink at 0.45
alpha.

**Empty / loading / error.** Empty: cream bg + Bagel `0` chunky + hint.
Loading: 6 ghost stacks. Error: chip.

**A11y.** Per-bar label enumerates each broker contribution
(«March 2026 total $X: Schwab $A, Fidelity $B, IBKR $C»). Keyboard: stacks
focusable; arrow-up/down within a stack walks segments.

**Edge cases.** >5 brokers: collapse least-contributing brokers into
«Other» (5th colour with hatched overlay). All-zero month: render as a
2px ink dash on the zero line, not as a missing slot.

---

### 10. Waterfall — Where YTD value came from

**Visual signature.** A sequence of chunky candy bars connected by 1px
ink dotted bridges. Positive bars rise from the previous bar's top in
signal-orange; negative bars drop from the previous top in
deep-terracotta. The first bar (starting balance) and the last bar
(ending balance) are full-height ink-on-cream paper-press blocks — they
visually anchor the sequence as «start» and «end».

**Hero element.** The end-of-sequence ending balance bar carries a
Bagel Fat One numeral *inside* it (the bar acts as a chunky pill
container). The chunkiest visual moment of any chart in the product.

**Motion.** Bars resolve left-to-right: each bar springs in from its
previous neighbour's top edge (640ms each, 80ms stagger). The connecting
dotted bridges draw immediately after each bar lands. The final ending-balance
bar gets +200ms of overshoot for emphasis.

**Color usage.** Anchor bars (start, end): `var(--text-on-candy)` ink-deep
on cream. Positive contributors: `var(--cta-fill)` orange. Negative
contributors: `var(--accent-deep)` deep-terracotta. Bridges: ink at 0.45
alpha, `2 3` dash.

**Empty / loading / error.** Empty: only the start-bar + Bagel chunky
hero + hint. Loading: 5 ghost bars + dotted bridge skeletons. Error: ink
dashed envelope shape + retry chip.

**A11y.** Per-bar label: «Dividends, plus $X, running total $Y». The
running total is announced after every bar so screen readers can rebuild
the narrative. Keyboard: arrow-right walks the sequence.

**Edge cases.** ≥10 contributors: collapse smallest |Δ| contributors
into «Other» (single hatched bar). One huge contributor: scale clamps
the y-domain to 1.5× the second-largest contributor; the giant bar shows
a Bagel «↑» glyph at its clamped top with the actual value inside.

---

## A11y baseline

Every chart in the product wraps in `<ChartFrame>` (path:
`packages/ui/src/charts/_shared/ChartFrame.tsx`). ChartFrame provides:

- `role="img"` and computed `aria-label` from `payload.meta.alt ?? title`.
- `aria-describedby` linkage to a visually-hidden `<ChartDataTable>` shadow
  rendered as a sibling. The table enumerates every data point in plain
  HTML — screen readers and assistive technology have full data access
  even when the SVG is unreachable.
- `CHART_FOCUS_RING_CLASS` for keyboard focus: 2px outline,
  `var(--cta-fill)` signal-orange, 2px offset. The ring matches the
  product's CTA ring colour so chart focus reads as «this is interactive».
- `prefers-reduced-motion` honoured globally via `useReducedMotion()`. When
  the user has motion disabled: entrance animations skip to final state,
  hover lift is suppressed, tooltip slide-in is disabled. The data is never
  hidden behind motion.

**Color-only-conveyance audit.** Every chart in this spec encodes its
critical signal in *at least one non-colour channel*:

- Sign of a value: always in the spoken label («plus $X» / «minus $X»).
- In-band vs out-of-band drift: alpha 0.55 vs 1.0 + label presence.
- Past vs scheduled calendar: solid vs dashed border.
- Concentration vs flat treemap tile: tile size *and* label-density step.

**Tab order.** Charts that are *interactive* (calendar cells, treemap
tiles, focusable bars) participate in tab flow. Charts that are *display-only*
(line, area, sparkline, donut center label) do not steal focus. Hover-only
tooltips are allowed because the underlying data is in the
`<ChartDataTable>` shadow.
