'use client';

// ProvedoFAQ — §S10 FAQ accordion (Slice-LP2)
// Content: verbatim from landing-provedo-v2.md §S10 — 6 Q&A
// Accessibility: details/summary native HTML (keyboard navigable, no JS required)
// 'use client' directive required for inline onFocus/onBlur event handlers (Next.js 15 RSC boundary)
// Lane A: Q1 explicit disclaim register, all answers audited per 5-item guardrails
// Plus price LOCKED $9/month per finance-advisor 2026-04-26 (was TD-096 placeholder)

const FAQ_ITEMS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'Does Provedo give investment advice?',
    answer:
      'No. Provedo provides clarity, observation, context, and foresight — never advice, recommendations, or strategy. Lane A: information, not advice.',
  },
  {
    question: 'How is Provedo different from a robo-advisor?',
    answer:
      "A robo-advisor moves money for you. Provedo holds your portfolio across every broker, answers your questions, and surfaces what you'd miss — but every decision stays yours.",
  },
  {
    question: 'Which brokers are supported?',
    answer:
      '100s of brokers and exchanges via SnapTrade, Plaid, and CCXT — Fidelity, Schwab, IBKR, Robinhood, E*TRADE, Trading212, Coinbase, Binance, Kraken, and most major venues globally.',
  },
  {
    question: 'What does Provedo cost?',
    answer:
      'Free is always free — 50 chat messages a month, full broker aggregation, weekly insights, no card required. Plus tier ($9/month) unlocks unlimited chat and insights when they matter.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Provedo reads your broker data through read-only API connections — no trading credentials, no money movement. Provedo cannot place trades on your account, by design.',
  },
  {
    question: 'What does "pre-alpha" mean?',
    answer:
      "Provedo is in active build. Free-forever tier is locked; the product is real and runs on your real holdings. Some surfaces are still being polished, and you're early.",
  },
] as const;

export function ProvedoFAQ(): React.ReactElement {
  return (
    <section
      aria-labelledby="faq-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Section header */}
        <h2
          id="faq-heading"
          className="mb-10 text-center text-2xl font-semibold tracking-tight md:mb-14 md:text-3xl"
          style={{ color: 'var(--provedo-text-primary)' }}
        >
          Common questions
        </h2>

        {/* FAQ items — native details/summary, keyboard accessible */}
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
                className="flex cursor-pointer list-none items-center justify-between py-5 text-base font-medium focus-visible:outline-none"
                style={{
                  color: 'var(--provedo-text-primary)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--provedo-accent)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = '';
                }}
              >
                <span>{item.question}</span>
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
                style={{ color: 'var(--provedo-text-secondary)' }}
              >
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
