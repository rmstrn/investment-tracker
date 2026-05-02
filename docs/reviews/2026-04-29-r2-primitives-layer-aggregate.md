# Custom SVG Chart Primitives Layer — Aggregate Synthesis 2026-04-29

**Trigger:** PO «я готов [к 1.5-2 weeks investment в charts visual quality], нужно было с этого и начинать, запустите всех кого нужно, подумайте хорошо, и только после этого имплементируйте.»
**5-voice parallel brainstorm:** project architect / plugin architect / frontend-engineer / product-designer / a11y-architect (plugin).
**Convergence:** unanimous on direction. 0 dissent.
**Aggregator:** Right-Hand.

## Convergent diagnosis

**Recharts is a localized ceiling, not a sin.** Recharts pays its way on layout/axis/animation/tooltip-portal infrastructure. The visual ceiling lives at primitives — multi-axis shadows, custom radial gradients, hand-tuned coordinates, pixel-precise neumorphism. Iterative theming hits cap at ~50-60% static-reference fidelity.

**Build a thin custom layer that owns visuals, rents math.** Every voice converged on this shape:

```
Layer 3 — Chart-kind wrappers (consumer API unchanged)
            <LineChart payload={...} />  <DonutChart payload={...} />
            ─────────────────────────────────────────────────────
Layer 2 — Composable React SVG primitives + a11y baked
            <ChartFrame> <GridLines> <AxisTicksHTML> <LinePath>
            <AreaPath> <Bar> <DonutSegment> <Tile> <Tooltip>
            <CitationGlyph> <DataLabel> <ChartDataTable>
            ─────────────────────────────────────────────────────
Layer 1 — Pure scale + path math (hexagonal port)
            scaleLinear · scaleTime · scaleBand · linePath
            arcPath · squarify (via d3-hierarchy)
```

## Architectural decisions (unanimous unless noted)

| # | Decision | Recommendation | Rationale |
|---|---|---|---|
| 1 | Scale system | **Hybrid:** d3-scale + d3-shape (~10kb gz, MIT) wrapped behind own `Scale` port (hexagonal) | Don't reinvent `nice()` / `ticks()` / `invert()` — D3 nailed it 15y ago. Wrapper exposes Provedo defaults. |
| 2 | Shape primitives | **Hybrid declarative + imperative escape hatch.** `<Bar>` / `<DonutSegment>` / `<LinePath>` declarative. `useLineGenerator` / `useArcGenerator` for novel composition. | Static reference IS JSX-shaped (HTML). Going imperative inverts readability win. |
| 3 | Animation | **CSS for state-change + `useStrokeDashoffset` hook for line draw-in + `useAnimatedNumber` for KPI count-up. NO framer-motion.** | Reduced-motion gated at hook level (~100 LOC total). No path-morphing default (Recharts «library tried hard» tell). |
| 4 | Layout | **SVG canvas + HTML overlay** for axis labels / legend / tooltip | Pure SVG `<text>` has bad font hinting + a11y. Static gets away with it as static; product needs HTML overlay for `font-feature-settings: 'tnum' 1`. |
| 5 | Theme | **CSS-vars в SVG attrs primary** + `useChartTokens()` hook as read-accessor for JS computations | Theme switch becomes free (browser-resolved). Eliminates `MutationObserver` in `LineChart.tsx:60-71`. |
| 6 | Tooltip | **Portal per-chart instance** (mounted on focus/hover, unmounted on blur) | Escape `overflow:hidden` parent / `border-radius` clip. Per-instance avoids ECharts flicker when tooltip moves between charts. |
| 7 | A11y baseline | **`<ChartFrame>` REQUIRED composition** consolidating role=img + aria-label + focus-ring + tabIndex + keyboard-nav + ChartDataTable + aria-live | Closes pre-QA CRIT-1 / CRIT-2 / MED-5 STRUCTURALLY (no per-chart wiring). |
| 8 | Series differentiation | **`seriesEncoding` enum** (`single | color-only-allowed | color-plus-shape | color-plus-pattern`) controlling stroke-dasharray + marker-shape + pattern-fill | Single-series shouldn't be forced into patterns. Multi-series passes WCAG 1.4.1 by default. |
| 9 | Elevation hierarchy | **3-tier MAX:** resting (`--shadow-soft`) / card (`--shadow-card`) / lift (`--shadow-lift`). **Data plane FLAT** — Bar/Line/Area/Sector/Tile/labels/glyph have NO nested shadows. Hierarchy через rims + typography. | THE Provedo neumorphism insight. Surface tactile, contents flat. Editorial discipline. |
| 10 | SSR | `'use client'` primitives. Server-render conservative + client-measure-then-reflow (same model Recharts use today) | Avoids hydration mismatch on `getBBox()` calculations. |

## 7 patterns extracted from static reference (plugin architect)

Recharts replacement does NOT mean reinvention from zero. Static reference (`apps/web/public/design-system.html` lines 1183-1560) shows exact patterns to port:

| # | Pattern | Why it matters |
|---|---|---|
| 1 | `<defs><linearGradient>` per chart with `useId()` | Avoid ID collisions on multi-chart pages. |
| 2 | **Donut = 5×`<circle stroke-dasharray>` ring** (NOT D3-arc) | Eliminates entire arc-generator dependency. SINGLE highest-leverage pattern. |
| 3 | GridLines = `<line stroke-dasharray="2 4">` siblings | Token-driven, brand convention, recurs 144× in static. |
| 4 | Waterfall connectors = discrete 20px dashed line segments | NOT continuous step path — quieter, suggests connection without drawing. |
| 5 | Candlestick = paired `<line>` wick (`var(--ink)`) + `<rect>` body (series color) | Wick = structural, body = semantic. Lane-A safe. |
| 6 | Treemap = flat `<rect>` siblings, pre-computed via squarify | NOT nested SVG. Easier to animate / focus-trap / reason about. |
| 7 | Sparkline = intentionally aliased (60×20 viewBox stretched) | Stretch IS the aesthetic. Don't vector-correct. |

## 12 anti-patterns explicitly rejected (plugin architect)

1. Adopt Visx/Nivo wholesale → same library ceiling
2. D3 selections → DOM ownership war with React
3. `Plot.line(...).plot()` one-liner → hides geometry we need to hand-tune
4. ECharts config-object DSL → JSX-as-DSL beats config-as-DSL для React
5. framer-motion для chart animations → 50kb gz для 5% feature use
6. Animating `<path d>` interpolation default → Recharts «library tried hard» tell
7. Single global tooltip portal node → flicker between charts
8. Duplicating CSS-var values into React context → CSS var IS source of truth
9. Reading `prefersReducedMotion` inside primitives → hook level only
10. Imperative generators leaking DOM ownership → generators return strings, React owns `<path>`
11. Hard-coded gradient `id` attrs → `useId()` per chart instance
12. Pure SVG `<text>` для axis labels → bad font hinting + a11y

## Visual primitives (product-designer specs)

### Top-3 Provedo-distinctive

- **`<Tooltip>`** — `--card` 90% alpha + `backdrop-filter: blur(10px)` + `--shadow-lift` + cream top-edge highlight + Geist Mono eyebrow row + Geist body. Visually child of SignatureCard.
- **`<Tile>`** — 1px cream-rim + magnitude→fill-opacity (0.85/0.55/0.30) + Geist label inline + Geist Mono micro-numerals. **Treemap + Calendar + future-waffle in one primitive.**
- **`<Bar>`** — top-rounded radius 10 + vertical fill gradient 100%→80% + 1px cream rim top-only. «Pressed paper» БЕЗ SVG drop-shadow filter (perf-safe).

### Most custom invention

**`<CitationGlyph>` / `<ProvedoMark>`** — 4-point Lucide sparkle in `--accent`. No chart library has this. Carries Magician+Sage «Provedo found this» moment. **Promote to `@provedo/icons`** since chat already uses it.

### Animation per primitive

- Line: `stroke-dashoffset` draw-in (300ms ease-out-expo)
- Bar: `transform: scaleY(0)→1` (200ms ease-out)
- Donut sector: stroke-dashoffset on circular arc
- Area: `clip-path` expansion
- Tile: `opacity 0→1` (no transform)
- Number annotation: `useAnimatedNumber` count-up tween (Magician quiet revelation moment)

## A11y patterns BAKED in primitives (a11y-architect)

| # | Pattern | What it does |
|---|---|---|
| 1 | `<ChartFrame>` consolidation | role=img + aria-label + focus-ring + tabIndex + keyboard-nav + `<ChartDataTable>` |
| 2 | seriesEncoding lookup tables | stroke-dasharray + marker-shape + pattern-fill keyed by series index |
| 3 | Auto-generated `<ChartDataTable>` | from payload with native `<caption>` + formatter pipeline |
| 4 | `useReducedMotion` + `chartAxisLabelToken` as theme primitives | Single source of truth |
| 5 | `aria-live="polite"` summary region | Inside `<ChartFrame>` for payload-update announcements (WCAG 4.1.3) |

**Escape hatches:**
- `<ChartFrame ariaLabel={override}>` — AT context override
- `<ChartFrame keyboardNav={false | 'custom'}>` — Sparkline non-focusable + Calendar 2D traversal
- `seriesEncoding` enum — single-series shouldn't be forced into patterns

**Direction LAYERED + Vitest matcher + eslint plugin:**
- `:where(a, button, [role="switch|checkbox|radio"], [tabindex])` already shipped в showcase fix
- `expect(chart).toBeAccessibleChart()` Vitest matcher for merge-gate
- `eslint chart-must-use-chart-frame` — static rule

## Implementation feasibility (FE-engineer)

### Top-3 hardest problems we own post-replace

1. **Tooltip viewport-edge clamping + portal-out-of-overflow-parent** — ~150 LOC primitive. Recharts solves; we own.
2. **Nice-tick + responsive label-collision + width-aware formatter dispatch** (compact «$1.2k» vs full «$1,200,000») — highest test surface.
3. **ResponsiveContainer measurement loop с rAF throttle** + first-paint placeholder против CLS — ~60 LOC.

### Per-chart difficulty

- **Hardest:** Treemap (use `d3-hierarchy.treemap()` ~3kb gz — don't reinvent squarified)
- **Surprisingly EASIER post-replace:** Waterfall (current Recharts hack долго; native primitives = half the code)
- **Shared cost:** Line/Area/Bar share `<ChartFrame>` build cost — once first ships, остальные cheap
- **No-ops:** Sparkline + Calendar (already mostly custom)

### Test stability

Vitest snapshots target `<ChartDataTable>` HTML only → **zero snapshot churn** from SVG rewrite.

## Bundle budget

| Layer | Target |
|---|---|
| Layer 1 (math) | ~13kb gz (d3-scale + d3-shape + d3-time + d3-hierarchy.treemap on-demand) |
| Layer 2 (primitives) | ≤14kb gz |
| Layer 3 (chart wrappers) | ≤7kb gz |
| **Total** | **≤30kb gz** |
| Recharts removed | -80kb gz |
| **Net delta** | **-50kb gz minimum** |

## Migration sequencing (FE-engineer feature flag)

```
Phase α — Foundation (additive, zero downstream impact)
  - Layer 1 ports: Scale (linear/time/band) + d3-shape wrappers
  - Layer 2 minimum: <ChartFrame>, <GridLines>, <AxisTicksHTML>, <LinePath>, <AreaGradientDef>, <Tooltip portal>, <ChartDataTable> auto-gen, useChartKeyboardNav re-export
  - <CitationGlyph> in @provedo/icons
  - Vitest <toBeAccessibleChart> matcher
  - Storybook coverage ≥95%
  - Feature flag: NEXT_PUBLIC_PROVEDO_CHART_BACKEND=recharts|primitives, default `recharts`
  → No public API change. Recharts still default.

Phase β — Canary chart pair (validate pattern with smallest surface)
  - Sparkline migrated (no-op-easy)
  - Donut migrated (proves <DonutSegment> ring-of-circles pattern)
  - Both behind feature flag
  → Compare visually to static reference; iterate.

Phase γ — Axes-bearing charts (one PR per chart)
  - LineChart (validate <ChartFrame> + tooltip portal + ResponsiveContainer)
  - AreaChart
  - BarChart + StackedBar
  - Waterfall (becomes simpler!)
  - Treemap (d3-hierarchy.treemap)
  - Each lands behind flag; visual regression vs static + Recharts baseline.

Phase δ — Cutover
  - Flip feature flag default → primitives
  - 2-week soak on staging
  - Remove Recharts from packages/ui/package.json
  - CI bundle-size check confirms ≥50kb gz reduction
  - Drop charts.guardrails.test that targets Recharts class names

Phase ε — Calendar (out of primitives scope)
  - Already pure CSS-grid HTML — no SVG primitives needed; leave alone.

Phase ζ — Candlestick (Tier 3, gated)
  - Build behind same primitives layer when T3 PO greenlight + legal sign-off lands
  - Pattern 5 (paired <line> wick + <rect> body) ports cleanly
```

## Open questions for PO

1. **`d3-scale + d3-shape + d3-hierarchy` runtime deps (~13kb gz, MIT)** — confirm OSS counts as «no spend» (R1)? Yes per memory, but explicit ack helps.
2. **Layer location:** `packages/ui/src/charts/primitives/` co-located vs separate `packages/chart-primitives` package? Recommend co-located until 2nd consumer needs it.
3. **`<CitationGlyph>` location:** promote to `@investment-tracker/icons` (new package) или keep `packages/ui/src/icons/`? Recommend `packages/ui/src/icons/` for now.
4. **Dispatch strategy:** Phase α single dispatch (~3-5h)? Or split α into «math layer» + «React primitives layer» + «ChartFrame + portal» (3 sequential dispatches)?
5. **Sequencing с PD «three-act narrative»:** primitives migration first (~2 weeks), then showcase restructure (3-act + 5 missing sections) second? Or parallel?

## Recommended dispatch plan (for Phase α)

Split Phase α into 3 sequential FE dispatches (мitigates timeout, clean phase commits):

- **α.1 (small ~30 min):** Layer 1 math — `Scale` port, `linePath` / `areaPath` / `arcPath` from d3-shape, `squarify` lazy-import. Pure functions + Vitest unit tests. Zero React.
- **α.2 (medium ~60 min):** Layer 2 minimum — `<ChartFrame>` + `<GridLines>` + `<AxisTicksHTML>` + `<LinePath>` + `<AreaGradientDef>` + `<Tooltip portal>` + `<ChartDataTable>` auto-gen + `useChartKeyboardNav` re-export + Vitest `toBeAccessibleChart` matcher.
- **α.3 (small ~30 min):** Feature flag + Storybook scaffold + `<CitationGlyph>` in `packages/ui/src/icons/`.

After α landed → Phase β (Sparkline + Donut canary pair behind flag).

## Source documents

- `docs/reviews/2026-04-29-r2-architect-system.md` (project architect — system level, returned inline as no Write tool)
- `docs/reviews/2026-04-29-r2-primitives-layer-plugin-architect.md` (plugin architect — cross-ecosystem, Right-Hand persisted)
- `docs/reviews/2026-04-29-r2-primitives-layer-fe-engineer.md` (FE-engineer — feasibility)
- `docs/reviews/2026-04-29-r2-primitives-layer-product-designer.md` (product-designer — visual specs)
- `docs/reviews/2026-04-29-r2-primitives-layer-a11y.md` (a11y-architect — patterns)
- This synthesis: `docs/reviews/2026-04-29-r2-primitives-layer-aggregate.md`
