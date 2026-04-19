import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type PlanTier = 'free' | 'plus' | 'pro';

export interface PlanBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tier: PlanTier;
  /** Show upgrade affordance (→). Brief §13.6: Free only. */
  showUpgradeHint?: boolean;
}

const tierLabel: Record<PlanTier, string> = {
  free: 'Free plan',
  plus: 'Plus',
  pro: 'Pro',
};

const tierStyle: Record<PlanTier, string> = {
  free: 'bg-background-tertiary text-text-secondary',
  plus: 'text-static-white bg-[var(--gradient-plus)] shadow-xs',
  pro: 'text-static-white bg-[var(--gradient-pro)] shadow-xs',
};

/**
 * PlanBadge — sidebar-bottom plan chip. Brief §13.6.
 */
export function PlanBadge({ tier, showUpgradeHint, className, ...props }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tierStyle[tier],
        className,
      )}
      {...props}
    >
      {tierLabel[tier]}
      {showUpgradeHint && tier === 'free' ? (
        <span aria-hidden="true" className="text-text-tertiary">
          →
        </span>
      ) : null}
    </span>
  );
}
