import { brand } from '@investment-tracker/design-tokens/brand';
import { ShowcaseHeader } from './_components/ShowcaseHeader';
import { StageFrame } from './_components/StageFrame';
import { CardsSection } from './_sections/cards';
import { ChartsSection } from './_sections/charts';
import { DisclaimerSection } from './_sections/disclaimer';
import { FormsSection } from './_sections/forms';
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
 * Re-architected 2026-04-29 to match the static visual reference at
 * `apps/web/public/design-system.html` (Provedo Design System v2 — Showcase).
 * Two stages — light + dark — render stacked so the page is a side-by-side
 * compare without a toggle. The sticky header still owns a global theme
 * toggle which flips outer surfaces but the stages themselves stay pinned.
 *
 * Inside each stage the same set of sections render: foundation, signature
 * hero, primitives (curated permutations), forms (product-context inputs),
 * cards (portfolio · insight · empty), charts (with custom Recharts theming
 * via `buildChartTheme`).
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
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'var(--accent, var(--color-accent-default))',
              fontWeight: 500,
            }}
          >
            {brand.productName} · Design System v2 · Showcase
          </p>
          <h1
            className="font-semibold tracking-tight text-text-primary"
            style={{ fontSize: '40px', letterSpacing: '-0.035em', lineHeight: 1.05 }}
          >
            Notice <span style={{ fontWeight: 700 }}>what</span> you&apos;d miss.
          </h1>
          <p
            className="max-w-3xl text-text-secondary"
            style={{ fontSize: '13px', lineHeight: 1.55 }}
          >
            Real React mounts of every Provedo surface, both themes side-by-side. Every interactive
            element responds to hover / focus / press without remount. The two stages below
            replicate <code style={{ fontFamily: 'var(--font-mono)' }}>design-system.html</code> v2
            visual contract; the global toggle in the header stays for verifying outer surfaces.
          </p>
        </section>

        <StageFrame
          id="light-v2"
          variant="light"
          eyebrow="PROVEDO · DESIGN SYSTEM v2 · LIGHT"
          headline="Notice what you'd miss."
          accentWord="what"
          meta={
            <>
              Geist · Geist Mono
              <br />
              Locked palette + ink CTA
              <br />
              No italic · tabular nums
            </>
          }
        >
          <FoundationSection variant="light" />
          <PrimitivesSection variant="light" />
          <FormsSection variant="light" />
          <CardsSection variant="light" />
          <ChartsSection variant="light" />
        </StageFrame>

        <StageFrame
          id="dark-v2"
          variant="dark"
          eyebrow="PROVEDO · DESIGN SYSTEM v2 · DARK"
          headline="Notice what you'd miss."
          accentWord="what"
          meta={
            <>
              Neutral cool dark · #0E0E12
              <br />
              Restrained shadows (no glow)
              <br />
              Cream-on-dark CTA flip
            </>
          }
        >
          <FoundationSection variant="dark" />
          <PrimitivesSection variant="dark" />
          <FormsSection variant="dark" />
          <CardsSection variant="dark" />
          <ChartsSection variant="dark" />
        </StageFrame>

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
