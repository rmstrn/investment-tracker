'use client';

// ProvedoHeroV2 — §S1 stacked 3-mockup hero (v3)
// V3.3: typewriter animation on L1 chat surface — user message types in 1.5s, Provedo response in 2s
// Spec: visual spec §1 — 3 layered product surfaces with scroll parallax
// Responsive: L1-only mobile, L1+L2 tablet, full 3-stack desktop
// Motion: parallax max 12px (transform+opacity only) + typing animation
// Accessibility: all 3 layers semantically readable; aria-live on typing output
// Copy: §S1 verbatim (Patch D verified: primary «Ask Provedo» + secondary text-link, no trial CTA)

import { useEffect, useRef, useState } from 'react';
import { ProvedoButton, ProvedoNavLink } from './ProvedoButton';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

// ─── Typing animation hook ────────────────────────────────────────────────────

const USER_MESSAGE = 'Why is my portfolio down this month?';
const PROVEDO_RESPONSE =
  "You're down −4.2% this month. 62% of the drawdown is two positions: Apple (−11%) and Tesla (−8%).";

function useTypingSequence(prefersReduced: boolean) {
  const [userText, setUserText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [phase, setPhase] = useState<'idle' | 'user' | 'pause' | 'response' | 'done'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setUserText(USER_MESSAGE);
      setResponseText(PROVEDO_RESPONSE);
      setPhase('done');
      return;
    }

    // Start with 800ms delay so it's not jarring on page load
    timerRef.current = setTimeout(() => {
      setPhase('user');
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (phase === 'user') {
      let idx = 0;
      const msPerChar = 1500 / USER_MESSAGE.length; // ~40ms/char
      intervalRef.current = setInterval(() => {
        idx += 1;
        setUserText(USER_MESSAGE.slice(0, idx));
        if (idx >= USER_MESSAGE.length) {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          // 600ms pause before Provedo response
          timerRef.current = setTimeout(() => setPhase('response'), 600);
        }
      }, msPerChar);
    }

    if (phase === 'response') {
      let idx = 0;
      const msPerChar = 2000 / PROVEDO_RESPONSE.length; // ~20ms/char
      intervalRef.current = setInterval(() => {
        idx += 1;
        setResponseText(PROVEDO_RESPONSE.slice(0, idx));
        if (idx >= PROVEDO_RESPONSE.length) {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          setPhase('done');
        }
      }, msPerChar);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const isTypingUser = phase === 'user';
  const isTypingResponse = phase === 'response';

  return { userText, responseText, isTypingUser, isTypingResponse, phase };
}

// ─── Chat cursor ─────────────────────────────────────────────────────────────

function TypingCursor({ visible }: { visible: boolean }): React.ReactElement | null {
  if (!visible) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '2px',
        height: '0.85em',
        backgroundColor: 'var(--provedo-accent)',
        verticalAlign: 'text-bottom',
        animation: 'provedo-cursor-blink 0.75s step-start infinite',
      }}
    />
  );
}

// ─── Hero mock surfaces ──────────────────────────────────────────────────────

function ChatMockup({ prefersReduced }: { prefersReduced: boolean }): React.ReactElement {
  const { userText, responseText, isTypingUser, isTypingResponse, phase } =
    useTypingSequence(prefersReduced);

  return (
    <article
      aria-label="Provedo demo conversation"
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--provedo-bg-elevated)',
        borderColor: 'var(--provedo-border-subtle)',
        boxShadow: '0 8px 24px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)',
      }}
    >
      {/* Provedo wordmark */}
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--provedo-accent)' }}
      >
        Provedo
      </p>

      {/* User bubble */}
      <div className="mb-3 flex justify-end" aria-label="User message">
        <div
          className="max-w-[85%] rounded-xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed"
          style={{
            backgroundColor: 'var(--provedo-bg-subtle)',
            color: 'var(--provedo-text-secondary)',
            border: '1px solid var(--provedo-border-subtle)',
            minHeight: '2rem',
          }}
        >
          {userText || <span style={{ opacity: 0.3 }}>Why is my portfolio…</span>}
          <TypingCursor visible={isTypingUser} />
        </div>
      </div>

      {/* Provedo response */}
      {(phase === 'response' || phase === 'done' || prefersReduced) && (
        <div
          className="rounded-xl rounded-tl-sm border px-3 py-2 text-xs leading-relaxed"
          style={{
            backgroundColor: 'var(--provedo-bg-elevated)',
            borderColor: 'var(--provedo-border-subtle)',
            color: 'var(--provedo-text-primary)',
            minHeight: '3rem',
          }}
          aria-live="polite"
          aria-label="Provedo response"
        >
          <p>
            {responseText}
            <TypingCursor visible={isTypingResponse} />
          </p>

          {/* Inline P&L mini sparkline — always visible once response appears */}
          <svg
            viewBox="0 0 200 36"
            width="200"
            height="36"
            role="img"
            aria-label="P&L trend line showing decline"
            style={{
              marginTop: '8px',
              display: 'block',
              opacity: phase === 'done' || prefersReduced ? 1 : 0.4,
              transition: 'opacity 400ms ease',
            }}
          >
            <line
              x1="0"
              y1="8"
              x2="200"
              y2="8"
              stroke="var(--provedo-border-subtle)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <polyline
              fill="none"
              stroke="var(--provedo-text-secondary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,8 30,10 60,14 80,20 100,26 130,28 160,30 200,30"
            />
            <circle cx="80" cy="20" r="3" fill="var(--provedo-negative)" />
            <circle cx="130" cy="28" r="3" fill="var(--provedo-negative)" />
            <text
              x="196"
              y="29"
              fontSize="9"
              fontFamily="var(--provedo-font-mono)"
              fill="var(--provedo-negative)"
              textAnchor="end"
            >
              −4.2%
            </text>
          </svg>
        </div>
      )}
    </article>
  );
}

function InsightFeedMockup(): React.ReactElement {
  const items = [
    { type: 'Dividend coming', detail: 'KO · Sept 14 · $87' },
    { type: 'Drawdown forming', detail: 'AAPL −11% · 8d' },
    { type: 'Concentration', detail: 'Tech 58% · +4pp QoQ' },
  ] as const;

  return (
    <div
      className="rounded-xl border p-4"
      aria-label="Provedo weekly insights feed"
      style={{
        backgroundColor: 'var(--provedo-bg-elevated)',
        borderColor: 'var(--provedo-border-subtle)',
        boxShadow: '0 4px 8px rgba(15,23,42,0.05), 0 2px 4px rgba(15,23,42,0.04)',
      }}
    >
      <p
        className="mb-3 text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--provedo-text-tertiary)' }}
      >
        This week — 3 items
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.type} className="flex items-start gap-2">
            <span
              className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: 'var(--provedo-accent)', marginTop: '4px' }}
              aria-hidden="true"
            />
            <span
              className="text-xs leading-relaxed"
              style={{ color: 'var(--provedo-text-secondary)' }}
            >
              <span style={{ color: 'var(--provedo-text-primary)', fontWeight: 500 }}>
                {item.type}
              </span>
              {' · '}
              <span
                style={{
                  fontFamily: 'var(--provedo-font-mono)',
                  color: 'var(--provedo-text-tertiary)',
                }}
              >
                {item.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrokerPieMockup(): React.ReactElement {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--provedo-bg-elevated)',
        borderColor: 'var(--provedo-border-subtle)',
        boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
      }}
    >
      <p
        className="mb-3 text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--provedo-text-tertiary)' }}
      >
        Across IBKR + Schwab
      </p>
      <svg
        viewBox="0 0 160 100"
        width="160"
        height="100"
        role="img"
        aria-label="Cross-broker allocation: Tech 58%, Financials 18%, Healthcare 14%, Other 10%"
      >
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="var(--provedo-accent)"
          strokeWidth="18"
          strokeDasharray="109.6 80"
          strokeDashoffset="0"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="var(--provedo-text-secondary)"
          strokeWidth="18"
          strokeDasharray="33.9 155.7"
          strokeDashoffset="-109.6"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="var(--provedo-text-tertiary)"
          strokeWidth="18"
          strokeDasharray="26.4 163.2"
          strokeDashoffset="-143.5"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="var(--provedo-border-default)"
          strokeWidth="18"
          strokeDasharray="18.8 170.8"
          strokeDashoffset="-169.9"
        />
        <text
          x="50"
          y="47"
          fontSize="10"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-primary)"
          textAnchor="middle"
          fontWeight="500"
        >
          $231k
        </text>
        <text
          x="50"
          y="58"
          fontSize="8"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          textAnchor="middle"
        >
          total
        </text>
        <text
          x="100"
          y="28"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-accent)"
          fontWeight="500"
        >
          Tech 58%
        </text>
        <text
          x="100"
          y="40"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
        >
          Fin. 18%
        </text>
        <text
          x="100"
          y="52"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
        >
          Health 14%
        </text>
        <text
          x="100"
          y="64"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-border-default)"
        >
          Other 10%
        </text>
      </svg>
    </div>
  );
}

// ─── Main hero component ─────────────────────────────────────────────────────

export function ProvedoHeroV2(): React.ReactElement {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
            setScrollY(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReduced]);

  const l2Offset = prefersReduced ? 0 : scrollY * 6;
  const l3Offset = prefersReduced ? 0 : scrollY * 12;

  return (
    <>
      {/* Global CSS for cursor blink animation */}
      <style>{`
        @keyframes provedo-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <section
        ref={heroRef}
        aria-labelledby="hero-heading"
        className="relative px-4 pb-20 pt-20 md:pb-28 md:pt-28"
        style={{ backgroundColor: 'var(--provedo-bg-page)', overflow: 'hidden' }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-8">
            {/* Left — text column */}
            <div className="flex-shrink-0 text-center lg:max-w-xl lg:text-left">
              <h1
                id="hero-heading"
                className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
                style={{ color: 'var(--provedo-text-primary)' }}
              >
                Provedo will lead you through your portfolio.
              </h1>

              <p
                className="mt-6 text-lg leading-relaxed md:text-xl"
                style={{ color: 'var(--provedo-text-secondary)' }}
              >
                Notice what you&apos;d miss across all your brokers.
              </p>

              {/* v3 dual-CTA stack — Patch D verified: primary + secondary text-link, no trial */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <ProvedoButton href="#demo" variant="primary" size="lg">
                  Ask Provedo
                </ProvedoButton>
                <ProvedoNavLink
                  href="/sign-up"
                  className="flex h-12 items-center text-base font-medium"
                  colorFrom="var(--provedo-text-tertiary)"
                  colorTo="var(--provedo-accent)"
                >
                  Or start free forever
                </ProvedoNavLink>
              </div>

              <p className="mt-3 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
                No card. 50 chat messages a month, free always.
              </p>
            </div>

            {/* Right — stacked mockup visual column */}
            <div
              className="relative w-full flex-1"
              style={{ minHeight: '380px' }}
              aria-hidden="false"
            >
              {/* L3 — Cross-broker pie (back, most faded) — desktop only */}
              <div
                className="absolute hidden lg:block"
                style={{
                  width: '320px',
                  top: '0px',
                  left: '-48px',
                  opacity: 0.6,
                  zIndex: 10,
                  transform: `translateY(${l3Offset}px)`,
                }}
              >
                <BrokerPieMockup />
              </div>

              {/* L2 — Insight feed (mid) — tablet + desktop */}
              <div
                className="absolute hidden md:block"
                style={{
                  width: '320px',
                  top: '24px',
                  right: '-32px',
                  opacity: 0.92,
                  zIndex: 20,
                  transform: `translateY(${l2Offset}px)`,
                }}
              >
                <InsightFeedMockup />
              </div>

              {/* L1 — Chat surface (front, full opacity) — always visible */}
              <div
                className="relative mx-auto"
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  marginTop: '48px',
                  zIndex: 30,
                  opacity: 1,
                }}
              >
                <ChatMockup prefersReduced={prefersReduced} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
