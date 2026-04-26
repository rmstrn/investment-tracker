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

import { useEffect, useMemo, useRef, useState } from 'react';
import { Sources } from '../Sources';
import { useInView } from '../hooks/useInView';
import { ChatAppShell } from './ChatAppShell';
import { TypingDots } from './TypingDots';
import { CHAT_PROMPTS, type ChatPrompt, type ChatSegment, getPromptById } from './chat-prompts';

// ─── Content invariants (verbatim per brand-voice §2.5 — DO NOT paraphrase) ───
//
// Slice-LP6: the hero's default prompt is now sourced from the shared
// chat-prompts catalog so the new ChatPromptPicker can swap content via the
// `prompt` prop. The HERO_* re-exports are preserved bit-for-bit so existing
// content-invariant tests + downstream consumers keep their shipped paths.

const DEFAULT_PROMPT = getPromptById('why');

export const HERO_USER_MESSAGE = DEFAULT_PROMPT.userMessage;

export const HERO_RESPONSE_SEGMENTS: readonly ChatSegment[] = DEFAULT_PROMPT.responseSegments;

export const HERO_SOURCES_ITEMS: ReadonlyArray<string> = DEFAULT_PROMPT.sources;

export const HERO_SOURCES_LINE = `Sources: ${HERO_SOURCES_ITEMS.join(' · ')}.`;

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

function useTypingSequence(
  prefersReduced: boolean,
  replayKey: number | string,
  prompt: ChatPrompt,
): UseTypingSequenceReturn {
  const [userText, setUserText] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize derived strings per prompt — recomputed only when the prompt swaps.
  const responseFullText = useMemo(
    () => prompt.responseSegments.map((s) => s.text).join(''),
    [prompt],
  );
  const responseTotalLength = responseFullText.length;
  const userMessage = prompt.userMessage;

  useEffect(() => {
    void replayKey;
    if (timerRef.current) clearTimeout(timerRef.current);
    setUserText('');
    setResponseIndex(0);
    setPhase('idle');

    if (prefersReduced) {
      setUserText(userMessage);
      setResponseIndex(responseTotalLength);
      setPhase('done');
      return;
    }

    timerRef.current = setTimeout(() => setPhase('user'), INITIAL_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prefersReduced, replayKey, userMessage, responseTotalLength]);

  useEffect(() => {
    if (phase !== 'user') return undefined;

    let idx = 0;
    let cancelled = false;
    let localTimer: ReturnType<typeof setTimeout> | null = null;

    function tick(): void {
      if (cancelled) return;
      idx += 1;
      setUserText(userMessage.slice(0, idx));
      if (idx >= userMessage.length) {
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
      const char = userMessage.charAt(idx - 1);
      localTimer = setTimeout(tick, nextDelayForChar(char));
    }

    localTimer = setTimeout(tick, nextDelayForChar(userMessage.charAt(0)));

    return () => {
      cancelled = true;
      if (localTimer) clearTimeout(localTimer);
    };
  }, [phase, userMessage]);

  useEffect(() => {
    if (phase !== 'response') return undefined;

    let idx = 0;
    let cancelled = false;
    let localTimer: ReturnType<typeof setTimeout> | null = null;

    function tick(): void {
      if (cancelled) return;
      idx += 1;
      setResponseIndex(idx);
      if (idx >= responseTotalLength) {
        setPhase('done');
        return;
      }
      const char = responseFullText.charAt(idx - 1);
      localTimer = setTimeout(tick, nextDelayForChar(char));
    }

    localTimer = setTimeout(tick, nextDelayForChar(responseFullText.charAt(0)));

    return () => {
      cancelled = true;
      if (localTimer) clearTimeout(localTimer);
    };
  }, [phase, responseFullText, responseTotalLength]);

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

function renderResponseSegments(
  segments: readonly ChatSegment[],
  revealedChars: number,
): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  let consumed = 0;

  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
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
  sourcesItems: readonly string[];
}

function ProvedoResponseBubble({
  responseElements,
  isTypingResponse,
  isComplete,
  prefersReduced,
  sourcesItems,
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
              <Sources items={sourcesItems} />
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
  /**
   * Slice-LP6 §gap-2: optional canned prompt drives the user message + Provedo
   * answer + sources. Defaults to «Why is my portfolio down?» (verbatim §S1
   * hero answer). The new ChatPromptPicker passes one of the 4 catalog
   * prompts; existing callers omit the prop and get the locked hero default.
   */
  prompt?: ChatPrompt;
  /**
   * Slice-LP6 §gap-2: external replay-key bump from the chip picker forces a
   * fresh typing replay even when the prompt object identity is the same as
   * the current one (e.g. clicking «Why?» twice). Combined internally with
   * the in-view replay so both triggers feed the same sequence reset.
   */
  externalReplayKey?: number;
}

// Layout-shift lock per PD §K.1.c. The new picture-first variant drops the
// inline chart from the bubble, so the recalculated min-heights are tighter:
//   - Hero variant: 320px mobile / 360px md+ for the message area.
//   - Outer ChatAppShell adds the 48px header bar + padding, landing at
//     ~440px md+ / ~400px mobile (matches PD §K.1.c).
const MESSAGE_MIN_HEIGHT_MOBILE = '320px';
const MESSAGE_MIN_HEIGHT_DESKTOP = '360px';

export function ChatMockup({
  prefersReduced,
  onPhaseChange,
  prompt: promptProp,
  externalReplayKey = 0,
}: ChatMockupProps): React.ReactElement {
  const prompt = promptProp ?? DEFAULT_PROMPT;
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: false });
  const [inViewReplayKey, setInViewReplayKey] = useState(0);
  const wasInViewRef = useRef(false);

  useEffect(() => {
    if (inView && !wasInViewRef.current) {
      setInViewReplayKey((k) => k + 1);
    }
    wasInViewRef.current = inView;
  }, [inView]);

  // Combine in-view replay + external (chip-driven) replay + prompt-id swap
  // into a single key passed to the typing sequence. Any of the three
  // triggers a fresh replay from the start — exactly what the chip picker
  // expects when a user clicks a chip.
  const replayKey = `${prompt.id}-${inViewReplayKey}-${externalReplayKey}`;

  const {
    userText,
    responseIndex,
    isTypingUser,
    isTypingResponse,
    phase,
    showResponseBubble,
    showTypingDots,
  } = useTypingSequence(prefersReduced, replayKey, prompt);

  // Notify parent on every phase transition. The dependency on `onPhaseChange`
  // is captured by ref so callers can pass an inline arrow without retriggering.
  const onPhaseChangeRef = useRef(onPhaseChange);
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);
  useEffect(() => {
    onPhaseChangeRef.current?.(phase);
  }, [phase]);

  const totalResponseLength = prompt.responseSegments.reduce((acc, s) => acc + s.text.length, 0);
  const responseElements = prefersReduced
    ? renderResponseSegments(prompt.responseSegments, totalResponseLength)
    : renderResponseSegments(prompt.responseSegments, responseIndex);

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
            {userText || <span style={{ opacity: 0.3 }}>{prompt.userMessage.slice(0, 22)}…</span>}
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
              sourcesItems={prompt.sources}
            />
          </div>
        )}
      </ChatAppShell>
    </div>
  );
}

// Re-export the prompt catalog so consumers (the new ChatPromptPicker) can
// drive ChatMockup without importing the underlying chat-prompts module.
export { CHAT_PROMPTS, getPromptById };
export type { ChatPrompt };
