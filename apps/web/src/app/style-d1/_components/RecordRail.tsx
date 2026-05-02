/**
 * Provedo Record Rail — THE signature element.
 *
 * 6×2px lime tick `▮` + 4px gap + Geist Mono uppercase label
 * + 8px gap + 1px lime hairline at 30% opacity that fills the
 * remaining width.
 *
 * Two modes (per `PD-signature-element.md`):
 *
 *  - `structural` (default) — header above persistent data zones.
 *    Label is the section name uppercased, e.g. `LEDGER`,
 *    `ALLOCATION DRIFT`, `INSIGHTS`, `DISCLOSURE`. Wrapper is
 *    `role="presentation"` (decorative chrome — the section's own
 *    `<h2>` / `<h3>` carries the semantic).
 *
 *  - `entry` — chrome of one AI-insight entry, replaces the
 *    avatar/byline/chat-row form factor. Label is the datestamp,
 *    e.g. `MAY 01 · 09:14`. Renders inside an `<article>` so the
 *    rail belongs to one entry; datestamp emitted inside `<time>`
 *    when the optional `dateTime` prop is supplied (machine-readable
 *    for screen readers + future i18n).
 *
 * Spec rules baked in:
 *   - Tick is hand-rolled SVG (NOT a Lucide icon) — `currentColor` so
 *     the parent `.d1-rail` sets `color: var(--d1-accent-lime)`.
 *   - Tick is `aria-hidden="true"` and `focusable="false"` (visual
 *     anchor only; the date alone communicates «entry»).
 *   - Hairline is decorative — pure visual, no role or label.
 *   - NEVER place above the lime-filled KPI card (PD anti-pattern:
 *     lime-on-lime invisible). Enforcement is at call-site, not in
 *     this component.
 */

interface RecordRailProps {
  /** Uppercase label rendered in Geist Mono 11px tracking 0.04em. */
  label: string;
  /** Mode — structural (zone header) or entry (AI-insight chrome). */
  mode?: 'structural' | 'entry';
  /**
   * Machine-readable timestamp for entry mode.
   * Renders inside `<time datetime="…">` for screen readers.
   * Example: `2026-05-01T09:14:00Z`.
   */
  dateTime?: string;
}

export function RecordRail({ label, mode = 'structural', dateTime }: RecordRailProps) {
  const labelNode =
    mode === 'entry' && dateTime ? (
      <time className="d1-rail__date" dateTime={dateTime}>
        {label}
      </time>
    ) : (
      <span className="d1-rail__date">{label}</span>
    );

  return (
    <div
      className="d1-rail"
      data-mode={mode}
      role={mode === 'structural' ? 'presentation' : undefined}
    >
      <svg
        width="6"
        height="2"
        viewBox="0 0 6 2"
        aria-hidden="true"
        focusable="false"
        className="d1-rail__tick"
      >
        <rect width="6" height="2" fill="currentColor" />
      </svg>
      {labelNode}
      <span className="d1-rail__line" aria-hidden="true" />
    </div>
  );
}
