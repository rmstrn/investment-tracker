# BarChartV2 — first cartesian V2 port + editorial-still-life form

**Date:** 2026-04-30
**Status:** SPEC (autonomous run per PO directive «дёрни когда готово смотреть»; user-review at runnable milestone)
**Synthesis:** Right-Hand
**Section authorship:**
- §2 Visual treatment — **product-designer** (2026-04-30)
- §3 Architecture / framework — **architect** (2026-04-30)
- §5 Component contract — **frontend-engineer** (2026-04-30)
- §6 Tests — **qa-engineer** (2026-04-30, with synthesis fixes — see §10)
- §7 Rollout — **tech-lead** (2026-04-30)
- §1, §4, §8–§10, Appendix — **Right-Hand**

**Branch:** `chore/plugin-architecture-2026-04-29`
**Sub-project:** First of 7 V1→V2 chart ports (Bar / Area / Treemap / Calendar / StackedBar / Waterfall / Line). Establishes cartesian primitives framework reused by 6 successors.
**Cross-ref:** `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md` (form pattern reference); `docs/superpowers/plans/2026-04-30-donut-editorial-still-life.md` (PR commit pattern reference).

---

## 1. Brief

PO directive 2026-04-30: port all V1 Recharts-based custom charts to V2 (custom SVG primitives) and apply the locked editorial-still-life form (H3 specular bevel + paper-press shadow + linear-gradient fills) to each. Order: Bar → Area → Treemap → Calendar → StackedBar → Waterfall → Line. Candlestick deferred (finance/legal gated).

**This spec covers BarChartV2.** First V2 port WITH AXES (Donut/Sparkline don't have them). Establishes the `primitives/svg/{Axis,CartesianFrame,ReferenceLine}.tsx` cartesian framework reused by the 6 successors.

**Visual register:** editorial-still-life (sub-register beneath §2 tactile-paper master per `PROVEDO_DESIGN_SYSTEM_v1.md` v1.2 §13.6).

**Scope rules (from memory `feedback_v2_redesign_dont_hesitate`):** drop V1 visual conventions freely. V1 BarChart.tsx will be deleted post-migration. Apply best-judgment redesign — not minimum-diff conservation.

**No feature flag for the redesign itself** (PO directive 2026-04-30): pre-product, no real users, ship straight. Existing infra flag `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives` continues to gate V1↔V2 backend switching for the chart-primitives migration as a whole.

---

## 2. Visual treatment

> Authored by **product-designer**, 2026-04-30.

### 2.1 Linear-gradient direction

Vertical bars: `x1=0 y1=0 → x2=0 y2=1` (top→bottom), matching donut.
Horizontal bars: `x1=0 y1=0 → x2=1 y2=0` (left→right) — gradient must always run **along the bar's length** so the H3 specular bevel reads the «light pooling at the cap» direction the donut establishes. Wrong-axis gradient on horizontal bars would invert the lighting model and break register coherence.

### 2.2 Color mode default

Single hue, slot 1 (`--chart-categorical-1-{top,bottom}` → roasted-cocoa). The vast majority of bar use cases are single-series (drift, holdings-by-x, returns-by-period) where multi-hue rotation introduces noise without information. Reserve the 5-slot cycle for explicit multi-series via a future `colorByCategory: boolean` prop (out of scope this PR).

When `colorBySign === true`: positive = slot 1 (roasted-cocoa, warm), negative = slot 4 wine (`var(--chart-categorical-4-{top,bottom})`). Wine is already in the editorial-mh3 palette envelope, semantic distance from cocoa is large (hue 9° vs 35° + ΔL), no new finance-advisor sign-off needed.

### 2.3 Hover treatment

Match donut: `scale(1.06)` + `HOVER_SHADOW` (paper-press + accent rim). Drop V1's `brightness(1.10)`. Rationale: register coherence — a tracker dashboard mixing donut + bar should hover-respond identically. The brightness trick was a Recharts workaround; we can do better with primitives.

Tiny-bar guard: bars with `min(width, height) < 12px` skip the scale (would read as no-op / razor-pop) and apply `HOVER_SHADOW` only. Implemented via `useHoverScale` hook (see §5.4).

### 2.4 Bar corner radius

All four corners rounded, `r = 6px` (matches donut `DEFAULT_CORNER_RADIUS`). Drop V1's «top-rounded, bottom-flat» pattern — chart-cliché from Recharts defaults. Editorial-still-life is full-form: pebbles, not spires.

Cap rule: `effectiveR = min(6, barWidth/2, barHeight/2)` to prevent pinching on tiny bars.

### 2.5 Reference line treatment

**Embossed groove**, not dashed line. Two stacked `<line>` elements: 1px `var(--ink-shadow-soft)` at y, then 1px `var(--card-highlight)` at y+1 — gives a tactile «scored into paper» feel matching the form. Drop V1's dashed `gridLineStrong` pattern (reads as data-grid leftover).

Label: small-caps mono right-aligned above the line.

**Token verification (RH):** if `--ink-shadow-soft` and `--card-highlight` tokens don't exist in `packages/design-tokens/tokens/semantic/{light,dark}.json`, fallback to:
- `--ink-shadow-soft` → `rgba(20, 20, 20, 0.18)` light / `rgba(0, 0, 0, 0.4)` dark
- `--card-highlight` → `rgba(255, 255, 255, 0.55)` light / `rgba(244, 241, 234, 0.18)` dark

Add proper tokens as TD if missing — defer to follow-up PR.

### 2.6 Drift caption

V1 uses `meta.subtitle.includes('drift')` heuristic to render a FINRA-required prose disclaimer below the chart. **Preserve detection logic.** Upgrade visual from V1 plain `<p class="text-xs text-text-secondary">` to a paper-press caption block:
- 1px top border in `var(--ink-shadow-soft)` + 1px inset shadow in `var(--card-highlight)` (embossed-groove divider)
- 12px top padding
- Small-caps mono header «DRIFT» (10px tracking-wider)
- Body prose unchanged from V1 (`DRIFT_CAPTION` constant)

### 2.7 Preserved invariants

- Drift detection logic (`isDriftBar(payload)` from V1)
- `colorBySign` / `diverging` / `referenceLine` / `orientation` props from `BarChartPayload`
- A11y baseline (role=img, keyboard nav, ChartDataTable, aria-live)
- `prefers-reduced-motion` → entrance + hover collapse to opacity-only
- Lane-A Risk Flag 2: schema-enforced (no `targetWeight`, reference line zero-only)

---

## 3. Architecture / framework

> Authored by **architect**, 2026-04-30.

### 3.1 Framework location

Use existing `packages/ui/src/charts/primitives/{math,svg}/` shipped during Phase α.2 (DonutChartV2 work). PD's brief proposed a parallel `_shared/primitives/cartesian/` directory — REJECTED. The Layer-1 (math, no React) ↔ Layer-2 (SVG, React) split PD asked for already exists; creating duplicates would orphan `AxisTicksHTML`, duplicate `GridLines`, and split tick-label code across two trees.

**Verified existing infrastructure:**
- `primitives/math/scale.ts` — d3-scale-wrapped `linearScale` / `timeScale` / `bandScale` ports (hexagonal)
- `primitives/math/path.ts` — `linePath`, `areaPath`, `arcPath` (used by Donut)
- `primitives/math/treemap.ts` — squarify (for future TreemapV2)
- `primitives/svg/ChartFrame.tsx` — `role="img"`, `aria-label`, keyboard nav, `<ChartDataTable>` integration
- `primitives/svg/GridLines.tsx` — orientation-driven, `dash="2 4"` default, `zeroAxisAt` baked
- `primitives/svg/AxisTicksHTML.tsx` — HTML-overlay tick labels, Geist Mono `tnum`/`cv11`
- `primitives/svg/Tooltip.tsx`, `LinePath.tsx`, `AreaPath.tsx`, `AreaGradientDef.tsx`

### 3.2 Net new files for Bar V2 = 3 (not 5)

- **`primitives/svg/Axis.tsx`** — composes existing `AxisTicksHTML` + new tick-mark + axis-line layer; single component handles all 4 orientations via prop
- **`primitives/svg/CartesianFrame.tsx`** — plot-area `<g translate(margin.left, margin.top)>`; accepts `filterId` prop applied on inner `<g>` so one filter region covers all bars (mirrors donut single-region rule)
- **`primitives/svg/ReferenceLine.tsx`** — embossed-groove primitive per §2.5

Reuse as-is: `GridLines.tsx`, `AxisTicksHTML.tsx`, `ChartFrame.tsx`, `Tooltip.tsx`, scale layer.

Barrel: export through existing `primitives/svg/index.ts` (already re-exported via `primitives/index.ts`). No new `_shared/index.ts` entries.

### 3.3 Scale library — KEEP d3-scale

Reject PD's «pure functions ~2kb vs 8kb» recommendation:
- d3-scale already in repo behind hexagonal `Scale<T>` / `BandScale` port; cost paid
- 4 of 6 successor charts hard-require `scaleTime` (Line/Area/Calendar) and `nice()` (Waterfall) — reimpl is non-trivial (~600 LOC for time-tick selection across day/week/month/year)
- Tree-shake target ~10kb gz shared across 7 charts; 6kb savings re-pays itself in the first time-axis bug
- Port already insulates call sites — future swap touches only `scale.ts`

### 3.4 Component shape — single Axis

`<Axis orientation="bottom"|"left"|"top"|"right">` (single component, not split XAxis/YAxis):
- `GridLines` and `AxisTicksHTML` already use `orientation` prop — internally consistent
- Bar V2 + 5 successors: one X (band, bottom) + one Y (linear, left). Two-component split would force every chart to import both files
- Type narrowing on the `orientation` literal gives full IDE help

### 3.5 CartesianFrame contract

Owns ONLY the plot-area `<g>` with margin translate, NOT the outer `<svg>`. The outer `<svg>` and a11y/role concerns stay with `<ChartFrame>` (already shipped). Composition order:

```
ChartCard
  > ChartFrame (role="img", aria-label, keyboard nav)
    > svg
      > defs (EditorialBevelFilter, gradients)
      > CartesianFrame (translate margin)
        > GridLines + bars + ReferenceLine + Axis(x) + Axis(y)
```

Three layers, three responsibilities, no overlap. Bar V2 adopts this composition (cleaner than DonutV2's inline role/aria — track DonutV2 cleanup as TD).

---

## 4. Token requirements

> Right-Hand synthesis.

### 4.1 Existing tokens (verified)

- `--chart-categorical-{1..5}-{base,top,bottom}` — emitted by donut work (commit `00d046e`); consumed by Bar V2 for fills.
- `--axis-label`, `--axis-tick`, `--card`, `--ink`, `--bg` — already in `packages/design-tokens/tokens/semantic/{light,dark}.json`.

### 4.2 Tokens needed for embossed groove (potentially missing)

- `--ink-shadow-soft` — used for the dark line of the groove
- `--card-highlight` — used for the cream-tinted light line

**Action at impl-time:** verify presence in `tokens/semantic/{light,dark}.json`. If absent, add with values per §2.5 fallback. Otherwise reference existing.

### 4.3 No new editorial-mh3 tokens

Bar V2 reuses slot 1 (cocoa) + slot 4 (wine) only. No new color primitives or semantic aliases.

---

## 5. Component contract

> Authored by **frontend-engineer**, 2026-04-30.

### 5.1 `BarChartV2` — props + behavior

```typescript
export interface BarChartV2Props {
  payload: BarChartPayload;
  height?: number;        // default 180 (matches V1)
  className?: string;     // forwarded to ChartFrame
}
```

**Dispatch on `orientation`.** A single component owns both axes; an internal `isHorizontal = payload.orientation === 'horizontal'` flag selects the band/linear scale assignment, gradient direction, and bar-rect mapping.

**`colorBySign` resolves slice fill.** Each bar gets `fill={url(#bar-grad-${slot}-${gradientIdScope})}`:
- `colorBySign === false` → all bars use slot `1` (cocoa)
- `colorBySign === true` → `slot = d.y >= 0 ? 1 : 4` (cocoa positive / wine negative)

`<defs>` emits exactly the slots actually referenced (1 or {1,4}) — id-keyed by `gradientIdScope = useId()`.

**Backend dispatch barrel.** `chart-backend-dispatch` reads `process.env.NEXT_PUBLIC_PROVEDO_CHART_BACKEND`. Default → V1 BarChart (Recharts). When flag is `primitives` → BarChartV2. Both kept exported during cutover.

### 5.2 New primitives — props + render contract

```typescript
// primitives/svg/Axis.tsx
export interface AxisProps {
  orientation: 'top' | 'right' | 'bottom' | 'left';
  scale: Scale<number, number> | BandScale<string | number>;
  ticks?: Array<{ value: string | number; label: string }>;
  transform?: string;       // SVG translate; caller positions
  hideBaseline?: boolean;
  className?: string;
}
```
Renders `<g>` with optional baseline `<line>`, per-tick `<line>` + `<text>`. Tick text uses `--axis-label` color + 10px font.

```typescript
// primitives/svg/CartesianFrame.tsx
export interface CartesianFrameProps {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  children: (dims: { innerWidth: number; innerHeight: number }) => ReactNode;
  filterId?: string;        // applied on inner <g> as filter={url(#id)}
}
```
Renders `<g transform="translate(margin.left, margin.top)" filter={...}>` exposing `innerWidth`/`innerHeight` to children via render-prop. Stateless (no context). Caller treats `(0,0)` as inner top-left.

```typescript
// primitives/svg/ReferenceLine.tsx
export interface ReferenceLineProps {
  orientation: 'horizontal' | 'vertical';
  position: number;          // pixel coord in inner-rect space
  innerWidth: number;
  innerHeight: number;
  label?: { text: string; align?: 'start' | 'end' };
}
```
Renders embossed groove (2 stacked `<line>`) per §2.5. Optional `<text>` 10px `--axis-label`. Caller converts payload-space value (typically `0`) to pixel-space via the appropriate scale.

### 5.3 BarChartV2 internal render structure

```tsx
<ChartCard>
  <ChartFrame width={W} height={height} payload={payload} testId="chart-bar"
              className={className} keyboardNav={{ dataLength, onIndexChange }}>
    <svg width={W} height={height} aria-hidden focusable="false">
      <EditorialBevelFilter id={`bar-bevel-${gradientIdScope}`} theme={themeMode} />
      <defs>
        {usedSlots.map(slot => (
          <linearGradient
            id={`bar-grad-${slot}-${gradientIdScope}`}
            x1={isHorizontal ? '0' : '0'}
            y1={isHorizontal ? '0' : '0'}
            x2={isHorizontal ? '1' : '0'}
            y2={isHorizontal ? '0' : '1'}>
            <stop offset="0%"   stopColor={`var(--chart-categorical-${slot}-top)`} />
            <stop offset="100%" stopColor={`var(--chart-categorical-${slot}-bottom)`} />
          </linearGradient>
        ))}
      </defs>
      <CartesianFrame width={W} height={height} margin={MARGIN}
                      filterId={undefined /* filter goes on bar group, not whole frame */}>
        {({ innerWidth, innerHeight }) => (
          <>
            <GridLines orientation={isHorizontal ? 'vertical' : 'horizontal'} ... />
            <g filter={`url(#bar-bevel-${gradientIdScope})`}>
              {bars.map(b => <BarRect key={b.key} {...b} hovered={hover === b.key} />)}
            </g>
            {payload.referenceLine && <ReferenceLine ... />}
            <Axis orientation={isHorizontal ? 'left' : 'bottom'} scale={categoryScale} />
            <Axis orientation={isHorizontal ? 'bottom' : 'left'} scale={valueScale} hideBaseline />
          </>
        )}
      </CartesianFrame>
    </svg>
  </ChartFrame>
  {isDriftBar(payload) && <DriftCaption />}
</ChartCard>
```

### 5.4 `useHoverScale` hook

Located at `packages/ui/src/charts/_shared/useHoverScale.ts`:

```typescript
export const HOVER_SCALE_THRESHOLD_PX = 12;
export const HOVER_SCALE_FACTOR = 1.06;

export function useHoverScale(barDimensionPx: number): {
  scale: number;
  threshold: number;
  enabled: boolean;
} {
  const reduced = useReducedMotion();
  const enabled = barDimensionPx >= HOVER_SCALE_THRESHOLD_PX && !reduced;
  return {
    scale: enabled ? HOVER_SCALE_FACTOR : 1,
    threshold: HOVER_SCALE_THRESHOLD_PX,
    enabled,
  };
}
```

`BarRect` consumes `scale` only when `hovered`, applied as `transform={`scale(${hovered ? scale : 1})`}` with `transform-origin: center`. `barDimensionPx = min(width, height)` so razor-thin bars don't pop.

### 5.5 Drift caption upgrade

```tsx
<div data-testid="chart-bar-drift-caption"
     className="mt-3 pt-3 px-3 border-t"
     style={{
       borderTopColor: 'var(--ink-shadow-soft)',
       boxShadow: 'inset 0 1px 0 var(--card-highlight)',
     }}>
  <div className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1"
       style={{ fontVariantCaps: 'small-caps' }}>
    Drift
  </div>
  <p className="text-xs text-text-secondary leading-relaxed">{DRIFT_CAPTION}</p>
</div>
```

V1 detection logic (`isDriftBar(payload)` checking `meta.subtitle.includes('drift')`) preserved verbatim.

### 5.6 Callouts

**A11y.** ChartFrame composition closes pre-QA findings (`role=img`, aria, tabIndex, keyboard nav, transcript, live region — all owned upstream). BarV2 passes `keyboardNav={{ dataLength: payload.data.length, onIndexChange }}` and consumes `data-active-index`. Inner `<svg>` is `aria-hidden`.

**Filter-id uniqueness.** Every gradient + filter id suffixed with `gradientIdScope`. Multiple BarV2 instances on one page → zero `<defs>` collisions.

**Sign-coloured + scale 1.06.** `transform: scale(1.06)` is colour-neutral. `transform-origin: center` is computed in the bar's local frame — positive (anchored bottom) and negative (anchored top, vertical layout) bars expand symmetrically about visual centre.

---

## 6. Tests

> Authored by **qa-engineer**, 2026-04-30. Synthesis edits: ReferenceLine assertions corrected to embossed-groove (2 stacked lines), not dashed (PD-locked per §2.5).

### 6.1 Unit tests (Vitest, happy-dom)

**`packages/ui/src/charts/__tests__/BarChartV2.test.tsx`** — coverage ≥85% statement / ≥80% branch
- `data-chart-backend="primitives"` on `[data-testid="chart-bar"]`
- One bar per `payload.data[]` entry; `data-bar-key` matches each `CategoryPoint.key`
- `orientation="vertical"` (default) bars grow Y; `horizontal` bars grow X
- `colorBySign={true}` → slot 1 for `value >= 0`, slot 4 for `value < 0` (mixed-sign fixture)
- `colorBySign={false}` → all bars use slot 1 gradient (per-bar `<linearGradient id^="bar-grad-">`, 2 stops at 0%/100%, var refs `--chart-categorical-{1|4}-{top,bottom}`)
- `diverging={true}` renders zero-baseline `<line>` + bars on both sides
- `referenceLine={value, label}` renders `<ReferenceLine>` with caption
- Drift caption renders when `isDriftBar(payload) === true` (via `meta.subtitle.includes('drift')`)
- `<EditorialBevelFilter>` mounts with `filter[id^="bar-bevel-"]`; `<g filter="url(#bar-bevel-…)">` wraps bar group
- A11y: `role="img"`, `aria-label`, `aria-describedby` resolves to ChartDataTable transcript, `tabIndex=0`, focus ring class
- Empty `data: []` renders without throwing

**`packages/ui/src/charts/primitives/svg/__tests__/Axis.test.tsx`** — ≥90%
- Correct tick count for given scale domain
- 4 orientations position ticks/labels correctly (assert `transform` / `x` / `y`)
- Label formatter applied
- `hideBaseline=true` suppresses baseline line

**`packages/ui/src/charts/primitives/svg/__tests__/CartesianFrame.test.tsx`** — ≥90%
- Renders `<g transform="translate(margin.left, margin.top)">`
- Render-prop receives correct `innerWidth`/`innerHeight` (width/height minus margins)
- `filterId` prop applies as `filter={url(#…)}` on inner `<g>` when supplied; absent when not

**`packages/ui/src/charts/primitives/svg/__tests__/ReferenceLine.test.tsx`** — ≥90%
- Renders **2 stacked `<line>` elements** (embossed groove, NOT dashed) — first at `position`, second at `position + 1`
- First line `stroke="var(--ink-shadow-soft)"`, second `stroke="var(--card-highlight)"`
- `label` text rendered as `<text>` when provided; absent when not

**`packages/ui/src/charts/_shared/__tests__/useHoverScale.test.tsx`** — ≥90%
- `barDimensionPx >= 12 && !reducedMotion` → `scale: 1.06`, `enabled: true`
- `barDimensionPx < 12` → `scale: 1`, `enabled: false`
- `prefersReducedMotion === true` → `scale: 1` regardless of dim

### 6.2 Visual snapshots (Playwright, Chromium-only)

Replace `apps/web/playwright-tests/charts/__screenshots__/chart-bar-{light,dark}.png`. Add interaction baselines if showcase exposes states: `chart-bar-{light,dark}-hover-{slice1}.png`, `chart-bar-{light,dark}-focus-{slice1}.png`. `chart-bar-colorbysign-{light,dark}.png` if showcase fixture present.
Tolerance: existing `maxDiffPixelRatio: 0.001`. Acceptance: PD or Right-Hand approves baseline replacement diff in PR review.

### 6.3 A11y (axe-core)

Extend `apps/web/playwright-tests/charts/charts.a11y.spec.ts` — add 2 tests scanning `[data-testid="chart-bar"]` sub-tree (light + dark). Zero violations expected.

### 6.4 Test infrastructure

Verify `_shared/fixtures.ts` has `BAR_FIXTURE`. If absent, add: ~6 `CategoryPoint` entries (3 positive / 2 negative / 1 zero); variants for `referenceLine` + `diverging` modes.

### 6.5 Out of scope

- No E2E (interactions covered in unit + visual)
- No performance benchmarks (filter cost negligible vs donut; defer to TD if jank)
- No cross-browser visual (Chromium-only per existing config)

---

## 7. Rollout

> Authored by **tech-lead**, 2026-04-30.

### 7.1 Coexistence pattern

V1 `BarChart.tsx` stays. V2 lives at `BarChartV2.tsx`. Barrel `packages/ui/src/charts/index.ts` wires both via the existing dispatch helper:

```diff
// packages/ui/src/charts/index.ts
+ import { BarChart as BarChartV1, type BarChartProps } from './BarChart';
+ import { BarChartV2, type BarChartV2Props } from './BarChartV2';
- export { BarChart, type BarChartProps } from './BarChart';
+ export const BarChart = makeBackendDispatch<BarChartProps, BarChartV2Props>(
+   BarChartV1, BarChartV2, 'BarChart',
+ );
+ export type { BarChartProps } from './BarChart';
+ export { BarChartV2, type BarChartV2Props } from './BarChartV2';
```

V1 renders on server + first paint; `useEffect` upgrades to V2 when `getActiveBackend() === 'primitives'`. V1 silently drops V2-only props at destructure (Liskov-safe).

**Implementation note (RH):** verify `makeBackendDispatch` exists in `_shared/chart-backend-dispatch.tsx`. If pattern differs (e.g. helper has different signature), adapt to whatever pattern Sparkline / Donut already use.

### 7.2 PR commit sequence

Atomic single PR, conventional-commits, each commit a valid revert point:

1. `feat(charts): add Axis + CartesianFrame + ReferenceLine svg primitives + tests`
2. `feat(charts): add useHoverScale hook + test`
3. `feat(charts): BarChartV2 component (functional, V1 unaffected)`
4. `test(charts): BarChartV2 unit + structure assertions`
5. `feat(charts): wire BarChart dispatch to V1/V2 in barrel`
6. `test(charts): refresh BarChart visual baselines (light + dark)`
7. `test(charts): axe-core a11y baseline for BarChart on /design-system`
8. `docs(charts): bar-chart-v2 spec + DECISIONS entry`
9. `chore(td): TD-NNN retire V1 BarChart.tsx post-full-migration`

Commits 1–4 V2-only and shippable without dispatch wiring. Commit 5 flips public export.

### 7.3 Rollback

`git revert <merge-sha>` (or revert commit 5 alone) restores V1-only barrel export. Files `BarChartV2.tsx`, primitives, hook, tests stay on disk as orphaned modules — unreferenced from barrel, tree-shaken from apps/web bundle.

Partial rollback paths:
- V2 broken in primitives backend only: unset `NEXT_PUBLIC_PROVEDO_CHART_BACKEND` in `apps/web/.env.local`. Dispatcher falls through to V1.
- Specific commit (e.g. visual baseline drift): `git revert <sha>` of that commit; rest stays.

### 7.4 Showcase verification (manual, pre-PR-review)

- [ ] `pnpm --filter @investment-tracker/ui build` → 0 type errors
- [ ] `pnpm --filter @investment-tracker/ui test charts` → all green
- [ ] `pnpm --filter @investment-tracker/web dev` → `/design-system#charts` renders
- [ ] BarChart visible in light + dark; axes, grid, reference lines correct
- [ ] Theme toggle: no flicker, no hydration mismatch in console
- [ ] Hover any bar: scale + tooltip behave per spec
- [ ] Keyboard tab through bars: focus ring visible
- [ ] Set `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=recharts` → confirm V1 still renders identically
- [ ] DevTools → no Recharts internals when flag=primitives
- [ ] `pnpm --filter @investment-tracker/web test:a11y` → zero violations

### 7.5 V1 retirement TD

Add to `docs/TECH_DEBT.md`:

> **TD-NNN — Retire V1 chart implementations post-full-migration**
> **Priority:** P3. **Trigger:** all 7 V2 ports landed (Sparkline ✓, Donut ✓, Bar, Line, Area, Treemap, Calendar) AND `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives` is the locked default in all consumers. **Action:** delete V1 chart files; remove `makeBackendDispatch` calls; barrel exports V2 directly. Drop Recharts dep from `packages/ui/package.json`.

---

## 8. Specialist sign-offs

| Specialist | Role | Status | Date | Artifact |
|---|---|---|---|---|
| product-designer | §2 Visual treatment | ✅ authored | 2026-04-30 | `.superpowers/brainstorm/.../bar-v2-section-2-pd.md` (transcript) |
| architect | §3 Architecture / framework | ✅ authored | 2026-04-30 | `.superpowers/brainstorm/.../bar-v2-section-3-architect.md` (transcript) |
| frontend-engineer | §5 Component contract | ✅ authored | 2026-04-30 | `.superpowers/brainstorm/.../bar-v2-section-6-fe.md` |
| qa-engineer | §6 Tests | ✅ authored | 2026-04-30 | `.superpowers/brainstorm/.../bar-v2-section-8-qa.md` |
| tech-lead | §7 Rollout | ✅ authored | 2026-04-30 | `.superpowers/brainstorm/.../bar-v2-section-9-tl.md` |
| brand-strategist | not needed (no brand-floor amendment) | — | — | — |
| finance-advisor | not needed (palette stays in editorial-mh3 envelope; wine for negative is already palette-internal) | — | — | — |

All blocking specialist sign-offs done.

---

## 9. Open questions / TDs

1. **`makeBackendDispatch` helper presence.** Tech-lead assumed it exists in `_shared/chart-backend-dispatch.tsx`. Verify at impl-time (commit 5 of PR sequence). If absent, adopt whatever pattern Sparkline/Donut already use for V1/V2 dispatch.
2. **`--ink-shadow-soft` and `--card-highlight` tokens.** Verify presence in design-tokens at impl-time. Add if missing; fallback values per §4.2.
3. **DonutV2 inline a11y → ChartFrame composition.** TD-NNN: refactor DonutChartV2 to use `ChartFrame` composition (same pattern as BarV2). Currently DonutV2 inlines `role=img`/`aria-label`/`tabIndex` directly. Defer to follow-up PR.
4. **Future `colorByCategory` prop.** When multi-series Bar use case emerges, add prop to opt into 5-slot palette cycling. Not blocking.
5. **Hover scale on horizontal bars with very short width.** `useHoverScale` uses `min(width, height)` — short horizontal bars (<12px height) won't scale. Verify visually; if too restrictive, could use `max(width, height)` for horizontal-specific path.
6. **Showcase BAR_FIXTURE coverage.** May need additional fixtures in `_shared/fixtures.ts` for visual baselines (drift variant, colorBySign variant, diverging variant).

---

## 10. Synthesis decisions

Right-Hand resolved 4 conflicts / clarifications between specialist outputs:

1. **ReferenceLine style (QA «dashed» vs PD «embossed groove»):** PD locked embossed groove (§2.5). QA test assertion text edited in §6.1 to verify 2 stacked `<line>` elements (not dashed pattern).
2. **CartesianFrame innerWidth/innerHeight pattern (FE «render-prop» vs architect silent):** locked **render-prop** per FE — stateless, simpler, no context boundary.
3. **Drift caption trigger (QA «when referenceLine.label provided» vs V1 logic):** preserved V1 detection (`isDriftBar(payload)` checking `meta.subtitle.includes('drift')`). QA's «vs benchmark» framing was a misread; trigger remains V1's. Visual upgrade to paper-press block per PD/FE.
4. **`BarChartV2Props` shape (FE simple `{payload, height, className}` vs tech-lead `extends BarChartProps`):** locked FE's interface. Tech-lead's «extends» framing was conceptual («same shape + V2-only optionals»); FE's interface is canonical.

---

## Appendix — superseded references / specialist artifacts

**Specialist authored sections** (`.superpowers/brainstorm/1340-1777534401/state/`):
- `bar-v2-section-6-fe.md` — frontend-engineer authored
- `bar-v2-section-8-qa.md` — qa-engineer authored
- `bar-v2-section-9-tl.md` — tech-lead authored

**PD audit** (transcript in tools output, not file): visual treatment, design tensions, recommendations.
**Architect audit** (transcript): framework architecture, scale library decision, CartesianFrame contract.
