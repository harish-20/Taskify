'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import TaskDetailLayout from './components/TaskDetailLayout';

import Spinner from '@/components/UI/Spinner';
import { useApi } from '@/lib/hooks/useApi';
import { getTaskById } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const { execute, loading, error } = useApi(async (taskId: string) => getTaskById(taskId), {
    onSuccess: (data) => data?.data && setTask(data.data),
  });

  useEffect(() => {
    if (taskId) {
      void execute(taskId);
    }
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Task not found</h2>
          <p className="text-gray-500 mt-2">
            {error?.message || 'The task you are looking for does not exist'}
          </p>
        </div>
      </div>
    );
  }

  return <TaskDetailLayout task={task} onTaskUpdate={setTask} />;
}
