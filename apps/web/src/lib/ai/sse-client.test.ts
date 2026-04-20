import { describe, expect, it } from 'vitest';
import { parseFrame, streamSSE } from './sse-client';

function responseFromChunks(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
  return new Response(stream);
}

async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const f of gen) out.push(f);
  return out;
}

describe('parseFrame', () => {
  it('reads event + data', () => {
    expect(parseFrame('event: message_start\ndata: {"type":"message_start"}')).toEqual({
      event: 'message_start',
      data: '{"type":"message_start"}',
    });
  });

  it('defaults event to "message" when absent', () => {
    expect(parseFrame('data: {"hello":1}')).toEqual({ event: 'message', data: '{"hello":1}' });
  });

  it('joins multi-line data with \\n', () => {
    expect(parseFrame('event: note\ndata: line one\ndata: line two')).toEqual({
      event: 'note',
      data: 'line one\nline two',
    });
  });

  it('strips at most one leading space after data:', () => {
    expect(parseFrame('data:  leading-space')).toEqual({
      event: 'message',
      data: ' leading-space',
    });
  });

  it('ignores comment lines starting with :', () => {
    expect(parseFrame(':keep-alive\nevent: ping\ndata: 1')).toEqual({ event: 'ping', data: '1' });
  });
});

describe('streamSSE', () => {
  it('yields frames separated by blank line', async () => {
    const frames = await collect(
      streamSSE(
        responseFromChunks([
          'event: message_start\ndata: {"type":"message_start"}\n\n',
          'event: content_delta\ndata: {"type":"content_delta","delta":{"text":"hi"}}\n\n',
        ]),
      ),
    );
    expect(frames).toHaveLength(2);
    expect(frames[0]?.event).toBe('message_start');
    expect(frames[1]?.event).toBe('content_delta');
  });

  it('reassembles a frame split across chunks', async () => {
    const frames = await collect(
      streamSSE(
        responseFromChunks([
          'event: content_delta\ndata: {"type":"content_delta","delta":{"t',
          'ext":"hello"}}\n\n',
        ]),
      ),
    );
    expect(frames).toHaveLength(1);
    expect(frames[0]?.data).toBe('{"type":"content_delta","delta":{"text":"hello"}}');
  });

  it('flushes a trailing frame that lacks the final blank line', async () => {
    const frames = await collect(
      streamSSE(responseFromChunks(['event: message_stop\ndata: {"type":"message_stop"}'])),
    );
    expect(frames).toHaveLength(1);
    expect(frames[0]?.event).toBe('message_stop');
  });

  it('aborts when the signal fires', async () => {
    const controller = new AbortController();
    const neverEnding = new Response(
      new ReadableStream<Uint8Array>({
        start() {
          // deliberately not closing — iteration must bail on abort.
        },
      }),
    );
    controller.abort();
    await expect(
      (async () => {
        for await (const _ of streamSSE(neverEnding, controller.signal)) {
          // no frames expected
        }
      })(),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('throws when the response has no body', async () => {
    const res = new Response(null);
    await expect(
      (async () => {
        for await (const _ of streamSSE(res)) {
          // unreachable
        }
      })(),
    ).rejects.toThrow(/no body/);
  });
});
