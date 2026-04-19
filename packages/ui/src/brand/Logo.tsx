import { brand } from '@investment-tracker/design-tokens/brand';
import type { SVGProps } from 'react';
import { cn } from '../lib/cn';

export type LogoVariant = 'full' | 'mark' | 'wordmark';

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  variant?: LogoVariant;
  /**
   * Size in px — applied to the mark's shorter dimension. Wordmark scales
   * proportionally. Default 28.
   */
  size?: number;
}

/**
 * Portfolio brand mark. Two overlapping diamonds suggest a portfolio of
 * holdings — clean, geometric, scales well at 16px favicon size.
 *
 * The wordmark reads from brand.productName so renaming the product is a
 * single-file change in tokens/brand.json.
 */
export function Logo({ variant = 'full', size = 28, className, ...props }: LogoProps) {
  const name = brand.productName;

  if (variant === 'mark') {
    return (
      <svg
        role="img"
        aria-label={`${name} logo mark`}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('shrink-0', className)}
        {...props}
      >
        <LogoMarkPath />
      </svg>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        aria-label={name}
        className={cn(
          'font-sans text-[1.125rem] font-semibold tracking-tight text-text-primary',
          className,
        )}
        style={{ fontSize: `${size * 0.65}px` }}
      >
        {name}
      </span>
    );
  }

  // full: mark + wordmark
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        role="img"
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        {...props}
      >
        <LogoMarkPath />
      </svg>
      <span
        className="font-sans font-semibold tracking-tight text-text-primary"
        style={{ fontSize: `${size * 0.65}px` }}
      >
        {name}
      </span>
    </span>
  );
}

function LogoMarkPath() {
  return (
    <>
      <defs>
        <linearGradient
          id="portfolio-mark-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-brand-500)" />
          <stop offset="100%" stopColor="var(--color-brand-700)" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#portfolio-mark-grad)" />
      <path
        d="M11 10.5 L11 21.5 M11 10.5 L17 10.5 C19 10.5 20.5 12 20.5 14 C20.5 16 19 17.5 17 17.5 L11 17.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  );
}
