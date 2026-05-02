import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { COMPACT_COPY, FULL_DISCLAIMER_PATH, type Lang, VERBOSE_COPY, type Variant } from './copy';

export interface RegulatoryDisclaimerProps extends HTMLAttributes<HTMLElement> {
  /**
   * - `compact` — sticky-footer two-line summary. Carries the cross-market
   *   floor (top-3 critical legal statements + EU/UK explicit «not
   *   personalized» phrasing) and links to `/legal/disclaimer`.
   * - `verbose` — full page rendering of all 7 legal floor statements.
   */
  variant: Variant;
  /** Active locale. Defaults to `'en'`. */
  lang?: Lang;
  /**
   * Optional href override for the «Read full disclaimer →» link in the
   * compact variant. Defaults to {@link FULL_DISCLAIMER_PATH}.
   */
  fullDisclaimerHref?: string;
}

/**
 * RegulatoryDisclaimer — Lane-A page-level regulatory disclaimer (TD-100).
 *
 * Two render variants share copy + landmark structure:
 * - `compact` mounts in `(app)/layout.tsx` last grid-row (NOT `position:
 *   fixed`); covers all 7 chart-bearing app routes from a single mount.
 * - `verbose` mounts on `/legal/disclaimer` and renders the full 7-paragraph
 *   floor.
 *
 * Per synthesis §«WCAG AA contrast block-ship — token decision», body uses
 * `--text-secondary` (already AA-compliant in both light and dark) — NOT
 * `--text-tertiary` which fails AA at 4.06:1.
 *
 * Spec: `docs/reviews/2026-04-29-td100-disclaimer-synthesis.md`.
 */
export function RegulatoryDisclaimer({
  variant,
  lang = 'en',
  fullDisclaimerHref = FULL_DISCLAIMER_PATH,
  className,
  ...rest
}: RegulatoryDisclaimerProps) {
  if (variant === 'compact') {
    const copy = COMPACT_COPY[lang];
    return (
      <footer
        role="contentinfo"
        aria-label={copy.ariaLabel}
        lang={lang}
        className={cn(
          // Surface separated from main content by hairline border, no shadow
          // — should not compete visually with charts/data.
          'border-t border-border-subtle bg-background-secondary',
          // Tight vertical rhythm; horizontal padding tracks AppShell main.
          'px-4 py-3 sm:px-6 md:px-8',
          // Body copy uses AA-compliant secondary token (4.5:1+ light/dark).
          'text-xs text-text-secondary leading-relaxed sm:text-sm',
          // Visible in print (regulatory requirement).
          'print:bg-transparent print:text-black',
          className,
        )}
        {...rest}
      >
        <p className="mx-auto max-w-[1280px]">
          <span>{copy.body}</span>{' '}
          <a
            href={fullDisclaimerHref}
            className={cn(
              'inline-flex items-baseline gap-0.5 font-medium underline-offset-2',
              'text-text-primary hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:rounded-sm',
            )}
          >
            <span>{copy.linkLabel}</span>
            <span aria-hidden="true">{' →'}</span>
          </a>
        </p>
      </footer>
    );
  }

  const copy = VERBOSE_COPY[lang];
  return (
    <section
      role="contentinfo"
      aria-label={copy.ariaLabel}
      lang={lang}
      className={cn('mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 md:py-14', className)}
      {...rest}
    >
      <h1 className="font-semibold text-2xl text-text-primary md:text-3xl">{copy.heading}</h1>
      <div className="mt-6 space-y-4 text-base text-text-secondary leading-relaxed">
        {copy.paragraphs.map((paragraph, index) => (
          // Static paragraph list — index is stable.
          // biome-ignore lint/suspicious/noArrayIndexKey: static legal copy array
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
