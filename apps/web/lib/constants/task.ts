import { TaskPriority, TaskStatus, TaskType } from '../types/task';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  done: 'Done',
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  story: 'Story',
  bug: 'Bug',
  feature: 'Feature',
  task: 'Task',
};
