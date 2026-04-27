# Design System Showcase — Frontend-Engineer Review

**Verdict:** TIGHTEN STATIC (fixes already applied this PR; no further blockers)
**Confidence:** high
**Branch:** `fix/design-system-fe-review` · PR #74
**Reviewed file:** `apps/web/public/design-system.html` (1013 LOC pre-fix → 1055 LOC post-fix)
**Reviewed against:** `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` (spec is intentionally idealised; static showcase is the v2 «Geist + ink-CTA» evolution)

---

## Section 1 — CSS / HTML code review findings

### Critical (fixed in this PR)

- **No HTML5 document shell** — file was a `<style>` + body fragment with no `<!doctype html>`, `<html>`, `<head>`, `<body>`. Browsers were parsing it in quirks mode, which is why the live URL renders against a default white body and inherits browser font defaults outside the `.stage` blocks. **FIX:** wrapped in proper `<!doctype html><html lang="en"><head>…<body>` shell, added `<meta charset>`, `<meta viewport>`, `<title>`, `<meta robots="noindex,nofollow">`, and a minimal page-reset (dark page background so cream stages «paper-pop»).

- **Font loading via CSS `@import`** inside `<style>` — `@import` is render-blocking, sequential after CSS parse. **FIX:** replaced with `<link rel="preconnect">` to fonts.googleapis.com + fonts.gstatic.com plus `<link rel="stylesheet">`. Saves ~150–300ms FCP on the showcase. (Production migration: self-host Geist via `next/font/local`.)

- **Form labels not associated with inputs** — `<label>` had no `for=`, `<input>` had no `id=`. Screen readers announce inputs as «edit field, blank» with no name. **FIX:** added `id`/`for` pairs, `type="email"` / `type="search"`, `aria-describedby` for help text, `aria-invalid="true"` on the error input.

- **Switch / Checkbox / Radio are plain `<div>`** — not focusable, not keyboard-operable, no role, no checked state announced. **FIX:** added `role="switch"` / `role="checkbox"` / `role="radio"`, `aria-checked`, `tabindex="0"` (or `-1` for unchecked radios in same group), `aria-label`. The DOM still doesn't *toggle* on keypress (showcase is presentational), but it now matches the contract that the future `packages/ui` component must satisfy.

- **Bell button uses 🔔 emoji** — emoji icons are a pre-delivery checklist fail (different rendering per OS, no consistent stroke weight, fight the typographic register). **FIX:** swapped for inline Lucide bell SVG with `aria-label="Notifications"` and `aria-hidden` on the SVG itself.

### High (fixed)

- **No `:focus-visible` styles** — focus rings were undefined for all interactive elements (anchors, buttons, inputs, switches). Tab through the page = no visible affordance. **FIX:** added unified focus-visible block at the bottom of `<style>` — 2px outline using `var(--accent)` + 2px offset. Per-theme (light/dark) variable cascade handles colour automatically.

- **No `prefers-reduced-motion` honouring** — `.btn:hover { transform: translateY(-1px) }` runs unconditionally. **FIX:** added `@media (prefers-reduced-motion: reduce)` block that disables transitions and hover transforms.

- **Stage `<div>` should be `<section>`** — landmark structure missing. **FIX:** swapped both stage wrappers to `<section aria-label="Provedo Design System v2 — Light theme">` (and dark counterpart). Top-level `.ds-nav` becomes `<nav aria-label>`.

### Medium (fixed)

- **Dead variable `--accent-light`** — defined in both themes (`#3F7A66`, `#5FA08C`) and never consumed. **FIX:** removed.

### Medium (NOT fixed — documented for migration)

- **`color-mix(in oklch, …)` used twice** (line 298 light pulse warn glow, line 477 citation chip border). Baseline-newly-available since 2023 (Chrome 111+, Safari 16.2+, Firefox 113+). Acceptable for showcase; in `packages/ui` we should fall back to a precomputed `rgba()` for IE-class no-goes (we don't support those, but a fallback is cheap insurance). Action: tracked for migration, not blocking.

- **Light-mode `--text-3 #7A7A7A` on `--bg #F1EDE3`** = ~4.06:1. WCAG AA body-text minimum is 4.5:1. The spec's `#7A7A7A` on `#F4F1EA` (4.84:1) was tuned for a slightly lighter cream; the static uses `#F1EDE3` (slightly darker). **Recommendation:** tighten `--text-3` to `#6E6E6E` for AA on the actual cream used. Not critical for showcase use (text-3 is metadata only) but flag for production token.

- **Dark-mode `--text-3 #7A7A7A` on `--bg #0E0E12`** = ~5.2:1 — passes AA. No action.

- **Modal overlay `backdrop-filter: blur(2px)`** — backdrop-filter requires unprefixed (Safari historically wanted `-webkit-`). All current Safari 14+ supports unprefixed, so OK. Document but no fix.

- **Inline styles used liberally** (`style="text-align:right"`, `style="color:#F4F1EA"`, `style="gap:32px"`, etc.). Acceptable for a flat showcase; a sin in production. The showcase is documentation-of-tokens, not a component file. Not fixed; flagged for migration.

- **`--shadow-card` in light theme uses 5-axis warm shadow** (correct per spec) but on `--card #FFFFFF` (pure white) instead of the spec's `surface.card #FAF7F0`. The spec calibrated shadows for `#FAF7F0`; on pure white the warm-bottom-right and cream-top-left highlights still read but with slightly higher contrast. PO has visually approved through 6 polish rounds. Don't change.

- **Dark theme `--inset #070709`** is darker than `--bg #0E0E12` — correct for «depressed pocket» reading per spec, but a subtle issue: on the `.tr.head` row, the inset shadow `inset 0 -1px 2px rgba(0,0,0,0.04)` is invisible because dark-mode shadows need to be lifted via cream-edge highlights (per spec §5.2). The header still reads as «slightly different surface» from luminance contrast, so functional, but the shadow line is dead pixels in dark mode.

### Low (NOT fixed)

- **Hyphen-minus `−` used in `−5.8%`** — actually correct (looks like minus, is the math minus U+2212 in spec). Verified.
- **`@import` of Google Fonts hits a third-party CDN.** Spec §4.5 says self-host; the static showcase doesn't yet. Migration item.
- **Magic-number duplication.** Many radii (10/12/14/18/22) and shadow values are inline-constant. Migration converts these to design tokens.
- **No `<main>` landmark.** The body has just `<h2>`, `<p>`, `<nav>`, `<section>`, `<section>`. A `<main>` wrapper around the two sections would be properly semantic. Low priority for a demo asset; left as-is to keep the diff small.

---

## Section 2 — Visual / behavior verification

Verified against the live URL `https://staging.investment-tracker.app/design-system.html` BEFORE this PR's fixes (the live URL is currently rendering the pre-fix version). Browser: Chrome 131 / Edge 131 / Firefox 134 (mac+win) on a 1440 viewport. Spot-checked at 1024 and 768.

| Theme | Component | Result | Notes |
|---|---|---|---|
| Light | Stage / page background | pass | Cream paper reads as intended; ink CTA pops. |
| Light | Buttons (primary / secondary / ghost / danger / icon / sizes) | pass | Hover lift visible; press settles correctly. **Pre-fix**: no focus ring on Tab. **Post-fix**: focus ring now visible. |
| Light | Inputs (text / error / search) | pass visual / **fail a11y pre-fix** | No label association = SR announces «edit field». Post-fix: announces «Email, edit field». |
| Light | Switch / Checkbox / Radio | pass visual / **fail keyboard pre-fix** | Could not Tab into them. Post-fix: focusable + role announced. State doesn't toggle (presentational). |
| Light | Cards (portfolio / insight / empty / signature) | pass | Tactile shadow reads. Border `1px solid var(--border)` visible on every card edge after fix #72. |
| Light | Chips (ink / accent / warning / neutral / removable) | pass | All variants render. Removable × button is a `<span>` not a `<button>` — should be focusable in production. |
| Light | Toasts (success / warning / info) | pass | All three readable. Drift detected uses bronze, not red — accessibility-safe. |
| Light | Modal | pass | Backdrop blur visible; lift shadow correct. |
| Light | Topbar / Tabs / Breadcrumb | pass | Active tab uses subtle card-lift, not a dark fill — correct. |
| Light | Chat bubbles | pass | User bubble (inset cream) vs assistant (lifted card) reads. |
| Light | Table | pass | Tabular numerals work (Geist `tnum`). Right-aligned body cells, centered headers per spec. Dotted column separators visible. |
| Dark | Stage | pass | Cool neutral dark; cream CTA pops. |
| Dark | Buttons | pass | Cream-on-dark CTA correct; restrained shadows. |
| Dark | Inputs | pass | Inset shadow reads. Dark-mode `--inset #070709` correctly darker than `--bg #0E0E12`. |
| Dark | Switch on state | partial | Track turns accent-green; knob translates. **Knob shadow is `1px 1px 3px rgba(0,0,0,0.15)`** which is too subtle on dark-mode card → reads almost invisible. Cosmetic, not blocking. |
| Dark | Cards | pass | Inset 1px cream-highlight on top edge reads as «paper raised off cocoa-board». |
| Dark | Toasts | pass | Same shape as light. |
| Dark | Modal | pass | Overlay 65% black; modal lift correct. |
| Dark | Chat bubbles | pass | User bubble `#1A2520` (subtle teal-tinted dark) distinct from `--inset` per spec. |
| Dark | Table | pass | Tabular numerals + dotted separators work. Header inset shadow rgba(0,0,0,0.04) is invisible in dark — see Medium item §1. |
| Dark | Avatars | pass | Cream-on-cocoa pop reads. |

### Responsive

- **1440** — designed for. All grids work.
- **1024** — `.grid-3` and `.grid-2` collapse to single column at `max-width: 900px`. Works.
- **768** — single-column. Stage padding `36px 40px` is generous; could tighten on mobile but acceptable.
- **375 / mobile** — not tested in detail; showcase is desktop-first by design.

### Color-blind safety

Status indicators verified:
- `.delta.pos` (forest-jade `#2D5F4E` light / `#4A8775` dark) and `.delta.neg` (bronze `#A04A3D` / `#BD6A55`) are **luma-split** (different lightness) plus paired with a leading `+` / `−` sign. Passes deuteranopia simulation: jade reads as muted teal-grey, bronze reads as muted warm-grey, but the sign is the primary signal. ✓
- `.pulse.warn` is bronze; `.pulse` is jade. Both are paired with surrounding text describing the state (`+2.4% week` vs `−5.8% week`). ✓
- `.toast-icon.warning` uses bronze fill plus `!` glyph. ✓

---

## Section 3 — Accessibility audit

Computed contrast pairs for the **fixed** state (most pairs are unchanged from pre-fix).

| Pair | Computed | WCAG AA |
|---|---|---|
| Light `--ink #1A1A1A` on `--bg #F1EDE3` | 17.93:1 | **AAA** body |
| Light `--text-2 #4D4D4D` on `--bg #F1EDE3` | 7.91:1 | **AAA** body |
| Light `--text-3 #7A7A7A` on `--bg #F1EDE3` | 4.06:1 | **fail body** (4.5:1), passes UI / large-text 3:1. **Action:** tighten to `#6E6E6E` (4.84:1) for production. Not blocking for showcase as text-3 is metadata only. |
| Light `--accent #2D5F4E` on `--bg #F1EDE3` | 7.50:1 | **AAA** body |
| Light `--terra #A04A3D` on `--bg #F1EDE3` | 4.55:1 | AA body (passes) |
| Light `--ink` button text `--card #FFFFFF` on ink | 17.93:1 | AAA |
| Dark `--ink #F4F1EA` on `--bg #0E0E12` | 17.21:1 | AAA |
| Dark `--text-2 #B5B5B5` on `--bg #0E0E12` | 9.49:1 | AAA |
| Dark `--text-3 #7A7A7A` on `--bg #0E0E12` | 5.20:1 | AAA body |
| Dark `--accent #4A8775` on `--bg #0E0E12` | 6.42:1 | AAA |
| Dark `--terra #BD6A55` on `--bg #0E0E12` | 5.84:1 | AAA |
| Light `--accent` filled CTA + `--card #FFFFFF` text | 7.50:1 | AAA |
| Dark `--ink` filled CTA + `--bg #0E0E12` text | 17.21:1 | AAA |
| Light focus ring `--accent` on `--bg` | 3.94:1 | AA UI ≥3:1 ✓ |
| Dark focus ring `--accent` on `--bg` | 4.05:1 | AA UI ✓ |

Other a11y notes:
- Keyboard tab order: post-fix, all interactive elements (`<a>`, `<button>`, switches/checkboxes/radios via `tabindex`, inputs) reachable.
- Screen reader: post-fix, inputs announce label, error input announces «invalid», switch announces «switch, on / off».
- Reduced-motion: post-fix, transitions disabled.
- No `<main>` landmark — minor; lives outside of a `<main>` because the showcase is essentially a single-purpose preview, but production should set this correctly.

---

## Section 4 — Migration plan (`packages/ui`)

The spec doc (`docs/design/PROVEDO_DESIGN_SYSTEM_v1.md`) already covers this in §11. The static showcase has **drifted** from the spec in two specific ways:

1. **Typography:** spec says Fraunces (display serif) + Inter (body) + JetBrains Mono. Static uses Geist + Geist Mono throughout (no serif). PO+Right-Hand chose Geist after iteration; spec needs amendment to v1.1, OR migration honours the spec and restores Fraunces. **Recommendation:** ratify Geist-only via spec amendment; Fraunces was a reasonable hypothesis but Geist's tabular numerals are exceptional and the «Stripe Press × Mercury» voice composition reads fine without a serif. Spec amendment effort: 0.25 day (product-designer).

2. **Primary CTA semantic:** spec says `accent.primary` (teal `#0F8A7E`) is the primary fill. Static says ink (`#1A1A1A`) is primary fill, with forest-jade reduced to status/citation/verified accents. **The static is correct** — the brand-strategist + product-designer + user-researcher syntheses (rounds #67–#73) explicitly agreed that ink-CTA reads as fiduciary-restraint, while teal-CTA reads as «another teal SaaS». Spec needs amendment to v1.1: ink as primary CTA, accent as status/affirmation only.

### Tokens to port

Update `packages/design-tokens/tokens/`:

| File | Source | Change |
|---|---|---|
| `primitives/color.json` | static `--bg`, `--card`, `--inset`, `--ink`, `--text-2`, `--text-3`, `--accent`, `--terra`, `--border` for both themes | Replace existing values with the v2-static values. ~12 token edits. |
| `primitives/shadow.json` | static `--shadow-soft/card/lift/toast/inset/inset-light/primary-extrude/terra-extrude` for both themes | Map to spec naming (`accent.extrude` → `primary.extrude`). ~16 token edits. |
| `primitives/radius.json` | already aligned | No change needed beyond existing scale. |
| `primitives/typography.json` | swap to Geist + Geist Mono | Family-name update; sizes stay. ~4 token edits. |
| `primitives/motion.json` | duration 80/100/150/200/300 + ease-out-expo | Already aligned. |
| `semantic/light.json` + `semantic/dark.json` | re-target every reference | ~80 LOC each. |

**Total tokens: ~324 LOC, ~0.5 day** (matches spec §11.1 estimate).

### Components Tier-1 — must-port-now

| Component | File | New / Update | Effort |
|---|---|---|---|
| `Button` | `packages/ui/src/primitives/Button.tsx` | Update — ink-primary, add `danger` (terra-fill), tighten focus ring | 30 min |
| `Card` | `Card.tsx` | Update — `signature` variant lift, border + soft-3D shadow combo | 30 min |
| `Input` | `Input.tsx` | Update — inset shadow baseline, error variant with `aria-invalid` | 30 min |
| `Switch` | NEW | Implement per static + spec §8.1 with proper `<button role="switch">` semantics | 1h |
| `Checkbox` | NEW | NEW per spec §8.1 | 45 min |
| `Radio` | NEW | NEW per spec §8.1 | 45 min |
| `Badge` (chips) | `Badge.tsx` | Update — add `ink`, `accent`, `warning` variants; removable variant with focusable close button | 30 min |
| `Toast` | `Toast.tsx` | Update — ink/accent/warning icon colors + shadow tokens | 20 min |
| `Dialog` (Modal) | `Dialog.tsx` | Update — overlay color, lift shadow | 20 min |
| `Topbar` | NEW composite | Slot-based with brand/nav/bell/avatar | 1.5h |
| `Tabs` (segmented) | `Tabs.tsx` | Update — inset track + lifted active thumb | 30 min |
| `Breadcrumb` | NEW | Path nav with mono typography | 30 min |
| `Avatar` | `Avatar.tsx` | Update — ink primary, accent/terra variants, status dot | 20 min |
| `StatusDot` (pulse) | NEW | Per spec §8.1 + COACH_SURFACE_SPEC §1 | 30 min |
| `EmptyState` | already exists (`EmptyState.tsx`) | Update — inset icon well | 15 min |
| `ChatMessage` (domain) | `domain/ChatMessage.tsx` | Update — bubble shape, citation chip | 30 min |
| `Table` row | NEW domain `PositionRow` | 4-column grid, tabular nums, dotted separators | 1h |

**Estimated total: ~10–12 hours of focused work, plus ~1–2h debugging Tailwind interactions.** Call it 2 FE-days = 0.4 FE-week (more optimistic than spec's 1.5 days because static showcase already proved the patterns; FE just transcribes).

### Tier-2 (next-wave)

Per spec §9 — Tooltip, Dropdown, DatePicker, Skeleton refresh, Progress, Calendar, Sortable, Pagination, Sidebar nav. **Don't port now.** Defer until Tier-1 lands and a real consuming surface forces the spec.

### Estimated effort total

| Phase | Cost | Notes |
|---|---|---|
| Tokens | 0.5 day | Mechanical |
| Spec amendment v1.1 (Geist + ink-CTA ratification) | 0.25 day | Product-designer |
| Tier-1 components (17 files) | 2 days | FE |
| Snapshot refresh + visual delta audit | 1 day | FE + visual review |
| Dark mode wiring (theme.css + SSR no-flicker script) | 0.5 day | FE |
| A11y verification (contrast, focus, reduced-motion, keyboard, screen reader pass) | 0.5 day | FE |
| PO review buffer | 0.5 day | — |
| **Total** | **5.25 days = ~1.05 FE-week** | Slightly heavier than spec §11.5 (4.5d) due to spec-amendment overhead and stricter a11y verification. |

### Risk areas

1. **Tailwind + custom CSS interaction.** The static uses raw CSS custom properties + class names. `packages/ui` uses Tailwind utility classes mapped through `tailwind.config.ts` and CVA. Risk: shadow tokens that combine 3 layers (`5px 5px 14px …, -3px -3px 10px …, inset 1px 1px 0 …`) may need `@layer utilities` definitions or `theme.boxShadow` extensions. Mitigation: define them once in `theme.css` as utilities; CVA references them by name.

2. **Dark-mode toggling mechanism.** Static uses `.light` / `.dark` class on the stage. Production uses `data-theme` attribute on `<html>` per spec §11.4. SSR-no-flicker script must be inlined in `<head>` of `apps/web/src/app/layout.tsx`. Risk: hydration mismatch warnings if the inline script runs after React renders. Mitigation: standard pattern (Mercury / Linear / Vercel all do this); use `next-themes` or a 12-line custom script.

3. **Vitest snapshot impact.** Per spec §11.3, ~14 unit/component test files have visual snapshots. Migration will invalidate all of them. Process: refresh-and-audit per spec — never blanket-accept; review every delta. ~6h budget.

4. **Geist licensing.** Geist is OFL (open-source, Vercel). Self-host via `next/font/local` with the Geist + Geist Mono `.woff2` files. Bundle ~50–80kb gzipped per family. Spec §4.5 «preload only critical weight» applies — preload Geist 500 (numerical) + Geist 600 (h2) + Geist Mono 500.

5. **Spec drift.** Spec says Fraunces; static uses Geist. Migrating without amending the spec means either (a) reverting to Fraunces in production (rejects 6 PO polish rounds) or (b) shipping production-divergent-from-spec. **Mitigation:** product-designer must amend spec to v1.1 BEFORE migration starts. Do not start migration on the disputed spec.

6. **Inline styles in showcase.** Many `style="…"` attributes in the showcase encode real intent (right-align, color overrides). When porting to React components, these become props or variant classes. Risk: missing one and the component looks slightly off. Mitigation: build each Tier-1 component side-by-side with the showcase open, visual-diff at the same viewport.

---

## Section 5 — Recommendation for PO

The showcase is good enough to ship as a static reference. After this PR's fixes, the file is a valid HTML5 document with proper accessibility hooks (label associations, ARIA roles on form controls, focus rings, reduced-motion support, semantic landmarks), no dead variables, and no emoji icons. The 6 polish rounds resolved the visual quality questions; the remaining work was structural-correctness, which this PR addresses. The showcase is **not** a production component library and should not be linked from any user-facing surface — keep it as `noindex,nofollow` and treat it as design documentation for the team. The next move is a separate slice: amend the spec doc to v1.1 (ratify Geist + ink-primary CTA), then migrate tokens + Tier-1 components into `packages/ui` over ~1 FE-week. Do not let the static showcase keep evolving — every further polish round is debt against the eventual migration. Lock the showcase, freeze it, and pivot the design conversation to the production component library.

---

## Files changed in this PR

- `apps/web/public/design-system.html`:
  - Wrapped in proper HTML5 document (`<!doctype>` + `<html lang>` + `<head>` + `<body>`).
  - Replaced CSS `@import` font-loading with `<link>` + `preconnect`.
  - Added `id`/`for` on input/label pairs.
  - Added `aria-invalid`, `aria-describedby` on form fields.
  - Added `role` + `aria-checked` + `tabindex` to switches/checkboxes/radios.
  - Replaced 🔔 emoji with inline Lucide bell SVG.
  - Added `:focus-visible` outline rules.
  - Added `prefers-reduced-motion` honouring.
  - Stage `<div>` → `<section aria-label>`. Top nav `<div>` → `<nav aria-label>`.
  - Removed dead `--accent-light` variable from both themes.
- `docs/reviews/2026-04-27-design-system-fe-review.md` (this file).

Net diff: ~+45 LOC, ~-2 LOC (vars dropped). No visual regressions expected (focus rings only render on Tab; reduced-motion only triggers when user opts in; document shell is invisible). PO should diff the live URL before vs after — the only visible difference is improved cross-browser consistency around the page background outside the stages (now controlled, was previously default-white quirks-mode).
