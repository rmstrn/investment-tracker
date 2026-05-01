'use client';

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
import { Section } from '../_components/Section';

/**
 * §Iconography — Lucide initial 18-icon set per docs/design/ICONOGRAPHY.md.
 *
 * 6×3 grid; each tile shows an icon + its lucide name in mono. Hover lifts
 * the tile and shifts the stroke from `text-3` to `ink`. Click is wired but
 * the showcase intentionally does not surface a clipboard toast yet —
 * promotes when a CopyToClipboardChip primitive lands.
 */

interface IconEntry {
  readonly Icon: LucideIcon;
  readonly name: string;
  readonly use: string;
}

const ICONS: readonly IconEntry[] = [
  { Icon: CheckCircle2, name: 'check-circle-2', use: 'Success' },
  { Icon: TriangleAlert, name: 'triangle-alert', use: 'Warning' },
  { Icon: Info, name: 'info', use: 'Info' },
  { Icon: X, name: 'x', use: 'Close' },
  { Icon: Search, name: 'search', use: 'Search' },
  { Icon: Bell, name: 'bell', use: 'Notify' },
  { Icon: Settings, name: 'settings', use: 'Settings' },
  { Icon: ArrowRight, name: 'arrow-right', use: 'CTA' },
  { Icon: ChevronRight, name: 'chevron-right', use: 'Crumb' },
  { Icon: Plus, name: 'plus', use: 'Add' },
  { Icon: Pencil, name: 'pencil', use: 'Edit' },
  { Icon: Trash2, name: 'trash-2', use: 'Delete' },
  { Icon: TrendingUp, name: 'trending-up', use: '+ Δ' },
  { Icon: TrendingDown, name: 'trending-down', use: '− Δ' },
  { Icon: Wallet, name: 'wallet', use: 'Accounts' },
  { Icon: Landmark, name: 'landmark', use: 'Broker' },
  { Icon: Sparkles, name: 'sparkles', use: 'Citation' },
  { Icon: ShieldCheck, name: 'shield-check', use: 'Trust' },
];

export function IconographySection() {
  return (
    <Section
      id="iconography"
      eyebrow="§ Iconography"
      title="Lucide — initial 18-icon set"
      description="SVG, currentColor, 24×24 viewBox. Hover a tile to see the stroke darken from text-3 → ink. Use cases per docs/design/ICONOGRAPHY.md."
    >
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))' }}
      >
        {ICONS.map(({ Icon, name, use }) => (
          <button
            key={name}
            type="button"
            className="showcase-icon-tile"
            aria-label={`${name} icon — used for ${use.toLowerCase()}`}
          >
            <Icon size={24} strokeWidth={1.75} aria-hidden />
            <span className="showcase-icon-tile__label">{name}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-2)', letterSpacing: '0.02em' }}>
              {use}
            </span>
          </button>
        ))}
      </div>
    </Section>
  );
}
