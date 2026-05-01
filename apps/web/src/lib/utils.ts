import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind className merger used by shadcn-style component installs (RetroUI,
 * ekmas/neobrutalism). Lives at the path expected by `components.json`
 * (`@/lib/utils`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
