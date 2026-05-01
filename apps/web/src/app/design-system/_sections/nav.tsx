'use client';

import { useState } from 'react';
import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Nav — sculpted nav demo (NOT pill nav).
 *
 * 1.5px chartreuse-cream underline animates from scaleX(0) → scaleX(1)
 * at the active item; transform-origin: left so it grows in from the
 * left edge over 240ms cubic-bezier(0.16, 1, 0.3, 1). Reduced-motion:
 * underline appears instantly (transition: none) — never disappears.
 *
 * The mock nav is interactive: click any item to swap the active state
 * and watch the underline animate. No router involved — it's a state
 * demo, not a real nav.
 */

const NAV_ITEMS: readonly string[] = ['overview', 'insights', 'analytics', 'audiences', 'reports'];

export function NavSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SectionShell
      id="nav"
      title="Nav (sculpted)"
      meta="1.5PX UNDERLINE · NO PILL"
      description="Pill nav is dead. Active items get a 1.5px chartreuse underline that scales in from the left edge over 240ms. Click any item below to see the swap — reduced-motion users get the underline instantly, never absent."
    >
      <DsRow label="Sculpted nav — click to swap active item">
        <nav className="ds-nav-demo" aria-label="Nav demo">
          <span className="ds-nav-demo__brand">PROVEDO</span>
          <ul className="ds-nav-demo__list">
            {NAV_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={
                      isActive ? 'ds-nav-demo__item ds-nav-demo__item--active' : 'ds-nav-demo__item'
                    }
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </DsRow>

      <DsRow label="Why sculpted, not pill">
        <p className="ds-prose">
          A pill carries weight — it announces the active item with fill, shadow, and 9999px radius.
          The dossier surface refuses 9999px everywhere; the active state has to find a quieter
          signal. The 1.5px underline reads as engraved, not stickered. It also leaves the
          typography untouched — the active label keeps its full colour, never inverts on a fill.
        </p>
      </DsRow>
    </SectionShell>
  );
}
