'use client';

// HeroAtmosphere — Slice-LP5-A §K.1.b Layer 1 + Layer 2
//
// Two-layer first-impression visual that frames the picture-first hero. None
// of these layers is a chart, a person illustration, an AI-sparkle, or a
// glass-morphism surface. PD spec §K binds the composition.
//
// Layer 1 — atmospheric gradient mesh (CSS only, 0 DOM extras for the
// gradients themselves; rendered via a single absolutely-positioned <div>
// that paints two compositor-friendly radial gradients on opposing corners
// of the hero region).
//
// Layer 2 — bespoke abstract «portfolio brain» synthesis-glyph (inline SVG,
// ~520px wide, opacity 0.10, slate-700 strokes + a single teal-accented
// connecting line marking the synthesis path bottom-up). Decorative,
// aria-hidden, pointer-events: none. On hero entry the connecting lines
// draw in via stroke-dasharray over ≤700ms; static under prefers-reduced-
// motion.
//
// Both layers are positioned absolute and sit BEHIND the hero content. The
// caller anchors the layers inside the hero <section> via `relative + overflow:
// hidden` so the gradients clip to the hero region without bleeding into S2.

import { type CSSProperties, type ReactElement, useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// ─── Layer 1 — atmospheric gradient mesh ──────────────────────────────────────
//
// Top-right anchor: teal-cream wash, the warm side of teal. Low chroma so it
// reads as light, not as color. Bottom-left anchor: warm-cream amber-leaning
// glow that matches the page bg without color shift.
//
// PD spec §K.1.b values verbatim — do not retune without spec amendment.

const ATMOSPHERE_LAYER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  backgroundImage: [
    'radial-gradient(ellipse 900px 700px at 100% 0%, rgba(13, 148, 136, 0.10) 0%, rgba(13, 148, 136, 0.04) 35%, transparent 70%)',
    'radial-gradient(ellipse 800px 600px at 0% 100%, rgba(250, 240, 220, 0.55) 0%, rgba(245, 245, 241, 0.30) 40%, transparent 75%)',
  ].join(', '),
};

// ─── Layer 2 — bespoke synthesis-glyph SVG ────────────────────────────────────
//
// Geometry: 1 source node (top) → 3 broker nodes (middle) → 1 Provedo node
// (bottom). Connecting curves form a calm valley. One teal-accented stroke
// marks the synthesis path bottom-up. Total path length ≈ 600px summed across
// the 6 connector segments.

interface SynthesisGlyphProps {
  /** True once the hero region has scrolled into view (drives the draw-on
   *  animation). Static at rest after the single-shot draw. */
  hasEntered: boolean;
  /** Skip the draw-on animation. */
  prefersReduced: boolean;
}

const GLYPH_NODE_RADIUS = 8;
// Total approximate connector path length (sum of the 6 segments + slight
// curvature). Used for stroke-dasharray reveal — the exact value is forgiving
// because we cap dashoffset at 0.
const GLYPH_CONNECTOR_LENGTH = 600;
// Single-shot draw budget — ≤700ms per PD §K.1.b motion budget.
const GLYPH_DRAW_DURATION_MS = 700;

function SynthesisGlyph({ hasEntered, prefersReduced }: SynthesisGlyphProps): ReactElement {
  const isStatic = prefersReduced;
  const isDrawn = isStatic || hasEntered;

  const connectorBaseStyle: CSSProperties = isStatic
    ? {}
    : {
        strokeDasharray: GLYPH_CONNECTOR_LENGTH,
        strokeDashoffset: isDrawn ? 0 : GLYPH_CONNECTOR_LENGTH,
        transition: `stroke-dashoffset ${GLYPH_DRAW_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      };

  // Slightly delayed accent stroke so the synthesis line lands AFTER the
  // base lines complete — reads as «Provedo synthesizes the brokers».
  const accentStyle: CSSProperties = isStatic
    ? {}
    : {
        ...connectorBaseStyle,
        transitionDelay: '120ms',
      };

  return (
    <svg
      data-testid="hero-synthesis-glyph"
      aria-hidden="true"
      focusable="false"
      width="520"
      height="360"
      viewBox="0 0 520 360"
      style={{
        position: 'absolute',
        top: '40px',
        right: '-40px',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 0,
        maxWidth: '100%',
      }}
    >
      {/* Source node — top */}
      <circle
        cx="260"
        cy="40"
        r={GLYPH_NODE_RADIUS}
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1.5"
      />

      {/* 3 broker nodes — middle row */}
      <circle
        cx="120"
        cy="180"
        r={GLYPH_NODE_RADIUS}
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1.5"
      />
      <circle
        cx="260"
        cy="180"
        r={GLYPH_NODE_RADIUS}
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1.5"
      />
      <circle
        cx="400"
        cy="180"
        r={GLYPH_NODE_RADIUS}
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1.5"
      />

      {/* Provedo synthesis node — bottom (filled-tone with teal stroke) */}
      <circle
        cx="260"
        cy="320"
        r={GLYPH_NODE_RADIUS + 2}
        fill="none"
        stroke="var(--provedo-accent)"
        strokeWidth="1.5"
      />

      {/* Connectors — source → 3 brokers (slate-700 hairlines) */}
      <path
        d="M 260,48 Q 260,110 120,172"
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1"
        strokeLinecap="round"
        style={connectorBaseStyle}
      />
      <path
        d="M 260,48 L 260,172"
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1"
        strokeLinecap="round"
        style={connectorBaseStyle}
      />
      <path
        d="M 260,48 Q 260,110 400,172"
        fill="none"
        stroke="var(--provedo-text-primary)"
        strokeWidth="1"
        strokeLinecap="round"
        style={connectorBaseStyle}
      />

      {/* Accent connector — brokers → Provedo synthesis path */}
      <path
        data-testid="hero-synthesis-accent-stroke"
        d="M 120,188 Q 120,260 260,310 Q 400,260 400,188 M 260,188 L 260,310"
        fill="none"
        stroke="var(--provedo-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={accentStyle}
      />
    </svg>
  );
}

// ─── Public composer ─────────────────────────────────────────────────────────

export function HeroAtmosphere(): ReactElement {
  const prefersReduced = usePrefersReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });
  const [hasEntered, setHasEntered] = useState(false);

  // Promote inView → hasEntered exactly once. This avoids re-running the
  // draw-on animation if the IO observer fires repeatedly.
  useEffect(() => {
    if (inView && !hasEntered) setHasEntered(true);
  }, [inView, hasEntered]);

  return (
    <div ref={ref} data-testid="hero-atmosphere" aria-hidden="true" style={ATMOSPHERE_LAYER_STYLE}>
      <SynthesisGlyph hasEntered={hasEntered} prefersReduced={prefersReduced} />
    </div>
  );
}
