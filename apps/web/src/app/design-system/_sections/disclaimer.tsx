import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Disclaimer — Lane-A regulatory disclosure pattern in D3 dialect.
 *
 * 16px floor (Lane-A requirement — never below 16px on regulatory copy).
 * Surface-1 fill, hairline border, ink text. The «Regulated» chip uses
 * the bordeaux highlight surface — this is a sanctioned use of the
 * accent-secondary because the chip IS the highlight (one chip per
 * disclosure, by rule).
 */

const DISCLOSURE_COPY = `Provedo is a read-only portfolio aggregation surface. We do not provide
investment advice, do not custody assets, and do not place orders. Information
shown is reconciled from your linked broker statements; treat any figure as
indicative until you reconcile against your broker's official statement.
For questions about your statutory rights, consult the regulator in the
jurisdiction where your broker is licensed.`;

export function DisclaimerSection() {
  return (
    <SectionShell
      id="disclaimer"
      title="Disclaimer"
      meta="LANE A · 16PX FLOOR"
      description="Regulatory copy lives at a 16px floor — never smaller, never lighter than ink. The 'Regulated' chip is the one place bordeaux earns its keep on a disclosure surface."
    >
      <DsRow label="Persistent disclosure (page-foot pattern)">
        <p className="ds-disclosure">
          <span className="ds-disclosure__chip">Regulated</span>
          {DISCLOSURE_COPY}
        </p>
      </DsRow>

      <DsRow label="Inline disclosure (within an AI dossier row)">
        <p className="ds-disclosure" style={{ fontSize: 16 }}>
          Past performance is not indicative of future results. The figures shown reflect read-only
          broker statements as of the timestamp on this dossier row. This surface is not
          personalised investment advice.
        </p>
      </DsRow>
    </SectionShell>
  );
}
