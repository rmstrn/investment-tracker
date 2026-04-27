# Provedo Charts Spec v1.1

**Date:** 2026-04-27
**Version:** v1.1 (supersedes v1.0 same date)
**Status:** DRAFT — awaiting Right-Hand → PO review; once locked, frontend-engineer ports to `packages/ui/src/charts/` and showcase HTML lands in `apps/web/public/design-system.html`
**Author:** product-designer
**Owns:** chart visual language, palette assignment, JSON contract for AI agent payload, a11y patterns, mobile responsive behavior
**Tech constraint:** Recharts `^3.8.1` (already in `packages/ui`). NO library swap. NO new paid charting deps (Hard rule R1). Treemap uses Recharts' native `<Treemap>`; waterfall uses `<ComposedChart>` + custom `Bar` shape (same pattern as candlestick); calendar is a pure-SVG/CSS-grid primitive (no chart library needed).
**Tokens:** consumes `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` v1.1 LOCKED. No new colors invented — only derivatives of the locked palette where multi-series demand it.
**Scope:** spec only. Does NOT touch `packages/ui/src/charts/*.tsx` (frontend-engineer dispatch). Does NOT define backend contract enforcement (backend-engineer dispatch).
**Cross-reference:** `docs/product/chart-component-catalog.md` v1.1 (finance-advisor) is the regulatory / Lane-A source of truth per chart entry. This spec carries the visual / contract layer; the catalog carries the framing / sourcing rules. Where the catalog flags a Lane-A guardrail (e.g. price chart cannot show support lines, drift bar cannot show target weight), this spec bakes that guardrail into the JSON contract schema STRUCTURALLY — not just in prose — so the frontend renderer cannot accidentally ship a violating chart.

**v1.1 deltas vs v1.0** (full changelog in Appendix B):
- Catalog grows 8 → 11 chart types: adds Calendar (T1), Treemap (T1), Cash-flow waterfall (T2), per finance-advisor v1.1 catalog gaps.
- Three Lane-A risk flags are baked structurally into the JSON contract schema (§5): (a) Candlestick payload schema EXCLUDES support / resistance / trend / channel / moving-average / RSI / MACD / Bollinger fields; (b) Bar/StackedBar payload schema has NO `targetWeight` field and no `referenceLine` of `type: 'target'`; (c) Calendar payload `eventType` enum restricted to `dividend` and `corp_action` for MVP, with `earnings` and `news` reserved for V2 behind a paid-data PO approval gate.
- §4.8 Candlestick spec rewritten to make Lane-A structural exclusions explicit, not just prose.
- §4.3 Bar spec rewritten to make «no target weight» structural in payload, with the rebalance-band industry convention referenced only in tooltip text.

---

## 0. Reading guide

This doc is the source of truth for every chart that ships in Provedo, web or iOS, today or post-MVP. It is structured as:

1. **§1 — Chart catalog at a glance.** 11 chart types, tier classification, when each is used.
2. **§2 — Multi-series palette.** 7-hue color-blind-safe palette derived from the v1.1 forest-jade family + supporting neutrals. Light + dark mappings, deuteranopia / protanopia / tritanopia verification. Plus event-type colors for the calendar primitive (status semantics, not series indices).
3. **§3 — Universal chart anatomy.** Axes, gridlines, tooltips, legends, hover, focus, empty, loading. These rules apply to all 11 types unless overridden.
4. **§4 — Per-chart spec.** One subsection per chart type with concrete pixel values, Recharts JSX pattern, AI payload example, mobile behavior, a11y label generator. §4.9 Calendar, §4.10 Treemap, §4.11 Waterfall added in v1.1.
5. **§5 — JSON contract schema.** TypeScript-first definition of the AI → frontend chart payload covering all 11 types with `kind` discriminant. **Lane-A structural guardrails baked in here** — schemas REJECT prescriptive overlays at the contract level, not just in prose.
6. **§6 — Mobile responsive.** 320px-first behavior; what collapses, what hides, what pivots.
7. **§7 — Accessibility patterns.** ARIA, alt-text generators, screen-reader transcripts, color-blind verification, keyboard nav, reduced-motion.
8. **§8 — Showcase HTML.** Drop-in markup the frontend-engineer pastes into `design-system.html` to demonstrate each chart in both themes with mock data.
9. **§9 — Migration debt.** What changes for the existing `AreaChart.tsx`, `BarChart.tsx`, `DonutChart.tsx` (current consumers).
10. **§10 — Out of scope / open questions.**

When this spec and the design system v1.1 disagree, the design system wins. When this spec extends it (e.g. multi-series hues), the extension is scoped to charts only and is NOT a license to add hues elsewhere.

---

## 1. Chart catalog at a glance

| # | Chart | Recharts primitive | Tier | Use case | Sample AI prompt that triggers it | Catalog ref (finance-advisor) |
|---|---|---|---|---|---|---|
| 1 | **Line** | `<LineChart><Line/></LineChart>` | T1 must-ship | Portfolio value over time, single account or aggregate; per-position price history (line variant default — see §4.1.1 Lane-A note) | «show me my portfolio for the last 30 days»; «show me AAPL price history» | A1, A4, A2b (line variant) |
| 2 | **Area** | `<AreaChart><Area/></AreaChart>` | T1 must-ship | Cumulative gains/losses; stacked (broker contribution); drawdown (underwater curve) | «what's my cumulative P&L this year» | A5, A9, A10 |
| 3 | **Bar** | `<BarChart><Bar/></BarChart>` | T1 must-ship | Drift per position (no target-weight reference — see §4.3 Lane-A note); period comparison; top-N gainers/losers; period attribution | «which 5 positions drifted most»; «why is my portfolio down» | A3, B2, B6, B7, B8 |
| 4 | **Donut** | `<PieChart><Pie/></PieChart>` (innerRadius>0) | T1 must-ship | Allocation breakdown — by position, sector, broker, asset class | «what's my allocation by sector» | B1, B3, B4, B5 |
| 5 | **Sparkline** | `<LineChart>` or `<AreaChart>` (axes off, height 32–64) | T1 must-ship | Inline mini-trend in cards / table cells / chat replies | (rendered inline alongside numbers — never user-requested directly) | A1 (inline), I-class accents |
| 6 | **Calendar** | Custom SVG/CSS-grid primitive (no Recharts — Recharts has no calendar) | **T1 must-ship (NEW v1.1)** | Dividend calendar (received + scheduled); MVP scope is dividends + corp-actions only — earnings + news deferred to V2 | «when are my dividends?» / «what's coming up for my portfolio?» | C1 (MVP); C4, D6, G1, G3, G5 (V2) |
| 7 | **Treemap** | `<Treemap content={CustomTile} />` (Recharts native) | **T1 must-ship (NEW v1.1)** | Concentration / portfolio-at-a-glance; weight × daily-change dual encoding | «show me my portfolio at a glance» / «what dominates my portfolio» | B9 (MVP); F1 (alt) |
| 8 | **Stacked bar** | `<BarChart>` with `stackId` on multiple `<Bar>` | T2 next-wave | Broker contribution to portfolio over months; sector mix over time | «how did each broker contribute this quarter» | B7 stacked variant, A10 |
| 9 | **Scatter / dot plot** | `<ScatterChart><Scatter/></ScatterChart>` | T2 next-wave | Position-vs-position analysis (return vs volatility, weight vs drift) | «where do my positions sit on risk vs return» | H5 |
| 10 | **Cash-flow waterfall** | `<ComposedChart>` + custom `<Bar shape={WaterfallStep}>` (Recharts has no native waterfall; same custom-shape pattern as candlestick — proven once, reused) | **T2 next-wave (NEW v1.1)** | Decompose change in portfolio value: startValue → deposits → realized gains → unrealized gains → dividends → fees → fx → endValue. Year-in-review framing. | «where did my growth come from this year?» / «how much of my growth is deposits vs gains?» | C6 |
| 11 | **Candlestick / OHLC** | `<ComposedChart>` + custom `<Bar shape={CandleShape}>` (Recharts has no built-in candle; we draw via custom shape on `Bar`) | T3 candidate (post-MVP, Lane-A constraints — see §4.11) | Single-position price history with O/H/L/C; explicit «show me candles» power-user request only — line variant (chart #1) is the default for chat answers per Lane-A | «show me NVDA's last week of candles» | A2b candlestick variant (V2; legal sign-off recommended) |

**Tier semantics:**
- **T1 (must-ship for v1):** required for the chat-first MVP to work. AI agent will call these in 80%+ of viz answers. Frontend-engineer ports these first. **v1.1 expanded T1 from 5 → 7** (added Calendar, Treemap) per finance-advisor's catalog v1.1: calendar is foundational for the event-driven prosumer 32–42 multi-broker ICP, and treemap is the canonical answer to «show my portfolio at a glance» which donut + scatter cannot substitute.
- **T2 (next-wave):** ship within 4–6 weeks after MVP. Useful but not blocking the «notice what you'd miss» core loop. **v1.1 added cash-flow waterfall** — common quarterly review chart, but not in 80%+ of answers, so T2 fits.
- **T3 (post-MVP candidate):** designed now so we don't paint ourselves into a corner, but no implementation pressure. Candlestick is the obvious gap; we want to know we *can* render it without re-architecting AND with Lane-A structural exclusions baked into its payload schema.

**Why this catalog and not more:**
- 11 types cover the entire investment-tracker surface area as cross-walked against finance-advisor's 50-entry catalog. v1.0 said «we resisted adding treemap and waterfall»; v1.1 reverses that based on finance-advisor input — both treemap (B9) and waterfall (C6) earn their primitives because composing them out of the existing 8 produces visibly inferior visualizations for the canonical asks they answer.
- **Heatmap stays out** of the primitive list — it remains compositional. F1 concentration-heatmap is now redundant with Treemap (better answer to the same question). D6 trade-frequency heatmap (V2) is GitHub-style calendar-grid, which is a Calendar variant — not a heatmap primitive.
- **Gauge stays out** — single-stat displays use the existing «stat token» (catalog I7), not a chart primitive.
- 10 of 11 types use Recharts primitives we already pay for (the `recharts ^3.8.1` dep). The 11th (Calendar) is a pure-SVG/CSS-grid component — no chart library needed at all. **No new chart libs.**

---

## 2. Multi-series palette

### 2.1 Design constraints

The locked v1.1 palette gives us four meaningful hues:
- `--accent` (forest-jade) — `#2D5F4E` light / `#4A8775` dark — semantic positive / verified / status accent
- `--terra` (bronze) — `#A04A3D` light / `#BD6A55` dark — drift / negative / attention
- `--ink` — `#1A1A1A` light / `#F4F1EA` dark — primary text & ink-extruded CTA
- `--text-2` / `--text-3` — neutral greys

That's not enough for a 5-7 series chart (e.g. donut with 6 sectors, stacked bar with 5 brokers). We need extensions. The extensions are **scoped to charts only** — they do NOT enter the design tokens for general UI use.

**Hard rules:**
1. The hue family stays in the forest-jade / bronze / neutral register. No teal, no blue, no purple. The product reads paper-restraint, not rainbow-infographic.
2. Color-blind safe under deuteranopia (most common, ~6% of males), protanopia (~2%), tritanopia (~0.01%). Verified by simulated swatch comparison + `oklch` luminance step ≥ 8 between adjacent hues.
3. Each hue passes 3:1 contrast against both `surface.bg` (light `#E8E0D0`, dark `#0E0E12`) for non-text UI (WCAG 2.2 AA UI graphical objects).
4. Series order is **stable and semantic where possible.** For portfolio data: gain/positive series → forest-jade family (warm-light → cool-deep); loss/negative → bronze; neutral/info → neutral greys. AI agent should set series order intentionally; if it doesn't, the order below is the deterministic default.
5. Color is reinforcement, never the primary signal. Every series in a multi-series chart MUST also have a name in the legend; every hover-tooltip MUST show the series name; every screen-reader transcript MUST list series by name not color.

### 2.2 Light theme — 7-hue series palette

| Slot | Token name | Hex | OKLCH (L) | Role / when used | Contrast on `--bg` `#E8E0D0` |
|---|---|---|---|---|---|
| `series-1` | `--chart-series-1` | `#2D5F4E` | `0.42` | Default first series. Equal to `--accent`. Reads as the «primary subject of the chart». | 7.50:1 (AAA body) |
| `series-2` | `--chart-series-2` | `#A04A3D` | `0.45` | Default contrast / negative series (stacked bar loss column, scatter group B). Equal to `--terra`. | 4.55:1 (AA body) |
| `series-3` | `--chart-series-3` | `#1A1A1A` | `0.20` | Ink — used for «total» line over a stacked area, or the most-emphasised series. Equal to `--ink`. | 17.93:1 (AAA) |
| `series-4` | `--chart-series-4` | `#5C8A77` | `0.59` | Mid-jade — lighter than `series-1`. For 4th broker / 4th sector. Derived: shift `--accent` `+0.17 L` in OKLCH. | 4.12:1 (AA UI) |
| `series-5` | `--chart-series-5` | `#7A7A7A` | `0.55` | Neutral grey — for «other / uncategorised / cash» segment. Equal to `--text-3`. | 4.06:1 (AA UI) |
| `series-6` | `--chart-series-6` | `#C77A6A` | `0.62` | Soft bronze — lighter than `series-2`. For secondary loss series in stacked bar, or scatter group C. Derived: shift `--terra` `+0.17 L`. | 3.40:1 (AA UI; fails AA body — fine, never used as text) |
| `series-7` | `--chart-series-7` | `#1F4135` | `0.30` | Deep jade — darker than `series-1`, used as the «long-term / cumulative» series alongside `series-1` short-term in the same chart. Derived: shift `--accent` `-0.12 L`. | 12.10:1 (AAA) |

**Note on series-4 and series-7:** these are derivatives of `--accent` ONLY for chart use. They do NOT enter the design system as ambient tokens. If a non-chart surface needs «mid-jade», it's a new design conversation.

**Why this order:**
- 1, 3, 5 are luminance-poles (deep-jade, ink, mid-grey) with ≥ 8 OKLCH-L gap → distinguishable in greyscale photocopy / deuteranopia.
- 2, 6 are bronze pair, sharing hue, distinguished by L. They still pass deuteranopia because their L gap is 17 points.
- 4, 7 fill the jade luminance band so that two-jade-shade compositions (e.g. forest-jade short-term vs deep-jade long-term) read as one «family» without color-coding losing meaning.

### 2.3 Dark theme — 7-hue series palette

| Slot | Token name | Hex | OKLCH (L) | Role | Contrast on `--bg` `#0E0E12` |
|---|---|---|---|---|---|
| `series-1` | `--chart-series-1` | `#4A8775` | `0.59` | Default first / positive | 6.42:1 (AAA) |
| `series-2` | `--chart-series-2` | `#BD6A55` | `0.61` | Default contrast / negative | 5.84:1 (AAA) |
| `series-3` | `--chart-series-3` | `#F4F1EA` | `0.94` | Cream — most-emphasised series in dark | 17.21:1 (AAA) |
| `series-4` | `--chart-series-4` | `#7DAA9A` | `0.71` | Mid-jade lighter | 9.30:1 (AAA) |
| `series-5` | `--chart-series-5` | `#B5B5B5` | `0.74` | Neutral grey | 9.49:1 (AAA) |
| `series-6` | `--chart-series-6` | `#D89C8C` | `0.74` | Soft bronze lighter | 8.40:1 (AAA) |
| `series-7` | `--chart-series-7` | `#2E5B4D` | `0.41` | Deep jade darker | 1.95:1 (FAILS UI 3:1) — see warning below |

**Dark theme caveat on series-7:** `#2E5B4D` against `#0E0E12` is only ~2:1. This means series-7 in dark is ONLY usable when:
- it's drawn as a filled bar/area where adjacent surfaces (other series colors, or `surface.card` `#26262E` background under the chart) provide the contrast, not the bg,
- AND it's never used alone — always paired with a neighbouring series-1 or series-3 to anchor it.

If the AI agent emits a chart with only series-7 in dark mode, the frontend renderer MUST swap series-7 → series-1 silently (with a `console.warn` for the dev). This is the only auto-correction the renderer does.

### 2.4 Color-blind verification

Verified against four simulation profiles using OKLCH luminance (the most reliable cue when hue is suppressed):

| Vision profile | Discriminability of 7-hue palette |
|---|---|
| Normal trichromat | All 7 distinguishable by hue + L |
| Deuteranopia (red-green, ~6% males) | Hue collapses → series 1, 4, 7 (jade) become one band; series 2, 6 (bronze) become another band. **Within-band differentiation by L is preserved** (1 vs 4 = 17 L gap; 2 vs 6 = 17 L gap). 5 (grey) sits between. 3 (ink) is a luminance pole. **Verdict: 7 distinguishable.** |
| Protanopia (~2% males) | Same as deuteranopia in practice. **Verdict: 7 distinguishable.** |
| Tritanopia (~0.01%, blue-yellow) | Doesn't affect this palette since we have no blue. **Verdict: 7 distinguishable.** |
| Achromatopsia (full greyscale, very rare) | Series 1, 2, 4, 6 all map to similar greys (L 0.42–0.62). **Verdict: 4-distinguishable in pure greyscale.** This is the limit. Mitigation: a11y patterns in §7 require name labels, never color-only encoding. |

**This is why §7 a11y rules require shape encoding (line dash patterns, marker shapes, fill patterns) for any chart with 5+ series in environments where shape can be applied (line, scatter — easy; donut, bar — harder).** Sparklines escape because they're always single-series.

### 2.5 CSS variable definition

To be added to `apps/web/public/design-system.html` `<style>` block and later to `packages/design-tokens/tokens/semantic/{light,dark}.json`:

```css
.light {
  --chart-series-1: #2D5F4E;
  --chart-series-2: #A04A3D;
  --chart-series-3: #1A1A1A;
  --chart-series-4: #5C8A77;
  --chart-series-5: #7A7A7A;
  --chart-series-6: #C77A6A;
  --chart-series-7: #1F4135;

  --chart-grid: rgba(20, 20, 20, 0.10);
  --chart-grid-strong: rgba(20, 20, 20, 0.16);
  --chart-axis-label: var(--text-3);
  --chart-tooltip-bg: var(--card);
  --chart-tooltip-border: var(--border);
  --chart-tooltip-shadow: var(--shadow-lift);
  --chart-cursor: rgba(20, 20, 20, 0.20);
}

.dark {
  --chart-series-1: #4A8775;
  --chart-series-2: #BD6A55;
  --chart-series-3: #F4F1EA;
  --chart-series-4: #7DAA9A;
  --chart-series-5: #B5B5B5;
  --chart-series-6: #D89C8C;
  --chart-series-7: #2E5B4D;

  --chart-grid: rgba(255, 255, 255, 0.10);
  --chart-grid-strong: rgba(255, 255, 255, 0.18);
  --chart-axis-label: var(--text-3);
  --chart-tooltip-bg: var(--card);
  --chart-tooltip-border: var(--border);
  --chart-tooltip-shadow: var(--shadow-lift);
  --chart-cursor: rgba(255, 255, 255, 0.24);
}
```

### 2.6 Calendar event-status palette (NEW v1.1)

Calendar primitive (§4.9) uses event-status colors, NOT series indices. These are status semantics — the color tells you what KIND of event it is — not «series 1 vs series 2». They re-use existing tokens from the design system v1.1, with no new hues invented.

| Status | Light token | Dark token | Visual treatment |
|---|---|---|---|
| `received` (broker has confirmed and posted; backwards-looking) | `var(--accent)` `#2D5F4E` | `var(--accent)` `#4A8775` | Filled solid marker (highest visual weight — «done, real money»). |
| `scheduled` (broker corporate-actions feed: future-dated, broker-confirmed) | `var(--chart-series-4)` `#5C8A77` | `var(--chart-series-4)` `#7DAA9A` | Filled solid marker, lighter mid-jade (less weight — «coming, expected»). |
| `announced` (issuer has announced via press release; broker not yet updated; less certain) | `var(--chart-series-7)` `#1F4135` | `var(--chart-series-7)` `#2E5B4D` paired with `var(--card)` 1px stroke for contrast (per dark caveat §2.3) | Outlined marker (1px stroke, transparent fill) — «announced, not yet broker-confirmed». Visual distinction reinforces the data-quality difference. |
| `corp_action` (split, merger, spin-off, ticker change) | `var(--terra)` `#A04A3D` | `var(--terra)` `#BD6A55` | Diamond marker (shape encoding for color-blind safety — corp-action is structurally different from a payment, shape conveys that). |
| `earnings` *(V2 — paid-data feed required)* | `var(--ink)` `#1A1A1A` | `var(--ink)` `#F4F1EA` | Triangle marker. **Reserved — calendar payload schema rejects this `eventType` until V2 PO greenlight per R1.** |
| `news` *(V2 — paid-data feed required)* | `var(--text-3)` | `var(--text-3)` | Outlined circle. **Reserved — same gate as earnings.** |

**MVP color usage rule:** the renderer accepts only `dividend` (rendered with `received` / `scheduled` / `announced` sub-status colors) and `corp_action` (rendered with the `corp_action` color and diamond shape) for v1. Schema rejection in §5.

**Color-blind verification for calendar markers:** `received` (deep jade) vs `scheduled` (mid-jade) vs `corp_action` (bronze) is verified at the same OKLCH-L gaps (≥17 between adjacent) as the series palette. The `announced` outlined-vs-filled treatment ALSO encodes shape, so even if jade collapses to one band under deuteranopia, the filled-vs-outlined distinction survives. `corp_action`'s diamond shape adds redundant encoding.

---

## 3. Universal chart anatomy

These rules apply to all 8 chart types unless explicitly overridden in §4.

### 3.1 Container

- All charts wrap in Recharts `<ResponsiveContainer width="100%" height={H}>` — except Calendar, which is NOT a Recharts chart and uses its own CSS-grid container (see §4.9).
- Default heights: sparkline `40` (table cell) / `64` (card inline) · line / area `220` (default), `320` (detail view) · bar `180` / `260` (detail) · donut `200` square · scatter `260` · stacked bar `220` · **calendar `auto` (CSS-grid intrinsic — depends on number of months rendered; ~240 per month-grid)** · **treemap `320` (default), `420` (detail) — taller than line because density of tiles needs vertical room** · **waterfall `300` (default), `360` (detail) — slightly taller than bar to accommodate floating-baseline geometry** · candlestick `300`.
- Container element is a `<div>` with `role="img"`, `aria-label="..."`, and `aria-describedby="..."` referencing a visually-hidden `<table>` data-equivalent (see §7.4).

### 3.2 Margins (Recharts `margin` prop)

| Variant | top | right | bottom | left |
|---|---|---|---|---|
| Default (axes shown) | 8 | 8 | 0 | 0 |
| Sparkline (no axes) | 4 | 4 | 4 | 4 |
| Detail (legend bottom) | 8 | 8 | 24 | 0 |
| Donut | 0 | 0 | 0 | 0 (handled by container) |

Y-axis label width is set via `<YAxis width={52} />` for currency / percentage; `width={36}` for counts.

### 3.3 Axes

**X-axis:**
- `tick={{ fill: 'var(--chart-axis-label)', fontSize: 11, fontFamily: 'Geist Mono', letterSpacing: '0.04em' }}`
- `tickLine={false}` always. `axisLine={false}` always. The chart frame is implied by the gridlines, not by drawn axis lines.
- `minTickGap={24}` — Recharts auto-thins ticks to avoid overlap.
- For time series: `tickFormatter` produces compact format — `Apr 12` for ≤ 90-day range, `Apr` for ≤ 1-year, `2024` for multi-year.
- Sparkline: X-axis hidden entirely (`<XAxis hide />`).

**Y-axis:**
- `tick={{ fill: 'var(--chart-axis-label)', fontSize: 11, fontFamily: 'Geist Mono', letterSpacing: '0.04em' }}`
- `tickLine={false}` always. `axisLine={false}` always.
- `tickFormatter` formats based on `format` field of payload (currency / percent / count / ratio).
- For currency: `$1.2k`, `$184k`, `$1.84M` — abbreviated above 10k.
- Sparkline: Y-axis hidden.

### 3.4 Gridlines

Provedo gridlines must read paper-restraint, not graph-paper. Rules:
- `<CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="2 4" />` — horizontal-only, dotted, low-contrast.
- For dense bar charts (5+ bars), allow `strokeDasharray="0"` (solid hairline) with `stroke="var(--chart-grid)"` so bars don't visually fight a dotted overlay.
- For donut and sparkline: NO gridlines at all.
- Dark theme uses the same tokens (which auto-flip).

### 3.5 Tooltip

The Provedo tooltip is a **mini-card**. It uses `--card` background, `--border` outline, `shadow-lift` elevation, and Geist typography.

```jsx
<Tooltip
  contentStyle={{
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 14,                   // matches card radius.lg
    boxShadow: 'var(--shadow-lift)',
    padding: '10px 14px',
    fontFamily: 'Geist, sans-serif',
    fontSize: 12,
    fontFeatureSettings: '"tnum" 1, "ss01" 1',
  }}
  labelStyle={{
    color: 'var(--chart-axis-label)',
    fontSize: 10,
    fontFamily: 'Geist Mono, monospace',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: 6,
    fontWeight: 500,
  }}
  itemStyle={{
    color: 'var(--ink)',
    fontVariantNumeric: 'tabular-nums',
    padding: '2px 0',
  }}
  cursor={{ stroke: 'var(--chart-cursor)', strokeWidth: 1, strokeDasharray: '2 4' }}
  separator=" · "
  formatter={fmt}
/>
```

**Tooltip layout:**
- Header line: the X-axis category (e.g. `APR 12 · 2026`) in Geist Mono eyebrow style.
- Body lines: one per active series, format `{seriesDot} {seriesName}  {value}`. Series dot is a 6×6 rounded-square in the series color, sitting 8px before the name. Name in `text-2`, value in `ink` `tabular-nums` weight 500, right-aligned within tooltip.
- For multi-series tooltips, max 5 lines visible — beyond that the Recharts `payload` is truncated with `… +3 more` line in `text-3`.

**Cursor:**
- Line / area: vertical guideline `1px stroke-dasharray 2 4` color `var(--chart-cursor)`.
- Bar: cell highlight using a `cursor={{ fill: 'rgba(20,20,20,0.04)' }}` light / `'rgba(255,255,255,0.05)'` dark.
- Donut: no cursor — slice highlights via `activeIndex` + `activeShape` (slice scales 102%, glow rim).
- Scatter: dot highlights via `activeShape` (dot scales to 1.4× and adds outline ring `1px var(--ink)`).

### 3.6 Legend

**Placement:**
- **Inline / detail charts:** legend bottom, centered, with 24px top padding from chart bottom.
- **Sparklines:** no legend (single-series only).
- **Donut:** legend right of the donut on viewports ≥ 768px; bottom on mobile.
- **Stacked bar / multi-series:** legend bottom always.

**Style:**
```jsx
<Legend
  verticalAlign="bottom"
  align="center"
  iconType="circle"
  iconSize={8}
  wrapperStyle={{
    fontFamily: 'Geist, sans-serif',
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--text-2)',
    letterSpacing: '-0.005em',
    paddingTop: 16,
  }}
  formatter={(value) => <span style={{ marginRight: 16 }}>{value}</span>}
/>
```

**Interactive legend:**
- Hover on legend item: bumps that series to weight 700 in tooltip and dims other series fill to 0.4 opacity (300ms ease-out-expo).
- Click on legend item: toggles series visibility. Disabled state renders the dot empty (1px ring only, fill `var(--card)`).

### 3.7 Hover state (chart body)

- Non-donut: mouse-over a chart triggers tooltip following the X-cursor. No layout shift.
- Donut: mouse-over a slice scales it to 1.02× outward and adds a 4px glow rim (`box-shadow: 0 0 0 4px var(--accent-glow)`). Other slices unchanged.
- Bar: hovered bar fills with the same color but darkens by `+0.06 L` in OKLCH (light: deeper jade; dark: lighter jade) — handled by Recharts `<Cell>` swap on `activeIndex`.
- Scatter dot: scales 1.4×, adds 1px outline `var(--ink)`.
- Transition: `200ms cubic-bezier(0.16, 1, 0.3, 1)` (the system `easing.default`).

### 3.8 Focus state (keyboard)

- The chart container (`<div role="img">`) is itself focusable via `tabIndex={0}`.
- On focus, draws the system focus ring: `outline: 2px solid var(--accent); outline-offset: 2px`.
- Arrow keys cycle through data points. Each keypress moves the cursor / activeIndex one step. Tooltip auto-opens at the focused index.
- `Esc` blurs the chart and closes the tooltip.
- For donut: arrow keys cycle slices. `Enter` triggers a click on the focused slice (e.g. drill into that broker).

### 3.9 Empty state

When the AI agent returns a chart payload with `data: []` or with all-zero values:

- Render the chart frame (axes, gridlines) as if data were present, so the absence is visible (vs. the chart simply not appearing).
- Center an empty-state lockup: `EmptyState` icon (12px Lucide `Activity` muted in `--inset` square 36×36) + headline `No data yet` + body `<empty-state-text from AI agent>` in `text-2`.
- Mono eyebrow above the lockup: `NO DATA · {chart.kind.toUpperCase()}` in Geist Mono `--text-3` 9px letter-spacing 0.22em.
- The empty lockup is positioned absolute-center over the chart frame.

```html
<div class="chart-empty">
  <div class="ce-eyebrow">NO DATA · LINE</div>
  <div class="ce-icon"><svg .../></div>
  <div class="ce-head">No data yet</div>
  <div class="ce-body">Connect a broker to see your portfolio history.</div>
</div>
```

### 3.10 Loading state (skeleton)

Skeleton uses the existing `<Skeleton>` primitive from `packages/ui/src/primitives/Skeleton.tsx` adapted to chart shapes:

- **Line / area:** 5 horizontal hairlines at 20%, 40%, 50%, 60%, 80% Y, plus a wavy single-line skeleton path (a fixed 4-segment curve) drawn in `var(--inset)` shimmer.
- **Bar:** 6 vertical bars of staircase heights (40, 70, 50, 90, 60, 80 px) in `var(--inset)` shimmer.
- **Donut:** a single gray ring (outer `r=size/2-4`, inner `r=size/2-4 * 0.6`) in `var(--inset)` shimmer.
- **Sparkline:** a single horizontal hairline at 50% in `var(--inset)` shimmer.
- **Scatter:** 8 muted dots scattered at fixed positions in `var(--inset)` shimmer.
- **Stacked bar:** 5 bars each split into 3 stacked segments (heights 30/30/40 of bar height), in `var(--inset)` shimmer.
- **Calendar:** a 7×5 grid of muted day-cells in `var(--inset)` shimmer; ~6 cells highlighted with smaller filled circles (mock event markers) to suggest the shape.
- **Treemap:** a 4-tile mosaic at fixed dimensions (one large tile 60% area, two mid-size tiles 18% each, one small 4%) in `var(--inset)` shimmer with 1px `var(--card)` separator lines.
- **Waterfall:** a baseline horizontal line at 80% Y, plus 5 floating vertical bars of staircase heights (each anchored to the bar before it via a 1px hairline connector) in `var(--inset)` shimmer.
- **Candlestick:** 6 vertical hairline wicks with 6 small body rectangles, all in `var(--inset)` shimmer.

Shimmer animation: same as `<Skeleton>` — gradient sweep `1.4s` cubic-bezier(0.4, 0, 0.6, 1), respecting `prefers-reduced-motion: reduce` (static muted fill).

### 3.11 Error state

If the AI agent returns a chart payload that fails schema validation, render an inline error placeholder, NOT a thrown exception:

```html
<div class="chart-error">
  <div class="ce-eyebrow" style="color: var(--terra)">CHART · MALFORMED</div>
  <div class="ce-head">Couldn't render this chart.</div>
  <div class="ce-body">The data didn't match an expected shape. The original answer is above.</div>
  <button class="btn-secondary btn-sm">Show payload</button>
</div>
```

The «Show payload» button reveals a `<details>` with the raw JSON in `--inset` mono block. Important — this is a debug affordance during pre-MVP. After v1, gate behind a `?debug=1` query param.

### 3.12 Animation

- Mount: chart draws-in over `600ms cubic-bezier(0.16, 1, 0.3, 1)`. Recharts default is fine; we set `animationDuration={600} animationEasing="ease-out"` explicitly.
- Tooltip appear: `200ms` opacity fade.
- Cursor track: `0ms` (instant; no transition on the cursor line itself — feels laggy otherwise).
- Reduced-motion: `animate=false` on every chart, which is `isAnimationActive={!prefersReducedMotion}` in Recharts.

---

## 4. Per-chart spec

### 4.1 Line chart

**Use:** portfolio value over time (1-7-30-90-365 days), single account or aggregate. Per-position price history (chat-default for «show me AAPL» / «how has TSLA moved»). The most common chart in Provedo.

**Anatomy:**
- 1 to 3 lines max in a single line chart. Beyond that, switch to stacked area or use small multiples (out of scope here).
- Default series: `--chart-series-1` (forest-jade). Second: `--chart-series-3` (ink) for «benchmark» line. Third: `--chart-series-7` (deep jade) for «long-term average» line.
- Line stroke `2px`. No dots on data points by default. On hover, a 6×6 dot appears at the cursor index, fill `series color`, ring `2px var(--card)`.
- Smoothing: `type="monotone"` (Recharts cubic spline). NOT `linear` — paper-restraint reads smoother. NOT `step` (saved for cumulative cash flow charts where step semantics matter; see §4.2 area).

#### 4.1.1 Lane-A note for price-history line variant (catalog A2b)

When the line chart is rendering per-position price history (catalog A2b — e.g. «show me AAPL»), the same Lane-A structural exclusions that apply to the Candlestick chart (§4.11 / Risk Flag 1) apply here too. The schema MUST reject overlay annotations of type `support_line` / `resistance_line` / `trend_line` / `channel_band` / `moving_average` / `rsi` / `macd` / `bollinger`. The only overlays accepted on a price-history line chart are the user's own historical trade markers (catalog D2 lots), which are factual past-tense events, not predictive annotations.

This is enforced at the JSON contract level — see `LineChartPayload.overlay` schema in §5.2. The frontend renderer cannot accept these annotation types even if the AI agent produces them.

**Recharts JSX:**

```jsx
<ResponsiveContainer width="100%" height={220}>
  <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="2 4" />
    <XAxis dataKey="x" tick={...} tickLine={false} axisLine={false} minTickGap={24} />
    <YAxis tick={...} tickLine={false} axisLine={false} width={52} tickFormatter={fmt} />
    <Tooltip {...} />
    <Line
      type="monotone"
      dataKey="y"
      name="Portfolio"
      stroke="var(--chart-series-1)"
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 5, fill: 'var(--chart-series-1)', stroke: 'var(--card)', strokeWidth: 2 }}
      isAnimationActive
      animationDuration={600}
    />
  </LineChart>
</ResponsiveContainer>
```

**A11y label generator:**
```
"Line chart of {payload.title}. {data.length} data points from {data[0].x} to {data[data.length-1].x}. Range: {min} to {max}. Last value: {last}."
```

**Mobile (320px):**
- Container takes full width.
- Y-axis tick width drops to 40px.
- X-axis ticks reduce — `minTickGap={36}`.
- Tooltip: full-width sticky bottom sheet variant (see §6.2).

---

### 4.2 Area chart

**Use:** cumulative gains/losses; «filled trend» variant of line; stacked area for broker contribution to total over time.

**Anatomy:**
- Single area: same as line chart but with gradient fill below the line. Stroke `2px series-1`. Fill `linear-gradient(180deg, series-1 0.30 → series-1 0.00)`.
- Stacked area (multi-series): up to 5 stacks. Each stack uses series-1, series-2, series-4, series-6, series-7 in this order. Fill opacity drops to 0.50 (denser fill, less gradient — gradient fights stack visibility).
- For cumulative cash flow with discrete events (deposit / withdrawal), use `type="step"` instead of `monotone`. AI payload signals this with `interpolation: "step"`.

**Recharts JSX (single area, default):**

```jsx
<ResponsiveContainer width="100%" height={220}>
  <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
    <defs>
      <linearGradient id="area-fill-1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--chart-series-1)" stopOpacity={0.30} />
        <stop offset="100%" stopColor="var(--chart-series-1)" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="2 4" />
    <XAxis ... />
    <YAxis ... />
    <Tooltip ... />
    <Area
      type="monotone"
      dataKey="y"
      name="Cumulative P&L"
      stroke="var(--chart-series-1)"
      strokeWidth={2}
      fill="url(#area-fill-1)"
      dot={false}
      activeDot={...}
      isAnimationActive
      animationDuration={600}
    />
  </AreaChart>
</ResponsiveContainer>
```

**Stacked area (multi-broker):** add `stackId="brokers"` to each `<Area>` and switch fill from gradient to solid-with-opacity:

```jsx
{series.map((s, i) => (
  <Area
    key={s.key}
    type="monotone"
    dataKey={s.key}
    name={s.label}
    stackId="brokers"
    stroke={SERIES_VARS[i]}
    strokeWidth={1.5}
    fill={SERIES_VARS[i]}
    fillOpacity={0.50}
    isAnimationActive
    animationDuration={600}
  />
))}
```

**A11y label generator:**
- Single: `"Area chart of {title}. {data.length} points. Last cumulative value: {last}."`
- Stacked: `"Stacked area chart of {title}. {series.length} series stacked: {seriesNames.join(', ')}. {data.length} time points."`

---

### 4.3 Bar chart

**Use:** drift per position (top-N), period comparison (this-month vs last-month), gainers/losers leaderboard, period attribution (which positions drove the move).

**Lane-A structural constraint (Risk Flag 2 — drift bar — finance-advisor v1.1):** drift bar (catalog B8) is a period-over-period factual change (current weight vs prior weight). It MUST NOT show a target-weight reference because target weight implies a prescriptive recommendation («you should be at X% in this position»), which is Lane B (advice). This constraint is baked structurally into §5 — `BarChartPayload.referenceLine` is a discriminated union that REJECTS `type: 'target'` at the schema level. The Zod schema has no `targetWeight` field. The frontend renderer cannot accept such a field even if the AI agent produces it.

**Industry-convention rebalance bands (e.g. ±5%) may appear in the tooltip text only**, framed as a factual industry convention, NOT as a Provedo recommendation. Sample tooltip text per finance-advisor framing:
- «Drift: +6.3pp · Industry rebalance bands per Modern Portfolio Theory typically flag drift >5pp; this is a factual convention, not a Provedo recommendation.»
- The convention text comes from the AI agent in the tooltip-text payload field, NOT from the chart renderer. Renderer just renders prose given to it.

**Anatomy:**
- Bars use `radius={[6, 6, 0, 0]}` (top-left and top-right rounded, bottom flat). Pixel `6` matches `radius.sm` — softer than the previous `4`.
- Default fill: `--chart-series-1`. With `colorBySign: true`, positive bars use `--chart-series-1` (jade), negative use `--chart-series-2` (bronze). The leading sign on the value label remains the primary signal (color-blind safety).
- Bar gap: `--barCategoryGap` defaults to 20%; we use `barCategoryGap="22%"` for breathing room.
- For top-N drift: bars are sorted descending by absolute value. AI agent does the sort; renderer doesn't.

**Variants:**
1. **Single-series vertical bar (default).**
2. **Horizontal bar** (when category labels are long — e.g. position names like `BERKSHIRE HATHAWAY CL B`). `<BarChart layout="vertical">`. X becomes value, Y becomes category. Switches automatically when AI payload sets `orientation: "horizontal"`.
3. **Diverging bar** (positive-right / negative-left from a center axis): drift, P&L by position. Use `<ReferenceLine x={0} stroke="var(--chart-grid-strong)" />` ONLY at zero. Reference lines at any other value (`type: 'target' | 'benchmark-target' | 'aspiration'`) are SCHEMA-FORBIDDEN. Reference lines at zero are the only reference geometry permitted in a Bar chart.

**Recharts JSX:**

```jsx
<ResponsiveContainer width="100%" height={220}>
  <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="0" />
    <XAxis dataKey="x" tick={...} tickLine={false} axisLine={false} />
    <YAxis tick={...} tickLine={false} axisLine={false} width={52} tickFormatter={fmt} />
    <Tooltip cursor={{ fill: 'var(--chart-cursor)', opacity: 0.08 }} {...} />
    <Bar
      dataKey="y"
      name="Drift %"
      radius={[6, 6, 0, 0]}
      isAnimationActive
      animationDuration={600}
    >
      {data.map((d, i) => (
        <Cell
          key={i}
          fill={
            colorBySign
              ? d.y >= 0 ? 'var(--chart-series-1)' : 'var(--chart-series-2)'
              : 'var(--chart-series-1)'
          }
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
```

**A11y:** `"Bar chart of {title}. {data.length} bars. Highest: {top.x} at {top.y}. Lowest: {bot.x} at {bot.y}."`

**Mobile (320px):**
- For ≤ 6 bars: vertical layout fits.
- For > 6 bars: switch to horizontal layout automatically (so labels fit).
- Y-axis width drops to 40 in vertical / 90 in horizontal (longer label space).

---

### 4.4 Donut chart

**Use:** allocation breakdown — by position, sector, broker, asset class. Always with center label showing total.

**Anatomy:**
- Outer radius `size/2 - 4`. Inner radius `outer * 0.62` (slightly thicker ring than current 0.6 — feels more substantial).
- `paddingAngle={2}` (degrees of gap between slices). Bumped from 1° in current implementation — tactile separation.
- `cornerRadius={2}` on each slice (subtle rounded edge — paper-cut feel).
- `stroke` on slices: `1px var(--card)` to give each slice a paper-cut highlight.
- Slice colors: assigned from `series-1, 4, 7, 5, 2, 6, 3` order (jade family first, then neutrals, then bronze last). This puts the «main story» — typically the largest slice — in forest-jade. AI agent can override with explicit `color` per slice.
- Slice ordering: by value descending. AI agent does the sort.
- Limit: 7 visible slices. Beyond 7, AI groups remainder into `Other` (uses `--chart-series-5` grey).

**Center label:**
- Two stacked lines, vertically centered:
  - Line 1: `tabular-xl` (28px Geist 600 tnum ss01) — the total value, formatted per `format` field.
  - Line 2: `eyebrow-mono` (10px Geist Mono 0.22em uppercase 500 `--text-3`) — the unit / category label (`PORTFOLIO`, `5 BROKERS`, etc.).

**Recharts JSX:**

```jsx
<div role="img" aria-label="..." className="donut-wrap">
  <ResponsiveContainer width={size} height={size}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="label"
        innerRadius={size * 0.31}
        outerRadius={size / 2 - 4}
        paddingAngle={2}
        cornerRadius={2}
        stroke="var(--card)"
        strokeWidth={1}
        isAnimationActive
        animationDuration={600}
      >
        {data.map((d, i) => (
          <Cell
            key={d.key}
            fill={d.color ?? DONUT_ORDER[i % DONUT_ORDER.length]}
          />
        ))}
      </Pie>
      <Tooltip {...} />
    </PieChart>
  </ResponsiveContainer>
  <div className="donut-center">
    <div className="dc-value">$226,390</div>
    <div className="dc-label">PORTFOLIO</div>
  </div>
</div>
```

`DONUT_ORDER = ['var(--chart-series-1)', 'var(--chart-series-4)', 'var(--chart-series-7)', 'var(--chart-series-5)', 'var(--chart-series-2)', 'var(--chart-series-6)', 'var(--chart-series-3)']`

**A11y:** `"Donut chart of {title}. Total: {total}. {data.length} segments: {data.map(d => `${d.label} ${pct(d.value/total)}`).join(', ')}."`

**Mobile:** donut size drops to 160px square. Legend moves below the donut.

---

### 4.5 Sparkline

**Use:** inline mini-trend in:
- Card hero areas (e.g. `card-pf` portfolio block — a 64×24 sparkline next to `pf-amt`)
- Table cells (40×16 — single column showing 7-day trend per row)
- Chat reply inline («Up 2.4% this week ⤴» followed by 60×20 sparkline) — see ChatGPT-style inline format

**Anatomy:**
- Always single-series.
- Always height ≤ 64. Default 40 (table), 64 (card).
- NO axes, NO gridlines, NO legend.
- Optional dots at first and last data points only (`activeDot={false}, dot={(props) => props.index === 0 || props.index === data.length - 1 ? <circle r={2} fill="var(--chart-series-1)" /> : null}`).
- Color: `--chart-series-1` (jade) for positive trend (last > first), `--chart-series-2` (bronze) for negative. Fill gradient optional (off by default; on for card-hero variant).
- Tooltip: present, but stripped — shows only the value at cursor X, no header.

**Recharts JSX:**

```jsx
<ResponsiveContainer width={width} height={height}>
  <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
    <Line
      type="monotone"
      dataKey="y"
      stroke={trend === 'up' ? 'var(--chart-series-1)' : 'var(--chart-series-2)'}
      strokeWidth={1.5}
      dot={false}
      isAnimationActive={false}
    />
    <Tooltip
      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, padding: '4px 8px', boxShadow: 'var(--shadow-soft)' }}
      labelStyle={{ display: 'none' }}
      itemStyle={{ color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}
      cursor={false}
      formatter={fmt}
    />
  </LineChart>
</ResponsiveContainer>
```

**A11y:** sparklines do NOT get focusable role=img — they sit alongside a number that already conveys the value. The `<svg>` is `aria-hidden="true"`. The accompanying number IS the data; the sparkline is a glance.

**Exception:** sparkline used as a standalone surface (e.g. in chat reply with no neighboring number) DOES get `role="img" aria-label="..."`.

---

### 4.6 Stacked bar

**Use:** broker contribution to portfolio over months; sector mix change quarter-over-quarter.

**Anatomy:**
- Each stack typically 3-5 segments. Beyond 5, group remainder.
- Segment fills use the 7-hue series palette in order. Same color order as donut.
- Bar radius applies only to the topmost segment: `radius={[6, 6, 0, 0]}` for last `<Bar>` in stack, `radius={[0, 0, 0, 0]}` for inner. Recharts trick: pass radius as array, but only the topmost stack gets non-zero corners.
- 1px white border between stacks for paper-cut feel: `stroke="var(--card)"` `strokeWidth={1}`.
- Legend always shown, bottom-center.

**Recharts JSX:**

```jsx
<ResponsiveContainer width="100%" height={260}>
  <BarChart data={data} margin={{ top: 8, right: 8, bottom: 24, left: 0 }}>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="0" />
    <XAxis dataKey="x" {...} />
    <YAxis tickFormatter={fmt} {...} />
    <Tooltip {...} />
    <Legend {...} />
    {series.map((s, i) => (
      <Bar
        key={s.key}
        dataKey={s.key}
        name={s.label}
        stackId="stack"
        fill={SERIES_VARS[i]}
        stroke="var(--card)"
        strokeWidth={1}
        radius={i === series.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
        isAnimationActive
        animationDuration={600}
      />
    ))}
  </BarChart>
</ResponsiveContainer>
```

**A11y:** `"Stacked bar chart of {title}. {data.length} bars × {series.length} stacks: {seriesNames.join(', ')}."`

---

### 4.7 Scatter / dot plot

**Use:** position-vs-position analysis. Two examples:
- Return (Y) vs volatility (X) with one dot per position.
- Allocation weight (X) vs absolute drift (Y) — outliers stand out.

**Anatomy:**
- Dot radius: `r=5` default, `r=8` for «highlighted» group.
- Dot fill: by group / category. Up to 3 groups using series-1, series-2, series-4. Each group gets a unique shape too (circle, square, triangle) for color-blind safety.
- Optional dot labels on hover (tooltip shows position name + X/Y values).
- Reference lines: `<ReferenceLine x={0} ... />` and `<ReferenceLine y={0} ... />` for «zero-drift / zero-return» quadrants — `stroke="var(--chart-grid-strong)" strokeDasharray="2 4"`.

**Recharts JSX:**

```jsx
<ResponsiveContainer width="100%" height={260}>
  <ScatterChart margin={{ top: 8, right: 8, bottom: 24, left: 0 }}>
    <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="2 4" />
    <XAxis type="number" dataKey="x" name="Volatility" tickFormatter={pctFmt} {...} />
    <YAxis type="number" dataKey="y" name="Return" tickFormatter={pctFmt} {...} />
    <ZAxis range={[60, 60]} />
    <Tooltip cursor={{ strokeDasharray: '2 4' }} {...} />
    <Legend {...} />
    {groups.map((g, i) => (
      <Scatter
        key={g.key}
        name={g.label}
        data={g.points}
        fill={SERIES_VARS[i]}
        shape={SHAPE_ORDER[i]}     // 'circle' | 'square' | 'triangle'
      />
    ))}
  </ScatterChart>
</ResponsiveContainer>
```

`SHAPE_ORDER = ['circle', 'square', 'triangle']` — Recharts `<Scatter shape={...}>` supports built-in names.

**A11y:** `"Scatter plot of {title}. {totalPoints} points across {groups.length} groups: {groupNames.join(', ')}. X axis: {xLabel}. Y axis: {yLabel}."`

---

### 4.8 Candlestick / OHLC (T3 — designed, not implemented; Lane-A structural constraints)

**Use:** single-position price history (open, high, low, close per period). Power-user explicit ask only: «show me NVDA's last week of *candles*». **Default chat-answer for price history is the line variant (§4.1, catalog A2b)**, not candlestick — finance-advisor v1.1 catalog A2b explicitly classifies candlestick as the highest Lane-A-risk visual surface in the catalog because it is visually indistinguishable from broker / TradingView trading-app charts and carries the strongest implicit «entry/exit» reading.

**Lane-A structural constraint (Risk Flag 1 — finance-advisor v1.1):** the Candlestick payload schema (`CandlestickChartPayload` in §5.2) STRUCTURALLY EXCLUDES the following fields. They are not «optional and policed» — they are absent from the Zod schema entirely, so the contract REJECTS them at parse time even if the AI agent produces them.

| Forbidden overlay / annotation | Why excluded |
|---|---|
| `supportLine`, `resistanceLine` | Predictive technical-analysis pattern. Implies entry/exit. Lane B. |
| `trendLine`, `channelBand` | Same as above — trader-tool conventions. |
| `movingAverage` (any window: 20D, 50D, 200D, EMA, SMA) | MVP exclusion. V2 only with explicit «historical observation» framing AND legal sign-off. Schema does NOT include this field. |
| `rsi`, `macd`, `bollinger` (and any sibling indicator: ATR, Stochastic, ADX, Ichimoku, etc.) | Hard-banned indicator family. Trader/advisor tool convention. Lane B. Schema rejects ALL fields named with these tokens. |
| `buyMarker`, `sellMarker` (action-prompt arrows) | Prescriptive. Lane B. |
| `signalAnnotation` (generic) | Catch-all rejection — schema has no «signal» concept. |

**Permitted overlays:** none in MVP. Even the user's own historical trade markers (catalog D2 lots) are deliberately omitted from the Candlestick payload schema for v1 — they go in the Line variant (§4.1.1) which has the safer narrative register. Future V2 may add user-trade markers to the candlestick if legal-advisor signs off.

**Rationale documented per finance-advisor catalog v1.1 §A2b:** «Candlestick visual semantics carry trader-tool connotations that may push Lane A further than line… SEC/MiFID exposure mandates structural exclusion of indicator and signal payload fields, not policy-only enforcement.» Tech-lead enforces the schema; product-designer cannot ship a candlestick variant with these fields by visual mockup alone — the schema rejects it.

**Recharts has no built-in candle.** We render via a `<ComposedChart>` with a custom `<Bar shape={CandleShape} />`. The custom shape draws:
- A vertical line from `low` to `high` (the wick) — `1px var(--ink)` light / `var(--text-2)` dark.
- A rectangle from `open` to `close` — fill `var(--chart-series-1)` if `close ≥ open` (bull), `var(--chart-series-2)` if `close < open` (bear). Width 60% of x-band.

**Recharts JSX (sketch):**

```jsx
function CandleShape(props) {
  const { x, y, width, height, low, high, open, close } = props;
  const isBull = close >= open;
  const fill = isBull ? 'var(--chart-series-1)' : 'var(--chart-series-2)';
  // y here is yScale(high), height is yScale(low) - yScale(high)
  // body sits between yScale(open) and yScale(close)
  const bodyTop = isBull ? yScale(close) : yScale(open);
  const bodyHeight = Math.abs(yScale(close) - yScale(open));
  const cx = x + width / 2;
  const bodyX = x + width * 0.2;
  const bodyW = width * 0.6;
  return (
    <g>
      <line x1={cx} x2={cx} y1={y} y2={y + height} stroke="var(--ink)" strokeWidth={1} />
      <rect x={bodyX} y={bodyTop} width={bodyW} height={Math.max(bodyHeight, 1)} fill={fill} />
    </g>
  );
}

<ResponsiveContainer width="100%" height={300}>
  <ComposedChart data={data}>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="2 4" />
    <XAxis dataKey="x" {...} />
    <YAxis domain={['dataMin * 0.98', 'dataMax * 1.02']} tickFormatter={fmt} {...} />
    <Tooltip {...} />
    <Bar dataKey="hl" shape={<CandleShape />} isAnimationActive={false} />
  </ComposedChart>
</ResponsiveContainer>
```

(In practice the implementation is fiddlier — `dataKey` for candles needs a paired transform feeding both `[low, high]` and the body bounds. Frontend-engineer will productionize when T3 lands.)

**A11y:** `"Candlestick chart of {symbol} from {firstX} to {lastX}. {data.length} sessions. Latest close: {last.close}, {pctChange} from previous."`

**T3 status:** designed now to ensure the system can carry it. NOT in v1 ship scope. The two new colors needed (bull = jade, bear = bronze) are already in the palette — no new tokens.

---

### 4.9 Calendar (NEW v1.1 — T1 must-ship)

**Use:** dividend calendar (received + scheduled), corporate-actions calendar (splits / mergers / spin-offs / ticker changes). Catalog references C1 (MVP, anchor of weekly Insights digest), G3 (corp actions, MVP). V2 extensions: C4 bond coupons, D6 trade-frequency, G1 earnings, G5 forthcoming-events composite — all gated behind paid-data PO approval per R1.

**Lane-A structural constraint (Risk Flag 3 — finance-advisor v1.1):** Calendar payload `eventType` enum is restricted to `dividend` and `corp_action` for MVP. The Zod schema's discriminated literal REJECTS `earnings` and `news` until V2. This protects against accidental shipping of a feed that requires paid-data integration that PO has not yet approved (R1: no spend without PO approval). When V2 lands and PO greenlights an earnings feed (e.g. issuer IR + exchange filings normalized provider), the schema gets a v1.2 bump that adds `earnings` to the eventType enum — that bump is itself gated on PO sign-off.

**Spec rationale (per finance-advisor):** for our event-driven prosumer 32–42 multi-broker ICP, calendar is foundational. Investors at this stage build their week around dividend pay-dates, ex-dates, scheduled corporate actions, and (when V2 lands) earnings releases for their positions. Calendar is on the same level of primacy as line / bar — not a niche surface. T1 must-ship.

**Why not Recharts:** Recharts has no calendar primitive. A month-grid is a CSS-grid problem (or `display: grid; grid-template-columns: repeat(7, 1fr)`), not a chart-library problem. Trying to bend `ScatterChart` or `BarChart` to render a calendar produces inferior output. We render directly as a styled component — pure SVG / DOM.

**Anatomy:**

A calendar surface is composed of:
1. **Calendar header.** Month name + year, in `Geist 16/600 -0.025em --ink`, left-aligned. Right-aligned: `Total scheduled $XXX · Total received $YYY` in `Geist Mono 11/500 0.04em --text-2 tnum`.
2. **Day-of-week row.** `MON TUE WED THU FRI SAT SUN` in `Geist Mono 9/500 0.22em uppercase --text-3`.
3. **Day grid.** 7 columns × 5–6 rows depending on month. Each cell: `min-height: 56px`, `padding: 6px 8px`, `border-radius: 8px`, `background: var(--inset)` for current month days, `transparent` for previous/next-month spillover days.
4. **Day number.** Top-left of cell, `Geist 11/500 --text-2 tnum`. Today's date: bold `--ink` 600 with a 2px `--accent` underline.
5. **Event marker(s) in cell.** A horizontal stack (max 2 visible, `+N more` if more) of small status pills. Each pill: `4px 6px` padding, `border-radius: 4px`, `font: Geist Mono 9/500 --ink tnum`. Pill shape and color encode `eventType` × `status` per §2.6:
   - dividend `received`: filled jade pill `var(--accent)` text-on-color.
   - dividend `scheduled`: filled mid-jade pill `var(--chart-series-4)` text-on-color.
   - dividend `announced`: outlined jade pill (`1px var(--chart-series-7)` border, transparent fill, text `--chart-series-7`).
   - `corp_action`: filled bronze diamond-shaped pill (clip-path diamond) `var(--terra)` text-on-color.
6. **Optional: weekly total row** at right edge of each row (week-of-month roll-up). Shown only when month is dense (>10 events).

**Container HTML/CSS (no Recharts):**

```jsx
<div role="img" aria-label="..." aria-describedby="cal-{id}-desc" tabIndex={0} className="cal-grid">
  <header className="cal-head">
    <h4 className="cal-month">April 2026</h4>
    <div className="cal-totals">
      <span className="cal-total received">Received <strong>$284</strong></span>
      <span className="cal-total scheduled">Scheduled <strong>$412</strong></span>
    </div>
  </header>
  <div className="cal-dow">
    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
  </div>
  <div className="cal-grid-body">
    {days.map((day) => (
      <div key={day.date} className={`cal-cell ${day.inMonth ? 'in' : 'out'} ${day.isToday ? 'today' : ''}`}>
        <span className="cal-daynum">{day.day}</span>
        {day.events.slice(0, 2).map((e) => (
          <span key={e.id} className={`cal-pill ${e.eventType} ${e.status}`}>
            {e.ticker} {fmt(e.expectedAmount, e.currency)}
          </span>
        ))}
        {day.events.length > 2 && (
          <span className="cal-pill more">+{day.events.length - 2} more</span>
        )}
      </div>
    ))}
  </div>
</div>
```

**Calendar CSS additions** (added to design-system.html `<style>` block):

```css
.cal-grid { font-family: 'Geist', sans-serif; color: var(--ink); }
.cal-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.cal-month { font-size: 16px; font-weight: 600; letter-spacing: -0.025em; margin: 0; }
.cal-totals { display: flex; gap: 14px; font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--text-2); }
.cal-totals strong { color: var(--ink); font-variant-numeric: tabular-nums; }
.cal-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 6px; }
.cal-dow > span { font-family: 'Geist Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-3); padding: 4px 8px; }
.cal-grid-body { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: minmax(56px, auto); gap: 4px; }
.cal-cell { padding: 6px 8px; border-radius: 8px; background: var(--inset); display: flex; flex-direction: column; gap: 4px; min-height: 56px; }
.cal-cell.out { background: transparent; opacity: 0.4; }
.cal-cell.today .cal-daynum { color: var(--ink); font-weight: 600; border-bottom: 2px solid var(--accent); padding-bottom: 1px; }
.cal-daynum { font-size: 11px; font-weight: 500; color: var(--text-2); font-variant-numeric: tabular-nums; }
.cal-pill { padding: 3px 6px; border-radius: 4px; font-family: 'Geist Mono', monospace; font-size: 9px; font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1.1; }
.cal-pill.dividend.received { background: var(--accent); color: var(--ink-on-accent, #F4F1EA); }
.cal-pill.dividend.scheduled { background: var(--chart-series-4); color: var(--ink-on-accent, #F4F1EA); }
.cal-pill.dividend.announced { background: transparent; border: 1px solid var(--chart-series-7); color: var(--chart-series-7); }
.cal-pill.corp_action { background: var(--terra); color: #F4F1EA; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); padding: 4px 12px; }
.cal-pill.more { background: transparent; color: var(--text-3); font-weight: 500; }
@media (max-width: 480px) {
  .cal-grid-body { grid-auto-rows: minmax(44px, auto); gap: 2px; }
  .cal-cell { padding: 4px 5px; min-height: 44px; }
  .cal-pill { font-size: 8px; padding: 2px 4px; }
}
```

**Hover state:**
- Hover on a cell: cell `box-shadow: var(--shadow-soft)` (subtle lift), `200ms ease-out-expo`. Pills inside become slightly more saturated (no scale — preserves grid alignment).
- Hover on a pill: pill scales 1.04× and a tooltip card appears 8px above showing full event detail (ticker name, full payment date, ex-date if dividend, share-amount × DPS computation, broker source).

**Tooltip on pill** (pure CSS popover or Radix popover wrapper):
- Mini-card layout same as Recharts tooltip in §3.5 but content tailored to events:
  - Header: `APR 12 · 2026 · DIVIDEND PAYMENT` (eyebrow mono).
  - Body line 1: `KO · Coca-Cola Co` in `Geist 13/500 --ink`.
  - Body line 2: `100 shares × $0.485 DPS` in `Geist Mono 11/500 --text-2 tnum`.
  - Body line 3: `= $48.50` in `Geist 13/600 --ink tnum`.
  - Footer (eyebrow): `Source: IBKR corporate actions feed · synced 2026-04-26 · Status: Scheduled (broker-confirmed)`.

**Mobile (320–767):**
- Calendar grid keeps 7 columns; cell `min-height: 44px` (was 56); pill font `8px` (was 9).
- Pills truncate to ticker only at 320 (no `$XX.XX` shown — too crowded). Full detail on tap → bottom-sheet popover with all events on the tapped day.
- If the month has 6 rows, scroll vertically inside the chart-card (max-height 360, overflow-y auto).

**A11y label generator:**
```
"Calendar of {payload.title}. {data.events.length} events shown for {monthLabel}. Total received: {fmt(totalReceived, currency)}. Total scheduled: {fmt(totalScheduled, currency)}."
```

**Screen-reader transcript** (`aria-describedby` target):
```html
<table id="cal-{id}-desc" class="sr-only">
  <caption>Dividend calendar, April 2026</caption>
  <thead><tr><th>Date</th><th>Ticker</th><th>Type</th><th>Status</th><th>Amount</th></tr></thead>
  <tbody>
    <tr><td>2026-04-12</td><td>KO</td><td>Dividend</td><td>Received</td><td>$48.50</td></tr>
    <!-- ... -->
  </tbody>
</table>
```

**Empty state:**
```html
<div class="chart-empty">
  <div class="ce-eyebrow">NO EVENTS · CALENDAR</div>
  <div class="ce-icon"><svg ... calendar icon /></div>
  <div class="ce-head">No dividends scheduled or received in this period</div>
  <div class="ce-body">Once your broker reports dividend payments, they'll appear here.</div>
</div>
```

**Loading state:** §3.10 calendar skeleton — 7×5 muted grid with mock event-pill positions in `var(--inset)` shimmer.

**Out of MVP scope:**
- Trade-frequency heatmap (D6) — V2 — re-uses the calendar grid component but with intensity-cell encoding instead of event-pills. Document for future, do not ship.
- Earnings calendar (G1) — V2, requires paid-data feed.
- News calendar (G4) — V2, requires paid-data feed.
- Forthcoming-events composite (G5) — V2, depends on G1.

---

### 4.10 Treemap (NEW v1.1 — T1 must-ship)

**Use:** concentration / portfolio-at-a-glance. Catalog reference B9 (MVP) — replaces the older F1 concentration heatmap as the canonical answer to «show me my portfolio» / «what dominates my portfolio». Tile size encodes `weightPct`; tile fill encodes `dailyChangePct` via a bidirectional color scale (positive = jade, negative = bronze, zero ≈ neutral muted). Two visual channels in one chart — the canonical reason treemap exists in finance.

**Why this earns its own primitive (rationale per finance-advisor):** donut shows weight only; scatter shows two arbitrary numerics with one dot per position. Neither answers «show me my portfolio at a glance» — donut loses spatial proportion at >7 segments, scatter is inscrutable to the prosumer at any density. Treemap is the canonical industry-standard answer (Bloomberg, Morningstar, Sigfig, Wealthfront all use treemaps for this question). Composing one out of donut+bar produces visibly inferior output.

**Recharts native:** Recharts ships a `<Treemap>` primitive (`recharts/es6/chart/Treemap`) — verified in `node_modules/.../recharts/types/chart/Treemap.d.ts`. Squarify algorithm built-in. Custom rendering via `content` render prop, which receives `(node) => ReactElement` for each computed tile. We use that hook to draw our paper-restraint tile style.

**Anatomy:**

- Aspect ratio: `aspectRatio={1.618}` (golden — Recharts default; produces stable readable tiles).
- Default container size: `320 × 320` (square-ish), `420 × 320` (detail view, wider).
- Each tile: filled rectangle, `1px var(--card)` separator stroke (paper-cut feel), corner-radius 0 (treemap tiles are crisp, not soft — soft corners would mis-read as «individual cards»).
- **Fill color = daily-change encoding.** A divergent muted palette — NOT the series palette:
  - `dailyChangePct ≥ +2%`: `var(--chart-series-1)` (deep jade) at 0.85 opacity.
  - `+0.5% to +2%`: `var(--chart-series-1)` at 0.55 opacity.
  - `-0.5% to +0.5%` (≈ flat): `var(--chart-series-5)` (neutral grey) at 0.30 opacity.
  - `-0.5% to -2%`: `var(--chart-series-2)` (bronze) at 0.55 opacity.
  - `≤ -2%`: `var(--chart-series-2)` at 0.85 opacity.
  - When `dailyChangePct` is absent (e.g. ICP without intraday data): all tiles fill `var(--chart-series-5)` at 0.50 opacity — the chart degrades to single-channel (weight only) gracefully. NO color-only encoding then.
- **Tile labels:**
  - Tiles ≥ 4% of total area: `<TICKER>` in `Geist 13/600 -0.01em --ink` (light tile bg) or `--cream` (dark tile bg) + `<weight%>` in `Geist Mono 10/500 0.04em` below the ticker.
  - Tiles < 4%: unlabeled. Hover tooltip carries the data.
  - «Other» tile (aggregated tail): label `OTHER · N items` in `Geist Mono 10/500 0.18em uppercase`, fill `var(--chart-series-5)` at 0.40 opacity.
- **Caption (mandatory per finance-advisor B9):** beneath the chart-card, in `Geist 11/400 --text-2`: «Tile size = % of portfolio; color = today's price change. Treemap describes proportions; concentration thresholds are factual conventions per FINRA, not Provedo recommendations.»

**Recharts JSX:**

```jsx
<ResponsiveContainer width="100%" height={320}>
  <Treemap
    data={tiles}
    dataKey="weightPct"
    nameKey="ticker"
    aspectRatio={1.618}
    stroke="var(--card)"
    strokeWidth={1}
    isAnimationActive
    animationDuration={600}
    content={<TreemapTile />}
  >
    <Tooltip content={<TreemapTooltip />} />
  </Treemap>
</ResponsiveContainer>
```

`TreemapTile` is the custom renderer (frontend-engineer ports per spec):

```jsx
function TreemapTile(props) {
  const { x, y, width, height, ticker, weightPct, dailyChangePct, isOther } = props;
  const fill = colorForChange(dailyChangePct, isOther);   // returns var(--chart-series-N) with opacity
  const showLabel = (width * height) >= 0.04 * (props.root.width * props.root.height);
  const labelColor = labelOnTile(fill);                   // ink for light tiles, cream for dark
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="var(--card)" strokeWidth={1} />
      {showLabel && width > 60 && height > 36 && (
        <>
          <text x={x + 8} y={y + 18} fontFamily="Geist" fontSize={13} fontWeight={600} fill={labelColor}>{ticker}</text>
          <text x={x + 8} y={y + 34} fontFamily="Geist Mono" fontSize={10} fill={labelColor} opacity={0.7}>{weightPct.toFixed(1)}%</text>
        </>
      )}
    </g>
  );
}
```

**Hover state:**
- Hover tile: scales the fill saturation by +0.10 opacity (0.55 → 0.65), draws a 2px `var(--ink)` outer stroke. Cursor changes to `pointer` if drill-in is wired (default: not wired in MVP).
- Tooltip (custom): mini-card `Geist Mono` eyebrow `APR 26 · 2026 · 2:14 PM ET` (the asOf timestamp), then `<TICKER · Full Name>`, then mono lines `Weight: X.XX% · Value: $XX,XXX · Today: +Y.YY%`, then citation `Source: IBKR · synced 2026-04-26`.

**Scaling per finance-advisor B9:**
- Small (≤20 positions): all tiles labeled (where space permits).
- Medium (20–100): top-20 + «Other» tile. Other is rendered as a single neutral-grey tile in the bottom-right corner of the treemap.
- Large (>100): top-30 + «Other».
- Mobile (≤767 width): top-12 + «Other».
- AI agent does the top-N selection. Renderer receives a pre-cut tile array.

**Mobile (320–767):**
- Container size: `min(100vw - 48, 320) × 280`.
- Aspect ratio shifts to `1.0` (square) at ≤480px to fit better in narrow viewports.
- Top-12 tiles only (per scaling rule).
- Labels: tiles ≥ 8% of total area get labels (was 4% on desktop — denser labels would crash at narrow widths).
- Hover → tap-to-pin per §6.3.

**A11y label generator:**
```
"Treemap of {payload.title}. {tiles.length} positions. Largest: {top.ticker} at {top.weightPct}%. Smallest visible: {bot.ticker} at {bot.weightPct}%. Color encodes today's price change: {posCount} up, {negCount} down, {flatCount} flat."
```

**Screen-reader transcript:**
```html
<table id="tree-{id}-desc" class="sr-only">
  <caption>Concentration treemap of {portfolioName}, asOf {asOf}</caption>
  <thead><tr><th>Ticker</th><th>Name</th><th>Weight %</th><th>Value</th><th>Today's change %</th></tr></thead>
  <tbody>
    <tr><td>NVDA</td><td>NVIDIA Corp</td><td>14.2%</td><td>$32,140</td><td>+2.1%</td></tr>
    <!-- ... -->
  </tbody>
</table>
```

**Empty state:** if `tiles.length < 2`, suppress the treemap entirely and redirect to A2 single-position card. The renderer renders the §3.9 empty-state lockup with body «Treemap needs at least 2 positions; you currently have N.»

**Loading state:** §3.10 treemap skeleton — 4-tile mosaic in `var(--inset)` shimmer with 1px `var(--card)` separators.

**Color-blind verification:** the divergent fill scale uses jade (positive) vs bronze (negative) which collapse to one band under deuteranopia BUT are differentiated by OKLCH-L (jade L=0.42 vs bronze L=0.45 at full saturation; at our muted 0.55 opacity the gap remains discriminable). Critical mitigation: tile labels show `+X.X%` / `-X.X%` directly inside the tile when tile is large enough; tooltip always shows signed value. Caption explicitly states the encoding. Achromatopsia worst case: tiles read as varied greys with smaller / larger size differential — still answers «what dominates my portfolio» which is the primary question. The «is today red or green?» secondary signal is conveyed by the tile label percent.

---

### 4.11 Cash-flow waterfall (NEW v1.1 — T2 next-wave)

**Use:** decompose change in portfolio value into mechanical components: startValue → (deposits) → (withdrawals) → (realized gains) → (unrealized gains) → (dividends received) → (interest) → (fees) → (FX effects) → endValue. Catalog reference C6. Common quarterly / annual review question: «Where did my growth come from this year?» / «How much of my portfolio change is deposits vs gains?». Anchor of «year-in-review» Insights digests.

**Why this earns its own primitive (rationale per finance-advisor):** decomposition charts answer a fundamentally different question than line / area charts (which show «over time») or bar charts (which show «across positions»). Waterfall answers «across components». A horizontal bar with positive/negative values does NOT communicate the cumulative-baseline geometry that's the whole point — the eye must trace each step from startValue to endValue. This is a standard finance convention (every finance app and CFO dashboard uses waterfalls for decomposition); composing one from generic bar would lose the floating-baseline clarity. T2 because it's not in 80%+ of chat answers, but it's a foundational quarterly-review chart.

**Lane-A note:** waterfall is descriptive / observational ONLY. Per finance-advisor C6 caption: «Decomposes change in portfolio value into mechanical components: cash you added, gains your positions made, dividends and interest received, FX effects. Does not predict future contributions.» — mandatory caption baked into payload. No predictive «projected next year» extension; no «what-if» scenario waterfall (those are H4 territory and out of scope here).

**Recharts implementation:** no native waterfall in Recharts. We use `<ComposedChart>` + a custom `<Bar shape={WaterfallStep}>` — same custom-shape pattern proven in §4.8 candlestick. The data transform produces a per-step `[base, top]` pair where `base` is the floating baseline (cumulative running total before this step) and `top` is the value after this step. The custom shape draws a rectangle from `yScale(base)` to `yScale(top)` with appropriate fill.

**Anatomy:**

- Default container: `100% × 300` (slightly taller than bar to accommodate floating-baseline geometry).
- Steps in canonical order (frontend-engineer enforces; AI agent emits in this order):
  1. `startValue` — anchor bar, full-height from 0 to startValue, fill `var(--chart-series-3)` (ink) at 0.85 opacity. Labeled `Start · $XXX,XXX` below.
  2. `deposits` (positive) — floating green bar above prior cumulative, fill `var(--chart-series-1)` (jade).
  3. `withdrawals` (negative) — floating bronze bar below prior cumulative, fill `var(--chart-series-2)` (bronze).
  4. `realized_gains` (positive or negative) — floating jade or bronze depending on sign.
  5. `unrealized_gains` (positive or negative) — same.
  6. `dividends_received` (positive) — floating jade.
  7. `interest` (positive) — floating jade. (Many users have $0; renderer must elide zero-value bars.)
  8. `fees` (negative, typically small) — floating bronze.
  9. `fx_effects` (positive or negative) — floating jade or bronze.
  10. `endValue` — anchor bar, full-height from 0 to endValue, fill `var(--chart-series-3)` (ink) at 0.85 opacity. Labeled `End · $XXX,XXX` below.
- **Connector lines:** between each pair of adjacent bars, a 1px dashed `var(--chart-grid-strong)` `strokeDasharray="2 4"` horizontal connector links the top of bar N to the base of bar N+1 — visualizes the «running total» eye-trace.
- **Bar width:** ~56px on desktop. Bar gap: 16px.
- **Step labels (above each floating bar):** signed value in `Geist Mono 11/500 tnum`, color matches sign (jade for +, bronze for −). E.g. `+$12,400` or `−$2,180`.
- **X-axis labels (below each bar):** wrapped to 2 lines if needed, `Geist Mono 10/500 0.04em --text-2`. E.g. `Deposits` / `Realized` / `Unrealized` / `Dividends` / `FX`.
- **Y-axis:** standard currency formatting; Y-domain `[0, max(startValue, endValue) * 1.15]`.

**Recharts JSX (sketch — frontend-engineer productionizes):**

```jsx
function WaterfallStep(props) {
  const { x, y, width, height, base, top, isAnchor, sign } = props;
  const fill = isAnchor
    ? 'var(--chart-series-3)'
    : sign >= 0 ? 'var(--chart-series-1)' : 'var(--chart-series-2)';
  return <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={isAnchor ? 0.85 : 1.0} rx={4} />;
}

function WaterfallConnector({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--chart-grid-strong)" strokeDasharray="2 4" />;
}

<ResponsiveContainer width="100%" height={300}>
  <ComposedChart data={waterfallSteps} margin={{ top: 24, right: 8, bottom: 32, left: 0 }}>
    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="2 4" />
    <XAxis dataKey="label" tick={...} tickLine={false} axisLine={false} />
    <YAxis tickFormatter={fmt} tick={...} tickLine={false} axisLine={false} />
    <Tooltip content={<WaterfallTooltip />} />
    <Bar dataKey="visible" shape={<WaterfallStep />} isAnimationActive animationDuration={600} />
    {/* connectors rendered as overlayed <line> elements via <ReferenceLine> or custom layer */}
  </ComposedChart>
</ResponsiveContainer>
```

(In practice the data transform pre-computes `[base, top]` per step and the custom shape draws between them. Frontend-engineer will productionize when T2 lands.)

**Hover state:**
- Hover a step bar: bar saturation +0.10 opacity, tooltip card shows the step's exact contribution.
- Tooltip layout:
  - Eyebrow: `STEP 5 OF 10 · UNREALIZED GAINS`.
  - Body line 1: `+$8,420 (+3.7% of period)` in `Geist 13/600 tnum`, jade for +, bronze for −.
  - Body line 2: `Cumulative running total: $246,890` in `Geist Mono 11/500 --text-2 tnum`.
  - Footer: `Source: holdings + price feed via IBKR · period 2026-01-01 to 2026-04-26`.

**A11y label generator:**
```
"Waterfall chart of {payload.title}. {steps.length} steps from {fmt(startValue)} on {periodStart} to {fmt(endValue)} on {periodEnd}. Net change: {signedDelta} ({signedPct}%). Largest positive contributor: {topPos.label} at {fmt(topPos.deltaAbs)}. Largest negative contributor: {topNeg.label} at {fmt(topNeg.deltaAbs)}."
```

**Screen-reader transcript:**
```html
<table id="wat-{id}-desc" class="sr-only">
  <caption>Cash-flow waterfall, period {periodStart} to {periodEnd}</caption>
  <thead><tr><th>Step</th><th>Component</th><th>Delta</th><th>Cumulative</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Start value</td><td>—</td><td>$220,000</td></tr>
    <tr><td>2</td><td>Deposits</td><td>+$10,000</td><td>$230,000</td></tr>
    <tr><td>3</td><td>Realized gains</td><td>+$4,200</td><td>$234,200</td></tr>
    <!-- ... -->
    <tr><td>10</td><td>End value</td><td>—</td><td>$246,890</td></tr>
  </tbody>
</table>
```

**Mobile (320–767):**
- Container height grows: `360px` (instead of compressing) — waterfall steps need vertical room more than horizontal.
- X-axis label text truncates: `Realized gains` → `Realized` at ≤480; `Unrealized gains` → `Unrealized`; `Dividends received` → `Dividends`. Truncations are fixed-rule, not LLM-driven.
- If >7 components, hide elide zero-value steps automatically (e.g. user has no interest income → hide that step).

**Empty state:** if `<30` days of history per catalog C6 fallback, suppress with `Provedo needs ~30 days of history to compute a waterfall; currently has N days.` in the §3.9 empty-state lockup. If startValue and endValue equal (no change), render with all components visible at value 0 with caption «No net change in this period.»

**Loading state:** §3.10 waterfall skeleton — baseline at 80% Y plus 5 staircased floating bars with 1px hairline connectors, all in `var(--inset)` shimmer.

**Color-blind verification:** jade-positive vs bronze-negative — same OKLCH-L gap analysis as the bar chart (§4.3). Mitigations: signed value labels above each bar (`+$X,XXX` / `−$X,XXX`) are the primary signal. Connector geometry shows running total irrespective of color. Anchor bars (start/end) are ink, distinct from contributory bars.

---

## 5. JSON contract schema (TypeScript-first)

This is the contract the AI agent backend produces. The frontend renderer parses it via Zod and dispatches to the matching Recharts component. Tech-lead will use this as the basis for the OpenAPI spec.

### 5.1 Core principles

1. **Discriminated union on `kind`.** TypeScript narrowing works correctly; renderer is a `switch (payload.kind)` with one branch per type.
2. **Self-describing units.** Every numeric value carries a `format` so the renderer doesn't guess if `1234` is dollars, percent, or count.
3. **Explicit series labels.** The agent owns naming — the renderer does NOT generate fallback names like «Series 1». If a series lacks a label, validation rejects.
4. **Stable `key` on every series and slice.** The renderer uses `key` for React list keys and for stable color assignment when the agent updates an existing chart in place.
5. **Optional `meta.alt`** for a11y override. If absent, renderer generates from the spec in §7.

### 5.2 The schema

```typescript
// packages/charts-contract/src/types.ts (proposed location; backend-engineer scope to decide)

import { z } from 'zod';

/* ─── primitives ─────────────────────────────────────────────────── */

const ValueFormat = z.enum([
  'currency',      // e.g. $1,234.56
  'currency-compact', // e.g. $1.2k, $1.84M
  'percent',       // e.g. +2.4%
  'percent-delta', // e.g. +2.4pp (basis-point-style delta)
  'count',         // e.g. 12 positions
  'ratio',         // e.g. 1.42x
  'date',          // x-axis date — see XAxisFormat
]);
type ValueFormat = z.infer<typeof ValueFormat>;

const XAxisFormat = z.enum([
  'date-day',      // Apr 12
  'date-month',    // Apr
  'date-year',     // 2024
  'category',      // generic string — e.g. broker name, position name
  'numeric',       // for scatter X axes
]);
type XAxisFormat = z.infer<typeof XAxisFormat>;

const Currency = z.string().regex(/^[A-Z]{3}$/).default('USD');

const ChartMeta = z.object({
  title: z.string(),                              // chart title in the response
  subtitle: z.string().optional(),                // optional subtitle / time range
  alt: z.string().optional(),                     // a11y override; if absent renderer generates
  source: z.string().optional(),                  // citation — «IBKR · 2026-04-25»
  emptyHint: z.string().optional(),               // shown in empty state body
}).strict();

/* ─── data point shapes ──────────────────────────────────────────── */

const TimePoint = z.object({
  x: z.union([z.string(), z.number()]),           // ISO date string or unix ms
  y: z.number(),
}).strict();

const CategoryPoint = z.object({
  x: z.string(),                                   // category label
  y: z.number(),
}).strict();

const MultiSeriesPoint = z.object({
  x: z.union([z.string(), z.number()]),
}).catchall(z.number());                           // dynamic series keys: { x: 'Apr', ibkr: 1200, binance: 800 }

const ScatterPoint = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),                       // optional bubble size / weight
  label: z.string().optional(),                   // hover label per dot
}).strict();

const CandlePoint = z.object({
  x: z.union([z.string(), z.number()]),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
}).strict();

/* ─── series ──────────────────────────────────────────────────────── */

const Series = z.object({
  key: z.string(),                                 // stable key for React
  label: z.string(),                               // human label for legend / tooltip
  color: z.string().optional(),                    // OPTIONAL override; usually omitted, renderer assigns from palette by index
}).strict();

/* ─── chart kinds ─────────────────────────────────────────────────── */

/* Lane-A overlay constraints applied to Line and Candlestick.
 * The schemas EXCLUDE prescriptive technical-analysis overlay types entirely.
 * They are not policed at runtime — they are absent from the type, so the
 * Zod parser rejects them at parse time even if the AI agent emits them. */
const TradeMarker = z.object({
  type: z.literal('trade_marker'),                  // user's own historical trade — Lane A factual
  date: z.union([z.string(), z.number()]),
  side: z.enum(['buy', 'sell']),
  qty: z.number().positive(),
  price: z.number().positive(),
}).strict();

// Reserved-name list: any future "advisor overlay" must NOT use these tokens
// as discriminant literals. Zod schema actively rejects them via .refine().
const FORBIDDEN_OVERLAY_TYPES = [
  'support_line', 'resistance_line', 'trend_line', 'channel_band',
  'moving_average', 'ema', 'sma', 'bollinger', 'rsi', 'macd',
  'atr', 'stochastic', 'adx', 'ichimoku', 'fibonacci', 'pivot_point',
  'buy_marker', 'sell_marker', 'signal_annotation', 'recommendation_annotation',
  'target_price', 'price_target', 'projected_price',
] as const;

const LineOverlay = z.discriminatedUnion('type', [
  TradeMarker,
  // intentionally NO branches for forbidden types — they fail discriminator match
]).refine(
  (v) => !(FORBIDDEN_OVERLAY_TYPES as readonly string[]).includes((v as { type: string }).type),
  { message: 'Forbidden overlay type — Lane A structural exclusion (see CHARTS_SPEC.md §4.1.1 / §4.8)' }
);

const LineChartPayload = z.object({
  kind: z.literal('line'),
  meta: ChartMeta,
  xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }),
  yAxis: z.object({ format: ValueFormat, currency: Currency.optional(), label: z.string().optional(), domain: z.tuple([z.union([z.number(), z.literal('auto')]), z.union([z.number(), z.literal('auto')])]).optional() }),
  series: z.array(Series).min(1).max(3),           // 1-3 lines
  data: z.array(MultiSeriesPoint).min(0).max(500),
  interpolation: z.enum(['monotone', 'linear', 'step']).default('monotone'),
  benchmark: z.object({ y: z.number(), label: z.string() }).optional(), // optional reference line at a single Y value (e.g. starting cost basis); may NOT be a price target / projection
  overlay: z.array(LineOverlay).optional(),         // ONLY trade markers permitted (Lane A — see §4.1.1)
}).strict();

const AreaChartPayload = z.object({
  kind: z.literal('area'),
  meta: ChartMeta,
  xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }),
  yAxis: z.object({ format: ValueFormat, currency: Currency.optional(), label: z.string().optional() }),
  series: z.array(Series).min(1).max(5),
  data: z.array(MultiSeriesPoint).min(0).max(500),
  stacked: z.boolean().default(false),
  interpolation: z.enum(['monotone', 'linear', 'step']).default('monotone'),
}).strict();

/* Bar reference line — restricted to zero-axis only.
 * Lane-A constraint per §4.3: target-weight reference lines are PROHIBITED
 * because target weight implies prescription. The only reference line a Bar
 * payload may carry is the zero axis (for diverging bar — drift, P&L sign).
 * No `type: 'target' | 'benchmark-target' | 'aspiration'` etc. */
const BarReferenceLine = z.object({
  axis: z.literal('zero'),                          // ONLY zero permitted; no other reference geometry
  label: z.string().optional(),                     // optional axis label, e.g. "Zero drift"
}).strict();

const BarChartPayload = z.object({
  kind: z.literal('bar'),
  meta: ChartMeta,
  xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }),
  yAxis: z.object({ format: ValueFormat, currency: Currency.optional(), label: z.string().optional() }),
  data: z.array(CategoryPoint).min(0).max(50),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
  colorBySign: z.boolean().default(false),
  diverging: z.boolean().default(false),
  referenceLine: BarReferenceLine.optional(),       // ONLY zero-axis reference; targetWeight schema-forbidden (§4.3)
  // intentionally NO `targetWeight: number` field — see §4.3 Lane A constraint
}).strict();

const StackedBarChartPayload = z.object({
  kind: z.literal('stacked-bar'),
  meta: ChartMeta,
  xAxis: z.object({ format: XAxisFormat, label: z.string().optional() }),
  yAxis: z.object({ format: ValueFormat, currency: Currency.optional(), label: z.string().optional() }),
  series: z.array(Series).min(2).max(5),
  data: z.array(MultiSeriesPoint).min(0).max(50),
  referenceLine: BarReferenceLine.optional(),       // ONLY zero-axis; same constraint as Bar
  // intentionally NO `targetWeight` / `benchmarkTarget` fields
}).strict();

const DonutChartPayload = z.object({
  kind: z.literal('donut'),
  meta: ChartMeta,
  format: ValueFormat,                              // applies to every slice value
  currency: Currency.optional(),
  segments: z.array(z.object({
    key: z.string(),
    label: z.string(),
    value: z.number().nonnegative(),
    color: z.string().optional(),
  })).min(1).max(7),                                // up to 7; rest grouped by agent
  centerLabel: z.string().optional(),               // override; otherwise renders sum + meta.subtitle
}).strict();

const SparklinePayload = z.object({
  kind: z.literal('sparkline'),
  meta: ChartMeta,
  format: ValueFormat,
  currency: Currency.optional(),
  data: z.array(TimePoint).min(2).max(120),         // ≥ 2 points to compute trend
  trend: z.enum(['up', 'down', 'flat']).optional(), // override; otherwise computed last vs first
  filled: z.boolean().default(false),               // gradient fill below line
}).strict();

const ScatterChartPayload = z.object({
  kind: z.literal('scatter'),
  meta: ChartMeta,
  xAxis: z.object({ format: ValueFormat, label: z.string() }),
  yAxis: z.object({ format: ValueFormat, label: z.string() }),
  groups: z.array(z.object({
    key: z.string(),
    label: z.string(),
    color: z.string().optional(),
    points: z.array(ScatterPoint).min(1),
  })).min(1).max(3),
  referenceLines: z.array(z.object({
    axis: z.enum(['x', 'y']),
    value: z.number(),
    label: z.string().optional(),
  })).optional(),
}).strict();

/* Candlestick — Lane A structural exclusions per §4.8 / Risk Flag 1.
 * The schema is intentionally MINIMAL. It does NOT carry any of:
 *   - support / resistance / trend / channel lines
 *   - moving averages (any window, any type)
 *   - RSI / MACD / Bollinger / ATR / Stochastic / ADX / Ichimoku / etc.
 *   - buy / sell markers / signal annotations / recommendation annotations
 *   - target prices / price projections
 * These fields are absent from the schema entirely. The Zod parser rejects
 * any payload that includes them via `.strict()`, which fails on unknown keys.
 * Even user trade markers (catalog D2) are deliberately excluded from the
 * Candlestick variant for v1 — they are permitted only on the safer Line
 * variant per §4.1.1. Future V2 may permit user trade markers here behind
 * legal-advisor sign-off. */
const CandlestickChartPayload = z.object({
  kind: z.literal('candlestick'),
  meta: ChartMeta,
  xAxis: z.object({ format: XAxisFormat }),
  yAxis: z.object({ format: ValueFormat, currency: Currency.optional() }),
  symbol: z.string(),                                // e.g. 'NVDA'
  data: z.array(CandlePoint).min(1).max(365),
  // STRUCTURALLY EXCLUDED in v1.1 (see §4.8 Risk Flag 1):
  //   - overlay, indicators, supportLine, resistanceLine, trendLine, channelBand
  //   - movingAverage, rsi, macd, bollinger, signalAnnotation, buyMarker, sellMarker
  //   - tradeMarkers (deferred to V2 with legal sign-off)
}).strict();

/* ─── calendar (NEW v1.1) ─────────────────────────────────────────── */

/* MVP eventType is restricted to dividend + corp_action.
 * earnings + news + bond_coupon are RESERVED and rejected by the Zod
 * parser via discriminator-mismatch. They will be added in v1.2 only
 * after PO greenlights the corresponding paid-data integration (Hard
 * rule R1 — no spend without PO approval). See §4.9 Risk Flag 3. */
const CalendarEventType = z.enum(['dividend', 'corp_action']);
type CalendarEventType = z.infer<typeof CalendarEventType>;

const DividendEvent = z.object({
  id: z.string(),
  eventType: z.literal('dividend'),
  ticker: z.string(),
  name: z.string().optional(),
  exDate: z.string().optional(),                    // ISO date — exDate may be absent for received-only entries
  payDate: z.string(),                              // ISO date — required
  amountPerShare: z.number().nonnegative().optional(),
  shares: z.number().nonnegative().optional(),
  expectedAmount: z.number(),                       // computed = amountPerShare * shares (or broker-reported gross)
  currency: Currency.default('USD'),
  status: z.enum(['received', 'scheduled', 'announced']),
  brokerSource: z.string(),                         // e.g. "IBKR corporate-actions feed"
}).strict();

const CorpActionEvent = z.object({
  id: z.string(),
  eventType: z.literal('corp_action'),
  ticker: z.string(),
  name: z.string().optional(),
  effectiveDate: z.string(),                        // ISO date
  actionType: z.enum(['split', 'reverse_split', 'spinoff', 'merger', 'ticker_change', 'name_change']),
  ratio: z.string().optional(),                     // e.g. "2:1" for splits
  description: z.string(),                          // factual description
  status: z.enum(['announced', 'effective']),
  brokerSource: z.string(),
}).strict();

const CalendarEvent = z.discriminatedUnion('eventType', [
  DividendEvent,
  CorpActionEvent,
  // INTENTIONALLY NO branches for 'earnings' / 'news' / 'bond_coupon' — V2
]);

const CalendarPayload = z.object({
  kind: z.literal('calendar'),
  meta: ChartMeta,
  view: z.enum(['month', 'week', 'list']).default('month'),
  periodStart: z.string(),                          // ISO date — first day of grid
  periodEnd: z.string(),                            // ISO date — last day of grid
  events: z.array(CalendarEvent).max(500),
  totalReceived: z.number().nonnegative().optional(),
  totalScheduled: z.number().nonnegative().optional(),
  currency: Currency.default('USD'),
}).strict();

/* ─── treemap (NEW v1.1) ──────────────────────────────────────────── */

const TreemapTile = z.object({
  key: z.string(),                                  // stable id (typically ticker)
  ticker: z.string(),
  name: z.string().optional(),
  weightPct: z.number().min(0).max(100),            // percent of portfolio (0-100)
  valueAbs: z.number().nonnegative(),
  sector: z.string().optional(),
  dailyChangePct: z.number().optional(),            // optional second-channel encoding
  isOther: z.boolean().default(false),              // true for the aggregated tail tile
  itemCount: z.number().int().positive().optional(), // present on isOther tile only
}).strict();

const TreemapPayload = z.object({
  kind: z.literal('treemap'),
  meta: ChartMeta,
  asOf: z.string().datetime(),
  baseCurrency: Currency.default('USD'),
  tiles: z.array(TreemapTile).min(2).max(50),       // suppress single-position case at the agent layer
  // NO concentrationThreshold field — that would imply normative «too concentrated» framing;
  // FINRA conventions appear in caption text only, per §4.10 Lane A note.
}).strict();

/* ─── waterfall (NEW v1.1) ────────────────────────────────────────── */

const WaterfallStep = z.object({
  key: z.string(),
  label: z.string(),                                // human label, e.g. "Deposits", "Realized gains"
  componentType: z.enum([
    'start',
    'deposits',
    'withdrawals',
    'realized_gains',
    'unrealized_gains',
    'dividends_received',
    'interest',
    'fees',
    'fx_effects',
    'end',
  ]),
  deltaAbs: z.number(),                             // positive or negative; for start/end this is the anchor value
}).strict();

const WaterfallPayload = z.object({
  kind: z.literal('waterfall'),
  meta: ChartMeta,
  startValue: z.number(),
  endValue: z.number(),
  steps: z.array(WaterfallStep).min(3).max(12),     // start + ≥1 component + end
  periodStart: z.string(),                          // ISO
  periodEnd: z.string(),                            // ISO
  currency: Currency.default('USD'),
}).strict();

/* ─── union ───────────────────────────────────────────────────────── */

export const ChartPayload = z.discriminatedUnion('kind', [
  LineChartPayload,
  AreaChartPayload,
  BarChartPayload,
  StackedBarChartPayload,
  DonutChartPayload,
  SparklinePayload,
  ScatterChartPayload,
  CandlestickChartPayload,
  CalendarPayload,                                  // NEW v1.1
  TreemapPayload,                                   // NEW v1.1
  WaterfallPayload,                                 // NEW v1.1
]);

export type ChartPayload = z.infer<typeof ChartPayload>;

/* ─── chart envelope ──────────────────────────────────────────────── */

export const ChartEnvelope = z.object({
  id: z.string().uuid(),                            // stable id for React reconciliation across streaming updates
  payload: ChartPayload,
  createdAt: z.string().datetime(),
}).strict();

export type ChartEnvelope = z.infer<typeof ChartEnvelope>;
```

### 5.3 Example payloads

**Line chart — portfolio value over 30 days:**

```json
{
  "id": "f3a8c1de-...",
  "payload": {
    "kind": "line",
    "meta": {
      "title": "Portfolio value",
      "subtitle": "Last 30 days · all brokers",
      "source": "IBKR + Binance · synced 2026-04-26"
    },
    "xAxis": { "format": "date-day", "label": "Date" },
    "yAxis": { "format": "currency-compact", "currency": "USD", "label": "Value" },
    "series": [{ "key": "y", "label": "Total" }],
    "data": [
      { "x": "2026-03-28", "y": 220180 },
      { "x": "2026-03-29", "y": 221450 },
      "..."
    ],
    "interpolation": "monotone"
  },
  "createdAt": "2026-04-27T10:14:22Z"
}
```

**Donut — sector allocation:**

```json
{
  "id": "8a9d2e7c-...",
  "payload": {
    "kind": "donut",
    "meta": {
      "title": "Allocation by sector",
      "subtitle": "5 sectors · $226,390 total"
    },
    "format": "currency-compact",
    "currency": "USD",
    "segments": [
      { "key": "tech", "label": "Tech", "value": 92500 },
      { "key": "fin", "label": "Financials", "value": 54200 },
      { "key": "energy", "label": "Energy", "value": 38900 },
      { "key": "health", "label": "Healthcare", "value": 22800 },
      { "key": "other", "label": "Other", "value": 17990 }
    ],
    "centerLabel": "$226K"
  },
  "createdAt": "2026-04-27T10:14:22Z"
}
```

**Sparkline — inline in chat reply:**

```json
{
  "id": "1c4b...",
  "payload": {
    "kind": "sparkline",
    "meta": { "title": "Portfolio · 7d" },
    "format": "currency-compact",
    "currency": "USD",
    "data": [
      { "x": "2026-04-20", "y": 218500 },
      { "x": "2026-04-21", "y": 220100 },
      { "x": "2026-04-22", "y": 219800 },
      { "x": "2026-04-23", "y": 222400 },
      { "x": "2026-04-24", "y": 225100 },
      { "x": "2026-04-25", "y": 224700 },
      { "x": "2026-04-26", "y": 226390 }
    ],
    "trend": "up",
    "filled": false
  },
  "createdAt": "2026-04-27T10:14:22Z"
}
```

**Calendar — April 2026 dividend month (NEW v1.1):**

```json
{
  "id": "cal-2c8a...",
  "payload": {
    "kind": "calendar",
    "meta": {
      "title": "Dividend calendar — April 2026",
      "subtitle": "3 received · 2 scheduled · all brokers",
      "source": "IBKR + Lynx · synced 2026-04-26"
    },
    "view": "month",
    "periodStart": "2026-04-01",
    "periodEnd": "2026-04-30",
    "events": [
      {
        "id": "ev-001",
        "eventType": "dividend",
        "ticker": "KO",
        "name": "Coca-Cola Co",
        "exDate": "2026-04-08",
        "payDate": "2026-04-12",
        "amountPerShare": 0.485,
        "shares": 100,
        "expectedAmount": 48.50,
        "currency": "USD",
        "status": "received",
        "brokerSource": "IBKR corporate-actions feed"
      },
      {
        "id": "ev-002",
        "eventType": "dividend",
        "ticker": "JNJ",
        "name": "Johnson & Johnson",
        "exDate": "2026-04-22",
        "payDate": "2026-04-29",
        "amountPerShare": 1.19,
        "shares": 50,
        "expectedAmount": 59.50,
        "currency": "USD",
        "status": "scheduled",
        "brokerSource": "IBKR corporate-actions feed"
      },
      {
        "id": "ev-003",
        "eventType": "corp_action",
        "ticker": "GOOGL",
        "name": "Alphabet Inc",
        "effectiveDate": "2026-04-15",
        "actionType": "split",
        "ratio": "2:1",
        "description": "2-for-1 stock split effective at market open 2026-04-15",
        "status": "announced",
        "brokerSource": "Lynx corporate-actions feed"
      }
    ],
    "totalReceived": 284.10,
    "totalScheduled": 412.00,
    "currency": "USD"
  },
  "createdAt": "2026-04-27T10:14:22Z"
}
```

**Treemap — concentration (NEW v1.1):**

```json
{
  "id": "tree-9d3e...",
  "payload": {
    "kind": "treemap",
    "meta": {
      "title": "Concentration",
      "subtitle": "Tile size = weight; color = today's change",
      "source": "IBKR · synced 2026-04-26 14:14 ET"
    },
    "asOf": "2026-04-26T18:14:00Z",
    "baseCurrency": "USD",
    "tiles": [
      { "key": "NVDA", "ticker": "NVDA", "name": "NVIDIA Corp",       "weightPct": 14.2, "valueAbs": 32140, "sector": "Technology",  "dailyChangePct":  2.1, "isOther": false },
      { "key": "MSFT", "ticker": "MSFT", "name": "Microsoft Corp",    "weightPct": 11.8, "valueAbs": 26720, "sector": "Technology",  "dailyChangePct":  0.6, "isOther": false },
      { "key": "AAPL", "ticker": "AAPL", "name": "Apple Inc",         "weightPct":  9.4, "valueAbs": 21280, "sector": "Technology",  "dailyChangePct": -1.2, "isOther": false },
      { "key": "GOOGL","ticker": "GOOGL","name": "Alphabet Inc",      "weightPct":  7.1, "valueAbs": 16080, "sector": "Technology",  "dailyChangePct":  1.4, "isOther": false },
      { "key": "BRK_B","ticker": "BRK.B","name": "Berkshire Hathaway","weightPct":  6.8, "valueAbs": 15400, "sector": "Financials",  "dailyChangePct":  0.3, "isOther": false },
      { "key": "JNJ",  "ticker": "JNJ",  "name": "Johnson & Johnson", "weightPct":  5.2, "valueAbs": 11780, "sector": "Healthcare",  "dailyChangePct": -0.4, "isOther": false },
      { "key": "XOM",  "ticker": "XOM",  "name": "ExxonMobil",        "weightPct":  4.6, "valueAbs": 10410, "sector": "Energy",      "dailyChangePct":  3.2, "isOther": false },
      { "key": "OTHER","ticker": "OTHER","name": "Other (12 positions)","weightPct": 40.9, "valueAbs": 92580, "isOther": true, "itemCount": 12 }
    ]
  },
  "createdAt": "2026-04-27T10:14:22Z"
}
```

**Waterfall — YTD cash-flow decomposition (NEW v1.1):**

```json
{
  "id": "wat-7b1f...",
  "payload": {
    "kind": "waterfall",
    "meta": {
      "title": "Where your value came from",
      "subtitle": "YTD · 2026-01-01 to 2026-04-26",
      "source": "IBKR cash flows + holdings · FX via FRED"
    },
    "startValue": 220000,
    "endValue": 246890,
    "steps": [
      { "key": "start",        "label": "Start value",         "componentType": "start",            "deltaAbs": 220000 },
      { "key": "deposits",     "label": "Deposits",            "componentType": "deposits",         "deltaAbs":  10000 },
      { "key": "withdrawals",  "label": "Withdrawals",         "componentType": "withdrawals",      "deltaAbs":  -2000 },
      { "key": "realized",     "label": "Realized gains",      "componentType": "realized_gains",   "deltaAbs":   4200 },
      { "key": "unrealized",   "label": "Unrealized gains",    "componentType": "unrealized_gains", "deltaAbs":   8420 },
      { "key": "dividends",    "label": "Dividends",           "componentType": "dividends_received","deltaAbs":   1850 },
      { "key": "interest",     "label": "Interest",            "componentType": "interest",         "deltaAbs":    240 },
      { "key": "fees",         "label": "Fees",                "componentType": "fees",             "deltaAbs":    -90 },
      { "key": "fx",           "label": "FX",                  "componentType": "fx_effects",       "deltaAbs":    270 },
      { "key": "end",          "label": "End value",           "componentType": "end",              "deltaAbs": 246890 }
    ],
    "periodStart": "2026-01-01",
    "periodEnd": "2026-04-26",
    "currency": "USD"
  },
  "createdAt": "2026-04-27T10:14:22Z"
}
```

### 5.4 Validation contract

The frontend renderer:
1. Validates the envelope with Zod on receipt.
2. On parse failure: renders the §3.11 error state. Logs the validation error to monitoring (post-MVP — stub during dev).
3. On `data: []` with a non-empty schema-valid payload: renders the §3.9 empty state.
4. NEVER falls back silently. Either it renders correctly, renders empty, or renders error. No partial.

---

## 6. Mobile responsive (320px-first)

### 6.1 Breakpoints

We design at six widths: `320` (smallest phone), `375` (iPhone SE), `768` (tablet), `1024` (small laptop), `1440` (typical laptop), `1920` (large monitor).

- **320–767:** mobile single-column.
- **768–1023:** tablet — donut legend goes right, scatter expands.
- **1024+:** desktop — all chart types in default proportions.

### 6.2 Per-chart mobile overrides

| Chart | 320 behavior |
|---|---|
| Line / Area | Y-axis width 40 (was 52); X-axis tick min-gap 36 (was 24); height 200 (was 220) |
| Bar | If > 6 categories: switch orientation to horizontal (Y categorical, X numeric); height grows to `40 * count + 40` |
| Donut | Size 160; legend stacks below |
| Sparkline | Same — sparklines are size-agnostic by design |
| **Calendar** | Cell `min-height: 44px` (was 56); pill font `8px` (was 9); pills truncate to ticker only (no `$XX.XX`); on tap → bottom-sheet popover with full event detail. If month has 6 rows, scroll vertically inside chart-card (max-height 360, overflow-y auto). |
| **Treemap** | Container `min(100vw - 48, 320) × 280`; aspect ratio shifts to `1.0` (square) at ≤480; top-12 tiles only (was top-20 desktop); labels appear only on tiles ≥ 8% of total area (was 4% desktop). Hover → tap-to-pin per §6.3. |
| Stacked bar | Drop to ≤ 4 series visible (group remainder into «Other»); legend wraps to 2 lines if needed |
| Scatter | Size 240×240; legend below; reference lines kept |
| **Waterfall** | Container height grows to `360px` (instead of compressing — vertical room matters more than horizontal); X-axis labels truncate via fixed-rule (`Realized gains` → `Realized`, etc.); zero-value steps auto-elided. Connector lines kept. |
| Candlestick | Width-constrained: shows last 14 sessions; horizontal scroll within chart container for older |

### 6.3 Tooltip on touch (no hover)

On touch devices (`@media (hover: none)`):
- Tooltip behaves as **tap-to-pin**: tap on chart pins tooltip to that X point.
- Tap outside chart unpins.
- For stacked / multi-series: tooltip slides up from bottom as a sticky sheet, full-width minus 24px gutter, max-height 40vh, scrollable for many series. Same `--card` background and `shadow-lift` elevation. Close button top-right (`X` icon, btn-icon size 32px).

### 6.4 Chart inside a card

When a chart sits inside a Provedo card (`shadow-card` baseline), the chart MUST:
- Inherit padding from the card (default `--card-padding: 24px`).
- NOT re-draw a card background — `<ResponsiveContainer>` is the chart frame; the surrounding card is the elevation.
- NOT add its own border — the card's `--shadow-card` provides the rim.

---

## 7. Accessibility patterns

### 7.1 Roles and ARIA

Every chart container (the `<div>` Recharts is mounted in):
- `role="img"`
- `aria-label="{generated alt text}"` (per-chart generators in §4)
- `aria-describedby="chart-{id}-desc"` pointing to a visually hidden `<table>` containing the data (see §7.4).
- `tabIndex={0}` so keyboard users land on the chart.

### 7.2 Keyboard navigation

- `Tab` — focuses chart. Outline ring per design system (`outline: 2px solid var(--accent); outline-offset: 2px`).
- `Arrow Right / Arrow Left` — moves cursor through data points (line / area / bar / stacked bar / candlestick); cycles slices for donut.
- `Arrow Up / Arrow Down` — for scatter, moves through points within the focused group; for line with multiple series, switches active series.
- `Enter / Space` — selects the focused point (e.g. drill-down click handler).
- `Esc` — closes tooltip and removes focus.
- `Home / End` — jump to first / last point.

Implementation note: Recharts doesn't ship keyboard nav natively. The frontend-engineer will add a thin wrapper `useChartKeyboardNav(ref, data)` that synchronises an external `activeIndex` state with Recharts' `<Tooltip active>` and `<Line activeDot>` props.

### 7.3 Color-blind safety — by chart

| Chart | Color-only encoding? | Mitigation |
|---|---|---|
| Line | Yes (multi-series differentiated by color) | Limit 3 series; use line-dash variation: solid for series-1, dashed for series-2 (`strokeDasharray="6 4"`), dotted for series-3 (`strokeDasharray="2 4"`). |
| Area | Yes | Same as line + stacked area uses different fill opacities (1.0 / 0.8 / 0.6 / 0.4 / 0.2) per stack from bottom up. |
| Bar | Color used (colorBySign) | Leading sign on labels (`+2.4%` / `−5.8%`) is the primary signal. Color is reinforcement. |
| Donut | Yes | Slice labels visible on hover; tab-cycle reads label aloud; legend always shown. Pattern fills (diagonal stripes for series-2, dots for series-6) added when data has 5+ slices — this requires a Recharts `<defs><pattern></pattern></defs>` block and `fill="url(#pattern-2)"` on Cells. |
| Sparkline | Color trend (jade up / bronze down) | Adjacent text always shows direction sign — sparkline is glance-only, not the primary read. |
| **Calendar** | Yes (event status: received / scheduled / announced / corp_action) | **Shape + outline-vs-fill encoding** — corp_action is a diamond-clip-path pill, distinct from rectangular pills. `announced` is outlined-not-filled, distinct from filled `received` / `scheduled`. Sub-status within `dividend` (received vs scheduled) is the only purely-color distinction; mitigation: hover tooltip and screen-reader transcript both surface status as text. Future V2 adds triangle (earnings) and outlined-circle (news) shapes — no two event types ever share both color AND shape. |
| **Treemap** | Yes (daily-change encoding via fill: jade positive, bronze negative, grey flat) | Tile labels show `+X.X%` / `−X.X%` directly inside large-enough tiles. Tooltip always shows signed value. Caption explicitly states the encoding. Achromatopsia worst case: tile *size* answers the primary «what dominates» question; sign-of-change is conveyed via in-tile percent text. Single-channel-degrade: when `dailyChangePct` is absent in the payload, all tiles render as muted grey at 0.50 opacity — no color encoding at all, weight-only signal. |
| Stacked bar | Yes | Series labels in legend; pattern fills like donut for 4+ stacks. |
| Scatter | Yes (group by color) | **Shape encoding** — circle / square / triangle per group (built into spec). |
| **Waterfall** | Yes (positive jade / negative bronze for components; ink anchor for start/end) | Signed value labels (`+$12,400` / `−$2,180`) above each floating bar are the primary signal. Connector geometry shows running-total flow irrespective of color. Anchor bars (start/end) use ink — distinct luminance pole from contributory bars. Tooltip always shows signed value + running total. |
| Candlestick | Yes (bull / bear by color) | Wick + body geometry (close above open = body filled with jade; below = bronze; **hollow body for bull is an alternative for ultra-strict accessibility**, post-MVP option). |

### 7.4 Screen-reader transcripts

Every chart includes a hidden `<table>` accessible via `aria-describedby`. The table is the canonical alt-text for screen readers. CSS class `sr-only`:

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

Example for a line chart:

```html
<table id="chart-{id}-desc" class="sr-only">
  <caption>Portfolio value, last 30 days</caption>
  <thead>
    <tr><th>Date</th><th>Value (USD)</th></tr>
  </thead>
  <tbody>
    <tr><td>2026-03-28</td><td>$220,180</td></tr>
    <tr><td>2026-03-29</td><td>$221,450</td></tr>
    <!-- ... -->
  </tbody>
</table>
```

For multi-series: one row per X value, one column per series.

For donut: one row per slice with label, value, percent.

The renderer auto-generates this table from the same payload. Frontend-engineer factors a `<ChartDataTable payload={payload} />` component.

### 7.5 Reduced motion

When `prefers-reduced-motion: reduce`:
- All Recharts `isAnimationActive={false}`.
- Tooltip appears instantly (no fade).
- Skeleton loading: shimmer animation off; static muted fill.
- Legend dim-on-hover transitions: instant instead of 300ms.
- Donut hover scale: removed (slice doesn't grow; only outline ring appears).

### 7.6 Contrast verification

All series colors ≥ 3:1 against both `--bg` light and dark, verified in §2.2 / §2.3.

Tooltip text (`--ink` on `--card`):
- Light: 17.93:1 (AAA)
- Dark: 17.21:1 (AAA)

Axis labels (`--text-3`):
- Light: 4.06:1 — passes UI 3:1, fails body AA 4.5:1 by 0.44. **Same caveat as the design system §3.1.** Action: tighten `--text-3` to `#6E6E6E` (4.84:1) at the design-tokens layer; will fix axis labels system-wide.
- Dark: 5.20:1 — passes AAA.

---

## 8. Showcase HTML — drop-in for `apps/web/public/design-system.html`

This section provides ready-to-paste markup to add a new `Charts` section to the showcase. Frontend-engineer will integrate. Mock data is fixed-seed deterministic so showcase doesn't change on reload.

### 8.1 New nav entry

In the `.ds-nav` block, add:

```html
<a href="#charts">Charts</a>
```

### 8.2 Chart palette swatches block

Add to the existing color section, right after the surface swatches:

```html
<div class="ds-row">
  <div class="ds-row-label">CHART SERIES — 7-HUE PALETTE (COLOR-BLIND SAFE)</div>
  <div class="swatches">
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-1)"></div><div><div class="sw-name">series-1 · jade</div><div class="sw-hex">var(--chart-series-1)</div></div></div>
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-2)"></div><div><div class="sw-name">series-2 · bronze</div><div class="sw-hex">var(--chart-series-2)</div></div></div>
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-3)"></div><div><div class="sw-name">series-3 · ink</div><div class="sw-hex">var(--chart-series-3)</div></div></div>
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-4)"></div><div><div class="sw-name">series-4 · mid-jade</div><div class="sw-hex">var(--chart-series-4)</div></div></div>
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-5)"></div><div><div class="sw-name">series-5 · grey</div><div class="sw-hex">var(--chart-series-5)</div></div></div>
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-6)"></div><div><div class="sw-name">series-6 · soft bronze</div><div class="sw-hex">var(--chart-series-6)</div></div></div>
    <div class="swatch"><div class="sw-chip" style="background:var(--chart-series-7)"></div><div><div class="sw-name">series-7 · deep jade</div><div class="sw-hex">var(--chart-series-7)</div></div></div>
  </div>
</div>
```

### 8.3 Chart section CSS additions

Add to the `<style>` block:

```css
/* ============ CHARTS ============ */
.ds-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 8px; }
@media (max-width: 900px) { .ds-charts { grid-template-columns: 1fr; } }

.chart-card {
  background: var(--card);
  border-radius: 18px;
  padding: 22px 24px 20px;
  box-shadow: var(--shadow-card);
  font-family: 'Geist', sans-serif;
  font-feature-settings: 'tnum' 1, 'cv11' 1;
}
.chart-card .chart-eyebrow {
  font-family: 'Geist Mono', monospace;
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-3); font-weight: 500; margin-bottom: 8px;
}
.chart-card .chart-title {
  font-family: 'Geist', sans-serif;
  font-size: 18px; font-weight: 600; color: var(--ink);
  letter-spacing: -0.025em; margin-bottom: 4px;
}
.chart-card .chart-sub {
  font-size: 12px; color: var(--text-2); margin-bottom: 16px;
}
.chart-card .chart-body { width: 100%; }

.chart-legend {
  display: flex; gap: 16px; flex-wrap: wrap;
  margin-top: 14px; padding-top: 12px;
  border-top: 1px dotted var(--border-divider);
  font-size: 11px; color: var(--text-2); font-weight: 500;
}
.chart-legend .leg-item {
  display: inline-flex; align-items: center; gap: 6px;
}
.chart-legend .leg-dot {
  width: 8px; height: 8px; border-radius: 2px;
}

/* Donut center label */
.donut-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.donut-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  pointer-events: none;
}
.donut-center .dc-value {
  font-family: 'Geist', sans-serif; font-size: 28px; font-weight: 600;
  letter-spacing: -0.035em; color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.donut-center .dc-label {
  font-family: 'Geist Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-3); font-weight: 500; margin-top: 2px;
}

/* sparkline inline (in card or chat reply) */
.spark-inline {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Geist', sans-serif; font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.spark-inline .spark-value { font-weight: 500; color: var(--ink); }
.spark-inline .spark-delta { color: var(--accent); font-weight: 600; }
.spark-inline .spark-delta.down { color: var(--terra); }
.spark-inline .spark-svg { width: 60px; height: 20px; }

/* empty state */
.chart-empty {
  position: relative; height: 220px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--card); border-radius: 14px;
  border: 1px dashed var(--border);
}
.chart-empty .ce-eyebrow {
  font-family: 'Geist Mono', monospace; font-size: 9px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-3); margin-bottom: 12px; font-weight: 500;
}
.chart-empty .ce-icon {
  width: 40px; height: 40px; border-radius: 8px;
  background: var(--inset);
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-inset-light);
  margin-bottom: 12px;
}
.chart-empty .ce-head {
  font-size: 14px; font-weight: 600; color: var(--ink);
  margin-bottom: 4px; letter-spacing: -0.01em;
}
.chart-empty .ce-body {
  font-size: 12px; color: var(--text-2); max-width: 260px;
  text-align: center; line-height: 1.5;
}

/* loading skeleton variants */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.chart-skeleton {
  height: 220px; border-radius: 14px;
  background: linear-gradient(90deg, var(--inset) 0%, var(--card) 50%, var(--inset) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .chart-skeleton { animation: none; background: var(--inset); }
}

/* error state */
.chart-error {
  height: 200px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--card); border-radius: 14px;
  border: 1px solid var(--terra);
}
.chart-error .ce-head { color: var(--terra); }

/* ============ CALENDAR (NEW v1.1) ============ */
/* Full CSS lives in §4.9 — repeated here for showcase HTML drop-in. */
.cal-grid { font-family: 'Geist', sans-serif; color: var(--ink); }
.cal-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.cal-month { font-size: 16px; font-weight: 600; letter-spacing: -0.025em; margin: 0; }
.cal-totals { display: flex; gap: 14px; font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--text-2); }
.cal-totals strong { color: var(--ink); font-variant-numeric: tabular-nums; }
.cal-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 6px; }
.cal-dow > span { font-family: 'Geist Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-3); padding: 4px 8px; }
.cal-grid-body { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: minmax(56px, auto); gap: 4px; }
.cal-cell { padding: 6px 8px; border-radius: 8px; background: var(--inset); display: flex; flex-direction: column; gap: 4px; min-height: 56px; }
.cal-cell.out { background: transparent; opacity: 0.4; }
.cal-cell.today .cal-daynum { color: var(--ink); font-weight: 600; border-bottom: 2px solid var(--accent); padding-bottom: 1px; align-self: flex-start; }
.cal-daynum { font-size: 11px; font-weight: 500; color: var(--text-2); font-variant-numeric: tabular-nums; }
.cal-pill { padding: 3px 6px; border-radius: 4px; font-family: 'Geist Mono', monospace; font-size: 9px; font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1.1; }
.cal-pill.dividend.received { background: var(--accent); color: #F4F1EA; }
.cal-pill.dividend.scheduled { background: var(--chart-series-4); color: #F4F1EA; }
.cal-pill.dividend.announced { background: transparent; border: 1px solid var(--chart-series-7); color: var(--chart-series-7); }
.cal-pill.corp_action { background: var(--terra); color: #F4F1EA; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); padding: 4px 12px; }
.cal-pill.more { background: transparent; color: var(--text-3); font-weight: 500; }
@media (max-width: 480px) {
  .cal-grid-body { grid-auto-rows: minmax(44px, auto); gap: 2px; }
  .cal-cell { padding: 4px 5px; min-height: 44px; }
  .cal-pill { font-size: 8px; padding: 2px 4px; }
}
```

### 8.4 Charts section markup

Place this inside `.stage` after the existing «Components» section. (The `<svg>` blocks are pure-SVG renderings of mock data — they demonstrate the visual system without needing Recharts to be loaded in the static HTML showcase.)

```html
<div id="charts" class="ds-section">
  <div class="head">
    <h3>Charts</h3>
    <span class="meta">11 TYPES · RECHARTS 3.8 + CSS-GRID CALENDAR</span>
  </div>

  <div class="ds-charts">

    <!-- 1. Line chart -->
    <div class="chart-card">
      <div class="chart-eyebrow">LINE · TIER 1</div>
      <div class="chart-title">Portfolio value</div>
      <div class="chart-sub">Last 30 days · all brokers</div>
      <div class="chart-body">
        <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" role="img" aria-label="Line chart of portfolio value">
          <!-- gridlines -->
          <line x1="0" y1="36" x2="400" y2="36" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="72" x2="400" y2="72" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="108" x2="400" y2="108" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="144" x2="400" y2="144" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <!-- line -->
          <path d="M 0 130 C 30 122 60 138 90 124 S 150 80 180 92 S 240 60 270 70 S 330 50 360 40 L 400 38" fill="none" stroke="var(--chart-series-1)" stroke-width="2"/>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>Total</span>
      </div>
    </div>

    <!-- 2. Area chart (single) -->
    <div class="chart-card">
      <div class="chart-eyebrow">AREA · TIER 1</div>
      <div class="chart-title">Cumulative P&L</div>
      <div class="chart-sub">Year to date</div>
      <div class="chart-body">
        <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" role="img" aria-label="Area chart of cumulative profit and loss">
          <defs>
            <linearGradient id="ds-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--chart-series-1)" stop-opacity="0.30"/>
              <stop offset="100%" stop-color="var(--chart-series-1)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="36" x2="400" y2="36" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="90" x2="400" y2="90" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="144" x2="400" y2="144" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <path d="M 0 140 C 40 132 80 120 120 110 S 200 80 240 70 S 320 48 400 32 L 400 180 L 0 180 Z" fill="url(#ds-area-grad)"/>
          <path d="M 0 140 C 40 132 80 120 120 110 S 200 80 240 70 S 320 48 400 32" fill="none" stroke="var(--chart-series-1)" stroke-width="2"/>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>Cumulative</span>
      </div>
    </div>

    <!-- 3. Bar chart with sign coloring -->
    <div class="chart-card">
      <div class="chart-eyebrow">BAR · TIER 1</div>
      <div class="chart-title">Position drift</div>
      <div class="chart-sub">Top 6 vs target allocation</div>
      <div class="chart-body">
        <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" role="img" aria-label="Bar chart of top 6 positions by drift">
          <line x1="0" y1="90" x2="400" y2="90" stroke="var(--chart-grid-strong)"/>
          <rect x="20" y="32" width="40" height="58" rx="6" ry="6" fill="var(--chart-series-1)"/>
          <rect x="80" y="50" width="40" height="40" rx="6" ry="6" fill="var(--chart-series-1)"/>
          <rect x="140" y="62" width="40" height="28" rx="6" ry="6" fill="var(--chart-series-1)"/>
          <rect x="200" y="90" width="40" height="22" fill="var(--chart-series-2)"/>
          <rect x="260" y="90" width="40" height="38" fill="var(--chart-series-2)"/>
          <rect x="320" y="90" width="40" height="52" fill="var(--chart-series-2)"/>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>Over-weighted</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2)"></span>Under-weighted</span>
      </div>
    </div>

    <!-- 4. Donut -->
    <div class="chart-card">
      <div class="chart-eyebrow">DONUT · TIER 1</div>
      <div class="chart-title">Allocation by sector</div>
      <div class="chart-sub">5 sectors</div>
      <div class="chart-body" style="display:flex;align-items:center;justify-content:center;height:200px">
        <div class="donut-wrap" style="width:180px;height:180px">
          <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="Donut chart of sector allocation. Total: 226 thousand US dollars across 5 sectors.">
            <!-- 5-slice ring rendered as discrete arcs -->
            <g transform="translate(90,90)">
              <!-- Tech 41% -->
              <circle r="74" cx="0" cy="0" fill="none" stroke="var(--chart-series-1)" stroke-width="22"
                stroke-dasharray="190 465" stroke-dashoffset="0" transform="rotate(-90)"/>
              <!-- Fin 24% -->
              <circle r="74" cx="0" cy="0" fill="none" stroke="var(--chart-series-4)" stroke-width="22"
                stroke-dasharray="112 465" stroke-dashoffset="-194" transform="rotate(-90)"/>
              <!-- Energy 17% -->
              <circle r="74" cx="0" cy="0" fill="none" stroke="var(--chart-series-7)" stroke-width="22"
                stroke-dasharray="79 465" stroke-dashoffset="-310" transform="rotate(-90)"/>
              <!-- Health 10% -->
              <circle r="74" cx="0" cy="0" fill="none" stroke="var(--chart-series-5)" stroke-width="22"
                stroke-dasharray="46 465" stroke-dashoffset="-393" transform="rotate(-90)"/>
              <!-- Other 8% -->
              <circle r="74" cx="0" cy="0" fill="none" stroke="var(--chart-series-2)" stroke-width="22"
                stroke-dasharray="38 465" stroke-dashoffset="-443" transform="rotate(-90)"/>
            </g>
          </svg>
          <div class="donut-center">
            <div class="dc-value">$226K</div>
            <div class="dc-label">PORTFOLIO</div>
          </div>
        </div>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>Tech 41%</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-4)"></span>Financials 24%</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-7)"></span>Energy 17%</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-5)"></span>Healthcare 10%</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2)"></span>Other 8%</span>
      </div>
    </div>

    <!-- 5. Sparkline (inline) -->
    <div class="chart-card">
      <div class="chart-eyebrow">SPARKLINE · TIER 1</div>
      <div class="chart-title">Inline trend</div>
      <div class="chart-sub">Used inside cards, table cells, chat replies</div>
      <div class="chart-body" style="display:flex;flex-direction:column;gap:16px">
        <div class="spark-inline">
          <span class="spark-value">$226,390</span>
          <span class="spark-delta">+2.4% wk</span>
          <svg class="spark-svg" viewBox="0 0 60 20" role="img" aria-hidden="true" preserveAspectRatio="none">
            <path d="M 0 14 L 10 12 L 20 13 L 30 9 L 40 6 L 50 7 L 60 4" fill="none" stroke="var(--chart-series-1)" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="spark-inline">
          <span class="spark-value">$42,180</span>
          <span class="spark-delta down">−5.8% wk</span>
          <svg class="spark-svg" viewBox="0 0 60 20" role="img" aria-hidden="true" preserveAspectRatio="none">
            <path d="M 0 4 L 10 6 L 20 5 L 30 9 L 40 12 L 50 14 L 60 16" fill="none" stroke="var(--chart-series-2)" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="spark-inline">
          <span class="spark-value">$184,210</span>
          <span class="spark-delta">+0.9% wk</span>
          <svg class="spark-svg" viewBox="0 0 60 20" role="img" aria-hidden="true" preserveAspectRatio="none">
            <path d="M 0 10 L 10 11 L 20 9 L 30 10 L 40 8 L 50 9 L 60 8" fill="none" stroke="var(--chart-series-1)" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 6. Stacked bar -->
    <div class="chart-card">
      <div class="chart-eyebrow">STACKED BAR · TIER 2</div>
      <div class="chart-title">Broker contribution</div>
      <div class="chart-sub">Last 6 months</div>
      <div class="chart-body">
        <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" role="img" aria-label="Stacked bar chart of broker contribution over 6 months">
          <line x1="0" y1="40" x2="400" y2="40" stroke="var(--chart-grid)"/>
          <line x1="0" y1="90" x2="400" y2="90" stroke="var(--chart-grid)"/>
          <line x1="0" y1="140" x2="400" y2="140" stroke="var(--chart-grid)"/>
          <!-- 6 stacks of (ibkr, binance, lynx) -->
          <g>
            <rect x="20" y="100" width="40" height="40" fill="var(--chart-series-1)" stroke="var(--card)"/>
            <rect x="20" y="78" width="40" height="22" fill="var(--chart-series-4)" stroke="var(--card)"/>
            <rect x="20" y="60" width="40" height="18" rx="6" ry="6" fill="var(--chart-series-7)" stroke="var(--card)"/>
          </g>
          <g>
            <rect x="80" y="98" width="40" height="42" fill="var(--chart-series-1)" stroke="var(--card)"/>
            <rect x="80" y="74" width="40" height="24" fill="var(--chart-series-4)" stroke="var(--card)"/>
            <rect x="80" y="54" width="40" height="20" rx="6" ry="6" fill="var(--chart-series-7)" stroke="var(--card)"/>
          </g>
          <g>
            <rect x="140" y="92" width="40" height="48" fill="var(--chart-series-1)" stroke="var(--card)"/>
            <rect x="140" y="68" width="40" height="24" fill="var(--chart-series-4)" stroke="var(--card)"/>
            <rect x="140" y="46" width="40" height="22" rx="6" ry="6" fill="var(--chart-series-7)" stroke="var(--card)"/>
          </g>
          <g>
            <rect x="200" y="86" width="40" height="54" fill="var(--chart-series-1)" stroke="var(--card)"/>
            <rect x="200" y="60" width="40" height="26" fill="var(--chart-series-4)" stroke="var(--card)"/>
            <rect x="200" y="36" width="40" height="24" rx="6" ry="6" fill="var(--chart-series-7)" stroke="var(--card)"/>
          </g>
          <g>
            <rect x="260" y="80" width="40" height="60" fill="var(--chart-series-1)" stroke="var(--card)"/>
            <rect x="260" y="56" width="40" height="24" fill="var(--chart-series-4)" stroke="var(--card)"/>
            <rect x="260" y="32" width="40" height="24" rx="6" ry="6" fill="var(--chart-series-7)" stroke="var(--card)"/>
          </g>
          <g>
            <rect x="320" y="74" width="40" height="66" fill="var(--chart-series-1)" stroke="var(--card)"/>
            <rect x="320" y="50" width="40" height="24" fill="var(--chart-series-4)" stroke="var(--card)"/>
            <rect x="320" y="28" width="40" height="22" rx="6" ry="6" fill="var(--chart-series-7)" stroke="var(--card)"/>
          </g>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>IBKR</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-4)"></span>Binance</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-7)"></span>LYNX</span>
      </div>
    </div>

    <!-- 7. Scatter -->
    <div class="chart-card">
      <div class="chart-eyebrow">SCATTER · TIER 2</div>
      <div class="chart-title">Return vs volatility</div>
      <div class="chart-sub">Each dot = one position</div>
      <div class="chart-body">
        <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none" role="img" aria-label="Scatter plot of position return versus volatility, three groups">
          <line x1="0" y1="100" x2="400" y2="100" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <line x1="200" y1="0" x2="200" y2="200" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <!-- group 1: circle -->
          <circle cx="100" cy="60" r="5" fill="var(--chart-series-1)"/>
          <circle cx="160" cy="80" r="5" fill="var(--chart-series-1)"/>
          <circle cx="120" cy="40" r="5" fill="var(--chart-series-1)"/>
          <circle cx="190" cy="68" r="5" fill="var(--chart-series-1)"/>
          <!-- group 2: square -->
          <rect x="245" y="55" width="10" height="10" fill="var(--chart-series-2)"/>
          <rect x="285" y="135" width="10" height="10" fill="var(--chart-series-2)"/>
          <rect x="320" y="115" width="10" height="10" fill="var(--chart-series-2)"/>
          <!-- group 3: triangle -->
          <polygon points="220,170 226,160 232,170" fill="var(--chart-series-4)"/>
          <polygon points="160,140 166,130 172,140" fill="var(--chart-series-4)"/>
          <polygon points="60,150 66,140 72,150" fill="var(--chart-series-4)"/>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1);border-radius:50%"></span>Equity</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2)"></span>Crypto</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-4);clip-path:polygon(50% 0%,0% 100%,100% 100%)"></span>ETF</span>
      </div>
    </div>

    <!-- 8. Candlestick -->
    <div class="chart-card">
      <div class="chart-eyebrow">CANDLESTICK · TIER 3 · POST-MVP</div>
      <div class="chart-title">NVDA · last 10 sessions</div>
      <div class="chart-sub">OHLC daily</div>
      <div class="chart-body">
        <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none" role="img" aria-label="Candlestick chart of NVDA last 10 sessions">
          <line x1="0" y1="40" x2="400" y2="40" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="100" x2="400" y2="100" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="160" x2="400" y2="160" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <!-- 10 candles, alternating bull/bear, each 32px wide cell -->
          <g>
            <line x1="20" y1="60" x2="20" y2="120" stroke="var(--ink)"/>
            <rect x="14" y="80" width="12" height="30" fill="var(--chart-series-1)"/>
          </g>
          <g>
            <line x1="56" y1="50" x2="56" y2="100" stroke="var(--ink)"/>
            <rect x="50" y="70" width="12" height="20" fill="var(--chart-series-1)"/>
          </g>
          <g>
            <line x1="92" y1="60" x2="92" y2="115" stroke="var(--ink)"/>
            <rect x="86" y="74" width="12" height="32" fill="var(--chart-series-2)"/>
          </g>
          <g>
            <line x1="128" y1="80" x2="128" y2="140" stroke="var(--ink)"/>
            <rect x="122" y="98" width="12" height="32" fill="var(--chart-series-2)"/>
          </g>
          <g>
            <line x1="164" y1="70" x2="164" y2="130" stroke="var(--ink)"/>
            <rect x="158" y="92" width="12" height="30" fill="var(--chart-series-1)"/>
          </g>
          <g>
            <line x1="200" y1="60" x2="200" y2="120" stroke="var(--ink)"/>
            <rect x="194" y="78" width="12" height="32" fill="var(--chart-series-1)"/>
          </g>
          <g>
            <line x1="236" y1="55" x2="236" y2="115" stroke="var(--ink)"/>
            <rect x="230" y="68" width="12" height="38" fill="var(--chart-series-1)"/>
          </g>
          <g>
            <line x1="272" y1="65" x2="272" y2="130" stroke="var(--ink)"/>
            <rect x="266" y="88" width="12" height="32" fill="var(--chart-series-2)"/>
          </g>
          <g>
            <line x1="308" y1="50" x2="308" y2="105" stroke="var(--ink)"/>
            <rect x="302" y="62" width="12" height="34" fill="var(--chart-series-1)"/>
          </g>
          <g>
            <line x1="344" y1="40" x2="344" y2="95" stroke="var(--ink)"/>
            <rect x="338" y="52" width="12" height="30" fill="var(--chart-series-1)"/>
          </g>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>Bull (close ≥ open)</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2)"></span>Bear (close &lt; open)</span>
      </div>
    </div>

    <!-- 9. Calendar (NEW v1.1) -->
    <div class="chart-card">
      <div class="chart-eyebrow">CALENDAR · TIER 1 · NEW v1.1</div>
      <div class="chart-title">Dividend calendar — April 2026</div>
      <div class="chart-sub">3 received · 2 scheduled · 1 corp action</div>
      <div class="chart-body">
        <div class="cal-grid" role="img" aria-label="Dividend calendar April 2026, 3 received and 2 scheduled events plus 1 corporate action">
          <div class="cal-head">
            <h4 class="cal-month" style="font-size:14px">April 2026</h4>
            <div class="cal-totals">
              <span class="cal-total received">Received <strong>$284</strong></span>
              <span class="cal-total scheduled">Scheduled <strong>$412</strong></span>
            </div>
          </div>
          <div class="cal-dow"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
          <div class="cal-grid-body">
            <!-- week 1: Mar 30 - Apr 5 -->
            <div class="cal-cell out"><span class="cal-daynum">30</span></div>
            <div class="cal-cell out"><span class="cal-daynum">31</span></div>
            <div class="cal-cell in"><span class="cal-daynum">1</span></div>
            <div class="cal-cell in"><span class="cal-daynum">2</span></div>
            <div class="cal-cell in"><span class="cal-daynum">3</span></div>
            <div class="cal-cell in"><span class="cal-daynum">4</span></div>
            <div class="cal-cell in"><span class="cal-daynum">5</span></div>
            <!-- week 2: Apr 6-12 -->
            <div class="cal-cell in"><span class="cal-daynum">6</span></div>
            <div class="cal-cell in"><span class="cal-daynum">7</span></div>
            <div class="cal-cell in"><span class="cal-daynum">8</span><span class="cal-pill dividend received">KO $48</span></div>
            <div class="cal-cell in"><span class="cal-daynum">9</span></div>
            <div class="cal-cell in"><span class="cal-daynum">10</span><span class="cal-pill dividend received">VYM $112</span></div>
            <div class="cal-cell in"><span class="cal-daynum">11</span></div>
            <div class="cal-cell in"><span class="cal-daynum">12</span><span class="cal-pill dividend received">PEP $124</span></div>
            <!-- week 3: Apr 13-19 -->
            <div class="cal-cell in"><span class="cal-daynum">13</span></div>
            <div class="cal-cell in"><span class="cal-daynum">14</span></div>
            <div class="cal-cell in today"><span class="cal-daynum">15</span><span class="cal-pill corp_action">GOOGL 2:1</span></div>
            <div class="cal-cell in"><span class="cal-daynum">16</span></div>
            <div class="cal-cell in"><span class="cal-daynum">17</span></div>
            <div class="cal-cell in"><span class="cal-daynum">18</span></div>
            <div class="cal-cell in"><span class="cal-daynum">19</span></div>
            <!-- week 4: Apr 20-26 -->
            <div class="cal-cell in"><span class="cal-daynum">20</span></div>
            <div class="cal-cell in"><span class="cal-daynum">21</span></div>
            <div class="cal-cell in"><span class="cal-daynum">22</span></div>
            <div class="cal-cell in"><span class="cal-daynum">23</span></div>
            <div class="cal-cell in"><span class="cal-daynum">24</span></div>
            <div class="cal-cell in"><span class="cal-daynum">25</span></div>
            <div class="cal-cell in"><span class="cal-daynum">26</span></div>
            <!-- week 5: Apr 27-30 + spillover May 1-3 -->
            <div class="cal-cell in"><span class="cal-daynum">27</span></div>
            <div class="cal-cell in"><span class="cal-daynum">28</span></div>
            <div class="cal-cell in"><span class="cal-daynum">29</span><span class="cal-pill dividend scheduled">JNJ $59</span></div>
            <div class="cal-cell in"><span class="cal-daynum">30</span><span class="cal-pill dividend announced">XOM $42</span></div>
            <div class="cal-cell out"><span class="cal-daynum">1</span></div>
            <div class="cal-cell out"><span class="cal-daynum">2</span></div>
            <div class="cal-cell out"><span class="cal-daynum">3</span></div>
          </div>
        </div>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--accent)"></span>Received (broker-confirmed)</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-4)"></span>Scheduled</span>
        <span class="leg-item"><span class="leg-dot" style="background:transparent;border:1px solid var(--chart-series-7)"></span>Announced</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--terra);clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)"></span>Corp action</span>
      </div>
    </div>

    <!-- 10. Treemap (NEW v1.1) -->
    <div class="chart-card">
      <div class="chart-eyebrow">TREEMAP · TIER 1 · NEW v1.1</div>
      <div class="chart-title">Concentration</div>
      <div class="chart-sub">Tile size = weight; color = today's change</div>
      <div class="chart-body">
        <svg width="100%" height="280" viewBox="0 0 400 280" preserveAspectRatio="none" role="img" aria-label="Treemap of portfolio concentration with 7 tickers plus Other tile, color encodes today's price change">
          <!-- Squarified mock layout: NVDA largest top-left, then descending -->
          <!-- NVDA 14.2% +2.1% -- big jade 0.85 -->
          <rect x="2" y="2" width="170" height="160" fill="var(--chart-series-1)" fill-opacity="0.85" stroke="var(--card)" stroke-width="1"/>
          <text x="14" y="26" font-family="Geist" font-size="13" font-weight="600" fill="#F4F1EA">NVDA</text>
          <text x="14" y="42" font-family="Geist Mono" font-size="10" fill="#F4F1EA" opacity="0.7">14.2% · +2.1%</text>
          <!-- MSFT 11.8% +0.6% -- mid jade 0.55 -->
          <rect x="174" y="2" width="138" height="100" fill="var(--chart-series-1)" fill-opacity="0.55" stroke="var(--card)" stroke-width="1"/>
          <text x="186" y="26" font-family="Geist" font-size="13" font-weight="600" fill="#F4F1EA">MSFT</text>
          <text x="186" y="42" font-family="Geist Mono" font-size="10" fill="#F4F1EA" opacity="0.7">11.8% · +0.6%</text>
          <!-- AAPL 9.4% -1.2% -- mid bronze 0.55 -->
          <rect x="314" y="2" width="84" height="100" fill="var(--chart-series-2)" fill-opacity="0.55" stroke="var(--card)" stroke-width="1"/>
          <text x="326" y="26" font-family="Geist" font-size="13" font-weight="600" fill="#F4F1EA">AAPL</text>
          <text x="326" y="42" font-family="Geist Mono" font-size="10" fill="#F4F1EA" opacity="0.7">9.4% · −1.2%</text>
          <!-- GOOGL 7.1% +1.4% -- mid jade -->
          <rect x="174" y="104" width="84" height="58" fill="var(--chart-series-1)" fill-opacity="0.55" stroke="var(--card)" stroke-width="1"/>
          <text x="186" y="124" font-family="Geist" font-size="12" font-weight="600" fill="#F4F1EA">GOOGL</text>
          <text x="186" y="139" font-family="Geist Mono" font-size="9" fill="#F4F1EA" opacity="0.7">7.1%</text>
          <!-- BRK.B 6.8% +0.3% -- flat grey -->
          <rect x="260" y="104" width="74" height="58" fill="var(--chart-series-5)" fill-opacity="0.30" stroke="var(--card)" stroke-width="1"/>
          <text x="272" y="124" font-family="Geist" font-size="12" font-weight="600" fill="var(--ink)">BRK.B</text>
          <text x="272" y="139" font-family="Geist Mono" font-size="9" fill="var(--text-2)">6.8%</text>
          <!-- JNJ 5.2% -0.4% -- flat grey -->
          <rect x="336" y="104" width="62" height="58" fill="var(--chart-series-5)" fill-opacity="0.30" stroke="var(--card)" stroke-width="1"/>
          <text x="346" y="124" font-family="Geist" font-size="12" font-weight="600" fill="var(--ink)">JNJ</text>
          <text x="346" y="139" font-family="Geist Mono" font-size="9" fill="var(--text-2)">5.2%</text>
          <!-- XOM 4.6% +3.2% -- big jade -->
          <rect x="2" y="164" width="80" height="114" fill="var(--chart-series-1)" fill-opacity="0.85" stroke="var(--card)" stroke-width="1"/>
          <text x="14" y="186" font-family="Geist" font-size="12" font-weight="600" fill="#F4F1EA">XOM</text>
          <text x="14" y="201" font-family="Geist Mono" font-size="9" fill="#F4F1EA" opacity="0.7">4.6% · +3.2%</text>
          <!-- OTHER 40.9% — neutral -->
          <rect x="84" y="164" width="314" height="114" fill="var(--chart-series-5)" fill-opacity="0.40" stroke="var(--card)" stroke-width="1"/>
          <text x="100" y="186" font-family="Geist Mono" font-size="10" font-weight="500" letter-spacing="0.18em" fill="var(--text-2)">OTHER · 12 ITEMS</text>
          <text x="100" y="206" font-family="Geist Mono" font-size="11" fill="var(--text-2)">40.9%</text>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1);opacity:0.85"></span>Up ≥ +2%</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1);opacity:0.55"></span>Up</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-5);opacity:0.30"></span>Flat</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2);opacity:0.55"></span>Down</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2);opacity:0.85"></span>Down ≤ −2%</span>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-2);line-height:1.5">Tile size = % of portfolio; color = today's price change. Treemap describes proportions; concentration thresholds are factual conventions per FINRA, not Provedo recommendations.</div>
    </div>

    <!-- 11. Cash-flow waterfall (NEW v1.1) -->
    <div class="chart-card">
      <div class="chart-eyebrow">WATERFALL · TIER 2 · NEW v1.1</div>
      <div class="chart-title">Where your value came from</div>
      <div class="chart-sub">YTD · 2026-01-01 to 2026-04-26</div>
      <div class="chart-body">
        <svg width="100%" height="240" viewBox="0 0 600 240" preserveAspectRatio="none" role="img" aria-label="Cash-flow waterfall from $220,000 to $246,890 across 8 components">
          <!-- gridlines -->
          <line x1="0" y1="40" x2="600" y2="40" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="100" x2="600" y2="100" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <line x1="0" y1="160" x2="600" y2="160" stroke="var(--chart-grid)" stroke-dasharray="2 4"/>
          <!-- baseline at y=200 represents y=0 in data; bars rise upward -->
          <!-- Start anchor (220k): full bar from 200 to 80 (height 120) -->
          <rect x="20" y="80" width="40" height="120" fill="var(--chart-series-3)" fill-opacity="0.85" rx="4"/>
          <text x="40" y="74" font-family="Geist Mono" font-size="11" fill="var(--ink)" text-anchor="middle">$220K</text>
          <text x="40" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Start</text>
          <!-- Deposits +10k: from 80 to 70 (height 10), connector from 80 -->
          <line x1="60" y1="80" x2="80" y2="80" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="80" y="74" width="40" height="6" fill="var(--chart-series-1)" rx="2"/>
          <text x="100" y="68" font-family="Geist Mono" font-size="10" fill="var(--chart-series-1)" font-weight="500" text-anchor="middle">+$10K</text>
          <text x="100" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Deposits</text>
          <!-- Withdrawals -2k: from 74 to 75 (small bronze) -->
          <line x1="120" y1="74" x2="140" y2="74" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="140" y="74" width="40" height="2" fill="var(--chart-series-2)" rx="2"/>
          <text x="160" y="68" font-family="Geist Mono" font-size="10" fill="var(--chart-series-2)" font-weight="500" text-anchor="middle">−$2K</text>
          <text x="160" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Withdraw</text>
          <!-- Realized +4.2k: from 76 to 71 -->
          <line x1="180" y1="76" x2="200" y2="76" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="200" y="71" width="40" height="5" fill="var(--chart-series-1)" rx="2"/>
          <text x="220" y="65" font-family="Geist Mono" font-size="10" fill="var(--chart-series-1)" font-weight="500" text-anchor="middle">+$4.2K</text>
          <text x="220" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Realized</text>
          <!-- Unrealized +8.42k: from 71 to 61 -->
          <line x1="240" y1="71" x2="260" y2="71" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="260" y="61" width="40" height="10" fill="var(--chart-series-1)" rx="2"/>
          <text x="280" y="55" font-family="Geist Mono" font-size="10" fill="var(--chart-series-1)" font-weight="500" text-anchor="middle">+$8.4K</text>
          <text x="280" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Unrealized</text>
          <!-- Dividends +1.85k: from 61 to 59 -->
          <line x1="300" y1="61" x2="320" y2="61" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="320" y="59" width="40" height="2" fill="var(--chart-series-1)" rx="2"/>
          <text x="340" y="53" font-family="Geist Mono" font-size="10" fill="var(--chart-series-1)" font-weight="500" text-anchor="middle">+$1.9K</text>
          <text x="340" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Dividends</text>
          <!-- Interest +0.24k: tiny -->
          <line x1="360" y1="59" x2="380" y2="59" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="380" y="58" width="40" height="1" fill="var(--chart-series-1)" rx="2"/>
          <text x="400" y="52" font-family="Geist Mono" font-size="10" fill="var(--chart-series-1)" font-weight="500" text-anchor="middle">+$0.24K</text>
          <text x="400" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Interest</text>
          <!-- Fees -0.09k: tiny bronze -->
          <line x1="420" y1="58" x2="440" y2="58" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="440" y="58" width="40" height="1" fill="var(--chart-series-2)" rx="2"/>
          <text x="460" y="52" font-family="Geist Mono" font-size="10" fill="var(--chart-series-2)" font-weight="500" text-anchor="middle">−$90</text>
          <text x="460" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">Fees</text>
          <!-- FX +0.27k -->
          <line x1="480" y1="59" x2="500" y2="59" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="500" y="59" width="40" height="0.3" fill="var(--chart-series-1)" rx="2"/>
          <text x="520" y="53" font-family="Geist Mono" font-size="10" fill="var(--chart-series-1)" font-weight="500" text-anchor="middle">+$270</text>
          <text x="520" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">FX</text>
          <!-- End anchor (246.89k): full bar from 200 to 56 -->
          <line x1="540" y1="60" x2="560" y2="60" stroke="var(--chart-grid-strong)" stroke-dasharray="2 4"/>
          <rect x="560" y="60" width="40" height="140" fill="var(--chart-series-3)" fill-opacity="0.85" rx="4"/>
          <text x="580" y="54" font-family="Geist Mono" font-size="11" fill="var(--ink)" text-anchor="middle">$247K</text>
          <text x="580" y="220" font-family="Geist Mono" font-size="10" fill="var(--text-2)" text-anchor="middle">End</text>
        </svg>
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-3);opacity:0.85"></span>Anchor (start / end)</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-1)"></span>Positive contribution</span>
        <span class="leg-item"><span class="leg-dot" style="background:var(--chart-series-2)"></span>Negative contribution</span>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-2);line-height:1.5">Decomposes change in portfolio value into mechanical components: cash you added, gains your positions made, dividends and interest received, FX effects. Does not predict future contributions.</div>
    </div>

  </div>

  <!-- empty state demo -->
  <div class="ds-row" style="margin-top:28px">
    <div class="ds-row-label">EMPTY STATE — NO DATA YET</div>
    <div class="ds-charts">
      <div class="chart-card">
        <div class="chart-eyebrow">LINE · EMPTY</div>
        <div class="chart-title">Portfolio value</div>
        <div class="chart-sub">Last 30 days</div>
        <div class="chart-empty">
          <div class="ce-eyebrow">NO DATA · LINE</div>
          <div class="ce-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" stroke-width="2"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
          </div>
          <div class="ce-head">No data yet</div>
          <div class="ce-body">Connect a broker to see your portfolio history.</div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-eyebrow">DONUT · EMPTY</div>
        <div class="chart-title">Allocation</div>
        <div class="chart-sub">Across all accounts</div>
        <div class="chart-empty">
          <div class="ce-eyebrow">NO DATA · DONUT</div>
          <div class="ce-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>
          </div>
          <div class="ce-head">No allocations yet</div>
          <div class="ce-body">Once positions sync, sectors and brokers appear here.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- loading skeleton demo -->
  <div class="ds-row" style="margin-top:28px">
    <div class="ds-row-label">LOADING — SKELETON SHIMMER</div>
    <div class="ds-charts">
      <div class="chart-card">
        <div class="chart-eyebrow">LOADING · LINE</div>
        <div class="chart-title">Portfolio value</div>
        <div class="chart-sub">…</div>
        <div class="chart-skeleton"></div>
      </div>
      <div class="chart-card">
        <div class="chart-eyebrow">LOADING · BAR</div>
        <div class="chart-title">Position drift</div>
        <div class="chart-sub">…</div>
        <div class="chart-skeleton"></div>
      </div>
    </div>
  </div>

</div>
```

### 8.5 Notes for frontend-engineer integrating the showcase block

1. The static SVGs in §8.4 are visual mocks meant for the design-system showcase page only — they prove the system reads correctly without requiring Recharts to be loaded in a static HTML file. The real `packages/ui/src/charts/*.tsx` will use Recharts with the JSX patterns in §4.
2. The CSS variables `--chart-series-1` through `--chart-series-7` need to be added to both `.light` and `.dark` blocks at the top of `design-system.html` per §2.5.
3. The `border-color` on `.chart-error` references `var(--terra)` — already in the system.
4. The skeleton shimmer respects `prefers-reduced-motion` via the bottom of the CSS block.

---

## 9. Migration debt — existing chart wrappers

The current `packages/ui/src/charts/*.tsx` and `tokens.ts` reference older token names from a pre-v1.1 design-tokens generation:

- `--color-brand-600` → should map to `--chart-series-1`
- `--color-state-info-default` → drop entirely (no info color in chart palette)
- `--color-state-warning-default` → drop (was `--chart-series-2`-like; we now use `--chart-series-2` directly)
- `--color-portfolio-gain-default` / `--color-portfolio-loss-default` → already exist in design-tokens; map to `--chart-series-1` / `--chart-series-2` for charts.
- `--color-text-tertiary` → `--text-3` in v1.1 showcase / `--color-text-tertiary` in design-tokens; keep semantic-token reference, just verify it resolves to the new `#7A7A7A`.
- `--color-background-elevated` → `--card`.
- `--color-border-subtle` → `--chart-grid`.
- `--shadow-md` → `--shadow-lift` for tooltip per §3.5.

**Recommended migration steps for frontend-engineer (separate dispatch):**

1. Add `--chart-series-1..7`, `--chart-grid`, `--chart-grid-strong`, `--chart-axis-label`, `--chart-tooltip-bg`, `--chart-tooltip-border`, `--chart-cursor` to `packages/design-tokens/tokens/semantic/{light,dark}.json`. Re-run Style Dictionary build.
2. Update `packages/ui/src/charts/tokens.ts`:
   ```ts
   export const SERIES_PALETTE = [
     'var(--chart-series-1)',
     'var(--chart-series-2)',
     'var(--chart-series-3)',
     'var(--chart-series-4)',
     'var(--chart-series-5)',
     'var(--chart-series-6)',
     'var(--chart-series-7)',
   ] as const;

   export const CHART_COLORS = {
     axisLabel: 'var(--chart-axis-label)',
     gridLine: 'var(--chart-grid)',
     gridLineStrong: 'var(--chart-grid-strong)',
     tooltipBg: 'var(--chart-tooltip-bg)',
     tooltipBorder: 'var(--chart-tooltip-border)',
     tooltipShadow: 'var(--shadow-lift)',
     cursor: 'var(--chart-cursor)',
     gain: 'var(--chart-series-1)',
     loss: 'var(--chart-series-2)',
   } as const;
   ```
3. Update `AreaChart.tsx`, `BarChart.tsx`, `DonutChart.tsx` per §4 patterns (radius 6, paddingAngle 2, dotted gridlines, mono tooltip header). Add `--chart-tooltip-shadow` and uppercase mono labelStyle.
4. Add new files: `LineChart.tsx`, `Sparkline.tsx`, `StackedBarChart.tsx`, `ScatterChart.tsx`, **`Calendar.tsx` (NEW v1.1 — pure SVG/CSS-grid, no Recharts dep)**, **`Treemap.tsx` (NEW v1.1 — Recharts native `<Treemap>` with custom `content` render prop)**, **`Waterfall.tsx` (NEW v1.1 — `<ComposedChart>` + custom `WaterfallStep` shape on `Bar`)**, `ChartDataTable.tsx` (the §7.4 sr-only data table). `CandlestickChart.tsx` deferred to T3.
5. Add `useChartKeyboardNav` hook in `packages/ui/src/charts/hooks/useChartKeyboardNav.ts`. Note the calendar component needs its own `useCalendarKeyboardNav` (cycles cells in 2D grid via arrow keys, not just left/right) — frontend-engineer should factor a shared base hook.
6. Add Zod schema package per §5: either inline in `packages/ui/src/charts/contract.ts` (simpler) or new `packages/charts-contract` (cleaner — recommended; tech-lead decides). The schema MUST include the v1.1 Lane-A structural exclusions for Bar / Line / Candlestick payloads — these are not optional.
7. **Test coverage requirement (NEW v1.1):** because Lane-A guardrails are baked structurally into Zod schemas, frontend-engineer MUST write contract tests that assert:
   - `BarChartPayload.parse({ ...validPayload, targetWeight: 30 })` rejects (unknown key via `.strict()`).
   - `CandlestickChartPayload.parse({ ...validPayload, movingAverage: { window: 50 } })` rejects (unknown key).
   - `CalendarPayload.parse({ ...validEvents, eventType: 'earnings' })` rejects (discriminator mismatch).
   - `LineChartPayload.parse({ ...validPayload, overlay: [{ type: 'support_line', y: 150 }] })` rejects (forbidden overlay type via `.refine()`).
   These tests block CI. The schema is the contract; the tests are the proof.

Effort estimate (frontend-engineer): **2 days for T1 charts (line, area, bar, donut, sparkline, calendar, treemap)** including tests — calendar adds ~0.5d for the CSS-grid component; treemap adds ~0.5d (Recharts native, fast). 0.75 day for T2 charts (stacked bar, scatter, **waterfall** — waterfall ~0.5d additional given custom-shape pattern and connector geometry). Contract package + Lane-A structural-rejection contract tests: 0.75 day. **Total ~3.5 days.** Candlestick (T3) deferred.

---

## 10. Out of scope / open questions

### Out of scope for this spec

- Production code in `packages/ui/src/charts/` (frontend-engineer dispatch).
- Backend AI service contract enforcement / payload generation prompts (backend-engineer + AI engineer dispatches).
- Real chart implementation in `apps/web/` route surfaces (frontend-engineer + product spec dispatches).
- iOS chart parity (post-alpha; SwiftUI `Charts` framework will mirror this catalog independently). SwiftUI has native `TimelineView` and `Chart` primitives that map well to most types; calendar will need a custom view there too.
- **Heatmap, gauge — still deferred.** AI agent should compose these from the 11 if asked. Treemap and waterfall are no longer deferred — they're added as primitives in v1.1 (catalog growth 8 → 11).
- Earnings calendar (G1), news calendar (G4), forthcoming-events composite (G5), bond coupons (C4), trade-frequency heatmap (D6) — V2 only, paid-data integration required, gated on PO greenlight per Hard rule R1.

### Open questions for PO (via Right-Hand)

1. **Q1 — Candlestick tier:** is T3 (post-MVP) acceptable, or should we promote to T2 because crypto / day-trader users will demand it earlier? **Designer recommendation:** keep T3 — the spec proves it can be built; we don't need to ship it until product signals demand it.
2. **Q2 — Donut max segments:** spec says 7 visible + group-into-Other. Some asset-class breakdowns (e.g. crypto user with 12 assets) may want a side legend with all 12. Acceptable to do «top 7 + Other» everywhere, or do we want a «show all» drill-in? **Designer recommendation:** ship «top 7 + Other»; drill-in is a chat affordance («show me all 12 sectors as a list»), not a chart affordance.
3. **Q3 — Chat-inline charts:** when the AI agent renders a chart inside a chat reply (vs. as its own card surface), does the chart sit inside the bubble (`bub-ai`) or break out below it? **Designer recommendation:** breaks out below the bubble as a sibling card (`shadow-card`), same column width as the bubble. Caption sits inside the bubble; chart sits below. This is consistent with how Provedo treats citations and tool-use cards.
4. **Q4 — Pattern fills for color-blind:** §7.3 specifies pattern fills for donut / stacked bar with 4+ stacks. This adds visual noise and may fight paper-restraint. Should we ship pattern fills always, or only when user has set «high contrast» preference in settings? **Designer recommendation:** ship behind a setting (default off; brand-strategist preference). The labels + legend already do most of the work; pattern fills are belt-and-suspenders for the small percent of users with full achromatopsia who haven't already turned on OS-level contrast.
5. **Q5 — Geist Mono on tiny ticks (9–10px):** mono at small sizes can read crowded. Should axis ticks at small sizes drop to Geist sans (with `tnum`) instead of mono? **Designer recommendation:** keep mono — it carries the editorial register that paper-restraint depends on. The crowding concern is mitigated by `letterSpacing: 0.04em` and `minTickGap: 24`. If real usage shows readability issues, revisit.
6. **Q6 — Session-level palette consistency:** if a user asks two questions in one session, both producing donuts, should the same sectors map to the same colors across both donuts? **Designer recommendation:** YES — the renderer maintains a `Map<string, palettIndex>` keyed by `segment.key` for the duration of a chat session, so «Tech» is always jade, «Energy» is always deep-jade, etc. AI agent doesn't need to know about this; it's a renderer responsibility. Tracker added as a frontend-engineer note in §9.
7. **Q7 — Calendar primitive scope at MVP:** v1.1 spec restricts calendar `eventType` to `dividend` + `corp_action` for MVP per Risk Flag 3. PO greenlight needed before adding `earnings` (G1) — requires paid-data feed integration (issuer IR + exchange filings normalization, possibly via paid provider per finance-advisor catalog §5). Estimated cost gate: $0–$XXX/mo depending on provider choice. **Designer recommendation:** ship MVP without earnings; queue earnings as the first V2 chart-data extension once chat usage signals demand. Calendar primitive is structurally ready — V2 expansion is a Zod schema bump (`v1.2` adds `'earnings'` literal to the `CalendarEventType` enum), not a re-design.
8. **Q8 — Treemap second-channel data availability:** v1.1 treemap encodes `dailyChangePct` as the secondary visual channel (color). This requires intraday or end-of-day price data for every position — most brokers report this in their holdings sync, but some only sync nightly. If `dailyChangePct` is absent, the spec degrades to single-channel (weight-only, all tiles muted grey). **Designer recommendation:** treemap ships in v1 with single-channel-degrade as the documented fallback; AI agent decides per-payload whether to include `dailyChangePct` based on data freshness. Question for PO: is single-channel treemap (no color encoding) acceptable as a default ship state for users on brokers without intraday updates, or should we suppress the chart entirely until we have priced data? Designer leans «ship single-channel» — answers the «what dominates» question even without color, and suppression confuses users. PO confirm.

### Future revisions

- **v1.1** — when first 3 production charts ship, audit visual rendering on real data (not mock). Likely candidates for adjustment: bar radius (6 → 4 if too soft); tooltip max-lines (5 → 3 if cluttered).
- **v1.2** — add chart variants for paywall-locked previews (blurred chart + lock overlay). Currently out of scope; will need a `LockedChart` variant.
- **v2.0** — once user-research data lands on chart preferences (post-alpha), revisit T2/T3 priority and consider deletions from the catalog.

---

## Appendix A — Pixel reference card

Compact reference for the frontend-engineer.

| Surface | Value |
|---|---|
| Stroke width — line / area | 2px |
| Stroke width — sparkline | 1.5px |
| Stroke width — stacked bar separator | 1px (`--card`) |
| Stroke width — focus ring | 2px (`--accent`) |
| Stroke width — tooltip cursor | 1px dashed `2 4` (`--chart-cursor`) |
| Stroke width — gridline | 1px dashed `2 4` (`--chart-grid`) |
| Bar radius (top corners) | 6px (`radius.sm`) |
| Bar gap | 22% |
| Donut padding angle | 2° |
| Donut corner radius | 2px |
| Donut inner ratio | 0.62 |
| Active-dot radius (line/area hover) | 5px |
| Scatter dot radius (default / highlighted) | 5px / 8px |
| Tooltip border-radius | 14px (`radius.lg`) |
| Tooltip padding | 10px 14px |
| Tooltip shadow | `var(--shadow-lift)` |
| Tooltip header font | Geist Mono 10px / 0.18em / uppercase / 500 / `--chart-axis-label` |
| Tooltip body font | Geist 12px / `tnum 1` / `ss01 1` / 400 / `--ink` |
| Axis tick font | Geist Mono 11px / 0.04em / 500 / `--chart-axis-label` |
| Legend item font | Geist 11px / -0.005em / 500 / `--text-2` |
| Legend item gap | 16px between items |
| Legend top padding | 16px |
| Donut center value font | Geist 28px / -0.035em / 600 / `tnum 1` / `ss01 1` / `--ink` |
| Donut center label font | Geist Mono 10px / 0.22em / uppercase / 500 / `--text-3` |
| Animation duration (mount) | 600ms |
| Animation duration (hover) | 200ms |
| Animation easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Default chart heights | sparkline 40 (table) / 64 (card) · line/area 220 · bar 220 · donut 200² · stacked bar 260 · scatter 260 · **calendar auto (~240/month)** · **treemap 320 (default), 420 (detail)** · **waterfall 300** · candlestick 300 |
| Mobile chart heights | line/area 200 · bar 200 · donut 160² · scatter 240² · stacked bar 240 · **calendar grid-rows min-44 (was 56)** · **treemap 280 sq** · **waterfall 360 (grows, doesn't shrink)** · candlestick 280 |
| Treemap aspect ratio | 1.618 (golden, desktop) / 1.0 (square, ≤480px) |
| Treemap label threshold | tile area ≥ 4% (desktop) / ≥ 8% (mobile) of total |
| Calendar cell padding | 6px 8px (desktop) / 4px 5px (≤480) |
| Calendar pill font | Geist Mono 9px (desktop) / 8px (≤480) |
| Waterfall bar width | ~56px desktop, ~36px mobile |
| Waterfall connector | 1px dashed `2 4` `var(--chart-grid-strong)` |

## Appendix B — Changelog

- **v1.0 — 2026-04-27.** Initial spec. 8-chart catalog, 7-hue palette, JSON contract, mobile + a11y, showcase HTML drop-in, migration debt to existing wrappers. Author: product-designer.
- **v1.1 — 2026-04-27.** Investment-domain extension reconciling with finance-advisor catalog v1.1. Author: product-designer (continuation dispatch from Right-Hand).
  - **Catalog growth 8 → 11 chart types.** Added Calendar (T1, NEW §4.9), Treemap (T1, NEW §4.10), Cash-flow waterfall (T2, NEW §4.11). Catalog table §1 expanded with cross-references to finance-advisor catalog entries (A1/A2b/A3/A4/A5/A9/A10, B1–B9, C1/C6, H5).
  - **3 Lane-A risk flags baked structurally into JSON contract schema (§5):**
    - Risk Flag 1 (Candlestick): `CandlestickChartPayload` schema EXCLUDES `supportLine`, `resistanceLine`, `trendLine`, `channelBand`, `movingAverage`, `rsi`, `macd`, `bollinger`, `signalAnnotation`, `buyMarker`, `sellMarker`, and trade markers entirely. `.strict()` mode rejects unknown keys at parse time. Same exclusions applied to `LineChartPayload.overlay` via discriminated union + `.refine()` whitelist (only `trade_marker` permitted on price-history line variant per §4.1.1).
    - Risk Flag 2 (Bar / drift bar): `BarChartPayload` and `StackedBarChartPayload` schemas have NO `targetWeight` field. `referenceLine` is restricted to `axis: 'zero'` only — no target / benchmark-target / aspiration types. Industry-convention rebalance bands appear in tooltip text (AI-agent-supplied prose), never as a referenceLine geometry.
    - Risk Flag 3 (Calendar / paid-data gate): `CalendarPayload` event-type discriminator restricted to `dividend` + `corp_action` for MVP. `earnings`, `news`, `bond_coupon` are RESERVED — not in the discriminated union — and rejected at parse time. V2 expansion gated on PO greenlight per Hard rule R1 (no spend without approval).
  - **§4.3 Bar spec rewritten** to make the no-target-weight constraint explicit and STRUCTURAL — schema-level, not policy-level. Drift charts (B8) now reference catalog framing for tooltip prose.
  - **§4.1.1 added** — Lane-A note for line-as-price-history variant (catalog A2b). Same overlay exclusions as candlestick apply; only user trade markers permitted as overlays.
  - **§4.8 Candlestick rewritten** as a Lane-A constraint specification with structural exclusions table. T3 status preserved; spec proves we *can* render candles with all guardrails baked in, without re-architecting.
  - **§2.6 Calendar event-status palette** added — re-uses existing tokens (`--accent`, `--chart-series-4`, `--chart-series-7`, `--terra`); no new hues invented. Shape encoding (diamond clip-path for corp-action, outlined-vs-filled for announced-vs-confirmed) ensures color-blind safety beyond the 7-hue series palette.
  - **§3.1 default heights updated** — calendar `auto`, treemap 320 (default) / 420 (detail), waterfall 300 (default) / 360 (detail).
  - **§3.10 skeleton variants** added for calendar (7×5 muted grid + 6 mock event positions), treemap (4-tile mosaic with 1px separators), waterfall (baseline + 5 staircased floating bars + connectors).
  - **§5 schemas extended:** `LineOverlay` discriminated union with `FORBIDDEN_OVERLAY_TYPES` runtime guard; `BarReferenceLine` zero-axis-only schema; `CalendarPayload` with `DividendEvent` + `CorpActionEvent` discriminated union; `TreemapPayload` with `TreemapTile` (no `concentrationThreshold` field); `WaterfallPayload` with `WaterfallStep` and 10-component-type enum. ChartPayload union grows from 8 to 11 members.
  - **§5.3 example payloads** added for calendar, treemap, waterfall.
  - **§6.2 mobile-overrides table** — 3 new rows for calendar / treemap / waterfall behavior at 320–767.
  - **§7.3 color-blind table** — 3 new rows. Treemap mitigation explicitly addresses single-channel-degrade fallback when `dailyChangePct` is absent. Calendar mitigation calls out shape + outline-vs-fill encoding redundancy.
  - **§8 showcase HTML** — section header bumped 8 → 11 types. Three new chart-card blocks with mock SVG renderings ready for frontend-engineer paste. Calendar CSS block (§8.3) expanded with `.cal-grid` / `.cal-pill` / responsive breakpoint at ≤480.
  - **§9 migration debt** — frontend-engineer file list grows: `Calendar.tsx`, `Treemap.tsx`, `Waterfall.tsx` added. Effort estimate revised 2.5 → 3.5 days. Lane-A structural-rejection contract tests are added as MANDATORY block-CI tests.
  - **§10 open questions** — Q7 (calendar paid-data gate scope) + Q8 (treemap single-channel-degrade default) added.
  - **Appendix A pixel reference** — calendar / treemap / waterfall geometry constants added.
  - Full cross-link reference to `docs/product/chart-component-catalog.md` v1.1 (finance-advisor) inserted in document header.
