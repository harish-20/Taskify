import { Task, TaskStatus } from '@/lib/types/task';

export const boardStatuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export const sortTasksByPosition = (tasks: Task[]) =>
  [...tasks].sort((firstTask, secondTask) => firstTask.position - secondTask.position);

export const isTaskStatus = (value: string | undefined): value is TaskStatus =>
  !!value && boardStatuses.includes(value as TaskStatus);

export const getNextPosition = (
  tasks: Task[],
  draggedTask: Task,
  targetTask?: Task,
  targetStatus?: TaskStatus,
  insertBefore = true,
) => {
  if (!targetStatus) {
    return draggedTask.position;
  }

  const statusTasks = tasks
    .filter((task) => task.status === targetStatus && task._id !== draggedTask._id)
    .sort((firstTask, secondTask) => firstTask.position - secondTask.position);

  // Dropping at the end
  if (!targetTask) {
    const lastTask = statusTasks.at(-1);

    return (lastTask?.position ?? -1) + 1;
  }

  const targetIndex = statusTasks.findIndex((task) => task._id === targetTask._id);

  if (targetIndex === -1) {
    return targetTask.position;
  }

  const previousTask = insertBefore ? statusTasks[targetIndex - 1] : targetTask;

  const nextTask = insertBefore ? targetTask : statusTasks[targetIndex + 1];

  if (!previousTask) {
    return targetTask.position - 1;
  }

  if (!nextTask) {
    return previousTask.position + 1;
  }

  return (previousTask.position + nextTask.position) / 2;
};

export const getTaskAtDropPosition = (
  tasks: Task[],
  status: TaskStatus,
  pointerY: number,
  draggedTaskId: string,
) => {
  const statusTasks = tasks
    .filter((task) => task.status === status && task._id !== draggedTaskId)
    .sort((a, b) => a.position - b.position);

  let i = 0;
  for (const task of statusTasks) {
    const element = document.querySelector(`[data-task-id="${task._id}"]`);

    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    if (pointerY < midY) {
      // if (i === statusTasks.length - 1) return statusTasks[i];
      // return statusTasks[i + 1];
      return task;
    }
    i++;
  }

  return undefined;
};

export const getTargetTask = (
  tasks: Task[],
  status: TaskStatus,
  pointerY: number,
  draggedTask: Task['_id'],
) => {
  const statusTasks = tasks
    .filter((task) => task.status === status)
    .sort((a, b) => a.position - b.position);

  let i = 0;
  for (const task of statusTasks) {
    const element = document.querySelector(`[data-task-id="${task._id}"]`);

    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    if (pointerY < midY) {
      const prevTask = statusTasks[i - 1];
      if (i && prevTask && prevTask._id === draggedTask) return statusTasks[i - 1];
      return task;
    }
    i++;
  }

  return null;
};
