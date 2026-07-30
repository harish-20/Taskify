'use client';

import { useState } from 'react';

import TaskActivity from './sections/TaskActivity';
import TaskAttachments from './sections/TaskAttachments';
import TaskChecklist from './sections/TaskChecklist';
import TaskComments from './sections/TaskComments';
import TaskDependencies from './sections/TaskDependencies';
import TaskDescription from './sections/TaskDescription';
import TaskSubtasks from './sections/TaskSubtasks';
import TaskListItem from './subtasks/TaskListItem';

import { updateTask } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

interface TaskMainContentProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskMainContent: React.FC<TaskMainContentProps> = ({ task, onTaskUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);
  console.log(task.parentTask);

  const handleDescriptionUpdate = async (description: string | TrustedHTML) => {
    try {
      setIsSaving(true);
      const response = await updateTask(task._id, { description });
      if (response.success && response.data) {
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to update description:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <TaskDescription
        description={task.description || ''}
        onUpdate={handleDescriptionUpdate}
        isSaving={isSaving}
      />

      {/* Checklist */}
      <TaskChecklist task={task} onTaskUpdate={onTaskUpdate} />

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
      <TaskAttachments task={task} onTaskUpdate={onTaskUpdate} />

      {/* Dependencies */}
      <TaskDependencies task={task} onTaskUpdate={onTaskUpdate} />

      {/* Activity */}
      <TaskActivity task={task} />

      {/* Comments */}
      <TaskComments task={task} onTaskUpdate={onTaskUpdate} />
    </div>
  );
};

export default TaskMainContent;
