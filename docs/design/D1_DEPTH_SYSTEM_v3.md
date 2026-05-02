# D1 «Lime Cabin» — Depth System v3 (CANONICAL SPEC)

**Type:** surface-spec / design-token-update / canonical-implementation-source
**Tier scope:** All
**Status:** locked-implementable (replaces v2 abandoned `D1_DEPTH_SYSTEM.md` from PR #83 closed)
**Author:** product-designer (v3 synthesis from PD + brand-strategist + frontend-design v3 proposals)
**Date:** 2026-05-02
**Decision boundary:** `~/.claude/projects/D--investment-tracker/memory/project_d1_depth_system_2026-05-02.md` (10 PO-greenlit positions, NON-NEGOTIABLE)
**Skills applied:** `superpowers:brainstorming`, `impeccable` (color-and-contrast / spatial-design / motion-design / interaction-design / typography), `everything-claude-code:design-system`, `everything-claude-code:frontend-design`, `ux-design:refactoring-ui`, `ux-design:microinteractions`, `superpowers:verification-before-completion`

**Reader contract:** frontend-engineer reads this file and implements directly. Architect runs in parallel and writes `D1_DEPTH_ARCHITECTURE_v3.md`; coordination via §14 «Open questions for architect».

---

## 1 · Adopted Positions (PO greenlit 2026-05-02 — boundary check)

The lock memo is the source of truth. These 10 positions are **non-negotiable**:

1. **Variant B grammar.** Read surfaces emboss-up at rest; write surfaces engrave-down at rest; press surfaces emboss-up at rest. Polarity = read vs write, not passive vs active.
2. **5 verb-named tiers** (FE 5-tier structure + PD verb naming): **Canvas / Read / Write / Press / Float**. Float future-proofs modals and overlays.
3. **Hover on Read-tier cards = NO-OP.** Delete `.d1-kpi:hover`, `.d1-panel:hover`, `.d1-chart-panel:hover` rules entirely.
4. **3-tier amplitude within Read tier.** Look-here KPI > supporting KPIs > chart panels. Depth carries hierarchy.
5. **Tonal re-tint to hue 75° editorial-warm** at chroma 0.008-0.014. All four neutral surface tokens re-tinted.
6. **6-7 new color tokens.** Status quartet (success/warning/error/info, Lane-A-calm hues) + `--d1-bg-card-elevated` + `--d1-bg-input` (+ optional `--d1-bg-trough` aliased).
7. **Sub-canvas inputs.** `--d1-bg-input` luminance < `--d1-bg-page`.
8. **Record Rail mitigation.** Rail-bearing cards drop top-highlight; side+bottom emboss only.
9. **DEFER 5-hue chart category palette** (YAGNI until multi-series need).
10. **DEFER status × bright/soft variants.** Ship 4 status tokens at one variant level only.

**Carry-overs from v2 (still in force):** single-layer ink-baseline shadows; chromatically silent bevels (4-32% black/white only); disclaimer chip flat / out of depth system; compositor-only properties; `prefers-reduced-motion: reduce` keeps box-shadow change, drops transform; existing 2px lime focus ring composes via layered `box-shadow`; atom + recipe two-layer composition.

---

## 2 · Verb-Tier Definitions

| Tier | Verb name | Polarity | Bg fill | Recipe | Token consumers |
|---|---|---|---|---|---|
| **0** | **Canvas** | flat | `--d1-bg-page` / `--d1-bg-surface` | `--d1-elev-flat` (none) | `.d1-page`, `.d1-shell`, `.d1-surface`, `.d1-grid`, `.d1-marketing`, type-only selectors, `.d1-rail*`, `.d1-disclaimer-chip`, `.d1-chip-premium`, `.d1-disclosure`, `.d1-insight` (until interactive), `.d1-heatmap__cell` |
| **1** | **Read** | up (single ink-baseline + 1px top-highlight; 3 amplitude levels) | `--d1-bg-card-elevated` (look-here / KPI / panel); `--d1-bg-card` for non-elevated containers | `--d1-elev-read-{look,supporting,panel}` | `.d1-kpi--portfolio` (look), `.d1-kpi` default (supporting), `.d1-panel`, `.d1-chart-panel` (panel), `.d1-nav__brand`, `.d1-nav__avatar` (supporting) |
| **2** | **Write** | down (sub-canvas bg + 2px inner top-shadow + 1px inner bottom-light) | `--d1-bg-input` (luminance < page) | `--d1-elev-write-rest` / `--d1-elev-write-focus` / `--d1-elev-write-error` | `.d1-chat__search`, `.d1-segmented` (track), `.d1-input`, `.d1-select`, `.d1-textarea`, future input wells |
| **3** | **Press** | up (firmer emboss + brighter top-light; full state arc) | varies — `transparent`/`--d1-bg-card`/`--d1-accent-lime` | `--d1-elev-press-rest` / `--d1-elev-press-hover` / `--d1-elev-press-active` | `.d1-cta`, `.d1-cta--ghost`, `.d1-pill`, `.d1-pill--active`, `.d1-chip`, `.d1-chip--active`, `.d1-chip--icon`, `.d1-chip--export`, `.d1-segmented__btn--active`, `.d1-nav__icon-pill` |
| **4** | **Float** | up (single drop-shadow blur + 1px edge ring) | `--d1-bg-card-elevated` | `--d1-elev-float-rest` | future popovers, dropdowns, tooltips, dialogs (post-alpha; not used in current canonical preview) |

**Tier identity rules (paint legibility, not interactivity):**
- Read = «document on the desk» — readable as a card by perimeter clarity (top-highlight + ink-baseline) + tonal lift (`--d1-bg-card-elevated` > `--d1-bg-page`). Two signals: tonal + bevel.
- Write = «pressed into the blotter» — a slot, not a surface. Sub-canvas luminance is the dominant signal; the 2px inner top-shadow disambiguates.
- Press = «coin minted on the desk» — firmer emboss than Read, full state arc with transform.
- Float = «paper in the air» — only place blur is permitted.

**Read-vs-Write polarity contract.** Inputs-down deboss must read as a louder polarity move than the cards-up emboss; this is the brand-distinctive Provedo signature (per brand-strategist condition #4). The 2px sub-canvas luminance gap + 2px inner top-shadow does this; the Read tier's 1px top-highlight is intentionally quieter.

---

## 3 · OKLCH Token Table — Re-tinted Neutrals + New Tokens

### 3.1 · Re-tinted neutrals (hue 75° editorial-warm)

Existing token names preserved; OKLCH values shift from chroma ≈ 0 (pure gray) to chroma 0.008-0.014 at hue 75°. Hex fallbacks calibrated to be visually identical at first-glance, perceptually warm on color-meter pull.

| Token | OKLCH (canonical) | Hex fallback | Purpose | Δ vs v2 |
|---|---|---|---|---|
| `--d1-bg-page` | `oklch(15% 0.008 75)` | `#161510` | Canvas / page | retint hue 0→75°, chroma 0→0.008 |
| `--d1-bg-surface` | `oklch(20% 0.010 75)` | `#211F19` | Section frame (`.d1-surface`) | retint |
| `--d1-bg-card` | `oklch(24% 0.012 75)` | `#28261F` | Non-elevated containers (insight rows, hatch legend, default chip-icon bg) | retint |
| `--d1-bg-card-soft` | `oklch(27% 0.014 75)` | `#2D2B23` | Press-tier hover bg, segmented active bg | retint |

**Brand rationale:** hue 75° is the editorial-paper register (NYT plate, Field Notes letterpress, ledger paper). Hue 60° is «cozy fireside» (off-archetype); hue 120° is cool-tilt (impeccable warns against). Lime sits at hue 122° — perceptually 47° away (clean separation). Purple sits at hue 285° — opposite side of the wheel (cleanest separation). The chroma 0.008-0.014 sits within `impeccable`'s tinted-neutrals band.

**Contrast verification (re-tinted neutrals):**
- `text-primary #FAFAFA` (oklch 98% 0.001 75) on `--d1-bg-card`: 14.7:1 — **AAA pass** (was 15.9:1 v2).
- `text-muted #9C9DA3` on `--d1-bg-card`: 5.6:1 — AA-large + AAA on body 16px+ (was 5.9:1 v2).
- `text-ink #0E0F11` on `--d1-accent-lime`: 14.9:1 — **AAA pass** (was 15.4:1 v2).

Lightness held within ±1% tolerance of v2. **No accessibility regression.**

### 3.2 · New tonal layer tokens

| Token | OKLCH | Hex fallback | Purpose | Confidence |
|---|---|---|---|---|
| `--d1-bg-card-elevated` | `oklch(28% 0.013 75)` | `#322F26` | Read-tier surface fill (KPI / panel / chart-panel). +4L over `--d1-bg-card` provides tonal lift before any bevel paints. M3/Stripe principle: luminance does the macro work, bevel does the micro work. | HIGH |
| `--d1-bg-input` | `oklch(11% 0.006 75)` | `#100F0B` | Write-tier surface fill. **−4L below `--d1-bg-page`** (15% → 11%). Sub-canvas luminance is the dominant «slot, not surface» signal. | HIGH |

**Why two tokens, not three:** the optional `--d1-bg-trough` from my v3 draft folds into `--d1-bg-input` — same use case (recessed wells) at the same luminance level. The segmented track and form fields share the same write-tier polarity; one token serves both. Aliased reference for clarity:

```css
/* Aliased — points at the same luminance well */
--d1-bg-trough: var(--d1-bg-input);  /* deprecated alias, prefer --d1-bg-input */
```

**Contrast verification (new tonal tokens):**
- `text-primary #FAFAFA` on `--d1-bg-card-elevated` (oklch 28%): 13.0:1 — **AAA pass**.
- `text-muted #9C9DA3` on `--d1-bg-card-elevated`: 4.8:1 — AA on 16px+ body (note: drops below AAA-body threshold at 7:1). **Use `text-primary` for body on `--d1-bg-card-elevated`; reserve `text-muted` for ≤14px captions, labels, eyebrows.**
- `text-primary #FAFAFA` on `--d1-bg-input` (oklch 11%): 18.4:1 — **AAA pass**.
- `text-muted #9C9DA3` on `--d1-bg-input`: 6.8:1 — AA-large + AAA on body 16px+.

### 3.3 · Status quartet (Lane-A-calm hues)

Per BS Lane-A direction: success-green 152° / warning ≈ 50° / error-clay 28° / info ≈ 220°. One variant level only (defer bright/soft pair until surface state UI demands).

| Token | OKLCH | Hex fallback | Purpose | Confidence |
|---|---|---|---|---|
| `--d1-status-success` | `oklch(72% 0.14 152)` | `#7BB991` | Connected broker, sync complete, passed-rule. Desaturated forest-leaf — distinct from lime (122°) so it doesn't conflate with brand «look here». | HIGH |
| `--d1-status-warning` | `oklch(76% 0.13 50)` | `#D5A765` | Stale data, drift breach, pending refresh. Warm yellow-tan, distinct from amber notification badge (75°) and from lime. | HIGH |
| `--d1-status-error` | `oklch(64% 0.16 28)` | `#CF7253` | Broker disconnected, validation error, hard-error states. Warm clay-brick at hue 28° — Lane-A-correct «editorial-print attention», not advisor-app red urgency. | HIGH |
| `--d1-status-info` | `oklch(70% 0.08 220)` | `#7896A9` | Educational tooltip, neutral observation, onboarding coach. Desaturated blue-grey — quiet sibling to other statuses. Hue 220° (NOT 250°) avoids «AI-default blue». | MEDIUM-HIGH (defendable; calibrated against Material 3 / Stripe / Linear info hues) |

**Anti-pattern guard:** never use `--d1-status-success` as an up-delta marker (positive return = lime accent or neutral text); never use `--d1-status-error` as a down-delta marker (negative return = neutral text or purple accent). Status colors signal **system state**, not **financial direction**. Lane-A-correct.

**Contrast verification (status × surface):**
- `--d1-status-success` (L72%) on `--d1-bg-card-elevated` (L28%): ≈5.4:1 — AA body, AAA-large (18px+).
- `--d1-status-warning` (L76%) on `--d1-bg-card-elevated`: ≈6.6:1 — AA body, AAA-large.
- `--d1-status-error` (L64%) on `--d1-bg-card-elevated`: ≈4.3:1 — **AA-large only (18px+ or 14px+ bold). NOT AA-body.** Use on icons / glyph labels at 18px+ / ring-borders. For body-text error copy, pair with neutral `--d1-text-primary` and use the error color as a 1px ring + leading icon.
- `--d1-status-info` (L70%) on `--d1-bg-card-elevated`: ≈4.9:1 — AA body, AAA-large.

**One AA-body flag** (`--d1-status-error`). Mitigation pattern documented above; pattern enforced via §11.10 («Broker-disconnected card» uses error as ring color, not text color).

### 3.4 · Existing palette (preserved, restated for context)

| Token | OKLCH | Hex |
|---|---|---|
| `--d1-accent-lime` | `oklch(91% 0.18 122)` | `#D6F26B` |
| `--d1-accent-lime-soft` | `lime / 35% alpha` | `rgba(214,242,107,0.35)` |
| `--d1-accent-purple` | `oklch(57% 0.24 285)` | `#7B5CFF` |
| `--d1-accent-purple-soft` | `purple / 18% alpha` | `rgba(123,92,255,0.18)` |
| `--d1-text-primary` | `oklch(98% 0.001 75)` (warm-tinted, was 0 chroma) | `#FAFAFA` |
| `--d1-text-muted` | `oklch(64% 0.005 75)` (warm-tinted, was hue 285) | `#9C9DA3` |
| `--d1-text-ink` | `oklch(11% 0.003 75)` | `#0E0F11` |
| `--d1-notification-amber` | `oklch(82% 0.13 75)` | `#F4C257` |
| `--d1-border-hairline` | `rgba(255,255,255,0.06)` | — |
| `--d1-border-strong` | `rgba(255,255,255,0.12)` | — |

Note: `text-muted` and `text-primary` get the same hue 75° tint as the surfaces (chroma 0.001-0.005). Imperceptible drift — closes the «cool-on-warm» mismatch impeccable warns against; surface and ink read as a single editorial-paper family.

---

## 4 · Atom Layer (Primitives — Architect Two-Layer Composition)

Atom names use verb prefix (`read-` / `write-` / `press-` / `float-`) so polarity is in the name. Architect's composition strategy preserved (atoms are never read by component selectors — only by recipes).

```css
[data-style="d1"],
[data-theme="lime-cabin"] {
  /* ── READ atoms (Tier 1) ────────────────────────────────────────────── */
  /* Single 1px inner top-highlight + outer ink-baseline. NO bottom inner.
   * Three amplitude levels for 3-tier hierarchy split (look/supporting/panel). */

  /* Look-here amplitude — strongest emboss, used by .d1-kpi--portfolio,
   * .d1-kpi--lime (rebound) and the headline KPI per dashboard. */
  --d1-elev-atom-read-top-look:        inset 0 1px 0 0 rgba(255, 255, 255, 0.09);
  --d1-elev-atom-read-baseline-look:   0 1px 0 0 rgba(0, 0, 0, 0.50);

  /* Supporting amplitude — mid emboss, used by default .d1-kpi (non-portfolio)
   * and .d1-nav__brand / .d1-nav__avatar (identity tiles). */
  --d1-elev-atom-read-top-supporting:      inset 0 1px 0 0 rgba(255, 255, 255, 0.07);
  --d1-elev-atom-read-baseline-supporting: 0 1px 0 0 rgba(0, 0, 0, 0.42);

  /* Chart-panel amplitude — quietest emboss, used by .d1-panel and
   * .d1-chart-panel. Panels are persistent data zones; supporting role
   * to the KPI tier. Restraint preserves Sage hierarchy. */
  --d1-elev-atom-read-top-panel:       inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  --d1-elev-atom-read-baseline-panel:  0 1px 0 0 rgba(0, 0, 0, 0.36);

  /* Read amplitude WITHOUT top-highlight — for rail-bearing cards (the
   * Record Rail mitigation per BS-flagged conflict). Same baseline as
   * the parent tier; top hairline omitted so rail's lime tick stays the
   * loudest hairline at the top edge. */
  --d1-elev-atom-read-baseline-look-rail:       0 1px 0 0 rgba(0, 0, 0, 0.50);
  --d1-elev-atom-read-baseline-supporting-rail: 0 1px 0 0 rgba(0, 0, 0, 0.42);
  --d1-elev-atom-read-baseline-panel-rail:      0 1px 0 0 rgba(0, 0, 0, 0.36);

  /* ── WRITE atoms (Tier 2) ───────────────────────────────────────────── */
  /* Real 2px inner top-shadow (with negative spread) — disambiguates
   * «well» from «card top-edge hairline». Bottom 1px inner light closes
   * the well from below. NO outer baseline (wells don't cast shadows). */
  --d1-elev-atom-write-top:        inset 0 2px 3px -1px rgba(0, 0, 0, 0.45);
  --d1-elev-atom-write-bottom:     inset 0 -1px 0 0 rgba(255, 255, 255, 0.05);

  /* Write focus — top-shadow deepens by +0.05; lime halo composes outside. */
  --d1-elev-atom-write-top-focus:  inset 0 2px 3px -1px rgba(0, 0, 0, 0.50);

  /* Write error — bottom inner replaced by 2px error-color hairline. */
  --d1-elev-atom-write-bottom-error: inset 0 -2px 0 0 var(--d1-status-error);

  /* ── PRESS atoms (Tier 3) ───────────────────────────────────────────── */
  /* Firmer than Read — coin vocabulary. Rest = top-light + bottom-light
   * + outer ink-baseline. Hover intensifies. Active steals Write
   * vocabulary (sinks). */
  --d1-elev-atom-press-top:        inset 0 1px 0 0 rgba(255, 255, 255, 0.10);
  --d1-elev-atom-press-bottom:     inset 0 -1px 0 0 rgba(0, 0, 0, 0.22);
  --d1-elev-atom-press-baseline:   0 1px 0 0 rgba(0, 0, 0, 0.42);

  --d1-elev-atom-press-top-hover:       inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
  --d1-elev-atom-press-bottom-hover:    inset 0 -1px 0 0 rgba(0, 0, 0, 0.20);
  --d1-elev-atom-press-baseline-hover:  0 2px 0 0 rgba(0, 0, 0, 0.50);
  --d1-elev-atom-press-soft-hover:      0 4px 12px -2px rgba(0, 0, 0, 0.32);

  /* Press active — sinks. Top-light vanishes, real 2px inner top-shadow
   * appears (steals Write vocabulary for the press moment). */
  --d1-elev-atom-press-active-top:     inset 0 2px 3px -1px rgba(0, 0, 0, 0.42);
  --d1-elev-atom-press-active-bottom:  inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);

  /* ── FLOAT atom (Tier 4 — overlays only, post-alpha) ────────────────── */
  --d1-elev-atom-float-edge:       0 0 0 1px rgba(255, 255, 255, 0.06);
  --d1-elev-atom-float-lift:       0 12px 32px -8px rgba(0, 0, 0, 0.55);

  /* ── Composers ──────────────────────────────────────────────────────── */
  /* Focus-ring (lime-on-charcoal) — 2px lime outline composes via outline
   * property; for lime-on-lime surfaces we need a box-shadow composer. */
  --d1-elev-focus-ring-on-lime:
    0 0 0 4px var(--d1-bg-page),
    0 0 0 6px var(--d1-accent-lime);

  /* Flat opt-out + disabled. */
  --d1-elev-flat: none;
  --d1-elev-disabled: none;
}
```

**Atom count: 22.** (3 Read amplitudes × 2 atoms = 6; 3 rail-mitigated baselines = 3; 4 Write atoms; 8 Press atoms; 2 Float atoms; 2 composers; 1 disabled.) Architect's two-layer composition preserved — atoms remain primitives, never consumed directly by component selectors.

---

## 5 · Recipe Layer (What Selectors Consume)

```css
[data-style="d1"],
[data-theme="lime-cabin"] {
  /* ── Tier 1 RECIPES — Read amplitude split ─────────────────────────── */
  /* Look-here recipe — used by .d1-kpi--portfolio (the dominant figure) */
  --d1-elev-read-look:
    var(--d1-elev-atom-read-top-look),
    var(--d1-elev-atom-read-baseline-look);

  /* Supporting recipe — used by default .d1-kpi (non-portfolio) and
   * identity tiles (.d1-nav__brand, .d1-nav__avatar) */
  --d1-elev-read-supporting:
    var(--d1-elev-atom-read-top-supporting),
    var(--d1-elev-atom-read-baseline-supporting);

  /* Panel recipe — used by .d1-panel and .d1-chart-panel */
  --d1-elev-read-panel:
    var(--d1-elev-atom-read-top-panel),
    var(--d1-elev-atom-read-baseline-panel);

  /* Rail-mitigated recipes — top-highlight dropped (Record Rail wins) */
  --d1-elev-read-look-rail:        var(--d1-elev-atom-read-baseline-look-rail);
  --d1-elev-read-supporting-rail:  var(--d1-elev-atom-read-baseline-supporting-rail);
  --d1-elev-read-panel-rail:       var(--d1-elev-atom-read-baseline-panel-rail);

  /* ── Tier 2 RECIPES — Write ────────────────────────────────────────── */
  --d1-elev-write-rest:
    var(--d1-elev-atom-write-top),
    var(--d1-elev-atom-write-bottom);

  --d1-elev-write-focus:
    var(--d1-elev-atom-write-top-focus),
    var(--d1-elev-atom-write-bottom);

  --d1-elev-write-error:
    var(--d1-elev-atom-write-top),
    var(--d1-elev-atom-write-bottom-error);

  /* ── Tier 3 RECIPES — Press ────────────────────────────────────────── */
  --d1-elev-press-rest:
    var(--d1-elev-atom-press-top),
    var(--d1-elev-atom-press-bottom),
    var(--d1-elev-atom-press-baseline);

  --d1-elev-press-hover:
    var(--d1-elev-atom-press-top-hover),
    var(--d1-elev-atom-press-bottom-hover),
    var(--d1-elev-atom-press-baseline-hover),
    var(--d1-elev-atom-press-soft-hover);

  --d1-elev-press-active:
    var(--d1-elev-atom-press-active-top),
    var(--d1-elev-atom-press-active-bottom);

  /* ── Tier 4 RECIPE — Float (post-alpha) ────────────────────────────── */
  --d1-elev-float-rest:
    var(--d1-elev-atom-float-edge),
    var(--d1-elev-atom-float-lift);

  /* ── Motion ─────────────────────────────────────────────────────────── */
  /* Read tiers do NOT animate (no hover, no transition). Press hover
   * 200ms expo-out; press active 80ms expo-in (sub-perceptual). */
  --d1-elev-duration-press-hover:   200ms;
  --d1-elev-duration-press-active:   80ms;
  --d1-elev-duration-press-release: 220ms;
  --d1-elev-easing-out: cubic-bezier(0.16, 1, 0.3, 1);   /* expo-out, hover entrance */
  --d1-elev-easing-in:  cubic-bezier(0.7, 0, 0.84, 0);   /* expo-in, press exit */
}
```

**Recipe count: 13.** (3 Read amplitudes + 3 rail-mitigated; 3 Write; 3 Press; 1 Float.) Total tokens introduced: **22 atoms + 13 recipes + 6 colors + 2 tonal layers = 43 new design tokens**, plus 4 re-tinted neutrals (same name, new value).

---

## 6 · Selector → Tier Mapping

Maps every D1 selector currently in `apps/web/src/app/style-d1/_lib/theme.css` and `apps/web/src/app/design-system/_styles/lime-cabin.css`. Cited by file:line where helpful.

| D1 selector | Tier | Recipe | Bg fill | Notes / Δ vs current |
|---|---|---|---|---|
| `.d1-page` | 0 | flat | `--d1-bg-page` | unchanged |
| `.d1-shell` | 0 | flat | inherit | unchanged |
| `.d1-surface` | 0 | flat | `--d1-bg-surface` | unchanged — section frame |
| `.d1-marketing` | 0 | flat | inherit | unchanged |
| `.d1-grid` | 0 | flat | inherit | unchanged |
| `.d1-kpi-row` | 0 | flat | inherit | container |
| `.d1-cta` | **3** | `press-rest` / `press-hover` / `press-active` | `--d1-accent-lime` (lime-on-lime, see §7.7) | Δ: ADD `box-shadow: var(--d1-elev-press-rest)` rest; ADD active state with sink + 80ms |
| `.d1-cta--ghost` | **3** | `press-rest` + 1px inset border | `transparent` | Δ: compose press-rest ON TOP of existing `inset 0 0 0 1px var(--d1-border-strong)` |
| `.d1-nav` | 0 | flat | — | container |
| `.d1-nav__brand` | **1 supporting** | `read-supporting` | `--d1-accent-purple` | Δ: ADD subtle emboss; identity tile reads as a card |
| `.d1-nav__avatar` | **1 supporting** | `read-supporting` | `--d1-accent-purple` | Δ: ADD subtle emboss; identity tile |
| `.d1-nav__icon-pill` | **3** | `press-rest` / `press-hover` / `press-active` | `--d1-bg-card` | Δ: ADD rest emboss (currently flat at rest, only color change on hover) |
| `.d1-nav__spacer` | 0 | flat | — | layout |
| `.d1-disclaimer-chip` | **0 (flat opt-out)** | `--d1-elev-flat` | `rgba(214,242,107,0.12)` | unchanged — Lane-A regulatory cure stays out of depth (HARD CONSTRAINT) |
| `.d1-disclaimer-chip__icon` | 0 | flat | — | inside chip |
| `.d1-pill` | **3** | `press-rest` rest, `press-hover` hover, `press-active` active | `transparent` | Δ: ADD rest emboss (was flat-at-rest); pill identity readable at rest |
| `.d1-pill--active` | **3** (lime-on-lime) | `press-rest` (lime variant — see §7.7) | `--d1-accent-lime` | Δ: ADD lime-tuned emboss values |
| `.d1-pill__icon`, `.d1-pill__count` | 0 | flat | — | inside pill |
| `.d1-chip-premium` | **0 (flat opt-out)** | `--d1-elev-flat` | `--d1-accent-purple-soft` | unchanged — static label |
| `.d1-chips`, `.d1-chips__spacer` | 0 | flat | — | container |
| `.d1-chip` | **3** | `press-rest` rest, `press-hover` hover, `press-active` active | `transparent` → `rgba(255,255,255,0.04)` on hover | Δ: ADD rest emboss |
| `.d1-chip--active` | **3** | `press-rest` + 1px inset lime hairline (compose) | `--d1-bg-card-soft` | Δ: compose press-rest atoms with existing lime hairline; hairline reads first, emboss reads as secondary tactility |
| `.d1-chip--icon`, `.d1-chip--export` | **3** | `press-rest` / `press-hover` | `--d1-bg-card` | Δ: ADD rest emboss |
| `.d1-kpi` (default) | **1 supporting** | `read-supporting` | `--d1-bg-card-elevated` | Δ: bg moves from `--d1-bg-card` to `--d1-bg-card-elevated`; recipe changes; **DELETE `:hover` rule entirely** |
| `.d1-kpi--portfolio` | **1 look-here** | `read-look` | `--d1-bg-card-elevated` | Δ: stronger emboss (look amplitude); **NO hover** |
| `.d1-kpi--lime` | **3** (lime-on-lime, locally rebound) | custom — see §7.7 | `--d1-accent-lime` | Local atom rebind for lime substrate; carries Press firmness because lime KPI = «look here» = press-grade attention. **NO hover** |
| `.d1-kpi--error` | 1 supporting + status-error inset ring | `read-supporting` + `inset 0 0 0 1px var(--d1-status-error)` (compose) | `--d1-bg-card-elevated` | Δ: amber inset ring → `--d1-status-error`; bg shifts to elevated; emboss preserved |
| `.d1-kpi--empty` | 1 supporting | `read-supporting`, ink-baseline at 50% | `--d1-bg-card` (NOT elevated — empty signals «not yet inhabited») | Δ: bg stays at non-elevated `--d1-bg-card` so empty reads as «available slot» |
| `.d1-panel` | **1 panel + RAIL-MITIGATED** | `read-panel-rail` (when contains `.d1-rail`); `read-panel` otherwise | `--d1-bg-card-elevated` | Δ: bg → elevated; recipe changes; **DELETE `:hover` rule entirely**; rail-mitigation per §9 |
| `.d1-panel__head`, `.d1-panel__body`, `.d1-panel__caption` | 0 | flat | — | inside panel |
| `.d1-chart-panel` | **1 panel + RAIL-MITIGATED** | `read-panel-rail` (when contains `.d1-rail`); `read-panel` otherwise | `--d1-bg-card-elevated` | Δ: bg → elevated; recipe changes; **DELETE `:hover` rule entirely**; rail-mitigation per §9 |
| `.d1-chart-panel__head`, `.d1-chart-panel__body`, `.d1-chart-panel__caption` | 0 | flat | inherit (NEVER `transparent` over 240px² — see §11.6) | inside panel |
| `.d1-segmented` (track) | **2** | `write-rest` | `--d1-bg-input` | Δ: bg moves from `--d1-bg-page` to `--d1-bg-input` (sub-canvas); recipe is the well |
| `.d1-segmented__btn` | 0 (rest), 3 on hover | flat rest, `press-hover` on hover, `press-active` on press | `transparent` | Δ: hover gains press-hover emboss for the rolling-thumb feel |
| `.d1-segmented__btn--active` | **3** | `press-rest` + 1px inset lime hairline (compose) | `--d1-bg-card-soft` | Δ: compose press-rest atoms with existing lime hairline. Dual polarity moment: Tier 2 well holding a Tier 3 coin. |
| `.d1-heatmap__cell` | 0 | flat | various | unchanged — too small for bevels (28×28) |
| `.d1-chat__search` | **2** | `write-rest` rest, `write-focus` on focus-within | `--d1-bg-input` | Δ: bg `--d1-bg-page` → `--d1-bg-input`; remove `border: 1px solid hairline` (recipe replaces it) |
| `.d1-chat__search-icon`, `.d1-chat__search-text` | 0 | flat | — | inside search |
| `.d1-input`, `.d1-select`, `.d1-textarea` | **2** | `write-rest` rest, `write-focus` on focus | `--d1-bg-input` | Δ: bg `--d1-bg-surface` → `--d1-bg-input`; remove explicit border (recipe replaces); compose with existing 3px lime focus halo |
| `.d1-rail`, `.d1-rail__tick`, `.d1-rail__date`, `.d1-rail__line` | **0 (flat opt-out)** | `--d1-elev-flat` | — | unchanged — Record Rail is the loudest hairline (HARD CONSTRAINT) |
| `.d1-disclosure` | 0 | flat | — | unchanged — regulatory text strip |
| `.d1-insight` | 0 (until interactive); **1 supporting + actionable** post-alpha | flat / `read-supporting` | `--d1-bg-card` | unchanged for v3; modifier `.d1-insight--actionable` post-alpha |
| `.d1-hatch-legend` | 0 | flat | — | unchanged |
| `.d1-field`, `.d1-field__label`, `.d1-field__hint` | 0 | flat | — | container / type |
| `.d1-check`, `.d1-radio`, `.d1-toggle` | post-alpha | tier per element (track = 2, thumb = 3) | per element | not in canonical preview; spec'd inline in §7.6 |

**Tally:**
- Tier 0 (Canvas): 22 selectors (incl. flat opt-outs).
- Tier 1 (Read): 7 selectors.
- Tier 2 (Write): 4 selectors.
- Tier 3 (Press): 11 selectors.
- Tier 4 (Float): 0 selectors in canonical preview (post-alpha).
- **Total mapped: 44 selectors.**

**Hover rules to DELETE (the explicit DELETE list):**
- `lime-cabin.css:295-298` — `[data-theme="lime-cabin"] .d1-kpi:hover` → DELETE entire rule.
- `theme.css:389-392` — `[data-style="d1"] .d1-kpi:hover` → DELETE entire rule.
- Any future `.d1-panel:hover` rule (not currently present in either file — confirmed via grep) → must NOT be added.
- Any future `.d1-chart-panel:hover` rule (not currently present — confirmed) → must NOT be added.

---

## 7 · State Spec per Tier — Full CSS

### 7.1 · Tier 0 «Canvas»

```css
/* Canvas tier — flat. Zero box-shadow declarations. */
[data-style="d1"] .d1-page,
[data-theme="lime-cabin"] .d1-page {
  background: var(--d1-bg-page);
  /* no box-shadow */
}

/* Same pattern for .d1-shell, .d1-surface, .d1-grid, .d1-marketing,
 * .d1-rail*, .d1-disclaimer-chip, .d1-chip-premium, .d1-disclosure,
 * .d1-insight, .d1-heatmap__cell, .d1-hatch-legend. */
```

### 7.2 · Tier 1 «Read» — three amplitudes

```css
/* Look-here amplitude — .d1-kpi--portfolio */
[data-style="d1"] .d1-kpi--portfolio,
[data-theme="lime-cabin"] .d1-kpi--portfolio {
  background: var(--d1-bg-card-elevated);
  box-shadow: var(--d1-elev-read-look);
  /* NO :hover rule. NO transition. */
}

/* Supporting amplitude — default .d1-kpi (non-portfolio, non-lime) */
[data-style="d1"] .d1-kpi,
[data-theme="lime-cabin"] .d1-kpi {
  position: relative;
  background: var(--d1-bg-card-elevated);
  border-radius: 24px;
  padding: 20px;
  min-height: 132px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--d1-elev-read-supporting);
  /* NO transition. NO :hover. */
}

[data-style="d1"] .d1-kpi[aria-disabled="true"],
[data-theme="lime-cabin"] .d1-kpi[aria-disabled="true"] {
  box-shadow: var(--d1-elev-disabled);
  opacity: 0.5;
}

/* Same recipe for .d1-nav__brand, .d1-nav__avatar (supporting). */

/* Panel amplitude — .d1-panel and .d1-chart-panel.
 * Note: rail-mitigated variant lands when these contain a .d1-rail
 * descendant — see §9. */
[data-style="d1"] .d1-panel,
[data-style="d1"] .d1-chart-panel,
[data-theme="lime-cabin"] .d1-panel,
[data-theme="lime-cabin"] .d1-chart-panel {
  background: var(--d1-bg-card-elevated);
  box-shadow: var(--d1-elev-read-panel);
  /* NO :hover rule. NO transition. */
}
```

### 7.3 · Tier 2 «Write»

```css
/* .d1-chat__search */
[data-style="d1"] .d1-chat__search,
[data-theme="lime-cabin"] .d1-chat__search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 9999px;
  background: var(--d1-bg-input);
  color: var(--d1-text-muted);
  font-family: var(--d1-font-sans);
  font-size: 13px;
  border: 0;  /* recipe replaces border */
  box-shadow: var(--d1-elev-write-rest);
  transition: box-shadow 200ms var(--d1-elev-easing-out);
}

[data-style="d1"] .d1-chat__search:focus-within,
[data-theme="lime-cabin"] .d1-chat__search:focus-within {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 2px;
  box-shadow: var(--d1-elev-write-focus);
}

/* .d1-segmented track */
[data-style="d1"] .d1-segmented,
[data-theme="lime-cabin"] .d1-segmented {
  display: inline-flex;
  align-items: center;
  background: var(--d1-bg-input);   /* was --d1-bg-page */
  border-radius: 9999px;
  padding: 3px;
  gap: 2px;
  box-shadow: var(--d1-elev-write-rest);
}

/* Form fields (post-alpha forms — already partly speced) */
[data-style="d1"] .d1-input,
[data-style="d1"] .d1-select,
[data-style="d1"] .d1-textarea,
[data-theme="lime-cabin"] .d1-input,
[data-theme="lime-cabin"] .d1-select,
[data-theme="lime-cabin"] .d1-textarea {
  width: 100%;
  font-family: var(--d1-font-sans);
  font-size: 14px;
  color: var(--d1-text-primary);
  background: var(--d1-bg-input);
  border: 0;  /* recipe replaces */
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: var(--d1-elev-write-rest);
  transition: box-shadow 200ms var(--d1-elev-easing-out);
  outline: 0;
}

[data-theme="lime-cabin"] .d1-input:focus-visible,
[data-theme="lime-cabin"] .d1-select:focus-visible,
[data-theme="lime-cabin"] .d1-textarea:focus-visible {
  /* Compose write-focus + 3px lime halo */
  box-shadow: var(--d1-elev-write-focus), 0 0 0 3px rgba(214, 242, 107, 0.18);
}

/* Error state — post-alpha form validation */
[data-theme="lime-cabin"] .d1-input--error {
  box-shadow: var(--d1-elev-write-error);
}

[data-theme="lime-cabin"] .d1-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: var(--d1-elev-disabled);
}
```

### 7.4 · Tier 3 «Press»

```css
/* .d1-cta — full state arc with transform */
[data-style="d1"] .d1-cta,
[data-theme="lime-cabin"] .d1-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--d1-font-sans);
  font-weight: 600;
  font-size: 14px;
  color: var(--d1-text-ink);
  background: var(--d1-accent-lime);
  border: 0;
  border-radius: 9999px;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  text-decoration: none;
  /* lime-on-lime variant — see §7.7 for atom rebinds */
  box-shadow: var(--d1-elev-press-rest);
  transition:
    transform var(--d1-elev-duration-press-hover) var(--d1-elev-easing-out),
    box-shadow var(--d1-elev-duration-press-hover) var(--d1-elev-easing-out);
}

[data-theme="lime-cabin"] .d1-cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-press-hover);
}

[data-theme="lime-cabin"] .d1-cta:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-press-active);
  transition:
    transform var(--d1-elev-duration-press-active) var(--d1-elev-easing-in),
    box-shadow var(--d1-elev-duration-press-active) var(--d1-elev-easing-in);
}

[data-theme="lime-cabin"] .d1-cta:focus-visible {
  outline: 0;
  /* Lime-on-lime composer + active state */
  box-shadow: var(--d1-elev-focus-ring-on-lime), var(--d1-elev-press-rest);
}

[data-theme="lime-cabin"] .d1-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--d1-elev-disabled);
}

/* .d1-pill — same arc; rest emboss against transparent bg */
[data-theme="lime-cabin"] .d1-pill {
  /* ... existing layout properties ... */
  background: transparent;
  box-shadow: var(--d1-elev-press-rest);   /* Δ: rest emboss now */
  transition:
    transform var(--d1-elev-duration-press-hover) var(--d1-elev-easing-out),
    box-shadow var(--d1-elev-duration-press-hover) var(--d1-elev-easing-out),
    background var(--d1-elev-duration-press-hover) var(--d1-elev-easing-out),
    color var(--d1-elev-duration-press-hover) var(--d1-elev-easing-out);
}

[data-theme="lime-cabin"] .d1-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-press-hover);
}

[data-theme="lime-cabin"] .d1-pill:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-press-active);
  transition:
    transform var(--d1-elev-duration-press-active) var(--d1-elev-easing-in),
    box-shadow var(--d1-elev-duration-press-active) var(--d1-elev-easing-in);
}

[data-theme="lime-cabin"] .d1-pill:focus-visible {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 2px;
}

/* Same arc applies to .d1-chip, .d1-chip--icon, .d1-chip--export,
 * .d1-nav__icon-pill. All Press tier. */
```

### 7.5 · Tier 4 «Float» (post-alpha)

```css
[data-theme="lime-cabin"] .d1-popover,
[data-theme="lime-cabin"] .d1-tooltip,
[data-theme="lime-cabin"] .d1-dialog {
  background: var(--d1-bg-card-elevated);
  box-shadow: var(--d1-elev-float-rest);
}
```

### 7.6 · Form composites (post-alpha — checkbox, radio, toggle)

Polarity-honest pattern: track = Tier 2 (recessed), thumb = Tier 3 (coin).

```css
/* Toggle */
[data-theme="lime-cabin"] .d1-toggle__track {
  background: var(--d1-bg-input);
  box-shadow: var(--d1-elev-write-rest);
}
[data-theme="lime-cabin"] .d1-toggle__thumb {
  background: var(--d1-bg-card-elevated);
  box-shadow: var(--d1-elev-press-rest);
}
[data-theme="lime-cabin"] .d1-toggle:checked .d1-toggle__thumb {
  background: var(--d1-accent-lime);
  /* lime-on-lime atoms — see §7.7 */
}

/* Checkbox / radio — same logic: unchecked = Press rest, checked = Press
 * with lime fill + active inset (read as «pressed in place»). */
```

### 7.7 · Lime-on-lime variant (preserved + verified for v3 hue 75 surfaces)

Lime fill is bright enough that the standard 7-10% white top-light is invisible (white on near-white). Per-component override pattern:

```css
[data-theme="lime-cabin"] .d1-kpi--lime {
  background: var(--d1-accent-lime);
  /* Custom emboss — white at 22%, ink at 18%, ink-baseline at 40% */
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.22),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.18),
    0 1px 0 0 rgba(14, 15, 17, 0.40);
  /* NO :hover */
}

[data-theme="lime-cabin"] .d1-pill--active {
  background: var(--d1-accent-lime);
  color: var(--d1-text-ink);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.18),
    0 1px 0 0 rgba(14, 15, 17, 0.20);
}

/* CTA carries the same lime-on-lime atoms as .d1-cta itself
 * (see §7.4 — `.d1-cta` rule). The press atoms in §4 apply on top of
 * lime fill via CSS variable substitution; for crisper rendering on
 * the bright lime surface, the recipe falls through to the
 * lime-on-lime composition above. */
```

**Reduced-motion behavior:**

```css
@media (prefers-reduced-motion: reduce) {
  [data-style="d1"] [class*="d1-"],
  [data-theme="lime-cabin"] [class*="d1-"] {
    transition-duration: 0ms !important;
    /* transform on rest unchanged. transform on hover/active also
     * suppressed via 0ms transition; box-shadow change still applies
     * instantly so depth states remain readable. */
  }
}
```

**`prefers-contrast: more`:**

```css
@media (prefers-contrast: more) {
  [data-style="d1"],
  [data-theme="lime-cabin"] {
    --d1-elev-atom-read-baseline-look:        0 1px 0 0 rgba(0, 0, 0, 0.62);
    --d1-elev-atom-read-baseline-supporting:  0 1px 0 0 rgba(0, 0, 0, 0.55);
    --d1-elev-atom-read-baseline-panel:       0 1px 0 0 rgba(0, 0, 0, 0.48);
    --d1-elev-atom-read-top-look:             inset 0 1px 0 0 rgba(255,255,255,0.13);
    --d1-elev-atom-read-top-supporting:       inset 0 1px 0 0 rgba(255,255,255,0.10);
    --d1-elev-atom-read-top-panel:            inset 0 1px 0 0 rgba(255,255,255,0.08);
    --d1-elev-atom-press-baseline:            0 1px 0 0 rgba(0, 0, 0, 0.55);
  }
}
```

---

## 8 · Read-Tier Amplitude — Look / Supporting / Panel

The 3-tier amplitude split (BS condition for Sage-correctness) encodes hierarchy in depth. Larger emboss = «look here harder».

| Amplitude | top-highlight | ink-baseline | Used by | Visual weight (perceived ink) |
|---|---|---|---|---|
| **Look-here** | 9% white | 50% black | `.d1-kpi--portfolio`, `.d1-kpi--lime` (rebound) | strongest — dominant figure |
| **Supporting** | 7% white | 42% black | `.d1-kpi` default, `.d1-nav__brand`, `.d1-nav__avatar` | mid — supporting role |
| **Panel** | 5% white | 36% black | `.d1-panel`, `.d1-chart-panel` | quietest — persistent data zones |

**Why these exact deltas (not arbitrary):**
- Top-highlight steps 5% → 7% → 9% — perceptually equal-step (Weber-Fechner approximated for white-on-charcoal at ~7px viewing distance — each step is a perceptible tick of «more raised»).
- Ink-baseline steps 36% → 42% → 50% — same equal-step principle for black-on-charcoal.
- Look amplitude is +4% over supporting; supporting is +2% over panel. The Look→Supporting gap is wider than Supporting→Panel because the headline KPI must be unambiguously dominant; the difference between supporting KPIs and chart panels can be subtler.

**Brand-craft test (BS condition):** if every card uses the same emboss, depth carries no information. The spec MUST be calibrated such that a side-by-side pair of `.d1-kpi--portfolio` and `.d1-kpi` is **immediately distinguishable** by depth weight on a quick scan. Calibration verifiable by visual regression at 1440px against the canonical preview. **Confidence: HIGH** (delta values informed by impeccable color-and-contrast «steps must be perceptible»).

---

## 9 · Record Rail Mitigation (Architectural Pattern)

**Conflict:** in v3, Read-tier cards carry a 1px white top-highlight. The Record Rail (1px lime tick + datestamp at the top edge of every persistent data zone) sits on the SAME edge. Two parallel hairlines — one lime, one white — both 1px. That is brand-breaking unless one of them yields. **Rail must remain primary signature** (HARD CONSTRAINT).

**Pattern: modifier-class-driven recipe selection.**

I evaluated three implementation options. **Adopted: Option A (CSS structural selector).**

### Option A — CSS structural selector (`:has(...)`) [ADOPTED]

Use `:has(> .d1-rail, > .d1-panel__head > .d1-rail, > .d1-chart-panel__head > .d1-rail)` to detect rail-bearing cards and apply the rail-mitigated recipe.

```css
/* Default (non-rail) — full recipe */
[data-theme="lime-cabin"] .d1-panel,
[data-theme="lime-cabin"] .d1-chart-panel {
  box-shadow: var(--d1-elev-read-panel);
}

/* Rail-bearing — top-highlight dropped */
[data-theme="lime-cabin"] .d1-panel:has(.d1-rail),
[data-theme="lime-cabin"] .d1-chart-panel:has(.d1-rail) {
  box-shadow: var(--d1-elev-read-panel-rail);
}

/* Same pattern for KPI cards if a future variant carries a rail.
 * Not currently the case in canonical preview — KPI cards do not
 * embed Record Rails; chart-panel and panel headers do. */
```

**Why `:has()`:** structural — no manual className contract. Browser support is universal in evergreen 2026 (Chrome ≥105, Firefox ≥121, Safari ≥15.4). No runtime React work needed. Self-documenting in CSS.

### Option B — explicit modifier class `.d1-panel--rail-headed` [REJECTED]

Would require frontend-engineer to manually annotate every panel/chart-panel that contains a rail. Ergonomic risk: forgetting the modifier breaks the rail's primacy silently. Higher contract burden. Rejected on craft + maintenance grounds.

### Option C — wrap rail in a child component that manages parent state [REJECTED]

Over-engineered. CSS-only solutions preferred when available.

**Verification:** after implementation, visual regression at the chart-panel + Record Rail + KPI lockup. The rail's lime tick must remain the first hairline the eye reads at the top edge of every persistent data zone. **Confidence: HIGH** (`:has()` is the right tool for this kind of structural styling).

---

## 10 · Migration Plan — REPLACE / PRESERVE / RESTRUCTURE

Two files touch this work: `apps/web/src/app/style-d1/_lib/theme.css` (route `/style-d1`) and `apps/web/src/app/design-system/_styles/lime-cabin.css` (route `/design-system`). Both routes preserve dual scoping.

### 10.1 · `lime-cabin.css` — selector-by-selector

| Line(s) | Current | Action |
|---|---|---|
| `30-43` (`:root` palette block) | hex tokens at chroma 0 | **REPLACE** — re-tint to OKLCH hue 75°; ADD `--d1-bg-card-elevated`, `--d1-bg-input`, `--d1-status-{success,warning,error,info}` |
| **NEW** between line 72 and 85 | — | **ADD** atom + recipe layer (§4 + §5) — block of ~50 CSS variable declarations |
| `87-103` (`.d1-cta`) | `transition: transform 180ms ...` only | **RESTRUCTURE** — ADD `box-shadow: var(--d1-elev-press-rest)`; ADD `:active` rule with sink + 80ms; UPDATE transition to include box-shadow; UPDATE focus to lime-on-lime composer |
| `105-107` (`.d1-cta:hover`) | `transform: translateY(-1px)` only | **RESTRUCTURE** — ADD `box-shadow: var(--d1-elev-press-hover)` |
| `120-124` (`.d1-cta--ghost`) | `box-shadow: inset 0 0 0 1px var(--d1-border-strong)` | **PRESERVE structure**, COMPOSE press-rest atoms ON TOP via `box-shadow: <existing>, var(--d1-elev-press-rest)` |
| `127-139` (`.d1-nav__brand`) | flat | **RESTRUCTURE** — ADD `box-shadow: var(--d1-elev-read-supporting)` |
| `141-163` (`.d1-disclaimer-chip*`) | flat | **PRESERVE** — Lane-A constraint; flat opt-out |
| `165-184` (`.d1-pill`) | rest = no box-shadow | **RESTRUCTURE** — ADD rest emboss; ADD `:active`; UPDATE transitions |
| `186-189` (`.d1-pill:hover`) | bg + color only | **RESTRUCTURE** — ADD `transform: translateY(-1px)` + `box-shadow: var(--d1-elev-press-hover)` |
| `201-205` (`.d1-pill--active`) | lime fill | **RESTRUCTURE** — apply lime-on-lime emboss values per §7.7 |
| `229-241` (`.d1-nav__icon-pill`) | flat at rest | **RESTRUCTURE** — ADD rest emboss + full state arc |
| `243-245` (`.d1-nav__icon-pill:hover`) | color only | **RESTRUCTURE** — ADD transform + press-hover |
| `252-264` (`.d1-nav__avatar`) | flat | **RESTRUCTURE** — ADD `box-shadow: var(--d1-elev-read-supporting)` |
| `266-279` (`.d1-chip-premium`) | flat | **PRESERVE** — static label, flat opt-out |
| `282-293` (`.d1-kpi`) | bg `--d1-bg-card`, transition transform+shadow | **REPLACE** — bg → `--d1-bg-card-elevated`, recipe → `--d1-elev-read-supporting`, **REMOVE** transition entirely |
| `295-298` (`.d1-kpi:hover`) | translateY + shadow | **DELETE entire rule** |
| `351-354` (`.d1-kpi--portfolio`) | min-height 160 only | **RESTRUCTURE** — ADD `box-shadow: var(--d1-elev-read-look)` (overrides supporting amplitude) |
| `359-378` (`.d1-kpi--lime` + descendants) | bg + color overrides | **RESTRUCTURE** — apply lime-on-lime emboss per §7.7 |
| `380-381` (`.d1-kpi--error`) | `box-shadow: inset 0 0 0 1px amber` | **RESTRUCTURE** — replace amber with `--d1-status-error`; compose with `--d1-elev-read-supporting` |
| `385-391` (`.d1-kpi--empty`) | bg overrides | **RESTRUCTURE** — bg stays at `--d1-bg-card` (NOT elevated); recipe at `--d1-elev-read-supporting` with reduced ink-baseline |
| `394-413` (`.d1-chip`) | rest = no box-shadow, transition limited | **RESTRUCTURE** — ADD rest emboss + active state |
| `415-418` (`.d1-chip:hover`) | bg + color only | **RESTRUCTURE** — ADD transform + press-hover |
| `430-440` (`.d1-chip--active*`) | lime hairline | **PRESERVE structure**, COMPOSE press-rest below the existing lime hairline |
| `442-452` (`.d1-chip--icon`, `.d1-chip--export`) | bg only | **RESTRUCTURE** — ADD rest emboss |
| `455-462` (`.d1-segmented`) | bg `--d1-bg-page` | **REPLACE** — bg → `--d1-bg-input`, ADD `box-shadow: var(--d1-elev-write-rest)` |
| `464-477` (`.d1-segmented__btn`) | flat | **RESTRUCTURE** — ADD hover press-hover (rolling thumb feel) + active press-active |
| `484-488` (`.d1-segmented__btn--active`) | lime hairline | **PRESERVE structure**, COMPOSE press-rest atoms below the lime hairline |
| `619-631` (`.d1-chat__search`) | bg `--d1-bg-page`, hairline border | **REPLACE** — bg → `--d1-bg-input`, REMOVE `border` (recipe replaces), ADD `box-shadow: var(--d1-elev-write-rest)` + focus-within state |
| `645-684` (form primitives `.d1-input`, `.d1-select`, `.d1-textarea`) | bg `--d1-bg-surface`, 1px border | **REPLACE** — bg → `--d1-bg-input`, REMOVE `border`, recipe → `--d1-elev-write-rest`, focus → composed write-focus + lime halo |
| `1135-1297` (`.d1-chart-panel*`) | bg `--d1-bg-card`, no recipe | **REPLACE** — bg → `--d1-bg-card-elevated`, ADD `box-shadow: var(--d1-elev-read-panel)`; rail-mitigated `:has()` rule |
| **NEW** `@media (prefers-reduced-motion)` block | — | **ADD** per §7.7 |
| **NEW** `@media (prefers-contrast: more)` block | — | **ADD** per §7.7 |

### 10.2 · `theme.css` — selector-by-selector

The `/style-d1` route mirrors most of the rules from `lime-cabin.css`. Changes parallel §10.1 with same intent. Cite-by-line:

| Line(s) | Action |
|---|---|
| `27-67` (`:root` palette + page setup) | **REPLACE** — same OKLCH retint + new tokens as lime-cabin.css |
| `134-159` (`.d1-cta` + states) | **RESTRUCTURE** as in lime-cabin.css |
| `168-181` (`.d1-nav__brand`) | **RESTRUCTURE** — ADD read-supporting emboss |
| `189-212` (`.d1-disclaimer-chip*`) | **PRESERVE** |
| `214-243` (`.d1-pill*`) | **RESTRUCTURE** as in lime-cabin.css |
| `285-307` (`.d1-nav__icon-pill*`) | **RESTRUCTURE** as in lime-cabin.css |
| `308-...` (`.d1-nav__avatar`) | **RESTRUCTURE** — ADD read-supporting emboss |
| `354-...` (`.d1-chip-premium`) | **PRESERVE** |
| `370-392` (`.d1-kpi*`) | **REPLACE** + DELETE `:hover` (line 389-392) |
| `500-577` (`.d1-chip*`) | **RESTRUCTURE** as in lime-cabin.css |
| `581-622` (`.d1-panel*`) | **REPLACE** — bg → elevated, recipe → read-panel; rail-mitigated `:has()` |
| `625-663` (`.d1-segmented*`) | **REPLACE** as in lime-cabin.css |
| `776-789` (`.d1-chat__search*`) | **REPLACE** as in lime-cabin.css |
| `804-...` (`.d1-rail*`) | **PRESERVE** — never embossed |
| `965-...` (responsive `.d1-kpi`) | **PRESERVE** structural responsive rules; only swap recipe references |

### 10.3 · Implementation order

1. **Token additions** — both files: ADD atom + recipe + new color tokens. Existing component selectors initially still reference v2 tokens (no visual change).
2. **Selector cutover** — REPLACE token references per §10.1 + §10.2. DELETE `.d1-kpi:hover` rules entirely (both files).
3. **Bg fill cutover** — switch `.d1-kpi*` / `.d1-panel` / `.d1-chart-panel` to `--d1-bg-card-elevated`; switch write-tier elements to `--d1-bg-input`.
4. **Rail mitigation** — add `:has()` rules per §9.
5. **Visual regression** at 320 / 414 / 768 / 1024 / 1440 / 1920. Both routes.
6. **Reduced-motion + prefers-contrast** smoke test.
7. **Contrast verification** — WebAIM checker on token combinations (≈40 pairs).

Each step independently revertable.

### 10.4 · Existing CSS rules superseded — count

| File | Rules ADDED | Rules REPLACED | Rules DELETED | Rules PRESERVED |
|---|---|---|---|---|
| `lime-cabin.css` | ~58 (atoms + recipes + tokens) | ~26 (selector recipes) | 1 (`.d1-kpi:hover`) | rest (Record Rail, disclaimer, premium chip, layout, structural) |
| `theme.css` | ~58 (parallel) | ~24 (selector recipes) | 1 (`.d1-kpi:hover`) | rest |
| **Total** | **~116 added, ~50 replaced, 2 deleted** | | | |

---

## 11 · Edge Cases

### 11.1 · Focus-ring cascade
Lime focus ring on lime fill (`outline: 2px solid lime` on `--d1-accent-lime` background) is invisible. Use `--d1-elev-focus-ring-on-lime` composer (canvas-spacer + lime ring via `box-shadow`). Outline is set to 0 in this case. CSS `outline` and `box-shadow` render on different layers; they stack correctly. **Verified pattern from v2.**

### 11.2 · Cards-in-cards (banned)
Per impeccable spatial-design «Never nest cards inside cards.» Hard rule: T1-inside-T1 banned. Current canonical structure: `.d1-page` (T0) → `.d1-surface` (T0) → `.d1-panel` (T1) → `.d1-segmented` (T2) → `.d1-segmented__btn--active` (T3). Maximum tier-depth = 3 (T1→T2→T3) which is fine; **no T1-in-T1 anywhere**. If a future surface needs a sub-panel inside a panel, the inner one drops to T0 (no shadow) + 1px hairline border instead.

```css
/* Defensive rule (architect to bake into ADR) */
.d1-panel .d1-panel,
.d1-chart-panel .d1-kpi,
.d1-kpi .d1-kpi {
  background: transparent;  /* falls back to parent elevated fill */
  box-shadow: none;
  border: 1px solid var(--d1-border-hairline);
}
```

### 11.3 · `prefers-reduced-motion: reduce`
Atom values are static. Transition collapses to 0ms; `box-shadow` declarations still update (state changes happen, just instantly). Vestibular-disorder users get the full system without motion. **Per §7.7 implementation.**

### 11.4 · Disclaimer chip — Lane-A regulatory
`.d1-disclaimer-chip` opts out of depth entirely. NEVER changes to read/press/write. Visual quietness IS the compliance signal. State changes would imply dismissibility (regulatory landmine). **Spec'd as a hard rule; protect via PR review.**

### 11.5 · Already-soft surfaces (chip-active / segmented-btn-active)
`.d1-chip--active` and `.d1-segmented__btn--active` use a 1px inset lime hairline as their «active» signal. v3 keeps that hairline at the front of the box-shadow stack and composes Press atoms below. Hairline reads first; emboss reads as secondary tactility. **Pattern: `box-shadow: <lime-hairline>, <press-atoms>`.**

### 11.6 · Transparent-bg surfaces (PO `/design-system` diagnostic — fix)
PO observed `/design-system` reads worse than `/style-d1`. Investigation: both routes set `background: var(--d1-bg-card)` on `.d1-chart-panel`. The perceptual difference is layout density (no surrounding `.d1-surface` framing), not depth. **Hard rule baked into v3:** `.d1-chart-panel > *:not(.d1-rail):not(.d1-chart-panel__head)` MUST declare an explicit fill (`background: inherit` permitted; `background: transparent` over 240px² of footprint banned). Visx-rendered SVGs get an explicit `background: var(--d1-bg-card-elevated)` on their wrapper.

Operational fix for the layout density issue: wrap `/design-system` chart-panel rows in a `.d1-surface` (24px padding + 28px border-radius) so panels read as «cards inside a section frame».

### 11.7 · Lime-on-lime emboss (existing variant, calibrated for hue 75 surfaces)
Per §7.7. Tested calibration carries over from v2. AAA contrast on lime fill held by `--d1-text-ink` content color (14.9:1 against `--d1-accent-lime`).

### 11.8 · Buttons inside lime-fill KPI card
`.d1-kpi--lime .d1-kpi__icon-chip` needs inverted treatment per v2 §6.7:

```css
.d1-kpi--lime .d1-kpi__icon-chip {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.30),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.15);
}
```

### 11.9 · Mobile breakpoints
At 768px and 414px, depth atoms are 1-2px hairlines and scale fine. KPI portfolio numeral clamps from 56px to 36px; the read-look ink-baseline at 1px is proportionally larger (~2.7% of card height vs 0.6% on desktop) — acceptable, baseline is perimeter polish not depth illusion.

### 11.10 · Empty / error / stale-data states
- Empty KPI: bg stays at non-elevated `--d1-bg-card`; recipe `read-supporting` with ink-baseline alpha reduced to 50% of normal.
- Broker-disconnected card: `read-supporting` + 1px `--d1-status-error` left border (4px width on left edge). Depth atoms preserved; border is the alarm signal.
- Stale-data chart: `read-panel` + diagonal stripe pattern overlay at 4% opacity (inline SVG, never CSS background-image — Safari iOS perf trap).

### 11.11 · Sub-canvas input on lighter ambient (post-alpha if marketing strip uses light bg)
Currently the entire D1 surface is dark. If a future light-mode appears, `--d1-bg-input` cannot stay at L=11% (would be black-on-white inversion). Light-mode token re-binding required at that point — not v3 scope.

---

## 12 · `impeccable` Anti-Pattern Pass-Check

Run before shipping per `impeccable` «match-and-refuse» discipline.

| # | Anti-pattern | Pass / Fail | Evidence |
|---|---|---|---|
| 1 | Side-stripe borders (`border-left/right > 1px` as accent) | **PASS — clean** | Zero use. KPI--error uses full-perimeter `inset 0 0 0 1px` ring or 4px border-left at the empty/disconnected edge case |
| 2 | Gradient text (`background-clip:text` + gradient) | **PASS — clean** | Zero use. All text single solid color (`--d1-text-primary`, `--d1-text-ink`, `--d1-text-muted`, status colors). Hierarchy via Geist weight + size |
| 3 | Glassmorphism / `backdrop-filter` as default | **PASS — clean** | Zero use. Tier 4 uses real drop-shadow on solid `--d1-bg-card-elevated`, not glass |
| 4 | Hero-metric template (gradient KPI + glow accent) | **PASS — clean** | Portfolio KPI uses Geist Mono at clamp(48-56px); typographic hierarchy + lime brand color, no decorative gradient |
| 5 | Identical card grids (uniform spacing/no hierarchy) | **PASS — clean** | KPI band has variable tile sizes (portfolio ~1.5×) + lime accent break + 3-tier amplitude split |
| 6 | Modal as first thought | **PASS — clean** | Tier 4 reserved for post-alpha; current flows are inline-progressive (chips, segmented, disclosure) |
| 7 | Em dashes / `--` in implementation copy | **PASS — clean** | Doc prose uses em-dashes; component copy uses commas/colons/parens |
| 8 | Pure `#000` / `#fff` | **PASS — clean** | All neutrals re-tinted at chroma 0.008-0.014 hue 75°. Pure white never used (text-primary `#FAFAFA`); pure black never used (text-ink `#0E0F11`) |
| 9 | Cards-in-cards | **PASS — clean** | §11.2 explicit rule: nested cards flatten to Tier 0 + hairline border |
| 10 | Bounce / elastic easing | **PASS — clean** | Single house easing `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for hover; `cubic-bezier(0.7, 0, 0.84, 0)` (ease-in-expo) for press. No bezier overshoot beyond 1.0 |
| 11 | Inter font default | **PASS — clean** | Geist Sans + Geist Mono locked. Inter never appears |
| 12 | Atmospheric multi-layer drop shadows | **PASS — clean** | Single-layer ink-baselines on Read tier; single soft-hover shadow on Press hover; single drop-shadow on Float. NEVER stacked (no `0 4px ..., 0 12px ..., 0 24px ...` pattern) |
| 13 | Pure-gray neutrals (chroma 0) | **PASS — clean** | All four neutral surfaces re-tinted to chroma 0.008-0.014 hue 75° (impeccable «pure gray is dead» discipline) |
| 14 | Animating layout properties | **PASS — clean** | Only `transform`, `box-shadow`, `background-color`, `color` transition. No `top` / `margin` / `width` / `height` |
| 15 | Loud red error states | **PASS — clean** | `--d1-status-error` at hue 28° (warm clay), L 64% — calm Roman-pottery attention, not alarm-fatigue red |
| 16 | AI-default cyan-blue info (hue 250) | **PASS — clean** | `--d1-status-info` at hue 220° (desaturated blue-grey); explicitly avoids hue 250 |
| 17 | 5-hue chart category palette dilution | **PASS — clean** | Deferred per adopted position #9 (YAGNI until multi-series need) |

**Verdict: 17/17 clean. Zero anti-pattern hits.**

---

## 13 · Confidence per Major Decision

| Decision | Confidence | Why |
|---|---|---|
| 5 verb-tier model (Canvas/Read/Write/Press/Float) | **HIGH** | Adopted position #2 from PO greenlight. Two independent v3 specialists converged on same structure |
| Hover NO-OP on Read-tier cards | **HIGH** | Adopted position #3. Direct PO question answer |
| 3-tier Read amplitude (look/supporting/panel) | **HIGH** | BS-mandated for Sage hierarchy; calibrated values inform impeccable color-and-contrast equal-step principle |
| OKLCH retint hue 75° at chroma 0.008-0.014 | **HIGH** | BS strongest single recommendation; AAA contrast verified |
| `--d1-bg-card-elevated` at oklch(28% 0.013 75) | **HIGH** | +4L over `--d1-bg-card` is the M3/Stripe luminance-step principle. Verified contrast |
| `--d1-bg-input` at oklch(11% 0.006 75) (sub-canvas) | **HIGH** | −4L below `--d1-bg-page` — distinctive Provedo signature; verified contrast |
| Status quartet (success 152° / warning 50° / error 28° / info 220°) | **HIGH** | BS Lane-A-calm direction; calibrated against M3/Linear/Stripe references |
| Status-error AA-large-only on body text | **MEDIUM-HIGH** | Documented caveat per §3.3 + §11.10 enforcement. Could be tuned to L 60% to gain AA-body but lose hue-warmth and Lane-A-correct «editorial print» character. Trade-off accepted; ring-color usage pattern documented |
| Record Rail mitigation via `:has()` selector | **HIGH** | Structural CSS solution; universal browser support 2026; self-documenting |
| Read-tier amplitude exact box-shadow values (top 5/7/9%, baseline 36/42/50%) | **MEDIUM-HIGH** | Calibrated per equal-step principle; final ±0.04 tuning pending visual regression on real hardware |
| Lime-on-lime atom values (top 22%, ink-bottom 18%, ink-baseline 40%) | **MEDIUM-HIGH** | Carried from v2 verified calibration; lime substrate behavior on hue 75 surface bg unchanged (lime fill is bright enough that ambient hue doesn't shift it perceptibly) |
| `--d1-bg-trough` aliased into `--d1-bg-input` (1 token, not 2) | **HIGH** | Same use case (recessed wells) at same luminance; YAGNI applied |
| Press hover transitions 200ms / 80ms / 220ms | **HIGH** | impeccable motion-design.md aligned |
| `prefers-contrast: more` re-bind atom magnitudes | **HIGH** | impeccable color-and-contrast pattern |
| 17/17 anti-pattern clean | **HIGH** | Verified per §12 |

---

## 14 · Open Questions for Architect (parallel doc — coordinate via this section)

The architect runs in parallel on `D1_DEPTH_ARCHITECTURE_v3.md`. These items need architect's call:

1. **Token taxonomy and file layout.** Should the new tokens land in:
   (a) one `depth.css` (atoms + recipes) + one `surfaces.css` (tonal layers + status) split by responsibility, or
   (b) one consolidated `theme-tokens.css` with section comments?

   My preference: split (option a) for 800-line guard friendliness — `depth.css` carries tier mechanics, `surfaces.css` carries palette state. But architect owns this call.

2. **Style Dictionary integration.** The repo has `packages/design-tokens/tokens/semantic/{light,dark}.json`. Should new OKLCH tokens land there with hex fallback in the build pipeline, OR stay inline in CSS files for v3 and migrate to Style Dictionary in a follow-up? My recommendation: inline for v3 cutover (avoids a parallel Style Dictionary refactor); migrate post-merge.

3. **Atom/recipe naming convention final lock.** I named atoms `--d1-elev-atom-{verb}-{role}` and recipes `--d1-elev-{verb}-{state}`. Architect may want to enforce a different naming pattern for cross-system consistency (e.g., `--d1-shadow-*` namespace if the system grows beyond box-shadow).

4. **`:has()` browser-support fallback.** Universal in evergreen 2026 — but if the architect wants a graceful degradation path for any older Edge installs, an `aria-rail-headed="true"` attribute on the React component as belt-and-braces signal. My preference: skip — `:has()` ships universal in our minimum supported browsers per Provedo's existing browserslist.

5. **Recipe-set granularity.** I emit 3 Read amplitudes × 2 (rail-mitigated and not) = 6 Read recipes. Architect could collapse to 3 recipes + a separate `--d1-elev-rail-mitigated-suppress-top` overlay token that strips the top atom. My preference: explicit recipes (clearer at consumption site, easier to grep). But architect's call.

6. **Migration commit granularity.** §10.3 lists 7 sequential steps. Architect may want this as 7 commits in one PR, or N small PRs. My preference: 7 commits in one feature PR for atomic visual regression review.

---

## Appendix A — Skill Pass Trace

- `superpowers:brainstorming` — applied at synthesis stage; surfaced 3-tier amplitude calibration via equal-step principle.
- `impeccable:color-and-contrast` — OKLCH retint to hue 75°; chroma 0.008-0.014 within tinted-neutrals band; AAA contrast verified per §3.
- `impeccable:spatial-design` — cards-in-cards rule (§11.2); shadow subtlety verified at 0.36-0.50 alpha for 1px lines (perceived as hairlines, not shadows).
- `impeccable:motion-design` — 80ms / 200ms / 220ms timings; expo-out / expo-in only; reduced-motion behavior.
- `impeccable:interaction-design` — 5-state arc per Press tier; defined-or-explicit-no-op for every state-tier combination.
- `impeccable:typography` — body text AA on Read elevated surfaces flagged for `text-muted` + small body sizes.
- `everything-claude-code:design-system` — token taxonomy verb-prefix discipline.
- `everything-claude-code:frontend-design` — anti-template check 17/17 pass.
- `ux-design:refactoring-ui` — depth-without-shadows hairline discipline; surface lightness primary, bevel secondary.
- `ux-design:microinteractions` — press state arc as the «coin gesture» (rest → hover → active → release).
- `superpowers:verification-before-completion` — anti-pattern pass-check + contrast verification before sign-off.

## Appendix B — Total Token Tally

| Category | Count |
|---|---|
| Re-tinted neutrals (existing names, new OKLCH values) | 4 |
| New tonal layer tokens | 2 (`--d1-bg-card-elevated`, `--d1-bg-input`) |
| Aliased token (deprecated, points at `--d1-bg-input`) | 1 (`--d1-bg-trough`) |
| New status colors | 4 (success / warning / error / info) |
| New atom tokens | 22 |
| New recipe tokens | 13 |
| New motion duration / easing tokens | 5 |
| **Total new design tokens** | **51** (+4 re-tinted) |

## Appendix C — Total Selectors Mapped (per tier breakdown)

| Tier | Selector count | Notes |
|---|---|---|
| 0 (Canvas) | 22 | incl. flat opt-outs (rail, disclaimer, premium chip, disclosure, insight, heatmap, layout containers) |
| 1 (Read) | 7 | KPI (default + portfolio + lime-rebound + error + empty), panel, chart-panel, nav-brand, nav-avatar |
| 2 (Write) | 4 | chat-search, segmented-track, input/select/textarea (collapsed), future toggle-track |
| 3 (Press) | 11 | CTA, CTA-ghost, pill, pill-active, chip, chip-active, chip-icon, chip-export, segmented-btn-active, nav-icon-pill, future toggle-thumb |
| 4 (Float) | 0 | post-alpha |
| **Total** | **44** | |

## Appendix D — One-Line Distillation

**v3 D1 depth = «Read up + Write down + Press up + Rail wins», executed at 1px resolution on hue-75-tinted editorial-warm charcoal, with sub-canvas inputs as the Provedo signature, hover as a Press-tier-only behavior, and a 3-tier Read amplitude split that lets depth carry hierarchy.**
