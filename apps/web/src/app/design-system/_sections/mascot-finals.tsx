'use client';

import { MascotConsole, MascotMachine, MascotOrb } from '@investment-tracker/ui';
import type { ComponentType } from 'react';

import { DsSection } from '../_components/SectionHead';

/**
 * §Mascot finals — three candy-pink hero blocks rendering the same hero copy
 * with three mascot variants on the right side, so PO can pick the winner.
 *
 * Each block is an isolated `<div data-surface="candy">` that opts into the
 * candy semantic cascade (palette + Bagel + Manrope). The hero text mirrors
 * `marketing-candy.tsx` so the comparison reads as «which mascot lives in
 * THIS exact slot».
 *
 * The thin divider band between variants is just a labelled strip — no
 * paint-drip, since this is a designer-tool surface, not a marketing flow.
 */

interface MascotVariant {
  readonly id: string;
  readonly label: string;
  readonly subtitle: string;
  readonly Component: ComponentType<{ size?: number; className?: string }>;
  readonly mascotSize: number;
}

const VARIANTS: ReadonlyArray<MascotVariant> = [
  {
    id: 'machine',
    label: 'Variant 1 · Advisor Mk-1',
    subtitle: 'literal machine character',
    Component: MascotMachine,
    mascotSize: 280,
  },
  {
    id: 'orb',
    label: 'Variant 2 · AI Pulse',
    subtitle: 'abstract pulsing orb',
    Component: MascotOrb,
    mascotSize: 260,
  },
  {
    id: 'console',
    label: 'Variant 3 · Provedo Terminal',
    subtitle: 'isometric totem console',
    Component: MascotConsole,
    mascotSize: 280,
  },
];

export function MascotFinalsSection() {
  return (
    <DsSection title="Mascot finals — pick one" meta="3 variants · candy-pink hero context">
      <div className="mf-stack">
        {VARIANTS.map((variant, i) => (
          <div key={variant.id}>
            <CandyHeroBlock variant={variant} />
            {i < VARIANTS.length - 1 ? (
              <TransitionBand from={variant.label} to={VARIANTS[i + 1]?.label ?? ''} />
            ) : null}
          </div>
        ))}
      </div>
    </DsSection>
  );
}

interface CandyHeroBlockProps {
  variant: MascotVariant;
}

function CandyHeroBlock({ variant }: CandyHeroBlockProps) {
  const { Component, mascotSize, label, subtitle } = variant;
  return (
    <div data-surface="candy" className="mf-block">
      <p className="mf-eyebrow">{label.toUpperCase()}</p>
      <section className="mc-hero" aria-labelledby={`mf-hero-${variant.id}`}>
        <div className="mc-hero__copy">
          <h1 id={`mf-hero-${variant.id}`} className="mc-hero__display">
            let&apos;s
            <span className="mc-chip" aria-hidden="true">
              run
            </span>
            your portfolio.
          </h1>
          <p className="mc-hero__sub">
            One quiet view across every broker. Your AI advisor, watching the tape so you don&apos;t
            have to.
          </p>
          <div className="mc-hero__cta-row">
            <a href="#mascot-finals" className="mc-cta-primary" role="button">
              connect your broker
            </a>
            <a href="#mascot-finals" className="mc-cta-link">
              see how it works →
            </a>
          </div>
          <p className="mf-caption">{subtitle}</p>
        </div>
        <div className="mf-mascot-slot" aria-hidden="false">
          <Component size={mascotSize} className="mf-mascot-svg" />
        </div>
      </section>
    </div>
  );
}

interface TransitionBandProps {
  from: string;
  to: string;
}

function TransitionBand({ from, to }: TransitionBandProps) {
  return (
    <div className="mf-band" aria-label={`${from} to ${to}`}>
      <span className="mf-band__arrow" aria-hidden="true">
        ↓
      </span>
      <span className="mf-band__text">
        {from.replace('Variant ', 'V').replace(' · ', ' ')}
        <span aria-hidden="true"> → </span>
        {to.replace('Variant ', 'V').replace(' · ', ' ')}
      </span>
    </div>
  );
}
