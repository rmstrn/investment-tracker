'use client';

import { Button, EmptyState, Skeleton } from '@investment-tracker/ui';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import type { AIConversationSummary } from '../../lib/api/ai';
import { formatRelativeTime } from '../../lib/format';

export interface ConversationsSidebarProps {
  conversations: AIConversationSummary[];
  activeId: string | null;
  isLoading: boolean;
  isError: boolean;
  onNewChat: () => void;
  onPick: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  creating?: boolean;
}

/**
 * Presentational sidebar list. Conversations are sorted newest-first by the
 * Core API (`ai_conversations.sql:25` — `ORDER BY updated_at DESC`). The
 * component never mutates the input array.
 */
export function ConversationsSidebar({
  conversations,
  activeId,
  isLoading,
  isError,
  onNewChat,
  onPick,
  onDelete,
  onLoadMore,
  hasMore,
  creating,
}: ConversationsSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-3 border-r border-border-subtle bg-background-elevated px-3 py-4 md:w-72">
      <Button
        variant="primary"
        onClick={onNewChat}
        aria-label="Start a new conversation"
        disabled={creating}
        className="justify-center"
      >
        <Plus size={16} aria-hidden="true" />
        <span>New chat</span>
      </Button>

      <div className="flex-1 overflow-y-auto">
        {isError ? (
          <div className="p-3 text-sm text-state-negative-default">
            Unable to load conversations.
          </div>
        ) : isLoading ? (
          <SidebarSkeleton />
        ) : conversations.length === 0 ? (
          <div className="p-3">
            <EmptyState
              title="No conversations yet"
              description="Start one to ask Claude about your portfolio."
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {conversations.map((c) => (
              <SidebarItem
                key={c.id}
                conversation={c}
                active={c.id === activeId}
                onClick={() => onPick(c.id)}
                onDelete={() => onDelete(c.id)}
              />
            ))}
            {hasMore ? (
              <li>
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="w-full rounded-md px-3 py-2 text-xs text-text-tertiary hover:bg-background-secondary"
                >
                  Load older conversations
                </button>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({
  conversation,
  active,
  onClick,
  onDelete,
}: {
  conversation: AIConversationSummary;
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const title = conversation.title || conversation.last_message_preview || 'Untitled';
  return (
    <li>
      <div
        className={`group flex w-full items-start gap-2 rounded-md px-3 py-2 text-left transition-colors ${
          active
            ? 'bg-interactive-primary/10 text-text-primary'
            : 'hover:bg-background-secondary text-text-secondary'
        }`}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex-1 text-left"
          aria-current={active ? 'page' : undefined}
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={14} aria-hidden="true" className="shrink-0 text-text-tertiary" />
            <span className="truncate text-sm font-medium">{title}</span>
          </div>
          <div className="mt-0.5 pl-6 text-xs text-text-tertiary">
            {formatRelativeTime(conversation.updated_at)}
          </div>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete conversation ${title}`}
          className="shrink-0 rounded p-1 text-text-tertiary opacity-0 transition-opacity hover:bg-interactive-ghostHover hover:text-state-negative-default focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function SidebarSkeleton() {
  return (
    <ul className="flex flex-col gap-1">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="px-3 py-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/3" />
        </li>
      ))}
    </ul>
  );
}
