"use client";

import { motion } from "motion/react";
import { cva, VariantProps } from "class-variance-authority";

interface SpinnerProps extends VariantProps<typeof spinnerStyles> {
  className?: string;
}

const spinnerStyles = cva("border-current border-t-transparent rounded-full", {
  variants: {
    size: {
      sm: "h-5 w-5 border-2",
      md: "h-10 w-10 border-3",
      lg: "h-16 w-16 border-6",
    },
  },
});

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size = "sm", className } = props;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
      className={spinnerStyles({ size, className })}
      role="status"
      aria-label="loading"
    />
  );
};

export default Spinner;
