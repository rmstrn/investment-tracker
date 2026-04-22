import { Suspense } from 'react';
import { InsightsPageClient } from './insights-page-client';

export default function InsightsPage() {
  return (
    <Suspense>
      <InsightsPageClient />
    </Suspense>
  );
}
