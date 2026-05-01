import { ToastProvider } from '@investment-tracker/ui';
import type { ReactNode } from 'react';
import { bagelFatOne, caveat, manrope } from './_fonts';

/**
 * Layout for `/design-system` — wraps the showcase in a ToastProvider so that
 * primitive demos (Toast, copy-to-clipboard chips, etc.) can fire visible
 * notifications without depending on any other app shell.
 *
 * v2: attaches Bagel Fat One / Manrope / Caveat CSS-var classes to a wrapping
 * `<div>`. `next/font/google` handles preloading + font-display: swap. We
 * cannot mutate `<html>` from a nested layout, so the wrapper carries the
 * `font-*-variable` class names and any descendant can read them via the
 * `--font-bagel` / `--font-manrope` / `--font-caveat` custom properties.
 */
export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  const fontVars = `${bagelFatOne.variable} ${manrope.variable} ${caveat.variable}`;
  return (
    <ToastProvider>
      <div className={fontVars}>{children}</div>
    </ToastProvider>
  );
}
