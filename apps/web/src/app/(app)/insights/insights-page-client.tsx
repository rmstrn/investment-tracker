'use client';

import { useSearchParams } from 'next/navigation';
import {
  InsightFilters,
  parseFiltersFromParams,
} from '../../../components/insights/insight-filters';
import { InsightsFeed } from '../../../components/insights/insights-feed';

export function InsightsPageClient() {
  const params = useSearchParams();
  const { severity, insightType, includeDismissed } = parseFiltersFromParams(params);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Insights</h1>
        <p className="text-sm text-text-secondary">
          AI-generated insights based on your portfolio activity.
        </p>
      </header>

      <InsightFilters />

      <InsightsFeed
        filters={{
          includeDismissed,
          severity: severity.length > 0 ? severity : undefined,
          insightType,
        }}
      />
    </div>
  );
}
