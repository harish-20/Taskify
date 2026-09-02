import { StateCreator } from 'zustand';

import { defaultState } from './state';
import { BoardActions, BoardStore } from './types';

import { TaskStatus } from '@/lib/types/task';

export const boardActions: StateCreator<BoardStore, [], [], BoardActions> = (set) => ({
  setTasks: (tasks) =>
    set((state) => ({
      tasks: typeof tasks === 'function' ? tasks(state.tasks) : tasks,
    })),
  syncTask: (task) =>
    set((state) => {
      const belongsToCurrentBoard = (task.board ?? null) === state.currentBoardId;
      const existingTask = state.tasks.some((currentTask) => currentTask._id === task._id);

      if (!existingTask) {
        return state;
      }

      return {
        tasks: belongsToCurrentBoard
          ? state.tasks.map((currentTask) => (currentTask._id === task._id ? task : currentTask))
          : state.tasks.filter((currentTask) => currentTask._id !== task._id),
      };
    }),
  setDraggedTask: (taskId) => set({ draggedTask: taskId }),
  setDraggedTaskHeight: (height) => set({ draggedTaskHeight: height }),
  setFeedbackTaskPosition: (position) => {
    set({ feedbackTaskPosition: position });
  },
  setDraggedOverColumn: (status) => set({ draggedOverColumn: status }),
  setIsDragging: (isDragging) => set({ isDragging }),
  moveTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, status: status as TaskStatus } : task,
      ),
    })),
  reset: () => set(defaultState),
});
