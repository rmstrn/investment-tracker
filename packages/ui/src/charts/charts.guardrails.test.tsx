/**
 * Layer C — Runtime guardrails (SLICE-CHARTS-QA-V1).
 *
 * Complements `charts.test.tsx` smoke + a11y-table snapshots with
 * runtime-behavior assertions per QA kickoff §5 Layer C, retargeted by the
 * tech-lead pre-QA audit (`docs/reviews/2026-04-29-charts-pre-qa-techlead-
 * integration-audit.md` finding 4c) — «info-only chip» becomes
 * «mandatory-caption presence» because FE conveys Lane-A guardrails via
 * captions baked into renderers, not via chips.
 *
 * Coverage:
 * 1. axe-core a11y check on Line / Donut / Calendar (the three a11y-priority
 *    components per FE kickoff §7) — zero violations of impact ≥ serious.
 * 2. Keyboard navigation — Esc blurs focused chart container (extends the
 *    existing ArrowRight + Home tests in `charts.test.tsx`).
 * 3. Reduced-motion runtime — when `prefers-reduced-motion: reduce` matches,
 *    bar/line `Bar`/`Line` elements receive `isAnimationActive={false}`. We
 *    assert by inspecting the rendered Recharts surface for the absence of
 *    its in-progress animation class.
 * 4. Mandatory caption presence — Waterfall, Drift Bar, Treemap each render
 *    their fixed Lane-A captions per the renderer-baked contract (Waterfall
 *    §C6, Drift §B8, Treemap T-8 dailyChangeBasis).
 *
 * Test setup mirrors `charts.test.tsx` patterns (happy-dom + Testing Library
 * + Suspense for lazy chart kinds). axe-core runs on the rendered container;
 * we filter to impact ≥ serious because happy-dom does not implement enough
 * of CSSOM for color-contrast checks to be meaningful at jsdom-tier
 * fidelity (Layer B Playwright captures real-browser visual contrast).
 */

import axe, { type AxeResults, type Result } from 'axe-core';
import { fireEvent, render } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  CALENDAR_FIXTURE,
  Calendar,
  DONUT_FIXTURE,
  DonutChart,
  LINE_FIXTURE,
  LineChart,
  TREEMAP_FIXTURE,
  Treemap,
  WATERFALL_FIXTURE,
} from './index';
import { BarChart } from './BarChart';
import { LazyWaterfall } from './lazy';

type SeriousResult = Pick<Result, 'id' | 'impact' | 'description'>;

/**
 * Run axe-core on a DOM node and return only violations of impact
 * `serious` or `critical`. We don't gate on `moderate` / `minor` because
 * jsdom-tier fidelity surfaces false positives there (e.g. CSS variables
 * that resolve at runtime in real browsers but as empty strings in
 * happy-dom). Real-browser contrast / color is owned by Layer B Playwright.
 */
async function runAxe(node: Element): Promise<SeriousResult[]> {
  const results: AxeResults = await axe.run(node, {
    resultTypes: ['violations'],
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  });
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({ id: v.id, impact: v.impact, description: v.description }));
}

describe('Layer C · axe-core a11y on a11y-priority components', () => {
  it('LineChart has zero serious/critical axe violations', async () => {
    const { container } = render(<LineChart payload={LINE_FIXTURE} />);
    const violations = await runAxe(container);
    expect(violations).toEqual([]);
  });

  it('DonutChart has zero serious/critical axe violations', async () => {
    const { container } = render(<DonutChart payload={DONUT_FIXTURE} />);
    const violations = await runAxe(container);
    expect(violations).toEqual([]);
  });

  it('Calendar has zero serious/critical axe violations', async () => {
    const { container } = render(<Calendar payload={CALENDAR_FIXTURE} />);
    const violations = await runAxe(container);
    expect(violations).toEqual([]);
  });
});

describe('Layer C · keyboard navigation — Esc blurs container', () => {
  it('LineChart Escape key blurs the focused chart host', () => {
    const { getByTestId } = render(<LineChart payload={LINE_FIXTURE} />);
    const host = getByTestId('chart-line') as HTMLDivElement;
    host.focus();
    expect(document.activeElement).toBe(host);
    fireEvent.keyDown(host, { key: 'Escape' });
    expect(document.activeElement).not.toBe(host);
  });

  it('DonutChart Escape key blurs the focused chart host', () => {
    const { getByTestId } = render(<DonutChart payload={DONUT_FIXTURE} />);
    const host = getByTestId('chart-donut') as HTMLDivElement;
    host.focus();
    expect(document.activeElement).toBe(host);
    fireEvent.keyDown(host, { key: 'Escape' });
    expect(document.activeElement).not.toBe(host);
  });
});

describe('Layer C · reduced-motion runtime', () => {
  type MatchMediaListener = (event: MediaQueryListEvent) => void;

  let mqlListeners: Set<MatchMediaListener>;
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    mqlListeners = new Set();
    originalMatchMedia = window.matchMedia;
    // Always-true matcher for `(prefers-reduced-motion: reduce)`.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: (_evt: 'change', cb: MatchMediaListener) => mqlListeners.add(cb),
      removeEventListener: (_evt: 'change', cb: MatchMediaListener) => mqlListeners.delete(cb),
      addListener: (cb: MatchMediaListener) => mqlListeners.add(cb), // legacy Safari
      removeListener: (cb: MatchMediaListener) => mqlListeners.delete(cb),
      dispatchEvent: () => true,
    }));
  });

  afterEach(() => {
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  /**
   * Recharts attaches `data-animating="true"` on its animated geometry while
   * a transition is in flight. With `isAnimationActive={false}` (which is
   * what `useReducedMotion()` drives in LineChart, AreaChart, BarChart) the
   * attribute is absent. We assert the absence as a proxy for «no animation
   * is firing» — happy-dom does not run real raf-tweened CSS, so a more
   * direct probe is not available without browser-tier fidelity.
   */
  it('LineChart does not mark Recharts geometry as animating under prefers-reduced-motion', () => {
    const { container } = render(<LineChart payload={LINE_FIXTURE} />);
    const animating = container.querySelectorAll('[data-animating="true"]');
    expect(animating.length).toBe(0);
  });

  it('BarChart does not mark Recharts geometry as animating under prefers-reduced-motion', () => {
    const { container } = render(<BarChart payload={BAR_FIXTURE} />);
    const animating = container.querySelectorAll('[data-animating="true"]');
    expect(animating.length).toBe(0);
  });
});

describe('Layer C · mandatory caption presence (Waterfall §C6 / Drift §B8 / Treemap T-8)', () => {
  it('Waterfall renders the fixed conservation caption', async () => {
    const { findByTestId } = render(
      <Suspense fallback={<div />}>
        <LazyWaterfall payload={WATERFALL_FIXTURE} />
      </Suspense>,
    );
    const caption = await findByTestId('chart-waterfall-caption');
    expect(caption.textContent ?? '').toMatch(/Decomposes change in portfolio value/);
  });

  it('Drift Bar renders the fixed FINRA descriptive caption when isDriftBar is true', () => {
    const { getByTestId } = render(<BarChart payload={BAR_DRIFT_FIXTURE} />);
    const caption = getByTestId('chart-bar-drift-caption');
    expect(caption.textContent ?? '').not.toEqual('');
  });

  it('Drift Bar caption is omitted on a non-drift BarChart fixture', () => {
    const { queryByTestId } = render(<BarChart payload={BAR_FIXTURE} />);
    expect(queryByTestId('chart-bar-drift-caption')).toBeNull();
  });

  it('Treemap renders the dailyChangeBasis (T-8) caption alongside the FINRA descriptor', () => {
    const { getByTestId } = render(<Treemap payload={TREEMAP_FIXTURE} />);
    const text = getByTestId('chart-treemap-caption').textContent ?? '';
    // T-8 cross-currency basis caption — uses «base currency» phrasing per
    // CHARTS_SPEC + finance audit T-8.
    expect(text).toMatch(/base currency/);
    // FINRA descriptor — co-located on the same caption per renderer.
    expect(text).toMatch(/FINRA/);
  });
});
