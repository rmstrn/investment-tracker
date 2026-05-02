/**
 * Lane-A vocabulary gate — fail-closed dumb scan at the api-client trust boundary.
 *
 * This is the SOLE remaining channel for advice-tone leakage after Zod/Pydantic
 * structural enforcement (per architect ADR Δ4). Contextual judgment lives in the
 * AI prompt template upstream; THIS file is a fail-closed regex/lemma scan.
 *
 * Synthesised 2026-04-29 from 3-specialist workshop:
 * - legal: regulatory triggers (SEC publisher-exclusion, MiFID II Art. 9 personal
 *   recommendation, FCA COBS 9.5 suitability, 39-ФЗ analogues, anti-touting)
 * - voice: Provedo voice violations (imperative, modal-obligation, value-judgment)
 * - finance: financial advice-tone (forward-looking predicates, position-guidance
 *   comparators, TA-indicator family)
 *
 * Source-of-truth specialist files in
 * `docs/reviews/2026-04-29-td099-verb-list-{legal,voice,finance}.md`.
 * Synthesis policy in `docs/reviews/2026-04-29-td099-verb-list-synthesis.md`.
 *
 * Quarterly review owners: legal-advisor + content-lead + finance-advisor.
 * Last reviewed: 2026-04-29. Next review: 2026-07-29.
 */

/**
 * Brand-name + brand-stem whitelist — runs BEFORE any blocklist scan.
 *
 * Without this, the Russian stems «провед-» (infinitive root: провести,
 * проведу, проведённый) and «провёл- / провел-» (past tense: провёл,
 * провела, провели) — both descended from «провести», the etymological
 * root of «Provedo» — would collide with naive Tier-1 token matching.
 * Critical false-positive guard from legal angle.
 *
 * Implementation note on word boundaries: JS `\b` only recognises ASCII
 * word characters even with the `/u` flag, and `\w` does NOT match
 * Cyrillic. We therefore use Unicode property escape lookarounds
 * (`(?:^|[^\p{L}])` … `(?=[^\p{L}]|$)`) to bound matches across mixed
 * Latin + Cyrillic input. Same pattern is reused inside `FORBIDDEN_PATTERNS`
 * for the Russian collocation guards.
 *
 * Match precedence: a token matched by any whitelist regex is REMOVED from
 * the scan window (replaced with a neutral placeholder) before forbidden-list
 * lookups run. This means «Provedo today shows…», «Провели аудит», and
 * «проведённый расчёт» pass cleanly while «провести продажу» (advisory
 * collocation) is NOT whitelisted by the stem and gets blocked by «продажу»
 * being absent from the verb list — there a related advice-tone token
 * (e.g. «купите», «должны») would still trigger.
 */
export const BRAND_NAME_WHITELIST: readonly RegExp[] = [
  /(?:^|[^\p{L}])(?:Provedo|провед\p{L}*|провёл\p{L}*|провел\p{L}*)(?=[^\p{L}]|$)/giu,
];

/**
 * FORBIDDEN_VERBS — Tier 1 + Tier 2 union from all 3 specialists (general
 * advice-tone tokens). Hard-block at api-client. No context judgment.
 *
 * Format: lowercase lemma. Matched against tokenised text (whitespace +
 * punctuation split, lowercased). Russian forms include common conjugations
 * present in the specialist source-of-truth lists; further morphological
 * stems are NOT inferred at scan time (fail-closed: literal-only).
 */
export const FORBIDDEN_VERBS_EN: readonly string[] = [
  // Advice / recommendation family
  'recommend',
  'recommends',
  'recommended',
  'recommendation',
  'advise',
  'advises',
  'advised',
  'advising',
  'suggest',
  'suggests',
  'suggested',
  'urge',
  'urges',
  'urged',
  'endorse',
  'endorses',
  'endorsed',
  'propose',
  'proposes',
  'proposed',
  // Modal obligation
  'should',
  'must',
  // Forward-looking certainty
  'expect',
  'expects',
  'expected',
  'anticipate',
  'anticipates',
  'project',
  'projects',
  'projected',
  'forecast',
  'forecasts',
  'predict',
  'predicts',
  // Position-guidance comparators
  'outperform',
  'outperforms',
  'underperform',
  'underperforms',
  'beat',
  'beats',
  'lag',
  'lags',
  // Signal-language
  'signal',
  'signals',
  'signaling',
  // Value-judgment adjectives (suitability)
  'suitable',
  'appropriate',
  // Imperative action verbs (2nd-person)
  'buy',
  'sell',
  'hold',
  // Future-certainty modal
  'will',
  // Soft-imperative
  'consider',
  'considers',
];

export const FORBIDDEN_VERBS_RU: readonly string[] = [
  // Рекомендация / совет family
  'рекомендую',
  'рекомендуем',
  'рекомендовать',
  'рекомендация',
  'рекомендованный',
  'советую',
  'советуем',
  'посоветовать',
  'совет',
  'предлагаю',
  'предлагаем',
  'предложить',
  'убеждаю',
  'настаиваю',
  'настоятельно',
  // Modal obligation
  'следует',
  'должны',
  'надо',
  'нужно',
  // Forward-looking
  'ожидается',
  'прогнозирую',
  'прогнозируется',
  // Position-guidance comparators
  'превзойдёт',
  'превзойдет',
  'обыграет',
  'сыграет',
  'вытянет',
  // Imperatives
  'купите',
  'продайте',
  'держите',
  // Value-judgment adjectives
  'подходит',
  'оптимально',
  'наилучший',
];

/**
 * FORBIDDEN_TA_VOCABULARY — separate constant for the technical-analysis
 * indicator family.
 *
 * Different remediation path from `FORBIDDEN_VERBS_*` (no Lane-A-clean
 * rephrasing exists for these — they are ontologically prescriptive trading
 * vocabulary). Different audit cadence: TA canon is 40-year-stable, so the
 * list rarely changes; advice-tone verbs evolve with regulator language.
 *
 * Recommended by finance angle (separation of concerns for remediation).
 *
 * Tokens are normalised to lowercase. Hyphenated and underscored variants
 * are listed explicitly because the tokeniser does not split on those
 * characters (they form valid identifier-like tokens).
 */
export const FORBIDDEN_TA_VOCABULARY_EN: readonly string[] = [
  'overbought',
  'oversold',
  'breakout',
  'breakdown',
  'support-level',
  'support_level',
  'resistance-level',
  'resistance_level',
  'bullish',
  'bearish',
  'golden-cross',
  'golden_cross',
  'death-cross',
  'death_cross',
  'momentum',
  'mean-reversion',
  'mean_reversion',
  'trend-line',
  'trend_line',
  'channel-band',
  'channel_band',
  'moving-average',
  'moving_average',
  'rsi',
  'macd',
  'bollinger',
  'atr',
  'stochastic',
  'adx',
  'ichimoku',
  'fibonacci',
  'pivot-point',
  'pivot_point',
];

export const FORBIDDEN_TA_VOCABULARY_RU: readonly string[] = [
  'перекупленность',
  'перепроданность',
  'пробой',
  'пробитие',
  'уровень-поддержки',
  'уровень-сопротивления',
  'бычий',
  'медвежий',
  'тренд-линия',
  'скользящая-средняя',
];

/**
 * Forbidden-construction patterns (regex; bilingual).
 *
 * These match shape rather than tokens — collocations that are forbidden in
 * combination even if individual tokens might pass. Hard-block at api-client.
 *
 * Patterns are evaluated against the ORIGINAL text (pre-tokenisation) so
 * they can match across whitespace.
 *
 * Russian patterns use Unicode-property lookarounds `(?<![\p{L}])` /
 * `(?![\p{L}])` instead of `\b`, because JS `\b` is ASCII-only even under
 * `/u`. EN patterns retain `\b` for terseness (it works for ASCII).
 */
export const FORBIDDEN_PATTERNS: readonly RegExp[] = [
  // EN future-certainty predicates
  /\bwill\s+(outperform|underperform|recover|rise|fall|beat|lag|deliver|return)\b/iu,
  // RU future-certainty («будет расти», «покажет рост»)
  /(?<![\p{L}])будет\s+(расти|снижаться|превосходить|обыгрывать)(?![\p{L}])/iu,
  /(?<![\p{L}])покажет\s+(рост|падение|снижение)(?![\p{L}])/iu,
  // EN value-judgment + action collocations
  /\b(strong|weak|sure|definite)\s+(buy|sell|signal|hold)\b/iu,
  // RU «лучше (всего )?\s+inf» — soft-imperative future-direction
  /(?<![\p{L}])лучше\s+(всего\s+)?\p{L}+(ть|ться)(?![\p{L}])/iu,
];

/**
 * Approved-verbs reference (factual-only) — INTERSECTION of all 3 specialists.
 *
 * NOT used at api-client (this is a positive list, not a gate). Used by the
 * AI prompt template as the «verbs you may use» reference set. Exported here
 * to keep the bilingual vocabulary policy in one place for quarterly review.
 */
export const APPROVED_FACTUAL_VERBS_REFERENCE: readonly string[] = [
  // Observation
  'show',
  'shows',
  'display',
  'displays',
  'render',
  'renders',
  'note',
  'notes',
  'highlight',
  'highlights',
  'observe',
  'observes',
  // Past-tense factual movement
  'rose',
  'fell',
  'gained',
  'lost',
  'moved',
  'changed',
  'increased',
  'decreased',
  // Explanatory
  'explain',
  'explains',
  'describe',
  'describes',
  'define',
  'defines',
  'illustrate',
  'illustrates',
  // Performance attribution (past tense ONLY)
  'drove',
  'contributed',
  'accounted-for',
  'comprised',
  'decomposed',
  // Calendar mechanics
  'announced',
  'declared',
  'received',
  'paid',
];

/**
 * Tier label for a vocabulary violation.
 *
 * - `'general'` — Tier 1/2 advice-tone token from `FORBIDDEN_VERBS_*`.
 * - `'ta'`      — Technical-analysis indicator from `FORBIDDEN_TA_VOCABULARY_*`.
 * - `'pattern'` — Forbidden collocation matched by `FORBIDDEN_PATTERNS`.
 */
export type LaneAViolationTier = 'general' | 'ta' | 'pattern';

/**
 * Single vocabulary violation record. `token` is the matched lemma (general /
 * ta) or the matched substring (pattern). Consumers should treat as opaque
 * for display; structured handling keys off `tier`.
 */
export interface LaneAVocabularyViolation {
  readonly token: string;
  readonly tier: LaneAViolationTier;
}

/**
 * Custom error code emitted by `parseChartEnvelope` (api-client) on Lane-A
 * vocabulary violations. Distinct from generic `ZodError` shape codes so
 * monitoring + UI can branch on this specifically (mirrors
 * `WATERFALL_CONSERVATION_VIOLATION` pattern in `charts.ts`).
 */
export const LANE_A_VOCABULARY_VIOLATION = 'LANE_A_VOCABULARY_VIOLATION';

/* ─── scan implementation ─────────────────────────────────────────── */

const WHITESPACE_PUNCT_SPLIT = /[\s,.!?;:"'`(){}\[\]<>]+/u;

/**
 * Build a Set for O(1) membership lookup. Lowercased on construction so the
 * scanner does not have to re-lowercase on every comparison.
 */
function toLookupSet(list: readonly string[]): ReadonlySet<string> {
  return new Set(list.map((token) => token.toLowerCase()));
}

const FORBIDDEN_VERB_LOOKUP: ReadonlySet<string> = toLookupSet([
  ...FORBIDDEN_VERBS_EN,
  ...FORBIDDEN_VERBS_RU,
]);

const FORBIDDEN_TA_LOOKUP: ReadonlySet<string> = toLookupSet([
  ...FORBIDDEN_TA_VOCABULARY_EN,
  ...FORBIDDEN_TA_VOCABULARY_RU,
]);

/**
 * Replace every brand-whitelist match with a neutral placeholder so the
 * downstream tokeniser never sees the whitelisted span. Placeholder is a
 * non-matching ASCII sentinel that cannot collide with any forbidden token.
 */
function stripBrandWhitelist(text: string): string {
  let stripped = text;
  for (const pattern of BRAND_NAME_WHITELIST) {
    // `pattern` carries the `g` flag; create a fresh regex per pass to avoid
    // lastIndex state leaking between calls (each constant is global-shared).
    const fresh = new RegExp(pattern.source, pattern.flags);
    stripped = stripped.replace(fresh, ' __PROVEDO_BRAND__ ');
  }
  return stripped;
}

/**
 * Scan a single text field for Lane-A vocabulary violations.
 *
 * Order of operations:
 * 1. Strip brand whitelist matches (Provedo / провед-stem) from the scan
 *    window. Critical false-positive guard.
 * 2. Lowercase and tokenise on whitespace + punctuation.
 * 3. Per-token: check `FORBIDDEN_VERB_LOOKUP` then `FORBIDDEN_TA_LOOKUP`.
 * 4. Pattern-match the original (post-whitelist) text against
 *    `FORBIDDEN_PATTERNS` for collocations.
 *
 * Returns an empty array for clean text. Each violation is recorded once
 * per occurrence (callers may de-duplicate downstream if needed).
 */
export function scanForbiddenVocabulary(text: string): LaneAVocabularyViolation[] {
  if (text.length === 0) return [];

  const sanitised = stripBrandWhitelist(text);
  const lowered = sanitised.toLowerCase();
  const violations: LaneAVocabularyViolation[] = [];

  for (const token of lowered.split(WHITESPACE_PUNCT_SPLIT)) {
    if (token.length === 0) continue;
    if (FORBIDDEN_VERB_LOOKUP.has(token)) {
      violations.push({ token, tier: 'general' });
      continue;
    }
    if (FORBIDDEN_TA_LOOKUP.has(token)) {
      violations.push({ token, tier: 'ta' });
    }
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = sanitised.match(new RegExp(pattern.source, pattern.flags));
    if (match) {
      violations.push({ token: match[0], tier: 'pattern' });
    }
  }

  return violations;
}
