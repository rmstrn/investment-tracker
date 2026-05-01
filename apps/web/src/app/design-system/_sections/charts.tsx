'use client';

/**
 * §Charts — DSM-V2 chart subsystem showcase, visx-candy backend.
 *
 * Phase D consolidation (2026-05-01): this section now imports visx-candy
 * components directly and is the SINGLE canonical chart showcase under
 * the `#charts` anchor. The previous V1/V2 dispatcher wiring (Recharts +
 * custom-SVG primitives via `makeBackendDispatch`) has been replaced with
 * direct `*Visx` named exports from `@investment-tracker/ui/charts`.
 *
 * Visual contract per CHARTS_SPEC §3 (candy register):
 *   - Hard ink-shadow drop on cards/marks (no soft glow)
 *   - Hover-lift on interactive marks (donut arcs, bars, treemap tiles)
 *   - Bagel Fat One chunky hero numerals where size permits (waterfall pill)
 *   - Manrope mono-uppercase axis ticks
 *   - Paper-press tile pile for treemap
 *   - Embossed-groove bridges for waterfall
 *
 * The whole section is wrapped in `data-surface="candy"` so candy
 * semantic vars cascade. STATES row (empty/loading) reuses
 * `ChartEmpty` + `ChartSkeleton` in default surface for visual contrast
 * against the candy field above.
 *
 * Phase E will delete `BarChart.tsx` / `LineChart.tsx` / `DonutChart.tsx`
 * / `BarChartV2.tsx` / `DonutChartV2.tsx` / `SparklineV2.tsx` and the
 * `makeBackendDispatch` helper. After Phase D, this file no longer
 * imports any of those names — Phase E can delete cleanly.
 */

import { PaintDrip } from '@investment-tracker/ui';
import {
  AREA_FIXTURE,
  AreaVisx,
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  BarVisx,
  CALENDAR_FIXTURE,
  CalendarVisx,
  ChartCard,
  ChartEmpty,
  ChartSkeleton,
  DONUT_FIXTURE,
  DonutVisx,
  LINE_FIXTURE,
  type LineChartPayload,
  LineVisx,
  SPARKLINE_FIXTURE,
  STACKED_BAR_FIXTURE,
  SparklineVisx,
  StackedBarVisx,
  TREEMAP_FIXTURE,
  TreemapVisx,
  WATERFALL_FIXTURE,
  WaterfallVisx,
} from '@investment-tracker/ui/charts';
import type { CSSProperties } from 'react';
import { DsRow, DsSection } from '../_components/SectionHead';

const EMPTY_LINE: LineChartPayload = {
  ...LINE_FIXTURE,
  data: [],
  meta: {
    ...LINE_FIXTURE.meta,
    emptyHint: 'Connect a broker to see your portfolio history.',
  },
};

const CANDY_FIELD_STYLE: CSSProperties = {
  background: 'var(--bg-pink, var(--color-candy-pink, #F7A1C9))',
  color: 'var(--text-on-candy, var(--color-ink-v2-deep, #1C1B26))',
  padding: '32px 28px 24px',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
};

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  alignItems: 'stretch',
};

const WIDE_GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
  gap: '20px',
  alignItems: 'stretch',
  marginTop: '20px',
};

const FULL_GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
  alignItems: 'stretch',
  marginTop: '20px',
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
          ? '10 KINDS · @visx + d3-hierarchy · CANDY REGISTER'
          : '10 KINDS · DARK PALETTE'
      }
    >
      <DsRow label="TIER 1 — MUST-SHIP MVP">
        <div data-surface="candy" style={CANDY_FIELD_STYLE}>
          <div style={GRID_STYLE}>
            <ChartCard eyebrow="LINE" title="Portfolio value" subtitle="Last 30 days · all brokers">
              <LineVisx payload={LINE_FIXTURE} width={360} height={200} />
            </ChartCard>

            <ChartCard eyebrow="AREA" title="Cumulative P&L" subtitle="Year to date">
              <AreaVisx payload={AREA_FIXTURE} width={360} height={200} />
            </ChartCard>

            <ChartCard eyebrow="BAR" title="Position drift" subtitle="Top 6 vs rebalance band">
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={360} height={220} />
            </ChartCard>

            <ChartCard eyebrow="BAR · MONTHLY" title="Monthly P&L" subtitle="Sign-coloured bars">
              <BarVisx payload={BAR_FIXTURE} width={360} height={220} />
            </ChartCard>

            <ChartCard
              eyebrow="DONUT"
              title="Allocation by sector"
              subtitle="5 sectors · $226K total"
            >
              <div className="flex justify-center">
                <DonutVisx payload={DONUT_FIXTURE} size={240} />
              </div>
            </ChartCard>

            <ChartCard
              eyebrow="SPARKLINE"
              title="Inline trend"
              subtitle="Inside cards · table cells · chat replies"
            >
              <div style={{ paddingTop: 8 }}>
                <SparklineVisx payload={SPARKLINE_FIXTURE} width={280} height={64} />
              </div>
            </ChartCard>

            <ChartCard
              eyebrow="CALENDAR"
              title="Dividend calendar — April 2026"
              subtitle="3 received · 2 scheduled · 1 corp action"
            >
              <CalendarVisx payload={CALENDAR_FIXTURE} today={new Date('2026-04-15')} />
            </ChartCard>

            <ChartCard
              eyebrow="TREEMAP"
              title="Concentration"
              subtitle="Tile size = weight; color = today's change"
            >
              <TreemapVisx payload={TREEMAP_FIXTURE} width={360} height={280} />
            </ChartCard>
          </div>

          {/* Tier 2 — wider band so 3-broker stack reads well at 360px. */}
          <div style={WIDE_GRID_STYLE}>
            <ChartCard
              eyebrow="STACKED BAR · TIER 2"
              title="Broker contribution"
              subtitle="Last 6 months · 3 brokers · whole-stack ink-shadow"
            >
              <StackedBarVisx payload={STACKED_BAR_FIXTURE} width={360} height={220} />
            </ChartCard>
          </div>

          {/* Waterfall — full-width band. PD signature: ending-balance pill
              with Bagel Fat One chunky hero numeral. */}
          <div style={FULL_GRID_STYLE}>
            <ChartCard
              eyebrow="WATERFALL · TIER 2"
              title="Where your value came from"
              subtitle="YTD · 2026-01-01 to 2026-04-26 · embossed-groove bridges"
            >
              <WaterfallVisx payload={WATERFALL_FIXTURE} width={720} height={280} />
            </ChartCard>
          </div>

          <div style={{ marginTop: '24px' }}>
            <PaintDrip
              variant="thick"
              from="var(--bg-pink, #F7A1C9)"
              to="var(--bg-mustard, var(--color-candy-mustard, #F4CC4A))"
            />
          </div>
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
