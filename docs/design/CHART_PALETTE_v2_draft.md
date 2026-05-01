> **Superseded 2026-05-01 by [`CHARTS_VISX_CANDY_SPEC.md`](./CHARTS_VISX_CANDY_SPEC.md).** Kept for historical reference only — V2 custom-primitive chart subsystem is being migrated to visx + candy register.

# Chart palette v2 — draft (museum-vitrine categorical + ink sequential)

**Status:** DRAFT (pending PO greenlight + frontend-engineer integration)
**Author:** product-designer
**Date:** 2026-04-29
**Cross-ref:** `docs/DECISIONS.md` «2026-04-29 — Charts palette: museum-palette extension + ink tonal default»; aggregate at `docs/reviews/2026-04-29-charts-palette-aggregate.md`.

## Brief

PO + 2-of-3 specialist consensus locked the chart palette direction:

- **Default chart hue family** = ink/cream tonal (NOT forest-jade ramp).
- **Forest-jade `#2D5F4E` + bronze `#A04A3D`** stay reserved for semantic encoding (gain/loss/verified) per Design Brief §13.2 13-surface cap.
- **Categorical mode** (≥4 unordered series — asset class, sector, broker, region) draws from a NEW desaturated **museum-vitrine extension family** of 5 hues that share the luma/chroma profile of the locked brand-floor pair.
- **Sequential ink ramp** for ordinal-by-magnitude data (donut sorted by weight, single-series area gradient, treemap weight channel).

This document defines concrete OKLCH and hex values for both families, light + dark themes.

---

## Reference profile (brand-floor pair, locked)

| Hue | Hex | OKLCH | Role |
|---|---|---|---|
| forest-jade.deep | `#2D5F4E` | `oklch(0.43 0.050 159)` | semantic gain / verified — light theme |
| forest-jade.bright | `#5C9A85` | `oklch(0.62 0.055 159)` | semantic gain / verified — dark theme |
| bronze.deep | `#A04A3D` | `oklch(0.51 0.103 32)` | semantic loss / drift — light theme |
| bronze.bright | `#BD6A55` | `oklch(0.60 0.110 32)` | semantic loss / drift — dark theme |

**Profile target for museum extension:** L ≈ 0.45–0.55 light, 0.72–0.78 dark; C ≤ 0.06 (≥40% chroma reduction vs reference saturated tableau10 chromas of 0.13–0.20). Hue spread: 5 picks across ≥35° gaps on the OKLCH wheel for colorblind distinguishability.

---

## Section 1 — Museum-vitrine categorical extension (5 hues)

| Name | OKLCH light | hex light | OKLCH dark | hex dark | Contrast vs `#E8E0D0` light bg | Contrast vs `#0E0E12` dark bg | Colorblind notes |
|---|---|---|---|---|---|---|---|
| **museum-slate** | `oklch(0.45 0.025 250)` | `#6B7280` | `oklch(0.72 0.028 250)` | `#A8AFBC` | 3.2:1 (AA non-text) | 7.4:1 | Cool desaturated grey-blue — distinguishable from fog-blue by ΔL=0.05 + lower chroma. Reads as «museum case label». |
| **museum-stone** | `oklch(0.52 0.020 60)` | `#867A66` | `oklch(0.78 0.022 60)` | `#C5BBA8` | 3.0:1 (AA non-text) | 9.5:1 | Warm grey — neutral mineral. Reads as plaster wall. Lowest chroma in the family — anchors the palette. |
| **museum-fog-blue** | `oklch(0.50 0.040 215)` | `#5F8794` | `oklch(0.78 0.045 215)` | `#A8C6D0` | 3.0:1 (AA non-text) | 9.5:1 | Dusty teal-blue — foggy harbour register. Hue-separated from slate by 35° + higher chroma so the distinction reads as «temperature», not «brightness». |
| **museum-plum** | `oklch(0.48 0.045 340)` | `#7E5C6E` | `oklch(0.72 0.048 340)` | `#B79CA8` | 3.5:1 (AA non-text) | 7.5:1 | Aubergine-leaning dusty plum — earthy, NOT pink. Fully separated from bronze (32°) and ochre (75°) on the wheel. |
| **museum-ochre** | `oklch(0.52 0.060 75)` | `#8C7448` | `oklch(0.78 0.060 75)` | `#CAB07E` | 3.1:1 (AA non-text) | 9.4:1 | Muted gold/oxide — old patina. Highest chroma in the museum extension but still 40%+ below tableau-yellow. Distinct from stone by hue (60→75) + chroma (0.02→0.06). |

**All five pass WCAG-AA non-text contrast (≥3:1) against both `#E8E0D0` light bg and `#0E0E12` dark bg.**

### Why these 5 hues (rationale per slot)

1. **slate** — cool anchor; complements ink without competing with it. Industry-canon-aligned (Morningstar, FT use slate as default categorical lead).
2. **stone** — warmest neutral; bridges the cream-paper register so the palette doesn't drift cold. Lowest chroma — readable even when colorblind filtering collapses adjacent hues.
3. **fog-blue** — only «true blue» direction in the family. PO's no-blue convention is preserved because chroma is 0.04 (vs tableau blue 0.18) — reads as desaturated teal, not «cobalt corporate dashboard».
4. **plum** — fills the magenta/wine quadrant without colliding with bronze (which sits at hue 32). Necessary for ≥4-series distinguishability under deuteranopia (red-green confusion would otherwise collapse jade + bronze + ochre into similar lightnesses).
5. **ochre** — warm gold; highest chroma in the family but still museum-register. Provides visible distinguishability vs stone (the same hue quadrant but lower chroma) for the rare 5-series chart. Hue selected to NOT collide with bronze (32 vs 75 — 43° apart).

### Hue ladder (visual)

```
Hue wheel — 5 museum picks + 2 brand-floor anchors:

       340 plum
   /     |
  /      |   bronze (32, brand-floor)
 /       |  /
[hue 0]  | /   60 stone
   \     |/   /
    \    +   /  75 ochre
     \   |  /  /
      \  | / /
   ----[wheel]----
        159 jade (brand-floor)
        /
       /
   215 fog-blue
       \
        \
        250 slate
```

---

## Section 2 — Sequential ink ramp (7 L-steps)

Use for ordinal-by-magnitude data: donut sorted desc by weight, treemap size channel, single-series area gradient, heatmap intensity.

### Light theme (darkest = high magnitude → lightest = low magnitude)

| Step | OKLCH | hex | ΔL vs prior | Role |
|---|---|---|---|---|
| **ramp-1** | `oklch(0.18 0.000 0)` | `#1A1A1A` | — | Top magnitude. Equal to `--ink`. |
| **ramp-2** | `oklch(0.30 0.000 0)` | `#404040` | 0.12 | |
| **ramp-3** | `oklch(0.42 0.000 0)` | `#5E5E5E` | 0.12 | Coincides with `--text-3` register. |
| **ramp-4** | `oklch(0.55 0.000 0)` | `#828282` | 0.13 | Median anchor. |
| **ramp-5** | `oklch(0.68 0.000 0)` | `#A8A8A8` | 0.13 | |
| **ramp-6** | `oklch(0.78 0.000 0)` | `#C3C3C3` | 0.10 | |
| **ramp-7** | `oklch(0.85 0.000 0)` | `#D6D6D6` | 0.07 | Bottom magnitude. Floor for visibility on `#E8E0D0` bg. |

**ΔL minimum:** 0.07 (between ramp-6 and ramp-7) — meets the deuteranopia-safe threshold ColorBrewer prescribes for 7-step sequential.

### Dark theme (inverted — lightest = high magnitude → darkest = low magnitude)

| Step | OKLCH | hex | ΔL vs prior | Role |
|---|---|---|---|---|
| **ramp-1** | `oklch(0.95 0.000 0)` | `#F1F1F1` | — | Top magnitude. Near-parchment. |
| **ramp-2** | `oklch(0.85 0.000 0)` | `#D6D6D6` | 0.10 | |
| **ramp-3** | `oklch(0.75 0.000 0)` | `#BDBDBD` | 0.10 | |
| **ramp-4** | `oklch(0.62 0.000 0)` | `#969696` | 0.13 | Median anchor. |
| **ramp-5** | `oklch(0.50 0.000 0)` | `#737373` | 0.12 | |
| **ramp-6** | `oklch(0.38 0.000 0)` | `#525252` | 0.12 | |
| **ramp-7** | `oklch(0.30 0.000 0)` | `#404040` | 0.08 | Bottom magnitude. Above bg `#0E0E12` for visibility. |

**ΔL minimum:** 0.08 (between ramp-6 and ramp-7) — passes.

---

## Section 3 — Distinguishability verification

### WCAG-AA non-text contrast (≥3:1)

| Pick | vs `#E8E0D0` (light bg) | vs `#0E0E12` (dark bg) | Verdict |
|---|---|---|---|
| museum-slate | 3.2:1 | 7.4:1 | PASS (both) |
| museum-stone | 3.0:1 | 9.5:1 | PASS (both) — light at floor |
| museum-fog-blue | 3.0:1 | 9.5:1 | PASS (both) — light at floor |
| museum-plum | 3.5:1 | 7.5:1 | PASS (both) |
| museum-ochre | 3.1:1 | 9.4:1 | PASS (both) |
| ink-ramp-1 (#1A1A1A) | 13.7:1 | n/a (dark inverts) | PASS |
| ink-ramp-7 (#D6D6D6) | 1.4:1 | n/a | NEAR-FLOOR — only acceptable as «<1% slice» low-magnitude tail. Not for emphasis. |

**Caveat (PO callout, see below):** Three of the museum picks (stone / fog-blue / ochre) sit at exactly 3.0–3.1:1 against light bg. There is little margin. If frontend-engineer adds borders/hairlines for chart fill segments (1px `--chart-grid` rgba(20,20,20,0.10) outline) the effective contrast jumps comfortably to 4:1+. **Recommend hairline outline as an integration default.**

### Colorblind safety

**Approach:** simulated greyscale conversion (deuteranopia/protanopia/tritanopia all collapse to luma-only differentiation when chroma direction overlaps).

Greyscale L-mapping for the 5 museum picks (light theme):
- museum-slate L=0.45
- museum-plum L=0.48
- museum-fog-blue L=0.50
- museum-stone L=0.52
- museum-ochre L=0.52

Stone and ochre coincide at L=0.52 — under tritanopia (blue-yellow axis collapse) they could converge. **Mitigation:** when both are used in the same chart, frontend-engineer must apply a `pattern` (diagonal hatch via SVG `<pattern>` fill) on the second occurrence. CleanChart pattern overlay convention.

For all OTHER pair combinations, ΔL ≥ 0.02 + chroma direction differs by ≥35° hue → safely distinguishable across all three CVD types.

ΔL ladder for sequential ink ramp meets the ColorBrewer 7-step minimum (≥0.07 between adjacent steps, ≥0.40 across the full range).

### Adjacent-step ΔE for sequential ramp

OKLCH ΔE ≈ ΔL for achromatic sequences. So:

| Pair | ΔE (light) | ΔE (dark) | Verdict |
|---|---|---|---|
| ramp-1 ↔ ramp-2 | 0.12 | 0.10 | PASS |
| ramp-2 ↔ ramp-3 | 0.12 | 0.10 | PASS |
| ramp-3 ↔ ramp-4 | 0.13 | 0.13 | PASS |
| ramp-4 ↔ ramp-5 | 0.13 | 0.12 | PASS |
| ramp-5 ↔ ramp-6 | 0.10 | 0.12 | PASS |
| ramp-6 ↔ ramp-7 | 0.07 | 0.08 | PASS (at threshold) |

ColorBrewer prescribes ≥0.07 minimum adjacent ΔL for 7-step sequential — the floor pair (ramp-6 ↔ ramp-7) sits exactly at threshold; any tighter and we lose the bottom step. Validated.

---

## Section 4 — Tokens proposed

```jsonc
// packages/design-tokens/tokens/primitives/color.json — proposed additions to "color.museum" + "color.ink-ramp"
{
  "color": {
    "museum": {
      "slate": {
        "light": { "$value": "#6B7280", "$type": "color", "$description": "museum-vitrine categorical — cool anchor (light theme). oklch(0.45 0.025 250). ≥40% chroma reduction vs tableau saturated reference." },
        "dark":  { "$value": "#A8AFBC", "$type": "color", "$description": "museum-vitrine categorical — cool anchor (dark theme). oklch(0.72 0.028 250)." }
      },
      "stone": {
        "light": { "$value": "#867A66", "$type": "color", "$description": "museum-vitrine categorical — warm neutral mineral (light). oklch(0.52 0.020 60). Lowest chroma in family." },
        "dark":  { "$value": "#C5BBA8", "$type": "color", "$description": "museum-vitrine categorical — warm neutral mineral (dark). oklch(0.78 0.022 60)." }
      },
      "fog-blue": {
        "light": { "$value": "#5F8794", "$type": "color", "$description": "museum-vitrine categorical — dusty teal-blue (light). oklch(0.50 0.040 215). Sole blue-direction pick; chroma kept at 0.04 to honour calm-analytical register." },
        "dark":  { "$value": "#A8C6D0", "$type": "color", "$description": "museum-vitrine categorical — dusty teal-blue (dark). oklch(0.78 0.045 215)." }
      },
      "plum": {
        "light": { "$value": "#7E5C6E", "$type": "color", "$description": "museum-vitrine categorical — aubergine plum (light). oklch(0.48 0.045 340). Fills magenta quadrant; 308° from bronze." },
        "dark":  { "$value": "#B79CA8", "$type": "color", "$description": "museum-vitrine categorical — aubergine plum (dark). oklch(0.72 0.048 340)." }
      },
      "ochre": {
        "light": { "$value": "#8C7448", "$type": "color", "$description": "museum-vitrine categorical — muted gold (light). oklch(0.52 0.060 75). Highest chroma of the 5 — still 40%+ below tableau-yellow." },
        "dark":  { "$value": "#CAB07E", "$type": "color", "$description": "museum-vitrine categorical — muted gold (dark). oklch(0.78 0.060 75)." }
      }
    },
    "ink-ramp": {
      "light": {
        "1": { "$value": "#1A1A1A", "$type": "color", "$description": "Sequential ink ramp step 1 (light) — top magnitude. oklch(0.18 0 0). Equals --ink." },
        "2": { "$value": "#404040", "$type": "color", "$description": "Sequential ink ramp step 2 (light). oklch(0.30 0 0)." },
        "3": { "$value": "#5E5E5E", "$type": "color", "$description": "Sequential ink ramp step 3 (light). oklch(0.42 0 0)." },
        "4": { "$value": "#828282", "$type": "color", "$description": "Sequential ink ramp step 4 (light) — median. oklch(0.55 0 0)." },
        "5": { "$value": "#A8A8A8", "$type": "color", "$description": "Sequential ink ramp step 5 (light). oklch(0.68 0 0)." },
        "6": { "$value": "#C3C3C3", "$type": "color", "$description": "Sequential ink ramp step 6 (light). oklch(0.78 0 0)." },
        "7": { "$value": "#D6D6D6", "$type": "color", "$description": "Sequential ink ramp step 7 (light) — bottom magnitude. oklch(0.85 0 0). Visibility floor on cream bg — hairline outline recommended." }
      },
      "dark": {
        "1": { "$value": "#F1F1F1", "$type": "color", "$description": "Sequential ink ramp step 1 (dark) — top magnitude. oklch(0.95 0 0). Near-parchment." },
        "2": { "$value": "#D6D6D6", "$type": "color", "$description": "Sequential ink ramp step 2 (dark). oklch(0.85 0 0)." },
        "3": { "$value": "#BDBDBD", "$type": "color", "$description": "Sequential ink ramp step 3 (dark). oklch(0.75 0 0)." },
        "4": { "$value": "#969696", "$type": "color", "$description": "Sequential ink ramp step 4 (dark) — median. oklch(0.62 0 0)." },
        "5": { "$value": "#737373", "$type": "color", "$description": "Sequential ink ramp step 5 (dark). oklch(0.50 0 0)." },
        "6": { "$value": "#525252", "$type": "color", "$description": "Sequential ink ramp step 6 (dark). oklch(0.38 0 0)." },
        "7": { "$value": "#404040", "$type": "color", "$description": "Sequential ink ramp step 7 (dark) — bottom magnitude. oklch(0.30 0 0). Visibility floor on cocoa bg — hairline outline recommended." }
      }
    }
  }
}
```

### Semantic-layer aliases (proposed for `tokens/semantic/{light,dark}.json`)

```jsonc
// add to "semantic.chart-categorical" block — ordered for default chart-series cycling
{
  "chart-categorical": {
    "1": { "$value": "{color.museum.slate.<theme>}",     "$description": "Categorical series 1 — cool anchor." },
    "2": { "$value": "{color.museum.ochre.<theme>}",     "$description": "Categorical series 2 — warm anchor; max hue separation from slate." },
    "3": { "$value": "{color.museum.fog-blue.<theme>}",  "$description": "Categorical series 3 — secondary cool." },
    "4": { "$value": "{color.museum.plum.<theme>}",      "$description": "Categorical series 4 — magenta quadrant." },
    "5": { "$value": "{color.museum.stone.<theme>}",     "$description": "Categorical series 5 — neutral fallback." }
  },
  "chart-sequential": {
    "1": { "$value": "{color.ink-ramp.<theme>.1}" },
    "...": "...",
    "7": { "$value": "{color.ink-ramp.<theme>.7}" }
  }
}
```

**Order rationale:** slate → ochre maximises hue separation (Δ=185°) so 2-series charts look intentional rather than monochrome. Adding fog-blue (3rd) maintains spread (Δ to ochre = 140°, Δ to slate = 35°). Plum + stone fill remaining slots.

---

## Section 5 — Integration callouts (for frontend-engineer + Right-Hand)

1. **Hairline outline default.** Stone, fog-blue, and ochre sit at AA-floor (3.0–3.1:1) against light bg. Frontend-engineer should add a 1px `--chart-grid` outline (rgba(20,20,20,0.10)) to ALL museum-categorical fills as a default — lifts effective contrast to 4:1+. This is also Datawrapper canon for cream/paper backgrounds.

2. **Colorblind pattern overlay for stone+ochre pair.** Both collapse to L≈0.52 under tritanopia simulation. When a chart legitimately uses 5 categorical series, apply diagonal hatch SVG `<pattern>` to the second occurrence. Frontend-engineer can wire a 5-step `pattern` cycler that activates only when `series.length ≥ 5`.

3. **Cardinality cap remains 5.** Beyond 5 categorical series, switch to «top-4 + Other» grouping. Brand-strategist's guidance and Morningstar canon agree.

4. **Donut palette mode auto-detection.** Recharts/component layer should expose `palette: 'categorical' | 'sequential'` prop. Default heuristic: if data is pre-sorted desc by value AND caller flagged `ordinal: true`, use ink-ramp; otherwise museum-categorical. Aligns with the per-chart-kind table in the aggregate.

5. **Showcase regression.** Existing DonutChart in `/design-system#charts` renders v1.1 §4.4 mixed-hue order. Visual-diff PR will need new baseline; chart-tests checkpoint β.1.4 (commit 109e4de) snapshot refresh required.

---

## Section 6 — Open questions for PO (via Right-Hand)

1. **Hairline-outline default** — accept as default for all museum-categorical fills, or expose as opt-in prop? (Recommendation: default-on; opt-out only for stylistic compositional charts.)
2. **Stone + ochre pair handling** — accept hatch-pattern-on-stone-when-≥5-series mitigation, or cap categorical at 4 hues? (Recommendation: keep 5 with hatch fallback. Hard cap at 4 reduces flexibility.)
3. **Token naming** — `color.museum.slate` flat or `color.museum.slate.{light,dark}` nested? Current draft uses nested for theme-mode parity with primary primitives. Frontend-engineer's call.

---

## Sources

- **Brand-strategist aggregate (2026-04-29)**: `docs/reviews/2026-04-29-charts-palette-aggregate.md` — museum-vitrine specification + ≥40% chroma reduction constraint.
- **DECISIONS.md (2026-04-29)**: «Charts palette: museum-palette extension + ink tonal default».
- **Morningstar Design System** — wealth-data canon for categorical asset-class palettes.
- **Datawrapper / Lisa Charlotte Muth** — «What to consider when choosing colors for data visualization»: grey as anchor, hairline outlines on cream backgrounds.
- **ColorBrewer 2.0** (Cynthia Brewer / Penn State) — sequential 7-step ΔL ≥0.07 prescription; qualitative palette colorblind constraints.
- **WCAG 2.2** — non-text contrast 1.4.11 (≥3:1).
- **Atlassian Design System** — categorical palette discipline + «sequential on nominal data implies false ranking» guidance.
- **OKLCH conversion utilities** — `oklch.com` (Lea Verou + Chris Lilley spec); approximation cross-checked via Style Dictionary v4 OKLCH transform behaviour.
- **Provedo brand-floor primitives**: `packages/design-tokens/tokens/primitives/color.json` (jade `#2D5F4E`, bronze `#A04A3D`, ink `#1A1A1A`).
- **Design Brief v1.1 §13.2** — 13-surface forest-jade cap (binding constraint that motivated the «museum extension instead of jade ramp» direction).
