import { z } from 'zod';

import { TASK_STATUS_LABEL, TASK_TYPE_LABEL, TASK_PRIORITY_LABEL } from '@/lib/constants/task';
import { TaskPriority, TaskStatus, TaskType } from '@/lib/types/task';

export const taskDetailSchema = z.object({
  title: z.string().min(1, 'Task title is required').trim(),
  description: z.string().trim().optional(),
  type: z.enum(Object.keys(TASK_TYPE_LABEL) as TaskType[]).optional(),
  status: z.enum(Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).optional(),
  priority: z.enum(Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]).optional(),
  estimate: z.number().min(0, 'Estimate cannot be negative').optional(),
  spentTime: z.number().min(0, 'Spent time cannot be negative').optional(),
  remainingTime: z.number().min(0, 'Remaining time cannot be negative').optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  assignees: z.array(z.string()).optional(),
  watchers: z.array(z.string()).optional(),
  tags: z.array(z.string().trim().min(1, 'Tag cannot be empty')).optional(),
  color: z.string().trim().optional(),
  parentTask: z.string().optional().nullable(),
  blockedBy: z.array(z.string()).optional(),
  blocking: z.array(z.string()).optional(),
});

export type TaskDetailFormType = z.infer<typeof taskDetailSchema>;
