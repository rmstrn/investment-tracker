# D1 Elevation System

**Author:** product-designer
**Date:** 2026-05-02
**Status:** spec — awaiting brand-strategist sign-off via Right-Hand synthesis
**Scope:** D1 «Lime Cabin» locked design. Applies to both `[data-style="d1"]` (canonical theme at `apps/web/src/app/style-d1/_lib/theme.css`) AND `[data-theme="lime-cabin"]` (route-local mirror at `apps/web/src/app/design-system/_styles/lime-cabin.css`). Both files must land the same diff.

---

## 0. The directive (verbatim)

PO sees the current `.d1-kpi:hover` lift (`translateY(-2px)` + `0 8px 24px rgba(0,0,0,0.4)`) and wants THAT to be the **default rest-state** for every relevant component — KPIs, chart panels, buttons, chips, pills. Make the system, not the one-off.

---

## 1. Tier definitions

Three tiers. Naming reflects role + frequency, not just height.

| Tier | Role | Rest Y | Rest shadow | Hover Y | Hover shadow | Active Y | Active shadow |
|---|---|---|---|---|---|---|---|
| **T1 — Anchored surface** | Reading destinations the user lands on (KPIs, chart panels) | `-2px` | `0 8px 24px rgba(0,0,0,0.4)` | `-4px` | `0 12px 32px rgba(0,0,0,0.5)` | n/a (non-interactive in T1 today) | n/a |
| **T2 — Interactive surface** | Things you click (CTA, chips, pills, segmented buttons) | `-1px` | `0 3px 10px rgba(0,0,0,0.3)` | `-3px` | `0 8px 20px rgba(0,0,0,0.42)` | `0px` (press-down) | `0 1px 3px rgba(0,0,0,0.35)` |
| **T3 — Chrome / utility** | Page-level surface, persistent disclosure, atomic typography, micro-data atoms | flat | none | bg-only shift | none | n/a | n/a |

### Shared transition (all tiers)

```css
transition:
  transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
  box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
```

**200ms** chosen because:
- `.d1-kpi` already uses 200ms in the existing rule — preserves continuity.
- `.d1-cta` uses 180ms today; 200ms is within perception-equivalent window (Saffer §4) and unifying simplifies the system.
- Pills/chips use 120ms today for `background`/`color` only (no lift). Those bg/color transitions stay at 120ms (snappy state-change) and stack alongside the new 200ms transform/shadow. Composite transition list per tier shown in §3.
- Cubic-bezier `(0.16, 1, 0.3, 1)` is the existing easing (`out-expo`); keep it for system continuity.

### Why these numbers (not arbitrary)

- **T1 rest = current `.d1-kpi:hover`.** This is the directive — verbatim.
- **T1 hover = +2px Y, +50% shadow blur.** Doubles the perceived altitude without crossing into «card flying off the page» territory. `0 12px 32px /0.5` is the editorial-magazine cover-card precedent (NYT Cooking, Pitchfork features).
- **T2 rest = `translateY(-1px)`.** The existing `.d1-cta:hover` value, lifted to rest. Subtle enough that 8 chips on a single row don't feel like a popcorn-popping interface.
- **T2 active = `0px`.** Press-down feedback. Critical for tactile honesty — if rest is lifted and hover lifts further, click MUST settle DOWN to communicate state-change. Microinteractions §3 (Saffer): «feedback must trace the state delta, not just the final state».
- **T3 = flat.** Chrome doesn't compete with content. The persistent disclaimer chip, nav icons, and atomic data lines are reading scaffolding — they earn their visual weight from typography, not depth.

---

## 2. Selector → tier mapping

Every D1 surface and interactive selector classified.

### Tier 1 — Anchored surface (lift at rest)

| Selector | Notes |
|---|---|
| `.d1-kpi` | Default KPI card. Includes `.d1-kpi--portfolio`, `.d1-kpi--error`, `.d1-kpi--empty` modifiers (variants inherit base elevation). |
| `.d1-kpi--lime` | Lime-filled Drift KPI. **Override:** shadow uses `rgba(0,0,0,0.25)` instead of `0.4` — lower opacity reads as warmth on the saturated lime surface, not as a hole punched in the page. Same `-2px` Y. |
| `.d1-panel` | Chart panels (BarVisx, AreaVisx, DonutVisx, LineVisx, SparklineVisx, StackedBarVisx, CalendarVisx, TreemapVisx, WaterfallVisx — all 9 visx types render inside `.d1-panel`). |

### Tier 2 — Interactive surface (subtle lift at rest, push on hover, press on active)

| Selector | Notes |
|---|---|
| `.d1-cta` | Primary lime CTA. **Replaces** existing `.d1-cta:hover { transform: translateY(-1px) }` rule (now the rest state). |
| `.d1-cta--ghost` | Inherits base `.d1-cta` elevation. The inset-1px hairline border stacks via comma box-shadow (see §6 stacking rules). |
| `.d1-pill` | Default nav pill (transparent bg). **Replaces** existing `:hover { background, color }` background-only treatment — bg shift PRESERVED (now stacks with lift). |
| `.d1-pill--active` | Lime-filled active nav pill. Lift applies. Bg/color stay (lime fill, ink text). |
| `.d1-chip` | Filter chip default. **Replaces** existing `:hover { background, color }` bg-only treatment — bg shift PRESERVED. |
| `.d1-chip--active` | Active filter chip. **Stacks:** outer T2 shadow + existing inset-1px lime hairline (`box-shadow: inset 0 0 0 1px rgba(214,242,107,0.4)`). See §6. |
| `.d1-chip--icon` | Icon-only filter chip. T2. |
| `.d1-chip--export` | Export filter chip. T2. |
| `.d1-segmented__btn` | Segmented control button (Monthly / Annually / 6 wks). T2 lift, bg/color preserved on active. |
| `.d1-segmented__btn--active` | Active segmented button. **Stacks** outer T2 shadow + inset-1px lime hairline. See §6. |
| `.d1-chip-premium` | Purple-soft Premium pip chip. **Note:** non-interactive label today (no hover/click handler in `style-d1/page.tsx`); but visually lives in the chip family — give it T2 rest only, no hover/active (it's a label, not a button). Justification: visual consistency with the chip family on a 24px-tall surface. **Open question for PO** — see §9. |

### Tier 3 — Chrome / utility (flat)

| Selector | Reason |
|---|---|
| `.d1-disclaimer-chip` | **Lane-A regulatory cure.** Elevating it would create attention competition with the live dashboard data. Disclosure is passive scaffolding, not a control. Stays flat. |
| `.d1-nav__icon-pill` | Search + bell icon pills. Utilitarian chrome — they sit in nav, not in the data band. Existing `:hover { color }` bg-color shift preserved. |
| `.d1-nav__brand` | Static «P» monogram. Decorative, not interactive. |
| `.d1-nav__avatar` | Static user-initial circle. Click target later (account menu) — when that arrives, promote to T2. Today: T3. |
| `.d1-pill__count` | Amber count badge inside a pill. Atomic data atom. |
| `.d1-rail` + `.d1-rail__tick` + `.d1-rail__date` + `.d1-rail__line` | The Provedo Record Rail signature element. Editorial typography, not a surface. Flat. |
| `.d1-eyebrow`, `.d1-eyebrow-row__lead`, `.d1-eyebrow-row__name` | Typography. Flat. |
| `.d1-num` | Inline numeral atom. Flat. |
| `.d1-disclosure` | Lane-A regulatory disclosure strip. Flat. |
| `.d1-hatch-legend` + `.d1-hatch-legend__swatch` + `.d1-hatch-legend__label` + `.d1-hatch-legend__value` | Static legend atoms inside `.d1-panel`. Inherits panel elevation; legend itself stays flat. |
| `.d1-heatmap__cell`, `.d1-heatmap__rowlabel`, `.d1-heatmap__collabel` | Data atoms. The heatmap as a whole sits inside `.d1-panel` (T1) — cells stay flat. |
| `.d1-chat__search` | Search/filter input. Form input family. Flat (existing 1px hairline border preserved). |
| `.d1-input`, `.d1-select`, `.d1-textarea` | Form inputs. Existing focus uses `box-shadow: 0 0 0 3px rgba(214,242,107,0.18)` — preserved. Flat at rest. |
| `.d1-check`, `.d1-radio`, `.d1-toggle` | Form controls. Flat. |
| `.d1-field`, `.d1-field__label`, `.d1-field__hint` | Form scaffolding. |
| `.ds-sidenav__link` | Showcase side-nav link (`/design-system` only). Existing `:hover { background, color }` preserved. |

### Excluded (not a card, not a control)

| Selector | Reason |
|---|---|
| `.d1-page`, `.d1-shell` | Page-level layout containers. Page background, not a card. |
| `.d1-surface` | Inner page-shell wrapper. Same reasoning. |
| `.d1-marketing` | Marketing strip — typography zone above the dashboard. |
| `.d1-grid` | CSS Grid container. Not a paintable surface. |
| `.d1-kpi-row`, `.d1-chips`, `.d1-nav` | Layout rows. |
| `.d1-panel__head`, `.d1-panel__body`, `.d1-panel__caption` | Internal panel slots. Inherit from `.d1-panel` (T1). |
| `.d1-kpi__head`, `.d1-kpi__num`, `.d1-kpi__delta`, `.d1-kpi__label`, `.d1-kpi__icon-chip`, `.d1-kpi__ext` | Internal KPI slots. Inherit from `.d1-kpi` (T1). |
| `.d1-insight` | **Card-in-card avoidance.** The parent `.d1-panel` (T1) carries the elevation; the row inside stays flat to preserve visual hierarchy (Wathan §9 — «depth must read as a single layer, not a stack»). When real expand/click handlers ship on `.d1-insight` later, promote to T2 — but never T1. |
| `.d1-insights` | List wrapper. |
| `.ds-showcase`, `.ds-section`, `.ds-row`, `.ds-callout` | Showcase chrome on `/design-system` route. Flat. |

### Counts

- **T1:** 3 selectors (+ KPI variant modifiers)
- **T2:** 11 selectors (CTA + ghost + pill + pill-active + chip + chip-active + chip-icon + chip-export + segmented + segmented-active + chip-premium)
- **T3:** 24 selectors
- **Excluded:** 17+ layout/atomic selectors

---

## 3. Per-tier CSS

### T1 — Anchored surface

```css
[data-style="d1"] .d1-kpi,
[data-style="d1"] .d1-panel,
[data-theme="lime-cabin"] .d1-kpi,
[data-theme="lime-cabin"] .d1-panel {
  /* Rest is now the lift. */
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition:
    transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-style="d1"] .d1-kpi:hover,
[data-style="d1"] .d1-panel:hover,
[data-theme="lime-cabin"] .d1-kpi:hover,
[data-theme="lime-cabin"] .d1-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}

/* Lime KPI override — softer shadow on saturated bg. */
[data-style="d1"] .d1-kpi--lime,
[data-theme="lime-cabin"] .d1-kpi--lime {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
[data-style="d1"] .d1-kpi--lime:hover,
[data-theme="lime-cabin"] .d1-kpi--lime:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
}
```

### T2 — Interactive surface

```css
[data-style="d1"] .d1-cta,
[data-style="d1"] .d1-pill,
[data-style="d1"] .d1-chip,
[data-style="d1"] .d1-segmented__btn,
[data-style="d1"] .d1-chip-premium,
[data-theme="lime-cabin"] .d1-cta,
[data-theme="lime-cabin"] .d1-pill,
[data-theme="lime-cabin"] .d1-chip,
[data-theme="lime-cabin"] .d1-segmented__btn,
[data-theme="lime-cabin"] .d1-chip-premium {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  /* Tier 2 transition stacks lift + the existing bg/color treatments. */
  transition:
    transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1),
    background 120ms cubic-bezier(0.16, 1, 0.3, 1),
    color 120ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hover — push further. (`.d1-chip-premium` excluded — it is a label.) */
[data-style="d1"] .d1-cta:hover,
[data-style="d1"] .d1-pill:hover,
[data-style="d1"] .d1-chip:hover,
[data-style="d1"] .d1-segmented__btn:hover,
[data-theme="lime-cabin"] .d1-cta:hover,
[data-theme="lime-cabin"] .d1-pill:hover,
[data-theme="lime-cabin"] .d1-chip:hover,
[data-theme="lime-cabin"] .d1-segmented__btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.42);
}

/* Active — press-down. Settles below rest baseline. */
[data-style="d1"] .d1-cta:active,
[data-style="d1"] .d1-pill:active,
[data-style="d1"] .d1-chip:active,
[data-style="d1"] .d1-segmented__btn:active,
[data-theme="lime-cabin"] .d1-cta:active,
[data-theme="lime-cabin"] .d1-pill:active,
[data-theme="lime-cabin"] .d1-chip:active,
[data-theme="lime-cabin"] .d1-segmented__btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

/* Disabled — flat, no lift, no transition flicker on disabled-attr toggle. */
[data-style="d1"] .d1-cta:disabled,
[data-style="d1"] .d1-pill:disabled,
[data-style="d1"] .d1-chip:disabled,
[data-style="d1"] .d1-segmented__btn:disabled,
[data-theme="lime-cabin"] .d1-cta:disabled,
[data-theme="lime-cabin"] .d1-pill:disabled,
[data-theme="lime-cabin"] .d1-chip:disabled,
[data-theme="lime-cabin"] .d1-segmented__btn:disabled {
  transform: none;
  box-shadow: none;
  opacity: 0.5;
  cursor: not-allowed;
}
```

### T3 — Chrome (no spec needed, just affirm: no transform, no box-shadow)

T3 elements stay as-authored. Existing `:hover { background, color }` shifts on `.d1-pill`-style elements **above** that are in T2 are preserved by stacking with the new transform/shadow rules (the bg/color transitions stay in the composite transition list).

---

## 4. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Existing global rule already kills all transitions on [data-style="d1"]
   * (theme.css line 1015). It already handles the transitions side. We add
   * a transform-suppression rule so users who prefer reduced motion still
   * get a stable, non-shifting layout — only box-shadow communicates depth. */
  [data-style="d1"] .d1-kpi,
  [data-style="d1"] .d1-panel,
  [data-style="d1"] .d1-cta,
  [data-style="d1"] .d1-pill,
  [data-style="d1"] .d1-chip,
  [data-style="d1"] .d1-segmented__btn,
  [data-style="d1"] .d1-chip-premium,
  [data-theme="lime-cabin"] .d1-kpi,
  [data-theme="lime-cabin"] .d1-panel,
  [data-theme="lime-cabin"] .d1-cta,
  [data-theme="lime-cabin"] .d1-pill,
  [data-theme="lime-cabin"] .d1-chip,
  [data-theme="lime-cabin"] .d1-segmented__btn,
  [data-theme="lime-cabin"] .d1-chip-premium {
    transform: none !important;
  }
  /* Hover state on reduced-motion: only the box-shadow change communicates
   * the «I noticed your cursor» feedback. No vertical motion. */
  [data-style="d1"] .d1-kpi:hover,
  [data-style="d1"] .d1-panel:hover,
  [data-style="d1"] .d1-cta:hover,
  [data-style="d1"] .d1-pill:hover,
  [data-style="d1"] .d1-chip:hover,
  [data-style="d1"] .d1-segmented__btn:hover,
  [data-theme="lime-cabin"] .d1-kpi:hover,
  [data-theme="lime-cabin"] .d1-panel:hover,
  [data-theme="lime-cabin"] .d1-cta:hover,
  [data-theme="lime-cabin"] .d1-pill:hover,
  [data-theme="lime-cabin"] .d1-chip:hover,
  [data-theme="lime-cabin"] .d1-segmented__btn:hover {
    transform: none !important;
    /* Box-shadow still updates — depth without motion. */
  }
}
```

**Note on existing rule:** `theme.css` line 1015-1020 already has `[data-style="d1"] *  { animation: none !important; transition: none !important; }`. That kills all transitions, which is correct behavior for reduced-motion. The block above ADDS the `transform: none !important` constraint so the static rest-state is flat (no `-2px` baseline shift) for users who opt out — they get depth via shadow only, exactly as the brief specifies.

The `lime-cabin.css` mirror needs the equivalent global block; today it has nothing. Add it as part of this work.

---

## 5. Focus-ring cascade

### Current state of focus rings in D1

- Buttons / chips / pills / KPI-future / segmented / nav-icon-pill / side-nav-link / form-controls all use **`outline: 2px solid var(--d1-accent-lime)`** + `outline-offset`. Outline draws over `box-shadow` natively — **no cascade conflict**, no work to do for these.
- Form inputs (`.d1-input`, `.d1-select`, `.d1-textarea`) use **`box-shadow: 0 0 0 3px rgba(214, 242, 107, 0.18)`**. Inputs are T3 (no elevation) — **no conflict**.
- `.d1-kpi:focus-visible` — currently no rule (see comment at theme.css:393-400 — KPI cards are non-interactive in canonical preview). When KPIs become focusable (drill-through, expand-on-click), we need a rule. Spec'd below as the canonical T1-focus-with-elevation pattern.

### Canonical T1 focus rule (when KPI / panel becomes interactive)

```css
[data-style="d1"] .d1-kpi:focus-visible,
[data-style="d1"] .d1-panel:focus-visible,
[data-theme="lime-cabin"] .d1-kpi:focus-visible,
[data-theme="lime-cabin"] .d1-panel:focus-visible {
  /* Layered box-shadow: focus ring (lime, 2px) FIRST so it sits above
   * the elevation drop-shadow. Both shadows applied in one declaration. */
  box-shadow:
    0 0 0 2px var(--d1-accent-lime),
    0 8px 24px rgba(0, 0, 0, 0.4);
  outline: none; /* Hand off to box-shadow for layering. */
}

/* Hover-while-focused — both shadows scale up. */
[data-style="d1"] .d1-kpi:focus-visible:hover,
[data-style="d1"] .d1-panel:focus-visible:hover,
[data-theme="lime-cabin"] .d1-kpi:focus-visible:hover,
[data-theme="lime-cabin"] .d1-panel:focus-visible:hover {
  box-shadow:
    0 0 0 2px var(--d1-accent-lime),
    0 12px 32px rgba(0, 0, 0, 0.5);
}
```

**Why box-shadow not outline for T1 focus:** A 2px lime outline at offset 2px reads as a halo-disconnect on a card that's also drop-shadowing. Stacking both as box-shadows lets the ring hug the radius (24px on KPI, 24px on panel) and sit at the same blur layer — visually unified.

### Demo: focused, hovered KPI card

```css
/* Worst-case stacking: KPI is focused AND hovered AND lime-fill variant. */
[data-style="d1"] .d1-kpi--lime:focus-visible:hover {
  box-shadow:
    0 0 0 2px var(--d1-accent-lime),       /* focus ring */
    0 12px 32px rgba(0, 0, 0, 0.32);       /* T1-hover, lime-soft variant */
  outline: none;
}
```

### T2 (button family) — keep outline

T2 elements are pill-shaped (`border-radius: 9999px`) and small. The 2px lime outline at offset 2px reads cleanly against the dark page bg, doesn't fight the modest T2 drop-shadow, and avoids re-engineering every chip. **Keep as-is** (no change to existing outline-based focus rules on T2).

---

## 6. Edge cases

### 6.1 Cards inside cards

**Decision: inner card does NOT inherit T1 elevation.** Card-in-card breaks visual hierarchy — depth must read as a single layer, not a stack.

Concrete cases:
- `.d1-insight` lives inside `.d1-panel`. Panel = T1. Insight = excluded (flat row). Borders separate insights, not shadows.
- `.d1-hatch-legend` lives inside `.d1-panel`. Panel = T1. Legend = T3 (flat — already a hairline-bordered atom).
- `.d1-heatmap` lives inside `.d1-panel`. Cells = T3.

### 6.2 Already-soft surface (`--d1-bg-card-soft` panels)

`.d1-bg-card-soft` is currently used as bg for `.d1-chip--active`, `.d1-segmented__btn--active`, and as the chart panel `--card-highlight` token. None are panels themselves. No conflict.

### 6.3 Active-state on a button suppresses lift

**Yes — T2 active = `translateY(0)` and minimal `0 1px 3px /0.35` shadow.** This is press-down behavior — when a user clicks, the surface settles below rest baseline. The shadow contracts to a tight kiss. Critical for tactile honesty.

### 6.4 Reduced-motion + hover

**Only box-shadow changes on hover.** Transform stays `none`. The shadow is the entire feedback channel for users who opt out of motion. See §4.

### 6.5 Chip/segmented active state — stacking inset hairline + outer elevation

`.d1-chip--active` and `.d1-segmented__btn--active` carry an existing `box-shadow: inset 0 0 0 1px rgba(214, 242, 107, 0.4)` lime hairline. The new T2 elevation also uses `box-shadow`. Stack via comma-list:

```css
[data-style="d1"] .d1-chip--active,
[data-theme="lime-cabin"] .d1-chip--active {
  /* T2 rest elevation + existing inset lime hairline. Order: outer first,
   * inset second — paint order is right-to-left, so inset draws on top. */
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(214, 242, 107, 0.4);
  transform: translateY(-1px);
}

[data-style="d1"] .d1-chip--active:hover,
[data-theme="lime-cabin"] .d1-chip--active:hover {
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.42),
    inset 0 0 0 1px rgba(214, 242, 107, 0.6);
  transform: translateY(-3px);
}

/* Same pattern for segmented active. */
[data-style="d1"] .d1-segmented__btn--active,
[data-theme="lime-cabin"] .d1-segmented__btn--active {
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(214, 242, 107, 0.4);
  transform: translateY(-1px);
}
```

### 6.6 KPI error variant (`--error`)

`.d1-kpi--error` carries an existing `box-shadow: inset 0 0 0 1px var(--d1-notification-amber)` to flag stale data. Same comma-stack pattern as chip-active:

```css
[data-theme="lime-cabin"] .d1-kpi--error {
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px var(--d1-notification-amber);
}
```

### 6.7 Touch / no-hover environments

`@media (hover: none)` — on touch devices, `:hover` pseudo can stick on tap. Tier 2 hover state will be visible as a brief lift before active fires. Acceptable — modern iOS/Android handle this gracefully via the active-press outweighing residual hover. No additional rule needed.

### 6.8 KPI-portfolio variant (160px tall)

`.d1-kpi--portfolio` only changes `min-height` and numeral font-size. Inherits T1 base elevation. No override.

---

## 7. What this REPLACES

Rules that get superseded or restructured. The frontend-engineer must remove or modify each.

### Replaced — fully superseded by new tier rules

1. `.d1-kpi:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }` — theme.css lines 389-392 + lime-cabin.css lines 295-298. **Replaced** — that pattern is now the rest state, with a new push-further hover.
2. `.d1-cta:hover { transform: translateY(-1px); }` — theme.css lines 152-154 + lime-cabin.css lines 105-107. **Replaced** — `-1px` is now T2 rest; hover pushes further.
3. `.d1-kpi { transition: transform 200ms..., box-shadow 200ms... }` — theme.css lines 385-386 + lime-cabin.css lines 291-292. **Restructured** — transition stays, but is the system-shared 200ms cubic-bezier (no semantic change, just unification).
4. `.d1-cta { transition: transform 180ms cubic-bezier(...) }` — theme.css line 149 + lime-cabin.css line 102. **Restructured** — bumped 180ms → 200ms, added box-shadow to transition list.
5. `.d1-pill { transition: background 120ms..., color 120ms... }` — theme.css lines 231-233 + lime-cabin.css lines 182-184. **Restructured** — composite transition extended to add transform/box-shadow at 200ms; bg/color stay at 120ms.
6. `.d1-chip { transition: background 120ms..., color 120ms..., border-color 120ms... }` — theme.css lines 528-530 + lime-cabin.css lines 411-413. **Restructured** — same as pill; add transform/box-shadow.
7. `.d1-segmented__btn { transition: background 120ms..., color 120ms..., box-shadow 120ms... }` — theme.css lines 645-647 + lime-cabin.css lines 475-477. **Restructured** — add transform; bump box-shadow segment to 200ms (was 120ms — needs to match the new shadow lift duration).
8. `.d1-chip--active { box-shadow: inset 0 0 0 1px rgba(214,242,107,0.4) }` + `:hover` variant — theme.css lines 553, 559 + lime-cabin.css lines 433, 439. **Restructured** — comma-stack outer T2 shadow with existing inset hairline.
9. `.d1-segmented__btn--active { box-shadow: inset 0 0 0 1px rgba(214,242,107,0.4) }` — theme.css line 662 + lime-cabin.css line 487. **Restructured** — same comma-stack as chip-active.
10. `.d1-kpi--error { box-shadow: inset 0 0 0 1px var(--d1-notification-amber) }` — lime-cabin.css line 381. **Restructured** — comma-stack with T1 outer shadow.

### Preserved (no change)

- All `.d1-X:focus-visible { outline: 2px solid lime, outline-offset: 2px }` rules — outline still wins over box-shadow elevation. Untouched.
- `.d1-input` / `.d1-select` / `.d1-textarea` `:focus-visible { box-shadow: 0 0 0 3px rgba(...) }` — inputs are T3, no elevation conflict.
- `.d1-pill:hover { background, color }` and `.d1-chip:hover { background, color }` — bg/color shift PRESERVED, just stacks with the new transform/shadow.
- `.d1-nav__icon-pill:hover { color }` — T3, untouched.
- `.ds-sidenav__link:hover { background, color }` — T3, untouched.
- `.d1-cta:focus-visible { outline: 2px solid lime, outline-offset: 3px }` — preserved.
- `.d1-cta:disabled { opacity: 0.5; transform: none }` — preserved (already correct behavior).
- All form-control hover/focus/checked rules — T3, untouched.

### Net change count

- **Restructured (existing rule modified):** 10
- **Net new rules added:** ~14 (T1 base+hover, T1-lime override+hover, T2 base+hover+active+disabled, T2 stacked-active rules ×2, focus-cascade T1 spec, reduced-motion block)
- **Removed entirely:** 0 (everything either preserved or restructured)

---

## 8. DNA rationale (the «every dark dashboard» pre-emption)

D1's identity is not its drop shadows — it's the lime-as-look-here, the editorial Record Rail, the pill nav vocabulary, the hatched-bar SVG patterns, and the AAA contrast on Geist Mono numerals. Adding a tiered elevation system does not sand any of those off. What it does is remove the «glued-flat» quality the cards have today: in the canonical preview every card sits at the same Z-altitude as the page background, and the user has no sense the dashboard is a stack of reading destinations rather than a printed page.

The objection «doesn't this just make it look like every dark Tailwind dashboard» rests on a category mistake. Generic dark dashboards have *uniform* elevation — every card same height, every button same hover-lift, no hierarchy. What we are specifying is the opposite: T1 cards lift more than T2 buttons; T3 chrome stays flat; the lime KPI uses a softer warmer shadow than the dark KPIs; the disclaimer chip stays explicitly flat as a regulatory cure. This is *tiered* elevation, and tiered elevation reads as architectural intent — the same way Refactoring UI, Tufte's «small multiples», and editorial magazines (Pitchfork, Apartamento) use depth to separate reading levels. Generic dashboards skip the tiering work and ship a single hover-lift; we're doing the work.

The Record Rail, Geist Mono numerals, lime sparingly applied, hatched bars, charcoal canvas, and Lane-A disclaimer chip remain the identity vectors. The elevation system is supporting hierarchy, not voice.

**One-line counter:** generic dashboards ship one hover-lift; we ship three tiers, soften the lime card's shadow, and keep the regulatory chip flat — that's tiered editorial depth, not Tailwind defaults.

---

## 9. Open questions for PO (flagged for Right-Hand synthesis)

1. **`.d1-chip-premium` — keep T2 or push to T3?** The Premium pip is a static label today, not a button (no click handler). Spec assigns T2 (rest lift only) for visual consistency with the chip family. Alternative is T3 (flat). Brand-strategist may prefer flat — a Premium pip that subtly floats might read as an invitation to upsell, which is not in scope this phase.

2. **Future `.d1-insight` interactivity.** When AI insights become expandable (Phase 2 chat-features), the row promotes from T3 → T2. Confirm direction before frontend-engineer ships any `.d1-insight:focus-within` rules. The current spec leaves `.d1-insight` flat — ratify.

3. **`.d1-kpi--lime` softer shadow opacity (0.25 vs 0.4 dark variant).** Justified above as «warmth not drama on a saturated lime surface». If brand-strategist wants the lime KPI to read as the loudest card on the page, drop this override — keep `0.4` everywhere. Spec defaults to softer for editorial restraint; flag for synthesis.

4. **`.d1-disclaimer-chip` exclusion confirmed.** Spec keeps it flat. Brand-strategist may push for «make the regulatory cure more visible by elevating it» — this is a finance/legal regression risk: visible ≠ trustworthy in this context, the chip needs to read as scaffolding, not advertising. Holding the exclusion line; flagging for awareness.

---

## 10. Acceptance criteria (for frontend-engineer)

- [ ] Both `apps/web/src/app/style-d1/_lib/theme.css` and `apps/web/src/app/design-system/_styles/lime-cabin.css` carry the same diff.
- [ ] `.d1-kpi`, `.d1-panel`, `.d1-cta`, `.d1-pill`, `.d1-chip`, `.d1-segmented__btn` all have rest-state transform + box-shadow per spec.
- [ ] `.d1-kpi--lime` carries softer shadow (0.25 / 0.32 opacity).
- [ ] `.d1-chip--active`, `.d1-segmented__btn--active`, `.d1-kpi--error` carry comma-stacked outer-elevation + existing-inset rules.
- [ ] T2 active state suppresses lift (`translateY(0)` + tight contracted shadow).
- [ ] Reduced-motion block suppresses transform; box-shadow still changes on hover.
- [ ] T3 selectors untouched (verify via grep that no transform was added to `.d1-disclaimer-chip`, `.d1-nav__icon-pill`, `.d1-rail*`, `.d1-heatmap__cell`, etc.).
- [ ] Visual regression: 320 / 768 / 1024 / 1440 screenshots clean on `/style-d1` and `/design-system`.
- [ ] No new color tokens introduced. All shadows use `rgba(0,0,0, ...)` literals.
- [ ] Existing focus-ring outlines preserved; T1 focus-cascade rule documented but only ships when KPI/panel becomes focusable (no dead CSS).

---

## Appendix A — Token candidate list (for future Style Dictionary lift)

When `tokens/semantic/lime-cabin.json` finally consumes this system, semantic tokens to emit:

```
--d1-elevation-1-rest:    0 8px 24px rgba(0, 0, 0, 0.4)
--d1-elevation-1-hover:   0 12px 32px rgba(0, 0, 0, 0.5)
--d1-elevation-1-soft-rest:    0 8px 24px rgba(0, 0, 0, 0.25)   /* lime KPI */
--d1-elevation-1-soft-hover:   0 12px 32px rgba(0, 0, 0, 0.32)
--d1-elevation-2-rest:    0 3px 10px rgba(0, 0, 0, 0.3)
--d1-elevation-2-hover:   0 8px 20px rgba(0, 0, 0, 0.42)
--d1-elevation-2-active:  0 1px 3px rgba(0, 0, 0, 0.35)
--d1-elevation-rest-y-1:  -2px
--d1-elevation-hover-y-1: -4px
--d1-elevation-rest-y-2:  -1px
--d1-elevation-hover-y-2: -3px
--d1-elevation-active-y-2: 0
--d1-elevation-duration:  200ms
--d1-elevation-ease:      cubic-bezier(0.16, 1, 0.3, 1)
```

Not in scope for this PR — flag for ADR follow-up after cutover.
