'use client';

/**
 * Tooltip — portal-based, per-chart instance.
 *
 * Per aggregate decision #6 («Portal per-chart instance — escape
 * `overflow:hidden` parent / `border-radius` clip; per-instance avoids
 * ECharts flicker when tooltip moves between charts») and product-designer
 * §2.8 («--card 90% alpha + backdrop-filter: blur(10px) + --shadow-lift +
 * cream top-edge highlight + Geist Mono eyebrow row + Geist body»).
 *
 * Rejected anti-pattern: single global tooltip portal (flicker between
 * charts). This primitive mounts on focus/hover and unmounts on blur —
 * per-instance lifecycle, predictable React tree, no DOM ownership war.
 *
 * Edge-clamping: when the tooltip would overflow the right viewport edge,
 * it flips to position to the LEFT of the cursor; when it would overflow
 * the bottom, it flips to ABOVE.
 */

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  /** Whether the tooltip is currently visible. Caller controls via focus / hover. */
  open: boolean;
  /** Cursor / anchor x in viewport (clientX) coordinates. */
  clientX: number;
  /** Cursor / anchor y in viewport (clientY) coordinates. */
  clientY: number;
  /**
   * Pixel offset from the anchor. Default `{ x: 12, y: 12 }` — keeps tooltip
   * out from under cursor without feeling detached.
   */
  offset?: { x: number; y: number };
  /** Tooltip body. Caller composes Geist Mono eyebrow + Geist body inside. */
  children: ReactNode;
  /**
   * Test-id passed through for QA selectors (defaults to `chart-tooltip`).
   */
  testId?: string;
}

/**
 * Computed display position. After edge-clamping the tooltip may flip to the
 * left or top of the anchor — caller doesn't see this; only the final pixel
 * coordinates matter.
 */
interface ResolvedPosition {
  readonly left: number;
  readonly top: number;
  /**
   * Whether the tooltip flipped horizontally (right→left) to avoid the
   * viewport edge. Exposed via data attribute for QA / debugging.
   */
  readonly flippedX: boolean;
  /** Vertical flip (bottom→top). */
  readonly flippedY: boolean;
}

/**
 * Approximate tooltip size for clamp math — used as a fallback before the
 * real measurement is available on the second render. The product-designer
 * spec caps `max-width: 220px`; height is ~80px for a typical eyebrow + value
 * + delta layout. These are bounds for the clamp decision, not visual
 * constants.
 */
const FALLBACK_SIZE = { width: 220, height: 80 };

function clampToViewport(
  anchorX: number,
  anchorY: number,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
): ResolvedPosition {
  let left = anchorX + offsetX;
  let top = anchorY + offsetY;
  let flippedX = false;
  let flippedY = false;

  // Right-edge: flip to left of cursor when the tooltip would overflow.
  if (left + width > viewportWidth) {
    left = anchorX - offsetX - width;
    flippedX = true;
  }
  // Bottom-edge: flip above cursor when overflow.
  if (top + height > viewportHeight) {
    top = anchorY - offsetY - height;
    flippedY = true;
  }
  // Final guard against negative left / top after flip on tiny viewports.
  if (left < 0) left = 0;
  if (top < 0) top = 0;

  return { left, top, flippedX, flippedY };
}

const TOOLTIP_STYLE: CSSProperties = {
  position: 'fixed',
  zIndex: 1000,
  pointerEvents: 'none',
  // Brand: --card with 90% alpha + backdrop blur per product-designer §2.8.
  background: 'rgba(var(--card-rgb, 255 255 255) / 0.90)',
  backdropFilter: 'blur(10px) saturate(120%)',
  WebkitBackdropFilter: 'blur(10px) saturate(120%)',
  boxShadow: 'var(--shadow-lift, 0 12px 32px rgba(20,20,20,0.18))',
  borderRadius: 12,
  padding: '12px 14px',
  maxWidth: 220,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--ink, #1A1A1A)',
  // Cream top-edge highlight (atom A on the tooltip — paper-edge feel).
  border: '1px solid var(--border, rgba(20,20,20,0.10))',
  borderTop: '1px solid var(--card, #FFFFFF)',
};

export function Tooltip({
  open,
  clientX,
  clientY,
  offset = { x: 12, y: 12 },
  children,
  testId = 'chart-tooltip',
}: TooltipProps) {
  // Defer portal target resolution until mount — happy-dom / SSR safe.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    setPortalTarget(document.body);
  }, []);

  if (!open || !portalTarget) return null;

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 720;

  const resolved = clampToViewport(
    clientX,
    clientY,
    offset.x,
    offset.y,
    FALLBACK_SIZE.width,
    FALLBACK_SIZE.height,
    viewportWidth,
    viewportHeight,
  );

  return createPortal(
    <div
      role="tooltip"
      data-testid={testId}
      data-flipped-x={resolved.flippedX || undefined}
      data-flipped-y={resolved.flippedY || undefined}
      style={{
        ...TOOLTIP_STYLE,
        left: resolved.left,
        top: resolved.top,
      }}
    >
      {children}
    </div>,
    portalTarget,
  );
}

/**
 * Internal helper exposed for tests — the clamp math is the most regression-
 * prone part of the primitive. Keep it pure + side-effect free.
 */
export { clampToViewport };
