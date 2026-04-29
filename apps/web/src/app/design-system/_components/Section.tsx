import type { ReactNode } from 'react';

/**
 * Section — standard `/design-system` section frame.
 *
 * Renders an `<section>` landmark with a sticky-anchor scroll offset, an
 * eyebrow + title + optional description, and a slot for the demo content.
 * All sections share the same vertical rhythm to keep the showcase legible.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-6">
      <div className="space-y-1.5">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: 'var(--accent, var(--color-accent-default, #2d5f4e))',
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </p>
        <h2
          id={`${id}-title`}
          className="font-semibold tracking-tight text-text-primary"
          style={{ fontSize: '28px', letterSpacing: '-0.025em', lineHeight: 1.1 }}
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-sm text-text-secondary" style={{ lineHeight: 1.55 }}>
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/**
 * SubBlock — sub-row inside a Section (e.g. "Primary buttons" inside §Buttons).
 */
export function SubBlock({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold tracking-tight text-text-primary" style={{ fontSize: '15px' }}>
          {title}
        </h3>
        {meta ? (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'var(--text-3, var(--color-text-tertiary))',
            }}
          >
            {meta}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
