import Link from 'next/link';

// MarketingFooter — chrome-only refactor (Slice-LP5-BCD B3, per PD spec §Footer)
//
// Bold direction (PD spec §Footer + PO 2026-04-27):
//   PO: «нужно отделить от основной части». The footer waitlist box is
//   dropped — S10 above is now the sole pre-footer CTA (PD §C.S10). The
//   footer becomes pure chrome: wordmark, nav, 3-layer disclaimer block,
//   copyright + tagline-rhyme. A clear visual separator (thicker top
//   border + 48px padding-top + bg-muted band) seats the footer as its
//   own beat below the dark §S10.
//
// Layer 2 verbatim 75-word block PRESERVED from `8cb509b` legal-advisor
//   patch — DO NOT modify wording. Layer 1 plain summary preserved verbatim.
//
// 3-layer disclaimer pattern intact:
//   - Layer 1: plain-language summary (slate-600 13px) — single mount of
//     «Information, not advice.»-class disclaim across the page.
//   - Layer 2: <details>/<summary> regulator-readable block.
//   - Layer 3: link to /disclosures.
export function MarketingFooter() {
  return (
    <footer
      id="waitlist"
      style={{
        // Clear visual separator from the dark §S10 above. A thicker top
        // border + warm-bg-muted strip makes the footer read as its own
        // chrome band, not a continuation of the dark CTA section.
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'var(--provedo-border-default)',
        backgroundColor: 'var(--provedo-bg-muted)',
      }}
    >
      <div
        className="mx-auto max-w-7xl px-4 md:px-8"
        style={{
          color: 'var(--provedo-text-secondary)',
          paddingTop: '48px',
          paddingBottom: '32px',
        }}
      >
        {/* Top row — wordmark on left, nav on right. The waitlist box that
            previously sat above this row is GONE (PD §Footer + PO directive). */}
        <div
          data-testid="footer-top-row"
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <Link
            href="/"
            aria-label="Provedo — home"
            className="rounded-sm focus-visible:outline-2 focus-visible:[outline-color:var(--provedo-accent)] focus-visible:[outline-offset:4px]"
            style={{ outline: 'none', textDecoration: 'none' }}
          >
            <span
              data-testid="footer-wordmark"
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--provedo-text-primary)',
                letterSpacing: '-0.01em',
                // Subtle teal accent under the «P» — single-letter brand-mark
                // detail per PD §Footer.
                borderBottom: '2px solid transparent',
                paddingBottom: '2px',
              }}
            >
              <span
                style={{
                  borderBottomWidth: '2px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'var(--provedo-accent)',
                  paddingBottom: '1px',
                }}
              >
                P
              </span>
              rovedo
            </span>
          </Link>

          <nav aria-label="Footer navigation" className="flex items-center gap-6 text-sm">
            <Link
              href="/pricing"
              className="transition-colors duration-150 hover:[color:var(--provedo-text-primary)]"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="transition-colors duration-150 hover:[color:var(--provedo-text-primary)]"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Sign in
            </Link>
            {/* Wave 2.5 cross-cutting (legal §2 belt-and-suspenders + a11y O2):
                ALWAYS-VISIBLE /disclosures link, independent of Layer 2 <details> toggle. */}
            <Link
              href="/disclosures"
              className="transition-colors duration-150 hover:[color:var(--provedo-text-primary)]"
              style={{ color: 'var(--provedo-text-tertiary)' }}
            >
              Disclosures
            </Link>
          </nav>
        </div>

        {/* Hairline separator between top row and disclaimer block */}
        <div
          aria-hidden="true"
          style={{
            marginTop: '32px',
            marginBottom: '24px',
            borderTop: '1px solid var(--provedo-border-subtle)',
          }}
        />

        {/* ─── Layer 1 — plain-language summary ──────────────────────────────
            Visible primary disclaim. Locked copy from legal-advisor + PO 2026-04-27.
            This is now the SINGLE mount of «Information, not advice.»-class
            disclaim across the landing (Slice-LP5-BCD C3 dropped the duplicate
            from the proof bar). */}
        <p
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--provedo-text-secondary)',
            maxWidth: '720px',
          }}
        >
          Provedo provides general information about your portfolio. It is not personalized
          investment advice — every decision stays yours.
        </p>

        {/* ─── Layer 2 — expandable regulator-readable disclosure ────────────
            <details>/<summary> chevron pattern matches ProvedoFAQ.tsx exactly.
            Verbatim 75-word block PRESERVED from commit 8cb509b — DO NOT modify wording.
            CSS-only focus styling (no JS handlers) — keeps MarketingFooter as Server Component. */}
        <details className="group mt-4" style={{ maxWidth: '720px' }}>
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
                maxWidth: '720px',
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

        {/* Hairline separator between disclaimer block and bottom row */}
        <div
          aria-hidden="true"
          style={{
            marginTop: '32px',
            marginBottom: '20px',
            borderTop: '1px solid var(--provedo-border-subtle)',
          }}
        />

        {/* Bottom row — copyright on left, tagline-rhyme on right (PD §Footer:
            «quiet brand-rhyme moment» — italic, slate-400, 12px). */}
        <div
          data-testid="footer-bottom-row"
          className="flex flex-col items-start justify-between gap-2 text-sm sm:flex-row sm:items-center"
        >
          <p style={{ color: 'var(--provedo-text-tertiary)', fontSize: '13px' }}>
            &copy; 2026 Provedo
          </p>
          <p
            data-testid="footer-tagline-rhyme"
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontStyle: 'italic',
              fontSize: '12px',
              color: 'var(--provedo-text-muted)',
            }}
          >
            Notice what you&apos;d miss.
          </p>
        </div>
      </div>
    </footer>
  );
}
