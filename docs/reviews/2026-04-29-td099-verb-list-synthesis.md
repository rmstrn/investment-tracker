# TD-099 Verb-List Synthesis — 2026-04-29

**Workshop dispatch:** legal-advisor + content-lead + finance-advisor (parallel, isolated contexts).
**Aggregator:** Right-Hand.
**Owner of impl:** backend-engineer (slice TD-099).

## Inputs

- `docs/reviews/2026-04-29-td099-verb-list-legal.md` — 22 EN + 20 RU Tier-1 (regulatory triggers)
- `docs/reviews/2026-04-29-td099-verb-list-voice.md` — 24 EN + 16 RU Tier-1 (voice violations) + 18-pair substitute table
- `docs/reviews/2026-04-29-td099-verb-list-finance.md` — 30 EN + 21 RU Tier-1 + Tier-2 contextual + TA family separated + 32 approved-verbs

## Synthesis policy

1. **UNION on forbidden** — most-restrictive specialist wins per token.
2. **INTERSECTION on approved** — only tokens all three accept survive into AI prompt template's «factual-allowed» reference.
3. **Two separate constants:**
   - `FORBIDDEN_VERBS` — general advice-tone tokens (legal + voice + finance Tier-1 union)
   - `FORBIDDEN_TA_VOCABULARY` — TA-indicator family (separate because remediation path differs; finance angle insight)
4. **Brand-name whitelist runs FIRST** — `Provedo`, `провед-` stem (legal angle critical false-positive insight).
5. **Tier 1 + Tier 2 → hard-block at api-client** (voice angle: api-client is dumb gate, no surrounding-frame context; push contextual judgment to AI prompt layer).
6. **Tier 3 → log + pass** with telemetry event `lane_a.vocabulary.tier3.flagged` for weekly human-review sample.
7. **Quarterly review cadence** (legal + content-lead + finance) + ad-hoc triggers (jurisdiction-add / model-upgrade / regulator-enforcement-action / user-reported-leak).

## Implementation contract — backend-engineer

### File: `packages/shared-types/src/lane-a-vocabulary.ts` (NEW)

```ts
/**
 * Lane-A vocabulary gate — fail-closed dumb scan at the api-client trust boundary.
 *
 * This is the SOLE remaining channel for advice-tone leakage after Zod/Pydantic
 * structural enforcement (per architect ADR Δ4). Contextual judgment lives in the
 * AI prompt template upstream; THIS file is a fail-closed regex scan.
 *
 * Synthesised 2026-04-29 from 3-specialist workshop:
 * - legal: regulatory triggers (SEC publisher-exclusion, MiFID II Art. 9 personal
 *   recommendation, FCA COBS 9.5 suitability, 39-ФЗ analogues, anti-touting)
 * - voice: Provedo voice violations (imperative, modal-obligation, value-judgment)
 * - finance: financial advice-tone (forward-looking predicates, position-guidance
 *   comparators, TA-indicator family)
 *
 * Source-of-truth specialist files in `docs/reviews/2026-04-29-td099-verb-list-{legal,voice,finance}.md`
 * Synthesis policy in `docs/reviews/2026-04-29-td099-verb-list-synthesis.md`
 *
 * Quarterly review owners: legal + content-lead + finance-advisor.
 * Last reviewed: 2026-04-29.
 */

/**
 * Brand-name + brand-stem whitelist — runs BEFORE any blocklist scan.
 * Without this, the Russian stem «провед-» (high-frequency normal Russian verb,
 * also the etymological root of «Provedo») would collide with naive Tier-1 stem
 * matching. Critical false-positive guard from legal angle.
 */
export const BRAND_NAME_WHITELIST = [
  // Match only as standalone word OR as proper-noun «Provedo»
  /\bProvedo\b/iu,
  // Match Russian «провед-» stem in noun/verb forms ONLY when not in advisory
  // collocation (e.g. «провели аудит» OK; «провести продажу» blocked by other
  // tokens). Whitelist matches this stem explicitly.
  /\bпровед\w*\b/iu,
] as const;

/**
 * FORBIDDEN_VERBS — Tier 1 + Tier 2 union from all 3 specialists.
 * Hard-block at api-client. No context judgment.
 *
 * Format: lowercase lemma OR full-word regex. Matched against tokenised
 * text (whitespace + punctuation split, lowercased, with Russian morphology
 * stem matching for RU).
 */
export const FORBIDDEN_VERBS_EN = [
  // Tier 1 — regulatory + voice + finance union
  'recommend', 'recommends', 'recommended', 'recommendation',
  'advise', 'advises', 'advised', 'advising',
  'suggest', 'suggests', 'suggested',
  'urge', 'urges', 'urged',
  'should', 'must',
  'consider', 'considers',
  'expect', 'expects', 'expected', 'anticipate', 'anticipates',
  'project', 'projects', 'projected', 'forecast', 'forecasts', 'predict', 'predicts',
  'outperform', 'outperforms', 'underperform', 'underperforms',
  'beat', 'beats', 'lag', 'lags',
  'signal', 'signals', 'signaling',
  'suitable', 'appropriate',
  'endorse', 'endorses', 'endorsed',
  'propose', 'proposes', 'proposed',
  'urge', 'urged',
  // Imperative action verbs (2nd-person)
  'buy', 'sell', 'hold',
  // Future-certainty
  'will',
] as const;

export const FORBIDDEN_VERBS_RU = [
  // Tier 1 RU — regulatory + voice + finance union
  'рекомендую', 'рекомендуем', 'рекомендовать', 'рекомендация', 'рекомендованный',
  'советую', 'советуем', 'посоветовать', 'совет',
  'предлагаю', 'предлагаем', 'предложить',
  'убеждаю', 'настаиваю', 'настоятельно',
  'следует', 'должны', 'надо', 'нужно',
  'ожидается', 'прогнозирую', 'прогнозируется',
  'превзойдёт', 'превзойдет', 'обыграет', 'сыграет', 'вытянет',
  'купите', 'продайте', 'держите',
  'подходит', 'оптимально', 'наилучший',
] as const;

/**
 * FORBIDDEN_TA_VOCABULARY — separate constant for TA-indicator family.
 * Different remediation path (no Lane-A-clean rephrasing exists for these),
 * different audit cadence (TA canon is 40-year-stable). Recommended by
 * finance angle.
 */
export const FORBIDDEN_TA_VOCABULARY_EN = [
  'overbought', 'oversold',
  'breakout', 'breakdown',
  'support-level', 'support_level', 'resistance-level', 'resistance_level',
  'bullish', 'bearish',
  'golden-cross', 'golden_cross', 'death-cross', 'death_cross',
  'momentum', 'mean-reversion', 'mean_reversion',
  'trend-line', 'trend_line', 'channel-band', 'channel_band',
  'moving-average', 'moving_average',
  'rsi', 'macd', 'bollinger', 'atr', 'stochastic', 'adx', 'ichimoku',
  'fibonacci', 'pivot-point', 'pivot_point',
] as const;

export const FORBIDDEN_TA_VOCABULARY_RU = [
  'перекупленность', 'перепроданность',
  'пробой', 'пробитие',
  'уровень-поддержки', 'уровень-сопротивления',
  'бычий', 'медвежий',
  'тренд-линия', 'скользящая-средняя',
] as const;

/**
 * Forbidden-construction patterns (regex; bilingual).
 * These match shape rather than tokens. Hard-block at api-client.
 */
export const FORBIDDEN_PATTERNS = [
  // Future-certainty predicates (will + outperform/recover/etc)
  /\bwill\s+(outperform|underperform|recover|rise|fall|beat|lag|deliver|return)\b/iu,
  // RU future-certainty («будет расти», «покажет рост»)
  /\bбудет\s+(расти|снижаться|превосходить|обыгрывать)\b/iu,
  // «(strong|weak) (buy|sell|signal)» value-judgment + action
  /\b(strong|weak|sure|definite)\s+(buy|sell|signal|hold)\b/iu,
  // RU «лучше (всего )?\s+inf» — soft-imperative future-direction
  /\bлучше\s+(всего\s+)?[а-я]+(ть|ться)\b/iu,
] as const;

/**
 * Approved-verbs reference (factual-only) — INTERSECTION of all 3 specialists.
 * NOT used at api-client (this is a positive list, not a gate).
 * Used by AI prompt template as the «verbs you may use» reference set.
 */
export const APPROVED_FACTUAL_VERBS_REFERENCE = [
  // Observation
  'show', 'shows', 'display', 'displays', 'render', 'renders',
  'note', 'notes', 'highlight', 'highlights', 'observe', 'observes',
  // Past-tense factual movement
  'rose', 'fell', 'gained', 'lost', 'moved', 'changed', 'increased', 'decreased',
  // Explanatory
  'explain', 'explains', 'describe', 'describes', 'define', 'defines', 'illustrate', 'illustrates',
  // Performance attribution (past tense ONLY)
  'drove', 'contributed', 'accounted-for', 'comprised', 'decomposed',
  // Calendar mechanics
  'announced', 'declared', 'received', 'paid',
] as const;

export type ForbiddenVerb = (typeof FORBIDDEN_VERBS_EN)[number] | (typeof FORBIDDEN_VERBS_RU)[number];
```

### Wire-in: `packages/api-client/src/index.ts`

Modify `parseChartEnvelope` to add a post-parse vocabulary scan:

```ts
import {
  FORBIDDEN_VERBS_EN, FORBIDDEN_VERBS_RU,
  FORBIDDEN_TA_VOCABULARY_EN, FORBIDDEN_TA_VOCABULARY_RU,
  FORBIDDEN_PATTERNS, BRAND_NAME_WHITELIST,
} from '@investment-tracker/shared-types/lane-a-vocabulary';

/** Internal — extract every text-string field from a parsed envelope. */
function extractTextFields(env: ChartEnvelope): { path: string; text: string }[] { /* ... */ }

/** Internal — tokenise and check against forbidden lists. Returns [] if clean. */
function scanForbiddenVocabulary(text: string): { token: string; tier: 'general' | 'ta' | 'pattern' }[] { /* ... */ }

export function parseChartEnvelope(raw: unknown): ParseChartResult {
  const result = ChartEnvelope.safeParse(raw);
  if (!result.success) return { ok: false, error: result.error, raw };

  const violations = extractTextFields(result.data).flatMap((field) =>
    scanForbiddenVocabulary(field.text).map((v) => ({ ...v, path: field.path }))
  );

  if (violations.length > 0) {
    // Synthesise a ZodError so callers handle uniformly
    const issues = violations.map((v) => ({
      code: z.ZodIssueCode.custom,
      path: v.path.split('.'),
      message: `Lane-A vocabulary violation: «${v.token}» (${v.tier})`,
      params: { code: 'LANE_A_VOCABULARY_VIOLATION', tier: v.tier, token: v.token },
    }));
    return { ok: false, error: new z.ZodError(issues), raw };
  }

  return { ok: true, data: result.data };
}
```

Brand-name whitelist runs INSIDE `scanForbiddenVocabulary` BEFORE any blocklist match (per legal-angle false-positive guard).

### Tests: `packages/api-client/src/index.test.ts` (or sibling)

Required test groups:
- **Brand-name false-positives don't fire:**
  - `meta.title: "Provedo сегодня показывает..."` → ok: true
  - `meta.title: "Провели аудит портфеля"` → ok: true (стем разрешён, no advisory collocation)
- **Tier 1 EN hard-blocks:** for each of top-5 EN forbidden lemmas, assert violation
- **Tier 1 RU hard-blocks:** for each of top-5 RU forbidden lemmas, assert violation
- **TA family hard-blocks:** `meta.title: "RSI breakout signal"` → violation, tier='ta'
- **Pattern hard-blocks:** `meta.subtitle: "AAPL will outperform SPY"` → violation
- **Multi-violation aggregation:** envelope with violations in `meta.title` + `meta.alt` returns multiple ZodIssues with correct paths
- **Approved-verbs allowed:** `meta.subtitle: "Dividend declared on April 23"` → ok: true

### Acceptance criteria

- [ ] `packages/shared-types/src/lane-a-vocabulary.ts` exists with all 4 forbidden constants + 1 patterns array + 1 whitelist + 1 approved reference
- [ ] `./lane-a-vocabulary` subpath export entry in `packages/shared-types/package.json` per ADR-2026-04-19 (mirrors `./charts`)
- [ ] `parseChartEnvelope` returns `{ ok: false, ... }` with `params.code === 'LANE_A_VOCABULARY_VIOLATION'` for any forbidden token in any text field of the envelope
- [ ] Brand-name whitelist runs first; «Provedo» and «провед-» (in non-advisory collocations) pass cleanly
- [ ] Tests cover all 7 test groups above; minimum 15 total
- [ ] `pnpm --filter @investment-tracker/shared-types test` green
- [ ] `pnpm --filter @investment-tracker/api-client test` green
- [ ] `pnpm --filter @investment-tracker/web build` green
- [ ] Single-parser invariant still holds: `grep -rn "ChartEnvelope.safeParse" --include="*.ts" --include="*.tsx" --exclude="*.test.ts" --exclude-dir=node_modules .` returns exactly 1 production hit (in `packages/api-client/src/index.ts`)

### Out of scope

- AI prompt template update (separate slice — content-lead + AI service team will use `APPROVED_FACTUAL_VERBS_REFERENCE` as the prompt's «verbs you may use» list)
- Telemetry event wiring (`lane_a.vocabulary.tier3.flagged`) — current scan is hard-block only; tier-3 logging is future enhancement (file as TD-105 if needed)
- Pydantic mirror in `apps/ai/` — separate slice (TD-091 already tracks)

## Caveats

- This list is internal product-validation tooling. Per legal-advisor caveat, NOT a substitute for licensed counsel review before any market launch.
- Quarterly review cadence required (next review: 2026-07-29).
