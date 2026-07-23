import useTaskBoardStore from '@/lib/store/board';

import { Task, TaskStatus } from '@/lib/types/task';

import Column from './Column';
import { useDragDropMonitor } from '@dnd-kit/react';

const Board: React.FC = () => {
  const { tasks, updateTaskStatus } = useTaskBoardStore();

  const groupedTasks: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  tasks.forEach((task) => {
    groupedTasks[task.status].push(task);
  });

  useDragDropMonitor({
    onBeforeDragStart(event, manager) {},
    onDragStart(event, manager) {},
    onDragMove(event, manager) {},
    onDragOver(event, manager) {},
    onDragEnd(event, manager) {
      const { operation, canceled } = event;

      if (canceled) {
        return;
      }

      const taskId = operation?.source?.id as string;
      const taskStatus = operation?.target?.id as TaskStatus;

      if (taskId && taskStatus && taskStatus !== status) {
        updateTaskStatus(taskId, taskStatus);
      }
    },
    onCollision(event, manager) {},
  });

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(groupedTasks).map(([status, columnTasks]) => (
        <Column key={status} status={status as TaskStatus} tasks={columnTasks} />
      ))}
    </div>
  );
};

export default Board;
