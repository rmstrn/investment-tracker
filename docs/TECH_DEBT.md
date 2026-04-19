# Tech Debt Log

Running ledger of known-but-accepted debt. Each item has an owner (who revisits), a trigger (when to revisit), and a scope (how big the fix is).

Newest entries at the top. When an item is resolved, move it to the "Resolved" section at the bottom with the resolution commit/PR.

---

## Active

### TD-001 — Next.js Turbopack incompatible with `experimental.typedRoutes`

**Added:** 2026-04-19 (wave 1)
**Source:** dev startup failure; Turbopack errors on typedRoutes config
**Fix applied:** removed `--turbopack` flag from `apps/web` dev script; runs on webpack
**Cost:** slower dev HMR (~2-3x on cold start)
**Trigger to revisit:** Next.js 15.3+ (typedRoutes + Turbopack compatibility expected)
**Owner:** web lead
**Scope:** 1-line package.json change + smoke test

---

### TD-002 — `make` required for `apps/api` build, unavailable on Windows

**Added:** 2026-04-19 (wave 1)
**Source:** `pnpm build` fails on Windows at `@investment-tracker/api:build` with "make is not recognized"
**Current workaround:** dev and CI use make; Windows devs skip local api build or install make via choco/winget
**Cost:** onboarding friction for Windows contributors
**Trigger to revisit:** if we onboard ≥2 Windows devs, or when we standardize on one build runner
**Owner:** backend lead
**Scope:** replace Makefile with Taskfile (taskfile.dev) or equivalent cross-platform runner — ~half day

---

### TD-003 — `border.default` at 1.48:1 contrast (below strict WCAG 3:1 for UI components)

**Added:** 2026-04-19 (PR #31)
**Source:** strict WCAG AA for non-text UI components requires 3:1; our default border is deliberately lighter for a calm, non-fintech-harsh look
**Current state:** `border.default = slate-300 #cbd5e1` on white = 1.48:1 (fails strict)
**Compensation:** `border.strong` (slate-400, 2.27:1) used wherever the border carries interactive meaning (buttons, focused inputs); `border.default` reserved for decorative containment
**Trigger to revisit:** if accessibility audit or user testing flags missed affordances
**Owner:** design lead
**Scope:** swap `border.default` to `border.strong` in listed primitives — 1-hour sweep; will darken visual tone

---

### TD-004 — Pre-existing `biome-ignore` comments in `packages/ui`

**Added:** 2026-04-19 (PR #32)
**Source:** biome lint errors that weren't safely autofixable; accepted with justifications rather than silencing the rules globally

Inventory (9 ignores, each with reason):

| File | Rule | Reason |
|---|---|---|
| `CountUpNumber.tsx:37` | `useExhaustiveDependencies` | deps intentionally omitted to avoid re-subscription on every render |
| `ChatInputPill.tsx:54` | `useExhaustiveDependencies` | same pattern |
| `ExplainerTooltip.tsx:37` | `useExhaustiveDependencies` | same |
| `ExplainerTooltip.tsx:41` | `useExhaustiveDependencies` | same |
| `BarChart.tsx:88` | `noArrayIndexKey` | static demo data, order never changes |
| `PaywallModal.tsx:44` | `noArrayIndexKey` | same |
| `chat demo:?` | `noArrayIndexKey` | same |
| `SegmentedControl.tsx:56` | `noNonNullAssertion` | options invariant: length ≥ 1 enforced by JSDoc/props contract |
| `SegmentedControl.tsx:72` | `noNonNullAssertion` | same |

**Trigger to revisit:** quarterly lint audit OR when any file is refactored substantially
**Owner:** web lead
**Scope:** verify each ignore is still correct; migrate to proper types or `useCallback`/memoization where it improves code — 2-4 hours quarterly

---

### TD-005 — `BellDropdown` keyboard navigation is minimal

**Added:** 2026-04-19 (PR #32)
**Source:** a11y fix wrapped menu items in `<div role="menuitem" tabIndex={0}>` with Enter/Space handlers; full arrow-key navigation between items not implemented
**Current state:** Tab moves through items linearly, Enter/Space activate. Works but not idiomatic menu navigation.
**Trigger to revisit:** first a11y audit, or user feedback, or any other menu component requiring the same treatment (we'd do it properly once)
**Owner:** web lead
**Scope:** roving tabindex + arrow handlers + home/end + close-on-escape — ~2 hours; upgrade to shared `<Menu>` primitive for reuse

---

### TD-006 — Admin bypass used to merge wave 1 PRs with red CI

**Added:** 2026-04-19 (wave 1 retrospective)
**Source:** PRs #29, #30, #31 merged with `--admin` because CI on main was red from pre-existing biome + Python setup-uv failures unrelated to the PR content
**Resolution applied:** PR #32 (`chore/fix-ci-red-main`) brought main to green; admin bypass no longer needed
**Policy going forward:** `--admin` merge is only acceptable when the red is documented pre-existing on main AND a green-main fix is queued or in progress. Never for genuine CI regressions. Each bypass should be logged in `docs/merge-log.md` with the justification.
**Trigger to revisit:** if we use `--admin` more than once in a quarter — signals a CI hygiene problem
**Owner:** project lead
**Scope:** ongoing discipline

---

### TD-007 — `oapi-codegen` upstream bug on OpenAPI 3.1 `nullable` (issue #373)

**Added:** 2026-04-19 (TASK_03)
**Source:** OpenAPI 3.1 uses `type: [string, "null"]` for nullable fields; oapi-codegen v2 doesn't yet generate correct Go types for this pattern
**Current workaround:** TASK_03 output uses optional fields where possible; where nullable is required semantically, hand-patching is tracked in `apps/api/codegen/patches/`
**Trigger to revisit:** when oapi-codegen releases a fix for [deepmap/oapi-codegen#373]; or when we hit a case where hand-patching is too fragile
**Owner:** backend lead
**Scope:** remove patches + regenerate — ~1 hour after upstream fix

---

### TD-008 — `apps/ai/uv.lock` generation is manual for new Python deps

**Added:** 2026-04-19 (PR #32)
**Source:** first commit of `uv.lock` was manual; new deps require contributors to remember to regenerate
**Current state:** no pre-commit hook for `uv lock`
**Trigger to revisit:** first time lock drift causes a CI failure
**Owner:** AI service lead
**Scope:** add `uv lock` to pre-commit or to a workspace-level script invoked on `pnpm install` — 30 min

---

## Resolved

### TD-R001 — `@investment-tracker/design-tokens` subpath exports missing types

**Resolved:** 2026-04-19 in PR #32 commit 2 (`fix(tokens): add types to subpath exports + build on typecheck`)
**Was:** `exports["./brand"]` defined as plain string (JS only), so TypeScript couldn't resolve types; fresh CI checkouts without build artifacts failed `tsc` with TS2307
**Fix:** rewrote `exports` map with `{ types, default }` objects for all JS subpaths; `typecheck` script now triggers `node build.js` to guarantee artifacts; `prepare` hook runs `pnpm install` so tokens are auto-built

### TD-R002 — Port `:8080` conflict with system java.exe on Windows dev

**Resolved:** 2026-04-19 in TASK_01 follow-up
**Was:** API default listen addr `:8080` collided with a pre-existing Java process on the dev's machine
**Fix:** made `API_LISTEN_ADDR` configurable via env, default documented as `:8090` in `.env.example`

---

## Process

- Log it here **when** you decide to defer, not weeks later
- Include the reason, the workaround, and the trigger to revisit
- Quarterly: project lead reviews active items, closes stale ones, promotes blockers
- When resolving: move to Resolved section with PR/commit reference, keep the entry (history value)
