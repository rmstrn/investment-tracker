import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ' +
  'rounded-md transition-[transform,box-shadow,background-color] duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary ' +
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
