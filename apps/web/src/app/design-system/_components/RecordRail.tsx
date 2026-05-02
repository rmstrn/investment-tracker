/**
 * Provedo Record Rail — local copy for `/design-system` documentation.
 *
 * Mirrors the canonical implementation at
 * `apps/web/src/app/style-d1/_components/RecordRail.tsx`. Kept as a
 * sibling rather than a cross-route import so the design-system page
 * has zero coupling to the `style-d1` route (which itself is slated for
 * Phase 3 rename to `/canonical-preview`).
 *
 * The styling is supplied by `_styles/lime-cabin.css` under the route's
 * `[data-theme="lime-cabin"]` wrapper. Class names match the upstream
 * D1 vocabulary (`.d1-rail`, `.d1-rail__tick`, `.d1-rail__date`,
 * `.d1-rail__line`) so the component is visually identical to the
 * post-fix-pass canonical preview.
 *
 * Two modes (per `PD-signature-element.md`):
 *
 *  - `structural` (default) — header above persistent data zones.
 *    Wrapper is `role="presentation"`; the section's own heading
 *    carries semantics.
 *
 *  - `entry` — chrome of a single AI-insight entry. Datestamp emitted
 *    inside `<time>` when `dateTime` is supplied (ISO-8601 UTC) for
 *    screen readers + future i18n.
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
