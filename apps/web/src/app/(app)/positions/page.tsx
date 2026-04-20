import { PositionsListLive } from '../../../components/positions/positions-list-live';
import type { Position } from '../../../lib/api/positions';
import { createServerApiClient } from '../../../lib/api/server';

async function fetchInitialPositions(): Promise<Position[] | undefined> {
  try {
    const client = await createServerApiClient();
    const { data, error } = await client.GET('/positions');
    if (error || !data) return undefined;
    return data.data;
  } catch {
    return undefined;
  }
}

export default async function PositionsPage() {
  const initialData = await fetchInitialPositions();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Positions</h1>
        <p className="text-sm text-text-secondary">
          Live holdings across your accounts. Select a row to open position detail.
        </p>
      </header>

      <section aria-label="Positions list">
        <PositionsListLive initialData={initialData} />
      </section>
    </div>
  );
}
