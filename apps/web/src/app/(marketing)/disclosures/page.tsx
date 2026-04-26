// /disclosures — Layer 3 of the v3.2 three-layer disclaimer pattern.
// Body copy verbatim from content-lead D2 deliverable (`docs/content/slice-lp3-2-content-lead-deliverables.md` §D2).
// Voice: disclaim register / Sage gravitas / no marketing tone.
// noindex — full-text legal page intentionally excluded from search (matches staging posture).
// Sign-off: pending legal-advisor parallel review.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulatory disclosures · Provedo',
  description:
    'Full regulatory disclosures for Provedo. Provedo provides general information about your portfolio. It is not personalized investment advice — every decision stays yours.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DisclosuresPage(): React.ReactElement {
  return (
    <main
      className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
        color: 'var(--provedo-text-secondary)',
      }}
    >
      <article>
        <header className="mb-10">
          <h1
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            Regulatory disclosures
          </h1>
          <p className="mt-3 text-sm italic" style={{ color: 'var(--provedo-text-tertiary)' }}>
            Last updated: 2026-04-27
          </p>
        </header>

        <Section title="Who Provedo is and is not">
          <p>
            Provedo is a software product that provides general information about your investment
            portfolio. Provedo is not a registered investment advisor and is not a broker-dealer.
            Provedo does not provide personalized investment recommendations or advice as defined
            under the U.S. Investment Advisers Act of 1940, the EU Markets in Financial Instruments
            Directive (MiFID II), or the UK Financial Services and Markets Act 2000.
          </p>
          <p>
            Provedo does not hold custody of your assets. Provedo does not execute trades on your
            behalf. Provedo connects to your broker accounts on a read-only basis to aggregate
            position data and surface observations.
          </p>
        </Section>

        <Section title="Information we provide">
          <p>
            Provedo provides clarity, observation, context, and foresight on your portfolio. Provedo
            surfaces what you hold, shows what has changed, notices patterns across your trade
            history, and cites the sources for every observation. Provedo describes what is. Provedo
            does not prescribe what you should do.
          </p>
          <p>
            When Provedo references general market information — such as historical sector weights,
            dividend calendar dates, or documented behavioral-finance patterns — Provedo cites the
            public source. When Provedo references your own portfolio — positions, trades, dividends
            received — Provedo cites the broker statement and date the data was retrieved from.
          </p>
        </Section>

        <Section title="Per-jurisdiction notes">
          <p>
            <strong style={{ color: 'var(--provedo-text-primary)' }}>United States.</strong> Provedo
            is not registered as an investment advisor under the Investment Advisers Act of 1940 and
            does not provide personalized investment advice. Provedo is not a broker-dealer
            registered under the Securities Exchange Act of 1934.
          </p>
          <p>
            <strong style={{ color: 'var(--provedo-text-primary)' }}>European Union.</strong>{' '}
            Provedo does not provide a personal recommendation as defined in MiFID II (Directive
            2014/65/EU). Provedo provides generic information.
          </p>
          <p>
            <strong style={{ color: 'var(--provedo-text-primary)' }}>United Kingdom.</strong>{' '}
            Provedo provides generic information and does not provide regulated investment advice
            under the Financial Services and Markets Act 2000 (FSMA). Provedo&apos;s communications
            are intended to be fair, clear, and not misleading.
          </p>
        </Section>

        <Section title="Past performance and predictions">
          <p>
            Past performance is not indicative of future results. Patterns Provedo surfaces from
            your trade history are retrospective observations about past trades. They are not
            predictions about future market movements and are not recommendations about future
            trading decisions.
          </p>
        </Section>

        <Section title="Your decisions, your responsibility">
          <p>
            Every decision about your portfolio remains yours. Information Provedo surfaces is
            intended to support your own analysis, not to replace it. Consult a licensed financial
            advisor in your jurisdiction before making investment decisions, particularly decisions
            involving tax consequences, retirement accounts, or significant changes to your
            portfolio composition.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these disclosures:{' '}
            <a
              href="mailto:support@provedo.app"
              style={{
                color: 'var(--provedo-accent)',
                textDecoration: 'none',
              }}
              className="hover:underline"
            >
              support@provedo.app
            </a>
          </p>
        </Section>

        <hr
          className="mt-12"
          style={{ border: 'none', borderTop: '1px solid var(--provedo-border-subtle)' }}
        />
        <p className="mt-6 text-xs italic" style={{ color: 'var(--provedo-text-tertiary)' }}>
          Last updated: 2026-04-27.
        </p>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2
        className="mb-3 text-xl font-semibold tracking-tight"
        style={{ color: 'var(--provedo-text-primary)' }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-sm leading-relaxed"
        style={{ color: 'var(--provedo-text-secondary)' }}
      >
        {children}
      </div>
    </section>
  );
}
