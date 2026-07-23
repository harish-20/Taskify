import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

import { useDraggable } from '@dnd-kit/react';

import { Task } from '@/lib/types/task';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const router = useRouter();
  const { ref, isDragging } = useDraggable({
    id: task._id,
    data: task,
  });

  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const [isClickable, setIsClickable] = useState(true);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    setIsClickable(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseDownPos.current || !isClickable || isDragging) return;

    const distance = Math.sqrt(
      Math.pow(e.clientX - mouseDownPos.current.x, 2) +
        Math.pow(e.clientY - mouseDownPos.current.y, 2),
    );

    // If distance is less than 5px, treat it as a click
    if (distance < 5) {
      router.push(`/task/${task._id}`);
    }

    mouseDownPos.current = null;
  };

  const handleMouseMove = () => {
    // If mouse moves while dragging, it's likely a drag operation
    if (isDragging) {
      setIsClickable(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={false}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`rounded-xl border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? 'active:cursor-grabbing' : 'cursor-pointer hover:border-primary'
      }`}
      animate={
        isDragging
          ? {
              backgroundColor: '#ecfeff',
              borderColor: '#06b6d4',
              boxShadow: '0 12px 30px rgba(6, 182, 212, 0.24)',
            }
          : {
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }
      }
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
