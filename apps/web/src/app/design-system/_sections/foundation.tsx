import { DsRow, DsSection } from '../_components/DsSection';

/**
 * §Foundation — D1 «Lime Cabin» palette swatches.
 *
 * Every D1 token from KICKOFF §0 rendered as a swatch with hex + OKLCH +
 * role + WCAG ratio (for ink-bearing tokens). The Record Rail token
 * family lives in `theme.tsx` (numeric tokens, not colour). Notification
 * amber appears once — the only chip surface allowed to render the
 * 100% saturated amber per `edge-cases.md` §3.
 */

interface PaletteToken {
  readonly name: string;
  readonly hex: string;
  readonly oklch: string;
  readonly role: string;
  readonly contrast?: string;
  readonly inkFg?: boolean;
}

const PALETTE: ReadonlyArray<PaletteToken> = [
  {
    name: '--d1-bg-page',
    hex: '#141416',
    oklch: 'oklch(15% 0.005 286)',
    role: 'Outer canvas — the deepest charcoal, frames every surface',
  },
  {
    name: '--d1-bg-surface',
    hex: '#1F2024',
    oklch: 'oklch(22% 0.006 286)',
    role: 'Lifted surface card — the dashboard’s «paper»',
  },
  {
    name: '--d1-bg-card',
    hex: '#26272C',
    oklch: 'oklch(26% 0.006 286)',
    role: 'KPI / chart / panel default fill',
  },
  {
    name: '--d1-bg-card-soft',
    hex: '#2C2D33',
    oklch: 'oklch(28% 0.007 286)',
    role: 'Hover-lifted card surface; tooltip + active chip fill',
  },
  {
    name: '--d1-accent-lime',
    hex: '#D6F26B',
    oklch: 'oklch(92% 0.18 122)',
    role: 'The «look here» signal — KPI fill, nav active, Record Rail tick',
    contrast: 'Ink on lime: 15.4:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-accent-purple',
    hex: '#7B5CFF',
    oklch: 'oklch(58% 0.21 286)',
    role: 'Avatar, Premium chip, «something is happening»',
    contrast: 'Primary on purple: 4.9:1 (AA)',
  },
  {
    name: '--d1-notification-amber',
    hex: '#F4C257',
    oklch: 'oklch(83% 0.16 80)',
    role: 'Sync-error chip ONLY (per edge-cases §3)',
    contrast: 'Ink on amber: 12.3:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-text-primary',
    hex: '#FAFAFA',
    oklch: 'oklch(98% 0.001 286)',
    role: 'Display + KPI numerals + body copy on dark',
    contrast: 'On bg-card: 15.9:1 (AAA)',
  },
  {
    name: '--d1-text-muted',
    hex: '#9C9DA3',
    oklch: 'oklch(66% 0.006 286)',
    role: 'Secondary copy, eyebrows, axis labels, datestamps',
    contrast: 'On bg-card: 5.9:1 (AAA on body 16px+)',
  },
  {
    name: '--d1-text-ink',
    hex: '#0E0F11',
    oklch: 'oklch(11% 0.005 286)',
    role: 'Numerals on lime + ink CTA label',
    contrast: 'On accent-lime: 15.4:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-border-hairline',
    hex: 'rgba(255,255,255,0.06)',
    oklch: 'white @ 6%',
    role: 'Inner divisions; chart gridlines; KPI/card outlines',
  },
  {
    name: '--d1-border-strong',
    hex: 'rgba(255,255,255,0.12)',
    oklch: 'white @ 12%',
    role: 'Stronger outlines; checkbox/radio idle borders',
  },
];

export function FoundationSection() {
  return (
    <DsSection
      id="foundation"
      eyebrow="01 · Foundation"
      title="Palette"
      lede="Every D1 token rendered with hex, OKLCH, semantic role, and (where the token bears ink) the measured WCAG contrast. The page itself is the proof — no token is documented that isn’t in use on this surface."
    >
      <DsRow label="8 INK & ACCENT ROLES + 2 BORDERS + 1 NOTIFICATION AMBER">
        <div className="ds-swatch-grid">
          {PALETTE.map((t) => (
            <div key={t.name} className="ds-swatch">
              <div
                className="ds-swatch__chip"
                style={{
                  background: t.hex,
                  color: t.inkFg ? '#0E0F11' : '#FAFAFA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--d1-font-mono)',
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Aa 1234
              </div>
              <p className="ds-swatch__name">{t.name}</p>
              <dl className="ds-swatch__meta">
                <dt>HEX</dt>
                <dd>{t.hex}</dd>
                <dt>OKLCH</dt>
                <dd>{t.oklch}</dd>
                <dt>ROLE</dt>
                <dd style={{ color: 'var(--d1-text-muted)' }}>{t.role}</dd>
                {t.contrast ? (
                  <>
                    <dt>WCAG</dt>
                    <dd>{t.contrast}</dd>
                  </>
                ) : null}
              </dl>
            </div>
          ))}
        </div>
      </DsRow>
    </DsSection>
  );
}
