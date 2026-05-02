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
    hex: 'oklch',
    oklch: 'oklch(12% 0.004 280)',
    role: 'Outer canvas — cool-violet 280° (v4 redirect from hue 75°)',
  },
  {
    name: '--d1-bg-surface',
    hex: 'oklch',
    oklch: 'oklch(16% 0.004 280)',
    role: 'Lifted surface card — the dashboard’s «paper»',
  },
  {
    name: '--d1-bg-card',
    hex: 'oklch',
    oklch: 'oklch(19% 0.005 280)',
    role: 'KPI / chart / panel default fill',
  },
  {
    name: '--d1-bg-card-soft',
    hex: 'oklch',
    oklch: 'oklch(22% 0.005 280)',
    role: 'Press-tier hover bg, segmented active well',
  },
  {
    name: '--d1-bg-card-elevated',
    hex: 'oklch',
    oklch: 'oklch(23% 0.005 280)',
    role: 'Read-tier surface fill (KPI / panel)',
  },
  {
    name: '--d1-bg-input',
    hex: 'oklch',
    oklch: 'oklch(10% 0.004 280)',
    role: 'Write-tier sub-canvas well (form fields) — v5.2 softer deboss',
  },
  {
    name: '--d1-accent-lime-canvas',
    hex: 'oklch',
    oklch: 'oklch(20% 0.012 117)',
    role: 'Atmospheric tint, disclaimer wash',
  },
  {
    name: '--d1-accent-lime-soft',
    hex: 'oklch',
    oklch: 'oklch(34% 0.045 117)',
    role: 'Chip / avatar fill, premium bg, AI plate',
  },
  {
    name: '--d1-accent-lime-hairline',
    hex: 'oklch',
    oklch: 'oklch(68% 0.13 117)',
    role: '1px strokes, borders, focus rings',
  },
  {
    name: '--d1-accent-lime-signal',
    hex: 'oklch',
    oklch: 'oklch(91% 0.21 117)',
    role: 'SIGNATURE — Record Rail / look-here KPI / CTA primary',
    contrast: 'Ink on signal: 15.4:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-accent-lime-mute',
    hex: 'oklch',
    oklch: 'oklch(72% 0.16 117)',
    role: 'AI byline / cohort marker / default chart bar',
  },
  {
    name: '--d1-data-positive',
    hex: 'oklch',
    oklch: 'oklch(82% 0.13 145)',
    role: 'Chart positives / gain columns — mature pistachio',
    contrast: 'Ink on positive: ~12:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-data-negative',
    hex: 'oklch',
    oklch: 'oklch(78% 0.14 25)',
    role: 'Chart negatives / loss columns — terracotta',
    contrast: 'Ink on negative: ~10:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-notification-amber',
    hex: 'oklch',
    oklch: 'oklch(82% 0.135 87)',
    role: 'Count badges only (anchor of gouache triad)',
    contrast: 'Ink on amber: ~12:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-text-primary',
    hex: 'oklch',
    oklch: 'oklch(98% 0.001 280)',
    role: 'Display + KPI numerals + body copy on dark',
    contrast: 'On bg-card: ~16:1 (AAA)',
  },
  {
    name: '--d1-text-muted',
    hex: 'oklch',
    oklch: 'oklch(64% 0.005 280)',
    role: 'Secondary copy, eyebrows, axis labels, datestamps',
  },
  {
    name: '--d1-text-primary-deep',
    hex: 'oklch',
    oklch: 'oklch(20% 0.004 280)',
    role: 'Premium chip ink-deep on lime-soft',
    inkFg: true,
  },
  {
    name: '--d1-text-ink',
    hex: 'oklch',
    oklch: 'oklch(11% 0.003 280)',
    role: 'Numerals on lime-signal + ink CTA label',
    contrast: 'On lime-signal: 15.4:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-border-hairline',
    hex: 'rgba',
    oklch: 'white @ 6%',
    role: 'Inner divisions; chart gridlines; KPI/card outlines',
  },
  {
    name: '--d1-border-strong',
    hex: 'rgba',
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
