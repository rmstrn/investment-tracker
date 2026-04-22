import type { InsightSeverity as UISeverity } from '@investment-tracker/ui';
import type { InsightSeverity as BackendSeverity } from '../../lib/api/insights';

/**
 * Maps backend InsightSeverity (3 values) to UI InsightCard severity (4 values).
 * `positive` is never returned by the backend in Slice 6a — omitted from mapping.
 *
 * PO decision (2026-04-22): critical → negative (red, not yellow).
 */
export function mapSeverity(severity: BackendSeverity): UISeverity {
  switch (severity) {
    case 'critical':
      return 'negative';
    case 'warning':
      return 'warning';
    default:
      return 'info';
  }
}
