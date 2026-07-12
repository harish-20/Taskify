'use client';
import { motion } from 'motion/react';
import type { NavlinkComponent } from '@/lib/types/components';

interface CheckboxProps extends NavlinkComponent {}

const Checkbox: React.FC<CheckboxProps> = ({ className = '', isActive }) => {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Checkmark */}
      <motion.path
        d="M7.93,8.24,5.26,5.58,4,6.85l3.94,3.94L16,2.7,14.74,1.43,13,3.17,11.2,5Z"
        fill="currentColor"
        animate={
          isActive
            ? {
                scale: [1, 1.15, 1],
              }
            : {}
        }
        transition={{
          duration: 0.45,
        }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Box outline */}
      <motion.path
        d="M11.2,12.24H2.8V3.8H11L12.75,2H1V14H13V7.13l-1.8,1.8Z"
        fill="currentColor"
        animate={
          isActive
            ? {
                opacity: [1, 0.6, 1],
              }
            : {}
        }
        transition={{
          duration: 0.45,
          delay: 0.05,
        }}
      />
    </motion.svg>
  );
};

export default Checkbox;
