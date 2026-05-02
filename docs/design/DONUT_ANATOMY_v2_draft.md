> **Superseded 2026-05-01 by [`CHARTS_VISX_CANDY_SPEC.md`](./CHARTS_VISX_CANDY_SPEC.md).** Kept for historical reference only — V2 custom-primitive chart subsystem is being migrated to visx + candy register.

# DonutChart anatomy + interaction v2 — draft

**Status:** DRAFT (sibling to `DONUT_GRADIENT_v2_draft.md`, both pending PO greenlight + FE integration)
**Author:** product-designer
**Date:** 2026-04-29
**Cross-ref:** `docs/design/DONUT_GRADIENT_v2_draft.md` (color/gradient — sibling dispatch); `docs/DECISIONS.md` «2026-04-29 — Charts palette»; `docs/design/CHARTS_SPEC.md` §4.4; `packages/ui/src/charts/DonutChart.tsx` (V1, Recharts); `packages/ui/src/charts/DonutChartV2.tsx` (V2, primitives).

This draft covers shape, depth, animation, legend. Color and gradient direction are out of scope — see `DONUT_GRADIENT_v2_draft.md`.

---

## Source brief (filtered from amCharts «Grained Gradient Pie» AI prompt)

Verbatim prompt from PO:

> «Create a donut chart with a 270-degree arc displaying four countries (Lithuania 500, Czechia 300, Ireland 200, Germany 100) with a grainy texture overlay effect applied over gradient fills on each slice. Use a custom color palette of warm and neutral tones. Slices should have thin white borders and rounded corners, with subtle drop shadows that become more prominent on hover. Position a legend below the chart. Include a smooth animated sequential entrance on load. Use amCharts 5 library. Follow the coding rules and patterns at https://github.com/amcharts/amcharts5-skill».

### TAKE — within Provedo register
1. **270° arc as a variant.** Editorial pie shape, opens up «missing-wedge» for label callouts or center copy.
2. **Hairline borders** between slices and on the outer rim — paper-cut feel.
3. **Rounded corners** at slice ends — softens the hard wedge geometry.
4. **Drop shadow** — static subtle, hover lift. Reuses the chart-card paper-pressed neumorphism language.
5. **Hover interaction** — lift + shadow intensify. **Sister slices stay full opacity** (Provedo «no casino-trading register» rule).
6. **Sequential entrance animation** — clockwise sweep, ~600 ms total, ~100 ms stagger.
7. **Legend below** — flush left or under the missing wedge of 270° variant.

### DROP — explicitly out of scope
- **Grain texture overlay** — rejected by PO.
- **amCharts 5 library** — Provedo uses Recharts (V1) and custom primitives (V2). API spec is for our two backends, never amCharts.
- **Country sample data** — Provedo donut renders typed `DonutChartPayload` (asset class / sector / broker), already in `packages/shared-types`.
- **Warm-and-neutral palette** — locked museum-vitrine 5-hue (`docs/design/CHART_PALETTE_v2_draft.md`); covered by sibling PD dispatch.

---

## Anatomy

### Arc mode

New prop on both V1 and V2: `arcMode: 'full' | '270'` (default `'full'`).

V2 already exposes equivalent low-level controls (`startAngleRadians`, `endAngleRadians`); `arcMode` is a sugar layer that resolves to these:

| Mode  | Start angle | End angle | Sweep | Missing-wedge orientation |
|-------|-------------|-----------|-------|---------------------------|
| `full`  | `0`           | `2π`        | 360°  | none                      |
| `270` | `-3π/4` (≈ −135°) | `+3π/4` (≈ +135°) | 270°  | bottom — opens downward, 12 o'clock anchor |

Bottom-opening orientation is chosen so the missing 90° sits beneath the donut and naturally hosts either:
- the legend (when no center label is used), or
- a single editorial line of context («Total · $128,400 · 42 positions»).

When to apply `'270'`: opt-in via prop — the AI agent chooses based on whether a long callout / breakdown line should sit visually attached to the chart instead of above or beside it. Default stays `'full'` to not disrupt existing payload usage.

### Slice geometry

Existing spec stays:
- `outerRadius = size/2 - 4` (4px breathing room inside the bounding box).
- `innerRadius = outerRadius * 0.6` (donut, not pie).

**Corner radius (new):**
- Default token: `--chart-donut-corner` = **3 px** (proposed new semantic token).
- Cap rule (enforced in implementation): `effectiveR = min(specifiedR, ringWidth/2, sliceArcLengthAtCenterline/4)` — prevents «pinching» on thin slices below ~8% of total. Below cap, corner falls back to mitered with no rounding.
- d3-shape API: `arc().cornerRadius(N).innerRadius(...).outerRadius(...)`. Already wired through `packages/ui/src/charts/primitives/math/path.ts` `arcPath()` per V2 source.
- Recharts API: `<Pie cornerRadius={N}>`. Currently absent in V1 source (`DonutChart.tsx`). To add.

Visual trade-off: 3 px is aggressive enough to register as «soft» on a 220 px donut (~3% of outer radius) but small enough that 5%+ slices keep readable angular accuracy. The amCharts reference uses ~5–6 px on a much larger demo; scaled for our 220 px size, 3 px is the correct visual analogue.

### Slice borders (hairline)

- Stroke width: **1 px** with `vector-effect="non-scaling-stroke"` (so retina / high-DPI doesn't dilute or thicken).
- Stroke color token: **`var(--card)`**, **NOT** pure `#FFFFFF`. The Provedo light theme is cream paper, not stark white; using `--card` makes the hairline look like the slice was «cut from the paper», matching the design system's tactile-depth language.
- Dark theme: `--card` flips automatically via `[data-theme="dark"]`; stroke remains the surface color of whatever the donut sits on.
- The outer rim subtle ring already drawn at `outerR + 1` (in both V1 and V2) stays — it provides the «paper edge» when the donut sits on `--bg` instead of inside a `ChartCard`.

### Drop shadow

Two states. Both reuse existing semantic tokens — no new shadow tokens proposed.

**Static state (default):** **`var(--shadow-chart-card)`** applied to the donut's outer wrapper, NOT to individual slices. Reason: the donut as a whole reads as one «paper disc» sitting on the surface; per-slice shadows would create a cluttered Mexican-hat overlap effect that conflicts with the calm-analytical register.

**Hover state (active slice only):** SVG `filter` chain on the active `<path>`/`<circle>`:
```
filter: drop-shadow(0 1.5px 2px rgba(20, 20, 20, 0.12))
        drop-shadow(0 0 4px var(--accent-glow));
```
- First layer: directional micro-lift (`y=1.5px`, `blur=2px`, ink-tinted, 12% alpha) — emulates the slice physically rising off the disc.
- Second layer: existing `--accent-glow` rim (already in V2 active state) — keeps the focus-state language consistent with the rest of the design system.

The first layer reuses the parameters of the existing `--shadow-chart-bar-emboss` token — it would be cleaner to alias as a new token `--shadow-chart-slice-hover` if PO greenlights. Listed in open questions.

---

## Interaction

### Hover

1. **Translation along bisector angle** — active slice translates **2 px** along its midpoint angle (`(startAngle + endAngle) / 2`), away from chart center. Cap at 2 px so the slice never visibly detaches from the donut ring.
2. **Shadow intensifies** — see hover state above. The `drop-shadow(0 1.5px 2px ...)` plus the existing 4 px accent-glow rim reads as «slice rising off paper».
3. **No sister-slice dimming.** Other slices keep full opacity. This is non-negotiable per Provedo register — no casino-trading «dim everything except the bet you're staring at» pattern.
4. **Cursor:** `pointer` (already set in V2). V1 to add.
5. **A11y:**
   - Hover state mirrors `:focus-visible` so keyboard users see the same lift.
   - Donut container `tabIndex={0}` (already present); arrow keys cycle through slices via existing `useChartKeyboardNav` hook.
   - On focus, the active slice gets the same 2 px bisector translation + shadow stack, plus the 3 px focus ring on the container (`CHART_FOCUS_RING_CLASS`).

### Entrance animation

**Sequence:** **clockwise**, by data order (i.e. order in `payload.segments`). The AI agent that produces payloads orders segments by magnitude descending in 95% of cases, which means the natural sweep also reads as «biggest reveals first, then progressively smaller», matching reading order.

**Timing envelope:**

| Param          | Value                  | Token reference                         |
|----------------|------------------------|------------------------------------------|
| Total duration | **600 ms**             | (new — `motion.duration.donut-sweep`)   |
| Per-slice fade-in | **180 ms**             | between `motion.duration.moderate` (200) and `motion.duration.base` (150) — uses 180 directly |
| Stagger        | **80–120 ms** (4–6 slices) | computed: `(total - perSlice) / (n - 1)` |
| Easing         | `var(--easing-default)` (`cubic-bezier(0.16, 1, 0.3, 1)`) | existing token  |

For 5 slices: 600 ms total, ~105 ms stagger, 180 ms per-slice fade — feels paced, not snappy, matching the «caretaker» register.

**Implementation hook:** the V2 `FastDonutRing` path already animates each slice's `stroke-dashoffset` from `−offsetLen + arcLen` (collapsed at start angle) to `−offsetLen` (full sweep) in a single shared transition. Two changes for sequential entrance:
1. Apply `transition-delay: ${i * stagger}ms` per slice instead of all-at-once.
2. Match the duration to 180 ms and total envelope of 600 ms, not the existing single `CHART_ANIMATION_MS`.

For the rounded-path `<path>` branch (V2 cornerRadius > 0), the same effect is achieved via `stroke-dasharray` on the path's full length (use `useStrokeDashoffset` already in `packages/ui/src/charts/primitives/svg/`) with the same staggered `transition-delay`.

**Reduced-motion fallback (mandatory):**
- Already plumbed via `useReducedMotion` hook + `<html data-reduced-motion>` set by `ShowcaseHeader.tsx` toggle.
- When reduced: instant render. No fade-in, no stagger, no dashoffset transition. Slices appear at final state on first paint.
- Same hook gates the 1.02× hover scale and the 2 px bisector translation on hover — both fall back to no-translation, shadow-only.

---

## Legend

### Placement

Three rules, breakpoint-aware:

| Viewport     | `arcMode='full'`      | `arcMode='270'`                          |
|--------------|------------------------|-------------------------------------------|
| ≥ 768 px     | Right of donut, vertical stack | Centered under chart, inside missing wedge |
| < 768 px     | Below donut, horizontal wrap   | Same — under missing wedge, horizontal wrap |

The current V1 + V2 legend is always centered below — for the 270° variant this naturally lands inside the missing-wedge real estate without any extra layout. For `'full'` mode on ≥ 768 px, the existing CHARTS_SPEC §6 already specifies right-side legend; that direction stays.

Spacing token from chart edge: **`spacing.md` (12 px)** — already used (`mt-3` ≡ 12 px in Tailwind default, matches `radius.lg`).

### Markup

- **Swatch:** **9 × 9 px circular dot** (current implementation). Keep — circle reads less «traffic-light» than a square chip, more typographic. `borderRadius: 9999`.
- **Active state:** when the donut has `activeIndex !== null`, the matching legend swatch gets a 1.5 px outline at offset 2 px in `var(--accent)`. Already in V2; backport to V1.
- **Typography:**
  - Label — `font-medium` (500), 11 px — keeps the typographic «label rail» feel.
  - Color — `var(--color-text-secondary)`.
- **Click-to-filter:** **out of scope for V2 ship.** Tracked as open question for follow-up; would require state-lifting (filter is shared between donut and the table next to it on a dashboard surface) and is dashboard-level concern, not chart-primitive concern.

---

## Recharts (V1) integration sketch

Diff against `packages/ui/src/charts/DonutChart.tsx`:

1. **Add `<Pie cornerRadius={3}>` prop** — Recharts supports it natively; passes through to d3-shape.
2. **Add `arcMode` prop on `DonutChartProps`** + **resolve to `startAngle` / `endAngle`** on `<Pie>`:
   - Recharts uses degrees, not radians, and Recharts angle 0 = 3 o'clock (math convention), not 12 o'clock. So `'full'` → `startAngle={90}`, `endAngle={-270}` (current default for top-anchored clockwise full circle); `'270'` → `startAngle={45}`, `endAngle={-225}` (bottom-opening 270° wedge).
3. **Replace single `animationDuration` with staggered approach.** Recharts `<Cell>` doesn't expose per-cell delay natively; workaround = `<Pie animationBegin={i * stagger}>` only animates the whole pie, not per-slice. Cleanest path: render N `<Pie>` components, one per cell, each with its own `animationBegin` and `animationDuration={180}`. Geometric overhead is negligible (≤ 12 slices). Alternative if multi-Pie causes Recharts to fight on tooltip routing: keep current single-pie sweep at 600 ms total, drop per-slice stagger on V1 only (note as known V1-V2 visual delta).
4. **Add hover bisector translation** — extend the `activeShape` renderer in `makeActiveShape` to compute bisector `(startAngle + endAngle) / 2` and offset the inner Sector by 2 px along it. Already scales 1.02×; add `cx + 2*Math.cos(bisector)`, `cy + 2*Math.sin(bisector)` translation.
5. **Hairline borders** — already present (`stroke="var(--card)" strokeWidth={2}`). Reduce to **1 px with `vectorEffect="non-scaling-stroke"`** for retina parity.

## Primitives (V2) integration sketch

Diff against `packages/ui/src/charts/DonutChartV2.tsx`:

1. **Add `arcMode: 'full' | '270'`** prop as a sugar wrapper that overrides `startAngleRadians` / `endAngleRadians` if both raw props are unset.
2. **Add `cornerRadius` default of 3** (currently `0`). Note: triggers the rounded-path branch by default. Performance impact: rounded-path uses one `<path>` per slice via `arcPath()`, fast-ring uses one `<circle>` per slice. Both are O(n_slices); rounded-path is ~2× draw cost but still trivial under 12 slices.
3. **Add per-slice `transitionDelay: ${i * stagger}ms`** in both `FastDonutRing` and `RoundedDonutPath` style blocks.
4. **Add bisector translation on active slice** — compute `bisector = (bound.start + bound.end) / 2` per slice; on `isActive && !prefersReducedMotion`, compose `translate(${2*cos(bisector)}px, ${2*sin(bisector)}px)` with the existing `scale(1.02)`.
5. **Hairline parity** — V2 already uses `var(--card)` 2 px on slice borders; reduce to 1 px + `vectorEffect="non-scaling-stroke"` on `<line>` separators in `FastDonutRing` and on `<path stroke>` in `RoundedDonutPath`.
6. **Hover shadow stack** — replace the current single `drop-shadow(0 0 4px var(--accent-glow, ...))` with the two-layer stack from §«Drop shadow» above.

---

## Token deltas proposed

Two new entries, both in `packages/design-tokens/tokens/primitives/motion.json`:

```jsonc
{
  "duration": {
    "donut-sweep": {
      "$value": "600ms",
      "$type": "duration",
      "$description": "Donut full entrance envelope (sequential clockwise reveal). Per-slice fade-in 180ms with computed stagger."
    },
    "donut-slice-fade": {
      "$value": "180ms",
      "$type": "duration",
      "$description": "Per-slice fade-in within donut entrance sequence."
    }
  }
}
```

Optional: alias `--shadow-chart-slice-hover` in `semantic/light.json` + `dark.json` if PO greenlights extracting the two-layer hover shadow as a named token. Otherwise inline as documented filter chain.

Corner radius: NOT a token — it's a chart-primitive constant (3 px) at the same authority level as the 60% inner-radius ratio. Goes in `packages/ui/src/charts/tokens.ts`, not in design tokens.

---

## Open questions for PO

1. **Default `arcMode`.** Stay `'full'` and make `'270'` opt-in (recommended, no migration cost), or default to `'270'` for editorial flair?
2. **Entrance sequence direction.** Clockwise (by data order, recommended — matches AI-agent payload conventions which sort by magnitude descending), or strictly by-magnitude descending (sort-then-animate, regardless of payload order)?
3. **Click-to-filter on legend.** Out of scope for chart primitive (follow-up to dashboard layer), or include as a controlled prop on the donut now?
4. **Token alias for hover shadow.** Add `--shadow-chart-slice-hover` (cleaner reuse), or keep the two-layer stack inline in renderer?
5. **V1 stagger feasibility.** If Recharts `<Pie>` sub-component dance is brittle, is a 600 ms total sweep without per-slice stagger acceptable on V1 (V2 keeps full stagger), tracked as known V1↔V2 visual delta?

---

## Sources

- amCharts AI prompt: PO-shared 2026-04-29 (verbatim above).
- amCharts reference demo: `https://www.amcharts.com/demos/grained-gradient-pie/` (referenced via prompt — sibling PD dispatch may have produced screenshot at `docs/design/refs/donut/amcharts-grained-pie.png`).
- Provedo V1 source: `packages/ui/src/charts/DonutChart.tsx`.
- Provedo V2 source: `packages/ui/src/charts/DonutChartV2.tsx`.
- Existing donut spec: `docs/design/CHARTS_SPEC.md` §4.4 (lines 599–657 + a11y at 1878).
- Reduced-motion convention: `apps/web/src/app/design-system/_components/ShowcaseHeader.tsx` (`<html data-reduced-motion>`).
- Stroke-dashoffset hook reference: `packages/ui/src/charts/primitives/svg/useStrokeDashoffset.ts`.
- Sibling color/gradient draft: `docs/design/DONUT_GRADIENT_v2_draft.md`.
- Token references: `packages/design-tokens/tokens/primitives/motion.json`, `packages/design-tokens/tokens/semantic/light.json` (`--shadow-chart-card`, `--shadow-chart-bar-emboss`, `--accent-glow`).
- d3-shape `arc().cornerRadius()` — used via `packages/ui/src/charts/primitives/math/path.ts` `arcPath()`.
- Recharts `<Pie cornerRadius>` — Recharts 3.x official prop.
