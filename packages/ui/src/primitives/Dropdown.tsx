'use client';

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../lib/cn';

type DropdownCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const Ctx = createContext<DropdownCtx | null>(null);

function useDropdown() {
  const c = useContext(Ctx);
  if (!c) throw new Error('Dropdown.* must be used inside <Dropdown>');
  return c;
}

export function Dropdown({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <Ctx.Provider value={{ open, setOpen, triggerRef }}>{children}</Ctx.Provider>;
}

export function DropdownTrigger({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, triggerRef } = useDropdown();
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenu({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen, triggerRef } = useDropdown();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;
  return (
    <div className="relative">
      <div
        ref={ref}
        role="menu"
        className={cn(
          'absolute right-0 top-2 z-40 min-w-44 rounded-sm border border-border-default bg-background-elevated p-1 shadow-lg',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export function DropdownItem({ className, destructive, onClick, ...props }: DropdownItemProps) {
  const { setOpen } = useDropdown();
  const handleClick = useCallback<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']>>(
    (e) => {
      onClick?.(e);
      setOpen(false);
    },
    [onClick, setOpen],
  );
  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm',
        destructive ? 'text-state-negative-default' : 'text-text-primary',
        'hover:bg-interactive-ghostHover focus-visible:bg-interactive-ghostHover focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownSeparator() {
  return <div aria-hidden="true" className="my-1 h-px bg-border-subtle" />;
}
