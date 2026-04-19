'use client';

import { AreaChart, BarChart, DonutChart } from '@investment-tracker/ui/charts';

const SPARK: ReadonlyArray<{ x: string; y: number }> = Array.from({ length: 30 }, (_, i) => ({
  x: `D${i + 1}`,
  y: 100000 + Math.sin(i / 3) * 4000 + i * 900,
}));

const ALLOCATION = [
  { key: 'stocks', label: 'Stocks', value: 60 },
  { key: 'crypto', label: 'Crypto', value: 25 },
  { key: 'etf', label: 'ETF', value: 10 },
  { key: 'cash', label: 'Cash', value: 5 },
];

const MONTHLY: ReadonlyArray<{ x: string; y: number }> = [
  { x: 'Jan', y: 1200 },
  { x: 'Feb', y: -450 },
  { x: 'Mar', y: 2100 },
  { x: 'Apr', y: 980 },
  { x: 'May', y: -230 },
  { x: 'Jun', y: 1640 },
];

const USD = (n: number) =>
  `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export function ChartsSection() {
  return (
    <section id="charts" className="space-y-10 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Charts</h2>
        <p className="text-sm text-text-secondary">
          Styled Recharts wrappers. Tokens flip automatically with dark mode. Import:{' '}
          <code className="font-mono text-xs">@investment-tracker/ui/charts</code>
        </p>
      </div>

      <Sub title="AreaChart — dashboard hero sparkline (brief §6.5)">
        <div className="rounded-lg border border-border-subtle bg-background-elevated p-5">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wide text-text-tertiary">
              Total portfolio
            </div>
            <div
              className="font-bold tabular-nums tracking-tighter"
              style={{ fontSize: 'var(--text-display-md)' }}
            >
              $127,450.32
            </div>
            <div className="text-sm text-portfolio-gain-default tabular-nums">+$1,204 · +0.95%</div>
          </div>
          <AreaChart data={SPARK} height={120} formatValue={USD} />
        </div>
      </Sub>

      <Sub title="AreaChart — with axes (detail view)">
        <div className="rounded-lg border border-border-subtle bg-background-elevated p-5">
          <AreaChart
            data={SPARK}
            height={260}
            showXAxis
            showYAxis
            formatValue={USD}
            formatTick={(v) => String(v).replace('D', '')}
          />
        </div>
      </Sub>

      <Sub title="DonutChart — allocation (brief §6.5)">
        <div className="flex items-center gap-8 rounded-lg border border-border-subtle bg-background-elevated p-5">
          <DonutChart
            data={ALLOCATION}
            size={220}
            formatValue={(n) => `${n}%`}
            centerLabel={
              <div>
                <div className="text-xs uppercase tracking-wide text-text-tertiary">
                  Allocation
                </div>
                <div className="font-mono text-xl font-bold tabular-nums">4 classes</div>
              </div>
            }
          />
          <ul className="space-y-2">
            {ALLOCATION.map((a) => (
              <li key={a.key} className="flex items-center gap-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
                <span className="text-text-primary">{a.label}</span>
                <span className="ml-auto font-mono tabular-nums text-text-tertiary">
                  {a.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Sub>

      <Sub title="BarChart — monthly P&L (colorBySign)">
        <div className="rounded-lg border border-border-subtle bg-background-elevated p-5">
          <BarChart data={MONTHLY} height={220} formatValue={USD} colorBySign />
        </div>
      </Sub>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">{title}</h3>
      {children}
    </div>
  );
}
