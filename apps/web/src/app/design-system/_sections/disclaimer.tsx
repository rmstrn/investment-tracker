import { RegulatoryDisclaimer } from '@investment-tracker/ui';
import { Section, SubBlock } from '../_components/Section';

/**
 * §Disclaimer — TD-100 RegulatoryDisclaimer compact + verbose.
 *
 * The compact variant is mounted as a sticky-footer in `(app)/layout.tsx`
 * across all 7 chart-bearing app routes — that mount is unaffected by the
 * showcase. This section displays both render variants inline so designers
 * + content reviewers can verify the legal-floor copy without leaving the
 * showcase.
 */
export function DisclaimerSection() {
  return (
    <Section
      id="disclaimer"
      eyebrow="§ Disclaimer · TD-100"
      title="Regulatory disclaimer — Lane A"
      description="Both render variants of <RegulatoryDisclaimer>. Compact mounts in every (app) route footer; verbose mounts only on /legal/disclaimer. Copy is locked — never paraphrase inline."
    >
      <SubBlock title="Compact (footer mount)" meta="2-line summary">
        <div
          className="rounded-[14px]"
          style={{
            background: 'var(--card)',
            boxShadow: 'var(--shadow-soft)',
            padding: '14px 18px',
          }}
        >
          <RegulatoryDisclaimer variant="compact" lang="en" />
        </div>
      </SubBlock>

      <SubBlock title="Verbose (full disclaimer page)" meta="7-paragraph floor">
        <div
          className="rounded-[14px]"
          style={{
            background: 'var(--card)',
            boxShadow: 'var(--shadow-soft)',
            padding: '24px 28px',
          }}
        >
          <RegulatoryDisclaimer variant="verbose" lang="en" />
        </div>
      </SubBlock>
    </Section>
  );
}
