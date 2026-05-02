'use client';

import { BAR_DRIFT_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { useRef } from 'react';
import { Ember, EmberDock, useTypeBreath } from './_lib/Ember';

/**
 * `/style-b` — Hearth Intelligence.
 *
 * Mini-landing for visual evaluation. Layout faithful to
 * `.superpowers/brainstorm/2026-05-01-fresh-start/B-ai-warm.md`:
 *
 *   - compact warm-paper header
 *   - hero with breathing terracotta Ember (cursor-aware, 9.5s ↔ 4s)
 *   - headline weight oscillation 500 → 580 → 500 (Inter variable axis)
 *   - terracotta accent CTA, ghost secondary
 *   - sentinel-driven docked ember (top-right) past hero
 *   - chart sample tinted in Hearth Intelligence palette
 */

export default function StyleBPage() {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  useTypeBreath(headlineRef);

  return (
    <div style={{ background: 'var(--b-surface-base)', minHeight: '100vh' }}>
      <EmberDock />

      {/* ─── Header ───────────────────────────────────────────────── */}
      <header
        style={{
          padding: '20px clamp(24px, 4vw, 48px)',
          borderBottom: '1px solid color-mix(in srgb, var(--b-ink-faint) 40%, transparent)',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <span className="b-headline" style={{ fontSize: 18, fontWeight: 600 }}>
            Provedo
          </span>
          <nav style={{ display: 'flex', gap: 24 }}>
            <a className="b-eyebrow" style={{ letterSpacing: '0.12em' }} href="/style-b">
              Pricing
            </a>
            <a className="b-eyebrow" style={{ letterSpacing: '0.12em' }} href="/style-b">
              Sign in
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(56px, 9vw, 120px) clamp(24px, 4vw, 48px) 64px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'center',
        }}
      >
        <div>
          <p className="b-eyebrow" style={{ marginBottom: 28 }}>
            Portfolio trackers, redone
          </p>

          <h1
            ref={headlineRef}
            className="b-headline"
            style={{
              fontSize: 'clamp(2.75rem, 1.5rem + 5.5vw, 5.5rem)',
              lineHeight: 1.04,
              margin: 0,
            }}
          >
            the dashboard told you green.
            <br />
            that wasn&rsquo;t the <span className="b-italic-word">whole story</span>.
          </h1>

          <p
            style={{
              marginTop: 28,
              maxWidth: '52ch',
              fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
              lineHeight: 1.6,
              color: 'var(--b-ink-muted)',
            }}
          >
            Provedo shows you the parts your broker app skips — concentration, currency drift, the
            position quietly running your book.
          </p>

          <div style={{ marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button type="button" className="b-cta">
              show me my book
              <span aria-hidden style={{ marginLeft: 4 }}>
                →
              </span>
            </button>
            <button type="button" className="b-ghost">
              How it works
            </button>
          </div>

          <blockquote
            style={{
              marginTop: 56,
              padding: '20px 0 20px 22px',
              borderLeft: '2px solid var(--b-accent-primary)',
              maxWidth: `${36}ch`,
            }}
          >
            <span
              className="b-italic-word"
              style={{
                color: 'var(--b-ink-primary)',
                fontSize: 'clamp(1.375rem, 1.1rem + 1.4vw, 1.625rem)',
                lineHeight: 1.4,
              }}
            >
              &ldquo;Your tech allocation drifted 4.2% above target this week. Here&rsquo;s what
              rebalancing would cost in tax.&rdquo;
            </span>
          </blockquote>
        </div>

        <div style={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
          <Ember />
        </div>
      </main>

      <div id="b-ember-sentinel" aria-hidden style={{ height: 1 }} />

      {/* ─── Chart sample ────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(56px, 9vw, 120px) clamp(24px, 4vw, 48px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'start',
          }}
        >
          <div>
            <p className="b-eyebrow">A reading, not a verdict</p>
            <h2
              className="b-headline"
              style={{
                fontSize: 'clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)',
                lineHeight: 1.15,
                marginTop: 12,
              }}
            >
              Where your <span className="b-italic-word">book</span> drifted this week.
            </h2>
            <p style={{ marginTop: 16, color: 'var(--b-ink-muted)', lineHeight: 1.6 }}>
              Top five positions, plotted against their target weights. Bars outside the ±2pp band
              are surfaced with the accent ink.
            </p>
          </div>

          <div className="b-card" style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
            <BarVisx payload={BAR_DRIFT_FIXTURE} width={680} height={280} />
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid color-mix(in srgb, var(--b-ink-faint) 40%, transparent)',
          padding: '32px clamp(24px, 4vw, 48px)',
          marginTop: 64,
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
          <span className="b-eyebrow">Style B · Hearth Intelligence</span>
          <span className="b-eyebrow" style={{ color: 'var(--b-accent-primary)' }}>
            terracotta · cream · ember
          </span>
        </div>
      </footer>
    </div>
  );
}
