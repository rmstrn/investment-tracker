/**
 * Vitest tests for `<SparklineV2>` — primitives-backed sparkline (β.1.2).
 *
 * Coverage:
 *   - Renders an SVG with preserveAspectRatio="none" (Pattern 7 stretch).
 *   - Generates a valid SVG path d attribute starting with M.
 *   - Renders a ChartDataTable for the payload (transcript).
 *   - Default mode is aria-hidden + non-focusable (CHARTS_SPEC §4.5).
 *   - Standalone mode opts in to role=img + tabIndex 0 + aria-label.
 *   - Filled variant renders a <linearGradient> + filled <path>.
 *   - data-trend attribute reflects the resolved trend.
 *   - Honours payload.trend override (forces flat / down / up colour).
 */

import { SPARKLINE_FIXTURE } from '../_shared/fixtures';
import type { SparklinePayload } from '@investment-tracker/shared-types/charts';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SparklineV2 } from '../SparklineV2';

function buildSparklinePayload(overrides: Partial<SparklinePayload> = {}): SparklinePayload {
  return { ...SPARKLINE_FIXTURE, ...overrides };
}

describe('<SparklineV2>', () => {
  it('renders an SVG with preserveAspectRatio="none" (Pattern 7)', () => {
    const { container } = render(<SparklineV2 payload={SPARKLINE_FIXTURE} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('none');
  });

  it('renders a path with a valid d attribute starting with M', () => {
    const { container } = render(<SparklineV2 payload={SPARKLINE_FIXTURE} />);
    const path = container.querySelector('path');
    expect(path?.getAttribute('d')?.startsWith('M')).toBe(true);
  });

  it('default is aria-hidden (non-standalone)', () => {
    const { getByTestId } = render(<SparklineV2 payload={SPARKLINE_FIXTURE} />);
    const host = getByTestId('chart-sparkline');
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('tabindex')).toBeNull();
  });

  it('standalone={true} opts in to role=img + aria-label + tabIndex 0', () => {
    const { getByTestId } = render(
      <SparklineV2 payload={SPARKLINE_FIXTURE} standalone />,
    );
    const host = getByTestId('chart-sparkline');
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toMatch(/Portfolio · 7d sparkline/);
    expect(host.getAttribute('tabindex')).toBe('0');
  });

  it('renders a ChartDataTable transcript with .sr-only', () => {
    const { container } = render(<SparklineV2 payload={SPARKLINE_FIXTURE} />);
    const transcript = container.querySelector('.sr-only');
    expect(transcript).not.toBeNull();
    // ChartDataTable renders a prose summary (not <table>) for sparkline kind.
    // Verify the trend prose surfaces inside the transcript.
    expect(transcript?.textContent ?? '').toMatch(/Sparkline trend/i);
  });

  it('exposes data-trend reflecting the resolved trend', () => {
    const { getByTestId } = render(<SparklineV2 payload={SPARKLINE_FIXTURE} />);
    expect(getByTestId('chart-sparkline').getAttribute('data-trend')).toBe('up');
  });

  it('honours payload.trend="down" override', () => {
    const payload = buildSparklinePayload({ trend: 'down' });
    const { getByTestId } = render(<SparklineV2 payload={payload} />);
    expect(getByTestId('chart-sparkline').getAttribute('data-trend')).toBe('down');
  });

  it('filled variant renders a <linearGradient> + a filled path', () => {
    const payload = buildSparklinePayload({ filled: true });
    const { container } = render(<SparklineV2 payload={payload} />);
    expect(container.querySelector('linearGradient')).not.toBeNull();
    // Filled path has fill="url(#…)"; line path has stroke + fill="none".
    const filledPaths = Array.from(container.querySelectorAll('path')).filter((p) =>
      (p.getAttribute('fill') ?? '').startsWith('url('),
    );
    expect(filledPaths.length).toBeGreaterThan(0);
  });

  it('data-chart-backend marks the primitives implementation', () => {
    const { getByTestId } = render(<SparklineV2 payload={SPARKLINE_FIXTURE} />);
    expect(getByTestId('chart-sparkline').getAttribute('data-chart-backend')).toBe('primitives');
  });
});
