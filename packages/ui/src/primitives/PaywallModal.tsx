'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './Dialog';

export interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** Context line explaining what triggered the paywall. */
  context: ReactNode;
  /** 3–4 bullets of what upgrading unlocks. */
  bullets: ReadonlyArray<string>;
  /** Upgrade CTA label, e.g. "Upgrade to Plus — $8/mo". */
  upgradeLabel: string;
  onUpgrade: () => void;
  dismissLabel?: string;
}

/**
 * PaywallModal — soft paywall (brief §13.4).
 * Purely presentational — caller throttles frequency and remembers dismissal.
 */
export function PaywallModal({
  open,
  onOpenChange,
  title = "You've hit your free limit",
  context,
  bullets,
  upgradeLabel,
  onUpgrade,
  dismissLabel = 'Maybe later',
}: PaywallModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md')}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{context}</DialogDescription>
        <ul className="mt-4 space-y-2">
          {bullets.map((b, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: bullets is a static ReadonlyArray<string> provided by caller; order is fixed at mount.
            <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
              <Check
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-portfolio-gain-default"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {dismissLabel}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onUpgrade();
              onOpenChange(false);
            }}
          >
            {upgradeLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
