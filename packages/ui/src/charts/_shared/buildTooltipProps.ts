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
      // PO feedback (2026-04-29): tooltip blended with chart background.
      // Force the cream-paper card surface (light: --card #FFFFFF; dark: #26262E)
      // and bump the border + shadow so the tooltip reads as a clearly elevated
      // floating mini-card, not a wash over the chart area.
      background: 'var(--chart-tooltip-bg, var(--card, #FFFFFF))',
      // Stronger border so the tooltip edge separates from chart content even
      // when the underlying gridline + axis labels are dense. Falls through
      // to a 14% ink alpha (light) / 24% white alpha (dark) when token unset.
      border: '1px solid var(--chart-tooltip-border, rgba(20, 20, 20, 0.14))',
      borderRadius: 12,
      // Bumped to a more lifted shadow + cream highlight rim so the tooltip
      // reads as tactile-paper floating above the chart. The first layer is
      // the route-level lift, second is a sharp directional drop for crispness,
      // third is the inset top highlight that gives the «paper edge» feel.
      boxShadow:
        'var(--chart-tooltip-shadow, var(--shadow-lift, 0 12px 32px rgba(20, 20, 20, 0.18))), 0 2px 6px rgba(20, 20, 20, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
      padding: '10px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontFeatureSettings: '"tnum" 1, "ss01" 1',
      // Belt-and-suspenders: opaque background. If `--chart-tooltip-bg` ever
      // resolves to a translucent value the explicit `background` above wins,
      // and `backdropFilter` adds defence against gridline bleed-through on
      // light theme + cream backgrounds.
      backdropFilter: 'blur(2px)',
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
