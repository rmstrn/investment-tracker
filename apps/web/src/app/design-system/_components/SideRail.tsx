'use client';

import { useEffect, useState } from 'react';

/**
 * SideRail — sticky left rail (240px, ≥1024px) with anchor links to each
 * design-system section. Active item gets the 1.5px chartreuse underline
 * defined in `.ds-rail__item--active::after`.
 *
 * Uses IntersectionObserver to track which section is currently in viewport
 * (instead of polling scroll position). Reduced-motion users still get the
 * sculpted underline, but the scaleX transition collapses to instant per
 * the `@media (prefers-reduced-motion: reduce)` rule in dossier.css.
 *
 * Below 1024px the CSS collapses the rail to a top-anchor list (static
 * position, no max-height) — same markup, different layout.
 */

export interface SideRailItem {
  readonly id: string;
  readonly label: string;
}

export interface SideRailProps {
  items: readonly SideRailItem[];
}

export function SideRail({ items }: SideRailProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;

    // Watch every target section. The first section to enter the
    // viewport's top half wins. rootMargin is biased so the rail
    // doesn't flicker between two adjacent sections during scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visible[0];
        if (top?.target.id) {
          setActiveId(top.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="ds-rail" aria-label="Design system sections">
      <div>
        <p className="ds-rail__brand">Provedo · DS v4</p>
        <p className="ds-rail__caption">Private Dossier</p>
      </div>
      <nav>
        <ul className="ds-rail__list">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={isActive ? 'ds-rail__item ds-rail__item--active' : 'ds-rail__item'}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
