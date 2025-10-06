"use client";

import { PropsWithChildren } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { cva, VariantProps } from "class-variance-authority";

import Spinner from "./Spinner";

import Done from "../icons/Done";

const buttonStyles = cva(
  "relative overflow-clip inline-flex items-center justify-center font-medium rounded-md transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-neutral-700 focus:bg-neutral-700",
        secondary:
          "bg-primary-light text-primary hover:bg-primary-light-hover focus:bg-primary-light-hover",
        "secondary-dark":
          "bg-gray-200 text-gray-600 hover:bg-gray-300 focus:bg-gray-300",
        text: "bg-transparent text-primary hover:bg-primary-light focus:bg-primary-light",
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

type ButtonProps = HTMLMotionProps<"button"> &
  PropsWithChildren &
  VariantProps<typeof buttonStyles> & {
    loading?: boolean;
    done?: boolean;
  };

const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant,
    size,
    className,
    loading = false,
    done = false,
    disabled = false,
    children,
    ...otherProps
  } = props;

  return (
    <motion.button
      className={buttonStyles({ variant, size, loading, disabled, className })}
      disabled={loading || disabled}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      {...otherProps}
    >
      <AnimatePresence>
        {done && (
          <div className="absolute flex items-center justify-center w-full h-full bg-black">
            <Done
              className="h-5 w-5"
              animate={{ pathLength: [0, 1] }}
              transition={{ delay: 0.2 }}
            />
          </div>
        )}

        {loading && (
          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/50 flex items-center justify-center"
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
    </motion.button>
  );
};

export default Button;
