// ProvedoInsightsSection — §3 copy verbatim from docs/content/landing-provedo-v1.md v2
// Section hero + sub + 3 proof bullets + mid-page brand-world narrative + closing line.
// Lucide icons — consistent stroke-1.5 family. No emoji as icons.

import { BookOpen, Search, Wifi } from 'lucide-react';

const INSIGHT_BULLETS: ReadonlyArray<{
  icon: React.ElementType;
  iconLabel: string;
  copy: string;
}> = [
  {
    icon: Wifi,
    iconLabel: 'Context icon',
    copy: 'Provedo holds context across every broker — knows what you own, what changed since last week, where the deltas matter.',
  },
  {
    icon: Search,
    iconLabel: 'Surface icon',
    copy: 'Provedo surfaces what would slip past — incoming dividends, forming drawdowns, creeping concentration.',
  },
  {
    icon: BookOpen,
    iconLabel: 'Citation icon',
    copy: 'Provedo cites every observation. Every pattern shown ties back to a trade, an event, or a published source.',
  },
] as const;

export function ProvedoInsightsSection() {
  return (
    <section
      aria-labelledby="insights-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-elevated)' }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section header — verbatim §3 */}
        <div className="mb-12 text-center md:mb-16">
          <h2
            id="insights-heading"
            className="text-2xl font-semibold tracking-tight md:text-4xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            A few minutes a week. Everything that moved.
          </h2>
          <p
            className="mt-4 max-w-2xl mx-auto text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            Provedo surfaces dividends, drawdowns, concentration shifts, and events — once a week,
            in one feed, not scattered across seven broker emails.{' '}
            <span style={{ color: 'var(--provedo-text-tertiary)' }}>
              Notice what you&apos;d miss.
            </span>
          </p>
        </div>

        {/* Three proof bullets */}
        <div className="mb-16 grid gap-6 md:grid-cols-3 md:mb-20">
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

        {/* Mid-page brand-world section — verbatim §3 narrative */}
        <div
          className="rounded-2xl border px-8 py-10 md:px-12 md:py-14"
          style={{
            borderColor: 'var(--provedo-border-subtle)',
            backgroundColor: 'var(--provedo-bg-page)',
          }}
        >
          <h3
            className="mb-6 text-xl font-semibold tracking-tight md:text-2xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            One brain. One feed. One chat.
          </h3>

          <div
            className="space-y-4 text-base leading-relaxed"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            <p>
              Your portfolio lives in seven places. Your dividends arrive in three inboxes. The
              reasons you bought NVDA in 2023 are in a group chat you can&apos;t find.
            </p>
            <p>
              Provedo holds it in one place. Reads what you own across every broker. Notices what
              would slip past — a dividend coming, a drawdown forming, a concentration creeping up.
              Shows you patterns in your past trades — what you did, when, what came next.
            </p>
            <p>
              Across chat, weekly insights, and pattern-reads on your trades. On your real
              positions. With sources for every answer.
            </p>
          </div>

          {/* Closing brand-world line — verbatim */}
          <p
            className="mt-8 text-base font-semibold md:text-lg"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            Provedo sees what you hold and notices what you&apos;d miss.
          </p>
        </div>
      </div>
    </section>
  );
}
