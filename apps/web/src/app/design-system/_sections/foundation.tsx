import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Foundation — D3 canvas / surface / ink swatches.
 *
 * Shows the eight role tokens that anchor the dossier surface. Each swatch
 * carries hex (mono), role description (sans), and WCAG ratio against the
 * surface it actually sits on (mono, tabular). Numbers come straight from
 * `D3-luxe-variant.md` §3 — they're already AAA-verified by the spec
 * author and re-cited verbatim in the kickoff §0.
 */

interface FoundationToken {
  readonly name: string;
  readonly hex: string;
  readonly role: string;
  readonly wcag: string;
}

const SURFACE_TOKENS: readonly FoundationToken[] = [
  {
    name: '--d3-canvas',
    hex: '#161412',
    role: 'Page background. Warm-graphite with oak undertone.',
    wcag: 'base surface',
  },
  {
    name: '--d3-surface-1',
    hex: '#1E1B18',
    role: 'Primary card surface (+5L over canvas).',
    wcag: 'elev-2 host',
  },
  {
    name: '--d3-surface-2',
    hex: '#26221E',
    role: 'KPI / chat surface (+9L over canvas).',
    wcag: 'AAA-numeral host',
  },
  {
    name: '--d3-hairline',
    hex: '#2E2A26',
    role: '1px borders on every elevated surface.',
    wcag: 'border ≥3:1 vs surface',
  },
];

const INK_TOKENS: readonly FoundationToken[] = [
  {
    name: '--d3-ink',
    hex: '#F2EEE6',
    role: 'Warm ivory. Body, headings, KPI numerals.',
    wcag: 'AAA 13.6:1 on surface-2',
  },
  {
    name: '--d3-ink-mute',
    hex: '#9A9388',
    role: 'Labels, captions, axis ticks. ≥14px only.',
    wcag: 'AA 4.78:1 on canvas',
  },
];

const ACCENT_TOKENS: readonly FoundationToken[] = [
  {
    name: '--d3-accent-primary',
    hex: '#D9D17A',
    role: 'Chartreuse-cream. Active states, focus rings, accent KPI fill.',
    wcag: 'AAA 12.4:1 (canvas-on-accent)',
  },
  {
    name: '--d3-accent-secondary',
    hex: '#7A4F4A',
    role: 'Aged bordeaux. RESERVED for highlight (single bar / chip / tooltip).',
    wcag: 'NEVER for negatives',
  },
];

const SEMANTIC_TOKENS: readonly FoundationToken[] = [
  {
    name: '--d3-up',
    hex: '#B8C99A',
    role: 'Sage. Positive deltas only.',
    wcag: 'AAA 11.2:1 on canvas',
  },
  {
    name: '--d3-down',
    hex: '#C9907A',
    role: 'Terracotta. Negative deltas only.',
    wcag: 'AAA 7.8:1 on canvas',
  },
];

interface SwatchGroupProps {
  label: string;
  tokens: readonly FoundationToken[];
}

function SwatchGroup({ label, tokens }: SwatchGroupProps) {
  return (
    <DsRow label={label}>
      <div className="ds-tokens">
        {tokens.map((tok) => (
          <article key={tok.name} className="ds-token" style={{ color: tok.hex }}>
            <div className="ds-token__chip" aria-hidden />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p className="ds-token__name">{tok.name}</p>
              <p className="ds-token__hex">{tok.hex}</p>
            </div>
            <p className="ds-token__role">{tok.role}</p>
            <p className="ds-token__wcag">{tok.wcag}</p>
          </article>
        ))}
      </div>
    </DsRow>
  );
}

export function FoundationSection() {
  return (
    <SectionShell
      id="foundation"
      title="Foundation"
      meta="8 ROLES · WARM-GRAPHITE"
      description="The dossier surface speaks in eight roles. Bordeaux is reserved for highlight, never for negatives. Sage and terracotta carry direction. Hairline + shadow always — that's the Mercury signal."
    >
      <SwatchGroup label="Surfaces" tokens={SURFACE_TOKENS} />
      <SwatchGroup label="Ink" tokens={INK_TOKENS} />
      <SwatchGroup label="Accents" tokens={ACCENT_TOKENS} />
      <SwatchGroup label="Semantic (direction)" tokens={SEMANTIC_TOKENS} />
    </SectionShell>
  );
}
