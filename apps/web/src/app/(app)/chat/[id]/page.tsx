import { notFound } from 'next/navigation';
import { ChatViewLive } from '../../../../components/chat/chat-view-live';
import { ConversationsSidebarLive } from '../../../../components/chat/conversations-sidebar-live';
import type { AIConversationDetail } from '../../../../lib/api/ai';
import { createServerApiClient } from '../../../../lib/api/server';

type InitialData =
  | { kind: 'found'; detail: AIConversationDetail }
  | { kind: 'not_found' }
  | { kind: 'error' };

async function fetchInitialDetail(id: string): Promise<InitialData> {
  try {
    const client = await createServerApiClient();
    const { data, error, response } = await client.GET('/ai/conversations/{id}', {
      params: { path: { id }, query: {} },
    });
    if (response.status === 404) return { kind: 'not_found' };
    if (error || !data) return { kind: 'error' };
    return { kind: 'found', detail: data };
  } catch {
    return { kind: 'error' };
  }
}

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initial = await fetchInitialDetail(id);

  if (initial.kind === 'not_found') {
    notFound();
  }

  return (
    <>
      <ConversationsSidebarLive activeId={id} />
      <main className="flex min-w-0 flex-1 flex-col">
        {initial.kind === 'error' ? (
          <div className="p-6 text-sm text-state-negative-default">
            Unable to load this conversation right now. Try again in a moment.
          </div>
        ) : (
          <ChatViewLive conversationId={id} initialData={initial.detail} />
        )}
      </main>
    </>
  );
}
