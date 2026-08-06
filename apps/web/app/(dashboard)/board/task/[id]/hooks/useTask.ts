import { useEffect, useState } from 'react';

import { useApi } from '@/lib/hooks/useApi';
import { getTaskById } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

export const useTask = (taskId: string) => {
  const [task, setTask] = useState<Task | null>(null);
  const { execute, loading, error } = useApi(async (taskId: string) => getTaskById(taskId), {
    onSuccess: (data) => data?.data && setTask(data.data),
  });

  useEffect(() => {
    if (taskId) {
      void execute(taskId);
    }
  }, [taskId]);

  return { task, setTask, loading, error };
};
