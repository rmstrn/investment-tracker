/**
 * Layer A — Cross-payload contract tests at the trust-boundary
 * (SLICE-CHARTS-QA-V1).
 *
 * Complements:
 * - `packages/shared-types/src/charts.test.ts` (87 schema tests — positive
 *   parses, Risk Flags, Δ1/Δ2/Δ3, T-8 basis).
 * - `packages/api-client/src/parser.test.ts` (19 vocabulary-gate tests at
 *   the envelope boundary).
 *
 * This file fills the integration gaps the QA dispatch brief asked for:
 * 1. Round-trip narrowing — for each of the 10 MVP chart kinds, parse a
 *    canonical envelope through `parseChartEnvelope` and assert the
 *    discriminator narrows to that exact kind on the result side.
 * 2. Schema-version default propagation — the envelope-level
 *    `schemaVersion` default '1.0' arrives on the parsed `data` exactly
 *    as Zod intends.
 * 3. Cross-layer Risk-Flag rejection — Risk Flag 1 (forbidden line
 *    overlay) and Risk Flag 3 (V2 calendar event) reject through the
 *    same parser entry point used by FE, returning a structured
 *    ZodError (not a vocabulary issue).
 * 4. Vocabulary-on-valid-payload — a structurally valid payload whose
 *    `meta.title` carries forbidden Tier-1 prose is rejected with
 *    `params.code === LANE_A_VOCABULARY_VIOLATION`, demonstrating the
 *    two-phase scan order (structural OK → vocabulary fails).
 *
 * Tests are co-located with `parser.test.ts` so the api-client suite
 * keeps a single «trust boundary» test surface. Fixtures import from
 * the UI fixtures barrel (the same fixtures the showcase route renders),
 * keeping the cross-package contract honest.
 */

import { LANE_A_VOCABULARY_VIOLATION } from '@investment-tracker/shared-types/lane-a-vocabulary';
import {
  AREA_FIXTURE,
  BAR_FIXTURE,
  CALENDAR_FIXTURE,
  CANDLESTICK_FIXTURE,
  DONUT_FIXTURE,
  LINE_FIXTURE,
  SPARKLINE_FIXTURE,
  STACKED_BAR_FIXTURE,
  TREEMAP_FIXTURE,
  WATERFALL_FIXTURE,
} from '@investment-tracker/ui/charts';
import { describe, expect, it } from 'vitest';
import type { ZodIssue } from 'zod';
import { parseChartEnvelope } from './index.js';

const ENVELOPE_ID = 'f3a8c1de-1234-4abc-8def-0123456789ab';
const CREATED_AT = '2026-04-27T10:14:22Z';

function envelope(payload: unknown): unknown {
  return { id: ENVELOPE_ID, payload, createdAt: CREATED_AT };
}

function issueParams(
  issue: ZodIssue,
): { code?: string; tier?: string; token?: string } | undefined {
  return (issue as { params?: { code?: string; tier?: string; token?: string } }).params;
}

/**
 * Vocabulary-clean meta for the round-trip narrowing test. The UI showcase
 * fixtures intentionally use richer language (e.g. STACKED_BAR_FIXTURE's
 * subtitle «Asset class breakdown by broker» which trips the TA-tier
 * scanner on «breakdown»). Rendering that fixture directly in the showcase
 * is fine — typed payloads don't traverse the vocabulary gate. But round-
 * tripping through `parseChartEnvelope` does, and that gap is a real
 * contract finding (filed as TD on slice return). Here we strip meta to
 * vocabulary-clean copy so the round-trip narrowing assertion stays
 * focused on its purpose: the discriminator survives the parse, not the
 * showcase prose policy.
 */
function cleanMeta<T extends { meta: { title: string; subtitle?: string; alt?: string } }>(
  fixture: T,
): T {
  const cleanTitle = 'Portfolio value';
  return {
    ...fixture,
    meta: {
      ...fixture.meta,
      title: cleanTitle,
      // Drop subtitle + alt entirely to avoid any vocabulary-tier collisions
      // from showcase-curated copy. Schema marks both optional.
      subtitle: undefined,
      alt: undefined,
    },
  };
}

/* ─── 1. round-trip kind narrowing ─────────────────────────────────── */

describe('round-trip narrowing — each MVP kind parses as itself', () => {
  it.each([
    ['line', cleanMeta(LINE_FIXTURE)],
    ['area', cleanMeta(AREA_FIXTURE)],
    ['bar', cleanMeta(BAR_FIXTURE)],
    ['stacked-bar', cleanMeta(STACKED_BAR_FIXTURE)],
    ['donut', cleanMeta(DONUT_FIXTURE)],
    ['sparkline', cleanMeta(SPARKLINE_FIXTURE)],
    ['candlestick', cleanMeta(CANDLESTICK_FIXTURE)],
    ['calendar', cleanMeta(CALENDAR_FIXTURE)],
    ['treemap', cleanMeta(TREEMAP_FIXTURE)],
    ['waterfall', cleanMeta(WATERFALL_FIXTURE)],
  ])('narrows to kind="%s" after parseChartEnvelope', (kind, fixture) => {
    const result = parseChartEnvelope(envelope(fixture));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.payload.kind).toBe(kind);
  });
});

/* ─── 2. schemaVersion default propagation ─────────────────────────── */

describe('envelope schemaVersion default propagation', () => {
  it('applies schemaVersion="1.0" when omitted from input', () => {
    const result = parseChartEnvelope(envelope(cleanMeta(LINE_FIXTURE)));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.schemaVersion).toBe('1.0');
  });

  it('preserves schemaVersion when explicitly provided', () => {
    const explicit = {
      id: ENVELOPE_ID,
      payload: cleanMeta(LINE_FIXTURE),
      createdAt: CREATED_AT,
      schemaVersion: '1.0',
    };
    const result = parseChartEnvelope(explicit);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.schemaVersion).toBe('1.0');
  });
});

/* ─── 3. Risk Flag 1 — forbidden line overlay through parser ───────── */

describe('Risk Flag 1 (forbidden line overlay) rejected at trust boundary', () => {
  it('rejects line payload with a target_price overlay', () => {
    const malicious = {
      ...LINE_FIXTURE,
      // biome-ignore lint/suspicious/noExplicitAny: shape-violating fixture by design.
      overlay: [{ type: 'target_price', date: '2026-04-22', price: 999 } as any],
    };
    const result = parseChartEnvelope(envelope(malicious));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    // None of the issues should be vocabulary issues — this is a structural
    // (Risk Flag 1) rejection.
    for (const issue of result.error.issues) {
      expect(issueParams(issue)?.code).not.toBe(LANE_A_VOCABULARY_VIOLATION);
    }
  });

  it('rejects line payload with an unknown TA-indicator overlay', () => {
    const malicious = {
      ...LINE_FIXTURE,
      // biome-ignore lint/suspicious/noExplicitAny: shape-violating fixture by design.
      overlay: [{ type: 'rsi', date: '2026-04-22', value: 70 } as any],
    };
    const result = parseChartEnvelope(envelope(malicious));
    expect(result.ok).toBe(false);
  });
});

/* ─── 4. Risk Flag 3 — calendar V2 event types rejected ────────────── */

describe('Risk Flag 3 (calendar V2 event types) rejected at trust boundary', () => {
  it('rejects calendar payload carrying an "earnings" event', () => {
    const malicious = {
      ...CALENDAR_FIXTURE,
      events: [
        // biome-ignore lint/suspicious/noExplicitAny: shape-violating fixture by design.
        { date: '2026-04-25', type: 'earnings', symbol: 'AAPL', label: 'Q2 earnings' } as any,
      ],
    };
    const result = parseChartEnvelope(envelope(malicious));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    // Structural rejection — not vocabulary.
    for (const issue of result.error.issues) {
      expect(issueParams(issue)?.code).not.toBe(LANE_A_VOCABULARY_VIOLATION);
    }
  });

  it('rejects calendar payload carrying a "news" event', () => {
    const malicious = {
      ...CALENDAR_FIXTURE,
      events: [
        // biome-ignore lint/suspicious/noExplicitAny: shape-violating fixture by design.
        { date: '2026-04-25', type: 'news', symbol: 'AAPL', label: 'breaking story' } as any,
      ],
    };
    const result = parseChartEnvelope(envelope(malicious));
    expect(result.ok).toBe(false);
  });
});

/* ─── 5. two-phase scan order: structural OK → vocabulary blocks ──── */

describe('two-phase scan order — structural pass then vocabulary block', () => {
  it('rejects a structurally valid line payload whose meta.title carries Tier-1 prose', () => {
    const tainted = {
      ...LINE_FIXTURE,
      meta: { ...LINE_FIXTURE.meta, title: 'You should rebalance now' },
    };
    const result = parseChartEnvelope(envelope(tainted));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    // Vocabulary tier should fire — confirms phase 2 ran (because phase 1
    // pass means the structural shape was OK).
    const codes = result.error.issues.map((i) => issueParams(i)?.code);
    expect(codes).toContain(LANE_A_VOCABULARY_VIOLATION);
  });
});

/* ─── 6. envelope-level cross-field (Δ2) propagates through parser ── */

describe('cross-field invariants propagate through parser (Δ2 waterfall)', () => {
  it('rejects waterfall envelope when conservation off by $5000', () => {
    const broken = {
      ...WATERFALL_FIXTURE,
      // Drift the endValue out of tolerance without touching the steps.
      endValue: WATERFALL_FIXTURE.endValue + 5000,
    };
    const result = parseChartEnvelope(envelope(broken));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const codes = result.error.issues.map((i) => issueParams(i)?.code);
    // Expect the waterfall conservation custom code, not a vocabulary code.
    expect(codes).not.toContain(LANE_A_VOCABULARY_VIOLATION);
    expect(codes.some((c) => c === 'WATERFALL_CONSERVATION_VIOLATION')).toBe(true);
  });
});
