// Sources — system typographic primitive for source-citation chrome (Slice-LP3.5)
//
// Brand-strategist verdict 2026-04-27 (D-prime spec): receipt-chrome is the
// load-bearing visual primitive for Provedo. Every observational claim that
// surfaces on the landing carries a Sources line in the SAME treatment, so
// the cite-trail reads as a system, not as a per-component decoration.
//
// Brand-voice review 2026-04-27 §3.1: «highest ROI of CD's smaller proposals».
//
// Visual contract:
// - Italic, 12-13pt, slate-tertiary text
// - Dotted top-rule (1px slate-300, 4px gap) above the line
// - Eyebrow «Sources» in JBM-mono small-caps, then items joined with «·»
// - Compositor-friendly: no animation on this primitive itself; callers may
//   wrap in a fade-in container.
//
// Voice rules:
// - «Sources» eyebrow is fixed copy. Do NOT translate or paraphrase.
// - Items must be specific (date + source name). Avoid generic «public sources».
// - For pre-alpha cohort references: drop sample-size citations (n=24 etc.) per
//   brand-voice §6 REJECT — manifesto-with-citations is performative-Sage drift.

import type { CSSProperties, ReactElement } from 'react';

interface SourcesProps {
  /** Plain string sources joined with `·`. */
  items: ReadonlyArray<string>;
  /**
   * Optional theme override. `dark` uses lighter slate text on dark
   * surfaces (S6 editorial / S7 dark cards). Default: `light`.
   */
  theme?: 'light' | 'dark';
  /** Optional className for layout (margin, max-width). */
  className?: string;
}

const BASE_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: 1.55,
  margin: 0,
  paddingTop: '8px',
  // Dotted top-rule (1px slate-300, 4px gap) — receipt-chrome signature.
  borderTop: '1px dotted',
};

const EYEBROW_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginRight: '6px',
};

export function Sources({ items, theme = 'light', className }: SourcesProps): ReactElement | null {
  if (items.length === 0) return null;

  const containerStyle: CSSProperties = {
    ...BASE_STYLE,
    color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'var(--provedo-text-tertiary)',
    borderTopColor:
      theme === 'dark' ? 'rgba(203, 213, 225, 0.25)' : 'var(--provedo-border-default)',
  };

  const eyebrowStyle: CSSProperties = {
    ...EYEBROW_STYLE,
    color: theme === 'dark' ? 'rgba(45, 212, 191, 0.85)' : 'var(--provedo-text-secondary)',
  };

  return (
    <p
      data-testid="provedo-sources"
      className={className}
      style={containerStyle}
      aria-label="Sources for the preceding observation"
    >
      <span style={eyebrowStyle}>Sources</span>
      <span>{items.join(' · ')}</span>
    </p>
  );
}
