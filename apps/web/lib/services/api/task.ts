import { ApiResponse } from '@repo/shared/types';

import pathMap from './pathMap';

import Api from '.';

import type { ChecklistItem, Task } from '@/lib/types/task';

export interface CreateTaskInput {
  board?: string;
  title: string;
  description?: string;
  type?: Task['type'];
  status?: Task['status'];
  priority?: Task['priority'];
  estimate?: number;
  spentTime?: number;
  remainingTime?: number;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  assignees?: string[];
  watchers?: string[];
  tags?: string[];
  checklist?: Array<Pick<ChecklistItem, 'title' | 'completed'>>;
  parentTask?: string;
  subTasks?: string[];
  blockedBy?: string[];
  blocking?: string[];
  position?: number;
  color?: string;
  isArchived?: boolean;
}

export const getTasks = async (boardId?: string) => {
  const response = await Api.get<ApiResponse<Task[]>>(
    pathMap.task.list,
    boardId ? { params: { boardId } } : undefined,
  );

  return response.data;
};

export const getTaskById = async (taskId: string) => {
  const response = await Api.get<ApiResponse<Task>>(`${pathMap.task.list}/${taskId}`);

  return response.data;
};

export const createTask = async (taskData: CreateTaskInput) => {
  const response = await Api.post<ApiResponse<Task>>(pathMap.task.create, taskData);

  return response.data;
};

export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  // add only id for assignees and watchers to avoid sending unnecessary data
  if (taskData.assignees) {
    taskData.assignees = taskData.assignees.map((user) => user._id as any);
  }
  if (taskData.watchers) {
    taskData.watchers = taskData.watchers.map((user) => user._id as any);
  }
  const response = await Api.patch<ApiResponse<Task>>(`${pathMap.task.list}/${taskId}`, taskData);

  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await Api.delete<ApiResponse<null>>(`${pathMap.task.list}/${taskId}`);

  return response.data;
};

export const getAvailableSubtasks = async (taskId: string) => {
  const response = await Api.get<ApiResponse<Task[]>>(
    `${pathMap.task.list}/${taskId}/available-subtasks`,
  );

  return response.data;
};

export const addSubtaskToTask = async (taskId: string, subTaskId: string) => {
  const response = await Api.post<ApiResponse<Task>>(`${pathMap.task.list}/${taskId}/subtasks`, {
    subTaskId,
  });

  return response.data;
};

export const removeSubtaskFromTask = async (taskId: string, subTaskId: string) => {
  const response = await Api.patch<ApiResponse<Task>>(
    `${pathMap.task.list}/${taskId}/subtasks/remove`,
    {
      subTaskId,
    },
  );

  return response.data;
};
