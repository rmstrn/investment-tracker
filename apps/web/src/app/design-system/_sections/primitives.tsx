import { ArrowRight, Bell, Plus, Search, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Primitives — D3 buttons + chips with all states.
 *
 * Every interactive primitive shows its full state vocabulary explicitly:
 * default / hover / active / focus / disabled. The CSS handles the actual
 * state transitions; the showcase pins them open via `data-state` attrs
 * and explicit hover-class proxies so the reader can see all five at once
 * without driving the cursor across the page.
 *
 * NO `border-radius: 9999px` on this section. Buttons use `--d3-r-sm` (12px),
 * chips use `--d3-r-xs` (6px), and the radio is the only round shape on
 * the page (square 18px circle, not pill).
 */

interface StateLabelProps {
  label: string;
  children: ReactNode;
}

function StateLabel({ label, children }: StateLabelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <span
        style={{
          fontFamily: 'var(--d3-font-mono)',
          fontSize: 10,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--d3-ink-mute)',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export function PrimitivesSection() {
  return (
    <SectionShell
      id="primitives"
      title="Primitives"
      meta="BUTTONS · CHIPS · ALL STATES"
      description="Sculpted, not pill. Hover swaps fill/border in under 200ms; active drops 1px on the y-axis (no scale). Focus draws the chartreuse halo with 3px offset; disabled fades to 0.45 opacity."
    >
      <DsRow label="Button — primary (chartreuse-cream fill)">
        <div className="ds-cluster">
          <StateLabel label="Default">
            <button type="button" className="ds-btn ds-btn--primary">
              Request a session
              <ArrowRight size={16} aria-hidden />
            </button>
          </StateLabel>
          <StateLabel label="Disabled">
            <button type="button" className="ds-btn ds-btn--primary" disabled>
              Request a session
              <ArrowRight size={16} aria-hidden />
            </button>
          </StateLabel>
        </div>
      </DsRow>

      <DsRow label="Button — secondary (hairline border, accent on hover)">
        <div className="ds-cluster">
          <StateLabel label="Default">
            <button type="button" className="ds-btn">
              Open dossier
            </button>
          </StateLabel>
          <StateLabel label="Disabled">
            <button type="button" className="ds-btn" disabled>
              Open dossier
            </button>
          </StateLabel>
        </div>
      </DsRow>

      <DsRow label="Button — ghost (transparent until hover)">
        <div className="ds-cluster">
          <StateLabel label="Default">
            <button type="button" className="ds-btn ds-btn--ghost">
              Skip
            </button>
          </StateLabel>
          <StateLabel label="Disabled">
            <button type="button" className="ds-btn ds-btn--ghost" disabled>
              Skip
            </button>
          </StateLabel>
        </div>
      </DsRow>

      <DsRow label="Button — icon (40×40, hairline border)">
        <div className="ds-cluster">
          <StateLabel label="Default">
            <button type="button" className="ds-btn ds-btn--icon" aria-label="Search">
              <Search size={16} aria-hidden />
            </button>
          </StateLabel>
          <StateLabel label="Default">
            <button type="button" className="ds-btn ds-btn--icon" aria-label="Notifications">
              <Bell size={16} aria-hidden />
            </button>
          </StateLabel>
          <StateLabel label="Default">
            <button type="button" className="ds-btn ds-btn--icon" aria-label="Settings">
              <Settings size={16} aria-hidden />
            </button>
          </StateLabel>
          <StateLabel label="Default">
            <button type="button" className="ds-btn ds-btn--icon" aria-label="Add">
              <Plus size={16} aria-hidden />
            </button>
          </StateLabel>
        </div>
      </DsRow>

      <DsRow label="Chip — filter (sculpted, not pill — radius 6px)">
        <div className="ds-cluster">
          <StateLabel label="Active">
            <button type="button" className="ds-chip ds-chip--active">
              All
            </button>
          </StateLabel>
          <StateLabel label="Default">
            <button type="button" className="ds-chip">
              Engagement
            </button>
          </StateLabel>
          <StateLabel label="Default">
            <button type="button" className="ds-chip">
              Visit
            </button>
          </StateLabel>
          <StateLabel label="Default">
            <button type="button" className="ds-chip">
              Post
            </button>
          </StateLabel>
        </div>
      </DsRow>

      <DsRow label="Chip — premium (bordeaux fill, ink text — RESERVED for highlight)">
        <div className="ds-cluster">
          <StateLabel label="Default">
            <span className="ds-chip ds-chip--premium">Premium</span>
          </StateLabel>
          <StateLabel label="Default">
            <span className="ds-chip ds-chip--premium">Highlight</span>
          </StateLabel>
        </div>
      </DsRow>
    </SectionShell>
  );
}
