/**
 * Tooltip style object for Recharts `<Tooltip>`.
 *
 * Matches CHARTS_SPEC §3.5: mini-card with --card bg, --border outline,
 * shadow-lift elevation, Geist Mono eyebrow, tabular-nums values.
 */

import type { CSSProperties } from 'react';

export interface TooltipPropsBundle {
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
  itemStyle: CSSProperties;
  cursor: { stroke: string; strokeWidth: number; strokeDasharray: string };
  separator: string;
  wrapperStyle: CSSProperties;
}

export function buildTooltipProps(): TooltipPropsBundle {
  return {
    contentStyle: {
      background: 'var(--chart-tooltip-bg)',
      border: '1px solid var(--chart-tooltip-border)',
      borderRadius: 14,
      // Fallback hardening per audit §1.3 — if `--chart-tooltip-shadow` is
      // unset (route-level embed, future test harness), fall through to the
      // v1.1 paper-feel `--shadow-lift` rather than the legacy `--shadow-md`.
      boxShadow: 'var(--chart-tooltip-shadow, var(--shadow-lift))',
      padding: '10px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontFeatureSettings: '"tnum" 1, "ss01" 1',
    },
    labelStyle: {
      color: 'var(--chart-axis-label)',
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 6,
      fontWeight: 500,
    },
    itemStyle: {
      color: 'var(--color-text-primary)',
      fontVariantNumeric: 'tabular-nums',
      padding: '2px 0',
    },
    cursor: {
      stroke: 'var(--chart-cursor)',
      strokeWidth: 1,
      strokeDasharray: '2 4',
    },
    separator: ' · ',
    wrapperStyle: { outline: 'none' },
  };
}
