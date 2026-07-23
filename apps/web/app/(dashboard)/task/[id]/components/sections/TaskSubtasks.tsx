'use client';

import { Task } from '@/lib/types/task';

interface TaskSubtasksProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ task }) => {
  const subtaskCount = task.subTasks?.length || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subtasks</h3>

      {subtaskCount === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No subtasks yet</p>
          <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            + Add Subtask
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Subtasks will be rendered here when available in the data */}
          <p className="text-gray-500 text-sm">{subtaskCount} subtask(s)</p>
        </div>
      )}
    </div>
  );
};

export default TaskSubtasks;
