'use client';

import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../lib/cn';

type DialogCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  titleId: string;
  descId: string;
};

const Ctx = createContext<DialogCtx | null>(null);

function useDialog() {
  const c = useContext(Ctx);
  if (!c) throw new Error('Dialog.* must be used inside <Dialog>');
  return c;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const setOpen = useCallback(
    (v: boolean) => {
      if (controlled === undefined) setUncontrolled(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );
  const titleId = useId();
  const descId = useId();
  return <Ctx.Provider value={{ open, setOpen, titleId, descId }}>{children}</Ctx.Provider>;
}

export function DialogTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useDialog();
  return (
    <button type="button" onClick={() => setOpen(true)} className="inline-flex">
      {children}
    </button>
  );
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  const { open, setOpen, titleId, descId } = useDialog();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-background-overlay)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={cn(
          'w-full max-w-md rounded-xl bg-background-elevated p-6 shadow-xl',
          'border border-border-subtle',
          'focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialog();
  return (
    <h2
      id={titleId}
      className={cn('text-lg font-semibold tracking-tight text-text-primary', className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { descId } = useDialog();
  return <p id={descId} className={cn('text-sm text-text-secondary mt-1', className)} {...props} />;
}

export function DialogClose({ children }: { children: ReactNode }) {
  const { setOpen } = useDialog();
  return (
    <button type="button" onClick={() => setOpen(false)} className="inline-flex">
      {children}
    </button>
  );
}
