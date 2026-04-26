'use client';

// ProvedoButton — inline-styled CTA for Provedo landing.
// Handles hover/active/focus states with proper biome-compliant block functions.
// All color values from Provedo CSS variables (Direction A v1.4).
//
// Two variants:
//   primary  — teal fill (#0D9488)
//   outline  — bordered, teal accent on hover

import type { AnchorHTMLAttributes } from 'react';

const FOCUS_RING = '2px solid var(--provedo-accent)';

interface ProvedoButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
};

export function ProvedoButton({
  variant = 'primary',
  size = 'lg',
  className = '',
  style,
  children,
  ...props
}: ProvedoButtonProps) {
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.lg;

  const baseStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          backgroundColor: 'var(--provedo-accent)',
          color: '#FFFFFF',
          minWidth: '44px',
          minHeight: '44px',
        }
      : {
          borderColor: 'var(--provedo-border-default)',
          color: 'var(--provedo-text-primary)',
          backgroundColor: 'transparent',
          minWidth: '44px',
          minHeight: '44px',
        };

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    if (variant === 'primary') {
      el.style.backgroundColor = 'var(--provedo-accent-hover)';
    } else {
      el.style.borderColor = 'var(--provedo-accent)';
      el.style.color = 'var(--provedo-accent)';
    }
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    if (variant === 'primary') {
      el.style.backgroundColor = 'var(--provedo-accent)';
    } else {
      el.style.borderColor = 'var(--provedo-border-default)';
      el.style.color = 'var(--provedo-text-primary)';
    }
  }

  function handleMouseDown(e: React.MouseEvent<HTMLAnchorElement>) {
    if (variant === 'primary') {
      e.currentTarget.style.backgroundColor = 'var(--provedo-accent-active)';
    }
  }

  function handleMouseUp(e: React.MouseEvent<HTMLAnchorElement>) {
    if (variant === 'primary') {
      e.currentTarget.style.backgroundColor = 'var(--provedo-accent-hover)';
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLAnchorElement>) {
    e.currentTarget.style.outline = FOCUS_RING;
    e.currentTarget.style.outlineOffset = '2px';
  }

  function handleBlur(e: React.FocusEvent<HTMLAnchorElement>) {
    e.currentTarget.style.outline = '';
    e.currentTarget.style.outlineOffset = '';
  }

  const borderClass = variant === 'outline' ? 'border' : '';

  return (
    <a
      className={`inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150 focus-visible:outline-none ${sizeClass} ${borderClass} ${className}`}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </a>
  );
}

// NavLink variant — text link with color transition
interface ProvedoNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  colorFrom?: string;
  colorTo?: string;
}

export function ProvedoNavLink({
  colorFrom = 'var(--provedo-text-secondary)',
  colorTo = 'var(--provedo-text-primary)',
  style,
  children,
  ...props
}: ProvedoNavLinkProps) {
  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.color = colorTo;
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.color = colorFrom;
  }

  function handleFocus(e: React.FocusEvent<HTMLAnchorElement>) {
    e.currentTarget.style.outline = FOCUS_RING;
    e.currentTarget.style.outlineOffset = '2px';
    e.currentTarget.style.color = colorTo;
  }

  function handleBlur(e: React.FocusEvent<HTMLAnchorElement>) {
    e.currentTarget.style.outline = '';
    e.currentTarget.style.color = colorFrom;
  }

  return (
    <a
      className="transition-colors duration-150 focus-visible:outline-none"
      style={{ color: colorFrom, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </a>
  );
}
