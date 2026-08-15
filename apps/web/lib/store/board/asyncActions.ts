import { StateCreator } from 'zustand';

import { BoardAsyncActions, BoardStore } from './types';

import { getOrganizationUsers } from '@/lib/services/api/organization';
import {
  createTask,
  getTasks,
  updateTask as updateTaskApi,
  updateTaskStatus as updateTaskStatusApi,
} from '@/lib/services/api/task';

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

  loadOrganizationUsers: async () => {
    try {
      const response = await getOrganizationUsers();
      set({ organizationUsers: response.data || [] });
    } catch (error) {
      console.error('Failed to load organization users', error);
    }
  },

  addTask: async (task) => {
    try {
      const response = await createTask(task);

      if (response.success && response.data !== undefined) {
        const newTask = response.data;
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      }
    } catch (error) {
      console.error('Failed to add task', error);
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

  updateTask: async (taskId, taskData) => {
    const prevTask = get().tasks.find((task) => task._id === taskId);

    set((state) => ({
      tasks: state.tasks.map((task) => (task._id === taskId ? { ...task, ...taskData } : task)),
    }));

    try {
      const response = await updateTaskApi(taskId, taskData);

      if (!response.success || !response.data) {
        throw new Error('Update failed');
      }

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? (response.data as BoardStore['tasks'][number]) : task,
        ),
      }));
    } catch (error) {
      console.error('Failed to update task', error);

      if (!prevTask) return;

      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === taskId ? prevTask : task)),
      }));
    }
  },
});
