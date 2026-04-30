import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EditorialBevelFilter } from '../filters';

describe('<EditorialBevelFilter>', () => {
  it('renders <filter id> matching the id prop', () => {
    const { container } = render(
      <svg aria-label="test">
        <title>test</title>
        <EditorialBevelFilter id="test-filter" theme="light" />
      </svg>,
    );
    const filter = container.querySelector('filter');
    expect(filter).not.toBeNull();
    expect(filter?.getAttribute('id')).toBe('test-filter');
  });

  it('light theme uses #ffffff lighting + slope 0.32', () => {
    const { container } = render(
      <svg aria-label="test">
        <title>test</title>
        <EditorialBevelFilter id="t" theme="light" />
      </svg>,
    );
    const spec = container.querySelector('feSpecularLighting');
    expect(spec?.getAttribute('lighting-color')?.toLowerCase()).toBe('#ffffff');
    expect(spec?.getAttribute('specularConstant')).toBe('1.1');
    const fnA = container.querySelector('feFuncA');
    expect(fnA?.getAttribute('slope')).toBe('0.32');
  });

  it('dark theme uses parchment lighting + slope 0.55', () => {
    const { container } = render(
      <svg aria-label="test">
        <title>test</title>
        <EditorialBevelFilter id="t" theme="dark" />
      </svg>,
    );
    const spec = container.querySelector('feSpecularLighting');
    expect(spec?.getAttribute('lighting-color')?.toLowerCase()).toBe('#f4f1ea');
    expect(spec?.getAttribute('specularConstant')).toBe('1.0');
    const fnA = container.querySelector('feFuncA');
    expect(fnA?.getAttribute('slope')).toBe('0.55');
  });

  it('renders primitives in spec-locked order', () => {
    const { container } = render(
      <svg aria-label="test">
        <title>test</title>
        <EditorialBevelFilter id="t" theme="light" />
      </svg>,
    );
    const filter = container.querySelector('filter');
    const childTags = Array.from(filter?.children ?? []).map((el) => el.tagName.toLowerCase());
    expect(childTags).toEqual([
      'fegaussianblur',
      'fespecularlighting',
      'fecomposite',
      'fegaussianblur',
      'feoffset',
      'fecomponenttransfer',
      'femerge',
    ]);
  });

  it('feDistantLight at azimuth 225, elevation 55', () => {
    const { container } = render(
      <svg aria-label="test">
        <title>test</title>
        <EditorialBevelFilter id="t" theme="light" />
      </svg>,
    );
    const dl = container.querySelector('feDistantLight');
    expect(dl?.getAttribute('azimuth')).toBe('225');
    expect(dl?.getAttribute('elevation')).toBe('55');
  });
});
