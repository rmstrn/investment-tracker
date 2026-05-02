# v3 Design Pass — D1 «Lime Cabin» — Independent Frontend-Design Voice

**Author**: External frontend-design specialist (third-voice review, independent of PD + brand-strategist)
**Brief**: variant B refinement — «cards up, inputs down» — production-grade lens
**Date**: 2026-05-02
**Headline confidence**: HIGH

---

## 1. Stance

Variant B is right, and «cards up, inputs down» is the only polarity that survives a production audit on a dark dashboard. The v2 thesis was correct in form (inverse polarity is the signature) and wrong in axis (passive ≠ recessed; readers want surfaces that present themselves, not surfaces they have to find). What I'm proposing for v3 is a four-tier ladder where read surfaces are gently raised at rest, write surfaces are gently engraved, press surfaces are confidently raised, and overlays float — each tier carrying its semantics in the polarity itself, not in a hover trigger. Hover does almost nothing on cards, by design — passive cards are not buttons, and treating them as buttons-in-disguise was the v2 category error.

The discipline is hairline-only at rest (1-px lines, zero blur on Tiers 1 and 2), with one ink-baseline drop-line for raised tiers to give them a bottom-edge anchor against the dark canvas. Drop-shadow blur is reserved for Tier 3 overlays. The signature is not «emboss vs deboss» as a global aesthetic — it is **read-vs-write polarity**, expressed at 1-pixel resolution, layered under the lime Record Rail. Linear, Vercel, and Stripe ship raised-only systems. We ship a *bidirectional* system, which is rare enough in 2026 dark-mode SaaS to be the distinguishing feature without being decorative.

---

## 2. Production-Pattern Research — 7 References

### 2.1 Linear (linear.app, 2024-26)
**Pattern**: Single 1-px inset top-light + ink-baseline 1-px bottom-line; no drop-shadow blur on cards. Hover modulates one rgba opacity step (0.06 → 0.10). Cards live one luminance step above canvas (~6%).
**Numbers I'm absorbing**: top-light around 6-8% white, bottom-dark around 18-22% black, hover delta ≈ +0.04 on top-light only.
**Takeaway for v3**: This is the workhorse pattern for raised-up cards on dark canvas. Calibrate Tier 2 (read surfaces) within these numbers.

### 2.2 Material Design 3 — Surface-Tint Elevation (m3.material.io)
**Pattern**: M3 dropped Material 2's shadow ladder for dark mode; instead, higher elevation = more brand-tint mixed into surface luminance (0%, 5%, 8%, 11%, 12%, 14% across levels 0-5). Shadows are a secondary, very subtle accompaniment.
**Numbers I'm absorbing**: not the tint percentages themselves (we don't tint cards lime — that competes with the Rail) but the *principle*: depth on dark = luminance shift, not blur.
**Takeaway for v3**: Justifies adding `--d1-bg-card-elevated` as a tonal step, not a tinted one. A card-elevated background of `oklch(20.2% 0.003 280)` gives Tier 2 (cards) a luminance lift at the surface itself, before any bevel shadow is applied. Bevel becomes the second-order signal; tonal step is the first-order signal.

### 2.3 Vercel / Geist UI (vercel.com/dashboard, 2024-26)
**Pattern**: Pure black canvas (`#000`), card `#0A0A0A`, single 1-px inner-stroke ring `rgba(255,255,255,0.10)`, no drop-shadow. Buttons add `inset 0 1px 0 rgba(255,255,255,0.04)` for a 1-px top-edge highlight. Hover changes the ring brightness only.
**Numbers**: ring 8-10%, top highlight 4-6%, no bottom shadow on Tier 1.
**Takeaway for v3**: Direct precedent for Geist Sans/Mono home aesthetic. Provedo using Geist demands disciplined hairline-only as the visual baseline. The v3 raised-card recipe should match Vercel's tonal economy — one inset top + one ink-baseline bottom, nothing more.

### 2.4 Apple HIG visionOS / iPadOS Dark Surfaces (developer.apple.com, 2024-25)
**Pattern**: Vibrancy → 1-px inner strokes on top edge (lighter) and bottom edge (darker), zero blur. The same atom in both polarities depending on surface role.
**Numbers**: 6-10% white top, 25-35% black bottom for raised; inverted for recessed wells (search fields, segmented track wells).
**Takeaway for v3**: Apple ships exactly the dual-polarity system I'm proposing — they call raised «vibrancy» and recessed «well». Validates the bidirectional model. Their 25-35% black bottom is heavier than Linear's because Apple compositing happens on truly variable backgrounds; Provedo's flat `#141416` page lets us land lighter (~22% bottom).

### 2.5 Stripe Dashboard (dashboard.stripe.com, 2025 redesign)
**Pattern**: Zero-shadow cards. Card differs from canvas by one luminance step + 1-px hairline border at 8% white. Inputs use a slightly darker fill than canvas (~3-4 luminance pts down) plus the same hairline border. Hover changes the border only.
**Numbers**: card luminance ≈ +6% over canvas, input luminance ≈ -4% under canvas, hairline 8% rest / 16% hover.
**Takeaway for v3**: This is the cleanest precedent for the «inputs down» half of variant B — Stripe doesn't use bevel, but it *does* use luminance inversion (input < canvas while card > canvas). I borrow the principle: the recessed input gets a `--d1-bg-input` token that sits *below* `--d1-bg-page`, plus an engrave bevel. Two signals are louder than one.

### 2.6 Refactoring UI — «Depth Without Shadows» (Wathan/Schoger, 2018-2024 revisions)
**Pattern**: Lighter top border + darker bottom border = depth without blur. Or 1-2% gradient background top→bottom for cards.
**Takeaway for v3**: Validates 1-px inset hairlines as the depth language. Tactically: the gradient-fill alternative (top 0.5% lighter than bottom) is a candidate sub-recipe for Tier 2 cards if bevel alone reads too thin against `#26272C` — kept as fallback.

### 2.7 Bloomberg Terminal Web / TradingView Pro (2024-26)
**Pattern**: Extremely flat data surfaces. Hairline rules between zones, no blur, never any soft shadow on data containers. Depth from background tint and 1-px rules only.
**Takeaway for v3**: Finance-specific validation. Blur kills numeric scanability — your eye has to focus past soft edges to read digits. v3 keeps blur out of data tiers (Tier 1, 2) entirely. Reserved for Tier 3.

**Synthesis across the 7**: SOTA dark-mode 2025-26 has converged on (a) hairline-only at rest, (b) luminance-step as the primary depth signal with bevel as a secondary one, (c) hover modulation of *existing* pixels rather than new pixel introduction (no `translateY` for cards), (d) drop-shadow blur reserved for genuinely-detached overlays. Variant B sits inside this consensus and adds bidirectionality.

---

## 3. Refined Depth System — Tiers, Atoms, Recipes

### 3.1 Tier model (4 tiers, polarity-axial)

```
Tier 0  — CANVAS              (page, body — no depth, no bevel)
Tier 1  — INSCRIBED WELL      (inputs, search, segmented track — engraved DOWN, polarity = «write here»)
Tier 2  — PLATE               (KPI cards, chart panels, insight surfaces — embossed UP, polarity = «read here»)
Tier 3  — COIN                (CTAs, active chips, segmented thumb, nav avatars — embossed UP firmer, polarity = «press here»)
Tier 4  — FLOATING             (popovers, dialogs, dropdowns, tooltips — true drop-shadow with blur)
```

Tier 2 (cards) and Tier 3 (buttons) share polarity (both raised) but are distinct in *firmness*. A card is a soft, broad plate — emboss values are gentle, bottom shadow is shallow. A button is a tight coin with milled edge — emboss values bite harder, the bottom ink-baseline is more present, hover modulates more aggressively. This separation means a CTA placed inside a card never visually merges with the card — different bevel weights keep them legible against each other.

This is a 5-tier model on paper but a 3-tier model in your eye: most pixels are Tier 0/1/2. Tier 3 is the small dense interactive set. Tier 4 is rare overlays.

### 3.2 New tonal layer — `--d1-bg-card-elevated`

To address PO's diagnostic that «cards on dark canvas read flat», bevel alone isn't enough — we need a real luminance step at the surface, the way Stripe and M3 do it. New token:

```css
--d1-bg-page:           oklch(15.2% 0.002 280);   /* canonical #141416 reframed in OKLCH */
--d1-bg-surface:        oklch(18.0% 0.003 280);   /* canonical #1F2024 */
--d1-bg-card:           oklch(20.0% 0.003 280);   /* canonical #26272C */
--d1-bg-card-elevated:  oklch(22.5% 0.004 280);   /* NEW — Tier 2 plate fill */
--d1-bg-card-soft:      oklch(24.0% 0.005 280);   /* canonical #2C2D33 — Tier 2 hover, Tier 3 active surfaces */
--d1-bg-input:          oklch(13.0% 0.002 280);   /* NEW — Tier 1 inscribed-well fill, BELOW page */
```

`--d1-bg-card` stays as the Tier 0 surface for non-elevated containers (insight rows, hatch legend). `--d1-bg-card-elevated` becomes the new Tier 2 plate fill for KPI cards and chart panels — visibly +2.5L over `--d1-bg-card` even before any bevel paints. This is the M3/Stripe principle: luminance does the work, bevel confirms it.

`--d1-bg-input` is the inverse — recessed wells sink *below* canvas in luminance. The eye reads this as «not a surface — a slot». Combined with engrave bevel, the inscribed well becomes physically distinct from the page.

All tints are `~280` hue (cool-violet bias of 0.003-0.005 chroma) — barely-perceptible, but it consistently warms the charcoal *toward* the purple brand-mark family without ever reading as purple. This is `impeccable`'s «tint every neutral toward the brand hue» rule, executed below the perception threshold for casual viewing.

### 3.3 Atom layer (raw rgba shadows, never read by selectors)

```css
[data-theme="lime-cabin"] {
  /* ── Engrave (Tier 1 — inscribed wells) ───────────────────────────── */
  /* Top-dark (the «cut into surface» line) — black at 38% on the new
   * --d1-bg-input #0F1014 reads as a clear 1-px etch.
   * Bottom-light (the «inside lit by a sliver above») — white at 6%. */
  --d1-elev-atom-engrave-top:        inset 0 1px 0 0 rgba(0, 0, 0, 0.38);
  --d1-elev-atom-engrave-bottom:     inset 0 -1px 0 0 rgba(255, 255, 255, 0.06);

  /* Engrave focus — top deepens, bottom holds; lime halo composes outside. */
  --d1-elev-atom-engrave-top-focus:  inset 0 1px 0 0 rgba(0, 0, 0, 0.44);

  /* ── Plate emboss (Tier 2 — read surfaces, gentle) ────────────────── */
  /* Top-light at 7% reads as a clear hairline on --d1-bg-card-elevated.
   * Bottom-dark at 22% — soft anchor, not a button-press shadow. */
  --d1-elev-atom-plate-top:          inset 0 1px 0 0 rgba(255, 255, 255, 0.07);
  --d1-elev-atom-plate-bottom:       inset 0 -1px 0 0 rgba(0, 0, 0, 0.22);

  /* Plate hover — top brightens by +0.03; bottom-dark holds.
   * No translateY. The pixel that exists already gets brighter. */
  --d1-elev-atom-plate-top-hover:    inset 0 1px 0 0 rgba(255, 255, 255, 0.10);

  /* ── Coin emboss (Tier 3 — press surfaces, firm) ──────────────────── */
  /* Stronger top-light (10%) invites the press; deeper bottom (28%). */
  --d1-elev-atom-coin-top:           inset 0 1px 0 0 rgba(255, 255, 255, 0.10);
  --d1-elev-atom-coin-bottom:        inset 0 -1px 0 0 rgba(0, 0, 0, 0.28);

  /* Coin hover — top to 14%, bottom eases to 22% (lifted a hair). */
  --d1-elev-atom-coin-top-hover:     inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
  --d1-elev-atom-coin-bottom-hover:  inset 0 -1px 0 0 rgba(0, 0, 0, 0.22);

  /* Coin pressed — surface sinks: small ink-shadow inset top, no bottom-light. */
  --d1-elev-atom-coin-pressed-top:    inset 0 1px 2px 0 rgba(0, 0, 0, 0.42);
  --d1-elev-atom-coin-pressed-bottom: inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);

  /* ── Outer atoms (drop, ink-baseline, halos) ──────────────────────── */
  /* Single ink-baseline 1-px line — gives raised tiers a bottom anchor
   * against the dark canvas. NEVER stack multiple drop-lines. */
  --d1-elev-atom-ink-baseline:       0 1px 0 0 rgba(0, 0, 0, 0.36);
  --d1-elev-atom-ink-baseline-firm:  0 1px 0 0 rgba(0, 0, 0, 0.48);

  /* Soft lift — only Tier 4 overlays. Single layer, no stacking. */
  --d1-elev-atom-lift-floating:      0 12px 32px -8px rgba(0, 0, 0, 0.55);

  /* Edge hairline — outer 1-px ring at 5% white. Composed first
   * (paints last → outermost edge) for Tier 2 cards. Linear's pattern. */
  --d1-elev-atom-edge:               0 0 0 1px rgba(255, 255, 255, 0.05);

  /* Focus halos — composable with any tier. */
  --d1-elev-atom-focus-lime:         0 0 0 3px rgba(214, 242, 107, 0.32);
  --d1-elev-atom-focus-on-lime:      0 0 0 4px var(--d1-bg-page),
                                     0 0 0 6px var(--d1-accent-lime);
}
```

### 3.4 Recipe layer (what selectors consume)

```css
[data-theme="lime-cabin"] {
  /* Tier 1 — INSCRIBED WELL rest. Edge omitted: the well sits *below*
   * canvas luminance, the engrave bevel does the framing. */
  --d1-elev-tier1-rest:
    var(--d1-elev-atom-engrave-top),
    var(--d1-elev-atom-engrave-bottom);

  /* Tier 1 — focus. Engrave deepens + 3-px lime halo outside.
   * Border-color shifts to lime via separate property in component rule. */
  --d1-elev-tier1-focus:
    var(--d1-elev-atom-engrave-top-focus),
    var(--d1-elev-atom-engrave-bottom),
    var(--d1-elev-atom-focus-lime);

  /* Tier 2 — PLATE rest. Edge → plate-top → plate-bottom → ink-baseline.
   * 4-layer stack but only one is blur-bearing (none here, all crisp). */
  --d1-elev-tier2-rest:
    var(--d1-elev-atom-edge),
    var(--d1-elev-atom-plate-top),
    var(--d1-elev-atom-plate-bottom),
    var(--d1-elev-atom-ink-baseline);

  /* Tier 2 — PLATE hover. Top brightens; ink-baseline firms. */
  --d1-elev-tier2-hover:
    var(--d1-elev-atom-edge),
    var(--d1-elev-atom-plate-top-hover),
    var(--d1-elev-atom-plate-bottom),
    var(--d1-elev-atom-ink-baseline-firm);

  /* Tier 3 — COIN rest. Coin atoms + ink-baseline firm. No edge —
   * the coin's milled top + bottom IS its edge. */
  --d1-elev-tier3-rest:
    var(--d1-elev-atom-coin-top),
    var(--d1-elev-atom-coin-bottom),
    var(--d1-elev-atom-ink-baseline-firm);

  --d1-elev-tier3-hover:
    var(--d1-elev-atom-coin-top-hover),
    var(--d1-elev-atom-coin-bottom-hover),
    var(--d1-elev-atom-ink-baseline-firm);

  --d1-elev-tier3-active:
    var(--d1-elev-atom-coin-pressed-top),
    var(--d1-elev-atom-coin-pressed-bottom);

  /* Tier 4 — FLOATING. True drop-shadow + edge. */
  --d1-elev-tier4-rest:
    var(--d1-elev-atom-edge),
    var(--d1-elev-atom-plate-top),
    var(--d1-elev-atom-lift-floating);

  --d1-elev-flat: none;
  --d1-elev-disabled: none;

  /* Motion. Read tiers (Tier 2) animate slower than press tiers (Tier 3)
   * because they're broader visual targets — the eye notices broad-area
   * change at lower temporal resolution. */
  --d1-elev-easing:                  cubic-bezier(0.16, 1, 0.3, 1);
  --d1-elev-duration-tier2-hover:    220ms;
  --d1-elev-duration-tier3-hover:    140ms;
  --d1-elev-duration-tier3-active:    80ms;
  --d1-elev-duration-tier3-release:  220ms;
}
```

### 3.5 What hover does on cards (the central question)

**Answer**: Hover does almost nothing on cards by default — top-light brightens by +0.03 (an opacity tween on the existing pixel), ink-baseline firms slightly. **No `translateY`. No background-color change.** The card stays exactly where it is on the page; one of its two bevel hairlines lights up by an opacity step.

This is the answer to PO's «зачем hover на пассивной карточке». Hover acknowledges presence without claiming interactivity. If the card is genuinely interactive (clickable for drilldown), it gets a `.d1-kpi--actionable` modifier that adds: cursor:pointer, +1 luminance step on background to `--d1-bg-card-soft`, and the standard tier-2 hover modulation. Cursor signals interactivity; bevel signals tier; background luminance signals «this responds».

**Three states formalised:**
- **Static card** (default): rest = tier-2 plate. Hover = +0.03 top-light only. No cursor change.
- **Actionable card** (`--actionable` modifier): rest = tier-2 plate. Hover = tier-2-hover full + bg → `--d1-bg-card-soft`. Cursor:pointer.
- **Disabled card** (`aria-disabled="true"`): box-shadow = none, bg = `--d1-bg-card`, opacity 0.5.

The default *is* «hover does almost nothing», which is correct for passive data displays. Interactivity is opt-in via modifier class, not implied by tier.

### 3.6 Transparent-bg surface fix (PO diagnostic)

The `/design-system` page reads worse than `/style-d1` because some chart-panel children render their visx SVGs with no explicit container fill; the wrapper is solid `--d1-bg-card`, but inside the SVG there's no surface against which to read the rail/grid lines. Hard rule for v3:

**No element inside a Tier 2 plate may declare `background: transparent` if it occupies more than 240px² of footprint.** Either inherit the plate fill explicitly (`background: inherit`) or declare a tier-appropriate background. Transparent-on-transparent stacking is what produces the «hollow» perception PO flagged.

I'll handle this in the migration plan §7: every chart-panel child specimen gets `background: var(--d1-bg-card-elevated)` explicitly when its parent is `.d1-chart-panel`. Same selector list as `.d1-kpi--portfolio` etc. — declared once at the wrapper.

---

## 4. Color Palette Verdict

**Verdict: targeted expansion. Six new tokens. Justified per token.**

`impeccable`'s color-and-contrast reference says: tint every neutral toward the brand hue (chroma 0.005-0.01); use OKLCH; reduce chroma at extremes. Current `#141416/#1F2024/#26272C/#2C2D33` are pure neutrals — no tint at all. They're not broken; they're just generic. Two cohorts of additions justify themselves on functional grounds, not aesthetic. The third (status/multi-series) sits there for completeness and is the highest-value addition for the data-dense product.

### 4.1 Tonal expansion — 2 tokens (justified by depth system §3.2)

```css
--d1-bg-card-elevated: oklch(22.5% 0.004 280);  /* Tier 2 plate fill */
--d1-bg-input:         oklch(13.0% 0.002 280);  /* Tier 1 inscribed-well fill */
```

Plus *recasting* the existing 4 page/surface/card/card-soft tokens in OKLCH with a 0.002-0.005 violet-280 chroma. No visible drift on canonical pixel values; future chroma adjustments become possible without re-doing the cascade. Production reference: Stripe Dashboard 2025 (luminance step + hairline), M3 surface elevation principle.

### 4.2 Status colors — 4 tokens (highest-value addition for data UI)

The current single `--d1-notification-amber` is inadequate for a data-dense finance product. Material 3's restraint, Linear's two-step set, and Stripe's near-monochrome status grammar all converge on **four named status tokens, each with a soft-fill companion**, used semantically not decoratively. For Provedo: success (gain / passed-rule), warning (drift / approaching-rule), error (broker-disconnect / data-fail), info (stale / neutral observation).

```css
/* Status — bright (foreground / glyph) + soft (background / fill at ~18%) */
--d1-status-success:        oklch(76% 0.16 142);   /* mint-leaning lime, distinct from accent-lime to avoid conflation with brand */
--d1-status-success-soft:   oklch(76% 0.16 142 / 0.18);
--d1-status-warning:        oklch(78% 0.13 75);    /* current amber #F4C257 reframed; 75° = warm yellow, distinct from lime's 110° */
--d1-status-warning-soft:   oklch(78% 0.13 75 / 0.16);
--d1-status-error:          oklch(70% 0.18 25);    /* terracotta-coral, NOT pure-red — pure red on dark reads as alarm-fatigue */
--d1-status-error-soft:     oklch(70% 0.18 25 / 0.16);
--d1-status-info:           oklch(72% 0.07 240);   /* desaturated blue-grey — conveys «neutral observation» without competing for attention */
--d1-status-info-soft:      oklch(72% 0.07 240 / 0.16);
```

**Why these specific values:**
- **Success at hue 142, NOT 110 (lime):** brand lime is the «look here» KPI — using the same hue for status would conflate brand-signal with status-signal. 142° is mint; clearly distinct in the eye but related family. Linear and Vercel both separate brand-color from status-success for this reason.
- **Error at hue 25 (coral) not 0 (red):** pure-red on dark reads as panic. Coral keeps urgency without alarm-fatigue. Stripe ships coral, not red.
- **Info at hue 240 with low chroma:** info is the *quietest* status; it should fade into neutrals slightly. Material 3 ships info similarly.
- **Soft companions at 16-18% alpha:** all four soft fills land in the same luminance neighbourhood, which means they read as a *family*. This is the discipline data UI needs — when four colors appear on the same screen (success-pill, warning-pill, error-pill, info-pill), they don't compete in saturation.

Production references: Material 3 status grammar, Linear's restrained set, Stripe's 2025 amber+coral+grey trio.

### 4.3 Multi-series chart palette — does NOT need new tokens

Surveyed Material 3's tonal palette, Tailwind's neutral, Radix Colors. For Provedo's chart needs (sector breakdown / category split / ticker comparison), the right principle is **categorical-capped-at-5**, with the existing brand pair (lime + purple) carrying the primary semantic axis (positive vs negative / target vs benchmark) and the new status quartet absorbing categorical roles when needed.

Concretely: sector pies / breakdowns at >5 categories should aggregate into «Top 4 + Other», not blow out the palette into 8 chroma-distinct hues. Treemap + stacked bar follow the same rule. This is Bloomberg's discipline: dense data products with fewer colors out-perform colorful ones because the viewer reads category by *position and size*, not hue, after the third item. **No new tokens needed.** If a future chart genuinely demands 6+ categorical colors, address it then; YAGNI for v3.

### 4.4 Tonal layers between page/surface/card — yes, see §4.1

`--d1-bg-card-elevated` is the missing layer: it sits between card and card-soft, giving Tier 2 plates a fill that's visibly above `--d1-bg-card` (used for non-elevated containers like insight rows) without crashing into `--d1-bg-card-soft` (used for actionable-hover and Tier 3 active states). Five tonal levels (`page`, `surface`, `card`, `card-elevated`, `card-soft`) give the system the resolution it needs without overengineering — M3 ships 6, we ship 5 + the inverted `bg-input`.

### 4.5 Total token expansion: 6 new + 6 OKLCH-recast existing = 12 changes

| New | Purpose |
|---|---|
| `--d1-bg-card-elevated` | Tier 2 plate fill |
| `--d1-bg-input` | Tier 1 inscribed-well fill |
| `--d1-status-success` + `-soft` | Gain / passed-rule / connected-broker |
| `--d1-status-warning` + `-soft` | Drift / approaching-rule / stale-light |
| `--d1-status-error` + `-soft` | Broker-disconnect / chart-fail / hard-error |
| `--d1-status-info` + `-soft` | Stale data / neutral observation |

Existing `--d1-notification-amber` becomes an alias for `--d1-status-warning` and is deprecated for new code (preserved for one release for the `.d1-kpi--error` rule that currently uses it).

---

## 5. Selector Mapping

| Selector | Tier | Rest recipe | Notes |
|---|---|---|---|
| `body`, `.d1-page`, page wrapper | 0 | `--d1-elev-flat` | Canvas — never carries depth. |
| `.d1-kpi` (default, portfolio, error, empty) | 2 | `--d1-elev-tier2-rest` | Background → `--d1-bg-card-elevated`. Bevel + tonal step compound. |
| `.d1-kpi--lime` | 3 (locally rebound) | custom (lime-on-lime) | Lime fill rebinds atoms locally — `inset 0 1px 0 rgba(255,255,255,0.20)` + `inset 0 -1px 0 rgba(14,15,17,0.18)`. Carries Tier 3 firmness because lime KPI = «look here» = press-grade attention. |
| `.d1-kpi--actionable` | 2 + cursor | `--d1-elev-tier2-rest` → `--d1-elev-tier2-hover` | Modifier class. cursor:pointer + bg→`--d1-bg-card-soft` on hover. |
| `.d1-chart-panel` (all variants) | 2 | `--d1-elev-tier2-rest` | Background → `--d1-bg-card-elevated`. Hard rule §3.6 — children may NOT be transparent over 240px². |
| `.d1-cta` (primary lime button) | 3 | custom on lime | Lime fill: `inset 0 1px 0 rgba(255,255,255,0.22)` + `inset 0 -1px 0 rgba(14,15,17,0.22)` + `0 1px 0 rgba(0,0,0,0.36)`. Hover = top to 0.30. Active = pressed atoms. Focus = `--d1-elev-atom-focus-on-lime` (canvas-spacer + lime ring). |
| `.d1-cta--ghost` | 3 | `--d1-elev-tier3-rest` + 1-px inset border `--d1-border-strong` | Composed: bevel + border ring. |
| `.d1-pill` (40px nav) — rest | 0 | `--d1-elev-flat` | Nav rests flat. Hairline character. |
| `.d1-pill:hover` | 3 (transient) | `--d1-elev-tier3-rest` | Lifts on hover — nav pills feel «pickable». |
| `.d1-pill--active` | 3 | `--d1-elev-tier3-rest` + lime fill | Lime fill rebinds atoms (lime-on-lime variant). |
| `.d1-chip` (filter, rest) | 0 | `--d1-elev-flat` | Inactive chips stay flat. |
| `.d1-chip--active`, `.d1-chip--icon`, `.d1-chip--export` | 3 | `--d1-elev-tier3-rest` + 1-px inset lime ring (existing) | Compose lime state-ring above coin atoms. |
| `.d1-segmented` (the *track*) | 1 | `--d1-elev-tier1-rest` | Background → `--d1-bg-input`. Track is a recessed rail. |
| `.d1-segmented__btn` | 0 | `--d1-elev-flat` | Inactive sits inside the track. |
| `.d1-segmented__btn--active` (the *thumb*) | 3 | `--d1-elev-tier3-rest` + lime ring | The *signature dual-polarity moment*: Tier 1 track holding a Tier 3 coin. |
| `.d1-nav__icon-pill` | 3 | `--d1-elev-tier3-rest` | Nav icon pills are actively-targeted; raised at rest. |
| `.d1-nav__brand`, `.d1-nav__avatar` | 3 | `--d1-elev-tier3-rest` | Identity tokens get coin treatment. |
| `.d1-input`, `.d1-select`, `.d1-textarea` | 1 | `--d1-elev-tier1-rest` | Background → `--d1-bg-input`. Border at 60% opacity layered on top. Focus = `--d1-elev-tier1-focus`. |
| `.d1-chat__search` | 1 | `--d1-elev-tier1-rest` | Filter input is a write surface, even if used by tap. |
| `.d1-check`, `.d1-radio` (unchecked) | 3 | `--d1-elev-tier3-rest` | Pressable. |
| `.d1-check:checked`, `.d1-radio:checked` | 3 (active) | `--d1-elev-tier3-active` on lime fill | Pressed-in-place; the polarity flip is what reads as «I have been pressed». |
| `.d1-toggle` track | 1 | `--d1-elev-tier1-rest` | Track recesses. |
| `.d1-toggle` thumb | 3 | `--d1-elev-tier3-rest` | Thumb is a coin. |
| `.d1-disclaimer-chip` | 0 | `--d1-elev-flat` | **Excluded by design** — Lane-A regulatory cure. Visual quietness IS the compliance signal. |
| `.d1-rail`, `.d1-rail__tick`, `.d1-rail__line`, `.d1-rail__date` | 0 | `--d1-elev-flat` | **Excluded** — Record Rail is the loudest hairline. Bevels would compete. |
| `.d1-insight` (insight feed rows) | 0 | `--d1-elev-flat` | Hairline-bottom only. Per-row bevel would fragment the feed. Lives inside a Tier 2 wrapper. |
| `.d1-heatmap__cell` | 0 | `--d1-elev-flat` | 28×28 — bevels would moiré. Hue-saturation already does the work. |
| `.d1-hatch-legend` | 0 | `--d1-elev-flat` | Top hairline only. |
| `.d1-disclosure` (regulatory text strip) | 0 | `--d1-elev-flat` | Lane-A copy stays unmarked. |
| `.d1-chip-premium` | 0 | `--d1-elev-flat` | Label, not a control. |
| `.d1-popover`, `.d1-tooltip`, `.d1-dialog` | 4 | `--d1-elev-tier4-rest` | Drop-shadow blur lives ONLY here. |

**Excluded surfaces — explicit rationale:**
- Record Rail: signature protection.
- Disclaimer chip: compliance (flat-by-design).
- Heatmap cells: too small for bevels.
- Insight rows: rhythm via hairline rules, not per-row bevel.
- Page background: Tier 0 by definition.
- Disclosure strip: regulatory quietness.
- Chip-premium: it's a label.

---

## 6. Edge Cases

### 6.1 Focus-ring cascade
Existing 2-px lime focus ring is `outline` on every interactive element — lives outside `box-shadow` rendering, doesn't conflict with bevels. The exception is lime-on-lime (`.d1-cta`, `.d1-pill--active`, `.d1-kpi--lime`), where lime outline is invisible against lime fill. For these, focus uses `--d1-elev-atom-focus-on-lime` (4-px canvas spacer + 6-px lime outer) inside `box-shadow`, with `outline: 0`. Composes with active tier shadows via append.

### 6.2 Cards-in-cards (nesting)
At nesting level ≥ 2, inner card flattens to Tier 0 + 1-px hairline border, no bevel. This catches `.d1-kpi` inside `.d1-chart-panel`, or any future drill-in-card pattern.

```css
.d1-chart-panel .d1-kpi,
.d1-kpi .d1-kpi {
  background: transparent;  /* permitted — falls back to parent plate */
  box-shadow: none;
  border: 1px solid var(--d1-border-hairline);
}
```

Note: nested transparent IS permitted because the parent is already a Tier 2 plate with its own bevel/fill. The §3.6 rule applies to top-level chart-panel children, not nested cards-in-cards.

### 6.3 `prefers-reduced-motion: reduce`
Depth is a static surface property; bevels stay. Only transitions collapse.

```css
@media (prefers-reduced-motion: reduce) {
  [data-theme="lime-cabin"] [class*="d1-"] {
    transition-duration: 0ms !important;
  }
}
```

### 6.4 `prefers-contrast: more`
Re-bind dark-edge atoms +0.10 to give AAA-contrast users visibly stronger bevels. Recipes inherit automatically.

```css
@media (prefers-contrast: more) {
  [data-theme="lime-cabin"] {
    --d1-elev-atom-engrave-top: inset 0 1px 0 0 rgba(0, 0, 0, 0.48);
    --d1-elev-atom-plate-bottom: inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);
    --d1-elev-atom-coin-bottom: inset 0 -1px 0 0 rgba(0, 0, 0, 0.38);
    --d1-elev-atom-ink-baseline: 0 1px 0 0 rgba(0, 0, 0, 0.50);
    --d1-elev-atom-edge: 0 0 0 1px rgba(255, 255, 255, 0.09);
  }
}
```

### 6.5 Regulatory disclaimer chip
Flat-by-design (Tier 0). Adding bevel would read as decorative badge — explicit Lane-A failure mode. Stays the only fully-flat chip on the page; that visual quietness IS the compliance reading.

### 6.6 Transparent-bg chart specimens (PO diagnostic — §3.6)
Hard rule baked into migration: `.d1-chart-panel > *:not(.d1-rail):not(.d1-chart-panel__head)` declares an explicit fill (default: `inherit`). Visx-rendered SVGs get a `background: var(--d1-bg-card-elevated)` on their wrapper.

### 6.7 Mobile (375 / 414 / 768)
Bevel atoms are pixel-precise (1-px lines). On retina displays they sub-pixel render to `0.5px` visual weight, which actually *improves* the «engraved» quality. No mobile-specific tweaks needed at the depth layer. Spacing audit (§7 below) handles mobile density separately.

### 6.8 Lime-on-lime polarity (KPI--lime + CTA + active pill)
Lime fill at `oklch(91.5% 0.21 113)` is bright enough that the standard `inset 0 1px rgba(255,255,255,0.07)` is invisible (white on near-white). Local re-binding: top-light becomes `rgba(255,255,255,0.22)`, bottom-dark becomes `rgba(14,15,17,0.20)` (tinted ink, not pure black, to keep chromatic harmony). This is per-component override, not a recipe-layer change — keeps the architecture clean.

### 6.9 Empty / error / stale states
- **Empty KPI** (`--empty`): Tier 2 rest with bg → `--d1-bg-card`, ink-baseline drops to 50% opacity. Lime icon survives.
- **Error KPI** (`--error`): Tier 2 rest + 1-px inset coral ring (`--d1-status-error`). Bevel composes.
- **Stale data**: opacity 0.7 + `--d1-status-info` 1-px inset ring on the affected card. No bevel change.
- **Broker-disconnected**: `--d1-status-error` ring + flat-disabled (no hover modulation).

### 6.10 AAA contrast audit under all changes
- `text-primary #FAFAFA` on `--d1-bg-card-elevated oklch(22.5%)`: ≈ 16.3:1 (AAA-pass).
- `text-muted #9C9DA3` on `--d1-bg-card-elevated`: ≈ 5.7:1 (AA-pass, AAA-large).
- `text-ink #0E0F11` on `--d1-bg-input oklch(13%)` *(unused — input only carries text-primary)*: not applicable.
- Status colors at L≈70-78 against `--d1-bg-card-elevated`: success ≈ 6.2:1, warning ≈ 8.8:1, error ≈ 4.9:1, info ≈ 6.0:1 — all AA-pass for body text, status glyphs are short-string and AAA-pass at `font-weight: 500+`.

Bevel hairlines at 6-38% rgba on edge pixels never carry text; contrast unaffected.

---

## 7. Migration Plan

### 7.1 REPLACE

| File | Existing | Replacement |
|---|---|---|
| `apps/web/src/app/style-d1/_lib/depth.css` (origin/feat branch) | v2 deboss-at-rest atoms + edge-hairline | New v3 atom set §3.3 + recipe set §3.4. Atom names rename: `engrave-top` (was bevel-bottom in v2), `plate-*` and `coin-*` (new), `pressed-*` → `coin-pressed-*`. |
| `apps/web/src/app/design-system/_styles/lime-cabin.css:30-43` | `--d1-bg-page/surface/card/card-soft` raw hex | OKLCH-recast same canonical pixels + 2 new tokens (`--d1-bg-card-elevated`, `--d1-bg-input`). |
| `lime-cabin.css:43` | `--d1-notification-amber` standalone | Becomes alias for `--d1-status-warning`; deprecation comment for one release. |
| `lime-cabin.css:349-368` (`.d1-kpi`) | `box-shadow: var(--d1-elev-tier1-rest)` + hover `transform: translateY(-2px)` | `background: var(--d1-bg-card-elevated)`, `box-shadow: var(--d1-elev-tier2-rest)`, hover = `--d1-elev-tier2-hover` only (no transform). |
| `lime-cabin.css:1269-1297` (`.d1-chart-panel`) | `background: var(--d1-bg-card)` + bevel | `background: var(--d1-bg-card-elevated)` + Tier 2 rest. Add §3.6 child-fill rule. |
| `lime-cabin.css:737-752` (`.d1-chat__search`) | `background: var(--d1-bg-page)` + Tier 1 rest | `background: var(--d1-bg-input)` + Tier 1 rest. |
| `lime-cabin.css:766-802` (form primitives) | `background: var(--d1-bg-surface)` + Tier 1 rest | `background: var(--d1-bg-input)` + Tier 1 rest + Tier 1 focus. |
| `lime-cabin.css:568-577` (`.d1-segmented` track) | `background: var(--d1-bg-page)` | `background: var(--d1-bg-input)` + Tier 1 rest. |
| `lime-cabin.css:281-308` (`.d1-nav__icon-pill`) | Tier 2 rest at rest + transform on hover | Tier 3 rest, no transform. Hover = Tier 3 hover. |
| `lime-cabin.css:458-461` (`.d1-kpi--error`) | inset amber ring + tier-1 atoms | inset `--d1-status-error` ring + Tier 2 rest. |
| `lime-cabin.css:87-138` (`.d1-cta` family) | Tier 2 rest on lime + transform on hover | Lime-on-lime atoms (§6.8) + Tier 3 active on press, no transform. |

### 7.2 PRESERVE

- Record Rail in entirety.
- All radius tokens.
- Geist Sans/Geist Mono stack.
- Disclaimer chip styles entire.
- Existing 2-px `outline: solid lime` focus rings on non-lime-fill elements.
- Insight-row hairline borders.
- Hatch-legend top border.
- Heatmap cell scaling.
- All chart palette mappings (`--chart-series-*`).
- All Tier 2 hover modulation that ALREADY animates `box-shadow` only (chart-panel hover).

### 7.3 RESTRUCTURE

- `_styles/lime-cabin.css` :root section: re-organise into 4 zones (palette, tonal layers, status, depth tokens). Currently mixes them. ~lines 28-72.
- `style-d1/_lib/depth.css` (origin/feat) → split into `depth.css` (atoms + recipes) and `surfaces.css` (the new tonal-layer tokens). 800-line guard friendly.
- `design-system/_sections/elevation-and-radii.tsx` narrative: replace v2's «3 layers (page/surface/card) + hover-card» with v3's «5 surface tonal levels × 4 depth tiers» framing.

### 7.4 Order of cutover (single-PR-safe, each step independently revertable)

1. Add OKLCH recasts of existing 4 surface tokens (visually identical, harmless).
2. Add 2 new tonal tokens (`--d1-bg-card-elevated`, `--d1-bg-input`). Unused initially.
3. Add 8 new status tokens (4 status × 2 modes). Unused initially.
4. Add v3 atom set + recipe set to `depth.css`. Unused initially.
5. Cut over `.d1-kpi` (background → elevated, shadow → tier-2, drop transform).
6. Cut over `.d1-chart-panel` + add §3.6 child-fill rule.
7. Cut over `.d1-cta` + `.d1-cta--ghost` (lime-on-lime atoms, drop transform).
8. Cut over `.d1-nav__icon-pill`, `.d1-nav__avatar`, `.d1-nav__brand` (Tier 3, drop transform).
9. Cut over `.d1-pill` (rest = flat, hover/active = Tier 3).
10. Cut over `.d1-chip` family.
11. Cut over `.d1-segmented` track + thumb (the dual-polarity moment).
12. Cut over `.d1-input` + `.d1-select` + `.d1-textarea` + `.d1-chat__search` (background → input, Tier 1).
13. Cut over `.d1-check` / `.d1-radio` / `.d1-toggle` polarity flip on checked.
14. Cut over `.d1-kpi--error` (amber → status-error).
15. Add `prefers-contrast: more` re-bindings.
16. Add reduced-motion block.
17. Update `elevation-and-radii.tsx` narrative.
18. Drop deprecated `--d1-notification-amber` after one release.

Each step is an independent commit; no big-bang. The team picks sequencing if it ships in slices.

---

## 8. `impeccable` Anti-Pattern Check

Run before writing any code, per `impeccable`'s «match-and-refuse» discipline.

| Anti-pattern | Pass / Fail | Evidence |
|---|---|---|
| Side-stripe borders (`border-left/right > 1px` as accent) | PASS — clean | Zero use. KPI--error uses `inset 0 0 0 1px` ring (full perimeter), not side-stripe. |
| Gradient text (`background-clip:text` + gradient) | PASS — clean | Zero use. All text is single solid color (`--d1-text-primary`, `--d1-text-ink`, `--d1-text-muted`, status colors). Hierarchy via Geist weight + size. |
| Glassmorphism as default | PASS — clean | Zero `backdrop-filter`. Tier 4 uses real drop-shadow on solid `--d1-bg-card`, not glass. |
| Hero-metric template | PASS — clean | Portfolio KPI uses Geist Mono at clamp(48-56px) — typographic hierarchy, no decorative gradient accent. The «look here» lime KPI signals via brand color, not aesthetic decoration. |
| Identical card grids | PASS — clean | KPI band has variable card sizes (portfolio is ~1.5× others) + lime accent break. Insight feed is row-rhythm, not card-grid. |
| Modal as first thought | PASS — clean | Tier 4 reserved; product flows are inline-progressive (filter chips, segmented, in-page disclosure). |
| Em dashes / `--` | PASS — clean (in code) | Doc prose uses em-dashes per spec format; *implementation copy* uses commas/colons/periods/parentheses. |
| Pure `#000` / `#fff` | PASS — clean | All neutrals tinted toward 280° purple at chroma 0.002-0.005. Pure white never used (text-primary `#FAFAFA`); pure black never used (text-ink `#0E0F11`). |
| Cards-in-cards | PASS — clean | §6.2 explicit rule: nested cards flatten to Tier 0 + hairline border. |
| Bounce / elastic easing | PASS — clean | Single house easing `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). |
| Tinted-neutrals discipline | PASS — clean | OKLCH recast at 0.002-0.005 chroma toward 280° (purple-leaning). |
| Animating layout properties | PASS — clean | Only `box-shadow` and `background-color` transition. No `top`/`margin`/`width`/`height`/`translateY` for cards (the v2 drop). |

**Verdict: 12/12 clean. Zero anti-pattern hits.**

---

## 9. Distinctiveness Defense — the v3 Signature

**The signature**: dual-polarity 1-pixel depth — read surfaces *plate-up* (Tier 2: gentle emboss + tonal lift), write surfaces *engrave-down* (Tier 1: bevel + sub-canvas luminance), press surfaces *coin-up* (Tier 3: firm emboss + ink-baseline). Three polarity zones on the same canvas, each at 1-px resolution, never blurred. The Record Rail (lime hairline) sits above the entire system, the only fully-saturated line on the page.

Why this avoids «every dark Tailwind dashboard 2025-26»:

1. **No competitor I'm aware of ships bidirectional polarity systematically.** Linear/Vercel/Stripe ship raised-only. Material 3 ships tonal-tint only. Apple HIG ships dual but for vibrancy effects, not as a semantic «read vs write» grammar. Bidirectionality with semantic axis is rare-to-unique in 2026 dark dashboards.
2. **Tonal step + bevel double signal** is what data-density needs. Most products pick one (Stripe = tonal, Linear = bevel). Combining them at low magnitude on each axis means cards read clearly without anything reading loud — exactly the «considered finance product» character the brief asked for.
3. **The Tier 1 inscribed-well below canvas** (bg-input *darker* than bg-page) is the most distinctive numeric move. Most dark UIs put inputs at *or above* canvas luminance. Inverting it semantically is the rarest choice and the one a knowledgeable designer would notice immediately as deliberate.
4. **Compositing the segmented thumb (Tier 3 coin) inside the segmented track (Tier 1 well)** is the one place where the dual polarity is visible in a single component. That tiny detail does more for distinctiveness than any token alone — it's a moment of demonstrable craft.
5. **Status color choices** (mint-success at 142°, coral-error at 25°, info-blue at 240° desaturated) reject the convention pile (lime-success, red-error, sky-info) without becoming weird. Production SOTA, not dashboard-by-numbers.
6. **Record Rail untouched**: the lime hairline at 30% above each card-cluster is still the loudest 1-px on the page, and v3 explicitly excludes it from the depth system. Signature protected, not blurred into the system.

What v3 is *not*: not «just lift everything» (PO's anchor — rejected), not «deboss everything for novelty» (v2 — rejected by PO), not generic tier-ladder (M3 cargo cult — rejected). It's a semantic polarity system where tier *means* something: read, write, press, float.

---

## 10. Counter-Positions Considered & Rejected

### 10.1 Stripe-pure flat (luminance-only, no bevel)
**Considered**: drop bevels entirely, ship cards as `--d1-bg-card-elevated` + 1-px hairline border, inputs as `--d1-bg-input` + 1-px hairline. Rest-state distinctiveness comes from luminance + border state alone. Hover modulates border-color.
**Rejected because**: PO explicitly chose depth as the *signature*. Flat-pure is the safety net (graceful degradation if bevels fail visual review on real hardware), not the primary system. Also: data-density products benefit from *two* signals over one — luminance carries the macro «which surface», bevel carries the micro «what kind of surface». Stripe is willing to ship a single signal because their product is sparse; ours is dense.

### 10.2 Material 3 tonal-tint elevation (mix lime/purple into surfaces by tier)
**Considered**: instead of bevel, mix 5-12% lime/purple tint into elevated surfaces. Higher tier = more brand tint.
**Rejected because**: lime tint on cards would compete with the Record Rail (the rail IS the lime element on the page). Purple tint on Tier 3 would lock CTAs to brand-mark color, which collapses brand identity into state semantics — wrong scope. Also: tint-shift is a coarser tool than bevel for 1-px crispness on dense data.

### 10.3 v2 deboss-at-rest revival with stronger atoms
**Considered**: keep cards recessed but bump engrave atoms to 50% black bottom + 12% white top to fix the «too flat» problem.
**Rejected because**: this fights the polarity assignment. PO's challenge wasn't «atoms too weak» — it was «cards aren't buttons; depth-as-interactivity-signal fails for passive surfaces». Stronger debossed bevels would make passive cards *more visible* but would still encode «press me» semantics on something you can't press. The axis is wrong, not the magnitude.

---

## 11. Confidence Levels

| Recommendation | Confidence |
|---|---|
| **«Cards plate-up at Tier 2, inputs engrave-down at Tier 1, buttons coin-up at Tier 3» as the polarity grammar** | HIGH |
| **Adding `--d1-bg-card-elevated` and `--d1-bg-input` as tonal-layer tokens** | HIGH — this is the single most impactful fix for the «cards read flat» diagnostic |
| **5-tier model (0/1/2/3/4) split-by-firmness for raised polarity** | HIGH — keeps a card and a button visually distinct when adjacent |
| **Hover does almost nothing on default cards (+0.03 top-light)** | HIGH — directly answers PO's «зачем hover на пассивной карточке» |
| **Adding `--d1-status-{success,warning,error,info}` quartet + soft companions** | MEDIUM — high value for dense data UI but expansion can be deferred to v3.1 if scope is tight; the depth system works without it |
| **OKLCH recast of existing palette with 0.002-0.005 280° chroma tint** | MEDIUM — visually invisible, future-proofs chroma adjustments, but pure-OKLCH adoption is a consistency win not a feature |
| **No new multi-series chart palette tokens (categorical-capped-at-5 with brand pair + status)** | HIGH — YAGNI applies; revisit when a chart actually needs it |
| **Status colour hue choices (142° / 75° / 25° / 240°)** | MEDIUM — defensible against M3/Linear/Stripe references, but exact hue calibration may want a monitor verification pass |
| **Atom magnitudes (engrave-bottom 38%, plate-bottom 22%, coin-bottom 28%, top-lights 7/10%)** | MEDIUM — calibrated against the v2 PO feedback («4%/32% reads flat»), but ±0.04 tolerance window applies; final values pending visual confirmation on real hardware |
| **Excluding Record Rail + disclaimer chip + heatmap cells + insight rows from depth** | HIGH |
| **Cards-in-cards flatten rule (Tier 0 + hairline)** | HIGH |
| **Reduced-motion = transition: 0ms, depth preserved** | HIGH |
| **`prefers-contrast: more` re-binds dark-edge atoms +0.10** | HIGH |
| **§3.6 transparent-bg fix for chart-panel children** | HIGH — directly addresses PO's `/design-system` vs `/style-d1` diagnostic |
| **Migration order (18-step, single-PR-safe)** | MEDIUM — defensible but team can re-sequence based on which surface ships first |

**Headline confidence (do this v3 system, not v2 deboss-at-rest, not PO's translateY anchor)**: HIGH.

---

*End of independent v3 proposal. Right-Hand to synthesise against PD + brand-strategist v3 outputs.*
