'use client';

import Image from 'next/image';

import logo from '@/public/taskify-logo-full.svg';

const FullLogo = () => {
  return <Image className="h-12 w-auto" priority src={logo} alt="logo" height={50} width={120} />;
};
export default FullLogo;
