'use client';

/**
 * §Charts — DSM-V1 chart subsystem showcase, stage-aware.
 *
 * Each stage variant renders the same chart matrix but inherits the parent
 * stage's `data-theme` scope so chart series flip palette without remount.
 *
 * Visual contract per CHARTS_SPEC §3 (custom Recharts theming via
 * `buildChartTheme.ts`):
 *   - Axis tick labels: Geist Mono · 10px · letter-spacing 0.08em · text-3
 *   - Gridlines: subtle dotted (2 4 dasharray, 0.10 alpha)
 *   - Tooltip: Geist · 12px · backdrop-blur · shadow-toast · mono eyebrow
 *   - Line stroke 1.75px · round caps + joins
 *   - Area gradient: 30% → 0% opacity
 *   - Bar radius 6px top corners
 *   - Donut stroke between segments: 2px var(--card)
 *
 * The new theming layer lives in `packages/ui/src/charts/_shared/buildChartTheme.ts`
 * and is consumed by individual chart components in a follow-up commit (Phase 4).
 * This section uses the existing chart components but with real Provedo product
 * titles and subtitles ported from the static reference.
 */

import {
  AREA_FIXTURE,
  AreaChart,
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  BarChart,
  CALENDAR_FIXTURE,
  Calendar,
  ChartCard,
  ChartEmpty,
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
import { DsRow, DsSection } from '../_components/SectionHead';

const EMPTY_LINE: LineChartPayload = {
  ...LINE_FIXTURE,
  data: [],
  meta: {
    ...LINE_FIXTURE.meta,
    emptyHint: 'Connect a broker to see your portfolio history.',
  },
};

export interface ChartsSectionProps {
  variant: 'light' | 'dark';
}

export function ChartsSection({ variant }: ChartsSectionProps) {
  return (
    <DsSection
      title="Charts"
      meta={
        variant === 'light'
          ? '11 TYPES · RECHARTS 3.8 + CSS-GRID CALENDAR'
          : '11 TYPES · DARK PALETTE'
      }
    >
      <DsRow label="TIER 1 — MUST-SHIP MVP">
        <div className="showcase-charts-grid">
          <ChartCard
            eyebrow="LINE · TIER 1"
            title="Portfolio value"
            subtitle="Last 30 days · all brokers"
          >
            <LineChart payload={LINE_FIXTURE} height={200} />
          </ChartCard>
          <ChartCard eyebrow="AREA · TIER 1" title="Cumulative P&L" subtitle="Year to date">
            <AreaChart payload={AREA_FIXTURE} height={200} />
          </ChartCard>
          <ChartCard
            eyebrow="BAR · TIER 1"
            title="Position drift"
            subtitle="Top 6 vs rebalance band"
          >
            <BarChart payload={BAR_DRIFT_FIXTURE} height={200} />
          </ChartCard>
          <ChartCard eyebrow="BAR · MONTHLY" title="Monthly P&L" subtitle="Sign-coloured bars">
            <BarChart payload={BAR_FIXTURE} height={200} />
          </ChartCard>
          <ChartCard eyebrow="DONUT · TIER 1" title="Allocation by sector" subtitle="5 sectors">
            <DonutChart
              payload={DONUT_FIXTURE}
              size={240}
              centerLabel={
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="font-semibold tabular-nums tracking-tight"
                    style={{
                      fontSize: '24px',
                      lineHeight: 1,
                      color: 'var(--ink, var(--color-text-primary))',
                    }}
                  >
                    $226K
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      color: 'var(--text-3, var(--color-text-tertiary))',
                      fontWeight: 500,
                    }}
                  >
                    Portfolio
                  </span>
                </div>
              }
            />
          </ChartCard>
          <ChartCard
            eyebrow="SPARKLINE · TIER 1"
            title="Inline trend"
            subtitle="Inside cards · table cells · chat replies"
          >
            <div style={{ paddingTop: 8 }}>
              <Sparkline payload={SPARKLINE_FIXTURE} height={64} />
            </div>
          </ChartCard>
          <ChartCard
            eyebrow="CALENDAR · TIER 1"
            title="Dividend calendar — April 2026"
            subtitle="3 received · 2 scheduled · 1 corp action"
          >
            <Calendar payload={CALENDAR_FIXTURE} />
          </ChartCard>
          <ChartCard
            eyebrow="TREEMAP · TIER 1"
            title="Concentration"
            subtitle="Tile size = weight; color = today's change"
          >
            <Treemap payload={TREEMAP_FIXTURE} height={280} />
          </ChartCard>
        </div>
      </DsRow>

      <DsRow label="TIER 2 — NEXT-WAVE">
        <div className="showcase-charts-grid">
          <ChartCard
            eyebrow="STACKED BAR · TIER 2"
            title="Broker contribution"
            subtitle="Last 6 months"
          >
            <Suspense fallback={<ChartSkeleton kind="stacked-bar" />}>
              <LazyStackedBar payload={STACKED_BAR_FIXTURE} height={220} />
            </Suspense>
          </ChartCard>
          <ChartCard
            eyebrow="WATERFALL · TIER 2"
            title="Where your value came from"
            subtitle="YTD · 2026-01-01 to 2026-04-26"
            className="showcase-chart-card--full"
          >
            <Suspense fallback={<ChartSkeleton kind="waterfall" />}>
              <LazyWaterfall payload={WATERFALL_FIXTURE} height={280} />
            </Suspense>
          </ChartCard>
        </div>
      </DsRow>

      <DsRow label="STATES — EMPTY / LOADING">
        <div className="showcase-charts-grid">
          <ChartCard eyebrow="LINE · EMPTY" title="Portfolio value" subtitle="Last 30 days">
            <ChartEmpty kind="line" hint={EMPTY_LINE.meta.emptyHint} />
          </ChartCard>
          <ChartCard eyebrow="DONUT · EMPTY" title="Allocation" subtitle="Across all accounts">
            <ChartEmpty kind="donut" hint="No allocations yet — connect a broker." />
          </ChartCard>
          <ChartCard eyebrow="LOADING · LINE" title="Portfolio value" subtitle="…">
            <ChartSkeleton kind="line" />
          </ChartCard>
          <ChartCard eyebrow="LOADING · BAR" title="Position drift" subtitle="…">
            <ChartSkeleton kind="bar" />
          </ChartCard>
        </div>
      </DsRow>
    </DsSection>
  );
}
