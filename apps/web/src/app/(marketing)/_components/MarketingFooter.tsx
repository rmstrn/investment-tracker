import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-background-primary">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-text-secondary sm:flex-row sm:items-center md:px-8">
        <p>© 2026 Provedo</p>
        <nav className="flex items-center gap-5">
          <Link href="/pricing" className="hover:text-text-primary">
            Pricing
          </Link>
          <Link href="/sign-in" className="hover:text-text-primary">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
