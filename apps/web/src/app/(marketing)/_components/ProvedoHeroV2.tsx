'use client';

// ProvedoHeroV2 — §S1 hero (slice-LP3.6 — receipt-system composition)
//
// Slice-LP3.6 «Hero L2/L3 Retire» (PD spec docs/design/slice-lp3-6-hero-retire-spec.md):
//   - RETIRED L2 InsightFeedMockup (orphan AI-tool feed → DigestHeader typographic primitive)
//   - RETIRED L3 BrokerPieMockup (orphan donut at 0.6 opacity → CitationChip typographic primitive)
//   - DROPPED parallax scroll handler + scrollY state (no consumers after L2/L3 retire)
//   - DROPPED heroRef (was only used by parallax getBoundingClientRect)
//   - L1 ChatMockup KEPT-AS-SHIPPED, extracted to hero/ChatMockup.tsx (behavior-preserving
//     extraction — same content, same typing animation, same Sources primitive, same
//     replay-on-intersection)
//   - Right column wrapped in <aside aria-label="Provedo demo receipt"> per spec §6.1 with
//     <header> (DigestHeader) + <article> (ChatMockup) + <footer> (CitationChip) so screen-
//     readers read the digest → conversation → citation in semantic-receipt order
//
// Composition (PD §1): the three elements compose as ONE receipt-system, not three
// independent surfaces. Reading order: weekly cadence → specific observation with sources →
// broker scope. Single narrative arc.
//
// Mobile (<768px) (PD §6): DigestHeader + CitationChip both hidden via `hidden md:block`.
// L1 ChatMockup-only on mobile carries the chat-first-wedge positioning. Brand promises
// (cadence + multi-broker scope) are carried elsewhere on mobile by §S5 InsightsBullets +
// §S2 proof-bar + the in-receipt sources line.
//
// Slice-LP3.4 ChatMockup polish (Proposal A) — preserved verbatim inside hero/ChatMockup.tsx.
// Slice-LP3.5 Sources primitive — preserved.
// Hero head + sub + CTA + small-print copy — LOCKED, not modified.

import { useState } from 'react';
import { ProvedoButton } from './ProvedoButton';
import { ChatMockup, type ChatPhase } from './hero/ChatMockup';
import { CitationChip } from './hero/CitationChip';
import { DigestHeader } from './hero/DigestHeader';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

// Re-export the chat-content invariants from the new module so existing
// content-invariant tests + downstream consumers keep their shipped import paths.
export {
  HERO_RESPONSE_SEGMENTS,
  HERO_SOURCES_ITEMS,
  HERO_SOURCES_LINE,
  HERO_USER_MESSAGE,
} from './hero/ChatMockup';

export function ProvedoHeroV2(): React.ReactElement {
  const prefersReduced = usePrefersReducedMotion();
  // Tracks ChatMockup typing-completion. Drives the CitationChip entrance
  // animation (PD §4.3 — 240ms fade + translateY fired 120ms after L1 sources
  // line begins). Reset to false on intersection re-entry so scroll-back
  // replays the chip alongside the typing animation.
  const [isReceiptComplete, setIsReceiptComplete] = useState(false);

  function handleChatPhaseChange(phase: ChatPhase): void {
    setIsReceiptComplete(phase === 'done');
  }

  return (
    <>
      {/* Global CSS for cursor blink + sources fade-in animations
          (kept here so any consumer of the hero gets the keyframes; the
          ChatMockup uses provedo-cursor-blink + provedo-sources-fade-in.) */}
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
        aria-labelledby="hero-heading"
        className="relative px-4 pb-20 pt-20 md:pb-28 md:pt-28"
        style={{ backgroundColor: 'var(--provedo-bg-page)', overflow: 'hidden' }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-8">
            {/* Left — text column (LOCKED copy) */}
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

              <div className="mt-10 flex flex-col items-center lg:items-start">
                <ProvedoButton href="#demo" variant="primary" size="lg">
                  Ask Provedo
                </ProvedoButton>
              </div>

              <p className="mt-4 text-xs" style={{ color: 'var(--provedo-text-tertiary)' }}>
                No card. 50 free questions a month.
              </p>
            </div>

            {/* Right — receipt-system column (slice-LP3.6 §1 composition).
                Vertically centered (PD §2.2 adjustment 5: drop the legacy
                marginTop:48px L1 offset; column now centers its content). */}
            <aside
              aria-label="Provedo demo receipt"
              className="flex w-full flex-1 flex-col items-stretch justify-center gap-3 min-h-[320px]"
            >
              {/* DigestHeader — md+ only (PD §6 mobile collapse) */}
              <DigestHeader className="mx-auto hidden w-full max-w-[420px] md:block" />

              {/* L1 ChatMockup — always visible. The chat surface owns its own
                  typing-state machine + replay-on-intersection; we subscribe to
                  phase transitions to drive the CitationChip entrance below. */}
              <div className="mx-auto w-full max-w-[420px]">
                <ChatMockup prefersReduced={prefersReduced} onPhaseChange={handleChatPhaseChange} />
              </div>

              {/* CitationChip — md+ only (PD §6 mobile collapse).
                  isComplete is driven by ChatMockup's phase callback so the
                  240ms entrance fires after the L1 sources line settles. */}
              <CitationChip
                isComplete={isReceiptComplete}
                prefersReduced={prefersReduced}
                className="mx-auto hidden w-full max-w-[420px] md:flex md:justify-center"
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
