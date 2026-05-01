import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { RecordRail } from './_components/RecordRail';

/**
 * `/style-d1` — «Lime Cabin» (post 7-fix-pass canonical preview).
 *
 * Faithful translation of the pinterest reference per `D1-faithful.md`,
 * plus the mandatory 7-fix-pass landed 2026-05-01 — see
 * `.superpowers/brainstorm/2026-05-01-d1-fix-pass/KICKOFF.md` for the
 * fix history and `_lib/edge-cases.md` for the spec'd edge cases.
 *
 * Direction: deep charcoal canvas, lime as «look here», purple as
 * «something is happening», fully-rounded pill nav, AND the Provedo
 * Record Rail (the signature element) headering every persistent data
 * zone AND replacing the chat-row form factor for AI insights.
 *
 * Hard rules wired:
 *   - Pill vocabulary EVERYWHERE (`border-radius: 9999px`) — nav 40px,
 *     filter chips 36px, disclaimer chip 32px.
 *   - ONE KPI card highlighted lime at a time (drift observation per
 *     spec §7 — the «most-actionable metric» rule). Drift framing is
 *     OBSERVATIONAL, not alarmed (Fix 1 — copy + tone-down).
 *   - Bar chart bars use an inline SVG `<defs>` `<pattern>` reference
 *     for the hatched-stripe vocabulary (NOT CSS `background-image`,
 *     Safari iOS perf trap per KICKOFF §7.6 + spec §9 risk #6).
 *   - Heatmap cells 28×28, radius 6px, gap 4px, lime saturation
 *     gradient (5 levels: 0 / 15% / 40% / 70% / 100%).
 *   - AI insights render as Provedo Record Rail entries (NOT chat
 *     rows) — no avatar, no byline, no right-aligned timestamp, no
 *     hover ↗. Each insight = `▮ MAY 01 · 09:14 ───` + 2-line body.
 *   - Five sample AI messages from spec §6 — past-tense,
 *     source-attributed, no advisory language.
 *   - Persistent disclaimer chip in nav (Fix 3) — left placement,
 *     between brand monogram and first nav pill. Footer Lane-A
 *     disclosure stays as defence in depth.
 *   - Portfolio value is the dominant numeral (Fix 4 — clamp 48-56px);
 *     welcome name «Roman» demoted to a 16-24px eyebrow above the
 *     KPI cluster. The page hierarchy answers «what is my money
 *     doing» before «who am I».
 *   - Lime usage muted on filter chips + segmented controls (Fix 5)
 *     — restored to neutral light-on-card with a lime hairline
 *     border. Lime stays on: Drift KPI fill, nav active pill, Record
 *     Rail tick + hairline (5 surfaces total) + heatmap data + hatched
 *     bars (data treatment).
 *   - All money numerals rendered via `.d1-num` (Geist Mono tabular)
 *     in `--d1-text-primary` on dark cards / `--d1-text-ink` on the
 *     lime-highlighted KPI card (AAA 15.4:1 on lime, 15.9:1 on dark).
 *   - Lane-A regulatory disclosure 16px floor at the bottom.
 */

const HERO_EYEBROW = 'PROVEDO · POSITION';
const HERO_HEADLINE = 'Your portfolio, on the record. Lime where it matters.';
const HERO_SUB = 'Read-only across every broker. Dividends dated. Drift noted. Nothing prescribed.';
const HERO_CTA = 'See the dashboard';

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  active?: boolean;
  trailing?: '▾';
}> = [
  { label: 'Overview', active: true },
  { label: 'Insights', trailing: '▾' },
  // Fix 1 — drop the amber `3` count badge from the «Drift» nav pill
  // (was an alarm signal). Drift is now observational, not alerting.
  { label: 'Drift' },
  { label: 'Tax' },
  { label: 'Reports' },
];

const FILTER_CHIPS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'All', active: true },
  { label: 'Holdings' },
  { label: 'Income' },
  { label: 'Drift' },
];

/**
 * 5 AI messages per spec §6 — past-tense, source-attributed, no advice.
 * Each insight surfaces as a Provedo Record Rail entry post-fix-pass.
 *
 * `dateTime` is machine-readable (ISO-8601 UTC) for screen readers and
 * future i18n; `label` is the rendered datestamp («MAY 01 · 09:14»).
 */
const AI_MESSAGES: ReadonlyArray<{
  label: string;
  dateTime: string;
  body: string;
}> = [
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
            {/*
             * Fix 3 — persistent disclaimer chip (left placement).
             * Static disclosure (not a live region) so no role="status".
             * Discoverable via aria-label since the visible text is
             * suppressed at <414px (icon-only mode).
             */}
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
              <NavIcon
                d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0"
                title="Bell"
              />
            </button>
            <span className="d1-nav__avatar" aria-label="Roman">
              R
            </span>
          </nav>

          {/* ─── LEDGER zone (Fix 2 — Record Rail above KPI band) ────── */}
          <RecordRail label="LEDGER" />

          {/*
           * Fix 4 — welcome name «Roman» demoted to eyebrow ABOVE the
           * KPI cluster. Lead «Welcome back,» becomes a Geist Mono
           * 11px uppercase eyebrow. Dedicated welcome row collapsed.
           */}
          <div className="d1-eyebrow-row">
            <p className="d1-eyebrow-row__lead">Welcome back</p>
            <h2 className="d1-eyebrow-row__name">Roman</h2>
            <span className="d1-chip-premium" aria-label="Premium plan">
              Premium
            </span>
          </div>

          {/* ─── 3 KPI cards (one lime-highlighted) ──────────────────── */}
          <div className="d1-kpi-row">
            {/*
             * Portfolio value — promoted to dominant figure (Fix 4).
             * `d1-kpi--portfolio` modifier adds 160px min-height + a
             * clamp(48px, 4vw + 32px, 56px) numeral.
             */}
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

            {/*
             * Drift · MSFT — LIME-FILLED, ink numerals (AAA 15.4:1).
             * Fix 1 — label reframed («Drift alert» → «Drift»),
             * delta reworded to anchor to the user's rule («vs your
             * 9% cap, set Mar 11»), warning-triangle replaced with a
             * neutral chart-bar icon. Tone-down on the delta line is
             * applied via `.d1-kpi--lime .d1-kpi__delta` opacity 0.85
             * so the framing reads observational not alarmed.
             */}
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
              <p className="d1-kpi__num">12.0%</p>
              <p className="d1-kpi__delta">vs your 9% cap, set Mar 11</p>
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
                {/* Fix 2 — Record Rail replaces icon-chip + title. */}
                <RecordRail label="ALLOCATION DRIFT" />
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
              {/* Visually-hidden heading carries the semantic for SR. */}
              <h3 id="panel-drift-title" className="sr-only">
                Allocation drift
              </h3>
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

            {/*
             * Provedo insights — Fix 2 form-factor change. Each
             * insight = Record Rail entry, no chat-row chrome. The
             * filter input above the entries stays (kept as
             * `.d1-chat__search` — it filters, never composes).
             */}
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
                    <NavIcon
                      d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
                      title="Filter"
                    />
                  </span>
                  <span className="d1-chat__search-text">
                    Filter insights by holding, sector, date…
                  </span>
                </div>
                <ol className="d1-insights" aria-label="AI insight feed">
                  {AI_MESSAGES.map((m) => (
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

          {/* ─── DISCLOSURE zone (Fix 2 — Record Rail above Lane-A) ──── */}
          <div>
            <RecordRail label="DISCLOSURE" />
            <p className="d1-disclosure">Read-only. No advice. No trading.</p>
          </div>
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
