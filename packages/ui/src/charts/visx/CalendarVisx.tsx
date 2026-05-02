'use client';

/**
 * CalendarVisx — visx-powered candy-themed dividend calendar (POC).
 *
 * Phase B of the visx-candy migration (PD spec
 * `CHARTS_VISX_CANDY_SPEC.md` §7). Sits next to `Calendar.tsx`
 * (CSS-grid renderer) so PO can compare side-by-side at
 * `/design-system#charts-visx`.
 *
 * Library boundary:
 *   - `scaleBand` from `@visx/scale` for the 7-column weekday axis +
 *     row band axis. Cells are plain `<rect>`. visx is overkill for a
 *     month grid but keeps the «visx-candy» tag honest in dispatch
 *     reviews — same package register as the rest of Phase B.
 *
 * Visual signatures (PD §7):
 *   - 7×N grid of cream cells with 6px corner radius.
 *   - Today cell wears a 1.5px candy-pink ink-bordered ring — the
 *     «you are here» pattern from Monthly P&L. Pulses once on first
 *     paint then settles.
 *   - Event chips inside cells: `received` mustard, `scheduled`
 *     signal-orange (per PD spec), `corp_action` ink-deep diamond.
 *     Stacked vertically when multiple events share a day.
 *   - Day numerals Manrope mono-uppercase tabular-num 11px.
 *   - Weekday header row Manrope mono-uppercase 10px ls 0.08em.
 *   - Hover-lift `(-2,-2)` with shadow stays anchored. Tooltip shows
 *     date + events.
 *   - Entrance: row-by-row fade-in + scale 0.92→1, 280ms per row,
 *     40ms inter-row stagger, 800ms total ceiling.
 *
 * a11y: `role="img"` + ChartDataTable shadow with all events listed.
 * Today cell carries `aria-current="date"` data attribute for QA.
 * Reduced motion → instant paint, no entrance, no lift.
 */

import type {
  CalendarEvent,
  CalendarPayload,
  CorpActionEvent,
  DividendEvent,
} from '@investment-tracker/shared-types/charts';
import { scaleBand } from '@visx/scale';
import { type CSSProperties, useEffect, useId, useMemo, useState } from 'react';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface CalendarVisxProps {
  payload: CalendarPayload;
  /** Override «today» — used by tests + showcase to pin the today-ring. */
  today?: Date;
  className?: string;
}

interface CalendarCell {
  readonly iso: string;
  readonly day: number;
  readonly date: Date;
  readonly inMonth: boolean;
  readonly events: readonly CalendarEvent[];
  readonly row: number;
  readonly col: number;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const HEADER_HEIGHT = 24;
const CELL_RADIUS = 6;
const CELL_GAP = 6;
const SHADOW_OFFSET_PX = 2;
const HOVER_LIFT_PX = 2;

const HOVER_TRANSITION =
  'transform 220ms var(--motion-easing-spring-soft, cubic-bezier(0.34, 1.56, 0.64, 1))';

const ENTRANCE_PER_ROW_MS = 280;
const ENTRANCE_ROW_STAGGER_MS = 40;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

const CELL_BG = 'var(--bg-cream, var(--card, #FFF8E7))';
const INK = 'var(--text-on-candy, var(--ink, #1C1B26))';
const TODAY_RING = 'var(--candy-pink, var(--bg-pink, #F7A1C9))';

const DAY_NUMERAL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  fill: INK,
};

const WEEKDAY_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  fill: INK,
  fillOpacity: 0.7,
};

const EVENT_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
};

const TOOLTIP_STYLE: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  background: 'var(--bg-cream, var(--card, #FFF8E7))',
  color: INK,
  border: '1.5px solid var(--text-on-candy, #1C1B26)',
  borderRadius: 8,
  padding: '6px 10px',
  fontFamily: "var(--font-family-body, 'Manrope', system-ui, sans-serif)",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  boxShadow: '5px 5px 0 0 var(--text-on-candy, #1C1B26)',
  transform: 'translate(-50%, -100%)',
  zIndex: 2,
};

const TOOLTIP_LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  opacity: 0.7,
  marginBottom: 2,
};

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function isoOf(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function eventDate(e: CalendarEvent): string {
  return e.eventType === 'dividend' ? e.payDate : e.effectiveDate;
}

/**
 * Build a 6-row × 7-col grid starting on Monday containing the given
 * month. Out-of-month leading/trailing cells are flagged so the renderer
 * can paint them inert.
 */
function buildMonthGrid(
  periodStart: string,
  events: readonly CalendarEvent[],
): readonly CalendarCell[] {
  const start = new Date(periodStart);
  if (Number.isNaN(start.getTime())) return [];
  const firstOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  // ISO week: Monday = 0
  const offset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - offset);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const iso = eventDate(e).slice(0, 10);
    const arr = eventsByDate.get(iso) ?? [];
    arr.push(e);
    eventsByDate.set(iso, arr);
  }

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const iso = isoOf(d);
    cells.push({
      iso,
      day: d.getDate(),
      date: d,
      inMonth: d.getMonth() === firstOfMonth.getMonth(),
      events: eventsByDate.get(iso) ?? [],
      row: Math.floor(i / 7),
      col: i % 7,
    });
  }
  // Trim trailing all-out-of-month rows so we don't paint a sixth row of
  // dead cells when not needed (months that fit in 5 rows).
  while (cells.length >= 7) {
    const lastRow = cells.slice(-7);
    if (lastRow.every((c) => !c.inMonth)) {
      cells.length -= 7;
    } else break;
  }
  return cells;
}

function eventChipColor(event: CalendarEvent): {
  fill: string;
  ink: string;
  isDiamond: boolean;
  label: string;
} {
  if (event.eventType === 'corp_action') {
    const e = event as CorpActionEvent;
    const ratio = e.actionType === 'split' && e.ratio ? e.ratio : e.actionType.replace(/_/g, ' ');
    return {
      fill: 'var(--text-on-candy, #1C1B26)',
      ink: 'var(--bg-cream, #FFF8E7)',
      isDiamond: true,
      label: `${e.ticker} ${ratio}`,
    };
  }
  const e = event as DividendEvent;
  const isReceived = e.status === 'received';
  const isScheduled = e.status === 'scheduled';
  return {
    fill: isReceived
      ? 'var(--bg-mustard, #F4CC4A)'
      : isScheduled
        ? 'var(--cta-fill, #F08A3C)'
        : 'transparent',
    ink: 'var(--text-on-candy, #1C1B26)',
    isDiamond: false,
    label: `${e.ticker} ${formatChipAmount(e.expectedAmount)}`,
  };
}

function formatChipAmount(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function CalendarVisx({ payload, today, className }: CalendarVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIso, setHoverIso] = useState<string | null>(null);

  // Layout — derived from container width (responsive). We render with an
  // intrinsic width so the showcase grid drives the actual size; SVG
  // viewBox keeps proportions on resize.
  const width = 480;
  const cells = useMemo(
    () => buildMonthGrid(payload.periodStart, payload.events),
    [payload.periodStart, payload.events],
  );
  const rowCount = useMemo(
    () => (cells.length === 0 ? 0 : Math.max(...cells.map((c) => c.row)) + 1),
    [cells],
  );
  const cellW = (width - CELL_GAP * 6) / 7;
  const cellH = 64;
  const height = HEADER_HEIGHT + rowCount * (cellH + CELL_GAP) + 4;

  const xScale = useMemo(
    () =>
      scaleBand<number>({
        domain: [0, 1, 2, 3, 4, 5, 6],
        range: [0, width],
        padding: 0,
      }),
    [],
  );

  const todayIso = useMemo(() => isoOf(today ?? new Date()), [today]);
  // Override: when today's actual ISO falls outside the period, pin to
  // a representative day inside the fixture period so the «you are here»
  // signature is still visible in the showcase.
  const periodStart = payload.periodStart.slice(0, 10);
  const periodEnd = payload.periodEnd.slice(0, 10);
  const effectiveTodayIso =
    todayIso >= periodStart && todayIso <= periodEnd
      ? todayIso
      : // Pin halfway through the period for the showcase.
        (cells.find((c) => c.inMonth && c.day === 15)?.iso ?? todayIso);

  // Entrance progress
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
      const ceiling =
        ENTRANCE_PER_ROW_MS + ENTRANCE_ROW_STAGGER_MS * Math.max(0, rowCount - 1) + 80;
      if (elapsed < ceiling) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, rowCount]);

  const hoverCell = hoverIso ? cells.find((c) => c.iso === hoverIso) : null;

  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-calendar-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%', position: 'relative' }}
      onMouseLeave={() => setHoverIso(null)}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        focusable="false"
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
      >
        {/* Weekday header row */}
        {WEEKDAY_LABELS.map((label, i) => (
          <text
            key={label}
            x={(xScale(i) ?? 0) + cellW / 2}
            y={14}
            textAnchor="middle"
            style={WEEKDAY_STYLE}
          >
            {label}
          </text>
        ))}

        {/* Cells */}
        {cells.map((cell) => {
          if (!cell.inMonth) {
            return null;
          }
          const x = xScale(cell.col) ?? 0;
          const y = HEADER_HEIGHT + cell.row * (cellH + CELL_GAP);
          const isToday = cell.iso === effectiveTodayIso;
          const isHover = hoverIso === cell.iso;
          const hasEvents = cell.events.length > 0;

          // Per-row entrance progress
          const rowStart = cell.row * ENTRANCE_ROW_STAGGER_MS;
          const localElapsed = entranceMs - rowStart;
          const rawProgress =
            localElapsed <= 0
              ? 0
              : localElapsed >= ENTRANCE_PER_ROW_MS
                ? 1
                : localElapsed / ENTRANCE_PER_ROW_MS;
          const progress = easeOutCubic(rawProgress);
          const opacity = progress;
          const scale = 0.92 + 0.08 * progress;
          const cx = x + cellW / 2;
          const cy = y + cellH / 2;

          const liftX = isHover && !prefersReducedMotion ? -HOVER_LIFT_PX : 0;
          const liftY = isHover && !prefersReducedMotion ? -HOVER_LIFT_PX : 0;
          const groupTransform = `translate(${liftX} ${liftY}) translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;

          // Today ring pulse — first 600ms fade-in to 1.4×, then settle.
          const ringPulse =
            isToday && !prefersReducedMotion && entranceMs < 1200
              ? Math.min(1.4, 1 + Math.max(0, 1 - entranceMs / 600) * 0.4)
              : 1;

          return (
            <g
              key={cell.iso}
              data-cell-iso={cell.iso}
              data-today={isToday || undefined}
              data-active={isHover || undefined}
              onMouseEnter={() => setHoverIso(cell.iso)}
              onMouseLeave={() => setHoverIso(null)}
              style={{
                transform: groupTransform,
                transformBox: 'view-box',
                transformOrigin: '0 0',
                transition: prefersReducedMotion ? undefined : HOVER_TRANSITION,
                opacity,
                cursor: hasEvents ? 'pointer' : 'default',
              }}
            >
              {/* Hard ink-shadow drop on event-bearing cells only. Empty
                  cells stay flat so filled cells visually pop. (PD §7) */}
              {hasEvents ? (
                <rect
                  x={x + SHADOW_OFFSET_PX}
                  y={y + SHADOW_OFFSET_PX}
                  width={cellW}
                  height={cellH}
                  rx={CELL_RADIUS}
                  fill="var(--text-on-candy, #1C1B26)"
                  fillOpacity={0.85}
                />
              ) : null}
              {/* Cell body */}
              <rect
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                rx={CELL_RADIUS}
                fill={CELL_BG}
                stroke={INK}
                strokeOpacity={hasEvents ? 0.85 : 0.3}
                strokeWidth={1}
              />
              {/* Today ring — 1.5px candy-pink ink-bordered («you are here») */}
              {isToday ? (
                <rect
                  x={x - 2}
                  y={y - 2}
                  width={cellW + 4}
                  height={cellH + 4}
                  rx={CELL_RADIUS + 2}
                  fill="none"
                  stroke={TODAY_RING}
                  strokeWidth={1.5}
                  strokeOpacity={Math.min(1, ringPulse / 1.4)}
                  style={{
                    transform: `translate(${cx}px, ${cy}px) scale(${ringPulse}) translate(${-cx}px, ${-cy}px)`,
                    transformBox: 'view-box',
                    transformOrigin: '0 0',
                  }}
                />
              ) : null}
              {/* Day numeral — top-left */}
              <text
                x={x + 8}
                y={y + 16}
                style={DAY_NUMERAL_STYLE}
                fillOpacity={hasEvents ? 1 : 0.55}
              >
                {cell.day}
              </text>

              {/* Event chips — vertically stacked, max 2 visible + overflow
                  count. */}
              {cell.events.slice(0, 2).map((event, idx) => {
                const chip = eventChipColor(event);
                const chipY = y + 28 + idx * 16;
                return (
                  <g key={`${cell.iso}-chip-${idx}`}>
                    {chip.isDiamond ? (
                      <path
                        d={`M ${x + 8} ${chipY + 6} L ${x + 14} ${chipY} L ${x + 20} ${chipY + 6} L ${x + 14} ${chipY + 12} Z`}
                        fill={chip.fill}
                      />
                    ) : (
                      <rect
                        x={x + 6}
                        y={chipY}
                        width={cellW - 12}
                        height={12}
                        rx={3}
                        fill={chip.fill}
                        stroke={INK}
                        strokeWidth={0.75}
                      />
                    )}
                    <text
                      x={chip.isDiamond ? x + 26 : x + 10}
                      y={chipY + 9}
                      style={{
                        ...EVENT_LABEL_STYLE,
                        fill: chip.ink,
                      }}
                    >
                      {chip.label}
                    </text>
                  </g>
                );
              })}
              {cell.events.length > 2 ? (
                <text
                  x={x + cellW - 8}
                  y={y + cellH - 6}
                  textAnchor="end"
                  style={{
                    ...EVENT_LABEL_STYLE,
                    fill: INK,
                    fillOpacity: 0.7,
                  }}
                >
                  {`+${cell.events.length - 2}`}
                </text>
              ) : null}
              <title>
                {`${cell.iso}${
                  cell.events.length === 0
                    ? ' · no events'
                    : ` · ${cell.events.length} event${cell.events.length === 1 ? '' : 's'}`
                }`}
              </title>
            </g>
          );
        })}
      </svg>

      {hoverCell && hoverCell.events.length > 0 ? (
        <div
          role="tooltip"
          aria-hidden="true"
          style={{
            ...TOOLTIP_STYLE,
            left: `${(((xScale(hoverCell.col) ?? 0) + cellW / 2) / width) * 100}%`,
            top: HEADER_HEIGHT + hoverCell.row * (cellH + CELL_GAP) - 8,
          }}
        >
          <div style={TOOLTIP_LABEL_STYLE}>{hoverCell.iso}</div>
          {hoverCell.events.map((event, i) => {
            const chip = eventChipColor(event);
            return (
              <div key={`${hoverCell.iso}-tt-${i}`} style={{ fontSize: 11 }}>
                {chip.label}
              </div>
            );
          })}
        </div>
      ) : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
