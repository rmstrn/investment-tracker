import { brand } from '@investment-tracker/design-tokens/brand';
import { SideRail, type SideRailItem } from './_components/SideRail';
import { AiDossierSection } from './_sections/ai-dossier';
import { CardsSection } from './_sections/cards';
import { ChartsSection } from './_sections/charts';
import { DisclaimerSection } from './_sections/disclaimer';
import { ElevationSection } from './_sections/elevation';
import { FormsSection } from './_sections/forms';
import { FoundationSection } from './_sections/foundation';
import { IconographySection } from './_sections/iconography';
import { NavSection } from './_sections/nav';
import { PrimitivesSection } from './_sections/primitives';
import { ThemeSection } from './_sections/theme';
import { TypographySection } from './_sections/typography';

/**
 * `/design-system` — Provedo Design System v4 «Private Dossier».
 *
 * Re-authored 2026-05-01 against KICKOFF.md
 * (`.superpowers/brainstorm/2026-05-01-d3-lock/KICKOFF.md`) to migrate the
 * route from the retired neumorphism direction into D3 dialect — locked
 * by PO on 2026-05-01 after a 6-specialist review.
 *
 * Theme plumbing: `data-theme="dossier"` applied at the route's
 * `layout.tsx` wrapper level. This is the third theme value alongside
 * `light`/`dark` — opt-in only. The world's `<html data-theme>` stays
 * `light`/`dark` for every other route.
 *
 * Phase 1 sections (this slice):
 *   - Foundation         · 8 role tokens with hex / role / WCAG
 *   - Theme              · 10-token reference table + theme switcher chips
 *   - Typography         · Fraunces 3-surface specimen + lock callout (SURFACE #1)
 *   - Cards              · KPI cards with hover discipline (SURFACE #2)
 *   - Elevation          · 4-tier shadow stack with recipes
 *   - Primitives         · buttons / chips with all states
 *   - Forms              · inputs / selects / checkbox / radio / sculpted toggle
 *   - Nav                · sculpted nav (NOT pill) with 1.5px chartreuse underline
 *   - Iconography        · Lucide 18-icon core on D3 surfaces
 *   - Charts             · 9 placeholder shells (Phase 2 fills)
 *   - AI Dossier         · 5 example messages, no avatars / emoji / relative time
 *   - Disclaimer         · Lane-A regulatory disclosure pattern
 *
 * Drilldown H2 (the page title) IS the third Fraunces surface — see
 * `.ds-page-title` in `_styles/dossier.css`.
 */
export const metadata = {
  title: `Design System v4 · ${brand.productName}`,
  description: `Canonical internal showcase for ${brand.productName} design system v4 — D3 «Private Dossier».`,
  robots: { index: false, follow: false },
};

const RAIL_ITEMS: readonly SideRailItem[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'theme', label: 'Theme' },
  { id: 'typography', label: 'Typography' },
  { id: 'cards', label: 'Cards' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'forms', label: 'Forms' },
  { id: 'nav', label: 'Nav' },
  { id: 'iconography', label: 'Iconography' },
  { id: 'charts', label: 'Charts' },
  { id: 'ai-dossier', label: 'AI Dossier' },
  { id: 'disclaimer', label: 'Disclaimer' },
];

export default function DesignSystemPage() {
  return (
    <div className="ds-page">
      <SideRail items={RAIL_ITEMS} />
      <main className="ds-main">
        <header className="ds-page-head">
          <p className="ds-eyebrow">{brand.productName} · Design System v4 · Private Dossier</p>
          <h1 className="ds-page-title">A dossier laid open on a leather desk.</h1>
          <p className="ds-page-sub">
            The canonical D3 surface vocabulary. Tokens, type, depth, and the sculpted controls that
            carry the dossier register. Locked 2026-05-01 after PO review.
          </p>
        </header>

        <FoundationSection />
        <ThemeSection />
        <TypographySection />
        <CardsSection />
        <ElevationSection />
        <PrimitivesSection />
        <FormsSection />
        <NavSection />
        <IconographySection />
        <ChartsSection />
        <AiDossierSection />
        <DisclaimerSection />
      </main>
    </div>
  );
}
