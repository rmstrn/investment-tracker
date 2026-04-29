/**
 * RegulatoryDisclaimer — Vitest smoke tests for TD-100.
 *
 * Asserts:
 * 1. Compact + verbose render in EN + RU (4 surfaces).
 * 2. Compact «Read full disclaimer →» link href = `/legal/disclaimer`
 *    (with override path also honoured).
 * 3. Both variants expose `role="contentinfo"` + `aria-label`.
 * 4. Body text uses the AA-compliant `--text-secondary` token via the
 *    `text-text-secondary` Tailwind class — NOT `text-text-tertiary`
 *    (which fails AA at 4.06:1 per product-designer audit).
 * 5. TD-099 forbidden tokens absent from copy (legitimate exception:
 *    «совет/советы/советник» as regulatory term-of-art).
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RegulatoryDisclaimer } from './RegulatoryDisclaimer';
import { COMPACT_COPY, FULL_DISCLAIMER_PATH, VERBOSE_COPY } from './copy';

describe('RegulatoryDisclaimer — compact', () => {
  it('renders English compact body and aria landmark', () => {
    render(<RegulatoryDisclaimer variant="compact" lang="en" />);
    const landmark = screen.getByRole('contentinfo', {
      name: COMPACT_COPY.en.ariaLabel,
    });
    expect(landmark).toBeInTheDocument();
    expect(landmark).toHaveAttribute('lang', 'en');
    expect(landmark).toHaveTextContent(/provides information, not investment advice/i);
  });

  it('renders Russian compact body and aria landmark', () => {
    render(<RegulatoryDisclaimer variant="compact" lang="ru" />);
    const landmark = screen.getByRole('contentinfo', {
      name: COMPACT_COPY.ru.ariaLabel,
    });
    expect(landmark).toBeInTheDocument();
    expect(landmark).toHaveAttribute('lang', 'ru');
    expect(landmark.textContent ?? '').toContain('инвестиционные советы');
  });

  it('points the trailing link at /legal/disclaimer by default', () => {
    render(<RegulatoryDisclaimer variant="compact" lang="en" />);
    const link = screen.getByRole('link', { name: /read full disclaimer/i });
    expect(link).toHaveAttribute('href', FULL_DISCLAIMER_PATH);
    expect(FULL_DISCLAIMER_PATH).toBe('/legal/disclaimer');
  });

  it('honours `fullDisclaimerHref` override prop', () => {
    render(
      <RegulatoryDisclaimer
        variant="compact"
        lang="en"
        fullDisclaimerHref="/legal/disclaimer?lang=en"
      />,
    );
    const link = screen.getByRole('link', { name: /read full disclaimer/i });
    expect(link).toHaveAttribute('href', '/legal/disclaimer?lang=en');
  });

  it('uses the AA-compliant `text-text-secondary` token (not text-text-tertiary)', () => {
    const { container } = render(<RegulatoryDisclaimer variant="compact" lang="en" />);
    const landmark = container.querySelector('footer[role="contentinfo"]');
    expect(landmark).not.toBeNull();
    expect(landmark?.className).toContain('text-text-secondary');
    expect(landmark?.className).not.toContain('text-text-tertiary');
  });
});

describe('RegulatoryDisclaimer — verbose', () => {
  it('renders all 6 English paragraphs and the heading', () => {
    render(<RegulatoryDisclaimer variant="verbose" lang="en" />);
    expect(
      screen.getByRole('heading', { level: 1, name: VERBOSE_COPY.en.heading }),
    ).toBeInTheDocument();
    for (const paragraph of VERBOSE_COPY.en.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(VERBOSE_COPY.en.paragraphs).toHaveLength(6);
  });

  it('renders Russian paragraphs and aria landmark', () => {
    render(<RegulatoryDisclaimer variant="verbose" lang="ru" />);
    const landmark = screen.getByRole('contentinfo', {
      name: VERBOSE_COPY.ru.ariaLabel,
    });
    expect(landmark).toBeInTheDocument();
    expect(landmark).toHaveAttribute('lang', 'ru');
    expect(VERBOSE_COPY.ru.paragraphs).toHaveLength(6);
  });

  it('verbose body uses AA-compliant `text-text-secondary` token', () => {
    const { container } = render(<RegulatoryDisclaimer variant="verbose" lang="en" />);
    // Paragraph wrapper carries the body color class.
    const wrapper = container.querySelector('.text-text-secondary');
    expect(wrapper).not.toBeNull();
    const tertiaryUse = container.querySelector('.text-text-tertiary');
    expect(tertiaryUse).toBeNull();
  });
});

describe('RegulatoryDisclaimer — TD-099 vocabulary audit', () => {
  /**
   * TD-099 forbidden stems / tokens. Documented legitimate exceptions
   * (synthesis §Acceptance criteria 9 + §«Final copy text»):
   * - «совет / советы / советник» — regulatory term-of-art for «adviser /
   *   advice» (MiFID II Art. 4(1)(4) + 39-ФЗ).
   * - «recommend / recommendations / advise / advice / adviser» — same
   *   regulatory terms-of-art in EN. The verbose copy uses them ONLY in
   *   denial form («does not provide personalized recommendations»,
   *   «not a registered investment adviser»).
   * - `рекоменд-` stem appears once in RU verbose §2 as a regulatory
   *   denial — flagged separately by the dedicated negation-presence test.
   *
   * The patterns below cover exhortative verbs / adverbs that have NO
   * regulatory term-of-art carve-out and must never appear in copy.
   */
  const FORBIDDEN_PATTERNS: ReadonlyArray<{ name: string; re: RegExp }> = [
    { name: 'suggest', re: /\bsuggest\w*/i },
    { name: 'should', re: /\bshould\b/i },
    { name: 'consider', re: /\bconsider(s|ed|ing)?\b/i },
    { name: 'стоит', re: /\bстоит\b/iu },
  ];

  function collectStrings(): string[] {
    return [
      COMPACT_COPY.en.body,
      COMPACT_COPY.en.linkLabel,
      COMPACT_COPY.ru.body,
      COMPACT_COPY.ru.linkLabel,
      VERBOSE_COPY.en.heading,
      ...VERBOSE_COPY.en.paragraphs,
      VERBOSE_COPY.ru.heading,
      ...VERBOSE_COPY.ru.paragraphs,
    ];
  }

  it.each(FORBIDDEN_PATTERNS)('no copy string contains forbidden token «$name»', ({ re }) => {
    for (const text of collectStrings()) {
      expect(text).not.toMatch(re);
    }
  });

  it('verbose RU paragraph 2 negates personalised recommendations (regulator phrasing exception)', () => {
    // Documented legitimate exception — «не предоставляет персональных
    // рекомендаций» is a regulatory denial. Test asserts presence so a
    // future copy edit that drops the negation gets flagged.
    const ruParagraph2 = VERBOSE_COPY.ru.paragraphs[1];
    expect(ruParagraph2).toMatch(/не предоставляет персональных рекомендаций/);
  });

  it('uses «обращайтесь» rather than «стоит обратиться» in verbose RU', () => {
    const lastParagraph = VERBOSE_COPY.ru.paragraphs.at(-1) ?? '';
    expect(lastParagraph).toContain('обращайтесь');
    expect(lastParagraph).not.toMatch(/\bстоит\b/);
  });
});
