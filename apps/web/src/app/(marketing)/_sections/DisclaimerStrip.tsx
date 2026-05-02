import Link from 'next/link';
import { FOOTER_DISCLAIMER } from '../_lib/landing-copy';

/**
 * Section 11 — Lane-A regulatory disclaimer strip.
 *
 * Sits below the closing CTA + above the existing MarketingFooter.
 * Information-only language, structural negations only («not a
 * broker-dealer», «not a registered investment advisor», «does not
 * constitute a personalized recommendation») — all permitted inside
 * disclaimer surfaces per content-lead §10.3.
 *
 * Includes a link to the full `/legal/disclaimer` page (which is
 * INDEXED per architect ADR-9 — Lane-A trust signal).
 */
export function DisclaimerStrip() {
  return (
    <section className="landing-disclaimer" aria-label="Regulatory disclaimer">
      <div className="landing-disclaimer__inner">
        <p className="landing-disclaimer__body">
          {FOOTER_DISCLAIMER}{' '}
          <Link
            href="/legal/disclaimer"
            style={{ color: 'var(--d1-text-primary)', textDecoration: 'underline' }}
          >
            Read the full disclaimer.
          </Link>
        </p>
      </div>
    </section>
  );
}
