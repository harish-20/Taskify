import { Feedback } from '@dnd-kit/dom';
import { useDraggable } from '@dnd-kit/react';
import { ClockAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, useCallback } from 'react';

import { TaskPriorityIcons, TaskTypeIcons } from '../../../../components/icons/task';
import UsersListInput from '../../../../components/UI/UsersListInput';

import PeekChecklist from './PeekChecklist';
import { TaskDropIndicator } from './TaskDropZone';

import StopPropagation from '@/components/shared/StopPropagation';
import Tooltip from '@/components/UI/Tooltip';
import useTaskBoardStore from '@/lib/store/board';
import useModalStore from '@/lib/store/modal';
import { Task } from '@/lib/types/task';

const CLICK_DISTANCE_THRESHOLD = 5;

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const openModal = useModalStore((state) => state.openModal);
  const updateTask = useTaskBoardStore((state) => state.updateTask);
  const organizationUsers = useTaskBoardStore((state) => state.organizationUsers);
  const setDraggedTaskHeight = useTaskBoardStore((state) => state.setDraggedTaskHeight);
  const draggedTask = useTaskBoardStore((state) => state.draggedTask);
  const feedbackTaskPosition = useTaskBoardStore((state) => state.feedbackTaskPosition);
  const { ref, isDragging } = useDraggable({
    id: task._id,
    data: task,
    plugins: [
      Feedback.configure({
        feedback: 'clone',
      }),
    ],
  });

  const taskCardRef = useRef<HTMLDivElement | null>(null);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const [isClickable, setIsClickable] = useState(true);

  const isDropIndicatorVisible = feedbackTaskPosition === task._id && task._id !== draggedTask;

  const attachTaskRef = useCallback(
    (node: HTMLDivElement | null) => {
      taskCardRef.current = node;
      ref(node);
    },
    [ref],
  );

  useEffect(() => {
    if (!isDragging || !taskCardRef.current) {
      return;
    }

    setDraggedTaskHeight(taskCardRef.current.getBoundingClientRect().height);
  }, [isDragging, setDraggedTaskHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    setIsClickable(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseDownPos.current || !isClickable || isDragging) return;

    const distance = Math.hypot(
      e.clientX - mouseDownPos.current.x,
      e.clientY - mouseDownPos.current.y,
    );

    if (distance < CLICK_DISTANCE_THRESHOLD) {
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
    <>
      {isDropIndicatorVisible && <TaskDropIndicator />}
      <motion.div
        data-task-id={task._id}
        ref={attachTaskRef}
        initial={false}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
          isDragging ? 'active:cursor-grabbing' : 'cursor-pointer hover:border-primary'
        }`}
        animate={
          isDragging
            ? {
                backgroundColor: '#f0fdfa',
                borderColor: '#22c55e',
                boxShadow: '0 14px 32px rgba(15, 118, 110, 0.18)',
              }
            : {
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
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

            <Tooltip
              content={`${task.priority[0]?.toUpperCase()}${task.priority.slice(1)} Priority`}
            >
              <TaskPriorityIcon />
            </Tooltip>
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
          <div className="flex justify-between gap-2">
            <StopPropagation>
              <UsersListInput
                users={task.assignees}
                availableUsers={organizationUsers}
                editable
                maxVisible={2}
                size="sm"
                onChange={handleAssigneeChange}
              />
            </StopPropagation>

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
    </>
  );
};

export default TaskItem;
