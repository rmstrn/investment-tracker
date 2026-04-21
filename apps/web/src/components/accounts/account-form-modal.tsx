'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
} from '@investment-tracker/ui';
import { type FormEvent, useEffect, useId, useState } from 'react';
import { useCreateAccount } from '../../hooks/useCreateAccount';
import { useUpdateAccount } from '../../hooks/useUpdateAccount';
import type { Account, AccountCreateRequest, AccountUpdateRequest } from '../../lib/api/accounts';
import { CURRENCY_CHOICES, DEFAULT_CURRENCY } from './currencies';

const ACCOUNT_TYPES = ['manual', 'broker', 'crypto'] as const;

export type AccountFormMode = { kind: 'add' } | { kind: 'rename'; account: Account };

export interface AccountFormModalProps {
  mode: AccountFormMode | null;
  onClose: () => void;
}

const DISPLAY_NAME_MAX = 120;

export function AccountFormModal({ mode, onClose }: AccountFormModalProps) {
  const open = mode !== null;
  const isRename = mode?.kind === 'rename';

  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState<(typeof ACCOUNT_TYPES)[number]>('manual');
  const [baseCurrency, setBaseCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [brokerName, setBrokerName] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const create = useCreateAccount();
  const update = useUpdateAccount();
  const formId = useId();
  const ids = {
    displayName: `${formId}-display-name`,
    accountType: `${formId}-account-type`,
    baseCurrency: `${formId}-base-currency`,
    brokerName: `${formId}-broker-name`,
  };

  useEffect(() => {
    if (!mode) return;
    setSubmitAttempted(false);
    if (mode.kind === 'rename') {
      setDisplayName(mode.account.display_name);
    } else {
      setDisplayName('');
      setAccountType('manual');
      setBaseCurrency(DEFAULT_CURRENCY);
      setBrokerName('');
    }
  }, [mode]);

  const trimmedName = displayName.trim();
  const nameInvalid = trimmedName.length === 0 || trimmedName.length > DISPLAY_NAME_MAX;
  const submitting = create.isPending || update.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (nameInvalid) return;

    if (mode?.kind === 'rename') {
      const body: AccountUpdateRequest = { display_name: trimmedName };
      const result = await update.mutateAsync({ id: mode.account.id, body }).catch(() => null);
      if (result) onClose();
      return;
    }

    const body: AccountCreateRequest = {
      connection_type: 'manual',
      display_name: trimmedName,
      account_type: accountType,
      base_currency: baseCurrency,
    };
    if (brokerName.trim()) body.broker_name = brokerName.trim();
    const result = await create.mutateAsync(body).catch(() => null);
    if (result) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent>
        <DialogTitle>{isRename ? 'Rename account' : 'Add manual account'}</DialogTitle>
        <DialogDescription>
          {isRename
            ? 'Update the display label for this account.'
            : 'Track an account whose trades you enter by hand. Broker connections arrive in a later slice.'}
        </DialogDescription>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1 text-sm text-text-secondary">
            <label htmlFor={ids.displayName}>Display name</label>
            <Input
              id={ids.displayName}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={DISPLAY_NAME_MAX}
              placeholder="e.g. Interactive Brokers — main"
              invalid={submitAttempted && nameInvalid}
              autoFocus
            />
            {submitAttempted && nameInvalid ? (
              <span className="text-xs text-state-negative-default">
                Display name is required (max {DISPLAY_NAME_MAX} characters).
              </span>
            ) : null}
          </div>

          {!isRename ? (
            <>
              <div className="flex flex-col gap-1 text-sm text-text-secondary">
                <label htmlFor={ids.accountType}>Account type</label>
                <NativeSelect
                  id={ids.accountType}
                  value={accountType}
                  onChange={(v) => setAccountType(v as (typeof ACCOUNT_TYPES)[number])}
                  options={ACCOUNT_TYPES.map((v) => ({ value: v, label: capitalize(v) }))}
                />
              </div>

              <div className="flex flex-col gap-1 text-sm text-text-secondary">
                <label htmlFor={ids.baseCurrency}>Base currency</label>
                <NativeSelect
                  id={ids.baseCurrency}
                  value={baseCurrency}
                  onChange={setBaseCurrency}
                  options={CURRENCY_CHOICES.map((v) => ({ value: v, label: v }))}
                />
              </div>

              <div className="flex flex-col gap-1 text-sm text-text-secondary">
                <label htmlFor={ids.brokerName}>
                  Broker name <span className="text-text-tertiary">(optional)</span>
                </label>
                <Input
                  id={ids.brokerName}
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  placeholder="e.g. Interactive Brokers"
                  maxLength={120}
                />
              </div>
            </>
          ) : null}

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isRename ? 'Save' : 'Add account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface NativeSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

function NativeSelect({ id, value, onChange, options }: NativeSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-sm border border-border-default bg-background-elevated px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
