import { brand } from '@investment-tracker/design-tokens/brand';
import { ShowcaseHeader } from './_components/ShowcaseHeader';
import { StagedSections } from './_components/StagedSections';
import { DisclaimerSection } from './_sections/disclaimer';
import { IconographySection } from './_sections/iconography';
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
 * Re-architected 2026-04-29 to match the static visual reference at
 * `apps/web/public/design-system.html` (Provedo Design System v2 — Showcase).
 * A single stage renders the full primitive set; the sticky header's global
 * theme toggle (`<html data-theme>`) flips dark mode in place — no stacked
 * second stage needed.
 *
 * Inside the stage the full section set renders: foundation, signature hero,
 * primitives (curated permutations), forms (product-context inputs), cards
 * (portfolio · insight · empty), charts (with custom Recharts theming via
 * `buildChartTheme`).
 */
export default function DesignSystemPage() {
  return (
    <div className="showcase min-h-screen bg-background-primary text-text-primary">
      <ShowcaseHeader />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-12 md:px-8">
        <section className="space-y-3 pb-2">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--showcase-eyebrow-size)',
              letterSpacing: 'var(--showcase-eyebrow-tracking)',
              color: 'var(--accent, var(--color-accent-default))',
              fontWeight: 'var(--showcase-eyebrow-weight)' as unknown as number,
            }}
          >
            {brand.productName} · Design System v2 · Showcase
          </p>
          <h1
            className="font-semibold text-text-primary"
            style={{
              fontSize: 'var(--showcase-page-title-size)',
              letterSpacing: 'var(--showcase-page-title-tracking)',
              fontWeight: 'var(--showcase-page-title-weight)' as unknown as number,
              lineHeight: 1.05,
            }}
          >
            {brand.productName} Design System v2 — refined
          </h1>
          <p
            className="max-w-3xl text-text-secondary"
            style={{ fontSize: '14px', lineHeight: 1.55 }}
          >
            Real React mounts of every Provedo surface. Every interactive element responds to hover
            / focus / press without remount. Use the global theme toggle in the header to flip dark
            mode in place.
          </p>
        </section>

        {/* Skip-link anchors — Foundation / Primitives / Charts live INSIDE
            `<StagedSections>` (a client wrapper); the wrapper subscribes to
            the global theme written by `ShowcaseHeader` on `<html data-theme>`
            and forwards the derived variant to every section so the page
            stays visually coherent across theme toggles (no light-island bug).
            Round-2 a11y F-2 anchor ids (SC 2.4.1 Bypass Blocks) live on
            wrapper divs inside `StagedSections`. */}
        <StagedSections />

        {/* Iconography + theme/motion sections live OUTSIDE stages — they're
            development utilities, not part of the visual canon. */}
        <section className="space-y-12 pt-8">
          <IconographySection />
          <DisclaimerSection />
          <ThemeSection />
        </section>

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
