'use client';

import { useToast } from '@investment-tracker/ui';
import { useRouter } from 'next/navigation';
import { useCreateConversation } from '../../hooks/useCreateConversation';
import { TierLimitError } from '../../lib/api/ai';
import { EmptyConversationState } from './empty-conversation-state';

/**
 * Rendered at `/chat` when the user has zero conversations. Picking a
 * suggested prompt (or the [New chat] button in the sidebar) creates a
 * conversation and routes to its detail page — the prompt itself is
 * dispatched after the route lands (deferred to the detail page to keep
 * stream ownership in one place).
 */
export function EmptyChatShell() {
  const router = useRouter();
  const { toast } = useToast();
  const create = useCreateConversation();

  const startConversation = () => {
    create.mutate(undefined, {
      onSuccess: (conv) => {
        router.push(`/chat/${conv.id}`);
      },
      onError: (err) => {
        if (err instanceof TierLimitError) {
          toast({
            title: 'Daily AI limit reached',
            description: 'Upgrade to Plus for more conversations.',
            tone: 'warning',
          });
          return;
        }
        toast({
          title: 'Could not start chat',
          description: err.message,
          tone: 'negative',
        });
      },
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <EmptyConversationState onPick={startConversation} disabled={create.isPending} />
    </div>
  );
}
