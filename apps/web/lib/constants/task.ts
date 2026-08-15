import { TaskPriority, TaskStatus, TaskType } from '../types/task';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  done: 'Done',
};

export const TASK_STATUS_VALUES: TaskStatus[] = Object.keys(TASK_STATUS_LABEL) as TaskStatus[];

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const TASK_PRIORITY_VALUES: TaskPriority[] = Object.keys(
  TASK_PRIORITY_LABEL,
) as TaskPriority[];

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  story: 'Story',
  bug: 'Bug',
  feature: 'Feature',
  task: 'Task',
};

export const TASK_TYPE_VALUES: TaskType[] = Object.keys(TASK_TYPE_LABEL) as TaskType[];
