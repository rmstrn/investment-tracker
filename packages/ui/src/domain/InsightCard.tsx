import { Sparkles } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Card } from '../primitives/Card';

export type InsightSeverity = 'info' | 'positive' | 'warning' | 'negative';

export interface InsightCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  body: string;
  severity?: InsightSeverity;
  /** Optional inline action (e.g. "<Button>Learn more</Button>") */
  action?: ReactNode;
  /** "Insight of the day" label, etc. */
  kicker?: string;
}

const severityBar: Record<InsightSeverity, string> = {
  info: 'bg-state-info-default',
  positive: 'bg-state-positive-default',
  warning: 'bg-state-warning-default',
  negative: 'bg-state-negative-default',
};

export function InsightCard({
  title,
  body,
  severity = 'info',
  action,
  kicker = 'Insight of the day',
  className,
  ...props
}: InsightCardProps) {
  return (
    <Card variant="elevated" className={cn('relative overflow-hidden', className)} {...props}>
      <div
        className={cn('absolute left-0 top-0 h-full w-1', severityBar[severity])}
        aria-hidden="true"
      />
      <div className="pl-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-400">
          <Sparkles size={14} aria-hidden="true" />
          <span>{kicker}</span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{body}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </Card>
  );
}
