import type { ReactNode } from 'react';
import { MarketingFooter } from './_components/MarketingFooter';
import { MarketingHeader } from './_components/MarketingHeader';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background-primary">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
