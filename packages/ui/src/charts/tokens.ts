/**
 * Chart token bridge.
 *
 * Recharts primitives accept stroke/fill as string values (colors, urls).
 * These helpers resolve against the CSS custom properties emitted by
 * `@investment-tracker/design-tokens/css`. Using var(...) means charts flip
 * their palette automatically when `.dark` is applied on an ancestor.
 */

export const SERIES_PALETTE = [
  'var(--color-brand-600)',
  'var(--color-state-info-default)',
  'var(--color-state-warning-default)',
  'var(--color-portfolio-gain-default)',
  'var(--color-portfolio-loss-default)',
  'var(--color-brand-400)',
  'var(--color-neutral-400)',
] as const;

export const CHART_COLORS = {
  axisLabel: 'var(--color-text-tertiary)',
  gridLine: 'var(--color-border-subtle)',
  tooltipBg: 'var(--color-background-elevated)',
  tooltipBorder: 'var(--color-border-subtle)',
  areaStroke: 'var(--color-brand-600)',
  areaFillId: 'portfolio-area-fill',
  gain: 'var(--color-portfolio-gain-default)',
  loss: 'var(--color-portfolio-loss-default)',
} as const;

export const CHART_ANIMATION_MS = 600;
