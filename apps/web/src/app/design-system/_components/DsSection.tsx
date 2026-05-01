import type { ReactNode } from 'react';

/**
 * `DsSection` — outer wrapper for every design-system section under the
 * D1 «Lime Cabin» rebuild. Pairs a sticky scroll-anchor with a section
 * card lifted on `--d1-bg-surface`. The section title is the page's
 * primary outline (matches the side-nav anchors), the lede is one
 * sentence on intent.
 */
export interface DsSectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children: ReactNode;
}

export function DsSection({ id, eyebrow, title, lede, children }: DsSectionProps) {
  return (
    <section id={id} className="ds-section" aria-labelledby={`${id}-title`}>
      {eyebrow ? (
        <p
          style={{
            fontFamily: 'var(--d1-font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--d1-text-muted)',
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 id={`${id}-title`} className="ds-section__title">
        {title}
      </h2>
      {lede ? <p className="ds-section__lede">{lede}</p> : null}
      {children}
    </section>
  );
}

/**
 * `DsRow` — sub-row inside a section, with optional uppercase mono label.
 */
export function DsRow({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="ds-row">
      {label ? <p className="ds-row__label">{label}</p> : null}
      {children}
    </div>
  );
}

/**
 * `DsCallout` — small lime-headed note for anti-pattern + rule callouts.
 */
export function DsCallout({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="ds-callout">
      <p className="ds-callout__heading">{heading}</p>
      <p className="ds-callout__body">{children}</p>
    </div>
  );
}
