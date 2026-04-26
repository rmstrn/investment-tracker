// /disclosures — Layer 3 of the v3.2 three-layer disclaimer pattern.
// Body copy verbatim from content-lead D2 deliverable, with legal-advisor SIGNED-WITH-EDITS
// (Wave 2.5) corrections applied:
//   - REQUIRED Edit 1 (substantive): §5 «Your decisions» — drop tax/retirement/composition
//     qualifier (forecloses future Plus-tier tax-optimization + retirement-account features
//     via DOL Fiduciary Rule adjacency).
//   - REQUIRED Edit 2 (cosmetic): §4 «Past performance» — singular «a recommendation»
//     (verbal-rhyme parity with locked Tab-3 disclaim phrase).
//   - OPTIONAL Edit 4 (UK PERG 8 citation): APPLIED — 11-word addition strengthens UK FCA
//     regulator-readability with no forward-operational cost. Low-risk, high-value.
//   - OPTIONAL Edit 5 (soften «foresight» predict-coded register): APPLIED via Replacement A
//     (foresight → perspective). Removes SEC-Marketing-Rule predict-claim risk vs §4 disclaim.
// Voice: disclaim register / Sage gravitas / no marketing tone.
// noindex — pre-attorney-review pre-alpha text intentionally excluded from search/archive.
//   When licensed counsel signs off pre-production, flip to index (one-line change).
//
// A11y (a11y-architect spec audit Wave 2.5 corrections):
//   - A2.1 HIGH:    page wrapper is <article> (not nested <main> inside layout's <main>).
//   - A2.2 MEDIUM:  «Last updated» date wrapped in <time dateTime>.
//   - A2.3 MEDIUM:  body links use accent color + underline + focus-visible ring.
//   - A2.4 MEDIUM:  TOC <nav aria-label="On this page"> at top for sectional jump.
//   - All <h2> sections carry matching id anchors.

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

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const SECTIONS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'who', label: 'Who Provedo is and is not' },
  { id: 'what', label: 'Information we provide' },
  { id: 'per-jurisdiction', label: 'Per-jurisdiction notes' },
  { id: 'past-performance', label: 'Past performance and predictions' },
  { id: 'decisions', label: 'Your decisions, your responsibility' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function DisclosuresPage(): React.ReactElement {
  return (
    <article
      className="provedo-disclosures mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24"
      aria-labelledby="disclosures-heading"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
        color: 'var(--provedo-text-secondary)',
      }}
    >
      {/* Scoped CSS: body-link underline + focus-visible ring per a11y A2.3.
          Inline <style> keeps the page server-rendered (no client bundle) while still scoping
          to .provedo-disclosures so it cannot leak to other surfaces. */}
      <style>{`
        .provedo-disclosures a {
          color: var(--provedo-accent);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }
        .provedo-disclosures a:hover { text-decoration-thickness: 2px; }
        .provedo-disclosures a:focus-visible {
          outline: 2px solid var(--provedo-accent);
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>

      <header className="mb-10">
        <h1
          id="disclosures-heading"
          className="text-3xl font-semibold tracking-tight md:text-4xl"
          style={{ color: 'var(--provedo-text-primary)' }}
        >
          Regulatory disclosures
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--provedo-text-tertiary)' }}>
          Last updated: <time dateTime="2026-04-27">2026-04-27</time>
        </p>
      </header>

      {/* TOC — a11y A2.4 (sectional jump for SR + regulator skim).
          Renders as a plain ordered list of in-page anchors; no client JS. */}
      <nav aria-label="On this page" className="mb-8">
        <ol className="space-y-1 text-sm">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="who" title="Who Provedo is and is not">
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

      <Section id="what" title="Information we provide">
        <p>
          Provedo provides clarity, observation, context, and perspective on your portfolio. Provedo
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

      <Section id="per-jurisdiction" title="Per-jurisdiction notes">
        <p>
          <strong style={{ color: 'var(--provedo-text-primary)' }}>United States.</strong> Provedo
          is not registered as an investment advisor under the Investment Advisers Act of 1940 and
          does not provide personalized investment advice. Provedo is not a broker-dealer registered
          under the Securities Exchange Act of 1934.
        </p>
        <p>
          <strong style={{ color: 'var(--provedo-text-primary)' }}>European Union.</strong> Provedo
          does not provide a personal recommendation as defined in MiFID II (Directive 2014/65/EU).
          Provedo provides generic information.
        </p>
        <p>
          <strong style={{ color: 'var(--provedo-text-primary)' }}>United Kingdom.</strong> Provedo
          provides generic information and does not provide regulated investment advice under the
          Financial Services and Markets Act 2000 (FSMA), as further described in the FCA Perimeter
          Guidance Manual (PERG 8). Provedo&apos;s communications are intended to be fair, clear,
          and not misleading.
        </p>
      </Section>

      <Section id="past-performance" title="Past performance and predictions">
        <p>
          Past performance is not indicative of future results. Patterns Provedo surfaces from your
          trade history are retrospective observations about past trades. They are not predictions
          about future market movements and are not a recommendation about future trading decisions.
        </p>
      </Section>

      <Section id="decisions" title="Your decisions, your responsibility">
        <p>
          Every decision about your portfolio remains yours. Information Provedo surfaces is
          intended to support your own analysis, not to replace it. Consult a licensed financial
          advisor in your jurisdiction before making investment decisions.
        </p>
      </Section>

      <Section id="contact" title="Contact">
        <p>
          Questions about these disclosures:{' '}
          <a href="mailto:support@provedo.app">support@provedo.app</a>
        </p>
      </Section>

      <hr
        className="mt-12"
        style={{ border: 'none', borderTop: '1px solid var(--provedo-border-subtle)' }}
      />
      <p className="mt-6 text-xs italic" style={{ color: 'var(--provedo-text-tertiary)' }}>
        Last updated: <time dateTime="2026-04-27">2026-04-27</time>.
      </p>
    </article>
  );
}

function Section({ id, title, children }: SectionProps): React.ReactElement {
  return (
    <section className="mt-10" aria-labelledby={`${id}-heading`}>
      <h2
        id={id}
        className="mb-3 text-xl font-semibold tracking-tight"
        style={{ color: 'var(--provedo-text-primary)' }}
      >
        <span id={`${id}-heading`}>{title}</span>
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
