'use client';

import { useShowcaseTheme } from '../_hooks/useShowcaseTheme';
import { CardsSection } from '../_sections/cards';
import { ChartsSection } from '../_sections/charts';
import { FormsSection } from '../_sections/forms';
import { FoundationSection } from '../_sections/foundation';
import { MarketingCandySection } from '../_sections/marketing-candy';
import { MascotFinalsSection } from '../_sections/mascot-finals';
import { PrimitivesSection } from '../_sections/primitives';
import { StageFrame } from './StageFrame';

/**
 * Live-themed stage body for `/design-system`.
 *
 * Subscribes to the global theme (set by `ShowcaseHeader` on `<html data-theme>`)
 * via {@link useShowcaseTheme} and forwards the derived variant to every section
 * inside the stage. Fixes the "light island on dark page" bug where sections
 * were locked to `variant="light"` and ignored the header toggle.
 *
 * Kept as a separate client component so the parent `page.tsx` can stay a
 * Server Component and continue exporting route `metadata`.
 */
export function StagedSections() {
  const theme = useShowcaseTheme();
  const eyebrow =
    theme === 'light' ? 'PROVEDO · DESIGN SYSTEM v2 · LIGHT' : 'PROVEDO · DESIGN SYSTEM v2 · DARK';

  return (
    <StageFrame
      id="light-v2"
      variant={theme}
      eyebrow={eyebrow}
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
      <div id="foundation" className="showcase-anchor">
        <FoundationSection variant={theme} />
      </div>
      <div id="primitives" className="showcase-anchor">
        <PrimitivesSection variant={theme} />
      </div>
      <FormsSection variant={theme} />
      <div id="cards" className="showcase-anchor">
        <CardsSection variant={theme} />
      </div>
      <div id="charts" className="showcase-anchor">
        <ChartsSection variant={theme} />
      </div>
      <div id="marketing-candy" className="showcase-anchor">
        <MarketingCandySection />
      </div>
      <div id="mascot-finals" className="showcase-anchor">
        <MascotFinalsSection />
      </div>
    </StageFrame>
  );
}
