'use client';

import { useCallback } from 'react';

import { TaskFieldUpdater } from '../hooks/useTaskFields';

import TaskActivity from './sections/TaskActivity';
import TaskAttachments from './sections/TaskAttachments';
import TaskChecklist from './sections/TaskChecklist';
import TaskComments from './sections/TaskComments';
import TaskDependencies from './sections/TaskDependencies';
import TaskDescription from './sections/TaskDescription';
import TaskSubtasks from './sections/TaskSubtasks';
import TaskListItem from './subtasks/TaskListItem';

import { Task } from '@/lib/types/task';

interface TaskMainContentProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  taskFieldUpdater: TaskFieldUpdater;
}

const TaskMainContent: React.FC<TaskMainContentProps> = ({
  task,
  onTaskUpdate,
  taskFieldUpdater,
}) => {
  const handleDescriptionUpdate = useCallback(
    async (description: string | TrustedHTML) => {
      await taskFieldUpdater.updateField('description', description);
    },
    [taskFieldUpdater],
  );

  return (
    <div className="space-y-6">
      {/* Description */}
      <TaskDescription
        description={task.description || ''}
        onUpdate={handleDescriptionUpdate}
        isSaving={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.description}
      />

      {/* Checklist */}
      <TaskChecklist task={task} taskFieldUpdater={taskFieldUpdater} />

      {/* Parent Task */}
      {task.parentTask && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Parent Task</h3>
          <TaskListItem href={`/board/task/${task.parentTask._id}`} task={task.parentTask} />
        </div>
      )}

      {/* Subtasks */}
      {!task.parentTask && (
        <TaskSubtasks taskId={task._id} subTasks={task.subTasks} onTaskUpdate={onTaskUpdate} />
      )}

      {/* Attachments */}
      <TaskAttachments task={task} />

      {/* Dependencies */}
      <TaskDependencies task={task} />

      {/* Activity */}
      <TaskActivity task={task} />

      {/* Comments */}
      <TaskComments task={task} />
    </div>
  );
};

export default TaskMainContent;
