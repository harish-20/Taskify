'use client';

import { motion } from 'motion/react';
import type { TargetAndTransition, Transition } from 'motion';

interface PlusProps {
  className?: string;
  animate?: TargetAndTransition;
  transition?: Transition;
}

const Plus: React.FC<PlusProps> = (props) => {
  const { className = '', animate = {}, transition = {} } = props;

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
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Plus;
