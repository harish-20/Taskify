"use client";

import { motion, TargetAndTransition, Transition } from "motion/react";

interface DoneProps {
  className?: string;
  animate?: TargetAndTransition;
  transition?: Transition;
}

const Email: React.FC<DoneProps> = (props) => {
  const { className = "", animate = {}, transition = {} } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100px"
      height="100px"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <motion.path
        d="M44 24V9H24H4V24V39H24"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M31 36L36 40L44 30"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={animate}
        transition={transition}
      />
      <motion.path
        d="M4 9L24 24L44 9"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Email;
