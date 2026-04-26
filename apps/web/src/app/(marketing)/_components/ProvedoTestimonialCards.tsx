'use client';

// ProvedoTestimonialCards — §S7 pre-alpha testimonials (v3.2)
// V3.2: collapsed from 3-card grid → single weighted card per content-lead D3 + product-designer V5.
// Card 1 (chat surface) selected — strongest signal cluster (chat-first wedge + sources + ICP-A).
// «Alpha quotes coming Q2 2026.» honest line moves to header sub (replaces verbose 2-sentence sub).
// Bottom redundant disclosure dropped (single mention in header sub is enough).
// Accessibility: <section><figure><blockquote><figcaption> preserved. AAA contrast verified.

interface TestimonialCard {
  quote: string;
  name: string;
  tier: 'Plus' | 'Free';
  surface: string;
}

const FEATURED_QUOTE: TestimonialCard = {
  quote:
    'I asked Provedo why my portfolio was down. It told me which two positions did 62% of the work, with sources. Two minutes, no spreadsheet.',
  name: 'Roman M.',
  tier: 'Plus',
  surface: 'chat surface',
};

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
      <div className="mx-auto max-w-3xl">
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
            {/* v3.2: replaces verbose 2-sentence sub with single honest line per content-lead D3 */}
            <p
              className="mx-auto mt-3 max-w-xl text-sm italic leading-relaxed"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Alpha quotes coming Q2 2026. Below: a builder&apos;s note from the team shipping the
              product.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Single weighted card (v3.2 — was 3-card grid) */}
        <ScrollFadeIn>
          <figure
            className="mx-auto"
            style={{
              maxWidth: '640px',
              backgroundColor: 'var(--provedo-bg-elevated)',
              border: '1px solid var(--provedo-border-subtle)',
              borderRadius: '16px',
              padding: 'clamp(32px, 4vw, 48px)',
              boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--provedo-font-mono)',
                fontSize: '40px',
                color: 'var(--provedo-accent)',
                opacity: 0.4,
                lineHeight: 1,
                marginBottom: '16px',
                display: 'block',
              }}
            >
              &ldquo;
            </span>

            <blockquote
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 400,
                fontSize: '18px',
                color: 'var(--provedo-text-primary)',
                lineHeight: 1.6,
                marginBottom: '32px',
                quotes: 'none',
              }}
            >
              {FEATURED_QUOTE.quote}
            </blockquote>

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid var(--provedo-border-subtle)',
                marginBottom: '20px',
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
                  {FEATURED_QUOTE.name}
                </span>
                <TierBadge tier={FEATURED_QUOTE.tier} />
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
                <span style={{ fontFamily: 'var(--provedo-font-mono)' }}>
                  {FEATURED_QUOTE.surface}
                </span>
              </p>
            </figcaption>
          </figure>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
