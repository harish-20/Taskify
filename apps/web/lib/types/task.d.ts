import { User } from './user';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskType = 'story' | 'bug' | 'feature' | 'task';

export interface ChecklistItem {
  title: string;
  completed: boolean;
}

export interface Attachment {
  fileName: string;
  url: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Comment {
  author: User;
  message: string;
  createdAt: Date;
}

export interface Activity {
  action: string;
  user: User;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

export interface Task {
  _id: string;
  ticketId: string;
  title: string;
  description?: string | TrustedHTML;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  estimate?: number;
  spentTime: number;
  remainingTime?: number;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  assignees: User[];
  watchers: User[];
  createdBy: User;
  organizationId: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  checklist: ChecklistItem[];
  activity: Activity[];
  parentTask?: Task;
  subTasks: Task[];
  blockedBy: Task[];
  blocking: Task[];
  position: number;
  color?: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
