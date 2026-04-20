/**
 * Thin typed wrappers around the Positions + Market History slices of the
 * generated OpenAPI client. Returns plain unwrapped data and throws on any
 * non-2xx response so TanStack Query can surface it through `error`.
 */
import type { InvestmentTrackerClient } from '@investment-tracker/api-client';
import type { components, paths } from '@investment-tracker/shared-types';

export type Position = components['schemas']['Position'];
export type Transaction = components['schemas']['Transaction'];
export type TransactionType = components['schemas']['TransactionType'];
export type AssetType = components['schemas']['AssetType'];
export type PaginationMeta = components['schemas']['PaginationMeta'];
export type MarketHistoryResponse = components['schemas']['MarketHistoryResponse'];
export type MarketHistoryPoint = components['schemas']['MarketHistoryPoint'];

export type PositionsListQuery = NonNullable<paths['/positions']['get']['parameters']['query']>;
export type MarketHistoryQuery = NonNullable<
  paths['/market/history']['get']['parameters']['query']
>;

export interface PositionTransactionsPage {
  data: Transaction[];
  meta: PaginationMeta;
}

export async function fetchPositions(
  client: InvestmentTrackerClient,
  query?: PositionsListQuery,
): Promise<Position[]> {
  const { data, error } = await client.GET('/positions', query ? { params: { query } } : {});
  if (error || !data) throw new Error('Failed to load positions');
  return data.data;
}

export async function fetchPosition(
  client: InvestmentTrackerClient,
  id: string,
  displayCurrency?: string,
): Promise<Position> {
  const { data, error } = await client.GET('/positions/{id}', {
    params: {
      path: { id },
      query: displayCurrency ? { display_currency: displayCurrency } : undefined,
    },
  });
  if (error || !data) throw new Error('Failed to load position');
  return data;
}

export async function fetchPositionTransactions(
  client: InvestmentTrackerClient,
  id: string,
  cursor?: string,
): Promise<PositionTransactionsPage> {
  const { data, error } = await client.GET('/positions/{id}/transactions', {
    params: { path: { id }, query: cursor ? { cursor } : {} },
  });
  if (error || !data) throw new Error('Failed to load transactions');
  return { data: data.data, meta: data.meta };
}

export async function fetchMarketHistory(
  client: InvestmentTrackerClient,
  query: MarketHistoryQuery,
): Promise<MarketHistoryResponse> {
  const { data, error } = await client.GET('/market/history', { params: { query } });
  if (error || !data) throw new Error('Failed to load market history');
  return data;
}
