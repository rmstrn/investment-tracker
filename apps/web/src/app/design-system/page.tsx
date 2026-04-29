import { brand } from '@investment-tracker/design-tokens/brand';
import { ShowcaseHeader } from './_components/ShowcaseHeader';
import { ChartsSection } from './_sections/charts';
import { DisclaimerSection } from './_sections/disclaimer';
import { FoundationSection } from './_sections/foundation';
import { IconographySection } from './_sections/iconography';
import { PrimitivesSection } from './_sections/primitives';
import { ThemeSection } from './_sections/theme';
import './_styles/showcase.css';

export const metadata = {
  title: `Design System · ${brand.productName}`,
  description: `Single canonical interactive showcase for ${brand.productName} design system v1.1.`,
  robots: { index: false, follow: false },
};

/**
 * `/design-system` — single canonical interactive showcase.
 *
 * Replaces the dual surfaces that used to live at `/design#charts` (outdated
 * v1.0 tokens) and `/design-system.html` (static, no real components). Every
 * section below mounts real React components from `@investment-tracker/ui`,
 * so hover / focus / active states are CSS-driven and theme-flips are real.
 *
 * Spec: `docs/reviews/2026-04-29-interactive-showcase-spec.md`.
 */
export default function DesignSystemPage() {
  return (
    <div className="showcase min-h-screen bg-background-primary text-text-primary">
      <ShowcaseHeader />

      <main className="mx-auto max-w-6xl space-y-20 px-6 py-12 md:px-8">
        <section className="space-y-3">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'var(--accent, var(--color-accent-default))',
              fontWeight: 500,
            }}
          >
            {brand.productName} · Design System v1.1
          </p>
          <h1
            className="font-semibold tracking-tight text-text-primary"
            style={{ fontSize: '48px', letterSpacing: '-0.035em', lineHeight: 1 }}
          >
            Tokens, primitives, charts.
          </h1>
          <p className="max-w-2xl text-base text-text-secondary" style={{ lineHeight: 1.55 }}>
            Source-of-truth tokens + real React primitives + the chart subsystem. Every surface
            below is interactive — hover / focus / press for state demos. Toggle{' '}
            <strong>Light / Dark</strong> and <strong>Motion on / off</strong> in the header to
            verify all components respond without remount.
          </p>
        </section>

        <FoundationSection />
        <IconographySection />
        <PrimitivesSection />
        <ChartsSection />
        <DisclaimerSection />
        <ThemeSection />

        <footer className="border-t border-border-subtle pt-8 pb-4">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'var(--text-3)',
            }}
          >
            Generated from <code>@investment-tracker/design-tokens</code> ·{' '}
            <code>brand.productName = &quot;{brand.productName}&quot;</code>
          </p>
        </footer>
      </main>
    </div>
  );
}
