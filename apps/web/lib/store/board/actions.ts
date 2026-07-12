import { StateCreator } from 'zustand';

import { TaskStatus } from '@/lib/types/task';

import { BoardActions, BoardStore } from './types';

export const boardActions: StateCreator<BoardStore, [], [], BoardActions> = (set) => ({
  setTasks: (tasks) =>
    set((state) => ({
      tasks: typeof tasks === 'function' ? tasks(state.tasks) : tasks,
    })),
  setDraggedTask: (taskId) => set({ draggedTask: taskId }),
  setDraggedOverColumn: (status) => set({ draggedOverColumn: status }),
  setIsDragging: (isDragging) => set({ isDragging }),
  moveTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, status: status as TaskStatus } : task,
      ),
    })),
});
