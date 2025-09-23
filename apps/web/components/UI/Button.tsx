"use client";

import { cva, VariantProps } from "class-variance-authority";
import Spinner from "./Spinner";
import { AnimatePresence, motion } from "motion/react";

const buttonStyles = cva(
  "relative overflow-clip inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-neutral-700 focus:ring-gray-600",
        secondary:
          "bg-primary-light text-primary hover:bg-primary-light-hover focus:ring-primary",
        "secondary-dark":
          "bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-600",
        text: "bg-transparent text-primary hover:bg-primary-light focus:ring-primary",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
      loading: {
        true: "pointer-events-none",
        false: "",
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      loading: false,
      disabled: false,
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    loading?: boolean;
  };

const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant,
    size,
    className,
    loading = false,
    disabled = false,
    children,
    ...otherProps
  } = props;

  return (
    <button
      className={buttonStyles({ variant, size, loading, disabled, className })}
      disabled={loading || disabled}
      {...otherProps}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/30 flex items-center justify-center"
          >
            <motion.div
              animate={{ translateY: [100, 0] }}
              exit={{ translateY: -100 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <Spinner />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <span>{children}</span>
    </button>
  );
};

export default Button;
