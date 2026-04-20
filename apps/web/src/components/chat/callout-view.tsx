import type { components } from '@investment-tracker/shared-types';
import { AlertTriangle, BookOpen, Info, Sparkles } from 'lucide-react';

type Callout = components['schemas']['AIMessageContentCallout'];

export interface CalloutViewProps {
  data: Callout;
}

/**
 * Inline callout block — Behavioral Coach (§14.1) + Explainer (§14.3).
 * Rendered from persisted AIMessage only; the live stream never emits it.
 */
export function CalloutView({ data }: CalloutViewProps) {
  const style = toneStyle(data.kind);
  const Icon = style.icon;
  return (
    <div role="note" className={`rounded-md border p-3 ${style.container}`} data-kind={data.kind}>
      <div className="flex items-start gap-3">
        <Icon size={16} aria-hidden="true" className={style.icon_color} />
        <div className="space-y-1">
          <div className={`text-sm font-medium ${style.title_color}`}>{data.title}</div>
          <p className="text-sm leading-relaxed text-text-secondary">{data.body}</p>
          {data.term_slug ? (
            <div className="text-xs text-text-tertiary">
              See glossary: <span className="font-mono">{data.term_slug}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface ToneStyle {
  container: string;
  icon: typeof AlertTriangle;
  icon_color: string;
  title_color: string;
}

function toneStyle(kind: Callout['kind']): ToneStyle {
  switch (kind) {
    case 'behavioral':
      return {
        container: 'border-state-warning-default/40 bg-state-warning-subtle',
        icon: AlertTriangle,
        icon_color: 'text-state-warning-default',
        title_color: 'text-text-primary',
      };
    case 'explainer':
      return {
        container: 'border-border-subtle bg-brand-50 dark:bg-brand-950',
        icon: BookOpen,
        icon_color: 'text-brand-600 dark:text-brand-300',
        title_color: 'text-text-primary',
      };
    case 'warning':
      return {
        container: 'border-state-negative-default/40 bg-state-negative-subtle',
        icon: AlertTriangle,
        icon_color: 'text-state-negative-default',
        title_color: 'text-text-primary',
      };
    default:
      return {
        container: 'border-border-subtle bg-background-secondary',
        icon: Info,
        icon_color: 'text-state-info-default',
        title_color: 'text-text-primary',
      };
  }
}

// Re-exported for future `(app)/insights` callout rendering.
export { Sparkles as CalloutSparkIcon };
