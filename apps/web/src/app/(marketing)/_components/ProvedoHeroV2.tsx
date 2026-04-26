'use client';

// ProvedoHeroV2 — §S1 picture-first hero (Slice-LP5-A §K.1)
//
// Slice-LP6 fresh-eyes additions (5 outside specialists, 7 convergent gaps):
//   §gap-1: category-tell eyebrow ABOVE the locked H1 (PD + voice + content
//           + researcher convergence — H1 is poetic but does not name what
//           the thing is in 5s). Eyebrow: `PORTFOLIO AI · EVERY BROKER` —
//           JBM-mono 11px, slate-tertiary, widened tracking. (Slice-LP6.1:
//           dropped «· READ-ONLY» token to avoid 3× repetition in hero.)
//   §gap-2: «Ask Provedo» CTA href flips from soft `#demo` scroll to the
//           new `#prompt-picker` group (in-place chip-driven demo). The new
//           ChatPromptPicker mounts directly below the right-column chat
//           shell so click-through is one motion: scroll + chip = replay.
//   §gap-3: replaces the §S2 numeric proof bar with a single mono microline
//           below the CTA cluster (`Every major broker · Cited per answer`).
//           The component file `ProvedoNumericProofBar.tsx` stays in the
//           codebase dormant — see page.tsx for the unmount. (Slice-LP6.1:
//           dropped leading «Read-only · » token — same chrome-diet rationale.)
//   §gap-5a: hero-adjacent read-only trust line above the CTA cluster
//           («Read-only. Never touches a trade.»). Researcher + content:
//           privacy story was buried in FAQ Q5 — surfaces it for the
//           privacy-allergic ICP at first paint. (Slice-LP6.1: this is now
//           the SINGLE read-only mention in the hero.)
//
// What stays unchanged (PO copy lock):
//   - H1: «Provedo will lead you through your portfolio.» (LOCKED)
//   - Sub: «Notice what you'd miss across all your brokers.» (LOCKED)
//   - HERO_RESPONSE_SEGMENTS / HERO_SOURCES_ITEMS / HERO_USER_MESSAGE re-
//     exports for content-invariant tests + downstream consumers.
//   - Atmosphere layer (radial gradients + bespoke synthesis-glyph SVG).
//   - prefers-reduced-motion fallback.

import { useState } from 'react';
import { ProvedoButton } from './ProvedoButton';
import { ChatMockup } from './hero/ChatMockup';
import { ChatPromptPicker } from './hero/ChatPromptPicker';
import { HeroAtmosphere } from './hero/HeroAtmosphere';
import { type ChatPrompt, DEFAULT_PROMPT_ID, getPromptById } from './hero/chat-prompts';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

// Re-export the chat-content invariants from the new module so existing
// content-invariant tests + downstream consumers keep their shipped import paths.
export {
  HERO_RESPONSE_SEGMENTS,
  HERO_SOURCES_ITEMS,
  HERO_SOURCES_LINE,
  HERO_USER_MESSAGE,
} from './hero/ChatMockup';

// Slice-LP6 §gap-1 — category-tell eyebrow copy. Two-word category
// descriptor with middle-dot separators (matches mono-token register used
// throughout the page; reads as «product taxonomy», not a tagline).
// Slice-LP6.1 chrome-diet: dropped «· READ-ONLY» token — read-only was
// repeated 3× in hero (eyebrow + italic trust line + microline). The italic
// trust line above the CTA stays the single source of truth in hero.
const HERO_EYEBROW_COPY = 'PORTFOLIO AI · EVERY BROKER';

// Slice-LP6 §gap-3 — single mono microline that replaces the S2 proof bar.
// Two observable claims separated by middle dots; each is sourced or
// verifiable from the page (broker coverage = §S8 marquee; cited per answer
// = §S1 chat sources + §S4 teaser sources).
// Slice-LP6.1 chrome-diet: dropped leading «Read-only · » token (see eyebrow
// note above — italic trust line above CTA is the kept hero mention).
const HERO_PROOF_MICROLINE_COPY = 'Every major broker · Cited per answer';

export function ProvedoHeroV2(): React.ReactElement {
  const prefersReduced = usePrefersReducedMotion();

  // Slice-LP6 §gap-2 — chip-driven prompt state. Default = the locked §S1
  // hero answer («Why is my portfolio down?»). Changing this swaps the
  // ChatMockup content in place and bumps the replay key.
  const [activePromptId, setActivePromptId] = useState(DEFAULT_PROMPT_ID);
  const [chipReplayKey, setChipReplayKey] = useState(0);

  function handlePromptSelect(prompt: ChatPrompt): void {
    setActivePromptId(prompt.id);
    // Bump the replay key even when the user re-clicks the active chip — the
    // demo should replay on every click, not just on prompt-id change.
    setChipReplayKey((k) => k + 1);
  }

  // Resolve the currently selected prompt object so SSR + hydration agree on
  // the first render. ChatMockup's `prompt` prop is required-shaped (typed
  // ChatPrompt) — we pass it explicitly so the typing sequence sees the
  // user's chip selection on the very first render after click.
  const activePrompt: ChatPrompt = getPromptById(activePromptId);

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
        {/* Layer 1 + Layer 2 — atmospheric gradient mesh + bespoke synthesis
            glyph SVG. Sits absolute behind the hero content, clipped by the
            section's overflow:hidden so the wash does not bleed into S2. */}
        <HeroAtmosphere />

        <div className="relative mx-auto max-w-7xl" style={{ zIndex: 1 }}>
          <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Left — text column (LOCKED H1 + sub) */}
            <div className="text-center lg:max-w-xl lg:text-left">
              {/* §gap-1 — category-tell eyebrow ABOVE H1.
                  JBM-mono, 11px, slate-tertiary, widened tracking. Anchors the
                  category in 5s for cold visitors before the H1's poetry lands. */}
              <p
                data-testid="hero-eyebrow"
                style={{
                  fontFamily: 'var(--provedo-font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  color: 'var(--provedo-text-tertiary)',
                  margin: 0,
                  marginBottom: '14px',
                }}
              >
                {HERO_EYEBROW_COPY}
              </p>

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

              {/* §gap-5a — read-only trust line ABOVE the CTA cluster.
                  Italic gray-text single line. Solves the trust-signal gap
                  for the privacy-allergic ICP without burying it in FAQ Q5. */}
              <p
                data-testid="hero-readonly-line"
                style={{
                  marginTop: '20px',
                  fontFamily: 'var(--provedo-font-sans)',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: 'var(--provedo-text-tertiary)',
                  margin: '20px 0 0 0',
                }}
              >
                Read-only. Never touches a trade.
              </p>

              <div className="mt-6 flex flex-col items-center lg:items-start">
                {/* §gap-2 — CTA href flips to #prompt-picker (in-place demo)
                    instead of the soft #demo scroll. The picker is mounted
                    just below the right-column chat shell. */}
                <ProvedoButton href="#prompt-picker" variant="primary" size="lg">
                  Ask Provedo
                </ProvedoButton>

                {/* §gap-3 — single mono microline replacing the S2 proof bar.
                    Three observable claims, mono register, slate-tertiary. */}
                <p
                  data-testid="hero-proof-microline"
                  style={{
                    marginTop: '14px',
                    fontFamily: 'var(--provedo-font-mono)',
                    fontSize: '12px',
                    color: 'var(--provedo-text-tertiary)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {HERO_PROOF_MICROLINE_COPY}
                </p>
              </div>
            </div>

            {/* Right — picture-first chat surface column.
                The ChatMockup owns the ChatAppShell chrome (header + body +
                min-height lock) and the typing-state machine + replay-on-
                intersection. Wrapped in <aside> so screen-readers read the
                conversation as supplementary to the locked headline copy.
                Slice-LP6 §gap-2: now also wraps the ChatPromptPicker so the
                4 chips sit directly below the chat shell. */}
            <aside
              aria-label="Provedo demo receipt"
              className="flex w-full flex-col items-stretch justify-center min-h-[400px] md:min-h-[440px]"
            >
              <div className="mx-auto w-full max-w-[480px]">
                <ChatMockup
                  prefersReduced={prefersReduced}
                  prompt={activePrompt}
                  externalReplayKey={chipReplayKey}
                />
                <ChatPromptPicker
                  activePromptId={activePromptId}
                  onPromptSelect={handlePromptSelect}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
