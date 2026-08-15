'use client';

import { useParams } from 'next/navigation';

import TaskDetailLayout from './components/TaskDetailLayout';
import { useTask } from './hooks/useTask';

import Spinner from '@/components/UI/Spinner';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  const { task, setTask, loading, error } = useTask(taskId);

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
