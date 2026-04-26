'use client';

// ProvedoHeroV2 — §S1 picture-first hero (Slice-LP5-A §K.1)
//
// PO pivot 2026-04-27: «первое впечатление = картинки, мы не показываем чарты,
// можем упомянуть пару». PD spec §K binds the picture-first composition.
//
// Slice-LP5-A changes vs Slice-LP3.6:
//   - Atmosphere layer (Layer 1 + Layer 2 from §K.1.b) painted full-bleed
//     behind the hero region. Two compositor-friendly radial gradients
//     (top-right teal-cream + bottom-left warm-cream) plus a bespoke abstract
//     «portfolio brain» SVG synthesis-glyph (1 source → 3 brokers → 1 Provedo
//     node, opacity 0.10, draw-on stroke-dasharray reveal ≤ 700ms).
//   - DROP the DigestHeader + CitationChip siblings. The picture-first hero
//     is the chat-app-shell floating in the atmosphere — no orphan typographic
//     primitives competing with it. (Component files stay in the codebase
//     dormant for possible reuse but are no longer mounted on the landing.)
//   - The ChatMockup itself drops the inline P&L sparkline and wraps in the
//     new <ChatAppShell> chrome (header bar with avatar + status pill, three-
//     layer drop shadow + mandatory 120px outer teal-glow halo, layout-shift
//     min-height lock at 360px desktop / 320px mobile).
//
// What stays unchanged:
//   - Hero head + sub + CTA copy LOCKED, not modified.
//   - Re-export of HERO_RESPONSE_SEGMENTS / HERO_SOURCES_ITEMS / HERO_USER_MESSAGE
//     so existing content-invariant tests + downstream consumers keep their
//     shipped import paths.
//   - prefers-reduced-motion fallback (full text rendered statically + glyph
//     stays drawn at rest).

import { ProvedoButton } from './ProvedoButton';
import { ChatMockup } from './hero/ChatMockup';
import { HeroAtmosphere } from './hero/HeroAtmosphere';
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
          {/* Slice-LP5-BCD C1: explicit equal halves at lg+ via grid so the
              left text column truly aligns flush to the page-padding left edge.
              Prior `flex-shrink-0 lg:max-w-xl` left the column at intrinsic
              text width, allowing the right (chat) column to consume extra
              space — visually pulling the left text inward at wide viewports.
              PO 2026-04-27: «как то не выровнено слева». */}
          <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Left — text column (LOCKED copy) */}
            <div className="text-center lg:max-w-xl lg:text-left">
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

              {/* Slice-LP5-BCD C2: «No card. 50 free questions a month.»
                  small-print line dropped per PO 2026-04-27. The Free-tier
                  policy is implicit from product flow + repeated in §S10
                  pre-footer CTA + FAQ Q4 — the hero does not need it. */}
              <div className="mt-10 flex flex-col items-center lg:items-start">
                <ProvedoButton href="#demo" variant="primary" size="lg">
                  Ask Provedo
                </ProvedoButton>
              </div>
            </div>

            {/* Right — picture-first chat surface column.
                The ChatMockup owns the ChatAppShell chrome (header + body +
                min-height lock) and the typing-state machine + replay-on-
                intersection. Wrapped in <aside> so screen-readers read the
                conversation as supplementary to the locked headline copy. */}
            <aside
              aria-label="Provedo demo receipt"
              className="flex w-full flex-col items-stretch justify-center min-h-[400px] md:min-h-[440px]"
            >
              <div className="mx-auto w-full max-w-[480px]">
                <ChatMockup prefersReduced={prefersReduced} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
