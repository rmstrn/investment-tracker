'use client';

// ProvedoInsightsBullets — §S5 insights asymmetric bento (Slice-LP5-BCD A2)
//
// Bold direction (PD spec §C.S5):
//   Replace the equal 3-column white-card grid (PO «не красиво») with an
//   ASYMMETRIC BENTO — one large hero card spanning 2/3 width carrying the
//   primary insight, two smaller cards stacked in the remaining 1/3. Drop
//   lucide icons + teal-tint badges; replace with bespoke inline SVG mini-
//   illustrations sized 48×48 — broker-graph for #1, notification-stack for
//   #2, cite-link for #3. Atmosphere added via a soft warm-cream gradient
//   wash on the section.
//
// Visual rhythm (PD spec):
//   - 12-col grid on lg+, gap-6.
//   - Large card spans cols 1–8: white bg (elevated), p-10, rounded-2xl,
//     shadow-lg with very low alpha layered shadows.
//   - Small cards span cols 9–12 stacked: warm-bg-muted, p-6, rounded-xl,
//     hairline border, no shadow.
//   - Each illustration: slate-700 strokes + one teal-accent stroke per
//     illustration. Hand-drawn for the bullet's idea — broker-graph for #1,
//     notification-stack for #2, cite-link for #3.
//
// Section header preserved: «A few minutes a day. Everything that moved.»
// Section sub preserved: «Provedo surfaces dividends, drawdowns…»
// Sources line preserved at the bottom (closes §S5 chrome-promise gap from
//   Slice-LP3.7-A — load-bearing for the chrome-system).

import { ScrollFadeIn } from './ScrollFadeIn';

// Slice-LP6 §gap-4 — Sources mount DROPPED from §S5 (PD + voice + content
// convergence: «sources/cites/notice» triad repeated 3-4 sections in a row
// dilutes the first mention). The chrome-promise gap that originally drove
// the Slice-LP3.7-A Sources mount here closes elsewhere now (hero ChatMockup
// + S4 Teaser 1 each carry their own Sources line; the §S5 bullet-3 copy
// itself names «every one tied back to a trade or event»).

// ─── Bespoke inline SVG illustrations (48×48, slate-700 + 1 teal accent) ───

function BrokerGraphIllustration(): React.ReactElement {
  // 3 broker nodes converging into 1 Provedo node. Mirrors the §S1 hero
  // synthesis-glyph metaphor at small scale — visually rhymes the page.
  return (
    <svg
      data-testid="insights-illustration-broker-graph"
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="10"
        cy="14"
        r="3"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.5"
      />
      <circle
        cx="28"
        cy="14"
        r="3"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.5"
      />
      <circle
        cx="46"
        cy="14"
        r="3"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.5"
      />
      <circle cx="28" cy="44" r="4" fill="none" stroke="var(--provedo-accent)" strokeWidth="1.75" />
      <path
        d="M 10 17 Q 14 30 28 40"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M 28 17 L 28 40"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M 46 17 Q 42 30 28 40"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NotificationStackIllustration(): React.ReactElement {
  // Three stacked notification cards with the topmost slightly offset and
  // teal-accented — the «what would slip past» surfaces forward.
  return (
    <svg
      data-testid="insights-illustration-notification-stack"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="6"
        y="32"
        width="32"
        height="8"
        rx="2"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.25"
      />
      <rect
        x="8"
        y="22"
        width="32"
        height="8"
        rx="2"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.25"
      />
      <rect
        x="10"
        y="10"
        width="32"
        height="10"
        rx="2"
        fill="none"
        stroke="var(--provedo-accent)"
        strokeWidth="1.75"
      />
      <line
        x1="14"
        y1="15"
        x2="32"
        y2="15"
        stroke="var(--provedo-accent)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CiteLinkIllustration(): React.ReactElement {
  // A document with an underline + a small chain-link glyph emanating —
  // observation tied to a source.
  return (
    <svg
      data-testid="insights-illustration-cite-link"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="6"
        y="6"
        width="22"
        height="28"
        rx="2"
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.25"
      />
      <line
        x1="10"
        y1="14"
        x2="24"
        y2="14"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="20"
        x2="24"
        y2="20"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="26"
        x2="20"
        y2="26"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 28 36 Q 34 36 36 32 Q 38 28 42 28"
        fill="none"
        stroke="var(--provedo-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="42" cy="28" r="3" fill="none" stroke="var(--provedo-accent)" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Section composer ────────────────────────────────────────────────────────

const HERO_BULLET_COPY =
  'Provedo holds context across every broker — knows what you own, what changed, where the deltas matter.';

// Slice-LP6 §gap-5b — surfacing «patterns in your past trades» (most
// differentiated claim per brand-strategist; previously only in OG
// description). Bullet #2 now names patterns explicitly + ties to the trade
// ledger as the source. Lane A preserved (observation, not advice).
const SMALL_BULLETS: ReadonlyArray<{
  copy: string;
  Illustration: () => React.ReactElement;
}> = [
  {
    copy: 'Provedo surfaces what would slip past — incoming dividends, forming drawdowns, creeping concentration.',
    Illustration: NotificationStackIllustration,
  },
  {
    copy: 'Provedo shows patterns in your past trades — entry timing, exits, repeat shapes — every one tied back to a trade or event.',
    Illustration: CiteLinkIllustration,
  },
] as const;

export function ProvedoInsightsBullets(): React.ReactElement {
  return (
    <section
      aria-labelledby="insights-heading"
      className="px-4 py-16 md:py-24"
      style={{
        // Atmosphere wash — subtle warm-cream radial that lifts the section
        // out of the flat sequence the prior version sat in.
        backgroundColor: 'var(--provedo-bg-elevated)',
        backgroundImage:
          'radial-gradient(ellipse 1100px 600px at 80% 0%, rgba(13, 148, 136, 0.045) 0%, transparent 65%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <ScrollFadeIn>
          <div className="mb-12 text-center md:mb-14">
            <h2
              id="insights-heading"
              className="text-2xl font-semibold tracking-tight md:text-4xl"
              style={{ color: 'var(--provedo-text-primary)' }}
            >
              A few minutes a day. Everything that moved.
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg"
              style={{ color: 'var(--provedo-text-secondary)' }}
            >
              Provedo surfaces dividends, drawdowns, and concentration shifts — in one feed, not
              scattered across{' '}
              <strong style={{ color: 'var(--provedo-text-primary)' }}>seven broker emails</strong>.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Asymmetric bento — large hero card 2/3 + two small cards 1/3 stacked */}
        <ScrollFadeIn>
          <div
            data-testid="insights-bento-grid"
            className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6"
          >
            {/* Hero card (cols 1–8 at lg+) */}
            <div
              data-testid="insights-bento-hero-card"
              className="lg:col-span-8"
              style={{
                backgroundColor: 'var(--provedo-bg-elevated)',
                border: '1px solid var(--provedo-border-subtle)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04), 0 4px 8px rgba(15, 23, 42, 0.02)',
                height: '100%',
              }}
            >
              <BrokerGraphIllustration />
              <p
                className="mt-6 text-lg leading-relaxed md:text-xl"
                style={{ color: 'var(--provedo-text-primary)' }}
              >
                {HERO_BULLET_COPY}
              </p>
            </div>

            {/* Two small cards stacked (cols 9–12 at lg+) */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              {SMALL_BULLETS.map((bullet) => {
                const { Illustration } = bullet;
                return (
                  <div
                    key={bullet.copy}
                    data-testid="insights-bento-small-card"
                    style={{
                      backgroundColor: 'var(--provedo-bg-muted)',
                      border: '1px solid var(--provedo-border-subtle)',
                      borderRadius: '14px',
                      padding: '24px',
                      flex: '1 1 0',
                    }}
                  >
                    <Illustration />
                    <p
                      className="mt-4 text-sm leading-relaxed"
                      style={{ color: 'var(--provedo-text-secondary)' }}
                    >
                      {bullet.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollFadeIn>

        {/* Slice-LP6 §gap-4: Sources mount UNMOUNTED from §S5 (see import-block
            comment). The Sage-stacking ceiling brand-strategist §7 flagged
            now resolves naturally — Sources visible mounts go from 5 down to
            2 (hero + S4 Teaser 1). */}
      </div>
    </section>
  );
}
