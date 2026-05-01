import { ArrowRight, Lock } from 'lucide-react';
import { DsRow, DsSection } from '../_components/DsSection';

/**
 * §Primitives — every button / chip / pill in D1, every state.
 *
 * Hover, focus, active, disabled. The only state we cannot demonstrate
 * statically is `:focus-visible` — keyboard-tab into the surface to see
 * the 2px lime ring with 2px offset.
 */

interface StateColumnProps {
  label: string;
  children: React.ReactNode;
}

function StateColumn({ label, children }: StateColumnProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--d1-font-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--d1-text-muted)',
        }}
      >
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

const stateGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 16,
  alignItems: 'start',
};

export function PrimitivesSection() {
  return (
    <DsSection
      id="primitives"
      eyebrow="05 · Primitives"
      title="Buttons, chips, segmented controls"
      lede="Every actionable primitive in D1, all states. Hover by mouse, tab in for the focus ring (2px lime, 2px offset), press to see active."
    >
      <DsRow label="LIME CTA — DEFAULT · DISABLED · GHOST">
        <div style={stateGridStyle}>
          <StateColumn label="Default">
            <button type="button" className="d1-cta">
              See the dashboard
              <ArrowRight size={14} />
            </button>
          </StateColumn>
          <StateColumn label="Disabled">
            <button type="button" className="d1-cta" disabled>
              See the dashboard
              <ArrowRight size={14} />
            </button>
          </StateColumn>
          <StateColumn label="Ghost variant">
            <button type="button" className="d1-cta d1-cta--ghost">
              Read the disclosure
            </button>
          </StateColumn>
        </div>
      </DsRow>

      <DsRow label="NAV PILL — DEFAULT · ACTIVE · DISABLED">
        <div style={stateGridStyle}>
          <StateColumn label="Default">
            <button type="button" className="d1-pill">
              Insights
            </button>
          </StateColumn>
          <StateColumn label="Active">
            <button type="button" className="d1-pill d1-pill--active">
              Overview
            </button>
          </StateColumn>
          <StateColumn label="Disabled">
            <button type="button" className="d1-pill" disabled>
              Reports
            </button>
          </StateColumn>
        </div>
      </DsRow>

      <DsRow label="FILTER CHIP — DEFAULT · ACTIVE · ICON · EXPORT · DISABLED">
        <div style={stateGridStyle}>
          <StateColumn label="Default">
            <button type="button" className="d1-chip">
              Holdings
            </button>
          </StateColumn>
          <StateColumn label="Active (post-fix #5 muted)">
            <button type="button" className="d1-chip d1-chip--active">
              All
            </button>
          </StateColumn>
          <StateColumn label="Icon-only">
            <button type="button" className="d1-chip d1-chip--icon" aria-label="More filters">
              <ArrowRight size={14} />
            </button>
          </StateColumn>
          <StateColumn label="Export variant">
            <button type="button" className="d1-chip d1-chip--export">
              Export CSV
            </button>
          </StateColumn>
          <StateColumn label="Disabled">
            <button type="button" className="d1-chip" disabled>
              Income
            </button>
          </StateColumn>
        </div>
      </DsRow>

      <DsRow label="SEGMENTED CONTROL — IDLE · ACTIVE">
        <div className="d1-segmented" role="tablist" aria-label="Period">
          <button
            type="button"
            className="d1-segmented__btn d1-segmented__btn--active"
            role="tab"
            aria-selected="true"
          >
            Monthly
          </button>
          <button type="button" className="d1-segmented__btn" role="tab" aria-selected="false">
            Annually
          </button>
          <button type="button" className="d1-segmented__btn" role="tab" aria-selected="false">
            All time
          </button>
        </div>
      </DsRow>

      <DsRow label="PREMIUM CHIP + DISCLAIMER CHIP">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="d1-chip-premium">Premium</span>
          <span className="d1-disclaimer-chip">
            <span className="d1-disclaimer-chip__icon" aria-hidden>
              <Lock size={14} />
            </span>
            <span>Read-only · No advice</span>
          </span>
        </div>
      </DsRow>
    </DsSection>
  );
}
