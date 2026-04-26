# Slice — Chat Polish v1 (real product chat surface)

**Date:** 2026-04-27
**Owner (kickoff):** tech-lead
**Implementer (proposed):** frontend-engineer
**Reviewer:** code-reviewer (post-merge safety net) + product-designer (visual diff on mobile drawer + brand-leak fix) + content-lead (one-pass on Lane A copy proposals before merge)
**Pairs with audit:** `docs/reviews/2026-04-27-real-chat-polish-audit-tech-lead.md`
**PO directive:** 2026-04-27 «доработать чат»

---

## Scope + Anchor

- **Worktree:** new — `worktrees/chat-polish-v1` (kept off the active landing branch `feat/lp-provedo-first-pass`)
- **Branch:** `feat/chat-polish-v1`
- **Base SHA:** `409cda9` (current main tip per `docs/PO_HANDOFF.md`)
- **Estimated LOC:** ~400-500 (production) + ~150 (tests)
- **Files touched (estimated):** 7 production + 3 tests
- **No backend change.** No OpenAPI change. No new design token. No new package surface.

## Why critical

Real chat is the product's anchor surface — the «Ask Provedo» promise lives or dies here. Five gaps in this slice are visible in any 5-minute alpha demo:

1. **Brand leak** — three user-facing strings still say «Claude» (model name, not brand). For a closed alpha that introduces «Provedo» to friends-and-family, this is the single most embarrassing miss.
2. **Silent failure on stream errors** — partial assistant message sits dead with no error badge or retry. Looks broken, not «alpha».
3. **Mobile chat is unusable** — sidebar takes the whole viewport. iOS users hit the input-bar-behind-address-bar bug. PO directive said «доработать», not «desktop-only ship».
4. **Stop control lives outside the input pill** — every user already trained on Claude.ai / ChatGPT looks for in-pill send-stop morph. Current external pill reads as «engineering shipped before designer».
5. **Sidebar destructive action with no confirmation** — one stray click destroys a Provedo conversation forever. Trust-eroding.

## What's ready on backend / frontend

**Backend:** ✅ stable. No changes required.
- `/ai/chat/stream` SSE endpoint, `/ai/conversations` CRUD, tier-limit 403, rate-limit headers — all wired and consumed by `useChatStream`, `useConversation(s)`, `useCreate/DeleteConversation`.
- `RateLimitSnapshot` carries `reset` field (used in F4 conditional UsageIndicator render).

**Frontend:**
- ✅ `chat-reducer.ts` already produces `{ phase: 'error', message, error: ChatErrorView }` — UI just doesn't render the error view (gap B3, B4).
- ✅ `ChatInputPill` has `sending` prop and disabled send-arrow — needs visual morph extension (A3).
- ✅ `useChatStream` is idempotent — `sendMessage(text)` is safe to call from a Retry button (B3).
- ✅ `useDeleteConversation` already optimistic via cache invalidation — confirm pattern doesn't need new state machine.
- ✅ Server components in `(app)/chat/page.tsx` + `[id]/page.tsx` already handle hydration via `initialData`.

**Visual system:**
- ✅ Design tokens (`bg-background-elevated`, `border-border-subtle`, `text-text-primary`, etc.) are stable.
- ✅ shadcn primitives (`Sheet` for mobile drawer, `Button`, `Skeleton`) are in `@investment-tracker/ui` per `packages/ui/src/index.ts`.

## Decomposition

Five fix groups, sequenced by risk (lowest first → highest last). Each step is independently merge-able if QA blocks the slice mid-way.

### Step 1 — Brand-leak fix (CRITICAL · XS)

**Files:**
- `apps/web/src/components/chat/empty-conversation-state.tsx`
- `apps/web/src/components/chat/chat-input-bar.tsx`
- `apps/web/src/components/chat/conversations-sidebar.tsx`

**Changes:**

1. `empty-conversation-state.tsx:22-26` — replace:
   ```
   <h2>Ask your portfolio anything</h2>
   <p>Claude has read-only access to your positions, transactions, and market data. Try one of these:</p>
   ```
   with:
   ```
   <h2>Ask Provedo about your portfolio</h2>
   <p>I notice patterns and explain what I see — the call is yours.</p>
   <p className="text-xs text-text-tertiary">Read-only access to your positions, transactions, and market data.</p>
   ```

2. `chat-input-bar.tsx:70` — replace `placeholder={streaming ? 'Claude is responding…' : 'Ask your portfolio…'}` with `placeholder={streaming ? 'Provedo is responding…' : 'Ask Provedo…'}`.

3. `conversations-sidebar.tsx:62` — replace `description="Start one to ask Claude about your portfolio."` with `description="Start one to ask Provedo about your portfolio."`.

4. **Re-word tier-limit toasts for consistency** (audit gap B2):
   - `chat-view-live.tsx:30-35` and `conversations-sidebar-live.tsx:32-37` and `empty-chat-shell.tsx:28-34`: standardize on title «Daily AI limit reached» + description «You've used today's free messages. They reset at midnight UTC.» + warning tone. Drop «conversations» / «messages» wording mismatch.

**Lane A check:** all replacement copy holds verb-allowlist (`notices`, `explains`) and zero banned co-occurrences (no advice/recommend/strategy/suggest/tell-you).

**Tests:** snapshot update only — `chat-message-item.test.tsx` and `streaming-message-view.test.tsx` don't cover these strings; add a test in `empty-conversation-state.test.tsx` (new) asserting (a) brand string «Provedo» appears, (b) banned co-occurrence words absent.

**Effort:** XS · ~50 LOC.

### Step 2 — Inline stream-error banner with retry (CRITICAL · M)

**New file:** `apps/web/src/components/chat/stream-error-banner.tsx`

**Files modified:**
- `apps/web/src/components/chat/chat-message-list.tsx` — render banner when `stream.phase === 'error'`
- `apps/web/src/components/chat/chat-view-live.tsx` — pass `onRetry` callback wired to `sendMessage(lastUserText)`

**Component:** `<StreamErrorBanner error={ChatErrorView} onRetry={() => void} />`

- Reads `error.code`, picks copy:
  - `NETWORK_ERROR` / `AbortError` → «Connection dropped. Provedo received your message but couldn't finish.»
  - `INTERNAL_ERROR` / 5xx-shaped → «Provedo couldn't reach the model. Try again in a moment.»
  - `RATE_LIMITED` (429) → «Too many requests right now. Try again in a moment.»
  - `TIER_LIMIT_EXCEEDED` → suppressed (already handled by toast + Step 4 inline disabled-state).
  - default → fall back to `error.message` raw.
- Footer line: `requestId` rendered in `font-mono text-xs text-text-tertiary` for support.
- `[Retry]` button — primary intent, calls `onRetry`.
- Uses tokens: `border-state-negative-subtle`, `bg-state-negative-soft` (verify token names in `packages/ui/src/tokens` before slice — fall back to neutral if missing).

**Wire-up in `chat-view-live.tsx`:**
- Track `lastUserText` in component state (already implicit in `pendingUser.content[0].text`).
- Pass `onRetry={() => onSend(lastUserText)}` when `state.phase === 'error'`.

**Lane A check:** «Provedo received your message but couldn't finish» — Provedo is subject, verbs are receive/finish (allowlisted neutrals, not in §6.5). ✅

**Tests:** new `stream-error-banner.test.tsx` — render with each error code, assert copy + retry button calls callback.

**Effort:** M · ~150 LOC + ~80 LOC tests.

### Step 3 — In-pill send→stop morph (HIGH · S)

**Files:**
- `packages/ui/src/primitives/ChatInputPill.tsx` — extend with optional `streaming?: boolean` + `onStop?: () => void` props
- `apps/web/src/components/chat/chat-input-bar.tsx` — pass `streaming` + `onStop`, drop the external Stop pill block (lines 73-83)

**ChatInputPill change:**
- When `streaming === true`: send-arrow button morphs into a Square (`Square` from lucide-react) icon, swaps `aria-label` to «Stop generating», clicking calls `onStop()` instead of `onSubmit()`.
- Disabled state logic stays the same; `streaming` is a separate visual mode that overrides `canSend` only for the icon swap.
- Keep Escape-key cancel in `chat-input-bar.tsx` for power users.

**`chat-input-bar.tsx` change:**
- Drop the entire `{streaming ? <button>…Stop…</button> : null}` block.
- Forward `streaming` + `onStop={onCancel}` props down into ChatInputPill.

**Lane A check:** «Stop generating» — neutral imperative on the system, not the user. ✅

**Tests:**
- Update `packages/ui/src/primitives/ChatInputPill.test.tsx` (verify file exists; if not, add):
  - When `streaming=true`, button has aria-label «Stop generating» and clicking calls `onStop`, NOT `onSubmit`.
  - When `streaming=false`, original send behavior preserved.

**Effort:** S · ~80 LOC + ~50 LOC tests.

### Step 4 — Mobile chat usable (CRITICAL · M)

**New file:** `apps/web/src/components/chat/chat-mobile-header.tsx` — hamburger trigger + active-conversation title.

**Files modified:**
- `apps/web/src/app/(app)/chat/layout.tsx` — change `h-[calc(100vh-56px)]` to `h-[calc(100dvh-56px)]`. Add safe-area wrapper.
- `apps/web/src/app/(app)/chat/page.tsx` — render mobile header above the EmptyChatShell on `<md`.
- `apps/web/src/app/(app)/chat/[id]/page.tsx` — render mobile header above the ChatView on `<md`.
- `apps/web/src/components/chat/conversations-sidebar.tsx` — add prop `onCloseMobile?: () => void` (called after `onPick` and after `onNewChat` to dismiss the drawer on selection).
- `apps/web/src/components/chat/chat-view-live.tsx` — add `pb-[env(safe-area-inset-bottom)]` to the input-bar container (line 93).

**Mobile drawer pattern:**
- Use shadcn `Sheet` (verify in `@investment-tracker/ui` exports; if absent, add radix-ui dialog wrapper as a primitive — flag if so).
- Hamburger button in `chat-mobile-header.tsx` opens Sheet from left, contains `<ConversationsSidebarLive>`.
- On `<md` the inline `<aside>` is hidden via `hidden md:flex` on the sidebar root.
- Active conversation title shown in header (truncate, max-w-full).
- New chat shortcut button (Plus icon) in header for one-tap new chat without opening drawer first.

**No tablet hybrid yet** — ship mobile drawer + desktop static sidebar. Tablet medium-state (collapsed-rail sidebar) is TD-deferred.

**Lane A check:** mobile-header copy — only «New chat» (allowlisted imperative) and the conversation title (user-derived). ✅

**Tests:**
- New `chat-mobile-header.test.tsx` — render, click hamburger triggers `onOpenSidebar`, click new-chat triggers create.
- Visual regression at 375px — out-of-band, dispatched to qa-engineer post-merge for Playwright snapshot.

**Effort:** M · ~250 LOC + ~80 LOC tests.

### Step 5 — Sidebar polish: last-message preview + delete-with-confirm (HIGH · S)

**Files modified:**
- `apps/web/src/components/chat/conversations-sidebar.tsx` — extend `SidebarItem`:
  1. When `conversation.title` is non-empty AND `last_message_preview` is also non-empty AND they differ, show the preview as a single-line truncated subtitle below the title. Position above the timestamp.
  2. Replace one-click delete with two-step inline confirm: first click → trash icon swaps to «Delete?» text + «Cancel» icon. Second click on «Delete?» → fires `onDelete`. Click outside or `Cancel` → reverts. Auto-revert after 3s.

**Lane A check:** «Delete?», «Cancel» — neutral system verbs. ✅

**Tests:**
- New `conversations-sidebar.test.tsx`:
  - Renders preview when title and preview differ.
  - First trash click does NOT call onDelete; shows «Delete?»; second click calls onDelete.
  - Auto-revert after 3s timer (use `vi.useFakeTimers`).
- Existing tests: none for this file — new file is fine.

**Effort:** S · ~100 LOC + ~80 LOC tests.

### Step 6 (optional, conditional on slice budget) — UsageIndicator conditional render (MEDIUM · S)

**File:** `apps/web/src/components/chat/chat-input-bar.tsx`

**Change:** wrap `<UsageIndicator>` in a conditional — `rateLimit && rateLimit.remaining <= 10`. Always-visible variant is noise; warning-threshold variant is signal.

**Effort:** S · ~30 LOC.

**Decision:** ship in this slice if Steps 1-5 land under 450 LOC; otherwise defer to TD-only.

---

## NOT doing (explicit out-of-scope)

- ❌ **No backend changes** — no OpenAPI edit, no Core API handler edit, no AI Service prompt edit.
- ❌ **No SSE reconnect+resume** — TD-066 stays open; UI mitigation only via Step 2 banner.
- ❌ **No regenerate button** (E2) — billing-semantics question for separate backend dispatch.
- ❌ **No edit-and-resend** on user messages (E3).
- ❌ **No conversation search** (D2) — backend slice required.
- ❌ **No conversation rename** (D3) — pending OpenAPI verification.
- ❌ **No source-citation linking** (E4) — partial frontend version is heuristic-only; defer.
- ❌ **No file attach** (F2), **no voice input**, **no multi-LLM routing**, **no agent-builder**.
- ❌ **No hero ChatMockup changes** — already shipped via slice-LP3.2 2026-04-27.
- ❌ **No design-token reconciliation** between marketing `--provedo-*` vars and app `bg-background-elevated` tokens (G1, G2). TD-only.
- ❌ **No tablet collapsed-rail sidebar** — mobile drawer + desktop static only. Tablet medium state is TD.
- ❌ **No persona-declaration first-person AI surface** (audit C6) — combine into the empty-state copy in Step 1, no separate persona block.

## Acceptance criteria

### Brand voice
- [ ] No string «Claude» appears in user-facing chat surfaces (grep `apps/web/src/components/chat` and `apps/web/src/app/(app)/chat` for «Claude» — must be 0 hits).
- [ ] Empty state header reads «Ask Provedo about your portfolio» + Lane A subline.
- [ ] Input placeholder reads «Provedo is responding…» while streaming.
- [ ] Sidebar empty state references Provedo, not Claude.
- [ ] All new copy holds `04_BRAND.md` §6.2 verb allowlist + §6.5 5-item banned co-occurrence list (content-lead one-pass review confirms).

### Stream error UX
- [ ] When SSE drops mid-stream (simulated by aborting fetch from devtools), inline banner appears with retry button + requestId footer.
- [ ] Retry button re-sends the last user message via `useChatStream.sendMessage`.
- [ ] No silent half-streamed-message-and-no-explanation state.
- [ ] 5xx, 429, generic ApiStreamError each pick correct copy variant.
- [ ] TIER_LIMIT_EXCEEDED is NOT shown in the banner (Step 4 of audit's B1 belongs to a follow-up — the toast already handles it; banner stays out of that path).

### In-pill stop morph
- [ ] While streaming, the in-pill arrow button shows a Square icon with `aria-label="Stop generating"`.
- [ ] Click calls cancel (`useChatStream.cancel`).
- [ ] Escape-key in textarea still cancels (`chat-input-bar.tsx:46-49`).
- [ ] No external Stop pill remains in the DOM.

### Mobile UX
- [ ] At ≤768px viewport, the sidebar is hidden by default; a hamburger button in a top header opens it as a left-side drawer.
- [ ] Selecting a conversation or starting a new one auto-dismisses the drawer.
- [ ] Layout uses `100dvh` (verify via Safari iOS that the input bar is reachable above the URL bar).
- [ ] Input bar respects safe-area-inset-bottom on iOS notch/home-indicator devices.
- [ ] Conversation header on mobile shows truncated active-conversation title.

### Sidebar polish
- [ ] Last-message preview renders as single-line truncated subtitle below the title.
- [ ] Trash-icon click does NOT immediately delete; first click shows «Delete?» + «Cancel» inline; second click on «Delete?» calls delete; «Cancel» or 3-second auto-revert restores trash icon.
- [ ] Optimistic delete behavior preserved.

### Engineering
- [ ] No new dependencies in `apps/web/package.json` (Sheet must be from existing `@investment-tracker/ui` or radix-ui already vendored).
- [ ] No new design tokens added; existing tokens reused.
- [ ] Coverage ≥85% per `apps/web` gate; unit tests added for each new component.
- [ ] No `console.log`, no `any` in new code.
- [ ] Bundle size delta < +5kb gzipped (Sheet primitive should be tree-shaken from existing import).
- [ ] All 8 CI jobs green.

### Lane A copy gates
- [ ] All new strings pass content-lead one-pass review (dispatch as part of pre-merge gate).
- [ ] Grep `apps/web/src/components/chat` for any of `advice|advis|recommend|strateg|suggest|tells you|tell you to` — must be 0 hits.

## Commit structure

**Two commits.**

**Commit 1 — implementation:**
```
feat(chat): polish v1 — brand-voice fix, inline error banner, in-pill stop, mobile drawer, sidebar refinements

- Replace «Claude» with «Provedo» in 3 user-facing strings; align tier-limit toasts
- Add StreamErrorBanner with code-aware copy + retry CTA + requestId footer
- Morph in-pill send button into Stop while streaming; drop external Stop pill
- Mobile drawer sidebar via Sheet at <md; 100dvh + safe-area-inset for iOS
- Sidebar: last-message preview subtitle + two-step delete-with-confirm
- Lane A: all new copy holds verb-allowlist + banned co-occurrence list
```

**Commit 2 — docs:**
```
docs: close slice chat-polish-v1

- TECH_DEBT: close audit gaps C2-C4 (brand leak), B3-B4 (silent stream-error), A3+F6 (Stop UX), J1-J3 (mobile), D1+D4 (sidebar polish)
- TECH_DEBT: add new TDs for deferred items (G1+G2 visual reconciliation, F4 conditional UsageIndicator if not shipped, H3 conversation-switch loading.tsx)
- merge-log: SHA + outcome
- PO_HANDOFF: §10 lessons learned (real-chat surface gap discovery)
```

## Pre-flight checks

Run before opening PR:

```sh
# 1. Brand-leak check
rg -i 'claude' apps/web/src/components/chat apps/web/src/app/\(app\)/chat
# Expected: 0 hits.

# 2. Lane A banned-cooccurrence check
rg -i 'advic|advis|recommend|strateg|suggest|tells? you' apps/web/src/components/chat
# Expected: 0 hits.

# 3. Type check
pnpm --filter @investment-tracker/web typecheck

# 4. Lint
pnpm --filter @investment-tracker/web lint

# 5. Unit tests
pnpm --filter @investment-tracker/web test

# 6. Coverage gate (≥85% web)
pnpm --filter @investment-tracker/web test:coverage

# 7. Build
pnpm --filter @investment-tracker/web build

# 8. Bundle-size diff
# Inspect .next/analyze output if Vercel preview build available
```

## Report format

When this slice lands, the implementer reports:

```
git log --oneline -3
# (impl SHA, docs SHA, then prior tip)

Acceptance checklist:
[x] No «Claude» strings remain
[x] Empty state copy holds Lane A
[x] Stream error banner ships with retry
[x] In-pill stop morph
[x] Mobile drawer at <md, 100dvh, safe-area
[x] Sidebar preview + delete-with-confirm
[x] All 8 CI jobs green
[x] Coverage ≥85%

Surprise findings (as new TDs):
- TD-NNN: <thing discovered, priority, trigger>

Pre-merge dispatches completed:
- content-lead Lane A copy review: <link to review doc>
- product-designer mobile drawer visual diff: <link or note>
- qa-engineer Playwright mobile snapshots: <follow-up issue ref or done>
```

---

## Sequencing recommendation

If implementer wants a minimum-risk path:

1. Step 1 (brand leak) — XS, untouchable; ship in 30 min, rebases cleanly on anything.
2. Step 5 (sidebar polish) — isolated to one file, safe to land early.
3. Step 3 (in-pill stop morph) — touches one UI primitive + one consumer; ship before Step 4 to avoid rebase conflicts on input bar.
4. Step 2 (stream-error banner) — depends on Step 3 (input-bar refactor) cleanly merged first.
5. Step 4 (mobile) — touches layout + sidebar consumer; ship last, biggest visual diff for QA.

Each step is independently merge-able if the slice gets cut short.
