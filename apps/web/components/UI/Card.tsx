import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva('rounded-xl border transition-colors', {
  variants: {
    variant: {
      default: 'border-gray-200 bg-white shadow-sm',
      outlined: 'border-gray-200 bg-white',
      elevated: 'border-transparent bg-white shadow-md',
      ghost: 'border-transparent bg-transparent shadow-none',
      filled: 'border-gray-100 bg-gray-50',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    },
    radius: {
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
    },
    hover: {
      true: 'hover:shadow-md hover:border-gray-300',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    radius: 'lg',
    hover: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, radius, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={`${cardVariants({
        variant,
        padding,
        radius,
        hover,
      })} ${className}`}
      {...props}
    />
  ),
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col gap-1.5 pb-2 font-medium ${className}`} {...props} />
  ),
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`font-semibold leading-none tracking-tight ${className}`} {...props} />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={`p-5 ${className}`} {...props} />,
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex items-center gap-2 p-5 pt-0 ${className}`} {...props} />
  ),
);

CardFooter.displayName = 'CardFooter';
