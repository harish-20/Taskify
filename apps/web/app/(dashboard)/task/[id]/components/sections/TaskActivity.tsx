'use client';

import { Task } from '@/lib/types/task';
import { History } from 'lucide-react';

interface TaskActivityProps {
  task: Task;
}

const TaskActivity: React.FC<TaskActivityProps> = ({ task }) => {
  const activityCount = task.activity?.length || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>

      {activityCount === 0 ? (
        <div className="text-center py-8">
          <History className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-400 text-sm">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {task.activity?.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                {item.oldValue && item.newValue && (
                  <p className="text-xs text-gray-500">
                    Changed from <span className="font-mono bg-gray-100 px-1">{item.oldValue}</span>{' '}
                    to <span className="font-mono bg-gray-100 px-1">{item.newValue}</span>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskActivity;
