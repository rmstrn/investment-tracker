'use client';

import { Section, SubBlock } from '../_components/Section';

/**
 * §Foundation — color, typography, spacing, depth, motion.
 *
 * Pure declarative swatches/samples. PD spec §3 leans inline (no `<TokenChip>`
 * primitive promotion until a second consumer appears — YAGNI).
 *
 * Both light + dark palettes render side-by-side in dedicated stage frames
 * (.showcase-stage--light / .showcase-stage--dark) regardless of the global
 * theme toggle, so designers can compare both at any time.
 */

interface PaletteToken {
  readonly name: string;
  readonly varName: string;
  readonly light: string;
  readonly dark: string;
}

const PALETTE: readonly PaletteToken[] = [
  { name: 'bg', varName: '--bg', light: '#F4F1EA', dark: '#0F0F11' },
  { name: 'card', varName: '--card', light: '#FFFFFF', dark: '#1A1A1C' },
  { name: 'inset', varName: '--inset', light: '#F0EDE5', dark: '#16161A' },
  { name: 'ink', varName: '--ink', light: '#1A1A1A', dark: '#F4F1EA' },
  { name: 'text-2', varName: '--text-2', light: '#525252', dark: '#B5B5B5' },
  { name: 'text-3', varName: '--text-3', light: '#7A7A7A', dark: '#888A8E' },
  { name: 'accent', varName: '--accent', light: '#2D5F4E', dark: '#4A8775' },
  { name: 'terra', varName: '--terra', light: '#A04A3D', dark: '#BD6A55' },
  {
    name: 'border',
    varName: '--border',
    light: 'rgba(20,20,20,0.10)',
    dark: 'rgba(255,255,255,0.10)',
  },
  {
    name: 'border-divider',
    varName: '--border-divider',
    light: 'rgba(20,20,20,0.06)',
    dark: 'rgba(255,255,255,0.06)',
  },
] as const;

const TYPE_SCALE: ReadonlyArray<readonly [string, string, string, React.CSSProperties]> = [
  [
    'Display',
    '48 / 600 / -0.035em',
    'Provedo',
    { fontSize: '48px', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 },
  ],
  [
    'H1',
    '32 / 600 / -0.025em',
    'Portfolio overview',
    { fontSize: '32px', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 },
  ],
  [
    'H2',
    '22 / 600 / -0.025em',
    'Sector allocation',
    { fontSize: '22px', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15 },
  ],
  [
    'Body',
    '13 / 400 / -0.005em',
    'Provedo summarizes your holdings into a calm, paper-like overview.',
    { fontSize: '13px', fontWeight: 400, lineHeight: 1.55 },
  ],
  [
    'Numerals',
    '24 / 600 / tnum',
    '$226,390.42',
    { fontSize: '24px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  ],
  [
    'Mono',
    '11 / 500 / 0.18em',
    'GEIST · MONO · UPPER',
    {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    },
  ],
];

interface ShadowToken {
  readonly name: string;
  readonly varName: string;
  readonly insetBg?: boolean;
  readonly primary?: boolean;
}

const SHADOW_TOKENS: readonly ShadowToken[] = [
  { name: 'soft', varName: '--shadow-soft' },
  { name: 'card', varName: '--shadow-card' },
  { name: 'lift', varName: '--shadow-lift' },
  { name: 'toast', varName: '--shadow-toast' },
  { name: 'input-inset', varName: '--shadow-input-inset', insetBg: true },
  { name: 'inset-light', varName: '--shadow-inset-light', insetBg: true },
  { name: 'primary-extrude', varName: '--shadow-primary-extrude', primary: true },
];

const SPACING_SCALE = [4, 8, 12, 16, 20, 24, 32, 40, 56, 80] as const;
const RADIUS_SCALE = [
  { token: 'sm', value: '6px' },
  { token: 'md', value: '10px' },
  { token: 'lg', value: '14px' },
  { token: 'xl', value: '18px' },
  { token: '2xl', value: '24px' },
  { token: 'full', value: '9999px' },
] as const;

const DURATION_SCALE = [
  { name: 'fast', value: '120ms' },
  { name: 'base', value: '200ms' },
  { name: 'slow', value: '350ms' },
  { name: 'slower', value: '600ms' },
] as const;

const EASE_SCALE = [
  { name: 'default', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { name: 'out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  { name: 'in', value: 'cubic-bezier(0.4, 0, 1, 1)' },
  { name: 'spring', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
] as const;

export function FoundationSection() {
  return (
    <Section
      id="foundation"
      eyebrow="§ Foundation"
      title="Tokens — color, type, depth, motion"
      description="Locked v1.1 token surface. All values resolve from packages/design-tokens. Both light and dark palettes are shown side-by-side; the global theme toggle (top-right) flips other surfaces but the palette stage stays static for compare."
    >
      <SubBlock title="Palette — light + dark stages" meta="DSM-V1 § Color">
        <div className="grid gap-5 md:grid-cols-2">
          <PaletteStage variant="light" />
          <PaletteStage variant="dark" />
        </div>
      </SubBlock>

      <SubBlock title="Typography — Geist + Geist Mono" meta="DSM-V1 § Type">
        <div className="space-y-2">
          {TYPE_SCALE.map(([label, meta, sample, style]) => (
            <div key={label} className="showcase-demo-card flex flex-wrap items-baseline gap-6">
              <div style={{ minWidth: 110 }}>
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
                >
                  {label}
                </p>
                <p
                  className="font-mono"
                  style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: 4 }}
                >
                  {meta}
                </p>
              </div>
              <div className="flex-1" style={style as React.CSSProperties}>
                {sample}
              </div>
            </div>
          ))}
        </div>
      </SubBlock>

      <SubBlock title="Depth — shadow scale" meta="DSM-V1 § Shadow">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
        >
          {SHADOW_TOKENS.map((tok) => (
            <div
              key={tok.name}
              className="rounded-[14px] p-5 text-center"
              style={{
                background: tok.primary
                  ? 'var(--ink)'
                  : tok.insetBg
                    ? 'var(--inset)'
                    : 'var(--card)',
                color: tok.primary ? 'var(--card)' : 'var(--ink)',
                boxShadow: `var(${tok.varName})`,
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 500 }}>{tok.name}</p>
              <p
                className="font-mono mt-1"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: tok.primary ? 'rgba(255,255,255,0.55)' : 'var(--text-3)',
                }}
              >
                {tok.varName}
              </p>
            </div>
          ))}
        </div>
      </SubBlock>

      <SubBlock title="Spacing + Radius" meta="DSM-V1 § Layout">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="showcase-demo-card">
            <p
              className="font-mono uppercase mb-3"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              Spacing scale (px)
            </p>
            <div className="space-y-2">
              {SPACING_SCALE.map((px) => (
                <div key={px} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: `${px}px`,
                      height: 8,
                      background: 'var(--accent)',
                      borderRadius: 4,
                    }}
                  />
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    {px}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="showcase-demo-card">
            <p
              className="font-mono uppercase mb-3"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              Radius scale
            </p>
            <div className="grid grid-cols-3 gap-3">
              {RADIUS_SCALE.map((r) => (
                <div
                  key={r.token}
                  className="flex flex-col items-center gap-1 p-3"
                  style={{
                    background: 'var(--inset)',
                    borderRadius: r.value,
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>{r.token}</span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '9px', letterSpacing: '0.06em', color: 'var(--text-3)' }}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SubBlock>

      <SubBlock title="Motion — durations + easings" meta="hover to trigger">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="showcase-demo-card showcase-motion-demo space-y-3">
            <p
              className="font-mono uppercase"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              Durations
            </p>
            {DURATION_SCALE.map((d) => (
              <MotionRow key={d.name} label={d.name} meta={d.value} duration={d.value} />
            ))}
          </div>
          <div className="showcase-demo-card showcase-motion-demo space-y-3">
            <p
              className="font-mono uppercase"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--text-3)' }}
            >
              Easings
            </p>
            {EASE_SCALE.map((e) => (
              <MotionRow key={e.name} label={e.name} meta={e.value} ease={e.value} />
            ))}
          </div>
        </div>
      </SubBlock>
    </Section>
  );
}

function PaletteStage({ variant }: { variant: 'light' | 'dark' }) {
  return (
    <div className={`showcase-stage showcase-stage--${variant}`}>
      <div className="mb-4 flex items-baseline justify-between">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: variant === 'light' ? '#7A7A7A' : '#888A8E',
          }}
        >
          {variant === 'light' ? 'Light · paper' : 'Dark · graphite'}
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: '10px',
            color: variant === 'light' ? '#7A7A7A' : '#888A8E',
          }}
        >
          v1.1
        </p>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        {PALETTE.map((tok) => {
          const value = variant === 'light' ? tok.light : tok.dark;
          return (
            <div
              key={tok.varName}
              className="flex items-center gap-2.5 p-2.5"
              style={{
                background: variant === 'light' ? '#FFFFFF' : '#1A1A1C',
                borderRadius: 10,
                boxShadow:
                  variant === 'light'
                    ? '0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)'
                    : '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: value,
                  boxShadow:
                    variant === 'light'
                      ? '0 0 0 1px rgba(0,0,0,0.08)'
                      : '0 0 0 1px rgba(255,255,255,0.10)',
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: variant === 'light' ? '#1A1A1A' : '#F4F1EA',
                  }}
                >
                  {tok.name}
                </p>
                <p
                  className="font-mono"
                  style={{
                    fontSize: '9.5px',
                    letterSpacing: '0.04em',
                    color: variant === 'light' ? '#7A7A7A' : '#888A8E',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MotionRow({
  label,
  meta,
  duration,
  ease,
}: {
  label: string;
  meta: string;
  duration?: string;
  ease?: string;
}) {
  return (
    <div className="showcase-motion-trigger group">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'capitalize' }}>
          {label}
        </span>
        <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-3)' }}>
          {meta}
        </span>
      </div>
      <div
        className="showcase-motion-track"
        style={
          {
            ['--demo-duration' as string]: duration ?? '350ms',
            ['--ease' as string]: ease ?? 'cubic-bezier(0.16, 1, 0.3, 1)',
          } as React.CSSProperties
        }
      >
        <span className="showcase-motion-dot" aria-hidden />
      </div>
    </div>
  );
}
