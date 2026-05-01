import type { ReactNode } from 'react';

/**
 * SectionHead — `.ds-section .head` ports from the static reference.
 *
 * Renders an `<h3>` headline with right-aligned mono "meta" chip. Used inside
 * each `<StageFrame>` to introduce a sub-section (Color tokens, Typography,
 * Buttons, etc.). Visual contract: 22px Geist semibold + 10px Geist Mono
 * uppercase letterspaced + 1px dotted divider underneath.
 */
export interface SectionHeadProps {
  title: string;
  meta?: string;
  children?: ReactNode;
}

export function SectionHead({ title, meta, children }: SectionHeadProps) {
  return (
    <div className="showcase-ds-section__head">
      <h3 className="showcase-ds-section__title">{title}</h3>
      {meta ? <span className="showcase-ds-section__meta">{meta}</span> : null}
      {children}
    </div>
  );
}

/**
 * DsSection — wrapper applying the section bottom-margin + `.head` divider
 * pattern from the static reference. Section content (`children`) sits below
 * the head with a 20px gap.
 */
export interface DsSectionProps {
  title: string;
  meta?: string;
  children: ReactNode;
}

export function DsSection({ title, meta, children }: DsSectionProps) {
  return (
    <div className="showcase-ds-section">
      <SectionHead title={title} meta={meta} />
      {children}
    </div>
  );
}

/**
 * DsRow — small section sub-row with optional uppercase mono label.
 * Mirrors `.ds-row` + `.ds-row-label` from the static reference.
 */
export function DsRow({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="showcase-ds-row">
      {label ? <p className="showcase-ds-row__label">{label}</p> : null}
      {children}
    </div>
  );
}
