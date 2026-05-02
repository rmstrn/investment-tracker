/**
 * Provedo favicon — Next.js 15 dynamic icon.
 *
 * Placed at `app/icon.tsx`, Next emits a `<link rel="icon">` referencing
 * `/icon` so browsers stop auto-requesting `/favicon.ico` (404 noise).
 *
 * Visual: ink-on-cream «P» wordmark in Geist-equivalent semibold,
 * matching the locked Provedo palette (color.ink.light = #1A1A1A,
 * color.surface = paper cream). Static — no runtime data, no fetches.
 *
 * Size 32×32 is the standard browser-tab favicon size. ImageResponse
 * pre-renders this at build time; no per-request cost.
 */

import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F4EFE6',
        color: '#1A1A1A',
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: 6,
      }}
    >
      P
    </div>,
    { ...size },
  );
}
