import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-d` — Salmon Quarterly.
 *
 * Mini-landing for visual evaluation. Layout per
 * `.superpowers/brainstorm/2026-05-01-fresh-start/D-salmon-quarterly.md`:
 *
 *   - classical broadsheet mast-head (Source Serif 4 italic + Plex Mono meta)
 *   - hero as editorial column with handcrafted line break + drop-cap body
 *   - bylined editorial AI block (standfirst → byline → drop-cap → bullets)
 *   - right-rail pull-quote with hairline-Pelican-Red rules
 *   - one BarVisx with Pelican Red bars + Plex Mono tabular numerals (NO halo, NO clash)
 *   - footer with «in the next edition» + ISSN-style decorative number
 */

const HEADLINE_LINE_1 = 'your money,';
const HEADLINE_LINE_2 = 'on the record.';
const SUBLINE =
  'every position, every dividend, every drift — filed and dated. across all your brokers.';
const PULL_QUOTE = 'every dividend dated. every drift noted. nothing prescribed.';

export default function StyleDPage() {
  return (
    <div style={{ background: 'var(--d-paper)', minHeight: '100vh' }}>
      {/* ─── Mast-head ─────────────────────────────────────────── */}
      <header className="d-mast">
        <span className="d-mast__brand">Provedo&nbsp;Quarterly</span>
        <span className="d-mast__meta">
          PROVEDO QUARTERLY · VOL 1 · ISSUE 04 · TUESDAY 1 MAY 2026
        </span>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(48px, 7vw, 96px) clamp(24px, 4vw, 48px) 64px',
        }}
      >
        <p className="d-flag" style={{ marginBottom: 24 }}>
          COMMENTARY · PORTFOLIO REVIEW
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
            gap: 'clamp(28px, 4vw, 56px)',
            alignItems: 'start',
          }}
        >
          <div>
            <h1
              className="d-display d-typeset"
              style={{
                fontSize: 'clamp(48px, 7.4vw, 96px)',
                margin: 0,
                animationDelay: '60ms',
              }}
            >
              {HEADLINE_LINE_1}
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  color: 'var(--d-accent)',
                  fontWeight: 400,
                }}
              >
                {HEADLINE_LINE_2}
              </em>
            </h1>

            <p className="d-byline" style={{ marginTop: 24 }}>
              By Provedo Editorial · 1 May 2026 · 3 min read
            </p>

            <div className="d-rule" style={{ margin: '20px 0' }}>
              <span className="d-rule__bullet" />
            </div>

            <p className="d-standfirst" style={{ marginBottom: 18 }}>
              {SUBLINE}
            </p>

            <p className="d-body d-body--dropcap" style={{ marginTop: 12 }}>
              The dashboard your broker filed for you reads green at the top of the page. The book
              underneath does not. Two-thirds of the year-to-date number sits in a single position
              whose volatility runs at twice the rest of the holdings. Concentration, not skill, is
              doing the work — and the dashboard does not say so.
            </p>

            <ul
              style={{
                marginTop: 20,
                paddingLeft: 0,
                listStyle: 'none',
                fontFamily: 'var(--d-font-serif)',
                fontSize: 17,
                lineHeight: 1.6,
                color: 'var(--d-ink)',
              }}
            >
              <li style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--d-accent)', marginRight: 10 }}>—</span>
                concentration: <span className="d-num">64%</span> in MSFT alone
              </li>
              <li style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--d-accent)', marginRight: 10 }}>—</span>
                volatility-adjusted return: <span className="d-num">+6.1%</span> (not{' '}
                <span className="d-num">14.3%</span>)
              </li>
              <li>
                <span style={{ color: 'var(--d-accent)', marginRight: 10 }}>—</span>
                cash and bonds total <span className="d-num">24%</span> of book
              </li>
            </ul>

            <div
              style={{
                marginTop: 36,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button type="button" className="d-cta">
                open your edition →
              </button>
              <button type="button" className="d-cta d-cta--ghost">
                read a back issue
              </button>
            </div>
          </div>

          {/* Right rail — pull-quote + figure */}
          <aside style={{ position: 'relative' }}>
            <blockquote className="d-pull-quote">&ldquo;{PULL_QUOTE}&rdquo;</blockquote>

            <div className="d-card" style={{ marginTop: 32 }}>
              <p className="d-flag" style={{ marginBottom: 6 }}>
                FIG. 1 · ALLOCATION DRIFT
              </p>
              <p className="d-byline" style={{ marginBottom: 16, color: 'var(--d-ink-muted)' }}>
                top 5 holdings · % of NAV
              </p>
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={240} />
              <p className="d-figure-credit">
                Fig. 1 — allocation by sector, % of NAV. Source: provedo synth, data of 1 May 2026
                09:42 ET.
              </p>
            </div>
          </aside>
        </div>

        {/* ─── Editorial column (AI as bylined columnist) ─────────── */}
        <section
          style={{
            marginTop: 'clamp(64px, 10vw, 120px)',
            paddingTop: 32,
            borderTop: '1px solid var(--d-rule)',
          }}
        >
          <p className="d-flag" style={{ marginBottom: 8 }}>
            COMMENTARY
          </p>
          <h2 className="d-display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', margin: 0 }}>
            the dollar-cost myth, revisited.
          </h2>
          <p className="d-byline" style={{ marginTop: 12 }}>
            Filed by Provedo Editorial · 2 hours ago · 1 May 2026 14:32 ET
          </p>

          <div className="d-rule">
            <span className="d-rule__bullet" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(24px, 3vw, 40px)',
              marginTop: 16,
            }}
          >
            <p className="d-body d-body--dropcap">
              This morning the year-to-date return on the dashboard crossed
              <span className="d-num"> +14.3%</span>. Two-thirds of that gain sits in a single
              position. If the position corrects <span className="d-num">20%</span>, the book loses{' '}
              <span className="d-num">9%</span> — not the <span className="d-num">4%</span> the
              dashboard suggests.
            </p>
            <p className="d-body">
              The position quietly running the book is rarely the one written about most. NVDA cost
              basis on file: <span className="d-num">$114</span>, last close{' '}
              <span className="d-num">$487</span>, held nine months. The dividend page records every
              coupon. The drift page records every weight. Both are dated. Neither prescribes.
            </p>
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--d-ink)',
          padding: '28px clamp(24px, 4vw, 48px) 36px',
          marginTop: 80,
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <div>
            <p className="d-flag" style={{ marginBottom: 8 }}>
              IN THE NEXT EDITION →
            </p>
            <p className="d-body" style={{ fontSize: 15, lineHeight: 1.5 }}>
              Sector exposure · Tax-lot map · Liquidity ladder
            </p>
          </div>
          <div>
            <p className="d-flag" style={{ marginBottom: 8 }}>
              THE EVENING WIRE
            </p>
            <p className="d-body" style={{ fontSize: 15, lineHeight: 1.5 }}>
              Filed at close · weekday evenings only
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="d-byline" style={{ color: 'var(--d-ink-muted)', marginBottom: 4 }}>
              ISSN · 2049-PRV-Q · style d · salmon quarterly
            </p>
            <p className="d-byline" style={{ color: 'var(--d-ink-muted)' }}>
              edition 04 · 1 may 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
