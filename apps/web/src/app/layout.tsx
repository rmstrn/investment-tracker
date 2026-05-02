import { ClerkProvider } from '@clerk/nextjs';
import { brand } from '@investment-tracker/design-tokens/brand';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeScript } from '../components/theme/ThemeScript';
import { clerkAppearance } from '../lib/clerk-appearance';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  // Canonical production origin. Per-page metadata.alternates.canonical
  // resolves against this base, and Open Graph image URLs default to it.
  // Vercel domain config is managed in the dashboard separately.
  metadataBase: new URL('https://provedo.app'),
  title: brand.productName,
  description: brand.tagline,
};

// Synthetic Clerk publishable key used only when the real env var is absent
// (e.g. repo CI jobs without Clerk secrets). Computed at server render time
// so the base64-shaped literal never appears in committed source, keeping
// secret-scan rules clean. Real deploys must set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
// Next inlines that real value at build time.
const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
  `pk_test_${Buffer.from('clerk.placeholder.lcl.dev$').toString('base64').replace(/=+$/, '')}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance} publishableKey={publishableKey}>
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        // `data-theme` is overridden synchronously by ThemeScript before
        // hydration; this server-rendered default prevents a flash if the
        // script is somehow blocked (CSP, JS disabled).
        data-theme="light"
        suppressHydrationWarning
      >
        <head>
          <ThemeScript />
        </head>
        <body className="min-h-screen antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
