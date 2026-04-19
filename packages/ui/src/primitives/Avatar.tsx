import { type HTMLAttributes, type ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  src?: string;
  alt?: string;
  fallback?: string;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', src, alt = '', fallback, imgProps, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-tertiary text-text-secondary font-medium',
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" {...imgProps} />
      ) : (
        <span aria-hidden="true">{(fallback || alt || '?').slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  ),
);
Avatar.displayName = 'Avatar';
