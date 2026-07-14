import { StateCreator } from 'zustand';

import { getTasks, updateTaskStatus as updateTaskStatusApi } from '@/lib/services/api/task';

import { BoardAsyncActions, BoardStore } from './types';

export const boardAsyncActions: StateCreator<BoardStore, [], [], BoardAsyncActions> = (
  set,
  get,
) => ({
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
    const prevTask = get().tasks.find((task) => task._id === taskId);

    set((state) => ({
      tasks: state.tasks.map((task) => (task._id === taskId ? { ...task, status } : task)),
    }));

    try {
      const response = await updateTaskStatusApi(taskId, status);

      if (!response.success) {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Failed to update task status', error);
      if (!prevTask) return;

      set((state) => ({
        tasks: [...state.tasks.filter((task) => task._id !== taskId), prevTask],
      }));
    }
  },
});
