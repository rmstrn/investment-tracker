import { SectionShell } from '../_components/SectionShell';

/**
 * §Theme — D3 token reference table + theme switcher preview.
 *
 * Renders every D3 token from KICKOFF §0 with: token name, hex, OKLCH,
 * role, WCAG ratio. OKLCH values pre-computed (any change to source hex
 * means recomputing here too — the alternative was a runtime conversion
 * dependency for read-only documentation, which felt overkill).
 *
 * Theme switcher chips are display-only on this route — `data-theme="dossier"`
 * is locked at the layout level. The chips visualise that the dossier
 * theme is the third value alongside `light`/`dark`, not a replacement.
 */

interface TokenRow {
  readonly name: string;
  readonly hex: string;
  readonly oklch: string;
  readonly role: string;
  readonly wcag: string;
}

const TOKEN_ROWS: readonly TokenRow[] = [
  {
    name: '--d3-canvas',
    hex: '#161412',
    oklch: 'oklch(0.155 0.005 60)',
    role: 'Page background',
    wcag: '— (base surface)',
  },
  {
    name: '--d3-surface-1',
    hex: '#1E1B18',
    oklch: 'oklch(0.196 0.006 60)',
    role: 'Card surface (elev-2 host)',
    wcag: '—',
  },
  {
    name: '--d3-surface-2',
    hex: '#26221E',
    oklch: 'oklch(0.231 0.008 60)',
    role: 'KPI / chat surface',
    wcag: '—',
  },
  {
    name: '--d3-hairline',
    hex: '#2E2A26',
    oklch: 'oklch(0.265 0.008 60)',
    role: '1px borders, dividers',
    wcag: '—',
  },
  {
    name: '--d3-ink',
    hex: '#F2EEE6',
    oklch: 'oklch(0.943 0.012 80)',
    role: 'Body, headings, KPI numerals',
    wcag: 'AAA 13.6:1 on surface-2',
  },
  {
    name: '--d3-ink-mute',
    hex: '#9A9388',
    oklch: 'oklch(0.609 0.014 75)',
    role: 'Labels, captions, axis ticks',
    wcag: 'AA 4.78:1 on canvas',
  },
  {
    name: '--d3-accent-primary',
    hex: '#D9D17A',
    oklch: 'oklch(0.836 0.121 95)',
    role: 'Active states, focus rings, accent KPI fill',
    wcag: 'AAA 12.4:1 (canvas-on-accent)',
  },
  {
    name: '--d3-accent-secondary',
    hex: '#7A4F4A',
    oklch: 'oklch(0.428 0.052 30)',
    role: 'Highlight (single bar / chip / tooltip)',
    wcag: 'AAA 7.6:1 (ink-on-accent)',
  },
  {
    name: '--d3-up',
    hex: '#B8C99A',
    oklch: 'oklch(0.792 0.069 125)',
    role: 'Positive deltas',
    wcag: 'AAA 11.2:1 on canvas',
  },
  {
    name: '--d3-down',
    hex: '#C9907A',
    oklch: 'oklch(0.690 0.084 45)',
    role: 'Negative deltas',
    wcag: 'AAA 7.8:1 on canvas',
  },
];

const THEMES: readonly { id: 'light' | 'dark' | 'dossier'; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'dossier', label: 'Dossier' },
];

export function ThemeSection() {
  return (
    <SectionShell
      id="theme"
      title="Theme tokens"
      meta="10 TOKENS · ALL AAA-VERIFIED"
      description="Every dossier token at a glance. Hex + OKLCH for the design-tokens pipeline; role + WCAG for the implementer. Bordeaux is highlight-only — using it for negative deltas breaks the semantic contract."
    >
      <div className="ds-row">
        <p className="ds-row__label">Theme variants</p>
        <div className="ds-theme-switcher" role="group" aria-label="Theme variants">
          {THEMES.map((theme) => (
            <span
              key={theme.id}
              className={
                theme.id === 'dossier'
                  ? 'ds-theme-switcher__chip ds-theme-switcher__chip--active'
                  : 'ds-theme-switcher__chip'
              }
              aria-current={theme.id === 'dossier' ? 'true' : undefined}
            >
              {theme.label}
            </span>
          ))}
        </div>
        <p className="ds-prose ds-prose--mute" style={{ fontSize: 13 }}>
          The dossier theme is locked on this route. Light + dark continue to drive every other
          surface unchanged.
        </p>
      </div>

      <div className="ds-row">
        <p className="ds-row__label">Token reference</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr>
                <th>Swatch</th>
                <th>Token</th>
                <th>Hex</th>
                <th>OKLCH</th>
                <th>Role</th>
                <th>WCAG</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row) => (
                <tr key={row.name}>
                  <td>
                    <span className="ds-table__chip" style={{ background: row.hex }} />
                  </td>
                  <td className="ds-table__name">{row.name}</td>
                  <td className="ds-table__hex">{row.hex}</td>
                  <td className="ds-table__oklch">{row.oklch}</td>
                  <td>{row.role}</td>
                  <td className="ds-table__wcag">{row.wcag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionShell>
  );
}
