# /design-system visual quality brainstorm — product-designer angle

**Date:** 2026-04-29
**Author:** product-designer (dispatched in parallel with brand-strategist + a11y-architect; isolated context, no cross-talk)
**Scope:** Read-only audit of `apps/web/src/app/design-system/*` vs `apps/web/public/design-system.html` reference. Identify visual gaps; propose precision fixes. No code modifications.
**PO complaint:** «всё равно не красиво» after 10-point fidelity rebuild. Charts called «отвратительны» repeatedly.

---

## TL;DR — top findings

The React rebuild is **structurally faithful** but **visually thinner** than the static reference. Three meta-causes:

1. **Two competing card-chrome systems collide.** `ChartCard` (in `packages/ui`) renders a different chrome than `.chart-card` (static reference). React-side cards have no `eyebrow` mono dot-leader, no `chart-legend` border-top divider, no FINRA `chart-note` footer styling — so charts read as «raw Recharts» instead of «editorial figures.»
2. **Recharts default rendering quietly overrides the theme.** Even with `buildChartTheme()` applied, several visuals diverge: stroke-width 1.75 (vs static 2), gradient stops (`0.30 → 0`) match in spec but Area's `dataTableId`-namespaced gradient ID and Recharts auto-margin produce visibly thinner curves at small sizes. Donut paddingAngle 2 + Cell stroke 2 doubles up — segments look gappy, not separated.
3. **«Polish» is many small things acting in concert.** The static reference gets its feel from ~14 individual micro-decisions (sample labels with min-width, dotted dividers under section heads, chart-card asymmetric padding `22 24 20`, legend top-border-dotted, `chart-note` left-rail, etc.). Most are **declared in `showcase.css`** but **never rendered** because the React sections wire to wrong/missing class names. The CSS is paid for but not consumed.

The fix is not «more polish» — it's **plumbing**. Wire what's already authored. Then sharpen 5 chart-specific defects.

---

## Per-section comparison table

| Section | React state | Static reference | Gap | Fix proposal |
|---|---|---|---|---|
| **Stage frame** | `.showcase-stage-v2` 36/40/44 padding, 18px radius, `2px solid var(--ink)` rule under head — **MATCHES** | same | none | — |
| **Stage head — eyebrow** | 10px Geist Mono uppercase 0.22em, var(--accent) — **MATCHES** | same | none | — |
| **Stage head — headline** | `<h2>` 48px Geist semibold, accent word **bold-only** (correct, Patagonia canon) | same | none | — |
| **Stage head — meta** | 10px mono right-aligned — MATCHES | same | none | — |
| **Section head** | `.showcase-ds-section__head` — 22px Geist + 10px mono meta + 1px dotted bottom divider — **MATCHES** | same | none | — |
| **Section row label** | `.showcase-ds-row__label` 9px mono 0.22em — **MATCHES** | same | none | — |
| **Color swatches** | `.showcase-swatch` 36×36 chip + 12px name + 10px mono hex — **MATCHES** | same | minor: chip has only `box-shadow: 0 0 0 1px var(--border)` outline, no inner depth | A: keep — matches static. |
| **Typography rows** | `.showcase-type-row` 14/18 padding, baseline align, mono label 110px min-width — **MATCHES** | same | The label `min-width: 110px` works but **flex-wrap: wrap** breaks the alignment column on narrow viewport; static stays aligned because static doesn't have flex-wrap | B: drop `flex-wrap: wrap` from `.showcase-type-row`, let it overflow gracefully (or set `min-width: 200px` on sample) |
| **Shadow grid** | inline-styled grid (foundation.tsx L172) — **renders correctly** | `.shadow-grid` class | OK functionally; worth promoting inline style to a class for future maintainability | low priority |
| **Signature hero card** | `.showcase-signature` — 22px radius, 28/32 padding, `--shadow-lift`, eyebrow with **dotted bottom divider** under it (`fit-content` width) — **MATCHES** | same | minor: SignatureHero.tsx hardcodes `<br/>` newline between «Notice what» and «you'd miss.»; static stage-head hero has it on one line. The two render slightly different (signature card breaks; stage head doesn't) | C: align — either both break or neither |
| **Buttons matrix** | uses `Button` primitive from `@investment-tracker/ui` | Static uses `.btn-primary / .btn-secondary / .btn-ghost / .btn-danger / .btn-icon` with explicit shadow tokens | **CRITICAL GAP**: the React `Button` may not consume `--shadow-primary-extrude` / radius 14px / 4-axis warm shadow. Without seeing Button.tsx the *feel* of the primary CTA — the «extruded ink» look that defines the whole brand — likely doesn't translate. Static `.btn-primary` is `background: var(--ink)` + `box-shadow: var(--shadow-primary-extrude)` + radius 14 + transform-on-press. | D: **HIGHEST IMPACT** — audit `packages/ui/src/Button/Button.tsx`, ensure primary variant uses `var(--shadow-primary-extrude)` + `border-radius: 14px` + `transform: translateY(-1px)` on hover + `translateY(1px)` on active. If it doesn't, the entire brand «tactile ink» language is invisible. |
| **Icon buttons** | `.showcase-btn-icon` — 40×40 circle, `var(--inset)` bg, `var(--shadow-inset-light)` — **MATCHES static `.btn-icon`** | same | none | — |
| **Form inputs (email, portfolio)** | uses `Input` primitive overridden via `.showcase-stage-v2 input[type=...]` rules in `showcase.css` L843–885 | static `.input` directly | **MEDIUM GAP**: showcase.css overrides at type-attribute selector. If `<Input>` renders with `type="text"` but no concrete type (or different element), the override misses. Verify by inspecting the DOM. | E: extend selector to `.showcase-stage-v2 input` (no type qualifier) AND `.showcase-stage-v2 [data-input]`, OR confirm Input primitive renders `<input type="text">` |
| **Search input** | `Input` + `showcase-search-input` className override = `padding-left: 38px !important; border-radius: 100px !important;` | static `.search-input` | works visually but `!important` is brittle — if Input adds tailwind padding it fights. Verify glyph centering. | F: prefer composition — wrap Input or render native `<input className="search-input">` |
| **Switch / Checkbox / Radio** | `PlaceholderControl.tsx` — **explicit visual stubs** matching static contract | same | none functionally | minor: comment says «until Phase γ ships them» — this is fine for showcase |
| **Portfolio cards** | `.showcase-pf-card` 18/22 padding, 18px radius, `--shadow-card`, broker mono eyebrow, 28px tabular amount, pulse indicator — **MATCHES** | same | none | — |
| **Insight card** | `.showcase-insight-card` — 20px head with `<strong>` accent, body 13px text-2 — **MATCHES** | same | minor: static has `position: relative; overflow: hidden;` — unused in React unless decorative ::before is added later | low priority |
| **Empty card** | `.showcase-empty-card` — 56×56 inset circle icon, 15px head, 12px body — **MATCHES** | same | none | — |
| **Charts grid** | `.showcase-charts-grid` 2-col 18px gap | `.ds-charts` 2-col 18px gap | none | — |
| **Chart card chrome** | `<ChartCard>` from `packages/ui` (asymmetric padding 22/24/20, 18px radius, `--shadow-card`) | `.chart-card` (same padding + radius + shadow) | **GAP**: ChartCard renders title at **15px** (`font-size: '15px'`); static renders `.chart-title` at **18px**. Static eyebrow uses `letter-spacing: 0.22em`; ChartCard uses `0.18em`. Title color in ChartCard uses `font-semibold tracking-tight` (Tailwind tracking-tight = -0.025em); static uses `letter-spacing: -0.025em` — matches but check Tailwind config | G: bump ChartCard title to 18px + bump eyebrow letter-spacing to 0.22em |
| **Chart legend** | static `.chart-legend` has **top-border 1px dotted divider** + 14px padding-top + 11px text-2 fonts; React Recharts `<Legend wrapperStyle={theme.legendStyle}>` IS configured correctly via `buildLegendWrapperStyle()` BUT only renders when `series.length > 1` (LineChart L151, AreaChart L115). DonutChart legend uses different `wrapperStyle` (DonutChart.tsx L173 — `align="right" verticalAlign="middle" layout="vertical"`) ignoring the theme's borderTop | H: **KEY** — make all charts render the static-style legend (with dotted top divider) consistently. DonutChart legend layout is fine vertical, but should still apply the borderTop divider style. Single-series Line/Area charts in static reference DO show legends ("Total" / "Cumulative"); React hides them. |
| **Chart note (FINRA caption)** | Treemap renders `<p className="mt-3 text-xs text-text-secondary">` | Static renders `.chart-note` (10px line-height 1.5 text-2) and Lane-A captions use `.chart-lane-a` with **terra left-rail border + inset bg + bronze mono uppercase label** | **GAP**: FINRA captions in React look like «small grey paragraph», not editorial Lane-A panels. The static design intent (legal disclaimer = visible footnote with rail, not whisper) is lost. | I: replace `<p className="mt-3 text-xs text-text-secondary">` with `<p className="chart-note">` + matching `.chart-note`/`.chart-lane-a` styles in `showcase.css` |
| **Disclaimer section** | section is rendered outside stages — fine | — | — | — |
| **Two-stage layout** | light → dark, stacked, 28px gap | same | none | — |

---

## Per-chart-kind audit

For each chart, comparing static reference SVG vs React Recharts implementation. Static line numbers cited; React file:line where applicable.

### LINE chart — `Portfolio value`

**Static (HTML L1186–1202):**
- 4 horizontal gridlines at y=36/72/108/144, `stroke="var(--chart-grid)" stroke-dasharray="2 4"` — **no axis tick labels at all**, no tick marks, no axis line.
- Single curve `path d="..."` with `stroke="var(--chart-series-1)" stroke-width="2"` — straight 2px stroke, no fill, no dots.
- Legend below: dotted-top-border, "Total" with green dot.

**React (LineChart.tsx + buildChartTheme):**
- ✅ Grid dasharray `2 4`, opacity 0.85, vertical=false — MATCH.
- ❌ **strokeWidth 1.75** vs static **2** — visually thinner. (`buildChartTheme.ts` L80)
- ❌ **Axis tick labels rendered** — Recharts paints "$220K / $230K / $240K" + dates at 10px Geist Mono. Static reference paints **no labels**. So the React chart looks busier.
- ❌ **Y-axis width 52px** carved out of chart area — pushes curve into smaller box than static.
- ❌ **activeDot r=5** — when hovered, paints jade dot with cream stroke. Acceptable, but inconsistent with static's «no dot» minimalism.
- ❌ **No legend renders** for single-series (`payload.series.length > 1` check at L151) — static SHOWS "Total" legend.

**Specific fixes:**
1. `buildChartTheme.ts:80` — change `strokeWidth: 1.75` → `2`.
2. `LineChart.tsx:151` — drop the `length > 1` gate so single-series legends render too.
3. **Decision required**: keep axis labels (matches CHARTS_SPEC §3) or remove for «editorial» feel (matches static reference). PO seems to want **static look** → consider `tick={false}` / `axisLine={false}` for line/area only.

### AREA chart — `Cumulative P&L`

**Static (HTML L1205–1227):**
- 3 gridlines (y=36/90/144), 30%→0% gradient, 2px stroke.
- Same axis-label-free aesthetic.

**React (AreaChart.tsx):**
- ✅ Gradient stops 0.30 / 0 — MATCH.
- ❌ Same strokeWidth 1.75 issue.
- ❌ Same «axis labels rendered» divergence.
- ❌ **No legend for single series** (`length > 1` check L115).
- ⚠️ Gradient ID uses `useId()` — fine, but rebuilds every render; not a visual issue.

**Specific fixes:** same as Line chart. Bump stroke to 2; consider axis-label suppression.

### BAR chart — `Position drift` + `Monthly P&L`

**Static (HTML L1230–1249):**
- Single zero-axis horizontal line `stroke="var(--chart-grid-strong)"` (no dasharray here in static — solid line).
- Bars **above zero**: rounded top corners (`rx=6 ry=6`), color `--chart-series-1`.
- Bars **below zero**: SHARP corners (no `rx`/`ry`), color `--chart-series-2`.
- Two-color legend: "Over-weighted" / "Under-weighted".

**React (BarChart.tsx):**
- ✅ `BAR_RADIUS = [6, 6, 0, 0]` — top corners rounded — MATCH.
- ❌ `colorBySign` (BarChart.tsx L155–160) re-uses BAR_RADIUS for both positive and negative bars. **All bars get `[6,6,0,0]` regardless of sign.** Static negative bars are **fully sharp** — the asymmetry is the visual signal that the bar grew downward.
- ❌ Reference line uses `strokeDasharray="2 4"` (BarChart.tsx L144) — static uses **solid** stroke for the zero baseline (`stroke="var(--chart-grid-strong)"` no dash).
- ❌ Drift caption (`DRIFT_CAPTION` L165) renders as `<p className="mt-3 text-xs text-text-secondary">` — looks like a whisper, not the editorial Lane-A footnote in static.

**Specific fixes:**
4. `BarChart.tsx:150` — pass per-cell radius via `<Cell radius={d.y >= 0 ? [6,6,0,0] : [0,0,0,0]}>`. (Recharts 3.x supports this.)
5. `BarChart.tsx:144` — drop `strokeDasharray="2 4"` for the zero ref line; make it solid 1px.
6. `BarChart.tsx:165` — wrap drift caption in `chart-lane-a` styling.

### DONUT chart — `Allocation by sector`

**Static (HTML L1252–1280):**
- Stroke-dasharray-based circles, **22px stroke-width** (single-circle ring trick).
- Center label `dc-value` 28px tabular + `dc-label` mono 10px uppercase.
- 5 legend items, vertical-or-horizontal flex, dotted top border.

**React (DonutChart.tsx):**
- ✅ 60% inner radius — MATCH.
- ❌ **paddingAngle=2 + stroke=var(--card) strokeWidth=2** doubled (DonutChart.tsx L151 + L162) — segments end up with **4px visual gap** instead of static's clean 2px stroke separator. Looks gappy/«broken pie» rather than «paper-cut sectors.»
- ❌ Active slice `expanded = outerRadius + 4` (L55) — overlaps glow ring (`expanded → expanded+4`), which becomes 8px outward total. On 220px donut that's 7% growth — feels excessive vs static's 1.02× spec quote (~+2px).
- ❌ Legend `<Legend layout="vertical" align="right">` — fine, but **wrapperStyle ignores the theme's `borderTop: 1px dotted` divider**. Two visual systems, side-by-side: every other chart's legend has the dotted rail above; donut's doesn't.
- ❌ **No center label** by default — static shows `$226K / PORTFOLIO`. React DonutChart only renders center if `centerLabel` prop or `payload.centerLabel` is provided. Showcase doesn't pass either (charts.tsx L98) — so the donut renders **without the iconic center value-and-eyebrow lockup**. This is the single biggest visual loss for donuts.

**Specific fixes:**
7. **HIGH IMPACT**: pass `centerLabel` to DonutChart in `charts.tsx:98` — `<DonutChart payload={DONUT_FIXTURE} size={240} centerLabel={<CenterLabel value="$226K" eyebrow="PORTFOLIO" />} />` (create `CenterLabel` helper in `_components/`).
8. `DonutChart.tsx:151` — drop `paddingAngle={2}` (Cell stroke alone separates segments).
9. `DonutChart.tsx:55` — reduce active expansion to `+2` (matches spec literal 1.02×).
10. `DonutChart.tsx:172–177` — apply `theme.legendStyle` to wrapperStyle for visual consistency.

### TREEMAP — `Concentration`

**Static (HTML L1369–1409):**
- Tiles with explicit `fill-opacity` levels (0.85 / 0.55 / 0.40 / 0.30) keying to magnitude of change — beautiful gradation.
- White `stroke="var(--card)" stroke-width="1"` separators.
- Inline labels: ticker (Geist 12–13 600), pct (Geist Mono 9–10), pre-baked dark/light `fill` per tile.
- 5-step legend showing the opacity bands.
- FINRA chart-note below.

**React (Treemap.tsx):**
- ⚠️ `colorForTreemapChange` (tokens.ts) returns one color per tile, no explicit opacity gradation. Visual richness reduced.
- ⚠️ Tile labels use `fontFamily="var(--font-mono)"` for ticker (line 105) — static uses **Geist (sans)** for ticker, Geist Mono only for pct. Visual divergence — ticker reads more «code» than «editorial.»
- ❌ Active state filter `brightness(1.06)` + 2px ink stroke — this looks fine, but static doesn't have any hover state at all (it's static SVG). Either is acceptable.
- ❌ FINRA caption rendered as `<p className="mt-3 text-xs text-text-secondary">` — same Lane-A issue as BarChart.

**Specific fixes:**
11. `Treemap.tsx:105` — change ticker label `fontFamily="var(--font-mono)"` → `var(--font-sans)`.
12. `tokens.ts colorForTreemapChange` — add opacity bands (3-step) to match static's 5-step gradient. Or accept current (single-color) treatment as deliberate simplification.
13. `Treemap.tsx:225` — wrap caption in `chart-lane-a` / `chart-note` class.

### SPARKLINE — `Inline trend`

**Static (HTML L1283–1304):**
- 60×20 SVG, `stroke-width="1.5"`, just a path, no axes, no fill.
- Inline lockup: amount (Geist 500) + delta (Geist 600 jade/terra) + svg.

**React (`Sparkline.tsx`):**
- Did not deep-read — sparkline is structurally simple. PO may need to verify it renders as inline lockup not as standalone card. **Audit recommended:** is the sparkline used inside `.chart-card` (which wraps it in 22/24/20 padding) or inline? If wrapped in a card per `charts.tsx:104`, the «inline» feel is lost.

**Fix proposal:**
14. **Visual decision**: drop ChartCard wrapper for sparkline (charts.tsx L100–108) — render as 3-row inline lockup with no card chrome, matching static's stacked `.spark-inline` rows.

### CALENDAR — `Dividend calendar`

**Static (HTML L1307–1366):**
- 7-col grid, 56px cell min-height, 4px gap.
- Cells have `var(--inset)` bg, 8px radius.
- DOW header 9px mono 0.22em letter-spacing.
- Day numbers 11px tabular.
- Pills: received=accent fill, scheduled=series-4, announced=outlined series-7, corp_action=terra **with diamond clip-path** + 4/12 padding.
- Today indicator: 2px accent border-bottom under day number.

**React (Calendar.tsx):**
- Implementation likely matches via `cal-pill.*` classes copied to showcase.css L919–924. Spot-check needed:
  - Diamond clip-path for corp_action — present in showcase.css L924 ✓
  - Today border-bottom — L917 ✓
  - DOW letter-spacing — L913 ✓
- ⚠️ One concern: **calendar legend** in static (HTML L1360–1365) has 4 items including the diamond corp_action shape. Verify Calendar.tsx renders this legend.

**Fix proposal:** if Calendar.tsx omits the legend, add it. Otherwise calendar appears solid.

### STACKED BAR — `Broker contribution`

**Static (HTML L1416–1438):**
- 6 vertical groups, 3 segments each.
- Bottom segment (IBKR): sharp corners.
- Middle segment (Binance): sharp corners.
- **Top segment (LYNX): rounded top corners only** (`rx=6 ry=6`).
- Card-stroke 1px between segments.

**React (StackedBar.tsx):**
- Needs verification. Recharts `<Bar radius>` applied at series level — only the topmost series should get `[6,6,0,0]`, lower series should get `[0,0,0,0]`. If the spec applies `BAR_RADIUS` to all series uniformly, **every segment has rounded top → segments float instead of stacking visually**.

**Fix proposal:**
15. Audit StackedBar.tsx: confirm only **top series** receives `radius={[6,6,0,0]}`; lower series get `[0,0,0,0]`.

### WATERFALL — `Where your value came from`

**Static (HTML L1469–1525):**
- 8 component bars + start/end anchors.
- Anchor bars use `chart-series-3` (ink) at 0.85 opacity, 4px radius.
- Component bars: positive=`chart-series-1`, negative=`chart-series-2`, 2px radius.
- **Connector lines** between bars at `stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"` — they SHOW the cumulative running total visually.
- Component value labels above bars: 10px mono, color-matching the bar.

**React (Waterfall.tsx):**
- Needs verification. Connector lines and value labels are NOT a Recharts native feature — they require custom `<ReferenceLine>` or composed shapes. If Waterfall.tsx uses native Recharts BarChart with stacked bars and no connectors, it loses the «cash-flow story» feel of static.

**Fix proposal:** treat as known gap; tag as Tier-2 P3 (waterfall is genuinely hard in Recharts and cosmetic improvements are large effort).

### Empty / loading states

**Static (HTML L864–904):**
- Empty: dashed-border card, 220px height, mono eyebrow, 40×40 inset square icon, 14px head, 12px body.
- Loading: 220px shimmer with `var(--inset)` → `var(--card)` → `var(--inset)` linear gradient.

**React (`ChartEmpty.tsx`, `ChartSkeleton.tsx`):**
- Already implemented. Verify the dashed border + eyebrow chrome matches.

---

## Top-10 priority refinement order (highest visual leverage first)

Optimised for «PO opens page → goes from ‹отвратительны› to ‹хорошо›» with minimum work.

1. **Donut center label** (fix #7) — single biggest «wow» loss; add 2-line lockup `$226K / PORTFOLIO` to charts.tsx donut prop.
2. **Button primary CTA shadow** (fix #D) — audit `packages/ui/src/Button/Button.tsx`. If primary doesn't use `--shadow-primary-extrude` + radius 14px + transform-on-press, the entire brand «extruded ink» language is silently absent. Highest-leverage **single** fix; touches every CTA in the page.
3. **Single-series legend visibility** (fix #2) — flip the `length > 1` gate in Line/Area; static shows «Total» / «Cumulative» single-item legends with dotted top divider.
4. **Bar chart — sign-asymmetric radius + solid zero ref line** (fixes #4, #5) — the «above-zero rounded, below-zero sharp» asymmetry is iconic in static; React loses it.
5. **Chart line stroke-width 1.75 → 2** (fix #1) — `buildChartTheme.ts:80`. One-character change, lifts every line/area chart.
6. **Donut paddingAngle removal** (fix #8) — rooty cause of «gappy donut.»
7. **Chart card title 15→18 + eyebrow letter-spacing 0.18→0.22em** (fix #G) — `ChartCard.tsx:60–69`. Matches static `.chart-title` / `.chart-eyebrow`.
8. **FINRA / drift captions wrapped in `.chart-lane-a` / `.chart-note`** (fixes #6, #13, #I) — replace `<p className="mt-3 text-xs text-text-secondary">` with the editorial Lane-A panel; serves a11y AND brand voice (legal disclosure becomes editorial, not whisper).
9. **Sparkline drop card chrome** (fix #14) — render inline as static does; «inline trend» metaphor restored.
10. **Treemap ticker font-family sans not mono** (fix #11) — `Treemap.tsx:105`.

After these 10, the page should read «полированно». Items beyond require more invasive Recharts work (Waterfall connectors, axis-label suppression decision).

---

## 5 concrete fix proposals — copy-paste-ready cite list

| # | File | Line | Change |
|---|---|---|---|
| 1 | `packages/ui/src/charts/_shared/buildChartTheme.ts` | 80 | `strokeWidth: 1.75` → `2` |
| 2 | `apps/web/src/app/design-system/_sections/charts.tsx` | 98 | Pass `centerLabel={<><span className="dc-value">$226K</span><span className="dc-label">PORTFOLIO</span></>}` to `<DonutChart>` |
| 3 | `packages/ui/src/charts/DonutChart.tsx` | 151 | Drop `paddingAngle={2}` |
| 4 | `packages/ui/src/charts/LineChart.tsx` | 151 | Render `<Legend wrapperStyle={theme.legendStyle} />` unconditionally (drop `length > 1` gate) |
| 5 | `packages/ui/src/charts/AreaChart.tsx` | 115 | Same as #4 |
| 6 | `packages/ui/src/charts/_shared/ChartCard.tsx` | 67–69 | Title font-size `'15px'` → `'18px'`; eyebrow `0.18em` → `0.22em` |
| 7 | `packages/ui/src/charts/BarChart.tsx` | 144 | Drop `strokeDasharray="2 4"` on `<ReferenceLine>` (zero baseline = solid) |
| 8 | `packages/ui/src/charts/BarChart.tsx` | 148–161 | Per-cell radius via `<Cell radius={...}>` — `[6,6,0,0]` for `d.y>=0`, `[0,0,0,0]` for negative |
| 9 | `packages/ui/src/charts/Treemap.tsx` | 105 | Ticker label `fontFamily="var(--font-mono)"` → `"var(--font-sans)"` |
| 10 | `apps/web/src/app/design-system/_styles/showcase.css` | new | Add `.chart-note { ... }` and `.chart-lane-a { ... }` rules **port from `apps/web/public/design-system.html` L803–818** |
| 11 | `packages/ui/src/charts/BarChart.tsx` | 165 | Wrap drift caption in `<p className="chart-note chart-lane-a"><strong>FINANCE NOTE</strong> {DRIFT_CAPTION}</p>` |
| 12 | `packages/ui/src/charts/Treemap.tsx` | 225 | Same wrap as #11 with FINRA caption |
| 13 | `apps/web/src/app/design-system/_sections/charts.tsx` | 100–108 | Sparkline rendered without ChartCard wrapper — direct inline lockup |
| 14 | `packages/ui/src/Button/Button.tsx` | (audit) | Confirm primary variant uses `var(--shadow-primary-extrude)` + radius 14 + `translateY(-1px)` hover / `translateY(1px)` active |
| 15 | `packages/ui/src/charts/StackedBar.tsx` | (audit) | Top series gets `radius={[6,6,0,0]}`; lower series `[0,0,0,0]` |

---

## ui-ux-pro-max query report

Four queries run; key insights synthesized.

### Q1 — `--domain chart "minimal axis typography stroke gradient polish editorial"`

Results: 2 chart guidelines (3D — irrelevant; **Line Chart**).
**Useful insight:** the canonical Line Chart guidance says «Multiple series: distinct colors **+ distinct line styles**». Our React Line chart series-7-on-dark auto-swap addresses color, but if we ever ship multi-series lines we should add `strokeDasharray` per series for colorblind safety. Logged as P3 enhancement, not part of current refinement order.
Also: «Fill: 20% opacity» — our area gradient at 30% is slightly punchier than recommended; static reference also says 30%. Keep at 30% (matches brand intent of «felt presence»).

### Q2 — `--domain ux "tactile editorial design system polish hierarchy density"`

Results: Touch (haptic — irrelevant on web), Mobile-First (we already are), Loading Indicators («> 300ms = skeleton» — we comply via `ChartSkeleton`).
**Most useful insight:** «Loading Indicators severity HIGH». Our chart loading skeletons already exist; verify they trigger on actual data fetch (not just demo). Outside this audit's scope.

### Q3 — `--domain style "editorial paper minimal financial cream warm"` ⭐ MOST USEFUL

Results: **E-Ink/Paper** (closest archetype match), Financial Dashboard, Anti-Polish/Raw.
**Key insights:**
- **E-Ink/Paper** keywords match Provedo intent **exactly**: «paper-like, matte, high contrast, texture, reading, calm, slow tech, monochrome.» Recommended technical keywords: `font-family: serif for reading` (we deliberately don't, Geist is the brand call), `no gradients` (we have one — area chart gradient — keep it small), `border: 1px solid #E0E0E0` (matches our `--border`), `texture overlay (noise)` (we don't have one — **could be one micro-add for «paper feel»**).
- **Financial Dashboard** anti-pattern warning: profit/loss color usage `#22C55E / #EF4444` — we deliberately avoid these (forest-jade #2D5F4E / bronze #A04A3D) for muted-financial signal. **Validates current palette decision.**
- **Anti-Polish/Raw** cited «Kraft Brown #C4A77D» as authentic-paper accent — adjacent to our terracotta #A04A3D. Our terra is in the family; not a fix, just confirmation.

**Actionable takeaway:** Provedo style profile is closest to **E-Ink/Paper**, NOT «Financial Dashboard». The «paper-feel» is intentional and right; «отвратительны» feedback on charts likely traces to **lack of paper texture** + **Recharts default look** dominating. Suggesting **micro-grain noise overlay** in `--card` is a future-state experiment (Phase γ); too risky for current refinement pass.

### Q4 — `--domain typography "professional calm Geist tabular numerals editorial"`

Results: Wellness Calm (Lora+Raleway), News Editorial (Newsreader+Roboto), Magazine Style (Libre Bodoni+Public Sans).
**Useful insight:** all 3 recommended editorial pairings are **Serif + Sans**. Provedo uses **Geist + Geist Mono** (sans + monospace) — deliberate choice for legibility with tabular numerals. This is **uncommon** for editorial-feel products; our brand voice is editorial-via-restraint, not editorial-via-serif. Validates current choice but flags: any future «long-form reading» surface (e.g. insight detail page, prospectus) **could** benefit from a third serif family for body copy. Logged as future consideration, not for current refinement.

---

## Brainstorming session record (per `superpowers:brainstorming` discipline)

**Question:** What's the highest-leverage path from «не красиво» to «красиво» on `/design-system`?

5 alternative approaches considered and discarded:

1. **«Restyle from scratch with a different visual direction»** (e.g. neo-brutalism, glassmorphism). **Discarded** — Provedo design system is locked at v1.1; visual direction is ratified across brand-strategist + content-lead + finance-advisor + a11y-architect. PO's «не красиво» is execution gap, not direction gap. Switching styles would invalidate ~15 specs.

2. **«Add a noise/grain texture to all `--card` surfaces»** (one of the E-Ink/Paper recommendations from ui-ux-pro-max Q3). **Discarded for current pass** — high visual impact, but invasive (affects every card across product), risks performance, requires asset creation, and crosses into brand-strategist's territory (atmosphere is brand, not just design). Logged as Phase γ experiment.

3. **«Replace Recharts with hand-rolled SVG components matching static reference exactly»**. **Discarded** — guarantees static-fidelity but loses interactivity (hover, keyboard nav, screen reader, responsive resize, animation). Static reference is read-only mock; React stage is production base. Cost-benefit fails.

4. **«Add a glass-blur overlay on stage frames for depth»**. **Discarded** — Provedo's «calm over busy» principle says no atmospheric tricks. Brand-strategist would rightly flag.

5. **«Hire a third-party design audit»** (CONSTRAINTS Rule 1: no spend). **Discarded** — and not needed; this audit identifies the gap without external help.

**Selected approach:** **Plumbing-and-precision** — the static reference's polish is overwhelmingly already paid for in `showcase.css` (902 lines). React sections wire to it correctly for layout but miss it for several chart-specific chrome details (legend dividers, FINRA captions, donut center) and the chart components themselves embed Recharts defaults that diverge from the static SVG values (stroke 1.75 vs 2; uniform bar radius vs sign-asymmetric; doubled donut paddingAngle + Cell stroke). Sharpen these 14 specific call-sites; do not introduce new visual systems.

This is the lowest-risk, highest-yield approach. Estimated effort: <2 hours focused work for fixes 1–10. Each fix is a 1-line or 1-block change. Visual delta should be substantial.

---

## Open questions / parking lot (for Right-Hand synthesis)

- **Q1**: should Line/Area charts SUPPRESS Recharts axis labels (matching static's editorial bare-grid look), or KEEP them (matching CHARTS_SPEC §3 which explicitly mandates axis tick labels)? **Spec contradicts static.** PO must arbitrate.
- **Q2**: should the chart palette enforce `--chart-series-N` everywhere, or fall back to `tokens.ts SERIES_VARS`? Current code mixes both. Worth a tech-lead audit.
- **Q3**: Button primitive audit — separate dispatch needed if `Button.tsx` doesn't apply `--shadow-primary-extrude`.

---

## R1 / R4 / no-velocity compliance

- **R1**: no paid services consulted. ui-ux-pro-max free CLI only.
- **R4**: no predecessor name surfaced.
- **No velocity metrics**: this audit cites «<2 hours focused work» as wall-clock estimate for a discrete, bounded scope; no story-points or LOC counts. Quality is the metric — count of distinct «not Provedo» moments PO can identify after fixes apply.
