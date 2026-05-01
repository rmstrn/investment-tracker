import { Fragment } from 'react';
import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §AI Dossier — D3 message panel anatomy.
 *
 * Per D3-luxe-variant.md §6 + KICKOFF §0: NO avatars, NO emoji, NO
 * relative times («3 min ago»). Absolute timestamps in JetBrains Mono.
 * The «PROVEDO» wordmark serves as the byline — there is no chat
 * affordance, no composer, no «reply». Each row carries an underplayed
 * CTA: «Review setting», «See breakdown», «Open», «Disclosure». The
 * surface reads as a private banker's note, not a chat thread.
 *
 * Inline numerals are wrapped in `.ds-num` — JetBrains Mono tabular,
 * so dollar amounts and percentages line up across messages.
 */

interface MessageBodyChunk {
  readonly text?: string;
  readonly num?: string;
}

interface DossierMessage {
  readonly time: string;
  readonly body: readonly MessageBodyChunk[];
  readonly cta: string;
}

const MESSAGES: readonly DossierMessage[] = [
  {
    time: 'PROVEDO  ·  09:14:02',
    body: [
      { text: 'Your IBKR USD cash sleeve is at ' },
      { num: '$ 12,480' },
      { text: ' — that’s ' },
      { num: '8.3%' },
      { text: ' of total USD exposure. Above your ' },
      { num: '5%' },
      { text: ' self-set ceiling since 2026-04-22.' },
    ],
    cta: 'Review setting',
  },
  {
    time: 'PROVEDO  ·  09:15:48',
    body: [
      { text: 'Three positions account for ' },
      { num: '64%' },
      { text: ' of unrealised P&L this month: ' },
      { num: 'NVDA' },
      { text: ', ' },
      { num: 'ASML' },
      { text: ', ' },
      { num: 'LVMH' },
      { text: '. Concentration up from ' },
      { num: '51%' },
      { text: ' thirty days ago.' },
    ],
    cta: 'See breakdown',
  },
  {
    time: 'PROVEDO  ·  09:22:11',
    body: [
      { text: 'A scheduled corporate action affects ' },
      { num: 'LVMH' },
      { text: ' on 2026-05-08 — interim dividend of ' },
      { num: '€ 5.50' },
      { text: ' per share. Currency lands in your default sleeve unless you preempt.' },
    ],
    cta: 'Open',
  },
  {
    time: 'PROVEDO  ·  09:31:04',
    body: [
      { text: 'New broker statement reconciled — IBKR ' },
      { num: '04/2026' },
      { text: '. Two minor variances under ' },
      { num: '$ 0.50' },
      { text: ' on cash interest. Treated as broker rounding; logged for audit.' },
    ],
    cta: 'Open audit log',
  },
  {
    time: 'PROVEDO  ·  09:42:39',
    body: [
      { text: 'Reminder — your ' },
      { num: '90-day' },
      {
        text: ' rebalance review is due 2026-05-15. Last review held all weights inside band; current drift suggests one position to revisit.',
      },
    ],
    cta: 'Disclosure',
  },
];

export function AiDossierSection() {
  return (
    <SectionShell
      id="ai-dossier"
      title="AI Dossier"
      meta="NO AVATARS · NO EMOJI · ABSOLUTE TIME"
      description="The dossier surface is a private banker's note, not a chat thread. No avatars, no emoji, no relative times. Every message carries an underplayed CTA — never 'reply', never a composer affordance."
    >
      <DsRow label="Dossier panel — five example messages">
        <div className="ds-dossier">
          <header className="ds-dossier__head">
            <h3 className="ds-dossier__title">Today’s briefing</h3>
            <span className="ds-dossier__meta">2026-04-29 · 5 entries</span>
          </header>
          <ul className="ds-dossier__list">
            {MESSAGES.map((msg) => (
              <li key={msg.time} className="ds-dossier__row">
                <p className="ds-dossier__byline">{msg.time}</p>
                <p className="ds-dossier__msg">
                  {msg.body.map((chunk, index) => {
                    // Each row's chunks are stable across renders (static
                    // fixture); composing key from message time + index
                    // gives a deterministic key without forcing chunk
                    // identifiers into the fixture shape.
                    const chunkKey = `${msg.time}-${index}`;
                    return (
                      <Fragment key={chunkKey}>
                        {chunk.text}
                        {chunk.num ? <span className="ds-num">{chunk.num}</span> : null}
                      </Fragment>
                    );
                  })}
                </p>
                <a className="ds-dossier__cta" href="#ai-dossier">
                  {msg.cta}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </DsRow>

      <DsRow label="Why no avatars / no emoji / no relative time">
        <p className="ds-prose">
          The dossier surface borrows from a private banker’s morning note — typed, signed, dated,
          archived. Avatars and emoji would code it as a consumer chat (Slack, iMessage). Relative
          times («3 min ago») would code it as a feed. Both undermine the dossier metaphor.
        </p>
      </DsRow>
    </SectionShell>
  );
}
