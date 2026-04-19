'use client';

import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useId,
  useState,
} from 'react';
import { cn } from '../lib/cn';

export interface TooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ label, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const trigger = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{
          'aria-describedby'?: string;
          onMouseEnter?: () => void;
          onMouseLeave?: () => void;
          onFocus?: () => void;
          onBlur?: () => void;
        }>,
        {
          'aria-describedby': id,
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
          onFocus: () => setOpen(true),
          onBlur: () => setOpen(false),
        },
      )
    : children;

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            'absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap',
            'rounded-sm bg-background-inverse px-2 py-1 text-xs text-text-inverse shadow-md',
            className,
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
