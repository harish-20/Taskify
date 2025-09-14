export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskStore {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
}
