import { Lock } from 'lucide-react';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Disclaimer — Lane-A regulatory disclosure on a D1 surface.
 *
 * 16px Geist Sans floor (per spec §0). The persistent disclaimer chip
 * pattern from fix #3 lives in the nav (left placement); the footer
 * disclosure remains as defence in depth. This section documents both
 * surfaces.
 */

const FOOTER_COPY =
  'Read-only access every time. Dividends dated. Drift noted. Nothing prescribed. Provedo surfaces patterns from your own brokerage data; it does not provide investment advice, recommendations, or trade routing. By using Provedo you confirm you understand this is a record-keeping and observation tool, not a financial-advisory service. Your data is read-only across every connected broker. Provedo cannot place trades, withdraw funds, or change your account settings.';

export function DisclaimerSection() {
  return (
    <DsSection
      id="disclaimer"
      eyebrow="14 · Disclaimer"
      title="Lane-A regulatory disclosure"
      lede="Disclosure copy renders at 16px Geist Sans floor (per spec §0). The persistent chip in the nav and the footer strip together carry the «not advice» stance — defence in depth."
    >
      <DsRow label="PERSISTENT DISCLAIMER CHIP (NAV — FIX #3)">
        <span className="d1-disclaimer-chip">
          <span className="d1-disclaimer-chip__icon" aria-hidden>
            <Lock size={14} />
          </span>
          <span>Read-only · No advice</span>
        </span>
        <p
          style={{
            margin: '12px 0 0',
            fontFamily: 'var(--d1-font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--d1-text-muted)',
          }}
        >
          Left placement, between brand monogram and first nav pill — anchors «read-only» as a
          product property, not a footer afterthought.
        </p>
      </DsRow>

      <DsRow label="FOOTER STRIP (LANE-A 16PX FLOOR)">
        <p className="d1-disclosure">{FOOTER_COPY}</p>
      </DsRow>

      <DsCallout heading="Defence in depth">
        Two regulatory surfaces — the nav chip is always-on chrome; the footer strip is the
        long-form. Together they carry the Lane-A commitment: Provedo is a record-keeping and
        observation tool, not a financial-advisory service.
      </DsCallout>
    </DsSection>
  );
}
