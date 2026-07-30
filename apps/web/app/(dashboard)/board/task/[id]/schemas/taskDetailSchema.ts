import { z } from 'zod';

export const taskDetailSchema = z.object({
  title: z.string().min(1, 'Task title is required').trim(),
  description: z.string().trim().optional(),
  type: z.enum(['story', 'bug', 'feature', 'task'] as const).optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done'] as const).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const).optional(),
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
