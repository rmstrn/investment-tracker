/**
 * Local `cn` helper for the ekmas/neobrutalism-components fork.
 *
 * The shadcn-registry source files import `@/lib/utils` (the shadcn
 * convention). We don't want to pollute the shared `apps/web` lib namespace
 * with a generic `cn` because the canonical `/design-system` route doesn't
 * use it; instead each library variant route owns its own `cn` so the two
 * forks (ekmas + RetroUI) stay fully isolated and either one can be deleted
 * post PO-decision without touching shared code.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
