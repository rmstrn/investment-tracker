'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { cn } from '../lib/cn';

type Tone = 'neutral' | 'positive' | 'negative' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: Tone;
  duration?: number;
}

type ToastEntry = ToastOptions & { id: string };

type ToastCtx = {
  toast: (opts: ToastOptions) => void;
  dismiss: (id: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used inside <ToastProvider>');
  return c;
}

const toneStyles: Record<Tone, string> = {
  neutral: 'border-border-default',
  positive: 'border-state-positive-default',
  negative: 'border-state-negative-default',
  warning: 'border-state-warning-default',
  info: 'border-state-info-default',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ToastEntry[]>([]);
  const prefix = useId();

  const dismiss = useCallback((id: string) => {
    setEntries((xs) => xs.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
      setEntries((xs) => [...xs, { ...opts, id }]);
      const duration = opts.duration ?? 4000;
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss, prefix],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2"
      >
        {entries.map((e) => (
          <ToastCard key={e.id} entry={e} onClose={() => dismiss(e.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastCard({ entry, onClose }: { entry: ToastEntry; onClose: () => void }) {
  useEffect(() => {
    // noop — dismissal handled by provider timer
  }, []);
  const tone = entry.tone ?? 'neutral';
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto rounded-lg border-l-4 bg-background-elevated p-4 shadow-lg',
        'border border-border-subtle',
        toneStyles[tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-text-primary">{entry.title}</div>
          {entry.description ? (
            <div className="mt-1 text-xs text-text-secondary">{entry.description}</div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="rounded p-1 text-text-tertiary hover:bg-interactive-ghostHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
