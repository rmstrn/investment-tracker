/**
 * Thin typed wrappers around the AI Insights slice of the generated
 * OpenAPI client. Follows the same pattern as `accounts.ts` / `ai.ts`.
 *
 * Only `GET /ai/insights` is wired here — dismiss/viewed/generate are
 * Slice 6b scope.
 */
import type { InvestmentTrackerClient } from '@investment-tracker/api-client';
import type { components } from '@investment-tracker/shared-types';

export type Insight = components['schemas']['Insight'];
export type InsightSeverity = components['schemas']['InsightSeverity'];
export type InsightType = components['schemas']['InsightType'];
export type PaginationMeta = components['schemas']['PaginationMeta'];

export interface InsightsPage {
  data: Insight[];
  meta: PaginationMeta;
}

export interface ListInsightsParams {
  includeDismissed?: boolean;
  cursor?: string;
  limit?: number;
}

export async function fetchInsightsPage(
  client: InvestmentTrackerClient,
  params: ListInsightsParams = {},
): Promise<InsightsPage> {
  const { includeDismissed = false, cursor, limit } = params;

  const query: Record<string, unknown> = { include_dismissed: includeDismissed };
  if (cursor) query.cursor = cursor;
  if (limit !== undefined) query.limit = limit;

  const { data, error } = await client.GET('/ai/insights', {
    params: { query },
  });

  if (error || !data) throw error ?? new Error('Failed to load insights');

  return { data: data.data, meta: data.meta };
}
