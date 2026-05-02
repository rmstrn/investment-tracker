import Link from 'next/link';
import { RecordRail } from '../../style-d1/_components/RecordRail';
import { PRICING_CTA, PRICING_HEADER, PRICING_SUB } from '../_lib/landing-copy';

/**
 * Section 8 — Pricing teaser.
 *
 * Per synthesis-lock §1 item 9: light reference to `/pricing`; no full
 * price list inline. Pre-alpha free positioning.
 *
 * Single Read-tier card with Record Rail + secondary CTA to /pricing.
 */
export function PricingTeaser() {
  return (
    <section className="landing-section" aria-labelledby="landing-pricing-heading">
      <div className="landing-section__inner">
        <h2 id="landing-pricing-heading" className="landing-section__heading">
          {PRICING_HEADER}
        </h2>
        <p className="landing-section__sub">{PRICING_SUB}</p>

        <div className="landing-pricing">
          <RecordRail label="PRICING · PRE-ALPHA" />
          <Link href="/pricing" className="landing-cta landing-cta--secondary">
            {PRICING_CTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
