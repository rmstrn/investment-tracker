'use client';

/**
 * §Charts — DSM-V1 chart subsystem showcase.
 *
 * Migrated from `apps/web/src/app/design/_sections/charts.tsx` (commit
 * `2ffb1f9`). All chart-bearing cards now consume the canonical
 * `<ChartCard>` shared in `@investment-tracker/ui/charts` (extracted by
 * this slice). State demonstrators (loading / empty / error) show how
 * each surface degrades gracefully.
 *
 * Scope:
 * - 9 MVP chart kinds (Candlestick gated until legal sign-off; Scatter
 *   excluded by architect ADR Δ3).
 * - T1 charts mount eagerly. T2 (StackedBar / Waterfall) lazy via
 *   `<Suspense>` against the kind-specific skeleton.
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
  ChartCard,
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
import { Section, SubBlock } from '../_components/Section';

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
    <Section
      id="charts"
      eyebrow="§ Charts"
      title="9 MVP chart kinds"
      description="Live React mounts from @investment-tracker/ui/charts against canonical fixtures (CHARTS_SPEC §5.3). T1 eager · T2 lazy via Suspense · Candlestick gated awaiting legal sign-off · Scatter excluded (architect ADR Δ3). All cards use the canonical ChartCard surface."
    >
      <SubBlock title="Line · portfolio value" meta="T1">
        <ChartCard>
          <LineChart payload={LINE_FIXTURE} height={260} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Area · cumulative cash flow" meta="T1">
        <ChartCard>
          <AreaChart payload={AREA_FIXTURE} height={220} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Bar · monthly P&L with sign coloring" meta="T1">
        <ChartCard>
          <BarChart payload={BAR_FIXTURE} height={220} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Bar · drift sub-variant with FINRA caption" meta="T1">
        <ChartCard>
          <BarChart payload={BAR_DRIFT_FIXTURE} height={200} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Donut · sector allocation" meta="T1">
        <ChartCard>
          <DonutChart payload={DONUT_FIXTURE} size={240} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Sparkline · 7-day trend" meta="T1">
        <ChartCard>
          <div className="flex flex-wrap items-center gap-6">
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
            <div className="flex-1" style={{ minWidth: 200 }}>
              <Sparkline payload={SPARKLINE_FIXTURE} height={64} />
            </div>
          </div>
        </ChartCard>
      </SubBlock>

      <SubBlock title="Calendar · April 2026 dividends + corp actions" meta="T1">
        <ChartCard>
          <Calendar payload={CALENDAR_FIXTURE} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Treemap · concentration with FINRA caption" meta="T1">
        <ChartCard>
          <Treemap payload={TREEMAP_FIXTURE} height={360} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="StackedBar · broker contribution" meta="T2 · lazy">
        <ChartCard>
          <Suspense fallback={<ChartSkeleton kind="stacked-bar" />}>
            <LazyStackedBar payload={STACKED_BAR_FIXTURE} height={240} />
          </Suspense>
        </ChartCard>
      </SubBlock>

      <SubBlock title="Waterfall · YTD cash-flow" meta="T2 · lazy">
        <ChartCard>
          <Suspense fallback={<ChartSkeleton kind="waterfall" />}>
            <LazyWaterfall payload={WATERFALL_FIXTURE} height={320} />
          </Suspense>
        </ChartCard>
      </SubBlock>

      <div className="space-y-2 pt-4">
        <h3 className="font-semibold tracking-tight text-text-primary" style={{ fontSize: '18px' }}>
          State demonstrators
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.55 }}>
          Loading skeleton, empty, and error surfaces for the three a11y-priority components.
          Skeletons use kind-specific geometries per CHARTS_SPEC §3.10.
        </p>
      </div>

      <SubBlock title="Loading skeleton — Line" meta="T1">
        <ChartCard>
          <ChartSkeleton kind="line" />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Empty state — Line" meta="T1">
        <ChartCard>
          <ChartEmpty kind="line" hint={EMPTY_LINE.meta.emptyHint} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Empty state — Donut" meta="T1">
        <ChartCard>
          <ChartEmpty kind="donut" hint="No allocation data yet — connect a broker." />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Empty state — Calendar" meta="T1">
        <ChartCard>
          <ChartEmpty kind="calendar" hint={EMPTY_CALENDAR.meta.emptyHint} />
        </ChartCard>
      </SubBlock>

      <SubBlock title="Error state — Line (?debug=1 reveals payload)" meta="T1">
        <ChartCard>
          <ChartError
            payload={LINE_FIXTURE}
            headline="Could not load portfolio chart"
            body="The chart payload failed validation. Add ?debug=1 to the URL to inspect the raw JSON."
          />
        </ChartCard>
      </SubBlock>
    </Section>
  );
}
