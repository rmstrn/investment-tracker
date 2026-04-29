'use client';

import { Logo } from '@investment-tracker/ui';
import { Moon, Sun, ZapOff } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'iconography', label: 'Iconography' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'charts', label: 'Charts' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'theme', label: 'Theme · Motion' },
] as const;

/**
 * Sticky header for `/design-system`.
 *
 * Owns two showcase-only toggles that write to `<html>`:
 *   - theme         → `documentElement.dataset.theme = 'light' | 'dark'` AND
 *                     toggles `.dark` class for primitives that key off it.
 *   - reduced motion → `documentElement.dataset.reducedMotion = 'true'` so
 *                     showcase-only CSS can suppress motion demos for users
 *                     who can't change OS-level `prefers-reduced-motion`.
 *
 * The toggles are real `<button>` elements (not Switch primitive yet —
 * Switch lands in Phase γ). Both are keyboard-accessible and announce state
 * via `aria-pressed`.
 */
export function ShowcaseHeader() {
  const [dark, setDark] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Hydrate initial theme from current `<html>` state (set by layout/SSR or
  // a previous toggle). Defaults to light if neither flag is present.
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark') || root.dataset.theme === 'dark';
    setDark(isDark);
    setReduced(root.dataset.reducedMotion === 'true');
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    root.dataset.theme = next ? 'dark' : 'light';
  };

  const toggleReduced = () => {
    const next = !reduced;
    setReduced(next);
    const root = document.documentElement;
    if (next) {
      root.dataset.reducedMotion = 'true';
    } else {
      delete root.dataset.reducedMotion;
    }
  };

  return (
    <header
      className="showcase-header sticky top-0 z-30 backdrop-blur"
      style={{
        // Theme-aware: --bg flips via [data-theme="dark"] on <html>.
        // color-mix gives us 86% opacity over the bg without needing
        // a separate --bg-rgb token. Falls back to plain --bg if
        // color-mix unsupported (Safari < 16.2 — graceful).
        background: 'color-mix(in srgb, var(--bg) 86%, transparent)',
        borderBottom: '1px solid var(--border-divider, var(--border))',
        color: 'var(--ink)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <Logo variant="full" size={26} />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--showcase-eyebrow-size)',
              letterSpacing: 'var(--showcase-eyebrow-tracking)',
              color: 'var(--text-3)',
              fontWeight: 'var(--showcase-eyebrow-weight)' as unknown as number,
            }}
          >
            Design System v1.1 · Locked
          </span>
        </div>
        <nav aria-label="Showcase sections" className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="showcase-header__link rounded-md px-2.5 py-1.5 transition-colors duration-fast"
              style={{ fontSize: '13px', color: 'var(--text-2)' }}
            >
              {n.label}
            </a>
          ))}
          <span
            className="mx-2 h-5 w-px"
            aria-hidden
            style={{ background: 'var(--border-divider, var(--border))' }}
          />
          <button
            type="button"
            onClick={toggleReduced}
            aria-pressed={reduced}
            aria-label={
              reduced ? 'Disable reduced-motion override' : 'Enable reduced-motion override'
            }
            title={reduced ? 'Reduced motion ON' : 'Reduced motion OFF'}
            className="showcase-header__btn inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors duration-fast"
            data-state={reduced ? 'on' : 'off'}
            style={{
              fontSize: '12px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-2)',
            }}
          >
            <ZapOff size={14} aria-hidden />
            <span>{reduced ? 'Motion off' : 'Motion on'}</span>
          </button>
          <button
            type="button"
            onClick={toggleDark}
            aria-pressed={dark}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="showcase-header__btn inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors duration-fast"
            style={{
              fontSize: '12px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-2)',
            }}
          >
            {dark ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
            <span>{dark ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
