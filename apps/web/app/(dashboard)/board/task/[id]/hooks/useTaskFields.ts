import { useCallback, useMemo, useState } from 'react';

import { useApi } from '@/lib/hooks/useApi';
import { updateTask } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

type UpdatingFields = Partial<Record<keyof Task, boolean>>;

interface UpdateFieldOptions<K extends keyof Task, V> {
  normalize?: (value: V) => Task[K];
  isEqual?: (current: Task[K], next: V) => boolean;
  optimistic?: boolean;
}

export interface TaskFieldUpdater {
  loading: boolean;
  updatingFields: UpdatingFields;
  updateField: <K extends keyof Task, V = Task[K]>(
    field: K,
    value: V,
    options?: UpdateFieldOptions<K, V>,
  ) => Promise<void>;
}

export const useTaskFields = (task: Task, onTaskUpdate: (task: Task) => void): TaskFieldUpdater => {
  const [updatingFields, setUpdatingFields] = useState<UpdatingFields>({});
  const { execute: updateTaskApi, loading } = useApi(updateTask);

  const updateField = useCallback(
    async <K extends keyof Task, V = Task[K]>(
      field: K,
      value: V,
      options?: UpdateFieldOptions<K, V>,
    ) => {
      const currentValue = task[field] as Task[K];
      if (options?.isEqual?.(currentValue, value)) {
        return;
      }

      const normalizedValue = options?.normalize
        ? options.normalize(value)
        : (value as unknown as Task[K]);
      const shouldOptimisticallyUpdate = options?.optimistic ?? true;
      const previousTask = task;

      try {
        setUpdatingFields((prev) => ({ ...prev, [field]: true }));

        if (shouldOptimisticallyUpdate) {
          onTaskUpdate({ ...task, [field]: normalizedValue });
        }

        const response = await updateTaskApi(task._id, {
          [field]: normalizedValue,
        } as Partial<Task>);

        if (response.success && response.data) {
          onTaskUpdate(response.data);
        }
      } catch (error) {
        console.error(error);
        if (shouldOptimisticallyUpdate) {
          onTaskUpdate(previousTask);
        }
      } finally {
        setUpdatingFields((prev) => ({ ...prev, [field]: false }));
      }
    },
    [onTaskUpdate, task, updateTaskApi],
  );

  return useMemo(
    () => ({
      loading,
      updatingFields,
      updateField,
    }),
    [loading, updateField, updatingFields],
  );
};
