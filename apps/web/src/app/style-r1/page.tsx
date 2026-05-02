import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-r1` — «The Ledger Quarterly».
 *
 * Editorial / type-led broadsheet stance per `R1-editorial-type-led.md`.
 * The page reads like a Saturday FT Money lift-out: masthead strip, hairline
 * rules instead of cards, drop-cap lead, vermilion-ruled pull-quote, right-
 * rail TODAY panel on verso paper, footnoted disclosure strip.
 *
 * Hard rules wired:
 *   - All money numerals via `.r1-figure` (JetBrains Mono tabular,
 *     `--r1-ink-figure` AAA 17.6:1 on recto).
 *   - No box-shadows, no card borders. Hairline rules + paper-stock shifts
 *     carry every section break.
 *   - No rounded corners on the CTA — it is a 1px ink rule + arrow.
 *   - One BarVisx, embedded inside the verso TODAY panel as a sparkline.
 */

const MAST_DATELINE = 'Friday · 1 May 2026';
const MAST_VOLUME = 'Vol. I · Issue 04';
const MAST_PAGE = 'p. 01 — Lead';

const HEADLINE = 'Your portfolio, set in type that takes it seriously.';
const LEAD =
  'One ledger across every broker. Dated, footnoted, never prescribed. Read what your money did this week — in the voice of a wire-service columnist.';

const PULL_QUOTE_PROSE_BEFORE = 'Of your Q1 gain of ';
const PULL_QUOTE_PROSE_AFTER =
  ', approximately 71% is attributable to USD/EUR movement — not to security selection. The remaining 29% came almost entirely from a single position.';

export default function StyleR1Page() {
  return (
    <div style={{ background: 'var(--r1-paper-recto)', minHeight: '100vh' }}>
      {/* ─── Masthead strip ─────────────────────────────────────────── */}
      <header className="r1-mast-strip" aria-label="Provedo Quarterly masthead">
        <span className="r1-mast-strip__brand">Provedo Quarterly</span>
        <span className="r1-mast-strip__meta">
          <span>{MAST_VOLUME}</span>
          <span>{MAST_DATELINE}</span>
          <span>{MAST_PAGE}</span>
        </span>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'clamp(40px, 6vw, 88px) clamp(24px, 5vw, 64px) 64px',
        }}
      >
        <p className="r1-eyebrow" style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>
          ── The Lead · 1 May 2026 ──
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'start',
          }}
        >
          {/* ─── Left: editorial column ─────────────────────────── */}
          <div>
            <h1 className="r1-display">{HEADLINE}</h1>

            <hr className="r1-rule" style={{ margin: '32px 0 28px' }} />

            <p className="r1-lead">{LEAD}</p>

            <div
              style={{
                marginTop: 40,
                display: 'flex',
                gap: 28,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button type="button" className="r1-cta">
                Open the ledger
                <span className="r1-cta__arrow" aria-hidden>
                  →
                </span>
              </button>
              <a href="#sample" className="r1-sublink">
                Read the sample edition — no broker required.
              </a>
            </div>

            {/* ─── Pull-quote with vermilion left-rule ──────────── */}
            <blockquote className="r1-pull-quote" style={{ marginTop: 'clamp(56px, 8vw, 96px)' }}>
              «{PULL_QUOTE_PROSE_BEFORE}
              <span className="r1-figure r1-figure--inline">$11,402</span>
              {PULL_QUOTE_PROSE_AFTER}»
              <span className="r1-pull-quote__cite">
                — by the desk · 1 May 2026 · method
                <span className="r1-disclosure__marker">2</span>
              </span>
            </blockquote>

            {/* ─── Inline AI insight column (no chrome) ─────────── */}
            <section style={{ marginTop: 'clamp(56px, 7vw, 80px)' }}>
              <p className="r1-eyebrow" style={{ marginBottom: 16 }}>
                — Asked · 1 May 14:02
              </p>
              <p className="r1-insight">
                You asked whether your dividend yield has improved. It has, slightly:
                trailing-twelve-month yield is now{' '}
                <span className="r1-figure r1-figure--inline">2.84%</span>, versus{' '}
                <span className="r1-figure r1-figure--inline">2.61%</span> a quarter ago. The change
                is mostly because MSFT raised its quarterly distribution in March.
              </p>
              <p className="r1-byline r1-byline--ai" style={{ marginTop: 14 }}>
                — by the desk · 1 May 2026
              </p>
            </section>
          </div>

          {/* ─── Right rail: TODAY panel on verso paper ─────────── */}
          <aside className="r1-today" id="today" aria-label="Today's reading">
            <p className="r1-eyebrow" style={{ color: 'var(--r1-ink-figure)' }}>
              Today
            </p>

            <div>
              <div className="r1-figure r1-figure--display">$124,308.92</div>
              <p className="r1-byline" style={{ marginTop: 8, letterSpacing: '0.14em' }}>
                Portfolio of record · 09:42 ET
              </p>
            </div>

            <hr className="r1-today__baseline" />

            <div className="r1-today__delta">
              <span className="r1-today__delta-glyph" aria-hidden>
                ▲
              </span>
              <span className="r1-figure" style={{ fontSize: 20 }}>
                +$4,921.40
              </span>
              <span className="r1-figure" style={{ fontSize: 14, color: 'var(--r1-ink-rule)' }}>
                +4.12%
              </span>
            </div>

            <div className="r1-today__chart">
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={320} height={180} />
            </div>

            <p className="r1-today__caption">plate i — value, 5d</p>

            <hr className="r1-today__baseline" />

            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <li className="r1-byline" style={{ letterSpacing: '0.1em' }}>
                Last dividend ·{' '}
                <span className="r1-figure" style={{ fontSize: 12 }}>
                  $84.20
                </span>{' '}
                · MSFT
              </li>
              <li className="r1-byline" style={{ letterSpacing: '0.1em' }}>
                Next ex-date · 14 May · AAPL
              </li>
              <li className="r1-byline" style={{ letterSpacing: '0.1em' }}>
                Drift · within ±2pp · no action
              </li>
            </ul>
          </aside>
        </div>

        {/* ─── Folio (page-foot wayfinding) ────────────────────────── */}
        <div className="r1-folio" style={{ marginTop: 'clamp(72px, 10vw, 120px)' }}>
          <span>p. 01 — Lead</span>
          <span>continued on p. 02 →</span>
        </div>
      </main>

      {/* ─── Disclosure strip — footnoted, not modal ──────────────── */}
      <footer
        style={{
          borderTop: '2px solid var(--r1-ink-figure)',
          padding: 'clamp(28px, 4vw, 48px) clamp(24px, 5vw, 64px)',
          marginTop: 32,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
          }}
        >
          <p className="r1-disclosure">
            <span className="r1-disclosure__marker">1</span>
            FX figures sourced from your broker's posted close. Provedo does not execute trades.
          </p>
          <p className="r1-disclosure">
            <span className="r1-disclosure__marker">2</span>
            Method: USD/EUR contribution computed against your reported cost-basis in account
            currency. Verify against your statement of record.
          </p>
          <p className="r1-disclosure">
            <span className="r1-disclosure__marker">3</span>
            Provedo does not provide investment advice. Past performance is not indicative of future
            results.
          </p>
        </div>

        <hr className="r1-rule" style={{ margin: '24px 0' }} />

        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span className="r1-eyebrow">Provedo · the ledger · est. 2026</span>
          <span className="r1-eyebrow" style={{ fontFamily: 'var(--r1-font-mono)' }}>
            REG · PRV-2026-R1-α
          </span>
        </div>
      </footer>
    </div>
  );
}
