'use client';

import { useEffect, useState } from 'react';

import { useReducedMotion } from '../charts/_shared/useReducedMotion';

/**
 * MascotMachine — Variant 1 «Advisor Mk-1».
 *
 * Chunky 3D-isometric machine-character. Honey-amber lacquer cabinet, brass
 * fittings, dark teal CRT face with calm pixel-dot eyes that blink every ~5s,
 * articulated arms holding a paper-tape advice-readout, an antenna with a
 * heartbeat LED in signal-orange, and a tank-tread base. Carved nameplate at
 * the foot reads «PROVO Mk-1».
 *
 * - Inline SVG, no external image dependencies.
 * - Respects `prefers-reduced-motion` (and the showcase override).
 * - `size` prop (default 240) scales the viewBox proportionally.
 * - Visual works on candy-pink (primary target) and on cream/ink fallback
 *   surfaces — the hard ink outline plus saturated amber survive both.
 */
export interface MascotMachineProps {
  size?: number;
  className?: string;
}

const VIEW_W = 240;
const VIEW_H = 280;

const COLORS = {
  ink: '#1C1B26',
  amber: '#D8A04A',
  amberDeep: '#A77628',
  brass: '#B07028',
  brassLight: '#C98A3A',
  screenBg: '#1B3838',
  screenGlow: '#2E5252',
  pixelOn: '#F4CC4A', // mustard pixel-eyes
  paper: '#F6E9C9',
  signalOrange: '#F08A3C',
  signalOrangeDeep: '#C76A22',
  treadBlack: '#0F0E14',
  highlight: '#F4CC4A',
} as const;

export function MascotMachine({ size = 240, className }: MascotMachineProps) {
  const reduced = useReducedMotion();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = (): void => {
      setBlink(true);
      timer = setTimeout(() => {
        setBlink(false);
        timer = setTimeout(loop, 4800);
      }, 180);
    };
    timer = setTimeout(loop, 2400);
    return () => clearTimeout(timer);
  }, [reduced]);

  const w = size;
  const h = (size * VIEW_H) / VIEW_W;

  return (
    <svg
      role="img"
      aria-label="Provo Mk-1 — a chunky honey-amber advisor machine with a teal pixel-art face holding a paper-tape readout"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={w}
      height={h}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Amber lacquer gradient — top-light to deepen body */}
        <linearGradient id="mm-amber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.highlight} />
          <stop offset="22%" stopColor={COLORS.amber} />
          <stop offset="100%" stopColor={COLORS.amberDeep} />
        </linearGradient>
        {/* Brass plate gradient */}
        <linearGradient id="mm-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.brassLight} />
          <stop offset="100%" stopColor={COLORS.brass} />
        </linearGradient>
        {/* Screen inner glow */}
        <radialGradient id="mm-screen" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={COLORS.screenGlow} />
          <stop offset="100%" stopColor={COLORS.screenBg} />
        </radialGradient>
        {/* LED pulse */}
        <radialGradient id="mm-led" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC58A" />
          <stop offset="60%" stopColor={COLORS.signalOrange} />
          <stop offset="100%" stopColor={COLORS.signalOrangeDeep} />
        </radialGradient>
      </defs>

      {/* Ground shadow — soft ellipse anchoring the whole machine */}
      <ellipse cx="120" cy="262" rx="76" ry="6" fill={COLORS.ink} opacity="0.18" />

      {/* ───── Treads (left + right) ─────────────────────────────────── */}
      <TankTreads />

      {/* ───── Body cabinet ──────────────────────────────────────────── */}
      {/* Side dark face for isometric depth */}
      <path
        d="M180 84 L208 96 L208 226 L180 214 Z"
        fill={COLORS.amberDeep}
        stroke={COLORS.ink}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Front face */}
      <rect
        x="48"
        y="84"
        width="132"
        height="142"
        rx="14"
        fill="url(#mm-amber)"
        stroke={COLORS.ink}
        strokeWidth="3"
      />
      {/* Top lid for isometric cap */}
      <path
        d="M48 84 Q56 76 70 76 L168 76 Q188 76 196 88 L180 92 L60 92 Z"
        fill={COLORS.amberDeep}
        stroke={COLORS.ink}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Lid highlight strip */}
      <path
        d="M62 80 L162 80"
        stroke={COLORS.highlight}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Brass corner rivets (4) */}
      {(
        [
          [60, 96],
          [168, 96],
          [60, 214],
          [168, 214],
        ] as ReadonlyArray<readonly [number, number]>
      ).map(([cx, cy]) => (
        <g key={`rivet-${cx}-${cy}`}>
          <circle
            cx={cx}
            cy={cy}
            r="3.5"
            fill="url(#mm-brass)"
            stroke={COLORS.ink}
            strokeWidth="1.4"
          />
          <circle cx={cx - 0.8} cy={cy - 0.8} r="1.2" fill={COLORS.highlight} opacity="0.8" />
        </g>
      ))}

      {/* ───── CRT Screen (face) ─────────────────────────────────────── */}
      {/* Brass bezel */}
      <rect
        x="64"
        y="104"
        width="100"
        height="64"
        rx="10"
        fill="url(#mm-brass)"
        stroke={COLORS.ink}
        strokeWidth="2.5"
      />
      {/* Inner screen */}
      <rect
        x="72"
        y="112"
        width="84"
        height="48"
        rx="6"
        fill="url(#mm-screen)"
        stroke={COLORS.ink}
        strokeWidth="1.6"
      />
      {/* Scanline */}
      <rect x="72" y="124" width="84" height="1" fill="#FFFFFF" opacity="0.06" />
      <rect x="72" y="142" width="84" height="1" fill="#FFFFFF" opacity="0.06" />

      {/* Pixel-art eyes (square dots, calm) */}
      {/* Left eye */}
      <rect
        x="92"
        y={blink ? 134 : 126}
        width="14"
        height={blink ? 2 : 14}
        fill={COLORS.pixelOn}
        rx="1"
        style={!reduced ? { transition: 'all 90ms ease-out' } : undefined}
      />
      {/* Right eye */}
      <rect
        x="122"
        y={blink ? 134 : 126}
        width="14"
        height={blink ? 2 : 14}
        fill={COLORS.pixelOn}
        rx="1"
        style={!reduced ? { transition: 'all 90ms ease-out' } : undefined}
      />
      {/* Pixel highlight gleam (top-left of each eye) */}
      {!blink && (
        <>
          <rect x="93" y="127" width="3" height="3" fill="#FFFFFF" opacity="0.7" />
          <rect x="123" y="127" width="3" height="3" fill="#FFFFFF" opacity="0.7" />
        </>
      )}
      {/* Mouth — a small calm pixel line */}
      <rect x="104" y="150" width="20" height="3" fill={COLORS.pixelOn} opacity="0.85" rx="1" />

      {/* Brass speaker grille (left of screen) */}
      <g>
        {[180, 188, 196, 204].map((y) => (
          <rect key={y} x="174" y={y} width="14" height="2.5" fill={COLORS.brass} rx="1" />
        ))}
      </g>

      {/* ───── Control row beneath screen ────────────────────────────── */}
      {/* Toggle switch */}
      <rect
        x="74"
        y="180"
        width="22"
        height="10"
        rx="5"
        fill={COLORS.ink}
        stroke={COLORS.ink}
        strokeWidth="1.5"
      />
      <circle cx="91" cy="185" r="3.6" fill="url(#mm-brass)" stroke={COLORS.ink} strokeWidth="1" />
      {/* Two indicator buttons */}
      <circle
        cx="108"
        cy="185"
        r="4"
        fill={COLORS.signalOrange}
        stroke={COLORS.ink}
        strokeWidth="1.5"
      />
      <circle cx="120" cy="185" r="4" fill={COLORS.pixelOn} stroke={COLORS.ink} strokeWidth="1.5" />
      {/* Dial */}
      <circle cx="140" cy="185" r="6" fill="url(#mm-brass)" stroke={COLORS.ink} strokeWidth="1.5" />
      <line
        x1="140"
        y1="185"
        x2="140"
        y2="180"
        stroke={COLORS.ink}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Vent slats lower body */}
      {[200, 207].map((y) => (
        <rect key={y} x="74" y={y} width="92" height="2" fill={COLORS.amberDeep} rx="1" />
      ))}

      {/* ───── Carved nameplate at base ──────────────────────────────── */}
      <rect
        x="78"
        y="216"
        width="84"
        height="14"
        rx="3"
        fill={COLORS.brass}
        stroke={COLORS.ink}
        strokeWidth="1.6"
      />
      <text
        x="120"
        y="226"
        textAnchor="middle"
        fontSize="9"
        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
        fontWeight="700"
        fill={COLORS.ink}
        letterSpacing="0.08em"
      >
        PROVO Mk-1
      </text>

      {/* ───── Antenna with pulsing LED ──────────────────────────────── */}
      <line
        x1="120"
        y1="76"
        x2="120"
        y2="46"
        stroke={COLORS.ink}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="120"
        y1="76"
        x2="120"
        y2="46"
        stroke={COLORS.brassLight}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="120" cy="42" r="6" fill="url(#mm-led)" stroke={COLORS.ink} strokeWidth="1.6">
        {!reduced && (
          <animate
            attributeName="r"
            values="5;7;5"
            dur="1.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            keyTimes="0;0.5;1"
          />
        )}
      </circle>
      <circle cx="120" cy="42" r="9" fill={COLORS.signalOrange} opacity="0.25">
        {!reduced && (
          <animate attributeName="r" values="8;14;8" dur="1.4s" repeatCount="indefinite" />
        )}
        {!reduced && (
          <animate
            attributeName="opacity"
            values="0.35;0;0.35"
            dur="1.4s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* ───── Articulated arms + paper-tape readout ─────────────────── */}
      <ArticulatedArms />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function TankTreads() {
  return (
    <g>
      {/* Left tread */}
      <rect
        x="40"
        y="232"
        width="68"
        height="22"
        rx="11"
        fill={COLORS.treadBlack}
        stroke={COLORS.ink}
        strokeWidth="2"
      />
      {/* Tread links */}
      {[48, 58, 68, 78, 88, 98].map((x) => (
        <rect key={`lt-${x}`} x={x} y="236" width="6" height="14" fill="#33303A" rx="1" />
      ))}
      {/* Wheels */}
      <circle
        cx="52"
        cy="243"
        r="6"
        fill={COLORS.brassLight}
        stroke={COLORS.ink}
        strokeWidth="1.6"
      />
      <circle
        cx="96"
        cy="243"
        r="6"
        fill={COLORS.brassLight}
        stroke={COLORS.ink}
        strokeWidth="1.6"
      />
      <circle cx="52" cy="243" r="2" fill={COLORS.ink} />
      <circle cx="96" cy="243" r="2" fill={COLORS.ink} />

      {/* Right tread */}
      <rect
        x="132"
        y="232"
        width="68"
        height="22"
        rx="11"
        fill={COLORS.treadBlack}
        stroke={COLORS.ink}
        strokeWidth="2"
      />
      {[140, 150, 160, 170, 180, 190].map((x) => (
        <rect key={`rt-${x}`} x={x} y="236" width="6" height="14" fill="#33303A" rx="1" />
      ))}
      <circle
        cx="144"
        cy="243"
        r="6"
        fill={COLORS.brassLight}
        stroke={COLORS.ink}
        strokeWidth="1.6"
      />
      <circle
        cx="188"
        cy="243"
        r="6"
        fill={COLORS.brassLight}
        stroke={COLORS.ink}
        strokeWidth="1.6"
      />
      <circle cx="144" cy="243" r="2" fill={COLORS.ink} />
      <circle cx="188" cy="243" r="2" fill={COLORS.ink} />
    </g>
  );
}

function ArticulatedArms() {
  return (
    <g>
      {/* Left arm — upper segment */}
      <path
        d="M48 130 Q34 144 36 168"
        stroke={COLORS.amberDeep}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M48 130 Q34 144 36 168"
        stroke={COLORS.amber}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Shoulder joint */}
      <circle cx="48" cy="130" r="6" fill="url(#mm-brass)" stroke={COLORS.ink} strokeWidth="1.6" />
      {/* Elbow joint */}
      <circle cx="36" cy="168" r="5" fill="url(#mm-brass)" stroke={COLORS.ink} strokeWidth="1.6" />
      {/* Forearm */}
      <path
        d="M36 168 Q44 188 60 196"
        stroke={COLORS.amberDeep}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M36 168 Q44 188 60 196"
        stroke={COLORS.amber}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left claw / paper roll holder */}
      <circle cx="62" cy="198" r="9" fill={COLORS.brass} stroke={COLORS.ink} strokeWidth="1.8" />
      <circle cx="62" cy="198" r="4.5" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth="1.2" />

      {/* Right arm — upper segment */}
      <path
        d="M192 130 Q210 142 208 162"
        stroke={COLORS.amberDeep}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M192 130 Q210 142 208 162"
        stroke={COLORS.amber}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="192" cy="130" r="6" fill="url(#mm-brass)" stroke={COLORS.ink} strokeWidth="1.6" />
      <circle cx="208" cy="162" r="5" fill="url(#mm-brass)" stroke={COLORS.ink} strokeWidth="1.6" />
      {/* Forearm */}
      <path
        d="M208 162 Q200 184 184 192"
        stroke={COLORS.amberDeep}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M208 162 Q200 184 184 192"
        stroke={COLORS.amber}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right claw — gripping the paper edge */}
      <circle cx="180" cy="194" r="7" fill={COLORS.brass} stroke={COLORS.ink} strokeWidth="1.8" />

      {/* Paper-tape readout strung between hands, sagging slightly */}
      <path
        d="M68 198 Q120 218 178 196"
        fill={COLORS.paper}
        stroke={COLORS.ink}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Squiggle "advice" lines on the tape */}
      <path
        d="M86 202 Q96 198 106 204 T126 204 T146 200 T166 202"
        stroke={COLORS.ink}
        strokeWidth="1.2"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M86 208 Q96 206 106 210 T126 209 T146 207 T166 209"
        stroke={COLORS.ink}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      {/* Small ink stamp dot on tape */}
      <circle cx="174" cy="200" r="2" fill={COLORS.signalOrange} />
    </g>
  );
}
