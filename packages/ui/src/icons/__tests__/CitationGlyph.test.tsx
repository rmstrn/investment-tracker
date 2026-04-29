/**
 * Vitest tests for `<CitationGlyph>` / `<ProvedoMark>`.
 *
 * Verifies:
 *   - renders an inline <svg> with the sparkle path
 *   - decorative by default (aria-hidden, role=presentation)
 *   - ariaLabel flips to role=img with aria-label
 *   - currentColor fill so it inherits parent text colour
 *   - size prop threads through to width + height
 *   - ProvedoMark is the same component (alias)
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CitationGlyph, ProvedoMark } from '../CitationGlyph';

describe('<CitationGlyph>', () => {
  it('renders inline <svg> with currentColor fill', () => {
    const { container } = render(<CitationGlyph />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.querySelector('path')).not.toBeNull();
  });

  it('is decorative by default (role=presentation, aria-hidden)', () => {
    const { container } = render(<CitationGlyph />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('presentation');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('flips to role=img + aria-label when ariaLabel passed', () => {
    const { container } = render(<CitationGlyph ariaLabel="Provedo insight marker" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Provedo insight marker');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
  });

  it('size prop threads to width and height', () => {
    const { container } = render(<CitationGlyph size={20} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('20');
    expect(svg?.getAttribute('height')).toBe('20');
  });

  it('default size is 12', () => {
    const { container } = render(<CitationGlyph />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('12');
    expect(svg?.getAttribute('height')).toBe('12');
  });

  it('uses the 24×24 viewBox for crisp scaling', () => {
    const { container } = render(<CitationGlyph />);
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('ProvedoMark is the same component (brand voice alias)', () => {
    expect(ProvedoMark).toBe(CitationGlyph);
  });
});
