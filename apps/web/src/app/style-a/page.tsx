import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-a` — Slow Ledger.
 *
 * Mini-landing for visual evaluation. Layout faithful to
 * `.superpowers/brainstorm/2026-05-01-fresh-start/A-quiet-editorial.md`:
 *
 *   - hardback masthead (edition / date / section rubric in Plex Mono)
 *   - asymmetric hero: Source Serif 4 display headline, hand-broken lines,
 *     hairline-bordered allocation card on the right
 *   - in-text italic CTA (NO button) with chevron-down
 *   - bylined editorial AI column (no chatbot UI)
 *   - chart sample restyled to clay-rose / brass / moss
 *   - colophon footer with edition note
 */

const ALLOCATION_ROWS = [
  { pct: 38, label: 'Equity', color: 'var(--clay-rose)' },
  { pct: 22, label: 'Real Estate', color: 'var(--brass-oxide)' },
  { pct: 18, label: 'Debt', color: 'var(--moss-green)' },
  { pct: 12, label: 'Cash', color: 'var(--umber-deep)' },
  { pct: 10, label: 'Alternative', color: 'var(--slate-fog)' },
] as const;

export default function StyleAPage() {
  return (
    <div style={{ background: 'var(--paper-cream)', minHeight: '100vh' }}>
      {/* ─── Masthead ───────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid var(--paper-edge)',
          padding: '20px clamp(24px, 4vw, 48px)',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <span className="a-rubric">Provedo · Issue No. 01</span>
          <span className="a-rubric" style={{ color: 'var(--ink-plum)' }}>
            Portfolio · Volume A
          </span>
          <span className="a-rubric">Friday, 1 May 2026</span>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(56px, 8vw, 120px) clamp(24px, 4vw, 48px) 64px',
        }}
      >
        <p className="a-rubric" style={{ marginBottom: 'clamp(48px, 8vw, 96px)' }}>
          Portfolio trackers, redone
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'start',
          }}
        >
          {/* Headline column */}
          <div>
            <h1
              className="a-display"
              style={{
                fontSize: 'clamp(44px, 6.4vw, 76px)',
                lineHeight: 1.04,
                margin: 0,
              }}
            >
              the dashboard
              <br />
              told you green.
              <br />
              that wasn&rsquo;t the
              <br />
              whole story.
            </h1>

            <p
              className="a-display"
              style={{
                fontStyle: 'italic',
                fontSize: 20,
                lineHeight: 1.55,
                color: 'var(--ink-soft)',
                marginTop: 32,
                maxWidth: `${38}ch`,
              }}
            >
              Provedo shows you the parts your broker app skips — concentration, currency drift, the
              position quietly running your book.
            </p>

            <p
              style={{
                marginTop: 40,
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 18,
                color: 'var(--ink-plum)',
              }}
            >
              <a className="a-italic-link" href="#read-on">
                show me my book
              </a>
              <span aria-hidden style={{ marginLeft: 8, color: 'var(--clay-rose)' }}>
                &darr;
              </span>
            </p>
          </div>

          {/* Allocation card */}
          <aside
            className="a-card"
            style={{
              padding: 'clamp(20px, 2.4vw, 32px)',
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 18,
              }}
            >
              <span className="a-rubric">Q2 Allocation</span>
              <span className="a-rubric" style={{ color: 'var(--brass-oxide)' }}>
                Snapshot
              </span>
            </div>
            <hr className="a-hairline" />

            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                marginTop: 18,
              }}
            >
              {ALLOCATION_ROWS.map((row) => (
                <li
                  key={row.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '14px 64px 1fr',
                    alignItems: 'baseline',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom: '1px solid var(--paper-edge)',
                    fontSize: 18,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: row.color,
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ color: 'var(--ink-plum)', fontWeight: 500 }}>{row.pct}%</span>
                  <span style={{ color: 'var(--ink-plum)' }}>{row.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* ─── AI editorial column ─────────────────────────────────── */}
        <section
          id="read-on"
          style={{
            marginTop: 'clamp(80px, 12vw, 160px)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'start',
          }}
        >
          <div>
            <p className="a-rubric">Column · From the desk</p>
            <p
              className="a-display"
              style={{
                fontSize: 13,
                fontStyle: 'italic',
                color: 'var(--ink-soft)',
                marginTop: 12,
              }}
            >
              by <span style={{ color: 'var(--brass-oxide)' }}>Provedo</span>
              <br />
              <span
                style={{
                  fontFamily: 'var(--font-rubric)',
                  fontStyle: 'normal',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                }}
              >
                AI co-author · 1 May
              </span>
            </p>
          </div>

          <div
            className="a-display"
            style={{
              fontSize: 22,
              lineHeight: 1.55,
              color: 'var(--ink-plum)',
              fontStyle: 'italic',
              maxWidth: `${60}ch`,
            }}
          >
            <span
              className="a-display"
              style={{
                float: 'left',
                fontSize: 64,
                lineHeight: 0.9,
                color: 'var(--brass-oxide)',
                marginRight: 8,
                marginTop: 4,
                fontStyle: 'normal',
              }}
              aria-hidden
            >
              Y
            </span>
            <span style={{ fontStyle: 'normal' }}>our</span> tech allocation drifted 4.2% above
            target this week — almost entirely from a single position. Rebalancing now would surface
            a <span style={{ color: 'var(--clay-rose)' }}>$3,180</span> short-term tax bill; waiting
            until October trims that to roughly{' '}
            <span style={{ color: 'var(--moss-green)' }}>$1,460</span>. The book can hold either
            way; what matters is the why.
          </div>
        </section>

        {/* ─── Chart sample ────────────────────────────────────────── */}
        <section
          style={{
            marginTop: 'clamp(80px, 12vw, 160px)',
            paddingTop: 32,
            borderTop: '1px solid var(--paper-edge)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 18,
            }}
          >
            <p className="a-rubric">Figure I · Allocation drift, top 5</p>
            <p className="a-rubric">Source · IBKR + Binance</p>
          </div>
          <hr className="a-hairline" />

          <div
            className="a-card"
            style={{
              marginTop: 24,
              padding: 'clamp(24px, 3vw, 40px)',
              maxWidth: 760,
            }}
          >
            <BarVisx payload={BAR_DRIFT_FIXTURE} width={680} height={260} />
          </div>
        </section>
      </main>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--paper-edge)',
          padding: '24px clamp(24px, 4vw, 48px)',
          marginTop: 80,
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span className="a-rubric">Style A · Slow Ledger</span>
          <span className="a-rubric">Page 1 of 1 · End of folio</span>
        </div>
      </footer>
    </div>
  );
}
