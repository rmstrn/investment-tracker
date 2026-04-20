import type { components } from '@investment-tracker/shared-types';
import { Card } from '@investment-tracker/ui';
import { formatCurrency, fractionToPercent } from '../../lib/format';

type ImpactCard = components['schemas']['AIMessageContentImpactCard'];
type AffectedPosition = components['schemas']['AffectedPosition'];

export interface ImpactCardViewProps {
  data: ImpactCard;
}

/**
 * Scenario-simulator card (design brief §14.2). Rendered only from
 * persisted AIMessage content — the live stream never emits this today.
 */
export function ImpactCardView({ data }: ImpactCardViewProps) {
  const beforeTotal = data.before.values.display.total_value;
  const afterTotal = data.after.values.display.total_value;
  const currency = data.after.values.display.currency;
  return (
    <Card variant="elevated" className="space-y-3">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-primary">Scenario impact</h3>
        <span className="text-xs text-text-tertiary">{data.scenario}</span>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <SnapshotColumn label="Before" amount={beforeTotal} currency={currency} tone="neutral" />
        <SnapshotColumn
          label="After"
          amount={afterTotal}
          currency={currency}
          tone={pickTone(beforeTotal, afterTotal)}
        />
      </div>
      {data.top_affected_positions?.length ? (
        <div className="space-y-1 border-t border-border-subtle pt-3">
          <div className="text-xs uppercase tracking-wide text-text-tertiary">Top affected</div>
          <ul className="divide-y divide-border-subtle">
            {data.top_affected_positions.map((p) => (
              <AffectedRow key={`${p.symbol}-${p.asset_type}`} position={p} />
            ))}
          </ul>
        </div>
      ) : null}
      {data.narrative ? (
        <p className="text-sm leading-relaxed text-text-secondary">{data.narrative}</p>
      ) : null}
    </Card>
  );
}

function SnapshotColumn({
  label,
  amount,
  currency,
  tone,
}: {
  label: string;
  amount: string;
  currency: string;
  tone: 'neutral' | 'gain' | 'loss';
}) {
  const toneClass =
    tone === 'gain'
      ? 'text-portfolio-gain-default'
      : tone === 'loss'
        ? 'text-portfolio-loss-default'
        : 'text-text-primary';
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-text-tertiary">{label}</div>
      <div className={`text-lg font-semibold tabular-nums ${toneClass}`}>
        {formatCurrency(amount, currency)}
      </div>
    </div>
  );
}

function AffectedRow({ position }: { position: AffectedPosition }) {
  const percent = fractionToPercent(position.delta_percent);
  const toneClass = percent >= 0 ? 'text-portfolio-gain-default' : 'text-portfolio-loss-default';
  return (
    <li className="flex items-center justify-between py-1.5 text-sm">
      <span className="font-medium text-text-primary">{position.symbol}</span>
      <span className={`tabular-nums ${toneClass}`}>
        {percent >= 0 ? '+' : ''}
        {percent.toFixed(2)}%
      </span>
    </li>
  );
}

function pickTone(before: string, after: string): 'neutral' | 'gain' | 'loss' {
  const b = Number(before);
  const a = Number(after);
  if (!Number.isFinite(b) || !Number.isFinite(a) || a === b) return 'neutral';
  return a > b ? 'gain' : 'loss';
}
