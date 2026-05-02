import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-r3` — «POSITION».
 *
 * Power-user / terminal stance per `R3-power-user-terminal.md`.
 * Linear × Raycast × Vercel × Bloomberg-spirit. Density is the trust
 * signal — the page reads like the actual product, not a stock landing.
 *
 * Hard rules wired:
 *   - Hero shows REAL product fragment (sidebar nav + dense holdings
 *     table + ⌘K palette bar at top + AI gutter card at bottom-right)
 *     within the first 820px. Marketing copy sits ABOVE it as a status
 *     bar. The terminal IS the hero.
 *   - All money / percentages / dates / tickers / kbd-chips render in
 *     Geist Mono via `.r3-num` + table cells (tabular numerals,
 *     `--r3-text-primary` AAA 16.8:1 — defining choice).
 *   - ⌘K palette bar persistent at top of product fragment.
 *   - AI gutter card with byline `PROVEDO AI · 2026-05-01 14:07 UTC ·
 *     NOT ADVICE`, hairline left border.
 *   - One BarVisx embedded as inline panel («P&L · 30D») inside
 *     product fragment, neutral series + accent-signal highlight.
 *   - Regulatory strip at bottom: 16px `--r3-text-primary` (NOT muted).
 *   - Up/down semantics always paired with ▲/▼ glyph — never colour
 *     alone.
 *   - Zero decorative ephemera. No gradients. No grain. No rounded
 *     corners > 12px on cards.
 */

const HERO_HEADLINE = 'A portfolio terminal for people who already know what cost-basis means.';
const HERO_SUB = 'Dense, monospaced, keyboard-driven. Connect a broker, open ⌘K, see your book.';

const PALETTE_HINT = 'Search positions, run commands, ask AI…';

const HOLDINGS = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    qty: '12.0',
    price: '$182.40',
    deltaPct: '+1.79%',
    value: '$2,188.80',
    direction: 'up' as const,
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp',
    qty: '8.0',
    price: '$410.10',
    deltaPct: '−0.42%',
    value: '$3,280.80',
    direction: 'down' as const,
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp',
    qty: '4.0',
    price: '$902.55',
    deltaPct: '+3.10%',
    value: '$3,610.20',
    direction: 'up' as const,
  },
  {
    ticker: 'GOOG',
    name: 'Alphabet Inc. C',
    qty: '6.0',
    price: '$172.85',
    deltaPct: '+0.94%',
    value: '$1,037.10',
    direction: 'up' as const,
  },
  {
    ticker: 'KO',
    name: 'Coca-Cola Co',
    qty: '40.0',
    price: '$62.18',
    deltaPct: '−0.18%',
    value: '$2,487.20',
    direction: 'down' as const,
  },
];

type Holding = (typeof HOLDINGS)[number];

const SIDEBAR_ITEMS: ReadonlyArray<{
  label: string;
  count?: string;
  active?: boolean;
}> = [
  { label: 'Positions', count: '47', active: true },
  { label: 'Holdings', count: '14' },
  { label: 'Dividends', count: '12' },
  { label: 'Drift', count: '2' },
  { label: 'FX' },
  { label: 'Brokers', count: '3' },
  { label: 'AI ask' },
  { label: 'Settings' },
];

function DeltaCell({ pct, direction }: { pct: string; direction: Holding['direction'] }) {
  const cls = direction === 'up' ? 'r3-delta r3-delta--up' : 'r3-delta r3-delta--down';
  const glyph = direction === 'up' ? '▲' : '▼';
  return (
    <span className={cls}>
      <span className="r3-delta__glyph" aria-hidden>
        {glyph}
      </span>
      <span>{pct}</span>
    </span>
  );
}

export default function StyleR3Page() {
  return (
    <div style={{ background: 'var(--r3-canvas)', minHeight: '100vh' }}>
      {/* ─── Top app nav (56px, hairline bottom) ─────────────────────── */}
      <header className="r3-nav" aria-label="Provedo top nav">
        <span className="r3-nav__brand">provedo</span>
        <nav className="r3-nav__links" aria-label="Primary">
          <a href="#docs">docs</a>
          <a href="#login">log in</a>
          <span className="r3-kbd-group" aria-hidden>
            <span className="r3-kbd">⌘</span>
            <span className="r3-kbd">K</span>
          </span>
        </nav>
      </header>

      {/* ─── Hero strip — status label + headline + sub + CTAs ────────── */}
      <section
        aria-labelledby="hero-heading"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(28px, 4vw, 48px) clamp(20px, 3vw, 32px) clamp(20px, 3vw, 28px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(14px, 1.6vw, 20px)',
          }}
        >
          <p className="r3-status" aria-label="Position status">
            <span>POSITION</span>
            <span className="r3-status__caret" aria-hidden />
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              alignItems: 'end',
              gap: 'clamp(20px, 4vw, 56px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h1 id="hero-heading" className="r3-headline">
                {HERO_HEADLINE}
              </h1>
              <p className="r3-sub">{HERO_SUB}</p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <a href="#palette" className="r3-cta">
                <span className="r3-kbd-group" aria-hidden>
                  <span className="r3-kbd">⌘</span>
                  <span className="r3-kbd">K</span>
                </span>
                <span>open palette</span>
              </a>
              <a href="#connect" className="r3-link">
                connect a broker →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEFINING SURFACE — real product fragment ────────────────── */}
      <section
        aria-label="Provedo terminal preview"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(20px, 3vw, 32px) clamp(40px, 6vw, 64px)',
        }}
      >
        <div className="r3-frame">
          {/* ⌘K command palette bar — persistent top affordance */}
          <div className="r3-palette" aria-label="Command palette preview">
            <div className="r3-palette__left">
              <span className="r3-kbd-group" aria-hidden>
                <span className="r3-kbd">⌘</span>
                <span className="r3-kbd">K</span>
              </span>
              <span className="r3-palette__hint">{PALETTE_HINT}</span>
              <span className="r3-palette__caret" aria-hidden />
            </div>
            <div className="r3-palette__right">
              <span className="r3-kbd-group" aria-hidden>
                <span className="r3-kbd">⌘</span>
                <span className="r3-kbd">⇧</span>
                <span className="r3-kbd">P</span>
              </span>
            </div>
          </div>

          <div className="r3-frame__grid">
            {/* Sidebar — left rail with per-section counts */}
            <aside className="r3-side" aria-label="Workspace navigation">
              <p className="r3-side__group">Workspace</p>
              {SIDEBAR_ITEMS.slice(0, 6).map((item) => (
                <a
                  key={item.label}
                  href={`#${item.label.toLowerCase()}`}
                  className={item.active ? 'r3-side__item r3-side__item--active' : 'r3-side__item'}
                  aria-current={item.active ? 'page' : undefined}
                >
                  <svg
                    className="r3-side__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-hidden="true"
                  >
                    <title>Workspace</title>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  <span>{item.label}</span>
                  {item.count ? <span className="r3-side__count">{item.count}</span> : null}
                </a>
              ))}
              <p className="r3-side__group" style={{ marginTop: 8 }}>
                Tools
              </p>
              {SIDEBAR_ITEMS.slice(6).map((item) => (
                <a
                  key={item.label}
                  href={`#${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  className="r3-side__item"
                >
                  <svg
                    className="r3-side__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-hidden="true"
                  >
                    <title>Tool</title>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>{item.label}</span>
                </a>
              ))}
            </aside>

            {/* Main pane: pane head + holdings table + chart panel + AI */}
            <div className="r3-main">
              <div className="r3-pane-head">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'var(--r3-font-sans)',
                      fontWeight: 500,
                      fontSize: 14,
                      color: 'var(--r3-text-primary)',
                    }}
                  >
                    Holdings
                  </span>
                  <span className="r3-eyebrow">5 OF 47 · UPDATED 14:02 UTC</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span
                    className="r3-eyebrow"
                    style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline' }}
                  >
                    <span className="r3-dot r3-dot--up" aria-hidden />
                    SCHWAB · LIVE
                  </span>
                  <span
                    className="r3-eyebrow"
                    style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline' }}
                  >
                    <span className="r3-dot r3-dot--up" aria-hidden />
                    IBKR · LIVE
                  </span>
                </div>
              </div>

              <table className="r3-table" aria-label="Holdings, top 5 of 47">
                <thead>
                  <tr>
                    <th scope="col">Ticker</th>
                    <th scope="col">Name</th>
                    <th scope="col" className="r3-table__num">
                      Qty
                    </th>
                    <th scope="col" className="r3-table__num">
                      Price
                    </th>
                    <th scope="col" className="r3-table__num">
                      Δ today
                    </th>
                    <th scope="col" className="r3-table__num">
                      Mkt value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {HOLDINGS.map((h) => (
                    <tr key={h.ticker}>
                      <td className="r3-table__ticker">{h.ticker}</td>
                      <td className="r3-table__name">{h.name}</td>
                      <td className="r3-table__num">{h.qty}</td>
                      <td className="r3-table__num">{h.price}</td>
                      <td className="r3-table__num">
                        <DeltaCell pct={h.deltaPct} direction={h.direction} />
                      </td>
                      <td className="r3-table__num">{h.value}</td>
                    </tr>
                  ))}
                  <tr className="r3-table__row--total">
                    <td className="r3-table__name" colSpan={4}>
                      Total · 5 shown
                    </td>
                    <td className="r3-table__num">
                      <DeltaCell pct="+1.41%" direction="up" />
                    </td>
                    <td className="r3-table__num">$12,604.10</td>
                  </tr>
                </tbody>
              </table>

              {/* Inline chart panel — P&L · 30D */}
              <div className="r3-chart-panel">
                <div className="r3-chart-panel__head">
                  <h3 className="r3-chart-panel__title">P&amp;L · 30D</h3>
                  <span className="r3-chart-panel__delta">
                    <span className="r3-num r3-num--display">+$8,402.16</span>
                    <DeltaCell pct="+4.81%" direction="up" />
                  </span>
                </div>
                <div className="r3-chart-panel__chart">
                  <BarVisx payload={BAR_DRIFT_FIXTURE} width={680} height={140} />
                </div>
                <p className="r3-chart-panel__caption">P&amp;L · 30D · UPDATED 14:02 UTC</p>
              </div>

              {/* AI gutter card — bottom-right of main pane */}
              <aside className="r3-ai" aria-label="Provedo AI insight">
                <span className="r3-ai__byline">
                  ─── PROVEDO AI · 2026-05-01 14:07 UTC · NOT ADVICE ───
                </span>
                <p className="r3-ai__body">
                  <span className="r3-num">AAPL</span> is now <span className="r3-num">41%</span> of
                  book (target <span className="r3-num">25%</span>). The data shows a{' '}
                  <span className="r3-num">+16pp</span> drift on this position alone — the largest
                  single-name concentration in the workspace.
                  <span className="r3-ai__cite" aria-label="Cited row">
                    POS-AAPL-001
                  </span>
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Below-the-fold supporting detail ────────────────────────── */}
      <section
        aria-label="Capabilities"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(20px, 3vw, 32px) clamp(48px, 6vw, 80px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <div className="r3-card">
            <p className="r3-card__label">⌘ Keyboard-first</p>
            <p className="r3-card__title">
              Run any command in <span className="r3-num">&lt;120ms</span>
            </p>
            <p className="r3-card__body">
              Open the palette, type the first letters, hit return. No clicks, no menus, no «are you
              sure» modals. Same shortcuts as your editor.
            </p>
          </div>

          <div className="r3-card">
            <p className="r3-card__label">📐 Multi-broker reconcile</p>
            <p className="r3-card__title">
              <span className="r3-num">3</span> brokers · one book
            </p>
            <p className="r3-card__body">
              Schwab · IBKR · Fidelity reconciled nightly. Differences greater than{' '}
              <span className="r3-num">0.5%</span> are flagged in the drift panel with the source
              broker's snapshot timestamp.
            </p>
          </div>

          <div className="r3-card">
            <p className="r3-card__label">∮ AI as command</p>
            <p className="r3-card__title">
              Ask in <span className="r3-num">⌘K</span> — answer with citations
            </p>
            <p className="r3-card__body">
              No chat sidebar, no friendly avatar. Ask «what was my Q1 win actually from?» and the
              answer arrives inline with linked positions and a non-prescriptive byline.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Regulatory disclosure strip — 16px text-primary, NOT muted */}
      <section
        aria-label="Regulatory disclosure"
        style={{
          borderTop: '1px solid var(--r3-rule)',
          background: 'var(--r3-canvas)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: 'clamp(28px, 4vw, 48px) clamp(20px, 3vw, 32px) clamp(20px, 3vw, 28px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <p className="r3-reg">
            Provedo is a read-only multi-broker portfolio terminal. We do not execute trades and we
            do not provide investment advice. Figures are sourced from your broker's posted close —
            verify against your statement of record.
          </p>
          <div className="r3-foot">
            <span>provedo · est. 2026 · v2026.05.01</span>
            <span>REG · PRV-2026-R3-α</span>
          </div>
        </div>
      </section>
    </div>
  );
}
