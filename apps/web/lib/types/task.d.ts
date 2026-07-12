export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskType = 'story' | 'bug' | 'feature' | 'task';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignees: string[];
  createdBy: string;
  organizationId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
