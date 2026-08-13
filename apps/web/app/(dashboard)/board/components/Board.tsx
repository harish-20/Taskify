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
  const { tasks, updateTask, setDraggedTask, setFeedbackTaskPosition } = useTaskBoardStore();

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

      /*
       * The collision target is the element currently under
       * the dragged item.
       */
      const targetId = event.operation?.target?.id as string | undefined;

      if (!targetId) return;

      /*
       * The target can either be:
       *
       *   task
       *   column
       *
       * Determine which one we have.
       */
      const targetTask = tasks.find((task) => task._id === targetId);

      let targetStatus: TaskStatus | undefined;

      if (targetTask) {
        targetStatus = targetTask.status;
      } else if (isTaskStatus(targetId)) {
        targetStatus = targetId;
      }

      if (!targetStatus) return;

      /*
       * Get the current pointer Y position.
       *
       * This should be the Y coordinate of the drag operation.
       */
      const pointerY = event.operation?.position?.current?.y;

      if (pointerY == null) return;

      /*
       * Find the task whose midpoint is below the pointer.
       *
       * If undefined, the item is being dropped at the end
       * of the column.
       */

      const feedbackTask = getTargetTask(tasks, targetStatus, pointerY, draggedTask._id);

      setFeedbackTaskPosition(feedbackTask?._id || null);
    },

    onDragEnd(event) {
      const draggedTask = event.operation.source?.data as Task;
      if (!draggedTask) return;

      /*
       * The collision target is the element currently under
       * the dragged item.
       */
      const targetId = event.operation?.target?.id as string | undefined;

      if (!targetId) return;

      /*
       * The target can either be:
       *
       *   task
       *   column
       *
       * Determine which one we have.
       */
      const targetTask = tasks.find((task) => task._id === targetId);

      let targetStatus: TaskStatus | undefined;

      if (targetTask) {
        targetStatus = targetTask.status;
      } else if (isTaskStatus(targetId)) {
        targetStatus = targetId;
      }

      if (!targetStatus) return;

      /*
       * Get the current pointer Y position.
       *
       * This should be the Y coordinate of the drag operation.
       */
      const pointerY = event.operation?.position?.current?.y;

      if (pointerY == null) return;

      /*
       * Find the task whose midpoint is below the pointer.
       *
       * If undefined, the item is being dropped at the end
       * of the column.
       */
      const dropTargetTask = getTaskAtDropPosition(tasks, targetStatus, pointerY, draggedTask._id);

      const position = getNextPosition(tasks, draggedTask, dropTargetTask, targetStatus);

      updateTask(draggedTask._id, {
        status: targetStatus,
        position,
      });
      setFeedbackTaskPosition(null);
    },
  });

  return (
    <>
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(groupedTasks).map(([status, columnTasks]) => (
          <Column key={status} status={status as TaskStatus} tasks={columnTasks} />
        ))}
      </div>

      <OverlayTaskItem />
    </>
  );
};

export default Board;
