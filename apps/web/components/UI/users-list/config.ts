import { PresenceStatus, UsersListSize } from './types';

export const DEFAULT_MAX_VISIBLE = 4;
export const SEARCH_DEBOUNCE_MS = 250;

export const avatarSizeMap: Record<UsersListSize, 'xs' | 'md' | 'lg'> = {
  sm: 'xs',
  md: 'md',
  lg: 'lg',
};

export const overlapMap: Record<UsersListSize, string> = {
  sm: '-ml-2.5',
  md: '-ml-4',
  lg: '-ml-5',
};

export const presenceDotMap: Record<UsersListSize, string> = {
  sm: 'h-1.5 w-1.5 border',
  md: 'h-3 w-3 border-2',
  lg: 'h-3.5 w-3.5 border-2',
};

export const presenceColorMap: Record<PresenceStatus, string> = {
  online: 'bg-green-500',
  away: 'bg-amber-400',
  offline: 'bg-slate-300',
};

export const avatarBadgeSizeMap: Record<UsersListSize, string> = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export const addIconSizeMap: Record<UsersListSize, number> = {
  sm: 10,
  md: 16,
  lg: 20,
};
