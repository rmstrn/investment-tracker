/**
 * Provedo landing v1 copy — single source of truth.
 *
 * All customer-facing copy on the landing surface lives here so:
 *   1. The FAQ array drives BOTH the visual <FAQ /> section AND the
 *      buildFAQPageSchema() JSON-LD emission (zero drift between
 *      visible Q+A and structured data).
 *   2. Voice-banlist verification (no «advice / recommend / strategy /
 *      suggest / advisor» in marketing prose) is greppable in one file.
 *   3. Any per-section copy edit is one edit, not three section-file
 *      edits.
 *
 * Source: D1_LANDING_SYNTHESIS_LOCK.md (PO-greenlit) +
 *         v2_content-lead_landing.md (10 FAQ + winners + ban-verified)
 */

import type { FaqItem } from '../../../lib/seo/json-ld';

/* ── Hero ─────────────────────────────────────────────────────────── */

export const HERO_EYEBROW = 'Provedo · Pre-alpha';

/** Locked hero H1 (47 chars, content-lead v2 winner). */
export const HERO_H1 = 'Every holding. Every broker. One conversation.';

/** Sub-spine of the brand. */
export const HERO_SUB =
  'A read-only assistant that knows what you actually own — across brokers, in one chat — and answers in observations, not instructions.';

export const HERO_PRIMARY_CTA = 'Open an account';
export const HERO_PRIMARY_CTA_AUTHED = 'Open dashboard';
export const HERO_SECONDARY_CTA = 'See a sample chat';

export const HERO_DISCLAIMER_CHIP = 'Information only — not a broker, not an advisor.';

/* ── Reality strip (anti-positioning) ─────────────────────────────── */

export const REALITY_HEADER = "What Provedo is, and what it isn't.";
export const REALITY_SUB = 'Read this once. Then everything else makes sense.';

export const REALITY_IS_NOT: ReadonlyArray<string> = [
  'A registered investment advisor',
  'A broker',
  'A trading platform',
  'A robo-advisor',
  'A dividend terminal',
  'A price predictor',
];

export const REALITY_IS: ReadonlyArray<string> = [
  'A read-only multi-broker aggregator',
  'A chat-first AI that knows what you own',
  'Pattern detection on your own historical trades',
];

/* ── Live preview section ─────────────────────────────────────────── */

export const PREVIEW_EYEBROW = 'On the record';
export const PREVIEW_HEADER = 'The dashboard you actually get.';
export const PREVIEW_SUB =
  'Sample portfolio, real layout. Aggregated values, sourced datestamps, observed drift.';

/* ── Three modes ──────────────────────────────────────────────────── */

export const MODES_HEADER = 'Three things it does. Three things it refuses.';

export const MODES_ITEMS: ReadonlyArray<{
  title: string;
  body: string;
  refusal: string;
}> = [
  {
    title: 'Aggregate every account.',
    body: 'Brokerages, retirement accounts, crypto wallets — added manually today, connected automatically as integrations land. One view across currencies and providers.',
    refusal: 'It will not place a trade for you.',
  },
  {
    title: 'Answer in plain language.',
    body: 'Ask anything that can be answered from the data you connected — concentration, cost basis, dividend timing, currency exposure. The chat knows your actual positions.',
    refusal: 'It will not tell you what to buy, sell, or hold.',
  },
  {
    title: 'Name patterns in your history.',
    body: 'It reads the trades you already made and surfaces repetitions in plain language — average holding period for winners versus losers, sizing patterns, frequency near earnings.',
    refusal: 'It will not predict the next print.',
  },
];

/* ── AI sample row ────────────────────────────────────────────────── */

export const SAMPLE_HEADER = 'Plain questions. Plain answers.';
export const SAMPLE_SUB = 'Three real exchanges from the assistant. No edits, no verdicts.';

export const SAMPLE_EXCHANGES: ReadonlyArray<{
  question: string;
  answer: string;
}> = [
  {
    question: 'How concentrated am I?',
    answer:
      'Your top three positions are 64% of the portfolio. NVDA alone is 31%. Six months ago that was 22%.',
  },
  {
    question: 'What did dividends do this year?',
    answer:
      'Year-to-date dividends are $4,217 across 11 holdings. JNJ, MSFT, and PEP account for 58%. April was the largest month at $1,108.',
  },
  {
    question: 'Do I sell winners too early?',
    answer:
      'Of your 32 closed positions, 19 were sold within 90 days of purchase. 12 of those continued upward in the 180 days after. This is a pattern — not a verdict on it.',
  },
];

/* ── Trust ledger ─────────────────────────────────────────────────── */

export const TRUST_HEADER = 'Read-only by structure, not by promise.';
export const TRUST_SUB = 'The boundary is the product, not a disclaimer attached to it.';

export const TRUST_ITEMS: ReadonlyArray<{
  title: string;
  body: string;
}> = [
  {
    title: 'Read-only access.',
    body: 'Provedo connects to brokers in read-only mode. There is no path through our infrastructure that places, routes, or settles a trade.',
  },
  {
    title: 'Cannot move funds.',
    body: 'No withdrawal credentials. No transfer permissions. The keys we hold can read; they cannot write.',
  },
  {
    title: 'Your data, scoped to you.',
    body: 'Encrypted at rest, scoped to your account, never sold, never shared with advertisers, never used to train third-party models.',
  },
];

/* ── For whom ─────────────────────────────────────────────────────── */

export const AUDIENCE_HEADER = 'Who this is for.';

export const AUDIENCE_GROUPS: ReadonlyArray<{
  who: string;
  detail: string;
}> = [
  {
    who: 'People who hold positions across more than one account',
    detail:
      'and are tired of stitching the picture together by hand. One view across brokerages, retirement accounts, and crypto wallets — in the same currency.',
  },
  {
    who: 'People who want context before they act',
    detail:
      'and would rather see their own data named clearly than be told what to do with it. Observations, never instructions.',
  },
];

/* ── Pricing teaser ───────────────────────────────────────────────── */

export const PRICING_HEADER = 'Free during pre-alpha.';
export const PRICING_SUB =
  'Pricing arrives when the product earns it, not before. We will tell you in advance.';
export const PRICING_CTA = 'See pricing';

/* ── FAQ — drives BOTH visual section AND FAQPage JSON-LD ─────────── */

export const FAQ_HEADER = 'Questions, answered plainly.';

export const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: 'Is Provedo a broker?',
    answer:
      'No. Provedo is read-only. It does not place, route, or settle trades. It reads what your accounts already contain and lets you ask questions about it.',
  },
  {
    question: 'Is Provedo an advisor?',
    answer:
      'No. Provedo describes what it sees in your portfolio. It does not tell you what to buy, sell, or hold. The boundary is the product, not a disclaimer attached to it.',
  },
  {
    question: 'What can I actually ask it?',
    answer:
      "Anything that can be answered from the data you've connected — concentration, cost basis, dividend timing, currency exposure, repetitions in your own trade history. If the answer requires a forecast or a verdict, the assistant says so and stops.",
  },
  {
    question: 'How do my accounts connect today?',
    answer:
      'During pre-alpha, you import positions and transactions manually, by spreadsheet or paste. Direct broker connections are landing across pre-alpha and into beta. The order is determined by which integrations clear our security review, not by which are loudest.',
  },
  {
    question: 'Where is my data, and who sees it?',
    answer:
      'Your data is yours. We store it encrypted, scoped to your account, and we do not sell it, share it with advertisers, or use it to train third-party models. Read-only on broker side; locked-down on our side.',
  },
  {
    question: 'What does "pattern detection" actually do?',
    answer:
      'It reads the trades you already made and surfaces repetitions in plain language — average holding period for winners versus losers, frequency of buying near earnings, sizing patterns around volatility. It names patterns. It does not grade them.',
  },
  {
    question: 'Can it predict the market?',
    answer:
      'No. Provedo describes the present and your past. It does not forecast prices, returns, or any future market state. Anyone — software or human — that promises the next print is selling something other than software.',
  },
  {
    question: 'Why is it free right now?',
    answer:
      'Pre-alpha. We are still shaping the product with the people using it. Pricing arrives when the product earns it, not before. We will tell you in advance.',
  },
  {
    question: 'Who is this for?',
    answer:
      'People who hold positions across more than one account and are tired of stitching the picture together by hand. People who want context before they act, and who would rather see their own data named clearly than be told what to do with it.',
  },
  {
    question: 'Why "observations, not instructions"?',
    answer:
      'Because everything else is already taken. There is no shortage of products willing to tell you what to do. There is a shortage of products willing to show you what is there and let you decide. We picked the second job.',
  },
];

/* ── Pre-alpha truth (above final CTA) ────────────────────────────── */

export const TRUTH_HEADER = 'Honest about being early.';
export const TRUTH_BODY =
  "Sign up with email or Google. You'll land on an empty dashboard — add a manual account, then ask the AI anything. Broker connections are on the roadmap.";

/* ── Closing CTA ──────────────────────────────────────────────────── */

export const CLOSING_HEADER = 'Open an account.';
export const CLOSING_SUB = 'Read-only. Free during pre-alpha. Bring your own holdings.';

/* ── Footer disclaimer ────────────────────────────────────────────── */

export const FOOTER_DISCLAIMER =
  'Provedo is an information service. It is not a broker-dealer, not a registered investment advisor, and not a fiduciary. Nothing in Provedo — including chat output, pattern detection, and any visualization — constitutes a personalized recommendation, an offer to buy or sell a security, or a forecast of future performance. Markets involve risk, including the loss of principal. Decisions about your accounts are yours. Past patterns do not predict future outcomes.';
