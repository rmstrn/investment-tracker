'use client';

/**
 * Charts showcase section — rebuilt for SLICE-CHARTS-FE-V1.
 *
 * Demonstrates the 10 MVP chart components live, fed from typed payloads
 * sourced from CHARTS_SPEC §5.3. T2/T3 components mount behind <Suspense>
 * so the showcase route stays tree-shake-friendly. Candlestick demo block
 * is intentionally OMITTED per scope (T3 awaits PO greenlight + legal-
 * advisor sign-off). Scatter is V2-deferred (architect ADR Δ3) and absent
 * from MVP; no showcase block.
 *
 * State demonstrators (empty / error / loading) wired for Line + Donut +
 * Calendar — the three a11y-priority components per blueprint Phase 7.
 */

import {
  AREA_FIXTURE,
  AreaChart,
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  BarChart,
  CALENDAR_FIXTURE,
  Calendar,
  type CalendarPayload,
  ChartEmpty,
  ChartError,
  ChartSkeleton,
  DONUT_FIXTURE,
  DonutChart,
  LINE_FIXTURE,
  LineChart,
  type LineChartPayload,
  SPARKLINE_FIXTURE,
  STACKED_BAR_FIXTURE,
  Sparkline,
  TREEMAP_FIXTURE,
  Treemap,
  WATERFALL_FIXTURE,
} from '@investment-tracker/ui/charts';
import { LazyStackedBar, LazyWaterfall } from '@investment-tracker/ui/charts/lazy';
import { Suspense } from 'react';

const EMPTY_LINE: LineChartPayload = {
  ...LINE_FIXTURE,
  data: [],
  meta: {
    ...LINE_FIXTURE.meta,
    emptyHint: 'No price history is available for this period.',
  },
};

const EMPTY_CALENDAR: CalendarPayload = {
  ...CALENDAR_FIXTURE,
  events: [],
  meta: {
    ...CALENDAR_FIXTURE.meta,
    emptyHint: 'No dividend or corporate-action events for this month.',
  },
};

export function ChartsSection() {
  return (
    <section id="charts" className="space-y-12 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Charts</h2>
        <p className="text-sm text-text-secondary">
          10 MVP chart components rendered from typed payloads. T1 (eager) · T2 (lazy, behind{' '}
          <code className="font-mono text-xs">Suspense</code>) · T3 designed but not demoed (awaits
          legal sign-off). Theme switches via{' '}
          <code className="font-mono text-xs">data-theme="dark"</code> on{' '}
          <code className="font-mono text-xs">&lt;html&gt;</code>.
        </p>
      </div>

      <Sub title="Line · portfolio value (T1)" tier="T1">
        <Card>
          <LineChart payload={LINE_FIXTURE} height={260} />
        </Card>
      </Sub>

      <Sub title="Area · cumulative cash flow (T1)" tier="T1">
        <Card>
          <AreaChart payload={AREA_FIXTURE} height={220} />
        </Card>
      </Sub>

      <Sub title="Bar · monthly P&L with sign coloring (T1)" tier="T1">
        <Card>
          <BarChart payload={BAR_FIXTURE} height={220} />
        </Card>
      </Sub>

      <Sub title="Bar · drift sub-variant with mandatory caption (T1)" tier="T1">
        <Card>
          <BarChart payload={BAR_DRIFT_FIXTURE} height={200} />
        </Card>
      </Sub>

      <Sub title="Donut · sector allocation (T1)" tier="T1">
        <Card>
          <DonutChart payload={DONUT_FIXTURE} size={240} />
        </Card>
      </Sub>

      <Sub title="Sparkline · 7-day trend (T1)" tier="T1">
        <Card>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-tertiary">Total portfolio</p>
              <p
                className="font-bold tabular-nums tracking-tighter"
                style={{ fontSize: 'var(--text-display-md)' }}
              >
                $226,390
              </p>
              <p className="text-sm text-portfolio-gain-default tabular-nums">+$7,890 · +3.6%</p>
            </div>
            <div className="flex-1">
              <Sparkline payload={SPARKLINE_FIXTURE} height={64} />
            </div>
          </div>
        </Card>
      </Sub>

      <Sub title="Calendar · April 2026 dividends + corp actions (T1)" tier="T1">
        <Card>
          <Calendar payload={CALENDAR_FIXTURE} />
        </Card>
      </Sub>

      <Sub title="Treemap · concentration with FINRA caption (T1)" tier="T1">
        <Card>
          <Treemap payload={TREEMAP_FIXTURE} height={360} />
        </Card>
      </Sub>

      <Sub title="StackedBar · broker contribution (T2 · lazy)" tier="T2">
        <Card>
          <Suspense fallback={<ChartSkeleton kind="stacked-bar" />}>
            <LazyStackedBar payload={STACKED_BAR_FIXTURE} height={240} />
          </Suspense>
        </Card>
      </Sub>

      <Sub title="Waterfall · YTD cash-flow (T2 · lazy)" tier="T2">
        <Card>
          <Suspense fallback={<ChartSkeleton kind="waterfall" />}>
            <LazyWaterfall payload={WATERFALL_FIXTURE} height={320} />
          </Suspense>
        </Card>
      </Sub>

      <div className="space-y-1 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">State demonstrations</h3>
        <p className="text-sm text-text-secondary">
          Loading skeleton, empty, and error surfaces for the three a11y-priority components.
        </p>
      </div>

      <Sub title="Loading skeleton — Line" tier="T1">
        <Card>
          <ChartSkeleton kind="line" />
        </Card>
      </Sub>

      <Sub title="Empty state — Line" tier="T1">
        <Card>
          <ChartEmpty kind="line" hint={EMPTY_LINE.meta.emptyHint} />
        </Card>
      </Sub>

      <Sub title="Empty state — Donut" tier="T1">
        <Card>
          <ChartEmpty kind="donut" hint="No allocation data yet — connect a broker." />
        </Card>
      </Sub>

      <Sub title="Empty state — Calendar" tier="T1">
        <Card>
          <ChartEmpty kind="calendar" hint={EMPTY_CALENDAR.meta.emptyHint} />
        </Card>
      </Sub>

      <Sub title="Error state — Line (with ?debug=1 payload reveal)" tier="T1">
        <Card>
          <ChartError
            payload={LINE_FIXTURE}
            headline="Could not load portfolio chart"
            body="The chart payload failed validation. Add ?debug=1 to the URL to inspect the raw JSON."
          />
        </Card>
      </Sub>
    </section>
  );
}

function Sub({
  title,
  tier,
  children,
}: {
  title: string;
  tier: 'T1' | 'T2' | 'T3';
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">
          {title}
        </h3>
        <span
          className="rounded-full border border-border-subtle px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary"
          aria-label={`Tier ${tier}`}
        >
          {tier}
        </span>
      </div>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-background-elevated p-5">
      {children}
    </div>
  );
}
