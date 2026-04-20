'use client';

import { useToast } from '@investment-tracker/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useConversations } from '../../hooks/useConversations';
import { useCreateConversation } from '../../hooks/useCreateConversation';
import { useDeleteConversation } from '../../hooks/useDeleteConversation';
import { TierLimitError } from '../../lib/api/ai';
import { ConversationsSidebar } from './conversations-sidebar';

export interface ConversationsSidebarLiveProps {
  activeId: string | null;
}

export function ConversationsSidebarLive({ activeId }: ConversationsSidebarLiveProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, isError, fetchNextPage, hasNextPage } = useConversations();
  const createMutation = useCreateConversation();
  const deleteMutation = useDeleteConversation();

  const conversations = (data?.pages ?? []).flatMap((p) => p.data);

  const onNewChat = useCallback(() => {
    createMutation.mutate(undefined, {
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
  }, [createMutation, router, toast]);

  const onPick = useCallback(
    (id: string) => {
      router.push(`/chat/${id}`);
    },
    [router],
  );

  const onDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            if (id === activeId) router.push('/chat');
          },
          onError: (err) => {
            toast({
              title: 'Could not delete',
              description: err.message,
              tone: 'negative',
            });
          },
        },
      );
    },
    [deleteMutation, router, toast, activeId],
  );

  return (
    <ConversationsSidebar
      conversations={conversations}
      activeId={activeId}
      isLoading={isLoading}
      isError={isError}
      onNewChat={onNewChat}
      onPick={onPick}
      onDelete={onDelete}
      onLoadMore={hasNextPage ? () => fetchNextPage() : undefined}
      hasMore={Boolean(hasNextPage)}
      creating={createMutation.isPending}
    />
  );
}
