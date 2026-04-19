'use client';

import {
  Avatar,
  BellDropdown,
  FloatingAiFab,
  Logo,
  MobileTabBar,
  PlanBadge,
  Sidebar,
  TopBar,
  type NavItem,
} from '@investment-tracker/ui';
import {
  Briefcase,
  Cog,
  FileText,
  LayoutGrid,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-react';
import { useState } from 'react';

const DESKTOP_NAV: NavItem[] = [
  { slug: 'dashboard', label: 'Dashboard', href: '#', icon: LayoutGrid },
  { slug: 'positions', label: 'Positions', href: '#', icon: Briefcase },
  { slug: 'transactions', label: 'Transactions', href: '#', icon: FileText, badge: 3 },
  { slug: 'insights', label: 'Insights', href: '#', icon: Sparkles, badge: 12 },
  { slug: 'chat', label: 'Chat', href: '#', icon: MessageCircle },
];

const DESKTOP_FOOTER: NavItem[] = [
  { slug: 'settings', label: 'Settings', href: '#', icon: Cog },
  { slug: 'profile', label: 'Profile', href: '#', icon: User },
];

const MOBILE_NAV: NavItem[] = [
  { slug: 'dashboard', label: 'Home', href: '#', icon: LayoutGrid },
  { slug: 'positions', label: 'Positions', href: '#', icon: Briefcase },
  { slug: 'chat', label: 'Chat', href: '#', icon: MessageCircle, emphasize: true },
  { slug: 'insights', label: 'Insights', href: '#', icon: Sparkles },
  { slug: 'settings', label: 'Settings', href: '#', icon: Cog },
];

export function ShellsSection() {
  const [active, setActive] = useState('dashboard');
  return (
    <section id="shells" className="space-y-10 scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Shells</h2>
        <p className="text-sm text-text-secondary">
          Dumb presentational chrome — no next/link, no usePathname. Brief §4.
        </p>
      </div>

      <Sub title="Sidebar — hover to expand (72px → 240px)">
        <div className="h-[480px] overflow-hidden rounded-md border border-border-subtle bg-background-primary">
          <Sidebar
            items={DESKTOP_NAV}
            footerItems={DESKTOP_FOOTER}
            activeSlug={active}
            onNavigate={(s) => setActive(s)}
            logo={<Logo variant="full" size={28} />}
            bottomSlot={<PlanBadge tier="free" showUpgradeHint />}
          />
        </div>
      </Sub>

      <Sub title="TopBar — mobile (48px) and desktop (56px, sticky)">
        <div className="space-y-3">
          <div className="rounded-md border border-border-subtle overflow-hidden">
            <TopBar
              density="mobile"
              logo={<Logo variant="mark" size={24} />}
              endSlot={
                <>
                  <BellDropdown items={[]} />
                  <Avatar size="sm" fallback="RM" alt="Ruslan" />
                </>
              }
            />
          </div>
          <div className="rounded-md border border-border-subtle overflow-hidden">
            <TopBar
              density="desktop"
              logo={<Logo variant="full" size={24} />}
              startSlot={
                <span className="ml-4 text-sm text-text-tertiary">
                  Dashboard · Total portfolio
                </span>
              }
              endSlot={
                <>
                  <BellDropdown items={[]} />
                  <Avatar size="sm" fallback="RM" alt="Ruslan" />
                </>
              }
            />
          </div>
        </div>
      </Sub>

      <Sub title="MobileTabBar — chat emphasised center (brief §4)">
        <div className="relative mx-auto h-[180px] w-full max-w-sm overflow-hidden rounded-md border border-border-subtle bg-background-primary">
          <div className="absolute inset-0 bottom-14 p-4 text-sm text-text-tertiary">
            Mobile app content area
          </div>
          <MobileTabBar
            items={MOBILE_NAV}
            activeSlug={active}
            onNavigate={(s) => setActive(s)}
            className="!absolute !left-0 !right-0 !bottom-0"
          />
        </div>
      </Sub>

      <Sub title="FloatingAiFab (positioned bottom-right of its container)">
        <div className="relative mx-auto h-[200px] w-full max-w-md overflow-hidden rounded-md border border-border-subtle bg-background-secondary">
          <div className="p-4 text-sm text-text-tertiary">
            App content. FAB lives bottom-right, hidden only on /chat.
          </div>
          <FloatingAiFab
            onClick={() => window.alert('Open chat slide-over')}
            className="!absolute"
          />
        </div>
      </Sub>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">{title}</h3>
      {children}
    </div>
  );
}
