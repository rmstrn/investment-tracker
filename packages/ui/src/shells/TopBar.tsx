import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  /** Logo slot (usually <Logo variant="mark" /> on mobile, "full" on desktop). */
  logo?: ReactNode;
  /** Optional start slot — title, breadcrumbs, etc. */
  startSlot?: ReactNode;
  /** End slot — usually BellDropdown + Avatar. */
  endSlot?: ReactNode;
  /**
   * Density — `mobile` = 48px; `desktop` = 56px sticky bar inside app shell.
   */
  density?: 'mobile' | 'desktop';
  sticky?: boolean;
}

/**
 * TopBar — app chrome header (brief §4). Dumb: consumer provides slots.
 */
export function TopBar({
  logo,
  startSlot,
  endSlot,
  density = 'mobile',
  sticky,
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4 bg-background-primary px-4',
        density === 'mobile' ? 'h-12' : 'h-14',
        sticky
          ? 'sticky top-0 z-20 border-b border-border-subtle backdrop-blur bg-background-primary/80'
          : '',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        {logo ? <div className="flex items-center">{logo}</div> : null}
        {startSlot ? <div className="min-w-0 flex-1">{startSlot}</div> : null}
      </div>
      {endSlot ? <div className="flex items-center gap-2">{endSlot}</div> : null}
    </header>
  );
}
