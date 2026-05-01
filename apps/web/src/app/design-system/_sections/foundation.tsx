'use client';

import { DsRow, DsSection } from '../_components/SectionHead';
import { SignatureHero } from '../_components/SignatureHero';

/**
 * §Foundation — color, typography, depth.
 *
 * Stage-aware section: receives `variant` ("light" | "dark") so each stage
 * can render its own swatches with the corresponding hex labels even though
 * tokens flip via the parent `data-theme` attribute scope.
 *
 * Real Provedo product copy used in typography demos (no Lorem). Mirrors
 * the static reference (apps/web/public/design-system.html §Typography).
 */

interface ColorRow {
  readonly label: string;
  readonly tokens: readonly {
    readonly name: string;
    readonly light: string;
    readonly dark: string;
  }[];
}

const COLOR_ROWS: readonly ColorRow[] = [
  {
    label: 'Surfaces',
    tokens: [
      { name: 'BG', light: '#E8E0D0', dark: '#0E0E12' },
      { name: 'Card', light: '#FAF7F0', dark: '#26262E' },
      { name: 'Inset', light: '#D6CCB8', dark: '#070709' },
    ],
  },
  {
    label: 'Ink + Text · primary CTA = ink, не green',
    tokens: [
      { name: 'Ink (CTA)', light: '#1A1A1A', dark: '#F4F1EA' },
      { name: 'Text 2', light: '#4D4D4D', dark: '#B5B5B5' },
      { name: 'Text 3', light: '#5A5A5A', dark: '#9A9A9A' },
    ],
  },
  {
    label: 'Small accents · только для статусов / цитат / успеха',
    tokens: [
      { name: 'Forest-jade', light: '#2D5F4E', dark: '#5C9A85' },
      { name: 'Bronze', light: '#A04A3D', dark: '#BD6A55' },
    ],
  },
  {
    label: 'v2 — marketing register · candy + paper + signal',
    tokens: [
      { name: 'Candy-pink', light: '#F7A1C9', dark: '#F7A1C9' },
      { name: 'Candy-mustard', light: '#F4CC4A', dark: '#F4CC4A' },
      { name: 'Signal-orange', light: '#F08A3C', dark: '#F08A3C' },
      { name: 'Ink-deep (v2)', light: '#1C1B26', dark: '#1C1B26' },
      { name: 'Paper-cream', light: '#F6F1E8', dark: '#F6F1E8' },
    ],
  },
];

interface CandySurface {
  readonly name: string;
  readonly bg: string;
  readonly tokenName: string;
  readonly noteOnDark?: boolean;
}

const CANDY_SURFACES: readonly CandySurface[] = [
  { name: 'Candy-pink hero', bg: '#F7A1C9', tokenName: 'semantic-candy.bg-pink' },
  { name: 'Candy-mustard', bg: '#F4CC4A', tokenName: 'semantic-candy.bg-mustard' },
  { name: 'Paper-cream', bg: '#F6F1E8', tokenName: 'paper.cream' },
  { name: 'Ink-deep', bg: '#1C1B26', tokenName: 'ink-v2.deep', noteOnDark: true },
];

interface TypeRow {
  readonly label: string;
  readonly sample: React.ReactNode;
  readonly style: React.CSSProperties;
}

const TYPE_ROWS: readonly TypeRow[] = [
  {
    label: 'Display 48',
    sample: (
      <>
        Notice <span style={{ fontWeight: 700 }}>what</span> you&apos;d miss.
      </>
    ),
    style: { fontSize: '48px', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 },
  },
  {
    label: 'H1 / 32',
    sample: 'Your portfolio, finally legible.',
    style: { fontSize: '32px', fontWeight: 600, letterSpacing: '-0.03em' },
  },
  {
    label: 'H2 / 22',
    sample: 'Every account. One conversation.',
    style: { fontSize: '22px', fontWeight: 600, letterSpacing: '-0.025em' },
  },
  {
    label: 'Body / 13',
    sample: 'Your IBKR account drifted 3.2% from target last week.',
    style: { fontSize: '13px', lineHeight: 1.55 },
  },
  {
    label: 'Numerals',
    sample: '$184,210 · 12.4% · 142 lots',
    style: {
      fontSize: '24px',
      fontWeight: 600,
      fontFeatureSettings: '"tnum" 1',
      letterSpacing: '-0.03em',
    },
  },
  {
    label: 'Mono / 11',
    sample: 'PORTFOLIO · ANSWER · ENGINE',
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase' as const,
      color: 'var(--text-2)',
    },
  },
];

const TYPE_ROWS_V2: readonly TypeRow[] = [
  {
    label: 'Bagel display-xxl',
    sample: 'Real money. Real read.',
    style: {
      fontFamily: 'var(--font-bagel), system-ui, sans-serif',
      fontSize: 'clamp(64px, 8vw, 112px)',
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      color: 'var(--ink, #1A1A1A)',
    },
  },
  {
    label: 'Bagel display-xl',
    sample: 'Stop the scroll.',
    style: {
      fontFamily: 'var(--font-bagel), system-ui, sans-serif',
      fontSize: 'clamp(48px, 5vw, 80px)',
      lineHeight: 1.0,
      letterSpacing: '-0.015em',
      color: 'var(--ink, #1A1A1A)',
    },
  },
  {
    label: 'Bagel display-md / 36',
    sample: 'Marketing card hero',
    style: {
      fontFamily: 'var(--font-bagel), system-ui, sans-serif',
      fontSize: '36px',
      lineHeight: 1.1,
      letterSpacing: '-0.005em',
      color: 'var(--ink, #1A1A1A)',
    },
  },
  {
    label: 'Manrope heading-xl / 28',
    sample: 'Your portfolio, finally legible.',
    style: {
      fontFamily: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif',
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
  },
  {
    label: 'Manrope body-lg / 16',
    sample: 'Calm rooms make better decisions. We help with the room.',
    style: {
      fontFamily: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.55,
    },
  },
  {
    label: 'Caveat accent / 32',
    sample: '← this number is real',
    style: {
      fontFamily: 'var(--font-caveat), cursive',
      fontSize: '32px',
      fontWeight: 500,
      transform: 'rotate(-2deg)',
      display: 'inline-block',
      color: 'var(--ink, #1A1A1A)',
    },
  },
];

interface ShadowToken {
  readonly name: string;
  readonly varName: string;
  readonly meta: string;
  readonly insetBg?: boolean;
  readonly primary?: boolean;
}

const SHADOW_TOKENS: readonly ShadowToken[] = [
  { name: 'soft', varName: '--shadow-soft', meta: 'paper lift' },
  { name: 'card', varName: '--shadow-card', meta: 'tactile double' },
  { name: 'lift', varName: '--shadow-lift', meta: 'hero / focused' },
  { name: 'toast', varName: '--shadow-toast', meta: 'floating' },
  { name: 'input inset', varName: '--shadow-input-inset', meta: 'depressed', insetBg: true },
  { name: 'inset light', varName: '--shadow-inset-light', meta: 'chip', insetBg: true },
  { name: 'primary CTA', varName: '--shadow-primary-extrude', meta: 'ink extrude', primary: true },
];

export interface FoundationSectionProps {
  variant: 'light' | 'dark';
}

export function FoundationSection({ variant }: FoundationSectionProps) {
  return (
    <>
      <DsSection
        title="Color tokens"
        meta={variant === 'light' ? 'Updated' : 'neutral dark · luma-bumped'}
      >
        {COLOR_ROWS.map((row) => (
          <DsRow key={row.label} label={row.label}>
            <div className="showcase-swatches">
              {row.tokens.map((tok) => {
                const value = variant === 'light' ? tok.light : tok.dark;
                return (
                  <div key={tok.name} className="showcase-swatch">
                    <span
                      aria-hidden
                      className="showcase-swatch__chip"
                      style={{ background: value }}
                    />
                    <div>
                      <p className="showcase-swatch__name">{tok.name}</p>
                      <p className="showcase-swatch__hex">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </DsRow>
        ))}
      </DsSection>

      <DsSection title="Typography — Geist only" meta="no italic · tabular numerals">
        {TYPE_ROWS.map((row) => (
          <div key={row.label} className="showcase-type-row">
            <span className="showcase-type-row__label">{row.label}</span>
            <span className="showcase-type-row__sample" style={row.style}>
              {row.sample}
            </span>
          </div>
        ))}
      </DsSection>

      <DsSection
        title="Typography v2 — display + accent"
        meta="Bagel Fat One · Manrope · Caveat (OFL)"
      >
        {TYPE_ROWS_V2.map((row) => (
          <div key={row.label} className="showcase-type-row">
            <span className="showcase-type-row__label">{row.label}</span>
            <span className="showcase-type-row__sample" style={row.style}>
              {row.sample}
            </span>
          </div>
        ))}
      </DsSection>

      <DsSection title="v2 — Surface system" meta="route-scoped · candy = marketing · paper = app">
        <DsRow label="Four named surfaces · no mixing">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {CANDY_SURFACES.map((surf) => (
              <div
                key={surf.name}
                style={{
                  background: surf.bg,
                  border: '1px solid rgba(28,27,38,0.14)',
                  borderRadius: 16,
                  padding: '32px 20px',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: surf.noteOnDark ? '#F4F0E4' : '#1C1B26',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {surf.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    opacity: 0.78,
                  }}
                >
                  {surf.tokenName}
                </p>
              </div>
            ))}
          </div>
        </DsRow>
      </DsSection>

      <DsSection title="Shadow / elevation" meta="tactile preserved">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 16,
          }}
        >
          {SHADOW_TOKENS.map((tok) => (
            <div
              key={tok.name}
              style={{
                background: tok.primary
                  ? 'var(--ink)'
                  : tok.insetBg
                    ? 'var(--inset)'
                    : 'var(--card)',
                color: tok.primary ? 'var(--card)' : 'var(--ink)',
                borderRadius: 14,
                padding: 22,
                textAlign: 'center',
                boxShadow: `var(${tok.varName})`,
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 500, marginBottom: 4 }}>{tok.name}</p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: tok.primary ? 'rgba(255,255,255,0.55)' : 'var(--text-3)',
                }}
              >
                {tok.meta}
              </p>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection
        title="Signature hero card"
        meta={variant === 'light' ? 'extra lift · ink CTA' : 'cream-on-dark CTA'}
      >
        <SignatureHero />
      </DsSection>
    </>
  );
}
