import type { ReactNode } from 'react';

/**
 * StageFrame — bordered-stage anchor for the showcase.
 *
 * The static reference (`apps/web/public/design-system.html`) renders both
 * light and dark theme variants stacked vertically, each inside a bordered
 * "stage" with asymmetric padding (`36px 40px 44px`) and a 2px solid
 * `var(--ink)` rule under the stage head. Replicates that here for the React
 * showcase.
 *
 * Theme is scoped via `data-theme="light" | "dark"` on the stage root. Because
 * the design-tokens build emits dark overrides under `.dark, [data-theme="dark"]`,
 * setting the attribute at the stage level flips ALL CSS-custom-property
 * tokens (`--ink`, `--card`, `--accent`, `--chart-series-N`, etc.) within the
 * stage subtree without remount and without disturbing the outer page theme.
 */

export interface StageFrameProps {
  variant: 'light' | 'dark';
  /** Eyebrow label (e.g. `PROVEDO · DESIGN SYSTEM v2 · LIGHT`). */
  eyebrow: string;
  /** Headline tagline; the word inside `accentWord` is rendered bold (no color shift). */
  headline: string;
  accentWord: string;
  /** Right-aligned meta lines. */
  meta: ReactNode;
  children: ReactNode;
  id?: string;
}

export function StageFrame({
  variant,
  eyebrow,
  headline,
  accentWord,
  meta,
  children,
  id,
}: StageFrameProps) {
  const beforeAccent = headline.split(accentWord)[0] ?? '';
  const afterAccent = headline.slice(beforeAccent.length + accentWord.length);
  return (
    <section
      id={id}
      data-theme={variant}
      className={`showcase-stage-v2 showcase-stage-v2--${variant}`}
      aria-label={`Provedo Design System v2 — ${variant === 'light' ? 'Light' : 'Dark'} theme`}
    >
      <header className="showcase-stage-v2__head">
        <div>
          <p className="showcase-stage-v2__eyebrow">{eyebrow}</p>
          <h2 className="showcase-stage-v2__headline">
            {beforeAccent}
            <span className="showcase-stage-v2__headline-accent">{accentWord}</span>
            {afterAccent}
          </h2>
        </div>
        <div className="showcase-stage-v2__meta">{meta}</div>
      </header>
      <div className="showcase-stage-v2__body">{children}</div>
    </section>
  );
}
