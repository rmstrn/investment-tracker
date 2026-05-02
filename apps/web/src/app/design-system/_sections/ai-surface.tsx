import { Search } from 'lucide-react';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';
import { RecordRail } from '../_components/RecordRail';

/**
 * §AI Surface — what an AI insight looks like under D1.
 *
 * The 5 sample messages from the D1 spec rendered as Record Rail
 * entries (NOT chat rows). Past-tense, source-attributed, no advisory
 * verbs. The filter input above is «filter, not composer» — a search
 * affordance, never a chat input.
 */

interface AiMessage {
  readonly label: string;
  readonly dateTime: string;
  readonly body: string;
}

const MESSAGES: ReadonlyArray<AiMessage> = [
  {
    label: 'MAY 01 · 09:14',
    dateTime: '2026-05-01T09:14:00Z',
    body: 'Your Q1 win was 71% FX tailwind, not stock-picking. EUR/USD did the heavy lifting.',
  },
  {
    label: 'APR 30',
    dateTime: '2026-04-30T16:20:00Z',
    body: 'MSFT crossed 12% of portfolio. Last drift observation was 8 weeks ago at 9%.',
  },
  {
    label: 'APR 28',
    dateTime: '2026-04-28T11:08:00Z',
    body: '$1,240 in dividends settled this week. 84% from 3 holdings.',
  },
  {
    label: 'APR 25',
    dateTime: '2026-04-25T14:32:00Z',
    body: 'Your IBKR cash sleeve grew $4,800 this month. Last deployed 6 weeks ago.',
  },
  {
    label: 'APR 22',
    dateTime: '2026-04-22T10:05:00Z',
    body: 'Energy sector now 18% of equity. Sector cap (per your own rule, set Mar 11) is 15%.',
  },
];

export function AiSurfaceSection() {
  return (
    <DsSection
      id="ai-surface"
      eyebrow="11 · AI Surface"
      title="On the record, by date"
      lede="No avatars, no bylines, no chat-row hover ↗. Each AI insight is a Record Rail entry — the tick says «Provedo entered this in the record», the datestamp is the byline, the body is the observation."
    >
      <DsRow label="FIVE EXAMPLE MESSAGES">
        <div
          style={{
            background: 'var(--d1-bg-card)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--d1-border-hairline)',
          }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 12,
            }}
          >
            <RecordRail label="INSIGHTS" />
            <div className="d1-chat__search" style={{ width: 220 }}>
              <Search size={14} aria-hidden />
              <span>Filter — not compose</span>
            </div>
          </header>
          <ul className="d1-insights">
            {MESSAGES.map((m) => (
              <li className="d1-insight" key={m.dateTime}>
                <RecordRail label={m.label} mode="entry" dateTime={m.dateTime} />
                <p className="d1-insight__body">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </DsRow>

      <DsRow label="LANGUAGE RULES">
        <div className="ds-grid-2">
          <DsCallout heading="Past-tense, source-attributed">
            «Q1 win was 71% FX tailwind» — not «You should rotate out of equities.» Provedo notices
            what happened; it does not prescribe what to do.
          </DsCallout>
          <DsCallout heading="No advisory verbs">
            Banned: «recommend», «suggest», «consider», «should», «buy», «sell», «rotate». The rail
            anchors observation; advisory verbs would break Lane A and the «no advice» disclaimer.
          </DsCallout>
          <DsCallout heading="Filter, not composer">
            The input above the entries is a search affordance for the existing record. Provedo does
            not accept user prompts — it surfaces patterns. No chat back, no «↗» reveal, no quick
            reply.
          </DsCallout>
          <DsCallout heading="One rail per entry">
            Long bodies wrap. Numbers anchor inline via `.d1-num` (Geist Mono tabular). The rail
            does not repeat per body line.
          </DsCallout>
        </div>
      </DsRow>
    </DsSection>
  );
}
