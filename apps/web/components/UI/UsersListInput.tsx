'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DEFAULT_MAX_VISIBLE, SEARCH_DEBOUNCE_MS } from './users-list/config';
import { TaskUser, UsersListProps } from './users-list/types';
import UsersAvatarGroup from './users-list/UsersAvatarGroup';
import UsersPickerPopover from './users-list/UsersPickerPopover';
import { matchesSearch } from './users-list/utils';

import useClickOutside from '@/lib/hooks/useClickoutside';
import { getCurveCoordinates } from '@/lib/utils/getCurveCoordinates';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedUser, setAnimatedUser] = useState<TaskUser | null>(null);
  const [animationFrom, setAnimationFrom] = useState<{ top: number; right: number } | null>(null);
  const [animationTo, setAnimationTo] = useState<{ top: number; right: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const userItemsRefs = useRef<(HTMLDivElement | null)[]>(Array(availableUsers.length).fill(null));
  const animationTimeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

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

  const toggleUser = (user: TaskUser, sourceIndex?: number) => {
    if (!onChange || disabled) return;

    const exists = selectedIds.has(user._id);
    if (exists) {
      onChange(users.filter((selectedUser) => selectedUser._id !== user._id));
      return;
    }

    const sourceElement =
      typeof sourceIndex === 'number' && sourceIndex >= 0
        ? userItemsRefs.current[sourceIndex]
        : null;
    const rootElement = rootRef.current;
    const stackElement = stackRef.current;

    if (sourceElement && rootElement && stackElement) {
      const rootRect = rootElement.getBoundingClientRect();
      const sourceRect = sourceElement.getBoundingClientRect();
      const stackRect = stackElement.getBoundingClientRect();

      setAnimationFrom({
        top: sourceRect.top - rootRect.top,
        right: rootRect.right - sourceRect.right,
      });
      setAnimationTo({
        top: stackRect.top - rootRect.top,
        right: stackRect.right - (rootRect.right - 40),
      });
      setAnimatedUser(user);
      setIsAnimating(true);
    }

    onChange([...users, user]);

    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      setAnimatedUser(null);
      setAnimationFrom(null);
      setAnimationTo(null);
      animationTimeoutRef.current = null;
    }, 650);
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
        toggleUser(user, highlightedIndex);
      }
    }
  };

  return (
    <div ref={rootRef} className={clsx('relative flex flex-col gap-2 max-w-full', className)}>
      {label && (
        <label className={`text-sm text-dark-gray ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        ref={stackRef}
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
        <UsersAvatarGroup
          users={users}
          visibleUsers={visibleUsers}
          hiddenUsers={hiddenUsers}
          size={size}
          disabled={disabled}
          isInteractive={isInteractive}
          onUserClick={onUserClick}
        />
      </div>

      <UsersPickerPopover
        userItemsRefs={userItemsRefs}
        isInteractive={isInteractive}
        open={open}
        query={query}
        setQuery={setQuery}
        searchRef={searchRef}
        loadingAvailableUsers={loadingAvailableUsers}
        sortedFilteredUsers={sortedFilteredUsers}
        highlightedIndex={highlightedIndex}
        setHighlightedIndex={setHighlightedIndex}
        selectedIds={selectedIds}
        emptyStateMessage={emptyStateMessage}
        toggleUser={toggleUser}
      />

      {isAnimating && animatedUser && animationFrom && animationTo && (
        <motion.div
          className="absolute z-50 pointer-events-none"
          animate={{
            ...getCurveCoordinates(animationFrom, animationTo, 3),
            ...{
              scale: [1, 1.2, 1],
            },
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          <UsersAvatarGroup
            users={[animatedUser]}
            visibleUsers={[animatedUser]}
            hiddenUsers={[]}
            size={size}
            disabled={disabled}
            isInteractive={false}
          />
        </motion.div>
      )}
    </div>
  );
};

export default UsersListInput;
