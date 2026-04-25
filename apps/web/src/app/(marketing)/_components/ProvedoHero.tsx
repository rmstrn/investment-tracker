// ProvedoHero — §1 copy verbatim from docs/content/landing-provedo-v1.md v2
// Teal accent #0D9488, warm-neutral bg #FAFAF7, no violet, no gradient mesh.

import { ProvedoButton, ProvedoNavLink } from './ProvedoButton';

export function ProvedoHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex flex-col items-center px-4 pb-20 pt-20 text-center md:pb-28 md:pt-28"
    >
      {/* Headline — LOCKED 2026-04-25 */}
      <h1
        id="hero-heading"
        className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl md:leading-tight"
        style={{ color: 'var(--provedo-text-primary)' }}
      >
        Provedo will lead you through your portfolio.
      </h1>

      {/* Sub-hero — tagline as proof-line (first of three deployments) */}
      <p
        className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
        style={{ color: 'var(--provedo-text-secondary)' }}
      >
        Notice what you&apos;d miss across all your brokers.
      </p>

      {/* CTA cluster */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        {/* Primary CTA — Ask Provedo → #demo anchor */}
        <ProvedoButton href="#demo" variant="primary" size="lg">
          Ask Provedo
        </ProvedoButton>

        {/* Trial CTA — secondary */}
        <ProvedoButton href="#waitlist" variant="outline" size="lg">
          Try Plus free for 14 days
        </ProvedoButton>
      </div>

      {/* CTAs small-print */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:flex-row sm:gap-6">
        <p className="text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
          Card required. Cancel any time, one click.
        </p>
        <span
          className="hidden text-xs sm:inline"
          style={{ color: 'var(--provedo-border-default)' }}
        >
          |
        </span>
        <ProvedoNavLink
          href="/sign-up"
          className="text-xs"
          colorFrom="var(--provedo-text-tertiary)"
          colorTo="var(--provedo-accent)"
        >
          Or start free forever
        </ProvedoNavLink>
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
        No card. No trial ending. 50 chat messages / month on Free.
      </p>
    </section>
  );
}
