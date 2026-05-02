/**
 * Lane-A vocabulary gate — unit tests for the scan primitive itself.
 *
 * The wire-in tests (envelope-level, ZodError-shaped result) live in
 * `packages/api-client/src/parser.test.ts`. This file covers:
 *
 * 1. Brand-name whitelist false-positive guards (Provedo + провед-stem).
 * 2. EN Tier-1 advice-tone hard-blocks (lemma sample).
 * 3. RU Tier-1 advice-tone hard-blocks (lemma sample).
 * 4. TA-family hard-blocks (separate constant; tier='ta').
 * 5. Pattern hard-blocks (forward-looking collocations).
 * 6. Multi-violation aggregation (multiple tokens in one field).
 * 7. Approved factual-verbs reference passes cleanly.
 *
 * Per synthesis §«Tests» — minimum 15 cases, all 7 groups covered.
 */

import { describe, expect, it } from 'vitest';
import { APPROVED_FACTUAL_VERBS_REFERENCE, scanForbiddenVocabulary } from './lane-a-vocabulary.js';

/* ─── 1. brand-name whitelist (legal-angle false-positive guard) ──── */

describe('brand-name whitelist runs first', () => {
  it('passes "Provedo today shows portfolio drift"', () => {
    const violations = scanForbiddenVocabulary('Provedo today shows portfolio drift');
    expect(violations).toEqual([]);
  });

  it('passes lowercase "provedo" usage', () => {
    const violations = scanForbiddenVocabulary('provedo computed your YTD return');
    expect(violations).toEqual([]);
  });

  it('passes Russian "Провели аудит портфеля" (провед-stem)', () => {
    const violations = scanForbiddenVocabulary('Провели аудит портфеля');
    expect(violations).toEqual([]);
  });

  it('passes Russian "проведённый расчёт" (провед-stem inflection)', () => {
    const violations = scanForbiddenVocabulary('проведённый расчёт показывает');
    expect(violations).toEqual([]);
  });
});

/* ─── 2. EN Tier-1 advice-tone hard-blocks ────────────────────────── */

describe('FORBIDDEN_VERBS_EN — Tier 1 hard-blocks', () => {
  it.each([
    ['recommend', 'We recommend rebalancing now'],
    ['advise', 'Advisors advise this allocation'],
    ['should', 'You should sell AAPL'],
    ['expect', 'We expect dividends next quarter'],
    ['outperforms', 'AAPL outperforms SPY'],
  ])('flags lemma "%s" as tier=general', (lemma, sentence) => {
    const violations = scanForbiddenVocabulary(sentence);
    const general = violations.filter((v) => v.tier === 'general');
    expect(general.some((v) => v.token === lemma)).toBe(true);
  });
});

/* ─── 3. RU Tier-1 advice-tone hard-blocks ────────────────────────── */

describe('FORBIDDEN_VERBS_RU — Tier 1 hard-blocks', () => {
  it.each([
    ['рекомендую', 'Я рекомендую увеличить долю'],
    ['советую', 'советую пересмотреть позицию'],
    ['следует', 'следует продать актив'],
    ['ожидается', 'ожидается рост рынка'],
    ['купите', 'купите облигации сейчас'],
  ])('flags lemma "%s" as tier=general', (lemma, sentence) => {
    const violations = scanForbiddenVocabulary(sentence);
    const general = violations.filter((v) => v.tier === 'general');
    expect(general.some((v) => v.token === lemma)).toBe(true);
  });
});

/* ─── 4. TA-family hard-blocks (tier='ta') ────────────────────────── */

describe('FORBIDDEN_TA_VOCABULARY — separate tier', () => {
  it('flags "RSI breakout signal" with tier=ta for indicator + breakout', () => {
    const violations = scanForbiddenVocabulary('RSI breakout signal');
    const taTokens = violations.filter((v) => v.tier === 'ta').map((v) => v.token);
    expect(taTokens).toContain('rsi');
    expect(taTokens).toContain('breakout');
  });

  it('flags "MACD overbought reading" as tier=ta', () => {
    const violations = scanForbiddenVocabulary('MACD overbought reading');
    const taTokens = violations.filter((v) => v.tier === 'ta').map((v) => v.token);
    expect(taTokens).toContain('macd');
    expect(taTokens).toContain('overbought');
  });

  it('flags Russian "перекупленность" as tier=ta', () => {
    const violations = scanForbiddenVocabulary('перекупленность по индикатору');
    const taTokens = violations.filter((v) => v.tier === 'ta');
    expect(taTokens.some((v) => v.token === 'перекупленность')).toBe(true);
  });

  it('flags hyphenated "moving-average" as tier=ta', () => {
    const violations = scanForbiddenVocabulary('the moving-average crossed');
    const taTokens = violations.filter((v) => v.tier === 'ta');
    expect(taTokens.some((v) => v.token === 'moving-average')).toBe(true);
  });
});

/* ─── 5. pattern hard-blocks (collocations) ───────────────────────── */

describe('FORBIDDEN_PATTERNS — collocations', () => {
  it('flags "AAPL will outperform SPY" as tier=pattern', () => {
    const violations = scanForbiddenVocabulary('AAPL will outperform SPY');
    const pattern = violations.filter((v) => v.tier === 'pattern');
    expect(pattern.length).toBeGreaterThan(0);
  });

  it('flags "strong buy" value-judgment collocation', () => {
    const violations = scanForbiddenVocabulary('analyst rating: strong buy');
    const pattern = violations.filter((v) => v.tier === 'pattern');
    expect(pattern.length).toBeGreaterThan(0);
  });

  it('flags Russian "будет расти" future-certainty', () => {
    const violations = scanForbiddenVocabulary('актив будет расти весь квартал');
    const pattern = violations.filter((v) => v.tier === 'pattern');
    expect(pattern.length).toBeGreaterThan(0);
  });
});

/* ─── 6. multi-violation aggregation ──────────────────────────────── */

describe('multi-violation aggregation', () => {
  it('returns multiple violations for sentence with several Tier-1 tokens', () => {
    const violations = scanForbiddenVocabulary('We recommend you should buy AAPL');
    expect(violations.length).toBeGreaterThanOrEqual(3);
    const tokens = violations.map((v) => v.token);
    expect(tokens).toContain('recommend');
    expect(tokens).toContain('should');
    expect(tokens).toContain('buy');
  });

  it('returns empty array for empty string', () => {
    expect(scanForbiddenVocabulary('')).toEqual([]);
  });

  it('returns empty array for purely factual sentence', () => {
    const violations = scanForbiddenVocabulary('AAPL closed at $192.34 on April 23');
    expect(violations).toEqual([]);
  });
});

/* ─── 7. approved factual verbs pass cleanly ──────────────────────── */

describe('APPROVED_FACTUAL_VERBS_REFERENCE — sanity', () => {
  // Sample 3 deterministic indices to keep the test fast and stable.
  const samples = [0, 5, 12].map((i) => APPROVED_FACTUAL_VERBS_REFERENCE[i]);

  it.each(samples)('approved verb "%s" used in factual sentence is clean', (verb) => {
    // Build a minimal factual carrier sentence around the verb.
    const sentence = `The chart ${verb} year-to-date data only.`;
    const violations = scanForbiddenVocabulary(sentence);
    expect(violations).toEqual([]);
  });

  it('"Dividend declared on April 23" passes cleanly', () => {
    const violations = scanForbiddenVocabulary('Dividend declared on April 23');
    expect(violations).toEqual([]);
  });
});
