/**
 * Thin typed wrappers around the Transactions slice of the generated
 * OpenAPI client. Mirrors the pattern in `accounts.ts` / `positions.ts`:
 * one wrapper per HTTP verb, throws on any non-2xx so TanStack Query
 * surfaces it through `error`.
 *
 * `Idempotency-Key` is added automatically by `createBrowserApiClient`
 * middleware on every mutating call.
 */
import type { InvestmentTrackerClient } from '@investment-tracker/api-client';
import type { components } from '@investment-tracker/shared-types';

export type Transaction = components['schemas']['Transaction'];
export type TransactionCreateRequest = components['schemas']['TransactionCreateRequest'];
export type TransactionUpdateRequest = components['schemas']['TransactionUpdateRequest'];
export type TransactionType = components['schemas']['TransactionType'];

export async function createTransaction(
  client: InvestmentTrackerClient,
  body: TransactionCreateRequest,
): Promise<Transaction> {
  const { data, error } = await client.POST('/transactions', { body });
  if (error || !data) throw error ?? new Error('Failed to create transaction');
  return data;
}

export async function updateTransaction(
  client: InvestmentTrackerClient,
  id: string,
  body: TransactionUpdateRequest,
): Promise<Transaction> {
  const { data, error } = await client.PATCH('/transactions/{id}', {
    params: { path: { id } },
    body,
  });
  if (error || !data) throw error ?? new Error('Failed to update transaction');
  return data;
}

export async function deleteTransaction(
  client: InvestmentTrackerClient,
  id: string,
): Promise<void> {
  const { error } = await client.DELETE('/transactions/{id}', {
    params: { path: { id } },
  });
  if (error) throw error;
}
