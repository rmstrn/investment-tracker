import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-d1` — «Lime Cabin».
 *
 * Faithful translation of the pinterest reference per `D1-faithful.md`.
 * Deep charcoal canvas, lime as «look here», purple as «something is
 * happening», fully-rounded pill nav, chat-list as the AI's natural
 * home. The dashboard view IS the hero — the marketing strip on top is
 * the smallest readable scrap that lets PO compare this as a
 * mini-landing alongside the R-series routes.
 *
 * Hard rules wired:
 *   - Pill vocabulary EVERYWHERE (`border-radius: 9999px`) — nav 40px,
 *     filter chips 36px.
 *   - ONE KPI card highlighted lime at a time (drift alert per spec
 *     §7 — the «most-actionable metric» rule).
 *   - Bar chart bars use an inline SVG `<defs>` `<pattern>` reference
 *     for the hatched-stripe vocabulary (the reference's defining
 *     visual) — NOT CSS `background-image` (Safari iOS perf trap per
 *     KICKOFF §5 risk #6 + spec §9 risk #6). Embedded BarVisx renders
 *     its own candy-treated bars below the hatched legend swatch and
 *     borrows D1's lime/purple palette via CSS-var override scope.
 *   - Heatmap cells 28×28, radius 6px, gap 4px, lime saturation
 *     gradient (5 levels: 0 / 15% / 40% / 70% / 100%).
 *   - Chat-list AI rows 64px tall, 40px purple avatar with white «P»
 *     monogram (AI never gets a human face). Search input in panel
 *     header is a FILTER, NOT a reply input — empty-state copy
 *     clarifies «Provedo surfaces patterns weekly» (KICKOFF §5
 *     risk #2 + spec §9 risk #7).
 *   - Five sample AI messages from spec §6 — past-tense,
 *     source-attributed, no advisory language.
 *   - All money numerals rendered via `.d1-num` (Geist Mono tabular)
 *     in `--d1-text-primary` on dark cards / `--d1-text-ink` on the
 *     lime-highlighted KPI card (AAA 14.7:1 on lime, 17.8:1 on dark).
 *   - Lane-A regulatory disclosure 16px floor at the bottom.
 */

const HERO_EYEBROW = 'PROVEDO · POSITION';
const HERO_HEADLINE = 'Your portfolio, on the record. Lime where it matters.';
const HERO_SUB = 'Read-only across every broker. Dividends dated. Drift noted. Nothing prescribed.';
const HERO_CTA = 'See the dashboard';

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  active?: boolean;
  count?: number;
  trailing?: '▾';
}> = [
  { label: 'Overview', active: true },
  { label: 'Insights', trailing: '▾' },
  { label: 'Drift', count: 3 },
  { label: 'Tax' },
  { label: 'Reports' },
];

const FILTER_CHIPS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'All', active: true },
  { label: 'Holdings' },
  { label: 'Income' },
  { label: 'Drift' },
];

/** 5 AI messages per spec §6 — past-tense, source-attributed, no advice. */
const AI_MESSAGES: ReadonlyArray<{
  byline: string;
  time: string;
  body: string;
}> = [
  {
    byline: 'Provedo',
    time: '09:14',
    body: 'Your Q1 win was 71% FX tailwind, not stock-picking. EUR/USD did the heavy lifting.',
  },
  {
    byline: 'Provedo',
    time: 'Yesterday',
    body: 'MSFT crossed 12% of portfolio. Last drift alert was 8 weeks ago at 9%.',
  },
  {
    byline: 'Provedo',
    time: 'Apr 28',
    body: '$1,240 in dividends settled this week. 84% from 3 holdings.',
  },
  {
    byline: 'Provedo',
    time: 'Apr 25',
    body: 'Your IBKR cash sleeve grew $4,800 this month. Last deployed 6 weeks ago.',
  },
  {
    byline: 'Provedo',
    time: 'Apr 22',
    body: 'Energy sector now 18% of equity. Sector cap (per your own rule, set Mar 11) is 15%.',
  },
];

/** 6 weeks × 7 days dividend-calendar heatmap intensity (0–4). */
const HEATMAP_WEEKS: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 0, 1, 0, 1, 0, 0],
  [0, 1, 2, 1, 0, 0, 0],
  [0, 0, 2, 3, 2, 1, 0],
  [0, 1, 3, 4, 4, 2, 0],
  [0, 2, 4, 4, 3, 1, 0],
  [0, 1, 2, 2, 1, 0, 0],
];

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ────────────────────────────────────────────────────────────────────── */
/* Inline SVG primitives                                                   */
/* ────────────────────────────────────────────────────────────────────── */

function IconChip({ d, title }: { d: string; title: string }) {
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

function NavIcon({ d, title }: { d: string; title: string }) {
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

/* ────────────────────────────────────────────────────────────────────── */
/* Page                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export default function StyleD1Page() {
  return (
    <div className="d1-page">
      <div className="d1-shell">
        {/* ── Marketing strip (above the dashboard, ≤280px tall) ─────── */}
        <header className="d1-marketing" aria-labelledby="d1-hero-heading">
          <div>
            <p className="d1-eyebrow">{HERO_EYEBROW}</p>
            <h1 id="d1-hero-heading" className="d1-headline">
              {HERO_HEADLINE}
            </h1>
            <p className="d1-sub">{HERO_SUB}</p>
          </div>
          <div>
            <a href="#dashboard" className="d1-cta">
              <span>{HERO_CTA}</span>
              <span aria-hidden>↓</span>
            </a>
          </div>
        </header>

        {/* ── Dashboard surface (the hero) ───────────────────────────── */}
        <section id="dashboard" className="d1-surface" aria-label="Provedo dashboard preview">
          {/* ─── Pill nav (40px tall, fully rounded) ─────────────────── */}
          <nav className="d1-nav" aria-label="Workspace navigation">
            <span className="d1-nav__brand" aria-label="Provedo">
              P
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
                {item.count ? (
                  <span className="d1-pill__count" aria-label={`${item.count} alerts`}>
                    {item.count}
                  </span>
                ) : null}
              </a>
            ))}
            <span className="d1-nav__spacer" aria-hidden />
            <button type="button" className="d1-nav__icon-pill" aria-label="Search">
              <NavIcon d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" title="Search" />
            </button>
            <button type="button" className="d1-nav__icon-pill" aria-label="Notifications">
              <NavIcon
                d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0"
                title="Bell"
              />
            </button>
            <span className="d1-nav__avatar" aria-label="Roman">
              R
            </span>
          </nav>

          {/* ─── Welcome row ─────────────────────────────────────────── */}
          <div className="d1-welcome">
            <div>
              <p className="d1-welcome__lead">Welcome back,</p>
              <h2 className="d1-welcome__name">
                Roman
                <span className="d1-chip-premium" aria-label="Premium plan">
                  Premium
                </span>
              </h2>
            </div>
          </div>

          {/* ─── 3 KPI cards (one lime-highlighted) ──────────────────── */}
          <div className="d1-kpi-row">
            {/* Portfolio value — default dark card */}
            <article className="d1-kpi" aria-labelledby="kpi-portfolio-label">
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
              <p className="d1-kpi__num">$847,290</p>
              <p className="d1-kpi__delta">+12.4% MTD</p>
            </article>

            {/* Dividends YTD — default dark card */}
            <article className="d1-kpi" aria-labelledby="kpi-dividends-label">
              <div className="d1-kpi__head">
                <span className="d1-kpi__icon-chip" aria-hidden>
                  <IconChip
                    d="M12 1v22M5 8h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11"
                    title="Dividends"
                  />
                </span>
                <p id="kpi-dividends-label" className="d1-kpi__label">
                  Dividends YTD
                </p>
                <span className="d1-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d1-kpi__num">$3,200</p>
              <p className="d1-kpi__delta">+8.1% vs prev YTD</p>
            </article>

            {/* Drift alert MSFT — LIME-FILLED, ink numerals (AAA 14.7:1) */}
            <article className="d1-kpi d1-kpi--lime" aria-labelledby="kpi-drift-label">
              <div className="d1-kpi__head">
                <span className="d1-kpi__icon-chip" aria-hidden>
                  <IconChip
                    d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    title="Alert"
                  />
                </span>
                <p id="kpi-drift-label" className="d1-kpi__label">
                  Drift alert · MSFT
                </p>
                <span className="d1-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d1-kpi__num">12.0%</p>
              <p className="d1-kpi__delta">above 9% sector cap</p>
            </article>
          </div>

          {/* ─── Filter chip row ─────────────────────────────────────── */}
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

          {/* ─── 3-col data grid ─────────────────────────────────────── */}
          <div className="d1-grid">
            {/* ── Allocation drift panel (BarVisx + hatched legend) ── */}
            <article className="d1-panel" aria-labelledby="panel-drift-title">
              <header className="d1-panel__head">
                <h3 className="d1-panel__title">
                  <span className="d1-panel__icon-chip" aria-hidden>
                    <IconChip d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Drift" />
                  </span>
                  <span id="panel-drift-title">Allocation drift</span>
                </h3>
                <div className="d1-segmented" role="tablist" aria-label="Time range">
                  <button
                    type="button"
                    className="d1-segmented__btn"
                    role="tab"
                    aria-selected="false"
                  >
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
              <div className="d1-panel__body">
                <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={220} />
                {/* Inline SVG <defs> <pattern> hatched legend — the
                 * defining reference vocabulary, demonstrably inline-
                 * pattern-based (NOT CSS background-image). */}
                <div className="d1-hatch-legend" aria-label="Drift legend">
                  <HatchedSwatch />
                  <span className="d1-hatch-legend__label">Apr · drift</span>
                  <span className="d1-hatch-legend__value">+12.8%</span>
                </div>
              </div>
            </article>

            {/* ── Dividend calendar heatmap ─────────────────────────── */}
            <article className="d1-panel" aria-labelledby="panel-cal-title">
              <header className="d1-panel__head">
                <h3 className="d1-panel__title">
                  <span className="d1-panel__icon-chip" aria-hidden>
                    <IconChip d="M3 5h18v16H3zM8 3v4M16 3v4M3 10h18" title="Calendar" />
                  </span>
                  <span id="panel-cal-title">Dividend calendar</span>
                </h3>
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
              <div
                className="d1-panel__body"
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
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

            {/* ── Provedo insights chat-list ────────────────────────── */}
            <article className="d1-panel" aria-labelledby="panel-ai-title">
              <header className="d1-panel__head">
                <h3 className="d1-panel__title">
                  <span className="d1-panel__icon-chip" aria-hidden>
                    <IconChip
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      title="Insights"
                    />
                  </span>
                  <span id="panel-ai-title">Provedo insights</span>
                </h3>
              </header>
              <div className="d1-panel__body">
                <div
                  className="d1-chat__search"
                  aria-label="Filter insights (read-only — Provedo surfaces patterns weekly, not a chat composer)"
                >
                  <span className="d1-chat__search-icon" aria-hidden>
                    <NavIcon
                      d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
                      title="Filter"
                    />
                  </span>
                  <span className="d1-chat__search-text">
                    Filter insights by holding, sector, date…
                  </span>
                </div>
                <ul className="d1-chat__list" aria-label="AI insight feed">
                  {AI_MESSAGES.map((m) => (
                    <li className="d1-chat__row" key={m.time + m.byline}>
                      <span className="d1-chat__avatar" aria-hidden>
                        P
                      </span>
                      <div className="d1-chat__body">
                        <p className="d1-chat__byline">{m.byline}</p>
                        <p className="d1-chat__msg">{m.body}</p>
                      </div>
                      <span className="d1-chat__time">{m.time}</span>
                    </li>
                  ))}
                </ul>
                <p className="d1-panel__caption" style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <span>Provedo surfaces patterns weekly.</span>
                  <span className="d1-num">5 / wk</span>
                </p>
              </div>
            </article>
          </div>

          {/* ─── Lane-A regulatory disclosure ────────────────────────── */}
          <p className="d1-disclosure">Read-only. No advice. No trading.</p>
        </section>
      </div>
    </div>
  );
}

/**
 * Heatmap row fragment — kept as a tiny sub-component so the inline
 * `key` on the row label doesn't fight the inline `key` on the cells
 * within a flat grid template.
 */
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
