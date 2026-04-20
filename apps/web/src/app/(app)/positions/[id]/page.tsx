import { notFound } from 'next/navigation';
import { PositionDetailLive } from '../../../../components/positions/position-detail-live';
import type { PositionTransactionsPage } from '../../../../hooks/usePositionTransactions';
import type { Position } from '../../../../lib/api/positions';
import { createServerApiClient } from '../../../../lib/api/server';

type InitialData =
  | { kind: 'found'; position: Position; transactions?: PositionTransactionsPage }
  | { kind: 'not_found' }
  | { kind: 'error' };

async function fetchInitial(id: string): Promise<InitialData> {
  try {
    const client = await createServerApiClient();
    const [posRes, txnsRes] = await Promise.all([
      client.GET('/positions/{id}', { params: { path: { id } } }),
      client.GET('/positions/{id}/transactions', { params: { path: { id }, query: {} } }),
    ]);
    if (posRes.response.status === 404) return { kind: 'not_found' };
    if (posRes.error || !posRes.data) return { kind: 'error' };
    const transactions =
      !txnsRes.error && txnsRes.data
        ? { data: txnsRes.data.data, meta: txnsRes.data.meta }
        : undefined;
    return { kind: 'found', position: posRes.data, transactions };
  } catch {
    return { kind: 'error' };
  }
}

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initial = await fetchInitial(id);

  if (initial.kind === 'not_found') {
    notFound();
  }

  if (initial.kind === 'error') {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Position</h1>
        <p className="text-sm text-state-negative-default">
          Unable to load this position right now. Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <PositionDetailLive
      id={id}
      initialPosition={initial.position}
      initialTransactions={initial.transactions}
    />
  );
}
