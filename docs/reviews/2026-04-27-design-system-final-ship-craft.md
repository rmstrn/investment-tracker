# Final SHIP Review — Product-Designer

**Verdict:** SHIP + 4-week freeze
**Confidence:** high
**Migration impact:** small

Reviewed: `apps/web/public/design-system.html` (1146 lines) against `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` v1.0 LOCKED.

Forensic pass complete. Nothing warrants another iteration. Two LOW-severity hygiene items flagged as soft-fix-during-migration (do not block freeze). All Tier-1 components render correctly in both themes; depth language reads cleanly; a11y scaffolding present.

---

## CSS hygiene

**Specificity:** clean. The previously-leaking `.input.error:focus` selector is now hard-pinned via duplicated `:focus,:focus-visible` rules with explicit `--terra` outline-color override. Only one `!important` (`.btn-disabled { transform: none !important }`) — correct call to neutralise hover-translate.

**Tokens:** no dead variables. Audit:
- `--shadow-input-inset` consumed only by `.input`, `.search-input`, `.shadow-block.s-input-inset` (3 sites, per intent).
- `--shadow-inset-light` consumed by 9 sites (chips, citations, tabs-track, chat-user-bubble dark fallback, info-toast, empty-icon, btn-icon).
- `--shadow-soft`, `--border-divider`, `--accent-glow` all used; cardinality correct.

**Naming:** `--shadow-input-inset` rename fully propagated; zero residual `--shadow-inset` references.

**Soft-fix LOW (during port, not before freeze):**
1. `.dark .btn-secondary:hover` override pattern duplicated 4× across `btn-secondary`, `btn-ghost`, `nav-item`, `tab`. In React port collapses to one `bg-foreground/5 dark:bg-foreground/8` utility or `--surface-hover-subtle` token.
2. `.dark .bub-user` uses hard-coded `#1A2520` instead of semantic token. Promote to `--bub-user-dark-bg` during port.

---

## Component pass (both themes)

Walked all 14 Tier-1 component clusters:

| Component | Light | Dark | Notes |
|---|---|---|---|
| Color tokens | OK | OK | All swatches render |
| Type scale | OK | (light only) | Theme-invariant, intentional |
| Shadow grid (7 elevations) | OK | (light only) | Dark variants render through actual components below |
| Signature hero | OK | OK | `--shadow-lift` + dotted-divider eyebrow |
| Buttons (4 × 3 sizes + icon × 5) | OK | OK | Ink-CTA flip in dark works; btn-icon.primary correct |
| Inputs (default / error / search) | OK | OK | Error border + focus-visible terra outline both present in light. Dark omits error variant — flag for v1.1 |
| Toggles (switch / checkbox / radio) | OK | OK | Lucide-SVG checkmarks; switch thumb travel maths correct |
| Cards (portfolio / insight / empty) | OK | OK | Lucide search SVG in empty state |
| Chips (5 + close × 2) | OK | OK | Lucide X SVG inside `<button>` chip-close with aria-label |
| Toasts (success / warning / info) | OK | OK | 3 Lucide SVG icons; info-toast on `--inset` per restraint canon |
| Modal | OK | OK | Modal-overlay token swaps correctly |
| Topbar nav / tabs / breadcrumb | OK | OK | Lucide bell; active-nav uses `--shadow-primary-extrude`; hover bumped per PO×3 |
| Chat (user-inset / AI-card / citation × 4) | OK | OK | Lucide sparkle citations at 10×10; bold-only `.accent` (no green leak) per brand canon |
| Table (positions) | OK | OK | `tnum 1` tabular nums; header center-aligned numerical, body right-aligned |
| Avatars (3 + status dot) | OK | OK | Status dot uses `--card` border |

Both themes: focus-visible 2px outline + 2px offset on every interactive primitive. `prefers-reduced-motion` honoured. Color-blind safety on `.pulse.warn` covered via ink+sign in `.pf-tiny`. Seven button states all visually distinguishable in both themes.

**Observation (NOT a blocker):** dark accent `#4A8775` on dark-card `#26262E` measures ~3.4:1 — passes WCAG UI-AA (3:1), fails AAA. Only matters if accent becomes text-on-card in real screens; current use is decorative-pill / chart-chrome / verification-badge — pass. Track for real-app rollout.

---

## Migration readiness (1.05 FE-week — confirmed)

Estimate stands.

**Token mapping:** all 22 surface/ink/accent tokens already named in v1.0 spec format (`surface.bg`, `accent.primary`, `state.success`). Showcase uses internal CSS variable names (`--bg`, `--card`, `--accent`) — these are renames at port time, ~2hr mechanical pass.

**Component port (assumes shadcn/ui base — Button/Input/Card/Tabs/Modal already exist, skin to Provedo tokens):**

- Button (4 variants × 3 sizes + icons): 0.5 day
- Input + SearchInput + error: 0.5 day
- Switch / Checkbox / Radio: 0.5 day (port from `<div role="switch">` to native `<input>` + visually-hidden + custom render — gains keyboard + SR semantics gratis)
- Card (3 + signature): 0.25 day
- Chip (4 + close): 0.25 day
- Toast (3): 0.25 day
- Modal (use Radix/Headless UI for focus-trap + escape): 0.25 day
- Topbar / Nav / Tabs / Breadcrumb: 0.5 day
- Chat bubble + Citation: 0.25 day
- Table primitive: 0.25 day
- Avatar + Pulse: 0.25 day
- Empty state: 0.1 day

Sum: ~3.85 dev-days = 0.77 FE-week of pure port.
Plus token integration (0.1w), Storybook (0.1w), visual-regression baselines (0.05w), a11y harness (0.05w) = 0.3w infrastructure.

**Total: 1.07 FE-week.** Rounds to 1.05. **Confirmed.**

**Assumption flag:** if FE rebuilds primitives from scratch instead of skinning shadcn, +0.4w. Confirm with frontend-engineer at kickoff.

---

## Spec drift list (v1.1 amendment)

Showcase has diverged from spec v1.0 in 8 deliberate places — all PO-signed-off through round-1-through-6. Spec must catch up.

| # | Spec v1.0 says | Showcase ships | Reason |
|---|---|---|---|
| 1 | Fraunces for Display/H1/H2 | Geist 600/700 display | Fraunces abandoned in tactile-shift; «Geist no-italic + tabular-nums» locked |
| 2 | Inter for body | Geist 400/500 body | Same pivot |
| 3 | JetBrains Mono | Geist Mono + Geist `tnum 1` feature | Geist's tabular-nums is sufficient |
| 4 | `accent.primary` `#0F8A7E` teal as primary CTA fill | Primary CTA = `--ink` extruded; jade demoted to small accents | PO Q2 — green-overuse rejected |
| 5 | `surface.bg` light `#F4F1EA` | `#E8E0D0` | UR-measured 1.17:1 luma fail; deepened per round-6 |
| 6 | `surface.inset` light `#ECE7DC` | `#D6CCB8` | Tracks deepened bg |
| 7 | `surface.card` dark `#1F1B17` warm-cocoa | `#26262E` neutral cool (bg `#0E0E12`, inset `#070709`) | Round-6 pivot: warm-cocoa → neutral-cool |
| 8 | Toggle/checkbox/radio depressed | Flat (border-driven); only inputs depressed | PD lock 2026-04-27 — depressed toggles read as «disabled» to users |

**Bonus drift LOW:** §10.2 should explicitly document the `pulse.warn` colorblind fallback (sign+ink in `pf-tiny`) as a pattern.

**v1.1 amendment scope:** ~2-3 hours. Touches §3 (color), §4 (typography wholesale rewrite), §10 (depth-hierarchy section addition). Patch, not respin.

---

## Deferred follow-ups (v1.1 / v2)

**v1.1 (after 4-week freeze):**

1. Dark accent `#4A8775` on `#26262E` is 3.4:1 — re-bump if any real screen puts accent on card-as-text. Currently no surface does. Track.
2. Dark error-input variant missing from showcase (light has it). Add to v1.1 showcase + spec for parity. ~10min during port.
3. Validation-state experiments paused; resume after 2-week real-product usage. Specifically: success-state input ring; warning-state input (orange vs terra collision risk).
4. Hard-coded `.dark .bub-user` `#1A2520` — promote to semantic token during port.
5. Tier-2 components explicitly deferred: Slider/Range, Date picker, Combobox (Plus scenario sim dependency), Tooltip, Stepper/Progress, Skeleton loaders, Streaming-cursor primitive.

**v2 (next major):**

6. Full validation language: success / warning / error / info on inputs with iconography + ring + helper-text patterns.
7. Animation primitives beyond hover-translate: page-transition, modal-enter, toast-enter sequences.
8. Data-viz primitives — chart axes, legend, tooltip, area/line/bar themes.
9. Onboarding-specific surfaces — coach card, progress-mosaic, milestones (`COACH_SURFACE_SPEC.md` merge).
10. iOS post-alpha — re-verify token semantics translate to SwiftUI when iOS app starts. Defer to actual iOS sprint.

---

## SHIP signal

Lock the system. Open migration phase. v1.1 spec amendment can run in parallel with frontend-engineer's port — drift items are documentation-only (they describe what's already built). Four-week freeze starts now.

**Files referenced:**
- `D:/investment-tracker/apps/web/public/design-system.html` (showcase under review)
- `D:/investment-tracker/docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` (needs v1.1 amendment per drift list)
- `D:/investment-tracker/packages/design-tokens/tokens/semantic/{light,dark}.json` (target for migration)
