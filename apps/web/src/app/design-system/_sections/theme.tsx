import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Theme — `data-theme` mechanism + the canonical token reference table.
 *
 * The page itself runs under `data-theme="lime-cabin"` (route-local
 * opt-in via `layout.tsx`). The `light` / `dark` rows below explain the
 * surface defaults the rest of the app keeps; only the `lime-cabin` row
 * is rendered live on this surface.
 *
 * The token reference table is the single source of truth for every D1
 * token + the new `--d1-rail-*` family from the Provedo Record Rail
 * spec.
 */

interface ThemeRow {
  readonly name: string;
  readonly bg: string;
  readonly text: string;
  readonly accent: string;
  readonly note: string;
}

const THEMES: ReadonlyArray<ThemeRow> = [
  {
    name: 'light',
    bg: '#FFFFFF',
    text: '#1C1B26',
    accent: '#1C1B26',
    note: 'App default; routes that do NOT opt in keep this surface',
  },
  {
    name: 'dark',
    bg: '#1C1B26',
    text: '#F4F0E4',
    accent: '#F08A3C',
    note: 'User-toggled dark mode; not the canonical Provedo surface',
  },
  {
    name: 'lime-cabin',
    bg: '#141416',
    text: '#FAFAFA',
    accent: '#D6F26B',
    note: 'D1 «Lime Cabin» — the canonical Provedo surface (locked 2026-05-01)',
  },
];

interface TokenRow {
  readonly token: string;
  readonly value: string;
  readonly role: string;
}

const RAIL_TOKENS: ReadonlyArray<TokenRow> = [
  { token: '--d1-rail-height', value: '14px', role: 'Tick + datestamp baseline-aligned' },
  { token: '--d1-rail-gap-tick', value: '4px', role: 'Tick → datestamp gap' },
  { token: '--d1-rail-gap-line', value: '8px', role: 'Datestamp → hairline gap' },
  { token: '--d1-rail-content-gap', value: '12px', role: 'Rail → first content line below' },
  { token: '--d1-rail-date-size', value: '11px', role: 'Datestamp font size' },
  { token: '--d1-rail-date-tracking', value: '0.04em', role: 'Datestamp letter-spacing' },
  {
    token: '--d1-rail-line-color',
    value: 'rgba(214, 242, 107, 0.3)',
    role: 'Hairline — lime @ 30% opacity',
  },
  { token: '--d1-rail-tick-w', value: '6px', role: 'Tick width — letterpress weight' },
  { token: '--d1-rail-tick-h', value: '2px', role: 'Tick height' },
];

const PALETTE_TOKENS: ReadonlyArray<TokenRow> = [
  { token: '--d1-bg-page', value: 'oklch(12% 0.004 280)', role: 'Outer canvas (cool-violet 280°)' },
  { token: '--d1-bg-surface', value: 'oklch(16% 0.004 280)', role: 'Lifted surface' },
  { token: '--d1-bg-card', value: 'oklch(19% 0.005 280)', role: 'KPI / chart fill' },
  { token: '--d1-bg-card-soft', value: 'oklch(22% 0.005 280)', role: 'Press-tier well; tooltip' },
  {
    token: '--d1-bg-card-elevated',
    value: 'oklch(23% 0.005 280)',
    role: 'Read-tier KPI / panel fill',
  },
  {
    token: '--d1-bg-input',
    value: 'oklch(10% 0.004 280)',
    role: 'Sub-canvas form well (v5.2 softer deboss)',
  },
  {
    token: '--d1-accent-lime-canvas',
    value: 'oklch(20% 0.012 117)',
    role: 'Atmospheric tint, disclaimer wash',
  },
  {
    token: '--d1-accent-lime-soft',
    value: 'oklch(34% 0.045 117)',
    role: 'Chip / avatar fill, premium bg',
  },
  {
    token: '--d1-accent-lime-hairline',
    value: 'oklch(68% 0.13 117)',
    role: '1px strokes, borders, focus rings',
  },
  {
    token: '--d1-accent-lime-signal',
    value: 'oklch(91% 0.21 117)',
    role: 'SIGNATURE — Record Rail / look-here / CTA',
  },
  {
    token: '--d1-accent-lime-mute',
    value: 'oklch(72% 0.16 117)',
    role: 'AI byline / cohort / default chart bar',
  },
  {
    token: '--d1-data-positive',
    value: 'oklch(82% 0.13 145)',
    role: 'TEXT/STROKE — pistachio (line strokes, axis ink)',
  },
  {
    token: '--d1-data-positive-soft',
    value: 'oklch(70% 0.05 145)',
    role: 'FILL/SURFACE — chart fills, KPI delta bg (v5.3 mid-tone)',
  },
  {
    token: '--d1-data-negative',
    value: 'oklch(78% 0.14 25)',
    role: 'TEXT/STROKE — terracotta (line strokes, axis ink)',
  },
  {
    token: '--d1-data-negative-soft',
    value: 'oklch(65% 0.06 25)',
    role: 'FILL/SURFACE — chart fills, KPI delta bg (v5.3 mid-tone)',
  },
  {
    token: '--d1-notification-amber',
    value: 'oklch(82% 0.135 87)',
    role: 'TEXT/INK — count-badge ink, status text',
  },
  {
    token: '--d1-notification-amber-soft',
    value: 'oklch(70% 0.05 87)',
    role: 'FILL/SURFACE — badge fills (v5.3 mid-tone)',
  },
  {
    token: '--d1-status-success',
    value: 'oklch(82% 0.13 145)',
    role: 'STATUS TEXT — success (matches data-positive hue)',
  },
  {
    token: '--d1-status-success-soft',
    value: 'oklch(70% 0.05 145)',
    role: 'STATUS FILL — success chip background (v5.3 mid-tone)',
  },
  {
    token: '--d1-status-error',
    value: 'oklch(78% 0.14 25)',
    role: 'STATUS TEXT — error (matches data-negative hue)',
  },
  {
    token: '--d1-status-error-soft',
    value: 'oklch(65% 0.06 25)',
    role: 'STATUS FILL — error chip background (v5.3 mid-tone)',
  },
  {
    token: '--d1-status-warning',
    value: 'oklch(82% 0.135 87)',
    role: 'STATUS TEXT — warning',
  },
  {
    token: '--d1-status-warning-soft',
    value: 'oklch(70% 0.05 87)',
    role: 'STATUS FILL — warning chip background (v5.3 mid-tone)',
  },
  {
    token: '--d1-status-info',
    value: 'oklch(72% 0.1 240)',
    role: 'STATUS TEXT — info (cool blue-grey)',
  },
  {
    token: '--d1-status-info-soft',
    value: 'oklch(60% 0.05 240)',
    role: 'STATUS FILL — info chip background (v5.3 mid-tone)',
  },
  { token: '--d1-text-primary', value: 'oklch(98% 0.001 280)', role: 'Display + body on dark' },
  { token: '--d1-text-muted', value: 'oklch(64% 0.005 280)', role: 'Secondary; eyebrows; axis' },
  {
    token: '--d1-text-primary-deep',
    value: 'oklch(20% 0.004 280)',
    role: 'Premium chip ink-deep',
  },
  { token: '--d1-text-ink', value: 'oklch(11% 0.003 280)', role: 'Numerals on lime-signal' },
  { token: '--d1-border-hairline', value: 'rgba(255,255,255,0.06)', role: 'Inner divisions' },
  { token: '--d1-border-strong', value: 'rgba(255,255,255,0.12)', role: 'Stronger outlines' },
];

export function ThemeSection() {
  return (
    <DsSection
      id="theme"
      eyebrow="02 · Theme"
      title="data-theme switcher + token reference"
      lede="`data-theme` lives on the wrapper element. `light` / `dark` are app defaults; `lime-cabin` is the canonical Provedo surface, opted in here per-route. Every token in the lime-cabin variant is documented below."
    >
      <DsRow label="THEME VARIANTS">
        <table className="ds-table">
          <thead>
            <tr>
              <th>data-theme</th>
              <th>Surface</th>
              <th>Ink</th>
              <th>Accent</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            {THEMES.map((t) => (
              <tr key={t.name}>
                <td className="mono">{t.name}</td>
                <td>
                  <span className="ds-token-chip" style={{ background: t.bg }} />
                  <span className="mono">{t.bg}</span>
                </td>
                <td>
                  <span className="ds-token-chip" style={{ background: t.text }} />
                  <span className="mono">{t.text}</span>
                </td>
                <td>
                  <span className="ds-token-chip" style={{ background: t.accent }} />
                  <span className="mono">{t.accent}</span>
                </td>
                <td style={{ color: 'var(--d1-text-muted)' }}>{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DsRow>

      <DsRow label="PALETTE TOKENS — `lime-cabin`">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {PALETTE_TOKENS.map((t) => (
              <tr key={t.token}>
                <td className="mono">
                  <span className="ds-token-chip" style={{ background: t.value }} />
                  {t.token}
                </td>
                <td className="mono">{t.value}</td>
                <td style={{ color: 'var(--d1-text-muted)' }}>{t.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DsRow>

      <DsRow label="PROVEDO RECORD RAIL TOKENS">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {RAIL_TOKENS.map((t) => (
              <tr key={t.token}>
                <td className="mono">{t.token}</td>
                <td className="mono">{t.value}</td>
                <td style={{ color: 'var(--d1-text-muted)' }}>{t.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DsRow>

      <DsCallout heading="Plumbing route-local for now">
        Tokens live in `apps/web/src/app/design-system/_styles/lime-cabin.css`, rescoped to
        `[data-theme=&quot;lime-cabin&quot;]`. Phase 1 deliberately skips the Style Dictionary
        multi-theme emit (KICKOFF §2.2 fallback) so this rebuild ships without touching
        `packages/design-tokens/build.js`. Migration into the design-tokens package lands in a
        follow-up slice.
      </DsCallout>
    </DsSection>
  );
}
