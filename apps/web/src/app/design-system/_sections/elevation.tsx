import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Elevation — 4-tier shadow stack on a single canvas, side-by-side.
 *
 * Per KICKOFF §0 D3 elevation taxonomy: 5 tiers total (canvas-implicit /
 * elev-1 / elev-2 / elev-3 / elev-4). Every elevated surface gets BOTH
 * the 1px hairline AND the shadow — the hairline is what makes Mercury
 * read as Mercury (without it, dark cards muddle into the canvas).
 *
 * Each tile carries: name (mono, uppercase), role (sans, body), and the
 * actual box-shadow recipe in mono so the implementer can copy-paste.
 */

interface ElevationTile {
  readonly tier: 1 | 2 | 3 | 4;
  readonly name: string;
  readonly role: string;
  readonly recipe: string;
}

const ELEV_TILES: readonly ElevationTile[] = [
  {
    tier: 1,
    name: '--d3-elev-1',
    role: 'Chip rest, inactive button, table row.',
    recipe: '0 1px 0 rgba(0,0,0,0.30)',
  },
  {
    tier: 2,
    name: '--d3-elev-2',
    role: 'Cards default. KPI / chart panel / AI dossier at rest.',
    recipe: '0 1px 2px rgba(0,0,0,0.35), 0 0 0 1px var(--d3-hairline)',
  },
  {
    tier: 3,
    name: '--d3-elev-3',
    role: 'KPI hover, AI input on focus. Hover swap from elev-2.',
    recipe: '0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px var(--d3-hairline)',
  },
  {
    tier: 4,
    name: '--d3-elev-4',
    role: 'Tooltip / dropdown / popover. Floating only.',
    recipe: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px var(--d3-hairline)',
  },
];

export function ElevationSection() {
  return (
    <SectionShell
      id="elevation"
      title="Elevation"
      meta="4 TIERS · ALL CARRY HAIRLINE"
      description="Four shadow tiers, all paired with the 1px hairline. Strip the hairline and the cards lose their Mercury edge — dark surfaces need both signals to read as sculpted, not floating."
    >
      <DsRow label="elev-1 → elev-4 on canvas (KPI surface for context)">
        <div className="ds-elev-row">
          {ELEV_TILES.map((tile) => (
            <article key={tile.name} className={`ds-elev-tile ds-elev-tile--${tile.tier}`}>
              <p className="ds-elev-tile__name">{tile.name}</p>
              <p className="ds-elev-tile__role">{tile.role}</p>
              <p className="ds-elev-tile__recipe">{tile.recipe}</p>
            </article>
          ))}
        </div>
      </DsRow>

      <DsRow label="The hairline rule">
        <p className="ds-prose">
          Every elevated surface gets BOTH the shadow and the 1px hairline — never just one. The
          hairline pins the card edge against the warm-graphite canvas; the shadow gives the card
          its weight. Drop either and the surface reads as floating-glass (D2) instead of
          sculpted-leather (D3).
        </p>
      </DsRow>
    </SectionShell>
  );
}
