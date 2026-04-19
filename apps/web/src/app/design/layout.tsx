import { ToastProvider } from '@investment-tracker/ui';
import type { ReactNode } from 'react';

export default function DesignLayout({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
