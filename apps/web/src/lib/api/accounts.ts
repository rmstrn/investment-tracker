import type { InvestmentTrackerClient } from '@investment-tracker/api-client';
import type { components } from '@investment-tracker/shared-types';

export type Account = components['schemas']['Account'];
export type AccountCreateRequest = components['schemas']['AccountCreateRequest'];
export type AccountUpdateRequest = components['schemas']['AccountUpdateRequest'];
export type AccountCreateResponse = components['schemas']['AccountCreateResponse'];

export async function fetchAccounts(client: InvestmentTrackerClient): Promise<Account[]> {
  const { data, error } = await client.GET('/accounts', {});
  if (error || !data) throw error ?? new Error('Failed to load accounts');
  return data.data;
}

export async function createAccount(
  client: InvestmentTrackerClient,
  body: AccountCreateRequest,
): Promise<Account> {
  const { data, error } = await client.POST('/accounts', { body });
  if (error || !data) throw error ?? new Error('Failed to create account');
  return data.account;
}

export async function updateAccount(
  client: InvestmentTrackerClient,
  id: string,
  body: AccountUpdateRequest,
): Promise<Account> {
  const { data, error } = await client.PATCH('/accounts/{id}', {
    params: { path: { id } },
    body,
  });
  if (error || !data) throw error ?? new Error('Failed to update account');
  return data;
}

export async function deleteAccount(client: InvestmentTrackerClient, id: string): Promise<void> {
  const { error } = await client.DELETE('/accounts/{id}', {
    params: { path: { id } },
  });
  if (error) throw error;
}
