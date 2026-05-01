import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-d4` — «Provedo Console».
 *
 * Density translation of the pinterest reference per `D4-density-variant.md`.
 * Linear app interior × the reference's lime/purple. Tighter radii (chips
 * NOT pills — only the `[Pro]` badge survives), mono numerals on the
 * strict allow-list (numerals / kbd / tickers), `⌘K` command palette
 * REPLACES the chat sidebar (rendered open in the comp so PO can see
 * the AI mode without interaction), dense holdings table directly under
 * the KPI strip.
 *
 * Hard rules wired:
 *   - CHIPS NOT PILLS. Radii ladder: content card 12px / KPI card 8px /
 *     nav element 8px (chip) / filter chip 8px / palette overlay 12px /
 *     table row 4px (hover state only). Single pill survives: `[Pro]`
 *     badge next to user name.
 *   - Mono ALLOW-LIST (strict): numerals (`.d4-num`), kbd chips
 *     (`.d4-kbd`), tickers (`.d4-ticker`) ONLY. Inter for ALL labels and
 *     prose. Welcome name, button labels, AI message body all stay
 *     Inter.
 *   - Welcome name SHRINKS to 28px (NOT 56px) — density direction
 *     can't spare 56px of vertical for an identity flex.
 *   - 5 KPI cards in a row (NOT 3): Net worth / Invested / **Net worth ↗
 *     [LIME, SPACIOUS 120px]** / Dividends / Cash. Asymmetry = hierarchy.
 *   - Dense holdings table directly under the KPI strip. Row height
 *     32px, NVDA active row gets the 2px lime LEFT border (no fill).
 *   - `⌘K` palette overlay rendered VISIBLE (open mid-page over the comp)
 *     — NOT a hidden modal. PO must see the AI mode in static screenshot.
 *   - Persistent slim search affordance in top bar with `[ Search ⌘K ]`
 *     chip badge (Linear's discoverability pattern).
 *   - Up/down semantics ALWAYS paired with glyph (`▲` / `▼`) — never
 *     colour-only meaning.
 *   - All money numerals rendered via `.d4-num` (JetBrains Mono tabular)
 *     in `--d4-ink` on dark surfaces / `--d4-ink-on-lime` on the lime
 *     KPI card (AAA 16.8:1 on surface-1, 17.4:1 on lime).
 *   - Lane-A regulatory disclosure 16px floor at the bottom.
 */

const HERO_EYEBROW = 'PROVEDO · CONSOLE';
const HERO_HEADLINE = 'A portfolio terminal for people who already know what cost-basis means.';
const HERO_SUB = 'Dense, monospaced, keyboard-driven. Connect a broker, open ⌘K, see your book.';

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  active?: boolean;
  trailing?: '▾';
  count?: number;
  dot?: boolean;
}> = [
  { label: 'Overview', active: true, dot: true },
  { label: 'Insights', trailing: '▾' },
  { label: 'Performance', count: 12 },
  { label: 'Holdings' },
  { label: 'Activity' },
];

const FILTER_CHIPS: ReadonlyArray<{ label: string; active?: boolean }> = [
  { label: 'All', active: true },
  { label: 'Equity' },
  { label: 'ETF' },
  { label: 'Crypto' },
];

interface Holding {
  ticker: string;
  name: string;
  qty: string;
  last: string;
  value: string;
  delta: string;
  deltaDirection: 'up' | 'down';
  alloc: 1 | 2 | 3 | 4;
  active?: boolean;
}

const HOLDINGS: ReadonlyArray<Holding> = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    qty: '220',
    last: '$189.42',
    value: '$41,672.40',
    delta: '+1.84%',
    deltaDirection: 'up',
    alloc: 3,
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    qty: '80',
    last: '$412.10',
    value: '$32,968.00',
    delta: '+0.42%',
    deltaDirection: 'up',
    alloc: 3,
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    qty: '40',
    last: '$876.50',
    value: '$35,060.00',
    delta: '+3.21%',
    deltaDirection: 'up',
    alloc: 4,
    active: true,
  },
  {
    ticker: 'VOO',
    name: 'Vanguard S&P 500',
    qty: '120',
    last: '$510.20',
    value: '$61,224.00',
    delta: '+0.81%',
    deltaDirection: 'up',
    alloc: 4,
  },
];

/** ⌘K palette result rows — scenarios from spec §6 (Ask is rendered as
 *  the active streaming answer above; remaining rows show Compare /
 *  Cost basis / Navigate / Add account). */
const PALETTE_RESULTS: ReadonlyArray<{
  label: string;
  meta: string;
  kbd: string;
  active?: boolean;
  iconPath: string;
}> = [
  {
    label: 'Compare AAPL and MSFT YTD',
    meta: 'opens 320×120 mini-chart inline',
    kbd: '⌘O',
    active: true,
    iconPath: 'M3 12h6M15 12h6M9 6l6 6-6 6',
  },
  {
    label: 'Show cost basis for NVDA',
    meta: 'lots · qty · basis · current',
    kbd: '↵',
    iconPath: 'M3 3v18h18M7 14l4-4 3 3 5-6',
  },
  {
    label: 'Navigate · Dividends → 2025',
    meta: 'typeahead',
    kbd: '↵',
    iconPath: 'M5 12h14M13 6l6 6-6 6',
  },
  {
    label: 'Add IBKR account',
    meta: 'connect · disclosure inline',
    kbd: '⌘N',
    iconPath: 'M12 5v14M5 12h14',
  },
];

/** Activity heatmap — 5 rows × 8 cols, lime saturation gradient (0–4). */
const HEATMAP_ROWS: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 1, 2, 1, 0, 1, 2, 0],
  [1, 2, 3, 2, 1, 0, 1, 2],
  [0, 1, 3, 4, 3, 2, 1, 0],
  [1, 2, 4, 4, 3, 2, 1, 1],
  [0, 1, 2, 3, 2, 1, 0, 1],
];

const HEATMAP_DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'];
const HEATMAP_ROW_LABELS = ['w-5', 'w-4', 'w-3', 'w-2', 'w-1'];

/* ────────────────────────────────────────────────────────────────────── */
/* Inline SVG primitives                                                   */
/* ────────────────────────────────────────────────────────────────────── */

function Icon({
  d,
  title,
  size = 16,
}: {
  d: string;
  title: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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

/** 4-dot allocation indicator. Filled circles up to `level`. */
function AllocDots({ level }: { level: 1 | 2 | 3 | 4 }) {
  return (
    <span aria-label={`Allocation tier ${level} of 4`}>
      <span style={{ color: level >= 1 ? undefined : 'var(--d4-muted)' }}>
        {level >= 1 ? '●' : '○'}
      </span>
      <span style={{ color: level >= 2 ? undefined : 'var(--d4-muted)' }}>
        {level >= 2 ? '●' : '○'}
      </span>
      <span style={{ color: level >= 3 ? undefined : 'var(--d4-muted)' }}>
        {level >= 3 ? '●' : '○'}
      </span>
      <span style={{ color: level >= 4 ? undefined : 'var(--d4-muted)' }}>
        {level >= 4 ? '●' : '○'}
      </span>
    </span>
  );
}

/**
 * NVDA 3-month sparkline — single lime line + dotted purple cost-basis.
 * Inline SVG with two paths over a 320×140 viewbox.
 */
function NvdaSparkline() {
  // Synthetic monthly closes: rising trajectory with one drawdown then rebound.
  const points = [
    [0, 110],
    [25, 105],
    [50, 98],
    [75, 90],
    [100, 88],
    [125, 78],
    [150, 80],
    [175, 70],
    [200, 65],
    [225, 60],
    [250, 50],
    [275, 45],
    [300, 38],
    [320, 32],
  ];
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
  // Cost basis horizontal at y = 88
  const costPath = 'M0 88 L320 88';
  return (
    <svg
      viewBox="0 0 320 140"
      preserveAspectRatio="none"
      role="img"
      aria-label="NVDA 3-month price line in lime, cost-basis dotted in purple"
      className="d4-spark"
    >
      <title>NVDA 3-month sparkline</title>
      {/* Cost basis dotted purple */}
      <path
        d={costPath}
        stroke="var(--d4-purple)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        fill="none"
      />
      {/* Price line lime */}
      <path
        d={linePath}
        stroke="var(--d4-lime)"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Final dot */}
      <circle cx={320} cy={32} r={3} fill="var(--d4-lime)" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Page                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export default function StyleD4Page() {
  return (
    <div className="d4-page">
      <div className="d4-shell">
        {/* ── Marketing strip (above the dashboard, ≤280px tall) ─────── */}
        <header className="d4-marketing" aria-labelledby="d4-hero-heading">
          <div className="d4-marketing__copy">
            <p className="d4-eyebrow">
              {HERO_EYEBROW}
              <span className="d4-eyebrow__cursor" aria-hidden />
            </p>
            <h1 id="d4-hero-heading" className="d4-headline">
              {HERO_HEADLINE}
            </h1>
            <p className="d4-sub">{HERO_SUB}</p>
          </div>
          <div className="d4-cta-row">
            <a href="#dashboard" className="d4-cta d4-cta--primary">
              <span className="d4-cta__kbd">⌘K</span>
              <span>open palette</span>
            </a>
            <a href="#connect" className="d4-cta d4-cta--ghost">
              <span>connect a broker</span>
            </a>
          </div>
        </header>

        {/* ── Dashboard surface (the hero) ───────────────────────────── */}
        <section id="dashboard" className="d4-surface" aria-label="Provedo Console preview">
          {/* ─── 48px top bar (chip nav, NOT pill) ───────────────────── */}
          <nav className="d4-topbar" aria-label="Workspace navigation">
            <span className="d4-topbar__brand">
              <span className="d4-topbar__logo" aria-hidden>
                P
              </span>
              <span>Provedo</span>
            </span>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={`#${item.label.toLowerCase()}`}
                className={item.active ? 'd4-chip-nav d4-chip-nav--active' : 'd4-chip-nav'}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.dot ? <span className="d4-chip-nav__dot" aria-hidden /> : null}
                <span>{item.label}</span>
                {item.trailing ? <span aria-hidden>{item.trailing}</span> : null}
                {item.count ? (
                  <span className="d4-chip-nav__count" aria-label={`${item.count} items`}>
                    {item.count}
                  </span>
                ) : null}
              </a>
            ))}
            <span className="d4-topbar__spacer" aria-hidden />
            <button type="button" className="d4-search-chip" aria-label="Open command palette">
              <Icon
                d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
                title="Search"
                size={14}
              />
              <span className="d4-search-chip__label">Search</span>
              <span className="d4-kbd">⌘K</span>
            </button>
            <button type="button" className="d4-icon-btn" aria-label="Notifications">
              <Icon
                d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0"
                title="Bell"
                size={16}
              />
            </button>
            <span className="d4-avatar" aria-label="Darlene Robertson">
              DR
            </span>
          </nav>

          {/* ─── Welcome row (28px name — NOT 56px) ──────────────────── */}
          <div className="d4-welcome">
            <div>
              <p className="d4-welcome__lead">Welcome back,</p>
              <h2 className="d4-welcome__name">
                Darlene Robertson
                <span className="d4-pill-pro" aria-label="Pro plan">
                  Pro
                </span>
              </h2>
            </div>
          </div>

          {/* ─── 5 KPI cards in a row, ONE spacious lime ─────────────── */}
          <div className="d4-kpi-row">
            {/* NET WORTH */}
            <article className="d4-kpi" aria-labelledby="kpi-net-label">
              <p id="kpi-net-label" className="d4-kpi__label">
                Net worth
              </p>
              <p className="d4-kpi__num d4-num">$342,108</p>
              <p className="d4-kpi__delta d4-kpi__delta--up">
                <span className="d4-kpi__glyph" aria-hidden>
                  ▲
                </span>
                +2.4%
              </p>
            </article>

            {/* INVESTED */}
            <article className="d4-kpi" aria-labelledby="kpi-inv-label">
              <p id="kpi-inv-label" className="d4-kpi__label">
                Invested
              </p>
              <p className="d4-kpi__num d4-num">$298,440</p>
              <p className="d4-kpi__delta d4-kpi__delta--flat">
                <span className="d4-kpi__glyph" aria-hidden>
                  ▬
                </span>
                +0.0%
              </p>
            </article>

            {/* NET WORTH ↗ — LIME-FILLED, SPACIOUS */}
            <article className="d4-kpi d4-kpi--lime" aria-labelledby="kpi-month-label">
              <span className="d4-kpi__arrow" aria-hidden>
                <Icon d="M7 17 17 7M7 7h10v10" title="Open" size={14} />
              </span>
              <p id="kpi-month-label" className="d4-kpi__label">
                Net worth ↗ (this month)
              </p>
              <p className="d4-kpi__num d4-num">$76,314</p>
              <p className="d4-kpi__delta">
                <span className="d4-kpi__glyph" aria-hidden>
                  ▼
                </span>
                -18.4% from previous month
              </p>
            </article>

            {/* DIVIDENDS */}
            <article className="d4-kpi" aria-labelledby="kpi-div-label">
              <p id="kpi-div-label" className="d4-kpi__label">
                Dividends
              </p>
              <p className="d4-kpi__num d4-num">$4,212</p>
              <p className="d4-kpi__delta d4-kpi__delta--up">
                <span className="d4-kpi__glyph" aria-hidden>
                  ▲
                </span>
                +6.1%
              </p>
            </article>

            {/* CASH */}
            <article className="d4-kpi" aria-labelledby="kpi-cash-label">
              <p id="kpi-cash-label" className="d4-kpi__label">
                Cash
              </p>
              <p className="d4-kpi__num d4-num">$12,890</p>
              <p className="d4-kpi__delta d4-kpi__delta--flat">
                <span className="d4-kpi__glyph" aria-hidden>
                  ▬
                </span>
                +0.0%
              </p>
            </article>
          </div>

          {/* ─── Dense holdings table ────────────────────────────────── */}
          <div className="d4-table-panel">
            <div className="d4-table-head">
              <h3 className="d4-table-head__title">Holdings</h3>
              <div className="d4-table-head__filters" role="toolbar" aria-label="Holdings filters">
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    className={
                      chip.active ? 'd4-filter-chip d4-filter-chip--active' : 'd4-filter-chip'
                    }
                    aria-pressed={chip.active}
                  >
                    {chip.active ? <span className="d4-filter-chip__dot" aria-hidden /> : null}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <table className="d4-table" aria-label="Portfolio holdings">
              <thead>
                <tr>
                  <th scope="col">Ticker</th>
                  <th scope="col">Name</th>
                  <th scope="col" className="d4-table__num">
                    Qty
                  </th>
                  <th scope="col" className="d4-table__num">
                    Last
                  </th>
                  <th scope="col" className="d4-table__num">
                    Value
                  </th>
                  <th scope="col" className="d4-table__num">
                    24h
                  </th>
                  <th scope="col" className="d4-table__num">
                    Alloc
                  </th>
                </tr>
              </thead>
              <tbody>
                {HOLDINGS.map((h) => (
                  <tr
                    key={h.ticker}
                    className={h.active ? 'd4-table__row--active' : undefined}
                    aria-current={h.active ? 'true' : undefined}
                  >
                    <td>
                      <span className="d4-ticker">{h.ticker}</span>
                    </td>
                    <td className="d4-table__name">{h.name}</td>
                    <td className="d4-table__num">{h.qty}</td>
                    <td className="d4-table__num">{h.last}</td>
                    <td className="d4-table__num">{h.value}</td>
                    <td
                      className={
                        h.deltaDirection === 'up'
                          ? 'd4-table__num d4-table__num--up'
                          : 'd4-table__num d4-table__num--down'
                      }
                    >
                      <span aria-hidden>{h.deltaDirection === 'up' ? '▲ ' : '▼ '}</span>
                      {h.delta}
                    </td>
                    <td className="d4-table__alloc">
                      <AllocDots level={h.alloc} />
                    </td>
                  </tr>
                ))}
                <tr className="d4-table__row--more">
                  <td colSpan={7}>… 14 more rows · press ↓ to navigate</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ─── 3-col data grid ─────────────────────────────────────── */}
          <div className="d4-grid">
            {/* Performance, monthly — BarVisx (hatched + 1 lime + purple tooltip) */}
            <article className="d4-panel" aria-labelledby="d4-panel-perf">
              <header className="d4-panel__head">
                <h3 className="d4-panel__title" id="d4-panel-perf">
                  <Icon d="M3 3v18h18M7 14l4-4 3 3 5-6" title="Performance" size={14} />
                  <span>Performance, monthly</span>
                </h3>
                <span className="d4-kbd" aria-hidden>
                  ⌘P
                </span>
              </header>
              <div className="d4-panel__body">
                <BarVisx payload={BAR_DRIFT_FIXTURE} width={360} height={200} />
              </div>
              <p className="d4-panel__caption">
                <span>Apr · drift</span>
                <span className="d4-num">+12.8%</span>
              </p>
            </article>

            {/* Activity heatmap (calendar grid, lime saturation gradient) */}
            <article className="d4-panel" aria-labelledby="d4-panel-act">
              <header className="d4-panel__head">
                <h3 className="d4-panel__title" id="d4-panel-act">
                  <Icon d="M3 5h18v16H3zM8 3v4M16 3v4M3 10h18" title="Activity" size={14} />
                  <span>Activity</span>
                </h3>
                <span className="d4-kbd" aria-hidden>
                  ⌘A
                </span>
              </header>
              <div className="d4-panel__body">
                <div
                  className="d4-heatmap"
                  role="img"
                  aria-label="Activity over the last 5 weeks, peak intensity in week 3 mid-week"
                >
                  <span aria-hidden />
                  {HEATMAP_DAY_LABELS.map((d, i) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: static label
                      key={`col-${i}`}
                      className="d4-heatmap__collabel"
                    >
                      {d}
                    </span>
                  ))}
                  {HEATMAP_ROWS.map((row, rIdx) => (
                    <RowFragment
                      key={HEATMAP_ROW_LABELS[rIdx]}
                      row={row}
                      label={HEATMAP_ROW_LABELS[rIdx]}
                      rowIdx={rIdx}
                    />
                  ))}
                </div>
              </div>
              <p className="d4-panel__caption">
                <span>Peak: Apr 18</span>
                <span className="d4-num">5w</span>
              </p>
            </article>

            {/* NVDA 3-month sparkline */}
            <article className="d4-panel" aria-labelledby="d4-panel-spark">
              <header className="d4-panel__head">
                <h3 className="d4-panel__title" id="d4-panel-spark">
                  <span className="d4-ticker">NVDA</span>
                  <span>· 3-month</span>
                </h3>
                <span className="d4-spark__price">
                  <span className="d4-spark__num">$876.50</span>
                  <span className="d4-spark__delta">+38.4%</span>
                </span>
              </header>
              <div className="d4-panel__body">
                <NvdaSparkline />
              </div>
              <p className="d4-panel__caption">
                <span className="d4-spark__legend">
                  <span>
                    <span className="d4-spark__swatch d4-spark__swatch--lime" aria-hidden />
                    price
                  </span>
                  <span>
                    <span className="d4-spark__swatch d4-spark__swatch--purple" aria-hidden />
                    cost basis
                  </span>
                </span>
                <span className="d4-num">$634.10 basis</span>
              </p>
            </article>
          </div>

          {/* ─── Lane-A regulatory disclosure (16px floor) ───────────── */}
          <p className="d4-disclosure">Read-only. No advice. No trading.</p>

          {/* ─── ⌘K palette overlay — rendered VISIBLE in the comp ────
           * NOT a hidden modal. Sits over the dashboard surface with
           * a scrim so PO can see the AI mode without interaction.
           */}
          <div className="d4-palette-scrim" aria-hidden />
          <dialog className="d4-palette" aria-label="Command palette" open>
            <div className="d4-palette__input">
              <span className="d4-palette__caret" aria-hidden>
                {'>'}
              </span>
              <span className="d4-palette__query">Why is my portfolio down today?</span>
              <span className="d4-palette__cursor" aria-hidden />
              <span className="d4-kbd">esc</span>
            </div>
            {/* Streaming AI answer — Inter for prose, mono ONLY on
             * tickers and deltas (allow-list). */}
            <div className="d4-palette__answer">
              <p className="d4-palette__streaming">
                <span className="d4-palette__streaming-dot" aria-hidden />
                Provedo · streaming
              </p>
              <p className="d4-palette__answer-body">
                <span className="d4-ticker">AAPL</span>{' '}
                <span className="d4-num--down">▼ -2.1%</span> drove $874 of the $1,202 drawdown. The{' '}
                <span className="d4-ticker">S&amp;P 500</span> is{' '}
                <span className="d4-num--down">▼ -0.8%</span>, so this is mostly idiosyncratic, not
                market.
              </p>
            </div>
            <p className="d4-palette__section">More actions</p>
            <ul className="d4-palette__results">
              {PALETTE_RESULTS.map((r) => (
                <li
                  key={r.label}
                  className={
                    r.active ? 'd4-palette__row d4-palette__row--active' : 'd4-palette__row'
                  }
                >
                  <span className="d4-palette__row-icon" aria-hidden>
                    <Icon d={r.iconPath} title={r.label} size={12} />
                  </span>
                  <span className="d4-palette__row-label">{r.label}</span>
                  <span className="d4-palette__row-meta">{r.meta}</span>
                  <span className="d4-palette__row-kbd">
                    <span className="d4-kbd">{r.kbd}</span>
                  </span>
                </li>
              ))}
            </ul>
          </dialog>
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
  row,
  label,
  rowIdx,
}: {
  row: ReadonlyArray<number>;
  label: string;
  rowIdx: number;
}) {
  return (
    <>
      <span className="d4-heatmap__rowlabel">{label}</span>
      {row.map((level, dayIdx) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static fixture
          key={`r${rowIdx}-d${dayIdx}`}
          className="d4-heatmap__cell"
          data-level={level}
          aria-label={`${label} day ${dayIdx + 1} intensity ${level}`}
        />
      ))}
    </>
  );
}
