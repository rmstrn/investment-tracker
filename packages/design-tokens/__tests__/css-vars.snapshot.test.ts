import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CSS_PATH = join(__dirname, '..', 'build', 'css', 'tokens.css');

describe('chart-categorical CSS vars', () => {
  it('emits 30 chart-categorical vars (5 hues x 2 themes x 3 stops)', () => {
    const css = readFileSync(CSS_PATH, 'utf8');
    const matches = css.match(/--chart-categorical-[1-5]-(base|top|bottom):/g) ?? [];
    expect(matches).toHaveLength(30);
  });

  it('emits all 5 light slot bases with expected hex', () => {
    const css = readFileSync(CSS_PATH, 'utf8');
    const expectedLight: Record<string, string> = {
      '1': '#5E3A2A',
      '2': '#A87C24',
      '3': '#5C3F5E',
      '4': '#7A2E48',
      '5': '#3F546E',
    };
    for (const [slot, hex] of Object.entries(expectedLight)) {
      const re = new RegExp(`--chart-categorical-${slot}-base:\\s*${hex}`, 'i');
      expect(css).toMatch(re);
    }
  });

  it('emits all 5 dark slot bases with expected hex', () => {
    const css = readFileSync(CSS_PATH, 'utf8');
    const expectedDark: Record<string, string> = {
      '1': '#B5876D',
      '2': '#E0BC6E',
      '3': '#9C7DA0',
      '4': '#C88AA0',
      '5': '#9CB0C8',
    };
    const darkBlock = css.split('.dark, [data-theme="dark"]')[1] ?? '';
    for (const [slot, hex] of Object.entries(expectedDark)) {
      const re = new RegExp(`--chart-categorical-${slot}-base:\\s*${hex}`, 'i');
      expect(darkBlock).toMatch(re);
    }
  });
});
