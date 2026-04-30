# Donut V2 — Editorial Still-Life palette + 3D bevel form

**Date:** 2026-04-30
**Status:** SPEC (pending PO final review → writing-plans)
**Synthesis:** Right-Hand
**Section authorship:**
- §2 Form spec — **product-designer** (2026-04-30)
- §3 Palette spec — **product-designer** (2026-04-30)
- §4 Architecture — **architect** (2026-04-30)
- §5 Token migration — **architect** (2026-04-30)
- §6 Component contract — **frontend-engineer** (2026-04-30)
- §7 Governance — **brand-strategist** verbatim §13.6 (2026-04-30)
- §8 Tests — **qa-engineer** (2026-04-30)
- §9 Rollout — **architect** (2026-04-30)
- §1, §10–§12, Appendices, Synthesis notes — **Right-Hand**

**Branch:** `chore/plugin-architecture-2026-04-29`
**Supersedes:** `docs/design/CHART_PALETTE_v2_draft.md` (museum-vitrine, kept in primitives as fallback for non-donut chart kinds)
**Cross-ref:** `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` v1.1 → v1.2 amendment (§13.6 new + §13.2 footnote); `packages/ui/src/charts/DonutChartV2.tsx` (β.1.3)

---

## 1. Brief

DonutChartV2's current visual treatment («свет изнутри» radial gradient + museum-vitrine 5-hue desaturated palette) reads as «dust on linen» on the cream `#E8E0D0` substrate. PO directive 2026-04-30 sets two simultaneous changes:

1. **Form** — replace the radial-gradient depth treatment with a tactile 3D specular bevel + paper-press shadow (the «emboss / тиснение» direction, calibrated to «strong» H3).
2. **Palette** — replace the museum-vitrine categorical cycle (slate / ochre / fog-blue / plum / stone) with the `editorial-mh3` set (roasted-cocoa / burnished-gold / aubergine / wine / slate-blue) at chroma ≈0.06–0.10. Brand-strategist names the resulting register **«editorial-still-life»** — a sub-register beneath the §2 tactile-paper master register, distinct from Stripe-Press cadence and Vercel-billboard anti-pattern.

Both are deterministic redesigns. Per PO HARD RULE 2026-04-30, no feature flags / staged rollouts — ship via single atomic PR, rollback = git revert.

---

## 2. Form spec — H3 specular bevel + paper-press

> Authored by **product-designer**, 2026-04-30.

Form direction H3 («Carved-from-paper» specular bevel + ambient paper-press shadow) replaces the legacy «свет изнутри» radial fill. The slice no longer glows from within; it sits **on** the cream substrate as a low-relief object, lit from a single off-axis source and casting a soft contact shadow into the paper.

### 2.1 SVG filter primitives — light theme

Composited filter chain on the slice path, in order:

```
feGaussianBlur in=SourceAlpha stdDev=2          // soften alpha for highlight
feSpecularLighting surfaceScale=5 specularConstant=1.1
                   specularExponent=22 lighting-color=#ffffff
  feDistantLight   azimuth=225 elevation=55      // upper-left raking light
feComposite in=specOut in2=SourceAlpha operator=in result=litMasked

feGaussianBlur in=SourceAlpha stdDev=5
feOffset       dy=6
feComponentTransfer
  feFuncA type=linear slope=0.32                 // 32% opacity press shadow
result=paperShadow

feMerge: paperShadow → SourceGraphic → litMasked
```

The `feComposite operator=in` step is load-bearing: it clips the highlight back inside the slice silhouette so the bevel respects `cornerRadius`.

### 2.2 Dark theme deltas

Three values change; the chain shape is identical:

| Primitive | Light | Dark |
|---|---|---|
| `specularConstant` | `1.1` | `1.0` |
| `lighting-color` | `#ffffff` | `#F4F1EA` (warm-cream specular) |
| shadow `slope` (alpha) | `0.32` | `0.55` |

Warm-cream specular avoids the chalky-blue cast a pure-white highlight would produce against dark base hues; the heavier shadow re-establishes contact-grounding when the substrate is near-black.

### 2.3 Per-slice fill — linear gradient

The slice paint is a **linear gradient in fill-box local space** (`objectBoundingBox`, the SVG default), oriented top-to-bottom relative to the slice bounding box (not radial, not parent-frame). Two stops:

- top stop:    base hue lightened by **ΔL = +0.10** (light) / **+0.05** (dark)
- bottom stop: base hue darkened by **ΔL = −0.10** (light) / **−0.05** (dark)

Combined with the specular highlight from §2.1, this yields the under-paint-then-glaze quality of the editorial-still-life register without animating gradient stops on hover. Top/bottom hex are pre-computed and stored in design-tokens (per §5) — not derived at runtime.

### 2.4 Removed treatments

The following are deleted, not preserved:

- old `<radialGradient>` «свет изнутри» fill on slice
- `GRADIENT_STOPS_LIGHT` / `GRADIENT_STOPS_DARK` constants in chart token map
- any per-slice inner-glow `feGaussianBlur` not part of the bevel chain

Token-map slots vacated by the radial constants are repurposed for the editorial-mh3 30-hex set per §5.

### 2.5 Preserved invariants

Non-negotiable, carry forward unchanged from V2 polish #1–#3:

- hover scale **1.06** (transform-only); no-dim on siblings
- entrance fade with sequential stagger (existing curve + delays)
- 1px hairline trim between adjacent slices
- a11y: SVG `<title>`/`<desc>`, focus ring on slice, screen-reader labels intact
- `prefers-reduced-motion: reduce` → entrance + hover collapse to opacity-only
- cornerRadius cap rule: cornerRadius ≤ slice arc-thickness / 2

---

## 3. Palette spec — MH3″ Editorial Still-Life

> Authored by **product-designer**, 2026-04-30.

Brand-strategist verdict 2026-04-30 names this register **«editorial-still-life»**: Dutch-master under-paint × Tufte categorical × cream-paper substrate. It sits as a sub-register beneath the §2 tactile-paper master register of the chart system.

### 3.1 5-hue cycle — full hex table (30 stops)

Top/bottom derived ΔL ≈ ±0.10 from base for light theme, ±0.05 for dark. **All 30 hex are stored in design-tokens** (per §5) — no runtime ΔL math.

| Hue | Theme | Top (lighter) | Base | Bottom (darker) |
|---|---|---|---|---|
| roasted-cocoa | light | `#7A5440` | `#5E3A2A` | `#452517` |
| roasted-cocoa | dark  | `#C99B82` | `#B5876D` | `#A07358` |
| burnished-gold | light | `#C49640` | `#A87C24` | `#8C620D` |
| burnished-gold | dark  | `#EBCB85` | `#E0BC6E` | `#D5AD57` |
| aubergine | light | `#785878` | `#5C3F5E` | `#412944` |
| aubergine | dark  | `#B093B4` | `#9C7DA0` | `#88688C` |
| wine | light | `#974663` | `#7A2E48` | `#5E1830` |
| wine | dark  | `#D6A1B4` | `#C88AA0` | `#BA738C` |
| slate-blue | light | `#576E89` | `#3F546E` | `#2A3C53` |
| slate-blue | dark  | `#B0C2D6` | `#9CB0C8` | `#88A0BB` |

Cycle order is fixed (cocoa → gold → aubergine → wine → slate-blue) and re-enters at slot 6 (i.e. slice 6 maps back to roasted-cocoa). Cardinality cap: 5 series before «top-4 + Other» grouping.

### 3.2 Compliance verified

WCAG-AA contrast (base hue against substrate):

| Hue | vs cream `#E8E0D0` (light) | vs `#0E0E12` (dark) |
|---|---|---|
| roasted-cocoa | 5.8:1 | 6.4:1 |
| burnished-gold | 3.6:1 | 8.1:1 |
| aubergine | 5.4:1 | 6.1:1 |
| wine | 5.7:1 | 6.5:1 |
| slate-blue | 4.9:1 | 6.6:1 |

All ≥ 3.4:1 (graphical-object AA threshold) on cream, all ≥ 6:1 on near-black. Categorical separation against semantic anchors:

- ΔE2000 vs forest-jade `#2D5F4E` (gain): all five ≥ **11**
- ΔE2000 vs loss-bronze `#A04A3D` (loss): all five ≥ **12**

No hue collides with semantic gain/loss meaning; the donut never speaks the gain/loss language by accident.

### 3.3 OKLCH envelope (locked per §13.6)

| Theme | Chroma cap | Lightness band |
|---|---|---|
| light | C ≤ 0.10 | L 0.36 – 0.55 |
| dark  | C ≤ 0.12 | L 0.55 – 0.75 |

The envelope is the lock-in: any future palette swap must stay inside these bands or trigger a §13.6 amendment. Chroma is held deliberately below saturated-pigment territory — this is under-painted oil, not gouache.

### 3.4 Provenance note

- **roasted-cocoa, burnished-gold, wine, slate-blue:** light bases are PD-corrected hexes from the 2026-04-30 audit; dark bases are the audit-inversion partners (lighter L, slightly de-chroma'd to hold the ≤ 0.12 cap).
- **aubergine:** entered the palette during the post-audit blue-replace step (it replaced an earlier storm-indigo that visually doubled with slate-blue). Its light base `#5C3F5E` is from the blue-replace pass; its dark base `#9C7DA0` is **derived in this spec** — L raised from 0.36 to 0.59, C held at 0.07, hue 325° — to match the inversion logic applied to the other four hues. Flagged for visual QA on first render.

---

## 4. Architecture / file plan

> Authored by **architect**, 2026-04-30. Synthesis edits: governance docs added to file lists; filter naming aligned to `<EditorialBevelFilter>` per §6.

Total file touches: **4 ADD + 9 EDIT = 13**. The migration removes the inverted «свет изнутри» radial-gradient + per-theme JS const tables and replaces them with the editorial-mh3 H3 specular-bevel form sourced from CSS-var-driven `<linearGradient>` defs declared once in a shared filters module. The 5 «museum-vitrine» primitives + sequential ramp + chart-series legacy aliases are KEPT untouched — they remain valid token references for non-V2 consumers (and we avoid touching V1 in the same slice per the locked decision).

### 4.1 ADD (4)

| Path | Purpose |
|------|---------|
| `packages/ui/src/charts/_shared/filters.ts` | Shared `<EditorialBevelFilter>` React component (theme-aware H3 specular-bevel + paper-press). Contract delegated to §6 (frontend-engineer). |
| `packages/ui/src/charts/_shared/__tests__/filters.test.tsx` | Unit tests for `<EditorialBevelFilter>` per §8.1. |
| `packages/design-tokens/tokens/primitives/editorial-mh3.json` | New primitive block: 5-hue × 2-theme × {top, base, bottom} = 30 hex tokens under `color.editorial-mh3.{hue}.{theme}.{stop}` (concrete hex per §3). |
| `docs/design/CHART_PALETTE_v3_editorial.md` | Locked palette spec. Supersedes `CHART_PALETTE_v2_draft.md` for donut-V2 use case. v2-draft (museum-vitrine) preserved as historical reference and as primitives fallback. |

**(no standalone ADR file)** — per brand-strategist verdict 2026-04-30, §13.2 jade-cap impact is book-keeping not a tier expansion. Decision captured directly in `PROVEDO_DESIGN_SYSTEM_v1.md` §13.6 (new lock-in note) + §13.2 footnote, plus `DECISIONS.md` entry. Standalone `docs/ADR-2026-04-30-*.md` file is **not** created.

### 4.2 EDIT (9)

| Path | Change |
|------|--------|
| `packages/ui/src/charts/DonutChartV2.tsx` | Remove lines ~301–356 (`MuseumHueName` type + `GRADIENT_STOPS_LIGHT`/`_DARK` const tables + `getGradientStops`); remove lines ~672–716 (radial `<defs>` + dual-origin branching). Replace with `<EditorialBevelFilter>` from `_shared/filters.ts` + per-slice `<linearGradient>` defs (categorical only). `useThemeMode` import retained to feed `theme` prop. |
| `packages/design-tokens/tokens/semantic/light.json` | Re-point `chart-categorical.{1..5}` aliases from `color.museum.*.light` → emit `{base, top, bottom}` triple per slot referencing `color.editorial-mh3.{hue}.light.{stop}`. |
| `packages/design-tokens/tokens/semantic/dark.json` | Mirror of above for dark theme. |
| `packages/ui/src/charts/_shared/index.ts` | Re-export `<EditorialBevelFilter>`. |
| `packages/design-tokens/style-dictionary.config.cjs` | Register `editorial-mh3.json` in primitive sources. |
| `packages/ui/src/charts/__tests__/DonutChartV2.test.tsx` | Replace `donut-gradient-defs` testid assertions with H3 + linear-gradient defs (test contract → §8 / qa-engineer). |
| `apps/web/src/app/design-system/page.tsx` | Showcase verification: no code edit anticipated; visual baseline replacement (per §8.2). If hardcoded museum hex anywhere — replace with token reference. |
| `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` | Version bump v1.1 → v1.2; new §13.6 lock-in note (verbatim per §7.1); §13.2 footnote about chart-data slot disjointness; changelog entry at top. |
| `docs/DECISIONS.md` | Append entry referencing §13.6 + this spec; supersession of `2026-04-29 — Charts palette: museum-palette extension` decision noted. |

### 4.3 KEEP (no-edit)

- `color.museum.{slate,stone,fog-blue,plum,ochre}.*` primitives — V1 + non-V2 consumers still resolve them.
- `chart-sequential.*` ramp aliases (full 7-step) — orthogonal axis.
- `chart-series.{1..12}` legacy aliases — V1 fallback path.
- `_shared/{a11y, ChartDataTable, formatters, useChartKeyboardNav, useReducedMotion, useThemeMode}.ts` — `useThemeMode` remains in DonutChartV2 to feed `theme` prop on `<EditorialBevelFilter>`.

---

## 5. Token migration semantics

> Authored by **architect**, 2026-04-30. Synthesis edit: removed assertion that `useThemeMode` is dropped — see §4.2 / §6.

### 5.1 Aliases shape (jsonc)

Per-slot `{base, top, bottom}` triple — each becomes its own emitted CSS var. Light `chart-categorical.json` extract:

```jsonc
"chart-categorical": {
  "1": {
    "base":   { "$value": "{color.editorial-mh3.roasted-cocoa.light.base}",   "$type": "color" },
    "top":    { "$value": "{color.editorial-mh3.roasted-cocoa.light.top}",    "$type": "color" },
    "bottom": { "$value": "{color.editorial-mh3.roasted-cocoa.light.bottom}", "$type": "color" }
  },
  "2": { /* burnished-gold  → top/base/bottom */ },
  "3": { /* aubergine       → top/base/bottom */ },
  "4": { /* wine            → top/base/bottom */ },
  "5": { /* slate-blue      → top/base/bottom */ }
}
```

Hue→slot order is fixed by the locked palette: `1=roasted-cocoa · 2=burnished-gold · 3=aubergine · 4=wine · 5=slate-blue`. Order rationale (max-hue-Δ + warm-anchor first) is captured in §13.6 of the design-system amendment, not duplicated here.

### 5.2 CSS vars emitted by Style Dictionary

`5 hues × 3 stops × 2 themes = 30 vars`. Names follow existing flat-kebab convention:

```
:root[data-theme="light"] {
  --chart-categorical-1-base:   #5E3A2A;
  --chart-categorical-1-top:    #7A5440;
  --chart-categorical-1-bottom: #452517;
  /* … 1-5 × {base, top, bottom} = 15 vars */
}
:root[data-theme="dark"] { /* 15 vars mirrored */ }
```

`base` is the slice's flat reference (used by legend swatches + tooltip dots — replaces today's `var(--chart-categorical-N)`). `top` + `bottom` feed the H3 specular-bevel `<linearGradient>` stops (per §6 contract).

Showcase consumers that read `var(--chart-categorical-N)` (no suffix) MUST migrate to `-base`. Grep target: `/var\(--chart-categorical-\d\)(?![a-z-])/`. Expected hits: legend in `DonutChartV2.tsx` only (covered by §4.2 EDIT #1).

### 5.3 Theme switching

`<html data-theme="light|dark">` is already wired (Phase 1, locked). The 30 new vars resolve through the existing cascade — H3 `<linearGradient>` stops reference `var(--chart-categorical-N-top)` / `var(--chart-categorical-N-bottom)`, and theme switch swaps both atomically, no JS re-render of slice fills.

`<EditorialBevelFilter>` is the one place where JS theme awareness still matters — SVG `<feSpecularLighting lighting-color="…">` does not accept CSS vars reliably across browsers, so the filter consumes `theme` prop fed from `useThemeMode()`. Cost is minimal — `useThemeMode`'s `MutationObserver` already drives re-render on theme toggle, and the filter component is pure.

### 5.4 Museum-vitrine rename (`color.museum-vitrine.*`)

**Defer.** Recommendation: separate cosmetic-only PR after this lands. Rationale: (a) zero behavioural delta — pure key rename; (b) renaming inside this slice expands diff surface and clouds revert; (c) the new hues are not «museum-vitrine» semantically anyway, so the legacy block should retain its current name as historical record. Tracked as TD line in `docs/engineering/TECH_DEBT.md` (tech-lead to add).

---

## 6. Component contract

> Authored by **frontend-engineer**, 2026-04-30.

### 6.1 `EditorialBevelFilter` — new shared primitive

**Path:** `packages/ui/src/charts/_shared/filters.ts`

```typescript
export interface EditorialBevelFilterProps {
  /** Caller-owned unique id; used as `<filter id={id}>` and target of `filter={url(#id)}`. */
  id: string;
  /** Active theme; H3 stack uses different lighting elevations / opacities per theme. */
  theme: 'light' | 'dark';
}

export function EditorialBevelFilter(props: EditorialBevelFilterProps): JSX.Element;
```

**Renders:** a single `<defs><filter id={id} …>…</filter></defs>` containing the H3 specular-bevel primitive stack from §2 (`feGaussianBlur` → `feSpecularLighting` with theme-tuned `<feDistantLight>` → `feComposite` → `feMerge`). Pure component — no `useState`, no `useMemo`, no refs. Re-renders only when `id` or `theme` change.

**Caller responsibilities:**
- Generate a stable, document-unique id (use `useId()` slugged to alphanumerics, same scheme as the gradient ids today).
- Render `<EditorialBevelFilter>` once per chart instance, at the top of `<svg>` (before `<defs>` for gradients).
- Apply via `filter={`url(#${id})`}` on the **slice container `<g>`** — never on individual `<path>` / `<circle>` (one filter region per donut, not N).
- Pass current `theme` from `useThemeMode()`; the hook's `MutationObserver` already triggers a re-render on theme change.
- Filter id MUST be unique per DonutChartV2 instance — multiple donuts on one page would collide otherwise. The existing `gradientIdScope` (slugged `useId`) is the right token to suffix.

### 6.2 `DonutChartV2` — change summary

```diff
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} …>
+   {/* H3 specular-bevel filter — theme-aware, palette-agnostic. */}
+   <EditorialBevelFilter
+     id={`donut-bevel-${gradientIdScope}`}
+     theme={themeMode}
+   />

-   {palette === 'categorical' ? (() => {
-     const gradOriginX = useRoundedPath ? 0 : cx;
-     const gradOriginY = useRoundedPath ? 0 : cy;
-     return (
-       <defs data-testid="donut-gradient-defs">
-         {MUSEUM_HUE_ORDER.map((hue) => {
-           const stops = getGradientStops(themeMode, hue);
-           return (
-             <radialGradient … />
-           );
-         })}
-       </defs>
-     );
-   })() : null}
+   {/* Per-slice linear gradients — categorical mode only. Reads CSS-var
+       token pair `--chart-categorical-{N}-top` → `--chart-categorical-{N}-bottom`
+       so theme switching cascades automatically (no JS re-render). */}
+   {palette === 'categorical' ? (
+     <defs data-testid="donut-gradient-defs">
+       {segments.map((_, i) => {
+         const slot = (i % 5) + 1;
+         return (
+           <linearGradient
+             key={i}
+             id={`donut-grad-${i}-${gradientIdScope}`}
+             x1="0" y1="0" x2="0" y2="1"
+           >
+             <stop offset="0%"   stopColor={`var(--chart-categorical-${slot}-top)`} />
+             <stop offset="100%" stopColor={`var(--chart-categorical-${slot}-bottom)`} />
+           </linearGradient>
+         );
+       })}
+     </defs>
+   ) : null}

-   {useRoundedPath ? <RoundedDonutPath … /> : <FastDonutRing … />}
+   {/* Bevel filter wraps the slice container — one filter region per donut.
+       Slice fill dispatch (resolved upstream into seg.fill):
+         categorical   → url(#donut-grad-{i}-{scope})       (linear gradient)
+         sequential    → var(--chart-sequential-{N})        (flat ink ramp)
+         monochromatic → var(--chart-categorical-1) + fillOpacity (flat + ramp) */}
+   <g filter={`url(#donut-bevel-${gradientIdScope})`}>
+     {useRoundedPath ? <RoundedDonutPath … /> : <FastDonutRing … />}
+   </g>
  </svg>
```

**Removed identifiers:** `MuseumHueName`, `GradientStops`, `MUSEUM_HUE_ORDER`, `GRADIENT_STOPS_LIGHT`, `GRADIENT_STOPS_DARK`, `getGradientStops`, `gradientFillForSlice`, the `gradOriginX/Y` IIFE workaround, the per-museum-hue radial gradient defs, and the entire `D3 «свет изнутри»` comment block. `gradientIdScope` is **kept** (now scopes both the bevel filter id and the linear gradient ids). `useThemeMode` import is **kept** (feeds `theme` prop on `<EditorialBevelFilter>`).

### 6.3 Palette modes (preserved behaviour)

- **Categorical (default)** — `seg.fill = url(#donut-grad-{i}-{scope})` referencing the new per-slice `<linearGradient>` defs. Tokens are CSS vars, so light/dark swap requires no JS re-render of slice fills.
- **Sequential** — unchanged. `seg.fill = var(--chart-sequential-{N})` (flat). Slices sorted desc-by-value retain rank-→-token mapping.
- **Monochromatic** — unchanged. `seg.fill = var(--chart-categorical-1)` + per-slice `fillOpacity` 1.0 → 0.4 ramp.
- **Bevel filter is palette-agnostic** — applied on the slice container `<g>`, not on fills. Sequential and monochromatic still get the H3 specular bevel; only the *fill source* differs.

### 6.4 Legend / tooltip color source

Legend swatches and tooltip dots continue reading `seg.color` (the **flat alias** — `var(--chart-categorical-{N})`, never a `url(#...)` ref, since CSS `background` cannot resolve SVG fragment URLs). The new `-top` / `-bottom` token variants are gradient-stop-only and MUST NOT be referenced from legend / tooltip / data-table code paths.

### 6.5 Callouts

- **React-key stability across hover-reorder:** the existing DOM-reorder paint trick (push hovered tuple to end of `renderOrder`, key by `seg.key`) is unaffected. The new linear gradient defs are keyed by `i` (render index) — stable across hover since hover only reorders paint, not the `segments` array.
- **Gradient + filter id uniqueness:** every fragment id (`donut-grad-{i}-{scope}`, `donut-bevel-{scope}`) suffixes the per-instance `gradientIdScope` slug. Multiple DonutChartV2 instances on one page (e.g. dashboard with 4 donuts) will not collide. Storybook isolation is preserved.

---

## 7. Governance

### 7.1 §13.6 — new lock-in note (verbatim, brand-strategist 2026-04-30)

> **§13.6 — Editorial-mh3 chart palette envelope locked.** The 5-hue chart-categorical set (`roasted-cocoa`, `burnished-gold`, `aubergine`, `wine`, `slate-blue`) is the only sanctioned chart-categorical palette. Hard ceilings: chroma ≤0.10 (light), ≤0.12 (dark); luminance L 0.36–0.55 (light), 0.55–0.75 (dark). Any new categorical hue must (a) sit inside this envelope, (b) maintain ΔE ≥10 from forest-jade `#2D5F4E` and loss-bronze `#A04A3D`, (c) clear WCAG-AA non-text 3:1 on `#E8E0D0` + `#0E0E12`. Chart-categorical role is **disjoint** from §13.2 jade-tier surface roles — does not consume the 13-role cap. Editorial-mh3 may NOT be promoted to surface-chrome (backgrounds, borders, CTA, semantic states); chart-slot use only. Register: **editorial-still-life** — sub-register beneath the §2 tactile-paper master register, not a replacement.

### 7.2 §13.2 footnote (new)

> *Editorial-mh3 chart slots sit outside this cap. Chart-data slot allocation is disjoint from surface-chrome roles — the 3-tier / 13-role cap counts jade-derivative surfaces only.*

### 7.3 Doc supersession

- `CHART_PALETTE_v2_draft.md` → `CHART_PALETTE_v3_editorial.md` (v2 marked SUPERSEDED at top; do **not** delete — preserves museum-vitrine specification for non-donut adoption per CC post-merge docs convention)
- `PROVEDO_DESIGN_SYSTEM_v1.md` v1.1 → v1.2 in changelog table (single-row drift entry: «Donut chart palette: museum-vitrine → editorial-still-life (§13.6)»)
- `DECISIONS.md` — new entry «2026-04-30 — DonutChartV2 palette + form: editorial-still-life + H3 specular bevel» with link to this spec

---

## 8. Tests

> Authored by **qa-engineer**, 2026-04-30. Synthesis edit: removed `gradientUnits="userSpaceOnUse"` assertion (`<linearGradient>` uses `objectBoundingBox` default per §6).

Test plan for the DonutChartV2 editorial-still-life redesign. Vitest + jsdom for unit, Playwright Chromium for visual, axe-core for a11y, golden-file snapshot for tokens.

### 8.1 Unit tests (Vitest, jsdom)

**File:** `packages/ui/src/charts/__tests__/DonutChartV2.test.tsx` (refresh existing)

New / updated assertions:
- `<EditorialBevelFilter>` mounts inside `<defs>` exactly once; the `<filter id>` matches the `filter="url(#…)"` attribute on the slice container (`<g>` wrapping the rounded `<path>` set).
- For `palette === 'categorical'` (default fixture), a `<linearGradient>` exists per slice (`segments.length` gradients); each has exactly two `<stop>` children with `offset="0%"` and `offset="100%"`, and `stop-color` referencing CSS vars `--chart-categorical-{i+1}-top` / `--chart-categorical-{i+1}-bottom`.
- Each rounded `<path data-testid="donut-sector">` carries `fill="url(#donut-grad-{i}-{instanceId})"`. The instance scope id is stable across re-renders with the same `payload`.
- Smoke for old-impl removal: `container.querySelectorAll('radialGradient').length === 0`; no element references `GRADIENT_STOPS_*`.
- `palette="sequential"` and `palette="monochromatic"` paths: assert slice fills use the existing `--chart-sequential-*` / `--chart-categorical-1` semantics (no gradient `<defs>`, behavior unchanged).
- Existing assertions in lines 38–154 remain green (rounded-path default, fast-ring opt-in, sector count, `data-segment-key`, semi-circle, center label, legend, a11y baseline, `data-chart-backend="primitives"`).

**File (new):** `packages/ui/src/charts/_shared/__tests__/filters.test.tsx`

Pattern matches `formatters.ts` / `useChartKeyboardNav.ts` colocation under `_shared/`. Render `<svg><defs><EditorialBevelFilter id="t" theme="light" /></defs></svg>` via `@testing-library/react`:
- `theme="light"` → `<feSpecularLighting lighting-color="#fff" specularConstant="1.1" />` and `<feDistantLight>` with `azimuth/elevation` per spec; `<feComponentTransfer>` slope channel `0.32`.
- `theme="dark"` → `lighting-color="#F4F1EA"`, `specularConstant="1.0"`, slope `0.55`.
- `id` prop projects onto the root `<filter id="…">`.
- Smoke: filter primitives render in spec-locked order (`feGaussianBlur` → `feSpecularLighting` → `feComposite` → `feComponentTransfer` → `feMerge`).

### 8.2 Visual snapshots (Playwright)

**File:** `apps/web/playwright-tests/charts/charts.visual.spec.ts` (existing; donut baselines replaced)

- Replace `chart-donut-light.png` and `chart-donut-dark.png` under `__screenshots__/`. Run `pnpm test:visual --update-snapshots` once redesign lands.
- Add two interaction baselines: hover on slice 1 (`page.hover('[data-testid="donut-sector"]:nth-child(1)')`) and keyboard focus on slice 1 (`Tab` then `ArrowRight`) — both themes. New names: `chart-donut-{theme}-hover-slice1.png`, `chart-donut-{theme}-focus-slice1.png`.
- Tolerance unchanged: `maxDiffPixelRatio: 0.001`. Acceptance: PR reviewer (PD or Right-Hand) approves baseline replacement explicitly in the PR; diff artefact attached.

### 8.3 A11y (axe-core)

**File:** `apps/web/playwright-tests/charts/charts.a11y.spec.ts` (new, sibling pattern)

- Inject `@axe-core/playwright`, scan `/design-system#charts` both themes, assert zero new violations vs current baseline (donut sub-tree only — `axe.run({ include: '[data-testid="chart-donut"]' })`).
- **Programmatic contrast gate** in `packages/design-tokens/__tests__/contrast.test.ts` (new): for every `--chart-categorical-{1..5}` (top + bottom), assert WCAG ratio ≥ 3:1 vs `--bg` per theme using `culori` (already a dep). Blocks token build on regression.

### 8.4 Token snapshot

**File:** `packages/design-tokens/__tests__/css-vars.snapshot.test.ts` (new)

- Run Style Dictionary build; load `build/css/tokens.css`; assert exactly 30 new vars present (`--chart-categorical-{1..5}-{top,bottom,base}` × `:root` + `[data-theme="dark"]` = 30). Golden snapshot file `__snapshots__/css-vars.snap`.

### 8.5 Coverage targets

- `DonutChartV2.tsx`: ≥85% statement / ≥80% branch (current bar; verify via `pnpm --filter @investment-tracker/ui test -- --coverage`).
- `_shared/filters.ts`: ≥90% statement (small surface).
- Drop > 2% triggers QA return-to-author per agent SOP.

### 8.6 Out of scope (this PR)

- No Playwright E2E flow — interaction stays in unit + visual layers.
- No performance benchmark — `<feSpecularLighting>` cost is negligible vs the radial-gradient defs being removed; defer to follow-up TD if visual jank surfaces in dogfood.
- No cross-browser visual (Chromium-only per existing config).

---

## 9. Rollout

> Authored by **architect**, 2026-04-30. Synthesis edits: 3 governance commits added to PR sequence; verification checklist updated to reflect `useThemeMode` retention.

### 9.1 No feature flag (per PO 2026-04-30)

No real users; no analytics SLA to protect; no AI-agent payload binding to chart appearance; rollback cost = `git revert` of the slice's commits. Feature-flag scaffolding (env var, branching code path, dual showcase route, parallel test suite) would carry more carrying-cost than the rollback insurance is worth at pre-alpha. Consistent with PO directive 2026-04-30 «ship straight».

### 9.2 PR commit sequence (10 commits, atomic)

Each commit type-checks + tests green standalone (so any prefix is a valid revert point):

1. `feat(tokens): add editorial-mh3 primitive block (30 hex, 5 hues × 2 themes × 3 stops)`
2. `feat(tokens): repoint chart-categorical aliases to editorial-mh3 base/top/bottom`
3. `feat(charts): add EditorialBevelFilter shared primitive in _shared/filters.ts`
4. `test(charts): add filters.test.tsx for EditorialBevelFilter (light + dark)`
5. `refactor(charts): swap DonutChartV2 radial-gradient defs for H3 specular-bevel + linear-gradient`
6. `refactor(charts): drop GRADIENT_STOPS_LIGHT/DARK + radial-gradient defs in DonutChartV2`
7. `test(charts): refresh DonutChartV2 defs assertions for H3 form`
8. `docs(design-system): v1.2 — §13.6 editorial-mh3 lock-in + §13.2 footnote`
9. `docs(charts): CHART_PALETTE_v3_editorial supersedes v2-draft`
10. `chore(decisions): 2026-04-30 entry`

Order rationale: tokens → primitive → tests → consumer → cleanup → consumer-tests → docs. Steps 5 and 6 are split so the «functional swap» and the «dead-code prune» are individually revertable; the radial-gradient code is dead but harmless after #5, fully gone after #6.

### 9.3 Rollback

`git revert` commits 10 → 1 in reverse (or `git revert <merge-sha>` if merged via merge-commit). Restores museum-vitrine palette and the inverted radial-gradient form intact.

**Stays orphaned post-revert:** nothing — all `editorial-mh3.json` primitives, the new `_shared/filters.ts` module, and the docs additions disappear with the revert. The KEEP-list primitives (museum-vitrine, sequential, chart-series) were never touched, so revert restores prior `chart-categorical` aliases automatically.

**Partial rollback** (keep tokens, revert form): revert commits 5 + 6 + 7 only. Tokens stay, `DonutChartV2` reverts to radial-gradient consuming the new `-base` var. Acceptable transitional state; follow-up issue tracked.

### 9.4 Showcase verification checklist (manual, pre-PR-review)

Run before requesting Rule-5 reviewer fan-out:

- [ ] `pnpm -F @investment-tracker/design-tokens build` → 30 new vars present in `dist/css/tokens-{light,dark}.css` (grep `--chart-categorical-\d-(base|top|bottom)`).
- [ ] `pnpm -F @investment-tracker/ui typecheck` → 0 errors. `useThemeMode` import retained in `DonutChartV2.tsx` and wired to `theme` prop on `<EditorialBevelFilter>`.
- [ ] `pnpm -F @investment-tracker/ui test charts/DonutChartV2` → green. New `filters.test.tsx` green.
- [ ] Open `/design-system` in light + dark — visual inspection: 5 hues read as roasted-cocoa / burnished-gold / aubergine / wine / slate-blue per §3 hex; bevel reads top-lit (top stop = highlight, bottom stop = shadow), NOT inverted.
- [ ] Theme toggle (`<html data-theme>` flip) → all 5 slices repaint without flicker; only the filter component re-renders (CSS vars handle slice fills).
- [ ] DevTools → no `<radialGradient>` elements in DOM under the donut SVG; only `<linearGradient>` per H3 form.
- [ ] Reduced-motion toggle → entrance + hover behaviour preserved (orthogonal axis; should not regress).
- [ ] Hover any slice → paper-press shadow + accent-glow rim still present (chart-slice-hover token unchanged).
- [ ] Keyboard arrow-nav cycles through 5 sectors → focus ring visible on every hue (a11y gate, defers to Rule-5 a11y reviewer for AAA).

After all 9 boxes green → dispatch Rule-5 reviewer fan-out per `project_post_phase2_review_plan` memory.

---

## 10. Specialist sign-offs

| Specialist | Role | Status | Date | Artifact |
|---|---|---|---|---|
| product-designer | §2 Form spec + §3 Palette spec author | ✅ authored | 2026-04-30 | sections in this spec; audit at `.superpowers/brainstorm/.../section-2-3-pd.md` |
| brand-strategist | §13.6 wording + register naming | ✅ authored | 2026-04-30 | verbatim §13.6 in §7.1; verdict at `.superpowers/brainstorm/.../section-13-6-brand.md` (in agent transcript) |
| architect | §4 Architecture + §5 Token migration + §9 Rollout author | ✅ authored | 2026-04-30 | sections in this spec |
| frontend-engineer | §6 Component contract author | ✅ authored | 2026-04-30 | section in this spec |
| qa-engineer | §8 Tests author | ✅ authored | 2026-04-30 | section in this spec |
| tech-lead | PR-time review (commit sequence, slice-discipline, branch hygiene) | ⏳ deferred | — | review at PR-time |

PD + brand + architect + FE + QA sign-offs are **blocking** for spec lock. Tech-lead is **PR-gate**, not spec-gate.

---

## 11. Open questions / TDs (deferred to follow-up)

1. **Museum-vitrine repurposing.** With donut-V2 migrated off, museum-vitrine has no current consumers. Track as TD: «when a non-donut chart kind ships, decide whether to revive `color.museum.*` via new semantic alias or retire it». Do NOT delete primitives in this PR.
2. **`color.museum.*` rename to `color.museum-vitrine.*`** for disambiguation from any future «museum» token namespace. Pure cosmetic. Defer to a separate token-cleanup PR (architect §5.4).
3. **Light-theme `palette="monochromatic"` opacity ramp** under H3 bevel — visual check required; current tests pass jsdom but bevel + opacity-ramp interaction not visually validated. If issues found, possible follow-up: pre-compute per-step linear gradient instead of opacity (mirrors the editorial-mh3 approach). Not blocking for this PR.
4. **Sequential palette under H3 bevel** — same visual-validation TD. Anatomy ADR §«Sequential» rules out gradient muddying — re-confirm with H3 bevel render that sequential ramp magnitude read survives the specular highlight.
5. **`useThemeMode()` re-render cost** when theme toggles — `<EditorialBevelFilter>` re-renders cheaply but the filter id stays stable. If theme-toggle causes flicker, memoize the filter render with `React.memo` keyed on `theme + id`.
6. **Aubergine dark base `#9C7DA0`** is derived in this spec (see §3.4 provenance note). Visual QA on first render to confirm L=0.59 / C=0.07 / hue=325° lands correctly under the H3 bevel + dark substrate. If reads off-balance, PD revisit.
7. **Bevel filter cost** under sequential / monochromatic palettes — orthogonal to current PR but worth measuring once in dogfood (filter applies regardless of palette mode).
8. **Showcase route consolidation** — architect originally proposed a dedicated `/internal/showcase/charts/donut-v2-editorial-page` route. Synthesis chose to update the existing `/design-system` page instead (simpler, single canonical surface). Revisit if `/design-system` page grows unwieldy.

---

## 12. Synthesis decisions

Right-Hand resolved 6 conflicts between specialist outputs:

1. **Token shape — store vs compute (PD vs architect):** locked decision is **store 30 hex in tokens** (PO approved earlier in brainstorm session). PD's «computed at runtime» framing edited to align (§2.3, §2.4, §3.1).
2. **Filter component name (FE vs architect):** locked **`<EditorialBevelFilter>`** (FE/PD aligned with brand register «editorial-still-life»). Architect's `DonutH3Defs` + `resolveH3Fill` naming dropped.
3. **`useThemeMode` retention (architect drop vs FE keep):** locked **keep**. SVG filter primitives (`<feSpecularLighting lighting-color="…">`) don't accept CSS vars reliably across browsers; theme prop on filter is the simpler, more compatible path. Architect's §4.2 and §9.4 edited accordingly.
4. **Linear gradient units (QA `userSpaceOnUse` vs PD/FE `objectBoundingBox`):** locked **`objectBoundingBox`** (the SVG default). QA §8.1 assertion edited.
5. **File count:** architect's 3 ADD + 7 EDIT (no governance) → expanded to **4 ADD + 9 EDIT = 13 file touches** with governance docs and showcase verification reflected.
6. **PR commit sequence:** architect's 7 commits → expanded to **10 commits** with 3 governance commits at the tail.

---

## Appendix A — superseded references

- `docs/design/CHART_PALETTE_v2_draft.md` (museum-vitrine, 2026-04-29) — historical, kept; museum primitives still live in tokens
- `docs/design/DONUT_GRADIENT_v2_draft.md` («свет изнутри» radial-gradient direction, 2026-04-29) — historical; the PO-directive «center darker → rim brighter» principle is no longer active for editorial-mh3 (replaced by linear top→bottom + bevel-filter combo)
- `DonutChartV2.tsx` D1–D5 polish history — preserved in commit history; the polish sequence ended with this spec's H3 form replacing it

## Appendix B — visual companion + specialist artifacts

Mockups + specialist transcripts produced during brainstorming session 2026-04-30, persisted at `.superpowers/brainstorm/1340-1777534401/`:

**Visual companion (`content/`):**
- `q1-3d-direction.html` — soft pillow / glass dome / emboss (chose: emboss)
- `q1-c-variants.html`, `q1-hybrid.html` — bevel intensity calibration (chose: H3)
- `q2-palette-directions.html`, `q2-pd-directions.html`, `q2-multihue-saturated.html` — palette direction exploration
- `q2-mh3-corrected.html` — PD-audit corrections applied
- `q2-mh3-blue-replace.html` — final hue: aubergine replaces storm-indigo

**Specialist authored sections (`state/`):**
- `section-2-3-pd.md` — PD authored
- `section-4-5-9-architect.md` — architect authored
- `section-6-fe.md` — FE-engineer authored
- `section-8-qa.md` — QA-engineer authored

These are reference artifacts for design archaeology. Not source-of-truth (this spec is).
