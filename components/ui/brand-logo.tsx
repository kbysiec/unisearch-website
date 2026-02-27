import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function BrandLogo({ className, ...props }: BrandLogoProps) {
  return (
    <div
      role="img"
      aria-label="UniSearch logo"
      className={cn('inline-block h-10 w-10 relative', className)}
      {...props}
    >
      <Image
        src="/assets/icon.svg"
        alt="UniSearch logo"
        fill
        className="object-contain dark:hidden"
        priority
      />
      <Image
        src="/assets/icon-night.svg"
        alt="UniSearch logo"
        fill
        className="object-contain hidden dark:block"
        priority
      />
    </div>
  );
}
