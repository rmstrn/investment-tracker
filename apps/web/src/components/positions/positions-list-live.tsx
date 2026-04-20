'use client';

import { Button, Card, EmptyState, Skeleton } from '@investment-tracker/ui';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { usePositions } from '../../hooks/usePositions';
import type { Position } from '../../lib/api/positions';
import { PositionsTable } from './positions-table';
import {
  type AssetFilter,
  type GroupOption,
  PositionsToolbar,
  type SortOption,
} from './positions-toolbar';

export interface PositionsListLiveProps {
  /** Server-hydrated list for the default `sort=value_desc&group_by=symbol`. */
  initialData?: Position[];
}

const DEFAULT_SORT: SortOption = 'value_desc';
const DEFAULT_GROUP: GroupOption = 'symbol';

export function PositionsListLive({ initialData }: PositionsListLiveProps) {
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [group, setGroup] = useState<GroupOption>(DEFAULT_GROUP);
  const [filter, setFilter] = useState<AssetFilter>('all');

  const matchesDefault = sort === DEFAULT_SORT && group === DEFAULT_GROUP;
  const { data, isLoading, isError } = usePositions({
    query: { sort, group_by: group },
    initialData: matchesDefault ? initialData : undefined,
  });

  const positions = data ?? [];
  const filtered = filter === 'all' ? positions : positions.filter((p) => p.asset_type === filter);

  return (
    <div className="space-y-4">
      <PositionsToolbar
        sort={sort}
        onSortChange={setSort}
        group={group}
        onGroupChange={setGroup}
        filter={filter}
        onFilterChange={setFilter}
      />
      {isError ? (
        <PositionsErrorCard />
      ) : isLoading ? (
        <PositionsSkeleton />
      ) : filtered.length === 0 ? (
        <PositionsEmpty filtered={filter !== 'all' && positions.length > 0} />
      ) : (
        <PositionsTable positions={filtered} />
      )}
    </div>
  );
}

function PositionsSkeleton() {
  return (
    <Card variant="elevated" aria-busy="true" className="p-0">
      <div className="divide-y divide-border-subtle">
        {Array.from({ length: 5 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows.
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 w-20" />
            <div className="ml-auto flex items-center gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PositionsErrorCard() {
  return (
    <Card variant="elevated">
      <div className="text-sm text-state-negative-default">
        Unable to load positions. Try again in a moment.
      </div>
    </Card>
  );
}

function PositionsEmpty({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <Card variant="elevated">
        <EmptyState
          title="No matching positions"
          description="Adjust the filter to see the rest of your portfolio."
        />
      </Card>
    );
  }
  return (
    <Card variant="elevated">
      <EmptyState
        title="No positions yet"
        description="Connect an account to start tracking your positions."
        primaryAction={
          <Button variant="primary" disabled aria-label="Connect your first account (coming soon)">
            <Wallet size={16} aria-hidden="true" /> Connect your first account
          </Button>
        }
      />
    </Card>
  );
}
