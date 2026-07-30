'use client';

import { GitBranch, Unlink } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import SubtaskSelectList from '../subtasks/SubtaskSelectList';
import TaskListItem from '../subtasks/TaskListItem';

import Badge from '@/components/UI/Badge';
import useClickOutside from '@/lib/hooks/useClickoutside';
import { removeSubtaskFromTask } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

interface TaskSubtasksProps {
  taskId: string;
  subTasks: Task[];
  onTaskUpdate: (task: Task) => void;
}

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ taskId, subTasks, onTaskUpdate }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isUnlinkingTaskId, setIsUnlinkingTaskId] = useState<string | null>(null);
  const subtasksCardRef = useRef<HTMLDivElement>(null);
  const subTaskIds = useMemo(() => subTasks.map((subTask) => subTask._id), [subTasks]);

  useClickOutside(subtasksCardRef, () => setIsSelectOpen(false), isSelectOpen);

  const handleUnlinkSubtask = async (subTaskId: string) => {
    try {
      setIsUnlinkingTaskId(subTaskId);
      const response = await removeSubtaskFromTask(taskId, subTaskId);
      if (response.success && response.data) {
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to unlink subtask:', error);
    } finally {
      setIsUnlinkingTaskId(null);
    }
  };

  return (
    <div ref={subtasksCardRef} className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Subtasks</h3>

            <Badge variant="secondary">{subTasks.length}</Badge>
          </div>

          <p className="mt-1 text-sm text-gray-500">Break this task into smaller deliverables.</p>
        </div>
      </div>

      {subTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <GitBranch className="mb-4 h-12 w-12 text-gray-300" />

          <p className="font-medium text-gray-700">No subtasks yet</p>

          <p className="mt-1 text-sm text-gray-500">
            Split this task into smaller pieces to track progress.
          </p>

          <div className="mt-6 w-full px-6">
            <button
              type="button"
              onClick={() => setIsSelectOpen(true)}
              className="w-full rounded-lg border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
            >
              Add Subtask
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {subTasks.map((subtask) => {
            return (
              <TaskListItem
                key={subtask._id}
                task={subtask}
                href={`/board/task/${subtask._id}`}
                rightAction={
                  <button
                    type="button"
                    aria-label="Unlink subtask"
                    title="Unlink subtask"
                    disabled={isUnlinkingTaskId === subtask._id}
                    onClick={() => handleUnlinkSubtask(subtask._id)}
                    className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Unlink className="h-4 w-4" />
                  </button>
                }
              />
            );
          })}
        </div>
      )}

      {!isSelectOpen && subTasks.length > 0 && (
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={() => setIsSelectOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Add Subtask
          </button>
        </div>
      )}

      <SubtaskSelectList
        open={isSelectOpen}
        parentTaskId={taskId}
        existingSubTaskIds={subTaskIds}
        onSubtaskAdded={(updatedTask) => {
          onTaskUpdate(updatedTask);
          setIsSelectOpen(false);
        }}
      />
    </div>
  );
};

export default TaskSubtasks;
