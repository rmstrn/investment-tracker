# R2 — custom SVG chart primitives layer · product-designer brainstorm

**Branch:** `chore/plugin-architecture-2026-04-29` @ HEAD
**Lens:** visual primitive design (paper-feel + tactile-3D + Magician+Sage)
**Date:** 2026-04-29
**Mode:** read-only audit + spec. No code.

---

## 0 · Visual DNA atom — what the artist relied on

Reading `apps/web/public/design-system.html` lines 940–2156 and the shadow / token
declarations 600–820 with a primitive lens, the static reference is built from
**eight recurring atoms**:

| Atom | Where it shows up | Why it matters |
|------|-------------------|----------------|
| **A. Cream rim** (`stroke="var(--card)"` at 1–2 px) | donut segments, treemap tiles, stacked-bar tops | separates adjacent data without using a divider line — the card paper IS the divider |
| **B. Dotted hairline** (`stroke-dasharray="2 4"` then bumped to `3 5`) on `--chart-grid` | every cartesian backdrop | establishes rhythm without grid weight; reads as paper ruling, not chrome |
| **C. Top-rounded rect** (radius 6–10 on top corners only) | bars, stacked-bar top segments, anchor bars in waterfall | ground-truth "rests on x-axis" — bottom flat = paper, top curved = pulled-up |
| **D. Vertical alpha gradient** (30 % → 0 % opacity, series colour) | area-fill, treemap magnitude | "paper soaked through" — replaces solid fill; one of the strongest Provedo signatures |
| **E. Tabular Geist Mono micro-numerals** (10 / 11 px, `tnum`) | axis labels, treemap inline numbers, waterfall delta labels, sparkline delta | data-as-typography — the Sage register |
| **F. Inset depression** (`--shadow-input-inset` / `--shadow-inset-light`) | calendar cells, chip backgrounds, citation chips, future tooltip frame | recess = "look here" without color |
| **G. Outset extrude** (`--shadow-card` / `--shadow-lift`) | chart-card itself, ChartCard-on-page hero | the data sits on a real surface |
| **H. Citation glyph** (4-point Lucide sparkle, currentColor) | chat references; **not yet on charts** | the moment of "Provedo found this" |

**The atom of paper-feel = `cream-rim + dotted-hairline + tabular-mono`.** Any time
those three appear together, the surface reads as Provedo. Conversely, a Recharts
default that uses `stroke="#ccc"` solid + Inter sans-serif axis labels + no rim
does not. Today's `buildChartTheme.ts` covers B, C, E, and partly A (donut-only)
— D is duplicated by every chart, F has no home, G lives at ChartCard not at the
data layer, H is missing entirely.

**That's the gap the primitives layer closes.**

---

## 1 · Brainstorming record — primitives shortlist (per `superpowers:brainstorming`)

### 1.1 Rule used: shortlist generation, then converge

For each candidate primitive I generated 5 alternatives across 8 → 9 primitive
slots, then converged on the one that best carries the Provedo atoms above.
Where Recharts already gives us most of the way (e.g. `<Cartesian Grid />`), the
primitive simply wraps and themes; where Recharts can't get there (Tooltip,
DataLabel, citation glyph), the primitive owns the rendering.

### 1.2 Candidate ranking

For each primitive: **alternatives considered → chosen → why**.

#### `<Axis>`

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Hairline axis line + 4 px tick marks + Inter labels | Rejected — axis chrome reads as default Recharts |
| 2 | No axis line, no ticks, **Geist Mono 11 / `--text-3` / 0.08 em letter-spacing** | **CHOSEN** — already locked in `buildAxisProps()`; carries atom E |
| 3 | Underline-style axis (`border-bottom: 1px dotted`) | Rejected — fights with grid hairlines |
| 4 | Inset axis (labels sit in a `--inset` strip below) | Rejected — pulls weight away from data |
| 5 | Tick = small filled square (3×3) `--text-3` | Considered for category bars; rejected — adds chrome without legibility gain |

#### `<GridLine>`

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Solid 1 px `--chart-grid` | Rejected — too "report" |
| 2 | Dotted **3 5** `--chart-grid` opacity 1 (alpha lives in token) | **CHOSEN** — atom B; aligns with PO 2026-04-29 fix |
| 3 | Dashed 8 4 | Rejected — reads industrial, not editorial |
| 4 | Crosshatch micro-pattern fill | Rejected — chartjunk |
| 5 | "Inset" ruled-line — top edge 1px `rgba(0,0,0,0.06)` + bottom 1px white 0.6 | Considered for paper-emboss feel; rejected — overruns at small viewports |

#### `<Bar>`

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Flat solid fill, sharp corners | Rejected — generic Recharts |
| 2 | Top-rounded radius 10, solid series colour | Current state; baseline |
| 3 | **Top-rounded radius 10 + vertical fill gradient (series 100 % bottom → 80 % top) + 1 px cream rim on top edge only** | **CHOSEN** — combines atoms C + D + A; «pressed paper» without leaving paint surface |
| 4 | Top-rounded + drop-shadow filter | Rejected — SVG filters are GPU-heavy on lists; Recharts re-renders on hover |
| 5 | Inset-fill rounded (radius 10, lighter centre, darker edges) | Rejected — looks like a pill button, not a bar |

#### `<Line>`

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | 1.5 px stroke, butt caps | Rejected — terminates abruptly |
| 2 | **2 px stroke, round caps + joins, currentColor by series** | **CHOSEN — current state** carries atoms; keep as-is |
| 3 | 2 px stroke + 4 px aura (same hue, 0.15 alpha) | Considered — creates "embossed" feel; rejected for default (perf on long series) but **opt-in via `glow` prop for hero KPI line** |
| 4 | Dual-stroke (2 px ink-dark behind, 1 px series in front) | Rejected — reads as printed mistake |
| 5 | Stroke + opt-in dash pattern per series for color-blind safety | **CHOSEN as opt-in** — `dashPattern={['solid','4 2','2 2','6 2']}` matched by series index |

#### `<Area>`

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Solid 30 % opacity fill | Rejected — flat |
| 2 | **Vertical gradient 30 % top → 0 % bottom + 2 px stroke at top in series colour** | **CHOSEN — current state** = atom D + the line atom on top |
| 3 | Hatched fill (SVG pattern) | Rejected — busy |
| 4 | Two-stop gradient with mid-tone (30 % → 15 % → 0 %) | Considered — slightly richer; **kept as opt-in** for hero «cumulative P&L» card only |
| 5 | Clip-path reveal (no gradient) | Rejected — reduced-motion fallback becomes invisible |

#### `<Sector>` (donut/pie)

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Solid arc, no stroke | Rejected — segments fuse |
| 2 | **2 px `--card` cream rim between segments, 1.02 × scale on hover, faint inset shadow on donut hole** | **CHOSEN** — atoms A + F |
| 3 | 4 px rim | Rejected — eats data area below 200 px diameter |
| 4 | Segment-fill = 30 %→0 % radial gradient | Rejected — doesn't carry meaning, decorative only |
| 5 | Hover = explode (translate radially 4 px) | Rejected — too animated for «calm» principle; 1.02 scale stays subtle |

#### `<Tile>` (treemap / calendar / waffle cell)

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Solid colour, no border | Rejected — tiles bleed into each other |
| 2 | **1 px `--card` cream rim, magnitude → fill-opacity (0.30 / 0.55 / 0.85), Geist label inline, Geist Mono delta on second line** | **CHOSEN** — atoms A + D + E; matches treemap chart in design-system.html exactly |
| 3 | Magnitude → hue shift (light → dark series colour) | Rejected — competes with up/down colour encoding |
| 4 | Hatched pattern for "flat" magnitude | Rejected — chartjunk; flat is just opacity 0.30 |
| 5 | Per-tile inset shadow (recessed) | Considered for calendar cells with no event; rejected — already handled by `cal-cell.out { opacity: 0.4 }` |

#### `<Tooltip>`

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Default Recharts dark rect | Rejected — generic |
| 2 | `--card` solid + `--shadow-lift` + 1 px `--border` | Current state via `buildTooltipProps`; baseline |
| 3 | **`--card` 90 % alpha + `backdrop-filter: blur(10px)` + `--shadow-lift` + 1 px top inset highlight (cream edge) + Geist Mono eyebrow + Geist body, max-width 220 px** | **CHOSEN** — atoms G + (new) atmospheric blur; matches «paper card lifted off the data» feel |
| 4 | `--inset` background (depressed tooltip) | Rejected — reads as recessed = «look elsewhere»; tooltip should be lifted |
| 5 | Tooltip = small modal-shaped (ink CTA-style with cream text) | Rejected — too loud; tooltip should whisper |

**Note:** backdrop-blur degrades gracefully — browsers without support fall back
to solid `--card`. Same atomic reading; just slightly less atmospheric. No
fallback CSS needed.

#### `<DataLabel>` (numeric annotation)

| # | Alternative | Verdict |
|---|-------------|---------|
| 1 | Inline text on bar in series colour at 11 px | Rejected — fights with bar fill at low contrast |
| 2 | **Geist Mono 10 px, `tnum`, fill `var(--text-2)` for neutral context or series colour for emphasis, **placed above bar / endpoint with 4 px offset** | **CHOSEN** — atom E; carries waterfall labels and bar-end values consistently |
| 3 | Pill-wrapped (background `--inset`, padding 2 × 6) | Considered — too heavy as default; **kept as opt-in** for sparkline endpoint only |
| 4 | Currency-aware abbreviation ("$10K" not "$10,000") via `Intl.NumberFormat` | **CHOSEN as helper** — bake into `<DataLabel format="compact-currency">` prop |
| 5 | Connector line from data point to label | Rejected — the data is already labeled by axis; connector is chartjunk |

### 1.3 Optional 9th — `<CitationGlyph>` (custom Provedo invention)

This is the primitive **most distinctive to Provedo identity** and the one that
needs the most custom invention because no chart library has it.

The 4-point Lucide sparkle (`<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582…"/>`)
that appears in chat citations carries the Magician+Sage moment — "Provedo
found this". On charts, it should appear:

- as a marker on the data point that triggered an insight ("anomaly", "milestone")
- as a leader-glyph next to a `<DataLabel>` on insight-driven charts
- in the chart-eyebrow of a chart that surfaced an insight (replacing the
  monospace tier label)

5 alternatives, chosen `B`:

- A. plain dot 4 px `--accent`
- **B. 8 px Lucide sparkle in `--accent`, fill solid, no stroke, with 250 ms
  fade-in + 0.92 → 1 scale on appear** ← chosen, atom H
- C. 8 px outlined sparkle in `--text-3`
- D. animated draw-on (stroke-dasharray) sparkle
- E. small "i" info glyph (rejected — generic, doesn't carry brand)

Specifying this primitive lifts every chart that would otherwise be a generic
finance dashboard widget into something only Provedo ships.

---

## 2 · Primitive design specs

For each: **visual signature · anatomy · neumorphism applied · theme behavior ·
hover/focus · reduced-motion fallback**.

### 2.1 `<Axis>`

```
visual signature: text-only axis, no line, no tick marks
anatomy:
  - <text> elements, font Geist Mono 11px, fill --chart-axis-label, letter-spacing 0.08em
  - tickLine: false, axisLine: false (Recharts pass-through)
  - tick spacing: dynamic via Recharts; minimum gap 24 px to prevent overlap
neumorphism: none (axis is signal, not chrome)
theme: token-driven (--text-3 light → 4.79:1 on --card; #9A9A9A dark → 4.51:1 on #26262E)
states: only "rendered". No hover. No focus (axis is not interactive — selection
  happens on data marks).
reduced-motion: not applicable (static)
```

### 2.2 `<GridLine>`

```
visual signature: dotted hairline, horizontal-only by default
anatomy:
  - <line> element, stroke=var(--chart-grid), stroke-dasharray="3 5", stroke-opacity=1
  - vertical={false} default (cartesian charts read better with horizontal-only)
  - vertical={true} opt-in for time-binned bars where x ticks need anchoring
neumorphism: none
theme: rgba(20,20,20,0.10) light / rgba(255,255,255,0.10) dark
states: rendered only
reduced-motion: n/a
```

### 2.3 `<Bar>`

```
visual signature: top-rounded rectangle, paper-pressed feel
anatomy:
  - <Recharts.Bar radius={[10,10,0,0]}>
  - fill = `url(#bar-grad-${seriesId})` — vertical gradient: series colour 100% bottom → 80% top
  - top-edge inset: 1px stroke=var(--card) opacity 0.3 on TOP edge ONLY (via overlay rect path) — atom A
  - drop-shadow: NO svg filter (perf); rely on the gradient base→top to imply depth
neumorphism: gradient = "darker base, lighter top" mimics light coming from above
theme: gradient stops resolve via series tokens; cream rim flips with --card
states:
  - default: described above
  - hover: fill-opacity 1.0 (was 0.95 default), 100ms ease-out
  - focus: 2px outline=var(--accent) outline-offset 2px (matches global focus ring)
  - active (selected/clicked): cream rim becomes 2px (atom A intensified)
  - disabled: opacity 0.4
  - loading: skeleton bar — flat fill var(--inset), no gradient
  - empty: not applicable (empty bar = no rect rendered)
  - error: flat fill --terra at 0.5 opacity
reduced-motion: hover transition removed; static appearance unchanged
```

### 2.4 `<Line>`

```
visual signature: 2px round-cap stroke, optional dash for color-blind safety
anatomy:
  - <Recharts.Line stroke={seriesColor} strokeWidth=2 strokeLinecap=round strokeLinejoin=round>
  - opt-in: dashPattern from series index → "solid" | "4 2" | "2 2" | "6 2 2 2"
  - opt-in: glow prop → adds 4px aura via stroke duplication (one ghost <path>
    behind the main, alpha 0.15, no filter — keeps perf)
neumorphism: glow opt-in serves as embossed feel for KPI hero cards
theme: stroke = currentColor inherits from series token
states:
  - default: described
  - hover (chart-level): non-hovered series fade to opacity 0.4
  - focus: 2px aura around the focused series only
  - empty: render placeholder dotted line (--text-3 0.4 alpha) with "no data" label
reduced-motion: stroke-dashoffset draw-in animation skipped → render at full
  length immediately
```

### 2.5 `<Area>`

```
visual signature: paper-soaked gradient under a 2px stroke-cap line
anatomy:
  - <defs><linearGradient id={`area-grad-${id}`} x1=0 y1=0 x2=0 y2=1>
      <stop offset=0% stop-color=seriesColor stop-opacity=0.30 />
      <stop offset=100% stop-color=seriesColor stop-opacity=0 />
    </linearGradient></defs>
  - <Recharts.Area fill=url(#area-grad-...) stroke=seriesColor strokeWidth=2>
  - opt-in: 3-stop gradient (30 → 15 → 0) for hero card
neumorphism: gradient simulates ink bleeding through paper
theme: gradient stops use series tokens; flips with theme
states:
  - default: rendered
  - hover: stroke-width 2 → 2.5 (subtle), 100ms
  - reduced-motion: clip-path reveal animation OFF; gradient renders immediately
```

### 2.6 `<Sector>`

```
visual signature: cream-rim segmented donut, soft inner shadow on hole
anatomy:
  - <Recharts.Pie> with stroke=var(--card), strokeWidth=2 (already in buildDonutSegmentProps)
  - inner radius/outer radius set by parent
  - donut hole: SVG <circle r=innerRadius fill=var(--card) /> with
    `filter: drop-shadow(inset 0 1px 2px rgba(0,0,0,0.06))` — atom F applied to
    the hole (paper "punched through" feel)
neumorphism: inner shadow on hole = subtle depression
theme: cream rim flips with --card; hole shadow alpha resolves per theme
states:
  - default
  - hover (single sector): scale 1.02 (transform-origin = pie centre), 200ms ease-out;
    other sectors fade to opacity 0.6
  - focus (keyboard tab through sectors): same scale + 2px --accent outline ring
  - reduced-motion: hover scale skipped; instead, hovered sector gains 1px
    `--ink` rim
```

### 2.7 `<Tile>`

```
visual signature: rimmed magnitude tile, label inline
anatomy:
  - <rect> with stroke=var(--card) strokeWidth=1, fill=seriesColor,
    fill-opacity=magnitudeBucket
  - magnitudeBucket: { strong: 0.85, normal: 0.55, flat: 0.30 } (matches treemap)
  - inline labels: <text> Geist 12-13/600 + Geist Mono 9-10/400 second line
neumorphism: 1px cream rim acts as "cut paper" between tiles
theme: rim flips with --card; fill inherits series tokens
states:
  - default
  - hover: stroke-width 1 → 2, 120ms
  - focus: 2px --accent outline replacing rim
  - empty: tile not rendered (treemap algorithm skips zero-magnitude items)
  - selected (drill-down): rim becomes 2px --ink
reduced-motion: opacity 0→1 reveal stays (no transform involved); duration 0
  if reduced-motion enabled
```

### 2.8 `<Tooltip>`

```
visual signature: floating mini-card with backdrop-blur and cream top-edge
anatomy:
  - container <div> (rendered outside SVG) — Recharts custom Tooltip pattern
  - background: rgba(card, 0.90) — uses theme card with alpha
  - backdrop-filter: blur(10px) saturate(120%)
  - border-radius: 10px
  - box-shadow: var(--shadow-lift)
  - inset top highlight: 1px var(--card) at full alpha = atom A on top edge only
  - padding: 12px 14px
  - max-width: 220px
  - layout:
      • eyebrow: Geist Mono 10px, letter-spacing 0.18em, --text-3 (e.g. "APR 12")
      • value: Geist 18px/600, tabular-nums, --ink (e.g. "$184,210")
      • delta: Geist Mono 11px, tabular-nums, series colour (+2.4%)
      • optional sparkle citation glyph (8px) prefixing eyebrow if insight-tied
neumorphism: lifted card with backdrop atmosphere — atom G in tooltip form
theme: --card 90% alpha + --shadow-lift flips with theme automatically
states:
  - shown / hidden (no persistent hover; controlled by Recharts cursor)
  - reduced-motion: fade-in opacity transition removed; appears instantly
fallback: browsers without backdrop-filter → solid var(--card), atomic reading
  preserved
```

### 2.9 `<DataLabel>`

```
visual signature: tabular Geist Mono micro-numerals
anatomy:
  - <text> font-family Geist Mono, font-size 10-11, font-feature-settings tnum
  - placement: above bar (offset y -6), endpoint of line (offset x +6),
    centre of tile (already inline)
  - format prop: "raw" | "currency" | "compact-currency" | "percent" — uses
    Intl.NumberFormat with locale honoured
  - opt-in pill variant: background --inset, padding 2px 6px, border-radius 4px
    → used for sparkline endpoints in card cells
neumorphism: pill variant inherits --shadow-inset-light (atom F)
theme: fill --text-2 default; can override to series colour for emphasis;
  pill background --inset flips with theme
states: render only
reduced-motion: count-up animation OFF if reduced-motion → render final number
  immediately
```

### 2.10 `<CitationGlyph>` (Provedo signature, no chart-library equivalent)

```
visual signature: 4-point Lucide sparkle, --accent fill
anatomy:
  - <svg width=8 height=8 viewBox=0 0 24 24 fill=currentColor>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  - color: var(--accent)
  - sizes: --icon-xs (6), --icon-sm (8), --icon-md (10) — chart contexts use 8
neumorphism: none (it's signal, not chrome)
theme: --accent flips with theme (forest-jade → mid-jade)
states:
  - rendered (insight-tied data point)
  - hover (parent chart): glyph stays full alpha while data fades 0.4 — pulls
    eye to citation
reduced-motion: 250ms fade-in + 0.92→1 scale animation OFF → renders at full
  size immediately
appears as:
  1. data-point marker on anomaly / milestone
  2. leader-glyph next to <DataLabel> when label is insight-driven
  3. chart-eyebrow prefix when the chart was generated by an insight (e.g.
     in a chat-injected chart that explains a Provedo finding)
```

---

## 3 · Animation primitives

| Primitive | Default animation | Duration / easing | Default ON? | Reduced-motion fallback |
|-----------|-------------------|-------------------|-------------|--------------------------|
| `<Line>` | stroke-dashoffset draw-in | 300 ms `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) | **opt-in** (`animate` prop, default false on dashboards, true on hero) | full-length render, no animation |
| `<Bar>` | scaleY 0 → 1, transform-origin bottom | 200 ms ease-out | **opt-in** | full-height render |
| `<Sector>` | stroke-dashoffset on circular arc (sweep-in) | 400 ms ease-out-expo | **opt-in** | full arc render |
| `<Area>` | clip-path inset 0 100% 0 0 → 0 0 0 0 | 350 ms ease-out-expo | **opt-in** | full area render |
| `<Tile>` | opacity 0 → 1 (no transform — treemaps are dense, transform animations look like glitches) | 150 ms ease-out, staggered 20 ms per tile | **opt-in** | opacity 1 immediately |
| `<DataLabel>` (count-up) | numeric tween from 0 (or previous) to final | 600 ms ease-out, with locale-aware formatting per frame | **opt-in for hero KPI only** — this is the Magician quiet-revelation moment | render final number immediately |
| `<CitationGlyph>` | opacity 0 → 1 + scale 0.92 → 1 | 250 ms ease-out | **default ON** (the moment matters) | render at full alpha + size |
| `<Tooltip>` | opacity 0 → 1 + translateY -4 → 0 | 120 ms ease-out | **default ON** | opacity instant, no translate |

**Rationale for opt-in default on most:** «calm over busy» — animating every
chart on every dashboard renders becomes noise. The opt-in pattern keeps
animation as **a directing tool** the chart author uses for one or two
"Magician moments" per surface, not the wallpaper.

**Reduced-motion = strict media query.** Everything respecting
`prefers-reduced-motion: reduce` falls back to final-state render. No exceptions
for "but this is so subtle".

---

## 4 · Hierarchy via depth — 3-tier elevation map

Reducing today's 6 elevation tiers (`soft / card / lift / toast / input-inset /
inset-light / primary-extrude`) for chart surfaces:

| Tier | Token | Use on chart surfaces | Rationale |
|------|-------|------------------------|-----------|
| **Depressed** | `--shadow-input-inset` (single token) | tooltip frame? **NO** — tooltip is lifted. Use only for **selected calendar cell sub-card** (drilled-into) and **legend item filter pills (selected state)** | depression = "I'm receiving / focused-on" |
| **Resting** | `--shadow-soft` | sparkline cells inside other cards; inline mini-charts inside table rows | sub-cards inside a primary card |
| **Card** | `--shadow-card` | **default ChartCard** | the chart sits on a real surface (matches design-system.html line 778) |
| **Lift** | `--shadow-lift` | hero ChartCard (e.g. Dashboard primary KPI), **active Tooltip**, focused/drilled chart | "this matters now" |

**Map of 9 primitives onto the 3-tier scale:**

| Primitive | Sits at elevation |
|-----------|--------------------|
| `<Axis>` | n/a — text on the data plane |
| `<GridLine>` | n/a — printed on card surface |
| `<Bar>` | data plane (no shadow on the bar itself; shadow lives on ChartCard) |
| `<Line>` | data plane |
| `<Area>` | data plane |
| `<Sector>` | data plane; donut hole optionally `--shadow-input-inset` (subtle depression in centre) |
| `<Tile>` | data plane; rim stroke does the depth work |
| `<Tooltip>` | **LIFT** (`--shadow-lift`) — floats above data |
| `<DataLabel>` | data plane (or pill variant on `--shadow-soft` if used in sparkline cell) |
| `<CitationGlyph>` | data plane |

**The principle:** **at most one elevation tier per surface**. ChartCard owns
`--shadow-card`. Tooltip owns `--shadow-lift`. Everything else is flat on its
parent surface and uses **typography, colour, and rim** to signal hierarchy —
not nested shadows.

This collapses what could be a 6-shadow chaos into one rule: **shadows describe
the surface, not the data**.

---

## 5 · ui-ux-pro-max query log + insights

5 queries run via Bash CLI (windows `python` since `python3` not aliased).

| # | Query | Domain | Insight |
|---|-------|--------|---------|
| 1 | `axis tick typography editorial paper minimal chart` | chart | Library suggests Recharts for line trends; **A11y AA on line charts hinges on differentiating series by line style not color alone** → confirms the opt-in dashPattern alternative for `<Line>` (item 1.2 row #5) |
| 2 | `bar chart neumorphism tactile depth subtle drop-shadow` | chart | Bar Chart accessibility = AAA when **value labels visible by default** → reinforces that `<DataLabel>` should be a default-render primitive on bars, not opt-in |
| 3 | `line chart stroke gradient emboss editorial` | chart | Streaming/anomaly chart insight: **anomaly markers should be shape, not just color** → maps directly onto `<CitationGlyph>` as the anomaly marker primitive (sparkle = shape signature) |
| 4 | `tooltip backdrop blur paper feel financial` | ux | Animation duration 150–300 ms for micro-interactions, ≤500 ms total → confirms tooltip 120 ms fade and bar 200 ms scaleY |
| 5 | `chart palette earth aubergine cobalt complementary` | color | Closest match was Agriculture/Farm Tech earth-green palette (#15803D / #A16207 / #F0FDF4) — **confirms our forest-jade `#2D5F4E` + bronze `#A04A3D` + cream `#E8E0D0` is a tighter, deeper variant of an industry-validated direction** (we're not making it up; we're refining a tested chord) |
| 6 (bonus) | `data labels chart numeric annotation typography mono` | chart | Bar AAA = labels-on by default; Heatmap B-grade requires **numerical overlay on hover + downloadable grid** — extends the `<Tile>` primitive spec to include numerical-tooltip behaviour by default for treemap/heatmap parents |
| 7 (bonus) | `donut sector hover scale stroke separator` | chart | Donut accessibility = **C grade**; must provide stacked-bar fallback + percentage table — relevant to `<Sector>` reduced-motion spec, which already pairs the chart with a legend list as `aria-label` payload |

**Anti-pattern confirmations:**

- "Pie/Donut fail WCAG for color-blind users" → `<Sector>` MUST provide
  alternative text + percentages in legend (already in design-system.html donut
  legend; primitive should bake this in)
- "Treemap = poor baseline a11y" → `<Tile>` parent must always render a
  collapsible tree-table fallback when the chart is in an a11y-required context
- "3D scatter = fundamentally inaccessible" → not in our chart roadmap; safe to
  ignore

**Stack-relevant rule applied:** the `--design-system` rule for fintech B2C
typically recommends Hero-Centric pattern + minimal chart-chrome — confirms our
"no axis line, no tick marks, dotted grid only" axis spec.

---

## 6 · Visual signature recommendations beyond primitives

These are **not primitive-layer changes** but design-system-level moves the
primitive layer enables.

### 6.1 The «cream-rim ruling» as a typographic motif

The 1–2 px `--card` cream rim that separates donut sectors and treemap tiles
should become a **system-wide motif** for "this divides data inside a single
surface". Specifically:

- Stacked bar tops already use it (line 1425 of design-system.html, e.g.
  `<rect ... stroke="var(--card)" />`)
- Extend to: legend chip dividers, table row dividers (currently 1 px solid
  `--border`), tooltip multi-row separators

### 6.2 «Dotted hairline» as a wayfinding texture

The 3 5 dotted gridline pattern is unique enough to function as a brand
texture. Apply to:

- chat thread separators between AI replies
- table column rules (faint vertical 3 5 dot)
- empty-state placeholder grids

### 6.3 Citation glyph promotion

`<CitationGlyph>` should not be limited to charts. It already lives in chat;
expanding it to charts makes it the **single Provedo signature mark**:
"wherever the sparkle appears, Provedo found this for you." This is the
clearest expression of Magician+Sage in the visual layer.

Suggest naming the primitive `<ProvedoMark>` if it leaves the charts package and
goes into shared `@provedo/icons`.

### 6.4 Tooltip-as-card lineage

The proposed tooltip with backdrop-blur + lifted shadow + cream-edge inset
makes it **visually the child of the SignatureCard** (design-system.html line
1005, "extra lift · ink CTA"). Two surfaces share the same DNA — primary card
and tooltip. This visual lineage clarifies the system: there are two card
families (resting cards on `--shadow-card`, lifted cards on `--shadow-lift`),
and tooltip joins family 2 alongside hero cards and modals.

### 6.5 What **not** to do (anti-patterns this primitive layer rejects)

From `web/design-quality.md` + ui-ux-pro-max chart anti-patterns:

- ❌ Default Recharts grid (`stroke="#ccc"` solid 1 px)
- ❌ Inter or default sans-serif on axis labels
- ❌ Drop-shadow SVG filter on every bar (perf + visual chaos)
- ❌ Animated everything by default
- ❌ Dark-mode-by-default chart palette (we have cream-paper light as the
  primary visual direction — see lines 605–656)
- ❌ Color-only encoding for series differentiation
- ❌ Tooltip as solid dark rect with white text (generic Recharts default)
- ❌ Pie chart with > 5 slices (research: WCAG fail at ≤ 5 already; > 5 is
  unreadable)
- ❌ Decorative gradients on pie/donut segments (atom D is for area + tile only;
  donuts use solid + cream rim)

---

## 7 · Hand-off priorities for architect / tech-lead

In order of identity-impact (highest first):

1. **`<Tooltip>` custom primitive** — biggest visual gap today, single biggest
   identity uplift. Worth owning.
2. **`<CitationGlyph>` / `<ProvedoMark>`** — no chart library has it; pure
   Provedo invention.
3. **`<Bar>` gradient + cream-rim treatment** — touches every dashboard;
   compounding daily.
4. **`<Tile>` magnitude-rim primitive** — locks treemap + calendar +
   future-waffle into one rendering primitive.
5. **`<DataLabel>` with `format` helper** — small but pervasive; standardises
   tabular numerals across chart surfaces.
6. `<Axis>`, `<GridLine>`, `<Line>`, `<Area>`, `<Sector>` — already mostly
   handled by `buildChartTheme.ts`; the primitive layer mostly *names* them so
   chart authors can compose without re-importing helpers each time.

**Recharts compatibility note for tech-lead:** all primitives above except
`<Tooltip>` and `<CitationGlyph>` are *theming wrappers* over Recharts elements.
`<Tooltip>` becomes a Recharts custom-tooltip render. `<CitationGlyph>` and
`<DataLabel>` are independent SVG components that can be slotted into any chart
via Recharts' children-as-overlays pattern. **No Recharts replacement required
to ship the visual identity.**

---

## 8 · Open questions for tech-lead via right-hand

1. **Backdrop-filter performance** — does our dashboard re-render frequently
   enough that `backdrop-filter: blur(10px)` on tooltips becomes a perf cost
   worth measuring? (Recharts re-creates tooltip DOM on every cursor move.)
   Possible mitigation: cache blur via a single tooltip portal that updates
   props rather than remounts.
2. **`<CitationGlyph>` as part of `@provedo/icons` vs chart-local** — should
   the primitive live in the charts package (chart-context only) or get
   promoted to shared icons (chat reuses it)? Lean: shared. Need a11y label
   contract decided.
3. **Animation default** — is `animate={false}` the right default for primitive
   line/bar/sector? Implication: today's static design-system.html SVG mocks
   imply zero animation, which suggests yes.
4. **Recharts custom-tooltip vs render-prop** — both work; render-prop is
   cleaner for our purposes. Tech-lead pick.

---

## 9 · Brainstorming record summary

Per `superpowers:brainstorming`:

- **Generated** 5 alternatives × 9 primitive slots = 45 candidates.
- **Converged** to 9 chosen primitives with rationale tied to one or more of the
  8 visual atoms (A–H).
- **Verified** chosen primitives against ui-ux-pro-max accessibility data + 5
  search-domain queries.
- **Identified** the single primitive needing most custom invention:
  `<CitationGlyph>` (no library equivalent, carries Magician+Sage moment).
- **Identified** the single primitive with biggest identity-uplift:
  `<Tooltip>` (replaces the most-generic-looking thing on every chart today).
- **Mapped** elevation hierarchy from 6 tiers to 3 effective tiers for chart
  surfaces.

---

**Status:** draft — awaiting right-hand synthesis with 4 parallel voices
(architect / finance-advisor / tech-lead / brand-strategist).

**Token / file invariants touched:** none. This document is a spec. No code
written, no tokens edited. `buildChartTheme.ts` already covers axis / grid /
line / area-gradient / bar-radius / donut-stroke / legend; the primitive layer
extends rather than replaces it.

**Next-step deliverables (when greenlit):** TypeScript signatures for each
primitive's props interface; Storybook MDX stories; visual-regression baseline
PNGs at 320 / 768 / 1440.
