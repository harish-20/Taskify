'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import React from 'react';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white',
        secondary: 'bg-gray-100 text-gray-700',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-sky-100 text-sky-700',
        outline: 'border border-gray-300 bg-white text-gray-700',
      },

      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-sm',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, size, children, ...props }) => {
  return (
    <div className={clsx(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
};

export default Badge;
