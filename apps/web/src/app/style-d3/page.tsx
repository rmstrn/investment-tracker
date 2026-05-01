import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-d3` — «Private Dossier».
 *
 * Luxe (Mercury × Hermès) translation of the Pinterest reference per
 * `D3-luxe-variant.md`. Lower saturation, tighter radii, sculpted
 * elevation, ONE display serif on three surfaces only. Reads as
 * «private dossier laid open on a leather desk», not «Pitch dashboard
 * with finance content swapped in». The dashboard view IS the hero —
 * the marketing strip on top is the smallest readable scrap that lets
 * PO compare this as a mini-landing alongside the R-series routes.
 *
 * Hard rules wired:
 *   - NO `border-radius: 9999px` anywhere. Radii ladder 6/12/16/20px
 *     is the strongest luxe signal (spec §5).
 *   - Pill nav becomes SCULPTED nav with 1.5px chartreuse underline on
 *     active item (animates scaleX 0→1 from origin: left, 240ms).
 *   - Fraunces appears on EXACTLY three surfaces: marketing headline
 *     (drilldown H2), welcome name, KPI numeral. Forbidden in body /
 *     chip / button / axis / tooltip.
 *   - 5-elevation taxonomy. Every elevated surface gets BOTH the 1px
 *     hairline AND the shadow — the hairline is what makes Mercury
 *     read as Mercury (spec §5).
 *   - Card hover: translateY(-1px) + elev-2→elev-3 shadow swap, 320ms.
 *     NO brightness change. NO scale. (V2 redesign rule.)
 *   - Bordeaux (`--d3-accent-secondary`) RESERVED for highlight: single
 *     bar in chart + tooltip surface + premium chip. NEVER for negative
 *     deltas — `down` is terracotta `--d3-down` (spec §3 + §9 risk #6).
 *   - AI dossier panel: NO avatars, NO emoji, NO relative times
 *     («3 min ago»). Absolute timestamps in JetBrains Mono
 *     (`PROVEDO · 09:14:02`). Five AI messages from spec §6.
 *   - Welcome name + KPI numeral both Fraunces opsz axis (56 / 44).
 *     Delta line below the numeral switches to JetBrains Mono.
 *   - All money numerals rendered via `.d3-kpi__num` (Fraunces 500
 *     opsz-44 tabular) in `--d3-ink` on standard cards / `--d3-canvas`
 *     ink on the chartreuse-cream KPI card (AAA 12.4:1).
 *   - Lane-A regulatory disclosure 16px floor at the bottom.
 */

const HERO_EYEBROW = 'PROVEDO · A PRIVATE DOSSIER';
const HERO_HEADLINE = 'Your portfolio, examined.';
const HERO_SUB =
  'Read-only across every broker. The discipline of a private banker; the surface of a quarterly review.';
const HERO_CTA = 'Request a session';

const NAV_ITEMS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'overview', active: true },
  { label: 'insights' },
  { label: 'analytics' },
  { label: 'audiences' },
  { label: 'reports' },
];

const FILTER_CHIPS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'All', active: true },
  { label: 'Engagement' },
  { label: 'Visit' },
  { label: 'Post' },
];

/**
 * Five AI messages per spec §6 — luxe register: NO avatars, NO emoji,
 * absolute timestamps in JetBrains Mono. Bracketed `[…]` markers carry
 * inline numerals (rendered via `.d3-num`). Each row carries an
 * underplayed CTA — never «reply», always «review setting» / «see
 * breakdown» / «open» / «disclosure» (no chat composer affordance).
 */
const AI_MESSAGES: ReadonlyArray<{
  time: string;
  body: ReadonlyArray<string | { num: string }>;
  cta: string;
}> = [
  {
    time: 'PROVEDO  ·  09:14:02',
    body: [
      'Your IBKR USD cash sleeve is at ',
      { num: '$ 12,480' },
      ' — that’s ',
      { num: '8.3%' },
      ' of total USD exposure. Above your ',
      { num: '5%' },
      ' self-set ceiling since 2026-04-22.',
    ],
    cta: 'Review setting',
  },
  {
    time: 'PROVEDO  ·  09:15:48',
    body: [
      'Three positions account for ',
      { num: '64%' },
      ' of unrealised P&L this month: ',
      { num: 'NVDA' },
      ', ',
      { num: 'ASML' },
      ', ',
      { num: 'LVMH' },
      '. Concentration up from ',
      { num: '51%' },
      ' thirty days ago.',
    ],
    cta: 'See breakdown',
  },
  {
    time: 'PROVEDO  ·  11:02:33',
    body: [
      'Lane A reminder: I cannot recommend trades. The pattern I surfaced is retrospective only and is not advice.',
    ],
    cta: 'Disclosure',
  },
  {
    time: 'PROVEDO  ·  14:48:09',
    body: [
      { num: 'EUR/USD' },
      ' moved ',
      { num: '-1.2%' },
      ' overnight. Your EUR-denominated holdings represent ',
      { num: '31%' },
      ' of the book; mark-to-market impact is ',
      { num: '-€ 4,820' },
      '.',
    ],
    cta: 'Currency view',
  },
  {
    time: 'PROVEDO  ·  16:22:50',
    body: [
      'Quarterly statements from Schwab are available since 16:18:04 today. I’ve parsed two — IRA + brokerage — and rolled forward your cost basis.',
    ],
    cta: 'Open',
  },
];

/** 6 weeks × 7 days time-visit heatmap intensity (0–4). Peak mid-week. */
const HEATMAP_WEEKS: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 1, 1, 0, 1, 0, 0],
  [0, 0, 2, 1, 1, 0, 0],
  [0, 1, 2, 3, 2, 1, 0],
  [0, 2, 3, 4, 4, 2, 1],
  [1, 2, 4, 4, 3, 1, 0],
  [0, 1, 2, 2, 1, 1, 0],
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
      strokeWidth="1.5"
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
 * Embossed-bar swatch — inline SVG `<defs>` `<pattern>` reference
 * (Safari iOS perf trap on CSS background-image per spec §9 risk #6
 * and KICKOFF §5). Hatched fill in `--d3-surface-1` over `--d3-surface-2`,
 * 5° rotation to keep stripes legible at small heights. Used in the
 * panel caption to demonstrate the embossed-bar vocabulary even though
 * BarVisx draws its own bars beneath.
 */
function EmbossedSwatch() {
  return (
    <svg width={36} height={18} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="d3-emboss"
          patternUnits="userSpaceOnUse"
          width={8}
          height={8}
          patternTransform="rotate(50)"
        >
          <rect width={8} height={8} fill="#26221e" />
          <line x1={0} y1={0} x2={0} y2={8} stroke="#1e1b18" strokeWidth={3} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={36} height={18} rx={6} ry={6} fill="url(#d3-emboss)" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* AI message body — renders inline numerals through `.d3-num` (mono)     */
/* ────────────────────────────────────────────────────────────────────── */

function MessageBody({
  body,
}: {
  body: ReadonlyArray<string | { num: string }>;
}) {
  return (
    <p className="d3-dossier__msg">
      {body.map((part, i) => {
        const key = typeof part === 'string' ? `${i}:t:${part}` : `${i}:n:${part.num}`;
        if (typeof part === 'string') {
          return <span key={key}>{part}</span>;
        }
        return (
          <span key={key} className="d3-num">
            {part.num}
          </span>
        );
      })}
    </p>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Page                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export default function StyleD3Page() {
  return (
    <div className="d3-page">
      <div className="d3-shell">
        {/* ── Marketing strip (above the dashboard, ≤280px tall) ─────── */}
        <header className="d3-marketing" aria-labelledby="d3-hero-heading">
          <div>
            <p className="d3-eyebrow">{HERO_EYEBROW}</p>
            <h1 id="d3-hero-heading" className="d3-headline">
              {HERO_HEADLINE}
            </h1>
            <p className="d3-sub">{HERO_SUB}</p>
          </div>
          <div>
            <a href="#dashboard" className="d3-cta">
              <span>{HERO_CTA}</span>
              <span aria-hidden>↗</span>
            </a>
          </div>
        </header>

        {/* ── Dashboard surface (the hero) ───────────────────────────── */}
        <section id="dashboard" className="d3-surface" aria-label="Provedo private dossier preview">
          {/* ─── Sculpted nav (NO pill fill — chartreuse underline) ─── */}
          <nav className="d3-nav" aria-label="Workspace navigation">
            <span className="d3-nav__brand" aria-label="Provedo">
              P R O V E D O
            </span>
            <ul className="d3-nav__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={`#${item.label}`}
                    className={item.active ? 'd3-nav__item d3-nav__item--active' : 'd3-nav__item'}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ─── Welcome row — Fraunces opsz-56 ──────────────────────── */}
          <div className="d3-welcome">
            <p className="d3-welcome__lead">Welcome back,</p>
            <h2 className="d3-welcome__name">
              <span>Darlene Robertson</span>
              <span className="d3-chip-premium" aria-label="Premium plan">
                Premium
              </span>
            </h2>
          </div>

          {/* ─── 3 KPI cards (one chartreuse-cream-filled) ───────────── */}
          <div className="d3-kpi-row">
            {/* Realized YTD — default surface-2 card, ink numeral */}
            <article className="d3-kpi" aria-labelledby="kpi-realized-label">
              <div className="d3-kpi__head">
                <span className="d3-kpi__icon-chip" aria-hidden>
                  <IconChip d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Realized" />
                </span>
                <p id="kpi-realized-label" className="d3-kpi__label">
                  Realized YTD
                </p>
                <span className="d3-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d3-kpi__num">$ 975,124</p>
              <p className="d3-kpi__delta d3-kpi__delta--up">+ 42.8% w/w ↑</p>
            </article>

            {/* Unrealized — default surface-2 card */}
            <article className="d3-kpi" aria-labelledby="kpi-unrealized-label">
              <div className="d3-kpi__head">
                <span className="d3-kpi__icon-chip" aria-hidden>
                  <IconChip
                    d="M12 1v22M5 8h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11"
                    title="Unrealized"
                  />
                </span>
                <p id="kpi-unrealized-label" className="d3-kpi__label">
                  Unrealized
                </p>
                <span className="d3-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d3-kpi__num">$ 296,241</p>
              <p className="d3-kpi__delta d3-kpi__delta--up">+ 26.3% w/w ↑</p>
            </article>

            {/* This Month P&L — CHARTREUSE FILL, canvas ink (AAA 12.4:1).
             * The down delta uses canvas ink at 0.7 opacity (NOT
             * terracotta) — on the chartreuse fill, terracotta would
             * fail AAA. Semantic intent is preserved by the «↓» glyph. */}
            <article className="d3-kpi d3-kpi--accent" aria-labelledby="kpi-month-label">
              <div className="d3-kpi__head">
                <span className="d3-kpi__icon-chip" aria-hidden>
                  <IconChip
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    title="Month"
                  />
                </span>
                <p id="kpi-month-label" className="d3-kpi__label">
                  This Month P&amp;L
                </p>
                <span className="d3-kpi__ext" aria-hidden>
                  <IconChip d="M7 17 17 7M7 7h10v10" title="Open" />
                </span>
              </div>
              <p className="d3-kpi__num">$ 76,314</p>
              <p className="d3-kpi__delta">- 18.4% w/w ↓</p>
            </article>
          </div>

          {/* ─── Filter chip row (`r-xs: 6px`, NOT pills) ────────────── */}
          <div className="d3-chips" role="toolbar" aria-label="View filters">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                className={chip.active ? 'd3-chip d3-chip--active' : 'd3-chip'}
                aria-pressed={chip.active}
              >
                {chip.label}
              </button>
            ))}
            <span className="d3-chips__spacer" aria-hidden />
            <button type="button" className="d3-chip d3-chip--icon" aria-label="Filter">
              <IconChip d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" title="Filter" />
            </button>
            <button type="button" className="d3-chip d3-chip--icon" aria-label="Date range">
              <IconChip d="M3 5h18v16H3zM8 3v4M16 3v4M3 10h18" title="Calendar" />
            </button>
            <button type="button" className="d3-chip d3-chip--export">
              <IconChip d="M12 3v12m-5-5 5 5 5-5M5 21h14" title="Export" />
              <span>Export</span>
            </button>
          </div>

          {/* ─── 2-col data grid (chart | heatmap) ───────────────────── */}
          <div className="d3-grid">
            {/* ── Engagement rate · Annually — embossed BarVisx ─────── */}
            <article className="d3-panel" aria-labelledby="panel-eng-title">
              <header className="d3-panel__head">
                <h3 className="d3-panel__title">
                  <span className="d3-panel__icon-chip" aria-hidden>
                    <IconChip d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Engagement" />
                  </span>
                  <span id="panel-eng-title">
                    Engagement rate <span className="d3-panel__title-mute">· Annually</span>
                  </span>
                </h3>
                <button type="button" className="d3-panel__caret" aria-label="Change range">
                  <span>Annually</span>
                  <span aria-hidden>▾</span>
                </button>
              </header>
              <div className="d3-panel__body">
                <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={220} />
                {/* Inline SVG <defs> <pattern> embossed legend — the
                 * defining vocabulary, demonstrably inline-pattern-based
                 * (NOT CSS background-image). Bordeaux-tinged value
                 * shows the highlight discipline (single bar / single
                 * tooltip surface in real chart, demonstrated in legend). */}
                <div className="d3-emboss-legend" aria-label="Drift legend">
                  <EmbossedSwatch />
                  <span className="d3-emboss-legend__label">Apr · embossed</span>
                  <span className="d3-emboss-legend__value">+12.8%</span>
                </div>
              </div>
            </article>

            {/* ── Time visit · Follower — heatmap ──────────────────── */}
            <article className="d3-panel" aria-labelledby="panel-cal-title">
              <header className="d3-panel__head">
                <h3 className="d3-panel__title">
                  <span className="d3-panel__icon-chip" aria-hidden>
                    <IconChip d="M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" title="Time" />
                  </span>
                  <span id="panel-cal-title">
                    Time visit <span className="d3-panel__title-mute">· Follower</span>
                  </span>
                </h3>
                <button type="button" className="d3-panel__caret" aria-label="Change cohort">
                  <span>Follower</span>
                  <span aria-hidden>▾</span>
                </button>
              </header>
              <div
                className="d3-panel__body"
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <div
                  className="d3-heatmap"
                  role="img"
                  aria-label="Time-of-visit by follower over the last 6 weeks; peak intensity in week 4 mid-week"
                >
                  <span aria-hidden />
                  {WEEK_LABELS.map((d) => (
                    <span key={d} className="d3-heatmap__collabel">
                      {d.slice(0, 1)}
                    </span>
                  ))}
                  {HEATMAP_WEEKS.map((week, wIdx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
                    <RowFragment key={`w-${wIdx}`} weekIdx={wIdx} week={week} />
                  ))}
                </div>
                <p className="d3-panel__caption" style={{ width: '100%', marginTop: 18 }}>
                  <span>Peak: Wed 14:00–16:00</span>
                  <span className="d3-num">6 wks</span>
                </p>
              </div>
            </article>
          </div>

          {/* ─── AI dossier panel (full-width, below the fold) ───────── */}
          <article id="dossier" className="d3-dossier" aria-labelledby="dossier-title">
            <header className="d3-dossier__head">
              <h3 id="dossier-title" className="d3-dossier__title">
                Provedo · Dossier
              </h3>
              <span className="d3-dossier__meta">5 entries · today</span>
            </header>
            <ul className="d3-dossier__list" aria-label="AI dossier feed">
              {AI_MESSAGES.map((m) => (
                <li className="d3-dossier__row" key={m.time}>
                  <p className="d3-dossier__byline">{m.time}</p>
                  <MessageBody body={m.body} />
                  <a href="#dossier" className="d3-dossier__cta">
                    {m.cta}
                  </a>
                </li>
              ))}
            </ul>
          </article>

          {/* ─── Lane-A regulatory disclosure ────────────────────────── */}
          <p className="d3-disclosure">
            Read-only. No advice. No trading. The patterns above are retrospective and
            informational.
          </p>
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
      <span className="d3-heatmap__rowlabel">{labelDate}</span>
      {week.map((level, dayIdx) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
          key={`w${weekIdx}-d${dayIdx}`}
          className="d3-heatmap__cell"
          data-level={level}
          aria-label={`Week ${weekIdx + 1} ${WEEK_LABELS[dayIdx]} intensity ${level}`}
        />
      ))}
    </>
  );
}
