'use client';

import { Avatar, Badge, Button } from '@investment-tracker/ui';
import { ArrowRight, Plus, Search, Settings } from 'lucide-react';
import { DsRow, DsSection } from '../_components/SectionHead';

/**
 * §Primitives — curated permutations matching the static reference.
 *
 * Two main groups:
 *   1. Buttons — primary × 3 sizes + disabled, secondary × 2 sizes, ghost,
 *      danger, 5 icon variants (Add / Search / Settings / Filter / Continue).
 *   2. Chips + badges — ink filter, jade verified, bronze warning, neutrals.
 *
 * Form fields (input + switch + checkbox + radio) live in §Forms — they need
 * a separate stage-context render anchored on real Provedo copy.
 *
 * Icon button is a showcase-only visual class (`.showcase-btn-icon`) until
 * Phase γ promotes a real `IconButton` primitive.
 */

export interface PrimitivesSectionProps {
  variant: 'light' | 'dark';
}

export function PrimitivesSection({ variant }: PrimitivesSectionProps) {
  return (
    <>
      <DsSection title="Buttons" meta="primary = ink (not green)">
        <DsRow label="Primary CTA — ink extruded">
          <div className="showcase-flex-wrap">
            <Button variant="primary" size="sm">
              Get early access
            </Button>
            <Button variant="primary" size="md">
              Get early access
            </Button>
            <Button variant="primary" size="lg">
              Get early access
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </DsRow>
        <DsRow label="Secondary — outlined">
          <div className="showcase-flex-wrap">
            <Button variant="secondary">Watch demo</Button>
            <Button variant="secondary" size="lg">
              Watch demo
            </Button>
            <Button variant="outline">Outline</Button>
          </div>
        </DsRow>
        <DsRow label="Ghost · danger · icon">
          <div className="showcase-flex-wrap">
            <Button variant="ghost">Skip →</Button>
            <Button variant="destructive">Delete</Button>
            <IconButton ariaLabel="Add">
              <Plus size={18} aria-hidden />
            </IconButton>
            <IconButton ariaLabel="Search">
              <Search size={18} aria-hidden />
            </IconButton>
            <IconButton ariaLabel="Settings">
              <Settings size={18} aria-hidden />
            </IconButton>
            <IconButton ariaLabel="Continue" primary>
              <ArrowRight size={18} aria-hidden />
            </IconButton>
          </div>
        </DsRow>
      </DsSection>

      <DsSection title="Chips · badges" meta="ink-primary · forest-status · bronze-warning">
        <div className="showcase-flex-wrap">
          <Badge>Default</Badge>
          <Badge tone="positive">Verified</Badge>
          <Badge tone="warning">Drift +3.2%</Badge>
          <Badge tone="info">Crypto</Badge>
          <Badge>7 brokers</Badge>
          <Badge tone="negative">Lane A</Badge>
        </div>
      </DsSection>

      <DsSection
        title="Avatars"
        meta={variant === 'light' ? 'ink primary · status dot' : 'cream gradient'}
      >
        <div className="showcase-flex-wrap" style={{ gap: 18 }}>
          <Avatar fallback="RM" />
          <Avatar fallback="PR" size="sm" />
          <Avatar fallback="AI" size="lg" />
        </div>
      </DsSection>
    </>
  );
}

/**
 * IconButton — showcase-only circular icon button. Phase γ promotes to a real
 * primitive in `packages/ui`. Visual contract:
 *   default: 40×40 circle, var(--inset) bg, var(--shadow-inset-light), text-2 ink
 *   primary: var(--ink) bg, var(--card) ink, var(--shadow-primary-extrude)
 */
function IconButton({
  ariaLabel,
  primary,
  children,
}: {
  ariaLabel: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`showcase-btn-icon${primary ? ' showcase-btn-icon--primary' : ''}`}
    >
      {children}
    </button>
  );
}
