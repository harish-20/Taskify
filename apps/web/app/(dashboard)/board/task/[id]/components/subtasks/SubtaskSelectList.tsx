'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import SubtaskCandidateRow from './SubtaskCandidateRow';

import Spinner from '@/components/UI/Spinner';
import TextInput from '@/components/UI/TextInput';
import { addSubtaskToTask, getAvailableSubtasks } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

interface SubtaskSelectListProps {
  open: boolean;
  parentTaskId: string;
  existingSubTaskIds: string[];
  onSubtaskAdded: (task: Task) => void;
}

const SubtaskSelectList: React.FC<SubtaskSelectListProps> = ({
  open,
  parentTaskId,
  existingSubTaskIds,
  onSubtaskAdded,
}) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTaskId, setIsAddingTaskId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchSubTasks = async () => {
      if (!open) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await getAvailableSubtasks(parentTaskId);
        setAllTasks(response.data || []);
      } catch (error) {
        console.error('Failed to fetch tasks for subtask picker:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSubTasks();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const filteredTasks = useMemo(() => {
    const blockedIds = new Set(existingSubTaskIds);
    const normalizedQuery = query.trim().toLowerCase();

    return allTasks.filter((task) => {
      if (task._id === parentTaskId || blockedIds.has(task._id)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.ticketId.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [allTasks, existingSubTaskIds, parentTaskId, query]);

  const handleAddSubtask = async (task: Task) => {
    try {
      setIsAddingTaskId(task._id);
      const response = await addSubtaskToTask(parentTaskId, task._id);
      if (response.success && response.data) {
        onSubtaskAdded(response.data);
      }
    } catch (error) {
      console.error('Failed to add subtask:', error);
    } finally {
      setIsAddingTaskId(null);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <TextInput
          id="subtask-search"
          placeholder="Search tasks by title or ticket"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      <div className="mt-3 max-h-[18rem] overflow-auto rounded-lg border border-gray-100 bg-white pr-1">
        {isLoading ? (
          <div className="min-h-[17rem] flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="min-h-[17rem] flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
            No tasks available to add.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTasks.map((task) => (
              <SubtaskCandidateRow
                key={task._id}
                task={task}
                isAdding={isAddingTaskId === task._id}
                onAdd={handleAddSubtask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskSelectList;
