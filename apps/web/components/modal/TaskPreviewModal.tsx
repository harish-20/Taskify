'use client';

import { Expand, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import BaseModal from './BaseModal';

import type { ModalProps } from '@/lib/types/components';

import TaskDetailsPanel from '@/app/(dashboard)/board/task/[id]/components/TaskDetailsPanel';
import TaskHeader from '@/app/(dashboard)/board/task/[id]/components/TaskHeader';
import TaskMainContent from '@/app/(dashboard)/board/task/[id]/components/TaskMainContent';
import { useTask } from '@/app/(dashboard)/board/task/[id]/hooks/useTask';
import { useTaskFields } from '@/app/(dashboard)/board/task/[id]/hooks/useTaskFields';
import Button from '@/components/UI/Button';
import Spinner from '@/components/UI/Spinner';
import useTaskBoardStore from '@/lib/store/board';
import { Task } from '@/lib/types/task';

interface TaskPreviewModalProps extends ModalProps {
  taskId: string;
  initialTask?: Task;
}

interface EditableTaskContentProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const EditableTaskContent: React.FC<EditableTaskContentProps> = ({ task, onTaskUpdate }) => {
  const taskFieldUpdater = useTaskFields(task, onTaskUpdate);

  return (
    <div className="flex min-h-0 flex-col gap-6">
      <TaskHeader task={task} taskFieldUpdater={taskFieldUpdater} />

      <div className="flex min-h-0 flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <TaskMainContent
            task={task}
            onTaskUpdate={onTaskUpdate}
            taskFieldUpdater={taskFieldUpdater}
          />
        </div>

        <div className="w-full shrink-0 lg:w-[340px]">
          <TaskDetailsPanel task={task} taskFieldUpdater={taskFieldUpdater} />
        </div>
      </div>
    </div>
  );
};

const TaskPreviewModal: React.FC<TaskPreviewModalProps> = ({ taskId, initialTask, onClose }) => {
  const router = useRouter();
  const { task: fetchedTask, loading, error } = useTask(taskId);
  const [task, setTask] = useState<Task | null>(initialTask ?? null);
  const setTasks = useTaskBoardStore((state) => state.setTasks);

  useEffect(() => {
    if (fetchedTask) {
      setTask(fetchedTask);
    }
  }, [fetchedTask]);

  const handleTaskUpdate = (nextTask: Task) => {
    setTask(nextTask);
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask._id === nextTask._id ? { ...currentTask, ...nextTask } : currentTask,
      ),
    );
  };

  const handleExpand = () => {
    onClose();
    router.push(`/board/task/${taskId}`);
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex w-[min(98vw,86rem)] max-h-[94vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="min-h-0 flex-1 overflow-y-hidden bg-white px-5 py-5 lg:px-6">
          {loading && !task && (
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          )}

          {!loading && error && !task && (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-gray-600">
                {error.message || 'Task could not be loaded. You can open the full details page.'}
              </p>
              <Button
                type="button"
                onClick={handleExpand}
                className="inline-flex items-center gap-2"
              >
                Open details
                <Expand size={16} />
              </Button>
            </div>
          )}

          {task && <EditableTaskContent task={task} onTaskUpdate={handleTaskUpdate} />}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 lg:px-6">
          <Button type="button" variant="secondary-dark" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={handleExpand} className="inline-flex items-center gap-2">
            Open full page
            <Expand size={16} />
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default TaskPreviewModal;
