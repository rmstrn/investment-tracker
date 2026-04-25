'use client';

// ProvedoTestimonialCards — §S7 pre-alpha testimonials (v3)
// V3.5: scroll fade-in on cards (stagger)
// Content: builder quotes (Option B — «builder» badge, honest pre-alpha framing)
// Accessibility: <section><figure><blockquote><figcaption>

interface TestimonialCard {
  quote: string;
  name: string;
  tier: 'Plus' | 'Free';
  surface: string;
}

const BUILDER_CARDS: ReadonlyArray<TestimonialCard> = [
  {
    quote:
      'I asked Provedo why my portfolio was down. It told me which two positions did 62% of the work, with sources. Two minutes, no spreadsheet.',
    name: 'Roman M.',
    tier: 'Plus',
    surface: 'chat surface',
  },
  {
    quote:
      "I check the feed for five minutes Sunday morning. Everything that moved is in one place. That's the whole product for me.",
    name: 'Roman M.',
    tier: 'Free',
    surface: 'weekly insights',
  },
  {
    quote:
      "Provedo noticed I'd been selling Apple within days of every dip last year. It just showed me the pattern. No judgment, no advice.",
    name: 'Roman M.',
    tier: 'Plus',
    surface: 'pattern recognition',
  },
] as const;

import { ScrollFadeIn } from './ScrollFadeIn';

function TierBadge({ tier }: { tier: 'Plus' | 'Free' }): React.ReactElement {
  return (
    <span
      aria-label={`${tier} tier`}
      style={{
        display: 'inline-block',
        backgroundColor: 'var(--provedo-accent-subtle)',
        color: 'var(--provedo-accent-active)',
        fontSize: '11px',
        fontFamily: 'var(--provedo-font-sans)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '2px 8px',
        borderRadius: '4px',
      }}
    >
      {tier} user
    </span>
  );
}

export function ProvedoTestimonialCards(): React.ReactElement {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <ScrollFadeIn>
          <div className="mb-10 text-center md:mb-14">
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--provedo-accent-subtle)',
                color: 'var(--provedo-accent)',
                fontSize: '11px',
                fontFamily: 'var(--provedo-font-mono)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: '100px',
                marginBottom: '16px',
              }}
              aria-label="Alpha testing starts Q2 2026"
            >
              Coming Q2 2026
            </span>

            <h2
              id="testimonials-heading"
              className="text-2xl font-semibold tracking-tight md:text-3xl"
              style={{ color: 'var(--provedo-text-primary)' }}
            >
              What testers will be noticing.
            </h2>
            <p
              className="mx-auto mt-3 max-w-xl text-sm leading-relaxed"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Provedo enters closed alpha Q2 2026. Below: quotes from the team building the product.
            </p>
          </div>
        </ScrollFadeIn>

        {/* 3-card grid — staggered fade-in */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BUILDER_CARDS.map((card, i) => (
            <ScrollFadeIn key={card.surface} delay={i * 100}>
              <figure
                style={{
                  backgroundColor: 'var(--provedo-bg-elevated)',
                  border: '1px solid var(--provedo-border-subtle)',
                  borderRadius: '12px',
                  padding: '32px',
                  boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
                  minHeight: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--provedo-font-mono)',
                    fontSize: '32px',
                    color: 'var(--provedo-accent)',
                    opacity: 0.4,
                    lineHeight: 1,
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  &ldquo;
                </span>

                <blockquote
                  style={{
                    fontFamily: 'var(--provedo-font-sans)',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: 'var(--provedo-text-secondary)',
                    lineHeight: 1.55,
                    marginBottom: 'auto',
                    paddingBottom: '24px',
                    quotes: 'none',
                  }}
                >
                  {card.quote}
                </blockquote>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid var(--provedo-border-subtle)',
                    marginBottom: '16px',
                  }}
                />

                <figcaption>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      style={{
                        fontFamily: 'var(--provedo-font-sans)',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: 'var(--provedo-text-primary)',
                      }}
                    >
                      {card.name}
                    </span>
                    <TierBadge tier={card.tier} />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--provedo-font-sans)',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: 'var(--provedo-text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>builder</span> at Provedo ·{' '}
                    <span style={{ fontFamily: 'var(--provedo-font-mono)' }}>{card.surface}</span>
                  </p>
                </figcaption>
              </figure>
            </ScrollFadeIn>
          ))}
        </div>

        {/* Honest disclaimer */}
        <p
          className="mx-auto mt-8 max-w-xl text-center text-xs italic leading-relaxed"
          style={{ color: 'var(--provedo-text-tertiary)' }}
        >
          Provedo is in pre-alpha. Quotes are from the team building the product. Real alpha-tester
          quotes replace these once alpha ships.
        </p>
      </div>
    </section>
  );
}
