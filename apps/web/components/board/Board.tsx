import { DndContext } from '@dnd-kit/core';
import useTaskBoardStore from '@/lib/store/board';

import { Task, TaskStatus } from '@/lib/types/task';

import Column from './Column';

const Board: React.FC = () => {
  const { tasks } = useTaskBoardStore();

  const groupedTasks: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  tasks.forEach((task) => {
    groupedTasks[task.status].push(task);
  });

  return (
    <DndContext>
      <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(groupedTasks).map(([status, columnTasks]) => (
          <Column key={status} status={status as TaskStatus} tasks={columnTasks} />
        ))}
      </div>
    </DndContext>
  );
};

export default Board;
