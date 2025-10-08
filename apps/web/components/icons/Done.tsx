"use client";

import { motion, TargetAndTransition, Transition } from "motion/react";

interface DoneProps {
  className?: string;
  animate?: TargetAndTransition;
  transition?: Transition;
}

const Done: React.FC<DoneProps> = (props) => {
  const { className = "", animate = {}, transition = {} } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      className={className}
      width="100"
      height="100"
    >
      <motion.circle
        cx="200"
        cy="200"
        r="180"
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
      />

      <motion.path
        d="M120 200 L180 260 L280 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={animate}
        transition={transition}
      />
    </svg>
  );
};

export default Done;
