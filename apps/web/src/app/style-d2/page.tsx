import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-d2` — «Daylight Provedo».
 *
 * Light-mode translation of the pinterest reference per
 * `D2-light-variant.md`. Cream paper canvas, ink-deep numerals, lime as
 * fluorescent highlighter on the one card that matters today, purple as
 * editorial annotation ink. The dashboard view IS the hero — the
 * marketing strip on top is the smallest readable scrap that lets PO
 * compare this as a mini-landing alongside the R-series + D1.
 *
 * Hard rules wired:
 *   - Three-step value system carries depth: paper (page) → paper-deep
 *     (card) → #FFFFFF (hover). NO drop shadows on cards — hairline
 *     borders + value contrast do the work.
 *   - Pill vocabulary on nav + filter chips ONLY (avoids «Mailchimp 2018»
 *     trap). KPI cards are 22px-rounded RECTANGLES.
 *   - Lime KPI card: entire card filled `--d2-accent-lime`, INK numerals
 *     (15.2:1, NOT white — would be ~2.4:1 instant fail). Icon-chip on
 *     lime card flips to paper-deep so icon stays legible.
 *   - Purple TWO-tone discipline: `--d2-accent-purple` (#5B3FE6) for
 *     fills (avatar, tooltip), `--d2-accent-purple-deep` (#3B2BA8) for
 *     ink contexts (Premium stamp text, AI author label). Lavender
 *     disappears on cream — never use it.
 *   - «Premium» chip = STAMP (24px, transparent fill, 1.5px deep-purple
 *     border, deep-purple text uppercase).
 *   - Hatched bars on light read as «engineering drawing» — feature, not
 *     bug. Inline SVG `<defs>` `<pattern>` reference, NOT CSS
 *     background-image (Safari iOS perf trap).
 *   - Embedded BarVisx renders its own candy-treated bars beneath; the
 *     static hatched legend swatch carries the reference's defining
 *     vocabulary explicitly. CSS-var override on `.d2-panel` retones
 *     BarVisx to D2's lime/purple/ink palette.
 *   - Heatmap cells 28×28, radius 6px, gap 4px, lime saturation gradient
 *     (5 levels: 0 / 22% / 50% / 78% / 100%).
 *   - Chat-list AI rows with 36px purple avatar + white «P» monogram (AI
 *     never gets a human face). Search input in panel header is a
 *     FILTER, NOT a reply input — empty-state copy clarifies.
 *   - Five sample AI messages from spec §6: drift / pattern /
 *     tax-loss / cash drift / quarterly digest. Author label
 *     `PROVEDO INSIGHT · TYPE · 2m ago` in deep-purple uppercase 12px.
 *   - Welcome name + KPI numerals all Inter 700 tabular in `--d2-ink`
 *     (AAA 17.8:1) on `--d2-paper-deep`.
 *   - Lane-A regulatory disclosure 16px floor at the bottom.
 */

const HERO_EYEBROW = 'PROVEDO · DAYLIGHT';
const HERO_HEADLINE = 'A quarterly statement, alive. Yours, in daylight.';
const HERO_SUB =
  'One paper canvas across every broker. Read what changed this week — footnoted, dated, dignified.';
const HERO_CTA = 'Open dashboard';

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  active?: boolean;
  badge?: number;
  trailing?: '▾';
}> = [
  { label: 'Overview', active: true },
  { label: 'Insights', trailing: '▾', badge: 3 },
  { label: 'Analytics' },
  { label: 'Audiences' },
  { label: 'Reports' },
];

const FILTER_CHIPS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'All', active: true },
  { label: 'Equity' },
  { label: 'Crypto' },
  { label: 'FX' },
];

/**
 * 5 AI messages per spec §6 — drift alert / pattern detected / tax-loss
 * / cash drift / quarterly digest. Past-tense, source-attributed, no
 * advisory language. Author label is `PROVEDO INSIGHT · TYPE · TIME`
 * rendered in deep-purple uppercase 12px.
 */
const AI_MESSAGES: ReadonlyArray<{
  type: string;
  time: string;
  body: string;
}> = [
  {
    type: 'PORTFOLIO HEALTH',
    time: '2m ago',
    body: 'Your Tech sleeve is 38% of equity — 12pp above your target. Three names drove the drift this week: NVDA +6.2%, MSFT +3.1%, GOOG +2.8%.',
  },
  {
    type: 'PATTERN DETECTED',
    time: '1h ago',
    body: 'Your Q1 win was 71% FX tailwind, not stock-picking. EUR/USD did the heavy lifting across 8 of 11 weeks.',
  },
  {
    type: 'TAX-LOSS WINDOW',
    time: '4h ago',
    body: 'Three positions show realized losses ≥ $2,400 if closed before May 31. PYPL -$3,120 · UPS -$2,840 · INTC -$2,460.',
  },
  {
    type: 'CASH DRIFT',
    time: 'Yesterday',
    body: 'IBKR cash sleeve grew $4,800 this month. Last deployed 6 weeks ago — currently 7.6% of equity, above your 5% rule.',
  },
  {
    type: 'QUARTERLY DIGEST',
    time: 'Apr 22',
    body: 'Energy now 18% of equity (cap: 15%). Dividends $1,240 settled this week, 84% from 3 holdings. Drift alert MSFT crossed.',
  },
];

/** 6 weeks × 7 days time-visit heatmap intensity (0–4). */
const HEATMAP_WEEKS: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 1, 2, 1, 1, 0, 0],
  [0, 2, 3, 2, 1, 0, 0],
  [0, 1, 3, 4, 3, 1, 0],
  [0, 2, 4, 4, 4, 2, 0],
  [0, 2, 3, 4, 3, 2, 0],
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
      width="16"
      height="16"
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
 * NOT CSS background-image. On cream this reads as «engineering drawing»
 * (the daylight-specific visual register per D2 §5). The pattern is
 * referenced by `fill="url(#d2-hatch)"` so Safari iOS does not re-paint
 * per frame (KICKOFF §5 risk #1 / D1-faithful §9 risk #6).
 */
function HatchedSwatch() {
  return (
    <svg width={32} height={16} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="d2-hatch"
          patternUnits="userSpaceOnUse"
          width={8}
          height={8}
          patternTransform="rotate(45)"
        >
          <rect width={8} height={8} fill="#f4f1ea" />
          <line x1={0} y1={0} x2={0} y2={8} stroke="#5a554c" strokeOpacity={0.4} strokeWidth={3} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={32} height={16} rx={4} ry={4} fill="url(#d2-hatch)" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Page                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export default function StyleD2Page() {
  return (
    <div className="d2-page">
      <div className="d2-shell">
        {/* ── Marketing strip (above the dashboard, ≤280px tall) ─────── */}
        <header className="d2-marketing" aria-labelledby="d2-hero-heading">
          <div>
            <p className="d2-eyebrow">{HERO_EYEBROW}</p>
            <h1 id="d2-hero-heading" className="d2-headline">
              {HERO_HEADLINE}
            </h1>
            <p className="d2-sub">{HERO_SUB}</p>
          </div>
          <div>
            <a href="#dashboard" className="d2-cta">
              <span>{HERO_CTA}</span>
              <span aria-hidden>↓</span>
            </a>
          </div>
        </header>

        {/* ── Dashboard surface (the hero) ───────────────────────────── */}
        <section id="dashboard" className="d2-surface" aria-label="Provedo dashboard preview">
          {/* ─── Pill nav (paper-deep, hairline bottom border) ──────── */}
          <nav className="d2-nav" aria-label="Workspace navigation">
            <span className="d2-nav__brand" aria-label="Provedo">
              P
            </span>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={`#${item.label.toLowerCase()}`}
                className={item.active ? 'd2-pill d2-pill--active' : 'd2-pill'}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.active ? (
                  <span className="d2-pill__icon" aria-hidden>
                    <NavIcon d="M3 5h18v11H3zM8 21h8M12 16v5" title="Overview" />
                  </span>
                ) : null}
                <span>{item.label}</span>
                {item.trailing ? <span aria-hidden>{item.trailing}</span> : null}
                {item.badge ? (
                  <span className="d2-pill__badge" aria-label={`${item.badge} new insights`}>
                    {item.badge}
                  </span>
                ) : null}
              </a>
            ))}
            <span className="d2-nav__spacer" aria-hidden />
            <button type="button" className="d2-nav__icon-pill" aria-label="Search">
              <NavIcon d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" title="Search" />
            </button>
            <button type="button" className="d2-nav__icon-pill" aria-label="Notifications">
              <NavIcon
                d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0"
                title="Bell"
              />
            </button>
            <span className="d2-nav__avatar" aria-label="Daria Maistrenko">
              D
            </span>
          </nav>

          {/* ─── Welcome row ─────────────────────────────────────────── */}
          <div className="d2-welcome">
            <div>
              <p className="d2-welcome__lead">Welcome back,</p>
              <h2 className="d2-welcome__name">
                Daria Maistrenko
                <span className="d2-stamp-premium" aria-label="Premium plan">
                  Premium
                </span>
              </h2>
            </div>
          </div>

          {/* ─── 3 KPI cards (one lime-highlighted: Cash) ────────────── */}
          <div className="d2-kpi-row">
            {/* Equity — default paper-deep card */}
            <article className="d2-kpi" aria-labelledby="kpi-equity-label">
              <div className="d2-kpi__head">
                <span className="d2-kpi__icon-chip" aria-hidden>
                  <IconChip d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Equity" />
                </span>
                <p id="kpi-equity-label" className="d2-kpi__label">
                  Equity
                </p>
                <span className="d2-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d2-kpi__num">$245,180</p>
              <p className="d2-kpi__delta">+1.42% week</p>
            </article>

            {/* PnL (wk) — default paper-deep card */}
            <article className="d2-kpi" aria-labelledby="kpi-pnl-label">
              <div className="d2-kpi__head">
                <span className="d2-kpi__icon-chip" aria-hidden>
                  <IconChip d="M12 1v22M5 8h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11" title="PnL" />
                </span>
                <p id="kpi-pnl-label" className="d2-kpi__label">
                  PnL (wk)
                </p>
                <span className="d2-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d2-kpi__num">+$3,402</p>
              <p className="d2-kpi__delta">+1.41% week</p>
            </article>

            {/* Cash — LIME-FILLED (most-loaded retail number, ink AAA 15.2:1) */}
            <article className="d2-kpi d2-kpi--lime" aria-labelledby="kpi-cash-label">
              <div className="d2-kpi__head">
                <span className="d2-kpi__icon-chip" aria-hidden>
                  <IconChip d="M3 7h18v12H3zM3 11h18M7 15h4M16 15h2" title="Cash" />
                </span>
                <p id="kpi-cash-label" className="d2-kpi__label">
                  Cash
                </p>
                <span className="d2-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d2-kpi__num">$18,640</p>
              <p className="d2-kpi__delta">−2.1% week · 7.6% of equity</p>
            </article>
          </div>

          {/* ─── Filter chip row ─────────────────────────────────────── */}
          <div className="d2-chips" role="toolbar" aria-label="View filters">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                className={chip.active ? 'd2-chip d2-chip--active' : 'd2-chip'}
                aria-pressed={chip.active}
              >
                {chip.label}
              </button>
            ))}
            <span className="d2-chips__spacer" aria-hidden />
            <button type="button" className="d2-chip d2-chip--icon" aria-label="Search">
              <NavIcon d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" title="Search" />
            </button>
            <button type="button" className="d2-chip d2-chip--icon" aria-label="Date range">
              <NavIcon d="M3 5h18v16H3zM8 3v4M16 3v4M3 10h18" title="Calendar" />
            </button>
            <button type="button" className="d2-chip d2-chip--export">
              <NavIcon d="M12 3v12m-5-5 5 5 5-5M5 21h14" title="Download" />
              <span>Download reports</span>
            </button>
          </div>

          {/* ─── 3-col data grid ─────────────────────────────────────── */}
          <div className="d2-grid">
            {/* ── Engagement rate panel (BarVisx + hatched legend) ── */}
            <article className="d2-panel" aria-labelledby="panel-engagement-title">
              <header className="d2-panel__head">
                <h3 className="d2-panel__title">
                  <span className="d2-panel__icon-chip" aria-hidden>
                    <IconChip d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Engagement" />
                  </span>
                  <span id="panel-engagement-title">Engagement rate</span>
                </h3>
                <div className="d2-segmented" role="tablist" aria-label="Time range">
                  <button
                    type="button"
                    className="d2-segmented__btn"
                    role="tab"
                    aria-selected="false"
                  >
                    1W
                  </button>
                  <button
                    type="button"
                    className="d2-segmented__btn"
                    role="tab"
                    aria-selected="false"
                  >
                    1M
                  </button>
                  <button
                    type="button"
                    className="d2-segmented__btn d2-segmented__btn--active"
                    role="tab"
                    aria-selected="true"
                  >
                    1Y
                  </button>
                </div>
              </header>
              <div className="d2-panel__body">
                <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={220} />
                {/* Inline SVG <defs> <pattern> hatched legend — the
                 * defining reference vocabulary, demonstrably inline-
                 * pattern-based (NOT CSS background-image). On cream
                 * the diagonal stripes read as «engineering drawing». */}
                <div className="d2-hatch-legend" aria-label="Apr peak legend">
                  <HatchedSwatch />
                  <span className="d2-hatch-legend__label">Apr · peak</span>
                  <span className="d2-hatch-legend__value">+12.8%</span>
                </div>
              </div>
            </article>

            {/* ── Time visit heatmap ────────────────────────────────── */}
            <article className="d2-panel" aria-labelledby="panel-cal-title">
              <header className="d2-panel__head">
                <h3 className="d2-panel__title">
                  <span className="d2-panel__icon-chip" aria-hidden>
                    <IconChip d="M3 5h18v16H3zM8 3v4M16 3v4M3 10h18" title="Calendar" />
                  </span>
                  <span id="panel-cal-title">Time visit</span>
                </h3>
                <div className="d2-segmented" role="tablist" aria-label="Cohort">
                  <button
                    type="button"
                    className="d2-segmented__btn d2-segmented__btn--active"
                    role="tab"
                    aria-selected="true"
                  >
                    By session
                  </button>
                </div>
              </header>
              <div
                className="d2-panel__body"
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <div
                  className="d2-heatmap"
                  role="img"
                  aria-label="Time visit over the last 6 weeks, with peak intensity in week 4 mid-week"
                >
                  <span aria-hidden />
                  {WEEK_LABELS.map((d) => (
                    <span key={d} className="d2-heatmap__collabel">
                      {d.slice(0, 1)}
                    </span>
                  ))}
                  {HEATMAP_WEEKS.map((week, wIdx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
                    <RowFragment key={`w-${wIdx}`} weekIdx={wIdx} week={week} />
                  ))}
                </div>
                <p className="d2-panel__caption" style={{ width: '100%', marginTop: 16 }}>
                  <span>Peak · Wed · 4PM</span>
                  <span className="d2-num">6 wks</span>
                </p>
              </div>
            </article>

            {/* ── Messages chat-list (AI surface) ───────────────────── */}
            <article className="d2-panel" aria-labelledby="panel-ai-title">
              <header className="d2-panel__head">
                <h3 className="d2-panel__title">
                  <span className="d2-panel__icon-chip" aria-hidden>
                    <IconChip
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      title="Messages"
                    />
                  </span>
                  <span id="panel-ai-title">Messages</span>
                </h3>
              </header>
              <div className="d2-panel__body">
                <div
                  className="d2-chat__search"
                  aria-label="Filter insights (read-only — Provedo surfaces patterns weekly, not a chat composer)"
                >
                  <span className="d2-chat__search-icon" aria-hidden>
                    <NavIcon
                      d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
                      title="Filter"
                    />
                  </span>
                  <span className="d2-chat__search-text">
                    Filter messages by holding, type, date…
                  </span>
                </div>
                <ul className="d2-chat__list" aria-label="AI insight feed">
                  {AI_MESSAGES.map((m) => (
                    <li className="d2-chat__row" key={m.type + m.time}>
                      <span className="d2-chat__avatar" aria-hidden>
                        P
                      </span>
                      <div className="d2-chat__body">
                        <p className="d2-chat__byline">
                          <span>Provedo Insight · {m.type}</span>
                          <span className="d2-chat__byline-time">· {m.time}</span>
                        </p>
                        <p className="d2-chat__msg">{m.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="d2-panel__caption" style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <span>Provedo surfaces patterns weekly</span>
                  <span className="d2-num">5 / wk</span>
                </p>
              </div>
            </article>
          </div>

          {/* ─── Lane-A regulatory disclosure (16px floor) ───────────── */}
          <p className="d2-disclosure">Read-only. No advice. No trading.</p>
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
      <span className="d2-heatmap__rowlabel">{labelDate}</span>
      {week.map((level, dayIdx) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
          key={`w${weekIdx}-d${dayIdx}`}
          className="d2-heatmap__cell"
          data-level={level}
          aria-label={`Week ${weekIdx + 1} ${WEEK_LABELS[dayIdx]} intensity ${level}`}
        />
      ))}
    </>
  );
}
