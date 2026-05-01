import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-c` — Pressroom Riso.
 *
 * Mini-landing for visual evaluation. Layout faithful to
 * `.superpowers/brainstorm/2026-05-01-fresh-start/C-daring.md`:
 *
 *   - 3-color spot-ink stripe + masthead with edition label
 *   - hero with misregister halo — every ink shape carries a 1-2px
 *     offset duplicate in a second ink at 30%; on hover offset → 0
 *   - pencil-Caveat marginalia overlaid on a real PnL number (AI voice)
 *   - chart sample with halo treatment around the wrapper
 *   - tabular Inter for money, broadside footer with ink legend
 */

export default function StyleCPage() {
  return (
    <div style={{ background: 'var(--c-paper)', minHeight: '100vh' }}>
      {/* ─── 3-color spot stripe ─────────────────────────────────── */}
      <div className="c-spot-stripe" aria-hidden>
        <span style={{ background: 'var(--c-ink-red)' }} />
        <span style={{ background: 'var(--c-ink-blue)' }} />
        <span style={{ background: 'var(--c-ink-yellow)' }} />
      </div>

      {/* ─── Masthead ───────────────────────────────────────────── */}
      <header style={{ padding: '14px clamp(24px, 4vw, 48px) 0' }}>
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
          <span className="c-eyebrow">Provedo &mdash; Issue No. 0042 &mdash; Vol. Portfolio</span>
          <span className="c-pencil c-pencil--red" style={{ fontSize: 20 }}>
            Market: volatile
          </span>
          <span className="c-eyebrow">Friday · 1 May 2026</span>
        </div>
        <hr className="c-masthead-rule" style={{ marginTop: 14 }} />
      </header>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(48px, 7vw, 96px) clamp(24px, 4vw, 48px) 64px',
        }}
      >
        <p className="c-eyebrow" style={{ marginBottom: 32, color: 'var(--c-ink-blue)' }}>
          Portfolio trackers, redone
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'start',
          }}
        >
          <div>
            <h1
              className="c-display"
              style={{
                fontSize: 'clamp(48px, 8.4vw, 128px)',
                margin: 0,
              }}
            >
              <span
                className="c-halo"
                data-text="the dashboard told you green."
                style={{ display: 'inline' }}
              >
                the dashboard told you green.
              </span>
              <br />
              <span
                className="c-halo c-halo--blue"
                data-text="that wasn’t the whole story."
                style={{ display: 'inline', color: 'var(--c-ink-red)' }}
              >
                that wasn&rsquo;t the whole story.
              </span>
            </h1>

            <p
              style={{
                marginTop: 32,
                maxWidth: '54ch',
                fontSize: 18,
                lineHeight: 1.6,
                color: 'var(--c-ink-black)',
              }}
            >
              Provedo shows you the parts your broker app skips — concentration, currency drift, the
              position quietly running your book.
            </p>

            <div style={{ marginTop: 36 }}>
              <button type="button" className="c-stamp">
                Show me my book →
              </button>
            </div>
          </div>

          {/* Live PnL block with marginalia */}
          <aside
            style={{
              borderLeft: '1px solid var(--c-registration)',
              paddingLeft: 'clamp(20px, 2vw, 32px)',
              position: 'relative',
            }}
          >
            <p className="c-eyebrow">Today&rsquo;s reading</p>

            <div
              style={{
                marginTop: 16,
                fontFamily: 'var(--c-font-display)',
                fontSize: 'clamp(40px, 6vw, 84px)',
                lineHeight: 1,
                color: 'var(--c-ink-blue)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              {/* Yellow highlight band beneath the number */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -4,
                  right: -4,
                  bottom: 6,
                  height: 22,
                  background: 'var(--c-ink-yellow)',
                  zIndex: 0,
                }}
              />
              <span
                className="c-halo"
                data-text="$147,230"
                style={{ position: 'relative', zIndex: 1 }}
              >
                $147,230
              </span>
            </div>

            <p className="c-pencil" style={{ marginTop: 18 }}>
              +2.3% wk-over-wk &mdash;{' '}
              <a
                href="#chart"
                style={{ color: 'var(--c-ink-red)', textDecoration: 'underline wavy' }}
              >
                see p.3
              </a>
            </p>

            {/* AI marginalia annotation overlay */}
            <p
              className="c-pencil c-pencil--red"
              style={{
                marginTop: 20,
                fontSize: 18,
                maxWidth: `${28}ch`,
                position: 'relative',
                paddingLeft: 14,
                borderLeft: '2px dashed var(--c-ink-red)',
                lineHeight: 1.4,
              }}
            >
              &ldquo;NVDA is now 31% of the book. Not wrong &mdash; just load-bearing. Worth a
              conversation.&rdquo;
              <span
                aria-hidden
                style={{
                  display: 'block',
                  marginTop: 4,
                  fontSize: 14,
                  color: 'var(--c-pencil)',
                  fontStyle: 'italic',
                }}
              >
                &mdash; Provedo, in the margin
              </span>
            </p>
          </aside>
        </div>

        {/* ─── Chart sample ─────────────────────────────────────── */}
        <section
          id="chart"
          style={{
            marginTop: 'clamp(80px, 12vw, 160px)',
            paddingTop: 32,
            borderTop: '1px dashed var(--c-pencil)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 12,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <p className="c-eyebrow">Plate II &mdash; allocation drift, top 5</p>
            <p className="c-pencil" style={{ color: 'var(--c-pencil)' }}>
              ink runs · red · blue · yellow
            </p>
          </div>

          <div
            style={{
              padding: 'clamp(20px, 3vw, 40px)',
              border: '1px solid var(--c-registration)',
              background: 'var(--c-paper)',
              maxWidth: 760,
              position: 'relative',
            }}
          >
            {/* Misregister halo around the chart frame */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid var(--c-ink-red)',
                opacity: 0.3,
                transform: 'translate(2px, 2px)',
                pointerEvents: 'none',
              }}
            />
            <BarVisx payload={BAR_DRIFT_FIXTURE} width={680} height={280} />
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '3px solid var(--c-ink-black)',
          padding: '20px clamp(24px, 4vw, 48px)',
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
            alignItems: 'baseline',
          }}
        >
          <span className="c-eyebrow">Style C · Pressroom Riso</span>
          <span className="c-eyebrow" style={{ color: 'var(--c-pencil)' }}>
            Edition 0042 · 1 May 2026 · 3-ink run
          </span>
        </div>
      </footer>
    </div>
  );
}
