import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartesianFrame } from '../CartesianFrame';

function renderInSvg(content: React.ReactNode) {
  return render(
    <svg aria-label="test" role="img">
      <title>test</title>
      {content}
    </svg>,
  );
}

describe('<CartesianFrame>', () => {
  it('renders <g> with translate(margin.left, margin.top)', () => {
    const { container } = renderInSvg(
      <CartesianFrame
        width={400}
        height={200}
        margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
      >
        {() => <rect width="10" height="10" />}
      </CartesianFrame>,
    );
    const g = container.querySelector('g[data-testid="cartesian-frame"]');
    expect(g).not.toBeNull();
    expect(g?.getAttribute('transform')).toBe('translate(40,10)');
  });

  it('passes correct innerWidth/innerHeight to render-prop children', () => {
    let receivedDims: { innerWidth: number; innerHeight: number } | null = null;
    renderInSvg(
      <CartesianFrame
        width={400}
        height={200}
        margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
      >
        {(dims) => {
          receivedDims = dims;
          return null;
        }}
      </CartesianFrame>,
    );
    expect(receivedDims).toEqual({ innerWidth: 340, innerHeight: 160 });
  });

  it('applies filterId via filter attribute when supplied', () => {
    const { container } = renderInSvg(
      <CartesianFrame
        width={100}
        height={100}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        filterId="my-filter-id"
      >
        {() => null}
      </CartesianFrame>,
    );
    const g = container.querySelector('g[data-testid="cartesian-frame"]');
    expect(g?.getAttribute('filter')).toBe('url(#my-filter-id)');
  });

  it('omits filter attribute when filterId not supplied', () => {
    const { container } = renderInSvg(
      <CartesianFrame
        width={100}
        height={100}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {() => null}
      </CartesianFrame>,
    );
    const g = container.querySelector('g[data-testid="cartesian-frame"]');
    expect(g?.getAttribute('filter')).toBeNull();
  });
});
