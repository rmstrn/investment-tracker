import Link from 'next/link';
import { ProvedoButton } from './ProvedoButton';

// Provedo footer — verbatim disclaimer from docs/content/landing-provedo-v1.md v2 §6
// Rename notice deferred — PO call required (Risk 2 from kickoff, Option B = skip for first-pass).
export function MarketingFooter() {
  return (
    <footer
      id="waitlist"
      className="border-t"
      style={{
        borderColor: 'var(--provedo-border-subtle)',
        backgroundColor: 'var(--provedo-bg-page)',
      }}
    >
      <div
        className="mx-auto max-w-6xl px-4 py-12 md:px-8"
        style={{ color: 'var(--provedo-text-secondary)' }}
      >
        {/* Waitlist anchor destination — no form for first-pass */}
        <div
          className="mb-8 rounded-xl border px-6 py-8 text-center"
          style={{
            borderColor: 'var(--provedo-border-subtle)',
            backgroundColor: 'var(--provedo-bg-elevated)',
          }}
        >
          <p
            className="mb-1 text-lg font-semibold"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            Ready when you are.
          </p>
          <p className="mb-6 text-sm" style={{ color: 'var(--provedo-text-secondary)' }}>
            Provedo is coming soon. Waitlist open — be first to try it.
          </p>
          <ProvedoButton href="/sign-up" size="md">
            Try Plus free for 14 days
          </ProvedoButton>
        </div>

        {/* Footer nav + legal */}
        <div className="flex flex-col items-start justify-between gap-3 text-sm sm:flex-row sm:items-center">
          <p style={{ color: 'var(--provedo-text-tertiary)' }}>© 2026 Provedo</p>
          <nav aria-label="Footer navigation" className="flex items-center gap-5">
            <Link
              href="/pricing"
              className="transition-colors duration-150"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="transition-colors duration-150"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Sign in
            </Link>
          </nav>
        </div>

        {/* Regulatory disclaimer — tightened per legal-advisor 2026-04-26 (v3.1).
            Adds «not broker-dealer» + «no personalized recommendations» + explicit
            Investment Advisers Act / MiFID II / FSMA 2000 citations + advisor-consult close.
            Final wording requires per-jurisdiction attorney review before public launch. */}
        <p
          className="mt-6 max-w-2xl text-xs leading-relaxed"
          style={{ color: 'var(--provedo-text-tertiary)' }}
        >
          Provedo is not a registered investment advisor and is not a broker-dealer. Provedo
          provides generic information for educational purposes only and does not provide
          personalized investment recommendations or advice as defined under the U.S. Investment
          Advisers Act of 1940, EU MiFID II, or UK FSMA 2000. Past performance is not indicative of
          future results. All investment decisions are your own. Consult a licensed financial
          advisor in your jurisdiction before making investment decisions.
        </p>
      </div>
    </footer>
  );
}
