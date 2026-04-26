'use client';

// ChatMockup — extracted from ProvedoHeroV2 (Slice-LP3.6 §9.1 step 1).
//
// Behavior is preserved verbatim from the shipped slice-LP3.4 chat surface:
//   - typing animation timing knobs (jittered base + sentence pauses)
//   - replay-on-intersection via useInView (triggerOnce:false)
//   - reduced-motion fallback (full text rendered statically)
//   - Sources primitive (Slice-LP3.5 extraction kept intact)
//
// Slice-LP3.6 adds a single new prop — `onPhaseChange` — so the parent can
// learn when typing reaches the `done` phase. The parent uses that signal to
// fade in the CitationChip below the receipt (per PD spec §4.3 — entrance
// fires after L1 typing completes, replays on scroll-back).

import { useEffect, useRef, useState } from 'react';
import { Sources } from '../Sources';
import { useInView } from '../hooks/useInView';

// ─── Content invariants (verbatim per brand-voice §2.5 — DO NOT paraphrase) ───

export const HERO_USER_MESSAGE = 'Why is my portfolio down this month?';

type SegmentKind = 'text' | 'mono' | 'neg';
interface ResponseSegment {
  kind: SegmentKind;
  text: string;
}

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

export const HERO_SOURCES_ITEMS: ReadonlyArray<string> = [
  'AAPL Q3 earnings 2025-10-31',
  'TSLA Q3 delivery report 2025-10-22',
  'holdings via Schwab statement 2025-11-01',
] as const;

export const HERO_SOURCES_LINE = `Sources: ${HERO_SOURCES_ITEMS.join(' · ')}.`;

const RESPONSE_TOTAL_LENGTH = HERO_RESPONSE_SEGMENTS.reduce((acc, seg) => acc + seg.text.length, 0);
const RESPONSE_FULL_TEXT = HERO_RESPONSE_SEGMENTS.map((s) => s.text).join('');

// Typing-speed knobs — slice-LP3.4 motion polish (Proposal A).
const TYPING_BASE_MS_PER_CHAR = 35;
const TYPING_JITTER_MS = 10;
const SENTENCE_PUNCTUATION_PAUSE_MS = 180;
const INTER_BUBBLE_PAUSE_MS = 1400;
const INITIAL_DELAY_MS = 800;

export type ChatPhase = 'idle' | 'user' | 'pause' | 'response' | 'done';

interface UseTypingSequenceReturn {
  userText: string;
  responseIndex: number;
  isTypingUser: boolean;
  isTypingResponse: boolean;
  phase: ChatPhase;
  showResponseBubble: boolean;
}

function nextDelayForChar(char: string): number {
  const isSentenceEnd = /[.!?]/.test(char);
  const jitter = (Math.random() * 2 - 1) * TYPING_JITTER_MS;
  return TYPING_BASE_MS_PER_CHAR + jitter + (isSentenceEnd ? SENTENCE_PUNCTUATION_PAUSE_MS : 0);
}

function useTypingSequence(prefersReduced: boolean, replayKey: number): UseTypingSequenceReturn {
  const [userText, setUserText] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void replayKey;
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

// ─── Cursor + token primitives ────────────────────────────────────────────────

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

// ─── Inline P&L sparkline ─────────────────────────────────────────────────────

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

// ─── Provedo response bubble ──────────────────────────────────────────────────

interface ProvedoResponseBubbleProps {
  responseElements: React.ReactElement[];
  isTypingResponse: boolean;
  isComplete: boolean;
  prefersReduced: boolean;
}

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

        {(isComplete || prefersReduced) && (
          <div
            className="mt-2"
            style={{
              opacity: prefersReduced ? 1 : 0,
              animation: prefersReduced
                ? 'none'
                : 'provedo-sources-fade-in 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <Sources items={HERO_SOURCES_ITEMS} />
          </div>
        )}

        <InlinePnlSparkline visible={isComplete} prefersReduced={prefersReduced} />
      </div>
    </>
  );
}

// ─── Public ChatMockup component ──────────────────────────────────────────────

interface ChatMockupProps {
  prefersReduced: boolean;
  /**
   * Fires whenever the typing sequence transitions to a new phase. Parent uses
   * this to drive sibling primitives (Slice-LP3.6: CitationChip entrance fires
   * when phase reaches `done`; resets when intersection-replay restarts the
   * sequence).
   */
  onPhaseChange?: (phase: ChatPhase) => void;
}

export function ChatMockup({ prefersReduced, onPhaseChange }: ChatMockupProps): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: false });
  const [replayKey, setReplayKey] = useState(0);
  const wasInViewRef = useRef(false);

  useEffect(() => {
    if (inView && !wasInViewRef.current) {
      setReplayKey((k) => k + 1);
    }
    wasInViewRef.current = inView;
  }, [inView]);

  const { userText, responseIndex, isTypingUser, isTypingResponse, phase, showResponseBubble } =
    useTypingSequence(prefersReduced, replayKey);

  // Notify parent on every phase transition. The dependency on `onPhaseChange`
  // is captured by ref so callers can pass an inline arrow without retriggering.
  const onPhaseChangeRef = useRef(onPhaseChange);
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);
  useEffect(() => {
    onPhaseChangeRef.current?.(phase);
  }, [phase]);

  const responseElements = prefersReduced
    ? renderResponseSegments(RESPONSE_TOTAL_LENGTH)
    : renderResponseSegments(responseIndex);

  const isResponseVisible = phase === 'response' || phase === 'done';

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
