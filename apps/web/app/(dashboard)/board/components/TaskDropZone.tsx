import { useDroppable } from '@dnd-kit/react';
import { motion } from 'motion/react';

import { getNextPosition } from './boardUtils';

import useTaskBoardStore from '@/lib/store/board';
import { Task } from '@/lib/types/task';

interface TaskDropIndicatorProps {
  label?: string;
}

export const TaskDropIndicator: React.FC<TaskDropIndicatorProps> = ({ label = 'Drop Here' }) => {
  const draggedTaskHeight = useTaskBoardStore((state) => state.draggedTaskHeight);

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.96 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.96 }}
      style={{ height: draggedTaskHeight ?? undefined }}
      className="flex items-center justify-center rounded-xl border border-dashed border-blue-600 bg-white p-6 shadow-sm"
    >
      <div className="font-semibold text-blue-600">{label}</div>
    </motion.div>
  );
};

interface TaskDropZoneProps {
  task: Task;
  children: React.ReactNode;
}

const TaskDropZone: React.FC<TaskDropZoneProps> = ({ task, children }) => {
  const { ref, isDropTarget } = useDroppable({
    id: task._id,
    data: task,
  });

  const draggedTask = useTaskBoardStore((state) => state.draggedTask);
  const draggedTaskHeight = useTaskBoardStore((state) => state.draggedTaskHeight);
  const tasks = useTaskBoardStore((state) => state.tasks);

  const sourceTask = tasks.find((candidate) => candidate._id === draggedTask);
  const nextPosition = sourceTask ? getNextPosition(tasks, sourceTask, task, task.status) : null;
  const isSamePlacement =
    !!sourceTask && sourceTask.status === task.status && nextPosition === sourceTask.position;

  const isActiveDropTarget = isDropTarget && draggedTask !== task._id && !isSamePlacement;

  return (
    <div ref={ref} className="relative flex flex-col gap-2">
      {draggedTask && isActiveDropTarget && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.96 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.96 }}
          style={{ height: draggedTaskHeight ?? undefined }}
          className="flex items-center justify-center rounded-xl border border-dashed border-blue-300 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm"
        >
          <div className="bg-blue-200 text-blue-600 font-medium py-2 px-3 rounded-full">
            Drop Here
          </div>
        </motion.div>
      )}

      <div className="relative transition-transform duration-150 ease-out group-hover:translate-y-0.5">
        {children}
      </div>
    </div>
  );
};

export default TaskDropZone;
