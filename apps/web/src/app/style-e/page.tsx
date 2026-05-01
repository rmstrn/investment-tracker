import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-e` — Pasted Ledger.
 *
 * Mini-landing for visual evaluation. Layout per
 * `.superpowers/brainstorm/2026-05-01-fresh-start/E-cut-paste.md`:
 *
 *   - mid-word font collage on hero headline (Anton + Old Standard + Special Elite)
 *   - faux-binder-clip + faux-staples + hand-stamped page numbers + date-stamps
 *   - AI voice rendered as a yellow Post-it (Special Elite typewriter)
 *   - one BarVisx wrapped in cut-paper edge frame with washi-tape corners
 *   - pull-quote in cut-paper frame with tape-corners
 *   - footer with hand-stamped «next issue» + reg-code in Special Elite
 *
 * Trust guardrail 1: clash + rotation NEVER touch money numerals
 * (`.e-num` stays Plex Mono tabular dead-clean).
 */

const SUBLINE =
  'every position, every dividend, every drift — filed and dated. across all your brokers.';
const PULL_QUOTE = 'every dividend dated. every drift noted. nothing prescribed.';

export default function StyleEPage() {
  return (
    <div style={{ background: 'var(--e-bone)', minHeight: '100vh' }}>
      {/* ─── Mast-head ─────────────────────────────────────────── */}
      <header className="e-mast">
        <span>PROVEDO QUARTERLY · VOL 1 · ISSUE 04</span>
        <span style={{ color: 'var(--e-toner-2)' }}>FRIDAY · 1 MAY 2026</span>
        <span className="e-stamp-page">№ 042</span>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(64px, 9vw, 120px) clamp(24px, 4vw, 48px) 64px',
          position: 'relative',
        }}
      >
        {/* Faux-binder-clip anchoring the page */}
        <span className="e-clip" aria-hidden />

        {/* Date-stamp overlay */}
        <span
          className="e-date-stamp"
          style={{
            position: 'absolute',
            top: 28,
            left: 'clamp(24px, 4vw, 48px)',
          }}
        >
          received 30 apr 2026
        </span>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
            gap: 'clamp(28px, 4vw, 56px)',
            alignItems: 'start',
            marginTop: 64,
          }}
        >
          <div>
            {/* Mid-word collage headline */}
            <h1
              className="e-headline"
              style={{
                fontSize: 'clamp(56px, 9.4vw, 144px)',
              }}
            >
              <span
                className="f-anton"
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-1deg)',
                  marginRight: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.01em',
                }}
              >
                your money,
              </span>
              <br />
              <span
                className="f-old"
                style={{
                  display: 'inline-block',
                  fontStyle: 'italic',
                  transform: 'rotate(0.8deg)',
                  marginRight: 6,
                  fontWeight: 400,
                }}
              >
                on the
              </span>{' '}
              <span
                className="f-elite"
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-0.6deg)',
                  color: 'var(--e-red)',
                }}
              >
                record.
              </span>
            </h1>

            <p className="e-body" style={{ marginTop: 28, maxWidth: '52ch', fontSize: 17 }}>
              <span className="e-highlight">{SUBLINE}</span>
            </p>

            <div
              style={{
                marginTop: 32,
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button type="button" className="e-cta">
                open your edition →
              </button>
              <span className="e-sharpie">see for yourself ↘</span>
            </div>

            {/* Pull-quote in cut-paper frame with tape corners */}
            <div className="e-pullquote-wrap" style={{ marginTop: 56, position: 'relative' }}>
              <span className="e-tape e-tape--tl" aria-hidden />
              <span className="e-tape e-tape--tr" aria-hidden />
              <blockquote className="e-pullquote">&ldquo;{PULL_QUOTE}&rdquo;</blockquote>
            </div>
          </div>

          {/* Right rail — chart + sticky-note */}
          <aside style={{ position: 'relative' }}>
            <div className="e-cut-frame" style={{ position: 'relative' }}>
              <span className="e-staple e-staple--tl" aria-hidden />
              <span className="e-staple e-staple--tr" aria-hidden />
              <span className="e-tape e-tape--tl" aria-hidden />
              <span className="e-tape e-tape--tr" aria-hidden />

              <p
                style={{
                  fontFamily: 'var(--e-font-elite)',
                  fontSize: 13,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--e-toner-2)',
                  marginBottom: 4,
                }}
              >
                FIG. 1 · ALLOCATION DRIFT
              </p>
              <p
                style={{
                  fontFamily: 'var(--e-font-elite)',
                  fontSize: 11,
                  letterSpacing: '0.10em',
                  color: 'var(--e-toner-1)',
                  marginBottom: 14,
                }}
              >
                top 5 holdings · % of book
              </p>

              <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={240} />

              <p
                style={{
                  fontFamily: 'var(--e-font-elite)',
                  fontSize: 11,
                  color: 'var(--e-toner-2)',
                  marginTop: 14,
                  borderTop: '1px dashed var(--e-toner-1)',
                  paddingTop: 8,
                }}
              >
                fig. 1 — % of NAV. source: provedo. data: 1 may 2026 09:42 ET.
              </p>
            </div>

            {/* Sticky-note pasted onto live data */}
            <div
              style={{
                position: 'relative',
                marginTop: -28,
                marginLeft: 24,
                zIndex: 2,
              }}
            >
              <div className="e-sticky" role="note">
                p.s. nvda is now <span className="e-num">31%</span> of book. up from{' '}
                <span className="e-num">18%</span> at q3 close.
                <span className="e-sticky__signoff">— the editor · 2026-05-01 14:32 ET</span>
              </div>
            </div>

            {/* Tabular live numbers — CLEAN per guardrail 1 */}
            <div
              style={{
                marginTop: 36,
                padding: '20px 24px',
                background: 'var(--e-bone)',
                border: '1px dashed var(--e-toner-1)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--e-font-elite)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--e-toner-2)',
                  marginBottom: 8,
                }}
              >
                today&rsquo;s reading
              </p>
              <p
                className="e-num"
                style={{
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  lineHeight: 1,
                  color: 'var(--e-ink)',
                }}
              >
                $147,230
              </p>
              <p
                className="e-num"
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: 'var(--e-toner-2)',
                }}
              >
                +2.3% wk-over-wk
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '2px solid var(--e-ink)',
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
            alignItems: 'center',
          }}
        >
          <div>
            <span className="e-date-stamp">next issue · 2026-05-08</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--e-font-elite)',
              fontSize: 12,
              letterSpacing: '0.12em',
              color: 'var(--e-toner-2)',
              textAlign: 'center',
            }}
          >
            the evening wire · filed at close · weekday evenings only
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="e-stamp-page" style={{ fontSize: 18, color: 'var(--e-stamp-blue)' }}>
              № 042 · 2026.05.01
            </span>
            <p
              style={{
                fontFamily: 'var(--e-font-elite)',
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--e-toner-1)',
                marginTop: 6,
                textTransform: 'uppercase',
              }}
            >
              REG · PRV-2026-042-α · style e
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
