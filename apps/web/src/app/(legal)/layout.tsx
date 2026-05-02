import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Minimal shell for `/legal/*` routes (TD-100 disclaimer + future privacy /
 * terms slices). Standalone — does NOT use AppShell so the verbose
 * disclaimer reads as a static document, not a chrome-wrapped product page.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background-primary">
      <header className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-semibold text-sm text-text-primary hover:text-text-secondary"
          >
            Provedo
          </Link>
          <Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary">
            Back to app
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border-subtle">
        <div className="mx-auto max-w-3xl px-4 py-6 text-text-tertiary text-xs sm:px-6">
          © 2026 Provedo
        </div>
      </footer>
    </div>
  );
}
