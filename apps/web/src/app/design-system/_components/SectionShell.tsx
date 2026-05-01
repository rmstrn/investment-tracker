import type { ReactNode } from 'react';

/**
 * SectionShell — D3 dossier section wrapper.
 *
 * Provides the `<section id>` anchor + sculpted head (title + meta) + body
 * grid. Replaces the v2 `Section` / `DsSection` / `SectionHead` trio with a
 * single component aligned to `apps/web/src/app/design-system/_styles/dossier.css`
 * `.ds-section` class set.
 *
 * The `id` lands on the `<section>` so the side rail anchor links resolve
 * with `scroll-margin-top: 32px` (provided by the .ds-section CSS rule).
 */
export interface SectionShellProps {
  id: string;
  title: string;
  meta?: string;
  description?: ReactNode;
  children: ReactNode;
}

export function SectionShell({ id, title, meta, description, children }: SectionShellProps) {
  return (
    <section id={id} className="ds-section">
      <header className="ds-section__head">
        <h2 className="ds-section__title">{title}</h2>
        {meta ? <p className="ds-section__meta">{meta}</p> : null}
      </header>
      {description ? <p className="ds-prose ds-prose--mute">{description}</p> : null}
      <div className="ds-section__body">{children}</div>
    </section>
  );
}

/**
 * DsRow — small section sub-row with optional uppercase mono label.
 */
export function DsRow({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="ds-row">
      {label ? <p className="ds-row__label">{label}</p> : null}
      {children}
    </div>
  );
}
