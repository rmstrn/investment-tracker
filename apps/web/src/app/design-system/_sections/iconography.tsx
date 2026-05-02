import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChartBar,
  ChartPie,
  CircleAlert,
  Eye,
  Filter,
  Lock,
  type LucideIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';

/**
 * §Iconography — Lucide on D1 surfaces.
 *
 * `currentColor` everywhere. Default rendering is `--d1-text-muted`,
 * hover lifts to `--d1-text-primary`, lime surfaces (CTA, lime KPI)
 * carry `--d1-text-ink`. 24×24 viewBox; consume at 14-20px.
 *
 * The 18-icon initial set per `docs/design/ICONOGRAPHY.md` is what the
 * D1 app reaches for. Add via PR — never hand-roll a glyph that has a
 * Lucide equivalent.
 */

interface IconRow {
  readonly Icon: LucideIcon;
  readonly name: string;
  readonly use: string;
}

const ICONS: ReadonlyArray<IconRow> = [
  { Icon: Wallet, name: 'wallet', use: 'KPI · portfolio value' },
  { Icon: ChartBar, name: 'chart-bar', use: 'KPI · drift; allocation panel' },
  { Icon: ChartPie, name: 'chart-pie', use: 'KPI · sector allocation; donut chart' },
  { Icon: ArrowUpRight, name: 'arrow-up-right', use: 'KPI ext-link affordance' },
  { Icon: ArrowRight, name: 'arrow-right', use: 'CTA leading; segmented next' },
  { Icon: Plus, name: 'plus', use: 'Connect a broker; add account' },
  { Icon: Lock, name: 'lock', use: 'Disclaimer chip · «Read-only»' },
  { Icon: Eye, name: 'eye', use: 'Toggle visibility; alt for «Read-only»' },
  { Icon: Bell, name: 'bell', use: 'Notification icon-pill (badge separately)' },
  { Icon: Settings, name: 'settings', use: 'Account settings nav icon-pill' },
  { Icon: Search, name: 'search', use: 'Filter affordance — never composer' },
  { Icon: Filter, name: 'filter', use: 'Filter chip alt; advanced filter sheet' },
  { Icon: MoreHorizontal, name: 'more-horizontal', use: 'Overflow nav; row actions' },
  { Icon: RefreshCw, name: 'refresh-cw', use: 'Stale data retry; broker resync' },
  { Icon: TriangleAlert, name: 'triangle-alert', use: 'Sync-error chip (amber surface only)' },
  { Icon: CircleAlert, name: 'circle-alert', use: 'Inline form error icon' },
];

interface IconCellProps {
  Icon: LucideIcon;
  bg?: string;
  color?: string;
  size?: number;
}

function IconCell({
  Icon,
  bg = 'var(--d1-bg-card)',
  color = 'var(--d1-text-muted)',
  size = 18,
}: IconCellProps) {
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 12,
        width: 44,
        height: 44,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={size} aria-hidden />
    </span>
  );
}

export function IconographySection() {
  return (
    <DsSection
      id="iconography"
      eyebrow="09 · Iconography"
      title="Lucide, currentColor, three colour roles"
      lede="Every glyph is Lucide via SVG with `currentColor`. Default is text-muted; the parent surface decides the colour. Lime CTAs carry text-ink; nav idle carries text-muted; nav hover lifts to text-primary."
    >
      <DsRow label="STARTER SET (18 ICONS)">
        <div className="ds-grid-3">
          {ICONS.map(({ Icon, name, use }) => (
            <div
              key={name}
              style={{
                background: 'var(--d1-bg-card)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                border: '1px solid var(--d1-border-hairline)',
              }}
            >
              <IconCell Icon={Icon} />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--d1-font-mono)',
                    fontSize: 12,
                    color: 'var(--d1-text-primary)',
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 11,
                    color: 'var(--d1-text-muted)',
                  }}
                >
                  {use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DsRow>

      <DsRow label="COLOUR ROLE — MUTED · PRIMARY · INK · AMBER">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <IconCell Icon={ChartBar} />
          <IconCell Icon={ChartBar} color="var(--d1-text-primary)" />
          <IconCell Icon={ChartBar} bg="var(--d1-accent-lime)" color="var(--d1-text-ink)" />
          <IconCell
            Icon={TriangleAlert}
            bg="var(--d1-notification-amber-soft)"
            color="var(--d1-text-ink)"
          />
        </div>
      </DsRow>

      <DsCallout heading="No emoji as icons">
        Every glyph is Lucide via inline SVG. No emoji slips into the UI even for «celebratory»
        states — the brand voice is on-the-record, not congratulatory.
      </DsCallout>
    </DsSection>
  );
}
