import { SuggestedPrompt, SuggestedPromptRow } from '@investment-tracker/ui';

export interface EmptyConversationStateProps {
  onPick: (prompt: string) => void;
  /** Disable while a new conversation is being created. */
  disabled?: boolean;
}

// Generic portfolio-literate prompts — factual, never advisory. Align with
// design brief §14.1 Behavioral Coach framing.
const DEFAULT_PROMPTS = [
  'What was my best-performing position this month?',
  'Show me my allocation by asset type',
  'Explain today’s portfolio change',
  'How diversified is my portfolio?',
] as const;

export function EmptyConversationState({ onPick, disabled }: EmptyConversationStateProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-12 text-center">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">Ask your portfolio anything</h2>
        <p className="text-sm text-text-secondary">
          Provedo has read-only access to your positions, transactions, and market data. Try one of
          these:
        </p>
      </div>
      <SuggestedPromptRow className="justify-center">
        {DEFAULT_PROMPTS.map((p) => (
          <SuggestedPrompt key={p} disabled={disabled} onClick={() => onPick(p)}>
            {p}
          </SuggestedPrompt>
        ))}
      </SuggestedPromptRow>
    </div>
  );
}
