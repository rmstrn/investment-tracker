// Chat prompt catalog — Slice-LP6 fresh-eyes gap #2 + #5b.
//
// Powers the new ChatPromptPicker component (4 clickable chips below the hero
// ChatAppShell). Each chip drives an in-place replay of a pre-canned Q→A pair
// inside the existing ChatMockup machinery. NO backend, NO real LLM call —
// just predefined Q→A pairs cycling through the same chrome.
//
// Lane A discipline (HARD): every canned answer stays observation-coded.
// Allowed verbs: holds, notices, surfaces, reads, cites, shows, sees.
// Forbidden: should, recommend, suggest, advise, must, ought.
//
// Voice register: matches the §S1 hero answer (mono-token pills for tickers,
// dates, and amounts; one optional NEG token for the headline drawdown number;
// short editorial sentences; sources line beneath every answer).
//
// Sources discipline: each prompt carries its own sources array. The 4 chips
// surface 4 different question-shapes covering the strategist's «patterns in
// past trades» claim (chip #3) + the OG description's dividend-calendar
// mention (chip #4) — both previously buried.

export type ChatPromptId = 'why' | 'sector' | 'patterns' | 'dividends';

export type ChatSegmentKind = 'text' | 'mono' | 'neg';

export interface ChatSegment {
  kind: ChatSegmentKind;
  text: string;
}

export interface ChatPrompt {
  id: ChatPromptId;
  /** Short button-label shown on the chip (sentence-case, no terminal punctuation). */
  chipLabel: string;
  /** Verbatim user message — what types into the user bubble. */
  userMessage: string;
  /** Provedo answer split into typed-text segments (text / mono / neg). */
  responseSegments: readonly ChatSegment[];
  /** Cite items rendered in the Sources line beneath the response bubble. */
  sources: readonly string[];
}

// ─── Prompt #1 — «Why is my portfolio down?» (hero default, verbatim §S1) ───

const PROMPT_WHY: ChatPrompt = {
  id: 'why',
  chipLabel: 'Why is my portfolio down?',
  userMessage: 'Why is my portfolio down this month?',
  responseSegments: [
    { kind: 'text', text: "You're down " },
    { kind: 'neg', text: '−4.2%' },
    { kind: 'text', text: ' this month. ' },
    { kind: 'mono', text: '62%' },
    { kind: 'text', text: ' of the drawdown is two positions: ' },
    { kind: 'mono', text: 'Apple (−11%)' },
    { kind: 'text', text: ' after Q3 earnings on ' },
    { kind: 'mono', text: '2025-10-31' },
    { kind: 'text', text: ', and ' },
    { kind: 'mono', text: 'Tesla (−8%)' },
    { kind: 'text', text: ' after the ' },
    { kind: 'mono', text: '2025-10-22' },
    { kind: 'text', text: ' delivery miss. The rest of your portfolio is roughly flat.' },
  ],
  sources: [
    'AAPL Q3 earnings 2025-10-31',
    'TSLA Q3 delivery report 2025-10-22',
    'holdings via Schwab statement 2025-11-01',
  ],
};

// ─── Prompt #2 — «Show my sector exposure» (S4 Teaser 2 verbatim register) ──

const PROMPT_SECTOR: ChatPrompt = {
  id: 'sector',
  chipLabel: 'Show my sector exposure',
  userMessage: "What's my sector exposure across all brokers?",
  responseSegments: [
    { kind: 'text', text: 'Across both accounts, tech is ' },
    { kind: 'mono', text: '58%' },
    { kind: 'text', text: ' of your equity exposure — about ' },
    { kind: 'mono', text: '2x' },
    { kind: 'text', text: " the sector's weight in S&P 500 (" },
    { kind: 'mono', text: '~28%' },
    { kind: 'text', text: '). ' },
    { kind: 'mono', text: 'IBKR' },
    { kind: 'text', text: ' carries the bulk: ' },
    { kind: 'mono', text: 'AAPL ($14k)' },
    { kind: 'text', text: ', ' },
    { kind: 'mono', text: 'MSFT ($9k)' },
    { kind: 'text', text: ', ' },
    { kind: 'mono', text: 'NVDA ($8k)' },
    { kind: 'text', text: '. ' },
    { kind: 'mono', text: 'Schwab' },
    { kind: 'text', text: ' adds ' },
    { kind: 'mono', text: 'GOOG ($3k)' },
    { kind: 'text', text: ' and ' },
    { kind: 'mono', text: 'AMZN ($2k)' },
    { kind: 'text', text: '.' },
  ],
  sources: [
    'holdings via Schwab + IBKR statements 2025-11-01',
    'S&P 500 sector weights via S&P DJI methodology 2025-Q3',
  ],
};

// ─── Prompt #3 — «Any patterns in my recent trades?» (NEW, surfaces §gap-5b) ─
//
// Brand-strategist: most differentiated claim, only in OG description until now.
// Lane A: observation-coded — no «should», no «recommend», no «mistake» framing.
// Pattern surfacing reads as «here's the shape», not «here's the verdict».

const PROMPT_PATTERNS: ChatPrompt = {
  id: 'patterns',
  chipLabel: 'Any patterns in my recent trades?',
  userMessage: 'Any patterns in my recent trades?',
  responseSegments: [
    { kind: 'text', text: 'Across your last ' },
    { kind: 'mono', text: '24 trades' },
    { kind: 'text', text: ', two patterns surface. You sold ' },
    { kind: 'mono', text: 'NVDA' },
    { kind: 'text', text: ' on ' },
    { kind: 'mono', text: '2025-08-12' },
    { kind: 'text', text: ' and ' },
    { kind: 'mono', text: 'PLTR' },
    { kind: 'text', text: ' on ' },
    { kind: 'mono', text: '2025-09-03' },
    { kind: 'text', text: ' — both within ' },
    { kind: 'mono', text: '48h' },
    { kind: 'text', text: ' of an earnings beat. Both kept rising for the next ' },
    { kind: 'mono', text: '30 days' },
    { kind: 'text', text: ' (+' },
    { kind: 'mono', text: '14%' },
    { kind: 'text', text: ' and +' },
    { kind: 'mono', text: '9%' },
    { kind: 'text', text: '). Separately, your buys cluster on Mondays — ' },
    { kind: 'mono', text: '11 of 14' },
    {
      kind: 'text',
      text: " entries this quarter. No judgment, no advice — just what's in the trade ledger.",
    },
  ],
  sources: [
    'trade ledger via IBKR + Schwab 2025-Q3',
    'NVDA, PLTR price history via market data 2025-08 → 2025-10',
  ],
};

// ─── Prompt #4 — «What dividends are coming?» (NEW, uses dividend-calendar) ─
//
// Surfaces the dividend-calendar mention from OG description + S5 small bullet.
// Voice: scheduling-led, not yield-chasing. No «consider reinvesting» — that
// would be advice. Just the dates and amounts, with a Provedo notice at the end.

const PROMPT_DIVIDENDS: ChatPrompt = {
  id: 'dividends',
  chipLabel: 'What dividends are coming?',
  userMessage: 'What dividends are coming this quarter?',
  responseSegments: [
    { kind: 'text', text: 'Three dividends are scheduled across your accounts. ' },
    { kind: 'mono', text: 'KO' },
    { kind: 'text', text: ' pays ' },
    { kind: 'mono', text: '$48' },
    { kind: 'text', text: ' on ' },
    { kind: 'mono', text: '2025-09-14' },
    { kind: 'text', text: ', ' },
    { kind: 'mono', text: 'VZ' },
    { kind: 'text', text: ' pays ' },
    { kind: 'mono', text: '$72' },
    { kind: 'text', text: ' on ' },
    { kind: 'mono', text: '2025-10-07' },
    { kind: 'text', text: ', and ' },
    { kind: 'mono', text: 'MSFT' },
    { kind: 'text', text: ' pays ' },
    { kind: 'mono', text: '$31' },
    { kind: 'text', text: ' on ' },
    { kind: 'mono', text: '2025-11-19' },
    { kind: 'text', text: '. Total this quarter: ' },
    { kind: 'mono', text: '$151' },
    { kind: 'text', text: '. KO and VZ both grew their payouts vs last quarter; MSFT held flat.' },
  ],
  sources: [
    'KO, VZ, MSFT dividend declarations via issuer IR pages 2025-Q3',
    'holdings via Schwab + IBKR statements 2025-11-01',
  ],
};

export const CHAT_PROMPTS: readonly ChatPrompt[] = [
  PROMPT_WHY,
  PROMPT_SECTOR,
  PROMPT_PATTERNS,
  PROMPT_DIVIDENDS,
] as const;

export const DEFAULT_PROMPT_ID: ChatPromptId = 'why';

export function getPromptById(id: ChatPromptId): ChatPrompt {
  const found = CHAT_PROMPTS.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Unknown chat prompt id: ${id}`);
  }
  return found;
}
