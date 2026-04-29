# R2 — Custom SVG Chart Primitives Layer · FE Engineer Lens

**Date:** 2026-04-29
**Branch:** `chore/plugin-architecture-2026-04-29` @ HEAD (read-only audit)
**Author lens:** Frontend Engineer — implementation feasibility
**Companion voices (parallel):** product-designer / a11y-architect / brand-strategist / brand-voice-curator
**Status:** brainstorming record + recommendation; no code touched.

---

## TL;DR

Recommend **Path B — custom primitives layer with d3-scale only** as the
strategic destination, executed in a phased migration that lets us live in a
**Path E hybrid** (Recharts + hand-crafted islands) for as long as the in-flight
Phase 2 migration needs. Treemap pattern (mostly-custom inside Recharts shell,
Path D) is a documented anti-pattern: it imposes the worst of both worlds (we
ship Recharts' weight + own all the maths). Path C (zero-D3) is overkill — d3-scale
is ~10 KB gzipped and saves us a multi-month tax of writing & testing
nudge / nice-tick / time-scale logic. Path A (Visx wholesale) is plausible but
trades one library dependency for another and doesn't reduce the delta we'd
have to write to honour the Provedo design language.

The honest cost: hand-crafted SVG charts are a **one-time investment with a
permanent maintenance lease**. The three things Recharts genuinely pays for —
animated transitions, tooltip viewport-edge clamping, and ResponsiveContainer
with its measurement loop — we will own forever. None are research-hard, but
all are tedious, and getting them subtly wrong is a 5pt-bug rabbit hole in
production. Path B accepts that lease in exchange for full control over visual
language, payload-aware rendering (today ~60% of Treemap and 100% of Calendar
are already custom), and a clean discriminated-union type model.

---

## 1. Five implementation paths · feasibility / migration / DX scoring

| Path | Feasibility | Migration risk | DX | Production reliability | Verdict |
|------|-------------|----------------|----|----|---------|
| **A — Visx wholesale** | High; Visx is just composable React+SVG | Medium — full rewrite, but consumers untouched | Medium — primitives are headless, every chart needs a wrapper to get the Provedo look | High — well-tested, used at scale at Airbnb | Plausible alt; doesn't reduce code we'd have to write vs. Path B |
| **B — Custom + d3-scale** | High; we already write SVG by hand for Treemap tiles + Calendar grid | Medium — phased per-chart cutover behind feature flag | Good — adding a chart kind is `<ChartFrame>` + `<XAxis>` + `<series>` composition | High once mature; tooltip / responsive / a11y are the durability hot spots | **Recommended** |
| **C — Zero-D3** | Medium; nice-ticks + log scales + ordinal scales are 100-200 LOC each, all subtly wrong on first try | Same as B | Lower — every new chart kind requires understanding our hand-rolled scale math | Medium — domain edge cases (NaN, single-point series, all-zero data) are where d3-scale earns its KB | Bundle savings (~10 KB gz) not worth the bug surface |
| **D — Treemap-pattern extension** | High in isolation; but Recharts' inner mechanics fight us when we want full layout control | Low — already partly there | Bad — every chart hides a «what is Recharts doing here?» layer underneath the custom SVG. See Waterfall's stacked-bar invisible-base trick: 50 LOC to compensate for Recharts not exposing floating baselines | Medium — fragile to Recharts upgrades; Recharts 3.x already silently dropped `<Pie activeIndex>` props (DonutChart §107 comment) | **Architect was right — this is «paying for Recharts and not using it»** |
| **E — Hybrid (Recharts on simple, hand-crafted on complex)** | High; current state already trends here | Low — incremental | Good for Recharts kinds, custom-island skill for the others | High — but ceiling is Recharts' polish ceiling | **Recommended as transitional state, not destination** |

### Why not Path A (Visx)

Visx primitives are clean React, but they don't reduce the wrapper code we'd
write. Every Visx chart we ship still needs:
- a Provedo `<ChartFrame>` to bake the cream-paper card + dotted gridlines + mini-card tooltip
- a payload-aware dispatch layer (we already have `LineChartPayload` etc.)
- our own keyboard nav / a11y data-table / FINRA captions

So Path A buys us a different scale library + ergonomic React composition vs.
Path B's d3-scale + ergonomic React composition. The additional dep doesn't
unlock anything that meaningfully shortens the migration. If we ever revisit
this, Visx ranks above d3 + custom only when we need their force-directed /
dendrogram / chord-diagram primitives — none of which are on the chart roadmap.

---

## 2. Eight implementation feasibility questions

### Q1 — TypeScript pain of replacing Recharts

**Manageable.** The chart payload is already a discriminated union in
`packages/shared-types/src/charts.ts`. The dispatch layer is the predictable
pattern:

```ts
// pseudocode — render dispatch
function renderChart(p: ChartPayload): JSX.Element {
  switch (p.kind) {
    case 'line': return <LineChartPrimitive payload={p} />;
    case 'area': return <AreaChartPrimitive payload={p} />;
    // …
  }
}
```

Real pain points:
- **Recharts' typings escape into our code.** `ActiveShapeProps` in DonutChart,
  the `item?.payload as { delta?: number }` cast in Waterfall — these vanish
  when we own the contract. Net win.
- **Generic `<Series>` components** are tricky. `<Bar dataKey="y">` with
  `Pick<Payload['data'][number], 'y'>` typing requires careful generics so a
  `LineChart<ForexPayload>` can't accidentally accept a `BarChartPayload`. The
  fix is per-chart components; no shared `<Chart kind="...">` god-component.
- **Active-index plumbing.** Today `useChartKeyboardNav(ref, len, onChange)` is
  a clean hook, but each chart wires its own state. With primitives we want a
  `<ChartContext>` provider so axes / tooltips / overlays can read `activeIndex`.
  Standard React context pattern; no novel TS pain.

**Verdict:** TS gets cleaner, not worse. Today we have 7 `// biome-ignore` and
3 `as` casts across 9 chart files. Custom primitives drop those.

### Q2 — SSR hydration risk

**This is the biggest reliability hazard.** Real concerns:

1. **`getBBox()` only works in browser.** Tick label collision avoidance, donut
   percentage label measurement, axis label rotation overflow — all need real
   measured glyph widths. Server-side we get nothing. Mitigation: render with a
   **conservative reserved width** server-side (assume widest formatter output),
   then on first client paint measure and reflow. Two-pass render means CLS unless
   we lock the chart's outer box dimensions (which we do via fixed `height` props
   already). Risk: subtle horizontal jitter on first paint. Acceptable.

2. **`ResizeObserver` only on client.** Same pattern: server renders at a fallback
   width (we already need `width="100%"` to live inside its container's CSS), client
   measures and re-paints with real px. Risk: a single re-render on mount, which
   matches Recharts' `<ResponsiveContainer>` behaviour today.

3. **`useId()` for SVG `<defs>` ids** — already in use (DonutChart line 121,
   AreaChart line 78). React 18 stable. No new risk.

4. **Theme detection (`document.documentElement.classList.contains('dark')`)** —
   already a problem today (LineChart §51-72). Solution shared with Recharts: the
   `useDarkTheme()` hook. No regression.

**Mitigation pattern:**
```ts
'use client';
function useClientWidth(ref): number | null {
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}
// Until w is measured, render with a server-safe fallback (e.g. 600px).
```

**Verdict:** Same hydration pattern Recharts uses. We're adopting their problem
verbatim, not inventing new exposure.

### Q3 — Testing pain (Vitest snapshots)

**Already de-risked.** I checked the existing snapshot file
(`__snapshots__/charts.test.tsx.snap`, 1477 lines, 0 SVG nodes). Snapshots target
**`<ChartDataTable>` only** — the visually-hidden HTML data table that backs the
chart's a11y story. Coordinate / SVG churn does not invalidate any snapshot
because no SVG geometry is captured.

That's the cleanest possible setup for a primitives migration: **the existing
test plane survives a full SVG rewrite untouched**. Layer C guardrails
(axe-core + `data-active-index` keyboard nav + caption assertions) are equally
SVG-agnostic — they target ARIA / data-attrs / text content.

The only test work is:
- Unit tests for the new scale helpers (`niceTicks`, `bandScale.bandwidth`).
- Visual regression via Playwright at Layer B (already on the plan, screenshot
  set keyed by chart kind × theme — coordinate changes are expected on the
  rewrite, baselines just refresh once).

**Verdict:** Test infra is already structured to absorb this. No churn.

### Q4 — Responsive behaviour pain

This is real but solvable.

- **ResizeObserver feedback loop.** A naive `setState(width)` on every observer
  callback re-renders the SVG, which can change scrollbar width, which fires
  the observer again. Mitigation: throttle (rAF batching) or only update if
  `Math.abs(prev - next) >= 1px`.
- **React Strict Mode double-render.** `useEffect` fires twice in dev. The
  observer callback firing twice is harmless (idempotent), as long as we don't
  do work *only* inside a one-shot effect.
- **`'use client'` boundary.** Every chart primitive must be client. Already
  the case; not a regression.

**Verdict:** Standard rAF-throttle pattern. Recharts' `<ResponsiveContainer>`
uses the same approach (you can read it in their source). We replicate it
in ~30 LOC.

### Q5 — Animation pain

The hardest non-obvious one.

- **Mount draw-in animation** (`stroke-dashoffset` from `pathLength` to 0): we
  need `useEffect(() => { setMounted(true); }, [])` + CSS `transition: stroke-dashoffset Xms` to trigger on first paint. Reduced-motion: skip the
  effect, paint final state.
- **Data-update tween** (`d` attribute changes when payload mutates): this
  requires interpolating the path string between old and new values. Recharts
  does this with d3-interpolate. We'd either:
  (a) skip data-update tweens (snap on payload change — acceptable for MVP);
  (b) add d3-interpolate (~3 KB gz) when product needs it.
- **Coordinated state machine** (entering / settled / exiting): for charts that
  appear/disappear, an `<AnimatePresence>` from framer-motion is overkill; a
  small `useState<'enter' | 'settled' | 'exit'>` per chart suffices and reads
  nicely. **Don't add framer-motion just for charts.**

**Verdict:** First version snaps on data update, animates draw-in on mount.
That's parity with our current Recharts setup (`isAnimationActive` defaults to
true for mount, but data-update animations are Recharts-driven and we don't
use the more sophisticated tweens anywhere). Not a regression.

### Q6 — Bundle size pain

| Library | gzipped | Notes |
|---------|---------|-------|
| Recharts (current) | ~95 KB | Tree-shake-resistant; `recharts/es6` import doesn't help much in practice |
| d3-scale | ~10 KB | linear / log / time / band / ordinal — all we need |
| d3-array (optional) | ~5 KB | extent / bisect / max — nice but not critical |
| d3-interpolate (optional) | ~3 KB | only if we want path tweens |
| Visx (Path A baseline) | ~25-40 KB depending on which @visx/* | tree-shakes well |

**Tree-shake discipline rule:** `import { scaleLinear } from 'd3-scale'` only —
NEVER `import * as d3 from 'd3'`. Lint rule via `no-restricted-imports`
blocking the umbrella `d3` package. With this, Path B is **~85 KB gz savings**
vs. current. That moves App Page bundle (300 KB target) materially.

### Q7 — Dev-experience pain

The honest answer: **adding a new chart kind today takes ~30 min** (Recharts
component + payload type + fixture + smoke test). After Path B, the same task
could be 60-90 min while the primitives layer is fresh, dropping to ~30-45 min
once the team has built 3-4 charts with it. The reason: Recharts hides a lot
of axis-tick choosing, gridline cadence, tooltip clamping, and ResponsiveContainer
wiring inside an opaque `<LineChart>`. We pay for that abstraction in flexibility
loss; we save it in time-to-first-chart.

Mitigation: **invest in a `<ChartFrame>` template component** that bakes the
ResponsiveContainer, theme tokens, axes default props, tooltip portal, and a11y
data-table mount points. With `<ChartFrame>`, a new chart is:

```tsx
<ChartFrame payload={payload} height={220}>
  {(scales) => (
    <>
      <Gridlines />
      <XAxis scale={scales.x} />
      <YAxis scale={scales.y} />
      <Series data={data} scales={scales} />
    </>
  )}
</ChartFrame>
```

Time-to-new-chart-kind is then back to ~30 min. **The $-cost is the upfront
month it takes to build `<ChartFrame>` right.**

### Q8 — Migration risk

**The biggest risk: in-flight chart consumers.** Today: showcase route, position-
price-chart on `/positions/[id]`, future chat. They use `<LineChart payload={…}>`
and we cannot swap the implementation without keeping the API stable.

**Mitigation strategy:**
1. Keep the public component API identical (`<LineChart payload={…} height={…} className={…} />`).
2. Replace the implementation per chart, behind a single feature flag
   `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives|recharts`. Default `recharts` until cutover.
3. Ship a parallel `__snapshots__` for the primitives backend during transition
   (Vitest supports `toMatchSnapshot('primitives')` via custom file paths).
4. Cut over Sparkline first (smallest surface, lowest risk) → DonutChart →
   Treemap → axes-bearing charts (Line / Area / Bar / StackedBar) → Waterfall →
   Candlestick / Calendar (already mostly-custom; quick wins).
5. Remove Recharts from `package.json` only when flag is unconditionally `primitives`
   for two weeks across all consumers.

**Verdict:** Low risk if API-locked + feature-flagged. High risk if anyone
attempts a big-bang rewrite.

---

## 3. Top-3 hardest problems Recharts solves for us

If we replace, we own all three. None are research-hard. All are tedious + bug-prone.

### 3.1 Tooltip viewport-edge clamping (and portal-out-of-overflow)

Recharts' `<Tooltip>` clamps to the chart container's bounds and inverts its
anchor when near a viewport edge, AND it's portaled to `document.body` so the
parent `overflow:hidden` (e.g. inside our card with `border-radius: 12px`)
doesn't clip the tooltip. We need both behaviours:

- **Edge-aware positioning:** `tooltipX = mouseX + 12 px; if tooltipX + tooltipWidth > viewportRight, tooltipX = mouseX - tooltipWidth - 12 px`. Same logic on Y.
  Owner: a `<Tooltip>` primitive that takes a `targetRect` from its hoverable
  parent and renders a portal'd absolutely-positioned div.
- **Portal out of overflow parent:** ReactDOM.createPortal to `document.body`,
  position via `getBoundingClientRect()` of the trigger + `scrollX/Y`.
- **Trap:** `getBoundingClientRect()` is only valid in the browser; SSR returns
  `0,0,0,0`. So tooltip is always client-rendered (already `'use client'`).

**Estimated build:** ~150 LOC for the portal tooltip primitive + edge-clamp.
Tested via Playwright (mouse to edges of viewport, screenshot).

### 3.2 Nice-tick choice + responsive label collision

For a y-axis spanning $184,210 to $247,830 we want ticks at $200K, $220K, $240K
— not $184K, $204K, $224K, $244K. d3-scale's `.nice()` + `.ticks(n)` solves
the round-numbers part; we own the **collision avoidance** part:

- **Tick density:** start with `n = Math.floor(height / 40)`, request ticks,
  measure rendered label widths, drop alternating labels until none overlap.
- **Compact vs full:** `$184,210` at 11px Geist Mono is ~62 px wide; on a 200 px
  axis we get max 3 labels. Switch formatter to `currency-compact` ($184K)
  giving ~38 px width and 5 labels comfortably. Owner: a
  `pickFormatter(width, sample)` helper that the axis primitive calls.
- **Trap:** measuring requires `getBBox` or canvas `measureText`. SSR returns
  nothing → conservative formatter fallback server-side, real measurement
  client-side, tolerate one re-render.

**Estimated build:** ~80 LOC for the responsive formatter helper + 60 LOC for
the axis primitive. Highest test surface — covers data with NaN, all-zero,
single-point, log-scale negative-domain edge cases.

### 3.3 ResponsiveContainer with measurement loop + correct child dispatch

Recharts' `<ResponsiveContainer width="100%" height={220}>` measures its parent,
passes width/height to the inner chart, and re-measures on resize. The trick:
the inner chart can't render until measurement completes (can't paint at width=0).

Our primitive `<ChartFrame>` needs:
- A measurement effect that gets parent width.
- A first-paint placeholder (skeleton, ideally matching final dimensions to
  avoid CLS).
- A re-render gate that waits for `width != null` before painting the SVG.

**Trap:** Strict-mode double-effect runs the measurement twice; idempotent if
we just set state to the same value, but we need to ensure no double-paint
flicker. rAF batch.

**Estimated build:** ~60 LOC. The `<ChartSkeleton>` we already have can serve
as the placeholder.

---

## 4. Per-chart-kind difficulty estimate

| Chart | Difficulty | Notes |
|-------|-----------|-------|
| **Sparkline** | Small | No axes, no tooltip, no legend. ~80 LOC primitive. Easiest; cut over first. |
| **DonutChart** | Small-Medium | Pure SVG `<path>` with arc math (already `<Sector>` semantics). Active-shape ring + label callouts well-trodden. Skip Recharts' Pie internals → cleaner. |
| **LineChart** | Medium | Axes + tooltip + reference line + overlay markers + dash-ladder for color-blind variant. The bulk of work goes into `<ChartFrame>` axes — once that's done, this is composition. |
| **AreaChart** | Medium | Same as Line + `<linearGradient>` defs (already in code). Stacked variant needs cumulative-sum scale prep. |
| **BarChart** | Medium | Adds horizontal vs vertical layout switch + reference line + `colorBySign` per-cell. Active-bar hover lift = CSS filter, simple. |
| **StackedBar** | Medium | Same as Bar + per-segment cumulative offsets. Hover discrimination per segment vs per bar = real concern (see §5 below). |
| **Calendar** | Small | **Already 100% custom CSS-grid. Path B basically no-ops here.** |
| **Treemap** | **Large** | Squarified treemap algorithm (Bruls / Huijbers / van Wijk) is non-trivial — ~120 LOC and easy to get wrong on edge cases (single tile, all equal weights, very wide aspect ratios). d3-hierarchy provides `.treemap().tile(treemapSquarify)` for ~3 KB gz; **import it, don't reinvent**. Then the `<TileContent>` SVG we already have reuses verbatim. |
| **Waterfall** | **Large** | Floating-baseline geometry already lives in our `computeWaterfallSteps` (Waterfall.tsx §72). The hard part is anchor markers + connector dashed line + step-after interpolation between bar tops. Today we hack this via stacked-bar invisible-base; with primitives we just paint absolute-positioned `<rect>` + `<line>` from the computed steps. Net **simpler** than current Recharts hack. |
| **Candlestick** | Medium | OHLC body + wick = two `<rect>` per candle, sign-coloured fill. Trivial geometry. Tier 3 chart, can be last. |

**Hardest 2–3:** Treemap (algorithm complexity, mitigated by d3-hierarchy),
Waterfall (a lot of small geometry decisions), Line/Area/Bar (all share the
`<ChartFrame>` build cost; once one ships, the rest are cheap).

---

## 5. The **REAL** pains a hand-crafted SVG chart engineer hits

Honesty list (none of these are research-hard, all are tedious-bug-shaped):

1. **Tooltip in scrollable + `overflow:hidden` parent** — covered §3.1. Portal out
   to body. The bug pattern: tooltip painted inside chart card; user scrolls page;
   tooltip clipped by card border-radius. Fix is portal + position: fixed.
2. **Tick label collision when 12 labels fight for 200 px** — covered §3.2.
   Iterative drop-alternating-labels.
3. **Axis-formatter responsive switch (compact vs full numbers)** — covered §3.2.
   Width-aware formatter dispatch.
4. **Donut percentage label readability when slice < 5%** — labels-on-tile only
   shown above a width × height threshold (already in `labelOnTile()` helper).
   For donut: callout lines from slice to outside-the-donut label (we don't
   currently draw these, and we don't need to for MVP — center label tells the
   story). **Don't build callouts until product demands.**
5. **Waterfall connector stepping logic (anchor + diff bars + connectors)** —
   already solved in `computeWaterfallSteps`. Custom primitives make this
   *cleaner* (one absolute paint instead of stacked-bar invisible-base trick).
6. **Calendar grid keyboard navigation (date math + arrow keys)** — already
   works (`useChartKeyboardNav` linear index). To upgrade to true 2D grid nav
   (Up/Down moves a week), need date arithmetic + week-of-month math. Not
   blocking MVP; add later.
7. **Stacked bar hover discrimination (which segment, not which bar)** — today
   Recharts gets close but cursor is the whole column. We're already overriding
   to per-segment `activeBar`. With primitives, attach `onMouseEnter` per
   `<rect>` (segment); use `pointer-events: visiblePainted` so transparent
   pixels in rounded corners don't fire. Trivial.
8. **Animation pause on tab-switch (visibilitychange API)** — for our short
   600 ms mount animations, this barely matters; if we add long-running
   animations, listen on `document.visibilitychange` and toggle CSS animation-
   play-state. Not a blocker.
9. **High-DPI rendering** — SVG is already DPI-agnostic. The trap is
   `<filter>` blur radii: SVG filters compose in user space by default, so a
   blur of 2 looks identical at 1× and 2×. We're using filters in DonutChart
   inner-hole inset. Already correct (we use absolute SVG units, not `px`
   relative to viewport). No regression.

**The ones that genuinely matter for production:** §3.1, §3.2, §3.3 (top-3
above). The others are «nice to have» refinements.

---

## 6. Recommended path · rationale

**Recommendation: Path B (custom primitives + d3-scale), executed in 4 phases
that are each individually shippable and reversible.**

### Why B, not E

Path E (hybrid) is what we're effectively doing now — Recharts on simple charts,
hand-crafted islands inside Recharts on Treemap / Calendar. The cost of the
hybrid state is **two mental models**: when adding a feature, an engineer asks
«does this chart go through Recharts or not?». That branching dev-experience is
permanent in Path E and the silent tax compounds. Path B accepts a one-time
migration cost in exchange for a single mental model.

### Why B, not C

d3-scale is ~10 KB gz, well-tested, and saves us writing nice-tick + log-scale
+ time-scale logic that has decades of edge-case fixes baked in. Path C's
bundle savings are not worth the bug-tail.

### Why B, not A (Visx)

Visx's primitives are good, but the wrapper code we'd write to bake the Provedo
language is identical regardless of whether the underlying tick generator is
d3 or @visx/scale (same library underneath). Path A buys ergonomics we already
get with d3-scale + plain React.

### Phased migration plan

**Phase α — Foundations (single PR, ~1-2 sprints):**
- Build `<ChartFrame>` primitive: ResponsiveContainer + theme provider + a11y
  data-table mount + skeleton fallback.
- Build `<XAxis>`, `<YAxis>`, `<Gridlines>`, `<Tooltip>` primitives. Tooltip is
  portal'd + edge-clamped.
- Add d3-scale to `packages/ui` deps; add `no-restricted-imports` rule blocking
  umbrella `d3`.
- Add feature flag `NEXT_PUBLIC_PROVEDO_CHART_BACKEND` in
  `apps/web/src/lib/featureFlags.ts`.
- No consumer changes. CI must remain green.

**Phase β — Sparkline + Donut cutover (single PR each):**
- Implement `LineChartPrimitive` etc. behind the feature flag.
- Existing Vitest snapshots stay green (they target a11y data-table only).
- Add Playwright visual regression baseline for primitives backend.
- Default flag stays `recharts`.

**Phase γ — Axes-bearing charts (Line / Area / Bar / StackedBar / Waterfall /
Candlestick), one per PR:**
- Same pattern. Each chart kind is independently shippable.

**Phase δ — Cleanup:**
- Flip default to `primitives` for all consumers.
- Two-week soak.
- Remove Recharts from `package.json`. Bundle size win logged.

---

## 7. Brainstorming record (raw notes — kept for posterity)

- The single biggest friction reading the existing code: **Waterfall.tsx §73-121
  computeWaterfallSteps + the stacked-bar invisible-base trick**. We're using
  Recharts as a coordinate system, not as a chart library. With primitives, this
  becomes: `for each step, paint rect(x = i*barWidth, y = scaleY(step.base + step.span), width, height = scaleY(step.base) - scaleY(step.base + step.span))`. **Half the code.**
- DonutChart §246-256 — we're injecting an SVG filter inset shadow as an
  absolutely-positioned overlay because we can't easily get `<defs>` underneath
  Recharts' `<Pie>`. With primitives, `<defs>` lives in our SVG, no overlay
  needed.
- LineChart §51-72 — `useDarkTheme()` MutationObserver-on-html-classlist hook
  is good; we keep this verbatim.
- BarChart §170 — `activeBar={{ style: { filter: 'brightness(1.10) drop-shadow(...)' } }}` works but the typing `as ActiveShapeProps` is the kind of
  thing we lose with primitives.
- Calendar.tsx is a non-Recharts pure-CSS-grid renderer already. Path B leaves
  it untouched. **This proves the model works.**
- The static design-system.html SVG charts (lines 1900-2150) are easy to
  replicate in React: viewBox-based percentages, hard-coded coordinates. The
  step from there to scale-driven coordinates is small.
- No SVG content is captured in our snapshots (`charts.test.tsx.snap`) — only
  `<ChartDataTable>` HTML. **Unblocks rewrite.**
- Tooltip portal gotcha: must respect z-index of route navbar / modals. Today
  Recharts' tooltip has z-index conflicts in the chat preview overlay. We can
  fix this in the primitives version by routing through a stacked-context
  manager. **Also a Recharts bug we'd unblock.**
- Bundle: ~85 KB gz reduction plausibly recovers 10-15% of typical app-page
  bundle. Real win for first-paint.
- Risk we didn't talk about enough: **Recharts upgrade pressure**. v3.x dropped
  `<Pie activeIndex>` (DonutChart §107). We're already paying the upgrade tax;
  cutting away gives us full control over breaking-change cadence.

---

## 8. Honest acknowledgements

- **Time investment is real.** Phase α alone is the biggest single upfront
  cost. The phased plan is structured so we ship value incrementally; if we
  bail at Phase β we keep what we built (Sparkline + Donut + ChartFrame) and
  Recharts remains for the rest.
- **Polish ceiling is on us, not Recharts.** Once we own the primitives layer,
  every visual refinement (callout lines, tick label rotation, tooltip arrow
  pointer, etc.) is our PR. Recharts ships those for free. Counterweight: we
  rarely if ever like Recharts' defaults and override most of them anyway.
- **First wave will have visual regressions.** Coordinate / spacing / animation
  details will drift on cutover. Layer B Playwright visual baselines need to
  refresh per chart, treated as feature work not bugs.

---

## Returnable summary

(See compact return ≤ 300 words in the conversation thread.)
