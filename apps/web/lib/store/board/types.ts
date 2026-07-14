import { Task, TaskStatus } from '@/lib/types/task';

export interface BoardState {
  tasks: Task[];
  draggedTask: Task['_id'] | null;
  draggedOverColumn: TaskStatus | null;
  isDragging: boolean;
  isLoading: boolean;
}

export interface BoardActions {
  setTasks: (tasks: Task[] | ((currentTasks: Task[]) => Task[])) => void;
  setDraggedTask: (taskId: Task['_id'] | null) => void;
  setDraggedOverColumn: (status: TaskStatus | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  moveTask: (taskId: Task['_id'], status: TaskStatus) => void;
}

export interface BoardAsyncActions {
  loadTasks: () => Promise<void>;
  updateTaskStatus: (taskId: Task['_id'], status: Task['status']) => Promise<void>;
}

export interface BoardStore extends BoardState, BoardActions, BoardAsyncActions {}
