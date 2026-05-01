'use client';

import { useReducedMotion } from '../charts/_shared/useReducedMotion';

/**
 * MascotOrb — Variant 2 «AI Pulse».
 *
 * Abstract pulsing geometric form. NO face, NO body. An irregular lozenge
 * with hard ink outline (the differentiator that makes it pop on candy-pink
 * rather than dissolving into a generic AI-orb), layered fills going
 * deep-ink-blue → mustard caustic → signal-orange edge → pink halo, plus an
 * inner orbit of small particle dots.
 *
 * Animation: gentle breathing scale loop (1.0 ↔ 1.04 over 6s) plus particle
 * orbit. Both disabled under `prefers-reduced-motion`.
 *
 * - Inline SVG, no external image dependencies.
 * - `size` prop (default 240) scales the viewBox proportionally.
 */
export interface MascotOrbProps {
  size?: number;
  className?: string;
}

const VIEW = 240;

const COLORS = {
  ink: '#1C1B26',
  inkBlue: '#1B2A4E',
  mustard: '#F4CC4A',
  signalOrange: '#F08A3C',
  signalOrangeDeep: '#C76A22',
  pinkHalo: '#FFB7D9',
  cream: '#FFE8C0',
} as const;

// Asymmetric lozenge — 8 anchor points around the centre.
// Hand-tuned so it reads as «not a circle» but still feels organic / breathing.
const ORB_PATH =
  'M120 36 ' +
  'C 168 38, 196 70, 200 116 ' +
  'C 204 156, 184 188, 152 200 ' +
  'C 124 210, 90 206, 64 188 ' +
  'C 40 170, 32 138, 44 102 ' +
  'C 56 70, 88 44, 120 36 Z';

export function MascotOrb({ size = 240, className }: MascotOrbProps) {
  const reduced = useReducedMotion();

  return (
    <svg
      role="img"
      aria-label="Provedo AI Pulse — an asymmetric pulsing orb with a deep ink-blue core, mustard equator, signal-orange edge, and a pink halo"
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Core gradient — deep ink-blue to a hint of brighter blue at the top */}
        <radialGradient id="mo-core" cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#33457A" />
          <stop offset="55%" stopColor={COLORS.inkBlue} />
          <stop offset="100%" stopColor="#0E1730" />
        </radialGradient>
        {/* Mustard caustic — a band that crosses the equator */}
        <linearGradient id="mo-mustard" x1="0" y1="0.55" x2="1" y2="0.45">
          <stop offset="0%" stopColor={COLORS.mustard} stopOpacity="0" />
          <stop offset="40%" stopColor={COLORS.mustard} stopOpacity="0.55" />
          <stop offset="60%" stopColor={COLORS.cream} stopOpacity="0.7" />
          <stop offset="100%" stopColor={COLORS.mustard} stopOpacity="0" />
        </linearGradient>
        {/* Signal-orange rim glow */}
        <radialGradient id="mo-rim" cx="50%" cy="50%" r="55%">
          <stop offset="70%" stopColor={COLORS.signalOrange} stopOpacity="0" />
          <stop offset="92%" stopColor={COLORS.signalOrange} stopOpacity="0.85" />
          <stop offset="100%" stopColor={COLORS.signalOrangeDeep} stopOpacity="1" />
        </radialGradient>
        {/* Pink halo behind */}
        <radialGradient id="mo-halo" cx="50%" cy="50%" r="50%">
          <stop offset="40%" stopColor={COLORS.pinkHalo} stopOpacity="0.7" />
          <stop offset="100%" stopColor={COLORS.pinkHalo} stopOpacity="0" />
        </radialGradient>

        {/* Mask so the mustard / orange layers stay clipped to the orb shape */}
        <clipPath id="mo-clip">
          <path d={ORB_PATH} />
        </clipPath>
      </defs>

      {/* ─── Halo behind the orb ────────────────────────────────────── */}
      <circle cx="120" cy="120" r="108" fill="url(#mo-halo)">
        {!reduced && (
          <animate
            attributeName="r"
            values="100;116;100"
            dur="6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            keyTimes="0;0.5;1"
          />
        )}
        {!reduced && (
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="6s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* ─── Breathing group: scale 1.0 ↔ 1.04 over 6s ──────────────── */}
      <g transform="translate(120 120)">
        <g transform="translate(-120 -120)">
          {!reduced && (
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.04;1"
              dur="6s"
              repeatCount="indefinite"
              additive="sum"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              keyTimes="0;0.5;1"
            />
          )}

          {/* Drop-shadow flat under the orb */}
          <ellipse cx="120" cy="216" rx="60" ry="6" fill={COLORS.ink} opacity="0.20" />

          {/* Outer rim glow — slightly larger than orb */}
          <path
            d={ORB_PATH}
            transform="translate(120 120) scale(1.06) translate(-120 -120)"
            fill="url(#mo-rim)"
            opacity="0.85"
          />

          {/* Core fill — deep ink-blue */}
          <path d={ORB_PATH} fill="url(#mo-core)" />

          {/* Mustard caustic equator (clipped to orb shape) */}
          <g clipPath="url(#mo-clip)">
            <ellipse
              cx="120"
              cy="124"
              rx="120"
              ry="22"
              fill="url(#mo-mustard)"
              transform="rotate(-8 120 124)"
            />
            {/* Highlight crescent — top-left */}
            <path
              d="M62 80 Q92 56 132 56 Q160 60 174 76 Q150 64 116 70 Q88 76 62 92 Z"
              fill={COLORS.cream}
              opacity="0.35"
            />
          </g>

          {/* HARD ink outline — the differentiator on candy-pink */}
          <path
            d={ORB_PATH}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Inner spiral of particle dots */}
          <ParticleSpiral reduced={reduced} />
        </g>
      </g>

      {/* ─── A few off-orb spark dots, not animated, for character ──── */}
      <circle cx="36" cy="60" r="2.5" fill={COLORS.ink} opacity="0.55" />
      <circle cx="208" cy="50" r="2" fill={COLORS.ink} opacity="0.4" />
      <circle cx="218" cy="180" r="2.5" fill={COLORS.ink} opacity="0.55" />
      <circle cx="22" cy="184" r="2" fill={COLORS.ink} opacity="0.4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

interface ParticleSpiralProps {
  reduced: boolean;
}

function ParticleSpiral({ reduced }: ParticleSpiralProps) {
  // 6 dots at decreasing radii, each rotating around (120,120)
  const dots = [
    { r: 70, phase: 0, size: 3, color: COLORS.signalOrange },
    { r: 60, phase: 60, size: 2.5, color: COLORS.mustard },
    { r: 52, phase: 130, size: 2.2, color: COLORS.cream },
    { r: 44, phase: 200, size: 2, color: COLORS.signalOrange },
    { r: 36, phase: 260, size: 1.8, color: COLORS.mustard },
    { r: 24, phase: 320, size: 1.5, color: COLORS.cream },
  ];

  return (
    <g>
      {dots.map((d, i) => {
        const x = 120 + d.r * Math.cos((d.phase * Math.PI) / 180);
        const y = 120 + d.r * Math.sin((d.phase * Math.PI) / 180);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={d.size} fill={d.color} opacity="0.9">
              {!reduced && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 120 120`}
                  to={`360 120 120`}
                  dur={`${10 + i * 1.4}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        );
      })}
    </g>
  );
}
