'use client';

import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { useState } from 'react';

/**
 * `/style-c` — Pressroom Riso (polished).
 *
 * Polish per `.superpowers/brainstorm/2026-05-01-fresh-start/C-deep-visual.md`:
 *
 *   - Bowlby One supergraphic (single-weight slab-poster, holds at 200pt)
 *   - mast-head strip (S3 ink-blue, cream type, vol/issue/page/date meta)
 *   - misregister offset taxonomy (poster / figure / trace) — NOT on numerals
 *   - Source Serif 4 italic pull-quote with hanging punctuation
 *   - bylined + datestamped pencil marginalia per trust guardrail 2
 *   - figure credit under every chart
 *   - footer with «next edition» tease + decorative reg-code
 *   - Carbon Print dark-mode toggle (cream ↔ dim warm-paper)
 */

const HEADLINE_LINE_1 = 'your money,';
const HEADLINE_LINE_2 = 'on the record.';
const SUBLINE =
  'every position, every dividend, every drift — filed and dated. across all your brokers.';
const PULL_QUOTE = 'every dividend dated. every drift noted. nothing prescribed.';

export default function StyleCPage() {
  const [theme, setTheme] = useState<'day' | 'carbon'>('day');

  return (
    <div
      data-theme={theme === 'carbon' ? 'carbon' : undefined}
      style={{ background: 'var(--c-paper)', minHeight: '100vh' }}
    >
      {/* ─── Mast-head strip (S3 ink-block) ─────────────────────────── */}
      <div className="c-mast-strip" aria-label="Provedo masthead">
        <span className="c-mast-strip__brand">provedo</span>
        <span className="c-mast-strip__meta">
          <span>PROVEDO QUARTERLY · VOL 1 · ISSUE 04</span>
          <span>FRIDAY · 1 MAY 2026</span>
          <span>PAGE · 1</span>
        </span>
      </div>

      {/* ─── 3-color spot stripe ─────────────────────────────────── */}
      <div className="c-spot-stripe" aria-hidden>
        <span style={{ background: 'var(--c-ink-red)' }} />
        <span style={{ background: 'var(--c-ink-blue)' }} />
        <span style={{ background: 'var(--c-ink-yellow)' }} />
      </div>

      {/* ─── Edition rule + secondary masthead ───────────────────── */}
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
          <span className="c-eyebrow">portfolio of record · est. 2026</span>
          <span className="c-pencil c-pencil--red" style={{ fontSize: 20 }}>
            market: volatile
          </span>
          <span className="c-eyebrow" style={{ color: 'var(--c-pencil)' }}>
            by the provedo desk · 09:42 local
          </span>
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
          portfolio trackers, redone
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
                fontSize: 'clamp(56px, 9.4vw, 152px)',
                margin: 0,
              }}
            >
              <span
                className="c-typeset-line c-halo"
                data-halo="poster"
                data-text={HEADLINE_LINE_1}
                style={{ display: 'inline-block', animationDelay: '60ms' }}
              >
                {HEADLINE_LINE_1}
              </span>
              <br />
              <span
                className="c-typeset-line c-halo c-halo--blue"
                data-halo="poster"
                data-text={HEADLINE_LINE_2}
                style={{
                  display: 'inline-block',
                  color: 'var(--c-ink-red)',
                  animationDelay: '180ms',
                }}
              >
                {HEADLINE_LINE_2}
              </span>
            </h1>

            <p className="c-byline" style={{ marginTop: 24 }}>
              by the provedo desk · 1 may 2026 · 09:42 local
            </p>

            <p
              style={{
                marginTop: 18,
                maxWidth: '54ch',
                fontSize: 18,
                lineHeight: 1.6,
                color: 'var(--c-ink-black)',
              }}
            >
              {SUBLINE}
            </p>

            <div
              style={{
                marginTop: 36,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button type="button" className="c-stamp">
                open your edition →
              </button>
              <button
                type="button"
                onClick={() => setTheme((t) => (t === 'day' ? 'carbon' : 'day'))}
                className="c-eyebrow"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--c-ink-black)',
                  padding: '12px 18px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  color: 'var(--c-ink-black)',
                  fontSize: 11,
                }}
                aria-pressed={theme === 'carbon'}
              >
                {theme === 'day' ? '☀ day edition' : '☾ night edition'}
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
            <p className="c-eyebrow">today&rsquo;s reading</p>

            {/* GUARDRAIL 1: NO halo on money numerals */}
            <div
              style={{
                marginTop: 16,
                fontFamily: 'var(--c-font-body)',
                fontWeight: 700,
                fontSize: 'clamp(40px, 6vw, 84px)',
                lineHeight: 1,
                color: 'var(--c-ink-blue)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                position: 'relative',
                display: 'inline-block',
                letterSpacing: '-0.02em',
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
              <span style={{ position: 'relative', zIndex: 1 }}>$147,230</span>
            </div>

            <p
              className="c-pencil"
              style={{
                marginTop: 18,
                fontFamily: 'var(--c-font-body)',
                fontSize: 14,
                color: 'var(--c-pencil)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              +2.3% wk-over-wk &mdash;{' '}
              <a
                href="#chart"
                style={{ color: 'var(--c-ink-red)', textDecoration: 'underline wavy' }}
              >
                see p.3
              </a>
            </p>

            {/* AI marginalia — bylined + datestamped per trust guardrail 2 */}
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
              &ldquo;nvda now 31% of book. up from 18% at q3 close.&rdquo;
              <span
                aria-hidden
                style={{
                  display: 'block',
                  marginTop: 6,
                  fontSize: 13,
                  color: 'var(--c-pencil)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--c-font-body)',
                  letterSpacing: '0.04em',
                }}
              >
                &mdash; the editor · 2026-05-01 14:32 ET
              </span>
            </p>
          </aside>
        </div>

        {/* ─── Pull-quote ───────────────────────────────────────── */}
        <blockquote
          className="c-pull-quote"
          style={{
            marginTop: 'clamp(64px, 10vw, 120px)',
            maxWidth: '38ch',
          }}
        >
          &ldquo;{PULL_QUOTE}&rdquo;
        </blockquote>

        {/* ─── Chart sample ─────────────────────────────────────── */}
        <section
          id="chart"
          style={{
            marginTop: 'clamp(64px, 10vw, 120px)',
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
            <p className="c-eyebrow">plate ii — allocation drift, top 5</p>
            <p className="c-pencil" style={{ color: 'var(--c-pencil)' }}>
              ink runs · red · blue · yellow
            </p>
          </div>

          <div
            style={{
              padding: 'clamp(20px, 3vw, 40px)',
              border: '1px solid var(--c-registration)',
              background: 'var(--c-paper-deep)',
              maxWidth: 760,
              position: 'relative',
            }}
          >
            {/* Misregister halo TRACE — chart wrapper only, NOT numerals */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid var(--c-ink-red)',
                opacity: 'var(--halo-trace-opacity)',
                transform: 'translate(var(--halo-trace-x), var(--halo-trace-y))',
                pointerEvents: 'none',
              }}
            />
            <BarVisx payload={BAR_DRIFT_FIXTURE} width={680} height={280} />
          </div>
          <p className="c-figure-credit">
            plate ii · allocation drift · top 5 holdings · data: 1 may 2026 09:42 · chart: provedo
          </p>
        </section>
      </main>

      {/* ─── Footer (next edition + reg-code) ──────────────────── */}
      <footer
        style={{
          borderTop: '3px solid var(--c-ink-black)',
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
            <p className="c-eyebrow" style={{ marginBottom: 8 }}>
              style c · pressroom riso
            </p>
            <p className="c-reg-code">REG · PRV-2026-042-α</p>
          </div>
          <div>
            <p className="c-eyebrow" style={{ marginBottom: 8 }}>
              in the next edition →
            </p>
            <p className="c-pencil" style={{ fontSize: 16 }}>
              the evening wire · weekly drift · sector overweight
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="c-eyebrow" style={{ color: 'var(--c-pencil)' }}>
              edition 0042 · 1 may 2026 · 3-ink run
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
