'use client';

/**
 * Calendar — pure CSS-grid renderer (CHARTS_SPEC §4.9).
 *
 * Not a Recharts chart. Uses a 7-column grid for month / week views and a
 * stacked list for `view: 'list'`. Event-type palette per CHARTS_SPEC §2.6;
 * Risk Flag 3 is enforced by the schema (`CalendarEventType` is restricted
 * to `dividend` + `corp_action`); the renderer just paints what survived
 * parse.
 *
 * `corp_action` events use a diamond marker via `clip-path: polygon(...)`
 * with an `@supports` border-radius fallback for older browsers.
 */

import type {
  CalendarEvent,
  CalendarPayload,
  CorpActionEvent,
  DividendEvent,
} from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { formatValue } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { CHART_TOKENS } from './tokens';

export interface CalendarProps {
  payload: CalendarPayload;
  className?: string;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarCell {
  date: Date;
  iso: string;
  inMonth: boolean;
  events: CalendarEvent[];
}

function eventDate(e: CalendarEvent): string {
  return e.eventType === 'dividend' ? e.payDate : e.effectiveDate;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function buildMonthGrid(periodStart: string, events: CalendarEvent[]): CalendarCell[] {
  const start = new Date(periodStart);
  if (Number.isNaN(start.getTime())) return [];

  const firstOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  // ISO week: Monday = 0
  const offset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - offset);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const isoDate = eventDate(e).slice(0, 10);
    const list = eventsByDate.get(isoDate) ?? [];
    list.push(e);
    eventsByDate.set(isoDate, list);
  }

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    cells.push({
      date: d,
      iso,
      inMonth: d.getMonth() === firstOfMonth.getMonth(),
      events: eventsByDate.get(iso) ?? [],
    });
  }
  return cells;
}

function dividendStatusColor(status: DividendEvent['status']): string {
  switch (status) {
    case 'received':
      return CHART_TOKENS.calendarReceived;
    case 'scheduled':
      return CHART_TOKENS.calendarScheduled;
    case 'announced':
      return CHART_TOKENS.calendarAnnounced;
  }
}

/**
 * Compact dollar / corp-action pill displayed inline on a date cell.
 *
 * PO feedback (2026-04-29): «события в день — непонятный символ» — the prior
 * renderer painted 8px circles + diamonds which carried no information at
 * a glance. New treatment mirrors the static design-system.html reference:
 * dividend events show ticker + dollar amount («KO $48»), corp actions show
 * ticker + ratio («GOOGL 2:1») as a diamond-clipped pill. Status flips the
 * background:
 *   - received   → forest-jade fill, cream ink
 *   - scheduled  → mid-jade fill, cream ink
 *   - announced  → outline only (border + transparent fill)
 *   - corp_action → terra fill, cream ink, diamond clip
 *
 * `title` carries the verbose info for hover tooltip; visible label stays
 * compact so multiple events fit a single date cell.
 */
function compactCurrency(amount: number): string {
  if (Math.abs(amount) >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${Math.round(amount)}`;
}

function EventPill({ event }: { event: CalendarEvent }) {
  if (event.eventType === 'corp_action') {
    const action = event as CorpActionEvent;
    const ratio =
      action.actionType === 'split' && action.ratio
        ? action.ratio
        : action.actionType.replace(/_/g, ' ');
    return (
      <span
        title={`${action.ticker}: ${action.description}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: CHART_TOKENS.calendarCorpAction,
          color: '#F4F1EA',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
          padding: '4px 12px',
          // Diamond clip mirrors static reference; preserves theming under
          // currentColor for status pills next to it.
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          borderRadius: 1,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        {action.ticker} {ratio}
      </span>
    );
  }
  const dividend = event as DividendEvent;
  const status = dividend.status;
  const isAnnounced = status === 'announced';
  const color = dividendStatusColor(status);
  return (
    <span
      title={`${dividend.ticker}: ${formatValue(dividend.expectedAmount, 'currency', dividend.currency)} (${status})`}
      style={{
        display: 'inline-block',
        background: isAnnounced ? 'transparent' : color,
        color: isAnnounced ? color : '#F4F1EA',
        border: isAnnounced ? `1px solid ${color}` : 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.1,
        padding: '3px 6px',
        borderRadius: 4,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {dividend.ticker} {compactCurrency(dividend.expectedAmount)}
    </span>
  );
}

/**
 * Backwards-compat shim: list view still uses circle markers as a leading
 * status dot before the row text. Kept as a small helper so the list
 * renderer doesn't have to inline it.
 */
function EventMarker({ event }: { event: CalendarEvent }) {
  if (event.eventType === 'corp_action') {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          background: CHART_TOKENS.calendarCorpAction,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          borderRadius: 1,
        }}
      />
    );
  }
  const dividend = event as DividendEvent;
  const filled = dividend.status !== 'announced';
  const color = dividendStatusColor(dividend.status);
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: 999,
        background: filled ? color : 'transparent',
        border: filled ? 'none' : `1px solid ${color}`,
      }}
    />
  );
}

export function Calendar({ payload, className }: CalendarProps) {
  const dataTableId = useId();
  const cells = useMemo(
    () => buildMonthGrid(payload.periodStart, payload.events),
    [payload.periodStart, payload.events],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.events.length, onIndexChange);

  const isList = payload.view === 'list';

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-calendar"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      {isList ? (
        <ul className="space-y-2">
          {payload.events.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-md border border-border-subtle bg-background-elevated px-3 py-2 text-sm"
            >
              <EventMarker event={e} />
              <span className="font-mono text-xs text-text-tertiary">{eventDate(e)}</span>
              <span className="font-semibold text-text-primary">{e.ticker}</span>
              {e.eventType === 'dividend' ? (
                <span className="ml-auto font-mono tabular-nums text-text-secondary">
                  {formatValue(e.expectedAmount, 'currency', e.currency)}
                </span>
              ) : (
                <span className="ml-auto text-xs text-text-secondary">{e.description}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {/* Month header — totals visible at a glance, mirrors static ref. */}
          <div className="mb-3 flex items-baseline justify-between">
            <h4
              className="m-0 text-sm font-semibold tracking-tight"
              style={{ color: 'var(--ink, var(--color-text-primary))' }}
            >
              {new Date(payload.periodStart).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h4>
            <div
              className="flex gap-3 font-mono text-[11px]"
              style={{ color: 'var(--text-2, var(--color-text-secondary))' }}
            >
              {typeof payload.totalReceived === 'number' ? (
                <span>
                  Received{' '}
                  <strong
                    className="tabular-nums"
                    style={{ color: 'var(--ink, var(--color-text-primary))' }}
                  >
                    {formatValue(payload.totalReceived, 'currency', payload.currency)}
                  </strong>
                </span>
              ) : null}
              {typeof payload.totalScheduled === 'number' ? (
                <span>
                  Scheduled{' '}
                  <strong
                    className="tabular-nums"
                    style={{ color: 'var(--ink, var(--color-text-primary))' }}
                  >
                    {formatValue(payload.totalScheduled, 'currency', payload.currency)}
                  </strong>
                </span>
              ) : null}
            </div>
          </div>
          <div
            className="grid text-[10px] uppercase tracking-[0.18em] text-text-tertiary"
            style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}
          >
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="px-1 py-1 font-mono">
                {d}
              </div>
            ))}
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}
          >
            {cells.map((cell) => {
              // PO feedback (2026-04-29): «дни вне текущего месяца похожи с
              // днями текущего» — out-of-month days now lose the cell
              // background entirely + drop opacity to 0.4. In-month cells
              // keep the inset paper surface.
              const inMonthBg = cell.inMonth
                ? 'var(--inset, var(--color-background-tertiary))'
                : 'transparent';
              const inMonthBorder = cell.inMonth
                ? '1px solid var(--border-subtle, transparent)'
                : '1px solid transparent';
              return (
                <div
                  key={cell.iso}
                  className="flex min-h-[64px] flex-col gap-1 rounded-md p-1.5"
                  style={{
                    background: inMonthBg,
                    border: inMonthBorder,
                    opacity: cell.inMonth ? 1 : 0.4,
                  }}
                  data-date={cell.iso}
                >
                  <div
                    className="font-mono text-[11px] tabular-nums"
                    style={{ color: 'var(--text-2, var(--color-text-secondary))' }}
                  >
                    {cell.date.getDate()}
                  </div>
                  <div className="mt-1 flex flex-wrap items-start gap-1">
                    {cell.events.slice(0, 2).map((e) => (
                      <EventPill key={e.id} event={e} />
                    ))}
                    {cell.events.length > 2 ? (
                      <span
                        className="font-mono text-[9px]"
                        style={{ color: 'var(--text-3, var(--color-text-tertiary))' }}
                      >
                        +{cell.events.length - 2}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Inline legend — mirrors static reference; keeps the calendar
              self-contained when not embedded in a chart-card with one. */}
          <ul
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px]"
            style={{ color: 'var(--text-2, var(--color-text-secondary))' }}
          >
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: CHART_TOKENS.calendarReceived,
                }}
              />
              Received
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: CHART_TOKENS.calendarScheduled,
                }}
              />
              Scheduled
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: 'transparent',
                  border: `1px solid ${CHART_TOKENS.calendarAnnounced}`,
                }}
              />
              Announced
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                style={{
                  width: 9,
                  height: 9,
                  background: CHART_TOKENS.calendarCorpAction,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                }}
              />
              Corp action
            </li>
          </ul>
        </div>
      )}
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
