'use client';

import { Input } from '@investment-tracker/ui';
import { AlertTriangle, Search } from 'lucide-react';
import {
  PlaceholderCheckbox,
  PlaceholderRadio,
  PlaceholderSwitch,
} from '../_components/PlaceholderControl';
import { DsRow, DsSection } from '../_components/SectionHead';

/**
 * §Forms — form fields rendered in product context.
 *
 * Mirrors the static reference (`apps/web/public/design-system.html` §Form
 * fields). Real React `<Input>` from `@investment-tracker/ui` is used for the
 * email + portfolio name + search bar. Switch / Checkbox / Radio are visual
 * stubs from `<PlaceholderControl>` until Phase γ ships them.
 *
 * Real Provedo copy throughout:
 *   - Email value: `ruslan@provedo.app`
 *   - Help text: «We'll only ping for early access.»
 *   - Error: «Already exists.» on Portfolio name
 *   - Search placeholder: «Ask about your portfolio…»
 *   - Switches: Push alerts (on) + Weekly digest (off)
 *   - Checkboxes: Anonymise (checked) + Telemetry (off)
 *   - Radios: Lane A (selected) + Lane B
 */

export interface FormsSectionProps {
  variant: 'light' | 'dark';
}

export function FormsSection({ variant }: FormsSectionProps) {
  const ids = {
    email: `ds-email-${variant}`,
    portfolio: `ds-portfolio-${variant}`,
    search: `ds-search-${variant}`,
  };
  return (
    <DsSection title="Form fields" meta="inset + ink-on toggles">
      <DsRow>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          <div className="showcase-input-group">
            <label className="showcase-input-label" htmlFor={ids.email}>
              Email
            </label>
            <Input
              id={ids.email}
              type="email"
              placeholder="you@inbox.com"
              defaultValue="ruslan@provedo.app"
              aria-describedby={`${ids.email}-help`}
            />
            <p id={`${ids.email}-help`} className="showcase-input-help">
              We&apos;ll only ping for early access.
            </p>
          </div>
          <div className="showcase-input-group">
            <label className="showcase-input-label" htmlFor={ids.portfolio}>
              Portfolio name
            </label>
            <Input
              id={ids.portfolio}
              invalid
              placeholder="My main portfolio"
              aria-describedby={`${ids.portfolio}-help`}
            />
            <p
              id={`${ids.portfolio}-help`}
              className="showcase-input-help showcase-input-help--error"
            >
              <AlertTriangle size={12} aria-hidden />
              Already exists.
            </p>
          </div>
        </div>
      </DsRow>

      <DsRow>
        <div className="showcase-search-wrap">
          <label htmlFor={ids.search} className="sr-only">
            Ask about your portfolio
          </label>
          <Search size={14} aria-hidden className="showcase-search-wrap__glyph" />
          <Input
            id={ids.search}
            type="search"
            placeholder="Ask about your portfolio…"
            className="showcase-search-input"
          />
        </div>
      </DsRow>

      <DsRow>
        <div className="showcase-flex-wrap" style={{ gap: 32, alignItems: 'center', rowGap: 12 }}>
          <PlaceholderSwitch on label="Push alerts" />
          <PlaceholderSwitch on={false} label="Weekly digest" />
          <PlaceholderCheckbox checked label="Anonymise" />
          <PlaceholderCheckbox checked={false} label="Telemetry" />
          <PlaceholderRadio checked label="Lane A" />
          <PlaceholderRadio checked={false} label="Lane B" />
        </div>
      </DsRow>
    </DsSection>
  );
}
