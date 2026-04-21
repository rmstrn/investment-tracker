import type { Account } from '../../../lib/api/accounts';
import { createServerApiClient } from '../../../lib/api/server';
import { AccountsPageClient } from './accounts-page-client';

async function fetchInitialAccounts(): Promise<Account[] | undefined> {
  try {
    const client = await createServerApiClient();
    const { data, error } = await client.GET('/accounts', {});
    if (error || !data) return undefined;
    return data.data;
  } catch {
    return undefined;
  }
}

export default async function AccountsPage() {
  const initialData = await fetchInitialAccounts();

  return (
    <div className="space-y-6">
      <AccountsPageClient initialData={initialData} />
    </div>
  );
}
