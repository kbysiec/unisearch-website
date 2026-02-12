import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      primary: 'bg-primary-100 text-primary-700 shadow-sm dark:bg-white/10 dark:text-primary-200',
      success: 'bg-green-100 text-green-700',
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
