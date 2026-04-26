import Link from 'next/link';
import { ProvedoButton } from './ProvedoButton';

// Provedo footer — v3.2: 3-layer disclaimer (Layer 1 plain summary + Layer 2 expandable
// regulator-readable + Layer 3 link to /disclosures).
// Layer 2 verbatim 75-word block PRESERVED from `8cb509b` legal-advisor patch — DO NOT modify.
// Waitlist box CTA changed «Try Plus free for 14 days» → «Open Provedo» per PO microcopy
// principle 2026-04-27 (no «free for X days» reassurance framings; voice-rhyme with §S10).
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
            Open Provedo
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
            {/* Wave 2.5 cross-cutting (legal §2 belt-and-suspenders + a11y O2):
                ALWAYS-VISIBLE /disclosures link, independent of Layer 2 <details> toggle.
                Addresses AT/browser combos that hide collapsed <details> content from the
                a11y tree, AND regulator-readability without requiring AT-toggle interaction. */}
            <Link
              href="/disclosures"
              className="transition-colors duration-150"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Disclosures
            </Link>
          </nav>
        </div>

        {/* ─── Layer 1 — plain-language summary ──────────────────────────────
            Visible primary disclaim. Locked copy from legal-advisor + PO 2026-04-27.
            Typography per product-designer V3 spec — slate-600, 13px, lh 1.6, max-w 640px. */}
        <p
          className="mt-6"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--provedo-text-secondary)',
            maxWidth: '640px',
          }}
        >
          Provedo provides general information about your portfolio. It is not personalized
          investment advice — every decision stays yours.
        </p>

        {/* ─── Layer 2 — expandable regulator-readable disclosure ────────────
            <details>/<summary> chevron pattern matches ProvedoFAQ.tsx exactly.
            Verbatim 75-word block PRESERVED from commit 8cb509b — DO NOT modify wording.
            CSS-only focus styling (no JS handlers) — keeps MarketingFooter as Server Component. */}
        <details className="group mt-4" style={{ maxWidth: '640px' }}>
          <summary
            className="flex cursor-pointer list-none items-center gap-2 rounded py-2 outline-none focus-visible:outline-2 focus-visible:[outline-color:var(--provedo-accent)] focus-visible:[outline-offset:2px]"
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 500,
              fontSize: '13px',
              color: 'var(--provedo-text-secondary)',
              transition: 'color 150ms ease',
            }}
          >
            <span>Full regulatory disclosures (US, EU, UK)</span>
            {/* Chevron — same SVG path as ProvedoFAQ.tsx */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              style={{
                flexShrink: 0,
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

          <div className="mt-3">
            <p
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: 1.55,
                color: 'var(--provedo-text-tertiary)',
                maxWidth: '640px',
              }}
            >
              Provedo is not a registered investment advisor and is not a broker-dealer. Provedo
              provides generic information for educational purposes only and does not provide
              personalized investment recommendations or advice as defined under the U.S. Investment
              Advisers Act of 1940, EU MiFID II, or UK FSMA 2000. Past performance is not indicative
              of future results. All investment decisions are your own. Consult a licensed financial
              advisor in your jurisdiction before making investment decisions.
            </p>

            {/* Layer 3 — link to /disclosures full-text page */}
            <Link
              href="/disclosures"
              className="mt-3 inline-flex items-center gap-1 hover:underline"
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 500,
                fontSize: '12px',
                color: 'var(--provedo-accent)',
                textDecoration: 'none',
                textUnderlineOffset: '2px',
              }}
            >
              Read full extended disclosures →
            </Link>
          </div>
        </details>
      </div>
    </footer>
  );
}
