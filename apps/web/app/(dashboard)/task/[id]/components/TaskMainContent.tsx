'use client';

import { useState } from 'react';
import { Task } from '@/lib/types/task';
import { updateTask } from '@/lib/services/api/task';
import TaskDescription from './sections/TaskDescription';
import TaskChecklist from './sections/TaskChecklist';
import TaskSubtasks from './sections/TaskSubtasks';
import TaskAttachments from './sections/TaskAttachments';
import TaskDependencies from './sections/TaskDependencies';
import TaskActivity from './sections/TaskActivity';
import TaskComments from './sections/TaskComments';

interface TaskMainContentProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskMainContent: React.FC<TaskMainContentProps> = ({ task, onTaskUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleDescriptionUpdate = async (description: string) => {
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

      {/* Subtasks */}
      <TaskSubtasks task={task} onTaskUpdate={onTaskUpdate} />

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
