import { Task } from '@/lib/types/task';

export type UsersListSize = 'sm' | 'md' | 'lg';
export type PresenceStatus = 'online' | 'offline' | 'away';

export type TaskUser = Task['assignees'][number] & {
  presence?: PresenceStatus;
};

export interface UsersListProps {
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
