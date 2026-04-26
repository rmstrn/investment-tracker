'use client';

// ChatMockup — picture-first hero chat surface (Slice-LP5-A §K.1.a)
//
// Slice-LP5-A picture-first correction:
//   - DROP the inline P&L sparkline from the response bubble (PD §K.1.a). The
//     hero answer stays text-led with mono-token pills only. The sparkline
//     remains shipped via §S4 Teaser 1 (one «mention charts exist» beat) per
//     PD §K.2.
//   - WRAP the chat surface in the new <ChatAppShell> chrome (header bar with
//     avatar + status pill, three-layer drop shadow + mandatory 120px outer
//     teal-glow halo, layout-shift min-height lock).
//   - ADD a TypingDots indicator that bridges the user-pause → response
//     transition so the empty area never «freezes» between bubbles.
//   - PROMOTE inline mono tokens to JBM-mono pill styling (slate-100 bg,
//     slate-700 text, 11px, rounded-md, px-1.5 py-0.5) per PD §K.1.a so the
//     answer reads as «product data» without competing with a chart.
//
// What stays identical (regression contract):
//   - Typing speed knobs (TYPING_BASE_MS_PER_CHAR, jitter, sentence pauses).
//   - Replay-on-intersection via useInView (triggerOnce: false).
//   - Reduced-motion fallback (full text rendered statically).
//   - Sources primitive (Slice-LP3.5 extraction kept intact).
//   - HERO_USER_MESSAGE + HERO_RESPONSE_SEGMENTS + HERO_SOURCES_ITEMS exports
//     (re-exported from ProvedoHeroV2 so existing content-invariant tests +
//     downstream consumers keep their shipped import paths).
//
// `onPhaseChange` is preserved so tests + future consumers keep the wiring
// surface, but Slice-LP5-A removes the CitationChip / DigestHeader siblings
// that previously consumed it (§K.1 first-impression simplification).

import { useEffect, useRef, useState } from 'react';
import { Sources } from '../Sources';
import { useInView } from '../hooks/useInView';
import { ChatAppShell } from './ChatAppShell';
import { TypingDots } from './TypingDots';

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

// Typing-speed knobs — slice-LP3.4 motion polish (Proposal A) preserved.
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
  showTypingDots: boolean;
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
        // Slice-LP5-A: enter the explicit `pause` phase once the user message
        // finishes typing. The pause window is what powers the new typing-
        // dots indicator below — we still transition to `response` after
        // INTER_BUBBLE_PAUSE_MS so timing matches the previous shipped
        // behavior bit-for-bit.
        setPhase('pause');
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
  // Typing dots show during the explicit pause phase that bridges the user
  // bubble → response bubble transition. Hidden under reduced-motion (the
  // response renders synchronously so there is no pause to bridge).
  const showTypingDots = !prefersReduced && phase === 'pause';

  return {
    userText,
    responseIndex,
    isTypingUser,
    isTypingResponse,
    phase,
    showResponseBubble,
    showTypingDots,
  };
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

// MonoToken — Slice-LP5-A §K.1.a inline pill upgrade.
//   Token-pill chrome: slate-100 bg, slate-700 text, 11px, rounded-md,
//   px-1.5 py-0.5. Reads as «product-grade data anchor» without needing a
//   chart inside the response bubble.
function MonoToken({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span
      data-testid="hero-mono-token"
      style={{
        fontFamily: 'var(--provedo-font-mono)',
        fontWeight: 500,
        fontSize: '12px',
        color: 'var(--provedo-text-secondary)',
        backgroundColor: 'var(--provedo-bg-subtle)',
        padding: '1px 6px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function NegToken({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span
      data-testid="hero-neg-token"
      style={{
        fontFamily: 'var(--provedo-font-mono)',
        fontWeight: 500,
        fontSize: '12px',
        color: 'var(--provedo-negative)',
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
        padding: '1px 6px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
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
    <div className="flex justify-start">
      <div className="max-w-full">
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--provedo-accent)' }}
        >
          Provedo
        </p>
        <div
          className="rounded-2xl rounded-tl-sm border px-4 py-3 text-sm leading-relaxed"
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
        </div>
      </div>
    </div>
  );
}

// ─── Public ChatMockup component ──────────────────────────────────────────────

interface ChatMockupProps {
  prefersReduced: boolean;
  /**
   * Fires whenever the typing sequence transitions to a new phase. Parent uses
   * this to drive sibling primitives (kept for API stability — Slice-LP5-A no
   * longer mounts the CitationChip / DigestHeader siblings that originally
   * consumed it).
   */
  onPhaseChange?: (phase: ChatPhase) => void;
}

// Layout-shift lock per PD §K.1.c. The new picture-first variant drops the
// inline chart from the bubble, so the recalculated min-heights are tighter:
//   - Hero variant: 320px mobile / 360px md+ for the message area.
//   - Outer ChatAppShell adds the 48px header bar + padding, landing at
//     ~440px md+ / ~400px mobile (matches PD §K.1.c).
const MESSAGE_MIN_HEIGHT_MOBILE = '320px';
const MESSAGE_MIN_HEIGHT_DESKTOP = '360px';

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

  const {
    userText,
    responseIndex,
    isTypingUser,
    isTypingResponse,
    phase,
    showResponseBubble,
    showTypingDots,
  } = useTypingSequence(prefersReduced, replayKey);

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

  // The CSS clamp lets responsive viewports pick the lock from the spec
  // (mobile vs desktop). Inline so we do not need a new media-query hook.
  const messageMinHeight = `clamp(${MESSAGE_MIN_HEIGHT_MOBILE}, 100vw, ${MESSAGE_MIN_HEIGHT_DESKTOP})`;

  return (
    <div ref={ref}>
      <ChatAppShell
        ariaLabel="Provedo demo conversation"
        headerTitle="Provedo"
        statusLabel="live"
        messageMinHeight={messageMinHeight}
      >
        <div className="mb-4 flex justify-end" aria-label="User message">
          <div
            className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
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

        {/* Typing dots bridge the user-pause → response transition. Renders
            only during the `pause` phase; under reduced-motion the response
            bubble appears synchronously and the pause is skipped. */}
        {showTypingDots && (
          <div className="mb-3 flex justify-start">
            <TypingDots prefersReduced={prefersReduced} />
          </div>
        )}

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
      </ChatAppShell>
    </div>
  );
}
