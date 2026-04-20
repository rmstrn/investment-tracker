/**
 * Money values from the API arrive as decimal strings (`Money` schema —
 * `NUMERIC(30,10)` precision). Format them via `Intl.NumberFormat` for
 * display, never `Number()` arithmetic.
 */
export function formatCurrency(amount: string, currency: string, locale = 'en-US'): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${amount} ${currency}`;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a signed delta with explicit `+` / `-` prefix. The leading sign is
 * load-bearing for accessibility (gain/loss must not rely on color alone —
 * design brief §12.1).
 */
export function formatSignedCurrency(amount: string, currency: string, locale = 'en-US'): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${amount} ${currency}`;
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value);
  return formatted;
}

/**
 * Convert a signed fraction (`0.123` → `+12.30%`) to the percent representation
 * the `PortfolioCard` expects.
 */
export function fractionToPercent(fraction: number): number {
  return fraction * 100;
}

/**
 * Short account label used until `/accounts` lookup lands (TASK_07 Slice 5).
 * `Account #1a2b3c4d` — last 8 hex chars of the uuid.
 */
export function formatShortAccountId(accountId: string): string {
  return `Account #${accountId.slice(-8)}`;
}

/**
 * Short, locale-aware relative timestamp. Falls back to the absolute date
 * if the input is not a valid ISO-8601 string.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return iso;
  const diffMs = now.getTime() - then.getTime();
  const seconds = Math.round(diffMs / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return `${minutes >= 0 ? minutes : -minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `${hours >= 0 ? hours : -hours}h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return `${days >= 0 ? days : -days}d ago`;
  return then.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Transaction-row timestamp: `Apr 20, 2026 · 10:24`.
 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date} · ${time}`;
}

/**
 * Chart XAxis tick: `Apr 20` (short month + day). Intentionally omits the
 * year — the SegmentedControl period label disambiguates the range.
 */
export function formatAxisDate(input: string | number): string {
  const d = typeof input === 'number' ? new Date(input) : new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
