# D1 «Lime Cabin» Depth System — Architecture Brief v3 + v4 + v5

**Author:** architect
**Date:** 2026-05-02 (v3+v4+v5 consolidated)
**Status:** Architectural lock — supersedes `D1_DEPTH_ARCHITECTURE.md` (v2, archived).
**Scope:** CSS architecture for the v3 depth grammar + v4 cool-violet palette redirect + v5 lime-mono brand identity. Token taxonomy, file layout, composition strategy, migration sequence, future-extensibility tests, anti-pattern enforcement.
**Pairing:** Composes with product-designer's value spec at `docs/design/D1_DEPTH_SYSTEM_v3.md` (parallel-track). Frontend-engineer consumes both.

**Document layout:**
- §1-§18 below — v3 depth grammar (ADR-1 through ADR-9), unchanged from initial 2026-05-02 lock.
- §19 onwards — v4 + v5 delta (ADR-10 through ADR-17). Token taxonomy and enforcement for the lime-mono brand identity + cool-violet canvas.

The v3 ADRs are NOT rewritten by v4/v5; they are extended. ADR-3 (depth-only `depth.css`), ADR-4 (color tokens in `theme.css` + `lime-cabin.css`, OKLCH-first), ADR-7 (canonical recipe stacking) all carry over and bound the v4/v5 placement decisions below.

---

## 1 · Context

V2 architecture (`D1_DEPTH_ARCHITECTURE.md`) was authored against the «deboss-at-rest» consensus that PR #83 was built on. PO challenged the consensus after live render — KPI cards on dark canvas read flat — and locked variant B «cards up, inputs down» on 2026-05-02 (per `project_d1_depth_system_2026-05-02.md`). Three independent v3 specialists (PD / brand-strategist / external frontend-design) returned all-HIGH-confidence support. Right-Hand synthesised; PO greenlit ten adopted positions.

The architectural changes that flow from those positions:

1. **Verb-tier vocabulary** replaces numeric tier names: Canvas / Read / Write / Press / Float (5 tiers).
2. **Read tier carries 3-tier amplitude variation** (look-here / supporting / panel) — depth encodes hierarchy.
3. **Two new tonal-layer tokens** (`--d1-bg-card-elevated` raised above page; `--d1-bg-input` recessed below page).
4. **Status quartet** (4 semantic color tokens) joins the palette.
5. **Tonal neutrals re-tinted** from cool hue 270° to editorial-warm hue 75° (in-place value swap; same names).
6. **Hover-NO-OP** on Read tier — the v2 «hover lifts cards» pattern is deleted entirely.
7. **Record Rail mitigation** — rail-bearing cards drop the top-highlight to preserve rail primacy.

V2 architecture's core invariants survive: dual-scoped selector under both `[data-style="d1"]` and `[data-theme="lime-cabin"]`, atom + recipe two-layer composition, single-layer ink-baseline (no atmospheric stacks), compositor-only animation, `prefers-reduced-motion` collapses transitions only. The architectural pivot is in token-naming, surface-token expansion, and read-tier amplitude — not in the underlying composition strategy.

---

## 2 · ADR-1 · Verb-tier token naming over numeric tiers

### Decision

Adopt verb-named tier tokens with shape `--d1-elev-{verb}-{state}`. Five canonical verb tiers: `canvas` / `read` / `write` / `press` / `float`. The Read tier carries three amplitude variants: `read-pronounced` / `read-standard` / `read-quiet` (mapped to look-here / supporting / panel per `project_d1_depth_system_2026-05-02.md` §4).

Examples:
- `--d1-elev-read-pronounced-rest`
- `--d1-elev-read-standard-rest`
- `--d1-elev-read-quiet-rest`
- `--d1-elev-write-rest`
- `--d1-elev-write-focus`
- `--d1-elev-press-rest`
- `--d1-elev-press-hover`
- `--d1-elev-press-active`
- `--d1-elev-float-rest`

### Rationale

The PO-locked invariant is now «read-up / write-down». Numeric tier names (`tier1`, `tier2`) hide that semantic. Verb names encode it directly into the token surface — a developer reading `--d1-elev-write-rest` knows immediately that this token recesses; a developer reading `--d1-elev-tier1-rest` does not. Self-documenting token names reduce the cognitive load of every component implementation and review.

The Read amplitude variants use scalar adjectives (pronounced / standard / quiet) rather than role names (look-here / supporting / panel) because the same amplitude can serve different roles in future contexts. «Pronounced» communicates magnitude; «look-here» communicates a specific role — the magnitude name composes more freely.

### Alternatives considered

- **Pure numeric (`--d1-elev-tier1-rest`, comments name verbs).** Rejected: hides the polarity invariant in comments where it's least likely to be read. Future renames are «correct breakage» — if we ever pivot away from read/write polarity, the verb tokens MUST be renamed; this is a feature.
- **Hybrid (`--d1-elev-tier-read-rest`).** Rejected: longer name with no information gain over `--d1-elev-read-rest`.
- **Role-named amplitude (`--d1-elev-read-look-here-rest`).** Rejected: couples token to role assignment. A future card type that needs «pronounced» Read tier without being a «look-here» KPI would be awkward.

### Trade-offs

- **Accept:** verb tokens become semantically stale if polarity ever inverts. This is intentional — the token names should change when the meaning changes.
- **Accept:** five tiers means a `--d1-elev-canvas-*` namespace exists but is empty (Canvas is `none`). Architectural symmetry over real-estate optimization.

---

## 3 · ADR-2 · Read tier amplitude — three discrete tokens, no scalar modifiers

### Decision

The Read tier's three amplitude levels are three discrete recipe tokens (`--d1-elev-read-pronounced-rest`, `--d1-elev-read-standard-rest`, `--d1-elev-read-quiet-rest`). Component selectors bind directly to one of the three. No scalar amplitude variable, no `calc()` composition.

### Rationale

The simplest architecture that meets the requirement. Three tokens for three levels is dead-readable in component CSS:

```css
.d1-kpi--portfolio { box-shadow: var(--d1-elev-read-pronounced-rest); } /* the headline */
.d1-kpi          { box-shadow: var(--d1-elev-read-standard-rest);   } /* supporting KPIs */
.d1-chart-panel  { box-shadow: var(--d1-elev-read-quiet-rest);      } /* chart container */
```

A reader skimming the component CSS sees the hierarchy encoded in the token name. No need to look up a separate amplitude scalar.

### Alternatives considered

- **Scalar amplitude (`--d1-elev-amplitude: 1.6` multiplied into atoms via `calc()`).** Rejected: `calc()` inside `box-shadow` rgba alpha multiplies works but is brittle. It hides the amplitude assignment in a separate variable, which is harder to debug in DevTools and easier to break with a `calc()` typo. Cleverness without payoff for a 3-element variation.
- **Two amplitudes («pronounced» + «standard»).** Rejected: PO §4 lock specifies three discrete levels. Simplifying to two contradicts the design lock.

### Trade-offs

- **Accept:** three tokens for one tier is more verbose than alternatives. Verbosity buys readability and DevTools-friendly inspection.
- **Accept:** the three tokens share most of their atoms. We tolerate the duplication in recipe declarations to keep atom layer flat.

---

## 4 · ADR-3 · Single source of truth for depth atoms — new `depth.css` partial

### Decision

Create `apps/web/src/app/style-d1/_lib/depth.css` as the single source of truth for the atom layer and recipe layer. Dual-scoped to both `[data-style="d1"]` and `[data-theme="lime-cabin"]` in one declaration. Imported by `style-d1/layout.tsx` (route-local CSS) AND by `apps/web/src/app/design-system/_styles/lime-cabin.css` via top-of-file `@import './depth.css';` (or layout-side import — frontend-engineer chooses based on Next.js bundling).

Depth tokens (atoms + recipes) are the ONLY occupants of this file. No surface tokens, no color tokens, no component bindings.

### Rationale

V2 architecture (now archived) already chose the dual-scoped pattern; v3 preserves it. The new question is scope of the file: «depth + colors together» vs «depth alone».

I split for three reasons:
1. **Different lifecycles.** Color tokens (especially the warm hue 75° re-tint) may be re-tuned without touching depth. Depth atoms calibrate against rendered hardware and may be re-tuned without touching colors. Independent files = independent commit boundaries.
2. **Different specialist ownership.** Brand-strategist owns palette decisions; product-designer owns depth grammar. File-level split makes review-routing explicit.
3. **Smaller files.** v2's 800-line guard discipline applies. Depth atoms + recipes in v3 will land at ~140-180 lines (atom set + recipe set + reduced-motion + prefers-contrast). Adding all surface tokens would push the file past 250 lines and start mixing unrelated concerns.

### Alternatives considered

- **Single `tokens.css` containing depth + surface + status.** Rejected per above.
- **Inline depth atoms in `lime-cabin.css`.** Rejected: `lime-cabin.css` is already 1300+ lines and is the component-binding file. Adding atoms there violates the «small focused files» discipline and confuses the architecture (atoms vs component bindings interleaved).
- **Move depth to design-system folder (`design-system/_styles/depth.css`).** Rejected: `style-d1` is the canonical home for D1 tokens; design-system is a consumer that mirrors. Source of truth must live in the route that owns the style.

### Trade-offs

- **Accept:** two files to keep in sync via `@import`. The Next.js layout-based import + dual-scoped selector covers both routes; mistake risk is low.
- **Accept:** developers editing depth must remember to also edit surface tokens in `theme.css` if their depth change requires a new surface fill. Mitigated by ADR-7 migration sequence (tokens land first, depth atoms follow).

---

## 5 · ADR-4 · Color token architecture — surface + status in existing files; OKLCH-first

### Decision

- **Status quartet** (`--d1-status-success` / `--d1-status-warning` / `--d1-status-error` / `--d1-status-info`) joins the existing `:root`-equivalent block in `apps/web/src/app/style-d1/_lib/theme.css` (root D1 file, ~lines 28-45 «Palette» block) AND `apps/web/src/app/design-system/_styles/lime-cabin.css` (mirror block, ~lines 30-43).
- **Tonal layers** (`--d1-bg-card-elevated`, `--d1-bg-input`) join the same surface-token blocks in both files, immediately after the existing `--d1-bg-card-soft` declaration.
- **Re-tinted base surfaces** (`--d1-bg-page` / `--d1-bg-surface` / `--d1-bg-card` / `--d1-bg-card-soft`) are MODIFIED IN PLACE — same token names, new OKLCH values per the design lock §5 (hue 75°, chroma 0.008-0.014). No `*-warm` aliases.
- **All surface and status values declared OKLCH-first.** No hex fallback, no parallel hex tokens.

### Rationale

**Why same files, not a new `colors-v3.css`:** the surface tokens already live in `theme.css` and `lime-cabin.css`. Extracting a subset of color tokens into a new file would split the palette across three files (existing in two, status in a third) — strictly worse for «one place to find a color».

**Why modify in-place rather than alias:** the v2 cool-cast neutrals are gone, replaced by the v3 warm-cast neutrals. Aliases (`--d1-bg-page-warm`) would create dead tokens (the cool versions become unused) and migration ambiguity (which file uses which?). The PO lock is unambiguous: hue 270 → hue 75. Modifying in place is the correct execution.

**Why OKLCH-first, no hex fallback:** OKLCH is Baseline 2023 (Safari 15.4 / Chrome 111 / Firefox 113 — all ≥2 years old at v3 ship time). Browser support is ~95% globally. Hex fallback would double the token count and introduce drift (which value is canonical when they're both declared?). The re-tint operation is fundamentally an OKLCH operation (chroma + hue shifts at fixed lightness); writing it in hex would obscure the intent and make future re-tints painful. Provedo product surface is targeting US + EU on modern browsers (per `project_target_market_2026-05-01.md`) — pre-Baseline-2023 browsers are not in scope.

### Alternatives considered

- **Separate `colors-v3.css` partial.** Rejected: splits palette across more files than necessary; existing two-file mirror is already the consolidation point.
- **`--d1-bg-page-warm` aliases with cool values held in legacy tokens.** Rejected: leaves dead tokens; pollutes DevTools inspection; no migration scenario justifies it (PO has greenlit the swap).
- **Hex-first with OKLCH fallback in comments.** Rejected: defeats the purpose of OKLCH (chroma/lightness adjustments invisible in hex).
- **Hex + OKLCH parallel declarations.** Rejected: drift risk; doubles maintenance.

### Trade-offs

- **Accept:** users on browsers older than Baseline 2023 (~5% globally, mostly enterprise locked-down environments) will see un-styled fallback colors (browser default). Acceptable for pre-alpha + US/EU + modern-browser ICP.
- **Accept:** the v2 cool neutrals are gone permanently. No revert path without a new design pass — by design.

---

## 6 · ADR-5 · Record Rail mitigation via `:has()` selector

### Decision

Rail-bearing cards drop the top-highlight via a CSS `:has()` structural selector:

```css
.d1-kpi:has(> .d1-rail),
.d1-panel:has(> .d1-rail),
.d1-chart-panel:has(> .d1-rail) {
  /* Drop top-light atom; rebind read-tier recipe to side-and-bottom-only variant */
  box-shadow: var(--d1-elev-read-standard-rest--rail-headed);
}
```

A second recipe variant is added per Read amplitude tier:
- `--d1-elev-read-pronounced-rest--rail-headed`
- `--d1-elev-read-standard-rest--rail-headed`
- `--d1-elev-read-quiet-rest--rail-headed`

These recipes omit the top-light atom; they compose only the bottom inset + outer ink-baseline.

### Rationale

The brand-CRITICAL rule (BS §1.3) is: «two parallel hairlines on the top edge — one lime from the rail, one white from the card — break the rail's primacy». The architectural question is how to enforce it.

`:has()` is automatic and structural. The rule fires on the right markup whether or not the developer remembers to add a modifier class. Markup is the truth: rail-as-direct-child is the architectural convention; CSS reads that truth and renders correctly. When a future contributor adds a new card with a Record Rail child, the rule fires automatically — no discipline required, no silent regression.

`:has()` is Baseline 2024 (Safari 15.4+ / Chrome 105+ / Firefox 121+). Within scope per ADR-4 browser support reasoning.

### Alternatives considered

- **Modifier class `.d1-kpi--rail-headed`.** Rejected: requires developer discipline (must remember to add). A rail-bearing card without the modifier silently renders the wrong shadow — exactly the regression mode BS flagged as CRITICAL. Explicit-modifier patterns work for non-critical rules; this rule is brand-critical.
- **Inverted default (`.d1-kpi` defaults to no-top-highlight; `.d1-kpi--standalone` opts in).** Rejected: the standalone case is more common; making it the modifier creates a tax on the common case to serve the rare case.
- **Structural CSS inheritance via `--d1-elev-read-*` overridden inside `.d1-rail`'s parent.** Rejected: requires `.d1-rail` to know about its parent's depth tokens — coupling in the wrong direction.

### Trade-offs

- **Accept:** `:has()` has a measurable browser parser cost on very deep selector trees. At our selector depth (3-4 levels), the cost is sub-millisecond and not in any hot path.
- **Accept:** if a future card variant needs `inset` styles AND has a rail child but should keep the top-highlight (currently no such case exists), it would need a more-specific override. Acceptable corner case.

---

## 7 · ADR-6 · Hover-NO-OP enforcement via comment banner + structural cleanup

### Decision

The `depth.css` file opens with a banner comment that documents the hover contract. The banner is followed by a section comment in the recipe block that lists the «hover-NO-OP» selectors explicitly. No lint rule, no custom Biome plugin.

Component CSS files (`lime-cabin.css`) are explicitly cleaned: every `:hover` rule on `.d1-kpi`, `.d1-panel`, `.d1-chart-panel`, `.d1-insight` is deleted (not commented out, not `transform: none`-overridden — deleted).

```css
/* depth.css banner — top of file */
/*
 * D1 DEPTH SYSTEM v3 — READ TIER HOVER CONTRACT
 * ─────────────────────────────────────────────
 * Read-tier surfaces (KPI cards, chart panels, insight rows, the
 * pronounced/standard/quiet amplitude band) are PASSIVE. They have NO
 * `:hover` state by design — answers PO directive 2026-05-02 «зачем
 * hover на пассивной карточке».
 *
 * Reopening hover-on-Read requires reopening the design pass. Do not
 * add `:hover` rules to .d1-kpi, .d1-panel, .d1-chart-panel, or
 * .d1-insight. Interactivity on cards is opt-in via `--actionable`
 * modifier which inherits Press-tier semantics (ADR-9).
 */
```

### Rationale

Cheapest deterrent that meaningfully deters. Three-tier reasoning:

1. **Lint rule (Biome custom rule).** High authoring cost (~half a day), runs at compile time, catches drift. Overkill for a project-specific rule on one selector pattern.
2. **Comment banner in `depth.css`.** Surfaces at the moment of edit (developer opening the file to add a hover state will see the banner). Zero authoring cost. Catches drift at code-review time, not compile time — but our review process is the actual deterrent (the banner is the artifact reviewers point to).
3. **ADR + persona-file note.** Too far from the code. A developer editing `lime-cabin.css` won't read the architect persona file.

(2) wins. The banner cost is one comment block; the deterrent value is high because our review discipline is high.

### Alternatives considered

- **Stylelint rule `selector-disallowed-list` against `.d1-kpi:hover`.** Rejected: only catches the direct selector form; misses descendant selectors and combinator variants. Would also need to allow-list legitimate `--actionable` modifiers via `:not(--actionable)` selector escape, which obscures the rule.
- **Persona-file rule only.** Rejected: too distant from the file being edited.
- **Custom Biome rule.** Rejected: high authoring cost for narrow benefit.

### Trade-offs

- **Accept:** banner can be ignored. Mitigation is review discipline, which we already practice.
- **Accept:** the rule is documented in a comment, not enforced by tooling. Tooling can be added later if regressions become a pattern.

---

## 8 · ADR-7 · Composition stacking order canonical

### Decision

`box-shadow` recipe layers compose in this canonical order, listed first to last:

1. **Edge hairline** (outer 1px ring) — if present (Read tier and above)
2. **Top-light inset** (highlight)
3. **Bottom-shadow inset** (anchor)
4. **Outer ink baseline** (1px drop, no blur) — Read and Press tiers
5. **Outer drop-shadow** (blur > 0) — Float tier ONLY

Recipe declaration template:

```css
--d1-elev-read-standard-rest:
  var(--d1-elev-atom-edge),                 /* 1: outer ring */
  var(--d1-elev-atom-read-top),             /* 2: top inset */
  var(--d1-elev-atom-read-bottom),          /* 3: bottom inset */
  var(--d1-elev-atom-ink-baseline);         /* 4: outer drop */
```

### Rationale

Shadow paint order is implementation-detail in CSS («first listed paints last», but with insets and outers having separate paint passes). Documenting a canonical order makes recipes predictable and review-able. New recipes follow the same order; deviations require justification.

The order is chosen so the read-flow matches the visual stack: edge first (the outermost element), then top-to-bottom on the surface (top-light → bottom-shadow), then the drop beneath the surface (ink-baseline), then the atmospheric blur (Float only). A reviewer reading a recipe top-to-bottom sees the shadow build from outer to surface to anchor.

### Alternatives considered

- **No canonical order; specify per recipe.** Rejected: review burden; new recipes would freelance and drift.
- **Inset-first vs outer-first.** Rejected the alternative: outer-edge before insets is the FE-design-proposal convention and matches the «outermost-to-innermost» reading direction.

### Trade-offs

- **Accept:** the canonical order is a convention, not a paint-order requirement. Browsers will paint correctly regardless of declaration order; the convention is for human readability.

---

## 9 · ADR-8 · Sub-canvas `--d1-bg-input` — declarative bindings, no layout side effects

### Decision

`--d1-bg-input` is purely a `background-color` token. Components that bind it (form inputs, search filters, segmented track) declare two contracts:

1. **Body text on this surface uses `--d1-text-primary`** (the warm-white ink, AAA contrast verified at OKLCH 13% L surface).
2. **Lime focus ring (2px, existing pattern) composes via `box-shadow` outer ring** — the darker bg INCREASES focus-ring contrast, so no special-case ring color is needed.

No z-index changes, no positioning changes, no hit-test implications.

### Rationale

The «sub-canvas wells» metaphor is purely visual. The architectural impact is solely on text contrast (verified by FE-design §6.10 and PD's own contrast pass). The lime focus ring at 2px on dark `--d1-bg-input` is MORE visible than on `--d1-bg-page` (more luminance contrast against the ring's lime). A11y improves, not regresses.

Documenting the contract in this ADR prevents a future implementer from binding `--d1-bg-input` to a surface that uses muted text (which would fail AA on the darker bg) or to a surface that competes with the focus ring's outer geometry.

### Alternatives considered

- **Allow muted text on `--d1-bg-input`.** Rejected: contrast falls below AAA on muted text. Inputs are write surfaces; placeholder text is the only «muted» equivalent and uses a separate token (`--d1-text-placeholder`, to be specced by PD if needed).

### Trade-offs

- **Accept:** sub-canvas inputs lock body text to the warm-white primary. No designer-leeway for muted body text in form fields.

---

## 10 · ADR-9 · `--actionable` modifier as opt-in interactivity for Read tier

### Decision

A Read-tier card that becomes click-targeted (post-alpha drilldown navigation) gets a `.d1-kpi--actionable` (or `.d1-panel--actionable`) modifier that:

1. Sets `cursor: pointer`.
2. Re-binds `box-shadow` on `:hover` to the matching Press-tier hover atoms.
3. Optionally shifts background to `--d1-bg-card-soft` on hover.

Without the modifier, the card has zero hover state.

### Rationale

The «hover is reserved for elements that DO something on click» rule (PD §2.4) needs an architectural escape valve for the genuinely-interactive case (drilldown). The `--actionable` modifier surfaces interactivity in JSX where the click handler is wired — the marker is co-located with the behavior. CSS reads the marker and applies the appropriate hover treatment.

Without the modifier, the card is passive. With it, the card inherits Press-tier semantics. No new tier is created.

### Alternatives considered

- **No modifier; rely on `<a>` wrapping or `[role="button"]` selector.** Rejected: hover-on-`<a>` couples the rule to anchor wrapping, which doesn't survive Next.js Link or programmatic onClick. `[role="button"]` is too generic.
- **Per-component modifier (e.g., `.d1-kpi--clickable`).** Rejected: same semantic, more variant names. `--actionable` is the canonical noun.

### Trade-offs

- **Accept:** developers must remember to add `--actionable` when wiring click handlers. Mitigation: code-review discipline + the explicit «no `:hover` without `--actionable`» rule.

---

## 11 · Token taxonomy — naming convention reference

### Convention

```
--d1-elev-{tier-verb}[-{amplitude}]-{state}[--{variant}]

tier-verb     : canvas | read | write | press | float
amplitude     : pronounced | standard | quiet      (Read tier only)
state         : rest | hover | focus | active | disabled
variant       : rail-headed | on-lime              (sparse, opt-in)
```

### Atom layer

Atoms are primitives — never read by component selectors directly. Naming: `--d1-elev-atom-{descriptor}`.

```
--d1-elev-atom-edge                   /* outer 1px hairline ring */
--d1-elev-atom-read-top               /* read-tier top-light inset */
--d1-elev-atom-read-bottom            /* read-tier bottom-shadow inset */
--d1-elev-atom-ink-baseline           /* outer 1px drop, no blur */
--d1-elev-atom-write-top              /* write-tier inner shadow (real blur) */
--d1-elev-atom-write-bottom           /* write-tier closing hairline */
--d1-elev-atom-press-top              /* press-tier top-light, brighter */
--d1-elev-atom-press-bottom           /* press-tier bottom-shadow */
--d1-elev-atom-press-active-top       /* pressed-down inner shadow */
--d1-elev-atom-float-drop             /* atmospheric blur (Float only) */
--d1-elev-atom-focus-ring             /* lime 2px ring composed */
--d1-elev-atom-focus-ring-on-lime     /* lime-on-lime focus halo */
```

### Recipe layer

Recipes compose atoms; component selectors read recipes. Naming follows the convention above.

```
--d1-elev-canvas                      /* alias for `none` */
--d1-elev-read-pronounced-rest        /* the look-here KPI */
--d1-elev-read-standard-rest          /* supporting KPIs */
--d1-elev-read-quiet-rest             /* chart panels */
--d1-elev-read-pronounced-rest--rail-headed   /* drops top-light */
--d1-elev-read-standard-rest--rail-headed
--d1-elev-read-quiet-rest--rail-headed
--d1-elev-write-rest                  /* form fields, segmented track */
--d1-elev-write-focus                 /* deeper write + focus ring */
--d1-elev-press-rest                  /* CTA, pills, chips, segmented thumb */
--d1-elev-press-hover
--d1-elev-press-active
--d1-elev-press-focus
--d1-elev-float-rest                  /* tooltips, modals, popovers */
--d1-elev-disabled                    /* alias for `none` */
```

### Surface tokens (live in `theme.css` + `lime-cabin.css`, not `depth.css`)

```
--d1-bg-page                          /* OKLCH(17% 0.008 75) — warm charcoal */
--d1-bg-surface                       /* OKLCH(23% 0.010 75) — section frame */
--d1-bg-card                          /* OKLCH(28% 0.012 75) — card baseline */
--d1-bg-card-elevated                 /* NEW — Read tier plate fill */
--d1-bg-card-soft                     /* OKLCH(31% 0.014 75) — actionable-hover */
--d1-bg-input                         /* NEW — Write tier sub-canvas well */
```

### Status quartet (live in `theme.css` + `lime-cabin.css`)

```
--d1-status-success                   /* desaturated forest-leaf */
--d1-status-warning                   /* warm amber, kept from v2 */
--d1-status-error                     /* warm clay, calm */
--d1-status-info                      /* desaturated blue-grey */
```

(Exact OKLCH values — final selection — are PD's deliverable in the value spec.)

---

## 12 · File layout

```
apps/web/src/app/
├── style-d1/
│   ├── _lib/
│   │   ├── theme.css              [EXTEND]   surface tokens, status quartet,
│   │   │                                     edit-in-place re-tint
│   │   ├── depth.css              [NEW]      atoms + recipes (THIS BRIEF'S
│   │   │                                     CORE OUTPUT). Single source of
│   │   │                                     truth. ~140-180 lines.
│   │   └── edge-cases.md          [PRESERVE] (existing 7-fix-pass log)
│   ├── _components/
│   │   └── *                      [PRESERVE]
│   ├── layout.tsx                 [EXTEND]   add `import './_lib/depth.css'`
│   └── page.tsx                   [PRESERVE]
└── design-system/
    ├── _styles/
    │   └── lime-cabin.css         [EXTEND]   surface tokens mirror,
    │                                          status quartet, top-of-file
    │                                          `@import '../../style-d1/_lib/depth.css';`
    │                                          OR equivalent layout import,
    │                                          plus component bindings rewritten
    │                                          per PD migration §7
    └── _sections/
        └── *                      [PRESERVE component contracts; review for
                                    hover-NO-OP cleanup per ADR-6]
```

**Source-of-truth contract:** `depth.css` is dual-scoped under both `[data-style="d1"]` and `[data-theme="lime-cabin"]`. Either route consumes the same atoms and recipes. No duplication.

**Surface-token mirror contract:** `theme.css` and `lime-cabin.css` both declare the surface palette under their respective scope selectors. This is an existing migration debt (DRY violation present in v2); v3 does NOT consolidate. Resolving the mirror is a separate refactor outside this architectural brief's scope.

---

## 13 · Composition diagram — atoms → recipes → selectors

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ATOM LAYER (depth.css :root-equivalent block)                          │
│  ─────────────────────────────────────────────                          │
│  --d1-elev-atom-edge              (outer 1px ring, white 5%)            │
│  --d1-elev-atom-read-top          (inset top-light, white 6-9%)         │
│  --d1-elev-atom-read-bottom       (inset bottom, black 18-26%)          │
│  --d1-elev-atom-ink-baseline      (outer drop, black 36-45%, 0 blur)    │
│  --d1-elev-atom-write-top         (inner shadow, black 38-45%, 2-3 blur)│
│  --d1-elev-atom-write-bottom      (inset bottom-light, white 5-6%)      │
│  --d1-elev-atom-press-top         (inset top-light, white 10-14%)       │
│  --d1-elev-atom-press-bottom      (inset bottom, black 20-28%)          │
│  --d1-elev-atom-press-active-top  (inner shadow, black 42%)             │
│  --d1-elev-atom-float-drop        (outer drop, black 55%, 12+ blur)     │
│  --d1-elev-atom-focus-ring        (composed: lime 2-3px ring)           │
│  --d1-elev-atom-focus-ring-on-lime (composed: canvas spacer + lime)     │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  RECIPE LAYER (same file)                                               │
│  ─────────────────────────                                              │
│  --d1-elev-canvas                  → none                               │
│  --d1-elev-read-pronounced-rest    → edge + read-top + read-bottom +    │
│                                       ink-baseline   (atom values are   │
│                                                       tuned «pronounced»│
│                                                       in atoms; recipes │
│                                                       just compose)     │
│  --d1-elev-read-standard-rest      → same composition, standard atoms   │
│  --d1-elev-read-quiet-rest         → same composition, quiet atoms      │
│  --d1-elev-read-{*}-rest--rail-headed → omit edge top + omit            │
│                                          read-top atom; bottom + base   │
│                                          only                            │
│  --d1-elev-write-rest              → write-top + write-bottom           │
│  --d1-elev-write-focus             → write-top deeper + focus-ring      │
│  --d1-elev-press-rest              → press-top + press-bottom +         │
│                                       ink-baseline                       │
│  --d1-elev-press-hover             → press-top brighter + press-bottom +│
│                                       ink-baseline firmer                │
│  --d1-elev-press-active            → press-active-top                   │
│  --d1-elev-float-rest              → edge + read-top + float-drop       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  COMPONENT BINDINGS (lime-cabin.css component blocks)                   │
│  ────────────────────────────────────────────────────                   │
│  .d1-kpi--portfolio   { box-shadow: var(--d1-elev-read-pronounced-rest);│
│                         background: var(--d1-bg-card-elevated); }       │
│  .d1-kpi              { box-shadow: var(--d1-elev-read-standard-rest);  │
│                         background: var(--d1-bg-card-elevated); }       │
│  .d1-chart-panel      { box-shadow: var(--d1-elev-read-quiet-rest);     │
│                         background: var(--d1-bg-card-elevated); }       │
│  .d1-kpi:has(> .d1-rail),                                               │
│  .d1-panel:has(> .d1-rail),                                             │
│  .d1-chart-panel:has(> .d1-rail) {                                      │
│                       box-shadow: var(--d1-elev-read-{*}-rest--rail-headed);│
│  }                                                                      │
│  .d1-segmented        { box-shadow: var(--d1-elev-write-rest);          │
│                         background: var(--d1-bg-input); }               │
│  .d1-input            { box-shadow: var(--d1-elev-write-rest);          │
│                         background: var(--d1-bg-input); color: var(--d1-text-primary);│
│  }                                                                      │
│  .d1-input:focus      { box-shadow: var(--d1-elev-write-focus); }       │
│  .d1-cta              { box-shadow: var(--d1-elev-press-rest); }        │
│  .d1-cta:hover        { box-shadow: var(--d1-elev-press-hover); }       │
│  .d1-cta:active       { box-shadow: var(--d1-elev-press-active); }      │
│  .d1-tooltip          { box-shadow: var(--d1-elev-float-rest); }        │
│  .d1-disclaimer-chip  { box-shadow: var(--d1-elev-canvas); }            │
│  .d1-rail             { box-shadow: var(--d1-elev-canvas); }            │
│  /* Cards-in-cards override (ADR-10 enforcement) */                     │
│  .d1-kpi .d1-kpi,                                                       │
│  .d1-chart-panel .d1-kpi {                                              │
│                       box-shadow: none;                                 │
│                       background: transparent;                          │
│  }                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

Component selectors NEVER read atoms directly. The two-layer separation (architect ADR-3 carry-over from v2) means:
- Atom values tune visual character. Designers iterate atoms to calibrate look.
- Recipe composition is structural. Architect/designer iterate recipes when adding new tier states or variants.
- Component bindings stay stable. New components map to existing recipes; new recipes are added when a genuinely-novel tier or variant emerges.

---

## 14 · Migration sequence v2 → v3

The following ordering avoids any intermediate broken visual state. Each step is independently revertable.

| # | Step | File(s) | Visual delta | Notes |
|---|---|---|---|---|
| 1 | Add OKLCH-recast values for existing surface tokens (`--d1-bg-page` etc) at NEW hue 75°, chroma 0.008-0.014 | `theme.css`, `lime-cabin.css` | Subtle — warm tint on charcoal | Lightness held within ±1% of v2 values per BS §2.2 |
| 2 | Add new surface tokens `--d1-bg-card-elevated`, `--d1-bg-input` | `theme.css`, `lime-cabin.css` | None — unused | Tokens declared, no consumers yet |
| 3 | Add status quartet `--d1-status-{success,warning,error,info}` | `theme.css`, `lime-cabin.css` | None — unused | Existing `--d1-notification-amber` becomes alias (deprecate after one slice) |
| 4 | Create `depth.css` with atoms + recipes (full v3 set) | `style-d1/_lib/depth.css` (NEW) | None — unused | Single source of truth lands |
| 5 | Wire `depth.css` import via `style-d1/layout.tsx` AND `lime-cabin.css` (top-of-file `@import`) | `layout.tsx`, `lime-cabin.css` | None — declarations harmless without consumers | Both routes now have access to recipes |
| 6 | Cut over `.d1-kpi` family: bind `--d1-bg-card-elevated` + `--d1-elev-read-standard-rest` (or pronounced for `--portfolio`) | `lime-cabin.css` | KPI cards visibly raise | First user-facing visual change |
| 7 | Cut over `.d1-chart-panel`: bind `--d1-bg-card-elevated` + `--d1-elev-read-quiet-rest` + `:has()` rail-headed override | `lime-cabin.css` | Chart panels rise; rail-bearing instances drop top-light | The §3.6 transparent-bg fix lands here |
| 8 | Cut over `.d1-cta` and `.d1-cta--ghost`: bind press-tier rest/hover/active | `lime-cabin.css` | CTA gains coin-up + press-down feedback | |
| 9 | Cut over `.d1-pill` family + `.d1-chip` family: bind press-tier (rest = flat per design lock for inactive, press-tier for active variants) | `lime-cabin.css` | Active pills/chips gain press-tier emboss | |
| 10 | Cut over `.d1-segmented` track + thumb: track binds `--d1-bg-input` + write-rest, thumb binds press-rest. The signature dual-polarity moment | `lime-cabin.css` | Track recesses; thumb sits as coin inside | High-craft component — visual verify |
| 11 | Cut over `.d1-input` / `.d1-textarea` / `.d1-select` / `.d1-chat__search`: bind `--d1-bg-input` + write-rest + write-focus | `lime-cabin.css` | Form fields visibly recess | |
| 12 | Cut over `.d1-nav__icon-pill` and nav identity tokens to press-tier | `lime-cabin.css` | Nav surfaces gain press-tier rest | |
| 13 | Cut over `.d1-kpi--error` from amber to `--d1-status-error` | `lime-cabin.css` | Error KPI ring shifts hue (warmer clay) | |
| 14 | Delete dead `:hover` rules on Read tier per ADR-6 (`.d1-kpi:hover`, `.d1-panel:hover`, `.d1-chart-panel:hover`, `.d1-insight:hover`) | `lime-cabin.css` | Hover-lift on cards disappears | The defining v3 behavioral change |
| 15 | Add `prefers-reduced-motion: reduce` block (transitions collapse, recipes stay) | `depth.css` | None — accessibility-only | |
| 16 | Add `prefers-contrast: more` re-binding (atoms re-bound +0.10 alpha) | `depth.css` | A11y-only — visible only to high-contrast users | |
| 17 | Update narrative in `design-system/_sections/elevation-and-radii.tsx` to describe 5-tier verb-named system | `_sections/*.tsx` | Documentation change only | |
| 18 | Deprecate `--d1-notification-amber` (alias removal after one release) | `theme.css`, `lime-cabin.css` | None — alias removed, all consumers migrated | Final cleanup |

**Cutover safety:** steps 1-5 are token-only and visually invisible. Steps 6-13 each touch one component family; any single step can be reverted via git without affecting subsequent steps. Step 14 (hover deletion) is the single behavioral change and should land in a dedicated commit for review-clarity. Steps 15-18 are non-blocking polish.

---

## 15 · Future-extensibility test

### Scenario A: «Tomorrow we add `.d1-toast` (Float tier).»

Test: can the architecture absorb the new selector without changing atoms or recipes?

```css
/* in lime-cabin.css */
.d1-toast {
  background: var(--d1-bg-card-elevated);
  box-shadow: var(--d1-elev-float-rest);
  border-radius: 12px;
  /* ... toast-specific layout */
}
```

**Result: clean.** `--d1-elev-float-rest` already exists in the recipe layer; `--d1-bg-card-elevated` already exists in the surface palette. Toast composes from existing tokens. No atom or recipe changes required. Architecture passes.

### Scenario B: «Q3 product needs a 6-hue chart category palette (sectors, holdings list).»

Test: can the architecture absorb a categorical chart palette without polluting the depth or surface namespaces?

The PO lock §9 explicitly defers this. When it reopens:

```css
/* NEW NAMESPACE — chart-only, separate from --d1-elev-* and --d1-bg-* */
--d1-chart-cat-1: oklch(75% 0.16 122);
--d1-chart-cat-2: oklch(70% 0.18 285);
--d1-chart-cat-3: oklch(72% 0.13 78);
--d1-chart-cat-4: oklch(70% 0.13 200);
--d1-chart-cat-5: oklch(72% 0.14 340);
--d1-chart-cat-6: oklch(70% 0.14 50);
```

**Result: clean.** Chart category tokens namespace independently of elevation, surface, status, or accent tokens. They live in the same files (`theme.css`, `lime-cabin.css`) as the rest of the palette but under a distinct prefix that prevents leakage. UI chrome rules (component bindings) MUST NOT pull from `--d1-chart-cat-*`. Lint guard candidate: stylelint `declaration-property-value-disallowed-list` for `background`/`color`/`border-color` properties pointing at `--d1-chart-cat-*` outside `*Visx*.tsx` chart components. Optional v3.1 enforcement.

### Scenario C: «We need a Tier 1.5 between Read and Write.»

Test: can the architecture absorb a new tier?

```css
/* New atom set + recipe per the existing pattern */
--d1-elev-atom-{newtier}-top: ...;
--d1-elev-atom-{newtier}-bottom: ...;
--d1-elev-{newtier}-rest: var(--d1-elev-atom-{newtier}-top), ...;
```

**Result: clean.** The verb-tier naming convention extends to any new verb. The atom/recipe two-layer pattern absorbs the new tier without restructuring. Cost: ~10-15 lines of CSS for atoms + ~3-5 lines for recipes per state. ADR-1 ensures the new tier name is verb-coded.

---

## 16 · `impeccable` anti-pattern enforcement plan

Three architectural enforcements, ranked by leverage:

### Enforcement 1: Cards-in-cards declarative override (CSS, automatic)

```css
/* lime-cabin.css — inside the component block */
.d1-kpi .d1-kpi,
.d1-kpi .d1-panel,
.d1-kpi .d1-chart-panel,
.d1-panel .d1-kpi,
.d1-panel .d1-panel,
.d1-panel .d1-chart-panel,
.d1-chart-panel .d1-kpi,
.d1-chart-panel .d1-panel,
.d1-chart-panel .d1-chart-panel {
  background: transparent;
  box-shadow: none;
  border: 1px solid var(--d1-border-hairline);
}
```

**Why:** the «no cards-in-cards» rule (`spatial-design.md`) is the single highest-leverage anti-pattern guard for a card-economy design system. Declarative CSS makes regression visually impossible — even if a developer accidentally nests cards, the inner card automatically flattens. Zero authoring cost, zero runtime cost. Recovers cleanly: removing the override re-enables nesting; adding new card classes to the descendant selector list extends coverage.

### Enforcement 2: `:has()` Record Rail mitigation (CSS, automatic)

Per ADR-5. The `:has()` selector ensures rail-bearing cards automatically drop the top-highlight whenever the markup carries a `.d1-rail` direct child. Brand-CRITICAL rule enforced at the structural level.

### Enforcement 3: Hover-NO-OP banner comment (documentation, deters at edit-time)

Per ADR-6. The banner sits at the top of `depth.css` and is the first thing a developer sees when opening the file to add hover state. Combined with explicit deletion of v2's dead `:hover` rules in `lime-cabin.css` (migration step 14), the «cards do not hover» rule becomes unambiguous in code AND documentation.

### What we deliberately do NOT enforce architecturally

- **N>2 layer box-shadow ban.** Stylelint can count list items in `box-shadow` declarations via a custom plugin, but writing the plugin is more work than the rule deters. Instead: code-review discipline + the `impeccable` skill on the reviewer's side. The recipes themselves never exceed 4 layers (edge + top + bottom + baseline + drop, where drop is Float-only).
- **Token-leakage prevention** (e.g., `--d1-chart-cat-*` outside chart components). Future work; deferred per Scenario B.
- **`:hover` selector ban via stylelint.** Higher tooling cost than the ADR-6 banner+review approach; only worth adding if regressions become a pattern.

---

## 17 · Open questions for product-designer / Right-Hand

1. **Read amplitude atom values.** This brief specifies three discrete recipes (`read-pronounced` / `read-standard` / `read-quiet`) but the *atom values* (specific alpha percentages on top-light and bottom-shadow) are PD's deliverable. PD's spec must document three sets of read-tier atoms (or one set with three multipliers — PD chooses, ADR-2 prefers the three-set approach).

2. **Status quartet vs single-amber holdover.** PD spec must decide whether the new `--d1-status-warning` value matches the existing `--d1-notification-amber` (`#F4C257`) or shifts. If they match, alias for one slice and migrate. If they differ, deprecate amber-only after PD's spec greenlights the new value.

3. **Whether `:has()` rule covers `.d1-insight` containers.** This brief specifies `:has()` for `.d1-kpi`, `.d1-panel`, `.d1-chart-panel`. PD's selector mapping should clarify whether `.d1-insights-container` (rail-bearing per BS §1.3) needs the same rule. Add to the selector list in step 7 if so.

4. **Whether `--actionable` modifier is in v3 scope or deferred to post-alpha.** The drilldown navigation case is post-alpha per architect note. PD's spec should explicitly say «not used in v3 implementation; reserved for post-alpha» OR specify which surfaces opt in for v3. ADR-9 stands either way; the question is implementation timing.

5. **Single-file vs imported `@import` for `depth.css` consumption in `design-system`.** ADR-3 leaves the import mechanism to frontend-engineer. PD's spec doesn't need to address this; flagged here only so Right-Hand knows it's a frontend-engineer call, not a designer call.

---

## 18 · ADR summary

| ADR | Decision | One-line rationale |
|---|---|---|
| ADR-1 | Verb-tier token naming (`--d1-elev-{verb}-{state}`) | Encodes polarity invariant in token surface; staleness on pivot is correct breakage |
| ADR-2 | Three discrete recipes for Read amplitude | Simplest readable architecture; `calc()` modifiers reject for brittleness |
| ADR-3 | New `depth.css` partial as single source of truth, atoms+recipes only | Separation from color/surface concerns; size discipline; lifecycle independence |
| ADR-4 | OKLCH-first surface and status tokens, in-place re-tint | Modern browser baseline; chroma adjustments are OKLCH operations |
| ADR-5 | `:has()` selector for Record Rail mitigation | Structural automatic enforcement of brand-CRITICAL rule |
| ADR-6 | Hover-NO-OP enforced via banner comment + explicit dead-rule deletion | Cheapest deterrent; tooling deferred |
| ADR-7 | Canonical recipe stacking order (edge → top → bottom → baseline → drop) | Predictable reviews; outermost-to-innermost reading direction |
| ADR-8 | Sub-canvas `--d1-bg-input` is bg-only; locks body text to primary | A11y contract documented; no z-index/hit-test impact |
| ADR-9 | `--actionable` modifier as opt-in interactivity for Read tier | Co-locates interactivity marker with click handler in JSX |

---

*End of v3 depth grammar section. v4 + v5 delta begins below.*

---

## 19 · v4 + v5 delta — context

PO greenlit two further pivots on 2026-05-02:

- **v4 — palette redirect.** The v3 hue 75° «editorial-warm» tonal-neutrals read as «brown» in live render. PO directive: pivot to cool-violet hue 280°, drop lightness band from 15/20/24/27% to 12/16/19/23%, hold green/red on charts at the amber register (L ~80-82, C ~0.13-0.14). Status quartet hue-aligned to data hues (success → 145°, error → 25°, warning → 87° amber, info → ~240° cool).
- **v5 — lime-mono brand identity.** `--d1-accent-purple` blended into the 280° cool-violet canvas (one violet family) and lost distinctiveness. PO directive: drop purple entirely; lime carries 100% of brand-primary signal across five functional variants (canvas / soft / hairline / signal / mute). Provedo joins the single-brand-color identity register (Stripe / Coinbase / Robinhood / Spotify).

Lock memo: `C:\Users\rmais\.claude\projects\D--investment-tracker\memory\project_d1_depth_system_2026-05-02.md`. Specialist verdicts (HIGH confidence, all): `docs/design/v4_*.md`, `docs/design/v5_*.md`.

The v4 + v5 changes are surface-token-only (no depth-recipe changes). They flow into the architecture exclusively through the color/surface token files (`theme.css`, `lime-cabin.css`) per ADR-4. `depth.css` is untouched.

ADRs 10-17 below are scoped to:
- 5-stop lime ladder (ADR-10)
- Purple removal pattern (ADR-11)
- Lime-creep enforcement (ADR-12)
- Three component-recipe locks: AI avatar (ADR-13), premium chip (ADR-14), active-state (ADR-15)
- Status quartet alias-vs-separate (ADR-16)
- Hex fallback re-affirmation under v4 + v5 expanded palette (ADR-17)

---

## 20 · ADR-10 · 5-stop lime ladder — token taxonomy and placement

### Decision

Five lime tokens land in the existing palette block in BOTH `apps/web/src/app/style-d1/_lib/theme.css` AND `apps/web/src/app/design-system/_styles/lime-cabin.css` (mirror), under the existing surface-token block. Names are semantic-functional, not generic-tonal:

```
--d1-accent-lime-canvas      oklch(20% 0.012 117)   /* atmospheric tint, disclaimer wash */
--d1-accent-lime-soft        oklch(34% 0.045 117)   /* chip / avatar fill, premium bg */
--d1-accent-lime-hairline    oklch(68% 0.13  117)   /* 1px strokes, borders, focus rings */
--d1-accent-lime-signal      oklch(91% 0.21  117)   /* SIGNATURE — Record Rail / look-here KPI / CTA */
--d1-accent-lime-mute        oklch(72% 0.16  117)   /* AI byline body / cohort / hover-deepen / default chart bar */
```

`--d1-accent-lime-signal = oklch(91% 0.21 117)` is unchanged from the existing `--d1-accent-lime` value (`#D6F26B`, the locked Lime-Cabin signature).

The legacy `--d1-accent-lime` token is **retained as a deprecated alias** for one migration slice:

```css
/* DEPRECATED — alias to --d1-accent-lime-signal for v3 → v5 migration safety.
 * Remove after migration step 9 lands and grep returns zero direct consumers. */
--d1-accent-lime: var(--d1-accent-lime-signal);
```

`--d1-accent-lime-soft` (legacy `rgba(214, 242, 107, 0.35)` hatched-stripe value) is retained but **redefined** to point at the new ladder's `lime-soft` semantic. Existing consumers (hatched stripes on partial-loss columns) continue to resolve; visual delta is documented in PD's value spec.

### Rationale

**Placement in `theme.css` + `lime-cabin.css`, NOT `depth.css`.** ADR-3 (v3) defines `depth.css` as the single source of truth for atom + recipe layers ONLY. Color tokens — including the lime ladder — are part of the surface palette and live with their peers (`--d1-bg-page`, `--d1-status-*`). This keeps file lifecycles independent: a lime-tone re-tune does not force a `depth.css` edit, and a depth-recipe re-tune does not force a `theme.css` edit. Confirmed; no architectural divergence.

**Semantic-functional names over tonal-numeric names.** Tonal names (`lime-100` … `lime-900`) invite arbitrary new stops. Semantic-functional names — each stop has a single named role — close the door on improvisation. A future contributor who needs «a slightly different lime for a tooltip» has to either bind one of the five OR reopen the ladder via this ADR. The ladder is a contract, not a swatch palette.

**Legacy alias retained for one slice.** 73 existing `--d1-accent-lime` references touch component CSS, theme bindings, chart fixtures, and showcase narratives. A hard-cut would force every reference to be edited atomically in one commit (~1300 lines of churn). The alias lets ADR-11's purple removal land cleanly while lime references migrate progressively. ADR-11's enforcement contains the alias to one slice — see migration step 9.

**OKLCH-first, no hex fallback.** ADR-4 (v3) is the binding rule: surface tokens declared OKLCH-first. Five new lime tokens follow. No hex fallback per ADR-17 below. The lock memo specifies OKLCH triples only — confirmed.

### Alternatives considered

- **Place lime ladder in `depth.css`.** Rejected: violates ADR-3 file-split. Lime is color, depth.css is depth.
- **Hard-cut legacy alias (no `--d1-accent-lime` retained).** Rejected: forces 73 references migrated in a single commit. ADR-11's hard-delete pattern for purple is justified because purple is GOING AWAY; lime's signature value is staying — the alias is a no-cost migration aid that disappears in a follow-up slice.
- **Tonal-numeric names (`--d1-lime-50/200/500/700/900`).** Rejected: invites arbitrary new stops. Five named functions (canvas/soft/hairline/signal/mute) is a closed contract.
- **Hex fallback per token via `@supports` query.** Rejected per ADR-17.

### Consequences

- **Positive:** Lime ladder is a five-element closed contract; future drift is caught in PR review against the named ladder.
- **Positive:** Migration is incremental — alias buys one slice of breathing room.
- **Negative:** Alias adds one indirection layer in DevTools (resolves to `--d1-accent-lime-signal` then to OKLCH). One-slice cost, then removed.
- **Migration effort:** S (token addition) + M (component re-binding spread across the migration table).
- **Risks:** Alias drift if removal slice is delayed. Mitigation: track in `docs/engineering/TECH_DEBT.md` as a P2 with explicit «remove after PR #86» owner.

### Implementation handoff

Frontend-engineer adds the five tokens immediately after the existing `--d1-bg-input` line in both `theme.css` and `lime-cabin.css`. The legacy `--d1-accent-lime` line is rewritten in place as the alias declaration. Comment banner above the alias documents its temporary status.

---

## 21 · ADR-11 · Purple removal — hard delete with grep-fail-fast CI guard (Option A)

### Decision

**Option A: hard delete.** All occurrences of `--d1-accent-purple`, `--d1-accent-purple-soft`, and any `--d1-purple-*` aliases are removed in a single migration commit. A CI grep guard is added to `.github/workflows/` (or equivalent existing lint pipeline) that fails the build if any of the following patterns reappear in `apps/web/src/`:

```
--d1-accent-purple
--d1-accent-purple-soft
--d1-purple-
```

Grep guard implementation (job step):

```yaml
# .github/workflows/ci.yml — add to existing lint job
- name: Guard against deprecated purple tokens
  run: |
    if rg --quiet -e '--d1-accent-purple' -e '--d1-purple-' apps/web/src; then
      echo "::error::Deprecated purple token reference found. See ADR-11 in docs/design/D1_DEPTH_ARCHITECTURE_v3.md"
      rg -n -e '--d1-accent-purple' -e '--d1-purple-' apps/web/src
      exit 1
    fi
```

(Frontend-engineer chooses the precise CI integration point — existing `pnpm lint` step, dedicated job, or pre-commit hook. The grep pattern is the contract.)

### Rationale

The 30+ existing purple references map across two distinct semantic loads:
1. **Negative on charts** (`--chart-series-3`, `--chart-categorical-3`, treemap negative tiles, stacked-bar highlight). v4 redirects these to `--d1-data-negative` (terracotta `oklch(78% 0.14 25)`).
2. **Brand-primary co-pilot** (CTA fill, accent-deep, premium-chip background, AI mark). v5 redistributes these to lime variants per the role mapping in the lock memo (CTA → `lime-signal`, premium chip → `lime-soft`, AI avatar → `lime-soft` plate + ink glyph, drift indicator → red).

Each role gets a different replacement token. **Aliasing all purple uses to a single replacement (Option B) would silently mis-color every reference**: chart negatives would render lime, AI avatars would render terracotta, etc. The semantic divergence makes a soft-alias actively dangerous.

**Why Option A (CI guard) over Option C (banner only):** purple removal is a one-shot operation with a clear endpoint. The CI guard is six lines of YAML and runs once per PR. Compared to an ongoing comment banner that depends on grep discipline, the CI guard makes regression literally impossible — a stale purple reference fails the build. For a one-shot deletion, this is correct authority/cost ratio.

**Why not soft alias for migration safety (Option B):** soft alias would force a single replacement across heterogeneous semantic uses. There is no single «correct» purple replacement. Hard cut + per-call-site re-binding is the only correct migration. The lock memo's role redistribution table is the authoritative mapping; the grep guard ensures the migration is complete.

### Alternatives considered

- **Option B: soft alias `--d1-accent-purple` → one of the lime variants for transitional safety.** Rejected: see «Why not» above. Heterogeneous semantic loads. Picking any single alias target mis-colors three of the four use cases.
- **Option C: hard delete + comment banner only, no CI guard.** Rejected: relies on grep discipline forever. Cheaper than A in the short term, but a single missed reference at migration-time silently regresses (token resolves to `unset` → browser default → likely white or transparent in unexpected places). The CI guard catches the regression in PR.
- **Replace each purple usage with a hardcoded `unset` / `transparent` and then re-bind incrementally.** Rejected: leaves a transient broken state across 30+ call sites.

### Consequences

- **Positive:** Purple is gone with structural certainty. No silent regressions possible after CI guard lands.
- **Positive:** The role redistribution is explicit at every call site (no «one alias to rule them all» to debug).
- **Negative:** The migration commit is large (~30 call sites in one PR) and must be reviewed atomically.
- **Migration effort:** M (call sites are mechanically findable; per-site re-binding is the cost).
- **Risks:** A new contributor copy-pastes `--d1-accent-purple` from training data or a stale tutorial. Mitigation: CI guard catches it in PR.

### Implementation handoff

Tech-lead decomposes the migration into two slices:
1. **Slice A:** Add lime ladder + status quartet redirect + CI grep guard (token additions only, no removals). CI guard is dormant — no purple references yet to flag because none have been removed.
2. **Slice B:** Per-call-site purple → lime/red/amber re-binding per the lock memo's role redistribution table. CI guard becomes active once any purple is removed; final commit removes the last purple declaration and the CI guard fully bites.

Frontend-engineer pairs with PD on the per-call-site mapping during Slice B.

---

## 22 · ADR-12 · Lime-creep enforcement — selector allowlist (Option D)

### Decision

**Option D: selector allowlist** documented in this ADR + comment banner in `theme.css` + `lime-cabin.css`. The architectural rule is binary: only the following named selectors may bind `--d1-accent-lime-signal`. Anywhere else = architectural violation, caught in PR review.

**Lime-signal allowlist (binding `--d1-accent-lime-signal` is permitted ONLY on these selectors and their direct descendants):**

```
.d1-rail                          /* Provedo signature element */
.d1-rail__line
.d1-rail__tick
.d1-kpi--lookhere                 /* the look-here KPI ring/border */
.d1-kpi--portfolio                /* alias of look-here on dashboard */
.d1-cta--primary                  /* primary CTA fill */
.d1-cta--primary:hover            /* primary CTA hover deepen */
.d1-focus-ring                    /* 2px composite focus ring */
.d1-ai-byline                     /* AI attribution text-link */
.d1-pill--active                  /* active-state inset stroke (ADR-15) */
.d1-segmented__btn--active        /* active-state inset stroke (ADR-15) */
```

Anything else binding `lime-signal` is an architectural violation. The list lives at the top of `theme.css` (and is mirrored in `lime-cabin.css`) as a banner comment so a developer adding a new component sees it on file open.

```css
/*
 * D1 LIME-MONO BRAND — LIME-SIGNAL ALLOWLIST (ADR-12)
 * ─────────────────────────────────────────────────────
 * --d1-accent-lime-signal MAY ONLY be bound on:
 *   .d1-rail / .d1-rail__line / .d1-rail__tick
 *   .d1-kpi--lookhere / .d1-kpi--portfolio
 *   .d1-cta--primary (incl :hover)
 *   .d1-focus-ring
 *   .d1-ai-byline
 *   .d1-pill--active
 *   .d1-segmented__btn--active
 *
 * Hard rules:
 *   ≤ 2 lime-signal events per viewport
 *   ≤ 1 lime-signal per row
 *   ≤ 1 lime stop per card (variants do not compound)
 *
 * Anywhere else binding lime-signal = architectural violation.
 * Reopening the allowlist requires reopening this ADR.
 *
 * Decorative lime borders on generic containers are FORBIDDEN.
 * Use --d1-accent-lime-hairline ONLY inside the four component
 * recipes (.d1-avatar--ai, .d1-chip-premium, .d1-pill--active,
 * .d1-segmented__btn--active, .d1-focus-ring). See ADR-13/14/15.
 */
```

### Rationale

The four enforcement options exist on a tooling-cost / authority spectrum:

| Option | Authoring cost | Authority | Where it bites |
|---|---|---|---|
| A. Documentation discipline | Zero | Low | Code review only |
| B. Custom Biome lint rule | High (~1 day) | High | Compile time |
| C. Visual regression Playwright pixel count | Highest | Highest | CI runtime, slow, brittle |
| D. Architectural selector allowlist | Low | Medium-high | Code review + ADR conformance |

**Option D wins on cost/authority ratio for a small-team + AI-agent maintenance model.**

**Why not B (custom Biome rule):** counting `var(--d1-accent-lime-signal)` per file is straightforward, but the rule misses the *semantic* requirement (≤ 2 per viewport, ≤ 1 per row). The viewport rule is a runtime concept; static analysis cannot prove it. The selector-binding rule (Option D) maps onto a static-checkable artifact (which selectors bind the token), and the viewport budget is enforced via the allowlist's selector count — by design, the allowed selectors are sparse enough that ≥ 3 lime-signal events per viewport requires multiple of them simultaneously, which is naturally rare.

**Why not C (Playwright pixel count):** runtime authority but extremely brittle. A lime-signal stroke at 1px on a 1440px viewport is dozens of pixels — measurement noise dominates. False positives derail the gate.

**Why not A (pure documentation):** insufficient bite for a high-leverage rule. PO has explicitly directed against lime-creep; the ADR + named allowlist is the architectural commitment.

The allowlist is **structural authority**: a PR adding `lime-signal` to a new selector must amend this ADR's allowlist and justify the addition. This is the right friction level. New brand surfaces should be rare; reopening the ADR gates them through review.

**On `lime-hairline`, `lime-soft`, `lime-mute`, `lime-canvas`:** the allowlist applies to `lime-signal` only — the highest-energy variant. The other four variants have wider allowed scope but are still bound primarily inside the named component recipes (ADR-13/14/15). The risk of decorative drift is highest on `lime-signal` because of its visual punch; the other variants are quieter and less prone to misuse.

### Alternatives considered

See table in Rationale.

### Consequences

- **Positive:** Allowlist is a minimum-friction architectural artifact — one comment banner + one ADR section. No tooling.
- **Positive:** ≤ 2-per-viewport and ≤ 1-per-row rules are derivable from the allowlist (the named selectors are sparse enough that natural usage stays within budget).
- **Negative:** Enforcement depends on PR review reading the allowlist. If the team scales beyond «solo human + AI agents», a stylelint rule may need to be added.
- **Migration effort:** S (one banner + one ADR section).
- **Risks:** Banner ignored. Mitigation: PO + Right-Hand call out lime-creep in PR feedback; the ADR exists as the citation artifact.

### Implementation handoff

Frontend-engineer adds the banner to both `theme.css` and `lime-cabin.css` palette blocks. Code-reviewer cites this ADR when flagging out-of-allowlist `lime-signal` bindings.

---

## 23 · ADR-13 · AI avatar component recipe — `.d1-avatar--ai`

### Decision

The AI avatar is bound to a single component selector with a hard-locked recipe:

```css
.d1-avatar--ai {
  background: var(--d1-accent-lime-soft);
  color: var(--d1-text-primary);                      /* ink "P" — NEVER lime */
  font-family: var(--d1-font-mono);
  /* 1px lime hairline INSET — sits inside the avatar disk */
  box-shadow: inset 0 0 0 1px var(--d1-accent-lime-hairline);
  /* radius / size / centering specced by PD */
}
```

**Architectural guards:**

1. The `.d1-avatar--ai` glyph color **must** be `var(--d1-text-primary)`. Filled-lime monograms (`color: var(--d1-accent-lime-*)` on the glyph) are forbidden. Stripe-Dashboard pattern is preserved: AI is co-resident, not a sub-brand.
2. The lime touch is **structural only**: 1px hairline border + soft fill. No filled glyph, no decorative lime ring, no lime-signal anywhere on the avatar.
3. A code-review rule (cited from this ADR): «if `.d1-avatar--ai` selector binds `--d1-accent-lime-signal` OR `color: var(--d1-accent-lime-*)`, that's a brand violation per ADR-13. Reject the PR.»

### Rationale

Brand-strategist + frontend-design converged on the structure-not-color treatment; product-designer was outvoted. The architectural articulation is:

- **Lime carries identity, not entity.** A filled-lime monogram makes AI a *thing* (sub-brand). Ink-monogram makes AI a *role inside the brand* (cohabits with humans on equal footing).
- **Hairline inset border (Linear/Notion 2026 pattern) signals «AI» structurally** without claiming the highest-energy lime token.
- **The glyph is type, not color.** Geist Mono «P» on lime-soft is the brand mark; the lime is the chair, not the person.

The recipe is a single-selector contract. The component exists at one place; the architectural rule attaches there. Lower architectural overhead than abstracting an «avatar atom» that would then need a guard against being parameterized into a filled-lime variant.

### Alternatives considered

- **Lint hint warning if `--d1-accent-lime-*` is bound to `color:` declaration on `.d1-avatar*` selectors.** Rejected: Biome/stylelint custom rule cost exceeds the value. Single-selector inspection via code review is sufficient.
- **Allow filled-lime variant (`.d1-avatar--ai-filled`).** Rejected per BS+FE majority + lock memo.
- **Bind `lime-mute` instead of `lime-soft` for fill.** Rejected: PD spec carries the OKLCH calibration; architect's role is to lock the *role* (soft fill, not signal/mute), not the precise stop. Soft is the chip/avatar/premium-bg semantic per the 5-stop ladder.

### Consequences

- **Positive:** AI avatar is a one-selector contract; brand violation is grep-detectable.
- **Positive:** Lime-creep impossible on AI surfaces — recipe locks it.
- **Migration effort:** S (one component recipe).

### Implementation handoff

Product-designer specs exact dimensions / radius / type weight / line-height. Frontend-engineer implements the recipe in `lime-cabin.css` under a `/* ── AI avatar (ADR-13) ─── */` section comment that cites the ADR.

---

## 24 · ADR-14 · Premium chip component recipe — `.d1-chip-premium`

### Decision

The premium chip is bound to a single selector with hard-locked recipe + typography contract:

```css
.d1-chip-premium {
  background: var(--d1-accent-lime-soft);
  color: var(--d1-text-primary);                      /* ink-deep — NEVER lime */
  font-family: var(--d1-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  box-shadow: inset 0 0 0 1px var(--d1-accent-lime-hairline);
  /* radius / padding / type-size specced by PD */
}
```

**Architectural guards:**

1. The four typography rules — `font-family: var(--d1-font-mono)`, `text-transform: uppercase`, `letter-spacing: 0.06em`, ink color on text — **are part of the architectural contract**, not stylistic preference. Type carries the premium load; color reinforces. Removing any of the four breaks the recipe.
2. No `lime-signal` on premium chips. No filled-lime text. No multi-stop variants (e.g. «extra premium» lime-mute fill) — variants do NOT compound per the lock memo's lime-creep prevention rules.
3. Code-review rule: «if `.d1-chip-premium` is missing any of the four typography rules OR binds `lime-signal` / lime text color, that's a recipe violation per ADR-14.»

### Rationale

3-of-3 specialists converged on type-dominant premium. The architectural articulation:

- **Mono uppercase + tracking is the «premium» signifier** in the editorial-paper register Provedo locked (Field Notes / Letterpress). Lowercase or sans would soften the chip into a generic tag.
- **Lime-soft fill + hairline border carry the «brand-primary touch»** without claiming the signal stop.
- **Type-as-premium is more durable than color-as-premium.** A future re-tune of the lime ladder won't break the premium recipe; a re-tune of the type stack would (and is unlikely without a full design pass).

Locking the typography in CSS — not in a comment, not in a Storybook story — means it's enforced at the rendering level. A consumer can't accidentally drop the uppercase and still call it `.d1-chip-premium`.

### Alternatives considered

- **Make typography optional («minimum recipe» = bg+border, type modifiable).** Rejected: dilutes the brand contract. The premium chip is not a generic chip.
- **Lock typography via CSS custom properties (`--chip-premium-tracking: 0.06em`) so it's tunable.** Rejected: variability surface that doesn't earn its keep. The 0.06em number is a specific design decision, not a knob.
- **Use `lime-canvas` fill for «extra premium» variant.** Rejected: variant compounding violates lime-creep rules. One variant, one recipe.

### Consequences

- **Positive:** Premium chip is recipe-locked. Cannot be diluted by stylistic drift.
- **Positive:** Type-led design is durable across palette re-tunes.
- **Negative:** Adding a new chip variant (e.g. «free tier») cannot use this recipe — must be a separate component.
- **Migration effort:** S.

### Implementation handoff

PD specs the exact type-size / padding / radius. Frontend-engineer implements per the architectural lock.

---

## 25 · ADR-15 · Active-state component recipe — Linear 2026 inset stroke pattern

### Decision

Active state on pills + segmented buttons rebinds to a 1px inset `lime-signal` stroke. Glyph color is **explicitly held at `--d1-text-primary`** — does NOT change on active.

```css
.d1-pill--active,
.d1-segmented__btn--active {
  /* Inset lime-signal stroke — Linear 2026 pattern (FE-design ref).
   * Cleaner than Stripe Dashboard's recoloured-glyph approach. */
  box-shadow: inset 0 0 0 1px var(--d1-accent-lime-signal);
  color: var(--d1-text-primary);                      /* HARD GUARD: no glyph recolor */
  /* background can shift to --d1-bg-card-soft per design lock */
}
```

**Architectural guards:**

1. The glyph color **must remain** `--d1-text-primary` on active state. No `color: var(--d1-accent-lime-*)` on `.d1-pill--active` or its children.
2. The active-state stroke uses `lime-signal` (allowlisted per ADR-12).
3. No transition animation on the stroke. Active is a state, not a motion.
4. Code-review rule: «if `.d1-pill--active` or `.d1-segmented__btn--active` re-colors glyphs, that's an active-state violation per ADR-15.»

### Rationale

The Linear 2026 inset-stroke pattern (FE-design reference) wins over Stripe Dashboard's recolored-glyph because:

- **Glyph stability across state changes preserves text readability.** A glyph that changes color on active forces the eye to re-adapt; an inset stroke leaves the type stable and signals state through chrome.
- **The stroke composes with the existing focus ring contract.** Focus ring lives outside the element; active-state stroke lives inside. They never overlap.
- **The 1px inset matches the hairline+border vocabulary used elsewhere** (avatar inset border, premium chip inset border). Consistency across recipes.

The hard glyph-color guard is critical: a developer accidentally adding `color: var(--d1-accent-lime-mute)` on hover-then-active would create a Stripe-like recolor that dilutes the Linear pattern. The architectural rule is binary: glyphs stay ink.

### Alternatives considered

- **Stripe-style: glyph recolors to `lime-signal` on active.** Rejected per FE-design + lock memo. Glyph stability wins.
- **Solid lime-soft fill on active (no stroke).** Rejected: too heavy; reads as «pressed» not «active». Active state is a *state*, press-tier semantics already cover the click moment.
- **Outline stroke (outside the border).** Rejected: would clash with focus ring at 2px outer.

### Consequences

- **Positive:** Active state is a recipe-locked, glyph-stable visual.
- **Positive:** Composes cleanly with existing focus-ring contract.
- **Migration effort:** S (selector binding + active-state cleanup).

### Implementation handoff

Frontend-engineer adds `.d1-pill--active` and `.d1-segmented__btn--active` blocks to `lime-cabin.css` and `theme.css` (mirror) under `/* ── Active state (ADR-15) ─── */` comments.

---

## 26 · ADR-16 · Status quartet — separate from data delta tokens (no aliasing)

### Decision

The four status tokens (`--d1-status-success` / `--d1-status-error` / `--d1-status-warning` / `--d1-status-info`) and the three data-delta tokens (`--d1-data-positive` / `--d1-data-negative` / `--d1-notification-amber`) are declared as **independent tokens, not aliases**, despite hue-aligned values.

```css
/* Status quartet — system messaging (sync OK, validation, drift, observation) */
--d1-status-success    oklch(82% 0.13 145)   /* matches data-positive hue, MAY drift */
--d1-status-error      oklch(78% 0.14 25)    /* matches data-negative hue, MAY drift */
--d1-status-warning    oklch(82% 0.135 87)   /* matches notification-amber hue, MAY drift */
--d1-status-info       oklch(70% 0.08 240)   /* cool blue-grey — no data-side counterpart */

/* Data delta — chart positives/negatives, gain/loss columns */
--d1-data-positive     oklch(82% 0.13 145)   /* mature pistachio */
--d1-data-negative     oklch(78% 0.14 25)    /* terracotta — L 78 to hold red, NOT salmon */
--d1-notification-amber oklch(82% 0.135 87)  /* count badges — pre-existing token, kept */
```

(Final OKLCH triples are PD's deliverable; values shown above mirror the v4 lock for context.)

**Architectural guard:** status-* tokens MUST NOT be declared as `var(--d1-data-*)` aliases. They start hue-aligned but drift independently.

### Rationale

The temptation to alias is real: the values match. But aliasing couples two semantic axes that have different consumers and different evolution paths.

**Status semantics:** «is the system in a known good state?» — sync indicator, validation result, drift breach alert, info pip. Optimized for in-chrome legibility (small UI elements, pill chips, banner backgrounds). May need a contrast bump on dark canvas; may need a desaturation for a less-loud variant.

**Data delta semantics:** «is the number going up or down?» — chart bars, gain-loss columns, sparkline directions, heatmap polarity. Optimized for chart-readable color (saturation matters for series differentiation; chroma may need to push when a chart has many series).

**The two axes WILL diverge.** A future tweak — e.g. PD bumps `--d1-data-negative` chroma to 0.16 to hold red against a denser chart series — should NOT propagate to `--d1-status-error` (which lives on form-validation messages where 0.16 chroma reads alarmist). Aliasing freezes them together; separate declarations leave the divergence path open.

**Why hue-align them in the first place if they're going to diverge?** Because at this moment they share visual character (gouache triad, amber register). The lock memo's «status-* hue-aligned to data hues» is a *design directive*, not a *token relationship*. The architecture preserves the design directive in the values today while leaving room for tomorrow's tuning.

### Per-pair verdict

| Pair | Current values | Verdict | Reason |
|---|---|---|---|
| `--d1-status-success` ↔ `--d1-data-positive` | 145°, L 82, similar C | **SEPARATE** | Same canvas today, different consumers tomorrow |
| `--d1-status-error` ↔ `--d1-data-negative` | 25°, similar C | **SEPARATE** | (existing values already differ slightly per v3 token block — confirms the divergence pattern is real) |
| `--d1-status-warning` ↔ `--d1-notification-amber` | 87° | **SEPARATE** | Notification-amber is a count-badge token (UI chrome); status-warning is system messaging |

### Alternatives considered

- **Alias status-* to data-* across the board.** Rejected: couples two divergence paths; a single chroma tweak on data-side breaks status-side semantics.
- **Alias only the pair where values are identical (`status-warning` → `notification-amber`).** Rejected: inconsistent rule («sometimes alias, sometimes not») is harder to remember than the binary rule («never alias»).
- **Drop `--d1-notification-amber` entirely; status-warning replaces it.** Rejected: count-badge semantic is real and pre-dates the status quartet. Two tokens, two consumers.

### Consequences

- **Positive:** Each axis can evolve independently. Future PR re-tuning data-positive doesn't side-effect status-success.
- **Positive:** The «hue-aligned today» fact is a design directive in the comment, not a coupling in the code.
- **Negative:** Eight tokens (4 status + 3 data + 1 amber) carry partial value duplication. Acceptable maintenance overhead for the decoupling.
- **Migration effort:** none beyond v4 lock (tokens already declared).

### Implementation handoff

PD specs final OKLCH triples for both groups. Frontend-engineer keeps both groups as independent declarations in `theme.css` + `lime-cabin.css`. Banner comment above the status block states: «status-* MAY drift from data-* over time; do not alias.»

---

## 27 · ADR-17 · Hex fallback strategy — OKLCH-only (Option A), re-affirmed

### Decision

**Option A: OKLCH-only, no hex fallback.** Confirms ADR-4's stance under v4+v5 expanded palette.

The full token surface — surface tokens (6), lime ladder (5), status quartet (4), data delta (3), notification-amber (1), text tokens (3), border tokens (2) — is declared OKLCH-first, no parallel hex declarations, no `@supports` fallback queries.

### Rationale

**Browser support sufficient:** OKLCH is Baseline 2024 (Safari 15.4+ / Chrome 111+ / Firefox 113+ — all ≥ 2 years old at v3 ship time). Global support ~96% per caniuse 2026. Provedo's target market is US + EU on modern browsers (per `project_target_market_2026-05-01.md`); pre-Baseline-2024 browsers are out of scope.

**Token-count discipline:** v4+v5 expanded the palette from ~14 tokens to ~24 tokens. Hex fallback would double the count to ~48. Drift risk grows as token count grows; doubled token count = doubled drift surface.

**Re-tune operations are OKLCH operations.** The 5-stop lime ladder is calibrated by chroma + lightness shifts at fixed hue. Hex hides chroma. A future re-tune (e.g. PD shifts `lime-signal` chroma 0.21 → 0.19 for printed-deck legibility) is one-token-in-place in OKLCH; in hex it's a manual color-picker round-trip.

**No PostCSS auto-fallback (Option C):** PostCSS plugin (e.g. `postcss-oklab-function`) auto-generates fallback at build, which works but adds a build dependency for a fallback we've decided not to invest in. If the cost-benefit ratio shifts (e.g. an enterprise customer with a locked-down browser stack appears), revisit.

**No per-token `@supports` query (Option B):** doubles author cost on every new token; same drift problem as parallel declarations.

### Alternatives considered

- **Option B: hex fallback per token via `@supports (color: oklch(0% 0 0))` query.** Rejected: per-token authoring overhead, drift risk, ~96% support already.
- **Option C: PostCSS plugin auto-generates fallback at build.** Rejected: build dependency for an undermined need; revisit only if enterprise-browser ICP appears.

### Consequences

- **Positive:** Single source of truth per token; no drift surface.
- **Positive:** Re-tune operations stay readable in source.
- **Negative:** Users on pre-Baseline-2024 browsers (~4% globally) see browser-default colors (typically white text on black — harmless degraded mode, never broken-looking).
- **Migration effort:** none (re-affirmation; current state).
- **Risks:** ICP shifts to include legacy enterprise (e.g. Windows IE-mode kiosks). Mitigation: revisit in a dedicated ADR when/if it happens.

### Implementation handoff

No-op. v4+v5 token additions follow the existing OKLCH-first pattern. Frontend-engineer does not introduce hex fallbacks.

---

## 28 · v4 + v5 migration sequence delta

The v3 migration table (§14) is amended with the following additional steps. They sequence into the v3 migration before step 18 (the final cleanup) so the lime-mono brand identity lands inside the same PR (#86) cycle.

| # | Step | File(s) | Visual delta | Notes |
|---|---|---|---|---|
| 14a | Add 5-stop lime ladder tokens (`--d1-accent-lime-canvas` / `-soft` / `-hairline` / `-signal` / `-mute`) | `theme.css`, `lime-cabin.css` | None — tokens declared, alias bridges existing consumers | Slice A of ADR-11 |
| 14b | Rewrite `--d1-accent-lime` as alias to `--d1-accent-lime-signal`; redefine `--d1-accent-lime-soft` to ladder semantic | `theme.css`, `lime-cabin.css` | Visually unchanged — alias preserves signature value | One-slice deprecation marker |
| 14c | Add ADR-12 lime-signal allowlist banner to both palette files | `theme.css`, `lime-cabin.css` | None — comment-only | Architectural guard |
| 14d | Add CI grep guard against `--d1-accent-purple` and `--d1-purple-` patterns | `.github/workflows/*` (or equivalent) | None — guard dormant until purple removed | ADR-11 enforcement |
| 14e | Add `.d1-avatar--ai`, `.d1-chip-premium` recipes (ADR-13, ADR-14) | `lime-cabin.css` | New components render with v5 brand identity | Recipes locked |
| 14f | Add `.d1-pill--active`, `.d1-segmented__btn--active` recipes (ADR-15) | `lime-cabin.css` | Active state shifts from prior color to lime-signal inset stroke | Glyph stability preserved |
| 14g | Per-call-site purple → lime/red/amber re-binding (Slice B of ADR-11) — see role redistribution table in lock memo | `lime-cabin.css`, `theme.css`, `charts.tsx`, `theme.tsx`, `foundation.tsx` | Charts: negatives become terracotta. CTA / accent-deep / cta-shadow: lime-signal. Premium chip / hatched stripe: lime-soft. AI mark: lime-soft + ink. Drift indicator: red. | Largest visual delta in v4+v5 cycle |
| 14h | Remove `--d1-accent-purple` + `--d1-accent-purple-soft` declarations from both files | `theme.css`, `lime-cabin.css` | None — last consumers re-bound in 14g | CI guard now bites |
| 14i | Update `theme.tsx` palette table to reflect lime ladder + status quartet (no purple row) | `design-system/_sections/theme.tsx` | Showcase reflects lime-mono identity | Documentation |
| 14j | (Post-PR-#86) Remove deprecated `--d1-accent-lime` alias once grep returns zero direct consumers | `theme.css`, `lime-cabin.css` | None — alias was a no-op resolution | Final lime taxonomy cleanup |

**Cutover safety:** steps 14a-14f are token + recipe additions only — visually invisible until consumers bind. Step 14g is the largest visual delta and lands as a focused commit. Step 14h is a token deletion that depends on 14g being complete; CI guard catches any miss. Step 14j is post-PR-#86 follow-up and tracked in TECH_DEBT.md.

---

## 29 · v4 + v5 ADR summary

| ADR | Decision | One-line rationale |
|---|---|---|
| ADR-10 | 5-stop lime ladder in `theme.css` + `lime-cabin.css`; legacy `--d1-accent-lime` aliased to `-signal` for one slice | Closed semantic-functional contract; alias buys migration breathing room |
| ADR-11 | Hard delete + CI grep-fail-fast guard for `--d1-accent-purple` (Option A) | Heterogeneous role redistribution makes single-target alias semantically wrong |
| ADR-12 | Selector allowlist for `--d1-accent-lime-signal` (Option D) — banner comment + ADR conformance | Lightest-touch architectural authority; matches solo-human + AI-agent maintenance model |
| ADR-13 | `.d1-avatar--ai` recipe-locked: lime-soft fill + ink «P» glyph + 1px lime-hairline inset | Brand contract: lime carries identity, type carries entity; filled-lime monogram forbidden |
| ADR-14 | `.d1-chip-premium` recipe-locked typography (mono / uppercase / 0.06em / ink color) is part of contract | Type-led premium is durable across palette re-tunes |
| ADR-15 | `.d1-pill--active` + `.d1-segmented__btn--active` use 1px inset lime-signal stroke; glyph color held at `text-primary` | Linear 2026 pattern; glyph stability across state changes |
| ADR-16 | Status quartet declared as separate tokens, NOT aliases of data-delta tokens | Two divergence paths; aliasing freezes them; separate values leave room |
| ADR-17 | OKLCH-only, no hex fallback (Option A — re-affirms ADR-4 under expanded palette) | Baseline 2024 covers ICP; doubled token count = doubled drift surface |

---

*End of architecture brief v3 + v4 + v5. Frontend-engineer consumes this brief alongside product-designer's value spec at `docs/design/D1_DEPTH_SYSTEM_v3.md`.*
