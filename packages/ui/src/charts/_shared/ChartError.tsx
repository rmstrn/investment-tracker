'use client';

/**
 * Error-state surface (CHARTS_SPEC §3.11).
 *
 * Eyebrow in `--terra` (warning color), headline + body, and a "Show payload"
 * disclosure gated by the `?debug=1` URL search param. The disclosure renders
 * the raw payload JSON in a monospace `<pre>` block so PO/QA can spot-check
 * staging incidents without redeploying.
 */

import { useEffect, useState } from 'react';

interface ChartErrorProps {
  /** Optional payload to surface under `?debug=1`. */
  payload?: unknown;
  /** Headline override. Defaults to `Chart unavailable`. */
  headline?: string;
  /** Body copy override. */
  body?: string;
}

export function ChartError({ payload, headline, body }: ChartErrorProps) {
  const debugMode = useDebugMode();

  return (
    <div
      data-testid="chart-error"
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-state-warning-default bg-state-warning-subtle px-6 py-5"
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: 'var(--color-state-warning-default, var(--terra))' }}
      >
        Chart error
      </p>
      <p className="text-sm font-semibold text-text-primary">{headline ?? 'Chart unavailable'}</p>
      <p className="max-w-prose text-xs text-text-secondary">
        {body ?? 'We could not display this chart. Try again or refresh the page.'}
      </p>
      {debugMode && payload !== undefined ? (
        <details className="w-full">
          <summary className="cursor-pointer text-xs text-text-secondary underline">
            Show payload
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded bg-background-tertiary p-3 font-mono text-[11px] leading-snug text-text-primary">
            {safeStringify(payload)}
          </pre>
        </details>
      ) : (
        <button
          type="button"
          aria-label="Show payload"
          disabled
          className="cursor-not-allowed text-xs text-text-tertiary underline"
        >
          Show payload
        </button>
      )}
    </div>
  );
}

function useDebugMode(): boolean {
  const [debug, setDebug] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setDebug(params.get('debug') === '1');
  }, []);
  return debug;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
