import { StateCreator } from 'zustand';

import { BoardAsyncActions, BoardStore } from './types';

import { getOrganizationUsers } from '@/lib/services/api/organization';
import { createTask, getTasks, updateTask as updateTaskApi } from '@/lib/services/api/task';

export const boardAsyncActions: StateCreator<BoardStore, [], [], BoardAsyncActions> = (
  set,
  get,
) => ({
  loadTasks: async (boardId) => {
    set({ isLoading: true });

    try {
      const response = await getTasks(boardId);
      set({ tasks: response.data ?? [], currentBoardId: boardId, isLoading: false });
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

  updateTask: async (taskId, taskData) => {
    const prevTask = get().tasks.find((task) => task._id === taskId);

    set((state) => ({
      tasks: state.tasks.map((task) => (task._id === taskId ? { ...task, ...taskData } : task)),
    }));

    try {
      set((state) => ({
        tasksMovingStatus: {
          ...state.tasksMovingStatus,
          [taskId]: { status: 'loading' },
        },
      }));
      const response = await updateTaskApi(taskId, taskData);

      if (!response.success || !response.data) {
        throw new Error('Update failed');
      }

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? (response.data as BoardStore['tasks'][number]) : task,
        ),
        tasksMovingStatus: {
          ...state.tasksMovingStatus,
          [taskId]: { status: 'success' },
        },
      }));
    } catch (error) {
      console.error('Failed to update task', error);

      if (!prevTask) return;

      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === taskId ? prevTask : task)),
        tasksMovingStatus: {
          ...state.tasksMovingStatus,
          [taskId]: { status: 'failed' },
        },
      }));
    } finally {
      setTimeout(() => {
        set((state) => {
          const { [taskId]: _, ...rest } = state.tasksMovingStatus;
          return {
            tasksMovingStatus: {
              ...rest,
            },
          };
        });
      }, 1000);
    }
  },
});
