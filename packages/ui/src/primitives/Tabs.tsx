'use client';

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
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
        'inline-flex h-10 items-center gap-1 rounded-lg bg-background-secondary p-1',
        className,
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ className, value: v, children, ...props }: TabsTriggerProps) {
  const { value, setValue, baseId } = useTabs();
  const active = v === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-trigger-${v}`}
      aria-selected={active}
      aria-controls={`${baseId}-panel-${v}`}
      tabIndex={active ? 0 : -1}
      onClick={() => setValue(v)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-fast',
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
