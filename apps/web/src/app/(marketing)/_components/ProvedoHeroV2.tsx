'use client';

// ProvedoHeroV2 — §S1 stacked 3-mockup hero (v3)
// Slice-LP3.4 hero ChatMockup polish (Proposal A, brand-voice APPROVE-AS-DRAFTED 2026-04-27):
//   - Content: §S4-Tab-1-grade response with event anchors + sources line (verbatim per
//     brand-voice review §2.5; «delivery miss» kept — actual reporting language).
//   - Layout: wordmark moved INLINE above response bubble (matches §S4 ProvedoBubble);
//     padding bumped px-3 py-2 → px-4 py-3; text-xs → text-sm; user-bubble border dropped.
//   - Tokens: tickers/amounts/dates wrapped in JBM-mono (Mono/Neg primitives).
//   - Motion: variable typing speed (base 35ms ±10ms jitter), +180ms pauses on sentence
//     punctuation, 1400ms inter-bubble pause (was 600ms — reading-time-respecting),
//     200ms fade-up entrance on response bubble (compositor-friendly).
//   - Replay-on-intersection: useInView with triggerOnce:false resets state on scroll-back.
//   - Reduced-motion fallback: full-text static render, no typing, no fade.
// Spec: visual spec §1 — 3 layered product surfaces with scroll parallax.
// Responsive: L1-only mobile, L1+L2 tablet, full 3-stack desktop.
// Motion budget: parallax max 12px (transform+opacity only) + typing animation.
// Accessibility: all 3 layers semantically readable; aria-live on typing output.
// Copy: §S1 verbatim (Patch D verified: primary «Ask Provedo» + secondary text-link, no trial CTA).

import { useEffect, useRef, useState } from 'react';
import { ProvedoButton } from './ProvedoButton';
import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

// ─── Typing animation hook ────────────────────────────────────────────────────

// Exported for unit tests — content invariants are verified directly against these
// constants, avoiding dependencies on async typing-animation timing in tests.
export const HERO_USER_MESSAGE = 'Why is my portfolio down this month?';

type SegmentKind = 'text' | 'mono' | 'neg';
interface ResponseSegment {
  kind: SegmentKind;
  text: string;
}

// Provedo response — segmented to support mono-formatted tokens during typing.
// PD-proposed exact text (brand-voice APPROVE-AS-DRAFTED §2.5; verbatim, do NOT paraphrase).
// Total: «You're down −4.2% this month. 62% of the drawdown is two positions:
// Apple (−11%) after Q3 earnings on 2025-10-31, and Tesla (−8%) after the
// 2025-10-22 delivery miss. The rest of your portfolio is roughly flat.»
export const HERO_RESPONSE_SEGMENTS: readonly ResponseSegment[] = [
  { kind: 'text', text: "You're down " },
  { kind: 'neg', text: '−4.2%' },
  { kind: 'text', text: ' this month. ' },
  { kind: 'mono', text: '62%' },
  { kind: 'text', text: ' of the drawdown is two positions: ' },
  { kind: 'mono', text: 'Apple (−11%)' },
  { kind: 'text', text: ' after Q3 earnings on ' },
  { kind: 'mono', text: '2025-10-31' },
  { kind: 'text', text: ', and ' },
  { kind: 'mono', text: 'Tesla (−8%)' },
  { kind: 'text', text: ' after the ' },
  { kind: 'mono', text: '2025-10-22' },
  { kind: 'text', text: ' delivery miss. The rest of your portfolio is roughly flat.' },
];

// Sources line — verbatim per brand-voice §2.5 + PD audit §4 (matches §S4 Tab 1).
export const HERO_SOURCES_LINE =
  'Sources: AAPL Q3 earnings 2025-10-31 · TSLA Q3 delivery report 2025-10-22 · holdings via Schwab statement 2025-11-01.';

// Concatenated response length drives the typing index.
const RESPONSE_TOTAL_LENGTH = HERO_RESPONSE_SEGMENTS.reduce((acc, seg) => acc + seg.text.length, 0);
const RESPONSE_FULL_TEXT = HERO_RESPONSE_SEGMENTS.map((s) => s.text).join('');

// Typing-speed knobs — Proposal A motion polish.
const TYPING_BASE_MS_PER_CHAR = 35;
const TYPING_JITTER_MS = 10; // ±10ms randomized per char
const SENTENCE_PUNCTUATION_PAUSE_MS = 180; // extra pause after . ! ?
const INTER_BUBBLE_PAUSE_MS = 1400; // user-complete → response-start (was 600ms)
const INITIAL_DELAY_MS = 800;

type Phase = 'idle' | 'user' | 'pause' | 'response' | 'done';

interface UseTypingSequenceReturn {
  userText: string;
  responseIndex: number;
  isTypingUser: boolean;
  isTypingResponse: boolean;
  phase: Phase;
  showResponseBubble: boolean;
}

function nextDelayForChar(char: string): number {
  // Variable-rate typewriter — base + uniform-random jitter; sentence pause on punctuation.
  // The `.test()` keeps body small; the regex matches once per char so cost is negligible.
  const isSentenceEnd = /[.!?]/.test(char);
  const jitter = (Math.random() * 2 - 1) * TYPING_JITTER_MS;
  return TYPING_BASE_MS_PER_CHAR + jitter + (isSentenceEnd ? SENTENCE_PUNCTUATION_PAUSE_MS : 0);
}

function useTypingSequence(prefersReduced: boolean, replayKey: number): UseTypingSequenceReturn {
  const [userText, setUserText] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when replayKey changes (replay-on-intersection trigger).
  // replayKey is read inside so biome's exhaustive-deps rule sees the dependency
  // explicitly — its identity changing is the signal to restart the typing sequence.
  useEffect(() => {
    void replayKey; // explicit dependency — re-run signal for the typing sequence
    if (timerRef.current) clearTimeout(timerRef.current);
    setUserText('');
    setResponseIndex(0);
    setPhase('idle');

    if (prefersReduced) {
      setUserText(HERO_USER_MESSAGE);
      setResponseIndex(RESPONSE_TOTAL_LENGTH);
      setPhase('done');
      return;
    }

    timerRef.current = setTimeout(() => setPhase('user'), INITIAL_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prefersReduced, replayKey]);

  // User-bubble typing — variable speed.
  useEffect(() => {
    if (phase !== 'user') return undefined;

    let idx = 0;
    let cancelled = false;
    let localTimer: ReturnType<typeof setTimeout> | null = null;

    function tick(): void {
      if (cancelled) return;
      idx += 1;
      setUserText(HERO_USER_MESSAGE.slice(0, idx));
      if (idx >= HERO_USER_MESSAGE.length) {
        localTimer = setTimeout(() => {
          if (!cancelled) setPhase('response');
        }, INTER_BUBBLE_PAUSE_MS);
        return;
      }
      const char = HERO_USER_MESSAGE.charAt(idx - 1);
      localTimer = setTimeout(tick, nextDelayForChar(char));
    }

    localTimer = setTimeout(tick, nextDelayForChar(HERO_USER_MESSAGE.charAt(0)));

    return () => {
      cancelled = true;
      if (localTimer) clearTimeout(localTimer);
    };
  }, [phase]);

  // Response-bubble typing — variable speed + sentence pauses.
  useEffect(() => {
    if (phase !== 'response') return undefined;

    let idx = 0;
    let cancelled = false;
    let localTimer: ReturnType<typeof setTimeout> | null = null;

    function tick(): void {
      if (cancelled) return;
      idx += 1;
      setResponseIndex(idx);
      if (idx >= RESPONSE_TOTAL_LENGTH) {
        setPhase('done');
        return;
      }
      const char = RESPONSE_FULL_TEXT.charAt(idx - 1);
      localTimer = setTimeout(tick, nextDelayForChar(char));
    }

    localTimer = setTimeout(tick, nextDelayForChar(RESPONSE_FULL_TEXT.charAt(0)));

    return () => {
      cancelled = true;
      if (localTimer) clearTimeout(localTimer);
    };
  }, [phase]);

  const isTypingUser = phase === 'user';
  const isTypingResponse = phase === 'response';
  const showResponseBubble = phase === 'response' || phase === 'done' || prefersReduced;

  return { userText, responseIndex, isTypingUser, isTypingResponse, phase, showResponseBubble };
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

// ─── Mono / Neg primitives (mirrors §S4 ProvedoDemoTabsV2) ──────────────────

function MonoToken({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span
      data-testid="hero-mono-token"
      style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-text-primary)' }}
    >
      {children}
    </span>
  );
}

function NegToken({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span
      data-testid="hero-neg-token"
      style={{ fontFamily: 'var(--provedo-font-mono)', color: 'var(--provedo-negative)' }}
    >
      {children}
    </span>
  );
}

// Render the response text up to `revealedChars` characters, preserving segment styling.
// Each segment renders as plain text, mono-token, or neg-token; partial segments stop at
// the boundary so typing reveals tokens char-by-char with their styling already applied.
function renderResponseSegments(revealedChars: number): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  let consumed = 0;

  for (let i = 0; i < HERO_RESPONSE_SEGMENTS.length; i += 1) {
    const seg = HERO_RESPONSE_SEGMENTS[i];
    if (!seg) continue;
    if (revealedChars <= consumed) break;
    const remaining = revealedChars - consumed;
    const slice = seg.text.slice(0, remaining);
    if (slice.length === 0) break;

    const key = `seg-${i}`;
    if (seg.kind === 'text') {
      out.push(<span key={key}>{slice}</span>);
    } else if (seg.kind === 'mono') {
      out.push(<MonoToken key={key}>{slice}</MonoToken>);
    } else {
      out.push(<NegToken key={key}>{slice}</NegToken>);
    }

    consumed += seg.text.length;
  }

  return out;
}

// ─── Hero mock surfaces ──────────────────────────────────────────────────────

// Inline P&L mini sparkline — visible once response complete.
// Extracted from ChatMockup to keep cognitive complexity within budget.
function InlinePnlSparkline({
  visible,
  prefersReduced,
}: {
  visible: boolean;
  prefersReduced: boolean;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 200 36"
      width="200"
      height="36"
      role="img"
      aria-label="P&L trend line showing decline"
      style={{
        marginTop: '8px',
        display: 'block',
        opacity: visible || prefersReduced ? 1 : 0.4,
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
        stroke="var(--provedo-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,8 30,10 60,14 80,20 100,26 130,28 160,30 200,30"
      />
      <circle cx="80" cy="20" r="3" fill="var(--provedo-negative)" />
      <circle cx="130" cy="28" r="3" fill="var(--provedo-negative)" />
      <text
        x="196"
        y="29"
        fontSize="11"
        fontFamily="var(--provedo-font-mono)"
        fill="var(--provedo-negative)"
        fontWeight="600"
        textAnchor="end"
      >
        −4.2%
      </text>
    </svg>
  );
}

interface ProvedoResponseBubbleProps {
  responseElements: React.ReactElement[];
  isTypingResponse: boolean;
  isComplete: boolean;
  prefersReduced: boolean;
}

// Provedo response bubble — wordmark inline above (matches §S4 ProvedoBubble).
// Extracted from ChatMockup so its conditional sub-elements (sources line,
// sparkline visibility) don't push the parent's cognitive complexity over budget.
function ProvedoResponseBubble({
  responseElements,
  isTypingResponse,
  isComplete,
  prefersReduced,
}: ProvedoResponseBubbleProps): React.ReactElement {
  return (
    <>
      <p
        className="mb-1.5 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--provedo-accent)' }}
      >
        Provedo
      </p>
      <div
        className="rounded-xl rounded-tl-sm border px-4 py-3 text-sm leading-relaxed"
        style={{
          backgroundColor: 'var(--provedo-bg-elevated)',
          borderColor: 'var(--provedo-border-subtle)',
          color: 'var(--provedo-text-primary)',
          minHeight: '4rem',
        }}
        aria-live="polite"
        aria-label="Provedo response"
      >
        <p>
          {responseElements}
          <TypingCursor visible={isTypingResponse} />
        </p>

        {/* Sources line — verbatim per brand-voice §2.5; appears after typing completes */}
        {(isComplete || prefersReduced) && (
          <p
            className="mt-2 text-xs italic"
            style={{
              color: 'var(--provedo-text-tertiary)',
              opacity: prefersReduced ? 1 : 0,
              animation: prefersReduced
                ? 'none'
                : 'provedo-sources-fade-in 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {HERO_SOURCES_LINE}
          </p>
        )}

        <InlinePnlSparkline visible={isComplete} prefersReduced={prefersReduced} />
      </div>
    </>
  );
}

function ChatMockup({ prefersReduced }: { prefersReduced: boolean }): React.ReactElement {
  // Replay-on-intersection — triggerOnce:false so scroll-back restarts the demo.
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: false });
  const [replayKey, setReplayKey] = useState(0);
  const wasInViewRef = useRef(false);

  // Bump replayKey every time the component re-enters the viewport (rising edge of inView).
  useEffect(() => {
    if (inView && !wasInViewRef.current) {
      setReplayKey((k) => k + 1);
    }
    wasInViewRef.current = inView;
  }, [inView]);

  const { userText, responseIndex, isTypingUser, isTypingResponse, phase, showResponseBubble } =
    useTypingSequence(prefersReduced, replayKey);

  const responseElements = prefersReduced
    ? renderResponseSegments(RESPONSE_TOTAL_LENGTH)
    : renderResponseSegments(responseIndex);

  const isResponseVisible = phase === 'response' || phase === 'done';

  // Response-bubble entrance — fade + 8px translate-up on first appearance after typing
  // pause. Compositor-friendly (opacity + transform). Skipped under reduced-motion.
  const responseEntranceStyle: React.CSSProperties = prefersReduced
    ? {}
    : {
        opacity: isResponseVisible ? 1 : 0,
        transform: isResponseVisible ? 'translateY(0)' : 'translateY(8px)',
        transition:
          'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      };

  return (
    <article
      ref={ref}
      aria-label="Provedo demo conversation"
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--provedo-bg-elevated)',
        borderColor: 'var(--provedo-border-subtle)',
        boxShadow: '0 8px 24px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)',
      }}
    >
      {/* User bubble — border dropped (redundant on white card bg per audit §2.2.7) */}
      <div className="mb-4 flex justify-end" aria-label="User message">
        <div
          className="max-w-[85%] rounded-xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--provedo-bg-subtle)',
            color: 'var(--provedo-text-secondary)',
            minHeight: '2.25rem',
          }}
        >
          {userText || <span style={{ opacity: 0.3 }}>Why is my portfolio…</span>}
          <TypingCursor visible={isTypingUser} />
        </div>
      </div>

      {/* Provedo response — wordmark inline above bubble (matches §S4 ProvedoBubble) */}
      {showResponseBubble && (
        <div style={responseEntranceStyle}>
          <ProvedoResponseBubble
            responseElements={responseElements}
            isTypingResponse={isTypingResponse}
            isComplete={phase === 'done'}
            prefersReduced={prefersReduced}
          />
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
        viewBox="0 0 160 110"
        width="160"
        height="110"
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
        {/* Slice-LP3.3 §E typography lift: primary numeral 18pt, supporting at 11pt floor */}
        <text
          x="50"
          y="48"
          fontSize="18"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-primary)"
          textAnchor="middle"
          fontWeight="600"
        >
          $231k
        </text>
        <text
          x="50"
          y="62"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          textAnchor="middle"
        >
          total
        </text>
        <text
          x="100"
          y="28"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-accent)"
          fontWeight="600"
        >
          Tech 58%
        </text>
        <text
          x="100"
          y="44"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
        >
          Fin. 18%
        </text>
        <text
          x="100"
          y="60"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
        >
          Health 14%
        </text>
        <text
          x="100"
          y="76"
          fontSize="11"
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
      {/* Global CSS for cursor blink + sources fade-in animations */}
      <style>{`
        @keyframes provedo-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes provedo-sources-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
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

              {/* v3.2 single-CTA — secondary «Or start free forever» dropped per PO microcopy
                  principle 2026-04-27 (no «free forever» framings in marketing surface) */}
              <div className="mt-10 flex flex-col items-center lg:items-start">
                <ProvedoButton href="#demo" variant="primary" size="lg">
                  Ask Provedo
                </ProvedoButton>
              </div>

              <p className="mt-4 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
                No card. 50 free questions a month.
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
