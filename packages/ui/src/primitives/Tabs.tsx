'use client';

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react';
import { cn } from '../lib/cn';

type TabsCtx = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
};

const Ctx = createContext<TabsCtx | null>(null);

function useTabs() {
  const c = useContext(Ctx);
  if (!c) throw new Error('Tabs.* must be used inside <Tabs>');
  return c;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const baseId = useId();
  const setValue = useCallback(
    (v: string) => {
      if (controlled === undefined) setUncontrolled(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange],
  );
  return (
    <Ctx.Provider value={{ value, setValue, baseId }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-md border border-border-default bg-background-secondary p-1',
        className,
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

// Wave 2.6 a11y HIGH-1: WAI-ARIA APG tab keyboard navigation keys.
// Map non-trivial direction logic to a tiny pure function so the React
// handler stays under cognitive-complexity budget.
const NAV_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']);

function nextTabIndex(currentIndex: number, total: number, key: string): number {
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return currentIndex <= 0 ? total - 1 : currentIndex - 1;
  }
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return currentIndex >= total - 1 ? 0 : currentIndex + 1;
  }
  if (key === 'Home') return 0;
  if (key === 'End') return total - 1;
  return currentIndex;
}

export function TabsTrigger({
  className,
  value: v,
  children,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const { value, setValue, baseId } = useTabs();
  const active = v === value;

  // Wave 2.6 a11y HIGH-1: WAI-ARIA APG tab keyboard pattern.
  // ArrowLeft/Up    → previous tab (wraps to last)
  // ArrowRight/Down → next tab (wraps to first)
  // Home            → first tab
  // End             → last tab
  // Roving tabindex (`tabIndex={active ? 0 : -1}`) is already correct above;
  // this handler moves both DOM focus AND selection to the new tab so the
  // associated panel updates on keyboard navigation. WCAG 2.1.1 Keyboard (A).
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!NAV_KEYS.has(event.key)) {
        onKeyDown?.(event);
        return;
      }

      const currentTab = event.currentTarget;
      const tabList = currentTab.closest('[role="tablist"]');
      const tabs = tabList
        ? Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
            (tab) => !tab.disabled,
          )
        : [];

      if (tabs.length === 0) {
        onKeyDown?.(event);
        return;
      }

      const nextIndex = nextTabIndex(tabs.indexOf(currentTab), tabs.length, event.key);
      const nextTab = tabs[nextIndex];
      if (!nextTab || nextTab === currentTab) {
        onKeyDown?.(event);
        return;
      }

      event.preventDefault();
      setValue(nextTab.id.replace(`${baseId}-trigger-`, ''));
      nextTab.focus();
      onKeyDown?.(event);
    },
    [baseId, onKeyDown, setValue],
  );

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-trigger-${v}`}
      aria-selected={active}
      aria-controls={`${baseId}-panel-${v}`}
      tabIndex={active ? 0 : -1}
      onClick={() => setValue(v)}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors duration-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        active
          ? 'bg-background-elevated text-text-primary shadow-sm'
          : 'text-text-secondary hover:text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ className, value: v, ...props }: TabsContentProps) {
  const { value, baseId } = useTabs();
  if (v !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${v}`}
      aria-labelledby={`${baseId}-trigger-${v}`}
      className={cn('mt-4', className)}
      {...props}
    />
  );
}
