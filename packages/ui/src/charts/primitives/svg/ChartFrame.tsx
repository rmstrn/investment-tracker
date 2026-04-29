'use client';

/**
 * ChartFrame — REQUIRED root primitive for every chart.
 *
 * Layer 2 / Phase α.2 of the custom SVG chart primitives. Per aggregate decision
 * #7 («A11y baseline: <ChartFrame> REQUIRED composition consolidating role=img
 * + aria-label + focus-ring + tabIndex + keyboard-nav + ChartDataTable +
 * aria-live») this primitive structurally closes pre-QA findings CRIT-1
 * (`outline:none` on every container), CRIT-2 (`useChartKeyboardNav` imported
 * zero times), and MED-5 (empty `aria-label` when `meta.title` is empty).
 *
 * Architecture: the failure mode for charts is now «cannot render an
 * inaccessible chart» — the consumer cannot ship a chart without this wrapper,
 * and the wrapper enforces the discipline (label derivation, focus ring,
 * keyboard nav, transcript, live region) that previously was per-chart advice.
 *
 * Per a11y-architect Direction 3 (Layered): defaults are opinionated and
 * named; escapes (`ariaLabel`, `keyboardNav`, `liveRegion`, `seriesEncoding`,
 * `testId`) are explicit named props that surface in code review.
 */

import type { ChartPayload } from '@investment-tracker/shared-types/charts';
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChartDataTable } from '../../_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from '../../_shared/a11y';
import { useChartKeyboardNav } from '../../_shared/useChartKeyboardNav';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

/** Series differentiation policy. Per a11y Pattern 5 (color-blind safety). */
export type SeriesEncoding =
  | 'single'
  | 'color-only-allowed'
  | 'color-plus-shape'
  | 'color-plus-pattern';

/** Live-region announcement policy. Per a11y Pattern 7 (status messages). */
export type LiveRegionMode = 'polite' | 'off';

/**
 * Keyboard-nav policy.
 *
 * - `false` — opt-out (Sparkline `standalone={false}`)
 * - `'custom'` — chart-kind owns traversal (e.g. Donut by sector, Calendar 2D)
 * - object — primitive owns the listener; consumer handles index changes
 */
export type KeyboardNav =
  | false
  | 'custom'
  | { dataLength: number; onIndexChange: (nextIndex: number) => void };

export interface ChartFrameProps {
  /** SVG canvas + chart-internal HTML overlays. */
  children: ReactNode;
  /** Pixel width of the chart canvas. */
  width: number;
  /** Pixel height of the chart canvas. */
  height: number;
  /**
   * Typed chart payload. ChartFrame derives `aria-label` from
   * `payload.meta.alt → meta.title → \`${kind} chart\`` and renders the
   * visually-hidden `<ChartDataTable>` transcript automatically.
   */
  payload: ChartPayload;
  /**
   * Explicit `aria-label` override. Empty / whitespace-only override falls
   * through to derivation (closes pre-QA MED-5).
   */
  ariaLabel?: string;
  /**
   * Keyboard navigation policy. Default — enabled with linear arrow nav over
   * payload-derived data length (best effort; opt-out via `false`).
   */
  keyboardNav?: KeyboardNav;
  /** Color-blind safety encoding. Default `color-only-allowed`. */
  seriesEncoding?: SeriesEncoding;
  /** Live-region mode. Default `polite`. */
  liveRegion?: LiveRegionMode;
  /** Test-id passed through to outer wrapper for QA selectors. */
  testId?: string;
  /** Optional className passthrough on the focusable inner role=img element. */
  className?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Aria-label derivation                                                   */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Derive `aria-label` per a11y Pattern 1.
 *
 * Precedence:
 *   1. explicit override (whitespace-trimmed; empty falls through)
 *   2. payload.meta.alt (whitespace-trimmed)
 *   3. payload.meta.title (whitespace-trimmed)
 *   4. synthetic `${kind} chart` last-resort
 *
 * Empty strings are treated as missing — an empty `aria-label` would cause AT
 * to read «graphic» with no context.
 */
function deriveAriaLabel(payload: ChartPayload, override: string | undefined): string {
  const trimmedOverride = override?.trim();
  if (trimmedOverride) return trimmedOverride;

  const trimmedAlt = payload.meta.alt?.trim();
  if (trimmedAlt) return trimmedAlt;

  const trimmedTitle = payload.meta.title?.trim();
  if (trimmedTitle) return trimmedTitle;

  return `${payload.kind} chart`;
}

/**
 * Derive a one-line live-region summary per a11y Pattern 7.
 *
 * Computed from `payload.kind + meta.title + dataLength`. Updates announce
 * politely so existing screen-reader context isn't interrupted.
 */
function deriveLiveSummary(payload: ChartPayload, dataLength: number): string {
  const title = payload.meta.title?.trim() || `${payload.kind} chart`;
  return `${title} updated: ${dataLength} ${dataLength === 1 ? 'point' : 'points'}.`;
}

/**
 * Best-effort data-length probe for keyboard nav default.
 *
 * Cartesian charts (line/area/bar/stacked-bar/sparkline/candlestick) expose
 * `payload.data`. Donut uses `segments`. Treemap uses `tiles`. Waterfall uses
 * `steps`. Calendar uses `events`. The probe returns 0 for unknown shapes so
 * `useChartKeyboardNav` no-ops gracefully.
 */
function deriveDataLength(payload: ChartPayload): number {
  switch (payload.kind) {
    case 'line':
    case 'area':
    case 'bar':
    case 'stacked-bar':
    case 'sparkline':
    case 'candlestick':
      return payload.data.length;
    case 'donut':
      return payload.segments.length;
    case 'treemap':
      return payload.tiles.length;
    case 'waterfall':
      return payload.steps.length;
    case 'calendar':
      return payload.events.length;
    default: {
      const exhaustive: never = payload;
      void exhaustive;
      return 0;
    }
  }
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Required composition: every chart sits inside `<ChartFrame>`. The frame
 * owns role=img, label derivation, focus ring, tabIndex, keyboard nav, the
 * visually-hidden transcript, and the live region. Charts pass SVG content
 * as children.
 */
export function ChartFrame({
  children,
  width,
  height,
  payload,
  ariaLabel,
  keyboardNav,
  seriesEncoding = 'color-only-allowed',
  liveRegion = 'polite',
  testId,
  className,
}: ChartFrameProps) {
  const dataTableId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // Internal active-index state — exposed implicitly through the keyboard nav
  // listener. Consumers wanting to react to index changes pass an explicit
  // `keyboardNav={{ dataLength, onIndexChange }}` object.
  const [internalIndex, setInternalIndex] = useState<number | null>(null);
  const handleInternalIndex = useCallback((next: number) => {
    setInternalIndex(next);
  }, []);

  const derivedDataLength = useMemo(() => deriveDataLength(payload), [payload]);
  const navConfig = useMemo<KeyboardNav>(() => {
    if (keyboardNav === false || keyboardNav === 'custom') return keyboardNav;
    if (keyboardNav) return keyboardNav;
    return { dataLength: derivedDataLength, onIndexChange: handleInternalIndex };
  }, [keyboardNav, derivedDataLength, handleInternalIndex]);

  // Hook MUST be called unconditionally (rules-of-hooks). Pass 0 / no-op when
  // disabled so the hook bails internally without registering listeners.
  const navDataLength =
    typeof navConfig === 'object' && navConfig !== null ? navConfig.dataLength : 0;
  const navOnChange =
    typeof navConfig === 'object' && navConfig !== null
      ? navConfig.onIndexChange
      : handleInternalIndex;
  useChartKeyboardNav(containerRef, navDataLength, navOnChange);

  const ariaLabelResolved = deriveAriaLabel(payload, ariaLabel);

  // Live-region summary recomputes on payload identity change. `aria-live` +
  // `aria-atomic` ensure the entire summary re-announces on update; «polite»
  // never interrupts existing speech.
  const liveSummary = useMemo(
    () => deriveLiveSummary(payload, derivedDataLength),
    [payload, derivedDataLength],
  );
  const [announceSummary, setAnnounceSummary] = useState(liveSummary);
  useEffect(() => {
    setAnnounceSummary(liveSummary);
  }, [liveSummary]);

  // Active-index attribute is exposed for downstream chart kinds that bind
  // visual state (active dot, tooltip, focus ring on datum) to keyboard
  // index without prop-drilling. Layer 3 wrappers read it via context if /
  // when needed; for now the data attribute is the contract.
  const isInteractiveNav = navConfig !== false && navConfig !== 'custom';

  return (
    <div
      role="contentinfo"
      data-testid={testId}
      data-chart-kind={payload.kind}
      data-series-encoding={seriesEncoding}
      style={{ width, position: 'relative' }}
    >
      <div
        ref={containerRef}
        role="img"
        aria-label={ariaLabelResolved}
        aria-describedby={dataTableId}
        tabIndex={isInteractiveNav ? 0 : -1}
        data-active-index={internalIndex ?? undefined}
        className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
        style={{ width, height, position: 'relative' }}
      >
        {children}
      </div>
      <ChartDataTable payload={payload} id={dataTableId} />
      {liveRegion !== 'off' ? (
        <div role="status" aria-live={liveRegion} aria-atomic="true" className="sr-only">
          {announceSummary}
        </div>
      ) : null}
    </div>
  );
}
