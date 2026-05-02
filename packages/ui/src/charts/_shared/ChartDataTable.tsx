/**
 * Visually-hidden screen-reader transcript for chart data.
 *
 * Renders a `<table>` summary of `payload` data so assistive tech reads the
 * underlying numbers, satisfying CHARTS_SPEC §7.4 (a11y data-equivalent).
 * The table is placed off-screen via Tailwind `sr-only` utility but remains
 * focusable + readable.
 *
 * Per architect ADR §«Component composition strategy», this is one of two
 * cross-kind primitives owned by `_shared/`. It branches on `payload.kind`
 * so each shape gets a sensible row/column projection.
 *
 * Captions live inside the `<table>` as native `<caption>` (per a11y Pattern
 * 2 — LOW-1 closure, was previously a sibling `<p>` per pre-QA finding). For
 * non-tabular projections (sparkline summary), the caption is rendered above
 * the prose summary as a paragraph since there's no table to host it.
 */

import type {
  AreaChartPayload,
  BarChartPayload,
  CalendarPayload,
  CandlestickChartPayload,
  ChartPayload,
  DonutChartPayload,
  LineChartPayload,
  SparklinePayload,
  StackedBarChartPayload,
  TreemapPayload,
  WaterfallPayload,
} from '@investment-tracker/shared-types/charts';

interface ChartDataTableProps {
  /** Source payload — branches on `kind`. */
  payload: ChartPayload;
  /** Stable ID — caller passes `useId()` and references via `aria-describedby`. */
  id: string;
}

export function ChartDataTable({ payload, id }: ChartDataTableProps) {
  return (
    <div id={id} className="sr-only" data-testid={`chart-data-table-${payload.kind}`}>
      {renderTable(payload, tableCaption(payload))}
    </div>
  );
}

function tableCaption(p: ChartPayload): string {
  return `${p.meta.title}${p.meta.subtitle ? ` — ${p.meta.subtitle}` : ''}`;
}

function renderTable(p: ChartPayload, caption: string): React.ReactElement {
  switch (p.kind) {
    case 'line':
    case 'area':
    case 'stacked-bar':
      return renderMultiSeriesTable(p, caption);
    case 'bar':
      return renderBarTable(p, caption);
    case 'donut':
      return renderDonutTable(p, caption);
    case 'sparkline':
      return renderSparklineTable(p, caption);
    case 'calendar':
      return renderCalendarTable(p, caption);
    case 'treemap':
      return renderTreemapTable(p, caption);
    case 'waterfall':
      return renderWaterfallTable(p, caption);
    case 'candlestick':
      return renderCandlestickTable(p, caption);
    default: {
      const exhaustive: never = p;
      return <span>{String(exhaustive)}</span>;
    }
  }
}

function renderMultiSeriesTable(
  p: LineChartPayload | AreaChartPayload | StackedBarChartPayload,
  caption: string,
): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{p.xAxis.label ?? 'X'}</th>
          {p.series.map((s) => (
            <th scope="col" key={s.key}>
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {p.data.map((row, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: positional row identity matches chart x-ordering.
          <tr key={`row-${i}`}>
            <th scope="row">{String(row.x)}</th>
            {p.series.map((s) => {
              const v = row[s.key];
              return <td key={s.key}>{typeof v === 'number' ? v : ''}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderBarTable(p: BarChartPayload, caption: string): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{p.xAxis.label ?? 'Category'}</th>
          <th scope="col">{p.yAxis.label ?? 'Value'}</th>
        </tr>
      </thead>
      <tbody>
        {p.data.map((d) => (
          <tr key={d.x}>
            <th scope="row">{d.x}</th>
            <td>{d.y}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderDonutTable(p: DonutChartPayload, caption: string): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Segment</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {p.segments.map((s) => (
          <tr key={s.key}>
            <th scope="row">{s.label}</th>
            <td>{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderSparklineTable(p: SparklinePayload, caption: string): React.ReactElement {
  const first = p.data[0];
  const last = p.data[p.data.length - 1];
  // Sparkline summary is prose, not tabular — caption is rendered as a
  // paragraph above the prose summary so the SR still gets context.
  return (
    <>
      <p>{caption}</p>
      <p>
        Sparkline trend{p.trend ? ` (${p.trend})` : ''}: {p.data.length} points; first{' '}
        {String(first?.x ?? '')}={first?.y ?? ''}; last {String(last?.x ?? '')}={last?.y ?? ''}.
      </p>
    </>
  );
}

function renderCalendarTable(p: CalendarPayload, caption: string): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Type</th>
          <th scope="col">Ticker</th>
          <th scope="col">Date</th>
          <th scope="col">Detail</th>
        </tr>
      </thead>
      <tbody>
        {p.events.map((e) => {
          if (e.eventType === 'dividend') {
            return (
              <tr key={e.id}>
                <th scope="row">Dividend ({e.status})</th>
                <td>{e.ticker}</td>
                <td>{e.payDate}</td>
                <td>
                  {e.expectedAmount} {e.currency}
                </td>
              </tr>
            );
          }
          return (
            <tr key={e.id}>
              <th scope="row">Corp action ({e.actionType})</th>
              <td>{e.ticker}</td>
              <td>{e.effectiveDate}</td>
              <td>{e.description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function renderTreemapTable(p: TreemapPayload, caption: string): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Ticker</th>
          <th scope="col">Weight %</th>
          <th scope="col">Value</th>
          <th scope="col">Daily change %</th>
        </tr>
      </thead>
      <tbody>
        {p.tiles.map((t) => (
          <tr key={t.key}>
            <th scope="row">{t.ticker}</th>
            <td>{t.weightPct}</td>
            <td>{t.valueAbs}</td>
            <td>{t.dailyChangePct ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderWaterfallTable(p: WaterfallPayload, caption: string): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Step</th>
          <th scope="col">Component</th>
          <th scope="col">Delta</th>
        </tr>
      </thead>
      <tbody>
        {p.steps.map((s) => (
          <tr key={s.key}>
            <th scope="row">{s.label}</th>
            <td>{s.componentType}</td>
            <td>{s.deltaAbs}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderCandlestickTable(p: CandlestickChartPayload, caption: string): React.ReactElement {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Open</th>
          <th scope="col">High</th>
          <th scope="col">Low</th>
          <th scope="col">Close</th>
        </tr>
      </thead>
      <tbody>
        {p.data.map((c, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: sorted positional series.
          <tr key={`candle-${i}`}>
            <th scope="row">{String(c.x)}</th>
            <td>{c.open}</td>
            <td>{c.high}</td>
            <td>{c.low}</td>
            <td>{c.close}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
