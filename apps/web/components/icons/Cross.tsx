"use client";

import { motion } from "motion/react";
import type { TargetAndTransition, Transition } from "motion";

interface CrossProps {
  className?: string;
  animate?: TargetAndTransition;
  transition?: Transition;
}

const Cross: React.FC<CrossProps> = (props) => {
  const { className = "", animate = {}, transition = {} } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100px"
      height="100px"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.path
        animate={animate}
        transition={transition}
        d="M16 8L8 16M8.00001 8L16 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Cross;
