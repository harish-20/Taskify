'use client';

import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

import { TaskStatusIcons, TaskTypeIcons } from '@/components/icons/task';
import Avatar from '@/components/UI/Avatar';
import Tooltip from '@/components/UI/Tooltip';
import { TASK_STATUS_LABEL } from '@/lib/constants/task';
import { Task } from '@/lib/types/task';

interface TaskListItemProps {
  task: Task;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  rightAction?: ReactNode;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  href,
  onClick,
  disabled = false,
  rightAction,
}) => {
  const TaskTypeIcon = TaskTypeIcons[task.type || 'task'] || TaskTypeIcons.task;
  const TaskStatusIcon = TaskStatusIcons[task.status || 'todo'] || TaskStatusIcons.todo;

  const content = (
    <>
      <TaskTypeIcon className="h-5 w-5 text-gray-500" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900 group-hover:text-blue-600">{task.title}</span>
          <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            <TaskStatusIcon className="text-gray-500" />
            {TASK_STATUS_LABEL[task.status]}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>{task.ticketId}</span>

          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(task.createdAt).toLocaleDateString()}
          </span>

          {task.createdBy?.name ? (
            <Tooltip content={task.createdBy.name} position="top">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <span className="text-gray-500">Created by</span>
                <Avatar
                  size="xs"
                  name={task.createdBy.name}
                  src={task.createdBy.avatarUrl}
                  bordered
                />
              </span>
            </Tooltip>
          ) : null}
        </div>
      </div>

      {task.assignees?.length ? (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((user) => (
            <Tooltip key={user._id} content={user.name} position="top">
              <span className="relative inline-flex hover:z-10">
                <Avatar src={user.avatarUrl} name={user.name} size="sm" />
              </span>
            </Tooltip>
          ))}

          {task.assignees.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <User className="h-4 w-4" />
          Unassigned
        </div>
      )}
    </>
  );

  const rowClassName = `group flex min-w-0 flex-1 items-center gap-4 ${onClick ? 'w-full text-left' : ''}`;

  return (
    <div className="group flex items-center gap-3 px-6 py-4 transition hover:bg-gray-50">
      {href ? (
        <Link href={href} className={rowClassName}>
          {content}
        </Link>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={`${rowClassName} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {content}
        </button>
      )}

      {rightAction}
    </div>
  );
};

export default TaskListItem;
