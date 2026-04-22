'use client';

import { cn } from '@investment-tracker/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { InsightSeverity, InsightType } from '../../lib/api/insights';

// ---------------------------------------------------------------------------
// Severity chips (backend enum: info | warning | critical — 3 values)
// ---------------------------------------------------------------------------

const SEVERITIES: { value: InsightSeverity; label: string; activeClass: string }[] = [
  {
    value: 'info',
    label: 'Info',
    activeClass: 'border-state-info-default bg-state-info-default/10 text-state-info-default',
  },
  {
    value: 'warning',
    label: 'Warning',
    activeClass:
      'border-state-warning-default bg-state-warning-default/10 text-state-warning-default',
  },
  {
    value: 'critical',
    label: 'Critical',
    activeClass:
      'border-state-negative-default bg-state-negative-default/10 text-state-negative-default',
  },
];

const INSIGHT_TYPES: { value: InsightType; label: string }[] = [
  { value: 'diversification', label: 'Diversification' },
  { value: 'risk', label: 'Risk' },
  { value: 'performance', label: 'Performance' },
  { value: 'rebalance', label: 'Rebalance' },
  { value: 'cost', label: 'Cost' },
  { value: 'behavioral', label: 'Behavioral' },
];

// ---------------------------------------------------------------------------
// URL param helpers
// ---------------------------------------------------------------------------

export interface ParsedFilters {
  severity: InsightSeverity[];
  insightType: InsightType | undefined;
  includeDismissed: boolean;
}

export function parseFiltersFromParams(params: URLSearchParams): ParsedFilters {
  const rawSeverities = params.getAll('severity') as InsightSeverity[];
  const severity = rawSeverities.filter((s): s is InsightSeverity =>
    ['info', 'warning', 'critical'].includes(s),
  );

  const rawType = params.get('type') ?? '';
  const insightType = INSIGHT_TYPES.map((t) => t.value).includes(rawType as InsightType)
    ? (rawType as InsightType)
    : undefined;

  const includeDismissed = params.get('dismissed') === 'true';

  return { severity, insightType, includeDismissed };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InsightFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const {
    severity: activeSeverities,
    insightType,
    includeDismissed,
  } = parseFiltersFromParams(params);

  const update = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      updater(next);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const toggleSeverity = useCallback(
    (value: InsightSeverity) => {
      update((p) => {
        const current = p.getAll('severity') as InsightSeverity[];
        p.delete('severity');
        if (current.includes(value)) {
          for (const s of current.filter((s) => s !== value)) {
            p.append('severity', s);
          }
        } else {
          for (const s of [...current, value]) {
            p.append('severity', s);
          }
        }
      });
    },
    [update],
  );

  const setType = useCallback(
    (value: string) => {
      update((p) => {
        if (value === '') {
          p.delete('type');
        } else {
          p.set('type', value);
        }
      });
    },
    [update],
  );

  const toggleDismissed = useCallback(() => {
    update((p) => {
      if (p.get('dismissed') === 'true') {
        p.delete('dismissed');
      } else {
        p.set('dismissed', 'true');
      }
    });
  }, [update]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Severity chips */}
      <fieldset className="flex items-center gap-1 border-0 p-0">
        <legend className="sr-only">Filter by severity</legend>
        {SEVERITIES.map(({ value, label, activeClass }) => {
          const isActive = activeSeverities.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleSeverity(value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                isActive
                  ? activeClass
                  : 'border-border-default text-text-secondary hover:bg-interactive-ghostHover',
              )}
            >
              {label}
            </button>
          );
        })}
      </fieldset>

      {/* Type select */}
      <div className="flex items-center gap-2">
        <label htmlFor="insight-type-select" className="sr-only">
          Filter by type
        </label>
        <select
          id="insight-type-select"
          value={insightType ?? ''}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-border-default bg-background-primary px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          <option value="">All types</option>
          {INSIGHT_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Show dismissed toggle */}
      <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-text-secondary">
        <input
          type="checkbox"
          checked={includeDismissed}
          onChange={toggleDismissed}
          className="h-3.5 w-3.5 rounded border-border-default accent-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        />
        Show dismissed
      </label>
    </div>
  );
}
