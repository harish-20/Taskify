import { useDragOperation, useDroppable } from '@dnd-kit/react';
import { motion } from 'motion/react';

import { TaskStatusIcons } from '../../../../components/icons/task';

import ColumnHeader from './ColumnHeader';
import { TaskDropIndicator } from './TaskDropZone';
import TaskItem from './TaskItem';

import useTaskBoardStore from '@/lib/store/board';
import useModalStore from '@/lib/store/modal';
import { Task, TaskStatus } from '@/lib/types/task';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
  const { ref, isDropTarget } = useDroppable({
    id: status,
  });

  const feedbackTaskPosition = useTaskBoardStore((state) => state.feedbackTaskPosition);
  const { openModal } = useModalStore();

  const { source } = useDragOperation();

  const readableStatus = status.replace('_', ' ');

  const isDiffrentColumn = (source?.data.status as TaskStatus) !== status && isDropTarget;
  return (
    <div className="flex flex-col gap-3" data-task-column-id={status}>
      <ColumnHeader
        status={status}
        label={readableStatus}
        Icon={TaskStatusIcons[status]}
        onAddClick={() => {
          openModal('add-task', { defaultStatus: status });
        }}
      />

      <div
        ref={ref}
        className={`relative flex min-w-[220px] flex-1 flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 shadow-sm transition-colors duration-200 ${
          isDiffrentColumn ? 'border-sky-300 bg-sky-50/80' : 'hover:border-slate-300'
        }`}
      >
        {source && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`pointer-events-none absolute inset-0 rounded-2xl border-2 border-dashed transition-all duration-200 ${
              isDiffrentColumn ? 'border-sky-400 bg-sky-50/30' : 'border-slate-300 bg-white/40'
            }`}
          >
            <div className="flex h-full items-center justify-center">
              <div
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize shadow-sm ${
                  isDiffrentColumn ? 'bg-sky-500 text-white' : 'bg-white text-slate-500'
                }`}
              >
                {isDiffrentColumn
                  ? `Place in ${readableStatus}`
                  : `Drop to place in ${readableStatus}`}
              </div>
            </div>
          </motion.div>
        )}
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}

        {feedbackTaskPosition === null && isDropTarget && <TaskDropIndicator />}
      </div>
    </div>
  );
};

export default Column;
