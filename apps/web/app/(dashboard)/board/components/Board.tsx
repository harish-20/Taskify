import { useDragDropMonitor } from '@dnd-kit/react';

import {
  getNextPosition,
  getTargetTask,
  getTaskAtDropPosition,
  isTaskStatus,
  sortTasksByPosition,
} from './boardUtils';
import Column from './Column';
import OverlayTaskItem from './OverlayTaskItem';

import useTaskBoardStore from '@/lib/store/board';
import { Task, TaskStatus } from '@/lib/types/task';

const Board: React.FC = () => {
  const tasks = useTaskBoardStore((state) => state.tasks);
  const updateTask = useTaskBoardStore((state) => state.updateTask);
  const setDraggedTask = useTaskBoardStore((state) => state.setDraggedTask);
  const setFeedbackTaskPosition = useTaskBoardStore((state) => state.setFeedbackTaskPosition);

  const groupedTasks: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  tasks.forEach((task) => {
    groupedTasks[task.status].push(task);
  });

  Object.keys(groupedTasks).forEach((status) => {
    groupedTasks[status as TaskStatus] = sortTasksByPosition(groupedTasks[status as TaskStatus]);
  });

  useDragDropMonitor({
    onDragStart(event) {
      const taskId = event.operation?.source?.id as string | undefined;

      if (taskId) {
        setDraggedTask(taskId);
      }
    },
    onDragMove(event) {
      const draggedTask = event.operation.source?.data as Task;
      if (!draggedTask) return;

      const targetStatus = event.operation.target?.id as TaskStatus;
      if (!targetStatus) return;

      const pointerY = event.operation?.position?.current?.y;
      if (pointerY == null) return;

      const feedbackTask = getTargetTask(tasks, targetStatus, pointerY, draggedTask._id);

      setFeedbackTaskPosition(feedbackTask?._id || null);
    },

    onDragEnd(event) {
      const draggedTask = event.operation.source?.data as Task;
      if (!draggedTask) return;

      const targetStatus = event.operation.target?.id as TaskStatus;
      if (!targetStatus) return;

      const pointerY = event.operation?.position?.current?.y;
      if (pointerY == null) return;

      const dropTargetTask = getTaskAtDropPosition(tasks, targetStatus, pointerY, draggedTask._id);

      const position = getNextPosition(tasks, draggedTask, dropTargetTask, targetStatus);

      // avoiding api unwanted api call
      if (draggedTask.position === position && draggedTask.status === targetStatus) return;

      updateTask(draggedTask._id, {
        status: targetStatus,
        position,
      });
      setFeedbackTaskPosition(null);
    },
  });

  return (
    <>
      <div className="overflow-y-auto grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(groupedTasks).map(([status, columnTasks]) => (
          <Column key={status} status={status as TaskStatus} tasks={columnTasks} />
        ))}
      </div>

      <OverlayTaskItem />
    </>
  );
};

export default Board;
