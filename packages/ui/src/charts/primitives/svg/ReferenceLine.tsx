'use client';

/**
 * ReferenceLine — embossed groove primitive (2 stacked <line> elements).
 *
 * Per spec docs/superpowers/specs/2026-04-30-bar-chart-v2-design.md §2.5:
 * 1px ink-shadow at `position` then 1px card-highlight at `position + 1` —
 * gives a tactile «scored into paper» feel matching the editorial-still-life
 * form. Drops V1's dashed line (Recharts leftover).
 *
 * Caller responsibility: convert payload-space value (typically 0 for
 * Lane-A Risk Flag 2 zero-axis reference) to pixel-space via the
 * appropriate scale before passing as `position`.
 *
 * Token note: `--ink-shadow-soft` and `--card-highlight` are not yet
 * defined in design-tokens. The component uses CSS var with rgba fallback
 * via the standard `var(--name, fallback)` syntax. TD: add tokens proper
 * post-Bar V2 ships.
 */

import type { JSX } from 'react';

export interface ReferenceLineLabel {
  text: string;
  align?: 'start' | 'end';
}

export interface ReferenceLineProps {
  orientation: 'horizontal' | 'vertical';
  /** Pixel coordinate in inner-rect space. */
  position: number;
  innerWidth: number;
  innerHeight: number;
  label?: ReferenceLineLabel;
}

const INK_SHADOW_FALLBACK = 'rgba(20, 20, 20, 0.18)';
const CARD_HIGHLIGHT_FALLBACK = 'rgba(255, 255, 255, 0.55)';
const LABEL_FONT_SIZE = 10;
const LABEL_OFFSET = 4;

export function ReferenceLine({
  orientation,
  position,
  innerWidth,
  innerHeight,
  label,
}: ReferenceLineProps): JSX.Element {
  const isHorizontal = orientation === 'horizontal';
  const inkPos = position;
  const highlightPos = position + 1;

  const inkX1 = isHorizontal ? 0 : inkPos;
  const inkY1 = isHorizontal ? inkPos : 0;
  const inkX2 = isHorizontal ? innerWidth : inkPos;
  const inkY2 = isHorizontal ? inkPos : innerHeight;

  const highlightX1 = isHorizontal ? 0 : highlightPos;
  const highlightY1 = isHorizontal ? highlightPos : 0;
  const highlightX2 = isHorizontal ? innerWidth : highlightPos;
  const highlightY2 = isHorizontal ? highlightPos : innerHeight;

  const labelAlign = label?.align ?? 'end';
  const labelX = isHorizontal
    ? labelAlign === 'end'
      ? innerWidth - LABEL_OFFSET
      : LABEL_OFFSET
    : inkPos + LABEL_OFFSET;
  const labelY = isHorizontal
    ? inkPos - LABEL_OFFSET
    : labelAlign === 'end'
      ? innerHeight - LABEL_OFFSET
      : LABEL_FONT_SIZE;
  const labelAnchor: 'start' | 'end' = isHorizontal
    ? labelAlign === 'end'
      ? 'end'
      : 'start'
    : 'start';

  return (
    <g data-testid="reference-line" data-orientation={orientation}>
      <line
        data-testid="ref-line-ink"
        x1={inkX1}
        y1={inkY1}
        x2={inkX2}
        y2={inkY2}
        stroke={`var(--ink-shadow-soft, ${INK_SHADOW_FALLBACK})`}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <line
        data-testid="ref-line-highlight"
        x1={highlightX1}
        y1={highlightY1}
        x2={highlightX2}
        y2={highlightY2}
        stroke={`var(--card-highlight, ${CARD_HIGHLIGHT_FALLBACK})`}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {label ? (
        <text
          data-testid="ref-line-label"
          x={labelX}
          y={labelY}
          fontSize={LABEL_FONT_SIZE}
          fontFamily="var(--font-mono)"
          fill="var(--axis-label, var(--color-text-secondary))"
          textAnchor={labelAnchor}
          style={{ fontVariantCaps: 'small-caps', letterSpacing: '0.06em' }}
        >
          {label.text}
        </text>
      ) : null}
    </g>
  );
}
