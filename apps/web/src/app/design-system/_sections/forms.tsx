import { Search } from 'lucide-react';
import { DsRow, DsSection } from '../_components/DsSection';

/**
 * §Forms — D1-native form primitives on dark surfaces.
 *
 * `bg.surface` fill, hairline border, text-primary on dark, lime focus
 * ring (`outline` + 3px box-shadow halo at 18% opacity). Filter input
 * styled per the chat-search pattern so the AI surface filter inherits.
 */

export function FormsSection() {
  return (
    <DsSection
      id="forms"
      eyebrow="07 · Forms"
      title="Inputs, selects, checkboxes, toggles"
      lede="Forms run on the lifted surface (`--d1-bg-surface`), wrap with the hairline border, and announce focus via a 2px lime ring + soft halo. The filter affordance pattern (right) is the only «pill input» — used inside Record Rail entries as the AI search box."
    >
      <DsRow label="TEXT INPUT · SELECT · TEXTAREA">
        <div className="ds-grid-2">
          <label className="d1-field">
            <span className="d1-field__label">Holding</span>
            <input className="d1-input" type="text" placeholder="MSFT, AAPL, IBKR…" />
            <span className="d1-field__hint">Matches ticker, name, or ISIN.</span>
          </label>

          <label className="d1-field">
            <span className="d1-field__label">Broker</span>
            <select className="d1-select" defaultValue="ibkr">
              <option value="ibkr">Interactive Brokers</option>
              <option value="schwab">Schwab</option>
              <option value="fidelity">Fidelity</option>
            </select>
            <span className="d1-field__hint">Read-only sync. No trade routing.</span>
          </label>

          <label className="d1-field">
            <span className="d1-field__label">Note for the record</span>
            <textarea
              className="d1-textarea"
              placeholder="Why did you set the 9% drift cap on Mar 11?"
            />
            <span className="d1-field__hint">
              Notes anchor the rule. Provedo cites them when the rule fires.
            </span>
          </label>

          <label className="d1-field">
            <span className="d1-field__label">Disabled input</span>
            <input className="d1-input" type="text" defaultValue="Sync paused" disabled />
            <span className="d1-field__hint">Reconnect the broker to resume input.</span>
          </label>
        </div>
      </DsRow>

      <DsRow label="CHECKBOX · RADIO · TOGGLE">
        <div className="ds-grid-3">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--d1-font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--d1-text-muted)',
              }}
            >
              Checkbox
            </p>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'var(--d1-text-primary)',
              }}
            >
              <input className="d1-check" type="checkbox" defaultChecked />
              Send weekly digest
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'var(--d1-text-primary)',
              }}
            >
              <input className="d1-check" type="checkbox" />
              Notify on drift
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--d1-font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--d1-text-muted)',
              }}
            >
              Radio (period)
            </p>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'var(--d1-text-primary)',
              }}
            >
              <input className="d1-radio" type="radio" name="period" defaultChecked />
              Monthly
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'var(--d1-text-primary)',
              }}
            >
              <input className="d1-radio" type="radio" name="period" />
              Annually
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--d1-font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--d1-text-muted)',
              }}
            >
              Toggle
            </p>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'var(--d1-text-primary)',
              }}
            >
              <input className="d1-toggle" type="checkbox" defaultChecked />
              Persistent disclaimer in nav
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                color: 'var(--d1-text-primary)',
              }}
            >
              <input className="d1-toggle" type="checkbox" />
              EU AI Act badge (deferred)
            </label>
          </div>
        </div>
      </DsRow>

      <DsRow label="FILTER PILL INPUT (AI SURFACE PATTERN)">
        <div className="d1-chat__search" style={{ maxWidth: 320 }}>
          <Search size={14} aria-hidden />
          <span>Filter — not compose</span>
        </div>
      </DsRow>
    </DsSection>
  );
}
