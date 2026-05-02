/**
 * Cross-cutting a11y utilities for chart containers.
 *
 * `CHART_FOCUS_RING_CLASS` is the canonical Tailwind class string applied to
 * every focusable chart container. It satisfies CHARTS_SPEC §3.8 + WCAG 2.4.7
 * (Focus Visible) + WCAG 2.4.11 (Focus Appearance) at AA: 2px ring with 2px
 * offset, brand-500 colour, visible against background-primary in both light
 * and dark themes.
 *
 * Implemented via Tailwind's `focus-visible:ring-*` utilities (box-shadow
 * under the hood) rather than CSS `outline` so it composes with Recharts'
 * SVG children without leaking the host outline onto interior nodes.
 */
export const CHART_FOCUS_RING_CLASS =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary';
