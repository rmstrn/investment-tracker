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
import { useId, useMemo } from 'react';
import { ChartDataTable } from './_shared/ChartDataTable';
import { formatValue } from './_shared/formatters';
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

function EventMarker({ event }: { event: CalendarEvent }) {
  if (event.eventType === 'corp_action') {
    return (
      <span
        aria-hidden="true"
        title={`Corp action: ${(event as CorpActionEvent).description}`}
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          background: CHART_TOKENS.calendarCorpAction,
          // Diamond via clip-path with border-radius @supports fallback.
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
      title={`${dividend.ticker}: ${dividend.expectedAmount} ${dividend.currency} (${dividend.status})`}
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

  const isList = payload.view === 'list';

  return (
    <div
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-calendar"
      className={className}
      style={{ width: '100%', outline: 'none' }}
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
            {cells.map((cell) => (
              <div
                key={cell.iso}
                className="min-h-[64px] rounded-md border border-border-subtle bg-background-elevated p-1.5"
                style={{ opacity: cell.inMonth ? 1 : 0.45 }}
                data-date={cell.iso}
              >
                <div className="font-mono text-[11px] text-text-tertiary">
                  {cell.date.getDate()}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {cell.events.slice(0, 3).map((e) => (
                    <EventMarker key={e.id} event={e} />
                  ))}
                  {cell.events.length > 3 ? (
                    <span className="font-mono text-[9px] text-text-tertiary">
                      +{cell.events.length - 3}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}
