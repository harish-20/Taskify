import { z } from 'zod';

import { TaskPriority, TaskStatus, TaskType } from '@/lib/types/task';

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]);

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high', 'critical'] as TaskPriority[]);

export const TaskTypeSchema = z.enum(['story', 'bug', 'feature', 'task'] as TaskType[]);

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: TaskTypeSchema,
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dueDate: z.date().min(new Date(), {
    message: 'Due date must be in the future',
  }),
  assignees: z.array(z.string()).min(1, 'At least one assignee is required'),
  tags: z.array(z.string()),
});

export type TaskFormType = z.infer<typeof TaskSchema>;

export default TaskSchema;
