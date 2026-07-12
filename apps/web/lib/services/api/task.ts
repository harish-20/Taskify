import { ApiResponse } from '@repo/shared/types';

import type { Task } from '@/lib/types/task';

import Api from '.';
import pathMap from './pathMap';

export const getTasks = async () => {
  const response = await Api.get<ApiResponse<Task[]>>(pathMap.task.list);

  return response.data;
};

export const createTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'organizationId'>) => {
  const response = await Api.post<ApiResponse<Task>>(pathMap.task.create, taskData);

  return response.data;
};

export const updateTaskStatus = async (taskId: string, status: Task['status']) => {
  const response = await Api.patch<ApiResponse<Task>>(`${pathMap.task.updateStatus}/${taskId}`, { status });

  return response.data;
};
