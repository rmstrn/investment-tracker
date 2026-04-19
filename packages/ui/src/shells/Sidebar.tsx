'use client';

import { type HTMLAttributes, type ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import type { LinkComponent, NavItem } from './types';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: ReadonlyArray<NavItem>;
  /** Footer items — usually Settings + Profile. Rendered below divider. */
  footerItems?: ReadonlyArray<NavItem>;
  activeSlug?: string;
  onNavigate?: (slug: string) => void;
  /** Slot for brand logo at the top (72px area). */
  logo?: ReactNode;
  /** Slot at the bottom-most position (plan badge, etc.). */
  bottomSlot?: ReactNode;
  /**
   * Expanded mode — 240px with labels visible. Default auto (icon-only, hover
   * expands). `true` pins expanded; `false` pins collapsed.
   */
  expanded?: boolean | 'auto';
  LinkComponent?: LinkComponent;
}

/**
 * Sidebar — desktop left nav (brief §4). Dumb shell: zero framework coupling.
 *   - Default 72px icon-only; on hover expands to 240px with labels.
 *   - `expanded={true}` pins expanded. `expanded={false}` pins collapsed.
 *   - Renders via LinkComponent if provided, else plain anchor.
 */
export function Sidebar({
  items,
  footerItems,
  activeSlug,
  onNavigate,
  logo,
  bottomSlot,
  expanded = 'auto',
  LinkComponent,
  className,
  ...props
}: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const isExpanded = expanded === true || (expanded === 'auto' && hovered);

  return (
    <aside
      data-expanded={isExpanded || undefined}
      onMouseEnter={() => expanded === 'auto' && setHovered(true)}
      onMouseLeave={() => expanded === 'auto' && setHovered(false)}
      className={cn(
        'flex flex-col border-r border-border-subtle bg-background-primary',
        'transition-[width] duration-base ease-out',
        isExpanded ? 'w-60' : 'w-[72px]',
        className,
      )}
      aria-label="Primary navigation"
      {...props}
    >
      {logo ? (
        <div className="flex h-[72px] items-center px-4">
          <div className={cn('overflow-hidden', isExpanded ? 'w-full' : 'w-10')}>{logo}</div>
        </div>
      ) : null}

      <nav className="flex-1 space-y-1 px-2 py-2">
        {items.map((item) => (
          <SidebarLink
            key={item.slug}
            item={item}
            expanded={isExpanded}
            active={activeSlug === item.slug}
            onNavigate={onNavigate}
            LinkComponent={LinkComponent}
          />
        ))}
      </nav>

      {footerItems && footerItems.length > 0 ? (
        <>
          <div aria-hidden="true" className="mx-3 h-px bg-border-subtle" />
          <nav className="space-y-1 px-2 py-2" aria-label="Account">
            {footerItems.map((item) => (
              <SidebarLink
                key={item.slug}
                item={item}
                expanded={isExpanded}
                active={activeSlug === item.slug}
                onNavigate={onNavigate}
                LinkComponent={LinkComponent}
              />
            ))}
          </nav>
        </>
      ) : null}

      {bottomSlot ? <div className="mx-2 mb-3 mt-1">{bottomSlot}</div> : null}
    </aside>
  );
}

function SidebarLink({
  item,
  expanded,
  active,
  onNavigate,
  LinkComponent,
}: {
  item: NavItem;
  expanded: boolean;
  active?: boolean;
  onNavigate?: (slug: string) => void;
  LinkComponent?: LinkComponent;
}) {
  const Icon = item.icon;
  const innerClass = cn(
    'relative flex h-10 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors duration-fast ease-out',
    active
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
      : 'text-text-secondary hover:bg-interactive-ghostHover hover:text-text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
  );

  const content = (
    <>
      {Icon ? (
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center">
          <Icon size={18} aria-hidden />
        </span>
      ) : null}
      <span
        className={cn(
          'overflow-hidden whitespace-nowrap transition-opacity duration-fast',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        {item.label}
      </span>
      {item.badge ? (
        <span
          className={cn(
            'ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-interactive-primary px-1 text-[10px] font-medium text-text-onBrand',
            expanded ? '' : 'absolute right-1.5 top-1.5',
          )}
        >
          {item.badge > 9 ? '9+' : item.badge}
        </span>
      ) : null}
    </>
  );

  if (LinkComponent) {
    return (
      <LinkComponent
        href={item.href}
        aria-current={active ? 'page' : undefined}
        aria-label={expanded ? undefined : item.label}
        onClick={() => onNavigate?.(item.slug)}
        className={innerClass}
      >
        {content}
      </LinkComponent>
    );
  }
  return (
    <a
      href={item.href}
      aria-current={active ? 'page' : undefined}
      aria-label={expanded ? undefined : item.label}
      onClick={() => onNavigate?.(item.slug)}
      className={innerClass}
    >
      {content}
    </a>
  );
}
