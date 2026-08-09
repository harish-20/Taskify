import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import useClickOutside from '@/lib/hooks/useClickoutside';
import useTaskBoardStore from '@/lib/store/board';
import { Task } from '@/lib/types/task';

interface PeekChecklistProps {
  task: Task;
}

const PeekChecklist: React.FC<PeekChecklistProps> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(isOpen);
  const updateTask = useTaskBoardStore((state) => state.updateTask);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpened(isOpen);
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const checklistRef = useRef(null);
  useClickOutside(checklistRef, () => {
    setIsOpen(false);
  });

  const completedCount = task.checklist.filter((item) => item.completed).length;
  const progress = task.checklist.length > 0 ? (completedCount / task.checklist.length) * 100 : 0;

  const handleTogglePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleToggleItem = async (index: number) => {
    const nextChecklist = task.checklist.map((item, itemIndex) =>
      itemIndex === index ? { ...item, completed: !item.completed } : item,
    );

    await updateTask(task._id, { checklist: nextChecklist });
  };

  return (
    <div className="my-2 p-2" ref={checklistRef}>
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleTogglePanel}
        className="flex w-full items-center gap-3 rounded-md p-2 text-left transition cursor-pointer hover:bg-gray-100"
      >
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-1 rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', duration: 0.4 }}
          />
        </div>
        <span className="text-xs font-semibold text-primary">
          {completedCount}/{task.checklist.length}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            className={`max-h-52 mt-1 rounded-lg border border-gray-200 ${isOpened ? 'overflow-y-auto' : 'overflow-y-clip'}`}
          >
            <div className="mt-2 space-y-2 bg-white p-2">
              {task.checklist.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    void handleToggleItem(index);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition cursor-pointer hover:bg-gray-50"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      item.completed
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                  >
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeekChecklist;
