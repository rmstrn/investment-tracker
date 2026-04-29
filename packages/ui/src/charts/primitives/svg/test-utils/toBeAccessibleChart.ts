/**
 * Vitest custom matcher — `toBeAccessibleChart`.
 *
 * Asserts that a rendered chart container satisfies the pre-QA a11y baseline
 * structurally:
 *   - has `role="img"`
 *   - has non-empty `aria-label`
 *   - has `aria-describedby` referencing a `<ChartDataTable>` (visually-hidden
 *     `.sr-only` element with matching id)
 *   - has `tabIndex` 0 (interactive nav) or -1 (opted-out, but still valid)
 *   - has the canonical focus-ring class (`focus-visible:ring-*`)
 *
 * Run inside chart-kind tests: `expect(container).toBeAccessibleChart()`.
 *
 * Per a11y-architect Direction 4 (Test-driven gating). The matcher is the
 * merge-gate that catches regressions even when a primitive's API allows
 * silent escape (e.g. consumer passes empty `ariaLabel`).
 */

import { expect } from 'vitest';

interface MatcherResult {
  pass: boolean;
  message: () => string;
}

interface AccessibleChartCheck {
  ok: boolean;
  reason?: string;
}

function findChartContainer(received: unknown): HTMLElement | null {
  if (received instanceof HTMLElement) {
    if (received.getAttribute('role') === 'img') return received;
    return received.querySelector<HTMLElement>('[role="img"]');
  }
  if (received && typeof received === 'object' && 'querySelector' in received) {
    const root = received as { querySelector: (sel: string) => HTMLElement | null };
    return root.querySelector('[role="img"]');
  }
  return null;
}

function checkAccessibleChart(received: unknown): AccessibleChartCheck {
  const node = findChartContainer(received);
  if (!node) {
    return { ok: false, reason: 'no element with role="img" found' };
  }

  const ariaLabel = node.getAttribute('aria-label');
  if (!ariaLabel || !ariaLabel.trim()) {
    return { ok: false, reason: 'role="img" element missing non-empty aria-label' };
  }

  const describedBy = node.getAttribute('aria-describedby');
  if (!describedBy) {
    return { ok: false, reason: 'role="img" element missing aria-describedby' };
  }

  // Resolve the described element. `getElementById` works in happy-dom + jsdom.
  const describedNode = node.ownerDocument?.getElementById(describedBy);
  if (!describedNode) {
    return {
      ok: false,
      reason: `aria-describedby="${describedBy}" did not resolve to a node in the document`,
    };
  }
  if (!describedNode.classList.contains('sr-only')) {
    return {
      ok: false,
      reason: `aria-describedby target "${describedBy}" is not visually-hidden (missing .sr-only)`,
    };
  }

  const tabIndexAttr = node.getAttribute('tabindex');
  if (tabIndexAttr !== '0' && tabIndexAttr !== '-1') {
    return {
      ok: false,
      reason: `role="img" element has tabIndex="${tabIndexAttr ?? '(missing)'}" — expected 0 or -1`,
    };
  }

  const className = node.getAttribute('class') ?? '';
  if (!className.includes('focus-visible:ring-')) {
    return {
      ok: false,
      reason: 'role="img" element missing focus-visible:ring-* class (CHART_FOCUS_RING_CLASS)',
    };
  }

  return { ok: true };
}

/**
 * Internal export so tests can call the check directly without the matcher
 * indirection (useful for narrowing failures during debugging).
 */
export { checkAccessibleChart };

expect.extend({
  toBeAccessibleChart(received: unknown): MatcherResult {
    const result = checkAccessibleChart(received);
    if (result.ok) {
      return {
        pass: true,
        message: () => 'expected element NOT to be an accessible chart, but it was',
      };
    }
    return {
      pass: false,
      message: () => `expected element to be an accessible chart, but ${result.reason}`,
    };
  },
});

/* ────────────────────────────────────────────────────────────────────── */
/* TypeScript ambient augmentation                                         */
/* ────────────────────────────────────────────────────────────────────── */

declare module 'vitest' {
  interface Assertion {
    toBeAccessibleChart(): void;
  }
  interface AsymmetricMatchersContaining {
    toBeAccessibleChart(): void;
  }
}
