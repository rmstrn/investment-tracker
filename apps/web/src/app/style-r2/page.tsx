import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';

/**
 * `/style-r2` — «Long Room».
 *
 * Calm / restrained / spa stance per `R2-calm-restrained.md`.
 * The page reads like an Aesop product page crossed with a Stripe Press
 * book interior: warm cream paper, generous left-aligned type, hairline
 * rules, single chromatic accent (sage), money in tabular mono only.
 *
 * Hard rules wired:
 *   - 12-col grid, content lives in cols 2-8 — right third deliberately
 *     empty on first viewport. The hairline rule below the hero anchors
 *     emptiness as intentional, not broken.
 *   - All money numerals via `.r2-figure` (JetBrains Mono tabular,
 *     `--r2-figure` AAA 17.8:1 on paper).
 *   - Single CTA, no secondary. Background shifts ink → sage on hover
 *     (180ms, no scale, no shadow).
 *   - `──  TITLE ──` eyebrows recur at least 2-3 times across the page.
 *   - One BarVisx in the second band, wrapped in `--r2-paper-deep`
 *     quote-block surface. Hairline above, no shadow.
 *   - AI surface is a bylined column, not a chat bubble.
 */

const HERO_EYEBROW = '──  PORTFOLIO INTELLIGENCE  ──';
const HERO_HEADLINE = 'Every dividend, on the record.';
const HERO_SUB =
  'One quiet place to look at your money across every broker. Read what changed this week, footnoted and dated.';
const HERO_CTA = 'Request access';
const HERO_SUBLINK = 'See a sample weekly read.';

const BAND_EYEBROW = '──  POSITION  ──';
const BAND_TITLE = 'Here is what your room looks like right now.';
const BAND_FIGURE = '$148,402.18';
const BAND_DELTA = '+$1,240';
const BAND_DELTA_PCT = '+0.84%';
const BAND_META_LAST_DIV = 'Last dividend  ·  29 April  ·  $84.10';
const BAND_META_NEXT_EX = 'Next ex-date  ·  14 May  ·  AAPL';
const BAND_META_DRIFT = 'No drift';
const BAND_CHART_CAPTION = 'AS OF MAY 1, 2026  ·  09:14 ET';

const AI_EYEBROW = '──  ASKED, AND ANSWERED  ──';

export default function StyleR2Page() {
  return (
    <div style={{ background: 'var(--r2-paper)', minHeight: '100vh' }}>
      {/* ─── Top wordmark strip ─────────────────────────────────────── */}
      <header className="r2-mast" aria-label="Provedo masthead">
        <span className="r2-mast__brand">Provedo</span>
        <nav className="r2-mast__nav" aria-label="Primary">
          <a href="#login">Login</a>
          <a href="#access">Request access</a>
        </nav>
      </header>

      {/* ─── Hero — 12-col grid, content in cols 2-8, right third empty */}
      <section
        aria-labelledby="hero-heading"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: 'clamp(72px, 12vw, 168px) clamp(24px, 6vw, 96px) clamp(56px, 8vw, 96px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            columnGap: 'clamp(16px, 2vw, 32px)',
          }}
        >
          {/* Content lives in columns 2-8 (left-anchored, 7 cols).      */}
          {/* Columns 9-12 are deliberately empty — emptiness IS the     */}
          {/* message. Anchored by the hairline rule below.              */}
          <div
            style={{
              gridColumn: '2 / span 7',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(24px, 3vw, 36px)',
            }}
          >
            <p className="r2-eyebrow">{HERO_EYEBROW}</p>

            <h1 id="hero-heading" className="r2-display">
              {HERO_HEADLINE}
            </h1>

            <p className="r2-sub">{HERO_SUB}</p>

            <div
              style={{
                marginTop: 'clamp(8px, 1vw, 16px)',
                display: 'flex',
                gap: 28,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a href="#request" className="r2-cta">
                {HERO_CTA}
              </a>
              <a href="#sample" className="r2-sublink">
                {HERO_SUBLINK}
              </a>
            </div>
          </div>
        </div>

        {/* ─── Hairline rule — anchors the deliberately-empty right ─── */}
        <hr className="r2-rule" style={{ marginTop: 'clamp(72px, 10vw, 128px)' }} aria-hidden />
      </section>

      {/* ─── Second band — «here is what your room looks like» ──────── */}
      <section
        aria-labelledby="band-heading"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: 'clamp(56px, 8vw, 112px) clamp(24px, 6vw, 96px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            columnGap: 'clamp(16px, 2vw, 32px)',
            rowGap: 'clamp(40px, 5vw, 64px)',
          }}
        >
          {/* Left column: figure + delta + metadata triplet           */}
          <div
            style={{
              gridColumn: '2 / span 6',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(20px, 2.5vw, 32px)',
            }}
          >
            <p className="r2-eyebrow">{BAND_EYEBROW}</p>

            <h2 id="band-heading" className="r2-section-head">
              {BAND_TITLE}
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(8px, 1vw, 14px)',
                marginTop: 'clamp(8px, 1vw, 14px)',
              }}
            >
              <span className="r2-figure r2-figure--display">{BAND_FIGURE}</span>
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                }}
              >
                <span className="r2-delta">
                  <span className="r2-delta__glyph" aria-hidden>
                    ▲
                  </span>
                  <span className="r2-figure r2-figure--inline">{BAND_DELTA}</span>
                </span>
                <span
                  className="r2-figure r2-figure--inline"
                  style={{ color: 'var(--r2-ink-quiet)', fontSize: 15 }}
                >
                  {BAND_DELTA_PCT}
                </span>
                <span className="r2-meta" style={{ marginLeft: 4 }}>
                  this week
                </span>
              </div>
            </div>

            <p className="r2-body" style={{ marginTop: 'clamp(8px, 1vw, 14px)' }}>
              Across 14 positions, three brokers. The figure is the same one your statement of
              record will print at month-end — counted once, attributed to the broker that holds it.
            </p>

            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginTop: 'clamp(12px, 2vw, 20px)',
              }}
            >
              <li className="r2-meta">{BAND_META_LAST_DIV}</li>
              <li className="r2-meta">{BAND_META_NEXT_EX}</li>
              <li className="r2-meta">{BAND_META_DRIFT}</li>
            </ul>
          </div>

          {/* Right column: BarVisx in paper-deep quote-block            */}
          <div
            style={{
              gridColumn: '8 / span 4',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <hr className="r2-rule" aria-hidden />
            <div className="r2-quote-block">
              <div className="r2-quote-block__chart">
                <BarVisx payload={BAR_DRIFT_FIXTURE} width={360} height={220} />
              </div>
              <p className="r2-quote-block__caption">{BAND_CHART_CAPTION}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI insight — bylined column, NOT a chat bubble ─────────── */}
      <section
        aria-labelledby="ai-heading"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: 'clamp(56px, 8vw, 112px) clamp(24px, 6vw, 96px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            columnGap: 'clamp(16px, 2vw, 32px)',
          }}
        >
          <div
            style={{
              gridColumn: '2 / span 7',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(20px, 2.5vw, 32px)',
            }}
          >
            <p className="r2-eyebrow" id="ai-heading">
              {AI_EYEBROW}
            </p>

            <hr className="r2-rule" aria-hidden />

            <p className="r2-insight">
              Your Q1 outperformance was 71% currency, 29% holdings. The dollar–yen move in February
              explains <span className="r2-figure r2-figure--inline">$4,210</span> of the{' '}
              <span className="r2-figure r2-figure--inline">$5,930</span> gain.
            </p>

            <p className="r2-insight">
              You have not reviewed the SCHD position since 14 January. Three dividends have been
              paid since: <span className="r2-figure r2-figure--inline">$84.10</span>,{' '}
              <span className="r2-figure r2-figure--inline">$86.30</span>,{' '}
              <span className="r2-figure r2-figure--inline">$89.05</span>.
            </p>

            <p className="r2-insight">
              No drift, no missing statements this week. Quiet is sometimes the answer.
            </p>

            <span className="r2-insight__byline">Provedo · 05/01 09:14 ET</span>

            <span className="r2-insight__disclaimer">
              Observation, not advice. See methodology.
            </span>

            <hr className="r2-rule" style={{ marginTop: 8 }} aria-hidden />
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: 'clamp(48px, 6vw, 96px) clamp(24px, 6vw, 96px) clamp(32px, 4vw, 56px)',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            columnGap: 'clamp(16px, 2vw, 32px)',
            rowGap: 32,
          }}
        >
          <div style={{ gridColumn: '2 / span 7' }}>
            <p className="r2-eyebrow" style={{ marginBottom: 16 }}>
              ── ON THE RECORD ──
            </p>
            <p className="r2-disclosure">
              Provedo is a read-only portfolio companion. We do not execute trades and we do not
              provide investment advice. Figures sourced from your broker's posted close; verify
              against your statement of record.
            </p>
          </div>

          <div
            style={{
              gridColumn: '2 / span 11',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 16,
              flexWrap: 'wrap',
              paddingTop: 24,
              borderTop: '1px solid var(--r2-rule)',
            }}
          >
            <span className="r2-meta">Provedo · est. 2026</span>
            <span className="r2-meta">REG · PRV-2026-R2-α</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
