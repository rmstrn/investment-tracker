import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@investment-tracker/ui';
import type { Position } from '../../lib/api/positions';
import { formatCurrency, formatRelativeTime, formatShortAccountId } from '../../lib/format';
import { formatPositionPnl } from './pnl-helpers';

export interface PositionOverviewTabProps {
  position: Position;
}

export function PositionOverviewTab({ position }: PositionOverviewTabProps) {
  const display = position.values.display;
  const pnl = formatPositionPnl(position);
  const avgCost = position.avg_cost ? formatCurrency(position.avg_cost, position.currency) : '—';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Profit &amp; Loss</CardTitle>
          <CardDescription>Unrealised change on this position</CardDescription>
        </CardHeader>
        <CardContent>
          {pnl.kind === 'absent' ? (
            <div className="font-mono text-3xl font-semibold text-text-tertiary">—</div>
          ) : (
            <div className="space-y-1">
              <div
                className={`font-mono text-3xl font-semibold tabular-nums ${
                  pnl.kind === 'gain'
                    ? 'text-portfolio-gain-default'
                    : pnl.kind === 'loss'
                      ? 'text-portfolio-loss-default'
                      : 'text-text-secondary'
                }`}
              >
                {pnl.absoluteLabel}
              </div>
              <div className="font-mono text-sm text-text-secondary tabular-nums">
                {pnl.percentLabel}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Source and pricing context</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-text-tertiary">Account</dt>
            <dd className="font-mono text-text-primary">
              {formatShortAccountId(position.account_id)}
            </dd>
            <dt className="text-text-tertiary">Avg cost</dt>
            <dd className="font-mono text-text-primary tabular-nums">{avgCost}</dd>
            <dt className="text-text-tertiary">Cost basis</dt>
            <dd className="font-mono text-text-primary tabular-nums">
              {formatCurrency(display.total_cost, display.currency)}
            </dd>
            <dt className="text-text-tertiary">Last calculated</dt>
            <dd className="text-text-primary">{formatRelativeTime(position.last_calculated_at)}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
