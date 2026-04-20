'use client';

import { UserButton } from '@clerk/nextjs';
import { AppShell, Logo, type NavItem, Sidebar, TopBar } from '@investment-tracker/ui';
import {
  Briefcase,
  Cog,
  LayoutGrid,
  type LucideIcon,
  MessageCircle,
  Sparkles,
  Wallet,
} from 'lucide-react';
import type { Route } from 'next';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';

type LinkAdapterProps = {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
};

function LinkAdapter({ href, children, ...rest }: LinkAdapterProps): ReactElement {
  return (
    <NextLink href={href as Route} {...rest}>
      {children}
    </NextLink>
  );
}

type AppNavItem = NavItem & { icon: LucideIcon };

// Real routes: /dashboard, /positions, /chat. Other slugs point back to
// /dashboard as no-op placeholders until their slice lands.
const NAV: ReadonlyArray<AppNavItem> = [
  { slug: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { slug: 'positions', label: 'Positions', href: '/positions', icon: Briefcase },
  { slug: 'chat', label: 'Chat', href: '/chat', icon: MessageCircle },
  { slug: 'insights', label: 'Insights', href: '/dashboard', icon: Sparkles },
  { slug: 'accounts', label: 'Accounts', href: '/dashboard', icon: Wallet },
];

const FOOTER_NAV: ReadonlyArray<AppNavItem> = [
  { slug: 'settings', label: 'Settings', href: '/dashboard', icon: Cog },
];

function activeSlugFor(pathname: string): string | undefined {
  if (pathname.startsWith('/chat')) return 'chat';
  if (pathname.startsWith('/positions')) return 'positions';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  return undefined;
}

export function AppShellClient({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/dashboard';
  const activeSlug = activeSlugFor(pathname);

  return (
    <AppShell
      sidebar={
        <Sidebar
          items={NAV}
          footerItems={FOOTER_NAV}
          activeSlug={activeSlug}
          logo={<Logo variant="full" size={28} />}
          LinkComponent={LinkAdapter}
          expanded
        />
      }
      topBar={
        <TopBar
          density="desktop"
          sticky
          startSlot={<span className="ml-2 text-sm text-text-tertiary">Dashboard</span>}
          endSlot={
            <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} afterSignOutUrl="/" />
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
