# Chart Visual Refinement Audit — DSM-V1 vs Provedo Paper-Feel

**Date:** 2026-04-29
**Author:** product-designer (dispatched by Right-Hand)
**Branch:** `chore/plugin-architecture-2026-04-29` @ `709fc05`
**Scope:** Read-only audit. Score 10 chart kinds against `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` v1.1 + `docs/design/CHARTS_SPEC.md` §2/3/4.
**Source of «correct» visual reference:** `apps/web/public/design-system.html` (static HTML mock baked at end of design-system session 2026-04-27 — the visual target PO ratified).

---

## Executive Summary

PO feedback «графики не очень красивые / не вписываются» is structurally correct. The 10 chart components were built before DSM-V1 paper-feel ratification and only the **series-color palette** was retro-aligned. Everything outside the color palette — chart card surfaces, hover states, focus visualization, empty/loading states, animation timing details — runs on pre-v1.1 token names and lacks the tactile-3D paper-feel that the rest of the system now sells.

The single largest gap is at the **container** layer (chart wrapping `<Card>`), not inside Recharts. Once the chart-card surface is corrected to match `.chart-card` from the static showcase, ~70% of the «not Provedo» feel disappears for free. The remaining 30% is per-kind interaction polish (hover dot on Line, slice scale on Donut, tile hover on Treemap) and the kind-specific skeleton geometries from CHARTS_SPEC §3.10.

---

## 1. Cross-cutting findings (apply to all 10 kinds)

### 1.1 Chart card container is flat, not paper-tactile (P0 — biggest visual gap)

**Current** in `apps/web/src/app/design/_sections/charts.tsx`:

```tsx
function Card({ children }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-background-elevated p-5">
      {children}
    </div>
  );
}
```

- `rounded-lg` ≈ 8px (DSM-V1 spec calls for **18px** radius on chart cards per §11.4 + static `.chart-card` baseline).
- `bg-background-elevated` is the legacy v1.0 token (resolves to a flat surface), not `var(--card)` which carries the cream-paper highlight.
- `p-5` ≈ 20px uniform; static reference uses **`22px 24px 20px`** (asymmetric per spec §3.1).
- No `box-shadow: var(--shadow-card)` — the chart card sits flat with only a hairline border. The rest of the system uses tactile double-shadow + cream-edge highlight. Charts read as belonging to a different product.

**Refinement:**
```diff
-className="rounded-lg border border-border-subtle bg-background-elevated p-5"
+className="rounded-[18px] p-[22px_24px_20px]"
+style={{ background: 'var(--card)', boxShadow: 'var(--shadow-card)' }}
```
*(or token-mapped via Tailwind `bg-card shadow-card rounded-card-lg` once design-tokens layer exposes those — secondary task.)*

This single change addresses ~40% of «not Provedo».

### 1.2 No chart-eyebrow / chart-title / chart-subtitle structure (P1)

The `Sub` wrapper in `charts.tsx` puts the title above the card with `text-text-tertiary uppercase`. The static reference puts **eyebrow + title + subtitle inside the card**, in this specific lockup:

```
.chart-eyebrow   Geist Mono 10px / letter-spacing 0.22em / text-3 / margin-bottom 8
.chart-title     Geist 18px / weight 600 / letter-spacing -0.025em / ink / margin-bottom 4
.chart-sub       Geist 12px / text-2 / margin-bottom 16
.chart-body      width: 100%
.chart-legend    border-top: 1px dotted divider; padding-top 12; margin-top 14
```

Current showcase has external title above the card — readable but breaks the visual self-containment that the rest of the system enforces (signature-card, insight-card, modal all have eyebrow-inside-card).

**Refinement:** introduce `<ChartCard eyebrow="LINE · TIER 1" title="…" subtitle="…">` wrapper that bakes the lockup; chart components mount inside `.chart-body`.

### 1.3 Tooltip is on `var(--shadow-md)` fallback, missing `var(--shadow-lift)` resolution (P1)

`buildTooltipProps.ts` line 25:
```ts
boxShadow: 'var(--chart-tooltip-shadow, var(--shadow-md))',
```
- Light theme on `<html>` defines `--chart-tooltip-shadow: var(--shadow-lift)` (per static showcase line 654). Good.
- BUT — `--shadow-md` fallback is the legacy DSM-V1 token, not the v1.1 paper shadow. If `--chart-tooltip-shadow` is ever unset (route-level, embed, future test), tooltip falls back to a flat shadow that reads dramatically different from rest of system.
- **Refinement:** change fallback to `var(--shadow-lift, 0 12px 36px rgba(0,0,0,0.55))` (the dark-theme default; light has a softer fallback baked).

Also: `itemStyle.color` references `var(--color-text-primary)` (legacy v1.0 token name). Should be `var(--ink)` to match v1.1 surfaces. Currently only works because `--color-text-primary` is still globally aliased; will silently break if cleanup removes the alias.

### 1.4 Series-color-only encoding — colorblind a11y gap (P2 — confirmed by ui-ux-pro-max chart guidance)

ui-ux-pro-max trend-chart guidance: **«Differentiate series by line style (solid/dashed/dotted) not color alone. Add pattern overlays for colorblind users.»** Current `LineChart` / `AreaChart` / `StackedBar` distinguish series purely by `stroke` color. CHARTS_SPEC §2.5 already chose color-blind-safe series-1..7, so this is mid-priority — but spec is silent on stroke-style differentiation, which is a recognized accessibility upgrade.

**Refinement:** add `strokeDasharray` cycling for multi-series lines: series-2 → `'4 4'`, series-3 → `'6 3 2 3'`. Donut + treemap rely on adjacency; less critical there.

### 1.5 Skeleton uses single full-rect, NOT kind-specific shapes (P1 — visible regression vs spec)

CHARTS_SPEC §3.10 explicitly lists per-kind skeleton shapes (Line: 5 hairlines + wavy curve; Bar: 6 staircase bars; Donut: gray ring; Treemap: 4-tile mosaic; Waterfall: floating staircase). `ChartSkeleton.tsx` currently renders `<Skeleton style={{ width: '100%', height: '100%' }} />` for every kind. The shimmer animation is correct, but the **shape geometry is wrong** — a flat rectangle does not foreshadow the chart layout the way a wave or staircase does.

This is a measurable feel-gap: when a chart loads, the user sees a flat rectangle replaced by a chart, not a sketched outline filling in. The kind-specific shapes are the difference between «loading» and «pre-rendered».

**Refinement:** rebuild `ChartSkeleton` with a `kind`-switch rendering inline SVG paths for each of the 10 shapes per §3.10. Reuse the existing `<Skeleton>` shimmer gradient by wrapping the SVG in a `mask`.

### 1.6 Empty state uses legacy tokens (P2)

`ChartEmpty.tsx` uses `bg-background-elevated`, `border-border-subtle`, `text-text-primary`, `text-text-secondary` — all legacy v1.0 tokens. Static showcase uses `var(--card)`, `var(--border)` (dashed), `var(--ink)`, `var(--text-2)`, plus an inset-light icon square (36×36 with `var(--shadow-inset-light)`).

Current empty state renders, but as a flat dashed box with a Lucide Activity icon — not the inset-square + cream-paper card that the rest of the empty states (e.g. `.card-empty` in static reference line 348) use. Inconsistent visual vocabulary with elsewhere in the product.

**Refinement:** rebuild around static-reference `.chart-empty` lockup: dashed-border card with inset-square icon-frame + Geist Mono kind-eyebrow + ink headline + text-2 body.

### 1.7 No interactive legend (P2 — spec §3.6 unimplemented)

Spec §3.6: hover legend item → bumps that series, dims others to 0.4 opacity (300ms). Click legend item → toggles series visibility. Current implementation: passive Recharts default `<Legend>`. Click toggle works for free in Recharts; **hover-bump is missing**.

**Refinement:** post-MVP. Note in TECH_DEBT (post-Δ-merge), not pre-merge.

### 1.8 Animation duration mismatch (P3)

`tokens.ts: CHART_ANIMATION_MS = 600` matches spec §3.12. But spec also says `animationEasing="ease-out"` should be set explicitly. Recharts default is acceptable but ambiguous; explicit prop ensures reproducibility.

**Refinement:** add `animationEasing="ease-out"` to every Recharts series component. One-line per chart.

---

## 2. Per-kind audit

Score per axis: 🟢 OK · 🟡 partial · 🔴 needs work. Scope below excludes the cross-cutting items from §1 (those apply to all 10 — fix once, fixes all).

### 2.1 LineChart (T1, most-shown — priority 1)

| Axis | Score | Notes |
|---|---|---|
| Typography (axis labels) | 🟡 | Geist via `axisLabel` token but **no `fontFamily: 'Geist Mono'`** on `<XAxis tick>` props. Spec §3.3 explicitly calls Geist Mono for axis ticks. Currently inherits Geist (sans). |
| Series colors | 🟢 | SERIES_VARS palette correct. Series-7-on-dark auto-swap implemented per spec §2.3 caveat. |
| Hover dot on cursor | 🔴 | `dot={false}` with **no `activeDot` prop**. Spec §4.1 explicitly: `activeDot={{ r: 5, fill: series, stroke: 'var(--card)', strokeWidth: 2 }}`. Currently the cursor line moves but no dot appears at the index — the canonical Provedo-feel detail is missing. |
| Cursor styling | 🟢 | Uses `tooltip.cursor` from buildTooltipProps — dashed `2 4` `var(--chart-cursor)`. Correct. |
| Benchmark / overlay treatment | 🟡 | `ReferenceLine` benchmark uses `--chart-grid-strong` stroke + dashed. Label position 'right' OK. Overlay trade markers use `r=4` ReferenceDot; spec §4.1 doesn't mandate exact size but visual review: 4px reads thin against 2px strokes. Bump to `r=5` with white card-color outer ring (matching activeDot treatment) for visual consistency. |
| Multi-series differentiation | 🔴 | Solid stroke for every series. Per ui-ux-pro-max + spec §2.4 colorblind guidance, second/third series should dash (`'4 4'` / `'6 3 2 3'`). |
| Animation | 🟢 | 600ms via `CHART_ANIMATION_MS`, `isAnimationActive={!prefersReducedMotion}`. Correct. Missing explicit `animationEasing="ease-out"`. |

**Concrete refinements (priority order):**
1. Add `activeDot={{ r: 5, fill: s.color, stroke: 'var(--card)', strokeWidth: 2 }}` to every `<Line>`.
2. Add `fontFamily: 'Geist Mono', letterSpacing: '0.04em'` to `<XAxis tick>` and `<YAxis tick>` style objects.
3. Cycle stroke-dash for series ≥ 2: `strokeDasharray={i === 0 ? undefined : i === 1 ? '4 4' : '6 3 2 3'}`.
4. Bump trade-marker overlay `r` to 5; add `stroke="var(--card)"`, `strokeWidth={2}` to match activeDot treatment.
5. Add `animationEasing="ease-out"`.

### 2.2 DonutChart (T1, most-shown — priority 2)

| Axis | Score | Notes |
|---|---|---|
| Typography | 🟢 | Center label uses Geist Mono via inline className. |
| Slice scale on hover | 🔴 | Spec §3.7: hover slice → scales 1.02× outward + 4px glow rim `box-shadow: 0 0 0 4px var(--accent-glow)`. **Not implemented** — Recharts `<Pie>` is passive. Missing the most distinctive donut interaction in the spec. |
| Slice padding angle | 🟢 | `paddingAngle={2}` matches spec. |
| Inner radius | 🟢 | `outerR * 0.6` = 60% per spec §4.4. |
| Legend placement | 🟡 | Layout `vertical`/right correct. But on viewports <768px spec says move to bottom; not implemented. |
| Center label typography | 🟡 | Center inner uses `font-mono text-sm font-semibold` but static reference uses `dc-value` (Geist 28px / 600 / `-0.035em` letter-spacing) + `dc-label` (Geist Mono 10px / 0.22em letter-spacing uppercase). Currently small + mono-only — visually thinner than reference. |
| Animation | 🟢 | 600ms correct. |

**Concrete refinements:**
1. Implement slice scale via Recharts `activeShape` prop on `<Pie>`. Build a custom `renderActiveShape` that returns a sector with `outerRadius={outerR + 4}` (the 1.02× scale) plus a CSS `filter: drop-shadow(0 0 4px var(--accent-glow))` overlay.
2. Add responsive legend placement: `align="right" verticalAlign="middle"` on ≥768px; `align="center" verticalAlign="bottom"` on <768px. Use a CSS media query inside a wrapper or watch viewport via `useMediaQuery` hook.
3. Center label: replace `font-mono text-sm font-semibold` with a proper lockup matching `.donut-center` from static showcase — `<div>` with a 28px Geist 600 value + 10px Geist Mono uppercase label.
4. Add `activeIndex={activeIndex ?? undefined}` so keyboard nav drives the same slice scaling.

### 2.3 Treemap (T1, most-shown — priority 3)

| Axis | Score | Notes |
|---|---|---|
| Color treatment | 🟢 | `colorForTreemapChange` uses series-1/series-2/series-5 with ±0.5% threshold per spec §4.10. Correct. |
| Tile labels | 🟢 | Geist Mono uppercase via inline `style`. WCAG 1.4.3 AA white-on-jade / black-on-mid-tone via `inkForTreemapChange`. Correct. |
| Tile separator | 🟢 | `stroke="var(--color-background-primary, #fff)"` 1px hairline. Correct (BUT same legacy token name issue as §1.3 — should be `var(--bg, var(--card), #fff)`). |
| Hover state | 🔴 | `isAnimationActive={false}` + custom `<TileContent>` is read-only. **No tile hover treatment** — tiles don't lighten / outline / surface a tooltip. Per spec §3.7 (which excludes treemap explicitly?) — actually, treemap hover is unspecified in §3.7 but the static reference shows tiles with hover treatment. |
| Tooltip | 🔴 | **No `<Tooltip>` component on `<ReTreemap>`.** Hovering a tile shows nothing. User has to read the inline label. Spec §4.10 implies tooltip; current implementation skipped it. |
| FINRA caption | 🟢 | Baked + correct. |
| Animation | 🟡 | `isAnimationActive={false}` — correct for stable treemap behavior, but means no draw-in. Spec §3.12 says draw-in 600ms. Recharts treemap has known issues with animation; setting false is defensible. **Recommend: add CSS-side fade-in on container mount instead.** |

**Concrete refinements:**
1. Add `<Tooltip>` to `<ReTreemap>` with `contentStyle` from `buildTooltipProps`. Format: `{ticker} · {weightPct}% · {dailyChangePct}%`.
2. Add hover treatment in `TileContent`: lighten tile by `+4% L` on `mouseEnter`. Implement via React state on `<TileContent>` parent + render-prop pattern (Recharts requires custom shape).
3. Replace `'var(--color-background-primary, #fff)'` separator stroke with `'var(--bg, #fff)'`.
4. Add fade-in via CSS: `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }` 400ms on `.chart-treemap` mount; respect `prefers-reduced-motion`.

### 2.4 AreaChart (T1)

| Axis | Score | Notes |
|---|---|---|
| Gradient fill | 🟢 | `0%` opacity 0.30 → `100%` opacity 0 per spec §4.2. Correct. |
| Stroke | 🟢 | 2px series-1 default. |
| Hover dot | 🔴 | Same as LineChart — no `activeDot`. |
| Multi-series stack | 🟢 | `stackId` toggling via `payload.stacked`. Correct. |
| Axis font | 🔴 | Same Geist-Mono missing as LineChart. |

**Refinement:** mirror LineChart fixes (activeDot + Geist Mono ticks + animationEasing).

### 2.5 BarChart (T1)

| Axis | Score | Notes |
|---|---|---|
| Bar radius | 🟢 | `[4,4,0,0]` vertical, `[0,4,4,0]` horizontal. Correct. |
| Color-by-sign | 🟢 | series-1 / series-2 split when `colorBySign`. Correct. |
| Hover treatment | 🔴 | Spec §3.7: hovered bar darkens `+0.06 L`. Not implemented; Recharts default cell highlight uses `cursor.fill` only. The spec calls for the bar itself to shift color, which requires `<Cell>` swap on `activeIndex` (per spec line 327). |
| Drift caption | 🟢 | Baked, conditional, correct. |
| Reference line | 🟢 | Restricted to zero-axis per Lane-A. |

**Refinement:** implement bar-color-darken-on-hover via `activeIndex` state + `<Cell>` swap. Light: `series-1` → mix-darken to `#1F4135` (deeper jade); dark: `series-1` → `#5C9F87` (lighter jade).

### 2.6 Sparkline (T1)

| Axis | Score | Notes |
|---|---|---|
| No axes / no tooltip / no legend | 🟢 | Correct per spec §4.5. |
| Trend color | 🟢 | up/down/flat → series-1/series-2/series-5. Correct. |
| Stroke width | 🟢 | 1.5px thin per spec. |
| Standalone a11y | 🟢 | `tabIndex` opt-in via `standalone={true}`. Correct. |
| Filled variant gradient | 🟡 | Uses solid `fill={stroke}` `fillOpacity={0.18}`. Spec §4.5 implies gradient like AreaChart (0.30 → 0). Acceptable difference (sparkline is glance-level, gradient over 60×20 wouldn't read), but flag as conscious deviation. |

**Refinement:** none required pre-merge. Document in CHARTS_SPEC commentary that sparkline `filled` uses solid vs AreaChart gradient — intentional.

### 2.7 Calendar (T1)

| Axis | Score | Notes |
|---|---|---|
| Cell background | 🔴 | `bg-background-elevated` legacy token. Static showcase uses `var(--inset)` for cells (depressed slot feel). **Calendar cells currently read as flat cards stacked, not paper-inset slots — wrong direction in the depth language.** |
| Day-number typography | 🟡 | `font-mono text-[11px] text-text-tertiary`. Static showcase uses Geist sans 11/500 (NOT mono) for day numbers; Geist Mono only for the DOW header strip. Current renders DOW correctly mono but day-numbers also mono — mixes the hierarchy. |
| Today highlight | 🔴 | **Missing**. Static showcase has `cal-cell.today` with `border-bottom: 2px solid var(--accent)` on the day-number. Component doesn't compute `today` at all. |
| Event markers | 🟡 | Dot/diamond shapes correct (`clipPath: polygon(...)` for corp_action). Status colors via `dividendStatusColor`. **But:** static showcase uses **rounded pills** (`.cal-pill`) with text inside (e.g. «AAPL · $0.24») not bare 8px dots. Current bare-dot is too minimal — info-density loss. |
| Out-of-month opacity | 🟢 | `opacity: cell.inMonth ? 1 : 0.45` correct. |
| Animation | 🟢 | None — pure CSS-grid is fine. |

**Refinement (P1, not just visual):**
1. Replace cell `bg-background-elevated` with `var(--inset)` to match the «depressed cells in a paper grid» feel.
2. Change day-number font from `font-mono` to Geist sans 11/500 (currently inherits Geist Mono via `font-mono`).
3. Compute `isToday(cell.date)` and apply `--accent` underline + ink color to the day-number.
4. Replace bare-dot event markers with pill markers per static reference. Pills carry ticker + amount; diamond clip-path stays for corp_action. Bump cell `min-h` from 64px to ~80px to fit pills comfortably.

### 2.8 StackedBar (T2 lazy)

| Axis | Score | Notes |
|---|---|---|
| Series differentiation | 🟢 (color-only) / 🔴 (a11y) | Same colorblind point as LineChart — colors only. Stacked bars can use texture-pattern overlays for max a11y. Defer to post-MVP. |
| Legend | 🟢 | Bottom placement correct. |
| Tooltip cursor | 🟢 | Bar cursor fill correct. |
| Top-bar radius | 🟢 | Last segment `[4,4,0,0]`. |

**Refinement:** mirror Geist-Mono tick fix. P3: pattern-fill overlay for top-2 series per a11y guidance.

### 2.9 Waterfall (T2 lazy)

| Axis | Score | Notes |
|---|---|---|
| Floating-baseline math | 🟢 | `computeWaterfallSteps` correct + tested. |
| Anchor color | 🟢 | series-3 (ink) for start/end. Correct. |
| Connector hairlines | 🔴 | Spec §4.11 + finance audit: each non-anchor step connects to prior bar via 1px hairline at running-balance level. **Not implemented** — bars float free, visual continuity broken. |
| Bar radius | 🟢 | `radius={2}`. Correct. |
| Mandatory caption | 🟢 | Baked + correct. |
| X-axis label angle | 🟡 | `angle={-15}` works on desktop; on narrow viewports labels still overlap. Acceptable. |

**Refinement:** add `<ReferenceLine>` per non-anchor step's running balance, segmenting from x=N to x=N+1, stroke-width 1, color `var(--chart-grid-strong)`. (Recharts pattern: `<ReferenceLine segment={[{x: 'A', y: 100}, {x: 'B', y: 100}]} />`.)

### 2.10 Candlestick (T3, gated, no demo)

| Axis | Score | Notes |
|---|---|---|
| Body / wick | 🟢 | `barSize={1}` wick + `barSize={6}` body. Correct OHLC pattern. |
| Color by direction | 🟢 | series-1 if close ≥ open else series-2. Correct. |
| Y-axis padding | 🟢 | `dataMin*0.02` / `dataMax*0.02` lower / upper pad per finance CN-3. Correct. |
| Demo policy | 🟢 | Section-locked per scope. |

**Refinement:** none pre-merge. Audit only when PO/legal greenlight unlocks demo.

---

## 3. Priority refinement order

Tier-1 fixes (do all together — all are container/cross-cutting, single PR):

1. **§1.1 ChartCard wrapper** — paper-feel surface (radius 18 + `var(--shadow-card)` + `var(--card)` bg + asymmetric padding). Single biggest visual lift.
2. **§1.2 Eyebrow + title + subtitle inside card** — alignment with rest of system.
3. **§1.5 Kind-specific skeletons** — replace flat-rect skeleton with §3.10 shapes for all 10 kinds.
4. **§1.6 Empty state v1.1 token migration** + adopt static-reference inset-icon lockup.
5. **§1.3 Tooltip fallback hardening** — `var(--shadow-lift)` fallback, `var(--ink)` itemColor.
6. **All charts:** add `fontFamily: 'Geist Mono', letterSpacing: '0.04em'` to XAxis/YAxis ticks (5 lines × 7 charts).
7. **All charts:** add `animationEasing="ease-out"` (1 line × 9 chart components).

Tier-2 fixes (per-kind interaction polish, can ship in second sweep):

8. **LineChart + AreaChart:** activeDot at cursor index. Trade-marker overlay r=5 + card-color stroke.
9. **DonutChart:** slice-scale + glow rim on hover via `activeShape` renderer. Center-label lockup upgrade.
10. **Treemap:** add `<Tooltip>`. Tile-lighten on hover. Bg-token rename.
11. **BarChart:** color-darken-on-hover via Cell + activeIndex.
12. **Calendar:** `var(--inset)` cell bg + today underline + pill markers + day-number font fix.
13. **Waterfall:** running-balance connector lines.

Tier-3 fixes (post-Δ-merge, not blocking):

14. Stroke-dash cycling for multi-series Line/Area (§1.4).
15. Pattern-fill overlay for stacked bar series 2-7 (a11y).
16. Interactive legend hover-bump (§1.7).
17. Calendar mobile compact mode (<480px hides ticker text in pills).

---

## 4. Top-3 priority interactive showcase demo blocks (Part B integration)

These are the three highest-leverage hover/focus demos to build into `/design-system` once we consolidate. Each is a self-contained card the user can mouse over and learn the canonical interaction.

### 4.1 LineChart — cursor + activeDot demo
- **Surface:** chart-card with LINE_FIXTURE.
- **Demo:** mouseover on body → vertical dashed cursor follows X + dot appears at cursor index with 2px card-color ring + tooltip mini-card slides in 200ms above cursor.
- **Keyboard demo:** Tab into chart → focus ring; → arrow Right increments index; tooltip auto-opens; Escape blurs.
- **Reduced-motion variant:** instant cursor track (no transition); tooltip opacity-only fade 0ms.
- **Annotation:** below the chart, mono caption: `200ms cubic-bezier(0.16, 1, 0.3, 1)` (system easing).

### 4.2 DonutChart — slice scale + glow demo
- **Surface:** chart-card with DONUT_FIXTURE (5 segments).
- **Demo:** mouseover on slice → that slice scales to 1.02× radial outward, glow rim `box-shadow: 0 0 0 4px var(--accent-glow)` appears, tooltip mini-card to the side. Other slices unchanged.
- **Keyboard demo:** Tab in → focus first slice; arrow keys cycle slices; Enter would drill (mock with toast «would navigate to /broker/{x}»).
- **Reduced-motion variant:** scale effect disabled; only color swap (slice ink → accent for 200ms then revert).
- **Annotation:** mono caption: `1.02× scale + 4px var(--accent-glow) rim · 300ms ease-out-expo`.

### 4.3 Treemap — tile lighten + tooltip demo
- **Surface:** chart-card with TREEMAP_FIXTURE.
- **Demo:** mouseover on tile → tile background `+4% L` lightens, 1px white outline ring; tooltip pill appears with `{ticker} · {weight}% · {±change}%`. Cursor leaves → restore.
- **Keyboard demo:** Tab in → focus container; arrow keys cycle tiles; tooltip auto-opens; tile gets the same hover treatment.
- **Reduced-motion variant:** outline ring only, no luma shift.
- **Annotation:** mono caption: `+4% L tile-lighten · 1px var(--ink) outline · 200ms`.

---

## 5. Out of scope for this audit

- Re-reading CHARTS_SPEC §6+ (axes / tokens / payloads — already validated by architect ADR + finance/legal review pre-Phase α).
- Migrating `var(--color-text-primary)` etc. → `var(--ink)` semantic alias renames at the **packages/design-tokens** layer (separate task; coordinated through tech-lead).
- Stroke-dash cycling decision (§1.4) — needs PD + brand confirmation that dashed lines feel «Provedo» (paper-restraint may prefer solid). Open question for Right-Hand → PO.

---

## 6. ui-ux-pro-max usage report

Queries run:
1. `--domain color "fintech B2C minimal calm paper"` — returned 3 results (Fintech/Crypto gold-purple, Architecture black/gold, Healthcare cyan). Provedo's locked palette is already more disciplined than any returned — confirmed our paper-feel direction is intentional, not template-default.
2. `--domain ux "data visualization tooltip cursor hover focus"` — returned 3 generic UX rules: focus rings (already implemented in `CHART_FOCUS_RING_CLASS`), hover-vs-tap (charts use both), bulk actions (n/a). No chart-specific guidance returned.
3. `--domain chart "trend allocation portfolio time-series"` — **most useful query**. Returned: Line / Anomaly / Forecast types. Critical takeaway: «Differentiate series by line style (solid/dashed/dotted) not color alone. Add pattern overlays for colorblind users.» — informed §1.4 finding (multi-series stroke differentiation).
4. `--domain ux "interactive showcase design system documentation"` — returned generic responsive / loading / touch rules. Loading-indicator rule («Show spinner/skeleton for operations > 300ms; severity HIGH») reinforced §1.5 priority.

Net: ui-ux-pro-max validated the palette as more disciplined than its industry returns, confirmed colorblind-safe stroke-style differentiation as a known UX gap, and reinforced loading-skeleton priority. Did not surface anything that overrode the spec — used it as a corroboration tool, not a primary source.
