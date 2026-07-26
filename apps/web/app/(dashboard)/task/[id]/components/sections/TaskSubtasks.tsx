'use client';

import { ArrowRight, Calendar, ChevronRight, GitBranch, User } from 'lucide-react';
import Link from 'next/link';

import { TaskStatusIcons, TaskTypeIcons } from '@/components/icons/task';
import Avatar from '@/components/UI/Avatar';
import Badge from '@/components/UI/Badge';
import { TASK_STATUS_LABEL } from '@/lib/constants/task';
import { Task } from '@/lib/types/task';

interface TaskSubtasksProps {
  subTasks: Task[];
}

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ subTasks }) => {
  const TaskTypeIcon = TaskTypeIcons[subTasks[0]?.type || 'task'] || TaskTypeIcons.task;
  const TaskStatusIcon = TaskStatusIcons[subTasks[0]?.status || 'todo'] || TaskStatusIcons.todo;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Subtasks</h3>

            <Badge variant="secondary">{subTasks.length}</Badge>
          </div>

          <p className="mt-1 text-sm text-gray-500">Break this task into smaller deliverables.</p>
        </div>

        <button className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50">
          Add Subtask
        </button>
      </div>

      {subTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <GitBranch className="mb-4 h-12 w-12 text-gray-300" />

          <p className="font-medium text-gray-700">No subtasks yet</p>

          <p className="mt-1 text-sm text-gray-500">
            Split this task into smaller pieces to track progress.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {subTasks.map((subtask) => (
            <Link
              key={subtask._id}
              href={`/task/${subtask._id}`}
              className="group flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50"
            >
              <TaskTypeIcon className="h-5 w-5 text-gray-500" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 group-hover:text-blue-600">
                    {subtask.title}
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    <TaskStatusIcon className=" text-gray-500" />
                    {TASK_STATUS_LABEL[subtask.status]}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-5 text-sm text-gray-500">
                  <span>{subtask.ticketId}</span>

                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(subtask.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {subtask.assignees?.length ? (
                <div className="flex -space-x-2">
                  {subtask.assignees.slice(0, 3).map((user) => (
                    <Avatar key={user._id} src={user.avatarUrl} name={user.name} size="sm" />
                  ))}

                  {subtask.assignees.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium">
                      +{subtask.assignees.length - 3}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <User className="h-4 w-4" />
                  Unassigned
                </div>
              )}

              <ChevronRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      )}

      {subTasks.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 text-sm text-gray-500">
          <span>{subTasks.length} subtasks</span>

          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskSubtasks;
