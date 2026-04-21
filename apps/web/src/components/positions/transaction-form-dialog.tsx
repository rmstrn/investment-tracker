'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
} from '@investment-tracker/ui';
import Link from 'next/link';
import { type FormEvent, type ReactNode, useEffect, useId, useMemo, useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { useCreateTransaction } from '../../hooks/useCreateTransaction';
import { useUpdateTransaction } from '../../hooks/useUpdateTransaction';
import type { Account } from '../../lib/api/accounts';
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionType,
  TransactionUpdateRequest,
} from '../../lib/api/transactions';
import { CURRENCY_CHOICES } from '../accounts/currencies';

/**
 * Transactions form dialog used both for "Add Transaction" (create) and the
 * row-level Edit action (edit).
 *
 * Edit-mode locks the fields the API does not accept on `PATCH`
 * (`account_id`, `transaction_type`, `symbol`, `asset_type`, `currency`) — see
 * `TransactionUpdateRequest` in `tools/openapi/openapi.yaml`. Only the
 * editable fields participate in the diff sent to the server.
 */
export type TransactionFormMode = { kind: 'create' } | { kind: 'edit'; transaction: Transaction };

export interface TransactionFormDialogProps {
  mode: TransactionFormMode | null;
  positionId: string;
  /** Locked context taken from the position the user is on. */
  position: { symbol: string; asset_type: Transaction['asset_type']; currency: string };
  onClose: () => void;
}

const ENABLED_TYPES = ['buy', 'sell', 'dividend'] as const satisfies readonly TransactionType[];
const DEFERRED_TYPES = [
  'split',
  'transfer_in',
  'transfer_out',
  'fee',
] as const satisfies readonly TransactionType[];

const TYPE_LABELS: Record<TransactionType, string> = {
  buy: 'Buy',
  sell: 'Sell',
  dividend: 'Dividend',
  split: 'Split',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  fee: 'Fee',
};

const NOTES_MAX = 1000;

interface FormState {
  accountId: string;
  type: (typeof ENABLED_TYPES)[number];
  quantity: string;
  price: string;
  currency: string;
  fee: string;
  executedAt: string; // datetime-local format `YYYY-MM-DDTHH:mm`
  notes: string;
}

export function TransactionFormDialog({
  mode,
  positionId,
  position,
  onClose,
}: TransactionFormDialogProps) {
  const open = mode !== null;
  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent>
        {mode !== null ? (
          <TransactionFormBody
            mode={mode}
            positionId={positionId}
            position={position}
            onClose={onClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface TransactionFormBodyProps {
  mode: TransactionFormMode;
  positionId: string;
  position: TransactionFormDialogProps['position'];
  onClose: () => void;
}

function TransactionFormBody({ mode, positionId, position, onClose }: TransactionFormBodyProps) {
  const isEdit = mode.kind === 'edit';

  const accountsQuery = useAccounts();
  const accounts = accountsQuery.data ?? [];
  const create = useCreateTransaction();
  const update = useUpdateTransaction();

  const [state, setState] = useState<FormState>(() =>
    mode.kind === 'edit' ? toFormState(mode.transaction) : makeBlankState(position, accounts),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const initialState = useMemo<FormState | null>(
    () => (mode.kind === 'edit' ? toFormState(mode.transaction) : null),
    [mode],
  );

  // When create-mode is open and accounts arrive after the dialog mounted,
  // populate the default once.
  useEffect(() => {
    if (isEdit) return;
    if (state.accountId) return;
    if (accounts.length === 0) return;
    setState((prev) => ({ ...prev, accountId: pickDefaultAccount(accounts) }));
  }, [isEdit, state.accountId, accounts]);

  const submitting = create.isPending || update.isPending;
  const validation = validate(state);
  const noAccounts = !accountsQuery.isLoading && accounts.length === 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (validation.invalid || noAccounts) return;

    if (mode.kind === 'edit' && initialState) {
      const body = diffToUpdateRequest(initialState, state);
      if (Object.keys(body).length === 0) {
        onClose();
        return;
      }
      const result = await update
        .mutateAsync({ id: mode.transaction.id, positionId, body })
        .catch(() => null);
      if (result) onClose();
      return;
    }

    const body = toCreateRequest(state, position);
    const result = await create.mutateAsync({ positionId, body }).catch(() => null);
    if (result) onClose();
  }

  return (
    <>
      <DialogTitle>{isEdit ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
      <DialogDescription>
        {isEdit
          ? `Update this trade for ${position.symbol}.`
          : `Record a manual trade for ${position.symbol}.`}
      </DialogDescription>

      {noAccounts ? <NoAccountsWarning /> : null}

      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <TransactionFormFields
          state={state}
          setState={setState}
          accounts={accounts}
          isEdit={isEdit}
          noAccounts={noAccounts}
          validation={validation}
          submitAttempted={submitAttempted}
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || noAccounts}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
        </div>
      </form>
    </>
  );
}

interface TransactionFormFieldsProps {
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  accounts: Account[];
  isEdit: boolean;
  noAccounts: boolean;
  validation: ValidationResult;
  submitAttempted: boolean;
}

function TransactionFormFields({
  state,
  setState,
  accounts,
  isEdit,
  noAccounts,
  validation,
  submitAttempted,
}: TransactionFormFieldsProps) {
  const formId = useId();
  const ids = makeFieldIds(formId);
  const showError = (k: keyof ValidationResult['errors']) =>
    submitAttempted && validation.errors[k];

  return (
    <>
      <FormField label="Account" htmlFor={ids.account}>
        <NativeSelect
          id={ids.account}
          value={state.accountId}
          onChange={(v) => setState((s) => ({ ...s, accountId: v }))}
          disabled={isEdit || noAccounts}
          invalid={showError('accountId')}
          options={buildAccountOptions(accounts)}
        />
        {showError('accountId') ? <FieldError>Account is required.</FieldError> : null}
      </FormField>

      <FormField label="Type" htmlFor={ids.type}>
        <NativeSelect
          id={ids.type}
          value={state.type}
          onChange={(v) => setState((s) => ({ ...s, type: v as FormState['type'] }))}
          disabled={isEdit}
          options={buildTypeOptions()}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Quantity" htmlFor={ids.quantity}>
          <Input
            id={ids.quantity}
            value={state.quantity}
            onChange={(e) => setState((s) => ({ ...s, quantity: e.target.value }))}
            inputMode="decimal"
            placeholder="0.00"
            invalid={showError('quantity')}
          />
          {showError('quantity') ? <FieldError>Quantity must be greater than 0.</FieldError> : null}
        </FormField>
        <FormField
          label={state.type === 'dividend' ? 'Amount (optional)' : 'Price'}
          htmlFor={ids.price}
        >
          <Input
            id={ids.price}
            value={state.price}
            onChange={(e) => setState((s) => ({ ...s, price: e.target.value }))}
            inputMode="decimal"
            placeholder="0.00"
            invalid={showError('price')}
          />
          {showError('price') ? <FieldError>{validation.priceMessage}</FieldError> : null}
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Currency" htmlFor={ids.currency}>
          <NativeSelect
            id={ids.currency}
            value={state.currency}
            onChange={(v) => setState((s) => ({ ...s, currency: v }))}
            disabled={isEdit}
            options={currencyOptions(state.currency)}
          />
        </FormField>
        <FormField label="Fee (optional)" htmlFor={ids.fee}>
          <Input
            id={ids.fee}
            value={state.fee}
            onChange={(e) => setState((s) => ({ ...s, fee: e.target.value }))}
            inputMode="decimal"
            placeholder="0.00"
            invalid={showError('fee')}
          />
          {showError('fee') ? <FieldError>Fee can't be negative.</FieldError> : null}
        </FormField>
      </div>

      <FormField label="Executed at" htmlFor={ids.executedAt}>
        <Input
          id={ids.executedAt}
          type="datetime-local"
          value={state.executedAt}
          onChange={(e) => setState((s) => ({ ...s, executedAt: e.target.value }))}
          max={nowDateTimeLocal()}
          invalid={showError('executedAt')}
        />
        {showError('executedAt') ? <FieldError>{validation.executedAtMessage}</FieldError> : null}
      </FormField>

      <FormField label="Notes (optional)" htmlFor={ids.notes}>
        <textarea
          id={ids.notes}
          value={state.notes}
          onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
          maxLength={NOTES_MAX}
          rows={3}
          className="flex w-full rounded-sm border border-border-default bg-background-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </FormField>
    </>
  );
}

// ────────────────────────── presentational bits ──────────────────────────

function NoAccountsWarning() {
  return (
    <div className="mt-4 rounded-sm border border-state-warning-default bg-state-warning-subtle px-3 py-2 text-sm text-state-warning-default">
      You need at least one account before adding transactions.{' '}
      <Link href="/accounts" className="underline">
        Create an account
      </Link>
      .
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 text-sm text-text-secondary">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return <span className="text-xs text-state-negative-default">{children}</span>;
}

interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

function NativeSelect({
  id,
  value,
  onChange,
  options,
  disabled,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: NativeSelectOption[];
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-sm border border-border-default bg-background-elevated px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 aria-invalid:border-state-negative-default disabled:cursor-not-allowed disabled:opacity-50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ────────────────────────── helpers ──────────────────────────

function makeFieldIds(base: string) {
  return {
    account: `${base}-account`,
    type: `${base}-type`,
    quantity: `${base}-quantity`,
    price: `${base}-price`,
    currency: `${base}-currency`,
    fee: `${base}-fee`,
    executedAt: `${base}-executed-at`,
    notes: `${base}-notes`,
  };
}

function buildAccountOptions(accounts: Account[]): NativeSelectOption[] {
  if (accounts.length === 0) return [{ value: '', label: '— No accounts available —' }];
  return accounts.map((a) => ({ value: a.id, label: accountLabel(a) }));
}

function buildTypeOptions(): NativeSelectOption[] {
  return [
    ...ENABLED_TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] })),
    ...DEFERRED_TYPES.map((t) => ({
      value: t,
      label: `${TYPE_LABELS[t]} — coming soon`,
      disabled: true,
    })),
  ];
}

function currencyOptions(active: string): NativeSelectOption[] {
  const base = CURRENCY_CHOICES.map((c) => ({ value: c, label: c }));
  if (!base.some((o) => o.value === active) && active) {
    return [{ value: active, label: active }, ...base];
  }
  return base;
}

function accountLabel(a: Account): string {
  return a.broker_name && a.broker_name.toLowerCase() !== 'manual'
    ? `${a.display_name} · ${a.broker_name}`
    : a.display_name;
}

function pickDefaultAccount(accounts: Account[]): string {
  if (accounts.length === 0) return '';
  const sorted = [...accounts].sort((a, b) => {
    const aTs = Date.parse(a.created_at);
    const bTs = Date.parse(b.created_at);
    if (Number.isNaN(aTs) || Number.isNaN(bTs)) return 0;
    return bTs - aTs;
  });
  return sorted[0]?.id ?? '';
}

function makeBlankState(
  position: TransactionFormDialogProps['position'],
  accounts: Account[] = [],
): FormState {
  return {
    accountId: pickDefaultAccount(accounts),
    type: 'buy',
    quantity: '',
    price: '',
    currency: position.currency,
    fee: '',
    executedAt: nowDateTimeLocal(),
    notes: '',
  };
}

function toFormState(t: Transaction): FormState {
  return {
    accountId: t.account_id,
    type: (ENABLED_TYPES as readonly TransactionType[]).includes(t.transaction_type)
      ? (t.transaction_type as FormState['type'])
      : 'buy',
    quantity: t.quantity,
    price: t.price ?? '',
    currency: t.currency,
    fee: t.fee ?? '',
    executedAt: isoToDateTimeLocal(t.executed_at),
    notes: t.notes ?? '',
  };
}

function toCreateRequest(
  state: FormState,
  position: TransactionFormDialogProps['position'],
): TransactionCreateRequest {
  const body: TransactionCreateRequest = {
    account_id: state.accountId,
    symbol: position.symbol,
    asset_type: position.asset_type,
    transaction_type: state.type,
    quantity: state.quantity.trim(),
    currency: state.currency,
    executed_at: dateTimeLocalToIso(state.executedAt),
  };
  if (state.price.trim()) body.price = state.price.trim();
  if (state.fee.trim()) body.fee = state.fee.trim();
  if (state.notes.trim()) body.notes = state.notes.trim();
  return body;
}

function diffToUpdateRequest(initial: FormState, current: FormState): TransactionUpdateRequest {
  const body: TransactionUpdateRequest = {};
  const qty = current.quantity.trim();
  const price = current.price.trim();
  const fee = current.fee.trim();

  // `TransactionUpdateRequest` has no nullable setters — clearing price or fee
  // cannot be expressed via PATCH. Only send when a non-empty value changed;
  // clearing is a silent no-op the server keeps as-is.
  if (qty && qty !== initial.quantity.trim()) body.quantity = qty;
  if (price && price !== initial.price.trim()) body.price = price;
  if (fee && fee !== initial.fee.trim()) body.fee = fee;
  if (current.executedAt !== initial.executedAt) {
    body.executed_at = dateTimeLocalToIso(current.executedAt);
  }
  if (current.notes !== initial.notes) body.notes = current.notes;
  return body;
}

interface ValidationResult {
  invalid: boolean;
  errors: {
    accountId: boolean;
    quantity: boolean;
    price: boolean;
    fee: boolean;
    executedAt: boolean;
  };
  priceMessage: string;
  executedAtMessage: string;
}

function validate(state: FormState): ValidationResult {
  const price = validatePrice(state);
  const executedAt = validateExecutedAt(state.executedAt);
  const errors = {
    accountId: state.accountId.trim() === '',
    quantity: !isPositiveDecimal(state.quantity),
    price: price.invalid,
    fee: state.fee.trim() !== '' && !isNonNegativeDecimal(state.fee),
    executedAt: executedAt.invalid,
  };
  const invalid = Object.values(errors).some(Boolean);
  return {
    invalid,
    errors,
    priceMessage: price.message,
    executedAtMessage: executedAt.message,
  };
}

function validatePrice(state: FormState): { invalid: boolean; message: string } {
  if (state.type === 'buy' || state.type === 'sell') {
    if (state.price.trim() === '' || !isNonNegativeDecimal(state.price)) {
      return { invalid: true, message: 'Price is required for buy and sell.' };
    }
    return { invalid: false, message: '' };
  }
  if (state.price.trim() && !isNonNegativeDecimal(state.price)) {
    return { invalid: true, message: 'Price must be greater than or equal to 0.' };
  }
  return { invalid: false, message: '' };
}

function validateExecutedAt(value: string): { invalid: boolean; message: string } {
  if (!value) return { invalid: true, message: 'Executed at is required.' };
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return { invalid: true, message: 'Executed at must be a valid date.' };
  if (t > Date.now()) return { invalid: true, message: 'Executed at cannot be in the future.' };
  return { invalid: false, message: '' };
}

function isPositiveDecimal(v: string): boolean {
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
}

function isNonNegativeDecimal(v: string): boolean {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0;
}

/**
 * Format `Date` as the local-time `YYYY-MM-DDTHH:mm` string the
 * `datetime-local` input expects. We deliberately avoid `toISOString()`
 * here — that returns UTC and would shift the visible value.
 */
function nowDateTimeLocal(): string {
  return toDateTimeLocal(new Date());
}

function toDateTimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToDateTimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return nowDateTimeLocal();
  return toDateTimeLocal(d);
}

function dateTimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}
