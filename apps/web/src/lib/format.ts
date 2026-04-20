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
