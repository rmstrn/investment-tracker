import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import type { LinkComponent, NavItem } from './types';

export interface MobileTabBarProps extends HTMLAttributes<HTMLElement> {
  items: ReadonlyArray<NavItem>;
  activeSlug?: string;
  onNavigate?: (slug: string) => void;
  LinkComponent?: LinkComponent;
}

/**
 * MobileTabBar — bottom nav for mobile (<640px). Brief §4.
 * Chat tab should be marked `emphasize: true` and placed in the middle slot.
 */
export function MobileTabBar({
  items,
  activeSlug,
  onNavigate,
  LinkComponent,
  className,
  ...props
}: MobileTabBarProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch justify-around border-t border-border-subtle bg-background-primary/95 backdrop-blur',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <TabLink
          key={item.slug}
          item={item}
          active={activeSlug === item.slug}
          onNavigate={onNavigate}
          LinkComponent={LinkComponent}
        />
      ))}
    </nav>
  );
}

function TabLink({
  item,
  active,
  onNavigate,
  LinkComponent,
}: {
  item: NavItem;
  active?: boolean;
  onNavigate?: (slug: string) => void;
  LinkComponent?: LinkComponent;
}) {
  const Icon = item.icon;
  const emphasised = item.emphasize;

  const content = emphasised ? (
    <span
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full text-static-white shadow-ai',
        'bg-[var(--gradient-ai)]',
      )}
    >
      {Icon ? <Icon size={20} aria-hidden /> : null}
    </span>
  ) : (
    <>
      {Icon ? (
        <Icon
          size={22}
          aria-hidden
          className={cn(active ? 'text-text-primary' : 'text-text-tertiary')}
        />
      ) : null}
      <span
        className={cn(
          'text-[10px] font-medium',
          active ? 'text-text-primary' : 'text-text-tertiary',
        )}
      >
        {item.label}
      </span>
    </>
  );

  const innerClass = cn(
    'flex flex-1 flex-col items-center justify-center gap-0.5 py-1',
    'focus-visible:outline-none focus-visible:bg-interactive-ghostHover',
    emphasised ? 'relative -top-3' : '',
  );

  if (LinkComponent) {
    return (
      <LinkComponent
        href={item.href}
        onClick={() => onNavigate?.(item.slug)}
        aria-current={active ? 'page' : undefined}
        aria-label={item.label}
        className={innerClass}
      >
        {content}
      </LinkComponent>
    );
  }
  return (
    <a
      href={item.href}
      onClick={() => onNavigate?.(item.slug)}
      aria-current={active ? 'page' : undefined}
      aria-label={item.label}
      className={innerClass}
    >
      {content}
    </a>
  );
}
