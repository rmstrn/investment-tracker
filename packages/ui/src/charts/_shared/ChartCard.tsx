import type { CSSProperties, ReactNode } from 'react';

/**
 * ChartCard — DSM-V1 paper-feel chart wrapper (chart-audit §1.1).
 *
 * Asymmetric padding (`22px 24px 20px`), 18px corner radius, semantic `--card`
 * background and `--shadow-card` multi-axis warm shadow. The cream-edge
 * highlight is baked into the `--shadow-card` token itself, so the surface
 * looks identical in light and dark themes.
 *
 * Designed to be the canonical surface for any chart-bearing card across the
 * product (showcase, dashboard, positions, insights). Refactored out of
 * `apps/web/src/app/design/_sections/charts.tsx` so consumers don't duplicate.
 *
 * Optional `eyebrow` / `title` / `subtitle` lockup matches the chart-audit
 * §1.2 header pattern. All three are optional — pass `children` only for
 * a bare chart-card.
 */
export interface ChartCardProps {
  /** Optional eyebrow (small uppercase mono label above the title). */
  eyebrow?: string;
  /** Optional headline line (h-row title). */
  title?: string;
  /** Optional subtitle / supporting copy. */
  subtitle?: string;
  /** Card body — typically a chart component. */
  children: ReactNode;
  /** Extra class names appended to the outer wrapper. */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
}

const WRAPPER_STYLE: CSSProperties = {
  background: 'var(--card)',
  boxShadow: 'var(--shadow-card)',
  padding: '22px 24px 20px',
  borderRadius: '18px',
};

export function ChartCard({
  eyebrow,
  title,
  subtitle,
  children,
  className,
  style,
}: ChartCardProps) {
  const hasHeader = Boolean(eyebrow || title || subtitle);
  return (
    <div className={className} style={{ ...WRAPPER_STYLE, ...style }}>
      {hasHeader ? (
        <div className="mb-4 space-y-1">
          {eyebrow ? (
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: 'var(--text-3, var(--color-text-tertiary))',
                fontWeight: 500,
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h3
              className="font-semibold tracking-tight"
              style={{
                fontSize: '18px',
                lineHeight: 1.25,
                color: 'var(--ink, var(--color-text-primary))',
              }}
            >
              {title}
            </h3>
          ) : null}
          {subtitle ? (
            <p
              className="text-text-secondary"
              style={{ fontSize: '12px', lineHeight: 1.45 }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
