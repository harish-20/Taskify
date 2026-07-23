'use client';

import { Task } from '@/lib/types/task';
import { Link as LinkIcon } from 'lucide-react';

interface TaskDependenciesProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({ task }) => {
  const blockedByCount = task.blockedBy?.length || 0;
  const blockingCount = task.blocking?.length || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>

      {blockedByCount === 0 && blockingCount === 0 ? (
        <div className="text-center py-8">
          <LinkIcon className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-400 text-sm">No dependencies</p>
          <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            + Add Dependency
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {blockedByCount > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Blocked by ({blockedByCount})
              </p>
              <div className="space-y-1">{/* Blocked by items will be rendered here */}</div>
            </div>
          )}

          {blockingCount > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Blocking ({blockingCount})</p>
              <div className="space-y-1">{/* Blocking items will be rendered here */}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDependencies;
