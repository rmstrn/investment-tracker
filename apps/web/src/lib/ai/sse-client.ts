/**
 * SSE client for the AI chat stream. EventSource is unusable here because
 * it cannot attach the Clerk Bearer token — we roll our own parser on top
 * of `fetch` + `ReadableStream`.
 *
 * SSE events consumed here are translator-normalized (`apps/api/internal/
 * sseproxy/translator.go` translates AI Service-native shape to OpenAPI
 * shape — see TD-055 and TD-068). Do NOT add `text_delta` /
 * `input_json_delta` discriminators — they do not exist on the wire.
 * `content_delta.delta` is always `{ text: string }` today.
 */

export interface SSEFrame {
  event: string;
  data: string;
}

/**
 * Parse an SSE response body into an AsyncGenerator of `{event, data}`
 * frames. Buffers across chunks so a frame split mid-boundary (`\n\n`)
 * is reassembled correctly.
 *
 * `signal?.aborted` is checked between reads so a caller can abort the
 * iteration cooperatively via `AbortController`.
 */
export async function* streamSSE(
  response: Response,
  signal?: AbortSignal,
): AsyncGenerator<SSEFrame> {
  if (!response.body) {
    throw new Error('streamSSE: response has no body');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      const { done, value } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        const trailing = buffer.trim();
        if (trailing.length > 0) {
          yield parseFrame(trailing);
        }
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      let sep = buffer.indexOf('\n\n');
      while (sep !== -1) {
        const raw = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        if (raw.length > 0) yield parseFrame(raw);
        sep = buffer.indexOf('\n\n');
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // reader may already be released when the response errored; swallow.
    }
  }
}

/**
 * Parse a single SSE frame block (one or more lines, already split at
 * `\n\n`). Missing `event:` defaults to `"message"` per SSE spec. Multiple
 * `data:` lines are joined with `\n`.
 */
export function parseFrame(raw: string): SSEFrame {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith(':')) continue;
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      const v = line.slice(5);
      dataLines.push(v.startsWith(' ') ? v.slice(1) : v);
    }
  }
  return { event, data: dataLines.join('\n') };
}
