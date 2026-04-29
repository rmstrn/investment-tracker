import { RegulatoryDisclaimer } from '@investment-tracker/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer — Provedo',
  description: 'Provedo regulatory disclaimer — informational service, not investment advice.',
};

/**
 * `/legal/disclaimer` — full Lane-A regulatory disclaimer (TD-100).
 *
 * Renders the verbose variant of `<RegulatoryDisclaimer>` (all 7 legal floor
 * statements §1.1–§1.7). Linked from the compact disclaimer mounted in
 * every `(app)` route.
 *
 * Locale: hardcoded `en` until the i18n routing slice lands. Switching to
 * `lang={locale}` once the locale resolver is in place is a one-line
 * change.
 */
export default function DisclaimerPage() {
  return <RegulatoryDisclaimer variant="verbose" lang="en" />;
}
