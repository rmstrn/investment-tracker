import { Check } from 'lucide-react';

/**
 * PlaceholderControl — visual stub for Switch / Checkbox / Radio primitives
 * that do not yet ship from `packages/ui` (Phase γ deliverable). Renders the
 * exact static-reference styling so the showcase reads as production-fidelity
 * even while the React primitives are pending.
 *
 * Uses semantic `role="switch" | "checkbox" | "radio"` + `aria-checked` so
 * screen readers + keyboard tab focus still work. When the real primitives
 * land, swap each call site.
 */

export function PlaceholderSwitch({
  on,
  label,
  ariaLabel,
}: {
  on: boolean;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <span className="showcase-control">
      <span
        role="switch"
        aria-checked={on}
        aria-label={ariaLabel ?? label}
        tabIndex={0}
        className={`showcase-switch${on ? ' showcase-switch--on' : ''}`}
      />
      <span className={`showcase-control__label${on ? '' : ' showcase-control__label--muted'}`}>
        {label}
      </span>
    </span>
  );
}

export function PlaceholderCheckbox({
  checked,
  label,
  ariaLabel,
}: {
  checked: boolean;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <span className="showcase-control">
      <span
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel ?? label}
        tabIndex={0}
        className={`showcase-checkbox${checked ? ' showcase-checkbox--checked' : ''}`}
      >
        {checked ? <Check size={14} aria-hidden strokeWidth={3} /> : null}
      </span>
      <span
        className={`showcase-control__label${checked ? '' : ' showcase-control__label--muted'}`}
      >
        {label}
      </span>
    </span>
  );
}

export function PlaceholderRadio({
  checked,
  label,
  ariaLabel,
}: {
  checked: boolean;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <span className="showcase-control">
      <span
        role="radio"
        aria-checked={checked}
        aria-label={ariaLabel ?? label}
        tabIndex={checked ? 0 : -1}
        className={`showcase-radio${checked ? ' showcase-radio--checked' : ''}`}
      />
      <span
        className={`showcase-control__label${checked ? '' : ' showcase-control__label--muted'}`}
      >
        {label}
      </span>
    </span>
  );
}
