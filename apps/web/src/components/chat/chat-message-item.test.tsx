import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AIMessage, AIMessageContent } from '../../lib/api/ai';
import { ChatMessageItem } from './chat-message-item';

function makeMessage(overrides: Partial<AIMessage> = {}): AIMessage {
  return {
    id: 'm-1',
    conversation_id: 'c-1',
    role: 'assistant',
    content: [],
    tokens_used: 42,
    created_at: '2026-04-20T10:00:00Z',
    ...overrides,
  };
}

describe('ChatMessageItem', () => {
  it('renders a user text message', () => {
    const msg = makeMessage({
      role: 'user',
      content: [{ type: 'text', text: 'Hello Claude' }],
    });
    render(<ChatMessageItem message={msg} />);
    expect(screen.getByText('Hello Claude')).toBeInTheDocument();
  });

  it('renders tool_use block with used-name label', () => {
    const msg = makeMessage({
      content: [
        {
          type: 'tool_use',
          tool_use_id: 't-1',
          name: 'get_portfolio',
          input: { currency: 'EUR' },
        },
      ],
    });
    render(<ChatMessageItem message={msg} />);
    expect(screen.getByText('Used get_portfolio')).toBeInTheDocument();
  });

  it('renders an impact_card block with scenario + before/after', () => {
    const snapshot = {
      snapshot_date: '2026-04-20',
      values: {
        base: { currency: 'USD', total_value: '1000.00', total_cost: '900.00' },
        display: {
          currency: 'USD',
          total_value: '1000.00',
          total_cost: '900.00',
          fx_rate: '1',
          fx_date: '2026-04-20',
        },
      },
      allocation: {},
      by_asset_type: {},
      by_currency: {},
    };
    const after = {
      ...snapshot,
      values: {
        ...snapshot.values,
        display: { ...snapshot.values.display, total_value: '900.00' },
      },
    };
    const content: AIMessageContent = {
      type: 'impact_card',
      scenario: 'USD drops 10%',
      before: snapshot,
      after,
      top_affected_positions: [
        {
          symbol: 'AAPL',
          asset_type: 'stock',
          value_before: '500.00',
          value_after: '450.00',
          delta_percent: -0.1,
        },
      ],
      narrative: 'A 10% USD drop knocks ~100 off total value.',
    };
    render(<ChatMessageItem message={makeMessage({ content: [content] })} />);
    expect(screen.getByText('USD drops 10%')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('-10.00%')).toBeInTheDocument();
  });

  it('renders an explainer callout with glossary slug', () => {
    const content: AIMessageContent = {
      type: 'callout',
      kind: 'explainer',
      title: 'What is P&L?',
      body: 'Profit and loss — the difference between cost basis and current value.',
      term_slug: 'pnl',
    };
    render(<ChatMessageItem message={makeMessage({ content: [content] })} />);
    expect(screen.getByText('What is P&L?')).toBeInTheDocument();
    expect(screen.getByText(/glossary:/)).toBeInTheDocument();
    expect(screen.getByText('pnl')).toBeInTheDocument();
  });
});
