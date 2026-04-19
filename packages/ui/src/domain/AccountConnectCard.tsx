import { Check, type LucideIcon, Plus } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Button } from '../primitives/Button';
import { Card } from '../primitives/Card';

export type AccountStatus = 'connected' | 'not_connected' | 'syncing' | 'error';

export interface AccountConnectCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Broker / exchange name, e.g. "Interactive Brokers" */
  providerName: string;
  /** Optional provider tagline, e.g. "US stocks + ETFs" */
  tagline?: string;
  /** Optional icon component (lucide or custom) */
  icon?: LucideIcon;
  status?: AccountStatus;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const statusLabel: Record<AccountStatus, string> = {
  connected: 'Connected',
  not_connected: 'Not connected',
  syncing: 'Syncing…',
  error: 'Error — reconnect',
};

const statusClass: Record<AccountStatus, string> = {
  connected: 'text-portfolio-gain-default',
  not_connected: 'text-text-tertiary',
  syncing: 'text-state-info-default',
  error: 'text-state-negative-default',
};

export function AccountConnectCard({
  providerName,
  tagline,
  icon: Icon,
  status = 'not_connected',
  onConnect,
  onDisconnect,
  className,
  ...props
}: AccountConnectCardProps) {
  const connected = status === 'connected';
  return (
    <Card variant="interactive" className={cn('flex items-center gap-4', className)} {...props}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-background-secondary">
        {Icon ? <Icon size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{providerName}</span>
          {connected ? (
            <Check size={14} aria-hidden="true" className="text-portfolio-gain-default" />
          ) : null}
        </div>
        {tagline ? <p className="text-sm text-text-tertiary">{tagline}</p> : null}
        <p className={cn('mt-1 text-xs font-medium', statusClass[status])}>{statusLabel[status]}</p>
      </div>
      {connected ? (
        <Button variant="outline" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      ) : (
        <Button variant="primary" size="sm" onClick={onConnect}>
          Connect
        </Button>
      )}
    </Card>
  );
}
