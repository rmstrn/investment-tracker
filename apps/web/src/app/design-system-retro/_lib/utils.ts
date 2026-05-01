/**
 * Local `cn` helper for the Logging-Studio/RetroUI fork.
 *
 * Mirrors the ekmas variant's utils so each library variant route keeps a
 * fully isolated `cn` import. Loser library is deleted post-decision.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
