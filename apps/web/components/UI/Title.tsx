"use client";

import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

const titleStyles = cva("transition-all", {
  variants: {
    variant: {
      primary: "text-black",
      secondary: "text-gray-600",
      accent: "text-primary",
    },
    size: {
      sm: "text-lg",
      md: "text-2xl",
      lg: "text-4xl",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    align: "left",
    weight: "semibold",
  },
});

type TitleProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof titleStyles> & {
    animated?: boolean;
    order?: 1 | 2 | 3 | 4 | 5 | 6;
  };

const Title: React.FC<TitleProps> = ({
  variant,
  size,
  align,
  weight,
  animated = false,
  order = 1,
  children,
  className,
  ...props
}) => {
  const headingTag =
    `h${order}` as keyof React.ReactHTMLElement<HTMLHeadingElement>;

  const content = React.createElement(
    headingTag,
    {
      className: titleStyles({ variant, size, align, weight, className }),
      ...props,
    },
    children
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Title;
