# D1 «Lime Cabin» Depth System — Architecture Brief v3

**Author:** architect
**Date:** 2026-05-02
**Status:** Architectural lock — supersedes `D1_DEPTH_ARCHITECTURE.md` (v2, archived).
**Scope:** CSS architecture for the v3 depth grammar. Token taxonomy, file layout, composition strategy, migration sequence, future-extensibility tests, anti-pattern enforcement.
**Pairing:** Composes with product-designer's value spec at `docs/design/D1_DEPTH_SYSTEM_v3.md` (parallel-track). Frontend-engineer consumes both.

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

*End of architecture brief v3. Frontend-engineer consumes this brief alongside product-designer's value spec at `docs/design/D1_DEPTH_SYSTEM_v3.md`.*
