# D1 Depth System — CSS Architecture Brief

**Author:** architect
**Date:** 2026-05-02
**Scope:** how the D1 «deboss-at-rest + Coin & Plate polarity» depth grammar is **organised in code**.
**Out of scope:** *what* the values are. Product-designer authors `D1_DEPTH_SYSTEM.md` (token values, alphas, durations, selector verdicts) in parallel.
**Companion doc:** `C:\Users\rmais\.claude\projects\D--investment-tracker\memory\project_d1_depth_system_2026-05-02.md` (the lock).

---

## 1 · Context

Three independent specialists converged on a depth grammar for D1 «Lime Cabin»: rest-state is **debossed/recessed** via 1px inset hairline pairs, lift-on-interaction is a **single ink-dark drop shadow**, and a Provedo signature emerges from **inverse polarity** between static surfaces (recessed) and interactive surfaces (embossed). The implementation now needs to land across two parallel D1 stylesheets (`style-d1` route + `/design-system` route) without (a) introducing token sprawl, (b) accidentally overriding the lime focus ring, (c) re-introducing layout-bound animation, and (d) mutating the Record Rail signature. This brief defines the structural grammar — token names, file ownership, composition contract, migration sequence — that the value spec from product-designer will plug into. Treat this as the *frame*; product-designer paints the *picture*.

---

## 2 · Architectural decisions

### ADR-1 — Single source of truth for depth tokens (`depth.css` partial), imported by both D1 stylesheets

**Decision.** Create one new file: `apps/web/src/app/style-d1/_lib/depth.css`. It contains **only** depth tokens (no component selectors). Both consumers import it:

- `apps/web/src/app/style-d1/_lib/theme.css` — already exists, scoped `[data-style="d1"]`.
- `apps/web/src/app/design-system/_styles/lime-cabin.css` — already exists, scoped `[data-theme="lime-cabin"]`.

The new file emits tokens under **both** wrapper selectors using a single comma-grouped block. Component-level depth rules (`.d1-kpi { box-shadow: var(--d1-elev-tier1-rest); }`) stay in their existing per-route files because they bind to wrapper selectors.

```css
/* depth.css */
[data-style="d1"],
[data-theme="lime-cabin"] {
  --d1-elev-tier1-rest: ...;
  --d1-elev-tier2-rest: ...;
  /* ... */
}
```

**Rationale.** Token values are the high-churn surface (PO will tune alphas; "make all elevations 30% softer" must touch one file). Component-level binding is the low-churn surface (each selector maps once and rarely changes). Splitting on that axis matches the maintenance gradient. The dual-selector group costs zero — CSS engines fold it.

**Alternatives considered.**
- *(A) Stay dual-write, copy tokens into both files.* Simpler initial diff. **Rejected** — exact thing this depth pass is meant to replace; PO already complained about drift between routes.
- *(B) Move tokens into `packages/design-tokens` (Style Dictionary).* Architecturally cleanest long-term home. **Rejected for this slice** — Style Dictionary is hand-rolled, multi-format build with downstream Tailwind theme coupling; adding 8-12 shadow tokens to it is a separate slice (TD-NNN). Don't block depth pass on token-build refactor.
- *(C) Inline tokens in each component selector.* Zero indirection. **Rejected** — defeats the whole maintenance benefit.

**Trade-off accepted.** Adding `depth.css` introduces one new file the team must remember exists. Mitigated by: clear file header comment + import statement at top of both consumers + single-purpose file (only depth tokens, never grow it past ~80 lines).

**Future TD.** When `packages/design-tokens` grows a third theme key (already noted in `lime-cabin.css` header), depth tokens move there and `depth.css` deletes. Track as **TD-DEPTH-CONSOLIDATE** in `docs/engineering/TECH_DEBT.md`.

---

### ADR-2 — Token naming: `--d1-elev-{tier}-{state}` with explicit polarity in tier name

**Decision.** Adopt the canonical pattern:

```
--d1-elev-{tier}-{state}
```

Where:
- `{tier}` ∈ `tier0` (canvas, no token), `tier1` (recessed/static), `tier2` (embossed/interactive), `tier3` (floating/overlay), `flat` (escape hatch — disclaimer chip + Record Rail explicitly opt out).
- `{state}` ∈ `rest`, `hover`, `active`, `pressed` (active+sustained, e.g. `:checked`), `disabled`.

Polarity (recessed vs embossed) lives **inside the tier number**, not in a separate suffix. Tier 1 is recessed-by-definition; Tier 2 is embossed-by-definition. The «Coin & Plate» polarity is an architectural invariant, not a runtime choice — there is no `--d1-elev-tier1-recessed` vs `--d1-elev-tier1-embossed` because tier 1 is *always* recessed.

**Example tokens (10 names showing the pattern):**

```
--d1-elev-tier1-rest        → static recessed surface, default state (KPI, panel, input)
--d1-elev-tier1-hover       → static recessed, hover (panels rarely take this; reserved)
--d1-elev-tier2-rest        → interactive embossed, default state (CTA, active chip, segmented thumb)
--d1-elev-tier2-hover       → interactive embossed, pointer over (CTA on hover)
--d1-elev-tier2-active      → interactive embossed, mouse-down transient (CTA being clicked)
--d1-elev-tier2-pressed     → interactive embossed, sustained-press (toggle :checked, segmented active)
--d1-elev-tier2-disabled    → interactive embossed, :disabled (flat collapse)
--d1-elev-tier3-rest        → floating overlay (popover, tooltip, dialog) — true outer drop
--d1-elev-focus-ring        → 2px lime ring (canonical focus, composes with any tier above)
--d1-elev-duration-rest-hover, --d1-elev-duration-hover-active, --d1-elev-easing
```

**Rationale.**
- `elev` (elevation) is one syllable shorter than `depth` and is the universal Material/HIG vocabulary; engineers reading the token name guess its meaning correctly first try.
- Tier-as-number (`tier1`, `tier2`) matches the three v2 proposals' shared mental model and reads as a ladder, not a classification matrix.
- State-as-suffix is the established CSS pseudoclass vocabulary (`:hover`, `:active`) — direct mental mapping.
- No polarity word in the name = no temptation to flip polarity per-component (which would dissolve the «Coin & Plate» signature).

**Alternatives considered.**
- *(A) Metaphor names (`--d1-deboss`, `--d1-emboss`, `--d1-lift`).* Brand-correct, evocative. **Rejected** — three problems: (1) couples token name to current creative direction, so a future palette pivot forces a rename; (2) doesn't scale — what's the metaphor for hover-on-disabled?; (3) loses the tier ladder — engineers can't tell at-a-glance that `--d1-emboss` and `--d1-deboss` are siblings, not opposites in the same plane.
- *(B) Component-bound names (`--d1-shadow-card`, `--d1-shadow-button`).* Proposed by frontend-design draft. **Rejected** — coupling tokens to one component class breaks reuse (KPI card and chart panel are both Tier 1; one token, one binding).
- *(C) Numeric only (`--d1-elev-1-0`, `--d1-elev-2-2`).* Material-style. **Rejected** — opaque; requires a legend doc to read.

**Trade-off accepted.** Tier numbers (`tier1`, `tier2`) are mnemonic but lose the brand signal that *static surfaces are recessed*. A new contributor reading `--d1-elev-tier1-rest` won't know without docs that tier 1 is recessed, not embossed. Mitigated by a 6-line header comment in `depth.css` plus the `depth.css` file itself being under 80 lines and trivially scannable.

---

### ADR-3 — Composed tokens via `var()` chain, not duplicated raw values

**Decision.** Tokens compose in two layers:

1. **Atom layer** — primitive shadow declarations (e.g. `--d1-elev-atom-engrave-top`, `--d1-elev-atom-emboss-top`, `--d1-elev-atom-pressed-top`). Atoms are *raw rgba+offset*, never consumed by component selectors.
2. **Recipe layer** — composed `box-shadow` lists referencing atoms (e.g. `--d1-elev-tier1-rest: var(--d1-elev-atom-engrave-top), var(--d1-elev-atom-engrave-bottom);`). Recipes are what component selectors apply.

Component selectors **only** consume recipe-layer tokens, never atoms.

```css
/* atoms — raw values */
--d1-elev-atom-engrave-top:   inset 0 1px 0 0 rgba(0, 0, 0, 0.32);
--d1-elev-atom-engrave-bottom: inset 0 -1px 0 0 rgba(255, 255, 255, 0.04);
--d1-elev-atom-emboss-top:    inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
--d1-elev-atom-emboss-bottom: inset 0 -1px 0 0 rgba(0, 0, 0, 0.20);

/* recipes — what selectors consume */
--d1-elev-tier1-rest:
  var(--d1-elev-atom-engrave-top),
  var(--d1-elev-atom-engrave-bottom);

--d1-elev-tier2-rest:
  var(--d1-elev-atom-emboss-top),
  var(--d1-elev-atom-emboss-bottom);
```

**Rationale.** «Make all engravings 30% softer» = edit two atom values, every recipe inherits. Without atoms, the same alpha appears in 6+ recipes (rest, hover, the lime override, the chip-active stack…) and they drift. Atoms also let edge-case overrides (`.d1-kpi--lime` re-binding the engrave-bottom atom locally) without reaching for `!important`.

**Alternatives considered.**
- *(A) Flat raw-value tokens, no atoms.* Simpler — one indirection. **Rejected** — first time PO says «soften the recessed feel» the engineer hand-edits 4 recipes. Atoms exist precisely to absorb that change.
- *(B) Three-layer (atoms → tiers → variants).* Over-engineered for a 700-line theme.

**Trade-off accepted.** Two-layer indirection costs one extra hop when reading a CSS variable in DevTools. DevTools resolves `var()` chains, so the final computed `box-shadow` is visible; debugging "which atom is wrong" requires one extra click. Acceptable cost for the maintainability gain.

---

### ADR-4 — Reduced-motion handled at `@media` query level, NOT token level

**Decision.** Single `@media (prefers-reduced-motion: reduce)` block in `depth.css` that sets `transition-duration: 0ms` (or `transition: none`) on all components carrying depth transitions. **No** `--d1-elev-tier1-rest-rm` token variant.

The static `box-shadow` value at rest is **identical** with and without reduced motion. Only the transition collapses to instant.

```css
/* depth.css — last block */
@media (prefers-reduced-motion: reduce) {
  [data-style="d1"] [class*="d1-"],
  [data-theme="lime-cabin"] [class*="d1-"] {
    transition-duration: 0ms !important;
  }
}
```

**Rationale.** Reduced motion is a *transition* concern, not a *style* concern. Removing depth entirely under reduced-motion (which a token-variant approach would imply) is the wrong call — reduced-motion users still want the visual hierarchy. Frontend-design proposal §6.3 nailed this: "we do NOT remove depth in reduced-motion — depth is a static property of the surface, not a motion. Removing only the transition is the SOTA call."

**Alternatives considered.**
- *(A) `--d1-elev-tier2-hover-rm: var(--d1-elev-tier2-rest);` token mirrors.* Token sprawl × 2 with no signal benefit.
- *(B) Per-component `@media` blocks.* Scattered, easy to miss when adding a new component.

**Trade-off accepted.** The `[class*="d1-"]` attribute selector has slightly higher specificity cost than a class-list. Verified safe — D1 is route-scoped so the selector only walks ~50 nodes.

---

### ADR-5 — Compose, don't override: existing `:hover` rules upgrade in-place

**Decision.** No existing `:hover` selector is **replaced** wholesale. Each existing hover rule (`.d1-cta:hover`, `.d1-pill:hover`, `.d1-chip:hover`, `.d1-kpi:hover`, `.d1-nav__icon-pill:hover`, `.d1-segmented__btn:focus-visible`) is **augmented** by adding `box-shadow: var(--d1-elev-tier{N}-hover);` next to its existing declarations.

Existing background-color and color changes in hover state are **preserved as-is** — they remain the primary identity signal; depth lift is layered on top.

```css
/* BEFORE */
[data-style="d1"] .d1-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
}

/* AFTER */
[data-style="d1"] .d1-pill:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--d1-text-primary);
  box-shadow: var(--d1-elev-tier2-hover);  /* added line */
}
```

**Rationale.** Replacing existing hovers risks losing micro-decisions (`.d1-chip--active:hover` strengthens the lime hairline alpha 0.4 → 0.6 — that signal must survive). Augmentation is mechanically safe, reviewable as a green diff, and can be smoke-tested per selector.

**Alternatives considered.**
- *(A) Replace all hover rules with template lifted from depth grammar.* Faster diff to write. **Rejected** — destroys per-component micro-decisions (lime hairline strengthening on chip-active hover, color change on pill hover); regression risk too high.
- *(B) Move depth into a new `:where()` rule that applies to all `.d1-*[interactive]` elements.* Clever specificity hack. **Rejected** — invents an attribute (`[interactive]`) the markup doesn't carry; needs DOM changes; specificity-zero `:where()` makes overrides confusing.

**Trade-off accepted.** Augmenting means existing hover rules now have two responsibilities (color/bg + depth). Acceptable because the existing rules are short (≤4 declarations each); merging is more readable than splitting.

---

### ADR-6 — Layered `box-shadow` ordering contract: focus-ring outermost, lift outer middle, emboss innermost

**Decision.** When multiple shadows compose on one element, the canonical **stacking order** is (top of CSS list → bottom):

1. **Focus ring** (`0 0 0 2px var(--d1-accent-lime)`) — declared first, paints last (= on top, as required).
2. **Outer lift** (drop shadow on hover/active for Tier 2 / Tier 3) — middle.
3. **Inner emboss/engrave** (the atom pair) — declared last, paints first (= bottom).

CSS paints `box-shadow` layers **back-to-front in reverse list order** (first listed = outermost on top), so this declaration order produces correct layering.

The focus ring lives in its own token (`--d1-elev-focus-ring`) and is composed at component level only when the component takes focus (`:focus-visible`).

```css
.d1-cta:focus-visible {
  box-shadow:
    var(--d1-elev-focus-ring),    /* lime ring — outermost */
    var(--d1-elev-tier2-rest);    /* emboss — innermost */
  outline: 0;
}
```

**Rationale.** Without a documented ordering contract, the next contributor will randomly stack shadows and break the focus ring (most common D1 a11y regression risk). Codifying order solves it. The `outline` property is preserved as the **default** focus mechanism (cheap, layer-independent, can't conflict with box-shadow). The composed-shadow-as-focus-ring variant is reserved for the **lime CTA** case where lime-on-lime makes `outline` invisible (frontend-design §5.2 covered this).

**Alternatives considered.**
- *(A) Always use `outline` for focus, never `box-shadow`.* Simpler. **Rejected** — fails the lime CTA case (lime outline on lime button = invisible).
- *(B) Use CSS `--d1-shadow-stack: var(--ring), var(--lift), var(--emboss)` super-token.* Composes everywhere. **Rejected** — every component has a different mix of those three; a single super-token forces all-or-nothing.

**Trade-off accepted.** Engineers must remember the ordering rule. Mitigated by a comment block at top of `depth.css` and an explicit example in the lime-CTA selector.

---

### ADR-7 — `prefers-contrast: more` adds a stronger atom variant; gracefully no-op otherwise

**Decision.** Add a single `@media (prefers-contrast: more)` block in `depth.css` that re-binds the **engrave-top** and **emboss-bottom** atoms to higher-alpha values (e.g. 0.32 → 0.50, 0.20 → 0.32). Recipes inherit automatically.

```css
@media (prefers-contrast: more) {
  [data-style="d1"],
  [data-theme="lime-cabin"] {
    --d1-elev-atom-engrave-top:   inset 0 1px 0 0 rgba(0, 0, 0, 0.50);
    --d1-elev-atom-emboss-bottom: inset 0 -1px 0 0 rgba(0, 0, 0, 0.32);
  }
}
```

**Rationale.** PO didn't ask for it; it's free hygiene per `web/security.md` + a11y guidance. The atom-layer architecture makes it almost free to ship. WCAG 2.2 AAA users running `prefers-contrast: more` get visible bevels (the 4-6% white atoms are too soft for them today and will read as flat).

**Alternatives considered.**
- *(A) Skip until requested.* YAGNI. **Considered, but rejected** — atom layer makes the addition 4 lines of CSS; not implementing it means the next a11y review surfaces it as a finding.

**Trade-off accepted.** Two extra atom variants in production CSS that ~5% of users see. Negligible bytes (< 200 chars).

---

### ADR-8 — Backward-compat: chart-panel modifiers inherit from base; no per-modifier depth duplication

**Decision.** `.d1-chart-panel` (base) carries `--d1-elev-tier1-rest` once. The 9 chart-variant modifiers (`.d1-chart-panel--bar`, `--waterfall`, `--donut`, `--calendar`, `--stacked-bar`, `--treemap`, `--spark-up/down/flat`, `--line-default/highlighted`, `--area-default`) **inherit** without re-declaration. Each modifier overrides only the chart-internal CSS-vars (`--accent`, `--card-highlight`, etc.) it already does today.

`.d1-bg-card-soft` (the existing «hover-lifted surface variant») is **kept**, but its meaning is reframed: it's the *raised-tone-step* (not depth-via-shadow). It composes with Tier 2 emboss on hover targets that need both (e.g. `.d1-pill:hover` already shifts background; depth lift adds on top).

**Rationale.** Composability test from §7.3 — adding `.d1-toast` tomorrow should require zero changes to existing modifiers. Inheritance from `.d1-chart-panel` base means new chart variants land with depth automatically. `--d1-bg-card-soft` is independent semantic (luminance) from depth (shadow); they compose orthogonally.

---

## 3 · Token taxonomy — full naming convention

```
--d1-elev-{tier}-{state}                    # recipe, what selectors consume
--d1-elev-atom-{role}-{position}            # atom, what recipes compose
--d1-elev-{name}                            # specials (focus-ring, easing, durations)
```

**Reserved tier values:** `tier0` (no token), `tier1`, `tier2`, `tier3`, `flat` (opt-out marker).

**Reserved state values:** `rest`, `hover`, `active`, `pressed`, `disabled`.

**Reserved atom roles:** `engrave` (recessed polarity), `emboss` (raised polarity), `pressed` (sunken interactive), `lift` (outer drop for tier 2 hover), `floating` (outer drop for tier 3).

**Reserved atom positions:** `top`, `bottom` (for inner hairlines); blur-and-spread for outer drops live in a single atom (e.g. `--d1-elev-atom-lift`).

**10 example token names showing the pattern:**

```
--d1-elev-atom-engrave-top
--d1-elev-atom-engrave-bottom
--d1-elev-atom-emboss-top
--d1-elev-atom-emboss-bottom
--d1-elev-atom-lift
--d1-elev-tier1-rest
--d1-elev-tier2-rest
--d1-elev-tier2-hover
--d1-elev-tier2-pressed
--d1-elev-focus-ring
```

**Anti-pattern names (don't introduce):**
- `--d1-shadow-*` (collides with chart shadow tokens already in `globals.css`).
- `--d1-elev-card`, `--d1-elev-button` (component-bound; breaks reuse).
- `--d1-deboss`, `--d1-emboss-soft`, `--d1-lift-1` (metaphor-bound; brittle to creative-direction pivot).
- `--d1-elev-recessed-rest` (polarity in name; tempts polarity flips).

---

## 4 · File layout proposal

| File | Status | Responsibility |
|---|---|---|
| `apps/web/src/app/style-d1/_lib/depth.css` | **NEW** | Depth atoms + recipes + reduced-motion + prefers-contrast. Dual-scoped to `[data-style="d1"], [data-theme="lime-cabin"]`. **Tokens only — no component selectors.** Target ≤ 80 lines. |
| `apps/web/src/app/style-d1/_lib/theme.css` | **EDIT** | Existing — add `@import "./depth.css";` at top. Add `box-shadow: var(--d1-elev-tier{N}-{state});` lines to existing component selectors (~15 selectors touched). |
| `apps/web/src/app/design-system/_styles/lime-cabin.css` | **EDIT** | Existing — add `@import "../../style-d1/_lib/depth.css";` at top (relative path from `_styles/` to `style-d1/_lib/`). Add `box-shadow: ...` lines to mirror selectors. |
| `apps/web/src/app/style-d1/layout.tsx` | **NO CHANGE** | Already wires `[data-style="d1"]` wrapper. |
| `apps/web/src/app/design-system/layout.tsx` | **NO CHANGE** | Already wires `[data-theme="lime-cabin"]` wrapper. |
| `apps/web/src/app/globals.css` | **NO CHANGE** | Depth tokens are D1-scoped, not global. |
| `packages/design-tokens/tokens/primitives/shadow.json` | **NO CHANGE** | Existing chart shadow tokens are unrelated. Future TD-DEPTH-CONSOLIDATE may move depth atoms here. |

**Why a route-relative `@import` from `lime-cabin.css` to `style-d1/_lib/depth.css` is acceptable:** Next.js with Turbopack resolves relative CSS imports via PostCSS in both routes. Verified pattern — the existing `lime-cabin.css` already states (header) it's a «second-home of the post-fix-pass token block» so cross-route reference is in scope.

**Alternative considered for cross-route import path:** alias `@/` import (`@import "@/app/style-d1/_lib/depth.css";`). Tailwind v4 + `@import` aliases work but add a config dependency. Plain relative import is simpler and self-documenting.

---

## 5 · Composition diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                   depth.css (NEW, dual-scoped)                      │
│                                                                     │
│   [data-style="d1"], [data-theme="lime-cabin"] {                    │
│                                                                     │
│     ATOM LAYER ← raw rgba+offset, never read by selectors           │
│       --d1-elev-atom-engrave-top                                    │
│       --d1-elev-atom-engrave-bottom                                 │
│       --d1-elev-atom-emboss-top                                     │
│       --d1-elev-atom-emboss-bottom                                  │
│       --d1-elev-atom-lift, --d1-elev-atom-floating, ...             │
│                  │                                                  │
│                  ▼                                                  │
│     RECIPE LAYER ← what component selectors consume                 │
│       --d1-elev-tier1-rest    = atom-engrave-top, atom-engrave-bot  │
│       --d1-elev-tier2-rest    = atom-emboss-top,  atom-emboss-bot   │
│       --d1-elev-tier2-hover   = recipe-tier2-rest, atom-lift        │
│       --d1-elev-tier2-pressed = atom-pressed-top, atom-pressed-bot  │
│       --d1-elev-tier3-rest    = atom-floating                       │
│       --d1-elev-focus-ring    = 0 0 0 2px <lime>                    │
│   }                                                                 │
│                                                                     │
│   @media (prefers-reduced-motion: reduce) { transition-duration:0; }│
│   @media (prefers-contrast: more)         { atoms re-bind stronger; }│
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │  consumed by
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  theme.css (EDIT)         │  lime-cabin.css (EDIT)                  │
│                           │                                         │
│  [data-style="d1"]        │  [data-theme="lime-cabin"]              │
│   .d1-kpi { box-shadow:   │   .d1-kpi { box-shadow:                 │
│     var(--d1-elev-tier1-  │     var(--d1-elev-tier1-rest); }        │
│     rest); }              │   .d1-cta { box-shadow:                 │
│   .d1-cta { box-shadow:   │     var(--d1-elev-tier2-rest); }        │
│     var(--d1-elev-tier2-  │   .d1-cta:hover { box-shadow:           │
│     rest); }              │     var(--d1-elev-tier2-hover); }       │
│   ... 13 more selectors   │   ... mirror 13 selectors               │
└─────────────────────────────────────────────────────────────────────┘
```

**Stacking order at `:focus-visible` (worst-case composition):**

```
.d1-cta:focus-visible {
  box-shadow:
    var(--d1-elev-focus-ring),       ← outermost (paints on top)
    var(--d1-elev-tier2-hover);      ← middle (lift atoms inside this recipe)
                                       innermost atoms (engrave/emboss inset)
                                       paint at the bottom of the stack
}
```

---

## 6 · Migration sequence (no intermediate broken state)

Each step is **independently revertable**. Land in ≤ 2 PRs, ideally 1.

1. **Create `depth.css`** with all atoms + recipes + media queries. Zero component bindings yet. Verify no visual change on either route (defensive — only tokens defined).
2. **Add `@import "./depth.css";`** to top of `theme.css`. Verify no visual change.
3. **Add `@import "../../style-d1/_lib/depth.css";`** to top of `lime-cabin.css`. Verify no visual change.
4. **Apply Tier 1 rest** to static surfaces in `theme.css` first (`.d1-kpi`, `.d1-panel`, `.d1-chart-panel` if route uses it, `.d1-input`-equivalents, `.d1-disclaimer-chip` *only if* product-designer's spec puts it on Tier 1; if PD spec keeps it flat per the lock memo, skip). Smoke-test the canonical `/style-d1` route.
5. **Mirror Tier 1** to the same selectors in `lime-cabin.css`. Smoke-test `/design-system`.
6. **Apply Tier 2 rest** in both files (`.d1-cta`, `.d1-pill--active`, `.d1-chip--active`, `.d1-segmented__btn--active`, `.d1-nav__brand`, `.d1-nav__avatar`).
7. **Augment Tier 2 hovers** in both files — append `box-shadow: var(--d1-elev-tier2-hover);` to existing `:hover` rules. **No deletion of existing color/bg changes.**
8. **Add Tier 2 active/pressed** rules where they didn't exist before (most components don't have `:active` today).
9. **Apply Tier 3** to popover/tooltip/dialog **only when those components ship** (none in canonical preview yet — defer).
10. **Visual regression** — Playwright screenshots at 320 / 768 / 1440 on both routes, before vs after.
11. **Reduced-motion smoke test** — toggle DevTools `prefers-reduced-motion: reduce`, confirm hover lift collapses to instant but rest emboss persists.

**Cutover order rationale:** tokens-without-bindings are inert; static surfaces (Tier 1) before interactive (Tier 2) because Tier 1 is the bigger visual change PO is asking for and easiest to A/B; hovers last because they're additive to existing rules.

**Rollback path:** any step can be reverted by removing the `box-shadow` lines (or by unsetting `--d1-elev-*` to `none` in a one-line override block). Tokens-only `depth.css` import is harmless if no consumer references the tokens.

---

## 7 · Future-extensibility test

### Test A — adding `.d1-toast` tomorrow

A new toast notification component lands. Decision rule for the engineer:

1. Is it static (data-display) or interactive (clickable/dismissible)? → toast is interactive (dismiss button + auto-hide).
2. Does it float above content? → yes, toasts overlay.
3. → **Tier 3 «floating»**. Apply `box-shadow: var(--d1-elev-tier3-rest);`. Done. No new tokens. No `depth.css` edit.

If the toast had been a static inline banner (no float, no dismiss) — Tier 1.

### Test B — D2 parallel theme with different depth values

A future D2 theme with completely different elevation language ships. Required changes:

1. `D2` adds its own theme file (e.g. `apps/web/src/app/style-d2/_lib/theme.css`, scoped `[data-style="d2"]`).
2. `D2` either (a) creates its own `_lib/depth.css` with `--d2-elev-*` tokens scoped to `[data-style="d2"]`, or (b) keeps the *same* token names (`--d1-elev-*`) but rebinds them inside its scope.

**Recommended path: (a)** — separate `--d2-elev-*` tokens. Reasons:
- Tokens are part of the theme contract; same name across themes implies same semantics, which may not hold (D2 might be flat-only with no recessed concept).
- Easier search-and-replace if D2 forks D1 and diverges.
- Avoids cross-theme cognitive load.

**Trade-off:** if both themes coexist on one page (unlikely but possible — A/B preview), duplicated tokens cost ~4KB. Negligible.

### Test C — PO says «make all elevations 30% softer»

1. Open `depth.css`.
2. Edit ~4 atom-layer values (engrave-top, emboss-top, engrave-bottom, emboss-bottom alphas — multiply by 0.7).
3. Done. All recipes inherit. Both routes update simultaneously.

**Files touched:** 1.
**Selectors touched:** 0.
**Risk:** low (atom-layer changes are pure scalar tweaks).

### Test D — adding `.d1-skeleton` (loading shimmer)

Skeleton needs flat surface, no depth. Decision rule:
1. Apply `box-shadow: none;` explicitly (don't rely on inheritance — `.d1-skeleton` may sit inside a Tier 1 wrapper that shadows it).
2. No new token. The existing `--d1-elev-flat` opt-out marker is used by the disclaimer chip; skeleton can do the same: `box-shadow: var(--d1-elev-flat); /* = none */`.

Or simply `box-shadow: none;`. Either is fine — `--d1-elev-flat` exists for documentary intent ("this is intentionally opt-out, not forgotten").

---

## 8 · Performance + a11y guardrails

### Compositor-only

The architecture binds depth to `box-shadow` — a paint-but-not-layout property. **No** rule introduces `top`, `left`, `width`, `height`, `padding`, `margin`, `border-width`, or `font-size` in transitions. The `transform: translateY(-1px)` in product-designer's spec is also compositor-only. No additional architecture safeguards required; lint rule (TD: add stylelint rule banning `transition: ... width|height|top|left|margin|padding`) can be added later.

### Focus ring composition

ADR-6 makes the stacking order explicit. The existing `outline: 2px solid var(--d1-accent-lime)` rule on most selectors is preserved unchanged. Only `.d1-cta:focus-visible` (lime-on-lime) needs the box-shadow-based focus ring variant.

### `prefers-reduced-motion`

Single `@media` block in `depth.css` (ADR-4). Centralised. One file to grep for the next contributor.

### `prefers-contrast: more`

Single `@media` block in `depth.css` (ADR-7). Free hygiene.

### AAA contrast

The depth bevels are decorative pixels (4-32% black/white at 1px); they never carry text. Existing measured contrast ratios (15.9:1 / 5.9:1 / 15.4:1) are unaffected. Architecture imposes no constraint that conflicts with contrast measurement.

---

## 9 · Backward compatibility

### Chart panels (9 modifiers)

Per ADR-8: `.d1-chart-panel` base gets `--d1-elev-tier1-rest`; modifiers inherit. The chart panel currently has `border: 1px solid var(--d1-border-hairline)` (in `theme.css`) and `box-shadow` overrides for embedded chart tooltips (`!important` rules in `lime-cabin.css` lines 1554, 1648, 1770, 1877). Those tooltip overrides are scoped to descendant selectors, **don't conflict** with the panel's own `box-shadow`.

**Recommendation for chart panels:** keep the existing `border: 1px solid var(--d1-border-hairline)` for now. The Tier 1 inset emboss adds depth without removing the border — they compose. Product-designer may later choose to delete the border in favour of pure-emboss framing (frontend-design proposal §7.1 suggested this); that's a follow-up decision, not a blocker for the depth pass.

### `.d1-bg-card-soft` (existing tone-step)

Kept. Reframed as the *raised-luminance-step* (semantic: «slightly brighter surface»), independent of depth shadow. Hover rules that change `background: var(--d1-bg-card-soft)` continue working unchanged, with depth shadow added on top.

### Existing focus-ring rules

`outline: 2px solid var(--d1-accent-lime); outline-offset: 2px-3px` rules are preserved. ADR-6 explicitly carves out a box-shadow-based variant only for the lime-CTA case; other components stay on `outline`.

### `.d1-disclaimer-chip` lock

Per the lock memo: chip is **flat / out of the depth system entirely**. Architecture supports this via `--d1-elev-flat` (= `none`) opt-out, OR by simply not adding `box-shadow` to `.d1-disclaimer-chip` selector. **Recommendation:** explicitly write `box-shadow: var(--d1-elev-flat);` on the chip selector — communicates intent ("this opted out, didn't forget").

### Record Rail

Per the lock memo: rail stays flat, never debossed. Architecture adds no rule to `.d1-rail*` selectors. No-op preserves the signature.

---

## 10 · Open questions for product-designer

These are NOT architectural decisions — they need value-spec authority from product-designer to resolve:

1. **`.d1-disclaimer-chip` opt-out marker style.** Architecture supports both «no `box-shadow` declared» and «explicit `box-shadow: var(--d1-elev-flat);`». PD spec should specify which (recommended: explicit, for documentation value).

2. **Chart-panel border-vs-emboss.** Architecture supports keeping the existing 1px hairline border alongside Tier 1 emboss (they compose), OR deleting the border in favour of emboss-only framing (frontend-design §7.1). Visual call.

3. **`.d1-kpi--lime` lime-on-lime override.** Atom-layer architecture supports it cleanly (`.d1-kpi--lime { --d1-elev-atom-engrave-top: ...; }` rebinds locally). PD spec must specify the rebind values — both product-designer §6.4 and brand-strategist §5 row 3 noted lime-on-lime needs different values; final numbers are PD scope.

4. **Lime CTA `:focus-visible` ring composition.** Frontend-design §5.2 proposed a 2-step ring (canvas spacer + lime outer) inside `box-shadow`. ADR-6 supports this pattern via `--d1-elev-focus-ring` — but the spec should clarify whether the CTA gets a special focus-ring token (e.g. `--d1-elev-focus-ring-on-lime`) or composes spacer+lime inline.

5. **Tier 3 timeline.** Tier 3 (floating overlays) is in the architecture but no consumer ships in the canonical preview. Either include the recipe now (~3 lines, harmless) or defer to when the first popover lands. Recommendation: include now.

---

## 11 · Implementation handoff

Frontend-engineer receives:

1. **This brief** (`docs/design/D1_DEPTH_ARCHITECTURE.md`) — structural grammar.
2. **Product-designer's value spec** (`docs/design/D1_DEPTH_SYSTEM.md`, parallel-authored) — exact alphas, durations, selector verdicts.
3. **Lock memo** (`memory/project_d1_depth_system_2026-05-02.md`) — non-negotiable design positions.

Implementation order matches §6 migration sequence. PR scope target: **single PR**, ≤ 350 LOC diff.

---

*End — `D1_DEPTH_ARCHITECTURE.md`*
