import { ArrowUpRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Cards — KPI cards (SURFACE #2 of three Fraunces moments).
 *
 * Standard card uses `--d3-surface-2` fill + `--d3-elev-2` shadow + 1px
 * hairline (the Mercury signal — every elevated surface gets BOTH).
 * Hover: translateY(-1px) + elev-2→elev-3 swap, 320ms cubic-bezier
 * (0.16, 1, 0.3, 1). NO brightness, NO scale.
 *
 * Accent variant: chartreuse-cream fill, canvas-ink text. AAA 12.4:1.
 * ONE accent KPI per dashboard by rule — the loudest surface stays still
 * (no shadow upgrade on hover).
 */

interface KpiSeed {
  readonly icon: typeof Wallet;
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly direction: 'up' | 'down' | 'flat';
  readonly accent?: boolean;
}

const KPI_SEEDS: readonly KpiSeed[] = [
  {
    icon: Wallet,
    label: 'Total exposure',
    value: '$ 248,310',
    delta: '+ 1.84 % · +$ 4,486 · 30D',
    direction: 'up',
  },
  {
    icon: TrendingUp,
    label: 'Unrealised P&L',
    value: '+ 18.42 %',
    delta: '+ 3.21 % · +$ 7,920 · 30D',
    direction: 'up',
    accent: true,
  },
  {
    icon: TrendingDown,
    label: 'USD cash sleeve',
    value: '8.30 %',
    delta: '− 1.20 pp vs ceiling · 5%',
    direction: 'down',
  },
];

export function CardsSection() {
  return (
    <SectionShell
      id="cards"
      title="Cards"
      meta="KPI · ELEV-2 → ELEV-3 ON HOVER"
      description="Three-card KPI row. The accent fill carries the editorial moment — exactly one accent card per dashboard, by rule. Hover lifts standard cards 1px and swaps shadow tier; the accent card holds still (it's already loud enough)."
    >
      <DsRow label="Standard + accent KPI row (hover any card)">
        <div className="ds-kpi-row">
          {KPI_SEEDS.map((kpi) => {
            const Icon = kpi.icon;
            const className = kpi.accent ? 'ds-kpi ds-kpi--accent' : 'ds-kpi';
            const deltaClass = kpi.accent
              ? 'ds-kpi__delta'
              : kpi.direction === 'up'
                ? 'ds-kpi__delta ds-kpi__delta--up'
                : kpi.direction === 'down'
                  ? 'ds-kpi__delta ds-kpi__delta--down'
                  : 'ds-kpi__delta';
            return (
              <article key={kpi.label} className={className}>
                <header className="ds-kpi__head">
                  <span className="ds-kpi__icon-chip">
                    <Icon size={16} aria-hidden strokeWidth={1.75} />
                  </span>
                  <p className="ds-kpi__label">{kpi.label}</p>
                  <ArrowUpRight size={16} aria-hidden strokeWidth={1.75} />
                </header>
                <p className="ds-kpi__num">{kpi.value}</p>
                <p className={deltaClass}>{kpi.delta}</p>
              </article>
            );
          })}
        </div>
      </DsRow>

      <DsRow label="Card hover discipline — V2 redesign rule">
        <p className="ds-prose">
          Standard cards: <strong>translateY(-1px)</strong> + <strong>elev-2 → elev-3</strong>{' '}
          shadow swap, 320ms cubic-bezier (0.16, 1, 0.3, 1). No brightness change. No scale. No
          background shift. The motion is the Mercury press, not the candy bounce.
        </p>
        <p className="ds-prose">
          Accent card: lifts the same 1px but holds elev-2 — the chartreuse fill is already the
          loudest surface on the page; upgrading its shadow on hover would feel anxious.
        </p>
      </DsRow>
    </SectionShell>
  );
}
