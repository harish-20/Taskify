'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTaskById } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';
import Spinner from '@/components/UI/Spinner';
import TaskDetailLayout from './components/TaskDetailLayout';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await getTaskById(taskId);
        if (response.success && response.data) {
          setTask(response.data);
        } else {
          setError('Failed to load task');
        }
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Error loading task');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      void fetchTask();
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
            {error || 'The task you are looking for does not exist'}
          </p>
        </div>
      </div>
    );
  }

  return <TaskDetailLayout task={task} onTaskUpdate={setTask} />;
}
