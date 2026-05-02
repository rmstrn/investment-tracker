import { brand } from '@investment-tracker/design-tokens/brand';
import { AiSurfaceSection } from './_sections/ai-surface';
import { CardsSection } from './_sections/cards';
import { ChartsSection } from './_sections/charts';
import { DisclaimerSection } from './_sections/disclaimer';
import { ElevationAndRadiiSection } from './_sections/elevation-and-radii';
import { FormsSection } from './_sections/forms';
import { FoundationSection } from './_sections/foundation';
import { IconographySection } from './_sections/iconography';
import { LimeDisciplineSection } from './_sections/lime-discipline';
import { PillVocabularySection } from './_sections/pill-vocabulary';
import { PrimitivesSection } from './_sections/primitives';
import { RecordRailSection } from './_sections/record-rail';
import { ThemeSection } from './_sections/theme';
import { TypographySection } from './_sections/typography';

export const metadata = {
  title: `Design System · ${brand.productName}`,
  description: `Single canonical D1 «Lime Cabin» showcase for ${brand.productName} — every token, primitive, component, and chart specimen on one surface.`,
  robots: { index: false, follow: false },
};

interface SideNavLink {
  readonly href: string;
  readonly index: string;
  readonly label: string;
}

const SIDE_NAV: ReadonlyArray<SideNavLink> = [
  { href: '#foundation', index: '01', label: 'Foundation' },
  { href: '#theme', index: '02', label: 'Theme' },
  { href: '#typography', index: '03', label: 'Typography' },
  { href: '#pill-vocabulary', index: '04', label: 'Pill Vocabulary' },
  { href: '#primitives', index: '05', label: 'Primitives' },
  { href: '#cards', index: '06', label: 'Cards' },
  { href: '#forms', index: '07', label: 'Forms' },
  { href: '#elevation-and-radii', index: '08', label: 'Elevation & Radii' },
  { href: '#iconography', index: '09', label: 'Iconography' },
  { href: '#record-rail', index: '10', label: 'Record Rail' },
  { href: '#ai-surface', index: '11', label: 'AI Surface' },
  { href: '#lime-discipline', index: '12', label: 'Lime Discipline' },
  { href: '#charts', index: '13', label: 'Charts' },
  { href: '#disclaimer', index: '14', label: 'Disclaimer' },
];

/**
 * `/design-system` — D1 «Lime Cabin» canonical showcase.
 *
 * Rebuilt 2026-05-01 (Phase 1 Step B of the D1 migration; KICKOFF at
 * `.superpowers/brainstorm/2026-05-01-d1-fix-pass/KICKOFF.md`).
 *
 * Every D1 token, primitive, component, and chart specimen lives on
 * this surface. The route runs under `[data-theme="lime-cabin"]` per
 * the layout wrapper; other routes are unaffected. The 9 chart shells
 * in §Charts are placeholders — Phase 2 fills them with the visx
 * components restyled into D1 dialect.
 */
export default function DesignSystemPage() {
  return (
    <div className="ds-showcase">
      <nav className="ds-sidenav" aria-label="Design system sections">
        <div className="ds-sidenav__brand">
          <span className="d1-nav__brand" aria-hidden>
            P
          </span>
          <div>
            <p className="ds-sidenav__product">{brand.productName} · Design System</p>
            <p className="ds-sidenav__title">D1 «Lime Cabin» v4</p>
          </div>
        </div>
        {SIDE_NAV.map((link) => (
          <a key={link.href} href={link.href} className="ds-sidenav__link">
            <span className="ds-sidenav__index">{link.index}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <main>
        <header style={{ paddingBottom: 16 }}>
          <p className="ds-page-eyebrow">{brand.productName} · Design System v4 · Lime Cabin</p>
          <h1 className="ds-page-title">Notice what you’d miss.</h1>
          <p className="ds-page-lede">
            Every D1 token, primitive, component, and chart specimen on one surface. The page itself
            is the canonical reference: every lime surface visible here is sanctioned, every pill
            belongs to the pill vocabulary, every numeral is Geist Mono with `tnum + ss01`, every
            persistent data zone is rail-headed.
          </p>
        </header>

        <FoundationSection />
        <ThemeSection />
        <TypographySection />
        <PillVocabularySection />
        <PrimitivesSection />
        <CardsSection />
        <FormsSection />
        <ElevationAndRadiiSection />
        <IconographySection />
        <RecordRailSection />
        <AiSurfaceSection />
        <LimeDisciplineSection />
        <ChartsSection />
        <DisclaimerSection />

        <footer
          style={{
            marginTop: 48,
            paddingTop: 16,
            borderTop: '1px solid var(--d1-border-hairline)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--d1-font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--d1-text-muted)',
            }}
          >
            Generated from `_styles/lime-cabin.css` (route-local) ·{' '}
            <code>brand.productName = &quot;{brand.productName}&quot;</code>
          </p>
        </footer>
      </main>
    </div>
  );
}
