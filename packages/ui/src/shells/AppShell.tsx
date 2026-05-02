import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  topBar?: ReactNode;
  fab?: ReactNode;
  mobileTabBar?: ReactNode;
  banner?: ReactNode;
  /**
   * Persistent surface rendered as the last grid-row of the content column,
   * below `<main>` and above the mobile tab bar. Used for the Lane-A
   * regulatory disclaimer (TD-100) — NOT `position: fixed`; participates in
   * normal flow so the disclaimer is reachable by scroll and visible in
   * print.
   */
  footer?: ReactNode;
  children: ReactNode;
  /** Max width of the inner content column. Brief §3.3 grid: 1280px. */
  maxWidth?: 'none' | 'sm' | 'lg' | 'xl';
}

const maxWidthClass = {
  none: '',
  sm: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-[1280px]',
} as const;

/**
 * AppShell — composition slot for all app pages. Brief §4.
 * Dumb: accepts pre-constructed Sidebar, TopBar, FAB, MobileTabBar.
 */
export function AppShell({
  sidebar,
  topBar,
  fab,
  mobileTabBar,
  banner,
  footer,
  children,
  maxWidth = 'xl',
  className,
  ...props
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background-primary', className)} {...props}>
      {banner}
      <div className="flex min-h-0 flex-1">
        {sidebar ? <div className="hidden md:flex shrink-0">{sidebar}</div> : null}
        <div className="flex min-w-0 flex-1 flex-col">
          {topBar}
          <main className={cn('min-w-0 flex-1 pb-20 pt-6 md:pb-8', 'px-4 sm:px-6 md:px-8')}>
            <div className={cn('mx-auto w-full', maxWidthClass[maxWidth])}>{children}</div>
          </main>
          {footer}
        </div>
      </div>
      {fab}
      {mobileTabBar ? <div className="md:hidden">{mobileTabBar}</div> : null}
    </div>
  );
}
