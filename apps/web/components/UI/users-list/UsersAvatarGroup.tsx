import clsx from 'clsx';
import { UserPlus } from 'lucide-react';

import Avatar from '../Avatar';
import Tooltip from '../Tooltip';

import {
  addIconSizeMap,
  avatarBadgeSizeMap,
  avatarSizeMap,
  overlapMap,
  presenceColorMap,
  presenceDotMap,
} from './config';
import { TaskUser, UsersListSize } from './types';
import { getUserKey } from './utils';

interface UsersAvatarGroupProps {
  users: TaskUser[];
  visibleUsers: TaskUser[];
  hiddenUsers: TaskUser[];
  size: UsersListSize;
  disabled: boolean;
  isInteractive: boolean;
  onUserClick?: (user: TaskUser) => void;
}

const UsersAvatarGroup: React.FC<UsersAvatarGroupProps> = ({
  users,
  visibleUsers,
  hiddenUsers,
  size,
  disabled,
  isInteractive,
  onUserClick,
}) => {
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
                avatarBadgeSizeMap[size],
              )}
              style={{ zIndex: 0 }}
            >
              +{hiddenUsers.length}
            </div>
          </Tooltip>
        )}
      </div>

      {isInteractive && (
        <Tooltip content="Add users">
          <div
            className={clsx(
              'ml-0 flex items-center justify-center rounded-full border border-dashed border-gray-300 p-1 text-slate-500',
              users.length > 0 && overlapMap[size],
              avatarBadgeSizeMap[size],
            )}
          >
            <UserPlus size={addIconSizeMap[size]} />
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default UsersAvatarGroup;
