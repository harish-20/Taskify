import { StateCreator } from "zustand";
import { TaskStore, Task } from "./task.types";

export const taskActions: StateCreator<TaskStore> = (set) => ({
  tasks: [],
  addTask: (title) => {
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: crypto.randomUUID(), title, completed: false } as Task,
      ],
    }));
  },
  toggleTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },
});

export default taskActions;
