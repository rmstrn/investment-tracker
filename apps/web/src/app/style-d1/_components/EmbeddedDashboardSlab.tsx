import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { RecordRail } from './RecordRail';

/**
 * Provedo D1 «Lime Cabin» dashboard slab.
 *
 * Shared server component — single source of truth for the canonical
 * dashboard markup that drives BOTH:
 *
 *   1. `/style-d1` (variant="full")    — the canonical preview surface
 *   2. `/`           (variant="landing") — landing page §4 live embed
 *
 * Per architect ADR-4 Option A (D1_LANDING_ARCHITECTURE.md): a single
 * extracted component so design tweaks land on both surfaces with zero
 * drift, server-rendered for SEO crawlability, fits the < 60kb gz JS
 * budget on landing.
 *
 * Variants:
 *   - `full`    — KPI cluster + filter chips + 3-col data grid + LEDGER
 *                 rail above + DISCLOSURE rail below + welcome eyebrow.
 *                 Keeps every part of the canonical preview.
 *   - `landing` — KPI cluster + 3-col data grid only. Strips the welcome
 *                 eyebrow row («Welcome back / Roman / Premium chip»),
 *                 the filter chip toolbar, and the DISCLOSURE strip
 *                 (landing has its own Lane-A footer disclaimer). The
 *                 LEDGER rail above the KPI band is retained because
 *                 it carries the «on the record» signature.
 *
 * Note on the embedded BarVisx — server-rendered SVG. The BAR_DRIFT_
 * FIXTURE comes from `@investment-tracker/ui/charts`; per-panel CSS-var
 * overrides on `.d1-panel` re-bind the BarVisx default candy palette to
 * D1 lime-mono. No client JS introduced by the embed itself; only the
 * BarVisx renders interactive tooltips when hovered (already accounted
 * for in the package bundle, not landing-specific).
 *
 * AT navigation: every section heading lives inside the dashboard
 * markup. Landing variant does NOT pretend the embed is a separate
 * page — it is the live product slab on the marketing surface.
 */

interface IconChipProps {
  d: string;
  title: string;
}

function IconChip({ d, title }: IconChipProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
    >
      <title>{title}</title>
      <path d={d} />
    </svg>
  );
}

function NavIcon({ d, title }: IconChipProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
    >
      <title>{title}</title>
      <path d={d} />
    </svg>
  );
}

/**
 * Static hatched-stripe legend swatch — inline SVG `<defs>` `<pattern>`,
 * NOT CSS background-image. This carries the reference's defining
 * vocabulary into the panel even though the embedded BarVisx renders
 * its own candy-treatment bars beneath. The pattern is referenced by
 * `fill="url(#d1-hatch)"` so Safari iOS does not re-paint per frame.
 */
function HatchedSwatch() {
  return (
    <svg width={32} height={16} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="d1-hatch"
          patternUnits="userSpaceOnUse"
          width={8}
          height={8}
          patternTransform="rotate(45)"
        >
          <rect width={8} height={8} fill="#26272c" />
          <line x1={0} y1={0} x2={0} y2={8} stroke="#d6f26b" strokeOpacity={0.35} strokeWidth={3} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={32} height={16} rx={4} ry={4} fill="url(#d1-hatch)" />
    </svg>
  );
}

const FILTER_CHIPS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'All', active: true },
  { label: 'Holdings' },
  { label: 'Income' },
  { label: 'Drift' },
];

interface AiInsight {
  label: string;
  dateTime: string;
  body: string;
}

const DEFAULT_AI_INSIGHTS: ReadonlyArray<AiInsight> = [
  {
    label: 'MAY 01 · 09:14',
    dateTime: '2026-05-01T09:14:00Z',
    body: 'Your Q1 win was 71% FX tailwind, not stock-picking. EUR/USD did the heavy lifting.',
  },
  {
    label: 'APR 30',
    dateTime: '2026-04-30T16:20:00Z',
    body: 'MSFT crossed 12% of portfolio. Last drift observation was 8 weeks ago at 9%.',
  },
  {
    label: 'APR 28',
    dateTime: '2026-04-28T11:08:00Z',
    body: '$1,240 in dividends settled this week. 84% from 3 holdings.',
  },
  {
    label: 'APR 25',
    dateTime: '2026-04-25T14:32:00Z',
    body: 'Your IBKR cash sleeve grew $4,800 this month. Last deployed 6 weeks ago.',
  },
  {
    label: 'APR 22',
    dateTime: '2026-04-22T10:05:00Z',
    body: 'Energy sector now 18% of equity. Sector cap (per your own rule, set Mar 11) is 15%.',
  },
];

const HEATMAP_WEEKS: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 0, 1, 0, 1, 0, 0],
  [0, 1, 2, 1, 0, 0, 0],
  [0, 0, 2, 3, 2, 1, 0],
  [0, 1, 3, 4, 4, 2, 0],
  [0, 2, 4, 4, 3, 1, 0],
  [0, 1, 2, 2, 1, 0, 0],
];

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface KpiData {
  portfolioValue: string;
  portfolioDelta: string;
  dividendsYtd: string;
  dividendsDelta: string;
  driftPercent: string;
  driftLabel: string;
}

const DEFAULT_KPI: KpiData = {
  portfolioValue: '$847,290',
  portfolioDelta: '+12.4% MTD',
  dividendsYtd: '$3,200',
  dividendsDelta: '+8.1% vs prev YTD',
  driftPercent: '12.0%',
  driftLabel: 'vs your 9% cap, set Mar 11',
};

export interface EmbeddedDashboardSlabProps {
  /**
   * - `full`     — full canonical preview (welcome eyebrow + chips + disclosure)
   * - `landing`  — landing variant (KPI band + data grid only)
   */
  variant: 'full' | 'landing';
  /** Optional KPI data override; defaults to canonical sample fixture. */
  kpi?: KpiData;
  /** Optional AI insight feed override; defaults to 5-entry canonical fixture. */
  insights?: ReadonlyArray<AiInsight>;
}

/**
 * Renders the dashboard interior. Caller is responsible for surrounding
 * layout chrome (page padding, marketing hero strip, etc).
 *
 * Wrapper element: `<section className="d1-surface">` with an
 * accessible label. The caller's parent must apply EITHER
 * `data-style="d1"` (route /style-d1) OR `data-theme="lime-cabin"`
 * (any other surface) so the lime-cabin tokens resolve.
 */
export function EmbeddedDashboardSlab({
  variant,
  kpi = DEFAULT_KPI,
  insights = DEFAULT_AI_INSIGHTS,
}: EmbeddedDashboardSlabProps) {
  const isFull = variant === 'full';
  return (
    <section className="d1-surface" aria-label="Provedo dashboard preview">
      {isFull ? (
        <>
          <FullVariantNav />
          <RecordRail label="LEDGER" />
          <div className="d1-eyebrow-row">
            <p className="d1-eyebrow-row__lead">Welcome back</p>
            <h2 className="d1-eyebrow-row__name">Roman</h2>
            <span className="d1-chip-premium" aria-label="Premium plan">
              Premium
            </span>
          </div>
        </>
      ) : (
        <RecordRail label="LEDGER" />
      )}

      <KpiRow kpi={kpi} />

      {isFull ? <FilterChipRow /> : null}

      <DataGrid insights={insights} />

      {isFull ? (
        <div>
          <RecordRail label="DISCLOSURE" />
          <p className="d1-disclosure">Read-only. No advice. No trading.</p>
        </div>
      ) : null}
    </section>
  );
}

/* ── Sub-components ───────────────────────────────────────────────── */

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  active?: boolean;
  trailing?: '▾';
}> = [
  { label: 'Overview', active: true },
  { label: 'Insights', trailing: '▾' },
  { label: 'Drift' },
  { label: 'Tax' },
  { label: 'Reports' },
];

function FullVariantNav() {
  return (
    <nav className="d1-nav" aria-label="Workspace navigation">
      <span className="d1-nav__brand" aria-label="Provedo">
        P
      </span>
      <span className="d1-disclaimer-chip" aria-label="Read-only · No advice">
        <span className="d1-disclaimer-chip__icon" aria-hidden>
          <NavIcon
            d="M12 1a4 4 0 0 0-4 4v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V5a4 4 0 0 0-4-4z"
            title="Read-only"
          />
        </span>
        <span className="d1-disclaimer-chip__label">Read-only · No advice</span>
      </span>
      {NAV_ITEMS.map((item) => (
        <a
          key={item.label}
          href={`#${item.label.toLowerCase()}`}
          className={item.active ? 'd1-pill d1-pill--active' : 'd1-pill'}
          aria-current={item.active ? 'page' : undefined}
        >
          {item.active ? (
            <span className="d1-pill__icon" aria-hidden>
              <NavIcon d="M3 5h18v11H3zM8 21h8M12 16v5" title="Overview" />
            </span>
          ) : null}
          <span>{item.label}</span>
          {item.trailing ? <span aria-hidden>{item.trailing}</span> : null}
        </a>
      ))}
      <span className="d1-nav__spacer" aria-hidden />
      <button type="button" className="d1-nav__icon-pill" aria-label="Search">
        <NavIcon d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" title="Search" />
      </button>
      <button type="button" className="d1-nav__icon-pill" aria-label="Notifications">
        <NavIcon d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0" title="Bell" />
      </button>
      <span className="d1-nav__avatar" aria-label="Roman">
        R
      </span>
    </nav>
  );
}

function KpiRow({ kpi }: { kpi: KpiData }) {
  return (
    <div className="d1-kpi-row">
      <article className="d1-kpi d1-kpi--portfolio" aria-labelledby="kpi-portfolio-label">
        <div className="d1-kpi__head">
          <span className="d1-kpi__icon-chip" aria-hidden>
            <IconChip d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Portfolio" />
          </span>
          <p id="kpi-portfolio-label" className="d1-kpi__label">
            Portfolio value
          </p>
          <span className="d1-kpi__ext" aria-hidden>
            <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
          </span>
        </div>
        <p className="d1-kpi__num">{kpi.portfolioValue}</p>
        <p className="d1-kpi__delta">{kpi.portfolioDelta}</p>
      </article>

      <article className="d1-kpi" aria-labelledby="kpi-dividends-label">
        <div className="d1-kpi__head">
          <span className="d1-kpi__icon-chip" aria-hidden>
            <IconChip d="M12 1v22M5 8h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11" title="Dividends" />
          </span>
          <p id="kpi-dividends-label" className="d1-kpi__label">
            Dividends YTD
          </p>
          <span className="d1-kpi__ext" aria-hidden>
            <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
          </span>
        </div>
        <p className="d1-kpi__num">{kpi.dividendsYtd}</p>
        <p className="d1-kpi__delta">{kpi.dividendsDelta}</p>
      </article>

      <article className="d1-kpi d1-kpi--lime" aria-labelledby="kpi-drift-label">
        <div className="d1-kpi__head">
          <span className="d1-kpi__icon-chip" aria-hidden>
            <IconChip d="M3 3v18h18M7 13h3v5H7zM12 9h3v9h-3zM17 5h3v13h-3z" title="Drift" />
          </span>
          <p id="kpi-drift-label" className="d1-kpi__label">
            Drift · MSFT
          </p>
          <span className="d1-kpi__ext" aria-hidden>
            <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
          </span>
        </div>
        <p className="d1-kpi__num">{kpi.driftPercent}</p>
        <p className="d1-kpi__delta">{kpi.driftLabel}</p>
      </article>
    </div>
  );
}

function FilterChipRow() {
  return (
    <div className="d1-chips" role="toolbar" aria-label="View filters">
      {FILTER_CHIPS.map((chip) => (
        <button
          key={chip.label}
          type="button"
          className={chip.active ? 'd1-chip d1-chip--active' : 'd1-chip'}
          aria-pressed={chip.active}
        >
          {chip.label}
        </button>
      ))}
      <span className="d1-chips__spacer" aria-hidden />
      <button type="button" className="d1-chip d1-chip--icon" aria-label="Settings">
        <NavIcon
          d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
          title="Settings"
        />
      </button>
      <button type="button" className="d1-chip d1-chip--icon" aria-label="Date range">
        <NavIcon d="M3 5h18v16H3zM8 3v4M16 3v4M3 10h18" title="Calendar" />
      </button>
      <button type="button" className="d1-chip d1-chip--export">
        <NavIcon d="M12 3v12m-5-5 5 5 5-5M5 21h14" title="Export" />
        <span>Export</span>
      </button>
    </div>
  );
}

function DataGrid({ insights }: { insights: ReadonlyArray<AiInsight> }) {
  return (
    <div className="d1-grid">
      {/* Allocation drift (BarVisx + hatched legend) */}
      <article className="d1-panel" aria-labelledby="panel-drift-title">
        <header className="d1-panel__head">
          <RecordRail label="ALLOCATION DRIFT" />
          <div className="d1-segmented" role="tablist" aria-label="Time range">
            <button type="button" className="d1-segmented__btn" role="tab" aria-selected="false">
              Monthly
            </button>
            <button
              type="button"
              className="d1-segmented__btn d1-segmented__btn--active"
              role="tab"
              aria-selected="true"
            >
              Annually
            </button>
          </div>
        </header>
        <h3 id="panel-drift-title" className="sr-only">
          Allocation drift
        </h3>
        <div className="d1-panel__body">
          <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={220} />
          <div className="d1-hatch-legend" aria-label="Drift legend">
            <HatchedSwatch />
            <span className="d1-hatch-legend__label">Apr · drift</span>
            <span className="d1-hatch-legend__value">+12.8%</span>
          </div>
        </div>
      </article>

      {/* Dividend calendar heatmap */}
      <article className="d1-panel" aria-labelledby="panel-cal-title">
        <header className="d1-panel__head">
          <RecordRail label="DIVIDEND CALENDAR" />
          <div className="d1-segmented" role="tablist" aria-label="Cohort">
            <button
              type="button"
              className="d1-segmented__btn d1-segmented__btn--active"
              role="tab"
              aria-selected="true"
            >
              6 wks
            </button>
          </div>
        </header>
        <h3 id="panel-cal-title" className="sr-only">
          Dividend calendar
        </h3>
        <div className="d1-panel__body" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="d1-heatmap"
            role="img"
            aria-label="Dividend payments over the last 6 weeks, with peak intensity in week 4 mid-week"
          >
            <span aria-hidden />
            {WEEK_LABELS.map((d) => (
              <span key={d} className="d1-heatmap__collabel">
                {d.slice(0, 1)}
              </span>
            ))}
            {HEATMAP_WEEKS.map((week, wIdx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
              <RowFragment key={`w-${wIdx}`} weekIdx={wIdx} week={week} />
            ))}
          </div>
          <p className="d1-panel__caption" style={{ width: '100%', marginTop: 16 }}>
            <span>Peak: $1,240 · Apr 18</span>
            <span className="d1-num">6 wks</span>
          </p>
        </div>
      </article>

      {/* Provedo insights — Record Rail entries */}
      <article className="d1-panel" aria-labelledby="panel-ai-title">
        <header className="d1-panel__head">
          <RecordRail label="INSIGHTS" />
        </header>
        <h3 id="panel-ai-title" className="sr-only">
          Provedo insights
        </h3>
        <div className="d1-panel__body">
          <div
            className="d1-chat__search"
            aria-label="Filter insights (read-only — Provedo surfaces patterns weekly, not a chat composer)"
          >
            <span className="d1-chat__search-icon" aria-hidden>
              <NavIcon d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" title="Filter" />
            </span>
            <span className="d1-chat__search-text">Filter insights by holding, sector, date…</span>
          </div>
          <ol className="d1-insights" aria-label="AI insight feed">
            {insights.map((m) => (
              <li key={m.dateTime}>
                <article className="d1-insight">
                  <RecordRail label={m.label} mode="entry" dateTime={m.dateTime} />
                  <p className="d1-insight__body">{m.body}</p>
                </article>
              </li>
            ))}
          </ol>
          <p className="d1-panel__caption" style={{ marginTop: 'auto', paddingTop: 8 }}>
            <span>Provedo surfaces patterns weekly.</span>
            <span className="d1-num">5 / wk</span>
          </p>
        </div>
      </article>
    </div>
  );
}

function RowFragment({
  weekIdx,
  week,
}: {
  weekIdx: number;
  week: ReadonlyArray<number>;
}) {
  const labelDate = `wk ${weekIdx + 1}`;
  return (
    <>
      <span className="d1-heatmap__rowlabel">{labelDate}</span>
      {week.map((level, dayIdx) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
          key={`w${weekIdx}-d${dayIdx}`}
          className="d1-heatmap__cell"
          data-level={level}
          aria-label={`Week ${weekIdx + 1} ${WEEK_LABELS[dayIdx]} intensity ${level}`}
        />
      ))}
    </>
  );
}
