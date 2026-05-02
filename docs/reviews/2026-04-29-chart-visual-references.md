# Chart visual references — 2026-04-29

PO-supplied references for the custom SVG primitives layer (Phase α.2). Use these to inform `<DonutSegment>`, `<Tooltip>`, `<Bar>`, animation hooks. NOT runtime dependencies — visual inspiration only.

## Reference 1 — Chart.js Polar Area with centered point labels

URL: https://www.chartjs.org/docs/latest/samples/other-charts/polar-area-center-labels.html
License: MIT (Chart.js OSS).
Status: visual inspiration; we do NOT take Chart.js as a dep.

### Patterns to port into our primitives

- **`centerPointLabels: true`** — labels positioned inside the slice angular center, not on the outer edge. Cleaner than radial leader lines. Apply as opt-in prop on `<DonutSegment>` / future polar-area primitive: `labelPosition: 'center' | 'outside' | 'inside'`.
- **Semi-transparent fill** (~50% opacity) — per-slice colors with reduced alpha. Provedo equivalent already exists via `fillOpacityForTreemapChange()` (4-band ladder); reuse the pattern for polar / donut emphasis modes.
- **Radial segments emanating from center** — pure SVG `<path>` arcs. Our existing «donut as ring of `<circle stroke-dasharray>`» pattern (per plugin architect R2) handles this efficiently for donut; for polar area (radius varies per segment), need `arcPath()` from d3-shape with per-segment outerRadius.

### Prop additions for Phase α.2

```ts
type DonutSegmentProps = {
  startPct: number;     // 0..1
  endPct: number;       // 0..1
  outerRadius: number;
  innerRadius?: number;  // default 0.6 × outer (donut)
  colorVar: string;     // CSS-var
  fillOpacity?: number;  // 0..1, default 1
  cornerRadius?: number; // NEW — see Reference 2
  label?: ReactNode;
  labelPosition?: 'center' | 'outside' | 'leader-line';  // NEW — Chart.js pattern
};
```

## Reference 2 — amCharts Semi-Circle Pie Chart

URL: https://www.amcharts.com/demos/semi-circle-pie-chart/
License: amCharts is PROPRIETARY — **NOT a runtime dep** (per R1 no spend). Visual inspiration only.
Status: top-tier visual quality reference; we replicate concepts in our own code.

### Patterns to port

- **Configurable start/end angle** — semi-circle (0° → 180°) takes ~2× less vertical space than full circle. Useful for compact dashboards. Apply as optional props on `<DonutSegment>`:
  ```ts
  startAngleRadians?: number;  // default -π/2 (12 o'clock)
  endAngleRadians?: number;    // default 3π/2 (full circle)
  ```
  This unlocks semi-circle pie WITHOUT a separate chart kind — same primitive, different angle range.

- **Rounded corners on slices** — d3-shape's `.cornerRadius(N)` does exactly this; pass through to `arcPath()` wrapper. Wider than the static reference's «5×`<circle>`» pattern allows; for rounded corners, use `<path>` with d3-shape `.arc()`.
  - Decision: keep two paths in `<DonutSegment>` — fast path (5×`<circle>` for plain donut) + rounded path (`<path>` via d3-shape `.arc()` when `cornerRadius > 0`).

- **Smooth slice animation on load** — sweep from start to end angle (300ms ease-out-expo). Implement via `useStrokeDashoffset` hook (already planned in α.2 for line draw-in) extended to circle stroke-dashoffset.

### Visual quality bar (for Phase α.2 acceptance)

Our `<DonutSegment>` after α.2 should match amCharts visual quality on these dimensions:

1. Crisp segment edges (no anti-aliasing artifacts at 1× and 2× DPR)
2. Smooth load animation (no stutter, no path-morphing on data change)
3. Rounded corners optional but pixel-perfect when enabled
4. Center / inside / outside label positioning all clean
5. Semi-circle and full-circle and arbitrary-angle ranges all work

## Implications for Phase α.2

These references add to the existing R2 aggregate plan:

1. Extend `<DonutSegment>` API: `startAngleRadians`, `endAngleRadians`, `cornerRadius`, `labelPosition`.
2. Extend `<Tooltip>` consideration: amCharts shows compact mini-card on hover with leader-line. Our spec already has portal tooltip; add leader-line option for donut.
3. Animation library: `useArcSweep` hook (variant of `useStrokeDashoffset` for circular geometry).
4. Add `<PolarArea>` primitive in α.2 scope OR defer to Phase γ — radial bar variant where each segment has its own radius. Defer recommendation: not in current 10-chart catalog, add when AI agent emits polar-area payloads.

## Hard rules respected

- R1 — amCharts is paid; NOT a dep. Chart.js MIT — concepts free, NOT a dep either.
- R2 — N/A (internal reference doc).
- R4 — N/A.
- No velocity metrics in this doc.
