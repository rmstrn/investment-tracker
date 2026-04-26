'use client';

// LandingHero — Landing-v2 §B.1 «The Ledger That Talks»
//
// Two-pane editorial hero. Left pane = headline cluster + CTA. Right pane =
// Ledger card stacked above ConversationCard. The two panes are linked by a
// citation chip (¹) whose hover/focus state syncs across panes via React
// state lifted to this component.
//
// Animation choreography (6.5s on first load + replay-on-intersection):
//   t=0.00  eyebrow fade
//   t=0.10  H1 reveal
//   t=0.30  sub reveal
//   t=0.50  trust pill
//   t=0.65  CTA + microcopy
//   t=0.80  ledger card
//   t=1.10  ledger value count-up (480ms)
//   t=1.70  pen-mark underline draws on +4.2pp
//   t=2.20  conversation card
//   t=2.55  user message typing (~1.0s)
//   t=3.55  typing dots pause (600ms)
//   t=4.15  Provedo answer streams (~2.4s)
//   t=6.50  Sources line + citation chip becomes interactive
//
// All durations respect prefers-reduced-motion: under reduced motion every
// element renders in its final state immediately.

import {
  type CSSProperties,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { dispatchOpenEarlyAccess } from './LandingEarlyAccessModal';
import { ProvedoButton } from './ProvedoButton';
import { TypingDots } from './hero/TypingDots';
import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { CitationLink } from './landing/CitationLink';
import { ConversationCard } from './landing/ConversationCard';
import { ConversationMessage } from './landing/ConversationMessage';
import { Ledger } from './landing/Ledger';
import { PaperGrain } from './landing/PaperGrain';

// ── Copy (LOCKED — do not modify hero head/sub) ─────────────────────────────
const EYEBROW = 'Portfolio intelligence, on demand.';
const H1_LINE_1 = 'Provedo will lead';
const H1_LINE_2 = 'you through your';
const H1_LINE_3 = 'portfolio.';
const SUB = "Notice what you'd miss across all your brokers.";
const TRUST_PILL = 'Read-only · No trading · No advice';
const CTA_LABEL = 'Get early access';
const CTA_MICROCOPY = 'No card. Look without connecting. Read-only when you connect.';
const USER_MESSAGE = 'Why is NVDA flagged?';
const PROVEDO_ANSWER_PRE = 'Your target was 12% NVDA. It’s now 16.2% — a ';
const PROVEDO_ANSWER_VALUE = '+4.2pp';
const PROVEDO_ANSWER_POST = ' drift from a 38% rally since Feb.';
const SOURCES = ['IBKR · positions · today'] as const;

// ── Animation timing (ms from load start) ───────────────────────────────────
const T_LEDGER_CARD_MS = 800;
const T_PEN_MARK_MS = 1700;
const T_CONVERSATION_CARD_MS = 2200;
const T_USER_TYPING_START_MS = 2550;
const T_USER_TYPING_DURATION_MS = 1000;
const T_DOTS_DURATION_MS = 600;
const T_PROVEDO_STREAM_DURATION_MS = 2400;
const T_SOURCES_MS = 6500;

// ── Section + layout styles ─────────────────────────────────────────────────
const SECTION_STYLE: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '64px',
  paddingBottom: '96px',
  // Subtle radial wash top-left — Spec §B.1 color usage
  background:
    'radial-gradient(ellipse 1200px 600px at 0% 0%, rgba(13, 148, 136, 0.04), transparent 65%)',
};

const CONTAINER_STYLE: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 24px',
};

const EYEBROW_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: '12px',
  letterSpacing: '0.18em',
  color: 'var(--provedo-text-tertiary)',
  textTransform: 'none',
  margin: 0,
  marginBottom: '24px',
  lineHeight: 1.4,
};

const H1_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(36px, 5.5vw, 80px)',
  lineHeight: 0.98,
  letterSpacing: '-0.02em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
  textWrap: 'balance',
};

const SUB_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: 'clamp(18px, 1.6vw, 22px)',
  lineHeight: 1.4,
  letterSpacing: '-0.005em',
  color: 'var(--provedo-text-secondary)',
  margin: 0,
  marginTop: '24px',
  maxWidth: '32ch',
};

const TRUST_PILL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontStyle: 'italic',
  fontWeight: 500,
  fontSize: '13px',
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  marginTop: '24px',
  marginBottom: '24px',
};

const MICROCOPY_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: 1.55,
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  marginTop: '12px',
  maxWidth: '36ch',
};

// Typed reveal helper — returns substring of `text` based on `progress` (0–1).
function takeProgress(text: string, progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const slice = Math.floor(text.length * clamped);
  return text.slice(0, slice);
}

interface RenderedProvedoAnswerProps {
  revealedAnswer: string;
  activeCitationId: string | null;
  citationInteractive: boolean;
  onCitationActivate: (id: string) => void;
  onCitationDeactivate: () => void;
  prefersReduced: boolean;
}

/**
 * Renders the Provedo answer text progressively, splicing the inline citation
 * chip into the right position once the stream has revealed the «+4.2pp»
 * value. Extracted from LandingHero to keep the parent's cyclomatic
 * complexity within Biome's threshold.
 */
function RenderedProvedoAnswer({
  revealedAnswer,
  activeCitationId,
  citationInteractive,
  onCitationActivate,
  onCitationDeactivate,
  prefersReduced,
}: RenderedProvedoAnswerProps): ReactElement {
  const charsRevealed = revealedAnswer.length;
  const preLength = PROVEDO_ANSWER_PRE.length;
  const valueLength = PROVEDO_ANSWER_VALUE.length;

  if (charsRevealed < preLength) {
    return <span>{revealedAnswer}</span>;
  }

  const citation = (
    <CitationLink
      index={1}
      targetId="ledger-row-nvda"
      isActive={activeCitationId === 'cite-nvda-1'}
      onActivate={citationInteractive ? () => onCitationActivate('cite-nvda-1') : undefined}
      onDeactivate={citationInteractive ? onCitationDeactivate : undefined}
      prefersReduced={prefersReduced}
    />
  );

  if (charsRevealed < preLength + valueLength) {
    const valueShown = revealedAnswer.slice(preLength);
    return (
      <>
        {PROVEDO_ANSWER_PRE}
        {citation}
        {valueShown}
      </>
    );
  }

  const tail = revealedAnswer.slice(preLength + valueLength);
  return (
    <>
      {PROVEDO_ANSWER_PRE}
      {citation}
      {PROVEDO_ANSWER_VALUE}
      {tail}
    </>
  );
}

interface FadeInProps {
  visible: boolean;
  delay: number;
  prefersReduced: boolean;
}

function getFadeStyle({ visible, delay, prefersReduced }: FadeInProps): CSSProperties {
  if (prefersReduced) {
    return { opacity: 1, transform: 'none', transition: 'none' };
  }
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 260ms ease-out ${delay}ms, transform 260ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };
}

export function LandingHero(): ReactElement {
  const prefersReduced = usePrefersReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: false });

  // Animation phase tracking
  const [showLedger, setShowLedger] = useState(false);
  const [penMarkActive, setPenMarkActive] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [userTypingProgress, setUserTypingProgress] = useState(0);
  const [showDots, setShowDots] = useState(false);
  const [provedoStreamProgress, setProvedoStreamProgress] = useState(0);
  const [showSources, setShowSources] = useState(false);

  // Two-pane shared citation state (lifted)
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);

  const handleCitationActivate = useCallback((id: string) => {
    setActiveCitationId(id);
  }, []);
  const handleCitationDeactivate = useCallback(() => {
    setActiveCitationId(null);
  }, []);

  // Master playback timer — kicks off when section enters view, cancels on exit
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const animationFramesRef = useRef<Array<number>>([]);

  useEffect(() => {
    function clearAll() {
      for (const t of timersRef.current) clearTimeout(t);
      for (const f of animationFramesRef.current) cancelAnimationFrame(f);
      timersRef.current = [];
      animationFramesRef.current = [];
    }

    // Reduced motion: render final state immediately regardless of viewport
    // visibility. The hero is the page's signature; reduced-motion users
    // should see it complete on first paint, not blank until they scroll.
    if (prefersReduced) {
      setShowLedger(true);
      setPenMarkActive(true);
      setShowConversation(true);
      setUserTypingProgress(1);
      setShowDots(false);
      setProvedoStreamProgress(1);
      setShowSources(true);
      return;
    }

    if (!inView) {
      clearAll();
      return;
    }

    // Reset for replay
    setShowLedger(false);
    setPenMarkActive(false);
    setShowConversation(false);
    setUserTypingProgress(0);
    setShowDots(false);
    setProvedoStreamProgress(0);
    setShowSources(false);

    // Schedule phases
    timersRef.current.push(setTimeout(() => setShowLedger(true), T_LEDGER_CARD_MS));
    timersRef.current.push(setTimeout(() => setPenMarkActive(true), T_PEN_MARK_MS));
    timersRef.current.push(setTimeout(() => setShowConversation(true), T_CONVERSATION_CARD_MS));

    // User typing — animate progress from 0 → 1 across the duration
    timersRef.current.push(
      setTimeout(() => {
        const start = performance.now();
        function step(now: number) {
          const progress = Math.min(1, (now - start) / T_USER_TYPING_DURATION_MS);
          setUserTypingProgress(progress);
          if (progress < 1) {
            animationFramesRef.current.push(requestAnimationFrame(step));
          }
        }
        animationFramesRef.current.push(requestAnimationFrame(step));
      }, T_USER_TYPING_START_MS),
    );

    // Typing dots
    const T_DOTS_START = T_USER_TYPING_START_MS + T_USER_TYPING_DURATION_MS;
    timersRef.current.push(setTimeout(() => setShowDots(true), T_DOTS_START));
    timersRef.current.push(setTimeout(() => setShowDots(false), T_DOTS_START + T_DOTS_DURATION_MS));

    // Provedo answer stream
    const T_PROVEDO_START = T_DOTS_START + T_DOTS_DURATION_MS;
    timersRef.current.push(
      setTimeout(() => {
        const start = performance.now();
        function step(now: number) {
          const progress = Math.min(1, (now - start) / T_PROVEDO_STREAM_DURATION_MS);
          setProvedoStreamProgress(progress);
          if (progress < 1) {
            animationFramesRef.current.push(requestAnimationFrame(step));
          }
        }
        animationFramesRef.current.push(requestAnimationFrame(step));
      }, T_PROVEDO_START),
    );

    // Sources line
    timersRef.current.push(setTimeout(() => setShowSources(true), T_SOURCES_MS));

    return clearAll;
  }, [inView, prefersReduced]);

  // Composite Provedo answer text based on stream progress.
  const fullAnswerText = `${PROVEDO_ANSWER_PRE}${PROVEDO_ANSWER_VALUE}${PROVEDO_ANSWER_POST}`;
  const revealedAnswer = useMemo(
    () => takeProgress(fullAnswerText, provedoStreamProgress),
    [fullAnswerText, provedoStreamProgress],
  );

  // Has the citation chip become interactive? (sources visible OR reduced motion)
  const citationInteractive = showSources || prefersReduced;

  function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    dispatchOpenEarlyAccess();
  }

  // The Provedo answer is rendered by the extracted RenderedProvedoAnswer
  // helper below. It splices the inline citation chip into the right
  // position once the stream has revealed the «+4.2pp» value.

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      data-testid="landing-hero"
      style={SECTION_STYLE}
    >
      <PaperGrain />
      <div style={CONTAINER_STYLE}>
        <div className="landing-hero-grid" data-testid="landing-hero-grid">
          <style>{`
            .landing-hero-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 48px;
              align-items: start;
            }
            @media (min-width: 1024px) {
              .landing-hero-grid {
                grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
                gap: 64px;
              }
            }
            .landing-hero-h1 br { display: none; }
            @media (min-width: 1024px) {
              .landing-hero-h1 br { display: inline; }
            }
            .landing-hero-stack {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
          `}</style>

          {/* Left column — text + CTA cluster */}
          <div style={{ maxWidth: '600px' }}>
            <p
              data-testid="hero-eyebrow"
              style={{
                ...EYEBROW_STYLE,
                ...getFadeStyle({ visible: true, delay: 0, prefersReduced }),
              }}
            >
              {EYEBROW}
            </p>

            <h1
              id="hero-heading"
              className="landing-hero-h1"
              data-testid="hero-h1"
              style={{
                ...H1_STYLE,
                ...getFadeStyle({ visible: true, delay: 100, prefersReduced }),
              }}
            >
              {H1_LINE_1}
              <br />
              {H1_LINE_2}
              <br />
              {H1_LINE_3}
            </h1>

            <p
              data-testid="hero-sub"
              style={{
                ...SUB_STYLE,
                ...getFadeStyle({ visible: true, delay: 300, prefersReduced }),
              }}
            >
              {SUB}
            </p>

            <p
              data-testid="hero-trust-pill"
              style={{
                ...TRUST_PILL_STYLE,
                ...getFadeStyle({ visible: true, delay: 500, prefersReduced }),
              }}
            >
              {TRUST_PILL}
            </p>

            <div
              style={{
                marginTop: '0',
                ...getFadeStyle({ visible: true, delay: 650, prefersReduced }),
              }}
            >
              <ProvedoButton
                href="#early-access"
                variant="primary"
                size="lg"
                data-testid="hero-cta"
                onClick={handleCtaClick}
              >
                {CTA_LABEL} <span aria-hidden="true">→</span>
              </ProvedoButton>
              <p style={MICROCOPY_STYLE}>{CTA_MICROCOPY}</p>
            </div>
          </div>

          {/* Right column — Ledger + Conversation stacked */}
          <div className="landing-hero-stack">
            <div
              data-testid="hero-ledger-wrapper"
              style={{
                ...getFadeStyle({
                  visible: prefersReduced || showLedger,
                  delay: 0,
                  prefersReduced,
                }),
              }}
            >
              <Ledger
                penMarkActive={penMarkActive}
                activeCitationId={activeCitationId}
                onCitationActivate={handleCitationActivate}
                onCitationDeactivate={handleCitationDeactivate}
                prefersReduced={prefersReduced}
              />
            </div>

            <div
              data-testid="hero-conversation-wrapper"
              style={{
                ...getFadeStyle({
                  visible: prefersReduced || showConversation,
                  delay: 0,
                  prefersReduced,
                }),
              }}
            >
              <ConversationCard sources={[...SOURCES]} className="">
                <ConversationMessage variant="user">
                  {prefersReduced ? USER_MESSAGE : takeProgress(USER_MESSAGE, userTypingProgress)}
                </ConversationMessage>

                {showDots && !prefersReduced && (
                  <div data-testid="hero-typing-dots-wrapper">
                    <TypingDots prefersReduced={prefersReduced} />
                  </div>
                )}

                <ConversationMessage variant="provedo" isLive={!prefersReduced}>
                  <RenderedProvedoAnswer
                    revealedAnswer={prefersReduced ? fullAnswerText : revealedAnswer}
                    activeCitationId={activeCitationId}
                    citationInteractive={citationInteractive}
                    onCitationActivate={handleCitationActivate}
                    onCitationDeactivate={handleCitationDeactivate}
                    prefersReduced={prefersReduced}
                  />
                </ConversationMessage>
              </ConversationCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
