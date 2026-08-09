import { useDraggable } from '@dnd-kit/react';
import { ClockAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef } from 'react';

import { TaskPriorityIcons, TaskTypeIcons } from '../../../../components/icons/task';
import UsersListInput from '../../../../components/UI/UsersListInput';

import PeekChecklist from './PeekChecklist';

import Tooltip from '@/components/UI/Tooltip';
import useTaskBoardStore from '@/lib/store/board';
import useModalStore from '@/lib/store/modal';
import { Task } from '@/lib/types/task';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { openModal } = useModalStore();
  const updateTask = useTaskBoardStore((state) => state.updateTask);
  const organizationUsers = useTaskBoardStore((state) => state.organizationUsers);
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
      openModal('task-preview', { taskId: task._id, initialTask: task });
    }

    mouseDownPos.current = null;
  };

  const handleMouseMove = () => {
    // If mouse moves while dragging, it's likely a drag operation
    if (isDragging) {
      setIsClickable(false);
    }
  };

  const handleAssigneeChange = async (selectedUsers: Task['assignees']) => {
    await updateTask(task._id, {
      assignees: selectedUsers,
    });
  };

  const TaskTypeIcon = TaskTypeIcons[task.type];
  const TaskPriorityIcon = TaskPriorityIcons[task.priority];

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
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Tooltip content={task.type}>
            <div className="flex items-center gap-2">
              <TaskTypeIcon className="stroke-2 h-5 w-5" />
              <span className="text-xs font-semibold text-gray-600">{task.ticketId}</span>
            </div>
          </Tooltip>

          <div>
            <TaskPriorityIcon />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-gray-900">{task.title}</h3>

          {task.description && (
            <div
              className="mt-1 line-clamp-3 text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: task.description,
              }}
            ></div>
          )}
        </div>
      </div>

      {task.checklist.length > 0 && <PeekChecklist task={task} />}

      {/* Footer */}
      <div className="mt-5">
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            return false;
          }}
          className="flex justify-between gap-2"
        >
          <UsersListInput
            users={task.assignees}
            availableUsers={organizationUsers}
            editable
            maxVisible={2}
            size="sm"
            onChange={handleAssigneeChange}
          />

          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ClockAlert className="h-5 w-5" />
              <span>
                {new Date(task.dueDate)?.toLocaleDateString('en-us', { dateStyle: 'medium' })}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
