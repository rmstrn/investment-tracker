import { brand } from '@investment-tracker/design-tokens/brand';
import { Logo } from '@investment-tracker/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-6">
        <div className="flex justify-center">
          <Logo variant="full" size={40} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {brand.productName}
        </h1>
        <p className="text-sm text-text-secondary">{brand.tagline}</p>
        <Link
          href="/design"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-interactive-primary px-5 text-sm font-medium text-text-onBrand transition-colors hover:bg-interactive-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
        >
          Open design preview →
        </Link>
      </div>
    </main>
  );
}
