/**
 * `parseChartEnvelope` integration tests — Lane-A vocabulary gate wire-in.
 *
 * Covers all 7 test groups required by TD-099 synthesis §«Tests» at the
 * trust-boundary layer. Per-token scan correctness lives in
 * `packages/shared-types/src/lane-a-vocabulary.test.ts`; this file verifies
 * the integration: ZodError-shaped result, `params.code ===
 * LANE_A_VOCABULARY_VIOLATION`, brand-name pass-through inside a real
 * envelope, multi-violation aggregation across multiple text fields, etc.
 *
 * Fixtures mirror the canonical CHARTS_SPEC §5.3 examples so we exercise
 * realistic envelope shapes — not synthetic minimal payloads.
 */

import { LANE_A_VOCABULARY_VIOLATION } from '@investment-tracker/shared-types/lane-a-vocabulary';
import { describe, expect, it } from 'vitest';
import type { ZodIssue } from 'zod';
import { parseChartEnvelope } from './index.js';

/**
 * `ZodIssue` is a discriminated union; only the `'custom'` branch carries
 * `params`. Centralised cast avoids per-call-site `as` clutter while staying
 * narrow enough that misuse stays visible.
 */
function issueParams(
  issue: ZodIssue,
): { code?: string; tier?: string; token?: string } | undefined {
  return (issue as { params?: { code?: string; tier?: string; token?: string } }).params;
}

const ENVELOPE_ID = 'f3a8c1de-1234-4abc-8def-0123456789ab';
const CREATED_AT = '2026-04-27T10:14:22Z';

function envelope(payload: unknown): unknown {
  return { id: ENVELOPE_ID, payload, createdAt: CREATED_AT };
}

/** Minimal, schema-clean line payload that we mutate per test. */
function baseLinePayload(meta: Record<string, string>): unknown {
  return {
    kind: 'line',
    meta,
    xAxis: { format: 'date-day', label: 'Date' },
    yAxis: { format: 'currency-compact', currency: 'USD', label: 'Value' },
    series: [{ key: 'y', label: 'Total' }],
    data: [
      { x: '2026-03-28', y: 220180 },
      { x: '2026-03-29', y: 221450 },
    ],
    interpolation: 'monotone',
  };
}

/* ─── 1. brand-name false-positives don't fire ─────────────────────── */

describe('brand-name whitelist — no false-positives in envelope', () => {
  it('passes envelope with "Provedo сегодня показывает..." in meta.title', () => {
    const payload = baseLinePayload({
      title: 'Provedo сегодня показывает динамику',
      subtitle: 'IBKR + Binance · synced 2026-04-26',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(true);
  });

  it('passes envelope with «Провели аудит портфеля» (provedo past-tense stem)', () => {
    const payload = baseLinePayload({
      title: 'Провели аудит портфеля',
      subtitle: 'Quarterly review',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(true);
  });
});

/* ─── 2. EN Tier-1 hard-blocks ─────────────────────────────────────── */

describe('EN Tier-1 hard-blocks at trust boundary', () => {
  it.each(['recommend', 'advise', 'should', 'expects', 'outperforms'])(
    'blocks envelope when meta.title contains "%s"',
    (lemma) => {
      const payload = baseLinePayload({ title: `The portfolio ${lemma} a rebalance` });
      const result = parseChartEnvelope(envelope(payload));
      expect(result.ok).toBe(false);
      if (result.ok) return; // type narrowing for TS
      const issues = result.error.issues;
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.every((i) => i.code === 'custom')).toBe(true);
      const first = issues[0];
      expect(first).toBeDefined();
      if (!first) return;
      expect(issueParams(first)?.code).toBe(LANE_A_VOCABULARY_VIOLATION);
    },
  );
});

/* ─── 3. RU Tier-1 hard-blocks ─────────────────────────────────────── */

describe('RU Tier-1 hard-blocks at trust boundary', () => {
  it.each([
    ['рекомендую', 'рекомендую увеличить долю'],
    ['советую', 'советую пересмотреть позицию'],
    ['следует', 'следует продать актив'],
    ['ожидается', 'ожидается рост рынка'],
    ['купите', 'купите облигации сейчас'],
  ])('blocks envelope when meta.title contains "%s"', (_lemma, sentence) => {
    const payload = baseLinePayload({ title: sentence });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const first = result.error.issues[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(issueParams(first)?.code).toBe(LANE_A_VOCABULARY_VIOLATION);
    expect(issueParams(first)?.tier).toBe('general');
  });
});

/* ─── 4. TA-family hard-blocks (tier='ta') ─────────────────────────── */

describe('TA-family hard-blocks at trust boundary', () => {
  it('blocks "RSI breakout signal" with tier=ta', () => {
    const payload = baseLinePayload({ title: 'RSI breakout signal' });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const tiers = result.error.issues.map((i) => issueParams(i)?.tier);
    // RSI + breakout are tier='ta'; signal is tier='general'. Both must surface.
    expect(tiers).toContain('ta');
  });
});

/* ─── 5. pattern hard-blocks ───────────────────────────────────────── */

describe('forbidden-pattern hard-blocks at trust boundary', () => {
  it('blocks "AAPL will outperform SPY" via pattern', () => {
    const payload = baseLinePayload({
      title: 'Quarterly outlook',
      subtitle: 'AAPL will outperform SPY',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const tiers = result.error.issues.map((i) => issueParams(i)?.tier);
    expect(tiers).toContain('pattern');
  });
});

/* ─── 6. multi-violation aggregation across paths ──────────────────── */

describe('multi-violation aggregation', () => {
  it('reports violations from meta.title AND meta.alt with correct paths', () => {
    const payload = baseLinePayload({
      title: 'We recommend rebalancing',
      alt: 'You should buy',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;

    const paths = result.error.issues.map((i) => i.path.join('.'));
    // Issues should reference at least one path under meta.title and one
    // under meta.alt (the envelope's payload.meta.* fields).
    const hasTitlePath = paths.some((p) => p.endsWith('payload.meta.title'));
    const hasAltPath = paths.some((p) => p.endsWith('payload.meta.alt'));
    expect(hasTitlePath).toBe(true);
    expect(hasAltPath).toBe(true);
  });

  it('every issue carries LANE_A_VOCABULARY_VIOLATION code', () => {
    const payload = baseLinePayload({
      title: 'You should buy now',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    for (const issue of result.error.issues) {
      expect(issueParams(issue)?.code).toBe(LANE_A_VOCABULARY_VIOLATION);
    }
  });
});

/* ─── 7. approved factual envelopes pass cleanly ───────────────────── */

describe('approved factual envelopes pass', () => {
  it('"Dividend declared on April 23" passes', () => {
    const payload = baseLinePayload({
      title: 'Dividend declared on April 23',
      subtitle: 'KO dividend received',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(true);
  });

  it('factual past-tense observation passes', () => {
    const payload = baseLinePayload({
      title: 'Portfolio value',
      subtitle: 'AAPL rose 1.4% on April 23',
    });
    const result = parseChartEnvelope(envelope(payload));
    expect(result.ok).toBe(true);
  });
});

/* ─── 8. structural Zod errors still surface unchanged ─────────────── */

describe('structural failures surface as ZodError unchanged', () => {
  it('returns Zod structural error for malformed envelope (not a vocabulary issue)', () => {
    const result = parseChartEnvelope({ id: 'not-a-uuid', payload: {}, createdAt: 'oops' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    // None of these are vocabulary violations.
    for (const issue of result.error.issues) {
      expect(issueParams(issue)?.code).not.toBe(LANE_A_VOCABULARY_VIOLATION);
    }
  });
});
