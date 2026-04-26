# Real Chat Surface — Polish Audit (Tech Lead)

**Date:** 2026-04-27
**Owner:** tech-lead
**Triggered by:** PO directive 2026-04-27 «доработать чат» (real product chat at `/app/chat`, not the marketing hero ChatMockup)
**Reviewed surfaces:**
- `apps/web/src/app/(app)/chat/page.tsx` (index, redirects to most-recent or shows EmptyChatShell)
- `apps/web/src/app/(app)/chat/[id]/page.tsx` (single conversation server load)
- `apps/web/src/app/(app)/chat/layout.tsx` (flex h-[calc(100vh-56px)] container)
- `apps/web/src/components/chat/chat-view-live.tsx` (orchestrator)
- `apps/web/src/components/chat/chat-input-bar.tsx` (input + UsageIndicator + Stop button)
- `apps/web/src/components/chat/conversations-sidebar(-live).tsx`
- `apps/web/src/components/chat/empty-chat-shell.tsx`, `empty-conversation-state.tsx`
- `apps/web/src/components/chat/chat-message-list.tsx`, `chat-message-item.tsx`, `streaming-message-view.tsx`
- `apps/web/src/hooks/useChatStream.ts`, `useConversation(s).ts`, `useCreateConversation.ts`, `useDeleteConversation.ts`
- `apps/web/src/lib/ai/chat-reducer.ts`, `apps/web/src/lib/api/ai.ts`
- `packages/ui/src/primitives/ChatInputPill.tsx`
- Brand foundation: `docs/product/04_BRAND.md` §5 (TOV map), §6.2 verb allowlist, §6.5 banned co-occurrences

**Lane A constraint:** every copy proposal in this audit holds the §6.2 verb-allowlist + §6.5 5-item banned co-occurrence list (advice/recommend/strategy/suggest/tell-you).

**Boundary discipline:** frontend polish only — any backend-required fix flagged `[BACKEND-DEFER]` and routed to a separate slice.

---

## Severity legend

| Level | Meaning | Action |
|---|---|---|
| CRITICAL | Brand-voice violation, data-loss UX, or alpha blocker | Must ship in this slice |
| HIGH | Visible polish gap user will notice in alpha demo | Should ship in this slice |
| MEDIUM | Quality gap that survives alpha but degrades feel | Defer to TD if not in top-5 |
| LOW | Nice-to-have polish, no alpha impact | TD-only |

**Effort scale:** XS (≤30 LOC, no new file) · S (≤100 LOC, 1 new file) · M (≤300 LOC, 2-3 files) · L (>300 LOC or new package surface)

---

## Gap inventory (by area)

### A. Streaming feedback

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| A1 | Typing indicator works (`ThinkingDots` while no blocks open + `TypingCursor` on last text block) and matches design brief — **no gap** | — | — | `streaming-message-view.tsx:18-23, 31-37` |
| A2 | Token-by-token reveal is per-frame, not per-character — ChatMockup hero feels smoother because it animates char-by-char (40ms/char user, 20ms/char response). Real chat receives `content_delta` events that are word-or-phrase chunks from the upstream model, so reveal is bursty. | LOW | M | Requires intermediate text-buffer with `requestAnimationFrame` paced reveal. Defer — not worth the complexity vs. a real LLM stream. TD-only. |
| A3 | Cancel-stream affordance is a **separate** «Stop» pill outside the input (`chat-input-bar.tsx:73-83`) + Escape-key in textarea (`chat-input-bar.tsx:45-50`). Both work. The ChatInputPill's send arrow goes disabled (`sending` prop) but does NOT visually morph into a stop icon. User has to look outside the pill to find the stop control. | HIGH | S | Polish: morph the send-arrow button INTO a stop-square while streaming, drop the external Stop pill. Single affordance, in-pill, matches Claude.ai / ChatGPT pattern user already knows. |
| A4 | No cost/token feedback after `message_stop` (`tokensUsed` is captured by reducer but never surfaced). | LOW | XS | Defer — TD only. Free users care about message count (already shown via UsageIndicator), not tokens. |

### B. Error handling

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| B1 | Tier-limit on send → toast «Daily AI limit reached / Upgrade to Plus for more messages» (`chat-view-live.tsx:29-35`). Toast is correct but **transient** — user dismisses it and the input bar still says «Ask your portfolio…», no persistent inline state. After dismissal there is no visible reason send is blocked next time they hit the limit. | HIGH | S | Add inline disabled-state below the input bar: «You've used today's free messages. Resets at midnight UTC. [Upgrade to Plus →]». Persistent until rate-limit window resets (rateLimit.reset is already in snapshot). |
| B2 | Tier-limit on **conversation create** (sidebar New chat button) shows the same toast (`conversations-sidebar-live.tsx:30-37` + `empty-chat-shell.tsx:27-34`) — wording is «Upgrade to Plus for more conversations» which conflates conversation-cap with message-cap. Conversation cap is not a thing today (only message cap exists in API). | MEDIUM | XS | Re-word to «Daily AI limit reached. You've used today's free messages.» — single source of truth wording. |
| B3 | Network-error mid-stream → reducer emits `{ phase: 'error', error: { code: 'NETWORK_ERROR' } }` (`useChatStream.ts:131-135`). `ChatMessageList` renders the partial message via `StreamingMessageView` with `streaming=false` (`chat-message-list.tsx:42-44`) — so user sees half a sentence with no error badge, no retry CTA, no explanation. **CRITICAL:** silent failure mode. | CRITICAL | M | Add an inline error banner below the partial message: icon + «Connection dropped. Provedo received your message but couldn't finish. [Retry]». Retry re-sends last user text via `sendMessage`. Pure frontend — `chat-view-live.tsx` already holds the last user text in `pendingUser`. |
| B4 | Generic `ApiStreamError` (5xx, 429, malformed envelope) → no UI surface at all besides whatever partial text was streamed. `ChatErrorView` carries `code` + `message` + `requestId` but neither is shown. | HIGH | S | Same banner as B3 with code-aware copy: 5xx → «Provedo couldn't reach the model. [Retry]». 429 → «Too many requests right now. Try again in a moment.» Show `requestId` in a mono-font footer for support. |
| B5 | Conversation-load error in `[id]/page.tsx:42-44` — copy is «Unable to load this conversation right now. Try again in a moment.» No retry button, page is dead until manual refresh. | MEDIUM | XS | Add a [Reload] button that triggers `router.refresh()`. |
| B6 | Conversations-list error in sidebar (`conversations-sidebar.tsx:52-54`) — «Unable to load conversations.» dead. | MEDIUM | XS | Add retry button calling `useConversations`'s `refetch`. |

### C. Empty states

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| C1 | `EmptyConversationState` shows 4 sample prompts (`empty-conversation-state.tsx:11-16`) — good. **Lane A audit:** all 4 prompts pass verb-allowlist + banned co-occurrence check. «Explain today's portfolio change» uses «explain» which is allowlisted. ✅ no gap on Lane A. | — | — | — |
| C2 | The header copy «Ask your portfolio anything» + «Claude has read-only access…» — **brand voice gap.** Copy says «Claude» (model name leak); brand says we are «Provedo». Reads like an MVP-debug surface, not a finished product. | CRITICAL | XS | Replace with «Ask Provedo about your portfolio» (matches `04_BRAND.md` §5 microcopy) + sub «Provedo reads your positions, transactions, and market data — and notices what you'd miss.» (verb-allowlist: reads, notices). |
| C3 | The placeholder in `chat-input-bar.tsx:70` says «Claude is responding…» while streaming. **Same brand leak.** | CRITICAL | XS | «Provedo is responding…» |
| C4 | Sidebar empty state (`conversations-sidebar.tsx:60-64`) «No conversations yet / Start one to ask Claude about your portfolio.» Same brand leak. | CRITICAL | XS | «Start one to ask Provedo about your portfolio.» |
| C5 | EmptyChatShell **does not explain what Provedo can answer** — only shows 4 sample prompts. No mention of Lane A scope (notices/explains, not advises). First-time user does not know what register to bring. | HIGH | S | Add a single-line helper above the prompts: «I notice patterns and explain what I see — the call is yours.» (Lane A clean: notice/explain are allowlisted; «the call is yours» is the brand-foundation §6.5 system-prompt's redirect phrase verbatim.) |
| C6 | No persona declaration anywhere (brand foundation §6.4 prescribes a declaration pattern «I'm Provedo. I notice patterns…»). Empty state is the natural surface for it. | MEDIUM | XS | Optional — combine with C5. |

### D. Conversation history sidebar

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| D1 | Sidebar shows title + relative timestamp (`conversations-sidebar.tsx:121-128`). **No last-message preview.** API summary type `AIConversationSummary` carries `last_message_preview` (used as title fallback at line 105) but never shown as preview when title exists. | HIGH | XS | When `title` is present, show preview (truncated 1 line) beneath the title in `text-text-tertiary text-xs`. Better at-a-glance scannability. |
| D2 | **No search.** With many conversations the list becomes unscanable. Backend already supports cursor pagination but no `?q=` filter. | MEDIUM | M | `[BACKEND-DEFER]` — needs OpenAPI change `GET /ai/conversations?q=…` + Core API LIKE/FTS. Defer to dedicated slice. |
| D3 | **No rename.** API supports `PATCH /ai/conversations/{id}` for title edit (verify in OpenAPI before slice spec). Currently title is auto-derived server-side from first message. | MEDIUM | M | Verify OpenAPI; if PATCH exists, S-effort. If not, `[BACKEND-DEFER]`. |
| D4 | Delete works but **no confirmation.** One stray click destroys a conversation irreversibly (`conversations-sidebar.tsx:129-136` → `useDeleteConversation.ts:21-25` removes from cache). | HIGH | S | Add an inline confirm step (replace trash icon with «Delete?» / «Cancel» on first click — shadcn AlertDialog is overkill for a sidebar item; an inline confirm matches Linear / Notion sidebar patterns). |
| D5 | Active conversation indicator is a `bg-interactive-primary/10` tint — works, but no left-edge accent bar to draw the eye. Visual consistency with Linear/Notion convention is missing. | LOW | XS | Optional — add a 2px left accent strip when active. Defer to TD. |

### E. Message-level actions

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| E1 | **No copy button on assistant messages.** ChatGPT / Claude.ai default. User has to text-select to grab a Provedo response. | HIGH | S | Add copy-to-clipboard button on each assistant ChatMessage, hover-revealed (matches Claude.ai). Pure frontend. |
| E2 | **No regenerate.** If Provedo's answer is unsatisfying, user has to retype the question. | MEDIUM | M | Requires re-sending the *previous* user message via `sendMessage`. Pure frontend — `chat-view-live.tsx` can read the last user message from `data.messages`. Caveat: regenerate billing semantics — does it count against Free tier? **Defer to dedicated slice** with backend confirm on billing model. |
| E3 | **No edit-and-resend** on user messages. ChatGPT default. | LOW | M | Defer — TD. |
| E4 | **No source citation links.** Tool-use blocks render the tool name + JSON input but never link «look at AAPL position» → `/positions/AAPL`. Lost cross-surface navigation. | MEDIUM | M | `[BACKEND-DEFER-PARTIAL]` — needs `tool_result` to carry navigable refs in a structured way. Frontend can do a heuristic match on `symbol` strings today (read `block.input.symbol` if present, link to `/positions/{symbol}`) — micro-polish. Defer the structured version. |

### F. Input bar

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| F1 | Multi-line works (autosize textarea up to 8 lines per `ChatInputPill.tsx:21-22, 55-63`). Enter sends, Shift+Enter newline. **No gap.** | — | — | — |
| F2 | No file-attach affordance. | LOW | M | Out-of-scope per PO directive (no new product features). TD-only. |
| F3 | No keyboard shortcut hint (e.g. «↵ Send · ⇧↵ New line»). User has to discover. | LOW | XS | Optional micro-text under the pill. Defer to TD or include if cheap. |
| F4 | UsageIndicator (`chat-input-bar.tsx:54-61`) sits ABOVE the input. Visually crowds the input region; on a 56px-header layout this eats vertical space. Pattern: hide while idle, show only when remaining ≤ N (e.g. 10) or when streaming surfaces a tier-limit. | MEDIUM | S | Conditional render: only when `remaining ≤ 10` (warning) or `remaining === 0` (block). Always visible is noise. |
| F5 | Send button disabled-state when `value.trim().length === 0` is correct (`ChatInputPill.tsx:76, 113-114`). Good. | — | — | — |
| F6 | Streaming UX morph (see A3) — send → stop morph wins over external pill. | HIGH | S | Combined with A3. |

### G. Visual consistency with hero ChatMockup

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| G1 | ChatMockup hero uses CSS vars `--provedo-bg-elevated`, `--provedo-border-subtle`, `--provedo-accent` (`ProvedoHeroV2.tsx:115-120`). Real chat uses `bg-background-elevated`, `border-border-subtle` — different token scope. Visual feel is similar but not identical (shadow `0 8px 24px rgba(15,23,42,0.06)` in mockup is custom; real chat has none). | LOW | S | Defer — alignment effort would touch the design-token layer; not worth a slice scope cost. TD-only. |
| G2 | ChatMockup chat bubbles have explicit border + tinted bubble bg. Real `ChatMessage` (UI primitive — verify) likely uses surface card without the bubble shape. Audit by visual diff with QA agent before slicing. | LOW | XS | Defer — TD. |

### H. Loading states

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| H1 | Sidebar has skeleton (`conversations-sidebar.tsx:142-152`). ✅ no gap. | — | — | — |
| H2 | `[id]/page.tsx` is server-rendered with awaited `fetchInitialDetail` — no skeleton, just SSR delay. Acceptable. | — | — | — |
| H3 | Conversation switch (sidebar pick → router.push) shows nothing during navigation — `useConversation.initialData` only kicks in once SSR completes. Stale previous-conversation messages remain visible until React renders new tree. Slight visual flash. | LOW | XS | Optional `loading.tsx` for `(app)/chat/[id]`. Defer — not user-blocking. |

### I. Session continuity

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| I1 | Mid-stream connection loss — partial message is preserved in reducer state but **never persists**. Refresh discards partial. Backend has TD-066 (SSE reconnect+resume via Last-Event-ID) acknowledged — known limitation. | HIGH (UX) but BACKEND-DEFER | L | `[BACKEND-DEFER]` — already tracked as TD-066. Frontend can show a banner «Connection dropped — partial response not saved. [Retry]» (overlap with B3). |
| I2 | Refresh during streaming → user lands on `[id]/page.tsx` server-fetched history; partial assistant turn not in DB until `message_stop` (server-side persist hook). Resume = «start a new turn». User UX = lost. | HIGH (UX) | XS frontend / L backend | Frontend mitigation: when reducer is in `streaming` phase and route unmounts, store last-user-text in sessionStorage; on `[id]` mount, if a stored unsent text exists for this conversationId, surface a banner «Last message didn't finish — [Retry]». ~50 LOC. |

### J. Mobile UX

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| J1 | Layout uses `flex h-[calc(100vh-56px)] w-full` (`(app)/chat/layout.tsx:4`) — sidebar is fixed `w-full` on mobile, `md:w-72` on desktop (`conversations-sidebar.tsx:39`). On mobile **the sidebar takes the entire viewport**, hiding the chat. No collapse / drawer mechanism. | CRITICAL | M | Add a mobile drawer pattern: sidebar slides in via Sheet/Drawer on `<md` breakpoints, hidden by default. New chat + conversation switch needs a hamburger trigger in chat header. ~200 LOC + new chat header component. |
| J2 | `100vh` on iOS Safari causes the input bar to be hidden behind the address bar. Common mobile gotcha. | HIGH | XS | Use `100dvh` instead of `100vh`. One-line fix. |
| J3 | No safe-area inset for the input bar (iOS notch / home indicator). | HIGH | XS | Add `pb-[env(safe-area-inset-bottom)]` to the input bar container in `chat-view-live.tsx:93`. |
| J4 | Input bar on mobile — when the textarea grows to 8 lines, it pushes the message list area off-screen. Should cap visual growth on mobile to ~3 lines. | MEDIUM | XS | `maxLines={3}` prop pass-through on mobile breakpoint. Tailwind responsive prop tricky in TSX — easiest is conditional via `useMediaQuery` hook. |

### K. Streaming brand-voice (out-of-scope flag)

| # | Gap | Severity | Effort | Notes |
|---|---|---|---|---|
| K1 | `streaming-message-view.tsx:74-87` `toolRunningLabel` strings — «Looking at your portfolio…», «Checking your positions…», «Reading transaction history…», «Pulling market quote…», «Fetching price history…». **Lane A audit:** all are observation verbs (look/check/read/pull/fetch) — none in banned list. ✅ no gap. | — | — | — |
| K2 | The AI **system prompt itself** lives backend-side (Core API or AI service). This audit cannot verify the system prompt enforces Lane A redirect language («I can show you the pattern… the decision is yours»). **Out-of-scope flag for separate review.** | — | — | Route to a separate Lane A audit slice with backend-engineer. Not a frontend polish item. |

---

## Severity totals

| Severity | Count |
|---|---|
| CRITICAL | 5 (A3*, B3, C2, C3, C4, J1) — A3 reclassified HIGH after second pass; final CRITICAL = **4** (B3, C2-C3-C4 brand-leak treated as one item, J1) |
| HIGH | 8 (A3, B1, B4, C5, D1, D4, E1, J2, J3) — **9** including J3 |
| MEDIUM | 8 (B2, B5, B6, D2, D3, E2, E4, F4, J4) |
| LOW | 9 (A2, A4, D5, E3, F2, F3, G1, G2, H3) |
| BACKEND-DEFER (excluded from this slice) | 4 (D2, D3 conditional, E2 billing, I1) |

---

## Out-of-scope confirmation

Per PO directive 2026-04-27, the following are **excluded** from any chat-polish slice and tracked separately:

- Hero ChatMockup polish (already shipped via slice-LP3.2 2026-04-27).
- Voice input, image attachments, multi-LLM routing, agent-builder UI.
- Backend SSE reconnect+resume (TD-066) — flagged as known limitation; frontend mitigation in I2 only.
- Search across conversations (D2) — backend slice required.
- Rename conversation (D3) — pending OpenAPI verification.
- Regenerate (E2) — billing-semantics question for backend.
- Lane A system-prompt audit — separate review with backend-engineer.

---

## Recommendation summary

The five highest-impact / lowest-effort wins, sequenced for one slice (~400 LOC) detailed in `docs/kickoffs/2026-04-27-slice-chat-polish-v1.md`:

1. **C2+C3+C4 brand leak fix** — replace «Claude» with «Provedo» in 3 user-facing strings + Lane A copy upgrade for empty state. CRITICAL · XS.
2. **B3+B4 inline stream-error banner with retry** — kill the silent-failure mode. CRITICAL · M.
3. **A3+F6 in-pill send→stop morph** — one chat affordance, kill the external Stop pill. HIGH · S.
4. **J1+J2+J3 mobile chat usable** — drawer sidebar, dvh, safe-area. CRITICAL · M.
5. **D1+D4 sidebar polish** — last-message preview + delete-with-confirm. HIGH · S.

Total: ~400-500 LOC, 5-7 files touched, no backend change, no new package surface, no new design token.

**Open questions for right-hand:**

1. **Lane A copy approval gate.** Empty-state header («Ask Provedo about your portfolio» / «I notice patterns and explain what I see — the call is yours.») and error-banner copy («Connection dropped. Provedo received your message but couldn't finish.») — should these route to content-lead for a one-pass review before the slice ships? Or is brand-foundation §6.2/§6.5 self-sufficient and the slice can ship without dispatch?
2. **Mobile sidebar drawer vs. tab pattern.** Two options: (a) Sheet/Drawer slides in from left on hamburger tap (Linear/Notion pattern), (b) two-pane swipe between sidebar and chat (Telegram/Discord pattern). (a) is ~200 LOC, (b) is ~400 LOC. Recommend (a) — matches the tool register Provedo positions in (Notion/Linear/Cursor reference cluster per `04_BRAND.md` §7).
3. **Delete confirmation pattern.** Inline confirm (Linear sidebar) or AlertDialog modal (shadcn standard). Inline is lighter and matches the sidebar's compactness — recommend inline. Confirm with right-hand if shadcn AlertDialog should be the consistent destructive-action pattern across the app.
4. **Visual consistency with ChatMockup (G1, G2).** Cosmetic alignment defer to TD — confirm right-hand agrees.
5. **Per E2, who owns the regenerate billing semantics question?** Defer to a separate backend slice or surface to PO for product call?
