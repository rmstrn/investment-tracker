import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

// Focus ring: designed «halo-gap» pattern — 2px gap of bg + 4px accent ring.
// WCAG 2.4.7 + 2.4.11 AAA-grade visibility, 3:1 against adjacent. Matches
// the showcase :focus-visible idiom so Button focus reads consistently
// inside `/design-system` and outside it. Phase β.1 will expand this to
// other variants; Round-2 a11y Section 5 promotion (Apr 2026).
const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ' +
  'rounded-md transition-[transform,box-shadow,background-color] duration-fast ease-out ' +
  'focus-visible:outline-none ' +
  'focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)] ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    // v1.1 ink-CTA: 14px corner-radius + extruded shadow + press-down transform.
    // Override base rounded-md via direct class; shadow uses --shadow-primary-extrude
    // which carries the multi-axis cream-tint in light + restrained no-glow in dark.
    'bg-interactive-primary text-text-onBrand hover:bg-interactive-primaryHover active:bg-interactive-primaryActive ' +
    '!rounded-[14px] shadow-[var(--shadow-primary-extrude)] ' +
    'hover:-translate-y-px hover:shadow-[var(--shadow-lift)] ' +
    'active:translate-y-0 active:shadow-[var(--shadow-soft)]',
  secondary:
    'bg-interactive-secondary text-text-primary hover:bg-interactive-secondaryHover active:bg-interactive-secondaryActive',
  ghost:
    'bg-transparent text-text-primary hover:bg-interactive-ghostHover active:bg-interactive-ghostActive',
  outline:
    'bg-transparent text-text-primary border border-border-default hover:bg-interactive-ghostHover active:bg-interactive-ghostActive',
  destructive: 'bg-state-negative-default text-text-onBrand hover:opacity-90 active:opacity-80',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
