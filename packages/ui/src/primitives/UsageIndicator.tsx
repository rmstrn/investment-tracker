import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface UsageIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  used: number;
  limit: number;
  /** Noun: "messages", "insights", "accounts". */
  unit: string;
  /** Period scope, e.g. "today", "this week". Default "today". */
  period?: string;
  /** Plan tag, e.g. "Free plan". */
  plan?: string;
  /** Inline CTA shown when `used >= limit`. */
  upgradeCta?: ReactNode;
}

function tone(used: number, limit: number): 'neutral' | 'warning' | 'danger' {
  if (used >= limit) return 'danger';
  if (limit > 0 && used / limit >= 0.8) return 'warning';
  return 'neutral';
}

/**
 * UsageIndicator — freemium usage pill above chat input + insight caps. Brief §13.3.
 * Three states: neutral / warning (>=80%) / danger (>=100%).
 */
export function UsageIndicator({
  used,
  limit,
  unit,
  period = 'today',
  plan,
  upgradeCta,
  className,
  ...props
}: UsageIndicatorProps) {
  const t = tone(used, limit);
  const remaining = Math.max(0, limit - used);
  const text =
    t === 'danger'
      ? `You've hit ${period}'s ${unit} limit`
      : t === 'warning'
        ? `${remaining} ${remaining === 1 ? unit.replace(/s$/, '') : unit} left ${period}`
        : `${used} of ${limit} ${unit} ${period}${plan ? ` — ${plan}` : ''}`;
  const toneClass =
    t === 'danger'
      ? 'text-state-negative-default'
      : t === 'warning'
        ? 'text-state-warning-default'
        : 'text-text-tertiary';
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-between gap-3 text-xs tabular-nums',
        toneClass,
        className,
      )}
      {...props}
    >
      <span>{text}</span>
      {t === 'danger' && upgradeCta ? <span className="shrink-0">{upgradeCta}</span> : null}
    </div>
  );
}
