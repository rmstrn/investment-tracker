'use client';

import { ToastProvider } from '@investment-tracker/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { RateLimitProvider } from '../hooks/useRateLimit';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <ToastProvider>
        <RateLimitProvider>{children}</RateLimitProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
