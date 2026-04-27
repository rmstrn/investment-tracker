# Kickoff — Design System Migration v1 (static showcase → production component library)

**Date:** 2026-04-27
**Author:** Right-Hand (Tech Lead)
**Owner:** frontend-engineer
**Status:** APPROVED BY PO — ready to dispatch
**Slice ID:** SLICE-DSM-V1
**Branch:** `feat/design-system-migration-v1`
**Base SHA:** `ce5f6ca` (current main tip; verify on dispatch)
**Worktree:** main repo working tree (no separate worktree needed)
**Estimated effort:** ~6.25 FE-days (1.25 FE-week)
**PR target:** main; expect 1 large PR with comprehensive description + visual delta artifacts

---

## 1. Why this slice

The static showcase at `apps/web/public/design-system.html` (1146 LOC, post fix-pass-2) is a frozen reference that survived 6 PO polish rounds and two frontend-engineer review passes. It encodes the locked Provedo v1 design system: cream-paper light theme + cocoa-board dark theme, Geist + Geist Mono typography, ink-primary CTA semantic, forest-jade accent reserved for status/affirmation, Lucide iconography, Stripe-Mercury motion family. Both themes are visually approved and a11y-audited.

`packages/ui/` and `packages/design-tokens/` still hold the prior Design Brief v1.3 token system (warm cream + slate + teal-600 primary, Inter only). Every consumer surface in `apps/web/src/app/` reads from those packages and therefore renders against the wrong tokens. Until we port the showcase into the production package, every new feature reinforces the wrong system, every Vitest snapshot bakes in the old palette, and the staging app diverges further from the design intent.

This slice ports tokens + Tier-1 primitives + theme wiring + consumer integration in one coordinated PR so the divergence ends in a single, auditable step.

**Critical dependency:** spec amendment v1.1 (running in parallel via product-designer dispatch). Migration must wait until `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` is amended to ratify Geist + ink-primary CTA. **Do not start migration on the disputed v1.0 spec.** If amendment is not landed when FE picks this up, surface immediately to Right-Hand.

---

## 2. Hard rules (apply throughout)

- **R1 — No spend.** Geist is OFL — self-host via `next/font/local`, do not subscribe to any font CDN. Lucide is MIT — install `lucide-react` from npm (free). No new paid services, platforms, or licenses without explicit per-transaction PO approval.
- **R2 — No external comms.** Do not author tweets, blog posts, vendor outreach, or any external messaging on behalf of PO during this slice.
- **R4 — No predecessor references.** Do not surface the rejected naming predecessor in commit messages, PR description, code comments, or doc updates. If documenting the $250 sunk cost, refer to it as «sunk cost» without naming the predecessor brand.

---

## 3. Source-of-truth inputs

### Locked references (read first)

1. **`apps/web/public/design-system.html`** (1146 LOC) — visual + behavioural source of truth. Every token, every component, every animation timing comes from here. Both themes, all 14 Tier-1 components, both stages.
2. **`docs/reviews/2026-04-27-design-system-fe-review.md`** — first FE pass; contains the migration plan you will execute (§4 «Migration plan (`packages/ui`)»), token mapping table (§4 «Tokens to port»), component effort table (§4 «Components Tier-1 — must-port-now»), and risk register (§4 «Risk areas»). Treat this as the authoritative migration playbook.
3. **`docs/reviews/2026-04-27-design-system-fe-pass-2.md`** — second FE pass; covers fix-up details that landed in the showcase between rev 1 and rev 2.

### Inputs in flight (parallel product-designer dispatch — expected before FE picks this up)

4. **`docs/design/PROVEDO_DESIGN_SYSTEM_v1.md`** (amended to v1.1) — formal spec; v1.1 amendment ratifies Geist (not Fraunces) and ink-primary CTA (not teal accent). Block migration until v1.1 lands.
5. **`docs/design/ICONOGRAPHY.md`** — Lucide reference + icon naming map (`bell`, `arrow-up-right`, etc.).
6. **`docs/reviews/2026-04-27-palette-synthesis.md`** — locked palette token values with reasoning.
7. **`docs/reviews/2026-04-27-design-system-final-ship-craft.md`** — product-designer's final ship verdict + 8-item spec drift catalogue.

If any of items 4–7 are missing when you dispatch, raise to Right-Hand before writing code.

---

## 4. Scope

### 4.1 Token migration

Rewrite token JSONs to v1 Provedo values:

| File | Action |
|---|---|
| `packages/design-tokens/tokens/primitives/color.json` | Replace neutral / brand / accent / state palettes with v1 values: cream `#F1EDE3`, ink `#1A1A1A`, forest-jade `#2D5F4E` light / `#4A8775` dark, terra `#A04A3D` light / `#BD6A55` dark, plus full text-1/2/3, card, inset, border for both themes |
| `packages/design-tokens/tokens/primitives/typography.json` | Swap Inter → Geist (sans), JetBrains Mono → Geist Mono. Sizes/weights stay unless v1.1 spec changes them |
| `packages/design-tokens/tokens/primitives/shadow.json` | Add multi-axis shadows: `--shadow-soft`, `--shadow-card`, `--shadow-lift`, `--shadow-toast`, `--shadow-inset`, `--shadow-inset-light`, `--shadow-primary-extrude`, `--shadow-terra-extrude`. Both themes |
| `packages/design-tokens/tokens/primitives/radius.json` | Verify scale aligns (10/12/14/18/22 used in showcase); extend if missing |
| `packages/design-tokens/tokens/primitives/motion.json` | Durations 80 / 100 / 150 / 200 / 300 ms; easings `ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)`, `ease-in` `cubic-bezier(0.4, 0, 1, 1)`. See §5 for the canonical motion language |
| `packages/design-tokens/tokens/semantic/light.json` | Full rewrite — re-target every reference to v1 primitives. Existing file (~120 LOC) goes to ~80–100 LOC |
| `packages/design-tokens/tokens/semantic/dark.json` | Full rewrite per dark stage in showcase |

After token edits: run `pnpm --filter @investment-tracker/design-tokens build` and verify generated CSS variables match the showcase exactly. Diff against showcase `:root.light` + `:root.dark` blocks.

### 4.2 Primitive refit + new components

Existing inventory in `packages/ui/src/primitives/`:

```
AskAiButton · Avatar · Badge · BellDropdown · Button · Card · ChatInputPill ·
CountUpNumber · Dialog · Dropdown · EmptyState · ExplainerTooltip · GlobalBanner ·
Input · LockedPreview · PaywallModal · PlanBadge · SegmentedControl · Sheet ·
Shimmer · Skeleton · SuggestedPrompt · SyncStatusBadge · Tabs · Toast · Tooltip ·
ToolUseCard · TrustRow · TypingCursor · UsageIndicator
```

#### 4.2.1 Refit (existing files)

| Primitive | File | Change | Rough effort |
|---|---|---|---|
| Button | `Button.tsx` | Ink-primary fill, accent-secondary, ghost, danger (terra-fill); 3-axis shadow; hover lift; press settle; tightened focus ring | 30 min |
| Card | `Card.tsx` | Add `signature` variant (extra lift); border + soft 3D shadow combo; cream-edge highlight on top | 30 min |
| Input | `Input.tsx` | Inset shadow baseline; error variant with `aria-invalid`; `aria-describedby` for help text; search variant | 30 min |
| Badge | `Badge.tsx` | Variants `ink`, `accent`, `warning`, `neutral`; removable variant uses focusable `<button>` close (not `<span>`) | 30 min |
| Toast | `Toast.tsx` | Ink/accent/warning icon colors; toast shadow token; bronze (not red) for warning per a11y safety | 20 min |
| Dialog | `Dialog.tsx` | Overlay `rgba(0,0,0,0.45)` + `backdrop-filter: blur(2px)`; lift shadow; modal enter/exit animation per §5 | 20 min |
| Tabs | `Tabs.tsx` (segmented) | Inset track + lifted active thumb; transition 200ms ease-out-expo on indicator | 30 min |
| Avatar | `Avatar.tsx` | Ink primary, accent/terra variants; status-dot prop slot | 20 min |
| EmptyState | `EmptyState.tsx` | Inset icon well; refit shadows | 15 min |

#### 4.2.2 New primitives

| Primitive | File | Notes | Rough effort |
|---|---|---|---|
| Switch | `Switch.tsx` | `<button role="switch">` + `aria-checked`; track turns accent-green on; knob translateX 200ms ease-out-expo. Knob shadow must be readable in dark mode (lift `rgba(0,0,0,0.25)` not `0.15` — see FE-review §2 dark-switch note) | 1h |
| Checkbox | `Checkbox.tsx` | `<button role="checkbox">` + `aria-checked`; ink fill on checked; check glyph via Lucide `check` | 45 min |
| Radio | `Radio.tsx` | `<button role="radio">` + `aria-checked`; tabindex 0 for selected, -1 for unselected within group | 45 min |
| Breadcrumb | `Breadcrumb.tsx` | Path nav with mono typography; chevron-right separator via Lucide; current page non-link | 30 min |
| StatusDot | `StatusDot.tsx` | Pulse ring; variants `ok`, `warn`, `info`, `idle`; reduced-motion fallback (no pulse) | 30 min |
| Topbar | `shells/Topbar.tsx` | Slot-based composite: brand slot, nav slot, bell slot (uses BellDropdown), avatar slot. Tier-1 shell, place under `shells/` not `primitives/` | 1.5h |
| Citation | `Citation.tsx` | Inline chip used in chat surface; small mono-rendered ID + accent-tinted border (the `color-mix` pair from showcase line 477). Provide rgba fallback for older browsers | 30 min |

#### 4.2.3 Lucide install + icon strategy

```bash
pnpm --filter @investment-tracker/ui add lucide-react
```

- Re-export curated icon set from `packages/ui/src/icons/index.ts` (do not deep-import `lucide-react/dist/esm/icons/*` from consumers — costs tree-shake clarity).
- Curated set per `docs/design/ICONOGRAPHY.md`: at minimum `Bell`, `ArrowUpRight`, `ArrowDownRight`, `Check`, `X`, `ChevronRight`, `ChevronDown`, `Search`, `AlertCircle`, `CheckCircle2`, `Info`, `Plus`, `Pencil`, `Trash2`, `Settings`, `User`, `LogOut`, `Sparkles`. Extend as ICONOGRAPHY.md prescribes.
- Replace any remaining emoji icons in app code (audit `apps/web/src/` for emoji unicode in JSX strings).

### 4.3 Theme wiring (dark-mode mechanism)

- Strategy: `data-theme="light"` / `data-theme="dark"` on `<html>` (matches spec §11.4, not body class).
- Resolution order: localStorage `theme` → system preference (`prefers-color-scheme`) → default `light`.
- SSR no-flicker: inline `<script>` in `<head>` of `apps/web/src/app/layout.tsx` that runs synchronously before React hydration. Sets `data-theme` based on resolved preference. Must not produce hydration mismatch warning.
- Build options: (a) `next-themes` (battle-tested, ~2kb), (b) hand-rolled 12-line script. Prefer `next-themes` unless it conflicts with existing providers in `providers.tsx`.
- Theme toggle UI: button somewhere in app shell (not a feature for this slice — just expose the hook + a placeholder toggle in `Topbar` if not yet present).

### 4.4 Consumer page integration

Routes that consume tokens/primitives and must be verified post-migration (all under `apps/web/src/app/`):

- `(app)/dashboard/page.tsx`
- `(app)/positions/page.tsx` + `(app)/positions/[id]/page.tsx`
- `(app)/chat/page.tsx` + `(app)/chat/[id]/page.tsx`
- `(app)/accounts/page.tsx` + `accounts-page-client.tsx`
- `(app)/insights/page.tsx` + `insights-page-client.tsx`
- `(app)/layout.tsx` (app shell)
- `(marketing)/page.tsx` + `(marketing)/pricing/page.tsx` + `_components/MarketingHeader.tsx` + `MarketingFooter.tsx`
- `design/page.tsx` + `design/_sections/*` (the dev-only design playground; refresh sections to mirror production tokens)

**Audit scope for inline overrides:** grep `apps/web/src/` for hex literals (`#[0-9A-Fa-f]{3,8}`), inline `style={{ color/background/border }}`, and Tailwind arbitrary values like `text-[#hex]`. Replace with token references. Anything that cannot be resolved cleanly → log as TD entry, do not inline-fix outside scope.

### 4.5 Test snapshot refresh

~14 Vitest spec files affected per FE-review §4. Process:

1. Run `pnpm --filter @investment-tracker/web test --run`.
2. Review each failing snapshot diff. **Do not blanket-accept.**
3. For each diff: confirm change matches v1 design intent (e.g. hex shifted from `#7C3AED` → `#1A1A1A` for ink, `#10B981` → `#2D5F4E` for accent).
4. Update with `pnpm test --run -u` only after diff is reviewed.
5. Capture before/after screenshots of any component test that has a visual snapshot, attach to PR.

Affected (likely) files:
- `chat/chat-message-item.test.tsx`, `chat/streaming-message-view.test.tsx`
- `portfolio/value-card-live.test.tsx`
- `positions/position-header.test.tsx`, `positions/position-price-chart.test.tsx`, `positions/positions-row.test.tsx`, `positions/delete-transaction-confirm.test.tsx`, `positions/position-transactions-tab.test.tsx`, `positions/transaction-form-dialog.test.tsx`
- `accounts/account-form-modal.test.tsx`, `account-list-item.test.tsx`, `accounts-page-client.test.tsx`
- `insights/insights-page-client.test.tsx`
- `(marketing)/page.test.tsx`, `(marketing)/pricing/page.test.tsx`

Verify each one renders + passes a11y + visually matches v1 intent.

### 4.6 Geist self-host

- Download Geist + Geist Mono `.woff2` files from the official Vercel Geist GitHub repo (OFL license; bundled with the package). No spend, no third-party CDN.
- Place under `apps/web/src/styles/fonts/` or use `next/font/local` referencing `node_modules/geist/dist/fonts/`.
- Preload only critical weights per spec §4.5: Geist 500 (numerical), Geist 600 (h2), Geist Mono 500.
- Wire via `next/font/local` in `apps/web/src/app/layout.tsx`. Use `display: 'swap'`.
- Verify Lighthouse FCP unchanged or improved (target unchanged: < 1.5s).

---

## 5. Animation language (consistency spec — PO callout)

PO requested «доработать анимацию если нужно». The showcase has motion in pieces; this is the canonical spec for the migrated package.

### 5.1 Token additions (`motion.json`)

```
duration: { instant: 80ms, fast: 150ms, base: 200ms, slow: 300ms }
easing:   { out-expo: cubic-bezier(0.16, 1, 0.3, 1),
            out:      cubic-bezier(0.0, 0, 0.2, 1),
            in:       cubic-bezier(0.4, 0, 1, 1),
            in-out:   cubic-bezier(0.4, 0, 0.2, 1) }
```

### 5.2 Per-primitive motion contract

| Primitive | Trigger | Property | Duration | Easing | Notes |
|---|---|---|---|---|---|
| Button | hover | `transform: translateY(-1px)` | 200ms | out-expo | + shadow lift |
| Button | press | `transform: translateY(1px)` | 80ms | in | settles into surface |
| Button | release | `transform: translateY(0)` | 150ms | out | bounces back |
| Switch | toggle | `transform: translateX()` on knob + `background` on track | 200ms | out-expo | reduced-motion: instant |
| Checkbox / Radio | check | `opacity` on glyph + `background` on box | 150ms | out | reduced-motion: instant |
| Tabs | active change | `transform: translateX()` on indicator + `opacity` | 200ms | out-expo | indicator slides between tabs |
| Modal | enter | `opacity 0→1` overlay + `transform: scale(0.96)→scale(1)` + `opacity 0→1` panel | 200ms | out | reduced-motion: opacity only, no scale |
| Modal | exit | reverse | 150ms | in | reduced-motion: opacity only |
| Toast | enter | `transform: translateY(8px)→0` + `opacity 0→1` | 200ms | out | reduced-motion: opacity only |
| Toast | exit | `transform: translateY(-8px)` + `opacity 1→0` | 150ms | in | reduced-motion: opacity only |
| Dropdown / Tooltip | enter | `opacity 0→1` + `transform: translateY(-2px)→0` | 150ms | out | — |
| Focus ring | appear | `outline` always-on; `outline-offset` transition 100ms | 100ms | out | no fade-in (a11y: focus must be instantly visible) |
| StatusDot pulse | continuous | `transform: scale(1)→scale(1.4)` + `opacity 0.6→0` on ring | 1800ms | in-out | reduced-motion: no pulse, static dot only |

### 5.3 Hard NOs

- No iOS-spring physics (`cubic-bezier` only).
- No Material-ripple expansion.
- No bouncy overshoot (reserved for non-essential celebratory moments only — none in this slice).
- No animation on layout-bound properties (`width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`, `border-width`).

### 5.4 `prefers-reduced-motion`

Honour globally via `@media (prefers-reduced-motion: reduce)`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Plus per-primitive overrides where opacity-only fallbacks are listed above.

---

## 6. Risks (from FE-review §4 + product-designer synthesis)

1. **Tailwind ↔ custom CSS interaction.** Multi-axis shadows (`5px 5px 14px …, -3px -3px 10px …, inset 1px 1px 0 …`) need `theme.boxShadow` extensions in `tailwind.config.ts` or `@layer utilities` definitions. Mitigation: define shadow tokens once as utilities; CVA references by name.

2. **Dark-mode hydration flicker.** SSR script in `<head>` must run synchronously before React. If hydration mismatch warning surfaces, iterate the inline script — do not work around it. Mitigation: prefer `next-themes`.

3. **Vitest snapshot regen volume.** ~14 spec files. Process per §4.5 — review every diff, never blanket-accept.

4. **Geist licensing/self-host.** OFL license; no spend. Verify the `.woff2` files are bundled with the `geist` npm package; if not, fetch from the official Vercel Geist GitHub repo. **Do not subscribe to fonts.com or any commercial CDN.**

5. **Spec drift v1.0 ↔ reality.** Migration assumes amended v1.1 spec is in repo. If v1.1 is still in-flight when FE picks this up — block, escalate to Right-Hand. Do not start on the disputed spec.

6. **Inline hex/style overrides in `apps/web/src/`.** Many components likely hardcode old hex (`#7C3AED`, `#10B981`, `#F4F1EA`). Audit before refit; replace with tokens. If a hex cannot be cleanly resolved → TD entry, do not inline-fix outside scope.

7. **Bundle size regression.** Lucide tree-shake depends on per-icon imports. If you barrel-export everything you may inflate the bundle. Mitigation: re-export curated set from `packages/ui/src/icons/index.ts`, never re-export from `lucide-react` directly.

8. **`color-mix(in oklch, …)` browser support.** Used twice in showcase (light pulse warn glow, citation chip border). Baseline-newly-available. Provide rgba precomputed fallback wrapped in `@supports not (color: color-mix(in oklch, red, blue))`.

---

## 7. Acceptance criteria

- [ ] All 9 refit primitives match showcase visual parity at 1440 / 1024 / 768 viewports, both themes.
- [ ] All 7 new primitives implemented with proper a11y semantics (role, aria-checked, tabindex, keyboard-operable).
- [ ] Lucide icons installed; curated re-export established; emoji icons removed from `apps/web/src/`.
- [ ] Geist + Geist Mono self-hosted via `next/font/local`; preload covers Geist 500/600 + Geist Mono 500; no third-party font CDN in production.
- [ ] Both themes render with no flicker on hard refresh; system-preference + localStorage hydration works; theme toggle wired into Topbar shell.
- [ ] All 9 listed consumer routes render correctly in both themes; no regression in user flows.
- [ ] All Vitest tests green; every snapshot diff reviewed and approved (not blanket-accepted).
- [ ] WCAG AA contrast passes on every text/bg pair listed in FE-review §3 audit table; `--text-3` lifted to `#6E6E6E` on light to fix the 4.06:1 → 4.84:1 issue called out in FE-review.
- [ ] Animation language consistent across primitives per §5; reduced-motion fallback verified by toggling OS-level setting.
- [ ] CI green on PR (8 jobs including type-check, vitest, build, lint, contract-k6-spec-sync).
- [ ] PR description includes:
  - Summary of changes (one paragraph per phase)
  - Visual delta artifacts: before/after screenshots of `/dashboard`, `/chat`, `/positions`, `/insights`, marketing landing, in both themes (target ~10 screenshot pairs; PNG, < 500kb each)
  - Token-diff table (primitive color, shadow, typography)
  - List of TDs added (any out-of-scope findings)
  - Snapshot refresh log (one line per file, what changed)
- [ ] Code Reviewer dispatch requested AFTER merge (safety net, not blocker).

---

## 8. Sequence (suggested ordering — adjust if dependencies surface)

| Day | Phase | Outputs |
|---|---|---|
| 1 | Tokens + Geist + Lucide | Rewritten `tokens/{primitives,semantic}/*.json`; `pnpm build` produces correct CSS vars; Geist self-hosted; lucide-react installed; curated icon re-export; emoji removed from app code |
| 2 | Refit primitives wave 1 | Button, Input, Card, Badge, Toast — visual parity at 1440 light + dark |
| 3 | Refit primitives wave 2 + new primitives | Dialog, Tabs, Avatar, EmptyState refit; Switch, Checkbox, Radio, Breadcrumb, StatusDot, Citation new; Topbar shell new |
| 4 | Consumer page integration | All 9 routes rendered in both themes; inline-hex audit complete; TDs filed for unresolved overrides |
| 5 | Theme wiring | `data-theme` attribute on `<html>`; SSR no-flicker script; localStorage + system-preference resolution; theme toggle wired into Topbar |
| 6 | Animation polish + a11y verification | Motion contract per §5 enforced across primitives; reduced-motion verified; WCAG AA pass; keyboard-tab order verified; screen-reader pass on Switch/Checkbox/Radio |
| 7 | Snapshot refresh + cross-browser smoke + PR | Vitest snapshots reviewed; cross-browser smoke (Chrome/Firefox/Safari at 1440 + 768); PR opened with full description + visual deltas |

If any day overruns by > 50%, surface to Right-Hand. Hard stop at 8 days; if not done, partition into a follow-up slice rather than merge half-done.

---

## 9. Out of scope (defer)

- **Tier-2 primitives** — Tooltip refit beyond cosmetic, Skeleton refresh, DatePicker, Slider, Combobox, Stepper, Streaming-cursor refit. These are next-wave; do not port now per FE-review §4 «Tier-2 (next-wave)».
- **Spec amendment v1.1** — running parallel via product-designer dispatch. Not your work.
- **Landing v2 PR #66 refit** — separate PO priority «закончить лендинг»; do not touch `(marketing)/landing-v2/*` in this slice.
- **iOS adaptation** — post-alpha.
- **Validation experiments** — 5-second test on real users. Out of slice.
- **Theme toggle UI polish** — basic toggle in Topbar is in-scope; deciding the icon, microcopy, placement in onboarding etc. is out.
- **Charts refit** — `packages/ui/src/charts/` uses Recharts. Charts will pick up token changes via CSS-variable consumption; do not rewrite chart components.
- **Tailwind arbitrary-value cleanup** — out-of-scope hex literals in app code that cannot be cleanly resolved → TD entry, not inline-fix.

---

## 10. Out-of-scope findings → TD entries

Anything you find that is broken or ugly but outside this slice:

- Format: TD-NNN — short title — priority (P1/P2/P3) — trigger («surface when…»)
- File entries in `docs/TECH_DEBT.md` as part of the docs commit.
- Do **not** inline-fix. Don't «while I'm here».

Examples likely to surface:
- Lingering hex literals in `apps/web/src/components/positions/*` that can't be cleanly tokenised.
- Old shadcn/ui primitives in `packages/ui/src/primitives/Sheet.tsx` not refitted (Tier-2 candidate).
- Recharts theme integration gaps (chart colors don't auto-pick from tokens).
- Marketing pages using old palette in inline styles.

---

## 11. Commit structure

Two commits, in this order:

**Commit 1 — implementation:**

```
feat(design-system): migrate to Provedo v1 tokens + Tier-1 primitives

- Rewrite design-tokens primitives (color/typography/shadow/radius/motion)
- Rewrite semantic light + dark token files
- Refit Button, Card, Input, Badge, Toast, Dialog, Tabs, Avatar, EmptyState
- New: Switch, Checkbox, Radio, Breadcrumb, StatusDot, Citation, Topbar shell
- Install lucide-react + curated icon re-export
- Self-host Geist + Geist Mono via next/font/local
- Wire data-theme attribute + SSR no-flicker script (next-themes)
- Update consumer routes (dashboard / positions / chat / accounts / insights / marketing)
- Refresh Vitest snapshots (~14 files; every diff reviewed)
- Animation language consolidated per §5 of kickoff
- WCAG AA verified; --text-3 lifted to #6E6E6E on light
```

**Commit 2 — docs:**

```
docs: close design-system migration slice

- Add TD entries for out-of-scope findings (see commit body)
- Update docs/merge-log.md with slice SHA + outcome
- Update docs/TECH_DEBT.md
- Add lessons-learned entry to docs/PO_HANDOFF.md §10
```

PO will land any further `docs/PO_HANDOFF.md` updates separately per «CC post-merge docs scope» rule (touch only merge-log, TECH_DEBT, DECISIONS, ROADMAP from worktree).

---

## 12. Pre-flight checks (run before writing any code)

1. `git status` clean; on `main` at `ce5f6ca` or newer.
2. Branch: `git checkout -b feat/design-system-migration-v1`.
3. Confirm v1.1 spec amendment landed: `ls docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` exists and grep for «Geist» + «ink-primary» in it. If missing → escalate to Right-Hand, do not proceed.
4. Confirm `docs/design/ICONOGRAPHY.md` and `docs/reviews/2026-04-27-palette-synthesis.md` exist.
5. `pnpm install` clean.
6. `pnpm --filter @investment-tracker/design-tokens build` succeeds with current tokens (baseline).
7. `pnpm --filter @investment-tracker/web test --run` baseline passes (capture pass count for comparison).
8. `pnpm --filter @investment-tracker/web build` baseline succeeds.
9. Open the showcase locally: `cd apps/web && pnpm dev` then visit `/design-system.html`. Flip light/dark via DevTools class toggle on the stage to verify reference state matches your monitor.

---

## 13. Report format (when slice is done — before opening PR)

Reply to Right-Hand with:

1. `git log --oneline -3` of your branch.
2. Acceptance criteria checklist (§7) — every box checked or explicitly marked deferred + rationale.
3. Any TDs added (TD number + title + priority).
4. Surprise findings (what was harder/easier than expected).
5. CI status (link to GitHub Actions run).
6. PR URL once opened.

If anything blocked you for > 30 minutes — say so; do not silently work around it.

---

## 14. Definition of done

- PR opened, CI green, all acceptance criteria checked.
- Code-Reviewer dispatch requested (post-merge safety net).
- `docs/merge-log.md` + `docs/TECH_DEBT.md` updated in commit 2.
- Static showcase at `apps/web/public/design-system.html` is **frozen** — no further iteration on it; it remains as historical reference + non-indexed staging URL only.
- Right-Hand will close the slice in `docs/PO_HANDOFF.md §10` after PO sign-off on visual delta.

---

## 15. Open questions for Right-Hand (escalate before/during dispatch)

- **Q1.** Is `next-themes` already in any other surface, or is this its first use? (If first use, double-check it composes cleanly with `providers.tsx` Clerk + TanStack Query providers.)
- **Q2.** Do we keep the dev-only `/design` playground at `apps/web/src/app/design/page.tsx` in sync with the new tokens, or freeze it and replace with a static link to the showcase? (Recommendation: refresh sections; it is the live development reference for the team.)
- **Q3.** Are there design-decision implications for Recharts theming that should be addressed in this slice or deferred? (Recommendation: defer; charts pick up CSS-variable changes automatically; only add explicit chart-token mapping if a regression is visible.)
- **Q4.** Cross-browser support floor — Safari 16.2+ for `color-mix(in oklch, …)`. Confirm minimum supported browser set; if Safari 15 still in scope, the rgba fallback in §6.8 is required, not optional.
