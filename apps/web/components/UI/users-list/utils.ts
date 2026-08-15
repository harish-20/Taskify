import { TaskUser } from './types';

export function matchesSearch(user: TaskUser, query: string) {
  if (!query) return true;

  const normalized = query.trim().toLowerCase();
  return (
    user.name.toLowerCase().includes(normalized) ||
    (user.email || '').toLowerCase().includes(normalized)
  );
}

export function getUserKey(user: TaskUser, index: number) {
  return user._id || user.email || user.name || `user-${index}`;
}
