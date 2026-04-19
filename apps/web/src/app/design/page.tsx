import { brand } from '@investment-tracker/design-tokens/brand';
import { Logo, ThemeToggle, ToastProvider } from '@investment-tracker/ui';
import { ChartsSection } from './_sections/charts';
import { ChatSection } from './_sections/chat';
import { DomainSection } from './_sections/domain';
import { FoundationsSection } from './_sections/foundations';
import { FreemiumSection } from './_sections/freemium';
import { PrimitivesSection } from './_sections/primitives';
import { ShellsSection } from './_sections/shells';

export const metadata = {
  title: `Design · ${brand.productName}`,
};

const NAV = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'chat', label: 'Chat & AI' },
  { id: 'freemium', label: 'Freemium & Trust' },
  { id: 'shells', label: 'Shells' },
  { id: 'charts', label: 'Charts' },
  { id: 'domain', label: 'Domain' },
] as const;

export default function DesignPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background-primary text-text-primary">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-subtle bg-background-primary/80 px-8 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Logo variant="full" size={28} />
            <span className="text-xs text-text-tertiary">Design System Preview</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="text-text-secondary hover:text-text-primary"
              >
                {n.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>
        </header>

        <main className="mx-auto max-w-6xl space-y-16 px-8 py-12">
          <section className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              {brand.productName} Design System
            </h1>
            <p className="max-w-2xl text-base text-text-secondary">
              Source-of-truth tokens + primitives + domain components. Values come from{' '}
              <code className="font-mono text-sm">packages/design-tokens</code>. Toggle theme in the
              top-right to verify dark-mode parity.
            </p>
          </section>

          <FoundationsSection />
          <PrimitivesSection />
          <ChatSection />
          <FreemiumSection />
          <ShellsSection />
          <ChartsSection />
          <DomainSection />

          <footer className="border-t border-border-subtle pt-6 text-xs text-text-tertiary">
            Generated from design-tokens · Source of truth: brand.productName = &quot;
            {brand.productName}&quot;
          </footer>
        </main>
      </div>
    </ToastProvider>
  );
}
