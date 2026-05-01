import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Info,
  Landmark,
  type LucideIcon,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wallet,
  X,
} from 'lucide-react';
import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Iconography — Lucide initial 18-icon set on D3 surfaces.
 *
 * Per `docs/design/ICONOGRAPHY.md` — 18 lucide icons, 24×24 viewBox,
 * 1.75 stroke, currentColor only. Tile sits on `--d3-surface-1` with
 * elev-2; stroke is `--d3-ink-mute` at rest, swaps to `--d3-ink` on
 * hover via the `.ds-icon-tile:hover` rule. No filter changes, no
 * background swap — same hover discipline as everywhere else.
 */

interface IconEntry {
  readonly Icon: LucideIcon;
  readonly name: string;
}

const ICONS: readonly IconEntry[] = [
  { Icon: CheckCircle2, name: 'check-circle-2' },
  { Icon: TriangleAlert, name: 'triangle-alert' },
  { Icon: Info, name: 'info' },
  { Icon: X, name: 'x' },
  { Icon: Search, name: 'search' },
  { Icon: Bell, name: 'bell' },
  { Icon: Settings, name: 'settings' },
  { Icon: ArrowRight, name: 'arrow-right' },
  { Icon: ChevronRight, name: 'chevron-right' },
  { Icon: Plus, name: 'plus' },
  { Icon: Pencil, name: 'pencil' },
  { Icon: Trash2, name: 'trash-2' },
  { Icon: TrendingUp, name: 'trending-up' },
  { Icon: TrendingDown, name: 'trending-down' },
  { Icon: Wallet, name: 'wallet' },
  { Icon: Landmark, name: 'landmark' },
  { Icon: Sparkles, name: 'sparkles' },
  { Icon: ShieldCheck, name: 'shield-check' },
];

export function IconographySection() {
  return (
    <SectionShell
      id="iconography"
      title="Iconography"
      meta="LUCIDE · 18-ICON CORE · 1.75 STROKE"
      description="Lucide is the only icon family on the dossier surface. 24×24 viewBox, 1.75 stroke, currentColor — color comes from the parent token, not the SVG. Hover swaps from ink-mute to ink; no filter, no scale."
    >
      <DsRow label="Core 18 — hover any tile">
        <div className="ds-icons">
          {ICONS.map(({ Icon, name }) => (
            <div key={name} className="ds-icon-tile" aria-label={name}>
              <Icon size={24} strokeWidth={1.75} aria-hidden />
              <span className="ds-icon-tile__name">{name}</span>
            </div>
          ))}
        </div>
      </DsRow>
    </SectionShell>
  );
}
