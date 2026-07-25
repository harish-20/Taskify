'use client';

import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-amber-500',
];

function getInitials(name: string) {
  if (name.trim() === '') return '??';
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0]?.slice(0, 2).toUpperCase() || '??';
  }

  return ((words[0]?.[0] || '?') + (words[words.length - 1]?.[0] || '?')).toUpperCase();
}

function getColor(name: string) {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className }) => {
  const [imageError, setImageError] = useState(false);

  const initials = useMemo(() => getInitials(name), [name]);
  const bgColor = useMemo(() => getColor(name), [name]);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        className={clsx('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full font-semibold text-white select-none',
        sizeClasses[size],
        bgColor,
        className,
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
