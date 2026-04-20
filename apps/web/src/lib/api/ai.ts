/**
 * Thin typed wrappers around the AI conversations + chat slices of the
 * generated OpenAPI client.
 *
 * `/ai/chat/stream` bypasses openapi-fetch entirely because openapi-fetch
 * buffers the response body. We hit the endpoint with a native `fetch` and
 * parse SSE frames directly in `streamSSE`.
 */
import type { InvestmentTrackerClient, RateLimitSnapshot } from '@investment-tracker/api-client';
import { parseRateLimitHeaders } from '@investment-tracker/api-client';
import type { AIChatStreamEvent, components } from '@investment-tracker/shared-types';
import type { ChatErrorView } from '../ai/chat-reducer';
import { streamSSE } from '../ai/sse-client';

export type AIConversationSummary = components['schemas']['AIConversationSummary'];
export type AIConversation = components['schemas']['AIConversation'];
export type AIConversationDetail = components['schemas']['AIConversationDetail'];
export type AIMessage = components['schemas']['AIMessage'];
export type AIChatRequest = components['schemas']['AIChatRequest'];
export type ErrorEnvelope = components['schemas']['ErrorEnvelope'];
export type PaginationMeta = components['schemas']['PaginationMeta'];

export interface ConversationsPage {
  data: AIConversationSummary[];
  meta: PaginationMeta;
}

export async function fetchConversations(
  client: InvestmentTrackerClient,
  cursor?: string,
): Promise<ConversationsPage> {
  const { data, error } = await client.GET('/ai/conversations', {
    params: { query: cursor ? { cursor } : {} },
  });
  if (error || !data) throw new Error('Failed to list conversations');
  return { data: data.data, meta: data.meta };
}

export async function fetchConversationDetail(
  client: InvestmentTrackerClient,
  id: string,
  cursor?: string,
): Promise<AIConversationDetail> {
  const { data, error, response } = await client.GET('/ai/conversations/{id}', {
    params: { path: { id }, query: cursor ? { cursor } : {} },
  });
  if (response.status === 404) throw new NotFoundError();
  if (error || !data) throw new Error('Failed to load conversation');
  return data;
}

export async function createConversation(
  client: InvestmentTrackerClient,
  title?: string,
): Promise<AIConversation> {
  const { data, error, response } = await client.POST('/ai/conversations', {
    body: title ? { title } : {},
  });
  if (response.status === 403) throw tierLimitFromResponse(error);
  if (error || !data) throw new Error('Failed to create conversation');
  return data;
}

export async function deleteConversation(
  client: InvestmentTrackerClient,
  id: string,
): Promise<void> {
  const { error, response } = await client.DELETE('/ai/conversations/{id}', {
    params: { path: { id } },
  });
  if (response.status === 404) throw new NotFoundError();
  if (error) throw new Error('Failed to delete conversation');
}

export class NotFoundError extends Error {
  constructor() {
    super('NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class TierLimitError extends Error {
  readonly view: ChatErrorView;
  constructor(view: ChatErrorView) {
    super(view.message || 'Tier limit reached');
    this.name = 'TierLimitError';
    this.view = view;
  }
}

export class ApiStreamError extends Error {
  readonly view: ChatErrorView;
  constructor(view: ChatErrorView) {
    super(view.message || 'Stream error');
    this.name = 'ApiStreamError';
    this.view = view;
  }
}

function flattenEnvelope(envelope: ErrorEnvelope | undefined, fallbackCode: string): ChatErrorView {
  if (envelope?.error) {
    return {
      code: envelope.error.code,
      message: envelope.error.message,
      requestId: envelope.error.request_id,
    };
  }
  return { code: fallbackCode, message: fallbackCode };
}

function tierLimitFromResponse(err: unknown): TierLimitError {
  return new TierLimitError(
    flattenEnvelope(err as ErrorEnvelope | undefined, 'TIER_LIMIT_EXCEEDED'),
  );
}

export interface SendChatMessageStreamParams {
  baseUrl: string;
  token: string | null;
  request: AIChatRequest;
  signal?: AbortSignal;
  onRateLimit?: (snapshot: RateLimitSnapshot) => void;
}

/**
 * Send a user message and iterate parsed `AIChatStreamEvent`s from the
 * SSE response. Throws `TierLimitError` on 403 and `Error` on any other
 * non-2xx. `X-RateLimit-*` headers on the initial response are forwarded
 * via `onRateLimit` before iteration begins.
 */
export async function* sendChatMessageStream(
  params: SendChatMessageStreamParams,
): AsyncGenerator<AIChatStreamEvent> {
  const { baseUrl, token, request, signal, onRateLimit } = params;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'Idempotency-Key': crypto.randomUUID(),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/ai/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
    signal,
  });

  if (onRateLimit) {
    const snapshot = parseRateLimitHeaders(response.headers);
    if (snapshot) onRateLimit(snapshot);
  }

  if (!response.ok) {
    const view = await safeParseErrorEnvelope(response);
    if (response.status === 403) throw new TierLimitError(view);
    throw new ApiStreamError(view);
  }

  for await (const frame of streamSSE(response, signal)) {
    if (!frame.data) continue;
    try {
      yield JSON.parse(frame.data) as AIChatStreamEvent;
    } catch {
      // Malformed JSON (shouldn't happen post-translator) — skip and keep
      // reading so one bad frame doesn't kill the whole turn.
    }
  }
}

async function safeParseErrorEnvelope(response: Response): Promise<ChatErrorView> {
  try {
    const body = (await response.json()) as ErrorEnvelope | undefined;
    if (body?.error) {
      return {
        code: body.error.code,
        message: body.error.message,
        requestId: body.error.request_id,
      };
    }
  } catch {
    // body not JSON — fall through to a synthetic envelope.
  }
  return {
    code: response.status === 403 ? 'TIER_LIMIT_EXCEEDED' : 'STREAM_ERROR',
    message: `HTTP ${response.status}`,
  };
}
