'use client';

import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { DsRow, DsSection } from '../_components/SectionHead';

/**
 * §Primitives — Design System v2 Phase 2.
 *
 * Per `docs/design/PROVEDO_DESIGN_SYSTEM_v2.md` §7 (component primitives) and
 * §8 (state matrix). Two groups render here:
 *
 *   1. Button — three variants (primary / secondary / ghost) × five states
 *      (default / hover / focus / active / disabled). Pinned states use
 *      class modifiers (`is-hover`, `is-active`, `is-disabled`); the
 *      "default" cell additionally exposes the real CSS pseudo-classes so
 *      reviewers can hover/focus/click and feel the gesture.
 *
 *   2. Input — text input × five states + a marketing variant (`v2-input--candy`)
 *      that survives sitting on a candy field. Per §7.2 last line.
 *
 * Card variants live in the `<CardsSection>` (cards.tsx) per Phase 2 split.
 * Form-level patterns (label + helper + error) live in the `<FormsSection>`.
 *
 * State variants are real CSS pseudo-class hooks — no JS-driven simulation —
 * so keyboard-only review surfaces every state honestly.
 */

export interface PrimitivesSectionProps {
  variant: 'light' | 'dark';
}

type ButtonVariantKey = 'primary' | 'secondary' | 'ghost';

type StateKey = 'default' | 'hover' | 'focus' | 'active' | 'disabled';

const BUTTON_VARIANTS: Array<{ key: ButtonVariantKey; label: string; meta: string }> = [
  { key: 'primary', label: 'Primary', meta: 'signal-orange · 5/5 ink shadow' },
  { key: 'secondary', label: 'Secondary', meta: 'ink outline · 4/4 ink shadow' },
  { key: 'ghost', label: 'Ghost', meta: 'paper register · no shadow' },
];

const STATES: Array<{ key: StateKey; label: string }> = [
  { key: 'default', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled' },
];

export function PrimitivesSection({ variant }: PrimitivesSectionProps) {
  return (
    <>
      <DsSection
        title="Button"
        meta={
          variant === 'light' ? 'primary · secondary · ghost · 5 states' : '3 variants × 5 states'
        }
      >
        {BUTTON_VARIANTS.map((btnVariant) => (
          <DsRow key={btnVariant.key} label={`${btnVariant.label} — ${btnVariant.meta}`}>
            <div className="v2-state-grid">
              {STATES.map((state) => (
                <StateCell key={`${btnVariant.key}-${state.key}`} label={state.label}>
                  <V2Button variant={btnVariant.key} state={state.key}>
                    {btnVariant.key === 'primary' ? (
                      <>
                        Get started
                        <ArrowRight size={16} aria-hidden />
                      </>
                    ) : btnVariant.key === 'secondary' ? (
                      'Watch demo'
                    ) : (
                      'Skip for now'
                    )}
                  </V2Button>
                </StateCell>
              ))}
            </div>
          </DsRow>
        ))}
      </DsSection>

      <DsSection
        title="Input"
        meta={variant === 'light' ? 'paper inset · candy variant' : 'two registers · 5 states'}
      >
        <DsRow label="Paper register — text input">
          <div className="v2-state-grid">
            {STATES.map((state) => (
              <StateCell key={`input-${state.key}`} label={state.label}>
                <V2Input
                  state={state.key}
                  ariaLabel={`Email — ${state.label.toLowerCase()} state`}
                  placeholder="you@inbox.com"
                  defaultValue={state.key === 'default' ? '' : 'ruslan@provedo.app'}
                />
              </StateCell>
            ))}
          </div>
        </DsRow>
        <DsRow label="Marketing variant — heavier ink border for candy fields">
          <div className="v2-candy-field" data-surface="candy">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
              <label
                className="v2-field__label"
                htmlFor="ds-v2-candy-email"
                style={{ color: 'var(--text-on-candy, #1C1B26)' }}
              >
                Email — early access
              </label>
              <input
                id="ds-v2-candy-email"
                type="email"
                className="v2-input v2-input--candy"
                placeholder="you@inbox.com"
                aria-describedby="ds-v2-candy-email-help"
              />
              <p
                id="ds-v2-candy-email-help"
                className="v2-field__helper"
                style={{ color: 'var(--text-on-candy, #1C1B26)' }}
              >
                Drop your address — we&apos;ll only ping for early access.
              </p>
            </div>
          </div>
        </DsRow>
      </DsSection>
    </>
  );
}

/**
 * StateCell — wraps one cell of the state-matrix grid with an uppercase
 * mono label so reviewers can identify each pinned state at a glance.
 */
function StateCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="v2-state-cell">
      <p className="v2-state-cell__label">{label}</p>
      <div className="v2-state-cell__stage">{children}</div>
    </div>
  );
}

/**
 * V2Button — primitives showcase button with both pseudo-class behaviour
 * (default cell only — reviewers can interact with it) and pinned-state
 * class modifiers for the matrix cells. Disabled cell sets the native
 * `disabled` attribute so screen readers announce correctly.
 */
function V2Button({
  variant,
  state,
  children,
}: {
  variant: ButtonVariantKey;
  state: StateKey;
  children: ReactNode;
}) {
  const variantClass = variant === 'primary' ? '' : ` v2-btn--${variant}`;
  const stateClass = state === 'default' ? '' : ` is-${state}`;
  const isDisabled = state === 'disabled';
  return (
    <button
      type="button"
      className={`v2-btn${variantClass}${stateClass}`}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-label={`${variant} button — ${state}`}
      // Pinned focus uses the same outline as :focus-visible so reviewers
      // see the focus ring without needing keyboard navigation. The
      // default cell still earns its ring through the real pseudo-class.
      style={
        state === 'focus'
          ? {
              outline: '3px solid var(--color-signal-orange, #F08A3C)',
              outlineOffset: '2px',
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

/**
 * V2Input — paper-register text input. Pinned states match the live
 * pseudo-classes (`:hover` `:focus-visible`) on the default cell.
 */
function V2Input({
  state,
  ariaLabel,
  placeholder,
  defaultValue,
}: {
  state: StateKey;
  ariaLabel: string;
  placeholder: string;
  defaultValue?: string;
}) {
  const stateClass = state === 'default' ? '' : ` is-${state}`;
  const isDisabled = state === 'disabled';
  return (
    <input
      type="email"
      aria-label={ariaLabel}
      className={`v2-input${stateClass}`}
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={isDisabled}
      style={
        state === 'focus'
          ? {
              outline: '3px solid var(--color-signal-orange, #F08A3C)',
              outlineOffset: '2px',
              borderColor: 'var(--color-signal-orange, #F08A3C)',
            }
          : undefined
      }
    />
  );
}
