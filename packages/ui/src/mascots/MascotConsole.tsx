'use client';

import { useEffect, useState } from 'react';

import { useReducedMotion } from '../charts/_shared/useReducedMotion';

/**
 * MascotConsole — Variant 3 «Provedo Terminal».
 *
 * 3D-isometric vertical totem. NO face. Five stacked modules:
 *   1. Ticker LED strip — 8-10 mustard LEDs scrolling crypto/equity tickers L→R.
 *   2. Round analog gauge — brass bezel, signal-orange needle wavering ±5°.
 *   3. Dot-matrix indicator panel — 8×4 dots that wave on hover.
 *   4. Paper-tape printer slot — paper edge advancing every 2s.
 *   5. Base — 4 broker-port holes (IB / FID / SCH / RH) + 3 signal-orange button bumps.
 *
 * Cabinet ink-charcoal main, brass accents, mustard LEDs, signal-orange buttons.
 * Right-leaning ~30° isometric tilt. Carved «PROVEDO TERMINAL» label at base.
 *
 * - Inline SVG, no external image dependencies.
 * - Respects `prefers-reduced-motion`.
 * - `size` prop scales the viewBox (default 240 → 240×384 actual w×h).
 */
export interface MascotConsoleProps {
  size?: number;
  className?: string;
}

const VIEW_W = 200;
const VIEW_H = 320;

const COLORS = {
  ink: '#1C1B26',
  inkDeep: '#0E0D14',
  charcoal: '#2A2933',
  charcoalLight: '#3D3A47',
  brass: '#B07028',
  brassLight: '#D8A04A',
  brassHigh: '#F4CC4A',
  mustard: '#F4CC4A',
  mustardDim: '#7A640F',
  signalOrange: '#F08A3C',
  signalOrangeDeep: '#C76A22',
  paper: '#F6E9C9',
  paperShadow: '#D4C49A',
  led: '#FFE38A',
  screen: '#1B3838',
} as const;

const TICKER_TEXT = '+0.4% AAPL · −1.2% TSLA · +2.1% NVDA · +0.7% BTC · −0.3% ETH · ';

export function MascotConsole({ size = 240, className }: MascotConsoleProps) {
  const reduced = useReducedMotion();
  const [paperOffset, setPaperOffset] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Paper-tape advance — 2px every 2s
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setPaperOffset((o) => (o + 2) % 16);
    }, 2000);
    return () => clearInterval(id);
  }, [reduced]);

  const w = size;
  const h = (size * VIEW_H) / VIEW_W;

  return (
    <svg
      role="img"
      aria-label="Provedo Terminal — a vertical isometric console with ticker LEDs, analog gauge, dot-matrix panel, paper-tape printer, and broker-port base"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={w}
      height={h}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Cabinet front gradient — ink-charcoal */}
        <linearGradient id="mc-cabinet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.charcoalLight} />
          <stop offset="40%" stopColor={COLORS.charcoal} />
          <stop offset="100%" stopColor={COLORS.inkDeep} />
        </linearGradient>
        <linearGradient id="mc-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.inkDeep} />
          <stop offset="100%" stopColor={COLORS.charcoal} />
        </linearGradient>
        <linearGradient id="mc-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.brassHigh} />
          <stop offset="100%" stopColor={COLORS.brass} />
        </linearGradient>
        <radialGradient id="mc-led" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFAD8" />
          <stop offset="60%" stopColor={COLORS.mustard} />
          <stop offset="100%" stopColor={COLORS.mustardDim} />
        </radialGradient>
        <radialGradient id="mc-button" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFC58A" />
          <stop offset="60%" stopColor={COLORS.signalOrange} />
          <stop offset="100%" stopColor={COLORS.signalOrangeDeep} />
        </radialGradient>
        {/* Ticker text path — straight horizontal across the strip */}
        <clipPath id="mc-ticker-clip">
          <rect x="30" y="46" width="140" height="14" rx="2" />
        </clipPath>
        <clipPath id="mc-paper-clip">
          <rect x="44" y="218" width="112" height="22" />
        </clipPath>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="100" cy="306" rx="74" ry="6" fill={COLORS.ink} opacity="0.22" />

      {/* Right-leaning ~30° isometric — done by drawing a side face */}
      {/* Cabinet side (right) — gives the totem its 3-quarter perspective */}
      <path
        d="M170 32 L186 44 L186 290 L170 300 Z"
        fill="url(#mc-side)"
        stroke={COLORS.ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cabinet top cap */}
      <path
        d="M30 32 L170 32 L186 44 L46 44 Z"
        fill={COLORS.charcoalLight}
        stroke={COLORS.ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="46"
        y1="40"
        x2="180"
        y2="40"
        stroke={COLORS.brassLight}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* Cabinet front — main face */}
      <rect
        x="30"
        y="32"
        width="140"
        height="268"
        rx="6"
        fill="url(#mc-cabinet)"
        stroke={COLORS.ink}
        strokeWidth="2.5"
      />

      {/* ─── Module 1: Ticker LED strip ─────────────────────────────── */}
      <rect
        x="30"
        y="46"
        width="140"
        height="14"
        fill={COLORS.inkDeep}
        stroke={COLORS.brass}
        strokeWidth="1.4"
      />
      <g clipPath="url(#mc-ticker-clip)">
        {/* Faux LED dot-matrix text — render with monospace + currentColor on mustard fill */}
        <text
          x="172"
          y="57"
          fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          fontSize="9"
          fontWeight="700"
          fill={COLORS.mustard}
          letterSpacing="0.05em"
        >
          {!reduced && (
            <animate attributeName="x" from="172" to="-180" dur="14s" repeatCount="indefinite" />
          )}
          {TICKER_TEXT.repeat(2)}
        </text>
      </g>
      {/* LED dot indicators along strip (pure decoration) */}
      {[36, 56, 76, 96, 116, 136, 156].map((cx) => (
        <circle key={`led-${cx}`} cx={cx} cy="65" r="1.4" fill={COLORS.mustard} opacity="0.55" />
      ))}

      {/* ─── Module 2: Analog gauge ─────────────────────────────────── */}
      <g>
        {/* Brass bezel */}
        <circle cx="100" cy="98" r="26" fill="url(#mc-brass)" stroke={COLORS.ink} strokeWidth="2" />
        {/* Inner dial */}
        <circle cx="100" cy="98" r="20" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth="1.4" />
        {/* Tick marks (12) */}
        {Array.from({ length: 12 }, (_, i) => i).map((tickIndex) => {
          const a = (tickIndex * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + 16 * Math.cos(a);
          const y1 = 98 + 16 * Math.sin(a);
          const x2 = 100 + 19 * Math.cos(a);
          const y2 = 98 + 19 * Math.sin(a);
          return (
            <line
              key={`tick-${tickIndex * 30}deg`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={COLORS.ink}
              strokeWidth={tickIndex % 3 === 0 ? 1.6 : 0.8}
            />
          );
        })}
        {/* Needle — wavering ±5° around -10° */}
        <g transform="translate(100 98)">
          {!reduced && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-15;-5;-15"
              dur="3s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              keyTimes="0;0.5;1"
            />
          )}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-15"
            stroke={COLORS.signalOrange}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="2.4" fill={COLORS.ink} />
        </g>
        {/* Tiny brand etch */}
        <text
          x="100"
          y="88"
          textAnchor="middle"
          fontSize="4"
          fontFamily="ui-monospace, monospace"
          fill={COLORS.ink}
          opacity="0.5"
          letterSpacing="0.1em"
        >
          PROVEDO
        </text>
      </g>

      {/* ─── Module 3: Dot-matrix indicator panel (8×4 = 32 dots) ──── */}
      <g>
        <rect
          x="38"
          y="138"
          width="124"
          height="36"
          rx="3"
          fill={COLORS.screen}
          stroke={COLORS.ink}
          strokeWidth="1.6"
        />
        {Array.from({ length: 4 }, (_, row) => row).map((row) =>
          Array.from({ length: 8 }, (_, col) => col).map((col) => {
            const cx = 50 + col * 14;
            const cy = 146 + row * 7;
            // Wave pattern: brighter near hovered "wave crest"
            const waveOn =
              hovered && !reduced ? (col + row) % 3 === Math.floor(Date.now() / 300) % 3 : false;
            // Static interesting checker baseline
            const baseOn = (col + row * 2) % 5 === 0;
            const lit = waveOn || baseOn;
            return (
              <circle
                key={`dm-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="2"
                fill={lit ? COLORS.mustard : COLORS.mustardDim}
                opacity={lit ? 1 : 0.4}
              />
            );
          }),
        )}
      </g>

      {/* ─── Module 4: Paper-tape printer slot ─────────────────────── */}
      <g>
        {/* Slot housing */}
        <rect
          x="38"
          y="186"
          width="124"
          height="40"
          rx="3"
          fill={COLORS.charcoalLight}
          stroke={COLORS.ink}
          strokeWidth="1.6"
        />
        {/* Slot opening */}
        <rect
          x="44"
          y="214"
          width="112"
          height="6"
          fill={COLORS.inkDeep}
          stroke={COLORS.ink}
          strokeWidth="1.2"
        />
        {/* Paper edge — sticking out, animated by paperOffset */}
        <g clipPath="url(#mc-paper-clip)">
          <g transform={`translate(0 ${paperOffset})`}>
            <rect
              x="48"
              y="220"
              width="104"
              height="20"
              fill={COLORS.paper}
              stroke={COLORS.ink}
              strokeWidth="1"
            />
            {/* Paper jagged tear edge */}
            <path
              d="M48 240 L52 237 L56 240 L60 237 L64 240 L68 237 L72 240 L76 237 L80 240 L84 237 L88 240 L92 237 L96 240 L100 237 L104 240 L108 237 L112 240 L116 237 L120 240 L124 237 L128 240 L132 237 L136 240 L140 237 L144 240 L148 237 L152 240"
              stroke={COLORS.ink}
              strokeWidth="1"
              fill={COLORS.paper}
            />
            {/* Squiggle "advice" lines on paper */}
            <path
              d="M54 226 Q64 224 74 228 T94 228 T114 226 T134 228 T148 226"
              stroke={COLORS.ink}
              strokeWidth="0.9"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M54 232 Q64 230 74 234 T94 233 T114 232 T134 234"
              stroke={COLORS.ink}
              strokeWidth="0.7"
              fill="none"
              opacity="0.55"
            />
          </g>
        </g>
        {/* Small label above slot */}
        <text
          x="100"
          y="200"
          textAnchor="middle"
          fontSize="6"
          fontFamily="ui-monospace, monospace"
          fontWeight="700"
          fill={COLORS.brassHigh}
          letterSpacing="0.15em"
        >
          ADVICE OUT
        </text>
      </g>

      {/* ─── Module 5: Base — broker ports + button bumps ──────────── */}
      <g>
        <rect
          x="38"
          y="246"
          width="124"
          height="36"
          rx="3"
          fill={COLORS.charcoal}
          stroke={COLORS.ink}
          strokeWidth="1.6"
        />
        {/* Broker ports — IB / FID / SCH / RH */}
        {(
          [
            { x: 52, label: 'IB' },
            { x: 80, label: 'FID' },
            { x: 108, label: 'SCH' },
            { x: 136, label: 'RH' },
          ] as ReadonlyArray<{ x: number; label: string }>
        ).map((p) => (
          <g key={p.label}>
            <circle
              cx={p.x}
              cy="258"
              r="5"
              fill={COLORS.inkDeep}
              stroke={COLORS.ink}
              strokeWidth="1.2"
            />
            <circle cx={p.x} cy="258" r="2" fill={COLORS.charcoalLight} />
            <text
              x={p.x}
              y="270"
              textAnchor="middle"
              fontSize="5"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
              fill={COLORS.brassHigh}
              letterSpacing="0.05em"
            >
              {p.label}
            </text>
          </g>
        ))}
        {/* Three signal-orange button bumps */}
        {[64, 100, 136].map((cx, i) => (
          <g key={`btn-${cx}`}>
            <circle
              cx={cx}
              cy="278"
              r="3.2"
              fill="url(#mc-button)"
              stroke={COLORS.ink}
              strokeWidth="1.2"
            >
              {!reduced && (
                <animate
                  attributeName="opacity"
                  values="1;0.7;1"
                  dur={`${1.6 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}
      </g>

      {/* ─── Carved nameplate at the very base ─────────────────────── */}
      <rect
        x="44"
        y="288"
        width="112"
        height="14"
        rx="2"
        fill="url(#mc-brass)"
        stroke={COLORS.ink}
        strokeWidth="1.4"
      />
      <text
        x="100"
        y="298"
        textAnchor="middle"
        fontSize="9"
        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
        fontWeight="700"
        fill={COLORS.ink}
        letterSpacing="0.18em"
      >
        PROVEDO TERMINAL
      </text>

      {/* ─── Subtle vertical seams to amplify the cabinet feel ─────── */}
      <line
        x1="34"
        y1="68"
        x2="34"
        y2="296"
        stroke={COLORS.charcoalLight}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="166"
        y1="68"
        x2="166"
        y2="296"
        stroke={COLORS.charcoalLight}
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* ─── Tiny brass screws at corners ───────────────────────────── */}
      {(
        [
          [38, 38],
          [162, 38],
          [38, 296],
          [162, 296],
        ] as ReadonlyArray<readonly [number, number]>
      ).map(([cx, cy]) => (
        <g key={`screw-${cx}-${cy}`}>
          <circle
            cx={cx}
            cy={cy}
            r="2"
            fill="url(#mc-brass)"
            stroke={COLORS.ink}
            strokeWidth="0.8"
          />
          <line x1={cx - 1.4} y1={cy} x2={cx + 1.4} y2={cy} stroke={COLORS.ink} strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}
