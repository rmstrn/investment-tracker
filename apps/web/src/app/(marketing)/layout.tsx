import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { MarketingFooter } from './_components/MarketingFooter';
import { MarketingHeader } from './_components/MarketingHeader';

// Provedo v1.4 typography — Inter + JetBrains Mono
// Scoped to marketing route only; Geist remains active in (app)/* routes
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--provedo-font-sans',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--provedo-font-mono',
  // Tab data is below-fold — skip preload to avoid blocking hero LCP
  preload: false,
});

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${jetbrainsMono.variable} provedo-root flex min-h-screen flex-col`}
      style={
        {
          // Direction A v1.4 tokens — scoped to marketing route only.
          // Full token migration to packages/design-tokens is a separate slice.
          // These inline overrides are deletable in a single PR once migration ships.
          '--provedo-bg-page': '#FAFAF7',
          '--provedo-bg-elevated': '#FFFFFF',
          '--provedo-bg-muted': '#F5F5F1',
          '--provedo-bg-subtle': '#F1F1ED',
          '--provedo-text-primary': '#0F172A',
          '--provedo-text-secondary': '#334155',
          '--provedo-text-tertiary': '#475569',
          '--provedo-border-subtle': '#E2E8F0',
          '--provedo-border-default': '#CBD5E1',
          '--provedo-accent': '#0D9488',
          '--provedo-accent-hover': '#0F766E',
          '--provedo-accent-active': '#115E59',
          '--provedo-accent-subtle': '#CCFBF1',
          '--provedo-positive': '#059669',
          '--provedo-negative': '#DC2626',
          '--provedo-font-sans-applied':
            'var(--provedo-font-sans, Inter, ui-sans-serif, system-ui)',
          '--provedo-font-mono-applied': 'var(--provedo-font-mono, "JetBrains Mono", ui-monospace)',
          backgroundColor: 'var(--provedo-bg-page)',
          color: 'var(--provedo-text-primary)',
          fontFamily: 'var(--provedo-font-sans, Inter, ui-sans-serif, system-ui)',
        } as React.CSSProperties
      }
    >
      <MarketingHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
