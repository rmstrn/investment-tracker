/**
 * Chat stream reducer — turns a sequence of `AIChatStreamEvent`s into the
 * UI-renderable assistant-message shape. Shape specifics match what
 * Core API's translator emits today (see `apps/api/internal/sseproxy/
 * translator.go`):
 *
 * - `content_delta.delta` is always `{ text: string }`; no `text_delta` /
 *   `input_json_delta` discriminators on the wire.
 * - `tool_use` arrives as a complete frame with `{tool_use_id, name, input}`
 *   — no partial-JSON accumulation needed.
 * - `impact_card` / `callout` are reserved in the OpenAPI spec but never
 *   emitted live today (see collector.go:58-60). They only surface via
 *   persisted `AIMessage` reads, not through this reducer.
 */

import type { AIChatStreamEvent } from '@investment-tracker/shared-types';

/**
 * Flattened view of the server `ErrorEnvelope` (`{error: {code, message,
 * request_id, ...}}`). The UI never needs the outer wrapper, so we lift the
 * inner fields — and add room for synthetic client errors (abort, network
 * failure) that have no real `request_id`.
 */
export interface ChatErrorView {
  code: string;
  message: string;
  requestId?: string;
}

export type LiveBlock =
  | { kind: 'text'; index: number; text: string; open: boolean }
  | {
      kind: 'tool_use';
      index: number;
      tool_use_id: string;
      name: string;
      input: Record<string, unknown>;
    }
  | {
      kind: 'tool_result';
      index: number;
      tool_use_id: string;
      is_error: boolean;
      text: string;
    };

export interface LiveAssistantMessage {
  messageId: string | null;
  conversationId: string | null;
  blocks: LiveBlock[];
  tokensUsed: number | null;
  stopReason: string | null;
}

export type StreamState =
  | { phase: 'idle' }
  | { phase: 'streaming'; message: LiveAssistantMessage }
  | { phase: 'done'; message: LiveAssistantMessage }
  | { phase: 'error'; message: LiveAssistantMessage | null; error: ChatErrorView };

export const initialState: StreamState = { phase: 'idle' };

export function emptyMessage(): LiveAssistantMessage {
  return {
    messageId: null,
    conversationId: null,
    blocks: [],
    tokensUsed: null,
    stopReason: null,
  };
}

function liveMessage(state: StreamState): LiveAssistantMessage {
  if (state.phase === 'streaming' || state.phase === 'done') return state.message;
  return emptyMessage();
}

function upsertBlock(
  blocks: LiveBlock[],
  index: number,
  factory: () => LiveBlock,
): { next: LiveBlock[]; block: LiveBlock } {
  const existing = blocks.findIndex((b) => b.index === index);
  if (existing >= 0) {
    const block = blocks[existing];
    if (!block) throw new Error('chat-reducer: index drift — findIndex vs access mismatch');
    return { next: blocks, block };
  }
  const block = factory();
  return { next: [...blocks, block], block };
}

export function reduce(state: StreamState, event: AIChatStreamEvent): StreamState {
  switch (event.type) {
    case 'message_start': {
      const message = emptyMessage();
      message.messageId = event.message_id;
      message.conversationId = event.conversation_id;
      return { phase: 'streaming', message };
    }

    case 'content_block_start': {
      const message = { ...liveMessage(state) };
      const kind = event.block_type === 'tool_use' ? 'tool_use' : 'text';
      if (kind === 'text') {
        const { next } = upsertBlock(message.blocks, event.index, () => ({
          kind: 'text',
          index: event.index,
          text: '',
          open: true,
        }));
        message.blocks = next;
      }
      // tool_use blocks arrive as a standalone `tool_use` event rather than
      // via content_block_start + deltas (Core API collector synthesises the
      // slot itself), so we skip creating an empty placeholder here —
      // attempting to keep the index stable would drift from the collector.
      return { phase: 'streaming', message };
    }

    case 'content_delta': {
      const message = { ...liveMessage(state) };
      const blocks = message.blocks.map((b) =>
        b.index === event.index && b.kind === 'text'
          ? { ...b, text: b.text + (readDeltaText(event.delta) ?? '') }
          : b,
      );
      message.blocks = blocks;
      return { phase: 'streaming', message };
    }

    case 'content_block_stop': {
      const message = { ...liveMessage(state) };
      message.blocks = message.blocks.map((b) =>
        b.index === event.index && b.kind === 'text' ? { ...b, open: false } : b,
      );
      return { phase: 'streaming', message };
    }

    case 'tool_use': {
      const message = { ...liveMessage(state) };
      const nextIndex = nextBlockIndex(message.blocks);
      const block: LiveBlock = {
        kind: 'tool_use',
        index: nextIndex,
        tool_use_id: event.tool_use_id,
        name: event.name,
        input: event.input ?? {},
      };
      message.blocks = [...message.blocks, block];
      return { phase: 'streaming', message };
    }

    case 'tool_result': {
      const message = { ...liveMessage(state) };
      const nextIndex = nextBlockIndex(message.blocks);
      const firstText = event.content.find((c) => c.type === 'text');
      const block: LiveBlock = {
        kind: 'tool_result',
        index: nextIndex,
        tool_use_id: event.tool_use_id,
        is_error: event.is_error,
        text: firstText?.text ?? '',
      };
      message.blocks = [...message.blocks, block];
      return { phase: 'streaming', message };
    }

    case 'message_stop': {
      const message = { ...liveMessage(state) };
      message.messageId = event.message_id;
      message.tokensUsed = event.tokens_used;
      message.stopReason = event.stop_reason ?? null;
      message.blocks = message.blocks.map((b) => (b.kind === 'text' ? { ...b, open: false } : b));
      return { phase: 'done', message };
    }

    case 'error': {
      const msg = state.phase === 'streaming' ? state.message : null;
      // TD-R068: the OpenAPI spec was tightened to declare
      // `event.error` as the flat `{code, message, request_id?}`
      // that `translator.go` actually emits (previously the spec
      // said full `ErrorEnvelope`, making this a drift). The
      // `unwrapEnvelope` branch below is kept as a 30-day compat
      // shim — once a stream on a client-cached old bundle can't
      // still be in-flight after a deploy rollover (call it
      // 2026-05-22 for the 2026-04-22 spec cutover), drop the
      // wrapped-shape branch and read `event.error` directly as
      // the flat inner object.
      const raw = event.error as unknown;
      const inner = unwrapEnvelope(raw);
      return {
        phase: 'error',
        message: msg,
        error: {
          code: inner.code ?? 'INTERNAL_ERROR',
          message: inner.message ?? 'Stream error',
          requestId: inner.request_id,
        },
      };
    }

    default:
      return state;
  }
}

function nextBlockIndex(blocks: LiveBlock[]): number {
  let max = -1;
  for (const b of blocks) if (b.index > max) max = b.index;
  return max + 1;
}

interface InnerEnvelope {
  code?: string;
  message?: string;
  request_id?: string;
}

function unwrapEnvelope(raw: unknown): InnerEnvelope {
  if (!raw || typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  const nested = obj.error;
  if (nested && typeof nested === 'object' && 'code' in (nested as Record<string, unknown>)) {
    return nested as InnerEnvelope;
  }
  return obj as InnerEnvelope;
}

function readDeltaText(delta: unknown): string | undefined {
  if (delta && typeof delta === 'object' && 'text' in delta) {
    const t = (delta as { text?: unknown }).text;
    if (typeof t === 'string') return t;
  }
  return undefined;
}

/**
 * Run the full sequence of events starting from `initialState`. Useful in
 * tests to replay a canonical stream.
 */
export function runSequence(events: AIChatStreamEvent[]): StreamState {
  let state: StreamState = initialState;
  for (const e of events) state = reduce(state, e);
  return state;
}
