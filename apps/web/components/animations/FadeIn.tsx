"use client";

import { HTMLMotionProps, motion } from "motion/react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  startDelay?: number;
  duration?: number;
}

const FadeIn: React.FC<FadeInProps> = (props) => {
  const { startDelay = 0, duration = 0.6, children, ...otherProps } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: startDelay,
        duration,
        ease: "easeOut",
      }}
      {...otherProps}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
