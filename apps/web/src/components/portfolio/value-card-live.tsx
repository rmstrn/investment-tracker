'use client';

import { Button, Card, EmptyState, PortfolioCard, Skeleton } from '@investment-tracker/ui';
import { Wallet } from 'lucide-react';
import { type PortfolioSnapshot, usePortfolio } from '../../hooks/usePortfolio';
import { formatCurrency, formatSignedCurrency, fractionToPercent } from '../../lib/format';

export interface PortfolioValueCardLiveProps {
  initialData?: PortfolioSnapshot | null;
}

export function PortfolioValueCardLive({ initialData }: PortfolioValueCardLiveProps) {
  const { data, isLoading, isError } = usePortfolio({ initialData });

  if (isError) return <PortfolioValueCardError />;
  if (isLoading || !data) return <PortfolioValueCardSkeleton />;
  return <PortfolioValueCardView snapshot={data} />;
}

interface PortfolioValueCardViewProps {
  snapshot: PortfolioSnapshot;
}

/**
 * Pure presentation — easy to unit-test without TanStack Query plumbing.
 */
export function PortfolioValueCardView({ snapshot }: PortfolioValueCardViewProps) {
  const display = snapshot.values.display;
  const totalValue = Number(display.total_value);

  if (!Number.isFinite(totalValue) || totalValue === 0) {
    return <PortfolioValueCardEmpty />;
  }

  const valueLabel = formatCurrency(display.total_value, display.currency);
  const pnlDisplay = snapshot.pnl_absolute?.display ?? '0';
  const changeLabel = formatSignedCurrency(pnlDisplay, display.currency);
  const changePct = fractionToPercent(snapshot.pnl_percent ?? 0);

  return (
    <PortfolioCard
      label="Total portfolio"
      value={valueLabel}
      change={changeLabel}
      changePct={changePct}
      caption="Today"
    />
  );
}

function PortfolioValueCardSkeleton() {
  return (
    <Card variant="elevated" className="min-w-64" aria-busy="true">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-40" />
      <Skeleton className="mt-3 h-4 w-32" />
    </Card>
  );
}

function PortfolioValueCardError() {
  return (
    <Card variant="elevated" className="min-w-64">
      <div className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
        Total portfolio
      </div>
      <div className="mt-3 text-sm text-state-negative-default">
        Unable to load portfolio. Try again in a moment.
      </div>
    </Card>
  );
}

function PortfolioValueCardEmpty() {
  return (
    <Card variant="elevated" className="min-w-64">
      <EmptyState
        title="No portfolio data yet"
        description="Connect your first account to start tracking value, P&L and allocation."
        primaryAction={
          <Button variant="primary" disabled aria-label="Connect your first account (coming soon)">
            <Wallet size={16} aria-hidden /> Connect your first account
          </Button>
        }
      />
    </Card>
  );
}
