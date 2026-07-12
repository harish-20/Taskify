import { motion } from 'motion/react';

import { Task } from '@/lib/types/task';

interface TaskItemProps {
  handleDragStart: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnd: () => void;
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ handleDragStart, handleDragEnd, task }) => {
  return (
    <motion.div
      draggable
      onDragStart={(e) =>
        handleDragStart(task._id, e as unknown as React.DragEvent<HTMLDivElement>)
      }
      onDragEnd={handleDragEnd}
      className="cursor-grab rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-gray-900">{task.title}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{task.description}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="Assignee"
            className="h-8 w-8 rounded-full object-cover"
          />

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>20 Oct, 2022</span>
          </div>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          Urgent
        </span>
      </div>
    </motion.div>
  );
};

export default TaskItem;
