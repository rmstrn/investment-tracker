import { ToastProvider } from '@investment-tracker/ui';
import type { ReactNode } from 'react';
import { geistD1, geistMonoD1 } from './_fonts';
import '../style-d1/_lib/depth.css';
import './_styles/lime-cabin.css';

/**
 * `/design-system` layout — wraps the route in `data-theme="lime-cabin"`
 * (route-local opt-in per KICKOFF §2.2 fallback) and exposes the Geist
 * font CSS variables via the wrapper class.
 *
 * The `data-theme="lime-cabin"` attribute scopes every D1 token + every
 * `.d1-*` selector in `_styles/lime-cabin.css`. Other routes that do
 * not opt in keep their existing `light` / `dark` surface — this layout
 * does NOT touch `<html>` and does NOT modify `globals.css`.
 *
 * `ToastProvider` stays so any toast-driven primitive demo can fire
 * notifications without depending on the app shell.
 */
export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  const fontVars = `${geistD1.variable} ${geistMonoD1.variable}`;
  return (
    <ToastProvider>
      <div data-theme="lime-cabin" className={fontVars}>
        {children}
      </div>
    </ToastProvider>
  );
}
