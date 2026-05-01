'use client';

import { AlertTriangle } from 'lucide-react';
import { DsRow, DsSection } from '../_components/SectionHead';

/**
 * §Forms — Design System v2 Phase 2.
 *
 * Per `docs/design/PROVEDO_DESIGN_SYSTEM_v2.md` §7.2 (Input) + §8 (Input row).
 * Where `<PrimitivesSection>` shows the bare Input × five-state matrix in
 * isolation, this section binds inputs to real form-level patterns:
 *
 *   - Label + helper text (default)
 *   - Label + error helper (`aria-invalid` + signal-orange-deep border)
 *   - Compound form layout (two side-by-side fields with shared submit)
 *
 * Both registers are illustrated:
 *   - Paper register — single-column form with inset wells.
 *   - Marketing register — heavier ink-bordered email capture inside a
 *     `[data-surface="candy"]` block so reviewers see how the input
 *     survives sitting on a candy field.
 *
 * No JS state — natural HTML semantics + `aria-invalid` so the error state
 * is announced by screen readers without script.
 */

export interface FormsSectionProps {
  variant: 'light' | 'dark';
}

export function FormsSection({ variant }: FormsSectionProps) {
  const ids = {
    name: `ds-v2-name-${variant}`,
    portfolio: `ds-v2-portfolio-${variant}`,
    email: `ds-v2-candy-email-form-${variant}`,
  };
  return (
    <DsSection
      title="Form fields"
      meta={variant === 'light' ? 'paper · candy · label-helper-error' : 'two registers'}
    >
      <DsRow label="Paper register — label + helper + error">
        <div
          // Two-column layout so the default-state field and the error
          // field share visual weight, making the difference between them
          // legible at a glance.
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
            maxWidth: 720,
          }}
        >
          <div className="v2-field">
            <label className="v2-field__label" htmlFor={ids.name}>
              Display name
            </label>
            <input
              id={ids.name}
              type="text"
              className="v2-input"
              placeholder="Ruslan Maistrenko"
              defaultValue="Ruslan Maistrenko"
              aria-describedby={`${ids.name}-help`}
            />
            <p id={`${ids.name}-help`} className="v2-field__helper">
              Visible to anyone you share a portfolio link with.
            </p>
          </div>
          <div className="v2-field">
            <label className="v2-field__label" htmlFor={ids.portfolio}>
              Portfolio name
            </label>
            <input
              id={ids.portfolio}
              type="text"
              className="v2-input"
              placeholder="My main portfolio"
              defaultValue="Main"
              aria-invalid="true"
              aria-describedby={`${ids.portfolio}-help`}
            />
            <p
              id={`${ids.portfolio}-help`}
              className="v2-field__helper v2-field__helper--error"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <AlertTriangle size={12} aria-hidden />
              Already exists. Pick a different name.
            </p>
          </div>
        </div>
      </DsRow>

      <DsRow label="Marketing register — early-access capture on candy field">
        <div className="v2-candy-field" data-surface="candy">
          <form
            // Pure visual — no submit handler in the showcase. Marketing
            // landing wires this to a real CTA later.
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 420,
            }}
          >
            <label
              className="v2-field__label"
              htmlFor={ids.email}
              style={{ color: 'var(--text-on-candy, #1C1B26)' }}
            >
              Get early access
            </label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                id={ids.email}
                type="email"
                className="v2-input v2-input--candy"
                placeholder="you@inbox.com"
                aria-describedby={`${ids.email}-help`}
                style={{ flex: '1 1 220px', minWidth: 220 }}
              />
              <button type="submit" className="v2-btn">
                Notify me
              </button>
            </div>
            <p
              id={`${ids.email}-help`}
              className="v2-field__helper"
              style={{ color: 'var(--text-on-candy, #1C1B26)', opacity: 0.85 }}
            >
              We&apos;ll only ping for early access. No newsletter spam.
            </p>
          </form>
        </div>
      </DsRow>
    </DsSection>
  );
}
