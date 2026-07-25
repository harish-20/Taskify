'use client';

import clsx from 'clsx';
import React, { useMemo, useState } from 'react';

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;

  glassBorder?: boolean;
  bordered?: boolean;

  status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const statusSize = {
  xs: 'h-2 w-2',
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4 w-4',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  away: 'bg-amber-400',
  busy: 'bg-red-500',
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

function getInitials(name?: string | null) {
  if (!name?.trim()) return '??';

  const words = name?.trim().split(/\s+/);

  if (words && words[0] && words.length === 1 && words[0].length > 0) {
    return words?.[0].slice(0, 2).toUpperCase();
  }

  return `${words?.[0]?.[0] ?? ''}${words?.[words.length - 1]?.[0] ?? ''}`.toUpperCase();
}

function getColor(name?: string | null) {
  const hash = [...(name ?? '')].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
  glassBorder = false,
  bordered = false,
  status,
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = useMemo(() => getInitials(name), [name]);
  const bgColor = useMemo(() => getColor(name), [name]);

  const avatar =
    src && !imageError ? (
      <img
        src={src}
        alt={name ?? 'User avatar'}
        loading="lazy"
        draggable={false}
        onError={() => setImageError(true)}
        className={clsx('rounded-full object-cover', sizeClasses[size], className)}
      />
    ) : (
      <div
        aria-label={name ?? 'User avatar'}
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

  return (
    <div className="relative inline-flex">
      {glassBorder || bordered ? (
        <div
          className={clsx(
            'rounded-full p-[2px]',
            glassBorder && 'border border-white/30 bg-white/20 backdrop-blur-md shadow-sm',
            bordered && !glassBorder && 'border border-gray-200',
          )}
        >
          {avatar}
        </div>
      ) : (
        avatar
      )}

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusSize[size],
            statusColors[status],
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
