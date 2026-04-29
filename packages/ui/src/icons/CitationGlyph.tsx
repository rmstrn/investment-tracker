/**
 * CitationGlyph — 4-point sparkle, the «Provedo found this» mark.
 *
 * Per product-designer §2.10 + §6.3 («the moment of \"Provedo found this\" —
 * carries Magician+Sage. No chart library has it; pure Provedo invention.»)
 * Promoted to `packages/ui/src/icons/` since chat already uses it as
 * <ProvedoMark>.
 *
 * Visual: 4-point Lucide-style sparkle, currentColor fill (so series colour /
 * --accent both work transparently). Sized via `size` prop in pixels — chart
 * contexts use 8–12; chat insight pills use 10; chart eyebrow prefix uses 12.
 *
 * No animation here — animation is the consumer's concern (typically a
 * 250ms opacity 0→1 + 0.92→1 scale on appear, gated by reduced-motion via
 * `useReducedMotion`).
 *
 * The path string is the Lucide `sparkle` icon, hand-traced into a single
 * inline `<svg>` to avoid the Lucide React runtime dependency for this
 * single-icon use case (the chart primitives layer treats each runtime byte
 * carefully — Layer 2 budget ≤14kb gz).
 */

import type { CSSProperties } from 'react';

export interface CitationGlyphProps {
  /** Pixel size (renders square). Default 12. */
  size?: number;
  /** Optional aria-label for non-decorative usage. Defaults to decorative. */
  ariaLabel?: string;
  /** Optional className — typically applied to control colour cascade. */
  className?: string;
  /** Inline style passthrough. */
  style?: CSSProperties;
}

/**
 * Lucide `sparkles` four-point glyph (single point per inflection). Path
 * string copied from `lucide-static@0.468.0`, license MIT.
 *
 * The single-point variant (one star, four points) is what the design-system
 * uses; the multi-point Lucide `sparkles` icon has secondary stars that read
 * as decoration. We keep just the primary glyph for clarity at small sizes.
 */
const SPARKLE_PATH =
  'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z';

export function CitationGlyph({ size = 12, ariaLabel, className, style }: CitationGlyphProps) {
  const decorative = !ariaLabel;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role={decorative ? 'presentation' : 'img'}
      aria-label={ariaLabel}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <path d={SPARKLE_PATH} />
    </svg>
  );
}

/**
 * Alias `<ProvedoMark>` for chat / non-chart consumers — same component, brand
 * voice naming. Per product-designer §6.3 («wherever the sparkle appears,
 * Provedo found this for you»).
 */
export const ProvedoMark = CitationGlyph;
