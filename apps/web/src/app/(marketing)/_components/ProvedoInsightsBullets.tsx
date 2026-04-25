// ProvedoInsightsBullets — §S5 insights proof bullets (Slice-LP2)
// Extracted from ProvedoInsightsSection (previously contained both bullets + editorial narrative)
// Visual spec §6.2: 3-card row, white bg (ELEVATED), unchanged from v1
// Copy: verbatim from landing-provedo-v2.md §S5

import { BookOpen, Search, Wifi } from 'lucide-react';

const INSIGHT_BULLETS: ReadonlyArray<{
  icon: React.ElementType;
  iconLabel: string;
  copy: string;
}> = [
  {
    icon: Wifi,
    iconLabel: 'Context across brokers icon',
    copy: 'Provedo holds context across every broker — knows what you own, what changed since last week, where the deltas matter.',
  },
  {
    icon: Search,
    iconLabel: 'Surface insights icon',
    copy: 'Provedo surfaces what would slip past — incoming dividends, forming drawdowns, creeping concentration.',
  },
  {
    icon: BookOpen,
    iconLabel: 'Citation and sources icon',
    copy: 'Provedo cites every observation. Every pattern shown ties back to a trade, an event, or a published source.',
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
        {/* Section header — verbatim §S5 v2 */}
        <div className="mb-12 text-center md:mb-16">
          <h2
            id="insights-heading"
            className="text-2xl font-semibold tracking-tight md:text-4xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            A few minutes a week. Everything that moved.
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            Provedo surfaces dividends, drawdowns, concentration shifts, and events — once a week,
            in one feed, not scattered across{' '}
            <strong style={{ color: 'var(--provedo-text-primary)' }}>seven broker emails</strong>.
          </p>
        </div>

        {/* Three proof bullets */}
        <div className="grid gap-6 md:grid-cols-3">
          {INSIGHT_BULLETS.map((bullet) => {
            const Icon = bullet.icon;
            return (
              <div
                key={bullet.copy}
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--provedo-border-subtle)',
                  backgroundColor: 'var(--provedo-bg-page)',
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
