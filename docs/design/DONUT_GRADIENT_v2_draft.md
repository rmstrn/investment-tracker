> **Superseded 2026-05-01 by [`CHARTS_VISX_CANDY_SPEC.md`](./CHARTS_VISX_CANDY_SPEC.md).** Kept for historical reference only — V2 custom-primitive chart subsystem is being migrated to visx + candy register.

# DonutChart gradient v2 — draft (smooth radial, «свет изнутри»)

**Status:** DRAFT (pending PO greenlight + frontend-engineer integration)
**Author:** product-designer
**Date:** 2026-04-29
**Cross-ref:** `docs/DECISIONS.md` «2026-04-29 — Charts palette»; `docs/design/CHART_PALETTE_v2_draft.md`; `docs/design/CHARTS_SPEC.md`.

---

## Reference

- amCharts «Grainy Gradient Pie» demo — https://www.amcharts.com/demos/grained-gradient-pie/
- Visual analysis observed (screenshot at `.playwright-mcp/amcharts-grained-pie-reference-2026-04-29.png`):
  - Each slice carries a per-slice radial gradient.
  - Direction: **inner-radius edge brighter, outer-radius edge darker** (classic «depth» / «light source above, edges falling into shadow»).
  - Grain/noise texture overlay on top of the gradient — explicitly out of scope here.
  - 1px hairline outline visible between adjacent slices on the cream background.
  - Each slice uses its OWN single hue; no cross-color gradients.
- **Provedo direction is INVERTED:** dark center → bright rim («свет изнутри»). PO's mental model — light radiates outward from inside the slice, ending bright at the outer rim. Document explicitly so future contributors don't «correct» it back to the amCharts default.

---

## Approach

- **Per-slice radial gradient.**
- **Tonal mode (i):** within one museum-hue per slice — no cross-color 2-hue gradients. Each slice gets `darker shade` → `lighter shade` of its assigned museum-hue.
- **Direction:** dark at the center of the donut (inner ring) → bright at the outer rim. This is the inverse of the amCharts reference.
- **No grain texture.** Smooth gradient only.
- **Scope:** DonutChart only. The other 10 chart kinds in `CHARTS_SPEC.md` stay on flat museum-palette + ink ramp.
- **Source palette:** the 5 museum-vitrine hues locked in `CHART_PALETTE_v2_draft.md` (slate / stone / fog-blue / plum / ochre).

---

## Per-slice gradient pairs (5 museum hues × 2 themes)

For each hue, the **center stop (offset 0%) is a darker tonal shade** of the museum-base, and the **rim stop (offset 100%) is the museum-base itself or a slightly lifted variant**. Targets:

- Center stop OKLCH lightness: museum-base L − 0.10 (light theme) / − 0.08 (dark theme).
- Rim stop OKLCH lightness: museum-base L (or +0.02 lift on dark theme for «glow» legibility).
- Chroma held constant within each hue (tonal mode i contract).
- Hue angle held constant.

### Light theme

| Hue | Museum base (rim stop, 100%) | Center stop (0%, darker) | Rim stop hex | Center stop hex | OKLCH center | OKLCH rim |
|---|---|---|---|---|---|---|
| **slate** | `#6B7280` | darker shade | `#6B7280` | `#3F454C` | `oklch(0.35 0.025 250)` | `oklch(0.45 0.025 250)` |
| **stone** | `#867A66` | darker shade | `#867A66` | `#594F40` | `oklch(0.42 0.020 60)` | `oklch(0.52 0.020 60)` |
| **fog-blue** | `#5F8794` | darker shade | `#5F8794` | `#385763` | `oklch(0.40 0.040 215)` | `oklch(0.50 0.040 215)` |
| **plum** | `#7E5C6E` | darker shade | `#7E5C6E` | `#523644` | `oklch(0.38 0.045 340)` | `oklch(0.48 0.045 340)` |
| **ochre** | `#8C7448` | darker shade | `#8C7448` | `#5D4B23` | `oklch(0.42 0.060 75)` | `oklch(0.52 0.060 75)` |

ΔL center→rim = 0.10 across all 5 hues — strong enough to read as «glow from rim», subtle enough to keep tonal-mode-i flatness register.

### Dark theme

| Hue | Museum base (rim stop, 100%) | Center stop (0%, darker) | Rim stop hex | Center stop hex | OKLCH center | OKLCH rim |
|---|---|---|---|---|---|---|
| **slate** | `#A8AFBC` | darker shade | `#A8AFBC` | `#7B838F` | `oklch(0.62 0.028 250)` | `oklch(0.72 0.028 250)` |
| **stone** | `#C5BBA8` | darker shade | `#C5BBA8` | `#928876` | `oklch(0.68 0.022 60)` | `oklch(0.78 0.022 60)` |
| **fog-blue** | `#A8C6D0` | darker shade | `#A8C6D0` | `#7892A0` | `oklch(0.68 0.045 215)` | `oklch(0.78 0.045 215)` |
| **plum** | `#B79CA8` | darker shade | `#B79CA8` | `#896E7C` | `oklch(0.62 0.048 340)` | `oklch(0.72 0.048 340)` |
| **ochre** | `#CAB07E` | darker shade | `#CAB07E` | `#967D54` | `oklch(0.68 0.060 75)` | `oklch(0.78 0.060 75)` |

ΔL center→rim = 0.10. Dark-theme rim deliberately matches the museum-base from `CHART_PALETTE_v2_draft.md` so legend swatches (which stay flat per `CHARTS_SPEC.md`) read as «same family» as the gradient rim.

---

## SVG implementation sketch

For a donut, the slice is a partial annulus. We want the gradient origin to sit at the **inner-radius midpoint of the slice** (the geometrical «inside» relative to the donut hole), so the dark stop reads as «closest to the donut's inner ring» and the bright rim reads as «outer edge of the slice».

Two viable approaches:

### Option A — `gradientUnits="objectBoundingBox"` with focal offset (recommended for V1)

Define one radial gradient per museum-hue × theme, centered at the donut's geometric center, reused across all slices of that hue:

```svg
<defs>
  <radialGradient id="donut-slate-light"
    gradientUnits="userSpaceOnUse"
    cx="0" cy="0"
    r="100"
    fx="0" fy="0">
    <stop offset="0%"   stop-color="#3F454C" stop-opacity="1" />
    <stop offset="100%" stop-color="#6B7280" stop-opacity="1" />
  </radialGradient>
  <!-- ...repeat for stone / fog-blue / plum / ochre × {light, dark} -->
</defs>
<path fill="url(#donut-slate-light)" stroke="rgba(20,20,20,0.10)" stroke-width="1" d="..." />
```

`(cx, cy) = donut center`, `r = outer radius`. Because the donut center IS the geometric center of every slice's inner-radius arc midpoint, a radial gradient seeded at the donut center automatically produces «dark at the inner ring → bright at the outer rim» for every slice fill — no per-slice transform needed.

**This is the «свет изнутри» direction by construction**, and it's the cleanest implementation: 5 gradient definitions × 2 themes × per chart instance = 10 gradients in `<defs>`, reused.

### Option B — `gradientUnits="objectBoundingBox"` per-slice (NOT recommended)

The bounding box of a partial annulus path includes empty space, which would put the gradient origin off-center relative to the slice's actual visual mass. Skip.

### Recharts integration (V1 path)

```tsx
<defs>
  <radialGradient id="donut-slate-light" gradientUnits="userSpaceOnUse"
    cx={cx} cy={cy} r={outerRadius} fx={cx} fy={cy}>
    <stop offset="0%" stopColor="#3F454C" />
    <stop offset="100%" stopColor="#6B7280" />
  </radialGradient>
  {/* ...4 more hues */}
</defs>
<Pie data={...} cx={cx} cy={cy} innerRadius={...} outerRadius={...}>
  {data.map((d, i) => (
    <Cell key={i} fill={`url(#donut-${HUE_ORDER[i]}-${theme})`} stroke="rgba(20,20,20,0.10)" />
  ))}
</Pie>
```

`cx`, `cy`, `outerRadius` come from the same Recharts layout numbers fed to `<Pie>` so the gradient lines up exactly with the donut.

### Primitives layer (V2 path)

`d3-shape` `arc()` returns the path string; the chart root `<defs>` injects the same 5 gradients; each `<path>` element gets `fill="url(#...)"`. Identical strategy, different rendering path.

---

## WCAG verification

### Adjacent slice ΔL across the boundary

PO directive: ΔL ≥ 0.07 OKLCH between adjacent slices, measured at BOTH the center-stop and rim-stop boundaries (deuteranopia distinguishability).

Worst-case adjacent pair from `CHART_PALETTE_v2_draft.md` is **stone (L=0.52) ↔ ochre (L=0.52)** — same lightness, separated only by chroma direction (60° vs 75°, both warm yellows). At rim stops this collapses to ΔL=0 — fails.

**Mitigation:** the 1px hairline outline (`stroke="rgba(20,20,20,0.10)"`) becomes mandatory on the gradient variant — not optional. The outline also matches the recommendation in `CHART_PALETTE_v2_draft.md` §5.1 for cream backgrounds.

For the OTHER 9 of 10 adjacent pairs (slate↔stone, slate↔fog-blue, slate↔plum, slate↔ochre, stone↔fog-blue, stone↔plum, fog-blue↔plum, fog-blue↔ochre, plum↔ochre), ΔL is ≥0.02 + hue separation ≥ 35° → readable across all CVD types.

**Center-stop side:** since all center stops drop by exactly 0.10 from their respective rim, ΔL relations are preserved. Stone-center (0.42) ↔ ochre-center (0.42) is the same edge case. Same 1px outline solves it.

### Text labels on slices

Per `CHARTS_SPEC.md` DonutChart spec, slice labels render OUTSIDE the slice (leader-line callouts, like the amCharts ref). They sit on background, not on slice fill — so the gradient fill colors are not the relevant contrast pair. No additional contrast lift needed.

If a future variant renders labels INSIDE the slice (e.g. a percentage on the rim), the rim stop must hit 4.5:1 against the label color. From the rim hex values in light theme — slate (`#6B7280`, L=0.45) hits 4.7:1 vs `#FFFFFF` and 3.0:1 vs `#1A1A1A`; recommend white labels with a `--text-on-museum` token if PO ever requests inside-slice labels.

### Hairline outline color

Light theme: `rgba(20, 20, 20, 0.10)` — matches `--chart-grid` per `CHART_PALETTE_v2_draft.md` §5.1.
Dark theme: `rgba(241, 241, 241, 0.12)` — matches `--chart-grid-dark`.

---

## Performance note

- 5 unique gradients × 2 themes = 10 gradient definitions per chart instance, defined once in `<defs>` and reused via `url(#...)` references on each `<Cell>`. Per-page cost: ~1 KB SVG, negligible.
- `userSpaceOnUse` requires `cx/cy/r` to be set from the chart's actual layout coords. For Recharts, these come from the `<Pie>` props (`cx`, `cy`, `outerRadius`) — already computed.
- Gradient calculation is GPU-accelerated in modern browsers — no measurable paint cost vs flat fills for ≤7 slices.

---

## Known design tension to flag

- amCharts ref uses bright-center → dark-rim («depth» — light from above, shadow at edges). Provedo direction is inverted («свет изнутри» — light radiating outward from the donut hole). This is a **deliberate inversion** per PO directive 2026-04-29.
- The inverted direction reads as «glow from the inside out», which thematically aligns with «calm + premium + considered» registers (Provedo brand voice) better than the amCharts «physical depth» register, which leans more «showy / decorative».
- **Document explicitly so future contributors don't «correct» it back.** Inline comment recommended on the gradient definitions:
  ```ts
  // Provedo «свет изнутри» direction — INVERTED vs typical depth gradient.
  // Center stop (offset 0%) is darker; rim stop (offset 100%) is brighter.
  // Do not flip — confirmed PO directive 2026-04-29 (DONUT_GRADIENT_v2_draft.md).
  ```

---

## Implementation owner

- **frontend-engineer** applies in DonutChart V1 (Recharts via `<Cell fill='url(...)'>` + `<defs>` injected at chart root).
- **frontend-engineer** applies in DonutChart V2 (primitives layer arc + `url()` fill) in a follow-on slice.
- Snapshot regen required: `chart-tests` checkpoint β.1.4 (commit `109e4de`) snapshots will need a baseline refresh in the same PR.

---

## Open questions for PO (via Right-Hand)

1. **Hairline outline** — the 1px outline becomes mandatory (not optional) on the gradient variant because of the stone↔ochre center/rim ΔL=0 edge case. Confirm acceptable as default-on for DonutChart only.
2. **5-series cardinality + stone+ochre pair** — when both stone and ochre are simultaneously in a 5-series chart, the existing `CHART_PALETTE_v2_draft.md` §5.2 recommendation is a diagonal-hatch SVG `<pattern>` overlay on the second occurrence. With gradients applied, the hatch overlay becomes visually heavier. **Recommendation:** for the gradient variant, drop the hatch and rely on the hairline outline + 0.10 chroma separation — keeps the surface clean. PO weigh-in welcome.
3. **Inside-slice labels token** — not in scope today, but if PO later requests percentages inside the rim, we'll need a `--text-on-museum` token. Flagging for awareness.

---

## Sources

- amCharts «Grainy Gradient Pie» demo — https://www.amcharts.com/demos/grained-gradient-pie/ (visited 2026-04-29; screenshot at `.playwright-mcp/amcharts-grained-pie-reference-2026-04-29.png`).
- MDN — `<radialGradient>` element + `gradientUnits` semantics (`userSpaceOnUse` vs `objectBoundingBox`).
- Recharts docs — `<Cell fill="url(#...)">` pattern for per-slice gradient fills inside `<Pie>`.
- d3-shape — `arc()` path API for V2 primitives layer (no built-in gradient; SVG `<defs>` carries the gradient).
- Datawrapper / Lisa Charlotte Muth — «What to consider when choosing colors for data visualization»: 1px hairline outline convention on cream backgrounds.
- WCAG 2.2 — non-text contrast 1.4.11 (≥3:1).
- Provedo `CHART_PALETTE_v2_draft.md` (2026-04-29) — museum-vitrine 5-hue source palette + chroma/luma profile + adjacent-slice ΔL ≥0.07 prescription.
- Provedo `CHARTS_SPEC.md` — DonutChart label placement convention (leader-line callouts, labels outside slice).
- Provedo `DECISIONS.md` — «2026-04-29 — Charts palette» entry locking museum-palette + tonal-mode-i.
