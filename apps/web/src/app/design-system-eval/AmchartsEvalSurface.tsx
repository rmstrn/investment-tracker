'use client';

/**
 * Client-side amCharts 5 surface — three sample charts.
 *
 * amCharts mounts directly into a DOM node, owns its lifecycle, and renders
 * to canvas (via SVG). We mount on `useEffect` and dispose on unmount; this
 * is the canonical pattern from the amCharts React quick-start.
 *
 * Provedo theming approach:
 *   - Series colors: read `--chart-series-N` from `getComputedStyle(document
 *     .documentElement)` at mount time. amCharts theming API needs concrete
 *     `am5.color('#hex')` values, NOT CSS-vars (it parses to `Color` objects
 *     internally and does not retain CSS custom property linkage).
 *   - Typography: pass Geist via amCharts `Label.font` settings; we pull
 *     `var(--font-sans)` and `var(--font-mono)` from computed style.
 *   - Background / surface: amCharts root is transparent by default; the
 *     wrapping ChartCard div carries the Provedo neumorphic shadow.
 *
 * Watermark: with no commercial license configured, amCharts paints its
 * branding link («Created using amCharts 5») in the corner. That is the
 * licensing trade-off the evaluation has to verify.
 */

import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useEffect, useRef } from 'react';

const SAMPLE_PIE_DATA = [
  { sector: 'Tech', share: 41 },
  { sector: 'Financials', share: 24 },
  { sector: 'Energy', share: 17 },
  { sector: 'Healthcare', share: 10 },
  { sector: 'Other', share: 8 },
];

const SAMPLE_DONUT_DATA = [
  { kind: 'Stocks', value: 142000 },
  { kind: 'ETF', value: 34000 },
  { kind: 'Crypto', value: 32000 },
  { kind: 'Cash', value: 18390 },
];

function buildLineSeries(): { date: number; value: number }[] {
  const start = new Date(2026, 2, 28).getTime();
  return Array.from({ length: 30 }, (_, i) => ({
    date: start + i * 86_400_000,
    value: 220_000 + Math.sin(i / 3) * 4_500 + i * 950,
  }));
}

interface ProvedoTokens {
  series: string[];
  textPrimary: string;
  textSecondary: string;
  card: string;
  fontSans: string;
  fontMono: string;
}

function readProvedoTokens(): ProvedoTokens {
  const cs = getComputedStyle(document.documentElement);
  const series = Array.from({ length: 7 }, (_, i) =>
    (cs.getPropertyValue(`--chart-series-${i + 1}`).trim() || '#999999').replace(/^"(.*)"$/, '$1'),
  );
  return {
    series,
    textPrimary: cs.getPropertyValue('--text-primary').trim() || '#1a1a1a',
    textSecondary: cs.getPropertyValue('--text-secondary').trim() || '#666666',
    card: cs.getPropertyValue('--card').trim() || '#ffffff',
    fontSans: cs.getPropertyValue('--font-sans').trim() || 'Geist, sans-serif',
    fontMono: cs.getPropertyValue('--font-mono').trim() || 'Geist Mono, monospace',
  };
}

/* ─── Semi-circle pie ─────────────────────────────────────────────────────── */

function mountSemiCirclePie(rootEl: HTMLDivElement, tokens: ProvedoTokens): am5.Root {
  const root = am5.Root.new(rootEl);

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      startAngle: 180,
      endAngle: 360,
      layout: root.verticalLayout,
      innerRadius: am5.percent(50),
    }),
  );

  const series = chart.series.push(
    am5percent.PieSeries.new(root, {
      startAngle: 180,
      endAngle: 360,
      valueField: 'share',
      categoryField: 'sector',
      alignLabels: false,
    }),
  );

  series.states.create('hidden', { startAngle: 180, endAngle: 180 });
  series.slices.template.setAll({
    cornerRadius: 6,
    strokeWidth: 2,
    stroke: am5.color(tokens.card),
  });

  series.set(
    'colors',
    am5.ColorSet.new(root, {
      colors: tokens.series.map((hex) => am5.color(hex)),
    }),
  );

  series.labels.template.setAll({
    fontFamily: tokens.fontMono,
    fontSize: 10,
    fill: am5.color(tokens.textSecondary),
    text: '{category}',
  });
  series.ticks.template.setAll({ stroke: am5.color(tokens.textSecondary), strokeOpacity: 0.4 });

  series.data.setAll(SAMPLE_PIE_DATA);
  series.appear(900, 100);

  return root;
}

/* ─── Donut ───────────────────────────────────────────────────────────────── */

function mountDonut(rootEl: HTMLDivElement, tokens: ProvedoTokens): am5.Root {
  const root = am5.Root.new(rootEl);

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(60),
    }),
  );

  const series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'kind',
      alignLabels: false,
    }),
  );

  series.slices.template.setAll({
    cornerRadius: 4,
    strokeWidth: 2,
    stroke: am5.color(tokens.card),
  });

  series.set(
    'colors',
    am5.ColorSet.new(root, {
      colors: tokens.series.map((hex) => am5.color(hex)),
    }),
  );

  series.labels.template.setAll({
    fontFamily: tokens.fontMono,
    fontSize: 10,
    fill: am5.color(tokens.textSecondary),
    text: '{category}',
  });

  series.data.setAll(SAMPLE_DONUT_DATA);
  series.appear(900, 100);

  return root;
}

/* ─── Line ────────────────────────────────────────────────────────────────── */

function mountLine(rootEl: HTMLDivElement, tokens: ProvedoTokens): am5.Root {
  const root = am5.Root.new(rootEl);

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'none',
      wheelY: 'none',
      paddingLeft: 0,
    }),
  );

  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: 'day', count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 60,
        stroke: am5.color(tokens.textSecondary),
        strokeOpacity: 0.18,
      }),
    }),
  );
  xAxis.get('renderer').labels.template.setAll({
    fontFamily: tokens.fontMono,
    fontSize: 10,
    fill: am5.color(tokens.textSecondary),
  });

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        stroke: am5.color(tokens.textSecondary),
        strokeOpacity: 0.18,
      }),
    }),
  );
  yAxis.get('renderer').labels.template.setAll({
    fontFamily: tokens.fontMono,
    fontSize: 10,
    fill: am5.color(tokens.textSecondary),
  });

  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      xAxis,
      yAxis,
      valueXField: 'date',
      valueYField: 'value',
      stroke: am5.color(tokens.series[0] ?? '#2D5F4E'),
      fill: am5.color(tokens.series[0] ?? '#2D5F4E'),
    }),
  );
  series.strokes.template.setAll({ strokeWidth: 1.75, lineCap: 'round', lineJoin: 'round' });
  series.fills.template.setAll({ visible: false });

  series.data.setAll(buildLineSeries());
  series.appear(900);
  chart.appear(900, 100);

  return root;
}

/* ─── React harness ──────────────────────────────────────────────────────── */

function useAmchart(mountFn: (el: HTMLDivElement, tokens: ProvedoTokens) => am5.Root) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tokens = readProvedoTokens();
    const root = mountFn(ref.current, tokens);
    return () => {
      root.dispose();
    };
  }, [mountFn]);

  return ref;
}

function ChartFrame({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <article
      style={{
        background: 'var(--card)',
        borderRadius: '22px',
        padding: '20px 22px 16px',
        boxShadow:
          'var(--shadow-chart-card, 5px 5px 14px rgba(140, 100, 55, 0.16), -3px -3px 10px rgba(255, 250, 240, 0.62), inset 1px 1px 0 rgba(255, 255, 255, 0.55), inset 0 -1px 0 rgba(20, 20, 20, 0.04))',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: 'var(--text-secondary)',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </p>
      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '6px 0 2px',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          margin: '0 0 14px',
        }}
      >
        {subtitle}
      </p>
      {children}
    </article>
  );
}

export function AmchartsEvalSurface() {
  const semiPieRef = useAmchart(mountSemiCirclePie);
  const donutRef = useAmchart(mountDonut);
  const lineRef = useAmchart(mountLine);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}
    >
      <ChartFrame
        eyebrow="amCharts · semi-circle pie"
        title="Allocation by sector"
        subtitle="Port of amcharts.com/demos/semi-circle-pie-chart"
      >
        <div ref={semiPieRef} style={{ width: '100%', height: '260px' }} />
      </ChartFrame>

      <ChartFrame
        eyebrow="amCharts · donut"
        title="Allocation by asset class"
        subtitle="$226K total · jade-bronze-ink palette"
      >
        <div ref={donutRef} style={{ width: '100%', height: '260px' }} />
      </ChartFrame>

      <ChartFrame
        eyebrow="amCharts · line"
        title="Portfolio value"
        subtitle="Last 30 days · all brokers"
      >
        <div ref={lineRef} style={{ width: '100%', height: '260px' }} />
      </ChartFrame>
    </div>
  );
}
