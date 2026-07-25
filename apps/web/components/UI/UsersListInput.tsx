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
  const overlapOffsetBySize = { sm: 14, md: 24, lg: 28 } as const;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [optimisticUsers, setOptimisticUsers] = useState(users);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedUser, setAnimatedUser] = useState<TaskUser | null>(null);
  const [animationFrom, setAnimationFrom] = useState<{ top: number; left: number } | null>(null);
  const [animationTo, setAnimationTo] = useState<{ top: number; left: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const userItemsRefs = useRef<(HTMLDivElement | null)[]>(Array(availableUsers.length).fill(null));
  const animationTimeoutRef = useRef<number | null>(null);
  const optimisticPendingRef = useRef<{ base: string; expected: string } | null>(null);

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

  const usersIdentity = useMemo(() => users.map((user) => user._id).join('|'), [users]);

  useEffect(() => {
    const pending = optimisticPendingRef.current;

    if (!pending) {
      setOptimisticUsers(users);
      return;
    }

    if (usersIdentity === pending.base) {
      return;
    }

    setOptimisticUsers(users);

    if (usersIdentity === pending.expected || usersIdentity !== pending.base) {
      optimisticPendingRef.current = null;
    }
  }, [users, usersIdentity]);

  const selectedIds = useMemo(
    () => new Set(optimisticUsers.map((user) => user._id)),
    [optimisticUsers],
  );

  const filteredUsers = useMemo(
    () => availableUsers.filter((user) => matchesSearch(user, debouncedQuery)),
    [availableUsers, debouncedQuery],
  );

  const sortedFilteredUsers = useMemo(() => {
    const selected = filteredUsers.filter((user) => selectedIds.has(user._id));
    const notSelected = filteredUsers.filter((user) => !selectedIds.has(user._id));
    return [...selected, ...notSelected];
  }, [filteredUsers, selectedIds]);

  const visibleUsers = optimisticUsers.slice(0, Math.max(1, maxVisible));
  const hiddenUsers = optimisticUsers.slice(Math.max(1, maxVisible));

  const toggleUser = (user: TaskUser, sourceIndex?: number) => {
    if (!onChange || disabled) return;

    const exists = selectedIds.has(user._id);
    const nextUsers = exists
      ? optimisticUsers.filter((selectedUser) => selectedUser._id !== user._id)
      : [...optimisticUsers, user];
    const nextIdentity = nextUsers.map((nextUser) => nextUser._id).join('|');

    setOptimisticUsers(nextUsers);
    optimisticPendingRef.current = {
      base: usersIdentity,
      expected: nextIdentity,
    };

    if (exists) {
      try {
        onChange(nextUsers);
      } catch {
        setOptimisticUsers(users);
        optimisticPendingRef.current = null;
      }
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
      const addButtonRect = addButtonRef.current?.getBoundingClientRect();

      const sourceCenterX = sourceRect.left + sourceRect.width / 2;
      const sourceCenterY = sourceRect.top + sourceRect.height / 2;

      const fallbackTargetCenterX = stackRect.right - overlapOffsetBySize[size];
      const fallbackTargetCenterY = stackRect.top + stackRect.height / 2;
      const addButtonCenterX = addButtonRect ? addButtonRect.left + addButtonRect.width / 2 : null;
      const addButtonCenterY = addButtonRect ? addButtonRect.top + addButtonRect.height / 2 : null;

      const targetCenterX =
        addButtonCenterX !== null
          ? addButtonCenterX - overlapOffsetBySize[size]
          : fallbackTargetCenterX;
      const targetCenterY = addButtonCenterY ?? fallbackTargetCenterY;

      setAnimationFrom({
        top: sourceCenterY - rootRect.top,
        left: sourceCenterX - rootRect.left,
      });
      setAnimationTo({
        top: targetCenterY - rootRect.top,
        left: targetCenterX - rootRect.left,
      });
      setAnimatedUser(user);
      setIsAnimating(true);
    }

    try {
      onChange(nextUsers);
    } catch {
      setOptimisticUsers(users);
      optimisticPendingRef.current = null;
    }

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
          users={optimisticUsers}
          visibleUsers={visibleUsers}
          hiddenUsers={hiddenUsers}
          size={size}
          disabled={disabled}
          isInteractive={isInteractive}
          onUserClick={onUserClick}
          addButtonRef={addButtonRef}
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
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
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
