'use client';

import {
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

type Side = 'left' | 'right' | 'top' | 'bottom';

type SheetCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  side: Side;
};

const Ctx = createContext<SheetCtx | null>(null);

function useSheet() {
  const c = useContext(Ctx);
  if (!c) throw new Error('Sheet.* must be used inside <Sheet>');
  return c;
}

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  children: ReactNode;
}

export function Sheet({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  side = 'right',
  children,
}: SheetProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const setOpen = useCallback(
    (v: boolean) => {
      if (controlled === undefined) setUncontrolled(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );
  return <Ctx.Provider value={{ open, setOpen, side }}>{children}</Ctx.Provider>;
}

export function SheetTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useSheet();
  return (
    <button type="button" onClick={() => setOpen(true)} className="inline-flex">
      {children}
    </button>
  );
}

const sidePos: Record<Side, string> = {
  left: 'left-0 top-0 h-full w-80 border-r',
  right: 'right-0 top-0 h-full w-80 border-l',
  top: 'top-0 left-0 w-full h-1/3 border-b',
  bottom: 'bottom-0 left-0 w-full h-1/3 border-t',
};

export function SheetContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen, side } = useSheet();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50"
      style={{ backgroundColor: 'var(--color-background-overlay)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          'absolute bg-background-elevated shadow-xl focus:outline-none p-6',
          'border-border-default',
          sidePos[side],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold tracking-tight text-text-primary', className)}
      {...props}
    />
  );
}

export function SheetClose({ children }: { children: ReactNode }) {
  const { setOpen } = useSheet();
  return (
    <button type="button" onClick={() => setOpen(false)} className="inline-flex">
      {children}
    </button>
  );
}
