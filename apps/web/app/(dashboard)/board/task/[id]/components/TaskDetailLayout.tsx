'use client';

import { useTaskFields } from '../hooks/useTaskFields';

import TaskDetailsPanel from './TaskDetailsPanel';
import TaskHeader from './TaskHeader';
import TaskMainContent from './TaskMainContent';

import { Task } from '@/lib/types/task';

interface TaskDetailLayoutProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskDetailLayout: React.FC<TaskDetailLayoutProps> = ({ task, onTaskUpdate }) => {
  const taskFieldUpdater = useTaskFields(task, onTaskUpdate);

  return (
    <div className="flex-1 flex flex-col gap-6 pb-8">
      {/* Header */}
      <TaskHeader task={task} taskFieldUpdater={taskFieldUpdater} />

      {/* Main Content + Sidebar */}
      <div className="flex gap-6 flex-1">
        {/* Main Content Area (70-75%) */}
        <div className="flex-1 min-w-0">
          <TaskMainContent
            task={task}
            onTaskUpdate={onTaskUpdate}
            taskFieldUpdater={taskFieldUpdater}
          />
        </div>

        {/* Right Sidebar (25-30%) */}
        <div className="w-3/12 flex-shrink-0">
          <TaskDetailsPanel task={task} taskFieldUpdater={taskFieldUpdater} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailLayout;
