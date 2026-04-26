import Link from 'next/link';
import { ProvedoButton, ProvedoNavLink } from './ProvedoButton';

// Provedo first-pass header.
// Uses inline text wordmark — SVG asset is a product-designer follow-up artefact (separate slice).
// Focus ring uses teal-600 (#0D9488) per Direction A v1.4; no violet/brand-500.
export function MarketingHeader() {
  return (
    <header
      className="sticky top-0 z-10 border-b backdrop-blur"
      style={{
        borderColor: 'var(--provedo-border-subtle)',
        backgroundColor: 'color-mix(in srgb, var(--provedo-bg-page) 92%, transparent)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-8">
        {/* Skip link for a11y — visually hidden until focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
          style={{
            backgroundColor: 'var(--provedo-accent)',
            color: '#FFFFFF',
          }}
        >
          Skip to content
        </a>

        {/* Provedo wordmark — text-based for first-pass */}
        <Link
          href="/"
          aria-label="Provedo — home"
          className="rounded-sm"
          style={{ outline: 'none' }}
        >
          <span
            className="text-xl font-semibold tracking-tight"
            style={{ color: 'var(--provedo-text-primary)', fontFamily: 'var(--provedo-font-sans)' }}
          >
            Provedo
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-2 md:gap-4">
          <ProvedoNavLink href="/pricing" className="hidden text-sm font-medium sm:inline-block">
            Pricing
          </ProvedoNavLink>
          <ProvedoNavLink href="/sign-in" className="text-sm font-medium">
            Sign in
          </ProvedoNavLink>
          <ProvedoButton href="#waitlist" size="sm">
            Get started
          </ProvedoButton>
        </nav>
      </div>
    </header>
  );
}
