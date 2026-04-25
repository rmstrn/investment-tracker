'use client';

// ProvedoInsightsBullets — §S5 insights proof bullets (v3)
// Patch B: «a few minutes a week» → «a few minutes a day»
// V3.5: scroll-into-view fade-in via ScrollFadeIn wrapper
// V3.6: copy trim — sub shortened, bullets kept concise
// Visual spec §6.2: 3-card row, white bg (ELEVATED)

import { BookOpen, Search, Wifi } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';

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
      </div>
    </section>
  );
}
