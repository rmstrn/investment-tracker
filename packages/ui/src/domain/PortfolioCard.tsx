import { TrendingDown, TrendingUp } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Card } from '../primitives/Card';

export interface PortfolioCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Display name, e.g. "Total portfolio" */
  label: string;
  /** Already-formatted currency value, e.g. "€124,350.12" */
  value: string;
  /** Absolute change, already formatted, e.g. "+€2,134.00" */
  change: string;
  /** Percent change as number, e.g. 1.73 → "+1.73%" */
  changePct: number;
  /** Optional caption like "Today" or "30d" */
  caption?: string;
}

export function PortfolioCard({
  label,
  value,
  change,
  changePct,
  caption = 'Today',
  className,
  ...props
}: PortfolioCardProps) {
  const positive = changePct >= 0;
  const toneClass = positive ? 'text-portfolio-gain-default' : 'text-portfolio-loss-default';
  const Icon = positive ? TrendingUp : TrendingDown;
  const pct = `${positive ? '+' : ''}${changePct.toFixed(2)}%`;

  return (
    <Card variant="elevated" className={cn('min-w-64', className)} {...props}>
      <div className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</div>
      <div className="mt-2 font-mono text-3xl font-semibold text-text-primary tabular-nums">
        {value}
      </div>
      <div className={cn('mt-2 flex items-center gap-1 text-sm font-medium', toneClass)}>
        <Icon size={14} aria-hidden="true" />
        <span className="font-mono tabular-nums">{change}</span>
        <span className="font-mono tabular-nums">({pct})</span>
        <span className="text-text-tertiary ml-1 font-sans">· {caption}</span>
      </div>
    </Card>
  );
}
