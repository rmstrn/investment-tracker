import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StageFrame, splitOnAccent } from './StageFrame';

describe('splitOnAccent', () => {
  it('preserves trailing space before the accent and leading space after', () => {
    // H5 regression guard. The previous implementation used
    // `headline.split(accentWord)[0]` which silently consumed surrounding
    // whitespace under some inputs, rendering "Notice<span>what</span>you'd"
    // (no space after the accent).
    const result = splitOnAccent("Notice what you'd miss.", 'what');
    expect(result).not.toBeNull();
    expect(result?.before).toBe('Notice ');
    expect(result?.accent).toBe('what');
    expect(result?.after).toBe(" you'd miss.");
  });

  it('returns null when the accent word is not present', () => {
    expect(splitOnAccent('Strong opinions', 'absent')).toBeNull();
  });

  it('returns null when the accent word is empty', () => {
    expect(splitOnAccent('Some headline', '')).toBeNull();
  });
});

describe('StageFrame headline rendering', () => {
  it('renders the headline with proper inter-word spacing around the accent', () => {
    const { container } = render(
      <StageFrame
        variant="light"
        eyebrow="EYEBROW"
        headline="Notice what you'd miss."
        accentWord="what"
        meta={null}
      >
        <div />
      </StageFrame>,
    );
    const headline = container.querySelector('.showcase-stage-v2__headline');
    expect(headline?.textContent).toBe("Notice what you'd miss.");
  });
});
