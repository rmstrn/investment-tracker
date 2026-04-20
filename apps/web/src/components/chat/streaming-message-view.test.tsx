import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { LiveAssistantMessage } from '../../lib/ai/chat-reducer';
import { StreamingMessageView } from './streaming-message-view';

function makeMessage(blocks: LiveAssistantMessage['blocks'] = []): LiveAssistantMessage {
  return {
    messageId: 'm-1',
    conversationId: 'c-1',
    blocks,
    tokensUsed: null,
    stopReason: null,
  };
}

describe('StreamingMessageView', () => {
  it('renders ThinkingDots while no blocks are open yet', () => {
    render(<StreamingMessageView message={makeMessage()} streaming />);
    expect(screen.getByRole('status', { name: /thinking/i })).toBeInTheDocument();
  });

  it('renders accumulated text with cursor on the last text block', () => {
    const message = makeMessage([
      { kind: 'text', index: 0, text: 'Looking at your portfolio', open: true },
    ]);
    const { container } = render(<StreamingMessageView message={message} streaming />);
    expect(screen.getByText(/Looking at your portfolio/)).toBeInTheDocument();
    // Cursor is aria-hidden — query by selector rather than role.
    expect(container.querySelector('[aria-hidden="true"].inline-block')).toBeTruthy();
  });

  it('renders a tool_use block with friendly running label', () => {
    const message = makeMessage([
      {
        kind: 'tool_use',
        index: 0,
        tool_use_id: 't-1',
        name: 'get_portfolio',
        input: { currency: 'EUR' },
      },
    ]);
    render(<StreamingMessageView message={message} streaming />);
    expect(screen.getByText('Looking at your portfolio…')).toBeInTheDocument();
  });

  it('drops the cursor once streaming ends', () => {
    const message = makeMessage([{ kind: 'text', index: 0, text: 'Done.', open: false }]);
    const { container } = render(<StreamingMessageView message={message} streaming={false} />);
    expect(screen.getByText('Done.')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"].inline-block')).toBeNull();
  });
});
