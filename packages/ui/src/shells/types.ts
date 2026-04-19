import type { ComponentType, ReactElement, ReactNode } from 'react';

/**
 * Dumb-shell contract.
 *
 * Shells in packages/ui MUST NOT import from next/* (no next/link, no
 * usePathname, etc.). They are presentational only. The consumer app
 * (apps/web) wraps them with an adapter that injects framework routing.
 *
 * Pattern:
 *   - Pass `items: NavItem[]` with pre-resolved hrefs.
 *   - Pass `activeSlug: string` (resolved from usePathname in the adapter).
 *   - Pass `onNavigate(slug)` for optimistic active-state updates.
 *   - Optionally pass `LinkComponent` so anchors render via next/link in web
 *     but default to plain <a> otherwise.
 */

export interface NavItem {
  slug: string;
  label: string;
  href: string;
  /** Optional icon component (e.g. lucide icon). */
  icon?: ComponentType<{ size?: number; 'aria-hidden'?: boolean; className?: string }>;
  /** Optional badge count (e.g. unread insights). */
  badge?: number;
  /** For mobile bar: visually emphasise (center Chat tab, brief §4). */
  emphasize?: boolean;
  /** Force external-open behaviour. */
  external?: boolean;
}

export type LinkComponent = (props: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
}) => ReactElement;
