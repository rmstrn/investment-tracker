'use client';

/**
 * §Charts-visx — visx-candy POC showcase (2026-05-01).
 *
 * Phase A scope (2026-05-01): Donut + Bar (polished) + Line + Area +
 * Sparkline. All five charts share the locked candy-chart language —
 * hard ink-shadow drop, hover-lift on interactive marks, Bagel chunky
 * hero numerals, Manrope mono-uppercase axis ticks.
 *
 * Sits directly after the existing `<ChartsSection />` so PO can
 * scroll-compare visx-candy (this) against the V2 primitives backend
 * (above). These visx components are NOT in the runtime dispatcher —
 * they're imported directly from `@investment-tracker/ui/charts` named
 * exports for the showcase + future migration cutover.
 *
 * Layout: 2-column responsive grid at desktop, 1-column at mobile, via
 * `repeat(auto-fit, minmax(280px, 1fr))`. Card order — Line, Area,
 * Donut, Bar, Sparkline — surfaces the new charts up top so the PO sees
 * them first when this section paints.
 */

import { PaintDrip } from '@investment-tracker/ui';
import {
  AREA_FIXTURE,
  AreaVisx,
  BAR_DRIFT_FIXTURE,
  BarVisx,
  ChartCard,
  DONUT_FIXTURE,
  DonutVisx,
  LINE_FIXTURE,
  LineVisx,
  SPARKLINE_FIXTURE,
  SparklineVisx,
} from '@investment-tracker/ui/charts';
import type { CSSProperties } from 'react';
import { DsRow, DsSection } from '../_components/SectionHead';

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

export function ChartsVisxSection() {
  return (
    <DsSection title="Charts — visx · candy" meta="5 CHARTS · @visx/shape · candy register">
      <DsRow label="VISX · CANDY · LINE / AREA / DONUT / BAR / SPARKLINE">
        <div data-surface="candy" style={CANDY_FIELD_STYLE}>
          <div style={GRID_STYLE}>
            <ChartCard
              eyebrow="VISX · CANDY · LINE"
              title="Portfolio value"
              subtitle="Last 30 days · all brokers · monotonic-cubic"
            >
              <LineVisx payload={LINE_FIXTURE} width={360} height={200} />
            </ChartCard>

            <ChartCard
              eyebrow="VISX · CANDY · AREA"
              title="Cumulative P&L"
              subtitle="Year to date · gradient under monotone curve"
            >
              <AreaVisx payload={AREA_FIXTURE} width={360} height={200} />
            </ChartCard>

            <ChartCard
              eyebrow="VISX · CANDY · DONUT"
              title="Allocation by sector"
              subtitle="5 sectors · $226K total · arc-sweep entrance"
            >
              <div className="flex justify-center">
                <DonutVisx payload={DONUT_FIXTURE} size={240} />
              </div>
            </ChartCard>

            <ChartCard
              eyebrow="VISX · CANDY · BAR"
              title="Position drift"
              subtitle="Top 5 vs ±2pp rebalance band · hover for value"
            >
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={360} height={220} />
            </ChartCard>

            <ChartCard
              eyebrow="VISX · CANDY · SPARKLINE"
              title="Portfolio · 7d"
              subtitle="Inline micro-line · end-numeral only"
            >
              <SparklineVisx payload={SPARKLINE_FIXTURE} width={280} height={64} />
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
    </DsSection>
  );
}
