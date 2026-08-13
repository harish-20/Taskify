import { Task, TaskStatus } from '@/lib/types/task';

export const boardStatuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export const sortTasksByPosition = (tasks: Task[]) =>
  [...tasks].sort((firstTask, secondTask) => firstTask.position - secondTask.position);

export const isTaskStatus = (value: string | undefined): value is TaskStatus =>
  !!value && boardStatuses.includes(value as TaskStatus);

const getStatusTasks = (tasks: Task[], status: TaskStatus, excludedTaskId?: string) =>
  tasks
    .filter((task) => task.status === status && task._id !== excludedTaskId)
    .sort((firstTask, secondTask) => firstTask.position - secondTask.position);

const getTaskMidpointY = (taskId: string) => {
  const element = document.querySelector(`[data-task-id="${taskId}"]`);

  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return rect.top + rect.height / 2;
};

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

  const statusTasks = getStatusTasks(tasks, targetStatus, draggedTask._id);

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
  const statusTasks = getStatusTasks(tasks, status, draggedTaskId);

  for (const task of statusTasks) {
    const midY = getTaskMidpointY(task._id);

    if (midY === null) {
      continue;
    }

    if (pointerY < midY) {
      return task;
    }
  }

  return undefined;
};

export const getTargetTask = (
  tasks: Task[],
  status: TaskStatus,
  pointerY: number,
  draggedTask: Task['_id'],
) => {
  const statusTasks = getStatusTasks(tasks, status);

  for (const [index, task] of statusTasks.entries()) {
    const midY = getTaskMidpointY(task._id);

    if (midY === null) {
      continue;
    }

    if (pointerY < midY) {
      const previousTask = statusTasks[index - 1];

      if (previousTask && previousTask._id === draggedTask) {
        return previousTask;
      }

      return task;
    }
  }

  return null;
};
