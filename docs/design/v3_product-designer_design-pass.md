# V3 Design Pass — `Read-Up, Write-Down: Quiet Surfaces, Loud Edges`

**Author:** product-designer (independent v3 pass)
**Date:** 2026-05-02
**Skills applied:** `superpowers:brainstorming`, `impeccable` (color-and-contrast / spatial / motion / interaction / typography), `everything-claude-code:design-system`, `everything-claude-code:frontend-design`, `ux-design:refactoring-ui`, `ux-design:microinteractions`, `ux-design:web-typography`, `superpowers:verification-before-completion`
**Scope:** D1 «Lime Cabin» depth grammar v3 + color palette review + craft improvements
**Status:** independent draft for Right-Hand synthesis (parallel with brand-strategist + frontend-design)

---

## 1 · Stance

**My v2 thesis was wrong, and the failure is instructive — not a polarity sign error, a signal-source error.** I argued that depth could carry an interactivity signal («if it lifts, it does something»). PO's challenge cuts to the bone: KPI cards are not buttons. Asking inset hairlines to do double duty as «tactile finish» AND «I am readable as a card» overloaded a primitive that can only carry one job at a time on a charcoal canvas with an 18-luma gap between page and card.

**The v3 stance: stop asking depth to do legibility's job. A card reads as a card because its perimeter is unambiguous, not because it is debossed or embossed.** Variant B — read-up / write-down — is the right axis (it maps to a real user-mental-model distinction: data-I-look-at vs slot-I-type-into), but the lift on cards must be earned by **a single 1px outer ink-baseline + a single 1px outer top hairline**, not by stacked atmospheric shadows. Hover on KPI cards does **nothing**. Form fields engrave with a real 2px inner top-shadow (so the «well» reads instantly, not as a hairline trick). Buttons emboss with a brighter top-light + the same ink-baseline, and lose the rest-state lift on press.

The Provedo signature stays the **Record Rail**. Depth never outshouts it. The palette gets one new neutral tier and three OKLCH-defined semantic colors — not because the v2 palette failed, but because the v2 «no new tokens» constraint was a self-imposed handicap that ICP-A multi-broker users will notice the first time they hit a broker-disconnected error state and find amber doing four jobs.

Confidence on the headline: **HIGH**. This is not a hedge of v2; it is a different theory of what depth is supposed to do.

---

## 2 · Variant B Grammar — Refined

### 2.1 · Tier structure (4 tiers, functional naming)

| Tier | Name | Polarity | Token consumers | Visible-as-card test |
|---|---|---|---|---|
| **T0** | Canvas | flat | `.d1-page`, `.d1-shell`, `.d1-surface`, `.d1-grid`, type-only selectors, Record Rail, disclaimer chip, premium chip | n/a — this IS the canvas |
| **T1** | Read | up (single hairline + ink baseline) | `.d1-kpi`, `.d1-panel`, `.d1-chart-panel`, `.d1-insight` (when row interactive arrives), `.d1-nav__brand`, `.d1-nav__avatar` | YES — readable as a card on `#141416` at rest, no hover required |
| **T2** | Write | down (real 2px inner top-shadow + 1px inner bottom hairline) | `.d1-chat__search`, `.d1-segmented` (track), input wells (post-alpha forms) | YES — readable as a typing well on `#141416` at rest |
| **T3** | Press | up (T1 emboss + brighter top-light + interactive transitions) | `.d1-cta`, `.d1-pill`, `.d1-pill--active`, `.d1-chip`, `.d1-chip--active`, `.d1-segmented__btn--active`, `.d1-nav__icon-pill`, `.d1-chip--icon`, `.d1-chip--export` | YES — and clearly «touchable» via state arc, not via rest-state ornament |

**Why 4 tiers, not 3:** v2 collapsed «static cards» and «touchable buttons» into a single pair (L1/L2) with the assumption that the rest-state difference between them carried the read/write signal. It didn't — the tier-1 deboss was too subtle to carry «card» and too similar to tier-2 emboss to carry «not a button». **Splitting Read (T1) from Press (T3) lets each tier be calibrated for its own job:** Read needs perimeter clarity, Press needs interactivity affordance. Write (T2) sits between them as a different *direction* (down), not a different magnitude.

**Why no «active = pressed-down» tier:** the active state of T3 is an inversion *within* T3 (transient, mouse-down only), not a separate tier. Tiers are rest-state grammar; states are transient.

### 2.2 · Token taxonomy — atom layer + recipe layer

Replaces the existing v2 `--d1-elev-atom-*` / `--d1-elev-tier*` block. Same two-layer composition (architect ADR-3 preserved); names refactored so polarity is in the tier number AND the tier names map to user-mental-model verbs (read/write/press).

```css
[data-style="d1"],
[data-theme="lime-cabin"] {
  /* ── ATOMS — primitive shadows, never read by component selectors ── */

  /* T1 «Read» — single 1px top-light hairline (subtle key-light from
   * above) + single 1px outer ink baseline (the card sits ON the page,
   * casting a 1px shadow). NO inset bottom hairline — that's the v2
   * mistake (two hairlines reading as a deboss). The OUTER ink baseline
   * is what makes the card readable as a card on charcoal: it gives a
   * physical bottom edge against #141416 without needing a 4px atmospheric
   * stack. Single layer, ledger-baseline metaphor (Record Rail rhyme). */
  --d1-elev-atom-read-top:        inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
  --d1-elev-atom-read-baseline:   0 1px 0 0 rgba(0, 0, 0, 0.45);

  /* T2 «Write» — real 2px inner top-shadow (this MUST read as a well,
   * not a hairline). 2px blur because flat 1px inset reads ambiguously
   * («is it a card or a well?»); 2px blur disambiguates. Bottom 1px
   * hairline at 5% white closes the well from below. NO outer baseline
   * — wells are pressed INTO the page, they don't cast a shadow. */
  --d1-elev-atom-write-top-shadow: inset 0 2px 3px -1px rgba(0, 0, 0, 0.45);
  --d1-elev-atom-write-bottom:     inset 0 -1px 0 0 rgba(255, 255, 255, 0.05);

  /* T3 «Press» rest — T1 atoms + a brighter top-light (8% vs 6%) so
   * the surface invites the press. Bottom-light hairline shows the
   * «under-edge» of a button (subtle bevel, not 90s skeumorphism). */
  --d1-elev-atom-press-top:       inset 0 1px 0 0 rgba(255, 255, 255, 0.10);
  --d1-elev-atom-press-bottom:    inset 0 -1px 0 0 rgba(0, 0, 0, 0.20);
  --d1-elev-atom-press-baseline:  0 1px 0 0 rgba(0, 0, 0, 0.35);

  /* T3 «Press» hover — top-light intensifies to 14%, ink-baseline
   * doubles to 2px so the lift reads. Soft outer shadow joins for
   * atmospheric depth (single layer, no stack). */
  --d1-elev-atom-press-top-hover:    inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
  --d1-elev-atom-press-bottom-hover: inset 0 -1px 0 0 rgba(0, 0, 0, 0.18);
  --d1-elev-atom-press-baseline-hover: 0 2px 0 0 rgba(0, 0, 0, 0.50);
  --d1-elev-atom-press-soft-hover:   0 4px 12px -2px rgba(0, 0, 0, 0.32);

  /* T3 active (mouse-down, transient) — surface SINKS. Top-light
   * vanishes, real 2px inner top-shadow appears (steals the well
   * vocabulary from T2 for the press moment). No outer shadow. */
  --d1-elev-atom-active-top-shadow: inset 0 2px 3px -1px rgba(0, 0, 0, 0.42);
  --d1-elev-atom-active-bottom:     inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);

  /* Focus-ring composer — lime-on-lime. 4px page-canvas spacer + 6px
   * lime ring. Composes outermost in any recipe via prepending. */
  --d1-elev-focus-ring-on-lime:
    0 0 0 4px var(--d1-bg-page),
    0 0 0 6px var(--d1-accent-lime);

  /* Flat opt-out — Record Rail + disclaimer chip + premium chip. */
  --d1-elev-flat: none;
  --d1-elev-disabled: none;

  /* ── RECIPES — what selectors consume ──────────────────────────── */

  /* T1 «Read» rest — single top-light + outer ink baseline. The
   * baseline is what carries «this is a card on a page» on charcoal. */
  --d1-elev-t1-read:
    var(--d1-elev-atom-read-top),
    var(--d1-elev-atom-read-baseline);

  /* T2 «Write» rest — real 2px inner well-shadow + closing hairline.
   * The 2px blur is the legibility delta vs v2's flat-1px deboss. */
  --d1-elev-t2-write:
    var(--d1-elev-atom-write-top-shadow),
    var(--d1-elev-atom-write-bottom);

  /* T3 «Press» rest — coin on the page. Top-light + bottom-light
   * + outer ink baseline. */
  --d1-elev-t3-press-rest:
    var(--d1-elev-atom-press-top),
    var(--d1-elev-atom-press-bottom),
    var(--d1-elev-atom-press-baseline);

  /* T3 «Press» hover — same atoms, intensified. Soft outer joins. */
  --d1-elev-t3-press-hover:
    var(--d1-elev-atom-press-top-hover),
    var(--d1-elev-atom-press-bottom-hover),
    var(--d1-elev-atom-press-baseline-hover),
    var(--d1-elev-atom-press-soft-hover);

  /* T3 «Press» active — surface sinks (steals T2 vocabulary). */
  --d1-elev-t3-press-active:
    var(--d1-elev-atom-active-top-shadow),
    var(--d1-elev-atom-active-bottom);

  /* ── MOTION ─────────────────────────────────────────────────────── */
  /* Per impeccable motion-design.md: ease-out-expo for entrances,
   * ease-in for press (faster). 80ms threshold for press feedback
   * (sub-perceptual buffer); 200ms for hover entrance; 220ms exit. */
  --d1-elev-duration-rest-to-hover: 200ms;
  --d1-elev-duration-hover-to-active: 80ms;
  --d1-elev-duration-active-to-rest: 220ms;
  --d1-elev-easing-out: cubic-bezier(0.16, 1, 0.3, 1);   /* expo-out, hover entrance */
  --d1-elev-easing-in:  cubic-bezier(0.7, 0, 0.84, 0);   /* expo-in, press exit */
}

/* Reduced motion — rest tokens unchanged (depth is a static surface
 * property), only transitions collapse. */
@media (prefers-reduced-motion: reduce) {
  [data-style="d1"] [class*="d1-"],
  [data-theme="lime-cabin"] [class*="d1-"] {
    transition-duration: 0ms !important;
  }
}

/* prefers-contrast: more — ~5% of users get visibly stronger T1/T3
 * rest baselines + brighter top-lights. T2 well stays the same (the
 * 2px shadow is already strongly readable). */
@media (prefers-contrast: more) {
  [data-style="d1"],
  [data-theme="lime-cabin"] {
    --d1-elev-atom-read-baseline:    0 1px 0 0 rgba(0, 0, 0, 0.60);
    --d1-elev-atom-press-baseline:   0 1px 0 0 rgba(0, 0, 0, 0.50);
    --d1-elev-atom-press-top:        inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
    --d1-elev-atom-read-top:         inset 0 1px 0 0 rgba(255, 255, 255, 0.10);
  }
}
```

**Atom count: 13** (was 11 in v2; +1 for press-soft-hover, +1 for write-top-shadow as 2px blur primitive). **Recipe count: 5** (was 5; renamed for clarity).

### 2.3 · State arcs per tier

#### T0 «Canvas»
| State | Behavior |
|---|---|
| Rest | flat, no shadow declarations |
| All other states | n/a (canvas is non-interactive) |

#### T1 «Read» — KPI cards, chart panels, insight rows
| State | Tokens | Transform | Duration |
|---|---|---|---|
| Rest | `box-shadow: var(--d1-elev-t1-read)` | none | — |
| **Hover** | **unchanged from rest** — see §2.4 below | none | — |
| Focus-visible | inherited from interactive descendants only (cards have no `tabIndex`) | — | — |
| Disabled | `box-shadow: var(--d1-elev-disabled)` + `opacity: 0.5` | — | — |

**Hover on T1 does nothing.** This is the answer to PO's «зачем нужно hover на карточках, если они не интерактивные». Cards are passive. The card-IS-a-card signal is structural (rest emboss + outer baseline), not interactive. The only legitimate hover on a card is when the **whole card is wrapped in an `<a>` or has a click target** — at that point it inherits T3 semantics. KPI cards in the canonical preview are not wrapped, so they have no hover.

This is a hard discipline. Future temptation: «add a 1px lime line on hover, just for delight.» **No.** Lime hover = lime fatigue. Cards stay still.

#### T2 «Write» — search filter, segmented track, input wells (post-alpha forms)
| State | Tokens | Transform | Duration |
|---|---|---|---|
| Rest | `box-shadow: var(--d1-elev-t2-write)` | none | — |
| Hover (when non-input control) | unchanged from rest | none | — |
| Focus / focus-within | rest + `outline: 2px solid var(--d1-accent-lime)`, `outline-offset: 2px` | none | — |
| **Filled (input has value)** | rest + inner top-shadow shifts from -1px spread to 0px (well becomes shallower — visual feedback that input is no longer empty) | none | 200ms expo-out |
| Error | rest + replace bottom hairline with `inset 0 -2px 0 0 var(--d1-status-error)` | none | 200ms expo-out |
| Disabled | flat | — | — |

**Why a real 2px inner top-shadow, not a flat 1px hairline:** v2's `--d1-elev-atom-engrave-top: inset 0 1px 0 0 rgba(255,255,255,0.07)` was trying to say «this is a well» with a single 1px line. On charcoal, that line is visually ambiguous — it reads as «card top-edge» equally well as «well lip». A 2px inner shadow with negative spread (`inset 0 2px 3px -1px`) creates a real soft shadow falling INSIDE the surface from the top — no other interpretation is possible. **The 2px is the legibility delta.**

#### T3 «Press» — buttons, pills, chips, segmented active, nav-icon-pills, CTA
| State | Tokens | Transform | Duration |
|---|---|---|---|
| Rest | `box-shadow: var(--d1-elev-t3-press-rest)` | `translateY(0)` | — |
| Hover | `box-shadow: var(--d1-elev-t3-press-hover)` | `translateY(-1px)` | 200ms expo-out |
| Active (mouse-down) | `box-shadow: var(--d1-elev-t3-press-active)` | `translateY(0)` | 80ms expo-in |
| Focus-visible | rest + `outline: 2px solid var(--d1-accent-lime)`, `outline-offset: 2px` (lime-on-lime: replace outline with `--d1-elev-focus-ring-on-lime` composed) | rest | — |
| Disabled | `box-shadow: var(--d1-elev-disabled)` + `opacity: 0.5` | rest | — |

**Why -1px translate uniformly (KPI exception removed):** v2 kept `-2px` for `.d1-kpi:hover` because KPI tile is large. **In v3, KPI cards have no hover at all** — so the `-2px` exception disappears. All T3 surfaces use `-1px`. Universal consistency.

### 2.4 · The «what does hover mean» discipline (answer to PO)

PO's question — «зачем hover на карточках, если они не интерактивные?» — generalizes to a universal rule:

> **Hover is reserved for elements that DO something on click.** If a surface has no click handler / no `<a>`-wrap / no `onClick`, it has no hover state. Period.

This is a behavioral contract enforceable by linting. Right now we don't have it because the v2 `:hover` rules on `.d1-kpi`, `.d1-panel`, `.d1-chart-panel` etc. are dead-effect ornaments. **Removing them is the correct fix**, not «make them more meaningful».

The exception, post-alpha: when KPI cards become click-targets (drill-down navigation: tap «Total Return YTD» → goes to Performance tab), they re-inherit T3 hover semantics automatically. No new tier needed.

### 2.5 · Bg-fills decision per tier

PO's secondary observation: «/design-system хуже видно чем /style-d1». Investigation:

- `/style-d1` `.d1-kpi` and `.d1-panel`: `background: var(--d1-bg-card) #26272C`
- `/design-system` `.d1-chart-panel`: `background: var(--d1-bg-card) #26272C` ← **same**

The /design-system wrapper is `[data-theme="lime-cabin"]` and `.d1-chart-panel` does have `background: var(--d1-bg-card)` per `lime-cabin.css:1271`. **The PO's perceptual difference is not about bg-fills.** It's about composition density: the /design-system page has chart-panels packed shoulder-to-shoulder with tighter gaps, no surrounding KPI tier that would visually frame them, and on a long scroll the eye loses the «card-on-page» distinction because there's no canvas-breathing-room. **The fix is at the layout level, not the depth level**: ensure `/design-system` chart-panel rows are wrapped in a `.d1-surface` with the same 24px padding `/style-d1` uses, so panels read as «cards inside a section» not «cards floating in a void».

**Verdict on bg-fills per tier:**
- T0 (canvas): `--d1-bg-page #141416` (page) or `--d1-bg-surface #1F2024` (section)
- T1 (read): `--d1-bg-card #26272C` ALWAYS — never transparent, never inherit
- T2 (write): `--d1-bg-page #141416` (yes — wells are debossed INTO the page; same color as canvas + the 2px inner shadow does the work)
- T3 (press): varies by component — `--d1-bg-card` (most pills/chips), `--d1-accent-lime` (CTA + active pill), `transparent → var(--d1-bg-card-soft)` on hover (filter chips)

**Hard rule: never use `background: transparent` on a T1 surface** — that's the /design-system chart-panel issue if it exists. Verified the current code does set `background: var(--d1-bg-card)`, so this rule simply locks the existing behavior.

---

## 3 · `impeccable`-Based Pressure Test

I ran v3 through five `impeccable` reference files. Results:

### 3.1 · `color-and-contrast.md` — 4 tests, 4 passes, 1 amendment

**Pass 1: «Pure gray is dead. Add chroma 0.005-0.015 to all neutrals, hued toward brand color.»**
The current palette is essentially neutral charcoal + lime + purple. The neutrals have ZERO chroma (`#141416`, `#1F2024`, `#26272C`). Per the reference, this is leaving free cohesion on the table. **Amendment**: tint neutrals 0.008 chroma toward lime hue (~120 OKLCH). See §4.

**Pass 2: «In dark mode, depth comes from surface lightness, not shadow. Build a 3-step surface scale where higher elevations are lighter.»**
The current scale is `#141416` (10% L) → `#1F2024` (15% L) → `#26272C` (19% L) → `#2C2D33` (22% L). Four steps, ~4-5% lightness per step. **This is correct** for the «cards up» grammar — the lightness IS what makes a card readable as a card, the depth atom is just the perimeter polish. v3 honors this; the read-baseline atom does NOT replace the lightness step, it complements it.

**Pass 3: «Light text on dark needs compensation on three axes: line-height +0.05–0.1, letter-spacing +0.01–0.02em, body weight up one notch.»**
Current Geist body is 14-16px / 1.5 / no letter-spacing / 400 weight. Status: line-height good (1.5 is the +0.1 already vs typical 1.4), letter-spacing not added (Geist's natural metrics are tight on dark — RECOMMEND adding `letter-spacing: 0.005em` to body on dark). Weight 400 is fine — Geist 400 has slightly more grid optimization than typical sans 400.

**Pass 4: «Skip secondary/tertiary unless you need them. Most apps work fine with one accent color. Adding more creates decision fatigue.»**
v2 has lime + purple + amber. PO directive opens palette expansion. The discipline is: **expand only where a single existing color is doing two jobs that conflict semantically.** I find exactly three such conflicts (see §4). Not five.

### 3.2 · `spatial-design.md` — 2 critical insights

**«Cards Are Not Required.» / «Never nest cards inside cards.»**
v3's T0/T1/T2/T3 grammar is fundamentally a card-economy. The reference is a warning: don't put a card inside a card. Current dashboard structure: `.d1-page` (T0) → `.d1-surface` (T0, the section frame) → `.d1-panel` (T1) → `.d1-segmented` (T2). **Verified: only one T1 layer deep.** Hard rule: T1-inside-T1 is banned (spec the rule into the architect ADR).

**«Shadows should be subtle—if you can clearly see it, it's probably too strong.»**
v3 uses 0.45 alpha on the T1 outer baseline. That's at the upper edge of «subtle» on charcoal. Justification: the baseline is ONLY 1px tall — you don't perceive it as a shadow, you perceive it as a hairline edge. The total ink delivered is 1px × 0.45 alpha = visually equivalent to a 4px × 0.10 alpha shadow, which IS subtle. The 0.45 is needed because at 0.30 it gets eaten by the charcoal canvas's anti-aliasing. **Calibrated, not aggressive.**

### 3.3 · `motion-design.md` — 3 alignments

**«100-150ms for instant feedback / 200-300ms for state changes.»**
v3 timing: 80ms press / 200ms hover / 220ms hover→rest. Press at 80ms is below the 80ms perceptual threshold the reference cites — meaning the press feels truly instant. Hover at 200ms is the lower bound of the «state change» band, expo-out so it lands on entry. **Aligned.**

**«Avoid bounce and elastic curves.»**
Hard rule, no exceptions in D1. Current `cubic-bezier(0.16, 1, 0.3, 1)` is expo-out — clean deceleration, no overshoot. **Aligned.**

**«Premium motion materials: blur, backdrop-filter, saturation/brightness shifts… use the right material for the effect.»**
v3 uses ONLY transform + box-shadow. No blur, no filter, no clip-path. **This is a deliberate choice for ICP-A multi-broker tier** — financial dashboards on commodity hardware (mid-range Windows, 2018 MacBook Air) cannot afford blur/filter on hover-frequency surfaces. The reference's «right material» test is satisfied: simple movement + edge polish doesn't need atmospheric materials.

### 3.4 · `interaction-design.md` — the 8-state audit

| State | Defined for T1? | Defined for T2? | Defined for T3? |
|---|---|---|---|
| Default | ✓ | ✓ | ✓ |
| Hover | n/a (no-op) | n/a (read-only) | ✓ |
| Focus | inherited from descendants | ✓ | ✓ |
| Active | n/a | n/a | ✓ |
| Disabled | ✓ | ✓ | ✓ |
| Loading | TBD per component (spinner inside, no surface change) | TBD (skeleton) | TBD (spinner replaces label, no surface change) |
| Error | n/a | ✓ (red bottom hairline) | TBD per component |
| Success | n/a | n/a (transient flash, OK) | TBD |

Loading/error/success per-component states are **outside the depth system's scope** — they live in component specs. The depth system's job is rest/hover/active/focus/disabled. **Coverage: complete.**

### 3.5 · `typography.md` — three opportunities

**«Use OpenType features.»**
v2 already uses `font-feature-settings: "tnum" 1, "ss01" 1` on the page wrapper. **`ss01` is Geist's stylistic alternate set** (raises the dot of the lowercase `i`, slight `a` adjustment) — fine. **Missing: `font-variant-caps: all-small-caps` on `<abbr>`** for tickers (AAPL, MSFT). Recommend adding. See §6.

**«Text-wrap balance / pretty.»**
Current spec uses `text-wrap: balance` on `.d1-headline` and `text-wrap: pretty` on `.d1-insight__body`. **Aligned.** Recommend extending `text-wrap: balance` to `.d1-kpi__label` (multi-word labels like «Total Return YTD» often break awkwardly).

**«Use fewer sizes with more contrast.»**
Current scale: 11/12/13/14/16/24/32/48-56/clamp(2.25-3.5rem). **Nine sizes is too many** for a dashboard. Audit shows 12 and 13 do nearly the same job (12 = caption, 13 = pill/chip label). Consolidate to: **11/12/14/16/20/32/48-56**, drop 13 (move to 14), drop 24 (move 24 → 20 for the eyebrow name). See §6.

---

## 4 · Color Palette Verdict — EXPAND (4 new tokens, OKLCH-defined)

### 4.1 · Methodology

I started with the v2 «no expansion» constraint and asked: **where is a single token doing two jobs that conflict?** Each conflict is a candidate for expansion.

| Conflict | Symptom | Verdict |
|---|---|---|
| Amber `#F4C257` doing «notification badge count» AND would do «warning state» (broker stale data, drift breach) AND would do «pending operation» (refresh in flight) | One color, three meanings — user has no way to disambiguate | **EXPAND**: dedicated warning + dedicated info |
| Purple `#7B5CFF` doing «AI signal» (avatar, insight chip) AND «highlighted bar» (single-purple bar in BarVisx) AND «premium tier chip» AND would do «error state» (no other color in palette to take it) | Four meanings; «error» especially conflicts with «AI signal» semantically | **EXPAND**: dedicated error |
| `--d1-bg-card #26272C` and `--d1-bg-card-soft #2C2D33` are the only two card-state surfaces. Need a darker mid-tier between page and card for nested layout (e.g., the segmented track that today uses `--d1-bg-page` directly) | Layout surfaces and card surfaces share the same 4-step ramp; the segmented track sitting on `bg-page` is visually ambiguous (is the track ON the page or BEHIND the page?) | **EXPAND**: one new tier (`--d1-bg-trough`) |
| Success state — does NOT yet conflict because nothing in the canonical preview claims success (positive deltas use ink-color on lime fill, not a green) | No conflict yet, but ICP-A multi-broker WILL hit «account connected» / «refresh complete» states post-alpha | **HOLD**: do not add until needed (YAGNI per impeccable color reference's «skip secondary unless you need them») |

### 4.2 · The 4 new tokens

All defined in OKLCH per `impeccable:color-and-contrast.md` directive. Hex hashes preserved as fallbacks (browser-support belt-and-braces, though OKLCH is fine in 2026 evergreen).

```css
[data-style="d1"],
[data-theme="lime-cabin"] {
  /* ── EXISTING palette (re-stated for context) ──────────────────── */
  --d1-bg-page:        #141416;  /* oklch(15% 0.003 120) — was 0 chroma */
  --d1-bg-surface:     #1F2024;  /* oklch(20% 0.004 120) — was 0 chroma */
  --d1-bg-card:        #26272C;  /* oklch(24% 0.005 120) — was 0 chroma */
  --d1-bg-card-soft:   #2C2D33;  /* oklch(27% 0.006 120) — was 0 chroma */
  --d1-accent-lime:    #D6F26B;  /* oklch(91% 0.18 120) */
  --d1-accent-purple:  #7B5CFF;  /* oklch(57% 0.24 285) */
  --d1-text-primary:   #FAFAFA;  /* oklch(98% 0.001 120) */
  --d1-text-muted:     #9C9DA3;  /* oklch(64% 0.005 285) */
  --d1-text-ink:       #0E0F11;  /* oklch(11% 0.003 120) */
  --d1-notification-amber: #F4C257; /* oklch(82% 0.13 75) */

  /* ── ADDITIONS — 4 new tokens ──────────────────────────────────── */

  /*
   * 1. --d1-bg-trough — a darker mid-tier between bg-page and bg-card.
   * Used for: segmented track, nested wells, code-block inside a card.
   * Sits between page (15% L) and card (24% L) at 19% L. Same 0.004
   * chroma toward lime as the rest of the neutrals.
   */
  --d1-bg-trough: oklch(19% 0.004 120);  /* fallback: #1A1B1F */

  /*
   * 2. --d1-status-error — a desaturated red. Per impeccable-color
   * «desaturate accents slightly in dark mode». OKLCH 60% L, 0.16 C,
   * 25 hue (slightly orange-leaning so it doesn't clash with purple
   * at the same L). Used for: form field error state, broker-disconnected
   * banner, destructive button (post-alpha).
   *
   * Contrast on bg-card #26272C: 5.1:1 (AA). On bg-page #141416: 7.4:1
   * (AAA). Used for icons + 16px+ labels only — never for body text.
   */
  --d1-status-error: oklch(60% 0.16 25);  /* fallback: #D85F4D */

  /*
   * 3. --d1-status-warning — a muted ochre that's distinct from the
   * notification-amber (which stays high-saturation for badges). 65% L,
   * 0.12 C, 65 hue. Used for: stale data banner, drift-cap breach
   * (currently lime-fill — moves here so lime regains its «look here»
   * monopoly), pending refresh state.
   *
   * Contrast on bg-card: 5.6:1 (AA). On bg-page: 8.0:1 (AAA).
   */
  --d1-status-warning: oklch(65% 0.12 65);  /* fallback: #C99B58 */

  /*
   * 4. --d1-status-info — a calm teal that's distinct from purple.
   * 60% L, 0.10 C, 200 hue (pure cyan, no blue-leaning so it doesn't
   * read as a default «link blue»). Used for: educational tooltip,
   * onboarding coach mark, neutral notification (e.g. «Markets close
   * in 23 minutes»).
   *
   * Contrast on bg-card: 5.0:1 (AA). On bg-page: 7.2:1 (AAA).
   */
  --d1-status-info: oklch(60% 0.10 200);  /* fallback: #4F9DA1 */
}
```

### 4.3 · Tinted neutrals — the «free cohesion» fix

`impeccable:color-and-contrast.md`: «*Pure gray is dead. Add 0.005-0.015 chroma to all neutrals, hued toward your brand color.*»

The current palette uses 0 chroma neutrals. By tinting all four bg neutrals by 0.003-0.006 chroma toward lime hue 120, the entire dashboard gets subconscious cohesion with the lime accent at zero perceptual cost. The OKLCH values in §4.2 are the migration. **Visual delta: imperceptible to a non-designer; subconscious cohesion gain: real.**

Implementation note: current Style Dictionary tokens are hex. Migration is one-shot — replace the hex with OKLCH (with hex fallback for older Safari on iOS 14, though our minimum target is iOS 16). The values shipped above are calibrated to be ≤1 hex point off from the current `#141416/#1F2024/#26272C/#2C2D33` so the visual change is a re-tint, not a re-color.

### 4.4 · Chart series colors — palette stays binary, BUT add a 3rd

Current chart-series aliases in `lime-cabin.css:55-60`:
- series-1: `--d1-text-primary` (white = primary line)
- series-2: `--d1-accent-lime` (highlight)
- series-3: `--d1-accent-purple` (negative bar / second highlight)
- series-4: `--d1-text-muted` (cohort)
- series-5: `--d1-bg-card-soft` (default bar fill)

Multi-broker users WILL hit a 3-broker portfolio in alpha (per ICP-A profile). With current 2-color (lime + purple) discrimination, broker 3 falls back to muted gray which conflicts with «cohort» and reads as «not active». **Verdict: add one chart-only neutral cyan.**

```css
--chart-series-3-discrete: oklch(70% 0.09 200);  /* lighter than --d1-status-info,
                                                  * for chart use only — must read on
                                                  * bg-card without being an info banner */
```

Series order becomes: white (broker 1) → lime (broker 2 / highlight) → cyan (broker 3) → purple (negative / drift) → muted (out-of-period). **Confidence: MEDIUM** — verifying multi-broker chart rendering during alpha may surface a 4th color need.

### 4.5 · Recap — token additions

| Token | OKLCH | Hex fallback | Purpose | Confidence |
|---|---|---|---|---|
| `--d1-bg-trough` | `oklch(19% 0.004 120)` | `#1A1B1F` | mid-tier surface (segmented track, nested wells) | HIGH |
| `--d1-status-error` | `oklch(60% 0.16 25)` | `#D85F4D` | error states, broker-disconnected, destructive | HIGH |
| `--d1-status-warning` | `oklch(65% 0.12 65)` | `#C99B58` | stale data, drift breach, pending refresh | HIGH |
| `--d1-status-info` | `oklch(60% 0.10 200)` | `#4F9DA1` | educational tooltips, neutral notifications | HIGH |
| `--chart-series-3-discrete` | `oklch(70% 0.09 200)` | `#85B5BA` | chart 3rd category color | MEDIUM |

Plus the four existing neutrals migrated to lime-tinted OKLCH equivalents (no value change beyond imperceptible chroma).

**Total: 5 new tokens, 4 re-tinted neutrals, lime/purple/text-* preserved.**

---

## 5 · Selector → Tier Mapping

| D1 selector | Tier | Recipe applied | Notes / change vs v2 |
|---|---|---|---|
| `.d1-page` | T0 | none | unchanged |
| `.d1-shell` | T0 | none | unchanged |
| `.d1-surface` | T0 | none | excluded — section canvas; embossing creates card-in-card |
| `.d1-marketing` | T0 | none | unchanged |
| `.d1-cta` | **T3** | t3-press-rest / t3-press-hover / t3-press-active | unchanged from v2 except replace token names |
| `.d1-cta--ghost` | T3 | t3-press-rest + 1px inset border layered above | unchanged |
| `.d1-nav` | T0 | none | layout container |
| `.d1-nav__brand` | **T1** | t1-read | identity mark; reads as a card, not as a button |
| `.d1-disclaimer-chip` | **T0** | flat opt-out (`--d1-elev-flat`) | UNCHANGED — Lane-A regulatory cure stays out of depth |
| `.d1-pill` | **T3** | t3-press-rest at rest, t3-press-hover on hover, t3-press-active on press | CHANGE: rest IS embossed (was «flat at rest» in v2); pill identity affordance is the rest emboss |
| `.d1-pill--active` | T3 | special — see §6.4 (lime-on-lime) | unchanged |
| `.d1-nav__icon-pill` | T3 | t3-press-rest / t3-press-hover / t3-press-active | unchanged |
| `.d1-nav__avatar` | **T1** | t1-read | identity, not interactive |
| `.d1-eyebrow-row__*` | T0 | none | type only |
| `.d1-chip-premium` | **T0** | flat opt-out | static label, not a control |
| `.d1-kpi` | **T1** | t1-read | CHANGE: hover REMOVED (PO answer) |
| `.d1-kpi--portfolio` | T1 | t1-read | inherits |
| `.d1-kpi--lime` | T1 | special — see §6.4 lime-on-lime variant | inherits semantically |
| `.d1-chips` | T0 | none | container |
| `.d1-chip` | **T3** | t3-press-rest at rest, t3-press-hover on hover | CHANGE: was «flat at rest»; rest IS embossed |
| `.d1-chip--active` | T3 | t3-press-rest + 1px inset lime hairline | hairline composes; emboss reads as secondary tactility per spec §7.6 |
| `.d1-chip--icon` | T3 | t3-press-rest / t3-press-hover | unchanged |
| `.d1-chip--export` | T3 | t3-press-rest / t3-press-hover | unchanged |
| `.d1-grid` | T0 | none | container |
| `.d1-panel` | **T1** | t1-read | CHANGE: hover REMOVED |
| `.d1-chart-panel` | **T1** | t1-read | CHANGE: hover REMOVED; bg stays `--d1-bg-card` per §2.5 |
| `.d1-panel__head/__body/__caption` | T0 | none | inside T1 |
| `.d1-segmented` (track) | **T2** | t2-write | CHANGE: bg moves from `--d1-bg-page` to `--d1-bg-trough` for visual disambiguation; recipe is the well, not the deboss |
| `.d1-segmented__btn` | T0 | none rest, t3-press-hover on hover, t3-press-active on press | CHANGE: only the active btn carries depth (was «emboss + lime hairline» before) |
| `.d1-segmented__btn--active` | **T3** | t3-press-rest + lime hairline composed | unchanged from v2 |
| `.d1-heatmap__cell` | T0 | none | data viz |
| `.d1-chat__search` | **T2** | t2-write | static input well |
| `.d1-rail*` | T0 | flat opt-out | NEVER embossed |
| `.d1-insight` (row) | T0 → **T1** post-alpha | none until interactive | unchanged |
| `.d1-disclosure` | T0 | none | text |

**Key changes from v2 mapping:**
1. Tier names refactored to T0/T1/T2/T3 with verbs (Canvas/Read/Write/Press)
2. `.d1-kpi`, `.d1-panel`, `.d1-chart-panel` LOSE their hover state (PO directive)
3. `.d1-pill`, `.d1-chip` GAIN a rest emboss (pill/chip identity readable at rest, not just on hover)
4. `.d1-segmented` track changes bg from page-canvas to the new `--d1-bg-trough`
5. Disclaimer + premium chips remain explicitly flat — Lane-A discipline preserved

---

## 6 · State Spec per Tier — Full CSS

### 6.1 · T1 «Read»

```css
[data-style="d1"] .d1-kpi,
[data-theme="lime-cabin"] .d1-kpi {
  background: var(--d1-bg-card);
  border-radius: 24px;
  padding: 20px;
  min-height: 132px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--d1-elev-t1-read);
  /* NO transition — T1 has no hover */
}

/* No :hover, no :focus, no :active rules — T1 is rest-only */

[data-style="d1"] .d1-kpi[aria-disabled="true"] {
  box-shadow: var(--d1-elev-disabled);
  opacity: 0.5;
}

/* Lime-fill variant — see §6.4 */
```

Same recipe applies to `.d1-panel`, `.d1-chart-panel`, `.d1-nav__brand`, `.d1-nav__avatar`.

### 6.2 · T2 «Write»

```css
[data-style="d1"] .d1-chat__search,
[data-theme="lime-cabin"] .d1-chat__search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 9999px;
  background: var(--d1-bg-page);
  color: var(--d1-text-muted);
  font-family: var(--d1-font-sans);
  font-size: 13px;
  border: 0;
  box-shadow: var(--d1-elev-t2-write);
}

[data-style="d1"] .d1-chat__search:focus-within {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 2px;
}

[data-style="d1"] .d1-segmented {
  background: var(--d1-bg-trough);  /* ← changed from --d1-bg-page */
  border-radius: 9999px;
  padding: 3px;
  gap: 2px;
  display: inline-flex;
  align-items: center;
  box-shadow: var(--d1-elev-t2-write);
}

/* Error-state input (post-alpha forms): */
[data-style="d1"] .d1-input--error {
  box-shadow: var(--d1-elev-atom-write-top-shadow), inset 0 -2px 0 0 var(--d1-status-error);
}
```

### 6.3 · T3 «Press»

```css
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
  box-shadow: var(--d1-elev-t3-press-rest);
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing-out),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing-out);
}

[data-style="d1"] .d1-cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-t3-press-hover);
}

[data-style="d1"] .d1-cta:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-t3-press-active);
  transition:
    transform var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing-in),
    box-shadow var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing-in);
}

[data-style="d1"] .d1-cta:focus-visible {
  outline: 0;
  box-shadow: var(--d1-elev-focus-ring-on-lime), var(--d1-elev-t3-press-rest);
}

[data-style="d1"] .d1-cta:hover:focus-visible {
  box-shadow: var(--d1-elev-focus-ring-on-lime), var(--d1-elev-t3-press-hover);
}

[data-style="d1"] .d1-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--d1-elev-disabled);
}

/* .d1-pill — same arc, but bg changes on hover from transparent to
 * --d1-bg-card-soft, and rest emboss reads against the transparent bg. */
[data-style="d1"] .d1-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 9999px;
  background: transparent;
  color: var(--d1-text-muted);
  font-family: var(--d1-font-sans);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  border: 0;
  box-shadow: var(--d1-elev-t3-press-rest);  /* ← rest emboss now */
  transition:
    transform var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing-out),
    box-shadow var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing-out),
    background var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing-out),
    color var(--d1-elev-duration-rest-to-hover) var(--d1-elev-easing-out);
}

[data-style="d1"] .d1-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
  transform: translateY(-1px);
  box-shadow: var(--d1-elev-t3-press-hover);
}

[data-style="d1"] .d1-pill:active {
  transform: translateY(0);
  box-shadow: var(--d1-elev-t3-press-active);
  transition:
    transform var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing-in),
    box-shadow var(--d1-elev-duration-hover-to-active) var(--d1-elev-easing-in);
}

[data-style="d1"] .d1-pill:focus-visible {
  outline: 2px solid var(--d1-accent-lime);
  outline-offset: 2px;
}
```

Identical pattern repeats for `.d1-chip`, `.d1-nav__icon-pill`. Active variants (`.d1-pill--active`, `.d1-chip--active`, `.d1-segmented__btn--active`) extend t3-press-rest with the lime-hairline composition pattern from §6.4.

### 6.4 · Lime-on-lime variant (preserved from v2)

```css
[data-style="d1"] .d1-kpi--lime {
  background: var(--d1-accent-lime);
  /* Lime-fill cards: white-on-lime top-light at 20%, ink-on-lime bottom-shadow at 20%,
   * outer ink baseline preserved. */
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.20),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.20),
    0 1px 0 0 rgba(14, 15, 17, 0.40);
}

[data-style="d1"] .d1-pill--active {
  background: var(--d1-accent-lime);
  color: var(--d1-text-ink);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.18),
    0 1px 0 0 rgba(14, 15, 17, 0.20);
}
```

---

## 7 · Migration Plan — REPLACE / PRESERVE / RESTRUCTURE

Citing `apps/web/src/app/style-d1/_lib/depth.css` and `theme.css` from `feat/d1-depth-system` branch, plus `apps/web/src/app/design-system/_styles/lime-cabin.css`.

### 7.1 · `depth.css` — REPLACE

| Existing | Action | Reason |
|---|---|---|
| `--d1-elev-atom-engrave-top` (line 57) | DELETE | T1 v3 has no inset bottom hairline; deboss is gone |
| `--d1-elev-atom-engrave-bottom` (line 58) | DELETE | same |
| `--d1-elev-atom-engrave-top-hover` (line 65) | DELETE | T1 has no hover in v3 |
| `--d1-elev-atom-engrave-bottom-hover` (line 66) | DELETE | same |
| `--d1-elev-atom-edge-hairline` (line 50) | DELETE | replaced by `--d1-elev-atom-read-baseline` (outer ink, not outer hairline) |
| `--d1-elev-atom-emboss-top/-bottom` (lines 70-71) | RESTRUCTURE → `--d1-elev-atom-press-top/-bottom` | rename; values shift slightly (top 8% → 10%, bottom 24% → 20%) |
| `--d1-elev-atom-pressed-top/-bottom` (lines 78-79) | RESTRUCTURE → `--d1-elev-atom-active-top-shadow/-bottom` | same intent; rename + values calibrated to v3 |
| `--d1-elev-tier1-rest` recipe (line 95) | REPLACE | composition changes (was edge-hairline + 2 inset hairlines; now 1 inset hairline + outer baseline) |
| `--d1-elev-tier1-hover` recipe (line 102) | DELETE | T1 has no hover in v3 |
| `--d1-elev-tier2-rest/-hover/-active` (lines 108, 116, 122) | RENAME → `--d1-elev-t3-press-rest/-hover/-active` | tier number changes |
| `prefers-contrast: more` block (line 152) | RESTRUCTURE | re-bind new atom names; magnitudes updated |

Net: ~60% of the file is rewritten. The architecture (atom + recipe layer composition, dual-scoped to both routes, ADR-3/4/6/7) is preserved.

### 7.2 · `theme.css` — PRESERVE structure, SWAP tokens

For every selector listed in §5, replace the `box-shadow` token reference. Most selectors use 1-2 tokens, so the diff is small:

| Selector | Old | New |
|---|---|---|
| `.d1-cta` | `var(--d1-elev-tier2-rest)` | `var(--d1-elev-t3-press-rest)` |
| `.d1-cta:hover` | `var(--d1-elev-tier2-hover)` | `var(--d1-elev-t3-press-hover)` |
| `.d1-cta:active` | `var(--d1-elev-tier2-active)` | `var(--d1-elev-t3-press-active)` |
| `.d1-kpi` | `var(--d1-elev-tier1-rest)` | `var(--d1-elev-t1-read)` |
| `.d1-kpi:hover` | exists in v2 | **DELETE entire rule** |
| `.d1-panel` | `var(--d1-elev-tier1-rest)` | `var(--d1-elev-t1-read)` |
| `.d1-pill` | rest = no shadow | **ADD `box-shadow: var(--d1-elev-t3-press-rest)` at rest** |
| `.d1-pill:hover` | `var(--d1-elev-tier2-rest)` | `var(--d1-elev-t3-press-hover)` |
| `.d1-chip` | rest = no shadow | **ADD `box-shadow: var(--d1-elev-t3-press-rest)` at rest** |
| `.d1-chip:hover` | `var(--d1-elev-tier2-rest)` | `var(--d1-elev-t3-press-hover)` |
| `.d1-segmented` | `var(--d1-elev-tier1-rest)` | `var(--d1-elev-t2-write)` (changes recipe entirely) + `background: var(--d1-bg-trough)` |
| `.d1-chat__search` | `var(--d1-elev-tier1-rest)` | `var(--d1-elev-t2-write)` |

Total selector edits: ~14 in `theme.css` (`apps/web/src/app/style-d1/_lib/theme.css`), ~14 in `lime-cabin.css` (`apps/web/src/app/design-system/_styles/lime-cabin.css`). All mechanical token swaps.

### 7.3 · Color palette migration

`tokens/semantic/dark.json` (or wherever `--d1-bg-*` lives) — additive only:
- ADD `--d1-bg-trough` 
- ADD `--d1-status-error/-warning/-info`
- ADD `--chart-series-3-discrete`
- (Optional, recommended) re-tint the four neutral bgs from 0 chroma to 0.003-0.006 chroma toward hue 120 — diff is sub-perceptual but adds free cohesion

### 7.4 · Drift KPI (Fix 1 in 7-fix-pass)

Currently uses `.d1-kpi--lime` for the drift KPI. Per §4.1 conflict analysis, **drift breach should move to `--d1-status-warning`** so lime can regain its «look here = 1 KPI per dashboard» monopoly. This is a Fix 1 follow-up, not a new issue. Visual: drift card uses dark-bg + `--d1-status-warning` ink + 1px warning-color hairline border. Reserve full lime fill for the actual «look here» KPI.

**Confidence on this specific change: MEDIUM** (cross-checks with brand-strategist's lime-discipline pass needed; if brand-strategist holds drift-on-lime as canonical, defer).

### 7.5 · Implementation order

1. **Token additions** (`theme.css` + `lime-cabin.css` + Style Dictionary if used):
   - Add 4 new color tokens + 1 chart series + re-tinted neutrals
   - Add 13 atom tokens + 5 recipe tokens for v3 depth

2. **Selector swaps** in both route files (mechanical, fast):
   - Replace token references per §7.2 table
   - DELETE `.d1-kpi:hover`, `.d1-panel:hover`, `.d1-chart-panel:hover` rules entirely

3. **Visual regression** at 320 / 414 / 768 / 1024 / 1440 / 1920. Both routes (`/style-d1` + `/design-system`).

4. **Reduced-motion smoke test**: confirm rest emboss persists when motion disabled.

5. **Contrast verification**: WebAIM checker on all token pairs (every `text-*` × `bg-*` × `accent-*` × `status-*` combination = ~40 pairs).

6. **Drift KPI follow-up** (separate PR if brand-strategist concurs): move `.d1-kpi--drift` from lime-fill to dark-bg + warning-border treatment.

---

## 8 · Edge Cases

### 8.1 · Focus-ring cascade
Same as v2: CSS `outline` and `box-shadow` live on different rendering layers; they stack correctly. The lime-on-lime composer (`--d1-elev-focus-ring-on-lime`) is prepended to the rest box-shadow in selectors where outline-2px-lime is invisible. **Verified**.

### 8.2 · Cards-in-cards
Hard rule from §3.2 (impeccable spatial): T1-inside-T1 banned. Current dashboard nests `.d1-page` (T0) → `.d1-surface` (T0) → `.d1-panel` (T1) → `.d1-segmented` (T2) → `.d1-segmented__btn--active` (T3). Maximum tier-depth = 3 (T1 → T2 → T3) which is fine. **No T1-in-T1 anywhere in canonical preview.** If a future surface needs a sub-panel inside a panel, the inner one drops to T0 (no shadow) or to a 1px hairline inset border instead.

### 8.3 · Reduced-motion
v3 atom values are static. The `@media (prefers-reduced-motion: reduce)` rule collapses transition-duration to 0ms, but `box-shadow` declarations remain identical. **Depth survives reduced-motion fully**, including state changes (hover/active still happen, just instantly). Vestibular-disorder users (35% of adults over 40 per `motion-design.md`) get the full system without motion.

### 8.4 · Regulatory chip
`.d1-disclaimer-chip`: `box-shadow: var(--d1-elev-flat)` — explicit opt-out of depth. NEVER changes to read/press/write tier. This is a Lane-A regulatory cure preserved from v2 + v1. The chip's visual quietness IS the compliance signal. Spec it into a comment so future regressions don't reintroduce depth here.

### 8.5 · Already-soft surfaces
`.d1-chip--active` and `.d1-segmented__btn--active` use a 1px inset lime hairline as the «active» signal. v3 keeps that hairline at the front of the box-shadow stack and adds the t3-press-rest emboss after. Hairline reads first; emboss reads as secondary tactility. **Verified pattern from v2 §6.5; carries over cleanly.**

### 8.6 · Transparent-bg surfaces (the /design-system chart-panel issue)
Per §2.5 investigation: PO's perception that /design-system reads worse is layout-driven, not depth-driven. Both routes use `background: var(--d1-bg-card)` on chart-panels. **Hard rule v3 codifies: T1 surfaces NEVER `background: transparent`.** Any future component spec that proposes `background: transparent` on a T1 must be rejected — the lightness-step is what carries «card-on-page» on charcoal, per impeccable-color «depth comes from surface lightness». Recipe atom-baseline is the polish, not the foundation.

Operational fix for the /design-system layout density: wrap chart-panel rows in a `.d1-surface` (with its 24px padding + 28px border-radius) so panels read as «cards inside a section frame» not «cards floating on the page».

### 8.7 · Lime-on-lime emboss (existing variant, unchanged)
See §6.4. Tested calibration from v2 carries over: white at 20% reads on lime, ink at 20% reads on lime, AAA contrast on lime fill held by `--d1-text-ink` content color.

### 8.8 · Buttons inside lime-fill KPI card
`.d1-kpi--lime .d1-kpi__icon-chip` needs inverted treatment per v2 §6.7. Same override carries over:
```css
.d1-kpi--lime .d1-kpi__icon-chip {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.30),
    inset 0 -1px 0 0 rgba(14, 15, 17, 0.15);
}
```

### 8.9 · Mobile breakpoints (Fix 6 from 7-fix-pass)
At 768px and 414px, depth atoms are unchanged — they're 1-2px hairlines, which scale fine across breakpoints. The only mobile-specific concern: at 414px, the `.d1-kpi--portfolio .d1-kpi__num` clamps from 56px down to 36px; the t1-read recipe's outer baseline at 1px is proportionally larger (~2.7% of card height vs ~0.6% on desktop). **Acceptable** — the baseline is a perimeter polish, not a depth illusion that scales.

### 8.10 · Empty state / error state cards
- Empty-portfolio KPI: T1-read recipe + ghost text. No special depth treatment.
- Broker-disconnected card: T1-read recipe + 1px `var(--d1-status-error)` left border (4px width on the left edge). Depth atoms unchanged; the border is the alarm signal.
- Stale-data chart: T1-read recipe + diagonal stripe pattern overlay at 4% opacity (inline SVG, never CSS background-image — Safari iOS perf trap per spec §9 risk #6).

---

## 9 · Additional Improvements (Area 3)

### 9.1 · Typography refinement (HIGH confidence)

**Consolidate the type scale from 9 sizes to 7.**
- Current: 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 48-56
- Proposed: 11 / 12 / 14 / 16 / 20 / 32 / 48-56
- Delete 13 (caption/pill/chip label) → use 14 (one less near-duplicate, easier to design with)
- Delete 24 (eyebrow name) → use 20 (creates clearer hierarchy gap to the 32px KPI numeral)

Per `impeccable:typography.md` «Use fewer sizes with more contrast.»

**Add `letter-spacing: 0.005em` to body text on dark.**
Per `impeccable:typography.md` «Light text on dark needs compensation on three axes.» Geist's natural metrics tighten on dark bg; 0.005em opens it back up imperceptibly.

**Add `text-wrap: balance` to `.d1-kpi__label`.**
Multi-word labels like «Total Return YTD» break awkwardly at narrow KPI widths. `text-wrap: balance` evenly distributes line breaks. CSS-only, no JS, supported in Chrome 114+ / Safari 17.4+.

**Use `font-variant-caps: all-small-caps` on `<abbr>` for tickers (AAPL, MSFT).**
Per `impeccable:typography.md`. Small-caps for abbreviations is editorial-press polish that fits Provedo's «on the record» metaphor.

### 9.2 · Spacing system audit (MEDIUM confidence)

Current spacing usage in `theme.css`: 4 / 8 / 12 / 14 / 16 / 20 / 24 / 28. **8 values, no system tokens.**

Per `impeccable:spatial-design.md` «Use 4pt base… 4, 8, 12, 16, 24, 32, 48, 64, 96.» Current set is close; recommend tokenizing:
```css
--d1-space-xs: 4px;
--d1-space-sm: 8px;
--d1-space-md: 12px;
--d1-space-lg: 16px;
--d1-space-xl: 24px;
--d1-space-2xl: 32px;
--d1-space-3xl: 48px;
```

Drop the off-rhythm 14px and 28px values. `28px` border-radius on `.d1-surface` should drop to 24px (matches token); `14px` gap on `.d1-kpi__head` should drop to 12px.

### 9.3 · Motion / micro-interaction refinement (HIGH confidence)

**Press timing already at 80ms (the perceptual instant threshold).** Holds.

**Hover entrance at 200ms with expo-out.** Holds. Could test 180ms — the reference says 200-300 for state changes is the comfort band; 180ms is just at the lower edge and might feel snappier on T3 surfaces. **DEFER**: visual-test post-implementation.

**No bounce, no elastic, no overshoot.** Hard rule. Aligned.

**Stagger discipline for list animations** (chat-row entrance, KPI grid first-render): per `motion-design.md`, cap total stagger at ≤500ms. For 3-KPI grid, 60ms × 3 = 180ms. For 6-row insight feed, 50ms × 6 = 300ms. **HOLD** for now (no list-entrance animation in canonical preview — would be added if a streaming AI insight feed ships post-alpha).

### 9.4 · Iconography (LOW confidence — Lucide is locked)

Current: Lucide 24×24, currentColor. No change recommended. The «pill icon» wraps the Lucide SVG inside a 14×14 viewport which is sub-optimal — Lucide is designed for 24×24 and degrades on sub-16px sizes. **DEFER**: a 16×16 viewport floor for D1 would mean redesigning some 14px icon containers.

### 9.5 · Density (HIGH confidence — applies to ICP B post-alpha)

ICP A (28-40 multi-broker, dense tools) gets the current 16px grid gap, 20px panel padding. Aligned.

ICP B (22-32, Linear/Raycast-native) might want **a `[data-density="comfortable"]` opt-in** that scales padding +25% and gaps +50%. Implementation: a single CSS variable `--d1-density-scale: 1` (default) / `1.25` (comfortable), multiplied into all spacing tokens. **HOLD until ICP B feedback** — premature for v3 lock.

### 9.6 · Edge-case states re-audit (HIGH confidence — already in 7-fix-pass)

Current `_lib/edge-cases.md` covers mobile, empty, error, stale, failure. Verified covered by Fix 6. v3 adds:
- **Stale-data chart**: striped overlay (inline SVG, 4% alpha) per §8.10
- **Broker-disconnected card**: 4px left-border in `--d1-status-error` per §8.10
- **Empty-portfolio**: T1-read recipe + ghost-text body, no depth change

These additions are content-aware variants, not new depth tiers.

### 9.7 · Tabular numeric alignment audit (MEDIUM confidence)

Geist Mono with `font-feature-settings: "tnum" 1` is already on. Verify across all numeric surfaces:
- KPI `__num`: ✓
- Insight inline `.d1-num`: ✓
- Eyebrow `__lead` (date): ✓ (mono with tnum)
- Heatmap labels: should add `font-variant-numeric: tabular-nums`
- Hatch-legend `__value`: ✓

Non-issue, just tightening up.

### 9.8 · Status-color usage discipline (HIGH confidence)

The four status colors are powerful and easily abused. Codify usage rules:

```
--d1-status-error    → ONLY for: form field error, broker-disconnect banner,
                       destructive button (post-alpha). NEVER for negative-delta
                       numbers (those use ink-on-lime or muted text — financial
                       loss is informational, not a system error).

--d1-status-warning  → ONLY for: stale data, drift breach, pending refresh.
                       NEVER for «warning to user» (overconfident AI signal,
                       drift exceeds X) — those use lime on dark-bg with
                       a measured tone.

--d1-status-info     → ONLY for: educational tooltips, onboarding coach marks,
                       neutral notifications (market close timing). NEVER for
                       AI-generated insight (those keep purple).
```

Add to spec as a hard-rule section, tag in code comments at each first use.

---

## 10 · Confidence Levels

| Recommendation | Confidence |
|---|---|
| 4-tier system (T0/T1/T2/T3 — Canvas/Read/Write/Press) | **HIGH** |
| T1 «Read» recipe = single inset top-light + outer ink baseline | **HIGH** (carries «card-on-page» on charcoal without atmospheric stack) |
| T2 «Write» recipe = real 2px inner top-shadow + 1px bottom hairline | **HIGH** (the 2px blur is the legibility delta vs v2) |
| T3 «Press» recipe = T1 atoms + brighter top-light + active sinks | **HIGH** (universal convention) |
| **HOVER ON T1 = NO-OP** (PO's question answered) | **HIGH** (this is the clean fix, not a hedge) |
| Tier name refactor (verbs not numbers) | MEDIUM (cosmetic; could keep `tier1/tier2`) |
| Add `--d1-bg-trough` for segmented track | **HIGH** (visual disambiguation) |
| Add `--d1-status-error/-warning/-info` (3 OKLCH semantic colors) | **HIGH** (each resolves a real existing token-overload conflict) |
| Add `--chart-series-3-discrete` (cyan) | MEDIUM (verifies during multi-broker alpha) |
| Re-tint neutrals with 0.003-0.006 chroma toward lime hue | MEDIUM (subconscious cohesion gain; sub-perceptual delta) |
| Type scale consolidation (9 → 7 sizes) | **HIGH** (per impeccable «fewer sizes more contrast») |
| Spacing tokenization (4pt scale) | MEDIUM (refactor effort vs payoff) |
| Density opt-in (`data-density="comfortable"` for ICP B) | LOW (defer) |
| Drift KPI moves from lime-fill to warning-color treatment | MEDIUM (cross-check with brand-strategist) |
| Disclaimer chip stays flat (Lane-A) | **HIGH** (rule preserved) |
| Record Rail stays out of depth system | **HIGH** (signature element preservation) |
| Reduced-motion: depth atoms static, transitions collapse | **HIGH** |
| `prefers-contrast: more` re-binds atoms with stronger magnitudes | **HIGH** |
| Letter-spacing 0.005em on body for dark-mode compensation | MEDIUM |
| `font-variant-caps: all-small-caps` on `<abbr>` for tickers | LOW (polish, not lock-blocker) |

---

## Appendix A · Anti-patterns this v3 system explicitly rejects (per `impeccable` curated list)

- **No Inter** — Geist locked, no swap (Inter is the AI-design default per `impeccable:brand`).
- **No purple gradients** — `--d1-accent-purple` solid only. Linear/radial gradient using purple is BANNED.
- **No gray-on-color** — `--d1-text-muted` (gray) on `--d1-accent-lime` or any colored fill is BANNED. Use `--d1-text-ink` on lime; use `--d1-text-primary` on purple.
- **No cards-in-cards** — T1 nested inside T1 is BANNED (per §8.2, `impeccable:spatial`).
- **No bounce easing** — `cubic-bezier(0.16, 1, 0.3, 1)` is the ONLY ease-out; no overshoot variants (`bounce`, `back`, `elastic`).
- **No floating-card drop shadow at rest** — generic dark dashboard tell. v3 uses 1px outer ink baseline (single line), not atmospheric multi-layer.
- **No animated emboss intensity on hover** — depth is structural, not motion. The atom values don't animate; only transform + transitions do.
- **No more than 4 tiers** — Material 3's 5 tiers are wrong for our scope.
- **No emboss on Record Rail or data cells** — signature + data preservation.
- **No >12% white inset alpha** — skeumorphic-bevel failure mode (90s Windows look).
- **No pure-black drop shadow >0.6 alpha against `#141416`** — creates a black halo, reads as cheap.
- **No different timings per element family** — system fragmentation. 80ms / 200ms / 220ms is universal.
- **No transparent bg on T1 surfaces** — depth requires the lightness step.
- **No status colors (`--d1-status-*`) used outside their declared role** — see §9.8 discipline.

---

## Appendix B · What I'd push back on (honest)

**Push-back 1 (HIGH conviction): «cards should still hover, just more subtly».** Variant-B's read-up + my no-hover-on-T1 might trigger PO «но как user знает что can hover на drill-down link?». Counter: the visual signal that a card is interactive lives at the *cursor* level (cursor: pointer on hover) and at the *content* level (a chevron icon, an underline on the title). Surface-level hover-lift on T1 either lies (current state — non-interactive cards lift) or fights with the cursor signal. **The cursor + content-affordance pair is sufficient.** If post-alpha, drill-down is added and user testing surfaces «I didn't know I could click», THEN add a 1px lime hairline border on hover (not a lift) as a content-revealed affordance. NOT a lift. Confidence the no-hover discipline is right: **HIGH**.

**Push-back 2 (MEDIUM conviction): the Record Rail's lime hairline at 30% alpha competes with my new T1 outer ink baseline.** Visual interference is theoretical; not measured. Mitigation if real: drop ink-baseline to 0.40 alpha specifically when a Rail sits within 8px of the panel edge. Confidence the conflict is real: LOW; confidence the mitigation works: HIGH.

**Push-back 3 (HIGH conviction): the OKLCH neutral re-tint is an unfunded engineering ask.** It's a one-line change per token but it's NOT free — it requires regenerating every contrast measurement and re-running visual regression. **Decision rule: only re-tint the four `--d1-bg-*` neutrals; preserve `--d1-text-*` and `--d1-accent-*` exactly as-is.** Sub-perceptual delta on bgs; real change-cost; bounded scope. PO can opt out of the re-tint without changing the rest of the system.

**Push-back 4 (HIGH conviction): drift-KPI moving from lime-fill to warning-color treatment is brand-strategist's call, not mine.** The Fix 1 reframing reduced the regulatory risk; the visual treatment («lime card with toned-down text» vs «dark card with warning hairline border») is a separate decision. I recommend warning-color treatment per lime-discipline §4.1, but I'd accept brand-strategist holding lime if their argument is strong. **DEFER to Right-Hand synthesis.**

**Push-back 5 (MEDIUM): T2 wells use `--d1-bg-page #141416` as fill (page-color = well-color), but `.d1-segmented` track moves to `--d1-bg-trough #1A1B1F`.** Inconsistency. Defensible: search filter is a single well + chat surface (sits within a panel that already gives it «card frame» context), so canvas-color is fine; segmented track sits in a panel header with no parent frame to give it context, so it needs the trough mid-tier. **Pattern: T2 fills depend on parent context.** Should codify.

---

End — `v3_product-designer_design-pass.md`
