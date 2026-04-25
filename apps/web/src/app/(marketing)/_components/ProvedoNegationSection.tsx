'use client';

// ProvedoNegationSection — §S3 problem-negation visual rebuild (v3)
// V3.1: 3-column grid with illustrated «not» concepts + cross-out animation
// Each column: circular icon (Lucide) + red X overlay (SVG stroke-dashoffset animate on view)
// Animation: sequential 100ms stagger per column on IntersectionObserver
// Fallback: prefers-reduced-motion → static X marks fully visible
// Lane A: explicit disclaimer register — «not a robo-advisor / will not tell you what to buy»
// Accessibility: aria-labelledby h2, icons aria-hidden, alt copy in visible text

import { Bot, Building2, TrendingDown } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

interface NegationColumn {
  icon: React.ElementType;
  iconLabel: string;
  notLabel: string;
  subLabel: string;
  animDelay: number;
}

const NEGATION_COLUMNS: ReadonlyArray<NegationColumn> = [
  {
    icon: Bot,
    iconLabel: 'Algorithm icon',
    notLabel: 'Not a robo-advisor',
    subLabel: 'moves money for you',
    animDelay: 0,
  },
  {
    icon: Building2,
    iconLabel: 'Exchange icon',
    notLabel: 'Not a brokerage',
    subLabel: 'executes trades',
    animDelay: 100,
  },
  {
    icon: TrendingDown,
    iconLabel: 'Action directive icon',
    notLabel: 'Not advice',
    subLabel: 'tells you what to buy',
    animDelay: 200,
  },
] as const;

// SVG path for X mark (inside 80×80 circle, centered at 40,40)
// Two diagonal lines: (20,20)→(60,60) and (60,20)→(20,60)
// Path length ≈ 57px each diagonal, total ≈ 114px (dash-offset trick)
const X_PATH_1 = 'M 20 20 L 60 60';
const X_PATH_2 = 'M 60 20 L 20 60';
const X_PATH_LENGTH = 57;

function CrossOutIcon({
  icon: Icon,
  iconLabel,
  animDelay,
  animate,
  prefersReduced,
}: {
  icon: React.ElementType;
  iconLabel: string;
  animDelay: number;
  animate: boolean;
  prefersReduced: boolean;
}): React.ReactElement {
  const shouldShow = prefersReduced || animate;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: '80px',
        height: '80px',
      }}
    >
      {/* Icon circle background */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--provedo-bg-elevated)',
          border: '1px solid var(--provedo-border-subtle)',
        }}
      >
        <Icon
          size={32}
          strokeWidth={1.5}
          aria-label={iconLabel}
          style={{ color: 'var(--provedo-text-tertiary)' }}
        />
      </div>

      {/* Cross-out X overlay — animated SVG stroke-dashoffset */}
      <svg
        viewBox="0 0 80 80"
        width="80"
        height="80"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <path
          d={X_PATH_1}
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: X_PATH_LENGTH,
            strokeDashoffset: shouldShow ? 0 : X_PATH_LENGTH,
            transition: prefersReduced
              ? 'none'
              : `stroke-dashoffset 300ms cubic-bezier(0.16,1,0.3,1) ${animDelay}ms`,
          }}
        />
        <path
          d={X_PATH_2}
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: X_PATH_LENGTH,
            strokeDashoffset: shouldShow ? 0 : X_PATH_LENGTH,
            transition: prefersReduced
              ? 'none'
              : `stroke-dashoffset 300ms cubic-bezier(0.16,1,0.3,1) ${animDelay + 80}ms`,
          }}
        />
      </svg>
    </div>
  );
}

export function ProvedoNegationSection(): React.ReactElement {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.2 });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="negation-heading"
      className="px-4"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
        paddingTop: 'clamp(5rem, 4rem + 4vw, 7rem)',
        paddingBottom: 'clamp(5rem, 4rem + 4vw, 7rem)',
      }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section header */}
        <ScrollFadeIn>
          <div className="mb-14 text-center md:mb-16">
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--provedo-accent)' }}
              aria-hidden="true"
            >
              Provedo
            </p>
            <h2
              id="negation-heading"
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 500,
                fontSize: 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
                color: 'var(--provedo-text-primary)',
                lineHeight: 1.3,
              }}
            >
              This is what Provedo is not.
            </h2>
          </div>
        </ScrollFadeIn>

        {/* 3-column negation grid */}
        <div ref={sectionRef} className="mb-14 grid gap-10 text-center md:grid-cols-3 md:gap-6">
          {NEGATION_COLUMNS.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.notLabel}
                className="flex flex-col items-center gap-4"
                style={{
                  opacity: inView || prefersReduced ? 1 : 0,
                  transform: inView || prefersReduced ? 'translateY(0)' : 'translateY(16px)',
                  transition: prefersReduced
                    ? 'none'
                    : `opacity 500ms ease ${col.animDelay}ms, transform 500ms cubic-bezier(0.16,1,0.3,1) ${col.animDelay}ms`,
                }}
              >
                {/* Icon with cross-out overlay */}
                <CrossOutIcon
                  icon={Icon}
                  iconLabel={col.iconLabel}
                  animDelay={col.animDelay + 200}
                  animate={inView}
                  prefersReduced={prefersReduced}
                />

                {/* Not label */}
                <p
                  style={{
                    fontFamily: 'var(--provedo-font-sans)',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: 'var(--provedo-text-primary)',
                    lineHeight: 1.3,
                  }}
                >
                  {col.notLabel}
                </p>

                {/* Sub label */}
                <p
                  style={{
                    fontFamily: 'var(--provedo-font-sans)',
                    fontWeight: 400,
                    fontSize: '13px',
                    color: 'var(--provedo-text-tertiary)',
                    lineHeight: 1.5,
                  }}
                >
                  {col.subLabel}
                </p>
              </div>
            );
          })}
        </div>

        {/* Affirmation closer */}
        <ScrollFadeIn delay={200}>
          <p
            className="mx-auto max-w-2xl text-center"
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 400,
              fontSize: '18px',
              color: 'var(--provedo-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            What Provedo does: holds your portfolio across every broker, answers what you ask,
            surfaces what you&apos;d miss. With sources for every observation.
          </p>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
