// ProvedoRepeatCTA — §5 copy verbatim from docs/content/landing-provedo-v1.md v2
// Pre-footer CTA block: "Ready when you are." + dual-path CTAs.

import { ProvedoButton } from './ProvedoButton';

export function ProvedoRepeatCTA() {
  return (
    <section
      aria-labelledby="repeat-cta-heading"
      className="px-4 py-16 text-center md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-elevated)' }}
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="repeat-cta-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ color: 'var(--provedo-text-primary)' }}
        >
          Ready when you are.
        </h2>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {/* Primary trial CTA */}
          <ProvedoButton href="#waitlist" variant="primary" size="lg">
            Try Plus free for 14 days
          </ProvedoButton>

          {/* Free tier CTA */}
          <ProvedoButton href="/sign-up" variant="outline" size="lg">
            Or start free forever
          </ProvedoButton>
        </div>

        {/* Small-print — verbatim §5 */}
        <p className="mt-4 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
          Plus: card required, cancel one click.{' '}
          <span className="inline-block">Free: no card, no trial ending, 50 messages / month.</span>
        </p>
      </div>
    </section>
  );
}
