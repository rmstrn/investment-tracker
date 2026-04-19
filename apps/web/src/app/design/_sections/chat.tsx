'use client';

import {
  Button,
  ChatInputPill,
  ChatMessage,
  ExplainerTooltip,
  SuggestedPrompt,
  SuggestedPromptRow,
  ThinkingDots,
  ToolUseCard,
  TypingCursor,
} from '@investment-tracker/ui';
import { useState } from 'react';

/**
 * Chat / AI primitives showcase. Brief §5.2, §14.3.
 */
export function ChatSection() {
  return (
    <section id="chat" className="space-y-10 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Chat &amp; AI primitives</h2>
        <p className="text-sm text-text-secondary">
          Everything the AI chat surface needs — input pill, suggested prompts, tool-use
          visualization, typing cursor, thinking dots, and the explainer tooltip.
        </p>
      </div>

      <Sub title="ChatInputPill (brief §5.2)">
        <InputDemo />
      </Sub>

      <Sub title="SuggestedPrompt row — dashboard AI card">
        <SuggestedPromptRow>
          <SuggestedPrompt>Should I rebalance?</SuggestedPrompt>
          <SuggestedPrompt>How did I beat the market?</SuggestedPrompt>
          <SuggestedPrompt>Explain my top gainer</SuggestedPrompt>
        </SuggestedPromptRow>
      </Sub>

      <Sub title="ToolUseCard — chat tool visualization">
        <div className="space-y-2 max-w-lg">
          <ToolUseCard runningLabel="Looking up your positions…" status="running" />
          <ToolUseCard
            runningLabel="Looking up your positions…"
            completedLabel="Checked 23 positions"
            status="done"
          >
            <pre className="whitespace-pre-wrap">
              {`{\n  "positions": 23,\n  "top": ["AAPL", "VOO", "NVDA"]\n}`}
            </pre>
          </ToolUseCard>
        </div>
      </Sub>

      <Sub title="TypingCursor + ThinkingDots">
        <div className="space-y-3 max-w-lg">
          <p className="text-base text-text-primary">
            Your portfolio is up <strong>+$1,204</strong> today, driven by
            <TypingCursor />
          </p>
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <span>AI is preparing a response</span>
            <ThinkingDots />
          </div>
        </div>
      </Sub>

      <Sub title="ExplainerTooltip — dotted term (brief §14.3)">
        <p className="text-base text-text-primary max-w-xl">
          Your portfolio has a{' '}
          <ExplainerTooltip
            definition="The Sharpe ratio measures risk-adjusted return — higher is better. Above 1.0 is considered good."
            onLearnMore={() => window.alert('Opens chat with: Explain Sharpe ratio')}
          >
            Sharpe ratio
          </ExplainerTooltip>{' '}
          of 1.24 this year, which is above the S&amp;P 500. Consider tightening your{' '}
          <ExplainerTooltip definition="Max drawdown — the biggest peak-to-trough loss over a period.">
            drawdown
          </ExplainerTooltip>{' '}
          exposure.
        </p>
      </Sub>

      <Sub title="ChatMessage — user / assistant / system">
        <div className="max-w-xl space-y-3 rounded-md border border-border-subtle bg-background-elevated p-4">
          <ChatMessage role="system">Apr 18, 2026</ChatMessage>
          <ChatMessage role="user" timestamp="10:24">
            Why is my portfolio down today?
          </ChatMessage>
          <ChatMessage role="assistant" timestamp="10:24">
            Your portfolio is down 1.2% today, mostly because of a 2.1% drop in NVDA which makes up
            18% of your holdings. Tech broadly is -0.8% on the day.
          </ChatMessage>
        </div>
      </Sub>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">{title}</h3>
      {children}
    </div>
  );
}

function InputDemo() {
  const [v, setV] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="max-w-lg space-y-2">
      <ChatInputPill
        value={v}
        onChange={(e) => setV(e.target.value)}
        onSubmit={(val) => {
          setSent((s) => [...s, val]);
          setV('');
        }}
      />
      {sent.length > 0 ? (
        <div className="space-y-1 rounded-md border border-border-subtle bg-background-secondary p-3 text-sm">
          <div className="font-mono text-[11px] text-text-tertiary">Sent:</div>
          {sent.map((m, i) => (
            <div key={i} className="text-text-primary">
              {m}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSent([])}
            className="mt-2"
          >
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
}
