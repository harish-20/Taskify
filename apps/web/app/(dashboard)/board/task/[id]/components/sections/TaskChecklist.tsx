'use client';

import { motion } from 'framer-motion';
import { Check, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import { updateTask } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

interface TaskChecklistProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskChecklist: React.FC<TaskChecklistProps> = ({ task, onTaskUpdate }) => {
  const [checklist, setChecklist] = useState<Task['checklist']>(task.checklist || []);
  const [newItem, setNewItem] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setChecklist(task.checklist || []);
  }, [task.checklist]);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    const updatedChecklist = [
      ...checklist,
      { _id: crypto.randomUUID(), title: newItem.trim(), completed: false },
    ];
    try {
      setIsSaving(true);
      const response = await updateTask(task._id, { checklist: updatedChecklist });
      if (response.success && response.data) {
        setChecklist(updatedChecklist);
        setNewItem('');
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to add checklist item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleItem = async (index: number) => {
    const updatedChecklist = [...checklist];
    if (updatedChecklist[index]) {
      updatedChecklist[index].completed = !updatedChecklist[index].completed;

      try {
        setIsSaving(true);
        const response = await updateTask(task._id, { checklist: updatedChecklist });
        if (response.success && response.data) {
          setChecklist(updatedChecklist);
          onTaskUpdate(response.data);
        }
      } catch (error) {
        console.error('Failed to update checklist:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRemoveItem = async (index: number) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);

    try {
      setIsSaving(true);
      const response = await updateTask(task._id, { checklist: updatedChecklist });
      if (response.success && response.data) {
        setChecklist(updatedChecklist);
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to remove checklist item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;
  const progressLabel = `${Math.round(progress)}%`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">Checklist</h3>
          <p className="text-sm text-gray-500">Keep track of subtasks</p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-1.5">
          <span className="inline-flex rounded-xl bg-emerald-600 px-3 py-1 text-base font-semibold text-white">
            {completedCount}/{checklist.length}
          </span>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="h-3 flex-1 rounded-full bg-gray-100">
          <motion.div
            className="h-3 rounded-full bg-emerald-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', duration: 0.5 }}
          />
        </div>
        <span className="text-lg font-semibold text-emerald-600">{progressLabel}</span>
      </div>

      <div className="space-y-3">
        {checklist.map((item, index) => (
          <div
            key={item._id}
            className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 shadow-sm"
          >
            <button
              type="button"
              onClick={() => handleToggleItem(index)}
              disabled={isSaving}
              className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                item.completed
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-gray-300 bg-white text-transparent'
              }`}
              aria-label={item.completed ? 'Mark as pending' : 'Mark as done'}
            >
              <Check className="h-3.5 w-3.5" />
            </button>

            <span
              className={`flex-1 text-base ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}
            >
              {item.title}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {item.completed ? 'Done' : 'Pending'}
            </span>

            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              disabled={isSaving}
              aria-label="Remove checklist item"
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!newItem.trim() || isSaving}
            aria-label="Add checklist item"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleAddItem();
              }
            }}
            placeholder="Add new checklist item"
            disabled={isSaving}
            className="flex-1 border-none bg-transparent text-base text-gray-500 outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskChecklist;
