import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ReferenceLine } from '../ReferenceLine';

function renderInSvg(content: ReactNode) {
  return render(
    <svg aria-label="test" role="img">
      <title>test</title>
      {content}
    </svg>,
  );
}

describe('<ReferenceLine>', () => {
  it('renders 2 stacked <line> elements (embossed groove)', () => {
    const { container } = renderInSvg(
      <ReferenceLine
        orientation="horizontal"
        position={50}
        innerWidth={200}
        innerHeight={100}
      />,
    );
    const lines = container.querySelectorAll('line[data-testid^="ref-line-"]');
    expect(lines).toHaveLength(2);
  });

  it('first line at position uses ink-shadow-soft fallback color', () => {
    const { container } = renderInSvg(
      <ReferenceLine
        orientation="horizontal"
        position={50}
        innerWidth={200}
        innerHeight={100}
      />,
    );
    const inkLine = container.querySelector('line[data-testid="ref-line-ink"]');
    expect(inkLine?.getAttribute('y1')).toBe('50');
    expect(inkLine?.getAttribute('y2')).toBe('50');
    expect(inkLine?.getAttribute('stroke')).toContain('var(--ink-shadow-soft');
  });

  it('second line at position+1 uses card-highlight fallback color', () => {
    const { container } = renderInSvg(
      <ReferenceLine
        orientation="horizontal"
        position={50}
        innerWidth={200}
        innerHeight={100}
      />,
    );
    const highlightLine = container.querySelector('line[data-testid="ref-line-highlight"]');
    expect(highlightLine?.getAttribute('y1')).toBe('51');
    expect(highlightLine?.getAttribute('y2')).toBe('51');
    expect(highlightLine?.getAttribute('stroke')).toContain('var(--card-highlight');
  });

  it('vertical orientation swaps x1/x2', () => {
    const { container } = renderInSvg(
      <ReferenceLine
        orientation="vertical"
        position={75}
        innerWidth={200}
        innerHeight={100}
      />,
    );
    const inkLine = container.querySelector('line[data-testid="ref-line-ink"]');
    expect(inkLine?.getAttribute('x1')).toBe('75');
    expect(inkLine?.getAttribute('x2')).toBe('75');
    expect(inkLine?.getAttribute('y1')).toBe('0');
    expect(inkLine?.getAttribute('y2')).toBe('100');
  });

  it('renders label <text> when provided', () => {
    const { container } = renderInSvg(
      <ReferenceLine
        orientation="horizontal"
        position={50}
        innerWidth={200}
        innerHeight={100}
        label={{ text: 'BASELINE', align: 'end' }}
      />,
    );
    const text = container.querySelector('text[data-testid="ref-line-label"]');
    expect(text).not.toBeNull();
    expect(text?.textContent).toBe('BASELINE');
  });

  it('omits label <text> when label prop missing', () => {
    const { container } = renderInSvg(
      <ReferenceLine
        orientation="horizontal"
        position={50}
        innerWidth={200}
        innerHeight={100}
      />,
    );
    const text = container.querySelector('text[data-testid="ref-line-label"]');
    expect(text).toBeNull();
  });
});
