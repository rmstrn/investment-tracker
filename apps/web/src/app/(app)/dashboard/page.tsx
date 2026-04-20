import { PortfolioValueCardLive } from '../../../components/portfolio/value-card-live';
import type { PortfolioSnapshot } from '../../../hooks/usePortfolio';
import { createServerApiClient } from '../../../lib/api/server';

async function fetchInitialPortfolio(): Promise<PortfolioSnapshot | null> {
  try {
    const client = await createServerApiClient();
    const { data, error } = await client.GET('/portfolio');
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const initialData = await fetchInitialPortfolio();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">
          Total portfolio value and today's change. More widgets land in the next slice.
        </p>
      </header>

      <section aria-label="Portfolio summary">
        <PortfolioValueCardLive initialData={initialData} />
      </section>
    </div>
  );
}
