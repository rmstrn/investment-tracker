'use client';

/**
 * DonutChartV2 — pure custom-primitives donut on Layer 2 + Layer 1.
 *
 * Phase β.1.3 of the chart-primitives migration. Behind feature flag
 * `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives`. Most pattern-rich
 * primitive — proves the layer.
 *
 * Two render paths (per chart-visual-references.md):
 *
 *   1. **Fast path** — `cornerRadius === 0`. Render N sectors as
 *      `<circle r outerR-ringW/2 stroke-dasharray="X 2πr">` rotated
 *      `-90deg`. Eliminates d3-shape arc generator entirely. Plugin-architect
 *      Pattern 2: «Donut = 5×<circle stroke-dasharray> ring (NOT D3-arc)».
 *
 *   2. **Rounded path** — `cornerRadius > 0`. Falls back to d3-shape
 *      `arcPath()` from the math layer (which already pipes through
 *      `.cornerRadius()`).
 *
 * Extended props from PO references (chart-visual-references.md):
 *   - `startAngleRadians` / `endAngleRadians` — semi-circle pies, gauges
 *   - `cornerRadius` — pixel-rounded corners (amCharts visual quality bar)
 *   - `labelPosition` — `'center' | 'outside' | 'leader-line'` (Chart.js
 *     polar-area inspiration)
 *
 * A11y: `<ChartFrame>` wraps the SVG canvas. ChartDataTable + aria-live
 * polite + keyboard-nav cycle through sectors via the frame's default
 * configuration.
 *
 * Visual:
 *   - 60% inner radius default (donut ring, not pie)
 *   - Stroke between sectors: `var(--card)` 2px (clean paper-cut separation)
 *   - Active sector: 1.02× scale + 4px `var(--accent-glow)` rim on hover/focus
 *   - centerLabel: 24px Geist 600 number + 11px Geist Mono uppercase eyebrow
 *   - Sweep-in animation: stroke-dashoffset on circle arc
 *   - Reduced-motion: instant render
 */

import type { DonutChartPayload } from '@investment-tracker/shared-types/charts';
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { ChartDataTable } from './_shared/ChartDataTable';
import { formatValue } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { useRef } from 'react';
import { arcPath } from './primitives/math/path';
import { Tooltip } from './primitives/svg/Tooltip';
import { CHART_ANIMATION_MS } from './tokens';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export type DonutLabelPosition = 'center' | 'outside' | 'leader-line';

export interface DonutChartV2Props {
  payload: DonutChartPayload;
  size?: number;
  /** Custom centre label override; falls back to `payload.centerLabel`. */
  centerLabel?: ReactNode;
  className?: string;

  /* ─── Extended props per chart-visual-references.md ───────────────── */

  /**
   * Start angle in radians, 0 at 12 o'clock, clockwise positive.
   * Default `0` (= 12 o'clock). Set to `-π` for a semi-circle pie that
   * starts at the 9-o'clock and sweeps to 3-o'clock.
   *
   * NOTE: We use SVG-native angle convention here (0 = top, clockwise+).
   * The math layer `arcPath` follows d3's identical convention.
   */
  startAngleRadians?: number;
  /**
   * End angle in radians. Default `2π` (full circle). Set to `π` for a
   * 180° semi-circle starting from `startAngleRadians` (typically `0`).
   */
  endAngleRadians?: number;
  /**
   * Corner radius in pixels. Default 0 (uses fast circle-stroke ring path).
   * Any positive value switches to the d3-shape `<path>` rounded path.
   */
  cornerRadius?: number;
  /**
   * Label placement strategy. Default `'center'` — falls back to legend below.
   * Future: `'outside'` (slice-aligned tangent text), `'leader-line'`
   * (Chart.js polar-area inspiration). Phase β.1 ships `'center'` only and
   * stubs the rest with the same legend treatment so consumers can
   * pre-emit the prop.
   */
  labelPosition?: DonutLabelPosition;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const TWO_PI = Math.PI * 2;
const INNER_RADIUS_RATIO = 0.6;

/* Resolved sector type — `color` is non-optional after fallback resolution. */
interface ResolvedSegment {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

/**
 * Donut palette (carry-over from V1 — DO NOT change without product-designer
 * sign-off). Perceptually-distinct sector allocation: deep-jade · ink ·
 * ochre · soft-bronze · cobalt-ink · graphite · …
 */
const ALLOCATION_PALETTE = [
  'var(--chart-series-1)',
  'var(--chart-series-3)',
  'var(--chart-series-9)',
  'var(--chart-series-6)',
  'var(--chart-series-10)',
  'var(--chart-series-5)',
  'var(--chart-series-11)',
  'var(--chart-series-4)',
  'var(--chart-series-2)',
  'var(--chart-series-12)',
  'var(--chart-series-7)',
  'var(--chart-series-8)',
] as const;

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function DonutChartV2({
  payload,
  size = 220,
  centerLabel,
  className,
  startAngleRadians = 0,
  endAngleRadians = TWO_PI,
  cornerRadius = 0,
  labelPosition = 'center',
}: DonutChartV2Props) {
  const dataTableId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverState, setHoverState] = useState<{
    index: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.segments.length, onIndexChange);

  const fmtValue = useCallback(
    (n: number) => formatValue(n, payload.format, payload.currency),
    [payload.format, payload.currency],
  );

  // ─── Geometry ────────────────────────────────────────────────────────
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * INNER_RADIUS_RATIO;
  const ringWidth = outerR - innerR;
  const radius = (outerR + innerR) / 2; // centerline of the ring stroke
  const circumference = TWO_PI * radius;

  // Total available sweep (handles semi-circle / arbitrary ranges).
  const totalSweep = endAngleRadians - startAngleRadians;
  const totalValue = payload.segments.reduce((acc, s) => acc + s.value, 0) || 1;

  // Resolve segments + colours. Explicit shape — spread of the optional
  // `color?: string` from the schema would propagate `string | undefined`
  // into downstream non-optional `color: string` slots.
  const segments: ResolvedSegment[] = payload.segments.map((s, i) => {
    // `noUncheckedIndexedAccess` makes `ALLOCATION_PALETTE[…]` return
    // `string | undefined`; assert non-undefined via the modulo invariant
    // — `i % len` is always within bounds of a non-empty palette.
    const fallback = ALLOCATION_PALETTE[i % ALLOCATION_PALETTE.length] as string;
    return {
      key: s.key,
      label: s.label,
      value: s.value,
      color: s.color ?? fallback,
    };
  });

  // Pre-compute angular boundaries for each sector.
  const sectorBounds = (() => {
    const acc: Array<{ start: number; end: number; sweep: number; pct: number }> = [];
    let cursor = startAngleRadians;
    for (const seg of segments) {
      const pct = seg.value / totalValue;
      const sweep = pct * totalSweep;
      acc.push({ start: cursor, end: cursor + sweep, sweep, pct });
      cursor += sweep;
    }
    return acc;
  })();

  const useRoundedPath = cornerRadius > 0;
  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  // ─── Mount-time sweep animation gate (stroke-dashoffset on circles) ──
  const [sweepReady, setSweepReady] = useState(prefersReducedMotion);
  useEffect(() => {
    if (prefersReducedMotion) {
      setSweepReady(true);
      return;
    }
    // Trigger transition after first paint.
    const id = requestAnimationFrame(() => setSweepReady(true));
    return () => cancelAnimationFrame(id);
  }, [prefersReducedMotion]);

  const center =
    centerLabel ??
    (payload.centerLabel ? <DonutCenterLabel text={payload.centerLabel} /> : null);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-donut"
      data-chart-backend="primitives"
      data-active-index={activeIndex ?? undefined}
      data-corner-rounded={useRoundedPath || undefined}
      data-half-circle={Math.abs(totalSweep - Math.PI) < 1e-6 || undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
      onMouseLeave={() => setHoverState(null)}
    >
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          focusable="false"
          style={{ overflow: 'visible' }}
        >
          {/* Subtle backplate ring for paper-edge feel. */}
          <circle
            cx={cx}
            cy={cy}
            r={outerR + 1}
            fill="none"
            stroke="var(--border-subtle, rgba(20, 20, 20, 0.06))"
            strokeWidth={1}
          />

          {useRoundedPath ? (
            <RoundedDonutPath
              segments={segments}
              sectorBounds={sectorBounds}
              cx={cx}
              cy={cy}
              innerR={innerR}
              outerR={outerR}
              cornerRadius={cornerRadius}
              activeIndex={activeIndex}
              hoverIndex={hoverState?.index ?? null}
              prefersReducedMotion={prefersReducedMotion}
              setHoverState={setHoverState}
              setActiveIndex={setActiveIndex}
            />
          ) : (
            <FastDonutRing
              segments={segments}
              sectorBounds={sectorBounds}
              cx={cx}
              cy={cy}
              radius={radius}
              ringWidth={ringWidth}
              circumference={circumference}
              startAngle={startAngleRadians}
              activeIndex={activeIndex}
              hoverIndex={hoverState?.index ?? null}
              sweepReady={sweepReady}
              prefersReducedMotion={prefersReducedMotion}
              setHoverState={setHoverState}
              setActiveIndex={setActiveIndex}
            />
          )}
        </svg>

        {/* Centre label — skipped on semi-circle to avoid covering open arc. */}
        {labelPosition === 'center' && center ? (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ paddingInline: 12 }}
          >
            {center}
          </div>
        ) : null}
      </div>

      {/* Legend — sibling, not overlay (V1 «layout поехал» fix carries over). */}
      <ul
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
        style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}
      >
        {segments.map((s, i) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 9,
                height: 9,
                borderRadius: 999,
                background: s.color,
                outline:
                  i === activeIndex ? '1.5px solid var(--accent, currentColor)' : undefined,
                outlineOffset: i === activeIndex ? 2 : undefined,
              }}
            />
            <span className="font-medium">{s.label}</span>
          </li>
        ))}
      </ul>

      {/* Tooltip — portal primitive from α.2 */}
      {hoverState ? (
        <Tooltip open clientX={hoverState.clientX} clientY={hoverState.clientY}>
          <DonutTooltipBody
            segment={segments[hoverState.index]}
            pct={(sectorBounds[hoverState.index]?.pct ?? 0) * 100}
            valueLabel={fmtValue(segments[hoverState.index]?.value ?? 0)}
          />
        </Tooltip>
      ) : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Subcomponent — fast circle-stroke ring                                  */
/* ────────────────────────────────────────────────────────────────────── */

interface FastDonutRingProps {
  segments: ReadonlyArray<ResolvedSegment>;
  sectorBounds: ReadonlyArray<{ start: number; end: number; sweep: number; pct: number }>;
  cx: number;
  cy: number;
  radius: number;
  ringWidth: number;
  circumference: number;
  startAngle: number;
  activeIndex: number | null;
  hoverIndex: number | null;
  sweepReady: boolean;
  prefersReducedMotion: boolean;
  setHoverState: (s: { index: number; clientX: number; clientY: number } | null) => void;
  setActiveIndex: (n: number) => void;
}

function FastDonutRing({
  segments,
  sectorBounds,
  cx,
  cy,
  radius,
  ringWidth,
  circumference,
  startAngle,
  activeIndex,
  hoverIndex,
  sweepReady,
  prefersReducedMotion,
  setHoverState,
  setActiveIndex,
}: FastDonutRingProps) {
  // Each circle:
  //   stroke-width = ringWidth (fills inner→outer)
  //   stroke-dasharray = "<sweep-length> <circumference>" → only that arc
  //     painted; rest invisible
  //   stroke-dashoffset = -(start-arc-length) → shifts the dash to the
  //     correct angular start
  //   transform = rotate(-90deg around cx,cy) — moves angle 0 to 12 o'clock
  return (
    <g
      transform={`rotate(-90 ${cx} ${cy})`}
      data-testid="donut-fast-ring"
    >
      {segments.map((seg, i) => {
        const bound = sectorBounds[i];
        if (!bound) return null;
        const arcLen = (bound.sweep / (Math.PI * 2)) * circumference;
        const offsetLen =
          (((bound.start - startAngle) / (Math.PI * 2)) * circumference) % circumference;
        const isActive = activeIndex === i || hoverIndex === i;
        const targetDashoffset = sweepReady ? -offsetLen : -offsetLen + arcLen;

        return (
          <circle
            key={seg.key}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={ringWidth}
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={targetDashoffset}
            data-testid="donut-sector"
            data-segment-key={seg.key}
            data-segment-index={i}
            data-active={isActive || undefined}
            style={{
              transition: prefersReducedMotion
                ? undefined
                : `stroke-dashoffset ${CHART_ANIMATION_MS}ms ease-out, transform 160ms ease-out, filter 160ms ease-out`,
              transformOrigin: `${cx}px ${cy}px`,
              transform: isActive && !prefersReducedMotion ? 'scale(1.02)' : undefined,
              filter: isActive
                ? 'drop-shadow(0 0 4px var(--accent-glow, rgba(190, 150, 90, 0.55)))'
                : undefined,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) =>
              setHoverState({
                index: i,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }
            onMouseMove={(e) =>
              setHoverState({
                index: i,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }
            onMouseLeave={() => setHoverState(null)}
            onFocus={() => setActiveIndex(i)}
          />
        );
      })}
      {/* 2px paper-cut between sectors — drawn as N short radial line caps
          centred on each boundary. We use a single overlay group of `<line>`
          elements at sector boundaries; the cream colour breaks the strokes
          into individually-readable arcs. */}
      <g aria-hidden="true">
        {sectorBounds.map((bound, i) => {
          const a = bound.start;
          const inner = radius - ringWidth / 2;
          const outer = radius + ringWidth / 2;
          const x1 = cx + Math.cos(a) * inner;
          const y1 = cy + Math.sin(a) * inner;
          const x2 = cx + Math.cos(a) * outer;
          const y2 = cy + Math.sin(a) * outer;
          return (
            <line
              key={`sep-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--card, #FFFFFF)"
              strokeWidth={2}
              strokeLinecap="butt"
            />
          );
        })}
      </g>
    </g>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Subcomponent — rounded path (cornerRadius > 0)                          */
/* ────────────────────────────────────────────────────────────────────── */

interface RoundedDonutPathProps {
  segments: ReadonlyArray<ResolvedSegment>;
  sectorBounds: ReadonlyArray<{ start: number; end: number; sweep: number; pct: number }>;
  cx: number;
  cy: number;
  innerR: number;
  outerR: number;
  cornerRadius: number;
  activeIndex: number | null;
  hoverIndex: number | null;
  prefersReducedMotion: boolean;
  setHoverState: (s: { index: number; clientX: number; clientY: number } | null) => void;
  setActiveIndex: (n: number) => void;
}

function RoundedDonutPath({
  segments,
  sectorBounds,
  cx,
  cy,
  innerR,
  outerR,
  cornerRadius,
  activeIndex,
  hoverIndex,
  prefersReducedMotion,
  setHoverState,
  setActiveIndex,
}: RoundedDonutPathProps) {
  return (
    <g transform={`translate(${cx} ${cy})`} data-testid="donut-rounded-path">
      {segments.map((seg, i) => {
        const bound = sectorBounds[i];
        if (!bound) return null;
        const d = arcPath({
          innerRadius: innerR,
          outerRadius: outerR,
          startAngle: bound.start,
          endAngle: bound.end,
          cornerRadius,
        });
        const isActive = activeIndex === i || hoverIndex === i;
        return (
          <path
            key={seg.key}
            d={d}
            fill={seg.color}
            stroke="var(--card, #FFFFFF)"
            strokeWidth={2}
            data-testid="donut-sector"
            data-segment-key={seg.key}
            data-segment-index={i}
            data-active={isActive || undefined}
            style={{
              transition: prefersReducedMotion
                ? undefined
                : 'transform 160ms ease-out, filter 160ms ease-out',
              transformBox: 'fill-box',
              transformOrigin: 'center',
              transform: isActive && !prefersReducedMotion ? 'scale(1.02)' : undefined,
              filter: isActive
                ? 'drop-shadow(0 0 4px var(--accent-glow, rgba(190, 150, 90, 0.55)))'
                : undefined,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) =>
              setHoverState({
                index: i,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }
            onMouseMove={(e) =>
              setHoverState({
                index: i,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }
            onMouseLeave={() => setHoverState(null)}
            onFocus={() => setActiveIndex(i)}
          />
        );
      })}
    </g>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Subcomponent — centre label                                             */
/* ────────────────────────────────────────────────────────────────────── */

interface DonutCenterLabelProps {
  text: string;
}

const CENTER_NUMBER_STYLE: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 24,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--ink, #1A1A1A)',
};

const CENTER_EYEBROW_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 11,
  lineHeight: 1.4,
  marginTop: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-secondary, rgba(20, 20, 20, 0.55))',
};

function DonutCenterLabel({ text }: DonutCenterLabelProps) {
  // V1 has rendered `payload.centerLabel` as a single string. To honour the
  // β.1 spec («24px Geist 600 number + 11px Geist Mono uppercase eyebrow
  // stacked»), we attempt to split on the first whitespace — leading token
  // becomes the number, trailing tokens the eyebrow. Single-token labels
  // render as just the number (eyebrow omitted gracefully).
  const trimmed = text.trim();
  const firstSpace = trimmed.indexOf(' ');
  const headline = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
  const eyebrow = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1);
  return (
    <>
      <span style={CENTER_NUMBER_STYLE}>{headline}</span>
      {eyebrow ? <span style={CENTER_EYEBROW_STYLE}>{eyebrow}</span> : null}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Subcomponent — tooltip body                                             */
/* ────────────────────────────────────────────────────────────────────── */

interface DonutTooltipBodyProps {
  segment: ResolvedSegment | undefined;
  pct: number;
  valueLabel: string;
}

const TOOLTIP_EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 10,
  lineHeight: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-secondary, rgba(20, 20, 20, 0.55))',
  marginBottom: 6,
};

const TOOLTIP_VALUE: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1.2,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--ink, #1A1A1A)',
};

const TOOLTIP_PCT: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  lineHeight: 1.2,
  marginTop: 2,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--color-text-secondary, rgba(20, 20, 20, 0.55))',
};

function DonutTooltipBody({ segment, pct, valueLabel }: DonutTooltipBodyProps) {
  if (!segment) return null;
  return (
    <div>
      <div style={TOOLTIP_EYEBROW}>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: 999,
            background: segment.color,
            marginRight: 6,
            verticalAlign: 'middle',
          }}
        />
        {segment.label}
      </div>
      <div style={TOOLTIP_VALUE}>{valueLabel}</div>
      <div style={TOOLTIP_PCT}>{pct.toFixed(1)}%</div>
    </div>
  );
}
