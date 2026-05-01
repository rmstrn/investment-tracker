'use client';

/**
 * §Charts-visx — visx-candy POC showcase (2026-05-01).
 *
 * Renders Donut + Bar via `@visx/*` primitives inside a `[data-surface="candy"]`
 * cascade so the candy register's tokens drive every colour, font, and shadow.
 * Sits directly after the existing `<ChartsSection />` so PO can scroll-compare
 * visx-candy (this) against V2-styled-with-v2-tokens (above).
 *
 * Decision after PO review: either migrate the chart layer to visx (with the
 * candy aesthetic baked in) and retire the V2 primitives, or stay on V2 and
 * shelve visx. Either way these visx components are NOT in the runtime
 * dispatcher — they are imported directly from `@investment-tracker/ui/charts`
 * named exports.
 */

import { PaintDrip } from '@investment-tracker/ui';
import {
  BAR_DRIFT_FIXTURE,
  BarVisx,
  ChartCard,
  DONUT_FIXTURE,
  DonutVisx,
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
    <DsSection title="Charts — visx · candy POC" meta="2 CHARTS · @visx/shape · candy register">
      <DsRow label="POC — DONUT + BAR · CANDY-PINK FIELD">
        <div data-surface="candy" style={CANDY_FIELD_STYLE}>
          <div style={GRID_STYLE}>
            <ChartCard
              eyebrow="VISX · CANDY POC"
              title="Allocation by sector"
              subtitle="5 sectors · $226K total · visx <Pie>"
            >
              <div className="flex justify-center">
                <DonutVisx payload={DONUT_FIXTURE} size={240} />
              </div>
            </ChartCard>
            <ChartCard
              eyebrow="VISX · CANDY POC"
              title="Position drift"
              subtitle="Top 5 vs ±2pp rebalance band · visx scaleBand"
            >
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={360} height={220} />
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
