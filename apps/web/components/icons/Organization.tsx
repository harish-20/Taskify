'use client';

import { motion } from 'motion/react';

import type { NavlinkComponent } from '@/lib/types/components';

interface OrganizationProps extends NavlinkComponent {}

const Organization: React.FC<OrganizationProps> = (props) => {
  const { className = '', isActive } = props;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 1 }}
      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <circle cx="12" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8.5V13M12 13L6 15.8M12 13L18 15.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};

export default Organization;
