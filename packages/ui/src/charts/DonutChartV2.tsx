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

/**
 * Arc geometry sugar layer (D2 — kickoff §«arcMode»). `'full'` keeps the
 * default 12-o'clock anchored 360° sweep. `'270'` resolves to a bottom-
 * opening 270° sweep (start `−3π/4`, end `+3π/4`) — leaves a 90° wedge at
 * the bottom for the legend to sit in (D5 detail).
 *
 * Sugar resolution rule: `arcMode` only takes effect when BOTH
 * `startAngleRadians` AND `endAngleRadians` are unset by the caller.
 * Explicit raw-radian values always win — anatomy ADR §«Slice geometry».
 */
export type DonutArcMode = 'full' | '270';

/**
 * Palette taxonomy (D2 — `CHART_PALETTE_v2_draft.md` Section 4 + kickoff
 * §«palette»). Slice fills resolve via different token streams per mode:
 *
 * - `'categorical'` (default) — `--chart-categorical-1..5` cycling. The
 *   museum-vitrine 5-hue family (slate · ochre · fog-blue · plum · stone)
 *   re-pointed in D1 via `chart-categorical.*` semantic aliases.
 * - `'sequential'` — slices sorted desc-by-value get the 7-step
 *   `--chart-sequential-1..7` ink ramp (largest = darkest / brightest in
 *   dark theme; smallest = lightest / dimmest). 7-slice cap; >7 slices
 *   recycles the floor token (TD candidate for D5+ refinement).
 * - `'monochromatic'` — single hue (categorical-1) with progressive
 *   opacity 1.0 → 0.4 across N slices. Initial impl; refine post-D2.
 */
export type DonutPalette = 'categorical' | 'sequential' | 'monochromatic';

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
   *
   * If left undefined together with `endAngleRadians`, `arcMode` decides.
   */
  startAngleRadians?: number;
  /**
   * End angle in radians. Default `2π` (full circle). Set to `π` for a
   * 180° semi-circle starting from `startAngleRadians` (typically `0`).
   *
   * If left undefined together with `startAngleRadians`, `arcMode` decides.
   */
  endAngleRadians?: number;
  /**
   * Sugar layer for arc geometry. `'full'` (default) → standard 360° donut
   * anchored at 12 o'clock; `'270'` → bottom-opening 270° wedge. Only
   * applies when neither `startAngleRadians` nor `endAngleRadians` is
   * explicitly supplied (raw-angle props win).
   */
  arcMode?: DonutArcMode;
  /**
   * Corner radius in pixels. Default `3` (D2 — anatomy ADR §«Slice
   * geometry»). The cap rule `min(specifiedR, ringWidth/2,
   * sliceArcLengthAtCenterline/4)` is applied per-slice inside the
   * rounded-path branch to prevent «pinching» on <8% slices.
   * Pass `0` to opt back into the fast circle-stroke ring path.
   */
  cornerRadius?: number;
  /**
   * Slice palette mode. Default `'categorical'` — museum-vitrine 5-hue
   * cycling. See `DonutPalette` for `'sequential'` and `'monochromatic'`.
   */
  palette?: DonutPalette;
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

/** D2 default `cornerRadius` (anatomy ADR §«Slice geometry»). */
const DEFAULT_CORNER_RADIUS = 3;

/**
 * Bottom-opening 270° arc — start `−3π/4` (≈225° / lower-left), end
 * `+3π/4` (≈135° / lower-right), sweeping clockwise across the top, with a
 * 90° wedge missing at the bottom (anatomy ADR §«Arc mode»).
 */
const ARC_270_START = -Math.PI * (3 / 4);
const ARC_270_END = Math.PI * (3 / 4);

/* Resolved sector type — `color` is non-optional after fallback resolution. */
interface ResolvedSegment {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
  /** Per-slice fill opacity, used by `'monochromatic'` palette mode. */
  readonly fillOpacity?: number;
  /** Original payload index — preserves caller order even when sorted. */
  readonly originalIndex: number;
}

/**
 * Museum-vitrine categorical cycle (D1 — `chart-categorical-1..5` semantic
 * aliases). Slot order = slate → ochre → fog-blue → plum → stone per
 * `CHART_PALETTE_v2_draft.md` §4 «Order rationale» (max hue separation for
 * 2-series and 3-series cases).
 */
const CATEGORICAL_PALETTE = [
  'var(--chart-categorical-1)',
  'var(--chart-categorical-2)',
  'var(--chart-categorical-3)',
  'var(--chart-categorical-4)',
  'var(--chart-categorical-5)',
] as const;

/**
 * 7-step ink ramp for sequential / ordinal-by-magnitude palette
 * (`chart-sequential-1..7`). Index 0 = top magnitude (darkest in light
 * theme, brightest in dark theme); index 6 = bottom magnitude.
 */
const SEQUENTIAL_PALETTE = [
  'var(--chart-sequential-1)',
  'var(--chart-sequential-2)',
  'var(--chart-sequential-3)',
  'var(--chart-sequential-4)',
  'var(--chart-sequential-5)',
  'var(--chart-sequential-6)',
  'var(--chart-sequential-7)',
] as const;

/**
 * Apply the corner-radius cap rule per anatomy ADR §«Slice geometry»:
 *
 *     effectiveR = min(specifiedR, ringWidth / 2, sliceArcLengthAtCenterline / 4)
 *
 * Prevents the «pinching» artefact on thin slices below ~8% of total
 * sweep. Below the cap, d3-shape gracefully falls back to a mitered
 * (un-rounded) corner — no special handling needed downstream.
 */
function capCornerRadius(
  specifiedR: number,
  ringWidth: number,
  sliceArcLengthAtCenterline: number,
): number {
  if (specifiedR <= 0) return 0;
  return Math.min(specifiedR, ringWidth / 2, sliceArcLengthAtCenterline / 4);
}

/**
 * Resolve a slice's fill token from the active palette mode + render index.
 *
 * - `'categorical'` → cycles `--chart-categorical-1..5` modulo 5. The
 *   museum-vitrine 5-hue family covers the 5-categorical cap; charts that
 *   exceed 5 series are expected to migrate to «top-4 + Other» grouping
 *   (CHART_PALETTE_v2_draft.md §5.3).
 * - `'sequential'` → maps `renderIdx` (post-sort) onto
 *   `--chart-sequential-1..7`. Above 7 slices, the floor token (`-7`) is
 *   reused; flagged as TD in D5 if real fixtures stress this.
 * - `'monochromatic'` → all slices = `--chart-categorical-1`; per-slice
 *   `fillOpacity` carries the visual differentiation.
 */
function resolvePaletteColor(
  mode: DonutPalette,
  renderIdx: number,
  totalSegments: number,
): string {
  if (mode === 'sequential') {
    const i = Math.min(renderIdx, SEQUENTIAL_PALETTE.length - 1);
    return SEQUENTIAL_PALETTE[i] as string;
  }
  if (mode === 'monochromatic') {
    return CATEGORICAL_PALETTE[0] as string;
  }
  // 'categorical' — wrap around the 5-hue cycle. `noUncheckedIndexedAccess`
  // forces the assertion; modulo with a non-empty constant is safe.
  void totalSegments;
  return CATEGORICAL_PALETTE[renderIdx % CATEGORICAL_PALETTE.length] as string;
}

/**
 * `'monochromatic'` opacity ramp: 1.0 → 0.4 across N slices, even spacing.
 * Initial implementation per kickoff D2 §«palette wiring» — refinement
 * (e.g. tonal HSL fade in lieu of opacity) tracked as a follow-on TD.
 */
function resolveMonochromaticOpacity(renderIdx: number, totalSegments: number): number {
  if (totalSegments <= 1) return 1;
  const top = 1.0;
  const floor = 0.4;
  return top - ((top - floor) * renderIdx) / (totalSegments - 1);
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function DonutChartV2({
  payload,
  size = 220,
  centerLabel,
  className,
  startAngleRadians,
  endAngleRadians,
  arcMode = 'full',
  cornerRadius = DEFAULT_CORNER_RADIUS,
  palette = 'categorical',
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

  // ─── Arc geometry resolution (D2) ────────────────────────────────────
  // `arcMode` is sugar — caller-supplied raw radians always win. Only when
  // BOTH raw props are unset do we resolve `arcMode` to start/end.
  const callerSetExplicitAngles =
    startAngleRadians !== undefined || endAngleRadians !== undefined;
  let resolvedStart: number;
  let resolvedEnd: number;
  if (callerSetExplicitAngles) {
    resolvedStart = startAngleRadians ?? 0;
    resolvedEnd = endAngleRadians ?? TWO_PI;
  } else if (arcMode === '270') {
    resolvedStart = ARC_270_START;
    resolvedEnd = ARC_270_END;
  } else {
    // 'full' default — preserves prior 12-o'clock-anchored 360° behaviour.
    resolvedStart = 0;
    resolvedEnd = TWO_PI;
  }

  // ─── Geometry ────────────────────────────────────────────────────────
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * INNER_RADIUS_RATIO;
  const ringWidth = outerR - innerR;
  const radius = (outerR + innerR) / 2; // centerline of the ring stroke
  const circumference = TWO_PI * radius;

  // Total available sweep (handles semi-circle / arbitrary ranges).
  const totalSweep = resolvedEnd - resolvedStart;
  const totalValue = payload.segments.reduce((acc, s) => acc + s.value, 0) || 1;

  // ─── Palette + ordering (D2) ─────────────────────────────────────────
  // For `'sequential'` palette, slice render order is sorted desc-by-value
  // — index 0 (largest) gets the darkest ramp step. `originalIndex` is
  // preserved so legend / data-table / keyboard-nav stay caller-stable.
  // `'categorical'` and `'monochromatic'` keep payload order.
  const sortedSegments =
    palette === 'sequential'
      ? [...payload.segments]
          .map((s, i) => ({ s, i }))
          .sort((a, b) => b.s.value - a.s.value)
      : payload.segments.map((s, i) => ({ s, i }));

  const segmentCount = sortedSegments.length;
  const segments: ResolvedSegment[] = sortedSegments.map(({ s, i }, renderIdx) => {
    const fallback = resolvePaletteColor(palette, renderIdx, segmentCount);
    return {
      key: s.key,
      label: s.label,
      value: s.value,
      color: s.color ?? fallback,
      fillOpacity:
        palette === 'monochromatic'
          ? resolveMonochromaticOpacity(renderIdx, segmentCount)
          : undefined,
      originalIndex: i,
    };
  });

  // Pre-compute angular boundaries for each sector.
  const sectorBounds = (() => {
    const acc: Array<{ start: number; end: number; sweep: number; pct: number }> = [];
    let cursor = resolvedStart;
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
      data-arc-mode={callerSetExplicitAngles ? 'custom' : arcMode}
      data-palette={palette}
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
              ringWidth={ringWidth}
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
              startAngle={resolvedStart}
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
            // FastDonutRing renders the slice as a stroked arc, so the
            // monochromatic palette's per-slice opacity rides on the
            // stroke channel (vs `fillOpacity` in the rounded path).
            strokeOpacity={seg.fillOpacity}
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
      {/* 1px hairline paper-cut between sectors (anatomy ADR §«Slice
          borders») — drawn as N short radial line caps centred on each
          boundary. `--card` cream stroke + `non-scaling-stroke` keeps the
          hairline crisp on retina + through hover scale transforms.
          MANDATORY for WCAG: mitigates stone↔ochre tritanopia ΔL=0. */}
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
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
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
  /** Ring thickness — needed by the corner-radius cap rule. */
  ringWidth: number;
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
  ringWidth,
  cornerRadius,
  activeIndex,
  hoverIndex,
  prefersReducedMotion,
  setHoverState,
  setActiveIndex,
}: RoundedDonutPathProps) {
  // Centerline radius for the slice-arc-length cap rule.
  const centerlineR = (innerR + outerR) / 2;
  return (
    <g transform={`translate(${cx} ${cy})`} data-testid="donut-rounded-path">
      {segments.map((seg, i) => {
        const bound = sectorBounds[i];
        if (!bound) return null;
        // Cap the corner radius per anatomy ADR §«Slice geometry» —
        // prevents «pinching» on thin slices below ~8% sweep.
        const sliceArcLengthAtCenterline = Math.abs(bound.sweep) * centerlineR;
        const effectiveR = capCornerRadius(
          cornerRadius,
          ringWidth,
          sliceArcLengthAtCenterline,
        );
        const d = arcPath({
          innerRadius: innerR,
          outerRadius: outerR,
          startAngle: bound.start,
          endAngle: bound.end,
          cornerRadius: effectiveR,
        });
        const isActive = activeIndex === i || hoverIndex === i;
        return (
          <path
            key={seg.key}
            d={d}
            fill={seg.color}
            fillOpacity={seg.fillOpacity}
            // 1px hairline outline — `--card` cream paper, NOT pure white
            // (anatomy ADR §«Slice borders»). `non-scaling-stroke` keeps
            // the hairline crisp on retina + during hover scale transforms.
            // MANDATORY — WCAG mitigation for stone↔ochre tritanopia ΔL=0.
            stroke="var(--card, #FFFFFF)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
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
