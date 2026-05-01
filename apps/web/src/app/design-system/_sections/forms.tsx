import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Forms — D3-native inputs / select / textarea / checkbox / radio / toggle.
 *
 * Surface-1 fill, hairline border, ink-mute placeholder, ink text.
 * Focus: chartreuse 1px ring (no inset glow — kept on top of the border
 * so the dossier surface stays calm). Toggle is sculpted (radius 6px),
 * NOT pill — same discipline as the chips.
 *
 * Each control shows the four states explicitly: default / hover / focus
 * / disabled. Hover is hard to demonstrate statically; reader hovers each
 * control to see the border-color swap to ink-mute.
 */

export function FormsSection() {
  return (
    <SectionShell
      id="forms"
      title="Forms"
      meta="INPUTS · SELECTS · CHECKBOX · RADIO · TOGGLE"
      description="Surface-1 base, hairline at rest, chartreuse 1px ring on focus. The toggle is sculpted — 6px radius slot, 4px radius thumb, no pill anywhere. Same discipline as every other control."
    >
      <DsRow label="Text input">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <label className="ds-field">
            <span className="ds-field__label">Default</span>
            <input type="text" className="ds-input" placeholder="e.g. NVDA" defaultValue="ASML" />
          </label>
          <label className="ds-field">
            <span className="ds-field__label">Empty / placeholder</span>
            <input
              type="text"
              className="ds-input"
              placeholder="Search by ticker, account, or note"
            />
          </label>
          <label className="ds-field">
            <span className="ds-field__label">Disabled</span>
            <input type="text" className="ds-input" disabled defaultValue="Read-only field" />
          </label>
        </div>
      </DsRow>

      <DsRow label="Select">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <label className="ds-field">
            <span className="ds-field__label">Currency</span>
            <select className="ds-select" defaultValue="USD">
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="CHF">CHF — Swiss Franc</option>
            </select>
          </label>
          <label className="ds-field">
            <span className="ds-field__label">Period</span>
            <select className="ds-select" defaultValue="30">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="ytd">Year to date</option>
            </select>
          </label>
        </div>
      </DsRow>

      <DsRow label="Textarea">
        <label className="ds-field" style={{ maxWidth: 520 }}>
          <span className="ds-field__label">Note (private)</span>
          <textarea
            className="ds-textarea"
            rows={4}
            placeholder="Add context for this position. Read-only across brokers; only you see this."
            defaultValue=""
          />
        </label>
      </DsRow>

      <DsRow label="Checkbox + Radio">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="ds-field__label">Checkbox</span>
            <label className="ds-check">
              <input type="checkbox" className="ds-check__box" defaultChecked />
              <span>Include reinvested dividends</span>
            </label>
            <label className="ds-check">
              <input type="checkbox" className="ds-check__box" />
              <span>Show out-of-band positions</span>
            </label>
            <label className="ds-check">
              <input type="checkbox" className="ds-check__box" disabled />
              <span style={{ color: 'var(--d3-ink-mute)' }}>Locked (admin)</span>
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="ds-field__label">Radio</span>
            <label className="ds-check">
              <input type="radio" name="ds-radio-demo" className="ds-radio" defaultChecked />
              <span>Aggregate across brokers</span>
            </label>
            <label className="ds-check">
              <input type="radio" name="ds-radio-demo" className="ds-radio" />
              <span>Per-broker breakdown</span>
            </label>
            <label className="ds-check">
              <input type="radio" name="ds-radio-demo" className="ds-radio" />
              <span>Per-currency breakdown</span>
            </label>
          </div>
        </div>
      </DsRow>

      <DsRow label="Toggle (sculpted — radius 6px, NOT pill)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="ds-check">
            <button
              type="button"
              className="ds-toggle"
              role="switch"
              aria-checked
              aria-labelledby="ds-toggle-daily-label"
              data-state="on"
            />
            <span id="ds-toggle-daily-label">AI dossier — daily digest</span>
          </div>
          <div className="ds-check">
            <button
              type="button"
              className="ds-toggle"
              role="switch"
              aria-checked={false}
              aria-labelledby="ds-toggle-instant-label"
              data-state="off"
            />
            <span id="ds-toggle-instant-label">AI dossier — instant alerts</span>
          </div>
        </div>
      </DsRow>
    </SectionShell>
  );
}
