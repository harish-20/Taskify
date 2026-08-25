'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'motion/react';
import React from 'react';

const subTitleStyles = cva('transition-all', {
  variants: {
    variant: {
      primary: 'text-gray-600',
      secondary: 'text-gray-500',
      accent: 'text-primary',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    align: 'left',
    weight: 'normal',
  },
});

type SubTitleProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof subTitleStyles> & {
    animated?: boolean;
  };

const SubTitle: React.FC<SubTitleProps> = ({
  variant,
  size,
  align,
  weight,
  animated = false,
  children,
  className,
  ...props
}) => {
  const classes = subTitleStyles({
    variant,
    size,
    align,
    weight,
    className,
  });

  if (!animated) {
    return (
      <p className={classes} {...props}>
        {children}
      </p>
    );
  }

  return (
    <motion.p
      className={classes}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...(props as HTMLMotionProps<'p'>)}
    >
      {children}
    </motion.p>
  );
};

export default SubTitle;
