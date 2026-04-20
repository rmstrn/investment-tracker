import { ChatMessage, ThinkingDots, ToolUseCard, TypingCursor } from '@investment-tracker/ui';
import type { LiveAssistantMessage } from '../../lib/ai/chat-reducer';

export interface StreamingMessageViewProps {
  message: LiveAssistantMessage;
  /** `true` while the stream is still open (TypingCursor on last text block). */
  streaming: boolean;
}

/**
 * Pure-presentation render of the in-flight assistant message. Consumed
 * by `<ChatViewLive>` and driven by `chat-reducer`. Splitting this out
 * matches the Slice 2 pattern (`PositionPriceChartView`) so the stateful
 * orchestration stays test-free and rendering stays snapshot-testable.
 */
export function StreamingMessageView({ message, streaming }: StreamingMessageViewProps) {
  if (message.blocks.length === 0) {
    return (
      <ChatMessage role="assistant">
        <ThinkingDots />
      </ChatMessage>
    );
  }
  const lastTextIndex = findLastTextIndex(message.blocks);
  return (
    <div className="flex flex-col gap-3">
      {message.blocks.map((block, idx) => {
        const key = `${block.kind}-${block.index}`;
        if (block.kind === 'text') {
          const showCursor = streaming && idx === lastTextIndex;
          return (
            <ChatMessage key={key} role="assistant">
              <span>
                {block.text}
                {showCursor ? <TypingCursor /> : null}
              </span>
            </ChatMessage>
          );
        }
        if (block.kind === 'tool_use') {
          return (
            <ToolUseCard key={key} runningLabel={toolRunningLabel(block.name)} status="running">
              <pre className="whitespace-pre-wrap break-all text-xs">
                {JSON.stringify(block.input, null, 2)}
              </pre>
            </ToolUseCard>
          );
        }
        // tool_result
        return (
          <ToolUseCard
            key={key}
            runningLabel="Tool result"
            completedLabel={block.is_error ? 'Tool failed' : 'Tool completed'}
            status="done"
          >
            <pre className="whitespace-pre-wrap break-words text-xs">{block.text}</pre>
          </ToolUseCard>
        );
      })}
    </div>
  );
}

function findLastTextIndex(blocks: LiveAssistantMessage['blocks']): number {
  for (let i = blocks.length - 1; i >= 0; i -= 1) {
    if (blocks[i]?.kind === 'text') return i;
  }
  return -1;
}

function toolRunningLabel(name: string): string {
  switch (name) {
    case 'get_portfolio':
    case 'get_portfolio_snapshot':
      return 'Looking at your portfolio…';
    case 'get_positions':
      return 'Checking your positions…';
    case 'get_transaction_history':
      return 'Reading transaction history…';
    case 'get_market_quote':
      return 'Pulling market quote…';
    case 'get_market_history':
      return 'Fetching price history…';
    default:
      return `Running ${name}…`;
  }
}
