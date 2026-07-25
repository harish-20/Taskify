'use client';

import clsx from 'clsx';
import { Check, Search, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import Avatar from './Avatar';
import Tooltip from './Tooltip';

import useClickOutside from '@/lib/hooks/useClickoutside';
import { Task } from '@/lib/types/task';

export type UsersListSize = 'sm' | 'md' | 'lg';
export type PresenceStatus = 'online' | 'offline' | 'away';
type TaskUser = Task['assignees'][number] & {
  presence?: PresenceStatus;
};

interface UsersListProps {
  users: TaskUser[];
  availableUsers?: TaskUser[];
  editable?: boolean;
  maxVisible?: number;
  size?: UsersListSize;
  disabled?: boolean;
  loadingAvailableUsers?: boolean;
  emptyStateMessage?: string;
  onChange?: (selectedUsers: TaskUser[]) => void;
  onUserClick?: (user: TaskUser) => void;
  className?: string;
  label?: string;
  labelClass?: string;
  id?: string;
}

const avatarSizeMap: Record<UsersListSize, 'xs' | 'md' | 'lg'> = {
  sm: 'xs',
  md: 'md',
  lg: 'lg',
};

const overlapMap: Record<UsersListSize, string> = {
  sm: '-ml-2.5',
  md: '-ml-4',
  lg: '-ml-5',
};

const presenceDotMap: Record<UsersListSize, string> = {
  sm: 'h-1.5 w-1.5 border',
  md: 'h-3 w-3 border-2',
  lg: 'h-3.5 w-3.5 border-2',
};

const presenceColorMap: Record<PresenceStatus, string> = {
  online: 'bg-green-500',
  away: 'bg-amber-400',
  offline: 'bg-slate-300',
};

const DEFAULT_MAX_VISIBLE = 4;
const SEARCH_DEBOUNCE_MS = 250;

function matchesSearch(user: TaskUser, query: string) {
  if (!query) return true;

  const normalized = query.trim().toLowerCase();
  return (
    user.name.toLowerCase().includes(normalized) ||
    (user.email || '').toLowerCase().includes(normalized)
  );
}

function getUserKey(user: TaskUser, index: number) {
  return user._id || user.email || user.name || `user-${index}`;
}

const UsersListInput: React.FC<UsersListProps> = ({
  users,
  availableUsers = [],
  editable = false,
  maxVisible = DEFAULT_MAX_VISIBLE,
  size = 'md',
  disabled = false,
  loadingAvailableUsers = false,
  emptyStateMessage = 'No users found',
  onChange,
  onUserClick,
  className,
  label,
  labelClass = '',
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isInteractive = editable && !disabled;

  useClickOutside(rootRef, () => setOpen(false), open && isInteractive);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();
    setHighlightedIndex(0);
  }, [open]);

  const selectedIds = useMemo(() => new Set(users.map((user) => user._id)), [users]);

  const filteredUsers = useMemo(
    () => availableUsers.filter((user) => matchesSearch(user, debouncedQuery)),
    [availableUsers, debouncedQuery],
  );

  const sortedFilteredUsers = useMemo(() => {
    const selected = filteredUsers.filter((user) => selectedIds.has(user._id));
    const notSelected = filteredUsers.filter((user) => !selectedIds.has(user._id));
    return [...selected, ...notSelected];
  }, [filteredUsers, selectedIds]);

  const visibleUsers = users.slice(0, Math.max(1, maxVisible));
  const hiddenUsers = users.slice(Math.max(1, maxVisible));

  const placeholder = editable ? 'Assign users' : 'Unassigned';

  const toggleUser = (user: TaskUser) => {
    if (!onChange || disabled) return;

    const exists = selectedIds.has(user._id);
    if (exists) {
      onChange(users.filter((selectedUser) => selectedUser._id !== user._id));
      return;
    }

    onChange([...users, user]);
  };

  const onRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    if (!open && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, Math.max(sortedFilteredUsers.length - 1, 0)),
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const user = sortedFilteredUsers[highlightedIndex];
      if (user) {
        toggleUser(user);
      }
    }
  };

  const renderAvatar = (user: TaskUser, index: number) => {
    const canClickUser = Boolean(onUserClick) && !disabled;
    const userKey = getUserKey(user, index);

    const avatarNode = (
      <div className={`relative z-[${users.length - index}] hover:z-50`}>
        <Avatar glassBorder name={user.name} src={user.avatarUrl} size={avatarSizeMap[size]} />
        {user.presence && (
          <span
            className={clsx(
              'absolute bottom-0 right-0 rounded-full border-white',
              presenceDotMap[size],
              presenceColorMap[user.presence],
            )}
          />
        )}
      </div>
    );

    return (
      <Tooltip key={userKey} content={user.name}>
        {canClickUser ? (
          <button
            type="button"
            onClick={() => onUserClick?.(user)}
            className={clsx(
              'relative rounded-full transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/20 hover:z-50',
              index > 0 && overlapMap[size],
            )}
            style={{ zIndex: users.length - index }}
          >
            {avatarNode}
          </button>
        ) : (
          <div
            className={clsx(
              'relative rounded-full transition-transform duration-150 hover:-translate-y-0.5 hover:z-50',
              index > 0 && overlapMap[size],
            )}
            style={{ zIndex: users.length - index }}
          >
            {avatarNode}
          </div>
        )}
      </Tooltip>
    );
  };

  return (
    <div ref={rootRef} className={clsx('relative flex flex-col gap-2 max-w-full', className)}>
      {label && (
        <label className={`text-sm text-dark-gray ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : -1}
        aria-haspopup={isInteractive ? 'listbox' : undefined}
        aria-expanded={isInteractive ? open : undefined}
        onKeyDown={onRootKeyDown}
        onClick={() => {
          if (!isInteractive) return;
          setOpen((prev) => !prev);
        }}
        className={clsx(
          'inline-flex max-w-full items-center gap-0.5 rounded-md',
          isInteractive && 'cursor-pointer',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
      >
        {users.length === 0 ? (
          <div className="inline-flex min-h-9 items-center rounded-md border border-dashed border-gray-300 px-2.5 text-sm text-dark-gray">
            {placeholder}
          </div>
        ) : (
          <>
            <div className={clsx('inline-flex items-center')}>
              {visibleUsers.map((user, index) => renderAvatar(user, index))}

              {hiddenUsers.length > 0 && (
                <Tooltip
                  key={`overflow-${hiddenUsers.length}`}
                  content={
                    <div className="flex max-w-[240px] flex-col gap-1 whitespace-normal">
                      {hiddenUsers.map((user, index) => (
                        <span key={getUserKey(user, index)} className="text-xs leading-tight">
                          {user.name}
                          {user.email ? ` (${user.email})` : ''}
                        </span>
                      ))}
                    </div>
                  }
                >
                  <div
                    className={clsx(
                      'relative flex items-center justify-center rounded-full border border-white bg-slate-200 font-medium text-slate-700',
                      visibleUsers.length > 0 && overlapMap[size],
                      size === 'sm' && 'h-6 w-6 text-[10px]',
                      size === 'md' && 'h-10 w-10 text-sm',
                      size === 'lg' && 'h-12 w-12 text-base',
                    )}
                    style={{ zIndex: 0 }}
                  >
                    +{hiddenUsers.length}
                  </div>
                </Tooltip>
              )}
            </div>
          </>
        )}

        {isInteractive && users.length > 0 && (
          <Tooltip content="Add users">
            <div
              className={clsx(
                'ml-0 flex items-center justify-center rounded-full border border-dashed border-gray-300 p-1 text-slate-500',
                users.length > 0 && overlapMap[size],
                size === 'sm' && 'h-6 w-6 text-[10px]',
                size === 'md' && 'h-10 w-10 text-sm',
                size === 'lg' && 'h-12 w-12 text-base',
              )}
            >
              <UserPlus size={size === 'sm' ? 10 : size === 'md' ? 16 : 20} />
            </div>
          </Tooltip>
        )}
      </div>

      {isInteractive && open && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-[min(24rem,90vw)] rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
          <div className="relative mb-3">
            <Search
              size={16}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email"
              className="h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none transition-colors focus:border-black"
            />
          </div>

          <div
            role="listbox"
            aria-multiselectable="true"
            className="max-h-64 overflow-auto rounded-md border border-gray-200"
          >
            {loadingAvailableUsers ? (
              <div className="p-3 text-sm text-slate-500">Loading users...</div>
            ) : sortedFilteredUsers.length === 0 ? (
              <div className="p-3 text-sm text-slate-500">{emptyStateMessage}</div>
            ) : (
              sortedFilteredUsers.map((user, index) => {
                const isSelected = selectedIds.has(user._id);
                const isHighlighted = highlightedIndex === index;
                const userKey = getUserKey(user, index);

                return (
                  <button
                    key={userKey}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => toggleUser(user)}
                    className={clsx(
                      'flex w-full items-center justify-between px-3 py-2 text-left transition-colors',
                      isHighlighted && 'bg-slate-100',
                      isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={clsx(
                          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors',
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-300 bg-white text-transparent',
                        )}
                        aria-hidden="true"
                      >
                        <Check size={10} />
                      </span>
                      <Avatar
                        className="flex-shrink-0"
                        name={user.name}
                        src={user.avatarUrl}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        {user.email && (
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersListInput;
