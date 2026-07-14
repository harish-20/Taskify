import { Task, TaskStatus } from '@/lib/types/task';

import Done from '../icons/Done';
import InProgress from '../icons/InProgress';
import Review from '../icons/Review';
import Todo from '../icons/Todo';
import ColumnHeader from './ColumnHeader';
import TaskItem from './TaskItem';

import { motion } from 'motion/react';
import { useDragOperation, useDroppable } from '@dnd-kit/react';

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
  const { ref, isDropTarget } = useDroppable({
    id: status,
  });

  const { source } = useDragOperation();

  const readableStatus = status.replace('_', ' ');

  const isDiffrentColumn = (source?.data.status as TaskStatus) !== status && isDropTarget;
  return (
    <div className="flex flex-col gap-4">
      <ColumnHeader
        label={readableStatus}
        Icon={columnIcons[status]}
        onAddClick={() => {
          // Handle add task click
        }}
      />

      <div ref={ref} className="relative flex flex-1 min-w-[220px] flex-col gap-2 rounded-lg">
        {source && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDiffrentColumn ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300 bg-gray-100/50'
            }`}
          >
            <div className="flex h-full items-center justify-center">
              <div
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                  isDiffrentColumn ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 shadow'
                }`}
              >
                {readableStatus}
              </div>
            </div>
          </motion.div>
        )}
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
