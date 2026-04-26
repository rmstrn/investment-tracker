# CC Kickoff — TASK_07 Web Frontend (Slice 3)

**Scope:** AI Chat UI — conversations list + streaming message view + SSE client over fetch + rich content rendering (text / tool_use / impact_card / callout) + tier-limit paywall + rate-limit surface.
**Anchor:** 1500-2000 LOC (стрим-парсер, reducer на content blocks, convos CRUD UI — нетривиально, но половина UI-primitives есть).
**Worktree:** `D:/investment-tracker-task07-s3` (feature/task07-slice3 branch from main).
**Base:** main tip = `6bddbf6` (или свежее — после PR C merge).
**Parallels with:** PO operational deploy setup (Fly apps create, Doppler, DNS) — zero code overlap. Также PR D workers (не стартовал ещё) — drift risk=0.

---

## Context

AI Chat — главный differentiator продукта. Backend готов end-to-end через PR #42/#43/#44:
- Python AI Service (TASK_05) streams через `/v1/chat/stream` (SSE).
- Go Core API (B3-ii, PR #44 `c2a2afe`) reverse-proxies SSE с `FlushInterval: -1` → zero-buffer passthrough.
- Clerk auth на proxy layer; AI service sees только service-to-service token.
- AI chat end-to-end живёт в main uz давно; OpenAPI контракт стабилен.
- ai_usage dual-write cleanup (PR #43) уже merged → rate-limit counters reliably counted.

Задача Slice 3 — дать пользователю живой чат в web UI. Stream text token-by-token, render rich content (tool_use cards, impact cards, callouts), handle tier limits через paywall modal, показывать remaining daily quota.

---

## Current state of apps/web (post-Slice 2, main tip 6bddbf6)

### Что есть
- Slice 1 (PR #45): Clerk auth, (app) shell, Dashboard, API client factories (server.ts + browser.ts), providers (QueryClient), usePortfolio pattern, vitest setup, formatters.
- Slice 2 (PR #48): Positions list + detail, pure-presentation/TanStack Query bridge pattern (PositionPriceChartView), vitest.setup.ts afterEach(cleanup) hook.
- Sidebar slot для Chat есть с href `/dashboard` placeholder + disabled. Активация = точечный патч (href → `/chat`, activeSlugFor → add `if (pathname.startsWith('/chat')) return 'chat'`).

### UI primitives (packages/ui, все на месте)
Chat-specific:
- `ChatMessage` (domain/ChatMessage.tsx) — renders role + content; нужно проверить что impact_card/callout поддерживает или расширить.
- `ChatInputPill` (primitives) — input with send button, disabled state, multi-line support.
- `ToolUseCard` (primitives) — collapsed/expanded tool call with input + result preview.
- `TypingCursor` (primitives) — blinking cursor для streaming-in-flight tail.
- `SuggestedPrompt` (primitives) — chip-style prompt shortcut для empty state.
- `TrustRow` (primitives) — «Powered by Claude» footer строка.
- `ExplainerTooltip` (primitives) — для callout kind=explainer inline definitions.

Domain-adjacent:
- `PaywallModal` (primitives) — tier limit reached → CTA to upgrade.
- `UsageIndicator` (primitives) — remaining quota bar/number.
- `FloatingAiFab` (shells) — **не активируем в Slice 3**; полноценная `/chat` page только. FAB = отдельный slice (может Slice 4 вместе с Insights).
- `EmptyState`, `Skeleton`, `Button`, `Card`, `Dropdown`, `Sheet` (для mobile conversation drawer).

### Что отсутствует и Slice 3 добавит
1. `(app)/chat/page.tsx` — main chat route, Server Component (fetch conversations list + current conversation).
2. `(app)/chat/[id]/page.tsx` — individual conversation detail route.
3. `components/chat/` folder:
   - `ConversationsSidebar.tsx` — list of user's conversations + "New chat" button + active highlight.
   - `ConversationsList.tsx` + `ConversationsListLive.tsx` (TanStack Query bridge).
   - `ChatView.tsx` + `ChatViewLive.tsx` — message history + streaming message + input.
   - `ChatMessageList.tsx` — scrollable message container with auto-scroll-to-bottom behavior.
   - `ChatMessageItem.tsx` — routes по role + content type: text → `<ChatMessage>`, tool_use → `<ToolUseCard>`, impact_card → `<ImpactCardView>`, callout → `<CalloutView>`.
   - `ImpactCardView.tsx` — renders AIMessageContentImpactCard (before/after snapshot + top_affected_positions + narrative).
   - `CalloutView.tsx` — renders AIMessageContentCallout (behavioral/explainer/info/warning styling).
   - `StreamingMessage.tsx` — in-flight assistant message assembly (delta accumulation + TypingCursor tail).
   - `ChatInputBar.tsx` — wraps ChatInputPill + submit handler + idempotency-key generation.
   - `EmptyConversationState.tsx` — SuggestedPrompts grid для fresh convo.
4. `lib/ai/sse-client.ts` — fetch + ReadableStream SSE parser (async iterator).
5. `lib/ai/chat-reducer.ts` — content block state machine (delta accumulation, tool_use tracking, message_stop finalization).
6. `lib/api/ai.ts` — typed wrappers: `listConversations()`, `getConversation(id)`, `createConversation(title?)`, `deleteConversation(id)`, `sendChatMessageStream(request)` (returns AsyncGenerator<AIChatStreamEvent>).
7. 4 hooks:
   - `useConversations()` — paginated list (cursor+limit, infinite query).
   - `useConversation(id)` — detail with messages (paginated).
   - `useCreateConversation()` — mutation + optimistic cache update.
   - `useDeleteConversation()` — mutation + cache invalidation.
   - `useChatStream()` — custom hook that manages in-flight stream state (idle/streaming/error), exposes `sendMessage(text)`, `cancel()`, `state`, `partialMessage`.
8. Sidebar activation patch (href + activeSlugFor).
9. 4 Vitest smoke tests:
   - `sse-client.test.ts` — parse canonical SSE wire format + partial frame buffering.
   - `chat-reducer.test.ts` — message_start → deltas → message_stop → final AIMessage shape.
   - `chat-message-item.test.tsx` — renders text / tool_use / impact_card / callout variants.
   - `streaming-message.test.tsx` — renders partial content + cursor during stream.

---

## Slice 3 — что НЕ делаем

- `FloatingAiFab` активация (context-aware mini-chat on Dashboard/Positions) — отдельный slice после main `/chat` работает.
- Insights page + `/ai/insights/*` endpoints — отдельный slice (проще, read-only).
- Last-Event-ID resume (TD-049) — после user-visible drop incident.
- Stream retry on mid-connection drop — MVP: show error + "Retry" button, full reply resend. Graceful reconnect = TD.
- Voice input, file upload, image attachments — out of scope.
- Conversation rename — optional если останется scope после core. Иначе отдельный микро-slice.
- Search в conversations list — scope-cut, MVP.
- Export conversation → PDF/Markdown — scope-cut.
- Multi-turn `context` hint (ChatContext type=position etc) — Slice 4+ (deep-links из Positions detail «Ask about AAPL»).

---

## Detailed scope

### 1. SSE client over fetch + ReadableStream

File: `src/lib/ai/sse-client.ts` (~120 LOC + tests)

EventSource не поддерживает custom headers → нельзя прокинуть Clerk Bearer. Используем fetch + manual SSE parser.

```ts
export interface SSEFrame {
  event: string;
  data: string;
}

export async function* streamSSE(
  response: Response,
  signal?: AbortSignal
): AsyncGenerator<SSEFrame> {
  if (!response.body) throw new Error("SSE: response body missing");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // parse complete frames: delimiter = \n\n
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        yield parseFrame(frame);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function parseFrame(raw: string): SSEFrame {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of raw.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
  }
  return { event, data: dataLines.join("\n") };
}
```

Client wrapper в `lib/api/ai.ts`:
```ts
export async function* sendChatMessageStream(
  request: AIChatRequest,
  token: string,
  signal?: AbortSignal
): AsyncGenerator<AIChatStreamEvent> {
  const res = await fetch(`${API_URL}/v1/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(request),
    signal,
  });
  if (!res.ok) throw await parseApiError(res);
  for await (const frame of streamSSE(res, signal)) {
    if (!frame.data) continue;
    yield JSON.parse(frame.data) as AIChatStreamEvent;
  }
}
```

**Edge cases для теста:**
- Partial frame across chunks: `event: content_delta\ndata: {"t` → next chunk `ype":"...\n\n` → parse correctly.
- Multiple data lines concatenated with `\n`.
- Unknown event types passed through (ignorable per OpenAPI spec).
- Empty data lines skipped.

### 2. Chat reducer (content block state machine)

File: `src/lib/ai/chat-reducer.ts` (~120 LOC + tests)

```ts
export type StreamState =
  | { phase: "idle" }
  | { phase: "streaming"; message: PartialAssistantMessage }
  | { phase: "done"; message: AIMessage }
  | { phase: "error"; error: ApiError };

interface PartialAssistantMessage {
  id: string | null;         // from message_start
  conversationId: string;
  blocks: PartialBlock[];
  tokensUsed: number | null;
}

type PartialBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; tool_use_id: string; name: string; input: unknown; partial_input: string }
  | { type: "tool_result"; tool_use_id: string; is_error: boolean; content: AIMessageRenderableContent[] }
  | { type: "impact_card"; scenario?: string; /* accumulated */ }
  | { type: "callout"; kind?: string; title?: string; body?: string };

export function reduce(state: StreamState, event: AIChatStreamEvent): StreamState {
  switch (event.type) {
    case "message_start":
      return { phase: "streaming", message: { id: event.message_id, conversationId: event.conversation_id, blocks: [], tokensUsed: null } };
    case "content_block_start": // push empty block at index
    case "content_delta":       // append to blocks[index].text or parse partial JSON for tool_use input
    case "content_block_stop":  // finalize partial_input JSON for tool_use (parse accumulated string)
    case "tool_use":            // replace block at current index with full tool_use
    case "tool_result":         // append to blocks
    case "message_stop":        // convert PartialAssistantMessage → AIMessage, return phase=done
    case "error":               // return phase=error with ErrorEnvelope
  }
}
```

**Критично:** content_delta payload — `delta` object — содержит либо `{type: "text_delta", text: "..."}` либо `{type: "input_json_delta", partial_json: "..."}`. Zod-light валидацию на client side достаточно (trust Go proxy). Text deltas — просто append. JSON deltas для tool_use input — аккумулируем строку, parse на `content_block_stop`.

### 3. useChatStream hook

File: `src/hooks/useChatStream.ts` (~100 LOC)

```ts
export function useChatStream(conversationId: string) {
  const [state, setState] = useState<StreamState>({ phase: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const { getToken } = useAuth();
  const qc = useQueryClient();

  const sendMessage = useCallback(async (text: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const token = await getToken();
      const request = { conversation_id: conversationId, message: { content: [{ type: "text", text }] } };
      let s: StreamState = { phase: "streaming", message: { id: null, conversationId, blocks: [], tokensUsed: null } };
      setState(s);
      for await (const ev of sendChatMessageStream(request, token!, controller.signal)) {
        s = reduce(s, ev);
        setState(s);
        if (s.phase === "done" || s.phase === "error") break;
      }
      // on done: invalidate useConversation(conversationId) so next render serves from server
      qc.invalidateQueries({ queryKey: ["ai-conversation", conversationId] });
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        setState({ phase: "error", error: normalizeError(err) });
      }
    }
  }, [conversationId, getToken, qc]);

  const cancel = useCallback(() => abortRef.current?.abort(), []);
  useEffect(() => () => abortRef.current?.abort(), []); // cleanup on unmount

  return { state, sendMessage, cancel };
}
```

**Критично для теста:** useEffect cleanup → abort inflight stream при unmount / conversation switch. Без этого memory leak и race conditions при fast нavigation.

### 4. Conversations CRUD hooks

`src/hooks/useConversations.ts` (~50 LOC) — useInfiniteQuery на `/ai/conversations?cursor=&limit=25`.

`src/hooks/useConversation.ts` (~40 LOC) — useQuery на `/ai/conversations/{id}?cursor=&limit=50`. Messages paginated (oldest-first for chat render order — double-check OpenAPI PaginatedEnvelope convention — если newest-first, frontend reverses).

`src/hooks/useCreateConversation.ts` (~35 LOC) — useMutation на POST. Optimistic: append empty convo to list cache immediately → replace with server response on success → revert on error. Returns convo id для router.push.

`src/hooks/useDeleteConversation.ts` (~30 LOC) — useMutation на DELETE. Optimistic remove. If user was viewing that convo → router.push(`/chat`).

### 5. Routes

`app/(app)/chat/page.tsx` (SC, ~60 LOC):
- Fetch conversations list (first page) via server api client.
- If list empty → render `<EmptyConversationState>` with SuggestedPrompts + "Start a conversation" button (creates new via mutation, routes to `/chat/{new_id}`).
- If list non-empty → redirect to most recent `/chat/{latest_id}`.

`app/(app)/chat/[id]/page.tsx` (SC, ~80 LOC):
- Fetch conversation detail (with messages) via server api client.
- 404 → `notFound()`.
- 5xx → return null → error card in Live component.
- Render `<ConversationsSidebar>` (list) + `<ChatViewLive>` (messages + stream).
- Hydration: pass initial conversation detail as `initialData` to useConversation hook.

`app/(app)/chat/layout.tsx` (optional, ~40 LOC) — two-column shell для desktop (sidebar 280px + main); mobile = full-width main + hamburger → `<Sheet>` for sidebar.

### 6. Rich content rendering

`components/chat/ChatMessageItem.tsx` — discriminator switch:

```tsx
function renderBlock(block: AIMessageContent, opts: { isStreaming: boolean }) {
  switch (block.type) {
    case "text":
      return <ChatMessage role={...} text={block.text} cursor={opts.isStreaming} />;
    case "tool_use":
      return <ToolUseCard name={block.name} input={block.input} pending />;
    case "tool_result":
      return <ToolUseCard.Result toolUseId={block.tool_use_id} isError={block.is_error} content={block.content} />;
    case "impact_card":
      return <ImpactCardView data={block} />;
    case "callout":
      return <CalloutView kind={block.kind} title={block.title} body={block.body} termSlug={block.term_slug} />;
  }
}
```

`ImpactCardView` (~80 LOC):
- Split view: Before / After portfolio snapshot (total_value, currency, delta_percent).
- `top_affected_positions` list (symbol + value_before → value_after + delta_percent, color-coded).
- Narrative string at bottom.

`CalloutView` (~40 LOC):
- kind=behavioral → amber accent, warning icon, title+body.
- kind=explainer → brand accent, ExplainerTooltip wrap if term_slug present; otherwise inline definition.
- kind=info/warning → standard alert styling.

### 7. Tier-limit paywall

When `createConversation` mutation or `sendMessage` throws 403 with AI Chat tier limit reached:
- Parse ErrorEnvelope.
- Open `<PaywallModal>` with message «You've reached your daily AI chat limit. Upgrade to Plus for unlimited chat.»
- CTA → `/pricing` (не здесь Slice, но route должен существовать — Slice 5 Paywall. Для MVP Slice 3: CTA disabled с tooltip «Coming soon» или внешний mailto если нужен hard fallback).

**Design decision needed (open question):** если `/pricing` route не существует (так как Paywall slice ещё не сделан) — показывать PaywallModal с disabled CTA, или делать gentle toast «Daily limit reached, resets at midnight UTC»? Мой POV: toast сейчас (не раздражает), PaywallModal → Slice 5 когда `/pricing` готов.

### 8. Rate-limit surface

Per `DESIGN_BRIEF §13.2` (Chat UI) + `§14.1` (Behavioral Coach):
- Response headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` canonical в OpenAPI. **Проверь pre-flight:** может быть AI-specific `X-RateLimit-Remaining-Daily` / `X-RateLimit-Reset-Daily` в design brief (я не верю этому без подтверждения — спорный header был упомянут в session notes).
- Parse на каждом response (списков, detail, POST ответах, last SSE frame metadata если есть).
- Store in QueryClient context или dedicated zustand/Context провайдер `ChatRateLimitContext`.
- Surface в `ChatInputBar` как `<UsageIndicator value={remaining} max={limit} resetAt={reset} />` — compact bar above input pill, hidden если remaining > 50% of limit (не раздражает на fresh sessions).

### 9. Sidebar activation

Patch `src/components/app-shell-client.tsx`:
- Chat nav item: `href: '/chat'` (был `/dashboard` placeholder).
- `activeSlugFor(pathname)`: add `if (pathname.startsWith('/chat')) return 'chat'` перед fallback.
- Убрать `disabled: true` flag если есть.

### 10. Tests

4 Vitest smoke tests:

1. `src/lib/ai/sse-client.test.ts` (~50 LOC) — canonical frame + partial chunk boundary + multi-data lines + unknown event type passthrough.

2. `src/lib/ai/chat-reducer.test.ts` (~80 LOC) — full event sequence: message_start → content_block_start(text) → 3× content_delta → content_block_stop → content_block_start(tool_use) → tool_use → tool_result → message_stop. Assert final AIMessage shape matches OpenAPI AIMessage schema.

3. `src/components/chat/chat-message-item.test.tsx` (~40 LOC) — render text / tool_use (pending) / impact_card (with before/after) / callout (explainer with term_slug).

4. `src/components/chat/streaming-message.test.tsx` (~40 LOC) — pure-presentation variant `StreamingMessageView` (per Slice 2 PortfolioPriceChartView pattern) — renders partial blocks + TypingCursor on last text block.

---

## Acceptance

- `pnpm --filter @investment-tracker/web dev` → `/chat` → if no conversations, shows SuggestedPrompts; clicking one creates convo + opens detail route.
- `/chat/{id}` — type message → send → assistant response streams token-by-token with TypingCursor → cursor disappears on message_stop → tokens_used appears in UsageIndicator update.
- Tool calls: when assistant emits tool_use → ToolUseCard appears in pending state; on tool_result → ToolUseCard shows result preview.
- Impact card renders для scenario simulator responses (before/after snapshots, affected positions, narrative).
- Callout renders в 4 variants.
- Cancel stream (X button on ChatInputBar during streaming or Esc) → abort + graceful error state.
- Delete conversation in sidebar → confirm → convo removed from list, user routed to /chat if was viewing it.
- Tier limit 403 → toast «Daily limit reached» (MVP) OR PaywallModal (если Slice 5 к тому моменту готов).
- Dark mode через design-tokens semantic (chat message bubble tones, tool_use card bg, impact_card before/after color coding).
- `pnpm --filter @investment-tracker/web build` зелёный, TS strict.
- `pnpm --filter @investment-tracker/web lint` зелёный (Biome).
- `pnpm --filter @investment-tracker/web test` зелёный (4 smoke + prior 15 = 19/19).
- Турборепо CI 8/8 green.
- Zero drift с parallel ops work (no apps/api/ or tools/k6/ or ops/ touches).

---

## Dependencies проверить до write-phase

1. `ls packages/ui/src/primitives/` + `ls packages/ui/src/domain/` — confirm chat primitives inventory (ChatInputPill, ChatMessage, ToolUseCard, TypingCursor, SuggestedPrompt, TrustRow, ExplainerTooltip, PaywallModal, UsageIndicator, FloatingAiFab).
2. `grep -n "^export" packages/ui/src/index.ts` — убедиться они экспортированы в barrel.
3. `cat packages/ui/src/domain/ChatMessage.tsx` — что ChatMessage принимает (role / text / cursor prop?). Если импакт_card/callout не поддерживает — обрамляем discriminator в ChatMessageItem (как в scope выше), не расширяем packages/ui.
4. `cat packages/ui/src/primitives/ToolUseCard.tsx` — API для pending/result variants.
5. `grep -A 30 "AIChatStreamEvent:" tools/openapi/openapi.yaml` — confirm все 8 event types имеют expected shape.
6. `grep -A 20 "content_delta" tools/openapi/openapi.yaml` — confirm shape of `delta` object (text_delta vs input_json_delta).
7. `cat packages/shared-types/src/openapi.d.ts` (или как там сгенерированный файл называется) — убедиться что `AIChatRequest`, `AIChatStreamEvent`, `AIMessage`, `AIMessageContent*` типы доступны. Если нет — regenerate: `pnpm --filter @investment-tracker/shared-types generate`.
8. `cat apps/web/src/lib/api/browser.ts` (Slice 1 factory) — подтвердить что SSE fetch совместим с существующим client pattern (browser client скорее всего `openapi-fetch`-based, для SSE его обходим напрямую через fetch + token).
9. `grep -rn "X-RateLimit-Remaining-Daily\|X-RateLimit-Remaining " docs/04_DESIGN_BRIEF.md` — подтвердить точные header names для AI chat. Canonical OpenAPI = `X-RateLimit-Limit|Remaining|Reset` без `-Daily` suffix. Если design brief диктует AI-specific `-Daily` headers — проверь что Go proxy их forwarded (B3-ii PR #44 может или не может делать это).
10. `curl -s http://localhost:8080/v1/ai/chat/stream -XOPTIONS -H "origin: http://localhost:3000"` если Core API запущен локально — sanity CORS check для SSE (Fetch cross-origin streaming через Credentials: include + proper CORS). Если Core API не доступен локально → skip + note в GAP v1.

---

## Parallelization note

В параллель с Slice 3 идёт PO operational work (Doppler setup, Fly apps create, DNS, first deploy). Zero code overlap — ты трогаешь только apps/web/**, возможно packages/ui barrel export если нужен.

Если PR D (workers deploy) стартует параллельно — scope не пересекается (apps/api/cmd/workers/ + .github/workflows + deploy-api.yml dispatch opts), минутный rebase if lock-файл тронут (маловероятно для workers PR).

---

## Continuation prompt (копировать в новый CC чат)

```
Привет. Я Ruslan, Product Owner investment-tracker
(AI-инвест-трекер EU: Next.js web + Go Core API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Твой worktree: D:\investment-tracker-task07-s3 (feature/task07-slice3).

Первым делом читай в этом порядке:

  D:\СТАРТАП\docs\PO_HANDOFF.md                   (полный handoff)
  D:\СТАРТАП\docs\README.md                       (wave status)
  D:\СТАРТАП\docs\CC_KICKOFF_task07_slice3.md     (ТВОЙ scope —
                                                    читай особо
                                                    внимательно)
  D:\СТАРТАП\docs\CC_KICKOFF_task07_slice1.md     (что уже merged
                                                    в PR #45)
  D:\СТАРТАП\docs\CC_KICKOFF_task07_slice2.md     (что уже merged
                                                    в PR #48)
  D:\СТАРТАП\docs\TASK_07_web_frontend.md         (full TASK 07)
  D:\СТАРТАП\docs\TASK_05_ai_service.md           (AI backend
                                                    контекст)
  D:\СТАРТАП\docs\04_DESIGN_BRIEF.md              (дизайн-система +
                                                    §13.2 Chat UI,
                                                    §14.1 Behavioral
                                                    Coach, §14.2
                                                    Scenario Sim,
                                                    §14.3 Explainer)
  D:\СТАРТАП\docs\02_ARCHITECTURE.md              (patterns)
  D:\СТАРТАП\docs\DECISIONS.md                    (ADR log)

Текущий статус:
- main tip = 6bddbf6 (проверь fetch — может быть свежее).
- TASK_04 Core API 10/10 merged (PR C Fly.io infra in main).
- TASK_07 Slice 1 (Clerk + Dashboard) merged PR #45 `a622bd3`.
- TASK_07 Slice 2 (Positions list + detail) merged PR #48 `366d12f`.
- Параллельно PO operational setup (Doppler/Fly/DNS) и, возможно,
  PR D workers — НЕ пересекаются с твоим scope
  (apps/web/** vs всё остальное).

Ты делаешь TASK_07 Slice 3: AI Chat UI.
Полный scope в CC_KICKOFF_task07_slice3.md. Кратко:
- (app)/chat + (app)/chat/[id] routes
- SSE client over fetch+ReadableStream (EventSource не подходит —
  не пропускает Bearer token)
- Chat reducer (content block state machine)
- useChatStream hook + conversations CRUD hooks (TanStack Query)
- Rich content rendering: text / tool_use / impact_card / callout
- Tier-limit paywall (toast MVP, PaywallModal после Slice 5)
- Rate-limit surface (UsageIndicator над input)
- Sidebar activation
- 4 Vitest smoke tests

Anchor 1500-2000 LOC. НЕ делаем FloatingAiFab активацию, Insights,
mid-stream reconnect, voice/file/image, search convos, conversation
rename/export, ChatContext deep-links из Positions — отдельные
slices.

Стиль общения (из PO_HANDOFF):
- Русский, коротко, без over-formatting.
- Decisions-first (что делать → почему).
- Видишь риск — говори сразу.
- Верифицируй через Read перед confirm (state loss бывал).
- Squash-only merge policy (TD-006).
- GAP REPORT перед write-phase.

Паттерны от Slice 1+2 (следуй им):
- Server Component fetch → hydrate QueryClient → Live component
  consumes via TanStack hook. См. DashboardPage + PositionsPage.
- Pure-presentation split для тестируемости (PortfolioValueCardView,
  PositionPriceChartView) → StreamingMessageView в Slice 3.
- vitest.setup.ts afterEach(cleanup) уже работает от Slice 2 —
  RTL render'ы чистятся между it-блоками без workarounds.
- openapi-fetch через browser.ts/server.ts factories. SSE
  обходим напрямую через fetch + Bearer (отдельный path для stream).
- formatCurrency/formatSignedCurrency/fractionToPercent из
  lib/format.ts — не переписывай.

Cycle:
1) Прочти docs в указанном порядке.
2) Pre-flight audit (10 checks в CC_KICKOFF_task07_slice3.md §
   Dependencies).
3) GAP REPORT v1: scope delta, LOC прогноз, questions
   (обязательно: tier-limit fallback — toast vs PaywallModal;
   rate-limit header names canonical vs -Daily variant; messages
   paginated order newest-first vs oldest-first), risk assessment,
   confirmation что ни один файл не изменён.
4) Я даю отмашку → write-phase (incremental commits:
   sse-client + reducer + tests first → hooks → components →
   routes → sidebar patch → final smoke tests).
5) GAP REPORT v2 + self-merge (gh pr create +
   gh pr merge --squash --delete-branch).
6) Post-merge docs pass (merge-log + TECH_DEBT if TDs opened +
   TASK_07 row + README wave 3 + PO_HANDOFF §1/§2/§9).
7) Final report мне.

Start: прочти все указанные docs, потом подтверди готов к
pre-flight.
```
