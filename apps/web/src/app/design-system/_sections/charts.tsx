import { ChartCard, ChartSkeleton } from '@investment-tracker/ui/charts';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';
import { RecordRail } from '../_components/RecordRail';

/**
 * §Charts — 9 placeholder shells, Phase 2 fills them.
 *
 * Per KICKOFF §2.5, Phase 1 ships chart cards in D1 chrome with
 * `<ChartSkeleton>` content. The chrome above each chart is a Record
 * Rail per fix #2 (PD spec §3) — chart panels are «rail-headed, not
 * title-headed». Phase 2 will swap each `<ChartSkeleton>` for a real
 * `*Visx` component restyled into the D1 dialect.
 */

interface ChartShellProps {
  rail: string;
  title: string;
  subtitle: string;
  kind:
    | 'bar'
    | 'sparkline'
    | 'line'
    | 'area'
    | 'donut'
    | 'calendar'
    | 'stacked-bar'
    | 'treemap'
    | 'waterfall';
}

const SHELLS: ReadonlyArray<ChartShellProps> = [
  { rail: 'POSITION DRIFT', title: 'BarVisx', subtitle: 'Top 6 vs rebalance band', kind: 'bar' },
  {
    rail: 'INLINE TREND',
    title: 'SparklineVisx',
    subtitle: 'Inside cards · table cells',
    kind: 'sparkline',
  },
  {
    rail: 'PORTFOLIO VALUE',
    title: 'LineVisx',
    subtitle: 'Last 30 days · all brokers',
    kind: 'line',
  },
  { rail: 'CUMULATIVE P&L', title: 'AreaVisx', subtitle: 'Year to date', kind: 'area' },
  {
    rail: 'ALLOCATION BY SECTOR',
    title: 'DonutVisx',
    subtitle: '5 sectors · $226K total',
    kind: 'donut',
  },
  {
    rail: 'DIVIDEND CALENDAR',
    title: 'CalendarVisx',
    subtitle: 'April 2026 · 6 weeks',
    kind: 'calendar',
  },
  {
    rail: 'BROKER CONTRIBUTION',
    title: 'StackedBarVisx',
    subtitle: 'Last 6 months · 3 brokers',
    kind: 'stacked-bar',
  },
  {
    rail: 'CONCENTRATION',
    title: 'TreemapVisx',
    subtitle: 'Tile size = weight · color = today’s change',
    kind: 'treemap',
  },
  {
    rail: 'WHERE VALUE CAME FROM',
    title: 'WaterfallVisx',
    subtitle: 'YTD · 2026-01-01 to 2026-04-30',
    kind: 'waterfall',
  },
];

export function ChartsSection() {
  return (
    <DsSection
      id="charts"
      eyebrow="13 · Charts"
      title="9 placeholder shells (Phase 2 fills)"
      lede="Chart panels in D1 are rail-headed, not title-headed. Phase 1 ships these placeholder shells under the D1 chart-card chrome; Phase 2 fills them with the visx components restyled into D1 dialect (hatched bars, lime saturation heatmaps, lime accents on neutral series, Geist Mono numerals)."
    >
      <DsRow label="9 CHART KINDS">
        <div className="ds-grid-2">
          {SHELLS.map((s) => (
            <div
              key={s.title}
              style={{
                background: 'var(--d1-bg-card)',
                borderRadius: 24,
                padding: 20,
                border: '1px solid var(--d1-border-hairline)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <RecordRail label={s.rail} />
              <ChartCard
                eyebrow={s.title}
                title={s.title}
                subtitle={s.subtitle}
                style={{
                  background: 'transparent',
                  boxShadow: 'none',
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <div style={{ minHeight: 180 }}>
                  <ChartSkeleton kind={s.kind} />
                </div>
              </ChartCard>
            </div>
          ))}
        </div>
      </DsRow>

      <DsCallout heading="Phase 2 will fill these with D1-dialect renders">
        Per KICKOFF §4.1: bars get the 8px-pitch hatched lime pattern; lines get text-primary 1.5px
        stroke with one lime «look here» line at 2px; the heatmap gets the 5-level lime saturation
        ramp; the donut gets the saturation-ordered palette + one optional purple highlight; the
        treemap gets the `--d1-accent-lime` / `--d1-accent-purple` magnitude bins. All numerals
        render Geist Mono with `tnum + ss01`.
      </DsCallout>
    </DsSection>
  );
}
