'use client';

// ProvedoInsightsBullets — §S5 insights proof bullets (v3)
// Patch B: «a few minutes a week» → «a few minutes a day»
// V3.5: scroll-into-view fade-in via ScrollFadeIn wrapper
// V3.6: copy trim — sub shortened, bullets kept concise
// Slice-LP3.7-A: backs the chrome-promise asserted by bullet #3 («Provedo
// cites every observation») with an actual <Sources> mount on this surface.
// Brand-strategist 2026-04-27 §S5: closes the chrome-promise-content-mismatch
// gap. Treatment is intentionally LIGHTER (max-width + reduced opacity wrapper)
// than the other 6 Sources mounts — the primitive's upper bound for Everyman
// survival was named at 6 mounts, so the 7th uses muted visual weight to
// avoid Sage-stacking. Items reference methodology + per-answer cite, NOT
// internal pre-alpha cohorts (brand-voice rejected performative-Sage citing).
// Visual spec §6.2: 3-card row, white bg (ELEVATED)

import { BookOpen, Search, Wifi } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { Sources } from './Sources';

const INSIGHTS_SOURCES_ITEMS: ReadonlyArray<string> = [
  'Methodology · pattern detection runs on your transactions',
  'Cited per observation in chat answers',
] as const;

const INSIGHT_BULLETS: ReadonlyArray<{
  icon: React.ElementType;
  iconLabel: string;
  copy: string;
}> = [
  {
    icon: Wifi,
    iconLabel: 'Context across brokers icon',
    copy: 'Provedo holds context across every broker — knows what you own, what changed, where the deltas matter.',
  },
  {
    icon: Search,
    iconLabel: 'Surface insights icon',
    copy: 'Provedo surfaces what would slip past — incoming dividends, forming drawdowns, creeping concentration.',
  },
  {
    icon: BookOpen,
    iconLabel: 'Citation and sources icon',
    copy: 'Provedo cites every observation. Every pattern ties back to a trade, an event, or a published source.',
  },
] as const;

export function ProvedoInsightsBullets(): React.ReactElement {
  return (
    <section
      aria-labelledby="insights-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-elevated)' }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section header — Patch B: week → day */}
        <ScrollFadeIn>
          <div className="mb-12 text-center md:mb-16">
            <h2
              id="insights-heading"
              className="text-2xl font-semibold tracking-tight md:text-4xl"
              style={{ color: 'var(--provedo-text-primary)' }}
            >
              A few minutes a day. Everything that moved.
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg"
              style={{ color: 'var(--provedo-text-secondary)' }}
            >
              Provedo surfaces dividends, drawdowns, and concentration shifts — in one feed, not
              scattered across{' '}
              <strong style={{ color: 'var(--provedo-text-primary)' }}>seven broker emails</strong>.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Three proof bullets */}
        <div className="grid gap-6 md:grid-cols-3">
          {INSIGHT_BULLETS.map((bullet, i) => {
            const Icon = bullet.icon;
            return (
              <ScrollFadeIn key={bullet.copy} delay={i * 80}>
                <div
                  className="rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--provedo-border-subtle)',
                    backgroundColor: 'var(--provedo-bg-page)',
                    height: '100%',
                  }}
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'var(--provedo-accent-subtle)' }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      aria-label={bullet.iconLabel}
                      style={{ color: 'var(--provedo-accent)' }}
                    />
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--provedo-text-secondary)' }}
                  >
                    {bullet.copy}
                  </p>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>

        {/* Slice-LP3.7-A: backs bullet #3's chrome-promise on the surface
            that asserts it. Wrapped in a constrained, opacity-muted container
            so the 7th Sources mount does not push Sage past Everyman parity
            (brand-strategist §7 ceiling note). */}
        <ScrollFadeIn delay={INSIGHT_BULLETS.length * 80}>
          <div
            data-testid="insights-sources-wrapper"
            className="mx-auto mt-10 md:mt-12"
            style={{ maxWidth: '480px', opacity: 0.85 }}
          >
            <Sources items={INSIGHTS_SOURCES_ITEMS} />
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
