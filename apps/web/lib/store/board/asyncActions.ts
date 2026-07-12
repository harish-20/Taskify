import { StateCreator } from 'zustand';

import { getTasks, updateTaskStatus as updateTaskStatusApi } from '@/lib/services/api/task';

import { BoardAsyncActions, BoardStore } from './types';

export const boardAsyncActions: StateCreator<BoardStore, [], [], BoardAsyncActions> = (set) => ({
  loadTasks: async () => {
    set({ isLoading: true });

    try {
      const response = await getTasks();
      set({ tasks: response.data ?? [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load tasks', error);
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await updateTaskStatusApi(taskId, status);
      const updatedTask = response.data;

      if (!updatedTask) return;

      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === taskId ? updatedTask : task)),
      }));
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  },
});