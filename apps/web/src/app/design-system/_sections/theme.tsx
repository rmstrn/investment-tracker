'use client';

import { Button } from '@investment-tracker/ui';
import { ArrowRight } from 'lucide-react';
import { Section, SubBlock } from '../_components/Section';

/**
 * §Theme · Motion testbed — verifies that the global toggles in the sticky
 * showcase header reach every primitive + chart on the page.
 *
 * This section is intentionally short. The header toggles (Light/Dark and
 * Motion on/off) write to `<html>` so all surfaces above respond live.
 * Below: a small motion demo card that the reduced-motion override should
 * mute, and an inline reminder of which attributes drive the system.
 */
export function ThemeSection() {
  return (
    <Section
      id="theme"
      eyebrow="§ Theme · Motion"
      title="Live testbed"
      description="Toggle theme and reduced-motion in the sticky header — every chart and primitive on this page should respond without remount."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SubBlock title="Theme mechanism">
          <div
            className="rounded-[14px]"
            style={{
              background: 'var(--inset)',
              padding: '18px 20px',
              boxShadow: 'var(--shadow-inset-light)',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.55 }}>
              The header writes both <code className="font-mono">.dark</code> class and{' '}
              <code className="font-mono">data-theme=&quot;dark&quot;</code> attribute on{' '}
              <code className="font-mono">&lt;html&gt;</code>. Design tokens emit on both selectors,
              so primitives that key off either form continue to work.
            </p>
            <p
              className="mt-3 font-mono"
              style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.04em' }}
            >
              :root,&nbsp;.dark,&nbsp;[data-theme=&quot;dark&quot;] {'{ … }'}
            </p>
          </div>
        </SubBlock>

        <SubBlock title="Reduced-motion mechanism">
          <div
            className="rounded-[14px]"
            style={{
              background: 'var(--inset)',
              padding: '18px 20px',
              boxShadow: 'var(--shadow-inset-light)',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.55 }}>
              When toggled on, the header writes{' '}
              <code className="font-mono">data-reduced-motion=&quot;true&quot;</code> on{' '}
              <code className="font-mono">&lt;html&gt;</code>. Showcase-only CSS reads it and
              suppresses transitions inside any{' '}
              <code className="font-mono">.showcase-motion-demo</code> region. System-level{' '}
              <code className="font-mono">prefers-reduced-motion: reduce</code> is respected
              automatically.
            </p>
          </div>
        </SubBlock>
      </div>

      <SubBlock title="Motion sentinel" meta="hover the card">
        <div className="showcase-motion-demo">
          <div
            className="rounded-[14px] p-6 transition-transform duration-slow ease-out hover:translate-y-[-2px]"
            style={{
              background: 'var(--card)',
              boxShadow: 'var(--shadow-card)',
              transitionProperty: 'transform, box-shadow',
              cursor: 'default',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                  Hover this card
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: 4 }}>
                  Lift transition; muted when reduced-motion is on.
                </p>
              </div>
              <Button variant="primary" className="gap-2">
                Action <ArrowRight size={14} aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </SubBlock>
    </Section>
  );
}
