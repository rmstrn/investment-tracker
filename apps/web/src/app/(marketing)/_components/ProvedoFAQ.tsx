// ProvedoFAQ — §S9 FAQ accordion 2-column magazine layout
// (Slice-LP5-BCD B1, per PD spec §C.S9)
//
// Bold direction (PD spec §C.S9):
//   Magazine-style 2-column layout on md+. Left column anchors a contextual
//   eyebrow («FAQ») + section heading + intro line; right column holds the
//   accordion. Within the accordion, each question gets a subtle hover
//   background. The heading «Questions you'd ask» becomes friendlier with
//   a small intro line «If you're wondering, you're not the first.» (Lane-A
//   clean — observation-coded, not advice).
//
// Mobile (<768px): the left col collapses ABOVE the right col (no sticky).
// Standard 1-col stack — accessibility unchanged.
//
// Plus price LOCKED $9/month per finance-advisor 2026-04-26.
// All FAQ questions/answers preserved verbatim.

const FAQ_ITEMS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    // Landing-v2 right-hand resolution #8: drop «foresight» from Q1 (off-allowlist
    // for brand voice §F). Re-anchored on observation + context + citations.
    question: 'Does Provedo give investment advice?',
    answer:
      'No. Provedo provides clarity, observation, context, and citations — never advice, recommendations, or strategy. Information, not advice.',
  },
  {
    question: 'How is Provedo different from a robo-advisor?',
    answer:
      "A robo-advisor moves money for you. Provedo holds your portfolio across every broker, answers your questions, and surfaces what you'd miss — but every decision stays yours.",
  },
  {
    question: 'Which brokers are supported?',
    answer:
      'Hundreds of brokers and exchanges via SnapTrade, Plaid, and CCXT — Fidelity, Schwab, IBKR, Robinhood, E*TRADE, Trading212, Coinbase, Binance, Kraken, and most major venues globally.',
  },
  {
    question: 'What does Provedo cost?',
    answer:
      'The Free tier is 50 questions a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Provedo reads your broker data through read-only API connections — no trading credentials, no money movement. Provedo cannot place trades on your account, by design.',
  },
  {
    // Slice-LP6 §gap-7 — Q6 rewrite (voice + content + researcher convergence).
    // OLD: «Provedo is in active build. The Free tier is locked; the product
    // is real and runs on your real holdings. Some surfaces are still being
    // polished, and you're early.»
    // Issue: «Free tier is locked» reads as «unavailable» (= trust collapse).
    // NEW (per content-lead): runs-on-real-holdings-today framing + the
    // «you're early» payoff that gives the admission a value, not a hedge.
    question: 'What does "pre-alpha" mean?',
    answer:
      "It runs on your real holdings today. Some screens are rough, some features land week by week. You're early — which is the point.",
  },
] as const;

export function ProvedoFAQ(): React.ReactElement {
  return (
    <section
      aria-labelledby="faq-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* 2-column grid on md+; mobile stacks left col above right col. */}
        <div data-testid="faq-grid" className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          {/* Left column — eyebrow + heading + intro line.
              Sticky on md+ (Apple/Stripe documentation pattern) so the
              header stays in view while the accordion scrolls. */}
          <aside
            data-testid="faq-left-col"
            className="md:col-span-4 md:sticky md:top-24 md:self-start"
          >
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{
                color: 'var(--provedo-accent)',
                fontFamily: 'var(--provedo-font-mono)',
                letterSpacing: '0.18em',
                margin: 0,
              }}
            >
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl"
              style={{ color: 'var(--provedo-text-primary)', textWrap: 'balance' }}
            >
              Questions you&apos;d ask
            </h2>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: 'var(--provedo-text-muted)' }}
            >
              If you&apos;re wondering, you&apos;re not the first.
            </p>
          </aside>

          {/* Right column — accordion */}
          <div data-testid="faq-right-col" className="md:col-span-8">
            <div className="space-y-0">
              {FAQ_ITEMS.map((item, faqIdx) => (
                <details
                  key={item.question}
                  className="group"
                  style={{
                    borderTop: faqIdx === 0 ? '1px solid var(--provedo-border-subtle)' : undefined,
                    borderBottom: '1px solid var(--provedo-border-subtle)',
                  }}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between rounded py-5 text-base font-medium outline-none focus-visible:outline-2 focus-visible:[outline-color:var(--provedo-accent)] focus-visible:[outline-offset:2px] hover:bg-[var(--provedo-bg-muted)]"
                    style={{
                      color: 'var(--provedo-text-primary)',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      transition: 'background-color 150ms ease',
                    }}
                  >
                    <span style={{ fontSize: '17px' }}>{item.question}</span>
                    {/* Chevron indicator — CSS :open state */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        marginLeft: '16px',
                        color: 'var(--provedo-text-tertiary)',
                        transition: 'transform 150ms ease',
                      }}
                      className="group-open:rotate-180"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>

                  <p
                    className="pb-5 text-sm leading-relaxed"
                    style={{
                      color: 'var(--provedo-text-secondary)',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      maxWidth: '640px',
                    }}
                  >
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
