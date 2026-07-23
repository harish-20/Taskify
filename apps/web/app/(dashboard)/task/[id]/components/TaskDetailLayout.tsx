'use client';

import { Task } from '@/lib/types/task';
import TaskHeader from './TaskHeader';
import TaskMainContent from './TaskMainContent';
import TaskDetailsPanel from './TaskDetailsPanel';

interface TaskDetailLayoutProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskDetailLayout: React.FC<TaskDetailLayoutProps> = ({ task, onTaskUpdate }) => {
  return (
    <div className="flex-1 flex flex-col gap-6 pb-8">
      {/* Header */}
      <TaskHeader task={task} onTaskUpdate={onTaskUpdate} />

      {/* Main Content + Sidebar */}
      <div className="flex gap-6 flex-1">
        {/* Main Content Area (70-75%) */}
        <div className="flex-1 min-w-0">
          <TaskMainContent task={task} onTaskUpdate={onTaskUpdate} />
        </div>

        {/* Right Sidebar (25-30%) */}
        <div className="w-80 flex-shrink-0">
          <TaskDetailsPanel task={task} onTaskUpdate={onTaskUpdate} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailLayout;
