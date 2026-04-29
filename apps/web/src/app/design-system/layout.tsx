import { ToastProvider } from '@investment-tracker/ui';
import type { ReactNode } from 'react';

/**
 * Layout for `/design-system` — wraps the showcase in a ToastProvider so that
 * primitive demos (Toast, copy-to-clipboard chips, etc.) can fire visible
 * notifications without depending on any other app shell.
 */
export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
