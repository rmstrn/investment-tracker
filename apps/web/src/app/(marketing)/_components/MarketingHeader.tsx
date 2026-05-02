import { Button, Logo } from '@investment-tracker/ui';
import Link from 'next/link';

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border-subtle bg-background-primary/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-8">
        <Link
          href="/"
          aria-label="Provedo — home"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary rounded-sm"
        >
          <Logo variant="full" size={28} />
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            href="/pricing"
            className="hidden text-sm font-medium text-text-secondary hover:text-text-primary sm:inline-block"
          >
            Pricing
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            Sign in
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
