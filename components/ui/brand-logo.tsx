import * as React from 'react';
import { cn } from '@/lib/cn';

interface BrandLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export function BrandLogo({ className, ...props }: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label="UniSearch logo"
      className={cn(
        'inline-block h-10 w-10 bg-current text-primary-600 dark:text-primary-300',
        className
      )}
      style={{
        WebkitMaskImage: 'url(/assets/icon.svg)',
        maskImage: 'url(/assets/icon.svg)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
      {...props}
    />
  );
}
