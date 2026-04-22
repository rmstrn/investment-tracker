'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  InsightCard,
  Skeleton,
} from '@investment-tracker/ui';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import type { UseInsightsOptions } from '../../hooks/useInsights';
import { useInsights } from '../../hooks/useInsights';
import { useLocalDismissedInsights } from '../../hooks/useLocalDismissedInsights';
import type { Insight } from '../../lib/api/insights';
import { insightTypeLabels } from '../../lib/insights-labels';
import { mapSeverity } from './insight-severity-map';

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function InsightCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-md border border-border-default p-4 pl-5">
      <div className="absolute left-0 top-0 h-full w-1 bg-background-tertiary" aria-hidden="true" />
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-5/6" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single card action area
// ---------------------------------------------------------------------------

function InsightActions({
  insight,
  onDismiss,
}: {
  insight: Insight;
  onDismiss: (id: string) => void;
}) {
  const rawActionUrl = (insight.data as { action_url?: string } | undefined)?.action_url;
  const actionUrl =
    typeof rawActionUrl === 'string' && rawActionUrl.startsWith('/') ? rawActionUrl : null;

  return (
    <div className="flex items-center gap-2">
      {actionUrl ? (
        <Link
          href={actionUrl}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border-default bg-transparent px-4 text-sm font-medium text-text-primary transition-colors hover:bg-interactive-ghostHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:bg-interactive-ghostActive"
        >
          View
        </Link>
      ) : null}

      <Dropdown>
        <DropdownTrigger
          aria-label="Insight options"
          className="h-9 w-9 rounded-md border border-border-default hover:bg-interactive-ghostHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <MoreHorizontal size={16} aria-hidden="true" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onClick={() => onDismiss(insight.id)}>Dismiss</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------

export interface InsightsFeedProps {
  filters: UseInsightsOptions;
}

export function InsightsFeed({ filters }: InsightsFeedProps) {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { dismiss, isDismissed } = useLocalDismissedInsights();

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInsights(filters);

  // Flatten pages
  const allInsights: Insight[] = data?.pages.flatMap((p) => p.data) ?? [];
  const visibleInsights = allInsights.filter((i) => !isDismissed(i.id));

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNext();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNext]);

  // --- Loading ---
  if (isLoading || accountsLoading) {
    return (
      <div className="flex flex-col gap-3" aria-label="Loading insights" aria-busy="true">
        <InsightCardSkeleton />
        <InsightCardSkeleton />
        <InsightCardSkeleton />
      </div>
    );
  }

  // --- Error ---
  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-md border border-state-negative-default/30 bg-state-negative-default/5 p-6 text-center"
      >
        <p className="text-sm font-medium text-text-primary">Couldn't load insights. Try again.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  // --- Empty ---
  if (visibleInsights.length === 0) {
    const hasAccounts = (accountsData?.length ?? 0) > 0;

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        {hasAccounts ? (
          <p className="text-sm text-text-secondary">
            No insights yet. Check back soon — we generate insights as data accumulates.
          </p>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              Connect an account to get personalised insights.
            </p>
            <Link
              href="/accounts"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border-default bg-transparent px-4 text-sm font-medium text-text-primary transition-colors hover:bg-interactive-ghostHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:bg-interactive-ghostActive"
            >
              Connect account
            </Link>
          </>
        )}
      </div>
    );
  }

  // --- Feed ---
  return (
    <div className="flex flex-col gap-3">
      {visibleInsights.map((insight) => (
        <InsightCard
          key={insight.id}
          title={insight.title}
          body={insight.body}
          severity={mapSeverity(insight.severity)}
          kicker={insightTypeLabels[insight.insight_type]}
          action={<InsightActions insight={insight} onDismiss={dismiss} />}
        />
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} aria-hidden="true" className="h-1" />

      {isFetchingNextPage ? (
        <div className="flex flex-col gap-3" aria-label="Loading more insights" aria-busy="true">
          <InsightCardSkeleton />
        </div>
      ) : null}
    </div>
  );
}
