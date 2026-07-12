import { Task, TaskStatus } from '@/lib/types/task';

import Done from '../icons/Done';
import InProgress from '../icons/InProgress';
import Review from '../icons/Review';
import Todo from '../icons/Todo';
import ColumnHeader from './ColumnHeader';
import TaskItem from './TaskItem';

import useDnd from '@/lib/hooks/useDnd';
import { motion } from 'motion/react';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

const columnIcons: Record<TaskStatus, React.FC<React.SVGProps<SVGSVGElement>>> = {
  todo: Todo,
  in_progress: InProgress,
  review: Review,
  done: Done,
};

const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
  const {
    draggedOverColumn,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDnd();

  return (
    <div className="flex flex-col gap-4">
      <ColumnHeader
        label={status.replace('_', ' ')}
        Icon={columnIcons[status]}
        onAddClick={() => {
          // Handle add task click
        }}
      />

      <div
        className="relative flex flex-1 min-w-[220px] flex-col gap-2 rounded-lg"
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver(status);
        }}
        onDrop={(e) => {
          e.preventDefault();
          console.log('Dropped on column:', status);
          void handleDrop(status, e as unknown as React.DragEvent<HTMLDivElement>);
        }}
      >
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed transition-all duration-200 ${
              draggedOverColumn === status
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-300 bg-gray-100/50'
            }`}
          >
            <div className="flex h-full items-center justify-center">
              <div
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  draggedOverColumn === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-500 shadow'
                }`}
              >
                Drop task here
              </div>
            </div>
          </motion.div>
        )}
        {tasks.map((task) => (
          <TaskItem
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            key={task._id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
