/**
 * Shared SVG filter primitives for the chart subsystem.
 *
 * Currently exports:
 *   - <EditorialBevelFilter> — H3 specular bevel + paper-press shadow.
 *     Used by DonutChartV2 (categorical / sequential / monochromatic
 *     palettes — applied palette-agnostically on the slice container <g>).
 *
 * Spec: docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md §2.
 */

import type { JSX } from 'react';

export interface EditorialBevelFilterProps {
  /** Caller-owned unique id; used as `<filter id={id}>` and target of `filter={url(#id)}`. */
  id: string;
  /** Active theme; H3 stack uses different lighting + paper-press values per theme. */
  theme: 'light' | 'dark';
}

interface ThemeConstants {
  lightingColor: string;
  specularConstant: string;
  slope: string;
}

const LIGHT: ThemeConstants = {
  lightingColor: '#ffffff',
  specularConstant: '1.1',
  slope: '0.32',
};

const DARK: ThemeConstants = {
  lightingColor: '#F4F1EA',
  specularConstant: '1.0',
  slope: '0.55',
};

/**
 * H3 specular-bevel + paper-press SVG filter.
 *
 * Render once per chart instance, at the top of <svg>, before <defs> for
 * gradients. Apply via `filter={url(#id)}` on the slice container <g> —
 * never on individual paths/circles (one filter region per donut, not N).
 *
 * Theme awareness: only filter primitive constants (specular lighting-color,
 * paper-press slope) differ across themes. Slice fill colors are CSS-var-
 * driven and switch via the `<html data-theme>` cascade — no JS re-render
 * for the fills.
 */
export function EditorialBevelFilter({ id, theme }: EditorialBevelFilterProps): JSX.Element {
  const c = theme === 'dark' ? DARK : LIGHT;
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feSpecularLighting
          in="blur"
          surfaceScale="5"
          specularConstant={c.specularConstant}
          specularExponent="22"
          lighting-color={c.lightingColor}
          result="specOut"
        >
          <feDistantLight azimuth="225" elevation="55" />
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="litMasked" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="paperBlur" />
        <feOffset in="paperBlur" dx="0" dy="6" result="paperOffset" />
        <feComponentTransfer in="paperOffset" result="paperShadow">
          <feFuncA type="linear" slope={c.slope} />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="paperShadow" />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="litMasked" />
        </feMerge>
      </filter>
    </defs>
  );
}
