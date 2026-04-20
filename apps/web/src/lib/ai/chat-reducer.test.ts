import type { AIChatStreamEvent } from '@investment-tracker/shared-types';
import { describe, expect, it } from 'vitest';
import { initialState, reduce, runSequence } from './chat-reducer';

const CONV = '11111111-1111-1111-1111-111111111111';
const MSG = '22222222-2222-2222-2222-222222222222';

describe('chat-reducer', () => {
  it('transitions idle → streaming on message_start', () => {
    const next = reduce(initialState, {
      type: 'message_start',
      message_id: MSG,
      conversation_id: CONV,
    });
    expect(next.phase).toBe('streaming');
    if (next.phase === 'streaming') {
      expect(next.message.messageId).toBe(MSG);
      expect(next.message.conversationId).toBe(CONV);
      expect(next.message.blocks).toEqual([]);
    }
  });

  it('accumulates text across content_deltas on the active block', () => {
    const events: AIChatStreamEvent[] = [
      { type: 'message_start', message_id: MSG, conversation_id: CONV },
      { type: 'content_block_start', index: 0, block_type: 'text' },
      { type: 'content_delta', index: 0, delta: { text: 'Hello' } },
      { type: 'content_delta', index: 0, delta: { text: ', world' } },
      { type: 'content_block_stop', index: 0 },
      {
        type: 'message_stop',
        message_id: MSG,
        tokens_used: 42,
        stop_reason: 'end_turn',
      },
    ];
    const final = runSequence(events);
    expect(final.phase).toBe('done');
    if (final.phase !== 'done') return;
    expect(final.message.blocks).toHaveLength(1);
    const block = final.message.blocks[0];
    if (!block || block.kind !== 'text') throw new Error('expected text block');
    expect(block.text).toBe('Hello, world');
    expect(block.open).toBe(false);
    expect(final.message.tokensUsed).toBe(42);
    expect(final.message.stopReason).toBe('end_turn');
  });

  it('appends tool_use + tool_result as additional blocks (own indexes)', () => {
    const events: AIChatStreamEvent[] = [
      { type: 'message_start', message_id: MSG, conversation_id: CONV },
      { type: 'content_block_start', index: 0, block_type: 'text' },
      { type: 'content_delta', index: 0, delta: { text: 'Looking at your portfolio.' } },
      { type: 'content_block_stop', index: 0 },
      {
        type: 'tool_use',
        tool_use_id: 't-1',
        name: 'get_portfolio',
        input: { currency: 'EUR' },
      },
      {
        type: 'tool_result',
        tool_use_id: 't-1',
        is_error: false,
        content: [{ type: 'text', text: 'total=1500.00' }],
      },
      {
        type: 'message_stop',
        message_id: MSG,
        tokens_used: 88,
        stop_reason: 'end_turn',
      },
    ];
    const final = runSequence(events);
    if (final.phase !== 'done') throw new Error('expected done phase');
    expect(final.message.blocks).toHaveLength(3);
    expect(final.message.blocks.map((b) => b.kind)).toEqual(['text', 'tool_use', 'tool_result']);
    const tu = final.message.blocks[1];
    if (!tu || tu.kind !== 'tool_use') throw new Error('expected tool_use');
    expect(tu.name).toBe('get_portfolio');
    expect(tu.input).toEqual({ currency: 'EUR' });
    const tr = final.message.blocks[2];
    if (!tr || tr.kind !== 'tool_result') throw new Error('expected tool_result');
    expect(tr.text).toBe('total=1500.00');
    expect(tr.is_error).toBe(false);
  });

  it('captures error into phase=error and preserves partial message', () => {
    const events: AIChatStreamEvent[] = [
      { type: 'message_start', message_id: MSG, conversation_id: CONV },
      { type: 'content_block_start', index: 0, block_type: 'text' },
      { type: 'content_delta', index: 0, delta: { text: 'Partial' } },
      // Wire shape: translator.go emits `event.error = {code, message,
      // request_id}` flat (not wrapped in `{error: {...}}` as the
      // generated type claims). Cast proves the reducer handles both.
      {
        type: 'error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'upstream blew up',
          request_id: 'req-1',
        },
        // biome-ignore lint/suspicious/noExplicitAny: schema drift, see TD-068
      } as any,
    ];
    const final = runSequence(events);
    expect(final.phase).toBe('error');
    if (final.phase !== 'error') return;
    expect(final.error.code).toBe('INTERNAL_ERROR');
    expect(final.error.requestId).toBe('req-1');
    expect(final.message?.blocks[0]).toMatchObject({ kind: 'text', text: 'Partial' });
  });

  it('ignores unknown delta shapes gracefully (no crash, text unchanged)', () => {
    const events = [
      { type: 'message_start', message_id: MSG, conversation_id: CONV },
      { type: 'content_block_start', index: 0, block_type: 'text' },
      // Delta in a legacy shape that does not carry `text`. Reducer must
      // not crash — just skip appending.
      { type: 'content_delta', index: 0, delta: { not_text: 'huh' } },
      { type: 'content_delta', index: 0, delta: { text: 'ok' } },
    ] as unknown as AIChatStreamEvent[];
    const final = runSequence(events);
    if (final.phase !== 'streaming') throw new Error('expected streaming phase');
    const block = final.message.blocks[0];
    if (!block || block.kind !== 'text') throw new Error('expected text block');
    expect(block.text).toBe('ok');
  });
});
