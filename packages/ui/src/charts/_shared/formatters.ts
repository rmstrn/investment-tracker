/**
 * Chart value + axis formatters.
 *
 * Reads `ValueFormat` / `XAxisFormat` from `@investment-tracker/shared-types`.
 * Uses `Intl.NumberFormat` for currency / percent / count / ratio with browser
 * locale (no React context per architect ADR §«Theme + locale + units»). Compact
 * thresholds match CHARTS_SPEC §3.3 ($1.2k, $184k, $1.84M).
 */

import type { ValueFormat, XAxisFormat } from '@investment-tracker/shared-types/charts';

const COMPACT_THRESHOLD = 10_000;

function formatCurrency(n: number, currency: string | undefined, compact: boolean): string {
  const ccy = currency ?? 'USD';
  if (compact && Math.abs(n) >= COMPACT_THRESHOLD) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: ccy,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n);
  }
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: ccy,
    maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 2,
  }).format(n);
}

function formatPercent(n: number, withSign: boolean): string {
  // Payload semantics: percent values are pre-scaled (e.g. 12.4 means 12.4%),
  // not 0..1. Match CHARTS_SPEC §3.3 — agent emits human-readable percent.
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(n));
  if (withSign) {
    const sign = n > 0 ? '+' : n < 0 ? '−' : '';
    return `${sign}${formatted}%`;
  }
  return `${formatted}%`;
}

/**
 * Formats `n` per the payload's `ValueFormat`. `currency` is required for
 * `currency` / `currency-compact`; ignored otherwise.
 */
export function formatValue(n: number, format: ValueFormat, currency?: string): string {
  switch (format) {
    case 'currency':
      return formatCurrency(n, currency, false);
    case 'currency-compact':
      return formatCurrency(n, currency, true);
    case 'percent':
      return formatPercent(n, false);
    case 'percent-delta':
      return formatPercent(n, true);
    case 'count':
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
    case 'ratio':
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    case 'date': {
      // Numeric epoch fallback; dates usually arrive on the X axis.
      const d = new Date(n);
      return Number.isNaN(d.getTime()) ? String(n) : d.toLocaleDateString();
    }
    default: {
      const exhaustive: never = format;
      return String(exhaustive);
    }
  }
}

/**
 * Formats an X-axis tick. ISO date strings get compact day/month/year forms.
 */
export function formatXAxis(v: string | number, format: XAxisFormat): string {
  switch (format) {
    case 'date-day':
      return formatDate(v, { month: 'short', day: 'numeric' });
    case 'date-month':
      return formatDate(v, { month: 'short' });
    case 'date-year':
      return formatDate(v, { year: 'numeric' });
    case 'category':
      return String(v);
    case 'numeric':
      return typeof v === 'number'
        ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v)
        : String(v);
    default: {
      const exhaustive: never = format;
      return String(exhaustive);
    }
  }
}

function formatDate(v: string | number, opts: Intl.DateTimeFormatOptions): string {
  const d = typeof v === 'number' ? new Date(v) : new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return new Intl.DateTimeFormat(undefined, opts).format(d);
}
