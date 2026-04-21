'use client';

import {
  Badge,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SyncStatusBadge,
} from '@investment-tracker/ui';
import { MoreVertical } from 'lucide-react';
import type { Account } from '../../lib/api/accounts';

export interface AccountListItemProps {
  account: Account;
  onRename: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export function AccountListItem({ account, onRename, onDelete }: AccountListItemProps) {
  const showBrokerName = account.broker_name && account.broker_name.toLowerCase() !== 'manual';

  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-text-primary">{account.display_name}</span>
          <Badge tone="neutral">{account.account_type}</Badge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
          {showBrokerName ? <span>{account.broker_name}</span> : null}
          <span>{account.base_currency}</span>
          <SyncStatusBadge status="manual" />
        </div>
      </div>
      <Dropdown>
        <DropdownTrigger
          aria-label={`Actions for ${account.display_name}`}
          className="rounded-md p-2 text-text-tertiary hover:bg-interactive-ghostHover"
        >
          <MoreVertical size={16} aria-hidden="true" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onClick={() => onRename(account)}>Rename</DropdownItem>
          <DropdownItem destructive onClick={() => onDelete(account)}>
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Card>
  );
}
