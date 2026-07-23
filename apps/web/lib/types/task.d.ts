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
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Comment {
  author: string;
  message: string;
  createdAt: Date;
}

export interface Activity {
  action: string;
  user: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

export interface Task {
  _id: string;
  ticketId: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  estimate?: number;
  spentTime: number;
  remainingTime?: number;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  assignees: string[];
  watchers: string[];
  createdBy: string;
  organizationId: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  checklist: ChecklistItem[];
  activity: Activity[];
  parentTask?: string;
  subTasks: string[];
  blockedBy: string[];
  blocking: string[];
  position: number;
  color?: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
