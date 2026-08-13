import { DragOverlay } from '@dnd-kit/react';
import { motion, AnimatePresence } from 'motion/react';

import TaskItem from './TaskItem';

import { Task } from '@/lib/types/task';

interface OverlayTaskItemProps {}

const OverlayTaskItem: React.FC<OverlayTaskItemProps> = (props) => {
  const {} = props;

  return (
    <DragOverlay>
      {(source) => (
        <AnimatePresence>
          <motion.div initial={{ rotate: 0 }} animate={{ rotate: 3 }} exit={{ rotate: 0 }}>
            <TaskItem key={source.id} task={source.data as Task} />
          </motion.div>
        </AnimatePresence>
      )}
    </DragOverlay>
  );
};

export default OverlayTaskItem;
