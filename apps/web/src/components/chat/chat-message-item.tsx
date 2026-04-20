import { ChatMessage, ToolUseCard } from '@investment-tracker/ui';
import type { AIMessage, AIMessageContent, AIMessageRenderableContent } from '../../lib/api/ai';
import { CalloutView } from './callout-view';
import { ImpactCardView } from './impact-card-view';

export interface ChatMessageItemProps {
  message: AIMessage;
}

/**
 * Renders a persisted assistant / user / tool message from the conversation
 * history. `impact_card` and `callout` blocks only surface here — they are
 * never emitted live through the stream (see `apps/api/internal/sseproxy/
 * collector.go:58-60`).
 */
export function ChatMessageItem({ message }: ChatMessageItemProps) {
  if (message.role === 'user') {
    return (
      <ChatMessage role="user">
        <span className="whitespace-pre-wrap break-words">{plainText(message.content)}</span>
      </ChatMessage>
    );
  }

  // Assistant / tool: render each block in order.
  return (
    <div className="flex flex-col gap-3">
      {message.content.map((block, idx) => (
        <BlockRenderer key={`${message.id}-${idx}`} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: AIMessageContent }) {
  switch (block.type) {
    case 'text':
      return (
        <ChatMessage role="assistant">
          <span className="whitespace-pre-wrap break-words">{block.text}</span>
        </ChatMessage>
      );
    case 'tool_use':
      return (
        <ToolUseCard runningLabel={`Used ${block.name}`} status="done">
          <pre className="whitespace-pre-wrap break-all text-xs">
            {JSON.stringify(block.input, null, 2)}
          </pre>
        </ToolUseCard>
      );
    case 'tool_result':
      return (
        <ToolUseCard
          runningLabel="Tool result"
          completedLabel={block.is_error ? 'Tool failed' : 'Tool completed'}
          status="done"
        >
          <div className="space-y-2 text-xs">
            {block.content.map((inner: AIMessageRenderableContent, i: number) => (
              <RenderableInner key={`${i}-${inner.type}`} block={inner} />
            ))}
          </div>
        </ToolUseCard>
      );
    case 'impact_card':
      return <ImpactCardView data={block} />;
    case 'callout':
      return <CalloutView data={block} />;
    default:
      return null;
  }
}

function RenderableInner({ block }: { block: AIMessageRenderableContent }) {
  switch (block.type) {
    case 'text':
      return <pre className="whitespace-pre-wrap break-words">{block.text}</pre>;
    case 'impact_card':
      return <ImpactCardView data={block} />;
    case 'callout':
      return <CalloutView data={block} />;
    default:
      return null;
  }
}

function plainText(content: AIMessage['content']): string {
  return content
    .filter((b): b is Extract<AIMessageContent, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}
