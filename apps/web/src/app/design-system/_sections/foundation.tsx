import { DsRow, DsSection } from '../_components/DsSection';

/**
 * §Foundation — D1 «Lime Cabin» palette swatches (post v5.1 split-token
 * + v5.2 bg-input retune 2026-05-02).
 *
 * Every D1 token from KICKOFF §0 rendered as a swatch with the actual
 * colour painted in (`background: token.value`), OKLCH metadata, semantic
 * role, and (where the token bears ink) the measured WCAG contrast. The
 * Record Rail numeric token family lives in `theme.tsx` (sizes, not
 * colour).
 *
 * Coverage matches `apps/web/src/app/style-d1/_lib/theme.css`:
 *   - 6 surface tokens (page → input)
 *   - 5 lime ladder stops (canvas → mute)
 *   - 3 data tokens (positive / negative / notification-amber) + 3 -soft variants
 *   - 4 status tokens (success / error / warning / info) + 4 -soft variants
 *   - 4 ink tokens (text-primary / muted / primary-deep / ink)
 *   - 2 border tokens (hairline / strong)
 *
 * v5.2 Palette repair: chip now renders `background: token.value` (the
 * actual `oklch(...)` string) — earlier rendering was reading the literal
 * label string `'oklch'` / `'rgba'` and producing invalid CSS, so every
 * swatch fell back to transparent (the palette read as broken). Soft
 * variants for data + status tokens added to align with the v5.1 split-
 * token model (PO «poisonous on cards» fix already shipped in CSS).
 */

interface PaletteToken {
  readonly name: string;
  /** Real CSS-paintable value (oklch(…) or rgba(…)). Drives the chip background. */
  readonly value: string;
  /** Format label for the metadata table. */
  readonly format: 'oklch' | 'rgba';
  readonly role: string;
  readonly contrast?: string;
  /** True → render `Aa 1234` glyph in dark ink (token reads as light surface). */
  readonly inkFg?: boolean;
}

const PALETTE: ReadonlyArray<PaletteToken> = [
  {
    name: '--d1-bg-page',
    value: 'oklch(12% 0.004 280)',
    format: 'oklch',
    role: 'Outer canvas — cool-violet 280° (v4 redirect from hue 75°)',
  },
  {
    name: '--d1-bg-surface',
    value: 'oklch(16% 0.004 280)',
    format: 'oklch',
    role: 'Lifted surface card — the dashboard’s «paper»',
  },
  {
    name: '--d1-bg-card',
    value: 'oklch(19% 0.005 280)',
    format: 'oklch',
    role: 'KPI / chart / panel default fill',
  },
  {
    name: '--d1-bg-card-soft',
    value: 'oklch(22% 0.005 280)',
    format: 'oklch',
    role: 'Press-tier hover bg, segmented active well',
  },
  {
    name: '--d1-bg-card-elevated',
    value: 'oklch(23% 0.005 280)',
    format: 'oklch',
    role: 'Read-tier surface fill (KPI / panel)',
  },
  {
    name: '--d1-bg-input',
    value: 'oklch(10% 0.004 280)',
    format: 'oklch',
    role: 'Write-tier sub-canvas well (form fields) — v5.2 softer deboss',
  },
  {
    name: '--d1-accent-lime-canvas',
    value: 'oklch(20% 0.012 117)',
    format: 'oklch',
    role: 'Atmospheric tint, disclaimer wash',
  },
  {
    name: '--d1-accent-lime-soft',
    value: 'oklch(34% 0.045 117)',
    format: 'oklch',
    role: 'Chip / avatar fill, premium bg, AI plate',
  },
  {
    name: '--d1-accent-lime-hairline',
    value: 'oklch(68% 0.13 117)',
    format: 'oklch',
    role: '1px strokes, borders, focus rings',
  },
  {
    name: '--d1-accent-lime-signal',
    value: 'oklch(91% 0.21 117)',
    format: 'oklch',
    role: 'SIGNATURE — Record Rail / look-here KPI / CTA primary',
    contrast: 'Ink on signal: 15.4:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-accent-lime-mute',
    value: 'oklch(72% 0.16 117)',
    format: 'oklch',
    role: 'AI byline / cohort marker / default chart bar',
    inkFg: true,
  },
  {
    name: '--d1-data-positive',
    value: 'oklch(82% 0.13 145)',
    format: 'oklch',
    role: 'TEXT/STROKE — pistachio for chart line strokes, axis ink, gain numerals',
    contrast: 'Ink on positive: ~12:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-data-positive-soft',
    value: 'oklch(70% 0.05 145)',
    format: 'oklch',
    role: 'FILL/SURFACE — KPI delta bg, chip fill, chart-fill positives (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-data-negative',
    value: 'oklch(78% 0.14 25)',
    format: 'oklch',
    role: 'TEXT/STROKE — terracotta for chart line strokes, axis ink, loss numerals',
    contrast: 'Ink on negative: ~10:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-data-negative-soft',
    value: 'oklch(65% 0.06 25)',
    format: 'oklch',
    role: 'FILL/SURFACE — KPI delta bg, chip fill, chart-fill negatives (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-notification-amber',
    value: 'oklch(82% 0.135 87)',
    format: 'oklch',
    role: 'TEXT/INK — count-badge ink, status text (anchor of gouache triad)',
    contrast: 'Ink on amber: ~12:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-notification-amber-soft',
    value: 'oklch(70% 0.05 87)',
    format: 'oklch',
    role: 'FILL/SURFACE — chip backgrounds, badge fills (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-status-success',
    value: 'oklch(82% 0.13 145)',
    format: 'oklch',
    role: 'STATUS TEXT — success messaging (matches data-positive hue, MAY drift)',
    inkFg: true,
  },
  {
    name: '--d1-status-success-soft',
    value: 'oklch(70% 0.05 145)',
    format: 'oklch',
    role: 'STATUS FILL — success chip / badge background (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-status-error',
    value: 'oklch(78% 0.14 25)',
    format: 'oklch',
    role: 'STATUS TEXT — error messaging (matches data-negative hue, MAY drift)',
    inkFg: true,
  },
  {
    name: '--d1-status-error-soft',
    value: 'oklch(65% 0.06 25)',
    format: 'oklch',
    role: 'STATUS FILL — error chip / badge background (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-status-warning',
    value: 'oklch(82% 0.135 87)',
    format: 'oklch',
    role: 'STATUS TEXT — warning messaging',
    inkFg: true,
  },
  {
    name: '--d1-status-warning-soft',
    value: 'oklch(70% 0.05 87)',
    format: 'oklch',
    role: 'STATUS FILL — warning chip / badge background (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-status-info',
    value: 'oklch(72% 0.1 240)',
    format: 'oklch',
    role: 'STATUS TEXT — info messaging (cool blue-grey, no data-side counterpart)',
    inkFg: true,
  },
  {
    name: '--d1-status-info-soft',
    value: 'oklch(60% 0.05 240)',
    format: 'oklch',
    role: 'STATUS FILL — info chip / badge background (v5.3 mid-tone)',
    inkFg: true,
  },
  {
    name: '--d1-text-primary',
    value: 'oklch(98% 0.001 280)',
    format: 'oklch',
    role: 'Display + KPI numerals + body copy on dark',
    contrast: 'On bg-card: ~16:1 (AAA)',
    inkFg: true,
  },
  {
    name: '--d1-text-muted',
    value: 'oklch(64% 0.005 280)',
    format: 'oklch',
    role: 'Secondary copy, eyebrows, axis labels, datestamps',
  },
  {
    name: '--d1-text-primary-deep',
    value: 'oklch(20% 0.004 280)',
    format: 'oklch',
    role: 'Ink-deep — formerly premium chip text (now used for AAA on lime-soft surfaces)',
  },
  {
    name: '--d1-text-ink',
    value: 'oklch(11% 0.003 280)',
    format: 'oklch',
    role: 'Numerals on lime-signal + ink CTA label',
    contrast: 'On lime-signal: 15.4:1 (AAA)',
  },
  {
    name: '--d1-border-hairline',
    value: 'rgba(255, 255, 255, 0.06)',
    format: 'rgba',
    role: 'Inner divisions; chart gridlines; KPI/card outlines',
  },
  {
    name: '--d1-border-strong',
    value: 'rgba(255, 255, 255, 0.12)',
    format: 'rgba',
    role: 'Stronger outlines; checkbox/radio idle borders',
  },
];

export function FoundationSection() {
  return (
    <DsSection
      id="foundation"
      eyebrow="01 · Foundation"
      title="Palette"
      lede="Every D1 token rendered with the actual painted swatch, OKLCH metadata, semantic role, and (where the token bears ink) the measured WCAG contrast. The page itself is the proof — no token is documented that isn’t in use on this surface. Split-token model (v5.1): base tokens are TEXT/STROKE; `-soft` variants are FILL/SURFACE."
    >
      <DsRow label="6 SURFACE · 5 LIME · 6 DATA + AMBER · 8 STATUS · 4 INK · 2 BORDER">
        <div className="ds-swatch-grid">
          {PALETTE.map((t) => (
            <div key={t.name} className="ds-swatch">
              <div
                className="ds-swatch__chip"
                style={{
                  background: t.value,
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
                <dt>FORMAT</dt>
                <dd>{t.format}</dd>
                <dt>VALUE</dt>
                <dd>{t.value}</dd>
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
