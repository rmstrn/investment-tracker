import { redirect } from 'next/navigation';
import { ConversationsSidebarLive } from '../../../components/chat/conversations-sidebar-live';
import { EmptyChatShell } from '../../../components/chat/empty-chat-shell';
import { createServerApiClient } from '../../../lib/api/server';

async function fetchMostRecentConversationId(): Promise<string | null> {
  try {
    const client = await createServerApiClient();
    const { data, error } = await client.GET('/ai/conversations', {
      params: { query: { limit: 1 } },
    });
    if (error || !data) return null;
    return data.data[0]?.id ?? null;
  } catch {
    return null;
  }
}

export default async function ChatIndexPage() {
  const recent = await fetchMostRecentConversationId();
  if (recent) {
    redirect(`/chat/${recent}`);
  }
  return (
    <>
      <ConversationsSidebarLive activeId={null} />
      <EmptyChatShell />
    </>
  );
}
