'use client';

/**
 * DonutVisx — visx-powered candy-themed allocation donut (POC).
 *
 * Pre-migration POC. Does not replace `DonutChartV2`. Lives next to the
 * v2 primitives so PO can compare side-by-side at `/design-system#charts`
 * vs `/design-system#charts-visx`.
 *
 * Visual register: candy (chunky Bagel center label, ink hard-shadow drop
 * behind each slice, signal-orange CTA accents inherited from the
 * `[data-surface="candy"]` cascade).
 *
 * Library boundary:
 *   - `<Pie>` from `@visx/shape` for arc geometry (cornerRadius=8)
 *   - `<Group>` from `@visx/group` for centred translation
 *   - All styling driven by CSS-vars + inline styles. No d3-shape arcs
 *     instantiated by hand.
 *
 * Hard ink-shadow drop = signature. Each slice arc path rendered TWICE:
 *   1. shadow path translated `(2px, 2px)`, fill = `--text-on-candy`
 *      at 0.85 opacity
 *   2. coloured slice path on top
 * No `filter: drop-shadow()` — we want a hard, paper-press, single-layer
 * ink shadow that reads as Provedo brand, not as soft Material elevation.
 *
 * Hover lift: `translate(-2px, -2px)` on the slice group (so the colour +
 * shadow shift together but the shadow stays anchored, producing the
 * «card-pressed → card-released» motion). Reduced motion → no lift.
 */

import type { DonutChartPayload } from '@investment-tracker/shared-types/charts';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import type { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { type CSSProperties, type ReactNode, useEffect, useId, useState } from 'react';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface DonutVisxProps {
  payload: DonutChartPayload;
  size?: number;
  /** Custom centre lockup; falls back to `payload.centerLabel`. */
  centerLabel?: ReactNode;
  /**
   * Eyebrow rendered under the chunky center numeral. Defaults to
   * `'Portfolio'`. Pass empty string to suppress.
   */
  centerEyebrow?: string;
  className?: string;
}

interface ResolvedSegment {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Candy donut palette. Pulls from the existing `--chart-categorical-1..5`
 * semantic aliases (D1 — `CHART_PALETTE_v2_draft.md` §4) so the visx
 * variant stays in lockstep with V2 if the theme is switched. Light/dark
 * resolution happens automatically via the `<html data-theme>` cascade.
 */
const CANDY_PALETTE = [
  'var(--chart-categorical-1)',
  'var(--chart-categorical-2)',
  'var(--chart-categorical-3)',
  'var(--chart-categorical-4)',
  'var(--chart-categorical-5)',
] as const;

/** Bagel chunky center number — Bagel ships only one weight (400). */
const CENTER_HEADLINE_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-display, 'Bagel Fat One', sans-serif)",
  fontWeight: 400,
  fontSize: 'clamp(28px, 4vw, 44px)',
  lineHeight: 1,
  color: 'var(--text-on-candy, var(--ink, #1C1B26))',
  letterSpacing: '-0.01em',
};

const CENTER_EYEBROW_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-body, 'Manrope', system-ui, sans-serif)",
  fontWeight: 500,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'var(--text-on-candy, var(--ink, #1C1B26))',
  opacity: 0.7,
  marginTop: 6,
  fontVariantNumeric: 'tabular-nums',
};

/** Hard ink-shadow drop offset (signature paper-press feel). */
const SHADOW_OFFSET_PX = 2;

/** Hover lift translation. Cap is 2px; non-negotiable. */
const HOVER_LIFT_PX = 2;

/** Spring-soft easing — playful overshoot per design-system §5. */
const HOVER_TRANSITION =
  'transform 220ms var(--motion-easing-spring-soft, cubic-bezier(0.34, 1.56, 0.64, 1))';

/** Entrance: sweep duration matches `--motion-duration-deliberate` (720ms). */
const ENTRANCE_DURATION_MS = 720;
/** Per-segment stagger — ink builds clockwise. */
const ENTRANCE_STAGGER_MS = 80;
/** Cubic-out — quick start, soft settle (matches deliberate easing). */
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function DonutVisx({
  payload,
  size = 240,
  centerLabel,
  centerEyebrow = 'Portfolio',
  className,
}: DonutVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ─── Entrance progress (0 → 1) ───────────────────────────────────────
  // Reduced-motion: skip RAF, lock at 1 so segments paint full immediately.
  const [entranceMs, setEntranceMs] = useState<number>(
    prefersReducedMotion ? Number.POSITIVE_INFINITY : 0,
  );
  useEffect(() => {
    if (prefersReducedMotion) {
      setEntranceMs(Number.POSITIVE_INFINITY);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number): void => {
      const elapsed = now - t0;
      setEntranceMs(elapsed);
      // Last segment finishes at duration + (n-1)*stagger; we don't know n here
      // so just stop at a generous ceiling. RAF cost is negligible.
      const ceiling =
        ENTRANCE_DURATION_MS + ENTRANCE_STAGGER_MS * Math.max(0, payload.segments.length - 1) + 80;
      if (elapsed < ceiling) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, payload.segments.length]);

  // ─── Geometry ────────────────────────────────────────────────────────
  // Padding leaves room for the (2px,2px) ink shadow + 2px hover lift
  // without clipping at the SVG edge.
  const padding = 8;
  const radius = size / 2 - padding;
  const innerRadius = radius * 0.6;
  const centerX = size / 2;
  const centerY = size / 2;

  // ─── Resolve segments ────────────────────────────────────────────────
  const segments: ResolvedSegment[] = payload.segments.map((s, i) => ({
    key: s.key,
    label: s.label,
    value: s.value,
    color: s.color ?? (CANDY_PALETTE[i % CANDY_PALETTE.length] as string),
  }));

  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  const center =
    centerLabel ??
    (payload.centerLabel ? (
      <DonutCenterLabel text={payload.centerLabel} eyebrow={centerEyebrow} />
    ) : null);

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-donut-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
      onMouseLeave={() => setHoverIndex(null)}
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
          <Group top={centerY} left={centerX}>
            <Pie<ResolvedSegment>
              data={segments}
              pieValue={(d) => d.value}
              outerRadius={radius}
              innerRadius={innerRadius}
              cornerRadius={8}
              padAngle={0.012}
            >
              {(pie) => (
                <>
                  {pie.arcs.map((arc, i) => {
                    // Per-segment entrance progress (0 → 1).
                    const segStart = i * ENTRANCE_STAGGER_MS;
                    const localElapsed = entranceMs - segStart;
                    const rawProgress =
                      localElapsed <= 0
                        ? 0
                        : localElapsed >= ENTRANCE_DURATION_MS
                          ? 1
                          : localElapsed / ENTRANCE_DURATION_MS;
                    const progress = easeOutCubic(rawProgress);
                    const sweepEnd = arc.startAngle + (arc.endAngle - arc.startAngle) * progress;
                    const animatedArc = { ...arc, endAngle: sweepEnd };
                    const path = pie.path(animatedArc) ?? '';
                    const isHover = hoverIndex === i;
                    const lift =
                      isHover && !prefersReducedMotion
                        ? `translate(${-HOVER_LIFT_PX}px, ${-HOVER_LIFT_PX}px)`
                        : 'translate(0, 0)';

                    return (
                      <g
                        key={arc.data.key}
                        data-segment-key={arc.data.key}
                        data-segment-index={i}
                        data-active={isHover || undefined}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        style={{
                          transform: lift,
                          transition: prefersReducedMotion ? undefined : HOVER_TRANSITION,
                          cursor: 'pointer',
                        }}
                      >
                        {/* Hard ink-shadow drop — signature paper-press */}
                        <path
                          d={path}
                          fill="var(--text-on-candy, #1C1B26)"
                          fillOpacity={0.85}
                          transform={`translate(${SHADOW_OFFSET_PX} ${SHADOW_OFFSET_PX})`}
                        />
                        {/* Coloured slice on top */}
                        <path d={path} fill={arc.data.color} />
                      </g>
                    );
                  })}
                </>
              )}
            </Pie>
          </Group>
        </svg>

        {/* Centre lockup */}
        {center ? (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ paddingInline: 16 }}
          >
            {center}
          </div>
        ) : null}
      </div>

      {/* Legend — sibling, not overlay (DonutChartV2 pattern). */}
      <ul
        className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
        style={{
          fontSize: 11,
          color: 'var(--text-on-candy, var(--color-text-secondary, #1C1B26))',
          fontFamily: "var(--font-family-body, 'Manrope', system-ui, sans-serif)",
        }}
      >
        {segments.map((s, i) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 3,
                background: s.color,
                outline:
                  i === hoverIndex ? '1.5px solid var(--text-on-candy, currentColor)' : undefined,
                outlineOffset: i === hoverIndex ? 2 : undefined,
                boxShadow: '1.5px 1.5px 0 0 var(--text-on-candy, #1C1B26)',
              }}
            />
            <span className="font-medium">{s.label}</span>
          </li>
        ))}
      </ul>

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

/* Helper to make the unused-arc-datum-type assertion explicit for callers
   who export this for storybook/tests later. */
export type DonutVisxArc = PieArcDatum<ResolvedSegment>;

/* ────────────────────────────────────────────────────────────────────── */
/* Subcomponent — centre label                                             */
/* ────────────────────────────────────────────────────────────────────── */

interface DonutCenterLabelProps {
  text: string;
  /** Manrope eyebrow under the chunky numeral. Pass empty string to suppress. */
  eyebrow: string;
}

function DonutCenterLabel({ text, eyebrow }: DonutCenterLabelProps) {
  // Strip a trailing word like "$226K total" → headline "$226K". The chunky
  // numeral always reads as the first whitespace-delimited token.
  const trimmed = text.trim();
  const firstSpace = trimmed.indexOf(' ');
  const headline = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
  return (
    <>
      <span style={CENTER_HEADLINE_STYLE}>{headline}</span>
      {eyebrow ? <span style={CENTER_EYEBROW_STYLE}>{eyebrow}</span> : null}
    </>
  );
}
