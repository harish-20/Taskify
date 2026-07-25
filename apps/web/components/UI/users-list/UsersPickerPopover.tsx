import clsx from 'clsx';
import { Check, Search } from 'lucide-react';


import Avatar from '../Avatar';

import { TaskUser } from './types';
import { getUserKey } from './utils';

import type { Dispatch, RefObject, SetStateAction } from 'react';

interface UsersPickerPopoverProps {
  isInteractive: boolean;
  open: boolean;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  searchRef: RefObject<HTMLInputElement | null>;
  loadingAvailableUsers: boolean;
  sortedFilteredUsers: TaskUser[];
  highlightedIndex: number;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  selectedIds: Set<string>;
  emptyStateMessage: string;
  toggleUser: (user: TaskUser, sourceIndex?: number) => void;
  userItemsRefs: RefObject<(HTMLDivElement | null)[]>;
}

const UsersPickerPopover: React.FC<UsersPickerPopoverProps> = ({
  isInteractive,
  open,
  query,
  setQuery,
  searchRef,
  loadingAvailableUsers,
  sortedFilteredUsers,
  highlightedIndex,
  setHighlightedIndex,
  selectedIds,
  emptyStateMessage,
  toggleUser,
  userItemsRefs,
}) => {
  if (!isInteractive || !open) return null;

  return (
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
                onClick={() => toggleUser(user, index)}
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
                  <div
                    ref={(el) => {
                      if (el !== null) {
                        userItemsRefs.current[index] = el;
                      }
                    }}
                  >
                    <Avatar
                      className="flex-shrink-0"
                      name={user.name}
                      src={user.avatarUrl}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    {user.email && <p className="truncate text-xs text-slate-500">{user.email}</p>}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UsersPickerPopover;
